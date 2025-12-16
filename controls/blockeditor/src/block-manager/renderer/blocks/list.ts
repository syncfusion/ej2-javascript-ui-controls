import { BasePlaceholderProp, BlockModel, IChecklistBlockSettings } from '../../../models/index';
import { createBaseSvg, createSvgElement } from '../../../common/utils/index';
import { BlockType } from '../../../models/enums';
import { BlockManager } from '../../base/block-manager';
import { createElement } from '@syncfusion/ej2-base';

export class ListRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders a list item block
     *
     * This method creates and transforms list item elements based on the block type.
     * It handles both numbered and checklist types.
     *
     * @param {BlockModel} block - Specifies the block model containing data to render.
     * @param {HTMLElement} blockElement - The parent element that contains all block elements.
     * @returns {HTMLElement} - Returns the created or updated list container element.
     * @hidden
     */
    public renderListItem(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        const isNumberedList: boolean = block.blockType === BlockType.NumberedList;
        const isChecklist: boolean = block.blockType === BlockType.Checklist;
        const listType: string = isNumberedList ? 'ol' : 'ul';
        const listContainer: HTMLElement = createElement(listType, {});
        const listProps: BasePlaceholderProp = block.properties as BasePlaceholderProp;
        listProps.placeholder = this.parent.getPlaceholderValue(block);
        const listItem: HTMLElement = createElement('li', {
            attrs: {
                contenteditable: 'true',
                placeholder: listProps.placeholder
            }
        });

        this.parent.blockRenderer.contentRenderer.renderContent(block, listItem);

        if (isChecklist) {
            this.renderChecklist(block, blockElement);
        }

        listContainer.appendChild(listItem);
        return listContainer;
    }

    /**
     * Renders a checklist item
     *
     * @param {BlockModel} block - Specifies the block model containing data to render.
     * @param {HTMLElement} blockElement - The parent element that contains all block elements.
     * @returns {void}
     * @hidden
     */
    public renderChecklist(block: BlockModel, blockElement: HTMLElement): void {
        const checkmarkContainer: HTMLElement = createElement('div', {
            className: 'e-checkmark-container',
            attrs: { contenteditable: 'false', tabindex: '-1' }
        });
        const checkboxSvg: SVGSVGElement = this.renderUncheckedCheckmark();
        checkmarkContainer.appendChild(checkboxSvg);

        blockElement.prepend(checkmarkContainer);

        checkmarkContainer.addEventListener('click', (e: MouseEvent) => this.checkmarkClickListener(e, block));
    }

    private checkmarkClickListener(event: MouseEvent, block: BlockModel): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.parent.readOnly) { return; }
        const props: IChecklistBlockSettings = block.properties as IChecklistBlockSettings;
        this.toggleCheckedState(block, !props.isChecked);
    }

    /**
     * Toggles the checked state of a checklist item.
     *
     * @param {BlockModel} block - The block model of the checklist item.
     * @param {boolean} isChecked - The new checked state.
     * @param {boolean} isUndoRedoAction - specifies whether to track undo or redo action.
     * @returns {void}
     * @hidden
     */
    public toggleCheckedState(block: BlockModel, isChecked: boolean, isUndoRedoAction?: boolean): void {
        const props: IChecklistBlockSettings = block.properties as IChecklistBlockSettings;
        const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
        const listItem: HTMLElement = blockElement.querySelector('li');
        if (listItem && listItem.textContent.trim() !== '') {
            listItem.classList.toggle('e-checked', isChecked);

            const existingSvg: SVGSVGElement = blockElement.querySelector('svg');

            if (existingSvg) {
                while (existingSvg.firstChild) {
                    existingSvg.removeChild(existingSvg.firstChild);
                }
                const svgElements: SVGElement[] = isChecked ? this.getCheckedSvgElements() : this.getUncheckedSvgElements();
                svgElements.forEach((element: SVGElement) => existingSvg.appendChild(element));
            }
            props.isChecked = isChecked;
        }
        else {
            props.isChecked = false;
        }
        this.parent.stateManager.updateManagerBlocks();
        if (!isUndoRedoAction) {
            this.parent.undoRedoAction.trackCheckedStateForUndoRedo(block.id, props.isChecked);
        }
    }

    private getUncheckedSvgElements(): SVGElement[] {
        return [
            createSvgElement('path', {
                d: 'M6 2.5H18C19.933 2.5 21.5 4.067 21.5 6V18C21.5 19.933 19.933 21.5 18 21.5H6C4.067 21.5 2.5 19.933 2.5 18V6C2.5 4.067 4.067 2.5 6 2.5Z',
                class: 'e-checkmark-border'
            })
        ];
    }

    private getCheckedSvgElements(): SVGElement[] {
        return [
            // Background rectangle that will use theme colors
            createSvgElement('rect', {
                x: '0.5',
                y: '2.5',
                width: '19',
                height: '19',
                rx: '3.5',
                class: 'e-checkmark-bg'
            }),
            // Border rectangle
            createSvgElement('rect', {
                x: '0.5',
                y: '2.5',
                width: '19',
                height: '19',
                rx: '3.5',
                class: 'e-checkmark-border'
            }),
            // Checkmark path (always white)
            createSvgElement('path', {
                d: 'M14.2656 7.73438H14.3906L14.5156 7.76562L14.6406 7.78125L14.7656 7.82812L14.875 7.89062L14.9844 7.95312L15.0938 8.03125L15.1875 8.125L15.2812 8.21875L15.3594 8.32812L15.4219 8.4375L15.4844 8.54688L15.5312 8.67188L15.5469 8.79688L15.5781 8.92188V9.04688V9.17188L15.5469 9.29688L15.5312 9.42188L15.4844 9.54688L15.4219 9.65625L15.3594 9.76562L15.2812 9.875L15.1875 9.96875L9.28125 15.875L9.1875 15.9688L9.07812 16.0469L8.96875 16.1094L8.85938 16.1719L8.73438 16.2188L8.60938 16.2344L8.48438 16.2656H8.35938H8.23438L8.10938 16.2344L7.98438 16.2188L7.85938 16.1719L7.75 16.1094L7.64062 16.0469L7.53125 15.9688L7.4375 15.875L4.8125 13.25L4.71875 13.1562L4.64062 13.0469L4.57812 12.9375L4.51562 12.8281L4.46875 12.7031L4.45312 12.5781L4.42188 12.4531V12.3281V12.2031L4.45312 12.0781L4.46875 11.9531L4.51562 11.8281L4.57812 11.7188L4.64062 11.6094L4.71875 11.5L4.8125 11.4062L4.90625 11.3125L5.01562 11.2344L5.125 11.1719L5.23438 11.1094L5.35938 11.0625L5.48438 11.0469L5.60938 11.0156H5.73438H5.85938L5.98438 11.0469L6.10938 11.0625L6.23438 11.1094L6.34375 11.1719L6.45312 11.2344L6.5625 11.3125L6.65625 11.4062L8.35938 13.0938L13.3438 8.125L13.4375 8.03125L13.5469 7.95312L13.6562 7.89062L13.7656 7.82812L13.8906 7.78125L14.0156 7.76562L14.1406 7.73438H14.2656Z',
                class: 'e-checkmark-color'
            })
        ];
    }

    private renderUncheckedCheckmark(): SVGSVGElement {
        const svg: SVGSVGElement = createBaseSvg();

        this.getUncheckedSvgElements().forEach((element: SVGElement) => {
            svg.appendChild(element);
        });

        return svg;
    }
}
