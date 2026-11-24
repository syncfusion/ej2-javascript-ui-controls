/**
 * Pure helpers that build the nested Field List folder tree (PIVOT-FOLDER). No DOM access.
 */

/** @hidden */
export const FOLDER_DELIMITER: string = '/';
const FOLDER_ID_PREFIX: string = 'e-pivot-folder::';

/** @hidden */
export interface IFolderField {
    id: string;
    pid?: string;
    caption: string;
    isSelected?: boolean;
}

/** @hidden */
export type FolderState = 'none' | 'some' | 'all';

/** @hidden */
export interface IFolderTree {
    data: { [key: string]: Object }[];
    /** Descendant field ids per folder id. */
    folderFields: { [folderId: string]: string[] };
    /** Invalid paths as [fieldId, path]. */
    invalid: string[][];
}

/**
 * Splits a folder path. Returns undefined for an invalid path (empty segment other than one trailing delimiter).
 *
 * @param {string} path - Delimited folder path.
 * @returns {string[]} Folder names, or undefined when invalid.
 * @hidden
 */
export function parseFolderPath(path: string): string[] {
    const parts: string[] = path.split(FOLDER_DELIMITER);
    if (parts.length > 1 && parts[parts.length - 1] === '') {
        parts.pop();
    }
    for (const part of parts) {
        if (part === '') {
            return undefined;
        }
    }
    return parts;
}

/**
 * Nested folders are active only when a relational folder path contains the delimiter.
 *
 * @param {IFolderField[]} fields - Catalogue fields.
 * @returns {boolean} Whether nested folder handling applies.
 * @hidden
 */
export function isNestedFolderMode(fields: IFolderField[]): boolean {
    for (const field of fields) {
        if (typeof field.pid === 'string' && field.pid.indexOf(FOLDER_DELIMITER) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Builds the tree data: folders created once per path, folders before fields, no recursion.
 *
 * @param {IFolderField[]} fields - Catalogue fields.
 * @param {string} sortOrder - 'Ascend', 'Descend' or other for declared order.
 * @returns {IFolderTree} Tree data.
 * @hidden
 */
export function buildFolderTree(fields: IFolderField[], sortOrder: string): IFolderTree {
    const used: { [id: string]: boolean } = {};
    for (const field of fields) {
        used[field.id] = true;
    }
    const folderIds: { [pathKey: string]: string } = {};
    const folderNodes: { [id: string]: { [key: string]: Object } } = {};
    const folderChildren: { [id: string]: string[] } = {};
    const fieldChildren: { [id: string]: IFolderField[] } = {};
    const rootFolders: string[] = [];
    const rootFields: IFolderField[] = [];
    const folderFields: { [folderId: string]: string[] } = {};
    const invalid: string[][] = [];
    const fieldParent: { [id: string]: string } = {};
    for (const field of fields) {
        const names: string[] = typeof field.pid === 'string' ? parseFolderPath(field.pid) : undefined;
        if (typeof field.pid === 'string' && !names) {
            invalid.push([field.id, field.pid]);
        }
        if (!names) {
            rootFields.push(field);
            continue;
        }
        let parentId: string;
        let key: string = '';
        const ancestors: string[] = [];
        for (const name of names) {
            key += encodeURIComponent(name) + FOLDER_DELIMITER;
            let folderId: string = folderIds[key as string];
            if (!folderId) {
                folderId = FOLDER_ID_PREFIX + key;
                while (used[folderId as string]) {
                    folderId += '~';
                }
                used[folderId as string] = true;
                folderIds[key as string] = folderId;
                folderNodes[folderId as string] = { id: folderId, pid: parentId, caption: name, hasChildren: true, isFolder: true };
                folderChildren[folderId as string] = [];
                fieldChildren[folderId as string] = [];
                folderFields[folderId as string] = [];
                (parentId ? folderChildren[parentId as string] : rootFolders).push(folderId);
            }
            ancestors.push(folderId);
            parentId = folderId;
        }
        fieldChildren[parentId as string].push(field);
        fieldParent[field.id] = parentId;
        for (const ancestor of ancestors) {
            folderFields[ancestor as string].push(field.id);
        }
    }
    const byCaption: (a: { caption: string }, b: { caption: string }) => number = (a: { caption: string }, b: { caption: string }) => {
        const result: number = a.caption > b.caption ? 1 : (b.caption > a.caption ? -1 : 0);
        return sortOrder === 'Descend' ? -result : result;
    };
    const sortIds: (ids: string[]) => string[] = (ids: string[]) => {
        if (sortOrder !== 'Ascend' && sortOrder !== 'Descend') {
            return ids;
        }
        return ids.slice().sort((a: string, b: string) => byCaption(
            { caption: folderNodes[a as string].caption as string }, { caption: folderNodes[b as string].caption as string }));
    };
    const sortFields: (items: IFolderField[]) => IFolderField[] = (items: IFolderField[]) =>
        sortOrder === 'Ascend' || sortOrder === 'Descend' ? items.slice().sort(byCaption) : items;
    const selected: { [id: string]: boolean } = {};
    for (const field of fields) {
        selected[field.id] = !!field.isSelected;
    }
    const data: { [key: string]: Object }[] = [];
    const stack: (string | IFolderField)[] = [];
    const pushChildren: (folders: string[], items: IFolderField[]) => void = (folders: string[], items: IFolderField[]) => {
        const ordered: (string | IFolderField)[] = (sortIds(folders) as (string | IFolderField)[]).concat(sortFields(items));
        for (let i: number = ordered.length - 1; i >= 0; i--) {
            stack.push(ordered[i as number]);
        }
    };
    pushChildren(rootFolders, rootFields);
    while (stack.length > 0) {
        const entry: string | IFolderField = stack.pop();
        if (typeof entry === 'string') {
            const node: { [key: string]: Object } = folderNodes[entry as string];
            const ids: string[] = folderFields[entry as string];
            let count: number = 0;
            for (const id of ids) {
                if (selected[id as string]) {
                    count++;
                }
            }
            node.folderState = count === 0 ? 'none' : (count === ids.length ? 'all' : 'some');
            data.push(node);
            pushChildren(folderChildren[entry as string], fieldChildren[entry as string]);
        } else {
            data.push({ id: entry.id, pid: fieldParent[entry.id], caption: entry.caption, isSelected: entry.isSelected });
        }
    }
    return { data: data, folderFields: folderFields, invalid: invalid };
}

/**
 * Filters tree data for search (PIVOT-FOLDER-007).
 *
 * @param {IFolderTree} tree - Unfiltered tree.
 * @param {string} term - Search text (case-insensitive).
 * @returns {Object} Filtered data and ids of folders to expand.
 * @hidden
 */
export function filterFolderTree(tree: IFolderTree, term: string): { data: { [key: string]: Object }[]; expanded: string[] } {
    const needle: string = term.toLowerCase();
    const parentOf: { [id: string]: string } = {};
    for (const node of tree.data) {
        parentOf[node.id as string] = node.pid as string;
    }
    const keep: { [id: string]: boolean } = {};
    const expanded: { [id: string]: boolean } = {};
    const keepChain: (id: string) => void = (id: string) => {
        let parent: string = parentOf[id as string];
        while (parent && !expanded[parent as string]) {
            keep[parent as string] = true;
            expanded[parent as string] = true;
            parent = parentOf[parent as string];
        }
    };
    const matchedFolders: { [id: string]: boolean } = {};
    for (const node of tree.data) {
        if ((node.caption as string).toLowerCase().indexOf(needle) > -1) {
            keep[node.id as string] = true;
            if (node.isFolder) {
                matchedFolders[node.id as string] = true;
                expanded[node.id as string] = true;
            }
            keepChain(node.id as string);
        }
    }
    // Data is pre-order, so a descendant follows its ancestor: propagate folder matches downward.
    const underMatch: { [id: string]: boolean } = {};
    for (const node of tree.data) {
        const parent: string = node.pid as string;
        if (parent && (matchedFolders[parent as string] || underMatch[parent as string])) {
            underMatch[node.id as string] = true;
            keep[node.id as string] = true;
            if (node.isFolder) {
                expanded[node.id as string] = true;
            }
        }
    }
    return {
        data: tree.data.filter((node: { [key: string]: Object }) => keep[node.id as string]),
        expanded: Object.keys(expanded)
    };
}
