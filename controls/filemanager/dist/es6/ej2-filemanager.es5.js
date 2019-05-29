import { Ajax, Browser, ChildProperty, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, closest, createElement, formatUnit, getValue, isNullOrUndefined, isVisible, matches, remove, removeClass, select, selectAll, setStyleAttribute, setValue } from '@syncfusion/ej2-base';
import { Splitter } from '@syncfusion/ej2-layouts';
import { Dialog, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Input, TextBox, Uploader } from '@syncfusion/ej2-inputs';
import { ListBase } from '@syncfusion/ej2-lists';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ContextMenu, Toolbar, TreeView } from '@syncfusion/ej2-navigations';
import { ContextMenu as ContextMenu$1, Grid, Resize, Sort, VirtualScroll } from '@syncfusion/ej2-grids';

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
 * Specifies the Ajax settings of the File Manager.
 */
var AjaxSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(AjaxSettings, _super);
    function AjaxSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], AjaxSettings.prototype, "downloadUrl", void 0);
    __decorate([
        Property(null)
    ], AjaxSettings.prototype, "getImageUrl", void 0);
    __decorate([
        Property(null)
    ], AjaxSettings.prototype, "uploadUrl", void 0);
    __decorate([
        Property(null)
    ], AjaxSettings.prototype, "url", void 0);
    return AjaxSettings;
}(ChildProperty));

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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var toolbarItems = ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename',
    'SortBy', 'Refresh', 'Selection', 'View', 'Details'];
/**
 * Specifies the Toolbar settings of the FileManager.
 */
var ToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(toolbarItems)
    ], ToolbarSettings.prototype, "items", void 0);
    __decorate$1([
        Property(true)
    ], ToolbarSettings.prototype, "visible", void 0);
    return ToolbarSettings;
}(ChildProperty));

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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the Ajax settings of the File Manager.
 */
var SearchSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(SearchSettings, _super);
    function SearchSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(true)
    ], SearchSettings.prototype, "allowSearchOnTyping", void 0);
    __decorate$2([
        Property('contains')
    ], SearchSettings.prototype, "filterType", void 0);
    __decorate$2([
        Property(true)
    ], SearchSettings.prototype, "ignoreCase", void 0);
    return SearchSettings;
}(ChildProperty));

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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the columns in the details view of the file manager.
 */
var columnArray = [
    {
        field: 'name', headerText: 'Name', minWidth: 120, width: 'auto',
        template: '<span class="e-fe-text" title="${name}">${name}</span>', customAttributes: { class: 'e-fe-grid-name' }
    },
    {
        field: 'dateModified', headerText: 'DateModified',
        format: { type: 'date', format: 'MMMM dd, yyyy HH:mm' },
        minWidth: 50, width: '190'
    },
    {
        field: 'size', headerText: 'Size', minWidth: 50, width: '110', template: '<span class="e-fe-size">${size}</span>'
    }
];
/**
 * Specifies the grid settings of the File Manager.
 */
var DetailsViewSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$3(DetailsViewSettings, _super);
    function DetailsViewSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property(true)
    ], DetailsViewSettings.prototype, "columnResizing", void 0);
    __decorate$3([
        Property(columnArray)
    ], DetailsViewSettings.prototype, "columns", void 0);
    return DetailsViewSettings;
}(ChildProperty));

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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var fileItems = ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details'];
var folderItems = ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details'];
var layoutItems = ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'];
/**
 * Specifies the ContextMenu settings of the File Manager.
 */
var ContextMenuSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$4(ContextMenuSettings, _super);
    function ContextMenuSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        Property(fileItems)
    ], ContextMenuSettings.prototype, "file", void 0);
    __decorate$4([
        Property(folderItems)
    ], ContextMenuSettings.prototype, "folder", void 0);
    __decorate$4([
        Property(layoutItems)
    ], ContextMenuSettings.prototype, "layout", void 0);
    __decorate$4([
        Property(true)
    ], ContextMenuSettings.prototype, "visible", void 0);
    return ContextMenuSettings;
}(ChildProperty));

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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the navigationpane settings of the File Manager.
 */
var NavigationPaneSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(NavigationPaneSettings, _super);
    function NavigationPaneSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property('650px')
    ], NavigationPaneSettings.prototype, "maxWidth", void 0);
    __decorate$5([
        Property('240px')
    ], NavigationPaneSettings.prototype, "minWidth", void 0);
    __decorate$5([
        Property(true)
    ], NavigationPaneSettings.prototype, "visible", void 0);
    return NavigationPaneSettings;
}(ChildProperty));

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
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the Ajax settings of the File Manager.
 */
var UploadSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(UploadSettings, _super);
    function UploadSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property(true)
    ], UploadSettings.prototype, "autoUpload", void 0);
    __decorate$6([
        Property(0)
    ], UploadSettings.prototype, "minFileSize", void 0);
    __decorate$6([
        Property(30000000)
    ], UploadSettings.prototype, "maxFileSize", void 0);
    return UploadSettings;
}(ChildProperty));

/**
 * FileExplorer common modules
 */

/**
 * Specifies the File Manager internal ID's
 */
var TOOLBAR_ID = '_toolbar';
/** @hidden */
var LAYOUT_ID = '_layout';
/** @hidden */
var TREE_ID = '_tree';
/** @hidden */
var GRID_ID = '_grid';
/** @hidden */
var LARGEICON_ID = '_largeicons';
/** @hidden */
var DIALOG_ID = '_dialog';
/** @hidden */
var ALT_DIALOG_ID = '_alt_dialog';
/** @hidden */
var IMG_DIALOG_ID = '_img_dialog';
/** @hidden */
var EXTN_DIALOG_ID = '_extn_dialog';
/** @hidden */
var UPLOAD_DIALOG_ID = '_upload_dialog';
/** @hidden */
var CONTEXT_MENU_ID = '_contextmenu';
/** @hidden */
var SORTBY_ID = '_sortby';
/** @hidden */
var VIEW_ID = '_view';
/** @hidden */
var SPLITTER_ID = '_splitter';
/** @hidden */
var CONTENT_ID = '_content';
/** @hidden */
var BREADCRUMBBAR_ID = '_breadcrumbbar';
/** @hidden */
var UPLOAD_ID = '_upload';
/** @hidden */
var SEARCH_ID = '_search';
/**
 * Specifies the File Manager internal class names
 */
var ROOT = 'e-filemanager';
/** @hidden */
var CONTROL = 'e-control';
/** @hidden */
var CHECK_SELECT = 'e-fe-cb-select';
/** @hidden */
var ROOT_POPUP = 'e-fe-popup';
/** @hidden */
var MOBILE = 'e-fe-mobile';
/** @hidden */
var MULTI_SELECT = 'e-fe-m-select';
/** @hidden */
var FILTER = 'e-fe-m-filter';
/** @hidden */
var LAYOUT = 'e-layout';
/** @hidden */
var LAYOUT_CONTENT = 'e-layout-content';
/** @hidden */
var LARGE_ICONS = 'e-large-icons';
/** @hidden */
var TB_ITEM = 'e-toolbar-item';
/** @hidden */
var LIST_ITEM = 'e-list-item';
/** @hidden */
var LIST_TEXT = 'e-list-text';
/** @hidden */
var LIST_PARENT = 'e-list-parent';
/** @hidden */
var TB_OPTION_TICK = 'e-icons e-fe-tick';
/** @hidden */
var TB_OPTION_DOT = 'e-icons e-fe-dot';
/** @hidden */
var BLUR = 'e-blur';
/** @hidden */
var ACTIVE = 'e-active';
/** @hidden */
var HOVER = 'e-hover';
/** @hidden */
var FOCUS = 'e-focus';
/** @hidden */
var CHECK = 'e-check';
/** @hidden */
var FRAME = 'e-frame';
/** @hidden */
var CB_WRAP = 'e-checkbox-wrapper';
/** @hidden */
var ROW = 'e-row';
/** @hidden */
var ROWCELL = 'e-rowcell';
/** @hidden */
var EMPTY = 'e-empty';
/** @hidden */
var EMPTY_CONTENT = 'e-empty-content';
/** @hidden */
var EMPTY_INNER_CONTENT = 'e-empty-inner-content';
/** @hidden */
var FOLDER = 'e-fe-folder';
/** @hidden */
var ICON_IMAGE = 'e-fe-image';
/** @hidden */
var ICON_MUSIC = 'e-fe-music';
/** @hidden */
var ICON_VIDEO = 'e-fe-video';
/** @hidden */
var LARGE_ICON = 'e-large-icon';
/** @hidden */
var LARGE_EMPTY_FOLDER = 'e-empty-icon e-fe-folder';
/** @hidden */
var LARGE_EMPTY_FOLDER_TWO = 'e-empty-icon.e-fe-folder';
/** @hidden */
var LARGE_ICON_FOLDER = 'e-fe-folder';
/** @hidden */
var SELECTED_ITEMS = 'e-items';
/** @hidden */
var TEXT_CONTENT = 'e-text-content';
/** @hidden */
var GRID_HEADER = 'e-gridheader';
/** @hidden */
var TEMPLATE_CELL = 'e-templatecell';
/** @hidden */
var TREE_VIEW = 'e-treeview';
/** @hidden */
var MENU_ITEM = 'e-menu-item';
/** @hidden */
var MENU_ICON = 'e-menu-icon';
/** @hidden */
var SUBMENU_ICON = 'e-caret';
/** @hidden */
var GRID_VIEW = 'e-content';
/** @hidden */
var ICON_VIEW = 'e-list-parent';
/** @hidden */
var ICON_OPEN = 'e-icons e-fe-open';
/** @hidden */
var ICON_UPLOAD = 'e-icons e-fe-upload';
/** @hidden */
var ICON_CUT = 'e-icons e-fe-cut';
/** @hidden */
var ICON_COPY = 'e-icons e-fe-copy';
/** @hidden */
var ICON_PASTE = 'e-icons e-fe-paste';
/** @hidden */
var ICON_DELETE = 'e-icons e-fe-delete';
/** @hidden */
var ICON_RENAME = 'e-icons e-fe-rename';
/** @hidden */
var ICON_NEWFOLDER = 'e-icons e-fe-newfolder';
/** @hidden */
var ICON_DETAILS = 'e-icons e-fe-details';
/** @hidden */
var ICON_SHORTBY = 'e-icons e-fe-sort';
/** @hidden */
var ICON_REFRESH = 'e-icons e-fe-refresh';
/** @hidden */
var ICON_SELECTALL = 'e-icons e-fe-select';
/** @hidden */
var ICON_DOWNLOAD = 'e-icons e-fe-download';
/** @hidden */
var ICON_OPTIONS = 'e-icons e-fe-options';
/** @hidden */
var ICON_GRID = 'e-icons e-fe-grid';
/** @hidden */
var ICON_LARGE = 'e-icons e-fe-large';
/** @hidden */
var ICON_BREADCRUMB = 'e-icons e-fe-breadcrumb';
/** @hidden */
var ICON_CLEAR = 'e-icons e-fe-clear';
/** @hidden */
var ICONS = 'e-icons';
/** @hidden */
var DETAILS_LABEL = 'e-detailslabel';
/** @hidden */
var ERROR_CONTENT = 'e-fe-errorcontent';
/** @hidden */
var STATUS = 'e-status';
/** @hidden */
var BREADCRUMBS = 'e-address';
/** @hidden */
var RTL = 'e-rtl';
/** @hidden */
var DISPLAY_NONE = 'e-display-none';
/** @hidden */
var COLLAPSED = 'e-node-collapsed';
/** @hidden */
var FULLROW = 'e-fullrow';
/** @hidden */
var ICON_COLLAPSIBLE = 'e-icon-collapsible';
/** @hidden */
var SPLIT_BAR = 'e-split-bar';
/** @hidden */
var HEADER_CHECK = 'e-headercheck';
/** @hidden */
var OVERLAY = 'e-fe-overlay';
/** @hidden */
var VALUE = 'e-fe-value';

/**
 * Specifies the File Manager internal variables
 */
/** @hidden */
var isFile = 'isFile';
/**
 * Specifies the File Manager internal events
 */
/** @hidden */
var modelChanged = 'model-changed';
/** @hidden */
var initialEnd = 'initial-end';
/** @hidden */
var finalizeEnd = 'finalize-end';
/** @hidden */
var createEnd = 'create-end';
/** @hidden */
var deleteEnd = 'delete-end';
/** @hidden */
var refreshEnd = 'refresh-end';
/** @hidden */
var resizeEnd = 'resize-end';
/** @hidden */
var splitterResize = 'splitter-resize';
/** @hidden */
var pathChanged = 'path-changed';
/** @hidden */
var destroy = 'destroy';
/** @hidden */
var beforeRequest = 'before-request';
/** @hidden */
var upload = 'upload';
/** @hidden */
var afterRequest = 'after-request';
/** @hidden */
var download = 'download';
/** @hidden */
var uiRefresh = 'ui-refresh';
/** @hidden */
var search = 'search';
/** @hidden */
var openInit = 'open-init';
/** @hidden */
var openEnd = 'open-end';
/** @hidden */
var selectionChanged = 'selection-changed';
/** @hidden */
var selectAllInit = 'select-all-init';
/** @hidden */
var clearAllInit = 'clear-all-init';
/** @hidden */
var clearPathInit = 'clear-path-init';
/** @hidden */
var layoutChange = 'layout-change';
/** @hidden */
var sortByChange = 'sort-by-change';
/** @hidden */
var nodeExpand = 'node-expand';
/** @hidden */
var renameInit = 'rename-init';
/** @hidden */
var renameEnd = 'rename-end';
/** @hidden */
var showPaste = 'show-paste';
/** @hidden */
var hidePaste = 'hide-paste';
/** @hidden */
var hideLayout = 'hide-layout';
/** @hidden */
var updateTreeSelection = 'update-tree-selection';
/** @hidden */
var treeSelect = 'select-node';
/** @hidden */
var sortColumn = 'sort-column';
/** @hidden */
var pathColumn = 'path-column';
/** @hidden */
var searchTextChange = 'search-change';
/** @hidden */
var downloadInit = 'download-init';

/**
 * Utility file for common actions
 */
//Gets the path for tree nodes
/* istanbul ignore next */
function copyPath(file) {
    var path = file.path.substr(0, file.path.length - 1);
    file.targetPath = path.substr(0, path.lastIndexOf('/') + 1);
}
function updatePath(node, text, instance) {
    instance.setProperties({ path: getPath(node, text) }, true);
    instance.pathId = getPathId(node);
}
function getPath(element, text) {
    var matched = getParents(element, text, false);
    var path = '/';
    for (var i = matched.length - 2; i >= 0; i--) {
        path += matched[i] + '/';
    }
    return path;
}
function getPathId(node) {
    var matched = getParents(node, node.getAttribute('data-uid'), true);
    var ids = [];
    for (var i = matched.length - 1; i >= 0; i--) {
        ids.push(matched[i]);
    }
    return ids;
}
function getParents(element, text, isId) {
    var matched = [text];
    var el = element.parentNode;
    while (!isNullOrUndefined(el)) {
        if (matches(el, '.' + LIST_ITEM)) {
            var parentText = isId ? el.getAttribute('data-uid') : select('.' + LIST_TEXT, el).textContent;
            matched.push(parentText);
        }
        el = el.parentNode;
    }
    return matched;
}
//Stores tree nodes while performing cut, copy and paste operation
function treeNodes(tree, gridFiles, action) {
    var _a;
    /* istanbul ignore next */
    if (gridFiles) {
        var i = 0;
        for (i; i < gridFiles.length; i++) {
            var files = gridFiles[i];
            var id = files.id;
            if (files.isFile === false) {
                (action === 'cut') ? tree.treeNodes.push(id) : tree.treeNodes = tree.treeNodes;
                (action === 'copy') ?
                    tree.copyNodes.push((_a = {}, _a['name'] = files.name, _a)) : tree.copyNodes = tree.copyNodes;
                (action === 'Delete') ? tree.removeNodes.push(id) : tree.removeNodes = tree.removeNodes;
            }
        }
    }
    else {
        tree.treeNodes = (action === 'cut') ? tree.treeObj.selectedNodes : tree.treeNodes;
        tree.removeNodes = (action === 'Delete') ? tree.treeObj.selectedNodes : tree.removeNodes;
    }
}
// Selects active element in File Manager
/* istanbul ignore next */
function activeElement(action, isGrid, file) {
    var nodeNames = [];
    removeBlur(file);
    var blurEle = file.activeElements;
    file.targetPath = file.path;
    var i = 0;
    var isFile$$1;
    var id;
    if (blurEle) {
        getModule(blurEle[0], file);
        while (i < blurEle.length) {
            if (action === 'cut') {
                addBlur(blurEle[i]);
            }
            isFile$$1 = (file.activeModule === 'largeiconsview') ?
                ((blurEle[i].querySelector('.' + LARGE_ICON_FOLDER)) ? false : true) : null;
            id = (isFile$$1 === false) ? closest(blurEle[i], 'li').getAttribute('data-uid') : null;
            (blurEle[i].querySelector('.' + LIST_TEXT)) ?
                nodeNames.push({ 'name': blurEle[i].querySelector('.' + LIST_TEXT).textContent, 'isFile': isFile$$1, 'id': id }) :
                nodeNames = nodeNames;
            i++;
        }
        if (file.activeModule === 'detailsview' && isGrid !== false) {
            nodeNames = file.detailsviewModule.gridSelectNodes();
            if ((action === 'cut' || action === 'copy' || action === 'Delete') && file.navigationpaneModule) {
                treeNodes(file.navigationpaneModule, nodeNames, action);
            }
        }
        else if (file.activeModule === 'largeiconsview' && file.navigationpaneModule) {
            (action === 'cut' || action === 'copy' || action === 'Delete') ?
                treeNodes(file.navigationpaneModule, nodeNames, action) : nodeNames = nodeNames;
        }
        else {
            ((action === 'cut' || action === 'copy' || action === 'Delete') && file.navigationpaneModule) ?
                treeNodes(file.navigationpaneModule, null, action) : nodeNames = nodeNames;
            if (file.activeModule === 'navigationpane') {
                copyPath(file);
            }
        }
    }
    return nodeNames;
}
function addBlur(nodes) {
    nodes.classList.add(BLUR);
}
// Removes blur from elements
function removeBlur(file, hover) {
    var blurEle = (!hover) ? file.element.querySelectorAll('.' + BLUR) :
        file.element.querySelectorAll('.' + HOVER);
    var i = 0;
    while (i < blurEle.length) {
        (!hover) ? blurEle[i].classList.remove(BLUR) : blurEle[i].classList.remove(HOVER);
        i++;
    }
}
// Gets module name
/* istanbul ignore next */
function getModule(element, file) {
    if (element) {
        if (element.classList.contains(ROWCELL)) {
            file.activeModule = 'detailsview';
        }
        else if (closest(element, '.' + LARGE_ICON)) {
            file.activeModule = 'largeiconsview';
        }
        else {
            file.activeModule = 'navigationpane';
        }
    }
}
function refresh(parent) {
    parent.itemData = [getPathObject(parent)];
    read(parent, refreshEnd, parent.path);
}
function openAction(parent) {
    read(parent, openEnd, parent.path);
}
function getFileObject(parent) {
    var currFiles = getValue(parent.path, parent.feFiles);
    if (currFiles) {
        var item = parent.selectedItems[parent.selectedItems.length - 1];
        for (var i = 0, len = currFiles.length; i < len; i++) {
            if (item === getValue('name', currFiles[i])) {
                return currFiles[i];
            }
        }
    }
    return getValue(parent.path, parent.feParent);
}
function getPathObject(parent) {
    return getValue(parent.path, parent.feParent);
}
// Copy files
function copyFiles(parent) {
    parent.cutNodes = [];
    parent.navigationpaneModule.treeNodes = [];
    parent.navigationpaneModule.copyNodes = [];
    parent.nodeNames = [];
    parent.selectedNodes = [];
    parent.nodeNames = activeElement('copy', null, parent);
    if (parent.nodeNames) {
        parent.fileAction = 'CopyTo';
        parent.enablePaste = true;
        parent.notify(showPaste, {});
    }
}
// Cut files
function cutFiles(parent) {
    parent.navigationpaneModule.treeNodes = [];
    parent.navigationpaneModule.copyNodes = [];
    parent.nodeNames = [];
    parent.selectedNodes = [];
    parent.nodeNames = activeElement('cut', null, parent);
    if (parent.nodeNames) {
        parent.cutNodes = parent.nodeNames;
        parent.fileAction = 'MoveTo';
        parent.enablePaste = true;
        parent.notify(showPaste, {});
    }
}
// To add class for fileType
function fileType(file) {
    var isFile$$1 = getValue('isFile', file);
    if (!isFile$$1) {
        return 'e-fe-folder';
    }
    var imageFormat = ['bmp', 'dib', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'png', 'ico'];
    var audioFormat = ['mp3', 'wav', 'aac', 'ogg', 'wma', 'aif', 'fla', 'm4a'];
    var videoFormat = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'wmv', 'mp4', '3gp'];
    var knownFormat = ['css', 'exe', 'html', 'js', 'msi', 'pdf', 'pptx', 'ppt', 'rar', 'zip', 'txt', 'docx', 'doc',
        'xlsx', 'xls', 'xml', 'rtf', 'php'];
    var filetype = getValue('type', file);
    filetype = filetype.toLowerCase();
    if (filetype.indexOf('.') !== -1) {
        filetype = filetype.split('.').join('');
    }
    var iconType;
    if (imageFormat.indexOf(filetype) !== -1) {
        iconType = ICON_IMAGE;
    }
    else if (audioFormat.indexOf(filetype) !== -1) {
        iconType = ICON_MUSIC;
    }
    else if (videoFormat.indexOf(filetype) !== -1) {
        iconType = ICON_VIDEO;
    }
    else if (knownFormat.indexOf(filetype) !== -1) {
        iconType = 'e-fe-' + filetype;
    }
    else {
        iconType = 'e-fe-unknown e-fe-' + filetype;
    }
    return iconType;
}
function getImageUrl(parent, item) {
    var baseUrl = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    var imgUrl;
    if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
        imgUrl = baseUrl + '?path=' + getValue('filterPath', item);
    }
    else {
        imgUrl = baseUrl + '?path=' + parent.path + getValue('name', item);
    }
    return imgUrl;
}
function getSortedData(parent, items) {
    if (items.length === 0) {
        return items;
    }
    var query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    var lists = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}
/* istanbul ignore next */
function getItemObject(parent, item) {
    var name = select('.' + LIST_TEXT, item).textContent;
    return getObject(parent, name);
}
function getObject(parent, name) {
    var currFiles = getValue(parent.path, parent.feFiles);
    var query = new Query().where('name', 'equal', name);
    var lists = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}
function createEmptyElement(parent, operation, element) {
    if (isNullOrUndefined(element.querySelector('.' + EMPTY))) {
        var emptyDiv = createElement('div', { className: EMPTY });
        var emptyFolder = createElement('div', { className: LARGE_EMPTY_FOLDER });
        var emptyEle = createElement('div', { className: EMPTY_CONTENT });
        var dragFile = createElement('div', { className: EMPTY_INNER_CONTENT });
        if (parent.view === 'Details') {
            element.querySelector('.' + GRID_VIEW).appendChild(emptyDiv);
        }
        else {
            element.appendChild(emptyDiv);
        }
        emptyDiv.appendChild(emptyFolder);
        emptyDiv.appendChild(emptyEle);
        emptyDiv.appendChild(dragFile);
    }
    if (element.querySelector('.' + EMPTY)) {
        if (operation === 'search') {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
        }
        else {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
        }
    }
}
function getDirectories(files) {
    return new DataManager(files).executeLocal(new Query().where(isFile, 'equal', false, false));
}
function setNodeId(result, rootId) {
    setValue('nodeId', rootId, result.cwd);
    var dirs = getDirectories(result.files);
    for (var i = 0, len = dirs.length; i < len; i++) {
        setValue('nodeId', rootId + '_' + i, dirs[i]);
    }
}
function setDateObject(args) {
    for (var i = 0; i < args.length; i++) {
        setValue('dateCreated', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('dateModified', new Date(getValue('dateModified', args[i])), args[i]);
    }
}
function getLocaleText(parent, text) {
    var locale = parent.localeObj.getConstant(text);
    return (locale === '') ? text : locale;
}
function getCssClass(parent, css) {
    var cssClass = parent.cssClass;
    cssClass = (isNullOrUndefined(cssClass) || cssClass === '') ? css : (cssClass + ' ' + css);
    return cssClass;
}
function sortbyClickHandler(parent, args) {
    var tick;
    if (args.item.id.indexOf('ascending') !== -1 || args.item.id.indexOf('descending') !== -1) {
        tick = true;
    }
    else {
        tick = false;
    }
    if (!tick) {
        parent.sortBy = getSortField(args.item.id);
    }
    else {
        parent.sortOrder = getSortField(args.item.id);
    }
    if (parent.view === 'Details') {
        if (parent.isMobile) {
            read(parent, layoutChange, parent.path);
        }
        else {
            parent.notify(sortColumn, { module: 'gridview' });
        }
    }
    if (parent.view === 'LargeIcons') {
        read(parent, layoutChange, parent.path);
    }
    parent.notify(sortByChange, {});
}
function getSortField(id) {
    var text = id.substring(id.lastIndexOf('_') + 1);
    var field = text;
    switch (text) {
        case 'date':
            field = 'dateModified';
            break;
        case 'ascending':
            field = 'Ascending';
            break;
        case 'descending':
            field = 'Descending';
            break;
    }
    return field;
}
function setNextPath(parent, path) {
    var currfolders = path.split('/');
    var folders = parent.originalPath.split('/');
    for (var i = currfolders.length - 1, len = folders.length - 1; i < len; i++) {
        var eventName = (folders[i + 1] === '') ? finalizeEnd : initialEnd;
        var newPath = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
        var data = getObject(parent, folders[i]);
        var id = getValue('nodeId', data);
        parent.setProperties({ path: newPath }, true);
        parent.pathId.push(id);
        parent.itemData = [data];
        read(parent, eventName, parent.path);
        break;
    }
}
function openSearchFolder(parent, data) {
    var fPath = getValue('filterPath', data) + '/';
    fPath = fPath.replace(/\\/g, '/');
    parent.notify(clearPathInit, { selectedNode: parent.pathId[parent.pathId.length - 1] });
    parent.originalPath = fPath;
    read(parent, (parent.path !== parent.originalPath) ? initialEnd : finalizeEnd, parent.path);
}

/**
 * Function to read the content from given path in File Manager.
 * @private
 */
function read(parent, event, path) {
    var data = { action: 'Read', path: path, showHiddenItems: parent.showHiddenItems, data: parent.itemData };
    createAjax(parent, data, readSuccess, event);
}
/**
 * Function to create new folder in File Manager.
 * @private
 */
function createFolder(parent, itemName) {
    var data = { action: 'CreateFolder', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess);
}
/* Function to rename the folder/file in File Manager.
* @private
*/
function rename(parent, itemNewName) {
    var data = {
        action: 'Rename', path: parent.path, name: parent.currentItemText, itemNewName: itemNewName,
        data: parent.itemData
    };
    createAjax(parent, data, renameSuccess, parent.path);
}
/**
 * Function to paste file's and folder's in File Manager.
 * @private
 */
function paste(
// tslint:disable-next-line
parent, path, names, targetPath, pasteOperation, navigationPane, replaceItems) {
    var data = {
        action: pasteOperation, path: path,
        targetPath: targetPath, itemNames: names, CommonFiles: replaceItems
    };
    createAjax(parent, data, pasteSuccess, path, navigationPane, pasteOperation, targetPath);
}
/**
 * Function to delete file's and folder's in File Manager.
 * @private
 */
function Delete(parent, items, path, operation, treeView) {
    var data = { action: operation, path: path, itemNames: items };
    createAjax(parent, data, deleteSuccess, path, treeView);
}
/**
 * Function to get details of file's and folder's in File Manager.
 * @private
 */
/* istanbul ignore next */
function GetDetails(parent, itemNames, path, operation) {
    var data = { action: operation, path: path, itemNames: itemNames };
    createAjax(parent, data, detailsSuccess, path, null, operation);
}
function createAjax(parent, data, fn, event, navigationPane, operation, targetPath) {
    var ajaxSettings = {
        url: parent.ajaxSettings.url,
        type: 'POST',
        mode: true,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        onSuccess: null,
        onFailure: null,
        beforeSend: null
    };
    var eventArgs = { action: getValue('action', data), ajaxSettings: ajaxSettings, cancel: false };
    parent.trigger('beforeSend', eventArgs);
    if (eventArgs.cancel) {
        return;
    }
    parent.notify(beforeRequest, {});
    var ajax = new Ajax({
        url: getValue('url', eventArgs.ajaxSettings),
        type: getValue('type', eventArgs.ajaxSettings),
        mode: getValue('mode', eventArgs.ajaxSettings),
        dataType: getValue('dataType', eventArgs.ajaxSettings),
        contentType: getValue('contentType', eventArgs.ajaxSettings),
        data: getValue('data', eventArgs.ajaxSettings),
        beforeSend: getValue('beforeSend', eventArgs.ajaxSettings),
        onSuccess: function (result) {
            if (typeof (result) === 'string') {
                result = JSON.parse(result);
            }
            parent.notify(afterRequest, { action: 'success' });
            if (!isNullOrUndefined(result.files)) {
                // tslint:disable-next-line
                setDateObject(result.files);
                for (var i = 0, len = result.files.length; i < len; i++) {
                    var item = result.files[i];
                    setValue('iconClass', fileType(item), item);
                }
            }
            if (getValue('action', data) === 'Read') {
                var path = getValue('path', data);
                setNodeId(result, parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1]);
                setValue(path, result.files, parent.feFiles);
                setValue(path, result.cwd, parent.feParent);
            }
            fn(parent, result, event, navigationPane, operation, targetPath);
            if (typeof getValue('onSuccess', eventArgs.ajaxSettings) === 'function') {
                getValue('onSuccess', eventArgs.ajaxSettings)();
            }
        },
        onFailure: function () {
            var result = {
                files: null,
                error: {
                    code: '404',
                    message: 'NetworkError: Faild to send on XMLHTTPRequest: Failed to load ' + parent.ajaxSettings.url,
                    fileExists: null
                },
            };
            parent.notify(afterRequest, { action: 'failure' });
            fn(parent, result, event, navigationPane, operation, targetPath);
            if (typeof getValue('onFailure', eventArgs.ajaxSettings) === 'function') {
                getValue('onFailure', eventArgs.ajaxSettings)();
            }
        }
    });
    ajax.send();
}
function readSuccess(parent, result, event) {
    if (!isNullOrUndefined(result.files)) {
        parent.notify(event, result);
        parent.notify(selectionChanged, {});
        parent.trigger('onSuccess', { action: 'Read', result: result });
    }
    else {
        onFailure(parent, result, 'Read');
    }
}
/* istanbul ignore next */
function createSuccess(parent, result) {
    if (!isNullOrUndefined(result.files)) {
        parent.dialogObj.hide();
        parent.createdItem = result.files[0];
        parent.trigger('onSuccess', { action: 'CreateFolder', result: result });
        read(parent, createEnd, parent.path);
    }
    else {
        if (result.error.code === '400') {
            var ele = select('#newname', parent.dialogObj.element);
            var error = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
        }
        else {
            parent.dialogObj.hide();
            onFailure(parent, result, 'CreateFolder');
        }
    }
}
/* Function to rename the folder/file in File Manager.
 * @private
 */
/* istanbul ignore next */
function renameSuccess(parent, result, path) {
    if (!isNullOrUndefined(result.files)) {
        parent.dialogObj.hide();
        parent.trigger('onSuccess', { action: 'Rename', result: result });
        parent.renamedItem = result.files[0];
        if (parent.selectedItems.length === 0 && parent.navigationpaneModule) {
            var treePath = parent.parentPath.split('/');
            var newPath = parent.parentPath.replace(treePath[treePath.length - 2] + '/', parent.renameText + '/');
            parent.setProperties({ path: newPath }, true);
        }
        read(parent, renameEnd, parent.path);
    }
    else {
        if (result.error.code === '400') {
            var ele = select('#rename', parent.dialogObj.element);
            var error = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
            error = error.replace('{1}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
        }
        else {
            parent.dialogObj.hide();
            onFailure(parent, result, 'Rename');
        }
    }
}
/**
 * Function to create new folder in File Manager.
 * @private
 */
/* istanbul ignore next */
function pasteSuccess(
// tslint:disable-next-line
parent, result, path, treeView, operation) {
    if (result.error && result.error.fileExists) {
        parent.fileLength = 0;
        for (var i = 0; i < result.files.length; i++) {
            createDialog(parent, 'DuplicateItems', result, null, result.error.fileExists);
        }
        parent.detailsviewModule.pasteOperation = true;
        parent.largeiconsviewModule.pasteOperation = true;
        parent.duplicateItems = [];
    }
    else if (!result.error && !isNullOrUndefined(result.files)) {
        parent.detailsviewModule.pasteOperation = true;
        parent.largeiconsviewModule.pasteOperation = true;
        parent.pasteNodes = parent.selectedNodes;
        read(parent, pathChanged, parent.path);
        if (operation === 'MoveTo' && treeView.treeNodes.length !== 0) {
            parent.selectedNodes = [];
            treeView.moveNode();
        }
        else if (operation === 'CopyTo' && treeView.copyNodes.length !== 0) {
            treeView.copyNode();
        }
        if (operation === 'MoveTo') {
            parent.enablePaste = false;
            parent.notify(hidePaste, {});
        }
        parent.trigger('onSuccess', { action: operation, result: result });
    }
    else {
        onFailure(parent, result, operation);
    }
}
/* istanbul ignore next */
function deleteSuccess(parent, result, path) {
    if (!isNullOrUndefined(result.files)) {
        parent.setProperties({ path: path }, true);
        read(parent, deleteEnd, parent.path);
        parent.trigger('onSuccess', { action: 'Remove', result: result });
    }
    else {
        onFailure(parent, result, 'Remove');
    }
}
/* istanbul ignore next */
function detailsSuccess(
// tslint:disable-next-line
parent, result, path, treeView, operation) {
    if (!isNullOrUndefined(result.details)) {
        createDialog(parent, operation, null, result.details);
        parent.trigger('onSuccess', { action: 'GetDetails', result: result });
    }
    else {
        onFailure(parent, result, 'GetDetails');
    }
}
function onFailure(parent, result, action) {
    createDialog(parent, 'Error', result);
    parent.trigger('onError', { action: action, error: result.error });
}
/* istanbul ignore next */
function Search(
// tslint:disable-next-line
parent, event, path, searchString, showHiddenItems, caseSensitive) {
    var data = { action: 'Search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive };
    createAjax(parent, data, searchSuccess, event);
}
/* istanbul ignore next */
function searchSuccess(parent, result, event) {
    if (!isNullOrUndefined(result.files)) {
        parent.notify(event, result);
        parent.trigger('onSuccess', { action: 'Search', result: result });
    }
    else {
        onFailure(parent, result, 'Search');
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
function Download(parent, selectedRecords) {
    var itemNames = [];
    var itemPath;
    var downloadUrl = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    for (var item = 0; item < selectedRecords.length; item++) {
        itemNames.push(selectedRecords[item].name);
        itemPath = selectedRecords[item].filterPath;
    }
    var data = {
        'action': 'Download',
        'path': !isNullOrUndefined(itemPath) ? itemPath : parent.path,
        'itemNames': itemNames
    };
    var form = createElement('form', {
        id: parent.element.id + '_downloadForm',
        attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
    });
    var input = createElement('input', {
        id: parent.element.id + '_hiddenForm',
        attrs: { name: 'downloadInput', value: JSON.stringify(data), type: 'hidden' }
    });
    form.appendChild(input);
    parent.element.appendChild(form);
    document.forms.namedItem('downloadForm').submit();
    parent.element.removeChild(form);
}

/**
 * Function to create the dialog for new folder in File Manager.
 * @private
 */
// tslint:disable-next-line
function createDialog(parent, text, e, details, replaceItems) {
    var options = getOptions(parent, text, e, details, replaceItems);
    if (isNullOrUndefined(parent.dialogObj)) {
        parent.dialogObj = new Dialog({
            header: options.header,
            content: options.content,
            buttons: options.buttons,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            isModal: true,
            target: '#' + parent.element.id,
            width: '350px',
            open: options.open,
            enableRtl: parent.enableRtl,
            locale: parent.locale
        });
        parent.dialogObj.appendTo('#' + parent.element.id + DIALOG_ID);
    }
    else {
        changeOptions(parent, options);
    }
}
function focusInput(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    ele.focus();
    ele.value = '';
    var len = ele.value.length;
    ele.setSelectionRange(0, len);
}
function onFolderDialogOpen(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    if (!ele.parentElement.classList.contains('e-control-wrapper')) {
        createInput(ele, getLocaleText(parent, 'Content-NewFolder'));
    }
    ele.parentElement.nextElementSibling.innerHTML = '';
    ele.oninput = function () {
        onValidate(parent, ele);
    };
    ele.onkeyup = function (e) {
        var code = getKeyCode(e);
        if (code === 13) {
            onSubmit(parent);
        }
    };
    focusInput(parent);
}
function onRenameDialogOpen(parent) {
    var inputEle = select('#rename', parent.dialogObj.element);
    if (!inputEle.parentElement.classList.contains('e-control-wrapper')) {
        createInput(inputEle, getLocaleText(parent, 'Content-Rename'));
    }
    inputEle.parentElement.nextElementSibling.innerHTML = '';
    inputEle.oninput = function () {
        onValidate(parent, inputEle);
    };
    inputEle.onkeyup = function (e) {
        var code = getKeyCode(e);
        if (code === 13) {
            onReSubmit(parent);
        }
    };
    onFocusRenameInput(parent, inputEle);
}
function onFocusRenameInput(parent, inputEle) {
    inputEle.focus();
    inputEle.value = parent.currentItemText;
    if (parent.isFile && (parent.isFile && inputEle.value.indexOf('.') !== -1)) {
        inputEle.setSelectionRange(0, inputEle.value.lastIndexOf('.'));
    }
    else {
        inputEle.setSelectionRange(0, inputEle.value.length);
    }
}
function createInput(ele, placeholder) {
    Input.createInput({
        element: ele,
        properties: {
            placeholder: placeholder
        }
    });
}
// tslint:disable-next-line
/* istanbul ignore next */
function getOptions(parent, text, e, details, replaceItems) {
    var options = { header: '', content: '', buttons: [], open: null };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
            options.header = getLocaleText(parent, 'Header-NewFolder');
            options.content = '<input type="text" value="New folder" id="newname"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Create') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onSubmit(parent);
                    },
                }
            ];
            options.open = onFolderDialogOpen.bind(this, parent);
            break;
        case 'Delete':
            if (parent.selectedItems.length > 1) {
                options.content = ('<div>' + getLocaleText(parent, 'Content-Multiple-Delete') + '</div>')
                    .replace('{0}', parent.selectedItems.length.toString());
                options.header = getLocaleText(parent, 'Header-Multiple-Delete');
            }
            else {
                options.content = '<div>' + getLocaleText(parent, 'Content-Delete') + '</div>';
                options.header = getLocaleText(parent, 'Header-Delete');
            }
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onDeleteSubmit(parent);
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: function () {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Rename':
            options.header = getLocaleText(parent, 'Header-Rename');
            options.content = '<input type="text" class="e-input" id="rename"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Save') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onReSubmit(parent);
                    },
                }
            ];
            options.open = onRenameDialogOpen.bind(this, parent);
            break;
        case 'DuplicateItems':
            parent.replaceItems = replaceItems;
            options.header = getLocaleText(parent, 'Header-Duplicate');
            // tslint:disable-next-line
            options.content = '<div>' + parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1) + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        // tslint:disable-next-line
                        var item = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
                        parent.duplicateItems.push(item);
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            // tslint:disable-next-line
                            parent.dialogObj.content = '<div>' + parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1) + getLocaleText(parent, 'Content-Duplicate') + '</div>';
                            parent.dialogObj.show();
                        }
                        else {
                            parent.dialogObj.hide();
                            paste(
                            // tslint:disable-next-line
                            parent, parent.targetPath, parent.selectedNodes, parent.path, parent.fileAction, parent.navigationpaneModule, parent.duplicateItems);
                        }
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: function () {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            // tslint:disable-next-line
                            var item = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
                            // tslint:disable-next-line
                            parent.dialogObj.content = '<div>' + item + ' already exists. Are you sure you want to replace it ?</div>';
                            parent.dialogObj.show();
                        }
                        else {
                            parent.dialogObj.hide();
                            if (parent.duplicateItems.length !== 0) {
                                paste(
                                // tslint:disable-next-line
                                parent, parent.targetPath, parent.duplicateItems, parent.path, parent.fileAction, parent.navigationpaneModule, parent.duplicateItems);
                            }
                        }
                    },
                }
            ];
            break;
        case 'GetDetails':
            var intl = new Internationalization();
            var parseDate = intl.parseDate(details.modified, { format: 'MM/dd/yyy hh:mm:ss' });
            var formattedString = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
            options.header = details.name;
            options.content = '<table>' +
                '<tr><td>' + getLocaleText(parent, 'Type') + '</td><td class="' + VALUE + '" title="' +
                (details.isFile ? 'File' : 'Folder') + '">' + (details.isFile ? 'File' : 'Folder') + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + '</td><td><span class="' + VALUE + '" title ="' +
                details.size + '">' + details.size + '</span></td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Location') + '</td><td class="' + VALUE + '" title="' +
                details.location + '">' + details.location + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Modified') + '</td><td class="' + VALUE + '" >'
                + formattedString + '</td></tr>'
                + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'MultipleFileDetails':
            var location_1 = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + VALUE + '">Multiple Types</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + ':</td><td>' +
                details.size + '<span class="' + VALUE + '" title ="' + details.size
                + '"></span></td></tr>' + '<tr><td>' + getLocaleText(parent, 'Location') +
                ':</td><td class="' + VALUE + '" title="' + location_1 + '">'
                + location_1 + '</td></tr>' + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Error':
            var event_1 = e;
            if (event_1.error.code === '523') {
                options.header = 'Access Denied';
            }
            else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + ERROR_CONTENT + '">' + event_1.error.message + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: function (e) {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
    }
    return options;
}
function changeOptions(parent, options) {
    parent.dialogObj.header = options.header;
    parent.dialogObj.content = options.content;
    parent.dialogObj.buttons = options.buttons;
    parent.dialogObj.enableRtl = parent.enableRtl;
    parent.dialogObj.open = options.open;
    parent.dialogObj.dataBind();
    parent.dialogObj.show();
}
function onSubmit(parent) {
    var ele = select('#newname', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    createFolder(parent, ele.value);
}
/* istanbul ignore next */
function onReSubmit(parent) {
    var ele = select('#rename', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    var text = ele.value;
    parent.renameText = ele.value;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    if (parent.selectedItems.length === 0) {
        parent.parentPath = parent.path;
        var treePath = parent.path.split('/');
        var newPath = parent.path.replace(treePath[treePath.length - 2] + '/', '');
        parent.setProperties({ path: newPath }, true);
    }
    if (parent.isFile) {
        var oldExtension = parent.currentItemText.substr(parent.currentItemText.lastIndexOf('.'));
        var newExtension = text.substr(text.lastIndexOf('.'));
        if (oldExtension !== newExtension) {
            if (isNullOrUndefined(parent.extDialogObj)) {
                parent.extDialogObj = new Dialog({
                    header: getLocaleText(parent, 'Header-Rename-Confirmation'),
                    content: '<div>' + getLocaleText(parent, 'Content-Rename-Confirmation') + '</div>',
                    animationSettings: { effect: 'None' },
                    target: '#' + parent.element.id,
                    showCloseIcon: true,
                    closeOnEscape: true,
                    isModal: true,
                    width: 350,
                    buttons: [{
                            buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                            click: function () {
                                parent.extDialogObj.hide();
                                rename(parent, parent.renameText);
                            },
                        },
                        {
                            buttonModel: { content: getLocaleText(parent, 'Button-No') },
                            click: function () {
                                parent.extDialogObj.hide();
                                parent.dialogObj.hide();
                            },
                        }],
                });
                parent.extDialogObj.appendTo('#' + parent.element.id + EXTN_DIALOG_ID);
            }
            else {
                parent.extDialogObj.show();
            }
        }
        else {
            rename(parent, text);
        }
    }
    else {
        rename(parent, text);
    }
}
function onDeleteSubmit(parent) {
    parent.dialogObj.hide();
    var delItems = activeElement('Delete', null, parent);
    parent.deleteHandler(delItems);
}
function onValidate(parent, ele) {
    if (/[/\\|*?"<>:]/.test(ele.value)) {
        addInvalid(parent, ele);
    }
    else if (ele.value === '') {
        ele.parentElement.nextElementSibling.innerHTML = getLocaleText(parent, 'Validation-Empty');
    }
    else {
        ele.parentElement.nextElementSibling.innerHTML = '';
    }
}
function onSubmitValidate(parent, ele) {
    onValidate(parent, ele);
    var len = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len))) {
        addInvalid(parent, ele);
    }
}
function addInvalid(parent, ele) {
    var error = getLocaleText(parent, 'Validation-Invalid').replace('{0}', '"' + ele.value + '"');
    ele.parentElement.nextElementSibling.innerHTML = error;
}
function getKeyCode(e) {
    var code;
    if (e.keyCode) {
        code = e.keyCode;
    }
    else if (e.which) {
        code = e.which;
    }
    else {
        code = e.charCode;
    }
    return code;
}
function createImageDialog(parent, header, imageUrl) {
    var content = createElement('div', { className: 'e-image-wrap' });
    var image = createElement('img', { className: 'e-image', attrs: { src: imageUrl } });
    content.appendChild(image);
    if (isNullOrUndefined(parent.viewerObj)) {
        parent.viewerObj = new Dialog({
            header: header,
            content: content,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            isModal: true,
            width: '350px',
            height: '350px',
            target: '#' + parent.element.id,
            locale: parent.locale,
            enableResize: true,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: parent.enableRtl,
            open: openImage.bind(this, parent),
            resizing: updateImage.bind(this, parent),
            resizeStop: updateImage.bind(this, parent)
        });
        parent.viewerObj.appendTo('#' + parent.element.id + IMG_DIALOG_ID);
    }
    else {
        parent.viewerObj.refresh();
        parent.viewerObj.header = header;
        parent.viewerObj.content = content;
        parent.viewerObj.enableRtl = parent.enableRtl;
        parent.viewerObj.dataBind();
        parent.viewerObj.show();
    }
}
function openImage(parent) {
    setTimeout(function () {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
}
function updateImage(parent) {
    var content = select('.e-dlg-content', parent.viewerObj.element);
    var imgWrap = select('.e-image-wrap', parent.viewerObj.element);
    var cssObj = window.getComputedStyle(content, null);
    var paddingWidth = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    var paddingHeight = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}

/**
 * File Manager common operations
 */

/**
 * LargeIcons module
 */
var LargeIconsView = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the LargeIcons module
     * @hidden
     */
    function LargeIconsView(parent) {
        this.pasteOperation = false;
        this.uploadOperation = false;
        this.count = 0;
        this.isRendered = true;
        this.tapCount = 0;
        this.isSetModel = false;
        this.parent = parent;
        this.element = select('#' + this.parent.element.id + LARGEICON_ID, this.parent.element);
        addClass([this.element], LARGE_ICONS);
        this.addEventListener();
        this.keyConfigs = {
            end: 'end',
            home: 'home',
            tab: 'tab',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlEnd: 'ctrl+end',
            ctrlHome: 'ctrl+home',
            ctrlDown: 'ctrl+downarrow',
            ctrlLeft: 'ctrl+leftarrow',
            ctrlRight: 'ctrl+rightarrow',
            ctrlUp: 'ctrl+uparrow',
            shiftEnd: 'shift+end',
            shiftHome: 'shift+home',
            shiftDown: 'shift+downarrow',
            shiftLeft: 'shift+leftarrow',
            shiftRight: 'shift+rightarrow',
            shiftUp: 'shift+uparrow',
            csEnd: 'ctrl+shift+end',
            csHome: 'ctrl+shift+home',
            csDown: 'ctrl+shift+downarrow',
            csLeft: 'ctrl+shift+leftarrow',
            csRight: 'ctrl+shift+rightarrow',
            csUp: 'ctrl+shift+uparrow',
            space: 'space',
            ctrlSpace: 'ctrl+space',
            shiftSpace: 'shift+space',
            csSpace: 'ctrl+shift+space',
            ctrlA: 'ctrl+a',
            enter: 'enter',
            altEnter: 'alt+enter',
            esc: 'escape',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            f2: 'f2',
            shiftdel: 'shift+delete',
            back: 'backspace'
        };
    }
    LargeIconsView.prototype.render = function (args) {
        this.element.setAttribute('tabindex', '0');
        this.parent.visitedItem = null;
        this.startItem = null;
        if (this.parent.view === 'LargeIcons') {
            this.resetMultiSelect();
            if (this.listObj) {
                this.unWireEvents();
                this.removeEventListener();
            }
            this.parent.notify(hideLayout, {});
            var iconsView = select('#' + this.parent.element.id + LARGEICON_ID, this.parent.element);
            var ul = select('ul', iconsView);
            if (ul) {
                remove(ul);
            }
            this.listObj = {
                ariaAttributes: {
                    itemRole: '', listRole: '', itemText: '',
                    groupItemRole: 'group', wrapperRole: 'presentation'
                },
                showIcon: true,
                fields: { text: 'name', iconCss: 'icon', imageUrl: 'imageUrl' },
                sortOrder: this.parent.sortOrder,
                itemCreated: this.onItemCreated.bind(this),
            };
            this.items = [];
            this.items = this.renderList(args);
            this.items = getSortedData(this.parent, this.items);
            this.listElements = ListBase.createListFromJson(createElement, this.items, this.listObj);
            this.itemList = Array.prototype.slice.call(selectAll('.' + LIST_ITEM, this.listElements));
            this.element.appendChild(this.listElements);
            if (this.itemList.length === 0) {
                var emptyList = this.element.querySelector('.' + LIST_PARENT);
                this.element.removeChild(emptyList);
                createEmptyElement(this.parent, getValue('name', args), this.element);
            }
            else if (this.itemList.length !== 0 && this.element.querySelector('.' + EMPTY)) {
                this.element.removeChild(this.element.querySelector('.' + EMPTY));
            }
            if (this.pasteOperation === true) {
                this.selectItems(args.files, this.parent.selectedNodes);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.pasteOperation = false;
            }
            if (this.uploadOperation === true) {
                this.selectItems(args.files, this.parent.uploadItem);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.count++;
                if (this.count === this.parent.uploadItem.length) {
                    this.uploadOperation = false;
                    this.parent.uploadItem = [];
                }
            }
            var activeEle = this.element.querySelectorAll('.' + ACTIVE);
            if (activeEle.length !== 0) {
                this.parent.activeModule = 'largeiconsview';
            }
            iconsView.classList.remove(DISPLAY_NONE);
            this.adjustHeight();
            this.element.style.maxHeight = '100%';
            this.getItemCount();
            this.addEventListener();
            this.wireEvents();
            this.isRendered = true;
            if (this.parent.selectedItems.length) {
                this.checkItem();
            }
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    LargeIconsView.prototype.getModuleName = function () {
        return 'largeiconsview';
    };
    LargeIconsView.prototype.adjustHeight = function () {
        var pane = select('#' + this.parent.element.id + CONTENT_ID, this.parent.element);
        var bar = select('#' + this.parent.element.id + BREADCRUMBBAR_ID, this.parent.element);
        this.element.style.height = (pane.offsetHeight - bar.offsetHeight) + 'px';
    };
    LargeIconsView.prototype.onItemCreated = function (args) {
        if (!this.parent.showFileExtension && getValue('isFile', args.curData)) {
            var textEle = args.item.querySelector('.' + LIST_TEXT);
            var txt = getValue('name', args.curData);
            var type = getValue('type', args.curData);
            textEle.innerHTML = txt.substr(0, txt.length - type.length);
        }
        this.renderCheckbox(args);
        var eventArgs = {
            element: args.item,
            fileDetails: args.curData,
            module: 'LargeIconsView'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    };
    LargeIconsView.prototype.renderCheckbox = function (args) {
        if (!this.parent.allowMultiSelection) {
            return;
        }
        var checkElement;
        checkElement = createCheckBox(createElement, false, {
            checked: false,
            cssClass: 'e-small'
        });
        checkElement.setAttribute('role', 'checkbox');
        checkElement.setAttribute('aria-checked', 'false');
        args.item.firstElementChild.insertBefore(checkElement, args.item.firstElementChild.childNodes[0]);
    };
    LargeIconsView.prototype.onLayoutChange = function (args) {
        if (this.parent.view === 'LargeIcons') {
            this.destroy();
            this.render(args);
            /* istanbul ignore next */
            if (this.parent.cutNodes && this.parent.cutNodes.length !== 0) {
                var indexes = this.getIndexes(args.files, this.parent.selectedNodes);
                var length_1 = 0;
                while (length_1 < indexes.length) {
                    addBlur(this.itemList[indexes[length_1]]);
                    length_1++;
                }
            }
            var activeEle = this.element.querySelectorAll('.' + ACTIVE);
            this.parent.activeElements = (activeEle.length !== 0) ? activeEle : this.parent.activeElements;
            if (activeEle.length !== 0) {
                this.element.focus();
            }
            this.checkItem();
        }
        else {
            this.element.setAttribute('tabindex', '-1');
        }
    };
    LargeIconsView.prototype.checkItem = function () {
        var checkEle = this.element.querySelectorAll('.' + ACTIVE);
        if (checkEle) {
            var checkLength = 0;
            while (checkLength < checkEle.length) {
                this.checkState(checkEle[checkLength], true);
                checkLength++;
            }
        }
    };
    LargeIconsView.prototype.renderList = function (args) {
        var i = 0;
        var items = JSON.parse(JSON.stringify(args.files));
        while (i < items.length) {
            var icon = fileType(items[i]);
            /* istanbul ignore next */
            var pasteNodes = this.parent.pasteNodes;
            var className = ((this.parent.selectedItems &&
                this.parent.selectedItems.indexOf(getValue('name', args.files[i])) !== -1) ||
                (pasteNodes && pasteNodes.length !== 0 && pasteNodes.indexOf(getValue('name', args.files[i])) !== -1)) ?
                LARGE_ICON + ' e-active' : LARGE_ICON;
            if (icon === ICON_IMAGE && this.parent.showThumbnail) {
                var imgUrl = getImageUrl(this.parent, items[i]);
                setValue('imageUrl', imgUrl, items[i]);
            }
            else {
                setValue('icon', icon, items[i]);
            }
            setValue('htmlAttributes', { class: className, title: getValue('name', args.files[i]) }, items[i]);
            i++;
        }
        return items;
    };
    LargeIconsView.prototype.onFinalizeEnd = function (args) {
        this.render(args);
        this.parent.notify(searchTextChange, args);
    };
    LargeIconsView.prototype.onCreateEnd = function (args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.clearSelect();
        this.selectItems(args.files, [getValue('name', this.parent.createdItem)]);
        this.parent.createdItem = null;
        this.parent.largeiconsviewModule.element.focus();
        this.parent.persistData = false;
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.onDeleteEnd = function (args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.parent.setProperties({ selectedItems: [] }, true);
        this.clearSelect();
    };
    LargeIconsView.prototype.onRefreshEnd = function (args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
    };
    LargeIconsView.prototype.onRenameInit = function () {
        if (this.parent.view === 'LargeIcons' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    };
    LargeIconsView.prototype.onRenameEnd = function (args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.clearSelect();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.selectItems(args.files, [getValue('name', this.parent.renamedItem)]);
        this.parent.renamedItem = null;
    };
    LargeIconsView.prototype.onPathChanged = function (args) {
        /* istanbul ignore next */
        if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value === '') {
            this.parent.searchedItems = [];
        }
        if (this.parent.view === 'LargeIcons') {
            removeBlur(this.parent);
            if (!this.parent.persistData) {
                this.parent.selectedItems = [];
            }
            this.parent.persistData = false;
            this.parent.pasteNodes = [];
            this.parent.cutNodes = [];
            this.onLayoutChange(args);
            this.parent.notify(searchTextChange, args);
        }
    };
    LargeIconsView.prototype.onOpenInit = function (args) {
        if (this.parent.activeModule === 'largeiconsview') {
            this.doOpenAction(args.target);
        }
    };
    LargeIconsView.prototype.onHideLayout = function (args) {
        if (this.parent.view !== 'LargeIcons' && this.element) {
            this.element.classList.add(DISPLAY_NONE);
        }
    };
    LargeIconsView.prototype.onSelectAllInit = function () {
        if (this.parent.view === 'LargeIcons') {
            this.startItem = this.getFirstItem();
            var lastItem = this.getLastItem();
            var eveArgs = { ctrlKey: true, shiftKey: true };
            this.doSelection(lastItem, eveArgs);
        }
    };
    LargeIconsView.prototype.onClearAllInit = function () {
        if (this.parent.view === 'LargeIcons') {
            this.clearSelection();
        }
    };
    LargeIconsView.prototype.onBeforeRequest = function () {
        this.isRendered = false;
    };
    LargeIconsView.prototype.onAfterRequest = function (args) {
        this.isRendered = true;
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.onSearch = function (args) {
        this.parent.searchedItems = args.files;
        this.onLayoutChange(args);
    };
    LargeIconsView.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(search, this.onSearch);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(openEnd, this.onLayoutChange);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onRenameEnd);
        this.parent.off(hideLayout, this.onHideLayout);
        this.parent.off(selectAllInit, this.onSelectAllInit);
        this.parent.off(clearAllInit, this.onClearAllInit);
        this.parent.off(beforeRequest, this.onBeforeRequest);
        this.parent.off(afterRequest, this.onAfterRequest);
        this.parent.off(splitterResize, this.resizeHandler);
        this.parent.off(resizeEnd, this.resizeHandler);
    };
    LargeIconsView.prototype.addEventListener = function () {
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(search, this.onSearch, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onRenameEnd, this);
        this.parent.on(openEnd, this.onLayoutChange, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(hideLayout, this.onHideLayout, this);
        this.parent.on(selectAllInit, this.onSelectAllInit, this);
        this.parent.on(clearAllInit, this.onClearAllInit, this);
        this.parent.on(beforeRequest, this.onBeforeRequest, this);
        this.parent.on(afterRequest, this.onAfterRequest, this);
        this.parent.on(splitterResize, this.resizeHandler, this);
        this.parent.on(resizeEnd, this.resizeHandler, this);
    };
    LargeIconsView.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'selectedItems':
                    this.isSetModel = true;
                    if (this.parent.selectedItems.length !== 0) {
                        var currentDataSource = getValue(this.parent.path, this.parent.feFiles);
                        this.selectItems(currentDataSource, this.parent.selectedItems);
                    }
                    else {
                        while (this.element.querySelectorAll('.' + ACTIVE).length > 0) {
                            this.removeActive(this.element.querySelectorAll('.' + ACTIVE)[0]);
                        }
                    }
                    this.isSetModel = false;
                    break;
                case 'showThumbnail':
                    refresh(this.parent);
                    break;
                case 'showFileExtension':
                    read(this.parent, pathChanged, this.parent.path);
                    break;
                case 'showHiddenItems':
                    read(this.parent, pathChanged, this.parent.path);
                    break;
                case 'allowMultiSelection':
                    refresh(this.parent);
                    if (this.parent.selectedItems.length > 1 && !this.parent.allowMultiSelection) {
                        this.parent.selectedItems = [];
                    }
                    break;
                case 'view':
                    read(this.parent, layoutChange, this.parent.path);
                    break;
            }
        }
    };
    /**
     * Destroys the LargeIcons module.
     * @method destroy
     * @return {void}
     */
    LargeIconsView.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.listObj) {
            this.unWireEvents();
        }
    };
    LargeIconsView.prototype.wireEvents = function () {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keyup',
        });
        this.keyboardDownModule = new KeyboardEvents(this.element, {
            keyAction: this.keydownActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
    };
    LargeIconsView.prototype.unWireEvents = function () {
        this.wireClickEvent(false);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        this.keyboardModule.destroy();
        this.keyboardDownModule.destroy();
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.onMouseOver = function (e) {
        var targetEle = closest(e.target, '.e-list-item');
        removeBlur(this.parent, 'hover');
        if (targetEle !== null) {
            targetEle.classList.add(HOVER);
        }
    };
    LargeIconsView.prototype.wireClickEvent = function (toBind) {
        if (toBind) {
            var proxy_1 = this;
            this.clickObj = new Touch(this.element, {
                tap: function (eve) {
                    eve.originalEvent.preventDefault();
                    if (proxy_1.parent.isDevice) {
                        proxy_1.tapCount = eve.tapCount;
                        proxy_1.tapEvent = eve;
                        setTimeout(function () {
                            if (proxy_1.tapCount > 0) {
                                proxy_1.doTapAction(proxy_1.tapEvent);
                            }
                            proxy_1.tapCount = 0;
                        }, 350);
                    }
                    else {
                        if (eve.tapCount === 2 && eve.originalEvent.which !== 3) {
                            proxy_1.dblClickHandler(eve);
                        }
                        else {
                            proxy_1.clickHandler(eve);
                        }
                    }
                },
                tapHold: function (e) {
                    if (proxy_1.parent.isDevice) {
                        proxy_1.multiSelect = proxy_1.parent.allowMultiSelection ? true : false;
                        if (proxy_1.parent.allowMultiSelection) {
                            addClass([proxy_1.parent.element], MULTI_SELECT);
                        }
                        proxy_1.clickHandler(e);
                    }
                }
            });
        }
        else {
            if (this.clickObj) {
                this.clickObj.destroy();
            }
        }
    };
    LargeIconsView.prototype.doTapAction = function (eve) {
        var target = eve.originalEvent.target;
        var item = closest(target, '.' + LIST_ITEM);
        if (this.multiSelect || target.classList.contains(LIST_PARENT) || isNullOrUndefined(item)) {
            this.clickHandler(eve);
        }
        else {
            this.parent.isFile = false;
            this.updateType(item);
            if (!this.parent.isFile) {
                this.dblClickHandler(eve);
            }
            else if (eve.tapCount === 2) {
                this.clickHandler(eve);
                this.dblClickHandler(eve);
            }
            else {
                this.clickHandler(eve);
            }
        }
    };
    LargeIconsView.prototype.clickHandler = function (e) {
        var target = e.originalEvent.target;
        removeBlur(this.parent, 'hover');
        this.doSelection(target, e.originalEvent);
        this.parent.activeModule = 'largeiconsview';
    };
    /** @hidden */
    LargeIconsView.prototype.doSelection = function (target, e) {
        var item = closest(target, '.' + LIST_ITEM);
        var fItem = this.getFocusedItem();
        var cList = target.classList;
        this.parent.isFile = false;
        var action = 'select';
        if (e.which === 3 && !isNullOrUndefined(item) && item.classList.contains(ACTIVE)) {
            this.updateType(item);
            return;
        }
        else if (!isNullOrUndefined(item)) {
            if ((!this.parent.allowMultiSelection || (!this.multiSelect && (e && !e.ctrlKey)))
                && !cList.contains(FRAME)) {
                this.updateType(item);
                this.clearSelect();
            }
            if (this.parent.allowMultiSelection && e.shiftKey) {
                if (!(e && e.ctrlKey)) {
                    this.clearSelect();
                }
                if (!this.startItem) {
                    this.startItem = item;
                }
                var startIndex = this.itemList.indexOf(this.startItem);
                var endIndex = this.itemList.indexOf(item);
                if (startIndex > endIndex) {
                    for (var i = startIndex; i >= endIndex; i--) {
                        this.addActive(this.itemList[i]);
                    }
                }
                else {
                    for (var i = startIndex; i <= endIndex; i++) {
                        this.addActive(this.itemList[i]);
                    }
                }
                this.addFocus(this.itemList[endIndex]);
            }
            else {
                this.startItem = item;
                if (this.parent.allowMultiSelection && item.classList.contains(ACTIVE)) {
                    this.removeActive(item);
                    action = 'unselect';
                }
                else {
                    this.addActive(item);
                }
                this.addFocus(item);
            }
            if (this.parent.selectedItems.length === 0) {
                this.resetMultiSelect();
            }
            this.parent.notify(selectionChanged, {});
            this.triggerSelect(action, item);
        }
        else {
            this.clearSelection();
        }
        this.parent.activeElements = this.element.querySelectorAll('.e-active');
    };
    LargeIconsView.prototype.dblClickHandler = function (e) {
        this.parent.activeModule = 'largeiconsview';
        var target = e.originalEvent.target;
        this.doOpenAction(target);
    };
    LargeIconsView.prototype.clearSelection = function () {
        this.clearSelect();
        this.resetMultiSelect();
        this.parent.notify(selectionChanged, {});
    };
    LargeIconsView.prototype.resetMultiSelect = function () {
        this.multiSelect = false;
        removeClass([this.parent.element], MULTI_SELECT);
    };
    LargeIconsView.prototype.doOpenAction = function (target) {
        if (isNullOrUndefined(target)) {
            return;
        }
        var item = closest(target, '.' + LIST_ITEM);
        this.parent.isFile = false;
        if (!isNullOrUndefined(item)) {
            this.updateType(item);
            var details = this.getItemObject(item);
            var eventArgs = { cancel: false, fileDetails: details };
            this.parent.trigger('beforeFileOpen', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
            var text = select('.' + LIST_TEXT, item).textContent;
            if (!this.parent.isFile) {
                var val = this.parent.breadcrumbbarModule.searchObj.element.value;
                if (val === '') {
                    var newPath = this.parent.path + text + '/';
                    this.parent.setProperties({ path: newPath }, true);
                    this.parent.pathId.push(getValue('nodeId', details));
                    this.parent.itemData = [details];
                    openAction(this.parent);
                }
                else {
                    openSearchFolder(this.parent, details);
                }
                this.parent.setProperties({ selectedItems: [] }, true);
            }
            else {
                var icon = fileType(details);
                if (icon === ICON_IMAGE) {
                    var imgUrl = getImageUrl(this.parent, details);
                    createImageDialog(this.parent, getValue('name', details), imgUrl);
                }
            }
        }
    };
    LargeIconsView.prototype.updateType = function (item) {
        var folder = select('.' + FOLDER, item);
        this.parent.isFile = isNullOrUndefined(folder) ? true : false;
    };
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    LargeIconsView.prototype.keydownActionHandler = function (e) {
        if (!this.isRendered) {
            return;
        }
        switch (e.action) {
            case 'end':
            case 'home':
            case 'moveDown':
            case 'moveLeft':
            case 'moveRight':
            case 'moveUp':
            case 'ctrlEnd':
            case 'shiftEnd':
            case 'csEnd':
            case 'ctrlHome':
            case 'shiftHome':
            case 'csHome':
            case 'ctrlDown':
            case 'shiftDown':
            case 'csDown':
            case 'ctrlLeft':
            case 'shiftLeft':
            case 'csLeft':
            case 'ctrlRight':
            case 'shiftRight':
            case 'csRight':
            case 'space':
            case 'ctrlSpace':
            case 'shiftSpace':
            case 'csSpace':
            case 'ctrlA':
            case 'enter':
            case 'altEnter':
            case 'esc':
            case 'del':
            case 'shiftdel':
            case 'ctrlC':
            case 'ctrlV':
            case 'ctrlX':
            case 'f2':
                e.preventDefault();
                break;
            default:
                break;
        }
    };
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    LargeIconsView.prototype.keyActionHandler = function (e) {
        if (!this.isRendered) {
            return;
        }
        var fItem = this.getFocusedItem();
        var firstItem = this.getFirstItem();
        var lastItem = this.getLastItem();
        switch (e.action) {
            case 'end':
                this.navigateItem(lastItem);
                break;
            case 'home':
                this.navigateItem(firstItem);
                break;
            case 'tab':
                if (!isNullOrUndefined(fItem)) {
                    this.addFocus(fItem);
                }
                else if (!isNullOrUndefined(firstItem)) {
                    this.addFocus(firstItem);
                }
                break;
            case 'moveDown':
                this.navigateDown(fItem, true);
                break;
            case 'moveLeft':
                this.navigateRight(fItem, false);
                break;
            case 'moveRight':
                this.navigateRight(fItem, true);
                break;
            case 'moveUp':
                this.navigateDown(fItem, false);
                break;
            case 'ctrlEnd':
            case 'shiftEnd':
            case 'csEnd':
                this.csEndKey(lastItem, e);
                break;
            case 'ctrlHome':
            case 'shiftHome':
            case 'csHome':
                this.csHomeKey(firstItem, e);
                break;
            case 'ctrlDown':
            case 'shiftDown':
            case 'csDown':
                this.csDownKey(fItem, e);
                break;
            case 'ctrlLeft':
            case 'shiftLeft':
            case 'csLeft':
                this.csLeftKey(fItem, e);
                break;
            case 'ctrlRight':
            case 'shiftRight':
            case 'csRight':
                this.csRightKey(fItem, e);
                break;
            case 'ctrlUp':
            case 'shiftUp':
            case 'csUp':
                this.csUpKey(fItem, e);
                break;
            case 'space':
                this.spaceKey(fItem);
                break;
            case 'ctrlSpace':
            case 'shiftSpace':
            case 'csSpace':
                if (!isNullOrUndefined(fItem)) {
                    this.doSelection(fItem, e);
                }
                break;
            case 'ctrlA':
                this.ctrlAKey(firstItem, lastItem);
                break;
            case 'enter':
                this.doOpenAction(this.parent.visitedItem ? this.parent.visitedItem : this.getVisitedItem());
                break;
            case 'altEnter':
                this.parent.getDetails();
                break;
            case 'esc':
                this.escapeKey();
                break;
            case 'del':
            case 'shiftdel':
                if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'ctrlC':
                this.copy();
                break;
            case 'ctrlV':
                this.parent.pasteHandler();
                break;
            case 'ctrlX':
                this.cut();
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 1) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
        }
    };
    LargeIconsView.prototype.updateRenameData = function () {
        var item = select('.' + LIST_ITEM + '.' + ACTIVE, this.element);
        var data = this.getItemObject(item);
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
    };
    LargeIconsView.prototype.getVisitedItem = function () {
        var currFiles = getValue(this.parent.path, this.parent.feFiles);
        var item = this.parent.selectedItems[this.parent.selectedItems.length - 1];
        var indexes = this.getIndexes(currFiles, [item]);
        return this.itemList[indexes[0]];
    };
    LargeIconsView.prototype.getFocusedItem = function () {
        return select('.' + LIST_ITEM + '.' + FOCUS, this.element);
    };
    LargeIconsView.prototype.getActiveItem = function () {
        return select('.' + LIST_ITEM + '.' + ACTIVE, this.element);
    };
    LargeIconsView.prototype.getFirstItem = function () {
        return this.itemList[0];
    };
    LargeIconsView.prototype.getLastItem = function () {
        return this.itemList[this.itemList.length - 1];
    };
    LargeIconsView.prototype.navigateItem = function (item) {
        this.setFocus(item);
    };
    LargeIconsView.prototype.navigateDown = function (fItem, isTowards) {
        var nItem = this.getNextItem(fItem, isTowards, this.perRow);
        this.setFocus(nItem);
    };
    LargeIconsView.prototype.navigateRight = function (fItem, isTowards) {
        var nItem = this.getNextItem(fItem, isTowards);
        this.setFocus(nItem);
    };
    LargeIconsView.prototype.getNextItem = function (li, isTowards, perRow) {
        if (isNullOrUndefined(li)) {
            return this.getFocusedItem() || this.getActiveItem() || this.getFirstItem();
        }
        var index = this.itemList.indexOf(li);
        var nextItem;
        do {
            if (isTowards) {
                index = perRow ? index + perRow : index + 1;
            }
            else {
                index = perRow ? index - perRow : index - 1;
            }
            nextItem = this.itemList[index];
            if (isNullOrUndefined(nextItem)) {
                return li;
            }
        } while (!isVisible(nextItem));
        return nextItem;
    };
    LargeIconsView.prototype.setFocus = function (nextItem) {
        if (!isNullOrUndefined(nextItem)) {
            this.startItem = nextItem;
            this.clearSelect();
            this.addActive(nextItem);
            this.addFocus(nextItem);
            this.parent.notify(selectionChanged, {});
            this.triggerSelect('select', nextItem);
        }
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.cut = function () {
        cutFiles(this.parent);
        this.parent.fileOperation(this.parent.nodeNames);
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.copy = function () {
        copyFiles(this.parent);
        this.parent.fileOperation(this.parent.nodeNames);
    };
    /* istanbul ignore next */
    LargeIconsView.prototype.escapeKey = function () {
        removeBlur(this.parent);
        this.parent.selectedNodes = [];
        this.parent.navigationpaneModule.treeNodes = [];
    };
    LargeIconsView.prototype.spaceKey = function (fItem) {
        if (!isNullOrUndefined(fItem) && !fItem.classList.contains(ACTIVE)) {
            this.addActive(fItem);
            this.parent.notify(selectionChanged, {});
            this.triggerSelect('select', fItem);
        }
    };
    LargeIconsView.prototype.ctrlAKey = function (firstItem, lastItem) {
        if (this.parent.allowMultiSelection && !isNullOrUndefined(firstItem)) {
            this.startItem = firstItem;
            var eveArgs = { ctrlKey: true, shiftKey: true };
            this.doSelection(lastItem, eveArgs);
        }
    };
    LargeIconsView.prototype.csEndKey = function (lastItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(lastItem);
        }
        else if (!isNullOrUndefined(lastItem)) {
            (e.action === 'ctrlEnd') ? this.addFocus(lastItem) : this.doSelection(lastItem, e);
        }
    };
    LargeIconsView.prototype.csHomeKey = function (firstItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(firstItem);
        }
        else if (!isNullOrUndefined(firstItem)) {
            (e.action === 'ctrlHome') ? this.addFocus(firstItem) : this.doSelection(firstItem, e);
        }
    };
    LargeIconsView.prototype.csDownKey = function (fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, true);
        }
        else {
            var dItem = this.getNextItem(fItem, true, this.perRow);
            if (!isNullOrUndefined(dItem)) {
                (e.action === 'ctrlDown') ? this.addFocus(dItem) : this.doSelection(dItem, e);
            }
        }
    };
    LargeIconsView.prototype.csLeftKey = function (fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, false);
        }
        else {
            var lItem = this.getNextItem(fItem, false);
            if (!isNullOrUndefined(lItem)) {
                (e.action === 'ctrlLeft') ? this.addFocus(lItem) : this.doSelection(lItem, e);
            }
        }
    };
    LargeIconsView.prototype.csRightKey = function (fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, true);
        }
        else {
            var rItem = this.getNextItem(fItem, true);
            if (!isNullOrUndefined(rItem)) {
                (e.action === 'ctrlRight') ? this.addFocus(rItem) : this.doSelection(rItem, e);
            }
        }
    };
    LargeIconsView.prototype.csUpKey = function (fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, false);
        }
        else {
            var uItem = this.getNextItem(fItem, false, this.perRow);
            if (!isNullOrUndefined(uItem)) {
                (e.action === 'ctrlUp') ? this.addFocus(uItem) : this.doSelection(uItem, e);
            }
        }
    };
    LargeIconsView.prototype.addActive = function (nextItem) {
        if (!isNullOrUndefined(nextItem)) {
            if (!nextItem.classList.contains(ACTIVE)) {
                if (!this.isSetModel) {
                    this.parent.selectedItems.push(nextItem.textContent);
                }
                addClass([nextItem], [ACTIVE]);
                this.checkState(nextItem, true);
            }
            this.parent.visitedItem = nextItem;
        }
    };
    LargeIconsView.prototype.removeActive = function (preItem) {
        if (!isNullOrUndefined(preItem)) {
            removeClass([preItem], [ACTIVE]);
            this.checkState(preItem, false);
            var index = this.parent.selectedItems.indexOf(preItem.textContent);
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
            }
            this.parent.visitedItem = null;
        }
    };
    LargeIconsView.prototype.addFocus = function (item) {
        var fItem = this.getFocusedItem();
        if (fItem) {
            removeClass([fItem], [FOCUS]);
        }
        addClass([item], [FOCUS]);
    };
    LargeIconsView.prototype.checkState = function (item, toCheck) {
        if (!this.parent.allowMultiSelection) {
            return;
        }
        var checkEle = select('.' + FRAME, item);
        if (toCheck) {
            if (!checkEle.classList.contains(CHECK)) {
                addClass([checkEle], CHECK);
                closest(checkEle, '.' + CB_WRAP).setAttribute('aria-checked', 'true');
            }
        }
        else {
            if (checkEle.classList.contains(CHECK)) {
                removeClass([checkEle], CHECK);
                closest(checkEle, '.' + CB_WRAP).setAttribute('aria-checked', 'false');
            }
        }
    };
    LargeIconsView.prototype.clearSelect = function () {
        var eles = Array.prototype.slice.call(selectAll('.' + ACTIVE, this.listElements));
        for (var i = 0, len = eles.length; i < len; i++) {
            this.removeActive(eles[i]);
        }
    };
    LargeIconsView.prototype.resizeHandler = function () {
        this.getItemCount();
    };
    LargeIconsView.prototype.getItemCount = function () {
        var perRow = 1;
        if (this.itemList) {
            for (var i = 0, len = this.itemList.length - 1; i < len; i++) {
                if (this.itemList[i].getBoundingClientRect().top === this.itemList[i + 1].getBoundingClientRect().top) {
                    perRow++;
                }
                else {
                    break;
                }
            }
        }
        this.perRow = perRow;
    };
    LargeIconsView.prototype.triggerSelect = function (action, item) {
        var data = this.getItemObject(item);
        this.parent.visitedData = data;
        var eventArgs = { action: action, fileDetails: data };
        this.parent.trigger('fileSelect', eventArgs);
    };
    LargeIconsView.prototype.selectItems = function (files, items) {
        var indexes = this.getIndexes(files, items);
        for (var j = 0, len = indexes.length; j < len; j++) {
            var eveArgs = { ctrlKey: true, shiftKey: false };
            this.doSelection(this.itemList[indexes[j]], eveArgs);
        }
    };
    LargeIconsView.prototype.getIndexes = function (files, items) {
        var indexes = [];
        for (var i = 0, len = this.items.length; i < len; i++) {
            if (items.indexOf(getValue('name', this.items[i])) !== -1) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    LargeIconsView.prototype.getItemObject = function (item) {
        var index = this.itemList.indexOf(item);
        return this.items[index];
    };
    return LargeIconsView;
}());

/**
 * BreadCrumbBar module
 */
var BreadCrumbBar = /** @__PURE__ @class */ (function () {
    /**
     * constructor for addressbar module
     * @hidden
     */
    function BreadCrumbBar(parent) {
        this.addressPath = '';
        this.addressBarLink = '';
        this.parent = parent;
        this.treeView = this.parent.navigationpaneModule;
        this.keyConfigs = {
            enter: 'enter'
        };
        this.render();
    }
    BreadCrumbBar.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'searchSettings':
                    if (!isNullOrUndefined(e.newProp.searchSettings.allowSearchOnTyping)) {
                        this.searchEventBind(e.newProp.searchSettings.allowSearchOnTyping);
                    }
                    break;
            }
        }
    };
    BreadCrumbBar.prototype.render = function () {
        this.addEventListener();
    };
    BreadCrumbBar.prototype.onPathChange = function () {
        var rootName = getValue('name', getValue('/', this.parent.feParent));
        if (!this.addressBarLink) {
            this.addressPath = rootName + this.parent.path;
        }
        else {
            this.addressPath = this.addressBarLink;
        }
        var addressPath = this.addressPath;
        var newPath = addressPath.substring(addressPath.indexOf('/'), addressPath.length);
        this.parent.setProperties({ path: newPath }, true);
        var arrayOfAddressBar = [];
        arrayOfAddressBar = addressPath.split('/');
        var addressbarUL = null;
        addressbarUL = this.parent.createElement('ul');
        addressbarUL.setAttribute('class', 'e-addressbar-ul');
        var addressbarLI = null;
        var countOfAddressBarPath = arrayOfAddressBar.length - 1;
        if (arrayOfAddressBar.length > 1) {
            var id = '';
            for (var i = 0; i < countOfAddressBarPath; i++) {
                var addressATag = null;
                addressbarLI = this.parent.createElement('li');
                for (var j = 0; j <= i; j++) {
                    id = id + arrayOfAddressBar[j] + '/';
                }
                addressbarLI.setAttribute('data-utext', id);
                addressbarLI.classList.add('e-address-list-item');
                if (i !== 0) {
                    var icon = createElement('span', { className: ICONS });
                    addressbarLI.appendChild(icon);
                }
                if (countOfAddressBarPath - i !== 1) {
                    addressATag = createElement('a', { className: LIST_TEXT });
                    addressbarLI.setAttribute('tabindex', '0');
                }
                else {
                    addressATag = createElement('span', { className: LIST_TEXT });
                }
                id = '';
                addressATag.innerText = arrayOfAddressBar[i];
                addressbarLI.appendChild(addressATag);
                addressbarUL.appendChild(addressbarLI);
            }
            var ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
            if (!isNullOrUndefined(ulElement)) {
                if (!isNullOrUndefined(this.subMenuObj)) {
                    this.subMenuObj.destroy();
                }
                remove(ulElement);
            }
            var searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
            if (!searchWrap) {
                this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
            }
            else {
                this.parent.breadCrumbBarNavigation.appendChild(addressbarUL);
            }
            this.updateBreadCrumbBar(addressbarUL);
        }
        this.addressBarLink = '';
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.updateBreadCrumbBar = function (addresBarUL) {
        var liElements = addresBarUL.querySelectorAll('li');
        var ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
        var style = window.getComputedStyle(ulElement, null);
        var pRight = parseFloat(style.getPropertyValue('padding-right'));
        var pLeft = parseFloat(style.getPropertyValue('padding-left'));
        var breadCrumbBarWidth = ulElement.offsetWidth - pRight - pLeft;
        var addressbarUL = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        var liElementsWidth = 0;
        var liElementsWidths = [];
        for (var i = 0; i < liElements.length; i++) {
            var width = liElements[i].clientWidth;
            liElementsWidths.push(width);
            liElementsWidth = liElementsWidth + width;
        }
        if (!isNullOrUndefined(ulElement)) {
            remove(ulElement);
        }
        var searchContainer = this.parent.createElement('div');
        searchContainer.setAttribute('class', 'e-search-wrap');
        var id = this.parent.element.id + SEARCH_ID;
        var searchInput = createElement('input', { id: id, attrs: { autocomplete: 'off' } });
        searchContainer.appendChild(searchInput);
        var searchEle = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap .e-input');
        if (isNullOrUndefined(searchEle)) {
            this.parent.breadCrumbBarNavigation.appendChild(searchContainer);
            var span = createElement('span', { className: 'e-icons e-fe-search' });
            EventHandler.add(span, 'click', this.onShowInput, this);
            searchInput.parentElement.insertBefore(span, searchInput);
            this.searchObj = new TextBox({
                value: '',
                showClearButton: true,
                placeholder: getLocaleText(this.parent, 'Search'),
                focus: this.onFocus.bind(this),
                blur: this.onBlur.bind(this),
            });
            this.searchObj.appendTo('#' + this.parent.element.id + SEARCH_ID);
            this.searchEventBind(this.parent.searchSettings.allowSearchOnTyping);
            var search$$1 = this.searchObj.element.nextElementSibling;
            EventHandler.add(search$$1, 'mousedown', this.searchChangeHandler.bind(this), this);
            EventHandler.add(this.searchObj.element, 'keyup', this.onKeyUp.bind(this), this);
        }
        var searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
        breadCrumbBarWidth = breadCrumbBarWidth - searchWrap.offsetWidth;
        if (liElementsWidth > breadCrumbBarWidth) {
            var i = liElements.length;
            while (i--) {
                var diff = breadCrumbBarWidth - liElementsWidths[i];
                if (diff > 40) {
                    addressbarUL.insertBefore(liElements[i], addressbarUL.querySelector('li'));
                    breadCrumbBarWidth = diff;
                }
                else {
                    var items = [];
                    for (var j = 0; j <= i; j++) {
                        var liElement = liElements[j];
                        items.push({
                            text: liElement.innerText,
                            utext: liElement.getAttribute('data-utext')
                        });
                    }
                    var subMenuLi = this.parent.createElement('li', { className: 'e-breadcrumb-menu' });
                    var attributes = { className: 'e-breadcrumb-submenu' };
                    var subMenuSpan = this.parent.createElement('button', attributes);
                    subMenuLi.appendChild(subMenuSpan);
                    addressbarUL.insertBefore(subMenuLi, addressbarUL.querySelector('li'));
                    this.subMenuObj = new DropDownButton({
                        items: items,
                        cssClass: 'e-caret-hide e-submenu',
                        iconCss: ICON_BREADCRUMB,
                        iconPosition: 'Top',
                        beforeItemRender: this.addSubMenuAttributes.bind(this),
                        select: this.subMenuSelectOperations.bind(this)
                    });
                    this.subMenuObj.appendTo(subMenuSpan);
                    break;
                }
            }
            this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
        }
        else {
            this.parent.breadCrumbBarNavigation.insertBefore(addresBarUL, searchWrap);
        }
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.onFocus = function () {
        var wrap = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.add('e-focus');
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.onKeyUp = function () {
        this.parent.notify(pathColumn, { args: this.parent });
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.onBlur = function () {
        var wrap = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.remove('e-focus');
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.subMenuSelectOperations = function (event) {
        var args = { target: event.element };
        this.addressPathClickHandler(args);
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.addSubMenuAttributes = function (args) {
        args.element.setAttribute('data-utext', getValue('utext', args.item));
        var anchor = this.parent.createElement('a', { className: 'e-list-text' });
        args.element.appendChild(anchor);
    };
    BreadCrumbBar.prototype.searchEventBind = function (allow) {
        if (allow) {
            this.searchObj.input = this.searchChangeHandler.bind(this);
            this.searchObj.change = null;
        }
        else {
            this.searchObj.change = this.searchChangeHandler.bind(this);
            this.searchObj.input = null;
        }
    };
    BreadCrumbBar.prototype.searchChangeHandler = function (args) {
        if (!isNullOrUndefined(args.value)) {
            var searchWord = void 0;
            if (args.value.length === 0) {
                this.parent.notify(pathColumn, { args: this.parent });
            }
            if (this.parent.searchSettings.filterType === 'startWith') {
                searchWord = '*' + args.value;
            }
            else if (this.parent.searchSettings.filterType === 'endsWith') {
                searchWord = args.value + '*';
            }
            else {
                searchWord = '*' + args.value + '*';
            }
            if (this.searchObj.element.value.length > 0) {
                var caseSensitive = this.parent.searchSettings.ignoreCase;
                var hiddenItems = this.parent.showHiddenItems;
                Search(this.parent, search, this.parent.path, searchWord, hiddenItems, !caseSensitive);
            }
            else {
                read(this.parent, search, this.parent.path);
            }
        }
    };
    BreadCrumbBar.prototype.addressPathClickHandler = function (e) {
        var li = e.target;
        if (li.nodeName === 'LI' || li.nodeName === 'A') {
            var node = li.nodeName === 'LI' ? li.children[0] : li;
            if (!isNullOrUndefined(node)) {
                var currentPath = this.updatePath(node);
                this.liClick(currentPath);
                var treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        }
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.onShowInput = function () {
        if (this.parent.isMobile) {
            if (this.parent.element.classList.contains(FILTER)) {
                removeClass([this.parent.element], FILTER);
            }
            else {
                addClass([this.parent.element], FILTER);
                this.searchObj.element.focus();
            }
        }
    };
    BreadCrumbBar.prototype.updatePath = function (list) {
        var li = closest(list, 'li');
        var liElementId = li.getAttribute('data-utext');
        this.addressBarLink = liElementId;
        var link = this.addressBarLink.split('/');
        var ids = this.parent.pathId;
        this.parent.pathId = [];
        for (var i = 0, len = link.length - 1; i < len; i++) {
            this.parent.pathId.push(ids[i]);
        }
        var path = this.addressBarLink.substr(this.addressBarLink.indexOf('/'), this.addressBarLink.length);
        return path;
    };
    BreadCrumbBar.prototype.onUpdatePath = function () {
        this.onPathChange();
        this.removeSearchValue();
    };
    BreadCrumbBar.prototype.onCreateEnd = function (args) {
        var path = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onPathChange();
        }
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.onDeleteEnd = function () {
        var path = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onUpdatePath();
        }
    };
    /* istanbul ignore next */
    BreadCrumbBar.prototype.removeSearchValue = function () {
        if (this.searchObj.value !== '' || this.searchObj.element.value !== '') {
            this.searchObj.value = '';
            this.searchObj.element.value = '';
            this.searchObj.dataBind();
        }
    };
    BreadCrumbBar.prototype.onResize = function () {
        this.onPathChange();
    };
    BreadCrumbBar.prototype.liClick = function (currentPath) {
        read(this.parent, pathChanged, currentPath);
    };
    BreadCrumbBar.prototype.addEventListener = function () {
        this.keyboardModule = new KeyboardEvents(this.parent.breadCrumbBarNavigation, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        EventHandler.add(this.parent.breadCrumbBarNavigation, 'click', this.addressPathClickHandler, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(pathChanged, this.onUpdatePath, this);
        this.parent.on(finalizeEnd, this.onUpdatePath, this);
        this.parent.on(refreshEnd, this.onUpdatePath, this);
        this.parent.on(openEnd, this.onUpdatePath, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(renameEnd, this.onUpdatePath, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(splitterResize, this.onResize, this);
        this.parent.on(resizeEnd, this.onResize, this);
        this.parent.on(searchTextChange, this.onSearchTextChange, this);
    };
    BreadCrumbBar.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'enter':
                e.preventDefault();
                this.addressPathClickHandler(e);
                break;
        }
    };
    BreadCrumbBar.prototype.removeEventListener = function () {
        this.keyboardModule.destroy();
        this.parent.off(pathChanged, this.onUpdatePath);
        this.parent.off(finalizeEnd, this.onUpdatePath);
        this.parent.off(refreshEnd, this.onUpdatePath);
        this.parent.off(openEnd, this.onUpdatePath);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(renameEnd, this.onUpdatePath);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(splitterResize, this.onResize);
        this.parent.off(resizeEnd, this.onResize);
        this.parent.off(searchTextChange, this.onSearchTextChange);
    };
    /**
     * For internal use only - Get the module name.
     *  @private
     */
    BreadCrumbBar.prototype.getModuleName = function () {
        return 'breadcrumbbar';
    };
    /**
     * Destroys the PopUpMenu module.
     * @method destroy
     * @return {void}
     */
    BreadCrumbBar.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (!isNullOrUndefined(this.subMenuObj)) {
            this.subMenuObj.destroy();
        }
        if (!isNullOrUndefined(this.searchObj)) {
            this.searchObj.destroy();
        }
    };
    BreadCrumbBar.prototype.onSearchTextChange = function (args) {
        this.searchObj.element.placeholder = getLocaleText(this.parent, 'Search') + ' ' + args.cwd.name;
    };
    return BreadCrumbBar;
}());

/**
 * ContextMenu module
 */
var ContextMenu$2 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the ContextMenu module
     * @hidden
     */
    function ContextMenu$$1(parent) {
        this.parent = parent;
        this.render();
    }
    ContextMenu$$1.prototype.render = function () {
        this.keyConfigs = {
            downarrow: 'downarrow',
            uparrow: 'uparrown'
        };
        this.contextMenu = new ContextMenu({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: '#' + this.parent.element.id,
            beforeItemRender: this.onBeforeItemRender.bind(this),
            select: this.onSelect.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            cssClass: getCssClass(this.parent, ROOT_POPUP)
        });
        this.contextMenu.appendTo('#' + this.parent.element.id + CONTEXT_MENU_ID);
        this.addEventListener();
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.onBeforeItemRender = function (args) {
        if (args.item.id === this.getMenuId('largeiconsview')) {
            var iconSpan = createElement('span');
            var element = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'LargeIcons' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', ICON_LARGE + ' ' + MENU_ICON);
        }
        if (args.item.id === this.getMenuId('detailsview')) {
            var iconSpan = createElement('span');
            var element = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'Details' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', ICON_GRID + ' ' + MENU_ICON);
        }
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.onBeforeOpen = function (args) {
        var select$$1 = false;
        var uid;
        // tslint:disable-next-line
        var data;
        var treeFolder = false;
        var target = args.event.target;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(FULLROW)[0];
        }
        if (target.classList.contains(FULLROW)) {
            this.parent.selectedItems.length = 0;
        }
        this.targetElement = this.parent.view === 'Details' ? closest(target, 'tr') : target;
        var view = this.getTargetView(target);
        /* istanbul ignore next */
        if (target.classList.contains(TREE_VIEW) || closest(target, 'th') ||
            (closest(target, '#' + this.parent.element.id + BREADCRUMBBAR_ID))) {
            args.cancel = true;
            // tslint:disable-next-line
        }
        else if (!(this.parent.view === 'LargeIcons') && this.targetElement &&
            this.targetElement.classList.contains('e-emptyrow')) {
            this.setLayoutItem(target);
            //Paste
            // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
            /* istanbul ignore next */
        }
        else if (closest(target, '.' + EMPTY)) {
            this.setLayoutItem(target);
            // tslint:disable-next-line
        }
        else if (!target.classList.contains(MENU_ITEM) && !target.classList.contains(MENU_ICON) && !target.classList.contains(SUBMENU_ICON)) {
            /* istanbul ignore next */
            // tslint:disable-next-line
            if (this.parent.view === 'LargeIcons' && !isNullOrUndefined(closest(target, 'li')) && !closest(target, '#' + this.parent.element.id + TREE_ID)) {
                var eveArgs = { ctrlKey: true, shiftKey: true };
                data = this.parent.visitedData;
                if (!closest(target, 'li').classList.contains('e-active')) {
                    this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                }
                select$$1 = true;
            }
            else if (!isNullOrUndefined(closest(target, 'tr'))) {
                uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data;
                if (isNullOrUndefined(this.targetElement.getAttribute('aria-selected'))) {
                    /* istanbul ignore next */
                    // tslint:disable-next-line
                    this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('aria-rowindex'), 10)]);
                }
                select$$1 = true;
                /* istanbul ignore next */
            }
            else if (closest(target, '#' + this.parent.element.id + TREE_ID)) {
                uid = closest(target, 'li').getAttribute('data-uid');
                treeFolder = true;
            }
            /* istanbul ignore next */
            if (select$$1) {
                if (getValue('isFile', data) === true) {
                    this.setFileItem(target);
                }
                else {
                    this.setFolderItem(false);
                }
                /* istanbul ignore next */
            }
            else if (treeFolder) {
                this.setFolderItem(true);
                if (uid === this.parent.pathId[0]) {
                    this.contextMenu.enableItems([this.getMenuId('Delete'), this.getMenuId('Rename')], false, true);
                }
                /* istanbul ignore next */
                // tslint:disable-next-line
            }
            else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                this.setLayoutItem(target);
                //Paste
                // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
                /* istanbul ignore next */
            }
            else {
                args.cancel = true;
            }
        }
        if (args.cancel) {
            return;
        }
        this.contextMenu.dataBind();
        var eventArgs = {
            fileDetails: getFileObject(this.parent),
            element: args.element,
            target: target,
            items: this.contextMenu.items,
            menuModule: this.contextMenu,
            cancel: false
        };
        this.parent.trigger('menuOpen', eventArgs);
        args.cancel = eventArgs.cancel;
        if (args.cancel) {
            return;
        }
    };
    /* istanbul ignore next */
    /** @hidden */
    ContextMenu$$1.prototype.getTargetView = function (target) {
        return target.classList.contains(TREE_VIEW) ?
            'TreeView' : target.classList.contains(GRID_VIEW) ?
            'GridView' : target.classList.contains(ICON_VIEW) ?
            'LargeIcon' : target.classList.contains(LARGE_ICONS) ?
            'LargeIcon' : '';
    };
    ContextMenu$$1.prototype.setFolderItem = function (isTree) {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder);
        this.contextMenu.dataBind();
        if (isTree) {
            this.contextMenu.enableItems([this.getMenuId('Open')], false, true);
        }
        else if (this.parent.selectedItems.length !== 1) {
            this.contextMenu.enableItems([this.getMenuId('Rename')], false, true);
        }
        //Paste
        // this.contextMenu.enableItems([this.getMenuId('Paste')], this.parent.enablePaste, true);
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.setFileItem = function (target) {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file);
        this.contextMenu.dataBind();
        if (this.parent.selectedItems.length !== 1) {
            this.contextMenu.enableItems([this.getMenuId('Rename')], false, true);
        }
    };
    ContextMenu$$1.prototype.setLayoutItem = function (target) {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout);
        this.contextMenu.dataBind();
        if ((this.parent.view === 'LargeIcons' &&
            (closest(target, '#' + this.parent.element.id + LARGEICON_ID).getElementsByClassName(EMPTY).length !== 0))
            || (this.parent.view === 'Details' &&
                (closest(target, '#' + this.parent.element.id + GRID_ID).getElementsByClassName(EMPTY).length !== 0))) {
            this.contextMenu.enableItems([this.getMenuId('SelectAll')], false, true);
            this.contextMenu.dataBind();
        }
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.onSelect = function (args) {
        if (isNullOrUndefined(args.item) || !args.item.id) {
            return;
        }
        var itemText = args.item.id.substr((this.parent.element.id + '_cm_').length);
        var details;
        if (itemText === 'refresh' || itemText === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        }
        else {
            details = getFileObject(this.parent);
        }
        var eventArgs = {
            cancel: false,
            element: args.element,
            fileDetails: details,
            item: args.item
        };
        this.parent.trigger('menuClick', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (this.parent.selectedItems.length > 0 && ((itemText === 'paste') ||
            (itemText === 'upload'))) {
            var path = void 0;
            // tslint:disable-next-line
            var data = void 0;
            if (this.parent.view === 'Details') {
                var uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data;
                /* istanbul ignore next */
            }
            else {
                var elements = this.targetElement.parentElement;
                data = getItemObject(this.parent, elements);
            }
            /* istanbul ignore next */
            if (data.isFile) {
                path = '';
            }
            else {
                path = data.name + '/';
                this.parent.navigationpaneModule.treeObj.selectedNodes = [data.id];
            }
            var newPath = this.parent.path + path;
            this.parent.setProperties({ path: newPath }, true);
        }
        // tslint:disable-next-line
        var items = this.parent.selectedItems;
        switch (itemText) {
            case 'cut':
                cutFiles(this.parent);
                /* istanbul ignore next */
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                break;
            case 'copy':
                copyFiles(this.parent);
                /* istanbul ignore next */
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                /* istanbul ignore next */
                if (this.parent.activeModule === 'navigationpane') {
                    // tslint:disable-next-line
                    this.parent.navigationpaneModule.copyNodes = this.parent.nodeNames;
                }
                break;
            case 'paste':
                this.parent.pasteHandler();
                removeBlur(this.parent);
                break;
            case 'delete':
                createDialog(this.parent, 'Delete');
                break;
            /* istanbul ignore next */
            case 'download':
                /* istanbul ignore next */
                if (this.parent.activeModule === 'detailsview') {
                    items = this.parent.detailsviewModule.gridObj.getSelectedRecords();
                }
                else if (this.parent.activeModule === 'largeiconsview') {
                    var elements = this.parent.activeElements;
                    for (var ele = 0; ele < elements.length; ele++) {
                        items[ele] = getItemObject(this.parent, elements[ele]);
                    }
                }
                else if (this.parent.activeModule === 'navigationpane' && this.parent.selectedItems.length === 0) {
                    this.parent.notify(downloadInit, {});
                    items = this.parent.itemData;
                }
                if (items.length > 0) {
                    Download(this.parent, items);
                }
                break;
            case 'rename':
                this.parent.notify(renameInit, {});
                createDialog(this.parent, 'Rename');
                break;
            case 'selectall':
                /* istanbul ignore next */
                this.parent.notify(selectAllInit, {});
                break;
            case 'refresh':
                refresh(this.parent);
                break;
            case 'open':
                if (this.parent.visitedItem) {
                    this.parent.notify(openInit, { target: this.parent.visitedItem });
                }
                break;
            case 'details':
                this.parent.getDetails();
                break;
            case 'newfolder':
                createDialog(this.parent, 'NewFolder');
                break;
            case 'upload':
                document.getElementById(this.parent.element.id + '_upload').click();
                break;
            /* istanbul ignore next */
            case 'name':
            /* istanbul ignore next */
            case 'size':
            /* istanbul ignore next */
            case 'date':
            /* istanbul ignore next */
            case 'ascending':
            /* istanbul ignore next */
            case 'descending':
                /* istanbul ignore next */
                sortbyClickHandler(this.parent, args);
                break;
            // tslint:disable-next-line
            /* istanbul ignore next */
            case 'largeiconsview':
                this.changeLayout('LargeIcons');
                break;
            // tslint:disable-next-line
            /* istanbul ignore next */
            case 'detailsview':
                this.changeLayout('Details');
                break;
        }
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.changeLayout = function (view) {
        if (this.parent.view !== view) {
            this.parent.setProperties({ view: view }, true);
            read(this.parent, layoutChange, this.parent.path);
        }
    };
    ContextMenu$$1.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    this.contextMenu.cssClass = getCssClass(this.parent, ROOT_POPUP);
                    break;
                case 'enableRtl':
                    this.contextMenu.enableRtl = e.newProp.enableRtl;
                    break;
            }
        }
    };
    ContextMenu$$1.prototype.addEventListener = function () {
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.keyboardModule = new KeyboardEvents(this.contextMenu.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    ContextMenu$$1.prototype.removeEventListener = function () {
        this.parent.off(destroy, this.destroy);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.keyboardModule.destroy();
    };
    ContextMenu$$1.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'uparrow':
            case 'downarrow':
                e.preventDefault();
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ContextMenu$$1.prototype.getModuleName = function () {
        return 'contextmenu';
    };
    /**
     * Destroys the ContextMenu module.
     * @method destroy
     * @return {void}
     */
    ContextMenu$$1.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        this.contextMenu.destroy();
        if (document.getElementById(this.parent.element.id + CONTEXT_MENU_ID)) {
            remove(document.getElementById(this.parent.element.id + CONTEXT_MENU_ID));
        }
    };
    /* istanbul ignore next */
    ContextMenu$$1.prototype.getItemData = function (data) {
        var items = [];
        for (var i = 0; i < data.length; i++) {
            var item = void 0;
            var itemId = this.getMenuId(data[i]);
            var itemText = getLocaleText(this.parent, data[i]);
            switch (data[i]) {
                case '|':
                    item = { separator: true };
                    break;
                case 'Open':
                    item = { id: itemId, text: itemText, iconCss: ICON_OPEN };
                    break;
                case 'Upload':
                    item = { id: itemId, text: itemText, iconCss: ICON_UPLOAD };
                    break;
                case 'Cut':
                    item = { id: itemId, text: itemText, iconCss: ICON_CUT };
                    break;
                case 'Copy':
                    item = { id: itemId, text: itemText, iconCss: ICON_COPY };
                    break;
                case 'Paste':
                    item = { id: itemId, text: itemText, iconCss: ICON_PASTE };
                    break;
                case 'Delete':
                    item = { id: itemId, text: itemText, iconCss: ICON_DELETE };
                    break;
                case 'Rename':
                    item = { id: itemId, text: itemText, iconCss: ICON_RENAME };
                    break;
                case 'NewFolder':
                    item = { id: itemId, text: itemText, iconCss: ICON_NEWFOLDER };
                    break;
                case 'Details':
                    item = { id: itemId, text: itemText, iconCss: ICON_DETAILS };
                    break;
                case 'SortBy':
                    item = {
                        id: itemId, text: itemText, iconCss: ICON_SHORTBY,
                        items: [
                            {
                                id: this.getMenuId('Name'), text: getLocaleText(this.parent, 'Name'),
                                iconCss: this.parent.sortBy === 'name' ? TB_OPTION_DOT : null
                            },
                            {
                                id: this.getMenuId('Size'), text: getLocaleText(this.parent, 'Size'),
                                iconCss: this.parent.sortBy === 'size' ? TB_OPTION_DOT : null
                            },
                            {
                                id: this.getMenuId('Date'), text: getLocaleText(this.parent, 'DateModified'),
                                iconCss: this.parent.sortBy === 'dateModified' ? TB_OPTION_DOT : null
                            },
                            { separator: true },
                            {
                                id: this.getMenuId('Ascending'), text: getLocaleText(this.parent, 'Ascending'),
                                iconCss: this.parent.sortOrder === 'Ascending' ? TB_OPTION_TICK : null
                            },
                            {
                                id: this.getMenuId('Descending'), text: getLocaleText(this.parent, 'Descending'),
                                iconCss: this.parent.sortOrder === 'Descending' ? TB_OPTION_TICK : null
                            }
                        ]
                    };
                    break;
                /* istanbul ignore next */
                case 'View':
                    item = {
                        id: itemId, text: itemText, iconCss: this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE,
                        items: [
                            {
                                id: this.getMenuId('largeiconsview'), text: getLocaleText(this.parent, 'View-LargeIcons'),
                                iconCss: this.parent.view === 'Details' ? null : TB_OPTION_TICK
                            },
                            {
                                id: this.getMenuId('detailsview'), text: getLocaleText(this.parent, 'View-Details'),
                                iconCss: this.parent.view === 'Details' ? TB_OPTION_TICK : null
                            }
                        ]
                    };
                    break;
                case 'Refresh':
                    item = { id: itemId, text: itemText, iconCss: ICON_REFRESH };
                    break;
                case 'SelectAll':
                    item = { id: itemId, text: itemText, iconCss: ICON_SELECTALL };
                    break;
                /* istanbul ignore next */
                case 'Download':
                    item = { id: itemId, text: itemText, iconCss: ICON_DOWNLOAD };
                    break;
                /* istanbul ignore next */
                default:
                    item = { id: itemId, text: itemText };
                    break;
            }
            items.push(item);
        }
        return items;
    };
    ContextMenu$$1.prototype.getMenuId = function (id) {
        return this.parent.element.id + '_cm_' + id.toLowerCase();
    };
    return ContextMenu$$1;
}());

/**
 * Specifies the default locale of FileManager component
 */
var defaultLocale = {
    'NewFolder': 'New folder',
    'Upload': 'Upload',
    'Delete': 'Delete',
    'Rename': 'Rename',
    'Download': 'Download',
    'Cut': 'Cut',
    'Copy': 'Copy',
    'Paste': 'Paste',
    'SortBy': 'Sort by',
    'Refresh': 'Refresh',
    'Item-Selection': 'item selected',
    'Items-Selection': 'items selected',
    'View': 'View',
    'Details': 'Details',
    'SelectAll': 'Select all',
    'Open': 'Open',
    'Tooltip-NewFolder': 'New folder',
    'Tooltip-Upload': 'Upload',
    'Tooltip-Delete': 'Delete',
    'Tooltip-Rename': 'Rename',
    'Tooltip-Download': 'Download',
    'Tooltip-Cut': 'Cut',
    'Tooltip-Copy': 'Copy',
    'Tooltip-Paste': 'Paste',
    'Tooltip-SortBy': 'Sort by',
    'Tooltip-Refresh': 'Refresh',
    'Tooltip-Selection': 'Clear selection',
    'Tooltip-View': 'View',
    'Tooltip-Details': 'Details',
    'Tooltip-SelectAll': 'Select all',
    'Name': 'Name',
    'Size': 'Size',
    'DateModified': 'Modified',
    'DateCreated': 'Date created',
    'Modified': 'Modified',
    'Created': 'Created',
    'Location': 'Location',
    'Type': 'Type',
    'Ascending': 'Ascending',
    'Descending': 'Descending',
    'View-LargeIcons': 'Large icons',
    'View-Details': 'Details',
    'Search': 'Search',
    'Button-Ok': 'OK',
    'Button-Cancel': 'Cancel',
    'Button-Yes': 'Yes',
    'Button-No': 'No',
    'Button-Create': 'Create',
    'Button-Save': 'Save',
    'Header-NewFolder': 'Folder',
    'Content-NewFolder': 'Enter your folder name',
    'Header-Rename': 'Rename',
    'Content-Rename': 'Enter your new name',
    'Header-Rename-Confirmation': 'Rename Confirmation',
    'Content-Rename-Confirmation': 'If you change a file name extension, the file might become unstable. ' +
        'Are you sure you want to change it?',
    'Header-Delete': 'Delete File',
    'Content-Delete': 'Are you sure you want to delete this file?',
    'Header-Multiple-Delete': 'Delete Multiple Files',
    'Content-Multiple-Delete': 'Are you sure you want to delete these {0} files?',
    'Header-Duplicate': 'File exists',
    'Content-Duplicate': ' already exists. Are you sure you want to replace it?',
    'Header-Upload': 'Upload Files',
    'Error': 'Error',
    'Validation-Empty': 'The file or folder name cannot be empty.',
    'Validation-Invalid': 'The file or folder name {0} contains invalid characters. Please use a different name. ' +
        'Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|',
    'Validation-NewFolder-Exists': 'A file or folder with the name {0} already exists.',
    'Validation-Rename-Exists': 'Cannot rename {0} to {1}: destination already exists.',
    'Folder-Empty': 'This folder is empty',
    'File-Upload': 'Drag files here to upload',
    'Search-Empty': 'No results found',
    'Search-Key': 'Try with different keywords'
};

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
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * The FileManager component allows users to access and manage the file system through the web  browser. It can performs the
 * functionalities like add, rename, search, sort, upload and delete files or folders. And also it
 * provides an easy way of  dynamic injectable modules like toolbar, navigationpane, detailsview, largeiconsview.
 * ```html
 *  <div id="file"></div>
 * ```
 * ```typescript,
 *  let feObj: FileManager = new FileManager();
 *  feObj.appendTo('#file');
 * ```
 */
var FileManager = /** @__PURE__ @class */ (function (_super) {
    __extends$7(FileManager, _super);
    function FileManager(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.selectedNodes = [];
        _this.duplicateItems = [];
        _this.previousPath = [];
        _this.nextPath = [];
        _this.uploadItem = [];
        _this.deleteRecords = [];
        _this.isFile = false;
        _this.sortOrder = 'Ascending';
        _this.sortBy = 'name';
        _this.enablePaste = false;
        _this.persistData = false;
        _this.isOpened = false;
        _this.searchedItems = [];
        FileManager_1.Inject(BreadCrumbBar, LargeIconsView, ContextMenu$2);
        return _this;
    }
    FileManager_1 = FileManager;
    /**
     * Get component name.
     * @returns string
     * @private
     */
    FileManager.prototype.getModuleName = function () {
        return 'filemanager';
    };
    /**
     * Initialize the event handler
     */
    FileManager.prototype.preRender = function () {
        this.ensurePath();
        this.feParent = [];
        this.feFiles = [];
        setStyleAttribute(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.isDevice = Browser.isDevice;
        this.isMobile = this.checkMobile();
        if (this.isMobile) {
            this.setProperties({ navigationPaneSettings: { visible: false } }, true);
        }
        var ele = closest(this.element, '.e-bigger');
        this.isBigger = ele ? true : false;
        createSpinner({ target: this.element }, createElement);
        this.addWrapper();
        this.keyConfigs = {
            altN: 'alt+n',
            f5: 'f5',
            ctrlShift1: 'ctrl+shift+1',
            ctrlShift2: 'ctrl+shift+2'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    };
    /**
     * Gets the properties to be maintained upon browser refresh..
     * @returns string
     * @hidden
     */
    FileManager.prototype.getPersistData = function () {
        var keyEntity = ['view', 'path', 'selectedItems'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    FileManager.prototype.requiredModules = function () {
        var modules = [];
        modules.push({
            member: 'breadcrumbbar',
            args: [this]
        });
        modules.push({
            member: 'largeiconsview',
            args: [this]
        });
        if (this.toolbarSettings.visible) {
            modules.push({
                member: 'toolbar',
                args: [this]
            });
        }
        if (this.navigationPaneSettings.visible) {
            modules.push({
                member: 'navigationpane',
                args: [this]
            });
        }
        if (this.view) {
            modules.push({
                member: 'detailsview',
                args: [this]
            });
        }
        if (this.contextMenuSettings.visible && !this.isDevice) {
            modules.push({
                member: 'contextmenu',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    FileManager.prototype.render = function () {
        this.initialize();
        this.selectedItems = (isNullOrUndefined(this.selectedItems)) ? [] : this.selectedItems;
        this.fileView = this.view;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? initialEnd : finalizeEnd, this.path);
        this.adjustHeight();
        if (isNullOrUndefined(this.navigationpaneModule)) {
            this.splitterObj.collapse(0);
            var bar = select('.' + SPLIT_BAR, this.element);
            bar.classList.add(DISPLAY_NONE);
        }
        this.wireEvents();
    };
    FileManager.prototype.ensurePath = function () {
        var currentPath = this.path;
        if (isNullOrUndefined(currentPath)) {
            currentPath = '/';
        }
        if (currentPath.indexOf('/') !== 0) {
            currentPath = '/' + currentPath;
        }
        if (currentPath.lastIndexOf('/') !== (currentPath.length - 1)) {
            currentPath = currentPath + '/';
        }
        this.originalPath = currentPath;
        this.setProperties({ path: '/' }, true);
        this.pathId = ['fe_tree'];
        this.itemData = [];
    };
    FileManager.prototype.initialize = function () {
        if (this.isMobile) {
            addClass([this.element], MOBILE);
        }
        if (this.allowMultiSelection) {
            addClass([this.element], CHECK_SELECT);
        }
        this.addCssClass(null, this.cssClass);
        this.renderFileUpload();
    };
    FileManager.prototype.addWrapper = function () {
        var headerWrap = this.createElement('div', { id: this.element.id + TOOLBAR_ID });
        this.element.appendChild(headerWrap);
        var layoutWrap = this.createElement('div', {
            id: this.element.id + LAYOUT_ID, className: LAYOUT
        });
        this.element.appendChild(layoutWrap);
        var treeWrap = this.createElement('div', {
            id: this.element.id + TREE_ID
        });
        layoutWrap.appendChild(treeWrap);
        var contentWrap = this.createElement('div', {
            id: this.element.id + CONTENT_ID, className: LAYOUT_CONTENT
        });
        this.breadCrumbBarNavigation = this.createElement('div', {
            id: this.element.id + BREADCRUMBBAR_ID,
            className: BREADCRUMBS
        });
        contentWrap.appendChild(this.breadCrumbBarNavigation);
        var gridWrap = this.createElement('div', {
            id: this.element.id + GRID_ID
        });
        contentWrap.appendChild(gridWrap);
        var largeiconWrap = this.createElement('div', {
            id: this.element.id + LARGEICON_ID,
            className: LARGE_ICONS
        });
        contentWrap.appendChild(largeiconWrap);
        var overlay = this.createElement('span', { className: OVERLAY });
        contentWrap.appendChild(overlay);
        layoutWrap.appendChild(contentWrap);
        this.splitterObj = new Splitter({
            paneSettings: [
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                },
                { size: '75%', min: '270px' }
            ],
            width: '100%',
            resizing: this.splitterResize.bind(this)
        });
        this.splitterObj.appendTo(layoutWrap);
        var dialogWrap = this.createElement('div', { id: this.element.id + DIALOG_ID });
        this.element.appendChild(dialogWrap);
        var menuWrap = this.createElement('ul', { id: this.element.id + CONTEXT_MENU_ID });
        this.element.appendChild(menuWrap);
        var dialogImgWrap = this.createElement('div', { id: this.element.id + IMG_DIALOG_ID });
        this.element.appendChild(dialogImgWrap);
        var extnDialogWrap = this.createElement('div', { id: this.element.id + EXTN_DIALOG_ID });
        this.element.appendChild(extnDialogWrap);
        var uploadDialogWrap = this.createElement('div', { id: this.element.id + UPLOAD_DIALOG_ID });
        this.element.appendChild(uploadDialogWrap);
    };
    FileManager.prototype.adjustHeight = function () {
        var toolbar = select('#' + this.element.id + TOOLBAR_ID, this.element);
        var toolBarHeight = this.toolbarModule ? toolbar.offsetHeight : 0;
        this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
        this.splitterObj.dataBind();
    };
    /* istanbul ignore next */
    FileManager.prototype.splitterResize = function () {
        this.notify(splitterResize, {});
    };
    FileManager.prototype.splitterAdjust = function () {
        var bar = select('.' + SPLIT_BAR, this.element);
        if (this.navigationPaneSettings.visible) {
            this.splitterObj.expand(0);
            bar.classList.remove(DISPLAY_NONE);
        }
        else {
            this.splitterObj.collapse(0);
            bar.classList.add(DISPLAY_NONE);
        }
    };
    FileManager.prototype.addCssClass = function (oldOne, newOne) {
        if (!isNullOrUndefined(oldOne) && oldOne !== '') {
            removeClass([this.element], oldOne.split(' '));
        }
        if (!isNullOrUndefined(newOne) && newOne !== '') {
            addClass([this.element], newOne.split(' '));
        }
    };
    FileManager.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    FileManager.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    FileManager.prototype.onContextMenu = function (e) {
        e.preventDefault();
    };
    FileManager.prototype.checkMobile = function () {
        return (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(Browser.userAgent.toLowerCase())
            && /mobile/i.test(Browser.userAgent.toLowerCase()));
    };
    FileManager.prototype.renderFileUpload = function () {
        var id = this.element.id + UPLOAD_ID;
        var uploadEle = this.createElement('input', { id: id, attrs: { name: 'uploadFiles', type: 'file' } });
        this.element.appendChild(uploadEle);
        this.uploadDialogObj = new Dialog({
            header: getLocaleText(this, 'Header-Upload'),
            content: uploadEle,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: false,
            isModal: true,
            width: '350px',
            target: '#' + this.element.id,
            locale: this.locale,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: this.enableRtl,
            open: this.onOpen.bind(this),
            close: this.onClose.bind(this),
        });
        this.uploadDialogObj.appendTo('#' + this.element.id + UPLOAD_DIALOG_ID);
        this.renderUploadBox();
    };
    FileManager.prototype.renderUploadBox = function () {
        var uploadUrl = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        this.uploadObj = new Uploader({
            dropArea: select('#' + this.element.id + CONTENT_ID, this.element),
            asyncSettings: {
                saveUrl: uploadUrl,
                removeUrl: uploadUrl
            },
            locale: this.locale,
            enableRtl: this.enableRtl,
            uploading: this.onUploading.bind(this),
            removing: this.onRemoving.bind(this),
            clearing: this.onClearing.bind(this),
            selected: this.onSelected.bind(this),
            success: this.onUploadSuccess.bind(this),
            failure: this.onUploadFailure.bind(this),
            autoUpload: this.uploadSettings.autoUpload,
            minFileSize: this.uploadSettings.minFileSize,
            maxFileSize: this.uploadSettings.maxFileSize,
        });
        this.uploadObj.appendTo('#' + this.element.id + UPLOAD_ID);
    };
    FileManager.prototype.updateUploader = function () {
        this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
        this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
        this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
        this.uploadObj.dataBind();
    };
    /* istanbul ignore next */
    FileManager.prototype.onOpen = function () {
        this.isOpened = true;
        this.uploadDialogObj.element.focus();
    };
    /* istanbul ignore next */
    FileManager.prototype.onClose = function () {
        this.isOpened = false;
        this.uploadObj.clearAll();
    };
    /* istanbul ignore next */
    FileManager.prototype.onUploading = function (args) {
        args.customFormData = [{ 'path': this.path }, { 'action': 'Save' }];
    };
    /* istanbul ignore next */
    FileManager.prototype.onRemoving = function (args) {
        args.customFormData = [{ 'path': this.path }, { 'action': 'Remove' }];
        if (this.uploadObj.getFilesData().length === 1) {
            this.uploadDialogObj.hide();
        }
    };
    /* istanbul ignore next */
    FileManager.prototype.onClearing = function () {
        if (this.isOpened) {
            this.uploadDialogObj.hide();
        }
    };
    /* istanbul ignore next */
    FileManager.prototype.onSelected = function () {
        this.uploadDialogObj.show();
    };
    /* istanbul ignore next */
    FileManager.prototype.onUploadSuccess = function (files) {
        this.trigger('onSuccess', { action: 'Upload', result: files });
        read(this, pathChanged, this.path);
    };
    /* istanbul ignore next */
    FileManager.prototype.onUploadFailure = function (files) {
        this.trigger('onError', { action: 'Upload', error: files });
    };
    FileManager.prototype.onInitialEnd = function () {
        setNextPath(this, this.path);
    };
    FileManager.prototype.addEventListeners = function () {
        this.on(beforeRequest, this.showSpinner, this);
        this.on(afterRequest, this.hideSpinner, this);
        this.on(initialEnd, this.onInitialEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    };
    FileManager.prototype.removeEventListeners = function () {
        if (this.isDestroyed) {
            return;
        }
        this.off(beforeRequest, this.showSpinner);
        this.off(afterRequest, this.hideSpinner);
        this.off(initialEnd, this.onInitialEnd);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    };
    FileManager.prototype.resizeHandler = function () {
        this.notify(resizeEnd, {});
    };
    FileManager.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'altN':
                e.preventDefault();
                this.itemData = [getPathObject(this)];
                createDialog(this, 'NewFolder');
                break;
            case 'f5':
                e.preventDefault();
                refresh(this);
                break;
            /* istanbul ignore next */
            case 'ctrlShift1':
                e.preventDefault();
                this.fileView = 'Details';
                this.setProperties({ view: 'Details' }, true);
                read(this, layoutChange, '/');
                break;
            /* istanbul ignore next */
            case 'ctrlShift2':
                e.preventDefault();
                this.fileView = 'LargeIcons';
                this.setProperties({ view: 'LargeIcons' }, true);
                read(this, layoutChange, '/');
                break;
        }
    };
    FileManager.prototype.wireEvents = function () {
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    FileManager.prototype.unWireEvents = function () {
        this.keyboardModule.destroy();
    };
    FileManager.prototype.setPath = function () {
        this.ensurePath();
        this.notify(clearPathInit, { selectedNode: this.pathId[0] });
        read(this, (this.path !== this.originalPath) ? initialEnd : finalizeEnd, this.path);
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {FileManager} newProp
     * @param  {FileManager} oldProp
     * @returns void
     * @private
     */
    /* istanbul ignore next */
    FileManager.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'ajaxSettings':
                    this.ajaxSettingSetModel(newProp);
                    break;
                case 'allowMultiSelection':
                    if (this.allowMultiSelection) {
                        addClass([this.element], CHECK_SELECT);
                    }
                    else {
                        removeClass([this.element], CHECK_SELECT);
                    }
                    if (this.selectedItems.length === 1) {
                        this.singleSelection = this.selectedItems[0];
                    }
                    else {
                        this.singleSelection = null;
                    }
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'cssClass':
                    this.addCssClass(oldProp.cssClass, newProp.cssClass);
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'detailsViewSettings':
                    this.notify(modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                    break;
                case 'enableRtl':
                    this.setRtl(newProp.enableRtl);
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'height':
                    var height = !isNullOrUndefined(newProp.height) ? formatUnit(newProp.height) : newProp.height;
                    setStyleAttribute(this.element, { 'height': height });
                    this.adjustHeight();
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'locale':
                    if (!isNullOrUndefined(newProp.enableRtl)) {
                        this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    }
                    this.localeSetModelOption(newProp);
                    break;
                case 'navigationPaneSettings':
                    this.splitterAdjust();
                    this.notify(modelChanged, { module: 'navigationpane', newProp: newProp, oldProp: oldProp });
                    break;
                case 'path':
                    this.setPath();
                    break;
                case 'searchSettings':
                    if (!isNullOrUndefined(newProp.searchSettings.allowSearchOnTyping)) {
                        this.setProperties({ searchSettings: { allowSearchOnTyping: newProp.searchSettings.allowSearchOnTyping } }, true);
                    }
                    if (isNullOrUndefined(newProp.searchSettings.ignoreCase)) {
                        this.setProperties({ searchSettings: { ignoreCase: newProp.searchSettings.ignoreCase } }, true);
                    }
                    if (isNullOrUndefined(newProp.searchSettings.filterType)) {
                        this.setProperties({ searchSettings: { filterType: newProp.searchSettings.filterType } }, true);
                    }
                    this.notify(modelChanged, { module: 'breadcrumbbar', newProp: newProp, oldProp: oldProp });
                    break;
                case 'selectedItems':
                    if (this.view === 'Details') {
                        this.notify(modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                    }
                    else if (this.view === 'LargeIcons') {
                        this.notify(modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                    }
                    break;
                case 'showFileExtension':
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'showHiddenItems':
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'showThumbnail':
                    this.notify(modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                    break;
                case 'toolbarSettings':
                    this.adjustHeight();
                    this.notify(modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    break;
                case 'uploadSettings':
                    this.updateUploader();
                    break;
                case 'view':
                    if (newProp.view === 'Details') {
                        this.notify(modelChanged, { module: 'detailsview', newProp: newProp, oldProp: oldProp });
                    }
                    else if (newProp.view === 'LargeIcons') {
                        this.notify(modelChanged, { module: 'largeiconsview', newProp: newProp, oldProp: oldProp });
                    }
                    break;
                case 'width':
                    var width = !isNullOrUndefined(newProp.width) ? formatUnit(newProp.width) : newProp.width;
                    setStyleAttribute(this.element, { 'width': width });
                    this.notify(modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
    };
    /* istanbul ignore next */
    FileManager.prototype.ajaxSettingSetModel = function (newProp) {
        if (!isNullOrUndefined(newProp.ajaxSettings.url)) {
            this.setProperties({ ajaxSettings: { url: newProp.ajaxSettings.url } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.uploadUrl)) {
            this.setProperties({ ajaxSettings: { uploadUrl: newProp.ajaxSettings.uploadUrl } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.downloadUrl)) {
            this.setProperties({ ajaxSettings: { downloadUrl: newProp.ajaxSettings.downloadUrl } }, true);
        }
        if (!isNullOrUndefined(newProp.ajaxSettings.getImageUrl)) {
            this.setProperties({ ajaxSettings: { getImageUrl: newProp.ajaxSettings.getImageUrl } }, true);
        }
        this.setProperties({ path: '/' }, true);
        this.setProperties({ selectedItems: [] }, true);
        _super.prototype.refresh.call(this);
    };
    /* istanbul ignore next */
    FileManager.prototype.localeSetModelOption = function (newProp) {
        this.uploadObj.locale = newProp.locale;
        _super.prototype.refresh.call(this);
    };
    /**
     * Triggers when the component is destroyed.
     * @returns void
     */
    FileManager.prototype.destroy = function () {
        if (this.isDestroyed) {
            return;
        }
        if (!this.refreshing) {
            this.notify(destroy, {});
        }
        this.uploadObj.destroy();
        this.uploadObj = null;
        this.uploadDialogObj.destroy();
        this.uploadDialogObj = null;
        this.splitterObj.destroy();
        this.splitterObj = null;
        if (this.dialogObj) {
            this.dialogObj.destroy();
            this.dialogObj = null;
        }
        if (this.viewerObj) {
            this.viewerObj.destroy();
            this.viewerObj = null;
        }
        if (this.extDialogObj) {
            this.extDialogObj.destroy();
            this.extDialogObj = null;
        }
        this.element.removeAttribute('style');
        this.element.removeAttribute('tabindex');
        this.removeEventListeners();
        this.unWireEvents();
        this.addCssClass(this.cssClass, null);
        removeClass([this.element], [RTL, MOBILE, CHECK_SELECT]);
        this.element.innerHTML = '';
        _super.prototype.destroy.call(this);
    };
    /**
     * Disables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be disabled.
     * @returns void
     */
    FileManager.prototype.disableToolbarItems = function (items) {
        if (!isNullOrUndefined(items)) {
            this.toolbarModule.enableItems(items, false);
        }
    };
    /**
     * Enables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be enabled.
     * @returns void
     */
    FileManager.prototype.enableToolbarItems = function (items) {
        if (!isNullOrUndefined(items)) {
            this.toolbarModule.enableItems(items, true);
        }
    };
    /**
     * Refresh the folder files of the file manager.
     * @returns void
     */
    FileManager.prototype.refreshFiles = function () {
        refresh(this);
    };
    /**
     * To select node names for performing file operations
     * @public
     * @hidden
     */
    FileManager.prototype.fileOperation = function (nodes, operation) {
        var i = 0;
        var selectNodes = nodes;
        while (i < nodes.length) {
            (operation !== 'Remove') ? this.selectedNodes.push(selectNodes[i].name) : this.selectedNodes = this.selectedNodes;
            (operation === 'Remove') ? this.deleteRecords.push(selectNodes[i].name) : this.deleteRecords = this.deleteRecords;
            i++;
        }
    };
    /**
     * Gets details of file's / folder's
     * @hidden
     */
    /* istanbul ignore next */
    FileManager.prototype.getDetails = function () {
        removeBlur(this);
        this.targetPath = this.path;
        if (this.activeElements && this.activeElements.length === 0) {
            this.activeElements = this.element.querySelectorAll('.' + ACTIVE);
        }
        var items = activeElement('FileInfo', null, this);
        /* istanbul ignore next */
        items = (items.length !== 0) ? items : activeElement('FileInfo', false, this);
        this.selectedNodes = [];
        this.fileOperation(items);
        if (this.selectedNodes.length === 0 || this.targetPath === '') {
            this.selectedNodes[0] = '';
        }
        GetDetails(this, this.selectedNodes, this.targetPath, 'GetDetails');
    };
    /**
     * Performs paste operation
     * @hidden
     */
    FileManager.prototype.pasteHandler = function () {
        if (this.selectedNodes.length !== 0) {
            if ((this.fileAction === 'MoveTo' && this.targetPath !== this.path) || this.fileAction === 'CopyTo') {
                paste(
                // tslint:disable-next-line
                this, this.targetPath, this.selectedNodes, this.path, this.fileAction, this.navigationpaneModule, []);
            }
            else {
                removeBlur(this);
            }
        }
    };
    /**
     * Performs delete operation
     * @hidden
     */
    FileManager.prototype.deleteHandler = function (items) {
        this.deleteRecords = [];
        this.fileOperation(items, 'Remove');
        Delete(this, this.deleteRecords, this.targetPath, 'Remove', this.navigationpaneModule);
        this.deleteRecords = [];
    };
    /**
     * Specifies the direction of FileManager
     */
    FileManager.prototype.setRtl = function (rtl) {
        if (rtl) {
            this.addCssClass(null, RTL);
        }
        else {
            this.addCssClass(RTL, null);
        }
        if (this.uploadObj) {
            this.uploadDialogObj.enableRtl = rtl;
            this.uploadObj.enableRtl = rtl;
        }
    };
    var FileManager_1;
    __decorate$7([
        Complex({}, AjaxSettings)
    ], FileManager.prototype, "ajaxSettings", void 0);
    __decorate$7([
        Property(true)
    ], FileManager.prototype, "allowMultiSelection", void 0);
    __decorate$7([
        Complex({}, ContextMenuSettings)
    ], FileManager.prototype, "contextMenuSettings", void 0);
    __decorate$7([
        Property('')
    ], FileManager.prototype, "cssClass", void 0);
    __decorate$7([
        Complex({}, DetailsViewSettings)
    ], FileManager.prototype, "detailsViewSettings", void 0);
    __decorate$7([
        Property(false)
    ], FileManager.prototype, "enablePersistence", void 0);
    __decorate$7([
        Property('400px')
    ], FileManager.prototype, "height", void 0);
    __decorate$7([
        Property('LargeIcons')
    ], FileManager.prototype, "view", void 0);
    __decorate$7([
        Complex({}, NavigationPaneSettings)
    ], FileManager.prototype, "navigationPaneSettings", void 0);
    __decorate$7([
        Property('/')
    ], FileManager.prototype, "path", void 0);
    __decorate$7([
        Complex({}, SearchSettings)
    ], FileManager.prototype, "searchSettings", void 0);
    __decorate$7([
        Property()
    ], FileManager.prototype, "selectedItems", void 0);
    __decorate$7([
        Property(true)
    ], FileManager.prototype, "showFileExtension", void 0);
    __decorate$7([
        Property(false)
    ], FileManager.prototype, "showHiddenItems", void 0);
    __decorate$7([
        Property(true)
    ], FileManager.prototype, "showThumbnail", void 0);
    __decorate$7([
        Complex({}, ToolbarSettings)
    ], FileManager.prototype, "toolbarSettings", void 0);
    __decorate$7([
        Complex({}, UploadSettings)
    ], FileManager.prototype, "uploadSettings", void 0);
    __decorate$7([
        Property('100%')
    ], FileManager.prototype, "width", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "beforeFileLoad", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "beforeFileOpen", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "beforeSend", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "created", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "destroyed", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "fileSelect", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "menuClick", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "menuOpen", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "onError", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "onSuccess", void 0);
    __decorate$7([
        Event()
    ], FileManager.prototype, "toolbarClick", void 0);
    FileManager = FileManager_1 = __decorate$7([
        NotifyPropertyChanges
    ], FileManager);
    return FileManager;
}(Component));

/**
 * File Manager base modules
 */

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
var Toolbar$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the Toolbar module
     * @hidden
     */
    function Toolbar$$1(parent) {
        this.default = ['Delete', 'Rename', 'Download', 'Cut', 'Copy', 'Paste'];
        this.single = ['Delete', 'Rename', 'Download', 'Cut', 'Copy'];
        this.multiple = ['Delete', 'Download', 'Cut', 'Copy', 'Refresh'];
        this.selection = ['NewFolder', 'Upload', 'SortBy', 'Refresh'];
        this.parent = parent;
        this.render();
        this.addEventListener();
    }
    Toolbar$$1.prototype.render = function () {
        this.items = this.toolbarItemData(this.getItems(this.parent.toolbarSettings.items));
        this.toolbarObj = new Toolbar({
            items: this.items,
            created: this.toolbarCreateHandler.bind(this),
            overflowMode: 'Popup',
            clicked: this.onClicked.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.toolbarObj.appendTo('#' + this.parent.element.id + TOOLBAR_ID);
    };
    Toolbar$$1.prototype.getItems = function (items) {
        var currItems = items.slice();
        if (this.parent.isDevice && this.parent.allowMultiSelection) {
            currItems.push('SelectAll');
        }
        return currItems;
    };
    /* istanbul ignore next */
    Toolbar$$1.prototype.onClicked = function (args) {
        if (isNullOrUndefined(args.item) || !args.item.id) {
            return;
        }
        var tool = args.item.id.substr((this.parent.element.id + '_tb_').length);
        var details;
        if (tool === 'refresh' || tool === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        }
        else {
            details = getFileObject(this.parent);
        }
        var eventArgs = { cancel: false, fileDetails: details, item: args.item };
        this.parent.trigger('toolbarClick', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        switch (tool) {
            case 'sortby':
                var target = closest(args.originalEvent.target, '.' + TB_ITEM);
                if (target && target.classList.contains('e-toolbar-popup')) {
                    args.cancel = true;
                }
                break;
            case 'newfolder':
                createDialog(this.parent, 'NewFolder');
                break;
            /* istanbul ignore next */
            case 'cut':
                cutFiles(this.parent);
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                break;
            /* istanbul ignore next */
            case 'copy':
                copyFiles(this.parent);
                if (this.parent.nodeNames) {
                    this.parent.fileOperation(this.parent.nodeNames);
                }
                if (this.parent.activeModule === 'navigationPane') {
                    this.parent.navigationpaneModule.copyNodes = this.parent.nodeNames;
                }
                break;
            case 'delete':
                createDialog(this.parent, 'Delete');
                break;
            case 'details':
                this.parent.getDetails();
                break;
            /* istanbul ignore next */
            case 'paste':
                this.parent.pasteHandler();
                break;
            case 'refresh':
                refresh(this.parent);
                break;
            /* istanbul ignore next */
            case 'download':
                if (this.parent.selectedItems.length > 0) {
                    if (this.parent.view === 'LargeIcons') {
                        var elementRecords = [];
                        var elements = selectAll('.e-active', this.parent.largeiconsviewModule.listElements);
                        for (var ele = 0; ele < elements.length; ele++) {
                            elementRecords[ele] = getItemObject(this.parent, elements[ele]);
                        }
                        Download(this.parent, elementRecords);
                    }
                    else {
                        Download(this.parent, this.parent.detailsviewModule.gridObj.getSelectedRecords());
                    }
                }
                else {
                    return;
                }
                break;
            case 'rename':
                this.parent.notify(renameInit, {});
                createDialog(this.parent, 'Rename');
                break;
            case 'upload':
                var uploadEle = select('#' + this.parent.element.id + UPLOAD_ID, this.parent.element);
                uploadEle.click();
                break;
            case 'selectall':
                this.parent.notify(selectAllInit, {});
                break;
            case 'selection':
                this.parent.notify(clearAllInit, {});
                break;
        }
    };
    Toolbar$$1.prototype.toolbarCreateHandler = function () {
        if (!isNullOrUndefined(select('#' + this.getId('SortBy'), this.parent.element))) {
            var items = [
                { id: this.getPupupId('name'), text: getLocaleText(this.parent, 'Name'), iconCss: TB_OPTION_DOT },
                { id: this.getPupupId('size'), text: getLocaleText(this.parent, 'Size') },
                { id: this.getPupupId('date'), text: getLocaleText(this.parent, 'DateModified') },
                { separator: true },
                { id: this.getPupupId('ascending'), text: getLocaleText(this.parent, 'Ascending'), iconCss: TB_OPTION_TICK },
                { id: this.getPupupId('descending'), text: getLocaleText(this.parent, 'Descending'), }
            ];
            this.buttonObj = new DropDownButton({
                items: items, cssClass: getCssClass(this.parent, ROOT_POPUP),
                select: sortbyClickHandler.bind(this, this.parent),
                enableRtl: this.parent.enableRtl, iconCss: ICON_SHORTBY
            });
            this.buttonObj.appendTo('#' + this.getId('SortBy'));
        }
        if (!isNullOrUndefined(select('#' + this.parent.element.id + VIEW_ID, this.parent.element))) {
            var gridSpan = '<span class="' + ICON_GRID + ' ' + MENU_ICON + '"></span>';
            var largeIconSpan = '<span class="' + ICON_LARGE + ' ' + MENU_ICON + '"></span>';
            var layoutItems = [
                {
                    id: this.getPupupId('large'), text: largeIconSpan + getLocaleText(this.parent, 'View-LargeIcons'),
                    iconCss: this.parent.view === 'Details' ? '' : TB_OPTION_TICK
                },
                {
                    id: this.getPupupId('details'), text: gridSpan + getLocaleText(this.parent, 'View-Details'),
                    iconCss: this.parent.view === 'Details' ? TB_OPTION_TICK : ''
                }
            ];
            this.layoutBtnObj = new DropDownButton({
                iconCss: this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE,
                cssClass: getCssClass(this.parent, 'e-caret-hide ' + ROOT_POPUP),
                items: layoutItems, select: this.layoutChange.bind(this),
                enableRtl: this.parent.enableRtl
            });
            this.layoutBtnObj.appendTo('#' + this.parent.element.id + VIEW_ID);
        }
        this.hideItems(this.default, true);
        this.hideStatus();
    };
    Toolbar$$1.prototype.updateSortByButton = function () {
        var items = this.buttonObj.items;
        for (var itemCount = 0; itemCount < items.length; itemCount++) {
            if (items[itemCount].id === this.getPupupId('name')) {
                items[itemCount].iconCss = this.parent.sortBy === 'name' ? TB_OPTION_DOT : '';
            }
            else if (items[itemCount].id === this.getPupupId('size')) {
                items[itemCount].iconCss = this.parent.sortBy === 'size' ? TB_OPTION_DOT : '';
            }
            else if (items[itemCount].id === this.getPupupId('date')) {
                items[itemCount].iconCss = this.parent.sortBy === 'dateModified' ? TB_OPTION_DOT : '';
            }
            else if (items[itemCount].id === this.getPupupId('ascending')) {
                items[itemCount].iconCss = this.parent.sortOrder === 'Ascending' ? TB_OPTION_TICK : '';
            }
            else if (items[itemCount].id === this.getPupupId('descending')) {
                items[itemCount].iconCss = this.parent.sortOrder === 'Descending' ? TB_OPTION_TICK : '';
            }
        }
    };
    Toolbar$$1.prototype.getPupupId = function (id) {
        return this.parent.element.id + '_ddl_' + id.toLowerCase();
    };
    Toolbar$$1.prototype.layoutChange = function (args) {
        if (this.parent.view === 'Details') {
            if (args.item.id === this.getPupupId('large')) {
                this.updateLayout('LargeIcons');
            }
        }
        else {
            if (args.item.id === this.getPupupId('details')) {
                this.updateLayout('Details');
            }
        }
    };
    Toolbar$$1.prototype.updateLayout = function (view) {
        this.parent.setProperties({ view: view }, true);
        var searchWord;
        if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value === '') {
            this.parent.notify(pathColumn, { args: this.parent });
        }
        if (this.parent.searchSettings.filterType === 'startWith') {
            searchWord = '*' + this.parent.breadcrumbbarModule.searchObj.value;
        }
        else if (this.parent.searchSettings.filterType === 'endsWith') {
            searchWord = this.parent.breadcrumbbarModule.searchObj.value + '*';
        }
        else {
            searchWord = '*' + this.parent.breadcrumbbarModule.searchObj.value + '*';
        }
        if (this.parent.breadcrumbbarModule.searchObj.value.length === 0) {
            read(this.parent, layoutChange, this.parent.path);
        }
        else {
            Search(this.parent, layoutChange, this.parent.path, searchWord, false, false);
        }
    };
    Toolbar$$1.prototype.toolbarItemData = function (data) {
        var items = [];
        var mode = 'Both';
        if (this.parent.isMobile) {
            mode = 'Overflow';
        }
        for (var i = 0; i < data.length; i++) {
            var item = void 0;
            var itemId = this.getId(data[i]);
            var itemText = getLocaleText(this.parent, data[i]);
            var itemTooltip = getLocaleText(this.parent, 'Tooltip-' + data[i]);
            switch (data[i]) {
                case '|':
                    item = { type: 'Separator' };
                    break;
                case 'Upload':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_UPLOAD, showTextOn: mode };
                    break;
                case 'SortBy':
                    var spanElement = '<span class="e-tbar-btn-text e-tbar-ddb-text">' + itemText + '</span>';
                    item = {
                        id: itemId, tooltipText: itemTooltip,
                        template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1">' + spanElement + '</button>',
                    };
                    break;
                case 'Refresh':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_REFRESH, showTextOn: mode };
                    break;
                case 'Selection':
                    var txt = '<span class="e-status">2 ' + itemText + '</span><span class="' + ICON_CLEAR + '"></span>';
                    item = { id: itemId, tooltipText: itemTooltip, overflow: 'Show', align: 'Right', template: txt };
                    break;
                case 'View':
                    var id = this.parent.element.id + VIEW_ID;
                    item = {
                        id: itemId, tooltipText: itemTooltip, prefixIcon: this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE,
                        overflow: 'Show', align: 'Right',
                        template: '<button id="' + id + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1"></button>'
                    };
                    break;
                case 'Details':
                    item = { id: itemId, tooltipText: itemTooltip, prefixIcon: ICON_DETAILS, overflow: 'Show', align: 'Right' };
                    break;
                case 'NewFolder':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_NEWFOLDER, showTextOn: mode };
                    break;
                case 'Cut':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_CUT, showTextOn: mode };
                    break;
                case 'Copy':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_COPY, showTextOn: mode };
                    break;
                case 'Paste':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_PASTE, showTextOn: mode };
                    break;
                case 'Delete':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_DELETE, showTextOn: mode };
                    break;
                case 'Rename':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_RENAME, showTextOn: mode };
                    break;
                case 'Download':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_DOWNLOAD, showTextOn: mode };
                    break;
                case 'SelectAll':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_SELECTALL, showTextOn: mode };
                    break;
                default:
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip };
                    break;
            }
            items.push(item);
        }
        return items;
    };
    Toolbar$$1.prototype.getId = function (id) {
        return this.parent.element.id + '_tb_' + id.toLowerCase();
    };
    Toolbar$$1.prototype.addEventListener = function () {
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(selectionChanged, this.onSelectionChanged, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(showPaste, this.showPaste, this);
        this.parent.on(hidePaste, this.hidePaste, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(sortByChange, this.updateSortByButton, this);
    };
    Toolbar$$1.prototype.reRenderToolbar = function (e) {
        if (e.newProp.toolbarSettings.items !== undefined) {
            this.items = this.toolbarItemData(this.getItems(e.newProp.toolbarSettings.items));
            this.toolbarObj.items = this.items;
            this.toolbarObj.dataBind();
        }
    };
    Toolbar$$1.prototype.onSelectionChanged = function (e) {
        this.hideStatus();
        this.hideItems(this.single, true);
        this.hideItems(this.selection, false);
        if (this.parent.selectedItems.length === 1) {
            this.hideItems(this.single, false);
            this.hideItems(this.selection, true);
        }
        else if (this.parent.selectedItems.length > 1) {
            this.hideItems(this.multiple, false);
            this.hideItems(this.selection, true);
        }
        var ele = select('.' + STATUS, this.toolbarObj.element);
        if (this.parent.selectedItems.length > 0 && ele) {
            if (this.parent.selectedItems.length === 1) {
                ele.textContent = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Item-Selection');
            }
            else {
                ele.textContent = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Items-Selection');
            }
            this.toolbarObj.hideItem(ele.parentElement, false);
        }
    };
    Toolbar$$1.prototype.hideItems = function (tools, toHide) {
        for (var i = 0; i < tools.length; i++) {
            var ele = select('#' + this.getId(tools[i]), this.parent.element);
            if (ele) {
                this.toolbarObj.hideItem(ele.parentElement, toHide);
            }
        }
    };
    Toolbar$$1.prototype.hideStatus = function () {
        var ele = select('.' + STATUS, this.toolbarObj.element);
        if (ele) {
            this.toolbarObj.hideItem(ele.parentElement, true);
        }
    };
    Toolbar$$1.prototype.showPaste = function () {
        this.hideItems(['Paste'], false);
    };
    Toolbar$$1.prototype.hidePaste = function () {
        this.hideItems(['Paste'], true);
    };
    Toolbar$$1.prototype.onLayoutChange = function (args) {
        if (this.layoutBtnObj) {
            this.layoutBtnObj.iconCss = this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE;
            var items = this.layoutBtnObj.items;
            for (var itemCount = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount].id === this.getPupupId('large')) {
                    items[itemCount].iconCss = this.parent.view === 'LargeIcons' ? TB_OPTION_TICK : '';
                }
                else if (items[itemCount].id === this.getPupupId('details')) {
                    items[itemCount].iconCss = this.parent.view === 'Details' ? TB_OPTION_TICK : '';
                }
            }
        }
    };
    Toolbar$$1.prototype.removeEventListener = function () {
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(selectionChanged, this.onSelectionChanged);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(showPaste, this.showPaste);
        this.parent.off(hidePaste, this.hidePaste);
        this.parent.off(destroy, this.destroy);
        this.parent.off(sortByChange, this.updateSortByButton);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Toolbar$$1.prototype.getModuleName = function () {
        return 'toolbar';
    };
    Toolbar$$1.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    if (this.buttonObj) {
                        this.buttonObj.cssClass = getCssClass(this.parent, ROOT_POPUP);
                    }
                    if (this.layoutBtnObj) {
                        this.layoutBtnObj.cssClass = getCssClass(this.parent, 'e-caret-hide ' + ROOT_POPUP);
                    }
                    break;
                case 'height':
                case 'width':
                    this.toolbarObj.refreshOverflow();
                    break;
                case 'toolbarSettings':
                    this.reRenderToolbar(e);
                    break;
                case 'enableRtl':
                    var rtl = e.newProp.enableRtl;
                    this.toolbarObj.enableRtl = rtl;
                    this.toolbarObj.dataBind();
                    if (this.buttonObj) {
                        this.buttonObj.enableRtl = rtl;
                        this.buttonObj.dataBind();
                    }
                    if (this.layoutBtnObj) {
                        this.layoutBtnObj.enableRtl = rtl;
                        this.layoutBtnObj.dataBind();
                    }
                    break;
            }
        }
    };
    /**
     * Destroys the Toolbar module.
     * @method destroy
     * @return {void}
     */
    Toolbar$$1.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
        if (this.layoutBtnObj) {
            this.layoutBtnObj.destroy();
        }
        this.toolbarObj.destroy();
    };
    /**
     * Enables or disables the specified Toolbar items.
     * @param {string[]} items - Specifies an array of items to be enabled or disabled.
     * @param {boolean} isEnable - Determines whether the Toolbar items should to be enabled or disabled.
     */
    Toolbar$$1.prototype.enableItems = function (items, isEnable) {
        for (var i = 0; i < items.length; i++) {
            var ele = select('#' + this.getId(items[i]), this.parent.element);
            if (ele) {
                this.toolbarObj.enableItems(ele.parentElement, isEnable);
            }
        }
    };
    return Toolbar$$1;
}());

/**
 * File Manager actions modules
 */

/**
 * `TreeView` module is used to handle Navigation actions.
 */
var NavigationPane = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the TreeView module
     * @hidden
     */
    function NavigationPane(parent) {
        this.treeNodes = [];
        this.removeNodes = [];
        this.expandTree = false;
        this.parent = parent;
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftF10: 'shift+F10',
            f2: 'f2'
        };
    }
    NavigationPane.prototype.onInit = function (args) {
        if (!isNullOrUndefined(this.treeObj)) {
            return;
        }
        var rootData = getValue('/', this.parent.feParent);
        setValue('icon', 'e-fe-folder', rootData);
        this.rootNode = getValue('name', getValue('/', this.parent.feParent));
        this.treeObj = new TreeView({
            fields: { dataSource: [rootData], id: 'nodeId', text: 'name', hasChildren: 'hasChild', iconCss: 'icon' },
            nodeSelected: this.onNodeSelected.bind(this),
            nodeExpanding: this.onNodeExpand.bind(this),
            allowEditing: true,
            nodeEditing: this.onNodeEditing.bind(this),
            drawNode: this.onDrowNode.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.treeObj.appendTo('#' + this.parent.element.id + TREE_ID);
        this.treeObj.element.style.width = '25%';
        this.parent.persistData = true;
        this.wireEvents();
    };
    NavigationPane.prototype.onDrowNode = function (args) {
        var eventArgs = {
            element: args.node,
            fileDetails: args.nodeData,
            module: 'NavigationPane'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    };
    NavigationPane.prototype.addChild = function (files, target, prevent) {
        var directories = getDirectories(files);
        if (directories.length > 0) {
            var length_1 = 0;
            var folders = directories;
            while (length_1 < directories.length) {
                folders[length_1].icon = 'e-fe-folder';
                length_1++;
            }
            this.treeObj.addNodes(directories, target, null, prevent);
        }
    };
    /**
     * Tree node selection event
     * @private
     */
    NavigationPane.prototype.onNodeSelected = function (args) {
        if (this.parent.breadcrumbbarModule && this.parent.breadcrumbbarModule.searchObj) {
            this.parent.breadcrumbbarModule.searchObj.element.value = '';
        }
        this.parent.searchedItems = [];
        this.parent.activeElements = this.treeObj.element.querySelectorAll('.' + ACTIVE);
        if (!args.isInteracted) {
            return;
        }
        var text = getValue('text', args.nodeData);
        this.activeNode = args.node;
        this.parent.activeModule = 'navigationpane';
        if (!this.parent.persistData) {
            this.parent.selectedItems = [];
        }
        updatePath(args.node, text, this.parent);
        this.expandNodeTarget = null;
        if (args.node.querySelector('.' + ICONS) && args.node.querySelector('.' + LIST_ITEM) === null) {
            this.expandNodeTarget = 'add';
        }
        this.parent.itemData = this.treeObj.getTreeData(getValue('id', args.nodeData));
        read(this.parent, pathChanged, this.parent.path);
        this.parent.visitedItem = args.node;
    };
    /**
     * Tree node expand event
     * @private
     */
    /* istanbul ignore next */
    NavigationPane.prototype.onNodeExpand = function (args) {
        if (!args.isInteracted) {
            return;
        }
        var path = getPath(args.node, getValue('text', args.nodeData));
        if (args.node.querySelector('.' + LIST_ITEM) === null) {
            this.expandNodeTarget = args.node.getAttribute('data-uid');
            this.parent.expandedId = this.expandNodeTarget;
            this.parent.itemData = this.treeObj.getTreeData(getValue('id', args.nodeData));
            read(this.parent, nodeExpand, path);
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onNodeExpanded = function (args) {
        this.addChild(args.files, this.expandNodeTarget, false);
        this.parent.expandedId = null;
    };
    NavigationPane.prototype.onNodeEditing = function (args) {
        if (!isNullOrUndefined(args.innerHtml)) {
            args.cancel = true;
        }
    };
    NavigationPane.prototype.onPathChanged = function (args) {
        var currFiles = getValue(this.parent.path, this.parent.feFiles);
        if (this.expandNodeTarget === 'add') {
            var sNode = select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
            var ul = select('.' + LIST_PARENT, sNode);
            if (isNullOrUndefined(ul)) {
                this.addChild(args.files, this.treeObj.selectedNodes[0], true);
            }
            this.expandNodeTarget = '';
        }
        if (isNullOrUndefined(currFiles)) {
            setValue(this.parent.path, args.files, this.parent.feFiles);
        }
    };
    NavigationPane.prototype.updateTree = function (args) {
        var id = this.treeObj.selectedNodes[0];
        var toExpand = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
        this.removeChildNodes(id);
        setValue(this.parent.path, args.files, this.parent.feFiles);
        this.addChild(args.files, id, !toExpand);
    };
    NavigationPane.prototype.removeChildNodes = function (id) {
        var sNode = select('[data-uid="' + id + '"]', this.treeObj.element);
        var parent = select('.' + LIST_PARENT, sNode);
        var childs = parent ? Array.prototype.slice.call(parent.children) : null;
        this.treeObj.removeNodes(childs);
    };
    NavigationPane.prototype.onOpenEnd = function (args) {
        var sleId = this.parent.pathId[this.parent.pathId.length - 1];
        this.treeObj.expandAll(this.treeObj.selectedNodes);
        this.treeObj.selectedNodes = [sleId];
        this.expandNodeTarget = 'add';
        this.onPathChanged(args);
    };
    NavigationPane.prototype.onOpenInit = function (args) {
        if (this.parent.activeModule === 'navigationpane') {
            if (args.target.querySelector('.' + ICONS)) {
                this.treeObj.expandAll(this.treeObj.selectedNodes);
            }
        }
    };
    NavigationPane.prototype.onInitialEnd = function (args) {
        this.onInit(args);
        this.addChild(args.files, getValue('nodeId', args.cwd), false);
    };
    NavigationPane.prototype.onFinalizeEnd = function (args) {
        this.onInit(args);
        var id = getValue('nodeId', args.cwd);
        this.removeChildNodes(id);
        this.addChild(args.files, id, false);
        this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
    };
    NavigationPane.prototype.onCreateEnd = function (args) {
        this.updateTree(args);
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDeleteEnd = function (args) {
        if (this.parent.activeModule === 'navigationpane') {
            var selectedNode = this.treeObj.selectedNodes[0];
            var selcetedEle = select('[data-uid="' + selectedNode + '"]', this.treeObj.element);
            var selectedNodeEle = closest(selcetedEle, '.' + LIST_PARENT).parentElement;
            this.treeObj.selectedNodes = [selectedNodeEle.getAttribute('data-uid')];
            this.treeObj.dataBind();
        }
        this.updateTree(args);
    };
    NavigationPane.prototype.onRefreshEnd = function (args) {
        this.updateTree(args);
    };
    NavigationPane.prototype.onRenameInit = function () {
        if (this.parent.selectedItems.length === 0) {
            this.updateRenameData();
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onRenameEnd = function (args) {
        var resultData = new DataManager(this.treeObj.getTreeData()).
            executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
        if (resultData[0]) {
            this.treeObj.updateNode(resultData[0][this.treeObj.fields.id].toString(), this.parent.renameText);
        }
    };
    NavigationPane.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'enableRtl':
                    if (this.treeObj) {
                        this.treeObj.enableRtl = e.newProp.enableRtl;
                        this.treeObj.dataBind();
                    }
                    break;
                case 'navigationPaneSettings':
                    read(this.parent, finalizeEnd, '/');
                    break;
            }
        }
    };
    /* istanbul ignore next */
    NavigationPane.prototype.onDownLoadInit = function () {
        this.updateActionData();
    };
    NavigationPane.prototype.onSelectionChanged = function (e) {
        this.treeObj.selectedNodes = [e.selectedNode];
    };
    NavigationPane.prototype.onClearPathInit = function (e) {
        this.removeChildNodes(e.selectedNode);
    };
    NavigationPane.prototype.addEventListener = function () {
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(downloadInit, this.onDownLoadInit, this);
        this.parent.on(initialEnd, this.onInitialEnd, this);
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(nodeExpand, this.onNodeExpanded, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(updateTreeSelection, this.onSelectionChanged, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(openEnd, this.onOpenEnd, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onRenameEnd, this);
        this.parent.on(clearPathInit, this.onClearPathInit, this);
    };
    NavigationPane.prototype.removeEventListener = function () {
        this.parent.off(initialEnd, this.onInitialEnd);
        this.parent.off(downloadInit, this.onDownLoadInit);
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(updateTreeSelection, this.onSelectionChanged);
        this.parent.off(nodeExpand, this.onNodeExpanded);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(openEnd, this.onOpenEnd);
        this.parent.off(destroy, this.destroy);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onRefreshEnd);
        this.parent.off(clearPathInit, this.onClearPathInit);
        this.parent.off(deleteEnd, this.onDeleteEnd);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    NavigationPane.prototype.getModuleName = function () {
        return 'navigationpane';
    };
    /**
     * Destroys the TreeView module.
     * @method destroy
     * @return {void}
     */
    NavigationPane.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.treeObj) {
            this.unWireEvents();
            this.treeObj.destroy();
        }
    };
    NavigationPane.prototype.wireEvents = function () {
        this.keyboardModule = new KeyboardEvents(this.treeObj.element, {
            keyAction: this.keyDown.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    NavigationPane.prototype.unWireEvents = function () {
        this.keyboardModule.destroy();
    };
    /* istanbul ignore next */
    NavigationPane.prototype.keyDown = function (e) {
        var action = e.action;
        var fileObj = this.parent;
        switch (action) {
            case 'altEnter':
                this.parent.getDetails();
                break;
            case 'esc':
                removeBlur(this.parent);
                this.parent.selectedNodes = [];
                this.treeNodes = [];
                break;
            case 'del':
                this.removeNodes = [];
                createDialog(this.parent, 'Delete');
                break;
            case 'ctrlC':
                copyFiles(this.parent);
                fileObj.fileOperation(this.parent.nodeNames);
                this.copyNodes = this.parent.nodeNames;
                break;
            case 'ctrlV':
                fileObj.pasteHandler();
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                fileObj.fileOperation(this.parent.nodeNames);
                break;
            case 'shiftF10':
                Download(this.parent, this.parent.detailsviewModule.gridObj.getSelectedRecords());
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 0) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
        }
    };
    NavigationPane.prototype.updateRenameData = function () {
        this.updateActionData();
        this.parent.currentItemText = getValue('name', this.parent.itemData[0]);
    };
    NavigationPane.prototype.updateActionData = function () {
        var data = this.treeObj.getTreeData(this.treeObj.selectedNodes[0])[0];
        this.parent.itemData = [data];
        this.parent.isFile = false;
    };
    /**
     * Move tree folders on cut operation
     * @public
     */
    NavigationPane.prototype.moveNode = function () {
        this.treeObj.moveNodes(this.treeNodes, this.treeObj.selectedNodes[0], null);
        var fileObj = this.parent;
        removeBlur(this.parent);
        this.treeNodes = [];
    };
    /**
     * Remove tree folders on delete operation
     * @public
     */
    /* istanbul ignore next */
    NavigationPane.prototype.removeNode = function () {
        this.treeObj.removeNodes(this.removeNodes);
        var fileObj = this.parent;
        removeBlur(this.parent);
        this.removeNodes = [];
    };
    /**
     * Add tree folders on copy operation
     * @public
     */
    NavigationPane.prototype.copyNode = function () {
        this.treeObj.addNodes(this.copyNodes, this.activeNode, null);
        var fileObj = this.parent;
        removeBlur(this.parent);
    };
    return NavigationPane;
}());

Grid.Inject(Resize, ContextMenu$1, Sort, VirtualScroll);
/**
 * GridView module
 */
var DetailsView = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the GridView module
     * @hidden
     */
    function DetailsView(parent) {
        this.isInteracted = true;
        this.pasteOperation = false;
        this.uploadOperation = false;
        this.count = 0;
        this.isRendered = true;
        this.parent = parent;
        this.element = select('#' + this.parent.element.id + GRID_ID, this.parent.element);
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            tab: 'tab',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftdel: 'shift+delete',
            shiftF10: 'shift+F10',
            f2: 'f2',
            ctrlA: 'ctrl+a',
            enter: 'enter'
        };
    }
    // tslint:disable-next-line
    DetailsView.prototype.render = function (args) {
        if (this.parent.view === 'Details') {
            removeClass([this.parent.element], MULTI_SELECT);
            var items = getSortedData(this.parent, args.files);
            var columns = this.getColumns();
            var sortSettings = void 0;
            if (this.parent.isMobile) {
                sortSettings = [];
            }
            else {
                sortSettings = [{ direction: this.parent.sortOrder, field: this.parent.sortBy }];
            }
            this.gridObj = new Grid({
                dataSource: items,
                allowSorting: true,
                rowSelected: this.onSelected.bind(this),
                rowDeselected: this.onDeSelection.bind(this),
                allowResizing: this.parent.detailsViewSettings.columnResizing,
                selectionSettings: {
                    type: this.parent.allowMultiSelection ? 'Multiple' : 'Single',
                    checkboxMode: 'ResetOnRowClick'
                },
                enableRtl: this.parent.enableRtl,
                pageSettings: { pageSize: 20 },
                sortSettings: { allowUnsort: false, columns: sortSettings },
                columns: columns,
                recordDoubleClick: this.DblClickEvents.bind(this),
                beforeDataBound: this.onBeforeDataBound.bind(this),
                dataBound: this.onDataBound.bind(this),
                rowDataBound: this.onRowDataBound.bind(this),
                actionBegin: this.onActionBegin.bind(this),
                headerCellInfo: this.onHeaderCellInfo.bind(this),
                width: '100%'
            });
            this.gridObj.appendTo('#' + this.parent.element.id + GRID_ID);
            this.wireEvents();
            this.adjustHeight();
            // tslint:disable-next-line
            this.gridObj.defaultLocale.EmptyRecord = '';
            this.emptyArgs = args;
        }
    };
    DetailsView.prototype.getColumns = function () {
        var columns;
        if (this.parent.isMobile) {
            columns = [
                {
                    field: 'name', headerText: getLocaleText(this.parent, 'Name'), width: 'auto', minWidth: 120, headerTextAlign: 'Left',
                    template: '<div class="e-fe-text">${name}</div><div class="e-fe-date">${dateModified}</div>' +
                        '<span class="e-fe-size">${size}</span>'
                },
            ];
        }
        else {
            columns = JSON.parse(JSON.stringify(this.parent.detailsViewSettings.columns));
            for (var i = 0, len = columns.length; i < len; i++) {
                columns[i].headerText = getLocaleText(this.parent, columns[i].headerText);
            }
        }
        var iWidth = ((this.parent.isMobile || this.parent.isBigger) ? '54' : '46');
        var icon = {
            field: 'type', width: iWidth, minWidth: iWidth, template: '<span class="e-fe-icon ${iconClass}"></span>',
            allowResizing: false, allowSorting: true, customAttributes: { class: 'e-fe-grid-icon' },
            headerTemplate: '<span class="e-fe-icon e-fe-folder"></span>',
        };
        columns.unshift(icon);
        if (this.parent.allowMultiSelection) {
            var cWidth = (this.parent.isBigger ? '36' : '26');
            var cBox = {
                type: 'checkbox', width: cWidth, minWidth: cWidth, customAttributes: { class: 'e-fe-checkbox' },
                allowResizing: false, allowSorting: false
            };
            if (this.parent.isMobile) {
                columns.push(cBox);
            }
            else {
                columns.unshift(cBox);
            }
        }
        return columns;
    };
    DetailsView.prototype.adjustHeight = function () {
        if (!this.gridObj) {
            return;
        }
        var pane = select('#' + this.parent.element.id + CONTENT_ID, this.parent.element);
        var bar = select('#' + this.parent.element.id + BREADCRUMBBAR_ID, this.parent.element);
        var gridHeader = select('.' + GRID_HEADER, this.parent.element);
        var height = (pane.offsetHeight - bar.offsetHeight - gridHeader.offsetHeight);
        this.gridObj.height = height;
        this.gridObj.dataBind();
    };
    DetailsView.prototype.renderCheckBox = function () {
        this.gridObj.columns = this.getColumns();
        this.gridObj.refreshColumns();
    };
    DetailsView.prototype.onRowDataBound = function (args) {
        /* istanbul ignore next */
        if (!this.parent.showFileExtension && getValue('isFile', args.data)) {
            var textEle = args.row.querySelector('.e-fe-text');
            var name_1 = getValue('name', args.data);
            var type = getValue('type', args.data);
            textEle.innerHTML = name_1.substr(0, name_1.length - type.length);
        }
        if (getValue('size', args.data) !== undefined && args.row.querySelector('.e-fe-size')) {
            var sizeEle = args.row.querySelector('.e-fe-size');
            var modifiedSize = void 0;
            if (!getValue('isFile', args.data)) {
                modifiedSize = '';
            }
            else {
                var sizeValue = getValue('size', args.data);
                if ((sizeValue / 1024) === 0) {
                    modifiedSize = '0 KB';
                }
                else {
                    var intl = new Internationalization();
                    var value = intl.formatNumber((sizeValue / 1024), { format: 'n' });
                    modifiedSize = value + ' KB';
                }
            }
            sizeEle.innerHTML = modifiedSize;
        }
        if (this.parent.isMobile) {
            if (getValue('dateModified', args.data) !== undefined && args.row.querySelector('.e-fe-date')) {
                var dateEle = args.row.querySelector('.e-fe-date');
                var intl = new Internationalization();
                var columns = this.parent.detailsViewSettings.columns;
                var format = void 0;
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].field === 'dateModified') {
                        format = columns[i].format;
                        break;
                    }
                }
                var formattedString = intl.formatDate(new Date(getValue('dateModified', args.data)), format);
                dateEle.innerHTML = formattedString;
            }
        }
        var checkWrap = args.row.querySelector('.' + CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
        var eventArgs = {
            element: args.row,
            fileDetails: args.data,
            module: 'DetailsView'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    };
    DetailsView.prototype.onActionBegin = function (args) {
        if (args.requestType === 'sorting') {
            this.parent.sortOrder = args.direction;
            this.parent.sortBy = args.columnName;
            if (this.parent.selectedItems.length !== 0) {
                this.sortItem = true;
                var rows = this.gridObj.getSelectedRowIndexes();
                var len = rows.length;
                this.sortSelectedNodes = [];
                while (len > 0) {
                    var data = this.gridObj.getRowsObject()[rows[len - 1]].data;
                    this.sortSelectedNodes.push(getValue('name', data));
                    len--;
                }
            }
            this.parent.notify(sortByChange, {});
        }
    };
    DetailsView.prototype.onHeaderCellInfo = function (args) {
        var checkWrap = args.node.querySelector('.' + CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
    };
    DetailsView.prototype.onBeforeDataBound = function (args) {
        var items = getSortedData(this.parent, this.gridObj.dataSource);
        args.result = items;
    };
    DetailsView.prototype.maintainBlur = function () {
        var length = 0;
        var records = this.gridObj.getCurrentViewRecords();
        for (length; length < records.length; length++) {
            var nodeEle = this.gridObj.getDataRows()[length];
            var name_2 = nodeEle.querySelector('.' + TEMPLATE_CELL).textContent;
            if (this.parent.selectedNodes.indexOf(name_2) !== -1) {
                var node = selectAll('.' + ROWCELL, nodeEle);
                var nodeLength = 0;
                while (nodeLength < node.length) {
                    addBlur(node[nodeLength]);
                    nodeLength++;
                }
            }
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.onDataBound = function (args) {
        if (this.parent.selectedItems.length !== 0) {
            this.selectedItem = true;
        }
        if (this.pasteOperation === true || this.selectedItem === true) {
            var selectedNodes = (this.selectedItem !== true) ? this.parent.selectedNodes : this.parent.selectedItems;
            this.selectRecords(selectedNodes);
            this.pasteOperation = ((this.selectedItem !== true)) ? false : this.pasteOperation;
            this.selectedItem = false;
        }
        if (this.parent.cutNodes && this.parent.cutNodes.length !== 0) {
            this.maintainBlur();
        }
        if (this.parent.createdItem) {
            this.selectRecords([getValue('name', this.parent.createdItem)]);
            this.parent.createdItem = null;
        }
        if (this.parent.renamedItem) {
            this.selectRecords([getValue('name', this.parent.renamedItem)]);
            this.parent.renamedItem = null;
        }
        if (this.sortItem === true) {
            this.selectRecords(this.sortSelectedNodes);
            this.sortItem = false;
        }
        if (this.parent.allowMultiSelection && this.parent.singleSelection !== undefined) {
            this.selectRecords([this.parent.singleSelection]);
        }
        if (!this.parent.allowMultiSelection && this.parent.singleSelection !== undefined) {
            this.selectRecords([this.parent.singleSelection]);
        }
        if (this.uploadOperation === true) {
            this.count++;
            this.selectRecords(this.parent.uploadItem);
            if (this.count === this.parent.uploadItem.length) {
                this.uploadOperation = false;
                this.parent.uploadItem = [];
            }
        }
        if (this.gridObj.currentViewData.length * this.gridObj.getRowHeight() < this.gridObj.height) {
            var hdTable = this.gridObj.getHeaderContent();
            hdTable.style.paddingRight = '';
            hdTable.style.paddingLeft = '';
            var hdContent = select('.e-headercontent', hdTable);
            hdContent.style.borderRightWidth = '0';
            var cnTable = this.gridObj.getContent().querySelector('.e-content');
            cnTable.style.overflowY = '';
            cnTable.classList.add('e-scrollShow');
        }
        else {
            var hdTable = this.gridObj.getHeaderContent();
            if (!this.parent.enableRtl) {
                hdTable.style.paddingRight = '16px';
            }
            else {
                hdTable.style.paddingLeft = '16px';
            }
            var cnTable = this.gridObj.getContent().querySelector('.e-content');
            cnTable.classList.remove('e-scrollShow');
        }
        this.isRendered = true;
        this.checkEmptyDiv(this.emptyArgs);
    };
    DetailsView.prototype.selectRecords = function (nodes) {
        var gridRecords = this.gridObj.getCurrentViewRecords();
        var sRecords = [];
        for (var i = 0, len = gridRecords.length; i < len; i++) {
            if (nodes.indexOf(getValue('name', gridRecords[i])) !== -1) {
                sRecords.push(i);
            }
        }
        if (sRecords.length !== 0) {
            this.gridObj.selectRows(sRecords);
        }
    };
    DetailsView.prototype.onSortColumn = function (args) {
        this.gridObj.sortModule.sortColumn(this.parent.sortBy, this.parent.sortOrder);
    };
    DetailsView.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'detailsViewSettings':
                    if (!isNullOrUndefined(this.gridObj)) {
                        var columns = this.getColumns();
                        this.gridObj.columns = columns;
                        this.gridObj.allowResizing = this.parent.detailsViewSettings.columnResizing;
                        this.gridObj.dataBind();
                        this.gridObj.refreshColumns();
                    }
                    break;
                case 'selectedItems':
                    if (this.parent.selectedItems.length !== 0) {
                        this.selectRecords(this.parent.selectedItems);
                    }
                    else if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.clearSelection();
                    }
                    break;
                case 'enableRtl':
                    if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.enableRtl = e.newProp.enableRtl;
                        this.gridObj.dataBind();
                    }
                    break;
                case 'showFileExtension':
                    read(this.parent, pathChanged, this.parent.path);
                    break;
                case 'showHiddenItems':
                    read(this.parent, pathChanged, this.parent.path);
                    break;
                case 'allowMultiSelection':
                    if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.selectionSettings.type = e.newProp.allowMultiSelection ? 'Multiple' : 'Single';
                        this.renderCheckBox();
                    }
                    break;
                case 'view':
                    read(this.parent, layoutChange, this.parent.path);
                    break;
            }
        }
    };
    DetailsView.prototype.onPathChanged = function (args) {
        if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() === '' && this.gridObj) {
            this.parent.searchedItems = [];
            var len = this.gridObj.columns.length;
            // tslint:disable-next-line
            var column = JSON.parse(JSON.stringify(this.gridObj.columns));
            if (column[len - 1].field) {
                if (column[len - 1].field === 'filterPath') {
                    this.gridObj.columns.pop();
                    this.gridObj.refreshColumns();
                }
            }
        }
        removeBlur(this.parent);
        if (!this.parent.persistData) {
            this.parent.setProperties({ selectedItems: [] }, true);
        }
        if (this.parent.view === 'Details') {
            /* istanbul ignore next */
            if (!this.parent.persistData) {
                this.parent.setProperties({ selectedItems: [] }, true);
            }
            else {
                this.isInteracted = false;
            }
            this.parent.persistData = false;
            this.parent.cutNodes = [];
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(searchTextChange, args);
        }
        this.emptyArgs = args;
    };
    DetailsView.prototype.checkEmptyDiv = function (args) {
        var items = getSortedData(this.parent, args.files);
        if (items.length === 0 && !isNullOrUndefined(this.element.querySelector('.' + GRID_VIEW))) {
            createEmptyElement(this.parent, getValue('name', args), this.element);
        }
        else if (items.length !== 0 && this.element.querySelector('.' + EMPTY)) {
            if (this.element.querySelector('.' + GRID_VIEW).querySelector('.' + EMPTY)) {
                var emptyDiv = this.element.querySelector('.' + GRID_VIEW).querySelector('.' + EMPTY);
                this.element.querySelector('.' + GRID_VIEW).removeChild(emptyDiv);
            }
            else {
                this.element.removeChild(this.element.querySelector('.' + EMPTY));
            }
        }
    };
    DetailsView.prototype.onOpenInit = function (args) {
        if (this.parent.activeModule === 'detailsview') {
            var data = this.gridObj.getSelectedRecords()[0];
            this.openContent(data);
        }
    };
    /**
     * Triggers when double click on the grid record
     * @public
     */
    DetailsView.prototype.DblClickEvents = function (args) {
        this.gridObj.selectRows([args.rowIndex]);
        var data;
        if (args.rowData) {
            data = JSON.parse(JSON.stringify(args.rowData));
            this.openContent(data);
        }
    };
    DetailsView.prototype.openContent = function (data) {
        var eventArgs = { cancel: false, fileDetails: data };
        this.parent.trigger('beforeFileOpen', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (getValue('isFile', data)) {
            var icon = fileType(data);
            if (icon === ICON_IMAGE) {
                var name_3 = getValue('name', data);
                var imgUrl = getImageUrl(this.parent, data);
                createImageDialog(this.parent, name_3, imgUrl);
            }
        }
        else {
            var val = this.parent.breadcrumbbarModule.searchObj.element.value;
            if (val === '') {
                var newPath = this.parent.path + getValue('name', data) + '/';
                this.parent.setProperties({ path: newPath }, true);
                this.parent.pathId.push(getValue('nodeId', data));
                this.parent.itemData = [data];
                openAction(this.parent);
            }
            else {
                openSearchFolder(this.parent, data);
            }
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.onLayoutChange = function (args) {
        if (this.parent.view === 'Details') {
            if (!this.gridObj) {
                this.render(args);
            }
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(hideLayout, {});
            this.gridObj.element.classList.remove(DISPLAY_NONE);
            this.isInteracted = false;
            this.gridObj.clearSelection();
            if (this.parent.selectedItems) {
                this.selectedItem = true;
            }
            if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() !== '') {
                this.onSearchFiles(args);
            }
            this.adjustHeight();
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.onSearchFiles = function (args) {
        if (this.parent.view === 'Details') {
            var len = this.gridObj.columns.length;
            // tslint:disable-next-line
            var column = JSON.parse(JSON.stringify(this.gridObj.columns));
            if (column[len - 1].field) {
                if (column[len - 1].field === 'filterPath') {
                    this.gridObj.columns.pop();
                }
            }
            var item = { field: 'filterPath', headerText: 'path', minWidth: 180 };
            if (!this.parent.isMobile) {
                this.gridObj.columns.push(item);
            }
            this.gridObj.refreshColumns();
            this.parent.searchedItems = args.files;
            this.onPathChanged(args);
        }
    };
    DetailsView.prototype.changeData = function (args) {
        this.isInteracted = false;
        this.gridObj.dataSource = getSortedData(this.parent, args.files);
        if (this.parent.selectedItems) {
            this.selectedItem = true;
        }
    };
    DetailsView.prototype.onFinalizeEnd = function (args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        if (!this.gridObj) {
            this.render(args);
            this.parent.notify(searchTextChange, args);
        }
        else {
            this.onPathChanged(args);
        }
    };
    DetailsView.prototype.onCreateEnd = function (args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.onPathChanged(args);
    };
    DetailsView.prototype.onRenameInit = function () {
        if (this.parent.view === 'Details' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.onDeleteEnd = function (args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.onPathChanged(args);
        this.parent.setProperties({ selectedItems: [] }, true);
    };
    DetailsView.prototype.onRefreshEnd = function (args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.changeData(args);
    };
    DetailsView.prototype.onHideLayout = function (args) {
        if (this.parent.view !== 'Details' && this.gridObj) {
            this.gridObj.element.classList.add(DISPLAY_NONE);
        }
    };
    DetailsView.prototype.onSelectAllInit = function () {
        if (this.parent.view === 'Details') {
            this.isInteracted = false;
            this.gridObj.selectionModule.selectRowsByRange(0, this.gridObj.getRows().length);
            this.isInteracted = true;
        }
    };
    DetailsView.prototype.onClearAllInit = function () {
        if (this.parent.view === 'Details') {
            this.removeSelection();
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.onSelectionChanged = function () {
        removeClass([this.element], HEADER_CHECK);
        if (this.parent.selectedItems.length > 0) {
            addClass([this.element], HEADER_CHECK);
        }
    };
    DetailsView.prototype.onBeforeRequest = function () {
        this.isRendered = false;
    };
    DetailsView.prototype.onAfterRequest = function (args) {
        this.isRendered = true;
    };
    DetailsView.prototype.addEventListener = function () {
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(search, this.onSearchFiles, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onPathChanged, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(sortColumn, this.onSortColumn, this);
        this.parent.on(openEnd, this.onPathChanged, this);
        this.parent.on(hideLayout, this.onHideLayout, this);
        this.parent.on(selectAllInit, this.onSelectAllInit, this);
        this.parent.on(clearAllInit, this.onClearAllInit, this);
        this.parent.on(pathColumn, this.onPathColumn, this);
        this.parent.on(selectionChanged, this.onSelectionChanged, this);
        this.parent.on(beforeRequest, this.onBeforeRequest, this);
        this.parent.on(afterRequest, this.onAfterRequest, this);
    };
    DetailsView.prototype.removeEventListener = function () {
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(destroy, this.destroy);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(search, this.onSearchFiles);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onPathChanged);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(sortColumn, this.onSortColumn);
        this.parent.off(openEnd, this.onPathChanged);
        this.parent.off(hideLayout, this.onHideLayout);
        this.parent.off(selectAllInit, this.onSelectAllInit);
        this.parent.off(clearAllInit, this.onClearAllInit);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(pathColumn, this.onPathColumn);
        this.parent.off(selectionChanged, this.onSelectionChanged);
        this.parent.off(beforeRequest, this.onBeforeRequest);
        this.parent.off(afterRequest, this.onAfterRequest);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    DetailsView.prototype.getModuleName = function () {
        return 'detailsview';
    };
    /**
     * Destroys the GridView module.
     * @method destroy
     * @return {void}
     */
    DetailsView.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.gridObj) {
            this.unWireEvents();
            this.gridObj.destroy();
        }
    };
    /**
     * Grid row selected event
     * @private
     */
    /* istanbul ignore next */
    DetailsView.prototype.onSelected = function (args) {
        this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + ACTIVE);
        this.parent.activeModule = 'detailsview';
        this.selectedRecords();
        this.parent.notify(selectionChanged, {});
        this.triggerSelect('select', args);
        if (this.parent.allowMultiSelection) {
            var rows = this.gridObj.getSelectedRowIndexes();
            var len = rows.length;
            if (len > 1) {
                var data = this.gridObj.getRowsObject()[rows[len - 1]].data;
                this.parent.currentItemText = getValue('name', data);
            }
        }
        if (this.parent.selectedItems.length === 1) {
            var data = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
            this.parent.currentItemText = getValue('name', data);
        }
        var indexes = getValue('rowIndexes', args);
        var multiSelect = getValue('enableSelectMultiTouch', this.gridObj.selectionModule);
        if (this.parent.isDevice && isNullOrUndefined(indexes) && args.target && !multiSelect && !args.target.closest('.e-headercell')) {
            this.parent.isFile = getValue('isFile', args.data);
            if (!this.parent.isFile) {
                this.openContent(args.data);
            }
        }
        this.parent.visitedItem = args.row;
    };
    /* istanbul ignore next */
    DetailsView.prototype.onPathColumn = function (args) {
        if (this.parent.view === 'Details') {
            var len = this.gridObj.columns.length;
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
                // tslint:disable-next-line
                var column = JSON.parse(JSON.stringify(this.gridObj.columns));
                if (column[len - 1].field) {
                    if (column[len - 1].field === 'filterPath') {
                        this.gridObj.columns.pop();
                        this.gridObj.refreshColumns();
                    }
                }
            }
        }
    };
    DetailsView.prototype.selectedRecords = function () {
        this.parent.setProperties({ selectedItems: [] }, true);
        var selectedRecords = this.gridSelectNodes();
        var selectSize = 0;
        while (selectSize < selectedRecords.length) {
            var record = selectedRecords[selectSize];
            this.parent.selectedItems.push(record.name);
            selectSize++;
        }
    };
    /**
     * Grid row de-selected event
     * @private
     */
    DetailsView.prototype.onDeSelection = function (args) {
        if (!this.isInteracted) {
            this.isInteracted = true;
            return;
        }
        if (this.parent.activeElements[0].querySelector('.' + ROWCELL)) {
            this.selectedRecords();
            this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + ACTIVE);
        }
        var data = args.data;
        for (var i = 0, len = data.length; i < len; i++) {
            var index = this.parent.selectedItems.indexOf(getValue('name', data[i]));
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
            }
        }
        if (this.parent.selectedItems.length === 0) {
            setValue('enableSelectMultiTouch', false, this.gridObj.selectionModule);
            removeClass([this.parent.element], MULTI_SELECT);
        }
        this.parent.notify(selectionChanged, {});
        this.triggerSelect('unselect', args);
        this.parent.visitedItem = null;
    };
    DetailsView.prototype.triggerSelect = function (action, args) {
        var eventArgs = { action: action, fileDetails: args.data };
        this.parent.trigger('fileSelect', eventArgs);
    };
    DetailsView.prototype.wireEvents = function () {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(this.gridObj.element, {
            keyAction: this.keyDown.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keyup',
        });
        EventHandler.add(this.gridObj.element, 'focus', this.removeSelection, this);
    };
    DetailsView.prototype.unWireEvents = function () {
        this.wireClickEvent(false);
        this.keyboardModule.destroy();
        EventHandler.remove(this.gridObj.element, 'focus', this.removeSelection);
    };
    DetailsView.prototype.wireClickEvent = function (toBind) {
        if (toBind) {
            var proxy_1 = this;
            var ele = this.gridObj.getContent();
            this.clickObj = new Touch(ele, {
                tapHold: function (e) {
                    if (proxy_1.parent.isDevice) {
                        e.originalEvent.preventDefault();
                        if (proxy_1.parent.allowMultiSelection) {
                            setValue('enableSelectMultiTouch', proxy_1.parent.allowMultiSelection, proxy_1.gridObj.selectionModule);
                            addClass([proxy_1.parent.element], MULTI_SELECT);
                        }
                        var target = e.originalEvent.target;
                        if (target) {
                            var row = closest(target, '.' + ROW);
                            var index = proxy_1.gridObj.getRows().indexOf(row);
                            proxy_1.gridObj.selectRow(index);
                        }
                    }
                }
            });
        }
        else {
            if (this.clickObj) {
                this.clickObj.destroy();
            }
        }
    };
    /* istanbul ignore next */
    DetailsView.prototype.removeSelection = function () {
        removeClass([this.parent.element], MULTI_SELECT);
        this.gridObj.clearSelection();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.parent.notify(selectionChanged, {});
    };
    /**
     * Grid keyDown event
     * @private
     */
    /* istanbul ignore next */
    DetailsView.prototype.keyDown = function (e) {
        if (!this.isRendered) {
            return;
        }
        e.preventDefault();
        var action = e.action;
        switch (action) {
            case 'altEnter':
                this.parent.getDetails();
                break;
            case 'esc':
                removeBlur(this.parent);
                this.parent.selectedNodes = [];
                if (this.parent.navigationpaneModule) {
                    this.parent.navigationpaneModule.treeNodes = [];
                }
                break;
            case 'del':
            case 'shiftdel':
                if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'enter':
                if (this.gridObj.selectedRowIndex === -1) {
                    break;
                }
                var rowData = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
                if (rowData) {
                    var data_1 = JSON.parse(JSON.stringify(rowData));
                    this.openContent(data_1);
                }
                break;
            case 'ctrlC':
                removeBlur(this.parent);
                this.parent.navigationpaneModule.treeNodes = [];
                this.parent.navigationpaneModule.copyNodes = [];
                this.parent.cutNodes = [];
                this.parent.selectedNodes = [];
                this.parent.targetPath = this.parent.path;
                treeNodes(this.parent.navigationpaneModule, this.gridSelectNodes(), 'copy');
                this.parent.fileAction = 'CopyTo';
                this.parent.enablePaste = true;
                this.parent.notify(showPaste, {});
                this.parent.fileOperation(this.gridSelectNodes());
                break;
            case 'ctrlV':
                this.parent.pasteHandler();
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                this.parent.fileOperation(this.parent.nodeNames);
                break;
            case 'shiftF10':
                Download(this.parent, this.gridSelectNodes());
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 1) {
                    this.updateRenameData();
                    createDialog(this.parent, 'Rename');
                }
                break;
            case 'ctrlA':
                var data = [this.gridObj.getSelectedRecords()[0]];
                this.parent.currentItemText = getValue('name', data[0]);
                break;
            case 'tab':
                var selectedItems = getSortedData(this.parent, this.gridObj.dataSource);
                this.parent.selectedItems = [getValue('name', selectedItems[0])];
                this.selectRecords([getValue('name', selectedItems[0])]);
                break;
        }
    };
    /**
     * Get selected grid records
     * @public
     */
    DetailsView.prototype.gridSelectNodes = function () {
        return this.gridObj.getSelectedRecords();
    };
    DetailsView.prototype.updateRenameData = function () {
        var data = this.gridSelectNodes()[0];
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
    };
    return DetailsView;
}());

/**
 * File Manager layout modules
 */

/**
 * File Manager pop-up modules
 */

/**
 * File Manager modules
 */

/**
 * File Manager all modules
 */

export { AjaxSettings, toolbarItems, ToolbarSettings, SearchSettings, columnArray, DetailsViewSettings, fileItems, folderItems, layoutItems, ContextMenuSettings, NavigationPaneSettings, UploadSettings, TOOLBAR_ID, LAYOUT_ID, TREE_ID, GRID_ID, LARGEICON_ID, DIALOG_ID, ALT_DIALOG_ID, IMG_DIALOG_ID, EXTN_DIALOG_ID, UPLOAD_DIALOG_ID, CONTEXT_MENU_ID, SORTBY_ID, VIEW_ID, SPLITTER_ID, CONTENT_ID, BREADCRUMBBAR_ID, UPLOAD_ID, SEARCH_ID, ROOT, CONTROL, CHECK_SELECT, ROOT_POPUP, MOBILE, MULTI_SELECT, FILTER, LAYOUT, LAYOUT_CONTENT, LARGE_ICONS, TB_ITEM, LIST_ITEM, LIST_TEXT, LIST_PARENT, TB_OPTION_TICK, TB_OPTION_DOT, BLUR, ACTIVE, HOVER, FOCUS, CHECK, FRAME, CB_WRAP, ROW, ROWCELL, EMPTY, EMPTY_CONTENT, EMPTY_INNER_CONTENT, FOLDER, ICON_IMAGE, ICON_MUSIC, ICON_VIDEO, LARGE_ICON, LARGE_EMPTY_FOLDER, LARGE_EMPTY_FOLDER_TWO, LARGE_ICON_FOLDER, SELECTED_ITEMS, TEXT_CONTENT, GRID_HEADER, TEMPLATE_CELL, TREE_VIEW, MENU_ITEM, MENU_ICON, SUBMENU_ICON, GRID_VIEW, ICON_VIEW, ICON_OPEN, ICON_UPLOAD, ICON_CUT, ICON_COPY, ICON_PASTE, ICON_DELETE, ICON_RENAME, ICON_NEWFOLDER, ICON_DETAILS, ICON_SHORTBY, ICON_REFRESH, ICON_SELECTALL, ICON_DOWNLOAD, ICON_OPTIONS, ICON_GRID, ICON_LARGE, ICON_BREADCRUMB, ICON_CLEAR, ICONS, DETAILS_LABEL, ERROR_CONTENT, STATUS, BREADCRUMBS, RTL, DISPLAY_NONE, COLLAPSED, FULLROW, ICON_COLLAPSIBLE, SPLIT_BAR, HEADER_CHECK, OVERLAY, VALUE, isFile, modelChanged, initialEnd, finalizeEnd, createEnd, deleteEnd, refreshEnd, resizeEnd, splitterResize, pathChanged, destroy, beforeRequest, upload, afterRequest, download, uiRefresh, search, openInit, openEnd, selectionChanged, selectAllInit, clearAllInit, clearPathInit, layoutChange, sortByChange, nodeExpand, renameInit, renameEnd, showPaste, hidePaste, hideLayout, updateTreeSelection, treeSelect, sortColumn, pathColumn, searchTextChange, downloadInit, FileManager, Toolbar$1 as Toolbar, BreadCrumbBar, NavigationPane, DetailsView, LargeIconsView, createDialog, createImageDialog, ContextMenu$2 as ContextMenu };
//# sourceMappingURL=ej2-filemanager.es5.js.map
