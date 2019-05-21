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
const toolbarItems = ['NewFolder', 'Upload', 'Delete', 'Download', 'Rename',
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
 * Specifies the Ajax settings of the File Manager.
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
const fileItems = ['Open', '|', 'Delete', 'Download', 'Rename', '|', 'Details'];
const folderItems = ['Open', '|', 'Delete', 'Rename', 'Download', '|', 'Details'];
const layoutItems = ['SortBy', 'View', 'Refresh', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'];
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
    Property(true)
], UploadSettings.prototype, "autoUpload", void 0);
__decorate$6([
    Property(0)
], UploadSettings.prototype, "minFileSize", void 0);
__decorate$6([
    Property(30000000)
], UploadSettings.prototype, "maxFileSize", void 0);

/**
 * FileExplorer common modules
 */

/**
 * Specifies the File Manager internal ID's
 */
const TOOLBAR_ID = '_toolbar';
/** @hidden */
const LAYOUT_ID = '_layout';
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
const SEARCH_ID = '_search';
/**
 * Specifies the File Manager internal class names
 */
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
const MULTI_SELECT = 'e-fe-m-select';
/** @hidden */
const FILTER = 'e-fe-m-filter';
/** @hidden */
const LAYOUT = 'e-layout';
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
const afterRequest = 'after-request';
/** @hidden */
const download = 'download';
/** @hidden */
const uiRefresh = 'ui-refresh';
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
const renameInit = 'rename-init';
/** @hidden */
const renameEnd = 'rename-end';
/** @hidden */
const showPaste = 'show-paste';
/** @hidden */
const hidePaste = 'hide-paste';
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
const downloadInit = 'download-init';

/**
 * Utility file for common actions
 */
//Gets the path for tree nodes
/* istanbul ignore next */
function copyPath(file) {
    let path = file.path.substr(0, file.path.length - 1);
    file.targetPath = path.substr(0, path.lastIndexOf('/') + 1);
}
function updatePath(node, text, instance) {
    instance.setProperties({ path: getPath(node, text) }, true);
    instance.pathId = getPathId(node);
}
function getPath(element, text) {
    let matched = getParents(element, text, false);
    let path = '/';
    for (let i = matched.length - 2; i >= 0; i--) {
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
function getParents(element, text, isId) {
    let matched = [text];
    let el = element.parentNode;
    while (!isNullOrUndefined(el)) {
        if (matches(el, '.' + LIST_ITEM)) {
            let parentText = isId ? el.getAttribute('data-uid') : select('.' + LIST_TEXT, el).textContent;
            matched.push(parentText);
        }
        el = el.parentNode;
    }
    return matched;
}
//Stores tree nodes while performing cut, copy and paste operation
function treeNodes(tree, gridFiles, action) {
    /* istanbul ignore next */
    if (gridFiles) {
        let i = 0;
        for (i; i < gridFiles.length; i++) {
            let files = gridFiles[i];
            let id = files.id;
            if (files.isFile === false) {
                (action === 'cut') ? tree.treeNodes.push(id) : tree.treeNodes = tree.treeNodes;
                (action === 'copy') ?
                    tree.copyNodes.push({ ['name']: files.name }) : tree.copyNodes = tree.copyNodes;
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
    let nodeNames = [];
    removeBlur(file);
    let blurEle = file.activeElements;
    file.targetPath = file.path;
    let i = 0;
    let isFile$$1;
    let id;
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
    let blurEle = (!hover) ? file.element.querySelectorAll('.' + BLUR) :
        file.element.querySelectorAll('.' + HOVER);
    let i = 0;
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
    let currFiles = getValue(parent.path, parent.feFiles);
    if (currFiles) {
        let item = parent.selectedItems[parent.selectedItems.length - 1];
        for (let i = 0, len = currFiles.length; i < len; i++) {
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
    let isFile$$1 = getValue('isFile', file);
    if (!isFile$$1) {
        return 'e-fe-folder';
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
function getImageUrl(parent, item) {
    let baseUrl = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    let imgUrl;
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
    let query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    let lists = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}
/* istanbul ignore next */
function getItemObject(parent, item) {
    let name = select('.' + LIST_TEXT, item).textContent;
    return getObject(parent, name);
}
function getObject(parent, name) {
    let currFiles = getValue(parent.path, parent.feFiles);
    let query = new Query().where('name', 'equal', name);
    let lists = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}
function createEmptyElement(parent, operation, element) {
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
    let dirs = getDirectories(result.files);
    for (let i = 0, len = dirs.length; i < len; i++) {
        setValue('nodeId', rootId + '_' + i, dirs[i]);
    }
}
function setDateObject(args) {
    for (let i = 0; i < args.length; i++) {
        setValue('dateCreated', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('dateModified', new Date(getValue('dateModified', args[i])), args[i]);
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
    let text = id.substring(id.lastIndexOf('_') + 1);
    let field = text;
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
    let currfolders = path.split('/');
    let folders = parent.originalPath.split('/');
    for (let i = currfolders.length - 1, len = folders.length - 1; i < len; i++) {
        let eventName = (folders[i + 1] === '') ? finalizeEnd : initialEnd;
        let newPath = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
        let data = getObject(parent, folders[i]);
        let id = getValue('nodeId', data);
        parent.setProperties({ path: newPath }, true);
        parent.pathId.push(id);
        parent.itemData = [data];
        read(parent, eventName, parent.path);
        break;
    }
}
function openSearchFolder(parent, data) {
    let fPath = getValue('filterPath', data) + '/';
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
    let data = { action: 'Read', path: path, showHiddenItems: parent.showHiddenItems, data: parent.itemData };
    createAjax(parent, data, readSuccess, event);
}
/**
 * Function to create new folder in File Manager.
 * @private
 */
function createFolder(parent, itemName) {
    let data = { action: 'CreateFolder', path: parent.path, name: itemName, data: parent.itemData };
    createAjax(parent, data, createSuccess);
}
/* Function to rename the folder/file in File Manager.
* @private
*/
function rename(parent, itemNewName) {
    let data = {
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
    let data = {
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
    let data = { action: operation, path: path, itemNames: items };
    createAjax(parent, data, deleteSuccess, path, treeView);
}
/**
 * Function to get details of file's and folder's in File Manager.
 * @private
 */
/* istanbul ignore next */
function GetDetails(parent, itemNames, path, operation) {
    let data = { action: operation, path: path, itemNames: itemNames };
    createAjax(parent, data, detailsSuccess, path, null, operation);
}
function createAjax(parent, data, fn, event, navigationPane, operation, targetPath) {
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
    parent.trigger('beforeSend', eventArgs);
    if (eventArgs.cancel) {
        return;
    }
    parent.notify(beforeRequest, {});
    let ajax = new Ajax({
        url: getValue('url', eventArgs.ajaxSettings),
        type: getValue('type', eventArgs.ajaxSettings),
        mode: getValue('mode', eventArgs.ajaxSettings),
        dataType: getValue('dataType', eventArgs.ajaxSettings),
        contentType: getValue('contentType', eventArgs.ajaxSettings),
        data: getValue('data', eventArgs.ajaxSettings),
        beforeSend: getValue('beforeSend', eventArgs.ajaxSettings),
        onSuccess: (result) => {
            if (typeof (result) === 'string') {
                result = JSON.parse(result);
            }
            parent.notify(afterRequest, { action: 'success' });
            if (!isNullOrUndefined(result.files)) {
                // tslint:disable-next-line
                setDateObject(result.files);
                for (let i = 0, len = result.files.length; i < len; i++) {
                    let item = result.files[i];
                    setValue('iconClass', fileType(item), item);
                }
            }
            if (getValue('action', data) === 'Read') {
                let path = getValue('path', data);
                setNodeId(result, parent.expandedId ? parent.expandedId : parent.pathId[parent.pathId.length - 1]);
                setValue(path, result.files, parent.feFiles);
                setValue(path, result.cwd, parent.feParent);
            }
            fn(parent, result, event, navigationPane, operation, targetPath);
            if (typeof getValue('onSuccess', eventArgs.ajaxSettings) === 'function') {
                getValue('onSuccess', eventArgs.ajaxSettings)();
            }
        },
        onFailure: () => {
            let result = {
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
            let ele = select('#newname', parent.dialogObj.element);
            let error = getLocaleText(parent, 'Validation-NewFolder-Exists').replace('{0}', '"' + ele.value + '"');
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
            let treePath = parent.parentPath.split('/');
            let newPath = parent.parentPath.replace(treePath[treePath.length - 2] + '/', parent.renameText + '/');
            parent.setProperties({ path: newPath }, true);
        }
        read(parent, renameEnd, parent.path);
    }
    else {
        if (result.error.code === '400') {
            let ele = select('#rename', parent.dialogObj.element);
            let error = getLocaleText(parent, 'Validation-Rename-Exists').replace('{0}', '"' + parent.currentItemText + '"');
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
        for (let i = 0; i < result.files.length; i++) {
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
    let data = { action: 'Search', path: path, searchString: searchString, showHiddenItems: showHiddenItems, caseSensitive: caseSensitive };
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
    let itemNames = [];
    let itemPath;
    let downloadUrl = parent.ajaxSettings.downloadUrl ? parent.ajaxSettings.downloadUrl : parent.ajaxSettings.url;
    for (let item = 0; item < selectedRecords.length; item++) {
        itemNames.push(selectedRecords[item].name);
        itemPath = selectedRecords[item].filterPath;
    }
    let data = {
        'action': 'Download',
        'path': !isNullOrUndefined(itemPath) ? itemPath : parent.path,
        'itemNames': itemNames
    };
    let form = createElement('form', {
        id: parent.element.id + '_downloadForm',
        attrs: { action: downloadUrl, method: 'post', name: 'downloadForm', 'download': '' }
    });
    let input = createElement('input', {
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
    let options = getOptions(parent, text, e, details, replaceItems);
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
    let options = { header: '', content: '', buttons: [], open: null };
    text = (details && details.multipleFiles === true) ? 'MultipleFileDetails' : text;
    switch (text) {
        case 'NewFolder':
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
                    click: (e) => {
                        if (e.type === 'keydown') {
                            return;
                        }
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
        case 'DuplicateItems':
            parent.replaceItems = replaceItems;
            options.header = getLocaleText(parent, 'Header-Duplicate');
            // tslint:disable-next-line
            options.content = '<div>' + parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1) + getLocaleText(parent, 'Content-Duplicate') + '</div>';
            options.buttons = [
                {
                    buttonModel: { isPrimary: true, content: getLocaleText(parent, 'Button-Yes') },
                    click: (e) => {
                        if (e.type === 'keydown') {
                            return;
                        }
                        // tslint:disable-next-line
                        let item = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
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
                    click: () => {
                        parent.fileLength++;
                        if (replaceItems[parent.fileLength]) {
                            // tslint:disable-next-line
                            let item = parent.replaceItems[parent.fileLength].substring(parent.replaceItems[parent.fileLength].lastIndexOf('/') + 1);
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
            let intl = new Internationalization();
            let parseDate = intl.parseDate(details.modified, { format: 'MM/dd/yyy hh:mm:ss' });
            let formattedString = intl.formatDate(new Date(details.modified), { format: 'MMMM dd, yyyy HH:mm:ss' });
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
                    click: (e) => {
                        if (e.type === 'keydown') {
                            return;
                        }
                        parent.dialogObj.hide();
                    },
                }
            ];
            break;
        case 'MultipleFileDetails':
            let location = details.location;
            options.header = details.name;
            options.content = '<table><tr><td>' + getLocaleText(parent, 'Type')
                + ':</td><td class="' + VALUE + '">Multiple Types</td></tr>' +
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
            let event = e;
            if (event.error.code === '523') {
                options.header = 'Access Denied';
            }
            else {
                options.header = getLocaleText(parent, 'Error');
            }
            options.content = '<div class="' + ERROR_CONTENT + '">' + event.error.message + '</div>';
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
    parent.renameText = ele.value;
    if (parent.currentItemText === text) {
        parent.dialogObj.hide();
        return;
    }
    if (parent.selectedItems.length === 0) {
        parent.parentPath = parent.path;
        let treePath = parent.path.split('/');
        let newPath = parent.path.replace(treePath[treePath.length - 2] + '/', '');
        parent.setProperties({ path: newPath }, true);
    }
    if (parent.isFile) {
        let oldExtension = parent.currentItemText.substr(parent.currentItemText.lastIndexOf('.'));
        let newExtension = text.substr(text.lastIndexOf('.'));
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
                            click: () => {
                                parent.extDialogObj.hide();
                                rename(parent, parent.renameText);
                            },
                        },
                        {
                            buttonModel: { content: getLocaleText(parent, 'Button-No') },
                            click: () => {
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
    let delItems = activeElement('Delete', null, parent);
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
    let len = ele.value.length - 1;
    if (ele.value !== '' && ((ele.value.lastIndexOf('.') === len) || (ele.value.lastIndexOf(' ') === len))) {
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
    let image = createElement('img', { className: 'e-image', attrs: { src: imageUrl } });
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
    setTimeout(() => {
        if (parent.viewerObj) {
            parent.viewerObj.element.focus();
        }
    });
    updateImage(parent);
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
 * LargeIcons module
 */
class LargeIconsView {
    /**
     * Constructor for the LargeIcons module
     * @hidden
     */
    constructor(parent) {
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
    render(args) {
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
            let iconsView = select('#' + this.parent.element.id + LARGEICON_ID, this.parent.element);
            let ul = select('ul', iconsView);
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
                let emptyList = this.element.querySelector('.' + LIST_PARENT);
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
            let activeEle = this.element.querySelectorAll('.' + ACTIVE);
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
        this.parent.trigger('beforeFileLoad', eventArgs);
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
            if (this.parent.cutNodes && this.parent.cutNodes.length !== 0) {
                let indexes = this.getIndexes(args.files, this.parent.selectedNodes);
                let length = 0;
                while (length < indexes.length) {
                    addBlur(this.itemList[indexes[length]]);
                    length++;
                }
            }
            let activeEle = this.element.querySelectorAll('.' + ACTIVE);
            this.parent.activeElements = (activeEle.length !== 0) ? activeEle : this.parent.activeElements;
            if (activeEle.length !== 0) {
                this.element.focus();
            }
            this.checkItem();
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
            /* istanbul ignore next */
            let pasteNodes = this.parent.pasteNodes;
            let className = ((this.parent.selectedItems &&
                this.parent.selectedItems.indexOf(getValue('name', args.files[i])) !== -1) ||
                (pasteNodes && pasteNodes.length !== 0 && pasteNodes.indexOf(getValue('name', args.files[i])) !== -1)) ?
                LARGE_ICON + ' e-active' : LARGE_ICON;
            if (icon === ICON_IMAGE && this.parent.showThumbnail) {
                let imgUrl = getImageUrl(this.parent, items[i]);
                setValue('imageUrl', imgUrl, items[i]);
            }
            else {
                setValue('icon', icon, items[i]);
            }
            setValue('htmlAttributes', { class: className, title: getValue('name', args.files[i]) }, items[i]);
            i++;
        }
        return items;
    }
    onFinalizeEnd(args) {
        this.render(args);
        this.parent.notify(searchTextChange, args);
    }
    onCreateEnd(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.clearSelect();
        this.selectItems(args.files, [getValue('name', this.parent.createdItem)]);
        this.parent.createdItem = null;
        this.parent.largeiconsviewModule.element.focus();
        this.parent.persistData = false;
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
        if (this.parent.view === 'LargeIcons' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
        }
    }
    onRenameEnd(args) {
        if (this.parent.view !== 'LargeIcons') {
            return;
        }
        this.onLayoutChange(args);
        this.clearSelect();
        this.parent.setProperties({ selectedItems: [] }, true);
        this.selectItems(args.files, [getValue('name', this.parent.renamedItem)]);
        this.parent.renamedItem = null;
    }
    onPathChanged(args) {
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
    }
    onOpenInit(args) {
        if (this.parent.activeModule === 'largeiconsview') {
            this.doOpenAction(args.target);
        }
    }
    onHideLayout(args) {
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
        }
    }
    onClearAllInit() {
        if (this.parent.view === 'LargeIcons') {
            this.clearSelection();
        }
    }
    onBeforeRequest() {
        this.isRendered = false;
    }
    onAfterRequest(args) {
        this.isRendered = true;
    }
    /* istanbul ignore next */
    onSearch(args) {
        this.parent.searchedItems = args.files;
        this.onLayoutChange(args);
    }
    removeEventListener() {
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
    }
    addEventListener() {
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
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'selectedItems':
                    this.isSetModel = true;
                    if (this.parent.selectedItems.length !== 0) {
                        let currentDataSource = getValue(this.parent.path, this.parent.feFiles);
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
    }
    /**
     * Destroys the LargeIcons module.
     * @method destroy
     * @return {void}
     */
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
        let fItem = this.getFocusedItem();
        let cList = target.classList;
        this.parent.isFile = false;
        let action = 'select';
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
            let eventArgs = { cancel: false, fileDetails: details };
            this.parent.trigger('beforeFileOpen', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
            let text = select('.' + LIST_TEXT, item).textContent;
            if (!this.parent.isFile) {
                let val = this.parent.breadcrumbbarModule.searchObj.element.value;
                if (val === '') {
                    let newPath = this.parent.path + text + '/';
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
                let icon = fileType(details);
                if (icon === ICON_IMAGE) {
                    let imgUrl = getImageUrl(this.parent, details);
                    createImageDialog(this.parent, getValue('name', details), imgUrl);
                }
            }
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
    }
    updateRenameData() {
        let item = select('.' + LIST_ITEM + '.' + ACTIVE, this.element);
        let data = this.getItemObject(item);
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
    }
    getVisitedItem() {
        let currFiles = getValue(this.parent.path, this.parent.feFiles);
        let item = this.parent.selectedItems[this.parent.selectedItems.length - 1];
        let indexes = this.getIndexes(currFiles, [item]);
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
            this.startItem = nextItem;
            this.clearSelect();
            this.addActive(nextItem);
            this.addFocus(nextItem);
            this.parent.notify(selectionChanged, {});
            this.triggerSelect('select', nextItem);
        }
    }
    /* istanbul ignore next */
    cut() {
        cutFiles(this.parent);
        this.parent.fileOperation(this.parent.nodeNames);
    }
    /* istanbul ignore next */
    copy() {
        copyFiles(this.parent);
        this.parent.fileOperation(this.parent.nodeNames);
    }
    /* istanbul ignore next */
    escapeKey() {
        removeBlur(this.parent);
        this.parent.selectedNodes = [];
        this.parent.navigationpaneModule.treeNodes = [];
    }
    spaceKey(fItem) {
        if (!isNullOrUndefined(fItem) && !fItem.classList.contains(ACTIVE)) {
            this.addActive(fItem);
            this.parent.notify(selectionChanged, {});
            this.triggerSelect('select', fItem);
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
                if (!this.isSetModel) {
                    this.parent.selectedItems.push(nextItem.textContent);
                }
                addClass([nextItem], [ACTIVE]);
                this.checkState(nextItem, true);
            }
            this.parent.visitedItem = nextItem;
        }
    }
    removeActive(preItem) {
        if (!isNullOrUndefined(preItem)) {
            removeClass([preItem], [ACTIVE]);
            this.checkState(preItem, false);
            let index = this.parent.selectedItems.indexOf(preItem.textContent);
            if (index > -1) {
                this.parent.selectedItems.splice(index, 1);
            }
            this.parent.visitedItem = null;
        }
    }
    addFocus(item) {
        let fItem = this.getFocusedItem();
        if (fItem) {
            removeClass([fItem], [FOCUS]);
        }
        addClass([item], [FOCUS]);
    }
    checkState(item, toCheck) {
        if (!this.parent.allowMultiSelection) {
            return;
        }
        let checkEle = select('.' + FRAME, item);
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
        for (let i = 0, len = eles.length; i < len; i++) {
            this.removeActive(eles[i]);
        }
    }
    resizeHandler() {
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
    triggerSelect(action, item) {
        let data = this.getItemObject(item);
        this.parent.visitedData = data;
        let eventArgs = { action: action, fileDetails: data };
        this.parent.trigger('fileSelect', eventArgs);
    }
    selectItems(files, items) {
        let indexes = this.getIndexes(files, items);
        for (let j = 0, len = indexes.length; j < len; j++) {
            let eveArgs = { ctrlKey: true, shiftKey: false };
            this.doSelection(this.itemList[indexes[j]], eveArgs);
        }
    }
    getIndexes(files, items) {
        let indexes = [];
        for (let i = 0, len = this.items.length; i < len; i++) {
            if (items.indexOf(getValue('name', this.items[i])) !== -1) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    getItemObject(item) {
        let index = this.itemList.indexOf(item);
        return this.items[index];
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
        this.parent = parent;
        this.treeView = this.parent.navigationpaneModule;
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
                    if (!isNullOrUndefined(e.newProp.searchSettings.allowSearchOnTyping)) {
                        this.searchEventBind(e.newProp.searchSettings.allowSearchOnTyping);
                    }
                    break;
            }
        }
    }
    render() {
        this.addEventListener();
    }
    onPathChange() {
        let rootName = getValue('name', getValue('/', this.parent.feParent));
        if (!this.addressBarLink) {
            this.addressPath = rootName + this.parent.path;
        }
        else {
            this.addressPath = this.addressBarLink;
        }
        let addressPath = this.addressPath;
        let newPath = addressPath.substring(addressPath.indexOf('/'), addressPath.length);
        this.parent.setProperties({ path: newPath }, true);
        let arrayOfAddressBar = [];
        arrayOfAddressBar = addressPath.split('/');
        let addressbarUL = null;
        addressbarUL = this.parent.createElement('ul');
        addressbarUL.setAttribute('class', 'e-addressbar-ul');
        let addressbarLI = null;
        let countOfAddressBarPath = arrayOfAddressBar.length - 1;
        if (arrayOfAddressBar.length > 1) {
            let id = '';
            for (let i = 0; i < countOfAddressBarPath; i++) {
                let addressATag = null;
                addressbarLI = this.parent.createElement('li');
                for (let j = 0; j <= i; j++) {
                    id = id + arrayOfAddressBar[j] + '/';
                }
                addressbarLI.setAttribute('data-utext', id);
                addressbarLI.classList.add('e-address-list-item');
                if (i !== 0) {
                    let icon = createElement('span', { className: ICONS });
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
        this.addressBarLink = '';
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
        let searchInput = createElement('input', { id: id, attrs: { autocomplete: 'off' } });
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
        breadCrumbBarWidth = breadCrumbBarWidth - searchWrap.offsetWidth;
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
            let searchWord;
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
                let caseSensitive = this.parent.searchSettings.ignoreCase;
                let hiddenItems = this.parent.showHiddenItems;
                Search(this.parent, search, this.parent.path, searchWord, hiddenItems, !caseSensitive);
            }
            else {
                read(this.parent, search, this.parent.path);
            }
        }
    }
    addressPathClickHandler(e) {
        let li = e.target;
        if (li.nodeName === 'LI' || li.nodeName === 'A') {
            let node = li.nodeName === 'LI' ? li.children[0] : li;
            if (!isNullOrUndefined(node)) {
                let currentPath = this.updatePath(node);
                this.liClick(currentPath);
                let treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        }
    }
    /* istanbul ignore next */
    onShowInput() {
        if (this.parent.isMobile) {
            if (this.parent.element.classList.contains(FILTER)) {
                removeClass([this.parent.element], FILTER);
            }
            else {
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
        this.parent.pathId = [];
        for (let i = 0, len = link.length - 1; i < len; i++) {
            this.parent.pathId.push(ids[i]);
        }
        let path = this.addressBarLink.substr(this.addressBarLink.indexOf('/'), this.addressBarLink.length);
        return path;
    }
    onUpdatePath() {
        this.onPathChange();
        this.removeSearchValue();
    }
    onCreateEnd(args) {
        let path = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onPathChange();
        }
    }
    /* istanbul ignore next */
    onDeleteEnd() {
        let path = this.addressPath.substring(this.addressPath.indexOf('/'), this.addressPath.length);
        if (path !== this.parent.path) {
            this.onUpdatePath();
        }
    }
    /* istanbul ignore next */
    removeSearchValue() {
        if (this.searchObj.value !== '' || this.searchObj.element.value !== '') {
            this.searchObj.value = '';
            this.searchObj.element.value = '';
            this.searchObj.dataBind();
        }
    }
    onResize() {
        this.onPathChange();
    }
    liClick(currentPath) {
        read(this.parent, pathChanged, currentPath);
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
        this.parent.on(renameEnd, this.onUpdatePath, this);
        this.parent.on(deleteEnd, this.onDeleteEnd, this);
        this.parent.on(splitterResize, this.onResize, this);
        this.parent.on(resizeEnd, this.onResize, this);
        this.parent.on(searchTextChange, this.onSearchTextChange, this);
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'enter':
                e.preventDefault();
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
        this.parent.off(createEnd, this.onCreateEnd);
        this.parent.off(renameEnd, this.onUpdatePath);
        this.parent.off(deleteEnd, this.onDeleteEnd);
        this.parent.off(splitterResize, this.onResize);
        this.parent.off(resizeEnd, this.onResize);
        this.parent.off(searchTextChange, this.onSearchTextChange);
    }
    /**
     * For internal use only - Get the module name.
     *  @private
     */
    getModuleName() {
        return 'breadcrumbbar';
    }
    /**
     * Destroys the PopUpMenu module.
     * @method destroy
     * @return {void}
     */
    destroy() {
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
            beforeItemRender: this.onBeforeItemRender.bind(this),
            select: this.onSelect.bind(this),
            beforeOpen: this.onBeforeOpen.bind(this),
            cssClass: getCssClass(this.parent, ROOT_POPUP)
        });
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
    /* istanbul ignore next */
    onBeforeOpen(args) {
        let select$$1 = false;
        let uid;
        // tslint:disable-next-line
        let data;
        let treeFolder = false;
        let target = args.event.target;
        if (target.classList.contains('e-spinner-pane')) {
            target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(FULLROW)[0];
        }
        if (target.classList.contains(FULLROW)) {
            this.parent.selectedItems.length = 0;
        }
        this.targetElement = this.parent.view === 'Details' ? closest(target, 'tr') : target;
        let view = this.getTargetView(target);
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
                let eveArgs = { ctrlKey: true, shiftKey: true };
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
        let eventArgs = {
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
    setFolderItem(isTree) {
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
    }
    /* istanbul ignore next */
    setFileItem(target) {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file);
        this.contextMenu.dataBind();
        if (this.parent.selectedItems.length !== 1) {
            this.contextMenu.enableItems([this.getMenuId('Rename')], false, true);
        }
    }
    setLayoutItem(target) {
        this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout);
        this.contextMenu.dataBind();
        if ((this.parent.view === 'LargeIcons' &&
            (closest(target, '#' + this.parent.element.id + LARGEICON_ID).getElementsByClassName(EMPTY).length !== 0))
            || (this.parent.view === 'Details' &&
                (closest(target, '#' + this.parent.element.id + GRID_ID).getElementsByClassName(EMPTY).length !== 0))) {
            this.contextMenu.enableItems([this.getMenuId('SelectAll')], false, true);
            this.contextMenu.dataBind();
        }
    }
    /* istanbul ignore next */
    onSelect(args) {
        if (isNullOrUndefined(args.item) || !args.item.id) {
            return;
        }
        let itemText = args.item.id.substr((this.parent.element.id + '_cm_').length);
        let details;
        if (itemText === 'refresh' || itemText === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        }
        else {
            details = getFileObject(this.parent);
        }
        let eventArgs = {
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
            let path;
            // tslint:disable-next-line
            let data;
            if (this.parent.view === 'Details') {
                let uid = this.targetElement.getAttribute('data-uid');
                data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data;
                /* istanbul ignore next */
            }
            else {
                let elements = this.targetElement.parentElement;
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
            let newPath = this.parent.path + path;
            this.parent.setProperties({ path: newPath }, true);
        }
        // tslint:disable-next-line
        let items = this.parent.selectedItems;
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
                    let elements = this.parent.activeElements;
                    for (let ele = 0; ele < elements.length; ele++) {
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
    }
    /* istanbul ignore next */
    changeLayout(view) {
        if (this.parent.view !== view) {
            this.parent.setProperties({ view: view }, true);
            read(this.parent, layoutChange, this.parent.path);
        }
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
                case 'enableRtl':
                    this.contextMenu.enableRtl = e.newProp.enableRtl;
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
    /**
     * Destroys the ContextMenu module.
     * @method destroy
     * @return {void}
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.removeEventListener();
        this.contextMenu.destroy();
        if (document.getElementById(this.parent.element.id + CONTEXT_MENU_ID)) {
            remove(document.getElementById(this.parent.element.id + CONTEXT_MENU_ID));
        }
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

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
        this.selectedNodes = [];
        this.duplicateItems = [];
        this.previousPath = [];
        this.nextPath = [];
        this.uploadItem = [];
        this.deleteRecords = [];
        this.isFile = false;
        this.sortOrder = 'Ascending';
        this.sortBy = 'name';
        this.enablePaste = false;
        this.persistData = false;
        this.isOpened = false;
        this.searchedItems = [];
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
        createSpinner({ target: this.element }, createElement);
        this.addWrapper();
        this.keyConfigs = {
            altN: 'alt+n',
            f5: 'f5',
            ctrlShift1: 'ctrl+shift+1',
            ctrlShift2: 'ctrl+shift+2'
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
        this.selectedItems = (isNullOrUndefined(this.selectedItems)) ? [] : this.selectedItems;
        this.fileView = this.view;
        this.setRtl(this.enableRtl);
        this.addEventListeners();
        read(this, (this.path !== this.originalPath) ? initialEnd : finalizeEnd, this.path);
        this.adjustHeight();
        if (isNullOrUndefined(this.navigationpaneModule)) {
            this.splitterObj.collapse(0);
            let bar = select('.' + SPLIT_BAR, this.element);
            bar.classList.add(DISPLAY_NONE);
        }
        this.wireEvents();
    }
    ensurePath() {
        let currentPath = this.path;
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
        let treeWrap = this.createElement('div', {
            id: this.element.id + TREE_ID
        });
        layoutWrap.appendChild(treeWrap);
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
            className: LARGE_ICONS
        });
        contentWrap.appendChild(largeiconWrap);
        let overlay = this.createElement('span', { className: OVERLAY });
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
        let toolBarHeight = this.toolbarModule ? toolbar.offsetHeight : 0;
        this.splitterObj.height = (this.element.clientHeight - toolBarHeight).toString();
        this.splitterObj.dataBind();
    }
    /* istanbul ignore next */
    splitterResize() {
        this.notify(splitterResize, {});
    }
    splitterAdjust() {
        let bar = select('.' + SPLIT_BAR, this.element);
        if (this.navigationPaneSettings.visible) {
            this.splitterObj.expand(0);
            bar.classList.remove(DISPLAY_NONE);
        }
        else {
            this.splitterObj.collapse(0);
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
        });
        this.uploadObj.appendTo('#' + this.element.id + UPLOAD_ID);
    }
    updateUploader() {
        this.uploadObj.autoUpload = this.uploadSettings.autoUpload;
        this.uploadObj.minFileSize = this.uploadSettings.minFileSize;
        this.uploadObj.maxFileSize = this.uploadSettings.maxFileSize;
        this.uploadObj.dataBind();
    }
    /* istanbul ignore next */
    onOpen() {
        this.isOpened = true;
        this.uploadDialogObj.element.focus();
    }
    /* istanbul ignore next */
    onClose() {
        this.isOpened = false;
        this.uploadObj.clearAll();
    }
    /* istanbul ignore next */
    onUploading(args) {
        args.customFormData = [{ 'path': this.path }, { 'action': 'Save' }];
    }
    /* istanbul ignore next */
    onRemoving(args) {
        args.customFormData = [{ 'path': this.path }, { 'action': 'Remove' }];
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
    onSelected() {
        this.uploadDialogObj.show();
    }
    /* istanbul ignore next */
    onUploadSuccess(files) {
        this.trigger('onSuccess', { action: 'Upload', result: files });
        read(this, pathChanged, this.path);
    }
    /* istanbul ignore next */
    onUploadFailure(files) {
        this.trigger('onError', { action: 'Upload', error: files });
    }
    onInitialEnd() {
        setNextPath(this, this.path);
    }
    addEventListeners() {
        this.on(beforeRequest, this.showSpinner, this);
        this.on(afterRequest, this.hideSpinner, this);
        this.on(initialEnd, this.onInitialEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.onContextMenu, this);
    }
    removeEventListeners() {
        if (this.isDestroyed) {
            return;
        }
        this.off(beforeRequest, this.showSpinner);
        this.off(afterRequest, this.hideSpinner);
        this.off(initialEnd, this.onInitialEnd);
        EventHandler.remove(this.element, 'contextmenu', this.onContextMenu);
    }
    resizeHandler() {
        this.notify(resizeEnd, {});
    }
    keyActionHandler(e) {
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
    }
    wireEvents() {
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    unWireEvents() {
        this.keyboardModule.destroy();
    }
    setPath() {
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
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
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
                    this.notify(modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
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
     * Refresh the folder files of the file manager.
     * @returns void
     */
    refreshFiles() {
        refresh(this);
    }
    /**
     * To select node names for performing file operations
     * @public
     * @hidden
     */
    fileOperation(nodes, operation) {
        let i = 0;
        let selectNodes = nodes;
        while (i < nodes.length) {
            (operation !== 'Remove') ? this.selectedNodes.push(selectNodes[i].name) : this.selectedNodes = this.selectedNodes;
            (operation === 'Remove') ? this.deleteRecords.push(selectNodes[i].name) : this.deleteRecords = this.deleteRecords;
            i++;
        }
    }
    /**
     * Gets details of file's / folder's
     * @hidden
     */
    /* istanbul ignore next */
    getDetails() {
        removeBlur(this);
        this.targetPath = this.path;
        if (this.activeElements && this.activeElements.length === 0) {
            this.activeElements = this.element.querySelectorAll('.' + ACTIVE);
        }
        let items = activeElement('FileInfo', null, this);
        /* istanbul ignore next */
        items = (items.length !== 0) ? items : activeElement('FileInfo', false, this);
        this.selectedNodes = [];
        this.fileOperation(items);
        if (this.selectedNodes.length === 0 || this.targetPath === '') {
            this.selectedNodes[0] = '';
        }
        GetDetails(this, this.selectedNodes, this.targetPath, 'GetDetails');
    }
    /**
     * Performs paste operation
     * @hidden
     */
    pasteHandler() {
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
    }
    /**
     * Performs delete operation
     * @hidden
     */
    deleteHandler(items) {
        this.deleteRecords = [];
        this.fileOperation(items, 'Remove');
        Delete(this, this.deleteRecords, this.targetPath, 'Remove', this.navigationpaneModule);
        this.deleteRecords = [];
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
    Property(false)
], FileManager.prototype, "enableRtl", void 0);
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

/**
 * File Manager base modules
 */

/**
 * `Toolbar` module is used to handle Toolbar actions.
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
        this.items = this.toolbarItemData(this.getItems(this.parent.toolbarSettings.items));
        this.toolbarObj = new Toolbar({
            items: this.items,
            created: this.toolbarCreateHandler.bind(this),
            overflowMode: 'Popup',
            clicked: this.onClicked.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.toolbarObj.appendTo('#' + this.parent.element.id + TOOLBAR_ID);
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
        if (tool === 'refresh' || tool === 'newfolder') {
            details = getPathObject(this.parent);
            this.parent.itemData = [details];
        }
        else {
            details = getFileObject(this.parent);
        }
        let eventArgs = { cancel: false, fileDetails: details, item: args.item };
        this.parent.trigger('toolbarClick', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        switch (tool) {
            case 'sortby':
                let target = closest(args.originalEvent.target, '.' + TB_ITEM);
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
                        let elementRecords = [];
                        let elements = selectAll('.e-active', this.parent.largeiconsviewModule.listElements);
                        for (let ele = 0; ele < elements.length; ele++) {
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
                let uploadEle = select('#' + this.parent.element.id + UPLOAD_ID, this.parent.element);
                uploadEle.click();
                break;
            case 'selectall':
                this.parent.notify(selectAllInit, {});
                break;
            case 'selection':
                this.parent.notify(clearAllInit, {});
                break;
        }
    }
    toolbarCreateHandler() {
        if (!isNullOrUndefined(select('#' + this.getId('SortBy'), this.parent.element))) {
            let items = [
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
                enableRtl: this.parent.enableRtl
            });
            this.layoutBtnObj.appendTo('#' + this.parent.element.id + VIEW_ID);
        }
        this.hideItems(this.default, true);
        this.hideStatus();
    }
    updateSortByButton() {
        let items = this.buttonObj.items;
        for (let itemCount = 0; itemCount < items.length; itemCount++) {
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
    }
    getPupupId(id) {
        return this.parent.element.id + '_ddl_' + id.toLowerCase();
    }
    layoutChange(args) {
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
    }
    updateLayout(view) {
        this.parent.setProperties({ view: view }, true);
        let searchWord;
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
                    let txt = '<span class="e-status">2 ' + itemText + '</span><span class="' + ICON_CLEAR + '"></span>';
                    item = { id: itemId, tooltipText: itemTooltip, overflow: 'Show', align: 'Right', template: txt };
                    break;
                case 'View':
                    let id = this.parent.element.id + VIEW_ID;
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
            this.items = this.toolbarItemData(this.getItems(e.newProp.toolbarSettings.items));
            this.toolbarObj.items = this.items;
            this.toolbarObj.dataBind();
        }
    }
    onSelectionChanged(e) {
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
        let ele = select('.' + STATUS, this.toolbarObj.element);
        if (this.parent.selectedItems.length > 0 && ele) {
            if (this.parent.selectedItems.length === 1) {
                ele.textContent = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Item-Selection');
            }
            else {
                ele.textContent = this.parent.selectedItems.length + ' ' + getLocaleText(this.parent, 'Items-Selection');
            }
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
        let ele = select('.' + STATUS, this.toolbarObj.element);
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
    onLayoutChange(args) {
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
                case 'enableRtl':
                    let rtl = e.newProp.enableRtl;
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
    }
    /**
     * Destroys the Toolbar module.
     * @method destroy
     * @return {void}
     */
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
    }
    /**
     * Enables or disables the specified Toolbar items.
     * @param {string[]} items - Specifies an array of items to be enabled or disabled.
     * @param {boolean} isEnable - Determines whether the Toolbar items should to be enabled or disabled.
     */
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
 * `TreeView` module is used to handle Navigation actions.
 */
class NavigationPane {
    /**
     * Constructor for the TreeView module
     * @hidden
     */
    constructor(parent) {
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
    onInit(args) {
        if (!isNullOrUndefined(this.treeObj)) {
            return;
        }
        let rootData = getValue('/', this.parent.feParent);
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
    }
    onDrowNode(args) {
        let eventArgs = {
            element: args.node,
            fileDetails: args.nodeData,
            module: 'NavigationPane'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
    }
    addChild(files, target, prevent) {
        let directories = getDirectories(files);
        if (directories.length > 0) {
            let length = 0;
            let folders = directories;
            while (length < directories.length) {
                folders[length].icon = 'e-fe-folder';
                length++;
            }
            this.treeObj.addNodes(directories, target, null, prevent);
        }
    }
    /**
     * Tree node selection event
     * @private
     */
    onNodeSelected(args) {
        if (this.parent.breadcrumbbarModule && this.parent.breadcrumbbarModule.searchObj) {
            this.parent.breadcrumbbarModule.searchObj.element.value = '';
        }
        this.parent.searchedItems = [];
        this.parent.activeElements = this.treeObj.element.querySelectorAll('.' + ACTIVE);
        if (!args.isInteracted) {
            return;
        }
        let text = getValue('text', args.nodeData);
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
    }
    /**
     * Tree node expand event
     * @private
     */
    /* istanbul ignore next */
    onNodeExpand(args) {
        if (!args.isInteracted) {
            return;
        }
        let path = getPath(args.node, getValue('text', args.nodeData));
        if (args.node.querySelector('.' + LIST_ITEM) === null) {
            this.expandNodeTarget = args.node.getAttribute('data-uid');
            this.parent.expandedId = this.expandNodeTarget;
            this.parent.itemData = this.treeObj.getTreeData(getValue('id', args.nodeData));
            read(this.parent, nodeExpand, path);
        }
    }
    /* istanbul ignore next */
    onNodeExpanded(args) {
        this.addChild(args.files, this.expandNodeTarget, false);
        this.parent.expandedId = null;
    }
    onNodeEditing(args) {
        if (!isNullOrUndefined(args.innerHtml)) {
            args.cancel = true;
        }
    }
    onPathChanged(args) {
        let currFiles = getValue(this.parent.path, this.parent.feFiles);
        if (this.expandNodeTarget === 'add') {
            let sNode = select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
            let ul = select('.' + LIST_PARENT, sNode);
            if (isNullOrUndefined(ul)) {
                this.addChild(args.files, this.treeObj.selectedNodes[0], true);
            }
            this.expandNodeTarget = '';
        }
        if (isNullOrUndefined(currFiles)) {
            setValue(this.parent.path, args.files, this.parent.feFiles);
        }
    }
    updateTree(args) {
        let id = this.treeObj.selectedNodes[0];
        let toExpand = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
        this.removeChildNodes(id);
        setValue(this.parent.path, args.files, this.parent.feFiles);
        this.addChild(args.files, id, !toExpand);
    }
    removeChildNodes(id) {
        let sNode = select('[data-uid="' + id + '"]', this.treeObj.element);
        let parent = select('.' + LIST_PARENT, sNode);
        let childs = parent ? Array.prototype.slice.call(parent.children) : null;
        this.treeObj.removeNodes(childs);
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
        this.onInit(args);
        this.addChild(args.files, getValue('nodeId', args.cwd), false);
    }
    onFinalizeEnd(args) {
        this.onInit(args);
        let id = getValue('nodeId', args.cwd);
        this.removeChildNodes(id);
        this.addChild(args.files, id, false);
        this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
    }
    onCreateEnd(args) {
        this.updateTree(args);
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
        if (this.parent.selectedItems.length === 0) {
            this.updateRenameData();
        }
    }
    /* istanbul ignore next */
    onRenameEnd(args) {
        let resultData = new DataManager(this.treeObj.getTreeData()).
            executeLocal(new Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
        if (resultData[0]) {
            this.treeObj.updateNode(resultData[0][this.treeObj.fields.id].toString(), this.parent.renameText);
        }
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
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
    }
    /* istanbul ignore next */
    onDownLoadInit() {
        this.updateActionData();
    }
    onSelectionChanged(e) {
        this.treeObj.selectedNodes = [e.selectedNode];
    }
    onClearPathInit(e) {
        this.removeChildNodes(e.selectedNode);
    }
    addEventListener() {
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
    }
    removeEventListener() {
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
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'navigationpane';
    }
    /**
     * Destroys the TreeView module.
     * @method destroy
     * @return {void}
     */
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
        let fileObj = this.parent;
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
    }
    updateRenameData() {
        this.updateActionData();
        this.parent.currentItemText = getValue('name', this.parent.itemData[0]);
    }
    updateActionData() {
        let data = this.treeObj.getTreeData(this.treeObj.selectedNodes[0])[0];
        this.parent.itemData = [data];
        this.parent.isFile = false;
    }
    /**
     * Move tree folders on cut operation
     * @public
     */
    moveNode() {
        this.treeObj.moveNodes(this.treeNodes, this.treeObj.selectedNodes[0], null);
        let fileObj = this.parent;
        removeBlur(this.parent);
        this.treeNodes = [];
    }
    /**
     * Remove tree folders on delete operation
     * @public
     */
    /* istanbul ignore next */
    removeNode() {
        this.treeObj.removeNodes(this.removeNodes);
        let fileObj = this.parent;
        removeBlur(this.parent);
        this.removeNodes = [];
    }
    /**
     * Add tree folders on copy operation
     * @public
     */
    copyNode() {
        this.treeObj.addNodes(this.copyNodes, this.activeNode, null);
        let fileObj = this.parent;
        removeBlur(this.parent);
    }
}

Grid.Inject(Resize, ContextMenu$1, Sort, VirtualScroll);
/**
 * GridView module
 */
class DetailsView {
    /**
     * Constructor for the GridView module
     * @hidden
     */
    constructor(parent) {
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
    render(args) {
        if (this.parent.view === 'Details') {
            removeClass([this.parent.element], MULTI_SELECT);
            let items = getSortedData(this.parent, args.files);
            let columns = this.getColumns();
            let sortSettings;
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
    }
    getColumns() {
        let columns;
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
            for (let i = 0, len = columns.length; i < len; i++) {
                columns[i].headerText = getLocaleText(this.parent, columns[i].headerText);
            }
        }
        let iWidth = ((this.parent.isMobile || this.parent.isBigger) ? '54' : '46');
        let icon = {
            field: 'type', width: iWidth, minWidth: iWidth, template: '<span class="e-fe-icon ${iconClass}"></span>',
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
        this.gridObj.refreshColumns();
    }
    onRowDataBound(args) {
        /* istanbul ignore next */
        if (!this.parent.showFileExtension && getValue('isFile', args.data)) {
            let textEle = args.row.querySelector('.e-fe-text');
            let name = getValue('name', args.data);
            let type = getValue('type', args.data);
            textEle.innerHTML = name.substr(0, name.length - type.length);
        }
        if (getValue('size', args.data) !== undefined && args.row.querySelector('.e-fe-size')) {
            let sizeEle = args.row.querySelector('.e-fe-size');
            let modifiedSize;
            if (!getValue('isFile', args.data)) {
                modifiedSize = '';
            }
            else {
                let sizeValue = getValue('size', args.data);
                if ((sizeValue / 1024) === 0) {
                    modifiedSize = '0 KB';
                }
                else {
                    let intl = new Internationalization();
                    let value = intl.formatNumber((sizeValue / 1024), { format: 'n' });
                    modifiedSize = value + ' KB';
                }
            }
            sizeEle.innerHTML = modifiedSize;
        }
        if (this.parent.isMobile) {
            if (getValue('dateModified', args.data) !== undefined && args.row.querySelector('.e-fe-date')) {
                let dateEle = args.row.querySelector('.e-fe-date');
                let intl = new Internationalization();
                let columns = this.parent.detailsViewSettings.columns;
                let format;
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i].field === 'dateModified') {
                        format = columns[i].format;
                        break;
                    }
                }
                let formattedString = intl.formatDate(new Date(getValue('dateModified', args.data)), format);
                dateEle.innerHTML = formattedString;
            }
        }
        let checkWrap = args.row.querySelector('.' + CB_WRAP);
        if (checkWrap) {
            checkWrap.classList.add('e-small');
        }
        let eventArgs = {
            element: args.row,
            fileDetails: args.data,
            module: 'DetailsView'
        };
        this.parent.trigger('beforeFileLoad', eventArgs);
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
                    this.sortSelectedNodes.push(getValue('name', data));
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
        let items = getSortedData(this.parent, this.gridObj.dataSource);
        args.result = items;
    }
    maintainBlur() {
        let length = 0;
        let records = this.gridObj.getCurrentViewRecords();
        for (length; length < records.length; length++) {
            let nodeEle = this.gridObj.getDataRows()[length];
            let name = nodeEle.querySelector('.' + TEMPLATE_CELL).textContent;
            if (this.parent.selectedNodes.indexOf(name) !== -1) {
                let node = selectAll('.' + ROWCELL, nodeEle);
                let nodeLength = 0;
                while (nodeLength < node.length) {
                    addBlur(node[nodeLength]);
                    nodeLength++;
                }
            }
        }
    }
    /* istanbul ignore next */
    onDataBound(args) {
        if (this.parent.selectedItems.length !== 0) {
            this.selectedItem = true;
        }
        if (this.pasteOperation === true || this.selectedItem === true) {
            let selectedNodes = (this.selectedItem !== true) ? this.parent.selectedNodes : this.parent.selectedItems;
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
        this.checkEmptyDiv(this.emptyArgs);
    }
    selectRecords(nodes) {
        let gridRecords = this.gridObj.getCurrentViewRecords();
        let sRecords = [];
        for (let i = 0, len = gridRecords.length; i < len; i++) {
            if (nodes.indexOf(getValue('name', gridRecords[i])) !== -1) {
                sRecords.push(i);
            }
        }
        if (sRecords.length !== 0) {
            this.gridObj.selectRows(sRecords);
        }
    }
    onSortColumn(args) {
        this.gridObj.sortModule.sortColumn(this.parent.sortBy, this.parent.sortOrder);
    }
    onPropertyChanged(e) {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            /* istanbul ignore next */
            return;
        }
        for (let prop of Object.keys(e.newProp)) {
            switch (prop) {
                case 'height':
                    this.adjustHeight();
                    break;
                case 'detailsViewSettings':
                    if (!isNullOrUndefined(this.gridObj)) {
                        let columns = this.getColumns();
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
    }
    onPathChanged(args) {
        if (this.parent.breadcrumbbarModule.searchObj.element.value.trim() === '' && this.gridObj) {
            this.parent.searchedItems = [];
            let len = this.gridObj.columns.length;
            // tslint:disable-next-line
            let column = JSON.parse(JSON.stringify(this.gridObj.columns));
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
    }
    checkEmptyDiv(args) {
        let items = getSortedData(this.parent, args.files);
        if (items.length === 0 && !isNullOrUndefined(this.element.querySelector('.' + GRID_VIEW))) {
            createEmptyElement(this.parent, getValue('name', args), this.element);
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
    onOpenInit(args) {
        if (this.parent.activeModule === 'detailsview') {
            let data = this.gridObj.getSelectedRecords()[0];
            this.openContent(data);
        }
    }
    /**
     * Triggers when double click on the grid record
     * @public
     */
    DblClickEvents(args) {
        this.gridObj.selectRows([args.rowIndex]);
        let data;
        if (args.rowData) {
            data = JSON.parse(JSON.stringify(args.rowData));
            this.openContent(data);
        }
    }
    openContent(data) {
        let eventArgs = { cancel: false, fileDetails: data };
        this.parent.trigger('beforeFileOpen', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (getValue('isFile', data)) {
            let icon = fileType(data);
            if (icon === ICON_IMAGE) {
                let name = getValue('name', data);
                let imgUrl = getImageUrl(this.parent, data);
                createImageDialog(this.parent, name, imgUrl);
            }
        }
        else {
            let val = this.parent.breadcrumbbarModule.searchObj.element.value;
            if (val === '') {
                let newPath = this.parent.path + getValue('name', data) + '/';
                this.parent.setProperties({ path: newPath }, true);
                this.parent.pathId.push(getValue('nodeId', data));
                this.parent.itemData = [data];
                openAction(this.parent);
            }
            else {
                openSearchFolder(this.parent, data);
            }
        }
    }
    /* istanbul ignore next */
    onLayoutChange(args) {
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
    }
    /* istanbul ignore next */
    onSearchFiles(args) {
        if (this.parent.view === 'Details') {
            let len = this.gridObj.columns.length;
            // tslint:disable-next-line
            let column = JSON.parse(JSON.stringify(this.gridObj.columns));
            if (column[len - 1].field) {
                if (column[len - 1].field === 'filterPath') {
                    this.gridObj.columns.pop();
                }
            }
            let item = { field: 'filterPath', headerText: 'path', minWidth: 180 };
            if (!this.parent.isMobile) {
                this.gridObj.columns.push(item);
            }
            this.gridObj.refreshColumns();
            this.parent.searchedItems = args.files;
            this.onPathChanged(args);
        }
    }
    changeData(args) {
        this.isInteracted = false;
        this.gridObj.dataSource = getSortedData(this.parent, args.files);
        if (this.parent.selectedItems) {
            this.selectedItem = true;
        }
    }
    onFinalizeEnd(args) {
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
    }
    onCreateEnd(args) {
        if (this.parent.view !== 'Details') {
            return;
        }
        this.onPathChanged(args);
    }
    onRenameInit() {
        if (this.parent.view === 'Details' && this.parent.selectedItems.length === 1) {
            this.updateRenameData();
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
        this.changeData(args);
    }
    onHideLayout(args) {
        if (this.parent.view !== 'Details' && this.gridObj) {
            this.gridObj.element.classList.add(DISPLAY_NONE);
        }
    }
    onSelectAllInit() {
        if (this.parent.view === 'Details') {
            this.isInteracted = false;
            this.gridObj.selectionModule.selectRowsByRange(0, this.gridObj.getRows().length);
            this.isInteracted = true;
        }
    }
    onClearAllInit() {
        if (this.parent.view === 'Details') {
            this.removeSelection();
        }
    }
    /* istanbul ignore next */
    onSelectionChanged() {
        removeClass([this.element], HEADER_CHECK);
        if (this.parent.selectedItems.length > 0) {
            addClass([this.element], HEADER_CHECK);
        }
    }
    onBeforeRequest() {
        this.isRendered = false;
    }
    onAfterRequest(args) {
        this.isRendered = true;
    }
    addEventListener() {
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
    }
    removeEventListener() {
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
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'detailsview';
    }
    /**
     * Destroys the GridView module.
     * @method destroy
     * @return {void}
     */
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
    /**
     * Grid row selected event
     * @private
     */
    /* istanbul ignore next */
    onSelected(args) {
        this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + ACTIVE);
        this.parent.activeModule = 'detailsview';
        this.selectedRecords();
        this.parent.notify(selectionChanged, {});
        this.triggerSelect('select', args);
        if (this.parent.allowMultiSelection) {
            let rows = this.gridObj.getSelectedRowIndexes();
            let len = rows.length;
            if (len > 1) {
                let data = this.gridObj.getRowsObject()[rows[len - 1]].data;
                this.parent.currentItemText = getValue('name', data);
            }
        }
        if (this.parent.selectedItems.length === 1) {
            let data = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
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
    }
    /* istanbul ignore next */
    onPathColumn(args) {
        if (this.parent.view === 'Details') {
            let len = this.gridObj.columns.length;
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
                // tslint:disable-next-line
                let column = JSON.parse(JSON.stringify(this.gridObj.columns));
                if (column[len - 1].field) {
                    if (column[len - 1].field === 'filterPath') {
                        this.gridObj.columns.pop();
                        this.gridObj.refreshColumns();
                    }
                }
            }
        }
    }
    selectedRecords() {
        this.parent.setProperties({ selectedItems: [] }, true);
        let selectedRecords = this.gridSelectNodes();
        let selectSize = 0;
        while (selectSize < selectedRecords.length) {
            let record = selectedRecords[selectSize];
            this.parent.selectedItems.push(record.name);
            selectSize++;
        }
    }
    /**
     * Grid row de-selected event
     * @private
     */
    onDeSelection(args) {
        if (!this.isInteracted) {
            this.isInteracted = true;
            return;
        }
        if (this.parent.activeElements[0].querySelector('.' + ROWCELL)) {
            this.selectedRecords();
            this.parent.activeElements = this.gridObj.element.querySelectorAll('.' + ACTIVE);
        }
        let data = args.data;
        for (let i = 0, len = data.length; i < len; i++) {
            let index = this.parent.selectedItems.indexOf(getValue('name', data[i]));
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
    }
    triggerSelect(action, args) {
        let eventArgs = { action: action, fileDetails: args.data };
        this.parent.trigger('fileSelect', eventArgs);
    }
    wireEvents() {
        this.wireClickEvent(true);
        this.keyboardModule = new KeyboardEvents(this.gridObj.element, {
            keyAction: this.keyDown.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keyup',
        });
        EventHandler.add(this.gridObj.element, 'focus', this.removeSelection, this);
    }
    unWireEvents() {
        this.wireClickEvent(false);
        this.keyboardModule.destroy();
        EventHandler.remove(this.gridObj.element, 'focus', this.removeSelection);
    }
    wireClickEvent(toBind) {
        if (toBind) {
            let proxy = this;
            let ele = this.gridObj.getContent();
            this.clickObj = new Touch(ele, {
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
    }
    /**
     * Grid keyDown event
     * @private
     */
    /* istanbul ignore next */
    keyDown(e) {
        if (!this.isRendered) {
            return;
        }
        e.preventDefault();
        let action = e.action;
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
                let rowData = this.gridObj.getRowsObject()[this.gridObj.selectedRowIndex].data;
                if (rowData) {
                    let data = JSON.parse(JSON.stringify(rowData));
                    this.openContent(data);
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
                let data = [this.gridObj.getSelectedRecords()[0]];
                this.parent.currentItemText = getValue('name', data[0]);
                break;
            case 'tab':
                let selectedItems = getSortedData(this.parent, this.gridObj.dataSource);
                this.parent.selectedItems = [getValue('name', selectedItems[0])];
                this.selectRecords([getValue('name', selectedItems[0])]);
                break;
        }
    }
    /**
     * Get selected grid records
     * @public
     */
    gridSelectNodes() {
        return this.gridObj.getSelectedRecords();
    }
    updateRenameData() {
        let data = this.gridSelectNodes()[0];
        this.parent.itemData = [data];
        this.parent.currentItemText = getValue('name', data);
        this.parent.isFile = getValue('isFile', data);
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

export { AjaxSettings, toolbarItems, ToolbarSettings, SearchSettings, columnArray, DetailsViewSettings, fileItems, folderItems, layoutItems, ContextMenuSettings, NavigationPaneSettings, UploadSettings, TOOLBAR_ID, LAYOUT_ID, TREE_ID, GRID_ID, LARGEICON_ID, DIALOG_ID, ALT_DIALOG_ID, IMG_DIALOG_ID, EXTN_DIALOG_ID, UPLOAD_DIALOG_ID, CONTEXT_MENU_ID, SORTBY_ID, VIEW_ID, SPLITTER_ID, CONTENT_ID, BREADCRUMBBAR_ID, UPLOAD_ID, SEARCH_ID, ROOT, CONTROL, CHECK_SELECT, ROOT_POPUP, MOBILE, MULTI_SELECT, FILTER, LAYOUT, LAYOUT_CONTENT, LARGE_ICONS, TB_ITEM, LIST_ITEM, LIST_TEXT, LIST_PARENT, TB_OPTION_TICK, TB_OPTION_DOT, BLUR, ACTIVE, HOVER, FOCUS, CHECK, FRAME, CB_WRAP, ROW, ROWCELL, EMPTY, EMPTY_CONTENT, EMPTY_INNER_CONTENT, FOLDER, ICON_IMAGE, ICON_MUSIC, ICON_VIDEO, LARGE_ICON, LARGE_EMPTY_FOLDER, LARGE_EMPTY_FOLDER_TWO, LARGE_ICON_FOLDER, SELECTED_ITEMS, TEXT_CONTENT, GRID_HEADER, TEMPLATE_CELL, TREE_VIEW, MENU_ITEM, MENU_ICON, SUBMENU_ICON, GRID_VIEW, ICON_VIEW, ICON_OPEN, ICON_UPLOAD, ICON_CUT, ICON_COPY, ICON_PASTE, ICON_DELETE, ICON_RENAME, ICON_NEWFOLDER, ICON_DETAILS, ICON_SHORTBY, ICON_REFRESH, ICON_SELECTALL, ICON_DOWNLOAD, ICON_OPTIONS, ICON_GRID, ICON_LARGE, ICON_BREADCRUMB, ICON_CLEAR, ICONS, DETAILS_LABEL, ERROR_CONTENT, STATUS, BREADCRUMBS, RTL, DISPLAY_NONE, COLLAPSED, FULLROW, ICON_COLLAPSIBLE, SPLIT_BAR, HEADER_CHECK, OVERLAY, VALUE, isFile, modelChanged, initialEnd, finalizeEnd, createEnd, deleteEnd, refreshEnd, resizeEnd, splitterResize, pathChanged, destroy, beforeRequest, upload, afterRequest, download, uiRefresh, search, openInit, openEnd, selectionChanged, selectAllInit, clearAllInit, clearPathInit, layoutChange, sortByChange, nodeExpand, renameInit, renameEnd, showPaste, hidePaste, hideLayout, updateTreeSelection, treeSelect, sortColumn, pathColumn, searchTextChange, downloadInit, FileManager, Toolbar$1 as Toolbar, BreadCrumbBar, NavigationPane, DetailsView, LargeIconsView, createDialog, createImageDialog, ContextMenu$2 as ContextMenu };
//# sourceMappingURL=ej2-filemanager.es2015.js.map
