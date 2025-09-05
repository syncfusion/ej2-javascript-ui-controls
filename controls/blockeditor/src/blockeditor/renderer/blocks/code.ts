import { ChangeEventArgs, DropDownList } from '@syncfusion/ej2-dropdowns';
import { BlockEditor, BlockType } from '../../base/index';
import { BlockModel } from '../../models/index';
import { setCursorPosition, getSelectedRange } from '../../utils/selection';
import { CodeLanguageModel, CodeProps } from '../../models/block/index';
import { getLanguageItems } from '../../utils/data';
import { getBlockModelById, getParentBlock } from '../../utils/block';
import { getNormalizedKey } from '../../utils/common';
import { events } from '../../base/constant';
import { BlockFactory } from '../../services/index';

export class CodeRenderer {
    private editor: BlockEditor;
    private ctrlAPressed: boolean = false;
    private readonly INDENT_SIZE: number = 4;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.keydown, this.handleKeyDownActions, this);
        this.editor.on(events.input, this.handleCodeBlockInput, this);
        this.editor.on(events.localeChanged, this.handleLocaleChange, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.keydown, this.handleKeyDownActions);
        this.editor.off(events.input, this.handleCodeBlockInput);
        this.editor.off(events.localeChanged, this.handleLocaleChange);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Renders a code block
     *
     * @param {BlockModel} block - The block model containing data.
     * @returns {HTMLElement} - The rendered code block element.
     * @hidden
     */
    public renderCodeBlock(block: BlockModel): HTMLElement {
        const codeBlockSettings: CodeProps = block.props as CodeProps;
        const { container, preElement, codeElement } = this.createCodeContainer(block, codeBlockSettings);
        const { toolbar, copyButton } = this.createCodeToolbar();

        const languageSelector: HTMLElement = this.editor.createElement('input', {
            className: 'e-code-block-languages'
        });
        toolbar.appendChild(languageSelector);

        const ddbList: DropDownList = this.initializeLanguageSelector(codeBlockSettings, preElement);

        toolbar.appendChild(copyButton);
        ddbList.appendTo(languageSelector);

        container.appendChild(toolbar);
        container.appendChild(preElement);

        setCursorPosition(codeElement.lastChild as HTMLElement, 0);
        return container;
    }

    private createCodeToolbar(): { toolbar: HTMLElement; copyButton: HTMLElement } {
        const toolbar: HTMLElement = this.editor.createElement('div', {
            className: 'e-code-block-toolbar',
            attrs: { contenteditable: 'false' }
        });

        const copyButton: HTMLElement = this.editor.createElement('button', {
            className: 'e-code-block-copy-button e-btn',
            innerHTML: '<span class="e-icons e-copy"></span>',
            attrs: {
                title: this.editor.l10n.getConstant('codeCopyTooltip'),
                type: 'button',
                contenteditable: 'false'
            }
        });

        copyButton.addEventListener('click', () => {
            const codeElement: HTMLElement = toolbar.closest('.e-code-block-container').querySelector('code');
            if (codeElement) {
                const codeText: string = codeElement.textContent;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        codeBlockSettings: CodeProps,
        preElement: HTMLElement
    ): DropDownList {
        const languageDataSource: CodeLanguageModel[] = getLanguageItems();
        if (codeBlockSettings.languages.length === 0) {
            codeBlockSettings.languages = languageDataSource;
        }

        const dropDownList: DropDownList = new DropDownList({
            dataSource: codeBlockSettings.languages as { [key: string]: Object }[],
            fields: { text: 'label', value: 'language' },
            value: codeBlockSettings.defaultLanguage,
            change: (e: ChangeEventArgs) => {
                const newLanguage: string = e.value as string;
                if (preElement) {
                    preElement.className = `e-code-block language-${newLanguage}`;
                    codeBlockSettings.defaultLanguage = newLanguage;
                }
            }
        });

        return dropDownList;
    }

    private createCodeContainer(
        block: BlockModel,
        codeBlockSettings: CodeProps
    ): { container: HTMLElement; preElement: HTMLElement; codeElement: HTMLElement } {
        const container: HTMLElement = this.editor.createElement('div', { className: 'e-code-block-container' });
        const preElement: HTMLElement = this.editor.createElement('pre', {
            className: `e-code-block language-${codeBlockSettings.defaultLanguage}`
        });
        const codeElement: HTMLElement = this.editor.createElement('code', {
            className: 'e-code-content e-block-content',
            innerHTML: block.content && block.content.length > 0 && block.content[0].content ? block.content[0].content : '<br>',
            attrs: { contenteditable: 'true' }
        });
        preElement.appendChild(codeElement);
        return { container, preElement, codeElement };
    }

    private handleKeyDownActions(e: KeyboardEvent): void {
        const codeElement: HTMLElement = this.editor.currentFocusedBlock.querySelector('code');
        const block: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        if (!codeElement || (block && block.type !== BlockType.Code)) { return; }

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
        const codeElement: HTMLElement = this.editor.currentFocusedBlock.querySelector('code');
        const block: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        if (!codeElement || block.type !== BlockType.Code) { return; }

        const textContent: string = codeElement.textContent || '';
        if (!textContent.trim() && codeElement.innerHTML !== '<br>') {
            codeElement.innerHTML = '<br>';
        }
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
        const range: Range = this.editor.nodeSelection.getRange();
        const preCaretRange: Range = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }

    private insertTextAtCursor(isDoubleBr: boolean, indentValue: string): void {
        const selection: Selection = window.getSelection();
        if (!selection.rangeCount) { return; }

        const range: Range = selection.getRangeAt(0);
        const brElement: Text = this.editor.createElement('br');
        range.insertNode(brElement);
        if (isDoubleBr) {
            const consecutiveBr: Text = this.editor.createElement('br');
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
                this.editor.blockRendererManager.setFocusAndUIForNewBlock(nextSibling);
            }
            else {
                const newBlock: BlockModel = BlockFactory.createParagraphBlock();
                this.editor.blockCommandManager.addNewBlock({ block: newBlock, targetBlock: blockElement });
            }
        });
    }

    private addIndentation(): void {
        const indent: string = ' '.repeat(this.INDENT_SIZE);
        const range: Range = this.editor.nodeSelection.getRange();
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
        const textContent: string = codeElement.textContent || '';
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        if (!block.content || block.content.length === 0) {
            block.content = [BlockFactory.createTextContent({ content: textContent })];
            this.editor.stateManager.updatePropChangesToModel();
        } else {
            block.content[0].content = textContent;
        }
        this.editor.isProtectedOnChange = prevOnChange;
    }

    private handleLocaleChange(): void {
        const codeBlocks: NodeListOf<HTMLElement> = this.editor.element.querySelectorAll('.e-code-block-container');
        for (const codeBlock of Array.from(codeBlocks)) {
            const copyButton: HTMLElement = codeBlock.querySelector('.e-code-block-copy-button');
            if (copyButton) {
                copyButton.setAttribute('title', this.editor.l10n.getConstant('codeCopyTooltip'));
            }
        }
    }

    public destroy(): void {
        this.removeEventListeners();
    }
}
