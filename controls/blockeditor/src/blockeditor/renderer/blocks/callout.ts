import { BlockEditor } from '../../base/index';
import { BlockModel, CalloutProps } from '../../models/index';
import { createBaseSvg, createSvgElement } from '../../utils/index';
import { BlockFactory } from '../../services/index';
import * as constants from '../../base/constant';

export class CalloutRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders a initial level callout block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @returns {HTMLElement} - The rendered callout block element.
     * @hidden
     */
    public renderCallout(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        blockElement.classList.add(constants.CALLOUT_BLOCK_CLS);
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
        const props: CalloutProps = block.props as CalloutProps;
        if (!props.children || (props.children && props.children.length === 0)) {
            if (!props.children) { props.children = []; }

            props.children[0] = BlockFactory.createParagraphBlock({
                parentId: block.id,
                content: [BlockFactory.createTextContent()]
            });
        }
        props.children.forEach((childBlock: BlockModel) => {
            const childBlockElement: HTMLElement = this.editor.blockRendererManager.createBlockElement(childBlock);
            contentContainer.appendChild(childBlockElement);
        });
        calloutWrapper.appendChild(iconContainer);
        calloutWrapper.appendChild(contentContainer);

        return calloutWrapper;
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
}
