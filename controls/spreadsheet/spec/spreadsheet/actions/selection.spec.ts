import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";



describe('Selection ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    function checkPosition(ele: HTMLElement, pos: string[], isRtl?: boolean) {
        expect(ele.style.top).toBe(pos[0]);
        expect(isRtl ? ele.style.right : ele.style.left).toBe(pos[1]);
        expect(ele.style.height).toBe(pos[2]);
        expect(ele.style.width).toBe(pos[3]);
    }

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'B2' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let actEle: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
            let selEle: HTMLElement = helper.getElementFromSpreadsheet('.e-selection');
            // Initial selection
            checkPosition(actEle, ['19px', '63px', '21px', '65px']);
            expect(selEle.classList).toContain('e-hide');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[0].classList).toContain('e-prev-highlight');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[1].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('tr')[0].classList).toContain('e-prev-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('tr')[1].children[0].classList).toContain('e-highlight');

            // Range selection
            helper.invoke('selectRange', ['C3:G9']);
            expect(helper.getInstance().sheets[0].activeCell).toBe('C3');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:G9');
            expect(selEle.classList).not.toContain('e-hide');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[6].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[8].classList).toContain('e-highlight');
            setTimeout(() => {
                checkPosition(actEle, ['39px', '127px', '21px', '65px']);
                checkPosition(selEle, ['39px', '127px', '141px', '321px']);

                // Reverse range selection
                helper.invoke('selectRange', ['G9:C3']);
                expect(helper.getInstance().sheets[0].activeCell).toBe('G9');
                expect(helper.getInstance().sheets[0].selectedRange).toBe('G9:C3');
                setTimeout(() => {
                    //checkPosition(actEle, ['159px', '383px', '21px', '65px']);
                    checkPosition(selEle, ['39px', '127px', '141px', '321px']);
                    done();
                }, 0);
            }, 0);
        });
    });

    describe('UI Interaction ->', () => {

    });

    describe('RTL ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ enableRtl: true }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('Public method checking', (done: Function) => {
            // Range selection
            helper.invoke('selectRange', ['C3:G9']);
            expect(helper.getInstance().sheets[0].activeCell).toBe('C3');
            expect(helper.getInstance().sheets[0].selectedRange).toBe('C3:G9');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getColHeaderElement().querySelectorAll('.e-header-cell')[6].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[2].classList).toContain('e-highlight');
            expect(helper.getRowHeaderElement().querySelectorAll('.e-header-cell')[8].classList).toContain('e-highlight');
            setTimeout(() => {
                checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['39px', '127px', '21px', '65px'], true);
                checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['39px', '127px', '141px', '321px'], true);
                done();
            }, 0);
        });
        
        // Commented since facing issue

        // it('UI interaction', (done: Function) => {
        //     let td: HTMLElement = helper.invoke('getCell', [3, 5]);
        //     let coords: ClientRect = td.getBoundingClientRect();
        //     helper.triggerMouseAction('mousedown', { x: coords.right, y: coords.top }, null, td);
        //     expect(helper.getInstance().sheets[0].selectedRange).toBe('F4:F4');
        //     setTimeout(() => {
        //         checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['59px', '319px', '21px', '65px'], true);
        //         helper.triggerMouseAction('mouseup', { x: coords.right, y: coords.top }, document, td);
        //         done();
        //     }, 0);
        // });
    });
});