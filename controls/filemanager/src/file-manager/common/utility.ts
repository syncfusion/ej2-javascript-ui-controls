import { IFileManager, ReadArgs, SortOrder, SearchArgs, FileDragEventArgs } from '../base/interface';
import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { read, paste, Search, filter, Download, Delete } from '../common/operations';
import { getValue, setValue, isNullOrUndefined as isNOU, matches, select, createElement } from '@syncfusion/ej2-base';
import { closest, DragEventArgs, detach, BlazorDragEventArgs, isBlazor } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { createDialog } from '../pop-up/dialog';

/**
 * Utility file for common actions
 * @private
 */

export function updatePath(node: HTMLLIElement, data: Object, instance: IFileManager): void {
    let text: string = getValue('name', data);
    let id: string = node.getAttribute('data-id');
    let newText: string = isNOU(id) ? text : id;
    instance.setProperties({ path: getPath(node, newText, instance.hasId) }, true);
    instance.pathId = getPathId(node);
    instance.pathNames = getPathNames(node, text);
}

export function getPath(element: Element | Node, text: string, hasId: boolean): string {
    let matched: string[] = getParents(<Element>element, text, false, hasId);
    let path: string = hasId ? '' : '/';
    let len: number = matched.length - (hasId ? 1 : 2);
    for (let i: number = len; i >= 0; i--) {
        path += matched[i] + '/';
    }
    return path;
}

export function getPathId(node: Element): string[] {
    let matched: string[] = getParents(node, node.getAttribute('data-uid'), true);
    let ids: string[] = [];
    for (let i: number = matched.length - 1; i >= 0; i--) {
        ids.push(matched[i]);
    }
    return ids;
}

export function getPathNames(element: Element, text: string): string[] {
    let matched: string[] = getParents(element, text, false);
    let names: string[] = [];
    for (let i: number = matched.length - 1; i >= 0; i--) {
        names.push(matched[i]);
    }
    return names;
}

export function getParents(element: Element, text: string, isId: boolean, hasId?: boolean): string[] {
    let matched: string[] = [text];
    let el: Element = <Element>element.parentNode;
    while (!isNOU(el)) {
        if (matches(el, '.' + CLS.LIST_ITEM)) {
            let parentText: string = isId ? el.getAttribute('data-uid') : (hasId ? el.getAttribute('data-id') :
                select('.' + CLS.LIST_TEXT, el).textContent);
            matched.push(parentText);
        }
        el = <Element>el.parentNode;
        if (el.classList.contains(CLS.TREE_VIEW)) {
            break;
        }
    }
    return matched;
}

export function generatePath(parent: IFileManager): void {
    let key: string = parent.hasId ? 'id' : 'name';
    let newPath: string = parent.hasId ? '' : '/';
    let i: number = parent.hasId ? 0 : 1;
    for (i; i < parent.pathId.length; i++) {
        let data: Object = getValue(parent.pathId[i], parent.feParent);
        newPath += getValue(key, data) + '/';
    }
    parent.setProperties({ path: newPath }, true);
}

export function removeActive(parent: IFileManager): void {
    if (parent.isCut) {
        removeBlur(parent);
        parent.selectedNodes = [];
        parent.actionRecords = [];
        parent.enablePaste = false;
        parent.notify(events.hidePaste, {});
    }
}

// Selects active element in File Manager
export function activeElement(action: string, parent: IFileManager): boolean {
    parent.isSearchCut = false;
    parent.actionRecords = [];
    parent.activeElements = [];
    parent.notify(events.cutCopyInit, {});
    if (parent.activeElements.length === 0) { return false; }
    removeBlur(parent);
    let blurEle: Element[] = parent.activeElements;
    if (parent.activeModule !== 'navigationpane') {
        parent.targetPath = parent.path;
    } else {
        parent.targetPath = getParentPath(parent.path);
    }
    let i: number = 0;
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
    parent.notify(events.showPaste, {});
    while (i < parent.activeRecords.length) {
        parent.actionRecords.push(parent.activeRecords[i]);
        parent.selectedNodes.push(getValue('name', parent.activeRecords[i]));
        i++;
    }
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) &&
        parent.activeModule !== 'navigationpane') {
        parent.selectedNodes = [];
        parent.isSearchCut = true;
        let i: number = 0;
        while (i < parent.selectedItems.length) {
            parent.selectedNodes.push(parent.selectedItems[i]);
            i++;
        }
    }
    return true;
}

export function addBlur(nodes: Element): void {
    nodes.classList.add(CLS.BLUR);
}
// Removes blur from elements
export function removeBlur(parent?: IFileManager, hover?: string): void {
    let blurEle: NodeListOf<Element> = (!hover) ? parent.element.querySelectorAll('.' + CLS.BLUR) :
        parent.element.querySelectorAll('.' + CLS.HOVER);
    let i: number = 0;
    while (i < blurEle.length) {
        (!hover) ? blurEle[i].classList.remove(CLS.BLUR) : blurEle[i].classList.remove(CLS.HOVER);
        i++;
    }
}

// Gets module name
export function getModule(parent: IFileManager, element: Element): void {
    if (element) {
        if (element.classList.contains(CLS.ROW)) {
            parent.activeModule = 'detailsview';
        } else if (closest(element, '.' + CLS.LARGE_ICON)) {
            parent.activeModule = 'largeiconsview';
        } else {
            parent.activeModule = 'navigationpane';
        }
    }
}

export function searchWordHandler(parent: IFileManager, value: string, isLayoutChange: boolean): void {
    let searchWord: string;
    if (value.length === 0 && !parent.isFiltered) {
        parent.notify(events.pathColumn, { args: parent });
    }
    if (parent.searchSettings.filterType === 'startsWith') {
        searchWord = value + '*';
    } else if (parent.searchSettings.filterType === 'endsWith') {
        searchWord = '*' + value;
    } else {
        searchWord = '*' + value + '*';
    }
    parent.searchWord = searchWord;
    parent.itemData = [getPathObject(parent)];
    if (value.length > 0) {
        let caseSensitive: boolean = parent.searchSettings.ignoreCase;
        let hiddenItems: boolean = parent.showHiddenItems;
        Search(parent, isLayoutChange ? events.layoutChange : events.search, parent.path, searchWord, hiddenItems, !caseSensitive);
    } else {
        if (!parent.isFiltered) {
            read(parent, isLayoutChange ? events.layoutChange : events.search, parent.path);
        } else {
            filter(parent, events.layoutChange);
        }
    }
}

export function updateLayout(parent: IFileManager, view: string): void {
    parent.setProperties({ view: view }, true);
    if (parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) {
        parent.layoutSelectedItems = parent.selectedItems;
    }
    let searchWord: string = '';
    if (parent.breadcrumbbarModule.searchObj.element.value) {
        searchWord = parent.breadcrumbbarModule.searchObj.element.value;
    }
    parent.isLayoutChange = true;
    searchWordHandler(parent, searchWord, true);
}

/* istanbul ignore next */
export function getTargetModule(parent: IFileManager, element: Element): void {
    let tartgetModule: string = '';
    if (element) {
        if (closest(element, '.e-gridcontent')) {
            tartgetModule = 'detailsview';
        } else if (closest(element, '.' + CLS.LARGE_ICONS)) {
            tartgetModule = 'largeiconsview';
        } else if (element.classList.contains('e-fullrow') ||
            element.classList.contains('e-icon-expandable')) {
            tartgetModule = 'navigationpane';
        } else if (closest(element, '.e-address-list-item')) {
            tartgetModule = 'breadcrumbbar';
        } else {
            tartgetModule = '';
        }
    }
    parent.targetModule = tartgetModule;
}
/* istanbul ignore next */
export function refresh(parent: IFileManager): void {
    parent.itemData = [getPathObject(parent)];
    if (!hasReadAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0]);
    } else {
        read(parent, events.refreshEnd, parent.path);
    }
}

export function openAction(parent: IFileManager): void {
    read(parent, events.openEnd, parent.path);
}

export function getPathObject(parent: IFileManager): Object {
    return getValue(parent.pathId[parent.pathId.length - 1], parent.feParent);
}

// Copy files
export function copyFiles(parent: IFileManager): void {
    if (!activeElement('copy', parent)) {
        return;
    } else {
        parent.fileAction = 'copy';
    }
}

// Cut files
export function cutFiles(parent: IFileManager): void {
    if (!activeElement('cut', parent)) {
        return;
    } else {
        parent.isCut = true;
        parent.fileAction = 'move';
    }
}
// To add class for fileType
export function fileType(file: Object): string {
    let isFile: string = getValue('isFile', file);
    if (!isFile) {
        return CLS.FOLDER;
    }
    let imageFormat: string[] = ['bmp', 'dib', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'png', 'ico'];
    let audioFormat: string[] = ['mp3', 'wav', 'aac', 'ogg', 'wma', 'aif', 'fla', 'm4a'];
    let videoFormat: string[] = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'wmv', 'mp4', '3gp'];
    let knownFormat: string[] = ['css', 'exe', 'html', 'js', 'msi', 'pdf', 'pptx', 'ppt', 'rar', 'zip', 'txt', 'docx', 'doc',
        'xlsx', 'xls', 'xml', 'rtf', 'php'];
    let filetype: string = getValue('type', file);
    filetype = filetype.toLowerCase();
    if (filetype.indexOf('.') !== -1) {
        filetype = filetype.split('.').join('');
    }
    let iconType: string;
    if (imageFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_IMAGE;
    } else if (audioFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_MUSIC;
    } else if (videoFormat.indexOf(filetype) !== -1) {
        iconType = CLS.ICON_VIDEO;
    } else if (knownFormat.indexOf(filetype) !== -1) {
        iconType = 'e-fe-' + filetype;
    } else {
        iconType = 'e-fe-unknown e-fe-' + filetype;
    }
    return iconType;
}
/* istanbul ignore next */
export function getImageUrl(parent: IFileManager, item: Object): string {
    let baseUrl: string = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    let imgUrl: string;
    let fileName: string = getValue('name', item);
    let fPath: string = getValue('filterPath', item);
    if (parent.hasId) {
        let imgId: string = getValue('id', item);
        imgUrl = baseUrl + '?path=' + parent.path + '&id=' + imgId;
    } else if (!isNOU(fPath)) {
        imgUrl = baseUrl + '?path=' + fPath.replace(/\\/g, '/') + fileName;
    } else {
        imgUrl = baseUrl + '?path=' + parent.path + fileName;
    }
    imgUrl = imgUrl + '&time=' + (new Date().getTime()).toString();
    return imgUrl;
}

export function getFullPath(parent: IFileManager, data: Object, path: string): string {
    let filePath: string = getValue(parent.hasId ? 'id' : 'name', data) + '/';
    let fPath: string = getValue(parent.hasId ? 'filterId' : 'filterPath', data);
    if (!isNOU(fPath)) {
        return fPath.replace(/\\/g, '/') + filePath;
    } else {
        return path + filePath;
    }
}

export function getFullName(item: Object): string {
    let fullName: string;
    let fileName: string = getValue('name', item);
    fullName = getValue('filterPath', item).replace(/\\/g, '/') + fileName;
    return fullName;
}

export function getName(parent: IFileManager, data: Object): string {
    let name: string = getValue('name', data);
    let fPath: string = getValue('filterPath', data);
    if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) && !isNOU(fPath)) {
        fPath = fPath.replace(/\\/g, '/');
        name = fPath.replace(parent.path, '') + name;
    }
    return name;
}

export function getSortedData(parent: IFileManager, items: Object[]): Object[] {
    if (items.length === 0) { return items; }
    let query: Query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    let lists: Object[] = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}

export function getObject(parent: IFileManager, key: string, value: string): Object {
    let currFiles: Object[] = getValue(parent.pathId[parent.pathId.length - 1], parent.feFiles);
    let query: Query = new Query().where(key, 'equal', value);
    let lists: Object[] = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}

export function createEmptyElement(parent: IFileManager, element: HTMLElement, args: ReadArgs | SearchArgs): void {
    let top: number;
    let layoutElement: Element = select('#' + parent.element.id + CLS.LAYOUT_ID, parent.element);
    let addressBarHeight: number = (<HTMLElement>select('#' + parent.element.id + CLS.BREADCRUMBBAR_ID, layoutElement)).offsetHeight;
    top = (<HTMLElement>layoutElement).offsetHeight - addressBarHeight;
    if (parent.view === 'Details') {
        top = top - (<HTMLElement>select('.' + CLS.GRID_HEADER, layoutElement)).offsetHeight;
    }
    if (isNOU(element.querySelector('.' + CLS.EMPTY))) {
        let emptyDiv: Element = createElement('div', { className: CLS.EMPTY });
        let emptyFolder: Element = createElement('div', { className: CLS.LARGE_EMPTY_FOLDER });
        let emptyEle: Element = createElement('div', { className: CLS.EMPTY_CONTENT });
        let dragFile: Element = createElement('div', { className: CLS.EMPTY_INNER_CONTENT });
        if (parent.view === 'Details') {
            element.querySelector('.' + CLS.GRID_VIEW).appendChild(emptyDiv);
        } else {
            element.appendChild(emptyDiv);
        }
        emptyDiv.appendChild(emptyFolder);
        emptyDiv.appendChild(emptyEle);
        emptyDiv.appendChild(dragFile);
    }
    if (element.querySelector('.' + CLS.EMPTY)) {
        if (!isNOU(args.error)) {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Access-Denied');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Access-Details');
        } else if (parent.isFiltered) {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Key');
        } else if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
        } else {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
        }
    }
    let eDiv: HTMLElement = <HTMLElement>select('.' + CLS.EMPTY, element);
    top = (top - eDiv.offsetHeight) / 2;
    eDiv.style.marginTop = top + 'px';
}

export function getDirectories(files: Object[]): Object[] {
    return new DataManager(files).executeLocal(new Query().where(events.isFile, 'equal', false, false));
}

export function setNodeId(result: ReadArgs, rootId: string): void {
    let dirs: Object[] = getDirectories(result.files);
    for (let i: number = 0, len: number = dirs.length; i < len; i++) {
        setValue('_fm_id', rootId + '_' + i, dirs[i]);
    }
}

export function setDateObject(args: Object[]): void {
    for (let i: number = 0; i < args.length; i++) {
        setValue('_fm_created', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('_fm_modified', new Date(getValue('dateModified', args[i])), args[i]);
    }
}


export function getLocaleText(parent: IFileManager, text: string): string {
    let locale: string = parent.localeObj.getConstant(text);
    return (locale === '') ? text : locale;
}

export function getCssClass(parent: IFileManager, css: string): string {
    let cssClass: string = parent.cssClass;
    cssClass = (isNOU(cssClass) || cssClass === '') ? css : (cssClass + ' ' + css);
    return cssClass;
}

export function sortbyClickHandler(parent: IFileManager, args: MenuEventArgs): void {
    let tick: boolean;
    if (args.item.id.indexOf('ascending') !== -1 || args.item.id.indexOf('descending') !== -1) {
        tick = true;
    } else {
        tick = false;
    }
    if (!tick) {
        parent.sortBy = getSortField(args.item.id);
    } else {
        parent.sortOrder = <SortOrder>getSortField(args.item.id);
    }
    parent.itemData = [getPathObject(parent)];
    if (parent.view === 'Details') {
        if (parent.isMobile) {
            updateLayout(parent, 'Details');
        } else {
            parent.notify(events.sortColumn, { module: 'detailsview' });
        }
    }
    if (parent.view === 'LargeIcons') {
        updateLayout(parent, 'LargeIcons');
    }
    parent.notify(events.sortByChange, {});
}

export function getSortField(id: string): string {
    let text: string = id.substring(id.lastIndexOf('_') + 1);
    let field: string = text;
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
    }
    return field;
}

export function setNextPath(parent: IFileManager, path: string): void {
    let currfolders: string[] = path.split('/');
    let folders: string[] = parent.originalPath.split('/');
    let root: Object = getValue(parent.pathId[0], parent.feParent);
    let key: string = isNOU(getValue('id', root)) ? 'name' : 'id';
    for (let i: number = currfolders.length - 1, len: number = folders.length - 1; i < len; i++) {
        let eventName: string = (folders[i + 1] === '') ? events.finalizeEnd : events.initialEnd;
        let newPath: string = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
        let data: Object = getObject(parent, key, folders[i]);
        let id: string = getValue('_fm_id', data);
        parent.setProperties({ path: newPath }, true);
        parent.pathId.push(id);
        parent.itemData = [data];
        parent.pathNames.push(getValue('name', data));
        read(parent, eventName, parent.path);
        break;
    }
}

export function openSearchFolder(parent: IFileManager, data: Object): void {
    parent.notify(events.clearPathInit, { selectedNode: parent.pathId[parent.pathId.length - 1] });
    parent.originalPath = getFullPath(parent, data, parent.path);
    read(parent, (parent.path !== parent.originalPath) ? events.initialEnd : events.finalizeEnd, parent.path);
}

export function pasteHandler(parent: IFileManager): void {
    parent.isDragDrop = false;
    if (parent.selectedNodes.length !== 0 && parent.enablePaste) {
        let path: string = (parent.folderPath === '') ? parent.path : parent.folderPath;
        let subFolder: boolean = validateSubFolder(parent, <{ [key: string]: Object; }[]>parent.actionRecords, path, parent.path);
        if (!subFolder) {
            if ((parent.fileAction === 'move' && parent.targetPath !== path) || parent.fileAction === 'copy') {
                parent.notify(events.pasteInit, {});
                paste(
                    parent, parent.targetPath, parent.selectedNodes, path, parent.fileAction, [], parent.actionRecords);
            } else {
                parent.enablePaste = false;
                parent.notify(events.hidePaste, {});
                removeBlur(parent);
            }
        }
    }
}
export function validateSubFolder(parent: IFileManager, data: { [key: string]: Object; }[], dropPath: string, dragPath: string): boolean {
    let subFolder: boolean = false;
    for (let i: number = 0; i < data.length; i++) {
        if (!getValue('isFile', data[i])) {
            let tempTarget: string = getFullPath(parent, data[i], dragPath);
            if (dropPath.indexOf(tempTarget) !== -1) {
                let result: ReadArgs = {
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
export function dropHandler(parent: IFileManager): void {
    parent.isDragDrop = true;
    if (parent.dragData.length !== 0) {
        parent.dragPath = parent.dragPath.replace(/\\/g, '/');
        parent.dropPath = parent.dropPath.replace(/\\/g, '/');
        let subFolder: boolean = validateSubFolder(parent, parent.dragData, parent.dropPath, parent.dragPath);
        if (!subFolder && (parent.dragPath !== parent.dropPath)) {
            parent.itemData = [parent.dropData];
            paste(
                parent, parent.dragPath, parent.dragNodes, parent.dropPath, 'move', [], parent.dragData);
            parent.notify(events.pasteInit, {});
        }
    }
}

export function getParentPath(oldPath: string): string {
    let path: string[] = oldPath.split('/');
    let newPath: string = path[0] + '/';
    for (let i: number = 1; i < path.length - 2; i++) {
        newPath += path[i] + '/';
    }
    return newPath;
}

export function getDirectoryPath(parent: IFileManager, args: ReadArgs): string {
    let filePath: string = getValue(parent.hasId ? 'id' : 'name', args.cwd) + '/';
    let fPath: string = getValue(parent.hasId ? 'filterId' : 'filterPath', args.cwd);
    if (!isNOU(fPath)) {
        if (fPath === '') {
            return parent.hasId ? filePath : '/';
        }
        return fPath.replace(/\\/g, '/') + filePath;
    } else {
        return parent.path + filePath;
    }
}

export function doPasteUpdate(parent: IFileManager, operation: string, result: ReadArgs): void {
    if (operation === 'move') {
        if (!parent.isDragDrop) {
            parent.enablePaste = false;
            parent.notify(events.hidePaste, {});
            parent.notify(events.cutEnd, result);
        } else {
            parent.notify(events.dragEnd, result);
        }
    }
    if (parent.duplicateItems.length === 0) {
        parent.pasteNodes = [];
    }
    let flag: boolean = false;
    for (let count: number = 0; (count < result.files.length) && !flag; count++) {
        parent.pasteNodes.push(<string>result.files[count][parent.hasId ? 'id' : 'name']);
        if (parent.isDragDrop) {
            parent.droppedObjects.push(result.files[count]);
        }
    }
    parent.duplicateItems = [];
    parent.duplicateRecords = [];
    if (parent.isDragDrop && !parent.isPasteError) {
        parent.isDropEnd = true;
    } else {
        parent.isDropEnd = false;
    }
    if (!parent.isDragDrop || (parent.path === parent.dragPath) || (parent.path === parent.dropPath)
        || parent.isSearchDrag) {
        parent.isPathDrag = false;
        read(parent, events.pasteEnd, parent.path);
    } else {
        readDropPath(parent);
    }
    parent.trigger('success', { action: operation, result: result });
}
export function readDropPath(parent: IFileManager): void {
    let pathId: string = getValue('_fm_id', parent.dropData);
    parent.expandedId = pathId;
    parent.itemData = [parent.dropData];
    if (parent.isPathDrag) {
        parent.notify(events.pathDrag, parent.itemData);
    } else {
        if (parent.navigationpaneModule) {
            let node: Element = select('[data-uid="' + pathId + '"]', parent.navigationpaneModule.treeObj.element);
            updatePath(<HTMLLIElement>node, parent.dropData, parent);
        }
        read(parent, events.dropPath, parent.dropPath);
    }
}

export function getDuplicateData(parent: IFileManager, name: string): object {
    let data: object = null;
    let records: object[] = parent.isDragDrop ? parent.dragData : parent.actionRecords;
    for (let i: number = 0; i < records.length; i++) {
        if (getValue('name', records[i]) === name) {
            data = records[i];
            break;
        }
    }
    return data;
}

export function createVirtualDragElement(parent: IFileManager): void {
    parent.isSearchDrag = false;
    if (parent.breadcrumbbarModule.searchObj.element.value !== '') { parent.isSearchDrag = true; }
    if (parent.activeModule !== 'navigationpane') {
        parent.dragNodes = [];
        let i: number = 0;
        while (i < parent.selectedItems.length) {
            parent.dragNodes.push(parent.selectedItems[i]);
            i++;
        }
    }
    let cloneIcon: HTMLElement = parent.createElement('div', {
        className: 'e-fe-icon ' + fileType(parent.dragData[0])
    });
    let cloneName: HTMLElement = parent.createElement('div', {
        className: 'e-fe-name',
        innerHTML: <string>parent.dragData[0].name
    });
    let virtualEle: HTMLElement = parent.createElement('div', {
        className: 'e-fe-content'
    });
    virtualEle.appendChild(cloneIcon);
    virtualEle.appendChild(cloneName);
    let ele: HTMLElement = parent.createElement('div', {
        className: CLS.CLONE
    });
    ele.appendChild(virtualEle);
    if (parent.dragNodes.length > 1) {
        let badge: HTMLElement = parent.createElement('span', {
            className: 'e-fe-count',
            innerHTML: (parent.dragNodes.length).toString(10)
        });
        ele.appendChild(badge);
    }
    parent.virtualDragElement = ele;
    parent.element.appendChild(parent.virtualDragElement);
}

export function dragStopHandler(parent: IFileManager, args: DragEventArgs): void {
    let dragArgs: FileDragEventArgs = args;
    dragArgs.cancel = false;
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeDropTarget(parent);
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    removeBlur(parent);
    parent.uploadObj.dropArea = <HTMLElement>select('#' + parent.element.id + CLS.CONTENT_ID, parent.element);
    let virtualEle: Element = select('.' + CLS.CLONE, parent.element);
    if (virtualEle) { detach(virtualEle); }
    getTargetModule(parent, args.target);
    parent.notify(events.dropInit, args);
    removeBlur(parent, 'hover');
    dragArgs.fileDetails = parent.dragData;
    parent.trigger('fileDragStop', dragArgs, (dragArgs: FileDragEventArgs) => {
        if (!dragArgs.cancel && !isNOU(parent.targetModule) && parent.targetModule !== '') {
            dropHandler(parent);
        }
    });
}

export function dragStartHandler(parent: IFileManager, args: DragEventArgs & BlazorDragEventArgs): void {
    let dragArgs: FileDragEventArgs = args;
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
    } else {
        parent.isPathDrag = false;
    }
    removeBlur(parent);
    if (dragArgs.cancel) {
        dragCancel(parent);
    } else if (!dragArgs.cancel) {
        let i: number = 0;
        while (i < parent.activeElements.length) {
            addBlur(parent.activeElements[i]);
            i++;
        }
        parent.trigger('fileDragStart', dragArgs, (dragArgs: FileDragEventArgs & BlazorDragEventArgs) => {
            if (dragArgs.cancel) {
                dragCancel(parent);
            } else {
                parent.uploadObj.dropArea = null;
                if (isBlazor()) {
                    dragArgs.bindEvents(dragArgs.dragElement);
                }
            }
        });
    }
}
export function dragCancel(parent: IFileManager): void {
    removeBlur(parent);
    let virtualEle: Element = select('.' + CLS.CLONE, parent.element);
    if (virtualEle) { detach(virtualEle); }
}
export function removeDropTarget(parent: IFileManager): void {
    removeItemClass(parent, CLS.DROP_FOLDER);
    removeItemClass(parent, CLS.DROP_FILE);
}
export function removeItemClass(parent: IFileManager, value: string): void {
    let ele: NodeListOf<Element> = parent.element.querySelectorAll('.' + value);
    for (let i: number = 0; i < ele.length; i++) {
        ele[i].classList.remove(value);
    }
}
export function draggingHandler(parent: IFileManager, args: DragEventArgs): void {
    let dragArgs: FileDragEventArgs = args;
    dragArgs.fileDetails = parent.dragData;
    let canDrop: boolean = false;
    getTargetModule(parent, args.target);
    removeDropTarget(parent);
    if (parent.treeExpandTimer != null) {
        window.clearTimeout(parent.treeExpandTimer);
        parent.treeExpandTimer = null;
    }
    removeBlur(parent, 'hover');
    let node: Element = null;
    if (parent.targetModule === 'navigationpane') {
        node = closest(args.target, 'li');
        node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
        canDrop = true;
        /* istanbul ignore next */
        parent.treeExpandTimer = window.setTimeout(() => { parent.notify(events.dragging, args); }, 800);
    } else if (parent.targetModule === 'detailsview') {
        node = closest(args.target, 'tr');
        if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.DROP_FOLDER);
        } else if (node && !node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.DROP_FILE);
        }
        canDrop = true;
    } else if (parent.targetModule === 'largeiconsview') {
        node = closest(args.target, 'li');
        if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
            node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
        }
        canDrop = true;
        /* istanbul ignore next */
    } else if (parent.targetModule === 'breadcrumbbar') {
        canDrop = true;
    }
    parent.element.classList.remove('e-fe-drop', 'e-no-drop');
    parent.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
    parent.trigger('fileDragging', dragArgs);
}

export function objectToString(data: Object): string {
    let str: string = '';
    let keys: string[] = Object.keys(data);
    for (let i: number = 0; i < keys.length; i++) {
        str += (i === 0 ? '' : ', ') + keys[i] + ': ' + getValue(keys[i], data);
    }
    return str;
}

export function getItemName(parent: IFileManager, data: Object): string {
    if (parent.hasId) {
        return getValue('id', data);
    }
    return getName(parent, data);
}

export function updateRenamingData(parent: IFileManager, data: Object): void {
    parent.itemData = [data];
    parent.currentItemText = getValue('name', data);
    parent.isFile = getValue('isFile', data);
    parent.filterPath = getValue('filterPath', data);
}

export function doRename(parent: IFileManager): void {
    if (!hasEditAccess(parent.itemData[0])) {
        createDeniedDialog(parent, parent.itemData[0]);
    } else {
        createDialog(parent, 'Rename');
    }
}
/* istanbul ignore next */
export function doDownload(parent: IFileManager): void {
    let items: Object[] = parent.itemData;
    for (let i: number = 0; i < items.length; i++) {
        if (!hasDownloadAccess(items[i])) {
            createDeniedDialog(parent, items[i]);
            return;
        }
    }
    if (parent.selectedItems.length > 0) {
        Download(parent, parent.path, parent.selectedItems);
    }
}

export function doDeleteFiles(parent: IFileManager, data: Object[], newIds: string[]): void {
    for (let i: number = 0; i < data.length; i++) {
        if (!hasEditAccess(data[i])) {
            createDeniedDialog(parent, data[i]);
            return;
        }
    }
    parent.itemData = data;
    Delete(parent, newIds, parent.path, 'delete');
}
/* istanbul ignore next */
export function doDownloadFiles(parent: IFileManager, data: Object[], newIds: string[]): void {
    for (let i: number = 0; i < data.length; i++) {
        if (!hasDownloadAccess(data[i])) {
            createDeniedDialog(parent, data[i]);
            return;
        }
    }
    parent.itemData = data;
    if (newIds.length > 0) {
        Download(parent, parent.path, newIds);
    }
}

export function createDeniedDialog(parent: IFileManager, data: Object): void {
    let response: ReadArgs = {
        error: {
            code: '401',
            fileExists: null,
            message: '"' + getFullName(data) + '" is not accessible. Access is denied.'
        }
    };
    createDialog(parent, 'Error', response);
}

export function getAccessClass(data: Object): string {
    return !hasReadAccess(data) ? 'e-fe-locked e-fe-hidden' : 'e-fe-locked';
}

export function hasReadAccess(data: Object): boolean {
    let permission: Object = getValue('permission', data);
    return (permission && !getValue('read', permission)) ? false : true;
}

export function hasEditAccess(data: Object): boolean {
    let permission: Object = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('edit', permission)) ? true : false) : true;
}

export function hasContentAccess(data: Object): boolean {
    let permission: Object = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('editContents', permission)) ? true : false) : true;
}

export function hasUploadAccess(data: Object): boolean {
    let permission: Object = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('upload', permission)) ? true : false) : true;
}

export function hasDownloadAccess(data: Object): boolean {
    let permission: Object = getValue('permission', data);
    return permission ? ((getValue('read', permission) && getValue('download', permission)) ? true : false) : true;
}

export function createNewFolder(parent: IFileManager): void {
    let details: Object = parent.itemData[0];
    if (!hasContentAccess(details)) {
        createDeniedDialog(parent, details);
    } else {
        createDialog(parent, 'NewFolder');
    }
}

export function uploadItem(parent: IFileManager): void {
    let details: Object = parent.itemData[0];
    if (!hasUploadAccess(details)) {
        createDeniedDialog(parent, details);
    } else {
        let eleId: string = '#' + parent.element.id + CLS.UPLOAD_ID;
        let uploadEle: HTMLElement = <HTMLElement>select(eleId, parent.element);
        uploadEle.click();
    }
}