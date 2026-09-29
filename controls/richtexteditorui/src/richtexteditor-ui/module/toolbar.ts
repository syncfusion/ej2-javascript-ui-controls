/**
 * Toolbar module class.
 *
 * Implements IToolbar and integrates the BaseToolbar into the RichTextEditor.
 * This class is loaded via EJ2's module injection system (requiredModules).
 */

import { EditorToolbar } from '../../base/renderer/editor-toolbar';
import { EditorCommandExecutor } from '../../base/renderer/editor-integration';
import { IToolbar } from '../../base/toolbar-interface';
import { ToolbarType, ToolbarPosition, ToolbarItemUpdate, DEFAULT_TOOLBAR_ITEMS, ToolbarItem } from '../model/toolbar.types';
import { BaseModule } from './base-module';
import { RichTextEditorUIModel } from '../richtexteditor-ui-model';
import { RichTextEditorUI } from '../richtexteditor-ui';
import { getComponent, L10n } from '@syncfusion/ej2-base';
import { CLS_TB_BOTTOM, CLS_TB_FLOAT, CLS_TB_TOP, CLS_TB_WRAP, CLS_TOOLBAR } from '../../base/classes';
import { EditorCommandName, IEditorController } from '../../controller/interface';
import { ToolbarStatusUpdater } from '../../base/renderer/toolbar-status-updater';
import { ActionItemModel, ToolbarRenderer } from '../../base/renderer/toolbar-renderer';
import { EditorCore } from '../../core/base/editor-core';
import * as events from '../../common/constant';
import { DropDownButton, SplitButton} from '@syncfusion/ej2-splitbuttons';
import { ListSettingsModel } from '../model/list-settings-model';
import { BulletFormatList, BulletFormatListItem, BulletFormatLists, NumberFormatList, NumberFormatListItem, NumberFormatLists } from '../model/list-settings';
import { EditorKeyBindingAction } from '../model/key-bindings';
import { KeyBindingRegistry } from './keybindings';


/**
 * Toolbar integration for RichTextEditor.
 *
 * Handles toolbar rendering, updates, and cleanup.
 */
export class ToolbarModule extends BaseModule implements IToolbar {
    public getModuleName(): string {
        return 'toolbar';
    }
    protected addEventListener(): void {
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
    }
    protected removeEventListener(): void {
        this.parent.off(events.modelChanged, this.onPropertyChanged);
    }

    /** The main toolbar instance */
    public mainToolbar: EditorToolbar;

    /** The parent RTE instance */
    public parent: RichTextEditorUI;

    /** The toolbar host element (the actual <div> rendered as the toolbar root). */
    public element: HTMLElement;

    /** Wrapper element that contains the toolbar host and supports positioning/floating */
    public wrapperElement: HTMLElement;

    /** Toolbar status updater instance for keeping toolbar in sync with editor state */
    public toolbarStatusUpdater: ToolbarStatusUpdater | null;

    constructor(parent: RichTextEditorUI, locale: L10n) {
        super(parent, parent.localeObj);
        this.parent = parent;
        parent.toolbar = this;
        parent.toolbarModule = this;
        this.element = null;
        this.toolbarStatusUpdater = null;
        this.render();
    }

    /*
     * Renders the toolbar into the parent element.
     */
    public render(): void {
        const toolbarEl: HTMLElement = this.getOrCreateToolbarElement();
        this.mainToolbar = new EditorToolbar();
        /* Refresh callback for re-syncing toolbar status. */
        const refresh: () => void = (): void => {
            if (this.toolbarStatusUpdater) {
                this.toolbarStatusUpdater.updateToolbarStatus();
            }
        };
        this.mainToolbar.render({
            element: toolbarEl,
            items: (this.parent.toolbarSettings && this.parent.toolbarSettings.items) ?
                this.parent.toolbarSettings.items : DEFAULT_TOOLBAR_ITEMS as ToolbarItem[],
            type: this.parent.toolbarSettings ? this.parent.toolbarSettings.type : 'Scrollable',
            controller: this.buildCommandExecutor(),
            rteInstance: this.parent,
            localeObj: this.parent.localeObj,
            statusRefresh: refresh,
            shortcuts: this.getToolbarShortcuts()
        });

        // Initialize toolbar status updater once we have both renderer and editor core
        const editorCore: EditorCore | null = this.getEditorCore();
        if (editorCore && this.mainToolbar) {
            const renderer: ToolbarRenderer | null = this.mainToolbar.getRenderer();
            if (renderer) {
                this.toolbarStatusUpdater = new ToolbarStatusUpdater(editorCore, renderer);
                // Sync popup beforeOpen events with toolbar status updates.
                renderer.setPopupSync((kind: string, popup: HTMLElement | null | undefined): void => {
                    if (!this.toolbarStatusUpdater) {
                        return;
                    }
                    this.toolbarStatusUpdater.onDropdownBeforeOpen(kind, popup);
                });
            }
        }

        // Apply initial type/position/floating CSS state on wrapper
        if (this.wrapperElement && this.parent.toolbarSettings) {
            this.applyWrapperPosition(this.parent.toolbarSettings.position);
            this.applyWrapperFloating(this.parent.toolbarSettings.enableFloating, this.parent.toolbarSettings.floatingOffset);
        }
    }

    private getToolbarShortcuts(): Readonly<Record<string, string>> {
        const commandNames: Partial<Record<EditorKeyBindingAction, string>> = {
            undo: 'undo', redo: 'redo', bold: 'bold', italic: 'italic', underline: 'underline',
            strikethrough: 'strikethrough', superscript: 'superscript', subscript: 'subscript',
            indents: 'indent', outdents: 'outdent', 'clear-format': 'clearFormat',
            'ordered-list': 'numberedList', 'unordered-list': 'bulletList', inlinecode: 'inlineCode',
            'code-block': 'codeBlock', link: 'createLink', image: 'image', table: 'table'
        };
        const shortcuts: Record<string, string> = {};
        for (const action of Object.keys(commandNames) as EditorKeyBindingAction[]) {
            const binding: string | undefined = KeyBindingRegistry.getResolvedKeyBinding(this.parent, action);
            const command: string | undefined = commandNames[action as EditorKeyBindingAction];
            if (binding && command) {
                shortcuts[command as EditorKeyBindingAction] = binding;
            }
        }
        return shortcuts;
    }

    /*
     * Updates the toolbar layout type.
     * In this version, dynamic re-layout is limited.
     *
     * @param type - The new toolbar type
     */
    public updateType(type: ToolbarType): void {
        // Recreate toolbar to ensure layout applied
        if (this.mainToolbar) {
            this.mainToolbar.destroy();
            this.mainToolbar = null;
            this.render();
            this.refreshOverflow();
        }
    }

    /*
     * Updates the toolbar position.
     * In this version, position change at runtime is limited.
     *
     * @param position - The new toolbar position
     */
    public updatePosition(position: ToolbarPosition): void {
        // Move wrapper element according to requested position
        this.applyWrapperPosition(position);
        // Recreate toolbar to ensure underlying EJ2 toolbar adjusts if needed
        if (this.mainToolbar) {
            this.mainToolbar.destroy();
            this.mainToolbar = null;
            this.render();
            this.refreshOverflow();
        }
    }

    /*
     * Updates floating behavior.
     * Per spec: floating physics are deferred — always reports diagnostic.
     *
     * @param enableFloating - Whether to enable floating
     * @param floatingOffset - Floating pixel offset
     */
    public updateFloating(enableFloating: boolean, floatingOffset: number): void {
        // Apply floating flags on wrapper
        this.applyWrapperFloating(enableFloating, floatingOffset);
        // Recreate toolbar to apply any layout differences
        if (this.mainToolbar) {
            this.mainToolbar.destroy();
            this.mainToolbar = null;
            this.render();
            this.refreshOverflow();
        }
    }

    /**
     * Rebuilds toolbar labels and tooltips after the parent locale changes.
     *
     * @returns {void}
     */
    public updateLocale(): void {
        if (this.mainToolbar) {
            this.mainToolbar.destroy();
            this.mainToolbar = null;
            this.render();
            this.refreshOverflow();
        }
    }

    /*
     * Updates toolbar items via the BaseToolbar dispatch layer.
     * Fully delegated — not a stub.
     *
     * @param updates - Array of discriminated-union update operations
     */
    public updateToolbarItems(updates: ToolbarItemUpdate[]): void {
        if (this.mainToolbar) {
            this.mainToolbar.updateItems(updates);
        }
    }

    // Refresh toolbar
    public refreshOverflow(): void {
        if (this.mainToolbar) {
            this.mainToolbar.refreshOverflow();
        }
    }

    /*
     * Destroys the toolbar module and all sub-modules.
     */
    public destroyModule(): void {
        if (this.mainToolbar) {
            this.mainToolbar.destroy();
            this.mainToolbar = null;
        }
        this.element = null;
        this.wrapperElement = null;
        this.toolbarStatusUpdater = null;
        this.removeEventListener();
    }

    // this.toolbarStatusUpdater.applyFormattingState(state);

    /*
     * Returns the attached EditorCore, if available.
     *
     * @returns {EditorCore | null}
     * @private
     */
    private getEditorCore(): EditorCore | null {
        const host: { baseEditorCore?: EditorCore } = this.parent as unknown as { baseEditorCore?: EditorCore };
        const candidate: EditorCore | undefined = host.baseEditorCore;
        if (!candidate) {
            return null;
        }
        return candidate;
    }

    /*
     * Handles model property changes from the RichTextEditor component.
     * Iterates format sub-properties and updates toolbar controls via setProperties().
     *
     * @param prop - The property name that changed
     * @param e - Change notification object containing newProperties and oldProperties
     */
    private onPropertyChanged(e: { newProp: RichTextEditorUIModel; oldProp?: RichTextEditorUIModel }): void {
        for (const prop of Object.keys(e.newProp)) {
            switch (prop) {
            case 'format':
                if (this.mainToolbar) {
                    const formatDropDownButton: HTMLElement = this.element.querySelector('#' + this.parent.element.id + '_toolbar_Formats_btn');
                    const formatDropDown: DropDownButton = getComponent(formatDropDownButton, 'dropdown-btn');
                    if (formatDropDown && typeof formatDropDown.setProperties === 'function') {
                        for (const format of Object.keys((e.newProp as RichTextEditorUIModel).format)) {
                            switch (format) {
                            case 'width': {
                                formatDropDown.setProperties({ width: (e.newProp as RichTextEditorUIModel).format.width });
                                break;
                            }
                            case 'items': {
                                formatDropDown.setProperties({ items: (e.newProp as RichTextEditorUIModel).format.items });
                                break;
                            }
                            }
                        }
                    }
                }
                break;
            case 'fontSize':
                if (this.mainToolbar) {
                    const fontSizeDropDownButton: HTMLElement = this.element.querySelector('#' + this.parent.element.id + '_toolbar_FontSize_btn');
                    const fontSizeDropDown: DropDownButton = getComponent(fontSizeDropDownButton, 'dropdown-btn');
                    if (fontSizeDropDown && typeof fontSizeDropDown.setProperties === 'function') {
                        for (const fontSize of Object.keys((e.newProp as RichTextEditorUIModel).fontSize)) {
                            switch (fontSize) {
                            case 'width': {
                                fontSizeDropDown.setProperties({ width: (e.newProp as RichTextEditorUIModel).fontSize.width });
                                break;
                            }
                            case 'items': {
                                fontSizeDropDown.setProperties({ items: (e.newProp as RichTextEditorUIModel).fontSize.items });
                                break;
                            }
                            }
                        }
                    }
                }
                break;
            case 'fontFamily':
                if (this.mainToolbar) {
                    const fontFamilyDropDownButton: HTMLElement = this.element.querySelector('#' + this.parent.element.id + '_toolbar_FontName_btn');
                    const fontFamilyDropDown: DropDownButton = getComponent(fontFamilyDropDownButton, 'dropdown-btn');
                    if (fontFamilyDropDown && typeof fontFamilyDropDown.setProperties === 'function') {
                        for (const fontFamily of Object.keys((e.newProp as RichTextEditorUIModel).fontFamily)) {
                            switch (fontFamily) {
                            case 'width': {
                                fontFamilyDropDown.setProperties({ width: (e.newProp as RichTextEditorUIModel).fontFamily.width });
                                break;
                            }
                            case 'items': {
                                fontFamilyDropDown.setProperties({ items: (e.newProp as RichTextEditorUIModel).fontFamily.items });
                                break;
                            }
                            }
                        }
                    }
                }
                break;
            case 'fontColor':
                if (this.mainToolbar) {
                    const renderer: ToolbarRenderer | null = this.mainToolbar.getRenderer();
                    if (renderer) {
                        renderer.updateColor(
                            'FontColor',
                            (e.newProp as RichTextEditorUIModel).fontColor,
                            e.oldProp?.fontColor
                        );
                    }
                }
                break;
            case 'backgroundColor':
                if (this.mainToolbar) {
                    const renderer: ToolbarRenderer | null = this.mainToolbar.getRenderer();
                    if (renderer) {
                        renderer.updateColor(
                            'BackgroundColor',
                            (e.newProp as RichTextEditorUIModel).backgroundColor,
                            e.oldProp?.backgroundColor
                        );
                    }
                }
                break;
            case 'listSettings':
                if (this.mainToolbar) {
                    const listSettings: ListSettingsModel = (e.newProp as RichTextEditorUIModel).listSettings;
                    const numberButton: HTMLElement = this.element.querySelector('#' + this.parent.element.id + '_toolbar_NumberFormatList_btn');
                    const bulletButton: HTMLElement = this.element.querySelector('#' + this.parent.element.id + '_toolbar_BulletFormatList_btn');
                    const numberSplitButton: SplitButton = getComponent(numberButton, 'split-btn');
                    const bulletSplitButton: SplitButton = getComponent(bulletButton, 'split-btn');
                    if (numberSplitButton && listSettings?.numberFormatListItems) {
                        numberSplitButton.setProperties({
                            items: listSettings.numberFormatListItems.map((listItem: NumberFormatListItem) => {
                                if (typeof listItem === 'string') {
                                    return NumberFormatLists.find(
                                        (item: NumberFormatList) =>
                                            item.listType === listItem
                                    ) as unknown as ActionItemModel;
                                }
                                return {
                                    id: listItem.text,
                                    text: listItem.text,
                                    command: 'setListStyle',
                                    value: { listType: listItem.listType}
                                } as ActionItemModel;
                            })
                        });
                    }
                    if (bulletSplitButton && listSettings?.bulletFormatListItems) {
                        bulletSplitButton.setProperties({
                            items: listSettings.bulletFormatListItems.map((listItem: BulletFormatListItem) => {
                                if (typeof listItem === 'string') {
                                    return BulletFormatLists.find(
                                        (item: BulletFormatList) =>
                                            item.listType === listItem
                                    ) as unknown as ActionItemModel;
                                }
                                return {
                                    id: listItem.text,
                                    text: listItem.text,
                                    command: 'setListStyle',
                                    value: { listType: listItem.listType}
                                } as ActionItemModel;
                            })
                        });
                    }
                }
                break;
            }
        }
    }

    /*
     * Finds or creates the toolbar host element inside the parent's element.
     */
    private getOrCreateToolbarElement(): HTMLElement {
        // Ensure we have a wrapper element that can be positioned and receive floating behavior
        let wrapper: HTMLElement = this.parent.element.querySelector(CLS_TB_WRAP) as HTMLElement;
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = CLS_TB_WRAP;
            wrapper.id = this.parent.element.id + '_toolbar_wrapper';
            // Toolbar host inside wrapper
            const host: HTMLElement = document.createElement('div');
            host.className = CLS_TOOLBAR;
            wrapper.appendChild(host);
            // Default to insert at top
            (this.parent.element.firstChild as HTMLElement).prepend(wrapper);
        }
        this.wrapperElement = wrapper;
        const hostEl: HTMLElement = wrapper.querySelector('.' + CLS_TOOLBAR) as HTMLElement;
        this.element = hostEl;
        return hostEl;
    }

    /* Apply wrapper positioning (Top/Bottom) */
    private applyWrapperPosition(position: ToolbarPosition): void {
        if (!this.wrapperElement) { return; }
        this.wrapperElement.classList.remove(CLS_TB_TOP, CLS_TB_BOTTOM);
        if (position === 'Bottom') {
            //this.parent.element.appendChild(this.wrapperElement);
            this.wrapperElement.classList.add(CLS_TB_BOTTOM);
        } else {
            //this.parent.element.insertBefore(this.wrapperElement, this.parent.element.firstChild);
            this.wrapperElement.classList.add(CLS_TB_TOP);
        }
    }

    /* Apply floating enable/offset metadata on wrapper */
    private applyWrapperFloating(enable: boolean, offset: number): void {
        if (!this.wrapperElement) { return; }
        if (enable) {
            this.wrapperElement.style.top = offset + 'px';
            this.wrapperElement.classList.add(CLS_TB_FLOAT);
        } else {
            this.wrapperElement.style.top = '';
            this.wrapperElement.classList.remove(CLS_TB_FLOAT);
        }
    }

    /*
     * Builds a minimal EditorCommandExecutor from the parent's editor controller.
     * Returns a no-op executor if no controller is available (defensive).
     */
    private buildCommandExecutor(): EditorCommandExecutor {
        const parent: RichTextEditorUI = this.parent;
        if (parent.editorController && typeof parent.editorController.execute === 'function') {
            const controller: IEditorController = parent.editorController;
            // Wrap the controller to expose both execute() and process() methods
            return {
                execute: (command: EditorCommandName, value?: unknown) => {
                    controller.execute(command, value);
                },
                process: (
                    editorInstance: RichTextEditorUI,
                    action: string,
                    event?: MouseEvent | KeyboardEvent,
                    value?: unknown
                ) => {
                    controller.process(parent, { action }, event, value);
                }
            };
        }
        // Defensive no-op executor — used when no headless editor is connected
        return {
            execute: function (_command: string, _value?: unknown): void {
                // No-op until headless editor is connected
            },
            process: function (
                _editorInstance: RichTextEditorUI,
                _action: string,
                _event?: MouseEvent | KeyboardEvent,
                _value?: unknown
            ): void {
                // No-op until headless editor is connected
            }
        };
    }
}
