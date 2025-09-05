import { RichTextEditor, dispatchEvent } from '../../../src/rich-text-editor/index';
import { renderRTE, destroy, setSelection } from './../render.spec';
import { SHIFT_ARROW_LEFT_EVENT_INIT } from '../../constant.spec';

describe ('OnSelectionChange Event', () => {
    describe('969423 - Inline toolbar doesnot show properly when selecting entire content in RichTextEditor', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        describe('968971 - Should check toolbar status while selection change event got triggered', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('should check toolbar status get update when mouseup released outside rte', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-toolbar-item').classList.contains('e-active')).toBe(true);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('968971 -  Checking inline quicktoolbar', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    inlineMode: {
                        enable: true,
                        onSelection: true
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('check with inlinequick tool bar', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-inline-popup')).not.toBe(null);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 200);
            });
        });
        describe('968971 -  Checking inline quicktoolbar with multiple node selection ', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>
                    <h1>Syncfusion</h1>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    inlineMode: {
                        enable: true,
                        onSelection: true
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Check with inline quick toolbar for multiple node selection', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                const targetTwo: HTMLElement = rteObj.element.querySelector('h1');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetOne, targetTwo, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-inline-popup')).not.toBe(null);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('968971 -  Checking text quicktoolbar', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent'],
                        showOnRightClick: true,
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Check with text quick tool bar', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-quick-popup')).not.toBe(null);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
            it('Check with text quick toolbar status update', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-quick-popup')).not.toBe(null);
                    expect(document.querySelector('.e-toolbar-item').classList.contains('e-active')).toBe(true);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('968971 -  Checking text quicktoolbar with multiple selection', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p> 
                    <h1>Syncfusion</h1>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent'],
                        showOnRightClick: true,
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Check with text quick tool bar with multiple node selection', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                const targetTwo: HTMLElement = rteObj.element.querySelector('h1');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetOne, targetTwo, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-quick-popup')).not.toBe(null);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('968971 -  Checking text quicktoolbar not opening when selecting the image', () => {
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%;" class="e-rte-image e-imginline"></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent'],
                        showOnRightClick: true,
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Check with text quick tool bar with image', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                setSelection(targetOne.firstChild, 0, 0);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-text-quicktoolbar')).toBe(null);
                    done();
                }, 300);
            });
        });
        describe('968971 -  Checking text quicktoolbar not opening when selecting the table', () => {
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%" class="e-cell-select">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr>   </tbody></table>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent'],
                        showOnRightClick: true,
                    },
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Check with text quick tool bar not opening when selecting with table', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('table');
                setSelection(targetOne.firstChild, 0, 0);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-text-quicktoolbar')).toBe(null);
                    done();
                }, 300);
            });
        });
        describe('968971:  Checking text quicktoolbar duplication while scrolling', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    quickToolbarSettings: {
                        text: ['Formats', 'FontName']
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    },
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('should show single quick toolbar', (done: DoneFn) => {
                rteObj.focusIn();
                const target: HTMLElement = rteObj.inputElement.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(target.firstChild, 1, 2);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(new Event('mouseup', { bubbles: true }));
                rteObj.inputElement.parentElement.scrollTop = 130;
                target.dispatchEvent(mouseUpEvent);
                rteObj.quickToolbarModule.textQTBar.showPopup(target, null)
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-text-quicktoolbar').length == 1).toBe(true);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('968971:  Checking link quicktoolbar ', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    quickToolbarSettings: {
                        link: ["Open", "Edit", "UnLink"],
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    },
                    value: `<a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a> `
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('Check with link quick tool bar', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('a');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne.firstChild, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-quick-popup')).not.toBe(null);
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
    })
    
    describe('969423 - Introduce onTextSelection Event in Rich Text Editor', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        describe('969423 - Should check onSelectionChangeevent in Document mouseup', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Should check onSelectionChangeevent got triggered when document mouseup event', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                document.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('969423 - Should check onSelectionChange event in RTE mouseup', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Should check onSelectionChangeevent got triggered when rte mouseup event', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                rteObj.inputElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('969423 - Should check onSelectionChange event in RTE keyup', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<p><strong>RichTextEditor</strong></p>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Should check onSelectionChangeevent got triggered when rte keyup event', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('p');
                rteObj.inputElement.dispatchEvent(new Event('mousedown', { bubbles: true }));
                setSelection(targetOne, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                dispatchEvent(rteObj.contentModule.getEditPanel(), 'keyup');
                setTimeout(() => {
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
        describe('969423 - Should check onSelectionCHange event triggers in table ', () => {
            let rteObj: RichTextEditor;
            let isEventTriggers: boolean = false;
            beforeAll(() => {
                rteObj = renderRTE({
                    value: `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%" class="e-cell-select">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr>   </tbody></table>`,
                    toolbarSettings: {
                        items: ['Bold']
                    },
                    quickToolbarSettings: {
                        text: ['Formats', '|', 'Bold', 'Italic', 'Fontcolor', 'BackgroundColor', '|', 'CreateLink', 'Image', 'CreateTable', 'Blockquote', '|', 'Unorderedlist', 'Orderedlist', 'Indent', 'Outdent'],
                        showOnRightClick: true,
                    },
                    selectionChanged: () => {
                        isEventTriggers = true;
                    }
                });
            });
            afterAll((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('when selecting the table', (done: Function) => {
                rteObj.focusIn();
                const targetOne: HTMLElement = rteObj.element.querySelector('table');
                setSelection(targetOne.firstChild, 0, 1);
                document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
                rteObj.inputElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    expect(isEventTriggers).toBe(true);
                    done();
                }, 300);
            });
        });
    });
    describe('974037: onSelectionChange should trigger only once when selecting table and text content', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        let rteObj: RichTextEditor;
        let triggerCount: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>This is a sample paragraph before the table.</p>
                        <table class="e-rte-table" style="width: 100%; height: 151px">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Occupation</th>
                                    <th>Transport</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Selma Rose</td>
                                    <td>30</td>
                                    <td>Female</td>
                                    <td>Engineer</td>
                                    <td>🚴</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>This is a sample paragraph after the table.</p>`,
                toolbarSettings: {
                    items: ['Bold']
                },
                selectionChanged: () => {
                    triggerCount++;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('should trigger onSelectionChange only once when selecting table and text content', (done: Function) => {
            rteObj.focusIn();
            const startNode = rteObj.element.querySelector('p'); // First paragraph
            const endNode = rteObj.element.querySelector('table'); // Table
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, endNode, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(triggerCount).toBe(1);
                done();
            }, 300);
        });
    });
    describe('974037: Clicking the table should not trigger onSelectionChange event', () => {
        let rteObj: RichTextEditor;
        let eventtriggers: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Intro text before table.</p>
                        <table class="e-rte-table" style="width: 100%; height: 151px">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Occupation</th>
                                    <th>Transport</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Selma Rose</td>
                                    <td>30</td>
                                    <td>Female</td>
                                    <td>Engineer</td>
                                    <td>🚴</td>
                                </tr>
                            </tbody>
                        </table>`,
                selectionChanged: () => {
                    eventtriggers = true;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('should not trigger onSelectionChange when clicking the table', (done: Function) => {
            rteObj.focusIn();
            const tableElement: HTMLElement = rteObj.element.querySelector('table');
            const clickEvent = new MouseEvent('click', { bubbles: true, ctrlKey: false });
            tableElement.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(eventtriggers).toBe(false);
                done();
            }, 300);
        });
    });
    describe('974037: Multiple table cells should populate selectedContent in onSelectionChange', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        let rteObj: RichTextEditor;
        let selectedContent: string = '';
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td>A1</td>
                                    <td>A2</td>
                                </tr>
                                <tr>
                                    <td>B1</td>
                                    <td>B2</td>
                                </tr>
                            </tbody>
                        </table>`,
                selectionChanged: (args: any) => {
                    selectedContent = args.selectedContent;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('should have non-empty selectedContent when multiple cells are selected', (done: Function) => {
            rteObj.focusIn();
            const firstCell = rteObj.element.querySelector('td');
            const secondCell = rteObj.element.querySelectorAll('td')[1];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, firstCell.firstChild, secondCell.firstChild, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(selectedContent).not.toBe('');
                done();
            }, 300);
        });
    });
    describe('969423 - Should check onSelectionChangeevent in Document mouseup', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        let rteObj: RichTextEditor;
        let isEventTriggers: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><strong>RichTextEditor</strong></p>`,
                toolbarSettings: {
                    items: ['Bold']
                },
                selectionChanged: () => {
                    isEventTriggers = true;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Selecting content outside RTE and releasing mouse inside should not trigger onSelectionChange', (done: Function) => {
            const externalDiv = document.createElement('div');
            externalDiv.id = 'external';
            externalDiv.textContent = 'Outside Content';
            document.body.appendChild(externalDiv);
            const rteContent = rteObj.element.querySelector('p');
            // Start selection outside RTE
            externalDiv.dispatchEvent(new Event('mousedown', { bubbles: true }));
            setSelection(externalDiv, 0, 1);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, externalDiv, rteContent.firstChild, 0, 1);
            // Release mouse inside RTE
            rteContent.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(isEventTriggers).toBe(false);
                externalDiv.remove();
                done();
            }, 300);
        });
    });
    describe('975067 - SelectionChanged event - Shift + Left Arrow in table', () => {
        let rteObj: RichTextEditor;
        let isEventTriggered: boolean = false;
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td class="e-multi-cells-select">A1</td>
                                    <td class="e-multi-cells-select">A2</td>
                                </tr>
                                <tr>
                                    <td>B1</td>
                                    <td>B2</td>
                                </tr>
                            </tbody>
                        </table>`, selectionChanged: () => {
                    isEventTriggered = true;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Should trigger selectionChanged event on Shift + Left Arrow key press', (done: Function) => {
            rteObj.focusIn();
            const firstCell = rteObj.element.querySelector('td');
            const secondCell = rteObj.element.querySelectorAll('td')[1];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, firstCell, secondCell, 0, 1);
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_LEFT_EVENT_INIT));
            setTimeout(() => {
                expect(isEventTriggered).toBe(true);
                done();
            }, 300);
        });
    });
    describe('SelectionChanged Event - Text Selection vs Bold Formatting', () => {
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        let rteObj: RichTextEditor;
        let isEventTriggered: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>This is a sample text.</p>`,
                selectionChanged: () => {
                    isEventTriggered = true;
                },
                toolbarSettings: {
                    items: ['Bold']
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Should trigger selectionChanged when text is selected', (done: Function) => {
            rteObj.focusIn();
            const paragraph = rteObj.element.querySelector('p');
            setSelection(paragraph, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(isEventTriggered).toBe(true);
                isEventTriggered = false;
                done();
            }, 300);
        });
        it('Should NOT trigger selectionChanged when bold is applied using Ctrl+B', (done: Function) => {
            const boldEvent = new KeyboardEvent('keydown', {
                key: 'b',
                ctrlKey: true,
                bubbles: true
            });
            rteObj.inputElement.dispatchEvent(boldEvent);
            setTimeout(() => {
                expect(isEventTriggered).toBe(false);
                done();
            }, 300);
        });
    });
    describe('SelectionChanged Event - Inside vs Outside RTE', () => {
        let rteObj: RichTextEditor;
        let isEventTriggered: boolean = false;
        const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, ctrlKey: false });
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>This is RTE content.</p>`,
                selectionChanged: () => {
                    isEventTriggered = true;
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            document.getElementById('outsideContent').remove();
            done();
        });
        it('Should trigger selectionChanged when selecting text inside RTE', (done: Function) => {
            rteObj.focusIn();
            const rteText = rteObj.element.querySelector('p');
            setSelection(rteText, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(isEventTriggered).toBe(true);
                isEventTriggered = false;
                done();
            }, 300);
        });
        it('Should NOT trigger selectionChanged when selecting text outside RTE', (done: Function) => {
            // Add outside content to the DOM
            const outsideDiv = document.createElement('div');
            outsideDiv.id = 'outsideContent';
            outsideDiv.textContent = 'This is outside RTE content.';
            document.body.appendChild(outsideDiv);
            const outsideText = document.getElementById('outsideContent');
            setSelection(outsideText, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                expect(isEventTriggered).toBe(false);
                done();
            }, 300);
        });
    });
    describe('975443 - Inline Toolbar Visibility', () => {
        let rteObj: RichTextEditor;
        let isEventTriggered: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><strong>RichTextEditor</strong></p>`,
                selectionChanged: () => {
                    isEventTriggered = true;
                },
                inlineMode: {
                    enable: true,
                    onSelection: true
                },
                toolbarSettings: {
                    items: ['Bold', 'Italic', 'Formats', 'FontName']
                }
            });
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Inline Toolbar Visibility Changes Repeatedly During Keyboard Text Selection', (done: Function) => {
            rteObj.focusIn();
            const firstCell = rteObj.element.querySelector('p');
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keydown', SHIFT_ARROW_LEFT_EVENT_INIT));
            setSelection(firstCell, 0, 1);
            document.dispatchEvent(new Event('selectionchange', { bubbles: true }));
            rteObj.inputElement.dispatchEvent(new KeyboardEvent('keyup', SHIFT_ARROW_LEFT_EVENT_INIT));
            setTimeout(() => {
                expect(isEventTriggered).toBe(true);
                expect(document.querySelector('.e-rte-inline-popup')).not.toBe(null);
                done();
            }, 300);
        });
    });
})