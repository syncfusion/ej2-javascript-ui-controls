import { Mention, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { BlockEditor } from '../../base/index';
import { IMentionRenderOptions } from '../../../common/interface';
import { NodeSelection } from '../../../selection/selection';

/**
 * `Mention renderer` module is used to render Mention control in BlockEditor.
 *
 * @hidden
 */
export class MentionRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders the mention control in BlockEditor.
     *
     * @param {IMentionRenderOptions} args - specifies  the arguments.
     * @returns {Mention} - returns the mention object.
     * @hidden
     */
    public renderMention(args?: IMentionRenderOptions): Mention {
        return new Mention({
            mentionChar: args.mentionChar,
            dataSource: args.dataSource,
            highlight: args.highlight,
            fields: args.fields,
            itemTemplate: args.itemTemplate,
            displayTemplate: args.displayTemplate,
            popupWidth: args.popupWidth,
            popupHeight: args.popupHeight,
            change: args.change,
            filtering: args.filtering,
            beforeOpen: args.beforeOpen,
            select: args.select,
            locale: this.editor.locale,
            cssClass: (args.cssClass + (this.editor.cssClass ? (' ' + this.editor.cssClass) : '')),
            opened: (e: PopupEventArgs) => {
                this.editor.blockManager.observer.notify('mentionOpened');
                if (args.opened) {
                    args.opened.call(this, e);
                }
            },
            closed: (e: PopupEventArgs) => {
                if (args.beforeClose) {
                    args.beforeClose.call(this, e);
                }
            }
        }as Mention, args.element);
    }
}
