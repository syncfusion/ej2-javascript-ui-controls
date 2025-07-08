import { FieldSettingsModel, Mention, MentionModel, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { IRichTextEditor, RichTextEditorModel, SlashMenuItemSelectArgs } from '../base';
import { ServiceLocator } from '../services';
import { isNullOrUndefined as isNOU, L10n } from '@syncfusion/ej2-base';
import { defaultSlashMenuDataModel, injectibleSlashMenuDataModel, ISlashMenuModel, ModuleSlashMenuModel } from '../../models/slash-menu-settings';
import { NodeSelection } from '../../selection/selection';
import { slashMenuCommandsKey } from '../models/default-locale';
import * as events from '../base/constant';
import { DialogType, SlashMenuItems} from '../../common/enum';
import { ICodeBlockLanguageModel, ISlashMenuItem} from '../../common/interface';
import { CodeBlockSettingsModel } from '../../models/toolbar-settings-model';

export class SlashMenu {
    private parent: IRichTextEditor;
    private L10n: L10n;
    private mention: Mention
    private savedSelection: NodeSelection;
    private currentDocument: Document;
    private defaultItems: ISlashMenuModel[];
    private injectibleItems: ModuleSlashMenuModel[];
    constructor(options: IRichTextEditor, serviceLocator: ServiceLocator) {
        this.parent = options;
        this.currentDocument = this.parent.element.ownerDocument;
        this.L10n = serviceLocator.getService<L10n>('rteLocale');
        this.savedSelection = new NodeSelection(this.parent.inputElement);
        this.defaultItems = defaultSlashMenuDataModel;
        this.injectibleItems = injectibleSlashMenuDataModel;
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
        this.parent.on(events.initialEnd, this.render, this);
    }

    private removeEventListener(): void {
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.destroy, this.removeEventListener);
    }

    private onPropertyChanged(e: { [key: string]: RichTextEditorModel }): void {
        for (const prop of Object.keys(e.newProp)) {
            if (prop === 'slashMenuSettings') {
                switch (Object.keys(e.newProp.slashMenuSettings)[0]) {
                case 'enable':
                    if (!e.newProp.slashMenuSettings.enable) {
                        this.removeEventListener();
                    } else {
                        this.render();
                    }
                    break;
                case 'items':
                    this.mention.dataSource = this.getItems();
                    break;
                case 'popupHeight':
                    this.mention.popupHeight = e.newProp.slashMenuSettings.popupHeight;
                    break;
                case 'popupWidth':
                    this.mention.popupWidth = e.newProp.slashMenuSettings.popupWidth;
                    break;
                }
            }
        }
    }

    public getModuleName(): string {
        return 'slashMenu';
    }

    public destroy(): void {
        if (this.mention && !this.mention.isDestroyed) {
            this.mention.destroy();
            this.defaultItems = [];
            this.injectibleItems = [];
        }
    }

    private generateMentionModel(): MentionModel {
        const dataSource: { [key: string]: Object; }[] = this.getItems();
        const model: MentionModel = {
            dataSource: dataSource,
            cssClass: 'e-slash-menu e-rte-elements' + this.parent.getCssClass(),
            fields: { text: 'text', groupBy: 'type', iconCss: 'iconCss', value: 'description' },
            mentionChar: '/',
            target: this.parent.inputElement,
            popupHeight: this.parent.slashMenuSettings.popupHeight,
            popupWidth: this.parent.slashMenuSettings.popupWidth,
            allowSpaces: true,
            itemTemplate: '${if(iconCss && description)}' +
                '<div class="e-rte-slash-menu-item-content-description">' +
                '<div class="e-slash-menu-icon"><div class="${iconCss}"></div></div> ' +
                '<div class="e-rte-slash-menu-item-text-column">' +
                '<span class="e-rte-slash-menu-item-text">${text}</span>' +
                '${if(description)}' +
                '<span class="e-rte-slash-menu-item-description">${description}</span>' +
                '${/if}' +
                '</div>' +
                '</div>' +
                '${else}' +
                '${if(iconCss && text)}' +
                '<div class="e-rte-slash-menu-item-content-text">' +
                '<div class="e-slash-menu-icon"><div class="${iconCss}"></div></div> ' +
                '<span class="e-rte-slash-menu-item-icon-text">${text}</span>' +
                '</div>' +
                '${/if}' +
                '${/if}',
            beforeOpen: () => {
                // Add notification to prevent zero-width space removal in html-editor keyUp event
                this.parent.notify(events.slashMenuOpening, {});
                this.savedSelection = this.savedSelection.save(this.savedSelection.getRange(this.currentDocument), this.currentDocument);
            },
            filtering: () => {
                this.savedSelection = this.savedSelection.save(this.savedSelection.getRange(this.currentDocument), this.currentDocument);
            },
            select: this.handleSelect.bind(this)
        };
        return model;
    }

    private handleSelect(args: SelectEventArgs): void {
        args.cancel = true;
        this.parent.focusIn();
        this.savedSelection.restore();
        const item: FieldSettingsModel = args.itemData;
        const selectEventArgs: SlashMenuItemSelectArgs = {
            isInteracted: args.isInteracted,
            item: args.item,
            itemData: args.itemData as ISlashMenuItem,
            originalEvent: args.e,
            cancel: false
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((args.itemData as any).isCustomItem) {
            this.parent.formatter.beforeSlashMenuApply();
        }
        this.parent.trigger('slashMenuItemSelect', selectEventArgs, (selectArgs: SlashMenuItemSelectArgs) => {
            if (selectArgs.cancel) {
                return;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(selectArgs.itemData as any).isCustomItem) {
                    this.parent.formatter.beforeSlashMenuApply();
                    const itemModel: ISlashMenuModel = item as ISlashMenuModel;
                    switch (itemModel.command) {
                    case 'OrderedList':
                        this.parent.executeCommand('insertOrderedList');
                        break;
                    case 'UnorderedList':
                        this.parent.executeCommand('insertUnorderedList');
                        break;
                    case 'Audio':
                    case 'Video':
                    case 'Image':
                    case 'Table':
                    case 'Link':
                        this.mention.hidePopup();
                        setTimeout(() => {
                            if (itemModel.subCommand === DialogType.InsertLink) {
                                this.parent.notify(events.showLinkDialog, {});
                            } else if (itemModel.subCommand === DialogType.InsertImage) {
                                this.parent.notify(events.showImageDialog, selectEventArgs);
                            } else if (itemModel.subCommand === DialogType.InsertAudio) {
                                this.parent.notify(events.showAudioDialog, selectEventArgs);
                            } else if (itemModel.subCommand === DialogType.InsertVideo) {
                                this.parent.notify(events.showVideoDialog, selectEventArgs);
                            } else if (itemModel.subCommand === DialogType.InsertTable) {
                                this.parent.notify(events.showTableDialog, {});
                            }
                        }, 100);
                        break;
                    case 'Emojipicker':
                        this.mention.hidePopup();
                        setTimeout(() => {
                            this.parent.showEmojiPicker();
                        }, 100);
                        break;
                    case 'CodeBlock':
                        if (!isNOU(this.parent.codeBlockModule)) {
                            let defaultItem: ICodeBlockLanguageModel;
                            if (this.parent.codeBlockSettings.languages && this.parent.codeBlockSettings.languages.length > 0) {
                                const filteredItems: ICodeBlockLanguageModel[] = !isNOU(this.parent.codeBlockSettings.defaultLanguage) ?
                                    this.parent.codeBlockSettings.languages.filter((item: { [key: string]: CodeBlockSettingsModel }) =>
                                        item.language === this.parent.codeBlockSettings.defaultLanguage) : [];
                                defaultItem = filteredItems.length > 0 ? filteredItems[0] : this.parent.codeBlockSettings.languages[0];
                                this.parent.executeCommand('insertCodeBlock', defaultItem);
                            }
                        }
                        break;
                    default:
                        this.parent.executeCommand('formatBlock', itemModel.subCommand);
                        break;
                    }
                    this.parent.notify(events.toolbarRefresh, {});
                } else {
                    if (this.parent.inputElement.classList.contains('e-mention')) {
                        const slashMenuPopup: HTMLElement = this.parent.inputElement.ownerDocument.getElementById(this.parent.inputElement.id + '_slash_menu_popup');
                        const isSlashMenuPopupOpen: boolean = slashMenuPopup && slashMenuPopup.classList.contains('e-popup-open');
                        if (isSlashMenuPopupOpen) {
                            this.mention.hidePopup();
                        }
                    }
                }
            }
        });
    }

    private getItems(): { [key: string]: Object; }[] {
        const items: (SlashMenuItems | ISlashMenuItem)[] = this.parent.slashMenuSettings.items;
        const dataSource: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < items.length; i++) {
            // Predefined slash commands processing
            if (typeof items[i as number] === 'string') {
                const commnadName: string = items[i as number] as string;
                let model: ISlashMenuModel = this.defaultItems.filter(
                    (item: ISlashMenuModel) => item.command === commnadName
                )[0];
                if (isNOU(model)) {
                    model = this.injectibleItems.filter((item: ModuleSlashMenuModel) => item.module.toLowerCase().replace(' ', '') === commnadName.toLowerCase().replace(' ', ''))[0];
                }
                const localeVariable: { text: string, description: string } = slashMenuCommandsKey.get(commnadName as SlashMenuItems);
                dataSource.push({
                    text: this.L10n.getConstant(localeVariable.text),
                    command: model.command,
                    subCommand: model.subCommand,
                    type: model.type,
                    module: (model as ModuleSlashMenuModel).module,
                    iconCss: model.iconCss,
                    description: this.L10n.getConstant(localeVariable.description)
                });
            } else { // Custom slash commands processing
                dataSource.push({
                    text: (items[i as number] as ISlashMenuItem).text,
                    command: (items[i as number] as ISlashMenuItem).command,
                    type: (items[i as number] as ISlashMenuItem).type,
                    iconCss: (items[i as number] as ISlashMenuItem).iconCss,
                    description: (items[i as number] as ISlashMenuItem).description,
                    isCustomItem: true
                });
            }
        }
        return dataSource;
    }

    public render(): void {
        if (this.parent.editorMode === 'HTML' && this.parent.slashMenuSettings.enable) {
            const options: MentionModel = this.generateMentionModel();
            this.mention = new Mention(options);
            this.mention.appendTo(this.parent.rootContainer.appendChild(this.parent.createElement('div', { className: 'e-rte-slash-menu', id: this.parent.getID() + '_slash_menu' })));
        }
    }
}
