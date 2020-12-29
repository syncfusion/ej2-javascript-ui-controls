window.sf = window.sf || {};
var sfpager = (function (exports) {
'use strict';

/**
 * `NumericContainer` module handles rendering and refreshing numeric container.
 */
var NumericContainer = /** @class */ (function () {
    /**
     * Constructor for numericContainer module
     * @hidden
     */
    function NumericContainer(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * The function is used to render numericContainer
     * @hidden
     */
    NumericContainer.prototype.render = function () {
        this.pagerElement = this.pagerModule.element;
        this.renderNumericContainer();
        this.refreshNumericLinks();
        this.wireEvents();
    };
    /**
     * Refreshes the numeric container of Pager.
     */
    NumericContainer.prototype.refresh = function () {
        this.pagerModule.updateTotalPages();
        if (this.links.length) {
            this.updateLinksHtml();
        }
        this.updateStyles();
    };
    /**
     * The function is used to refresh refreshNumericLinks
     * @hidden
     */
    NumericContainer.prototype.refreshNumericLinks = function () {
        var link;
        var pagerObj = this.pagerModule;
        var div = pagerObj.element.querySelector('.e-numericcontainer');
        var frag = document.createDocumentFragment();
        div.innerHTML = '';
        for (var i = 1; i <= pagerObj.pageCount; i++) {
            link = sf.base.createElement('a', {
                className: 'e-link e-numericitem e-spacing e-pager-default',
                attrs: { role: 'link', tabindex: '-1', 'aria-label': 'Goto Page ' + i,
                    href: 'javascript:void(0);', name: 'Goto page' + i }
            });
            if (pagerObj.currentPage === i) {
                sf.base.classList(link, ['e-currentitem', 'e-active'], ['e-pager-default']);
            }
            frag.appendChild(link);
        }
        div.appendChild(frag);
        this.links = [].slice.call(div.childNodes);
    };
    /**
     * Binding events to the element while component creation
     * @hidden
     */
    NumericContainer.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.pagerElement, 'click', this.clickHandler, this);
    };
    /**
     * Unbinding events from the element while component destroy
     * @hidden
     */
    NumericContainer.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.pagerModule.element, 'click', this.clickHandler);
    };
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}
     * @hidden
     */
    NumericContainer.prototype.destroy = function () {
        this.unwireEvents();
    };
    NumericContainer.prototype.renderNumericContainer = function () {
        this.element = sf.base.createElement('div', {
            className: 'e-pagercontainer', attrs: { 'role': 'navigation' }
        });
        this.renderFirstNPrev(this.element);
        this.renderPrevPagerSet(this.element);
        this.element.appendChild(sf.base.createElement('div', { className: 'e-numericcontainer' }));
        this.renderNextPagerSet(this.element);
        this.renderNextNLast(this.element);
        this.pagerModule.element.appendChild(this.element);
    };
    NumericContainer.prototype.renderFirstNPrev = function (pagerContainer) {
        this.first = sf.base.createElement('div', {
            className: 'e-first e-icons e-icon-first',
            attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('FirstPageTooltip') :
                    this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('FirstPageTooltip') :
                    this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                tabindex: '-1'
            }
        });
        this.prev = sf.base.createElement('div', {
            className: 'e-prev e-icons e-icon-prev',
            attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PreviousPageTooltip') :
                    this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PreviousPageTooltip') :
                    this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                tabindex: '-1'
            }
        });
        sf.base.append([this.first, this.prev], pagerContainer);
    };
    NumericContainer.prototype.renderPrevPagerSet = function (pagerContainer) {
        var prevPager = sf.base.createElement('div');
        this.PP = sf.base.createElement('a', {
            className: 'e-link e-pp e-spacing', innerHTML: '...',
            attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PreviousPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('previousPagerTooltip'), role: 'link',
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PreviousPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                tabindex: '-1',
                name: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PreviousPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('previousPagerTooltip'),
                href: 'javascript:void(0);'
            }
        });
        prevPager.appendChild(this.PP);
        pagerContainer.appendChild(prevPager);
    };
    NumericContainer.prototype.renderNextPagerSet = function (pagerContainer) {
        var nextPager = sf.base.createElement('div');
        this.NP = sf.base.createElement('a', {
            className: 'e-link e-np e-spacing',
            innerHTML: '...', attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('NextPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('nextPagerTooltip'), role: 'link',
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('NextPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                tabindex: '-1',
                name: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('NextPagerTooltip') :
                    this.pagerModule.getLocalizedLabel('nextPagerTooltip'),
                href: 'javascript:void(0);'
            }
        });
        nextPager.appendChild(this.NP);
        pagerContainer.appendChild(nextPager);
    };
    NumericContainer.prototype.renderNextNLast = function (pagerContainer) {
        this.next = sf.base.createElement('div', {
            className: 'e-next e-icons e-icon-next',
            attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('NextPageTooltip') :
                    this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('NextPageTooltip') :
                    this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                tabindex: '-1'
            }
        });
        this.last = sf.base.createElement('div', {
            className: 'e-last e-icons e-icon-last',
            attrs: {
                title: sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('LastPageTooltip') :
                    this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                'aria-label': sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('LastPageTooltip') :
                    this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                tabindex: '-1'
            }
        });
        sf.base.append([this.next, this.last], pagerContainer);
    };
    NumericContainer.prototype.clickHandler = function (e) {
        var pagerObj = this.pagerModule;
        var target = e.target;
        pagerObj.previousPageNo = pagerObj.currentPage;
        if (!target.classList.contains('e-disable') && !sf.base.isNullOrUndefined(target.getAttribute('index'))) {
            pagerObj.currentPage = parseInt(target.getAttribute('index'), 10);
            pagerObj.dataBind();
        }
        return false;
    };
    NumericContainer.prototype.updateLinksHtml = function () {
        var pagerObj = this.pagerModule;
        var currentPageSet;
        var pageNo;
        pagerObj.currentPage = pagerObj.totalPages === 1 ? 1 : pagerObj.currentPage;
        if (pagerObj.currentPage > pagerObj.totalPages && pagerObj.totalPages) {
            pagerObj.currentPage = pagerObj.totalPages;
        }
        currentPageSet = parseInt((pagerObj.currentPage / pagerObj.pageCount).toString(), 10);
        if (pagerObj.currentPage % pagerObj.pageCount === 0 && currentPageSet > 0) {
            currentPageSet = currentPageSet - 1;
        }
        for (var i = 0; i < pagerObj.pageCount; i++) {
            pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
            if (pageNo <= pagerObj.totalPages) {
                this.links[i].style.display = '';
                this.links[i].setAttribute('index', pageNo.toString());
                this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                if (pagerObj.currentPage !== pageNo) {
                    this.links[i].classList.add('e-pager-default');
                }
                else {
                    this.links[i].classList.remove('e-pager-default');
                }
            }
            else {
                this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                this.links[i].style.display = 'none';
            }
            sf.base.classList(this.links[i], [], ['e-currentitem', 'e-active']);
        }
        this.first.setAttribute('index', '1');
        this.last.setAttribute('index', pagerObj.totalPages.toString());
        this.prev.setAttribute('index', (pagerObj.currentPage - 1).toString());
        this.next.setAttribute('index', (pagerObj.currentPage + 1).toString());
        this.pagerElement.querySelector('.e-mfirst').setAttribute('index', '1');
        this.pagerElement.querySelector('.e-mlast').setAttribute('index', pagerObj.totalPages.toString());
        this.pagerElement.querySelector('.e-mprev').setAttribute('index', (pagerObj.currentPage - 1).toString());
        this.pagerElement.querySelector('.e-mnext').setAttribute('index', (pagerObj.currentPage + 1).toString());
        this.PP.setAttribute('index', (parseInt(this.links[0].getAttribute('index'), 10) - pagerObj.pageCount).toString());
        this.NP.setAttribute('index', (parseInt(this.links[this.links.length - 1].getAttribute('index'), 10) + 1).toString());
    };
    NumericContainer.prototype.updateStyles = function () {
        this.updateFirstNPrevStyles();
        this.updatePrevPagerSetStyles();
        this.updateNextPagerSetStyles();
        this.updateNextNLastStyles();
        if (this.links.length) {
            sf.base.classList(this.links[(this.pagerModule.currentPage - 1) % this.pagerModule.pageCount], ['e-currentitem', 'e-active'], []);
        }
    };
    NumericContainer.prototype.updateFirstNPrevStyles = function () {
        var firstPage = ['e-firstpage', 'e-pager-default'];
        var firstPageDisabled = ['e-firstpagedisabled', 'e-disable'];
        var prevPage = ['e-prevpage', 'e-pager-default'];
        var prevPageDisabled = ['e-prevpagedisabled', 'e-disable'];
        if (this.pagerModule.totalPages > 0 && this.pagerModule.currentPage > 1) {
            sf.base.classList(this.prev, prevPage, prevPageDisabled);
            sf.base.classList(this.first, firstPage, firstPageDisabled);
            sf.base.classList(this.pagerElement.querySelector('.e-mfirst'), firstPage, firstPageDisabled);
            sf.base.classList(this.pagerElement.querySelector('.e-mprev'), prevPage, prevPageDisabled);
        }
        else {
            sf.base.classList(this.prev, prevPageDisabled, prevPage);
            sf.base.classList(this.first, firstPageDisabled, firstPage);
            sf.base.classList(this.pagerElement.querySelector('.e-mprev'), prevPageDisabled, prevPage);
            sf.base.classList(this.pagerElement.querySelector('.e-mfirst'), firstPageDisabled, firstPage);
        }
    };
    NumericContainer.prototype.updatePrevPagerSetStyles = function () {
        if (this.pagerModule.currentPage > this.pagerModule.pageCount) {
            sf.base.classList(this.PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
        }
        else {
            sf.base.classList(this.PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
        }
    };
    NumericContainer.prototype.updateNextPagerSetStyles = function () {
        var pagerObj = this.pagerModule;
        var firstPage = this.links[0].innerHTML.replace(pagerObj.customText, '');
        if (!firstPage.length || !this.links.length || (parseInt(firstPage, 10) + pagerObj.pageCount > pagerObj.totalPages)) {
            sf.base.classList(this.NP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
        }
        else {
            sf.base.classList(this.NP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
        }
    };
    NumericContainer.prototype.updateNextNLastStyles = function () {
        var lastPage = ['e-lastpage', 'e-pager-default'];
        var lastPageDisabled = ['e-lastpagedisabled', 'e-disable'];
        var nextPage = ['e-nextpage', 'e-pager-default'];
        var nextPageDisabled = ['e-nextpagedisabled', 'e-disable'];
        var pagerObj = this.pagerModule;
        if (pagerObj.currentPage === pagerObj.totalPages || pagerObj.totalRecordsCount === 0) {
            sf.base.classList(this.last, lastPageDisabled, lastPage);
            sf.base.classList(this.next, nextPageDisabled, nextPage);
            sf.base.classList(this.pagerElement.querySelector('.e-mlast'), lastPageDisabled, lastPage);
            sf.base.classList(this.pagerElement.querySelector('.e-mnext'), nextPageDisabled, nextPage);
        }
        else {
            sf.base.classList(this.last, lastPage, lastPageDisabled);
            sf.base.classList(this.next, nextPage, nextPageDisabled);
            sf.base.classList(this.pagerElement.querySelector('.e-mlast'), lastPage, lastPageDisabled);
            sf.base.classList(this.pagerElement.querySelector('.e-mnext'), nextPage, nextPageDisabled);
        }
    };
    return NumericContainer;
}());

/**
 * `PagerMessage` module is used to display pager information.
 */
var PagerMessage = /** @class */ (function () {
    /**
     * Constructor for externalMessage module
     * @hidden
     */
    function PagerMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * The function is used to render pager message
     * @hidden
     */
    PagerMessage.prototype.render = function () {
        var div = sf.base.createElement('div', { className: 'e-parentmsgbar', attrs: { 'aria-label': 'Pager Information' } });
        this.pageNoMsgElem = sf.base.createElement('span', { className: 'e-pagenomsg', styles: 'textalign:right' });
        this.pageCountMsgElem = sf.base.createElement('span', { className: 'e-pagecountmsg', styles: 'textalign:right' });
        sf.base.append([this.pageNoMsgElem, this.pageCountMsgElem], div);
        this.pagerModule.element.appendChild(div);
        this.refresh();
    };
    /**
     * Refreshes the pager information.
     */
    PagerMessage.prototype.refresh = function () {
        var pagerObj = this.pagerModule;
        if (sf.base.isBlazor()) {
            this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('CurrentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                    pagerObj.currentPage, pagerObj.totalPages || 0]) + ' ';
            this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('TotalItemsInfo'), [pagerObj.totalRecordsCount || 0]);
        }
        else {
            this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                    pagerObj.currentPage, pagerObj.totalPages || 0, pagerObj.totalRecordsCount || 0]) + ' ';
            this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel(pagerObj.totalRecordsCount <= 1 ? 'totalItemInfo' : 'totalItemsInfo'), [pagerObj.totalRecordsCount || 0, pagerObj.totalRecordsCount ? (pagerObj.pageSize * (pagerObj.currentPage - 1)) + 1 : 0,
                pagerObj.pageSize * pagerObj.currentPage > pagerObj.totalRecordsCount ? pagerObj.totalRecordsCount :
                    pagerObj.pageSize * pagerObj.currentPage]);
        }
        this.pageNoMsgElem.parentElement.setAttribute('aria-label', this.pageNoMsgElem.textContent + this.pageCountMsgElem.textContent);
    };
    /**
     * Hides the Pager information.
     */
    PagerMessage.prototype.hideMessage = function () {
        if (this.pageNoMsgElem) {
            this.pageNoMsgElem.style.display = 'none';
        }
        if (this.pageCountMsgElem) {
            this.pageCountMsgElem.style.display = 'none';
        }
    };
    /**
     * Shows the Pager information.
     */
    PagerMessage.prototype.showMessage = function () {
        if (!this.pageNoMsgElem) {
            this.render();
        }
        this.pageNoMsgElem.style.display = '';
        this.pageCountMsgElem.style.display = '';
    };
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}
     * @hidden
     */
    PagerMessage.prototype.destroy = function () {
        //destroy
    };
    PagerMessage.prototype.format = function (str, args) {
        var regx;
        for (var i = 0; i < args.length; i++) {
            regx = new RegExp('\\{' + (i) + '\\}', 'gm');
            str = str.replace(regx, args[i].toString());
        }
        return str;
    };
    return PagerMessage;
}());

/**
 * ValueFormatter class to globalize the value.
 * @hidden
 */
var ValueFormatter = /** @class */ (function () {
    function ValueFormatter(cultureName) {
        this.intl = new sf.base.Internationalization();
        if (!sf.base.isNullOrUndefined(cultureName)) {
            this.intl.culture = cultureName;
        }
    }
    ValueFormatter.prototype.getFormatFunction = function (format) {
        if (format.type) {
            if (sf.base.isBlazor()) {
                var isServerRendered = 'isServerRendered';
                format[isServerRendered] = true;
            }
            return this.intl.getDateFormat(format);
        }
        else {
            return this.intl.getNumberFormat(format);
        }
    };
    ValueFormatter.prototype.getParserFunction = function (format) {
        if (format.type) {
            if (sf.base.isBlazor()) {
                var isServerRendered = 'isServerRendered';
                format[isServerRendered] = true;
            }
            return this.intl.getDateParser(format);
        }
        else {
            return this.intl.getNumberParser(format);
        }
    };
    ValueFormatter.prototype.fromView = function (value, format, type) {
        if ((type === 'date' || type === 'datetime' || type === 'number') && (!sf.base.isNullOrUndefined(format))) {
            return format(value);
        }
        else {
            return value;
        }
    };
    ValueFormatter.prototype.toView = function (value, format) {
        var result = value;
        if (!sf.base.isNullOrUndefined(format) && !sf.base.isNullOrUndefined(value)) {
            result = format(value);
        }
        return result;
    };
    ValueFormatter.prototype.setCulture = function (cultureName) {
        if (!sf.base.isNullOrUndefined(cultureName)) {
            sf.base.setCulture(cultureName);
        }
    };
    return ValueFormatter;
}());

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents Grid `Column` model class.
 */
var Column = /** @class */ (function () {
    function Column(options, parent) {
        var _this = this;
        /**
         * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
         * @default true
         */
        this.disableHtmlEncode = true;
        /**
         * If `allowSorting` set to false, then it disables sorting option of a particular column.
         * By default all columns are sortable.
         * @default true
         */
        this.allowSorting = true;
        /**
         * If `allowResizing` is set to false, it disables resize option of a particular column.
         * By default all the columns can be resized.
         * @default true
         */
        this.allowResizing = true;
        /**
         * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
         * By default all columns are filterable.
         * @default true
         */
        this.allowFiltering = true;
        /**
         * If `allowGrouping` set to false, then it disables grouping of a particular column.
         * By default all columns are groupable.
         * @default true
         */
        this.allowGrouping = true;
        /**
         * If `allowReordering` set to false, then it disables reorder of a particular column.
         * By default all columns can be reorder.
         * @default true
         */
        this.allowReordering = true;
        /**
         * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
         * By default column menu will show for all columns
         * @default true
         */
        this.showColumnMenu = true;
        /**
         * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values.
         * @default true
         */
        this.enableGroupByFormat = false;
        /**
         * If `allowEditing` set to false, then it disables editing of a particular column.
         * By default all columns are editable.
         * @default true
         */
        this.allowEditing = true;
        /**
         *  It is used to customize the default filter options for a specific columns.
         * * type -  Specifies the filter type as menu or checkbox.
         * * ui - to render custom component for specific column it has following functions.
         * * ui.create – It is used for creating custom components.
         * * ui.read -  It is used for read the value from the component.
         * * ui.write - It is used to apply component model as dynamically.
         * {% codeBlock src="grid/filter-menu-api/index.ts" %}{% endcodeBlock %}
         *
         * > Check the [`Filter UI`](../../grid/filtering/#custom-component-in-filter-menu) for its customization.
         *  @default {}
         */
        this.filter = {};
        /**
         * If `showInColumnChooser` set to false, then hide the particular column in column chooser.
         *  By default all columns are displayed in column Chooser.
         * @default true
         */
        this.showInColumnChooser = true;
        /**
         * Defines the `IEditCell` object to customize default edit cell.
         * @default {}
         */
        this.edit = {};
        /**
         * If `allowSearching` set to false, then it disables Searching of a particular column.
         * By default all columns allow Searching.
         * @default true
         */
        this.allowSearching = true;
        /**
         * If `autoFit` set to true, then the particular column content width will be
         * adjusted based on its content in the initial rendering itself.
         * Setting this property as true is equivalent to calling `autoFitColumns` method in the `dataBound` event.
         * @default false
         */
        this.autoFit = false;
        this.sortDirection = 'Descending';
        /** @hidden */
        this.getEditTemplate = function () { return _this.editTemplateFn; };
        /** @hidden */
        this.getFilterTemplate = function () { return _this.filterTemplateFn; };
        sf.base.merge(this, options);
        this.parent = parent;
        if (this.type === 'none') {
            this.type = (sf.base.isBlazor() && !sf.base.isNullOrUndefined(this.template) && sf.base.isNullOrUndefined(this.field)) ? 'none' : null;
        }
        else if (this.type) {
            this.type = typeof (this.type) === 'string' ? this.type.toLowerCase() : undefined;
        }
        if (this.editType) {
            this.editType = this.editType.toLowerCase();
        }
        if (sf.base.isNullOrUndefined(this.uid)) {
            this.uid = getUid('grid-column');
        }
        var valueFormatter = new ValueFormatter();
        if (options.format && (options.format.skeleton || options.format.format)) {
            this.setFormatter(valueFormatter.getFormatFunction(sf.base.extend({}, options.format)));
            this.setParser(valueFormatter.getParserFunction(options.format));
        }
        this.toJSON = function () {
            var col = {};
            var skip = ['filter', 'dataSource', sf.base.isBlazor() ? ' ' : 'headerText', 'template', 'headerTemplate', 'edit',
                'editTemplate', 'filterTemplate', 'commandsTemplate', 'parent'];
            var keys = Object.keys(_this);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] === 'columns') {
                    col[keys[i]] = [];
                    for (var j = 0; j < _this[keys[i]].length; j++) {
                        col[keys[i]].push(_this[keys[i]][j].toJSON());
                    }
                }
                else if (skip.indexOf(keys[i]) < 0) {
                    col[keys[i]] = _this[keys[i]];
                }
            }
            return col;
        };
        if (!this.field) {
            this.allowFiltering = false;
            this.allowGrouping = false;
            this.allowSorting = false;
            if (this.columns) {
                this.allowResizing = this.columns.some(function (col) {
                    return col.allowResizing;
                });
            }
        }
        if (this.commands && !this.textAlign) {
            this.textAlign = 'Right';
        }
        if (this.template || this.commandsTemplate) {
            this.templateFn = templateCompiler(this.template || this.commandsTemplate);
        }
        if (this.headerTemplate) {
            this.headerTemplateFn = templateCompiler(this.headerTemplate);
        }
        if (!sf.base.isNullOrUndefined(this.filter) && this.filter.itemTemplate) {
            this.fltrTemplateFn = templateCompiler(this.filter.itemTemplate);
        }
        if (this.editTemplate) {
            this.editTemplateFn = templateCompiler(this.editTemplate);
        }
        if (this.filterTemplate) {
            this.filterTemplateFn = templateCompiler(this.filterTemplate);
        }
        if (this.isForeignColumn() &&
            (sf.base.isNullOrUndefined(this.editType) || this.editType === 'dropdownedit' || this.editType === 'defaultedit')) {
            this.editType = 'dropdownedit';
            this.edit.params = sf.base.extend({
                dataSource: this.dataSource,
                query: new sf.data.Query(), fields: { value: this.foreignKeyField || this.field, text: this.foreignKeyValue }
            }, this.edit.params);
        }
        if (this.sortComparer) {
            var a_1 = this.sortComparer;
            this.sortComparer = function comparer(x, y, xObj, yObj) {
                if (typeof a_1 === 'string') {
                    a_1 = getObject(a_1, window);
                }
                if (this.sortDirection === 'Descending') {
                    var z = x;
                    x = y;
                    y = z;
                    var obj = xObj;
                    xObj = yObj;
                    yObj = obj;
                }
                return a_1(x, y, xObj, yObj);
            };
        }
        if (!this.sortComparer && this.isForeignColumn()) {
            this.sortComparer = function (x, y) {
                x = getObject(_this.foreignKeyValue, getForeignData(_this, {}, x)[0]);
                y = getObject(_this.foreignKeyValue, getForeignData(_this, {}, y)[0]);
                return _this.sortDirection === 'Descending' ? sf.data.DataUtil.fnDescending(x, y) : sf.data.DataUtil.fnAscending(x, y);
            };
        }
    }
    /** @hidden */
    Column.prototype.getSortDirection = function () {
        return this.sortDirection;
    };
    /** @hidden */
    Column.prototype.setSortDirection = function (direction) {
        this.sortDirection = direction;
    };
    /** @hidden */
    Column.prototype.getFreezeTableName = function () {
        return this.freezeTable;
    };
    /** @hidden */
    Column.prototype.setProperties = function (column) {
        //Angular two way binding
        var keys = Object.keys(column);
        for (var i = 0; i < keys.length; i++) {
            this[keys[i]] = column[keys[i]];
            //Refresh the react columnTemplates on state change
            if (this.parent && this.parent.isReact && keys[i] === 'template') {
                this.parent.refreshReactColumnTemplateByUid(this.uid);
            }
        }
    };
    /**
     * @hidden
     * It defines the column is foreign key column or not.
     */
    Column.prototype.isForeignColumn = function () {
        return !!(this.dataSource && this.foreignKeyValue);
    };
    /** @hidden */
    Column.prototype.getFormatter = function () {
        return this.formatFn;
    };
    /** @hidden */
    Column.prototype.setFormatter = function (value) {
        this.formatFn = value;
    };
    /** @hidden */
    Column.prototype.getParser = function () {
        return this.parserFn;
    };
    /** @hidden */
    Column.prototype.setParser = function (value) {
        this.parserFn = value;
    };
    /** @hidden */
    Column.prototype.getColumnTemplate = function () {
        return this.templateFn;
    };
    /** @hidden */
    Column.prototype.getHeaderTemplate = function () {
        return this.headerTemplateFn;
    };
    /** @hidden */
    Column.prototype.getFilterItemTemplate = function () {
        return this.fltrTemplateFn;
    };
    /** @hidden */
    Column.prototype.getDomSetter = function () {
        return this.disableHtmlEncode ? 'textContent' : 'innerHTML';
    };
    return Column;
}());
/**
 * Define options for custom command buttons.
 */
var CommandColumnModel = /** @class */ (function () {
    function CommandColumnModel() {
    }
    __decorate$1([
        sf.base.Property()
    ], CommandColumnModel.prototype, "title", void 0);
    __decorate$1([
        sf.base.Property()
    ], CommandColumnModel.prototype, "type", void 0);
    __decorate$1([
        sf.base.Property()
    ], CommandColumnModel.prototype, "buttonOption", void 0);
    return CommandColumnModel;
}());

/** @hidden */

/** @hidden */

/** @hidden */
var load = 'load';
/** @hidden */
var rowDataBound = 'rowDataBound';
/** @hidden */
var queryCellInfo = 'queryCellInfo';
/** @hidden */
var headerCellInfo = 'headerCellInfo';
/** @hidden */
var actionBegin = 'actionBegin';
/** @hidden */
var actionComplete = 'actionComplete';
/** @hidden */
var actionFailure = 'actionFailure';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var rowSelecting = 'rowSelecting';
/** @hidden */
var rowSelected = 'rowSelected';
/** @hidden */
var rowDeselecting = 'rowDeselecting';
/** @hidden */
var rowDeselected = 'rowDeselected';
/** @hidden */
var cellSelecting = 'cellSelecting';
/** @hidden */
var cellSelected = 'cellSelected';
/** @hidden */
var cellDeselecting = 'cellDeselecting';
/** @hidden */
var cellDeselected = 'cellDeselected';
/** @hidden */
var columnSelecting = 'columnSelecting';
/** @hidden */
var columnSelected = 'columnSelected';
/** @hidden */
var columnDeselecting = 'columnDeselecting';
/** @hidden */
var columnDeselected = 'columnDeselected';
/** @hidden */
var columnDragStart = 'columnDragStart';
/** @hidden */
var columnDrag = 'columnDrag';
/** @hidden */
var columnDrop = 'columnDrop';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var beforePrint = 'beforePrint';
/** @hidden */
var printComplete = 'printComplete';
/** @hidden */
var detailDataBound = 'detailDataBound';
/** @hidden */

/** @hidden */
var batchAdd = 'batchAdd';
/** @hidden */
var batchCancel = 'batchCancel';
/** @hidden */
var batchDelete = 'batchDelete';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var recordDoubleClick = 'recordDoubleClick';
/** @hidden */
var recordClick = 'recordClick';
/** @hidden */
var beforeDataBound = 'beforeDataBound';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var resizeStop = 'resizeStop';
/** @hidden */
var checkBoxChange = 'checkBoxChange';
/** @hidden */
var beforeCopy = 'beforeCopy';
/** @hidden */
var beforePaste = 'beforePaste';
/** @hidden */
var beforeAutoFill = 'beforeAutoFill';
/** @hidden */
var filterChoiceRequest = 'filterchoicerequest';
/** @hidden */
var filterAfterOpen = 'filterafteropen';
/** @hidden */
var filterBeforeOpen = 'filterbeforeopen';
/** @hidden */
var filterSearchBegin = 'filtersearchbegin';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/**
 * Specifies grid internal events
 */
/** @hidden */
var initialLoad = 'initial-load';
/** @hidden */
var initialEnd = 'initial-end';
/** @hidden */
var dataReady = 'data-ready';
/** @hidden */
var contentReady = 'content-ready';
/** @hidden */
var uiUpdate = 'ui-update';
/** @hidden */
var onEmpty = 'on-empty';
/** @hidden */
var inBoundModelChanged = 'inbound-model-changed';
/** @hidden */
var modelChanged = 'model-changed';
/** @hidden */
var colGroupRefresh = 'colgroup-refresh';
/** @hidden */
var headerRefreshed = 'header-refreshed';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var searchComplete = 'searching-complete';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var groupComplete = 'grouping-complete';
/** @hidden */

/** @hidden */

/** @hidden */
var groupAggregates = 'group-aggregates';
/** @hidden */
var refreshFooterRenderer = 'refresh-footer-rendered';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var rowSelectionComplete = 'rowselected';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var cellSelectionComplete = 'cellselected';
/** @hidden */
var beforeCellFocused = 'beforecellfocused';
/** @hidden */
var cellFocused = 'cellfocused';
/** @hidden */
var keyPressed = 'key-pressed';
/** @hidden */
var click = 'click';
/** @hidden */
var destroy = 'destroy';
/** @hidden */
var columnVisibilityChanged = 'column-visible-changed';
/** @hidden */
var scroll = 'scroll';
/** @hidden */
var columnWidthChanged = 'column-width-changed';
/** @hidden */
var columnPositionChanged = 'column-position-changed';
/** @hidden */

/** @hidden */
var rowsAdded = 'rows-added';
/** @hidden */
var rowsRemoved = 'rows-removed';
/** @hidden */
var columnDragStop = 'column-drag-stop';
/** @hidden */
var headerDrop = 'header-drop';
/** @hidden */
var dataSourceModified = 'datasource-modified';
/** @hidden */
var refreshComplete = 'refresh-complete';
/** @hidden */

/** @hidden */
var dblclick = 'dblclick';
/** @hidden */
var toolbarRefresh = 'toolbar-refresh';
/** @hidden */
var bulkSave = 'bulk-save';
/** @hidden */
var autoCol = 'auto-col';
/** @hidden */
var tooltipDestroy = 'tooltip-destroy';
/** @hidden */
var updateData = 'update-data';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var preventBatch = 'prevent-batch';
/** @hidden */

/** @hidden */
var crudAction = 'crud-Action';
/** @hidden */
var addDeleteAction = 'add-delete-Action';
/** @hidden */

/** @hidden */
var doubleTap = 'double-tap';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var freezeRender = 'freezerender';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var filterDialogCreated = 'filterDialogCreated';
/** @hidden */
var filterMenuClose = 'filter-menu-close';
/** @hidden */
var initForeignKeyColumn = 'initForeignKeyColumn';
/** @hidden */
var getForeignKeyData = 'getForeignKeyData';
/** @hidden */
var generateQuery = 'generateQuery';
/** @hidden */
var showEmptyGrid = 'showEmptyGrid';
/** @hidden */
var foreignKeyData = 'foreignKeyData';
/** @hidden */

/** @hidden */
var dataStateChange = 'dataStateChange';
/** @hidden */
var dataSourceChanged = 'dataSourceChanged';
/** @hidden */
var rtlUpdated = 'rtl-updated';
/** @hidden */
var beforeFragAppend = 'beforeFragAppend';
/** @hidden */
var frozenHeight = 'frozenHeight';
/** @hidden */
var textWrapRefresh = 'textWrapRefresh';
/** @hidden */
var recordAdded = 'recordAdded';
/** @hidden */
var cancelBegin = 'cancel-Begin';
/** @hidden */
var editNextValCell = 'editNextValCell';
/** @hidden */
var hierarchyPrint = 'hierarchyprint';
/** @hidden */
var expandChildGrid = 'expandchildgrid';
/** @hidden */
var printGridInit = 'printGrid-Init';
/** @hidden */

/** @hidden */

/** @hidden */
var rowPositionChanged = 'row-position-changed';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var partialRefresh = 'partial-refresh';
/** @hidden */

/** @hidden */
var selectVirtualRow = 'select-virtual-Row';
/** @hidden */
var columnsPrepared = 'columns-prepared';
/** @hidden */
var cBoxFltrBegin = 'cbox-filter-begin';
/** @hidden */
var cBoxFltrComplete = 'cbox-filter-complete';
/** @hidden */
var fltrPrevent = 'filter-Prevent';
/** @hidden */

/** @hidden */

/** @hidden */
var filterCboxValue = 'filter-cbox-value';
/** @hidden */
var componentRendered = 'component-rendered';
/** @hidden */

/** @hidden */

/** @hidden */
var detailIndentCellInfo = 'detail-indentcell-info';
/** @hidden */

/** @hidden */
var virtaulCellFocus = 'virtaul-cell-focus';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var virtualScrollEdit = 'virtual-scroll-edit';
/** @hidden */

/** @hidden */
var editReset = 'edit-reset';
/** @hidden */

/** @hidden */
var getVirtualData = 'get-virtual-data';
/** @hidden */
var refreshInfiniteModeBlocks = 'refresh-infinite-mode-blocks';
/** @hidden */
var resetInfiniteBlocks = 'reset-infinite-blocks';
/** @hidden */
var infiniteScrollHandler = 'infinite-scroll-handler';
/** @hidden */
var infinitePageQuery = 'infinite-page-query';
/** @hidden */
var infiniteShowHide = 'infinite-show-hide';
/** @hidden */
var appendInfiniteContent = 'append-infinite-content';
/** @hidden */
var removeInfiniteRows = 'remove-infinite-rows';
/** @hidden */
var setInfiniteCache = 'set-infinite-cache';
/** @hidden */
var infiniteEditHandler = 'infinite-edit-handler';
/** @hidden */

/** @hidden */

/** @hidden */
var closeFilterDialog = 'close-filter-dialog';
/** @hidden */

/** @hidden */

/** @hidden */
var resetColumns = 'reset-columns';
/** @hidden */

/** @hidden */

/** @hidden */
var setGroupCache = 'group-cache';
/** @hidden */
var lazyLoadScrollHandler = 'lazy-load-scroll-handler';
/** @hidden */
var groupCollapse = 'group-collapse';
/** @hidden */
var beforeCheckboxRenderer = 'beforeCheckboxRenderer';
/** @hidden */
var refreshHandlers = 'refreshResizeHandlers';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var setFreezeSelection = 'set-freeze-selection';
/** @hidden */

/** @hidden */

/** @hidden */
var beforeRefreshOnDataChange = 'before-refresh-on-data-change';
/** @hidden */
var immutableBatchCancel = 'immutable-batch-cancel';
/** @hidden */

/** @hidden */
var checkScrollReset = 'check-scroll-reset';
/** @hidden */

/** @hidden */

/** @hidden */
var preventFrozenScrollRefresh = 'prevent-frozen-scroll-refresh';
/** @hidden */

/**
 * Defines types of Cell
 * @hidden
 */
var CellType;
(function (CellType) {
    /**  Defines CellType as Data */
    CellType[CellType["Data"] = 0] = "Data";
    /**  Defines CellType as Header */
    CellType[CellType["Header"] = 1] = "Header";
    /**  Defines CellType as Summary */
    CellType[CellType["Summary"] = 2] = "Summary";
    /**  Defines CellType as GroupSummary */
    CellType[CellType["GroupSummary"] = 3] = "GroupSummary";
    /**  Defines CellType as CaptionSummary */
    CellType[CellType["CaptionSummary"] = 4] = "CaptionSummary";
    /**  Defines CellType as Filter */
    CellType[CellType["Filter"] = 5] = "Filter";
    /**  Defines CellType as Indent */
    CellType[CellType["Indent"] = 6] = "Indent";
    /**  Defines CellType as GroupCaption */
    CellType[CellType["GroupCaption"] = 7] = "GroupCaption";
    /**  Defines CellType as GroupCaptionEmpty */
    CellType[CellType["GroupCaptionEmpty"] = 8] = "GroupCaptionEmpty";
    /**  Defines CellType as Expand */
    CellType[CellType["Expand"] = 9] = "Expand";
    /**  Defines CellType as HeaderIndent */
    CellType[CellType["HeaderIndent"] = 10] = "HeaderIndent";
    /**  Defines CellType as StackedHeader */
    CellType[CellType["StackedHeader"] = 11] = "StackedHeader";
    /**  Defines CellType as DetailHeader */
    CellType[CellType["DetailHeader"] = 12] = "DetailHeader";
    /**  Defines CellType as DetailExpand */
    CellType[CellType["DetailExpand"] = 13] = "DetailExpand";
    /**  Defines CellType as CommandColumn */
    CellType[CellType["CommandColumn"] = 14] = "CommandColumn";
    /**  Defines CellType as DetailFooterIntent */
    CellType[CellType["DetailFooterIntent"] = 15] = "DetailFooterIntent";
    /**  Defines CellType as RowDrag */
    CellType[CellType["RowDragIcon"] = 16] = "RowDragIcon";
    /**  Defines CellType as RowDragHeader */
    CellType[CellType["RowDragHIcon"] = 17] = "RowDragHIcon";
})(CellType || (CellType = {}));
/**
 * Defines types of Render
 * @hidden
 */
var RenderType;
(function (RenderType) {
    /**  Defines RenderType as Header */
    RenderType[RenderType["Header"] = 0] = "Header";
    /**  Defines RenderType as Content */
    RenderType[RenderType["Content"] = 1] = "Content";
    /**  Defines RenderType as Summary */
    RenderType[RenderType["Summary"] = 2] = "Summary";
})(RenderType || (RenderType = {}));
/**
 * Defines Predefined toolbar items.
 * @hidden
 */
var ToolbarItem;
(function (ToolbarItem) {
    ToolbarItem[ToolbarItem["Add"] = 0] = "Add";
    ToolbarItem[ToolbarItem["Edit"] = 1] = "Edit";
    ToolbarItem[ToolbarItem["Update"] = 2] = "Update";
    ToolbarItem[ToolbarItem["Delete"] = 3] = "Delete";
    ToolbarItem[ToolbarItem["Cancel"] = 4] = "Cancel";
    ToolbarItem[ToolbarItem["Print"] = 5] = "Print";
    ToolbarItem[ToolbarItem["Search"] = 6] = "Search";
    ToolbarItem[ToolbarItem["ColumnChooser"] = 7] = "ColumnChooser";
    ToolbarItem[ToolbarItem["PdfExport"] = 8] = "PdfExport";
    ToolbarItem[ToolbarItem["ExcelExport"] = 9] = "ExcelExport";
    ToolbarItem[ToolbarItem["CsvExport"] = 10] = "CsvExport";
    ToolbarItem[ToolbarItem["WordExport"] = 11] = "WordExport";
})(ToolbarItem || (ToolbarItem = {}));

/* tslint:disable-next-line:max-line-length */
/**
 * @hidden
 * `CheckBoxFilterBase` module is used to handle filtering action.
 */
var CheckBoxFilterBase = /** @class */ (function () {
    /**
     * Constructor for checkbox filtering module
     * @hidden
     */
    function CheckBoxFilterBase(parent) {
        this.existingPredicate = {};
        this.foreignKeyQuery = new sf.data.Query();
        this.filterState = true;
        this.values = {};
        this.renderEmpty = false;
        this.parent = parent;
        this.id = this.parent.element.id;
        this.valueFormatter = new ValueFormatter(this.parent.locale);
        this.cBoxTrue = sf.buttons.createCheckBox(this.parent.createElement, false, { checked: true, label: ' ' });
        this.cBoxFalse = sf.buttons.createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
        this.cBoxTrue.insertBefore(this.parent.createElement('input', {
            className: 'e-chk-hidden', attrs: { type: 'checkbox' }
        }), this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(this.parent.createElement('input', {
            className: 'e-chk-hidden', attrs: { 'type': 'checkbox' }
        }), this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            sf.base.addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
    }
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    CheckBoxFilterBase.prototype.destroy = function () {
        this.closeDialog();
    };
    CheckBoxFilterBase.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.dlg, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.dlg, 'keyup', this.keyupHandler, this);
        this.searchHandler = sf.base.debounce(this.searchBoxKeyUp, 200);
        sf.base.EventHandler.add(this.dlg.querySelector('.e-searchinput'), 'keyup', this.searchHandler, this);
    };
    CheckBoxFilterBase.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.dlg, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.dlg, 'keyup', this.keyupHandler);
        var elem = this.dlg.querySelector('.e-searchinput');
        if (elem) {
            sf.base.EventHandler.remove(elem, 'keyup', this.searchHandler);
        }
    };
    CheckBoxFilterBase.prototype.foreignKeyFilter = function (args, fColl, mPredicate) {
        var _this = this;
        var fPredicate = {};
        var filterCollection = [];
        var query = this.foreignKeyQuery.clone();
        this.options.column.dataSource.
            executeQuery(query.where(mPredicate)).then(function (e) {
            _this.options.column.columnData = e.result;
            _this.parent.notify(generateQuery, { predicate: fPredicate, column: _this.options.column });
            args.ejpredicate = fPredicate.predicate.predicates;
            var fpred = fPredicate.predicate.predicates;
            for (var i = 0; i < fpred.length; i++) {
                filterCollection.push({
                    field: fpred[i].field,
                    predicate: 'or',
                    matchCase: fpred[i].ignoreCase,
                    ignoreAccent: fpred[i].ignoreAccent,
                    operator: fpred[i].operator,
                    value: fpred[i].value,
                    type: _this.options.type
                });
            }
            args.filterCollection = filterCollection.length ? filterCollection :
                fColl.filter(function (col) { return col.field = _this.options.field; });
            _this.options.handler(args);
        });
    };
    CheckBoxFilterBase.prototype.foreignFilter = function (args, value) {
        var operator = this.options.isRemote ?
            (this.options.column.type === 'string' ? 'contains' : 'equal') : (this.options.column.type ? 'contains' : 'equal');
        var initalPredicate = new sf.data.Predicate(this.options.column.foreignKeyValue, operator, value, true, this.options.ignoreAccent);
        this.foreignKeyFilter(args, [args.filterCollection], initalPredicate);
    };
    CheckBoxFilterBase.prototype.searchBoxClick = function (e) {
        var target = e.target;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = '';
            this.refreshCheckboxes();
            this.updateSearchIcon();
            this.sInput.focus();
        }
    };
    CheckBoxFilterBase.prototype.searchBoxKeyUp = function (e) {
        this.refreshCheckboxes();
        this.updateSearchIcon();
    };
    CheckBoxFilterBase.prototype.updateSearchIcon = function () {
        if (this.sInput.value.length) {
            sf.base.classList(this.sIcon, ['e-chkcancel-icon'], ['e-search-icon']);
        }
        else {
            sf.base.classList(this.sIcon, ['e-search-icon'], ['e-chkcancel-icon']);
        }
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    CheckBoxFilterBase.prototype.getLocalizedLabel = function (key) {
        return this.localeObj.getConstant(key);
    };
    CheckBoxFilterBase.prototype.updateDataSource = function () {
        var dataSource = this.options.dataSource;
        var str = 'object';
        if (!(dataSource instanceof sf.data.DataManager)) {
            for (var i = 0; i < dataSource.length; i++) {
                if (typeof dataSource !== str) {
                    var obj = {};
                    obj[this.options.field] = dataSource[i];
                    dataSource[i] = obj;
                }
            }
        }
    };
    CheckBoxFilterBase.prototype.updateModel = function (options) {
        this.options = options;
        this.existingPredicate = options.actualPredicate || {};
        this.options.dataSource = options.dataSource;
        this.options.dataManager = options.dataManager ? options.dataManager : options.dataSource;
        this.updateDataSource();
        this.options.type = options.type;
        this.options.format = options.format || '';
        this.options.ignoreAccent = options.ignoreAccent || false;
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.query = options.query || new sf.data.Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.options.uid = options.column.uid;
        this.values = {};
        this.localeObj = options.localeObj;
        this.isFiltered = options.filteredColumns.length;
    };
    CheckBoxFilterBase.prototype.getAndSetChkElem = function (options) {
        this.dlg = this.parent.createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
            attrs: { uid: this.options.column.uid },
            className: 'e-checkboxfilter e-filter-popup'
        });
        this.sBox = this.parent.createElement('div', { className: 'e-searchcontainer' });
        if (!options.hideSearchbox) {
            this.sInput = this.parent.createElement('input', {
                id: this.id + '_SearchBox',
                className: 'e-searchinput'
            });
            this.sIcon = this.parent.createElement('span', {
                className: 'e-searchclear e-search-icon e-icons e-input-group-icon', attrs: {
                    type: 'text', title: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox = this.parent.createElement('span', { className: 'e-searchbox e-fields' });
            this.searchBox.appendChild(this.sInput);
            this.sBox.appendChild(this.searchBox);
            var inputargs = {
                element: this.sInput, floatLabelType: 'Never', properties: {
                    placeholder: this.getLocalizedLabel('Search')
                }
            };
            sf.inputs.Input.createInput(inputargs, this.parent.createElement);
            this.searchBox.querySelector('.e-input-group').appendChild(this.sIcon);
        }
        this.spinner = this.parent.createElement('div', { className: 'e-spinner' }); //for spinner
        this.cBox = this.parent.createElement('div', {
            id: this.id + this.options.type + '_CheckBoxList',
            className: 'e-checkboxlist e-fields'
        });
        this.spinner.appendChild(this.cBox);
        this.sBox.appendChild(this.spinner);
        return this.sBox;
    };
    CheckBoxFilterBase.prototype.showDialog = function (options) {
        var args = {
            requestType: filterBeforeOpen,
            columnName: this.options.field, columnType: this.options.type, cancel: false
        };
        if (!sf.base.isBlazor() || this.parent.isJsComponent) {
            var filterModel = 'filterModel';
            args[filterModel] = this;
        }
        this.parent.notify(cBoxFltrBegin, args);
        if (args.cancel) {
            return;
        }
        this.dialogObj = new sf.popups.Dialog({
            visible: false, content: this.sBox,
            close: this.closeDialog.bind(this),
            width: (!sf.base.isNullOrUndefined(parentsUntil(options.target, 'e-bigger')))
                || this.parent.element.classList.contains('e-device') ? 260 : 255,
            target: this.parent.element, animationSettings: { effect: 'None' },
            buttons: [{
                    click: this.btnClick.bind(this),
                    buttonModel: {
                        content: this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton'),
                        cssClass: 'e-primary', isPrimary: true
                    }
                },
                {
                    click: this.btnClick.bind(this),
                    buttonModel: { cssClass: 'e-flat', content: this.getLocalizedLabel(this.isExcel ? 'CancelButton' : 'ClearButton') }
                }],
            created: this.dialogCreated.bind(this),
            open: this.dialogOpen.bind(this)
        });
        var isStringTemplate = 'isStringTemplate';
        this.dialogObj[isStringTemplate] = true;
        this.dlg.setAttribute('aria-label', this.getLocalizedLabel('ExcelFilterDialogARIA'));
        this.parent.element.appendChild(this.dlg);
        this.dialogObj.appendTo(this.dlg);
        this.dialogObj.element.style.maxHeight = this.options.height + 'px';
        this.dialogObj.show();
        this.wireEvents();
        sf.popups.createSpinner({ target: this.spinner }, this.parent.createElement);
        sf.popups.showSpinner(this.spinner);
        this.getAllData();
    };
    CheckBoxFilterBase.prototype.dialogCreated = function (e) {
        if (!sf.base.Browser.isDevice) {
            getFilterMenuPostion(this.options.target, this.dialogObj, this.parent);
        }
        else {
            this.dialogObj.position = { X: 'center', Y: 'center' };
        }
        this.parent.notify(filterDialogCreated, e);
    };
    CheckBoxFilterBase.prototype.openDialog = function (options) {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
    };
    CheckBoxFilterBase.prototype.closeDialog = function () {
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            var filterTemplateCol = this.options.columns.filter(function (col) { return col.getFilterItemTemplate(); });
            // tslint:disable-next-line:no-any
            var registeredTemplate = this.parent.registeredTemplate;
            if (filterTemplateCol.length && !sf.base.isNullOrUndefined(registeredTemplate) && registeredTemplate.filterItemTemplate) {
                this.parent.destroyTemplate(['filterItemTemplate']);
            }
            if (this.parent.isReact) {
                this.parent.destroyTemplate(['filterItemTemplate']);
                this.parent.renderTemplates();
            }
            this.parent.notify(filterMenuClose, { field: this.options.field });
            this.dialogObj.destroy();
            this.unWireEvents();
            sf.base.remove(this.dlg);
            this.dlg = null;
        }
    };
    CheckBoxFilterBase.prototype.clearFilter = function () {
        /* tslint:disable-next-line:max-line-length */
        var args = { instance: this, handler: this.clearFilter, cancel: false };
        this.parent.notify(fltrPrevent, args);
        if (args.cancel) {
            return;
        }
        this.options.handler({ action: 'clear-filter', field: this.options.field });
    };
    CheckBoxFilterBase.prototype.btnClick = function (e) {
        if (this.filterState) {
            if (e.target.tagName.toLowerCase() === 'input' && e.target.classList.contains('e-searchinput')) {
                var value = e.target.value;
                if (this.options.column.type === 'boolean') {
                    if (value !== '' &&
                        this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        value = true;
                    }
                    else if (value !== '' &&
                        this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                        value = false;
                    }
                }
                var args = {
                    action: 'filtering', filterCollection: {
                        field: this.options.field,
                        operator: this.options.isRemote ?
                            (this.options.column.type === 'string' ? 'contains' : 'equal') :
                            (this.options.column.type === 'date' || this.options.column.type === 'datetime' ||
                                this.options.column.type === 'boolean' ? 'equal' : 'contains'),
                        value: value, matchCase: false, type: this.options.column.type
                    },
                    field: this.options.field
                };
                value !== undefined && value !== null && value !== '' ? this.isForeignColumn(this.options.column) ?
                    this.foreignFilter(args, value) : this.options.handler(args) : this.closeDialog();
            }
            else {
                if (e.keyCode === 13) {
                    this.fltrBtnHandler();
                }
                else {
                    var text = e.target.firstChild.textContent.toLowerCase();
                    if (this.getLocalizedLabel(this.isExcel ? 'OKButton' : 'FilterButton').toLowerCase() === text) {
                        this.fltrBtnHandler();
                    }
                    else if (this.getLocalizedLabel('ClearButton').toLowerCase() === text) {
                        this.clearFilter();
                    }
                }
            }
            this.closeDialog();
        }
        else if (!(e.target.tagName.toLowerCase() === 'input')) {
            this.clearFilter();
            this.closeDialog();
        }
    };
    CheckBoxFilterBase.prototype.fltrBtnHandler = function () {
        var checked = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall)'));
        var check = checked;
        var optr = 'equal';
        var searchInput = this.searchBox.querySelector('.e-searchinput');
        var caseSen = this.options.allowCaseSensitive;
        var defaults = {
            field: this.options.field, predicate: 'or', uid: this.options.uid,
            operator: optr, type: this.options.type, matchCase: caseSen, ignoreAccent: this.options.ignoreAccent
        };
        var isNotEqual = this.itemsCnt !== checked.length && this.itemsCnt - checked.length < checked.length;
        if (isNotEqual && searchInput.value === '') {
            optr = 'notequal';
            checked = [].slice.call(this.cBox.querySelectorAll('.e-uncheck:not(.e-selectall)'));
            defaults.predicate = 'and';
            defaults.operator = 'notequal';
        }
        var value;
        var val;
        var length;
        var fObj;
        var coll = [];
        if (checked.length !== this.itemsCnt || (searchInput.value && searchInput.value !== '')) {
            for (var i = 0; i < checked.length; i++) {
                value = this.values[parentsUntil(checked[i], 'e-ftrchk').getAttribute('uid')];
                fObj = sf.base.extend({}, { value: value }, defaults);
                if (value && !value.toString().length) {
                    fObj.operator = isNotEqual ? 'notequal' : 'equal';
                }
                if (value === '' || sf.base.isNullOrUndefined(value)) {
                    coll = coll.concat(CheckBoxFilterBase.generateNullValuePredicates(defaults));
                }
                else {
                    coll.push(fObj);
                }
                var args = {
                    instance: this, handler: this.fltrBtnHandler, arg1: fObj.field, arg2: fObj.predicate, arg3: fObj.operator,
                    arg4: fObj.matchCase, arg5: fObj.ignoreAccent, arg6: fObj.value, cancel: false
                };
                this.parent.notify(fltrPrevent, args);
                if (args.cancel) {
                    return;
                }
            }
            if (this.options.type === 'date' || this.options.type === 'datetime') {
                length = check.length - 1;
                val = this.values[parentsUntil(check[length], 'e-ftrchk').getAttribute('uid')];
                if (sf.base.isNullOrUndefined(val) && isNotEqual) {
                    coll.push({
                        field: defaults.field, matchCase: defaults.matchCase, operator: 'equal',
                        predicate: 'and', value: null
                    });
                }
            }
            this.initiateFilter(coll);
        }
        else {
            this.clearFilter();
        }
    };
    /** @hidden */
    CheckBoxFilterBase.generateNullValuePredicates = function (defaults) {
        var coll = [];
        if (defaults.type === 'string') {
            coll.push({
                field: defaults.field, ignoreAccent: defaults.ignoreAccent, matchCase: defaults.matchCase,
                operator: defaults.operator, predicate: defaults.predicate, value: ''
            });
        }
        coll.push({
            field: defaults.field,
            matchCase: defaults.matchCase, operator: defaults.operator, predicate: defaults.predicate, value: null
        });
        coll.push({
            field: defaults.field, matchCase: defaults.matchCase, operator: defaults.operator,
            predicate: defaults.predicate, value: undefined
        });
        return coll;
    };
    CheckBoxFilterBase.prototype.initiateFilter = function (fColl) {
        var firstVal = fColl[0];
        var predicate;
        if (!sf.base.isNullOrUndefined(firstVal)) {
            predicate = firstVal.ejpredicate ? firstVal.ejpredicate :
                new sf.data.Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchCase, firstVal.ignoreAccent);
            for (var j = 1; j < fColl.length; j++) {
                predicate = fColl[j].ejpredicate !== undefined ?
                    predicate[fColl[j].predicate](fColl[j].ejpredicate) :
                    predicate[fColl[j].predicate](fColl[j].field, fColl[j].operator, fColl[j].value, !fColl[j].matchCase, fColl[j].ignoreAccent);
            }
            var args = {
                action: 'filtering', filterCollection: fColl, field: this.options.field,
                ejpredicate: sf.data.Predicate.or(predicate)
            };
            this.options.handler(args);
        }
    };
    CheckBoxFilterBase.prototype.isForeignColumn = function (col) {
        return col.isForeignColumn ? col.isForeignColumn() : false;
    };
    CheckBoxFilterBase.prototype.refreshCheckboxes = function () {
        var _this = this;
        var val = this.sInput.value;
        var column = this.options.column;
        var query = this.isForeignColumn(column) ? this.foreignKeyQuery.clone() : this.options.query.clone();
        var foreignQuery = this.options.query.clone();
        var pred = query.queries.filter(function (e) { return e && e.fn === 'onWhere'; })[0];
        query.queries = [];
        foreignQuery.queries = [];
        var parsed = (this.options.type !== 'string' && parseFloat(val)) ? parseFloat(val) : val;
        var operator = this.options.isRemote ?
            (this.options.type === 'string' ? 'contains' : 'equal') : (this.options.type ? 'contains' : 'equal');
        var matchCase = true;
        var ignoreAccent = this.options.ignoreAccent;
        var field = this.isForeignColumn(column) ? column.foreignKeyValue : column.field;
        parsed = (parsed === '' || parsed === undefined) ? undefined : parsed;
        var predicte;
        var moduleName = this.options.dataManager.adaptor.getModuleName;
        if (this.options.type === 'boolean') {
            if (parsed !== undefined &&
                this.getLocalizedLabel('FilterTrue').toLowerCase().indexOf(parsed.toLowerCase()) !== -1 && moduleName) {
                parsed = (moduleName() === 'ODataAdaptor' || 'ODataV4Adaptor') ? true : 'true';
            }
            else if (parsed !== undefined &&
                this.getLocalizedLabel('FilterFalse').toLowerCase().indexOf(parsed.toLowerCase()) !== -1 && moduleName) {
                parsed = (moduleName() === 'ODataAdaptor' || 'ODataV4Adaptor') ? false : 'false';
            }
            operator = 'equal';
        }
        if (this.options.type === 'date' || this.options.type === 'datetime') {
            parsed = this.valueFormatter.fromView(val, this.options.parserFn, this.options.type);
        }
        this.addDistinct(query);
        /* tslint:disable-next-line:max-line-length */
        var args = {
            requestType: filterSearchBegin,
            filterModel: this, columnName: field, column: column,
            operator: operator, matchCase: matchCase, ignoreAccent: ignoreAccent, filterChoiceCount: null,
            query: query, value: parsed
        };
        if (sf.base.isBlazor() && !this.parent.isJsComponent) {
            var filterModel = 'filterModel';
            args[filterModel] = {};
        }
        this.parent.trigger(actionBegin, args, function (filterargs) {
            filterargs.operator = (sf.base.isBlazor() && filterargs.excelSearchOperator !== 'none') ?
                filterargs.excelSearchOperator : filterargs.operator;
            predicte = new sf.data.Predicate(field, filterargs.operator, parsed, filterargs.matchCase, filterargs.ignoreAccent);
            if (_this.options.type === 'date' || _this.options.type === 'datetime') {
                operator = 'equal';
                if (sf.base.isNullOrUndefined(parsed) && val.length) {
                    return;
                }
                var filterObj = {
                    field: field, operator: operator, value: parsed, matchCase: matchCase,
                    ignoreAccent: ignoreAccent
                };
                predicte = getDatePredicate(filterObj, _this.options.type);
            }
            if (val.length) {
                predicte = !sf.base.isNullOrUndefined(pred) ? predicte.and(pred.e) : predicte;
                query.where(predicte);
            }
            else if (!sf.base.isNullOrUndefined(pred)) {
                query.where(pred.e);
            }
            filterargs.filterChoiceCount = !sf.base.isNullOrUndefined(filterargs.filterChoiceCount) ? filterargs.filterChoiceCount : 1000;
            var fPredicate = {};
            sf.popups.showSpinner(_this.spinner);
            _this.renderEmpty = false;
            if (_this.isForeignColumn(column) && val.length) {
                var colData = ('result' in column.dataSource) ? new sf.data.DataManager(column.dataSource.result) :
                    column.dataSource;
                // tslint:disable-next-line:no-any
                colData.executeQuery(query).then(function (e) {
                    var columnData = _this.options.column.columnData;
                    _this.options.column.columnData = e.result;
                    _this.parent.notify(generateQuery, { predicate: fPredicate, column: column });
                    if (fPredicate.predicate.predicates.length) {
                        foreignQuery.where(fPredicate.predicate);
                    }
                    else {
                        _this.renderEmpty = true;
                    }
                    _this.options.column.columnData = columnData;
                    foreignQuery.take(filterargs.filterChoiceCount);
                    _this.search(filterargs, foreignQuery);
                });
            }
            else {
                query.take(filterargs.filterChoiceCount);
                _this.search(filterargs, query);
            }
        });
    };
    CheckBoxFilterBase.prototype.search = function (args, query) {
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.filterEvent(args, query);
        }
        else {
            this.processSearch(query);
        }
    };
    CheckBoxFilterBase.prototype.getPredicateFromCols = function (columns) {
        var predicates = CheckBoxFilterBase.getPredicate(columns);
        var predicateList = [];
        var fPredicate = {};
        var isGrid = this.parent.getForeignKeyColumns !== undefined;
        var foreignColumn = isGrid ? this.parent.getForeignKeyColumns() : [];
        for (var _i = 0, _a = Object.keys(predicates); _i < _a.length; _i++) {
            var prop = _a[_i];
            var col = void 0;
            if (isGrid && this.parent.getColumnByField(prop).isForeignColumn()) {
                col = getColumnByForeignKeyValue(prop, foreignColumn);
            }
            if (col) {
                this.parent.notify(generateQuery, { predicate: fPredicate, column: col });
                if (fPredicate.predicate.predicates.length) {
                    predicateList.push(sf.data.Predicate.or(fPredicate.predicate.predicates));
                }
            }
            else {
                predicateList.push(predicates[prop]);
            }
        }
        return predicateList.length && sf.data.Predicate.and(predicateList);
    };
    CheckBoxFilterBase.prototype.getQuery = function () {
        return this.parent.getQuery ? this.parent.getQuery().clone() : new sf.data.Query();
    };
    CheckBoxFilterBase.prototype.getAllData = function () {
        var _this = this;
        var query = this.getQuery();
        query.requiresCount(); //consider take query
        this.addDistinct(query);
        var args = {
            requestType: filterChoiceRequest, query: query, filterChoiceCount: null
        };
        if (!sf.base.isBlazor() || this.parent.isJsComponent) {
            var filterModel = 'filterModel';
            args[filterModel] = this;
        }
        this.parent.trigger(actionBegin, args, function (args) {
            args.filterChoiceCount = !sf.base.isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
            query.take(args.filterChoiceCount);
            if (_this.parent.dataSource && 'result' in _this.parent.dataSource) {
                _this.filterEvent(args, query);
            }
            else {
                _this.processDataOperation(query, true);
            }
        });
    };
    CheckBoxFilterBase.prototype.addDistinct = function (query) {
        var filteredColumn = sf.data.DataUtil.distinct(this.options.filteredColumns, 'field');
        if (filteredColumn.indexOf(this.options.column.field) <= -1) {
            filteredColumn = filteredColumn.concat(this.options.column.field);
        }
        query.distinct(filteredColumn);
        return query;
    };
    CheckBoxFilterBase.prototype.filterEvent = function (args, query) {
        var _this = this;
        var defObj = eventPromise(args, query);
        this.parent.trigger(dataStateChange, defObj.state);
        var def = defObj.deffered;
        def.promise.then(function (e) {
            _this.dataSuccess(e);
        });
    };
    CheckBoxFilterBase.prototype.processDataOperation = function (query, isInitial) {
        var _this = this;
        this.options.dataSource = this.options.dataSource instanceof sf.data.DataManager ?
            this.options.dataSource : new sf.data.DataManager(this.options.dataSource);
        var allPromise = [];
        var runArray = [];
        if (this.isForeignColumn(this.options.column) && isInitial) {
            var colData = ('result' in this.options.column.dataSource) ?
                new sf.data.DataManager(this.options.column.dataSource.result) :
                this.options.column.dataSource;
            this.foreignKeyQuery.params = query.params;
            allPromise.push(colData.executeQuery(this.foreignKeyQuery));
            runArray.push(function (data) { return _this.foreignKeyData = data; });
        }
        allPromise.push(this.options.dataSource.executeQuery(query));
        runArray.push(this.dataSuccess.bind(this));
        var i = 0;
        Promise.all(allPromise).then(function (e) {
            for (var j = 0; j < e.length; j++) {
                runArray[i++](e[j].result);
            }
        });
    };
    CheckBoxFilterBase.prototype.dataSuccess = function (e) {
        this.fullData = e;
        var args1 = { dataSource: this.fullData, executeQuery: true, field: this.options.field };
        this.parent.notify(beforeCheckboxRenderer, args1);
        if (args1.executeQuery) {
            var query = new sf.data.Query();
            if (this.parent.searchSettings && this.parent.searchSettings.key.length) {
                var sSettings = this.parent.searchSettings;
                var fields = sSettings.fields.length ? sSettings.fields : this.options.columns.map(function (f) { return f.field; });
                /* tslint:disable-next-line:max-line-length */
                query.search(sSettings.key, fields, sSettings.operator, sSettings.ignoreCase, sSettings.ignoreAccent);
            }
            if ((this.options.filteredColumns.length)) {
                var cols = [];
                for (var i = 0; i < this.options.filteredColumns.length; i++) {
                    var filterColumn = this.options.filteredColumns[i];
                    if (this.options.uid) {
                        filterColumn.uid = filterColumn.uid || this.parent.getColumnByField(filterColumn.field).uid;
                        if (filterColumn.uid !== this.options.uid) {
                            cols.push(this.options.filteredColumns[i]);
                        }
                    }
                    else {
                        if (filterColumn.field !== this.options.field) {
                            cols.push(this.options.filteredColumns[i]);
                        }
                    }
                }
                var predicate = this.getPredicateFromCols(cols);
                if (predicate) {
                    query.where(predicate);
                }
            }
            // query.select(this.options.field);
            var result = new sf.data.DataManager(args1.dataSource).executeLocal(query);
            var col = this.options.column;
            this.filteredData = CheckBoxFilterBase.getDistinct(result, this.options.field, col, this.foreignKeyData).records || [];
        }
        var data = args1.executeQuery ? this.filteredData : args1.dataSource;
        this.processDataSource(null, true, data);
        this.sInput.focus();
        var args = {
            requestType: filterAfterOpen,
            columnName: this.options.field, columnType: this.options.type
        };
        if (!sf.base.isBlazor() || this.parent.isJsComponent) {
            var filterModel = 'filterModel';
            args[filterModel] = this;
        }
        this.parent.notify(cBoxFltrComplete, args);
    };
    CheckBoxFilterBase.prototype.processDataSource = function (query, isInitial, dataSource) {
        sf.popups.showSpinner(this.spinner);
        // query = query ? query : this.options.query.clone();
        // query.requiresCount();
        // let result: Object = new DataManager(dataSource as JSON[]).executeLocal(query);
        // let res: { result: Object[] } = result as { result: Object[] };
        this.updateResult();
        this.createFilterItems(dataSource, isInitial);
    };
    CheckBoxFilterBase.prototype.processSearch = function (query) {
        this.processDataOperation(query);
    };
    CheckBoxFilterBase.prototype.updateResult = function () {
        this.result = {};
        var predicate = this.getPredicateFromCols(this.options.filteredColumns);
        var query = new sf.data.Query();
        if (predicate) {
            query.where(predicate);
        }
        var result = new sf.data.DataManager(this.fullData).executeLocal(query);
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var res = result_1[_i];
            this.result[getObject(this.options.field, res)] = true;
        }
    };
    CheckBoxFilterBase.prototype.clickHandler = function (e) {
        var target = e.target;
        var elem = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem) {
            var selectAll$$1 = elem.querySelector('.e-selectall');
            if (selectAll$$1) {
                this.updateAllCBoxes(!selectAll$$1.classList.contains('e-check'));
            }
            else {
                toogleCheckbox(elem.parentElement);
            }
            this.updateIndeterminatenBtn();
            elem.querySelector('.e-chk-hidden').focus();
        }
        this.setFocus(parentsUntil(elem, 'e-ftrchk'));
    };
    CheckBoxFilterBase.prototype.keyupHandler = function (e) {
        this.setFocus(parentsUntil(e.target, 'e-ftrchk'));
    };
    CheckBoxFilterBase.prototype.setFocus = function (elem) {
        var prevElem = this.dlg.querySelector('.e-chkfocus');
        if (prevElem) {
            prevElem.classList.remove('e-chkfocus');
        }
        if (elem) {
            elem.classList.add('e-chkfocus');
        }
    };
    CheckBoxFilterBase.prototype.updateAllCBoxes = function (checked) {
        var cBoxes = [].slice.call(this.cBox.querySelectorAll('.e-frame'));
        for (var _i = 0, cBoxes_1 = cBoxes; _i < cBoxes_1.length; _i++) {
            var cBox = cBoxes_1[_i];
            removeAddCboxClasses(cBox, checked);
            setChecked(cBox.previousSibling, checked);
        }
    };
    CheckBoxFilterBase.prototype.dialogOpen = function () {
        if (this.parent.element.classList.contains('e-device')) {
            this.dialogObj.element.querySelector('.e-input-group').classList.remove('e-input-focus');
            this.dialogObj.element.querySelector('.e-btn').focus();
        }
    };
    CheckBoxFilterBase.prototype.createCheckbox = function (value, checked, data) {
        var elem = checked ? this.cBoxTrue.cloneNode(true) :
            this.cBoxFalse.cloneNode(true);
        setChecked(elem.querySelector('input'), checked);
        var label = elem.querySelector('.e-label');
        var dummyData = extendObjWithFn({}, data, { column: this.options.column, parent: this.parent });
        label.innerHTML = !sf.base.isNullOrUndefined(value) && value.toString().length ? value :
            this.getLocalizedLabel('Blanks');
        sf.base.addClass([label], ['e-checkboxfiltertext']);
        if (this.options.template && data[this.options.column.field] !== this.getLocalizedLabel('SelectAll')) {
            label.innerHTML = '';
            var isReactCompiler = this.parent.isReact && this.options.column.filter
                && typeof (this.options.column.filter.itemTemplate) !== 'string';
            if (isReactCompiler) {
                this.options.template(dummyData, this.parent, 'filterItemTemplate', null, null, null, label);
                this.parent.renderTemplates();
            }
            else {
                appendChildren(label, this.options.template(dummyData, this.parent, 'filterItemTemplate'));
            }
        }
        return elem;
    };
    CheckBoxFilterBase.prototype.updateIndeterminatenBtn = function () {
        var cnt = this.cBox.children.length - 1;
        var className = [];
        var elem = this.cBox.querySelector('.e-selectall');
        var selected = this.cBox.querySelectorAll('.e-check:not(.e-selectall)').length;
        var btn = this.dialogObj.btnObj[0];
        btn.disabled = false;
        var input = elem.previousSibling;
        setChecked(input, false);
        input.indeterminate = false;
        if (cnt === selected) {
            className = ['e-check'];
            setChecked(input, true);
        }
        else if (selected) {
            className = ['e-stop'];
            input.indeterminate = true;
        }
        else {
            className = ['e-uncheck'];
            btn.disabled = true;
        }
        this.filterState = !btn.disabled;
        btn.dataBind();
        sf.base.removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        sf.base.addClass([elem], className);
    };
    CheckBoxFilterBase.prototype.createFilterItems = function (data, isInitial) {
        var _a;
        var cBoxes = this.parent.createElement('div');
        var btn = this.dialogObj.btnObj[0];
        var nullCounter = -1;
        for (var i = 0; i < data.length; i++) {
            var val = sf.base.getValue('ejValue', data[i]);
            if (val === '' || sf.base.isNullOrUndefined(val)) {
                nullCounter = nullCounter + 1;
            }
        }
        this.itemsCnt = nullCounter !== -1 ? data.length - nullCounter : data.length;
        if (data.length && !this.renderEmpty) {
            var selectAllValue = this.getLocalizedLabel('SelectAll');
            var checkBox = this.createCheckbox(selectAllValue, false, (_a = {}, _a[this.options.field] = selectAllValue, _a));
            var selectAll$$1 = createCboxWithWrap(getUid('cbox'), checkBox, 'e-ftrchk');
            selectAll$$1.querySelector('.e-frame').classList.add('e-selectall');
            cBoxes.appendChild(selectAll$$1);
            var predicate = new sf.data.Predicate('field', 'equal', this.options.field);
            if (this.options.foreignKeyValue) {
                predicate = predicate.or('field', 'equal', this.options.foreignKeyValue);
            }
            var isColFiltered = new sf.data.DataManager(this.options.filteredColumns).executeLocal(new sf.data.Query().where(predicate)).length;
            var isRndere = void 0;
            for (var i = 0; i < data.length; i++) {
                var uid = getUid('cbox');
                this.values[uid] = sf.base.getValue('ejValue', data[i]);
                var value = sf.base.getValue(this.options.field, data[i]);
                if (this.options.formatFn) {
                    value = this.valueFormatter.toView(value, this.options.formatFn);
                }
                var args_1 = { value: value, column: this.options.column, data: data[i] };
                this.parent.notify(filterCboxValue, args_1);
                value = args_1.value;
                if ((value === '' || sf.base.isNullOrUndefined(value))) {
                    if (isRndere) {
                        continue;
                    }
                    isRndere = true;
                }
                var checkbox = this.createCheckbox(value, this.getCheckedState(isColFiltered, this.values[uid]), sf.base.getValue('dataObj', data[i]));
                cBoxes.appendChild(createCboxWithWrap(uid, checkbox, 'e-ftrchk'));
            }
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            this.updateIndeterminatenBtn();
            btn.disabled = false;
        }
        else {
            cBoxes.appendChild(this.parent.createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = '';
            appendChildren(this.cBox, [].slice.call(cBoxes.children));
            btn.disabled = true;
        }
        this.filterState = !btn.disabled;
        btn.dataBind();
        var args = { requestType: filterChoiceRequest, dataSource: this.renderEmpty ||
                (sf.base.isBlazor() && this.parent.isServerRendered) ? [] : data };
        if (!sf.base.isBlazor() || this.parent.isJsComponent) {
            var filterModel = 'filterModel';
            args[filterModel] = this;
        }
        this.parent.notify(cBoxFltrComplete, args);
        sf.popups.hideSpinner(this.spinner);
    };
    CheckBoxFilterBase.prototype.getCheckedState = function (isColFiltered, value) {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        }
        else {
            return this.result[value];
        }
    };
    CheckBoxFilterBase.getDistinct = function (json, field, column, foreignKeyData$$1) {
        var len = json.length;
        var result = [];
        var value;
        var ejValue = 'ejValue';
        var lookup = {};
        var isForeignKey = column && column.isForeignColumn ? column.isForeignColumn() : false;
        while (len--) {
            value = json[len];
            value = getObject(field, value); //local remote diff, check with mdu   
            if (!(value in lookup)) {
                var obj = {};
                obj[ejValue] = value;
                lookup[value] = true;
                if (isForeignKey) {
                    var foreignDataObj = getForeignData(column, {}, value, foreignKeyData$$1)[0];
                    sf.base.setValue(foreignKeyData, foreignDataObj, json[len]);
                    value = sf.base.getValue(column.foreignKeyValue, foreignDataObj);
                }
                sf.base.setValue(field, sf.base.isNullOrUndefined(value) ? null : value, obj);
                sf.base.setValue('dataObj', json[len], obj);
                result.push(obj);
            }
        }
        return sf.data.DataUtil.group(sf.data.DataUtil.sort(result, field, sf.data.DataUtil.fnAscending), 'ejValue');
    };
    CheckBoxFilterBase.getPredicate = function (columns) {
        var cols = sf.data.DataUtil.distinct(columns, 'field', true) || [];
        var collection = [];
        var pred = {};
        for (var i = 0; i < cols.length; i++) {
            collection = new sf.data.DataManager(columns).executeLocal(new sf.data.Query().where('field', 'equal', cols[i].field));
            if (collection.length !== 0) {
                pred[cols[i].field] = CheckBoxFilterBase.generatePredicate(collection);
            }
        }
        return pred;
    };
    CheckBoxFilterBase.generatePredicate = function (cols) {
        var len = cols ? cols.length : 0;
        var predicate;
        var first;
        var operate = 'or';
        first = CheckBoxFilterBase.updateDateFilter(cols[0]);
        first.ignoreAccent = !sf.base.isNullOrUndefined(first.ignoreAccent) ? first.ignoreAccent : false;
        if (first.type === 'date' || first.type === 'datetime') {
            predicate = getDatePredicate(first, first.type);
        }
        else {
            predicate = first.ejpredicate ? first.ejpredicate :
                new sf.data.Predicate(first.field, first.operator, first.value, !CheckBoxFilterBase.getCaseValue(first), first.ignoreAccent);
        }
        for (var p = 1; p < len; p++) {
            cols[p] = CheckBoxFilterBase.updateDateFilter(cols[p]);
            if (len > 2 && p > 1 && cols[p].predicate === 'or') {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate.predicates.push(getDatePredicate(cols[p], cols[p].type));
                }
                else {
                    predicate.predicates.push(new sf.data.Predicate(cols[p].field, cols[p].operator, cols[p].value, !CheckBoxFilterBase.getCaseValue(cols[p]), cols[p].ignoreAccent));
                }
            }
            else {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    if (cols[p].predicate === 'and' && cols[p].operator === 'equal') {
                        predicate = predicate[operate](getDatePredicate(cols[p], cols[p].type), cols[p].type, cols[p].ignoreAccent);
                    }
                    else {
                        predicate = predicate[(cols[p].predicate)](getDatePredicate(cols[p], cols[p].type), cols[p].type, cols[p].ignoreAccent);
                    }
                }
                else {
                    /* tslint:disable-next-line:max-line-length */
                    predicate = cols[p].ejpredicate ?
                        predicate[cols[p].predicate](cols[p].ejpredicate) :
                        predicate[(cols[p].predicate)](cols[p].field, cols[p].operator, cols[p].value, !CheckBoxFilterBase.getCaseValue(cols[p]), cols[p].ignoreAccent);
                }
            }
        }
        return predicate || null;
    };
    CheckBoxFilterBase.getCaseValue = function (filter) {
        if (sf.base.isNullOrUndefined(filter.matchCase)) {
            if (filter.type === 'string' || sf.base.isNullOrUndefined(filter.type) && typeof (filter.value) === 'string') {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return filter.matchCase;
        }
    };
    CheckBoxFilterBase.updateDateFilter = function (filter) {
        if ((filter.type === 'date' || filter.type === 'datetime' || filter.value instanceof Date)) {
            filter.type = filter.type || 'date';
        }
        return filter;
    };
    return CheckBoxFilterBase;
}());

/**
 * Grid data module is used to generate query and data source.
 * @hidden
 */
var Data = /** @class */ (function () {
    /**
     * Constructor for data module.
     * @hidden
     */
    function Data(parent, serviceLocator) {
        this.dataState = { isPending: false, resolver: null, group: [] };
        this.foreignKeyDataState = { isPending: false, resolver: null };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.initDataManager();
        if (this.parent.isDestroyed || this.getModuleName() === 'foreignKey') {
            return;
        }
        this.parent.on(rowsAdded, this.addRows, this);
        this.parent.on(rowPositionChanged, this.reorderRows, this);
        this.parent.on(rowsRemoved, this.removeRows, this);
        this.parent.on(dataSourceModified, this.initDataManager, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(updateData, this.crudActions, this);
        this.parent.on(addDeleteAction, this.getData, this);
        this.parent.on(autoCol, this.refreshFilteredCols, this);
        this.parent.on(columnsPrepared, this.refreshFilteredCols, this);
    }
    Data.prototype.reorderRows = function (e) {
        this.dataManager.dataSource.json.splice(e.toIndex, 0, this.dataManager.dataSource.json.splice(e.fromIndex, 1)[0]);
    };
    Data.prototype.getModuleName = function () {
        return 'data';
    };
    /**
     * The function used to initialize dataManager and external query
     * @return {void}
     */
    Data.prototype.initDataManager = function () {
        var gObj = this.parent;
        this.dataManager = gObj.dataSource instanceof sf.data.DataManager ? gObj.dataSource :
            (sf.base.isNullOrUndefined(gObj.dataSource) ? new sf.data.DataManager() : new sf.data.DataManager(gObj.dataSource));
        if (gObj.isAngular && !(gObj.query instanceof sf.data.Query)) {
            gObj.setProperties({ query: new sf.data.Query() }, true);
        }
        else {
            this.isQueryInvokedFromData = true;
            gObj.query = gObj.query instanceof sf.data.Query ? gObj.query : new sf.data.Query();
        }
    };
    /**
     * The function is used to generate updated Query from Grid model.
     * @return {Query}
     * @hidden
     */
    Data.prototype.generateQuery = function (skipPage) {
        var gObj = this.parent;
        var query = gObj.getQuery().clone();
        if (this.parent.columnQueryMode === 'ExcludeHidden') {
            query.select(this.parent.getColumns().filter(function (column) { return !(column.isPrimaryKey !== true && column.visible === false || column.field === undefined); }).map(function (column) { return column.field; }));
        }
        else if (this.parent.columnQueryMode === 'Schema') {
            var selectQueryFields = [];
            var columns = this.parent.columns;
            for (var i = 0; i < columns.length; i++) {
                selectQueryFields.push(columns[i].field);
            }
            query.select(selectQueryFields);
        }
        this.filterQuery(query);
        this.searchQuery(query);
        this.aggregateQuery(query);
        this.sortQuery(query);
        if (isGroupAdaptive(this.parent)) {
            this.virtualGroupPageQuery(query);
        }
        else {
            this.pageQuery(query, skipPage);
        }
        this.groupQuery(query);
        return query;
    };
    /** @hidden */
    Data.prototype.aggregateQuery = function (query, isForeign) {
        var rows = this.parent.aggregates;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            for (var j = 0; j < row.columns.length; j++) {
                var cols = row.columns[j];
                var types = cols.type instanceof Array ? cols.type : [cols.type];
                for (var k = 0; k < types.length; k++) {
                    query.aggregate(types[k].toLowerCase(), cols.field);
                }
            }
        }
        return query;
    };
    Data.prototype.virtualGroupPageQuery = function (query) {
        var gObj = this.parent;
        var fName = 'fn';
        if (query.queries.length) {
            for (var i = 0; i < query.queries.length; i++) {
                if (query.queries[i][fName] === 'onPage') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    };
    Data.prototype.pageQuery = function (query, skipPage) {
        var gObj = this.parent;
        var fName = 'fn';
        if ((gObj.allowPaging || gObj.enableVirtualization || gObj.enableInfiniteScrolling) && skipPage !== true) {
            gObj.pageSettings.currentPage = Math.max(1, gObj.pageSettings.currentPage);
            if (gObj.pageSettings.pageCount <= 0) {
                gObj.pageSettings.pageCount = 8;
            }
            if (gObj.pageSettings.pageSize <= 0) {
                gObj.pageSettings.pageSize = 12;
            }
            if (query.queries.length) {
                for (var i = 0; i < query.queries.length; i++) {
                    if (query.queries[i][fName] === 'onPage') {
                        query.queries.splice(i, 1);
                    }
                }
            }
            if (!sf.base.isNullOrUndefined(gObj.infiniteScrollModule) && gObj.enableInfiniteScrolling) {
                this.parent.notify(infinitePageQuery, query);
            }
            else {
                query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
            }
        }
        return query;
    };
    Data.prototype.groupQuery = function (query) {
        var gObj = this.parent;
        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            if (this.parent.groupSettings.enableLazyLoading) {
                query.lazyLoad.push({ key: 'isLazyLoad', value: this.parent.groupSettings.enableLazyLoading });
            }
            var columns = gObj.groupSettings.columns;
            for (var i = 0, len = columns.length; i < len; i++) {
                var column = this.getColumnByField(columns[i]);
                if (!column) {
                    this.parent.log('initial_action', { moduleName: 'group', columnName: columns[i] });
                }
                var isGrpFmt = column.enableGroupByFormat;
                var format = column.format;
                if (isGrpFmt) {
                    query.group(columns[i], this.formatGroupColumn.bind(this), format);
                }
                else {
                    query.group(columns[i], null);
                }
            }
        }
        return query;
    };
    Data.prototype.sortQuery = function (query) {
        var gObj = this.parent;
        if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
            var columns = gObj.sortSettings.columns;
            var sortGrp = [];
            for (var i = columns.length - 1; i > -1; i--) {
                var col = this.getColumnByField(columns[i].field);
                if (col) {
                    col.setSortDirection(columns[i].direction);
                }
                else {
                    this.parent.log('initial_action', { moduleName: 'sort', columnName: columns[i].field });
                    return query;
                }
                var fn = columns[i].direction;
                if (col.sortComparer) {
                    this.parent.log('grid_sort_comparer');
                    fn = !this.isRemote() ? col.sortComparer.bind(col) : columns[i].direction;
                }
                if (gObj.groupSettings.columns.indexOf(columns[i].field) === -1) {
                    if (col.isForeignColumn() || col.sortComparer) {
                        query.sortByForeignKey(col.field, fn, undefined, columns[i].direction.toLowerCase());
                    }
                    else {
                        query.sortBy(col.field, fn);
                    }
                }
                else {
                    sortGrp.push({ direction: fn, field: col.field });
                }
            }
            for (var i = 0, len = sortGrp.length; i < len; i++) {
                if (typeof sortGrp[i].direction === 'string') {
                    query.sortBy(sortGrp[i].field, sortGrp[i].direction);
                }
                else {
                    var col = this.getColumnByField(sortGrp[i].field);
                    query.sortByForeignKey(sortGrp[i].field, sortGrp[i].direction, undefined, col.getSortDirection().toLowerCase());
                }
            }
        }
        return query;
    };
    Data.prototype.searchQuery = function (query, fcolumn, isForeignKey) {
        var sSettings = this.parent.searchSettings;
        var fields = sSettings.fields.length ? sSettings.fields : this.getSearchColumnFieldNames();
        var predicateList = [];
        var needForeignKeySearch = false;
        if (this.parent.searchSettings.key.length) {
            needForeignKeySearch = this.parent.getForeignKeyColumns().some(function (col) { return fields.indexOf(col.field) > -1; });
            var adaptor = !isForeignKey ? this.dataManager.adaptor : fcolumn.dataSource.adaptor;
            if (needForeignKeySearch || (adaptor.getModuleName &&
                adaptor.getModuleName() === 'ODataV4Adaptor')) {
                fields = isForeignKey ? [fcolumn.foreignKeyValue] : fields;
                for (var i = 0; i < fields.length; i++) {
                    var column = isForeignKey ? fcolumn : this.getColumnByField(fields[i]);
                    if (column.isForeignColumn() && !isForeignKey) {
                        predicateList = this.fGeneratePredicate(column, predicateList);
                    }
                    else {
                        predicateList.push(new sf.data.Predicate(fields[i], sSettings.operator, sSettings.key, sSettings.ignoreCase, sSettings.ignoreAccent));
                    }
                }
                var predList = sf.data.Predicate.or(predicateList);
                predList.key = sSettings.key;
                query.where(predList);
            }
            else {
                query.search(sSettings.key, fields, sSettings.operator, sSettings.ignoreCase, sSettings.ignoreAccent);
            }
        }
        return query;
    };
    Data.prototype.filterQuery = function (query, column, skipFoerign) {
        var gObj = this.parent;
        var predicateList = [];
        var actualFilter = [];
        var foreignColumn = this.parent.getForeignKeyColumns();
        if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
            var columns = column ? column : gObj.filterSettings.columns;
            var colType = {};
            for (var _i = 0, _a = gObj.getColumns(); _i < _a.length; _i++) {
                var col = _a[_i];
                colType[col.field] = col.filter.type ? col.filter.type : gObj.filterSettings.type;
            }
            var foreignCols = [];
            var defaultFltrCols = [];
            for (var _b = 0, columns_1 = columns; _b < columns_1.length; _b++) {
                var col = columns_1[_b];
                var gridColumn = gObj.getColumnByField(col.field);
                if (sf.base.isNullOrUndefined(col.type) && gridColumn && (gridColumn.type === 'date' || gridColumn.type === 'datetime')) {
                    col.type = gObj.getColumnByField(col.field).type;
                }
                if (col.isForeignKey) {
                    foreignCols.push(col);
                }
                else {
                    defaultFltrCols.push(col);
                }
            }
            if (defaultFltrCols.length) {
                if (gObj.filterSettings.type === 'FilterBar' || gObj.filterSettings.type === 'Menu') {
                    for (var i = 0, len = defaultFltrCols.length; i < len; i++) {
                        defaultFltrCols[i].uid = defaultFltrCols[i].uid ||
                            this.parent.grabColumnByFieldFromAllCols(defaultFltrCols[i].field).uid;
                    }
                }
                var excelPredicate = CheckBoxFilterBase.getPredicate(defaultFltrCols);
                for (var _c = 0, _d = Object.keys(excelPredicate); _c < _d.length; _c++) {
                    var prop = _d[_c];
                    predicateList.push(excelPredicate[prop]);
                }
            }
            if (foreignCols.length) {
                for (var _e = 0, foreignCols_1 = foreignCols; _e < foreignCols_1.length; _e++) {
                    var col = foreignCols_1[_e];
                    col.uid = col.uid || this.parent.grabColumnByFieldFromAllCols(col.field).uid;
                    var column_1 = this.parent.grabColumnByUidFromAllCols(col.uid);
                    if (!column_1) {
                        this.parent.log('initial_action', { moduleName: 'filter', columnName: col.field });
                    }
                    if (column_1.isForeignColumn() && getColumnByForeignKeyValue(col.field, foreignColumn) && !skipFoerign) {
                        actualFilter.push(col);
                        predicateList = this.fGeneratePredicate(column_1, predicateList);
                    }
                    else {
                        var excelPredicate = CheckBoxFilterBase.getPredicate(columns);
                        for (var _f = 0, _g = Object.keys(excelPredicate); _f < _g.length; _f++) {
                            var prop = _g[_f];
                            predicateList.push(excelPredicate[prop]);
                        }
                    }
                }
            }
            if (predicateList.length) {
                query.where(sf.data.Predicate.and(predicateList));
            }
            else {
                this.parent.notify(showEmptyGrid, {});
            }
        }
        return query;
    };
    Data.prototype.fGeneratePredicate = function (col, predicateList) {
        var fPredicate = {};
        if (col) {
            this.parent.notify(generateQuery, { predicate: fPredicate, column: col });
            if (fPredicate.predicate.predicates.length) {
                predicateList.push(fPredicate.predicate);
            }
        }
        return predicateList;
    };
    /**
     * The function is used to get dataManager promise by executing given Query.
     * @param  {Query} query - Defines the query which will execute along with data processing.
     * @return {Promise<Object>}
     * @hidden
     */
    Data.prototype.getData = function (args, query) {
        var _this = this;
        if (args === void 0) { args = { requestType: '' }; }
        var key = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ?
            args.foreignKeyData : this.parent.getPrimaryKeyFieldNames());
        this.parent.log('datasource_syntax_mismatch', { dataState: this.parent });
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            var def = this.eventPromise(args, query, key);
            return def.promise;
        }
        else {
            var crud = void 0;
            switch (args.requestType) {
                case 'delete':
                    query = query ? query : this.generateQuery();
                    var len = Object.keys(args.data).length;
                    if (len === 1) {
                        crud = this.dataManager.remove(key, args.data[0], query.fromTable, query);
                    }
                    else {
                        var changes = {
                            addedRecords: [],
                            deletedRecords: [],
                            changedRecords: []
                        };
                        changes.deletedRecords = args.data;
                        crud = this.dataManager.saveChanges(changes, key, query.fromTable, query.requiresCount());
                    }
                    break;
                case 'save':
                    if (sf.base.isBlazor() && this.parent.isServerRendered) {
                        this.parent.notify('offset', args);
                    }
                    query = query ? query : this.generateQuery();
                    args.index = sf.base.isNullOrUndefined(args.index) ? 0 : args.index;
                    crud = this.dataManager.insert(args.data, query.fromTable, query, args.index);
                    break;
            }
            var promise = 'promise';
            args[promise] = crud;
            if (crud && !Array.isArray(crud) && !crud.hasOwnProperty('deletedRecords')) {
                if (sf.base.isBlazor()) {
                    return crud.then(function (result) {
                        return _this.insert(query, args);
                    }).catch(function (e) {
                        return null;
                    });
                }
                else {
                    return crud.then(function (result) {
                        return _this.insert(query, args);
                    });
                }
            }
            else {
                return this.insert(query, args);
            }
        }
    };
    Data.prototype.insert = function (query, args) {
        if (args.requestType === 'save') {
            this.parent.notify(recordAdded, args);
        }
        return this.executeQuery(query);
    };
    Data.prototype.executeQuery = function (query) {
        var _this = this;
        if (this.dataManager.ready) {
            var deferred_1 = new sf.data.Deferred();
            var ready = this.dataManager.ready;
            ready.then(function (e) {
                _this.dataManager.executeQuery(query).then(function (result) {
                    deferred_1.resolve(result);
                });
            }).catch(function (e) {
                deferred_1.reject(e);
            });
            return deferred_1.promise;
        }
        else {
            return this.dataManager.executeQuery(query);
        }
    };
    Data.prototype.formatGroupColumn = function (value, field) {
        var gObj = this.parent;
        var serviceLocator = this.serviceLocator;
        var column = this.getColumnByField(field);
        var date = value;
        if (!column.type) {
            column.type = date.getDay ? (date.getHours() > 0 || date.getMinutes() > 0 ||
                date.getSeconds() > 0 || date.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        }
        if (sf.base.isNullOrUndefined(column.getFormatter())) {
            setFormatter(serviceLocator, column);
        }
        var formatVal = ValueFormatter.prototype.toView(value, column.getFormatter());
        return formatVal;
    };
    Data.prototype.crudActions = function (args) {
        var query = this.generateQuery();
        var promise = null;
        var pr = 'promise';
        var key = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ? args.foreignKeyData :
            this.parent.getPrimaryKeyFieldNames());
        if (this.parent.dataSource && 'result' in this.parent.dataSource) {
            this.eventPromise(args, query, key);
        }
        switch (args.requestType) {
            case 'save':
                if (sf.base.isBlazor() && this.parent.isServerRendered) {
                    this.parent.notify('offset', args);
                }
                promise = this.dataManager.update(key, args.data, query.fromTable, query, args.previousData);
                break;
        }
        args[pr] = promise ? promise : args[pr];
        this.parent.notify(crudAction, args);
    };
    /** @hidden */
    Data.prototype.saveChanges = function (changes, key, original, query) {
        if (query === void 0) { query = this.generateQuery(); }
        query.requiresCount();
        if ('result' in this.parent.dataSource) {
            var state = void 0;
            state = this.getStateEventArgument(query);
            var deff = new sf.data.Deferred();
            var args = {
                requestType: 'batchsave', changes: changes, key: key, query: query,
                endEdit: deff.resolve
            };
            this.setState({ isPending: true, resolver: deff.resolve });
            this.parent.trigger(dataSourceChanged, args);
            return deff.promise;
        }
        else {
            var changedRecords = 'changedRecords';
            var addedRecords = 'addedRecords';
            var data = 'data';
            if (sf.base.isBlazor() && this.parent.isServerRendered) {
                for (var i = 0; i < changes[changedRecords].length; i++) {
                    var args = { data: changes[changedRecords][i] };
                    this.parent.notify('offset', args);
                    changes[changedRecords][i] = args[data];
                }
                for (var i = 0; i < changes[addedRecords].length; i++) {
                    var args = { data: changes[addedRecords][i] };
                    this.parent.notify('offset', args);
                    changes[addedRecords][i] = args[data];
                }
            }
            var promise = this.dataManager.saveChanges(changes, key, query.fromTable, query, original);
            return promise;
        }
    };
    Data.prototype.getKey = function (keys) {
        if (keys && keys.length) {
            return keys[0];
        }
        return undefined;
    };
    /** @hidden */
    Data.prototype.isRemote = function () {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined &&
            this.dataManager.dataSource.url !== '';
    };
    Data.prototype.addRows = function (e) {
        for (var i = e.records.length; i > 0; i--) {
            this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
        }
    };
    Data.prototype.removeRows = function (e) {
        var json = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter(function (value, index) { return e.records.indexOf(value) === -1; });
    };
    Data.prototype.getColumnByField = function (field) {
        var col;
        return (this.parent.columnModel).some(function (column) {
            col = column;
            return column.field === field;
        }) && col;
    };
    Data.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(rowsAdded, this.addRows);
        this.parent.off(rowsRemoved, this.removeRows);
        this.parent.off(dataSourceModified, this.initDataManager);
        this.parent.off(destroy, this.destroy);
        this.parent.off(updateData, this.crudActions);
        this.parent.off(addDeleteAction, this.getData);
        this.parent.off(autoCol, this.refreshFilteredCols);
        this.parent.off(columnsPrepared, this.refreshFilteredCols);
    };
    Data.prototype.getState = function () {
        return this.dataState;
    };
    Data.prototype.setState = function (state) {
        return this.dataState = state;
    };
    Data.prototype.getForeignKeyDataState = function () {
        return this.foreignKeyDataState;
    };
    Data.prototype.setForeignKeyDataState = function (state) {
        this.foreignKeyDataState = state;
    };
    Data.prototype.getStateEventArgument = function (query) {
        var adaptr = new sf.data.UrlAdaptor();
        var dm = new sf.data.DataManager({ url: '', adaptor: new sf.data.UrlAdaptor });
        var state = adaptr.processQuery(dm, query);
        var data = JSON.parse(state.data);
        return sf.base.extend(data, state.pvtData);
    };
    Data.prototype.eventPromise = function (args, query, key) {
        var _this = this;
        var state;
        var dataArgs = args;
        state = this.getStateEventArgument(query);
        var def = new sf.data.Deferred();
        var deff = new sf.data.Deferred();
        if (args.requestType !== undefined && this.dataState.isDataChanged !== false) {
            state.action = args;
            if (args.requestType === 'save' || args.requestType === 'delete') {
                var editArgs_1 = args;
                editArgs_1.key = key;
                var promise = 'promise';
                editArgs_1[promise] = deff.promise;
                editArgs_1.state = state;
                this.setState({ isPending: true, resolver: deff.resolve });
                dataArgs.endEdit = deff.resolve;
                dataArgs.cancelEdit = deff.reject;
                this.parent.trigger(dataSourceChanged, editArgs_1);
                deff.promise.then(function (e) {
                    _this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                    if (editArgs_1.requestType === 'save') {
                        _this.parent.notify(recordAdded, editArgs_1);
                    }
                    _this.parent.trigger(dataStateChange, state);
                })
                    .catch(function () { return void 0; });
            }
            else {
                this.setState({ isPending: true, resolver: def.resolve, group: state.group, aggregates: state.aggregates });
                this.parent.trigger(dataStateChange, state);
            }
        }
        else {
            this.setState({});
            def.resolve(this.parent.dataSource);
        }
        return def;
    };
    /**
     * Gets the columns where searching needs to be performed from the Grid.
     * @return {string[]}
     */
    Data.prototype.getSearchColumnFieldNames = function () {
        var colFieldNames = [];
        var columns = this.parent.getColumns();
        for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
            var col = columns_2[_i];
            if (col.allowSearching && !sf.base.isNullOrUndefined(col.field)) {
                colFieldNames.push(col.field);
            }
        }
        return colFieldNames;
    };
    Data.prototype.refreshFilteredCols = function () {
        if (this.parent.allowFiltering && this.parent.filterSettings.columns.length) {
            refreshFilteredColsUid(this.parent, this.parent.filterSettings.columns);
        }
    };
    return Data;
}());

/**
 * Row
 * @hidden
 */
var Row = /** @class */ (function () {
    function Row(options, parent) {
        sf.base.merge(this, options);
        this.parent = parent;
    }
    Row.prototype.clone = function () {
        var row = new Row({});
        sf.base.merge(row, this);
        row.cells = this.cells.map(function (cell) { return cell.clone(); });
        return row;
    };
    /**
     * Replaces the row data and grid refresh the particular row element only.
     * @param  {Object} data - To update new data for the particular row.
     * @return {void}
     */
    Row.prototype.setRowValue = function (data) {
        var key = this.data[this.parent.getPrimaryKeyFieldNames()[0]];
        this.parent.setRowData(key, data);
    };
    /**
     * Replaces the given field value and refresh the particular cell element only.
     * @param {string} field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     * @return {void}
     */
    Row.prototype.setCellValue = function (field, value) {
        var isValDiff = !(this.data[field].toString() === value.toString());
        if (isValDiff) {
            var pKeyField = this.parent.getPrimaryKeyFieldNames()[0];
            var key = this.data[pKeyField];
            this.parent.setCellValue(key, field, value);
            this.makechanges(pKeyField, this.data);
        }
        else {
            return;
        }
    };
    Row.prototype.makechanges = function (key, data) {
        var gObj = this.parent;
        var dataManager = gObj.getDataModule().dataManager;
        dataManager.update(key, data);
    };
    return Row;
}());

/**
 * Cell
 * @hidden
 */
var Cell = /** @class */ (function () {
    function Cell(options) {
        this.isSpanned = false;
        this.isRowSpanned = false;
        sf.base.merge(this, options);
    }
    Cell.prototype.clone = function () {
        var cell = new Cell({});
        sf.base.merge(cell, this);
        return cell;
    };
    return Cell;
}());

/**
 * `CellMergeRender` module.
 * @hidden
 */
var CellMergeRender = /** @class */ (function () {
    function CellMergeRender(serviceLocator, parent) {
        this.serviceLocator = serviceLocator;
        this.parent = parent;
    }
    CellMergeRender.prototype.render = function (cellArgs, row, i, td) {
        var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
        var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
        var colSpan = row.cells[i].cellSpan ? row.cells[i].cellSpan :
            (cellArgs.colSpan + i) <= row.cells.length ? cellArgs.colSpan : row.cells.length - i;
        var rowSpan = cellArgs.rowSpan;
        var visible = 0;
        var spannedCell;
        if (row.index > 0) {
            var cells = this.parent.groupSettings.columns.length > 0 &&
                !this.parent.getRowsObject()[row.index - 1].isDataRow ? this.parent.getRowsObject()[row.index].cells :
                this.parent.getRowsObject()[row.index - 1].cells;
            var targetCell_1 = row.cells[i];
            var uid_1 = 'uid';
            spannedCell = cells.filter(function (cell) { return cell.column.uid === targetCell_1.column[uid_1]; })[0];
        }
        var colSpanLen = spannedCell && spannedCell.colSpanRange > 1 && spannedCell.rowSpanRange > 1 ?
            spannedCell.colSpanRange : colSpan;
        for (var j = i + 1; j < i + colSpanLen && j < row.cells.length; j++) {
            if (row.cells[j].visible === false) {
                visible++;
            }
            else {
                row.cells[j].isSpanned = true;
            }
        }
        if (visible > 0) {
            for (var j = i + colSpan; j < i + colSpan + visible && j < row.cells.length; j++) {
                row.cells[j].isSpanned = true;
            }
            if (i + colSpan + visible >= row.cells.length) {
                colSpan -= (i + colSpan + visible) - row.cells.length;
            }
        }
        if (row.cells[i].cellSpan) {
            row.data[cellArgs.column.field] = row.cells[i].spanText;
            td = cellRenderer.render(row.cells[i], row.data, { 'index': !sf.base.isNullOrUndefined(row.index) ? row.index.toString() : '' });
        }
        if (colSpan > 1) {
            sf.base.attributes(td, { 'colSpan': colSpan.toString(), 'aria-colSpan': colSpan.toString() });
        }
        if (rowSpan > 1) {
            sf.base.attributes(td, { 'rowspan': rowSpan.toString(), 'aria-rowspan': rowSpan.toString() });
            row.cells[i].isRowSpanned = true;
            row.cells[i].rowSpanRange = Number(rowSpan);
            if (colSpan > 1) {
                row.cells[i].colSpanRange = Number(colSpan);
            }
        }
        if (row.index > 0 && (spannedCell.rowSpanRange > 1)) {
            row.cells[i].isSpanned = true;
            row.cells[i].rowSpanRange = Number(spannedCell.rowSpanRange - 1);
            row.cells[i].colSpanRange = spannedCell.rowSpanRange > 0 ? spannedCell.colSpanRange : 1;
        }
        if (this.parent.enableColumnVirtualization && !row.cells[i].cellSpan &&
            !this.containsKey(cellArgs.column.field, cellArgs.data[cellArgs.column.field])) {
            this.backupMergeCells(cellArgs.column.field, cellArgs.data[cellArgs.column.field], cellArgs.colSpan);
        }
        return td;
    };
    CellMergeRender.prototype.backupMergeCells = function (fName, data, span) {
        this.setMergeCells(this.generteKey(fName, data), span);
    };
    CellMergeRender.prototype.generteKey = function (fname, data) {
        return fname + '__' + data.toString();
    };
    CellMergeRender.prototype.splitKey = function (key) {
        return key.split('__');
    };
    CellMergeRender.prototype.containsKey = function (fname, data) {
        return this.getMergeCells().hasOwnProperty(this.generteKey(fname, data));
    };
    CellMergeRender.prototype.getMergeCells = function () {
        return this.parent.mergeCells;
    };
    CellMergeRender.prototype.setMergeCells = function (key, span) {
        this.parent.mergeCells[key] = span;
    };
    CellMergeRender.prototype.updateVirtualCells = function (rows) {
        var mCells = this.getMergeCells();
        for (var _i = 0, _a = Object.keys(mCells); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = mCells[key];
            var merge$$1 = this.splitKey(key);
            var columnIndex = this.getIndexFromAllColumns(merge$$1[0]);
            var vColumnIndices = this.parent.getColumnIndexesInView();
            var span = value - (vColumnIndices[0] - columnIndex);
            if (columnIndex < vColumnIndices[0] && span > 1) {
                for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
                    var row = rows_1[_b];
                    if (row.data[merge$$1[0]].toString() === merge$$1[1].toString()) {
                        row.cells[0].cellSpan = span;
                        row.cells[0].spanText = merge$$1[1];
                        break;
                    }
                }
            }
        }
        return rows;
    };
    CellMergeRender.prototype.getIndexFromAllColumns = function (field) {
        var index = iterateArrayOrObject(this.parent.getVisibleColumns(), function (item, index) {
            if (item.field === field) {
                return index;
            }
            return undefined;
        })[0];
        return index;
    };
    return CellMergeRender;
}());

/**
 * RowRenderer class which responsible for building row content.
 * @hidden
 */
var RowRenderer = /** @class */ (function () {
    function RowRenderer(serviceLocator, cellType, parent) {
        this.isSpan = false;
        this.cellType = cellType;
        this.serviceLocator = serviceLocator;
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { role: 'row' } });
    }
    /**
     * Function to render the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    RowRenderer.prototype.render = function (row, columns, attributes$$1, rowTemplate, cloneNode) {
        return this.refreshRow(row, columns, attributes$$1, rowTemplate, cloneNode);
    };
    /**
     * Function to refresh the row content based on Column[] and data.
     * @param  {Column[]} columns
     * @param  {Object} data?
     * @param  {{[x:string]:Object}} attributes?
     * @param  {string} rowTemplate?
     */
    RowRenderer.prototype.refresh = function (row, columns, isChanged, attributes$$1, rowTemplate) {
        if (isChanged) {
            row.data = extendObjWithFn({}, row.changes);
            this.refreshMergeCells(row);
        }
        var node = this.parent.element.querySelector('[data-uid=' + row.uid + ']');
        var tr = this.refreshRow(row, columns, attributes$$1, rowTemplate, null, isChanged);
        var cells = [].slice.call(tr.cells);
        node.innerHTML = '';
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            node.appendChild(cell);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    RowRenderer.prototype.refreshRow = function (row, columns, attributes$$1, rowTemplate, cloneNode, isEdit) {
        var tr = !sf.base.isNullOrUndefined(cloneNode) ? cloneNode : this.element.cloneNode();
        var rowArgs = { data: row.data };
        var cellArgs = { data: row.data };
        var attrCopy = sf.base.extend({}, attributes$$1, {});
        var chekBoxEnable = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox' && col.field; })[0];
        var value = false;
        if (chekBoxEnable) {
            value = getObject(chekBoxEnable.field, rowArgs.data);
        }
        if (row.isDataRow) {
            row.isSelected = this.parent.getSelectedRowIndexes().indexOf(row.index) > -1 || value;
        }
        if (row.isDataRow && this.parent.isCheckBoxSelection
            && this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            row.isSelected = true;
            if (this.parent.getSelectedRowIndexes().indexOf(row.index) === -1) {
                this.parent.getSelectedRowIndexes().push(row.index);
            }
        }
        this.buildAttributeFromRow(tr, row);
        sf.base.attributes(tr, attrCopy);
        setStyleAndAttributes(tr, row.attributes);
        var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
        var _loop_1 = function (i, len) {
            var cell = row.cells[i];
            cell.isSelected = row.isSelected;
            cell.isColumnSelected = cell.column.isSelected;
            var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
            var attrs = { 'index': !sf.base.isNullOrUndefined(row.index) ? row.index.toString() : '' };
            if (row.isExpand && row.cells[i].cellType === CellType.DetailExpand) {
                attrs['class'] = this_1.parent.isPrinting ? 'e-detailrowcollapse' : 'e-detailrowexpand';
            }
            var td = cellRenderer.render(row.cells[i], row.data, attrs, row.isExpand, isEdit);
            if (row.cells[i].cellType !== CellType.Filter) {
                if (row.cells[i].cellType === CellType.Data || row.cells[i].cellType === CellType.CommandColumn) {
                    this_1.parent.trigger(queryCellInfo, sf.base.extend(cellArgs, {
                        cell: td, column: cell.column, colSpan: 1,
                        rowSpan: 1, foreignKeyData: row.cells[i].foreignKeyData,
                        requestType: this_1.parent.requestTypeAction
                    }));
                    var isRowSpanned = false;
                    if (row.index > 0 && this_1.isSpan) {
                        var prevRowCells = this_1.parent.groupSettings.columns.length > 0 &&
                            !this_1.parent.getRowsObject()[row.index - 1].isDataRow ?
                            this_1.parent.getRowsObject()[row.index].cells : this_1.parent.getRowsObject()[row.index - 1].cells;
                        var uid_1 = 'uid';
                        var prevRowCell = prevRowCells.filter(function (cell) {
                            return cell.column.uid === row.cells[i].column[uid_1];
                        })[0];
                        isRowSpanned = prevRowCell.isRowSpanned ? prevRowCell.isRowSpanned : prevRowCell.rowSpanRange > 1;
                    }
                    if (cellArgs.colSpan > 1 || row.cells[i].cellSpan > 1 || cellArgs.rowSpan > 1 || isRowSpanned) {
                        this_1.isSpan = true;
                        var cellMerge = new CellMergeRender(this_1.serviceLocator, this_1.parent);
                        td = cellMerge.render(cellArgs, row, i, td);
                    }
                }
                if (!row.cells[i].isSpanned) {
                    tr.appendChild(td);
                }
            }
        };
        var this_1 = this;
        for (var i = 0, len = row.cells.length; i < len; i++) {
            _loop_1(i, len);
        }
        var args = { row: tr, rowHeight: this.parent.rowHeight };
        if (row.isDataRow) {
            this.parent.trigger(rowDataBound, sf.base.extend(rowArgs, args));
            if (this.parent.childGrid || this.parent.isRowDragable() || this.parent.detailTemplate) {
                var td = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
            }
        }
        if (this.parent.enableVirtualization) {
            rowArgs.rowHeight = this.parent.rowHeight;
        }
        if (rowArgs.rowHeight) {
            tr.style.height = rowArgs.rowHeight + 'px';
        }
        else if (this.parent.rowHeight && (tr.querySelector('.e-headercell') || tr.querySelector('.e-groupcaption'))) {
            tr.style.height = this.parent.rowHeight + 'px';
        }
        if (row.cssClass) {
            tr.classList.add(row.cssClass);
        }
        if (row.lazyLoadCssClass) {
            tr.classList.add(row.lazyLoadCssClass);
        }
        var vFTable = this.parent.enableColumnVirtualization && this.parent.frozenColumns !== 0;
        if (!vFTable && this.parent.element.scrollHeight > this.parent.height && this.parent.aggregates.length) {
            for (var i = 0; i < this.parent.aggregates.length; i++) {
                var property = 'properties';
                var column = 'columns';
                if (this.parent.aggregates[i][property][column][0].footerTemplate) {
                    var summarycell = tr.querySelectorAll('.e-summarycell');
                    if (summarycell.length) {
                        var lastSummaryCell = (summarycell[summarycell.length - 1]);
                        sf.base.addClass([lastSummaryCell], ['e-lastsummarycell']);
                        var firstSummaryCell = (summarycell[0]);
                        sf.base.addClass([firstSummaryCell], ['e-firstsummarycell']);
                    }
                }
            }
        }
        return tr;
    };
    RowRenderer.prototype.refreshMergeCells = function (row) {
        for (var _i = 0, _a = row.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.isSpanned = false;
        }
        return row;
    };
    /**
     * Function to check and add alternative row css class.
     * @param  {Element} tr
     * @param  {{[x:string]:Object}} attr
     */
    RowRenderer.prototype.buildAttributeFromRow = function (tr, row) {
        var attr = {};
        var prop = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid', 'ariaSelected': 'aria-selected' };
        var classes = [];
        if (row.isDataRow) {
            classes.push('e-row');
        }
        if (row.isAltRow) {
            classes.push('e-altrow');
        }
        if (!sf.base.isNullOrUndefined(row.index)) {
            attr[prop.rowindex] = row.index;
        }
        if (row.rowSpan) {
            attr.rowSpan = row.rowSpan;
        }
        if (row.uid) {
            attr[prop.dataUID] = row.uid;
        }
        if (row.isSelected) {
            attr[prop.ariaSelected] = true;
        }
        if (row.visible === false) {
            classes.push('e-hide');
        }
        attr.class = classes;
        setStyleAndAttributes(tr, attr);
    };
    return RowRenderer;
}());

/**
 * RowModelGenerator is used to generate grid data rows.
 * @hidden
 */
var RowModelGenerator = /** @class */ (function () {
    /**
     * Constructor for header renderer module
     */
    function RowModelGenerator(parent) {
        this.parent = parent;
    }
    RowModelGenerator.prototype.generateRows = function (data, args) {
        var rows = [];
        var startIndex = this.parent.enableVirtualization && args ? args.startIndex : 0;
        startIndex = this.parent.enableInfiniteScrolling && args ? this.getInfiniteIndex(args) : startIndex;
        for (var i = 0, len = Object.keys(data).length; i < len; i++, startIndex++) {
            rows[i] = this.generateRow(data[i], startIndex);
        }
        return rows;
    };
    RowModelGenerator.prototype.ensureColumns = function () {
        //TODO: generate dummy column for group, detail here;
        var cols = [];
        if (this.parent.detailTemplate || this.parent.childGrid) {
            var args = {};
            this.parent.notify(detailIndentCellInfo, args);
            cols.push(this.generateCell(args, null, CellType.DetailExpand));
        }
        if (this.parent.isRowDragable()) {
            cols.push(this.generateCell({}, null, CellType.RowDragIcon));
        }
        return cols;
    };
    RowModelGenerator.prototype.generateRow = function (data, index, cssClass, indent, pid, tIndex, parentUid) {
        var options = {};
        options.foreignKeyData = {};
        var isServerRendered = 'isServerRendered';
        options.uid = sf.base.isBlazor() && this.parent[isServerRendered] ? this.parent.getRowUid('grid-row') : getUid('grid-row');
        options.data = data;
        options.index = index;
        options.indent = indent;
        options.tIndex = tIndex;
        options.isDataRow = true;
        options.parentGid = pid;
        options.parentUid = parentUid;
        if (this.parent.isPrinting) {
            if (this.parent.hierarchyPrintMode === 'All') {
                options.isExpand = true;
            }
            else if (this.parent.hierarchyPrintMode === 'Expanded' && this.parent.expandedRows && this.parent.expandedRows[index]) {
                options.isExpand = this.parent.expandedRows[index].isExpand;
            }
        }
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        if (sf.base.isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization && this.parent.selectionModule.checkBoxState) {
            options.isSelected = this.parent.selectionModule.checkBoxState;
            if (options.isSelected && this.parent.selectionModule.selectedRowIndexes.indexOf(index) === -1) {
                this.parent.selectionModule.selectedRowIndexes.push(index);
            }
        }
        else {
            options.isSelected = this.parent.getSelectedRowIndexes().indexOf(index) > -1;
        }
        this.refreshForeignKeyRow(options);
        var cells = this.ensureColumns();
        var row = new Row(options, this.parent);
        row.cells = this.parent.getFrozenMode() === 'Right' ? this.generateCells(options).concat(cells)
            : cells.concat(this.generateCells(options));
        return row;
    };
    RowModelGenerator.prototype.refreshForeignKeyRow = function (options) {
        var foreignKeyColumns = this.parent.getForeignKeyColumns();
        for (var i = 0; i < foreignKeyColumns.length; i++) {
            sf.base.setValue(foreignKeyColumns[i].field, getForeignData(foreignKeyColumns[i], options.data), options.foreignKeyData);
        }
    };
    RowModelGenerator.prototype.generateCells = function (options) {
        var dummies = this.parent.getColumns();
        var tmp = [];
        for (var i = 0; i < dummies.length; i++) {
            tmp.push(this.generateCell(dummies[i], options.uid, sf.base.isNullOrUndefined(dummies[i].commands) ? undefined : CellType.CommandColumn, null, i, options.foreignKeyData));
        }
        return tmp;
    };
    RowModelGenerator.prototype.generateCell = function (column, rowId, cellType, colSpan, oIndex, foreignKeyData$$1) {
        var opt = {
            'visible': column.visible,
            'isDataCell': !sf.base.isNullOrUndefined(column.field || column.template),
            'isTemplate': !sf.base.isNullOrUndefined(column.template),
            'rowID': rowId,
            'column': column,
            'cellType': !sf.base.isNullOrUndefined(cellType) ? cellType : CellType.Data,
            'colSpan': colSpan,
            'commands': column.commands,
            'isForeignKey': column.isForeignColumn && column.isForeignColumn(),
            'foreignKeyData': column.isForeignColumn && column.isForeignColumn() && sf.base.getValue(column.field, foreignKeyData$$1)
        };
        if (opt.isDataCell || opt.column.type === 'checkbox' || opt.commands) {
            opt.index = oIndex;
        }
        return new Cell(opt);
    };
    RowModelGenerator.prototype.refreshRows = function (input) {
        for (var i = 0; i < input.length; i++) {
            this.refreshForeignKeyRow(input[i]);
            input[i].cells = this.generateCells(input[i]);
        }
        return input;
    };
    RowModelGenerator.prototype.getInfiniteIndex = function (args) {
        return args.requestType === 'infiniteScroll' || args.requestType === 'delete' || args.action === 'add'
            ? args.startIndex : 0;
    };
    return RowModelGenerator;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Summary row model generator
 * @hidden
 */
var SummaryModelGenerator = /** @class */ (function () {
    /**
     * Constructor for Summary row model generator
     */
    function SummaryModelGenerator(parent) {
        this.parent = parent;
    }
    SummaryModelGenerator.prototype.getData = function () {
        var _this = this;
        var rows = [];
        var row = this.parent.aggregates.slice();
        for (var i = 0; i < row.length; i++) {
            var columns = row[i].columns.filter(function (column) {
                return !(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)
                    || _this.columnSelector(column);
            });
            if (columns.length) {
                rows.push({ columns: columns });
            }
        }
        return rows;
    };
    SummaryModelGenerator.prototype.columnSelector = function (column) {
        return column.footerTemplate !== undefined;
    };
    SummaryModelGenerator.prototype.getColumns = function (start, end) {
        var columns = [];
        if (this.parent.allowGrouping) {
            for (var i = 0; i < this.parent.groupSettings.columns.length; i++) {
                columns.push(new Column({}));
            }
        }
        if (this.parent.detailTemplate || !sf.base.isNullOrUndefined(this.parent.childGrid) || (this.parent.isRowDragable() && !start)) {
            columns.push(new Column({}));
        }
        columns.push.apply(columns, this.parent.getColumns());
        end = end ? end + this.parent.getIndentCount() : end;
        return sf.base.isNullOrUndefined(start) ? columns : columns.slice(start, end);
    };
    SummaryModelGenerator.prototype.generateRows = function (input, args, start, end, columns) {
        if (input.length === 0) {
            if (args === undefined || !args.count) {
                return [];
            }
        }
        var data = this.buildSummaryData(input, args);
        var rows = [];
        var row = this.getData();
        for (var i = 0; i < row.length; i++) {
            rows.push(this.getGeneratedRow(row[i], data[i], args ? args.level : undefined, start, end, args ? args.parentUid : undefined, columns));
        }
        return rows;
    };
    SummaryModelGenerator.prototype.getGeneratedRow = function (summaryRow, data, raw, start, end, parentUid, columns) {
        var tmp = [];
        var indents = this.getIndentByLevel(raw);
        var isDetailGridAlone = !sf.base.isNullOrUndefined(this.parent.childGrid);
        var indentLength = this.parent.getIndentCount();
        if (this.parent.isRowDragable()) {
            indents = ['e-indentcelltop'];
        }
        var values = columns ? columns : this.getColumns(start, end);
        for (var i = 0; i < values.length; i++) {
            tmp.push(this.getGeneratedCell(values[i], summaryRow, i >= indentLength ? this.getCellType() :
                i < this.parent.groupSettings.columns.length ? CellType.Indent : CellType.DetailFooterIntent, indents[i], isDetailGridAlone));
        }
        var row = new Row({ data: data, attributes: { class: 'e-summaryrow' } });
        row.cells = tmp;
        if (sf.base.isBlazor() && this.parent.isServerRendered && !sf.base.isNullOrUndefined(parentUid)) {
            row.uid = this.parent.getRowUid('grid-row');
        }
        else {
            row.uid = getUid('grid-row');
        }
        row.parentUid = parentUid;
        row.visible = tmp.some(function (cell) { return cell.isDataCell && cell.visible; });
        return row;
    };
    SummaryModelGenerator.prototype.getGeneratedCell = function (column, summaryRow, cellType, indent, isDetailGridAlone) {
        //Get the summary column by display
        var sColumn = summaryRow.columns.filter(function (scolumn) { return scolumn.columnName === column.field; })[0];
        var attrs = {
            'style': { 'textAlign': column.textAlign },
            'e-mappinguid': column.uid, index: column.index
        };
        if (indent) {
            attrs.class = indent;
        }
        if (sf.base.isNullOrUndefined(indent) && isDetailGridAlone) {
            attrs.class = 'e-detailindentcelltop';
        }
        var opt = {
            'visible': column.visible,
            'isDataCell': !sf.base.isNullOrUndefined(sColumn),
            'isTemplate': sColumn && !sf.base.isNullOrUndefined(sColumn.footerTemplate
                || sColumn.groupFooterTemplate || sColumn.groupCaptionTemplate),
            'column': sColumn || {},
            'attributes': attrs,
            'cellType': cellType
        };
        opt.column.headerText = column.headerText;
        return new Cell(opt);
    };
    SummaryModelGenerator.prototype.buildSummaryData = function (data, args) {
        var dummy = [];
        var summaryRows = this.getData();
        var single = {};
        for (var i = 0; i < summaryRows.length; i++) {
            single = {};
            var column = summaryRows[i].columns;
            for (var j = 0; j < column.length; j++) {
                single = this.setTemplate(column[j], (args && args.aggregates) ? args : data, single);
            }
            dummy.push(single);
        }
        return dummy;
    };
    SummaryModelGenerator.prototype.getIndentByLevel = function (data) {
        return this.parent.groupSettings.columns.map(function () { return 'e-indentcelltop'; });
    };
    SummaryModelGenerator.prototype.setTemplate = function (column, data, single) {
        var types = column.type;
        var helper = {};
        var formatFn = column.getFormatter() || (function () { return function (a) { return a; }; })();
        var group = data;
        if (!(types instanceof Array)) {
            types = [column.type];
        }
        for (var i = 0; i < types.length; i++) {
            var key = column.field + ' - ' + types[i].toLowerCase();
            var disp = column.columnName;
            var val = types[i] !== 'Custom' && group.aggregates && key in group.aggregates ? group.aggregates[key] :
                calculateAggregate(types[i], group.aggregates ? group : data, column, this.parent);
            single[disp] = single[disp] || {};
            single[disp][key] = val;
            single[disp][types[i]] = !sf.base.isNullOrUndefined(val) ? formatFn(val) : ' ';
            if (group.field) {
                single[disp].field = group.field;
                single[disp].key = group.key;
            }
        }
        helper.format = column.getFormatter();
        column.setTemplate(helper);
        return single;
    };
    SummaryModelGenerator.prototype.getCellType = function () {
        return CellType.Summary;
    };
    return SummaryModelGenerator;
}());
var GroupSummaryModelGenerator = /** @class */ (function (_super) {
    __extends$3(GroupSummaryModelGenerator, _super);
    function GroupSummaryModelGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupSummaryModelGenerator.prototype.columnSelector = function (column) {
        return column.groupFooterTemplate !== undefined;
    };
    GroupSummaryModelGenerator.prototype.getIndentByLevel = function (level) {
        if (level === void 0) { level = this.parent.groupSettings.columns.length; }
        return this.parent.groupSettings.columns.map(function (v, indx) { return indx <= level - 1 ? '' : 'e-indentcelltop'; });
    };
    GroupSummaryModelGenerator.prototype.getCellType = function () {
        return CellType.GroupSummary;
    };
    return GroupSummaryModelGenerator;
}(SummaryModelGenerator));
var CaptionSummaryModelGenerator = /** @class */ (function (_super) {
    __extends$3(CaptionSummaryModelGenerator, _super);
    function CaptionSummaryModelGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CaptionSummaryModelGenerator.prototype.columnSelector = function (column) {
        return column.groupCaptionTemplate !== undefined;
    };
    CaptionSummaryModelGenerator.prototype.getData = function () {
        var initVal = { columns: [] };
        return [_super.prototype.getData.call(this).reduce(function (prev, cur) {
                prev.columns = prev.columns.concat(cur.columns);
                return prev;
            }, initVal)];
    };
    CaptionSummaryModelGenerator.prototype.isEmpty = function () {
        return (this.getData()[0].columns || []).length === 0;
    };
    CaptionSummaryModelGenerator.prototype.getCellType = function () {
        return CellType.CaptionSummary;
    };
    return CaptionSummaryModelGenerator;
}(SummaryModelGenerator));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
var GroupModelGenerator = /** @class */ (function (_super) {
    __extends$2(GroupModelGenerator, _super);
    function GroupModelGenerator(parent) {
        var _this = _super.call(this, parent) || this;
        _this.rows = [];
        /** @hidden */
        _this.index = 0;
        _this.parent = parent;
        _this.summaryModelGen = new GroupSummaryModelGenerator(parent);
        _this.captionModelGen = new CaptionSummaryModelGenerator(parent);
        return _this;
    }
    GroupModelGenerator.prototype.generateRows = function (data, args) {
        if (this.parent.groupSettings.columns.length === 0) {
            return _super.prototype.generateRows.call(this, data, args);
        }
        this.isInfiniteScroll = (args.requestType === 'infiniteScroll');
        this.rows = [];
        this.index = this.parent.enableVirtualization || this.isInfiniteScroll ? args.startIndex : 0;
        for (var i = 0, len = data.length; i < len; i++) {
            this.getGroupedRecords(0, data[i], data.level, i, undefined, this.rows.length);
        }
        this.index = 0;
        if (this.parent.isCollapseStateEnabled()) {
            this.ensureRowVisibility();
        }
        return this.rows;
    };
    GroupModelGenerator.prototype.getGroupedRecords = function (index, data, raw, parentid, childId, tIndex, parentUid) {
        var _a;
        var isRenderCaption = this.isInfiniteScroll && this.prevKey === data.key;
        var level = raw;
        if (sf.base.isNullOrUndefined(data.items)) {
            if (sf.base.isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows(data, index, parentid, this.rows.length, parentUid));
            }
            else {
                for (var j = 0, len = data.length; j < len; j++) {
                    this.getGroupedRecords(index, data[j], data.level, parentid, index, this.rows.length, parentUid);
                }
            }
        }
        else {
            var captionRow = this.generateCaptionRow(data, index, parentid, childId, tIndex, parentUid);
            if (!isRenderCaption) {
                this.rows = this.rows.concat(captionRow);
            }
            if (data.items && data.items.length) {
                this.getGroupedRecords(index + 1, data.items, data.items.level, parentid, index + 1, this.rows.length, captionRow.uid);
            }
            if (this.parent.aggregates.length) {
                var rowCnt = this.rows.length;
                (_a = this.rows).push.apply(_a, this.summaryModelGen.generateRows(data, { level: level, parentUid: captionRow.uid }));
                for (var i = rowCnt - 1; i >= 0; i--) {
                    if (this.rows[i].isCaptionRow) {
                        this.rows[i].aggregatesCount = this.rows.length - rowCnt;
                    }
                    else if (!this.rows[i].isCaptionRow && !this.rows[i].isDataRow) {
                        break;
                    }
                }
            }
        }
        this.prevKey = data.key;
    };
    GroupModelGenerator.prototype.getCaptionRowCells = function (field, indent, data) {
        var cells = [];
        var visibles = [];
        var column = this.parent.getColumnByField(field);
        var indexes = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization) {
            column = this.parent.columns.filter(function (c) { return c.field === field; })[0];
        }
        var groupedLen = this.parent.groupSettings.columns.length;
        var gObj = this.parent;
        if (!this.parent.enableColumnVirtualization || indexes.indexOf(indent) !== -1) {
            for (var i = 0; i < indent; i++) {
                cells.push(this.generateIndentCell());
            }
            cells.push(this.generateCell({}, null, CellType.Expand));
        }
        indent = this.parent.enableColumnVirtualization ? 1 :
            (this.parent.getVisibleColumns().length + groupedLen + (gObj.detailTemplate || gObj.childGrid ? 1 : 0) -
                indent + (this.parent.getVisibleColumns().length ? -1 : 0));
        //Captionsummary cells will be added here.    
        if (this.parent.aggregates.length && !this.captionModelGen.isEmpty()) {
            var captionCells = this.captionModelGen.generateRows(data)[0];
            sf.base.extend(data, captionCells.data);
            var cIndex_1 = 0;
            captionCells.cells.some(function (cell, index) { cIndex_1 = index; return cell.visible && cell.isDataCell; });
            visibles = captionCells.cells.slice(cIndex_1).filter(function (cell) { return cell.visible; });
            if (captionCells.visible && visibles[0].column.field === this.parent.getVisibleColumns()[0].field) {
                visibles = visibles.slice(1);
            }
            if (this.parent.getVisibleColumns().length === 1) {
                visibles = [];
            }
            indent = indent - visibles.length;
        }
        var cols = (!this.parent.enableColumnVirtualization ? [column] : this.parent.getColumns());
        var wFlag = true;
        for (var j = 0; j < cols.length; j++) {
            var tmpFlag = wFlag && indexes.indexOf(indent) !== -1;
            if (tmpFlag) {
                wFlag = false;
            }
            var cellType = !this.parent.enableColumnVirtualization || tmpFlag ?
                CellType.GroupCaption : CellType.GroupCaptionEmpty;
            indent = this.parent.enableColumnVirtualization && cellType === CellType.GroupCaption ? indent + groupedLen : indent;
            if (gObj.isRowDragable()) {
                indent++;
            }
            cells.push(this.generateCell(column, null, cellType, indent));
        }
        cells.push.apply(cells, visibles);
        return cells;
    };
    /** @hidden */
    GroupModelGenerator.prototype.generateCaptionRow = function (data, indent, parentID, childID, tIndex, parentUid) {
        var options = {};
        var records = 'records';
        var col = this.parent.getColumnByField(data.field);
        options.data = sf.base.extend({}, data);
        if (col) {
            options.data.field = data.field;
        }
        options.isDataRow = false;
        options.isExpand = !this.parent.groupSettings.enableLazyLoading && !this.parent.isCollapseStateEnabled();
        options.parentGid = parentID;
        options.childGid = childID;
        options.tIndex = tIndex;
        options.isCaptionRow = true;
        options.parentUid = parentUid;
        options.gSummary = !sf.base.isNullOrUndefined(data.items[records]) ? data.items[records].length : data.items.length;
        options.uid = sf.base.isBlazor() && this.parent.isServerRendered ? this.parent.getRowUid('grid-row') : getUid('grid-row');
        var row = new Row(options);
        row.indent = indent;
        this.getForeignKeyData(row);
        row.cells = this.getCaptionRowCells(data.field, indent, row.data);
        return row;
    };
    GroupModelGenerator.prototype.getForeignKeyData = function (row) {
        var data = row.data;
        var col = this.parent.getColumnByField(data.field);
        if (col && col.isForeignColumn && col.isForeignColumn()) {
            var fkValue = (sf.base.isNullOrUndefined(data.key) ? '' : col.valueAccessor(col.foreignKeyValue, getForeignData(col, {}, data.key)[0], col));
            sf.base.setValue('foreignKey', fkValue, row.data);
        }
    };
    /** @hidden */
    GroupModelGenerator.prototype.generateDataRows = function (data, indent, childID, tIndex, parentUid) {
        var rows = [];
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = data.length; i < len; i++, tIndex++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow', indent, childID, tIndex, parentUid);
            for (var j = 0; j < indent; j++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(indent) === -1) {
                    continue;
                }
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    };
    GroupModelGenerator.prototype.generateIndentCell = function () {
        return this.generateCell({}, null, CellType.Indent);
    };
    GroupModelGenerator.prototype.refreshRows = function (input) {
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0; i < input.length; i++) {
            if (input[i].isDataRow) {
                input[i].cells = this.generateCells(input[i]);
                for (var j = 0; j < input[i].indent; j++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(input[i].indent) === -1) {
                        continue;
                    }
                    input[i].cells.unshift(this.generateIndentCell());
                }
            }
            else {
                var cRow = this.generateCaptionRow(input[i].data, input[i].indent);
                input[i].cells = cRow.cells;
            }
        }
        return input;
    };
    GroupModelGenerator.prototype.ensureRowVisibility = function () {
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            if (!row.isCaptionRow) {
                continue;
            }
            for (var j = i + 1; j < this.rows.length; j++) {
                var childRow = this.rows[j];
                if (row.uid === childRow.parentUid) {
                    this.rows[j].visible = row.isExpand;
                }
            }
        }
    };
    return GroupModelGenerator;
}(RowModelGenerator));

/**
 * Content module is used to render grid content
 * @hidden
 */
var ContentRender = /** @class */ (function () {
    /**
     * Constructor for content renderer module
     */
    function ContentRender(parent, serviceLocator) {
        var _this = this;
        this.rows = [];
        this.freezeRows = [];
        this.movableRows = [];
        this.freezeRowElements = [];
        /** @hidden */
        this.currentInfo = {};
        /** @hidden */
        this.prevCurrentView = [];
        this.isLoaded = true;
        this.viewColIndexes = [];
        this.drop = function (e) {
            if (parentsUntil(e.target, 'e-row') || parentsUntil(e.target, 'e-emptyrow')) {
                _this.parent.notify(columnDrop, { target: e.target, droppedElement: e.droppedElement });
                sf.base.remove(e.droppedElement);
            }
        };
        this.infiniteCache = {};
        this.isRemove = false;
        this.visibleRows = [];
        this.visibleFrozenRows = [];
        this.rightFreezeRows = [];
        this.isAddRows = false;
        this.isInfiniteFreeze = false;
        this.useGroupCache = false;
        this.mutableData = false;
        this.rafCallback = function (args) {
            var arg = args;
            return function () {
                if (_this.parent.isFrozenGrid() && _this.parent.enableVirtualization) {
                    var mContentRows = [].slice.call(_this.parent.getMovableVirtualContent().querySelectorAll('.e-row'));
                    var fContentRows = [].slice.call(_this.parent.getFrozenVirtualContent().querySelectorAll('.e-row'));
                    _this.isLoaded = !mContentRows ? false : mContentRows.length === fContentRows.length;
                    if (_this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll' && _this.isLoaded) {
                        var mHdr = [].slice.call(_this.parent.getMovableVirtualHeader().querySelectorAll('.e-row'));
                        var fHdr = [].slice.call(_this.parent.getFrozenVirtualHeader().querySelectorAll('.e-row'));
                        _this.isLoaded = mHdr.length === fHdr.length;
                    }
                }
                _this.ariaService.setBusy(_this.getPanel().querySelector('.e-content'), false);
                if (_this.parent.isDestroyed) {
                    return;
                }
                var rows = _this.rows.slice(0);
                if (_this.parent.isFrozenGrid()) {
                    rows = args.isFrozen ? _this.freezeRows : args.renderFrozenRightContent ? _this.parent.getFrozenRightRowsObject()
                        : _this.movableRows;
                }
                _this.parent.notify(contentReady, { rows: rows, args: arg });
                if (_this.isLoaded) {
                    _this.parent.trigger(dataBound, {}, function () {
                        if (_this.parent.allowTextWrap) {
                            _this.parent.notify(freezeRender, { case: 'textwrap' });
                        }
                    });
                }
                if (arg) {
                    var action = (arg.requestType || '').toLowerCase() + '-complete';
                    _this.parent.notify(action, arg);
                    if (args.requestType === 'batchsave') {
                        args.cancel = false;
                        _this.parent.trigger(actionComplete, args);
                    }
                }
                if (_this.isLoaded) {
                    _this.parent.hideSpinner();
                }
            };
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.mutableData = this.parent.getDataModule().isRemote();
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) {
            return;
        }
        if (!this.parent.enableColumnVirtualization && !this.parent.enableVirtualization
            && !this.parent.groupSettings.enableLazyLoading) {
            this.parent.on(columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(colGroupRefresh, this.colGroupRefresh, this);
        this.parent.on(uiUpdate, this.enableAfterRender, this);
        this.parent.on(refreshInfiniteModeBlocks, this.refreshContentRows, this);
        this.parent.on(beforeCellFocused, this.beforeCellFocused, this);
        this.parent.on(destroy, this.droppableDestroy, this);
    }
    ContentRender.prototype.beforeCellFocused = function (e) {
        if (e.byKey && (e.keyArgs.action === 'upArrow' || e.keyArgs.action === 'downArrow')) {
            this.pressedKey = e.keyArgs.action;
        }
        else {
            this.pressedKey = undefined;
        }
    };
    /**
     * The function is used to render grid content div
     */
    ContentRender.prototype.renderPanel = function () {
        var gObj = this.parent;
        var div = this.parent.element.querySelector('.e-gridcontent');
        if (div) {
            this.ariaService.setOptions(this.parent.element.querySelector('.e-content'), { busy: false });
            this.setPanel(div);
            return;
        }
        div = this.parent.createElement('div', { className: 'e-gridcontent' });
        var innerDiv = this.parent.createElement('div', {
            className: 'e-content'
        });
        this.ariaService.setOptions(innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    };
    /**
     * The function is used to render grid content table
     */
    ContentRender.prototype.renderTable = function () {
        var contentDiv = this.getPanel();
        var virtualTable = contentDiv.querySelector('.e-virtualtable');
        var virtualTrack = contentDiv.querySelector('.e-virtualtrack');
        if (this.parent.enableVirtualization && !sf.base.isNullOrUndefined(virtualTable) && !sf.base.isNullOrUndefined(virtualTrack)
            && (!sf.base.isBlazor() || (sf.base.isBlazor() && !this.parent.isServerRendered))) {
            sf.base.remove(virtualTable);
            sf.base.remove(virtualTrack);
        }
        contentDiv.appendChild(this.createContentTable('_content_table'));
        this.setTable(contentDiv.querySelector('.e-table'));
        this.ariaService.setOptions(this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'Multiple'
        });
        this.initializeContentDrop();
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().classList.add('e-frozenhdrcont');
        }
    };
    /**
     * The function is used to create content table elements
     * @return {Element}
     * @hidden
     */
    ContentRender.prototype.createContentTable = function (id) {
        var innerDiv = this.getPanel().firstElementChild;
        if (!sf.base.isBlazor()) {
            if (this.getTable()) {
                sf.base.remove(this.getTable());
            }
        }
        var table = innerDiv.querySelector('.e-table') ? innerDiv.querySelector('.e-table') :
            this.parent.createElement('table', { className: 'e-table', attrs: {
                    cellspacing: '0.25px', role: 'grid',
                    id: this.parent.element.id + id
                }
            });
        this.setColGroup(this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(this.parent.createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    };
    /**
     * Refresh the content of the Grid.
     * @return {void}
     */
    // tslint:disable-next-line:max-func-body-length
    ContentRender.prototype.refreshContentRows = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        var gObj = this.parent;
        if (gObj.currentViewData.length === 0) {
            return;
        }
        var dataSource = this.currentMovableRows || gObj.currentViewData;
        var contentModule = this.parent.contentModule;
        var isReact = gObj.isReact && !sf.base.isNullOrUndefined(gObj.rowTemplate);
        var frag = isReact ? gObj.createElement('tbody') : document.createDocumentFragment();
        if (!this.initialPageRecords) {
            this.initialPageRecords = sf.base.extend([], dataSource);
        }
        var hdrfrag = isReact ? gObj.createElement('tbody') : document.createDocumentFragment();
        var columns = gObj.getColumns();
        var tr;
        var hdrTbody;
        var frzCols = gObj.getFrozenColumns();
        var isFrozenGrid = this.parent.isFrozenGrid();
        var trElement;
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        var isInfiniteScroll = this.parent.enableInfiniteScrolling
            && args.requestType === 'infiniteScroll';
        this.rowElements = [];
        this.rows = [];
        var fCont = this.getPanel().querySelector('.e-frozencontent');
        var mCont = this.getPanel().querySelector('.e-movablecontent');
        var cont = this.getPanel().querySelector('.e-content');
        var tbdy;
        var tableName;
        if (isGroupAdaptive(gObj)) {
            if (['sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder']
                .some(function (value) { return args.requestType === value; })) {
                gObj.vcRows = [];
                gObj.vRows = [];
            }
        }
        var modelData;
        var isServerRendered = 'isServerRendered';
        if (sf.base.isBlazor() && this.parent[isServerRendered]) {
            modelData = this.generator.generateRows(dataSource, args);
            if (this.parent.enableVirtualization) {
                this.prevInfo = this.prevInfo ? this.prevInfo : args.virtualInfo;
                this.prevInfo = args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
                    this.currentInfo.page !== args.virtualInfo.page ? this.currentInfo : args.virtualInfo;
            }
            this.rows = modelData;
            this.freezeRows = modelData;
            this.rowElements = [].slice.call(this.getTable().querySelectorAll('tr.e-row[data-uid]'));
            if (frzCols) {
                this.movableRows = modelData.map(function (mRow) {
                    var sRow = new Row(mRow);
                    sRow.cells = mRow.cells.slice(frzCols, mRow.cells.length);
                    mRow.cells = mRow.cells.slice(0, frzCols);
                    return sRow;
                });
                this.freezeRowElements = this.rowElements;
            }
            this.isLoaded = true;
            this.parent.hideSpinner();
            args.isFrozen = this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
            var arg = sf.base.extend({ rows: this.rows }, args);
            if (this.getTable().querySelector('.e-emptyrow')) {
                sf.base.remove(this.getTable().querySelector('.e-emptyrow'));
                if (!sf.base.isNullOrUndefined(this.getTable().querySelectorAll('.e-table > tbody')[1])) {
                    sf.base.remove(this.getTable().querySelectorAll('.e-table > tbody')[1]);
                }
            }
            this.parent.notify('contentcolgroup', {});
            this.rafCallback(arg)();
            if (frzCols) {
                cont.style.overflowY = 'hidden';
                fCont.style.height = ((mCont.offsetHeight) - getScrollBarWidth()) + 'px';
                mCont.style.overflowY = this.parent.height !== 'auto' ? 'scroll' : 'auto';
                fCont.style.borderRightWidth = '1px';
                this.parent.notify(contentReady, { rows: this.movableRows, args: sf.base.extend({}, arg, { isFrozen: false }) });
            }
            if (!(this.parent.isCheckBoxSelection || this.parent.selectionSettings.type === 'Multiple')
                || (!this.parent.isPersistSelection && !this.parent.enableVirtualization)) {
                var rowIndex = 'editRowIndex';
                if (this.parent.editSettings.mode === 'Normal' && !sf.base.isNullOrUndefined(args[rowIndex])) {
                    this.parent.selectRow(args[rowIndex]);
                }
            }
            if (this.parent.enableVirtualization && !this.parent.getHeaderContent().querySelectorAll('.e-check').length) {
                var removeClassByUid = this.parent.getRows().filter(function (x) { return x.getAttribute('aria-selected'); })
                    .map(function (y) { return y.getAttribute('data-uid'); });
                var addClassByUid = this.parent.getRows().filter(function (x) { return x.getAttribute('aria-selected') === null; })
                    .map(function (y) { return y.getAttribute('data-uid'); });
                for (var i = 0; i < removeClassByUid.length; i++) {
                    if (!sf.base.isNullOrUndefined(this.parent.getRowObjectFromUID(removeClassByUid[i])) &&
                        !this.parent.getRowObjectFromUID(removeClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(removeClassByUid[i]).removeAttribute('aria-selected');
                        if (!sf.base.isNullOrUndefined(this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check'))) {
                            sf.base.removeClass([this.parent.getRowElementByUID(removeClassByUid[i]).querySelector('.e-check')], ['e-check']);
                        }
                        for (var j = 0; j < this.parent.getRowElementByUID(removeClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(removeClassByUid[i])
                                .children[j].classList.remove('e-selectionbackground', 'e-active');
                        }
                    }
                }
                for (var i = 0; i < addClassByUid.length; i++) {
                    if (!sf.base.isNullOrUndefined(this.parent.getRowObjectFromUID(addClassByUid[i]))
                        && this.parent.getRowObjectFromUID(addClassByUid[i]).isSelected) {
                        this.parent.getRowElementByUID(addClassByUid[i]).setAttribute('aria-selected', 'true');
                        if (!sf.base.isNullOrUndefined(this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame'))) {
                            sf.base.addClass([this.parent.getRowElementByUID(addClassByUid[i]).querySelector('.e-frame')], ['e-check']);
                        }
                        for (var j = 0; j < this.parent.getRowElementByUID(addClassByUid[i]).children.length; j++) {
                            this.parent.getRowElementByUID(addClassByUid[i])
                                .children[j].classList.add('e-selectionbackground', 'e-active');
                        }
                    }
                }
            }
            return;
        }
        if (this.parent.enableVirtualization && this.parent.isFrozenGrid()) {
            if (this.parent.enableColumnVirtualization && args.requestType === 'virtualscroll'
                && args.virtualInfo.sentinelInfo.axis === 'X') {
                modelData = this.parent.contentModule.generateRows(dataSource, args);
                args.renderMovableContent = true;
            }
            modelData = this.parent.contentModule.generateRows(dataSource, args);
        }
        else {
            modelData = this.checkCache(modelData, args);
            if (!this.isAddRows && !this.useGroupCache) {
                modelData = this.generator.generateRows(dataSource, args);
            }
        }
        this.setGroupCache(modelData, args);
        this.parent.notify(setInfiniteCache, { isInfiniteScroll: isInfiniteScroll, modelData: modelData, args: args });
        var idx = modelData[0].cells[0].index;
        if (isFrozenGrid) {
            tableName = contentModule.setTbody(modelData, args);
            tbdy = contentModule.getTbody(tableName);
        }
        /* tslint:disable:no-any */
        if (args.requestType !== 'infiniteScroll' && this.parent.registeredTemplate
            && this.parent.registeredTemplate.template && !args.isFrozen) {
            var templatetoclear = [];
            for (var i = 0; i < this.parent.registeredTemplate.template.length; i++) {
                for (var j = 0; j < this.parent.registeredTemplate.template[i].rootNodes.length; j++) {
                    if (sf.base.isNullOrUndefined(this.parent.registeredTemplate.template[i].rootNodes[j].parentNode)) {
                        templatetoclear.push(this.parent.registeredTemplate.template[i]);
                        /* tslint:enable:no-any */
                    }
                }
            }
            this.parent.destroyTemplate(['template'], templatetoclear);
        }
        if (this.parent.isReact && args.requestType !== 'infiniteScroll' && !args.isFrozen) {
            this.parent.destroyTemplate(['columnTemplate', 'rowTemplate', 'detailTemplate', 'captionTemplate', 'commandsTemplate']);
            this.parent.renderTemplates();
        }
        if (this.parent.enableColumnVirtualization) {
            var cellMerge = new CellMergeRender(this.serviceLocator, this.parent);
            cellMerge.updateVirtualCells(modelData);
        }
        if (!isFrozenGrid) {
            this.tbody = this.getTable().querySelector('tbody');
        }
        var startIndex = 0;
        var blockLoad = true;
        if (isGroupAdaptive(gObj) && gObj.vcRows.length) {
            var top_1 = 'top';
            var scrollTop = !sf.base.isNullOrUndefined(args.virtualInfo.offsets) ? args.virtualInfo.offsets.top :
                (!sf.base.isNullOrUndefined(args.scrollTop) ? args.scrollTop[top_1] : 0);
            if (scrollTop !== 0) {
                var offsets_1 = gObj.vGroupOffsets;
                var bSize = gObj.pageSettings.pageSize / 2;
                var values = Object.keys(offsets_1).map(function (key) { return offsets_1[key]; });
                for (var m = 0; m < values.length; m++) {
                    if (scrollTop < values[m]) {
                        if (!sf.base.isNullOrUndefined(args.virtualInfo) && args.virtualInfo.direction === 'up') {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m * bSize);
                            break;
                        }
                        else {
                            args.virtualInfo.blockIndexes = m === 0 || m === 1 ? [1, 2] : [m, m + 1];
                            startIndex = m === 0 || m === 1 ? 0 : (m) * bSize;
                            break;
                        }
                    }
                }
                if (scrollTop + this.contentPanel.firstElementChild.offsetHeight ===
                    this.contentPanel.firstElementChild.scrollHeight && !args.rowObject) {
                    blockLoad = false;
                }
            }
        }
        var isVFFrozenOnly = gObj.frozenRows && !gObj.isFrozenGrid() && this.parent.enableVirtualization
            && args.requestType === 'reorder';
        if ((gObj.frozenRows && args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo.axis === 'X') || isVFFrozenOnly) {
            var bIndex = args.virtualInfo.blockIndexes;
            var page = args.virtualInfo.page;
            args.virtualInfo.blockIndexes = [1, 2];
            if (isVFFrozenOnly) {
                args.virtualInfo.page = 1;
            }
            var data = isVFFrozenOnly ? this.initialPageRecords : dataSource;
            var mhdrData = this.vgenerator
                .generateRows(data, args);
            mhdrData.splice(this.parent.frozenRows);
            for (var i = 0; i < this.parent.frozenRows; i++) {
                mhdrData[i].cells.splice(0, this.parent.getFrozenColumns());
                tr = row.render(mhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            args.virtualInfo.blockIndexes = bIndex;
            args.virtualInfo.page = page;
            if (isVFFrozenOnly && args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
        }
        this.virtualFrozenHdrRefresh(hdrfrag, modelData, row, args, dataSource, columns);
        for (var i = startIndex, len = modelData.length; i < len; i++) {
            this.rows.push(modelData[i]);
            if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
                this.setRowsInLazyGroup(modelData[i], i);
                if (sf.base.isNullOrUndefined(modelData[i].indent)) {
                    continue;
                }
            }
            this.setInfiniteVisibleRows(args, modelData[i], tableName);
            if (isGroupAdaptive(gObj) && this.rows.length >= (gObj.pageSettings.pageSize) && blockLoad) {
                break;
            }
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
                var isVFreorder = this.ensureFrozenHeaderRender(args);
                if (gObj.frozenRows && i < gObj.frozenRows && !isInfiniteScroll && args.requestType !== 'virtualscroll' && isVFreorder
                    && this.ensureVirtualFrozenHeaderRender(args)) {
                    hdrfrag.appendChild(tr);
                }
                else {
                    frag.appendChild(tr);
                }
                if (modelData[i].isExpand) {
                    gObj.notify(expandChildGrid, tr.cells[gObj.groupSettings.columns.length]);
                }
            }
            else {
                var rowTemplateID = gObj.element.id + 'rowTemplate';
                var elements = void 0;
                if (gObj.isReact) {
                    var isHeader = gObj.frozenRows && i < gObj.frozenRows;
                    var copied = sf.base.extend({ index: i }, dataSource[i]);
                    gObj.getRowTemplate()(copied, gObj, 'rowTemplate', rowTemplateID, null, null, isHeader ? hdrfrag : frag);
                    gObj.renderTemplates();
                }
                else {
                    elements = gObj.getRowTemplate()(sf.base.extend({ index: i }, dataSource[i]), gObj, 'rowTemplate', rowTemplateID);
                }
                if (!gObj.isReact && elements[0].tagName === 'TBODY') {
                    for (var j = 0; j < elements.length; j++) {
                        var isTR = elements[j].nodeName.toLowerCase() === 'tr';
                        if (isTR || (elements[j].querySelectorAll && elements[j].querySelectorAll('tr').length)) {
                            tr = isTR ? elements[j] : elements[j].querySelector('tr');
                        }
                    }
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        hdrfrag.appendChild(tr);
                    }
                    else {
                        frag.appendChild(tr);
                    }
                }
                else {
                    if (gObj.frozenRows && i < gObj.frozenRows) {
                        tr = !gObj.isReact ? appendChildren(hdrfrag, elements) : hdrfrag.lastElementChild;
                    }
                    else {
                        // frag.appendChild(tr);
                        if (!gObj.isReact) {
                            tr = appendChildren(frag, elements);
                        }
                        trElement = gObj.isReact ? frag.lastElementChild : tr.lastElementChild;
                    }
                }
                var arg = { data: modelData[i].data, row: trElement ? trElement : tr };
                this.parent.trigger(rowDataBound, arg);
            }
            if (modelData[i].isDataRow) {
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
        }
        if (isFrozenGrid) {
            contentModule.splitRows(tableName);
        }
        if ((gObj.frozenRows && args.requestType !== 'virtualscroll' && !isInfiniteScroll && this.ensureVirtualFrozenHeaderRender(args))
            || (args.requestType === 'virtualscroll' && args.virtualInfo.sentinelInfo && args.virtualInfo.sentinelInfo.axis === 'X')) {
            hdrTbody = isFrozenGrid ? contentModule.getFrozenHeader(tableName) : gObj.getHeaderTable().querySelector('tbody');
            if (isReact) {
                var parentTable = hdrTbody.parentElement;
                sf.base.remove(hdrTbody);
                parentTable.appendChild(hdrfrag);
            }
            else {
                hdrTbody.innerHTML = '';
                hdrTbody.appendChild(hdrfrag);
            }
        }
        if (!gObj.enableVirtualization && gObj.frozenRows && idx === 0 && cont.offsetHeight === Number(gObj.height)) {
            cont.style.height = (cont.offsetHeight - hdrTbody.offsetHeight) + 'px';
        }
        if (!sf.base.isBlazor() || this.parent.isJsComponent) {
            args.rows = this.rows.slice(0);
        }
        if (isFrozenGrid) {
            contentModule.setIsFrozen(args, tableName);
        }
        this.index = idx;
        getUpdateUsingRaf(function () {
            _this.parent.notify(beforeFragAppend, args);
            var isVFTable = _this.parent.enableVirtualization && _this.parent.isFrozenGrid();
            if (!_this.parent.enableVirtualization && !isInfiniteScroll) {
                if (_this.parent.isFrozenGrid()) {
                    sf.base.remove(tbdy);
                    tbdy = _this.parent.createElement('tbody');
                }
                else {
                    sf.base.remove(_this.tbody);
                    _this.tbody = _this.parent.createElement('tbody');
                }
            }
            if (isFrozenGrid && !isVFTable && !_this.parent.enableInfiniteScrolling) {
                _this.appendContent(tbdy, frag, args, tableName);
            }
            else {
                if (gObj.rowTemplate) {
                    sf.base.updateBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate', gObj);
                }
                if (isVFTable) {
                    if (args.renderFrozenRightContent) {
                        var frCont = gObj.getContent().querySelector('.e-frozen-right-content').querySelector('tbody');
                        _this.appendContent(frCont, frag, args);
                    }
                    else if (!args.renderMovableContent) {
                        _this.appendContent(fCont.querySelector('tbody'), frag, args);
                    }
                    else {
                        _this.appendContent(mCont.querySelector('tbody'), frag, args);
                        args.renderMovableContent = false;
                    }
                    if (!_this.parent.getFrozenColumns()) {
                        contentModule.renderNextFrozentPart(args, tableName);
                    }
                }
                else {
                    if (!sf.base.isNullOrUndefined(_this.parent.infiniteScrollModule) && _this.parent.enableInfiniteScrolling) {
                        _this.isAddRows = false;
                        _this.parent.notify(removeInfiniteRows, { args: args });
                        _this.parent.notify(appendInfiniteContent, {
                            tbody: tbdy ? tbdy : _this.tbody, frag: frag, args: args, rows: _this.rows,
                            rowElements: _this.rowElements, visibleRows: _this.visibleRows,
                            tableName: tableName
                        });
                        if (!frzCols && isFrozenGrid) {
                            var count = _this.parent.getTablesCount();
                            if ((count === 2 && (tableName === 'frozen-left' || tableName === 'frozen-right'))
                                || (count === 3 && (tableName === 'frozen-left' || tableName === 'movable'))) {
                                _this.refreshContentRows(sf.base.extend({}, args));
                            }
                        }
                    }
                    else {
                        _this.useGroupCache = false;
                        _this.appendContent(_this.tbody, frag, args);
                    }
                }
            }
            if (frzCols) {
                contentModule.renderNextFrozentPart(args, tableName);
            }
            frag = null;
        }, this.rafCallback(sf.base.extend({}, args)));
    };
    ContentRender.prototype.appendContent = function (tbody, frag, args, tableName) {
        var isReact = this.parent.isReact && !sf.base.isNullOrUndefined(this.parent.rowTemplate);
        if (isReact) {
            this.getTable().appendChild(frag);
        }
        else {
            tbody.appendChild(frag);
            this.getTable().appendChild(tbody);
        }
    };
    ContentRender.prototype.setRowsInLazyGroup = function (row, index) {
        if (this.parent.groupSettings.enableLazyLoading && !this.useGroupCache && this.parent.groupSettings.columns.length) {
            this.parent.contentModule.maintainRows(row, index);
        }
    };
    ContentRender.prototype.setGroupCache = function (data, args) {
        if (!this.useGroupCache && this.parent.groupSettings.enableLazyLoading) {
            this.parent.notify(setGroupCache, { args: args, data: data });
        }
    };
    ContentRender.prototype.ensureFrozenHeaderRender = function (args) {
        return !((this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) || (this.parent.infiniteScrollSettings.enableCache
            && this.parent.frozenRows && this.parent.infiniteScrollModule.requestType === 'delete'
            && this.parent.pageSettings.currentPage !== 1));
    };
    ContentRender.prototype.ensureVirtualFrozenHeaderRender = function (args) {
        return !(this.parent.enableVirtualization && args.requestType === 'delete');
    };
    ContentRender.prototype.checkCache = function (modelData, args) {
        if (this.parent.infiniteScrollSettings.enableCache && args.requestType === 'infiniteScroll') {
            var index = args.isFrozen ? 1 : 0;
            var frozenCols = this.parent.isFrozenGrid();
            this.isAddRows = !sf.base.isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage]);
            if (frozenCols && !sf.base.isNullOrUndefined(this.infiniteCache[this.parent.pageSettings.currentPage])) {
                this.isAddRows = this.infiniteCache[this.parent.pageSettings.currentPage][index].length !== 0;
            }
            if (this.isAddRows) {
                var data = !frozenCols ? this.infiniteCache[this.parent.pageSettings.currentPage]
                    : this.infiniteCache[this.parent.pageSettings.currentPage][index];
                modelData = this.parent.pageSettings.currentPage === 1 ? data.slice(this.parent.frozenRows) : data;
            }
            return modelData;
        }
        if (this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length &&
            (args.requestType === 'paging' || args.requestType === 'columnstate' || args.requestType === 'reorder')
            && this.parent.contentModule.getGroupCache()[this.parent.pageSettings.currentPage]) {
            this.useGroupCache = true;
            return this.parent.contentModule.initialGroupRows(args.requestType === 'reorder');
        }
        return null;
    };
    ContentRender.prototype.setInfiniteVisibleRows = function (args, data, tableName) {
        var frozenCols = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache) {
            if (frozenCols) {
                if (tableName === 'frozen-left' || (this.parent.getFrozenMode() === 'Right' && tableName === 'frozen-right')) {
                    this.visibleFrozenRows.push(data);
                }
                else if (tableName === 'movable') {
                    this.visibleRows.push(data);
                }
                else {
                    this.rightFreezeRows.push(data);
                }
            }
            else if (!this.parent.infiniteScrollSettings.enableCache) {
                this.visibleRows.push(data);
            }
        }
    };
    ContentRender.prototype.getCurrentBlockInfiniteRecords = function (isFreeze) {
        var data = [];
        if (this.parent.infiniteScrollSettings.enableCache) {
            if (!Object.keys(this.infiniteCache).length) {
                return [];
            }
            var frozenCols = this.parent.isFrozenGrid();
            var rows = this.parent.getRows();
            var index = parseInt(rows[this.parent.frozenRows].getAttribute('aria-rowindex'), 10);
            var first = Math.ceil((index + 1) / this.parent.pageSettings.pageSize);
            index = parseInt(rows[rows.length - 1].getAttribute('aria-rowindex'), 10);
            var last = Math.ceil(index / this.parent.pageSettings.pageSize);
            if (frozenCols) {
                var idx = isFreeze ? 0 : 1;
                for (var i = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i][idx]
                        : data.concat(this.infiniteCache[i][idx]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = this.infiniteCache[1][idx].slice(0, this.parent.frozenRows).concat(data);
                }
            }
            else {
                for (var i = first; i <= last; i++) {
                    data = !data.length ? this.infiniteCache[i] : data.concat(this.infiniteCache[i]);
                }
                if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
                    data = this.infiniteCache[1].slice(0, this.parent.frozenRows).concat(data);
                }
            }
        }
        return data;
    };
    ContentRender.prototype.getReorderedVFRows = function (args) {
        return this.parent.contentModule.getReorderedFrozenRows(args);
    };
    ContentRender.prototype.virtualFrozenHdrRefresh = function (hdrfrag, modelData, row, args, dataSource, columns) {
        if (this.parent.frozenRows && this.parent.isFrozenGrid() && this.parent.enableVirtualization
            && (args.requestType === 'reorder' || args.requestType === 'refresh')) {
            var tr = void 0;
            this.currentMovableRows = dataSource;
            var fhdrData = this.getReorderedVFRows(args);
            for (var i = 0; i < fhdrData.length; i++) {
                tr = row.render(fhdrData[i], columns);
                hdrfrag.appendChild(tr);
            }
            if (args.virtualInfo.page === 1) {
                modelData.splice(0, this.parent.frozenRows);
            }
            if (args.renderMovableContent) {
                this.parent.currentViewData = this.currentMovableRows;
                this.currentMovableRows = null;
            }
        }
    };
    ContentRender.prototype.getInfiniteRows = function () {
        var rows = [];
        var frozenCols = this.parent.isFrozenGrid();
        if (this.parent.enableInfiniteScrolling) {
            if (this.parent.infiniteScrollSettings.enableCache) {
                var keys = Object.keys(this.infiniteCache);
                for (var i = 0; i < keys.length; i++) {
                    rows = !frozenCols ? rows.concat(this.infiniteCache[keys[i]]) : rows.concat(this.infiniteCache[keys[i]][0]);
                }
            }
            else {
                rows = frozenCols ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return rows;
    };
    ContentRender.prototype.getInfiniteMovableRows = function () {
        var infiniteCacheRows = this.getCurrentBlockInfiniteRecords();
        var infiniteRows = this.parent.enableInfiniteScrolling ? infiniteCacheRows.length ? infiniteCacheRows
            : this.visibleRows : [];
        return infiniteRows;
    };
    /**
     * Get the content div element of grid
     * @return {Element}
     */
    ContentRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Set the content div element of grid
     * @param  {Element} panel
     */
    ContentRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    /**
     * Get the content table element of grid
     * @return {Element}
     */
    ContentRender.prototype.getTable = function () {
        return this.contentTable;
    };
    /**
     * Set the content table element of grid
     * @param  {Element} table
     */
    ContentRender.prototype.setTable = function (table) {
        this.contentTable = table;
    };
    /**
     * Get the Row collection in the Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ContentRender.prototype.getRows = function () {
        var infiniteRows = this.getInfiniteRows();
        return infiniteRows.length ? infiniteRows : this.parent.getFrozenColumns() ? this.freezeRows : this.rows;
    };
    /**
     * Get the Movable Row collection in the Freeze pane Grid.
     * @returns {Row[] | HTMLCollectionOf<HTMLTableRowElement>}
     */
    ContentRender.prototype.getMovableRows = function () {
        var infiniteRows = this.getInfiniteMovableRows();
        return infiniteRows.length ? infiniteRows : this.movableRows;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.getRowElements = function () {
        return this.parent.getFrozenColumns() ? this.freezeRowElements : this.rowElements;
    };
    /**
     * Get the Freeze pane movable content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.getMovableRowElements = function () {
        return this.rowElements;
    };
    /**
     * Get the content table data row elements
     * @return {Element}
     */
    ContentRender.prototype.setRowElements = function (elements) {
        this.rowElements = elements;
    };
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    ContentRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    ContentRender.prototype.setColGroup = function (colGroup) {
        if (!sf.base.isNullOrUndefined(colGroup)) {
            colGroup.id = 'content-' + colGroup.id;
        }
        return this.colgroup = colGroup;
    };
    /**
     * Function to hide content table column based on visible property
     * @param  {Column[]} columns?
     */
    ContentRender.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        if (sf.base.isBlazor() && gObj.isServerRendered) {
            this.parent.notify('setvisibility', columns);
        }
        var isFrozenGrid = this.parent.isFrozenGrid();
        var frzCols = gObj.getFrozenColumns();
        var rows = [];
        if (isFrozenGrid) {
            var fRows = this.freezeRows;
            var mRows = this.movableRows;
            var rowLen = fRows.length;
            var cellLen = void 0;
            var rightRows = [];
            if (gObj.getTablesCount() === 3) {
                rightRows = gObj.getFrozenRightRowsObject();
            }
            for (var i = 0, row = void 0; i < rowLen; i++) {
                cellLen = mRows[i].cells.length;
                var rightLen = rightRows.length ? rightRows[i].cells.length : 0;
                row = fRows[i].clone();
                for (var j = 0; j < cellLen; j++) {
                    row.cells.push(mRows[i].cells[j]);
                }
                for (var k = 0; k < rightLen; k++) {
                    row.cells.push(rightRows[i].cells[k]);
                }
                rows.push(row);
            }
        }
        else {
            rows = this.getRows();
        }
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var needFullRefresh = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            needFullRefresh = false;
        }
        var tr = gObj.getDataRows();
        var args = {};
        var infiniteData = this.infiniteRowVisibility();
        var contentrows = infiniteData ? infiniteData
            : this.rows.filter(function (row) { return !row.isDetailRow; });
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            var idx = this.parent.getNormalizedColumnIndex(column.uid);
            var colIdx = this.parent.getColumnIndexByUid(column.uid);
            var displayVal = column.visible === true ? '' : 'none';
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                if (isFrozenGrid) {
                    if (column.getFreezeTableName() !== 'movable') {
                        if (column.getFreezeTableName() === 'frozen-right') {
                            var left = this.parent.getFrozenLeftColumnsCount();
                            var movable = this.parent.getMovableColumnsCount();
                            colIdx = idx = idx - (left + movable);
                            var colG = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('colgroup');
                            sf.base.setStyleAttribute(colG.childNodes[idx], { 'display': displayVal });
                            contentrows = gObj.getFrozenRightRowsObject();
                            tr = gObj.getFrozenRightDataRows();
                        }
                        else {
                            sf.base.setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
                            var infiniteFreezeData = this.infiniteRowVisibility(true);
                            contentrows = infiniteFreezeData ? infiniteFreezeData : this.freezeRows;
                            tr = gObj.getDataRows();
                        }
                    }
                    else {
                        var mTable = gObj.getContent().querySelector('.e-movablecontent').querySelector('colgroup');
                        colIdx = idx = idx - frzCols - this.parent.getFrozenLeftColumnsCount();
                        sf.base.setStyleAttribute(mTable.childNodes[idx], { 'display': displayVal });
                        tr = gObj.getMovableDataRows();
                        var infiniteMovableData = this.infiniteRowVisibility();
                        contentrows = infiniteMovableData ? infiniteMovableData : this.movableRows;
                    }
                }
                else {
                    sf.base.setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
                }
            }
            if (!needFullRefresh) {
                this.setDisplayNone(tr, colIdx, displayVal, contentrows);
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (needFullRefresh) {
            this.refreshContentRows({ requestType: 'refresh' });
        }
        else {
            if (!this.parent.getFrozenColumns()) {
                this.parent.notify(partialRefresh, { rows: contentrows, args: args });
            }
            else {
                this.parent.notify(partialRefresh, { rows: this.freezeRows, args: { isFrozen: true, rows: this.freezeRows } });
                this.parent.notify(partialRefresh, { rows: this.movableRows, args: { isFrozen: false, rows: this.movableRows } });
            }
        }
    };
    /**
     * @hidden
     */
    ContentRender.prototype.setDisplayNone = function (tr, idx, displayVal, rows) {
        var trs = Object.keys(tr);
        for (var i = 0; i < trs.length; i++) {
            var td = tr[trs[i]].querySelectorAll('td.e-rowcell')[idx];
            if (tr[trs[i]].querySelectorAll('td.e-rowcell').length && td) {
                sf.base.setStyleAttribute(tr[trs[i]].querySelectorAll('td.e-rowcell')[idx], { 'display': displayVal });
                if (tr[trs[i]].querySelectorAll('td.e-rowcell')[idx].classList.contains('e-hide')) {
                    sf.base.removeClass([tr[trs[i]].querySelectorAll('td.e-rowcell')[idx]], ['e-hide']);
                }
                if (this.parent.isRowDragable()) {
                    var index = this.parent.getFrozenColumns() ? idx : idx + 1;
                    rows[trs[i]].cells[index].visible = displayVal === '' ? true : false;
                }
                else {
                    rows[trs[i]].cells[idx].visible = displayVal === '' ? true : false;
                }
            }
        }
        this.parent.notify(infiniteShowHide, { visible: displayVal, index: idx, isFreeze: this.isInfiniteFreeze });
    };
    ContentRender.prototype.infiniteRowVisibility = function (isFreeze) {
        var infiniteData;
        if (this.parent.enableInfiniteScrolling) {
            this.isInfiniteFreeze = isFreeze;
            if (this.parent.infiniteScrollSettings.enableCache) {
                infiniteData = isFreeze ? this.getCurrentBlockInfiniteRecords(true) : this.getCurrentBlockInfiniteRecords();
            }
            else {
                infiniteData = isFreeze ? this.visibleFrozenRows : this.visibleRows;
            }
        }
        return infiniteData;
    };
    ContentRender.prototype.colGroupRefresh = function () {
        if (this.getColGroup()) {
            var colGroup = void 0;
            if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
                && this.parent.contentModule.isXaxis()) {
                colGroup = this.parent.getMovableVirtualHeader().querySelector('colgroup').cloneNode(true);
            }
            else {
                colGroup = this.getHeaderColGroup();
            }
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    };
    ContentRender.prototype.getHeaderColGroup = function () {
        return sf.base.isBlazor() ? this.parent.getHeaderTable().querySelector('colgroup').cloneNode(true) :
            this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true);
    };
    ContentRender.prototype.initializeContentDrop = function () {
        var gObj = this.parent;
        this.droppable = new sf.base.Droppable(gObj.element, {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    ContentRender.prototype.droppableDestroy = function () {
        if (this.droppable && !this.droppable.isDestroyed) {
            this.droppable.destroy();
        }
    };
    ContentRender.prototype.canSkip = function (column, row, index) {
        /**
         * Skip the toggle visiblity operation when one of the following success
         * 1. Grid has empty records
         * 2. column visible property is unchanged
         * 3. cell`s isVisible property is same as column`s visible property.
         */
        return sf.base.isNullOrUndefined(row) || //(1)
            sf.base.isNullOrUndefined(column.visible) || //(2)    
            row.cells[index].visible === column.visible; //(3)
    };
    ContentRender.prototype.getModelGenerator = function () {
        return this.generator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    };
    ContentRender.prototype.renderEmpty = function (tbody) {
        if (sf.base.isBlazor() && !this.parent.isJsComponent && this.parent.frozenRows) {
            return;
        }
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector('tbody').innerHTML = '';
        }
    };
    ContentRender.prototype.setSelection = function (uid, set, clearAll) {
        this.parent.notify(setFreezeSelection, { uid: uid, set: set, clearAll: clearAll });
        var isFrozen = this.parent.isFrozenGrid();
        if (isFrozen && this.parent.enableVirtualization) {
            return;
        }
        if (isFrozen) {
            var rows = this.getMovableRows().filter(function (row) { return clearAll || uid === row.uid; });
            for (var i = 0; i < rows.length; i++) {
                rows[i].isSelected = set;
            }
        }
        var row = this.getRows().filter(function (row) { return clearAll || uid === row.uid; });
        for (var j = 0; j < row.length; j++) {
            row[j].isSelected = set;
            var cells = row[j].cells;
            for (var k = 0; k < cells.length; k++) {
                cells[k].isSelected = set;
            }
        }
    };
    ContentRender.prototype.getRowByIndex = function (index) {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getDataRows()[index];
    };
    ContentRender.prototype.getInfiniteRowIndex = function (index) {
        if (this.parent.infiniteScrollSettings.enableCache) {
            var fRows = this.parent.frozenRows;
            var idx = fRows > index ? 0 : fRows;
            var firstRowIndex = parseInt(this.parent.getRows()[idx].getAttribute('aria-rowindex'), 10);
            index = fRows > index ? index : (index - firstRowIndex) + fRows;
        }
        return index;
    };
    ContentRender.prototype.getVirtualRowIndex = function (index) {
        return index;
    };
    ContentRender.prototype.getMovableRowByIndex = function (index) {
        index = this.getInfiniteRowIndex(index);
        return this.parent.getMovableDataRows()[index];
    };
    ContentRender.prototype.enableAfterRender = function (e) {
        if (e.module === 'group' && e.enable) {
            this.generator = this.getModelGenerator();
        }
    };
    ContentRender.prototype.setRowObjects = function (rows) {
        this.rows = rows;
    };
    /** @hidden */
    ContentRender.prototype.immutableModeRendering = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        var gObj = this.parent;
        gObj.hideSpinner();
        var key = gObj.getPrimaryKeyFieldNames()[0];
        var oldKeys = {};
        var newKeys = {};
        var newRowObjs = [];
        var oldIndexes = {};
        var oldRowObjs = gObj.getRowsObject().slice();
        var batchChangeKeys = this.getBatchEditedRecords(key, oldRowObjs);
        var newIndexes = {};
        var hasBatch = Object.keys(batchChangeKeys).length !== 0;
        if (gObj.getContent().querySelector('.e-emptyrow') || args.requestType === 'reorder'
            || this.parent.groupSettings.columns.length) {
            this.refreshContentRows(args);
        }
        else {
            if (gObj.currentViewData.length === 0) {
                return;
            }
            var oldRowElements = {};
            var tbody = gObj.createElement('tbody');
            var dataSource = gObj.currentViewData;
            var trs = [].slice.call(this.getTable().querySelector('tbody').children);
            if (this.prevCurrentView.length) {
                var prevLen = this.prevCurrentView.length;
                var currentLen = dataSource.length;
                if (prevLen === currentLen) {
                    for (var i = 0; i < currentLen; i++) {
                        if (this.parent.editSettings.mode === 'Batch'
                            && trs[i].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        newKeys[dataSource[i][key]] = oldKeys[this.prevCurrentView[i][key]] = i;
                        newIndexes[i] = dataSource[i][key];
                        oldRowElements[oldRowObjs[i].uid] = trs[i];
                        oldIndexes[i] = this.prevCurrentView[i][key];
                    }
                }
                else {
                    for (var i = 0; i < currentLen; i++) {
                        newKeys[dataSource[i][key]] = i;
                        newIndexes[i] = dataSource[i][key];
                    }
                    for (var i = 0; i < prevLen; i++) {
                        if (this.parent.editSettings.mode === 'Batch'
                            && trs[i].classList.contains('e-insertedrow')) {
                            trs.splice(i, 1);
                            --i;
                            continue;
                        }
                        oldRowElements[oldRowObjs[i].uid] = trs[i];
                        oldKeys[this.prevCurrentView[i][key]] = i;
                        oldIndexes[i] = this.prevCurrentView[i][key];
                    }
                }
            }
            for (var i = 0; i < dataSource.length; i++) {
                var oldIndex = oldKeys[dataSource[i][key]];
                if (!sf.base.isNullOrUndefined(oldIndex)) {
                    var isEqual = false;
                    if (this.mutableData) {
                        isEqual = this.objectEqualityChecker(this.prevCurrentView[i], dataSource[i]);
                    }
                    var tr = oldRowElements[oldRowObjs[oldIndex].uid];
                    newRowObjs.push(oldRowObjs[oldIndex]);
                    if (this.rowElements[i] && this.rowElements[i].getAttribute('data-uid') === newRowObjs[i].uid
                        && ((hasBatch && sf.base.isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                            || (!hasBatch && (isEqual || this.prevCurrentView[i] === dataSource[i])))) {
                        if (oldIndex !== i) {
                            this.refreshImmutableContent(i, tr, newRowObjs[i]);
                        }
                        tbody.appendChild(tr);
                        continue;
                    }
                    if ((hasBatch && !sf.base.isNullOrUndefined(batchChangeKeys[newIndexes[i]]))
                        || (!this.mutableData && dataSource[i] !== this.prevCurrentView[oldIndex])
                        || (this.mutableData && !isEqual)) {
                        oldRowObjs[oldIndex].setRowValue(dataSource[i]);
                    }
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                }
                else {
                    var row = new RowRenderer(this.serviceLocator, null, gObj);
                    var modelData = this.generator.generateRows([dataSource[i]]);
                    newRowObjs.push(modelData[0]);
                    var tr = row.render(modelData[0], gObj.getColumns());
                    tbody.appendChild(tr);
                    this.refreshImmutableContent(i, tr, newRowObjs[i]);
                }
            }
            this.rows = newRowObjs;
            this.rowElements = [].slice.call(tbody.children);
            sf.base.remove(this.getTable().querySelector('tbody'));
            this.getTable().appendChild(tbody);
            this.parent.trigger(dataBound, {}, function () {
                if (_this.parent.allowTextWrap) {
                    _this.parent.notify(freezeRender, { case: 'textwrap' });
                }
            });
            if (args) {
                var action = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
        }
    };
    ContentRender.prototype.objectEqualityChecker = function (old, next) {
        var keys = Object.keys(old);
        var isEqual = true;
        for (var i = 0; i < keys.length; i++) {
            if (old[keys[i]] !== next[keys[i]]) {
                isEqual = false;
                break;
            }
        }
        return isEqual;
    };
    ContentRender.prototype.getBatchEditedRecords = function (primaryKey, rows) {
        var keys = {};
        var changes = this.parent.getBatchChanges();
        var changedRecords = [];
        var addedRecords = [];
        if (Object.keys(changes).length) {
            changedRecords = changes.changedRecords;
            addedRecords = changes.addedRecords;
        }
        var args = { cancel: false };
        this.parent.notify(immutableBatchCancel, { rows: rows, args: args });
        if (addedRecords.length) {
            if (this.parent.editSettings.newRowPosition === 'Bottom') {
                rows.splice(rows.length - 1, addedRecords.length);
            }
            else {
                if (!args.cancel) {
                    rows.splice(0, addedRecords.length);
                }
            }
        }
        for (var i = 0; i < changedRecords.length; i++) {
            keys[changedRecords[i][primaryKey]] = i;
        }
        return keys;
    };
    ContentRender.prototype.refreshImmutableContent = function (index, tr, row) {
        row.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        row.isAltRow ? tr.classList.add('e-altrow') : tr.classList.remove('e-altrow');
        row.index = index;
        row.edit = undefined;
        row.isDirty = false;
        tr.setAttribute('aria-rowindex', index.toString());
        this.updateCellIndex(tr, index);
    };
    ContentRender.prototype.updateCellIndex = function (rowEle, index) {
        for (var i = 0; i < rowEle.cells.length; i++) {
            rowEle.cells[i].setAttribute('index', index.toString());
        }
    };
    return ContentRender;
}());

/**
 * Content module is used to render grid content
 * @hidden
 */
var HeaderRender = /** @class */ (function () {
    /**
     * Constructor for header renderer module
     */
    function HeaderRender(parent, serviceLocator) {
        var _this = this;
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        this.isFirstCol = false;
        this.isReplaceDragEle = true;
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = _this.draggable.currentStateTarget;
            var parentEle = parentsUntil(target, 'e-headercell');
            if (!(gObj.allowReordering || gObj.allowGrouping) || (!sf.base.isNullOrUndefined(parentEle)
                && parentEle.querySelectorAll('.e-checkselectall').length > 0)) {
                return false;
            }
            var visualElement = _this.parent.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
            var element = target.classList.contains('e-headercell') ? target : parentEle;
            if (!element || (!gObj.allowReordering && element.classList.contains('e-stackedheadercell'))) {
                return false;
            }
            var height = element.offsetHeight;
            var headercelldiv = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
            var col;
            if (headercelldiv) {
                if (element.querySelector('.e-stackedheadercelldiv')) {
                    col = gObj.getStackedHeaderColumnByHeaderText(headercelldiv.innerText.trim(), gObj.columns);
                }
                else {
                    col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
                }
                _this.column = col;
                if (_this.column.lockColumn) {
                    return false;
                }
                visualElement.setAttribute('e-mappinguid', _this.column.uid);
            }
            if (col && !sf.base.isNullOrUndefined(col.headerTemplate)) {
                if (!sf.base.isNullOrUndefined(col.headerTemplate)) {
                    var result = void 0;
                    var colIndex = gObj.getColumnIndexByField(col.field);
                    result = col.getHeaderTemplate()(sf.base.extend({ 'index': colIndex }, col), gObj, 'headerTemplate');
                    appendChildren(visualElement, result);
                }
                else {
                    visualElement.innerHTML = col.headerTemplate;
                }
            }
            else {
                visualElement.innerHTML = headercelldiv ?
                    col.headerText : element.firstElementChild.innerHTML;
            }
            visualElement.style.width = element.offsetWidth + 'px';
            visualElement.style.height = element.offsetHeight + 'px';
            visualElement.style.lineHeight = (height - 6).toString() + 'px';
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            gObj.notify(columnDragStart, { target: _this.draggable.currentStateTarget, column: _this.column, event: e.event });
            if (sf.base.isBlazor()) {
                e.bindEvents(e.dragElement);
            }
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var target = e.target;
            if (target) {
                var closest$$1 = sf.base.closest(target, '.e-grid');
                var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                if (!closest$$1 || closest$$1.getAttribute('id') !== gObj.element.getAttribute('id')) {
                    sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    if (gObj.allowReordering) {
                        gObj.element.querySelector('.e-reorderuparrow').style.display = 'none';
                        gObj.element.querySelector('.e-reorderdownarrow').style.display = 'none';
                    }
                    if (!gObj.groupSettings.allowReordering) {
                        return;
                    }
                }
                gObj.notify(columnDrag, { target: e.target, column: _this.column, event: e.event });
            }
        };
        this.dragStop = function (e) {
            var gObj = _this.parent;
            var cancel;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
                (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
                (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
                sf.base.remove(e.helper);
                cancel = true;
            }
            gObj.notify(columnDragStop, { target: e.target, event: e.event, column: _this.column, cancel: cancel });
        };
        this.drop = function (e) {
            var gObj = _this.parent;
            var uid = e.droppedElement.getAttribute('e-mappinguid');
            var closest$$1 = sf.base.closest(e.target, '.e-grid');
            sf.base.remove(e.droppedElement);
            if (closest$$1 && closest$$1.getAttribute('id') !== gObj.element.getAttribute('id') ||
                !(gObj.allowReordering || gObj.allowGrouping)) {
                return;
            }
            gObj.notify(headerDrop, { target: e.target, uid: uid, droppedElement: e.droppedElement });
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.widthService = this.serviceLocator.getService('widthService');
        if (this.parent.isDestroyed) {
            return;
        }
        if (!this.parent.enableColumnVirtualization
            && !this.parent.getFrozenLeftColumnsCount() && !this.parent.getFrozenRightColumnsCount()) {
            this.parent.on(columnVisibilityChanged, this.setVisible, this);
        }
        this.parent.on(columnPositionChanged, this.colPosRefresh, this);
    }
    /**
     * The function is used to render grid header div
     */
    HeaderRender.prototype.renderPanel = function () {
        var div = this.parent.element.querySelector('.e-gridheader');
        var isRendered = (div != null);
        div = isRendered ? div : this.parent.createElement('div', { className: 'e-gridheader' });
        var innerDiv = isRendered ? div.querySelector('.e-headercontent') :
            this.parent.createElement('div', { className: 'e-headercontent' });
        this.toggleStackClass(div);
        div.appendChild(innerDiv);
        this.setPanel(div);
        if (!isRendered) {
            this.parent.element.appendChild(div);
        }
    };
    /**
     * The function is used to render grid header table
     */
    HeaderRender.prototype.renderTable = function () {
        var headerDiv = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        if (!this.parent.getFrozenColumns() && !this.parent.getFrozenRightColumnsCount() && !this.parent.getFrozenLeftColumnsCount()) {
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
        }
        this.parent.notify(headerRefreshed, { rows: this.rows, args: { isFrozen: this.parent.isFrozenGrid() } });
    };
    /**
     * Get the header content div element of grid
     * @return {Element}
     */
    HeaderRender.prototype.getPanel = function () {
        return this.headerPanel;
    };
    /**
     * Set the header content div element of grid
     * @param  {Element} panel
     */
    HeaderRender.prototype.setPanel = function (panel) {
        this.headerPanel = panel;
    };
    /**
     * Get the header table element of grid
     * @return {Element}
     */
    HeaderRender.prototype.getTable = function () {
        return this.headerTable;
    };
    /**
     * Set the header table element of grid
     * @param  {Element} table
     */
    HeaderRender.prototype.setTable = function (table) {
        this.headerTable = table;
    };
    /**
     * Get the header colgroup element
     * @returns {Element}
     */
    HeaderRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    /**
     * Set the header colgroup element
     * @param {Element} colgroup
     * @returns {Element}
     */
    HeaderRender.prototype.setColGroup = function (colGroup) {
        return this.colgroup = colGroup;
    };
    /**
     * Get the header row element collection.
     * @return {Element[]}
     */
    HeaderRender.prototype.getRows = function () {
        var table = this.getTable();
        return table.tHead.rows;
    };
    /**
     * The function is used to create header table elements
     * @return {Element}
     * @hidden
     */
    HeaderRender.prototype.createHeaderTable = function () {
        var skipDom = sf.base.isBlazor() && this.parent.frozenRows !== 0;
        var table = this.createTable();
        var innerDiv = this.getPanel().querySelector('.e-headercontent');
        if (!skipDom) {
            innerDiv.appendChild(table);
        }
        return innerDiv;
    };
    /**
     * @hidden
     */
    HeaderRender.prototype.createTable = function (tableEle) {
        if (tableEle === void 0) { tableEle = null; }
        var skipDom = sf.base.isBlazor() && this.parent.frozenRows !== 0;
        var gObj = this.parent;
        var isFrozen = gObj.isFrozenGrid();
        if (!(sf.base.isBlazor() && !gObj.isJsComponent) && this.getTable() && !isFrozen) {
            sf.base.remove(this.getTable());
        }
        var columns = gObj.getColumns();
        var innerDiv = this.getPanel().querySelector('.e-headercontent');
        var table = skipDom ? tableEle || innerDiv.querySelector('.e-table') :
            this.parent.createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        var findHeaderRow = this.createHeaderContent();
        var thead = findHeaderRow.thead;
        var tbody = this.parent.createElement('tbody', { className: this.parent.frozenRows ? '' : 'e-hide' });
        this.caption = this.parent.createElement('caption', { innerHTML: this.parent.element.id + '_header_table', className: 'e-hide' });
        var colGroup = this.parent.createElement('colgroup');
        var rowBody = this.parent.createElement('tr');
        var bodyCell;
        var rows = this.rows = findHeaderRow.rows;
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header, this.parent);
        for (var i = 0, len = rows.length; i < len; i++) {
            for (var j = 0, len_1 = rows[i].cells.length; j < len_1; j++) {
                var cell = rows[i].cells[j];
                bodyCell = this.parent.createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        if (!skipDom) {
            tbody.appendChild(rowBody);
        }
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        if (!skipDom) {
            table.appendChild(tbody);
        }
        table.appendChild(this.caption);
        this.ariaService.setOptions(table, { colcount: gObj.getColumns().length.toString() });
        return table;
    };
    HeaderRender.prototype.createHeaderContent = function () {
        var gObj = this.parent;
        var frozenMode = gObj.getFrozenMode();
        var columns = gObj.getColumns();
        var thead = this.parent.createElement('thead');
        var colHeader = this.parent.createElement('tr', { className: 'e-columnheader' });
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header, gObj);
        rowRenderer.element = colHeader;
        var rows = [];
        var headerRow;
        this.colDepth = measureColumnDepth(gObj.columns);
        for (var i = 0, len = this.colDepth; i < len; i++) {
            rows[i] = this.generateRow(i);
            rows[i].cells = [];
        }
        if (frozenMode !== 'Right') {
            rows = this.ensureColumns(rows);
        }
        rows = this.getHeaderCells(rows);
        if (frozenMode === 'Right') {
            rows = this.ensureColumns(rows);
        }
        var frzCols = this.parent.getFrozenColumns();
        if (this.parent.isRowDragable() && this.parent.isFrozenGrid() && rows[0].cells[1]) {
            var colFreezeMode = rows[0].cells[1].column.getFreezeTableName();
            if (colFreezeMode === 'movable' || (frozenMode === 'Left-Right' && colFreezeMode === 'frozen-right')) {
                if (frozenMode === 'Right') {
                    rows[0].cells.pop();
                }
                else {
                    rows[0].cells.shift();
                }
            }
            else if (!frzCols && colFreezeMode === 'frozen-left') {
                rows[0].cells[0].column.freeze = colFreezeMode === 'frozen-left' ? 'Left' : 'Right';
            }
            else if (frozenMode === 'Right' && colFreezeMode === 'frozen-right') {
                rows[0].cells[rows[0].cells.length - 1].column.freeze = 'Right';
            }
        }
        for (var i = 0, len = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[i], columns);
            if (this.parent.rowHeight && headerRow.querySelector('.e-headercell')) {
                headerRow.style.height = this.parent.rowHeight + 'px';
            }
            thead.appendChild(headerRow);
        }
        var findHeaderRow = {
            thead: thead,
            rows: rows
        };
        return findHeaderRow;
    };
    HeaderRender.prototype.updateColGroup = function (colGroup) {
        var cols = this.parent.getColumns();
        var col;
        var indexes = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && this.parent.getFrozenColumns()
            && this.parent.contentModule.isXaxis()) {
            cols = sf.base.extend([], this.parent.getColumns());
            cols.splice(0, this.parent.getFrozenColumns());
        }
        colGroup.id = this.parent.element.id + 'colGroup';
        if (this.parent.allowGrouping) {
            for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) {
                    continue;
                }
                col = this.parent.createElement('col', { className: 'e-group-intent' });
                colGroup.appendChild(col);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            col = this.parent.createElement('col', { className: 'e-detail-intent' });
            colGroup.appendChild(col);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            col = this.parent.createElement('col');
            if (cols[i].visible === false) {
                sf.base.setStyleAttribute(col, { 'display': 'none' });
            }
            colGroup.appendChild(col);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            col = this.parent.createElement('col', { className: 'e-drag-intent' });
            colGroup.appendChild(col);
        }
        return colGroup;
    };
    HeaderRender.prototype.ensureColumns = function (rows) {
        //TODO: generate dummy column for group, detail, stacked row here; ensureColumns here
        var gObj = this.parent;
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (gObj.allowGrouping) {
                for (var c = 0, len_2 = gObj.groupSettings.columns.length; c < len_2; c++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(c) === -1) {
                        continue;
                    }
                    rows[i].cells.push(this.generateCell({}, CellType.HeaderIndent));
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                var args = {};
                this.parent.notify(detailIndentCellInfo, args);
                rows[i].cells.push(this.generateCell(args, CellType.DetailHeader));
            }
            if (gObj.isRowDragable()) {
                rows[i].cells.push(this.generateCell({}, CellType.RowDragHIcon));
            }
        }
        return rows;
    };
    HeaderRender.prototype.getHeaderCells = function (rows) {
        var thead = this.parent.getHeaderTable() && this.parent.getHeaderTable().querySelector('thead');
        var cols = this.parent.enableColumnVirtualization ?
            this.parent.getColumns(this.parent.enablePersistence) : this.parent.columns;
        var tableName;
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()
            && this.parent.contentModule.isXaxis()) {
            tableName = 'movable';
        }
        else {
            tableName = getFrozenTableName(this.parent);
        }
        this.frzIdx = 0;
        this.notfrzIdx = 0;
        if (this.parent.lockcolPositionCount) {
            for (var i = 0; i < cols.length; i++) {
                this.lockColsRendered = false;
                rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (cols.length - 1), thead, tableName);
            }
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            this.notfrzIdx = 0;
            this.lockColsRendered = true;
            rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (len - 1), thead, tableName);
        }
        return rows;
    };
    HeaderRender.prototype.appendCells = function (cols, rows, index, isFirstObj, isFirstCol, isLastCol, isMovable, tableName) {
        var lastCol = isLastCol ? 'e-lastcell' : '';
        var isFrozen = this.parent.isFrozenGrid();
        var isLockColumn = !this.parent.lockcolPositionCount
            || (cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered);
        var isFrozenLockColumn = !this.parent.lockcolPositionCount || (cols.lockColumn && !this.lockColsRendered)
            || (!cols.lockColumn && this.lockColsRendered);
        var scrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
        var left;
        if (isFrozen && scrollbar && this.parent.enableColumnVirtualization) {
            left = scrollbar.scrollLeft;
        }
        if (!cols.columns) {
            if (left && left > 0 && this.parent.contentModule.isXaxis()
                && this.parent.inViewIndexes[0] !== 0 && cols.getFreezeTableName() === 'movable') {
                rows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
            }
            else {
                if ((!isFrozen && isLockColumn) || (isFrozen && cols.getFreezeTableName() === tableName && isFrozenLockColumn)) {
                    rows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
                }
            }
            if (this.parent.lockcolPositionCount) {
                if ((this.frzIdx + this.notfrzIdx < this.parent.frozenColumns) &&
                    ((cols.lockColumn && !this.lockColsRendered) || (!cols.lockColumn && this.lockColsRendered))) {
                    this.frzIdx++;
                }
                else {
                    this.notfrzIdx++;
                }
            }
            else {
                this.frzIdx++;
            }
        }
        else {
            this.isFirstCol = false;
            var colSpan = this.getCellCnt(cols, 0);
            if (colSpan) {
                var stackedLockColsCount = this.getStackedLockColsCount(cols, 0);
                var isStackedLockColumn = this.parent.lockcolPositionCount === 0
                    || (!this.lockColsRendered && stackedLockColsCount !== 0)
                    || (this.lockColsRendered && (colSpan - stackedLockColsCount) !== 0);
                var isFrozenStack = isFrozen && this.ensureStackedFrozen(cols.columns, tableName, false);
                if ((!isFrozen && isStackedLockColumn) || isFrozenStack) {
                    rows[index].cells.push(new Cell({
                        cellType: CellType.StackedHeader, column: cols,
                        colSpan: this.getColSpan(colSpan, stackedLockColsCount, cols.columns, tableName, isFrozen)
                    }));
                }
            }
            if (this.parent.lockcolPositionCount && !this.lockColsRendered) {
                for (var i = 0; i < cols.columns.length; i++) {
                    rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, i === 0, i === (cols.columns.length - 1) && isLastCol, isMovable, tableName);
                }
            }
            if (this.lockColsRendered) {
                for (var i = 0, len = cols.columns.length; i < len; i++) {
                    var isFirstCol_1 = this.isFirstCol = cols.columns[i].visible && !this.isFirstCol && len !== 1;
                    var isLaststackedCol = i === (len - 1);
                    rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, isFirstCol_1, isLaststackedCol && isLastCol, isMovable, tableName);
                }
            }
        }
        return rows;
    };
    HeaderRender.prototype.ensureStackedFrozen = function (columns, tableName, isTrue) {
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            if (columns[i].columns) {
                isTrue = this.ensureStackedFrozen(columns[i].columns, tableName, isTrue);
            }
            else if (columns[i].getFreezeTableName() === tableName) {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    };
    HeaderRender.prototype.getStackedLockColsCount = function (col, lockColsCount) {
        if (col.columns) {
            for (var i = 0; i < col.columns.length; i++) {
                lockColsCount = this.getStackedLockColsCount(col.columns[i], lockColsCount);
            }
        }
        else if (col.lockColumn) {
            lockColsCount++;
        }
        return lockColsCount;
    };
    HeaderRender.prototype.getColSpan = function (colSpan, stackedLockColsCount, columns, tableName, isFrozen) {
        if (isFrozen) {
            colSpan = this.getFrozenColSpan(columns, tableName, 0);
        }
        else if (this.parent.lockcolPositionCount) {
            colSpan = !this.lockColsRendered ? stackedLockColsCount : colSpan - stackedLockColsCount;
        }
        return colSpan;
    };
    HeaderRender.prototype.getFrozenColSpan = function (columns, tableName, count) {
        var length = columns.length;
        for (var i = 0; i < length; i++) {
            if (columns[i].columns) {
                count = this.getFrozenColSpan(columns[i].columns, tableName, count);
            }
            else if (columns[i].getFreezeTableName() === tableName) {
                count++;
            }
        }
        return count;
    };
    HeaderRender.prototype.generateRow = function (index) {
        return new Row({});
    };
    HeaderRender.prototype.generateCell = function (column, cellType, rowSpan, className, rowIndex, colIndex) {
        var opt = {
            'visible': column.visible,
            'isDataCell': false,
            'isTemplate': !sf.base.isNullOrUndefined(column.headerTemplate),
            'rowID': '',
            'column': column,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': colIndex
        };
        if (!opt.rowSpan || opt.rowSpan < 2) {
            delete opt.rowSpan;
        }
        return new Cell(opt);
    };
    /**
     * Function to hide header table column based on visible property
     * @param  {Column[]} columns?
     */
    HeaderRender.prototype.setVisible = function (columns) {
        var gObj = this.parent;
        var rows = [].slice.call(this.getRows()); //NodeList -> Array        
        var displayVal;
        var idx;
        var frzCols = gObj.getFrozenColumns();
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            if (frzCols) {
                var normalizedfrzCols = this.parent.isRowDragable() ? frzCols + 1 : frzCols;
                if (idx < normalizedfrzCols) {
                    if (sf.base.isBlazor() && gObj.isServerRendered) {
                        sf.base.setStyleAttribute(this.getTable().querySelector('colgroup').children[idx], { 'display': displayVal });
                        sf.base.setStyleAttribute(this.getTable().querySelectorAll('th')[idx], { 'display': displayVal });
                    }
                    else {
                        sf.base.setStyleAttribute(this.getColGroup().children[idx], { 'display': displayVal });
                    }
                }
                else {
                    var mTblColGrp = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup');
                    var mTbl = gObj.getHeaderContent().querySelector('.e-movableheader').querySelector('table');
                    sf.base.setStyleAttribute(mTblColGrp.children[idx - normalizedfrzCols], { 'display': displayVal });
                    if (sf.base.isBlazor() && gObj.isServerRendered) {
                        sf.base.setStyleAttribute(mTbl.querySelectorAll('th')[idx - frzCols], { 'display': displayVal });
                    }
                }
            }
            else {
                sf.base.setStyleAttribute(this.getColGroup().children[idx], { 'display': displayVal });
            }
        }
        this.refreshUI();
    };
    HeaderRender.prototype.colPosRefresh = function () {
        if (sf.base.isBlazor() && this.parent.isServerRendered && this.parent.frozenRows && this.parent.getFrozenColumns()) {
            this.freezeReorder = true;
        }
        this.refreshUI();
    };
    /**
     * Refresh the header of the Grid.
     * @returns {void}
     */
    HeaderRender.prototype.refreshUI = function () {
        var frzCols = this.parent.isFrozenGrid();
        var isVFTable = this.parent.enableColumnVirtualization && frzCols;
        var setFrozenTable = sf.base.isBlazor() && this.parent.isServerRendered && this.parent.frozenRows !== 0 && frzCols;
        var headerDiv = this.getPanel();
        this.toggleStackClass(headerDiv);
        var table = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table')
            : this.getTable();
        if (isVFTable) {
            table = this.parent.contentModule.getVirtualFreezeHeader();
        }
        if (setFrozenTable && !isVFTable) {
            table = this.freezeReorder ? this.headerPanel.querySelector('.e-movableheader').querySelector('.e-table') :
                this.headerPanel.querySelector('.e-frozenheader').querySelector('.e-table');
        }
        if (table) {
            if (sf.base.isBlazor() && this.parent.isServerRendered) {
                table.removeChild(table.querySelector('colgroup'));
                table.removeChild(table.querySelector('thead'));
            }
            else {
                sf.base.remove(table);
                table.removeChild(table.firstChild);
                table.removeChild(table.childNodes[0]);
            }
            var colGroup = this.parent.createElement('colgroup');
            var findHeaderRow = this.createHeaderContent();
            this.rows = findHeaderRow.rows;
            table.insertBefore(findHeaderRow.thead, table.firstChild);
            this.updateColGroup(colGroup);
            table.insertBefore(this.setColGroup(colGroup), table.firstChild);
            if (!isVFTable && !setFrozenTable) {
                this.setTable(table);
            }
            if (!(sf.base.isBlazor() && this.parent.isServerRendered)) {
                this.appendContent(table);
            }
            this.parent.notify(colGroupRefresh, {});
            this.widthService.setWidthToColumns();
            this.parent.updateDefaultCursor();
            if (!frzCols || (this.parent.enableColumnVirtualization && frzCols)) {
                this.initializeHeaderDrag();
            }
            var rows = [].slice.call(headerDiv.querySelectorAll('tr.e-columnheader'));
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var gCells = [].slice.call(row.querySelectorAll('.e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
            }
            if (!frzCols) {
                this.parent.notify(headerRefreshed, { rows: this.rows, args: { isFrozen: frzCols } });
            }
            if (this.parent.enableColumnVirtualization && parentsUntil(table, 'e-movableheader')) {
                this.parent.notify(headerRefreshed, { rows: this.rows, args: { isFrozen: false, isXaxis: true } });
            }
            if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'Header') {
                wrap(rows, true);
            }
        }
    };
    HeaderRender.prototype.toggleStackClass = function (div) {
        var column = this.parent.columns;
        var stackedHdr = column.some(function (column) { return !sf.base.isNullOrUndefined(column.columns); });
        if (stackedHdr) {
            div.classList.add('e-stackedheader');
        }
        else {
            div.classList.remove('e-stackedheader');
        }
    };
    HeaderRender.prototype.appendContent = function (table) {
        this.getPanel().querySelector('.e-headercontent').appendChild(table);
    };
    HeaderRender.prototype.getCellCnt = function (col, cnt) {
        if (col.columns) {
            for (var i = 0, len = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[i], cnt);
            }
        }
        else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    };
    HeaderRender.prototype.initializeHeaderDrag = function () {
        var gObj = this.parent;
        if (!(this.parent.allowReordering || (this.parent.allowGrouping && this.parent.groupSettings.showDropArea))) {
            return;
        }
        this.draggable = new sf.base.Draggable(gObj.getHeaderContent(), {
            dragTarget: '.e-headercell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop,
            abort: '.e-rhandler',
            isReplaceDragEle: this.isReplaceDragEle
        });
    };
    HeaderRender.prototype.initializeHeaderDrop = function () {
        var gObj = this.parent;
        var drop = new sf.base.Droppable(gObj.getHeaderContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    return HeaderRender;
}());

/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
var CellRenderer = /** @class */ (function () {
    function CellRenderer(parent, locator) {
        this.localizer = locator.getService('localization');
        this.formatter = locator.getService('valueFormatter');
        this.parent = parent;
        this.element = this.parent.createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell', tabindex: '-1' } });
        this.rowChkBox = this.parent.createElement('input', { className: 'e-checkselect', attrs: { 'type': 'checkbox' } });
    }
    /**
     * Function to return the wrapper for the TD content
     * @returns string
     */
    CellRenderer.prototype.getGui = function () {
        return '';
    };
    /**
     * Function to format the cell value.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.format = function (column, value, data) {
        if (!sf.base.isNullOrUndefined(column.format)) {
            if (column.type === 'number' && isNaN(parseInt(value, 10))) {
                value = null;
            }
            value = this.formatter.toView(value, column.getFormatter());
        }
        return sf.base.isNullOrUndefined(value) ? '' : value.toString();
    };
    CellRenderer.prototype.evaluate = function (node, cell, data, attributes$$1, fData, isEdit) {
        var _a;
        var result;
        if (cell.column.template) {
            var isReactCompiler = this.parent.isReact && typeof (cell.column.template) !== 'string';
            var literals = ['index'];
            var dummyData = extendObjWithFn({}, data, (_a = {}, _a[foreignKeyData] = fData, _a.column = cell.column, _a));
            var templateID = this.parent.element.id + cell.column.uid;
            var str = 'isStringTemplate';
            var index = 'index';
            if (sf.base.isBlazor() && isEdit) {
                var rNumber = this.parent.editSettings.mode !== 'Batch' ? parseInt(attributes$$1[index], 10) : null;
                result = cell.column.getColumnTemplate()(sf.base.extend({ 'index': attributes$$1[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str], rNumber);
                window[templateID] = null;
                if (this.parent.editSettings.mode !== 'Batch') {
                    sf.base.updateBlazorTemplate(templateID, 'Template', cell.column, false);
                }
            }
            else {
                if (isReactCompiler) {
                    var copied = { 'index': attributes$$1[literals[0]] };
                    cell.column.getColumnTemplate()(sf.base.extend(copied, dummyData), this.parent, 'columnTemplate', templateID, this.parent[str], null, node);
                    this.parent.renderTemplates();
                }
                else {
                    result = cell.column.getColumnTemplate()(sf.base.extend({ 'index': attributes$$1[literals[0]] }, dummyData), this.parent, 'template', templateID, this.parent[str]);
                }
            }
            if (!isReactCompiler) {
                appendChildren(node, result);
            }
            this.parent.notify('template-result', { template: result });
            result = null;
            node.setAttribute('aria-label', node.innerText + ' is template cell' + ' column header ' +
                cell.column.headerText);
            return false;
        }
        return true;
    };
    /**
     * Function to invoke the custom formatter available in the column object.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    CellRenderer.prototype.invokeFormatter = function (column, value, data) {
        if (!sf.base.isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                var formatter = column.formatter;
                value = new formatter().getValue(column, data);
            }
            else if (typeof column.formatter === 'function') {
                value = column.formatter(column, data);
            }
            else {
                value = column.formatter.getValue(column, data);
            }
        }
        return value;
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.render = function (cell, data, attributes$$1, isExpand, isEdit) {
        return this.refreshCell(cell, data, attributes$$1, isEdit);
    };
    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CellRenderer.prototype.refreshTD = function (td, cell, data, attributes$$1) {
        var isEdit = this.parent.editSettings.mode === 'Batch' && td.classList.contains('e-editedbatchcell');
        if (this.parent.isReact) {
            td.innerHTML = '';
            var cellIndex = td.cellIndex;
            var parentRow = td.parentElement;
            sf.base.remove(td);
            var newTD = this.refreshCell(cell, data, attributes$$1, isEdit);
            this.cloneAttributes(newTD, td);
            parentRow.cells.length !== cellIndex - 1 ? parentRow.insertBefore(newTD, parentRow.cells[cellIndex])
                : parentRow.appendChild(newTD);
        }
        else {
            var node = this.refreshCell(cell, data, attributes$$1, isEdit);
            td.innerHTML = '';
            td.setAttribute('aria-label', node.getAttribute('aria-label'));
            var elements = [].slice.call(node.childNodes);
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var elem = elements_1[_i];
                td.appendChild(elem);
            }
        }
    };
    // tslint:disable-next-line:no-any
    CellRenderer.prototype.cloneAttributes = function (target, source) {
        // tslint:disable-next-line:no-any
        var attrs = source.attributes;
        // tslint:disable-next-line:no-any
        var i = attrs.length;
        // tslint:disable-next-line:no-any
        var attr;
        while (i--) {
            attr = attrs[i];
            target.setAttribute(attr.name, attr.value);
        }
    };
    CellRenderer.prototype.refreshCell = function (cell, data, attributes$$1, isEdit) {
        var _a;
        var node = this.element.cloneNode();
        var column = cell.column;
        var fData;
        if (cell.isForeignKey) {
            fData = cell.foreignKeyData[0] || (_a = {}, _a[column.foreignKeyValue] = column.format ? null : '', _a);
        }
        //Prepare innerHtml
        var innerHtml = this.getGui();
        var value = cell.isForeignKey ? this.getValue(column.foreignKeyValue, fData, column) :
            this.getValue(column.field, data, column);
        if ((column.type === 'date' || column.type === 'datetime') && !sf.base.isNullOrUndefined(value)) {
            value = new Date(value);
        }
        value = this.format(column, value, data);
        innerHtml = value.toString();
        if (column.type === 'boolean' && !column.displayAsCheckBox) {
            var localeStr = (value !== 'true' && value !== 'false') ? null : value === 'true' ? 'True' : 'False';
            innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
        }
        var fromFormatter = this.invokeFormatter(column, value, data);
        innerHtml = !sf.base.isNullOrUndefined(column.formatter) ? sf.base.isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
        node.setAttribute('aria-label', innerHtml + ' column header ' + cell.column.headerText);
        if (this.evaluate(node, cell, data, attributes$$1, fData, isEdit) && column.type !== 'checkbox') {
            this.appendHtml(node, innerHtml, column.getDomSetter ? column.getDomSetter() : 'innerHTML');
        }
        else if (column.type === 'checkbox') {
            node.classList.add('e-gridchkbox');
            node.setAttribute('aria-label', 'checkbox');
            if (this.parent.selectionSettings.persistSelection) {
                value = value === 'true';
            }
            else {
                value = false;
            }
            var checkWrap = sf.buttons.createCheckBox(this.parent.createElement, false, { checked: value, label: ' ' });
            checkWrap.insertBefore(this.rowChkBox.cloneNode(), checkWrap.firstChild);
            node.appendChild(checkWrap);
        }
        if (this.parent.checkAllRows === 'Check' && this.parent.enableVirtualization) {
            cell.isSelected = true;
        }
        this.setAttributes(node, cell, attributes$$1);
        if (column.type === 'boolean' && column.displayAsCheckBox) {
            var checked = isNaN(parseInt(value.toString(), 10)) ? value === 'true' : parseInt(value.toString(), 10) > 0;
            var checkWrap = sf.buttons.createCheckBox(this.parent.createElement, false, { checked: checked, label: ' ' });
            node.innerHTML = '';
            checkWrap.classList.add('e-checkbox-disabled');
            node.appendChild(checkWrap);
            node.setAttribute('aria-label', checked + ' column header ' + cell.column.headerText);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    CellRenderer.prototype.appendHtml = function (node, innerHtml, property) {
        if (property === void 0) { property = 'innerHTML'; }
        node[property] = innerHtml;
        return node;
    };
    /**
     * @hidden
     */
    CellRenderer.prototype.setAttributes = function (node, cell, attributes$$1) {
        var column = cell.column;
        this.buildAttributeFromCell(node, cell, column.type === 'checkbox');
        setStyleAndAttributes(node, attributes$$1);
        setStyleAndAttributes(node, cell.attributes);
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.textAlign) {
            node.style.textAlign = column.textAlign;
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
    };
    CellRenderer.prototype.buildAttributeFromCell = function (node, cell, isCheckBoxType) {
        var attr = {};
        var prop = { 'colindex': 'aria-colindex' };
        var classes = [];
        if (cell.colSpan) {
            attr.colSpan = cell.colSpan;
        }
        if (cell.rowSpan) {
            attr.rowSpan = cell.rowSpan;
        }
        if (cell.isTemplate) {
            classes.push('e-templatecell');
        }
        if (cell.isSelected) {
            classes.push.apply(classes, ['e-selectionbackground', 'e-active']);
            if (isCheckBoxType) {
                node.querySelector('.e-frame').classList.add('e-check');
            }
        }
        if (cell.isColumnSelected) {
            classes.push.apply(classes, ['e-columnselection']);
        }
        if (!sf.base.isNullOrUndefined(cell.index)) {
            attr[prop.colindex] = cell.index;
        }
        if ((!cell.visible && !cell.isDataCell) ||
            (!sf.base.isNullOrUndefined(cell.column.visible) && !cell.column.visible)) {
            classes.push('e-hide');
        }
        attr.class = classes;
        setStyleAndAttributes(node, attr);
    };
    CellRenderer.prototype.getValue = function (field, data, column) {
        return column.valueAccessor(field, data, column);
    };
    return CellRenderer;
}());

/**
 * AriaService
 * @hidden
 */
var AriaService = /** @class */ (function () {
    function AriaService() {
    }
    AriaService.prototype.setOptions = function (target, options) {
        var props = Object.keys(options);
        for (var i = 0; i < props.length; i++) {
            setStateAndProperties(target, config[props[i]], options[props[i]]);
        }
    };
    AriaService.prototype.setExpand = function (target, expand) {
        setStateAndProperties(target, config.expand, expand);
    };
    AriaService.prototype.setSort = function (target, direction) {
        setStateAndProperties(target, config.sort, direction, typeof direction === 'boolean');
    };
    AriaService.prototype.setBusy = function (target, isBusy) {
        setStateAndProperties(target, config.busy, isBusy);
        setStateAndProperties(target, config.invalid, null, true);
    };
    AriaService.prototype.setGrabbed = function (target, isGrabbed, remove$$1) {
        setStateAndProperties(target, config.grabbed, isGrabbed, remove$$1);
    };
    AriaService.prototype.setDropTarget = function (target, isTarget) {
        setStateAndProperties(target, config.dropeffect, 'copy', !isTarget);
    };
    return AriaService;
}());
/**
 * @hidden
 */
function setStateAndProperties(target, attribute, value, remove$$1) {
    if (remove$$1 && target) {
        target.removeAttribute(attribute);
        return;
    }
    if (target) {
        target.setAttribute(attribute, value);
    }
}
var config = {
    expand: 'aria-expanded',
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    sort: 'aria-sort',
    busy: 'aria-busy',
    invalid: 'aria-invalid',
    grabbed: 'aria-grabbed',
    dropeffect: 'aria-dropeffect',
    haspopup: 'aria-haspopup',
    level: 'aria-level',
    colcount: 'aria-colcount',
    rowcount: 'aria-rowcount'
};

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * HeaderCellRenderer class which responsible for building header cell content.
 * @hidden
 */
var HeaderCellRenderer = /** @class */ (function (_super) {
    __extends$4(HeaderCellRenderer, _super);
    function HeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent
            .createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader', tabindex: '-1' } });
        _this.ariaService = new AriaService();
        _this.hTxtEle = _this.parent.createElement('span', { className: 'e-headertext' });
        _this.sortEle = _this.parent.createElement('div', { className: 'e-sortfilterdiv e-icons' });
        _this.gui = _this.parent.createElement('div');
        _this.chkAllBox = _this.parent.createElement('input', { className: 'e-checkselectall', attrs: { 'type': 'checkbox' } });
        return _this;
    }
    /**
     * Function to return the wrapper for the TH content.
     * @returns string
     */
    HeaderCellRenderer.prototype.getGui = function () {
        return this.gui.cloneNode();
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {Element}
     */
    HeaderCellRenderer.prototype.render = function (cell, data, attributes$$1) {
        var node = this.element.cloneNode();
        var fltrMenuEle = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    /**
     * Function to refresh the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Element} node
     */
    HeaderCellRenderer.prototype.refresh = function (cell, node) {
        this.clean(node);
        var fltrMenuEle = this.parent.createElement('div', { className: 'e-filtermenudiv e-icons e-icon-filter' });
        return this.prepareHeader(cell, node, fltrMenuEle);
    };
    HeaderCellRenderer.prototype.clean = function (node) {
        node.innerHTML = '';
    };
    /* tslint:disable-next-line:max-func-body-length */
    HeaderCellRenderer.prototype.prepareHeader = function (cell, node, fltrMenuEle) {
        var column = cell.column;
        var ariaAttr = {};
        //Prepare innerHtml
        var innerDIV = this.getGui();
        var hValueAccer;
        sf.base.attributes(innerDIV, {
            'e-mappinguid': column.uid,
            'class': 'e-headercelldiv'
        });
        if (!sf.base.isNullOrUndefined(column.headerValueAccessor)) {
            hValueAccer = this.getValue(column.headerText, column);
        }
        if (column.type !== 'checkbox') {
            var value = column.headerText;
            if (!sf.base.isNullOrUndefined(hValueAccer)) {
                value = hValueAccer;
            }
            var headerText = this.hTxtEle.cloneNode();
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
        }
        else {
            column.editType = 'booleanedit';
            var checkAllWrap = sf.buttons.createCheckBox(this.parent.createElement, false, { checked: false, label: ' ' });
            checkAllWrap.insertBefore(this.chkAllBox.cloneNode(), checkAllWrap.firstChild);
            innerDIV.appendChild(checkAllWrap);
            innerDIV.classList.add('e-headerchkcelldiv');
        }
        this.buildAttributeFromCell(node, cell);
        this.appendHtml(node, innerDIV);
        node.appendChild(this.sortEle.cloneNode());
        if ((this.parent.allowFiltering && this.parent.filterSettings.type !== 'FilterBar') &&
            (column.allowFiltering && !sf.base.isNullOrUndefined(column.field)) &&
            !(this.parent.showColumnMenu && column.showColumnMenu)) {
            sf.base.attributes(fltrMenuEle, {
                'e-mappinguid': 'e-flmenu-' + column.uid,
            });
            node.classList.add('e-fltr-icon');
            var matchFlColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFlColumns.length) {
                for (var index = 0; index < this.parent.columns.length; index++) {
                    for (var count = 0; count < this.parent.filterSettings.columns.length; count++) {
                        if (this.parent.filterSettings.columns[count].field === column.field) {
                            fltrMenuEle.classList.add('e-filtered');
                            matchFlColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.appendChild(fltrMenuEle.cloneNode());
        }
        if (cell.className) {
            node.classList.add(cell.className);
        }
        if (column.customAttributes) {
            setStyleAndAttributes(node, column.customAttributes);
        }
        if (column.allowSorting) {
            ariaAttr.sort = 'none';
        }
        if (column.allowGrouping) {
            ariaAttr.grabbed = false;
        }
        node = this.extendPrepareHeader(column, node);
        var result;
        var gridObj = this.parent;
        var colIndex = gridObj.getColumnIndexByField(column.field);
        if (!sf.base.isNullOrUndefined(column.headerTemplate)) {
            //need to pass the template id for blazor headertemplate
            var headerTempID = gridObj.element.id + column.uid + 'headerTemplate';
            var str = 'isStringTemplate';
            var col = sf.base.isBlazor() ? column.toJSON() : column;
            var isReactCompiler = this.parent.isReact && typeof (column.headerTemplate) !== 'string';
            if (isReactCompiler) {
                var copied = { 'index': colIndex };
                node.firstElementChild.innerHTML = '';
                column.getHeaderTemplate()(sf.base.extend(copied, col), gridObj, 'headerTemplate', headerTempID, this.parent[str], null, node.firstElementChild);
                this.parent.renderTemplates();
            }
            else {
                result = column.getHeaderTemplate()(sf.base.extend({ 'index': colIndex }, col), gridObj, 'headerTemplate', headerTempID, this.parent[str]);
                node.firstElementChild.innerHTML = '';
                appendChildren(node.firstElementChild, result);
            }
        }
        this.ariaService.setOptions(node, ariaAttr);
        if (!sf.base.isNullOrUndefined(column.headerTextAlign) || !sf.base.isNullOrUndefined(column.textAlign)) {
            var alignment = column.headerTextAlign || column.textAlign;
            innerDIV.style.textAlign = alignment;
            if (alignment === 'Right' || alignment === 'Left') {
                node.classList.add(alignment === 'Right' ? 'e-rightalign' : 'e-leftalign');
            }
            else if (alignment === 'Center') {
                node.classList.add('e-centeralign');
            }
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            if (column.type !== 'checkbox') {
                node.classList.add('e-ellipsistooltip');
            }
        }
        node.setAttribute('aria-rowspan', (!sf.base.isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
        node.setAttribute('aria-colspan', '1');
        this.parent.trigger(headerCellInfo, { cell: cell, node: node });
        return node;
    };
    HeaderCellRenderer.prototype.getValue = function (field, column) {
        return column.headerValueAccessor(field, column);
    };
    HeaderCellRenderer.prototype.extendPrepareHeader = function (column, node) {
        if (this.parent.showColumnMenu && column.showColumnMenu && !sf.base.isNullOrUndefined(column.field)) {
            var element = (this.parent.createElement('div', { className: 'e-icons e-columnmenu' }));
            var matchFilteredColumns = [];
            if (this.parent.filterSettings.columns.length && this.parent.filterSettings.columns.length !== matchFilteredColumns.length) {
                for (var i = 0; i < this.parent.columns.length; i++) {
                    for (var j = 0; j < this.parent.filterSettings.columns.length; j++) {
                        if (this.parent.filterSettings.columns[j].field === column.field) {
                            element.classList.add('e-filtered');
                            matchFilteredColumns.push(column.field);
                            break;
                        }
                    }
                }
            }
            node.classList.add('e-fltr-icon');
            node.appendChild(element);
        }
        if (this.parent.allowResizing) {
            var handler = this.parent.createElement('div');
            handler.className = column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    return HeaderCellRenderer;
}(CellRenderer));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 * @hidden
 */
var StackedHeaderCellRenderer = /** @class */ (function (_super) {
    __extends$5(StackedHeaderCellRenderer, _super);
    function StackedHeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TH', {
            className: 'e-headercell e-stackedheadercell', attrs: {
                role: 'columnheader',
                tabindex: '-1'
            }
        });
        return _this;
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {Element}
     */
    StackedHeaderCellRenderer.prototype.render = function (cell, data, attributes$$1) {
        var node = this.element.cloneNode();
        var div = this.parent.createElement('div', {
            className: 'e-stackedheadercelldiv',
            attrs: { 'e-mappinguid': cell.column.uid }
        });
        var column = cell.column;
        node.appendChild(div);
        if (!sf.base.isNullOrUndefined(column.headerTemplate)) {
            appendChildren(div, column.getHeaderTemplate()(column, this.parent, 'headerTemplate'));
        }
        else {
            this.appendHtml(div, column.headerText, column.getDomSetter());
        }
        if (cell.column.toolTip) {
            node.setAttribute('title', cell.column.toolTip);
        }
        if (column.clipMode === 'Clip' || (!column.clipMode && this.parent.clipMode === 'Clip')) {
            node.classList.add('e-gridclip');
        }
        else if (column.clipMode === 'EllipsisWithTooltip' || (!column.clipMode && this.parent.clipMode === 'EllipsisWithTooltip')) {
            node.classList.add('e-ellipsistooltip');
        }
        if (!sf.base.isNullOrUndefined(cell.column.textAlign)) {
            div.style.textAlign = cell.column.textAlign;
        }
        if (cell.column.customAttributes) {
            setStyleAndAttributes(node, cell.column.customAttributes);
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-colspan', cell.colSpan.toString());
        node.setAttribute('aria-rowspan', '1');
        if (this.parent.allowResizing) {
            var handler = this.parent.createElement('div');
            handler.className = cell.column.allowResizing ? 'e-rhandler e-rcursor' : 'e-rsuppress';
            node.appendChild(handler);
        }
        this.parent.trigger(headerCellInfo, { cell: cell, node: node });
        return node;
    };
    return StackedHeaderCellRenderer;
}(CellRenderer));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * IndentCellRenderer class which responsible for building group indent cell.
 * @hidden
 */
var IndentCellRenderer = /** @class */ (function (_super) {
    __extends$6(IndentCellRenderer, _super);
    function IndentCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TD', { className: 'e-indentcell' });
        return _this;
    }
    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    IndentCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        setStyleAndAttributes(node, cell.attributes);
        return node;
    };
    return IndentCellRenderer;
}(CellRenderer));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * GroupCaptionCellRenderer class which responsible for building group caption cell.
 * @hidden
 */
var GroupCaptionCellRenderer = /** @class */ (function (_super) {
    __extends$7(GroupCaptionCellRenderer, _super);
    function GroupCaptionCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent
            .createElement('TD', { className: 'e-groupcaption',
            attrs: { id: _this.parent.element.id + 'captioncell', role: 'gridcell', tabindex: '-1' } });
        return _this;
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data
     */
    GroupCaptionCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        var gObj = this.parent;
        var result;
        var fKeyValue;
        data.headerText = cell.column.headerText;
        if (cell.isForeignKey) {
            fKeyValue = this.format(cell.column, cell.column.valueAccessor('foreignKey', data, cell.column));
        }
        var value = cell.isForeignKey ? fKeyValue : cell.column.enableGroupByFormat ? data.key :
            this.format(cell.column, cell.column.valueAccessor('key', data, cell.column));
        if (!sf.base.isNullOrUndefined(gObj.groupSettings.captionTemplate)) {
            var isReactCompiler = this.parent.isReact && typeof (gObj.groupSettings.captionTemplate) !== 'string';
            if (sf.base.isBlazor()) {
                var tempID = gObj.element.id + 'captionTemplate';
                result = templateCompiler(gObj.groupSettings.captionTemplate)(data, null, null, tempID);
            }
            else {
                if (isReactCompiler) {
                    var tempID = gObj.element.id + 'captionTemplate';
                    templateCompiler(gObj.groupSettings.captionTemplate)(data, this.parent, 'captionTemplate', tempID, null, null, node);
                    this.parent.renderTemplates();
                }
                else if (this.parent.isVue) {
                    result = templateCompiler(gObj.groupSettings.captionTemplate)(data, this.parent);
                }
                else {
                    result = templateCompiler(gObj.groupSettings.captionTemplate)(data);
                }
            }
            if (!isReactCompiler) {
                appendChildren(node, result);
            }
        }
        else {
            if (gObj.groupSettings.enableLazyLoading) {
                node.innerHTML = cell.column.headerText + ': ' + value;
            }
            else {
                node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
                    (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'));
            }
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + ' is groupcaption cell');
        node.setAttribute('title', node.innerHTML);
        return node;
    };
    return GroupCaptionCellRenderer;
}(CellRenderer));
/**
 * GroupCaptionEmptyCellRenderer class which responsible for building group caption empty cell.
 * @hidden
 */
var GroupCaptionEmptyCellRenderer = /** @class */ (function (_super) {
    __extends$7(GroupCaptionEmptyCellRenderer, _super);
    function GroupCaptionEmptyCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TD', { className: 'e-groupcaption' });
        return _this;
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data
     */
    GroupCaptionEmptyCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.innerHTML = '&nbsp;';
        node.setAttribute('colspan', cell.colSpan.toString());
        return node;
    };
    return GroupCaptionEmptyCellRenderer;
}(CellRenderer));

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 * @hidden
 */
var ExpandCellRenderer = /** @class */ (function (_super) {
    __extends$8(ExpandCellRenderer, _super);
    function ExpandCellRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Function to render the expand cell
     * @param  {Cell} cell
     * @param  {Object} data
     * @param  {{ [x: string]: string }} attr
     * @param {boolean} isExpand
     */
    ExpandCellRenderer.prototype.render = function (cell, data, attr, isExpand) {
        var node = this.element.cloneNode();
        node.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
        node.setAttribute('ej-mappingname', data.field);
        node.setAttribute('ej-mappingvalue', data.key);
        node.setAttribute('aria-expanded', isExpand ? 'true' : 'false');
        node.setAttribute('tabindex', '-1');
        node.appendChild(this.parent.createElement('div', {
            className: isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' : 'e-icons e-gnextforward e-icon-grightarrow'
        }));
        return node;
    };
    return ExpandCellRenderer;
}(IndentCellRenderer));

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * HeaderIndentCellRenderer class which responsible for building header indent cell.
 * @hidden
 */
var HeaderIndentCellRenderer = /** @class */ (function (_super) {
    __extends$9(HeaderIndentCellRenderer, _super);
    function HeaderIndentCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TH', { className: 'e-grouptopleftcell' });
        return _this;
    }
    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    HeaderIndentCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.appendChild(this.parent.createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '' }));
        return node;
    };
    return HeaderIndentCellRenderer;
}(CellRenderer));

var __extends$10 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * DetailHeaderIndentCellRenderer class which responsible for building detail header indent cell.
 * @hidden
 */
var DetailHeaderIndentCellRenderer = /** @class */ (function (_super) {
    __extends$10(DetailHeaderIndentCellRenderer, _super);
    function DetailHeaderIndentCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TH', { className: 'e-detailheadercell' });
        return _this;
    }
    /**
     * Function to render the detail indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    DetailHeaderIndentCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.appendChild(this.parent.createElement('div', { className: 'e-emptycell' }));
        return node;
    };
    return DetailHeaderIndentCellRenderer;
}(CellRenderer));

var __extends$11 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 * @hidden
 */
var DetailExpandCellRenderer = /** @class */ (function (_super) {
    __extends$11(DetailExpandCellRenderer, _super);
    function DetailExpandCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TD', {
            className: 'e-detailrowcollapse',
            attrs: { 'aria-expanded': 'false', role: 'gridcell', tabindex: '-1' }
        });
        return _this;
    }
    /**
     * Function to render the detail expand cell
     */
    DetailExpandCellRenderer.prototype.render = function (cell, data, attributes$$1) {
        var node = this.element.cloneNode();
        if (attributes$$1 && !sf.base.isNullOrUndefined(attributes$$1['class'])) {
            node.className = '';
            node.className = attributes$$1['class'];
            node.appendChild(this.parent.createElement('div', { className: 'e-icons e-dtdiagonaldown e-icon-gdownarrow' }));
        }
        else {
            node.appendChild(this.parent.createElement('div', { className: 'e-icons e-dtdiagonalright e-icon-grightarrow' }));
        }
        return node;
    };
    return DetailExpandCellRenderer;
}(CellRenderer));

var __extends$12 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 * @hidden
 */
var RowDragDropRenderer = /** @class */ (function (_super) {
    __extends$12(RowDragDropRenderer, _super);
    function RowDragDropRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TD', {
            className: 'e-rowdragdrop',
            attrs: { role: 'gridcell', tabindex: '-1' }
        });
        return _this;
    }
    /**
     * Function to render the detail expand cell
     */
    RowDragDropRenderer.prototype.render = function (cell, data) {
        var nodeElement = this.element.cloneNode();
        nodeElement.appendChild(this.parent.createElement('div', {
            className: 'e-icons e-rowcelldrag e-dtdiagonalright e-icon-rowdragicon'
        }));
        if (cell.isSelected) {
            nodeElement.classList.add('e-selectionbackground');
            nodeElement.classList.add('e-active');
        }
        return nodeElement;
    };
    return RowDragDropRenderer;
}(CellRenderer));

var __extends$13 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * DetailHeaderIndentCellRenderer class which responsible for building detail header indent cell.
 * @hidden
 */
var RowDragDropHeaderRenderer = /** @class */ (function (_super) {
    __extends$13(RowDragDropHeaderRenderer, _super);
    function RowDragDropHeaderRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TH', { className: 'e-rowdragheader' });
        return _this;
    }
    /**
     * Function to render the detail indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    RowDragDropHeaderRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.appendChild(sf.base.createElement('div', { className: 'e-emptycell' }));
        return node;
    };
    return RowDragDropHeaderRenderer;
}(CellRenderer));

/**
 * Content module is used to render grid content
 * @hidden
 */
var Render = /** @class */ (function () {
    /**
     * Constructor for render module
     */
    function Render(parent, locator) {
        this.emptyGrid = false;
        this.counter = 0;
        this.parent = parent;
        this.locator = locator;
        this.data = new Data(parent, locator);
        this.l10n = locator.getService('localization');
        this.ariaService = this.locator.getService('ariaService');
        this.renderer = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    /**
     * To initialize grid header, content and footer rendering
     */
    Render.prototype.render = function () {
        var gObj = this.parent;
        var isServerRendered = 'isServerRendered';
        this.headerRenderer = this.renderer.getRenderer(RenderType.Header);
        this.contentRenderer = this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer.renderPanel();
        this.contentRenderer.renderPanel();
        if (gObj.getColumns().length) {
            this.isLayoutRendered = true;
            this.headerRenderer.renderTable();
            this.contentRenderer.renderTable();
            this.emptyRow(false);
        }
        this.parent.scrollModule.setWidth();
        this.parent.scrollModule.setHeight();
        if (this.parent.height !== 'auto') {
            this.parent.scrollModule.setPadding();
        }
        if (!(sf.base.isBlazor() && this.parent[isServerRendered])) {
            this.refreshDataManager();
        }
    };
    /**
     * Refresh the entire Grid.
     * @return {void}
     */
    Render.prototype.refresh = function (e) {
        var _this = this;
        if (e === void 0) { e = { requestType: 'refresh' }; }
        var gObj = this.parent;
        var preventUpdate = 'preventUpdate';
        gObj.notify(e.requestType + "-begin", e);
        if (sf.base.isBlazor()) {
            this.resetTemplates();
        }
        if (sf.base.isBlazor() && gObj.isServerRendered) {
            var bulkChanges = 'bulkChanges';
            if (gObj[bulkChanges].dataSource) {
                delete gObj[bulkChanges].dataSource;
            }
            gObj.notify('blazor-action-begin', e);
            if (e.requestType === 'filtering') {
                var columns = 'columns';
                e[columns] = null;
            }
            if (e.requestType === 'sorting') {
                var target = 'target';
                e[target] = null;
            }
            if (gObj.editSettings.mode === 'Batch' && !gObj.isEdit) {
                gObj.notify('closebatch', {});
            }
        }
        var tempPreventUpdate = this.parent[preventUpdate];
        gObj.trigger(actionBegin, e, function (args) {
            if (args === void 0) { args = { requestType: 'refresh' }; }
            if (args.requestType === 'delete' && sf.base.isBlazor() && !gObj.isJsComponent) {
                var data = 'data';
                if (sf.base.isNullOrUndefined(gObj.commandDelIndex)) {
                    args[data] = gObj.getSelectedRecords();
                }
                else {
                    var tempSelectedRecord = args[data];
                    args[data] = {};
                    args[data][0] = tempSelectedRecord;
                }
            }
            if (args.cancel) {
                gObj.notify(cancelBegin, args);
                return;
            }
            if (sf.base.isBlazor() && gObj.editSettings.mode === 'Normal' && gObj.isEdit && e.requestType !== 'infiniteScroll') {
                gObj.notify('closeinline', {});
            }
            if (args.requestType === 'delete' && gObj.allowPaging) {
                var dataLength = args.data.length;
                var count = gObj.pageSettings.totalRecordsCount - dataLength;
                if (!(gObj.currentViewData.length - dataLength) && count) {
                    gObj.prevPageMoving = true;
                    gObj.setProperties({
                        pageSettings: {
                            totalRecordsCount: count, currentPage: Math.ceil(count / gObj.pageSettings.pageSize)
                        }
                    }, true);
                    gObj.pagerModule.pagerObj.totalRecordsCount = count;
                }
            }
            if (sf.base.isBlazor() && _this.parent.isServerRendered) {
                if (tempPreventUpdate) {
                    var bulkChanges = 'bulkChanges';
                    gObj[bulkChanges] = {};
                    return;
                }
                if (e.requestType === 'refresh') {
                    _this.parent.notify('updateaction', args);
                }
                if (args.requestType !== 'virtualscroll') {
                    _this.parent.showSpinner();
                }
                if (args.requestType === 'delete' || args.requestType === 'save') {
                    _this.parent.notify(addDeleteAction, args);
                    _this.parent.notify('add-delete-success', args);
                }
                else {
                    _this.parent.allowServerDataBinding = true;
                    _this.parent.serverDataBind();
                    _this.parent.allowServerDataBinding = false;
                }
            }
            else if (args.requestType === 'reorder' && _this.parent.dataSource && 'result' in _this.parent.dataSource) {
                _this.contentRenderer.refreshContentRows(args);
            }
            else if ((args.requestType === 'paging' || args.requestType === 'columnstate' || args.requestType === 'reorder')
                && _this.parent.groupSettings.enableLazyLoading && _this.parent.groupSettings.columns.length
                && _this.parent.contentModule.getGroupCache()[_this.parent.pageSettings.currentPage]) {
                _this.contentRenderer.refreshContentRows(args);
            }
            else {
                _this.refreshDataManager(args);
            }
        });
    };
    /**
     * @hidden
     */
    Render.prototype.resetTemplates = function () {
        var gObj = this.parent;
        var gridColumns = gObj.getColumns();
        if (gObj.detailTemplate) {
            var detailTemplateID = gObj.element.id + 'detailTemplate';
            sf.base.blazorTemplates[detailTemplateID] = [];
            sf.base.resetBlazorTemplate(detailTemplateID, 'DetailTemplate');
        }
        if (gObj.groupSettings.captionTemplate) {
            sf.base.resetBlazorTemplate(gObj.element.id + 'captionTemplate', 'CaptionTemplate');
        }
        if (gObj.rowTemplate) {
            sf.base.resetBlazorTemplate(gObj.element.id + 'rowTemplate', 'RowTemplate');
        }
        if (gObj.toolbarTemplate) {
            sf.base.resetBlazorTemplate(gObj.element.id + 'toolbarTemplate', 'ToolbarTemplate');
        }
        if (gObj.pageSettings.template) {
            sf.base.resetBlazorTemplate(gObj.element.id + '_template', 'pageSettings');
        }
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].template) {
                sf.base.blazorTemplates[gObj.element.id + gridColumns[i].uid] = [];
                sf.base.resetBlazorTemplate(gObj.element.id + gridColumns[i].uid, 'Template');
            }
            if (gridColumns[i].headerTemplate) {
                sf.base.resetBlazorTemplate(gObj.element.id + gridColumns[i].uid + 'headerTemplate', 'HeaderTemplate');
            }
            if (gridColumns[i].filterTemplate) {
                sf.base.resetBlazorTemplate(gObj.element.id + gridColumns[i].uid + 'filterTemplate', 'FilterTemplate');
            }
        }
        var guid = 'guid';
        for (var k = 0; k < gObj.aggregates.length; k++) {
            for (var j = 0; j < gObj.aggregates[k].columns.length; j++) {
                if (gObj.aggregates[k].columns[j].footerTemplate) {
                    var tempID = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'footerTemplate';
                    sf.base.resetBlazorTemplate(tempID, 'FooterTemplate');
                }
                if (gObj.aggregates[k].columns[j].groupFooterTemplate) {
                    var tempID = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'groupFooterTemplate';
                    sf.base.resetBlazorTemplate(tempID, 'GroupFooterTemplate');
                }
                if (gObj.aggregates[k].columns[j].groupCaptionTemplate) {
                    var tempID = gObj.element.id + gObj.aggregates[k].columns[j][guid] + 'groupCaptionTemplate';
                    sf.base.resetBlazorTemplate(tempID, 'GroupCaptionTemplate');
                }
            }
        }
    };
    Render.prototype.refreshComplete = function (e) {
        if (sf.base.isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        this.parent.trigger(actionComplete, e);
    };
    /**
     * The function is used to refresh the dataManager
     * @return {void}
     */
    Render.prototype.refreshDataManager = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        if (args.requestType !== 'virtualscroll') {
            this.parent.showSpinner();
        }
        this.parent.notify(resetInfiniteBlocks, args);
        this.emptyGrid = false;
        var dataManager;
        var isFActon = this.isNeedForeignAction();
        this.ariaService.setBusy(this.parent.getContent().querySelector('.e-content'), true);
        if (isFActon) {
            var deffered = new sf.data.Deferred();
            dataManager = this.getFData(deffered, args);
        }
        if (!dataManager) {
            dataManager = this.data.getData(args, this.data.generateQuery().requiresCount());
        }
        else {
            dataManager = dataManager.then(function (e) {
                var query = _this.data.generateQuery().requiresCount();
                if (_this.emptyGrid) {
                    var def = new sf.data.Deferred();
                    def.resolve({ result: [], count: 0 });
                    return def.promise;
                }
                return _this.data.getData(args, query);
            });
        }
        if (this.parent.getForeignKeyColumns().length && (!isFActon || this.parent.searchSettings.key.length)) {
            var deffered_1 = new sf.data.Deferred();
            dataManager = dataManager.then(function (e) {
                _this.parent.notify(getForeignKeyData, { dataManager: dataManager, result: e, promise: deffered_1, action: args });
                return deffered_1.promise;
            });
        }
        if (this.parent.groupSettings.disablePageWiseAggregates && this.parent.groupSettings.columns.length) {
            dataManager = dataManager.then(function (e) { return _this.validateGroupRecords(e); });
        }
        dataManager.then(function (e) { return _this.dataManagerSuccess(e, args); })
            .catch(function (e) { return _this.dataManagerFailure(e, args); });
    };
    Render.prototype.getFData = function (deferred, args) {
        this.parent.notify(getForeignKeyData, { isComplex: true, promise: deferred, action: args });
        return deferred.promise;
    };
    Render.prototype.isNeedForeignAction = function () {
        var gObj = this.parent;
        return !!((gObj.allowFiltering && gObj.filterSettings.columns.length) ||
            (gObj.searchSettings.key.length)) && this.foreignKey(this.parent.getForeignKeyColumns());
    };
    Render.prototype.foreignKey = function (columns) {
        var _this = this;
        return columns.some(function (col) {
            var fbool = false;
            fbool = _this.parent.filterSettings.columns.some(function (value) {
                return col.uid === value.uid;
            });
            return !!(fbool || _this.parent.searchSettings.key.length);
        });
    };
    Render.prototype.sendBulkRequest = function (args) {
        var _this = this;
        args.requestType = 'batchsave';
        var promise = this.data.saveChanges(args.changes, this.parent.getPrimaryKeyFieldNames()[0], args.original);
        if (sf.base.isBlazor() && !this.parent.isJsComponent) {
            promise.then(function (e) {
                _this.parent.notify('editsuccess', args);
            }).catch(function (e) {
                var error = 'error';
                var message = 'message';
                if (!sf.base.isNullOrUndefined(e[error]) && !sf.base.isNullOrUndefined(e[error][message])) {
                    e[error] = e[error][message];
                }
                _this.parent.trigger(actionFailure, e);
            });
        }
        else {
            var query_1 = this.data.generateQuery().requiresCount();
            if (this.data.dataManager.dataSource.offline) {
                this.refreshDataManager({ requestType: 'batchsave' });
                return;
            }
            else {
                promise.then(function (e) {
                    _this.data.getData(args, query_1)
                        .then(function (e) { return _this.dmSuccess(e, args); })
                        .catch(function (e) { return _this.dmFailure(e, args); });
                })
                    .catch(function (e) { return _this.dmFailure(e, args); });
            }
        }
    };
    Render.prototype.dmSuccess = function (e, args) {
        this.dataManagerSuccess(e, args);
    };
    Render.prototype.dmFailure = function (e, args) {
        this.dataManagerFailure(e, args);
    };
    /**
     * Render empty row to Grid which is used at the time to represent to no records.
     * @return {void}
     * @hidden
     */
    Render.prototype.renderEmptyRow = function () {
        this.emptyRow(true);
    };
    Render.prototype.emptyRow = function (isTrigger) {
        var gObj = this.parent;
        var tbody = this.contentRenderer.getTable().querySelector('tbody');
        var tr;
        if (!sf.base.isNullOrUndefined(tbody)) {
            sf.base.remove(tbody);
        }
        tbody = this.parent.createElement('tbody');
        var spanCount = 0;
        if (gObj.detailTemplate || gObj.childGrid) {
            ++spanCount;
        }
        tr = this.parent.createElement('tr', { className: 'e-emptyrow' });
        tr.appendChild(this.parent.createElement('td', {
            innerHTML: this.l10n.getConstant('EmptyRecord'),
            attrs: { colspan: (gObj.getColumns().length + spanCount).toString() }
        }));
        tbody.appendChild(tr);
        this.contentRenderer.renderEmpty(tbody);
        if (isTrigger) {
            this.parent.trigger(dataBound, {});
            this.parent.notify(onEmpty, { rows: [new Row({ isDataRow: true, cells: [new Cell({ isDataCell: true, visible: true })] })] });
        }
    };
    Render.prototype.dynamicColumnChange = function () {
        if (this.parent.getCurrentViewRecords().length) {
            this.updateColumnType(this.parent.getCurrentViewRecords()[0]);
        }
    };
    Render.prototype.updateColumnType = function (record) {
        var columns = this.parent.getColumns();
        var value;
        var cFormat = 'customFormat';
        var equalTo = 'equalTo';
        var data = record && record.items ? record.items[0] : record;
        var fmtr = this.locator.getService('valueFormatter');
        for (var i = 0, len = columns.length; i < len; i++) {
            value = getObject(columns[i].field || '', data);
            if (!sf.base.isNullOrUndefined(columns[i][cFormat])) {
                columns[i].format = columns[i][cFormat];
            }
            if (!sf.base.isNullOrUndefined(columns[i].validationRules) && !sf.base.isNullOrUndefined(columns[i].validationRules[equalTo])) {
                columns[i].validationRules[equalTo][0] = this.parent.element.id + columns[i].validationRules[equalTo][0];
            }
            if (columns[i].isForeignColumn() && columns[i].columnData) {
                value = getObject(columns[i].foreignKeyValue || '', columns[i].columnData[0]);
            }
            if (!sf.base.isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[i].type || (sf.base.isBlazor() && this.parent.isServerRendered && columns[i].type === 'none')) {
                    columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
            }
            else {
                columns[i].type = columns[i].type || (sf.base.isBlazor() && this.parent.isServerRendered ? 'none' : null);
            }
            var valueFormatter = new ValueFormatter();
            if (columns[i].format && (columns[i].format.skeleton || columns[i].format.format)) {
                columns[i].setFormatter(valueFormatter.getFormatFunction(sf.base.extend({}, columns[i].format)));
                columns[i].setParser(valueFormatter.getParserFunction(columns[i].format));
            }
            if (typeof (columns[i].format) === 'string') {
                var isServerRendered = 'isServerRendered';
                var isServerDateMap = this.parent[isServerRendered] || this.parent.printModule.isPrintGrid();
                setFormatter(this.locator, columns[i], isServerDateMap);
            }
            else if (!columns[i].format && columns[i].type === 'number') {
                columns[i].setParser(fmtr.getParserFunction({ format: 'n2' }));
            }
        }
    };
    /** @hidden */
    // tslint:disable-next-line:max-func-body-length
    Render.prototype.dataManagerSuccess = function (e, args) {
        var _this = this;
        var gObj = this.parent;
        this.contentRenderer = this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer = this.renderer.getRenderer(RenderType.Header);
        e.actionArgs = args;
        var isInfiniteDelete = this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache
            && (args.requestType === 'delete' || (args.requestType === 'save' && this.parent.infiniteScrollModule.requestType === 'add'));
        // tslint:disable-next-line:max-func-body-length
        gObj.trigger(beforeDataBound, e, function (dataArgs) {
            if (dataArgs.cancel) {
                return;
            }
            dataArgs.result = sf.base.isNullOrUndefined(dataArgs.result) ? [] : dataArgs.result;
            var len = Object.keys(dataArgs.result).length;
            if (_this.parent.isDestroyed) {
                return;
            }
            if ((!gObj.getColumns().length && !len) && !(gObj.columns.length && gObj.columns[0] instanceof Column)) {
                gObj.hideSpinner();
                return;
            }
            if (_this.isInfiniteEnd(args) && !len) {
                _this.parent.notify(infiniteEditHandler, { e: args, result: e.result, count: e.count, agg: e.aggregates });
                return;
            }
            _this.parent.isEdit = false;
            _this.parent.notify(editReset, {});
            _this.parent.notify(tooltipDestroy, {});
            _this.contentRenderer.prevCurrentView = _this.parent.currentViewData.slice();
            gObj.currentViewData = dataArgs.result;
            if (sf.base.isBlazor() && gObj.filterSettings.type === 'FilterBar'
                && (sf.base.isNullOrUndefined(gObj.currentViewData) ||
                    (!sf.base.isNullOrUndefined(gObj.currentViewData) && !gObj.currentViewData.length))) {
                var gridColumns = gObj.getColumns();
                for (var i = 0; i < gridColumns.length; i++) {
                    if (gridColumns[i].filterTemplate) {
                        var tempID = gObj.element.id + gridColumns[i].uid + 'filterTemplate';
                        sf.base.resetBlazorTemplate(tempID, 'FilterTemplate');
                        var fieldName = gridColumns[i].field;
                        var filteredColumns = gObj.filterSettings.columns;
                        for (var k = 0; k < filteredColumns.length; k++) {
                            if (fieldName === filteredColumns[k].field) {
                                sf.base.blazorTemplates[tempID][0][fieldName] = filteredColumns[k].value;
                            }
                        }
                        sf.base.updateBlazorTemplate(tempID, 'FilterTemplate', gridColumns[i], false);
                    }
                }
            }
            if (!len && dataArgs.count && gObj.allowPaging && args && args.requestType !== 'delete') {
                if (_this.parent.groupSettings.enableLazyLoading
                    && (args.requestType === 'grouping' || args.requestType === 'ungrouping')) {
                    _this.parent.notify(groupComplete, args);
                }
                gObj.prevPageMoving = true;
                gObj.pageSettings.totalRecordsCount = dataArgs.count;
                if (args.requestType !== 'paging') {
                    gObj.pageSettings.currentPage = Math.ceil(dataArgs.count / gObj.pageSettings.pageSize);
                }
                gObj.dataBind();
                return;
            }
            if ((!gObj.getColumns().length && len || !_this.isLayoutRendered) && !isGroupAdaptive(gObj)) {
                _this.updatesOnInitialRender(dataArgs);
            }
            if (!_this.isColTypeDef && gObj.getCurrentViewRecords()) {
                if (_this.data.dataManager.dataSource.offline && gObj.dataSource.length) {
                    _this.updateColumnType(gObj.dataSource[0]);
                }
                else {
                    _this.updateColumnType(gObj.getCurrentViewRecords()[0]);
                }
            }
            if (!_this.parent.isInitialLoad && _this.parent.groupSettings.disablePageWiseAggregates &&
                !_this.parent.groupSettings.columns.length) {
                dataArgs.result = _this.parent.dataSource instanceof Array ? _this.parent.dataSource : _this.parent.currentViewData;
            }
            _this.parent.notify(dataReady, sf.base.extend({ count: dataArgs.count, result: dataArgs.result, aggregates: dataArgs.aggregates }, args));
            if ((gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping'))
                && (args && args.requestType !== 'filtering')) {
                _this.headerRenderer.refreshUI();
            }
            if (len) {
                if (isGroupAdaptive(gObj)) {
                    var content = 'content';
                    args.scrollTop = { top: _this.contentRenderer[content].scrollTop };
                }
                if (!isInfiniteDelete) {
                    if (_this.parent.enableImmutableMode) {
                        _this.contentRenderer.immutableModeRendering(args);
                    }
                    else {
                        _this.contentRenderer.refreshContentRows(args);
                    }
                }
                else {
                    _this.parent.notify(infiniteEditHandler, { e: args, result: e.result, count: e.count, agg: e.aggregates });
                }
            }
            else {
                if (!gObj.getColumns().length) {
                    gObj.element.innerHTML = '';
                    alert(_this.l10n.getConstant('EmptyDataSourceError')); //ToDO: change this alert as dialog
                    return;
                }
                _this.contentRenderer.setRowElements([]);
                _this.contentRenderer.setRowObjects([]);
                _this.ariaService.setBusy(_this.parent.getContent().querySelector('.e-content'), false);
                _this.renderEmptyRow();
                if (args) {
                    var action = (args.requestType || '').toLowerCase() + '-complete';
                    _this.parent.notify(action, args);
                    if (args.requestType === 'batchsave') {
                        args.cancel = false;
                        args.rows = [];
                        args.isFrozen = _this.parent.getFrozenColumns() !== 0 && !args.isFrozen;
                        _this.parent.trigger(actionComplete, args);
                    }
                }
                _this.parent.hideSpinner();
            }
            _this.parent.notify(toolbarRefresh, {});
            _this.setRowCount(_this.parent.getCurrentViewRecords().length);
            _this.parent.getDataModule().isQueryInvokedFromData = false;
        });
    };
    /** @hidden */
    Render.prototype.dataManagerFailure = function (e, args) {
        this.ariaService.setOptions(this.parent.getContent().querySelector('.e-content'), { busy: false, invalid: true });
        this.setRowCount(1);
        this.parent.trigger(actionFailure, { error: e });
        this.parent.hideSpinner();
        if (args.requestType === 'save' || args.requestType === 'delete'
            || args.name === 'bulk-save') {
            return;
        }
        this.parent.currentViewData = [];
        this.renderEmptyRow();
        this.parent.log('actionfailure', { error: e });
    };
    Render.prototype.setRowCount = function (dataRowCount) {
        var gObj = this.parent;
        this.ariaService.setOptions(this.parent.getHeaderTable(), {
            rowcount: dataRowCount ? dataRowCount.toString() : '1'
        });
    };
    Render.prototype.isInfiniteEnd = function (args) {
        return this.parent.enableInfiniteScrolling && !this.parent.infiniteScrollSettings.enableCache && args.requestType === 'delete';
    };
    Render.prototype.updatesOnInitialRender = function (e) {
        this.isLayoutRendered = true;
        if (this.parent.columns.length < 1) {
            this.buildColumns(e.result[0]);
        }
        prepareColumns(this.parent.columns, null, this.parent);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.isAutoGen = true;
        this.parent.notify(autoCol, {});
    };
    Render.prototype.iterateComplexColumns = function (obj, field, split) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var childKeys = typeof obj[keys[i]] === 'object' && obj[keys[i]] && !(obj[keys[i]] instanceof Date) ?
                Object.keys(obj[keys[i]]) : [];
            if (childKeys.length) {
                this.iterateComplexColumns(obj[keys[i]], field + (keys[i] + '.'), split);
            }
            else {
                split[this.counter] = field + keys[i];
                this.counter++;
            }
        }
    };
    Render.prototype.buildColumns = function (record) {
        var cols = [];
        var complexCols = {};
        this.iterateComplexColumns(record, '', complexCols);
        var columns = Object.keys(complexCols).filter(function (e) { return complexCols[e] !== 'BlazId'; }).
            map(function (field) { return complexCols[field]; });
        for (var i = 0, len = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] };
            if (this.parent.enableColumnVirtualization) {
                cols[i].width = !sf.base.isNullOrUndefined(cols[i].width) ? cols[i].width : 200;
            }
        }
        this.parent.setProperties({ 'columns': cols }, true);
    };
    Render.prototype.instantiateRenderer = function () {
        this.renderer.addRenderer(RenderType.Header, new HeaderRender(this.parent, this.locator));
        this.renderer.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        var cellrender = this.locator.getService('cellRendererFactory');
        cellrender.addCellRenderer(CellType.Header, new HeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Data, new CellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Indent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaption, new GroupCaptionCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaptionEmpty, new GroupCaptionEmptyCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Expand, new ExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.HeaderIndent, new HeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailHeader, new DetailHeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.RowDragHIcon, new RowDragDropHeaderRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailFooterIntent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.RowDragIcon, new RowDragDropRenderer(this.parent, this.locator));
    };
    Render.prototype.addEventListener = function () {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on('refreshdataSource', this.dataManagerSuccess, this);
        this.parent.on(modelChanged, this.refresh, this);
        this.parent.on(refreshComplete, this.refreshComplete, this);
        this.parent.on(bulkSave, this.sendBulkRequest, this);
        this.parent.on(showEmptyGrid, function () { _this.emptyGrid = true; }, this);
        this.parent.on(autoCol, this.dynamicColumnChange, this);
    };
    /** @hidden */
    Render.prototype.validateGroupRecords = function (e) {
        var _this = this;
        var index = e.result.length - 1;
        if (index < 0) {
            return Promise.resolve(e);
        }
        var group0 = e.result[0];
        var groupN = e.result[index];
        var predicate = [];
        var addWhere = function (input) {
            var groups = [group0, groupN];
            for (var i = 0; i < groups.length; i++) {
                predicate.push(new sf.data.Predicate('field', '==', groups[i].field).and(_this.getPredicate('key', 'equal', groups[i].key)));
            }
            input.where(sf.data.Predicate.or(predicate));
        };
        var query = new sf.data.Query();
        addWhere(query);
        var curDm = new sf.data.DataManager(e.result);
        var curFilter = curDm.executeLocal(query);
        var newQuery = this.data.generateQuery(true);
        var rPredicate = [];
        if (this.data.isRemote() || sf.base.isBlazor()) {
            var groups = [group0, groupN];
            for (var i = 0; i < groups.length; i++) {
                rPredicate.push(this.getPredicate(groups[i].field, 'equal', groups[i].key));
            }
            newQuery.where(sf.data.Predicate.or(rPredicate));
        }
        else {
            addWhere(newQuery);
        }
        var deferred = new sf.data.Deferred();
        this.data.getData({}, newQuery).then(function (r) {
            _this.updateGroupInfo(curFilter, r.result);
            deferred.resolve(e);
        }).catch(function (e) { return deferred.reject(e); });
        return deferred.promise;
    };
    Render.prototype.getPredicate = function (key, operator, value) {
        if (value instanceof Date) {
            return getDatePredicate({ field: key, operator: operator, value: value });
        }
        return new sf.data.Predicate(key, operator, value);
    };
    Render.prototype.updateGroupInfo = function (current, untouched) {
        var dm = new sf.data.DataManager(untouched);
        var elements = current;
        for (var i = 0; i < elements.length; i++) {
            var uGroup = dm.executeLocal(new sf.data.Query()
                .where(new sf.data.Predicate('field', '==', elements[i].field).and(this.getPredicate('key', 'equal', elements[i].key))))[0];
            elements[i].count = uGroup.count;
            var itemGroup = elements[i].items;
            var uGroupItem = uGroup.items;
            if (itemGroup.GroupGuid) {
                elements[i].items = this.updateGroupInfo(elements[i].items, uGroup.items);
            }
            var rows = this.parent.aggregates;
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                for (var k = 0; k < row.columns.length; k++) {
                    var types = row.columns[k].type instanceof Array ? (row.columns[k].type) :
                        [(row.columns[k].type)];
                    for (var l = 0; l < types.length; l++) {
                        var key = row.columns[k].field + ' - ' + types[l].toLowerCase();
                        var data = itemGroup.level ? uGroupItem.records : uGroup.items;
                        var context = this.parent;
                        if (types[l] === 'Custom') {
                            var data_1 = itemGroup.level ? uGroupItem : uGroup;
                            elements[i].aggregates[key] = row.columns[k].customAggregate ?
                                row.columns[k].customAggregate
                                    .call(context, data_1, row.columns[k]) : '';
                        }
                        else {
                            elements[i].aggregates[key] = sf.data.DataUtil.aggregates[types[l].toLowerCase()](data, row.columns[k].field);
                        }
                    }
                }
            }
        }
        return current;
    };
    return Render;
}());

/**
 * CellRendererFactory
 * @hidden
 */
var CellRendererFactory = /** @class */ (function () {
    function CellRendererFactory() {
        this.cellRenderMap = {};
    }
    CellRendererFactory.prototype.addCellRenderer = function (name, type) {
        name = typeof name === 'string' ? name : sf.base.getEnumValue(CellType, name);
        if (sf.base.isNullOrUndefined(this.cellRenderMap[name])) {
            this.cellRenderMap[name] = type;
        }
    };
    CellRendererFactory.prototype.getCellRenderer = function (name) {
        name = typeof name === 'string' ? name : sf.base.getEnumValue(CellType, name);
        if (sf.base.isNullOrUndefined(this.cellRenderMap[name])) {
            throw "The cellRenderer " + name + " is not found";
        }
        else {
            return this.cellRenderMap[name];
        }
    };
    return CellRendererFactory;
}());

/**
 * ServiceLocator
 * @hidden
 */
var ServiceLocator = /** @class */ (function () {
    function ServiceLocator() {
        this.services = {};
    }
    ServiceLocator.prototype.register = function (name, type) {
        if (sf.base.isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    };
    ServiceLocator.prototype.getService = function (name) {
        if (sf.base.isNullOrUndefined(this.services[name])) {
            throw "The service " + name + " is not registered";
        }
        return this.services[name];
    };
    return ServiceLocator;
}());

/**
 * RendererFactory
 * @hidden
 */
var RendererFactory = /** @class */ (function () {
    function RendererFactory() {
        this.rendererMap = {};
    }
    RendererFactory.prototype.addRenderer = function (name, type) {
        var rName = sf.base.getEnumValue(RenderType, name);
        if (sf.base.isNullOrUndefined(this.rendererMap[rName])) {
            this.rendererMap[rName] = type;
        }
    };
    RendererFactory.prototype.getRenderer = function (name) {
        var rName = sf.base.getEnumValue(RenderType, name);
        if (sf.base.isNullOrUndefined(this.rendererMap[rName])) {
            throw "The renderer " + rName + " is not found";
        }
        else {
            return this.rendererMap[rName];
        }
    };
    return RendererFactory;
}());

/**
 * ColumnWidthService
 * @hidden
 */
var ColumnWidthService = /** @class */ (function () {
    function ColumnWidthService(parent) {
        this.parent = parent;
    }
    ColumnWidthService.prototype.setWidthToColumns = function () {
        var i = 0;
        var indexes = this.parent.getColumnIndexesInView();
        var wFlag = true;
        var totalColumnsWidth = 0;
        if (this.parent.allowGrouping) {
            for (var len = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) {
                    wFlag = false;
                    continue;
                }
                this.setColumnWidth(new Column({ width: '30px' }), i);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            this.setColumnWidth(new Column({ width: '30px' }), i);
            i++;
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() !== 'Right') {
            this.setColumnWidth(new Column({ width: '30px' }), i);
            i++;
        }
        var columns = this.parent.getColumns();
        for (var j = 0; j < columns.length; j++) {
            this.setColumnWidth(columns[j], wFlag && this.parent.enableColumnVirtualization ? undefined : j + i);
        }
        if (this.parent.isRowDragable() && this.parent.getFrozenMode() === 'Right') {
            this.setColumnWidth(new Column({ width: '30px' }), columns.length);
        }
        totalColumnsWidth = this.getTableWidth(this.parent.getColumns());
        if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1) {
            this.setMinwidthBycalculation(totalColumnsWidth);
        }
    };
    ColumnWidthService.prototype.setMinwidthBycalculation = function (tWidth) {
        var difference = 0;
        var collection = this.parent.getColumns().filter(function (a) {
            return sf.base.isNullOrUndefined(a.width) || a.width === 'auto';
        });
        if (collection.length) {
            if (!sf.base.isNullOrUndefined(this.parent.width) && this.parent.width !== 'auto' &&
                typeof (this.parent.width) === 'string' && this.parent.width.indexOf('%') === -1) {
                difference = (typeof this.parent.width === 'string' ? parseInt(this.parent.width, 10) : this.parent.width) - tWidth;
            }
            else {
                difference = this.parent.element.getBoundingClientRect().width - tWidth;
            }
            var tmWidth = 0;
            for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                var cols = collection_1[_i];
                tmWidth += !sf.base.isNullOrUndefined(cols.minWidth) ?
                    ((typeof cols.minWidth === 'string' ? parseInt(cols.minWidth, 10) : cols.minWidth)) : 0;
            }
            for (var i = 0; i < collection.length; i++) {
                if (tWidth === 0 && this.parent.allowResizing && this.isWidthUndefined() && (i !== collection.length - 1)) {
                    this.setUndefinedColumnWidth(collection);
                }
                if (tWidth !== 0 && difference < tmWidth) {
                    this.setWidth(collection[i].minWidth, this.parent.getColumnIndexByField(collection[i].field));
                }
                else if (tWidth !== 0 && difference > tmWidth) {
                    this.setWidth('', this.parent.getColumnIndexByField(collection[i].field) + this.parent.getIndentCount(), true);
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
            if (this.parent.width !== 'auto' && this.parent.width.toString().indexOf('%') === -1) {
                this.setMinwidthBycalculation(tgridWidth);
            }
            if ((this.parent.allowResizing && module === 'resize') || (this.parent.getFrozenColumns() && this.parent.allowResizing)) {
                this.setWidthToTable();
            }
            this.parent.notify(columnWidthChanged, { index: columnIndex, width: cWidth, column: column, module: module });
        }
    };
    ColumnWidthService.prototype.setWidth = function (width, index, clear) {
        if (this.parent.groupSettings.columns.length > index && ispercentageWidth(this.parent)) {
            var elementWidth = this.parent.element.offsetWidth;
            width = (30 / elementWidth * 100).toFixed(1) + '%';
        }
        var header = this.parent.getHeaderTable();
        var content = this.parent.getContentTable();
        var fWidth = sf.base.formatUnit(width);
        var headerCol;
        var frzCols = this.parent.getFrozenColumns();
        var isDraggable = this.parent.isRowDragable();
        frzCols = frzCols && isDraggable ? frzCols + 1 : frzCols;
        var mHdr = this.parent.getHeaderContent().querySelector('.e-movableheader');
        var mCont = this.parent.getContent().querySelector('.e-movablecontent');
        var freezeLeft = this.parent.getFrozenLeftColumnsCount();
        var freezeRight = this.parent.getFrozenRightColumnsCount();
        var movableCount = this.parent.getMovableColumnsCount();
        var isColFrozen = freezeLeft !== 0 || freezeRight !== 0;
        if (frzCols && index >= frzCols && mHdr && mHdr.querySelector('colgroup')) {
            headerCol = mHdr.querySelector('colgroup').children[index - frzCols];
        }
        else if (this.parent.enableColumnVirtualization && frzCols && this.parent.contentModule.isXaxis()
            && mHdr.scrollLeft > 0) {
            var colGroup = mHdr.querySelector('colgroup');
            headerCol = colGroup.children[(colGroup.children.length - 1) - index];
        }
        else if (isColFrozen) {
            var target = void 0;
            if (freezeLeft && !freezeRight) {
                index = isDraggable ? index - 1 : index;
                target = index < freezeLeft ? header : mHdr;
            }
            else if (!freezeLeft && freezeRight) {
                target = index >= movableCount ? header : mHdr;
            }
            else if (freezeLeft && freezeRight) {
                index = isDraggable ? index - 1 : index;
                var frHdr = this.parent.getFrozenRightHeader();
                target = index < freezeLeft ? header : index < (freezeLeft + movableCount) ? mHdr : frHdr;
            }
            headerCol = this.getColumnLevelFrozenColgroup(index, freezeLeft, movableCount, target);
            if (!headerCol) {
                return;
            }
        }
        else {
            headerCol = header.querySelector('colgroup').children[index];
        }
        if (headerCol && !clear) {
            headerCol.style.width = fWidth;
        }
        else if (headerCol && clear) {
            headerCol.style.width = '';
        }
        var contentCol;
        if (frzCols && index >= frzCols) {
            contentCol = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup').children[index - frzCols];
        }
        else if (this.parent.enableColumnVirtualization && frzCols && this.parent.contentModule.isXaxis()
            && mCont.scrollLeft > 0) {
            var colGroup = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup');
            contentCol = colGroup.children[(colGroup.children.length - 1) - index];
        }
        else if (isColFrozen) {
            var target = void 0;
            if (freezeLeft && !freezeRight) {
                target = index < freezeLeft ? content : mCont;
            }
            if (!freezeLeft && freezeRight) {
                target = index >= movableCount ? content : mCont;
            }
            if (freezeLeft && freezeRight) {
                var frCont = this.parent.getContent().querySelector('.e-frozen-right-content');
                target = index < freezeLeft ? content : index < (freezeLeft + movableCount) ? mCont : frCont;
            }
            contentCol = this.getColumnLevelFrozenColgroup(index, freezeLeft, movableCount, target);
        }
        else {
            contentCol = content.querySelector('colgroup').children[index];
        }
        if (contentCol && !clear) {
            contentCol.style.width = fWidth;
        }
        else if (contentCol && clear) {
            contentCol.style.width = '';
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
        if (this.parent.isFrozenGrid()) {
            this.refreshFrozenScrollbar();
        }
    };
    ColumnWidthService.prototype.getColumnLevelFrozenColgroup = function (index, left, movable, ele) {
        if (!ele || !ele.querySelector('colgroup')) {
            return null;
        }
        var columns = this.parent.getColumns();
        var isDrag = this.parent.isRowDragable();
        var frzMode = this.parent.getFrozenMode();
        var headerCol;
        var colGroup = [].slice.call(ele.querySelector('colgroup').children);
        if (frzMode === 'Right' && isDrag && index === (movable + this.parent.getFrozenRightColumnsCount())) {
            headerCol = colGroup[colGroup.length - 1];
        }
        else if (isDrag && index === -1) {
            headerCol = colGroup[0];
        }
        else if (columns[index].freeze === 'Left') {
            headerCol = colGroup[isDrag ? (index + 1) : index];
        }
        else if (columns[index].freeze === 'Right') {
            headerCol = colGroup[index - (left + movable)];
        }
        else {
            headerCol = colGroup[index - left];
        }
        return headerCol;
    };
    ColumnWidthService.prototype.refreshFrozenScrollbar = function () {
        var args = { cancel: false };
        this.parent.notify(preventFrozenScrollRefresh, args);
        if (args.cancel) {
            return;
        }
        var left = this.parent.getHeaderContent().querySelector('.e-frozenheader').querySelector('table');
        var movable = this.parent.getContent().querySelector('.e-movablecontent').querySelector('table');
        var right = this.parent.getHeaderContent().querySelector('.e-frozen-right-header');
        if (movable && left) {
            var leftScrollbar = this.parent.getContent().querySelector('.e-frozenscrollbar');
            var movableScrollbar = this.parent.getContent().querySelector('.e-movablescrollbar');
            var rightScrollbar = this.parent.getContent().querySelector('.e-frozen-right-scrollbar');
            var movableChild = this.parent.getContent().querySelector('.e-movablechild');
            var content = this.parent.getContent();
            var scrollbarWidth = getScrollBarWidth();
            var frzHdrWidth = left.offsetWidth;
            var mvblHdrWidth = movable.offsetWidth;
            if (this.parent.enableColumnVirtualization) {
                var placeHolder = this.parent.getMovableVirtualContent().querySelector('.e-virtualtrack');
                if (placeHolder) {
                    mvblHdrWidth = placeHolder.scrollWidth;
                }
            }
            leftScrollbar.style.width = frzHdrWidth.toString() + 'px';
            var movableWidth = this.parent.getContent().querySelector('.e-movablecontent').offsetWidth;
            if (right) {
                var rightwidth = right.offsetWidth;
                if (content.firstChild.scrollHeight > content.firstChild.clientHeight) {
                    rightwidth = right.offsetWidth + scrollbarWidth;
                }
                rightScrollbar.style.width = rightwidth.toString() + 'px';
                movableWidth = movableWidth - rightwidth;
            }
            if (this.parent.height !== 'auto' && (this.parent.getFrozenMode() === 'Left' || this.parent.getFrozenColumns())
                && content.firstChild.scrollHeight >= content.firstChild.clientHeight) {
                mvblHdrWidth = mvblHdrWidth + scrollbarWidth;
            }
            movableScrollbar.style.width = movableWidth.toString() + 'px';
            movableChild.style.width = mvblHdrWidth.toString() + 'px';
        }
    };
    ColumnWidthService.prototype.getSiblingsHeight = function (element) {
        var previous = this.getHeightFromDirection(element, 'previous');
        var next = this.getHeightFromDirection(element, 'next');
        return previous + next;
    };
    ColumnWidthService.prototype.getHeightFromDirection = function (element, direction) {
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
    };
    ColumnWidthService.prototype.isWidthUndefined = function () {
        var isWidUndefCount = this.parent.getColumns().filter(function (col) {
            return sf.base.isNullOrUndefined(col.width) && sf.base.isNullOrUndefined(col.minWidth);
        }).length;
        return (this.parent.getColumns().length === isWidUndefCount);
    };
    ColumnWidthService.prototype.getWidth = function (column) {
        if (sf.base.isNullOrUndefined(column.width) && this.parent.allowResizing
            && sf.base.isNullOrUndefined(column.minWidth) && !this.isWidthUndefined()) {
            column.width = 200;
        }
        if (this.parent.isFrozenGrid() && sf.base.isNullOrUndefined(column.width) &&
            (column.getFreezeTableName() === 'frozen-left' || column.getFreezeTableName() === 'frozen-right')) {
            column.width = 200;
        }
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
        var left = this.parent.getFrozenLeftColumnsCount() || this.parent.getFrozenColumns();
        var movable = this.parent.getMovableColumnsCount();
        var right = this.parent.getFrozenRightColumnsCount();
        if (tableType === 'movable') {
            if (right) {
                columns.splice(left + movable, columns.length);
            }
            if (left) {
                columns.splice(0, left);
            }
        }
        else if (tableType === 'freeze-left') {
            columns.splice(left, columns.length);
        }
        else if (tableType === 'freeze-right') {
            columns.splice(0, left + movable);
        }
        return sf.base.formatUnit(this.getTableWidth(columns));
    };
    ColumnWidthService.prototype.setWidthToFrozenRightTable = function () {
        var freezeWidth = this.calcMovableOrFreezeColWidth('freeze-right');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        var headerTbl = this.parent.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('.e-table');
        var cntTbl = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.e-table');
        headerTbl.style.width = freezeWidth;
        cntTbl.style.width = freezeWidth;
    };
    ColumnWidthService.prototype.setWidthToFrozenLeftTable = function () {
        var freezeWidth = this.calcMovableOrFreezeColWidth('freeze-left');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        this.parent.getHeaderTable().style.width = freezeWidth;
        this.parent.getContentTable().style.width = freezeWidth;
    };
    ColumnWidthService.prototype.setWidthToMovableTable = function () {
        var movableWidth = '';
        var isColUndefined = this.parent.getColumns().filter(function (a) { return sf.base.isNullOrUndefined(a.width); }).length >= 1;
        var isWidthAuto = this.parent.getColumns().filter(function (a) { return (a.width === 'auto'); }).length >= 1;
        if (typeof this.parent.width === 'number' && !isColUndefined && !isWidthAuto) {
            movableWidth = sf.base.formatUnit(this.parent.width - parseInt(this.calcMovableOrFreezeColWidth('freeze').split('px')[0], 10) - 5);
        }
        else if (!isColUndefined && !isWidthAuto) {
            movableWidth = this.calcMovableOrFreezeColWidth('movable');
        }
        movableWidth = this.isAutoResize() ? '100%' : movableWidth;
        if (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild) {
            this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild.style.width
                = movableWidth;
        }
        this.parent.getContent().querySelector('.e-movablecontent').firstElementChild.style.width =
            movableWidth;
    };
    ColumnWidthService.prototype.setWidthToFrozenEditTable = function () {
        var freezeWidth = this.calcMovableOrFreezeColWidth('freeze');
        freezeWidth = this.isAutoResize() ? '100%' : freezeWidth;
        this.parent.element.querySelectorAll('.e-table.e-inline-edit')[0].style.width = freezeWidth;
    };
    ColumnWidthService.prototype.setWidthToMovableEditTable = function () {
        var movableWidth = this.calcMovableOrFreezeColWidth('movable');
        movableWidth = this.isAutoResize() ? '100%' : movableWidth;
        this.parent.element.querySelectorAll('.e-table.e-inline-edit')[1].style.width = movableWidth;
    };
    ColumnWidthService.prototype.setWidthToTable = function () {
        var tWidth = sf.base.formatUnit(this.getTableWidth(this.parent.getColumns()));
        if (this.parent.isFrozenGrid()) {
            if (this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount()) {
                this.setWidthToFrozenLeftTable();
            }
            this.setWidthToMovableTable();
            if (this.parent.getFrozenRightColumnsCount()) {
                this.setWidthToFrozenRightTable();
            }
        }
        else {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.setColumnWidth(new Column({ width: '30px' }));
            }
            tWidth = this.isAutoResize() ? '100%' : tWidth;
            this.parent.getHeaderTable().style.width = tWidth;
            this.parent.getContentTable().style.width = tWidth;
        }
        var edit = this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit && this.parent.getFrozenColumns()) {
            this.setWidthToFrozenEditTable();
            this.setWidthToMovableEditTable();
        }
        else if (edit) {
            edit.style.width = tWidth;
        }
    };
    ColumnWidthService.prototype.isAutoResize = function () {
        return this.parent.allowResizing && this.parent.resizeSettings.mode === 'Auto';
    };
    return ColumnWidthService;
}());

var __extends$14 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * FocusStrategy class
 * @hidden
 */
var FocusStrategy = /** @class */ (function () {
    function FocusStrategy(parent) {
        this.currentInfo = {};
        this.oneTime = true;
        this.swap = {};
        this.forget = false;
        this.skipFocus = true;
        this.focusByClick = false;
        this.prevIndexes = {};
        this.refMatrix = this.refreshMatrix(true);
        this.actions = ['downArrow', 'upArrow'];
        this.parent = parent;
        this.rowModelGen = new RowModelGenerator(this.parent);
        this.addEventListener();
    }
    FocusStrategy.prototype.focusCheck = function (e) {
        var target = e.target;
        this.focusByClick = true;
        this.skipFocus = target.classList.contains('e-grid');
    };
    FocusStrategy.prototype.onFocus = function () {
        if (this.parent.isDestroyed || sf.base.Browser.isDevice || this.parent.enableVirtualization) {
            return;
        }
        this.setActive(!this.parent.enableHeaderFocus && this.parent.frozenRows === 0, this.parent.isFrozenGrid());
        var added = 'addedRecords';
        if (!this.parent.enableHeaderFocus && !this.parent.getCurrentViewRecords().length && ((this.parent.editSettings.mode !== 'Batch')
            || (this.parent.editSettings.mode === 'Batch' && !this.parent.editModule.getBatchChanges()[added].length))) {
            this.getContent().matrix.
                generate(this.rowModelGen.generateRows({ rows: [new Row({ isDataRow: true })] }), this.getContent().selector, false);
        }
        var current = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus) {
            this.focus();
            this.skipFocus = false;
        }
    };
    FocusStrategy.prototype.passiveFocus = function (e) {
        if (this.parent.isDestroyed) {
            return;
        }
        if (e.target && e.target.classList.contains('e-detailcell')) {
            this.currentInfo.skipAction = false;
            sf.base.addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
    };
    FocusStrategy.prototype.onBlur = function (e) {
        if ((this.parent.isEdit || e && (!e.relatedTarget || sf.base.closest(e.relatedTarget, '.e-grid')))) {
            return;
        }
        this.removeFocus();
        this.skipFocus = false;
        this.currentInfo.skipAction = false;
        if (this.getContent().getFocusInfo().elementToFocus) {
            this.getContent().getFocusInfo().elementToFocus.tabIndex = 0;
        }
    };
    FocusStrategy.prototype.onClick = function (e, force) {
        if (parentsUntil(e.target, 'e-filterbarcell') &&
            e.target.classList.contains('e-input-group-icon')) {
            return;
        }
        var isContent = !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-gridcontent'));
        var isHeader = !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-gridheader'));
        isContent = isContent && isHeader ? !isContent : isContent;
        var isFrozen = !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-frozencontent')) ||
            !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-frozenheader'));
        var isFrozenRight = false;
        if (this.parent.getFrozenMode() === 'Left-Right') {
            isFrozenRight = !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-frozen-right-content')) ||
                !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-frozen-right-header'));
            isFrozen = isFrozen && !isFrozenRight;
        }
        if (!isContent && sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-gridheader')) ||
            e.target.classList.contains('e-content') ||
            !sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-unboundcell'))) {
            return;
        }
        this.setActive(isContent, isFrozen, isFrozenRight);
        if (!isContent && sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-gridheader'))) {
            this.clearOutline();
            return;
        }
        var beforeArgs = { cancel: false, byKey: false, byClick: !sf.base.isNullOrUndefined(e.target), clickArgs: e };
        this.parent.notify(beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel || sf.base.closest(e.target, '.e-inline-edit')) {
            return;
        }
        this.setActive(isContent, isFrozen, isFrozenRight);
        if (this.getContent()) {
            var returnVal = this.getContent().onClick(e, force);
            if (returnVal === false) {
                return;
            }
            this.focus();
        }
    };
    FocusStrategy.prototype.onKeyPress = function (e) {
        if (this.skipOn(e)) {
            return;
        }
        this.activeKey = e.action;
        var beforeArgs = { cancel: false, byKey: true, byClick: false, keyArgs: e };
        this.parent.notify(beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel) {
            return;
        }
        var bValue = this.getContent().matrix.current;
        this.currentInfo.outline = true;
        var swapInfo = this.getContent().jump(e.action, bValue);
        this.swap = swapInfo;
        if (swapInfo.swap) {
            this.setActive(!swapInfo.toHeader, swapInfo.toFrozen, swapInfo.toFrozenRight);
            this.getContent().matrix.current = this.getContent().getNextCurrent(bValue, swapInfo, this.active, e.action);
            this.prevIndexes = {};
        }
        this.setActiveByKey(e.action, this.getContent());
        var returnVal = this.getContent().onKeyPress(e);
        if (returnVal === false) {
            this.clearIndicator();
            return;
        }
        e.preventDefault();
        this.focus(e);
    };
    FocusStrategy.prototype.skipOn = function (e) {
        var target = e.target;
        if (!target) {
            return false;
        }
        if (this.currentInfo.skipAction) {
            this.clearIndicator();
            return true;
        }
        if (['pageUp', 'pageDown', 'altDownArrow'].indexOf(e.action) > -1) {
            this.clearIndicator();
            return true;
        }
        var th = sf.base.closest(target, 'th') && !sf.base.closest(target, 'th').tabIndex;
        if (e.target.classList.contains('e-filterbaroperator') && (e.keyCode === 13 || e.keyCode === 27)) {
            var inputTarget = sf.base.closest(e.target, '.e-filterbarcell');
            inputTarget.querySelector('input').focus();
        }
        if (th && sf.base.closest(document.activeElement, '.e-filterbarcell') !== null) {
            this.removeFocus();
        }
        var filterCell = sf.base.closest(document.activeElement, '.e-filterbarcell') !== null;
        if (this.parent.enableHeaderFocus && filterCell) {
            var matrix = this.active.matrix;
            var current = matrix.current;
            filterCell = matrix.matrix[current[0]].lastIndexOf(1) !== current[1];
        }
        return (e.action === 'delete'
            || (this.parent.editSettings.mode !== 'Batch' && (this.parent.isEdit || ['insert', 'f2'].indexOf(e.action) > -1))
            || (filterCell ||
                sf.base.closest(document.activeElement, '#' + this.parent.element.id + '_searchbar') !== null
                    && ['enter', 'leftArrow', 'rightArrow',
                        'shiftLeft', 'shiftRight', 'ctrlPlusA'].indexOf(e.action) > -1)
            || (sf.base.closest(target, '.e-gridcontent') === null && sf.base.closest(target, '.e-gridheader') === null)
            || (e.action === 'space' && (!target.classList.contains('e-gridchkbox') && sf.base.closest(target, '.e-gridchkbox') === null
                && sf.base.closest(target, '.e-headerchkcelldiv') === null))) || sf.base.closest(target, '.e-filter-popup') !== null;
    };
    FocusStrategy.prototype.focusVirtualElement = function (e) {
        var _this = this;
        if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
            var data = { virtualData: {}, isAdd: false, isCancel: false };
            this.parent.notify(getVirtualData, data);
            var isKeyFocus = this.actions.some(function (value) { return value === _this.activeKey; });
            var isSelected = this.parent.contentModule ?
                this.parent.contentModule.selectedRowIndex > -1 : false;
            if (data.isAdd || Object.keys(data.virtualData).length || isKeyFocus || data.isCancel || isSelected) {
                data.isCancel = false;
                this.parent.contentModule.selectedRowIndex = -1;
                if (isKeyFocus) {
                    this.activeKey = this.empty;
                    this.parent.notify('virtaul-key-handler', e);
                }
                // tslint:disable-next-line:no-any
                this.currentInfo.elementToFocus.focus({ preventScroll: true });
            }
            else {
                this.currentInfo.elementToFocus.focus();
            }
        }
    };
    FocusStrategy.prototype.getFocusedElement = function () {
        return this.currentInfo.elementToFocus;
    };
    FocusStrategy.prototype.getContent = function () {
        return this.active || this.content;
    };
    FocusStrategy.prototype.setActive = function (content, isFrozen, isFrozenRight) {
        this.active = content ? isFrozen ? this.fContent : isFrozenRight ? this.frContent : this.content :
            isFrozen ? this.fHeader : isFrozenRight ? this.frHeader : this.header;
    };
    FocusStrategy.prototype.setFocusedElement = function (element, e) {
        var _this = this;
        this.currentInfo.elementToFocus = element;
        setTimeout(function () {
            if (!sf.base.isNullOrUndefined(_this.currentInfo.elementToFocus)) {
                if (_this.parent.enableVirtualization || _this.parent.enableInfiniteScrolling) {
                    _this.focusVirtualElement(e);
                }
                else {
                    _this.currentInfo.elementToFocus.focus();
                }
            }
        }, 0);
    };
    FocusStrategy.prototype.focus = function (e) {
        this.parent.notify(virtaulCellFocus, e);
        this.removeFocus();
        this.addFocus(this.getContent().getFocusInfo(), e);
    };
    FocusStrategy.prototype.removeFocus = function (e) {
        if (!this.currentInfo.element) {
            return;
        }
        sf.base.removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focused', 'e-focus']);
        this.currentInfo.element.tabIndex = -1;
    };
    /** @hidden */
    FocusStrategy.prototype.addOutline = function () {
        var info = this.getContent().getFocusInfo();
        if (info.element) {
            sf.base.addClass([info.element], ['e-focused']);
            sf.base.addClass([info.elementToFocus], ['e-focus']);
        }
    };
    /** @hidden */
    FocusStrategy.prototype.focusHeader = function () {
        this.setActive(false, this.parent.isFrozenGrid());
        this.resetFocus();
    };
    /** @hidden */
    FocusStrategy.prototype.focusContent = function () {
        this.setActive(true, this.parent.isFrozenGrid());
        this.resetFocus();
    };
    FocusStrategy.prototype.resetFocus = function () {
        var current = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        this.focus();
    };
    FocusStrategy.prototype.addFocus = function (info, e) {
        this.currentInfo = info;
        this.currentInfo.outline = info.outline && !sf.base.isNullOrUndefined(e);
        if (!info.element) {
            return;
        }
        var isFocused = info.elementToFocus.classList.contains('e-focus');
        if (isFocused) {
            return;
        }
        if (this.currentInfo.outline) {
            sf.base.addClass([info.element], ['e-focused']);
        }
        sf.base.addClass([info.elementToFocus], ['e-focus']);
        info.element.tabIndex = 0;
        if (!isFocused) {
            this.setFocusedElement(info.elementToFocus, e);
        }
        this.parent.notify(cellFocused, {
            element: info.elementToFocus,
            parent: info.element,
            indexes: this.getContent().matrix.current,
            byKey: !sf.base.isNullOrUndefined(e),
            byClick: sf.base.isNullOrUndefined(e),
            keyArgs: e,
            isJump: this.swap.swap,
            container: this.getContent().getInfo(e),
            outline: !sf.base.isNullOrUndefined(e),
            swapInfo: this.swap
        });
        var _a = this.getContent().matrix.current, rowIndex = _a[0], cellIndex = _a[1];
        this.prevIndexes = { rowIndex: rowIndex, cellIndex: cellIndex };
        this.focusedColumnUid = this.parent.getColumnByIndex(cellIndex).uid;
        this.focusByClick = false;
    };
    FocusStrategy.prototype.refreshMatrix = function (content) {
        var _this = this;
        return function (e) {
            if (content && (e.args && e.args.isFrozen) && !_this.fContent) {
                _this.fContent = new FixedContentFocus(_this.parent);
            }
            else if (content && !_this.frContent && (e.args && e.args.renderFrozenRightContent)) {
                _this.frContent = new FixedRightContentFocus(_this.parent);
            }
            else if (content && !_this.content) {
                _this.content = new ContentFocus(_this.parent);
            }
            if (!content && (e.args && e.args.isFrozen) && !_this.fHeader) {
                _this.fHeader = new FixedHeaderFocus(_this.parent);
            }
            else if (!content && (e.args && e.args.renderFrozenRightContent) && !_this.frHeader) {
                _this.frHeader = new FixedRightHeaderFocus(_this.parent);
            }
            else if (!content && !_this.header) {
                _this.header = new HeaderFocus(_this.parent);
            }
            var cFocus = content ? (e.args && e.args.isFrozen) ? _this.fContent : (e.args && e.args.renderFrozenRightContent)
                ? _this.frContent : _this.content : (e.args && e.args.isFrozen) ? _this.fHeader : (e.args && e.args.renderFrozenRightContent)
                ? _this.frHeader : _this.header;
            var rows = content ? e.rows.slice(_this.parent.frozenRows) : e.rows;
            var updateRow = content ? e.rows.slice(0, _this.parent.frozenRows) : e.rows;
            if (_this.parent.isCollapseStateEnabled() && content) {
                rows = rows.filter(function (x) { return x.visible !== false; });
            }
            var isRowTemplate = !sf.base.isNullOrUndefined(_this.parent.rowTemplate);
            var matrix = cFocus.matrix.generate(updateRow, cFocus.selector, isRowTemplate);
            if (e.name === 'batchAdd' && _this.parent.isFrozenGrid()) {
                var mRows = _this.parent.getMovableRowsObject();
                var newMovableRows = mRows.map(function (row) { return row.clone(); });
                var newFrozenRows = rows.map(function (row) { return row.clone(); });
                _this.fContent.matrix.generate(newFrozenRows, _this.fContent.selector, isRowTemplate);
                _this.content.matrix.generate(newMovableRows, _this.content.selector, isRowTemplate);
                if (_this.parent.getFrozenMode() === 'Left-Right') {
                    var frRows = _this.parent.getFrozenRightRowsObject();
                    var newfrRows = frRows.map(function (row) { return row.clone(); });
                    _this.frContent.matrix.generate(newfrRows, _this.frContent.selector, isRowTemplate);
                }
            }
            else {
                cFocus.matrix.generate(rows, cFocus.selector, isRowTemplate);
            }
            cFocus.generateRows(updateRow, {
                matrix: matrix, handlerInstance: (e.args && e.args.isFrozen) ? _this.fHeader
                    : (e.args && e.args.renderFrozenRightContent) ? _this.frHeader : _this.header
            });
            if (!sf.base.Browser.isDevice && e && e.args) {
                if (!_this.focusByClick && e.args.requestType === 'paging') {
                    _this.skipFocus = false;
                    _this.parent.element.focus();
                }
                if (e.args.requestType === 'grouping') {
                    _this.skipFocus = true;
                }
            }
            if (e && e.args && e.args.requestType === 'virtualscroll') {
                if (_this.currentInfo.uid) {
                    var index_1;
                    var bool = e.rows.some(function (row, i) {
                        index_1 = i;
                        return row.uid === _this.currentInfo.uid;
                    });
                    if (bool) {
                        _this.content.matrix.current[0] = index_1;
                        _this.content.matrix.current[1] = _this.parent.getColumnIndexByUid(_this.focusedColumnUid) || 0;
                        var focusElement = _this.getContent().getFocusInfo().elementToFocus;
                        if (focusElement) {
                            var cellPosition = focusElement.getBoundingClientRect();
                            var gridPosition = _this.parent.element.getBoundingClientRect();
                            if (cellPosition.top >= 0 && cellPosition.left >= 0 &&
                                cellPosition.right <= Math.min(gridPosition.right, window.innerWidth ||
                                    document.documentElement.clientWidth) &&
                                cellPosition.bottom <= Math.min(gridPosition.bottom, window.innerHeight ||
                                    document.documentElement.clientHeight)) {
                                _this.focus();
                            }
                        }
                    }
                }
                else if (e.args.focusElement && e.args.focusElement.classList.contains('e-filtertext')) {
                    var focusElement = _this.parent.element.querySelector('#' + e.args.focusElement.id);
                    if (focusElement) {
                        focusElement.focus();
                    }
                }
            }
        };
    };
    FocusStrategy.prototype.addEventListener = function () {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        sf.base.EventHandler.add(this.parent.element, 'mousedown', this.focusCheck, this);
        sf.base.EventHandler.add(this.parent.element, 'focus', this.onFocus, this);
        this.parent.element.addEventListener('focus', this.passiveHandler = function (e) { return _this.passiveFocus(e); }, true);
        sf.base.EventHandler.add(this.parent.element, 'focusout', this.onBlur, this);
        this.parent.on(keyPressed, this.onKeyPress, this);
        this.parent.on(click, this.onClick, this);
        this.parent.on(contentReady, this.refMatrix, this);
        this.parent.on(partialRefresh, this.refMatrix, this);
        this.parent.on(headerRefreshed, this.refreshMatrix(), this);
        this.parent.on('close-edit', this.restoreFocus, this);
        this.parent.on('restore-Focus', this.restoreFocus, this);
        var evts = ['start-edit', 'start-add'];
        for (var i = 0; i < evts.length; i++) {
            this.parent.on(evts[i], this.clearIndicator, this);
        }
        this.parent.on('sorting-complete', this.restoreFocus, this);
        this.parent.on('filtering-complete', this.filterfocus, this);
        var actionsG = ['grouping', 'ungrouping'];
        for (var k = 0; k < actionsG.length; k++) {
            this.parent.on(actionsG[k] + "-complete", this.restoreFocusWithAction, this);
        }
        this.parent.on(batchAdd, this.refMatrix, this);
        this.parent.on(batchCancel, this.refMatrix, this);
        this.parent.on(batchDelete, this.refMatrix, this);
        this.parent.on(detailDataBound, this.refMatrix, this);
        this.parent.on(onEmpty, this.refMatrix, this);
        this.parent.on(cellFocused, this.internalCellFocus, this);
    };
    FocusStrategy.prototype.filterfocus = function () {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            this.restoreFocus();
        }
    };
    FocusStrategy.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        sf.base.EventHandler.remove(this.parent.element, 'mousedown', this.focusCheck);
        sf.base.EventHandler.remove(this.parent.element, 'focus', this.onFocus);
        sf.base.EventHandler.remove(this.parent.element, 'focusout', this.onBlur);
        this.parent.element.removeEventListener('focus', this.passiveHandler, true);
        this.parent.off(keyPressed, this.onKeyPress);
        this.parent.off(click, this.onClick);
        this.parent.off(contentReady, this.refMatrix);
        this.parent.off(partialRefresh, this.refMatrix);
        this.parent.off(headerRefreshed, this.refreshMatrix());
        this.parent.off('close-edit', this.restoreFocus);
        this.parent.off('restore-focus', this.restoreFocus);
        var evts = ['start-edit', 'start-add'];
        for (var i = 0; i < evts.length; i++) {
            this.parent.off(evts[i], this.clearOutline);
        }
        this.parent.off('sorting-complete', this.restoreFocus);
        this.parent.off('filtering-complete', this.filterfocus);
        var actionsG = ['grouping', 'ungrouping'];
        for (var k = 0; k < actionsG.length; k++) {
            this.parent.on(actionsG[k] + "-complete", this.restoreFocusWithAction);
        }
        this.parent.off(batchAdd, this.refMatrix);
        this.parent.off(batchDelete, this.refMatrix);
        this.parent.off(batchCancel, this.refMatrix);
        this.parent.off(detailDataBound, this.refMatrix);
        this.parent.off(onEmpty, this.refMatrix);
        this.parent.off(cellFocused, this.internalCellFocus);
    };
    FocusStrategy.prototype.destroy = function () {
        this.removeEventListener();
    };
    FocusStrategy.prototype.restoreFocus = function () {
        this.addFocus(this.getContent().getFocusInfo());
    };
    FocusStrategy.prototype.restoreFocusWithAction = function (e) {
        if (!this.parent.enableInfiniteScrolling) {
            var matrix = this.getContent().matrix;
            var current = matrix.current;
            switch (e.requestType) {
                case 'grouping':
                case 'ungrouping':
                    current[1] = current.length &&
                        !this.parent.groupSettings.showGroupedColumn && !sf.base.isNullOrUndefined(matrix.matrix[current[0]]) ?
                        matrix.matrix[current[0]].indexOf(1) : e.requestType === 'grouping' ? current[1] + 1 : current[1] - 1;
                    break;
            }
            this.getContent().matrix.current = current;
            this.addFocus(this.getContent().getFocusInfo());
        }
    };
    FocusStrategy.prototype.clearOutline = function () {
        this.getContent().matrix.current = this.getContent().matrix.get(0, -1, [0, 1], 'downArrow', this.getContent().validator());
        this.clearIndicator();
    };
    FocusStrategy.prototype.clearIndicator = function () {
        if (!this.currentInfo.element || !this.currentInfo.elementToFocus) {
            return;
        }
        sf.base.removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focus', 'e-focused']);
    };
    FocusStrategy.prototype.getPrevIndexes = function () {
        var forget = this.forget;
        this.forget = false;
        return forget || !Object.keys(this.prevIndexes).length ? { rowIndex: null, cellIndex: null } : this.prevIndexes;
    };
    FocusStrategy.prototype.forgetPrevious = function () {
        this.forget = true;
    };
    FocusStrategy.prototype.setActiveByKey = function (action, active) {
        var _this = this;
        if (!this.parent.isFrozenGrid() && this.parent.frozenRows === 0) {
            return;
        }
        var info;
        var actions = {
            'home': function () { return ({ toHeader: !info.isContent, toFrozen: true }); },
            'end': function () { return ({ toHeader: !info.isContent, toFrozen: false }); },
            'ctrlHome': function () { return ({ toHeader: true, toFrozen: _this.parent.isFrozenGrid() }); },
            'ctrlEnd': function () { return ({ toHeader: false, toFrozen: false }); }
        };
        if (!(action in actions)) {
            return;
        }
        info = active.getInfo();
        var swap = actions[action]();
        this.setActive(!swap.toHeader, swap.toFrozen);
        this.getContent().matrix.current = active.matrix.current;
    };
    FocusStrategy.prototype.internalCellFocus = function (e) {
        if (!(e.byKey && e.container.isContent && e.keyArgs.action === 'enter'
            && (e.parent.classList.contains('e-detailcell') ||
                e.parent.classList.contains('e-unboundcell') || e.parent.classList.contains('e-templatecell')))) {
            return;
        }
        this.clearIndicator();
        var focusEle = this.getContent().getFocusable(this.getFocusedElement());
        this.setFocusedElement(focusEle);
        this.currentInfo.skipAction = true;
    };
    return FocusStrategy;
}());
/**
 * Create matrix from row collection which act as mental model for cell navigation
 * @hidden
 */
var Matrix = /** @class */ (function () {
    function Matrix() {
        this.matrix = [];
        this.current = [];
    }
    Matrix.prototype.set = function (rowIndex, columnIndex, allow) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.columns));
        this.matrix[rowIndex] = this.matrix[rowIndex] || [];
        this.matrix[rowIndex][columnIndex] = allow ? 1 : 0;
    };
    Matrix.prototype.get = function (rowIndex, columnIndex, navigator, action, validator) {
        var tmp = columnIndex;
        if (rowIndex + navigator[0] < 0) {
            return [rowIndex, columnIndex];
        }
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], this.rows));
        var emptyTable = true;
        if (sf.base.isNullOrUndefined(this.matrix[rowIndex])) {
            return null;
        }
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], this.matrix[rowIndex].length - 1));
        if (tmp + navigator[1] > this.matrix[rowIndex].length - 1 && validator(rowIndex, columnIndex, action)) {
            return [rowIndex, tmp];
        }
        var first = this.first(this.matrix[rowIndex], columnIndex, navigator, true, action);
        columnIndex = first === null ? tmp : first;
        var val = sf.base.getValue(rowIndex + "." + columnIndex, this.matrix);
        if (rowIndex === this.rows && (action === 'downArrow' || action === 'enter')) {
            navigator[0] = -1;
        }
        if (first === null) {
            rowIndex = this.current[0];
            for (var i = 0; i < this.rows; i++) {
                if (this.matrix[i].some(function (v) { return v === 1; })) {
                    emptyTable = false;
                    break;
                }
            }
            if (emptyTable) {
                return [rowIndex, columnIndex];
            }
        }
        return this.inValid(val) || !validator(rowIndex, columnIndex, action) ?
            this.get(rowIndex, tmp, navigator, action, validator) : [rowIndex, columnIndex];
    };
    Matrix.prototype.first = function (vector, index, navigator, moveTo, action) {
        if (((index < 0 || index === vector.length) && this.inValid(vector[index])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some(function (v) { return v === 1; })) {
            return null;
        }
        return !this.inValid(vector[index]) ? index :
            this.first(vector, (['upArrow', 'downArrow', 'shiftUp', 'shiftDown'].indexOf(action) !== -1) ? moveTo ? 0 : ++index : index + navigator[1], navigator, false, action);
    };
    Matrix.prototype.select = function (rowIndex, columnIndex) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.matrix[rowIndex].length - 1));
        this.current = [rowIndex, columnIndex];
    };
    Matrix.prototype.generate = function (rows, selector, isRowTemplate) {
        this.rows = rows.length - 1;
        this.matrix = [];
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].cells.filter(function (c) { return c.isSpanned !== true; });
            this.columns = Math.max(cells.length - 1, this.columns | 0);
            for (var j = 0; j < cells.length; j++) {
                this.set(i, j, selector(rows[i], cells[j], isRowTemplate));
            }
        }
        return this.matrix;
    };
    Matrix.prototype.inValid = function (value) {
        return value === 0 || value === undefined;
    };
    return Matrix;
}());
/**
 * @hidden
 */
var ContentFocus = /** @class */ (function () {
    function ContentFocus(parent) {
        var _this = this;
        this.matrix = new Matrix();
        this.parent = parent;
        this.keyActions = {
            'rightArrow': [0, 1],
            'tab': [0, 1],
            'leftArrow': [0, -1],
            'shiftTab': [0, -1],
            'upArrow': [-1, 0],
            'downArrow': [1, 0],
            'shiftUp': [-1, 0],
            'shiftDown': [1, 0],
            'shiftRight': [0, 1],
            'shiftLeft': [0, -1],
            'enter': [1, 0],
            'shiftEnter': [-1, 0]
        };
        this.indexesByKey = function (action) {
            var opt = {
                'home': [_this.matrix.current[0], -1, 0, 1],
                'end': [_this.matrix.current[0], _this.matrix.columns + 1, 0, -1],
                'ctrlHome': [0, -1, 0, 1],
                'ctrlEnd': [_this.matrix.rows, _this.matrix.columns + 1, 0, -1]
            };
            return opt[action] || null;
        };
    }
    ContentFocus.prototype.getTable = function () {
        return (this.parent.isFrozenGrid() ?
            this.parent.getContent().querySelector('.e-movablecontent .e-table') :
            this.parent.getContentTable());
    };
    ContentFocus.prototype.onKeyPress = function (e) {
        var navigator = this.keyActions[e.action];
        var current = this.getCurrentFromAction(e.action, navigator, e.action in this.keyActions, e);
        if (!current) {
            return;
        }
        if ((['tab', 'shiftTab'].indexOf(e.action) > -1 && this.matrix.current || []).toString() === current.toString()) {
            if (current.toString() === [this.matrix.rows, this.matrix.columns].toString() ||
                current.toString() === [0, 0].toString() || (this.matrix.current[0] === this.matrix.rows &&
                this.matrix.current.toString() === current.toString())) {
                return false;
            }
            else {
                current = this.editNextRow(current[0], current[1], e.action);
            }
        }
        this.matrix.select(current[0], current[1]);
    };
    ContentFocus.prototype.editNextRow = function (rowIndex, cellIndex, action) {
        var gObj = this.parent;
        var editNextRow = gObj.editSettings.allowNextRowEdit && (gObj.isEdit || gObj.isLastCellPrimaryKey);
        var visibleIndex = gObj.getColumnIndexByField(gObj.getVisibleColumns()[0].field);
        var cell = this.getTable().rows[rowIndex].cells[cellIndex];
        if (action === 'tab' && editNextRow) {
            rowIndex++;
            var index = (this.getTable().rows[rowIndex].querySelectorAll('.e-indentcell').length +
                this.getTable().rows[rowIndex].querySelectorAll('.e-detailrowcollapse').length);
            cellIndex = visibleIndex + index;
        }
        if (action === 'shiftTab' && editNextRow) {
            rowIndex--;
            cellIndex = gObj.getColumnIndexByField(gObj.getVisibleColumns()[gObj.getVisibleColumns().length - 1].field);
        }
        return !cell.classList.contains('e-rowcell') && !cell.classList.contains('e-headercell') &&
            !cell.classList.contains('e-groupcaption') ?
            this.editNextRow(rowIndex, cellIndex, action) : [rowIndex, cellIndex];
    };
    ContentFocus.prototype.getCurrentFromAction = function (action, navigator, isPresent, e) {
        if (navigator === void 0) { navigator = [0, 0]; }
        if (!isPresent && !this.indexesByKey(action) || (this.matrix.current.length === 0)) {
            return null;
        }
        if (!this.shouldFocusChange(e)) {
            return this.matrix.current;
        }
        var _a = this.indexesByKey(action) || this.matrix.current.concat(navigator), rowIndex = _a[0], cellIndex = _a[1], rN = _a[2], cN = _a[3];
        var current = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator());
        return current;
    };
    ContentFocus.prototype.onClick = function (e, force) {
        var target = e.target;
        target = (target.classList.contains('e-rowcell') ? target : sf.base.closest(target, 'td'));
        target = target ? target : sf.base.closest(e.target, 'td.e-detailrowcollapse')
            || sf.base.closest(e.target, 'td.e-detailrowexpand');
        target = sf.base.closest(e.target, 'td.e-detailcell') ?
            sf.base.isNullOrUndefined(sf.base.closest(sf.base.closest(e.target, '.e-grid'), 'td.e-detailcell')) ? null : target : target;
        target = target && sf.base.closest(target, 'table').classList.contains('e-table') ? target : null;
        if (!target) {
            return false;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var _b = this.matrix.current, oRowIndex = _b[0], oCellIndex = _b[1];
        var val = sf.base.getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex) ||
            (!parentsUntil(e.target, 'e-rowcell') && !parentsUntil(e.target, 'e-groupcaption'))) {
            return false;
        }
        this.matrix.select(rowIndex, cellIndex);
    };
    ContentFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        this.matrix.current = [rowIndex, cellIndex];
        info.element = !sf.base.isNullOrUndefined(this.getTable().rows[rowIndex]) ? this.getTable().rows[rowIndex].cells[cellIndex] : null;
        if (!info.element) {
            return info;
        }
        info.elementToFocus = !info.element.classList.contains('e-unboundcell') && !info.element.classList.contains('e-detailcell')
            ? this.getFocusable(info.element) : info.element;
        info.outline = true;
        info.uid = info.element.parentElement.getAttribute('data-uid');
        return info;
    };
    ContentFocus.prototype.getFocusable = function (element) {
        var query = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        if (this.parent.isEdit) {
            query = 'input:not([type="hidden"]), select:not([aria-hidden="true"]), textarea';
        }
        var child = [].slice.call(element.querySelectorAll(query));
        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        return child.length ? child[0] : element;
    };
    ContentFocus.prototype.selector = function (row, cell, isRowTemplate) {
        var types = [CellType.Expand, CellType.GroupCaption, CellType.CaptionSummary, CellType.GroupSummary];
        return ((row.isDataRow && cell.visible && (cell.isDataCell || cell.isTemplate))
            || (row.isDataRow && cell.cellType === CellType.DetailExpand && sf.base.isNullOrUndefined(cell.visible))
            || (!row.isDataRow && types.indexOf(cell.cellType) > -1)
            || (cell.column && cell.column.type === 'checkbox')
            || (cell.cellType === CellType.CommandColumn)
            || (row.isDataRow && isRowTemplate))
            && !(row.edit === 'delete' && row.isDirty);
    };
    ContentFocus.prototype.jump = function (action, current) {
        var frozenSwap = this.parent.getFrozenLeftCount() &&
            ((action === 'leftArrow' || action === 'shiftTab') && current[1] === 0);
        var right = ((action === 'rightArrow' || action === 'tab') && current[1] === this.matrix.columns);
        var frSwap = this.parent.getFrozenMode() === 'Left-Right' && right;
        if (this.parent.getFrozenMode() === 'Right') {
            frozenSwap = right;
        }
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'shiftEnter';
        if (action === 'tab' && !this.parent.isEdit &&
            current[1] === this.matrix.matrix[current[0]].lastIndexOf(1) && this.matrix.matrix.length - 1 !== current[0]) {
            this.matrix.current[0] = this.matrix.current[0] + 1;
            this.matrix.current[1] = -1;
            frozenSwap = this.parent.isFrozenGrid();
        }
        if (action === 'shiftTab' && !this.parent.isEdit &&
            current[0] !== 0 && this.matrix.matrix[current[0]].indexOf(1) === current[1]) {
            this.matrix.current[0] = this.matrix.current[0] - 1;
            this.matrix.current[1] = this.matrix.matrix[current[0]].length;
        }
        var isHeaderFocus = false;
        var row = document.activeElement.parentElement;
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && row.classList.contains('e-row')) {
            var rowIndex = parseInt(row.getAttribute('aria-rowindex'), 10);
            isHeaderFocus = rowIndex > 0;
        }
        var info = {
            swap: !isHeaderFocus ? ((action === 'upArrow' || enterFrozen) && current[0] === 0) || frozenSwap || frSwap : false,
            toHeader: (action === 'upArrow' || enterFrozen) && current[0] === 0,
            toFrozen: frozenSwap,
            toFrozenRight: frSwap
        };
        return info;
    };
    ContentFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current = [];
        if (this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === 'Left-Right') {
            if (action === 'leftArrow' || action === 'shiftTab') {
                current[0] = previous[0];
                current[1] = active.matrix.columns + 1;
            }
            if (this.parent.getFrozenMode() === 'Left-Right' && (action === 'rightArrow' || action === 'tab')) {
                current[0] = previous[0];
                current[1] = -1;
            }
        }
        else if (action === 'rightArrow' || action === 'tab') {
            current[0] = previous[0];
            current[1] = -1;
        }
        if (action === 'downArrow' || action === 'enter') {
            current[0] = -1;
            current[1] = previous[1];
        }
        return current;
    };
    ContentFocus.prototype.generateRows = function (rows, optionals) {
        var _a;
        var matrix = optionals.matrix, handlerInstance = optionals.handlerInstance;
        var len = handlerInstance.matrix.matrix.length;
        var defaultLen = this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar' ? len + 1 : len;
        handlerInstance.matrix.matrix = handlerInstance.matrix.matrix.slice(0, defaultLen); //Header matrix update.
        handlerInstance.matrix.rows = defaultLen;
        (_a = handlerInstance.matrix.matrix).push.apply(_a, matrix);
        handlerInstance.matrix.rows += matrix.length;
    };
    ContentFocus.prototype.getInfo = function (e) {
        var info = this.getFocusInfo();
        var _a = this.matrix.current, rIndex = _a[0], cIndex = _a[1];
        var isData = info.element.classList.contains('e-rowcell');
        var isSelectable = isData || (e && e.action !== 'enter' && (info.element.classList.contains('e-detailrowcollapse')
            || info.element.classList.contains('e-detailrowexpand')));
        var _b = [Math.min(parseInt(info.element.parentElement.getAttribute('aria-rowindex'), 10), rIndex),
            Math.min(parseInt(info.element.getAttribute('aria-colindex'), 10), cIndex)], rowIndex = _b[0], cellIndex = _b[1];
        return { isContent: true, isDataCell: isData, indexes: [rowIndex, cellIndex], isSelectable: isSelectable };
    };
    ContentFocus.prototype.validator = function () {
        var table = this.getTable();
        return function (rowIndex, cellIndex, action) {
            if (!sf.base.isNullOrUndefined(table.rows[rowIndex])) {
                var cell = void 0;
                cellIndex = table.querySelector('.e-emptyrow') ? 0 : cellIndex;
                if (table.rows[rowIndex].cells[0].classList.contains('e-editcell')) {
                    cell = table.rows[rowIndex].cells[0].querySelectorAll('td')[cellIndex];
                }
                else {
                    cell = table.rows[rowIndex].cells[cellIndex];
                }
                var isCellWidth = cell.getBoundingClientRect().width !== 0;
                if (action === 'enter' || action === 'shiftEnter') {
                    return isCellWidth && cell.classList.contains('e-rowcell');
                }
                if ((action === 'shiftUp' || action === 'shiftDown') && cell.classList.contains('e-rowcell')) {
                    return isCellWidth;
                }
                else if (action !== 'shiftUp' && action !== 'shiftDown') {
                    return isCellWidth;
                }
            }
            return false;
        };
    };
    ContentFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, _b = _a[0], rIndex = _b === void 0 ? -1 : _b, _c = _a[1], cIndex = _c === void 0 ? -1 : _c;
        if (rIndex < 0 || cIndex < 0) {
            return true;
        }
        var cell = sf.base.getValue(rIndex + ".cells." + cIndex, this.getTable().rows);
        if (!cell) {
            return true;
        }
        return e.action === 'enter' || e.action === 'shiftEnter' ?
            cell.classList.contains('e-rowcell') && !cell.classList.contains('e-unboundcell')
                && (!cell.classList.contains('e-templatecell') || cell.classList.contains('e-editedbatchcell'))
                && !cell.classList.contains('e-detailcell') : true;
    };
    ContentFocus.prototype.getGridSeletion = function () {
        return !sf.base.isBlazor() && this.parent.allowSelection && this.parent.selectionSettings.allowColumnSelection;
    };
    return ContentFocus;
}());
/**
 * @hidden
 */
var HeaderFocus = /** @class */ (function (_super) {
    __extends$14(HeaderFocus, _super);
    function HeaderFocus(parent) {
        return _super.call(this, parent) || this;
    }
    HeaderFocus.prototype.getTable = function () {
        return (this.parent.isFrozenGrid() ?
            this.parent.getHeaderContent().querySelector('.e-movableheader .e-table') :
            this.parent.getHeaderTable());
    };
    HeaderFocus.prototype.onClick = function (e) {
        var target = e.target;
        target = (target.classList.contains('e-headercell') ? target : sf.base.closest(target, 'th'));
        if (!target && this.parent.frozenRows !== 0) {
            target = (e.target.classList.contains('e-rowcell') ? e.target :
                sf.base.closest(e.target, 'td'));
        }
        if (e.target.classList.contains('e-columnheader') ||
            e.target.querySelector('.e-stackedheadercell')) {
            return false;
        }
        if (!target) {
            return;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var val = sf.base.getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val)) {
            return false;
        }
        this.matrix.select(target.parentElement.rowIndex, target.cellIndex);
    };
    HeaderFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        info.element = this.getTable().rows[rowIndex].cells[cellIndex];
        if (!sf.base.isNullOrUndefined(info.element)) {
            info.elementToFocus = this.getFocusable(info.element);
            info.outline = !info.element.classList.contains('e-filterbarcell');
        }
        return info;
    };
    HeaderFocus.prototype.selector = function (row, cell) {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate || !sf.base.isNullOrUndefined(cell.column.template))) ||
            cell.column.type === 'checkbox' || cell.cellType === CellType.StackedHeader;
    };
    HeaderFocus.prototype.jump = function (action, current) {
        var frozenSwap = this.parent.getFrozenLeftCount() &&
            (action === 'leftArrow' || (action === 'shiftLeft' && this.getGridSeletion()) || action === 'shiftTab') && current[1] === 0;
        var right = (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion())
            || action === 'tab') && current[1] === this.matrix.columns;
        var frSwap = this.parent.getFrozenMode() === 'Left-Right' && right;
        if (this.parent.getFrozenMode() === 'Right') {
            frozenSwap = right;
        }
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'enter';
        var isLastCell;
        var lastRow;
        var headerSwap = frozenSwap || frSwap;
        var fMatrix = this.parent.focusModule.fHeader && this.parent.focusModule.fHeader.matrix.matrix;
        var isPresent = fMatrix && !sf.base.isNullOrUndefined(fMatrix[current[0]]);
        if (this.parent.enableHeaderFocus && action === 'tab') {
            lastRow = this.matrix.matrix.length - 1 === current[0];
            isLastCell = current[1] === this.matrix.matrix[current[0]].lastIndexOf(1);
            if (isLastCell) {
                if (!lastRow) {
                    this.matrix.current[0] = this.matrix.current[0] + 1;
                }
                else {
                    this.matrix.current[0] = 0;
                }
                this.matrix.current[1] = -1;
            }
            if (this.parent.isFrozenGrid() && lastRow && isLastCell) {
                frozenSwap = true;
                headerSwap = false;
            }
        }
        return {
            swap: ((action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1) ||
                (isPresent && (frozenSwap || frSwap)) || (action === 'tab' && lastRow && isLastCell),
            toHeader: headerSwap,
            toFrozen: frozenSwap,
            toFrozenRight: frSwap
        };
    };
    HeaderFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current1 = [];
        if (this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === 'Left-Right') {
            if (action === 'leftArrow' || (action === 'shiftLeft' && this.getGridSeletion()) || action === 'shiftTab') {
                current1[0] = previous[0];
                current1[1] = active.matrix.columns + 1;
            }
            if (this.parent.getFrozenMode() === 'Left-Right'
                && (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab')) {
                current1[0] = previous[0];
                current1[1] = -1;
            }
        }
        else if (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') {
            current1[0] = previous[0];
            current1[1] = -1;
        }
        if (action === 'upArrow' || action === 'shiftEnter') {
            current1[0] = this.matrix.matrix.length;
            current1[1] = previous[1];
        }
        return current1;
    };
    HeaderFocus.prototype.generateRows = function (rows) {
        var length = this.matrix.matrix.length;
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar') {
            this.matrix.rows = ++this.matrix.rows;
            var cells = rows[0].cells;
            for (var i = 0; i < cells.length; i++) {
                this.matrix.set(length, i, cells[i].visible && cells[i].column.allowFiltering !== false);
            }
        }
    };
    HeaderFocus.prototype.getInfo = function (e) {
        return sf.base.extend(_super.prototype.getInfo.call(this, e), { isContent: false, isHeader: true });
    };
    HeaderFocus.prototype.validator = function () {
        return function () { return true; };
    };
    HeaderFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, rowIndex = _a[0], columnIndex = _a[1];
        if (rowIndex < 0 || columnIndex < 0) {
            return true;
        }
        var cell = sf.base.getValue(rowIndex + ".cells." + columnIndex, this.getTable().rows);
        if (!cell) {
            return true;
        }
        return e.action === 'enter' || e.action === 'altDownArrow' ? !cell.classList.contains('e-headercell') : true;
    };
    return HeaderFocus;
}(ContentFocus));
var FixedContentFocus = /** @class */ (function (_super) {
    __extends$14(FixedContentFocus, _super);
    function FixedContentFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedContentFocus.prototype.getTable = function () {
        return this.parent.getContent().querySelector('.e-frozencontent .e-table');
    };
    FixedContentFocus.prototype.jump = function (action, current) {
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'shiftEnter';
        var toHeader = (action === 'upArrow' || enterFrozen) && current[0] === 0;
        if (this.parent.getFrozenMode() === 'Right') {
            var swap = toHeader || ((action === 'shiftTab' || action === 'leftArrow') && current[1] === 0);
            return { swap: swap, toHeader: toHeader, toFrozen: toHeader };
        }
        return {
            swap: toHeader || ((action === 'tab' || action === 'rightArrow') && current[1] === this.matrix.columns),
            toHeader: toHeader,
            toFrozen: toHeader
        };
    };
    FixedContentFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current2 = [];
        if (this.parent.getFrozenMode() === 'Right') {
            if (action === 'rightArrow' || action === 'tab') {
                current2[0] = previous[0];
                current2[1] = -1;
            }
        }
        else {
            if (action === 'tab' && this.parent.enableHeaderFocus) {
                current2[0] = previous[0];
                current2[1] = -1;
            }
            if (action === 'leftArrow' || action === 'shiftTab') {
                current2[0] = previous[0];
                current2[1] = active.matrix.columns + 1;
            }
        }
        if (action === 'downArrow' || action === 'enter') {
            current2[0] = -1;
            current2[1] = previous[1];
        }
        return current2;
    };
    return FixedContentFocus;
}(ContentFocus));
var FixedHeaderFocus = /** @class */ (function (_super) {
    __extends$14(FixedHeaderFocus, _super);
    function FixedHeaderFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedHeaderFocus.prototype.jump = function (action, current) {
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'enter';
        var hMatrix = this.parent.focusModule.header && this.parent.focusModule.header.matrix.matrix;
        var isPresent = hMatrix && !sf.base.isNullOrUndefined(hMatrix[current[0]]);
        if (this.parent.getFrozenMode() === 'Right') {
            var frSwap = (action === 'leftArrow' || (action === 'shiftLeft' && this.getGridSeletion())
                || action === 'shiftTab') && current[1] === 0;
            var swap = ((action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1) ||
                (isPresent && frSwap);
            var toFrozen = (action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1;
            return { swap: swap, toHeader: frSwap, toFrozen: toFrozen };
        }
        return {
            swap: (action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1 || ((action === 'rightArrow' ||
                (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') &&
                current[1] === this.matrix.columns && isPresent),
            toHeader: (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') &&
                current[1] === this.matrix.columns,
            toFrozen: (action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1
        };
    };
    FixedHeaderFocus.prototype.getTable = function () {
        return (this.parent.getHeaderContent().querySelector('.e-frozenheader .e-table'));
    };
    FixedHeaderFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current3 = [];
        if (this.parent.getFrozenMode() === 'Right') {
            if (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') {
                current3[0] = previous[0];
                current3[1] = -1;
            }
        }
        else {
            if (action === 'leftArrow' || (action === 'shiftLeft' && this.getGridSeletion()) || action === 'shiftTab') {
                current3[0] = previous[0];
                current3[1] = active.matrix.columns + 1;
            }
        }
        if (action === 'upArrow' || action === 'shiftEnter') {
            current3[0] = this.matrix.matrix.length;
            current3[1] = previous[1];
        }
        return current3;
    };
    return FixedHeaderFocus;
}(HeaderFocus));
var FixedRightContentFocus = /** @class */ (function (_super) {
    __extends$14(FixedRightContentFocus, _super);
    function FixedRightContentFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedRightContentFocus.prototype.getTable = function () {
        return this.parent.getContent().querySelector('.e-frozen-right-content .e-table');
    };
    FixedRightContentFocus.prototype.jump = function (action, current) {
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'shiftEnter';
        var toHeader = (action === 'upArrow' || enterFrozen) && current[0] === 0;
        return {
            swap: toHeader || ((action === 'shiftTab' || action === 'leftArrow') && current[1] === 0),
            toHeader: toHeader,
            toFrozenRight: toHeader
        };
    };
    FixedRightContentFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current2 = [];
        if (action === 'rightArrow' || action === 'tab') {
            current2[0] = previous[0];
            current2[1] = -1;
        }
        if (action === 'downArrow' || action === 'enter') {
            current2[0] = -1;
            current2[1] = previous[1];
        }
        return current2;
    };
    return FixedRightContentFocus;
}(ContentFocus));
var FixedRightHeaderFocus = /** @class */ (function (_super) {
    __extends$14(FixedRightHeaderFocus, _super);
    function FixedRightHeaderFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedRightHeaderFocus.prototype.jump = function (action, current) {
        var headerMat = this.parent.focusModule.header && this.parent.focusModule.header.matrix.matrix;
        var isPresent = headerMat && !sf.base.isNullOrUndefined(headerMat[current[0]]);
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'enter';
        var frozenSwap = (action === 'leftArrow' || (action === 'shiftLeft' && this.getGridSeletion())
            || action === 'shiftTab') && current[1] === 0;
        var swap = ((action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1) ||
            (isPresent && frozenSwap);
        var toFrozen = (action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1;
        return { swap: swap, toHeader: frozenSwap, toFrozenRight: toFrozen };
    };
    FixedRightHeaderFocus.prototype.getTable = function () {
        return (this.parent.getHeaderContent().querySelector('.e-frozen-right-header .e-table'));
    };
    FixedRightHeaderFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current3 = [];
        if (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') {
            current3[0] = previous[0];
            current3[1] = 0;
        }
        if (action === 'upArrow' || action === 'shiftEnter') {
            current3[0] = this.matrix.matrix.length;
            current3[1] = previous[1];
        }
        return current3;
    };
    return FixedRightHeaderFocus;
}(HeaderFocus));

var __extends$15 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the paging behavior of the Grid.
 */
var PageSettings = /** @class */ (function (_super) {
    __extends$15(PageSettings, _super);
    function PageSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(12)
    ], PageSettings.prototype, "pageSize", void 0);
    __decorate$3([
        sf.base.Property(8)
    ], PageSettings.prototype, "pageCount", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], PageSettings.prototype, "currentPage", void 0);
    __decorate$3([
        sf.base.Property()
    ], PageSettings.prototype, "totalRecordsCount", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], PageSettings.prototype, "enableQueryString", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], PageSettings.prototype, "pageSizes", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], PageSettings.prototype, "template", void 0);
    return PageSettings;
}(sf.base.ChildProperty));

var __extends$16 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the column chooser behavior of the Grid.
 */
var ColumnChooserSettings = /** @class */ (function (_super) {
    __extends$16(ColumnChooserSettings, _super);
    function ColumnChooserSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('startsWith')
    ], ColumnChooserSettings.prototype, "operator", void 0);
    return ColumnChooserSettings;
}(sf.base.ChildProperty));

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * The `Selection` module is used to handle cell and row selection.
 */
var Selection = /** @class */ (function () {
    /**
     * Constructor for the Grid selection module
     * @hidden
     */
    function Selection(parent, selectionSettings, locator) {
        //Internal letiables       
        /**
         * @hidden
         */
        this.selectedRowIndexes = [];
        /**
         * @hidden
         */
        this.selectedRowCellIndexes = [];
        /**
         * @hidden
         */
        this.selectedRecords = [];
        /**
         * @hidden
         */
        this.preventFocus = false;
        /**
         *  @hidden
         */
        this.selectedColumnsIndexes = [];
        this.checkBoxState = false;
        this.isMultiShiftRequest = false;
        this.isMultiCtrlRequest = false;
        this.enableSelectMultiTouch = false;
        this.clearRowCheck = false;
        this.selectRowCheck = false;
        this.selectedRowState = {};
        this.totalRecordsCount = 0;
        this.chkAllCollec = [];
        this.isCheckedOnAdd = false;
        this.persistSelectedData = [];
        this.needColumnSelection = false;
        this.isCancelDeSelect = false;
        this.isPreventCellSelect = false;
        this.disableUI = false;
        this.isPersisted = false;
        this.cmdKeyPressed = false;
        this.cellselected = false;
        this.isMultiSelection = false;
        this.isAddRowsToSelection = false;
        this.initialRowSelection = false;
        /**
         * @hidden
         */
        this.autoFillRLselection = true;
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService('rendererFactory');
        this.focus = locator.getService('focus');
        this.addEventListener();
        this.wireEvents();
    }
    Selection.prototype.initializeSelection = function () {
        this.parent.log('selection_key_missing');
        this.render();
    };
    /**
     * The function used to trigger onActionBegin
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionBegin = function (args, type) {
        this.parent.trigger(type, this.fDataUpdate(args));
    };
    Selection.prototype.fDataUpdate = function (args) {
        if (!this.isMultiSelection && (!sf.base.isNullOrUndefined(args.cellIndex) || !sf.base.isNullOrUndefined(args.rowIndex))) {
            var rowObj = this.getRowObj(sf.base.isNullOrUndefined(args.rowIndex) ? sf.base.isNullOrUndefined(args.cellIndex) ?
                this.currentIndex : args.cellIndex.rowIndex : args.rowIndex);
            args.foreignKeyData = rowObj.foreignKeyData;
        }
        return args;
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionComplete = function (args, type) {
        this.parent.trigger(type, this.fDataUpdate(args));
        this.isMultiSelection = false;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    /**
     * To destroy the selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.hidePopUp();
        this.clearSelection();
        this.removeEventListener();
        this.unWireEvents();
        sf.base.EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        sf.base.EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler);
    };
    Selection.prototype.isEditing = function () {
        return (this.parent.editSettings.mode === 'Normal' || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule &&
            this.parent.editModule.formObj && !this.parent.editModule.formObj.validate())) &&
            this.parent.isEdit && !this.parent.isPersistSelection;
    };
    Selection.prototype.getSelectedMovableRow = function (index) {
        var gObj = this.parent;
        if (gObj.isFrozenGrid() && this.parent.getContent().querySelector('.e-movablecontent')) {
            return gObj.getMovableRowByIndex(index);
        }
        return null;
    };
    Selection.prototype.getSelectedFrozenRightRow = function (index) {
        var gObj = this.parent;
        if (gObj.isFrozenGrid() && gObj.getFrozenMode() === 'Left-Right' && gObj.getFrozenRightContent()) {
            return gObj.getFrozenRightRowByIndex(index);
        }
        return null;
    };
    Selection.prototype.getCurrentBatchRecordChanges = function () {
        var gObj = this.parent;
        var added = 'addedRecords';
        var deleted = 'deletedRecords';
        if (gObj.editSettings.mode === 'Batch' && gObj.editModule) {
            var currentRecords = iterateExtend(this.parent.getCurrentViewRecords());
            currentRecords = gObj.editSettings.newRowPosition === 'Bottom' ?
                currentRecords.concat(this.parent.editModule.getBatchChanges()[added]) :
                this.parent.editModule.getBatchChanges()[added].concat(currentRecords);
            var deletedRecords = this.parent.editModule.getBatchChanges()[deleted];
            var primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
            for (var i = 0; i < (deletedRecords.length); i++) {
                for (var j = 0; j < currentRecords.length; j++) {
                    if (deletedRecords[i][primaryKey] === currentRecords[j][primaryKey]) {
                        currentRecords.splice(j, 1);
                        break;
                    }
                }
            }
            return currentRecords;
        }
        else {
            return gObj.getCurrentViewRecords();
        }
    };
    /**
     * Selects a row by the given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectRow = function (index, isToggle) {
        if (this.selectedRowIndexes.length && this.selectionSettings.enableSimpleMultiRowSelection) {
            this.addRowsToSelection([index]);
            return;
        }
        var gObj = this.parent;
        var selectedRow = gObj.getRowByIndex(index);
        var selectedMovableRow = this.getSelectedMovableRow(index);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(index);
        var selectData;
        var isRemoved = false;
        if (gObj.enableVirtualization && index > -1) {
            this.parent.notify(selectVirtualRow, { selectedIndex: index });
            var frozenData = gObj.isFrozenGrid() ? gObj.contentModule.getRowObjectByIndex(index)
                : null;
            if (selectedRow && (gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')) || frozenData)) {
                selectData = frozenData ? frozenData : gObj.getRowObjectFromUID(selectedRow.getAttribute('data-uid')).data;
            }
            else {
                var prevSelectedData = this.parent.getSelectedRecords();
                if (prevSelectedData.length > 0) {
                    this.clearRowSelection();
                }
                return;
            }
        }
        else {
            selectData = this.getCurrentBatchRecordChanges()[index];
        }
        if (!this.isRowType() || !selectedRow || this.isEditing()) {
            // if (this.isEditing()) {
            //     gObj.selectedRowIndex = index;
            // }
            return;
        }
        var isRowSelected = selectedRow.hasAttribute('aria-selected');
        this.activeTarget();
        isToggle = !isToggle ? isToggle :
            !this.selectedRowIndexes.length ? false :
                (this.selectedRowIndexes.length === 1 ? (index === this.selectedRowIndexes[0]) : false);
        var args;
        var can = 'cancel';
        if (!isToggle) {
            var isHybrid = 'isHybrid';
            if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, row: selectedRow,
                    previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, target: this.actualTarget, cancel: false, isInteracted: this.isInteracted,
                    isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
                };
                args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                    isShiftPressed: this.isMultiShiftRequest, previousRowIndex: this.prevRowIndex,
                    cancel: false, isInteracted: this.isInteracted, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
                };
            }
            this.parent.trigger(rowSelecting, this.fDataUpdate(args), this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can));
        }
        else {
            this.rowSelectingCallBack(args, isToggle, index, selectData, isRemoved, isRowSelected, can)(args);
        }
    };
    Selection.prototype.rowSelectingCallBack = function (args, isToggle, index, selectData, isRemoved, isRowSelected, can) {
        var _this = this;
        return function (args) {
            if (!sf.base.isNullOrUndefined(args) && args[can] === true) {
                _this.disableInteracted();
                return;
            }
            _this.index = index;
            _this.toggle = isToggle;
            _this.data = selectData;
            _this.removed = isRemoved;
            if (isRowSelected && _this.selectionSettings.persistSelection && !(_this.selectionSettings.checkboxMode === 'ResetOnRowClick')) {
                _this.clearSelectedRow(index);
                _this.selectRowCallBack();
            }
            else if (!isRowSelected && _this.selectionSettings.persistSelection &&
                _this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                _this.selectRowCallBack();
            }
            if (_this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
                _this.clearSelection();
            }
            if (!_this.selectionSettings.persistSelection || _this.selectionSettings.checkboxMode === 'ResetOnRowClick' ||
                (!_this.parent.isCheckBoxSelection && _this.selectionSettings.persistSelection)) {
                _this.selectRowCheck = true;
                _this.clearRow();
            }
        };
    };
    Selection.prototype.selectRowCallBack = function () {
        var gObj = this.parent;
        var args;
        var index = this.index;
        var isToggle = this.toggle;
        var selectData = this.data;
        var isRemoved = this.removed;
        var selectedRow = gObj.getRowByIndex(index);
        var selectedMovableRow = this.getSelectedMovableRow(index);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(index);
        if (!isToggle && !isRemoved) {
            if (this.selectedRowIndexes.indexOf(index) <= -1) {
                this.updateRowSelection(selectedRow, index);
                this.selectMovableRow(selectedMovableRow, selectedFrozenRightRow, index);
            }
            this.selectRowIndex(index);
        }
        if (!isToggle) {
            var isHybrid = 'isHybrid';
            if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    data: selectData, rowIndex: index,
                    row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, target: this.actualTarget, isInteracted: this.isInteracted,
                    isHeaderCheckBoxClicked: this.isHeaderCheckboxClicked
                };
                args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    data: selectData, rowIndex: index,
                    row: selectedRow, previousRow: gObj.getRowByIndex(this.prevRowIndex),
                    previousRowIndex: this.prevRowIndex, isInteracted: this.isInteracted,
                    isHeaderCheckBoxClicked: this.isHeaderCheckboxClicked
                };
            }
            this.onActionComplete(args, rowSelected);
        }
        if (sf.base.isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization) {
            var interopAdaptor = 'interopAdaptor';
            var invokeMethodAsync = 'invokeMethodAsync';
            this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', true, 'normal', [index]);
        }
        this.isInteracted = false;
        this.updateRowProps(index);
    };
    Selection.prototype.selectMovableRow = function (selectedMovableRow, selectedFrozenRightRow, index) {
        if (this.parent.isFrozenGrid()) {
            this.updateRowSelection(selectedMovableRow, index);
            if (this.parent.getFrozenMode() === 'Left-Right' && selectedFrozenRightRow) {
                this.updateRowSelection(selectedFrozenRightRow, index);
            }
        }
    };
    Selection.prototype.addMovableArgs = function (targetObj, mRow, frRow) {
        if (this.parent.isFrozenGrid()) {
            var mObj = { mRow: mRow, previousMovRow: this.parent.getMovableRows()[this.prevRowIndex] };
            var frozenRightRow = 'frozenRightRow';
            var previousFrozenRightRow = 'previousFrozenRightRow';
            if (this.parent.getFrozenMode() === 'Left-Right' && frRow) {
                mObj[frozenRightRow] = frRow;
                mObj[previousFrozenRightRow] = this.parent.getFrozenRightDataRows()[this.prevRowIndex];
            }
            targetObj = __assign({}, targetObj, mObj);
        }
        return targetObj;
    };
    /**
     * Selects a range of rows from start and end row indexes.
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @return {void}
     */
    Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
        this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
        this.selectRowIndex(endIndex);
    };
    /**
     * Selects a collection of rows by index.
     * @param  {number[]} rowIndexes - Specifies an array of row indexes.
     * @return {void}
     */
    Selection.prototype.selectRows = function (rowIndexes) {
        var _this = this;
        var gObj = this.parent;
        var rowIndex = !this.isSingleSel() ? rowIndexes[0] : rowIndexes[rowIndexes.length - 1];
        this.isMultiSelection = true;
        var selectedRows = [];
        var foreignKeyData$$1 = [];
        var selectedMovableRow = this.getSelectedMovableRow(rowIndex);
        var selectedFrozenRightRow = this.getSelectedFrozenRightRow(rowIndex);
        var can = 'cancel';
        var selectedData = [];
        if (!this.isRowType() || this.isEditing()) {
            return;
        }
        for (var i = 0, len = rowIndexes.length; i < len; i++) {
            var currentRow = this.parent.getDataRows()[rowIndexes[i]];
            var rowObj = this.getRowObj(currentRow);
            if (rowObj) {
                selectedData.push(rowObj.data);
                selectedRows.push(currentRow);
                foreignKeyData$$1.push(rowObj.foreignKeyData);
            }
        }
        var isHybrid = 'isHybrid';
        this.activeTarget();
        var args;
        if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            args = {
                cancel: false,
                rowIndexes: rowIndexes, row: selectedRows, rowIndex: rowIndex, target: this.actualTarget,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                isInteracted: this.isInteracted, isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                data: selectedData, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData$$1
            };
            args = this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
        }
        else {
            args = {
                cancel: false,
                rowIndexes: rowIndexes, rowIndex: rowIndex, previousRowIndex: this.prevRowIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                data: selectedData, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData$$1
            };
        }
        this.parent.trigger(rowSelecting, this.fDataUpdate(args), function (args) {
            if (!sf.base.isNullOrUndefined(args) && args[can] === true) {
                _this.disableInteracted();
                return;
            }
            _this.clearRow();
            _this.selectRowIndex(rowIndexes.slice(-1)[0]);
            var selectRowFn = function (index) {
                _this.updateRowSelection(gObj.getRowByIndex(index), index);
                if (gObj.isFrozenGrid()) {
                    var rightEle = _this.parent.getFrozenMode() === 'Left-Right' ? gObj.getFrozenRightRowByIndex(index)
                        : undefined;
                    _this.selectMovableRow(gObj.getMovableRowByIndex(index), rightEle, index);
                }
                _this.updateRowProps(rowIndex);
            };
            if (!_this.isSingleSel()) {
                for (var _i = 0, rowIndexes_1 = rowIndexes; _i < rowIndexes_1.length; _i++) {
                    var rowIdx = rowIndexes_1[_i];
                    selectRowFn(rowIdx);
                }
            }
            else {
                selectRowFn(rowIndex);
            }
            var isHybrid = 'isHybrid';
            if (!sf.base.isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                args = {
                    rowIndexes: rowIndexes, row: selectedRows, rowIndex: rowIndex, target: _this.actualTarget,
                    prevRow: gObj.getRows()[_this.prevRowIndex], previousRowIndex: _this.prevRowIndex,
                    data: sf.base.isBlazor() ? selectedData : _this.getSelectedRecords(), isInteracted: _this.isInteracted,
                    isHeaderCheckboxClicked: _this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData$$1
                };
                args = _this.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
            }
            else {
                args = {
                    rowIndexes: rowIndexes, rowIndex: rowIndex, previousRowIndex: _this.prevRowIndex,
                    row: selectedRows, prevRow: gObj.getRows()[_this.prevRowIndex],
                    data: sf.base.isBlazor() ? selectedData : _this.getSelectedRecords(), isInteracted: _this.isInteracted,
                    isHeaderCheckboxClicked: _this.isHeaderCheckboxClicked, foreignKeyData: foreignKeyData$$1
                };
            }
            if (_this.isRowSelected) {
                _this.onActionComplete(args, rowSelected);
            }
        });
    };
    /**
     * Select rows with existing row selection by passing row indexes.
     * @param  {number} startIndex - Specifies the row indexes.
     * @return {void}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.addRowsToSelection = function (rowIndexes) {
        var _this = this;
        var gObj = this.parent;
        var can = 'cancel';
        var target = this.target;
        this.isMultiSelection = true;
        var indexes = gObj.getSelectedRowIndexes().concat(rowIndexes);
        var selectedRow = !this.isSingleSel() ? gObj.getRowByIndex(rowIndexes[0]) :
            gObj.getRowByIndex(rowIndexes[rowIndexes.length - 1]);
        var selectedMovableRow = !this.isSingleSel() ? this.getSelectedMovableRow(rowIndexes[0]) :
            this.getSelectedMovableRow(rowIndexes[rowIndexes.length - 1]);
        var selectedFrozenRightRow = !this.isSingleSel() ? this.getSelectedFrozenRightRow(rowIndexes[0]) :
            this.getSelectedFrozenRightRow(rowIndexes[rowIndexes.length - 1]);
        if ((!this.isRowType() || this.isEditing()) && !this.selectionSettings.checkboxOnly) {
            return;
        }
        var args;
        var checkboxColumn = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        var _loop_1 = function (rowIndex) {
            var rowObj = this_1.getRowObj(rowIndex);
            var isUnSelected = this_1.selectedRowIndexes.indexOf(rowIndex) > -1;
            this_1.selectRowIndex(rowIndex);
            if (isUnSelected && ((checkboxColumn.length ? true : this_1.selectionSettings.enableToggle) || this_1.isMultiCtrlRequest)) {
                this_1.isAddRowsToSelection = true;
                this_1.rowDeselect(rowDeselecting, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target);
                if (this_1.isCancelDeSelect) {
                    return { value: void 0 };
                }
                this_1.selectedRowIndexes.splice(this_1.selectedRowIndexes.indexOf(rowIndex), 1);
                this_1.selectedRecords.splice(this_1.selectedRecords.indexOf(selectedRow), 1);
                selectedRow.removeAttribute('aria-selected');
                this_1.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
                if (selectedMovableRow) {
                    this_1.selectedRecords.splice(this_1.selectedRecords.indexOf(selectedMovableRow), 1);
                    selectedMovableRow.removeAttribute('aria-selected');
                    this_1.addRemoveClassesForRow(selectedMovableRow, false, null, 'e-selectionbackground', 'e-active');
                }
                this_1.rowDeselect(rowDeselected, [rowIndex], [rowObj.data], [selectedRow], [rowObj.foreignKeyData], target, [selectedMovableRow]);
                this_1.isInteracted = false;
                this_1.isMultiSelection = false;
                this_1.isAddRowsToSelection = false;
            }
            else {
                var isHybrid = 'isHybrid';
                this_1.activeTarget();
                if (!sf.base.isBlazor() || this_1.parent.isJsComponent || this_1.parent[isHybrid]) {
                    args = {
                        cancel: false,
                        data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this_1.actualTarget,
                        prevRow: gObj.getRows()[this_1.prevRowIndex], previousRowIndex: this_1.prevRowIndex,
                        isCtrlPressed: this_1.isMultiCtrlRequest, isShiftPressed: this_1.isMultiShiftRequest,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                    args = this_1.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
                }
                else {
                    args = {
                        cancel: false,
                        data: rowObj.data, rowIndex: rowIndex, previousRowIndex: this_1.prevRowIndex,
                        isCtrlPressed: this_1.isMultiCtrlRequest, isShiftPressed: this_1.isMultiShiftRequest,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                }
                this_1.parent.trigger(rowSelecting, this_1.fDataUpdate(args), function (args) {
                    if (!sf.base.isNullOrUndefined(args) && args[can] === true) {
                        _this.disableInteracted();
                        return;
                    }
                    if (_this.isSingleSel()) {
                        _this.clearRow();
                    }
                    _this.updateRowSelection(selectedRow, rowIndex);
                    _this.selectMovableRow(selectedMovableRow, selectedFrozenRightRow, rowIndex);
                });
            }
            if (!isUnSelected) {
                var isHybrid = 'isHybrid';
                if (!sf.base.isBlazor() || this_1.parent.isJsComponent || this_1.parent[isHybrid]) {
                    args = {
                        data: rowObj.data, rowIndex: rowIndex, row: selectedRow, target: this_1.actualTarget,
                        prevRow: gObj.getRows()[this_1.prevRowIndex], previousRowIndex: this_1.prevRowIndex,
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                    args = this_1.addMovableArgs(args, selectedMovableRow, selectedFrozenRightRow);
                }
                else {
                    args = {
                        data: rowObj.data, rowIndex: rowIndex, previousRowIndex: this_1.prevRowIndex,
                        row: selectedRow, prevRow: gObj.getRows()[this_1.prevRowIndex],
                        foreignKeyData: rowObj.foreignKeyData, isInteracted: this_1.isInteracted,
                        isHeaderCheckboxClicked: this_1.isHeaderCheckboxClicked, rowIndexes: indexes
                    };
                }
                this_1.onActionComplete(args, rowSelected);
            }
            this_1.isInteracted = false;
            this_1.updateRowProps(rowIndex);
            if (this_1.isSingleSel()) {
                return "break";
            }
        };
        var this_1 = this;
        for (var _i = 0, rowIndexes_2 = rowIndexes; _i < rowIndexes_2.length; _i++) {
            var rowIndex = rowIndexes_2[_i];
            var state_1 = _loop_1(rowIndex);
            if (typeof state_1 === "object")
                return state_1.value;
            if (state_1 === "break")
                break;
        }
    };
    Selection.prototype.getCollectionFromIndexes = function (startIndex, endIndex) {
        var indexes = [];
        var _a = (startIndex <= endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    };
    Selection.prototype.clearRow = function () {
        this.clearRowCheck = true;
        this.clearRowSelection();
    };
    Selection.prototype.clearRowCallBack = function () {
        if (this.isCancelDeSelect && this.parent.checkAllRows !== 'Check') {
            return;
        }
        this.selectedRowIndexes = [];
        this.selectedRecords = [];
        this.selectRowIndex(-1);
        if (this.isSingleSel() && this.parent.isPersistSelection) {
            this.selectedRowState = {};
        }
    };
    Selection.prototype.clearSelectedRow = function (index) {
        if (this.toggle) {
            var selectedEle = this.parent.getRowByIndex(index);
            if (!this.disableUI) {
                selectedEle.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedEle, false, true, 'e-selectionbackground', 'e-active');
            }
            this.removed = true;
            this.updatePersistCollection(selectedEle, false);
            this.updateCheckBoxes(selectedEle);
            this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(index), 1);
            this.selectedRecords.splice(this.selectedRecords.indexOf(this.parent.getRowByIndex(index)), 1);
        }
    };
    Selection.prototype.updateRowProps = function (startIndex) {
        this.prevRowIndex = startIndex;
        this.isRowSelected = this.selectedRowIndexes.length && true;
    };
    Selection.prototype.updatePersistCollection = function (selectedRow, chkState) {
        var _this = this;
        if ((this.parent.isPersistSelection || this.parent.selectionSettings.persistSelection &&
            this.parent.getPrimaryKeyFieldNames().length > 0) && !sf.base.isNullOrUndefined(selectedRow)) {
            if (!this.parent.isPersistSelection) {
                this.ensureCheckboxFieldSelection();
            }
            var rowObj = this.getRowObj(selectedRow);
            var pKey_1 = rowObj.data ? rowObj.data[this.primaryKey] : null;
            if (pKey_1 === null) {
                return;
            }
            rowObj.isSelected = chkState;
            if (chkState) {
                this.selectedRowState[pKey_1] = chkState;
                if (!this.persistSelectedData.some(function (data) { return data[_this.primaryKey] === pKey_1; })) {
                    this.persistSelectedData.push(rowObj.data);
                }
            }
            else {
                this.updatePersistDelete(pKey_1);
            }
        }
    };
    Selection.prototype.updatePersistDelete = function (pKey) {
        var _this = this;
        delete (this.selectedRowState[pKey]);
        var index;
        var isPresent = this.persistSelectedData.some(function (data, i) {
            index = i;
            return data[_this.primaryKey] === pKey;
        });
        if (isPresent) {
            this.persistSelectedData.splice(index, 1);
        }
    };
    Selection.prototype.updateCheckBoxes = function (row, chkState, rowIndex) {
        if (!sf.base.isNullOrUndefined(row)) {
            var chkBox = row.querySelector('.e-checkselect');
            if (!sf.base.isNullOrUndefined(chkBox)) {
                removeAddCboxClasses(chkBox.nextElementSibling, chkState);
                setChecked(chkBox, chkState);
                if (sf.base.isNullOrUndefined(this.checkedTarget) || (!sf.base.isNullOrUndefined(this.checkedTarget)
                    && !this.checkedTarget.classList.contains('e-checkselectall'))) {
                    this.setCheckAllState(rowIndex);
                }
            }
        }
    };
    Selection.prototype.updateRowSelection = function (selectedRow, startIndex) {
        if (!selectedRow) {
            return;
        }
        this.selectedRowIndexes.push(startIndex);
        var len = this.selectedRowIndexes.length;
        if (this.parent.isFrozenGrid() && len > 1) {
            if ((this.selectedRowIndexes[len - 2] === this.selectedRowIndexes[len - 1])) {
                this.selectedRowIndexes.pop();
            }
        }
        this.selectedRecords.push(selectedRow);
        selectedRow.setAttribute('aria-selected', 'true');
        this.updatePersistCollection(selectedRow, true);
        this.updateCheckBoxes(selectedRow, true);
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
        if (!this.preventFocus) {
            var target = this.focus.getPrevIndexes().cellIndex ?
                selectedRow.cells[this.focus.getPrevIndexes().cellIndex] :
                selectedRow.querySelector('.e-selectionbackground:not(.e-hide):not(.e-detailrowcollapse):not(.e-detailrowexpand)');
            if (this.parent.contextMenuModule && this.mouseButton === 2) {
                target = this.parent.contextMenuModule.cell;
            }
            if (!target) {
                return;
            }
            this.focus.onClick({ target: target }, true);
        }
    };
    /**
     * Deselects the currently selected rows and cells.
     * @return {void}
     */
    Selection.prototype.clearSelection = function () {
        if (!this.parent.isPersistSelection || (this.parent.isPersistSelection && !this.parent.isEdit) ||
            (!sf.base.isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
            var span = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            if (this.parent.isPersistSelection) {
                this.persistSelectedData = [];
                this.selectedRowState = {};
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.clearColumnSelection();
            this.prevRowIndex = undefined;
            this.enableSelectMultiTouch = false;
            this.isInteracted = false;
        }
    };
    /**
     * Deselects the currently selected rows.
     * @return {void}
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.clearRowSelection = function () {
        var _this = this;
        if (this.isRowSelected) {
            var gObj = this.parent;
            var rows_1 = this.parent.getDataRows();
            var data_1 = [];
            var row_1 = [];
            var mRow_1 = [];
            var fRightRow_1 = [];
            var rowIndex_1 = [];
            var foreignKeyData_1 = [];
            var target_1 = this.target;
            var currentViewData = this.parent.getCurrentViewRecords();
            for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                var currentRow = this.parent.editSettings.mode === 'Batch' ?
                    this.parent.getRows()[this.selectedRowIndexes[i]]
                    : this.parent.getDataRows()[this.selectedRowIndexes[i]];
                var rowObj = this.getRowObj(currentRow);
                if (rowObj) {
                    data_1.push(rowObj.data);
                    row_1.push(currentRow);
                    rowIndex_1.push(this.selectedRowIndexes[i]);
                    foreignKeyData_1.push(rowObj.foreignKeyData);
                }
                if (gObj.isFrozenGrid()) {
                    mRow_1.push(gObj.getMovableRows()[this.selectedRowIndexes[i]]);
                    if (gObj.getFrozenMode() === 'Left-Right') {
                        fRightRow_1.push(gObj.getFrozenRightRows()[this.selectedRowIndexes[i]]);
                    }
                }
            }
            if (this.selectionSettings.persistSelection && this.selectionSettings.checkboxMode !== 'ResetOnRowClick') {
                this.isInteracted = this.checkSelectAllClicked ? true : false;
            }
            this.rowDeselect(rowDeselecting, rowIndex_1, data_1, row_1, foreignKeyData_1, target_1, mRow_1, function () {
                if (_this.isCancelDeSelect && (_this.isInteracted || _this.checkSelectAllClicked)) {
                    if (_this.parent.isPersistSelection) {
                        if (_this.getCheckAllStatus(_this.parent.element.querySelector('.e-checkselectall')) === 'Intermediate') {
                            for (var i = 0; i < _this.selectedRecords.length; i++) {
                                _this.updatePersistCollection(_this.selectedRecords[i], true);
                            }
                        }
                        else {
                            _this.parent.checkAllRows = 'Check';
                            _this.updatePersistSelectedData(true);
                        }
                    }
                    if (_this.clearRowCheck) {
                        _this.clearRowCallBack();
                        _this.clearRowCheck = false;
                        if (_this.selectRowCheck) {
                            _this.selectRowCallBack();
                            _this.selectRowCheck = false;
                        }
                    }
                    return;
                }
                var element = [].slice.call(rows_1.filter(function (record) { return record.hasAttribute('aria-selected'); }));
                for (var j = 0; j < element.length; j++) {
                    if (!_this.disableUI || sf.base.isBlazor()) {
                        element[j].removeAttribute('aria-selected');
                        _this.addRemoveClassesForRow(element[j], false, true, 'e-selectionbackground', 'e-active');
                    }
                    // tslint:disable-next-line:align
                    _this.updatePersistCollection(element[j], false);
                    _this.updateCheckBoxes(element[j]);
                }
                if (sf.base.isBlazor() && _this.parent.isServerRendered && _this.parent.enableVirtualization) {
                    _this.getRenderer().setSelection(null, false, true);
                }
                for (var i = 0, len = _this.selectedRowIndexes.length; i < len; i++) {
                    var movableRow = _this.getSelectedMovableRow(_this.selectedRowIndexes[i]);
                    if (movableRow) {
                        if (!_this.disableUI || sf.base.isBlazor()) {
                            movableRow.removeAttribute('aria-selected');
                            _this.addRemoveClassesForRow(movableRow, false, true, 'e-selectionbackground', 'e-active');
                        }
                        _this.updateCheckBoxes(movableRow);
                        _this.updatePersistCollection(movableRow, false);
                    }
                    var frRow = _this.getSelectedFrozenRightRow(_this.selectedRowIndexes[i]);
                    if (frRow) {
                        if (!_this.disableUI) {
                            frRow.removeAttribute('aria-selected');
                            _this.addRemoveClassesForRow(frRow, false, true, 'e-selectionbackground', 'e-active');
                        }
                        _this.updateCheckBoxes(frRow);
                        _this.updatePersistCollection(frRow, false);
                    }
                }
                _this.selectedRowIndexes = [];
                _this.selectedRecords = [];
                _this.isRowSelected = false;
                _this.selectRowIndex(-1);
                _this.rowDeselect(rowDeselected, rowIndex_1, data_1, row_1, foreignKeyData_1, target_1, mRow_1, undefined, fRightRow_1);
                if (_this.clearRowCheck) {
                    _this.clearRowCallBack();
                    _this.clearRowCheck = false;
                    if (_this.selectRowCheck) {
                        _this.selectRowCallBack();
                        _this.selectRowCheck = false;
                    }
                }
            }, fRightRow_1);
        }
        else {
            if (this.clearRowCheck) {
                this.clearRowCallBack();
                this.clearRowCheck = false;
                if (this.selectRowCheck) {
                    this.selectRowCallBack();
                    this.selectRowCheck = false;
                }
            }
        }
    };
    Selection.prototype.rowDeselect = function (type, rowIndex, data, row, foreignKeyData$$1, target, mRow, rowDeselectCallBack, frozenRightRow) {
        var _this = this;
        if ((this.selectionSettings.persistSelection && this.isInteracted) || !this.selectionSettings.persistSelection) {
            var cancl_1 = 'cancel';
            var rowDeselectObj = {
                rowIndex: rowIndex[0], data: this.selectionSettings.persistSelection && this.parent.checkAllRows === 'Uncheck'
                    && this.selectionSettings.checkboxMode !== 'ResetOnRowClick' ?
                    this.persistSelectedData : data, foreignKeyData: foreignKeyData$$1,
                cancel: false, isInteracted: this.isInteracted, isHeaderCheckboxClicked: this.isHeaderCheckboxClicked
            };
            if (type === 'rowDeselected') {
                delete rowDeselectObj.cancel;
            }
            var isHybrid = 'isHybrid';
            if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                var rowInString = 'row';
                var target_2 = 'target';
                var rowidx = 'rowIndex';
                var rowidxex = 'rowIndexes';
                var data_2 = 'data';
                var foreignKey = 'foreignKeyData';
                rowDeselectObj[rowInString] = row;
                rowDeselectObj[target_2] = this.actualTarget;
                var isHeaderCheckBxClick = this.actualTarget && !sf.base.isNullOrUndefined(sf.base.closest(this.actualTarget, 'thead'));
                if (isHeaderCheckBxClick || rowIndex.length > 1) {
                    rowDeselectObj[rowidx] = rowIndex[0];
                    rowDeselectObj[rowidxex] = rowIndex;
                }
                else if (rowIndex.length === 1) {
                    rowDeselectObj[data_2] = rowDeselectObj[data_2][0];
                    rowDeselectObj[rowInString] = rowDeselectObj[rowInString][0];
                    rowDeselectObj[foreignKey] = rowDeselectObj[foreignKey][0];
                    if (this.isAddRowsToSelection) {
                        rowDeselectObj[rowidxex] = rowIndex;
                    }
                }
            }
            else {
                var rowIndex_2 = 'rowIndex';
                var data_3 = 'data';
                rowDeselectObj[rowIndex_2] = rowDeselectObj[rowIndex_2][rowDeselectObj[rowIndex_2].length - 1];
                rowDeselectObj[data_3] = rowDeselectObj[data_3][rowDeselectObj[data_3].length - 1];
            }
            this.parent.trigger(type, (!sf.base.isBlazor() || this.parent.isJsComponent) && this.parent.isFrozenGrid() ? __assign({}, rowDeselectObj, { mRow: mRow, frozenRightRow: frozenRightRow }) : rowDeselectObj, function (args) {
                _this.isCancelDeSelect = args[cancl_1];
                if (!_this.isCancelDeSelect || (!_this.isInteracted && !_this.checkSelectAllClicked)) {
                    _this.updatePersistCollection(row[0], false);
                    _this.updateCheckBoxes(row[0], undefined, rowIndex[0]);
                }
                if (rowDeselectCallBack !== undefined) {
                    rowDeselectCallBack();
                }
            });
        }
        else if (this.selectionSettings.persistSelection && !this.isInteracted) {
            if (rowDeselectCallBack !== undefined) {
                rowDeselectCallBack();
            }
        }
    };
    Selection.prototype.getRowObj = function (row) {
        if (row === void 0) { row = this.currentIndex; }
        if (sf.base.isNullOrUndefined(row)) {
            return {};
        }
        if (typeof row === 'number') {
            row = this.parent.getRowByIndex(row);
        }
        if (row) {
            return this.parent.getRowObjectFromUID(row.getAttribute('data-uid')) || {};
        }
        return {};
    };
    Selection.prototype.getSelectedMovableCell = function (cellIndex) {
        var gObj = this.parent;
        var col = gObj.getColumnByIndex(cellIndex.cellIndex);
        var frzCols = gObj.isFrozenGrid();
        if (frzCols) {
            if (col.getFreezeTableName() === 'movable') {
                return gObj.getMovableCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
            }
            return null;
        }
        return null;
    };
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectCell = function (cellIndex, isToggle) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(cellIndex);
        var args;
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
        }
        this.currentIndex = cellIndex.rowIndex;
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        var isCellSelected = selectedCell.classList.contains('e-cellselectionbackground');
        isToggle = !isToggle ? isToggle : (!sf.base.isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);
        if (!isToggle) {
            args = {
                data: selectedData, cellIndex: cellIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
                previousRowCell: this.prevECIdxs ?
                    this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
                cancel: false
            };
            if (!sf.base.isBlazor() || this.parent.isJsComponent) {
                var currentCell = 'currentCell';
                args[currentCell] = selectedCell;
                var previousRowCellIndex = 'previousRowCellIndex';
                args[previousRowCellIndex] = this.prevECIdxs;
            }
            this.parent.trigger(cellSelecting, this.fDataUpdate(args), this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData));
            this.cellselected = true;
        }
        else {
            this.successCallBack(args, isToggle, cellIndex, selectedCell, selectedData)(args);
        }
    };
    Selection.prototype.successCallBack = function (cellSelectingArgs, isToggle, cellIndex, selectedCell, selectedData) {
        var _this = this;
        return function (cellSelectingArgs) {
            var cncl = 'cancel';
            var currentCell = 'currentCell';
            if (!sf.base.isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[cncl] === true) {
                return;
            }
            if (!isToggle) {
                cellSelectingArgs[currentCell] = cellSelectingArgs[currentCell] ? cellSelectingArgs[currentCell] : selectedCell;
            }
            _this.clearCell();
            if (!isToggle) {
                _this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isToggle) {
                var args = void 0;
                var isHybrid = 'isHybrid';
                if (!sf.base.isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                    args = {
                        data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                        selectedRowCellIndex: _this.selectedRowCellIndexes,
                        previousRowCell: _this.prevECIdxs ?
                            _this.getCellIndex(_this.prevECIdxs.rowIndex, _this.prevECIdxs.cellIndex) : undefined
                    };
                    var previousRowCellIndex = 'previousRowCellIndex';
                    args[previousRowCellIndex] = _this.prevECIdxs;
                }
                else {
                    args = { data: selectedData, cellIndex: cellIndex, selectedRowCellIndex: _this.selectedRowCellIndexes };
                }
                _this.updateCellProps(cellIndex, cellIndex);
                _this.onActionComplete(args, cellSelected);
            }
        };
    };
    Selection.prototype.getCellIndex = function (rIdx, cIdx) {
        return (this.parent.getFrozenColumns() ? (cIdx >= this.parent.getFrozenColumns() ? this.parent.getMovableCellFromIndex(rIdx, cIdx)
            : this.parent.getCellFromIndex(rIdx, cIdx)) : this.parent.getCellFromIndex(rIdx, cIdx));
    };
    /**
     * Selects a range of cells from start and end indexes.
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     * @return {void}
     */
    Selection.prototype.selectCellsByRange = function (startIndex, endIndex) {
        var _this = this;
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(startIndex);
        var frzCols = gObj.getFrozenColumns();
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
        }
        var min;
        var max;
        var stIndex = startIndex;
        var edIndex = endIndex = endIndex ? endIndex : startIndex;
        var cellIndexes;
        this.currentIndex = startIndex.rowIndex;
        var cncl = 'cancel';
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        var args = {
            data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        };
        if (!sf.base.isBlazor()) {
            var previousRowCellIndex = 'previousRowCellIndex';
            args[previousRowCellIndex] = this.prevECIdxs;
        }
        this.parent.trigger(cellSelecting, this.fDataUpdate(args), function (cellSelectingArgs) {
            if (!sf.base.isNullOrUndefined(cellSelectingArgs) && cellSelectingArgs[cncl] === true) {
                return;
            }
            _this.clearCell();
            if (startIndex.rowIndex > endIndex.rowIndex) {
                var temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (var i = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
                if (_this.selectionSettings.cellSelectionMode.indexOf('Box') < 0) {
                    min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                    max = i === endIndex.rowIndex ? (endIndex.cellIndex) : _this.getLastColIndex(i);
                }
                else {
                    min = startIndex.cellIndex;
                    max = endIndex.cellIndex;
                }
                cellIndexes = [];
                for (var j = min < max ? min : max, len = min > max ? min : max; j <= len; j++) {
                    if (frzCols) {
                        if (j < frzCols) {
                            selectedCell = gObj.getCellFromIndex(i, j);
                        }
                        else {
                            selectedCell = gObj.getMovableCellFromIndex(i, j);
                        }
                    }
                    else {
                        selectedCell = gObj.getCellFromIndex(i, j);
                    }
                    if (!selectedCell) {
                        continue;
                    }
                    cellIndexes.push(j);
                    _this.updateCellSelection(selectedCell);
                    _this.addAttribute(selectedCell);
                }
                _this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
            }
            var cellSelectedArgs;
            var isHybrid = 'isHybrid';
            if (!sf.base.isBlazor() || _this.parent.isJsComponent || _this.parent[isHybrid]) {
                cellSelectedArgs = {
                    data: selectedData, cellIndex: edIndex, currentCell: gObj.getCellFromIndex(edIndex.rowIndex, edIndex.cellIndex),
                    selectedRowCellIndex: _this.selectedRowCellIndexes,
                    previousRowCell: _this.prevECIdxs ? _this.getCellIndex(_this.prevECIdxs.rowIndex, _this.prevECIdxs.cellIndex) : undefined
                };
                var previousRowCellIndex = 'previousRowCellIndex';
                cellSelectedArgs[previousRowCellIndex] = _this.prevECIdxs;
            }
            else {
                cellSelectedArgs = { data: selectedData, cellIndex: edIndex, selectedRowCellIndex: _this.selectedRowCellIndexes };
            }
            if (!_this.isDragged) {
                _this.onActionComplete(cellSelectedArgs, cellSelected);
                _this.cellselected = true;
            }
            _this.updateCellProps(stIndex, edIndex);
        });
    };
    /**
     * Selects a collection of cells by row and column indexes.
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    Selection.prototype.selectCells = function (rowCellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = this.getSelectedMovableCell(rowCellIndexes[0]);
        var frzCols = gObj.getFrozenColumns();
        if (!selectedCell) {
            selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
        }
        this.currentIndex = rowCellIndexes[0].rowIndex;
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        var cellSelectArgs;
        var isHybrid = 'isHybrid';
        if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            cellSelectArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest,
                previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            var previousRowCellIndex = 'previousRowCellIndex';
            cellSelectArgs[previousRowCellIndex] = this.prevECIdxs;
        }
        else {
            cellSelectArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
        }
        this.onActionBegin(cellSelectArgs, cellSelecting);
        for (var i = 0, len = rowCellIndexes.length; i < len; i++) {
            for (var j = 0, cellLen = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                if (frzCols) {
                    if (rowCellIndexes[i].cellIndexes[j] < frzCols) {
                        selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    }
                    else {
                        selectedCell = gObj.getMovableCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    }
                }
                else {
                    selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                }
                if (!selectedCell) {
                    continue;
                }
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
                this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
            }
        }
        this.updateCellProps({ rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] }, { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
        var cellSelectedArgs;
        if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
            cellSelectedArgs = {
                data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            var previousRowCellIndex = 'previousRowCellIndex';
            cellSelectedArgs[previousRowCellIndex] = this.prevECIdxs;
        }
        else {
            cellSelectedArgs = { data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
                selectedRowCellIndex: this.selectedRowCellIndexes };
        }
        this.onActionComplete(cellSelectedArgs, cellSelected);
    };
    /**
     * Select cells with existing cell selection by passing row and column index.
     * @param  {IIndex} startIndex - Defines the collection of row and column index.
     * @return {void}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    Selection.prototype.addCellsToSelection = function (cellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell;
        var index;
        this.currentIndex = cellIndexes[0].rowIndex;
        var cncl = 'cancel';
        var selectedData = this.getCurrentBatchRecordChanges()[this.currentIndex];
        var isHybrid = 'isHybrid';
        var left = gObj.getFrozenLeftCount();
        var movable = gObj.getMovableColumnsCount();
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.hideAutoFill();
        var col = gObj.getColumnByIndex(cellIndexes[0].cellIndex);
        var rowObj;
        gridActionHandler(this.parent, function (tableName, rows) {
            rowObj = rows[cellIndexes[0].rowIndex];
        }, [
            !col.getFreezeTableName() || col.getFreezeTableName() === 'frozen-left' ? gObj.getRowsObject() : [],
            col.getFreezeTableName() === 'movable' ? gObj.getMovableRowsObject() : [],
            col.getFreezeTableName() === 'frozen-right' ? gObj.getFrozenRightRowsObject() : []
        ]);
        var foreignKeyData$$1 = [];
        for (var _i = 0, cellIndexes_1 = cellIndexes; _i < cellIndexes_1.length; _i++) {
            var cellIndex = cellIndexes_1[_i];
            for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                    index = i;
                    break;
                }
            }
            selectedCell = this.getSelectedMovableCell(cellIndex);
            if (!selectedCell) {
                selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
            }
            var idx = col.getFreezeTableName() === 'movable' ? cellIndex.cellIndex - left
                : col.getFreezeTableName() === 'frozen-right' ? cellIndex.cellIndex - (left + movable) : cellIndex.cellIndex;
            foreignKeyData$$1.push(rowObj.cells[idx].foreignKeyData);
            var args = void 0;
            if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                args = {
                    cancel: false, data: selectedData, cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest,
                    currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined,
                };
                var previousRowCellIndex = 'previousRowCellIndex';
                args[previousRowCellIndex] = this.prevECIdxs;
            }
            else {
                args = {
                    cancel: false, data: selectedData, cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest, isCtrlPressed: this.isMultiCtrlRequest
                };
            }
            var isUnSelected = index > -1;
            if (isUnSelected) {
                var selectedCellIdx = this.selectedRowCellIndexes[index].cellIndexes;
                if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                    this.cellDeselect(cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell], foreignKeyData$$1);
                    selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                    if (selectedCellIdx.length === 0) {
                        this.selectedRowCellIndexes.splice(index, 1);
                    }
                    selectedCell.classList.remove('e-cellselectionbackground');
                    selectedCell.removeAttribute('aria-selected');
                    this.cellDeselect(cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell], foreignKeyData$$1);
                }
                else {
                    isUnSelected = false;
                    this.onActionBegin(args, cellSelecting);
                    this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
            }
            else {
                this.onActionBegin(args, cellSelecting);
                if (!sf.base.isNullOrUndefined(args) && args[cncl] === true) {
                    return;
                }
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            if (!isUnSelected) {
                var cellSelectedArgs = void 0;
                if (!sf.base.isBlazor() || this.parent.isJsComponent || this.parent[isHybrid]) {
                    cellSelectedArgs = {
                        data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
                        previousRowCell: this.prevECIdxs ? this.getCellIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                            undefined, selectedRowCellIndex: this.selectedRowCellIndexes
                    };
                    var previousRowCellIndex = 'previousRowCellIndex';
                    cellSelectedArgs[previousRowCellIndex] = this.prevECIdxs;
                }
                else {
                    cellSelectedArgs = { data: selectedData, cellIndex: cellIndexes[0], selectedRowCellIndex: this.selectedRowCellIndexes };
                }
                this.onActionComplete(cellSelectedArgs, cellSelected);
                this.cellselected = true;
            }
            this.updateCellProps(cellIndex, cellIndex);
        }
    };
    Selection.prototype.getColIndex = function (rowIndex, index) {
        var frzCols = this.parent.isFrozenGrid();
        var col = this.parent.getColumnByIndex(index);
        var cells = getCellsByTableName(this.parent, col, rowIndex);
        if (cells) {
            for (var m = 0; m < cells.length; m++) {
                var colIndex = parseInt(cells[m].getAttribute('aria-colindex'), 10);
                if (colIndex === index) {
                    if (frzCols) {
                        if (col.getFreezeTableName() === 'movable') {
                            m += this.parent.getFrozenLeftCount();
                        }
                        else if (col.getFreezeTableName() === 'frozen-right') {
                            m += (this.parent.getFrozenLeftColumnsCount() + this.parent.getMovableColumnsCount());
                        }
                    }
                    return m;
                }
            }
        }
        return -1;
    };
    Selection.prototype.getLastColIndex = function (rowIndex) {
        var cells = this.parent.getFrozenColumns() ? this.parent.getMovableDataRows()[rowIndex].querySelectorAll('td.e-rowcell')
            : this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        return parseInt(cells[cells.length - 1].getAttribute('aria-colindex'), 10);
    };
    Selection.prototype.clearCell = function () {
        this.clearCellSelection();
    };
    Selection.prototype.cellDeselect = function (type, cellIndexes, data, cells, foreignKeyData$$1) {
        var cancl = 'cancel';
        if (cells[0] && cells[0].classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(sf.base.closest(cells[0], 'tr'));
        }
        var args = {
            cells: cells, data: data, cellIndexes: cellIndexes, foreignKeyData: foreignKeyData$$1, cancel: false
        };
        this.parent.trigger(type, args);
        this.isPreventCellSelect = args[cancl];
    };
    Selection.prototype.updateCellSelection = function (selectedCell, rowIndex, cellIndex) {
        if (!sf.base.isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        if (selectedCell.classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(sf.base.closest(selectedCell, 'tr'), true);
        }
        this.addAttribute(selectedCell);
    };
    Selection.prototype.addAttribute = function (cell) {
        this.target = cell;
        if (!sf.base.isNullOrUndefined(cell)) {
            cell.setAttribute('aria-selected', 'true');
            if (!this.preventFocus) {
                this.focus.onClick({ target: cell }, true);
            }
        }
    };
    Selection.prototype.updateCellProps = function (startIndex, endIndex) {
        this.prevCIdxs = startIndex;
        this.prevECIdxs = endIndex;
        this.isCellSelected = this.selectedRowCellIndexes.length && true;
    };
    Selection.prototype.addRowCellIndex = function (rowCellIndex) {
        var isRowAvail;
        var index;
        for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
            if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                isRowAvail = true;
                index = i;
                break;
            }
        }
        if (isRowAvail) {
            if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
            }
        }
        else {
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
        }
    };
    /**
     * Deselects the currently selected cells.
     * @return {void}
     */
    Selection.prototype.clearCellSelection = function () {
        if (this.isCellSelected) {
            var gObj = this.parent;
            var selectedCells = this.getSelectedCellsElement();
            var rowCell = this.selectedRowCellIndexes;
            var data = [];
            var cells = [];
            var foreignKeyData$$1 = [];
            var currentViewData = this.getCurrentBatchRecordChanges();
            var frzCols = gObj.isFrozenGrid();
            this.hideAutoFill();
            for (var i = 0, len = rowCell.length; i < len; i++) {
                data.push(currentViewData[rowCell[i].rowIndex]);
                var rowObj = this.getRowObj(rowCell[i].rowIndex);
                for (var j = 0, cLen = rowCell[i].cellIndexes.length; j < cLen; j++) {
                    if (frzCols) {
                        var col = gObj.getColumnByIndex(rowCell[i].cellIndexes[j]);
                        cells.push(getCellByColAndRowIndex(this.parent, col, rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                    else {
                        if (rowObj.cells) {
                            foreignKeyData$$1.push(rowObj.cells[rowCell[i].cellIndexes[j]].foreignKeyData);
                        }
                        cells.push(gObj.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                }
            }
            this.cellDeselect(cellDeselecting, rowCell, data, cells, foreignKeyData$$1);
            if (this.isPreventCellSelect === true) {
                return;
            }
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                selectedCells[i].classList.remove('e-cellselectionbackground');
                selectedCells[i].removeAttribute('aria-selected');
            }
            if (this.bdrElement) {
                this.showHideBorders('none');
            }
            this.selectedRowCellIndexes = [];
            this.isCellSelected = false;
            if (!this.isDragged && this.cellselected) {
                this.cellDeselect(cellDeselected, rowCell, data, cells, foreignKeyData$$1);
            }
        }
    };
    Selection.prototype.getSelectedCellsElement = function () {
        var gObj = this.parent;
        var rows = gObj.getDataRows();
        var mRows;
        if (gObj.isFrozenGrid()) {
            mRows = gObj.getMovableDataRows();
            rows = gObj.addMovableRows(rows, mRows);
            if (gObj.getFrozenMode() === 'Left-Right') {
                rows = gObj.addMovableRows(rows, gObj.getFrozenRightDataRows());
            }
        }
        var cells = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            cells = cells.concat([].slice.call(rows[i].querySelectorAll('.e-cellselectionbackground')));
        }
        return cells;
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
            this.element.style.top = y1 + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
        }
        if (target && !e.ctrlKey && !e.shiftKey) {
            var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
            if (!this.isCellDrag) {
                this.hideAutoFill();
                this.selectRowsByRange(this.startDIndex, rowIndex);
            }
            else {
                var td = parentsUntil(e.target, 'e-rowcell');
                if (td) {
                    this.startAFCell = this.startCell;
                    this.endAFCell = parentsUntil(e.target, 'e-rowcell');
                    this.selectLikeExcel(e, rowIndex, parseInt(td.getAttribute('aria-colindex'), 10));
                }
            }
        }
    };
    Selection.prototype.selectLikeExcel = function (e, rowIndex, cellIndex) {
        if (!this.isAutoFillSel) {
            this.clearCellSelection();
            this.selectCellsByRange({ rowIndex: this.startDIndex, cellIndex: this.startDCellIndex }, { rowIndex: rowIndex, cellIndex: cellIndex });
            this.drawBorders();
        }
        else { //Autofill
            this.showAFBorders();
            this.selectLikeAutoFill(e);
        }
    };
    Selection.prototype.drawBorders = function () {
        if (this.selectionSettings.cellSelectionMode === 'BoxWithBorder' && this.selectedRowCellIndexes.length && !this.parent.isEdit) {
            this.parent.element.classList.add('e-enabledboxbdr');
            if (!this.bdrElement) {
                this.createBorders();
            }
            this.positionBorders();
        }
        else {
            this.showHideBorders('none');
        }
    };
    Selection.prototype.isLastCell = function (cell) {
        var cells = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[cells.length - 1] === cell;
    };
    Selection.prototype.isLastRow = function (cell) {
        var rows = [].slice.call(sf.base.closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[rows.length - 1];
    };
    Selection.prototype.isFirstRow = function (cell) {
        var rows = [].slice.call(sf.base.closest(cell, 'tbody').querySelectorAll('.e-row:not(.e-hiddenrow)'));
        return cell.parentElement === rows[0];
    };
    Selection.prototype.isFirstCell = function (cell) {
        var cells = [].slice.call(cell.parentElement.querySelectorAll('.e-rowcell:not(.e-hide)'));
        return cells[0] === cell;
    };
    Selection.prototype.setBorders = function (parentEle, border, bdrStr) {
        var cells = [].slice.call(parentEle.querySelectorAll('.e-cellselectionbackground')).
            filter(function (ele) { return ele.style.display === ''; });
        if (cells.length) {
            var isFrozen = this.parent.isFrozenGrid();
            var start = cells[0];
            var end = cells[cells.length - 1];
            var stOff = start.getBoundingClientRect();
            var endOff = end.getBoundingClientRect();
            var parentOff = start.offsetParent.getBoundingClientRect();
            var rowHeight = this.isLastRow(end) && (bdrStr === '1' || bdrStr === '2' || bdrStr === '5') ? 2 : 0;
            var topOffSet = this.parent.frozenRows && (bdrStr === '1' || bdrStr === '2') &&
                this.isFirstRow(start) ? 1.5 : 0;
            var leftOffset = isFrozen && (bdrStr === '2' || bdrStr === '4') && this.isFirstCell(start) ? 1 : 0;
            var rightOffset = ((this.parent.getFrozenMode() === 'Right' && (bdrStr === '1' || bdrStr === '3'))
                || (this.parent.getFrozenMode() === 'Left-Right' && (bdrStr === '5' || bdrStr === '6')))
                && this.isFirstCell(start) ? 1 : 0;
            if (this.parent.enableRtl) {
                border.style.right = parentOff.right - stOff.right - leftOffset + 'px';
                border.style.width = stOff.right - endOff.left + leftOffset + 1 + 'px';
            }
            else {
                border.style.left = stOff.left - parentOff.left - leftOffset - rightOffset + 'px';
                border.style.width = endOff.right - stOff.left + leftOffset - rightOffset + 1 + 'px';
            }
            border.style.top = stOff.top - parentOff.top - topOffSet + 'px';
            border.style.height = endOff.top - stOff.top > 0 ?
                (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) - rowHeight + topOffSet + 'px' :
                endOff.height + topOffSet - rowHeight + 1 + 'px';
            this.selectDirection += bdrStr;
        }
        else {
            border.style.display = 'none';
        }
    };
    Selection.prototype.positionBorders = function () {
        this.updateStartEndCells();
        if (!this.startCell || !this.bdrElement || !this.selectedRowCellIndexes.length) {
            return;
        }
        this.selectDirection = '';
        this.showHideBorders('');
        this.setBorders(this.parent.getContentTable(), this.bdrElement, '1');
        if (this.parent.isFrozenGrid()) {
            this.setBorders(this.parent.contentModule.getMovableContent(), this.mcBdrElement, '2');
            if (this.parent.getFrozenMode() === 'Left-Right') {
                this.setBorders(this.parent.contentModule.getFrozenRightContent(), this.frcBdrElement, '5');
            }
        }
        if (this.parent.frozenRows) {
            this.setBorders(this.parent.getHeaderTable(), this.fhBdrElement, '3');
            if (this.parent.isFrozenGrid()) {
                this.setBorders(this.parent.headerModule.getMovableHeader(), this.mhBdrElement, '4');
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.setBorders(this.parent.headerModule.getFrozenRightHeader(), this.frhBdrElement, '6');
                }
            }
        }
        this.applyBorders(this.selectDirection);
    };
    Selection.prototype.applyBothFrozenBorders = function (str) {
        var rtl = this.parent.enableRtl;
        switch (str.length) {
            case 6:
                {
                    this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                    this.mcBdrElement.style.borderWidth = '0 0 2px 0';
                    this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                    this.mhBdrElement.style.borderWidth = '2px 0 0 0';
                    this.frcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                    this.frhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                }
                break;
            case 4:
                {
                    if (str.includes('1') && str.includes('2') && str.includes('3') && str.includes('4')) {
                        this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                        this.mcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                    }
                    if (str.includes('2') && str.includes('4') && str.includes('5') && str.includes('6')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        this.frcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                        this.frhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                    }
                }
                break;
            case 3:
                {
                    this.bdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                    this.mcBdrElement.style.borderWidth = '2p 0 2px 0';
                    this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.mhBdrElement.style.borderWidth = '2px 0 2px 0';
                        this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                    }
                }
                break;
            case 2:
                {
                    if (str.includes('1')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        if (this.parent.frozenRows) {
                            this.fhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('2')) {
                        this.bdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frcBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        if (this.parent.frozenRows) {
                            this.mhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('3')) {
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        this.bdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                    if (str.includes('4')) {
                        this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frhBdrElement.style.borderWidth = rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                        this.mcBdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                    if (str.includes('5')) {
                        this.mcBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        if (this.parent.frozenRows) {
                            this.frhBdrElement.style.borderWidth = '2px 2px 0 2px';
                        }
                    }
                    if (str.includes('6')) {
                        this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                        this.frcBdrElement.style.borderWidth = '0 2px 2px 2px';
                    }
                }
                break;
            default:
                this.bdrElement.style.borderWidth = '2px';
                this.mcBdrElement.style.borderWidth = '2px';
                this.frcBdrElement.style.borderWidth = '2px';
                if (this.parent.frozenRows) {
                    this.fhBdrElement.style.borderWidth = '2px';
                    this.mhBdrElement.style.borderWidth = '2px';
                    this.frhBdrElement.style.borderWidth = '2px';
                }
                break;
        }
    };
    Selection.prototype.applyBorders = function (str) {
        var rtl = this.parent.enableRtl;
        if (this.parent.getFrozenMode() === 'Left-Right') {
            this.applyBothFrozenBorders(str);
        }
        else {
            switch (str.length) {
                case 4:
                    {
                        if (this.parent.getFrozenMode() === 'Right') {
                            this.bdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                            this.mcBdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                            this.fhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                            this.mhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                        }
                        else {
                            this.bdrElement.style.borderWidth = rtl ? '0 2px 2px 0' : '0 0 2px 2px';
                            this.mcBdrElement.style.borderWidth = rtl ? '0 0 2px 2px' : '0 2px 2px 0';
                            this.fhBdrElement.style.borderWidth = rtl ? '2px 2px 0 0' : '2px 0 0 2px';
                            this.mhBdrElement.style.borderWidth = rtl ? '2px 0 0 2px' : '2px 2px 0 0';
                        }
                    }
                    break;
                case 2:
                    {
                        if (this.parent.getFrozenMode() === 'Right') {
                            this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? '2px 0 2px 2px'
                                : '2px 2px 2px 0' : '0 2px 2px 2px';
                            this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? '2px 2px 2px 0'
                                : '2px 0 2px 2px' : '0 2px 2px 2px';
                            if (this.parent.frozenRows) {
                                this.fhBdrElement.style.borderWidth = str.includes('1') ? '2px 2px 0 2px'
                                    : rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                                this.mhBdrElement.style.borderWidth = str.includes('2') ? '2px 2px 0 2px'
                                    : rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                            }
                        }
                        else {
                            this.bdrElement.style.borderWidth = str.includes('2') ? rtl ? '2px 2px 2px 0'
                                : '2px 0 2px 2px' : '0 2px 2px 2px';
                            if (this.parent.isFrozenGrid()) {
                                this.mcBdrElement.style.borderWidth = str.includes('1') ? rtl ? '2px 0 2px 2px'
                                    : '2px 2px 2px 0' : '0 2px 2px 2px';
                            }
                            if (this.parent.frozenRows) {
                                this.fhBdrElement.style.borderWidth = str.includes('1') ? '2px 2px 0 2px'
                                    : rtl ? '2px 2px 2px 0' : '2px 0 2px 2px';
                                if (this.parent.isFrozenGrid()) {
                                    this.mhBdrElement.style.borderWidth = str.includes('2') ? '2px 2px 0 2px'
                                        : rtl ? '2px 0 2px 2px' : '2px 2px 2px 0';
                                }
                            }
                        }
                    }
                    break;
                default:
                    this.bdrElement.style.borderWidth = '2px';
                    if (this.parent.isFrozenGrid()) {
                        this.mcBdrElement.style.borderWidth = '2px';
                    }
                    if (this.parent.frozenRows) {
                        this.fhBdrElement.style.borderWidth = '2px';
                        if (this.parent.isFrozenGrid()) {
                            this.mhBdrElement.style.borderWidth = '2px';
                        }
                    }
                    break;
            }
        }
    };
    Selection.prototype.createBorders = function () {
        if (!this.bdrElement) {
            this.bdrElement = this.parent.getContentTable().parentElement.appendChild(sf.base.createElement('div', {
                className: 'e-xlsel', id: this.parent.element.id + '_bdr',
                styles: 'width: 2px; border-width: 0;'
            }));
            if (this.parent.isFrozenGrid()) {
                this.mcBdrElement = this.parent.contentModule.getMovableContent().appendChild(sf.base.createElement('div', {
                    className: 'e-xlsel', id: this.parent.element.id + '_mcbdr',
                    styles: 'height: 2px; border-width: 0;'
                }));
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frcBdrElement = this.parent.contentModule.getFrozenRightContent().appendChild(sf.base.createElement('div', {
                        className: 'e-xlsel', id: this.parent.element.id + '_frcbdr',
                        styles: 'height: 2px; border-width: 0;'
                    }));
                }
            }
            if (this.parent.frozenRows) {
                this.fhBdrElement = this.parent.getHeaderTable().parentElement.appendChild(sf.base.createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_fhbdr', styles: 'height: 2px;' }));
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                this.mhBdrElement = this.parent.headerModule.getMovableHeader().appendChild(sf.base.createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_mhbdr', styles: 'height: 2px;' }));
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frhBdrElement = this.parent.headerModule.getFrozenRightHeader().appendChild(sf.base.createElement('div', { className: 'e-xlsel', id: this.parent.element.id + '_frhbdr', styles: 'height: 2px;' }));
                }
            }
        }
    };
    Selection.prototype.showHideBorders = function (display) {
        if (this.bdrElement) {
            this.bdrElement.style.display = display;
            if (this.parent.isFrozenGrid()) {
                this.mcBdrElement.style.display = display;
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frcBdrElement.style.display = display;
                }
            }
            if (this.parent.frozenRows) {
                this.fhBdrElement.style.display = display;
            }
            if (this.parent.frozenRows && this.parent.isFrozenGrid()) {
                this.mhBdrElement.style.display = display;
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    this.frhBdrElement.style.display = display;
                }
            }
        }
    };
    Selection.prototype.drawAFBorders = function () {
        if (!this.bdrAFBottom) {
            this.createAFBorders();
        }
        this.positionAFBorders();
    };
    Selection.prototype.positionAFBorders = function () {
        if (!this.startCell || !this.bdrAFLeft) {
            return;
        }
        var stOff = this.startAFCell.getBoundingClientRect();
        var endOff = this.endAFCell.getBoundingClientRect();
        var top = endOff.top - stOff.top > 0 ? 1 : 0;
        var firstCellTop = endOff.top - stOff.top >= 0 && (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-frozencontent')) && this.isFirstRow(this.startAFCell) ? 1.5 : 0;
        var firstCellLeft = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
            parentsUntil(this.startAFCell, 'e-movableheader')) && this.isFirstCell(this.startAFCell) ? 1 : 0;
        var rowHeight = this.isLastRow(this.endAFCell) && (parentsUntil(this.endAFCell, 'e-movablecontent') ||
            parentsUntil(this.endAFCell, 'e-frozencontent')) ? 2 : 0;
        var parentOff = this.startAFCell.offsetParent.getBoundingClientRect();
        var parentRect = this.parent.element.getBoundingClientRect();
        var sTop = this.startAFCell.offsetParent.parentElement.scrollTop;
        var sLeft = this.startAFCell.offsetParent.parentElement.scrollLeft;
        var scrollTop = sTop - this.startAFCell.offsetTop;
        var scrollLeft = sLeft - this.startAFCell.offsetLeft;
        var totalHeight = this.parent.element.clientHeight;
        var totalWidth = this.parent.element.clientWidth;
        scrollTop = scrollTop > 0 ? Math.floor(scrollTop) - 1 : 0;
        scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
        var left = stOff.left - parentRect.left;
        if (!this.parent.enableRtl) {
            this.bdrAFLeft.style.left = left - firstCellLeft + scrollLeft - 1 + 'px';
            this.bdrAFRight.style.left = endOff.left - parentRect.left - 2 + endOff.width + 'px';
            this.bdrAFRight.style.width = totalWidth <= parseInt(this.bdrAFRight.style.left, 10) ? '0px' : '2px';
            this.bdrAFTop.style.left = left + scrollLeft - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFRight.style.left, 10) - parseInt(this.bdrAFLeft.style.left, 10)
                - firstCellLeft + 1 + 'px';
            if (totalWidth <= (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10))) {
                var leftRemove = (parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10)) - totalWidth;
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) - leftRemove + 'px';
            }
        }
        else {
            var scrolloffSet = (parentsUntil(this.startAFCell, 'e-movablecontent') ||
                parentsUntil(this.startAFCell, 'e-movableheader')) ? stOff.right -
                this.startAFCell.offsetParent.parentElement.getBoundingClientRect().width -
                parentRect.left : 0;
            this.bdrAFLeft.style.right = parentRect.right - endOff.right - 2 + endOff.width + 'px';
            this.bdrAFLeft.style.width = totalWidth <= parseInt(this.bdrAFLeft.style.right, 10) ? '0px' : '2px';
            this.bdrAFRight.style.right = parentRect.right - stOff.right - firstCellLeft + scrolloffSet - 1 + 'px';
            this.bdrAFTop.style.left = endOff.left - parentRect.left - 0.5 + 'px';
            this.bdrAFTop.style.width = parseInt(this.bdrAFLeft.style.right, 10) - parseInt(this.bdrAFRight.style.right, 10)
                - firstCellLeft + 1 + 'px';
            if (parseInt(this.bdrAFTop.style.left, 10) < 0) {
                this.bdrAFTop.style.width = parseInt(this.bdrAFTop.style.width, 10) + parseInt(this.bdrAFTop.style.left, 10) + 'px';
                this.bdrAFTop.style.left = '0px';
            }
        }
        this.bdrAFLeft.style.top = stOff.top - parentRect.top - firstCellTop + scrollTop + 'px';
        this.bdrAFLeft.style.height = endOff.top - stOff.top > 0 ?
            (endOff.top - parentOff.top + endOff.height + 1) - (stOff.top - parentOff.top) + firstCellTop - rowHeight - scrollTop + 'px' :
            endOff.height + firstCellTop - rowHeight - scrollTop + 'px';
        this.bdrAFRight.style.top = this.bdrAFLeft.style.top;
        this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';
        this.bdrAFTop.style.top = this.bdrAFRight.style.top;
        this.bdrAFBottom.style.left = this.bdrAFTop.style.left;
        this.bdrAFBottom.style.top = parseFloat(this.bdrAFLeft.style.top) + parseFloat(this.bdrAFLeft.style.height) - top - 1 + 'px';
        this.bdrAFBottom.style.width = totalHeight <= parseFloat(this.bdrAFBottom.style.top) ? '0px' : this.bdrAFTop.style.width;
        if (totalHeight <= (parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10))) {
            var topRemove = parseInt(this.bdrAFLeft.style.height, 10) + parseInt(this.bdrAFLeft.style.top, 10) - totalHeight;
            this.bdrAFLeft.style.height = parseInt(this.bdrAFLeft.style.height, 10) - topRemove + 'px';
            this.bdrAFRight.style.height = parseInt(this.bdrAFLeft.style.height, 10) + 'px';
        }
    };
    Selection.prototype.createAFBorders = function () {
        if (!this.bdrAFLeft) {
            this.bdrAFLeft = this.parent.element.appendChild(sf.base.createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafleft', styles: 'width: 2px;' }));
            this.bdrAFRight = this.parent.element.appendChild(sf.base.createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafright', styles: 'width: 2px;' }));
            this.bdrAFBottom = this.parent.element.appendChild(sf.base.createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdrafbottom', styles: 'height: 2px;' }));
            this.bdrAFTop = this.parent.element.appendChild(sf.base.createElement('div', { className: 'e-xlselaf', id: this.parent.element.id + '_bdraftop', styles: 'height: 2px;' }));
        }
    };
    Selection.prototype.showAFBorders = function () {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = '';
            this.bdrAFRight.style.display = '';
            this.bdrAFBottom.style.display = '';
            this.bdrAFTop.style.display = '';
        }
    };
    Selection.prototype.hideAFBorders = function () {
        if (this.bdrAFLeft) {
            this.bdrAFLeft.style.display = 'none';
            this.bdrAFRight.style.display = 'none';
            this.bdrAFBottom.style.display = 'none';
            this.bdrAFTop.style.display = 'none';
        }
    };
    Selection.prototype.updateValue = function (rIdx, cIdx, cell) {
        var args = this.createBeforeAutoFill(rIdx, cIdx, cell);
        if (!args.cancel) {
            var col = this.parent.getColumnByIndex(cIdx);
            if (this.parent.editModule && cell) {
                if (col.type === 'number') {
                    this.parent.editModule.updateCell(rIdx, col.field, parseInt(args.value, 10));
                }
                else {
                    this.parent.editModule.updateCell(rIdx, col.field, args.value);
                }
            }
        }
    };
    Selection.prototype.createBeforeAutoFill = function (rowIndex, colIndex, cell) {
        var col = this.parent.getColumnByIndex(colIndex);
        var args = {
            column: col,
            value: cell.innerText
        };
        this.parent.trigger(beforeAutoFill, args);
        return args;
    };
    Selection.prototype.getAutoFillCells = function (rowIndex, startCellIdx) {
        var cls = '.e-cellselectionbackground';
        var cells = [].slice.call(this.parent.getDataRows()[rowIndex].querySelectorAll(cls));
        if (this.parent.isFrozenGrid()) {
            cells = cells.concat([].slice.call(this.parent.getMovableDataRows()[rowIndex].querySelectorAll(cls)));
            if (this.parent.getFrozenMode() === 'Left-Right') {
                cells = cells.concat([].slice.call(this.parent.getFrozenRightDataRows()[rowIndex].querySelectorAll(cls)));
            }
        }
        return cells;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Selection.prototype.selectLikeAutoFill = function (e, isApply) {
        var startrowIdx = parseInt(parentsUntil(this.startAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
        var startCellIdx = parseInt(this.startAFCell.getAttribute('aria-colindex'), 10);
        var endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
        var endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
        var rowLen = this.selectedRowCellIndexes.length - 1;
        var colLen = this.selectedRowCellIndexes[0].cellIndexes.length - 1;
        switch (true) { //direction         
            case !isApply && this.endAFCell.classList.contains('e-cellselectionbackground') &&
                !!parentsUntil(e.target, 'e-rowcell'):
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, startCellIdx);
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, startCellIdx + colLen);
                this.drawAFBorders();
                break;
            case this.autoFillRLselection && startCellIdx + colLen < endCellIdx && //right
                endCellIdx - startCellIdx - colLen + 1 > endrowIdx - startrowIdx - rowLen // right bottom
                && endCellIdx - startCellIdx - colLen + 1 > startrowIdx - endrowIdx: //right top
                this.endAFCell = this.parent.getCellFromIndex(startrowIdx + rowLen, endCellIdx);
                endrowIdx = parseInt(parentsUntil(this.endAFCell, 'e-row').getAttribute('aria-rowindex'), 10);
                endCellIdx = parseInt(this.endAFCell.getAttribute('aria-colindex'), 10);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var cellIdx = parseInt(this.endCell.getAttribute('aria-colindex'), 10);
                    for (var i = startrowIdx; i <= endrowIdx; i++) {
                        var cells = this.getAutoFillCells(i, startCellIdx);
                        var c = 0;
                        for (var j = cellIdx + 1; j <= endCellIdx; j++) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: startrowIdx, cellIndex: this.startCellIndex }, { rowIndex: endrowIdx, cellIndex: endCellIdx });
                }
                break;
            case this.autoFillRLselection && startCellIdx > endCellIdx && // left
                startCellIdx - endCellIdx + 1 > endrowIdx - startrowIdx - rowLen && //left top
                startCellIdx - endCellIdx + 1 > startrowIdx - endrowIdx: // left bottom
                this.startAFCell = this.parent.getCellFromIndex(startrowIdx, endCellIdx);
                this.endAFCell = this.endCell;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    for (var i = startrowIdx; i <= startrowIdx + rowLen; i++) {
                        var cells = this.getAutoFillCells(i, startCellIdx);
                        cells.reverse();
                        var c = 0;
                        for (var j = this.startCellIndex - 1; j >= endCellIdx; j--) {
                            if (c > colLen) {
                                c = 0;
                            }
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: startrowIdx, cellIndex: endCellIdx }, { rowIndex: startrowIdx + rowLen, cellIndex: this.startCellIndex + colLen });
                }
                break;
            case startrowIdx > endrowIdx: //up
                this.startAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx);
                this.endAFCell = this.endCell;
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var trIdx = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
                    var r = trIdx;
                    for (var i = startrowIdx - 1; i >= endrowIdx; i--) {
                        if (r === this.startIndex - 1) {
                            r = trIdx;
                        }
                        var cells = this.getAutoFillCells(r, startCellIdx);
                        var c = 0;
                        r--;
                        for (var j = this.startCellIndex; j <= this.startCellIndex + colLen; j++) {
                            this.updateValue(i, j, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: endrowIdx, cellIndex: startCellIdx + colLen }, { rowIndex: startrowIdx + rowLen, cellIndex: startCellIdx });
                }
                break;
            default: //down
                this.endAFCell = this.parent.getCellFromIndex(endrowIdx, startCellIdx + colLen);
                if (!isApply) {
                    this.drawAFBorders();
                }
                else {
                    var trIdx = parseInt(this.endCell.parentElement.getAttribute('aria-rowindex'), 10);
                    var r = this.startIndex;
                    for (var i = trIdx + 1; i <= endrowIdx; i++) {
                        if (r === trIdx + 1) {
                            r = this.startIndex;
                        }
                        var cells = this.getAutoFillCells(r, startCellIdx);
                        r++;
                        var c = 0;
                        for (var m = this.startCellIndex; m <= this.startCellIndex + colLen; m++) {
                            this.updateValue(i, m, cells[c]);
                            c++;
                        }
                    }
                    this.selectCellsByRange({ rowIndex: trIdx - rowLen, cellIndex: startCellIdx }, { rowIndex: endrowIdx, cellIndex: startCellIdx + colLen });
                }
                break;
        }
    };
    Selection.prototype.mouseUpHandler = function (e) {
        document.body.classList.remove('e-disableuserselect');
        if (this.element) {
            sf.base.remove(this.element);
        }
        if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
            this.mUPTarget = parentsUntil(e.target, 'e-rowcell');
        }
        else {
            this.mUPTarget = null;
        }
        if (this.isDragged && !this.isAutoFillSel && this.selectionSettings.mode === 'Cell') {
            var target = e.target;
            var rowIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
            var cellIndex = parseInt(target.getAttribute('aria-colindex'), 10);
            this.isDragged = false;
            this.clearCellSelection();
            this.selectCellsByRange({ rowIndex: this.startDIndex, cellIndex: this.startDCellIndex }, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isDragged = false;
        this.updateAutoFillPosition();
        if (this.isAutoFillSel) {
            var lastCell = parentsUntil(e.target, 'e-rowcell');
            this.endAFCell = lastCell ? lastCell : this.endCell === this.endAFCell ? this.startAFCell : this.endAFCell;
            this.startAFCell = this.startCell;
            this.updateStartCellsIndex();
            this.selectLikeAutoFill(e, true);
            this.updateAutoFillPosition();
            this.hideAFBorders();
            this.positionBorders();
            this.isAutoFillSel = false;
        }
        sf.base.EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        if (this.parent.frozenRows) {
            sf.base.EventHandler.remove(this.parent.getHeaderContent(), 'mousemove', this.mouseMoveHandler);
        }
        sf.base.EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
    };
    Selection.prototype.hideAutoFill = function () {
        if (this.autofill) {
            this.autofill.style.display = 'none';
        }
    };
    /**
     * @hidden
     */
    Selection.prototype.updateAutoFillPosition = function () {
        if (this.parent.enableAutoFill && !this.parent.isEdit &&
            this.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()
            && this.selectedRowCellIndexes.length) {
            var index = parseInt(this.target.getAttribute('aria-colindex'), 10);
            var rindex = parseInt(this.target.getAttribute('index'), 10);
            var rowIndex = this.selectedRowCellIndexes[this.selectedRowCellIndexes.length - 1].rowIndex;
            var cells = this.getAutoFillCells(rowIndex, index).filter(function (ele) { return ele.style.display === ''; });
            var col = this.parent.getColumnByIndex(index);
            var isFrozenCol = col.getFreezeTableName() === 'movable';
            var isFrozenRow = rindex < this.parent.frozenRows;
            var isFrozenRight = this.parent.getFrozenMode() === 'Left-Right' && col.getFreezeTableName() === 'frozen-right';
            if (!sf.base.select('#' + this.parent.element.id + '_autofill', parentsUntil(this.target, 'e-table'))) {
                if (sf.base.select('#' + this.parent.element.id + '_autofill', this.parent.element)) {
                    sf.base.select('#' + this.parent.element.id + '_autofill', this.parent.element).remove();
                }
                this.autofill = sf.base.createElement('div', { className: 'e-autofill', id: this.parent.element.id + '_autofill' });
                this.autofill.style.display = 'none';
                !isFrozenRow ? !isFrozenCol ? this.parent.getContentTable().parentElement.appendChild(this.autofill) :
                    this.parent.contentModule.getMovableContent().appendChild(this.autofill) :
                    !isFrozenCol ? this.parent.getHeaderTable().parentElement.appendChild(this.autofill) :
                        this.parent.headerModule.getMovableHeader().appendChild(this.autofill);
                if (isFrozenRight) {
                    isFrozenRow ? this.parent.getFrozenRightHeader().appendChild(this.autofill)
                        : this.parent.getFrozenRightContent().appendChild(this.autofill);
                }
            }
            var cell = cells[cells.length - 1];
            if (cell && cell.offsetParent) {
                var clientRect = cell.getBoundingClientRect();
                var parentOff = cell.offsetParent.getBoundingClientRect();
                var colWidth = this.isLastCell(cell) ? 4 : 0;
                var rowHeight = this.isLastRow(cell) ? 3 : 0;
                if (!this.parent.enableRtl) {
                    this.autofill.style.left = clientRect.left - parentOff.left + clientRect.width - 4 - colWidth + 'px';
                }
                else {
                    this.autofill.style.right = parentOff.right - clientRect.right + clientRect.width - 4 - colWidth + 'px';
                }
                this.autofill.style.top = clientRect.top - parentOff.top + clientRect.height - 5 - rowHeight + 'px';
            }
            this.autofill.style.display = '';
        }
        else {
            this.hideAutoFill();
        }
    };
    Selection.prototype.mouseDownHandler = function (e) {
        this.mouseButton = e.button;
        var target = e.target;
        var gObj = this.parent;
        var isDrag;
        var gridElement = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== gObj.element.id || parentsUntil(target, 'e-headercontent') && !this.parent.frozenRows ||
            parentsUntil(target, 'e-editedbatchcell') || parentsUntil(target, 'e-editedrow')) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (parentsUntil(target, 'e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            if (gObj.selectionSettings.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
                this.isCellDrag = true;
                isDrag = true;
            }
            else if (gObj.allowRowDragAndDrop && !gObj.isEdit) {
                if (!this.isRowType() || this.isSingleSel() || sf.base.closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                isDrag = true;
                this.element = this.parent.createElement('div', { className: 'e-griddragarea' });
                gObj.getContent().appendChild(this.element);
            }
            if (isDrag) {
                this.enableDrag(e, true);
            }
        }
        this.updateStartEndCells();
        if (target.classList.contains('e-autofill') || target.classList.contains('e-xlsel')) {
            this.isCellDrag = true;
            this.isAutoFillSel = true;
            this.enableDrag(e);
        }
    };
    Selection.prototype.updateStartEndCells = function () {
        var cells = [].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground'));
        this.startCell = cells[0];
        this.endCell = cells[cells.length - 1];
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
            this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
    };
    Selection.prototype.updateStartCellsIndex = function () {
        if (this.startCell) {
            this.startIndex = parseInt(this.startCell.parentElement.getAttribute('aria-rowindex'), 10);
            this.startCellIndex = parseInt(parentsUntil(this.startCell, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
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
        if (this.parent.frozenRows) {
            sf.base.EventHandler.add(gObj.getHeaderContent(), 'mousemove', this.mouseMoveHandler, this);
        }
        sf.base.EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
    };
    Selection.prototype.clearSelAfterRefresh = function (e) {
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfiniteScroll) {
            this.clearSelection();
        }
    };
    /**
     * @hidden
     */
    Selection.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(uiUpdate, this.enableAfterRender, this);
        this.parent.on(initialEnd, this.initializeSelection, this);
        this.parent.on(rowSelectionComplete, this.onActionComplete, this);
        this.parent.on(cellSelectionComplete, this.onActionComplete, this);
        this.parent.on(inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(cellFocused, this.onCellFocused, this);
        this.parent.on(beforeFragAppend, this.clearSelAfterRefresh, this);
        this.parent.on(columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(contentReady, this.initialEnd, this);
        this.actionBeginFunction = this.actionBegin.bind(this);
        this.actionCompleteFunction = this.actionComplete.bind(this);
        this.parent.addEventListener(actionBegin, this.actionBeginFunction);
        this.parent.addEventListener(actionComplete, this.actionCompleteFunction);
        this.parent.on(rowsRemoved, this.rowsRemoved, this);
        this.parent.on(headerRefreshed, this.refreshHeader, this);
        this.addEventListener_checkbox();
    };
    /**
     * @hidden
     */
    Selection.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(uiUpdate, this.enableAfterRender);
        this.parent.off(initialEnd, this.initializeSelection);
        this.parent.off(rowSelectionComplete, this.onActionComplete);
        this.parent.off(cellSelectionComplete, this.onActionComplete);
        this.parent.off(inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(cellFocused, this.onCellFocused);
        this.parent.off(beforeFragAppend, this.clearSelAfterRefresh);
        this.parent.off(columnPositionChanged, this.columnPositionChanged);
        this.parent.removeEventListener(actionBegin, this.actionBeginFunction);
        this.parent.removeEventListener(actionComplete, this.actionCompleteFunction);
        this.parent.off(rowsRemoved, this.rowsRemoved);
        this.parent.off(headerRefreshed, this.refreshHeader);
        this.removeEventListener_checkbox();
    };
    Selection.prototype.wireEvents = function () {
        this.isMacOS = navigator.userAgent.indexOf('Mac OS') !== -1;
        if (this.isMacOS) {
            sf.base.EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
            sf.base.EventHandler.add(this.parent.element, 'keyup', this.keyUpHandler, this);
        }
    };
    Selection.prototype.unWireEvents = function () {
        if (this.isMacOS) {
            sf.base.EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
            sf.base.EventHandler.remove(this.parent.element, 'keyup', this.keyUpHandler);
        }
    };
    Selection.prototype.columnPositionChanged = function () {
        if (!this.parent.isPersistSelection) {
            this.clearSelection();
        }
    };
    Selection.prototype.refreshHeader = function () {
        this.setCheckAllState();
    };
    Selection.prototype.rowsRemoved = function (e) {
        for (var i = 0; i < e.records.length; i++) {
            delete (this.selectedRowState[e.records[i][this.primaryKey]]);
            --this.totalRecordsCount;
        }
        this.setCheckAllState();
    };
    
    Selection.prototype.beforeFragAppend = function (e) {
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection) {
            this.clearSelection();
        }
    };
    
    Selection.prototype.getCheckAllBox = function () {
        return this.parent.getHeaderContent().querySelector('.e-checkselectall');
    };
    Selection.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
            this.initPerisistSelection();
        }
    };
    Selection.prototype.render = function (e) {
        sf.base.EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.mouseDownHandler, this);
    };
    Selection.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        var gObj = this.parent;
        if (!sf.base.isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'Single') {
            if (this.selectedRowCellIndexes.length > 1) {
                this.clearCellSelection();
                this.prevCIdxs = undefined;
            }
            if (this.selectedRowIndexes.length > 1) {
                this.clearRowSelection();
                this.prevRowIndex = undefined;
            }
            if (this.selectedColumnsIndexes.length > 1) {
                this.clearColumnSelection();
                this.prevColIndex = undefined;
            }
            this.enableSelectMultiTouch = false;
            this.hidePopUp();
        }
        if (!sf.base.isNullOrUndefined(e.properties.mode) ||
            !sf.base.isNullOrUndefined(e.properties.cellSelectionMode)) {
            this.clearSelection();
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevColIndex = undefined;
        }
        this.isPersisted = true;
        this.checkBoxSelectionChanged();
        this.isPersisted = false;
        this.initPerisistSelection();
        var checkboxColumn = this.parent.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        if (checkboxColumn.length) {
            gObj.isCheckBoxSelection = !(this.selectionSettings.checkboxMode === 'ResetOnRowClick');
        }
        this.drawBorders();
    };
    Selection.prototype.hidePopUp = function () {
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.initialEnd = function (e) {
        var isFrozen = this.parent.isFrozenGrid();
        var isLeftRightFrozen = this.parent.getFrozenMode() === 'Left-Right';
        if (!isFrozen || (isFrozen && (!isLeftRightFrozen && !e.args.isFrozen)
            || (isLeftRightFrozen && e.args.renderFrozenRightContent))) {
            this.parent.off(contentReady, this.initialEnd);
            this.selectRow(this.parent.selectedRowIndex);
        }
    };
    Selection.prototype.checkBoxSelectionChanged = function () {
        this.parent.off(contentReady, this.checkBoxSelectionChanged);
        var gobj = this.parent;
        var checkboxColumn = gobj.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        if (checkboxColumn.length > 0) {
            gobj.isCheckBoxSelection = true;
            this.chkField = checkboxColumn[0].field;
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
            if (sf.base.isNullOrUndefined(this.totalRecordsCount)) {
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            if (this.isSingleSel()) {
                gobj.selectionSettings.type = 'Multiple';
                gobj.dataBind();
            }
            else {
                this.initPerisistSelection();
            }
        }
        if (!gobj.isCheckBoxSelection && !this.isPersisted) {
            this.chkField = null;
            this.initPerisistSelection();
        }
    };
    Selection.prototype.initPerisistSelection = function () {
        var gobj = this.parent;
        if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = true;
            this.ensureCheckboxFieldSelection();
        }
        else if (this.parent.getPrimaryKeyFieldNames().length > 0) {
            gobj.isPersistSelection = false;
            this.ensureCheckboxFieldSelection();
        }
        else {
            gobj.isPersistSelection = false;
            this.selectedRowState = {};
        }
    };
    Selection.prototype.ensureCheckboxFieldSelection = function () {
        var gobj = this.parent;
        this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
        if (!gobj.enableVirtualization && this.chkField
            && ((gobj.isPersistSelection && Object.keys(this.selectedRowState).length === 0) ||
                !gobj.isPersistSelection)) {
            var data = this.parent.getDataModule();
            var query = new sf.data.Query().where(this.chkField, 'equal', true);
            if (!query.params) {
                query.params = this.parent.query.params;
            }
            var dataManager = data.getData({}, query);
            var proxy_1 = this;
            this.parent.showSpinner();
            dataManager.then(function (e) {
                proxy_1.dataSuccess(e.result);
                proxy_1.refreshPersistSelection();
                proxy_1.parent.hideSpinner();
            });
        }
    };
    Selection.prototype.dataSuccess = function (res) {
        for (var i = 0; i < res.length; i++) {
            if (sf.base.isNullOrUndefined(this.selectedRowState[res[i][this.primaryKey]]) && res[i][this.chkField]) {
                this.selectedRowState[res[i][this.primaryKey]] = res[i][this.chkField];
            }
        }
        this.persistSelectedData = res;
    };
    Selection.prototype.setRowSelection = function (state) {
        if (!this.parent.getDataModule().isRemote() && !sf.base.isBlazor()) {
            if (state) {
                if (this.parent.groupSettings.columns.length) {
                    for (var _i = 0, _a = this.getData().records; _i < _a.length; _i++) {
                        var data = _a[_i];
                        this.selectedRowState[data[this.primaryKey]] = true;
                    }
                }
                else {
                    for (var _b = 0, _c = this.getData(); _b < _c.length; _b++) {
                        var data = _c[_b];
                        this.selectedRowState[data[this.primaryKey]] = true;
                    }
                }
            }
            else {
                this.selectedRowState = {};
            }
            // (this.getData()).forEach(function (data) {
            //     this.selectedRowState[data[this.primaryKey]] = true;
            // })
        }
    };
    Selection.prototype.getData = function () {
        return this.parent.getDataModule().dataManager.executeLocal(this.parent.getDataModule().generateQuery(true));
    };
    Selection.prototype.refreshPersistSelection = function () {
        var rows = this.parent.getRows();
        this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        if (rows !== null && rows.length > 0 && (this.parent.isPersistSelection || this.chkField)) {
            var indexes = [];
            for (var j = 0; j < rows.length; j++) {
                var rowObj = this.getRowObj(rows[j]);
                var pKey = rowObj ? rowObj.data ? rowObj.data[this.primaryKey] : null : null;
                if (pKey === null) {
                    return;
                }
                var checkState = void 0;
                var chkBox = rows[j].querySelector('.e-checkselect');
                if (this.selectedRowState[pKey] || (this.parent.checkAllRows === 'Check' &&
                    this.totalRecordsCount === Object.keys(this.selectedRowState).length && this.chkAllCollec.indexOf(pKey) < 0)
                    || (this.parent.checkAllRows === 'Uncheck' && this.chkAllCollec.indexOf(pKey) > 0)
                    || (this.parent.checkAllRows === 'Intermediate' && !sf.base.isNullOrUndefined(this.chkField) && rowObj.data[this.chkField])) {
                    indexes.push(parseInt(rows[j].getAttribute('aria-rowindex'), 10));
                    checkState = true;
                }
                else {
                    checkState = false;
                    if (this.checkedTarget !== chkBox && this.parent.isCheckBoxSelection) {
                        removeAddCboxClasses(chkBox.nextElementSibling, checkState);
                    }
                }
                this.updatePersistCollection(rows[j], checkState);
            }
            this.isSingleSel() && indexes.length > 0 ? this.selectRow(indexes[0], true) : this.selectRows(indexes);
        }
        if (this.parent.isCheckBoxSelection && this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
        }
    };
    Selection.prototype.actionBegin = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            var editChkBox = this.parent.element.querySelector('.e-edit-checkselect');
            if (!sf.base.isNullOrUndefined(editChkBox)) {
                var row = sf.base.closest(editChkBox, '.e-editedrow');
                if (row) {
                    if (this.parent.editSettings.mode === 'Dialog') {
                        row = this.parent.element.querySelector('.e-dlgeditrow');
                    }
                    var rowObj = this.getRowObj(row);
                    if (!rowObj) {
                        return;
                    }
                    this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = editChkBox.checked;
                }
                else {
                    this.isCheckedOnAdd = editChkBox.checked;
                }
            }
        }
    };
    Selection.prototype.actionComplete = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            if (e.action === 'add' && this.isCheckedOnAdd) {
                var rowObj = this.parent.getRowObjectFromUID(this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
                this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = this.isCheckedOnAdd;
            }
            this.refreshPersistSelection();
        }
        if (e.requestType === 'delete' && this.parent.isPersistSelection) {
            var records = [];
            if (!sf.base.isBlazor()) {
                records = e.data;
            }
            else {
                records = this.getSelectedRecords();
            }
            var data = records.slice();
            for (var i = 0; i < data.length; i++) {
                if (!sf.base.isNullOrUndefined(data[i][this.primaryKey])) {
                    this.updatePersistDelete(data[i][this.primaryKey]);
                }
            }
            this.setCheckAllState();
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        if (e.requestType === 'paging') {
            this.prevRowIndex = undefined;
            this.prevCIdxs = undefined;
            this.prevECIdxs = undefined;
        }
    };
    Selection.prototype.onDataBound = function () {
        if (!this.parent.enableVirtualization && this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
        if (this.parent.enableVirtualization) {
            this.setCheckAllState();
        }
        if (this.parent.isCheckBoxSelection && !this.initialRowSelection) {
            var totalRecords = this.parent.getRowsObject();
            var indexes = [];
            for (var i = 0; i < totalRecords.length; i++) {
                if (totalRecords[i].isSelected) {
                    indexes.push(i);
                }
            }
            if (indexes.length) {
                this.selectRows(indexes);
            }
            this.initialRowSelection = true;
        }
    };
    Selection.prototype.updatePersistSelectedData = function (checkState) {
        if (this.parent.isPersistSelection) {
            var rows = this.parent.getRows();
            for (var i = 0; i < rows.length; i++) {
                this.updatePersistCollection(rows[i], checkState);
            }
            if (this.parent.checkAllRows === 'Uncheck') {
                this.setRowSelection(false);
                this.persistSelectedData = this.parent.getDataModule().isRemote() ? this.persistSelectedData : [];
            }
            else if (this.parent.checkAllRows === 'Check') {
                this.setRowSelection(true);
                this.persistSelectedData = (!this.parent.getDataModule().isRemote() && !sf.base.isBlazor()) ?
                    this.parent.groupSettings.columns.length ? this.getData().records.slice() :
                        this.getData().slice() : this.persistSelectedData;
            }
        }
    };
    Selection.prototype.checkSelectAllAction = function (checkState) {
        var cRenderer = this.getRenderer();
        var editForm = this.parent.element.querySelector('.e-gridform');
        this.checkedTarget = this.getCheckAllBox();
        if (checkState && this.getCurrentBatchRecordChanges().length) {
            this.parent.checkAllRows = 'Check';
            this.updatePersistSelectedData(checkState);
            if (sf.base.isBlazor() && this.parent.enableVirtualization &&
                !sf.base.isNullOrUndefined(this.parent.contentModule.currentInfo.endIndex)) {
                this.selectRowsByRange(this.parent.contentModule.currentInfo.startIndex, this.parent.contentModule.currentInfo.endIndex);
            }
            else {
                this.selectRowsByRange(cRenderer.getVirtualRowIndex(0), cRenderer.getVirtualRowIndex(this.getCurrentBatchRecordChanges().length - 1));
            }
        }
        else {
            this.parent.checkAllRows = 'Uncheck';
            this.updatePersistSelectedData(checkState);
            this.clearSelection();
        }
        this.chkAllCollec = [];
        if (!sf.base.isNullOrUndefined(editForm)) {
            var editChkBox = editForm.querySelector('.e-edit-checkselect');
            if (!sf.base.isNullOrUndefined(editChkBox)) {
                removeAddCboxClasses(editChkBox.nextElementSibling, checkState);
            }
        }
    };
    Selection.prototype.checkSelectAll = function (checkBox) {
        var _this = this;
        var stateStr = this.getCheckAllStatus(checkBox);
        var state = stateStr === 'Check';
        this.isHeaderCheckboxClicked = true;
        if (stateStr === 'Intermediate') {
            state = this.getCurrentBatchRecordChanges().some(function (data) {
                return data[_this.primaryKey] in _this.selectedRowState;
            });
        }
        if (this.parent.isPersistSelection && this.parent.allowPaging) {
            this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
        }
        this.checkSelectAllAction(!state);
        if (sf.base.isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization) {
            var interopAdaptor = 'interopAdaptor';
            var invokeMethodAsync = 'invokeMethodAsync';
            this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', !state, 'checkbox', null);
            this.checkBoxState = !state;
            if (!state) {
                var values = 'values';
                var vgenerator = 'vgenerator';
                var rowCache = this.parent.contentModule[vgenerator].rowCache;
                Object[values](rowCache).forEach(function (x) { return x.isSelected = true; });
                for (var i = 0; i < Object.keys(rowCache).length; i++) {
                    if (this.parent.selectionModule.selectedRowIndexes.indexOf(Number(Object.keys(rowCache)[i])) === -1) {
                        this.parent.selectionModule.selectedRowIndexes.push(Number(Object.keys(rowCache)[i]));
                    }
                }
            }
        }
        this.target = null;
        if (this.getCurrentBatchRecordChanges().length > 0) {
            this.setCheckAllState();
        }
        this.triggerChkChangeEvent(checkBox, !state);
    };
    Selection.prototype.getCheckAllStatus = function (ele) {
        var classes = ele ? ele.nextElementSibling.classList :
            this.getCheckAllBox().nextElementSibling.classList;
        var status;
        if (classes.contains('e-check')) {
            status = 'Check';
        }
        else if (classes.contains('e-uncheck')) {
            status = 'Uncheck';
        }
        else if (classes.contains('e-stop')) {
            status = 'Intermediate';
        }
        else {
            status = 'None';
        }
        return status;
    };
    Selection.prototype.checkSelect = function (checkBox) {
        var target = sf.base.closest(this.checkedTarget, '.e-rowcell');
        var gObj = this.parent;
        this.isMultiCtrlRequest = true;
        var rIndex = 0;
        this.isHeaderCheckboxClicked = false;
        if (isGroupAdaptive(gObj)) {
            var uid = target.parentElement.getAttribute('data-uid');
            rIndex = gObj.getRows().map(function (m) { return m.getAttribute('data-uid'); }).indexOf(uid);
        }
        else {
            rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        }
        if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0 &&
            this.parent.editSettings.newRowPosition === 'Top') {
            ++rIndex;
        }
        this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
        this.moveIntoUncheckCollection(sf.base.closest(target, '.e-row'));
        this.setCheckAllState();
        this.isMultiCtrlRequest = false;
        this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'));
    };
    Selection.prototype.moveIntoUncheckCollection = function (row) {
        if (this.parent.checkAllRows === 'Check' || this.parent.checkAllRows === 'Uncheck') {
            var rowObj = this.getRowObj(row);
            var pKey = rowObj && rowObj.data ? rowObj.data[this.primaryKey] : null;
            if (!pKey) {
                return;
            }
            if (this.chkAllCollec.indexOf(pKey) < 0) {
                this.chkAllCollec.push(pKey);
            }
            else {
                this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
            }
        }
    };
    Selection.prototype.triggerChkChangeEvent = function (checkBox, checkState) {
        this.parent.trigger(checkBoxChange, {
            checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
            target: checkBox
        });
        if (!this.parent.isEdit) {
            this.checkedTarget = null;
        }
    };
    Selection.prototype.updateSelectedRowIndex = function (index) {
        if (this.parent.isCheckBoxSelection && (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
            && !this.parent.getDataModule().isRemote()
            && !(sf.base.isBlazor() && this.parent.isServerRendered)) {
            if (this.parent.checkAllRows === 'Check') {
                this.selectedRowIndexes = [];
                var dataLength = this.getData().length;
                for (var data = 0; data < dataLength; data++) {
                    this.selectedRowIndexes.push(data);
                }
            }
            else if (this.parent.checkAllRows === 'Uncheck') {
                this.selectedRowIndexes = [];
            }
            else {
                if (index && this.parent.getRowByIndex(index).getAttribute('aria-selected') === 'false') {
                    var selectedVal = this.selectedRowIndexes.indexOf(index);
                    this.selectedRowIndexes.splice(selectedVal, 1);
                }
            }
        }
    };
    
    Selection.prototype.setCheckAllState = function (index, isInteraction) {
        if (this.parent.isCheckBoxSelection || this.parent.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            var checkToSelectAll = void 0;
            var isServerRenderedVirtualization = sf.base.isBlazor() && this.parent.isServerRendered && this.parent.enableVirtualization;
            if (isServerRenderedVirtualization) {
                var values = 'values';
                var vgenerator = 'vgenerator';
                checkToSelectAll = !Object[values](this.parent.contentModule[vgenerator].rowCache).
                    filter(function (x) { return x.isSelected === undefined || x.isSelected === false; }).length &&
                    Object[values](this.parent.contentModule[vgenerator].rowCache).
                        filter(function (x) { return x.isSelected; }).length === this.selectedRowIndexes.length;
            }
            var checkedLen = Object.keys(this.selectedRowState).length;
            if (!this.parent.isPersistSelection && !(isServerRenderedVirtualization)) {
                checkedLen = this.selectedRowIndexes.length;
                this.totalRecordsCount = this.getCurrentBatchRecordChanges().length;
            }
            var input = this.getCheckAllBox();
            if (input) {
                var spanEle = input.nextElementSibling;
                sf.base.removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
                setChecked(input, false);
                input.indeterminate = false;
                if (checkToSelectAll || checkedLen === this.totalRecordsCount && this.totalRecordsCount
                    || ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                        && !this.parent.allowPaging && !this.parent.getDataModule().isRemote()
                        && !(sf.base.isBlazor() && this.parent.isServerRendered)
                        && checkedLen === this.getData().length)) {
                    sf.base.addClass([spanEle], ['e-check']);
                    setChecked(input, true);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, true, true);
                    }
                    this.parent.checkAllRows = 'Check';
                }
                else if (isServerRenderedVirtualization && !this.selectedRowIndexes.length ||
                    checkedLen === 0 && !isServerRenderedVirtualization || this.getCurrentBatchRecordChanges().length === 0) {
                    sf.base.addClass([spanEle], ['e-uncheck']);
                    if (isInteraction) {
                        this.getRenderer().setSelection(null, false, true);
                    }
                    this.parent.checkAllRows = 'Uncheck';
                    if (checkedLen === 0 && this.getCurrentBatchRecordChanges().length === 0) {
                        sf.base.addClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    }
                    else {
                        sf.base.removeClass([spanEle.parentElement], ['e-checkbox-disabled']);
                    }
                }
                else {
                    sf.base.addClass([spanEle], ['e-stop']);
                    this.parent.checkAllRows = 'Intermediate';
                    input.indeterminate = true;
                }
                if ((this.parent.enableVirtualization || this.parent.enableInfiniteScrolling)
                    && !this.parent.allowPaging && !this.parent.getDataModule().isRemote()) {
                    this.updateSelectedRowIndex(index);
                }
            }
        }
    };
    Selection.prototype.keyDownHandler = function (e) {
        // Below are keyCode for command key in MAC OS. Safari/Chrome(91-Left command, 93-Right Command), Opera(17), FireFox(224)
        if ((((sf.base.Browser.info.name === 'chrome') || (sf.base.Browser.info.name === 'safari')) && (e.keyCode === 91 || e.keyCode === 93)) ||
            (sf.base.Browser.info.name === 'opera' && e.keyCode === 17) || (sf.base.Browser.info.name === 'mozilla' && e.keyCode === 224)) {
            this.cmdKeyPressed = true;
        }
    };
    Selection.prototype.keyUpHandler = function (e) {
        if ((((sf.base.Browser.info.name === 'chrome') || (sf.base.Browser.info.name === 'safari')) && (e.keyCode === 91 || e.keyCode === 93)) ||
            (sf.base.Browser.info.name === 'opera' && e.keyCode === 17) || (sf.base.Browser.info.name === 'mozilla' && e.keyCode === 224)) {
            this.cmdKeyPressed = false;
        }
    };
    Selection.prototype.clickHandler = function (e) {
        var target = e.target;
        this.actualTarget = target;
        if (parentsUntil(target, 'e-row') || parentsUntil(target, 'e-headerchkcelldiv') ||
            (this.selectionSettings.allowColumnSelection && target.classList.contains('e-headercell'))) {
            this.isInteracted = true;
        }
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch ||
            (this.isMacOS && this.cmdKeyPressed);
        this.isMultiShiftRequest = e.shiftKey;
        this.popUpClickHandler(e);
        var chkSelect = false;
        this.preventFocus = true;
        var checkBox;
        var checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        this.checkSelectAllClicked = checkWrap && checkWrap.querySelectorAll('.e-checkselectall') ? true : false;
        if (checkWrap && checkWrap.querySelectorAll('.e-checkselect,.e-checkselectall').length > 0) {
            checkBox = checkWrap.querySelector('input[type="checkbox"]');
            chkSelect = true;
        }
        this.drawBorders();
        this.updateAutoFillPosition();
        target = parentsUntil(target, 'e-rowcell');
        if ((target && target.parentElement.classList.contains('e-row') && !this.parent.selectionSettings.checkboxOnly) || chkSelect) {
            if (this.parent.isCheckBoxSelection) {
                this.isMultiCtrlRequest = true;
            }
            this.target = target;
            if (!sf.base.isNullOrUndefined(checkBox)) {
                this.checkedTarget = checkBox;
                if (checkBox.classList.contains('e-checkselectall')) {
                    this.checkSelectAll(checkBox);
                }
                else {
                    this.checkSelect(checkBox);
                }
            }
            else {
                var gObj = this.parent;
                var rIndex = 0;
                if (isGroupAdaptive(gObj)) {
                    var uid = target.parentElement.getAttribute('data-uid');
                    rIndex = gObj.getRows().map(function (m) { return m.getAttribute('data-uid'); }).indexOf(uid);
                }
                else {
                    rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
                }
                if (this.parent.isPersistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
                    ++rIndex;
                }
                if (!this.mUPTarget || !this.mUPTarget.isEqualNode(target)) {
                    this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
                }
                this.parent.hoverFrozenRows(e);
                if (this.parent.isCheckBoxSelection) {
                    this.moveIntoUncheckCollection(sf.base.closest(target, '.e-row'));
                    this.setCheckAllState();
                }
            }
            if (!this.parent.isCheckBoxSelection && sf.base.Browser.isDevice && !this.isSingleSel()) {
                this.showPopup(e);
            }
        }
        else if (e.target.classList.contains('e-headercell') &&
            !e.target.classList.contains('e-stackedheadercell')) {
            var uid = e.target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            this.headerSelectionHandler(this.parent.getColumnIndexByUid(uid));
        }
        this.isMultiCtrlRequest = false;
        this.isMultiShiftRequest = false;
        if (sf.base.isNullOrUndefined(sf.base.closest(e.target, '.e-unboundcell'))) {
            this.preventFocus = false;
        }
    };
    Selection.prototype.popUpClickHandler = function (e) {
        var target = e.target;
        if (sf.base.closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
            sf.base.closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-rowselect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSelectMultiTouch = true;
                }
                else {
                    target.classList.remove('e-spanclicked');
                    this.enableSelectMultiTouch = false;
                    this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                }
            }
        }
        else {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.showPopup = function (e) {
        if (!this.selectionSettings.enableSimpleMultiRowSelection) {
            setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                (!this.isSingleSel() && (this.selectedRecords.length > (this.parent.getFrozenColumns() ? 2 : 1)
                    || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
        }
    };
    Selection.prototype.rowCellSelectionHandler = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            if (!this.isDragged) {
                this.selectRow(rowIndex, this.selectionSettings.enableToggle);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, this.selectionSettings.enableToggle);
            if (this.selectedRowCellIndexes.length) {
                this.updateAutoFillPosition();
            }
            this.drawBorders();
        }
        else if (this.isMultiShiftRequest) {
            if (this.parent.isCheckBoxSelection || (!this.parent.isCheckBoxSelection &&
                !sf.base.closest(this.target, '.e-rowcell').classList.contains('e-gridchkbox'))) {
                this.selectRowsByRange(sf.base.isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
            }
            else {
                this.addRowsToSelection([rowIndex]);
            }
            this.selectCellsByRange(sf.base.isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
            this.updateAutoFillPosition();
            this.drawBorders();
        }
        else {
            this.addRowsToSelection([rowIndex]);
            if (sf.base.isBlazor() && this.parent.enableVirtualization && this.parent.isServerRendered) {
                var rowIndexes = this.parent.getSelectedRowIndexes();
                var interopAdaptor = 'interopAdaptor';
                var invokeMethodAsync = 'invokeMethodAsync';
                this.parent[interopAdaptor][invokeMethodAsync]('MaintainSelection', true, 'normal', rowIndexes);
            }
            this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
            this.showHideBorders('none');
        }
        this.isDragged = false;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Selection.prototype.onCellFocused = function (e) {
        if (this.parent.frozenRows && e.container.isHeader && e.byKey) {
            if (e.keyArgs.action === 'upArrow') {
                if (this.parent.allowFiltering) {
                    e.isJump = e.element.tagName === 'INPUT' ? true : false;
                }
                else {
                    e.isJump = e.element.tagName === 'TH' ? true : false;
                }
            }
            else {
                if (e.keyArgs.action === 'downArrow') {
                    var rIdx = Number(e.element.parentElement.getAttribute('aria-rowindex'));
                    e.isJump = rIdx === 0 ? true : false;
                }
                else {
                    if (e.keyArgs.action === 'ctrlHome') {
                        e.isJump = true;
                    }
                }
            }
        }
        var clear = this.parent.isFrozenGrid() ? (((e.container.isHeader && e.element.tagName !== 'TD' && e.isJump &&
            !this.selectionSettings.allowColumnSelection) ||
            ((e.container.isContent || e.element.tagName === 'TD') && !(e.container.isSelectable || e.element.tagName === 'TD')))
            && !(e.byKey && e.keyArgs.action === 'space')) : ((e.container.isHeader && e.isJump) ||
            (e.container.isContent && !e.container.isSelectable)) && !(e.byKey && e.keyArgs.action === 'space')
            && !(e.element.classList.contains('e-detailrowexpand') || e.element.classList.contains('e-detailrowcollapse'));
        var headerAction = (e.container.isHeader && e.element.tagName !== 'TD' && !sf.base.closest(e.element, '.e-rowcell'))
            && !(e.byKey && e.keyArgs.action === 'space');
        if (!e.byKey || clear) {
            if (clear && !this.parent.isCheckBoxSelection) {
                this.clearSelection();
            }
            return;
        }
        var _a = e.container.isContent ? e.container.indexes : e.indexes, rowIndex = _a[0], cellIndex = _a[1];
        var prev = this.focus.getPrevIndexes();
        if (this.parent.frozenRows) {
            if (e.container.isHeader && (e.element.tagName === 'TD' || sf.base.closest(e.element, '.e-rowcell'))) {
                var thLen = this.parent.getHeaderTable().querySelector('thead').childElementCount;
                rowIndex -= thLen;
                prev.rowIndex = !sf.base.isNullOrUndefined(prev.rowIndex) ? prev.rowIndex - thLen : null;
            }
            else {
                rowIndex += this.parent.frozenRows;
                prev.rowIndex = prev.rowIndex === 0 || !sf.base.isNullOrUndefined(prev.rowIndex) ? prev.rowIndex + this.parent.frozenRows : null;
            }
        }
        if (this.parent.isFrozenGrid()) {
            var cIdx = Number(e.element.getAttribute('aria-colindex'));
            var selectedIndexes = this.parent.getSelectedRowCellIndexes();
            if (selectedIndexes.length && prev.cellIndex === 0) {
                prev.cellIndex = selectedIndexes[selectedIndexes.length - 1].cellIndexes[0];
            }
            prev.cellIndex = !sf.base.isNullOrUndefined(prev.cellIndex) ? (prev.cellIndex === cellIndex ? cIdx : cIdx - 1) : null;
            cellIndex = cIdx;
        }
        if ((headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 &&
            e.keyArgs.action !== 'space' && rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) &&
            !this.selectionSettings.allowColumnSelection) {
            return;
        }
        this.preventFocus = true;
        var columnIndex = this.getKeyColIndex(e);
        if (this.needColumnSelection) {
            cellIndex = columnIndex;
        }
        switch (e.keyArgs.action) {
            case 'downArrow':
            case 'upArrow':
            case 'enter':
            case 'shiftEnter':
                this.target = e.element;
                this.applyDownUpKey(rowIndex, cellIndex);
                break;
            case 'rightArrow':
            case 'leftArrow':
                this.applyRightLeftKey(rowIndex, cellIndex);
                break;
            case 'shiftDown':
            case 'shiftUp':
                this.shiftDownKey(rowIndex, cellIndex);
                break;
            case 'shiftLeft':
            case 'shiftRight':
                this.applyShiftLeftRightKey(rowIndex, cellIndex);
                break;
            case 'home':
            case 'end':
                cellIndex = e.keyArgs.action === 'end' ? this.getLastColIndex(rowIndex) : 0;
                this.applyHomeEndKey(rowIndex, cellIndex);
                break;
            case 'ctrlHome':
            case 'ctrlEnd':
                this.applyCtrlHomeEndKey(rowIndex, cellIndex);
                break;
            case 'escape':
                this.clearSelection();
                break;
            case 'ctrlPlusA':
                this.ctrlPlusA();
                break;
            case 'space':
                this.applySpaceSelection(e.element);
                break;
            case 'tab':
                if (this.parent.editSettings.allowNextRowEdit) {
                    this.selectRow(rowIndex);
                }
                break;
        }
        this.needColumnSelection = false;
        this.preventFocus = false;
        this.positionBorders();
        this.updateAutoFillPosition();
    };
    Selection.prototype.getKeyColIndex = function (e) {
        var uid;
        var index = null;
        var stackedHeader = e.element.querySelector('.e-stackedheadercelldiv');
        if (this.selectionSettings.allowColumnSelection && parentsUntil(e.element, 'e-columnheader')) {
            this.needColumnSelection = e.container.isHeader ? true : false;
            if (stackedHeader) {
                if (e.keyArgs.action === 'rightArrow' || e.keyArgs.action === 'leftArrow') {
                    return index;
                }
                uid = stackedHeader.getAttribute('e-mappinguid');
                var innerColumn = this.getstackedColumns(this.parent.getColumnByUid(uid).columns);
                var lastIndex = this.parent.getColumnIndexByUid(innerColumn[innerColumn.length - 1].uid);
                var firstIndex = this.parent.getColumnIndexByUid(innerColumn[0].uid);
                index = this.prevColIndex >= lastIndex ? firstIndex : lastIndex;
            }
            else {
                index = this.parent.getColumnIndexByUid(e.element
                    .querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
            }
        }
        return index;
    };
    /**
     * Apply ctrl + A key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.ctrlPlusA = function () {
        if (this.isRowType() && !this.isSingleSel()) {
            this.selectRowsByRange(0, this.getCurrentBatchRecordChanges().length - 1);
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        }
    };
    Selection.prototype.applySpaceSelection = function (target) {
        if (target.classList.contains('e-checkselectall')) {
            this.checkedTarget = target;
            this.checkSelectAll(this.checkedTarget);
        }
        else {
            if (target.classList.contains('e-checkselect')) {
                this.checkedTarget = target;
                this.checkSelect(this.checkedTarget);
            }
        }
    };
    Selection.prototype.applyDownUpKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.parent.isCheckBoxSelection && this.parent.checkAllRows === 'Check' && !this.selectionSettings.persistSelection) {
            this.checkSelectAllAction(false);
            this.checkedTarget = null;
        }
        if (this.isRowType()) {
            if (this.parent.frozenRows) {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            }
            else {
                this.selectRow(rowIndex, true);
                this.applyUpDown(gObj.selectedRowIndex);
            }
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        }
    };
    Selection.prototype.applyUpDown = function (rowIndex) {
        if (rowIndex < 0) {
            return;
        }
        if (!this.target) {
            this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
        }
        var cIndex = parseInt(this.target.getAttribute('aria-colindex'), 10);
        var frzCols = this.parent.getFrozenColumns();
        if (frzCols) {
            if (cIndex >= frzCols) {
                this.target =
                    this.contentRenderer.getMovableRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex - frzCols];
            }
            else {
                this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
            }
        }
        else {
            this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
        }
        this.addAttribute(this.target);
    };
    Selection.prototype.applyRightLeftKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumn(cellIndex);
        }
        else if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
            this.addAttribute(this.target);
        }
    };
    Selection.prototype.applyHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        else {
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
    };
    /**
     * Apply shift+down key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.shiftDownKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!sf.base.isUndefined(this.prevRowIndex)) {
                this.selectRowsByRange(this.prevRowIndex, rowIndex);
                this.applyUpDown(rowIndex);
            }
            else {
                this.selectRow(0, true);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.applyShiftLeftRightKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        if (this.selectionSettings.allowColumnSelection && this.needColumnSelection) {
            this.selectColumnsByRange(this.prevColIndex, cellIndex);
        }
        else {
            this.selectCellsByRange(this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.getstackedColumns = function (column) {
        var innerColumnIndexes = [];
        for (var i = 0, len = column.length; i < len; i++) {
            if (column[i].columns) {
                this.getstackedColumns(column[i].columns);
            }
            else {
                innerColumnIndexes.push(column[i]);
            }
        }
        return innerColumnIndexes;
    };
    Selection.prototype.applyCtrlHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
    };
    Selection.prototype.addRemoveClassesForRow = function (row, isAdd, clearAll) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (row) {
            var cells = [].slice.call(row.querySelectorAll('.e-rowcell'));
            var detailIndentCell = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            var dragdropIndentCell = row.querySelector('.e-rowdragdrop');
            if (detailIndentCell) {
                cells.push(detailIndentCell);
            }
            if (dragdropIndentCell) {
                cells.push(dragdropIndentCell);
            }
            addRemoveActiveClasses.apply(void 0, [cells, isAdd].concat(args));
        }
        this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
    };
    Selection.prototype.isRowType = function () {
        return this.selectionSettings.mode === 'Row' || this.selectionSettings.mode === 'Both';
    };
    Selection.prototype.isCellType = function () {
        return this.selectionSettings.mode === 'Cell' || this.selectionSettings.mode === 'Both';
    };
    Selection.prototype.isSingleSel = function () {
        return this.selectionSettings.type === 'Single';
    };
    Selection.prototype.getRenderer = function () {
        if (sf.base.isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    Selection.prototype.getSelectedRecords = function () {
        var selectedData = [];
        if (!this.selectionSettings.persistSelection) {
            selectedData = this.parent.getRowsObject().filter(function (row) { return row.isSelected; })
                .map(function (m) { return m.data; });
        }
        else {
            selectedData = this.persistSelectedData;
        }
        return selectedData;
    };
    /**
     * Select the column by passing start column index
     * @param  {number} startIndex
     */
    Selection.prototype.selectColumn = function (index) {
        var gObj = this.parent;
        if (sf.base.isNullOrUndefined(gObj.getColumns()[index])) {
            return;
        }
        var column = gObj.getColumnByIndex(index);
        var selectedCol = gObj.getColumnHeaderByUid(column.uid);
        var isColSelected = selectedCol.classList.contains('e-columnselection');
        if ((!gObj.selectionSettings.allowColumnSelection)) {
            return;
        }
        var isMultiColumns = this.selectedColumnsIndexes.length > 1 &&
            this.selectedColumnsIndexes.indexOf(index) > -1;
        this.clearColDependency();
        if (!isColSelected || !this.selectionSettings.enableToggle || isMultiColumns) {
            var args = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(args, columnSelecting);
            if (args.cancel) {
                this.disableInteracted();
                return;
            }
            if (!(gObj.selectionSettings.enableToggle && index === this.prevColIndex && isColSelected) || isMultiColumns) {
                this.updateColSelection(selectedCol, index);
            }
            var selectedArgs = {
                columnIndex: index, headerCell: selectedCol,
                column: column,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, columnSelected);
        }
        this.updateColProps(index);
    };
    /**
     * Select the columns by passing start and end column index
     * @param  {number} startIndex
     * @param  {number} endIndex
     */
    Selection.prototype.selectColumnsByRange = function (startIndex, endIndex) {
        var gObj = this.parent;
        if (sf.base.isNullOrUndefined(gObj.getColumns()[startIndex])) {
            return;
        }
        var indexes = [];
        if (gObj.selectionSettings.type === 'Single' || sf.base.isNullOrUndefined(endIndex)) {
            indexes[0] = startIndex;
        }
        else {
            var min = startIndex < endIndex;
            for (var i = startIndex; min ? i <= endIndex : i >= endIndex; min ? i++ : i--) {
                indexes.push(i);
            }
        }
        this.selectColumns(indexes);
    };
    /**
     * Select the columns by passing column indexes
     * @param  {number[]} columnIndexes
     */
    Selection.prototype.selectColumns = function (columnIndexes) {
        var gObj = this.parent;
        var selectedCol = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            columnIndexes = [columnIndexes[0]];
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        this.clearColDependency();
        var selectingArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            cancel: false, target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
        };
        this.onActionBegin(selectingArgs, columnSelecting);
        if (selectingArgs.cancel) {
            this.disableInteracted();
            return;
        }
        for (var i = 0, len = columnIndexes.length; i < len; i++) {
            this.updateColSelection(gObj.getColumnHeaderByUid(gObj.getColumnByIndex(columnIndexes[i]).uid), columnIndexes[i]);
        }
        selectedCol = this.getselectedCols();
        var selectedArgs = {
            columnIndex: columnIndexes[0], headerCell: selectedCol,
            columnIndexes: columnIndexes,
            column: gObj.getColumnByIndex(columnIndexes[0]),
            target: this.actualTarget,
            isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
        };
        this.onActionComplete(selectedArgs, columnSelected);
        this.updateColProps(columnIndexes[0]);
    };
    /**
     * Select the column with existing column by passing column index
     * @param  {number} startIndex
     */
    Selection.prototype.selectColumnWithExisting = function (startIndex) {
        var gObj = this.parent;
        if (sf.base.isNullOrUndefined(gObj.getColumns()[startIndex])) {
            return;
        }
        var frzCols = gObj.getFrozenColumns();
        var isFreeze = frzCols && startIndex >= frzCols;
        var newCol = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(startIndex).uid);
        var selectedCol = this.getselectedCols();
        if (gObj.selectionSettings.type === 'Single') {
            this.clearColDependency();
        }
        if (!gObj.selectionSettings.allowColumnSelection) {
            return;
        }
        var rows = !isFreeze ? gObj.getDataRows() : gObj.getMovableRows();
        if (this.selectedColumnsIndexes.indexOf(startIndex) > -1) {
            this.clearColumnSelection(startIndex);
        }
        else {
            var selectingArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: gObj.getColumnByIndex(startIndex),
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            };
            this.onActionBegin(selectingArgs, columnSelecting);
            if (selectingArgs.cancel) {
                this.disableInteracted();
                return;
            }
            this.updateColSelection(newCol, startIndex);
            selectedCol = this.getselectedCols();
            var selectedArgs = {
                columnIndex: startIndex, headerCell: selectedCol,
                column: gObj.getColumnByIndex(startIndex),
                columnIndexes: this.selectedColumnsIndexes,
                target: this.actualTarget,
                isInteracted: this.isInteracted, previousColumnIndex: this.prevColIndex
            };
            this.onActionComplete(selectedArgs, columnSelected);
        }
        this.updateColProps(startIndex);
    };
    /**
     * Clear the column selection
     */
    Selection.prototype.clearColumnSelection = function (clearIndex) {
        if (this.isColumnSelected) {
            var gObj = this.parent;
            if (!sf.base.isNullOrUndefined(clearIndex) && this.selectedColumnsIndexes.indexOf(clearIndex) === -1) {
                return;
            }
            var index = !sf.base.isNullOrUndefined(clearIndex) ? clearIndex :
                this.selectedColumnsIndexes[this.selectedColumnsIndexes.length - 1];
            var col = gObj.getColumnByIndex(index);
            var selectedCol = void 0;
            var column = gObj.getColumnByIndex(index);
            if (col.getFreezeTableName() === 'frozen-right') {
                selectedCol = gObj.getFrozenRightColumnHeaderByIndex(index);
            }
            else if (col.getFreezeTableName() === 'movable') {
                selectedCol = gObj.getMovableColumnHeaderByIndex(index);
            }
            else {
                selectedCol = gObj.getColumnHeaderByUid(column.uid);
            }
            var deselectedArgs = {
                columnIndex: index, headerCell: selectedCol,
                columnIndexes: this.selectedColumnsIndexes,
                column: column,
                cancel: false, target: this.actualTarget,
                isInteracted: this.isInteracted
            };
            var isCanceled = this.columnDeselect(deselectedArgs, columnDeselecting);
            if (isCanceled) {
                this.disableInteracted();
                return;
            }
            var selectedHeader = !sf.base.isNullOrUndefined(clearIndex) ? [selectedCol] :
                [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnselection'));
            var selectedCells = this.getSelectedColumnCells(clearIndex);
            for (var i = 0, len = selectedHeader.length; i < len; i++) {
                addRemoveActiveClasses([selectedHeader[i]], false, 'e-columnselection');
            }
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                addRemoveActiveClasses([selectedCells[i]], false, 'e-columnselection');
            }
            if (!sf.base.isNullOrUndefined(clearIndex)) {
                this.selectedColumnsIndexes.splice(this.selectedColumnsIndexes.indexOf(clearIndex), 1);
                this.parent.getColumns()[clearIndex].isSelected = false;
            }
            else {
                this.columnDeselect(deselectedArgs, columnDeselected);
                this.selectedColumnsIndexes = [];
                this.isColumnSelected = false;
                this.parent.getColumns().filter(function (col) { return col.isSelected = false; });
            }
        }
    };
    Selection.prototype.getselectedCols = function () {
        var gObj = this.parent;
        var selectedCol;
        if (this.selectedColumnsIndexes.length > 1) {
            selectedCol = [];
            for (var i = 0; i < this.selectedColumnsIndexes.length; i++) {
                (selectedCol).push(gObj.getColumnHeaderByUid(gObj.getColumnByIndex(this.selectedColumnsIndexes[i]).uid));
            }
        }
        else {
            selectedCol = gObj.getColumnHeaderByUid(gObj.getColumnByIndex(this.selectedColumnsIndexes[0]).uid);
        }
        return selectedCol;
    };
    Selection.prototype.getSelectedColumnCells = function (clearIndex) {
        var gObj = this.parent;
        var isRowTemplate = !sf.base.isNullOrUndefined(this.parent.rowTemplate);
        var rows = isRowTemplate ? gObj.getRows() : gObj.getDataRows();
        var movableRows;
        var frRows;
        if (gObj.isFrozenGrid() && gObj.getContent().querySelector('.e-movablecontent')) {
            movableRows = isRowTemplate ? gObj.getMovableRows() : gObj.getMovableDataRows();
            rows = gObj.addMovableRows(rows, movableRows);
            if (gObj.getFrozenMode() === 'Left-Right') {
                frRows = isRowTemplate ? gObj.getFrozenRightRows() : gObj.getFrozenRightDataRows();
                rows = gObj.addMovableRows(rows, frRows);
            }
        }
        var seletedcells = [];
        var selectionString = !sf.base.isNullOrUndefined(clearIndex) ? '[aria-colindex="' + clearIndex + '"]' : '.e-columnselection';
        for (var i = 0, len = rows.length; i < len; i++) {
            seletedcells = seletedcells.concat([].slice.call(rows[i].querySelectorAll(selectionString)));
        }
        return seletedcells;
    };
    Selection.prototype.columnDeselect = function (args, event) {
        if (event === 'columnDeselected') {
            delete args.cancel;
        }
        this.onActionComplete(args, event);
        return args.cancel;
    };
    Selection.prototype.updateColProps = function (startIndex) {
        this.prevColIndex = startIndex;
        this.isColumnSelected = this.selectedColumnsIndexes.length && true;
    };
    Selection.prototype.clearColDependency = function () {
        this.clearColumnSelection();
        this.selectedColumnsIndexes = [];
    };
    Selection.prototype.updateColSelection = function (selectedCol, startIndex) {
        if (sf.base.isNullOrUndefined(this.parent.getColumns()[startIndex])) {
            return;
        }
        var left = this.parent.getFrozenLeftCount();
        var movable = this.parent.getMovableColumnsCount();
        var col = this.parent.getColumnByIndex(startIndex);
        var isRowTemplate = !sf.base.isNullOrUndefined(this.parent.rowTemplate);
        var rows;
        this.selectedColumnsIndexes.push(startIndex);
        this.parent.getColumns()[startIndex].isSelected = true;
        if (col.getFreezeTableName() === 'frozen-right') {
            startIndex = startIndex - (left + movable);
            rows = isRowTemplate ? this.parent.getFrozenRightRows() : this.parent.getFrozenRightDataRows();
        }
        else if (col.getFreezeTableName() === 'movable') {
            startIndex = startIndex - left;
            rows = isRowTemplate ? this.parent.getMovableRows() : this.parent.getMovableDataRows();
        }
        else {
            startIndex = startIndex + this.parent.getIndentCount();
            rows = isRowTemplate ? this.parent.getRows() : this.parent.getDataRows();
        }
        addRemoveActiveClasses([selectedCol], true, 'e-columnselection');
        for (var j = 0, len = rows.length; j < len; j++) {
            if (rows[j].classList.contains('e-row')) {
                if ((rows[j].classList.contains('e-editedrow') || rows[j].classList.contains('e-addedrow')) &&
                    this.parent.editSettings.mode === 'Normal' && !sf.base.isNullOrUndefined(rows[j].querySelector('tr').childNodes[startIndex])) {
                    addRemoveActiveClasses([rows[j].querySelector('tr').childNodes[startIndex]], true, 'e-columnselection');
                }
                else if (!sf.base.isNullOrUndefined(rows[j].childNodes[startIndex])) {
                    addRemoveActiveClasses([rows[j].childNodes[startIndex]], true, 'e-columnselection');
                }
            }
        }
    };
    Selection.prototype.headerSelectionHandler = function (colIndex) {
        if ((!this.isMultiCtrlRequest && !this.isMultiShiftRequest) || this.isSingleSel()) {
            this.selectColumn(colIndex);
        }
        else if (this.isMultiShiftRequest) {
            this.selectColumnsByRange(sf.base.isUndefined(this.prevColIndex) ? colIndex : this.prevColIndex, colIndex);
        }
        else {
            this.selectColumnWithExisting(colIndex);
        }
    };
    Selection.prototype.addEventListener_checkbox = function () {
        var _this = this;
        this.parent.on(dataReady, this.dataReady, this);
        this.onDataBoundFunction = this.onDataBound.bind(this);
        this.parent.addEventListener(dataBound, this.onDataBoundFunction);
        this.parent.on(contentReady, this.checkBoxSelectionChanged, this);
        this.parent.on(beforeRefreshOnDataChange, this.initPerisistSelection, this);
        this.parent.on(onEmpty, this.setCheckAllForEmptyGrid, this);
        this.actionCompleteFunc = this.actionCompleteHandler.bind(this);
        this.parent.addEventListener(actionComplete, this.actionCompleteFunc);
        this.parent.on(click, this.clickHandler, this);
        this.resizeEndFn = function () {
            _this.updateAutoFillPosition();
            _this.drawBorders();
        };
        this.resizeEndFn.bind(this);
        this.parent.addEventListener(resizeStop, this.resizeEndFn);
    };
    Selection.prototype.removeEventListener_checkbox = function () {
        this.parent.off(dataReady, this.dataReady);
        this.parent.removeEventListener(dataBound, this.onDataBoundFunction);
        this.parent.removeEventListener(actionComplete, this.actionCompleteFunc);
        this.parent.off(onEmpty, this.setCheckAllForEmptyGrid);
        this.parent.off(click, this.clickHandler);
        this.parent.off(beforeRefreshOnDataChange, this.initPerisistSelection);
    };
    Selection.prototype.setCheckAllForEmptyGrid = function () {
        var checkAllBox = this.getCheckAllBox();
        if (checkAllBox) {
            this.parent.isCheckBoxSelection = true;
            var spanEle = checkAllBox.nextElementSibling;
            sf.base.removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
        }
    };
    Selection.prototype.dataReady = function (e) {
        this.isHeaderCheckboxClicked = false;
        var isInfinitecroll = this.parent.enableInfiniteScrolling && e.requestType === 'infiniteScroll';
        if (e.requestType !== 'virtualscroll' && !this.parent.isPersistSelection && !isInfinitecroll) {
            this.disableUI = !this.parent.enableImmutableMode;
            this.clearSelection();
            this.setCheckAllState();
            this.disableUI = false;
        }
    };
    Selection.prototype.actionCompleteHandler = function (e) {
        if (e.requestType === 'save' && this.parent.isPersistSelection) {
            this.refreshPersistSelection();
        }
    };
    Selection.prototype.selectRowIndex = function (index) {
        this.parent.isSelectedRowIndexUpdating = true;
        this.parent.selectedRowIndex = index;
    };
    Selection.prototype.disableInteracted = function () {
        this.isInteracted = false;
    };
    Selection.prototype.activeTarget = function () {
        this.actualTarget = this.isInteracted ? this.actualTarget : null;
    };
    return Selection;
}());

/**
 * The `Search` module is used to handle search action.
 */
var Search = /** @class */ (function () {
    /**
     * Constructor for Grid search module.
     * @hidden
     */
    function Search(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Searches Grid records by given key.
     *
     * > You can customize the default search action by using [`searchSettings`](grid/#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    Search.prototype.search = function (searchString) {
        var gObj = this.parent;
        searchString = sf.base.isNullOrUndefined(searchString) ? '' : searchString;
        if (isActionPrevent(gObj)) {
            gObj.notify(preventBatch, { instance: this, handler: this.search, arg1: searchString });
            return;
        }
        if (searchString !== gObj.searchSettings.key) {
            gObj.searchSettings.key = searchString.toString();
            gObj.dataBind();
        }
        else if (this.refreshSearch) {
            gObj.refresh();
        }
    };
    /**
     * @hidden
     */
    Search.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(searchComplete, this.onSearchComplete, this);
        this.parent.on(destroy, this.destroy, this);
        this.actionCompleteFunc = this.onActionComplete.bind(this);
        this.parent.addEventListener(actionComplete, this.actionCompleteFunc);
        this.parent.on(cancelBegin, this.cancelBeginEvent, this);
    };
    /**
     * @hidden
     */
    Search.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(searchComplete, this.onSearchComplete);
        this.parent.off(destroy, this.destroy);
        this.parent.removeEventListener(actionComplete, this.actionCompleteFunc);
        this.parent.off(cancelBegin, this.cancelBeginEvent);
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    Search.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * @hidden
     */
    Search.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (!sf.base.isNullOrUndefined(e.properties.key)) {
            this.parent.notify(modelChanged, {
                requestType: 'searching', type: actionBegin, searchString: this.parent.searchSettings.key
            });
        }
        else {
            this.parent.notify(modelChanged, {
                requestType: 'searching', type: actionBegin
            });
        }
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Search.prototype.onSearchComplete = function (e) {
        if (sf.base.isBlazor() && !this.parent.isJsComponent) {
            e.rows = null;
        }
        this.parent.trigger(actionComplete, sf.base.extend(e, {
            searchString: this.parent.searchSettings.key, requestType: 'searching', type: actionComplete
        }));
    };
    Search.prototype.onActionComplete = function (e) {
        this.refreshSearch = e.requestType !== 'searching';
    };
    Search.prototype.cancelBeginEvent = function (e) {
        if (e.requestType === 'searching') {
            this.parent.setProperties({ searchSettings: { key: '' } }, true);
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Search.prototype.getModuleName = function () {
        return 'search';
    };
    return Search;
}());

/**
 * The `ShowHide` module is used to control column visibility.
 */
var ShowHide = /** @class */ (function () {
    /**
     * Constructor for the show hide module.
     * @hidden
     */
    function ShowHide(parent) {
        this.parent = parent;
    }
    /**
     * Shows a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to show.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    ShowHide.prototype.show = function (columnName, showBy) {
        var keys = this.getToggleFields(columnName);
        var columns = this.getColumns(keys, showBy);
        this.parent.notify(tooltipDestroy, { module: 'edit' });
        for (var i = 0; i < columns.length; i++) {
            columns[i].visible = true;
        }
        this.setVisible(columns);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} columnName - Defines a single or collection of column names to hide.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    ShowHide.prototype.hide = function (columnName, hideBy) {
        var keys = this.getToggleFields(columnName);
        var columns = this.getColumns(keys, hideBy);
        this.parent.notify(tooltipDestroy, { module: 'edit' });
        for (var i = 0; i < columns.length; i++) {
            columns[i].visible = false;
        }
        this.setVisible(columns);
    };
    ShowHide.prototype.getToggleFields = function (key) {
        var finalized = [];
        if (typeof key === 'string') {
            finalized = [key];
        }
        else {
            finalized = key;
        }
        return finalized;
    };
    ShowHide.prototype.getColumns = function (keys, getKeyBy) {
        var _this = this;
        var columns = iterateArrayOrObject(keys, function (key, index) {
            return iterateArrayOrObject(_this.parent.columnModel, function (item, index) {
                if (item[getKeyBy] === key) {
                    return item;
                }
                return undefined;
            })[0];
        });
        return columns;
    };
    /**
     * Shows or hides columns by given column collection.
     * @private
     * @param  {Column[]} columns - Specifies the columns.
     * @return {void}
     */
    ShowHide.prototype.setVisible = function (columns, changedStateColumns) {
        var _this = this;
        if (changedStateColumns === void 0) { changedStateColumns = []; }
        changedStateColumns = (changedStateColumns.length > 0) ? changedStateColumns :
            sf.base.isBlazor() ? (JSON.parse(JSON.stringify(columns))) : columns;
        var args = {
            requestType: 'columnstate',
            cancel: false,
            columns: changedStateColumns
        };
        var cancel = 'cancel';
        this.parent.trigger(actionBegin, args, function (showHideArgs) {
            var currentViewCols = _this.parent.getColumns();
            columns = sf.base.isNullOrUndefined(columns) ? currentViewCols : columns;
            if (showHideArgs[cancel]) {
                _this.parent.notify(resetColumns, { showHideArgs: showHideArgs });
                if (columns.length > 0) {
                    columns[0].visible = true;
                }
                return;
            }
            if (_this.parent.allowSelection && _this.parent.getSelectedRecords().length) {
                _this.parent.clearSelection();
            }
            if (_this.parent.enableColumnVirtualization) {
                var colsInCurrentView = columns.filter(function (col1) { return (currentViewCols.some(function (col2) { return col1.field === col2.field; })); });
                if (colsInCurrentView.length) {
                    _this.parent.notify(columnVisibilityChanged, columns);
                }
            }
            else {
                _this.parent.notify(columnVisibilityChanged, columns);
            }
            var params = {
                requestType: 'columnstate',
                columns: changedStateColumns
            };
            _this.parent.trigger(actionComplete, params);
            if (_this.parent.columnQueryMode !== 'All') {
                _this.parent.refresh();
            }
        });
    };
    return ShowHide;
}());

/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    function Scroll(parent) {
        this.lastScrollTop = 0;
        //To maintain scroll state on grid actions.
        this.previousValues = { top: 0, left: 0 };
        this.oneTimeReady = true;
        this.parent = parent;
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    /**
     * @hidden
     */
    Scroll.prototype.setWidth = function (uiupdate) {
        this.parent.element.style.width = sf.base.formatUnit(this.parent.width);
        if (uiupdate) {
            this.widthService.setWidthToColumns();
        }
        if (this.parent.toolbarModule && this.parent.toolbarModule.toolbar &&
            this.parent.toolbarModule.toolbar.element) {
            this.parent.toolbarModule.toolbar.refreshOverflow();
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.setHeight = function () {
        var mHdrHeight = 0;
        var content = this.parent.getContent().querySelector('.e-content');
        var height = this.parent.height;
        if (this.parent.isFrozenGrid() && this.parent.height !== 'auto' && this.parent.height.toString().indexOf('%') < 0) {
            height = parseInt(height, 10) - Scroll.getScrollBarWidth();
        }
        if (!this.parent.enableVirtualization && this.parent.frozenRows && this.parent.height !== 'auto') {
            var tbody = this.parent.getHeaderContent().querySelector('tbody');
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            if (tbody && mHdrHeight) {
                var add = tbody.querySelectorAll('.e-addedrow').length;
                var height_1 = add * this.parent.getRowHeight();
                mHdrHeight -= height_1;
            }
            content.style.height = sf.base.formatUnit(height - mHdrHeight);
        }
        else {
            content.style.height = sf.base.formatUnit(height);
        }
        this.ensureOverflow(content);
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        var content = this.parent.getHeaderContent();
        var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
        var cssProps = this.getCssProperties();
        var padding = this.parent.getFrozenMode() === 'Right' || this.parent.getFrozenMode() === 'Left-Right' ? '0.5px' : '1px';
        content.querySelector('.e-headercontent').style[cssProps.border] = scrollWidth > 0 ? padding : '0px';
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
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
        if (footerDiv && footerDiv.classList.contains('e-footerpadding')) {
            footerDiv.classList.remove('e-footerpadding');
        }
    };
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *
     * > The [`height`](grid/#height/) must be set to 100%.
     * @return
     */
    Scroll.prototype.refresh = function () {
        if (this.parent.height !== '100%') {
            return;
        }
        var content = this.parent.getContent();
        this.parent.element.style.height = '100%';
        var height = this.widthService.getSiblingsHeight(content);
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
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(onEmpty, this.wireEvents, this);
        this.parent.on(contentReady, this.wireEvents, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
        this.parent.on(textWrapRefresh, this.wireEvents, this);
        this.parent.on(headerRefreshed, this.setScrollLeft, this);
    };
    /**
     * @hidden
     */
    Scroll.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(onEmpty, this.wireEvents);
        this.parent.off(contentReady, this.wireEvents);
        this.parent.off(uiUpdate, this.onPropertyChanged);
        this.parent.off(textWrapRefresh, this.wireEvents);
        this.parent.off(headerRefreshed, this.setScrollLeft);
    };
    Scroll.prototype.setScrollLeft = function () {
        if (this.parent.isFrozenGrid()) {
            this.parent.headerModule.getMovableHeader().scrollLeft = this.previousValues.left;
        }
        else {
            this.parent.getHeaderContent().querySelector('.e-headercontent').scrollLeft = this.previousValues.left;
        }
    };
    Scroll.prototype.onFrozenContentScroll = function () {
        var _this = this;
        return function (e) {
            if (_this.content.querySelector('tbody') === null || _this.parent.isPreventScrollEvent) {
                return;
            }
            if (!sf.base.isNullOrUndefined(_this.parent.infiniteScrollModule) && _this.parent.enableInfiniteScrolling) {
                _this.parent.notify(infiniteScrollHandler, e);
            }
            _this.previousValues.top = e.target.scrollTop;
        };
    };
    Scroll.prototype.onContentScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        var isHeader = element.classList.contains('e-headercontent');
        return function (e) {
            if (_this.content.querySelector('tbody') === null || _this.parent.isPreventScrollEvent) {
                return;
            }
            if (!sf.base.isNullOrUndefined(_this.parent.infiniteScrollModule) && _this.parent.enableInfiniteScrolling) {
                _this.parent.notify(infiniteScrollHandler, e);
            }
            if (_this.parent.groupSettings.columns.length && _this.parent.groupSettings.enableLazyLoading) {
                var isDown = _this.previousValues.top < _this.parent.getContent().firstElementChild.scrollTop;
                _this.parent.notify(lazyLoadScrollHandler, { scrollDown: isDown });
            }
            _this.parent.notify(virtualScrollEdit, {});
            var target = e.target;
            var left = target.scrollLeft;
            var sLimit = target.scrollWidth;
            var isFooter = target.classList.contains('e-summarycontent');
            if (_this.previousValues.left === left) {
                _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                return;
            }
            _this.parent.notify(closeFilterDialog, e);
            element.scrollLeft = left;
            if (isFooter) {
                _this.header.scrollLeft = left;
            }
            _this.previousValues.left = left;
            _this.parent.notify(scroll, { left: left });
        };
    };
    Scroll.prototype.onCustomScrollbarScroll = function (mCont, mHdr) {
        var _this = this;
        var content = mCont;
        var header = mHdr;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var target = e.target;
            var left = target.scrollLeft;
            if (_this.previousValues.left === left) {
                return;
            }
            content.scrollLeft = left;
            header.scrollLeft = left;
            _this.previousValues.left = left;
            _this.parent.notify(scroll, { left: left });
            if (_this.parent.isDestroyed) {
                return;
            }
        };
    };
    Scroll.prototype.onTouchScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var isFrozen = _this.parent.isFrozenGrid();
            var pageXY = _this.getPointXY(e);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            var mHdr = isFrozen ?
                _this.parent.getHeaderContent().querySelector('.e-movableheader') :
                _this.parent.getHeaderContent().querySelector('.e-headercontent');
            var mCont = isFrozen ?
                _this.parent.getContent().querySelector('.e-movablecontent') :
                _this.parent.getContent().querySelector('.e-content');
            if (_this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                return;
            }
            e.preventDefault();
            mHdr.scrollLeft = left;
            mCont.scrollLeft = left;
            if (isFrozen) {
                var scrollBar = _this.parent.getContent().querySelector('.e-movablescrollbar');
                scrollBar.scrollLeft = left;
            }
            _this.pageXY.x = pageXY.x;
            _this.previousValues.left = left;
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
            var frzCols = this.parent.isFrozenGrid();
            this.content = this.parent.getContent().querySelector('.e-content');
            this.header = this.parent.getHeaderContent().querySelector('.e-headercontent');
            var mCont = this.content.querySelector('.e-movablecontent');
            var fCont = this.content.querySelector('.e-frozencontent');
            var mHdr = this.header.querySelector('.e-movableheader');
            var mScrollBar = this.parent.getContent().querySelector('.e-movablescrollbar');
            if (this.parent.frozenRows) {
                sf.base.EventHandler.add(frzCols ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                sf.base.EventHandler.add(frzCols ? mHdr : this.header, 'touchmove pointermove', this.onTouchScroll(frzCols ? mCont : this.content), this);
            }
            if (this.parent.isFrozenGrid()) {
                sf.base.EventHandler.add(mScrollBar, 'scroll', this.onCustomScrollbarScroll(mCont, mHdr), this);
                sf.base.EventHandler.add(mCont, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mHdr), this);
                sf.base.EventHandler.add(mHdr, 'scroll', this.onCustomScrollbarScroll(mScrollBar, mCont), this);
                sf.base.EventHandler.add(this.content, 'scroll', this.onFrozenContentScroll(), this);
                sf.base.EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
                sf.base.EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mCont), this);
                sf.base.EventHandler.add(mCont, 'touchstart pointerdown', this.setPageXY(), this);
                sf.base.EventHandler.add(mCont, 'touchmove pointermove', this.onTouchScroll(mHdr), this);
            }
            else {
                sf.base.EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                sf.base.EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            }
            if (this.parent.aggregates.length) {
                sf.base.EventHandler.add(this.parent.getFooterContent().firstChild, 'scroll', this.onContentScroll(this.content), this);
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        var table = this.parent.getContentTable();
        var sLeft;
        var sHeight;
        var clientHeight;
        getUpdateUsingRaf(function () {
            sLeft = _this.header.scrollLeft;
            sHeight = table.scrollHeight;
            clientHeight = _this.parent.getContent().clientHeight;
        }, function () {
            var args = { cancel: false };
            _this.parent.notify(checkScrollReset, args);
            if (!_this.parent.enableVirtualization && !_this.parent.enableInfiniteScrolling) {
                if (sHeight < clientHeight) {
                    sf.base.addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    if (_this.parent.isFrozenGrid()) {
                        sf.base.addClass(_this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    }
                }
                if (!args.cancel) {
                    if ((_this.parent.frozenRows > 0 || _this.parent.isFrozenGrid()) && _this.header.querySelector('.e-movableheader')) {
                        _this.header.querySelector('.e-movableheader').scrollLeft = _this.previousValues.left;
                    }
                    else {
                        _this.header.scrollLeft = _this.previousValues.left;
                    }
                    _this.content.scrollLeft = _this.previousValues.left;
                    _this.content.scrollTop = _this.previousValues.top;
                }
            }
            if (!_this.parent.enableColumnVirtualization) {
                _this.content.scrollLeft = sLeft;
            }
            if (_this.parent.isFrozenGrid() && _this.header.querySelector('.e-movableheader')) {
                _this.header.querySelector('.e-movableheader').scrollLeft =
                    _this.content.querySelector('.e-movablecontent').scrollLeft;
            }
        });
        this.parent.isPreventScrollEvent = false;
    };
    /**
     * @hidden
     */
    Scroll.prototype.getCssProperties = function (rtl) {
        var css = {};
        var enableRtl = sf.base.isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    };
    Scroll.prototype.ensureOverflow = function (content) {
        content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
    };
    Scroll.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        this.setPadding();
        this.oneTimeReady = true;
        if (this.parent.height === 'auto') {
            this.removePadding();
        }
        this.wireEvents();
        this.setHeight();
        var width = 'width';
        this.setWidth(!sf.base.isNullOrUndefined(e.properties[width]));
    };
    /**
     * @hidden
     */
    Scroll.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.removeEventListener();
        //Remove padding
        this.removePadding();
        var cont = this.parent.getContent().querySelector('.e-content');
        sf.base.removeClass([this.parent.getHeaderContent().querySelector('.e-headercontent')], 'e-headercontent');
        sf.base.removeClass([cont], 'e-content');
        //Remove height
        cont.style.height = '';
        //Remove width
        this.parent.element.style.width = '';
        //Remove Dom event
        sf.base.EventHandler.remove(cont, 'scroll', this.onContentScroll);
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

var __extends$17 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Grid's aggregate column.
 */
var AggregateColumn = /** @class */ (function (_super) {
    __extends$17(AggregateColumn, _super);
    function AggregateColumn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.templateFn = {};
        return _this;
    }
    /**
     * @hidden
     */
    AggregateColumn.prototype.setFormatter = function (value) {
        this.formatFn = value;
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getFormatter = function () {
        return this.formatFn;
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.setTemplate = function (helper) {
        if (helper === void 0) { helper = {}; }
        if (this.footerTemplate !== undefined) {
            this.templateFn[sf.base.getEnumValue(CellType, CellType.Summary)] = { fn: sf.base.compile(this.footerTemplate, helper),
                property: 'footerTemplate' };
        }
        if (this.groupFooterTemplate !== undefined) {
            this.templateFn[sf.base.getEnumValue(CellType, CellType.GroupSummary)] = { fn: sf.base.compile(this.groupFooterTemplate, helper),
                property: 'groupFooterTemplate' };
        }
        if (this.groupCaptionTemplate !== undefined) {
            this.templateFn[sf.base.getEnumValue(CellType, CellType.CaptionSummary)] = { fn: sf.base.compile(this.groupCaptionTemplate, helper),
                property: 'groupCaptionTemplate' };
        }
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.getTemplate = function (type) {
        return this.templateFn[sf.base.getEnumValue(CellType, type)];
    };
    /**
     * @hidden
     */
    AggregateColumn.prototype.setPropertiesSilent = function (prop) {
        this.setProperties(prop, true);
    };
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "type", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "field", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "columnName", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "format", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "footerTemplate", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "groupFooterTemplate", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "groupCaptionTemplate", void 0);
    __decorate$5([
        sf.base.Property()
    ], AggregateColumn.prototype, "customAggregate", void 0);
    return AggregateColumn;
}(sf.base.ChildProperty));
/**
 * Configures the aggregate rows.
 */
var AggregateRow = /** @class */ (function (_super) {
    __extends$17(AggregateRow, _super);
    function AggregateRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Collection([], AggregateColumn)
    ], AggregateRow.prototype, "columns", void 0);
    return AggregateRow;
}(sf.base.ChildProperty));

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
var Clipboard = /** @class */ (function () {
    /**
     * Constructor for the Grid clipboard module
     * @hidden
     */
    function Clipboard(parent) {
        this.copyContent = '';
        this.isSelect = false;
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    Clipboard.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(contentReady, this.initialEnd, this);
        this.parent.on(keyPressed, this.keyDownHandler, this);
        this.parent.on(click, this.clickHandler, this);
        sf.base.EventHandler.add(this.parent.element, 'keydown', this.pasteHandler, this);
    };
    /**
     * @hidden
     */
    Clipboard.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(keyPressed, this.keyDownHandler);
        this.parent.off(contentReady, this.initialEnd);
        this.parent.off(click, this.clickHandler);
        sf.base.EventHandler.remove(this.parent.element, 'keydown', this.pasteHandler);
    };
    Clipboard.prototype.clickHandler = function (e) {
        var target = e.target;
        target = parentsUntil(target, 'e-rowcell');
    };
    Clipboard.prototype.pasteHandler = function (e) {
        var _this = this;
        var grid = this.parent;
        var isMacLike = /(Mac)/i.test(navigator.platform);
        if (e.keyCode === 86 && (e.ctrlKey || (isMacLike && e.metaKey)) && !grid.isEdit) {
            var target = sf.base.closest(document.activeElement, '.e-rowcell');
            if (!target || !grid.editSettings.allowEditing || grid.editSettings.mode !== 'Batch' ||
                grid.selectionSettings.mode !== 'Cell' || grid.selectionSettings.cellSelectionMode === 'Flow') {
                return;
            }
            this.activeElement = document.activeElement;
            this.clipBoardTextArea.value = '';
            var x_1 = window.scrollX;
            var y_1 = window.scrollY;
            this.clipBoardTextArea.focus();
            setTimeout(function () {
                _this.activeElement.focus();
                window.scrollTo(x_1, y_1);
                _this.paste(_this.clipBoardTextArea.value, _this.parent.getSelectedRowCellIndexes()[0].rowIndex, _this.parent.getSelectedRowCellIndexes()[0].cellIndexes[0]);
            }, 10);
        }
    };
    /**
     * Paste data from clipboard to selected cells.
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     */
    Clipboard.prototype.paste = function (data, rowIndex, colIndex) {
        var grid = this.parent;
        var cIdx = colIndex;
        var rIdx = rowIndex;
        var col;
        var value;
        var isAvail;
        if (!grid.editSettings.allowEditing || grid.editSettings.mode !== 'Batch' ||
            grid.selectionSettings.mode !== 'Cell' || grid.selectionSettings.cellSelectionMode === 'Flow') {
            return;
        }
        var rows = data.split('\n');
        var cols;
        var dataRows = grid.getDataRows();
        var mRows;
        var frRows;
        var isFrozen = this.parent.isFrozenGrid();
        if (isFrozen) {
            mRows = grid.getMovableDataRows();
            if (grid.getFrozenRightColumnsCount()) {
                frRows = grid.getFrozenRightDataRows();
            }
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
                    if (frRows && !isAvail) {
                        var frTr = frRows[rIdx];
                        isAvail = frTr.querySelector('[aria-colindex="' + cIdx + '"]');
                    }
                }
                if (!isAvail) {
                    cIdx++;
                    break;
                }
                col = grid.getColumnByIndex(cIdx);
                value = col.getParser() ? col.getParser()(cols[c]) : cols[c];
                if (col.allowEditing && !col.isPrimaryKey && !col.template) {
                    var args = {
                        column: col,
                        data: value,
                        rowIndex: rIdx
                    };
                    this.parent.trigger(beforePaste, args);
                    rIdx = args.rowIndex;
                    if (!args.cancel) {
                        if (grid.editModule) {
                            if (col.type === 'number') {
                                this.parent.editModule.updateCell(rIdx, col.field, parseFloat(args.data));
                            }
                            else {
                                grid.editModule.updateCell(rIdx, col.field, args.data);
                            }
                        }
                    }
                }
                cIdx++;
            }
            rIdx++;
        }
        grid.selectionModule.selectCellsByRange({ rowIndex: rowIndex, cellIndex: colIndex }, { rowIndex: rIdx - 1, cellIndex: cIdx - 1 });
        var cell = this.parent.getCellFromIndex(rIdx - 1, cIdx - 1);
        if (cell) {
            sf.base.classList(cell, ['e-focus', 'e-focused'], []);
        }
    };
    Clipboard.prototype.initialEnd = function () {
        this.parent.off(contentReady, this.initialEnd);
        this.clipBoardTextArea = this.parent.createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard' }
        });
        this.parent.element.appendChild(this.clipBoardTextArea);
    };
    Clipboard.prototype.keyDownHandler = function (e) {
        if (e.action === 'ctrlPlusC') {
            this.copy();
        }
        else if (e.action === 'ctrlShiftPlusH') {
            this.copy(true);
        }
    };
    Clipboard.prototype.setCopyData = function (withHeader) {
        if (window.getSelection().toString() === '') {
            var isFrozen = this.parent.isFrozenGrid();
            this.clipBoardTextArea.value = this.copyContent = '';
            var mRows = void 0;
            var frRows = void 0;
            var rows = this.parent.getRows();
            if (isFrozen) {
                mRows = this.parent.getMovableDataRows();
                if (this.parent.getFrozenMode() === 'Left-Right') {
                    frRows = this.parent.getFrozenRightRows();
                }
            }
            if (this.parent.selectionSettings.mode !== 'Cell') {
                var selectedIndexes = this.parent.getSelectedRowIndexes().sort(function (a, b) { return a - b; });
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
                        if (frRows) {
                            cells.push.apply(cells, [].slice.call(frRows[selectedIndexes[i]].querySelectorAll('.e-rowcell')));
                        }
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
                            cells.push.apply(cells, [].slice.call(mRows[obj.rowIndexes[i]]
                                .querySelectorAll('.e-cellselectionbackground')));
                            if (frRows) {
                                cells.push.apply(cells, [].slice.call(frRows[obj.rowIndexes[i]]
                                    .querySelectorAll('.e-cellselectionbackground')));
                            }
                        }
                        this.getCopyData(cells, false, '\t', withHeader);
                    }
                }
                else {
                    this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground')), true, '\n', withHeader);
                }
            }
            var args = {
                data: this.copyContent,
                cancel: false,
            };
            this.parent.trigger(beforeCopy, args);
            if (args.cancel) {
                return;
            }
            this.clipBoardTextArea.value = this.copyContent = args.data;
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
                    if (sf.base.isBlazor()) {
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
    /**
     * Copy selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header data need to be copied or not.
     */
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
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Clipboard.prototype.getModuleName = function () {
        return 'clipboard';
    };
    /**
     * To destroy the clipboard
     * @return {void}
     * @hidden
     */
    Clipboard.prototype.destroy = function () {
        this.removeEventListener();
        if (this.clipBoardTextArea) {
            sf.base.remove(this.clipBoardTextArea);
        }
    };
    Clipboard.prototype.checkBoxSelection = function () {
        var gridObj = this.parent;
        var obj = { status: false };
        if (gridObj.selectionSettings.mode === 'Cell') {
            var rowCellIndxes = gridObj.getSelectedRowCellIndexes();
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

var gridObserver = new sf.base.Observer();

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the field name and direction of sort column.
 */
var SortDescriptor = /** @class */ (function (_super) {
    __extends$1(SortDescriptor, _super);
    function SortDescriptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property()
    ], SortDescriptor.prototype, "field", void 0);
    __decorate$2([
        sf.base.Property()
    ], SortDescriptor.prototype, "direction", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SortDescriptor.prototype, "isFromGroup", void 0);
    return SortDescriptor;
}(sf.base.ChildProperty));
/**
 * Configures the sorting behavior of Grid.
 */
var SortSettings = /** @class */ (function (_super) {
    __extends$1(SortSettings, _super);
    function SortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Collection([], SortDescriptor)
    ], SortSettings.prototype, "columns", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], SortSettings.prototype, "allowUnsort", void 0);
    return SortSettings;
}(sf.base.ChildProperty));
/**
 * Represents the predicate for the filter column.
 */
var Predicate$1 = /** @class */ (function (_super) {
    __extends$1(Predicate$$1, _super);
    function Predicate$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "field", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "operator", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "value", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "matchCase", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Predicate$$1.prototype, "ignoreAccent", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "predicate", void 0);
    __decorate$2([
        sf.base.Property({})
    ], Predicate$$1.prototype, "actualFilterValue", void 0);
    __decorate$2([
        sf.base.Property({})
    ], Predicate$$1.prototype, "actualOperator", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "type", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "ejpredicate", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "uid", void 0);
    __decorate$2([
        sf.base.Property()
    ], Predicate$$1.prototype, "isForeignKey", void 0);
    return Predicate$$1;
}(sf.base.ChildProperty));
/**
 * Configures the infinite scroll behavior of Grid.
 */
var InfiniteScrollSettings = /** @class */ (function (_super) {
    __extends$1(InfiniteScrollSettings, _super);
    function InfiniteScrollSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], InfiniteScrollSettings.prototype, "enableCache", void 0);
    __decorate$2([
        sf.base.Property(3)
    ], InfiniteScrollSettings.prototype, "maxBlocks", void 0);
    __decorate$2([
        sf.base.Property(3)
    ], InfiniteScrollSettings.prototype, "initialBlocks", void 0);
    return InfiniteScrollSettings;
}(sf.base.ChildProperty));
/**
 * Configures the filtering behavior of the Grid.
 */
var FilterSettings = /** @class */ (function (_super) {
    __extends$1(FilterSettings, _super);
    function FilterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Collection([], Predicate$1)
    ], FilterSettings.prototype, "columns", void 0);
    __decorate$2([
        sf.base.Property('FilterBar')
    ], FilterSettings.prototype, "type", void 0);
    __decorate$2([
        sf.base.Property()
    ], FilterSettings.prototype, "mode", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], FilterSettings.prototype, "showFilterBarStatus", void 0);
    __decorate$2([
        sf.base.Property(1500)
    ], FilterSettings.prototype, "immediateModeDelay", void 0);
    __decorate$2([
        sf.base.Property()
    ], FilterSettings.prototype, "operators", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], FilterSettings.prototype, "ignoreAccent", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], FilterSettings.prototype, "enableCaseSensitivity", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], FilterSettings.prototype, "showFilterBarOperator", void 0);
    return FilterSettings;
}(sf.base.ChildProperty));
/**
 * Configures the selection behavior of the Grid.
 */
var SelectionSettings = /** @class */ (function (_super) {
    __extends$1(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Row')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate$2([
        sf.base.Property('Flow')
    ], SelectionSettings.prototype, "cellSelectionMode", void 0);
    __decorate$2([
        sf.base.Property('Single')
    ], SelectionSettings.prototype, "type", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "checkboxOnly", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "persistSelection", void 0);
    __decorate$2([
        sf.base.Property('Default')
    ], SelectionSettings.prototype, "checkboxMode", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "enableSimpleMultiRowSelection", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], SelectionSettings.prototype, "enableToggle", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "allowColumnSelection", void 0);
    return SelectionSettings;
}(sf.base.ChildProperty));
/**
 * Configures the search behavior of the Grid.
 */
var SearchSettings = /** @class */ (function (_super) {
    __extends$1(SearchSettings, _super);
    function SearchSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property([])
    ], SearchSettings.prototype, "fields", void 0);
    __decorate$2([
        sf.base.Property('')
    ], SearchSettings.prototype, "key", void 0);
    __decorate$2([
        sf.base.Property('contains')
    ], SearchSettings.prototype, "operator", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], SearchSettings.prototype, "ignoreCase", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], SearchSettings.prototype, "ignoreAccent", void 0);
    return SearchSettings;
}(sf.base.ChildProperty));
/**
 * Configures the row drop settings of the Grid.
 */
var RowDropSettings = /** @class */ (function (_super) {
    __extends$1(RowDropSettings, _super);
    function RowDropSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property()
    ], RowDropSettings.prototype, "targetID", void 0);
    return RowDropSettings;
}(sf.base.ChildProperty));
/**
 * Configures the text wrap settings of the Grid.
 */
var TextWrapSettings = /** @class */ (function (_super) {
    __extends$1(TextWrapSettings, _super);
    function TextWrapSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Both')
    ], TextWrapSettings.prototype, "wrapMode", void 0);
    return TextWrapSettings;
}(sf.base.ChildProperty));
/**
 * Configures the resize behavior of the Grid.
 */
var ResizeSettings = /** @class */ (function (_super) {
    __extends$1(ResizeSettings, _super);
    function ResizeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Normal')
    ], ResizeSettings.prototype, "mode", void 0);
    return ResizeSettings;
}(sf.base.ChildProperty));
/**
 * Configures the group behavior of the Grid.
 */
var GroupSettings = /** @class */ (function (_super) {
    __extends$1(GroupSettings, _super);
    function GroupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(true)
    ], GroupSettings.prototype, "showDropArea", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], GroupSettings.prototype, "allowReordering", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], GroupSettings.prototype, "showToggleButton", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], GroupSettings.prototype, "showGroupedColumn", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], GroupSettings.prototype, "showUngroupButton", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], GroupSettings.prototype, "disablePageWiseAggregates", void 0);
    __decorate$2([
        sf.base.Property([])
    ], GroupSettings.prototype, "columns", void 0);
    __decorate$2([
        sf.base.Property()
    ], GroupSettings.prototype, "captionTemplate", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], GroupSettings.prototype, "enableLazyLoading", void 0);
    return GroupSettings;
}(sf.base.ChildProperty));
/**
 * Configures the edit behavior of the Grid.
 */
var EditSettings = /** @class */ (function (_super) {
    __extends$1(EditSettings, _super);
    function EditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], EditSettings.prototype, "allowAdding", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], EditSettings.prototype, "allowEditing", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], EditSettings.prototype, "allowDeleting", void 0);
    __decorate$2([
        sf.base.Property('Normal')
    ], EditSettings.prototype, "mode", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], EditSettings.prototype, "allowEditOnDblClick", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], EditSettings.prototype, "showConfirmDialog", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], EditSettings.prototype, "showDeleteConfirmDialog", void 0);
    __decorate$2([
        sf.base.Property('')
    ], EditSettings.prototype, "template", void 0);
    __decorate$2([
        sf.base.Property('')
    ], EditSettings.prototype, "headerTemplate", void 0);
    __decorate$2([
        sf.base.Property('')
    ], EditSettings.prototype, "footerTemplate", void 0);
    __decorate$2([
        sf.base.Property('Top')
    ], EditSettings.prototype, "newRowPosition", void 0);
    __decorate$2([
        sf.base.Property({})
    ], EditSettings.prototype, "dialog", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], EditSettings.prototype, "allowNextRowEdit", void 0);
    return EditSettings;
}(sf.base.ChildProperty));
/**
 * Represents the Grid component.
 * ```html
 * <div id="grid"></div>
 * <script>
 *  var gridObj = new Grid({ allowPaging: true });
 *  gridObj.appendTo("#grid");
 * </script>
 * ```
 */
var Grid = /** @class */ (function (_super) {
    __extends$1(Grid, _super);
    /**
     * Constructor for creating the component
     * @hidden
     */
    function Grid(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isPreventScrollEvent = false;
        _this.inViewIndexes = [];
        _this.keyA = false;
        _this.frozenRightCount = 0;
        _this.frozenLeftCount = 0;
        _this.tablesCount = 1;
        _this.movableCount = 0;
        _this.visibleFrozenLeft = 0;
        _this.visibleFrozenRight = 0;
        _this.visibleMovable = 0;
        _this.frozenLeftColumns = [];
        _this.frozenRightColumns = [];
        _this.movableColumns = [];
        _this.media = {};
        /** @hidden */
        _this.tableIndex = 0;
        _this.componentRefresh = sf.base.Component.prototype.refresh;
        /** @hidden */
        _this.isVirtualAdaptive = false;
        /** @hidden */
        _this.vRows = [];
        /** @hidden */
        _this.vcRows = [];
        /** @hidden */
        _this.vGroupOffsets = {};
        /** @hidden */
        _this.rowUid = 0;
        /**
         * Gets the currently visible records of the Grid.
         */
        _this.currentViewData = [];
        /** @hidden */
        _this.lockcolPositionCount = 0;
        /** @hidden */
        _this.prevPageMoving = false;
        /** @hidden */
        _this.pageTemplateChange = false;
        /** @hidden */
        _this.isAutoGen = false;
        _this.mediaBindInstance = {};
        /** @hidden */
        _this.commandDelIndex = undefined;
        /** @hidden */
        _this.asyncTimeOut = 50;
        // enable/disable logger for MVC & Core
        _this.enableLogger = true;
        _this.needsID = true;
        Grid_1.Inject(Selection);
        sf.base.setValue('mergePersistData', _this.mergePersistGridData, _this);
        return _this;
    }
    Grid_1 = Grid;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    Grid.prototype.getPersistData = function () {
        var keyEntity = ['pageSettings', 'sortSettings',
            'filterSettings', 'groupSettings', 'columns', 'searchSettings', 'selectedRowIndex', 'scrollPosition'];
        var ignoreOnPersist = {
            pageSettings: ['template', 'pageSizes', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent'],
            groupSettings: ['showDropArea', 'showToggleButton', 'showGroupedColumn', 'showUngroupButton',
                'disablePageWiseAggregates', 'hideCaptionCount'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: [], scrollPosition: []
        };
        for (var i = 0; i < keyEntity.length; i++) {
            var currentObject = this[keyEntity[i]];
            for (var _i = 0, _a = ignoreOnPersist[keyEntity[i]]; _i < _a.length; _i++) {
                var val = _a[_i];
                delete currentObject[val];
            }
        }
        this.pageSettings.template = undefined;
        /* tslint:disable-next-line:no-any */
        if (this.isAngular) {
            /* tslint:disable:no-string-literal */
            delete this.groupSettings['properties']['captionTemplate'];
        }
        this.pageTemplateChange = !sf.base.isNullOrUndefined(this.pagerTemplate);
        return this.addOnPersist(keyEntity);
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    // tslint:disable-next-line:max-func-body-length
    Grid.prototype.requiredModules = function () {
        this.setFrozenCount();
        var modules = [];
        if (this.isDestroyed) {
            return modules;
        }
        if (this.allowFiltering) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings, this.serviceLocator]
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this, this.serviceLocator]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this, this.sortSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings]
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this, this.selectionSettings, this.serviceLocator]
            });
        }
        modules.push({
            member: 'resize',
            args: [this]
        });
        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this]
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this]
            });
        }
        if (this.allowGrouping) {
            modules.push({
                member: 'group',
                args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator]
            });
        }
        if (this.aggregates.length) {
            modules.push({ member: 'aggregate', args: [this, this.serviceLocator] });
        }
        if (this.isDetail()) {
            modules.push({
                member: 'detailRow',
                args: [this, this.serviceLocator]
            });
        }
        if (this.toolbar || this.toolbarTemplate) {
            modules.push({
                member: 'toolbar',
                args: [this, this.serviceLocator]
            });
        }
        if (this.enableVirtualization || this.enableColumnVirtualization) {
            modules.push({
                member: 'virtualscroll',
                args: [this, this.serviceLocator]
            });
        }
        if (this.getFrozenColumns() || this.frozenRows || this.frozenRightCount || this.frozenLeftCount) {
            modules.push({ member: 'freeze', args: [this, this.serviceLocator] });
        }
        if (this.isCommandColumn(this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this, this.serviceLocator]
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this, this.serviceLocator]
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    };
    Grid.prototype.extendRequiredModules = function (modules) {
        if (this.enableInfiniteScrolling) {
            modules.push({
                member: 'infiniteScroll',
                args: [this, this.serviceLocator]
            });
        }
        if (this.groupSettings.enableLazyLoading) {
            modules.push({
                member: 'lazyLoadGroup',
                args: [this, this.serviceLocator]
            });
        }
        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator]
            });
        }
        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this, this.serviceLocator]
            });
        }
        if (this.showColumnChooser) {
            modules.push({
                member: 'columnChooser',
                args: [this, this.serviceLocator]
            });
        }
        if (this.isForeignKeyEnabled(this.columns)) {
            modules.push({ member: 'foreignKey', args: [this, this.serviceLocator] });
        }
        if (this.enableLogger) {
            modules.push({ member: 'logger', args: [this] });
        }
        if (sf.base.isBlazor()) {
            modules.push({ member: 'blazor', args: [this] });
        }
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    Grid.prototype.preRender = function () {
        this.serviceLocator = new ServiceLocator;
        this.initProperties();
        this.initializeServices();
    };
    Grid.prototype.initProperties = function () {
        /* tslint:disable */
        this.isInitial = true;
        this.sortedColumns = [];
        this.inViewIndexes = [];
        this.mediaCol = [];
        this.isInitialLoad = false;
        this.allowServerDataBinding = false;
        this.ignoreCollectionWatch = true;
        if (sf.base.isBlazor() && this.enableVirtualization && this.allowGrouping) {
            var isExpanded = 'isExpanded';
            this[isExpanded] = false;
        }
        this.mergeCells = {};
        this.isEdit = false;
        this.checkAllRows = 'None';
        this.isCheckBoxSelection = false;
        this.isPersistSelection = false;
        this.componentRefresh = sf.base.Component.prototype.refresh;
        this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
        };
        this.defaultLocale = {
            EmptyRecord: 'No records to display',
            True: 'true',
            False: 'false',
            InvalidFilterMessage: 'Invalid Filter Data',
            GroupDropArea: 'Drag a column header here to group its column',
            UnGroup: 'Click here to ungroup',
            UnGroupButton: 'Click here to ungroup',
            GroupDisable: 'Grouping is disabled for this column',
            FilterbarTitle: '\'s filter bar cell',
            EmptyDataSourceError: 'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid',
            // Toolbar Items
            Add: 'Add',
            Edit: 'Edit',
            Cancel: 'Cancel',
            Update: 'Update',
            Delete: 'Delete',
            Print: 'Print',
            Pdfexport: 'PDF Export',
            Excelexport: 'Excel Export',
            Wordexport: 'Word Export',
            Csvexport: 'CSV Export',
            Search: 'Search',
            Columnchooser: 'Columns',
            Save: 'Save',
            Item: 'item',
            Items: 'items',
            EditOperationAlert: 'No records selected for edit operation',
            DeleteOperationAlert: 'No records selected for delete operation',
            SaveButton: 'Save',
            OKButton: 'OK',
            CancelButton: 'Cancel',
            EditFormTitle: 'Details of ',
            AddFormTitle: 'Add New Record',
            BatchSaveConfirm: 'Are you sure you want to save changes?',
            BatchSaveLostChanges: 'Unsaved changes will be lost. Are you sure you want to continue?',
            ConfirmDelete: 'Are you sure you want to Delete Record?',
            CancelEdit: 'Are you sure you want to Cancel the changes?',
            ChooseColumns: 'Choose Column',
            SearchColumns: 'search columns',
            Matchs: 'No Matches Found',
            FilterButton: 'Filter',
            ClearButton: 'Clear',
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            ChooseDate: 'Choose a Date',
            EnterValue: 'Enter the value',
            Copy: 'Copy',
            Group: 'Group by this column',
            Ungroup: 'Ungroup by this column',
            autoFitAll: 'Autofit all columns',
            autoFit: 'Autofit this column',
            AutoFitAll: 'Autofit all columns',
            AutoFit: 'Autofit this column',
            Export: 'Export',
            FirstPage: 'First Page',
            LastPage: 'Last Page',
            PreviousPage: 'Previous Page',
            NextPage: 'Next Page',
            SortAscending: 'Sort Ascending',
            SortDescending: 'Sort Descending',
            EditRecord: 'Edit Record',
            DeleteRecord: 'Delete Record',
            FilterMenu: 'Filter',
            SelectAll: 'Select All',
            Blanks: 'Blanks',
            FilterTrue: 'True',
            FilterFalse: 'False',
            NoResult: 'No Matches Found',
            ClearFilter: 'Clear Filter',
            NumberFilter: 'Number Filters',
            TextFilter: 'Text Filters',
            DateFilter: 'Date Filters',
            DateTimeFilter: 'DateTime Filters',
            MatchCase: 'Match Case',
            Between: 'Between',
            CustomFilter: 'Custom Filter',
            CustomFilterPlaceHolder: 'Enter the value',
            CustomFilterDatePlaceHolder: 'Choose a date',
            AND: 'AND',
            OR: 'OR',
            ShowRowsWhere: 'Show rows where:',
            FilterMenuDialogARIA: 'Filter menu dialog',
            ExcelFilterDialogARIA: 'Excel filter dialog',
            DialogEditARIA: 'Edit dialog',
            ColumnChooserDialogARIA: 'Column chooser dialog',
            ColumnMenuDialogARIA: 'Column menu dialog',
            CustomFilterDialogARIA: 'Customer filter dialog',
            SortAtoZ: 'Sort A to Z',
            SortZtoA: 'Sort Z to A',
            SortByOldest: 'Sort by Oldest',
            SortByNewest: 'Sort by Newest',
            SortSmallestToLargest: 'Sort Smallest to Largest',
            SortLargestToSmallest: 'Sort Largest to Smallest'
        };
        this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftRight: 'shift+rightarrow',
            shiftLeft: 'shift+leftarrow',
            home: 'home',
            end: 'end',
            escape: 'escape',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
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
            insert: 'insert',
            delete: 'delete',
            f2: 'f2',
            enter: 'enter',
            ctrlEnter: 'ctrl+enter',
            shiftEnter: 'shift+enter',
            tab: 'tab',
            shiftTab: 'shift+tab',
            space: 'space',
            ctrlPlusC: 'ctrl+C',
            ctrlShiftPlusH: 'ctrl+shift+H',
            ctrlSpace: 'ctrl+space',
            ctrlLeftArrow: 'ctrl+leftarrow',
            ctrlRightArrow: 'ctrl+rightarrow'
        };
        /* tslint:enable */
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    Grid.prototype.render = function () {
        this.log(['module_missing', 'promise_enabled', 'locale_missing', 'check_datasource_columns']);
        this.ariaService.setOptions(this.element, { role: 'grid' });
        if (sf.base.isBlazor()) {
            this.renderComplete();
        }
        sf.popups.createSpinner({ target: this.element }, this.createElement);
        this.renderModule = new Render(this, this.serviceLocator);
        this.searchModule = new Search(this);
        this.scrollModule = new Scroll(this);
        this.notify(initialLoad, {});
        if (this.getDataModule().dataManager.dataSource.offline === true || this.getDataModule().dataManager.dataSource.url === undefined) {
            this.isVirtualAdaptive = true;
        }
        this.trigger(load);
        prepareColumns(this.columns, this.enableColumnVirtualization, this);
        if (this.enablePersistence) {
            this.notify(columnsPrepared, {});
        }
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            this.getMediaColumns();
            setColumnIndex(this.columns);
        }
        this.checkLockColumns(this.columns);
        this.getColumns();
        this.processModel();
        this.gridRender();
        this.wireEvents();
        this.addListener();
        this.updateDefaultCursor();
        this.updateStackedFilter();
        this.showSpinner();
        this.notify(initialEnd, {});
        if (sf.base.isBlazor() && this.isServerRendered) {
            gridObserver.notify(componentRendered, { id: this.element.id, grid: this });
        }
    };
    /**
     * By default, grid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    Grid.prototype.showSpinner = function () {
        sf.popups.showSpinner(this.element);
    };
    /**
     * Manually showed spinner needs to hide by `hideSpinnner`.
     */
    Grid.prototype.hideSpinner = function () {
        sf.popups.hideSpinner(this.element);
    };
    Grid.prototype.updateStackedFilter = function () {
        if (this.allowFiltering && this.filterSettings.type === 'FilterBar' &&
            this.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
            this.getHeaderContent().classList.add('e-stackedfilter');
        }
        else {
            this.getHeaderContent().classList.remove('e-stackedfilter');
        }
    };
    Grid.prototype.getMediaColumns = function () {
        if (!this.enableColumnVirtualization) {
            var gcol = this.getColumns();
            this.getShowHideService = this.serviceLocator.getService('showHideService');
            if (!sf.base.isNullOrUndefined(gcol)) {
                for (var index = 0; index < gcol.length; index++) {
                    if (!sf.base.isNullOrUndefined(gcol[index].hideAtMedia) && (sf.base.isNullOrUndefined(gcol[index].visible) || gcol[index].visible)) {
                        this.pushMediaColumn(gcol[index], index);
                    }
                }
            }
        }
    };
    Grid.prototype.pushMediaColumn = function (col, index) {
        this.mediaCol.push(col);
        this.media[col.uid] = window.matchMedia(col.hideAtMedia);
        this.mediaQueryUpdate(index, this.media[col.uid]);
        this.mediaBindInstance[index] = this.mediaQueryUpdate.bind(this, index);
        this.media[col.uid].addListener(this.mediaBindInstance[index]);
    };
    /**
     * @hidden
     */
    Grid.prototype.updateMediaColumns = function (col) {
        if (!this.enableColumnVirtualization) {
            var index = this.getColumnIndexByUid(col.uid);
            for (var i = 0; i < this.mediaCol.length; i++) {
                if (col.uid === this.mediaCol[i].uid) {
                    this.mediaCol.splice(i, 1);
                    return;
                }
            }
            this.pushMediaColumn(col, index);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.mediaQueryUpdate = function (columnIndex, e) {
        var col = this.getColumns()[columnIndex];
        if (this.mediaCol.some(function (mediaColumn) { return mediaColumn.uid === col.uid; })) {
            col.visible = e.matches;
            if (this.isInitialLoad) {
                this.invokedFromMedia = true;
                if (col.visible) {
                    this.showHider.show(col.headerText, 'headerText');
                }
                else {
                    this.showHider.hide(col.headerText, 'headerText');
                }
            }
        }
    };
    Grid.prototype.refreshMediaCol = function () {
        this.isInitialLoad = true;
        var footerContent = this.element.querySelector('.e-gridfooter');
        if (this.aggregates.length && this.element.scrollHeight > this.height && footerContent) {
            sf.base.addClass([footerContent], ['e-footerpadding']);
        }
        var checkboxColumn = this.getColumns().filter(function (col) { return col.type === 'checkbox'; });
        if (checkboxColumn.length && this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            this.isCheckBoxSelection = false;
        }
    };
    Grid.prototype.removeMediaListener = function () {
        for (var i = 0; i < this.mediaCol.length; i++) {
            this.media[this.mediaCol[i].uid].removeListener(this.mediaBindInstance[this.mediaCol[i].index]);
        }
    };
    /**
     * For internal use only - Initialize the event handler
     * @private
     */
    Grid.prototype.eventInitializer = function () {
        //eventInitializer
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    Grid.prototype.destroy = function () {
        var gridElement = this.element;
        if (!gridElement) {
            return;
        }
        var hasGridChild = gridElement.querySelector('.e-gridheader') &&
            gridElement.querySelector('.e-gridcontent') ? true : false;
        if (hasGridChild) {
            this.unwireEvents();
        }
        this.removeListener();
        this.removeMediaListener();
        this.notify(destroy, {});
        this.destroyDependentModules();
        if (hasGridChild) {
            _super.prototype.destroy.call(this);
        }
        this.toolTipObj.destroy();
        var modules = ['renderModule', 'headerModule', 'contentModule', 'valueFormatterService',
            'serviceLocator', 'ariaService', 'keyboardModule', 'widthService', 'searchModule', 'showHider',
            'scrollModule', 'printModule', 'clipboardModule', 'focusModule'];
        for (var i = 0; i < modules.length; i++) {
            if (this[modules[i]]) {
                this[modules[i]] = null;
            }
        }
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            this.element.innerHTML = '';
        }
        else {
            this.element.style.display = 'none';
        }
        sf.base.classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device', 'e-grid-min-height']);
    };
    Grid.prototype.destroyDependentModules = function () {
        var gridElement = this.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.scrollModule.destroy();
        this.keyboardModule.destroy();
        this.focusModule.destroy();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Grid.prototype.getModuleName = function () {
        return 'grid';
    };
    Grid.prototype.enableBoxSelection = function () {
        if (this.enableAutoFill) {
            this.selectionSettings.cellSelectionMode = 'BoxWithBorder';
            this.element.classList.add('e-afenabled');
        }
        else {
            this.element.classList.remove('e-afenabled');
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    /* tslint:disable-next-line:max-line-length */
    // tslint:disable-next-line:max-func-body-length
    Grid.prototype.onPropertyChanged = function (newProp, oldProp) {
        var requireRefresh = false;
        var requireGridRefresh = false;
        var freezeRefresh$$1 = false;
        var checkCursor;
        var args = { requestType: 'refresh' };
        if (this.isDestroyed) {
            return;
        }
        this.log('module_missing');
        if (this.isEllipsisTooltip()) {
            this.toolTipObj.close();
        }
        var properties = Object.keys(newProp);
        if (properties.indexOf('columns') > -1) {
            this.updateColumnObject();
            requireGridRefresh = true;
        }
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            switch (prop) {
                case 'allowPaging':
                    this.notify(uiUpdate, { module: 'pager', enable: this.allowPaging });
                    requireRefresh = true;
                    break;
                case 'pageSettings':
                    if (this.pageTemplateChange) {
                        this.pageTemplateChange = false;
                        this.notify(inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                        break;
                    }
                    this.notify(inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                    if (sf.base.isNullOrUndefined(newProp.pageSettings.currentPage) && sf.base.isNullOrUndefined(newProp.pageSettings.pageSize)
                        && sf.base.isNullOrUndefined(newProp.pageSettings.totalRecordsCount)
                        || !sf.base.isNullOrUndefined(oldProp.pageSettings) &&
                            ((newProp.pageSettings.currentPage !== oldProp.pageSettings.currentPage)
                                && !this.enableColumnVirtualization && !this.enableVirtualization
                                && this.pageSettings.totalRecordsCount <= this.pageSettings.pageSize)) {
                        requireRefresh = true;
                    }
                    break;
                case 'allowSorting':
                    this.notify(uiUpdate, { module: 'sort', enable: this.allowSorting });
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'allowFiltering':
                    this.updateStackedFilter();
                    this.notify(uiUpdate, { module: 'filter', enable: this.allowFiltering });
                    requireRefresh = true;
                    if (this.filterSettings.type !== 'FilterBar') {
                        this.refreshHeader();
                    }
                    break;
                case 'height':
                case 'width':
                    this.notify(uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                    break;
                case 'allowReordering':
                    this.headerModule.refreshUI();
                    checkCursor = true;
                    break;
                case 'allowRowDragAndDrop':
                    this.notify(uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                    this.renderModule.refresh();
                    this.headerModule.refreshUI();
                    break;
                case 'allowSelection':
                    this.notify(uiUpdate, { module: 'selection', enable: this.allowSelection });
                    break;
                case 'enableAutoFill':
                    if (this.selectionModule) {
                        this.enableBoxSelection();
                        this.selectionModule.updateAutoFillPosition();
                    }
                    break;
                case 'rowTemplate':
                    this.rowTemplateFn = templateCompiler(this.rowTemplate);
                    requireRefresh = true;
                    break;
                case 'detailTemplate':
                    this.detailTemplateFn = templateCompiler(this.detailTemplate);
                    requireRefresh = true;
                    break;
                case 'allowGrouping':
                    this.notify(uiUpdate, { module: 'group', enable: this.allowGrouping });
                    this.headerModule.refreshUI();
                    requireRefresh = true;
                    checkCursor = true;
                    break;
                case 'enableInfiniteScrolling':
                case 'childGrid':
                    requireRefresh = true;
                    break;
                case 'toolbar':
                    this.notify(uiUpdate, { module: 'toolbar' });
                    break;
                case 'groupSettings':
                    this.notify(inBoundModelChanged, {
                        module: 'group', properties: newProp.groupSettings,
                        oldProperties: oldProp.groupSettings
                    });
                    break;
                case 'aggregates':
                    if (!this.aggregates.length && this.allowGrouping && this.groupSettings.columns.length) {
                        requireRefresh = true;
                    }
                    this.notify(uiUpdate, { module: 'aggregate', properties: newProp });
                    break;
                case 'frozenColumns':
                case 'frozenRows':
                case 'enableVirtualization':
                case 'currencyCode':
                case 'locale':
                    this.log('frozen_rows_columns');
                    freezeRefresh$$1 = true;
                    requireGridRefresh = true;
                    break;
                case 'query':
                    if (!this.getDataModule().isQueryInvokedFromData) {
                        requireRefresh = true;
                    }
                    this.getDataModule().isQueryInvokedFromData = false;
                    break;
                default:
                    this.extendedPropertyChange(prop, newProp, requireGridRefresh);
            }
        }
        if (checkCursor) {
            this.updateDefaultCursor();
        }
        if (requireGridRefresh) {
            if (freezeRefresh$$1 || this.getFrozenColumns() || this.frozenRows) {
                if (!(sf.base.isBlazor() && this.isServerRendered)) {
                    this.freezeRefresh();
                }
            }
            else {
                this.refresh();
            }
        }
        else if (requireRefresh) {
            this.notify(modelChanged, args);
            requireRefresh = false;
            this.maintainSelection(newProp.selectedRowIndex);
        }
    };
    /* tslint:disable */
    Grid.prototype.extendedPropertyChange = function (prop, newProp, requireGridRefresh) {
        switch (prop) {
            case 'enableRtl':
                this.updateRTL();
                if (this.allowPaging) {
                    this.element.querySelector('.e-gridpager').ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.element.querySelector('.e-gridpager').ej2_instances[0].dataBind();
                }
                if (this.height !== 'auto') {
                    this.scrollModule.removePadding(!newProp.enableRtl);
                    this.scrollModule.setPadding();
                }
                if (this.toolbar && this.toolbarModule) {
                    this.toolbarModule.getToolbar().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.toolbarModule.getToolbar().ej2_instances[0].dataBind();
                }
                if (this.contextMenuItems && this.contextMenuModule) {
                    this.contextMenuModule.getContextMenu().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.contextMenuModule.getContextMenu().ej2_instances[0].dataBind();
                }
                if (this.showColumnMenu && this.columnMenuModule) {
                    this.columnMenuModule.getColumnMenu().ej2_instances[0].enableRtl = newProp.enableRtl;
                    this.columnMenuModule.getColumnMenu().ej2_instances[0].dataBind();
                }
                if (this.filterSettings.type === 'FilterBar' && this.filterSettings.showFilterBarOperator) {
                    this.refreshHeader();
                }
                this.notify(rtlUpdated, {});
                break;
            case 'enableAltRow':
                this.renderModule.refresh();
                break;
            case 'allowResizing':
                this.headerModule.refreshUI();
                this.updateResizeLines();
                break;
            case 'rowHeight':
                if (this.rowHeight) {
                    sf.base.addClass([this.element], 'e-grid-min-height');
                }
                else {
                    sf.base.removeClass([this.element], 'e-grid-min-height');
                }
                this.renderModule.refresh();
                this.headerModule.refreshUI();
                break;
            case 'gridLines':
                this.updateGridLines();
                break;
            case 'showColumnMenu':
                this.headerModule.refreshUI();
                this.notify(uiUpdate, { module: 'columnMenu', enable: true });
                break;
            case 'columnMenuItems':
                this.notify(uiUpdate, { module: 'columnMenu', enable: this.columnMenuItems });
                break;
            case 'contextMenuItems':
                this.notify(uiUpdate, { module: 'contextMenu', enable: this.contextMenuItems });
                break;
            case 'showColumnChooser':
                this.notify(uiUpdate, { module: 'columnChooser', enable: this.showColumnChooser });
                break;
            case 'filterSettings':
                this.updateStackedFilter();
                this.notify(inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings });
                break;
            case 'searchSettings':
                this.notify(inBoundModelChanged, { module: 'search', properties: newProp.searchSettings });
                break;
            case 'sortSettings':
                this.notify(inBoundModelChanged, { module: 'sort' });
                break;
            case 'selectionSettings':
                this.notify(inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings });
                break;
            case 'editSettings':
                this.notify(inBoundModelChanged, { module: 'edit', properties: newProp.editSettings });
                break;
            case 'allowTextWrap':
            case 'textWrapSettings':
                if (this.allowTextWrap) {
                    this.applyTextWrap();
                }
                else {
                    this.removeTextWrap();
                }
                this.notify(freezeRender, { case: 'textwrap', isModeChg: (prop === 'textWrapSettings') });
                break;
            case 'dataSource':
                var pending_1 = this.getDataModule().getState();
                if (Object.getPrototypeOf(newProp).deepWatch) {
                    var pKeyField = this.getPrimaryKeyFieldNames()[0];
                    for (var i = 0, props = Object.keys(newProp.dataSource); i < props.length; i++) {
                        this.setRowData(sf.base.getValue(pKeyField, this.dataSource[props[i]]), this.dataSource[props[i]]);
                    }
                }
                else if (pending_1.isPending) {
                    var gResult = !sf.base.isNullOrUndefined(this.dataSource) ? this.dataSource.result : [];
                    var names = (pending_1.group || []);
                    for (var i = 0; i < names.length; i++) {
                        gResult = sf.data.DataUtil.group(gResult, names[i], pending_1.aggregates || []);
                    }
                    this.dataSource = {
                        result: gResult, count: this.dataSource.count,
                        aggregates: this.dataSource.aggregates
                    };
                    this.getDataModule().setState({});
                    pending_1.resolver(this.dataSource);
                }
                else {
                    this.getDataModule().setState({ isDataChanged: false });
                    this.notify(dataSourceModified, {});
                    if (!requireGridRefresh) {
                        this.renderModule.refresh();
                        if (this.isCheckBoxSelection) {
                            this.notify(beforeRefreshOnDataChange, {});
                        }
                    }
                }
                this.scrollRefresh();
                break;
            case 'enableHover':
                var action = newProp.enableHover ? sf.base.addClass : sf.base.removeClass;
                action([this.element], 'e-gridhover');
                break;
            case 'selectedRowIndex':
                if (!this.isSelectedRowIndexUpdating) {
                    this.selectRow(newProp.selectedRowIndex);
                }
                this.isSelectedRowIndexUpdating = false;
                break;
            case 'resizeSettings':
                this.widthService.setWidthToTable();
                break;
        }
    };
    Grid.prototype.maintainSelection = function (index) {
        var _this = this;
        if (index !== -1) {
            var fn_1 = function () {
                _this.selectRow(index);
                _this.off(contentReady, fn_1);
            };
            this.on(contentReady, fn_1, this);
        }
    };
    /**
     * @private
     */
    Grid.prototype.setProperties = function (prop, muteOnChange) {
        _super.prototype.setProperties.call(this, prop, muteOnChange);
        var filterSettings = 'filterSettings';
        if (prop[filterSettings] && this.filterModule && muteOnChange) {
            this.filterModule.refreshFilter();
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.setTablesCount = function () {
        var frozenCols = this.getFrozenColumns();
        var frozenLeft = this.getFrozenLeftColumnsCount();
        var frozenRight = this.getFrozenRightColumnsCount();
        if (frozenCols && !frozenLeft && !frozenRight) {
            this.tablesCount = 2;
        }
        else if (!frozenCols && (frozenLeft || frozenRight)) {
            if ((frozenLeft && !frozenRight) || (frozenRight && !frozenLeft)) {
                this.tablesCount = 2;
            }
            else if (frozenLeft && frozenRight) {
                this.tablesCount = 3;
            }
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.getTablesCount = function () {
        return this.tablesCount;
    };
    /**
     * @hidden
     */
    Grid.prototype.updateDefaultCursor = function () {
        var headerCells = [].slice.call(this.getHeaderContent().querySelectorAll('.e-headercell:not(.e-stackedheadercell)'));
        var stdHdrCell = [].slice.call(this.getHeaderContent().querySelectorAll('.e-stackedheadercell'));
        var cols = this.getColumns();
        if (this.enableColumnVirtualization && this.getFrozenColumns()) {
            var cells = this.contentModule.getHeaderCells();
            headerCells = cells.length ? cells : headerCells;
        }
        for (var i = 0; i < headerCells.length; i++) {
            var cell = headerCells[i];
            if (this.allowGrouping || this.allowReordering || this.allowSorting) {
                if (!cols[i].allowReordering || !cols[i].allowSorting || !cols[i].allowGrouping) {
                    cell.classList.add('e-defaultcursor');
                }
                else {
                    cell.classList.add('e-mousepointer');
                }
            }
        }
        for (var count = 0; count < stdHdrCell.length; count++) {
            if (this.allowReordering) {
                stdHdrCell[count].classList.add('e-mousepointer');
            }
        }
    };
    Grid.prototype.updateColumnModel = function (columns) {
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns);
            }
            else {
                this.columnModel.push(columns[i]);
            }
        }
        this.updateColumnLevelFrozen();
        this.updateFrozenColumns();
        this.updateLockableColumns();
    };
    Grid.prototype.updateColumnLevelFrozen = function () {
        var cols = this.columnModel;
        var leftCols = [];
        var rightCols = [];
        var movableCols = [];
        if (this.frozenLeftCount || this.frozenRightCount) {
            for (var i = 0, len = cols.length; i < len; i++) {
                /* tslint:disable-next-line:no-any */
                var col = cols[i];
                if (col.freeze === 'Left') {
                    col.freezeTable = 'frozen-left';
                    leftCols.push(col);
                }
                else if (col.freeze === 'Right') {
                    col.freezeTable = 'frozen-right';
                    rightCols.push(col);
                }
                else {
                    col.freezeTable = 'movable';
                    movableCols.push(col);
                }
            }
            this.columnModel = leftCols.concat(movableCols).concat(rightCols);
        }
    };
    Grid.prototype.updateFrozenColumns = function () {
        if (this.frozenLeftCount || this.frozenRightCount) {
            return;
        }
        var cols = this.columnModel;
        var directFrozenCount = this.frozenColumns;
        var totalFrozenCount = this.getFrozenColumns();
        var count = 0;
        for (var i = 0, len = cols.length; i < len; i++) {
            /* tslint:disable-next-line:no-any */
            var col = cols[i];
            if (directFrozenCount) {
                if (i < directFrozenCount) {
                    col.freezeTable = 'frozen-left';
                }
                else {
                    col.freezeTable = 'movable';
                }
            }
            if (col.isFrozen && i >= directFrozenCount) {
                col.freezeTable = 'frozen-left';
                cols.splice(this.frozenColumns + count, 0, cols.splice(i, 1)[0]);
                count++;
            }
            else if (totalFrozenCount && !directFrozenCount) {
                col.freezeTable = 'movable';
            }
        }
    };
    Grid.prototype.getFrozenLeftCount = function () {
        return this.getFrozenColumns() || this.getFrozenLeftColumnsCount();
    };
    Grid.prototype.isFrozenGrid = function () {
        return this.getFrozenColumns() !== 0 || this.getFrozenLeftColumnsCount() !== 0 || this.getFrozenRightColumnsCount() !== 0;
    };
    Grid.prototype.getFrozenMode = function () {
        return this.frozenName;
    };
    Grid.prototype.updateLockableColumns = function () {
        var cols = this.columnModel;
        var frozenCount = 0;
        var movableCount = 0;
        var frozenColumns = this.getFrozenColumns();
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].lockColumn) {
                if (i < frozenColumns) {
                    cols.splice(frozenCount, 0, cols.splice(i, 1)[0]);
                    frozenCount++;
                }
                else {
                    cols.splice(frozenColumns + movableCount, 0, cols.splice(i, 1)[0]);
                    movableCount++;
                }
            }
        }
    };
    Grid.prototype.checkLockColumns = function (cols) {
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].columns) {
                this.checkLockColumns(cols[i].columns);
            }
            else if (cols[i].lockColumn) {
                this.lockcolPositionCount++;
            }
        }
    };
    /**
     * Gets the columns from the Grid.
     * @return {Column[]}
     * @blazorType List<GridColumn>
     */
    Grid.prototype.getColumns = function (isRefresh) {
        var _this = this;
        var inview = this.inViewIndexes.map(function (v) { return v - _this.groupSettings.columns.length; }).filter(function (v) { return v > -1; });
        var vLen = inview.length;
        if (!this.enableColumnVirtualization || sf.base.isNullOrUndefined(this.columnModel) || this.columnModel.length === 0 || isRefresh) {
            this.columnModel = [];
            this.updateColumnModel(this.columns);
        }
        var columns = vLen === 0 ? this.columnModel :
            this.columnModel.slice(inview[0], inview[vLen - 1] + 1);
        if (this.contentModule && this.enableColumnVirtualization && this.isFrozenGrid() && inview.length
            && inview[0] > 0) {
            var frozenCols = this.contentModule.ensureFrozenCols(columns);
            columns = frozenCols;
        }
        return columns;
    };
    /**
     * @private
     */
    Grid.prototype.getStackedHeaderColumnByHeaderText = function (stackedHeader, col) {
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
     * @private
     */
    Grid.prototype.getColumnIndexesInView = function () {
        return this.inViewIndexes;
    };
    /**
     * @private
     */
    Grid.prototype.getQuery = function () {
        return this.query;
    };
    /**
     * @private
     */
    Grid.prototype.getLocaleConstants = function () {
        return this.defaultLocale;
    };
    /**
     * @private
     */
    Grid.prototype.setColumnIndexesInView = function (indexes) {
        this.inViewIndexes = indexes;
    };
    /**
     * Gets the visible columns from the Grid.
     * @return {Column[]}
     * @blazorType List<GridColumn>
     */
    Grid.prototype.getVisibleColumns = function () {
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
     * Gets the header div of the Grid.
     * @return {Element}
     */
    Grid.prototype.getHeaderContent = function () {
        return this.headerModule.getPanel();
    };
    /**
     * Sets the header div of the Grid to replace the old header.
     * @param  {Element} element - Specifies the Grid header.
     * @return {void}
     */
    Grid.prototype.setGridHeaderContent = function (element) {
        this.headerModule.setPanel(element);
    };
    /**
     * Gets the content table of the Grid.
     * @return {Element}
     */
    Grid.prototype.getContentTable = function () {
        return this.contentModule.getTable();
    };
    /**
     * Sets the content table of the Grid to replace the old content table.
     * @param  {Element} element - Specifies the Grid content table.
     * @return {void}
     */
    Grid.prototype.setGridContentTable = function (element) {
        this.contentModule.setTable(element);
    };
    /**
     * Gets the content div of the Grid.
     * @return {Element}
     */
    Grid.prototype.getContent = function () {
        return this.contentModule.getPanel();
    };
    /**
     * Sets the content div of the Grid to replace the old Grid content.
     * @param  {Element} element - Specifies the Grid content.
     * @return {void}
     */
    Grid.prototype.setGridContent = function (element) {
        this.contentModule.setPanel(element);
    };
    /**
     * Gets the header table element of the Grid.
     * @return {Element}
     */
    Grid.prototype.getHeaderTable = function () {
        return this.headerModule.getTable();
    };
    /**
     * Sets the header table of the Grid to replace the old one.
     * @param  {Element} element - Specifies the Grid header table.
     * @return {void}
     */
    Grid.prototype.setGridHeaderTable = function (element) {
        this.headerModule.setTable(element);
    };
    /**
     * Gets the footer div of the Grid.
     * @return {Element}
     */
    Grid.prototype.getFooterContent = function () {
        this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        return this.footerElement;
    };
    /**
     * Gets the footer table element of the Grid.
     * @return {Element}
     */
    Grid.prototype.getFooterContentTable = function () {
        this.footerElement = this.element.getElementsByClassName('e-gridfooter')[0];
        return this.footerElement.firstChild.firstChild;
    };
    /**
     * Gets the pager of the Grid.
     * @return {Element}
     */
    Grid.prototype.getPager = function () {
        return this.gridPager; //get element from pager
    };
    /**
     * Sets the pager of the Grid to replace the old pager.
     * @param  {Element} element - Specifies the Grid pager.
     * @return {void}
     */
    Grid.prototype.setGridPager = function (element) {
        this.gridPager = element;
    };
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    Grid.prototype.getRowByIndex = function (index) {
        return this.contentModule.getRowByIndex(index);
    };
    /**
     * Gets a movable tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    Grid.prototype.getMovableRowByIndex = function (index) {
        return this.contentModule.getMovableRowByIndex(index);
    };
    /**
     * Gets a frozen tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    Grid.prototype.getFrozenRowByIndex = function (index) {
        return this.getFrozenDataRows()[index];
    };
    /**
     * Gets all the data rows of the Grid.
     * @return {Element[]}
     */
    Grid.prototype.getRows = function () {
        return this.contentModule.getRowElements();
    };
    /**
    * Gets a frozen right tables row element by index.
    * @param  {number} index - Specifies the row index.
    * @return {Element}
    */
    Grid.prototype.getFrozenRightRowByIndex = function (index) {
        return this.contentModule.getFrozenRightRowByIndex(index);
    };
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    Grid.prototype.getRowInfo = function (target) {
        var ele = target;
        var args = { target: target };
        if (!sf.base.isNullOrUndefined(target) && sf.base.isNullOrUndefined(parentsUntil(ele, 'e-detailrowcollapse')
            && sf.base.isNullOrUndefined(parentsUntil(ele, 'e-recordplusexpand')))) {
            var cell = sf.base.closest(ele, '.e-rowcell');
            if (!cell) {
                var row = sf.base.closest(ele, '.e-row');
                if (!sf.base.isNullOrUndefined(row)) {
                    var rowObj = this.getRowObjectFromUID(row.getAttribute('data-uid'));
                    var rowIndex = parseInt(row.getAttribute('aria-rowindex'), 10);
                    args = { row: row, rowData: rowObj.data, rowIndex: rowIndex };
                }
                return args;
            }
            var cellIndex = parseInt(cell.getAttribute('aria-colindex'), 10);
            if (!sf.base.isNullOrUndefined(cell) && !isNaN(cellIndex)) {
                var row_1 = sf.base.closest(cell, '.e-row');
                var rowIndex = parseInt(row_1.getAttribute('aria-rowindex'), 10);
                var frzCols = this.getFrozenColumns();
                var tableName = this.columnModel[cellIndex].getFreezeTableName();
                var rows = this.contentModule.getRows();
                var index = cellIndex + this.getIndentCount();
                if (this.isFrozenGrid()) {
                    if (tableName === 'frozen-left') {
                        rows = this.contentModule.getRows();
                    }
                    else if (tableName === 'movable') {
                        index = cellIndex - frzCols - this.frozenLeftCount;
                        rows = this.contentModule.getMovableRows();
                    }
                    else if (tableName === 'frozen-right') {
                        index = cellIndex - (this.frozenLeftCount + this.movableCount);
                        rows = this.contentModule.getFrozenRightRows();
                    }
                }
                var rowsObject = rows.filter(function (r) { return r.uid === row_1.getAttribute('data-uid'); });
                var rowData = {};
                var column = void 0;
                if (Object.keys(rowsObject).length) {
                    rowData = rowsObject[0].data;
                    column = rowsObject[0].cells[index].column;
                }
                args = { cell: cell, cellIndex: cellIndex, row: row_1, rowIndex: rowIndex, rowData: rowData, column: column, target: target };
            }
        }
        return args;
    };
    /**
     * Gets the Grid's movable content rows from frozen grid.
     * @return {Element[]}
     */
    Grid.prototype.getMovableRows = function () {
        return this.contentModule.getMovableRowElements();
    };
    /**
     * Gets the Grid's frozen right content rows from frozen grid.
     * @return {Element[]}
     */
    Grid.prototype.getFrozenRightRows = function () {
        return this.contentModule.getFrozenRightRowElements();
    };
    /**
     * Gets all the Grid's data rows.
     * @return {Element[]}
     */
    Grid.prototype.getDataRows = function () {
        return this.getAllDataRows();
    };
    /**
     * @hidden
     */
    Grid.prototype.getAllDataRows = function (includeAdd) {
        if (sf.base.isNullOrUndefined(this.getContentTable().querySelector('tbody'))) {
            return [];
        }
        var tbody = this.isFrozenGrid() ? this.getFrozenLeftContentTbody() : this.getContentTable().querySelector('tbody');
        var rows = [].slice.call(tbody.children);
        if (this.frozenRows) {
            var hdrTbody = this.isFrozenGrid() ? this.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody')
                : this.getHeaderTable().querySelector('tbody');
            var freezeRows = [].slice.call(hdrTbody.children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows, includeAdd);
        return dataRows;
    };
    /**
     * @hidden
     */
    Grid.prototype.addMovableRows = function (fRows, mrows) {
        for (var i = 0, len = mrows.length; i < len; i++) {
            fRows.push(mrows[i]);
        }
        return fRows;
    };
    Grid.prototype.generateDataRows = function (rows, includAdd) {
        var dRows = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && (!rows[i].classList.contains('e-hiddenrow') || includAdd)) {
                if (this.isCollapseStateEnabled()) {
                    dRows[parseInt(rows[i].getAttribute("aria-rowindex"))] = rows[i];
                }
                else {
                    dRows.push(rows[i]);
                }
            }
        }
        return dRows;
    };
    /**
     * Gets all the Grid's movable table data rows.
     * @return {Element[]}
     */
    Grid.prototype.getMovableDataRows = function () {
        return this.getAllMovableDataRows();
    };
    /**
     * @hidden
     */
    Grid.prototype.getAllMovableDataRows = function (includeAdd) {
        if (!this.isFrozenGrid()) {
            return [];
        }
        var rows = [].slice.call(this.getContent().querySelector('.e-movablecontent').querySelector('tbody').children);
        if (this.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows, includeAdd);
        return dataRows;
    };
    /**
     * Gets all the Grid's frozen table data rows.
     * @return {Element[]}
     */
    Grid.prototype.getFrozenDataRows = function () {
        return this.getAllFrozenDataRows();
    };
    /**
     * @hidden
     */
    Grid.prototype.getAllFrozenDataRows = function (includeAdd) {
        var rows = [].slice.call(this.getContent().querySelector('.e-frozencontent').querySelector('tbody').children);
        if (this.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows, includeAdd);
        return dataRows;
    };
    /**
     * Gets all the Grid's frozen right table data rows.
     * @return {Element[]}
     */
    Grid.prototype.getFrozenRightDataRows = function () {
        return this.getAllFrozenRightDataRows();
    };
    /**
     * @hidden
     */
    Grid.prototype.getAllFrozenRightDataRows = function (includeAdd) {
        if (this.getFrozenMode() !== 'Right' && this.getFrozenMode() !== 'Left-Right') {
            return [];
        }
        var rows = [].slice.call(this.getContent().querySelector('.e-frozen-right-content').querySelector('tbody').children);
        if (this.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderContent().querySelector('.e-frozen-right-header').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows, includeAdd);
        return dataRows;
    };
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    Grid.prototype.setCellValue = function (key, field, value) {
        var cells = 'cells';
        var rowData = 'data';
        var rowIdx = 'index';
        var rowuID = 'uid';
        var fieldIdx;
        var col;
        var tr;
        var mTr;
        var pkName = this.getPrimaryKeyFieldNames()[0];
        var cell = new CellRenderer(this, this.serviceLocator);
        var selectedRow = {};
        var movableSelectedRow = {};
        var rowObjects = this.contentModule.getRows();
        var movableRowObjects = this.contentModule.getMovableRows();
        fieldIdx = this.getColumnIndexByField(field);
        if (this.groupSettings.columns.length) {
            fieldIdx = fieldIdx + this.groupSettings.columns.length;
        }
        if (this.childGrid || this.detailTemplate) {
            fieldIdx++;
        }
        if (this.isRowDragable()) {
            fieldIdx++;
        }
        col = this.getColumnByField(field);
        selectedRow = rowObjects.filter(function (r) {
            return sf.base.getValue(pkName, r.data) === key;
        })[0];
        movableSelectedRow = movableRowObjects.filter(function (r) {
            return sf.base.getValue(pkName, r.data) === key;
        })[0];
        tr = !sf.base.isNullOrUndefined(selectedRow) ? this.element.querySelector('[data-uid=' + selectedRow[rowuID] + ']') : null;
        mTr = !sf.base.isNullOrUndefined(movableSelectedRow) ? this.element.querySelector('[data-uid=' + movableSelectedRow[rowuID] + ']') : null;
        if (!sf.base.isNullOrUndefined(tr)) {
            sf.base.setValue(field, value, selectedRow[rowData]);
            var td = !sf.base.isNullOrUndefined(tr[cells][fieldIdx]) ?
                tr[cells][fieldIdx] : mTr[cells][fieldIdx - this.frozenColumns];
            if (!sf.base.isNullOrUndefined(td)) {
                var sRow = selectedRow[cells][fieldIdx];
                var mRow = void 0;
                if (this.frozenColumns) {
                    mRow = movableSelectedRow[cells][fieldIdx - this.frozenColumns];
                }
                cell.refreshTD(td, !sf.base.isNullOrUndefined(sRow) ? sRow : mRow, selectedRow[rowData], { index: selectedRow[rowIdx] });
                if (this.aggregates.length > 0) {
                    this.notify(refreshFooterRenderer, {});
                    if (this.groupSettings.columns.length > 0) {
                        this.notify(groupAggregates, {});
                    }
                }
                /* tslint:disable:no-string-literal */
                if (!sf.base.isNullOrUndefined(movableSelectedRow) && !sf.base.isNullOrUndefined(movableSelectedRow['changes'])) {
                    movableSelectedRow['changes'][field] = value;
                }
                /* tslint:disable:no-string-literal */
                this.trigger(queryCellInfo, {
                    cell: td, column: col, data: selectedRow[rowData]
                });
            }
        }
        else {
            return;
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.refreshReactColumnTemplateByUid = function (columnUid) {
        var _this = this;
        if (this.isReact) {
            //tslint:disable-next-line:no-any
            this.clearTemplate(['columnTemplate'], undefined, function () {
                var cells = 'cells';
                var rowIdx = 'index';
                var rowsObj = _this.getRowsObject();
                var cellIndex = _this.getNormalizedColumnIndex(columnUid);
                for (var j = 0; j < rowsObj.length; j++) {
                    var cell = rowsObj[j][cells][cellIndex];
                    var cellRenderer = new CellRenderer(_this, _this.serviceLocator);
                    var td = _this.getCellFromIndex(j, cellIndex);
                    cellRenderer.refreshTD(td, cell, rowsObj[j].data, { index: rowsObj[j][rowIdx] });
                }
            });
        }
    };
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    Grid.prototype.setRowData = function (key, rowData) {
        var rowuID = 'uid';
        var rowObjects = this.contentModule.getRows();
        var selectedRow;
        var pkName = this.getPrimaryKeyFieldNames()[0];
        var rowRenderer = new RowRenderer(this.serviceLocator, null, this);
        if (this.groupSettings.columns.length > 0 && this.aggregates.length > 0) {
            rowObjects = rowObjects.filter(function (row) { return row.isDataRow; });
        }
        selectedRow = rowObjects.filter(function (r) {
            return sf.base.getValue(pkName, r.data) === key;
        })[0];
        if (!sf.base.isNullOrUndefined(selectedRow) && this.element.querySelectorAll('[data-uid=' + selectedRow[rowuID] + ']').length) {
            selectedRow.changes = rowData;
            refreshForeignData(selectedRow, this.getForeignKeyColumns(), selectedRow.changes);
            rowRenderer.refresh(selectedRow, this.getColumns(), true);
            if (this.aggregates.length > 0) {
                this.notify(refreshFooterRenderer, {});
                if (this.groupSettings.columns.length > 0) {
                    this.notify(groupAggregates, {});
                }
            }
        }
        else {
            return;
        }
    };
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        var col = this.getColumnByIndex(columnIndex);
        return getCellByColAndRowIndex(this, col, rowIndex, columnIndex);
    };
    /**
     * Gets a movable table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getMovableCellFromIndex = function (rowIndex, columnIndex) {
        if (this.frozenName === 'Left-Right' && columnIndex >= this.movableCount) {
            return undefined;
        }
        var index = this.getFrozenColumns() || this.getFrozenLeftColumnsCount();
        return this.getMovableDataRows()[rowIndex] &&
            this.getMovableDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex - index];
    };
    /**
     * Gets a frozen right table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getFrozenRightCellFromIndex = function (rowIndex, columnIndex) {
        var index = this.getFrozenLeftColumnsCount() + this.getMovableColumnsCount();
        var rows = this.getFrozenRightDataRows();
        return rows[rowIndex] && rows[rowIndex].querySelectorAll('.e-rowcell')[columnIndex - index];
    };
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByIndex = function (index) {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    };
    /**
     * Gets a movable column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getMovableColumnHeaderByIndex = function (index) {
        var left = this.getFrozenColumns() || this.getFrozenLeftColumnsCount();
        return this.getMovableVirtualHeader().querySelectorAll('.e-headercell')[index - left];
    };
    /**
     * Gets a frozen right column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getFrozenRightColumnHeaderByIndex = function (index) {
        var left = this.getFrozenLeftColumnsCount() + this.getMovableColumnsCount();
        return this.getFrozenRightHeader().querySelectorAll('.e-headercell')[index - left];
    };
    /**
     * Gets a frozen left column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    Grid.prototype.getFrozenLeftColumnHeaderByIndex = function (index) {
        return this.getFrozenVirtualHeader().querySelectorAll('.e-headercell')[index];
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowObjectFromUID = function (uid, isMovable, isFrozenRight) {
        var rows = this.contentModule.getRows();
        var row = this.rowObject(rows, uid);
        if (this.isFrozenGrid()) {
            if (!row || isMovable || isFrozenRight) {
                row = this.rowObject(this.contentModule.getMovableRows(), uid);
                if ((!row && this.getFrozenMode() === 'Left-Right') || isFrozenRight) {
                    row = this.rowObject(this.contentModule.getFrozenRightRows(), uid);
                }
                return row;
            }
        }
        if (sf.base.isNullOrUndefined(row) && this.enableVirtualization && this.groupSettings.columns.length > 0) {
            row = this.rowObject(this.vRows, uid);
            return row;
        }
        return row;
    };
    Grid.prototype.rowObject = function (rows, uid) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            if (row.uid === uid) {
                return row;
            }
        }
        return null;
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowsObject = function () {
        return this.contentModule.getRows();
    };
    /**
     * @hidden
     */
    Grid.prototype.getMovableRowsObject = function () {
        var rows = [];
        if (this.isFrozenGrid()) {
            rows = this.contentModule.getMovableRows();
        }
        return rows;
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenRightRowsObject = function () {
        var rows = [];
        if (this.getFrozenMode() === 'Right' || this.getFrozenMode() === 'Left-Right') {
            rows = this.contentModule.getFrozenRightRows();
        }
        return rows;
    };
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByField = function (field) {
        var column = this.getColumnByField(field);
        return column ? this.getColumnHeaderByUid(column.uid) : undefined;
    };
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    Grid.prototype.getColumnHeaderByUid = function (uid) {
        var element = this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']');
        return element ? element.parentElement : undefined;
    };
    /**
     * @hidden
     * @blazorType GridColumn
     */
    Grid.prototype.getColumnByIndex = function (index) {
        var column;
        this.getColumns().some(function (col, i) {
            column = col;
            return i === index;
        });
        return column;
    };
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     * @blazorType GridColumn
     */
    Grid.prototype.getColumnByField = function (field) {
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
    Grid.prototype.getColumnIndexByField = function (field) {
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
    Grid.prototype.getColumnByUid = function (uid) {
        return iterateArrayOrObject(this.getColumns().concat(this.getStackedColumns(this.columns)), function (item, index) {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * @hidden
     */
    Grid.prototype.getStackedColumns = function (columns, stackedColumn) {
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
    Grid.prototype.getColumnIndexByUid = function (uid) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];
        return !sf.base.isNullOrUndefined(index) ? index : -1;
    };
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    Grid.prototype.getUidByColumnField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets TH index by column uid value.
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @return {number}
     */
    Grid.prototype.getNormalizedColumnIndex = function (uid) {
        var index = this.getColumnIndexByUid(uid);
        return index + this.getIndentCount();
    };
    /**
    * Gets indent cell count.
    * @private
    * @return {number}
    */
    Grid.prototype.getIndentCount = function () {
        var index = 0;
        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }
        if (this.isDetail()) {
            index++;
        }
        if (this.isRowDragable() && sf.base.isNullOrUndefined(this.rowDropSettings.targetID)) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate
         * and frozen should be handled here
         */
        return index;
    };
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    Grid.prototype.getColumnFieldNames = function () {
        var columnNames = [];
        var column;
        for (var i = 0, len = this.getColumns().length; i < len; i++) {
            column = this.getColumns()[i];
            if (column.visible) {
                columnNames.push(column.field);
            }
        }
        return columnNames;
    };
    /**
     * Gets a compiled row template.
     * @return {Function}
     * @private
     */
    Grid.prototype.getRowTemplate = function () {
        return this.rowTemplateFn;
    };
    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    Grid.prototype.getDetailTemplate = function () {
        return this.detailTemplateFn;
    };
    /**
     * Gets a compiled detail row template.
     * @private
     * @return {Function}
     */
    Grid.prototype.getEditTemplate = function () {
        return this.editTemplateFn;
    };
    /**
     * Gets a compiled dialog edit header template.
     * @private
     * @return {Function}
     */
    Grid.prototype.getEditHeaderTemplate = function () {
        return this.editHeaderTemplateFn;
    };
    /**
     * Gets a compiled dialog edit footer template.
     * @private
     * @return {Function}
     */
    Grid.prototype.getEditFooterTemplate = function () {
        return this.editFooterTemplateFn;
    };
    /**
     * Get the names of the primary key columns of the Grid.
     * @return {string[]}
     */
    Grid.prototype.getPrimaryKeyFieldNames = function () {
        var keys = [];
        for (var k = 0; k < this.columnModel.length; k++) {
            if (this.columnModel[k].isPrimaryKey) {
                keys.push(this.columnModel[k].field);
            }
        }
        return keys;
    };
    /**
     * Refreshes the Grid header and content.
     */
    Grid.prototype.refresh = function () {
        this.headerModule.refreshUI();
        this.updateStackedFilter();
        this.renderModule.refresh();
    };
    /**
     * Refreshes the Grid header.
     */
    Grid.prototype.refreshHeader = function () {
        this.headerModule.refreshUI();
    };
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    Grid.prototype.getSelectedRows = function () {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    };
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    Grid.prototype.getSelectedRowIndexes = function () {
        return this.selectionModule ? this.selectionModule.selectedRowIndexes : [];
    };
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    Grid.prototype.getSelectedRowCellIndexes = function () {
        return this.selectionModule ? this.selectionModule.selectedRowCellIndexes : [];
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     * @isGenericType true
     */
    Grid.prototype.getSelectedRecords = function () {
        return this.selectionModule ? this.selectionModule.getSelectedRecords() : [];
    };
    /**
     * Gets the collection of selected columns uid.
     * @return {string[]}
     * @isGenericType true
     */
    Grid.prototype.getSelectedColumnsUid = function () {
        var _this = this;
        var uid = [];
        if (this.selectionModule) {
            this.selectionModule.selectedColumnsIndexes.filter(function (i) { return uid.push(_this.getColumns()[i].uid); });
        }
        return uid;
    };
    /**
     * Gets the data module.
     * @return {Data}
     */
    Grid.prototype.getDataModule = function () {
        return this.renderModule.data;
    };
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.showColumns = function (keys, showBy) {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    };
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    Grid.prototype.hideColumns = function (keys, hideBy) {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenColumns = function () {
        return this.frozenColumns + this.getFrozenCount(this.columns, 0, 0);
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenRightColumnsCount = function () {
        return this.frozenRightCount;
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenLeftColumnsCount = function () {
        return this.frozenLeftCount;
    };
    /**
     * @hidden
     */
    Grid.prototype.getMovableColumnsCount = function () {
        return this.movableCount;
    };
    /**
     * @hidden
     */
    Grid.prototype.setFrozenCount = function () {
        this.frozenLeftCount = this.frozenRightCount = this.movableCount = 0;
        this.visibleFrozenLeft = this.visibleFrozenRight = this.visibleMovable = 0;
        this.frozenLeftColumns = [];
        this.frozenRightColumns = [];
        this.movableColumns = [];
        this.splitFrozenCount(this.columns);
        if (this.frozenColumns && (this.frozenLeftCount || this.frozenRightCount)) {
            this.setProperties({ frozenColumns: 0 }, true);
        }
        this.setTablesCount();
        if (this.frozenLeftCount && !this.frozenRightCount) {
            this.frozenName = 'Left';
        }
        else if (this.frozenRightCount && !this.frozenLeftCount) {
            this.frozenName = 'Right';
        }
        else if (this.frozenLeftCount && this.frozenRightCount) {
            this.frozenName = 'Left-Right';
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.getVisibleFrozenLeftCount = function () {
        return this.visibleFrozenLeft;
    };
    /**
     * @hidden
     */
    Grid.prototype.getVisibleFrozenRightCount = function () {
        return this.visibleFrozenRight;
    };
    /**
     * @hidden
     */
    Grid.prototype.getVisibleMovableCount = function () {
        return this.visibleMovable;
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenRightColumns = function () {
        return this.frozenRightColumns;
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenLeftColumns = function () {
        return this.frozenLeftColumns;
    };
    /**
     * @hidden
     */
    Grid.prototype.getMovableColumns = function () {
        return this.movableColumns;
    };
    Grid.prototype.splitFrozenCount = function (columns) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].columns) {
                this.splitFrozenCount(columns[i].columns);
            }
            else {
                if (columns[i].freeze === 'Right') {
                    if (columns[i].visible !== false) {
                        this.visibleFrozenRight++;
                    }
                    
                    this.frozenRightColumns.push(columns[i]);
                    this.frozenRightCount++;
                }
                else if (columns[i].freeze === 'Left') {
                    if (columns[i].visible !== false) {
                        this.visibleFrozenLeft++;
                    }
                    
                    this.frozenLeftColumns.push(columns[i]);
                    this.frozenLeftCount++;
                }
                else {
                    if (columns[i].visible !== false) {
                        this.visibleMovable++;
                    }
                    
                    this.movableColumns.push(columns[i]);
                    this.movableCount++;
                }
            }
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.getVisibleFrozenColumns = function () {
        return this.getVisibleFrozenColumnsCount() + this.getVisibleFrozenCount(this.columns, 0);
    };
    /**
     * Get the current Filter operator and field.
     * @return {Object}
     */
    Grid.prototype.getFilterUIInfo = function () {
        return this.filterModule ? this.filterModule.getFilterUIInfo() : {};
    };
    Grid.prototype.getVisibleFrozenColumnsCount = function () {
        var visibleFrozenColumns = 0;
        var columns = this.columnModel;
        for (var i = 0; i < this.frozenColumns; i++) {
            if (columns[i].visible) {
                visibleFrozenColumns++;
            }
        }
        if (this.frozenLeftCount || this.frozenRightCount) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].visible && (columns[i].freeze === 'Left' || columns[i].freeze === 'Right')) {
                    visibleFrozenColumns++;
                }
            }
        }
        return visibleFrozenColumns;
    };
    Grid.prototype.getVisibleFrozenCount = function (cols, cnt) {
        if (!this.frozenLeftCount && !this.frozenRightCount) {
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].columns) {
                    cnt = this.getVisibleFrozenCount(cols[i].columns, cnt);
                }
                else {
                    if (cols[i].isFrozen && cols[i].visible) {
                        cnt++;
                    }
                }
            }
        }
        return cnt;
    };
    Grid.prototype.getFrozenCount = function (cols, cnt, index) {
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].columns) {
                cnt = this.getFrozenCount(cols[i].columns, cnt, index);
            }
            else {
                if (cols[i].isFrozen && index > this.frozenColumns - 1) {
                    cnt++;
                }
                index++;
            }
        }
        return cnt;
    };
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    Grid.prototype.goToPage = function (pageNo) {
        if (this.pagerModule) {
            this.pagerModule.goToPage(pageNo);
        }
    };
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    Grid.prototype.updateExternalMessage = function (message) {
        if (this.pagerModule) {
            this.pagerModule.updateExternalMessage(message);
        }
    };
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    Grid.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        if (this.sortModule) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        }
    };
    /**
     * Clears all the sorted columns of the Grid.
     * @return {void}
     */
    Grid.prototype.clearSorting = function () {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    };
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeSortColumn = function (field) {
        if (this.sortModule) {
            this.sortModule.removeSortColumn(field);
        }
    };
    /**
     * Filters grid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, the grid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    Grid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator) {
        if (this.filterModule) {
            this.filterModule.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent, actualFilterValue, actualOperator);
        }
    };
    /**
     * Clears all the filtered rows of the Grid.
     * @return {void}
     */
    Grid.prototype.clearFiltering = function (fields) {
        if (this.filterModule) {
            this.filterModule.clearFiltering(fields);
        }
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        if (this.filterModule) {
            this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
        }
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Grid.prototype.selectRow = function (index, isToggle) {
        if (this.selectionModule) {
            this.selectionModule.selectRow(index, isToggle);
        }
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    Grid.prototype.selectRows = function (rowIndexes) {
        if (this.selectionModule) {
            this.selectionModule.selectRows(rowIndexes);
        }
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    Grid.prototype.clearSelection = function () {
        if (this.selectionModule) {
            this.selectionModule.clearSelection();
        }
    };
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Grid.prototype.selectCell = function (cellIndex, isToggle) {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    };
    /**
     * Selects a range of cells from start and end indexes.
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     * @return {void}
     */
    Grid.prototype.selectCellsByRange = function (startIndex, endIndex) {
        this.selectionModule.selectCellsByRange(startIndex, endIndex);
    };
    /**
     * Searches Grid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    Grid.prototype.search = function (searchString) {
        if (this.searchModule) {
            this.searchModule.search(searchString);
        }
    };
    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     * @return {void}
     */
    Grid.prototype.print = function () {
        if (this.printModule) {
            this.printModule.print();
        }
    };
    /**
     * Delete a record with Given options. If fieldname and data is not given then grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldname - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    Grid.prototype.deleteRecord = function (fieldname, data) {
        if (this.editModule) {
            this.editModule.deleteRecord(fieldname, data);
        }
    };
    /**
     * Starts edit the selected row. At least one row must be selected before invoking this method.
     * `editSettings.allowEditing` should be true.
     * {% codeBlock src='grid/startEdit/index.md' %}{% endcodeBlock %}
     * @return {void}
     */
    Grid.prototype.startEdit = function () {
        if (this.editModule) {
            this.editModule.startEdit();
        }
    };
    /**
     * If Grid is in editable state, you can save a record by invoking endEdit.
     */
    Grid.prototype.endEdit = function () {
        if (this.editModule) {
            this.editModule.endEdit();
        }
    };
    /**
     * Cancels edited state.
     */
    Grid.prototype.closeEdit = function () {
        if (this.editModule) {
            this.editModule.closeEdit();
        }
    };
    /**
     * Adds a new record to the Grid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     */
    Grid.prototype.addRecord = function (data, index) {
        if (this.editModule) {
            this.editModule.addRecord(data, index);
        }
    };
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    Grid.prototype.deleteRow = function (tr) {
        if (this.editModule) {
            this.editModule.deleteRow(tr);
        }
    };
    /**
     * Changes a particular cell into edited state based on the row index and field name provided in the `batch` mode.
     * @param {number} index - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     */
    Grid.prototype.editCell = function (index, field) {
        if (this.editModule) {
            this.editModule.editCell(index, field);
        }
    };
    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     * {% codeBlock src='grid/saveCell/index.md' %}{% endcodeBlock %}
     */
    Grid.prototype.saveCell = function () {
        if (this.editModule) {
            this.editModule.saveCell();
        }
    };
    /**
     * To update the specified cell by given value without changing into edited state.
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    Grid.prototype.updateCell = function (rowIndex, field, value) {
        if (this.editModule) {
            this.editModule.updateCell(rowIndex, field, value);
        }
    };
    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     * {% codeBlock src='grid/updateRow/index.md' %}{% endcodeBlock %}
     */
    Grid.prototype.updateRow = function (index, data) {
        if (this.editModule) {
            this.editModule.updateRow(index, data);
        }
    };
    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    Grid.prototype.getBatchChanges = function () {
        if (this.editModule) {
            return this.editModule.getBatchChanges();
        }
        return {};
    };
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     * @return {void}
     */
    Grid.prototype.enableToolbarItems = function (items, isEnable) {
        if (this.toolbarModule) {
            this.toolbarModule.enableItems(items, isEnable);
        }
    };
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     */
    Grid.prototype.copy = function (withHeader) {
        if (this.clipboardModule) {
            this.clipboardModule.copy(withHeader);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.recalcIndentWidth = function () {
        var _this = this;
        if (!this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        if ((!this.groupSettings.columns.length && !this.isDetail() && !this.isRowDragable()) ||
            this.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
            !this.getContentTable()) {
            return;
        }
        var indentWidth = this.getHeaderTable().querySelector('.e-emptycell').parentElement.offsetWidth;
        var headerCol = [].slice.call(this.getHeaderTable().querySelector('colgroup').childNodes);
        var contentCol = [].slice.call(this.getContentTable().querySelector('colgroup').childNodes);
        var perPixel = indentWidth / 30;
        var i = this.getFrozenMode() === 'Right' ? this.frozenRightCount : 0;
        var parentOffset = this.element.offsetWidth;
        var applyWidth = function (index, width) {
            if (ispercentageWidth(_this)) {
                var newWidth = (width / parentOffset * 100).toFixed(1) + '%';
                headerCol[index].style.width = newWidth;
                contentCol[index].style.width = newWidth;
            }
            else {
                headerCol[index].style.width = width + 'px';
                contentCol[index].style.width = width + 'px';
            }
            _this.notify(columnWidthChanged, { index: index, width: width });
        };
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        if (this.enableColumnVirtualization || this.isAutoGen) {
            indentWidth = 30;
        }
        while (i < this.groupSettings.columns.length) {
            applyWidth(i, indentWidth);
            i++;
        }
        if (this.isDetail()) {
            applyWidth(i, indentWidth);
            i++;
        }
        if (this.isRowDragable()) {
            applyWidth(i, indentWidth);
        }
        this.isAutoGen = false;
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
    };
    /**
     * @hidden
     */
    Grid.prototype.resetIndentWidth = function () {
        if (ispercentageWidth(this)) {
            this.getHeaderTable().querySelector('.e-emptycell').removeAttribute('indentRefreshed');
            this.widthService.setWidthToColumns();
            this.recalcIndentWidth();
        }
        if ((this.width === 'auto' || typeof (this.width) === 'string' && this.width.indexOf('%') !== -1)
            && this.getColumns().filter(function (col) { return (!col.width || col.width === 'auto') && col.minWidth; }).length > 0) {
            var tgridWidth = this.widthService.getTableWidth(this.getColumns());
            this.widthService.setMinwidthBycalculation(tgridWidth);
        }
        if (this.isFrozenGrid() && this.widthService) {
            this.widthService.refreshFrozenScrollbar();
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.isRowDragable = function () {
        return this.allowRowDragAndDrop && !this.rowDropSettings.targetID && !this.enableVirtualization;
    };
    /**
     * Changes the Grid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    Grid.prototype.reorderColumns = function (fromFName, toFName) {
        if (this.reorderModule) {
            this.reorderModule.reorderColumns(fromFName, toFName);
        }
    };
    /**
     * Changes the Grid column positions by field index. If you invoke reorderColumnByIndex multiple times,
     * then you won't get the same results every time.
     * @param  {number} fromIndex - Defines the origin field index.
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void}
     */
    Grid.prototype.reorderColumnByIndex = function (fromIndex, toIndex) {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
        }
    };
    /**
     * Changes the Grid column positions by field index. If you invoke reorderColumnByTargetIndex multiple times,
     * then you will get the same results every time.
     * @param  {string} fieldName - Defines the field name.
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void}
     */
    Grid.prototype.reorderColumnByTargetIndex = function (fieldName, toIndex) {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
        }
    };
    /**
     * Changes the Grid Row position with given indexes.
     * @param  {number} fromIndexes - Defines the origin Indexes.
     * @param  {number} toIndex - Defines the destination Index.
     * @return {void}
     */
    Grid.prototype.reorderRows = function (fromIndexes, toIndex) {
        if (this.rowDragAndDropModule) {
            this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.refreshDataSource = function (e, args) {
        this.notify('refreshdataSource', e);
    };
    /**
     * @hidden
     */
    Grid.prototype.disableRowDD = function (enable) {
        var headerTable = this.getHeaderTable();
        var contentTable = this.getContentTable();
        var headerRows = headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell');
        var rows = this.getRows();
        var disValue = enable ? 'none' : '';
        sf.base.setStyleAttribute(headerTable.querySelector('colgroup').childNodes[0], { 'display': disValue });
        sf.base.setStyleAttribute(contentTable.querySelector('colgroup').childNodes[0], { 'display': disValue });
        for (var i = 0; i < this.getRows().length; i++) {
            var ele = rows[i].firstElementChild;
            enable ? sf.base.addClass([ele], 'e-hide') : sf.base.removeClass([ele], ['e-hide']);
        }
        for (var j = 0; j < headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell').length; j++) {
            var ele = headerRows[j];
            enable ? sf.base.addClass([ele], 'e-hide') : sf.base.removeClass([ele], ['e-hide']);
        }
    };
    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     * ```typescript
     * <div id="Grid"></div>
     * <script>
     * let gridObj: Grid = new Grid({
     *     dataSource: employeeData,
     *     columns: [
     *         { field: 'OrderID', headerText: 'Order ID', width:100 },
     *         { field: 'EmployeeID', headerText: 'Employee ID' }],
     *     dataBound: () => gridObj.autoFitColumns('EmployeeID')
     * });
     * gridObj.appendTo('#Grid');
     * </script>
     * ```
     *
     */
    Grid.prototype.autoFitColumns = function (fieldNames) {
        if (this.resizeModule) {
            this.resizeModule.autoFitColumns(fieldNames);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.createColumnchooser = function (x, y, target) {
        if (this.columnChooserModule) {
            this.columnChooserModule.renderColumnChooser(x, y, target);
        }
    };
    Grid.prototype.initializeServices = function () {
        this.serviceLocator.register('widthService', this.widthService = new ColumnWidthService(this));
        this.serviceLocator.register('cellRendererFactory', new CellRendererFactory);
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('localization', this.localeObj = new sf.base.L10n(this.getModuleName(), this.defaultLocale, this.locale));
        this.serviceLocator.register('valueFormatter', this.valueFormatterService = new ValueFormatter(this.locale));
        this.serviceLocator.register('showHideService', this.showHider = new ShowHide(this));
        this.serviceLocator.register('ariaService', this.ariaService = new AriaService());
        this.serviceLocator.register('focus', this.focusModule = new FocusStrategy(this));
    };
    Grid.prototype.processModel = function () {
        var gCols = this.groupSettings.columns;
        var sCols = this.sortSettings.columns;
        var flag;
        var j;
        if (this.allowGrouping) {
            var _loop_1 = function (i, len) {
                j = 0;
                for (var sLen = sCols.length; j < sLen; j++) {
                    if (sCols[j].field === gCols[i]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    sCols.push({ field: gCols[i], direction: 'Ascending', isFromGroup: true });
                }
                else {
                    if (this_1.allowSorting) {
                        this_1.sortedColumns.push(sCols[j].field);
                    }
                    else {
                        sCols[j].direction = 'Ascending';
                    }
                }
                if (!this_1.groupSettings.showGroupedColumn) {
                    var column = this_1.enableColumnVirtualization ?
                        this_1.columns.filter(function (c) { return c.field === gCols[i]; })[0] : this_1.getColumnByField(gCols[i]);
                    if (column) {
                        column.visible = false;
                    }
                    else {
                        this_1.log('initial_action', { moduleName: 'group', columnName: gCols[i] });
                    }
                }
            };
            var this_1 = this;
            for (var i = 0, len = gCols.length; i < len; i++) {
                _loop_1(i, len);
            }
        }
        if (!gCols.length) {
            for (var i = 0; i < sCols.length; i++) {
                this.sortedColumns.push(sCols[i].field);
            }
        }
        this.rowTemplateFn = templateCompiler(this.rowTemplate);
        this.detailTemplateFn = templateCompiler(this.detailTemplate);
        this.editTemplateFn = templateCompiler(this.editSettings.template);
        this.editHeaderTemplateFn = templateCompiler(this.editSettings.headerTemplate);
        this.editFooterTemplateFn = templateCompiler(this.editSettings.footerTemplate);
        if (!sf.base.isNullOrUndefined(this.parentDetails)) {
            var value = sf.base.isNullOrUndefined(this.parentDetails.parentKeyFieldValue) ? 'undefined' :
                this.parentDetails.parentKeyFieldValue;
            this.query.where(this.queryString, 'equal', value, true);
        }
        this.initForeignColumn();
    };
    Grid.prototype.initForeignColumn = function () {
        if (this.isForeignKeyEnabled(this.getColumns())) {
            this.notify(initForeignKeyColumn, this.getForeignKeyColumns());
        }
    };
    Grid.prototype.gridRender = function () {
        this.updateRTL();
        if (this.enableHover) {
            this.element.classList.add('e-gridhover');
        }
        if (sf.base.Browser.isDevice) {
            this.element.classList.add('e-device');
        }
        if (this.rowHeight) {
            this.element.classList.add('e-grid-min-height');
        }
        sf.base.classList(this.element, ['e-responsive', 'e-default'], []);
        var rendererFactory = this.serviceLocator.getService('rendererFactory');
        this.headerModule = rendererFactory.getRenderer(RenderType.Header);
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.printModule = new Print(this, this.scrollModule);
        this.clipboardModule = new Clipboard(this);
        this.renderModule.render();
        this.eventInitializer();
        this.createGridPopUpElement();
        this.widthService.setWidthToColumns();
        this.updateGridLines();
        this.applyTextWrap();
        this.createTooltip(); //for clip mode ellipsis
        this.enableBoxSelection();
    };
    Grid.prototype.dataReady = function () {
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        if (this.height !== 'auto') {
            this.scrollModule.setPadding();
        }
    };
    Grid.prototype.updateRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    Grid.prototype.createGridPopUpElement = function () {
        var popup = this.createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
        var content = this.createElement('div', { className: 'e-content', attrs: { tabIndex: '-1' } });
        sf.base.append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        sf.base.append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        this.element.appendChild(popup);
    };
    Grid.prototype.updateGridLines = function () {
        sf.base.classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
        switch (this.gridLines) {
            case 'Horizontal':
                this.element.classList.add('e-horizontallines');
                break;
            case 'Vertical':
                this.element.classList.add('e-verticallines');
                break;
            case 'None':
                this.element.classList.add('e-hidelines');
                break;
            case 'Both':
                this.element.classList.add('e-bothlines');
                break;
        }
        this.updateResizeLines();
    };
    Grid.prototype.updateResizeLines = function () {
        if (this.allowResizing &&
            !(this.gridLines === 'Vertical' || this.gridLines === 'Both')) {
            this.element.classList.add('e-resize-lines');
        }
        else {
            this.element.classList.remove('e-resize-lines');
        }
    };
    /**
     * The function is used to apply text wrap
     * @return {void}
     * @hidden
     */
    Grid.prototype.applyTextWrap = function () {
        if (this.allowTextWrap) {
            var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
            switch (this.textWrapSettings.wrapMode) {
                case 'Header':
                    wrap(this.element, false);
                    wrap(this.getContent(), false);
                    wrap(headerRows, true);
                    break;
                case 'Content':
                    wrap(this.getContent(), true);
                    wrap(this.element, false);
                    wrap(headerRows, false);
                    break;
                default:
                    wrap(this.element, true);
                    wrap(this.getContent(), false);
                    wrap(headerRows, false);
            }
            if (this.textWrapSettings.wrapMode !== 'Content') {
                this.notify(refreshHandlers, {});
            }
        }
    };
    /**
     * The function is used to remove text wrap
     * @return {void}
     * @hidden
     */
    Grid.prototype.removeTextWrap = function () {
        wrap(this.element, false);
        var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
        wrap(headerRows, false);
        wrap(this.getContent(), false);
        if (this.textWrapSettings.wrapMode !== 'Content') {
            this.notify(refreshHandlers, {});
        }
    };
    /**
     * The function is used to add Tooltip to the grid cell that has ellipsiswithtooltip clip mode.
     * @return {void}
     * @hidden
     */
    Grid.prototype.createTooltip = function () {
        this.toolTipObj = new sf.popups.Tooltip({ opensOn: 'custom', content: '' }, this.element);
    };
    /** @hidden */
    Grid.prototype.freezeRefresh = function () {
        if (this.enableVirtualization) {
            this.pageSettings.currentPage = 1;
        }
        this.componentRefresh();
    };
    Grid.prototype.getTooltipStatus = function (element) {
        var width;
        var headerTable = this.getHeaderTable();
        var contentTable = this.getContentTable();
        var headerDivTag = 'e-gridheader';
        var htable = this.createTable(headerTable, headerDivTag, 'header');
        var ctable = this.createTable(headerTable, headerDivTag, 'content');
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
    Grid.prototype.mouseMoveHandler = function (e) {
        if (this.isEllipsisTooltip()) {
            var element = parentsUntil(e.target, 'e-ellipsistooltip');
            if (this.prevElement !== element || e.type === 'mouseout') {
                this.toolTipObj.close();
            }
            var tagName = e.target.tagName;
            var elemNames = ['A', 'BUTTON', 'INPUT'];
            if (element && e.type !== 'mouseout' && !(sf.base.Browser.isDevice && elemNames.indexOf(tagName) !== -1)) {
                if (element.getAttribute('aria-describedby')) {
                    return;
                }
                if (this.getTooltipStatus(element)) {
                    if (element.getElementsByClassName('e-headertext').length) {
                        this.toolTipObj.content = element.getElementsByClassName('e-headertext')[0].innerText;
                    }
                    else {
                        this.toolTipObj.content = element.innerText;
                    }
                    this.prevElement = element;
                    this.toolTipObj.open(element);
                }
            }
        }
        this.hoverFrozenRows(e);
    };
    /** @hidden */
    Grid.prototype.hoverFrozenRows = function (e) {
        if (this.isFrozenGrid()) {
            var row = parentsUntil(e.target, 'e-row');
            if ([].slice.call(this.element.querySelectorAll('.e-frozenhover')).length && e.type === 'mouseout') {
                var rows = [].slice.call(this.element.querySelectorAll('.e-frozenhover'));
                for (var i = 0; i < rows.length; i++) {
                    rows[i].classList.remove('e-frozenhover');
                }
            }
            else if (row) {
                var rows = [].slice.call(this.element.querySelectorAll('tr[aria-rowindex="' + row.getAttribute('aria-rowindex') + '"]'));
                rows.splice(rows.indexOf(row), 1);
                for (var i = 0; i < rows.length; i++) {
                    if (row.getAttribute('aria-selected') != 'true' && rows[i]) {
                        rows[i].classList.add('e-frozenhover');
                    }
                    else if (rows[i]) {
                        rows[i].classList.remove('e-frozenhover');
                    }
                }
            }
        }
    };
    Grid.prototype.isEllipsisTooltip = function () {
        var cols = this.getColumns();
        if (this.clipMode === 'EllipsisWithTooltip') {
            return true;
        }
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].clipMode === 'EllipsisWithTooltip') {
                return true;
            }
        }
        return false;
    };
    Grid.prototype.scrollHandler = function () {
        if (this.isEllipsisTooltip()) {
            this.toolTipObj.close();
        }
    };
    /**
     * To create table for ellipsiswithtooltip
     * @hidden
     */
    Grid.prototype.createTable = function (table, tag, type) {
        var myTableDiv = this.createElement('div');
        myTableDiv.className = this.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = this.createElement('div');
        mySubDiv.className = tag;
        var myTable = this.createElement('table');
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var ele = (type === 'header') ? 'th' : 'td';
        var myTr = this.createElement('tr');
        var mytd = this.createElement(ele);
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    };
    Grid.prototype.onKeyPressed = function (e) {
        if (e.action === 'tab' || e.action === 'shiftTab') {
            this.toolTipObj.close();
        }
    };
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    Grid.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        sf.base.EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        sf.base.EventHandler.add(this.element, 'dblclick', this.dblClickHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyPressHandler, this);
        /* tslint:disable-next-line:no-any */
        sf.base.EventHandler.add(window, 'resize', this.resetIndentWidth, this);
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
        this.keyboardModule = new sf.base.KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
        sf.base.EventHandler.add(this.getContent().firstElementChild, 'scroll', this.scrollHandler, this);
        sf.base.EventHandler.add(this.element, 'mousemove', this.mouseMoveHandler, this);
        sf.base.EventHandler.add(this.element, 'mouseout', this.mouseMoveHandler, this);
        sf.base.EventHandler.add(this.getContent(), 'touchstart', this.tapEvent, this);
        sf.base.EventHandler.add(document.body, 'keydown', this.keyDownHandler, this);
    };
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    Grid.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        sf.base.EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        sf.base.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        sf.base.EventHandler.remove(this.element, 'dblclick', this.dblClickHandler);
        sf.base.EventHandler.remove(this.getContent().firstElementChild, 'scroll', this.scrollHandler);
        sf.base.EventHandler.remove(this.element, 'mousemove', this.mouseMoveHandler);
        sf.base.EventHandler.remove(this.element, 'mouseout', this.mouseMoveHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyPressHandler);
        sf.base.EventHandler.remove(this.getContent(), 'touchstart', this.tapEvent);
        sf.base.EventHandler.remove(document.body, 'keydown', this.keyDownHandler);
        /* tslint:disable-next-line:no-any */
        sf.base.EventHandler.remove(window, 'resize', this.resetIndentWidth);
    };
    /**
     * @hidden
     */
    Grid.prototype.addListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.on(dataReady, this.dataReady, this);
        this.on(contentReady, this.recalcIndentWidth, this);
        this.on(headerRefreshed, this.recalcIndentWidth, this);
        this.dataBoundFunction = this.refreshMediaCol.bind(this);
        this.addEventListener(dataBound, this.dataBoundFunction);
        this.on(keyPressed, this.onKeyPressed, this);
        this.on(contentReady, this.blazorTemplate, this);
    };
    /**
     * @hidden
     */
    Grid.prototype.removeListener = function () {
        if (this.isDestroyed) {
            return;
        }
        this.off(dataReady, this.dataReady);
        this.off(contentReady, this.recalcIndentWidth);
        this.off(headerRefreshed, this.recalcIndentWidth);
        this.removeEventListener(dataBound, this.dataBoundFunction);
        this.off(keyPressed, this.onKeyPressed);
    };
    Grid.prototype.blazorTemplate = function () {
        if (sf.base.isBlazor()) {
            if (this.pageSettings.template) {
                sf.base.updateBlazorTemplate(this.element.id + "_template", 'Template', this.pageSettings);
            }
            for (var i = 0; i < this.columnModel.length; i++) {
                if (this.columnModel[i].template) {
                    sf.base.updateBlazorTemplate(this.element.id + this.columnModel[i].uid, 'Template', this.columnModel[i], false);
                }
                if (this.columnModel[i].headerTemplate) {
                    sf.base.updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'headerTemplate', 'HeaderTemplate', this.columnModel[i], false);
                }
                if (this.filterSettings.type == 'FilterBar' && this.columnModel[i].filterTemplate) {
                    var fieldName = this.columnModel[i].field;
                    var tempID = this.element.id + this.columnModel[i].uid + 'filterTemplate';
                    var filteredColumns = this.filterSettings.columns;
                    for (var k = 0; k < filteredColumns.length; k++) {
                        if (fieldName == filteredColumns[k].field) {
                            sf.base.blazorTemplates[tempID][0][fieldName] = filteredColumns[k].value;
                        }
                    }
                    sf.base.updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'filterTemplate', 'FilterTemplate', this.columnModel[i], false);
                }
                if (this.filterSettings.type != 'FilterBar' && this.columnModel[i].filterTemplate) {
                    sf.base.updateBlazorTemplate(this.element.id + this.columnModel[i].uid + 'filterTemplate', 'FilterTemplate', this.columnModel[i]);
                }
            }
            if (this.groupSettings.captionTemplate) {
                sf.base.updateBlazorTemplate(this.element.id + 'captionTemplate', 'CaptionTemplate', this.groupSettings);
            }
            var guid = 'guid';
            for (var k = 0; k < this.aggregates.length; k++) {
                for (var j = 0; j < this.aggregates[k].columns.length; j++) {
                    if (this.aggregates[k].columns[j].footerTemplate) {
                        sf.base.updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'footerTemplate', 'FooterTemplate', this.aggregates[k].columns[j]);
                    }
                    if (this.aggregates[k].columns[j].groupFooterTemplate) {
                        sf.base.updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'groupFooterTemplate', 'GroupFooterTemplate', this.aggregates[k].columns[j]);
                    }
                    if (this.aggregates[k].columns[j].groupCaptionTemplate) {
                        sf.base.updateBlazorTemplate(this.element.id + this.aggregates[k].columns[j][guid] + 'groupCaptionTemplate', 'GroupCaptionTemplate', this.aggregates[k].columns[j]);
                    }
                }
            }
        }
    };
    /**
     * Get current visible data of grid.
     * @return {Object[]}
     * @isGenericType true
     */
    Grid.prototype.getCurrentViewRecords = function () {
        if (isGroupAdaptive(this)) {
            return sf.base.isNullOrUndefined(this.currentViewData.records) ?
                this.currentViewData : this.currentViewData.records;
        }
        if (this.groupSettings.enableLazyLoading) {
            return this.currentViewData;
        }
        
        return (this.allowGrouping && this.groupSettings.columns.length && this.currentViewData.length && this.currentViewData.records) ?
            this.currentViewData.records : this.currentViewData;
    };
    Grid.prototype.mouseClickHandler = function (e) {
        if (this.isChildGrid(e) || (parentsUntil(e.target, 'e-gridpopup') && e.touches) ||
            this.element.querySelectorAll('.e-cloneproperties').length || this.checkEdit(e)) {
            return;
        }
        if (((!this.allowRowDragAndDrop && (parentsUntil(e.target, 'e-gridcontent') ||
            e.target.tagName === 'TD')) || (!(this.allowGrouping || this.allowReordering) &&
            parentsUntil(e.target, 'e-gridheader'))) && e.touches) {
            return;
        }
        if (parentsUntil(e.target, 'e-gridheader') && this.allowRowDragAndDrop &&
            !(parentsUntil(e.target, 'e-filterbarcell'))) {
            e.preventDefault();
        }
        var args = this.getRowInfo(e.target);
        var cancel = 'cancel';
        args[cancel] = false;
        var isDataRow = false;
        var tr = sf.base.closest(e.target, 'tr');
        if (tr && tr.getAttribute('data-uid')) {
            var rowObj = this.getRowObjectFromUID(tr.getAttribute('data-uid'));
            isDataRow = rowObj ? rowObj.isDataRow : false;
        }
        if (sf.base.isBlazor()) {
            var clonedColumn = sf.base.extend({}, args.column);
            args = { rowData: args.rowData, rowIndex: args.rowIndex,
                cellIndex: args.cellIndex, column: clonedColumn };
        }
        if (isDataRow) {
            this.trigger(recordClick, args);
        }
        this.notify(click, e);
    };
    Grid.prototype.checkEdit = function (e) {
        var tr = parentsUntil(e.target, 'e-row');
        var isEdit = this.editSettings.mode !== 'Batch' &&
            this.isEdit && tr && (tr.classList.contains('e-editedrow') || tr.classList.contains('e-addedrow'));
        return !parentsUntil(e.target, 'e-unboundcelldiv') && (isEdit || (parentsUntil(e.target, 'e-rowcell') &&
            parentsUntil(e.target, 'e-rowcell').classList.contains('e-editedbatchcell')));
    };
    Grid.prototype.dblClickHandler = function (e) {
        var grid = parentsUntil(e.target, 'e-grid');
        if (sf.base.isNullOrUndefined(grid) || grid.id !== this.element.id || sf.base.closest(e.target, '.e-unboundcelldiv')) {
            return;
        }
        var dataRow = false;
        var tr = sf.base.closest(e.target, 'tr');
        if (tr && tr.getAttribute('data-uid')) {
            var rowObj = this.getRowObjectFromUID(tr.getAttribute('data-uid'));
            dataRow = rowObj ? rowObj.isDataRow : false;
        }
        var args = this.getRowInfo(e.target);
        args.target = e.target;
        if (dataRow) {
            this.trigger(recordDoubleClick, args);
        }
        this.notify(dblclick, e);
    };
    Grid.prototype.focusOutHandler = function (e) {
        if (this.isChildGrid(e)) {
            return;
        }
        if (!parentsUntil(e.target, 'e-grid')) {
            this.element.querySelector('.e-gridpopup').style.display = 'None';
        }
        var filterClear = this.element.querySelector('.e-cancel:not(.e-hide)');
        if (filterClear) {
            filterClear.classList.add('e-hide');
        }
        var relatedTarget = e.relatedTarget;
        var ariaOwns = relatedTarget ? relatedTarget.getAttribute('aria-owns') : null;
        if ((!relatedTarget || (!parentsUntil(relatedTarget, 'e-grid') &&
            (!sf.base.isNullOrUndefined(ariaOwns) &&
                (ariaOwns)) !== e.target.getAttribute('aria-owns')))
            && !this.keyPress && this.isEdit && !sf.base.Browser.isDevice) {
            if (this.editSettings.mode === 'Batch') {
                this.editModule.saveCell();
                this.notify(editNextValCell, {});
            }
            if (this.editSettings.mode === 'Normal') {
                this.editModule.editFormValidate();
            }
        }
        this.keyPress = false;
    };
    Grid.prototype.isChildGrid = function (e) {
        var gridElement = parentsUntil(e.target, 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return true;
        }
        return false;
    };
    /**
     * @hidden
     */
    Grid.prototype.mergePersistGridData = function (persistedData) {
        var data = this.getLocalData();
        if (!(sf.base.isNullOrUndefined(data) || (data === '')) || !sf.base.isNullOrUndefined(persistedData)) {
            var dataObj = !sf.base.isNullOrUndefined(persistedData) ? persistedData : JSON.parse(data);
            if (this.enableVirtualization) {
                dataObj.pageSettings.currentPage = 1;
            }
            var keys = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((typeof this[key] === 'object') && !sf.base.isNullOrUndefined(this[key])) {
                    if (Array.isArray(this[key]) && key === 'columns') {
                        if (!(sf.base.isBlazor() && this.isServerRendered)) {
                            setColumnIndex(this[key]);
                        }
                        this.mergeColumns(dataObj[key], this[key]);
                        this[key] = dataObj[key];
                    }
                    else {
                        sf.base.extend(this[key], dataObj[key]);
                    }
                }
                else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    };
    Grid.prototype.mergeColumns = function (storedColumn, columns) {
        var storedColumns = storedColumn;
        var _loop_2 = function (i) {
            var localCol = columns.filter(function (tCol) { return tCol.index === storedColumns[i].index; })[0];
            if (!sf.base.isNullOrUndefined(localCol)) {
                if (localCol.columns && localCol.columns.length) {
                    this_2.mergeColumns(storedColumns[i].columns, localCol.columns);
                    storedColumns[i] = sf.base.extend(localCol, storedColumns[i], {}, true);
                }
                else {
                    if (sf.base.isBlazor()) {
                        var guid = 'guid';
                        storedColumns[i][guid] = localCol[guid];
                        storedColumns[i].uid = localCol.uid;
                    }
                    storedColumns[i] = sf.base.extend(localCol, storedColumns[i], {}, true);
                }
            }
        };
        var this_2 = this;
        for (var i = 0; i < storedColumns.length; i++) {
            _loop_2(i);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.isDetail = function () {
        return !sf.base.isNullOrUndefined(this.detailTemplate) || !sf.base.isNullOrUndefined(this.childGrid);
    };
    Grid.prototype.isCommandColumn = function (columns) {
        var _this = this;
        return columns.some(function (col) {
            if (col.columns) {
                return _this.isCommandColumn(col.columns);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    };
    Grid.prototype.isForeignKeyEnabled = function (columns) {
        var _this = this;
        return columns.some(function (col) {
            if (col.columns) {
                return _this.isForeignKeyEnabled(col.columns);
            }
            return !!(col.dataSource && col.foreignKeyValue);
        });
    };
    Grid.prototype.keyPressHandler = function (e) {
        var presskey = sf.base.extend(e, { cancel: false, });
        this.trigger("keyPressed", presskey);
        if (presskey.cancel === true) {
            e.stopImmediatePropagation();
        }
    };
    Grid.prototype.keyDownHandler = function (e) {
        if (e.altKey) {
            if (e.keyCode === 74) { //alt j
                if (this.keyA) { //alt A J
                    this.notify(groupCollapse, { target: e.target, collapse: false });
                    this.keyA = false;
                }
                else {
                    this.focusModule.focusHeader();
                    this.focusModule.addOutline();
                }
            }
            if (e.keyCode === 87) { //alt w
                this.focusModule.focusContent();
                this.focusModule.addOutline();
            }
            if (e.keyCode === 65) { //alt A
                this.keyA = true;
            }
            if (e.keyCode === 72 && this.keyA) { //alt A H
                this.notify(groupCollapse, { target: e.target, collapse: true });
                this.keyA = false;
            }
        }
    };
    Grid.prototype.keyActionHandler = function (e) {
        if (this.isChildGrid(e) ||
            (this.isEdit && e.action !== 'escape' && e.action !== 'enter' && e.action !== 'shiftEnter'
                && e.action !== 'tab' && e.action !== 'shiftTab')) {
            return;
        }
        else {
            this.keyPress = true;
        }
        if (this.allowKeyboard) {
            if (e.action === 'ctrlPlusP') {
                e.preventDefault();
                this.print();
            }
            this.notify(keyPressed, e);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.setInjectedModules = function (modules) {
        this.injectedModules = modules;
    };
    Grid.prototype.updateColumnObject = function () {
        prepareColumns(this.columns, this.enableColumnVirtualization, this);
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            setColumnIndex(this.columns);
        }
        this.initForeignColumn();
        this.notify(autoCol, {});
    };
    /**
     * Gets the foreign columns from Grid.
     * @return {Column[]}
     * @blazorType List<GridColumn>
     */
    Grid.prototype.getForeignKeyColumns = function () {
        return this.getColumns().filter(function (col) {
            return col.isForeignColumn();
        });
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowHeight = function () {
        return this.rowHeight ? this.rowHeight : getRowHeight(this.element);
    };
    /**
     * Refreshes the Grid column changes.
     */
    Grid.prototype.refreshColumns = function () {
        this.setFrozenCount();
        var fCnt = this.getContent().querySelector('.e-frozen-left-content');
        var frCnt = this.getContent().querySelector('.e-frozen-right-content');
        var isColFrozen = !this.frozenRightCount && !this.frozenLeftCount;
        var isFrozen = this.getFrozenColumns() !== 0;
        if (!isFrozen && ((!fCnt && this.frozenLeftCount) || (!frCnt && this.frozenRightCount) || (fCnt && !this.frozenLeftCount)
            || (frCnt && !this.frozenRightCount))) {
            this.tableIndex = 0;
            this.tablesCount = 1;
            if (this.enableColumnVirtualization) {
                this.columnModel = [];
                this.updateColumnModel(this.columns);
            }
            this.freezeRefresh();
        }
        else if (isColFrozen && ((this.getFrozenColumns() === 1 && !fCnt) || (this.getFrozenColumns() === 0 && fCnt))) {
            this.tableIndex = 0;
            this.tablesCount = 1;
            if (this.enableColumnVirtualization) {
                this.columnModel = [];
                this.updateColumnModel(this.columns);
            }
            this.freezeRefresh();
        }
        else {
            this.isPreventScrollEvent = true;
            this.updateColumnObject();
            this.checkLockColumns(this.getColumns());
            this.refresh();
            if (this.isFrozenGrid()) {
                var mTbl = this.contentModule.getMovableContent().querySelector('.e-table');
                sf.base.remove(mTbl.querySelector('colgroup'));
                var colGroup = ((this.getHeaderContent()
                    .querySelector('.e-movableheader').querySelector('colgroup')).cloneNode(true));
                mTbl.insertBefore(colGroup, mTbl.querySelector('tbody'));
                if (this.getFrozenMode() === 'Left-Right') {
                    var frTbl = this.contentModule.getFrozenRightContent().querySelector('.e-table');
                    sf.base.remove(frTbl.querySelector('colgroup'));
                    var colGrp = ((this.getHeaderContent()
                        .querySelector('.e-frozen-right-header').querySelector('colgroup')).cloneNode(true));
                    frTbl.insertBefore(colGrp, frTbl.querySelector('tbody'));
                }
            }
        }
        if (this.isFrozenGrid()) {
            var left = this.getContent().querySelector('.e-movablescrollbar').scrollLeft;
            this.headerModule.getMovableHeader().scrollLeft = left;
            this.contentModule.getMovableContent().scrollLeft = left;
        }
    };
    /**
     * Export Grid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    Grid.prototype.excelExport = function (excelExportProperties, isMultipleExport, 
    /* tslint:disable-next-line:no-any */
    workbook, isBlob) {
        if (sf.base.isBlazor()) {
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, false, isBlob);
            return null;
        }
        return this.excelExportModule ?
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, false, isBlob) : null;
    };
    /**
     * Export Grid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    Grid.prototype.csvExport = function (excelExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, workbook, isBlob) {
        if (sf.base.isBlazor()) {
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, true, isBlob);
            return null;
        }
        return this.excelExportModule ?
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, true, isBlob) : null;
    };
    /**
     * Export Grid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    Grid.prototype.pdfExport = function (pdfExportProperties, 
    /* tslint:disable-next-line:no-any */
    isMultipleExport, pdfDoc, isBlob) {
        if (sf.base.isBlazor()) {
            this.pdfExportModule.Map(this, pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
            return null;
        }
        return this.pdfExportModule ? this.pdfExportModule.Map(this, pdfExportProperties, isMultipleExport, pdfDoc, isBlob) : null;
    };
    /**
     * Groups a column by column name.
     * @param  {string} columnName - Defines the column name to group.
     * @return {void}
     */
    Grid.prototype.groupColumn = function (columnName) {
        if (this.groupModule) {
            this.groupModule.groupColumn(columnName);
        }
    };
    /**
     * Expands all the grouped rows of the Grid.
     * @return {void}
     */
    Grid.prototype.groupExpandAll = function () {
        if (this.groupModule) {
            this.groupModule.expandAll();
        }
    };
    /**
    * Collapses all the grouped rows of the Grid.
    * @return {void}
    */
    Grid.prototype.groupCollapseAll = function () {
        if (this.groupModule) {
            this.groupModule.collapseAll();
        }
    };
    /**
     * Expands or collapses grouped rows by target element.
     * @param  {Element} target - Defines the target element of the grouped row.
     * @return {void}
     */
    // public expandCollapseRows(target: Element): void {
    //     if (this.groupModule) {
    //         this.groupModule.expandCollapseRows(target);
    //     }
    // }
    /**
     * Clears all the grouped columns of the Grid.
     * @return {void}
     */
    Grid.prototype.clearGrouping = function () {
        if (this.groupModule) {
            this.groupModule.clearGrouping();
        }
    };
    /**
     * Ungroups a column by column name.
     * @param  {string} columnName - Defines the column name to ungroup.
     * {% codeBlock src='grid/ungroupColumn/index.md' %}{% endcodeBlock %}
     * @return {void}
     */
    Grid.prototype.ungroupColumn = function (columnName) {
        if (this.groupModule) {
            this.groupModule.ungroupColumn(columnName);
        }
    };
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    Grid.prototype.openColumnChooser = function (x, y) {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    };
    Grid.prototype.scrollRefresh = function () {
        var _this = this;
        var refresh = function () {
            _this.scrollModule.refresh();
            _this.off(contentReady, refresh);
        };
        this.on(contentReady, refresh, this);
    };
    /**
     * Collapses a detail row with the given target.
     * @param  {Element} target - Defines the expanded element to collapse.
     * @return {void}
     */
    // public detailCollapse(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.collapse(target);
    //     }
    // }
    /**
     * Collapses all the detail rows of the Grid.
     * @return {void}
     */
    Grid.prototype.detailCollapseAll = function () {
        if (this.detailRowModule) {
            this.detailRowModule.collapseAll();
        }
    };
    /**
     * Expands a detail row with the given target.
     * @param  {Element} target - Defines the collapsed element to expand.
     * @return {void}
     */
    // public detailExpand(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.expand(target);
    //     }
    // }
    /**
    * Expands all the detail rows of the Grid.
    * @return {void}
    */
    Grid.prototype.detailExpandAll = function () {
        if (this.detailRowModule) {
            this.detailRowModule.expandAll();
        }
    };
    /**
     * Deselects the currently selected cells.
     * @return {void}
     */
    Grid.prototype.clearCellSelection = function () {
        if (this.selectionModule) {
            this.selectionModule.clearCellSelection();
        }
    };
    /**
     * Deselects the currently selected rows.
     * @return {void}
     */
    Grid.prototype.clearRowSelection = function () {
        if (this.selectionModule) {
            this.selectionModule.clearRowSelection();
        }
    };
    /**
     * Selects a collection of cells by row and column indexes.
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    Grid.prototype.selectCells = function (rowCellIndexes) {
        if (this.selectionModule) {
            this.selectionModule.selectCells(rowCellIndexes);
        }
    };
    /**
     * Selects a range of rows from start and end row indexes.
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @return {void}
     */
    Grid.prototype.selectRowsByRange = function (startIndex, endIndex) {
        if (this.selectionModule) {
            this.selectionModule.selectRowsByRange(startIndex, endIndex);
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.isContextMenuOpen = function () {
        return this.contextMenuModule && this.contextMenuModule.isOpen;
    };
    /**
     * @hidden
     */
    Grid.prototype.ensureModuleInjected = function (module) {
        return this.getInjectedModules().indexOf(module) >= 0;
    };
    /**
     * Destroys the given template reference.
     * @param {string[]} propertyNames - Defines the collection of template name.
     */
    //tslint:disable-next-line:no-any
    Grid.prototype.destroyTemplate = function (propertyNames, index) {
        this.clearTemplate(propertyNames, index);
    };
    /**
     * @hidden
     * @private
     */
    Grid.prototype.log = function (type, args) {
        this.loggerModule ? this.loggerModule.log(type, args) : (function () { return 0; })();
    };
    /**
     * @hidden
     */
    Grid.prototype.applyBiggerTheme = function (element) {
        if (this.element.classList.contains('e-bigger')) {
            element.classList.add('e-bigger');
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.getPreviousRowData = function () {
        var previousRowData = this.getRowsObject()[this.getRows().length - 1].data;
        return previousRowData;
    };
    /**
     * Hides the scrollbar placeholder of Grid content when grid content is not overflown.
     * @return {void}
     */
    Grid.prototype.hideScroll = function () {
        var content = this.getContent().querySelector('.e-content');
        var scrollBar = this.getContent().querySelector('.e-scrollbar');
        if (content.scrollHeight <= content.clientHeight) {
            this.scrollModule.removePadding();
            content.style.overflowY = 'auto';
        }
        if (this.isFrozenGrid() && scrollBar) {
            var mvblScrollBar = this.getContent().querySelector('.e-movablescrollbar');
            var mvblChild = this.getContent().querySelector('.e-movablechild');
            scrollBar.style.display = 'flex';
            if (mvblScrollBar.offsetWidth >= mvblChild.offsetWidth) {
                scrollBar.style.display = 'none';
                this.notify(frozenHeight, 0);
            }
        }
    };
    /**
     * Get row index by primary key or row data.
     * @param  {string} value - Defines the primary key value.
     * @param  {Object} value - Defines the row data.
     */
    Grid.prototype.getRowIndexByPrimaryKey = function (value) {
        var pkName = this.getPrimaryKeyFieldNames()[0];
        value = typeof value === 'object' ? value[pkName] : value;
        for (var i = 0; i < this.getRowsObject().length; i++) {
            if (this.getRowsObject()[i].data[pkName] === value) {
                return this.getRowsObject()[i].index;
            }
        }
        return -1;
    };
    
    /**
    * @hidden
    */
    // Need to have all columns while filtering with ColumnVirtualization.
    Grid.prototype.grabColumnByFieldFromAllCols = function (field) {
        var column;
        this.columnModel = [];
        this.updateColumnModel(this.columns);
        var gCols = this.columnModel;
        for (var i = 0; i < gCols.length; i++) {
            if (field === gCols[i].field) {
                column = gCols[i];
            }
        }
        return column;
    };
    /**
    * @hidden
    */
    // Need to have all columns while filtering with ColumnVirtualization.
    Grid.prototype.grabColumnByUidFromAllCols = function (uid) {
        var column;
        this.columnModel = [];
        this.updateColumnModel(this.columns);
        var gCols = this.columnModel;
        for (var i = 0; i < gCols.length; i++) {
            if (uid === gCols[i].uid) {
                column = gCols[i];
            }
        }
        return column;
    };
    /**
     * Get all filtered records from the Grid and it returns array of objects for the local dataSource, returns a promise object if the Grid has remote data.
     * @return {Object[] | Promise<Object>}
     * @deprecated
     */
    Grid.prototype.getFilteredRecords = function () {
        if (this.allowFiltering && this.filterSettings.columns.length) {
            var query = this.renderModule.data.generateQuery(true);
            if (this.dataSource && this.renderModule.data.isRemote() && this.dataSource instanceof sf.data.DataManager) {
                return this.renderModule.data.getData(this.dataSource, query);
            }
            else {
                if (this.dataSource instanceof sf.data.DataManager) {
                    return this.dataSource.executeLocal(query);
                }
                else {
                    return new sf.data.DataManager(this.dataSource, query).executeLocal(query);
                }
            }
        }
        return [];
    };
    Grid.prototype.getUserAgent = function () {
        var userAgent = sf.base.Browser.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(userAgent);
    };
    /**
     * @hidden
     */
    // Need to have all columns while filtering with ColumnVirtualization.
    Grid.prototype.tapEvent = function (e) {
        if (this.getUserAgent()) {
            if (!Global.timer) {
                Global.timer = setTimeout(function () {
                    Global.timer = null;
                }, 300);
            }
            else {
                clearTimeout(Global.timer);
                Global.timer = null;
                this.dblClickHandler(e);
                this.notify(doubleTap, e);
            }
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowUid = function (prefix) {
        return "" + prefix + this.rowUid++;
    };
    /**
     * @hidden
     */
    Grid.prototype.getMovableVirtualContent = function () {
        return this.getContent().querySelector('.e-movablecontent');
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenVirtualContent = function () {
        return this.getContent().querySelector('.e-frozencontent');
    };
    /**
     * @hidden
     */
    Grid.prototype.getMovableVirtualHeader = function () {
        return this.getHeaderContent().querySelector('.e-movableheader');
    };
    /**
     * @hidden
     */
    Grid.prototype.getFrozenVirtualHeader = function () {
        return this.getHeaderContent().querySelector('.e-frozenheader');
    };
    /**
     * @hidden
     */
    Grid.prototype.getRowElementByUID = function (uid) {
        var rowEle;
        var rows = [];
        if (this.isFrozenGrid()) {
            var fRows = [].slice.call(this.getFrozenVirtualContent().querySelector('tbody').children);
            var mRows = [].slice.call(this.getMovableVirtualContent().querySelector('tbody').children);
            var frozenRigtRows = [];
            if (this.tablesCount === 3) {
                frozenRigtRows = [].slice.call(this.getContent().querySelector('.e-frozen-right-content').querySelector('tbody').children);
            }
            if (this.frozenRows) {
                rows = [].slice.call(this.getFrozenVirtualHeader().querySelector('tbody').children);
                rows = rows.concat([].slice.call(this.getMovableVirtualHeader().querySelector('tbody').children));
                if (this.tablesCount === 3) {
                    var frHdr = this.getHeaderContent().querySelector('.e-frozen-right-header');
                    rows = rows.concat([].slice.call(frHdr.querySelector('tbody').children)).concat(frozenRigtRows);
                }
                
                rows = rows.concat(fRows).concat(mRows);
            }
            else {
                rows = fRows.concat(mRows).concat(frozenRigtRows);
            }
        }
        else {
            var cntRows = [].slice.call(this.getContent().querySelector('tbody').children);
            if (this.frozenRows) {
                rows = [].slice.call(this.getHeaderContent().querySelector('tbody').children);
                rows = rows.concat(cntRows);
            }
            else {
                rows = cntRows;
            }
        }
        for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
            var row = rows_2[_i];
            if (row.getAttribute('data-uid') === uid) {
                rowEle = row;
                break;
            }
        }
        return rowEle;
    };
    /**
    * Gets the hidden columns from the Grid.
    * @return {Column[]}
    * @blazorType List<GridColumn>
    */
    Grid.prototype.getHiddenColumns = function () {
        var cols = [];
        for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible === false) {
                cols.push(col);
            }
        }
        return cols;
    };
    /**
     *  calculatePageSizeByParentHeight
     * @deprecated
     */
    Grid.prototype.calculatePageSizeByParentHeight = function (containerHeight) {
        if (this.allowPaging) {
            if ((this.allowTextWrap && this.textWrapSettings.wrapMode == 'Header') || (!this.allowTextWrap)) {
                var pagesize = 0;
                if (containerHeight.indexOf('%') != -1) {
                    containerHeight = parseInt(containerHeight) / 100 * this.element.clientHeight;
                }
                var nonContentHeight = this.getNoncontentHeight() + this.getRowHeight();
                if (containerHeight > nonContentHeight) {
                    var contentHeight = 0;
                    contentHeight = containerHeight - this.getNoncontentHeight();
                    pagesize = (contentHeight / this.getRowHeight());
                }
                if (pagesize > 0) {
                    return Math.floor(pagesize);
                }
            }
        }
        return 0;
    };
    Grid.prototype.getNoncontentHeight = function () {
        var height = 0;
        if (!sf.base.isNullOrUndefined(this.getHeaderContent().clientHeight)) {
            height += this.getHeaderContent().clientHeight;
        }
        if (this.toolbar && !sf.base.isNullOrUndefined(this.element.querySelector('.e-toolbar').clientHeight)) {
            height += this.element.querySelector('.e-toolbar').clientHeight;
        }
        if (this.allowPaging && !sf.base.isNullOrUndefined(this.element.querySelector('.e-gridpager').clientHeight)) {
            height += this.element.querySelector('.e-gridpager').clientHeight;
        }
        if (this.showColumnChooser && !sf.base.isNullOrUndefined(this.element.querySelector(".e-columnheader").clientHeight)) {
            height += this.element.querySelector(".e-columnheader").clientHeight;
        }
        if (this.allowGrouping && this.groupSettings.showDropArea && !sf.base.isNullOrUndefined(this.element.querySelector('.e-groupdroparea').clientHeight)) {
            height += this.element.querySelector('.e-groupdroparea').clientHeight;
        }
        if (this.aggregates.length > 0 && !sf.base.isNullOrUndefined(this.element.querySelector('.e-summaryrow').clientHeight)) {
            for (var i = 0; i < this.element.querySelectorAll('.e-summaryrow').length; i++) {
                height += this.element.querySelectorAll('.e-summaryrow')[i].clientHeight;
            }
        }
        return height;
    };
    /**
     *To perform aggregate operation on a column.
     *@param  {AggregateColumnModel} summaryCol - Pass Aggregate Column details.
     *@param  {Object} summaryData - Pass JSON Array for which its field values to be calculated.
     * @deprecated
     */
    Grid.prototype.getSummaryValues = function (summaryCol, summaryData) {
        return sf.data.DataUtil.aggregates[summaryCol.type.toLowerCase()](summaryData, summaryCol.field);
    };
    /**
     * @hidden
     */
    Grid.prototype.isCollapseStateEnabled = function () {
        var isExpanded = 'isExpanded';
        return this[isExpanded] === false;
    };
    /**
     * @param {number} key - Defines the primary key value.
     * @param {Object} value - Defines the row data.
     * @deprecated
     */
    Grid.prototype.updateRowValue = function (key, rowData) {
        var args = {
            requestType: 'save', data: rowData,
        };
        this.showSpinner();
        this.notify(updateData, args);
        this.refresh();
    };
    /**
     * @hidden
     */
    Grid.prototype.setForeignKeyData = function () {
        this.dataBind();
        var colpending = this.getDataModule().getForeignKeyDataState();
        if (colpending.isPending) {
            this.getDataModule().setForeignKeyDataState({});
            colpending.resolver();
        }
        else {
            this.getDataModule().setForeignKeyDataState({ isDataChanged: false });
            if (this.contentModule || this.headerModule) {
                this.renderModule.render();
            }
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.resetFilterDlgPosition = function (field) {
        var header = this.getColumnHeaderByField(field);
        if (header) {
            var target = header.querySelector('.e-filtermenudiv');
            var filterDlg = this.element.querySelector('.e-filter-popup');
            if (target && filterDlg) {
                var gClient = this.element.getBoundingClientRect();
                var fClient = target.getBoundingClientRect();
                if (filterDlg) {
                    filterDlg.style.left = (fClient.right - gClient.left).toString() + 'px';
                }
            }
        }
    };
    /**
     * @hidden
     */
    Grid.prototype.renderTemplates = function () {
        var portals = 'portals';
        this.notify('reactTemplateRender', this[portals]);
        this.renderReactTemplates();
    };
    /**
     * Apply the changes to the Grid without refreshing the rows.
     * @param  {BatchChanges} changes - Defines changes to be updated.
     * @return {void}
     */
    Grid.prototype.batchUpdate = function (changes) {
        this.processRowChanges(changes);
    };
    /**
     * Apply the changes to the Grid in one batch after 50ms without refreshing the rows.
     * @param  {BatchChanges} changes - Defines changes to be updated.
     * @return {void}
     */
    Grid.prototype.batchAsyncUpdate = function (changes) {
        this.processBulkRowChanges(changes);
    };
    Grid.prototype.processBulkRowChanges = function (changes) {
        var _this = this;
        if (!this.dataToBeUpdated) {
            this.dataToBeUpdated = Object.assign({ addedRecords: [], changedRecords: [], deletedRecords: [] }, changes);
            setTimeout(function () {
                _this.processRowChanges(_this.dataToBeUpdated);
                _this.dataToBeUpdated = null;
            }, this.asyncTimeOut);
        }
        else {
            var loopstring = ['addedRecords', 'changedRecords', 'deletedRecords'];
            var keyField = this.getPrimaryKeyFieldNames()[0];
            for (var i = 0; i < loopstring.length; i++) {
                if (changes[loopstring[i]]) {
                    compareChanges(this, changes, loopstring[i], keyField);
                }
            }
        }
    };
    Grid.prototype.processRowChanges = function (changes) {
        var _this = this;
        var keyField = this.getPrimaryKeyFieldNames()[0];
        changes = Object.assign({ addedRecords: [], changedRecords: [], deletedRecords: [] }, changes);
        var promise = this.getDataModule().saveChanges(changes, keyField, {}, this.getDataModule().generateQuery().requiresCount());
        if (this.getDataModule().isRemote()) {
            promise.then(function (e) {
                _this.setNewData();
            });
        }
        else {
            this.setNewData();
        }
    };
    Grid.prototype.setNewData = function () {
        var _this = this;
        var oldValues = JSON.parse(JSON.stringify(this.getCurrentViewRecords()));
        var getData = this.getDataModule().getData({}, this.getDataModule().generateQuery().requiresCount());
        getData.then(function (e) {
            _this.bulkRefresh(e.result, oldValues, e.count);
        });
    };
    Grid.prototype.deleteRowElement = function (row) {
        var tr = this.getRowElementByUID(row.uid);
        var index = parseInt(tr.getAttribute('aria-rowindex'), 10);
        sf.base.remove(tr);
        if (this.getFrozenColumns()) {
            var mtr = this.getMovableRows()[index];
            sf.base.remove(mtr);
        }
    };
    Grid.prototype.bulkRefresh = function (result, oldValues, count) {
        var _this = this;
        var rowObj = this.getRowsObject();
        var keyField = this.getPrimaryKeyFieldNames()[0];
        var _loop_3 = function (i) {
            if (!result.filter(function (e) { return e[keyField] === rowObj[i].data[keyField]; }).length) {
                this_3.deleteRowElement(rowObj[i]);
                rowObj.splice(i, 1);
                i--;
            }
            out_i_1 = i;
        };
        var this_3 = this, out_i_1;
        for (var i = 0; i < rowObj.length; i++) {
            _loop_3(i);
            i = out_i_1;
        }
        var _loop_4 = function (i) {
            var isRowExist;
            oldValues.filter(function (e) {
                if (e[keyField] === result[i][keyField]) {
                    if (e !== result[i]) {
                        _this.setRowData(result[i][keyField], result[i]);
                    }
                    isRowExist = true;
                }
            });
            if (!isRowExist) {
                this_4.renderRowElement(result[i], i);
            }
        };
        var this_4 = this;
        for (var i = 0; i < result.length; i++) {
            _loop_4(i);
        }
        this.currentViewData = result;
        var rows = [].slice.call(this.getContentTable().querySelectorAll('.e-row'));
        resetRowIndex(this, this.getRowsObject(), rows);
        setRowElements(this);
        if (this.allowPaging) {
            this.notify(inBoundModelChanged, { module: 'pager', properties: { totalRecordsCount: count } });
        }
    };
    Grid.prototype.renderRowElement = function (data, index) {
        var row = new RowRenderer(this.serviceLocator, null, this);
        var model = new RowModelGenerator(this);
        var modelData = model.generateRows([data]);
        var tr = row.render(modelData[0], this.getColumns());
        var mTr;
        var mTbody;
        this.addRowObject(modelData[0], index);
        var tbody = this.getContentTable().querySelector('tbody');
        if (tbody.querySelector('.e-emptyrow')) {
            var emptyRow = tbody.querySelector('.e-emptyrow');
            emptyRow.parentNode.removeChild(emptyRow);
            if (this.getFrozenColumns()) {
                var moveTbody = this.getContent().querySelector('.e-movablecontent').querySelector('tbody');
                (moveTbody.firstElementChild).parentNode.removeChild(moveTbody.firstElementChild);
            }
        }
        if (this.getFrozenColumns()) {
            mTr = renderMovable(tr, this.getFrozenColumns(), this);
            if (this.frozenRows && index < this.frozenRows) {
                mTbody = this.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody');
            }
            else {
                mTbody = this.getContent().querySelector('.e-movablecontent').querySelector('tbody');
            }
            mTbody.appendChild(mTr);
            if (this.height === 'auto') {
                this.notify(frozenHeight, {});
            }
        }
        if (this.frozenRows && index < this.frozenRows) {
            tbody = this.getHeaderContent().querySelector('tbody');
        }
        else {
            tbody = this.getContent().querySelector('tbody');
        }
        tbody = this.getContent().querySelector('tbody');
        tbody.appendChild(tr);
    };
    Grid.prototype.addRowObject = function (row, index) {
        var frzCols = this.getFrozenColumns();
        if (frzCols) {
            var mRows = this.getMovableRowsObject();
            var mRow = row.clone();
            mRow.cells = mRow.cells.slice(frzCols);
            row.cells = row.cells.slice(0, frzCols);
            mRows.splice(index, 1, mRow);
        }
        this.getRowsObject().splice(index, 1, row);
    };
    /**
     * @hidden
     */
    Grid.prototype.getHeight = function (height) {
        if (!Number.isInteger(height) && height.indexOf('%') != -1) {
            height = parseInt(height) / 100 * this.element.clientHeight;
        }
        else if (!Number.isInteger(height) && this.height !== 'auto') {
            height = parseInt(height);
        }
        else {
            height = this.height;
        }
        return height;
    };
    /** @hidden */
    Grid.prototype.getFrozenRightContent = function () {
        return this.getContent().querySelector('.e-frozen-right-content');
    };
    /** @hidden */
    Grid.prototype.getFrozenRightHeader = function () {
        return this.getHeaderContent().querySelector('.e-frozen-right-header');
    };
    /** @hidden */
    Grid.prototype.getMovableHeaderTbody = function () {
        return this.getMovableVirtualHeader().querySelector('tbody');
    };
    /** @hidden */
    Grid.prototype.getMovableContentTbody = function () {
        return this.getMovableVirtualContent().querySelector('tbody');
    };
    /** @hidden */
    Grid.prototype.getFrozenHeaderTbody = function () {
        return this.getFrozenVirtualHeader().querySelector('tbody');
    };
    /** @hidden */
    Grid.prototype.getFrozenLeftContentTbody = function () {
        return this.getFrozenVirtualContent().querySelector('tbody');
    };
    /** @hidden */
    Grid.prototype.getFrozenRightHeaderTbody = function () {
        return this.getFrozenRightHeader().querySelector('tbody');
    };
    /** @hidden */
    Grid.prototype.getFrozenRightContentTbody = function () {
        var cnt = this.getFrozenRightContent();
        var tbody;
        if (cnt) {
            tbody = this.getFrozenRightContent().querySelector('tbody');
        }
        return tbody;
    };
    var Grid_1;
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "parentDetails", void 0);
    __decorate$2([
        sf.base.Property([])
    ], Grid.prototype, "columns", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Grid.prototype, "enableAltRow", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Grid.prototype, "enableHover", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableAutoFill", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Grid.prototype, "allowKeyboard", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowTextWrap", void 0);
    __decorate$2([
        sf.base.Complex({}, TextWrapSettings)
    ], Grid.prototype, "textWrapSettings", void 0);
    __decorate$2([
        sf.base.Complex({}, ResizeSettings)
    ], Grid.prototype, "resizeSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowPaging", void 0);
    __decorate$2([
        sf.base.Complex({}, PageSettings)
    ], Grid.prototype, "pageSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableVirtualization", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableColumnVirtualization", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableInfiniteScrolling", void 0);
    __decorate$2([
        sf.base.Complex({}, SearchSettings)
    ], Grid.prototype, "searchSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowSorting", void 0);
    __decorate$2([
        sf.base.Property('Ellipsis')
    ], Grid.prototype, "clipMode", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Grid.prototype, "allowMultiSorting", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowExcelExport", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowPdfExport", void 0);
    __decorate$2([
        sf.base.Complex({}, SortSettings)
    ], Grid.prototype, "sortSettings", void 0);
    __decorate$2([
        sf.base.Complex({}, InfiniteScrollSettings)
    ], Grid.prototype, "infiniteScrollSettings", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Grid.prototype, "allowSelection", void 0);
    __decorate$2([
        sf.base.Property(-1)
    ], Grid.prototype, "selectedRowIndex", void 0);
    __decorate$2([
        sf.base.Complex({}, SelectionSettings)
    ], Grid.prototype, "selectionSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowFiltering", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowReordering", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowResizing", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowRowDragAndDrop", void 0);
    __decorate$2([
        sf.base.Complex({}, RowDropSettings)
    ], Grid.prototype, "rowDropSettings", void 0);
    __decorate$2([
        sf.base.Complex({}, FilterSettings)
    ], Grid.prototype, "filterSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "allowGrouping", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableImmutableMode", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "showColumnMenu", void 0);
    __decorate$2([
        sf.base.Complex({}, GroupSettings)
    ], Grid.prototype, "groupSettings", void 0);
    __decorate$2([
        sf.base.Complex({}, EditSettings)
    ], Grid.prototype, "editSettings", void 0);
    __decorate$2([
        sf.base.Collection([], AggregateRow)
    ], Grid.prototype, "aggregates", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "showColumnChooser", void 0);
    __decorate$2([
        sf.base.Complex({}, ColumnChooserSettings)
    ], Grid.prototype, "columnChooserSettings", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Grid.prototype, "enableHeaderFocus", void 0);
    __decorate$2([
        sf.base.Property('auto')
    ], Grid.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property('auto')
    ], Grid.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property('Default')
    ], Grid.prototype, "gridLines", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "rowTemplate", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "detailTemplate", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "childGrid", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "queryString", void 0);
    __decorate$2([
        sf.base.Property('AllPages')
    ], Grid.prototype, "printMode", void 0);
    __decorate$2([
        sf.base.Property('Expanded')
    ], Grid.prototype, "hierarchyPrintMode", void 0);
    __decorate$2([
        sf.base.Property([])
    ], Grid.prototype, "dataSource", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Grid.prototype, "rowHeight", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "query", void 0);
    __decorate$2([
        sf.base.Property('USD')
    ], Grid.prototype, "currencyCode", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "toolbar", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "contextMenuItems", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "columnMenuItems", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "toolbarTemplate", void 0);
    __decorate$2([
        sf.base.Property()
    ], Grid.prototype, "pagerTemplate", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Grid.prototype, "frozenRows", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Grid.prototype, "frozenColumns", void 0);
    __decorate$2([
        sf.base.Property('All')
    ], Grid.prototype, "columnQueryMode", void 0);
    __decorate$2([
        sf.base.Property({})
    ], Grid.prototype, "currentAction", void 0);
    __decorate$2([
        sf.base.Property('default version')
    ], Grid.prototype, "ej2StatePersistenceVersion", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "created", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "destroyed", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "load", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDataBound", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "queryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "headerCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "actionBegin", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "actionComplete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "actionFailure", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "dataBound", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "recordDoubleClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "recordClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowSelecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowSelected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDeselecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDeselected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellSelecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellSelected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellDeselecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellDeselected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnSelecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnSelected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDeselecting", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDeselected", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDragStart", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDrag", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDrop", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "printComplete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforePrint", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "pdfQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "pdfHeaderQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "pdfAggregateQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "excelAggregateQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "exportDetailDataBound", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "excelQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "excelHeaderQueryCellInfo", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeExcelExport", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "excelExportComplete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforePdfExport", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "pdfExportComplete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDragStartHelper", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "detailDataBound", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDragStart", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDrag", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "rowDrop", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "toolbarClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeOpenColumnChooser", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "batchAdd", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "batchDelete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "batchCancel", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeBatchAdd", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeBatchDelete", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeBatchSave", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beginEdit", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "commandClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellEdit", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellSave", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "cellSaved", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "resizeStart", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "resizing", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "resizeStop", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "keyPressed", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeDataBound", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "contextMenuOpen", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "contextMenuClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnMenuOpen", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnMenuClick", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "checkBoxChange", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeCopy", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforePaste", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "beforeAutoFill", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "columnDataStateChange", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "dataStateChange", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "dataSourceChanged", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "exportGroupCaption", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "lazyLoadGroupExpand", void 0);
    __decorate$2([
        sf.base.Event()
    ], Grid.prototype, "lazyLoadGroupCollapse", void 0);
    Grid = Grid_1 = __decorate$2([
        sf.base.NotifyPropertyChanges
    ], Grid);
    return Grid;
}(sf.base.Component));

/**
 * @hidden
 */
function getCloneProperties() {
    return ['aggregates', 'allowGrouping', 'allowFiltering', 'allowMultiSorting', 'allowReordering', 'allowSorting',
        'allowTextWrap', 'childGrid', 'columns', 'currentViewData', 'dataSource', 'detailTemplate', 'enableAltRow',
        'enableColumnVirtualization', 'filterSettings', 'gridLines',
        'groupSettings', 'height', 'locale', 'pageSettings', 'printMode', 'query', 'queryString', 'enableRtl',
        'rowHeight', 'rowTemplate', 'sortSettings', 'textWrapSettings', 'allowPaging', 'hierarchyPrintMode', 'searchSettings',
        'queryCellInfo', 'beforeDataBound'];
}
/**
 *
 * The `Print` module is used to handle print action.
 */
var Print = /** @class */ (function () {
    /**
     * Constructor for the Grid print module
     * @hidden
     */
    function Print(parent, scrollModule) {
        this.isAsyncPrint = false;
        this.defered = new sf.data.Deferred();
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(contentReady, this.isContentReady(), this);
        this.parent.addEventListener(actionBegin, this.actionBegin.bind(this));
        this.parent.on(onEmpty, this.onEmpty.bind(this));
        this.parent.on(hierarchyPrint, this.hierarchyPrint, this);
        this.scrollModule = scrollModule;
    }
    Print.prototype.isContentReady = function () {
        var _this = this;
        if (this.isPrintGrid() && (this.parent.hierarchyPrintMode === 'None' || !this.parent.childGrid)) {
            return this.contentReady;
        }
        return function () {
            _this.defered.promise.then(function () {
                _this.contentReady();
            });
            if (_this.isPrintGrid()) {
                _this.hierarchyPrint();
            }
        };
    };
    Print.prototype.hierarchyPrint = function () {
        this.removeColGroup(this.parent);
        var printGridObj = window.printGridObj;
        if (printGridObj && !printGridObj.element.querySelector('[aria-busy=true')) {
            printGridObj.printModule.defered.resolve();
        }
    };
    /**
     * By default, prints all the Grid pages and hides the pager.
     * > You can customize print options using the
     * [`printMode`](grid/#printmode-string/).
     * @return {void}
     */
    Print.prototype.print = function () {
        this.renderPrintGrid();
        this.printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWind.moveTo(0, 0);
        this.printWind.resizeTo(screen.availWidth, screen.availHeight);
    };
    Print.prototype.onEmpty = function () {
        if (this.isPrintGrid()) {
            this.contentReady();
        }
    };
    Print.prototype.actionBegin = function () {
        if (this.isPrintGrid()) {
            this.isAsyncPrint = true;
        }
    };
    Print.prototype.renderPrintGrid = function () {
        var gObj = this.parent;
        var element = sf.base.createElement('div', {
            id: this.parent.element.id + '_print', className: gObj.element.className + ' e-print-grid'
        });
        document.body.appendChild(element);
        var printGrid = new Grid(getPrintGridModel(gObj, gObj.hierarchyPrintMode));
        if (gObj.isFrozenGrid() && !gObj.getFrozenColumns()) {
            for (var i = 0; i < printGrid.columns.length; i++) {
                printGrid.columns[i] = sf.base.extend({}, printGrid.columns[i]);
                printGrid.columns[i].freeze = undefined;
            }
        }
        /* tslint:disable-next-line:no-any */
        if (this.parent.isAngular) {
            /* tslint:disable-next-line:no-any */
            printGrid.viewContainerRef = this.parent.viewContainerRef;
        }
        /* tslint:disable:no-empty */
        printGrid.load = function () { };
        printGrid.query = gObj.getQuery().clone();
        window.printGridObj = printGrid;
        printGrid.isPrinting = true;
        var modules = printGrid.getInjectedModules();
        var injectedModues = gObj.getInjectedModules();
        if (!modules || modules.length !== injectedModues.length) {
            printGrid.setInjectedModules(injectedModues);
        }
        gObj.notify(printGridInit, { element: element, printgrid: printGrid });
        this.parent.log('exporting_begin', this.getModuleName());
        printGrid.registeredTemplate = this.parent.registeredTemplate;
        printGrid.appendTo(element);
        printGrid.trigger = gObj.trigger;
    };
    Print.prototype.contentReady = function () {
        if (this.isPrintGrid()) {
            var gObj = this.parent;
            if (this.isAsyncPrint) {
                this.printGrid();
                return;
            }
            var args = {
                requestType: 'print',
                element: gObj.element,
                selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]'),
                cancel: false,
                hierarchyPrintMode: gObj.hierarchyPrintMode
            };
            if (!this.isAsyncPrint) {
                gObj.trigger(beforePrint, args);
            }
            if (args.cancel) {
                sf.base.detach(gObj.element);
                return;
            }
            if (!this.isAsyncPrint) {
                this.printGrid();
            }
        }
    };
    Print.prototype.printGrid = function () {
        var gObj = this.parent;
        // Height adjustment on print grid
        if (gObj.height !== 'auto') { // if scroller enabled
            var cssProps = this.scrollModule.getCssProperties();
            var contentDiv = gObj.element.querySelector('.e-content');
            var headerDiv = gObj.element.querySelector('.e-gridheader');
            contentDiv.style.height = 'auto';
            contentDiv.style.overflowY = 'auto';
            headerDiv.style[cssProps.padding] = '';
            headerDiv.firstElementChild.style[cssProps.border] = '';
        }
        // Grid alignment adjustment on grouping
        if (gObj.allowGrouping) {
            if (!gObj.groupSettings.columns.length) {
                gObj.element.querySelector('.e-groupdroparea').style.display = 'none';
            }
            else {
                this.removeColGroup(gObj);
            }
        }
        // hide horizontal scroll
        for (var _i = 0, _a = [].slice.call(gObj.element.querySelectorAll('.e-content')); _i < _a.length; _i++) {
            var element = _a[_i];
            element.style.overflowX = 'hidden';
        }
        // Hide the waiting popup
        var waitingPop = gObj.element.querySelectorAll('.e-spin-show');
        for (var _b = 0, _c = [].slice.call(waitingPop); _b < _c.length; _b++) {
            var element = _c[_b];
            sf.base.classList(element, ['e-spin-hide'], ['e-spin-show']);
        }
        this.printGridElement(gObj);
        gObj.isPrinting = false;
        delete window.printGridObj;
        var args = {
            element: gObj.element
        };
        gObj.trigger(printComplete, args);
        this.parent.log('exporting_complete', this.getModuleName());
    };
    Print.prototype.printGridElement = function (gObj) {
        sf.base.classList(gObj.element, ['e-print-grid-layout'], ['e-print-grid']);
        if (gObj.isPrinting) {
            sf.base.detach(gObj.element);
        }
        this.printWind = sf.base.print(gObj.element, this.printWind);
    };
    Print.prototype.removeColGroup = function (gObj) {
        var depth = gObj.groupSettings.columns.length;
        var element = gObj.element;
        var id = '#' + gObj.element.id;
        if (!depth) {
            return;
        }
        var groupCaption = sf.base.selectAll(id + "captioncell.e-groupcaption", element);
        var colSpan = groupCaption[depth - 1].getAttribute('colspan');
        for (var i = 0; i < groupCaption.length; i++) {
            groupCaption[i].setAttribute('colspan', colSpan);
        }
        var colGroups = sf.base.selectAll("colgroup" + id + "colGroup", element);
        var contentColGroups = sf.base.selectAll('.e-content colgroup', element);
        this.hideColGroup(colGroups, depth);
        this.hideColGroup(contentColGroups, depth);
    };
    Print.prototype.hideColGroup = function (colGroups, depth) {
        for (var i = 0; i < colGroups.length; i++) {
            for (var j = 0; j < depth; j++) {
                colGroups[i].children[j].style.display = 'none';
            }
        }
    };
    /**
     * To destroy the print
     * @hidden
     */
    Print.prototype.isPrintGrid = function () {
        return this.parent.element.id.indexOf('_print') > 0 && this.parent.isPrinting;
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    Print.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.contentReady.bind(this));
        this.parent.removeEventListener(actionBegin, this.actionBegin.bind(this));
        this.parent.off(onEmpty, this.onEmpty.bind(this));
        this.parent.off(hierarchyPrint, this.hierarchyPrint);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Print.prototype.getModuleName = function () {
        return 'print';
    };
    Print.printGridProp = getCloneProperties().concat([beforePrint, printComplete, load]);
    return Print;
}());

//https://typescript.codeplex.com/discussions/401501
/**
 * Function to check whether target object implement specific interface
 * @param  {Object} target
 * @param  {string} checkFor
 * @returns no
 * @hidden
 */
function doesImplementInterface(target, checkFor) {
    /* tslint:disable:no-any */
    return target.prototype && checkFor in target.prototype;
}
/**
 * Function to get value from provided data
 * @param  {string} field
 * @param  {Object} data
 * @param  {IColumn} column
 * @hidden
 */
function valueAccessor(field, data, column) {
    return (sf.base.isNullOrUndefined(field) || field === '') ? '' : sf.data.DataUtil.getObject(field, data);
}
/**
 * Defines the method used to apply custom header cell values from external function and display this on each header cell rendered.
 * @param  {string} field
 * @param  {IColumn} column
 * @hidden
 */

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
/**
 * @hidden
 */

/**
 * @hidden
 */

/**
 * @hidden
 */


/**
 * @hidden
 */

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
function iterateExtend(array) {
    var obj = [];
    for (var i = 0; i < array.length; i++) {
        obj.push(sf.base.extend({}, getActualProperties(array[i]), {}, true));
    }
    return obj;
}
/** @hidden */
function templateCompiler(template) {
    if (template) {
        try {
            if (document.querySelectorAll(template).length) {
                return sf.base.compile(document.querySelector(template).innerHTML.trim());
            }
        }
        catch (e) {
            return sf.base.compile(template);
        }
    }
    return undefined;
}
/** @hidden */
function setStyleAndAttributes(node, customAttributes) {
    var copyAttr = {};
    var literals = ['style', 'class'];
    //Dont touch the original object - make a copy
    sf.base.extend(copyAttr, customAttributes, {});
    if ('style' in copyAttr) {
        sf.base.setStyleAttribute(node, copyAttr[literals[0]]);
        delete copyAttr[literals[0]];
    }
    if ('class' in copyAttr) {
        sf.base.addClass([node], copyAttr[literals[1]]);
        delete copyAttr[literals[1]];
    }
    sf.base.attributes(node, copyAttr);
}
/** @hidden */

/** @hidden */
function setColumnIndex(columnModel, ind) {
    if (ind === void 0) { ind = 0; }
    for (var i = 0, len = columnModel.length; i < len; i++) {
        if (columnModel[i].columns) {
            columnModel[i].index = sf.base.isNullOrUndefined(columnModel[i].index) ? ind : columnModel[i].index;
            ind++;
            ind = setColumnIndex(columnModel[i].columns, ind);
        }
        else {
            columnModel[i].index = sf.base.isNullOrUndefined(columnModel[i].index) ? ind : columnModel[i].index;
            ind++;
        }
    }
    return ind;
}
/** @hidden */
function prepareColumns(columns, autoWidth, gObj) {
    for (var c = 0, len = columns.length; c < len; c++) {
        var column = void 0;
        if (typeof columns[c] === 'string') {
            column = new Column({ field: columns[c] }, gObj);
        }
        else if (!(columns[c] instanceof Column)) {
            if (!columns[c].columns) {
                column = new Column(columns[c], gObj);
            }
            else {
                columns[c].columns = prepareColumns(columns[c].columns, null, gObj);
                column = new Column(columns[c], gObj);
            }
        }
        else {
            column = columns[c];
        }
        if (column.type && column.type.toLowerCase() === 'checkbox') {
            column.allowReordering = false;
        }
        column.headerText = sf.base.isNullOrUndefined(column.headerText) ? column.foreignKeyValue || column.field || '' : column.headerText;
        column.foreignKeyField = column.foreignKeyField || column.field;
        column.valueAccessor = (typeof column.valueAccessor === 'string' ? sf.base.getValue(column.valueAccessor, window)
            : column.valueAccessor) || valueAccessor;
        column.width = autoWidth && sf.base.isNullOrUndefined(column.width) ? 200 : column.width;
        if (sf.base.isNullOrUndefined(column.visible)) {
            column.visible = true;
        }
        columns[c] = column;
    }
    return columns;
}
/** @hidden */
function setCssInGridPopUp(popUp, e, className) {
    var popUpSpan = popUp.querySelector('span');
    var position = popUp.parentElement.getBoundingClientRect();
    var targetPosition = e.target.getBoundingClientRect();
    var isBottomTail;
    popUpSpan.className = className;
    popUp.style.display = '';
    isBottomTail = (sf.base.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
        e.clientY) > popUp.offsetHeight + 10;
    popUp.style.top = targetPosition.top - position.top +
        (isBottomTail ? -(popUp.offsetHeight + 10) : popUp.offsetHeight + 10) + 'px'; //10px for tail element
    popUp.style.left = getPopupLeftPosition(popUp, e, targetPosition, position.left) + 'px';
    if (isBottomTail) {
        popUp.querySelector('.e-downtail').style.display = '';
        popUp.querySelector('.e-uptail').style.display = 'none';
    }
    else {
        popUp.querySelector('.e-downtail').style.display = 'none';
        popUp.querySelector('.e-uptail').style.display = '';
    }
}
/** @hidden */
function getPopupLeftPosition(popup, e, targetPosition, left) {
    var width = popup.offsetWidth / 2;
    var x = getPosition(e).x;
    if (x - targetPosition.left < width) {
        return targetPosition.left - left;
    }
    else if (targetPosition.right - x < width) {
        return targetPosition.right - left - width * 2;
    }
    else {
        return x - left - width;
    }
}
/** @hidden */
function getActualProperties(obj) {
    if (obj instanceof sf.base.ChildProperty) {
        return sf.base.getValue('properties', obj);
    }
    else {
        return obj;
    }
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

/** @hidden */

/** @hidden */
function getActualPropFromColl(collection) {
    var coll = [];
    for (var i = 0, len = collection.length; i < len; i++) {
        if (collection[i].hasOwnProperty('properties')) {
            coll.push(collection[i].properties);
        }
        else {
            coll.push(collection[i]);
        }
    }
    return coll;
}
/** @hidden */

/** @hidden */
function getPosition(e) {
    var position = {};
    position.x = (sf.base.isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
        e.clientX);
    position.y = (sf.base.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
        e.clientY);
    return position;
}
var uid = 0;
/** @hidden */
function getUid(prefix) {
    return prefix + uid++;
}
/** @hidden */
function appendChildren(elem, children) {
    for (var i = 0, len = children.length; i < len; i++) {
        if (len === children.length) {
            elem.appendChild(children[i]);
        }
        else {
            elem.appendChild(children[0]);
        }
    }
    return elem;
}
/** @hidden */

/** @hidden */
function calculateAggregate(type, data, column, context) {
    if (type === 'Custom') {
        var temp = column.customAggregate;
        if (typeof temp === 'string') {
            temp = sf.base.getValue(temp, window);
        }
        return temp ? temp.call(context, data, column) : '';
    }
    return (column.field in data || data instanceof Array) ? sf.data.DataUtil.aggregates[type.toLowerCase()](data, column.field) : null;
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
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
function isActionPrevent(inst) {
    var dlg = sf.base.select('#' + inst.element.id + 'EditConfirm', inst.element);
    return inst.editSettings.mode === 'Batch' &&
        (sf.base.selectAll('.e-updatedtd', inst.element).length) && inst.editSettings.showConfirmDialog &&
        (dlg ? dlg.classList.contains('e-popup-close') : true);
}
/** @hidden */
function wrap(elem, action) {
    var clName = 'e-wrap';
    elem = elem instanceof Array ? elem : [elem];
    for (var i = 0; i < elem.length; i++) {
        action ? elem[i].classList.add(clName) : elem[i].classList.remove(clName);
    }
}
/** @hidden */
function setFormatter(serviceLocator, column, isServerRendered) {
    var fmtr = serviceLocator.getService('valueFormatter');
    var format = 'format';
    var args;
    if (column.type === 'date' || column.type === 'datetime') {
        args = { type: column.type, skeleton: column.format };
        if (sf.base.isBlazor() && isServerRendered) {
            var isServer = 'isServerRendered';
            args[isServer] = isServerRendered;
        }
        if ((typeof (column.format) === 'string') && column.format !== 'yMd') {
            args[format] = column.format;
        }
    }
    switch (column.type) {
        case 'date':
            column.setFormatter(fmtr.getFormatFunction(args));
            column.setParser(fmtr.getParserFunction(args));
            break;
        case 'datetime':
            column.setFormatter(fmtr.getFormatFunction(args));
            column.setParser(fmtr.getParserFunction(args));
            break;
        case 'number':
            column.setFormatter(fmtr.getFormatFunction({ format: column.format }));
            column.setParser(fmtr.getParserFunction({ format: column.format }));
            break;
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
/** @hidden */

/** @hidden */
function getFilterMenuPostion(target, dialogObj, grid) {
    var elementVisible = dialogObj.element.style.display;
    dialogObj.element.style.display = 'block';
    var dlgWidth = dialogObj.width;
    var newpos;
    if (!grid.enableRtl) {
        newpos = sf.popups.calculateRelativeBasedPosition(target, dialogObj.element);
        dialogObj.element.style.display = elementVisible;
        dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 5 + 'px';
        var leftPos = ((newpos.left - dlgWidth) + target.clientWidth);
        if (leftPos < 1) {
            dialogObj.element.style.left = (dlgWidth + leftPos) - 16 + 'px'; // right calculation
        }
        else {
            dialogObj.element.style.left = leftPos + -4 + 'px';
        }
    }
    else {
        newpos = sf.popups.calculatePosition(target, 'left', 'bottom');
        dialogObj.element.style.top = (newpos.top + target.getBoundingClientRect().height) - 35 + 'px';
        dialogObj.element.style.display = elementVisible;
        var leftPos = ((newpos.left - dlgWidth) + target.clientWidth);
        if (leftPos < 1) {
            dialogObj.element.style.left = (dlgWidth + leftPos) + -16 + 'px';
        }
        else {
            dialogObj.element.style.left = leftPos - 16 + 'px';
        }
    }
}
/** @hidden */

/** @hidden */
function toogleCheckbox(elem) {
    var span = elem.querySelector('.e-frame');
    var input = span.previousSibling;
    if (span.classList.contains('e-check')) {
        input.checked = false;
        sf.base.classList(span, ['e-uncheck'], ['e-check']);
    }
    else {
        input.checked = true;
        sf.base.classList(span, ['e-check'], ['e-uncheck']);
    }
}
/** @hidden */
function setChecked(elem, checked) {
    elem.checked = checked;
}
/** @hidden */
function createCboxWithWrap(uid, elem, className) {
    var div = sf.base.createElement('div', { className: className });
    div.appendChild(elem);
    div.setAttribute('uid', uid);
    return div;
}
/** @hidden */
function removeAddCboxClasses(elem, checked) {
    sf.base.removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
    if (checked) {
        elem.classList.add('e-check');
    }
    else {
        elem.classList.add('e-uncheck');
    }
}
/**
 * Refresh the Row model's foreign data.
 * @param row - Grid Row model object.
 * @param columns - Foreign columns array.
 * @param data - Updated Row data.
 * @hidden
 */
function refreshForeignData(row, columns, data) {
    for (var i = 0; i < columns.length; i++) {
        sf.base.setValue(columns[i].field, getForeignData(columns[i], data), row.foreignKeyData);
    }
    var cells = row.cells;
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].isForeignKey) {
            sf.base.setValue('foreignKeyData', sf.base.getValue(cells[i].column.field, row.foreignKeyData), cells[i]);
        }
    }
}
/**
 * Get the foreign data for the corresponding cell value.
 * @param column - Foreign Key column
 * @param data - Row data.
 * @param lValue - cell value.
 * @param foreignData - foreign data source.
 * @hidden
 */
function getForeignData(column, data, lValue, foreignKeyData) {
    var fField = column.foreignKeyField;
    var key = (!sf.base.isNullOrUndefined(lValue) ? lValue : valueAccessor(column.field, data, column));
    key = sf.base.isNullOrUndefined(key) ? '' : key;
    var query = new sf.data.Query();
    var fdata = foreignKeyData || ((column.dataSource instanceof sf.data.DataManager) && column.dataSource.dataSource.json.length ?
        column.dataSource.dataSource.json : column.columnData);
    if (key.getDay) {
        query.where(getDatePredicate({ field: fField, operator: 'equal', value: key, matchCase: false }));
    }
    else {
        query.where(fField, '==', key, false);
    }
    return new sf.data.DataManager(fdata).executeLocal(query);
}
/**
 * To use to get the column's object by the foreign key value.
 * @param foreignKeyValue - Defines ForeignKeyValue.
 * @param columns - Array of column object.
 * @hidden
 */
function getColumnByForeignKeyValue(foreignKeyValue, columns) {
    var column;
    return columns.some(function (col) {
        column = col;
        return col.foreignKeyValue === foreignKeyValue;
    }) && column;
}
/**
 * @hidden
 * @param filterObject - Defines predicate model object
 */
function getDatePredicate(filterObject, type) {
    var datePredicate;
    var prevDate;
    var nextDate;
    var prevObj = sf.base.extend({}, getActualProperties(filterObject));
    var nextObj = sf.base.extend({}, getActualProperties(filterObject));
    if (sf.base.isNullOrUndefined(filterObject.value)) {
        datePredicate = new sf.data.Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        return datePredicate;
    }
    var value = new Date(filterObject.value);
    if (filterObject.operator === 'equal' || filterObject.operator === 'notequal') {
        if (type === 'datetime') {
            prevDate = new Date(value.setSeconds(value.getSeconds() - 1));
            nextDate = new Date(value.setSeconds(value.getSeconds() + 2));
            filterObject.value = new Date(value.setSeconds(nextDate.getSeconds() - 1));
        }
        else {
            prevDate = new Date(value.setHours(0) - 1);
            nextDate = new Date(value.setHours(24));
        }
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            prevObj.operator = 'greaterthan';
            nextObj.operator = 'lessthan';
        }
        else if (filterObject.operator === 'notequal') {
            prevObj.operator = 'lessthanorequal';
            nextObj.operator = 'greaterthanorequal';
        }
        var predicateSt = new sf.data.Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        var predicateEnd = new sf.data.Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        datePredicate = filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
    }
    else {
        if (typeof (prevObj.value) === 'string') {
            prevObj.value = new Date(prevObj.value);
        }
        var predicates = new sf.data.Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        datePredicate = predicates;
    }
    if (filterObject.setProperties) {
        filterObject.setProperties({ ejpredicate: datePredicate }, true);
    }
    else {
        filterObject.ejpredicate = datePredicate;
    }
    return datePredicate;
}
/**
 * @hidden
 */
function renderMovable(ele, frzCols, gObj) {
    frzCols = frzCols && gObj && gObj.isRowDragable() ? frzCols + 1 : frzCols;
    var mEle = ele.cloneNode(true);
    for (var i = 0; i < frzCols; i++) {
        mEle.removeChild(mEle.children[0]);
    }
    for (var i = frzCols, len = ele.childElementCount; i < len; i++) {
        ele.removeChild(ele.children[ele.childElementCount - 1]);
    }
    return mEle;
}
/**
 * @hidden
 */
function isGroupAdaptive(grid) {
    return grid.enableVirtualization && grid.groupSettings.columns.length > 0 && grid.isVirtualAdaptive;
}
/**
 * @hidden
 */
function getObject(field, object) {
    if (field === void 0) { field = ''; }
    if (field) {
        var value = object;
        var splits = field.split('.');
        for (var i = 0; i < splits.length && !sf.base.isNullOrUndefined(value); i++) {
            value = value[splits[i]];
        }
        return value;
    }
}
/**
 * @hidden
 */

/**
 * @hidden
 */
function getExpandedState(gObj, hierarchyPrintMode) {
    var rows = gObj.getRowsObject();
    var obj = {};
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        if (row.isExpand && !row.isDetailRow) {
            var index = gObj.allowPaging && gObj.printMode === 'AllPages' ? row.index +
                (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize : row.index;
            obj[index] = {};
            obj[index].isExpand = true;
            obj[index].gridModel = getPrintGridModel(row.childGrid, hierarchyPrintMode);
            obj[index].gridModel.query = gObj.childGrid.query;
        }
    }
    return obj;
}
/**
 * @hidden
 */
function getPrintGridModel(gObj, hierarchyPrintMode) {
    if (hierarchyPrintMode === void 0) { hierarchyPrintMode = 'Expanded'; }
    var printGridModel = {};
    if (!gObj) {
        return printGridModel;
    }
    var isFrozen = gObj.isFrozenGrid() && !gObj.getFrozenColumns();
    for (var _i = 0, _a = Print.printGridProp; _i < _a.length; _i++) {
        var key = _a[_i];
        if (key === 'columns') {
            printGridModel[key] = getActualPropFromColl(isFrozen ? gObj.getColumns() : gObj[key]);
        }
        else if (key === 'allowPaging') {
            printGridModel[key] = gObj.printMode === 'CurrentPage';
        }
        else {
            printGridModel[key] = getActualProperties(gObj[key]);
        }
    }
    if (gObj.childGrid && hierarchyPrintMode !== 'None') {
        printGridModel.expandedRows = getExpandedState(gObj, hierarchyPrintMode);
    }
    return printGridModel;
}
/**
 * @hidden
 */
function extendObjWithFn(copied, first, second, deep) {
    var res = copied || {};
    var len = arguments.length;
    if (deep) {
        len = len - 1;
    }
    for (var i = 1; i < len; i++) {
        if (!arguments[i]) {
            continue;
        }
        var obj1 = arguments[i];
        var keys = Object.keys(Object.getPrototypeOf(obj1)).length ?
            Object.keys(obj1).concat(getPrototypesOfObj(obj1)) : Object.keys(obj1);
        for (var i_1 = 0; i_1 < keys.length; i_1++) {
            var source = res[keys[i_1]];
            var cpy = obj1[keys[i_1]];
            var cln = void 0;
            if (deep && (sf.base.isObject(cpy) || Array.isArray(cpy))) {
                if (sf.base.isObject(cpy)) {
                    cln = source ? source : {};
                    res[keys[i_1]] = sf.base.extend({}, cln, cpy, deep);
                }
                else {
                    cln = source ? source : [];
                    res[keys[i_1]] = sf.base.extend([], cln, cpy, deep);
                }
            }
            else {
                res[keys[i_1]] = cpy;
            }
        }
    }
    return res;
}
/**
 * @hidden
 */
function getPrototypesOfObj(obj) {
    var keys = [];
    while (Object.getPrototypeOf(obj) && Object.keys(Object.getPrototypeOf(obj)).length) {
        keys = keys.concat(Object.keys(Object.getPrototypeOf(obj)));
        obj = Object.getPrototypeOf(obj);
    }
    return keys;
}
/**
 * @hidden
 */
function measureColumnDepth(column) {
    var max = 0;
    for (var i = 0; i < column.length; i++) {
        var depth = checkDepth(column[i], 0);
        if (max < depth) {
            max = depth;
        }
    }
    return max + 1;
}
/**
 * @hidden
 */
function checkDepth(col, index) {
    var max = index;
    var indices = [];
    if (col.columns) {
        index++;
        for (var i = 0; i < col.columns.length; i++) {
            indices[i] = checkDepth(col.columns[i], index);
        }
        for (var j = 0; j < indices.length; j++) {
            if (max < indices[j]) {
                max = indices[j];
            }
        }
        index = max;
    }
    return index;
}
/**
 * @hidden
 */
function refreshFilteredColsUid(gObj, filteredCols) {
    for (var i = 0; i < filteredCols.length; i++) {
        filteredCols[i].uid = filteredCols[i].isForeignKey ?
            getColumnByForeignKeyValue(filteredCols[i].field, gObj.getForeignKeyColumns()).uid
            : gObj.getColumnByField(filteredCols[i].field).uid;
    }
}
/** @hidden */
var Global;
(function (Global) {
    Global.timer = null;
})(Global || (Global = {}));
/**
 * @hidden
 */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
function eventPromise(args, query) {
    var state;
    state = getStateEventArgument(query);
    var def = new sf.data.Deferred();
    state.dataSource = def.resolve;
    state.action = args;
    return { state: state, deffered: def };
}
/** @hidden */
function getStateEventArgument(query) {
    var adaptr = new sf.data.UrlAdaptor();
    var dm = new sf.data.DataManager({ url: '', adaptor: new sf.data.UrlAdaptor });
    var state = adaptr.processQuery(dm, query);
    var data = JSON.parse(state.data);
    return data;
}
/** @hidden */
function ispercentageWidth(gObj) {
    var columns = gObj.getVisibleColumns();
    var percentageCol = 0;
    var undefinedWidthCol = 0;
    for (var i = 0; i < columns.length; i++) {
        if (sf.base.isUndefined(columns[i].width)) {
            undefinedWidthCol++;
        }
        else if (columns[i].width.toString().indexOf('%') !== -1) {
            percentageCol++;
        }
    }
    return (gObj.width === 'auto' || typeof (gObj.width) === 'string' && gObj.width.indexOf('%') !== -1) && sf.base.Browser.info.name !== 'chrome'
        && !gObj.groupSettings.showGroupedColumn && gObj.groupSettings.columns.length
        && percentageCol && !undefinedWidthCol;
}
/** @hidden */
function resetRowIndex(gObj, rows, rowElms, index) {
    var startIndex = index ? index : 0;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].isDataRow) {
            rows[i].index = startIndex;
            rows[i].isAltRow = gObj.enableAltRow ? startIndex % 2 !== 0 : false;
            rowElms[i].setAttribute('aria-rowindex', startIndex.toString());
            rows[i].isAltRow ? rowElms[i].classList.add('e-altrow') : rowElms[i].classList.remove('e-altrow');
            for (var j = 0; j < rowElms[i].cells.length; j++) {
                rowElms[i].cells[j].setAttribute('index', startIndex.toString());
            }
            startIndex++;
        }
    }
    if (!rows.length) {
        gObj.renderModule.emptyRow(true);
    }
}
/** @hidden */
function compareChanges(gObj, changes, type, keyField) {
    var newArray = gObj.dataToBeUpdated[type].concat(changes[type]).reduce(function (r, o) {
        r[o[keyField]] = r[o[keyField]] === undefined ? o : Object.assign(r[o[keyField]], o);
        return r;
    }, {});
    gObj.dataToBeUpdated[type] = Object.keys(newArray).map(function (k) { return newArray[k]; });
}
/** @hidden */
function setRowElements(gObj) {
    if (gObj.isFrozenGrid()) {
        (gObj).contentModule.rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-movableheader .e-row, .e-movablecontent .e-row'));
        var cls = gObj.getFrozenMode() === 'Left-Right' ? '.e-frozen-left-header .e-row, .e-frozen-left-content .e-row'
            : '.e-frozenheader .e-row, .e-frozencontent .e-row';
        (gObj).contentModule.freezeRowElements =
            [].slice.call(gObj.element.querySelectorAll(cls));
        if (gObj.getFrozenMode() === 'Left-Right') {
            gObj.contentModule.frozenRightRowElements =
                [].slice.call(gObj.element.querySelectorAll('.e-frozen-right-header .e-row, .e-frozen-right-content .e-row'));
        }
    }
    else {
        (gObj).contentModule.rowElements =
            [].slice.call(gObj.element.querySelectorAll('.e-row:not(.e-addedrow)'));
    }
}
/** @hidden */
function getCurrentTableIndex(gObj) {
    if (gObj.tableIndex === gObj.getTablesCount()) {
        gObj.tableIndex = 0;
    }
    return ++gObj.tableIndex;
}
/** @hidden */
function getFrozenTableName(gObj, index) {
    var frozenCols = gObj.getFrozenColumns();
    var frozenLeft = gObj.getFrozenLeftColumnsCount();
    var frozenRight = gObj.getFrozenRightColumnsCount();
    var tableName;
    if (frozenCols && !frozenLeft && !frozenRight) {
        tableName = getFreezeTableName(gObj, index);
    }
    else if (!frozenCols && (frozenLeft || frozenRight)) {
        tableName = getColumnLevelFreezeTableName(gObj, index);
    }
    return tableName;
}
/** @hidden */
function getFreezeTableName(gObj, index) {
    var tableIndex = sf.base.isNullOrUndefined(index) ? getCurrentTableIndex(gObj) : index;
    var tableName;
    if (tableIndex === 1) {
        tableName = 'frozen-left';
    }
    else if (tableIndex === 2) {
        tableName = 'movable';
    }
    return tableName;
}
/** @hidden */
function getColumnLevelFreezeTableName(gObj, index) {
    var frozenLeft = gObj.getFrozenLeftColumnsCount();
    var frozenRight = gObj.getFrozenRightColumnsCount();
    var tableIndex = sf.base.isNullOrUndefined(index) ? getCurrentTableIndex(gObj) : index;
    var tableName;
    if (frozenLeft && !frozenRight) {
        if (tableIndex === 1) {
            tableName = 'frozen-left';
        }
        else if (tableIndex === 2) {
            tableName = 'movable';
        }
    }
    else if (frozenRight && !frozenLeft) {
        if (tableIndex === 1) {
            tableName = 'frozen-right';
        }
        else if (tableIndex === 2) {
            tableName = 'movable';
        }
    }
    else {
        if (tableIndex === 1) {
            tableName = 'frozen-left';
        }
        else if (tableIndex === 2) {
            tableName = 'movable';
        }
        else if (tableIndex === 3) {
            tableName = 'frozen-right';
        }
    }
    return tableName;
}
/** @hidden */

/** @hidden */
function gridActionHandler(gObj, callBack, rows, force) {
    if (rows[0].length || force) {
        callBack('frozen-left', rows[0]);
    }
    if (gObj.isFrozenGrid() && (rows[1].length || force)) {
        callBack('movable', rows[1]);
    }
    if ((gObj.getFrozenMode() === 'Left-Right' || gObj.getFrozenMode() === 'Right') && (rows[2].length || force)) {
        callBack('frozen-right', rows[2]);
    }
}
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
function getCellsByTableName(gObj, col, rowIndex) {
    if (col.getFreezeTableName() === 'movable') {
        return [].slice.call(gObj.getMovableDataRows()[rowIndex].querySelectorAll('.e-rowcell'));
    }
    else if (col.getFreezeTableName() === 'frozen-right') {
        return [].slice.call(gObj.getFrozenRightDataRows()[rowIndex].querySelectorAll('.e-rowcell'));
    }
    else {
        return [].slice.call(gObj.getDataRows()[rowIndex].querySelectorAll('.e-rowcell'));
    }
}
/** @hidden */
function getCellByColAndRowIndex(gObj, col, rowIndex, index) {
    var left = gObj.getFrozenLeftCount();
    var movable = gObj.getMovableColumnsCount();
    index = col.getFreezeTableName() === 'movable' ? index - left : col.getFreezeTableName() === 'frozen-right'
        ? index - (left + movable) : index;
    return getCellsByTableName(gObj, col, rowIndex)[index];
}
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
// tslint:disable-next-line:no-any

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the `Pager` component.
 * ```html
 * <div id="pager"/>
 * ```
 * ```typescript
 * <script>
 *   var pagerObj = new Pager({ totalRecordsCount: 50, pageSize:10 });
 *   pagerObj.appendTo("#pager");
 * </script>
 * ```
 */
var Pager = /** @class */ (function (_super) {
    __extends(Pager, _super);
    /**
     * Constructor for creating the component.
     * @hidden
     */
    function Pager(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @hidden */
        _this.hasParent = false;
        return _this;
    }
    /**
     * To provide the array of modules needed for component rendering
     * @hidden
     */
    Pager.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableExternalMessage) {
            modules.push({
                member: 'externalMessage',
                args: [this]
            });
        }
        if (this.checkpagesizes()) {
            modules.push({
                member: 'pagerdropdown',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * Initialize the event handler
     * @hidden
     */
    Pager.prototype.preRender = function () {
        //preRender
        this.defaultConstants = {
            currentPageInfo: '{0} of {1} pages',
            totalItemsInfo: '({0} items)',
            totalItemInfo: '({0} item)',
            firstPageTooltip: 'Go to first page',
            lastPageTooltip: 'Go to last page',
            nextPageTooltip: 'Go to next page',
            previousPageTooltip: 'Go to previous page',
            nextPagerTooltip: 'Go to next pager',
            previousPagerTooltip: 'Go to previous pager',
            pagerDropDown: 'Items per page',
            pagerAllDropDown: 'Items',
            CurrentPageInfo: '{0} of {1} pages',
            TotalItemsInfo: '({0} items)',
            FirstPageTooltip: 'Go to first page',
            LastPageTooltip: 'Go to last page',
            NextPageTooltip: 'Go to next page',
            PreviousPageTooltip: 'Go to previous page',
            NextPagerTooltip: 'Go to next pager',
            PreviousPagerTooltip: 'Go to previous pager',
            PagerDropDown: 'Items per page',
            PagerAllDropDown: 'Items',
            All: 'All'
        };
        this.containerModule = new NumericContainer(this);
        this.pagerMessageModule = new PagerMessage(this);
    };
    /**
     * To Initialize the component rendering
     */
    Pager.prototype.render = function () {
        if (this.template) {
            if (this.isReactTemplate()) {
                this.on('pager-refresh', this.pagerTemplate, this);
                this.notify('pager-refresh', {});
            }
            else {
                this.pagerTemplate();
            }
        }
        else {
            this.initLocalization();
            this.updateRTL();
            this.totalRecordsCount = this.totalRecordsCount || 0;
            this.renderFirstPrevDivForDevice();
            this.containerModule.render();
            if (this.enablePagerMessage) {
                this.pagerMessageModule.render();
            }
            this.renderNextLastDivForDevice();
            if (this.checkpagesizes() && this.pagerdropdownModule) {
                this.pagerdropdownModule.render();
            }
            this.addAriaLabel();
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.render();
            }
            this.refresh();
            this.trigger('created', { 'currentPage': this.currentPage, 'totalRecordsCount': this.totalRecordsCount });
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @hidden
     */
    Pager.prototype.getPersistData = function () {
        var keyEntity = ['currentPage', 'pageSize'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * To destroy the Pager component.
     * @method destroy
     * @return {void}
     */
    Pager.prototype.destroy = function () {
        if (this.isReactTemplate()) {
            this.off('pager-refresh', this.pagerTemplate);
            if (!this.hasParent) {
                this.destroyTemplate(['template']);
            }
        }
        _super.prototype.destroy.call(this);
        this.containerModule.destroy();
        this.pagerMessageModule.destroy();
        if (!this.isReactTemplate()) {
            this.element.innerHTML = '';
        }
    };
    /**
     * Destroys the given template reference.
     * @param {string[]} propertyNames - Defines the collection of template name.
     */
    //tslint:disable-next-line:no-any
    Pager.prototype.destroyTemplate = function (propertyNames, index) {
        this.clearTemplate(propertyNames, index);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Pager.prototype.getModuleName = function () {
        return 'pager';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    Pager.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.isDestroyed) {
            return;
        }
        if (newProp.pageCount !== oldProp.pageCount) {
            this.containerModule.refreshNumericLinks();
            this.containerModule.refresh();
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'currentPage':
                    if (this.checkGoToPage(newProp.currentPage, oldProp.currentPage)) {
                        this.currentPageChanged(newProp, oldProp);
                    }
                    break;
                case 'pageSize':
                case 'totalRecordsCount':
                case 'customText':
                    if (this.checkpagesizes() && this.pagerdropdownModule) {
                        if (oldProp.pageSize !== newProp.pageSize) {
                            this.currentPage = 1;
                        }
                        this.pagerdropdownModule.setDropDownValue('value', this.pageSize);
                    }
                    if (newProp.pageSize !== oldProp.pageSize) {
                        this.pageSize = newProp.pageSize;
                        this.currentPageChanged(newProp, oldProp);
                    }
                    else {
                        this.refresh();
                    }
                    break;
                case 'pageSizes':
                    if (this.checkpagesizes() && this.pagerdropdownModule) {
                        this.pagerdropdownModule.destroy();
                        this.pagerdropdownModule.render();
                    }
                    this.refresh();
                    break;
                case 'template':
                    this.templateFn = this.compile(this.template);
                    this.refresh();
                    break;
                case 'locale':
                    this.initLocalization();
                    this.refresh();
                    break;
                case 'enableExternalMessage':
                    if (this.enableExternalMessage && this.externalMessageModule) {
                        this.externalMessageModule.render();
                    }
                    break;
                case 'externalMessage':
                    if (this.externalMessageModule) {
                        this.externalMessageModule.refresh();
                    }
                    break;
                case 'enableRtl':
                    this.updateRTL();
                    break;
                case 'enablePagerMessage':
                    if (this.enablePagerMessage) {
                        this.pagerMessageModule.showMessage();
                    }
                    else {
                        this.pagerMessageModule.hideMessage();
                    }
                    break;
            }
        }
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    Pager.prototype.getLocalizedLabel = function (key) {
        return this.localeObj.getConstant(key);
    };
    /**
     * Navigate to target page by given number.
     * @param  {number} pageNo - Defines page number.
     * @return {void}
     */
    Pager.prototype.goToPage = function (pageNo) {
        if (this.checkGoToPage(pageNo)) {
            this.currentPage = pageNo;
            this.dataBind();
        }
    };
    /**
     * @hidden
     */
    Pager.prototype.setPageSize = function (pageSize) {
        this.pageSize = pageSize;
        this.dataBind();
    };
    Pager.prototype.checkpagesizes = function () {
        if (this.pageSizes === true || this.pageSizes.length) {
            return true;
        }
        return false;
    };
    Pager.prototype.checkGoToPage = function (newPageNo, oldPageNo) {
        if (newPageNo !== this.currentPage) {
            this.previousPageNo = this.currentPage;
        }
        if (!sf.base.isNullOrUndefined(oldPageNo)) {
            this.previousPageNo = oldPageNo;
        }
        if (this.previousPageNo !== newPageNo && (newPageNo >= 1 && newPageNo <= this.totalPages)) {
            return true;
        }
        return false;
    };
    Pager.prototype.currentPageChanged = function (newProp, oldProp) {
        if (this.enableQueryString) {
            this.updateQueryString(this.currentPage);
        }
        if (newProp.currentPage !== oldProp.currentPage || newProp.pageSize !== oldProp.pageSize) {
            var args = {
                currentPage: this.currentPage,
                newProp: newProp, oldProp: oldProp, cancel: false
            };
            this.trigger('click', args);
            if (!args.cancel) {
                this.refresh();
            }
        }
    };
    Pager.prototype.pagerTemplate = function () {
        if (this.isReactTemplate() && this.hasParent) {
            return;
        }
        var result;
        this.element.classList.add('e-pagertemplate');
        this.compile(this.template);
        var data = {
            currentPage: this.currentPage, pageSize: this.pageSize, pageCount: this.pageCount,
            totalRecordsCount: this.totalRecordsCount, totalPages: this.totalPages
        };
        var tempId = this.element.parentElement.id + '_template';
        if (this.isReactTemplate()) {
            this.getPagerTemplate()(data, this, 'template', tempId, null, null, this.element);
            this.renderReactTemplates();
        }
        else {
            result = sf.base.isBlazor() ? this.getPagerTemplate()(data, this, 'template', tempId, this.isStringTemplate) :
                this.getPagerTemplate()(data);
            appendChildren(this.element, result);
        }
    };
    /** @hidden */
    Pager.prototype.updateTotalPages = function () {
        this.totalPages = (this.totalRecordsCount % this.pageSize === 0) ? (this.totalRecordsCount / this.pageSize) :
            (parseInt((this.totalRecordsCount / this.pageSize).toString(), 10) + 1);
    };
    /** @hidden */
    Pager.prototype.getPagerTemplate = function () {
        return this.templateFn;
    };
    /** @hidden */
    Pager.prototype.compile = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    this.templateFn = sf.base.compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (e) {
                this.templateFn = sf.base.compile(template);
            }
        }
        return undefined;
    };
    /**
     * Refreshes page count, pager information and external message.
     * @return {void}
     */
    Pager.prototype.refresh = function () {
        if (this.template) {
            if (this.isReactTemplate()) {
                this.updateTotalPages();
                this.notify('pager-refresh', {});
            }
            else {
                this.element.innerHTML = '';
                this.updateTotalPages();
                this.pagerTemplate();
            }
        }
        else {
            this.updateRTL();
            this.containerModule.refresh();
            if (this.enablePagerMessage) {
                this.pagerMessageModule.refresh();
            }
            if (this.pagerdropdownModule) {
                this.pagerdropdownModule.refresh();
            }
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.refresh();
            }
        }
    };
    Pager.prototype.updateRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    Pager.prototype.initLocalization = function () {
        this.localeObj = new sf.base.L10n(this.getModuleName(), this.defaultConstants, this.locale);
    };
    Pager.prototype.updateQueryString = function (value) {
        var updatedUrl = this.getUpdatedURL(window.location.href, 'page', value.toString());
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    };
    Pager.prototype.getUpdatedURL = function (uri, key, value) {
        var regx = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
        if (uri.match(regx)) {
            return uri.replace(regx, '$1' + key + '=' + value + '$2');
        }
        else {
            var hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + (uri.indexOf('?') !== -1 ? '&' : '?') + key + '=' + value + hash;
        }
    };
    Pager.prototype.renderFirstPrevDivForDevice = function () {
        this.element.appendChild(sf.base.createElement('div', {
            className: 'e-mfirst e-icons e-icon-first',
            attrs: { title: sf.base.isBlazor() ? this.getLocalizedLabel('FirstPageTooltip') : this.getLocalizedLabel('firstPageTooltip'),
                tabindex: '-1' }
        }));
        this.element.appendChild(sf.base.createElement('div', {
            className: 'e-mprev e-icons e-icon-prev',
            attrs: { title: sf.base.isBlazor() ? this.getLocalizedLabel('PreviousPageTooltip') :
                    this.getLocalizedLabel('previousPageTooltip'), tabindex: '-1' }
        }));
    };
    Pager.prototype.renderNextLastDivForDevice = function () {
        this.element.appendChild(sf.base.createElement('div', {
            className: 'e-mnext e-icons e-icon-next',
            attrs: { title: sf.base.isBlazor() ? this.getLocalizedLabel('NextPageTooltip') :
                    this.getLocalizedLabel('nextPageTooltip'), tabindex: '-1' }
        }));
        this.element.appendChild(sf.base.createElement('div', {
            className: 'e-mlast e-icons e-icon-last',
            attrs: { title: sf.base.isBlazor() ? this.getLocalizedLabel('LastPageTooltip') :
                    this.getLocalizedLabel('lastPageTooltip'), tabindex: '-1' }
        }));
    };
    Pager.prototype.addAriaLabel = function () {
        var classList$$1 = ['.e-mfirst', '.e-mprev', '.e-mnext', '.e-mlast'];
        if (!sf.base.Browser.isDevice) {
            for (var i = 0; i < classList$$1.length; i++) {
                var element = this.element.querySelector(classList$$1[i]);
                element.setAttribute('aria-label', element.getAttribute('title'));
            }
        }
    };
    Pager.prototype.isReactTemplate = function () {
        return this.isReact && this.template && typeof (this.template) !== 'string';
    };
    __decorate([
        sf.base.Property(false)
    ], Pager.prototype, "enableQueryString", void 0);
    __decorate([
        sf.base.Property(false)
    ], Pager.prototype, "enableExternalMessage", void 0);
    __decorate([
        sf.base.Property(true)
    ], Pager.prototype, "enablePagerMessage", void 0);
    __decorate([
        sf.base.Property(12)
    ], Pager.prototype, "pageSize", void 0);
    __decorate([
        sf.base.Property(10)
    ], Pager.prototype, "pageCount", void 0);
    __decorate([
        sf.base.Property(1)
    ], Pager.prototype, "currentPage", void 0);
    __decorate([
        sf.base.Property()
    ], Pager.prototype, "totalRecordsCount", void 0);
    __decorate([
        sf.base.Property()
    ], Pager.prototype, "externalMessage", void 0);
    __decorate([
        sf.base.Property(false)
    ], Pager.prototype, "pageSizes", void 0);
    __decorate([
        sf.base.Property()
    ], Pager.prototype, "template", void 0);
    __decorate([
        sf.base.Property('')
    ], Pager.prototype, "customText", void 0);
    __decorate([
        sf.base.Event()
    ], Pager.prototype, "click", void 0);
    __decorate([
        sf.base.Event()
    ], Pager.prototype, "dropDownChanged", void 0);
    __decorate([
        sf.base.Event()
    ], Pager.prototype, "created", void 0);
    Pager = __decorate([
        sf.base.NotifyPropertyChanges
    ], Pager);
    return Pager;
}(sf.base.Component));

/**
 * `ExternalMessage` module is used to display user provided message.
 */
var ExternalMessage = /** @class */ (function () {
    /**
     * Constructor for externalMessage module
     * @param  {Pager} pagerModule?
     * @returns defaultType
     * @hidden
     */
    function ExternalMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExternalMessage.prototype.getModuleName = function () {
        return 'externalMessage';
    };
    /**
     * The function is used to render pager externalMessage
     * @hidden
     */
    ExternalMessage.prototype.render = function () {
        this.element = sf.base.createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': 'Pager external message' } });
        this.pagerModule.element.appendChild(this.element);
        this.refresh();
    };
    /**
     * Refreshes the external message of Pager.
     */
    ExternalMessage.prototype.refresh = function () {
        if (this.pagerModule.externalMessage && this.pagerModule.externalMessage.toString().length) {
            this.showMessage();
            this.element.innerHTML = this.pagerModule.externalMessage;
        }
        else {
            this.hideMessage();
        }
    };
    /**
     * Hides the external message of Pager.
     */
    ExternalMessage.prototype.hideMessage = function () {
        if (!sf.base.isNullOrUndefined(this.element)) {
            this.element.style.display = 'none';
        }
    };
    /**
     * Shows the external message of the Pager.
     */
    ExternalMessage.prototype.showMessage = function () {
        this.element.style.display = '';
    };
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}
     * @hidden
     */
    ExternalMessage.prototype.destroy = function () {
        sf.base.remove(this.element);
    };
    return ExternalMessage;
}());

/**
 * `PagerDropDown` module handles selected pageSize from DropDownList.
 */
var PagerDropDown = /** @class */ (function () {
    /**
     * Constructor for pager module
     * @hidden
     */
    function PagerDropDown(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     * @hidden
     */
    PagerDropDown.prototype.getModuleName = function () {
        return 'pagerdropdown';
    };
    /**
     * The function is used to render pager dropdown
     * @hidden
     */
    PagerDropDown.prototype.render = function () {
        var pagerObj = this.pagerModule;
        this.pagerDropDownDiv = sf.base.createElement('div', { className: 'e-pagesizes' });
        var dropDownDiv = sf.base.createElement('div', { className: 'e-pagerdropdown' });
        var defaultTextDiv = sf.base.createElement('div', { className: 'e-pagerconstant' });
        var input = sf.base.createElement('input', { attrs: { type: 'text', tabindex: '1' } });
        this.pagerCons = sf.base.createElement('span', { className: 'e-constant', innerHTML: sf.base.isBlazor() ?
                this.pagerModule.getLocalizedLabel('PagerDropDown') :
                this.pagerModule.getLocalizedLabel('pagerDropDown') });
        dropDownDiv.appendChild(input);
        defaultTextDiv.appendChild(this.pagerCons);
        this.pagerDropDownDiv.appendChild(dropDownDiv);
        this.pagerDropDownDiv.appendChild(defaultTextDiv);
        this.pagerModule.element.appendChild(this.pagerDropDownDiv);
        var pageSizesModule = this.pagerModule.pageSizes;
        var pageSizesArray = (pageSizesModule.length ? this.convertValue(pageSizesModule) :
            [this.pagerModule.getLocalizedLabel('All'), '5', '10', '12', '20']);
        var defaultValue = this.pagerModule.pageSize;
        this.dropDownListObject = new sf.dropdowns.DropDownList({
            dataSource: pageSizesArray,
            value: defaultValue.toString(),
            change: this.onChange.bind(this),
            cssClass: 'e-alldrop'
        });
        this.dropDownListObject.appendTo(input);
        if (pageSizesModule.length) {
            this.dropDownListObject.element.value = this.pagerModule.pageSize.toString();
        }
        pagerObj.pageSize = defaultValue;
        pagerObj.dataBind();
        pagerObj.trigger('dropDownChanged', { pageSize: defaultValue });
        this.addEventListener();
    };
    /**
     * For internal use only - Get the pagesize.
     * @private
     * @hidden
     */
    PagerDropDown.prototype.onChange = function (e) {
        if (this.dropDownListObject.value === this.pagerModule.getLocalizedLabel('All')) {
            this.pagerModule.pageSize = this.pagerModule.totalRecordsCount;
            this.refresh();
            e.value = this.pagerModule.pageSize;
            if (document.getElementsByClassName('e-popup-open e-alldrop').length) {
                document.getElementsByClassName('e-popup-open e-alldrop')[0].style.display = 'none';
            }
        }
        else {
            this.pagerModule.pageSize = parseInt(this.dropDownListObject.value, 10);
            if (this.pagerCons.innerHTML !== this.pagerModule.getLocalizedLabel('pagerDropDown')) {
                this.refresh();
            }
        }
        this.pagerModule.dataBind();
        this.pagerModule.trigger('dropDownChanged', { pageSize: parseInt(this.dropDownListObject.value, 10) });
    };
    PagerDropDown.prototype.refresh = function () {
        if (this.pagerCons) {
            if (this.pagerModule.pageSize === this.pagerModule.totalRecordsCount) {
                this.pagerCons.innerHTML = sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PagerAllDropDown') :
                    this.pagerModule.getLocalizedLabel('pagerAllDropDown');
            }
            else {
                this.pagerCons.innerHTML = sf.base.isBlazor() ? this.pagerModule.getLocalizedLabel('PagerDropDown') :
                    this.pagerModule.getLocalizedLabel('pagerDropDown');
            }
        }
    };
    PagerDropDown.prototype.beforeValueChange = function (prop) {
        if (typeof prop.newProp.value === 'number') {
            var val = prop.newProp.value.toString();
            prop.newProp.value = val;
        }
    };
    PagerDropDown.prototype.convertValue = function (pageSizeValue) {
        var item = pageSizeValue;
        for (var i = 0; i < item.length; i++) {
            item[i] = parseInt(item[i], 10) ? item[i].toString() : (this.pagerModule.getLocalizedLabel(item[i]) !== '')
                ? this.pagerModule.getLocalizedLabel(item[i]) : item[i];
        }
        return item;
    };
    PagerDropDown.prototype.setDropDownValue = function (prop, value) {
        if (this.dropDownListObject) {
            this.dropDownListObject[prop] = value;
        }
    };
    PagerDropDown.prototype.addEventListener = function () {
        this.dropDownListObject.on('beforeValueChange', this.beforeValueChange, this);
    };
    PagerDropDown.prototype.removeEventListener = function () {
        this.dropDownListObject.off('beforeValueChange', this.beforeValueChange);
    };
    /**
     * To destroy the Pagerdropdown
     * @method destroy
     * @return {void}
     * @hidden
     */
    PagerDropDown.prototype.destroy = function (args) {
        if (this.dropDownListObject && !this.dropDownListObject.isDestroyed) {
            this.removeEventListener();
            this.dropDownListObject.destroy();
            sf.base.remove(this.pagerDropDownDiv);
        }
    };
    return PagerDropDown;
}());

/**
 * Pager component exported items
 */

exports.Pager = Pager;
exports.ExternalMessage = ExternalMessage;
exports.NumericContainer = NumericContainer;
exports.PagerMessage = PagerMessage;
exports.PagerDropDown = PagerDropDown;

return exports;

});

    sf.grids = sf.base.extend({}, sf.grids, sfpager({}));