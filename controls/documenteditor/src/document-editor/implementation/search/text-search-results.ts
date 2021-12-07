import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextSearchResult } from './text-search-result';
import { DocumentEditor } from '../../document-editor';
/**
 * @private
 */
export class TextSearchResults {
    public innerList: TextSearchResult[];
    public currentIndex: number = -1;
    private owner: DocumentEditor;
    public get length(): number {
        if (this.innerList === undefined) {
            return 0;
        }
        return this.innerList.length;
    }
    public get currentSearchResult(): TextSearchResult {
        if (this.innerList === undefined || this.currentIndex < 0 || this.currentIndex >= this.length) {
            return undefined;
        }
        return this.innerList[this.currentIndex];
    }
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }
    public addResult(): TextSearchResult {
        const textSearchResult: TextSearchResult = new TextSearchResult(this.owner);
        if (isNullOrUndefined(this.innerList)) {
            this.innerList = [];
        }
        this.innerList.push(textSearchResult);
        return textSearchResult;
    }
    public clearResults(): void {
        this.currentIndex = -1;
        if (!isNullOrUndefined(this.innerList)) {
            for (let i: number = this.innerList.length - 1; i >= 0; i--) {
                this.innerList[i].destroy();
                this.innerList.splice(i, 1);
            }
        }
    }
    public indexOf(result: TextSearchResult): number {
        if (isNullOrUndefined(this.innerList)) {
            return -1;
        }
        return this.innerList.indexOf(result);
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.innerList)) {
            this.clearResults();
        }
        this.innerList = undefined;
    }
}
