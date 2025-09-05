import { BlockType, ContentType } from '../base/enums';
import { BlockModel, ContentModel } from '../models/index';
import { generateUniqueId } from './common';
import * as constants from '../base/constant';
import { BlockFactory } from '../services/index';

/**
 * Generates plain text representation of blocks for external clipboard
 *
 * @param {BlockModel[]} blocks - Block models to convert to plain text
 * @returns {string} Plain text representation of blocks
 */
export function generatePlainTextForExternalClipboard(blocks: BlockModel[]): string {
    const textParts: string[] = [];

    blocks.forEach((block: BlockModel) => {
        if (block.type === BlockType.BulletList) {
            textParts.push(`• ${getBlockText(block)}\n`);
        } else if (block.type === BlockType.NumberedList) {
            const blockElement: HTMLElement = document.getElementById(block.id);
            const listItem: HTMLElement = blockElement.querySelector('li');
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(listItem);
            const marker: string = computedStyle.getPropertyValue('list-style-type');
            textParts.push(`${marker}${getBlockText(block)}\n`);
        } else if (block.type === BlockType.Divider) {
            textParts.push('---\n');
        } else {
            textParts.push(`${getBlockText(block)}\n`);
        }
    });

    return textParts.join('');
}

/**
 * Creates block model from plain clipboard text
 *
 * @param {string} text - Text from clipboard
 * @returns {BlockModel[]} Array of block models
 */
export function createBlocksFromPlainText(text: string): BlockModel[] {
    const lines: string[] = text.split(/\r?\n/);
    const blocks: BlockModel[] = [];

    lines.forEach((line: string) => {
        if (line.trim() === '') {
            return;
        }

        const bulletMatch: RegExpMatchArray = line.match(/^[\s]*[•\-*]\s+(.*)/);
        if (bulletMatch) {
            blocks.push(
                BlockFactory.createBulletListBlock({
                    content: [ BlockFactory.createTextContent({ content: bulletMatch[1] }) ]
                })
            );
            return;
        }

        const numberedMatch: RegExpMatchArray = line.match(/^[\s]*(\d+)[.)]\s+(.*)/);
        if (numberedMatch) {
            blocks.push(
                BlockFactory.createNumberedListBlock({
                    content: [ BlockFactory.createTextContent({ content: numberedMatch[2] }) ]
                })
            );
            return;
        }

        blocks.push(
            BlockFactory.createParagraphBlock({
                content: [ BlockFactory.createTextContent({ content: line }) ]
            })
        );
    });

    return blocks;
}

/**
 * Gets text content from a block model
 *
 * @param {BlockModel} block - Block model to extract text from
 * @returns {string} Plain text content from block
 */
export function getBlockText(block: BlockModel): string {
    if (!block.content || block.content.length === 0) {
        return '';
    }

    return block.content.map((content: ContentModel) => content.content).join('');
}

/**
 * Checks if HTML content contains block-level elements
 *
 * @param {HTMLElement} container - Container with HTML content
 * @returns {boolean} True if contains block-level elements
 */
export function isBlockLevelContent(container: HTMLElement): boolean {
    const blockTags: string[] = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'TABLE', 'IMG'];
    return Array.from(container.querySelectorAll('*')).some((el: Element) => blockTags.indexOf(el.tagName) !== -1);
}

/**
 * Unwraps container element if needed
 *
 * @param {HTMLElement} container - Container to potentially unwrap
 * @returns {HTMLElement} Unwrapped container or original
 */
export function unWrapContainer(container: HTMLElement): HTMLElement {
    const firstChild: HTMLElement = container.firstElementChild as HTMLElement;

    if (
        container.childElementCount === 1 &&
        firstChild.tagName === 'SPAN'
    ) {
        const innerHasBlock: boolean = isBlockLevelContent(firstChild);

        if (innerHasBlock) {
            const newContainer: HTMLElement = document.createElement('div');
            Array.from(firstChild.childNodes).forEach((child: ChildNode) => newContainer.appendChild(child.cloneNode(true)));
            return newContainer;
        }
    }
    return container;
}
