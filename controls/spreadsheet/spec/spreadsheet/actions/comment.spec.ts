import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { ExtendedSheet, Range } from '../../../src/index';
import { ExtendedThreadedCommentModel } from '../../../src';
import { duplicateSheet, getSheetNameCount, moveSheet, Sheet } from '../../../src/workbook/index';

describe('Comments ->', () => {

    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    const getCommentContainer: Function = (): HTMLElement => helper.getElement('.e-comment-container');
    const getTextArea: Function = (container: HTMLElement): HTMLTextAreaElement => container.querySelector('.e-comment-footer .e-comment-input');
    const openThreadMenuAndPick: Function = (container: HTMLElement, itemIndex: number) => {
        const menuBtn: HTMLButtonElement = container.querySelector('.e-comment-menu');
        menuBtn.click();
        const popups: HTMLElement[] = Array.from(document.querySelectorAll('.e-dropdown-popup'));
        const lastPopup: HTMLElement = popups[popups.length - 1];
        (lastPopup.querySelectorAll<HTMLElement>('.e-item')[itemIndex as number]).click();
    };
    const openReplyDdbAndPick: Function = (container: HTMLElement, itemIndex: number) => {
        const reply: HTMLButtonElement = container.querySelector('.e-comment-item.reply');
        reply.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        reply.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        const ddbBtn: HTMLButtonElement = container.querySelector('.e-reply-ddb');
        ddbBtn.click();
        const popups: HTMLElement[] = Array.from(document.querySelectorAll('.e-dropdown-popup'));
        const lastPopup: HTMLElement = popups[popups.length - 1];
        (lastPopup.querySelectorAll<HTMLElement>('.e-item')[itemIndex as number]).click();
    };

    const closeContainer: Function = () => {
        const td: HTMLElement = helper.invoke('getCell', [15, 11]);
        const coords: ClientRect = td.getBoundingClientRect();
        helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
        helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
    };

    const openCommentDdbAndClick: Function = (nthChild: number): void => {
        helper.getElementFromSpreadsheet('#' + helper.id + '_comment').click();
        helper.click('.e-comment-ddb li:nth-child(' + nthChild + ')');
    };

    describe('UI Interaction -I ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing new comment with context menu', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9]);
            const container: HTMLElement = getCommentContainer();
            const textArea: HTMLTextAreaElement = getTextArea(container);
            textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            textArea.value = 'Hello World';
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
            expect(helper.invoke('getCell', [0, 2]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('Hello World');
            closeContainer();
            done();
        });
        it('Comment edit with undo/redo ->', (done: Function) => {
            // Select cell with existing comment
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            const originalText: string = helper.getInstance().sheets[0].rows[0].cells[2].comment.text;
            // Edit the comment
            openThreadMenuAndPick(container, 0);
            const editArea: HTMLTextAreaElement = container.querySelector('.e-comment-edit-input');
            editArea.value = 'Modified Comment Text';
            editArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-edit-wrap .e-comment-post').click();
            // Verify edit was successful
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('Modified Comment Text');
            closeContainer();
            // Test undo - should restore original text
            helper.getElement('#' + helper.id + '_undo').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe(originalText);
            // Test redo - should apply the edit again
            helper.getElement('#' + helper.id + '_redo').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('Modified Comment Text');
            done();
        });
        it('Testing reply comment with context menu', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            const textArea: HTMLTextAreaElement = getTextArea(container);
            textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            textArea.value = 'Reply Added';
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
            expect(helper.invoke('getCell', [0, 2]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.replies[0].text).toBe('Reply Added');
            closeContainer();
            done();
        });
        it('Testing edit a reply using the reply DDB', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            openReplyDdbAndPick(container, 0);
            const editArea: HTMLTextAreaElement = container.querySelector('.e-comment-edit-input');
            editArea.value = 'Edited reply text';
            editArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-edit-wrap .e-comment-post').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.replies[0].text).toBe('Edited reply text');
            closeContainer();
            done();
        });
        it('Testing delete a reply using the reply DDB', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.replies[0].text).toBe('Edited reply text');
            const container: HTMLElement = getCommentContainer();
            openReplyDdbAndPick(container, 1);
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.replies[1]).toBeUndefined();
            closeContainer();
            done();
        });
        it('Testing edit the initial thread comment using the thread header menu', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            openThreadMenuAndPick(container, 0);
            const editArea: HTMLTextAreaElement = container.querySelector('.e-comment-edit-input');
            editArea.value = 'Edited thread title';
            editArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-edit-wrap .e-comment-post').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('Edited thread title');
            closeContainer();
            done();
        });
        it('Testing resolve and reopen thread', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            openThreadMenuAndPick(container, 1);
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.isResolved).toBeTruthy();
            expect(container.classList.contains('e-thread-resolved')).toBeTruthy();
            container.querySelector<HTMLButtonElement>('.e-comment-reopen-btn').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.isResolved).toBeFalsy();
            expect(container.classList.contains('e-thread-resolved')).toBeFalsy();
            closeContainer();
            done();
        });
        it('Delete the thread using thread header menu', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            openThreadMenuAndPick(getCommentContainer(), 2);
            expect(helper.invoke('getCell', [0, 2]).querySelector('.e-comment-indicator')).toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment).toBeUndefined();
            done();
        });
        it('Initial cancel (header close) discards empty draft', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 3, [9]);
            const container: HTMLElement = getCommentContainer();
            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-comment-indicator')).not.toBeNull();
            container.querySelector<HTMLButtonElement>('.e-comment-header .e-comment-cancel').click();
            expect(helper.invoke('getCell', [0, 3]).querySelector('.e-comment-indicator')).toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[3].comment).toBeUndefined();
            done();
        });
        it('Footer cancel (reply mode) hides buttons on empty input', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9]);
            const container: HTMLElement = getCommentContainer();
            let textArea: HTMLTextAreaElement = getTextArea(container);
            textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            textArea.value = 'New Comment';
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
            textArea = getTextArea(container);
            textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            textArea.value = 'New Comment';
            container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-cancel').click();
            closeContainer();
            done();
        });
        it('Edit cancel (inline edit) restores original text', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 2]);
            const container: HTMLElement = getCommentContainer();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('New Comment');
            openThreadMenuAndPick(container, 0);
            const editArea: HTMLTextAreaElement = container.querySelector('.e-comment-edit-input');
            editArea.value = 'Do not save this';
            editArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-edit-wrap .e-comment-cancel').click();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment.text).toBe('New Comment');
            closeContainer();
            done();
        });
        it('Testing delete comment with context menu', (done: Function) => {
            helper.invoke('selectRange', ['C1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9, 1]);
            expect(helper.invoke('getCell', [0, 2]).querySelector('.e-comment-indicator')).toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[2].comment).toBeUndefined();
            done();
        });
        it('Testing comment open with the selection', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            helper.setAnimationToNone('#spreadsheet_contextmenu');
            helper.openAndClickCMenuItem(0, 2, [9]);
            const container: HTMLElement = getCommentContainer();
            const textArea: HTMLTextAreaElement = getTextArea(container);
            textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            textArea.value = 'Hello World';
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
            const indicator: HTMLElement = helper.invoke('getCell', [0, 4]).querySelector('.e-comment-indicator');
            expect(indicator).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[4].comment.text).toBe('Hello World');
            closeContainer();
            const td: HTMLElement = helper.invoke('getCell', [0, 4]);
            const coords: ClientRect = td.getBoundingClientRect();
            helper.triggerMouseAction('mousedown', { x: coords.left + 3, y: coords.top + 2 }, null, td);
            helper.triggerMouseAction('mouseup', { x: coords.left + 3, y: coords.top + 2 }, document, td);
            closeContainer();
            done();
        });
        it('Testing comment open with mouse over in the comment cell', (done: Function) => {
            const indicator: HTMLElement = helper.invoke('getCell', [0, 4]).querySelector('.e-comment-indicator');
            expect(indicator).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[4].comment.text).toBe('Hello World');
            indicator.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            expect(getCommentContainer()).not.toBeNull();
            closeContainer();
            done();
        });
        it('Testing new comment with the ribbon menu', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            helper.switchRibbonTab(5);
            openCommentDdbAndClick(1);
            setTimeout(() => {
                const container: HTMLElement = getCommentContainer();
                const textArea: HTMLTextAreaElement = getTextArea(container);
                textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
                textArea.value = 'Hello World';
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
                container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
                expect(helper.invoke('getCell', [0, 1]).querySelector('.e-comment-indicator')).not.toBeNull();
                expect(helper.getInstance().sheets[0].rows[0].cells[1].comment.text).toBe('Hello World');
                done();
            });
        });
    });

    describe('UI Interaction -II ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{
                        index: 0, cells: [{
                            index: 0, comment: {
                                author: 'JC', text: 'Hello', createdTime: 'November 18, 2025 at 4:31 PM',
                                isResolved: false, replies: [{ author: 'JC', text: 'World', createdTime: 'November 18, 2025 at 4:35 PM' }]
                            }
                        }]
                    }]
                }],
                author: 'JC',
                showCommentsPane: true
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing comment inserting via data binding', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[0].comment.text).toBe('Hello');
            expect(helper.getInstance().sheets[0].comments[0].text).toBe('Hello');
            helper.switchRibbonTab(5);
            openCommentDdbAndClick(2);
            done();
        });
        it('Testing new comment with the ribbon menu', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            openCommentDdbAndClick(1);
            setTimeout(() => {
                const container: HTMLElement = getCommentContainer();
                const textArea: HTMLTextAreaElement = getTextArea(container);
                textArea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
                textArea.value = 'Hello World';
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
                container.querySelector<HTMLButtonElement>('.e-comment-footer .e-comment-post').click();
                expect(helper.invoke('getCell', [0, 1]).querySelector('.e-comment-indicator')).not.toBeNull();
                expect(helper.getInstance().sheets[0].rows[0].cells[1].comment.text).toBe('Hello World');
                closeContainer();
                done();
            });
        });
        it('Testing show comment pane with the ribbon menu', (done: Function) => {
            expect(helper.getElement('.e-review-panel')).toBeNull();
            openCommentDdbAndClick(2);
            setTimeout(() => {
                expect(helper.getElement('.e-review-panel')).not.toBeNull();
                done();
            });
        });
        it('Testing previous comment with the ribbon menu', (done: Function) => {
            openCommentDdbAndClick(3);
            setTimeout(() => {
                expect(helper.getElement('.e-review-panel')).not.toBeNull();
                done();
            });
        });
        it('Testing next comment with the ribbon menu', (done: Function) => {
            openCommentDdbAndClick(4);
            setTimeout(() => {
                expect(helper.getElement('.e-review-panel')).not.toBeNull();
                done();
            });
        });
        it('Testing delete comment with the ribbon menu', (done: Function) => {
            helper.invoke('selectRange', ['B1']);
            openCommentDdbAndClick(5);
            setTimeout(() => {
                expect(helper.invoke('getCell', [0, 1]).querySelector('.e-comment-indicator')).toBeNull();
                expect(helper.getInstance().sheets[0].rows[0].cells[1].comment).toBeUndefined();
                openCommentDdbAndClick(2);
                setTimeout(() => {
                    expect(helper.getElement('.e-review-panel')).toBeNull();
                    done();
                });
            });
        });
    });

    describe('UI Interaction -> Prev/Next comment across sheets', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [
                    {
                        rows: [
                            { index: 0, cells: [{ index: 0, comment: { author: 'User', text: 'Hello', createdTime: 'Jan 1, 2025, 10:00 AM', isResolved: false, replies: [] } }] },
                            { index: 4, cells: [{ index: 3, comment: { author: 'User', text: 'Hello', createdTime: 'Jan 1, 2025, 10:05 AM', isResolved: false, replies: [] } }] }
                        ]
                    },
                    {
                        rows: [
                            { index: 1, cells: [{ index: 1, comment: { author: 'User', text: 'Hello Shhet2', createdTime: 'Jan 1, 2025, 10:00 AM', isResolved: false, replies: [] } }] },
                            { index: 9, cells: [{ index: 4, comment: { author: 'User', text: 'Hello Sheet2', createdTime: 'Jan 1, 2025, 10:05 AM', isResolved: false, replies: [] } }] }
                        ]
                    },
                    {
                        rows: [
                            { index: 0, cells: [{ index: 2, comment: { author: 'User', text: 'Hello Shhet3', createdTime: 'Jan 1, 2025, 10:00 AM', isResolved: false, replies: [] } }] },
                            { index: 5, cells: [{ index: 5, comment: { author: 'User', text: 'Hello Sheet3', createdTime: 'Jan 1, 2025, 10:05 AM', isResolved: false, replies: [] } }] }
                        ]
                    }
                ],
                activeSheetIndex: 0,
                author: 'User Cheif'
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Next: From first comment in sheet 1 to next comment in same sheet', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            helper.switchRibbonTab(5);
            openCommentDdbAndClick(4);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(0);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('D5');
                done();
            });
        });
        it('Next: From last comment in sheet 1 to first comment in sheet 2', (done: Function) => {
            openCommentDdbAndClick(4);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('B2');
                done();
            });
        });
        it('Next: From last comment of sheet 2 to first comment of sheet 3', (done: Function) => {
            openCommentDdbAndClick(4);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('E10');
                openCommentDdbAndClick(4);
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(2);
                    expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C1');
                    done();
                });
            });
        });
        it('Next: From last comment of sheet 3 wraps to first comment of sheet 1', (done: Function) => {
            openCommentDdbAndClick(4);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(2);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('F6');
                openCommentDdbAndClick(4);
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(0);
                    expect(helper.getInstance().getActiveSheet().activeCell).toEqual('A1');
                    done();
                });
            });
        });
        it('Previous: From second comment in sheet 1 to first comment in sheet 1', (done: Function) => {
            helper.invoke('selectRange', ['D5']);
            openCommentDdbAndClick(3);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(0);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('A1');
                done();
            });
        });
        it('Previous: From first comment in sheet 1 to last comment in sheet 3', (done: Function) => {
            openCommentDdbAndClick(3);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(2);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('F6');
                done();
            });
        });
        it('Previous: From first comment in sheet 3 to last comment in sheet 2', (done: Function) => {
            openCommentDdbAndClick(3);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(2);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('C1');
                openCommentDdbAndClick(3);
                setTimeout(() => {
                    expect(helper.getInstance().activeSheetIndex).toBe(1);
                    expect(helper.getInstance().getActiveSheet().activeCell).toEqual('E10');
                    done();
                });
            });
        });
        it('Previous: From second comment in sheet 2 to first comment in sheet 2', (done: Function) => {
            openCommentDdbAndClick(3);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toBe(1);
                expect(helper.getInstance().getActiveSheet().activeCell).toEqual('B2');
                done();
            });
        });
    });

    describe('Testing updateCell method with comment props', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    rows: [
                        { index: 0, cells: [{ index: 0, comment: { id: 'spreadsheet-10', author: 'User', text: 'Hello', createdTime: 'Jan 1, 2025, 10:00 AM', isResolved: false, replies: [] } as ExtendedThreadedCommentModel }] }
                    ]
                }],
                showCommentsPane: true
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing UpdateCell with the id and address in the comment model', (done: Function) => {
            helper.getInstance().updateCell({
                comment: {
                    author: 'JC', id: 'uuid-1', isResolved: false, address: [0, 0], createdTime: 'November 18, 2025 at 10:35 AM',
                    replies: [{ id: 'uuid-1-1', author: 'JC', text: 'Please verify the Q3 numbers.', createdTime: 'November 18, 2025 at 10:35 AM' }]
                }
            }, 'Sheet1!A1');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[0].comment).toBeDefined();
            done();
        });
        it('Testing UpdateCell without the id and address in the comment model', (done: Function) => {
            helper.getInstance().updateCell({
                comment: {
                    author: 'JC', isResolved: true, createdTime: 'November 18, 2025 at 10:35 AM',
                    replies: [{ author: 'JC', text: 'Please verify the Q3 numbers.', createdTime: 'November 18, 2025 at 10:35 AM' }]
                }
            }, 'Sheet1!A1');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[0].comment).toBeDefined();
            done();
        });
        it('Testing UpdateCell without the reply in the comment model', (done: Function) => {
            helper.getInstance().updateCell({
                comment: { author: 'JC', isResolved: true, createdTime: 'November 18, 2025 at 10:35 AM', replies: [] }
            }, 'Sheet1!A1');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect(helper.getInstance().sheets[0].rows[0].cells[0].comment).toBeDefined();
            done();
        });
        it('Testing Clear All with comments in the cell', (done: Function) => {
            const sheet: ExtendedSheet = helper.getInstance().sheets[0] as ExtendedSheet;
            expect(sheet.comments.length).toBe(1);
            helper.switchRibbonTab(1);
            helper.getElement('#' + helper.id + '_clear').click();
            helper.click('#' + helper.id + '_clear-popup ul li:nth-child(1)');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).toBeNull();
            expect(sheet.comments.length).toBe(0);
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).not.toBeNull();
            expect((helper.getInstance().sheets[0] as ExtendedSheet).comments.length).toBe(1);
            helper.click('#spreadsheet_redo');
            expect(helper.invoke('getCell', [0, 0]).querySelector('.e-comment-indicator')).toBeNull();
            expect((helper.getInstance().sheets[0] as ExtendedSheet).comments.length).toBe(0);
            done();
        });
    });

    describe('Data bind testing ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    ranges: [{ dataSource: defaultData }],
                    rows: [{
                        index: 0, cells: [{
                            index: 0, comment: {
                                address: [0, 0], id: 'Spreadsheet-comment-1', author: 'JC', text: 'Hello', createdTime: 'November 18, 2025 at 4:31 PM',
                                isResolved: false, replies: []
                            } as ExtendedThreadedCommentModel
                        }]
                    }],
                    comments: [{
                        address: [1, 1], id: 'Spreadsheet-comment-2', author: 'JC', text: 'Hello', createdTime: 'November 18, 2025 at 4:31 PM',
                        isResolved: false, replies: []
                    } as ExtendedThreadedCommentModel]
                } as ExtendedSheet],
                author: 'JC',
                showCommentsPane: true,
                actionBegin(args: any) {
                    if (args.action === 'duplicateSheet' || args.action === 'moveSheet') {
                        args.eventArgs.cancel = true;
                    }
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing comment inserting via data binding', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].cells[0].comment.text).toBe('Hello');
            expect(helper.getInstance().sheets[0].comments[0].text).toBe('Hello');
            done();
        });
        it('Testing duplicateSheet edge cases', (done: Function) => {
            duplicateSheet(helper.getInstance(), 0, true);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Testing moveSheet method edge case.', (done: Function) => {
            helper.getInstance().sheets[0].state = 'Hidden';
            moveSheet(helper.getInstance(), 0, [], true);
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
    });

    describe('Data bind testing - II ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{
                    rows: [null, { index: 1, cells: null }, { index: 0, cells: [null] }]
                }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing duplicateSheet edge cases', (done: Function) => {
            duplicateSheet(helper.getInstance(), 0);
            setTimeout(() => {
                expect(helper.getInstance().activeSheetIndex).toEqual(1);
                done();
            });
        });
        it('Testing isSelected Method in the selection method to cover the test cases', (done: Function) => {
            helper.invoke('selectRange', ['H2']);
            helper.getInstance().selectionModule.isSelected(1, 7);
            helper.invoke('selectRange', ['C10']);
            helper.getInstance().selectionModule.isSelected(1, 1);
            done();
        });
    });

    describe('Data bind testing - III ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: []
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Testing getSheetNameCount edge cases', (done: Function) => {
            helper.getInstance().setProperties({ sheets: [] }, true);
            getSheetNameCount(helper.getInstance());
            expect(helper.getInstance().activeSheetIndex).toEqual(0);
            done();
        });
    });

    describe('Sheet model range properties test case coverage ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Range setProperties checking', (done: Function) => {
            const spreadsheet: any = helper.getInstance();
            const range: any = new Range(new Sheet(spreadsheet, 'sheets', []), 'ranges', []);
            range.parentObj = {
                ranges: [{ info: { loadedRange: [[0, 0, 45, 51]] } }], isComplexArraySetter: true,
                childChangedProperties: {}, dataBind: () => { }
            };
            range.controlParent = { isAngular: true };
            expect(range.parentObj.currRangeIdx).toBeUndefined();
            range.setProperties({ dataSource: [{ 'Item': 'Item 1' }, { 'Item': 'Item 2' }] }, true);
            expect(range.parentObj.currRangeIdx).toBe(0);
            range.setProperties({ showFieldAsHeader: true }, true);
            expect(range.parentObj.currRangeIdx).toBe(1);
            setTimeout(() => {
                expect(range.parentObj.currRangeIdx).toBeUndefined();
                const tagObjects: any = [{ name: 'ranges', instance: { list: [{ hasChanges: false }, { hasChanges: true }] } }];
                range.controlParent.tagObjects = [{
                    instance: {
                        hasChanges: true, isInitChanges: false,
                        list: [{ tagObjects: tagObjects }]
                    }
                }];
                range.controlParent.sheets = [range.parentObj];
                range.setProperties({}, true);
                expect(range.parentObj.currRangeIdx).toBeUndefined();
                expect(range.parentObj.changedRangeIdx).toBe(1);
                done();
            }, 10);
        });
    });
});
