import { getComponent } from "@syncfusion/ej2-base";
import { IToolbarItems, NodeSelection, RichTextEditor } from "../../../src";
import { destroy, renderRTE, setSelection } from "../render.spec";
import { Toolbar } from "@syncfusion/ej2-navigations";


describe('Menu Tests', ()=> {

    beforeAll((done: DoneFn)=> {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        link.onload= ()=> {
            done(); // Style should be loaded before done() called
        };
        link.onerror = (e) => {
            fail(`Failed to load stylesheet: ${link.href}`);
            done(); // still end the test run to avoid hanging
        };
        document.head.appendChild(link);

    });
    afterAll((done: DoneFn)=> {
        document.getElementById('materialTheme').remove();
        done();
    });

    describe('BasicMenu Rendering Test', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['AICommands', 'AIQuery'] as IToolbarItems[]
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should render the Menu Component when the Menu Based toolbar item is configured', ()=> {
            const toolbar: HTMLElement = editor.getToolbarElement() as HTMLElement;
            const items: NodeListOf<HTMLElement> = toolbar.querySelectorAll('.e-toolbar-item') as NodeListOf<HTMLElement>;
            expect(items[0].classList.contains('e-template')).toBe(true);
            const dropDownButton: HTMLElement = items[0].firstElementChild as HTMLElement;
            expect(dropDownButton.classList.contains('e-rte-dropdown-menu')).toBe(true);
            expect(dropDownButton.classList.contains('e-dropdown-btn')).toBe(true);
        });
    });

    describe('AI Commands Menu Rendering Test', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['AICommands', 'AIQuery'] as IToolbarItems[]
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should render the Menu Component when the AI Commands toolbar item is configured', ()=> {
            const toolbar: HTMLElement = editor.getToolbarElement() as HTMLElement;
            const items: NodeListOf<HTMLElement> = toolbar.querySelectorAll('.e-toolbar-item') as NodeListOf<HTMLElement>;
            const templateValue: string = `<button id="${editor.getID()}_toolbar_AICommandsDropDownMenu"></button>`;
            expect((getComponent(toolbar, 'toolbar') as Toolbar).items[0].template).toBe(templateValue);
            const menuWrapper: HTMLElement = items[0].firstElementChild as HTMLElement;
            expect(menuWrapper.classList.contains('e-ai-commands-tbar-btn')).toBe(true);
        });
    });

    describe('AI Commands Menu Selection Save and restore testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p>`,
                toolbarSettings: {
                    items: ['AICommands', 'AIQuery'] as IToolbarItems[]
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should trigger the onSelectionSave on HTML Editor when onOpen event of menu is triggered', (done: DoneFn)=> {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('h2').firstChild, 3, 12);
            const caretIcon: HTMLElement = editor.element.querySelector('.e-toolbar .e-dropdown-btn .e-caret');
            expect((editor.htmlEditorModule as any).saveSelection).toBeUndefined();
            caretIcon.click();
            setTimeout(() => {
                expect(((editor.htmlEditorModule as any).saveSelection as NodeSelection).range.startOffset).toBe(3);
                expect(((editor.htmlEditorModule as any).saveSelection as NodeSelection).range.endOffset).toBe(12);
                done();
            }, 100);
        });
        it ('Should trigger the onSelectionRestore on HTML Editor when onClose event of menu is triggered', (done: DoneFn)=> {
            const menuItem: HTMLElement = document.querySelector('.e-dropdown-popup li');
            menuItem.click();
            setTimeout(() => {
                const range: Range = editor.getRange();
                expect(range.startOffset).toBe(3);
                expect(range.endOffset).toBe(12);
                done();
            }, 100);
        });
    });

    describe('AI Commands Menu Selection Item selected event testing.', ()=> {
        let editor: RichTextEditor;
        let itemSelectedTrigger: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p>`,
                toolbarSettings: {
                    items: ['AICommands', 'AIQuery'] as IToolbarItems[]
                }
            });
            editor.on('menuItemselected', ()=> {
                itemSelectedTrigger = true;
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should trigger the selected event when a list is selected.', (done: DoneFn)=> {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('h2').firstChild, 3, 12);
            const caretIcon: HTMLElement = editor.element.querySelector('.e-toolbar .e-dropdown-btn .e-caret');
            caretIcon.click();
            setTimeout(() => {
                const menuItem: HTMLElement = document.querySelector('.e-dropdown-popup li');
                menuItem.click();
                setTimeout(() => {
                    expect(itemSelectedTrigger).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Inline toolbar BasicMenu Rendering Test', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                inlineMode: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['AICommands', 'AIQuery'] as IToolbarItems[]
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should render the inline toolbar without any console error.', (done: DoneFn)=> {
            editor.showInlineToolbar();
            setTimeout(() => {
                const toolbar: HTMLElement = editor.getToolbarElement() as HTMLElement;
                const items: NodeListOf<HTMLElement> = toolbar.querySelectorAll('.e-toolbar-item') as NodeListOf<HTMLElement>;
                expect(items[0].classList.contains('e-template')).toBe(true);
                const dropDownButton: HTMLElement = items[0].firstElementChild as HTMLElement;
                expect(dropDownButton.classList.contains('e-rte-dropdown-menu')).toBe(true);
                expect(dropDownButton.classList.contains('e-dropdown-btn')).toBe(true);
                done();
            }, 100);
        });
    });
});