import { IEditorCoreOptions } from '../base/interface';
import * as events from '../constants';

export interface AlignmentPayload {
    align: 'left' | 'center' | 'right' | 'justify';
}

interface AlignmentExecutionPayload {
    command: string;
    args: AlignmentPayload;
    callBack: Function;
}

export class Alignment {
    public parent: IEditorCoreOptions;

    constructor(parent?: IEditorCoreOptions) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.alignmentxecution, this.applyAlignment, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.alignmentxecution, this.applyAlignment);
    }

    private applyAlignment(args: AlignmentExecutionPayload): void {
        this.parent.editor.commands.setTextAlign(args.args);
    }

    /**
     * Clean up alignment plugin resources
     *
     * @returns {void}
     */
    private destroy(): void {
        this.removeEventListener();
    }
}
