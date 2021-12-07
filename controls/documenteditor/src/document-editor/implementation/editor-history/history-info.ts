import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo } from './base-history-info';
import { EditRangeStartElementBox } from '../viewer/page';
import { DocumentHelper } from '../viewer';
/**
 * EditorHistory preservation class
 */
/**
 * @private
 */
export class HistoryInfo extends BaseHistoryInfo {
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public modifiedActions: BaseHistoryInfo[];

    private isChildHistoryInfo: boolean = false;
    public editRangeStart: EditRangeStartElementBox = undefined;

    public get hasAction(): boolean {
        return !isNullOrUndefined(this.modifiedActions);
    }
    public constructor(node: DocumentEditor, isChild: boolean) {
        super(node);
        this.documentHelper = node.documentHelper;
        this.isChildHistoryInfo = isChild;

    }
    public addModifiedAction(baseHistoryInfo: BaseHistoryInfo): void {
        // For complex actions such as Replace text, Insert/Remove Hyperlink etc.
        if (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            if (isNullOrUndefined(this.modifiedActions)) {
                this.modifiedActions = [];
            }
            this.modifiedActions.push(baseHistoryInfo);
        }
    }
    public revert(): void {
        this.editorHistory.currentHistoryInfo = this;
        if (this.action === 'BordersAndShading') {
            this.owner.editorModule.isBordersAndShadingDialog = true;
        }
        if (!isNullOrUndefined(this.modifiedActions)) {
            if (this.editorHistory.isUndoing) {
                let i: number = this.modifiedActions.length;
                while (i > 0) {
                    const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[i - 1];
                    baseHistoryInfo.revert();
                    i = i - 1;
                }
            } else {
                let i: number = 0;
                while (i < this.modifiedActions.length) {
                    const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[i];
                    baseHistoryInfo.revert();
                    i = i + 1;
                }
            }
        }

        if (this.action === 'RestrictEditing') {
            const user: string = this.editRangeStart.user !== '' ? this.editRangeStart.user : this.editRangeStart.group;
            if (this.editorHistory.isUndoing) {
                const index: number = this.owner.documentHelper.editRanges.get(user).indexOf(this.editRangeStart);
                if (index !== -1) {
                    this.owner.documentHelper.editRanges.get(user).splice(index, 1);
                }
            } else {
                this.owner.editor.updateRangeCollection(this.editRangeStart, user);
            }
            this.owner.selection.updateEditRangeCollection();
        }
        if (!this.isChildHistoryInfo) {
            this.editorHistory.updateComplexHistory();
        } else {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.modifiedActions)) {
            while (this.modifiedActions.length > 0) {
                const baseHistoryInfo: BaseHistoryInfo = this.modifiedActions[this.modifiedActions.length - 1];
                baseHistoryInfo.destroy();
                this.modifiedActions.splice(this.modifiedActions.indexOf(baseHistoryInfo), 1);
            }
            this.modifiedActions = undefined;
        }
        super.destroy();
    }
}
