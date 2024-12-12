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
    public get start(): TextPosition {
        return this.startIn;
    }
    public set start(value: TextPosition) {
        this.startIn = value;
    }
    public get end(): TextPosition {
        return this.endIn;
    }
    public set end(value: TextPosition) {
        this.endIn = value;
    }
    public get text(): string {
        return this.documentHelper.selection.getTextInternal(this.start, this.end, false);
    }
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.documentHelper = this.owner.documentHelper;
    }
    public destroy(): void {
        this.start = undefined;
        this.end = undefined;
    }
}
