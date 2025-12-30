import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { NoteModel, ExtendedSheet, ExtendedNoteModel, getCell, CellModel, setCell, focus } from '../../../src/index';

describe('Note ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('UI Interaction Checking ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[2].notes as NoteModel).text).toBe('Syncfusion1');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking Edit Note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion2';
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                expect((spreadsheet.sheets[0].rows[0].cells[2].notes as NoteModel).text).toBe('Syncfusion2');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('Syncfusion2');
                done();
            });
        });
        it('Checking Delete Note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [10]);
            setTimeout(() => {
                helper.triggerKeyEvent('keydown', 27, null, false, false)
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBeUndefined;
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes.length).toBe(0);
                done();
            });
        });
        it('Checking Delete Note - Undo/redo', (done: Function) => {
            helper.click('#spreadsheet_undo');
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.sheets[0] as ExtendedSheet;
            expect((sheet.rows[0].cells[2].notes as NoteModel).text).toBe('Syncfusion2');
            expect(sheet.notes[0].text).toBe('Syncfusion2');
            helper.click('#spreadsheet_redo');
            expect(sheet.rows[0].cells[2].notes).toBeUndefined();
            expect(sheet.notes.length).toBe(0);
            done();
        });
        it('Checking note with wrap text', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.invoke('updateCell', [{ value: 'Syncfusion Syncfusion Syncfusion Syncfusion' }, 'A4']);
            helper.click('#spreadsheet_wrap');
            let td: Element = helper.invoke('getCell', [0, 2]);
            expect(td.classList).toContain('e-wraptext');
            done();
        });   
        it('Checking note with with filter', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion';       
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
                helper.invoke('updateCell', [{ value: 'Syncfusion' }, 'A1']);
                setTimeout(() => {
                    spreadsheet = helper.getInstance();
                    expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion');
                    done();
                });
            });
        });
        it('Checking resize on row with note and filter icon', (done: Function) => {
            const cellEle: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect((cellEle.querySelector('.e-addNoteIndicator') as HTMLElement).style.right).toBe('20px');
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.bottom - 0.5, y: offset.left - 1, offsetY: 19 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top + 10, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top + 10, offsetY: 7 }, document, rowHdr);
            setTimeout(() => {
                expect((cellEle.querySelector('.e-addNoteIndicator') as HTMLElement).style.right).toBe('2px');
                done();
            });
        });
        it('Checking note with with filter when scrolling', (done: Function) => {
            helper.invoke('goTo', ['A70']);
            setTimeout(() => {
                helper.invoke('goTo', ['A1']);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion');
                done();
            });
        });
    });

    describe('Checking scrolling and data validation with note ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: { text: 'Syncfusion' } }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        // it('Checking scrolling with note', (done: Function) => {
        //     helper.invoke('selectRange', ['E5']);
        //     helper.setAnimationToNone('#spreadsheet_contextmenu');
        //     helper.openAndClickCMenuItem(0, 0, [9]);
        //     helper.invoke('goTo', ['CS244']);
        //     setTimeout(function () {
        //         helper.invoke('goTo', ['E1']);
        //         setTimeout(function () {
        //             helper.invoke('goTo', ['A1']);
        //             let td: HTMLElement = helper.invoke('getCell', [5, 4]);
        //             let coords = td.getBoundingClientRect();
        //             helper.triggerMouseAction('mousemove', { x: coords.left + 3, y: coords.top + 2 }, document, td);
        //             helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
        //             spreadsheet = helper.getInstance();
        //             expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion');
        //             done();
        //         });
        //     });
        // });
        it('Checking data Validation', function (done) {
            helper.invoke('addDataValidation', [{ type: 'List', value1: '12,13,14' }, 'D2']);
            let cell = helper.getInstance().sheets[0].rows[1].cells[3];
            expect(JSON.stringify(cell.validation)).toBe('{"type":"List","value1":"12,13,14"}');
            helper.invoke('selectRange', ['D2']);
            let td = helper.invoke('getCell', [1, 3]).children[0];
            helper.invoke('updateCell', [{ notes: 'Syncfusion' }, 'D2']);
            expect(td.classList).toContain('e-validation-list');
            done();
        });
    });
    describe('Checing mouse over and mouse out in the cell contains notes ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking ESC key to save note', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let containerElement: HTMLElement = helper.getElements('.e-addNoteContainer')[0];
                containerElement.focus();
                spreadsheet = helper.getInstance();
                helper.triggerKeyNativeEvent(27, false, false, null, 'keydown', false, containerElement);
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking mouseover and mouseout', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const noteModule: any = helper.getInstance().spreadsheetNoteModule;
            noteModule.mouseOver.call([noteModule, 0, 0]);
            noteModule.mouseOut({relatedTarget : helper.getElements('.e-addNoteContainer')[0]});
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking mouseover and mouseout - I', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            const noteModule: any = helper.getInstance().spreadsheetNoteModule;
            noteModule.mouseOver.call([noteModule, 0, 0]);
            let td: HTMLElement = helper.invoke('getCell', [4, 0]);
            noteModule.mouseOut({relatedTarget : td});
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                done();
            });
        });
    });
    describe('Checking updatenotecontainer method ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking UpdateNoteContainer', function (done) {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
            helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking UpdateNoteContainer - I', function (done) {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            helper.invoke('selectRange', ['B1']);
            helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking UpdateNoteContainer - II', function (done) {
            helper.invoke('updateCell', [{ notes: 'Syncfusion' }, 'G5']);
            let td: HTMLElement = helper.invoke('getCell', [4, 6]);
            let coords = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
            setTimeout(function () {
                helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Syncfusion1');
                done();
            });
        });
    });
    describe('Destroy method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: { text: 'Syncfusion' } }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        
        it('Checking notes by updating the enableNotes property', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect(spreadsheet.element.getElementsByClassName('e-addNoteIndicator').length).toBe(1);
            spreadsheet.enableNotes = false;
            spreadsheet.dataBind();
            expect(spreadsheet.element.getElementsByClassName('e-addNoteIndicator').length).toBe(0);
            spreadsheet.enableNotes = true;
            spreadsheet.dataBind();
            expect(spreadsheet.element.getElementsByClassName('e-addNoteIndicator').length).toBe(1);
            done();
        });
        it('EJ2-904673-Note container is not opened in the Arabic culture', (done: Function) => {
            helper.setModel('enableRtl', true);
            setTimeout((): void => {
                expect(helper.hasClass('e-rtl', document.getElementById(helper.id))).toBe(true);
                helper.invoke('addDataValidation', [{ type: 'List', value1: '1,2,3' }, 'C1']);
                expect(JSON.stringify(helper.getInstance().sheets[0].rows[0].cells[2].validation)).toBe('{"type":"List","value1":"1,2,3"}');
                helper.invoke('selectRange', ['A1:H1']);
                helper.invoke('applyFilter');
                expect(helper.invoke('getCell', [0, 2]).querySelector('.e-filter-iconbtn')).not.toBeNull();
                helper.invoke('updateCell', [{ notes: {text :'Spreadsheet'} }, 'C1']);
                let td: HTMLElement = helper.invoke('getCell', [0, 2]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                expect((helper.getInstance().sheets[0].rows[0].cells[2].notes as NoteModel).text).toBe('Spreadsheet');
                done();
            });
        });
    });

    describe('EJ2-990399, Migrate Note properties from the cell model to the sheet model during import ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking sheet notes update to cells during import action', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.sheets[0];
            const note: { text: string, address: number[] }[] = [
                { text: "Notes added", address: [0, 0] },
                { text: "Notes added", address: [0, 3] }]
            spreadsheet.setSheetPropertyOnMute(sheet, 'notes', note);
            spreadsheet.spreadsheetNoteModule.updateNotesFromSheet();
            expect((sheet.rows[0].cells[0].notes as ExtendedNoteModel).text).toBe('Notes added');
            expect((sheet.rows[0].cells[3].notes as ExtendedNoteModel).text).toBe('Notes added');
            expect(sheet.hyperLinks).toBeUndefined();
            done();
        });
    });
    describe('Notes UI Navigation and Visibility', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note D1', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 3, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'SyncfusionD1';
                let td: HTMLElement = helper.invoke('getCell', [10, 7]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[0].cells[3].notes as NoteModel).text).toBe('SyncfusionD1');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('SyncfusionD1');
                done();
            });
        });
        it('Checking Add Note D10', (done: Function) => {
            helper.invoke('selectRange', ['D10']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(9, 3, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'SyncfusionD10';
                let td: HTMLElement = helper.invoke('getCell', [10, 7]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[9].cells[3].notes as NoteModel).text).toBe('SyncfusionD10');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[1].text).toBe('SyncfusionD10');
                done();
            });
        });
        const openNotesDDB = () => {
            helper.switchRibbonTab(5);
            const ddbBtn: HTMLElement = helper.getElement('#' + helper.id + '_notes');
            ddbBtn.click();
        };
        it('Navigate to next note within a single sheet', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('goTo', ['A1']);
            openNotesDDB();
            helper.getElement('#' + helper.id + '_notes-popup li#nt_next').click();
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().activeCell).toBe('D1');
                openNotesDDB();
                helper.getElement('#' + helper.id + '_notes-popup li#nt_next').click();
                setTimeout(() => {
                    expect(spreadsheet.getActiveSheet().activeCell).toBe('D10');
                    openNotesDDB();
                    helper.getElement('#' + helper.id + '_notes-popup li#nt_next').click();
                    setTimeout(() => {
                        expect(spreadsheet.getActiveSheet().activeCell).toBe('D1');
                        openNotesDDB();
                        helper.getElement('#' + helper.id + '_notes-popup li#nt_next').click();
                        setTimeout(() => {
                            expect(spreadsheet.getActiveSheet().activeCell).toBe('D10');
                            done();
                        });
                    });
                });
            });
        });
        it('Navigate to previous note within a single sheet', (done: Function) => {
            spreadsheet = helper.getInstance();
            helper.invoke('goTo', ['D1']);
            openNotesDDB();
            helper.getElement('#' + helper.id + '_notes-popup li#nt_prev').click();
            setTimeout(() => {
                expect(spreadsheet.getActiveSheet().activeCell).toBe('D10');
                openNotesDDB();
                helper.getElement('#' + helper.id + '_notes-popup li#nt_prev').click();
                setTimeout(() => {
                    expect(spreadsheet.getActiveSheet().activeCell).toBe('D1');
                    done();
                });
            });
        });
        it('Show All Notes from UI and check model properties', (done: Function) => {
            spreadsheet = helper.getInstance();
            openNotesDDB();
            helper.getElement('#' + helper.id + '_notes-popup li#nt_showall').click();
            setTimeout(() => {
                expect(spreadsheet.spreadsheetNoteModule.isShowAllNotes).toBe(true);
                spreadsheet.getActiveSheet().notes.forEach((note: ExtendedNoteModel) => {
                    expect(note.isVisible).toBe(true);
                });
                expect(helper.getElements('.e-addNoteContainer').length).toBe(2);
                done();
            });
        });
        it('Hide All Notes from UI and check model properties', (done: Function) => {
            spreadsheet = helper.getInstance();
            openNotesDDB();
            helper.getElement('#' + helper.id + '_notes-popup li#nt_showall').click();
            setTimeout(() => {
                expect(spreadsheet.spreadsheetNoteModule.isShowAllNotes).toBe(false);
                spreadsheet.getActiveSheet().notes.forEach((note: ExtendedNoteModel) => {
                    expect(note.isVisible).toBe(false);
                });
                expect(helper.getElements('.e-addNoteContainer').length).toBe(0);
                done();
            });
        });
        it('Toggle show/hide single note from cell context menu', (done: Function) => {
            helper.invoke('goTo', ['D1']);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 3]);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.triggerMouseAction('contextmenu', { x: td.getBoundingClientRect().left + 1, y: td.getBoundingClientRect().top + 1 }, null, td);
            setTimeout(() => {
                helper.getElement('#' + helper.id + '_cmenu_showHideNote').click();
                setTimeout(() => {
                    expect(helper.getElement('.e-addNoteContainer')).not.toBeNull();
                    helper.triggerMouseAction('contextmenu', { x: td.getBoundingClientRect().left + 2, y: td.getBoundingClientRect().top + 2 }, null, td);
                    setTimeout(() => {
                        helper.getElement('#' + helper.id + '_cmenu_showHideNote').click();
                        setTimeout(() => {
                            expect(helper.getElement('.e-addNoteContainer')).toBeNull();
                            done();
                        });
                    });
                });
            });
        });
        it('Selecting note container and goes to edit mode', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.updateCell({ notes: { text: 'Test1', isVisible: true } }, 'A12');
            spreadsheet.updateCell({ notes: { text: 'Test2', isVisible: true } }, 'F12');
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            const note1: ExtendedNoteModel = sheet.notes[sheet.notes.length - 2];
            expect(note1.rowIdx).toBe(11);
            expect(note1.colIdx).toBe(0);
            expect(note1.isVisible).toBeTruthy();
            expect(note1.text).toBe('Test1');
            let noteContainer: HTMLElement = document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1));
            expect(noteContainer).not.toBeNull();
            const cell1: CellModel = getCell(11, 0, sheet);
            expect(cell1.isNoteEditable).toBeUndefined();
            let offset: DOMRect = noteContainer.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left + 10, y: offset.top + 10, offsetY: 7 }, null, noteContainer);
            helper.triggerMouseAction('mouseup', { x: offset.left + 10, y: offset.top + 10, offsetY: 7 }, document, noteContainer);
            expect(cell1.isNoteEditable).toBeTruthy();
            expect(note1.isVisible).toBeTruthy();
            const note2: ExtendedNoteModel = sheet.notes[sheet.notes.length - 1];
            expect(note2.rowIdx).toBe(11);
            expect(note2.colIdx).toBe(5);
            expect(note2.isVisible).toBeTruthy();
            expect(note2.text).toBe('Test2');
            spreadsheet.spreadsheetNoteModule.getNoteFocus(noteContainer);
            noteContainer = document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2));
            expect(noteContainer).not.toBeNull();
            let cell2: CellModel = getCell(11, 5, sheet);
            expect(cell2.isNoteEditable).toBeUndefined();
            offset = noteContainer.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left + 10, y: offset.top + 10, offsetY: 7 }, null, noteContainer);
            helper.triggerMouseAction('mouseup', { x: offset.left + 10, y: offset.top + 10, offsetY: 7 }, document, noteContainer);
            expect(cell2.isNoteEditable).toBeTruthy();
            expect(note2.isVisible).toBeTruthy();
            // expect(getCell(11, 0, sheet).isNoteEditable).toBeFalsy();
            expect(note1.isVisible).toBeTruthy();
            noteContainer.innerHTML = 'Changed';
            spreadsheet.spreadsheetNoteModule.getNoteFocus(noteContainer);
            const cellEle: HTMLElement = spreadsheet.getCell(0, 0);
            offset = cellEle.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousedown', { x: offset.left + 5, y: offset.top + 5, offsetY: 3 }, null, cellEle);
            helper.triggerMouseAction('mouseup', { x: offset.left + 5, y: offset.top + 5, offsetY: 3 }, document, cellEle);
            cell2 = getCell(11, 5, sheet);
            // expect((cell2.notes as NoteModel).text).toBe('Changed');
            // expect(cell2.isNoteEditable).toBeFalsy();
            done();
        });
        it('Clear with Note with undo/redo', (done: Function) => {
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            helper.invoke('selectRange', ['A12']);
            let note: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            const noteId: string = spreadsheet.spreadsheetNoteModule.getNoteId(note);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_clear').click();
            helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
            expect(getCell(11, 0, sheet, false, true).notes).toBeUndefined();
            expect(document.getElementById(noteId)).toBeNull();
            helper.click('#spreadsheet_undo');
            note = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            expect(note.text).toBe('Test1');
            expect(document.getElementById(noteId)).not.toBeNull();
            helper.click('#spreadsheet_redo');
            expect(getCell(11, 0, sheet, false, true).notes).toBeUndefined();
            expect(document.getElementById(noteId)).toBeNull();
            helper.click('#spreadsheet_undo');
            expect(document.getElementById(noteId)).not.toBeNull();
            done();
        });
        it('Cut and paste with Note', (done: Function) => {
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            let note1: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            helper.getElement('#' + helper.id + '_cut').click();
            setTimeout((): void => {
                helper.invoke('selectRange', ['B12']);
                helper.getElement('#' + helper.id + '_paste').click();
                setTimeout(() => {
                    expect(getCell(11, 0, sheet, false, true).notes).toBeUndefined();
                    expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).toBeNull();
                    const note2: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes;
                    expect(note2.text).toBe('Test1');
                    expect(note1.id === note2.id).toBeFalsy();
                    expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).not.toBeNull();
                    done();
                });
            });
        });
        it('Cut/paste with Note - Undo/redo', (done: Function) => {
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            let note1: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            let note2: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes;
            helper.click('#spreadsheet_undo');
            note1 = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            expect(note1.text).toBe('Test1');
            expect(getCell(11, 1, sheet, false, true).notes).toBeUndefined();
            expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).not.toBeNull();
            expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).toBeNull();
            helper.click('#spreadsheet_redo');
            setTimeout((): void => {
                expect(getCell(11, 0, sheet, false, true).notes).toBeUndefined();
                note2 = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes; 
                expect(note2.text).toBe('Test1');
                expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).toBeNull();
                expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).not.toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Copy/paste with Note', (done: Function) => {
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            helper.invoke('selectRange', ['A12']);
            helper.getElement('#' + helper.id + '_copy').click();
            setTimeout((): void => {
                helper.invoke('selectRange', ['B12']);
                helper.getElement('#' + helper.id + '_paste').click();
                setTimeout((): void => {
                    let note1: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
                    expect(note1.text).toBe('Test1');
                    expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).not.toBeNull();
                    let note2: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes;
                    expect(note2.text).toBe('Test1');
                    expect(note1.id === note2.id).toBeFalsy();
                    expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).not.toBeNull();
                    done();
                });
            });
        });
        it('Copy/paste with Note - Undo/redo', (done: Function) => {
            spreadsheet = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
            let note2: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes;
            helper.click('#spreadsheet_undo');
            let note1: ExtendedNoteModel = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
            expect(note1.text).toBe('Test1');
            expect(getCell(11, 1, sheet, false, true).notes).toBeUndefined();
            expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).not.toBeNull();
            expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).toBeNull();
            helper.click('#spreadsheet_redo');
            setTimeout((): void => {
                note1 = <ExtendedNoteModel>getCell(11, 0, sheet, false, true).notes;
                expect(note1.text).toBe('Test1');
                note2 = <ExtendedNoteModel>getCell(11, 1, sheet, false, true).notes;
                expect(note2.text).toBe('Test1');
                expect(note1.id === note2.id).toBeFalsy();
                expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1))).not.toBeNull();
                expect(document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2))).not.toBeNull();
                helper.click('#spreadsheet_undo');
                done();
            });
        });
        it('Checking visible note container after sheet refresh', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.renderModule.refreshSheet();
            setTimeout((): void => {
                const sheet: ExtendedSheet = spreadsheet.getActiveSheet();
                const note1: ExtendedNoteModel = sheet.notes[sheet.notes.length - 2];
                let noteContainer: HTMLElement = document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note1));
                expect(noteContainer).not.toBeNull();
                const note2: ExtendedNoteModel = sheet.notes[sheet.notes.length - 1];
                noteContainer = document.getElementById(spreadsheet.spreadsheetNoteModule.getNoteId(note2));
                expect(noteContainer).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Notes data refreshing after row/column action (UI)', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note D5', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(4, 3, [10]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Note at D5';
                let td: HTMLElement = helper.invoke('getCell', [10, 7]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect((spreadsheet.sheets[0].rows[4].cells[3].notes as NoteModel).text).toBe('Note at D5');
                const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
                expect(notes[0].text).toBe('Note at D5');
                done();
            });
        });
        it('Insert row BEFORE note shifts note down', (done: Function) => {
            helper.invoke('insertRow', [2]);
            spreadsheet = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[5].cells[3].notes as NoteModel).text).toBe('Note at D5');
            const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
            expect(notes[0].rowIdx).toBe(5);
            expect(notes[0].colIdx).toBe(3);
            done();
        });
        it('Insert column BEFORE note shifts note right', (done: Function) => {
            helper.invoke('insertColumn', [1]);
            spreadsheet = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[5].cells[4].notes as NoteModel).text).toBe('Note at D5');
            const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
            expect(notes[0].rowIdx).toBe(5);
            expect(notes[0].colIdx).toBe(4);
            done();
        });
        it('Delete row BEFORE note shifts note up', (done: Function) => {
            helper.invoke('delete', [0, 0, 'Row']);
            spreadsheet = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[4].cells[4].notes as NoteModel).text).toBe('Note at D5');
            const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
            expect(notes[0].rowIdx).toBe(4);
            expect(notes[0].colIdx).toBe(4);
            done();
        });
        it('Delete column BEFORE note shifts note left', (done: Function) => {
            helper.invoke('delete', [0, 0, 'Column']);
            spreadsheet = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[4].cells[3].notes as NoteModel).text).toBe('Note at D5');
            const notes: ExtendedNoteModel[] = (spreadsheet.sheets[0] as ExtendedSheet).notes;
            expect(notes[0].rowIdx).toBe(4);
            expect(notes[0].colIdx).toBe(3);
            done();
        });
    });

    describe('UI Interaction - Insert and Delete with notes->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Add notes using the update cell to check the insert and delete with the notes', (done: Function) => {
            helper.getInstance().updateCell({ notes: 'Spreadsheet' }, 'Sheet1!C3');
            helper.getInstance().updateCell({ notes: 'Medical?' }, 'Sheet1!G2');
            helper.getInstance().updateCell({ notes: 'IsCheeked' }, 'Sheet1!B10');
            helper.getInstance().updateCell({ notes: 'Allright' }, 'Sheet1!J1');
            expect(helper.invoke('getCell', [2, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
            expect(helper.invoke('getCell', [1, 6]).querySelector('.e-addNoteIndicator')).not.toBeNull();
            expect(helper.invoke('getCell', [9, 1]).querySelector('.e-addNoteIndicator')).not.toBeNull();
            expect(helper.invoke('getCell', [0, 9]).querySelector('.e-addNoteIndicator')).not.toBeNull();
            done();
        });
        it('Insert Row ABOVE on notes inserted cell moves indicator down + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['C3']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(2, 0, [6, 1], true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 2]).querySelector('.e-addNoteIndicator')).toBeNull();
                expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [2, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                        done();
                    });
                });
            });
        });
        it('Insert Row BELOW on notes inserted cell (C4) leaves indicator unchanged + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['C4']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(3, 0, [6, 2], true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                        done();
                    });
                });
            });
        });
        it('Delete ROW containing notes (B12) removes indicator + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['B12']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(11, 0, [7], true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [11, 1]).querySelector('.e-addNoteIndicator')).toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [11, 1]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [11, 1]).querySelector('.e-addNoteIndicator')).toBeNull();
                        done();
                    });
                });
            });
        });
        it('Insert Column BEFORE on notes inserted cell (G2) shifts indicator right + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['G2']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 6, [6, 1], false, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 6]).querySelector('.e-addNoteIndicator')).toBeNull();
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 6]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                        done();
                    });
                });
            });
        });
        it('Insert Column AFTER on notes inserted cell (H2) leaves indicator unchanged + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 7, [6, 2], false, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                        done();
                    });
                });
            });
        });
        it('Delete COLUMN containing notes (L1) removes indicator + Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['L1']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 11, [7], false, true);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 11]).querySelector('.e-addNoteIndicator')).toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(helper.invoke('getCell', [0, 11]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(helper.invoke('getCell', [0, 11]).querySelector('.e-addNoteIndicator')).toBeNull();
                        done();
                    });
                });
            });
        });
        it('Delete ROW without notess should not affect other notes indicators + Undo/Redo', (done: Function) => {
            const sheet: ExtendedSheet = helper.getInstance().sheets[0] as ExtendedSheet;
            helper.invoke('selectRange', ['B5']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(4, 0, [7], true);
            setTimeout(() => {
                expect(sheet.notes.length).toBe(2);
                expect(helper.invoke('getCell', [3, 2]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                expect(helper.invoke('getCell', [1, 7]).querySelector('.e-addNoteIndicator')).not.toBeNull();
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(sheet.notes.length).toBe(2);
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(sheet.notes.length).toBe(2);
                        done();
                    });
                });
            });
        });
        it('Delete COLUMN without notess should not affect other notes indicators + Undo/Redo', (done: Function) => {
            const sheet: ExtendedSheet = helper.getInstance().sheets[0] as ExtendedSheet;
            helper.invoke('selectRange', ['E3']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [7], false, true);
            setTimeout(() => {
                expect(sheet.notes.length).toBe(2);
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(sheet.notes.length).toBe(2);
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(sheet.notes.length).toBe(2);
                        done();
                    });
                });
            });
        });
        it('Delete ROW and testing Undo/Redo', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.setAnimationToNone('#' + helper.id + '_contextmenu');
            helper.openAndClickCMenuItem(1, 0, [7], true);
            const sheet: ExtendedSheet = helper.getInstance().sheets[0] as ExtendedSheet;
            setTimeout(() => {
                expect(sheet.notes.length).toBe(1);
                helper.click('#spreadsheet_undo');
                setTimeout(() => {
                    expect(sheet.notes.length).toBe(2);
                    helper.click('#spreadsheet_redo');
                    setTimeout(() => {
                        expect(sheet.notes.length).toBe(1);
                        done();
                    });
                });
            });
        });
    });

    describe('Notes Data bind testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{ 
                        index: 0, cells: [{
                            index: 0, notes: {
                                id: 'e-note-12', text: 'Hello', rowIdx: 0, colIdx: 0, isVisible: true
                            } as ExtendedNoteModel
                        }]
                    }],
                    notes: [{
                        id: 'e-note-12',
                        text: 'Hello',
                        rowIdx: 0,
                        colIdx: 0,
                        isVisible: true,
                    } as ExtendedNoteModel]
                } as ExtendedSheet]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing note inserting via data binding', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Hello');
            expect((spreadsheet.sheets[0] as ExtendedSheet).notes[0].text).toBe('Hello');
            done();
        });
        it('String type note model binding', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const sheet: ExtendedSheet = spreadsheet.sheets[0];
            setCell(1, 0, sheet, { notes: 'This is string type note' });
            spreadsheet.updateCell({ value: 'Value Changed' }, 'A2');
            const cellNote: ExtendedNoteModel = <ExtendedNoteModel>sheet.rows[1].cells[0].notes;
            expect(cellNote.text).toBe('This is string type note');
            expect(cellNote.rowIdx).toBe(1);
            expect(cellNote.colIdx).toBe(0);
            expect(cellNote.isVisible).toBeFalsy();
            const sheetNote: ExtendedNoteModel = sheet.notes[sheet.notes.length - 1];
            expect(sheetNote.text).toBe(cellNote.text);
            expect(sheetNote.rowIdx).toBe(cellNote.rowIdx);
            expect(sheetNote.colIdx).toBe(cellNote.colIdx);
            expect(sheetNote.id).toBe(cellNote.id);
            done();
        });
    });
    describe('Notes Cell Data binding and UpdateCell testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [
                        { index: 0, cells: [{ index: 0, notes: 'Hello' }]},
                        { index: 4, cells: [{ index: 3, notes: { text: 'Hi', isVisible: true } }]},
                    ]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing note inserting via data binding', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            expect((spreadsheet.sheets[0].rows[0].cells[0].notes as NoteModel).text).toBe('Hello');
            expect((spreadsheet.sheets[0] as ExtendedSheet).notes[0].text).toBe('Hello');
            expect((spreadsheet.sheets[0].rows[4].cells[3].notes as NoteModel).text).toBe('Hi');
            expect((spreadsheet.sheets[0].rows[4].cells[3].notes as NoteModel).isVisible).toBe(true);
            expect(helper.getElements('.e-addNoteContainer')[0].value).toBe('Hi');
            expect((spreadsheet.sheets[0] as ExtendedSheet).notes[1].text).toBe('Hi');
            done();
        });
        it('UpdateCell note inserting', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            helper.invoke('updateCell', [{ notes: 'Spreadsheet' }, 'H1']);
            expect((spreadsheet.sheets[0].rows[0].cells[7].notes as NoteModel).text).toBe('Spreadsheet');
            expect((spreadsheet.sheets[0] as ExtendedSheet).notes[1].text).toBe('Spreadsheet');
            helper.invoke('updateCell', [{ notes: { text: 'Note4', isVisible: true } }, 'H11']);
            expect((spreadsheet.sheets[0].rows[10].cells[7].notes as NoteModel).text).toBe('Note4');
            expect((spreadsheet.sheets[0] as ExtendedSheet).notes[3].text).toBe('Note4');
            expect(helper.getElements('.e-addNoteContainer')[1].value).toBe('Note4');
            done();
        });
    });
});