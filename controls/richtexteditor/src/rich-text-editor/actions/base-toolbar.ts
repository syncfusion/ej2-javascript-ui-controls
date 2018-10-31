import { ItemModel, Toolbar as tool } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { CLS_HR_SEPARATOR } from '../base/classes';
import * as events from '../base/constant';
import { getTooltipText } from '../base/util';
import { tools, templateItems } from '../models/items';
import { IRichTextEditor, IRenderer, IToolbarRenderOptions, IToolbarItems } from '../base/interface';
import { IToolbarOptions, IToolbarItemModel } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class BaseToolbar {
    public toolbarObj: tool;
    protected parent: IRichTextEditor;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;

    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.destroy, this.removeEventListener);
    }

    private setRtl(args: { [key: string]: Object }): void {
        if (!isNullOrUndefined(this.toolbarObj)) {
            this.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private getTemplateObject(itemStr: string, container: string): IToolbarItemModel {
        let tagName: string;
        switch (itemStr) {
            case 'fontcolor':
            case 'backgroundcolor':
                tagName = 'span';
                break;
            default:
                tagName = 'button';
                break;
        }
        return {
            command: tools[itemStr].command,
            subCommand: tools[itemStr].subCommand,
            template: this.parent.createElement(tagName, { id: this.parent.getID() + '_' + container + '_' + tools[itemStr].id }).outerHTML,
            tooltipText: getTooltipText(itemStr, this.locator)
        };
    }

    public getObject(item: string, container: string): IToolbarItemModel {
        let itemStr: string = item.toLowerCase();
        if (templateItems.indexOf(itemStr) !== -1) {
            return this.getTemplateObject(itemStr, container);
        } else {
            switch (itemStr) {
                case '|':
                    return { type: 'Separator' };
                case '-':
                    return { type: 'Separator', cssClass: CLS_HR_SEPARATOR };
                default:
                    return {
                        id: this.parent.getID() + '_' + container + '_' + tools[itemStr].id,
                        prefixIcon: tools[itemStr].icon,
                        tooltipText: getTooltipText(itemStr, this.locator),
                        command: tools[itemStr].command,
                        subCommand: tools[itemStr].subCommand
                    };
            }
        }
    }
    /** 
     * @hidden
     */
    public getItems(tbItems: (string | IToolbarItems)[], container: string): ItemModel[] {
        if (this.parent.toolbarSettings.items.length < 1) { return []; }
        let items: ItemModel[] = [];
        for (let item of tbItems) {
            switch (typeof item) {
                case 'string':
                    items.push(this.getObject(item as string, container));
                    break;
                default:
                    items.push(item as ItemModel);
            }
        }
        return items;
    }

    private getToolbarOptions(args: IToolbarRenderOptions): IToolbarOptions {
        return {
            target: args.target,
            rteToolbarObj: this,
            items: this.getItems(args.items, args.container),
            overflowMode: args.mode,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        };
    }

    public render(args: IToolbarRenderOptions): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.toolbarRenderer.renderToolbar(this.getToolbarOptions(args));
    }
}