import { _PdfCrossReference } from './pdf-cross-reference';
import { _PdfDictionary, _PdfReferenceSet, _PdfReferenceSetCache, _PdfName, _PdfReference, _isName } from './pdf-primitives';
import { FormatError } from './utils';
export class _PdfCatalog {
    private _crossReference: _PdfCrossReference;
    _catalogDictionary: _PdfDictionary;
    pageIndexCache: _PdfReferenceSetCache;
    pageKidsCountCache: _PdfReferenceSetCache;
    _topPagesDictionary: _PdfDictionary;
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
    getPageDictionary(pageIndex: number): {dictionary: _PdfDictionary, reference: _PdfReference} {
        const nodesToVisit = [this._topPagesDictionary];
        const visitedNodes = new _PdfReferenceSet();
        const pagesRef = this._catalogDictionary.getRaw('Pages');
        if (pagesRef instanceof _PdfReference) {
            visitedNodes.put(pagesRef);
        }
        const xref: _PdfCrossReference = this._crossReference;
        const pageKidsCountCache = this.pageKidsCountCache;
        const pageIndexCache = this.pageIndexCache;
        let currentPageIndex = 0;
        while (nodesToVisit.length > 0) {
            const currentNode = nodesToVisit.pop();
            if (currentNode !== null && typeof currentNode !== 'undefined' && currentNode instanceof _PdfReference) {
                const count = pageKidsCountCache.get(currentNode);
                if (count >= 0 && currentPageIndex + count <= pageIndex) {
                    currentPageIndex += count;
                    continue;
                }
                if (visitedNodes.has(currentNode)) {
                    throw new FormatError('Pages tree contains circular reference.');
                }
                visitedNodes.put(currentNode);
                const obj = xref._fetch(currentNode);
                if (obj instanceof _PdfDictionary) {
                    let type = obj.getRaw('Type');
                    if (type !== null && typeof type !== 'undefined' && type instanceof _PdfReference) {
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
                            return {dictionary: obj, reference: currentNode};
                        }
                        currentPageIndex++;
                        continue;
                    }
                }
                nodesToVisit.push(obj);
                continue;
            }
            if (!(currentNode instanceof _PdfDictionary)) {
                throw new FormatError(
                    'Page dictionary kid reference points to wrong type of object.'
                );
            }
            const { objId } = currentNode;
            let count = currentNode.get('Count');
            if (count !== null && typeof count !== 'undefined' && count instanceof _PdfReference) {
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
            let kids = currentNode.getRaw('Kids');
            if (kids !== null && typeof kids !== 'undefined' && kids instanceof _PdfReference) {
                kids = xref._fetch(kids);
            }
            if (!Array.isArray(kids)) {
                let type = currentNode.getRaw('Type');
                if (type !== null && typeof type !== 'undefined' && type instanceof _PdfReference) {
                    type = xref._fetch(type);
                }
                if (_isName(type, 'Page') || !currentNode.has('Kids')) {
                    if (currentPageIndex === pageIndex) {
                        return {dictionary: currentNode, reference: null};
                    }
                    currentPageIndex++;
                    continue;
                }
                throw new FormatError('Page dictionary kids object is not an array.');
            }
            for (let last = kids.length - 1; last >= 0; last--) {
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
    }
    /* eslint-enable */
}
