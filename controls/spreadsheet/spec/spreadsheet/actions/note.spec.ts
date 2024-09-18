import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
describe('Note ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('UI Interaction Checking ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: 'Syncfusion' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking Add Note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [9]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
            });
        });
        it('Checking Edit Note', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking Delete Note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [10]);
            setTimeout(() => {
                helper.triggerKeyEvent('keydown', 27, null, false, false)
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBeUndefined;
                done();
            });
        });
        it('Checking note with wrap text', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.invoke('updateCell', [{ notes: 'Syncfusion', value: 'Syncfusion Syncfusion Syncfusion Syncfusion' }, 'A4']);
            helper.click('#spreadsheet_wrap');
            let td: Element = helper.invoke('getCell', [3, 0]);
            expect(td.classList).toContain('e-wraptext');
            done();
        });   
        it('Checking note with with filter', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [10]);
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A1:H1']);
            helper.invoke('updateCell', [{ value: 'Syncfusion' }, 'A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion';       
            setTimeout(() => {
                let td: HTMLElement = helper.invoke('getCell', [4, 6]);
                let coords = td.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
                helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
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
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
            });
        });
    });

    describe('Checking scrolling and data validation with note ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: 'Syncfusion' }] }] }] }, done);
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
        //             expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
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
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: 'Syncfusion' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking mouseover and mouseout', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const noteModule: any = helper.getInstance().spreadsheetNoteModule;
            noteModule.mouseOver.call([noteModule, 0, 0]);
            noteModule.mouseOut({relatedTarget : helper.getElements('.e-addNoteContainer')[0]});
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
            });
        });
        it('Checking mouseover and mouseout - I', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            const noteModule: any = helper.getInstance().spreadsheetNoteModule;
            noteModule.isNoteVisibleOnTouch = true;
            noteModule.mouseOver.call([noteModule, 0, 0]);
            let td: HTMLElement = helper.invoke('getCell', [4, 0]);
            noteModule.mouseOut({relatedTarget : td});
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
            });
        });
        it('Checking ESC key to save note', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 4, [9]);
            setTimeout(() => {
                helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
                let containerElement: HTMLElement = helper.getElements('.e-addNoteContainer')[0];
                containerElement.focus();
                spreadsheet = helper.getInstance();
                helper.triggerKeyNativeEvent(27, false, false, null, 'keydown', false, containerElement);
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion');
                done();
            });
        });
    });
    describe('Checking updatenotecontainer method ->', () => {
        let spreadsheet: any;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: 'Syncfusion' }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking UpdateNoteContainer', function (done) {
            helper.invoke('selectRange', ['A1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 0, [9]);
            helper.getElements('.e-addNoteContainer')[0].value = 'Syncfusion1';
            helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
            setTimeout(function () {
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
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
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking UpdateNoteContainer - II', function (done) {
            helper.invoke('updateCell', [{ notes: 'Syncfusion' }, 'G5']);
            let td: HTMLElement = helper.invoke('getCell', [4, 6]);
            let coords = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
            helper.getInstance().spreadsheetNoteModule.isShowNote = true;
            setTimeout(function () {
                helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
                done();
            });
        });
        it('Checking UpdateNoteContainer - III', function (done) {
            helper.invoke('updateCell', [{ notes: 'Syncfusion' }, 'G2']);
            let td: HTMLElement = helper.invoke('getCell', [1, 6]);
            let coords = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
            helper.getInstance().spreadsheetNoteModule.isShowNote = false;
            setTimeout(function () {
                helper.getInstance().spreadsheetNoteModule.updateNoteContainer();
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].notes).toBe('Syncfusion1');
                done();
            });
        });
    });
    describe('Destroy method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                rows: [{ index: 0, cells: [{ index: 0, notes: 'Syncfusion' }] }] }] }, done);
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
    });
});