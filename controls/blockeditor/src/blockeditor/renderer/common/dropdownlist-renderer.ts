import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { BlockEditor } from '../../base/index';
import { IDropDownListRenderOptions } from '../../../common/interface';

/**
 * `DropDownList renderer` module is used to render DropDownList in BlockEditor.
 *
 * @hidden
 */
export class DropDownListRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders DropDownList in BlockEditor.
     *
     * @param {IDropDownListRenderOptions} args - specifies  the arguments.
     * @returns {DropDownList} - returns the DropDownList object.
     * @hidden
     */
    public renderDropDownList(args?: IDropDownListRenderOptions): DropDownList {
        return new DropDownList({
            dataSource: args.dataSource,
            fields: args.fields,
            value: args.value,
            change: args.change,
            locale: this.editor.locale,
            cssClass: this.editor.cssClass,
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence
        }, args.targetElement);
    }
}
