import { BasePlaceholderProp, BaseStylesProp, BlockModel, ContentModel, ILabelContentSettings, LabelItemModel, IMentionContentSettings, StyleModel, UserModel } from '../../../models/index';
import { createFormattingElement } from '../../../common/utils/dom';
import { getAccessibleTextColor, getAutoAvatarColor, getUserInitials, normalizeUrl } from '../../../common/utils/common';
import { BlockType, ContentType } from '../../../models/enums';
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
            // clear html and render again
            if (contentElement) { contentElement.innerHTML = ''; }

            block.content.forEach((content: ContentModel) => {
                const node: Node = this.invokeContentRenderer(block, content);
                if (node && contentElement) {
                    contentElement.appendChild(node);
                }
            });
        }
        else {
            const emptyNode: Node = this.renderText(null);
            if (emptyNode && contentElement) {
                contentElement.appendChild(emptyNode);
                if (!(block.properties as BasePlaceholderProp).placeholder) {
                    const br: HTMLElement = document.createElement('br');
                    contentElement.appendChild(br);
                }
            }
        }
        this.parent.stateManager.updateManagerBlocks();
    }

    /**
     * Invokes appropriate content renderer based on content type.
     * Pure function - creates and returns nodes without side effects.
     *
     * @param {BlockModel} block - The block model
     * @param {ContentModel} contentModel - The content model to render
     * @returns {Node} - The created node
     * @hidden
     */
    public invokeContentRenderer(block: BlockModel, contentModel: ContentModel): Node {
        let node: Node = null;

        switch (contentModel.contentType) {
        case ContentType.Text:
            node = this.renderText(contentModel);
            break;
        case ContentType.Link:
            node = this.renderAnchor(contentModel);
            break;
        case ContentType.Mention:
            node = this.renderMention(contentModel);
            break;
        case ContentType.Label:
            node = this.renderLabel(contentModel);
            break;
        }
        // Add <br> if placeholder check is needed and content is empty
        if (node && !contentModel.content && !(block.properties as BasePlaceholderProp).placeholder) {
            const container: HTMLElement = document.createElement('span');
            container.appendChild(node);
            const br: HTMLElement = document.createElement('br');
            container.appendChild(br);
            return container;
        }
        return node;
    }

    /**
     * Renders text content as a pure function.
     * Creates and returns text node with applied formatting.
     *
     * @param {ContentModel} content - The content model to render
     * @returns {Node} - The created text node
     * @hidden
     */
    public renderText(content: ContentModel): Node {
        if (!content) {
            return document.createTextNode('');
        }

        const formattedNode: Node = createFormattingElement(content);
        return formattedNode;
    }

    /**
     * Renders link/anchor content as a pure function.
     * Creates and returns anchor node with applied formatting.
     *
     * @param {ContentModel} content - The content model to render
     * @returns {Node} - The created anchor node
     * @hidden
     */
    public renderAnchor(content: ContentModel): Node {
        const props: ILinkContentSettings = content.properties as ILinkContentSettings;
        props.url = normalizeUrl(props.url);
        const linkData: LinkData = {
            url: props.url
        };
        const formattedNode: Node = createFormattingElement(content, linkData);
        return formattedNode;
    }

    /**
     * Renders mention/user chip as a pure function.
     * Creates and returns mention element without appending.
     *
     * @param {ContentModel} content - The content model with mention properties
     * @returns {Node} - The created mention element
     * @hidden
     */
    public renderMention(content: ContentModel): Node {
        const props: IMentionContentSettings = content.properties as IMentionContentSettings;
        const userModel: UserModel = this.parent.users.find((user: UserModel) => user.id.toLowerCase() === props.userId);
        if (!userModel) { return null; }

        const name: string = userModel.user.trim();
        const initials: string = getUserInitials(name);
        const backgroundColor: string = userModel.avatarBgColor || getAutoAvatarColor(userModel.id);
        const avatarUrl: string = userModel.avatarUrl || '';
        const wrapper: HTMLElement = createElement('div', {
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
        return wrapper;
    }

    /**
     * Renders label/tag chip as a pure function.
     * Creates and returns label element without appending.
     *
     * @param {ContentModel} content - The content model with label properties
     * @returns {Node} - The created label element
     * @hidden
     */
    public renderLabel(content: ContentModel): Node {
        const props: ILabelContentSettings = content.properties as ILabelContentSettings;
        const items: LabelItemModel[] = this.parent.labelSettings.items;
        const labelItem: LabelItemModel = items.find((item: LabelItemModel) => item.id === props.labelId);
        if (!labelItem) { return null; }

        const labelChip: HTMLElement = createElement('span', {
            className: 'e-mention-chip e-label-chip',
            styles: `background: ${labelItem.labelColor};color: ${getAccessibleTextColor(labelItem.labelColor)};`,
            attrs: {
                'data-label-id': labelItem.id,
                contenteditable: 'false'
            }
        });
        labelChip.innerText = `${labelItem.groupBy}: ${labelItem.text}`;
        content.content = `${labelItem.groupBy}: ${labelItem.text}`;
        return labelChip;
    }

}
