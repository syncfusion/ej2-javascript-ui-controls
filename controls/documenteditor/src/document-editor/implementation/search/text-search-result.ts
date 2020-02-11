import { TextPosition } from '../selection/selection-helper';
import { DocumentHelper } from '../index';
import { DocumentEditor } from '../../document-editor';
/** 
 * @private
 */
export class TextSearchResult {
    public documentHelper: DocumentHelper;
    private startIn: TextPosition = undefined;
    private endIn: TextPosition = undefined;
    private owner: DocumentEditor;
    /**
     * @private
     */
    public isHeader: boolean;
    /**
     * @private
     */
    public isFooter: boolean;
    get start(): TextPosition {
        return this.startIn;
    }
    set start(value: TextPosition) {
        this.startIn = value;
    }
    get end(): TextPosition {
        return this.endIn;
    }
    set end(value: TextPosition) {
        this.endIn = value;
    }
    get text(): string {
        return this.documentHelper.selection.getTextInternal(this.start, this.end, false);
    }
    constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.documentHelper = this.owner.documentHelper;
    }
    public destroy(): void {
        this.start = undefined;
        this.end = undefined;
    }
}