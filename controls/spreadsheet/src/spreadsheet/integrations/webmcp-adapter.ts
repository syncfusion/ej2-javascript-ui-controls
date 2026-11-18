
import { Spreadsheet } from '../base/index';
import { Dialog } from '../services';
import { AssistAction, CommandResult, getSheetProperties, dialog } from '../common/index';
import { CommandExecutor } from './command-executor';
import { registerWebMcpTools, getRangeIndexes, getWebMcpTools } from '../../workbook/common/index';
import { CellModel, getCell, SheetModel, WebMcpTool, WebMcpToolResponse, WebMcpToolExecuteEventArgs } from '../../workbook/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RowModel } from '@syncfusion/ej2-charts';

const webMcpTools : WebMcpTool[] = [
    {
        name: 'getCellData',
        annotations: {
            readOnlyHint: true
        },
        description: 'Returns the value, formula, display text, and optional format of a single cell. Use when you need data from one specific cell; use getRangeData for multiple cells.',
        inputSchema: {
            type: 'object',
            properties: {
                sheetName: { type: 'string', description: 'Sheet name. Defaults to the active sheet.' },
                address: { type: 'string', description: 'Cell address in A1 notation, e.g. "B3".' },
                includeFormat: { type: 'boolean', description: 'When true, include number format info.' }
            },
            required: ['address']
        },
        outputSchema: {
            type: 'object',
            properties: {
                sheetName:   { type: 'string', description: 'Name of the sheet the cell belongs to.' },
                address:     { type: 'string', description: 'Cell address in A1 notation.' },
                value:       { description: 'Raw cell value (string, number, boolean, or null).' },
                displayText: { type: 'string', description: 'Formatted display text as shown in the cell.' },
                formula:     { type: 'string', description: 'Cell formula (e.g. "=SUM(A1:A5)"). Present only when the cell contains a formula.' },
                format:      { type: 'string', description: 'Number format code. Present only when includeFormat is true and a format is set.' },
                style:       { type: 'object', description: 'Cell style object. Present only when includeFormat is true and a style is set.' }
            },
            required: ['sheetName', 'address', 'displayText']
        }
    },
    {
        name: 'getRangeData',
        annotations: {
            readOnlyHint: true
        },
        description: 'Returns an array of cell values, formulas, and display text for a rectangular range (capped at 200 rows). Use when reading multiple cells at once; do not call getCellData repeatedly per cell.',
        inputSchema: {
            type: 'object',
            properties: {
                sheetName: { type: 'string', description: 'Sheet name. Defaults to the active sheet.' },
                range: { type: 'string', description: 'Range in A1:B10 notation. Max 200 rows returned.' },
                includeFormat: { type: 'boolean' }
            },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                sheetName: { type: 'string', description: 'Name of the sheet.' },
                range:     { type: 'string', description: 'Requested range in A1 notation.' },
                rowCount:  { type: 'number', description: 'Number of rows returned (may be less than requested if truncated).' },
                colCount:  { type: 'number', description: 'Number of columns in the range.' },
                truncated: { type: 'boolean', description: 'True when the range exceeded 200 rows and was capped.' },
                cells: {
                    type: 'array',
                    description: 'Row-major 2-D array of cell objects.',
                    items: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                value:       { description: 'Raw cell value.' },
                                displayText: { type: 'string' },
                                formula:     { type: 'string', description: 'Present only when cell contains a formula.' },
                                format:      { type: 'string', description: 'Present only when includeFormat is true.' },
                                style:       { type: 'object', description: 'Present only when includeFormat is true.' }
                            },
                            required: ['displayText']
                        }
                    }
                }
            },
            required: ['sheetName', 'range', 'rowCount', 'colCount', 'truncated', 'cells']
        }
    },
    {
        name: 'getSheetInfo',
        annotations: {
            readOnlyHint: true
        },
        description: 'Returns structural metadata of a sheet including row count, column count, and cell data. Use when you need an overview of the whole sheet; use getRangeData when you only need values from a specific range.',
        inputSchema: {
            type: 'object',
            properties: {
                sheetName: { type: 'string', description: 'Sheet name. Defaults to active sheet.' },
                keys: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional subset of sheet keys, e.g. ["rows"], ["columns"], ["rows","cells"].'
                }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                sheetName:  { type: 'string' },
                sheetIndex: { type: 'number', description: '0-based index of the sheet.' },
                rowCount:   { type: 'number', description: 'Total row count of the sheet.' },
                colCount:   { type: 'number', description: 'Total column count of the sheet.' },
                usedRange:  { type: 'object', description: 'Bounding box of the populated data region.' },
                rows:       { type: 'array',  description: 'Row model array. Present when "rows" is in keys.' },
                columns:    { type: 'array',  description: 'Column model array. Present when "columns" is in keys.' },
                cells:      { type: 'object', description: 'Flat cell map. Present when "cells" is in keys.' }
            },
            required: ['sheetName', 'sheetIndex']
        }
    },
    {
        name: 'sheetList',
        annotations: {
            readOnlyHint: true
        },
        description: 'Returns the names of all sheets in the workbook. Use to discover available sheet names before calling getSheetInfo, getRangeData, or getCellData.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                sheets: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Ordered list of sheet names in the workbook.'
                }
            },
            required: ['sheets']
        }
    },
    {
        name: 'evaluateFormula',
        annotations: {
            readOnlyHint: true
        },
        description: 'Computes a formula string and returns its result without writing to any cell. Use when the user asks for a calculated value without modifying the sheet; use editCell if the result must be stored.',
        inputSchema: {
            type: 'object',
            properties: {
                formula: { type: 'string', description: 'Formula string, e.g. "=SUM(A1:A5)".' }
            },
            required: ['formula']
        },
        outputSchema: {
            type: 'object',
            properties: {
                formula: { type: 'string', description: 'The formula string that was evaluated.' },
                value: { description: 'Computed result — string or number.' }
            },
            required: ['formula', 'value']
        }
    },
    {
        name: 'find',
        annotations: {
            readOnlyHint: true
        },
        description: 'Search a sheet or range for a value and return the matching cell addresses. Use this first to locate the address of a cell when answering a general query, then call getCellData or getRangeData to read the value.',
        inputSchema: {
            type: 'object',
            properties: {
                findValue: { type: 'string', description: 'Term to search for. Prefer a value taken from the user query (e.g. a product name, header label, or ID).' },
                sheetName: { type: 'string', description: 'Sheet name. Defaults to the active sheet.' },
                range: { type: 'string', description: 'Optional range in A1:B10 notation. If omitted, searches the used range of the sheet.' },
                caseSensitive: { type: 'boolean', description: 'Match exact case. Defaults to false.' },
                exactMatch: { type: 'boolean', description: 'Match entire cell content. Defaults to false.' }
            },
            required: ['findValue']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:    { type: 'string', description: 'Echoes "find".' },
                message:   { type: 'string', description: 'Summary, e.g. "Found 3 match(es) for "Shoes" in sheet Price Details."' },
                addresses: {
                    type: 'array',
                    items: { type: 'string', description: 'Fully-qualified address, e.g. "Price Details!B4".' },
                    description: 'All cell addresses where the search term was found. Empty array when no matches.'
                }
            },
            required: ['action', 'message', 'addresses']
        }
    },
    {
        name: 'editCell',
        annotations: {
            readOnlyHint: false
        },
        description: 'Writes a value or formula into a single cell, mutating the spreadsheet. Prefix formulas with "=". Use for targeted single-cell edits; use formatCells if you only need to change appearance without altering the value.',
        inputSchema: {
            type: 'object',
            properties: {
                address: { type: 'string', description: 'A1 notation cell address.' },
                value: { description: 'New cell value or formula string. Any range reference must specify both start and end cells using A1 notation, for example: SheetName!A2:A10, SheetName!B5:D20. Do not use unbounded column or row references such as SheetName!A:A, A:A, SheetName!1:1, or 1:1.' }
            },
            required: ['address', 'value']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "edit".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Human-readable confirmation, e.g. "Updated A1 to 1000."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'formatCells',
        annotations: {
            readOnlyHint: false
        },
        description: 'Applies visual formatting (bold, italic, font, color, background) to a range without changing cell values. Use for appearance changes only; use setNumberFormat when the requirement is a numeric display pattern like currency or percentage.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                formatting: {
                    type: 'object',
                    properties: {
                        bold: { type: 'boolean' },
                        italic: { type: 'boolean' },
                        underline: { type: 'boolean' },
                        strikethrough: { type: 'boolean' },
                        fontSize: { type: 'number' },
                        fontFamily: { type: 'string' },
                        color: { type: 'string', description: 'Hex color, e.g. "#FF0000".' },
                        backgroundColor: { type: 'string' }
                    }
                }
            },
            required: ['range', 'formatting']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', description: 'Echoes "cellFormat".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation of formatting applied.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'setNumberFormat',
        annotations: {
            readOnlyHint: false
        },
        description: 'Applies a named number format (Currency, Percentage, Date, etc.) to a range. Use when the user specifies how numbers should be displayed; use formatCells for font or color changes.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                format: {
                    type: 'string',
                    enum: ['General', 'Number', 'Currency', 'Accounting', 'ShortDate', 'LongDate',
                        'Time', 'Percentage', 'Fraction', 'Scientific', 'Text']
                }
            },
            required: ['range', 'format']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "numberFormat".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation, e.g. "Applied Currency format to A1:A10."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'addConditionalFormat',
        annotations: {
            readOnlyHint: false
        },
        description: 'Adds a rule-based conditional formatting highlight to a range that updates dynamically as values change. Use when the user wants cells to change color based on a condition; use formatCells for static formatting.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                type: {
                    type: 'string',
                    enum: ['GreaterThan', 'LessThan', 'Between', 'EqualTo', 'ContainsText',
                        'DateOccur', 'Duplicate', 'Unique', 'Top10Items', 'Bottom10Items',
                        'Top10Percentage', 'Bottom10Percentage', 'AboveAverage', 'BelowAverage']
                },
                value: { type: 'string', description: 'Threshold value. For Between use "min,max".' },
                cFColor: { type: 'string', enum: ['RedFT', 'YellowFT', 'GreenFT'] }
            },
            required: ['range', 'type']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "conditionalFormat".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'mergeCells',
        annotations: {
            readOnlyHint: false
        },
        description: 'Merges a group of cells into one spanning cell. Use only when explicitly asked to merge; merging destroys data in all cells except the top-left.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                direction: { type: 'string', enum: ['All', 'Vertically', 'Horizontally'] }
            },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "merge".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'toggleWrap',
        annotations: {
            readOnlyHint: false
        },
        description: 'Enables or disables text wrapping within cells of a range so long text shows on multiple lines. Use for wrap-related requests only; do not call this as part of general formatting unless wrap is specifically requested.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                wrap: { type: 'boolean' }
            },
            required: ['range', 'wrap']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "wrap".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'cut',
        annotations: {
            readOnlyHint: false
        },
        description: 'Cuts a range to the internal clipboard, ready for paste. Use copy instead if the source data must be preserved.',
        inputSchema: {
            type: 'object',
            properties: { range: { type: 'string' } },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "cut".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'copy',
        annotations: {
            readOnlyHint: false
        },
        description: 'Copies a range to the internal clipboard without removing source data. Use cut if the intent is to move data rather than duplicate it.',
        inputSchema: {
            type: 'object',
            properties: { range: { type: 'string' } },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "copy".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'paste',
        annotations: {
            readOnlyHint: false
        },
        description: 'Pastes the current clipboard content into the specified destination range.',
        inputSchema: {
            type: 'object',
            properties: { range: { type: 'string', description: 'Paste destination.' } },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "paste".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertChart',
        annotations: {
            readOnlyHint: false
        },
        description: 'Creates and inserts a chart bound to a data range into the active sheet. Use when the user asks to visualize data; pass space-separated ranges like "A1:A11 E1:E11" for discontinuous series.',
        inputSchema: {
            type: 'object',
            properties: {
                range: {
                    type: 'string',
                    description: 'Use a single contiguous range (e.g. "A1:H11") or space-separated discontinuous ranges (e.g. "A1:A11 E1:E11 H1:H11") to plot non-adjacent columns.'
                },
                chartType: {
                    type: 'string',
                    enum: ['Column', 'Bar', 'Line', 'Area', 'Pie', 'Doughnut', 'Scatter',
                        'StackingColumn', 'StackingColumn100', 'StackingBar', 'StackingBar100',
                        'StackingLine', 'StackingLine100', 'StackingArea', 'StackingArea100']
                },
                title: { type: 'string' },
                theme: { type: 'string', enum: ['Material', 'Bootstrap', 'Fabric', 'Office365', 'Tailwind'] },
                isSeriesInRows: { type: 'boolean' },
                height: { type: 'number' },
                width: { type: 'number' }
            },
            required: ['range', 'chartType']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "chart".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation, e.g. "Inserted Column chart for range A1:H11."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'addDataValidation',
        annotations: {
            readOnlyHint: false
        },
        description: 'Attaches an input validation rule to a range that restricts what values can be entered. Use when the user wants to enforce data entry rules or create a dropdown list.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                dvType: { type: 'string', enum: ['WholeNumber', 'Decimal', 'Date', 'Time', 'TextLength', 'List', 'Custom'] },
                dvOperator: { type: 'string', enum: ['Between', 'NotBetween', 'EqualTo', 'NotEqualTo', 'GreaterThan', 'LessThan', 'GreaterThanOrEqualTo', 'LessThanOrEqualTo'] },
                dvValue1: { type: 'string' },
                dvValue2: { type: 'string' },
                dvIgnoreBlank: { type: 'boolean' },
                dvInCellDropDown: { type: 'boolean' }
            },
            required: ['range', 'dvType']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "dataValidation".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'filterRange',
        annotations: {
            readOnlyHint: false
        },
        description: 'Applies a column filter to a range to show only rows matching a condition, or clears an existing filter. Use when the user wants to narrow visible rows; use sortRange if the intent is to reorder rows rather than hide them.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                filterColumn: { type: 'string', description: 'Column letter, e.g. "A".' },
                filterOperator: { type: 'string', enum: ['equal', 'notequal', 'greaterthan', 'lessthan', 'greaterthanorequal', 'lessthanorequal', 'contains', 'startswith', 'endswith', 'isempty', 'isnotempty'] },
                filterValue: { type: 'string' },
                clearFilter: { type: 'boolean', description: 'Set true to remove the existing filter.' }
            },
            required: ['range']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "filter".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'sortRange',
        annotations: {
            readOnlyHint: false
        },
        description: 'Reorders the rows of a range by the values in a specified column in ascending or descending order. Use when the user asks to sort data; use filterRange if the intent is to hide rows rather than reorder them.',
        inputSchema: {
            type: 'object',
            properties: {
                range: { type: 'string' },
                sortColumn: { type: 'string', description: 'Column letter, e.g. "B".' },
                sortOrder: { type: 'string', enum: ['Ascending', 'Descending'] },
                sortContainsHeader: { type: 'boolean' }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "sort".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertRowsColumns',
        annotations: {
            readOnlyHint: false
        },
        description: 'Inserts one or more blank rows or columns at a specified position, shifting existing content down or right. Use when adding new rows or columns; use editCell to fill the inserted cells afterward.',
        inputSchema: {
            type: 'object',
            properties: {
                modelType: { type: 'string', enum: ['Row', 'Column'] },
                startIndex: { type: 'number', description: '1-based row or column index.' },
                count: { type: 'number', description: 'Number to insert. Defaults to 1.' }
            },
            required: ['modelType', 'startIndex']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "insert".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation, e.g. "Inserted 2 Row(s) at position 3."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'deleteRowsColumns',
        annotations: {
            readOnlyHint: false
        },
        description: 'Permanently removes one or more rows or columns at a specified position. This is destructive and shifts remaining content. Use only when the user explicitly asks to delete; prefer insertRowsColumns if the intent is to add space.',
        inputSchema: {
            type: 'object',
            properties: {
                modelType: { type: 'string', enum: ['Row', 'Column'] },
                startIndex: { type: 'number', description: '1-based row or column index.' },
                count: { type: 'number', description: 'Number to delete. Defaults to 1.' }
            },
            required: ['modelType', 'startIndex']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "delete".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation, e.g. "Deleted 1 Row(s) starting at position 5."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertSheet',
        annotations: {
            readOnlyHint: false
        },
        description: 'Inserts one or more new blank sheets into the workbook at a given position. Use when the user asks to add a new sheet or tab.',
        inputSchema: {
            type: 'object',
            properties: {
                startIndex: { type: 'number', description: '0-based sheet index at which to insert. Defaults to inserting after the last sheet.' },
                count:      { type: 'number', description: 'Number of sheets to insert. Defaults to 1.' },
                sheetName:  { type: 'string', description: 'Name for the new sheet. Applied only when inserting a single sheet.' }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:    { type: 'string', description: 'Echoes "insertSheet".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message:   { type: 'string', description: 'Confirmation, e.g. "Inserted 1 sheet at position 2."' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'findReplace',
        annotations: {
            readOnlyHint: false
        },
        description: 'Finds all occurrences of a value in the active sheet and replaces them with a new value. Use only when the user wants to change existing content; use find when you only need to locate a value without modifying it.',
        inputSchema: {
            type: 'object',
            properties: {
                findValue: { type: 'string' },
                replaceValue: { type: 'string' },
                caseSensitive: { type: 'boolean' },
                exactMatch: { type: 'boolean' }
            },
            required: ['findValue', 'replaceValue']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "findAndReplace".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation of replacements made.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'autofill',
        annotations: {
            readOnlyHint: false
        },
        description: 'Extends a data pattern or series from a source range into an adjacent target range automatically. Use when the user asks to fill or extend a series; use editCell for non-pattern single-cell writes.',
        inputSchema: {
            type: 'object',
            properties: {
                dataRange: { type: 'string', description: 'Source range, e.g. "A1:A3".' },
                fillRange: { type: 'string', description: 'Target range to fill, e.g. "A4:A10".' },
                direction: { type: 'string', enum: ['Down', 'Up', 'Left', 'Right'] },
                fillType: { type: 'string', enum: ['FillSeries', 'CopyCells', 'FillFormattingOnly', 'FillWithoutFormatting'] }
            },
            required: ['dataRange', 'fillRange']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "autofill".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'freezePanes',
        annotations: {
            readOnlyHint: false
        },
        description: 'Freezes or unfreezes rows, columns, or both so they remain visible while scrolling. Use for scroll-lock requests only; pass Unfreeze as the freezeType to remove existing frozen panes.',
        inputSchema: {
            type: 'object',
            properties: {
                freezeType: { type: 'string', enum: ['Rows', 'Columns', 'Panes', 'Unfreeze'] },
                row: { type: 'number', description: 'Number of rows to freeze.' },
                column: { type: 'number', description: 'Number of columns to freeze.' }
            },
            required: ['freezeType']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "freezePanes".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'insertHyperlink',
        annotations: {
            readOnlyHint: false
        },
        description: 'Inserts a clickable hyperlink into a cell with a display label. Use for URL or sheet-navigation links; use editCell if you only want to write a plain URL text value without making it clickable.',
        inputSchema: {
            type: 'object',
            properties: {
                address: { type: 'string', description: 'URL or sheet reference, e.g. "https://example.com".' },
                displayText: { type: 'string' },
                range: { type: 'string', description: 'Target cell. Defaults to the active cell.' }
            },
            required: ['address']
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "hyperlink".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'save',
        annotations: {
            readOnlyHint: false
        },
        description: 'Opens the export dialog so the user can save the spreadsheet in a chosen format (xlsx, csv, pdf, etc.). Use only when the user explicitly asks to save or export; do not call this automatically at the end of other operations.',
        inputSchema: {
            type: 'object',
            properties: {
                saveType: { type: 'string', enum: ['xlsx', 'xls', 'csv', 'pdf'] }
            }
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "save".' },
                cancelled: { type: 'boolean', description: 'True when the user explicitly denied the action. Do not retry if this is true.' },
                message: { type: 'string', description: 'Confirmation that the save dialog was opened.' }
            },
            required: ['action', 'message']
        }
    },
    {
        name: 'undo',
        annotations: {
            readOnlyHint: false
        },
        description: 'Reverses the last action performed on the spreadsheet. Call once per undo step. Do not call speculatively — only when the user explicitly asks to undo.',
        inputSchema: {
            type: 'object',
            properties: {}
        },
        outputSchema: {
            type: 'object',
            properties: {
                action:  { type: 'string', description: 'Echoes "undo".' },
                message: { type: 'string', description: 'Confirmation that the undo was performed, or a reason it was skipped (e.g. nothing to undo).' }
            },
            required: ['action', 'message']
        }
    }
];
const CAPABILITY_ACTION_MAP: Record<string, AssistAction> = {
    editCell: 'edit',
    formatCells: 'cellFormat',
    setNumberFormat: 'numberFormat',
    addConditionalFormat: 'conditionalFormat',
    mergeCells: 'merge',
    toggleWrap: 'wrap',
    cut: 'cut',
    copy: 'copy',
    paste: 'paste',
    insertChart: 'chart',
    addDataValidation: 'dataValidation',
    filterRange: 'filter',
    sortRange: 'sort',
    insertRowsColumns: 'insert',
    deleteRowsColumns: 'delete',
    insertSheet: 'insertSheet',
    findReplace: 'findAndReplace',
    find: 'find',
    autofill: 'autofill',
    freezePanes: 'freezePanes',
    insertHyperlink: 'hyperlink',
    save: 'save'
};

/**
 * WebMcpSpreadsheet — Integrates Spreadsheet with WebMCP protocol.
 * Inject this module to enable AI tool execution capabilities.
 */
export class WebMcpSpreadsheet {
    private parent: Spreadsheet;
    private executor: CommandExecutor;
    private webMcpAbortController: AbortController | null = null;

    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.executor = new CommandExecutor(parent);
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(getWebMcpTools, this.getTools, this);
        this.parent.on(registerWebMcpTools, this.registerTools, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(getWebMcpTools, this.getTools);
            this.parent.off(registerWebMcpTools, this.registerTools);
        }
    }

    private getTools(args: { toolNames?: string[]; tools?: WebMcpTool[] }): WebMcpTool[] {
        const toolNames: string[] = <string[]>args.toolNames;
        if (toolNames && toolNames.length !== 0) {
            args.tools = webMcpTools.filter((webMcpTool: WebMcpTool) => toolNames.indexOf(webMcpTool.name) !== -1)
                .map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        } else {
            args.tools = webMcpTools.map((webMcpTool: WebMcpTool) => ({ ...webMcpTool }));
        }
        return args.tools;
    }

    private registerTools(args: { prefix?: string, tools?: string[] | WebMcpTool[], exposedTo?: string[] }): void {
        const modelContext: { registerTool: Function } =
            <{ registerTool: Function }>(document as { modelContext?: { registerTool: Function } }).modelContext;
        if (!modelContext || typeof modelContext.registerTool !== 'function') {
            return;
        }
        this.webMcpAbortController = new AbortController();
        const toolPrefix: string = (isNullOrUndefined(args.prefix) ? this.parent.element.id : args.prefix) as string;
        const tools: WebMcpTool[] = args.tools && args.tools.length && typeof args.tools[0] === 'object' ? <WebMcpTool[]>args.tools :
            this.getTools({ toolNames: <string[]>args.tools });
        tools.forEach((tool: WebMcpTool): void => {
            tool.name = `${toolPrefix}_${tool.name}`;
            tool.execute = tool.execute || (async (args: object) => this.executeHandler(tool.name, args || {}));
            const registerOptions: { signal: AbortSignal; exposedTo?: string[] } = {
                signal: (<AbortController>this.webMcpAbortController).signal
            };
            if (Array.isArray(args.exposedTo) && args.exposedTo.length > 0) {
                registerOptions.exposedTo = args.exposedTo;
            }
            modelContext.registerTool(tool, registerOptions);
        });
    }

    private async executeHandler(command: string, args: object): Promise<WebMcpToolResponse> {
        const baseCommand: string = command.includes('_') ? command.substring(command.indexOf('_') + 1) : command;
        const eventArgs: WebMcpToolExecuteEventArgs = { toolName: command, toolArgs: args };
        this.parent.trigger('beforeWebMcpToolExecute', eventArgs);
        if (eventArgs.cancel) {
            return this.message({
                action: command, cancelled: true,
                message: eventArgs.cancellationResponse || '[User_CANCELLED] The tool execution for "${command}" was cancelled by the beforeWebMcpToolExecute event handler. ' +
                        'This is a final, irreversible decision by the user. ' +
                        'Do NOT retry this action, do NOT attempt a variation of it, ' +
                        'and do NOT proceed with any subsequent steps that depend on it. ' +
                        'Acknowledge the cancellation and stop.'
            });
        }
        switch (baseCommand) {
        case 'getCellData': return this.handleGetCellData(args);
        case 'getRangeData': return this.handleGetRangeData(args);
        case 'getSheetInfo': return this.getSheetInfoHandler(args);
        case 'evaluateFormula': return this.handleEvaluateFormula(args);
        case 'find': return this.handleFind(args);
        case 'undo': return this.handleUndo();
        case 'sheetList': return this.handleSheetList();
        default: {
            if (eventArgs.showConfirmationDialog) {
                const summary: string = this.buildConfirmationMessage(baseCommand, args);
                const approved: boolean = await this.requestConfirmation(baseCommand, args, summary);
                if (!approved) {
                    return this.message({
                        action: baseCommand,
                        cancelled: true,
                        message: eventArgs.cancellationResponse || '[USER_CANCELLED] The user explicitly denied: "${summary}". ' +
                                'This is a final, irreversible decision by the user. ' +
                                'Do NOT retry this action, do NOT attempt a variation of it, ' +
                                'and do NOT proceed with any subsequent steps that depend on it. ' +
                                'Acknowledge the cancellation and stop.'
                    });
                }
            }
            const action: AssistAction = CAPABILITY_ACTION_MAP[baseCommand as string] || 'unknown';
            const results: CommandResult[] = await this.executor.executeHandler([{ action, args }]);
            const r: CommandResult = results[0];
            if (!r.success) {
                return this.error(r.message || 'Command failed.');
            }
            return this.message({ action: r.action, message: r.message, ...(r.data || {}) });
        }
        }
    }
    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        if (this.webMcpAbortController) {
            this.webMcpAbortController.abort();
            this.webMcpAbortController = null;
        }
        this.executor = null;
        this.parent = null;
    }

    /**
     * Get the spreadsheet webmcp module name.
     *
     * @returns {string} - Get the spreadsheet webmcp module name.
     */
    public getModuleName(): string {
        return 'WebMcpSpreadsheet';
    }

    private message(data: unknown): WebMcpToolResponse {
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }

    private error(text: string): WebMcpToolResponse {
        return { content: [{ type: 'text', text }], isError: true };
    }

    private resolveSheetName(sheetName: unknown): string {
        return (typeof sheetName === 'string' && sheetName.trim()) ? sheetName.trim() : this.parent.getActiveSheet().name;
    }

    private resolveSheetIndex(sheetName: string): number {
        return (this.parent.sheets).findIndex((sheet: SheetModel) =>
            !isNullOrUndefined(sheet.name) && sheet.name.toLowerCase() === sheetName.toLowerCase());
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private handleGetCellData(args: any): WebMcpToolResponse {
        if (!args.address) { return this.error('Missing required argument: address'); }
        const sheetName: string = this.resolveSheetName(args.sheetName);
        const sheetIndex: number = this.resolveSheetIndex(sheetName);
        if (sheetIndex < 0) { return this.error(`Sheet "${sheetName}" not found.`); }
        try {
            const idx: number[] = getRangeIndexes(args.address);
            const cell: CellModel = getCell(idx[0], idx[1], this.parent.sheets[sheetIndex as number], false, true);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const payload: any = {
                sheetName,
                address: args.address,
                value: cell.value
            };
            const hasContent: boolean = cell.value !== undefined && cell.value !== null && cell.value !== '';
            if (hasContent && cell.format) {
                payload.displayText = this.parent.getDisplayText(cell);
            }
            if (cell.formula)       { payload.formula = cell.formula; }
            if (args.includeFormat) {
                if (cell.format) { payload.format = cell.format; }
                if (cell.style)  { payload.style = cell.style; }
            }
            return this.message(payload);
        } catch {
            return this.error(`Cannot read cell at "${args.address}".`);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private handleGetRangeData(args: any): WebMcpToolResponse {
        if (!args.range) { return this.error('Missing required argument: range'); }
        const sheetName: string = this.resolveSheetName(args.sheetName);
        const sheetIndex: number = this.resolveSheetIndex(sheetName);
        if (sheetIndex < 0) { return this.error(`Sheet "${sheetName}" not found.`); }
        try {
            const idx: number[] = getRangeIndexes(args.range);
            const MAX_ROWS: number = 200;
            const endRow: number = Math.min(idx[2], idx[0] + MAX_ROWS - 1);
            const sheet: SheetModel = this.parent.sheets[sheetIndex as number];
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const cells: any[][] = [];
            for (let row: number = idx[0]; row <= endRow; row++) {
                const rows: RowModel[] = [];
                for (let column: number = idx[1]; column <= idx[3]; column++) {
                    const cell: CellModel = getCell(row, column, sheet, false, true);
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    const cellData: any = { value: cell.value };
                    const hasContent: boolean = cell.value !== undefined && cell.value !== null && cell.value !== '';
                    if (hasContent && cell.format) {
                        cellData.displayText = this.parent.getDisplayText(cell);
                    }
                    if (cell.formula) { cellData.formula = cell.formula; }
                    if (cell.format) { cellData.format = cell.format; }
                    if (cell.style) { cellData.style = cell.style; }
                    rows.push(cellData);
                }
                cells.push(rows);
            }
            return this.message({
                sheetName,
                range: args.range,
                rowCount: endRow - idx[0] + 1,
                colCount: idx[3] - idx[1] + 1,
                truncated: idx[2] > endRow,
                cells
            });
        } catch {
            return this.error(`Cannot read range "${args.range}".`);
        }
    }

    private getSheetInfoHandler(args: { sheetName?: string }): WebMcpToolResponse {
        const sheetName: string = this.resolveSheetName(args.sheetName);
        const sheetIndex: number = this.resolveSheetIndex(sheetName);
        if (sheetIndex < 0) { return this.error(`Sheet "${sheetName}" not found.`); }
        try {
            const sheetData: SheetModel = JSON.parse(getSheetProperties(this.parent, ['rows', 'columns', 'cells'], sheetIndex, ['value']));
            return this.message({ sheetName, sheetIndex, ...sheetData });
        } catch {
            return this.error('Failed to parse sheet properties.');
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private handleEvaluateFormula(args: any): WebMcpToolResponse {
        if (!args.formula) { return this.error('Missing required argument: formula'); }
        try {
            const value: string | number = this.parent.computeExpression(args.formula);
            return this.message({ formula: args.formula, value });
        } catch (e) {
            return this.error((e instanceof Error) ? e.message : `Cannot evaluate formula "${args.formula}".`);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private handleFind(args: any): WebMcpToolResponse {
        if (!args.findValue) { return this.error('Missing required argument: findValue'); }
        try {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const findResult: { message: string; addresses: string[]; } = (this.executor as any).executeFind(args);
            return this.message({ action: 'find', message: findResult.message, addresses: findResult.addresses });
        } catch (e) {
            return this.error((e instanceof Error) ? e.message : 'Find operation failed.');
        }
    }

    private handleUndo(): WebMcpToolResponse {
        try {
            this.parent.undo();
            return this.message({ action: 'undo', message: 'Undo performed successfully.' });
        } catch (e) {
            return this.error((e instanceof Error) ? e.message : 'Undo operation failed.');
        }
    }

    private handleSheetList(): WebMcpToolResponse {
        try {
            const sheets: string[] = (this.parent.sheets).map((sheet: SheetModel) => sheet.name as string);
            return this.message({ sheets });
        } catch (e) {
            return this.error('Failed to retrieve sheet list.');
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private buildConfirmationMessage(command: string, args: any): string {
        switch (command) {
        case 'editCell': return `Edit cell ${args.address} → "${args.value}"`;
        case 'formatCells': return `Apply formatting to range ${args.range}`;
        case 'setNumberFormat': return `Apply "${args.format}" number format to ${args.range}`;
        case 'addConditionalFormat': return `Add conditional format (${args.type}) to ${args.range}`;
        case 'mergeCells': return `Merge cells ${args.range}`;
        case 'toggleWrap': return `${args.wrap ? 'Enable' : 'Disable'} text wrap on ${args.range}`;
        case 'cut': return `Cut range ${args.range}`;
        case 'copy': return `Copy range ${args.range}`;
        case 'paste': return `Paste into ${args.range}`;
        case 'insertChart': return `Insert ${args.chartType} chart for range ${args.range}`;
        case 'addDataValidation': return `Add ${args.dvType} validation to ${args.range}`;
        case 'filterRange': return args.clearFilter ? `Clear filter on ${args.range}`
            : `Filter ${args.range} where column ${args.filterColumn} ${args.filterOperator} "${args.filterValue}"`;
        case 'sortRange': return `Sort ${args.range} by column ${args.sortColumn} (${args.sortOrder})`;
        case 'insertRowsColumns': return `Insert ${args.count} ${args.modelType}(s) at position ${args.startIndex}`;
        case 'deleteRowsColumns': return `Delete ${args.count} ${args.modelType}(s) at position ${args.startIndex}`;
        case 'insertSheet': return `Insert ${args.count || 1} sheet(s)${args.sheetName ? ` named "${args.sheetName}"` : ''} at position ${args.startIndex || 'end'}`;
        case 'findReplace': return `Replace all "${args.findValue}" with "${args.replaceValue}"`;
        case 'autofill': return `Autofill ${args.dataRange} → ${args.fillRange}`;
        case 'freezePanes': return `${args.freezeType === 'Unfreeze' ? 'Unfreeze panes' : `Freeze ${args.freezeType}`}`;
        case 'insertHyperlink': return `Insert hyperlink "${args.displayText}" in ${args.range || 'active cell'}`;
        case 'save': return `Save spreadsheet as ${args.saveType || 'xlsx'}`;
        default: return `Perform "${command}" action`;
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private requestConfirmation(command: string, args: any, summary?: string): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void) => {
            const msg: string = summary || this.buildConfirmationMessage(command, args);
            const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
            let approved: boolean = false;
            dialogInst.show({
                width: 375,
                showCloseIcon: true,
                isModal: true,
                cssClass: 'e-webmcp-confirm-dlg',
                header: 'AI Action Request',
                content: msg,
                enableRtl: this.parent.enableRtl,
                close: (): void => {
                    resolve(approved);
                },
                buttons: [
                    {
                        buttonModel: { content: 'Ok', isPrimary: true },
                        click: (): void => { approved = true; dialogInst.hide(); }
                    }
                ]
            });
        });
    }
}
