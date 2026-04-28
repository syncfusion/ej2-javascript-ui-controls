import { L10n, select } from '@syncfusion/ej2-base';
import { IRenderer } from '../base/interface';
import { RendererFactory } from '../services/renderer-factory';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { Menu } from '@syncfusion/ej2-navigations';
import { IMenuRenderArgs, IRichTextEditor } from '../../rich-text-editor/base/interface';
import * as model from '../models/items';
import { IToolbarItems } from '../../common/interface';
import { IMenuRenderTargetType } from '../base/types';
import * as classes from '../base/classes';
import { RenderType } from '../base/enum';
import { RichTextEditorModel } from '../base/rich-text-editor-model';
import { getIndex } from '../base/util';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

export class MenuButton {
    public parent: IRichTextEditor;
    private isDestroyed: boolean = false;
    protected locator: ServiceLocator;
    protected renderFactory: RendererFactory;
    private i10n: L10n;
    public aiCommandsMenu: Menu;
    public aiCommandsDropDownButton: DropDownButton;
    private toolbarRenderer: IRenderer;
    private initRender: boolean;
    constructor(parent: IRichTextEditor, serviceLocator: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.i10n = serviceLocator.getService<L10n>('rteLocale');
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
        this.initRender = true;
    }

    private addEventListener(): void {
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.bindCssClass, this.setCssClass, this);
    }

    public renderMenu(toolbarItems: (string | IToolbarItems)[], toolbarElement: HTMLElement, containerType: IMenuRenderTargetType): void {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        model.templateItems.forEach((item: string) => {
            if (getIndex(item, toolbarItems) !== -1) {
                switch (item) {
                case 'aicommands': {
                    const menuName: string = item;
                    const rootElement: HTMLButtonElement = select('#' + this.parent.getID() + '_' + containerType.toLowerCase() + '_AICommandsDropDownMenu', toolbarElement);
                    const ulElement: HTMLUListElement = this.parent.createElement('ul', { id: this.parent.getID() + '_' + containerType.toLowerCase() + '_AICommandsMenu'});
                    rootElement.appendChild(ulElement);
                    const argument: IMenuRenderArgs = {
                        dropDownItems: {
                            iconCss: 'e-ai-chat e-icons',
                            cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_AI_COMMANDS_TBAR_BTN + ' ' +  classes.CLS_DROPDOWN_MENU,
                            target: '#' + ulElement.id
                        },
                        menuItems: {
                            items: this.parent.aiAssistantSettings.commands
                        },
                        name: menuName,
                        containerType: containerType,
                        toolbarElement: toolbarElement,
                        dropDownRoot: rootElement,
                        menuRoot: ulElement
                    };
                    const { menu, dropDownButton } = this.toolbarRenderer.renderMenu(argument);
                    this.aiCommandsMenu = menu;
                    this.aiCommandsDropDownButton = dropDownButton;
                    break;
                }
                }
            }
        });
    }

    private setRtl(args: RichTextEditorModel): void {
        if (this.aiCommandsMenu) {
            this.aiCommandsMenu.setProperties({ enableRtl: args.enableRtl });
            this.aiCommandsDropDownButton.setProperties({ enableRtl: args.enableRtl });
        }
    }

    private setCssClass(args: { cssClass: string, oldCssClass: string}): void {
        if (this.aiCommandsMenu && !this.initRender) {
            this.aiCommandsMenu.setProperties({ cssClass: args.cssClass + ' e-rte-aicommands-menu' + 'e-rte-menu ' + classes.CLS_RTE_ELEMENTS });
            this.aiCommandsDropDownButton.setProperties({ cssClass: args.cssClass + '' + classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_AI_COMMANDS_TBAR_BTN + ' ' +  classes.CLS_DROPDOWN_MENU});
        } else {
            this.initRender = false;
        }
    }

    public destroyMenu(): void {
        if (this.aiCommandsMenu && !this.aiCommandsMenu.isDestroyed) {
            this.aiCommandsMenu.destroy();
            this.aiCommandsDropDownButton.destroy();
            this.aiCommandsMenu = null;
            this.aiCommandsDropDownButton = null;
        }
    }

    private removeEventListener(): void {
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.bindCssClass, this.setCssClass);
    }

    public destroy(): void {
        if (this.isDestroyed) { return; }
        this.removeEventListener();
        this.destroyMenu();
        this.isDestroyed = true;
    }
}
