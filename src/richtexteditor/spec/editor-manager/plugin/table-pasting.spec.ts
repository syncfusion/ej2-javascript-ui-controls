import { EditorManager } from '../../../src/editor-manager/base/editor-manager';
import { TablePasting } from '../../../src/editor-manager/plugin/table-pasting';
import { createElement, detach } from '@syncfusion/ej2-base';

describe('Table Pasting Module', () => {
    let editorObj: EditorManager;
    let tablePasting: TablePasting;

    // Basic editor setup with a table
    let basicTableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <table class="e-rte-table" style="width: 100%; min-width: 0px;">
            <tbody>
                <tr>
                    <td style="width: 33.3333%;" id="cell1">Cell 1</td>
                    <td style="width: 33.3333%;" id="cell2">Cell 2</td>
                    <td style="width: 33.3333%;" id="cell3">Cell 3</td>
                </tr>
                <tr>
                    <td style="width: 33.3333%;" id="cell4">Cell 4</td>
                    <td style="width: 33.3333%;" id="cell5">Cell 5</td>
                    <td style="width: 33.3333%;" id="cell6">Cell 6</td>
                </tr>
            </tbody>
        </table>
    </div>`;

    let elem: HTMLElement;

    beforeAll(() => {
        elem = createElement('div', {
            id: 'dom-node', innerHTML: basicTableContent
        });
        document.body.appendChild(elem);
        editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        tablePasting = new TablePasting();
    });

    afterAll(() => {
        detach(elem);
    });

    describe('Basic Table Pasting Functionality', () => {
        it('should handle pasting a simple table into a target cell', () => {
            // Create a simple table to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td>Pasted 1</td>
                        <td>Pasted 2</td>
                    </tr>
                    <tr>
                        <td>Pasted 3</td>
                        <td>Pasted 4</td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify the result
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows.length).toBeGreaterThanOrEqual(2);
            expect(targetTable.rows[0].cells.length).toBeGreaterThanOrEqual(3);

            // Check if content was pasted correctly
            const firstCell = targetTable.rows[0].cells[0];
            expect(firstCell.textContent).toBe('Pasted 1');
        });

        it('should handle pasting into multiple selected cells', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a simple table to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td>Multi 1</td>
                        <td>Multi 2</td>
                    </tr>
                </tbody>
            `;

            // Select multiple cells
            const targetCells = document.querySelectorAll('#cell1, #cell2');

            // Add selection classes to simulate multi-cell selection
            targetCells.forEach(cell => {
                cell.classList.add('e-cell-select');
                cell.classList.add('e-multi-cells-select');
            });

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify the cells were updated
            expect(document.querySelector('#cell1').textContent).toBe('Multi 1');
            expect(document.querySelector('#cell2').textContent).toBe('Multi 2');
        });
    });

    describe('Complex Table Pasting Scenarios', () => {
        it('should handle pasting a table with rowspan', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with rowspan to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td rowspan="2">Rowspan Cell</td>
                        <td>Regular Cell</td>
                    </tr>
                    <tr>
                        <td>Bottom Cell</td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify the result - check if rowspan was preserved
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            const firstCell = targetTable.rows[0].cells[0];

            expect(firstCell.getAttribute('rowspan')).toBe('2');
            expect(firstCell.textContent).toBe('Rowspan Cell');
        });

        it('should handle pasting a table with colspan', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with colspan to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td colspan="2">Colspan Cell</td>
                    </tr>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify the result - check if colspan was preserved
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            const firstCell = targetTable.rows[0].cells[0];

            expect(firstCell.getAttribute('colspan')).toBe('2');
            expect(firstCell.textContent).toBe('Colspan Cell');
        });

        it('should handle pasting a table with both rowspan and colspan', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a complex table to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td rowspan="2" colspan="2">Complex Cell</td>
                        <td>Regular Cell</td>
                    </tr>
                    <tr>
                        <td>Bottom Cell</td>
                    </tr>
                    <tr>
                        <td>Bottom Left</td>
                        <td>Bottom Middle</td>
                        <td>Bottom Right</td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify the result
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            const firstCell = targetTable.rows[0].cells[0];

            expect(firstCell.getAttribute('rowspan')).toBe('2');
            expect(firstCell.getAttribute('colspan')).toBe('2');
            expect(firstCell.textContent).toBe('Complex Cell');
        });
    });

    describe('Table Structure Modification', () => {
        it('should add rows when pasting a table with more rows', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with more rows to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr><td>Row 1</td></tr>
                    <tr><td>Row 2</td></tr>
                    <tr><td>Row 3</td></tr>
                    <tr><td>Row 4</td></tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell4'); // Start at second row

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify rows were added
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows.length).toBeGreaterThanOrEqual(4);
        });

        it('should add columns when pasting a table with more columns', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with more columns to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td>Col 1</td>
                        <td>Col 2</td>
                        <td>Col 3</td>
                        <td>Col 4</td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify columns were added
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows[0].cells.length).toBeGreaterThanOrEqual(4);
        });
    });

    describe('Cell Content Handling', () => {
        it('should preserve HTML content when pasting', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with HTML content to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td><strong>Bold</strong> and <em>italic</em></td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify HTML content was preserved
            const targetCell = document.querySelector('#cell1');
            expect(targetCell.innerHTML).toContain('<strong>Bold</strong>');
            expect(targetCell.innerHTML).toContain('<em>italic</em>');
        });

        it('should handle pasting cells with block elements', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with block elements to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
                <tbody>
                    <tr>
                        <td>
                            <p>Paragraph 1</p>
                            <p>Paragraph 2</p>
                            <ul>
                                <li>List item 1</li>
                                <li>List item 2</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            `;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute the paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify block elements were preserved
            const targetCell = document.querySelector('#cell1');
            expect(targetCell.querySelectorAll('p').length).toBe(2);
            expect(targetCell.querySelectorAll('ul').length).toBe(1);
            expect(targetCell.querySelectorAll('li').length).toBe(2);
        });
    });

    describe('Table Validation', () => {
        it('should validate and extract tables from pasted content', () => {
            // Create a div with a table inside
            const pastedNode = document.createElement('div');
            pastedNode.innerHTML = '<table><tr><td>Valid Table</td></tr></table>';

            // Test the validation method
            const validTable = tablePasting.getValidTableFromPaste(pastedNode);

            // Verify the table was extracted
            expect(validTable).not.toBeNull();
            expect(validTable.nodeName.toLowerCase()).toBe('table');
        });

        it('should return null for invalid table content', () => {
            // Create a div with non-table content
            const pastedNode = document.createElement('div');
            pastedNode.innerHTML = '<p>Not a table</p>';

            // Test the validation method
            const validTable = tablePasting.getValidTableFromPaste(pastedNode);

            // Verify null was returned
            expect(validTable).toBeNull();
        });

        it('should handle direct table nodes', () => {
            // Create a table directly
            const pastedNode = document.createElement('table');
            pastedNode.innerHTML = '<tr><td>Direct Table</td></tr>';

            // Test the validation method
            const validTable = tablePasting.getValidTableFromPaste(pastedNode);

            // Verify the table was returned
            expect(validTable).not.toBeNull();
            expect(validTable.nodeName.toLowerCase()).toBe('table');
        });
    });

    describe('Error and Edge Cases', () => {
        it('should not throw an error when insertedTable is null', () => {
            const targetCells = document.querySelectorAll('#cell1');
            expect(() => tablePasting.handleTablePaste(null, targetCells)).not.toThrow();
        });

        it('should return null for non-HTML tables in getValidTableFromPaste', () => {
            const notATable = document.createElement('div');
            notATable.innerHTML = '<notatable>This is not a table</notatable>';
            expect(tablePasting.getValidTableFromPaste(notATable)).toBeNull();
        });
    });

    describe('Complex Pasting Scenarios', () => {
        it('should properly handle nested tables within paste', () => {
            elem.innerHTML = basicTableContent;
            const nestedTable = document.createElement('table');
            nestedTable.innerHTML = `
            <tbody>
            <tr><td><table><tr><td>Inner Table</td></tr></table></td></tr>
            </tbody>`;
            const targetCells = document.querySelectorAll('#cell1');
            tablePasting.handleTablePaste(nestedTable, targetCells);
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.querySelector('table')).not.toBeNull();
        });
    });

    describe('Additional handleTablePaste Tests', () => {
        it('should handle pasting a table with more columns than target table', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with more columns to paste
            const insertedTable = document.createElement('table');
            insertedTable.innerHTML = `
            <tbody>
                <tr><td>Extra 1</td><td>Extra 2</td><td>Extra 3</td><td>Extra 4</td></tr>
            </tbody>`;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Perform paste operation
            tablePasting.handleTablePaste(insertedTable, targetCells);

            // Verify additional columns are managed
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows[0].cells.length).toBeGreaterThanOrEqual(4);
        });

        it('should handle pasting a table with incomplete rows', () => {
            // Reset the table content
            elem.innerHTML = basicTableContent;

            // Create a table with missing cells in rows
            const incompleteTable = document.createElement('table');
            incompleteTable.innerHTML = `
            <tbody>
                <tr><td>Partial 1</td></tr>
                <tr><td>Partial 2</td><td>Extra Column</td></tr>
            </tbody>`;

            // Get target cells
            const targetCells = document.querySelectorAll('#cell1');

            // Execute paste
            tablePasting.handleTablePaste(incompleteTable, targetCells);

            // Verify row completion
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows[0].cells.length).toBeGreaterThanOrEqual(3);
        }); 
    });

    describe('Merging and Spanning in Tables', () => {
        it('should handle inserting tables with rowspan intact', () => {
            const spannedTable = document.createElement('table');
            spannedTable.innerHTML = `
            <tbody>
                <tr>
                <td rowspan="2">Spanned Row</td>
                <td>Cell Data</td>
                </tr>
            </tbody>
            `;
            const targetCells = document.querySelectorAll('#cell1');
            tablePasting.handleTablePaste(spannedTable, targetCells);

            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows[0].cells[0].getAttribute('rowspan')).toBe('2');
        });

        it('should handle inserting tables with colspan maintained', () => {
            const spannedTable = document.createElement('table');
            spannedTable.innerHTML = `
            <tbody>
                <tr>
                <td colspan="2">Spanned Column</td>
                </tr>
            </tbody>
            `;
            const targetCells = document.querySelectorAll('#cell1');
            tablePasting.handleTablePaste(spannedTable, targetCells);

            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.rows[0].cells[0].getAttribute('colspan')).toBe('2');
        });
        it('multiple cell selection with pasting', () => {
            const editableElement: HTMLElement = elem.getElementsByTagName('div')[0];
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 89px;"><colgroup><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"></colgroup><tbody><tr style="height: 33.7079%;"><td rowspan="3" style="height: 77px;" class="e-cell-select e-multi-cells-select">&nbsp;</td><td rowspan="3" style="height: 77px;" class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td><td rowspan="3" style="height: 88px;"><br></td><td style="background-color: rgb(204, 255, 255);">2&nbsp; &nbsp;&nbsp;</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td rowspan="3" style="height: 88px;"><br></td><td rowspan="3" style="height: 88px;"><br></td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody></table>`;
            const pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.7079%;"><td style="background-color: rgb(204, 255, 255);">2&nbsp; &nbsp;&nbsp;</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody>`;
            const targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe(`<colgroup><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"><col style="width: 10%;"></colgroup><tbody><tr style="height: 33.7079%;"><td style="background-color: rgb(204, 255, 255);" class="e-cell-select e-multi-cells-select">2&nbsp; &nbsp;&nbsp;</td><td style="background-color: rgb(204, 255, 255);" class="e-cell-select e-multi-cells-select e-cell-select-end">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 88px;"><br></td><td style="background-color: rgb(204, 255, 255);">2&nbsp; &nbsp;&nbsp;</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td rowspan="3" style="height: 88px;"><br></td><td rowspan="3" style="height: 88px;"><br></td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td></tr><tr style="height: 32.5843%;"><td class="e-cell-select e-multi-cells-select" style="background-color: rgb(51, 51, 255);">3</td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr style="height: 32.5843%;"><td class="e-cell-select e-multi-cells-select" style="background-color: rgb(204, 255, 255);">4</td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody>`);
        });
        it('multiple cell selection with pasting with cell overflow', () => {
            const editableElement: HTMLElement = elem.getElementsByTagName('div')[0];
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 79px;"><colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td class=""><br></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td class="e-cell-select e-multi-cells-select"><br></td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td></tr></tbody></table>`;
            const pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.7079%;"><td style="background-color: rgb(204, 255, 255);">2&nbsp; &nbsp;&nbsp;</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr style="height: 32.5843%;"><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody>`;
            const targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe(`<colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td class=""><br></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td class="e-cell-select e-multi-cells-select" style="background-color: rgb(204, 255, 255);">2&nbsp; &nbsp;&nbsp;</td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style="background-color: rgb(51, 51, 255);">3</td></tr></tbody>`);
        });
        it('multiple cell selection with pasting with cell with col and row span', () => {
            const editableElement: HTMLElement = elem.getElementsByTagName('div')[0];
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 79px;"><colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td class=""><br></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td class="e-cell-select e-multi-cells-select"><br></td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td></tr></tbody></table>`;
            const pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td colspan="2" rowspan="3" style="height: 77px;"></td><td><br></td></tr><tr><td><br></td></tr><tr><td><br></td></tr></tbody>`;
            const targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe(`<colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td class=""><br></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td class="e-cell-select e-multi-cells-select" rowspan="2" style="height: 51.3333px;"></td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody>`);
        });
        it('multiple columns selection with pasting with cell with col and row span', () => {
            const editableElement: HTMLElement = elem.getElementsByTagName('div')[0];
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 79px;"><colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);" class="e-cell-select e-multi-cells-select">2</td><td class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td><br></td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td><br></td></tr></tbody></table>`;
            const pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td colspan="2" rowspan="3" style="height: 77px;"></td><td><br></td></tr><tr><td><br></td></tr><tr><td><br></td></tr></tbody>`;
            const targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            const targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 32.9114%;"><td rowspan="2" style="height: 51px;">0&nbsp; &nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="height: 25.6667px;" class="e-cell-select e-multi-cells-select" colspan="2"></td></tr><tr style="height: 32.9114%;"><td style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td><br></td></tr><tr style="height: 32.9114%;"><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td><br></td></tr></tbody>');
        });
        it('single cell selection with pasting cases', () => {
            const editableElement: HTMLElement = elem.getElementsByTagName('div')[0];
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 33.3333%;"><td colspan="3" style="height: 26px; background-color: rgb(0, 179, 0);" class="e-cell-select">&nbsp;</td><td>1</td><td>2</td><td rowspan="3" style="height: 77px;"><br></td></tr><tr style="height: 33.3333%;"><td style="background-color: rgb(0, 179, 0);"><br></td><td colspan="2" style="height: 26px; background-color: rgb(0, 179, 0);"><br></td><td>3</td><td>4</td></tr><tr style="height: 33.3333%;"><td style="background-color: rgb(0, 179, 0);"><br></td><td style="background-color: rgb(0, 179, 0);"><br></td><td style="background-color: rgb(0, 179, 0);"><br></td><td>5</td><td>6</td></tr></tbody></table>`;
            let pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.3333%;"><td>2</td><td rowspan="3" style="height: 77px;"><br></td></tr><tr style="height: 33.3333%;"><td>4</td></tr><tr style="height: 33.3333%;"><td>6</td></tr></tbody>`;
            let targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            let targetTable: HTMLTableElement = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr style="height: 33.3333%;"><td class="e-cell-select" style="">2</td><td class="e-cell-select" rowspan="3" style="height: 77px;"><br></td><td style="height: 26px; background-color: rgb(0, 179, 0);" class="e-cell-select"></td><td>1</td><td>2</td><td rowspan="3" style="height: 77px;"><br></td></tr><tr style="height: 33.3333%;"><td style="">4</td><td class="" style="height: 26px; background-color: rgb(0, 179, 0);"><br></td><td>3</td><td>4</td></tr><tr style="height: 33.3333%;"><td style="">6</td><td style="background-color: rgb(0, 179, 0);"><br></td><td>5</td><td>6</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr><td rowspan="2" style="height: 51px;" class="e-cell-select">0&nbsp;&nbsp;</td><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td><br></td><td><br></td><td><br></td></tr><tr><td style="background-color: rgb(51, 51, 255);">3</td><td><br></td><td><br></td><td><br></td></tr><tr><td>000</td><td style="background-color: rgb(204, 255, 255);">4</td><td><br></td><td><br></td><td><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);">1</td><td style="background-color: rgb(204, 255, 255);">2</td></tr><tr><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr><td style="background-color: rgb(204, 255, 255);">4</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"><col style="width: 16.6667%;"></colgroup><tbody><tr><td rowspan="3" style="height: 77px; background-color: rgb(255, 255, 0);" class="e-cell-select">1</td><td style="background-color: rgb(204, 255, 255);">2</td><td style="background-color: rgb(204, 255, 255);">2</td><td><br></td><td><br></td><td><br></td></tr><tr><td class="" style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(51, 51, 255);">3</td><td><br></td><td><br></td><td><br></td></tr><tr><td class="" style="background-color: rgb(204, 255, 255);">4</td><td style="background-color: rgb(204, 255, 255);">4</td><td><br></td><td><br></td><td><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="height: 77px;" rowspan="3" class="e-cell-select">1&nbsp;&nbsp;<br>2<br>3</td><td style="">1</td><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);" class="">1<br></td></tr><tr><td style="">2</td></tr><tr><td style="">3</td></tr><tr><td style="">4</td><td style="">4</td></tr><tr><td style="">5</td><td style="">5</td><td style="background-color: rgb(179, 255, 255);" class="">5</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);">1<br></td></tr><tr></tr><tr></tr><tr></tr><tr><td style="background-color: rgb(179, 255, 255);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="height: 103px; background-color: rgb(179, 255, 255);" rowspan="4" class="e-cell-select">1<br></td><td style="">1</td><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);" class="">1<br></td></tr><tr><td style="">2</td></tr><tr><td style="">3</td></tr><tr><td style="">4</td></tr><tr><td style="background-color: rgb(179, 255, 255);">5</td><td style="">5</td><td style="background-color: rgb(179, 255, 255);" class="">5</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="height: 77px;" rowspan="3" class="e-cell-select">1&nbsp;&nbsp;<br>2<br>3</td><td style="">1</td><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);" class="">1<br></td></tr><tr><td style="">2</td></tr><tr><td style="">3</td></tr><tr><td style="">4</td><td style="">4</td></tr><tr><td style="">5</td><td style="">5</td><td style="background-color: rgb(179, 255, 255);" class="">5</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td>1</td><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);">1<br></td></tr><tr><td>2</td></tr><tr><td>3</td></tr><tr><td>4</td></tr><tr><td>5</td><td style="background-color: rgb(179, 255, 255);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="" class="e-cell-select">1</td><td style="height: 103px; background-color: rgb(179, 255, 255);" rowspan="4">1<br></td><td rowspan="4" style="height: 103px; background-color: rgb(179, 255, 255);" class="">1<br></td></tr><tr><td class="e-cell-select" style="">2</td></tr><tr><td class="e-cell-select" style="">3</td></tr><tr><td style="">4</td></tr><tr><td style="">5</td><td style="background-color: rgb(179, 255, 255);">5</td><td style="background-color: rgb(179, 255, 255);" class="">5</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 138px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 23.913%;"><td style="height: 77px; background-color: rgb(0, 179, 0);" rowspan="3" class="e-cell-select">1&nbsp; &nbsp;<br>2<br>3</td><td style="background-color: rgb(230, 230, 0);" class="">1</td><td rowspan="4" style="height: 137px; background-color: rgb(179, 255, 255);" class="">1<br><br>5</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(198, 140, 83);" class="">2</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 255, 0);" class="">3</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 255, 255);">4</td><td style="background-color: rgb(0, 0, 255);" class="">4</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 23.913%;"><td style="background-color: rgb(230, 230, 0);">1</td><td rowspan="4" style="height: 137px; background-color: rgb(179, 255, 255);">1<br><br>5</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(198, 140, 83);">2</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 255, 0);">3</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 0, 255);">4</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 23.913%;"><td style="background-color: rgb(230, 230, 0);" class="e-cell-select">1</td><td style="height: 137px; background-color: rgb(179, 255, 255);" class="" rowspan="4">1<br><br>5</td><td rowspan="4" style="height: 137px; background-color: rgb(179, 255, 255);" class="">1<br><br>5</td></tr><tr style="height: 18.8406%;"><td class="e-cell-select" style="background-color: rgb(198, 140, 83);">2</td></tr><tr style="height: 18.8406%;"><td class="e-cell-select" style="background-color: rgb(0, 255, 0);">3</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 0, 255);">4</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="background-color: rgb(51, 255, 51); height: 77px;" rowspan="3" class="e-cell-select">1</td><td style="background-color: rgb(0, 0, 153); height: 103px;" rowspan="4" class="">11</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">2</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">3</td><td style="background-color: rgb(0, 153, 153);" class="">22</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">4</td><td style="background-color: rgb(255, 255, 128);" class="">33</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td rowspan="4" style="background-color: rgb(0, 0, 153); height: 103px;">11</td><td style="background-color: rgb(255, 128, 128);"><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);"><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);"><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);"><br></td></tr><tr><td style="background-color: rgb(0, 153, 153);">22</td><td style="background-color: rgb(255, 128, 128);"><br></td></tr><tr><td style="background-color: rgb(255, 255, 128);">33</td><td style="background-color: rgb(255, 128, 128);"><br></td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="background-color: rgb(0, 0, 153); height: 103px;" rowspan="4" class="e-cell-select">11</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(255, 128, 128);"><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(255, 128, 128);"><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(255, 128, 128);"><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(0, 153, 153);">22</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 128);">33</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="background-color: rgb(51, 255, 51); height: 77px;" rowspan="3" class="e-cell-select">1</td><td style="background-color: rgb(0, 0, 153); height: 103px;" rowspan="4" class="">11</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">2</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">3</td><td style="background-color: rgb(0, 153, 153);" class="">22</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">4</td><td style="background-color: rgb(255, 255, 128);" class="">33</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td rowspan="4" style="height: 103px; background-color: rgb(128, 128, 255);">1<br>2<br>3<br>4</td><td style="background-color: rgb(51, 51, 255);">1</td></tr><tr><td style="background-color: rgb(51, 51, 255);">2</td></tr><tr><td style="background-color: rgb(51, 51, 255);">3</td></tr><tr><td style="background-color: rgb(51, 51, 255);">4</td></tr><tr><td style="background-color: rgb(128, 128, 255);">5</td><td style="background-color: rgb(51, 51, 255);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td style="height: 103px; background-color: rgb(128, 128, 255);" rowspan="4" class="e-cell-select">1<br>2<br>3<br>4</td><td style="background-color: rgb(51, 51, 255);" class="">1</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(51, 51, 255);">2</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(51, 51, 255);">3</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td class="" style="background-color: rgb(51, 51, 255);">4</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(128, 128, 255);">5</td><td style="background-color: rgb(51, 51, 255);" class="">5</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr><tr><td style="background-color: rgb(255, 255, 0);">4</td><td style="background-color: rgb(255, 255, 128);" class="">33</td><td style="background-color: rgb(255, 128, 128);" class=""><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 20%;"><td rowspan="4" style="height: 103px; background-color: rgb(0, 179, 0);" class="e-cell-select">00</td><td rowspan="2" style="height: 52px; background-color: rgb(0, 153, 153);">1</td><td style="background-color: rgb(255, 51, 51);">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 51, 51);">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 128);">2</td><td style="background-color: rgb(255, 51, 51);">7</td></tr><tr style="height: 20%;"><td style="background-color: rgb(128, 128, 255);">3</td><td style="background-color: rgb(255, 51, 51);">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 0);">012</td><td style="background-color: rgb(223, 191, 159);">4</td><td style="background-color: rgb(255, 51, 51);">9</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 20%;"><td rowspan="2" style="height: 52px; background-color: rgb(0, 153, 153);">1</td><td style="background-color: rgb(255, 51, 51);">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 51, 51);">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 128);">2</td><td style="background-color: rgb(255, 51, 51);">7</td></tr><tr style="height: 20%;"><td style="background-color: rgb(128, 128, 255);">3</td><td style="background-color: rgb(255, 51, 51);">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(223, 191, 159);">4</td><td style="background-color: rgb(255, 51, 51);">9</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 20%;"><td rowspan="2" style="height: 52px; background-color: rgb(0, 153, 153);" class="e-cell-select">1</td><td style="background-color: rgb(255, 51, 51);">5</td><td style="background-color: rgb(255, 51, 51);">5</td></tr><tr style="height: 20%;"><td class="" style="background-color: rgb(255, 51, 51);">6</td><td style="background-color: rgb(255, 51, 51);">6</td></tr><tr style="height: 20%;"><td class="e-cell-select" style="background-color: rgb(255, 255, 128);">2</td><td style="background-color: rgb(255, 51, 51);">7</td><td style="background-color: rgb(255, 51, 51);">7</td></tr><tr style="height: 20%;"><td class="e-cell-select" style="background-color: rgb(128, 128, 255);">3</td><td style="background-color: rgb(255, 51, 51);">8</td><td style="background-color: rgb(255, 51, 51);">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(223, 191, 159);">4</td><td style="background-color: rgb(255, 51, 51);">9</td><td style="background-color: rgb(255, 51, 51);">9</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 20%;"><td rowspan="4" style="height: 103px; background-color: rgb(0, 179, 0);" class="e-cell-select">00&nbsp;</td><td rowspan="2" style="height: 52px; background-color: rgb(0, 153, 153);" class="">1</td><td style="background-color: rgb(255, 51, 51);" class="">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 51, 51);" class="">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 128);" class="">2</td><td style="background-color: rgb(255, 51, 51);" class="">7</td></tr><tr style="height: 20%;"><td style="background-color: rgb(128, 128, 255);" class="">3</td><td style="background-color: rgb(255, 51, 51);" class="">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 0);">012</td><td style="background-color: rgb(223, 191, 159);" class="">4</td><td style="background-color: rgb(255, 51, 51);" class="">9</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td rowspan="3" style="height: 77px;" class=""><br></td><td rowspan="4" style="height: 103px;" class="">2&nbsp;</td><td class=""><br></td></tr><tr><td class=""><br></td></tr><tr><td class=""><br></td></tr><tr><td class="">1111</td><td class=""><br></td></tr><tr><td class="">11</td><td class="">1</td><td class=""><br></td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 20%;"><td rowspan="3" style="height: 77px;" class="e-cell-select"><br></td><td rowspan="4" style="height: 103px;" class="">2&nbsp;</td><td style="" class=""><br></td></tr><tr style="height: 20%;"><td style="" class=""><br></td></tr><tr style="height: 20%;"><td style="" class=""><br></td></tr><tr style="height: 20%;"><td class="e-cell-select" style="">1111</td><td style="" class=""><br></td></tr><tr style="height: 20%;"><td style="">11</td><td style="" class="">1</td><td style="" class=""><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 20%;"><td rowspan="3" style="background-color: rgb(255, 255, 0); height: 78px;" class="">5&nbsp; &nbsp;&nbsp;<br>6<br>7</td><td style="background-color: rgb(51, 255, 51); height: 78px;" rowspan="3" class="">5<br>6<br>7</td><td style="background-color: rgb(51, 255, 51);" class="">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(51, 255, 51);" class="">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(51, 255, 51);" class="">7</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 0);">8</td><td style="background-color: rgb(255, 255, 0);" class="">8</td><td style="background-color: rgb(255, 255, 0);" class="">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 0);">9</td><td style="background-color: rgb(255, 255, 0);" class="">9</td><td style="background-color: rgb(255, 255, 0);" class="e-cell-select">9&nbsp;</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 20%;"><td rowspan="3" style="background-color: rgb(51, 255, 51); height: 78px;">5<br>6<br>7</td><td style="background-color: rgb(51, 255, 51);">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(51, 255, 51);">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(51, 255, 51);">7</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.rows.length).toBe(7);
            expect(targetTable.rows[0].cells.length).toBe(4);

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 138px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 23.913%;"><td style="height: 77px; background-color: rgb(0, 179, 0);" rowspan="3" class="e-cell-select">1&nbsp; &nbsp;<br>2<br>3</td><td style="background-color: rgb(230, 230, 0);">1</td><td rowspan="4" style="height: 137px; background-color: rgb(179, 255, 255);">1<br><br>5</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(198, 140, 83);">2</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 255, 0);">3</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(0, 255, 255);">4</td><td style="background-color: rgb(0, 0, 255);">4</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 20%;"><td rowspan="2" style="height: 52px; background-color: rgb(0, 153, 153);">1</td><td style="background-color: rgb(255, 51, 51);">5</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 51, 51);">6</td></tr><tr style="height: 20%;"><td style="background-color: rgb(255, 255, 128);">2</td><td style="background-color: rgb(255, 51, 51);">7</td></tr><tr style="height: 20%;"><td style="background-color: rgb(128, 128, 255);">3</td><td style="background-color: rgb(255, 51, 51);">8</td></tr><tr style="height: 20%;"><td style="background-color: rgb(223, 191, 159);">4</td><td style="background-color: rgb(255, 51, 51);">9</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr style="height: 23.913%;"><td style="height: 52px; background-color: rgb(0, 153, 153);" rowspan="2" class="e-cell-select">1</td><td style="background-color: rgb(255, 51, 51);">5</td><td rowspan="4" style="height: 137px; background-color: rgb(179, 255, 255);">1<br><br>5</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(255, 51, 51);">6</td></tr><tr style="height: 18.8406%;"><td class="e-cell-select" style="background-color: rgb(255, 255, 128);">2</td><td style="background-color: rgb(255, 51, 51);">7</td></tr><tr style="height: 18.8406%;"><td style="background-color: rgb(128, 128, 255);">3</td><td style="background-color: rgb(255, 51, 51);">8</td></tr><tr><td style="background-color: rgb(223, 191, 159);">4</td><td style="background-color: rgb(255, 51, 51);">9</td><td><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table pasteContent_RTE e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 26px;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 26px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">2</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">4</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 26px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td></tr><tr style="height: 26px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 26px;"><td class="e-cell-select" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select"></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 26px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">4</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px; height: 171px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select">&nbsp;&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 144px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" rowspan="3"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td class="e-cell-select" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td class="e-cell-select" rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select"></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 19.2px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px; height: 171px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp; 1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 144px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" rowspan="3" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">7</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">8</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp; 1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="e-cell-select">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" rowspan="3" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">8</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px; height: 171px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp; 1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 144px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" rowspan="3" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="e-cell-select">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">7</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">8</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp; 1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">2</td><td style="border: 1px solid rgb(189, 189, 189); height: 48px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="e-cell-select">2</td><td class="" rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="">8</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px; height: 171px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp;&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 144px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" rowspan="3"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="e-cell-select"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 15.2047%;"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" class="">&nbsp;&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 15.2047%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 96px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);" rowspan="2"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 26px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td></tr><tr style="height: 23.9766%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">6</td></tr><tr style="height: 45.0292%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="e-cell-select">2</td><td class="" rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px;" class=""><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">4</td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">6</td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="e-cell-select">&nbsp; &nbsp; &nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;2</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="e-cell-select"><br></td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp; &nbsp; &nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="e-cell-select">&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;2</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp; &nbsp; &nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="e-cell-select"><br></td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td colspan="1" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;1</td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td><td class="" style="border: 1px solid rgb(189, 189, 189); min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;2</td><td class="" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);"></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp; &nbsp; &nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="e-cell-select">&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td colspan="3" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;2</td><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">6</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td></tr><tr><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp; &nbsp; &nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px;" class="">&nbsp;</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class="e-cell-select"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;"><br></td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;"><br></td></tr><tr style=";"><td colspan="2" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;1</td><td class="" colspan="1" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style=";"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;2</td><td colspan="1" style="border: 1px solid rgb(189, 189, 189); ; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">&nbsp;3</td><td class="" colspan="1" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">3</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25.64px;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">4</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 179, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table e-rte-paste-html-table" style="margin-bottom: 10px; color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); width: 1179.52px; min-width: 0px;"><colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 103px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 204, 204);" rowspan="4" class="e-cell-select">1&nbsp; &nbsp;<br>3<br>5</td><td style="border: 1px solid rgb(189, 189, 189); height: 103px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 204, 204);" rowspan="4">1&nbsp; &nbsp; &nbsp;&nbsp;<br>3<br>5</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">2</td><td style="border: 1px solid rgb(189, 189, 189); padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;">2</td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;">1</td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class="">&nbsp;<br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" rowspan="3" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">2</td><td style="border: 1px solid rgb(189, 189, 189); padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td></tr><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"><col style="width: 196.48px;"></colgroup><tbody><tr style="height: 25%;"><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="e-cell-select">2</td><td style="border: 1px solid rgb(189, 189, 189); padding: 2px 5px; background-color: rgb(255, 255, 0);">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">2</td><td style="border: 1px solid rgb(189, 189, 189); padding: 2px 5px; background-color: rgb(255, 255, 0);" class="">1</td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px;">2</td><td style="border: 1px solid rgb(189, 189, 189);/* height: 77px; */min-width: 20px;padding: 2px 5px;">1</td></tr><tr style="height: 25%;"><td class="e-cell-select" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);">&nbsp;<br></td><td class="" rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class="">&nbsp;<br></td><td style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" rowspan="3" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);">&nbsp;<br></td><td rowspan="3" style="border: 1px solid rgb(189, 189, 189); height: 77px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25%;"><td class="e-cell-select" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr><tr style="height: 25%;"><td class="e-cell-select" style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);"><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(0, 0, 255);" class=""><br></td><td style="border: 1px solid rgb(189, 189, 189); height: 20px; min-width: 20px; padding: 2px 5px; background-color: rgb(255, 255, 0);"><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 78px;"><colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td colspan="2" style="height: 26px;" class="e-cell-select">12</td><td><br></td><td><br></td><td><br></td></tr><tr style="height: 33.3333%;"><td>22</td><td>22222</td><td colspan="2" style="height: 26px;">ewqe</td><td class=""><br></td></tr><tr style="height: 33.3333%;"><td>222</td><td>2222</td><td>ewqewq</td><td>wew</td><td><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.3333%;"><td colspan="2" style="height: 26px;">ewqe</td></tr><tr style="height: 33.3333%;"><td>ewqewq</td><td class="e-cell-select">wew</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td colspan="2" style="height: 26px;" class="e-cell-select">ewqe</td><td><br></td><td><br></td><td><br></td></tr><tr style="height: 33.3333%;"><td style="">ewqewq</td><td style="">wew</td><td colspan="2" style="height: 26px;">ewqe</td><td class=""><br></td></tr><tr style="height: 33.3333%;"><td>222</td><td>2222</td><td>ewqewq</td><td>wew</td><td><br></td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td class="e-cell-select" colspan="2" style="height: 26px;">12&nbsp;&nbsp;</td><td class="" colspan="3" style="height: 26px;">3454</td></tr><tr style="height: 33.3333%;"><td class="">q</td><td class="">qww</td><td class="">qw</td><td class="">wqwq</td><td class="">qwq</td></tr><tr style="height: 33.3333%;"><td class="">wq</td><td class="">q</td><td class="">q</td><td class="">q</td><td class="">qwq</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.3333%;"><td colspan="3" style="height: 26px;">3454</td></tr><tr style="height: 33.3333%;"><td>qw</td><td>wqwq</td><td>qwq</td></tr><tr style="height: 33.3333%;"><td>q</td><td>q</td><td>qwq</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td class="e-cell-select" colspan="3" style="height: 26px;">3454</td><td class="" colspan="2" style="height: 26px;"><br></td></tr><tr style="height: 33.3333%;"><td class="" style="">qw</td><td class="" style="">wqwq</td><td class="" style="">qwq</td><td class="">wqwq</td><td class="">qwq</td></tr><tr style="height: 33.3333%;"><td class="" style="">q</td><td class="" style="">q</td><td class="" style="">qwq</td><td class="">q</td><td class="">qwq</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 78px;"><colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td class="" colspan="2" style="height: 26px;">12&nbsp;&nbsp;</td><td class="e-cell-select" colspan="3" style="height: 26px;">3454&nbsp;</td></tr><tr style="height: 33.3333%;"><td class="">q</td><td class="">qww</td><td class="">qw</td><td class="">wqwq</td><td class="">qwq</td></tr><tr style="height: 33.3333%;"><td class="">wq</td><td class="">q</td><td class="">q</td><td class="">q</td><td class="">qwq</td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 33.3333%;"><td colspan="2" style="height: 26px;">12&nbsp;&nbsp;</td></tr><tr style="height: 33.3333%;"><td>q</td><td>qww</td></tr><tr style="height: 33.3333%;"><td>wq</td><td>q</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 33.3333%;"><td class="" colspan="2" style="height: 26px;">12&nbsp;&nbsp;</td><td class="e-cell-select" colspan="1" style="height: 26px;"></td><td class="e-cell-select" colspan="2" style="height: 26px;">12&nbsp;&nbsp;</td></tr><tr style="height: 33.3333%;"><td class="">q</td><td class="">qww</td><td class="" style="">q</td><td class="" style="">qww</td><td class="">qwq</td></tr><tr style="height: 33.3333%;"><td class="">wq</td><td class="">q</td><td class="" style="">wq</td><td class="" style="">q</td><td class="">qwq</td></tr></tbody>');

            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 94px;"><colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 39.3617%;"><td colspan="2" style="height: 26px; background-color: rgb(255, 255, 0);" class="e-cell-select">12&nbsp; &nbsp; &nbsp; &nbsp;</td><td colspan="2" rowspan="2" style="height: 52px; background-color: rgb(255, 51, 51);" class="">ewqe</td><td style="background-color: rgb(128, 128, 255);"><br></td></tr><tr style="height: 31.9149%;"><td style="background-color: rgb(51, 255, 51);">22</td><td style="background-color: rgb(51, 255, 51);">22222</td><td style="background-color: rgb(128, 128, 255);"><br></td></tr><tr style="height: 27.6596%;"><td>222</td><td>2222</td><td class="">ewqewq</td><td class="">wew</td><td><br></td></tr></tbody></table>`;
            pastedTable = document.createElement('table');
            pastedTable.innerHTML = `<tbody><tr style="height: 39.3617%;"><td colspan="2" rowspan="2" style="height: 52px; background-color: rgb(255, 51, 51);">ewqe</td></tr><tr style="height: 31.9149%;"></tr><tr style="height: 27.6596%;"><td>ewqewq</td><td>wew</td></tr></tbody>`;
            targetCells = document.querySelectorAll('td.e-cell-select, th.e-cell-select');
            tablePasting.handleTablePaste(pastedTable, targetCells);
            targetTable = document.querySelector('.e-rte-table');
            expect(targetTable.innerHTML).toBe('<colgroup><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"><col style="width: 20%;"></colgroup><tbody><tr style="height: 39.3617%;"><td colspan="2" style="height: 52px; background-color: rgb(255, 51, 51);" class="e-cell-select" rowspan="2">ewqe</td><td colspan="2" rowspan="2" style="height: 52px; background-color: rgb(255, 51, 51);" class="">ewqe</td><td style="background-color: rgb(128, 128, 255);"><br></td></tr><tr style="height: 31.9149%;"><td style="background-color: rgb(128, 128, 255);"><br></td></tr><tr style="height: 27.6596%;"><td style="">ewqewq</td><td style="">wew</td><td class="">ewqewq</td><td class="">wew</td><td><br></td></tr></tbody>')
        });
    });
});