import { Menu, ContextMenu } from '@syncfusion/ej2-navigations';
import { BlockEditor } from '../../base/index';
import { IMenubarRenderOptions } from '../../base/interface';

/**
 * `Menu renderer` module is used to render menus in BlockEditor.
 *
 * @hidden
 */
export class MenuBarRenderer {
    protected editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders Menu in BlockEditor.
     *
     * @param {IMenubarRenderOptions} args - specifies  the arguments.
     * @returns {Menu} - returns the Menu object.
     * @hidden
     */
    public renderMenubar(args?: IMenubarRenderOptions): Menu {
        return new Menu({
            items: args.items,
            template: args.template,
            orientation: args.orientation,
            enablePersistence: this.editor.enablePersistence,
            enableRtl: this.editor.enableRtl,
            fields: args.fields,
            select: args.select
        }, args.element);
    }

    /**
     * Renders ContextMenu in BlockEditor.
     *
     * @param {IMenubarRenderOptions} args - specifies  the arguments.
     * @returns {Menu} - returns the Menu object.
     * @hidden
     */
    public renderContextMenu(args?: IMenubarRenderOptions): ContextMenu {
        return new ContextMenu({
            target: args.target,
            items: args.items,
            showItemOnClick: args.showItemOnClick,
            itemTemplate: args.itemTemplate,
            enablePersistence: this.editor.enablePersistence,
            enableRtl: this.editor.enableRtl,
            fields: args.fields,
            select: args.select,
            beforeOpen: args.beforeOpen,
            beforeClose: args.beforeClose,
            onOpen: args.open,
            onClose: args.close
        }, args.element);
    }
}
