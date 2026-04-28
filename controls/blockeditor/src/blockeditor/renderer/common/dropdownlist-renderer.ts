import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { BlockEditor } from '../../base/index';
import { IDropDownListRenderOptions } from '../../../common/interface';
import { createElement } from '@syncfusion/ej2-base';

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
        const languageSelector: HTMLElement = createElement('input', {
            id: (this.editor.element.id + '_' + 'code-ddl'),
            className: 'e-code-block-languages'
        });
        args.targetElement.appendChild(languageSelector);
        return new DropDownList({
            dataSource: args.dataSource,
            fields: args.fields,
            value: args.value,
            change: args.change,
            locale: this.editor.locale,
            cssClass: this.editor.cssClass,
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence
        }, languageSelector);
    }
}
