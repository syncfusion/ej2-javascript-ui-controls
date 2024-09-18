import { FieldSettingsModel, Mention, MentionModel, SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import { DialogType, IRichTextEditor, ISlashMenuItem, RichTextEditorModel, SlashMenuItems, SlashMenuItemSelectArgs } from '../base';
import { ServiceLocator } from '../services';
import { isNullOrUndefined as isNOU, L10n } from '@syncfusion/ej2-base';
import { defaultSlashMenuDataModel, injectibleSlashMenuDataModel, ISlashMenuModel, ModuleSlashMenuModel } from '../models/slash-menu-settings';
import { NodeSelection } from '../../selection/selection';
import { slashMenuCommandsKey } from '../models/default-locale';
import * as events from '../base/constant';

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
        this.savedSelection = new NodeSelection();
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
        const dataSource: {[key: string]: Object; }[] = this.getItems();
        const model: MentionModel = {
            dataSource: dataSource,
            cssClass: 'e-slash-menu' + this.parent.getCssClass(),
            fields: { text: 'text', groupBy: 'type', iconCss: 'iconCss', value: 'description' },
            mentionChar : '/',
            target: this.parent.inputElement,
            popupHeight: this.parent.slashMenuSettings.popupHeight,
            popupWidth: this.parent.slashMenuSettings.popupWidth,
            allowSpaces: true,
            itemTemplate: '${if(iconCss && description)}' +
                            '<div class="e-rte-slash-menu-item-content" style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;">' +
                                '<div class="e-slash-menu-icon"style="padding: 15px 15px 15px 15px;"><div class="${iconCss}"></div></div> ' +
                                '<div style="display: flex; flex-direction: column;">' +
                                    '<span class="e-rte-slash-menu-item-text" style="font-weight: 500;">${text}</span>' +
                                    '${if(description)}' +
                                        '<span class="e-rte-slash-menu-item-description">${description}</span>' +
                                    '${/if}' +
                                '</div>' +
                            '</div>' +
                        '${else}' +
                            '${if(iconCss && text)}' +
                                '<div class="e-rte-slash-menu-item-content" style="display: flex; flex-direction: row; align-items: center; height: 25px; font-weight: 500;">' +
                                    '<div class="e-slash-menu-icon"style="margin-left: 15px; width: 30px"><div class="${iconCss}"></div></div> ' +
                                    '<span class="e-rte-slash-menu-item-icon-text">${text}</span>' +
                                '</div>' +
                            '${/if}' +
                        '${/if}' ,
            beforeOpen: () => {
                this.savedSelection = this.savedSelection.save(this.savedSelection.getRange(this.currentDocument), this.currentDocument);
            },
            filtering: () => {
                this.savedSelection = this.savedSelection.save(this.savedSelection.getRange(this.currentDocument), this.currentDocument);
            },
            select: this.handleSelect.bind(this)
        };
        return model;
    }

    private handleSelect(args: SelectEventArgs ): void {
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
                            this.parent.showDialog(itemModel.subCommand as DialogType);
                        }, 100);
                        break;
                    case 'Emojipicker':
                        this.mention.hidePopup();
                        setTimeout(() => {
                            this.parent.showEmojiPicker();
                        }, 100);
                        break;
                    default:
                        this.parent.executeCommand('formatBlock', itemModel.subCommand);
                        break;
                    }
                }
            }
        });
    }

    private getItems(): {[key: string]: Object; }[] {
        const items: (SlashMenuItems | ISlashMenuItem)[] = this.parent.slashMenuSettings.items;
        const dataSource: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < items.length; i++) {
            // Predefined slash commands processing
            if (typeof items[i as number] === 'string') {
                const commnadName: string = items[i as number] as string;
                let model: ISlashMenuModel = this.defaultItems.filter(
                    (item: ISlashMenuModel) => item.command === commnadName
                ) [0];
                if (isNOU(model)) {
                    model = this.injectibleItems.filter((item: ModuleSlashMenuModel) => item.module.toLowerCase().replace(' ' , '') === commnadName.toLowerCase().replace(' ' , ''))[0];
                }
                const localeVariable: {text: string, description: string} = slashMenuCommandsKey.get(commnadName as SlashMenuItems);
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
            this.mention  = new Mention(options);
            this.mention.appendTo(this.parent.rootContainer.appendChild(this.parent.createElement('div', { className: 'e-rte-slash-menu', id: this.parent.getID() + '_slash_menu' })));
        }
    }
}
