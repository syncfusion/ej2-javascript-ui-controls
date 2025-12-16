import { BeforeOpenCloseMenuEventArgs as MenuOpenCloseEventArgs, ClickEventArgs, Menu, Toolbar } from '@syncfusion/ej2-navigations';
import { AIAssistantPromptRequestArgs, AIAssistantStopRespondingArgs, AICommands, AIAssitantToolbarClickEventArgs, IRichTextEditor, IAIAssistantToolbarItem } from '../base/interface';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Popup, Tooltip } from '@syncfusion/ej2-popups';
import { AIAssistView, PromptModel, PromptRequestEventArgs } from '@syncfusion/ej2-interactive-chat';
import { ActionBeginEventArgs, IToolbarItemModel, NotifyArgs } from '../../common';
import { MenuEventArgs as MenuBarItemSelectedArgs } from '@syncfusion/ej2-navigations';
import { detach, Draggable, formatUnit, getComponent, isNullOrUndefined as isNOU, KeyboardEventArgs, L10n, select} from '@syncfusion/ej2-base';
import { NodeSelection } from '../../selection/selection';
import { AssistantPromptToolbarItems, AssistantResponseToolbarItems, AssistantToolbarType, AssitantHeaderToolbarItems } from '../base/types';
import { BeforePopupOpenCloseEventArgs, IMenuRenderArgs, RenderType, RichTextEditorModel } from '../base';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { RendererFactory, ServiceLocator } from '../services';
import { AIAssistantActions } from '../../editor-manager/plugin/ai-assitant-actions';
import { MarkdownConverter } from '@syncfusion/ej2-markdown-converter';
/**
 * Provides AI Assistant functionalities to the Rich Text Editor.
 * Inject this class as a module to access its features.
 */
export class AIAssistant {
    private parent: IRichTextEditor;
    protected locator: ServiceLocator;
    private rendererFactory: RendererFactory;
    private isDestroyed: boolean;
    public queryPopup: Popup;
    public assistView: AIAssistView;
    private blockNodes: Node[];
    private currentSelection: NodeSelection;
    private currentAction: AssistantAction;
    private lastResponse: string;
    private historyDropDownButton: DropDownButton;
    private historyIconButton: HTMLElement;
    private element: HTMLElement;
    private isRendered: boolean;
    private allPrompts: PromptModel[];
    private toolTip: Tooltip;
    private assistViewEditArea: HTMLElement;
    private menu: Menu;
    private menuDropDown: DropDownButton;
    private draggable: Draggable;
    private dragged: boolean;
    private L10n: L10n;
    private handlePopupEscapeBoundFn: () => void;
    constructor(parent: IRichTextEditor, serviceLocator: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.rendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.L10n = serviceLocator.getService<L10n>('rteLocale');
        this.isDestroyed = false;
        this.lastResponse = '';
        this.isRendered = false;
        this.allPrompts = [];
        this.currentSelection = new NodeSelection(this.parent.inputElement);
        this.handlePopupEscapeBoundFn = this.handlePopupEscape.bind(this);
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.onAIAssistant, this.onToolbarClick, this);
        this.parent.on(events.menuItemselected, this.onMenuItemSelect, this);
        this.parent.on(events.menuBeforeOpen, this.beforeMenuOpen, this);
        this.parent.on(events.menuBeforeClose, this.beforeMenuClose, this);
        this.parent.on(events.editAreaClick, this.updateCurrentSelection, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.windowResize, this.refreshPosition, this);
        this.parent.on(events.scroll, this.refreshPosition, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.afterKeyDown, this.refreshPosition, this);
        this.parent.on(events.contentscroll, this.refreshPosition, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.bindOnEnd, this.bindOnEnd, this);
        this.parent.on(events.bindCssClass, this.updateCssClass, this);
        this.parent.on(events.hidePopup, this.hideAIQueryPopup, this);
    }

    private onKeyDown(event: NotifyArgs): void {
        const originalEvent: KeyboardEventArgs = event.args as KeyboardEventArgs;
        if (!isNOU(originalEvent) && !isNOU(originalEvent.action) && (originalEvent.action === 'ai-query')) {
            originalEvent.preventDefault(); // Prevent the enter action.
            this.showAIQueryPopup(event.args as Event);
            this.setEditAreaRangeAndFocus();
        }
    }

    private onToolbarClick(notifyArgs: NotifyArgs): void {
        const command: string = ((notifyArgs.args as ClickEventArgs).item as IToolbarItemModel).subCommand;
        switch (command) {
        case 'AIQuery':
            this.currentAction = 'Toolbar';
            this.currentSelection = notifyArgs.selection;
            this.currentSelection.restore();
            if (document.body.contains(this.element)) {
                this.hideAIQueryPopup();
            } else {
                this.showAIQueryPopup((notifyArgs.args as ClickEventArgs).originalEvent);
                this.setEditAreaRangeAndFocus();
            }
            this.updateAIQueryButtonActiveState();
            break;
        case 'AICommands':
            break;
        }
    }

    private onMenuItemSelect(args: MenuBarItemSelectedArgs): void {
        if (args.element.closest('.e-rte-aicommands-menu') && args.item.id !== 'aicommands' && !isNOU((args.item as AICommands).prompt)) { // Prevent the Parent Item processing.
            this.currentAction = 'Menu';
            if (this.parent.userAgentData.getBrowser() === 'Safari') {
                this.currentSelection = this.parent.htmlEditorModule.saveSelection;
            } else {
                this.updateCurrentSelection();
            }
            const isQuickToolbarOpen: boolean = this.parent.element.querySelectorAll('.e-rte-quick-popup.e-popup-open').length > 0;
            if (isQuickToolbarOpen) {
                this.parent.quickToolbarModule.hideQuickToolbars();
            }
            const isNotFromToolbar: Element = args.element.closest('#' + this.parent.getID() + '_QueryPopupCommandsMenu');
            if (isNOU(isNotFromToolbar)) {
                this.showAIQueryPopup(args.event, (args.item as AICommands).prompt);
            }
        }
    }

    private showAIQueryPopup(event: Event, prompt?: string): void {
        this.showQueryPopup(event);
        if (!isNOU(prompt)) {
            if (this.currentAction === 'Toolbar') {
                this.currentSelection.restore();
            }
            this.assistView.executePrompt(prompt);
        }
    }

    private updateAIQueryButtonActiveState(): void {
        const toolbarItem: HTMLElement = this.parent.getToolbarElement() as HTMLElement;
        if (isNOU(toolbarItem)) {
            return;
        }
        const aiQueryButton: HTMLElement = toolbarItem.querySelector('.e-magic-wand');
        if (!isNOU(aiQueryButton) && !isNOU(aiQueryButton.parentElement) && !isNOU(aiQueryButton.parentElement.parentElement)) {
            if (document.body.contains(this.element)) {
                aiQueryButton.parentElement.parentElement.classList.add('e-active');
            } else {
                aiQueryButton.parentElement.parentElement.classList.remove('e-active');
            }
        } else {
            return;
        }
    }

    private render(): void {
        const popupRoot: HTMLElement = this.parent.createElement('div', { id: this.parent.getID() + '_RTE_Smart_AI_Query_Popup', className:
            classes.CLS_RTE_ELEMENTS + ' e-rte-aiquery-popup e-popup-close ' + this.parent.getCssClass() });
        if (this.parent.aiAssistantSettings.popupMaxHeight !== 'auto') {
            popupRoot.style.maxHeight = formatUnit(this.parent.aiAssistantSettings.popupMaxHeight);
        }
        const contentWrapper: HTMLElement = this.parent.createElement('div', { className : 'e-rte-ai-assit-content-container'});
        const assistViewRoot: HTMLElement = this.parent.createElement('div', { id: this.parent.getID() + '_RTE_Smart_AI_Query_AssistView' });
        const queryPopup: Popup = new Popup(null, {
            width: this.parent.userAgentData.isMobileDevice() ? '100%' : this.parent.aiAssistantSettings.popupWidth,
            position: this.parent.userAgentData.isMobileDevice() ? { X: 0, Y: 0 } : { X: 'right', Y: 'top'},
            enableRtl: this.parent.enableRtl,
            offsetX: -10,
            relateTo: this.parent.element,
            actionOnScroll: 'none',
            content: contentWrapper
        });
        contentWrapper.appendChild(assistViewRoot);
        this.renderAssistView(assistViewRoot);
        this.queryPopup = queryPopup;
        this.element = popupRoot;
        this.renderTooltip();
    }

    private renderAssistView(assistViewRoot: HTMLElement): void {
        this.assistView = new AIAssistView({
            views: [
                {
                    name: this.L10n.getConstant('aiAssistantName')
                }
            ],
            promptRequest: this.onPromptRequest.bind(this),
            responseToolbarSettings: {
                items: this.getToolbarItems(this.parent.aiAssistantSettings.responseToolbarSettings as string[] | IAIAssistantToolbarItem[], 'Response') ,
                itemClicked: (args: AIAssitantToolbarClickEventArgs) => {
                    args.requestType = 'Response';
                    this.onAssitantToolbarClick(args);
                }
            },
            promptToolbarSettings: {
                items: this.getToolbarItems(this.parent.aiAssistantSettings.promptToolbarSettings as string[] | IAIAssistantToolbarItem[], 'Prompt') ,
                itemClicked: (args: AIAssitantToolbarClickEventArgs) => {
                    args.requestType = 'Prompt';
                    this.onAssitantToolbarClick(args);
                }
            },
            prompts: this.parent.aiAssistantSettings.prompts,
            promptPlaceholder: this.parent.aiAssistantSettings.placeholder,
            promptSuggestions: this.parent.aiAssistantSettings.suggestions,
            bannerTemplate: this.parent.aiAssistantSettings.bannerTemplate,
            stopRespondingClick: this.handleStopResponse.bind(this),
            toolbarSettings: {
                items: this.getToolbarItems(this.parent.aiAssistantSettings.headerToolbarSettings as string[] | IAIAssistantToolbarItem[], 'Header') ,
                itemClicked: (args: AIAssitantToolbarClickEventArgs) => {
                    args.requestType = 'Header';
                    this.onAssitantToolbarClick(args);
                }
            },
            footerToolbarSettings: {
                items: [
                    { iconCss: 'e-icons e-history', tooltip: this.L10n.getConstant('aiAssistantHistoryButton'), align: 'Right', disabled: true }
                ],
                itemClick: (args: AIAssitantToolbarClickEventArgs) => {
                    args.requestType = 'Footer';
                    this.onAssitantToolbarClick(args);
                }
            },
            showClearButton: true,
            enablePersistence: this.parent.enablePersistence,
            cssClass: this.parent.getCssClass()
        });
        this.assistView.appendTo(assistViewRoot);
        this.assistViewEditArea = this.assistView.element.querySelector('.e-assist-textarea');
    }

    private onAssitantToolbarClick(args: AIAssitantToolbarClickEventArgs): void {
        this.parent.trigger('aiAssistantToolbarClick', args, (toolbarClickArgs: AIAssitantToolbarClickEventArgs) => {
            if (!toolbarClickArgs.cancel) {
                switch (toolbarClickArgs.requestType) {
                case 'Header': {
                    if (toolbarClickArgs.item.iconCss === 'e-icons e-close') {
                        this.hideAIQueryPopup();
                        args.cancel = true;
                    }
                    if (toolbarClickArgs.item.iconCss === 'e-icons e-trash') {
                        this.addEditorPromptCollection(this.assistView.prompts);
                        this.assistView.prompts = [];
                        this.assistView.dataBind();
                        this.updateHistoryButtonStatus();
                        args.cancel = true;
                    }
                    break;
                }
                case 'Prompt':
                    break;
                case 'Footer':
                    if (toolbarClickArgs.item.iconCss === 'e-icons e-history') {
                        this.handleHistoryButtonClick();
                    }
                    break;
                case 'Response':
                    if (toolbarClickArgs.item.iconCss === 'e-icons e-check') {
                        const response: string = this.assistView.prompts[args.dataIndex].response;
                        this.hideAIQueryPopup();
                        this.handleInsertContent(response);
                        args.cancel = true;
                    } else if (toolbarClickArgs.item.iconCss === 'e-icons e-repeat') {
                        this.assistView.executePrompt(this.assistView.prompts[args.dataIndex].prompt);
                    }
                    break;
                }
            }
        });
    }

    private onPromptRequest(args: PromptRequestEventArgs): void {
        if (this.currentAction === 'Toolbar' || this.parent.userAgentData.getBrowser() === 'Safari') {
            this.currentSelection.restore();
        }
        this.blockNodes = this.parent.formatter.editorManager.domNode.blockNodes();
        this.queryPopup.element.classList.add('processing');
        const range: Range = this.parent.getRange();
        let htmlString: string;
        if (this.assistView.prompts.length === 1) {
            if (!this.parent.isRTEFocused) {
                htmlString = this.parent.getHtml();
            } else if (range.collapsed && this.blockNodes.length > 0) {
                htmlString = (this.blockNodes[0] as HTMLElement).outerHTML;
            } else {
                htmlString = this.parent.getSelectedHtml();
            }
        } else {
            const length: number = this.assistView.prompts.length;
            htmlString = this.assistView.prompts[length - 2].response; // Since executing a prompt adds a item to the prompts array to get last response -2 is needed.
        }
        const textContent: string = (this.parent.createElement('div', { innerHTML: htmlString}) as HTMLElement).textContent;
        const promptEventArgs: AIAssistantPromptRequestArgs = {
            html: htmlString,
            text: textContent,
            cancel: args.cancel,
            responseToolbarItems: args.responseToolbarItems,
            prompt: args.prompt,
            promptSuggestions: args.promptSuggestions
        };
        this.parent.trigger('aiAssistantPromptRequest', promptEventArgs, (eventArgs: AIAssistantPromptRequestArgs) => {
            if (eventArgs.cancel) {
                args.cancel = true;
            } else {
                args.cancel = false;
            }
        });
    }

    private streamResponse(response: string, isFinalUpdate: boolean): void {
        this.lastResponse = response;
        const htmlResponse: string = this.parseMarkdown(this.lastResponse);
        this.assistView.addPromptResponse(htmlResponse, isFinalUpdate);
        this.assistView.scrollToBottom();
        // Simulate delay using setTimeout without await
        setTimeout(() => {
            // This block executes after 50ms
        }, this.parent.element.dataset.rteUnitTesting === 'true' ? 0 : 50);
    }



    private parseMarkdown(text: string): string {
        return MarkdownConverter.toHtml(text) as string;
    }


    private handleStopResponse(args: AIAssistantStopRespondingArgs): void {
        this.parent.trigger('aiAssistantStopRespondingClick', args);
        this.lastResponse = '';
        this.queryPopup.element.classList.remove('processing');
    }

    public hideAIQueryPopup(): void {
        if (!isNOU(this.queryPopup) && !isNOU(this.queryPopup.element) && this.queryPopup.element.classList.contains('e-popup-open')) {
            const eventArgs: BeforePopupOpenCloseEventArgs = {
                cancel: false,
                popup: this.queryPopup,
                element: this.queryPopup.element,
                type: 'AIAssistant',
                originalEvent: !isNOU(event) ? event : undefined
            };
            this.triggerBeforePopupOpenCloseEvent('beforePopupClose', eventArgs, eventArgs, () => {
                this.historyDropDownButton.destroy();
                this.menu.destroy();
                this.menuDropDown.destroy();
                this.addEditorPromptCollection(this.assistView.prompts);
                this.assistView.prompts = [];
                this.assistView.dataBind();
                this.toolTip.close();
                this.queryPopup.hide();
                this.element = detach(this.element);
                this.updateAIQueryButtonActiveState();
            });
        }
    }

    private addEditorPromptCollection(prompts: PromptModel[]): void {
        if (this.allPrompts.length > this.parent.aiAssistantSettings.maxPromptHistory) {
            const itemsToRemove: number = this.allPrompts.length - this.parent.aiAssistantSettings.maxPromptHistory;
            this.allPrompts.splice(0, itemsToRemove);
        }
        for (let i: number = 0; i < prompts.length; i++) {
            this.allPrompts.push(prompts[i as number]);
        }
    }

    public clearAIPromptHistory(): void {
        this.allPrompts = [];
    }

    private updateCurrentSelection(): void{
        if (!isNOU(this.currentSelection)) {
            this.currentSelection = this.currentSelection.save(this.parent.getRange(), this.parent.inputElement.ownerDocument);
        }
    }

    private getModuleName(): string {
        return 'aiAssistant';
    }
    private removeEventListener(): void {
        this.parent.off(events.onAIAssistant, this.onToolbarClick);
        this.parent.off(events.menuItemselected, this.onMenuItemSelect);
        this.parent.off(events.menuBeforeOpen, this.beforeMenuOpen);
        this.parent.off(events.menuBeforeClose, this.beforeMenuClose);
        this.parent.off(events.editAreaClick, this.updateCurrentSelection);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.windowResize, this.refreshPosition);
        this.parent.off(events.scroll, this.refreshPosition);
        this.parent.off(events.contentscroll, this.refreshPosition);
        this.parent.off(events.afterKeyDown, this.refreshPosition);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.bindOnEnd, this.bindOnEnd);
        this.parent.off(events.bindCssClass, this.updateCssClass);
        this.parent.off(events.hidePopup, this.hideAIQueryPopup);
    }

    private refreshPosition(): void {
        if (!this.dragged && this.queryPopup && !this.queryPopup.isDestroyed && this.queryPopup.element &&
            this.queryPopup.element.classList.contains('e-popup-open')) {
            this.queryPopup.setProperties({ offsetY: this.getQueryPopupOffsetY() });
            this.queryPopup.dataBind();
            this.queryPopup.refreshPosition();
            const footer: HTMLElement = this.assistView.element.querySelector('.e-footer');
            this.historyDropDownButton.setProperties({ popupWidth : footer.getBoundingClientRect().width});
            this.historyDropDownButton.dataBind();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.removeEventListener();
        if (this.isRendered) {
            this.draggable.destroy();
            if (!isNOU(this.historyDropDownButton)) {// Only history drop down button is rendered after the show method
                this.historyDropDownButton.destroy(); // Edge case where the cancel argument of beforePopupOpen is set to false does not render the dropdown.
            }
            this.menu.destroy();
            this.menuDropDown.destroy();
            this.queryPopup.destroy();
            this.toolTip.destroy();
            this.assistView.destroy();
            document.removeEventListener('keydown', this.handlePopupEscapeBoundFn);
            detach(this.element);
        }
        this.allPrompts = [];
        this.isDestroyed = true;
        this.isRendered = false;
    }

    public getPromptHistory(): PromptModel[] {
        return this.allPrompts;
    }

    public executePrompt(prompt: string): void {
        this.assistView.executePrompt(prompt);
    }

    public scrollToBottom(): void {
        this.assistView.scrollToBottom();
    }

    public addPromptResponse(outputResponse: string | Object, isFinalUpdate?: boolean): void {
        if (isFinalUpdate) {
            const htmlResponse: string = this.parseMarkdown(this.lastResponse);
            this.assistView.addPromptResponse(htmlResponse, true);
            this.assistView.scrollToBottom();
            this.lastResponse = '';
            this.queryPopup.element.classList.remove('processing');
        } else {
            this.streamResponse(outputResponse as string, isFinalUpdate);
        }
    }

    private updateHistoryButtonStatus(): void {
        const items: ItemModel[] = this.getHistoryDropDownItem();
        this.historyDropDownButton.items = this.getHistoryDropDownItem();
        this.historyDropDownButton.disabled = items.length === 1 && items[0].text === 'No Prompts found' ? true : false;
        this.historyDropDownButton.dataBind();
        if (this.historyDropDownButton.disabled) {
            this.historyIconButton.classList.add('e-rte-icon-btn-disabled');
            this.enableDisableHistoryToolbarButton(true);
        } else {
            this.historyIconButton.classList.remove('e-rte-icon-btn-disabled');
            this.enableDisableHistoryToolbarButton(false);
        }
    }

    public showQueryPopup(event?: Event): void {
        if (!this.isRendered) {
            this.render();
            document.body.appendChild(this.element);
            this.queryPopup.appendTo(this.element);
            this.draggable = new Draggable(this.queryPopup.element, {
                clone: false,
                isDragScroll: false,
                handle: '.e-rte-aiquery-popup .e-view-header .e-toolbar-items .e-toolbar-item button',
                dragStop: () => {
                    this.dragged = true;
                }
            });
            document.addEventListener('keydown', this.handlePopupEscapeBoundFn);
            this.isRendered = true;
        } else {
            document.body.appendChild(this.element);
        }
        if (this.parent.quickToolbarModule) {
            this.parent.quickToolbarModule.hideQuickToolbars();
        }
        this.renderMenuButton();
        this.dragged = false;
        if (!isNOU(this.queryPopup) && this.queryPopup.element.classList.contains('e-popup-close')) {
            this.queryPopup.setProperties({ offsetY: this.getQueryPopupOffsetY() });
            this.queryPopup.dataBind();
            const eventArgs: BeforePopupOpenCloseEventArgs = {
                cancel: false,
                popup: this.queryPopup,
                element: this.queryPopup.element,
                type: 'AIAssistant',
                originalEvent: !isNOU(event) ? event : undefined
            };
            this.triggerBeforePopupOpenCloseEvent('beforePopupOpen', eventArgs, eventArgs, () => {
                this.queryPopup.show();
                this.queryPopup.refreshPosition();
                this.renderHistoryDropDownButton();
            });
        }
    }

    private handlePopupEscape(args: KeyboardEvent): void {
        if (args.key === 'Escape') {
            this.hideAIQueryPopup();
        }
    }

    private renderMenuButton(): void {
        const toolbar: HTMLElement = this.assistView.element.querySelector('.e-view-header .e-toolbar');
        const menuName: string = 'aicommands';
        const rootElement: HTMLButtonElement = select('#' + this.parent.getID() + '_QueryPopupCommandsDropDown', toolbar);
        const ulElement: HTMLUListElement = this.parent.createElement('ul', { id: this.parent.getID() + '_QueryPopupCommandsMenu'});
        rootElement.parentElement.appendChild(ulElement);
        const argument: IMenuRenderArgs = {
            dropDownItems: {
                content: 'AI Commands',
                cssClass: classes.CLS_DROPDOWN_POPUP + ' ' + classes.CLS_DROPDOWN_ITEMS + ' ' + classes.CLS_AI_COMMANDS_TBAR_BTN + ' ' +  classes.CLS_DROPDOWN_MENU,
                target: ulElement
            },
            menuItems: {
                items: this.parent.aiAssistantSettings.commands
            },
            name: menuName,
            containerType: 'Toolbar',
            toolbarElement: toolbar,
            dropDownRoot: rootElement,
            menuRoot: ulElement
        };
        const { menu, dropDownButton } = this.rendererFactory.getRenderer(RenderType.Toolbar).renderMenu(argument);
        this.menu = menu;
        this.menuDropDown = dropDownButton;
        dropDownButton.iconCss = 'e-settings e-icons';
        dropDownButton.setProperties({ iconCss : 'e-settings e-icons', content: '' });
    }

    private renderHistoryDropDownButton() : void {
        const footer: HTMLElement = this.assistView.element.querySelector('.e-footer');
        this.historyIconButton = footer.querySelector('.e-icons.e-history');
        const dropdownMenuRoot: HTMLElement = this.parent.createElement('div', { id : this.assistView.element.id + '_DropDown_Menu' });
        dropdownMenuRoot.style.visibility = 'hidden';
        dropdownMenuRoot.style.padding = '0';
        dropdownMenuRoot.style.border = '0';
        footer.appendChild(dropdownMenuRoot);
        const items: ItemModel[] = this.getHistoryDropDownItem();
        const dropDownButton: DropDownButton = new DropDownButton({
            cssClass: 'e-caret-hide e-rte-ai-assist-history',
            disabled: items.length === 1 && items[0].text === 'No Prompts found.' ? true : false,
            popupWidth: footer.getBoundingClientRect().width,
            items: items,
            select: (args: MenuEventArgs) => {
                this.assistView.prompt = args.item.text;
            }
        }, dropdownMenuRoot as HTMLButtonElement);
        if (this.parent.element.dataset.rteUnitTesting === 'true') {
            dropDownButton.animationSettings = { effect: 'None', duration: 0 };
        }
        if (items.length === 1 && items[0].text === 'No Prompts found.') {
            this.historyIconButton.classList.add('e-rte-icon-btn-disabled');
            this.enableDisableHistoryToolbarButton(true);
        } else {
            this.historyIconButton.classList.remove('e-rte-icon-btn-disabled');
            this.enableDisableHistoryToolbarButton(false);
        }
        this.historyDropDownButton = dropDownButton;
    }

    private handleHistoryButtonClick(): void {
        if (!this.historyIconButton.classList.contains('e-rte-icon-btn-disabled')) {
            this.historyDropDownButton.toggle();
        }
    }

    private getToolbarItems(items : string[] | IAIAssistantToolbarItem[], type: AssistantToolbarType): IAIAssistantToolbarItem[] {
        const finalITems: IAIAssistantToolbarItem[] = [] as IAIAssistantToolbarItem[];
        for (const item of items) {
            if (typeof item === 'string') {
                let defaultItem: IAIAssistantToolbarItem;
                switch (type) {
                case 'Header':
                    defaultItem = this.getHeaderToolbarItem(item as AssitantHeaderToolbarItems);
                    break;
                case 'Prompt':
                    defaultItem = this.getPromptToolbarItem(item as AssistantPromptToolbarItems);
                    break;
                case 'Response':
                    defaultItem = this.getReponseToolbarItem(item as AssistantResponseToolbarItems);
                    break;
                }
                finalITems.push(defaultItem);
            } else {
                finalITems.push(item);
            }
        }
        return finalITems;
    }

    private getHeaderToolbarItem(item: AssitantHeaderToolbarItems): IAIAssistantToolbarItem {
        let value: IAIAssistantToolbarItem;
        switch (item) {
        case 'AIcommands':
            value = { iconCss: 'e-icons e-ai-chat', align: 'Right', tooltip: this.L10n.getConstant('aicommands'), command: 'Header', subCommand: 'Close' , template: `<button id="${this.parent.getID()}_QueryPopupCommandsDropDown" tabindex="0" data-tabindex="-1"></button>`};
            break;
        case 'Close':
            value = { iconCss: 'e-icons e-close', align: 'Right', tooltip: this.L10n.getConstant('aiAssistantToolbarItemClose'), command: 'Header', subCommand: 'Close' };
            break;
        case 'Clear':
            value = { iconCss: 'e-icons e-trash', align: 'Right', tooltip: this.L10n.getConstant('aiAssistantToolbarItemClear'), command: 'Header', subCommand: 'Clear' };
            break;
        }
        return value;
    }

    private getPromptToolbarItem(item: AssistantPromptToolbarItems): IAIAssistantToolbarItem {
        let value: IAIAssistantToolbarItem;
        switch (item) {
        case 'Copy':
            value = { iconCss: 'e-icons e-assist-copy', tooltip: this.L10n.getConstant('aiAssistantToolbarItemCopy'), command: 'Prompt', subCommand: 'Copy' };
            break;
        case 'Edit':
            value = { iconCss: 'e-icons e-assist-edit', tooltip: this.L10n.getConstant('aiAssistantToolbarItemEdit'), command: 'Prompt', subCommand: 'Edit' };
            break;
        }
        return value;
    }

    private getReponseToolbarItem(item: AssistantResponseToolbarItems): IAIAssistantToolbarItem {
        let value: IAIAssistantToolbarItem;
        switch (item) {
        case '|':
            value = { type: 'Separator', command: 'Response', subCommand: 'Separator' };
            break;
        case 'Copy':
            value = { iconCss: 'e-icons e-assist-copy' , tooltip: this.L10n.getConstant('aiAssistantToolbarItemCopy') , command : 'Response', subCommand: 'Copy'};
            break;
        case 'Insert':
            value = { iconCss: 'e-icons e-check', text: 'Insert', tooltip: this.L10n.getConstant('aiAssistantToolbarItemInsert') , command : 'Response', subCommand: 'Insert'};
            break;
        case 'Regenerate':
            value = { iconCss: 'e-icons e-repeat' , tooltip: this.L10n.getConstant('aiAssistantToolbarItemRegenerate') , command : 'Response', subCommand: 'Regenerate'};
            break;
        }
        return value;
    }

    private getQueryPopupOffsetY(): number {
        let offsetY: number = 0;
        if (this.parent.userAgentData.isMobileDevice()) {
            return offsetY;
        }
        if (this.parent.toolbarSettings.enableFloating && this.parent.toolbarSettings.position === 'Top' && !this.parent.inlineMode.enable) {
            const toolbarElemRect: ClientRect = this.parent.getToolbarElement().getBoundingClientRect();
            if (toolbarElemRect.top === 0) {
                offsetY = window.pageYOffset - this.parent.element.offsetTop + toolbarElemRect.height + 11;
            } else {
                offsetY = toolbarElemRect.height + 11; // WHen toolbar visible additional 1 px from border is added to offsetY.
            }
        } else {
            const inputElementRect: ClientRect = this.parent.iframeSettings.enable ?
                this.parent.contentModule.getPanel().getBoundingClientRect() :
                this.parent.inputElement.getBoundingClientRect();
            if (this.parent.toolbarSettings.position === 'Bottom' && !this.parent.inlineMode.enable) {
                if (inputElementRect.top <= 0) {
                    offsetY = window.pageYOffset - this.parent.element.offsetTop + 11; // WHen toolbar visible additional 1 px from border is added to offsetY.
                } else {
                    offsetY = 10;
                }
            } else {
                if (!this.parent.inlineMode.enable) {
                    const toolbarElemRect: ClientRect = this.parent.getToolbarElement().getBoundingClientRect();
                    if (toolbarElemRect.top < 0) {
                        offsetY = window.pageYOffset - this.parent.element.offsetTop + 10;
                    } else {
                        offsetY = toolbarElemRect.height + 11;
                    }
                }
            }
        }
        return offsetY;
    }

    private onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        for (const prop of Object.keys(e.newProp)) {
            switch (prop) {
            case 'aiAssistantSettings': {
                switch (Object.keys(e.newProp.aiAssistantSettings)[0]) {
                case 'popupMaxHeight':
                    this.queryPopup.element.style.maxHeight = formatUnit(this.parent.aiAssistantSettings.popupMaxHeight);
                    break;
                case 'popupWidth':
                    this.queryPopup.width = e.newProp.aiAssistantSettings.popupWidth;
                    break;
                case 'placeholder':
                    this.assistView.promptPlaceholder = e.newProp.aiAssistantSettings.placeholder;
                    this.assistView.dataBind();
                    break;
                case 'prompts':
                    this.assistView.prompts = e.newProp.aiAssistantSettings.prompts;
                    this.assistView.dataBind();
                    break;
                case 'suggestions':
                    this.assistView.promptSuggestions = e.newProp.aiAssistantSettings.suggestions;
                    this.assistView.dataBind();
                    break;
                case 'bannerTemplate':
                    this.assistView.bannerTemplate = e.newProp.aiAssistantSettings.bannerTemplate;
                    this.assistView.dataBind();
                    break;
                }
                break;
            }
            case 'enablePersistence':
                if (this.assistView) {
                    this.assistView.enablePersistence = e.newProp.enablePersistence;
                    this.assistView.dataBind();
                }
                break;
            }
        }
    }

    private getHistoryDropDownItem(): ItemModel[] {
        const finalItems: ItemModel[] = [];
        if (this.allPrompts.length === 0) {
            finalItems.push({ text : 'No Prompts found.'});
            return finalItems;
        }
        for (let i: number = 0; i < this.allPrompts.length; i++) {
            const currentPrompt: PromptModel = this.allPrompts[i as number];
            finalItems.push({ text: currentPrompt.prompt });
        }
        return finalItems;
    }

    private renderTooltip(): void {
        this.toolTip = new Tooltip({
            target: '#' + this.parent.getID() + '_RTE_Smart_AI_Query_AssistView [title]',
            showTipPointer: true,
            openDelay: 400,
            opensOn: 'Hover',
            cssClass: this.parent.getCssClass(),
            windowCollision: true,
            position: 'BottomCenter'
        });
        this.toolTip.appendTo(this.assistView.element);
    }

    private setEditAreaRangeAndFocus(): void {
        const range: Range = new Range();
        range.setStart(this.assistViewEditArea, 0);
        range.collapse(true);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);
    }

    private bindOnEnd(): void {
        this.parent.formatter.editorManager.aiAssistantActionObj = new AIAssistantActions(this.parent.formatter.editorManager);
    }

    private handleInsertContent(response: string): void {
        this.currentSelection.restore();
        const actionBeginArgs: ActionBeginEventArgs = {
            requestType: 'AIAssistant',
            name: 'InsertResponseContent',
            item: {
                command: 'AIAssistant',
                subCommand: 'InsertResponseContent',
                value: this.parent.htmlEditorModule.sanitizeHelper(response)
            }
        };
        this.parent.formatter.process(this.parent, actionBeginArgs, null, {
            selection: this.currentSelection
        });
    }

    private beforeMenuOpen(args: MenuOpenCloseEventArgs): void {
        const isAIAssitant: boolean = args.element.classList.contains('e-rte-aicommands-menu') || !isNOU(args.element.closest('.e-rte-aicommands-menu'));
        if (!isAIAssitant) {
            return;
        }
        const eventArgs: BeforePopupOpenCloseEventArgs = {
            cancel: false,
            element: args.element,
            type: 'Menu',
            originalEvent: args.event
        };
        this.triggerBeforePopupOpenCloseEvent('beforePopupOpen', args, eventArgs);
    }

    private beforeMenuClose(args: MenuOpenCloseEventArgs): void {
        const isAIAssitant: boolean = args.element.classList.contains('e-rte-aicommands-menu') || !isNOU(args.element.closest('.e-rte-aicommands-menu'));
        if (!isAIAssitant) {
            return;
        }
        const eventArgs: BeforePopupOpenCloseEventArgs = {
            cancel: false,
            element: args.element,
            type: 'Menu',
            originalEvent: args.event
        };
        this.triggerBeforePopupOpenCloseEvent('beforePopupClose', args, eventArgs);
    }

    private triggerBeforePopupOpenCloseEvent(
        eventName: string, originalArgs: MenuOpenCloseEventArgs | BeforePopupOpenCloseEventArgs,
        eventArgs: BeforePopupOpenCloseEventArgs, callBack?: Function): void {
        this.parent.trigger(eventName, eventArgs, (updatedArgs: BeforePopupOpenCloseEventArgs) => {
            if (!updatedArgs.cancel) {
                if (!isNOU(callBack)) {
                    callBack();
                }
            } else {
                originalArgs.cancel = true;
            }
        });
    }

    private updateCssClass(): void {
        if (this.assistView) {
            this.assistView.cssClass = this.parent.getCssClass();
        }
        if (this.element) {
            this.element.className = classes.CLS_RTE_ELEMENTS + ' e-rte-aiquery-popup e-popup-close ' + this.parent.getCssClass();
        }
    }

    private enableDisableHistoryToolbarButton(enable: boolean): void {
        const footerToolbar: HTMLElement = this.assistView.element.querySelector('.e-footer .e-toolbar');
        const toolbar: Toolbar = getComponent(footerToolbar, 'toolbar');
        toolbar.items[0].disabled = enable;
    }
}

type AssistantAction = 'Toolbar' | 'Menu' | 'QuickToolbar' | 'API';
