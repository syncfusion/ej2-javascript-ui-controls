import { Menu, ContextMenu } from '@syncfusion/ej2-navigations';
import { BlockEditor } from '../../base/index';
import { IMenubarRenderOptions } from '../../../common/interface';

/**
 * `Menu renderer` module is used to render menus in BlockEditor.
 *
 * @hidden
 */
export class MenuBarRenderer {
    private editor: BlockEditor;

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
            fields: args.fields,
            select: args.select,
            locale: this.editor.locale,
            cssClass: (args.cssClass + (this.editor.cssClass ? (' ' + this.editor.cssClass) : '')),
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence
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
            locale: this.editor.locale,
            cssClass: (args.cssClass + (this.editor.cssClass ? (' ' + this.editor.cssClass) : '')),
            enableRtl: this.editor.enableRtl,
            enablePersistence: this.editor.enablePersistence,
            fields: args.fields,
            select: args.select,
            beforeOpen: args.beforeOpen,
            beforeClose: args.beforeClose,
            onOpen: args.open,
            onClose: args.close
        }, args.element);
    }
}
