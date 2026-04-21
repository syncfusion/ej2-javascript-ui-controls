import { Tab } from '@syncfusion/ej2-navigations';
import { BlockEditor } from '../../base/index';
import { ITabRendererOptions } from '../../../common/interface';

/**
 * `Tab renderer` module is used to render Tab control in BlockEditor.
 *
 * @hidden
 */
export class TabRenderer {
    private editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders the tab control in BlockEditor.
     *
     * @param {ITabRendererOptions} args - specifies the arguments.
     * @returns {Tab} - returns the tab object.
     * @hidden
     */
    public renderTab(args?: ITabRendererOptions): Tab {
        return new Tab({
            items: args.items,
            selectedItem: args.selectedItem,
            enableRtl: this.editor.enableRtl,
            cssClass: args.cssClass,
            selected: args.selected
        } as Tab, args.element);
    }
}
