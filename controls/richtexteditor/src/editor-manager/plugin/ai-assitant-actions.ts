import * as EVENTS from '../../common/constant';
import { IEditorModel } from '../../common';
import { IAIAssistantActionItem } from '../base/interface';
import { InsertHtml } from './inserthtml';
import { EditorManager } from '../base';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { cleanHTMLString } from './../../common/util';

export class AIAssistantActions {
    public parent: IEditorModel;
    constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.AI_ASSISTANT_ACTIONS, this.actionHandler, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.AI_ASSISTANT_ACTIONS, this.actionHandler);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private actionHandler(args: IAIAssistantActionItem): void {
        const subCommand: string = args.subCommand;
        if (subCommand === 'InsertResponseContent') {
            this.parent.nodeSelection.restore();
            const currentRange: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            const closestBlockElement: HTMLElement = this.parent.domNode.blockNodes()[0] as HTMLElement;
            if (currentRange.collapsed && !isNOU(closestBlockElement) && closestBlockElement.textContent.length > 0) {
                currentRange.selectNodeContents(closestBlockElement);
            }
            InsertHtml.Insert(this.parent.currentDocument,
                              args.value, this.parent.editableElement, true, args.enterAction, this.parent as EditorManager);
            this.callBack(args); // To trigger the actionComplete and then enable the undo redo.
        } else if (subCommand === 'ReplaceEditorContent') {
            this.parent.editableElement.innerHTML = cleanHTMLString(args.value, this.parent.editableElement);
            const firstPosition: { node: Node; position: number } =
                this.parent.nodeSelection.findFirstContentNode(this.parent.editableElement);
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, firstPosition.node as Element, 0);
            this.callBack(args);
        }
    }

    private callBack (event: IAIAssistantActionItem): void {
        event.callBack({
            requestType: event.command,
            action: event.subCommand,
            editorMode: 'HTML',
            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
            elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
        });
    }

    private destroy(): void  {
        this.removeEventListener();
        this.parent = null;
    }
}
