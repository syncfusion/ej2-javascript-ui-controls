import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Mention, MentionChangeEventArgs, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { IMentionRenderOptions } from '../../common/interface';
import { BlockType, LabelItemModel, LabelSettingsModel, UserModel } from '../../models/index';
import { extractBlockTypeFromElement, getAutoAvatarColor, getLabelMentionDisplayTemplate, getLabelMenuItems, getUserInitials, getUserMentionDisplayTemplate, sanitizeLabelItems } from '../../common/utils/index';
import { events } from '../../common/constant';
import { BlockEditor } from '../base/blockeditor';
import { BlockEditorModel } from '../base/blockeditor-model';

export class InlineContentInsertionModule {
    private editor: BlockEditor;
    public userMenuObj: Mention;
    public labelMenuObj: Mention;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.moduleChanged, this.onPropertyChanged, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.moduleChanged, this.onPropertyChanged);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Initializes the user mention module.
     *
     * @returns {void}
     * @hidden
     */
    public initializeUserMention(): void {
        const mentionDataSource: UserModel[] = this.editor.users.map((user: UserModel) => ({
            id: user.id,
            user: user.user.trim(),
            avatarUrl: user.avatarUrl,
            avatarBgColor: user.avatarBgColor || getAutoAvatarColor(user.id),
            initials: getUserInitials(user.user)
        }));

        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockContainer,
            itemTemplate: '<div class="e-user-mention-item-template"><div class="em-avatar" style="background-color: ${avatarBgColor};">${if(avatarUrl)} <img src="${avatarUrl}" alt="${user}" class="em-img" /> ${else} <div class="em-initial">${initials}</div> ${/if} </div><div class="em-content"><div class="em-text">${user}</div></div></div>',
            displayTemplate: getUserMentionDisplayTemplate(),
            dataSource: mentionDataSource,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-user-menu e-blockeditor-mention-menu',
            fields: { text: 'user', value: 'id' },
            change: this.handleInlineContentInsertion.bind(this),
            beforeOpen: (args: PopupEventArgs) => {
                const focusedBlk: HTMLElement = this.editor.blockManager.currentFocusedBlock;
                args.cancel = (this.editor.users.length === 0)
                    || (focusedBlk && extractBlockTypeFromElement(focusedBlk) === BlockType.Code);
            }
        };
        this.userMenuObj = this.editor.mentionRenderer.renderMention(mentionArgs);
    }

    /**
     * Initializes the label mention module.
     *
     * @returns {void}
     * @hidden
     */
    public initializeLabelContent(): void {
        let items: LabelItemModel[];
        if (this.editor.labelSettings.items.length > 0) {
            items = sanitizeLabelItems(this.editor.labelSettings.items);
        }
        else {
            items = getLabelMenuItems();
            const prevOnChange: boolean = this.editor.isProtectedOnChange;
            this.editor.isProtectedOnChange = true;
            this.editor.labelSettings.items = items;
            this.editor.isProtectedOnChange = prevOnChange;
        }

        const mentionArgs: IMentionRenderOptions = {
            element: this.editor.blockContainer,
            mentionChar: this.editor.labelSettings.triggerChar,
            itemTemplate: '<div class="e-label-mention-item-template"><div class="em-avatar" style="background-color: ${labelColor};"> </div><div class="em-content"><span class="em-icon ${iconCss}"></span><div class="em-text">${text}</div></div></div>',
            displayTemplate: getLabelMentionDisplayTemplate(),
            dataSource: items,
            popupWidth: '200px',
            cssClass: 'e-blockeditor-label-menu e-blockeditor-mention-menu',
            fields: { text: 'text', value: 'id', groupBy: 'groupBy', iconCss: 'iconCss' },
            change: this.handleInlineContentInsertion.bind(this),
            beforeOpen: (args: PopupEventArgs) => {
                const focusedBlk: HTMLElement = this.editor.blockManager.currentFocusedBlock;
                args.cancel = (focusedBlk && extractBlockTypeFromElement(focusedBlk) === BlockType.Code);
            }
        };
        this.labelMenuObj = this.editor.mentionRenderer.renderMention(mentionArgs);
    }

    private handleInlineContentInsertion(args: MentionChangeEventArgs): void {
        args.e.preventDefault();
        args.e.stopPropagation();
        this.editor.blockManager.observer.notify('inlineContentInsertion', args);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'inlineContent';
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {BlockEditorModel} e - specifies the element.
     * @returns {void}
     * @hidden
     */
    protected onPropertyChanged(e: { [key: string]: BlockEditorModel }): void {
        if (e.module !== this.getModuleName()) {
            return;
        }
        const newLabelProp: LabelSettingsModel = e.newProp.labelSettings;

        if (!isNullOrUndefined(newLabelProp)) {
            for (const prop of Object.keys(newLabelProp)) {
                switch (prop) {
                case 'items':
                    this.labelMenuObj.dataSource = newLabelProp.items as { [key: string]: Object }[];
                    break;
                case 'triggerChar':
                    this.labelMenuObj.mentionChar = newLabelProp.triggerChar;
                    break;
                }
            }
        }

        if (!isNullOrUndefined(e.newProp.users)) {
            this.userMenuObj.dataSource = e.newProp.users as { [key: string]: Object }[];
        }
    }
    /**
     * Destroys the inline content module.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.userMenuObj) {
            this.userMenuObj.destroy();
        }
        if (this.labelMenuObj) {
            this.labelMenuObj.destroy();
        }
        this.removeEventListeners();
        this.userMenuObj = null;
        this.labelMenuObj = null;
    }
}
