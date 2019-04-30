import { TextPosition } from '../selection/selection-helper';
import { LayoutViewer } from '../index';
import { DocumentEditor } from '../../document-editor';
/** 
 * @private
 */
export class TextSearchResult {
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
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
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
        return this.viewer.selection.getTextInternal(this.start, this.end, false);
    }
    constructor(owner: DocumentEditor) {
        this.owner = owner;
    }
    public destroy(): void {
        this.start = undefined;
        this.end = undefined;
    }
}