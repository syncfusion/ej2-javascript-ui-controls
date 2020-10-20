import { Ajax, Browser, ChildProperty, Complex, Component, Draggable, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, closest, createElement, detach, extend, formatUnit, getValue, isBlazor, isNullOrUndefined, isVisible, matches, remove, removeClass, select, selectAll, setStyleAttribute, setValue } from '@syncfusion/ej2-base';
import { Splitter } from '@syncfusion/ej2-layouts';
import { Dialog, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Input, TextBox, Uploader } from '@syncfusion/ej2-inputs';
import { CheckBox, createCheckBox } from '@syncfusion/ej2-buttons';
import { ListBase } from '@syncfusion/ej2-lists';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ContextMenu, Toolbar, TreeView } from '@syncfusion/ej2-navigations';
import { ContextMenu as ContextMenu$1, Grid, Resize, Sort, VirtualScroll } from '@syncfusion/ej2-grids';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the Ajax settings of the File Manager.
 */
class AjaxSettings extends ChildProperty {
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

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const toolbarItems = ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename',
    'SortBy', 'Refresh', 'Selection', 'View', 'Details'];
/**
 * Specifies the Toolbar settings of the FileManager.
 */
class ToolbarSettings extends ChildProperty {
}
__decorate$1([
    Property(toolbarItems)
], ToolbarSettings.prototype, "items", void 0);
__decorate$1([
    Property(true)
], ToolbarSettings.prototype, "visible", void 0);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the Search settings of the File Manager.
 */
class SearchSettings extends ChildProperty {
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

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the columns in the details view of the file manager.
 */
const columnArray = [
    {
        field: 'name', headerText: 'Name', minWidth: 120,
        template: '<span class="e-fe-text">${name}</span>', customAttributes: { class: 'e-fe-grid-name' }
    },
    {
        field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
        format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190'
    },
    {
        field: 'size', headerText: 'Size', minWidth: 90, width: '110', template: '<span class="e-fe-size">${size}</span>'
    }
];
/**
 * Specifies the grid settings of the File Manager.
 */
class DetailsViewSettings extends ChildProperty {
}
__decorate$3([
    Property(true)
], DetailsViewSettings.prototype, "columnResizing", void 0);
__decorate$3([
    Property(columnArray)
], DetailsViewSettings.prototype, "columns", void 0);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const fileItems = ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Download', 'Rename', '|', 'Details'];
const folderItems = ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', 'Download', '|', 'Details'];
const layoutItems = [
    'SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'
];
/**
 * Specifies the ContextMenu settings of the File Manager.
 */
class ContextMenuSettings extends ChildProperty {
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

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the navigationpane settings of the File Manager.
 */
class NavigationPaneSettings extends ChildProperty {
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

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the Ajax settings of the File Manager.
 */
class UploadSettings extends ChildProperty {
}
__decorate$6([
    Property('')
], UploadSettings.prototype, "allowedExtensions", void 0);
__decorate$6([
    Property(true)
], UploadSettings.prototype, "autoUpload", void 0);
__decorate$6([
    Property(false)
], UploadSettings.prototype, "autoClose", void 0);
__decorate$6([
    Property(0)
], UploadSettings.prototype, "minFileSize", void 0);
__decorate$6([
    Property(30000000)
], UploadSettings.prototype, "maxFileSize", void 0);

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Interface for a class Column
 */
/* istanbul ignore next */
class Column extends ChildProperty {
}
__decorate$7([
    Property('')
], Column.prototype, "field", void 0);
__decorate$7([
    Property('')
], Column.prototype, "headerText", void 0);
__decorate$7([
    Property('')
], Column.prototype, "width", void 0);
__decorate$7([
    Property('')
], Column.prototype, "minWidth", void 0);
__decorate$7([
    Property('')
], Column.prototype, "maxWidth", void 0);
__decorate$7([
    Property('Left')
], Column.prototype, "textAlign", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "headerTextAlign", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "type", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "format", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "template", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "headerTemplate", void 0);
__decorate$7([
    Property(true)
], Column.prototype, "allowSorting", void 0);
__decorate$7([
    Property(true)
], Column.prototype, "allowResizing", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "customAttributes", void 0);
__decorate$7([
    Property('')
], Column.prototype, "hideAtMedia", void 0);
__decorate$7([
    Property(null)
], Column.prototype, "customFormat", void 0);

/**
 * FileExplorer common modules
 */

/**
 * Specifies the File Manager internal ID's
 */
/** @hidden */
const TOOLBAR_ID = '_toolbar';
/** @hidden */
const LAYOUT_ID = '_layout';
/** @hidden */
const NAVIGATION_ID = '_navigation';
/** @hidden */
const TREE_ID = '_tree';
/** @hidden */
const GRID_ID = '_grid';
/** @hidden */
const LARGEICON_ID = '_largeicons';
/** @hidden */
const DIALOG_ID = '_dialog';
/** @hidden */
const ALT_DIALOG_ID = '_alt_dialog';
/** @hidden */
const IMG_DIALOG_ID = '_img_dialog';
/** @hidden */
const EXTN_DIALOG_ID = '_extn_dialog';
/** @hidden */
const UPLOAD_DIALOG_ID = '_upload_dialog';
/** @hidden */
const RETRY_DIALOG_ID = '_retry_dialog';
/** @hidden */
const CONTEXT_MENU_ID = '_contextmenu';
/** @hidden */
const SORTBY_ID = '_sortby';
/** @hidden */
const VIEW_ID = '_view';
/** @hidden */
const SPLITTER_ID = '_splitter';
/** @hidden */
const CONTENT_ID = '_content';
/** @hidden */
const BREADCRUMBBAR_ID = '_breadcrumbbar';
/** @hidden */
const UPLOAD_ID = '_upload';
/** @hidden */
const RETRY_ID = '_retry';
/** @hidden */
const SEARCH_ID = '_search';
/**
 * Specifies the File Manager internal class names
 */
/** @hidden */
const ROOT = 'e-filemanager';
/** @hidden */
const CONTROL = 'e-control';
/** @hidden */
const CHECK_SELECT = 'e-fe-cb-select';
/** @hidden */
const ROOT_POPUP = 'e-fe-popup';
/** @hidden */
const MOBILE = 'e-fe-mobile';
/** @hidden */
const MOB_POPUP = 'e-fe-popup e-fe-mobile';
/** @hidden */
const MULTI_SELECT = 'e-fe-m-select';
/** @hidden */
const FILTER = 'e-fe-m-filter';
/** @hidden */
const LAYOUT = 'e-layout';
/** @hidden */
const NAVIGATION = 'e-navigation';
/** @hidden */
const LAYOUT_CONTENT = 'e-layout-content';
/** @hidden */
const LARGE_ICONS = 'e-large-icons';
/** @hidden */
const TB_ITEM = 'e-toolbar-item';
/** @hidden */
const LIST_ITEM = 'e-list-item';
/** @hidden */
const LIST_TEXT = 'e-list-text';
/** @hidden */
const LIST_PARENT = 'e-list-parent';
/** @hidden */
const TB_OPTION_TICK = 'e-icons e-fe-tick';
/** @hidden */
const TB_OPTION_DOT = 'e-icons e-fe-dot';
/** @hidden */
const BLUR = 'e-blur';
/** @hidden */
const ACTIVE = 'e-active';
/** @hidden */
const HOVER = 'e-hover';
/** @hidden */
const FOCUS = 'e-focus';
/** @hidden */
const FOCUSED = 'e-focused';
/** @hidden */
const CHECK = 'e-check';
/** @hidden */
const FRAME = 'e-frame';
/** @hidden */
const CB_WRAP = 'e-checkbox-wrapper';
/** @hidden */
const ROW = 'e-row';
/** @hidden */
const ROWCELL = 'e-rowcell';
/** @hidden */
const EMPTY = 'e-empty';
/** @hidden */
const EMPTY_CONTENT = 'e-empty-content';
/** @hidden */
const EMPTY_INNER_CONTENT = 'e-empty-inner-content';
/** @hidden */
const CLONE = 'e-fe-clone';
/** @hidden */
const DROP_FOLDER = 'e-fe-drop-folder';
/** @hidden */
const DROP_FILE = 'e-fe-drop-file';
/** @hidden */
const FOLDER = 'e-fe-folder';
/** @hidden */
const ICON_IMAGE = 'e-fe-image';
/** @hidden */
const ICON_MUSIC = 'e-fe-music';
/** @hidden */
const ICON_VIDEO = 'e-fe-video';
/** @hidden */
const LARGE_ICON = 'e-large-icon';
/** @hidden */
const LARGE_EMPTY_FOLDER = 'e-empty-icon e-fe-folder';
/** @hidden */
const LARGE_EMPTY_FOLDER_TWO = 'e-empty-icon.e-fe-folder';
/** @hidden */
const LARGE_ICON_FOLDER = 'e-fe-folder';
/** @hidden */
const SELECTED_ITEMS = 'e-items';
/** @hidden */
const TEXT_CONTENT = 'e-text-content';
/** @hidden */
const GRID_HEADER = 'e-gridheader';
/** @hidden */
const TEMPLATE_CELL = 'e-templatecell';
/** @hidden */
const TREE_VIEW = 'e-treeview';
/** @hidden */
const MENU_ITEM = 'e-menu-item';
/** @hidden */
const MENU_ICON = 'e-menu-icon';
/** @hidden */
const SUBMENU_ICON = 'e-caret';
/** @hidden */
const GRID_VIEW = 'e-content';
/** @hidden */
const ICON_VIEW = 'e-list-parent';
/** @hidden */
const ICON_OPEN = 'e-icons e-fe-open';
/** @hidden */
const ICON_UPLOAD = 'e-icons e-fe-upload';
/** @hidden */
const ICON_CUT = 'e-icons e-fe-cut';
/** @hidden */
const ICON_COPY = 'e-icons e-fe-copy';
/** @hidden */
const ICON_PASTE = 'e-icons e-fe-paste';
/** @hidden */
const ICON_DELETE = 'e-icons e-fe-delete';
/** @hidden */
const ICON_RENAME = 'e-icons e-fe-rename';
/** @hidden */
const ICON_NEWFOLDER = 'e-icons e-fe-newfolder';
/** @hidden */
const ICON_DETAILS = 'e-icons e-fe-details';
/** @hidden */
const ICON_SHORTBY = 'e-icons e-fe-sort';
/** @hidden */
const ICON_REFRESH = 'e-icons e-fe-refresh';
/** @hidden */
const ICON_SELECTALL = 'e-icons e-fe-select';
/** @hidden */
const ICON_DOWNLOAD = 'e-icons e-fe-download';
/** @hidden */
const ICON_OPTIONS = 'e-icons e-fe-options';
/** @hidden */
const ICON_GRID = 'e-icons e-fe-grid';
/** @hidden */
const ICON_LARGE = 'e-icons e-fe-large';
/** @hidden */
const ICON_BREADCRUMB = 'e-icons e-fe-breadcrumb';
/** @hidden */
const ICON_CLEAR = 'e-icons e-fe-clear';
/** @hidden */
const ICON_DROP_IN = 'e-icons e-fe-drop-in';
/** @hidden */
const ICON_DROP_OUT = 'e-icons e-fe-drop-out';
/** @hidden */
const ICON_NO_DROP = 'e-icons e-fe-no-drop';
/** @hidden */
const ICONS = 'e-icons';
/** @hidden */
const DETAILS_LABEL = 'e-detailslabel';
/** @hidden */
const ERROR_CONTENT = 'e-fe-errorcontent';
/** @hidden */
const STATUS = 'e-status';
/** @hidden */
const BREADCRUMBS = 'e-address';
/** @hidden */
const RTL = 'e-rtl';
/** @hidden */
const DISPLAY_NONE = 'e-display-none';
/** @hidden */
const COLLAPSED = 'e-node-collapsed';
/** @hidden */
const FULLROW = 'e-fullrow';
/** @hidden */
const ICON_COLLAPSIBLE = 'e-icon-collapsible';
/** @hidden */
const SPLIT_BAR = 'e-split-bar';
/** @hidden */
const HEADER_CHECK = 'e-headercheck';
/** @hidden */
const OVERLAY = 'e-fe-overlay';
/** @hidden */
const VALUE = 'e-fe-value';

/**
 * Specifies the File Manager internal variables
 */
/** @hidden */
const isFile = 'isFile';
/**
 * Specifies the File Manager internal events
 */
/** @hidden */
const modelChanged = 'model-changed';
/** @hidden */
const initialEnd = 'initial-end';
/** @hidden */
const finalizeEnd = 'finalize-end';
/** @hidden */
const createEnd = 'create-end';
/** @hidden */
const filterEnd = 'filter-end';
/** @hidden */
const beforeDelete = 'before-delete';
/** @hidden */
const pathDrag = 'path-drag';
/** @hidden */
const deleteInit = 'delete-init';
/** @hidden */
const deleteEnd = 'delete-end';
/** @hidden */
const refreshEnd = 'refresh-end';
/** @hidden */
const resizeEnd = 'resize-end';
/** @hidden */
const splitterResize = 'splitter-resize';
/** @hidden */
const pathChanged = 'path-changed';
/** @hidden */
const destroy = 'destroy';
/** @hidden */
const beforeRequest = 'before-request';
/** @hidden */
const upload = 'upload';
/** @hidden */
const skipUpload = 'skip-upload';
/** @hidden */
const afterRequest = 'after-request';
/** @hidden */
const download = 'download';
/** @hidden */
const layoutRefresh = 'layout-refresh';
/** @hidden */
const actionFailure = 'actionFailure';
/** @hidden */
const search = 'search';
/** @hidden */
const openInit = 'open-init';
/** @hidden */
const openEnd = 'open-end';
/** @hidden */
const selectionChanged = 'selection-changed';
/** @hidden */
const selectAllInit = 'select-all-init';
/** @hidden */
const clearAllInit = 'clear-all-init';
/** @hidden */
const clearPathInit = 'clear-path-init';
/** @hidden */
const layoutChange = 'layout-change';
/** @hidden */
const sortByChange = 'sort-by-change';
/** @hidden */
const nodeExpand = 'node-expand';
/** @hidden */
const detailsInit = 'details-init';
/** @hidden */
const menuItemData = 'menu-item-data';
/** @hidden */
const renameInit = 'rename-init';
/** @hidden */
const renameEndParent = 'rename-end-parent';
/** @hidden */
const renameEnd = 'rename-end';
/** @hidden */
const showPaste = 'show-paste';
/** @hidden */
const hidePaste = 'hide-paste';
/** @hidden */
const selectedData = 'selected-data';
/** @hidden */
const cutCopyInit = 'cut-copy-init';
/** @hidden */
const pasteInit = 'paste-init';
/** @hidden */
const pasteEnd = 'paste-end';
/** @hidden */
const cutEnd = 'cut-end';
/** @hidden */
const hideLayout = 'hide-layout';
/** @hidden */
const updateTreeSelection = 'update-tree-selection';
/** @hidden */
const treeSelect = 'select-node';
/** @hidden */
const sortColumn = 'sort-column';
/** @hidden */
const pathColumn = 'path-column';
/** @hidden */
const searchTextChange = 'search-change';
/** @hidden */
const beforeDownload = 'before-download';
/** @hidden */
const downloadInit = 'download-init';
/** @hidden */
const dropInit = 'drop-init';
/** @hidden */
const dragEnd = 'drag-end';
/** @hidden */
const dropPath = 'drop-path';
/** @hidden */
const dragHelper = 'drag-helper';
/** @hidden */
const dragging = 'dragging';
/** @hidden */
const updateSelectionData = 'update-selection-data';
/** @hidden */
const methodCall = 'method-call';
/** @hidden */
const permissionRead = 'read';
/** @hidden */
const permissionEdit = 'write';
/** @hidden */
const permissionEditContents = 'writeContents';
/** @hidden */
const permissionCopy = 'copy';
/** @hidden */
const permissionUpload = 'upload';
/** @hidden */
const permissionDownload = 'download';

/**
 * Utility file for common actions
 * @private
 */
function updatePath(node, data, instance) {
    let text = getValue('name', data);
    let id = node.getAttribute('data-id');
    let newText = isNullOrUndefined(id) ? text : id;
    instance.setProperties({ path: getPath(node, newText, instance.hasId) }, true);
    instance.pathId = getPathId(node);
    instance.pathNames = getPathNames(node, text);
}
function getPath(element, text, hasId) {
    let matched = getParents(element, text, false, hasId);
    let path = hasId ? '' : '/';
    let len = matched.length - (hasId ? 1 : 2);
    for (let i = len; i >= 0; i--) {
        path += matched[i] + '/';
    }
    return path;
}
function getPathId(node) {
    let matched = getParents(node, node.getAttribute('data-uid'), true);
    let ids = [];
    for (let i = matched.length - 1; i >= 0; i--) {
        ids.push(matched[i]);
    }
    return ids;
}
function getPathNames(element, text) {
    let matched = getParents(element, text, false);
    let names = [];
    for (let i = matched.length - 1; i >= 0; i--) {
        names.push(matched[i]);
    }
    return names;
}
function getParents(element, text, isId, hasId) {
    let matched = [text];
    let el = element.parentNode;
    while (!isNullOrUndefined(el)) {
        if (matches(el, '.' + LIST_ITEM)) {
            let parentText = isId ? el.getAttribute('data-uid') : (hasId ? el.getAttribute('data-id') :
                select('.' + LIST_TEXT, el).textContent);
            matched.push(parentText);
        }
        el = el.parentNode;
        if (el.classList.contains(TREE_VIEW)) {
            break;
        }
    }
    return matched;
}
function generatePath(parent) {
    let key = parent.hasId ? 'id' : 'name';
    let newPath = parent.hasId ? '' : '/';
    let i = parent.hasId ? 0 : 1;
    for (i; i < parent.pathId.length; i++) {
        let data = getValue(parent.pathId[i], parent.feParent);
        newPath += getValue(key, data) + '/';
    }
    parent.setProperties({ path: newPath }, true);
}
function removeActive(parent) {
    if (parent.isCut) {
        removeBlur(parent);
        parent.selectedNodes = [];
        parent.actionRecords = [];
        parent.enablePaste = false;
        parent.notify(hidePaste, {});
    }
}
// Selects active element in File Manager
function activeElement(action, parent) {
    parent.isSearchCut = false;
    parent.actionRecords = [];
    parent.activeElements = [];
    parent.notify(cutCopyInit, {});
    if (parent.activeElements.length === 0) {
        return false;
    }
    removeBlur(parent);
    let blurEle = parent.activeElements;
    if (parent.activeModule !== 'navigationpane') {
        parent.targetPath = parent.path;
    }
    else {
        parent.targetPath = getParentPath(parent.path);
    }
    let i = 0;
    if (blurEle) {
        getModule(parent, blurEle[0]);
        if (action === 'cut') {
            while (i < blurEle.length) {
                addBlur(blurEle[i]);
                i++;
            }
        }
    }
    i = 0;
    parent.selectedNodes = [];
    parent.enablePaste = true;
    parent.notify(showPaste, {});
    while (i < parent.activeRecords.length) {
        parent.actionRecords.push(parent.activeRecords[i]);
        parent.selectedNodes.push(getValue('name', parent.activeRecords[i]));
        i++;
    }
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) &&
        parent.activeModule !== 'navigationpane') {
        parent.selectedNodes = [];
        parent.isSearchCut = true;
        let i = 0;
        while (i < parent.selectedItems.length) {
            parent.selectedNodes.push(parent.selectedItems[i]);
            i++;
        }
    }
    return true;
}
function addBlur(nodes) {
    nodes.classList.add(BLUR);
}
// Removes blur from elements
function removeBlur(parent, hover) {
    let blurEle = (!hover) ? parent.element.querySelectorAll('.' + BLUR) :
        parent.element.querySelectorAll('.' + HOVER);
    let i = 0;
    while (i < blurEle.length) {
        (!hover) ? blurEle[i].classList.remove(BLUR) : blurEle[i].classList.remove(HOVER);
        i++;
    }
}
// Gets module name
function getModule(parent, element) {
    if (element) {
        if (element.classList.contains(ROW)) {
            parent.activeModule = 'detailsview';
        }
        else if (closest(element, '.' + LARGE_ICON)) {
            parent.activeModule = 'largeiconsview';
        }
        else {
            parent.activeModule = 'navigationpane';
        }
    }
}
function searchWordHandler(parent, value, isLayoutChange) {
    let searchWord;
    if (value.length === 0 && !parent.isFiltered) {
        parent.notify(pathColumn, { args: parent });
    }
    if (parent.searchSettings.filterType === 'startsWith') {
        searchWord = value + '*';
    }
    else if (parent.searchSettings.filterType === 'endsWith') {
        searchWord = '*' + value;
    }
    else {
        searchWord = '*' + value + '*';
    }
    parent.searchWord = searchWord;
    parent.itemData = [getPathObject(parent)];
    if (value.length > 0) {
        let caseSensitive = parent.searchSettings.ignoreCase;
        let hiddenItems = parent.showHiddenItems;
        Search(parent, isLayoutChange ? layoutChange : search, parent.path, searchWord, hiddenItems, !caseSensitive);
    }
    else {
        if (!parent.isFiltered) {
            read(parent, isLayoutChange ? layoutChange : search, parent.path);
        }
        else {
            filter(parent, layoutChange);
        }
    }
}
function updateLayout(parent, view) {
    parent.setProperties({ view: view }, true);
    if (parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) {
        parent.layoutSelectedItems = parent.selectedItems;
    }
    let searchWord = '';
    if (parent.breadcrumbbarModule.searchObj.element.value) {
        searchWord = parent.breadcrumbbarModule.searchObj.element.value;
    }
    parent.isLayoutChange = true;
    searchWordHandler(parent, searchWord, true);
}
/* istanbul ignore next */
function getTargetModule(parent, element) {
    let tartgetModule = '';
    if (element) {
        if (closest(element, '.e-gridcontent')) {
            tartgetModule = 'detailsview';
        }
        else if (closest(element, '.' + LARGE_ICONS)) {
            tartgetModule = 'largeiconsview';
        }
        else if (element.classList.contains('e-fullrow') ||
            element.classList.contains('e-icon-expandable')) {
            tartgetModule = 'navigationpane';
        }
        else if (closest(element, '.e-address-list-item')) {
            tartgetModule = 'breadcrumbbar';
        }
        else {
            tartgetModule = '';
        }
    }
    parent.targetModule = tartgetModule;
}
/* istanbul ignore next */
function refresh(parent) {
    parent.itemData = [getPathObject(parent)];
    if (!hasReadAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0], permissionRead);
    }
    else {
        read(parent, refreshEnd, parent.path);
    }
}
function openAction(parent) {
    read(parent, openEnd, parent.path);
}
function getPathObject(parent) {
    return getValue(parent.pathId[parent.pathId.length - 1], parent.feParent);
}
// Copy files
function copyFiles(parent) {
    if (!activeElement('copy', parent)) {
        return;
    }
    else {
        parent.fileAction = 'copy';
    }
}
// Cut files
function cutFiles(parent) {
    if (!activeElement('cut', parent)) {
        return;
    }
    else {
        parent.isCut = true;
        parent.fileAction = 'move';
    }
}
// To add class for fileType
function fileType(file) {
    let isFile$$1 = getValue('isFile', file);
    if (!isFile$$1) {
        return FOLDER;
    }
    let imageFormat = ['bmp', 'dib', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'png', 'ico'];
    let audioFormat = ['mp3', 'wav', 'aac', 'ogg', 'wma', 'aif', 'fla', 'm4a'];
    let videoFormat = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'wmv', 'mp4', '3gp'];
    let knownFormat = ['css', 'exe', 'html', 'js', 'msi', 'pdf', 'pptx', 'ppt', 'rar', 'zip', 'txt', 'docx', 'doc',
        'xlsx', 'xls', 'xml', 'rtf', 'php'];
    let filetype = getValue('type', file);
    filetype = filetype.toLowerCase();
    if (filetype.indexOf('.') !== -1) {
        filetype = filetype.split('.').join('');
    }
    let iconType;
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
/* istanbul ignore next */
function getImageUrl(parent, item) {
    let baseUrl = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    let imgUrl;
    let fileName = getValue('name', item);
    let fPath = getValue('filterPath', item);
    if (parent.hasId) {
        let imgId = getValue('id', item);
        imgUrl = baseUrl + '?path=' + parent.path + '&id=' + imgId;
    }
    else if (!isNullOrUndefined(fPath)) {
        imgUrl = baseUrl + '?path=' + fPath.replace(/\\/g, '/') + fileName;
    }
    else {
        imgUrl = baseUrl + '?path=' + parent.path + fileName;
    }
    imgUrl = imgUrl + '&time=' + (new Date().getTime()).toString();
    let eventArgs = {
        fileDetails: [item],
        imageUrl: imgUrl
    };
    parent.trigger('beforeImageLoad', eventArgs);
    return eventArgs.imageUrl;
}
/* istanbul ignore next */
function getFullPath(parent, data, path) {
    let filePath = getValue(parent.hasId ? 'id' : 'name', data) + '/';
    let fPath = getValue(parent.hasId ? 'filterId' : 'filterPath', data);
    if (!isNullOrUndefined(fPath)) {
        return fPath.replace(/\\/g, '/') + filePath;
    }
    else {
        return path + filePath;
    }
}
function getName(parent, data) {
    let name = getValue('name', data);
    let fPath = getValue('filterPath', data);
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) && !isNullOrUndefined(fPath)) {
        fPath = fPath.replace(/\\/g, '/');
        name = fPath.replace(parent.path, '') + name;
    }
    return name;
}
function getSortedData(parent, items) {
    if (items.length === 0) {
        return items;
    }
    let query;
    if (parent.sortOrder !== 'None') {
        query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    }
    else {
        query = new Query().group('isFile');
    }
    let lists = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}
function getObject(parent, key, value) {
    let currFiles = getValue(parent.pathId[parent.pathId.length - 1], parent.feFiles);
    let query = new Query().where(key, 'equal', value);
    let lists = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}
function createEmptyElement(parent, element, args) {
    let top;
    let layoutElement = select('#' + parent.element.id + LAYOUT_ID, parent.element);
    let addressBarHeight = select('#' + parent.element.id + BREADCRUMBBAR_ID, layoutElement).offsetHeight;
    top = layoutElement.offsetHeight - addressBarHeight;
    if (parent.view === 'Details') {
        top = top - select('.' + GRID_HEADER, layoutElement).offsetHeight;
    }
    if (isNullOrUndefined(element.querySelector('.' + EMPTY))) {
        let emptyDiv = createElement('div', { className: EMPTY });
        let emptyFolder = createElement('div', { className: LARGE_EMPTY_FOLDER });
        let emptyEle = createElement('div', { className: EMPTY_CONTENT });
        let dragFile = createElement('div', { className: EMPTY_INNER_CONTENT });
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
        if (!isNullOrUndefined(args.error)) {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Access-Denied');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Access-Details');
        }
        else if (parent.isFiltered) {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Empty');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Key');
        }
        else if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
        }
        else {
            element.querySelector('.' + EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
            element.querySelector('.' + EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
        }
    }
    let eDiv = select('.' + EMPTY, element);
    top = (top - eDiv.offsetHeight) / 2;
    eDiv.style.marginTop = top + 'px';
}
function getDirectories(files) {
    return new DataManager(files).executeLocal(new Query().where(isFile, 'equal', false, false));
}
function setNodeId(result, rootId) {
    let dirs = getDirectories(result.files);
    for (let i = 0, len = dirs.length; i < len; i++) {
        setValue('_fm_id', rootId + '_' + i, dirs[i]);
    }
}
function setDateObject(args) {
    for (let i = 0; i < args.length; i++) {
        setValue('_fm_created', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('_fm_modified', new Date(getValue('dateModified', args[i])), args[i]);
    }
}
function getLocaleText(parent, text) {
    let locale = parent.localeObj.getConstant(text);
    return (locale === '') ? text : locale;
}
function getCssClass(parent, css) {
    let cssClass = parent.cssClass;
    cssClass = (isNullOrUndefined(cssClass) || cssClass === '') ? css : (cssClass + ' ' + css);
    return cssClass;
}
function sortbyClickHandler(parent, args) {
    let tick;
    if (args.item.id.indexOf('ascending') !== -1 || args.item.id.indexOf('descending') !== -1 || args.item.id.indexOf('none') !== -1) {
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
    parent.itemData = [getPathObject(parent)];
    if (parent.view === 'Details') {
        if (parent.isMobile) {
            updateLayout(parent, 'Details');
        }
        else {
            parent.notify(sortColumn, { module: 'detailsview' });
        }
    }
    if (parent.view === 'LargeIcons') {
        updateLayout(parent, 'LargeIcons');
    }
    parent.notify(sortByChange, {});
}
function getSortField(id) {
    let text = id.substring(id.lastIndexOf('_') + 1);
    let field = text;
    switch (text) {
        case 'date':
            field = '_fm_modified';
            break;
        case 'ascending':
            field = 'Ascending';
            break;
        case 'descending':
            field = 'Descending';
            break;
        case 'none':
            field = 'None';
            break;
    }
    return field;
}
function setNextPath(parent, path) {
    let currfolders = path.split('/');
    let folders = parent.originalPath.split('/');
    let root = getValue(parent.pathId[0], parent.feParent);
    let key = isNullOrUndefined(getValue('id', root)) ? 'name' : 'id';
    for (let i = currfolders.length - 1, len = folders.length - 1; i < len; i++) {
        let eventName = (folders[i + 1] === '') ? finalizeEnd : initialEnd;
        let newPath = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
        let data = getObject(parent, key, folders[i]);
        let id = getValue('_fm_id', data);
        parent.setProperties({ path: newPath }, true);
        parent.pathId.push(id);
        parent.itemData = [data];
        parent.pathNames.push(getValue('name', data));
        read(parent, eventName, parent.path);
        break;
    }
}
function openSearchFolder(parent, data) {
    parent.notify(clearPathInit, { selectedNode: parent.pathId[parent.pathId.length - 1] });
    parent.originalPath = getFullPath(parent, data, parent.path);
    read(parent, (parent.path !== parent.originalPath) ? initialEnd : finalizeEnd, parent.path);
}
function pasteHandler(parent) {
    parent.isDragDrop = false;
    if (parent.selectedNodes.length !== 0 && parent.enablePaste) {
        let path = (parent.folderPath === '') ? parent.path : parent.folderPath;
        let subFolder = validateSubFolder(parent, parent.actionRecords, path, parent.path);
        if (!subFolder) {
            if ((parent.fileAction === 'move' && parent.targetPath !== path) || parent.fileAction === 'copy') {
                parent.notify(pasteInit, {});
                paste(parent, parent.targetPath, parent.selectedNodes, path, parent.fileAction, [], parent.actionRecords);
            }
            else {
                parent.enablePaste = false;
                parent.notify(hidePaste, {});
                removeBlur(parent);
            }
        }
    }
}
function validateSubFolder(parent, data, dropPath$$1, dragPath) {
    let subFolder = false;
    for (let i = 0; i < data.length; i++) {
        if (!getValue('isFile', data[i])) {
            let tempTarget = getFullPath(parent, data[i], dragPath);
            if (dropPath$$1.indexOf(tempTarget) === 0) {
                let result = {
                    files: null,
                    error: {
                        code: '402',
                        message: getLocaleText(parent, 'Sub-Folder-Error'),
                        fileExists: null
                    },
                };
                createDialog(parent, 'Error', result);
                subFolder = true;
                break;
            }
        }
    }
    return subFolder;
}
function dropHandler(parent) {
    parent.isDragDrop = true;
    if (parent.dragData.length !== 0) {
        parent.dragPath = parent.dragPath.replace(/\\/g, '/');
        parent.dropPath = parent.dropPath.replace(/\\/g, '/');
        let subFolder = validateSubFolder(parent, parent.dragData, parent.dropPath, parent.dragPath);
        if (!subFolder && (parent.dragPath !== parent.dropPath)) {
            parent.itemData = [parent.dropData];
            paste(parent, parent.dragPath, parent.dragNodes, parent.dropPath, 'move', [], parent.dragData);
            parent.notify(pasteInit, {});
        }
    }
}
function getParentPath(oldPath) {
    let path = oldPath.split('/');
    let newPath = path[0] + '/';
    for (let i = 1; i < path.length - 2; i++) {
        newPath += path[i] + '/';
    }
    return newPath;
}
function getDirectoryPath(parent, args) {
    let filePath = getValue(parent.hasId ? 'id' : 'name', args.cwd) + '/';
    let fPath = getValue(parent.hasId ? 'filterId' : 'filterPath', args.cwd);
    if (!isNullOrUndefined(fPath)) {
        if (fPath === '') {
            return parent.hasId ? filePath : '/';
        }
        return fPath.replace(/\\/g, '/') + filePath;
    }
    else {
        return parent.path + filePath;
    }
}
function doPasteUpdate(parent, operation, result) {
    if (operation === 'move') {
        if (!parent.isDragDrop) {
            parent.enablePaste = false;
            parent.notify(hidePaste, {});
            parent.notify(cutEnd, result);
        }
        else {
            parent.notify(dragEnd, result);
        }
    }
    if (parent.duplicateItems.length === 0) {
        parent.pasteNodes = [];
    }
    let flag = false;
    for (let count = 0; (count < result.files.length) && !flag; count++) {
        parent.pasteNodes.push(result.files[count][parent.hasId ? 'id' : 'name']);
        if (parent.isDragDrop) {
            parent.droppedObjects.push(result.files[count]);
        }
    }
    parent.duplicateItems = [];
    parent.duplicateRecords = [];
    if (parent.isDragDrop && !parent.isPasteError) {
        parent.isDropEnd = true;
    }
    else {
        parent.isDropEnd = false;
    }
    if (!parent.isDragDrop || (parent.path === parent.dragPath) || (parent.path === parent.dropPath)
        || parent.isSearchDrag) {
        parent.isPathDrag = false;
        read(parent, pasteEnd, parent.path);
    }
    else {
        readDropPath(parent);
    }
    parent.trigger('success', { action: operation, result: result });
}
function readDropPath(parent) {
    let pathId = getValue('_fm_id', parent.dropData);
    parent.expandedId = pathId;
    parent.itemData = [parent.dropData];
    if (parent.isPathDrag) {
        parent.notify(pathDrag, parent.itemData);
    }
    else {
        if (parent.navigationpaneModule) {
            let node = select('[data-uid="' + pathId + '"]', parent.navigationpaneModule.treeObj.element);
            updatePath(node, parent.dropData, parent);
        }
        read(parent, dropPath, parent.dropPath);
    }
}
function getDuplicateData(parent, name) {
    let data = null;
    let records = parent.isDragDrop ? parent.dragData : parent.actionRecords;
    for (let i = 0; i < records.length; i++) {
        if (getValue('name', records[i]) === name) {
            data = records[i];
            break;
        }
    }
    return data;
}
function createVirtualDragElement(parent) {
    parent.isSearchDrag = false;
    if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
        parent.isSearchDrag = true;
    }
    if (parent.activeModule !== 'navigationpane') {
        parent.dragNodes = [];
        let i = 0;
        while (i < parent.selectedItems.length) {
            parent.dragNodes.push(parent.selectedItems[i]);
            i++;
        }
    }
    let cloneIcon = parent.createElement('div', {
        className: 'e-fe-icon ' + fileType(parent.dragData[0])
    });
    let cloneName = parent.createElement('div', {
        className: 'e-fe-name',
        innerHTML: parent.dragData[0].name
    });
    let virtualEle = parent.createElement('div', {
        className: 'e-fe-content'
    });
    virtualEle.appendChild(cloneIcon);
    virtualEle.appendChild(cloneName);
    let ele = parent.createElement('div', {
        className: CLONE
    });
    ele.appendChild(virtualEle);
    if (parent.dragNodes.length > 1) {
        let badge = parent.createElement('span', {
            className: 'e-fe-count',
            innerHTML: (parent.dragNodes.length).toString(10)
        });
        ele.appendChild(badge);
    }
    parent.virtualDragElement = ele;
    parent.element.appendChild(parent.virtualDragElement);
}
function dragStopHandler(parent, args) {
    let dragArgs = args;
    dragArgs.cancel = false;
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeDropTarget(parent);
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    removeBlur(parent);
    parent.uploadObj.dropArea = select('#' + parent.element.id + CONTENT_ID, parent.element);
    let virtualEle = select('.' + CLONE, parent.element);
    if (virtualEle) {
        detach(virtualEle);
    }
    getTargetModule(parent, args.target);
    parent.notify(dropInit, args);
    removeBlur(parent, 'hover');
    dragArgs.fileDetails = parent.dragData;
    parent.trigger('fileDragStop', dragArgs, (dragArgs) => {
        if (!dragArgs.cancel && !isNullOrUndefined(parent.targetModule) && parent.targetModule !== '') {
            dropHandler(parent);
        }
    });
}
function dragStartHandler(parent, args, dragObj) {
    let dragArgs = args;
    dragArgs.cancel = false;
    dragArgs.fileDetails = parent.dragData;
    parent.droppedObjects = [];
    if (!parent.allowDragAndDrop || ((parent.activeModule === 'navigationpane') &&
        (closest(args.element, 'li').getAttribute('data-uid') === parent.pathId[0]))) {
        dragArgs.cancel = true;
    }
    if ((parent.activeModule === 'navigationpane') &&
        (parent.pathId.indexOf(closest(args.element, 'li').getAttribute('data-uid')) !== -1)) {
        parent.isPathDrag = true;
    }
    else {
        parent.isPathDrag = false;
    }
    removeBlur(parent);
    if (dragArgs.cancel) {
        dragObj.intDestroy(args.event);
        dragCancel(parent);
    }
    else if (!dragArgs.cancel) {
        let i = 0;
        while (i < parent.activeElements.length) {
            addBlur(parent.activeElements[i]);
            i++;
        }
        parent.trigger('fileDragStart', dragArgs, (dragArgs) => {
            if (dragArgs.cancel) {
                dragObj.intDestroy(args.event);
                dragCancel(parent);
            }
            else {
                parent.uploadObj.dropArea = null;
                if (isBlazor()) {
                    dragArgs.bindEvents(dragArgs.dragElement);
                }
            }
        });
    }
}
function dragCancel(parent) {
    removeBlur(parent);
    let virtualEle = select('.' + CLONE, parent.element);
    if (virtualEle) {
        detach(virtualEle);
    }
}
function removeDropTarget(parent) {
    removeItemClass(parent, DROP_FOLDER);
    removeItemClass(parent, DROP_FILE);
}
function removeItemClass(parent, value) {
    let ele = parent.element.querySelectorAll('.' + value);
    for (let i = 0; i < ele.length; i++) {
        ele[i].classList.remove(value);
    }
}
function draggingHandler(parent, args) {
    let dragArgs = args;
    dragArgs.fileDetails = parent.dragData;
    let canDrop = false;
    getTargetModule(parent, args.target);
    removeDropTarget(parent);
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeBlur(parent, 'hover');
    let node = null;
    if (parent.targetModule === 'navigationpane') {
        node = closest(args.target, 'li');
        node.classList.add(HOVER, DROP_FOLDER);
        canDrop = true;
        /* istanbul ignore next */
        parent.treeExpandTimer = window.setTimeout(() => { parent.notify(dragging, args); }, 800);
    }
    else if (parent.targetModule === 'detailsview') {
        node = closest(args.target, 'tr');
        if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
            node.classList.add(DROP_FOLDER);
        }
        else if (node && !node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
            node.classList.add(DROP_FILE);
        }
        canDrop = true;
    }
    else if (parent.targetModule === 'largeiconsview') {
        node = closest(args.target, 'li');
        if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
            node.classList.add(HOVER, DROP_FOLDER);
        }
        canDrop = true;
        /* istanbul ignore next */
    }
    else if (parent.targetModule === 'breadcrumbbar') {
        canDrop = true;
    }
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    parent.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
    parent.trigger('fileDragging', dragArgs);
}
// Ignored the message key value in permission object
function objectToString(data) {
    let str = '';
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== 'message') {
            str += (i === 0 ? '' : ', ') + keys[i] + ': ' + getValue(keys[i], data);
        }
    }
    return str;
}
function getItemName(parent, data) {
    if (parent.hasId) {
        return getValue('id', data);
    }
    return getName(parent, data);
}
function updateRenamingData(parent, data) {
    parent.itemData = [data];
    parent.currentItemText = getValue('name', data);
    parent.isFile = getValue('isFile', data);
    parent.filterPath = getValue('filterPath', data);
}
function doRename(parent) {
    if (!hasEditAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0], permissionEdit);
    }
    else {
        createDialog(parent, 'Rename');
    }
}
/* istanbul ignore next */
function doDownload(parent) {
    let items = parent.itemData;
    for (let i = 0; i < items.length; i++) {
        if (!hasDownloadAccess(items[i])) {
            createDeniedDialog(parent, items[i], permissionDownload);
            return;
        }
    }
    if (parent.selectedItems.length > 0) {
        Download(parent, parent.path, parent.selectedItems);
    }
}
function doDeleteFiles(parent, data, newIds) {
    for (let i = 0; i < data.length; i++) {
        if (!hasEditAccess(data[i])) {
            createDeniedDialog(parent, data[i], permissionEdit);
            return;
        }
    }
    parent.itemData = data;
    Delete(parent, newIds, parent.path, 'delete');
}
/* istanbul ignore next */
function doDownloadFiles(parent, data, newIds) {
    for (let i = 0; i < data.length; i++) {
        if (!hasDownloadAccess(data[i])) {
            createDeniedDialog(parent, data[i], permissionDownload);
            return;
        }
    }
    parent.itemData = data;
    if (newIds.length > 0) {
        Download(parent, parent.path, newIds);
    }
}
function createDeniedDialog(parent, data, action) {
    let message = getValue('message', getValue('permission', data));
    if (message === '') {
        message = getLocaleText(parent, 'Access-Message').replace('{0}', getValue('name', data)).replace('{1}', action);
    }
    let response = {
        error: {
            code: '401',
            fileExists: null,
            message: message
        }
    };
    createDialog(parent, 'Error', response);
}
function getAccessClass(data) {
    return !hasReadAccess(data) ? 'e-fe-locked e-fe-hidden' : 'e-fe-locked';
}
function hasReadAccess(data) {
    let permission = getValue('permission', data);
    return (permission && !getValue('read', permission)) ? false : true;
}
function hasEditAccess(data) {
    let permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('write', permission))) : true;
}
function hasContentAccess(data) {
    let permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('writeContents', permission))) : true;
}
function hasUploadAccess(data) {
    let permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('upload', permission))) : true;
}
function hasDownloadAccess(data) {
    let permission = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('download', permission))) : true;
}
function createNewFolder(parent) {
    let details = parent.itemData[0];
    if (!hasContentAccess(details)) {
        createDeniedDialog(parent, details, permissionEditContents);
    }
    else {
        createDialog(parent, 'NewFolder');
    }
}
function uploadItem(parent) {
    let details = parent.itemData[0];
    if (!hasUploadAccess(details)) {
        createDeniedDialog(parent, details, permissionUpload);
    }
    else {
        let eleId = '#' + parent.element.id + UPLOAD_ID;
        let uploadEle = document.querySelector(eleId);
        uploadEle.click();
    }
}

/**
 * Function to read the content from given path in File Manager.
 * @private
 */
function read(parent, event, path) {
    let itemData = parent.itemData;
    for (let i = 0; i < itemData.length; i++) {
        if (isNullOrUndefined(getValue('hasChild', itemData[i]))) {
            setValue('hasChild', false, itemData[i]);
        }
    }
    let data = { action: 'read', path: path, showHiddenItems: parent.showHiddenItems, data: itemData };
    createAjax(parent, data, readSuccess, event);
}
/**
 * Function to create new folder in File Manager.
 * @private
 */
function createFolder(parent, itemName) {
    let data = { action: 'create', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess, itemName);
}
/**
 * Function to filter the files in File Manager.
 * @private
 */
function filter(parent, event) {
    let data = { action: 'filter', path: parent.path, showHiddenItems: parent.showHiddenItems, data: [getPathObject(parent)] };
    let filterData;
    filterData = parent.filterData ? extend(filterData, data, parent.filterData) : data;
    createAjax(parent, filterData, filterSuccess, event, getValue('action', filterData));
}
/**
 * Function to rename the folder/file in File Manager.
 * @private
 */
function rename(parent, path, itemNewName) {
    let name;
    let newName;
    if (parent.breadcrumbbarModule.searchObj.element.value === '' && !parent.isFiltered) {
        name = parent.currentItemText;
        newName = itemNewName;
    }
    else {
        let fPath = parent.filterPath;
        if (parent.hasId) {
            name = parent.currentItemText;
            newName = itemNewName;
        }
        else {
            fPath = fPath.replace(/\\/g, '/');
            name = fPath.replace(path, '') + parent.currentItemText;
            newName = fPath.replace(path, '') + itemNewName;
        }
    }
    let data = {
        action: 'rename', path: path, name: name, newName: newName, data: parent.itemData
    };
    createAjax(parent, data, renameSuccess, path);
}
/**
 * Function to paste file's and folder's in File Manager.
 * @private
 */
function paste(
// tslint:disable-next-line
parent, path, names, targetPath, pasteOperation, renameItems, actionRecords) {
    let data = {
        action: pasteOperation, path: path, targetData: parent.itemData[0],
        targetPath: targetPath, names: names, renameFiles: renameItems, data: actionRecords
    };
    parent.destinationPath = targetPath;
    createAjax(parent, data, pasteSuccess, path, pasteOperation, targetPath);
}
/**
 * Function to delete file's and folder's in File Manager.
 * @private
 */
function Delete(parent, items, path, operation) {
    let data = { action: operation, path: path, names: items, data: parent.itemData };
    createAjax(parent, data, deleteSuccess, path);
}
/**
 * Function to get details of file's and folder's in File Manager.
 * @private
 */
/* istanbul ignore next */
function GetDetails(parent, names, path, operation) {
    let data = { action: operation, path: path, names: names, data: parent.itemData };
    createAjax(parent, data, detailsSuccess, path, operation);
}
function createAjax(parent, data, fn, event, operation, targetPath) {
    let ajaxSettings = {
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
    let eventArgs = { action: getValue('action', data), ajaxSettings: ajaxSettings, cancel: false };
    parent.trigger('beforeSend', eventArgs, (beforeSendArgs) => {
        if (!beforeSendArgs.cancel) {
            parent.notify(beforeRequest, {});
            let ajax = new Ajax({
                url: getValue('url', beforeSendArgs.ajaxSettings),
                type: getValue('type', beforeSendArgs.ajaxSettings),
                mode: getValue('mode', beforeSendArgs.ajaxSettings),
                dataType: getValue('dataType', beforeSendArgs.ajaxSettings),
                contentType: getValue('contentType', beforeSendArgs.ajaxSettings),
                data: getValue('data', beforeSendArgs.ajaxSettings),
                beforeSend: getValue('beforeSend', beforeSendArgs.ajaxSettings),
                onSuccess: (result) => {
                    if (isNullOrUndefined(result)) {
                        let result = {
                            error: {
                                fileExists: null,
                                message: getLocaleText(parent, 'Server-Error') + ' ' + parent.ajaxSettings.url,
                                code: '406',
                            },
                            files: null,
                        };
                        triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                        return;
                    }
                    if (typeof (result) === 'string') {
                        result = JSON.parse(result);
                    }
                    parent.notify(afterRequest, { action: 'success' });
                    let id = parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1];
                    if (!isNullOrUndefined(result.cwd) && (getValue('action', data) === 'read')) {
                        result.cwd.name = (parent.pathId.length === 1) ? (parent.rootAliasName || result.cwd.name) : result.cwd.name;
                        setValue('_fm_id', id, result.cwd);
                        setValue(id, result.cwd, parent.feParent);
                        if (!isNullOrUndefined(result.files) || result.error.code === '401') {
                            if ((event === 'finalize-end' || event === 'initial-end') && parent.pathNames.length === 0) {
                                let root = getValue(parent.pathId[0], parent.feParent);
                                parent.pathNames[0] = getValue('name', root);
                                parent.hasId = !isNullOrUndefined(getValue('id', root));
                            }
                            if (event === 'finalize-end') {
                                generatePath(parent);
                            }
                        }
                    }
                    if (!isNullOrUndefined(result.files)) {
                        // tslint:disable-next-line
                        setDateObject(result.files);
                        for (let i = 0, len = result.files.length; i < len; i++) {
                            let item = result.files[i];
                            setValue('_fm_iconClass', fileType(item), item);
                        }
                        if (getValue('action', data) === 'read') {
                            setNodeId(result, id);
                            setValue(id, result.files, parent.feFiles);
                        }
                    }
                    if (!isNullOrUndefined(result.details) && !isNullOrUndefined(parent.rootAliasName)) {
                        let rootName = parent.rootAliasName || getValue('name', result.details);
                        let location = getValue('location', result.details).replace(new RegExp('/', 'g'), '\\');
                        if ((getValue('path', data) === '/') || (parent.hasId && getValue('path', data).match(/[/]/g).length === 1)) {
                            if (getValue('names', data).length === 0) {
                                setValue('name', rootName, result.details);
                                location = rootName;
                            }
                            else {
                                location = location.replace(location.substring(0, location.indexOf('\\')), rootName);
                            }
                        }
                        else {
                            location = location.replace(location.substring(0, location.indexOf('\\')), rootName);
                        }
                        setValue('location', location, result.details);
                    }
                    fn(parent, result, event, operation, targetPath);
                    if (!isNullOrUndefined(result.files) && (event === 'path-changed' || event === 'finalize-end' || event === 'open-end')) {
                        parent.notify(searchTextChange, result);
                    }
                    if (typeof getValue('onSuccess', beforeSendArgs.ajaxSettings) === 'function') {
                        getValue('onSuccess', beforeSendArgs.ajaxSettings)();
                    }
                },
                onFailure: () => {
                    let result = {
                        files: null,
                        error: {
                            code: '404',
                            message: getLocaleText(parent, 'Network-Error') + ' ' + parent.ajaxSettings.url,
                            fileExists: null
                        },
                    };
                    triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath);
                }
            });
            ajax.send();
        }
    });
}
function triggerAjaxFailure(parent, beforeSendArgs, fn, result, event, operation, targetPath) {
    parent.notify(afterRequest, { action: 'failure' });
    fn(parent, result, event, operation, targetPath);
    if (typeof getValue('onFailure', beforeSendArgs.ajaxSettings) === 'function') {
        getValue('onFailure', beforeSendArgs.ajaxSettings)();
    }
}
function readSuccess(parent, result, event) {
    if (!isNullOrUndefined(result.files)) {
        parent.notify(event, result);
        parent.notify(selectionChanged, {});
        let args = { action: 'read', result: result };
        parent.trigger('success', args);
    }
    else {
        if (result.error.code === '401') {
            result.files = [];
            parent.notify(event, result);
            parent.notify(selectionChanged, {});
        }
        onFailure(parent, result, 'read');
    }
    if (parent.isDragDrop && parent.isDropEnd) {
        if (parent.droppedObjects.length !== 0) {
            let args = { fileDetails: parent.droppedObjects };
            parent.trigger('fileDropped', args);
        }
        parent.isDropEnd = parent.isDragDrop = false;
    }
}
function filterSuccess(parent, result, event, action) {
    if (!isNullOrUndefined(result.files)) {
        parent.notify(event, result);
        let args = { action: action, result: result };
        parent.trigger('success', args);
    }
    else {
        onFailure(parent, result, action);
    }
}
/* istanbul ignore next */
function createSuccess(parent, result, itemName) {
    if (!isNullOrUndefined(result.files)) {
        if (parent.dialogObj && parent.dialogObj.visible) {
            parent.dialogObj.hide();
        }
        parent.createdItem = result.files[0];
        parent.breadcrumbbarModule.searchObj.value = '';
        let args = { action: 'create', result: result };
        parent.trigger('success', args);
        parent.itemData = [getPathObject(parent)];
        read(parent, createEnd, parent.path);
    }
    else {
        if (result.error.code === '400') {
            if (parent.dialogObj && parent.dialogObj.visible) {
                let ele = select('#newname', parent.dialogObj.element);
                let error = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
                ele.parentElement.nextElementSibling.innerHTML = error;
            }
            else {
                let result = {
                    files: null,
                    error: {
                        code: '400',
                        message: getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + itemName + '"'),
                        fileExists: null
                    }
                };
                createDialog(parent, 'Error', result);
            }
            let args = { action: 'create', error: result.error };
            parent.trigger('failure', args);
        }
        else {
            if (parent.dialogObj && parent.dialogObj.visible) {
                parent.dialogObj.hide();
            }
            onFailure(parent, result, 'create');
        }
    }
}
/**
 * Function to rename the folder/file in File Manager.
 * @private
 */
/* istanbul ignore next */
function renameSuccess(parent, result, path) {
    if (!isNullOrUndefined(result.files)) {
        if (!isNullOrUndefined(parent.dialogObj)) {
            parent.dialogObj.hide();
        }
        let args = { action: 'rename', result: result };
        parent.trigger('success', args);
        parent.renamedItem = result.files[0];
        if (parent.activeModule === 'navigationpane') {
            parent.pathId.pop();
            parent.itemData = [getValue(parent.pathId[parent.pathId.length - 1], parent.feParent)];
            read(parent, renameEndParent, getParentPath(parent.path));
        }
        else {
            parent.itemData = [getPathObject(parent)];
            if (parent.breadcrumbbarModule.searchObj.value !== '') {
                Search(parent, renameEnd, parent.path, parent.searchWord, parent.showHiddenItems, !parent.searchSettings.ignoreCase);
            }
            else {
                if (parent.isFiltered) {
                    filter(parent, renameEnd);
                }
                else {
                    read(parent, renameEnd, parent.path);
                }
            }
        }
    }
    else {
        if (result.error.code === '400' && parent.dialogObj && parent.dialogObj.visible) {
            let ele = select('#rename', parent.dialogObj.element);
            let error = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
            error = error.replace('{1}', '"' + ele.value + '"');
            ele.parentElement.nextElementSibling.innerHTML = error;
            let args = { action: 'rename', error: result.error };
            parent.trigger('failure', args);
        }
        else {
            if (!isNullOrUndefined(parent.dialogObj)) {
                parent.dialogObj.hide();
            }
            onFailure(parent, result, 'rename');
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
parent, result, path, operation) {
    if (result.error && result.error.fileExists) {
        parent.fileLength = 0;
        if (!isNullOrUndefined(result.files)) {
            parent.isPasteError = true;
            doPasteUpdate(parent, operation, result);
        }
        createExtDialog(parent, 'DuplicateItems', result.error.fileExists);
        if (result.error.code === '404') {
            createDialog(parent, 'Error', result);
        }
    }
    else if (!result.error && !isNullOrUndefined(result.files)) {
        parent.isPasteError = false;
        doPasteUpdate(parent, operation, result);
    }
    else if (result.error && !isNullOrUndefined(result.files)) {
        parent.isPasteError = true;
        doPasteUpdate(parent, operation, result);
        createDialog(parent, 'Error', result);
    }
    else {
        onFailure(parent, result, operation);
    }
}
/* istanbul ignore next */
function deleteSuccess(parent, result, path) {
    if (!isNullOrUndefined(result.files)) {
        parent.setProperties({ path: path }, true);
        parent.itemData = [getPathObject(parent)];
        read(parent, deleteEnd, parent.path);
        if (result.error) {
            onFailure(parent, result, 'delete');
        }
        else {
            let args = { action: 'delete', result: result };
            parent.trigger('success', args);
        }
    }
    else {
        onFailure(parent, result, 'delete');
    }
}
/* istanbul ignore next */
function detailsSuccess(
// tslint:disable-next-line
parent, result, path, operation) {
    if (!isNullOrUndefined(result.details)) {
        createDialog(parent, operation, null, result.details);
        let args = { action: 'details', result: result };
        parent.trigger('success', args);
    }
    else {
        onFailure(parent, result, 'details');
    }
}
function onFailure(parent, result, action) {
    createDialog(parent, 'Error', result);
    let args = { action: action, error: result.error };
    parent.trigger('failure', args);
}
/* istanbul ignore next */
function Search(
// tslint:disable-next-line
parent, event, path, searchString, showHiddenItems, caseSensitive) {
    let data = {
        action: 'search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive,
        data: parent.itemData
    };
    createAjax(parent, data, searchSuccess, event);
}
/* istanbul ignore next */
function searchSuccess(parent, result, event) {
    if (!isNullOrUndefined(result.files)) {
        parent.notify(event, result);
        let args = { action: 'search', result: result };
        parent.trigger('success', args);
    }
    else {
        onFailure(parent, result, 'search');
    }
}
/* istanbul ignore next */
function Download(parent, path, items) {
    let downloadUrl = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    let data = { 'action': 'download', 'path': path, 'names': items, 'data': parent.itemData };
    let eventArgs = { data: data, cancel: false };
    parent.trigger('beforeDownload', eventArgs, (downloadArgs) => {
        if (!downloadArgs.cancel) {
            let form = createElement('form', {
                id: parent.element.id + '_downloadForm',
                attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
            });
            let input = createElement('input', {
                id: parent.element.id + '_hiddenForm',
                attrs: { name: 'downloadInput', value: JSON.stringify(downloadArgs.data), type: 'hidden' }
            });
            form.appendChild(input);
            parent.element.appendChild(form);
            document.forms.namedItem('downloadForm').submit();
            parent.element.removeChild(form);
        }
    });
}

// tslint:disable-next-line
function createDialog(parent, text, e, details, replaceItems) {
    let options = getOptions(parent, text, e, details, replaceItems);
    if (isNullOrUndefined(parent.dialogObj)) {
        parent.dialogObj = new Dialog({
            beforeOpen: keydownAction.bind(this, parent, options.dialogName),
            beforeClose: (args) => {
                triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
            },
            header: options.header,
            content: options.content,
            buttons: options.buttons,
            animationSettings: { effect: 'None' },
            showCloseIcon: true,
            closeOnEscape: true,
            visible: true,
            allowDragging: true,
            isModal: true,
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? MOB_POPUP : ROOT_POPUP),
            width: '350px',
            open: options.open,
            close: options.close,
            enableRtl: parent.enableRtl,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            locale: parent.locale
        });
        parent.dialogObj.isStringTemplate = true;
        parent.dialogObj.appendTo('#' + parent.element.id + DIALOG_ID);
    }
    else {
        changeOptions(parent, options);
    }
}
function createExtDialog(parent, text, replaceItems, newPath) {
    let extOptions = getExtOptions(parent, text, replaceItems, newPath);
    parent.isApplySame = false;
    if (isNullOrUndefined(parent.extDialogObj)) {
        parent.extDialogObj = new Dialog({
            beforeOpen: beforeExtOpen.bind(this, parent, extOptions.dialogName),
            beforeClose: (args) => {
                triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
            },
            content: extOptions.content,
            header: extOptions.header,
            closeOnEscape: true,
            allowDragging: true,
            animationSettings: { effect: 'None' },
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? MOB_POPUP : ROOT_POPUP),
            enableRtl: parent.enableRtl,
            showCloseIcon: true,
            isModal: true,
            width: 350,
            buttons: extOptions.buttons,
            open: extOptions.open,
            close: extOptions.close,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            locale: parent.locale
        });
        parent.extDialogObj.isStringTemplate = true;
        parent.extDialogObj.appendTo('#' + parent.element.id + EXTN_DIALOG_ID);
    }
    else {
        parent.extDialogObj.header = extOptions.header;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.open = extOptions.open;
        parent.extDialogObj.close = extOptions.close;
        parent.extDialogObj.content = extOptions.content;
        parent.extDialogObj.buttons = extOptions.buttons;
        parent.extDialogObj.enableRtl = parent.enableRtl;
        parent.extDialogObj.locale = parent.locale;
        parent.extDialogObj.beforeOpen = beforeExtOpen.bind(this, parent, extOptions.dialogName);
        parent.extDialogObj.beforeClose = (args) => {
            triggerPopupBeforeClose(parent, parent.extDialogObj, args, extOptions.dialogName);
        };
        parent.extDialogObj.dataBind();
        parent.extDialogObj.show();
    }
}
function triggerPopupBeforeOpen(parent, dlgModule, args, dialogName) {
    let eventArgs = {
        cancel: args.cancel, popupName: dialogName, popupModule: dlgModule
    };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete eventArgs.popupModule;
    }
    parent.trigger('beforePopupOpen', eventArgs, (eventargs) => {
        args.cancel = eventargs.cancel;
    });
}
function triggerPopupBeforeClose(parent, dlgModule, args, dialogName) {
    let eventArgs = {
        cancel: args.cancel, popupModule: dlgModule, popupName: dialogName
    };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete eventArgs.popupModule;
    }
    parent.trigger('beforePopupClose', eventArgs, (eventargs) => {
        args.cancel = eventargs.cancel;
        if (!args.cancel && args.isInteracted && ((dialogName === 'Rename') || (dialogName === 'Create Folder'))) {
            parent.trigger(actionFailure, {});
        }
    });
}
function triggerPopupOpen(parent, dlgModule, dialogName) {
    let args = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete args.popupModule;
    }
    parent.trigger('popupOpen', args);
}
function triggerPopupClose(parent, dlgModule, dialogName) {
    let args = { popupModule: dlgModule, element: dlgModule.element, popupName: dialogName };
    /* istanbul ignore next */
    if (isBlazor()) {
        delete args.popupModule;
    }
    parent.trigger('popupClose', args);
}
// tslint:disable-next-line:max-func-body-length
function getExtOptions(parent, text, replaceItems, newPath) {
    let options = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = () => { triggerPopupOpen(parent, parent.extDialogObj, options.dialogName); };
    options.close = () => { triggerPopupClose(parent, parent.extDialogObj, options.dialogName); };
    switch (text) {
        case 'Extension':
            options.header = getLocaleText(parent, 'Header-Rename-Confirmation');
            options.content = '<div>' + getLocaleText(parent, 'Content-Rename-Confirmation') + '</div>';
            options.buttons = [{
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: () => {
                        parent.extDialogObj.hide();
                        rename(parent, newPath, parent.renameText);
                    }
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.extDialogObj.hide();
                        parent.dialogObj.hide();
                    }
                }];
            options.dialogName = 'Extension Change';
            break;
        case 'DuplicateItems':
            options.dialogName = 'Duplicate Items';
            parent.replaceItems = replaceItems;
            let item = parent.replaceItems[parent.fileLength];
            let index = item.lastIndexOf('/');
            item = index === -1 ? item : item.substring(index);
            options.header = getLocaleText(parent, 'Header-Duplicate');
            let duplicateContent = '<div>' + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.content = (duplicateContent).replace('{0}', item);
            options.close = () => {
                if (!parent.isDropEnd && parent.duplicateItems.length === 0) {
                    let args = { fileDetails: parent.droppedObjects };
                    parent.trigger('fileDropped', args);
                    parent.isDropEnd = parent.isDragDrop = false;
                }
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: () => {
                        parent.duplicateItems.push(parent.replaceItems[parent.fileLength]);
                        parent.duplicateRecords.push(getDuplicateData(parent, parent.replaceItems[parent.fileLength]));
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            let item = parent.replaceItems[parent.fileLength];
                            let indexval = item.lastIndexOf('/');
                            item = indexval === -1 ? item : item.substring(indexval);
                            parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                            parent.extDialogObj.show();
                        }
                        else {
                            parent.extDialogObj.hide();
                            let targetPath = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                            let path = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                parent.folderPath);
                            let action = parent.isDragDrop ? 'move' : parent.fileAction;
                            paste(parent, targetPath, parent.duplicateItems, path, action, parent.duplicateItems, parent.duplicateRecords);
                        }
                    }
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            let item = parent.replaceItems[parent.fileLength];
                            let ind = item.lastIndexOf('/');
                            item = ind === -1 ? item : item.substring(ind);
                            parent.extDialogObj.content = (duplicateContent).replace('{0}', item);
                            parent.extDialogObj.show();
                        }
                        else {
                            parent.extDialogObj.hide();
                            if (parent.duplicateItems.length !== 0) {
                                let action = parent.isDragDrop ? 'move' : parent.fileAction;
                                let targetPath = parent.isDragDrop ? parent.dragPath : parent.targetPath;
                                let path = parent.isDragDrop ? parent.dropPath : ((parent.folderPath === '') ? parent.path :
                                    parent.folderPath);
                                paste(parent, targetPath, parent.duplicateItems, path, action, parent.duplicateItems, parent.duplicateRecords);
                            }
                        }
                    },
                }
            ];
            break;
        case 'UploadRetry':
            options.dialogName = 'Retry Upload';
            options.header = getLocaleText(parent, 'Header-Retry');
            options.content = parent.retryFiles[0].name + '<div class="e-fe-retrycontent">' +
                (getLocaleText(parent, 'Content-Retry')) + '</div>';
            options.open = onRetryOpen.bind(this, parent);
            options.close = () => {
                parent.isRetryOpened = false;
                retryDlgClose(parent);
                triggerPopupClose(parent, parent.extDialogObj, options.dialogName);
            };
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Keep-Both') },
                    click: () => {
                        retryDlgUpdate(parent, true);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Replace') },
                    click: () => {
                        retryDlgUpdate(parent, false);
                    }
                },
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Skip') },
                    click: () => {
                        let count = 0;
                        if (parent.isApplySame) {
                            count = parent.retryFiles.length;
                            parent.retryFiles = [];
                            retryDlgClose(parent);
                        }
                        else {
                            count = 1;
                            parent.retryFiles.splice(0, 1);
                            (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
                        }
                        parent.notify(skipUpload, { count: count });
                    }
                }
            ];
            break;
    }
    return options;
}
function retryDlgUpdate(parent, isKeepBoth) {
    if (parent.isApplySame) {
        isKeepBoth ? onKeepBothAll(parent) : onReplaceAll(parent);
        retryDlgClose(parent);
    }
    else {
        parent.retryArgs.push({
            action: isKeepBoth ? 'keepboth' : 'replace',
            file: parent.retryFiles[0]
        });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
        (parent.retryFiles.length !== 0) ? createExtDialog(parent, 'UploadRetry') : retryDlgClose(parent);
    }
}
function retryDlgClose(parent) {
    let flag = true;
    if (parent.isRetryOpened) {
        parent.isRetryOpened = false;
    }
    else {
        flag = false;
    }
    let ele = select('.e-dlg-checkbox', parent.extDialogObj.element);
    if (ele) {
        remove(ele);
    }
    if (flag) {
        parent.extDialogObj.hide();
    }
    else {
        parent.retryFiles = [];
    }
}
function onRetryOpen(parent, args) {
    parent.isRetryOpened = true;
    let dialogEle = getValue('element', args);
    let container = select('.e-dlg-content', dialogEle);
    let checkContainer = parent.createElement('div', {
        className: 'e-dlg-checkbox'
    });
    let checkbox = parent.createElement('input', {
        id: parent.element.id + '_applyall'
    });
    checkContainer.appendChild(checkbox);
    container.appendChild(checkContainer);
    let checkBoxObj = new CheckBox({
        label: getLocaleText(parent, 'ApplyAll-Label'),
        change: (args) => {
            parent.isApplySame = args.checked;
        }
    });
    checkBoxObj.appendTo('#' + parent.element.id + '_applyall');
    triggerPopupOpen(parent, parent.extDialogObj, 'Retry Upload');
}
function onKeepBothAll(parent) {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'keepboth', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}
function onReplaceAll(parent) {
    while (parent.retryFiles.length !== 0) {
        parent.retryArgs.push({ action: 'replace', file: parent.retryFiles[0] });
        parent.uploadObj.retry(parent.retryFiles[0]);
        parent.retryFiles.splice(0, 1);
    }
}
function focusInput(parent) {
    let ele = select('#newname', parent.dialogObj.element);
    ele.focus();
    ele.value = '';
    let len = ele.value.length;
    ele.setSelectionRange(0, len);
}
function onFolderDialogOpen(parent) {
    let ele = select('#newname', parent.dialogObj.element);
    if (!ele.parentElement.classList.contains('e-control-wrapper')) {
        createInput(ele, getLocaleText(parent, 'Content-NewFolder'));
    }
    ele.parentElement.nextElementSibling.innerHTML = '';
    ele.oninput = () => {
        onValidate(parent, ele);
    };
    ele.onkeyup = (e) => {
        let code = getKeyCode(e);
        if (code === 13) {
            onSubmit(parent);
        }
    };
    focusInput(parent);
    triggerPopupOpen(parent, parent.dialogObj, 'Create Folder');
}
function onRenameDialogOpen(parent) {
    let inputEle = select('#rename', parent.dialogObj.element);
    if (!inputEle.parentElement.classList.contains('e-control-wrapper')) {
        createInput(inputEle, getLocaleText(parent, 'Content-Rename'));
    }
    inputEle.parentElement.nextElementSibling.innerHTML = '';
    inputEle.oninput = () => {
        onValidate(parent, inputEle);
    };
    inputEle.onkeyup = (e) => {
        let code = getKeyCode(e);
        if (code === 13) {
            onReSubmit(parent);
        }
    };
    onFocusRenameInput(parent, inputEle);
    triggerPopupOpen(parent, parent.dialogObj, 'Rename');
}
function onFocusRenameInput(parent, inputEle) {
    inputEle.focus();
    let txt = '';
    if (parent.isFile && !parent.showFileExtension) {
        let index = parent.currentItemText.lastIndexOf('.');
        txt = (index === -1) ? parent.currentItemText : parent.currentItemText.substring(0, index);
    }
    else {
        txt = parent.currentItemText;
    }
    inputEle.value = txt;
    if (parent.isFile && parent.showFileExtension && (inputEle.value.indexOf('.') !== -1)) {
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
    let options = {
        header: '', content: '', buttons: [], dialogName: ''
    };
    options.open = () => { triggerPopupOpen(parent, parent.dialogObj, options.dialogName); };
    options.close = () => { triggerPopupClose(parent, parent.dialogObj, options.dialogName); };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
            options.dialogName = 'Create Folder';
            options.header = getLocaleText(parent, 'Header-NewFolder');
            options.content = '<input type="text" value="New folder" id="newname"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Create') },
                    click: (e) => {
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
            options.dialogName = 'Delete';
            if (parent.selectedItems.length > 1) {
                options.content = ('<div>' + getLocaleText(parent, 'Content-Multiple-Delete') + '</div>')
                    .replace('{0}', parent.selectedItems.length.toString());
                options.header = getLocaleText(parent, 'Header-Multiple-Delete');
            }
            else {
                options.content = '<div>' + getLocaleText(parent, parent.isFile ? 'Content-Delete' : 'Content-Folder-Delete') + '</div>';
                options.header = getLocaleText(parent, parent.isFile ? 'Header-Delete' : 'Header-Folder-Delete');
            }
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: (e) => {
                        onDeleteSubmit(parent);
                    },
                },
                {
                    buttonModel: { content: getLocaleText(parent, 'Button-No') },
                    click: () => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Rename':
            options.dialogName = 'Rename';
            options.header = getLocaleText(parent, 'Header-Rename');
            options.content = '<input type="text" class="e-input" id="rename"><div class="e-fe-error"></div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Save') },
                    click: (e) => {
                        if (e.type === 'keydown') {
                            return;
                        }
                        onReSubmit(parent);
                    },
                }
            ];
            options.open = onRenameDialogOpen.bind(this, parent);
            break;
        case 'details':
            options.dialogName = 'File Details';
            let intl = new Internationalization(parent.locale);
            let formattedString = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
            let permission = '';
            if (!isNullOrUndefined(details.permission)) {
                permission = '<tr><td>' + getLocaleText(parent, 'Permission') + '</td><td class="' + VALUE + '" >'
                    + objectToString(details.permission) + '</td></tr>';
            }
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
                + permission + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e) => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'MultipleFileDetails':
            options.dialogName = 'File Details';
            let strArr = details.name.split(',').map((val) => {
                let index = val.indexOf('.') + 1;
                return (index === 0) ? 'Folder' : val.substr(index).replace(' ', '');
            });
            let fileType$$1 = strArr.every((val, i, arr) => val === arr[0]) ?
                ((strArr[0] === 'Folder') ? 'Folder' : strArr[0].toLocaleUpperCase() + ' Type') : 'Multiple Types';
            let location = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + VALUE + '">' + fileType$$1 + '</td></tr>' +
                '<tr><td>' + getLocaleText(parent, 'Size') + ':</td><td>' +
                details.size + '<span class="' + VALUE + '" title ="' + details.size
                + '"></span></td></tr>' + '<tr><td>' + getLocaleText(parent, 'Location') +
                ':</td><td class="' + VALUE + '" title="' + location + '">'
                + location + '</td></tr>' + '</table>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e) => {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'Error':
            parent.notify(actionFailure, {});
            options.dialogName = 'Error';
            let event = e;
            if (event.error.code === '401') {
                options.header = '<span class="e-fe-icon e-fe-access-error"></span><div class="e-fe-access-header">' +
                    getLocaleText(parent, 'Access-Denied') + '</div>';
            }
            else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + ERROR_CONTENT + '">' + event.error.message + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Ok') },
                    click: (e) => {
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
    }
    return options;
}
function keydownAction(parent, dialogName, args) {
    let btnElement = selectAll('.e-btn', parent.dialogObj.element);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.dialogObj, args, dialogName);
}
function beforeExtOpen(parent, dlgName, args) {
    let btnElement = selectAll('.e-btn', parent.extDialogObj.element);
    preventKeydown(btnElement);
    triggerPopupBeforeOpen(parent, parent.extDialogObj, args, dlgName);
}
function preventKeydown(btnElement) {
    for (let btnCount = 0; btnCount < btnElement.length; btnCount++) {
        btnElement[btnCount].onkeydown = (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        };
        btnElement[btnCount].onkeyup = (e) => {
            if (e.keyCode === 13) {
                btnElement[btnCount].click();
            }
        };
    }
}
function changeOptions(parent, options) {
    parent.dialogObj.header = options.header;
    parent.dialogObj.content = options.content;
    parent.dialogObj.buttons = options.buttons;
    parent.dialogObj.enableRtl = parent.enableRtl;
    parent.dialogObj.open = options.open;
    parent.dialogObj.close = options.close;
    parent.dialogObj.beforeOpen = keydownAction.bind(this, parent, options.dialogName);
    parent.dialogObj.beforeClose = (args) => {
        triggerPopupBeforeClose(parent, parent.dialogObj, args, options.dialogName);
    };
    parent.dialogObj.dataBind();
    parent.dialogObj.show();
}
function onSubmit(parent) {
    let ele = select('#newname', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    createFolder(parent, ele.value);
}
/* istanbul ignore next */
function onReSubmit(parent) {
    let ele = select('#rename', parent.dialogObj.element);
    onSubmitValidate(parent, ele);
    if (ele.parentElement.nextElementSibling.innerHTML !== '') {
        return;
    }
    let text = ele.value;
    let oIndex = parent.currentItemText.lastIndexOf('.');
    if (parent.isFile && !parent.showFileExtension) {
        let extn = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        text += extn;
    }
    parent.renameText = text;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    let newPath = (parent.activeModule === 'navigationpane') ? getParentPath(parent.path) : parent.path;
    parent.renamedId = getValue('id', parent.itemData[0]);
    if (parent.isFile) {
        let oldExtension = (oIndex === -1) ? '' : parent.currentItemText.substr(oIndex);
        let nIndex = text.lastIndexOf('.');
        let newExtension = (nIndex === -1) ? '' : text.substr(nIndex);
        if (parent.showFileExtension && oldExtension !== newExtension) {
            createExtDialog(parent, 'Extension', null, newPath);
        }
        else {
            rename(parent, newPath, text);
        }
    }
    else {
        rename(parent, newPath, text);
    }
}
function onDeleteSubmit(parent) {
    parent.dialogObj.hide();
    parent.notify(deleteInit, {});
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
    let len = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len)) &&
        (parent.showFileExtension || (parent.currentItemText.lastIndexOf('.') === -1))) {
        addInvalid(parent, ele);
    }
}
function addInvalid(parent, ele) {
    let error = getLocaleText(parent, 'Validation-Invalid').replace('{0}', '"' + ele.value + '"');
    ele.parentElement.nextElementSibling.innerHTML = error;
}
function getKeyCode(e) {
    let code;
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
    let content = createElement('div', { className: 'e-image-wrap' });
    let image = createElement('img', { className: 'e-image', attrs: { src: imageUrl, alt: header } });
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
            target: parent.popupTarget ? parent.popupTarget : '#' + parent.element.id,
            cssClass: getCssClass(parent, parent.isMobile ? MOB_POPUP : ROOT_POPUP),
            locale: parent.locale,
            enableResize: true,
            allowDragging: true,
            enableHtmlSanitizer: parent.enableHtmlSanitizer,
            position: { X: 'center', Y: 'center' },
            enableRtl: parent.enableRtl,
            open: openImage.bind(this, parent),
            close: () => { triggerPopupClose(parent, parent.viewerObj, 'Image Preview'); },
            beforeOpen: (args) => {
                triggerPopupBeforeOpen(parent, parent.viewerObj, args, 'Image Preview');
            },
            beforeClose: (args) => {
                triggerPopupBeforeClose(parent, parent.viewerObj, args, 'Image Preview');
            },
            resizing: updateImage.bind(this, parent),
            resizeStop: updateImage.bind(this, parent)
        });
        parent.viewerObj.isStringTemplate = true;
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
    setTimeout(() => {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
    triggerPopupOpen(parent, parent.viewerObj, 'Image Preview');
}
function updateImage(parent) {
    let content = select('.e-dlg-content', parent.viewerObj.element);
    let imgWrap = select('.e-image-wrap', parent.viewerObj.element);
    let cssObj = window.getComputedStyle(content, null);
    let paddingWidth = cssObj ? (2 * parseFloat(cssObj.paddingRight)) : 36;
    let paddingHeight = cssObj ? (2 * parseFloat(cssObj.paddingBottom)) : 20;
    imgWrap.style.width = (content.offsetWidth - paddingWidth) + 'px';
    imgWrap.style.height = (content.offsetHeight - paddingHeight) + 'px';
}

/**
 * File Manager common operations
 */

/**
 * LargeIconsView module
 */
class LargeIconsView {
    /**
     * Constructor for the LargeIcons module
     * @hidden
     */
    constructor(parent) {
        this.isInteraction = true;
        this.uploadOperation = false;
        this.count = 0;
        this.isRendered = true;
        this.tapCount = 0;
        this.isPasteOperation = false;
        this.isInteracted = true;
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
            back: 'backspace',
            ctrlD: 'ctrl+d'
        };
    }
    render(args) {
        this.parent.visitedItem = null;
        this.startItem = null;
        showSpinner(this.parent.element);
        if (this.parent.view === 'LargeIcons') {
            this.resetMultiSelect();
            this.element.setAttribute('tabindex', '0');
            if (this.listObj) {
                this.unWireEvents();
                this.removeEventListener();
            }
            this.parent.notify(hideLayout, {});
            let iconsView = select('#' + this.parent.element.id + LARGEICON_ID, this.parent.element);
            let ul = select('ul', iconsView);
            if (ul) {
                remove(ul);
            }
            this.listObj = {
                ariaAttributes: {
                    itemRole: 'option', listRole: 'listbox', itemText: '',
                    groupItemRole: 'group', wrapperRole: ''
                },
                showIcon: true,
                fields: { text: 'name', iconCss: '_fm_icon', imageUrl: '_fm_imageUrl', htmlAttributes: '_fm_htmlAttr' },
                sortOrder: this.parent.sortOrder,
                itemCreated: this.onItemCreated.bind(this),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer
            };
            this.items = [];
            this.items = this.renderList(args);
            this.items = getSortedData(this.parent, this.items);
            this.listElements = ListBase.createListFromJson(createElement, this.items, this.listObj);
            this.itemList = Array.prototype.slice.call(selectAll('.' + LIST_ITEM, this.listElements));
            this.element.appendChild(this.listElements);
            this.preventImgDrag();
            this.createDragObj();
            iconsView.classList.remove(DISPLAY_NONE);
            if (this.itemList.length === 0) {
                let emptyList = this.element.querySelector('.' + LIST_PARENT);
                this.element.removeChild(emptyList);
                createEmptyElement(this.parent, this.element, args);
            }
            else if (this.itemList.length !== 0 && this.element.querySelector('.' + EMPTY)) {
                this.element.removeChild(this.element.querySelector('.' + EMPTY));
            }
            if (this.isPasteOperation === true) {
                this.selectItems(this.parent.pasteNodes);
                this.isPasteOperation = false;
            }
            /* istanbul ignore next */
            if (this.uploadOperation === true) {
                this.selectItems(this.parent.uploadItem);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.count++;
                if (this.count === this.parent.uploadItem.length) {
                    this.uploadOperation = false;
                    this.parent.uploadItem = [];
                }
            }
            let activeEle = this.element.querySelectorAll('.' + ACTIVE);
            if (activeEle.length !== 0) {
                this.parent.activeModule = 'largeiconsview';
            }
            for (let i = 0; i < activeEle.length; i++) {
                activeEle[i].setAttribute('aria-selected', 'true');
            }
            this.adjustHeight();
            this.element.style.maxHeight = '100%';
            this.getItemCount();
            this.addEventListener();
            this.wireEvents();
            this.isRendered = true;
            hideSpinner(this.parent.element);
            if (this.parent.selectedItems.length) {
                this.checkItem();
            }
        }
    }
    preventImgDrag() {
        let i = 0;
        while (i < this.itemList.length) {
            if (this.itemList[i].querySelector('img')) {
                /* istanbul ignore next */
                this.itemList[i].ondragstart = () => { return false; };
            }
            i++;
        }
    }
    createDragObj() {
        if (!this.parent.isMobile && this.listObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) {
                    this.dragObj.destroy();
                }
                this.dragObj = new Draggable(this.listElements, {
                    enableTailMode: true,
                    enableAutoScroll: true,
                    dragTarget: '.' + LARGE_ICON,
                    helper: this.dragHelper.bind(this),
                    cursorAt: this.parent.dragCursorPosition,
                    dragArea: this.parent.element,
                    dragStop: dragStopHandler.bind(this, this.parent),
                    drag: draggingHandler.bind(this, this.parent),
                    clone: true,
                    dragStart: (args) => {
                        dragStartHandler(this.parent, args, this.dragObj);
                    },
                });
            }
            else if (this.dragObj && !this.parent.allowDragAndDrop) {
                this.dragObj.destroy();
            }
        }
    }
    dragHelper(args) {
        let dragTarget = args.sender.target;
        let dragLi = closest(dragTarget, '.e-list-item');
        if (!dragLi) {
            return null;
        }
        if (dragLi && !dragLi.classList.contains('e-active')) {
            this.setFocus(dragLi);
        }
        let activeEle = this.element.querySelectorAll('.' + ACTIVE);
        this.parent.activeElements = [];
        this.parent.dragData = [];
        for (let i = 0; i < activeEle.length; i++) {
            this.parent.dragData.push(this.getItemObject(activeEle[i]));
            this.parent.activeElements.push(activeEle[i]);
        }
        getModule(this.parent, dragLi);
        this.parent.dragPath = this.parent.path;
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    }
    onDropInit(args) {
        if (this.parent.targetModule === this.getModuleName()) {
            let dropLi = closest(args.target, '.e-list-item');
            let cwdData = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            if (dropLi) {
                let info = this.getItemObject(dropLi);
                this.parent.dropPath = info.isFile ? this.parent.path : getFullPath(this.parent, info, this.parent.path);
                this.parent.dropData = info.isFile ? cwdData : info;
            }
            else {
                this.parent.dropPath = this.parent.path;
                this.parent.dropData = cwdData;
            }
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'largeiconsview';
    }
    adjustHeight() {
        let pane = select('#' + this.parent.element.id + CONTENT_ID, this.parent.element);
        let bar = select('#' + this.parent.element.id + BREADCRUMBBAR_ID, this.parent.element);
        this.element.style.height = (pane.offsetHeight - bar.offsetHeight) + 'px';
    }
    onItemCreated(args) {
        args.item.removeAttribute('aria-level');
        if (!this.parent.showFileExtension && getValue('isFile', args.curData)) {
            let textEle = args.item.querySelector('.' + LIST_TEXT);
            let txt = getValue('name', args.curData);
            let type = getValue('type', args.curData);
            textEle.innerHTML = txt.substr(0, txt.length - type.length);
        }
        this.renderCheckbox(args);
        let eventArgs = {
            element: args.item,
            fileDetails: args.curData,
            module: 'LargeIconsView'
        };
        this.parent.trigger('fileLoad', eventArgs);
    }
    renderCheckbox(args) {
        if (!this.parent.allowMultiSelection) {
            return;
        }
        let checkElement;
        checkElement = createCheckBox(createElement, false, {
            checked: false,
            cssClass: 'e-small'
        });
        checkElement.setAttribute('role', 'checkbox');
        checkElement.setAttribute('aria-checked', 'false');
        args.item.firstElementChild.insertBefore(checkElement, args.item.firstElementChild.childNodes[0]);
    }
    onLayoutChange(args) {
        if (this.parent.view === 'LargeIcons') {
            this.destroy();
            this.render(args);
            /* istanbul ignore next */
            if (getValue('name', args) === 'layout-change' && this.parent.fileAction === 'move' &&
                this.parent.isCut && this.parent.selectedNodes && this.parent.selectedNodes.length !== 0) {
                let indexes = this.getIndexes(this.parent.selectedNodes);
                let length = 0;
                while (length < indexes.length) {
                    addBlur(this.itemList[indexes[length]]);
                    length++;
                }
            }
            let activeEle = this.element.querySelectorAll('.' + ACTIVE);
            if (activeEle.length !== 0) {
                this.element.focus();
            }
            this.checkItem();
            this.parent.isLayoutChange = false;
        }
        else {
            this.element.setAttribute('tabindex', '-1');
        }
    }
    checkItem() {
        let checkEle = this.element.querySelectorAll('.' + ACTIVE);
        if (checkEle) {
            let checkLength = 0;
            while (checkLength < checkEle.length) {
                this.checkState(checkEle[checkLength], true);
                checkLength++;
            }
        }
    }
    renderList(args) {
        let i = 0;
        let items = JSON.parse(JSON.stringify(args.files));
        while (i < items.length) {
            let icon = fileType(items[i]);
            let name = getValue('name', items[i]);
            let selected = getItemName(this.parent, items[i]);
            let className = ((this.parent.selectedItems &&
                this.parent.selectedItems.indexOf(selected) !== -1)) ?
                LARGE_ICON + ' e-active' : LARGE_ICON;
            if (!hasEditAccess(items[i])) {
                className += ' ' + getAccessClass(items[i]);
            }
            if (icon === ICON_IMAGE && this.parent.showThumbnail && hasReadAccess(items[i])) {
                let imgUrl = getImageUrl(this.parent, items[i]);
                setValue('_fm_imageUrl', imgUrl, items[i]);
                setValue('_fm_imageAttr', { alt: name }, items[i]);
            }
            else {
                setValue('_fm_icon', icon, items[i]);
            }
            setValue('_fm_htmlAttr', { class: className, title: name }, items[i]);
            i++;
        }
        return items;
    }
    onFinalizeEnd(args) {
        this.render(args);
    }
    onCreateEnd(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.clearSelect();
        this.selectItems([getValue(this.parent.hasId ? 'id' : 'name', this.parent.createdItem)]);
        this.parent.createdItem = null;
        this.parent.largeiconsviewModule.element.focus();
    }
    onSelectedData() {
        if (this.parent.activeModule === 'largeiconsview') {
            this.updateSelectedData();
        }
    }
    onDeleteInit() {
        if (this.parent.activeModule === 'largeiconsview') {
            Delete(this.parent, this.parent.selectedItems, this.parent.path, 'delete');
        }
    }
    /* istanbul ignore next */
    onDeleteEnd(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.parent.setProperties({ selectedItems: [] }, true);
        this.clearSelect();
    }
    onRefreshEnd(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
    }
    onRenameInit() {
        if (this.parent.activeModule === 'largeiconsview' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }
    onPathChanged(args) {
        this.parent.isCut = false;
        /* istanbul ignore next */
        if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
            this.parent.searchedItems = [];
        }
        if (this.parent.view === 'LargeIcons') {
            removeBlur(this.parent);
            this.parent.setProperties({ selectedItems: [] }, true);
            this.onLayoutChange(args);
            if (this.parent.renamedItem) {
                this.clearSelect();
                this.addSelection(this.parent.renamedItem);
                this.parent.renamedItem = null;
            }
        }
    }
    onOpenInit(args) {
        if (this.parent.activeModule === 'largeiconsview') {
            this.doOpenAction(args.target);
        }
    }
    onHideLayout() {
        if (this.parent.view !== 'LargeIcons' && this.element) {
            this.element.classList.add(DISPLAY_NONE);
        }
    }
    onSelectAllInit() {
        if (this.parent.view === 'LargeIcons') {
            this.startItem = this.getFirstItem();
            let lastItem = this.getLastItem();
            let eveArgs = { ctrlKey: true, shiftKey: true };
            this.doSelection(lastItem, eveArgs);
            this.isInteraction = true;
            this.isInteracted = true;
        }
    }
    onClearAllInit() {
        if (this.parent.view === 'LargeIcons') {
            this.clearSelection();
            this.isInteraction = true;
            this.isInteracted = true;
        }
    }
    onBeforeRequest() {
        this.isRendered = false;
    }
    onAfterRequest() {
        this.isRendered = true;
    }
    /* istanbul ignore next */
    onSearch(args) {
        if (this.parent.view === 'LargeIcons') {
            this.parent.setProperties({ selectedItems: [] }, true);
            this.parent.notify(selectionChanged, {});
            this.parent.searchedItems = args.files;
            this.onLayoutChange(args);
        }
    }
    onLayoutRefresh() {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.adjustHeight();
    }
    onUpdateSelectionData() {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.updateSelectedData();
    }
    onPathColumn() {
        if (this.parent.view === 'LargeIcons' && !isNullOrUndefined(this.listObj) &&
            this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered
            && this.parent.sortBy === 'filterPath') {
            this.parent.sortBy = 'name';
            this.parent.notify(sortByChange, {});
        }
    }
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(pathColumn, this.onPathColumn);
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(selectedData, this.onSelectedData);
        this.parent.off(deleteInit, this.onDeleteInit);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(search, this.onSearch);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(openEnd, this.onPathChanged);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(methodCall, this.onMethodCall);
        this.parent.off(actionFailure, this.onActionFailure);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onPathChanged);
        this.parent.off(hideLayout, this.onHideLayout);
        this.parent.off(selectAllInit, this.onSelectAllInit);
        this.parent.off(clearAllInit, this.onClearAllInit);
        this.parent.off(menuItemData, this.onMenuItemData);
        this.parent.off(beforeRequest, this.onBeforeRequest);
        this.parent.off(afterRequest, this.onAfterRequest);
        this.parent.off(splitterResize, this.splitterResizeHandler);
        this.parent.off(resizeEnd, this.resizeHandler);
        this.parent.off(pasteInit, this.onpasteInit);
        this.parent.off(pasteEnd, this.onpasteEnd);
        this.parent.off(cutCopyInit, this.oncutCopyInit);
        this.parent.off(dropInit, this.onDropInit);
        this.parent.off(detailsInit, this.onDetailsInit);
        this.parent.off(layoutRefresh, this.onLayoutRefresh);
        this.parent.off(dropPath, this.onDropPath);
        this.parent.off(updateSelectionData, this.onUpdateSelectionData);
        this.parent.off(filterEnd, this.onPathChanged);
    }
    addEventListener() {
        this.parent.on(pathColumn, this.onPathColumn, this);
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(selectedData, this.onSelectedData, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(deleteInit, this.onDeleteInit, this);
        this.parent.on(pasteInit, this.onpasteInit, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(search, this.onSearch, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onPathChanged, this);
        this.parent.on(openEnd, this.onPathChanged, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(methodCall, this.onMethodCall, this);
        this.parent.on(actionFailure, this.onActionFailure, this);
        this.parent.on(hideLayout, this.onHideLayout, this);
        this.parent.on(selectAllInit, this.onSelectAllInit, this);
        this.parent.on(clearAllInit, this.onClearAllInit, this);
        this.parent.on(menuItemData, this.onMenuItemData, this);
        this.parent.on(beforeRequest, this.onBeforeRequest, this);
        this.parent.on(afterRequest, this.onAfterRequest, this);
        this.parent.on(dropInit, this.onDropInit, this);
        this.parent.on(detailsInit, this.onDetailsInit, this);
        this.parent.on(splitterResize, this.splitterResizeHandler, this);
        this.parent.on(resizeEnd, this.resizeHandler, this);
        this.parent.on(pasteEnd, this.onpasteEnd, this);
        this.parent.on(cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(layoutRefresh, this.onLayoutRefresh, this);
        this.parent.on(dropPath, this.onDropPath, this);
        this.parent.on(updateSelectionData, this.onUpdateSelectionData, this);
        this.parent.on(filterEnd, this.onPathChanged, this);
    }
    onActionFailure() { this.isInteraction = true; this.isInteracted = true; }
    onMenuItemData(args) {
        if (this.parent.activeModule === this.getModuleName()) {
            let ele = closest(args.target, 'li');
            this.parent.itemData = [this.getItemObject(ele)];
        }
    }
    onDetailsInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            if (this.parent.selectedItems.length !== 0) {
                this.updateSelectedData();
            }
            else {
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
            }
        }
    }
    onpasteInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = (this.parent.folderPath === '') ? [getPathObject(this.parent)] :
                [this.getItemObject(select('.e-active', this.element))];
        }
    }
    oncutCopyInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            let activeEle = this.element.querySelectorAll('.' + ACTIVE);
            this.parent.activeRecords = [];
            this.parent.activeElements = [];
            for (let i = 0; i < activeEle.length; i++) {
                this.parent.activeElements.push(activeEle[i]);
                this.parent.activeRecords.push(this.getItemObject(activeEle[i]));
            }
        }
    }
    onpasteEnd(args) {
        if (this.parent.view === 'LargeIcons') {
            this.isPasteOperation = true;
            if (this.parent.path === this.parent.destinationPath || this.parent.path === getDirectoryPath(this.parent, args)) {
                this.onPathChanged(args);
            }
        }
    }
    onDropPath(args) {
        if (this.parent.view === 'LargeIcons') {
            this.isPasteOperation = true;
            this.onPathChanged(args);
        }
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.createDragObj();
                    break;
                case 'height':
                    this.adjustHeight();
                    break;
                case 'selectedItems':
                    this.isInteraction = false;
                    this.isInteracted = false;
                    let currentSelected = isNullOrUndefined(this.parent.selectedItems) ? [] : this.parent.selectedItems.slice(0);
                    currentSelected = this.parent.allowMultiSelection ? currentSelected :
                        currentSelected.slice(currentSelected.length - 1);
                    this.parent.setProperties({ selectedItems: [] }, true);
                    this.onClearAllInit();
                    if (currentSelected.length) {
                        this.selectItems(currentSelected);
                    }
                    this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                    this.isInteraction = true;
                    this.isInteracted = true;
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
                    if (this.parent.view !== 'LargeIcons') {
                        break;
                    }
                    refresh(this.parent);
                    break;
                case 'view':
                    updateLayout(this.parent, 'LargeIcons');
                    break;
            }
        }
    }
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.listObj) {
            this.unWireEvents();
        }
    }
    wireEvents() {
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
    }
    unWireEvents() {
        this.wireClickEvent(false);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        this.keyboardModule.destroy();
        this.keyboardDownModule.destroy();
    }
    /* istanbul ignore next */
    onMouseOver(e) {
        let targetEle = closest(e.target, '.e-list-item');
        removeBlur(this.parent, 'hover');
        if (targetEle !== null) {
            targetEle.classList.add(HOVER);
        }
    }
    wireClickEvent(toBind) {
        if (toBind) {
            let proxy = this;
            this.clickObj = new Touch(this.element, {
                tap: (eve) => {
                    eve.originalEvent.preventDefault();
                    if (proxy.parent.isDevice) {
                        proxy.tapCount = eve.tapCount;
                        proxy.tapEvent = eve;
                        setTimeout(() => {
                            if (proxy.tapCount > 0) {
                                proxy.doTapAction(proxy.tapEvent);
                            }
                            proxy.tapCount = 0;
                        }, 350);
                    }
                    else {
                        if (eve.tapCount === 2 && eve.originalEvent.which !== 3) {
                            proxy.dblClickHandler(eve);
                        }
                        else {
                            proxy.clickHandler(eve);
                        }
                    }
                },
                tapHold: (e) => {
                    if (proxy.parent.isDevice) {
                        proxy.multiSelect = proxy.parent.allowMultiSelection ? true : false;
                        if (proxy.parent.allowMultiSelection) {
                            addClass([proxy.parent.element], MULTI_SELECT);
                        }
                        proxy.clickHandler(e);
                    }
                }
            });
        }
        else {
            if (this.clickObj) {
                this.clickObj.destroy();
            }
        }
    }
    doTapAction(eve) {
        let target = eve.originalEvent.target;
        let item = closest(target, '.' + LIST_ITEM);
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
    }
    clickHandler(e) {
        let target = e.originalEvent.target;
        removeBlur(this.parent, 'hover');
        this.doSelection(target, e.originalEvent);
        this.parent.activeModule = 'largeiconsview';
    }
    /** @hidden */
    doSelection(target, e) {
        let item = closest(target, '.' + LIST_ITEM);
        let cList = target.classList;
        this.parent.isFile = false;
        let action = 'select';
        if (e.which === 3 && !isNullOrUndefined(item) && item.classList.contains(ACTIVE)) {
            this.updateType(item);
            return;
        }
        else if (!isNullOrUndefined(item)) {
            if (this.parent.allowMultiSelection && item.classList.contains(ACTIVE)
                && (e.ctrlKey || target.classList.contains(CHECK))) {
                action = 'unselect';
            }
            let fileSelectionArgs = this.triggerSelection(action, item);
            if (fileSelectionArgs.cancel !== true) {
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
                    let startIndex = this.itemList.indexOf(this.startItem);
                    let endIndex = this.itemList.indexOf(item);
                    if (startIndex > endIndex) {
                        for (let i = startIndex; i >= endIndex; i--) {
                            this.addActive(this.itemList[i]);
                        }
                    }
                    else {
                        for (let i = startIndex; i <= endIndex; i++) {
                            this.addActive(this.itemList[i]);
                        }
                    }
                    this.addFocus(this.itemList[endIndex]);
                }
                else {
                    this.startItem = item;
                    if (this.parent.allowMultiSelection && item.classList.contains(ACTIVE)) {
                        this.removeActive(item);
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
        }
        else {
            this.clearSelection();
        }
    }
    dblClickHandler(e) {
        this.parent.activeModule = 'largeiconsview';
        let target = e.originalEvent.target;
        this.doOpenAction(target);
    }
    clearSelection() {
        this.clearSelect();
        this.resetMultiSelect();
        this.parent.notify(selectionChanged, {});
    }
    resetMultiSelect() {
        this.multiSelect = false;
        removeClass([this.parent.element], MULTI_SELECT);
    }
    doOpenAction(target) {
        if (isNullOrUndefined(target)) {
            return;
        }
        let item = closest(target, '.' + LIST_ITEM);
        this.parent.isFile = false;
        if (!isNullOrUndefined(item)) {
            this.updateType(item);
            let details = this.getItemObject(item);
            if (!hasReadAccess(details)) {
                createDeniedDialog(this.parent, details, permissionRead);
                return;
            }
            let eventArgs = { cancel: false, fileDetails: details, module: 'LargeIconsView' };
            this.parent.trigger('fileOpen', eventArgs, (fileOpenArgs) => {
                if (!fileOpenArgs.cancel) {
                    let text = getValue('name', details);
                    if (!this.parent.isFile) {
                        let val = this.parent.breadcrumbbarModule.searchObj.element.value;
                        if (val === '' && !this.parent.isFiltered) {
                            let id = getValue('id', details);
                            let newPath = this.parent.path + (isNullOrUndefined(id) ? text : id) + '/';
                            this.parent.setProperties({ path: newPath }, true);
                            this.parent.pathNames.push(text);
                            this.parent.pathId.push(getValue('_fm_id', details));
                            this.parent.itemData = [details];
                            openAction(this.parent);
                        }
                        else {
                            openSearchFolder(this.parent, details);
                        }
                        this.parent.isFiltered = false;
                        this.parent.setProperties({ selectedItems: [] }, true);
                    }
                    else {
                        let icon = fileType(details);
                        if (icon === ICON_IMAGE) {
                            let imgUrl = getImageUrl(this.parent, details);
                            createImageDialog(this.parent, text, imgUrl);
                        }
                    }
                }
            });
        }
    }
    updateType(item) {
        let folder = select('.' + FOLDER, item);
        this.parent.isFile = isNullOrUndefined(folder) ? true : false;
    }
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    keydownActionHandler(e) {
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
            case 'ctrlD':
                e.preventDefault();
                break;
            default:
                break;
        }
    }
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    keyActionHandler(e) {
        if (!this.isRendered) {
            return;
        }
        let fItem = this.getFocusedItem();
        let firstItem = this.getFirstItem();
        let lastItem = this.getLastItem();
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
                this.parent.notify(detailsInit, {});
                GetDetails(this.parent, this.parent.selectedItems, this.parent.path, 'details');
                break;
            case 'esc':
                removeActive(this.parent);
                break;
            case 'del':
            case 'shiftdel':
                this.performDelete();
                break;
            case 'ctrlC':
                copyFiles(this.parent);
                break;
            case 'ctrlV':
                this.parent.folderPath = '';
                pasteHandler(this.parent);
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                break;
            case 'f2':
                this.performRename();
                break;
            case 'ctrlD':
                this.doDownload();
                break;
        }
    }
    doDownload() {
        this.updateSelectedData();
        doDownload(this.parent);
    }
    performDelete() {
        if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
            this.updateSelectedData();
            let data = this.parent.itemData;
            for (let i = 0; i < data.length; i++) {
                if (!hasEditAccess(data[i])) {
                    createDeniedDialog(this.parent, data[i], permissionEdit);
                    return;
                }
            }
            createDialog(this.parent, 'Delete');
        }
    }
    performRename() {
        if (this.parent.selectedItems.length === 1) {
            this.updateRenameData();
            doRename(this.parent);
        }
    }
    updateRenameData() {
        let item = select('.' + LIST_ITEM + '.' + ACTIVE, this.element);
        let data = this.getItemObject(item);
        updateRenamingData(this.parent, data);
    }
    getVisitedItem() {
        let item = this.parent.selectedItems[this.parent.selectedItems.length - 1];
        let indexes = this.getIndexes([item], this.parent.hasId);
        return this.itemList[indexes[0]];
    }
    getFocusedItem() {
        return select('.' + LIST_ITEM + '.' + FOCUS, this.element);
    }
    getActiveItem() {
        return select('.' + LIST_ITEM + '.' + ACTIVE, this.element);
    }
    getFirstItem() {
        return this.itemList[0];
    }
    getLastItem() {
        return this.itemList[this.itemList.length - 1];
    }
    navigateItem(item) {
        this.setFocus(item);
    }
    navigateDown(fItem, isTowards) {
        let nItem = this.getNextItem(fItem, isTowards, this.perRow);
        this.setFocus(nItem);
    }
    navigateRight(fItem, isTowards) {
        let nItem = this.getNextItem(fItem, isTowards);
        this.setFocus(nItem);
    }
    getNextItem(li, isTowards, perRow) {
        if (isNullOrUndefined(li)) {
            return this.getFocusedItem() || this.getActiveItem() || this.getFirstItem();
        }
        let index = this.itemList.indexOf(li);
        let nextItem;
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
    }
    setFocus(nextItem) {
        if (!isNullOrUndefined(nextItem)) {
            let fileSelectionArgs = this.triggerSelection('select', nextItem);
            if (fileSelectionArgs.cancel !== true) {
                this.startItem = nextItem;
                this.clearSelect();
                this.addActive(nextItem);
                this.addFocus(nextItem);
                this.parent.notify(selectionChanged, {});
                this.triggerSelect('select', nextItem);
            }
        }
    }
    spaceKey(fItem) {
        if (!isNullOrUndefined(fItem) && !fItem.classList.contains(ACTIVE)) {
            let fileSelectionArgs = this.triggerSelection('select', fItem);
            if (fileSelectionArgs.cancel !== true) {
                this.addActive(fItem);
                this.parent.notify(selectionChanged, {});
                this.triggerSelect('select', fItem);
            }
        }
    }
    ctrlAKey(firstItem, lastItem) {
        if (this.parent.allowMultiSelection && !isNullOrUndefined(firstItem)) {
            this.startItem = firstItem;
            let eveArgs = { ctrlKey: true, shiftKey: true };
            this.doSelection(lastItem, eveArgs);
        }
    }
    csEndKey(lastItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(lastItem);
        }
        else if (!isNullOrUndefined(lastItem)) {
            (e.action === 'ctrlEnd') ? this.addFocus(lastItem) : this.doSelection(lastItem, e);
        }
    }
    csHomeKey(firstItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateItem(firstItem);
        }
        else if (!isNullOrUndefined(firstItem)) {
            (e.action === 'ctrlHome') ? this.addFocus(firstItem) : this.doSelection(firstItem, e);
        }
    }
    csDownKey(fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, true);
        }
        else {
            let dItem = this.getNextItem(fItem, true, this.perRow);
            if (!isNullOrUndefined(dItem)) {
                (e.action === 'ctrlDown') ? this.addFocus(dItem) : this.doSelection(dItem, e);
            }
        }
    }
    csLeftKey(fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, false);
        }
        else {
            let lItem = this.getNextItem(fItem, false);
            if (!isNullOrUndefined(lItem)) {
                (e.action === 'ctrlLeft') ? this.addFocus(lItem) : this.doSelection(lItem, e);
            }
        }
    }
    csRightKey(fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateRight(fItem, true);
        }
        else {
            let rItem = this.getNextItem(fItem, true);
            if (!isNullOrUndefined(rItem)) {
                (e.action === 'ctrlRight') ? this.addFocus(rItem) : this.doSelection(rItem, e);
            }
        }
    }
    csUpKey(fItem, e) {
        if (!this.parent.allowMultiSelection) {
            this.navigateDown(fItem, false);
        }
        else {
            let uItem = this.getNextItem(fItem, false, this.perRow);
            if (!isNullOrUndefined(uItem)) {
                (e.action === 'ctrlUp') ? this.addFocus(uItem) : this.doSelection(uItem, e);
            }
        }
    }
    addActive(nextItem) {
        if (!isNullOrUndefined(nextItem)) {
            if (!nextItem.classList.contains(ACTIVE)) {
                this.parent.selectedItems.push(this.getDataName(nextItem));
                this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                addClass([nextItem], [ACTIVE]);
                nextItem.setAttribute('aria-selected', 'true');
                this.checkState(nextItem, true);
            }
            this.parent.visitedItem = nextItem;
        }
    }
    removeActive(preItem) {
        if (!isNullOrUndefined(preItem)) {
            removeClass([preItem], [ACTIVE]);
            if (this.parent.allowMultiSelection) {
                preItem.setAttribute('aria-selected', 'false');
            }
            else {
                preItem.removeAttribute('aria-selected');
            }
            this.checkState(preItem, false);
            let index = this.parent.selectedItems.indexOf(this.getDataName(preItem));
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
                this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
            }
            this.parent.visitedItem = null;
        }
    }
    getDataName(item) {
        let data = this.getItemObject(item);
        return getItemName(this.parent, data);
    }
    addFocus(item) {
        this.element.setAttribute('tabindex', '-1');
        let fItem = this.getFocusedItem();
        if (fItem) {
            fItem.removeAttribute('tabindex');
            removeClass([fItem], [FOCUS]);
        }
        addClass([item], [FOCUS]);
        item.setAttribute('tabindex', '0');
        item.focus();
    }
    checkState(item, toCheck) {
        if (!this.parent.allowMultiSelection) {
            return;
        }
        let checkEle = select('.' + FRAME, item);
        if (isNullOrUndefined(checkEle)) {
            return;
        }
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
    }
    clearSelect() {
        let eles = Array.prototype.slice.call(selectAll('.' + ACTIVE, this.listElements));
        let fileSelectionArgs;
        if (eles.length !== 0) {
            fileSelectionArgs = this.triggerSelection('unselect', eles[0]);
            if (fileSelectionArgs.cancel !== true) {
                for (let i = 0, len = eles.length; i < len; i++) {
                    this.removeActive(eles[i]);
                }
            }
            this.triggerSelect('unselect', eles[0]);
        }
    }
    resizeHandler() {
        this.getItemCount();
        if (!isNullOrUndefined(this.listObj)) {
            this.adjustHeight();
        }
    }
    splitterResizeHandler() {
        this.getItemCount();
    }
    getItemCount() {
        let perRow = 1;
        if (this.itemList) {
            for (let i = 0, len = this.itemList.length - 1; i < len; i++) {
                if (this.itemList[i].getBoundingClientRect().top === this.itemList[i + 1].getBoundingClientRect().top) {
                    perRow++;
                }
                else {
                    break;
                }
            }
        }
        this.perRow = perRow;
    }
    triggerSelection(action, item) {
        let data = this.getItemObject(item);
        let eventArgs = {
            action: action, fileDetails: data, isInteracted: this.isInteraction, cancel: false, target: item
        };
        this.parent.trigger('fileSelection', eventArgs);
        this.isInteraction = true;
        return eventArgs;
    }
    triggerSelect(action, item) {
        let data = this.getItemObject(item);
        this.parent.visitedData = data;
        let eventArgs = { action: action, fileDetails: data, isInteracted: this.isInteracted };
        this.parent.trigger('fileSelect', eventArgs);
        this.isInteracted = true;
    }
    selectItems(items) {
        let indexes = this.getIndexes(items, this.parent.hasId);
        for (let j = 0, len = indexes.length; j < len; j++) {
            let eveArgs = { ctrlKey: true, shiftKey: false };
            this.doSelection(this.itemList[indexes[j]], eveArgs);
        }
    }
    getIndexes(items, byId) {
        let indexes = [];
        let filter$$1 = byId ? 'id' : 'name';
        for (let i = 0, len = this.items.length; i < len; i++) {
            if (items.indexOf(getValue(filter$$1, this.items[i])) !== -1) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    getItemObject(item) {
        let index = this.itemList.indexOf(item);
        return this.items[index];
    }
    addSelection(data) {
        let resultData = [];
        if (this.parent.hasId) {
            resultData = new DataManager(this.items).
                executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
        }
        else {
            let newData = new DataManager(this.items).
                executeLocal(new Query().where('name', 'equal', getValue('name', data), false));
            if (newData.length > 0) {
                resultData = new DataManager(newData).
                    executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
            }
        }
        if (resultData.length > 0) {
            let index = this.items.indexOf(resultData[0]);
            let eveArgs = { ctrlKey: true, shiftKey: false };
            this.doSelection(this.itemList[index], eveArgs);
        }
    }
    updateSelectedData() {
        let data = [];
        let items = selectAll('.' + LIST_ITEM + '.' + ACTIVE, this.element);
        for (let i = 0; i < items.length; i++) {
            data[i] = this.getItemObject(items[i]);
        }
        this.parent.itemData = data;
    }
    onMethodCall(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        let action = getValue('action', args);
        switch (action) {
            case 'deleteFiles':
                this.deleteFiles(getValue('ids', args));
                break;
            case 'downloadFiles':
                this.downloadFiles(getValue('ids', args));
                break;
            case 'openFile':
                this.openFile(getValue('id', args));
                break;
            case 'renameFile':
                this.isInteraction = false;
                this.isInteracted = false;
                this.renameFile(getValue('id', args), getValue('newName', args));
                break;
            case 'createFolder':
                this.isInteraction = false;
                this.isInteracted = false;
                break;
            case 'clearSelection':
                this.isInteraction = false;
                this.isInteracted = false;
                this.onClearAllInit();
                break;
            case 'selectAll':
                this.isInteraction = false;
                this.isInteracted = false;
                this.onSelectAllInit();
                break;
        }
    }
    getItemsIndex(items) {
        let indexes = [];
        let isFilter = (this.parent.breadcrumbbarModule.searchObj.element.value !== '' || this.parent.isFiltered) ? true : false;
        let filterName = this.parent.hasId ? 'id' : 'name';
        if (this.parent.hasId || !isFilter) {
            for (let i = 0, len = this.items.length; i < len; i++) {
                if (items.indexOf(getValue(filterName, this.items[i])) !== -1) {
                    indexes.push(i);
                }
            }
        }
        else {
            for (let i = 0, len = this.items.length; i < len; i++) {
                let name = getValue('filterPath', this.items[i]) + getValue('name', this.items[i]);
                if (items.indexOf(name) !== -1) {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }
    deleteFiles(ids) {
        this.parent.activeModule = 'largeiconsview';
        if (isNullOrUndefined(ids)) {
            this.performDelete();
            return;
        }
        let indexes = this.getItemsIndex(ids);
        if (indexes.length === 0) {
            return;
        }
        let data = [];
        let newIds = [];
        for (let i = 0; i < indexes.length; i++) {
            data[i] = this.items[indexes[i]];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDeleteFiles(this.parent, data, newIds);
    }
    downloadFiles(ids) {
        if (isNullOrUndefined(ids)) {
            this.doDownload();
            return;
        }
        let index = this.getItemsIndex(ids);
        if (index.length === 0) {
            return;
        }
        let data = [];
        let newIds = [];
        for (let i = 0; i < index.length; i++) {
            data[i] = this.items[index[i]];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDownloadFiles(this.parent, data, newIds);
    }
    openFile(id) {
        if (isNullOrUndefined(id)) {
            return;
        }
        let indexes = this.getItemsIndex([id]);
        if (indexes.length > 0) {
            this.doOpenAction(this.itemList[indexes[0]]);
        }
    }
    renameFile(id, name) {
        this.parent.activeModule = 'largeiconsview';
        if (isNullOrUndefined(id)) {
            this.performRename();
            return;
        }
        let indexes = this.getItemsIndex([id]);
        if (indexes.length > 0) {
            updateRenamingData(this.parent, this.items[indexes[0]]);
            if (isNullOrUndefined(name)) {
                doRename(this.parent);
            }
            else {
                if (!hasEditAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], permissionEdit);
                }
                else {
                    rename(this.parent, this.parent.path, name);
                }
            }
        }
    }
}

/**
 * BreadCrumbBar module
 */
class BreadCrumbBar {
    /**
     * constructor for addressbar module
     * @hidden
     */
    constructor(parent) {
        this.addressPath = '';
        this.addressBarLink = '';
        this.searchTimer = null;
        this.searchWrapWidth = null;
        this.parent = parent;
        this.keyConfigs = {
            enter: 'enter'
        };
        this.render();
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'searchSettings':
                    let value = e.newProp.searchSettings;
                    if (!isNullOrUndefined(value.allowSearchOnTyping)) {
                        this.searchEventBind(value.allowSearchOnTyping);
                    }
                    if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value !== '' &&
                        !(!isNullOrUndefined(value.allowSearchOnTyping) && isNullOrUndefined(value.filterType) &&
                            isNullOrUndefined(value.ignoreCase))) {
                        searchWordHandler(this.parent, this.parent.breadcrumbbarModule.searchObj.value, false);
                    }
                    break;
            }
        }
    }
    render() {
        this.addEventListener();
    }
    onPathChange() {
        let pathNames = this.parent.pathNames;
        let paths = this.parent.path.split('/');
        let addressbarUL = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        let addressbarLI = null;
        let pathNamesLen = pathNames.length;
        if (pathNames.length > 0) {
            let id = '';
            for (let i = 0; i < pathNamesLen; i++) {
                let addressATag = null;
                addressbarLI = this.parent.createElement('li', { className: 'e-address-list-item' });
                for (let j = 0; j <= i; j++) {
                    id = id + paths[j] + '/';
                }
                addressbarLI.setAttribute('data-utext', id);
                if (i !== 0) {
                    let icon = createElement('span', { className: ICONS });
                    addressbarLI.appendChild(icon);
                }
                if (pathNamesLen - i !== 1) {
                    addressATag = createElement('a', { className: LIST_TEXT });
                    addressbarLI.setAttribute('tabindex', '0');
                }
                else {
                    addressATag = createElement('span', { className: LIST_TEXT });
                }
                id = '';
                addressATag.innerText = pathNames[i];
                addressbarLI.appendChild(addressATag);
                addressbarUL.appendChild(addressbarLI);
            }
            let ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
            if (!isNullOrUndefined(ulElement)) {
                if (!isNullOrUndefined(this.subMenuObj)) {
                    this.subMenuObj.destroy();
                }
                remove(ulElement);
            }
            let searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
            if (!searchWrap) {
                this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
            }
            else {
                this.parent.breadCrumbBarNavigation.appendChild(addressbarUL);
            }
            this.updateBreadCrumbBar(addressbarUL);
        }
    }
    /* istanbul ignore next */
    updateBreadCrumbBar(addresBarUL) {
        let liElements = addresBarUL.querySelectorAll('li');
        let ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
        let style = window.getComputedStyle(ulElement, null);
        let pRight = parseFloat(style.getPropertyValue('padding-right'));
        let pLeft = parseFloat(style.getPropertyValue('padding-left'));
        let breadCrumbBarWidth = ulElement.offsetWidth - pRight - pLeft;
        let addressbarUL = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        let liElementsWidth = 0;
        let liElementsWidths = [];
        for (let i = 0; i < liElements.length; i++) {
            let width = liElements[i].clientWidth;
            liElementsWidths.push(width);
            liElementsWidth = liElementsWidth + width;
        }
        if (!isNullOrUndefined(ulElement)) {
            remove(ulElement);
        }
        let searchContainer = this.parent.createElement('div');
        searchContainer.setAttribute('class', 'e-search-wrap');
        let id = this.parent.element.id + SEARCH_ID;
        let searchInput = createElement('input', { id: id,
            attrs: { autocomplete: 'off', 'aria-label': getLocaleText(this.parent, 'Search') } });
        searchContainer.appendChild(searchInput);
        let searchEle = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap .e-input');
        if (isNullOrUndefined(searchEle)) {
            this.parent.breadCrumbBarNavigation.appendChild(searchContainer);
            let span = createElement('span', { className: 'e-icons e-fe-search' });
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
            let search$$1 = this.searchObj.element.nextElementSibling;
            EventHandler.add(search$$1, 'mousedown', this.searchChangeHandler.bind(this), this);
            EventHandler.add(this.searchObj.element, 'keyup', this.onKeyUp.bind(this), this);
        }
        let searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
        breadCrumbBarWidth = breadCrumbBarWidth - (this.searchWrapWidth ? this.searchWrapWidth : searchWrap.offsetWidth);
        if (liElementsWidth > breadCrumbBarWidth) {
            let i = liElements.length;
            while (i--) {
                let diff = breadCrumbBarWidth - liElementsWidths[i];
                if (diff > 40) {
                    addressbarUL.insertBefore(liElements[i], addressbarUL.querySelector('li'));
                    breadCrumbBarWidth = diff;
                }
                else {
                    let items = [];
                    for (let j = 0; j <= i; j++) {
                        let liElement = liElements[j];
                        items.push({
                            text: liElement.innerText,
                            utext: liElement.getAttribute('data-utext')
                        });
                    }
                    let subMenuLi = this.parent.createElement('li', { className: 'e-breadcrumb-menu' });
                    let attributes = { className: 'e-breadcrumb-submenu' };
                    let subMenuSpan = this.parent.createElement('button', attributes);
                    subMenuLi.appendChild(subMenuSpan);
                    addressbarUL.insertBefore(subMenuLi, addressbarUL.querySelector('li'));
                    this.subMenuObj = new DropDownButton({
                        items: items,
                        cssClass: 'e-caret-hide e-submenu',
                        iconCss: ICON_BREADCRUMB,
                        iconPosition: 'Top',
                        enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                        beforeItemRender: this.addSubMenuAttributes.bind(this),
                        select: this.subMenuSelectOperations.bind(this)
                    });
                    this.subMenuObj.isStringTemplate = true;
                    this.subMenuObj.appendTo(subMenuSpan);
                    break;
                }
            }
            this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
        }
        else {
            this.parent.breadCrumbBarNavigation.insertBefore(addresBarUL, searchWrap);
        }
    }
    /* istanbul ignore next */
    onFocus() {
        let wrap = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.add('e-focus');
    }
    /* istanbul ignore next */
    onKeyUp() {
        this.parent.notify(pathColumn, { args: this.parent });
    }
    /* istanbul ignore next */
    onBlur() {
        let wrap = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.remove('e-focus');
    }
    /* istanbul ignore next */
    subMenuSelectOperations(event) {
        let args = { target: event.element };
        this.addressPathClickHandler(args);
    }
    /* istanbul ignore next */
    addSubMenuAttributes(args) {
        args.element.setAttribute('data-utext', getValue('utext', args.item));
        let anchor = this.parent.createElement('a', { className: 'e-list-text' });
        args.element.appendChild(anchor);
    }
    searchEventBind(allow) {
        if (allow) {
            this.searchObj.input = this.searchChangeHandler.bind(this);
            this.searchObj.change = null;
        }
        else {
            this.searchObj.change = this.searchChangeHandler.bind(this);
            this.searchObj.input = null;
        }
    }
    searchChangeHandler(args) {
        if (!isNullOrUndefined(args.value)) {
            this.parent.isFiltered = false;
            if (this.parent.searchSettings.allowSearchOnTyping) {
                window.clearTimeout(this.searchTimer);
                this.searchTimer = window.setTimeout(() => { searchWordHandler(this.parent, args.value, false); }, 300);
            }
            else {
                searchWordHandler(this.parent, args.value, false);
            }
        }
    }
    addressPathClickHandler(e) {
        let li = e.target;
        if (li.nodeName === 'LI' || li.nodeName === 'A') {
            let node = li.nodeName === 'LI' ? li.children[0] : li;
            if (!isNullOrUndefined(node)) {
                this.parent.isFiltered = false;
                let currentPath = this.updatePath(node);
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
                this.triggerFileOpen(this.parent.itemData[0]);
                read(this.parent, pathChanged, currentPath);
                let treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        }
    }
    triggerFileOpen(data) {
        let eventArgs = { cancel: false, fileDetails: data, module: 'BreadCrumbBar' };
        delete eventArgs.cancel;
        this.parent.trigger('fileOpen', eventArgs);
    }
    /* istanbul ignore next */
    onShowInput() {
        if (this.parent.isMobile) {
            if (this.parent.element.classList.contains(FILTER)) {
                removeClass([this.parent.element], FILTER);
                this.searchWrapWidth = null;
            }
            else {
                let searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
                this.searchWrapWidth = searchWrap.offsetWidth;
                addClass([this.parent.element], FILTER);
                this.searchObj.element.focus();
            }
        }
    }
    updatePath(list) {
        let li = closest(list, 'li');
        let liElementId = li.getAttribute('data-utext');
        this.addressBarLink = liElementId;
        let link = this.addressBarLink.split('/');
        let ids = this.parent.pathId;
        let names = this.parent.pathNames;
        this.parent.pathId = [];
        this.parent.pathNames = [];
        let newpath = '';
        for (let i = 0, len = link.length - 1; i < len; i++) {
            this.parent.pathId.push(ids[i]);
            this.parent.pathNames.push(names[i]);
            newpath += link[i] + '/';
        }
        this.parent.setProperties({ path: newpath }, true);
        return newpath;
    }
    onUpdatePath() {
        this.onPathChange();
        this.removeSearchValue();
    }
    onCreateEnd() {
        this.onPathChange();
    }
    onRenameEnd() {
        this.onPathChange();
    }
    /* istanbul ignore next */
    onDeleteEnd() {
        this.onUpdatePath();
    }
    /* istanbul ignore next */
    removeSearchValue() {
        this.parent.isFiltered = false;
        if (this.searchObj && (this.searchObj.value !== '' || this.searchObj.element.value !== '')) {
            this.searchObj.value = '';
            this.searchObj.element.value = '';
            this.searchObj.dataBind();
        }
    }
    onResize() {
        this.onPathChange();
    }
    onPasteEnd(args) {
        this.onPathChange();
    }
    addEventListener() {
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
        this.parent.on(renameEnd, this.onRenameEnd, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(splitterResize, this.onResize, this);
        this.parent.on(pasteEnd, this.onPasteEnd, this);
        this.parent.on(resizeEnd, this.onResize, this);
        this.parent.on(searchTextChange, this.onSearchTextChange, this);
        this.parent.on(dropInit, this.onDropInit, this);
        this.parent.on(layoutRefresh, this.onResize, this);
        this.parent.on(dropPath, this.onPathChange, this);
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'enter':
                this.addressPathClickHandler(e);
                break;
        }
    }
    removeEventListener() {
        this.keyboardModule.destroy();
        this.parent.off(pathChanged, this.onUpdatePath);
        this.parent.off(finalizeEnd, this.onUpdatePath);
        this.parent.off(refreshEnd, this.onUpdatePath);
        this.parent.off(openEnd, this.onUpdatePath);
        this.parent.off(pasteEnd, this.onPasteEnd);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(renameEnd, this.onRenameEnd);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(splitterResize, this.onResize);
        this.parent.off(resizeEnd, this.onResize);
        this.parent.off(searchTextChange, this.onSearchTextChange);
        this.parent.off(dropInit, this.onDropInit);
        this.parent.off(layoutRefresh, this.onResize);
        this.parent.off(dropPath, this.onPathChange);
    }
    /* istanbul ignore next */
    onDropInit(args) {
        if (this.parent.targetModule === this.getModuleName()) {
            let liEle = args.target.closest('li');
            this.parent.dropPath = this.updatePath((liEle.children[0]));
            this.parent.dropData = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            this.triggerFileOpen(this.parent.dropData);
            let treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
            this.parent.notify(updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
        }
    }
    /**
     * For internal use only - Get the module name.
     *  @private
     */
    getModuleName() {
        return 'breadcrumbbar';
    }
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        /* istanbul ignore next */
        if (!isNullOrUndefined(this.subMenuObj)) {
            this.subMenuObj.destroy();
        }
        if (!isNullOrUndefined(this.searchObj)) {
            this.searchObj.destroy();
        }
    }
    onSearchTextChange(args) {
        this.searchObj.element.placeholder = getLocaleText(this.parent, 'Search') + ' ' + args.cwd.name;
    }
}

/**
 * ContextMenu module
 */
class ContextMenu$2 {
    /**
     * Constructor for the ContextMenu module
     * @hidden
     */
    constructor(parent) {
        this.currentItems = [];
        this.currentElement = null;
        this.disabledItems = [];
        this.parent = parent;
        this.render();
    }
    render() {
        this.keyConfigs = {
            downarrow: 'downarrow',
            uparrow: 'uparrown'
        };
        this.contextMenu = new ContextMenu({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: '#' + this.parent.element.id,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            beforeItemRender: this.onBeforeItemRender.bind(this),
            select: this.onSelect.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this),
            cssClass: getCssClass(this.parent, ROOT_POPUP)
        });
        this.contextMenu.isStringTemplate = true;
        this.contextMenu.appendTo('#' + this.parent.element.id + CONTEXT_MENU_ID);
        this.addEventListener();
    }
    /* istanbul ignore next */
    onBeforeItemRender(args) {
        if (args.item.id === this.getMenuId('largeiconsview')) {
            let iconSpan = createElement('span');
            let element = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'LargeIcons' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', ICON_LARGE + ' ' + MENU_ICON);
        }
        if (args.item.id === this.getMenuId('detailsview')) {
            let iconSpan = createElement('span');
            let element = args.element;
            element.insertBefore(iconSpan, this.parent.view === 'Details' ? element.childNodes[1] : element.childNodes[0]);
            iconSpan.setAttribute('class', ICON_GRID + ' ' + MENU_ICON);
        }
    }
    onBeforeClose() {
        this.menuTarget = null;
    }
    /* istanbul ignore next */
    onBeforeOpen(args) {
        this.disabledItems = [];
        let selected = false;
        let uid;
        // tslint:disable-next-line
        let data;
        let treeFolder = false;
        let target = args.event.target;
        this.menuTarget = target;
        this.currentElement = args.element;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(FULLROW)[0];
            this.menuTarget = target;
        }
        if (target.classList.contains(FULLROW)) {
            this.parent.selectedItems.length = 0;
        }
        this.targetElement = this.parent.view === 'Details' ? closest(target, 'tr') : target;
        let view = this.getTargetView(target);
        this.updateActiveModule();
        /* istanbul ignore next */
        if (target.classList.contains(TREE_VIEW) || closest(target, 'th') ||
            (closest(target, '#' + this.parent.element.id + BREADCRUMBBAR_ID)) ||
            (closest(target, '#' + this.parent.element.id + TOOLBAR_ID))) {
            args.cancel = true;
            // tslint:disable-next-line
        }
        else if (!(this.parent.view === 'LargeIcons') && this.targetElement &&
            this.targetElement.classList.contains('e-emptyrow')) {
            this.setLayoutItem(target);
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
                let eveArgs = { ctrlKey: true, shiftKey: true };
                if (!closest(target, 'li').classList.contains('e-active')) {
                    this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                }
                data = this.parent.visitedData;
                selected = true;
            }
            else if (!isNullOrUndefined(closest(target, 'tr'))) {
                uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data;
                if (isNullOrUndefined(this.targetElement.getAttribute('aria-selected'))) {
                    /* istanbul ignore next */
                    // tslint:disable-next-line
                    this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('aria-rowindex'), 10)]);
                }
                selected = true;
                /* istanbul ignore next */
            }
            else if (closest(target, '#' + this.parent.element.id + TREE_ID)) {
                uid = closest(target, 'li').getAttribute('data-uid');
                treeFolder = true;
            }
            /* istanbul ignore next */
            if (selected) {
                if (getValue('isFile', data) === true) {
                    this.setFileItem();
                }
                else {
                    this.setFolderItem(false);
                }
                /* istanbul ignore next */
            }
            else if (treeFolder) {
                this.setFolderItem(true);
                if (uid === this.parent.pathId[0]) {
                    this.disabledItems.push('Delete', 'Rename', 'Cut', 'Copy');
                }
                /* istanbul ignore next */
                // tslint:disable-next-line
            }
            else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                this.setLayoutItem(target);
                /* istanbul ignore next */
            }
            else {
                args.cancel = true;
            }
        }
        let pasteEle = select('#' + this.getMenuId('Paste'), this.contextMenu.element);
        if (!args.cancel && !this.parent.enablePaste &&
            pasteEle && !pasteEle.classList.contains('e-disabled')) {
            this.disabledItems.push('Paste');
        }
        if (args.cancel) {
            this.menuTarget = this.currentElement = null;
            return;
        }
        this.contextMenu.dataBind();
        let isSubMenu = false;
        if (target.classList.contains(MENU_ITEM) ||
            target.classList.contains(MENU_ICON) || target.classList.contains(SUBMENU_ICON)) {
            isSubMenu = true;
        }
        this.menuItemData = isSubMenu ? this.menuItemData : this.getMenuItemData();
        let eventArgs = {
            fileDetails: [this.menuItemData],
            element: args.element,
            target: target,
            items: isSubMenu ? args.items : this.contextMenu.items,
            menuModule: this.contextMenu,
            cancel: false,
            menuType: this.menuType,
            isSubMenu: isSubMenu
        };
        if (isBlazor()) {
            this.enableItems(this.disabledItems, false, true);
            delete eventArgs.menuModule;
        }
        this.currentItems = eventArgs.items;
        this.parent.trigger('menuOpen', eventArgs, (menuOpenArgs) => {
            if (!isSubMenu) {
                this.contextMenu.dataBind();
                this.contextMenu.items = menuOpenArgs.items;
                this.contextMenu.dataBind();
            }
            this.enableItems(this.disabledItems, false, true);
            args.cancel = menuOpenArgs.cancel;
            if (menuOpenArgs.cancel) {
                this.menuTarget = this.currentElement = null;
            }
        });
    }
    updateActiveModule() {
        this.parent.activeModule = closest(this.menuTarget, '#' + this.parent.element.id + TREE_ID) ?
            'navigationpane' : closest(this.menuTarget, '#' + this.parent.element.id + GRID_ID) ?
            'detailsview' : closest(this.menuTarget, '#' + this.parent.element.id + LARGEICON_ID) ?
            'largeiconsview' : this.parent.activeModule;
    }
    /* istanbul ignore next */
    /** @hidden */
    getTargetView(target) {
        return target.classList.contains(TREE_VIEW) ?
            'TreeView' : target.classList.contains(GRID_VIEW) ?
            'GridView' : target.classList.contains(ICON_VIEW) ?
            'LargeIcon' : target.classList.contains(LARGE_ICONS) ?
            'LargeIcon' : '';
    }
    getItemIndex(item) {
        let itemId = this.getMenuId(item);
        for (let i = 0; i < this.currentItems.length; i++) {
            if ((this.currentItems[i].id === itemId) || (this.currentItems[i].id === item)) {
                return i;
            }
        }
        return -1;
    }
    disableItem(items) {
        if (items.length !== 0) {
            this.disabledItems = this.disabledItems.concat(items);
        }
    }
    enableItems(items, enable, isUniqueId) {
        for (let i = 0; i < items.length; i++) {
            if (this.checkValidItem(items[i]) === 1) {
                this.contextMenu.enableItems([this.getMenuId(items[i])], enable, isUniqueId);
            }
            else if (this.checkValidItem(items[i]) === 2) {
                this.contextMenu.enableItems([items[i]], enable, isUniqueId);
            }
        }
    }
    setFolderItem(isTree) {
        this.menuType = 'folder';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder.map((item) => item.trim()));
        this.contextMenu.dataBind();
        if (isTree) {
            this.disabledItems.push('Open');
        }
        else if (this.parent.selectedItems.length !== 1) {
            this.disabledItems.push('Rename', 'Paste');
        }
    }
    setFileItem() {
        this.menuType = 'file';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file.map((item) => item.trim()));
        this.contextMenu.dataBind();
        if (this.parent.selectedItems.length !== 1) {
            this.disabledItems.push('Rename');
        }
    }
    setLayoutItem(target) {
        this.menuType = 'layout';
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout.map((item) => item.trim()));
        this.contextMenu.dataBind();
        if (!this.parent.allowMultiSelection || ((this.parent.view === 'LargeIcons' &&
            (closest(target, '#' + this.parent.element.id + LARGEICON_ID).getElementsByClassName(EMPTY).length !== 0))
            || (this.parent.view === 'Details' &&
                (closest(target, '#' + this.parent.element.id + GRID_ID).getElementsByClassName(EMPTY).length !== 0)))) {
            this.disabledItems.push('SelectAll');
        }
        if (this.parent.selectedNodes.length === 0) {
            this.disabledItems.push('Paste');
        }
        this.contextMenu.dataBind();
    }
    checkValidItem(nameEle) {
        if (!isNullOrUndefined(select('#' + this.getMenuId(nameEle), this.currentElement))) {
            return 1;
        }
        else if (!isNullOrUndefined(select('#' + nameEle, this.currentElement))) {
            return 2;
        }
        else {
            return -1;
        }
    }
    getMenuItemData() {
        if (this.menuType === 'layout') {
            return getPathObject(this.parent);
        }
        else {
            let args = { target: this.menuTarget };
            this.parent.notify(menuItemData, args);
            return this.parent.itemData[0];
        }
    }
    /* istanbul ignore next */
    onSelect(args) {
        if (isNullOrUndefined(args.item) || !args.item.id) {
            return;
        }
        let itemText = args.item.id.substr((this.parent.element.id + '_cm_').length);
        let details;
        if (itemText === 'refresh' || itemText === 'newfolder' || itemText === 'upload') {
            details = [getPathObject(this.parent)];
            this.parent.itemData = details;
        }
        else {
            this.parent.notify(selectedData, {});
            details = this.parent.itemData;
        }
        let eventArgs = {
            cancel: false,
            element: args.element,
            fileDetails: details,
            item: args.item
        };
        this.parent.trigger('menuClick', eventArgs, (menuClickArgs) => {
            if (!menuClickArgs.cancel) {
                // tslint:disable-next-line
                switch (itemText) {
                    case 'cut':
                        cutFiles(this.parent);
                        break;
                    case 'copy':
                        copyFiles(this.parent);
                        break;
                    case 'paste':
                        if (this.menuType === 'folder') {
                            if ((this.parent.activeModule === 'largeiconsview') || (this.parent.activeModule === 'detailsview')) {
                                this.parent.folderPath = getFullPath(this.parent, this.menuItemData, this.parent.path);
                            }
                            else {
                                this.parent.folderPath = '';
                            }
                        }
                        else {
                            this.parent.folderPath = '';
                        }
                        pasteHandler(this.parent);
                        break;
                    case 'delete':
                        for (let j = 0; j < details.length; j++) {
                            if (!hasEditAccess(details[j])) {
                                createDeniedDialog(this.parent, details[j], permissionEdit);
                                return;
                            }
                        }
                        createDialog(this.parent, 'Delete');
                        break;
                    /* istanbul ignore next */
                    case 'download':
                        for (let i = 0; i < details.length; i++) {
                            if (!hasDownloadAccess(details[i])) {
                                createDeniedDialog(this.parent, details[i], permissionDownload);
                                return;
                            }
                        }
                        if (this.parent.activeModule === 'navigationpane') {
                            this.parent.notify(downloadInit, {});
                        }
                        else if (this.parent.selectedItems.length > 0) {
                            Download(this.parent, this.parent.path, this.parent.selectedItems);
                        }
                        break;
                    case 'rename':
                        if (!hasEditAccess(details[0])) {
                            createDeniedDialog(this.parent, details[0], permissionEdit);
                        }
                        else {
                            this.parent.notify(renameInit, {});
                            createDialog(this.parent, 'Rename');
                        }
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
                        this.parent.notify(detailsInit, {});
                        let sItems = this.parent.selectedItems;
                        if (this.parent.activeModule === 'navigationpane') {
                            sItems = [];
                        }
                        GetDetails(this.parent, sItems, this.parent.path, 'details');
                        break;
                    case 'newfolder':
                        createNewFolder(this.parent);
                        break;
                    case 'upload':
                        uploadItem(this.parent);
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
                    /* istanbul ignore next */
                    case 'none':
                        /* istanbul ignore next */
                        sortbyClickHandler(this.parent, args);
                        break;
                    // tslint:disable-next-line
                    /* istanbul ignore next */
                    case 'largeiconsview':
                        updateLayout(this.parent, 'LargeIcons');
                        break;
                    // tslint:disable-next-line
                    /* istanbul ignore next */
                    case 'detailsview':
                        updateLayout(this.parent, 'Details');
                        break;
                }
            }
        });
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'cssClass':
                    this.contextMenu.cssClass = getCssClass(this.parent, ROOT_POPUP);
                    break;
            }
        }
    }
    addEventListener() {
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.keyboardModule = new KeyboardEvents(this.contextMenu.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    removeEventListener() {
        this.parent.off(destroy, this.destroy);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.keyboardModule.destroy();
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'uparrow':
            case 'downarrow':
                e.preventDefault();
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'contextmenu';
    }
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        this.contextMenu.destroy();
    }
    /* istanbul ignore next */
    getItemData(data) {
        let items = [];
        for (let i = 0; i < data.length; i++) {
            let item;
            let itemId = this.getMenuId(data[i]);
            let itemText = getLocaleText(this.parent, data[i]);
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
                                iconCss: this.parent.sortBy === '_fm_modified' ? TB_OPTION_DOT : null
                            },
                            { separator: true },
                            {
                                id: this.getMenuId('Ascending'), text: getLocaleText(this.parent, 'Ascending'),
                                iconCss: this.parent.sortOrder === 'Ascending' ? TB_OPTION_TICK : null
                            },
                            {
                                id: this.getMenuId('Descending'), text: getLocaleText(this.parent, 'Descending'),
                                iconCss: this.parent.sortOrder === 'Descending' ? TB_OPTION_TICK : null
                            },
                            {
                                id: this.getMenuId('None'), text: getLocaleText(this.parent, 'None'),
                                iconCss: this.parent.sortOrder === 'None' ? TB_OPTION_TICK : null
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
    }
    getMenuId(id) {
        return this.parent.element.id + '_cm_' + id.toLowerCase();
    }
}

/**
 * Specifies the default locale of FileManager component
 */
let defaultLocale = {
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
    'Path': 'Path',
    'Modified': 'Modified',
    'Created': 'Created',
    'Location': 'Location',
    'Type': 'Type',
    'Permission': 'Permission',
    'Ascending': 'Ascending',
    'Descending': 'Descending',
    'None': 'None',
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
    'Header-Folder-Delete': 'Delete Folder',
    'Content-Folder-Delete': 'Are you sure you want to delete this folder?',
    'Header-Multiple-Delete': 'Delete Multiple Items',
    'Content-Multiple-Delete': 'Are you sure you want to delete these {0} items?',
    'Header-Duplicate': 'File/Folder exists',
    'Content-Duplicate': '{0} already exists. Do you want to rename and paste?',
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
    'Search-Key': 'Try with different keywords',
    'Filter-Empty': 'No results found',
    'Filter-Key': 'Try with different filter',
    'Sub-Folder-Error': 'The destination folder is the subfolder of the source folder.',
    'Access-Denied': 'Access Denied',
    'Access-Details': 'You don"t have permission to access this folder.',
    'Header-Retry': 'File Already Exists',
    'Content-Retry': 'A file with this name already exists in this folder. What would you like to do?',
    'Button-Keep-Both': 'Keep both',
    'Button-Replace': 'Replace',
    'Button-Skip': 'Skip',
    'ApplyAll-Label': 'Do this for all current items',
    'KB': 'KB',
    'Access-Message': '{0} is not accessible. You need permission to perform the {1} action.',
    'Network-Error': 'NetworkError: Failed to send on XMLHTTPRequest: Failed to load',
    'Server-Error': 'ServerError: Invalid response from'
};

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileManager_1;
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
let FileManager = FileManager_1 = class FileManager extends Component {
    constructor(options, element) {
        super(options, element);
        this.filterData = null;
        this.selectedNodes = [];
        this.duplicateItems = [];
        this.duplicateRecords = [];
        this.previousPath = [];
        this.nextPath = [];
        this.isLayoutChange = false;
        this.layoutSelectedItems = [];
        this.renamedId = null;
        this.uploadItem = [];
        this.deleteRecords = [];
        this.isFile = false;
        this.sortBy = 'name';
        this.isCut = false;
        this.isSearchCut = false;
        this.isSearchDrag = false;
        this.isPasteError = false;
        this.folderPath = '';
        this.isSameAction = false;
        this.isFiltered = false;
        this.enablePaste = false;
        this.persistData = false;
        this.retryArgs = [];
        this.isOpened = false;
        this.isRetryOpened = false;
        this.isPathDrag = false;
        this.searchedItems = [];
        this.retryFiles = [];
        this.isApplySame = false;
        this.dragData = [];
        this.dragNodes = [];
        this.dragPath = '';
        this.dropPath = '';
        this.isDragDrop = false;
        this.treeExpandTimer = null;
        this.dragCursorPosition = { left: 44, top: 18 };
        this.isDropEnd = false;
        this.droppedObjects = [];
        this.uploadingCount = 0;
        this.uploadedCount = 0;
        FileManager_1.Inject(BreadCrumbBar, LargeIconsView, ContextMenu$2);
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'filemanager';
    }
    /**
     * Initialize the event handler
     */
    preRender() {
        this.ensurePath();
        this.feParent = [];
        this.feFiles = [];
        setStyleAttribute(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.isDevice = Browser.isDevice;
        this.isMobile = this.checkMobile();
        if (this.isMobile) {
            this.setProperties({ navigationPaneSettings: { visible: false } }, true);
        }
        let ele = closest(this.element, '.e-bigger');
        this.isBigger = ele ? true : false;
        this.activeModule = (this.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
        createSpinner({ target: this.element }, createElement);
        this.addWrapper();
        this.keyConfigs = {
            altN: 'alt+n',
            f5: 'f5',
            ctrlShift1: 'ctrl+shift+1',
            ctrlShift2: 'ctrl+shift+2',
            ctrlU: 'ctrl+u'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    }
    /**
     * Gets the properties to be maintained upon browser refresh..
     * @returns string
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['view', 'path', 'selectedItems'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
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
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        let slItems = isNullOrUndefined(this.selectedItems) ? [] :
            this.allowMultiSelection ? this.selectedItems : this.selectedItems.slice(this.selectedItems.length - 1);
        this.setProperties({ selectedItems: slItems }, true);
        this.fileView = this.view;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? initialEnd : finalizeEnd, this.path);
        this.adjustHeight();
        if (isNullOrUndefined(this.navigationpaneModule)) {
            this.splitterObj.collapse(this.enableRtl ? 1 : 0);
            let bar = select('.' + SPLIT_BAR, this.element);
            bar.classList.add(DISPLAY_NONE);
        }
        this.wireEvents();
        this.renderComplete();
    }
    ensurePath() {
        let currentPath = this.path;
        if (isNullOrUndefined(currentPath)) {
            currentPath = '/';
        }
        if (currentPath.lastIndexOf('/') !== (currentPath.length - 1)) {
            currentPath = currentPath + '/';
        }
        this.originalPath = currentPath;
        let paths = currentPath.split('/');
        this.setProperties({ path: paths[0] + '/' }, true);
        this.pathNames = [];
        this.pathId = ['fe_tree'];
        this.itemData = [];
    }
    initialize() {
        if (this.isMobile) {
            addClass([this.element], MOBILE);
        }
        if (this.allowMultiSelection) {
            addClass([this.element], CHECK_SELECT);
        }
        this.addCssClass(null, this.cssClass);
        this.renderFileUpload();
    }
    addWrapper() {
        let headerWrap = this.createElement('div', { id: this.element.id + TOOLBAR_ID });
        this.element.appendChild(headerWrap);
        let layoutWrap = this.createElement('div', {
            id: this.element.id + LAYOUT_ID, className: LAYOUT
        });
        this.element.appendChild(layoutWrap);
        let navigationWrap = this.createElement('div', {
            id: this.element.id + NAVIGATION_ID, className: NAVIGATION
        });
        let treeWrap = this.createElement('div', {
            id: this.element.id + TREE_ID
        });
        navigationWrap.appendChild(treeWrap);
        let contentWrap = this.createElement('div', {
            id: this.element.id + CONTENT_ID, className: LAYOUT_CONTENT
        });
        this.breadCrumbBarNavigation = this.createElement('div', {
            id: this.element.id + BREADCRUMBBAR_ID,
            className: BREADCRUMBS
        });
        contentWrap.appendChild(this.breadCrumbBarNavigation);
        let gridWrap = this.createElement('div', {
            id: this.element.id + GRID_ID
        });
        contentWrap.appendChild(gridWrap);
        let largeiconWrap = this.createElement('div', {
            id: this.element.id + LARGEICON_ID,
            className: LARGE_ICONS, attrs: { 'role': 'group' }
        });
        contentWrap.appendChild(largeiconWrap);
        let overlay = this.createElement('span', { className: OVERLAY });
        contentWrap.appendChild(overlay);
        let paneSettings;
        if (!this.enableRtl) {
            layoutWrap.appendChild(navigationWrap);
            layoutWrap.appendChild(contentWrap);
            paneSettings = [
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                },
                { size: '75%', min: '270px' }
            ];
        }
        else {
            layoutWrap.appendChild(contentWrap);
            layoutWrap.appendChild(navigationWrap);
            paneSettings = [
                { size: '75%', min: '270px' },
                {
                    size: '25%', min: this.navigationPaneSettings.minWidth.toString(),
                    max: this.navigationPaneSettings.maxWidth.toString()
                }
            ];
        }
        this.splitterObj = new Splitter({
            paneSettings: paneSettings,
            width: '100%',
            enableRtl: false,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            resizing: this.splitterResize.bind(this)
        });
        this.splitterObj.isStringTemplate = true;
        this.splitterObj.appendTo(layoutWrap);
        let dialogWrap = this.createElement('div', { id: this.element.id + DIALOG_ID });
        this.element.appendChild(dialogWrap);
        let menuWrap = this.createElement('ul', { id: this.element.id + CONTEXT_MENU_ID });
        this.element.appendChild(menuWrap);
        let dialogImgWrap = this.createElement('div', { id: this.element.id + IMG_DIALOG_ID });
        this.element.appendChild(dialogImgWrap);
        let extnDialogWrap = this.createElement('div', { id: this.element.id + EXTN_DIALOG_ID });
        this.element.appendChild(extnDialogWrap);
        let uploadDialogWrap = this.createElement('div', { id: this.element.id + UPLOAD_DIALOG_ID });
        this.element.appendChild(uploadDialogWrap);
    }
    adjustHeight() {
        let toolbar = select('#' + this.element.id + TOOLBAR_ID, this.element);
        let toolBarHeight = toolbar ? toolbar.offsetHeight : 0;
        if (this.splitterObj) {
            this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
            this.splitterObj.dataBind();
        }
    }
    /* istanbul ignore next */
    splitterResize() {
        this.notify(splitterResize, {});
    }
    splitterAdjust() {
        let bar = select('.' + SPLIT_BAR, this.element);
        if (this.navigationPaneSettings.visible) {
            this.splitterObj.expand(this.enableRtl ? 1 : 0);
            bar.classList.remove(DISPLAY_NONE);
        }
        else {
            this.splitterObj.collapse(this.enableRtl ? 1 : 0);
            bar.classList.add(DISPLAY_NONE);
        }
    }
    addCssClass(oldOne, newOne) {
        if (!isNullOrUndefined(oldOne) && oldOne !== '') {
            removeClass([this.element], oldOne.split(' '));
        }
        if (!isNullOrUndefined(newOne) && newOne !== '') {
            addClass([this.element], newOne.split(' '));
        }
    }
    showSpinner() {
        showSpinner(this.element);
    }
    hideSpinner() {
        hideSpinner(this.element);
    }
    onContextMenu(e) {
        e.preventDefault();
    }
    checkMobile() {
        return (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(Browser.userAgent.toLowerCase())
            && /mobile/i.test(Browser.userAgent.toLowerCase()));
    }
    renderFileUpload() {
        let id = this.element.id + UPLOAD_ID;
        let uploadEle = this.createElement('input', { id: id, attrs: { name: 'uploadFiles', type: 'file' } });
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
            target: this.popupTarget ? this.popupTarget : '#' + this.element.id,
            cssClass: getCssClass(this, this.isMobile ? MOB_POPUP : ROOT_POPUP),
            locale: this.locale,
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            enableRtl: this.enableRtl,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            open: this.onOpen.bind(this),
            close: this.onClose.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this),
        });
        this.uploadDialogObj.appendTo('#' + this.element.id + UPLOAD_DIALOG_ID);
        this.renderUploadBox();
    }
    renderUploadBox() {
        let uploadUrl = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
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
            allowedExtensions: this.uploadSettings.allowedExtensions,
            fileListRendering: this.onFileListRender.bind(this),
        });
        this.uploadObj.appendTo('#' + this.element.id + UPLOAD_ID);
    }
    onFileListRender(args) {
        this.trigger('uploadListCreate', args);
    }
    updateUploader() {
        this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
        this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
        this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
        this.uploadObj.allowedExtensions = this.uploadSettings.allowedExtensions;
        this.uploadObj.dataBind();
    }
    onBeforeOpen(args) {
        let eventArgs = {
            cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
        };
        /* istanbul ignore next */
        if (isBlazor()) {
            delete eventArgs.popupModule;
        }
        this.trigger('beforePopupOpen', eventArgs, (eventargs) => {
            args.cancel = eventargs.cancel;
        });
    }
    onBeforeClose(args) {
        let eventArgs = {
            cancel: args.cancel, popupName: 'Upload', popupModule: this.uploadDialogObj
        };
        /* istanbul ignore next */
        if (isBlazor()) {
            delete eventArgs.popupModule;
        }
        this.trigger('beforePopupClose', eventArgs, (eventargs) => {
            args.cancel = eventargs.cancel;
        });
    }
    onOpen() {
        this.isOpened = true;
        this.uploadDialogObj.element.focus();
        let args = {
            popupModule: this.uploadDialogObj, popupName: 'Upload',
            element: this.uploadDialogObj.element
        };
        /* istanbul ignore next */
        if (isBlazor()) {
            delete args.popupModule;
        }
        this.trigger('popupOpen', args);
    }
    onClose() {
        this.isOpened = false;
        this.uploadObj.clearAll();
        let args = {
            popupModule: this.uploadDialogObj, popupName: 'Upload',
            element: this.uploadDialogObj.element
        };
        /* istanbul ignore next */
        if (isBlazor()) {
            delete args.popupModule;
        }
        this.trigger('popupClose', args);
    }
    /* istanbul ignore next */
    onUploading(args) {
        let action = 'save';
        if ((this.retryArgs.length !== 0)) {
            for (let i = 0; i < this.retryArgs.length; i++) {
                if (args.fileData.name === this.retryArgs[i].file.name) {
                    action = this.retryArgs[i].action;
                    this.retryArgs.splice(i, 1);
                    i = this.retryArgs.length;
                }
            }
        }
        let data = JSON.stringify(getValue(this.pathId[this.pathId.length - 1], this.feParent));
        args.customFormData = [{ 'path': this.path }, { 'action': action }, { 'data': data }];
        let uploadUrl = this.ajaxSettings.uploadUrl ? this.ajaxSettings.uploadUrl : this.ajaxSettings.url;
        let ajaxSettings = {
            url: uploadUrl,
            type: 'POST',
            mode: true,
            dataType: null,
            contentType: null,
            data: JSON.stringify(args.customFormData),
            onSuccess: null,
            onFailure: null,
            beforeSend: null
        };
        this.uploadEventArgs = { action: 'Upload', ajaxSettings: ajaxSettings, cancel: false };
        this.trigger('beforeSend', this.uploadEventArgs, (uploadEventArgs) => {
            args.customFormData = JSON.parse(getValue('data', uploadEventArgs.ajaxSettings));
            args.cancel = uploadEventArgs.cancel;
            let eventArgs = {
                cancel: false,
                httpRequest: args.currentRequest
            };
            if (typeof getValue('beforeSend', uploadEventArgs.ajaxSettings) === 'function') {
                getValue('beforeSend', uploadEventArgs.ajaxSettings)(eventArgs);
                if (getValue('cancel', eventArgs)) {
                    args.cancel = getValue('cancel', eventArgs);
                }
            }
        });
    }
    onRemoving() {
        this.onFileUploadSuccess({ count: 1 });
        if (this.uploadObj.getFilesData().length === 1) {
            this.uploadDialogObj.hide();
        }
    }
    /* istanbul ignore next */
    onClearing() {
        if (this.isOpened) {
            this.uploadDialogObj.hide();
        }
    }
    /* istanbul ignore next */
    onSelected(args) {
        if (args.filesData.length === 0) {
            return;
        }
        this.uploadingCount = args.filesData.length;
        this.uploadedCount = 0;
        let details = getPathObject(this);
        if (!hasUploadAccess(details)) {
            args.cancel = true;
            createDeniedDialog(this, details, permissionUpload);
            return;
        }
        this.uploadDialogObj.show();
    }
    onFileUploadSuccess(args) {
        this.uploadedCount = this.uploadedCount + args.count;
        if (this.uploadSettings.autoClose && (this.uploadingCount === this.uploadedCount)) {
            this.uploadDialogObj.hide();
        }
    }
    /* istanbul ignore next */
    onUploadSuccess(files) {
        let args = { action: 'Upload', result: files };
        this.trigger('success', args);
        this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        read(this, pathChanged, this.path);
        this.onFileUploadSuccess({ count: 1 });
        if (typeof getValue('onSuccess', this.uploadEventArgs.ajaxSettings) === 'function') {
            getValue('onSuccess', this.uploadEventArgs.ajaxSettings)();
        }
    }
    /* istanbul ignore next */
    onUploadFailure(files) {
        let response = getValue('response', files);
        let statusText = getValue('statusText', response);
        if (statusText !== '') {
            setValue('statusText', statusText, files);
        }
        let args = { action: 'Upload', error: files };
        this.trigger('failure', args);
        if (getValue('statusCode', response) === 400) {
            this.retryFiles.push(getValue('file', files));
            if (!this.isRetryOpened) {
                createExtDialog(this, 'UploadRetry');
            }
        }
        if (typeof getValue('onFailure', this.uploadEventArgs.ajaxSettings) === 'function') {
            getValue('onFailure', this.uploadEventArgs.ajaxSettings)();
        }
    }
    onInitialEnd() {
        setNextPath(this, this.path);
    }
    addEventListeners() {
        this.on(beforeRequest, this.showSpinner, this);
        this.on(afterRequest, this.hideSpinner, this);
        this.on(initialEnd, this.onInitialEnd, this);
        this.on(detailsInit, this.onDetailsInit, this);
        this.on(skipUpload, this.onFileUploadSuccess, this);
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    }
    removeEventListeners() {
        if (this.isDestroyed) {
            return;
        }
        this.off(beforeRequest, this.showSpinner);
        this.off(afterRequest, this.hideSpinner);
        this.off(initialEnd, this.onInitialEnd);
        this.off(detailsInit, this.onDetailsInit);
        this.off(skipUpload, this.onFileUploadSuccess);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    }
    onDetailsInit() {
        if (isNullOrUndefined(this.activeModule)) {
            this.itemData = [getValue(this.pathId[this.pathId.length - 1], this.feParent)];
        }
    }
    resizeHandler() {
        this.adjustHeight();
        this.notify(resizeEnd, {});
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'altN':
                e.preventDefault();
                this.itemData = [getPathObject(this)];
                if (!hasContentAccess(this.itemData[0])) {
                    createDeniedDialog(this, this.itemData[0], permissionEditContents);
                }
                else {
                    createDialog(this, 'NewFolder');
                }
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
                showSpinner(this.element);
                updateLayout(this, 'Details');
                break;
            /* istanbul ignore next */
            case 'ctrlShift2':
                e.preventDefault();
                this.fileView = 'LargeIcons';
                this.setProperties({ view: 'LargeIcons' }, true);
                showSpinner(this.element);
                updateLayout(this, 'LargeIcons');
                break;
            case 'ctrlU':
                e.preventDefault();
                let uploadEle = select('#' + this.element.id + UPLOAD_ID, this.element);
                uploadEle.click();
                break;
        }
    }
    wireEvents() {
        EventHandler.add(window, 'resize', this.resizeHandler, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    unWireEvents() {
        EventHandler.remove(window, 'resize', this.resizeHandler);
        this.keyboardModule.destroy();
    }
    setPath() {
        this.setProperties({ selectedItems: [] }, true);
        this.ensurePath();
        this.notify(clearPathInit, { selectedNode: this.pathId[0] });
        read(this, (this.path !== this.originalPath) ? initialEnd : finalizeEnd, this.path);
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {FileManager} newProp
     * @param  {FileManager} oldProp
     * @returns void
     * @private
     */
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'ajaxSettings':
                    this.ajaxSettingSetModel(newProp);
                    break;
                case 'allowDragAndDrop':
                    this.allowDragAndDrop = newProp.allowDragAndDrop;
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'allowMultiSelection':
                    if (this.allowMultiSelection) {
                        addClass([this.element], CHECK_SELECT);
                    }
                    else {
                        if (this.selectedItems.length > 1) {
                            this.setProperties({ selectedItems: this.selectedItems.slice(this.selectedItems.length - 1) }, true);
                        }
                        removeClass([this.element], CHECK_SELECT);
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
                    this.enableRtl = newProp.enableRtl;
                    this.refresh();
                    break;
                case 'rootAliasName':
                    this.rootAliasName = newProp.rootAliasName;
                    this.refresh();
                    break;
                case 'height':
                    let height = !isNullOrUndefined(newProp.height) ? formatUnit(newProp.height) : newProp.height;
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
                    let width = !isNullOrUndefined(newProp.width) ? formatUnit(newProp.width) : newProp.width;
                    setStyleAttribute(this.element, { 'width': width });
                    this.notify(modelChanged, { module: 'common', newProp: newProp, oldProp: oldProp });
                    break;
                case 'sortOrder':
                    refresh(this);
                    this.notify(sortByChange, {});
                    break;
                case 'popupTarget':
                    if (this.uploadDialogObj) {
                        this.uploadDialogObj.target = newProp.popupTarget;
                    }
                    if (this.dialogObj) {
                        this.dialogObj.target = newProp.popupTarget;
                    }
                    if (this.extDialogObj) {
                        this.extDialogObj.target = newProp.popupTarget;
                    }
                    if (this.viewerObj) {
                        this.viewerObj.target = newProp.popupTarget;
                    }
                    break;
            }
        }
    }
    /* istanbul ignore next */
    ajaxSettingSetModel(newProp) {
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
        super.refresh();
    }
    /* istanbul ignore next */
    localeSetModelOption(newProp) {
        this.uploadObj.locale = newProp.locale;
        super.refresh();
    }
    /**
     * Triggers when the component is destroyed.
     * @returns void
     */
    destroy() {
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
        super.destroy();
    }
    /**
     * Creates a new folder in file manager.
     * @param {name: string} name – Specifies the name of new folder in current path.
     * If it is not specified, then the default new folder dialog will be opened.
     * @returns void
     */
    createFolder(name) {
        this.notify(methodCall, { action: 'createFolder' });
        let details = [getPathObject(this)];
        this.itemData = details;
        if (name) {
            if (/[/\\|*?"<>:]/.test(name)) {
                let result = {
                    files: null,
                    error: {
                        code: '402',
                        message: getLocaleText(this, 'Validation-Invalid').replace('{0}', '"' + name + '"'),
                        fileExists: null
                    }
                };
                createDialog(this, 'Error', result);
            }
            else {
                if (!hasContentAccess(details[0])) {
                    createDeniedDialog(this, details[0], permissionEditContents);
                }
                else {
                    createFolder(this, name);
                }
            }
        }
        else {
            createNewFolder(this);
        }
    }
    /**
     * Deletes the folders or files from the given unique identifiers.
     * @param {ids: string} ids - Specifies the name of folders or files in current path. If you want to delete the nested level folders or
     * files, then specify the filter path along with name of the folders or files when performing the search or custom filtering.
     * For ID based file provider, specify the unique identifier of folders or files.
     * If it is not specified, then delete confirmation dialog will be opened for selected item.
     * @returns void
     */
    deleteFiles(ids) {
        this.notify(methodCall, { action: 'deleteFiles', ids: ids });
    }
    /**
     * Disables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be disabled.
     * @returns void
     */
    disableToolbarItems(items) {
        if (!isNullOrUndefined(items)) {
            this.toolbarModule.enableItems(items, false);
        }
    }
    /**
     * Downloads the folders or files from the given unique identifiers.
     * @param {ids: string} ids - Specifies the name of folders or files in current path. If you want to download the nested level folders
     * or files, then specify the filter path along with name of the folders or files when performing search or custom filtering.
     * For ID based file provider, specify the unique identifier of folders or files.
     * If it is not specified, then the selected items will be downloaded.
     * @returns void
     */
    downloadFiles(ids) {
        this.notify(methodCall, { action: 'downloadFiles', ids: ids });
    }
    /**
     * Enables the specified toolbar items of the file manager.
     * @param {items: string[]} items - Specifies an array of items to be enabled.
     * @returns void
     */
    enableToolbarItems(items) {
        if (!isNullOrUndefined(items)) {
            this.toolbarModule.enableItems(items, true);
        }
    }
    /**
     * Disables the specified context menu items in file manager. This method is used only in the menuOpen event.
     * @param {items: string[]} items - Specifies an array of items to be disabled.
     * @returns void
     */
    disableMenuItems(items) {
        if (!isNullOrUndefined(items) && !isNullOrUndefined(this.contextmenuModule.contextMenu)) {
            this.contextmenuModule.disableItem(items);
        }
    }
    /**
     * Returns the index position of given current context menu item in file manager.
     * @param {item: string} item - Specifies an item to get the index position.
     * @returns number
     */
    getMenuItemIndex(item) {
        if (this.contextmenuModule) {
            return this.contextmenuModule.getItemIndex(item);
        }
        else {
            return -1;
        }
    }
    /**
     * Returns the index position of given toolbar item in file manager.
     * @param {item: string} item - Specifies an item to get the index position.
     * @returns number
     */
    getToolbarItemIndex(item) {
        if (this.toolbarModule) {
            return this.toolbarModule.getItemIndex(item);
        }
        else {
            return -1;
        }
    }
    /**
     * Display the custom filtering files in file manager.
     * @param {filterData: Object} filterData - Specifies the custom filter details along with custom file action name,
     * which needs to be sent to the server side. If you do not specify the details, then default action name will be `filter`.
     * @returns void
     */
    filterFiles(filterData) {
        this.filterData = filterData ? filterData : null;
        this.setProperties({ selectedItems: [] }, true);
        this.notify(selectionChanged, {});
        this.isFiltered = true;
        if (this.breadcrumbbarModule.searchObj.element.value !== '') {
            this.breadcrumbbarModule.searchObj.element.value = '';
        }
        filter(this, filterEnd);
    }
    /**
     * Gets the details of the selected files in the file manager.
     * @returns Object[]
     */
    getSelectedFiles() {
        this.notify(updateSelectionData, {});
        return this.itemData;
    }
    /**
     * Opens the corresponding file or folder from the given unique identifier.
     * @param {id: string} id - Specifies the name of folder or file in current path. If you want to open the nested level folder or
     * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
     * file provider, specify the unique identifier of folder or file.
     * @returns void
     */
    openFile(id) {
        this.notify(methodCall, { action: 'openFile', id: id });
    }
    /**
     * Refreshes the folder files of the file manager.
     * @returns void
     */
    refreshFiles() {
        refresh(this);
    }
    /**
     * Refreshes the layout of the file manager.
     * @returns void
     */
    refreshLayout() {
        this.adjustHeight();
        this.notify(layoutRefresh, {});
    }
    /**
     * Selects the entire folders and files in current path.
     * @returns void
     */
    selectAll() {
        this.notify(methodCall, { action: 'selectAll' });
    }
    /**
     * Deselects the currently selected folders and files in current path.
     * @returns void
     */
    clearSelection() {
        this.notify(methodCall, { action: 'clearSelection' });
    }
    /**
     * Renames the file or folder with given new name in file manager.
     * @param {id: string} id - Specifies the name of folder or file in current path. If you want to rename the nested level folder or
     * file, then specify the filter path along with name of the folder or file when performing search or custom filtering. For ID based
     * file provider, specify the unique identifier of folder or file.
     * If it is not specified, then rename dialog will be opened for selected item.
     * @param {name: string} name – Specifies the new name of the file or folder in current path. If it is not specified, then rename dialog
     * will be opened for given identifier.
     * @returns void
     */
    renameFile(id, name) {
        this.notify(methodCall, { action: 'renameFile', id: id, newName: name });
    }
    /**
     * Opens the upload dialog in file manager.
     * @returns void
     */
    uploadFiles() {
        let details = [getPathObject(this)];
        this.itemData = details;
        uploadItem(this);
    }
    /**
     * Specifies the direction of FileManager
     */
    setRtl(rtl) {
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
    }
};
__decorate$8([
    Complex({}, AjaxSettings)
], FileManager.prototype, "ajaxSettings", void 0);
__decorate$8([
    Property(false)
], FileManager.prototype, "allowDragAndDrop", void 0);
__decorate$8([
    Property(true)
], FileManager.prototype, "allowMultiSelection", void 0);
__decorate$8([
    Complex({}, ContextMenuSettings)
], FileManager.prototype, "contextMenuSettings", void 0);
__decorate$8([
    Property('')
], FileManager.prototype, "cssClass", void 0);
__decorate$8([
    Complex({}, DetailsViewSettings)
], FileManager.prototype, "detailsViewSettings", void 0);
__decorate$8([
    Property(true)
], FileManager.prototype, "enableHtmlSanitizer", void 0);
__decorate$8([
    Property(false)
], FileManager.prototype, "enablePersistence", void 0);
__decorate$8([
    Property('400px')
], FileManager.prototype, "height", void 0);
__decorate$8([
    Property('LargeIcons')
], FileManager.prototype, "view", void 0);
__decorate$8([
    Complex({}, NavigationPaneSettings)
], FileManager.prototype, "navigationPaneSettings", void 0);
__decorate$8([
    Property('/')
], FileManager.prototype, "path", void 0);
__decorate$8([
    Property(null)
], FileManager.prototype, "popupTarget", void 0);
__decorate$8([
    Complex({}, SearchSettings)
], FileManager.prototype, "searchSettings", void 0);
__decorate$8([
    Property()
], FileManager.prototype, "selectedItems", void 0);
__decorate$8([
    Property(true)
], FileManager.prototype, "showFileExtension", void 0);
__decorate$8([
    Property(null)
], FileManager.prototype, "rootAliasName", void 0);
__decorate$8([
    Property(false)
], FileManager.prototype, "showHiddenItems", void 0);
__decorate$8([
    Property(true)
], FileManager.prototype, "showThumbnail", void 0);
__decorate$8([
    Property('Ascending')
], FileManager.prototype, "sortOrder", void 0);
__decorate$8([
    Complex({}, ToolbarSettings)
], FileManager.prototype, "toolbarSettings", void 0);
__decorate$8([
    Complex({}, UploadSettings)
], FileManager.prototype, "uploadSettings", void 0);
__decorate$8([
    Property('100%')
], FileManager.prototype, "width", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileLoad", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileOpen", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "beforeDownload", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "beforeImageLoad", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "beforePopupClose", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "beforePopupOpen", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "beforeSend", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "created", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "destroyed", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileDragStart", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileDragging", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileDragStop", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileDropped", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileSelection", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "fileSelect", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "menuClick", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "menuOpen", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "failure", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "popupClose", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "popupOpen", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "success", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "toolbarClick", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "toolbarCreate", void 0);
__decorate$8([
    Event()
], FileManager.prototype, "uploadListCreate", void 0);
FileManager = FileManager_1 = __decorate$8([
    NotifyPropertyChanges
], FileManager);

/**
 * File Manager base modules
 */

/**
 * Toolbar module
 */
class Toolbar$1 {
    /**
     * Constructor for the Toolbar module
     * @hidden
     */
    constructor(parent) {
        this.default = ['Delete', 'Rename', 'Download', 'Cut', 'Copy', 'Paste'];
        this.single = ['Delete', 'Rename', 'Download', 'Cut', 'Copy'];
        this.multiple = ['Delete', 'Download', 'Cut', 'Copy', 'Refresh'];
        this.selection = ['NewFolder', 'Upload', 'SortBy', 'Refresh'];
        this.parent = parent;
        this.render();
        this.addEventListener();
    }
    render() {
        this.items = this.toolbarItemData(this.getItems(this.parent.toolbarSettings.items.map((item) => item.trim())));
        let eventArgs = { items: this.items };
        this.parent.trigger('toolbarCreate', eventArgs, (toolbarCreateArgs) => {
            this.items = toolbarCreateArgs.items;
            this.toolbarObj = new Toolbar({
                items: this.items,
                created: this.toolbarCreateHandler.bind(this),
                overflowMode: 'Popup',
                clicked: this.onClicked.bind(this),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                enableRtl: this.parent.enableRtl
            });
            this.toolbarObj.isStringTemplate = true;
            this.toolbarObj.appendTo('#' + this.parent.element.id + TOOLBAR_ID);
        });
    }
    getItemIndex(item) {
        let itemId = this.getId(item);
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === itemId) {
                return i;
            }
        }
        return -1;
    }
    getItems(items) {
        let currItems = items.slice();
        if (this.parent.isDevice && this.parent.allowMultiSelection) {
            currItems.push('SelectAll');
        }
        return currItems;
    }
    /* istanbul ignore next */
    onClicked(args) {
        if (isNullOrUndefined(args.item) || !args.item.id) {
            return;
        }
        let tool = args.item.id.substr((this.parent.element.id + '_tb_').length);
        let details;
        if (tool === 'refresh' || tool === 'newfolder' || tool === 'upload') {
            details = [getPathObject(this.parent)];
            this.parent.itemData = details;
        }
        else {
            this.parent.notify(selectedData, {});
            details = this.parent.itemData;
        }
        let eventArgs = { cancel: false, fileDetails: details, item: args.item };
        this.parent.trigger('toolbarClick', eventArgs, (toolbarClickArgs) => {
            if (!toolbarClickArgs.cancel) {
                switch (tool) {
                    case 'sortby':
                        let target = closest(args.originalEvent.target, '.' + TB_ITEM);
                        if (target && target.classList.contains('e-toolbar-popup')) {
                            args.cancel = true;
                        }
                        break;
                    case 'newfolder':
                        createNewFolder(this.parent);
                        break;
                    case 'cut':
                        cutFiles(this.parent);
                        break;
                    case 'copy':
                        copyFiles(this.parent);
                        break;
                    case 'delete':
                        for (let i = 0; i < details.length; i++) {
                            if (!hasEditAccess(details[i])) {
                                createDeniedDialog(this.parent, details[i], permissionEdit);
                                return;
                            }
                        }
                        createDialog(this.parent, 'Delete');
                        break;
                    case 'details':
                        this.parent.notify(detailsInit, {});
                        let sItems = this.parent.selectedItems;
                        if (this.parent.activeModule === 'navigationpane') {
                            sItems = [];
                        }
                        GetDetails(this.parent, sItems, this.parent.path, 'details');
                        break;
                    case 'paste':
                        this.parent.folderPath = '';
                        pasteHandler(this.parent);
                        break;
                    case 'refresh':
                        refresh(this.parent);
                        break;
                    case 'download':
                        doDownload(this.parent);
                        break;
                    case 'rename':
                        if (!hasEditAccess(details[0])) {
                            createDeniedDialog(this.parent, details[0], permissionEdit);
                        }
                        else {
                            this.parent.notify(renameInit, {});
                            createDialog(this.parent, 'Rename');
                        }
                        break;
                    case 'upload':
                        uploadItem(this.parent);
                        break;
                    case 'selectall':
                        this.parent.notify(selectAllInit, {});
                        break;
                    case 'selection':
                        this.parent.notify(clearAllInit, {});
                        break;
                }
            }
        });
    }
    toolbarCreateHandler() {
        if (!isNullOrUndefined(select('#' + this.getId('SortBy'), this.parent.element))) {
            let items = [
                { id: this.getPupupId('name'), text: getLocaleText(this.parent, 'Name'), iconCss: TB_OPTION_DOT },
                { id: this.getPupupId('size'), text: getLocaleText(this.parent, 'Size') },
                { id: this.getPupupId('date'), text: getLocaleText(this.parent, 'DateModified') },
                { separator: true },
                { id: this.getPupupId('ascending'), text: getLocaleText(this.parent, 'Ascending'),
                    iconCss: this.parent.sortOrder === 'Ascending' ? TB_OPTION_TICK : '' },
                { id: this.getPupupId('descending'), text: getLocaleText(this.parent, 'Descending'),
                    iconCss: this.parent.sortOrder === 'Descending' ? TB_OPTION_TICK : '' },
                { id: this.getPupupId('none'), text: getLocaleText(this.parent, 'None'),
                    iconCss: this.parent.sortOrder === 'None' ? TB_OPTION_TICK : '' }
            ];
            this.buttonObj = new DropDownButton({
                items: items, cssClass: getCssClass(this.parent, ROOT_POPUP),
                select: sortbyClickHandler.bind(this, this.parent),
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                enableRtl: this.parent.enableRtl, iconCss: ICON_SHORTBY
            });
            this.buttonObj.isStringTemplate = true;
            this.buttonObj.appendTo('#' + this.getId('SortBy'));
        }
        if (!isNullOrUndefined(select('#' + this.getId('View'), this.parent.element))) {
            let gridSpan = '<span class="' + ICON_GRID + ' ' + MENU_ICON + '"></span>';
            let largeIconSpan = '<span class="' + ICON_LARGE + ' ' + MENU_ICON + '"></span>';
            let layoutItems = [
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
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                content: '<span class="e-tbar-btn-text">' + getLocaleText(this.parent, 'View') + '</span>'
            });
            this.layoutBtnObj.isStringTemplate = true;
            this.layoutBtnObj.appendTo('#' + this.getId('View'));
        }
        this.hideItems(this.default, true);
        this.hideStatus();
        let btnElement = selectAll('.e-btn', this.toolbarObj.element);
        for (let btnCount = 0; btnCount < btnElement.length; btnCount++) {
            /* istanbul ignore next */
            btnElement[btnCount].onkeydown = (e) => {
                if (e.keyCode === 13 && !e.target.classList.contains('e-fe-popup')) {
                    e.preventDefault();
                }
            };
            btnElement[btnCount].onkeyup = (e) => {
                if (e.keyCode === 13 && !e.target.classList.contains('e-fe-popup')) {
                    btnElement[btnCount].click();
                }
            };
        }
        this.parent.refreshLayout();
    }
    updateSortByButton() {
        if (this.buttonObj) {
            let items = this.buttonObj.items;
            for (let itemCount = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount].id === this.getPupupId('name')) {
                    items[itemCount].iconCss = this.parent.sortBy === 'name' ? TB_OPTION_DOT : '';
                }
                else if (items[itemCount].id === this.getPupupId('size')) {
                    items[itemCount].iconCss = this.parent.sortBy === 'size' ? TB_OPTION_DOT : '';
                }
                else if (items[itemCount].id === this.getPupupId('date')) {
                    items[itemCount].iconCss = this.parent.sortBy === '_fm_modified' ? TB_OPTION_DOT : '';
                }
                else if (items[itemCount].id === this.getPupupId('ascending')) {
                    items[itemCount].iconCss = this.parent.sortOrder === 'Ascending' ? TB_OPTION_TICK : '';
                }
                else if (items[itemCount].id === this.getPupupId('descending')) {
                    items[itemCount].iconCss = this.parent.sortOrder === 'Descending' ? TB_OPTION_TICK : '';
                }
                else if (items[itemCount].id === this.getPupupId('none')) {
                    items[itemCount].iconCss = this.parent.sortOrder === 'None' ? TB_OPTION_TICK : '';
                }
            }
        }
    }
    getPupupId(id) {
        return this.parent.element.id + '_ddl_' + id.toLowerCase();
    }
    layoutChange(args) {
        if (this.parent.view === 'Details') {
            if (args.item.id === this.getPupupId('large')) {
                updateLayout(this.parent, 'LargeIcons');
            }
        }
        else {
            if (args.item.id === this.getPupupId('details')) {
                updateLayout(this.parent, 'Details');
            }
        }
    }
    toolbarItemData(data) {
        let items = [];
        let mode = 'Both';
        if (this.parent.isMobile) {
            mode = 'Overflow';
        }
        for (let i = 0; i < data.length; i++) {
            let item;
            let itemId = this.getId(data[i]);
            let itemText = getLocaleText(this.parent, data[i]);
            let itemTooltip = getLocaleText(this.parent, 'Tooltip-' + data[i]);
            switch (data[i]) {
                case '|':
                    item = { type: 'Separator' };
                    break;
                case 'Upload':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_UPLOAD, showTextOn: mode };
                    break;
                case 'SortBy':
                    let spanElement = '<span class="e-tbar-btn-text e-tbar-ddb-text">' + itemText + '</span>';
                    item = {
                        id: itemId, tooltipText: itemTooltip,
                        template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1">' + spanElement + '</button>',
                    };
                    break;
                case 'Refresh':
                    item = { id: itemId, text: itemText, tooltipText: itemTooltip, prefixIcon: ICON_REFRESH, showTextOn: mode };
                    break;
                case 'Selection':
                    item = {
                        id: itemId, text: itemText, tooltipText: itemTooltip, suffixIcon: ICON_CLEAR, overflow: 'Show',
                        align: 'Right'
                    };
                    break;
                case 'View':
                    item = {
                        id: itemId, tooltipText: itemTooltip, prefixIcon: this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE,
                        overflow: 'Show', align: 'Right', text: itemText, showTextOn: 'Overflow',
                        template: '<button id="' + itemId + '" class="e-tbar-btn e-tbtn-txt" tabindex="-1" aria-label=' +
                            getLocaleText(this.parent, 'View') + '></button>'
                    };
                    break;
                case 'Details':
                    item = {
                        id: itemId, tooltipText: itemTooltip, prefixIcon: ICON_DETAILS, overflow: 'Show', align: 'Right',
                        text: itemText, showTextOn: 'Overflow'
                    };
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
    }
    getId(id) {
        return this.parent.element.id + '_tb_' + id.toLowerCase();
    }
    addEventListener() {
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(selectionChanged, this.onSelectionChanged, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(showPaste, this.showPaste, this);
        this.parent.on(hidePaste, this.hidePaste, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(sortByChange, this.updateSortByButton, this);
    }
    reRenderToolbar(e) {
        if (e.newProp.toolbarSettings.items !== undefined) {
            this.items = this.toolbarItemData(this.getItems(e.newProp.toolbarSettings.items.map((item) => item.trim())));
            let eventArgs = { items: this.items };
            this.parent.trigger('toolbarCreate', eventArgs, (toolbarCreateArgs) => {
                if (this.buttonObj) {
                    this.buttonObj.destroy();
                }
                if (this.layoutBtnObj) {
                    this.layoutBtnObj.destroy();
                }
                this.items = toolbarCreateArgs.items;
                this.toolbarObj.items = this.items;
                this.toolbarObj.dataBind();
                this.toolbarCreateHandler();
            });
        }
    }
    onSelectionChanged() {
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
        let ele = select('#' + this.getId('Selection'), this.toolbarObj.element);
        if (this.parent.selectedItems.length > 0 && ele) {
            let txt;
            if (this.parent.selectedItems.length === 1) {
                txt = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Item-Selection');
            }
            else {
                txt = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Items-Selection');
            }
            select('.e-tbar-btn-text', ele).textContent = txt;
            this.toolbarObj.hideItem(ele.parentElement, false);
        }
    }
    hideItems(tools, toHide) {
        for (let i = 0; i < tools.length; i++) {
            let ele = select('#' + this.getId(tools[i]), this.parent.element);
            if (ele) {
                this.toolbarObj.hideItem(ele.parentElement, toHide);
            }
        }
    }
    hideStatus() {
        let ele = select('#' + this.getId('Selection'), this.toolbarObj.element);
        if (ele) {
            this.toolbarObj.hideItem(ele.parentElement, true);
        }
    }
    showPaste() {
        this.hideItems(['Paste'], false);
    }
    hidePaste() {
        this.hideItems(['Paste'], true);
    }
    onLayoutChange() {
        if (this.layoutBtnObj) {
            this.layoutBtnObj.iconCss = this.parent.view === 'Details' ? ICON_GRID : ICON_LARGE;
            let items = this.layoutBtnObj.items;
            for (let itemCount = 0; itemCount < items.length; itemCount++) {
                if (items[itemCount].id === this.getPupupId('large')) {
                    items[itemCount].iconCss = this.parent.view === 'LargeIcons' ? TB_OPTION_TICK : '';
                }
                else if (items[itemCount].id === this.getPupupId('details')) {
                    items[itemCount].iconCss = this.parent.view === 'Details' ? TB_OPTION_TICK : '';
                }
            }
        }
    }
    removeEventListener() {
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(selectionChanged, this.onSelectionChanged);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(showPaste, this.showPaste);
        this.parent.off(hidePaste, this.hidePaste);
        this.parent.off(destroy, this.destroy);
        this.parent.off(sortByChange, this.updateSortByButton);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'toolbar';
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
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
            }
        }
    }
    destroy() {
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
        this.parent.refreshLayout();
    }
    enableItems(items, isEnable) {
        for (let i = 0; i < items.length; i++) {
            let ele = select('#' + this.getId(items[i]), this.parent.element);
            if (ele) {
                this.toolbarObj.enableItems(ele.parentElement, isEnable);
            }
        }
    }
}

/**
 * File Manager actions modules
 */

/**
 * NavigationPane module
 */
class NavigationPane {
    /**
     * Constructor for the TreeView module
     * @hidden
     */
    constructor(parent) {
        this.removeNodes = [];
        this.moveNames = [];
        this.expandTree = false;
        this.isDrag = false;
        this.isPathDragged = false;
        this.isRenameParent = false;
        this.isRightClick = false;
        this.renameParent = null;
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
    onInit() {
        if (!isNullOrUndefined(this.treeObj)) {
            return;
        }
        let rootData = getValue(this.parent.pathId[0], this.parent.feParent);
        setValue('_fm_icon', 'e-fe-folder', rootData);
        let attr = {};
        let id = getValue('id', rootData);
        if (!isNullOrUndefined(id)) {
            setValue('data-id', id, attr);
        }
        if (!hasEditAccess(rootData)) {
            setValue('class', getAccessClass(rootData), attr);
        }
        if (!isNullOrUndefined(attr)) {
            setValue('_fm_htmlAttr', attr, rootData);
        }
        this.treeObj = new TreeView({
            fields: {
                dataSource: [rootData], id: '_fm_id', parentID: '_fm_pId', expanded: '_fm_expanded', selected: '_fm_selected', text: 'name',
                hasChildren: 'hasChild', iconCss: '_fm_icon', htmlAttributes: '_fm_htmlAttr', tooltip: 'name'
            },
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            nodeSelected: this.onNodeSelected.bind(this),
            nodeExpanding: this.onNodeExpand.bind(this),
            nodeClicked: this.onNodeClicked.bind(this),
            allowEditing: true,
            nodeEditing: this.onNodeEditing.bind(this),
            drawNode: this.onDrowNode.bind(this),
            enableRtl: this.parent.enableRtl,
            dataBound: this.addDragDrop.bind(this)
        });
        this.treeObj.isStringTemplate = true;
        this.treeObj.appendTo('#' + this.parent.element.id + TREE_ID);
        this.wireEvents();
    }
    addDragDrop() {
        if (!this.parent.isMobile && this.treeObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) {
                    this.dragObj.destroy();
                }
                this.dragObj = new Draggable(this.treeObj.element, {
                    cursorAt: this.parent.dragCursorPosition,
                    dragTarget: '.' + FULLROW,
                    dragArea: this.parent.element,
                    drag: draggingHandler.bind(this, this.parent),
                    dragStart: (args) => {
                        dragStartHandler(this.parent, args, this.dragObj);
                    },
                    dragStop: dragStopHandler.bind(this, this.parent),
                    enableTailMode: true,
                    enableAutoScroll: true,
                    helper: this.dragHelper.bind(this)
                });
            }
            else if (!this.parent.allowDragAndDrop && this.dragObj) {
                this.dragObj.destroy();
            }
        }
    }
    dragHelper(args) {
        let dragTarget = args.sender.target;
        if (!dragTarget.classList.contains(FULLROW)) {
            return null;
        }
        let dragLi = closest(dragTarget, 'li');
        this.parent.dragPath = '';
        this.parent.dragData = [];
        this.parent.activeElements = [];
        this.parent.activeElements = [dragLi];
        this.parent.dragNodes = [];
        getModule(this.parent, dragLi);
        this.parent.dragData = this.getTreeData(dragLi);
        this.parent.dragPath = this.getDragPath(dragLi, this.parent.dragData[0].name);
        this.parent.dragNodes.push(this.parent.dragData[0].name);
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    }
    getDragPath(dragLi, text) {
        let path = this.getDropPath(dragLi, text);
        return getParentPath(path);
    }
    getDropPath(node, text) {
        let id = node.getAttribute('data-id');
        let newText = this.parent.hasId ? id : text;
        return getPath(node, newText, this.parent.hasId);
    }
    onDrowNode(args) {
        let eventArgs = {
            element: args.node,
            fileDetails: args.nodeData,
            module: 'NavigationPane'
        };
        this.parent.trigger('fileLoad', eventArgs);
    }
    addChild(files, target, prevent) {
        let directories = getDirectories(files);
        if (directories.length > 0) {
            let length = 0;
            let folders = directories;
            while (length < directories.length) {
                folders[length]._fm_icon = 'e-fe-folder';
                let attr = {};
                let id = getValue('id', folders[length]);
                if (!isNullOrUndefined(id)) {
                    setValue('data-id', id, attr);
                }
                if (!hasEditAccess(folders[length])) {
                    setValue('class', getAccessClass(folders[length]), attr);
                }
                if (!isNullOrUndefined(attr)) {
                    setValue('_fm_htmlAttr', attr, folders[length]);
                }
                length++;
            }
            this.treeObj.addNodes(directories, target, null, prevent);
        }
    }
    onNodeSelected(args) {
        if (this.parent.breadcrumbbarModule && this.parent.breadcrumbbarModule.searchObj && !this.renameParent) {
            this.parent.breadcrumbbarModule.searchObj.element.value = '';
            this.parent.isFiltered = false;
        }
        this.parent.searchedItems = [];
        if (!args.isInteracted && !this.isRightClick && !this.isPathDragged && !this.isRenameParent) {
            return;
        }
        this.activeNode = args.node;
        this.parent.activeModule = 'navigationpane';
        let nodeData = this.getTreeData(getValue('id', args.nodeData));
        if (!this.renameParent) {
            let eventArgs = { cancel: false, fileDetails: nodeData[0], module: 'NavigationPane' };
            delete eventArgs.cancel;
            this.parent.trigger('fileOpen', eventArgs);
        }
        this.parent.selectedItems = [];
        this.parent.itemData = nodeData;
        updatePath(args.node, this.parent.itemData[0], this.parent);
        this.expandNodeTarget = null;
        if (args.node.querySelector('.' + ICONS) && args.node.querySelector('.' + LIST_ITEM) === null) {
            this.expandNodeTarget = 'add';
        }
        read(this.parent, this.isPathDragged ? pasteEnd : pathChanged, this.parent.path);
        this.parent.visitedItem = args.node;
        this.isPathDragged = this.isRenameParent = this.isRightClick = false;
    }
    /* istanbul ignore next */
    onPathDrag(args) {
        this.isPathDragged = true;
        this.selectResultNode(args[0]);
    }
    /* istanbul ignore next */
    onNodeExpand(args) {
        if (!args.isInteracted && !this.isDrag) {
            return;
        }
        if (args.node.querySelector('.' + LIST_ITEM) === null) {
            let text = getValue('text', args.nodeData);
            let id = args.node.getAttribute('data-id');
            let isId = isNullOrUndefined(id) ? false : true;
            let newText = isNullOrUndefined(id) ? text : id;
            let path = getPath(args.node, newText, isId);
            this.expandNodeTarget = args.node.getAttribute('data-uid');
            this.parent.expandedId = this.expandNodeTarget;
            this.parent.itemData = this.getTreeData(getValue('id', args.nodeData));
            read(this.parent, nodeExpand, path);
        }
    }
    /* istanbul ignore next */
    onNodeExpanded(args) {
        this.addChild(args.files, this.expandNodeTarget, false);
        this.parent.expandedId = null;
    }
    onNodeClicked(args) {
        this.parent.activeModule = 'navigationpane';
        this.activeNode = args.node;
        if ((args.event.which === 3) && (args.node.getAttribute('data-uid') !== this.treeObj.selectedNodes[0])) {
            this.isRightClick = true;
            this.treeObj.selectedNodes = [args.node.getAttribute('data-uid')];
        }
        else if (args.node.getAttribute('data-uid') === this.treeObj.selectedNodes[0] && this.parent.selectedItems.length !== 0) {
            this.parent.setProperties({ selectedItems: [] }, true);
            let layout = (this.parent.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
            this.parent.notify(modelChanged, { module: layout, newProp: { selectedItems: [] } });
        }
    }
    /* istanbul ignore next */
    onNodeEditing(args) {
        if (!isNullOrUndefined(args.innerHtml)) {
            args.cancel = true;
        }
    }
    onPathChanged(args) {
        this.parent.isCut = false;
        let currFiles = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feFiles);
        if (this.expandNodeTarget === 'add') {
            let sNode = select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
            let ul = select('.' + LIST_PARENT, sNode);
            if (isNullOrUndefined(ul)) {
                this.addChild(args.files, this.treeObj.selectedNodes[0], !this.expandTree);
            }
            this.expandNodeTarget = '';
        }
        this.expandTree = false;
        if (isNullOrUndefined(currFiles)) {
            setValue(this.parent.pathId[this.parent.pathId.length - 1], args.files, this.parent.feFiles);
        }
    }
    updateTree(args) {
        if (this.treeObj) {
            let id = this.treeObj.selectedNodes[0];
            this.updateTreeNode(args, id);
        }
    }
    updateTreeNode(args, id) {
        let toExpand = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
        this.removeChildNodes(id);
        this.addChild(args.files, id, !toExpand);
    }
    removeChildNodes(id) {
        let sNode = select('[data-uid="' + id + '"]', this.treeObj.element);
        let parent = select('.' + LIST_PARENT, sNode);
        let childs = parent ? Array.prototype.slice.call(parent.children) : null;
        if (childs) {
            this.treeObj.removeNodes(childs);
        }
    }
    onOpenEnd(args) {
        let sleId = this.parent.pathId[this.parent.pathId.length - 1];
        this.treeObj.expandAll(this.treeObj.selectedNodes);
        this.treeObj.selectedNodes = [sleId];
        this.expandNodeTarget = 'add';
        this.onPathChanged(args);
    }
    onOpenInit(args) {
        if (this.parent.activeModule === 'navigationpane') {
            if (args.target.querySelector('.' + ICONS)) {
                this.treeObj.expandAll(this.treeObj.selectedNodes);
            }
        }
    }
    onInitialEnd(args) {
        this.onInit();
        this.addChild(args.files, getValue('_fm_id', args.cwd), false);
    }
    onFinalizeEnd(args) {
        this.onInit();
        let id = getValue('_fm_id', args.cwd);
        this.removeChildNodes(id);
        this.addChild(args.files, id, false);
        this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
    }
    onCreateEnd(args) {
        this.updateTree(args);
    }
    onSelectedData() {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateItemData();
        }
    }
    onDeleteInit() {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateActionData();
            let name = getValue('name', this.parent.itemData[0]);
            Delete(this.parent, [name], this.parent.path, 'delete');
        }
    }
    /* istanbul ignore next */
    onDeleteEnd(args) {
        if (this.parent.activeModule === 'navigationpane') {
            let selectedNode = this.treeObj.selectedNodes[0];
            let selcetedEle = select('[data-uid="' + selectedNode + '"]', this.treeObj.element);
            let selectedNodeEle = closest(selcetedEle, '.' + LIST_PARENT).parentElement;
            this.treeObj.selectedNodes = [selectedNodeEle.getAttribute('data-uid')];
            this.treeObj.dataBind();
        }
        this.updateTree(args);
    }
    onRefreshEnd(args) {
        this.updateTree(args);
    }
    onRenameInit() {
        if (this.parent.activeModule === 'navigationpane') {
            this.updateRenameData();
        }
    }
    /* istanbul ignore next */
    onRenameEndParent(args) {
        let id = this.renameParent ? this.renameParent : this.parent.pathId[this.parent.pathId.length - 1];
        this.expandTree = this.treeObj.expandedNodes.indexOf(this.treeObj.selectedNodes[0]) !== -1;
        this.updateTreeNode(args, id);
        this.parent.expandedId = null;
        if (this.renameParent) {
            this.renameParent = null;
        }
        else {
            let resultData = [];
            if (this.parent.hasId) {
                resultData = new DataManager(this.treeObj.getTreeData()).
                    executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
            }
            else {
                let nData = new DataManager(this.treeObj.getTreeData()).
                    executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.renameText, false));
                if (nData.length > 0) {
                    resultData = new DataManager(nData).
                        executeLocal(new Query().where('_fm_pId', 'equal', id, false));
                }
            }
            if (resultData.length > 0) {
                this.isRenameParent = true;
                let id = getValue(this.treeObj.fields.id, resultData[0]);
                this.treeObj.selectedNodes = [id];
                this.treeObj.dataBind();
            }
        }
    }
    /* istanbul ignore next */
    onRenameEnd(args) {
        if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
            this.updateTree(args);
        }
        else {
            let data = this.treeObj.getTreeData();
            let resultData = [];
            if (this.parent.hasId) {
                resultData = new DataManager(data).
                    executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
            }
            else {
                let nData = new DataManager(data).
                    executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
                if (nData.length > 0) {
                    resultData = new DataManager(nData).
                        executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
                }
            }
            if (resultData.length > 0) {
                this.renameParent = getValue(this.treeObj.fields.parentID, resultData[0]);
                this.parent.expandedId = this.renameParent;
                this.parent.itemData = this.getTreeData(this.renameParent);
                read(this.parent, renameEndParent, this.parent.filterPath.replace(/\\/g, '/'));
            }
        }
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.addDragDrop();
                    break;
                case 'navigationPaneSettings':
                    read(this.parent, finalizeEnd, '/');
                    break;
            }
        }
    }
    /* istanbul ignore next */
    onDownLoadInit() {
        this.doDownload();
    }
    onSelectionChanged(e) {
        this.treeObj.selectedNodes = [e.selectedNode];
    }
    onClearPathInit(e) {
        this.removeChildNodes(e.selectedNode);
    }
    onDragEnd(args) {
        let moveNames = [];
        if (this.parent.isPasteError || this.parent.isSearchDrag) {
            moveNames = this.getMoveNames(args.files, this.parent.isSearchDrag, this.parent.dragPath);
        }
        else {
            moveNames = this.moveNames;
        }
        this.treeObj.removeNodes(moveNames);
    }
    getMoveNames(files, flag, path) {
        let moveNames = [];
        for (let i = 0; i < files.length; i++) {
            if (!files[i].isFile) {
                if (!this.parent.hasId) {
                    let name = (files[i].previousName);
                    if (flag) {
                        path = path + files[i].previousName;
                        let index = path.lastIndexOf('/');
                        name = path.substring(index + 1);
                        path = path.substring(0, index + 1);
                    }
                    let resultData = new DataManager(this.treeObj.getTreeData()).
                        executeLocal(new Query().where(this.treeObj.fields.text, 'equal', name, false));
                    for (let j = 0; j < resultData.length; j++) {
                        let fPath = getValue('filterPath', resultData[j]);
                        fPath = fPath.replace(/\\/g, '/');
                        if (fPath === path) {
                            moveNames.push(getValue(this.treeObj.fields.id, resultData[j]));
                            break;
                        }
                    }
                }
            }
        }
        return moveNames;
    }
    onCutEnd(args) {
        let moveNames = [];
        if (this.parent.isPasteError || this.parent.isSearchCut) {
            this.moveNames = this.getMoveNames(args.files, this.parent.isSearchCut, this.parent.targetPath);
        }
        else {
            moveNames = this.moveNames;
        }
        this.treeObj.removeNodes(moveNames);
    }
    /* istanbul ignore next */
    selectResultNode(resultObj) {
        if (!this.parent.hasId) {
            let path = getValue('filterPath', resultObj);
            let itemname = getValue('name', resultObj);
            let data = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where(this.treeObj.fields.text, 'equal', itemname, false));
            if (data.length > 0) {
                let resultData = new DataManager(data).
                    executeLocal(new Query().where('filterPath', 'equal', path, false));
                if (resultData.length > 0) {
                    let id = getValue(this.treeObj.fields.id, resultData[0]);
                    this.treeObj.selectedNodes = [id];
                    this.treeObj.dataBind();
                }
            }
        }
        else {
            this.treeObj.selectedNodes = [getValue('_fm_id', resultObj)];
            this.treeObj.dataBind();
        }
    }
    onDropPath(args) {
        this.onpasteEnd(args);
        this.selectResultNode(this.parent.dropData);
        this.parent.isDropEnd = !this.parent.isPasteError;
    }
    onpasteEnd(args) {
        let resultData = [];
        if (this.parent.hasId) {
            resultData = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where('id', 'equal', getValue('id', args.cwd), false));
        }
        else {
            let nData = new DataManager(this.treeObj.getTreeData()).
                executeLocal(new Query().where(this.treeObj.fields.text, 'equal', getValue('name', args.cwd), false));
            if (nData.length > 0) {
                resultData = new DataManager(nData).
                    executeLocal(new Query().where('filterPath', 'equal', getValue('filterPath', args.cwd), false));
            }
        }
        if (resultData.length > 0) {
            let id = getValue(this.treeObj.fields.id, resultData[0]);
            let toExpand = this.treeObj.expandedNodes.indexOf(id) === -1;
            this.removeChildNodes(id);
            this.addChild(args.files, id, toExpand);
        }
        this.parent.expandedId = null;
        this.onPathChanged(args);
        if (this.parent.isDragDrop) {
            this.checkDropPath(args);
        }
    }
    /* istanbul ignore next */
    checkDropPath(args) {
        if (this.parent.hasId) {
            this.parent.isDropEnd = !this.parent.isPasteError;
            return;
        }
        if ((this.parent.dropPath.indexOf(getDirectoryPath(this.parent, args)) === -1)) {
            this.parent.isDropEnd = false;
            readDropPath(this.parent);
        }
        else {
            this.parent.isDropEnd = !this.parent.isPasteError;
        }
    }
    onpasteInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            this.updateItemData();
        }
        this.moveNames = [];
        let obj = this.parent.isDragDrop ? this.parent.dragData : this.parent.actionRecords;
        for (let i = 0; i < obj.length; i++) {
            if (getValue('isFile', obj[i]) === false) {
                this.moveNames.push(getValue('_fm_id', obj[i]));
            }
        }
    }
    oncutCopyInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.activeRecords = this.getTreeData(this.treeObj.selectedNodes[0]);
            this.parent.activeElements = [this.activeNode];
        }
    }
    addEventListener() {
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(downloadInit, this.onDownLoadInit, this);
        this.parent.on(initialEnd, this.onInitialEnd, this);
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(pasteEnd, this.onpasteEnd, this);
        this.parent.on(cutEnd, this.onCutEnd, this);
        this.parent.on(pasteInit, this.onpasteInit, this);
        this.parent.on(nodeExpand, this.onNodeExpanded, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(selectedData, this.onSelectedData, this);
        this.parent.on(deleteInit, this.onDeleteInit, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(updateTreeSelection, this.onSelectionChanged, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(openEnd, this.onOpenEnd, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onRenameEnd, this);
        this.parent.on(renameEndParent, this.onRenameEndParent, this);
        this.parent.on(clearPathInit, this.onClearPathInit, this);
        this.parent.on(cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(dropInit, this.onDropInit, this);
        this.parent.on(menuItemData, this.onMenuItemData, this);
        this.parent.on(dragEnd, this.onDragEnd, this);
        this.parent.on(dragging, this.onDragging, this);
        this.parent.on(dropPath, this.onDropPath, this);
        this.parent.on(detailsInit, this.onDetailsInit, this);
        this.parent.on(pathDrag, this.onPathDrag, this);
    }
    removeEventListener() {
        this.parent.off(initialEnd, this.onInitialEnd);
        this.parent.off(downloadInit, this.onDownLoadInit);
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(selectedData, this.onSelectedData);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(pasteEnd, this.onpasteEnd);
        this.parent.off(cutEnd, this.onCutEnd);
        this.parent.off(pasteInit, this.onpasteInit);
        this.parent.off(updateTreeSelection, this.onSelectionChanged);
        this.parent.off(nodeExpand, this.onNodeExpanded);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(openEnd, this.onOpenEnd);
        this.parent.off(destroy, this.destroy);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onRenameEnd);
        this.parent.off(renameEndParent, this.onRenameEndParent);
        this.parent.off(clearPathInit, this.onClearPathInit);
        this.parent.off(deleteInit, this.onDeleteInit);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(cutCopyInit, this.oncutCopyInit);
        this.parent.off(dropInit, this.onDropInit);
        this.parent.off(dragEnd, this.onDragEnd);
        this.parent.off(dragging, this.onDragging);
        this.parent.off(dropPath, this.onDropPath);
        this.parent.off(detailsInit, this.onDetailsInit);
        this.parent.off(menuItemData, this.onMenuItemData);
        this.parent.off(pathDrag, this.onPathDrag);
    }
    /* istanbul ignore next */
    onDetailsInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            let dataobj = this.getTreeData(this.treeObj.selectedNodes[0]);
            this.parent.itemData = dataobj;
        }
    }
    onMenuItemData(args) {
        if (this.parent.activeModule === this.getModuleName()) {
            let liEle = closest(args.target, 'li');
            this.parent.itemData = this.getTreeData(liEle.getAttribute('data-uid'));
        }
    }
    /* istanbul ignore next */
    onDragging(args) {
        let ele = closest(args.target, 'li');
        if (ele.classList.contains('e-node-collapsed')) {
            this.isDrag = true;
            let level = parseInt(ele.getAttribute('aria-level'), 10);
            this.treeObj.expandAll([ele.getAttribute('data-uid')], level + 1);
            this.isDrag = false;
        }
    }
    onDropInit(args) {
        if (this.parent.targetModule === this.getModuleName()) {
            let dropLi = closest(args.target, 'li');
            this.parent.dropData = this.getTreeData(dropLi)[0];
            this.parent.dropPath = this.getDropPath(dropLi, getValue('name', this.parent.dropData));
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'navigationpane';
    }
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.treeObj) {
            this.unWireEvents();
            this.treeObj.destroy();
        }
    }
    wireEvents() {
        this.keyboardModule = new KeyboardEvents(this.treeObj.element, {
            keyAction: this.keyDown.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    unWireEvents() {
        this.keyboardModule.destroy();
    }
    /* istanbul ignore next */
    keyDown(e) {
        let action = e.action;
        switch (action) {
            case 'altEnter':
                this.parent.notify(detailsInit, {});
                GetDetails(this.parent, [], this.parent.path, 'details');
                break;
            case 'esc':
                removeActive(this.parent);
                break;
            case 'del':
                this.updateItemData();
                if (!hasEditAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], permissionEdit);
                }
                else {
                    this.removeNodes = [];
                    createDialog(this.parent, 'Delete');
                }
                break;
            case 'ctrlC':
                copyFiles(this.parent);
                break;
            case 'ctrlV':
                this.parent.folderPath = '';
                pasteHandler(this.parent);
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                break;
            case 'shiftF10':
                this.updateItemData();
                if (!hasDownloadAccess(this.parent.itemData[0])) {
                    createDeniedDialog(this.parent, this.parent.itemData[0], permissionDownload);
                    return;
                }
                if (this.parent.selectedItems.length !== 0) {
                    this.doDownload();
                }
                break;
            case 'f2':
                if (this.parent.selectedItems.length === 0) {
                    let data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
                    if (!hasEditAccess(data)) {
                        createDeniedDialog(this.parent, data, permissionEdit);
                    }
                    else {
                        this.updateRenameData();
                        createDialog(this.parent, 'Rename');
                    }
                }
                break;
        }
    }
    getTreeData(args) {
        let data = this.treeObj.getTreeData(args);
        for (let i = 0; i < data.length; i++) {
            if (isNullOrUndefined(getValue('hasChild', data[i]))) {
                setValue('hasChild', false, data[i]);
            }
        }
        return data;
    }
    updateRenameData() {
        this.updateItemData();
        this.parent.currentItemText = getValue('name', this.parent.itemData[0]);
    }
    updateItemData() {
        let data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
        this.parent.itemData = [data];
        this.parent.isFile = false;
    }
    updateActionData() {
        this.updateItemData();
        let newPath = getParentPath(this.parent.path);
        this.parent.setProperties({ path: newPath }, true);
        this.parent.pathId.pop();
        this.parent.pathNames.pop();
    }
    /* istanbul ignore next */
    doDownload() {
        let newPath = getParentPath(this.parent.path);
        let itemId = this.treeObj.selectedNodes[0];
        let name = (itemId === this.parent.pathId[0]) ? '' : getValue('name', this.parent.itemData[0]);
        Download(this.parent, newPath, [name]);
    }
}

/**
 * DetailsView module
 */
class DetailsView {
    /**
     * Constructor for the GridView module
     * @hidden
     */
    constructor(parent) {
        this.isInteracted = true;
        this.interaction = true;
        this.isPasteOperation = false;
        this.isColumnRefresh = false;
        this.dragObj = null;
        this.startIndex = null;
        this.firstItemIndex = null;
        this.isSelectionUpdate = false;
        this.currentSelectedItem = [];
        this.count = 0;
        this.isRendered = true;
        this.isLoaded = false;
        this.isNameWidth = false;
        this.pasteOperation = false;
        this.uploadOperation = false;
        Grid.Inject(Resize, ContextMenu$1, Sort, VirtualScroll);
        this.parent = parent;
        this.element = select('#' + this.parent.element.id + GRID_ID, this.parent.element);
        this.addEventListener();
        this.keyConfigs = {
            altEnter: 'alt+enter',
            esc: 'escape',
            tab: 'tab',
            moveDown: 'downarrow',
            ctrlEnd: 'ctrl+end',
            ctrlHome: 'ctrl+home',
            ctrlDown: 'ctrl+downarrow',
            ctrlLeft: 'ctrl+leftarrow',
            ctrlRight: 'ctrl+rightarrow',
            shiftEnd: 'shift+end',
            shiftHome: 'shift+home',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            ctrlUp: 'ctrl+uparrow',
            csEnd: 'ctrl+shift+end',
            csHome: 'ctrl+shift+home',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            space: 'space',
            ctrlSpace: 'ctrl+space',
            shiftSpace: 'shift+space',
            csSpace: 'ctrl+shift+space',
            end: 'end',
            home: 'home',
            moveUp: 'uparrow',
            del: 'delete',
            ctrlX: 'ctrl+x',
            ctrlC: 'ctrl+c',
            ctrlV: 'ctrl+v',
            ctrlShiftN: 'ctrl+shift+n',
            shiftdel: 'shift+delete',
            ctrlD: 'ctrl+d',
            f2: 'f2',
            ctrlA: 'ctrl+a',
            enter: 'enter'
        };
    }
    // tslint:disable-next-line
    /* istanbul ignore next */
    render(args) {
        showSpinner(this.parent.element);
        if (this.parent.view === 'Details') {
            removeClass([this.parent.element], MULTI_SELECT);
            let items = getSortedData(this.parent, args.files);
            this.checkNameWidth();
            let columns = this.getColumns();
            let sortSettings;
            if (this.parent.isMobile) {
                sortSettings = [];
            }
            else {
                if (this.parent.sortOrder !== 'None') {
                    sortSettings = [{ direction: this.parent.sortOrder, field: this.parent.sortBy }];
                }
            }
            this.gridObj = new Grid({
                dataSource: items,
                allowSorting: true,
                rowSelecting: this.onSelection.bind(this, 'select'),
                rowDeselecting: this.onSelection.bind(this, 'unselect'),
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
                width: '100%',
                beforeCopy: (args) => { args.cancel = true; },
                load: function (args) {
                    this.focusModule.destroy();
                },
                locale: this.parent.locale
            });
            this.gridObj.isStringTemplate = true;
            this.gridObj.appendTo('#' + this.parent.element.id + GRID_ID);
            this.wireEvents();
            this.adjustHeight();
            this.emptyArgs = args;
        }
    }
    checkNameWidth() {
        let initialColumn = this.parent.detailsViewSettings.columns;
        this.isNameWidth = false;
        for (let i = 0; i < initialColumn.length; i++) {
            if (initialColumn[i].field === 'name') {
                this.isNameWidth = !isNullOrUndefined(initialColumn[i].width);
                return;
            }
        }
    }
    adjustWidth(columns, fieldName) {
        if (this.isNameWidth && (fieldName === 'name')) {
            return;
        }
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].field === fieldName) {
                let nameWidth;
                if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                    nameWidth = (this.element.clientWidth <= 500) ? '120px' : 'auto';
                }
                else {
                    nameWidth = (this.element.clientWidth <= 680) ? ((fieldName === 'name') ? '120px' : '180px') : 'auto';
                }
                columns[i].width = nameWidth;
            }
        }
    }
    getColumns() {
        let columns;
        if (this.parent.isMobile) {
            columns = [
                {
                    field: 'name', headerText: getLocaleText(this.parent, 'Name'), width: 'auto', minWidth: 120, headerTextAlign: 'Left',
                    template: '<div class="e-fe-text">${name}</div><div class="e-fe-date">${_fm_modified}</div>' +
                        '<span class="e-fe-size">${size}</span>'
                },
            ];
        }
        else {
            columns = JSON.parse(JSON.stringify(this.parent.detailsViewSettings.columns));
            this.adjustWidth(columns, 'name');
            for (let i = 0, len = columns.length; i < len; i++) {
                columns[i].headerText = getLocaleText(this.parent, columns[i].headerText);
            }
        }
        let iWidth = ((this.parent.isMobile || this.parent.isBigger) ? '54' : '46');
        let icon = {
            field: 'type', width: iWidth, minWidth: iWidth, template: '<span class="e-fe-icon ${_fm_iconClass}"></span>',
            allowResizing: false, allowSorting: true, customAttributes: { class: 'e-fe-grid-icon' },
            headerTemplate: '<span class="e-fe-icon e-fe-folder"></span>',
        };
        columns.unshift(icon);
        if (this.parent.allowMultiSelection) {
            let cWidth = (this.parent.isBigger ? '36' : '26');
            let cBox = {
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
        for (let i = 0, len = columns.length; i < len; i++) {
            columns[i].disableHtmlEncode = !this.parent.enableHtmlSanitizer;
        }
        return columns;
    }
    adjustHeight() {
        if (!this.gridObj) {
            return;
        }
        let pane = select('#' + this.parent.element.id + CONTENT_ID, this.parent.element);
        let bar = select('#' + this.parent.element.id + BREADCRUMBBAR_ID, this.parent.element);
        let gridHeader = select('.' + GRID_HEADER, this.parent.element);
        let height = (pane.offsetHeight - bar.offsetHeight - gridHeader.offsetHeight);
        this.gridObj.height = height;
        this.gridObj.dataBind();
    }
    renderCheckBox() {
        this.gridObj.columns = this.getColumns();
        this.isColumnRefresh = true;
        this.gridObj.refreshColumns();
    }
    onRowDataBound(args) {
        let td = select('.e-fe-grid-name', args.row);
        if (!td) {
            let columns = this.parent.detailsViewSettings.columns;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].field === 'name') {
                    td = args.row.children[this.parent.allowMultiSelection ? (i + 2) : (i + 1)];
                    break;
                }
            }
        }
        if (td) {
            td.setAttribute('title', getValue('name', args.data));
        }
        if (this.parent.isLayoutChange && this.parent.isCut && this.parent.fileAction === 'move' &&
            this.parent.selectedNodes && this.parent.selectedNodes.length !== 0) {
            if (this.parent.selectedNodes.indexOf(getValue('name', args.data)) !== -1) {
                addBlur(args.row);
            }
        }
        if (!this.parent.showFileExtension && getValue('isFile', args.data)) {
            let textEle = args.row.querySelector('.e-fe-text');
            if (textEle) {
                let name = getValue('name', args.data);
                let type = getValue('type', args.data);
                textEle.innerHTML = name.substr(0, name.length - type.length);
            }
        }
        if (getValue('size', args.data) !== undefined && args.row.querySelector('.e-fe-size')) {
            let sizeEle = args.row.querySelector('.e-fe-size');
            let modifiedSize;
            if (!getValue('isFile', args.data)) {
                modifiedSize = '';
            }
            else {
                let sizeValue = getValue('size', args.data);
                let intl = new Internationalization(this.parent.locale);
                let value = intl.formatNumber((sizeValue / 1024), { format: 'n' });
                modifiedSize = value + ' ' + getLocaleText(this.parent, 'KB');
            }
            sizeEle.innerHTML = modifiedSize;
        }
        if (this.parent.isMobile) {
            if (getValue('_fm_modified', args.data) !== undefined && args.row.querySelector('.e-fe-date')) {
                let dateEle = args.row.querySelector('.e-fe-date');
                let intl = new Internationalization(this.parent.locale);
                let columns = this.parent.detailsViewSettings.columns;
                let format;
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].field === 'dateModified') {
                        format = columns[i].format;
                        break;
                    }
                }
                let formattedString = intl.formatDate(new Date(getValue('_fm_modified', args.data)), format);
                dateEle.innerHTML = formattedString;
            }
        }
        let checkWrap = args.row.querySelector('.' + CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
        if (!hasEditAccess(args.data)) {
            args.row.className += ' ' + getAccessClass(args.data);
        }
        let eventArgs = {
            element: args.row,
            fileDetails: args.data,
            module: 'DetailsView'
        };
        this.parent.trigger('fileLoad', eventArgs);
    }
    onActionBegin(args) {
        if (args.requestType === 'sorting') {
            this.parent.sortOrder = args.direction;
            this.parent.sortBy = args.columnName;
            if (this.parent.selectedItems.length !== 0) {
                this.sortItem = true;
                let rows = this.gridObj.getSelectedRowIndexes();
                let len = rows.length;
                this.sortSelectedNodes = [];
                while (len > 0) {
                    let data = this.gridObj.getRowsObject()[rows[len - 1]].data;
                    this.sortSelectedNodes.push(getValue(this.parent.hasId ? 'id' : 'name', data));
                    len--;
                }
            }
            this.parent.notify(sortByChange, {});
        }
    }
    onHeaderCellInfo(args) {
        let checkWrap = args.node.querySelector('.' + CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
    }
    onBeforeDataBound(args) {
        showSpinner(this.parent.element);
        let items = getSortedData(this.parent, this.gridObj.dataSource);
        args.result = items;
    }
    /* istanbul ignore next */
    onDataBound() {
        this.createDragObj();
        if (this.parent.selectedItems.length !== 0) {
            this.selectRecords(this.parent.selectedItems);
        }
        if (this.isPasteOperation === true) {
            if (!this.isColumnRefresh) {
                this.selectRecords(this.parent.pasteNodes);
                this.isPasteOperation = false;
            }
            else {
                this.isColumnRefresh = false;
            }
        }
        if (this.parent.createdItem) {
            this.selectRecords([getValue(this.parent.hasId ? 'id' : 'name', this.parent.createdItem)]);
            this.parent.createdItem = null;
        }
        if (this.parent.layoutSelectedItems.length) {
            this.selectRecords(this.parent.layoutSelectedItems);
        }
        if (this.parent.renamedItem) {
            this.addSelection(this.parent.renamedItem);
            this.parent.renamedItem = null;
        }
        if (this.sortItem === true) {
            this.selectRecords(this.sortSelectedNodes);
            this.sortItem = false;
        }
        if (this.isSelectionUpdate) {
            if (!this.isColumnRefresh) {
                this.selectRecords(this.currentSelectedItem);
                this.isSelectionUpdate = false;
            }
            else {
                this.isColumnRefresh = false;
            }
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
            let hdTable = this.gridObj.getHeaderContent();
            hdTable.style.paddingRight = '';
            hdTable.style.paddingLeft = '';
            let hdContent = select('.e-headercontent', hdTable);
            hdContent.style.borderRightWidth = '0';
            let cnTable = this.gridObj.getContent().querySelector('.e-content');
            cnTable.style.overflowY = '';
            cnTable.classList.add('e-scrollShow');
        }
        else {
            let hdTable = this.gridObj.getHeaderContent();
            if (!this.parent.enableRtl) {
                hdTable.style.paddingRight = '16px';
            }
            else {
                hdTable.style.paddingLeft = '16px';
            }
            let cnTable = this.gridObj.getContent().querySelector('.e-content');
            cnTable.classList.remove('e-scrollShow');
        }
        this.isRendered = true;
        this.parent.isLayoutChange = false;
        hideSpinner(this.parent.element);
        this.checkEmptyDiv(this.emptyArgs);
        this.isInteracted = this.isLoaded ? true : this.isInteracted;
        this.isLoaded = false;
    }
    selectRecords(nodes) {
        let gridRecords = this.gridObj.getCurrentViewRecords();
        let sRecords = [];
        for (let i = 0, len = gridRecords.length; i < len; i++) {
            let node = this.parent.hasId ? getValue('id', gridRecords[i]) : getName(this.parent, gridRecords[i]);
            if (nodes.indexOf(node) !== -1) {
                sRecords.push(i);
            }
        }
        if (sRecords.length !== 0) {
            this.gridObj.selectRows(sRecords);
            this.addFocus(this.gridObj.selectedRowIndex);
        }
    }
    addSelection(data) {
        let items = this.gridObj.getCurrentViewRecords();
        let rData = [];
        if (this.parent.hasId) {
            rData = new DataManager(items).
                executeLocal(new Query().where('id', 'equal', this.parent.renamedId, false));
        }
        else {
            let nData = new DataManager(items).
                executeLocal(new Query().where('name', 'equal', getValue('name', data), false));
            if (nData.length > 0) {
                rData = new DataManager(nData).
                    executeLocal(new Query().where('filterPath', 'equal', this.parent.filterPath, false));
            }
        }
        if (rData.length > 0) {
            let index = items.indexOf(rData[0]);
            this.gridObj.selectRows([index]);
        }
    }
    onSortColumn() {
        if (this.parent.sortOrder !== 'None') {
            this.gridObj.sortModule.sortColumn(this.parent.sortBy, this.parent.sortOrder);
        }
        else {
            this.gridObj.dataSource = getSortedData(this.parent, this.gridObj.dataSource);
        }
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.createDragObj();
                    break;
                case 'height':
                    this.adjustHeight();
                    break;
                case 'detailsViewSettings':
                    if (!isNullOrUndefined(this.gridObj)) {
                        this.checkNameWidth();
                        let columns = this.getColumns();
                        this.gridObj.columns = columns;
                        this.gridObj.allowResizing = this.parent.detailsViewSettings.columnResizing;
                        this.gridObj.dataBind();
                        this.gridObj.refreshColumns();
                    }
                    break;
                case 'selectedItems':
                    this.interaction = false;
                    if (this.parent.selectedItems.length !== 0) {
                        if (!this.parent.allowMultiSelection) {
                            let slItems = this.parent.selectedItems.slice(this.parent.selectedItems.length - 1);
                            this.parent.setProperties({ selectedItems: slItems }, true);
                        }
                        this.selectRecords(this.parent.selectedItems);
                        this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                    }
                    else if (!isNullOrUndefined(this.gridObj)) {
                        this.gridObj.clearSelection();
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
                        this.currentSelectedItem = this.parent.selectedItems;
                        this.gridObj.selectionSettings.type = e.newProp.allowMultiSelection ? 'Multiple' : 'Single';
                        this.isSelectionUpdate = true;
                        this.renderCheckBox();
                    }
                    break;
                case 'view':
                    updateLayout(this.parent, 'Details');
                    break;
                case 'width':
                    this.onDetailsResize();
            }
        }
    }
    onPathChanged(args) {
        this.parent.isCut = false;
        if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() === '' && this.gridObj) {
            this.parent.searchedItems = [];
            if (!this.parent.isFiltered) {
                this.removePathColumn(false);
            }
            else {
                this.updatePathColumn();
            }
        }
        removeBlur(this.parent);
        if (this.parent.view === 'Details') {
            /* istanbul ignore next */
            this.isInteracted = false;
            showSpinner(this.parent.element);
            this.parent.setProperties({ selectedItems: [] }, true);
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
        }
        this.emptyArgs = args;
    }
    updatePathColumn() {
        let len = this.gridObj.columns.length;
        let columnData = JSON.parse(JSON.stringify(this.gridObj.columns));
        if (columnData[len - 1].field && columnData[len - 1].field !== 'filterPath' && !this.parent.isMobile) {
            let pathColumn$$1 = {
                field: 'filterPath', headerText: getLocaleText(this.parent, 'Path'), minWidth: 180, width: 'auto'
            };
            this.gridObj.columns.push(pathColumn$$1);
            this.adjustWidth(this.gridObj.columns, 'filterPath');
            this.adjustWidth(this.gridObj.columns, 'name');
            this.isColumnRefresh = true;
            this.gridObj.refreshColumns();
        }
    }
    checkEmptyDiv(args) {
        let items = getSortedData(this.parent, args.files);
        if (items.length === 0 && !isNullOrUndefined(this.element.querySelector('.' + GRID_VIEW))) {
            createEmptyElement(this.parent, this.element, args);
        }
        else if (items.length !== 0 && this.element.querySelector('.' + EMPTY)) {
            if (this.element.querySelector('.' + GRID_VIEW).querySelector('.' + EMPTY)) {
                let emptyDiv = this.element.querySelector('.' + GRID_VIEW).querySelector('.' + EMPTY);
                this.element.querySelector('.' + GRID_VIEW).removeChild(emptyDiv);
            }
            else {
                this.element.removeChild(this.element.querySelector('.' + EMPTY));
            }
        }
    }
    onOpenInit() {
        if (this.parent.activeModule === 'detailsview') {
            let data = this.gridObj.getSelectedRecords()[0];
            this.openContent(data);
        }
    }
    DblClickEvents(args) {
        this.gridObj.selectRows([args.rowIndex]);
        let data;
        if (args.rowData) {
            data = JSON.parse(JSON.stringify(args.rowData));
            this.openContent(data);
        }
    }
    openContent(data) {
        if (!hasReadAccess(data)) {
            createDeniedDialog(this.parent, data, permissionRead);
            return;
        }
        let eventArgs = { cancel: false, fileDetails: data, module: 'DetailsView' };
        this.parent.trigger('fileOpen', eventArgs, (fileOpenArgs) => {
            if (!fileOpenArgs.cancel) {
                let name = getValue('name', data);
                if (getValue('isFile', data)) {
                    let icon = fileType(data);
                    if (icon === ICON_IMAGE) {
                        let imgUrl = getImageUrl(this.parent, data);
                        createImageDialog(this.parent, name, imgUrl);
                    }
                }
                else {
                    let val = this.parent.breadcrumbbarModule.searchObj.element.value;
                    if (val === '' && !this.parent.isFiltered) {
                        let id = getValue('id', data);
                        let newPath = this.parent.path + (isNullOrUndefined(id) ? name : id) + '/';
                        this.parent.setProperties({ path: newPath }, true);
                        this.parent.pathNames.push(name);
                        this.parent.pathId.push(getValue('_fm_id', data));
                        this.parent.itemData = [data];
                        openAction(this.parent);
                    }
                    else {
                        openSearchFolder(this.parent, data);
                    }
                    this.parent.isFiltered = false;
                }
                this.element.focus();
            }
        });
    }
    /* istanbul ignore next */
    onLayoutChange(args) {
        if (this.parent.view === 'Details') {
            if (!this.gridObj) {
                this.render(args);
            }
            else {
                this.isLoaded = true;
            }
            if (this.parent.isFiltered) {
                this.updatePathColumn();
                this.parent.setProperties({ selectedItems: [] }, true);
            }
            this.gridObj.dataSource = getSortedData(this.parent, args.files);
            this.parent.notify(hideLayout, {});
            this.gridObj.element.classList.remove(DISPLAY_NONE);
            this.isInteracted = false;
            this.gridObj.clearSelection();
            if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() !== '') {
                this.onSearchFiles(args);
            }
            this.adjustHeight();
            if (this.gridObj.sortSettings.columns.length > 0 && this.gridObj.sortSettings.columns[0].field !== this.parent.sortBy) {
                if (this.parent.sortOrder !== 'None') {
                    this.gridObj.sortColumn(this.parent.sortBy, this.parent.sortOrder);
                }
            }
        }
    }
    /* istanbul ignore next */
    onSearchFiles(args) {
        if (this.parent.view === 'Details') {
            this.parent.setProperties({ selectedItems: [] }, true);
            this.parent.notify(selectionChanged, {});
            if (!this.parent.isLayoutChange) {
                this.parent.layoutSelectedItems = [];
            }
            this.updatePathColumn();
            this.parent.searchedItems = args.files;
            this.onPathChanged(args);
        }
    }
    removePathColumn(isRefresh) {
        let len = this.gridObj.columns.length;
        let columnData = JSON.parse(JSON.stringify(this.gridObj.columns));
        if (columnData[len - 1].field && (columnData[len - 1].field === 'filterPath')) {
            /* istanbul ignore next */
            if (this.gridObj.sortSettings.columns[0].field === 'filterPath') {
                if (this.parent.sortOrder !== 'None') {
                    this.gridObj.sortColumn('name', this.parent.sortOrder);
                }
                else {
                    this.gridObj.dataSource = getSortedData(this.parent, this.gridObj.dataSource);
                }
                this.parent.notify(sortByChange, {});
            }
            this.gridObj.columns.pop();
            if (!isRefresh) {
                this.isColumnRefresh = true;
                this.gridObj.refreshColumns();
            }
        }
    }
    onFinalizeEnd(args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        if (!this.gridObj) {
            this.render(args);
        }
        else {
            this.onPathChanged(args);
        }
    }
    onCreateEnd(args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.onPathChanged(args);
    }
    onRenameInit() {
        if (this.parent.activeModule === 'detailsview' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }
    onSelectedData() {
        if (this.parent.activeModule === 'detailsview') {
            this.parent.itemData = this.gridObj.getSelectedRecords();
        }
    }
    onDeleteInit() {
        if (this.parent.activeModule === 'detailsview') {
            Delete(this.parent, this.parent.selectedItems, this.parent.path, 'delete');
        }
    }
    /* istanbul ignore next */
    onDeleteEnd(args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.onPathChanged(args);
        this.parent.setProperties({ selectedItems: [] }, true);
    }
    onRefreshEnd(args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.isInteracted = false;
        this.removePathColumn(true);
        this.gridObj.dataSource = getSortedData(this.parent, args.files);
        this.emptyArgs = args;
    }
    onHideLayout() {
        if (this.parent.view !== 'Details' && this.gridObj) {
            this.gridObj.element.classList.add(DISPLAY_NONE);
        }
    }
    onSelectAllInit() {
        if (this.parent.view === 'Details') {
            this.isInteracted = false;
            if (this.parent.allowMultiSelection) {
                this.gridObj.selectionModule.selectRowsByRange(0, this.gridObj.getRows().length);
            }
            else {
                this.gridObj.selectRow(this.gridObj.getRows().length - 1);
            }
            this.isInteracted = true;
            this.interaction = true;
        }
    }
    onClearAllInit() {
        if (this.parent.view === 'Details') {
            this.removeSelection();
            this.interaction = true;
        }
    }
    /* istanbul ignore next */
    onSelectionChanged() {
        removeClass([this.element], HEADER_CHECK);
        if (this.parent.selectedItems.length > 0) {
            addClass([this.element], HEADER_CHECK);
        }
    }
    onLayoutRefresh() {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.adjustHeight();
    }
    onBeforeRequest() {
        this.isRendered = false;
    }
    onAfterRequest() {
        this.isRendered = true;
    }
    onUpdateSelectionData() {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.parent.itemData = this.gridObj.getSelectedRecords();
    }
    addEventListener() {
        this.parent.on(finalizeEnd, this.onFinalizeEnd, this);
        this.parent.on(destroy, this.destroy, this);
        this.parent.on(layoutChange, this.onLayoutChange, this);
        this.parent.on(pathChanged, this.onPathChanged, this);
        this.parent.on(createEnd, this.onCreateEnd, this);
        this.parent.on(dropInit, this.onDropInit, this);
        this.parent.on(detailsInit, this.onDetailsInit, this);
        this.parent.on(refreshEnd, this.onRefreshEnd, this);
        this.parent.on(search, this.onSearchFiles, this);
        this.parent.on(methodCall, this.onMethodCall, this);
        this.parent.on(actionFailure, this.onActionFailure, this);
        this.parent.on(modelChanged, this.onPropertyChanged, this);
        this.parent.on(deleteInit, this.onDeleteInit, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(selectedData, this.onSelectedData, this);
        this.parent.on(renameInit, this.onRenameInit, this);
        this.parent.on(renameEnd, this.onPathChanged, this);
        this.parent.on(openInit, this.onOpenInit, this);
        this.parent.on(sortColumn, this.onSortColumn, this);
        this.parent.on(openEnd, this.onPathChanged, this);
        this.parent.on(filterEnd, this.onPathChanged, this);
        this.parent.on(pasteInit, this.onPasteInit, this);
        this.parent.on(hideLayout, this.onHideLayout, this);
        this.parent.on(selectAllInit, this.onSelectAllInit, this);
        this.parent.on(clearAllInit, this.onClearAllInit, this);
        this.parent.on(pathColumn, this.onPathColumn, this);
        this.parent.on(selectionChanged, this.onSelectionChanged, this);
        this.parent.on(beforeRequest, this.onBeforeRequest, this);
        this.parent.on(afterRequest, this.onAfterRequest, this);
        this.parent.on(pasteEnd, this.onpasteEnd, this);
        this.parent.on(cutCopyInit, this.oncutCopyInit, this);
        this.parent.on(menuItemData, this.onMenuItemData, this);
        this.parent.on(resizeEnd, this.onDetailsResizeHandler, this);
        this.parent.on(splitterResize, this.onDetailsResize, this);
        this.parent.on(layoutRefresh, this.onLayoutRefresh, this);
        this.parent.on(dropPath, this.onDropPath, this);
        this.parent.on(updateSelectionData, this.onUpdateSelectionData, this);
    }
    removeEventListener() {
        this.parent.off(finalizeEnd, this.onFinalizeEnd);
        this.parent.off(destroy, this.destroy);
        this.parent.off(layoutChange, this.onLayoutChange);
        this.parent.off(pathChanged, this.onPathChanged);
        this.parent.off(pasteInit, this.onPasteInit);
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(refreshEnd, this.onRefreshEnd);
        this.parent.off(search, this.onSearchFiles);
        this.parent.off(methodCall, this.onMethodCall);
        this.parent.off(actionFailure, this.onActionFailure);
        this.parent.off(modelChanged, this.onPropertyChanged);
        this.parent.off(renameInit, this.onRenameInit);
        this.parent.off(renameEnd, this.onPathChanged);
        this.parent.off(filterEnd, this.onPathChanged);
        this.parent.off(openInit, this.onOpenInit);
        this.parent.off(sortColumn, this.onSortColumn);
        this.parent.off(openEnd, this.onPathChanged);
        this.parent.off(hideLayout, this.onHideLayout);
        this.parent.off(selectAllInit, this.onSelectAllInit);
        this.parent.off(clearAllInit, this.onClearAllInit);
        this.parent.off(deleteInit, this.onDeleteInit);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(pathColumn, this.onPathColumn);
        this.parent.off(selectionChanged, this.onSelectionChanged);
        this.parent.off(beforeRequest, this.onBeforeRequest);
        this.parent.off(afterRequest, this.onAfterRequest);
        this.parent.off(pasteEnd, this.onpasteEnd);
        this.parent.off(cutCopyInit, this.oncutCopyInit);
        this.parent.off(dropInit, this.onDropInit);
        this.parent.off(selectedData, this.onSelectedData);
        this.parent.off(detailsInit, this.onDetailsInit);
        this.parent.off(menuItemData, this.onMenuItemData);
        this.parent.off(resizeEnd, this.onDetailsResizeHandler);
        this.parent.off(splitterResize, this.onDetailsResize);
        this.parent.off(layoutRefresh, this.onLayoutRefresh);
        this.parent.off(dropPath, this.onDropPath);
        this.parent.off(updateSelectionData, this.onUpdateSelectionData);
    }
    onActionFailure() { this.interaction = true; }
    onMenuItemData(args) {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = [this.gridObj.getRowInfo(args.target).rowData];
        }
    }
    onPasteInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.itemData = (this.parent.folderPath !== '') ? this.gridObj.getSelectedRecords() :
                [getPathObject(this.parent)];
        }
    }
    onDetailsInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            if (this.parent.selectedItems.length !== 0) {
                this.parent.itemData = this.gridObj.getSelectedRecords();
            }
            else {
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
            }
        }
    }
    dragHelper(args) {
        let dragTarget = args.sender.target;
        let dragLi = dragTarget.closest('tr.e-row');
        if (!dragLi) {
            return null;
        }
        let name = dragLi.getElementsByClassName('e-fe-text')[0].innerText;
        if (dragLi && !dragLi.querySelector('.e-active')) {
            this.selectRecords([name]);
        }
        getModule(this.parent, dragLi);
        this.parent.activeElements = [];
        this.parent.dragData = [];
        this.parent.dragData = this.gridObj.getSelectedRecords();
        this.parent.dragPath = this.parent.path;
        this.parent.activeElements = this.gridObj.getSelectedRows();
        createVirtualDragElement(this.parent);
        return this.parent.virtualDragElement;
    }
    /* istanbul ignore next */
    onDetailsResize() {
        if (this.parent.view === 'Details' && !this.parent.isMobile && !isNullOrUndefined(this.gridObj)) {
            let gridHeader = this.gridObj.getHeaderContent().querySelector('.e-headercontent');
            let gridHeaderColGroup = gridHeader.firstChild.childNodes[0];
            let gridContentColGroup = this.gridObj.getContent().querySelector('.e-content .e-table').children[0];
            let gridHeaderColNames = this.gridObj.getColumns();
            for (let i = 0; i < gridHeaderColNames.length; i++) {
                if ((!this.isNameWidth && gridHeaderColNames[i].field === 'name') || gridHeaderColNames[i].field === 'filterPath') {
                    if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                        if (this.element.clientWidth <= 500) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: 120px');
                            gridContentColGroup.children[i].setAttribute('style', 'width: 120px');
                        }
                        else if (this.element.clientWidth > 500) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: auto');
                            gridContentColGroup.children[i].setAttribute('style', 'width: auto');
                        }
                    }
                    else {
                        if (this.element.clientWidth <= 680) {
                            if (gridHeaderColNames[i].field === 'name') {
                                gridHeaderColGroup.children[i].setAttribute('style', 'width: 120px');
                                gridContentColGroup.children[i].setAttribute('style', 'width: 120px');
                            }
                            else {
                                gridHeaderColGroup.children[i].setAttribute('style', 'width: 180px');
                                gridContentColGroup.children[i].setAttribute('style', 'width: 180px');
                            }
                        }
                        else if (this.element.clientWidth > 680) {
                            gridHeaderColGroup.children[i].setAttribute('style', 'width: auto');
                            gridContentColGroup.children[i].setAttribute('style', 'width: auto');
                        }
                    }
                }
            }
        }
    }
    onDetailsResizeHandler() {
        this.onDetailsResize();
        if (this.parent.view === 'Details' && !this.parent.isMobile && !isNullOrUndefined(this.gridObj)) {
            this.adjustHeight();
        }
    }
    createDragObj() {
        if (!this.parent.isMobile && this.gridObj) {
            if (this.parent.allowDragAndDrop) {
                if (this.dragObj) {
                    this.dragObj.destroy();
                }
                this.dragObj = new Draggable(this.gridObj.element, {
                    cursorAt: this.parent.dragCursorPosition,
                    enableTailMode: true,
                    dragArea: this.parent.element,
                    dragTarget: '.' + ROW,
                    drag: draggingHandler.bind(this, this.parent),
                    dragStart: (args) => {
                        dragStartHandler(this.parent, args, this.dragObj);
                    },
                    dragStop: dragStopHandler.bind(this, this.parent),
                    enableAutoScroll: true,
                    helper: this.dragHelper.bind(this)
                });
            }
            else if (!this.parent.allowDragAndDrop && this.dragObj) {
                this.dragObj.destroy();
            }
        }
    }
    onDropInit(args) {
        if (this.parent.targetModule === this.getModuleName()) {
            /* istanbul ignore next */
            let cwdData = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            if (!args.target.closest('tr')) {
                this.parent.dropPath = this.parent.path;
                this.parent.dropData = cwdData;
            }
            else {
                let info = null;
                info = this.gridObj.getRowInfo(args.target).rowData;
                this.parent.dropPath = info.isFile ? this.parent.path : getFullPath(this.parent, info, this.parent.path);
                this.parent.dropData = info.isFile ? cwdData : info;
            }
        }
    }
    oncutCopyInit() {
        if (this.parent.activeModule === this.getModuleName()) {
            this.parent.activeRecords = this.gridObj.getSelectedRecords();
            this.parent.activeElements = this.gridObj.getSelectedRows();
        }
    }
    onpasteEnd(args) {
        if (this.parent.view === 'Details') {
            this.isPasteOperation = true;
            if (this.parent.path === this.parent.destinationPath || this.parent.path === getDirectoryPath(this.parent, args)) {
                this.onPathChanged(args);
            }
        }
    }
    onDropPath(args) {
        if (this.parent.view === 'Details') {
            this.isPasteOperation = true;
            this.onPathChanged(args);
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'detailsview';
    }
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.gridObj) {
            this.unWireEvents();
            this.gridObj.destroy();
        }
    }
    updateType(item) {
        let folder = select('.' + FOLDER, item);
        this.parent.isFile = isNullOrUndefined(folder) ? true : false;
    }
    /* istanbul ignore next */
    onSelection(action, args) {
        let eventArgs = {
            action: action, fileDetails: args.data, isInteracted: this.interaction, cancel: false, target: args.target
        };
        this.parent.trigger('fileSelection', eventArgs);
        args.cancel = eventArgs.cancel;
    }
    /* istanbul ignore next */
    onSelected(args) {
        this.parent.activeModule = 'detailsview';
        if (!this.parent.isLayoutChange || this.parent.isFiltered) {
            this.selectedRecords();
        }
        this.parent.notify(selectionChanged, {});
        if (this.gridObj.getSelectedRowIndexes().length === 1) {
            this.firstItemIndex = this.gridObj.selectedRowIndex;
        }
        this.gridObj.element.setAttribute('tabindex', '-1');
        this.triggerSelect('select', args);
        let item = this.gridObj.getRowByIndex(this.gridObj.selectedRowIndex);
        this.updateType(item);
        if (!isNullOrUndefined(item) && !isNullOrUndefined(item.querySelector('.e-checkselect'))) {
            if (this.gridObj.getSelectedRowIndexes().length !== 1) {
                let lastItemIndex = this.gridObj.getSelectedRowIndexes()[this.gridObj.getSelectedRowIndexes().length - 2];
                let lastItem = this.gridObj.getRowByIndex(lastItemIndex);
                lastItem.querySelector('.e-checkselect').setAttribute('tabindex', '-1');
            }
            item.querySelector('.e-rowcell.e-fe-checkbox').removeAttribute('tabindex');
        }
        if (!isNullOrUndefined(this.gridObj) && !isNullOrUndefined(this.gridObj.element.querySelector('.e-checkselectall'))) {
            this.gridObj.element.querySelector('.e-checkselectall').setAttribute('tabindex', '-1');
        }
        let rows = this.gridObj.getSelectedRowIndexes();
        if (!this.parent.allowMultiSelection) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i] === this.gridObj.selectedRowIndex) {
                    this.gridObj.getRowByIndex(rows[i]).setAttribute('tabindex', '0');
                }
                else {
                    this.gridObj.getRowByIndex(rows[i]).removeAttribute('tabindex');
                }
            }
        }
        let len = rows.length;
        if (len > 0) {
            let data = this.gridObj.getRowsObject()[rows[len - 1]].data;
            this.parent.currentItemText = getValue('name', data);
        }
        let indexes = getValue('rowIndexes', args);
        let multiSelect = getValue('enableSelectMultiTouch', this.gridObj.selectionModule);
        if (this.parent.isDevice && isNullOrUndefined(indexes) && args.target && !multiSelect && !args.target.closest('.e-headercell')) {
            this.parent.isFile = getValue('isFile', args.data);
            if (!this.parent.isFile) {
                this.openContent(args.data);
            }
        }
        this.parent.visitedItem = args.row;
        if (this.parent.allowMultiSelection && !isNullOrUndefined(item) && !isNullOrUndefined(item.querySelector('.e-checkselect'))) {
            let checkItem = item.querySelector('.e-checkselect');
            checkItem.focus();
        }
        this.addFocus(this.gridObj.selectedRowIndex);
        if (!this.parent.isLayoutChange) {
            this.isInteracted = true;
        }
    }
    /* istanbul ignore next */
    onPathColumn() {
        if (this.parent.view === 'Details' && !isNullOrUndefined(this.gridObj)) {
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                this.removePathColumn(false);
            }
        }
    }
    selectedRecords() {
        this.parent.setProperties({ selectedItems: [] }, true);
        let selectedRecords = this.gridSelectNodes();
        let selectSize = 0;
        while (selectSize < selectedRecords.length) {
            let record = selectedRecords[selectSize];
            let name = getItemName(this.parent, record);
            this.parent.selectedItems.push(name);
            selectSize++;
        }
        this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
    }
    onDeSelection(args) {
        /* istanbul ignore next */
        if (!this.parent.allowMultiSelection && isNullOrUndefined(args.data)) {
            this.gridObj.getRowByIndex(args.rowIndex).removeAttribute('tabindex');
        }
        else if (this.gridObj.getSelectedRowIndexes().length > 1) {
            let lastItemIndex = this.gridObj.getSelectedRowIndexes()[this.gridObj.getSelectedRowIndexes().length - 2];
            this.gridObj.getRowByIndex(lastItemIndex).querySelector('.e-checkselect').removeAttribute('tabindex');
        }
        if (this.gridObj.selectedRowIndex === -1) {
            this.gridObj.element.setAttribute('tabindex', '0');
        }
        if (!this.isInteracted) {
            this.isInteracted = true;
            return;
        }
        this.selectedRecords();
        if (this.parent.selectedItems.length === 0) {
            setValue('enableSelectMultiTouch', false, this.gridObj.selectionModule);
            removeClass([this.parent.element], MULTI_SELECT);
        }
        this.parent.notify(selectionChanged, {});
        this.triggerSelect('unselect', args);
        this.parent.visitedItem = null;
    }
    triggerSelect(action, args) {
        let eventArgs = { action: action, fileDetails: args.data, isInteracted: this.interaction };
        this.parent.trigger('fileSelect', eventArgs);
        this.interaction = true;
    }
    wireEvents() {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(this.gridObj.element, {
            keyAction: this.keyupHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keyup',
        });
        this.keyboardDownModule = new KeyboardEvents(this.element, {
            keyAction: this.keydownHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        EventHandler.add(this.gridObj.element, 'blur', this.removeFocus, this);
    }
    unWireEvents() {
        this.wireClickEvent(false);
        this.keyboardModule.destroy();
        this.keyboardDownModule.destroy();
        EventHandler.remove(this.gridObj.element, 'blur', this.removeFocus);
    }
    wireClickEvent(toBind) {
        if (toBind) {
            let proxy = this;
            let ele = this.gridObj.getContent();
            this.clickObj = new Touch(ele, {
                tap: (eve) => {
                    if (eve.tapCount === 1 && eve.originalEvent.target.classList.contains('e-content')) {
                        proxy.onClearAllInit();
                    }
                },
                tapHold: (e) => {
                    if (proxy.parent.isDevice) {
                        e.originalEvent.preventDefault();
                        if (proxy.parent.allowMultiSelection) {
                            setValue('enableSelectMultiTouch', proxy.parent.allowMultiSelection, proxy.gridObj.selectionModule);
                            addClass([proxy.parent.element], MULTI_SELECT);
                        }
                        let target = e.originalEvent.target;
                        if (target) {
                            let row = closest(target, '.' + ROW);
                            let index = proxy.gridObj.getRows().indexOf(row);
                            proxy.gridObj.selectRow(index);
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
    }
    /* istanbul ignore next */
    removeSelection() {
        removeClass([this.parent.element], MULTI_SELECT);
        this.gridObj.clearSelection();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.parent.notify(selectionChanged, {});
        if (this.gridObj.selectedRowIndex === -1) {
            this.startIndex = null;
        }
        this.isInteracted = true;
    }
    removeFocus() {
        this.addFocus(null);
    }
    getFocusedItemIndex() {
        return (!isNullOrUndefined(this.getFocusedItem())) ?
            parseInt(this.getFocusedItem().getAttribute('aria-rowindex'), 10) : null;
    }
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    keydownHandler(e) {
        if (!this.isRendered) {
            return;
        }
        switch (e.action) {
            case 'end':
            case 'home':
            case 'space':
            case 'ctrlSpace':
            case 'shiftSpace':
            case 'csSpace':
            case 'ctrlA':
            case 'enter':
            case 'altEnter':
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
            case 'esc':
            case 'del':
            case 'shiftdel':
            case 'ctrlC':
            case 'ctrlV':
            case 'ctrlX':
            case 'f2':
            case 'moveDown':
            case 'moveUp':
                e.preventDefault();
                break;
            default:
                break;
        }
    }
    /* istanbul ignore next */
    // tslint:disable-next-line:max-func-body-length
    keyupHandler(e) {
        if (!this.isRendered) {
            return;
        }
        e.preventDefault();
        let action = e.action;
        let gridItems = getSortedData(this.parent, this.gridObj.dataSource);
        let gridLength = gridItems.length;
        let focItem = this.getFocusedItem();
        let focIndex = this.getFocusedItemIndex();
        let selIndex = this.gridObj.selectedRowIndex;
        let selRowIndeces = this.gridObj.getSelectedRowIndexes();
        switch (action) {
            case 'altEnter':
                GetDetails(this.parent, this.parent.selectedItems, this.parent.path, 'details');
                break;
            case 'esc':
                removeActive(this.parent);
                break;
            case 'del':
            case 'shiftdel':
                this.performDelete();
                break;
            case 'enter':
                if (this.gridObj.selectedRowIndex === -1) {
                    break;
                }
                let rowData = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
                if (rowData) {
                    let data = JSON.parse(JSON.stringify(rowData));
                    this.openContent(data);
                }
                break;
            case 'ctrlC':
                copyFiles(this.parent);
                break;
            case 'ctrlV':
                this.parent.folderPath = '';
                pasteHandler(this.parent);
                break;
            case 'ctrlX':
                cutFiles(this.parent);
                break;
            case 'ctrlD':
                this.doDownload();
                break;
            case 'f2':
                this.performRename();
                break;
            case 'ctrlA':
                if (!isNullOrUndefined(gridItems[0]) && this.parent.allowMultiSelection) {
                    this.gridObj.selectionModule.selectRowsByRange(0, gridItems.length - 1);
                }
                break;
            case 'ctrlHome':
            case 'tab':
                if (!isNullOrUndefined(gridItems[0])) {
                    if (!this.parent.allowMultiSelection && e.action === 'ctrlHome') {
                        this.gridObj.selectRow(0);
                    }
                    else if (this.gridObj.selectedRowIndex !== -1 && e.action === 'tab') {
                        return;
                    }
                    else {
                        this.addFocus(0);
                    }
                }
                break;
            case 'ctrlEnd':
                if (!isNullOrUndefined(gridItems[0])) {
                    (!this.parent.allowMultiSelection) ?
                        this.gridObj.selectRow(gridLength - 1) : this.addFocus(gridLength - 1);
                }
                break;
            case 'shiftHome':
            case 'shiftEnd':
            case 'csHome':
            case 'csEnd':
                if (!this.parent.allowMultiSelection) {
                    this.gridObj.selectRow((e.action === 'shiftHome' || e.action === 'csHome') ? 0 : gridItems.length - 1);
                }
                else {
                    if (!isNullOrUndefined(gridItems[0])) {
                        if (!isNullOrUndefined(selIndex) && selIndex !== -1) {
                            this.checkRowsKey(gridItems, selIndex, null, e);
                        }
                        else {
                            (e.action === 'csHome' || e.action === 'shiftHome') ?
                                this.gridObj.selectRow(0) : this.gridObj.selectionModule.selectRowsByRange(0, gridItems.length - 1);
                        }
                    }
                }
                break;
            case 'space':
            case 'csSpace':
            case 'shiftSpace':
            case 'ctrlSpace':
                this.spaceSelection(selRowIndeces, focIndex, selIndex, e);
                break;
            case 'csUp':
            case 'csDown':
            case 'shiftUp':
            case 'shiftDown':
                this.shiftMoveMethod(gridItems, selIndex, focIndex, selRowIndeces, e);
                break;
            case 'ctrlUp':
            case 'ctrlDown':
                (!this.parent.allowMultiSelection) ? this.moveFunction(gridItems, e, selIndex) :
                    this.ctrlMoveFunction(gridItems, e, selIndex);
                break;
            case 'home':
                let firstItem = [getValue(this.parent.hasId ? 'id' : 'name', gridItems[0])];
                this.parent.setProperties({ selectedItems: firstItem }, true);
                this.selectRecords(firstItem);
                break;
            case 'moveUp':
            case 'moveDown':
                this.moveFunction(gridItems, e, selIndex);
                break;
            case 'end':
                let lastItem = [getValue(this.parent.hasId ? 'id' : 'name', gridItems[gridLength - 1])];
                this.parent.setProperties({ selectedItems: lastItem }, true);
                this.selectRecords(lastItem);
                break;
        }
    }
    gridSelectNodes() {
        return this.gridObj.getSelectedRecords();
    }
    doDownload() {
        if (this.parent.selectedItems.length !== 0) {
            this.parent.itemData = this.gridObj.getSelectedRecords();
            let items = this.parent.itemData;
            for (let i = 0; i < items.length; i++) {
                if (!hasDownloadAccess(items[i])) {
                    createDeniedDialog(this.parent, items[i], permissionDownload);
                    return;
                }
            }
            Download(this.parent, this.parent.path, this.parent.selectedItems);
        }
    }
    performDelete() {
        if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
            this.parent.itemData = this.gridObj.getSelectedRecords();
            let items = this.parent.itemData;
            for (let i = 0; i < items.length; i++) {
                if (!hasEditAccess(items[i])) {
                    createDeniedDialog(this.parent, items[i], permissionEdit);
                    return;
                }
            }
            createDialog(this.parent, 'Delete');
        }
    }
    performRename() {
        if (this.parent.selectedItems.length === 1) {
            this.updateRenameData();
            doRename(this.parent);
        }
    }
    updateRenameData() {
        let data = this.gridSelectNodes()[0];
        updateRenamingData(this.parent, data);
    }
    shiftMoveMethod(gridItems, selIndex, focIndex, selRowIndeces, e) {
        if (!this.parent.allowMultiSelection) {
            this.moveFunction(gridItems, e, selIndex);
        }
        else {
            if (selIndex === -1 && (e.action === 'csUp' || e.action === 'csDown')) {
                this.ctrlMoveFunction(gridItems, e, selIndex);
            }
            else if (selIndex !== -1 && focIndex !== selIndex &&
                !((e.action === 'csUp' || e.action === 'csDown') && this.isSelected(selRowIndeces, focIndex))) {
                this.shiftSelectFocusItem(selIndex, focIndex, selRowIndeces, e);
            }
            else {
                this.shiftSelectedItem(selIndex, selRowIndeces, gridItems, e);
            }
        }
    }
    moveFunction(selectedItems, e, rowIndex) {
        if (!isNullOrUndefined(this.getFocusedItem()) && this.parent.allowMultiSelection) {
            if (e.action === 'moveDown') {
                this.gridObj.selectRow(this.getFocusedItemIndex() + 1);
            }
            else {
                this.gridObj.selectRow(this.getFocusedItemIndex() - 1);
            }
        }
        else if (!isNullOrUndefined(rowIndex) && rowIndex !== -1) {
            if (e.action === 'moveDown' || e.action === 'ctrlDown' || e.action === 'shiftDown' || e.action === 'csDown') {
                this.gridObj.selectRow(rowIndex + ((rowIndex !== selectedItems.length - 1) ? 1 : 0));
            }
            else {
                this.gridObj.selectRow(rowIndex - ((rowIndex !== 0) ? 1 : 0));
            }
        }
        else {
            if (!isNullOrUndefined(selectedItems[0])) {
                this.gridObj.selectRow(0);
            }
        }
    }
    spaceSelection(selRowIndeces, focIndex, selIndex, e) {
        if (!this.isSelected(selRowIndeces, focIndex) && selIndex !== -1 && (e.action === 'shiftSpace' || e.action === 'csSpace')) {
            if (focIndex < selIndex) {
                this.gridObj.selectionModule.selectRowsByRange(focIndex, selIndex);
            }
            else {
                this.gridObj.selectionModule.selectRowsByRange(selIndex, focIndex);
            }
        }
        else if (!isNullOrUndefined(this.getFocusedItem()) && focIndex !== selIndex) {
            selRowIndeces.push(this.getFocusedItemIndex());
            this.gridObj.selectRows(selRowIndeces);
        }
        else if (selIndex !== -1 && e.action === 'ctrlSpace' && this.parent.allowMultiSelection) {
            let lItem = selIndex;
            selRowIndeces.pop();
            this.gridObj.selectRows(selRowIndeces);
            this.addFocus(lItem);
        }
        else if (e.action === 'shiftSpace') {
            this.gridObj.selectRow(selIndex);
        }
    }
    ctrlMoveFunction(items, e, rowIndex) {
        let nextItem;
        if (!isNullOrUndefined(this.getFocusedItem())) {
            let nextIndex = this.getFocusedItemIndex();
            nextItem = (e.action === 'ctrlDown' || e.action === 'csDown') ?
                nextIndex + ((nextIndex < items.length - 1) ? 1 : 0) : nextIndex - ((nextIndex < 1) ? 0 : 1);
        }
        else if (!isNullOrUndefined(rowIndex) && rowIndex !== -1) {
            nextItem = (e.action === 'ctrlDown' || e.action === 'csDown') ?
                rowIndex + ((rowIndex < items.length) ? 1 : 0) : rowIndex - ((rowIndex < 1) ? 0 : 1);
        }
        else {
            if (!isNullOrUndefined(items[0])) {
                nextItem = 0;
            }
        }
        this.addFocus(nextItem);
    }
    checkRowsKey(items, indexValue, focIndex, e) {
        if (this.gridObj.checkAllRows === 'Uncheck' || this.gridObj.checkAllRows === 'Intermediate') {
            if (e.action !== 'csHome' && e.action !== 'csEnd') {
                if (isNullOrUndefined(this.startIndex) && this.firstItemIndex !== indexValue) {
                    this.firstItemIndex = indexValue;
                }
                if (e.action === 'shiftEnd') {
                    this.gridObj.selectionModule.selectRowsByRange(this.firstItemIndex, items.length - 1);
                }
                else {
                    this.gridObj.selectionModule.selectRowsByRange(0, this.firstItemIndex);
                }
                this.startIndex = indexValue;
            }
            else {
                if (e.action === 'csEnd') {
                    this.gridObj.
                        selectRows(this.InnerItems(isNullOrUndefined(indexValue) ? 0 : indexValue, isNullOrUndefined(focIndex) ? items.length - 1 : focIndex, e));
                }
                else {
                    ((isNullOrUndefined(indexValue)) ? this.gridObj.selectRow(0) :
                        this.gridObj.selectRows(this.InnerItems(isNullOrUndefined(focIndex) ? 0 : focIndex, indexValue, e)));
                }
            }
        }
        else {
            this.gridObj.selectionModule.selectRow(((e.action === 'shiftHome' || e.action === 'csHome') ? 0 : items.length - 1));
        }
    }
    InnerItems(fItem, lItem, e) {
        let itemArr = this.gridObj.getSelectedRowIndexes();
        if (e.action === 'csEnd') {
            for (let i = fItem + 1; i <= lItem; i++) {
                itemArr.push(i);
            }
        }
        else {
            for (let i = lItem - 1; fItem <= i; i--) {
                itemArr.push(i);
            }
        }
        return itemArr;
    }
    shiftSelectFocusItem(selIndex, fIndex, selRowIndexes, e) {
        let lItem;
        let fItem;
        lItem = fIndex + ((e.action === 'shiftDown' || e.action === 'csDown') ? 1 : -1);
        fItem = isNullOrUndefined(this.startIndex) ? selIndex : selRowIndexes[0];
        if (fItem === lItem) {
            this.gridObj.selectRow(fItem);
        }
        else {
            (fItem < lItem) ?
                ((e.action === 'shiftDown' || e.action === 'csDown') ? this.gridObj.selectionModule.selectRowsByRange(fItem, lItem) :
                    this.gridObj.selectionModule.selectRowsByRange(lItem, fItem)) : ((e.action === 'shiftDown' || e.action === 'csDown') ?
                this.gridObj.selectionModule.selectRowsByRange(lItem, fItem) :
                this.gridObj.selectionModule.selectRowsByRange(fItem, lItem));
        }
        this.startIndex = this.gridObj.selectedRowIndex;
    }
    addFocus(item) {
        let fItem = this.getFocusedItem();
        let itemElement = this.gridObj.getRowByIndex(item);
        if (fItem) {
            fItem.removeAttribute('tabindex');
            removeClass([fItem], [FOCUS, FOCUSED]);
        }
        if (!isNullOrUndefined(itemElement)) {
            this.gridObj.element.setAttribute('tabindex', '-1');
            itemElement.setAttribute('tabindex', '0');
            itemElement.focus();
            addClass([itemElement], [FOCUS, FOCUSED]);
        }
    }
    getFocusedItem() {
        return select('.' + FOCUSED, this.element);
    }
    isSelected(selRowIndexes, focIndex) {
        let check = false;
        for (let i = 0; i <= selRowIndexes.length - 1; i++) {
            if (selRowIndexes[i] === focIndex) {
                check = true;
                break;
            }
        }
        return check;
    }
    shiftSelectedItem(selIndex, selRowIndexes, gridItems, e) {
        if (selIndex === -1) {
            this.gridObj.selectRow(0);
        }
        else {
            if (isNullOrUndefined(this.startIndex) && e.shiftKey) {
                this.startIndex = this.gridObj.selectedRowIndex;
                this.gridObj.selectRows([selIndex, (e.action === 'shiftDown' || e.action === 'csDown') ?
                        (selIndex + ((selIndex !== gridItems.length - 1) ? 1 : 0)) : (selIndex - ((selIndex !== 0) ? 1 : 0))]);
            }
            else {
                if (e.action === 'shiftDown' || e.action === 'shiftUp') {
                    if (e.action === 'shiftDown' && selRowIndexes.indexOf(selIndex + 1) === -1) {
                        if (selIndex !== gridItems.length - 1) {
                            selRowIndexes.push(selIndex + 1);
                        }
                    }
                    else if (e.action === 'shiftUp' && selRowIndexes.indexOf(selIndex - 1) === -1) {
                        if (selIndex !== 0) {
                            selRowIndexes.push(selIndex - 1);
                        }
                    }
                    else {
                        selRowIndexes.pop();
                    }
                    this.gridObj.selectRows(selRowIndexes);
                }
                else {
                    if (e.action === 'csDown') {
                        if (!this.isSelected(selRowIndexes, this.getFocusedItemIndex() + 1)) {
                            selRowIndexes.push((this.getFocusedItemIndex() + 1));
                            this.gridObj.selectRows(selRowIndexes);
                        }
                        else {
                            this.addFocus(this.getFocusedItemIndex() + 1);
                        }
                    }
                    else if (!this.isSelected(selRowIndexes, this.getFocusedItemIndex() - 1)) {
                        selRowIndexes.push((this.getFocusedItemIndex() - 1));
                        this.gridObj.selectRows(selRowIndexes);
                    }
                    else {
                        this.addFocus(this.getFocusedItemIndex() - 1);
                    }
                }
            }
        }
    }
    onMethodCall(e) {
        if (this.parent.view !== 'Details') {
            return;
        }
        let action = getValue('action', e);
        switch (action) {
            case 'deleteFiles':
                this.deleteFiles(getValue('ids', e));
                break;
            case 'downloadFiles':
                this.downloadFiles(getValue('ids', e));
                break;
            case 'openFile':
                this.openFile(getValue('id', e));
                break;
            case 'createFolder':
                this.interaction = false;
                break;
            case 'renameFile':
                this.interaction = false;
                this.renameFile(getValue('id', e), getValue('newName', e));
                break;
            case 'selectAll':
                this.interaction = false;
                this.onSelectAllInit();
                break;
            case 'clearSelection':
                this.interaction = false;
                this.onClearAllInit();
                break;
        }
    }
    getRecords(nodes) {
        let gridRecords = this.gridObj.getCurrentViewRecords();
        let records = [];
        let hasFilter = (this.parent.breadcrumbbarModule.searchObj.element.value !== '' || this.parent.isFiltered) ? true : false;
        let filter$$1 = this.parent.hasId ? 'id' : 'name';
        if (this.parent.hasId || !hasFilter) {
            for (let i = 0, len = gridRecords.length; i < len; i++) {
                if (nodes.indexOf(getValue(filter$$1, gridRecords[i])) !== -1) {
                    records.push(gridRecords[i]);
                }
            }
        }
        else {
            for (let i = 0, len = gridRecords.length; i < len; i++) {
                let name = getValue('filterPath', gridRecords[i]) + getValue('name', gridRecords[i]);
                if (nodes.indexOf(name) !== -1) {
                    records.push(gridRecords[i]);
                }
            }
        }
        return records;
    }
    deleteFiles(ids) {
        this.parent.activeModule = 'detailsview';
        if (isNullOrUndefined(ids)) {
            this.performDelete();
            return;
        }
        let records = this.getRecords(ids);
        if (records.length === 0) {
            return;
        }
        let data = [];
        let newIds = [];
        for (let i = 0; i < records.length; i++) {
            data[i] = records[i];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDeleteFiles(this.parent, data, newIds);
    }
    downloadFiles(ids) {
        if (isNullOrUndefined(ids)) {
            this.doDownload();
            return;
        }
        let dRecords = this.getRecords(ids);
        if (dRecords.length === 0) {
            return;
        }
        let data = [];
        let newIds = [];
        for (let i = 0; i < dRecords.length; i++) {
            data[i] = dRecords[i];
            newIds[i] = getItemName(this.parent, data[i]);
        }
        doDownloadFiles(this.parent, data, newIds);
    }
    openFile(id) {
        if (isNullOrUndefined(id)) {
            return;
        }
        let records = this.getRecords([id]);
        if (records.length > 0) {
            this.openContent(records[0]);
        }
    }
    renameFile(id, name) {
        this.parent.activeModule = 'detailsview';
        if (isNullOrUndefined(id)) {
            this.performRename();
            return;
        }
        let records = this.getRecords([id]);
        if (records.length > 0) {
            updateRenamingData(this.parent, records[0]);
            if (!isNullOrUndefined(name)) {
                if (hasEditAccess(this.parent.itemData[0])) {
                    rename(this.parent, this.parent.path, name);
                }
                else {
                    createDeniedDialog(this.parent, this.parent.itemData[0], permissionEdit);
                }
            }
            else {
                doRename(this.parent);
            }
        }
    }
}

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

export { AjaxSettings, toolbarItems, ToolbarSettings, SearchSettings, columnArray, DetailsViewSettings, fileItems, folderItems, layoutItems, ContextMenuSettings, NavigationPaneSettings, UploadSettings, Column, TOOLBAR_ID, LAYOUT_ID, NAVIGATION_ID, TREE_ID, GRID_ID, LARGEICON_ID, DIALOG_ID, ALT_DIALOG_ID, IMG_DIALOG_ID, EXTN_DIALOG_ID, UPLOAD_DIALOG_ID, RETRY_DIALOG_ID, CONTEXT_MENU_ID, SORTBY_ID, VIEW_ID, SPLITTER_ID, CONTENT_ID, BREADCRUMBBAR_ID, UPLOAD_ID, RETRY_ID, SEARCH_ID, ROOT, CONTROL, CHECK_SELECT, ROOT_POPUP, MOBILE, MOB_POPUP, MULTI_SELECT, FILTER, LAYOUT, NAVIGATION, LAYOUT_CONTENT, LARGE_ICONS, TB_ITEM, LIST_ITEM, LIST_TEXT, LIST_PARENT, TB_OPTION_TICK, TB_OPTION_DOT, BLUR, ACTIVE, HOVER, FOCUS, FOCUSED, CHECK, FRAME, CB_WRAP, ROW, ROWCELL, EMPTY, EMPTY_CONTENT, EMPTY_INNER_CONTENT, CLONE, DROP_FOLDER, DROP_FILE, FOLDER, ICON_IMAGE, ICON_MUSIC, ICON_VIDEO, LARGE_ICON, LARGE_EMPTY_FOLDER, LARGE_EMPTY_FOLDER_TWO, LARGE_ICON_FOLDER, SELECTED_ITEMS, TEXT_CONTENT, GRID_HEADER, TEMPLATE_CELL, TREE_VIEW, MENU_ITEM, MENU_ICON, SUBMENU_ICON, GRID_VIEW, ICON_VIEW, ICON_OPEN, ICON_UPLOAD, ICON_CUT, ICON_COPY, ICON_PASTE, ICON_DELETE, ICON_RENAME, ICON_NEWFOLDER, ICON_DETAILS, ICON_SHORTBY, ICON_REFRESH, ICON_SELECTALL, ICON_DOWNLOAD, ICON_OPTIONS, ICON_GRID, ICON_LARGE, ICON_BREADCRUMB, ICON_CLEAR, ICON_DROP_IN, ICON_DROP_OUT, ICON_NO_DROP, ICONS, DETAILS_LABEL, ERROR_CONTENT, STATUS, BREADCRUMBS, RTL, DISPLAY_NONE, COLLAPSED, FULLROW, ICON_COLLAPSIBLE, SPLIT_BAR, HEADER_CHECK, OVERLAY, VALUE, isFile, modelChanged, initialEnd, finalizeEnd, createEnd, filterEnd, beforeDelete, pathDrag, deleteInit, deleteEnd, refreshEnd, resizeEnd, splitterResize, pathChanged, destroy, beforeRequest, upload, skipUpload, afterRequest, download, layoutRefresh, actionFailure, search, openInit, openEnd, selectionChanged, selectAllInit, clearAllInit, clearPathInit, layoutChange, sortByChange, nodeExpand, detailsInit, menuItemData, renameInit, renameEndParent, renameEnd, showPaste, hidePaste, selectedData, cutCopyInit, pasteInit, pasteEnd, cutEnd, hideLayout, updateTreeSelection, treeSelect, sortColumn, pathColumn, searchTextChange, beforeDownload, downloadInit, dropInit, dragEnd, dropPath, dragHelper, dragging, updateSelectionData, methodCall, permissionRead, permissionEdit, permissionEditContents, permissionCopy, permissionUpload, permissionDownload, FileManager, Toolbar$1 as Toolbar, BreadCrumbBar, NavigationPane, DetailsView, LargeIconsView, createDialog, createExtDialog, createImageDialog, ContextMenu$2 as ContextMenu };
//# sourceMappingURL=ej2-filemanager.es2015.js.map
