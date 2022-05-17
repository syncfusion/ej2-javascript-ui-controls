import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { getCell, HyperlinkModel, SheetModel } from "../../../src/index";
import { EventHandler } from "@syncfusion/ej2-base";

describe('Collaborative Editing ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    const helper2: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet2');
    let sheets2: SheetModel[];

    describe('', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }],
                actionComplete: (args: any) => {
                    if (args.action !== 'gotoSheet') {
                        const copiedArgs: any = JSON.parse(JSON.stringify(args));
                        if (args.action === 'insertImage' || args.action === 'deleteImage' || args.action === 'insertChart' || args.action === 'deleteChart') {
                            copiedArgs.eventArgs.id = copiedArgs.eventArgs.id.split('1')[0] + '2';
                        }
                        helper2.getInstance().updateAction(copiedArgs);
                    }
                }
            });
            helper2.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }, { ranges: [{ dataSource: defaultData }] }], activeSheetIndex: 1 }, done);
            sheets2 = helper2.getInstance().sheets;
        });
        afterAll(() => {
            helper.invoke('destroy');
            helper2.invoke('destroy');
            document.getElementById('spreadsheet2').remove();
        });

        it('Cell save', (done: Function) => {
            helper.edit('A4', 'Text');
            setTimeout(() => {
                setTimeout(() => {
                    expect(getCell(3, 0, sheets2[0]).value).toBe('Text');
                    expect(getCell(3, 0, sheets2[1]).value).toBe('Formal Shoes');
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Cell save - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(3, 0, sheets2[0]).value).toBe('Formal Shoes');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(3, 0, sheets2[0]).value).toBe('Text');
                    expect(getCell(3, 0, sheets2[1]).value).toBe('Formal Shoes');
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Cell delete', (done: Function) => {
            helper.triggerKeyNativeEvent(46);
            setTimeout(() => {
                expect(getCell(3, 0, sheets2[0]).value).toBeUndefined();
                expect(getCell(3, 0, sheets2[1]).value).toBe('Formal Shoes');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Cell delete - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(3, 0, sheets2[0]).value).toBe('Text');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(3, 0, sheets2[0]).value).toBeUndefined();
                    expect(getCell(3, 0, sheets2[1]).value).toBe('Formal Shoes');
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Formula', (done: Function) => {
            helper.edit('I3', '=Sum(H2:H5)');
            setTimeout(() => {
                expect(getCell(2, 8, sheets2[0]).formula).toBe('=Sum(H2:H5)');
                expect(getCell(2, 8, sheets2[1])).toBeNull();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Formula - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 8, sheets2[0]).formula).toBe('');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 8, sheets2[0]).formula).toBe('=Sum(H2:H5)');
                    expect(getCell(2, 8, sheets2[1])).toBeNull();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });


        it('Cut paste', (done: Function) => {
            helper.invoke('cut', ['G9:H10']).then(() => {
                helper.invoke('paste', ['I4']);
                setTimeout(() => {
                    expect(getCell(8, 6, sheets2[0])).toBeNull();
                    expect(getCell(8, 7, sheets2[0])).toBeNull();
                    expect(getCell(9, 6, sheets2[0])).toBeNull();
                    expect(getCell(9, 7, sheets2[0])).toBeNull();
                    expect(getCell(3, 8, sheets2[0]).value as any).toBe(6);
                    expect(getCell(3, 9, sheets2[0]).value as any).toBe(29);
                    expect(getCell(4, 8, sheets2[0]).value as any).toBe(12);
                    expect(getCell(4, 9, sheets2[0]).value as any).toBe(166);
                    expect(getCell(8, 6, sheets2[1]).value as any).toBe(6);
                    expect(getCell(8, 7, sheets2[1]).value as any).toBe(29);
                    expect(getCell(3, 8, sheets2[1])).toBeNull();
                    expect(getCell(3, 9, sheets2[1])).toBeNull();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });

        });

        it('Cut paste - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(8, 6, sheets2[0]).value as any).toBe(6);
                expect(getCell(8, 7, sheets2[0]).value as any).toBe(29);
                expect(getCell(9, 6, sheets2[0]).value as any).toBe(12);
                expect(getCell(9, 7, sheets2[0]).value as any).toBe(166);
                expect(getCell(3, 8, sheets2[0]).value).toBe('');
                expect(getCell(3, 9, sheets2[0]).value).toBe('');
                expect(getCell(4, 8, sheets2[0]).value).toBe('');
                expect(getCell(4, 9, sheets2[0]).value).toBe('');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(8, 6, sheets2[0])).toBeNull();
                    expect(getCell(8, 7, sheets2[0])).toBeNull();
                    expect(getCell(9, 6, sheets2[0])).toBeNull();
                    expect(getCell(9, 7, sheets2[0])).toBeNull();
                    expect(getCell(3, 8, sheets2[0]).value as any).toBe(6);
                    expect(getCell(3, 9, sheets2[0]).value as any).toBe(29);
                    expect(getCell(4, 8, sheets2[0]).value as any).toBe(12);
                    expect(getCell(4, 9, sheets2[0]).value as any).toBe(166);
                    expect(getCell(8, 6, sheets2[1]).value as any).toBe(6);
                    expect(getCell(8, 7, sheets2[1]).value as any).toBe(29);
                    expect(getCell(3, 8, sheets2[1])).toBeNull();
                    expect(getCell(3, 9, sheets2[1])).toBeNull();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Copy paste', (done: Function) => {
            helper.invoke('copy', ['G5:G6']).then(() => {
                helper.invoke('paste', ['J6']);
                setTimeout(() => {
                    expect(getCell(5, 9, sheets2[0]).value as any).toBe(11);
                    expect(getCell(6, 9, sheets2[0]).value as any).toBe(10);
                    expect(getCell(5, 9, sheets2[1])).toBeNull();
                    expect(getCell(6, 9, sheets2[1])).toBeNull();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });

        });

        it('Copy paste - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(5, 9, sheets2[0]).value).toBe('');
                expect(getCell(6, 9, sheets2[0]).value).toBe('');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(5, 9, sheets2[0]).value as any).toBe(11);
                    expect(getCell(6, 9, sheets2[0]).value as any).toBe(10);
                    expect(getCell(5, 9, sheets2[1])).toBeNull();
                    expect(getCell(6, 9, sheets2[1])).toBeNull();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Number format', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.click('#spreadsheet_number_format');
            helper.click('.e-numformat-ddb ul li:nth-child(2)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).format).toBe('0.00');
                expect(getCell(2, 3, sheets2[1]).format).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_number_format');
                helper.click('.e-numformat-ddb ul li:nth-child(3)');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).format).toBe('$#,##0.00');
                    expect(getCell(2, 3, sheets2[1]).format).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Number format - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).format).toBe('0.00');
                expect(getCell(2, 3, sheets2[1]).format).toBeUndefined();
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).format).toBe('$#,##0.00');
                    expect(getCell(2, 3, sheets2[1]).format).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Font family', (done: Function) => {
            helper.click('#spreadsheet_font_name');
            helper.click('.e-font-family ul li:nth-child(2)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontFamily).toBe('Arial Black');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Font family - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style).toBeNull();
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.fontFamily).toBe('Arial Black');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Font size', (done: Function) => {
            helper.click('#spreadsheet_font_size');
            helper.click('.e-font-size-ddb ul li:nth-child(7)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontSize).toBe('16pt');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Font size - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontSize).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.fontSize).toBe('16pt');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Bold', (done: Function) => {
            helper.click('#spreadsheet_bold');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontWeight).toBe('bold');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Bold - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontWeight).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.fontWeight).toBe('bold');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    done();
                });
            });
        });

        it('Italic', (done: Function) => {
            helper.click('#spreadsheet_italic');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.fontStyle).toBe('italic');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Line through', (done: Function) => {
            helper.click('#spreadsheet_line-through');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.textDecoration).toBe('line-through');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Underline', (done: Function) => {
            helper.click('#spreadsheet_underline');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.textDecoration).toBe('underline line-through');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Background color', (done: Function) => {
            helper.click('#spreadsheet_fill_color_picker .e-split-colorpicker');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.backgroundColor).toBe('#ffff00');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Border', (done: Function) => {
            helper.invoke('selectRange', ['D3:E4']);
            helper.click('#spreadsheet_borders');
            helper.click('.e-borders-ddb ul li:nth-child(5)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.borderTop).toBe('1px solid #000000');
                expect(getCell(2, 3, sheets2[0]).style.borderRight).toBe('1px solid #000000');
                expect(getCell(2, 3, sheets2[0]).style.borderBottom).toBe('1px solid #000000');
                expect(getCell(2, 3, sheets2[0]).style.borderLeft).toBe('1px solid #000000');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Border - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.borderTop).toBeUndefined();
                expect(getCell(2, 3, sheets2[0]).style.borderRight).toBeUndefined();
                expect(getCell(2, 3, sheets2[0]).style.borderBottom).toBeUndefined();
                expect(getCell(2, 3, sheets2[0]).style.borderLeft).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.borderTop).toBe('1px solid #000000');
                    expect(getCell(2, 3, sheets2[0]).style.borderRight).toBe('1px solid #000000');
                    expect(getCell(2, 3, sheets2[0]).style.borderBottom).toBe('1px solid #000000');
                    expect(getCell(2, 3, sheets2[0]).style.borderLeft).toBe('1px solid #000000');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    done();
                });
            });
        });

        it('Merge', (done: Function) => {
            helper.click('#spreadsheet_merge');
            helper.setAnimationToNone('.e-merge-alert-dlg');
            helper.click('.e-merge-alert-dlg .e-primary');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).rowSpan).toBe(2);
                expect(getCell(2, 3, sheets2[0]).colSpan).toBe(2);
                expect(getCell(2, 4, sheets2[0]).colSpan).toBe(-1);
                expect(getCell(3, 3, sheets2[0]).rowSpan).toBe(-1);
                expect(getCell(3, 4, sheets2[0]).rowSpan).toBe(-1);
                expect(getCell(3, 4, sheets2[0]).colSpan).toBe(-1);
                expect(getCell(2, 3, sheets2[1]).rowSpan).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).colSpan).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Merge - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).rowSpan).toBeUndefined();
                expect(getCell(2, 3, sheets2[0]).colSpan).toBeUndefined();
                expect(getCell(2, 4, sheets2[0]).colSpan).toBeUndefined();
                expect(getCell(3, 3, sheets2[0]).rowSpan).toBeUndefined();
                expect(getCell(3, 4, sheets2[0]).rowSpan).toBeUndefined();
                expect(getCell(3, 4, sheets2[0]).colSpan).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).rowSpan).toBeUndefined();
                expect(getCell(2, 3, sheets2[1]).colSpan).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).rowSpan).toBe(2);
                    expect(getCell(2, 3, sheets2[0]).colSpan).toBe(2);
                    expect(getCell(2, 4, sheets2[0]).colSpan).toBe(-1);
                    expect(getCell(3, 3, sheets2[0]).rowSpan).toBe(-1);
                    expect(getCell(3, 4, sheets2[0]).rowSpan).toBe(-1);
                    expect(getCell(3, 4, sheets2[0]).colSpan).toBe(-1);
                    expect(getCell(2, 3, sheets2[1]).rowSpan).toBeUndefined();
                    expect(getCell(2, 3, sheets2[1]).colSpan).toBeUndefined();
                    done();
                });
            });
        });

        it('Horizontal Alignment', (done: Function) => {
            helper.click('#spreadsheet_text_align');
            helper.click('#spreadsheet_text_align-popup ul li:nth-child(2)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.textAlign).toBe('center');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Horizontal Alignment - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.textAlign).toBeUndefined();
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.textAlign).toBe('center');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Vertical Alignment', (done: Function) => {
            helper.click('#spreadsheet_vertical_align');
            helper.click('#spreadsheet_vertical_align-popup ul li:nth-child(2)');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.verticalAlign).toBe('middle');
                expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Vertical Alignment - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).style.verticalAlign).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).style.verticalAlign).toBe('middle');
                    expect(getCell(2, 3, sheets2[1]).style).toBeUndefined();
                    done();
                });
            });
        });

        it('Wrap', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.click('#spreadsheet_wrap');
            setTimeout(() => {
                expect(getCell(4, 0, sheets2[0]).wrap).toBeTruthy();
                expect(getCell(4, 0, sheets2[1]).wrap).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Wrap - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(4, 0, sheets2[0]).wrap).toBeUndefined();
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(4, 0, sheets2[0]).wrap).toBeTruthy();
                    expect(getCell(4, 0, sheets2[1]).wrap).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('Conditional Format', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.getInstance().conditionalFormattingModule.setCF({ type: 'GreaterThan', cFColor: 'RedFT', value: '1' });
            setTimeout(() => {
                expect(JSON.stringify(sheets2[0].conditionalFormats[0])).toBe('{"type":"GreaterThan","cFColor":"RedFT","value":"1","range":"D5:D5"}');
                expect(JSON.stringify(sheets2[1].conditionalFormats[0])).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Conditional Format - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(JSON.stringify(sheets2[0].conditionalFormats[0])).toBeUndefined();
                expect(JSON.stringify(sheets2[1].conditionalFormats[0])).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(JSON.stringify(sheets2[0].conditionalFormats[0])).toBe('{"type":"GreaterThan","cFColor":"RedFT","value":"1","range":"D5:D5"}');
                    expect(JSON.stringify(sheets2[1].conditionalFormats[0])).toBeUndefined();
                    done();
                });
            });
        });

        it('Conditional Format -> Clear rules from selected cells', (done: Function) => {
            helper.getInstance().workbookConditionalFormattingModule.clearRules({ range: 'D5', isPublic: false });
            setTimeout(() => {
                expect(sheets2[0].conditionalFormats[0]).toBeUndefined();
                expect(sheets2[1].conditionalFormats[0]).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Clear All', (done: Function) => {
            helper.click('#spreadsheet_clear');
            helper.click('#spreadsheet_clear-popup ul li:nth-child(1)');
            setTimeout(() => {
                expect(getCell(4, 3, sheets2[0]).value).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Clear All - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(4, 3, sheets2[0]).value as any).toBe(15);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(4, 3, sheets2[0]).value).toBeUndefined();
                    done();
                });
            });
        });

        it('Find & Replace', (done: Function) => {
            helper.invoke('selectRange', ['D6']);
            helper.getInstance().replaceHandler({
                value: 'Sneakers',
                mode: 'Sheet',
                isCSen: false,
                isEMatch: false,
                searchBy: 'By Row',
                findOpt: 'next',
                replaceValue: 'Test',
                replaceBy: 'replace',
                sheetIndex: 0,
                isAction: true
            });
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).value).toBe('Test');
                expect(getCell(6, 0, sheets2[1]).value).not.toBe('Test');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Find & Replace - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).value).toBe('Sneakers');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(6, 0, sheets2[0]).value).toBe('Test');
                    expect(getCell(6, 0, sheets2[1]).value).not.toBe('Test');
                    done();
                });
            });
        });

        it('Find & Replace with partial value', (done: Function) => {
            helper.getInstance().replaceHandler({
                value: 'Shoes',
                mode: 'Sheet',
                isCSen: false,
                isEMatch: false,
                searchBy: 'By Row',
                findOpt: 'next',
                replaceValue: 'Test',
                replaceBy: 'replace',
                sheetIndex: 0,
                isAction: true
            });
            setTimeout(() => {
                expect(getCell(7, 0, sheets2[0]).value).toBe('Running Test');
                expect(getCell(7, 0, sheets2[1]).value).not.toBe('Running Test');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Find & ReplaceAll', (done: Function) => {
            helper.getInstance().replaceHandler({
                value: '10',
                mode: 'Sheet',
                isCSen: false,
                isEMatch: false,
                searchBy: 'By Row',
                findOpt: 'next',
                replaceValue: '121',
                replaceBy: 'replaceAll',
                sheetIndex: 0,
                isAction: true
            });
            setTimeout(() => {
                expect(getCell(1, 3, sheets2[0]).value as any).toBe(121);
                expect(getCell(1, 7, sheets2[0]).value as any).toBe(121);
                expect(getCell(6, 9, sheets2[0]).value as any).toBe(121);
                expect(getCell(1, 3, sheets2[0]).value as any).toBe(121);
                expect(getCell(1, 3, sheets2[1]).value as any).toBe(10);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            }, 200);
        });

        it('Find & ReplaceAll - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(1, 3, sheets2[0]).value as any).toBe(10);
                expect(getCell(1, 7, sheets2[0]).value as any).toBe(10);
                expect(getCell(6, 9, sheets2[0]).value as any).toBe(10);
                expect(getCell(1, 3, sheets2[0]).value as any).toBe(10);
                expect(getCell(1, 3, sheets2[1]).value as any).toBe(10);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(1, 3, sheets2[0]).value as any).toBe(121);
                    expect(getCell(1, 7, sheets2[0]).value as any).toBe(121);
                    expect(getCell(6, 9, sheets2[0]).value as any).toBe(121);
                    expect(getCell(1, 3, sheets2[0]).value as any).toBe(121);
                    expect(getCell(1, 3, sheets2[1]).value as any).toBe(10);
                    done();
                });
            });
        });

        it('Hyperlink', (done: Function) => {
            helper.invoke('insertHyperlink', [{ address: 'www.google.com' }, 'Sheet1!A7', 'Test', false]);
            setTimeout(() => {
                expect((getCell(6, 0, sheets2[0]).hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Hyperlink - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).hyperlink).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect((getCell(6, 0, sheets2[0]).hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                    expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                    done();
                });
            });
        });

        it('Remove Hyperlink', (done: Function) => {
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(6, 0, [11]);
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).hyperlink).toBeUndefined();
                expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Remove Hyperlink - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect((getCell(6, 0, sheets2[0]).hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(6, 0, sheets2[0]).hyperlink).toBeUndefined();
                    expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    helper.click('#spreadsheet_undo');
                    done();
                });
            });
        });

        it('Clear Hyperlink', (done: Function) => {
            helper.click('#spreadsheet_clear');
            helper.click('#spreadsheet_clear-popup ul li:nth-child(4)');
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).hyperlink).toBeUndefined();
                expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Clear Hyperlink - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect((getCell(6, 0, sheets2[0]).hyperlink as HyperlinkModel).address).toBe('http://www.google.com');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(6, 0, sheets2[0]).hyperlink).toBeUndefined();
                    expect(getCell(6, 0, sheets2[1]).hyperlink).toBeUndefined();
                    done();
                });
            });
        });

        it('Image', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.createImageElement({
                options: {
                    src: 'https://www.w3schools.com/images/w3schools_green.jpg'
                },
                range: 'D3',
                isPublic: true
            });
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(getCell(2, 3, sheets2[1]).image).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                done();
            });
        });

        it('Image - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).image.length).toBe(0);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                    expect(getCell(2, 3, sheets2[1]).image).toBeUndefined();
                    EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                    done();
                });
            });
        });

        it('Image delete', (done: Function) => {
            helper.getInstance().spreadsheetImageModule.deleteImage({ id: 'spreadsheet_overlay_picture_1' });
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).image.length).toBe(0);
                expect(getCell(2, 3, sheets2[1]).image).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Image Delete - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(2, 3, sheets2[0]).image[0].src).toBe('https://www.w3schools.com/images/w3schools_green.jpg');
                expect(getCell(2, 3, sheets2[1]).image).toBeUndefined();
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(2, 3, sheets2[0]).image.length).toBe(0);
                    expect(getCell(2, 3, sheets2[1]).image).toBeUndefined();
                    done();
                });
            });
        });

        it('Chart Insert', (done: Function) => {
            helper.invoke('selectRange', ['D6:D8']);
            helper.getInstance().spreadsheetChartModule.insertChartHandler({ action: 'column_chart', id: 'clusteredColumn', isChart: true });
            setTimeout(() => {
                expect(JSON.stringify(getCell(5, 3, sheets2[0]).chart[0])).toBe('{"type":"Column","theme":"Material","isSeriesInRows":false,"range":"Sheet1!D6:D8","id":"e_spreadsheet_chart_2","height":290,"width":480,"top":100,"left":192}');
                expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                done();
            });
        });

        it('Chart Insert - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(5, 3, sheets2[0]).chart.length).toBe(0);
                expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(JSON.stringify(getCell(5, 3, sheets2[0]).chart[0])).toBe('{"type":"Column","theme":"Material","isSeriesInRows":false,"range":"Sheet1!D6:D8","id":"e_spreadsheet_chart_2","height":290,"width":480,"top":100,"left":192}');
                    expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                    EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                    done();
                });
            });
        });

        it('Chart Delete', (done: Function) => {
            helper.getInstance().spreadsheetChartModule.deleteChart({ id: 'e_spreadsheet_chart_1_overlay' });
            setTimeout(() => {
                expect(getCell(5, 3, sheets2[0]).chart.length).toBe(0);
                expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Chart Delete - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(JSON.stringify(getCell(5, 3, sheets2[0]).chart[0])).toBe('{"type":"Column","theme":"Material","isSeriesInRows":false,"range":"Sheet1!D6:D8","id":"e_spreadsheet_chart_2","height":290,"width":480,"top":148,"left":192}');
                expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                EventHandler.remove(document, 'mouseup', helper.getInstance().serviceLocator.services.shape.overlayMouseUpHandler);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(getCell(5, 3, sheets2[0]).chart.length).toBe(0);
                    expect(getCell(5, 3, sheets2[1]).chart).toBeUndefined();
                    done();
                });
            });
        });

        it('Protect sheet', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[5] as HTMLElement).click();
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                helper.setAnimationToNone('.e-protect-dlg');
                helper.click('.e-protect-dlg .e-primary');
                setTimeout(() => {
                    expect(sheets2[0].isProtected).toBeTruthy();
                    expect(sheets2[1].isProtected).toBeFalsy();
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('UnProtect sheet', (done: Function) => {
            helper.click('#' + helper.id + '_protect');
            setTimeout(() => {
                expect(sheets2[0].isProtected).toBeFalsy();
                expect(sheets2[1].isProtected).toBeFalsy();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Protect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            setTimeout(() => {
                helper.getElement('.e-protectworkbook-dlg .e-input').value = '1';
                helper.getElement('.e-protectworkbook-dlg .e-password-content:nth-child(2) .e-input').value = '1';
                helper.click('.e-protectworkbook-dlg .e-primary');
                setTimeout(() => {
                    expect(helper2.getInstance().isProtected).toBeTruthy();
                    expect(helper2.getInstance().password).toBe('1');
                    expect(helper2.getInstance().activeSheetIndex).toBe(1);
                    done();
                });
            });
        });

        it('UnProtect workbook', (done: Function) => {
            helper.click('#' + helper.id + '_protectworkbook');
            helper.getElement('.e-unprotectworkbook-dlg .e-input').value = '1';
            helper.getElement('.e-unprotectworkbook-dlg .e-primary').removeAttribute('disabled');
            helper.click('.e-unprotectworkbook-dlg .e-primary');
            setTimeout(() => {
                expect(helper2.getInstance().isProtected).toBeFalsy();
                expect(helper2.getInstance().password).toBe('');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Data validation', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.getElementFromSpreadsheet('#' + helper.id + '_datavalidation').click();
            helper.click('.e-datavalidation-ddb li:nth-child(1)');
            helper.getElements('.e-datavalidation-dlg #minvalue')[0].value = '1';
            helper.getElements('.e-datavalidation-dlg #maxvalue')[0].value = '2';
            helper.setAnimationToNone('.e-datavalidation-dlg');
            helper.getElements('.e-datavalidation-dlg .e-footer-content')[0].children[1].click();
            setTimeout(() => {
                expect(JSON.stringify(getCell(1, 7, sheets2[0]).validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"1","value2":"2","ignoreBlank":true,"inCellDropDown":null}');
                expect(getCell(1, 7, sheets2[1]).validation).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Data validation - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(1, 7, sheets2[0]).validation).toBeUndefined();
                expect(getCell(1, 7, sheets2[1]).validation).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(JSON.stringify(getCell(1, 7, sheets2[0]).validation)).toBe('{"type":"WholeNumber","operator":"Between","value1":"1","value2":"2","ignoreBlank":true,"inCellDropDown":null}');
                    expect(getCell(1, 7, sheets2[1]).validation).toBeUndefined();
                    done();
                });
            });
        });

        it('Hide Headers', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[6] as HTMLElement).click();
            helper.click('#' + helper.id + '_headers');
            setTimeout(() => {
                expect(sheets2[0].showHeaders).toBeFalsy();
                expect(sheets2[1].showHeaders).toBeTruthy();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Show Headers', (done: Function) => {
            helper.click('#' + helper.id + '_headers');
            setTimeout(() => {
                expect(sheets2[0].showHeaders).toBeTruthy();
                expect(sheets2[1].showHeaders).toBeTruthy();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });


        it('Hide Gridlines', (done: Function) => {
            helper.click('#' + helper.id + '_gridlines');
            setTimeout(() => {
                expect(sheets2[0].showGridLines).toBeFalsy();
                expect(sheets2[1].showGridLines).toBeTruthy();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Show Gridlines', (done: Function) => {
            helper.click('#' + helper.id + '_gridlines');
            setTimeout(() => {
                expect(sheets2[0].showGridLines).toBeTruthy();
                expect(sheets2[1].showGridLines).toBeTruthy();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Freeze pane', (done: Function) => {
            helper.click('#' + helper.id + '_freezepanes');
            setTimeout(() => {
                expect(sheets2[0].frozenRows).toBe(1);
                expect(sheets2[0].frozenColumns).toBe(7);
                expect(sheets2[1].frozenRows).toBe(0);
                expect(sheets2[1].frozenColumns).toBe(0);
                expect(helper2.getElementFromSpreadsheet('e-frozen-row')).toBeNull();
                expect(helper2.getElementFromSpreadsheet('e-frozen-column')).toBeNull();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('UnFreeze pane', (done: Function) => {
            helper.click('#' + helper.id + '_freezepanes');
            setTimeout(() => {
                expect(sheets2[0].frozenRows).toBe(0);
                expect(sheets2[0].frozenColumns).toBe(0);
                expect(sheets2[1].frozenRows).toBe(0);
                expect(sheets2[1].frozenColumns).toBe(0);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Insert column before', (done: Function) => {
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 7, [6, 1], null, true);
            setTimeout(() => {
                expect(getCell(0, 7, sheets2[0])).toBeNull();
                expect(getCell(1, 7, sheets2[0]).value).toBeUndefined();
                expect(getCell(2, 7, sheets2[0])).toBeNull();
                expect(getCell(0, 8, sheets2[0]).value).toBe('Profit');
                expect(getCell(1, 8, sheets2[0]).value as any).toBe(121);
                expect(getCell(2, 8, sheets2[0]).value as any).toBe(50);
                expect(getCell(0, 7, sheets2[1]).value).toBe('Profit');
                expect(getCell(1, 7, sheets2[1]).value as any).toBe(10);
                expect(getCell(2, 7, sheets2[1]).value as any).toBe(50);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Insert column before - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(0, 7, sheets2[0]).value).toBe('Profit');
                expect(getCell(1, 7, sheets2[0]).value as any).toBe(121);
                expect(getCell(2, 7, sheets2[0]).value as any).toBe(50);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(0, 7, sheets2[0])).toBeNull();
                    expect(getCell(1, 7, sheets2[0]).value).toBeUndefined();
                    expect(getCell(2, 7, sheets2[0])).toBeNull();
                    expect(getCell(0, 8, sheets2[0]).value).toBe('Profit');
                    expect(getCell(1, 8, sheets2[0]).value as any).toBe(121);
                    expect(getCell(2, 8, sheets2[0]).value as any).toBe(50);
                    expect(getCell(0, 7, sheets2[1]).value).toBe('Profit');
                    expect(getCell(1, 7, sheets2[1]).value as any).toBe(10);
                    expect(getCell(2, 7, sheets2[1]).value as any).toBe(50);
                    done();
                });
            });
        });

        it('Insert column after', (done: Function) => {
            helper.invoke('selectRange', ['F1']);
            helper.openAndClickCMenuItem(0, 5, [6, 2], null, true);
            setTimeout(() => {
                expect(getCell(0, 6, sheets2[0])).toBeNull();
                expect(getCell(1, 6, sheets2[0])).toBeNull();
                expect(getCell(2, 6, sheets2[0])).toBeNull();
                expect(getCell(0, 7, sheets2[0]).value).toBe('Discount');
                expect(getCell(1, 7, sheets2[0]).value as any).toBe(1);
                expect(getCell(2, 7, sheets2[0]).value as any).toBe(5);
                expect(getCell(0, 6, sheets2[1]).value).toBe('Discount');
                expect(getCell(1, 6, sheets2[1]).value as any).toBe(1);
                expect(getCell(2, 6, sheets2[1]).value as any).toBe(5);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Insert column after - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(0, 6, sheets2[0]).value).toBe('Discount');
                expect(getCell(1, 6, sheets2[0]).value as any).toBe(1);
                expect(getCell(2, 6, sheets2[0]).value as any).toBe(5);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(0, 6, sheets2[0])).toBeNull();
                    expect(getCell(1, 6, sheets2[0])).toBeNull();
                    expect(getCell(2, 6, sheets2[0])).toBeNull();
                    expect(getCell(0, 7, sheets2[0]).value).toBe('Discount');
                    expect(getCell(1, 7, sheets2[0]).value as any).toBe(1);
                    expect(getCell(2, 7, sheets2[0]).value as any).toBe(5);
                    expect(getCell(0, 6, sheets2[1]).value).toBe('Discount');
                    expect(getCell(1, 6, sheets2[1]).value as any).toBe(1);
                    expect(getCell(2, 6, sheets2[1]).value as any).toBe(5);
                    done();
                });
            });
        });

        it('Insert row above', (done: Function) => {
            helper.invoke('selectRange', ['A5']);
            helper.openAndClickCMenuItem(4, 0, [6, 1], true);
            setTimeout(() => {
                expect(getCell(4, 0, sheets2[0])).toBeNull();
                expect(getCell(4, 1, sheets2[0])).toBeNull();
                expect(getCell(4, 2, sheets2[0])).toBeNull();
                expect(getCell(5, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                expect(getCell(5, 1, sheets2[0]).value).toBe('11/21/2014');
                expect(getCell(5, 2, sheets2[0]).value).toBe('06:23:54 AM');
                expect(getCell(4, 0, sheets2[1]).value).toBe('Sandals & Floaters');
                expect(getCell(4, 1, sheets2[1]).value).toBe('41964');
                expect(getCell(4, 2, sheets2[1]).value).toBe('0.2665972222222222');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Insert row above - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(4, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                expect(getCell(4, 1, sheets2[0]).value).toBe('11/21/2014');
                expect(getCell(4, 2, sheets2[0]).value).toBe('06:23:54 AM');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(4, 0, sheets2[0])).toBeNull();
                    expect(getCell(4, 1, sheets2[0])).toBeNull();
                    expect(getCell(4, 2, sheets2[0])).toBeNull();
                    expect(getCell(5, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                    expect(getCell(5, 1, sheets2[0]).value).toBe('11/21/2014');
                    expect(getCell(5, 2, sheets2[0]).value).toBe('06:23:54 AM');
                    expect(getCell(4, 0, sheets2[1]).value).toBe('Sandals & Floaters');
                    expect(getCell(4, 1, sheets2[1]).value).toBe('41964');
                    expect(getCell(4, 2, sheets2[1]).value).toBe('0.2665972222222222');
                    done();
                });
            });
        });

        it('Insert row below', (done: Function) => {
            helper.openAndClickCMenuItem(4, 0, [6, 2], true);
            setTimeout(() => {
                expect(getCell(5, 0, sheets2[0])).toBeNull();
                expect(getCell(5, 1, sheets2[0])).toBeNull();
                expect(getCell(5, 2, sheets2[0])).toBeNull();
                expect(getCell(6, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                expect(getCell(6, 1, sheets2[0]).value).toBe('11/21/2014');
                expect(getCell(6, 2, sheets2[0]).value).toBe('06:23:54 AM');
                expect(getCell(5, 0, sheets2[1]).value).toBe('Flip- Flops & Slippers');
                expect(getCell(5, 1, sheets2[1]).value).toBe('41813');
                expect(getCell(5, 2, sheets2[1]).value).toBe('0.03054398148148148');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Insert row below - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(5, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                expect(getCell(5, 1, sheets2[0]).value).toBe('11/21/2014');
                expect(getCell(5, 2, sheets2[0]).value).toBe('06:23:54 AM');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(5, 0, sheets2[0])).toBeNull();
                    expect(getCell(5, 1, sheets2[0])).toBeNull();
                    expect(getCell(5, 2, sheets2[0])).toBeNull();
                    expect(getCell(6, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                    expect(getCell(6, 1, sheets2[0]).value).toBe('11/21/2014');
                    expect(getCell(6, 2, sheets2[0]).value).toBe('06:23:54 AM');
                    expect(getCell(5, 0, sheets2[1]).value).toBe('Flip- Flops & Slippers');
                    expect(getCell(5, 1, sheets2[1]).value).toBe('41813');
                    expect(getCell(5, 2, sheets2[1]).value).toBe('0.03054398148148148');
                    done();
                });
            });
        });

        it('Delete column', (done: Function) => {
            helper.invoke('selectRange', ['F1']);
            helper.openAndClickCMenuItem(0, 5, [7], null, true);
            setTimeout(() => {
                expect(getCell(0, 5, sheets2[0])).toBeNull();
                expect(getCell(1, 5, sheets2[0])).toBeNull();
                expect(getCell(2, 5, sheets2[0])).toBeNull();
                expect(getCell(0, 5, sheets2[1]).value).toBe('Amount');
                expect(getCell(1, 5, sheets2[1]).value as any).toBe(200);
                expect(getCell(2, 5, sheets2[1]).value as any).toBe(600);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Delete column - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(0, 5, sheets2[0]).value).toBe('Amount');
                expect(getCell(1, 5, sheets2[0]).value as any).toBe(200);
                expect(getCell(2, 5, sheets2[0]).value as any).toBe(600);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(0, 5, sheets2[0])).toBeNull();
                    expect(getCell(1, 5, sheets2[0])).toBeNull();
                    expect(getCell(2, 5, sheets2[0])).toBeNull();
                    expect(getCell(0, 5, sheets2[1]).value).toBe('Amount');
                    expect(getCell(1, 5, sheets2[1]).value as any).toBe(200);
                    expect(getCell(2, 5, sheets2[1]).value as any).toBe(600);
                    done();
                });
            });
        });

        it('Delete row', (done: Function) => {
            helper.invoke('selectRange', ['A7']);
            helper.openAndClickCMenuItem(6, 0, [7], true);
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).value).toBe('Flip- Flops & Slippers');
                expect(getCell(6, 1, sheets2[0]).value).toBe('06/23/2014');
                expect(getCell(6, 2, sheets2[0]).value).toBe('12:43:59 AM');
                expect(getCell(6, 0, sheets2[1]).value).toBe('Sneakers');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Delete row - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(getCell(6, 0, sheets2[0]).value).toBe('Sandals & Floaters');
                expect(getCell(6, 1, sheets2[0]).value).toBe('41964');
                expect(getCell(6, 2, sheets2[0]).value).toBe('0.2665972222222222');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(getCell(6, 0, sheets2[0]).value).toBe('Flip- Flops & Slippers');
                    expect(getCell(6, 1, sheets2[0]).value).toBe('06/23/2014');
                    expect(getCell(6, 2, sheets2[0]).value).toBe('12:43:59 AM');
                    expect(getCell(6, 0, sheets2[1]).value).toBe('Sneakers');
                    done();
                });
            });
        });

        it('Hide column', (done: Function) => {
            helper.invoke('selectRange', ['F1']);
            helper.openAndClickCMenuItem(0, 5, [8], null, true);
            setTimeout(() => {
                expect(sheets2[0].columns[5].hidden).toBeTruthy();
                expect(sheets2[1].columns[5]).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Hide column - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(sheets2[0].columns[5].hidden).toBeFalsy();
                expect(sheets2[1].columns[5]).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(sheets2[0].columns[5].hidden).toBeTruthy();
                    expect(sheets2[1].columns[5]).toBeUndefined();
                    done();
                });
            });
        });

        it('Show column', (done: Function) => {
            helper.openAndClickCMenuItem(0, 5, [9], null, true);
            setTimeout(() => {
                expect(sheets2[0].columns[5].hidden).toBeFalsy();
                expect(sheets2[1].columns[5]).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Show column - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(sheets2[0].columns[5].hidden).toBeTruthy();
                expect(sheets2[1].columns[5]).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(sheets2[0].columns[5].hidden).toBeFalsy();
                    expect(sheets2[1].columns[5]).toBeUndefined();
                    done();
                });
            });
        });

        it('Hide column & show column using autofit', (done: Function) => {
            helper.invoke('selectRange', ['L1']);
            helper.openAndClickCMenuItem(0, 11, [8], null, true);
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 12, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = helper.getElementFromSpreadsheet('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(sheets2[0].columns[11].hidden).toBeFalsy();
                expect(sheets2[0].columns[11].width).toBe(64);
                expect(sheets2[1].columns[11]).toBeUndefined();
                expect(helper2.getInstance().sheets[0].columns[11].hidden).toBeFalsy();
                expect(helper2.getInstance().sheets[0].columns[11].width).toBe(64);
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Hide row', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.openAndClickCMenuItem(4, 0, [8], true);
            setTimeout(() => {
                expect(sheets2[0].rows[3].hidden).toBeTruthy();
                expect(sheets2[1].rows[3].hidden).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Hide row - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(sheets2[0].rows[3].hidden).toBeFalsy();
                expect(sheets2[1].rows[3].hidden).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(sheets2[0].rows[3].hidden).toBeTruthy();
                    expect(sheets2[1].rows[3].hidden).toBeUndefined();
                    done();
                });
            });
        });

        it('Show row', (done: Function) => {
            helper.openAndClickCMenuItem(4, 0, [9], true);
            setTimeout(() => {
                expect(sheets2[0].rows[3].hidden).toBeFalsy();
                expect(sheets2[1].rows[3].hidden).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                done();
            });
        });

        it('Show row - Undo & Redo', (done: Function) => {
            helper.getInstance().undoredoModule.performUndoRedo({ isUndo: true });
            setTimeout(() => {
                expect(sheets2[0].rows[3].hidden).toBeTruthy();
                expect(sheets2[1].rows[3].hidden).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                helper.getInstance().undoredoModule.performUndoRedo({ isUndo: false });
                setTimeout(() => {
                    expect(sheets2[0].rows[3].hidden).toBeFalsy();
                    expect(sheets2[1].rows[3].hidden).toBeUndefined();
                    done();
                });
            });
        });

        it('Filter apply', (done: Function) => {
            (helper.getElementFromSpreadsheet('.e-tab-header').children[0].children[2] as HTMLElement).click();
            helper.getInstance().activeSheetIndex = 1;
            helper.getInstance().dataBind();
            helper2.getInstance().activeSheetIndex = 0;
            helper2.getInstance().dataBind();
            setTimeout(() => {
                helper.click('#spreadsheet_sorting');
                helper.click('#spreadsheet_sorting-popup ul li:nth-child(5)');
                setTimeout(() => {
                    expect(helper2.getInstance().filterModule.filterCollection.get(1).length).toBe(0);
                    expect(JSON.stringify(helper2.getInstance().filterModule.filterRange.get(1).range)).toBe('[0,0,10,7]');
                    expect(helper2.getInstance().filterModule.filterRange.get(0)).toBeUndefined();
                    expect(helper2.getInstance().activeSheetIndex).toBe(0);
                    done();
                });
            });
        });

        it('Filter apply - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(helper2.getInstance().filterModule.filterCollection.get(1)).toBeUndefined();
                expect(helper2.getInstance().filterModule.filterRange.get(1)).toBeUndefined();
                expect(helper2.getInstance().filterModule.filterRange.get(0)).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(helper2.getInstance().filterModule.filterCollection.get(1).length).toBe(0);
                    expect(JSON.stringify(helper2.getInstance().filterModule.filterRange.get(1).range)).toBe('[0,0,10,7]');
                    expect(helper2.getInstance().filterModule.filterRange.get(0)).toBeUndefined();
                    done();
                });
            });
        });

        it('Filter predicates', (done: Function) => {
            helper.invoke('selectRange', ['D3']);
            helper.getInstance().filterModule.filterByCellValueHandler();
            setTimeout(() => {
                expect(JSON.stringify(helper2.getInstance().filterModule.filterCollection.get(1))).toBe('[{"field":"D","operator":"equal","type":"number","matchCase":false,"value":20,"ignoreAccent":false}]');
                expect(helper2.getInstance().filterModule.filterCollection.get(0)).toBeUndefined();
                expect(sheets2[1].rows[1].hidden).toBeTruthy();
                expect(sheets2[1].rows[2].hidden).toBeFalsy();
                expect(sheets2[1].rows[4].hidden).toBeTruthy();
                expect(sheets2[1].rows[5].hidden).toBeTruthy();
                expect(sheets2[1].rows[6].hidden).toBeTruthy();
                expect(sheets2[1].rows[7].hidden).toBeFalsy();
                expect(sheets2[1].rows[8].hidden).toBeTruthy();
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                done();
            });
        });

        it('Filter predicates - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(helper2.getInstance().filterModule.filterCollection.get(1)).toBeUndefined();
                expect(helper2.getInstance().filterModule.filterCollection.get(0)).toBeUndefined();
                expect(sheets2[1].rows[1].hidden).toBeFalsy();
                expect(sheets2[1].rows[2].hidden).toBeFalsy();
                expect(sheets2[1].rows[4].hidden).toBeFalsy();
                expect(sheets2[1].rows[5].hidden).toBeFalsy();
                expect(sheets2[1].rows[6].hidden).toBeFalsy();
                expect(sheets2[1].rows[7].hidden).toBeFalsy();
                expect(sheets2[1].rows[8].hidden).toBeFalsy();
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(JSON.stringify(helper2.getInstance().filterModule.filterCollection.get(1))).toBe('[{"field":"D","operator":"equal","type":"number","matchCase":false,"value":20,"ignoreAccent":false}]');
                    expect(helper2.getInstance().filterModule.filterCollection.get(0)).toBeUndefined();
                    expect(sheets2[1].rows[1].hidden).toBeTruthy();
                    expect(sheets2[1].rows[2].hidden).toBeFalsy();
                    expect(sheets2[1].rows[4].hidden).toBeTruthy();
                    expect(sheets2[1].rows[5].hidden).toBeTruthy();
                    expect(sheets2[1].rows[6].hidden).toBeTruthy();
                    expect(sheets2[1].rows[7].hidden).toBeFalsy();
                    expect(sheets2[1].rows[8].hidden).toBeTruthy();
                    done();
                });
            });
        });

        it('Clear filter', (done: Function) => {
            helper.click('#spreadsheet_sorting');
            helper.click('#spreadsheet_sorting-popup ul li:nth-child(5)');
            setTimeout(() => {
                expect(helper2.getInstance().filterModule.filterCollection.get(1)).toBeUndefined();
                expect(helper2.getInstance().filterModule.filterRange.get(1)).toBeUndefined();
                expect(helper2.getInstance().filterModule.filterRange.get(0)).toBeUndefined();
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                done();
            });
        });

        it('Clear filter - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(helper2.getInstance().filterModule.filterCollection.get(1).length).toBe(0);
                expect(JSON.stringify(helper2.getInstance().filterModule.filterRange.get(1).range)).toBe('[0,0,10,7]');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    expect(helper2.getInstance().filterModule.filterCollection.get(1)).toBeUndefined();
                    expect(helper2.getInstance().filterModule.filterRange.get(1)).toBeUndefined();
                    expect(helper2.getInstance().filterModule.filterRange.get(0)).toBeUndefined();
                    done();
                });
            });
        });

        it('Sorting ascending', (done: Function) => {
            helper.invoke('selectRange', ['A3']);
            helper.click('#spreadsheet_sorting');
            helper.click('#spreadsheet_sorting-popup ul li:nth-child(1)');
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        expect(getCell(0, 0, sheets2[1]).value).toBe('Casual Shoes');
                        expect(getCell(1, 0, sheets2[1]).value).toBe('Cricket Shoes');
                        expect(getCell(2, 0, sheets2[1]).value).toBe('Flip- Flops & Slippers');
                        expect(helper2.getInstance().activeSheetIndex).toBe(0);
                        done();
                    });
                });
            });
        });

        it('Sorting ascending - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(0, 0, sheets2[1]).value).toBe('Item Name');
                expect(getCell(1, 0, sheets2[1]).value).toBe('Casual Shoes');
                expect(getCell(2, 0, sheets2[1]).value).toBe('Sports Shoes');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(getCell(0, 0, sheets2[1]).value).toBe('Casual Shoes');
                        expect(getCell(1, 0, sheets2[1]).value).toBe('Cricket Shoes');
                        expect(getCell(2, 0, sheets2[1]).value).toBe('Flip- Flops & Slippers');
                        done();
                    });
                });
            });
        });

        it('Sorting descending', (done: Function) => {
            helper.click('#spreadsheet_sorting');
            helper.click('#spreadsheet_sorting-popup ul li:nth-child(2)');
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        expect(getCell(0, 0, sheets2[1]).value).toBe('T-Shirts');
                        expect(getCell(1, 0, sheets2[1]).value).toBe('Sports Shoes');
                        expect(getCell(2, 0, sheets2[1]).value).toBe('Sneakers');
                        expect(helper2.getInstance().activeSheetIndex).toBe(0);
                        done();
                    });
                });
            });
        });

        it('Sorting descending - Undo & Redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            setTimeout(() => {
                expect(getCell(0, 0, sheets2[1]).value).toBe('Casual Shoes');
                expect(getCell(1, 0, sheets2[1]).value).toBe('Cricket Shoes');
                expect(getCell(2, 0, sheets2[1]).value).toBe('Flip- Flops & Slippers');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                helper.click('#spreadsheet_redo');
                setTimeout(() => {
                    setTimeout(() => {
                        expect(getCell(0, 0, sheets2[1]).value).toBe('T-Shirts');
                        expect(getCell(1, 0, sheets2[1]).value).toBe('Sports Shoes');
                        expect(getCell(2, 0, sheets2[1]).value).toBe('Sneakers');
                        done();
                    });
                });
            });
        });


        it('Insert sheet', (done: Function) => {
            helper.click('.e-add-sheet-tab');
            setTimeout(() => {
                sheets2 = helper2.getInstance().sheets;
                expect(sheets2.length).toBe(3);
                expect(sheets2[2].name).toBe('Sheet3');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                done();
            });
        });

        it('Sheet rename', (done: Function) => {
            helper.triggerMouseAction('dblclick', null, helper.getElementFromSpreadsheet('.e-sheet-tab .e-toolbar-items'), helper.getElementFromSpreadsheet('.e-sheet-tab .e-active .e-text-wrap'));
            const editorElem: HTMLInputElement = <HTMLInputElement>helper.getElementFromSpreadsheet('.e-sheet-tab .e-sheet-rename');
            editorElem.click();
            editorElem.value = 'TestSheet';
            helper.triggerKeyEvent('keydown', 13, null, false, false, editorElem);
            setTimeout(() => {
                expect(sheets2[2].name).toBe('TestSheet');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(4)').textContent).toBe('TestSheet');
                done();
            });
        });

        it('Duplicate sheet', (done: Function) => {
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(null, null, [3], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(3)'));
            setTimeout(() => {
                expect(sheets2.length).toBe(4);
                expect(sheets2[2].name).toBe('Sheet2 (2)');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(4)').textContent).toBe('Sheet2 (2)');
                done();
            });
        });

        it('Hide sheet', (done: Function) => {
            helper.openAndClickCMenuItem(null, null, [5], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(4)'));
            setTimeout(() => {
                expect(sheets2[2].state).toBe('Hidden');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(4)').classList).toContain('e-hidden');
                done();
            });
        });

        it('Show sheet', (done: Function) => {
            helper.click('.e-sheets-list');
            helper.click('.e-popup.e-sheets-list ul li:nth-child(3)');
            setTimeout(() => {
                expect(sheets2[2].state).toBe('Visible');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(4)').classList).not.toContain('e-hidden');
                done();
            });
        });

        it('Move sheet left', (done: Function) => {
            helper.openAndClickCMenuItem(null, null, [8], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(3)'));
            setTimeout(() => {
                expect(sheets2[0].name).toBe('Sheet2');
                expect(sheets2[1].name).toBe('Sheet1');
                expect(helper2.getInstance().activeSheetIndex).toBe(1);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(2)').textContent).toBe('Sheet2');
                done();
            });
        });

        it('Move sheet right', (done: Function) => {
            helper.openAndClickCMenuItem(null, null, [7], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(2)'));
            setTimeout(() => {
                expect(sheets2[1].name).toBe('Sheet2');
                expect(sheets2[0].name).toBe('Sheet1');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(3)').textContent).toBe('Sheet2');
                done();
            });
        });

        it('Insert sheet over duplicated sheet', (done: Function) => {
            helper.openAndClickCMenuItem(null, null, [1], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(4)'));
            setTimeout(() => {
                sheets2 = helper2.getInstance().sheets;
                expect(sheets2.length).toBe(5);
                expect(sheets2[2].name).toBe('Sheet4');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                done();
            });
        });

        it('Delete sheet', (done: Function) => {
            helper.openAndClickCMenuItem(null, null, [2], null, null, null, true, document.querySelector('.e-sheet-tab .e-toolbar-item:nth-child(5)'));
            helper.setAnimationToNone('.e-delete-sheet-dlg');
            helper.click('.e-delete-sheet-dlg .e-primary');
            setTimeout(() => {
                expect(sheets2.length).toBe(4);
                expect(sheets2[3].name).toBe('TestSheet');
                expect(helper2.getInstance().activeSheetIndex).toBe(0);
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-active').textContent).toBe('Sheet1');
                expect(helper2.getElement('#spreadsheet2 .e-sheet-tab .e-toolbar-item:nth-child(5)').textContent).toBe('TestSheet');
                done();
            });
        });
    });
});
