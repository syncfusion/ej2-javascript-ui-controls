import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../../models/index';
import { BlockEditor } from '../../base/index';
import { ContentType } from '../../base/index';
import { createFormattingElement } from '../../utils/dom';
import { generateUniqueId, getAccessibleTextColor, getAutoAvatarColor, getUserInitials } from '../../utils/common';
import { getLabelMenuItems } from '../../utils/data';

/**
 * `Content renderer` module is used to render content in Blocks.
 *
 * @hidden
 */
export class ContentRenderer {

    protected editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    renderContent(block: BlockModel, contentElement: HTMLElement): void {
        if (block.content && block.content.length > 0) {
            if (contentElement) {
                contentElement.innerHTML = '';
            }
            if (block.content.length === 1) {
                const isDirectText: boolean = (block.content[0].stylesApplied.length === 0)
                    && block.content[0].type === ContentType.Text;
                this.invokeContentRenderer(
                    block.content[0],
                    contentElement,
                    isDirectText
                );
            }
            else {
                block.content.forEach((content: ContentModel) => {
                    this.invokeContentRenderer(content, contentElement);
                });
            }
        }
        else {
            this.renderText(null, contentElement, true);
        }
    }

    private invokeContentRenderer(
        contentModel: ContentModel,
        contentElement: HTMLElement,
        isDirectText?: boolean): void {
        switch (contentModel.type) {
        case ContentType.Text:
            this.renderText(contentModel, contentElement, isDirectText);
            break;
        case ContentType.Link:
            this.editor.linkModule.renderAnchor(contentModel, contentElement);
            break;
        case ContentType.Code:
            this.renderCode(contentModel, contentElement);
            break;
        case ContentType.Mention:
            this.renderMention(contentModel, contentElement);
            break;
        case ContentType.Label:
            this.renderLabel(contentModel, contentElement);
            break;
        }
    }

    renderText(content: ContentModel, contentElement: HTMLElement, isDirectText?: boolean): void {
        if (!content) {
            contentElement.textContent = '';
            return;
        }
        if (contentElement && contentElement.id) {
            contentElement.removeAttribute('id');
        }
        if (isDirectText) {
            contentElement.id = content.id;
            contentElement.textContent = content.content;
        }
        else {
            const node: HTMLElement = createFormattingElement(content);
            contentElement.appendChild(node);
        }
    }

    private renderCode(content: ContentModel, contentElement: HTMLElement): void {
        const node: HTMLElement = createFormattingElement(content);
        contentElement.appendChild(node);
    }

    private renderMention(content: ContentModel, contentElement: HTMLElement): void {
        const userId: string = content.id.toLowerCase();
        const userModel: UserModel = this.editor.users.find((user: UserModel) => user.id.toLowerCase() === userId);
        if (!userModel) { return; }

        const name: string = userModel.user.trim();
        const initials: string = getUserInitials(name);
        const bgColor: string = userModel.avatarBgColor || getAutoAvatarColor(userModel.id);
        const avatarUrl: string = userModel.avatarUrl || '';
        content.dataId = generateUniqueId(userId);
        const wrapper: HTMLElement = this.editor.createElement('div', {
            id: content.dataId,
            className: 'e-mention-chip e-user-chip',
            attrs: {
                'data-user-id': userModel.id,
                contenteditable: 'false'
            }
        });
        const avatar: HTMLElement = this.editor.createElement('div', {
            className: 'em-avatar',
            attrs: {
                style: `background-color: ${bgColor};`
            }
        });
        if (avatarUrl) {
            const avatarImg: HTMLImageElement = this.editor.createElement('img', {
                className: 'em-img',
                attrs: {
                    src: avatarUrl,
                    alt: userModel.user
                }
            });
            avatar.appendChild(avatarImg);
        }
        else {
            const initial: HTMLElement = this.editor.createElement('div', {
                className: 'em-initial'
            });
            initial.innerText = initials;
            avatar.appendChild(initial);
        }
        const userNameContent: HTMLElement = this.editor.createElement('div', {
            className: 'em-content'
        });
        userNameContent.innerText = userModel.user;
        content.content = userModel.user;

        wrapper.appendChild(avatar);
        wrapper.appendChild(userNameContent);
        contentElement.appendChild(wrapper);
    }

    private renderLabel(content: ContentModel, contentElement: HTMLElement): void {
        const labelItemId: string = content.id.toLowerCase();
        const labelItems: LabelItemModel[] = this.editor.labelSettings.labelItems;
        const labelItem: LabelItemModel = labelItems.find((item: LabelItemModel) => item.id === labelItemId);
        if (!labelItem) { return; }

        content.dataId = generateUniqueId(labelItem.id);
        const labelChip: HTMLElement = this.editor.createElement('span', {
            id: content.dataId,
            className: 'e-mention chip e-label-chip',
            styles: `background: ${labelItem.labelColor};color: ${getAccessibleTextColor(labelItem.labelColor)};`,
            attrs: {
                'data-label-id': labelItem.id,
                contenteditable: 'false'
            }
        });
        labelChip.innerText = `${labelItem.groupHeader}: ${labelItem.text}`;
        content.content = `${labelItem.groupHeader}: ${labelItem.text}`;
        contentElement.appendChild(labelChip);
    }

}
