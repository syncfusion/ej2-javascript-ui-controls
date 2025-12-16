import { _PdfCrossReference } from './pdf-cross-reference';
import { _PdfDictionary, _PdfReferenceSet, _PdfReferenceSetCache, _PdfName, _PdfReference, _isName } from './pdf-primitives';
import { FormatError } from './utils';
export class _PdfCatalog {
    private _crossReference: _PdfCrossReference;
    _catalogDictionary: _PdfDictionary;
    pageIndexCache: _PdfReferenceSetCache;
    pageKidsCountCache: _PdfReferenceSetCache;
    _topPagesDictionary: _PdfDictionary;
    _parsedPages: number[] = [];
    _pageCache: Map<number, {
        dictionary: _PdfDictionary,
        reference: _PdfReference,
        parent: _PdfDictionary
    }> = new Map<number, {
        dictionary: _PdfDictionary,
        reference: _PdfReference,
        parent: _PdfDictionary
    }>();
    _hasInvalidPageTree: boolean;
    constructor(xref: _PdfCrossReference) {
        this._crossReference = xref;
        this._catalogDictionary = xref._getCatalogObj();
        if (!(this._catalogDictionary instanceof _PdfDictionary)) {
            throw new FormatError('Catalog object is not a dictionary.');
        } else {
            this._catalogDictionary.isCatalog = true;
        }
        this._topPagesDictionary = this._catalogDictionary.get('Pages');
        this.pageKidsCountCache = new _PdfReferenceSetCache();
        this.pageIndexCache = new _PdfReferenceSetCache();
    }
    get version(): string {
        let value: string;
        if (this._catalogDictionary.has('Version')) {
            const version: _PdfName = this._catalogDictionary.get('Version');
            if (version) {
                value = version.name;
            }
        }
        return value;
    }
    get pageCount(): number {
        const obj: number = this._topPagesDictionary.get('Count');
        if (typeof obj === 'undefined' || !Number.isInteger(obj)) {
            throw new FormatError('Invalid page count');
        }
        return obj;
    }
    get acroForm(): _PdfDictionary {
        let form: _PdfDictionary;
        if (this._catalogDictionary.has('AcroForm')) {
            form = this._catalogDictionary.get('AcroForm');
        }
        if (form === null || typeof form === 'undefined') {
            form = this._createForm();
        }
        return form;
    }
    /* eslint-disable */
    _createForm(): _PdfDictionary {
        const form: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const ref: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(ref, form);
        this._catalogDictionary.set('AcroForm', ref);
        this._catalogDictionary._updated = true;
        this._crossReference._allowCatalog = true;
        form._updated = true;
        return form;
    }
    private _addToCache(pageIndex: number, dictionary: _PdfDictionary, reference: _PdfReference): void {
        this._pageCache.set(pageIndex, {
            dictionary: dictionary,
            reference: reference,
            parent: dictionary.get('Parent')
        });
        this._parsedPages.push(pageIndex);
    }
    _getPageDictionary(pageIndex: number): { dictionary: _PdfDictionary, reference: _PdfReference } {
        if (pageIndex !== 0 && this._checkPageTreeFormat()) {
            const nearestIndex: number = this._findNearestIndex(pageIndex);
            if (nearestIndex > 0) {
                const nearestCachedPage: any = this._pageCache.get(nearestIndex);
                if (nearestCachedPage) {
                    const result: { dictionary: _PdfDictionary; reference: _PdfReference; } = this._traverseFromCached(nearestIndex, nearestCachedPage, pageIndex);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return this._traverseFromRoot(pageIndex);
    }
    private _checkPageTreeFormat(): boolean {
        if (typeof this._hasInvalidPageTree === 'undefined') {
            const kids: any[] = this._topPagesDictionary.get('Kids');
            if (Array.isArray(kids)) {
                this._hasInvalidPageTree = this.pageCount === kids.length;
            }
        }
        return this._hasInvalidPageTree;
    }
    private _findNearestIndex(targetIndex: number): number {
        let length: number = this._parsedPages.length;
        let nearest: number = this._parsedPages[0];
        let minDistance: number = Math.abs(nearest - targetIndex);
        for (let i: number = 1; i < length; i++) {
            const index: number = this._parsedPages[i];
            const distance: number = Math.abs(index - targetIndex);
            if (distance < minDistance) {
                nearest = index;
                minDistance = distance;
            }
        }
        return nearest;
    }
    private _traverseFromCached(
        index: number,
        cachedPage: {
            dictionary: _PdfDictionary,
            reference: _PdfReference,
            parent: _PdfDictionary
        },
        targetIndex: number
    ): { dictionary: _PdfDictionary, reference: _PdfReference } {
        const visitedNodes: _PdfReferenceSet = new _PdfReferenceSet();
        const direction: number = targetIndex > index ? 1 : -1;
        let currentNode: _PdfDictionary = cachedPage.dictionary;
        let currentIndex: number = index;
        let parent: _PdfDictionary = cachedPage.parent;
        let currentReference: _PdfReference = cachedPage.reference;
        if (currentIndex === targetIndex && _isName(currentNode.get('Type'), 'Page')) {
            return { dictionary: currentNode, reference: currentReference };
        }
        while (currentNode && currentIndex !== targetIndex) {
            if (currentNode instanceof _PdfReference) {
                if (visitedNodes.has(currentNode)) {
                    throw new FormatError('Pages tree contains circular reference.');
                }
                visitedNodes.put(currentNode);
            }
            const nextPage: { dictionary: _PdfDictionary; reference: _PdfReference; } = this._findNextPage(currentNode, parent, direction);
            if (!nextPage) {
                break;
            }
            currentNode = nextPage.dictionary;
            currentReference = nextPage.reference;
            currentIndex += direction;
            if (currentIndex === targetIndex && _isName(currentNode.get('Type'), 'Page')) {
                this._addToCache(currentIndex, nextPage.dictionary, nextPage.reference);
                return {
                    dictionary: currentNode,
                    reference: currentReference
                };
            }
        }
        return null;
    }
    private _findNextPage(
        currentPage: _PdfDictionary,
        parent: _PdfDictionary,
        direction: number
    ): { dictionary: _PdfDictionary, reference: _PdfReference } {
        if (!parent || !parent.has('Kids')) {
            return null;
        }
        let kids: any = parent.getRaw('Kids');
        if (kids instanceof _PdfReference) {
            kids = this._crossReference._fetch(kids);
        }
        if (!Array.isArray(kids)) {
            throw new FormatError('Page dictionary kids object is not an array.');
        }
        let currentIndex: number = -1;
        if (currentPage._reference) {
            currentIndex = kids.indexOf(currentPage._reference);
        } else {
            currentIndex = kids.findIndex(kid => {
                if (kid instanceof _PdfReference) {
                    kid = this._crossReference._fetch(kid);
                }
                return kid === currentPage;
            });
        }
        if (currentIndex === -1) {
            return null;
        }
        const nextIndex: number = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= kids.length) {
            return null;
        }
        const nextKid: any = kids[nextIndex];
        const nextDict: any = nextKid instanceof _PdfReference ? this._crossReference._fetch(nextKid) : nextKid;
        if (!(nextDict instanceof _PdfDictionary)) {
            throw new FormatError('Invalid page dictionary type.');
        }
        return {
            dictionary: nextDict,
            reference: nextKid instanceof _PdfReference ? nextKid : null
        };
    }
    private _traverseFromRoot(pageIndex: number): { dictionary: _PdfDictionary, reference: _PdfReference } {
        const nodesToVisit: _PdfDictionary[] = [this._topPagesDictionary];
        const visitedNodes: _PdfReferenceSet = new _PdfReferenceSet();
        const pagesRef: any = this._catalogDictionary.getRaw('Pages');
        if (pagesRef && pagesRef instanceof _PdfReference) {
            visitedNodes.put(pagesRef);
        }
        const xref: _PdfCrossReference = this._crossReference;
        const pageKidsCountCache: _PdfReferenceSetCache = this.pageKidsCountCache;
        const pageIndexCache: _PdfReferenceSetCache = this.pageIndexCache;
        let currentPageIndex: number = 0;
        while (nodesToVisit.length > 0) {
            const currentNode: _PdfDictionary = nodesToVisit.pop();
            if (currentNode && currentNode instanceof _PdfReference) {
                const count: any = pageKidsCountCache.get(currentNode);
                if (count >= 0 && currentPageIndex + count <= pageIndex) {
                    currentPageIndex += count;
                    continue;
                }
                if (visitedNodes.has(currentNode)) {
                    throw new FormatError('Pages tree contains circular reference.');
                }
                visitedNodes.put(currentNode);
                const obj: any = xref._fetch(currentNode);
                if (obj && obj instanceof _PdfDictionary) {
                    let type: any = obj.getRaw('Type');
                    if (type instanceof _PdfReference) {
                        type = xref._fetch(type);
                    }
                    if (_isName(type, 'Page') || !obj.has('Kids')) {
                        if (!pageKidsCountCache.has(currentNode)) {
                            pageKidsCountCache.put(currentNode, 1);
                        }
                        if (!pageIndexCache.has(currentNode)) {
                            pageIndexCache.put(currentNode, currentPageIndex);
                        }
                        if (currentPageIndex === pageIndex) {
                            this._addToCache(currentPageIndex, obj, currentNode);
                            return { dictionary: obj, reference: currentNode };
                        }
                        currentPageIndex++;
                        continue;
                    }
                }
                nodesToVisit.push(obj);
                continue;
            }
            if (!(currentNode instanceof _PdfDictionary)) {
                throw new FormatError('Page dictionary kid reference points to wrong type of object.');
            }
            const { objId } = currentNode;
            let count: any = currentNode.get('Count');
            if (count instanceof _PdfReference) {
                count = xref._fetch(count);
            }
            if (count !== null && typeof count !== 'undefined' && Number.isInteger(count) && count >= 0) {
                if (objId && !pageKidsCountCache.has(objId)) {
                    pageKidsCountCache.set(objId, count);
                }
                if (currentPageIndex + count <= pageIndex) {
                    currentPageIndex += count;
                    continue;
                }
            }
            let kids: any = currentNode.getRaw('Kids');
            if (kids instanceof _PdfReference) {
                kids = xref._fetch(kids);
            }
            if (!Array.isArray(kids)) {
                let type: any = currentNode.getRaw('Type');
                if (type instanceof _PdfReference) {
                    type = xref._fetch(type);
                }
                if (_isName(type, 'Page') || !currentNode.has('Kids')) {
                    if (currentPageIndex === pageIndex) {
                        this._addToCache(currentPageIndex, currentNode, null);
                        return { dictionary: currentNode, reference: null };
                    }
                    currentPageIndex++;
                    continue;
                }
                throw new FormatError('Page dictionary kids object is not an array.');
            }
            for (let last: number = kids.length - 1; last >= 0; last--) {
                nodesToVisit.push(kids[last]);
            }
        }
        throw new Error(`Page index ${pageIndex} not found.`);
    }
    _destroy(): void {
        if (this._catalogDictionary) {
            this._catalogDictionary = undefined;
        }
        if (this._topPagesDictionary) {
            this._topPagesDictionary = undefined;
        }
        if (this.pageIndexCache) {
            this.pageIndexCache.clear();
            this.pageIndexCache = undefined;
        }
        if (this.pageKidsCountCache) {
            this.pageKidsCountCache.clear();
            this.pageKidsCountCache = undefined;
        }
        this._hasInvalidPageTree = undefined;
        this._pageCache.clear();
        this._parsedPages = [];
    }
    /* eslint-enable */
}
