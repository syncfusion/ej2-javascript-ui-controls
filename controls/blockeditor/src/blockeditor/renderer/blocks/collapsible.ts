import { BlockEditor, BlockType } from '../../base/index';
import { BlockModel, CollapsibleHeadingProps, CollapsibleProps } from '../../models/index';
import { getBlockModelById, createBaseSvg, createSvgElement } from '../../utils/index';
import * as constants from '../../base/constant';
import { BlockFactory } from '../../services/index';

export class CollapsibleRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders a initial level Collapsible block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @returns {HTMLElement} - The rendered Collapsible block element.
     */
    public renderCollapsibleBlock(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        const collapsibleProps: CollapsibleProps | CollapsibleHeadingProps = block.props as CollapsibleProps | CollapsibleHeadingProps;
        blockElement.setAttribute('data-collapsed', String(!collapsibleProps.isExpanded));
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
            this.updateCollapsibleBlockExpansion(blockElement, !collapsibleProps.isExpanded);
        });
        let headerElement: HTMLElement;
        switch (block.type) {
        case BlockType.CollapsibleParagraph:
            headerElement = this.editor.blockRendererManager.paragraphRenderer.renderParagraph(block, blockElement);
            break;
        case BlockType.CollapsibleHeading:
            headerElement = this.editor.blockRendererManager.headingRenderer.renderHeading(block, blockElement);
            break;
        }
        headerElement.style.width = '100%';
        headerElement.classList.add('e-block-content');
        const contentContainer: HTMLElement = this.editor.createElement('div', {
            className: 'e-toggle-content',
            attrs: { contenteditable: 'true' }
        });
        contentContainer.style.display = collapsibleProps.isExpanded ? 'block' : 'none';
        if (!collapsibleProps.children || (collapsibleProps.children && collapsibleProps.children.length === 0)) {
            if (!collapsibleProps.children) { collapsibleProps.children = []; }
            collapsibleProps.children[0] = BlockFactory.createParagraphBlock({
                parentId: block.id,
                content: [BlockFactory.createTextContent()]
            });
        }
        collapsibleProps.children.forEach((childBlock: BlockModel) => {
            const childBlockElement: HTMLElement = this.editor.blockRendererManager.createBlockElement(childBlock);
            contentContainer.appendChild(childBlockElement);
        });

        toggleHeaderWrapper.appendChild(toggleIcon);
        toggleHeaderWrapper.appendChild(headerElement);
        blockContent.appendChild(toggleHeaderWrapper);
        blockContent.appendChild(contentContainer);

        blockElement.classList.add('e-toggle-block');
        return blockContent;
    }

    /**
     * Updates the expansion state of a collapsible block.
     *
     * @param {HTMLElement} blockElement - The block element to update.
     * @param {boolean} newState - The new expansion state.
     * @returns {void}
     */
    public updateCollapsibleBlockExpansion = (blockElement: HTMLElement, newState: boolean): void => {
        const contentContainer: HTMLElement = blockElement.querySelector('.' + constants.TOGGLE_CONTENT_CLS) as HTMLElement;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        const updatedState: boolean = newState;

        (blockModel.props as CollapsibleProps).isExpanded = updatedState;

        blockElement.setAttribute('data-collapsed', String(!updatedState));
        contentContainer.style.display = updatedState ? 'block' : 'none';
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
}
