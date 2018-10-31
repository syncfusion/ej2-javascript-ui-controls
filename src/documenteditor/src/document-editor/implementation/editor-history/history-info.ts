import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo } from './base-history-info';
/**
 * EditorHistory preservation class
 */
/**
 * @private
 */
export class HistoryInfo extends BaseHistoryInfo {
    /**
     * @private
     */
    public modifiedActions: BaseHistoryInfo[];

    private isChildHistoryInfo: boolean = false;
    /**
     * @private
     */
    get hasAction(): boolean {
        return !isNullOrUndefined(this.modifiedActions);
    }
    constructor(node: DocumentEditor, isChild: boolean) {
        super(node);
        this.isChildHistoryInfo = isChild;
    }

    /**
     * Adds the modified actions
     * @param  {BaseHistoryInfo} baseHistoryInfo
     * @private
     */
    public addModifiedAction(baseHistoryInfo: BaseHistoryInfo): void {
        // For complex actions such as Replace text, Insert/Remove Hyperlink etc.
        if (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            if (isNullOrUndefined(this.modifiedActions)) {
                this.modifiedActions = [];
            }
            this.modifiedActions.push(baseHistoryInfo);
        }
    }
    /**
     * Reverts this instance
     * @private
     */
    public revert(): void {
        this.editorHistory.currentHistoryInfo = this;
        if (this.action === 'BordersAndShading') {
            this.owner.editorModule.isBordersAndShadingDialog = true;
        }
        if (!isNullOrUndefined(this.modifiedActions)) {
            if (this.editorHistory.isUndoing) {
                let i: number = this.modifiedActions.length;
                while (i > 0) {
                    let baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[i - 1];
                    baseHistoryInfo.revert();
                    i = i - 1;
                }
            } else {
                let i: number = 0;
                while (i < this.modifiedActions.length) {
                    let baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[i];
                    baseHistoryInfo.revert();
                    i = i + 1;
                }
            }
        }

        if (!this.isChildHistoryInfo) {
            this.editorHistory.updateComplexHistory();
        } else {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.modifiedActions)) {
            while (this.modifiedActions.length > 0) {
                let baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                baseHistoryInfo.destroy();
                this.modifiedActions.splice(this.modifiedActions.indexOf(baseHistoryInfo), 1);
            }
            this.modifiedActions = undefined;
        }
        super.destroy();
    }
}