import { IEditCell, IGrid } from '../base/interface';
import { Column } from '../models/column';
import { ParsedReference, ReferenceConverter } from '../actions/formula';
import { getCellByColAndRowIndex, getColumnLetter, parentsUntil } from '../base/util';
import * as literals from '../base/string-literals';
import { SelectionSettingsModel } from '../base';
import * as events from '../base/constant';
import { EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * `FormulaCellEditor` provides a custom cell editor for formula cell inputs in EJ2 Grid.
 *
 * @hidden
 */
export class FormulaCellEditor implements IEditCell {
    private parent: IGrid;
    private editableDiv: HTMLSpanElement | null = null;
    private currentValue: string = '';
    private displayValue: string = '';
    private lastFormulaCaretPosition: number = 0;
    private highlightedCells: HTMLElement[] = [];
    private referenceToColorMap: Map<string, number> = new Map(); // Maps cell reference to color
    private currentEditingRowNum: number = 1;
    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    /**
     * Register event listeners for cell edit mode.
     *
     * @returns {void}
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.editableDiv) {
            EventHandler.add(this.editableDiv, 'click', this.onEditableDivClick, this);
            EventHandler.add(this.editableDiv, 'input', this.onInputChange, this);
        }
        EventHandler.add(this.parent.element, 'click', this.onGridCellClick, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    /**
     * Remove event listeners (called during destroy).
     *
     * @returns {void}
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.editableDiv) {
            EventHandler.remove(this.editableDiv, 'click', this.onEditableDivClick);
            EventHandler.remove(this.editableDiv, 'input', this.onInputChange);
        }
        EventHandler.remove(this.parent.element, 'click', this.onGridCellClick);
        this.parent.off(events.destroy, this.destroy);
    }

    public create(args: { column: Column, value: string, requestType: string }): Element {
        this.editableDiv = document.createElement('span');
        this.editableDiv.contentEditable = 'true';
        this.editableDiv.className = 'e-field e-input e-ralign e-control e-formula-edit e-lib e-input-group e-control-wrapper e-valid-input e-input-focus';
        if (args.column.textAlign) {
            this.editableDiv.style.textAlign = args.column.textAlign;
        }
        this.addEventListener();
        return this.editableDiv;
    }

    public read(element: HTMLElement): string {
        const userInput: string = element && element.textContent ? element.textContent.trim() : '';
        if (userInput && userInput.startsWith('=')) {
            const converted: string = this.convertCellReferencesToREF(userInput, this.currentEditingRowNum);
            return converted;
        }
        return userInput || '';
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string, rowIndex: number }): void {
        if (this.editableDiv && args) {
            const rowData: Object = args.rowData as Object;
            const value: string | number | boolean | Date | null | undefined = rowData[args.column.field];
            this.currentValue = value !== undefined && value !== null ? value.toString() : '';
            const visualRowIndex: number = this.getVisualRowIndex(rowData);
            this.currentEditingRowNum = visualRowIndex + 1;
            if (this.currentValue.startsWith('=')) {
                this.displayValue = this.convertFormulaToCellReference(this.currentValue, visualRowIndex);
            } else {
                this.displayValue = this.currentValue;
            }
            this.renderColorizedFormula(this.displayValue);
            this.updateReferenceHighlight();
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (this.editableDiv) {
                        this.editableDiv.focus();
                        this.setCursorPosition(this.displayValue.length);
                    }
                });
            });
        }
    }

    /**
     * Renders the formula with colored spans for each cell reference inside the editable div
     *
     * @param {string} formula The formula string to render
     * @param {number} cursorPosition Text cursor position
     * @returns {void}
     * @hidden
     */
    public renderColorizedFormula(formula: string, cursorPosition?: number): void {
        if (!this.editableDiv) {
            return;
        }
        this.editableDiv.innerHTML = '';
        const references: Array<{ text: string, startPos: number, endPos: number }> = this.extractFormulaReferencesWithPositions(formula);
        if (references.length === 0) {
            this.editableDiv.textContent = formula;
            if (cursorPosition) {
                this.setCursorPosition(cursorPosition);
            }
            return;
        }
        let lastIndex: number = 0;
        this.referenceToColorMap.clear();
        references.forEach((ref: { text: string; startPos: number; endPos: number; }) => {
            if (lastIndex < ref.startPos) {
                const textBefore: Text = document.createTextNode(formula.substring(lastIndex, ref.startPos));
                this.editableDiv.appendChild(textBefore);
            }
            let span: HTMLElement;
            if (this.isAutoFillFormula()) {
                const refUpper: string = ref.text.toUpperCase();
                if (!this.referenceToColorMap.has(refUpper)) {
                    const colorIndex: number = this.referenceToColorMap.size % 7;
                    this.referenceToColorMap.set(refUpper, colorIndex + 1);
                }
                const classIndex: number | undefined = this.referenceToColorMap.get(refUpper);
                span = this.parent.createElement('span', { className: `e-formula-token e-formula-token-${classIndex}` });
            } else {
                span = this.parent.createElement('span', { className: 'e-formula-token' });
            }
            span.textContent = ref.text;
            this.editableDiv.appendChild(span);
            lastIndex = ref.endPos;
        });
        if (lastIndex < formula.length) {
            const textAfter: Text = document.createTextNode(formula.substring(lastIndex));
            this.editableDiv.appendChild(textAfter);
        }
        if (cursorPosition) {
            this.setCursorPosition(cursorPosition);
        }
    }

    /**
     * Extracts formula references with their start and end positions.
     *
     * @param {string} formula - The formula string.
     * @returns {Array} Array of references with positions.
     * @hidden
     */
    private extractFormulaReferencesWithPositions(formula: string): Array<{ text: string; startPos: number; endPos: number }> {
        const references: Array<{ text: string, startPos: number, endPos: number }> = [];
        // eslint-disable-next-line security/detect-unsafe-regex
        const refRegex: RegExp = /\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?(?!\()/gi;
        let match: RegExpExecArray | null = refRegex.exec(formula);
        while (match !== null) {
            references.push({ text: match[0], startPos: match.index, endPos: match.index + match[0].length});
            match = refRegex.exec(formula);
        }
        return references;
    }

    /**
     * Converts a formula from simple cell reference format (e.g., C6*D6) back to REF(COLUMN("fieldname"), ROW(n)) format.
     *
     * @param {string} formula - The formula string in simple format to convert
     * @param {number} currentRowNum - The current row number being edited (1-based) for detecting cross-row references
     * @returns {string} The converted formula with REF function calls
     * @hidden
     */
    private convertCellReferencesToREF(formula: string, currentRowNum?: number): string {
        const columns: Column[] = this.parent.getColumns() as Column[];
        const columnLetterToField: { [key: string]: string } = {};
        for (let i: number = 0; i < columns.length; i++) {
            const col: Column = columns[parseInt(i.toString(), 10)];
            if (col.field) {
                columnLetterToField[getColumnLetter(i)] = col.field;
            }
        }
        formula = formula.toUpperCase();
        return formula.replace(/(\$?)([A-Z]+)(\$?)(\d+)/gi,
                               (match: string, colDollar: string, columnLetter: string, rowDollar: string, rowNum: string) => {
                                   // eslint-disable-next-line security/detect-object-injection
                                   const fieldName: string = columnLetterToField[columnLetter];
                                   if (fieldName) {
                                       const refRowNum: number = parseInt(rowNum, 10);
                                       let rowReference: string = rowNum;
                                       if (rowDollar === '$') {
                                           rowReference = `$${rowNum}`;
                                       } else if (!isNullOrUndefined(currentRowNum) && refRowNum !== currentRowNum) {
                                           rowReference = `$${rowNum}`;
                                       }
                                       const colPrefix: string = colDollar === '$' ? '$' : '';
                                       return `REF(COLUMN("${colPrefix}${fieldName}"),ROW(${rowReference}))`;
                                   }
                                   return match;
                               });
    }

    /**
     * Converts a formula from REF(COLUMN("fieldname"), ROW(n)) format to simple cell reference format (e.g., C6).
     *
     * @param {string} formula - The formula string to convert
     * @param {number} visualRowIndex - The visual row index in the current sorted/filtered view (optional)
     * @returns {string} The converted formula with simple cell references for editing display
     * @hidden
     */
    private convertFormulaToCellReference(formula: string, visualRowIndex?: number): string {
        const columns: Column[] = this.parent.getColumns() as Column[];
        const fieldToColumnLetter: { [key: string]: string } = {};
        for (let i: number = 0; i < columns.length; i++) {
            const col: Column = columns[parseInt(i.toString(), 10)];
            if (col.field) {
                fieldToColumnLetter[col.field] = getColumnLetter(i);
            }
        }
        const currentRowNum: number = visualRowIndex !== undefined ? visualRowIndex + 1 : 1;
        return formula.replace(/REF\(COLUMN\(["']([^"']+)["']\),ROW\((\$*?)(\d+)\)\)/gi,
                               (match: string, fieldName: string, dollarPrefix: string, rowNum: string) => {
                                   const hasAbsoluteColumn: boolean = fieldName.charAt(0) === '$';
                                   const cleanFieldName: string = hasAbsoluteColumn ? fieldName.substring(1) : fieldName;
                                   // eslint-disable-next-line security/detect-object-injection
                                   const columnLetter: string = fieldToColumnLetter[cleanFieldName];
                                   if (columnLetter) {
                                       if (dollarPrefix === '$') {
                                           return hasAbsoluteColumn ? `$${columnLetter}$${rowNum}` : `${columnLetter}${rowNum}`;
                                       } else {
                                           return `${columnLetter}${currentRowNum}`;
                                       }
                                   }
                                   return match;
                               });
    }
    /**
     * Handles click event on the editable div element.
     *
     * @returns {void}
     * @hidden
     */
    private onEditableDivClick(): void {
        if (this.editableDiv) {
            this.editableDiv.focus();
            const curPosition: number = this.getCursorPositionInFormula();
            this.setCursorPosition(curPosition);
        }
    }

    /**
     * Handles input change event on the editable div element.
     *
     * @returns {void}
     * @hidden
     */
    private onInputChange(): void {
        const formula: string = this.editableDiv ? this.editableDiv.textContent : '';
        this.displayValue = formula;
        const savedCursorPos: number = this.getCursorPositionInFormula();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.renderColorizedFormula(formula, savedCursorPos);
                this.updateReferenceHighlight();
            });
        });
    }

    /**
     * Extracts cell references from a display string with their positions.
     *
     * @param {string} display - The display string to extract references from.
     * @returns {Array} Array of references with their text and positions.
     * @hidden
     */
    private extractRefsFromDisplay(display: string): { text: string, start: number, end: number }[] {
        const cleaned: string = display.replace(/"(?:\\.|[^"\\])*"/g, '');
        // eslint-disable-next-line security/detect-unsafe-regex
        const refRegex: RegExp = /\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?/gi;
        const results: { text: string, start: number, end: number }[] = [];
        let match: RegExpExecArray | null = refRegex.exec(cleaned);
        while (match !== null) {
            results.push({ text: match[0], start: match.index, end: match.index + match[0].length });
            match = refRegex.exec(cleaned);
        }
        return results;
    }

    /**
     * Handles click event on grid cells for formula cell reference selection.
     *
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     * @hidden
     */
    private onGridCellClick(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (this.isAutoFillFormula() && target.classList.contains('e-rowcell') && this.parent.isEdit && this.editableDiv) {
            const cellElement: Element = parentsUntil(target, literals.rowCell);
            const rowElement: Element = parentsUntil(cellElement, literals.row);
            const rowIndex: number = parseInt(rowElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            const colIndex: number = parseInt(cellElement.getAttribute(literals.ariaColIndex), 10) - 1;
            const formulaIndex: number = this.parent.allowPaging && this.parent.pageSettings ?
                ((this.parent.pageSettings.currentPage - 1) * this.parent.pageSettings.pageSize) + rowIndex : rowIndex;
            const clickedRef: string = getColumnLetter(colIndex) + (formulaIndex + 1);
            const currentDisplay: string = this.editableDiv.textContent;
            const caret: number = this.getCursorPositionInFormula();
            const refs: { text: string, start: number, end: number }[] = this.extractRefsFromDisplay(currentDisplay);
            if (!refs.length) {
                this.parent.endEdit();
                return;
            }
            let tokenIndex: number = -1;
            for (let i: number = 0; i < refs.length; i++) {
                if (caret >= refs[parseInt(i.toString(), 10)].start && caret <= refs[parseInt(i.toString(), 10)].end) {
                    tokenIndex = i;
                    break;
                }
            }
            if (tokenIndex === -1) {
                this.parent.endEdit();
                return;
            }
            // eslint-disable-next-line security/detect-object-injection
            const token: { text: string, start: number, end: number } = refs[tokenIndex];
            let newDisplay: string;
            if (token.text.indexOf(':') !== -1) {
                const [left, right]: string[] = token.text.split(':');
                const leftEnd: number = token.start + left.length;
                if (caret <= leftEnd) {
                    newDisplay = currentDisplay.slice(0, token.start) + clickedRef + ':' + right + currentDisplay.slice(token.end);
                } else {
                    newDisplay = currentDisplay.slice(0, token.start) + left + ':' + clickedRef + currentDisplay.slice(token.end);
                }
            } else {
                newDisplay = currentDisplay.slice(0, token.start) + clickedRef + currentDisplay.slice(token.end);
            }
            this.currentValue = newDisplay;
            this.displayValue = newDisplay;
            this.renderColorizedFormula(newDisplay);
            this.updateReferenceHighlight();
            this.lastFormulaCaretPosition = caret;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setCursorPosition(caret);
                });
            });
        }
    }

    /**
     * Gets the current cursor position within the formula.
     *
     * @returns {number} The cursor position in the formula.
     * @hidden
     */
    private getCursorPositionInFormula(): number {
        const selection: Selection = window.getSelection() as Selection;
        const range: Range = selection.getRangeAt(0);
        if (!this.editableDiv || !selection || selection.rangeCount === 0 || !this.editableDiv.contains(range.startContainer)) {
            return this.lastFormulaCaretPosition;
        }
        const preCaretRange: Range = range.cloneRange();
        preCaretRange.selectNodeContents(this.editableDiv);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        this.lastFormulaCaretPosition = preCaretRange.toString().length;
        return this.lastFormulaCaretPosition;
    }

    /**
     * Sets the cursor position in the formula editor.
     *
     * @param {number} position - The position to set the cursor at.
     * @returns {void}
     * @hidden
     */
    private setCursorPosition(position: number): void {
        if (!this.editableDiv) {
            return;
        }
        const selection: Selection | null = window.getSelection();
        const range: Range = document.createRange();
        let characterCount: number = 0;
        const nodeStack: Node[] = [this.editableDiv];
        let cursorFound: boolean = false;
        let currentNode: Node | undefined = nodeStack.pop();
        while (!cursorFound && currentNode) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                const textNode: Text = currentNode as Text;
                const nextCharacterCount: number = characterCount + textNode.length;
                if (position <= nextCharacterCount) {
                    range.setStart(textNode, position - characterCount);
                    cursorFound = true;
                }
                characterCount = nextCharacterCount;
            } else {
                for (let childIndex: number = currentNode.childNodes.length - 1; childIndex >= 0; childIndex--) {
                    nodeStack.push(currentNode.childNodes[parseInt(childIndex.toString(), 10)]);
                }
            }
            currentNode = nodeStack.pop();
        }
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Updates the highlight for cell references in the formula.
     *
     * @returns {void}
     * @hidden
     */
    private updateReferenceHighlight(): void {
        if (!this.isAutoFillFormula() || !this.editableDiv) {
            return;
        }
        this.clearReferenceHighlight();
        this.referenceToColorMap.clear();
        const formula: string = this.editableDiv ? this.editableDiv.textContent : '';
        const references: string[] = this.extractFormulaReferences(formula);
        references.forEach((ref: string) => {
            const refUpper: string = ref.toUpperCase();
            if (!this.referenceToColorMap.has(refUpper)) {
                const colorIndex: number = this.referenceToColorMap.size % 7;
                this.referenceToColorMap.set(refUpper, colorIndex + 1);
            }
            const classIndex: number | undefined = this.referenceToColorMap.get(refUpper);
            const className: string = `e-formula-cell-${classIndex}`;
            this.highlightReference(ref, className);
        });
    }

    /**
     * Extracts unique cell references from a formula string.
     *
     * @param {string} formula - The formula string to extract references from.
     * @returns {string[]} Array of unique cell references.
     * @hidden
     */
    private extractFormulaReferences(formula: string): string[] {
        // eslint-disable-next-line security/detect-unsafe-regex
        const refRegex: RegExp = /\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?/gi;
        const matches: RegExpMatchArray | null = formula.match(refRegex);
        if (!matches) {
            return [];
        }
        const uniqueRefs: string[] = [];
        matches.forEach((ref: string) => {
            const normalized: string = ref.toUpperCase();
            if (uniqueRefs.indexOf(normalized) === -1) {
                uniqueRefs.push(normalized);
            }
        });
        return uniqueRefs;
    }

    /**
     * Clears all reference highlighting from cells.
     *
     * @returns {void}
     * @hidden
     */
    private clearReferenceHighlight(): void {
        this.highlightedCells.forEach((cell: HTMLElement) => {
            const classesToRemove: string[] = Array.from(cell.classList).filter(
                (cls: string) =>
                    cls.startsWith('e-formula-cell-') ||
                    cls.startsWith('e-formula-range') ||
                    cls.startsWith('e-formula-border-range-')
            );
            cell.classList.remove(...classesToRemove);
        });
        this.highlightedCells = [];
    }

    /**
     * Gets the visual row index in the current sorted/filtered view for the given row data.
     *
     * @param {Object} rowData - The row data to find the visual index for
     * @returns {number} The visual row index in the current view (respects sorting and filtering)
     * @hidden
     */
    private getVisualRowIndex(rowData: Object): number {
        const currentViewRecords: Object[] = this.parent.getCurrentViewRecords();
        const primaryKeyFields: string = this.parent.getPrimaryKeyFieldNames()[0];
        const rowPrimaryKeyValue: string | number = rowData[`${primaryKeyFields}`];
        for (let i: number = 0; i < currentViewRecords.length; i++) {
            const record: Object = currentViewRecords[parseInt(i.toString(), 10)];
            if (record[`${primaryKeyFields}`] === rowPrimaryKeyValue) {
                return i;
            }
        }
        return 0;
    }

    private getPageRowIndex(index: number): number {
        if (this.parent.allowPaging && this.parent.pageSettings) {
            return index % this.parent.pageSettings.pageSize;
        }
        return index;
    }

    /**
     * Highlights a cell reference or range in the grid.
     *
     * @param {string} reference - The cell reference or range to highlight.
     * @param {string} formulaBorder - The CSS class for the border style.
     * @returns {void}
     * @hidden
     */
    private highlightReference(reference: string, formulaBorder: string): void {
        if (reference.indexOf(':') >= 0) {
            const [startReference, endReference]: string[] = reference.split(':');
            const startCellReference: ParsedReference = ReferenceConverter.parseReference(startReference);
            const endCellReference: ParsedReference = ReferenceConverter.parseReference(endReference);
            const startIndex: number = this.getPageRowIndex(startCellReference.row);
            const endIndex: number = this.getPageRowIndex(endCellReference.row);
            const minRowIndex: number = Math.min(startIndex, endIndex);
            const maxRowIndex: number = Math.max(startIndex, endIndex);
            const minColumnIndex: number = Math.min(startCellReference.col, endCellReference.col);
            const maxColumnIndex: number = Math.max(startCellReference.col, endCellReference.col);
            this.highlightRangeBorder(minRowIndex, maxRowIndex, minColumnIndex, maxColumnIndex, formulaBorder);
        } else {
            const parsed: ParsedReference = ReferenceConverter.parseReference(reference);
            this.highlightCell(parsed.col, this.getPageRowIndex(parsed.row), formulaBorder);
        }
    }

    /**
     * Highlights a single cell in the grid.
     *
     * @param {number} colIndex - The column index of the cell.
     * @param {number} rowIndex - The row index of the cell.
     * @param {string} formulaBorder - The CSS class for the border style.
     * @returns {void}
     * @hidden
     */
    private highlightCell(colIndex: number, rowIndex: number, formulaBorder: string): void {
        const columns: Column[] = this.parent.getColumns() as Column[];
        if (colIndex < 0 || colIndex >= columns.length) {
            return;
        }
        const rowElement: Element | null = this.parent.getRowByIndex(rowIndex);
        if (!rowElement) {
            return;
        }
        const cellElement: HTMLElement = getCellByColAndRowIndex(this.parent, columns[parseInt(colIndex.toString(), 10)],
                                                                 rowIndex, colIndex) as HTMLElement;
        if (cellElement) {
            cellElement.classList.add(formulaBorder);
            this.highlightedCells.push(cellElement);
        }
    }

    /**
     * Create a single border div around an entire range of cells
     *
     * @param {number} minRow Start row index
     * @param {number} maxRow End row index
     * @param {number} minCol Start column index
     * @param {number} maxCol End column index
     * @param {string} formulaBorder CSS class for the border
     * @returns {void}
     * @hidden
     */
    private highlightRangeBorder(minRow: number, maxRow: number, minCol: number, maxCol: number, formulaBorder: string): void {
        const columns: Column[] = this.parent.getColumns();
        if (minCol < 0 || maxCol >= columns.length || minRow < 0 || maxRow >= this.parent.currentViewData.length) {
            return;
        }
        for (let row: number = minRow; row <= maxRow; row++) {
            for (let col: number = minCol; col <= maxCol; col++) {
                const cell: HTMLElement = getCellByColAndRowIndex(this.parent, columns[parseInt(col.toString(), 10)],
                                                                  row, col) as HTMLElement;
                if (!cell) {
                    continue;
                }
                const borderClass: string = formulaBorder.replace('e-formula-cell-', 'e-formula-border-range-');
                cell.classList.add('e-formula-range', borderClass);
                if (row === minRow) {
                    cell.classList.add('e-formula-range-top');
                }
                if (row === maxRow) {
                    cell.classList.add('e-formula-range-bottom');
                }
                if (col === minCol) {
                    cell.classList.add('e-formula-range-left');
                }
                if (col === maxCol) {
                    cell.classList.add('e-formula-range-right');
                }
                this.highlightedCells.push(cell);
            }
        }
    }

    /**
     * Determines if auto-fill formula highlighting should be enabled.
     *
     * @returns {boolean} True if auto-fill formula is enabled, false otherwise.
     * @hidden
     */
    private isAutoFillFormula(): boolean {
        const selectionSettings: SelectionSettingsModel = this.parent.selectionSettings as SelectionSettingsModel;
        const cellSelectionMode: string = selectionSettings.cellSelectionMode;
        const result: boolean = this.parent.enableAutoFill === true && cellSelectionMode.indexOf('Box') > -1 &&
            selectionSettings.mode === 'Cell' && selectionSettings.type === 'Multiple';
        return result;
    }

    public destroy(): void {
        this.removeEventListener();
        this.clearReferenceHighlight();
        this.editableDiv = null;
        this.displayValue = '';
        this.currentValue = '';
        this.referenceToColorMap.clear();
        this.highlightedCells = [];
    }
}
