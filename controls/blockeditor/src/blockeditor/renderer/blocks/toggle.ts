import { BlockAction } from '../../actions/index';
import { BlockEditor, BlockType } from '../../base/index';
import { BlockModel } from '../../models/index';
import { generateUniqueId, getBlockContentElement, getBlockIndexById, getBlockModelById, createBaseSvg, createSvgElement } from '../../utils/index';
import { appendDocumentNodes } from './block-utils';


export class ToggleRenderer {
    private editor: BlockEditor;
    private parent: BlockAction;

    constructor(editor: BlockEditor, parent: BlockAction) {
        this.editor = editor;
        this.parent = parent;
    }

    private renderToggleIcon(): SVGSVGElement {
        const svg: SVGSVGElement = createBaseSvg();

        const commonPathD: string =
            'M5 20.1315V3.86852C5 3.06982 5.89014 2.59343 6.5547 3.03647L18.7519 11.1679C19.3457 11.5638 19.3457 12.4362 18.7519 12.8321L6.5547 20.9635C5.89015 21.4066 5 20.9302 5 20.1315Z';

        const pathStroke: SVGPathElement = createSvgElement('path', {
            d: commonPathD,
            stroke: '#4D4B4B',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        });

        const pathFill: SVGPathElement = createSvgElement('path', {
            d: commonPathD,
            fill: '#4D4B4B'
        });

        svg.append(pathStroke, pathFill);
        return svg;
    }

    /**
     * Renders a initial level toggle block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @param {boolean} isTransform - Indicates if the block is being transformed.
     * @returns {HTMLElement} - The rendered toggle block element.
     */
    public renderToggleBlock(block: BlockModel, blockElement: HTMLElement, isTransform?: boolean): HTMLElement {
        blockElement.setAttribute('data-collapsed', String(!block.isExpanded));
        const blockContent: HTMLElement = this.editor.createElement('div');
        const toggleHeaderWrapper: HTMLElement = this.editor.createElement('div', {
            className: 'e-toggle-header'
        });
        const toggleIcon: HTMLElement = this.editor.createElement('div', {
            className: 'e-toggle-icon',
            attrs: { contenteditable: 'false' }
        });
        toggleIcon.appendChild(this.renderToggleIcon());
        toggleIcon.addEventListener('click', () => {
            this.updateToggleBlockExpansion(blockElement, !block.isExpanded);
        });
        let headerElement: HTMLElement;
        switch (block.type) {
        case BlockType.ToggleParagraph:
            headerElement = this.parent.paragraphRenderer.renderParagraph(block, blockElement);
            break;
        case BlockType.ToggleHeading1:
        case BlockType.ToggleHeading2:
        case BlockType.ToggleHeading3:
        case BlockType.ToggleHeading4:
            headerElement = this.parent.headingRenderer.renderHeading(block, blockElement);
            break;
        }
        headerElement.style.width = '100%';
        headerElement.classList.add('e-block-content');
        const contentContainer: HTMLElement = this.editor.createElement('div', {
            className: 'e-toggle-content',
            attrs: { contenteditable: 'true' }
        });
        contentContainer.style.display = block.isExpanded ? 'block' : 'none';
        if (block.children && block.children.length === 0) {
            const childBlock: BlockModel = {
                id: generateUniqueId('block'),
                type: 'Paragraph',
                indent: 0,
                parentId: block.id
            };
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            block.children.push(childBlock);
            (this.editor as any).isProtectedOnChange = prevOnChange;
            const parentIndex: number = getBlockIndexById(block.id, this.editor.blocksInternal);
            (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any).setProperties({ children: block.children }, true);
            /* eslint-enable @typescript-eslint/no-explicit-any */
            this.editor.blockAction.updatePropChangesToModel();
        }
        block.children.forEach((childBlock: BlockModel) => {
            const childBlockElement: HTMLElement = this.editor.blockAction.createBlockElement(childBlock);
            contentContainer.appendChild(childBlockElement);
        });
        toggleHeaderWrapper.appendChild(toggleIcon);
        toggleHeaderWrapper.appendChild(headerElement);
        blockContent.appendChild(toggleHeaderWrapper);
        blockContent.appendChild(contentContainer);

        if (isTransform) {
            appendDocumentNodes(blockElement, blockContent, getBlockContentElement(blockElement));
        }
        blockElement.classList.add('e-toggle-block');
        return blockContent;
    }

    /**
     * Updates the expansion state of a toggle block.
     *
     * @param {HTMLElement} blockElement - The block element to update.
     * @param {boolean} newState - The new expansion state.
     * @returns {void}
     */
    public updateToggleBlockExpansion = (blockElement: HTMLElement, newState: boolean): void => {
        const contentContainer: HTMLElement = blockElement.querySelector('.e-toggle-content') as HTMLElement;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        const updatedState: boolean = newState;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        blockModel.isExpanded = updatedState;
        (this.editor as any).isProtectedOnChange = prevOnChange;
        // (this.editor.blocksInternal[parseInt(blockIndex.toString(), 10)] as any).setProperties({ isExpanded: updatedState }, true);
        /* eslint-enable @typescript-eslint/no-explicit-any */
        blockElement.setAttribute('data-collapsed', String(!updatedState));
        contentContainer.style.display = updatedState ? 'block' : 'none';
    }
}
