import { createElement } from '@syncfusion/ej2-base';
import { BlockModel, IHeadingBlockSettings } from '../../../models/index';
import { BlockManager } from '../../base/block-manager';

export class HeadingRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders heading block
     *
     * @param {BlockModel} block - specifies the block.
     * @returns {HTMLElement} - the created or updated element
     * @hidden
     */
    public renderHeading(block: BlockModel): HTMLElement {
        const headingProps: IHeadingBlockSettings = block.properties as IHeadingBlockSettings;
        headingProps.placeholder = this.parent.getPlaceholderValue(block);

        const heading: HTMLElement = createElement(`h${headingProps.level}`, {
            attrs: {
                contenteditable: 'true',
                placeholder: headingProps.placeholder
            }
        });
        this.parent.blockRenderer.contentRenderer.renderContent(block, heading);

        return heading;
    }
}
