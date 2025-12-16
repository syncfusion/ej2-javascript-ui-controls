import { BasePlaceholderProp, BaseStylesProp, BlockModel, ContentModel, ILabelContentSettings, LabelItemModel, IMentionContentSettings, StyleModel, UserModel } from '../../../models/index';
import { createFormattingElement } from '../../../common/utils/dom';
import { getAccessibleTextColor, getAutoAvatarColor, getUserInitials, normalizeUrl } from '../../../common/utils/common';
import { ContentType } from '../../../models/enums';
import { BlockManager } from '../../base/block-manager';
import { ILinkContentSettings } from '../../../models';
import { LinkData } from '../../../common/interface';
import { createElement } from '@syncfusion/ej2-base';

/**
 * `Content renderer` module is used to render content in Blocks.
 *
 * @hidden
 */
export class ContentRenderer {

    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders the actual content of a block.
     *
     * @param {BlockModel} block - The block model containing the content.
     * @param {HTMLElement} contentElement - The HTML element where the content will be rendered.
     * @returns {void}
     * @hidden
     */
    public renderContent(block: BlockModel, contentElement: HTMLElement): void {
        if (block.content && block.content.length > 0) {
            if (contentElement) {
                contentElement.innerHTML = '';
            }
            if (block.content.length === 1) {
                const props: BaseStylesProp = block.content[0].properties as BaseStylesProp;
                const styles: Partial<Record<keyof StyleModel, string | boolean>> | {} = props ? props.styles : {};
                const isEmptyStyles: boolean = !styles || Object.keys(styles).length === 0;
                const isDirectText: boolean = isEmptyStyles && block.content[0].contentType === ContentType.Text;
                this.invokeContentRenderer(
                    block,
                    block.content[0],
                    contentElement,
                    isDirectText
                );
            }
            else {
                block.content.forEach((content: ContentModel) => {
                    this.invokeContentRenderer(block, content, contentElement);
                });
            }
        }
        else {
            this.renderText(null, contentElement, true);
            if (contentElement) {
                contentElement.innerHTML = (!(block.properties as BasePlaceholderProp).placeholder)
                    ? '<br>'
                    : contentElement.innerHTML;
            }
        }
        this.parent.stateManager.updateManagerBlocks();
    }

    private invokeContentRenderer(
        block: BlockModel,
        contentModel: ContentModel,
        contentElement: HTMLElement,
        isDirectText?: boolean): void {
        switch (contentModel.contentType) {
        case ContentType.Text:
            this.renderText(contentModel, contentElement, isDirectText);
            break;
        case ContentType.Link:
            this.renderAnchor(contentModel, contentElement);
            break;
        case ContentType.Mention:
            this.renderMention(contentModel, contentElement);
            break;
        case ContentType.Label:
            this.renderLabel(contentModel, contentElement);
            break;
        }
        if (contentElement) {
            contentElement.innerHTML = (!(block.properties as BasePlaceholderProp).placeholder && !contentModel.content)
                ? '<br>'
                : contentElement.innerHTML;
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

        content.content = this.parent.serializeValue(content.content);
        if (isDirectText) {
            contentElement.id = content.id;
            contentElement.textContent = content.content;
        }
        else {
            const node: HTMLElement = createFormattingElement(content);
            contentElement.appendChild(node);
        }
    }

    public renderAnchor(content: ContentModel, contentElement: HTMLElement): void {
        const props: ILinkContentSettings = content.properties as ILinkContentSettings;
        props.url = normalizeUrl(props.url);
        content.content = this.parent.serializeValue(content.content);
        const linkData: LinkData = {
            url: props.url
        };
        const formattedElement: HTMLElement = createFormattingElement(content, linkData);
        contentElement.appendChild(formattedElement);
    }

    private renderMention(content: ContentModel, contentElement: HTMLElement): void {
        const props: IMentionContentSettings = content.properties as IMentionContentSettings;
        const userModel: UserModel = this.parent.users.find((user: UserModel) => user.id.toLowerCase() === props.userId);
        if (!userModel) { return; }

        const name: string = userModel.user.trim();
        const initials: string = getUserInitials(name);
        const backgroundColor: string = userModel.avatarBgColor || getAutoAvatarColor(userModel.id);
        const avatarUrl: string = userModel.avatarUrl || '';
        const wrapper: HTMLElement = createElement('div', {
            id: content.id,
            className: 'e-mention-chip e-user-chip',
            attrs: {
                'data-user-id': userModel.id,
                contenteditable: 'false'
            }
        });
        const avatar: HTMLElement = createElement('div', {
            className: 'em-avatar',
            attrs: {
                style: `background-color: ${backgroundColor};`
            }
        });
        if (avatarUrl) {
            const avatarImg: HTMLImageElement = createElement('img', {
                className: 'em-img',
                attrs: {
                    src: avatarUrl,
                    alt: userModel.user
                }
            }) as HTMLImageElement;
            avatar.appendChild(avatarImg);
        }
        else {
            const initial: HTMLElement = createElement('div', {
                className: 'em-initial'
            });
            initial.innerText = initials;
            avatar.appendChild(initial);
        }
        const userNameContent: HTMLElement = createElement('div', {
            className: 'em-content'
        });
        userNameContent.innerText = userModel.user;
        content.content = userModel.user;

        wrapper.appendChild(avatar);
        wrapper.appendChild(userNameContent);
        contentElement.appendChild(wrapper);
    }

    private renderLabel(content: ContentModel, contentElement: HTMLElement): void {
        const props: ILabelContentSettings = content.properties as ILabelContentSettings;
        const items: LabelItemModel[] = this.parent.labelSettings.items;
        const labelItem: LabelItemModel = items.find((item: LabelItemModel) => item.id === props.labelId);
        if (!labelItem) { return; }

        const labelChip: HTMLElement = createElement('span', {
            id: content.id,
            className: 'e-mention-chip e-label-chip',
            styles: `background: ${labelItem.labelColor};color: ${getAccessibleTextColor(labelItem.labelColor)};`,
            attrs: {
                'data-label-id': labelItem.id,
                contenteditable: 'false'
            }
        });
        labelChip.innerText = `${labelItem.groupBy}: ${labelItem.text}`;
        content.content = `${labelItem.groupBy}: ${labelItem.text}`;
        contentElement.appendChild(labelChip);
    }

}
