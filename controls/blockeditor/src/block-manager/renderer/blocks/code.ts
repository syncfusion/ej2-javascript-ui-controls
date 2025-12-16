import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { BlockType } from '../../../models/enums';
import { BlockModel, CodeLanguageModel } from '../../../models/index';
import { setCursorPosition, getSelectedRange } from '../../../common/utils/selection';
import { ICodeBlockSettings } from '../../../models/block/index';
import { getLanguageItems } from '../../../common/utils/data';
import { getBlockModelById, getParentBlock } from '../../../common/utils/block';
import { decoupleReference, getNormalizedKey } from '../../../common/utils/common';
import { events } from '../../../common/constant';
import { BlockFactory } from '../../services/index';
import { BlockManager } from '../../base/block-manager';
import { createElement } from '@syncfusion/ej2-base';
import { sanitizeBlock } from '../../../common/utils/transform';

export class CodeRenderer {
    private parent: BlockManager;
    private ctrlAPressed: boolean = false;
    private readonly INDENT_SIZE: number = 4;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(events.keydown, this.handleKeyDownActions, this);
        this.parent.observer.on(events.input, this.handleCodeBlockInput, this);
        this.parent.observer.on(events.localeChanged, this.handleLocaleChange, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(events.keydown, this.handleKeyDownActions);
        this.parent.observer.off(events.input, this.handleCodeBlockInput);
        this.parent.observer.off(events.localeChanged, this.handleLocaleChange);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Renders a code block
     *
     * @param {BlockModel} block - The block model containing data.
     * @returns {HTMLElement} - The rendered code block element.
     * @hidden
     */
    public renderCodeBlock(block: BlockModel): HTMLElement {
        const codeBlockSettings: ICodeBlockSettings = block.properties as ICodeBlockSettings;
        const { container, preElement, codeElement } = this.createCodeContainer(block);
        const { toolbar, copyButton } = this.createCodeToolbar();

        const languageSelector: HTMLElement = createElement('input', {
            className: 'e-code-block-languages'
        });
        toolbar.appendChild(languageSelector);

        this.initializeLanguageSelector(codeBlockSettings, preElement, codeElement, languageSelector);

        toolbar.appendChild(copyButton);
        container.appendChild(toolbar);
        container.appendChild(preElement);

        setCursorPosition(codeElement.lastChild as HTMLElement, 0);
        return container;
    }

    private createCodeToolbar(): { toolbar: HTMLElement; copyButton: HTMLElement } {
        const toolbar: HTMLElement = createElement('div', {
            className: 'e-code-block-toolbar',
            attrs: { contenteditable: 'false' }
        });

        const copyButton: HTMLElement = createElement('button', {
            className: 'e-code-block-copy-button e-btn',
            innerHTML: '<span class="e-icons e-copy"></span>',
            attrs: {
                title: this.parent.localeJson['codeCopyTooltip'],
                type: 'button',
                contenteditable: 'false'
            }
        });

        copyButton.addEventListener('click', () => {
            const codeElement: HTMLElement = toolbar.closest('.e-code-block-container').querySelector('code');
            if (codeElement) {
                const codeText: string = codeElement.textContent;
                (window as any).navigator.clipboard.writeText(codeText)
                    .then((): void => {
                        const iconElement: HTMLElement = copyButton.querySelector('.e-icons');
                        if (iconElement) {
                            const originalClass: string = iconElement.className;
                            iconElement.className = 'e-icons e-check-tick';
                            setTimeout((): void => {
                                iconElement.className = originalClass;
                            }, 2000);
                        }
                    })
                    .catch((err: Error): void => {
                        console.error('Could not copy text: ', err);
                    });
            }
        });

        return { toolbar, copyButton };
    }

    private initializeLanguageSelector(
        codeBlockSettings: ICodeBlockSettings,
        preElement: HTMLElement,
        codeElement: HTMLElement,
        targetElement: HTMLElement
    ): void {
        const languageDataSource: CodeLanguageModel[] = getLanguageItems();
        if (this.parent.codeBlockSettings.languages.length === 0) {
            this.parent.codeBlockSettings.languages = languageDataSource;
        }

        this.parent.observer.notify('renderDropdownList', {
            targetElement: targetElement,
            dataSource: this.parent.codeBlockSettings.languages as { [key: string]: Object }[],
            fields: { text: 'label', value: 'language' },
            value: this.parent.codeBlockSettings.defaultLanguage,
            change: (e: ChangeEventArgs) => {
                const newLanguage: string = e.value as string;
                if (codeElement && preElement) {
                    codeElement.className = `e-code-content e-block-content language-${newLanguage}`;
                    preElement.setAttribute('data-language', newLanguage);

                    // Update in Model
                    codeBlockSettings.language = newLanguage;
                }
            }
        });
    }

    private createCodeContainer(
        block: BlockModel
    ): { container: HTMLElement; preElement: HTMLElement; codeElement: HTMLElement } {
        const container: HTMLElement = createElement('div', { className: 'e-code-block-container' });
        const preElement: HTMLElement = createElement('pre', {
            className: 'e-code-block',
            attrs: {
                'data-language': this.parent.codeBlockSettings.defaultLanguage
            }
        });
        const hasContent: boolean = block.content && block.content.length > 0;
        const codeElement: HTMLElement = createElement('code', {
            id: hasContent ? block.content[0].id : '',
            className: `e-code-content e-block-content language-${this.parent.codeBlockSettings.defaultLanguage}`,
            attrs: { contenteditable: 'true' }
        });
        if (hasContent && block.content[0].content) {
            codeElement.textContent = block.content[0].content;
        }
        else {
            codeElement.innerHTML = '<br>';
        }
        preElement.appendChild(codeElement);
        return { container, preElement, codeElement };
    }

    private handleKeyDownActions(e: KeyboardEvent): void {
        if (!this.parent.currentFocusedBlock) { return; }
        const codeElement: HTMLElement = this.parent.currentFocusedBlock.querySelector('code');
        const block: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        if (!codeElement || (block && block.blockType !== BlockType.Code)) { return; }

        const normalizedKey: string = getNormalizedKey(e);
        if (normalizedKey === 'ctrl+a') {
            this.handleCtrlASelection(e, codeElement);
            return;
        }
        switch (e.key) {
        case 'Enter':
            this.handleEnterKey(e, codeElement, block);
            break;
        case 'Backspace':
            this.handleDeletion(e, codeElement, block, false);
            break;
        case 'Delete':
            this.handleDeletion(e, codeElement, block, true);
            break;
        case 'Tab':
            this.handleTabKey(e, codeElement);
            break;
        }
    }

    private handleEnterKey(e: KeyboardEvent, codeElement: HTMLElement, block: BlockModel): void {
        e.preventDefault();

        const action: { shouldExit: boolean; indentation: string } = this.determineEnterAction(codeElement);
        if (action.shouldExit) {
            this.exitCodeBlock(codeElement, block);
            return;
        }

        const afterTwoBr: boolean = this.isAfterTwoBrTags();
        this.insertTextAtCursor(!afterTwoBr, action.indentation);
    }

    private determineEnterAction(codeElement: HTMLElement): { shouldExit: boolean; indentation: string } {
        const cursorPosition: number = this.getCursorPosition(codeElement);
        const indentation: string = this.getCurrentLineIndentation(codeElement, cursorPosition);
        const shouldExit: boolean = this.shouldExitCodeBlock(codeElement);
        return { shouldExit, indentation };
    }

    private handleDeletion(e: KeyboardEvent, codeElement: HTMLElement, block: BlockModel, isDeleteKey: boolean): void {
        const cursorPosition: number = this.getCursorPosition(codeElement);
        const textContent: string = codeElement.textContent;
        const range: Range = getSelectedRange();
        const shouldPreventDefault: boolean = isDeleteKey
            ? (cursorPosition >= textContent.length)
            : (cursorPosition === 0 || textContent.length === 0);

        if ((textContent.length === 1) || (range.toString() === textContent)) {
            e.preventDefault();
            codeElement.innerHTML = '<br>';
            setCursorPosition(codeElement.firstChild as HTMLElement, 0);
            this.updateBlockModel(codeElement, block);
        }
        if (shouldPreventDefault) {
            e.preventDefault();
            return;
        }
    }

    private handleTabKey(e: KeyboardEvent, codeElement: HTMLElement): void {
        e.preventDefault();
        if (e.shiftKey) {
            this.removeIndentation(codeElement);
        } else {
            this.addIndentation();
        }
    }

    private handleCodeBlockInput(e: Event): void {
        if (!this.parent.currentFocusedBlock) { return; }
        const codeElement: HTMLElement = this.parent.currentFocusedBlock.querySelector('code');
        const block: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        if (!codeElement || block.blockType !== BlockType.Code) { return; }

        const textContent: string = codeElement.textContent || '';
        if (!textContent.trim() && codeElement.innerHTML !== '<br>') {
            codeElement.innerHTML = '<br>';
        }
        this.updateBlockModel(codeElement, block);
    }

    private handleCtrlASelection(e: KeyboardEvent, codeElement: HTMLElement): void {
        if (!this.ctrlAPressed) {
            e.preventDefault();
            this.selectEntireCodeBlock(codeElement);
            this.ctrlAPressed = true;
            setTimeout(() => {
                this.ctrlAPressed = false;
            }, 500);
        } else {
            this.ctrlAPressed = false;
        }
    }

    private getCursorPosition(element: HTMLElement): number {
        const range: Range = this.parent.nodeSelection.getRange();
        const preCaretRange: Range = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }

    private insertTextAtCursor(isDoubleBr: boolean, indentValue: string): void {
        const selection: Selection = window.getSelection();
        if (!selection.rangeCount) { return; }

        const range: Range = selection.getRangeAt(0);
        const brElement: Node = createElement('br');
        range.insertNode(brElement);
        if (isDoubleBr) {
            const consecutiveBr: Node = createElement('br');
            range.insertNode(consecutiveBr);
            range.setStartAfter(consecutiveBr);
            range.setEndAfter(consecutiveBr);
        }
        else {
            range.setStartAfter(brElement);
            range.setEndAfter(brElement);
        }
        if (indentValue) {
            range.insertNode(document.createTextNode(indentValue));
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private getCurrentLineIndentation(element: HTMLElement, cursorPosition: number): string {
        const textContent: string = element.textContent;
        const lines: string[] = textContent.substring(0, cursorPosition).split('\n');
        const currentLine: string = lines[lines.length - 1];

        const indentMatch: RegExpMatchArray | null = currentLine.match(/^(\s*)/);
        return indentMatch ? indentMatch[1] : '';
    }

    private isAfterTwoBrTags(): boolean {
        const selection: Selection = window.getSelection();
        if (!selection.rangeCount) { return false; }

        const range: Range = selection.getRangeAt(0);
        const container: Node = range.startContainer;

        let node: Node = container;
        let brCount: number = 0;

        while (node && brCount < 2) {
            if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
                brCount++;
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                break;
            }
            node = node.previousSibling;
        }
        return brCount >= 2;
    }

    private shouldExitCodeBlock(element: HTMLElement): boolean {
        const children: NodeList = element.childNodes;
        let brCount: number = 0;

        for (let i: number = children.length - 1; i >= 0; i--) {
            const node: Node = children[i as number];
            if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR') {
                brCount++;
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                break;
            }
        }
        return brCount >= 3;
    }

    private exitCodeBlock(codeElement: HTMLElement, block: BlockModel): void {
        const blockElement: HTMLElement = getParentBlock(codeElement);
        setTimeout(() => {
            const nextSibling: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            if (nextSibling) {
                this.parent.setFocusAndUIForNewBlock(nextSibling);
            }
            else {
                const newBlock: BlockModel = BlockFactory.createParagraphBlock();
                this.parent.blockCommand.addBlock({ block: newBlock, targetBlock: blockElement });
            }
        });
    }

    private addIndentation(): void {
        const indent: string = ' '.repeat(this.INDENT_SIZE);
        const range: Range = this.parent.nodeSelection.getRange();
        range.insertNode(document.createTextNode(indent));
        const endContainer: Node = range.endContainer;
        setCursorPosition(endContainer as HTMLElement, endContainer.textContent.length);
    }

    private removeIndentation(element: HTMLElement): void {
        const cursorPosition: number = this.getCursorPosition(element);
        const textContent: string = element.textContent;
        const beforeCursor: string = textContent.substring(0, cursorPosition);
        const lastNewlineIndex: number = beforeCursor.lastIndexOf('\n');
        const lineStart: number = lastNewlineIndex + 1;
        const currentLine: string = textContent.substring(lineStart, cursorPosition);
        const spacesToRemove: number = Math.min(this.INDENT_SIZE, currentLine.match(/^ */)[0].length);

        if (spacesToRemove > 0) {
            element.textContent = textContent.substring(0, lineStart) + textContent.substring(lineStart + spacesToRemove);
            setCursorPosition(element, cursorPosition - spacesToRemove);
        }
    }

    private selectEntireCodeBlock(element: HTMLElement): void {
        const range: Range = document.createRange();
        range.selectNodeContents(element);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private updateBlockModel(codeElement: HTMLElement, block: BlockModel): void {
        const textContent: string = Array.from(codeElement.childNodes)
            .map((node: Node) => {
                if (node.nodeName === 'BR') { return '\n'; }
                if (node.nodeType === Node.TEXT_NODE) { return node.textContent; }
                return '';
            })
            .join('')
            .replace(/\n$/, '');
        if (!block.content || block.content.length === 0) {
            this.parent.blockService.replaceBlock(block.id, {
                ...decoupleReference(sanitizeBlock(block)),
                content: [BlockFactory.createTextContent({ content: textContent })]
            });
        } else {
            block.content[0].content = textContent;
        }
        this.parent.stateManager.updateManagerBlocks();
    }

    private handleLocaleChange(): void {
        const codeBlocks: NodeListOf<HTMLElement> = this.parent.rootEditorElement.querySelectorAll('.e-code-block-container');
        for (const codeBlock of Array.from(codeBlocks)) {
            const copyButton: HTMLElement = codeBlock.querySelector('.e-code-block-copy-button');
            if (copyButton) {
                copyButton.setAttribute('title', this.parent.localeJson['codeCopyTooltip']);
            }
        }
    }

    public destroy(): void {
        this.removeEventListeners();
    }
}
