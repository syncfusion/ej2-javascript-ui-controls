import { IFileManager, ITreeView, ReadArgs, SortOrder } from '../base/interface';
import * as CLS from '../base/classes';
import * as events from '../base/constant';
import { read } from '../common/operations';
import { getValue, setValue, isNullOrUndefined as isNOU, matches, select, createElement } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';

/**
 * Utility file for common actions
 */

//Gets the path for tree nodes
/* istanbul ignore next */
export function copyPath(file: IFileManager): void {
    let path: string = file.path.substr(0, file.path.length - 1);
    file.targetPath = path.substr(0, path.lastIndexOf('/') + 1);
}

export function updatePath(node: HTMLLIElement, text: string, instance: IFileManager): void {
    instance.setProperties({ path: getPath(node, text) }, true);
    instance.pathId = getPathId(node);
}

export function getPath(element: Element | Node, text: string): string {
    let matched: string[] = getParents(<Element>element, text, false);
    let path: string = '/';
    for (let i: number = matched.length - 2; i >= 0; i--) {
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

export function getParents(element: Element, text: string, isId: boolean): string[] {
    let matched: string[] = [text];
    let el: Element = <Element>element.parentNode;
    while (!isNOU(el)) {
        if (matches(el, '.' + CLS.LIST_ITEM)) {
            let parentText: string = isId ? el.getAttribute('data-uid') : select('.' + CLS.LIST_TEXT, el).textContent;
            matched.push(parentText);
        }
        el = <Element>el.parentNode;
    }
    return matched;
}

//Stores tree nodes while performing cut, copy and paste operation
export function treeNodes(tree: ITreeView, gridFiles?: Object[], action?: string): void {
    /* istanbul ignore next */
    if (gridFiles) {
        let i: number = 0;
        for (i; i < gridFiles.length; i++) {
            let files: { [key: string]: Object } = <{ [key: string]: Object }>gridFiles[i];
            let id: string = <string>files.id;
            if (files.isFile === false) {
                (action === 'cut') ? tree.treeNodes.push(id) : tree.treeNodes = tree.treeNodes;
                (action === 'copy') ?
                    tree.copyNodes.push({ ['name']: files.name }) : tree.copyNodes = tree.copyNodes;
                (action === 'Delete') ? tree.removeNodes.push(id) : tree.removeNodes = tree.removeNodes;
            }
        }
    } else {
        tree.treeNodes = (action === 'cut') ? tree.treeObj.selectedNodes : tree.treeNodes;
        tree.removeNodes = (action === 'Delete') ? tree.treeObj.selectedNodes : tree.removeNodes;
    }
}

// Selects active element in File Manager
/* istanbul ignore next */
export function activeElement(action: string, isGrid?: boolean, file?: IFileManager): Object[] {
    let nodeNames: Object[] = [];
    removeBlur(file as IFileManager);
    let blurEle: NodeListOf<Element> = file.activeElements;
    file.targetPath = file.path;
    let i: number = 0;
    let isFile: boolean;
    let id: string;
    if (blurEle) {
        getModule(blurEle[0], file as IFileManager);
        while (i < blurEle.length) {
            if (action === 'cut') {
                addBlur(blurEle[i]);
            }
            isFile = (file.activeModule === 'largeiconsview') ?
                ((blurEle[i].querySelector('.' + CLS.LARGE_ICON_FOLDER)) ? false : true) : null;
            id = (isFile === false) ? blurEle[i].closest('li').getAttribute('data-uid') : null;
            (blurEle[i].querySelector('.' + CLS.LIST_TEXT)) ?
                nodeNames.push({ 'name': blurEle[i].querySelector('.' + CLS.LIST_TEXT).textContent, 'isFile': isFile, 'id': id }) :
                nodeNames = nodeNames;
            i++;
        }
        if (file.activeModule === 'detailsview' && isGrid !== false) {
            nodeNames = file.detailsviewModule.gridSelectNodes();
            if ((action === 'cut' || action === 'copy' || action === 'Delete') && file.navigationpaneModule) {
                treeNodes(file.navigationpaneModule, nodeNames, action);
            }
        } else if (file.activeModule === 'largeiconsview' && file.navigationpaneModule) {
            (action === 'cut' || action === 'copy' || action === 'Delete') ?
                treeNodes(file.navigationpaneModule, nodeNames, action) : nodeNames = nodeNames;
        } else {
            ((action === 'cut' || action === 'copy' || action === 'Delete') && file.navigationpaneModule) ?
                treeNodes(file.navigationpaneModule, null, action) : nodeNames = nodeNames;
            if (file.activeModule === 'navigationpane') {
                copyPath(file as IFileManager);
            }
        }
    }
    return nodeNames;
}


export function addBlur(nodes: Element): void {
    nodes.classList.add(CLS.BLUR);
}
// Removes blur from elements
export function removeBlur(file?: IFileManager, hover?: string): void {
    let blurEle: NodeListOf<Element> = (!hover) ? file.element.querySelectorAll('.' + CLS.BLUR) :
        file.element.querySelectorAll('.' + CLS.HOVER);
    let i: number = 0;
    while (i < blurEle.length) {
        (!hover) ? blurEle[i].classList.remove(CLS.BLUR) : blurEle[i].classList.remove(CLS.HOVER);
        i++;
    }
}

// Gets module name
/* istanbul ignore next */
export function getModule(element: Element, file?: IFileManager): void {
    if (element) {
        if (element.classList.contains(CLS.ROWCELL)) {
            file.activeModule = 'detailsview';
        } else if (element.closest('.' + CLS.LARGE_ICON)) {
            file.activeModule = 'largeiconsview';
        } else {
            file.activeModule = 'navigationpane';
        }
    }
}

export function refresh(parent: IFileManager): void {
    parent.itemData = [getPathObject(parent)];
    read(parent, events.refreshEnd, parent.path);
}

export function openAction(parent: IFileManager): void {
    read(parent, events.openEnd, parent.path);
}

export function getFileObject(parent: IFileManager): Object {
    let currFiles: Object[] = getValue(parent.path, parent.feFiles);
    if (currFiles) {
        let item: string = parent.selectedItems[parent.selectedItems.length - 1];
        for (let i: number = 0, len: number = currFiles.length; i < len; i++) {
            if (item === getValue('name', currFiles[i])) {
                return currFiles[i];
            }
        }
    }
    return getValue(parent.path, parent.feParent);
}

export function getPathObject(parent: IFileManager): Object {
    return getValue(parent.path, parent.feParent);
}

// Copy files
export function copyFiles(parent: IFileManager): void {
    parent.cutNodes = [];
    parent.navigationpaneModule.treeNodes = [];
    parent.navigationpaneModule.copyNodes = [];
    parent.nodeNames = [];
    parent.selectedNodes = [];
    parent.nodeNames = activeElement('copy', null, parent as IFileManager);
    if (parent.nodeNames) {
        parent.fileAction = 'CopyTo';
        parent.enablePaste = true;
        parent.notify(events.showPaste, {});
    }
}

// Cut files
export function cutFiles(parent: IFileManager): void {
    parent.navigationpaneModule.treeNodes = [];
    parent.navigationpaneModule.copyNodes = [];
    parent.nodeNames = [];
    parent.selectedNodes = [];
    parent.nodeNames = activeElement('cut', null, parent as IFileManager);
    if (parent.nodeNames) {
        parent.cutNodes = parent.nodeNames;
        parent.fileAction = 'MoveTo';
        parent.enablePaste = true;
        parent.notify(events.showPaste, {});
    }
}
// To add class for fileType
export function fileType(file: Object): string {
    let isFile: string = getValue('isFile', file);
    if (!isFile) {
        return 'e-fe-folder';
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

export function getImageUrl(parent: IFileManager, item: Object, ): string {
    let baseUrl: string = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
    let imgUrl: string;
    if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
        imgUrl = baseUrl + '?path=' + parent.path + getValue('filterPath', item);
    } else {
        imgUrl = baseUrl + '?path=' + parent.path + getValue('name', item);
    }

    return imgUrl;
}

export function getSortedData(parent: IFileManager, items: Object[]): Object[] {
    if (items.length === 0) { return items; }
    let query: Query = new Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
    let lists: Object[] = new DataManager(items).executeLocal(query);
    return getValue('records', lists);
}

export function getItemObject(parent: IFileManager, item: Element): Object {
    let name: string = select('.' + CLS.LIST_TEXT, item).textContent;
    let currFiles: Object[] = getValue(parent.path, parent.feFiles);
    let query: Query = new Query().where('name', 'equal', name);
    let lists: Object[] = new DataManager(currFiles).executeLocal(query);
    return lists[0];
}

export function createEmptyElement(parent: IFileManager, operation: string, element: HTMLElement): void {
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
        if (operation === 'search') {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
        } else {
            element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
            element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
        }
    }
}

export function getDirectories(files: Object[]): Object[] {
    return new DataManager(files).executeLocal(new Query().where(events.isFile, 'equal', false, false));
}

export function setNodeId(result: ReadArgs, rootId: string): void {
    setValue('nodeId', rootId, result.cwd);
    let dirs: Object[] = getDirectories(result.files);
    for (let i: number = 0, len: number = dirs.length; i < len; i++) {
        setValue('nodeId', rootId + '_' + i, dirs[i]);
    }
}

export function setDateObject(args: Object[]): void {
    for (let i: number = 0; i < args.length; i++) {
        setValue('dateCreated', new Date(getValue('dateCreated', args[i])), args[i]);
        setValue('dateModified', new Date(getValue('dateModified', args[i])), args[i]);
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
    if (parent.view === 'Details') {
        if (parent.isMobile) {
            read(parent, events.layoutChange, parent.path);
        } else {
            parent.notify(events.sortColumn, { module: 'gridview' });
        }
    }
    if (parent.view === 'LargeIcons') {
        read(parent, events.layoutChange, parent.path);
    }
    parent.notify(events.sortByChange, {});
}

export function getSortField(id: string): string {
    let text: string = id.substring(id.lastIndexOf('_') + 1);
    let field: string = text;
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