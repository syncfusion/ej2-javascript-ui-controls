import { RichTextEditorUI } from '../../src/richtexteditor-ui/richtexteditor-ui';
import { RichTextEditorUIModel } from '../../src/richtexteditor-ui/richtexteditor-ui-model';
import { destroyRTE, renderRTE } from '../base.spec';
import { SlashCommand } from '../../src/base/renderer/slash-commands';
import { ISlashCommandItem, SlashCommandItemSelectArgs } from '../../src/common/interface';
import { SlashCommandItems } from '../../src/common/types';
import { DialogType } from '../../src/common/enum';
import { EditorCommandName } from '../../src/controller/interface';
import {
    defaultSlashCommandDataModel, injectableSlashCommandDataModel
} from '../../src/richtexteditor-ui/model/slash-command-settings';
import * as events from '../../src/common/constant';
import { SlashCommandSettingsModel } from '../../src/richtexteditor-ui';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

describe('SlashCommand sub component', () => {
    describe('initialize', () => {
        let editor: RichTextEditorUI;
        let slashCommand: SlashCommand;
        let mention: any;

        beforeEach(() => {
            editor = renderRTE({ slashCommandSettings: { enable: true } } as RichTextEditorUIModel);
            slashCommand = editor.slashCommandModule;
            mention = (slashCommand as any).mentionPopup.mention;
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should return the module name "slashCommand"', () => {
            expect(slashCommand.getModuleName()).toBe('slashCommand');
        });

        it('should instantiate the SlashCommand module on the editor', () => {
            expect(slashCommand).not.toBe(null);
            expect(slashCommand instanceof SlashCommand).toBe(true);
        });

        it('should not instantiate the module when slashCommandSettings.enable is false', () => {
            const disabledEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: false } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            expect(disabledEditor.slashCommandModule).toBeUndefined();
        });

        it('should create the EditorMentionPopup host with the slash-command id suffix', () => {
            const root: HTMLElement = document.getElementById(editor.element.id + '_slash_command');
            expect(root).not.toBe(null);
            expect(root.classList.contains('e-editor-mention-root')).toBe(true);
        });

        it('should configure the underlying Mention with the "/" trigger character', () => {
            expect(mention.mentionChar).toBe('/');
        });

        it('should apply the "e-slash-command e-rte-ui-elements" css class to the mention', () => {
            expect(mention.cssClass).toContain('e-slash-command');
            expect(mention.cssClass).toContain('e-rte-ui-elements');
        });

        it('should configure allowSpaces as true', () => {
            expect(mention.allowSpaces).toBe(true);
        });

        it('should configure fields with text, groupBy, iconCss, and value', () => {
            expect(mention.fields.text).toBe('text');
            expect(mention.fields.groupBy).toBe('type');
            expect(mention.fields.iconCss).toBe('iconCss');
            expect(mention.fields.value).toBe('description');
        });

        it('should apply the default popupWidth of 300px and popupHeight of 320px', () => {
            expect(mention.popupWidth).toBe('300px');
            expect(mention.popupHeight).toBe('320px');
        });

        it('should honour custom popupWidth and popupHeight (string values)', () => {
            const customEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, popupWidth: '400px', popupHeight: '500px' } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const customMention: any = (customEditor.slashCommandModule as any).mentionPopup.mention;
            expect(customMention.popupWidth).toBe('400px');
            expect(customMention.popupHeight).toBe('500px');
        });

        it('should honour custom popupWidth and popupHeight (numeric values)', () => {
            const customEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, popupWidth: 350, popupHeight: 450 } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const customMention: any = (customEditor.slashCommandModule as any).mentionPopup.mention;
            expect(customMention.popupWidth).toBe(350);
            expect(customMention.popupHeight).toBe(450);
        });

        it('should configure an itemTemplate with icon, text column, description, and else branches', () => {
            expect(mention.itemTemplate).toContain('e-slash-command-icon');
            expect(mention.itemTemplate).toContain('${iconCss}');
            expect(mention.itemTemplate).toContain('${text}');
            expect(mention.itemTemplate).toContain('${description}');
            expect(mention.itemTemplate).toContain('${else}');
        });

        it('should populate the data source with all default slash command items', () => {
            expect(mention.dataSource.length).toBe(defaultSlashCommandDataModel.length + injectableSlashCommandDataModel.length);
            for (let i: number = 0; i < defaultSlashCommandDataModel.length; i++) {
                expect(mention.dataSource[i as number].type).toBe('Basic Block');
            }
        });

        it('should resolve localized text for the Paragraph default item', () => {
            const paragraphItem: any = mention.dataSource.find((item: any) => item.command === 'Paragraph');
            expect(paragraphItem.text).toBe('Paragraph');
            expect(paragraphItem.description).toBe('Plain text block');
        });

        it('should resolve localized text for the Heading 1 default item', () => {
            const heading1Item: any = mention.dataSource.find((item: any) => item.command === 'Heading 1');
            expect(heading1Item.text).toBe('Heading 1');
            expect(heading1Item.description).toBe('Large section heading');
        });

        it('should resolve localized text for the NumberedList default item', () => {
            const orderedItem: any = mention.dataSource.find((item: any) => item.command === 'NumberedList');
            expect(orderedItem.text).toBe('Numbered List');
            expect(orderedItem.description).toBe('Ordered list of items');
        });

        it('should resolve localized text for the BulletList default item', () => {
            const unorderedItem: any = mention.dataSource.find((item: any) => item.command === 'BulletList');
            expect(unorderedItem.text).toBe('Bulleted List');
            expect(unorderedItem.description).toBe('Bulleted list of items');
        });

        it('should resolve localized text for the Blockquote default item', () => {
            const blockquoteItem: any = mention.dataSource.find((item: any) => item.command === 'Blockquote');
            expect(blockquoteItem.text).toBe('Blockquote');
            expect(blockquoteItem.description).toBe('Quoted block of text');
        });

        it('should include the Link injectable item with the module and DialogType fields', () => {
            const linkEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: ['Link'] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const linkMention: any = (linkEditor.slashCommandModule as any).mentionPopup.mention;
            const linkItem: any = linkMention.dataSource.find((item: any) => item.command === 'Link');
            expect(linkItem).not.toBe(null);
            expect(linkItem.module).toBe('Link');
            expect(linkItem.subCommand).toBe(DialogType.InsertLink);
            expect(linkItem.type).toBe('Inline');
        });

        it('should include the Image injectable item with the module and DialogType fields', () => {
            const imageEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: ['Image'] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const imageMention: any = (imageEditor.slashCommandModule as any).mentionPopup.mention;
            const imageItem: any = imageMention.dataSource.find((item: any) => item.command === 'Image');
            expect(imageItem).not.toBe(null);
            expect(imageItem.module).toBe('Image');
            expect(imageItem.subCommand).toBe(DialogType.InsertImage);
            expect(imageItem.type).toBe('Media');
        });

        it('should include the Table injectable item with the module and DialogType fields', () => {
            const tableEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: ['Table'] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const tableMention: any = (tableEditor.slashCommandModule as any).mentionPopup.mention;
            const tableItem: any = tableMention.dataSource.find((item: any) => item.command === 'Table');
            expect(tableItem).not.toBe(null);
            expect(tableItem.module).toBe('Table');
            expect(tableItem.subCommand).toBe(DialogType.InsertTable);
            expect(tableItem.type).toBe('Basic Block');
        });

        it('should include custom slash command items in the data source with isCustomItem true', () => {
            const customItem: ISlashCommandItem = {
                text: 'Insert Snippet',
                command: 'snippet',
                iconCss: 'e-icons e-code',
                description: 'Insert a reusable code snippet',
                type: 'Inline'
            };
            const customEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: [customItem] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const customMention: any = (customEditor.slashCommandModule as any).mentionPopup.mention;
            expect(customMention.dataSource.length).toBe(1);
            expect(customMention.dataSource[0].text).toBe('Insert Snippet');
            expect(customMention.dataSource[0].command).toBe('snippet');
            expect(customMention.dataSource[0].isCustomItem).toBe(true);
        });

        it('should set description to null for a custom item without a description', () => {
            const noDescItem: ISlashCommandItem = {
                text: 'No Desc',
                command: 'noDesc',
                iconCss: 'e-icons e-paragraph',
                type: 'Basic Block'
            };
            const customEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: [noDescItem] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const customMention: any = (customEditor.slashCommandModule as any).mentionPopup.mention;
            expect(customMention.dataSource[0].description).toBe(null);
        });

        it('should mix predefined and custom items in the same data source', () => {
            const customItem: ISlashCommandItem = {
                text: 'Insert Snippet',
                command: 'snippet',
                iconCss: 'e-icons e-code',
                type: 'Inline'
            };
            const mixedEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: ['Paragraph', customItem] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const mixedMention: any = (mixedEditor.slashCommandModule as any).mentionPopup.mention;
            expect(mixedMention.dataSource.length).toBe(2);
            expect(mixedMention.dataSource[0].command).toBe('Paragraph');
            expect(mixedMention.dataSource[0].isCustomItem).toBeUndefined();
            expect(mixedMention.dataSource[1].command).toBe('snippet');
            expect(mixedMention.dataSource[1].isCustomItem).toBe(true);
        });

        it('should produce an empty data source when items is an empty array', () => {
            const emptyEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: { enable: true, items: [] } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            const emptyMention: any = (emptyEditor.slashCommandModule as any).mentionPopup.mention;
            expect(emptyMention.dataSource.length).toBe(0);
        });

        it('should not throw when an unknown string command name is provided in items', () => {
            expect((): void => {
                const unknownEditor: RichTextEditorUI = renderRTE({
                    slashCommandSettings: {
                        enable: true,
                        items: ['NonExistent' as unknown as SlashCommandItems]
                    } as SlashCommandSettingsModel
                } as RichTextEditorUIModel);
                destroyRTE(unknownEditor);
            }).not.toThrow();
        });
    });

    describe('onPropertyChanged', () => {
        let propEditor: RichTextEditorUI;
        let mention: any;

        beforeEach(() => {
            propEditor = renderRTE({
                slashCommandSettings: { enable: true, items: ['Paragraph'], popupWidth: '300px', popupHeight: '320px' } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            mention = (propEditor.slashCommandModule as any).mentionPopup.mention;
        });

        afterEach(() => {
            destroyRTE(propEditor);
        });

        it('should update the data source when items change at runtime', () => {
            expect(mention.dataSource.length).toBe(1);
            propEditor.slashCommandSettings = { enable: true, items: ['Paragraph', 'Heading 1'] } as SlashCommandSettingsModel;
            propEditor.dataBind();
            expect(mention.dataSource.length).toBe(2);
        });

        it('should update the popup width when popupWidth changes at runtime', () => {
            propEditor.slashCommandSettings = { enable: true, popupWidth: '500px' } as SlashCommandSettingsModel;
            propEditor.dataBind();
            expect(mention.popupWidth).toBe('500px');
        });

        it('should update the popup height when popupHeight changes at runtime', () => {
            propEditor.slashCommandSettings = { enable: true, popupHeight: '600px' } as SlashCommandSettingsModel;
            propEditor.dataBind();
            expect(mention.popupHeight).toBe('600px');
        });

        it('should destroy mention popup when enable becomes false', () => {
            propEditor.slashCommandSettings = {
                enable: false
            };
            propEditor.dataBind();
            expect(isNullOrUndefined(mention.mentionPopup)).toBe(true);
        });

    });

    describe('filtering', () => {
        let filterEditor: RichTextEditorUI;
        let mention: any;

        beforeEach(() => {
            filterEditor = renderRTE({
                slashCommandSettings: { enable: true } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            mention = (filterEditor.slashCommandModule as any).mentionPopup.mention;
        });

        afterEach(() => {
            destroyRTE(filterEditor);
        });

        it('should notify the editor with the slashCommandOpening event when the popup opens', () => {
            const notifySpy: jasmine.Spy = spyOn(filterEditor, 'notify').and.callThrough();
            filterEditor.inputElement.focus();
            const range: Range = document.createRange();
            range.selectNodeContents(filterEditor.inputElement);
            range.collapse(false);
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            mention.trigger('beforeOpen', { cancel: false });
            expect(notifySpy).toHaveBeenCalledWith(events.slashCommandOpening, {});
        });
    });

    describe('applying', () => {
        let applyEditor: RichTextEditorUI;
        let mention: any;
        let executeSpy: jasmine.Spy;
        let focusSpy: jasmine.Spy;
        let notifySpy: jasmine.Spy;

        beforeEach(() => {
            applyEditor = renderRTE({
                slashCommandSettings: { enable: true } as SlashCommandSettingsModel
            } as RichTextEditorUIModel);
            mention = (applyEditor.slashCommandModule as any).mentionPopup.mention;
            executeSpy = spyOn((applyEditor as any).editorController, 'execute').and.callThrough();
            focusSpy = spyOn(applyEditor, 'focus').and.callThrough();
            notifySpy = spyOn(applyEditor, 'notify').and.callThrough();
        });

        afterEach(() => {
            destroyRTE(applyEditor);
        });

        it('should cancel the underlying SelectEventArgs and focus the editor', () => {
            const args: any = { cancel: false, itemData: { command: 'Paragraph', subCommand: 'paragraph' } };
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', args);
            expect(args.cancel).toBe(true);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('should execute the "paragraph" command when the Paragraph item is selected', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'Paragraph', subCommand: 'paragraph' } });
            expect(executeSpy).toHaveBeenCalled();
        });

        it('should execute the "heading1" command when the Heading 1 item is selected', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'Heading 1', subCommand: 'heading1' } });
            expect(executeSpy).toHaveBeenCalled();
        });

        it('should execute the "blockQuote" command when the Blockquote item is selected', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'Blockquote', subCommand: 'blockQuote' } });
            expect(executeSpy).toHaveBeenCalled();
        });

        it('should execute the "numberedList" command when the NumberedList item is selected', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'NumberedList', subCommand: 'numberedList' } });
            expect(executeSpy).toHaveBeenCalled();
        });

        it('should execute the "bulletList" command when the BulletList item is selected', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'BulletList', subCommand: 'bulletList' } });
            expect(executeSpy).toHaveBeenCalled();
        });

        it('should not dispatch the default subCommand as an EditorCommandName for unknown block items', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'CustomBlock', subCommand: 'clearFormat', isCustomItem: true } });
            expect(executeSpy).not.toHaveBeenCalled();
        });

        it('should notify toolbarRefresh after applying a command', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', { cancel: false, itemData: { command: 'Paragraph', subCommand: 'paragraph' } });
            expect(notifySpy).toHaveBeenCalledWith(events.toolbarRefresh, {});
        });

        it('should not execute a command when the item is a custom item', () => {
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', {
                cancel: false,
                itemData: { command: 'custom', isCustomItem: true, text: 'Custom' }
            });
            expect(executeSpy).not.toHaveBeenCalled();
        });

        it('should not execute any command when the itemSelect event is cancelled', () => {
            const cancelEditor: RichTextEditorUI = renderRTE({
                slashCommandSettings: {
                    enable: true
                } as SlashCommandSettingsModel,
                slashCommanditemSelect: (args: SlashCommandItemSelectArgs): void => { args.cancel = true; }
            } as RichTextEditorUIModel);
            const cancelSpy: jasmine.Spy = spyOn((cancelEditor as any).editorController, 'execute').and.callThrough();
            const cancelMention: any = (cancelEditor.slashCommandModule as any).mentionPopup.mention;
            cancelMention.trigger('beforeOpen', { cancel: false });
            cancelMention.trigger('select', { cancel: false, itemData: { command: 'Paragraph', subCommand: 'paragraph' } });
            expect(cancelSpy).not.toHaveBeenCalled();
            destroyRTE(cancelEditor);
        });

        it('should not throw when the select event originates from a keydown', () => {
            mention.trigger('beforeOpen', { cancel: false });
            expect((): void => {
                mention.trigger('select', {
                    cancel: false,
                    itemData: { command: 'Paragraph', subCommand: 'paragraph' },
                    e: { type: 'keydown' }
                });
            }).not.toThrow();
        });
    });

    describe('destroy', () => {
        let destroyEditor: RichTextEditorUI;
        let destroySlash: SlashCommand;

        beforeEach(() => {
            destroyEditor = renderRTE({ slashCommandSettings: { enable: true } } as RichTextEditorUIModel);
            destroySlash = destroyEditor.slashCommandModule;
        });

        afterEach(() => {
            destroyRTE(destroyEditor);
        });

        it('should remove the slash command host element from the DOM after destroy', () => {
            const id: string = destroyEditor.element.id + '_slash_command';
            expect(document.getElementById(id)).not.toBe(null);
            destroySlash.destroy();
            expect(document.getElementById(id)).toBe(null);
        });

        it('should be idempotent - calling destroy twice must not throw', () => {
            destroySlash.destroy();
            expect((): void => { destroySlash.destroy(); }).not.toThrow();
        });

        it('should clear the defaultItems and injectableItems arrays and null the mentionPopup after destroy', () => {
            destroySlash.destroy();
            const anySlash: any = destroySlash as any;
            expect(anySlash.defaultItems.length).toBe(0);
            expect(anySlash.injectableItems.length).toBe(0);
            expect(anySlash.mentionPopup).toBe(null);
        });
    });

    describe('Task 1049360: To remove the slash character from the DOM after the selection is completed in SlashCommands.', () => {
        let editor: any;
        let mention: any;

        beforeEach(() => {
            editor = renderRTE({
                slashCommandSettings: {
                    enable: true
                }
            });
            mention = editor.slashCommandModule.mentionPopup.mention;
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should remove slash text and close popup when a slash command item is selected', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.innerHTML = '<p>/para</p>';
            const range: Range = document.createRange();
            range.selectNodeContents(editor.inputElement.firstChild);
            range.collapse(false);
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            mention.trigger('beforeOpen', {
                cancel: false
            });
            const popup: HTMLElement = document.getElementById(
                editor.element.id + '_slash_command'
            );
            editor.inputElement.classList.add('e-mention');
            mention.trigger('select', {
                cancel: false,
                isInteracted: true,
                itemData: {
                    command: 'Paragraph',
                    subCommand: 'paragraph'
                },
                e: {
                    type: 'keydown'
                }
            });
            setTimeout(() => {
                expect(editor.inputElement.textContent).not.toContain('/');
                expect(popup.classList.contains('e-popup-open')).toBe(false);
                done();
            }, 150);
        });

        it('should close popup and open link action when link item is selected', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.innerHTML = '<p>/link</p>';
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', {
                cancel: false,
                itemData: {
                    command: 'Link',
                    subCommand: DialogType.InsertLink
                }
            });
            setTimeout(() => {
                expect(editor.element.querySelector('.e-rte-ui-link-dialog.e-popup-open')).not.toBe(null);
                done();
            }, 150);
        });

        it('should remove slash when table item is selected', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.innerHTML = '<p>/table</p>';
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', {
                cancel: false,
                itemData: {
                    command: 'Table',
                    subCommand: DialogType.InsertTable
                }
            });
            setTimeout(() => {
                expect(editor.element.querySelector('.e-rte-ui-table-popup.e-popup-open')).not.toBe(null);
                done();
            }, 150);
        });

        it('should remove slash when image item is selected', (done: DoneFn) => {
            editor.focus();
            editor.inputElement.innerHTML = '<p>/image</p>';
            mention.trigger('beforeOpen', { cancel: false });
            mention.trigger('select', {
                cancel: false,
                itemData: {
                    command: 'Image',
                    subCommand: DialogType.InsertImage
                }
            });
            setTimeout(() => {
                expect(editor.element.querySelector('.e-rte-ui-img-dialog.e-popup-open')).not.toBe(null);
                done();
            }, 200);
        });
    });

});
