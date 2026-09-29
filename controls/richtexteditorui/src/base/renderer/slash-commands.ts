import { FieldSettingsModel, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { L10n, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../../richtexteditor-ui/richtexteditor-ui';
import { RichTextEditorUIModel } from '../../richtexteditor-ui/richtexteditor-ui-model';
import { SlashCommandItemSelectArgs, ISlashCommandItem } from '../../common/interface';
import { SlashCommandItems } from '../../common/types';
import { DialogType } from '../../common/enum';
import {
    defaultSlashCommandDataModel,
    injectableSlashCommandDataModel,
    ISlashCommandModel,
    IInjectableSlashCommandModel
} from '../../richtexteditor-ui/model/slash-command-settings';
import { slashCommandCommandsKey, defaultLocale } from '../../richtexteditor-ui/model/default-locale';
import * as events from '../../common/constant';
import { EditorMentionPopup, EditorMentionPopupModel } from './editor-mention-popup';
import { DocumentRoot, EditorNode, HeadlessEditor } from '@syncfusion/ej2-headless-editor';

/**
 * SlashCommand - renders a slash-command suggestion popup ('/' trigger) for the
 * editor, mirroring the RichTextEditor slash-menu feature. Typing '/' in the
 * editor surfaces a filtered list of predefined and custom commands; selecting
 * an item applies the corresponding formatting / insertion action.
 *
 * Built on top of the editor's `EditorMentionPopup` sub-component wrapper.
 */
export class SlashCommand {
    private parent: RichTextEditorUI;
    private L10n: L10n;
    public mentionPopup: EditorMentionPopup;
    private defaultItems: ISlashCommandModel[];
    private injectableItems: IInjectableSlashCommandModel[];
    private saveSelection: any;

    constructor(parent: RichTextEditorUI) {
        this.parent = parent;
        // The slash-command module maintains its own L10n instance using the
        // slash-command defaultLocale so the popup labels resolve correctly.
        this.L10n = new L10n('richtexteditor-ui', defaultLocale, this.parent.locale);
        this.defaultItems = defaultSlashCommandDataModel;
        this.injectableItems = injectableSlashCommandDataModel;
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
        this.parent.on(events.initialEnd, this.render, this);
    }

    private removeEventListener(): void {
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.off(events.modelChanged, this.onPropertyChanged);
            this.parent.off(events.destroy, this.removeEventListener);
            this.parent.off(events.initialEnd, this.render);
        }
    }

    private onPropertyChanged(e: { newProp: RichTextEditorUIModel }): void {
        if (!e.newProp || !e.newProp.slashCommandSettings) {
            return;
        }
        const changedSettings: { [key: string]: Object } = e.newProp.slashCommandSettings as unknown as { [key: string]: Object };
        for (const changedKey of Object.keys(changedSettings)) {
            switch (changedKey) {
            case 'enable':
                if ((changedSettings['enable'] as boolean) === false) {
                    this.removeEventListener();
                    this.destroy();
                } else if (!this.mentionPopup) {
                    this.render();
                }
                break;
            case 'items':
                if (this.mentionPopup) {
                    this.mentionPopup.setDataSource(this.getItems());
                }
                break;
            case 'popupHeight':
                if (this.mentionPopup) {
                    this.mentionPopup.setPopupHeight(changedSettings['popupHeight'] as string | number);
                }
                break;
            case 'popupWidth':
                if (this.mentionPopup) {
                    this.mentionPopup.setPopupWidth(changedSettings['popupWidth'] as string | number);
                }
                break;
            }
        }
    }

    public getModuleName(): string {
        return 'slashCommand';
    }

    public destroy(): void {
        if (this.mentionPopup) {
            this.mentionPopup.destroy();
            this.mentionPopup = null;
        }
        this.defaultItems = [];
        this.injectableItems = [];
    }

    private generateMentionModel(): EditorMentionPopupModel {
        const dataSource: { [key: string]: string | number | boolean | null }[] = this.getItems();
        const model: EditorMentionPopupModel = {
            mentionChar: '/',
            dataSource: dataSource,
            cssClass: 'e-slash-command e-rte-ui-elements',
            fields: { text: 'text', groupBy: 'type', iconCss: 'iconCss', value: 'description' },
            popupHeight: this.parent.slashCommandSettings.popupHeight,
            popupWidth: this.parent.slashCommandSettings.popupWidth,
            allowSpaces: true,
            itemTemplate: '${if(iconCss && description)}' +
                '<div class="e-rte-slash-command-item-content-description">' +
                '<div class="e-slash-command-icon"><div class="${iconCss}"></div></div> ' +
                '<div class="e-rte-slash-command-item-text-column">' +
                '<span class="e-rte-slash-command-item-text">${text}</span>' +
                '${if(description)}' +
                '<span class="e-rte-slash-command-item-description">${description}</span>' +
                '${/if}' +
                '</div>' +
                '</div>' +
                '${else}' +
                '${if(iconCss && text)}' +
                '<div class="e-rte-slash-command-item-content-text">' +
                '<div class="e-slash-command-icon"><div class="${iconCss}"></div></div> ' +
                '<span class="e-rte-slash-command-item-icon-text">${text}</span>' +
                '</div>' +
                '${/if}' +
                '${/if}',
            beforePopupOpen: (): void => {
                this.parent.notify(events.slashCommandOpening, {});
            },
            filtering: (): void => {
                if (this.parent && this.parent.baseEditorCore) {
                    this.saveSelection = this.parent.baseEditorCore.saveSelection();
                }
            },
            select: this.handleSelect.bind(this)
        };
        return model;
    }

    private handleSelect(args: SelectEventArgs): void {
        args.cancel = true;
        this.parent.focus();
        const item: FieldSettingsModel = args.itemData as FieldSettingsModel;
        const selectEventArgs: SlashCommandItemSelectArgs = {
            isInteracted: args.isInteracted,
            item: args.item,
            itemData: args.itemData as ISlashCommandItem,
            originalEvent: args.e,
            cancel: false
        };
        if ((args.itemData as any).isCustomItem) {
            this.beforeSlashCommandApply();
        }
        this.parent.trigger('slashCommanditemSelect', selectEventArgs, (selectArgs: SlashCommandItemSelectArgs) => {
            if (selectArgs.cancel) {
                return;
            } else {
                if (!(selectArgs.itemData as any).isCustomItem) {
                    this.beforeSlashCommandApply();
                    const itemModel: ISlashCommandModel = item as unknown as ISlashCommandModel;
                    switch (itemModel.command) {
                    case 'NumberedList':
                        this.parent.commands().numberedList().apply();
                        break;
                    case 'BulletList':
                        this.parent.commands().bulletList().apply();
                        break;
                    case 'Image':
                    case 'Table':
                    case 'Link':
                        this.mentionPopup.hide();
                        setTimeout(() => {
                            this.notifyDialog(itemModel.subCommand, selectEventArgs);
                        }, 100);
                        break;
                    default:
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
                            const commandName = itemModel.subCommand as any;
                            // Map command names to builder methods
                            // eslint-disable-next-line security/detect-object-injection, @typescript-eslint/tslint/config
                            const builderMethod = (this.parent.commands() as any)[commandName];
                            if (builderMethod && typeof builderMethod === 'function') {
                                builderMethod.call(this.parent.commands()).apply();
                            }
                        }
                        break;
                    }
                    if (selectArgs.originalEvent && selectArgs.originalEvent.type === 'keydown') {
                        this.closeOpenPopup();
                    }
                    this.parent.notify(events.toolbarRefresh, {});
                } else {
                    this.closeOpenPopup();
                }
            }
        });
    }

    /**
     * Notifies the appropriate module to open its insert dialog for the given
     * slash command `subCommand`. Guards the on optional modules which may not
     * be injected in the markdown editor; when a module helper is missing, the
     * notification is a no-op.
     *
     * @param {string} subCommand - the subCommand / DialogType value.
     * @param {SlashCommandItemSelectArgs} selectEventArgs - the original select args.
     * @returns {void}
     */
    private notifyDialog(subCommand: string, selectEventArgs: SlashCommandItemSelectArgs): void {
        switch (subCommand) {
        case DialogType.InsertLink:
            this.parent.notify(events.insertLink, selectEventArgs);
            break;
        case DialogType.InsertImage:
            this.parent.notify(events.insertImage, selectEventArgs);
            break;
        case DialogType.InsertTable:
            this.parent.notify(events.insertTable, selectEventArgs);
            break;
        default:
            break;
        }
    }

    /**
     * Hook invoked before applying a slash command. Mirrors the RTE formatter's
     * `beforeSlashMenuApply` to give the editor a chance to clean up state. In
     * the markdown editor this is a best-effort call; when the formatter-like
     * helper is not present, it is a no-op.
     *
     * @returns {void}
     */
    private beforeSlashCommandApply(): void {
        const editor: HeadlessEditor | null = this.parent.baseEditorCore && this.parent.baseEditorCore.editor;
        if (!editor) {
            return;
        }
        const selection: { from: number, to: number, empty: boolean } = editor.getSelection();
        const slashPosition: number | null = this.findSlashPosition(editor.getDocument(), selection.to);
        if (slashPosition !== null) {
            editor.commands.deleteRange({ from: slashPosition, to: selection.to });
        }
    }

    private findSlashPosition(document: DocumentRoot, selectionPosition: number): number | null {
        let slashPosition: number | null = null;
        const visit: (node: EditorNode, position: number) => number = (node: EditorNode, position: number): number => {
            if ('text' in node && typeof node.text === 'string') {
                const offset: number = Math.min(node.text.length, Math.max(0, selectionPosition - position));
                const index: number = node.text.lastIndexOf('/', offset - 1);
                if (index >= 0) {
                    slashPosition = position + index;
                }
                return position + node.text.length;
            }
            if (!node.children || node.children.length === 0) {
                return position + 1;
            }
            let childPosition: number = node.type === 'document' ? position : position + 1;
            for (const child of node.children) {
                childPosition = visit(child, childPosition);
            }
            return node.type === 'document' ? childPosition : childPosition + 1;
        };
        visit(document, 0);
        return slashPosition;
    }

    private closeOpenPopup(): void {
        if (this.parent.inputElement && this.parent.inputElement.classList.contains('e-mention')) {
            const slashCommandPopup: HTMLElement = this.parent.inputElement.ownerDocument
                .getElementById(this.parent.inputElement.id + '_slash_command');
            const isSlashCommandPopupOpen: boolean = !!slashCommandPopup
                && slashCommandPopup.classList.contains('e-popup-open');
            if (isSlashCommandPopupOpen && this.mentionPopup) {
                this.mentionPopup.hide();
            }
        }
    }

    private getItems(): { [key: string]: string | number | boolean | null }[] {
        const items: (SlashCommandItems | ISlashCommandItem)[] = this.parent.slashCommandSettings.items;
        const dataSource: { [key: string]: string | number | boolean | null }[] = [];
        if (!items || items.length === 0) {
            return dataSource;
        }
        for (let i: number = 0; i < items.length; i++) {
            // Predefined slash commands processing
            if (typeof items[i as number] === 'string') {
                const commnadName: string = items[i as number] as string;
                let model: ISlashCommandModel = this.defaultItems.filter(
                    (item: ISlashCommandModel) => item.command === commnadName
                )[0];
                if (isNOU(model)) {
                    model = this.injectableItems.filter(
                        (item: IInjectableSlashCommandModel) => item.module.toLowerCase().replace(' ', '') ===
                        commnadName.toLowerCase().replace(' ', ''))[0];
                }
                // Skip unknown command names gracefully — the editor surfaces a
                // no-data template rather than throwing on unknown user input.
                if (isNOU(model)) {
                    continue;
                }
                const localeKey: { text: string, description: string } | undefined =
                    slashCommandCommandsKey.get(commnadName as SlashCommandItems);
                dataSource.push({
                    text: this.L10n.getConstant(localeKey ? localeKey.text : commnadName),
                    command: model.command,
                    subCommand: model.subCommand,
                    type: model.type,
                    module: (model as IInjectableSlashCommandModel).module,
                    iconCss: model.iconCss,
                    description: this.L10n.getConstant(localeKey ? localeKey.description : '')
                });
            } else { // Custom slash commands processing
                const customItem: ISlashCommandItem = items[i as number] as ISlashCommandItem;
                dataSource.push({
                    text: customItem.text,
                    command: customItem.command,
                    type: customItem.type,
                    iconCss: customItem.iconCss,
                    description: customItem.description || null,
                    isCustomItem: true
                });
            }
        }
        return dataSource;
    }

    public render(): void {
        if (this.parent.slashCommandSettings.enable) {
            const options: EditorMentionPopupModel = this.generateMentionModel();
            // Mount the mention host on the editor's root element. EditorMentionPopup
            // resolves the live contenteditable surface from the parent internally.
            const root: HTMLElement = this.parent.element as HTMLElement;
            this.mentionPopup = new EditorMentionPopup(
                this.parent,
                this.parent.element.id + '_slash_command',
                root,
                options
            );
        }
    }
}
