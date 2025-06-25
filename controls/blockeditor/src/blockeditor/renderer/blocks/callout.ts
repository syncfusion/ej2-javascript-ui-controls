import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { generateUniqueId, getBlockContentElement, getBlockIndexById, createBaseSvg, createSvgElement } from '../../utils/index';
import { appendDocumentNodes } from './block-utils';


export class CalloutRenderer {
    private editor: BlockEditor;
    private parent: BlockAction;

    constructor(editor: BlockEditor, parent: BlockAction) {
        this.editor = editor;
        this.parent = parent;
    }

    private renderCalloutIcon(): SVGSVGElement {
        const svg: SVGSVGElement = createBaseSvg();

        svg.append(
            createSvgElement('path', {
                d: 'M14 22H10C8.89543 22 8 21.1046 8 20V17H16V20C16 21.1046 15.1046 22 14 22Z',
                fill: '#7DA6FF'
            }),
            createSvgElement('circle', {
                cx: '12',
                cy: '9.5',
                r: '7.5',
                stroke: '#4D4B4B',
                'stroke-width': '2'
            }),
            createSvgElement('path', {
                d: 'M14 22.5H10C8.89543 22.5 8 21.6046 8 20.5V16H16V20.5C16 21.6046 15.1046 22.5 14 22.5Z',
                stroke: '#4D4B4B',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round'
            }),
            createSvgElement('circle', {
                cx: '12',
                cy: '9.5',
                r: '7.5',
                fill: '#FFCA26'
            }),
            createSvgElement('path', {
                d: 'M19.5 9.5C19.5 13.6421 16.1421 17 12 17C12 17 15.5 13.6421 15.5 9.5C15.5 5.35786 12 2 12 2C16.1421 2 19.5 5.35786 19.5 9.5Z',
                fill: '#F39F00'
            }),
            createSvgElement('path', {
                d: 'M8 19C10.5 20.5 13 20.5 16 19',
                stroke: '#4D4B4B'
            })
        );

        return svg;
    }

    /**
     * Renders a initial level callout block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @param {boolean} isTransform - Indicates if the block is being transformed.
     * @returns {HTMLElement} - The rendered callout block element.
     */
    public renderCallout(block: BlockModel, blockElement: HTMLElement, isTransform?: boolean): HTMLElement {
        blockElement.classList.add('e-callout-block');
        const calloutWrapper: HTMLElement = this.editor.createElement('div', {
            className: 'e-callout-wrapper',
            attrs: { contenteditable: 'true' }
        });
        const iconContainer: HTMLElement = this.editor.createElement('div', {
            className: 'e-callout-icon',
            attrs: { contenteditable: 'false' }
        });
        iconContainer.appendChild(this.renderCalloutIcon());
        const contentContainer: HTMLElement = this.editor.createElement('div', {
            className: 'e-callout-content',
            attrs: { contenteditable: 'true' }
        });
        if (block.children && block.children.length === 0) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            block.children[0] = {
                id: generateUniqueId('block'),
                parentId: block.id,
                type: 'Paragraph',
                indent: 0
            };
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
        calloutWrapper.appendChild(iconContainer);
        calloutWrapper.appendChild(contentContainer);

        if (isTransform) {
            appendDocumentNodes(blockElement, calloutWrapper, getBlockContentElement(blockElement));
        }

        return calloutWrapper;
    }
}
