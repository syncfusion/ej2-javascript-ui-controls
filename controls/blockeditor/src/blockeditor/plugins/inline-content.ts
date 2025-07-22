import { attributes, detach } from '@syncfusion/ej2-base';
import { BlockEditor, ContentType, IInlineContentInsertionArgs } from '../base/index';
import { BlockModel, ContentModel, LabelItemModel, UserModel } from '../models/index';
import { deepClone, generateUniqueId, getAccessibleTextColor, getBlockIndexById, getBlockModelById, removeEmptyTextNodes, sanitizeContent, setCursorPosition } from '../utils/index';

interface IProcessedNodes {
    fragment: DocumentFragment
    content: ContentModel[]
}

export class InlineContentInsertionModule {
    private editor: BlockEditor;
    private currentArgs: IInlineContentInsertionArgs;
    private readonly formattedNodeTags: string[] = ['STRONG', 'SPAN', 'EM', 'U', 'S', 'SUB', 'SUP', 'A'];

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on('inline-content-inserted', this.handleInsertion, this);
        this.editor.on('destroy', this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off('inline-content-inserted', this.handleInsertion);
        this.editor.off('destroy', this.destroy);
    }

    private handleInsertion(args: IInlineContentInsertionArgs): void {
        this.currentArgs = args;
        this.handleInlineContentInsertion();
    }

    private handleInlineContentInsertion(): void {
        const { range, contentType, blockElement }: IInlineContentInsertionArgs = this.currentArgs;
        if (!range || !blockElement) { return; }

        const rangeParent: HTMLElement = this.getRangeParent(range);

        const insertedNode: HTMLElement = this.findInsertedNode(contentType, rangeParent);

        this.splitAndReorganizeContent(insertedNode, contentType, rangeParent);
    }

    private getRangeParent(range: Range): HTMLElement {
        return range.startContainer.nodeType === Node.TEXT_NODE
            ? range.startContainer.parentElement
            : (range.startContainer as HTMLElement);
    }

    private findInsertedNode(contentType: ContentType, rangeParent: HTMLElement): HTMLElement | null {
        const contentClassMap: { [key: string]: string } = {
            [ContentType.Mention]: 'e-mention-chip',
            [ContentType.Label]: 'e-mention-chip'
        };

        return rangeParent.querySelector(`.${contentClassMap[`${contentType}`]}`) as HTMLElement;
    }

    private splitAndReorganizeContent(insertedNode: HTMLElement, contentType: ContentType, rangeParent: HTMLElement): void {
        const { block }: IInlineContentInsertionArgs = this.currentArgs;
        const blockIndex: number = getBlockIndexById(block.id, this.editor.blocksInternal);

        const blockContentElement: HTMLElement = rangeParent.closest('.e-block-content') as HTMLElement;
        if (!blockContentElement) { return; }

        const nodesToProcess: Node[] = Array.from(rangeParent.childNodes);
        const insertionIndex: number = nodesToProcess.indexOf(insertedNode);
        if (insertionIndex === -1) { return; }

        const affectingContent: ContentModel = block.content.find((content: ContentModel) => content.id === rangeParent.id);
        if (!affectingContent) { return; }

        const isPlainTextBlock: boolean = this.isPlainTextBlock(rangeParent, block);
        const shouldCreateFreshFormatting: boolean = isPlainTextBlock &&
            (this.isInsertedElementOnlyChild(rangeParent, insertedNode) || this.hasTextSiblings(insertedNode));
        const beforeNodes: Node[] = nodesToProcess.slice(0, insertionIndex);
        const afterNodes: Node[] = nodesToProcess.slice(insertionIndex + 1);

        const beforeEntity: IProcessedNodes = this.processNodes(
            beforeNodes,
            rangeParent,
            affectingContent,
            shouldCreateFreshFormatting
        );

        const insertedContent: ContentModel = this.createInlineContentModel(insertedNode, contentType);

        const afterEntity: IProcessedNodes = this.processNodes(
            afterNodes,
            rangeParent,
            affectingContent,
            shouldCreateFreshFormatting,
            true // Generate new IDs for after nodes
        );

        const newFragment: DocumentFragment = document.createDocumentFragment();
        if (beforeEntity.fragment.childNodes.length) {
            newFragment.appendChild(beforeEntity.fragment);
        }

        if (this.currentArgs.contentType === ContentType.Mention) {
            const user: UserModel = this.currentArgs.itemData as UserModel;
            const wrapper: HTMLElement = this.editor.createElement('div', {
                id: insertedContent.dataId,
                className: 'e-mention-chip e-user-chip',
                innerHTML: insertedNode.innerHTML,
                attrs: {
                    'data-user-id': user.id,
                    contenteditable: 'false'
                }
            });
            newFragment.appendChild(wrapper);
            detach(insertedNode);
        }
        else if (this.currentArgs.contentType === ContentType.Label) {
            const labelItem: LabelItemModel = this.currentArgs.itemData as LabelItemModel;
            attributes(insertedNode, {
                id: insertedContent.dataId,
                class: 'e-mention-chip e-label-chip',
                style: `background: ${labelItem.labelColor};color: ${getAccessibleTextColor(labelItem.labelColor)};`,
                'data-label-id': labelItem.id
            });
            newFragment.appendChild(insertedNode);
        }

        if (afterEntity.fragment.childNodes.length) {
            newFragment.appendChild(afterEntity.fragment);
        }

        if (shouldCreateFreshFormatting) {
            blockContentElement.appendChild(newFragment);
        } else {
            blockContentElement.insertBefore(newFragment, rangeParent);
            rangeParent.remove();
        }
        removeEmptyTextNodes(blockContentElement);
        const affectingIndex: number = block.content.indexOf(affectingContent);
        const newContentModels: ContentModel[] = [...beforeEntity.content, insertedContent, ...afterEntity.content];
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        block.content.splice(affectingIndex, 1, ...newContentModels);
        const parentBlock: BlockModel = getBlockModelById(block.parentId, this.editor.blocksInternal);
        if (parentBlock) {
            (parentBlock.children[blockIndex as number] as any).setProperties({ content: block.content }, true);
        }
        else {
            (this.editor.blocksInternal[blockIndex as number] as any).setProperties({ content: block.content }, true);
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
        /* eslint-enable @typescript-eslint/no-explicit-any */
        this.editor.blockAction.updatePropChangesToModel();
        const nextSibling: HTMLElement = insertedNode.nextElementSibling as HTMLElement;
        if (nextSibling) {
            setCursorPosition(nextSibling, 0);
        }
    }

    private processNodes(
        nodes: Node[],
        parentElement: HTMLElement,
        baseContentModel: ContentModel,
        freshFormatting: boolean,
        generateNewIds: boolean = false
    ): IProcessedNodes {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const contentModels: ContentModel[] = [];

        nodes.forEach((node: Node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent !== '') {
                const [newContent]: ContentModel[] = deepClone(sanitizeContent([baseContentModel]));
                newContent.id = generateNewIds ? generateUniqueId('content') : newContent.id;
                newContent.content = node.textContent;

                if (freshFormatting) {
                    const span: HTMLElement = document.createElement('span');
                    span.textContent = newContent.content;
                    span.id = newContent.id;
                    fragment.appendChild(span);
                } else {
                    const clone: HTMLElement = parentElement.cloneNode(true) as HTMLElement;
                    clone.textContent = node.textContent;
                    clone.id = newContent.id;
                    fragment.appendChild(clone);
                }

                contentModels.push(newContent);
                parentElement.removeChild(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                fragment.appendChild(node.cloneNode(true));
                parentElement.removeChild(node);
            }
        });

        return { fragment, content: contentModels };
    }

    private isPlainTextBlock(element: HTMLElement, block: BlockModel): boolean {
        return (
            this.formattedNodeTags.indexOf(element.tagName) === -1 &&
            block.content.length === 1
        );
    }

    private isInsertedElementOnlyChild(parent: HTMLElement, insertedElement: HTMLElement): boolean {
        return parent.childElementCount === 1 && parent.firstChild === insertedElement;
    }

    private hasTextSiblings(node: Node): boolean {
        return (
            (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE) ||
            (node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE)
        );
    }

    private createInlineContentModel(element: HTMLElement, contentType: ContentType): ContentModel {
        const user: UserModel = this.currentArgs.itemData as UserModel;
        const labelItem: LabelItemModel = this.currentArgs.itemData as LabelItemModel;

        const contentID: string = contentType === ContentType.Mention ? user.id : labelItem.id;
        const contentValue: string = contentType === ContentType.Mention ? user.user : element.innerText;
        return {
            id: contentID,
            type: contentType,
            content: contentValue,
            dataId: generateUniqueId(contentID)
        };
    }

    public destroy(): void {
        this.removeEventListeners();
    }
}
