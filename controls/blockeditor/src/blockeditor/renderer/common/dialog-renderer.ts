import { Dialog } from '@syncfusion/ej2-popups';
import { BlockEditor } from '../../base/index';
import { IDialogRenderOptions, IMenubarRenderOptions } from '../../../common/interface';

/**
 * `Dialog renderer` module is used to render dialog popups in BlockEditor.
 *
 * @hidden
 */
export class DialogRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders Dialog in BlockEditor.
     *
     * @param {IDialogRenderOptions} args - specifies  the arguments.
     * @returns {Dialog} - returns the Dialog object.
     * @hidden
     */
    public renderDialog(args?: IDialogRenderOptions): Dialog {
        return new Dialog({
            header: args.headerTemplate,
            target: this.editor.element,
            footerTemplate: args.footerTemplate,
            content: args.contentTemplate,
            showCloseIcon: args.showCloseIcon,
            closeOnEscape: args.closeOnEscape,
            width: args.width,
            height: args.height,
            visible: args.visible,
            locale: this.editor.locale,
            cssClass: this.editor.cssClass,
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence
        }, args.element);
    }
}
