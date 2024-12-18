/**
 * PdfCacheCollection.ts class for EJ2-PDF
 */
import { Dictionary } from './../collections/dictionary';
import { PdfFont } from './../graphics/fonts/pdf-font';
import { IPdfCache } from './../../interfaces/i-pdf-cache';
/**
 * `Collection of the cached objects`.
 * @private
 */
export class PdfCacheCollection {
    // Fields
    /**
     * Stores the similar `objects`.
     * @private
     */
    private referenceObjects : Object[][];
    /**
     * Stores the references of font with GUID `objects`.
     * @private
     */
    private pdfFontCollection : Dictionary<string, PdfFont>;
    // Constructors
    /**
     * Initializes a new instance of the `PdfCacheCollection` class.
     * @private
     */
    public constructor() {
        this.referenceObjects = [];
        this.pdfFontCollection = new Dictionary<string, PdfFont>();
    }
    // Public methods
    /**
     * `Searches` for the similar cached object. If is not found - adds the object to the cache.
     * @private
     */
    public search(obj : IPdfCache) : IPdfCache {
        let result : IPdfCache = null;
        let group : Object[] = this.getGroup(obj);
        if (group == null) {
            group = this.createNewGroup();
        } else if (group.length > 0) {
            result = group[0] as IPdfCache;
        }
        group.push(obj);
        return result;
    }
    // Implementation
    /**
     * `Creates` a new group.
     * @private
     */
    public createNewGroup() : Object[] {
        let group : Object[] = [];
        this.referenceObjects.push(group);
        return group;
    }
    /**
     * `Find and Return` a group.
     * @private
     */
    public getGroup(result : IPdfCache) : Object[] {
        let group : Object[] = null;
        if (result !== null) {
            let len : number = this.referenceObjects.length;
            for (let i : number = 0; i < len; i++) {
                if (this.referenceObjects.length > 0) {
                    let tGroup : Object[] = this.referenceObjects[i];
                    if (tGroup.length > 0) {
                        let representative : IPdfCache = tGroup[0] as IPdfCache;
                        if (result.equalsTo(representative)) {
                            group = tGroup;
                            break;
                        }
                    } else {
                        this.removeGroup(tGroup);
                    }
                }
                len = this.referenceObjects.length;
            }
        }
        return group;
    }
    /**
     * Remove a group from the storage.
     */
    public removeGroup(group : Object[]) : void {
        if (group !== null) {
            let index : number = this.referenceObjects.indexOf(group);
            this.referenceObjects.slice(index, index + 1);
        }
    }
    public destroy() : void {
        this.pdfFontCollection = undefined;
        this.referenceObjects = undefined;
    }
}