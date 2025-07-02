import { ItemModel, Toolbar as tool, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { RenderType } from '../base/enum';
import { CLS_HR_SEPARATOR } from '../base/classes';
import * as events from '../base/constant';
import { getTooltipText, toObjectLowerCase } from '../base/util';
import { ToolbarItems } from '../../common/enum';
import { tools, templateItems, windowKeys } from '../models/items';
import { IRichTextEditor, IToolbarRenderOptions, ICssClassArgs } from '../base/interface';
import { IToolbarOptions, IRenderer } from '../base/interface';
import { IToolbarItems, IToolsItems, IToolbarItemModel } from '../../common/interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { isNullOrUndefined, extend, EmitType } from '@syncfusion/ej2-base';
import { IHtmlUndoRedoData } from '../../editor-manager';
import { ToolbarRenderer } from '../renderer';

/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
export class BaseToolbar {
    public toolbarObj: tool;
    /**
     *
     * @hidden
     * @private
     */
    public parent: IRichTextEditor;
    public isDestroyed: boolean;
    protected locator: ServiceLocator;
    protected toolbarRenderer: IRenderer;
    protected renderFactory: RendererFactory;
    private tools: { [key: string]: IToolsItems } = {};

    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.isDestroyed = false;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        } else {
            this.tools = tools;
        }
        if (this.parent.toolbarSettings.enable || this.parent.quickToolbarSettings.enable) {
            this.toolbarRenderer = new ToolbarRenderer(this.parent, this.locator);
            this.renderFactory.addRenderer(RenderType.Toolbar, this.toolbarRenderer);
        }
    }

    private addEventListener(): void {
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.bindCssClass, this.setCssClass);
    }

    private setCssClass(e: ICssClassArgs): void {
        if (!isNullOrUndefined(this.toolbarObj)) {
            if (isNullOrUndefined(e.oldCssClass)) {
                this.toolbarObj.setProperties({ cssClass: (this.toolbarObj.cssClass + ' ' + e.cssClass).trim() });
            } else {
                this.toolbarObj.setProperties({ cssClass: (this.toolbarObj.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim() });
            }
        }
    }

    private setRtl(args: { [key: string]: Object }): void {
        if (!isNullOrUndefined(this.toolbarObj)) {
            this.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private getClass(item: string): string {
        let classes: string;
        switch (item) {
        case 'fontsize':
            classes = 'e-rte-inline-size-template';
            break;
        case 'fontcolor':
        case 'backgroundcolor':
            classes = 'e-rte-inline-color-template';
            break;
        default:
            classes = 'e-rte-inline-template';
            break;
        }
        return classes;
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
            command: this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].command,
            subCommand: this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].subCommand,
            template: this.parent.createElement(tagName, {
                id: this.parent.getID() + '_' + container
                    + '_' + this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].id
            }).outerHTML,
            cssClass: this.parent.inlineMode.enable ? this.getClass(itemStr) : '',
            tooltipText: this.parent.enabled ? getTooltipText(itemStr, this.locator) : ''
        };
    }

    /**
     * getObject method
     *
     * @param {string} item - specifies the string value
     * @param {string} container - specifies the value of string
     * @returns {IToolbarItemModel} - returns the model element
     * @hidden
     * @deprecated
     */
    public getObject(item: string, container: string): IToolbarItemModel {
        const itemStr: string = item.toLowerCase();
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
                    id: this.parent.getID() + '_' + container + '_' + this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].id,
                    prefixIcon: this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].icon,
                    tooltipText: this.parent.enabled ? getTooltipText(itemStr, this.locator) : '',
                    command: this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].command,
                    subCommand: this.tools[itemStr.toLocaleLowerCase() as ToolbarItems].subCommand
                };
            }
        }
    }
    /**
     * @param {string} tbItems - specifies the string value
     * @param {string} container - specifies the container value
     * @returns {ItemModel} - retunrs the model element
     * @hidden
     * @deprecated
     */
    public getItems(tbItems: (string | IToolbarItems)[], container: string): ItemModel[] {
        if (this.parent.toolbarSettings.items.length < 1) {
            return [];
        }
        const items: ItemModel[] = [];
        for (const item of tbItems) {
            switch (typeof item) {
            case 'string': {
                const object: IToolbarItemModel = this.getObject(item as string, container);
                const isImageLinkItem: boolean = item.toLowerCase().indexOf('imagelink') > -1;
                if (isImageLinkItem) {
                    object.cssClass = 'e-link-groups';
                }
                items.push(object);
                break;
            }
            default:
                if (!isNullOrUndefined((item as IToolbarItems).click)) {
                    const proxy: IToolbarItems = item as IToolbarItems;
                    const callback: EmitType<ClickEventArgs> = proxy.click;
                    proxy.click = () => {
                        if (proxy.undo && this.parent.formatter.getUndoRedoStack().length === 0) {
                            this.parent.formatter.saveData();
                        }
                        callback.call(this);
                        if (this.parent.formatter.getUndoRedoStack().length > 0) {
                            const currentContentElem: HTMLElement = this.parent.createElement('div');
                            const stackItem: IHtmlUndoRedoData = this.parent.formatter.
                                getUndoRedoStack()[this.parent.formatter.getUndoRedoStack().length - 1];
                            const clonedItem: DocumentFragment = (stackItem.text).cloneNode(true) as DocumentFragment;
                            currentContentElem.appendChild(clonedItem);
                            if (currentContentElem.innerHTML.trim() === this.parent.inputElement.innerHTML.trim()) {
                                return;
                            }
                        }
                        if (proxy.undo) {
                            this.parent.formatter.saveData();
                        }
                    };
                }
                items.push(item as ItemModel);
            }
        }
        if (this.parent.showTooltip && this.parent.enabled) {
            for (let num: number = 0; num < items.length; num++) {
                const tooltipText: string = items[num as number].tooltipText;
                let shortCutKey: string;
                const isMacDev: boolean = this.parent.userAgentData.getPlatform() === 'macOS';
                if (windowKeys[`${(items[num as number] as IToolbarItems).subCommand}`] && (!isNullOrUndefined(items[num as number].id) || !isNullOrUndefined(items[num as number].cssClass))) {
                    const shortcuts: string[] = windowKeys[`${(items[num as number] as IToolbarItems).subCommand}`].split(','); // Handle multiple shortcuts
                    shortCutKey = shortcuts.map((shortcut: string) =>
                        isMacDev
                            ? shortcut.replace('Ctrl+', '⌘').replace('Shift+', '⇧').replace('Alt+', '⌥')
                            : shortcut
                    ).join(', ');
                }
                else {
                    shortCutKey = tooltipText;
                }
                if (shortCutKey) {
                    if (!((items[num as number] as IToolbarItems).command === 'Images' && (items[num as number] as IToolbarItems).subCommand === 'InsertLink')) {
                        items[num as number].tooltipText = (tooltipText !== shortCutKey) ? tooltipText + ' (' + shortCutKey + ')' : tooltipText;
                    }
                }
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
            enableRtl: this.parent.enableRtl,
            cssClass: args.cssClass,
            type: args.container
        };
    }

    /**
     * render method
     *
     * @param {IToolbarRenderOptions} args - specifies the toolbar options
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public render(args: IToolbarRenderOptions): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        if (this.toolbarRenderer && (this.toolbarRenderer as ToolbarRenderer).isDestroyed) {
            this.toolbarRenderer = new ToolbarRenderer(this.parent, this.locator);
        }
        this.toolbarRenderer.renderToolbar(this.getToolbarOptions(args));
    }

    public destroy(): void {
        if (this.isDestroyed) { return; }
        this.removeEventListener();
        if (this.toolbarObj && !this.toolbarObj.isDestroyed) {
            this.toolbarObj.destroy();
            this.toolbarObj = null;
        }
        (this.toolbarRenderer as ToolbarRenderer).destroy();
        this.toolbarRenderer = null;
        this.tools = {};
        this.isDestroyed = true;
    }
}
