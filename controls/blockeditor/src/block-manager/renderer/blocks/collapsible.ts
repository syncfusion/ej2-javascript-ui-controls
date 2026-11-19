import { BlockModel, ICollapsibleHeadingBlockSettings, ICollapsibleBlockSettings } from '../../../models/index';
import { getBlockModelById, createBaseSvg, createSvgElement } from '../../../common/utils/index';
import * as constants from '../../../common/constant';
import { BlockType } from '../../../models/enums';
import { BlockManager } from '../../base/block-manager';
import { createElement, updateCSSText } from '@syncfusion/ej2-base';

export class CollapsibleRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders a initial level Collapsible block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @returns {HTMLElement} - The rendered Collapsible block element.
     */
    public renderCollapsibleBlock(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        const collapsibleProps: ICollapsibleBlockSettings | ICollapsibleHeadingBlockSettings = block.properties as
                                ICollapsibleBlockSettings | ICollapsibleHeadingBlockSettings;
        blockElement.setAttribute('data-collapsed', String(!collapsibleProps.isExpanded));
        const blockContent: HTMLElement = createElement('div');
        const toggleHeaderWrapper: HTMLElement = createElement('div', {
            className: 'e-toggle-header'
        });
        const toggleIcon: HTMLElement = createElement('div', {
            className: 'e-toggle-icon',
            attrs: { contenteditable: 'false' }
        });
        toggleIcon.appendChild(this.renderToggleIcon());
        toggleIcon.addEventListener('click', () => {
            this.updateCollapsibleBlockExpansion(blockElement, !collapsibleProps.isExpanded);
        });
        let headerElement: HTMLElement;
        switch (block.blockType) {
        case BlockType.CollapsibleParagraph:
            headerElement = this.parent.blockRenderer.paragraphRenderer.renderParagraph(block);
            break;
        case BlockType.CollapsibleHeading:
            headerElement = this.parent.blockRenderer.headingRenderer.renderHeading(block);
            break;
        }
        updateCSSText(headerElement, 'width: 100%;');
        headerElement.classList.add('e-block-content');
        const contentContainer: HTMLElement = createElement('div', {
            className: 'e-toggle-content',
            attrs: { contenteditable: 'true' }
        });
        updateCSSText(contentContainer, `display: ${collapsibleProps.isExpanded ? 'block' : 'none'};`);
        collapsibleProps.children.forEach((childBlock: BlockModel) => {
            const childBlockElement: HTMLElement = this.parent.blockRenderer.createBlockElement(childBlock);
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
     * @param {boolean} isUndoRedoAction - Whether it is invoked through UndoRedo
     * @returns {void}
     */
    public updateCollapsibleBlockExpansion = (blockElement: HTMLElement, newState: boolean, isUndoRedoAction?: boolean): void => {
        const contentContainer: HTMLElement = blockElement.querySelector('.' + constants.TOGGLE_CONTENT_CLS) as HTMLElement;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const updatedState: boolean = newState;

        (blockModel.properties as ICollapsibleBlockSettings).isExpanded = updatedState;
        this.parent.stateManager.updateManagerBlocks();

        blockElement.setAttribute('data-collapsed', String(!updatedState));
        updateCSSText(contentContainer, `display: ${updatedState ? 'block' : 'none'};`);
        if (!isUndoRedoAction) {
            this.parent.undoRedoAction.trackExpandedStateForUndoRedo(blockModel.id,
                                                                     (blockModel.properties as ICollapsibleBlockSettings).isExpanded);
        }
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
