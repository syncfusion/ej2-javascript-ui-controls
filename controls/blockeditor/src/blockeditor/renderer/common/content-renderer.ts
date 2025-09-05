import { BaseStylesProp, BlockModel, ContentModel, LabelContentProps, LabelItemModel, MentionContentProps, StyleModel, UserModel } from '../../models/index';
import { BlockEditor, ContentType } from '../../base/index';
import { createFormattingElement } from '../../utils/dom';
import { generateUniqueId, getAccessibleTextColor, getAutoAvatarColor, getUserInitials } from '../../utils/common';

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

    /**
     * Renders the actual content of a block.
     *
     * @param {BlockModel} block - The block model containing the content.
     * @param {HTMLElement} contentElement - The HTML element where the content will be rendered.
     * @returns {void}
     * @hidden
     */
    renderContent(block: BlockModel, contentElement: HTMLElement): void {
        if (block.content && block.content.length > 0) {
            if (contentElement) {
                contentElement.innerHTML = '';
            }
            if (block.content.length === 1) {
                const props: BaseStylesProp = block.content[0].props as BaseStylesProp;
                const styles: Partial<Record<keyof StyleModel, string | boolean>> | {} = props ? props.styles : {};
                const isEmptyStyles: boolean = !styles || Object.keys(styles).length === 0;
                const isDirectText: boolean = isEmptyStyles && block.content[0].type === ContentType.Text;
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

    private renderText(content: ContentModel, contentElement: HTMLElement, isDirectText?: boolean): void {
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
        const props: MentionContentProps = content.props as MentionContentProps;
        const userModel: UserModel = this.editor.users.find((user: UserModel) => user.id.toLowerCase() === props.userId);
        if (!userModel) { return; }

        const name: string = userModel.user.trim();
        const initials: string = getUserInitials(name);
        const bgColor: string = userModel.avatarBgColor || getAutoAvatarColor(userModel.id);
        const avatarUrl: string = userModel.avatarUrl || '';
        const wrapper: HTMLElement = this.editor.createElement('div', {
            id: content.id,
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
        const props: LabelContentProps = content.props as LabelContentProps;
        const labelItems: LabelItemModel[] = this.editor.labelSettings.labelItems;
        const labelItem: LabelItemModel = labelItems.find((item: LabelItemModel) => item.id === props.labelId);
        if (!labelItem) { return; }

        const labelChip: HTMLElement = this.editor.createElement('span', {
            id: content.id,
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
