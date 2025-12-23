import { NodeSelection } from "../../../src/selection/selection";
import { AIAssistantPromptRequestArgs, AIAssitantToolbarClickEventArgs, RichTextEditor } from "../../../src/rich-text-editor";
import { ALT_ENTERKEY_EVENT_INIT, ARROW_LEFT_EVENT_INIT, ARROWRIGHT_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, ENTERKEY_EVENT_INIT, ESCAPE_KEY_EVENT_INIT, TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT } from "../../constant.spec";
import { destroy, renderRTE, setCursorPoint, setSelection } from "../render.spec";
import { ActionBeginEventArgs } from "../../../src/common/interface";

describe('AI Assistant Module', ()=> {

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
    afterAll(()=> {
        document.getElementById('materialTheme').remove();
    });

    describe('Focus Menu Via Keyboard shortcut testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should focus the BUTTON element when the ALT + F 10 shortcut key is pressed.', (done: DoneFn)=> {
            editor.focusIn();
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyUpEvent: KeyboardEvent = new KeyboardEvent('keyup', TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyUpEvent);
            setTimeout(() => {
                expect(document.activeElement.nodeName).toBe('BUTTON');
                done();
            }, 100);
        });
    });

    describe('Menu Command Testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                        }]
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should insert the content when the Menu Command is executed.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                        insertButton.click();
                        setTimeout(() => {
                            expect(insertButton).not.toBeUndefined();
                            expect(editor.inputElement.innerHTML === '<p>This is a modified text content from LLM.</p>');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('995535 : AI Assistant commands menu inside the Popup not closed when the action is performed after one time.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should not render the popup menu when the action is not from toolbar click ', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                subMenu.querySelector('li').click();
                setTimeout(() => {
                    const dropdownButton: HTMLElement = document.querySelector('#' + editor.element.id + '_QueryPopupCommandsDropDown');
                    dropdownButton.click();
                    setTimeout(() => {
                        const subMenu: HTMLElement = document.querySelector('#' + editor.element.id + '_QueryPopupCommandsMenu');
                        subMenu.querySelector('li').classList.add('e-focused');
                        subMenu.querySelector('li').click();
                        expect(document.querySelectorAll('#' + editor.element.id + '_QueryPopupCommandsDropDown-popup').length).toBe(1);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('998903: When Assigning Prompt property Response are not parsed from Markdown to HTML.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery']
                },
                aiAssistantSettings: {
                    prompts: [
                        {
                            prompt: 'What is Essential Studio ?',
                            response: '## Essential studio is a popuplar enterprise UI Component.'
                        }
                    ]
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should render the prompt response in HTML', (done: DoneFn) => {
            editor.focusIn();
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                const insertButton: HTMLElement = document.querySelector('.e-btn-icon.e-icons.e-check.e-icon-left').parentElement;
                insertButton.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelectorAll('h2').length).toBe(1);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('998903: Coverage for the parsePromptResponses.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery']
                },
                aiAssistantSettings: {
                    prompts: [
                        {
                            prompt: 'What is Essential Studio ?'
                        }
                    ]
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Coverage for the parsePromptResponses, when there is no response', (done: DoneFn) => {
            editor.focusIn();
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Menu Command Streaming testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('**The Evolution of Content Creation: Understanding WYSIWYG and HTML’s Central Role**', false);
                    editor.addAIPromptResponse('**The Evolution of Content Creation: Understanding WYSIWYG and HTML’s Central Role**\nIn the vast and ever-evolving landscape of digital content creation, the phrase "What You See Is What You Get" (WYSIWYG) represents a paradigm shift that democratized web publishing. At its core, a WYSIWYG editor is a powerful tool designed to allow users to create and edit content in a visual environment that closely mimics its final displayed form. This is fundamentally different from traditional text editors like Notepad and proprietary word processors like Microsoft Word, primarily because of its underlying reliance on HyperText Markup Language (HTML) for all text formatting and styling. This distinction is not merely technical but signifies a different purpose, methodology, and output format for digital content.', false);
                    editor.addAIPromptResponse('**The Evolution of Content Creation: Understanding WYSIWYG and HTML’s Central Role**\nIn the vast and ever-evolving landscape of digital content creation, the phrase "What You See Is What You Get" (WYSIWYG) represents a paradigm shift that democratized web publishing. At its core, a WYSIWYG editor is a powerful tool designed to allow users to create and edit content in a visual environment that closely mimics its final displayed form. This is fundamentally different from traditional text editors like Notepad and proprietary word processors like Microsoft Word, primarily because of its underlying reliance on HyperText Markup Language (HTML) for all text formatting and styling. This distinction is not merely technical but signifies a different purpose, methodology, and output format for digital content.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should insert the content when the Menu Command is executed.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                        insertButton.click();
                        setTimeout(() => {
                            expect(editor.inputElement.innerHTML === '<p><strong>The Evolution of Content Creation: Understanding WYSIWYG and HTML’s Central Role</strong> In the vast and ever-evolving landscape of digital content creation, the phrase "What You See Is What You Get" (WYSIWYG) represents a paradigm shift that democratized web publishing. At its core, a WYSIWYG editor is a powerful tool designed to allow users to create and edit content in a visual environment that closely mimics its final displayed form. This is fundamentally different from traditional text editors like Notepad and proprietary word processors like Microsoft Word, primarily because of its underlying reliance on HyperText Markup Language (HTML) for all text formatting and styling. This distinction is not merely technical but signifies a different purpose, methodology, and output format for digital content.</p>');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Popup Close Testing via Header Button click.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should close the popup on the header close button click.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const closeButton: HTMLElement = document.querySelector('.e-rte-aiquery-popup .e-view-header button .e-close').parentElement;
                        closeButton.click();
                        setTimeout(() => {
                            expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Menu CSS Class property changes testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should focus the List element when the ALT + F 10 shortcut key is pressed.', (done: DoneFn)=> {
            expect(editor.toolbarModule.menuModule.aiCommandsMenu.cssClass).toBe('e-rte-aicommands-menu e-rte-menu e-rte-elements');
            editor.setProperties({ cssClass: 'crmeditor'});
            setTimeout(() => {
                expect(editor.toolbarModule.menuModule.aiCommandsMenu.cssClass).toBe('crmeditor e-rte-aicommands-menue-rte-menu e-rte-elements');
                done();
            }, 100);
        });
    });

    describe('Menu EnableRTL property changes testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should focus the List element when the ALT + F 10 shortcut key is pressed.', (done: DoneFn)=> {
            expect(editor.toolbarModule.menuModule.aiCommandsMenu.enableRtl).toBe(false);
            editor.enableRtl = true;
            setTimeout(() => {
                expect(editor.toolbarModule.menuModule.aiCommandsMenu.enableRtl).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Prompt Toolbar Copy Action Testing.', ()=> {
        let editor: RichTextEditor;
        let isCopyTriggered: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    responseToolbarSettings: [{
                        command: 'Custom',
                        subCommand: 'Paste',
                        iconCss: 'e-paste'
                    }],
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                aiAssistantToolbarClick: (e: AIAssitantToolbarClickEventArgs) => {
                    isCopyTriggered = true;
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should copy the content to the clipboard.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const copyButton: HTMLElement = document.querySelector('.e-rte-aiquery-popup .e-content-footer button').parentElement;
                        copyButton.click();
                        setTimeout(() => {
                            expect(isCopyTriggered).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 300);
            }, 100);
        });
    });

    describe('Show AI Query Popup Public method testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should show the AI Query Popup when the public method is called.', (done: DoneFn)=> {
            editor.showAIAssistantPopup();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('ExecutePrompt Public method testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should execute the query when the public method is called.', (done: DoneFn)=> {
            editor.showAIAssistantPopup();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                editor.executeAIPrompt('What is RTE ?');
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-aiquery-popup .e-assist-stop')).not.toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('AI Assistant Stop responding button click Public event testing', ()=> {
        let editor: RichTextEditor;
        let isTriggered: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                },
                aiAssistantStopRespondingClick:  () => {
                    isTriggered = true;
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should trigger the stop responding button click event when the button is clicked..', (done: DoneFn)=> {
            editor.showAIAssistantPopup();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                editor.executeAIPrompt('What is RTE ?');
                setTimeout(() => {
                    expect(document.querySelector('.e-rte-aiquery-popup .e-assist-stop')).not.toBe(null);
                    (document.querySelector('.e-rte-aiquery-popup .e-assist-stop').parentElement.parentElement as HTMLElement).click();
                    setTimeout(() => {
                        expect(isTriggered).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Hide AI Query Popup Public method testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should hide the AI Query Popup when the public method is called.', (done: DoneFn)=> {
            editor.showAIAssistantPopup();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                editor.hideAIAssistantPopup();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Get Prompt History Public method testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aicommands', 'aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should return the empty array when the public method is called.', ()=> {
            const prompts = editor.getAIPromptHistory();
            expect(prompts.length).toBe(0);
        });
        it('Should return the empty array when the public method is called.', ()=> {
            (editor.aiAssistantModule as any).allPrompts = [{
                prompt: 'This is the prompt to query with AI LLM.',
                response: 'This is the response from the AI LLM.'
            }];
            const prompts = editor.getAIPromptHistory();
            expect(prompts.length).toBe(1);
            editor.clearAIPromptHistory();
            expect(editor.getAIPromptHistory().length).toBe(0);
        });
    });

    describe('AIQuery Toolbar button testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should show the AI Query Popup when the Toolbar button is clicked.', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Window Resize Popup Position Refresh testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should call the refresh method when the window is resized..', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                let refreshMethodSpy = spyOn(editor.aiAssistantModule.queryPopup, 'refreshPosition');
                window.dispatchEvent(new Event('resize'));
                setTimeout(() => {
                    expect(refreshMethodSpy).toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Key Down Event Popup Position Refresh testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery']
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should call the refresh method when the Content size is changed.', (done: DoneFn)=> {
            editor.focusIn();
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                let refreshMethodSpy = spyOn(editor.aiAssistantModule.queryPopup, 'refreshPosition');
                editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
                setTimeout(() => {
                    expect(refreshMethodSpy).toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Prompt toolbar item click testing.', ()=> {
        let editor: RichTextEditor;
        let isClicked: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery']
                },
                aiAssistantSettings: {
                    prompts: [{
                        prompt: 'This is the prompt to query with AI LLM.',
                        response: 'This is the response from the AI LLM.'
                    }]
                },
                aiAssistantToolbarClick: ()=> {
                    isClicked = true;
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should trigger the click event when the Prompt toolbar item is clicked.', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                const promptToolbarItem: HTMLElement = document.querySelector('.e-rte-aiquery-popup .e-prompt-toolbar .e-toolbar-item');
                promptToolbarItem.click();
                setTimeout(() => {
                    expect(isClicked).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Response toolbar Regenerate Button click testing.', ()=> {
        let editor: RichTextEditor;
        let isClicked: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', '|', 'Bold', 'Italic', 'StrikeThrough', 'Inlinecode', '|', 'Formats', 'NumberFormatList', '|', 'Undo', 'Redo']
                },
                aiAssistantSettings: {
                    responseToolbarSettings: ['Insert', 'Regenerate', 'Copy'],
                    prompts: [{
                        prompt: 'This is the prompt to query with AI LLM.',
                        response: 'This is the response from the AI LLM.'
                    }]
                },
                aiAssistantToolbarClick: ()=> {
                    isClicked = true;
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should enable the stop responding button when the regenerate buttons is clicked.', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                const regenerateToolbarItme: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output .e-toolbar-item')[1] as HTMLElement;
                regenerateToolbarItme.click();
                setTimeout(() => {
                    expect(isClicked).toBe(true);
                    expect(document.querySelector('.e-rte-aiquery-popup .e-assist-stop')).not.toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('998982: Event args need to be updated with the original event, as toolbar items is clicked, in aiAssistantModule popup.', ()=> {
        let editor: RichTextEditor;
        let isClicked: boolean = false;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', '|', 'Bold', 'Italic', 'StrikeThrough', 'Inlinecode', '|', 'Formats', 'NumberFormatList', '|', 'Undo', 'Redo']
                },
                aiAssistantSettings: {
                    responseToolbarSettings: ['Insert', 'Regenerate', 'Copy'],
                    prompts: [{
                        prompt: 'This is the prompt to query with AI LLM.',
                        response: 'This is the response from the AI LLM.'
                    }]
                },
                aiAssistantToolbarClick: (args: AIAssitantToolbarClickEventArgs)=> {
                    if (args.originalEvent) {
                        isClicked = true;
                    }
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should update the event args with the original event', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                const cancelButton: HTMLElement = document.querySelectorAll('.e-toolbar-right')[0].childNodes[1].firstChild as HTMLElement;
                cancelButton.click();
                setTimeout(() => {
                    expect(isClicked).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Menu Command Quick toolbar Menu action Testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                quickToolbarSettings: {
                    text: ['aiquery', 'aicommands','Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'FontColor', 'BackgroundColor', '|', 'Formats', 'OrderedList', 'UnorderedList'],
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should insert the content when the Menu Command is executed.', (done: DoneFn) => {
            editor.focusIn();
            const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            editor.inputElement.querySelector('p').dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
                button.click();
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                    subMenu.querySelector('li').classList.add('e-focused');
                    const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                    subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                    setTimeout(() => {
                        const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                        expect(subMenu).not.toBeUndefined();
                        subMenu.querySelector('li').click();
                        setTimeout(() => {
                            const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                            insertButton.click();
                            setTimeout(() => {
                                expect(insertButton).not.toBeUndefined();
                                expect(editor.inputElement.innerHTML === '<p>This is a modified text content from LLM.</p>');
                                done();
                            }, );
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Header Toolbar Render testing', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    headerToolbarSettings: ['AIcommands']
                }
            })
        });
        afterAll(()=>{
            destroy(editor);
        });
        it ('Should render the Menu when the AI Commands item is configured.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = editor.getToolbarElement().querySelector('.e-toolbar-item');
            toolbarItem.click();
            setTimeout(() => {
                const aiQueryPopup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                expect(aiQueryPopup.querySelectorAll('.e-view-header .e-toolbar-item')[1]).not.toBeUndefined();
                done();
            }, 100);
        })
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 1: Enable Floating : true, No Scroll, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(53);
                done();
            }, 100);
        });
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    enableFloating: false,
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 2: Enable Floating : false, No Scroll, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(53);
                done();
            }, 100);
        });
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>What you see is what you get is a editor where the html is used for text formating styling and then editing which is quite different from MS Word processor and then Notepad. Rich HTML is the format used by the Rich Text Editor to edit and visualise the content.</p><h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 3: Enable Floating : true, Page Scroll, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.lastElementChild as HTMLElement;
            setSelection(target, 0,0);
            window.scrollTo(0,500);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(477);
                done();
            }, 100);
        });
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>What you see is what you get is a editor where the html is used for text formating styling and then editing which is quite different from MS Word processor and then Notepad. Rich HTML is the format used by the Rich Text Editor to edit and visualise the content.</p><h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>',
                toolbarSettings: {
                    enableFloating: false,
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 4: Enable Floating : false, Page Scroll, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.lastElementChild as HTMLElement;
            setSelection(target, 0,0);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            window.scrollTo(0,500);
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(434);
                done();
            }, 200);
        });
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 5: Enable Floating : true, No Scroll, IFrame, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(53);
                done();
            }, 100);
        });
    });

    describe('Popup Position testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands'],
                    enableFloating: false
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('CASE 6: Enable Floating : false, No Scroll, IFrame, Should set the offset Y to popup.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.offsetY).toBe(53);
                done();
            }, 100);
        });
    });

    describe('Module Destroy Testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        it ('Should destroy the element on destroy.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                const popupElement: HTMLElement = (editor.aiAssistantModule as any).element;
                destroy(editor);
                setTimeout(() => {
                    expect(document.contains(popupElement)).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Property changes testing.', ()=> {

        describe('Popup MaxHeight', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        popupMaxHeight: 500
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the height on Popup instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.element.style.maxHeight).toBe('500px');
                    editor.aiAssistantSettings.popupMaxHeight = 600;
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.queryPopup.element.style.maxHeight).toBe('600px');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Popup Width', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        popupWidth: 500
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the max height on Popup instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.width).toBe(500);
                    editor.aiAssistantSettings.popupWidth = 600;
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.queryPopup.width).toBe(600);
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Prompt Placeholder text', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        placeholder: 'Hey I am your assistant. Ask your queries here.'
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the Prompt Placeholder on AssistView instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.promptPlaceholder).toBe('Hey I am your assistant. Ask your queries here.');
                    editor.aiAssistantSettings.placeholder = 'Welcome back This is your assistant.';
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.promptPlaceholder).toBe('Welcome back This is your assistant.');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Prompts Collection', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        prompts: [
                            {
                                prompt: "What is your favorite color?",
                                response: "My favorite color is blue."
                            },
                            {
                                prompt: "Describe your ideal vacation.",
                                response: "A week in the mountains with a lake view and no internet."
                            }
                        ]
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the Prompts on Assistview instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.prompts[0].prompt).toBe('What is your favorite color?');
                    expect(editor.aiAssistantModule.assistView.prompts[1].prompt).toBe('Describe your ideal vacation.');
                    expect(editor.aiAssistantModule.assistView.prompts[0].response).toBe('<p>My favorite color is blue.</p>\n');
                    expect(editor.aiAssistantModule.assistView.prompts[1].response).toBe('<p>A week in the mountains with a lake view and no internet.</p>\n');
                    editor.aiAssistantSettings.prompts = [
                        {
                            prompt: "What are your thoughts on remote work?",
                            response: "Remote work offers flexibility but requires strong self-discipline."
                        },
                        {
                            prompt: "How do you handle stress?",
                            response: "I take short walks, practice mindfulness, and break tasks into manageable chunks."
                        },
                    ];
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.prompts[0].prompt).toBe('What are your thoughts on remote work?');
                        expect(editor.aiAssistantModule.assistView.prompts[1].prompt).toBe('How do you handle stress?');
                        expect(editor.aiAssistantModule.assistView.prompts[0].response).toBe('Remote work offers flexibility but requires strong self-discipline.');
                        expect(editor.aiAssistantModule.assistView.prompts[1].response).toBe('I take short walks, practice mindfulness, and break tasks into manageable chunks.');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Suggestions Collection', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        prompts: [
                            {
                                prompt: "What is your favorite color?",
                                response: "My favorite color is blue."
                            },
                            {
                                prompt: "Describe your ideal vacation.",
                                response: "A week in the mountains with a lake view and no internet."
                            }
                        ],
                        suggestions: ['What is the favourite color in world ?', 'What is the famous colour in india ?']
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the PromptSuggestions on Assistview instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.promptSuggestions[0]).toBe('What is the favourite color in world ?');
                    expect(editor.aiAssistantModule.assistView.promptSuggestions[1]).toBe('What is the famous colour in india ?');
                    editor.aiAssistantSettings.suggestions = [
                        'Which is the famous italian dish ?',
                        'Which is the famous chinese dish ?'
                    ];
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.promptSuggestions[0]).toBe('Which is the famous italian dish ?');
                        expect(editor.aiAssistantModule.assistView.promptSuggestions[1]).toBe('Which is the famous chinese dish ?');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Banner Template', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    aiAssistantSettings: {
                        bannerTemplate: '<h1>Welcome to Rich Text Editor.</h1>'
                    }
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the Banner Template on AssistView instance.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.element.querySelector('.e-banner-view').innerHTML).toBe('<h1>Welcome to Rich Text Editor.</h1>');
                    editor.aiAssistantSettings.bannerTemplate = '<h2>Welcome to Rich Text Editor.</h2>';
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.element.querySelector('.e-banner-view').innerHTML).toBe('<h2>Welcome to Rich Text Editor.</h2>');
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Enable Persistance', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    enablePersistence: true
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the Enable Persistance on AssistView.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.enablePersistence).toBe(true);
                    editor.enablePersistence = false;
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.enablePersistence).toBe(false);
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('CSS Class Property', ()=> {
            let editor: RichTextEditor;
            beforeAll(()=> {
                editor = renderRTE({
                    value: 'This is a content wiht improper format',
                    toolbarSettings: {
                        items: ['aiquery', 'aicommands']
                    },
                    cssClass: 'crmeditor'
                })
            });
            afterAll(()=> {
                destroy(editor);
            });
            it ('Should update the Enable Persistance on AssistView.', (done: DoneFn)=> {
                editor.focusIn();
                const target: HTMLElement = editor.inputElement.querySelector('p');
                setSelection(target.firstChild, 2,2);
                const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
                toolbarItem.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.cssClass.indexOf('crmeditor') > -1).toBe(true);
                    editor.cssClass = 'drmeditor';
                    editor.dataBind();
                    setTimeout(() => {
                        expect(editor.aiAssistantModule.assistView.cssClass.indexOf('drmeditor') > -1).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
    });

    describe('History Dropdown button testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should render the Dropdown Button in the Assist View footer.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                const queryPopup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                const dropdownButton: HTMLElement = queryPopup.querySelector('.e-rte-ai-assist-history');
                expect(dropdownButton).not.toBeUndefined();
                const historyButton: HTMLElement = document.querySelector('.e-footer-icons-wrapper').firstElementChild as HTMLElement;
                expect(historyButton).not.toBeUndefined();
                done();
            }, 100);
        });
    });

    describe('History Dropdown button click event testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should not render the Dropdown Button in the Assist View footer.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                const queryPopup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                const dropdownButton: HTMLElement = queryPopup.querySelector('.e-rte-ai-assist-history');
                expect(dropdownButton).not.toBeUndefined();
                const historyButton: HTMLElement = document.querySelector('.e-footer-icons-wrapper').firstElementChild as HTMLElement;
                expect(historyButton).not.toBeUndefined();
                historyButton.click();
                const toggleSpy: jasmine.Spy = spyOn((editor.aiAssistantModule as any).historyDropDownButton, 'toggle');
                setTimeout(() => {
                    expect(toggleSpy).not.toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('History Dropdown button click event testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                aiAssistantPromptRequest: (e) => {
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should insert the content when the Menu Command is executed.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                        insertButton.click();
                        setTimeout(() => {
                            expect(insertButton).not.toBeUndefined();
                            expect(editor.inputElement.innerHTML === '<p>This is a modified text content from LLM.</p>');
                            done();
                        }, );
                    }, 100);
                }, 100);
            }, 100);
        });
        it ('Should render the Dropdown Button in the Assist View footer.', (done: DoneFn)=> {
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                const queryPopup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                const dropdownButton: HTMLElement = queryPopup.querySelector('.e-rte-ai-assist-history');
                expect(dropdownButton).not.toBeUndefined();
                const historyButton: HTMLElement = document.querySelector('.e-footer-icons-wrapper .e-history') as HTMLElement;
                expect(historyButton).not.toBeUndefined();
                const toggleSpy: jasmine.Spy = spyOn((editor.aiAssistantModule as any).historyDropDownButton, 'toggle');
                historyButton.parentElement.parentElement.click();
                setTimeout(() => {
                    expect(toggleSpy).toHaveBeenCalled();
                    done();
                }, 100);
            }, 100);
        });
        it ('991403 - Should open the dropdown when the history is greater than one and should have proper height and width.', (done: DoneFn) =>  {
            (editor.aiAssistantModule as any).historyDropDownButton.toggle(); // Only for testing purpose.
            const historyPopup = document.querySelector('.e-rte-ai-assist-history.e-popup-open') as HTMLElement;
            setTimeout(() => {
                expect(historyPopup.offsetWidth).toBeGreaterThan(0);
                expect(historyPopup.offsetHeight).toBeGreaterThan(0);
                done();
            }, 100);
        });
    });

    describe('Shortcut Key testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>What you see is what you get is a editor where the html is used for text formating styling and then editing which is quite different from MS Word processor and then Notepad. Rich HTML is the format used by the Rich Text Editor to edit and visualise the content.</p><h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should show the popup when the shortcut key action is performed.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.lastElementChild as HTMLElement;
            setSelection(target, 0,0);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ALT_ENTERKEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyupEvent: KeyboardEvent = new KeyboardEvent('keyup', ALT_ENTERKEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyupEvent);
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Insert content into Range testing', ()=> {
        let editor: RichTextEditor;
        let isCorrectContent: boolean;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<p>Essential Studio® Enterprise-Grade UI Components One suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>`,
                toolbarSettings: {
                    items: ['aiquery', 'aicommands', '|', 'undo', 'redo']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                aiAssistantPromptRequest: (args: AIAssistantPromptRequestArgs) => {
                    isCorrectContent = args.html === '<p>Essential Studio® Enterprise-Grade UI Components One suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>';
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should process and insert the whole paragraph content and enable the undo after inserting.', (done: DoneFn)=> {
            editor.focusIn();
            setCursorPoint(editor.inputElement.querySelector('p').firstChild, 2); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        expect(isCorrectContent).toBe(true);
                        const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                        insertButton.click();
                        setTimeout(() => {
                            expect(insertButton).not.toBeUndefined();
                            expect(editor.inputElement.innerHTML).toBe('<p>This is a modified text content from LLM.</p>');
                            const undoItem: HTMLElement = editor.getToolbarElement().querySelector('.e-undo').parentElement.parentElement;
                            expect(undoItem.classList.contains('e-overlay')).toBe(false);
                            undoItem.click();
                            setTimeout(() => {
                                expect(editor.inputElement.innerHTML).toBe('<p>Essential Studio® Enterprise-Grade UI Components One suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Insert content into Selection testing', ()=> {
        let editor: RichTextEditor;
        let isCorrectContent: boolean;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<p>Essential Studio® Enterprise-Grade UI Components One suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>`,
                toolbarSettings: {
                    items: ['aiquery', 'aicommands', '|', 'undo', 'redo']
                },
                aiAssistantSettings: {
                    commands: [{
                            text: "Change Tone",
                            items: [
                                {
                                    text: "Professional",
                                    prompt: "Rewrite the following content in a professional tone:"
                                },
                                {
                                    text: "Casual",
                                    prompt: "Rewrite the following content in a casual, conversational tone:"
                                },
                            ]
                    }]
                },
                aiAssistantPromptRequest: (args: AIAssistantPromptRequestArgs) => {
                    isCorrectContent = args.html === 'Essential Studio® Enterprise-Grade UI Components O';
                    editor.addAIPromptResponse('This is a modified text content from LLM.', false);
                    editor.addAIPromptResponse('This is a modified text content from LLM.', true);
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it('Should process and insert the partial paragraph content and enable the undo after inserting.', (done: DoneFn)=> {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, 50); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        expect(isCorrectContent).toBe(true);
                        const insertButton: HTMLElement = document.querySelectorAll('.e-rte-aiquery-popup .e-output')[0].querySelector('.e-check').parentElement.parentElement;
                        insertButton.click();
                        setTimeout(() => {
                            expect(insertButton).not.toBeUndefined();
                            expect(editor.inputElement.innerHTML).toBe('<p>This is a modified text content from LLM.</p><p>ne suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>');
                            const undoItem: HTMLElement = editor.getToolbarElement().querySelector('.e-undo').parentElement.parentElement;
                            expect(undoItem.classList.contains('e-overlay')).toBe(false);
                            undoItem.click();
                            setTimeout(() => {
                                expect(editor.inputElement.innerHTML).toBe('<p>Essential Studio® Enterprise-Grade UI Components One suite. Endless possibilities. Use 1,600+ UI components to build modern, high-performing enterprise apps that work seamlessly on desktop, tablet, and mobile devices.</p>');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Escape Key Popup close testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: '<p>What you see is what you get is a editor where the html is used for text formating styling and then editing which is quite different from MS Word processor and then Notepad. Rich HTML is the format used by the Rich Text Editor to edit and visualise the content.</p><h2>What is Thinking fast and slow book says.</h2><p>Different areas of the brain.</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should close the Popup when the escape key is pressed.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.lastElementChild as HTMLElement;
            setSelection(target, 0,0);
            const keyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', ALT_ENTERKEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyDownEvent);
            const keyupEvent: KeyboardEvent = new KeyboardEvent('keyup', ALT_ENTERKEY_EVENT_INIT);
            editor.inputElement.dispatchEvent(keyupEvent);
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                const escapteKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT);
                document.body.dispatchEvent(escapteKeyEvent);
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Clear Button testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    headerToolbarSettings: ['AIcommands', 'Clear', 'Close'],
                    prompts: [
                        {
                            prompt: "What is your favorite color?",
                            response: "My favorite color is blue."
                        },
                        {
                            prompt: "Describe your ideal vacation.",
                            response: "A week in the mountains with a lake view and no internet."
                        }
                    ]
                }
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should clear the Prompts on Assistview instance.', (done: DoneFn)=> {
            editor.focusIn();
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 2,2);
            const toolbarItem: HTMLElement = (editor.getToolbarElement() as HTMLElement).querySelector('.e-toolbar-item') as HTMLElement;
            toolbarItem.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.assistView.prompts[0].prompt).toBe('What is your favorite color?');
                expect(editor.aiAssistantModule.assistView.prompts[1].prompt).toBe('Describe your ideal vacation.');
                expect(editor.aiAssistantModule.assistView.prompts[0].response).toBe('<p>My favorite color is blue.</p>\n');
                expect(editor.aiAssistantModule.assistView.prompts[1].response).toBe('<p>A week in the mountains with a lake view and no internet.</p>\n');
                const clearButton: HTMLElement = document.querySelector('.e-rte-aiquery-popup .e-view-header .e-trash').parentElement.parentElement;
                clearButton.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.assistView.prompts.length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Prompt request event cancle testing.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    responseToolbarSettings: [{
                        command: 'Custom',
                        subCommand: 'Paste',
                        iconCss: 'e-paste'
                    }],
                    commands: [{
                        text: "Change Tone",
                        items: [
                            {
                                text: "Professional",
                                prompt: "Rewrite the following content in a professional tone:"
                            },
                            {
                                text: "Casual",
                                prompt: "Rewrite the following content in a casual, conversational tone:"
                            },
                        ]
                    }]
                },
                aiAssistantPromptRequest: (e) => {
                    e.cancel = true;
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should cancel the event and then stop responding button should be display none.', (done: DoneFn) => {
            editor.focusIn();
            setSelection(editor.inputElement.querySelector('p').firstChild, 0, editor.inputElement.querySelector('p').firstChild.textContent.length); 
            const button: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            button.click();
            setTimeout(() => {
                const subMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                subMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                subMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        // const stopRespondingButton: HTMLElement = document.querySelector('.e-assist-stop');
                        // expect(stopRespondingButton.classList.contains('e-btn-active')).toBe(false);
                        done();
                    }, 100);
                }, 300);
            }, 100);
        });
    });

    describe('Banner Template Testing', ()=> {
        let editor: RichTextEditor;
        let script: HTMLScriptElement;
        beforeAll(()=> {
            script = document.createElement('script');
            script.id = 'editorAITemplate';
            script.type = 'text/x-jsrender';
            script.innerHTML = `<div>AI Response can be false. Read the responses carefully.</div>`;
            document.body.appendChild(script);
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    bannerTemplate: `#editorAITemplate`
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
            script.remove();
        });
        it ('Should render the js template properly.', (done: DoneFn)=> {
            editor.focusIn();
            const toolbarButton: HTMLElement = editor.getToolbarElement().querySelector('.e-magic-wand');
            toolbarButton.parentElement.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.querySelector('.e-banner-view').innerHTML).toBe('<div>AI Response can be false. Read the responses carefully.</div>');
                done();
            }, 100);
        });
    });

    describe('BeforePopupOpen Event cancel testing', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                beforePopupOpen: (args) => {
                    args.cancel = true;
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should not open the Popup.', (done: DoneFn)=> {
            editor.focusIn();
            const toolbarButton: HTMLElement = editor.getToolbarElement().querySelector('.e-magic-wand');
            toolbarButton.parentElement.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Mock Test cases', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: 'This is a content wiht improper format',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            })
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Calling private methods with Mock Arguments.',(done: DoneFn)=> {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstElementChild.firstChild, 0);
            const selection: NodeSelection = new NodeSelection(editor.inputElement).save(editor.getRange(), editor.element.ownerDocument);
            const actionBeginArgs: ActionBeginEventArgs = {
                requestType: 'AIAssistant',
                name: 'NOTInsertResponseContent',
                item: {
                    command: 'AIAssistant',
                    subCommand: 'NOTInsertResponseContent',
                    value: 'response'
                }
            };
            editor.formatter.process(editor, actionBeginArgs, null,{ selection: selection});
            setTimeout(() => {
                // No Expect since its for the coverage.
                done();
            }, 100);
        })
    });

    describe('991993: The AI Assistant Popup position is improper not relative to the Editor Element.', () => {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                width: 500,
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it ('Popup position should be relative to the editor root element.', (done: DoneFn) => {
            editor.focusIn();
            const queryButton: HTMLElement = editor.element.querySelector('.e-magic-wand').parentElement.parentElement;
            queryButton.click();
            setTimeout(() => {
                const popup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                expect(popup.getBoundingClientRect().right).toBeLessThan(editor.element.getBoundingClientRect().right);
                done();
            }, 100);
        });
    });

    describe('995531 - AIQuery Toolbar button testing', ()=> {
        let editor: RichTextEditor;
        let controlId: string;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery']
                }
            });
            controlId = editor.element.id;
        });
        afterAll(()=> {
            destroy(editor);
        });
        it(' - Should close the AI Query Popup when the Toolbar button is clicked twice and check its active class state', (done: DoneFn)=> {
            (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                expect(document.getElementById(controlId + '_toolbar_AIQuery').parentElement.classList.contains('e-active')).toBe(true);
                (editor.getToolbarElement().querySelector('.e-toolbar-item') as HTMLElement).click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                    expect(document.getElementById(controlId + '_toolbar_AIQuery').parentElement.classList.contains('e-active')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('993784: Implement Management Review Comments for AI Assistant Feature in Syncfusion Rich Text Editor.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                width: 500,
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should have display flex for the Popup', (done: DoneFn) => {
            editor.focusIn();
            const queryButton: HTMLElement = editor.element.querySelector('.e-magic-wand').parentElement.parentElement;
            queryButton.click();
            setTimeout(() => {
                const popup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
                const computedStyle: CSSStyleDeclaration = window.getComputedStyle(popup);
                setTimeout(() => {
                    expect(computedStyle.display).toBe('flex');
                    done();
                }, 100);
            }, 100);
        });
        it ('Should have display flex for the wrapper', (done: DoneFn) => {
            const popup: HTMLElement = document.querySelector('.e-rte-aiquery-popup').firstElementChild as HTMLElement;
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(popup);
            setTimeout(() => {
                expect(computedStyle.display).toBe('flex');
                done();
            }, 100);
        })
        it ('Should have display flex for the Assist View', (done: DoneFn) => {
            const popup: HTMLElement = document.querySelector('.e-rte-aiquery-popup').firstElementChild.firstElementChild as HTMLElement;
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(popup);
            setTimeout(() => {
                expect(computedStyle.display).toBe('flex');
                done();
            }, 100);
        });
    })

    describe('996585: The AI Assistant Response view is not properly scrolled down the end of the response is not visible.', ()=> {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantPromptRequest: ()=> {
                    editor.addAIPromptResponse('Haha Hi there Software Develeoper.', true);
                }
            });
        });
        afterAll(()=>{
            destroy(editor);
        })
        it ('Should call the scroll to bottom method of the assist view instance.', (done: DoneFn) =>{
            editor.focusIn();
            const queryButton: HTMLElement = editor.element.querySelector('.e-magic-wand').parentElement.parentElement;
            queryButton.click();
            setTimeout(() => {
                const scrollToBottom: jasmine.Spy = spyOn(editor.aiAssistantModule.assistView, 'scrollToBottom');
                editor.executeAIPrompt('Hey there LLM!');
                expect(scrollToBottom).toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('997068: The AI Query button response is not inserted into the editor.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=>{
            editor = renderRTE({
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantPromptRequest: ()=> {
                    editor.addAIPromptResponse('Haha Hi there Software Develeoper.', false);
                    editor.addAIPromptResponse('Haha Hi there Software Develeoper.', true);
                }
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should insert the content properly into the editor', (done: DoneFn)=> {
            editor.focusIn();
            setCursorPoint(editor.inputElement.firstElementChild, 0);
            const queryButton: HTMLElement = editor.getToolbarElement().querySelector('.e-toolbar-item .e-magic-wand').parentElement.parentElement as HTMLElement;
            queryButton.click();
            setTimeout(() => {
                editor.aiAssistantModule.assistView.executePrompt('Hi LLM How are you');
                setTimeout(() => {
                    const insertButton: HTMLElement = document.querySelector('.e-rte-aiquery-popup .e-output .e-check');
                    insertButton.parentElement.parentElement.click();
                    setTimeout(() => {
                        expect(editor.inputElement.innerHTML).toBe('<p>Haha Hi there Software Develeoper.</p>');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        })
    });
    
    describe('994893: AI Assistant Popup should close when SourceCode toolbar button is clicked', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '<p>This is a sample content for AI Assistant source view testing.</p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', '|', 'SourceCode', '|', 'aiquery', 'aicommands']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should close the AI Assistant popup when switching to HTML source view', (done: DoneFn) => {
            editor.focusIn();
            // Open AI Assistant popup
            const aiQueryButton: HTMLElement = editor.getToolbarElement().querySelector('.e-toolbar-item .e-magic-wand').parentElement.parentElement as HTMLElement;
            aiQueryButton.click();
            setTimeout(() => {
                expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                // Click SourceCode button to switch to HTML view
                const sourceCodeButton: HTMLElement = editor.getToolbarElement().querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                sourceCodeButton.click();
                setTimeout(() => {
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-close')).toBe(true);
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(false);
                    done();
                }, 200);
            }, 100);
        });
    });

    describe('994895: Quick Toolbar should close when AI Query popup is opened from Quick Toolbar', () => {
        let editor: RichTextEditor;
        const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
        const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
        beforeAll(() => {
            editor = renderRTE({
                value: '<p>Sample content to test AI Assistant integration with Quick Toolbar.</p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', '|', 'aiquery', 'aicommands']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should close Quick Toolbar after clicking aiquery button in text Quick Toolbar', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup).not.toBe(null);
                // Click the aiquery (magic wand) button inside Quick Toolbar
                const aiQueryBtn: HTMLElement = quickPopup.querySelector('.e-magic-wand').parentElement.parentElement as HTMLElement;
                aiQueryBtn.click();
                setTimeout(() => {
                    // AI Assistant popup must be open
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                    // Quick Toolbar must be closed / removed from DOM
                    expect(document.querySelector('.e-rte-quick-popup')).toBeNull();
                    done();
                }, 300);
            }, 100);
        });
    });

    describe('994895: Quick Toolbar should close when AI Query popup is opened from Quick Toolbar', () => {
        let editor: RichTextEditor;
        const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
        const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
        beforeAll(() => {
            editor = renderRTE({
                value: '<p>Sample content to test AI Assistant integration with Quick Toolbar.</p>',
                toolbarSettings: {
                    items: ['Bold', 'Italic', '|', 'aiquery', 'aicommands']
                },
                inlineMode: {
                    enable: true,
                    onSelection: true
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should close inline Toolbar after clicking aiquery button in text Quick Toolbar', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('p');
            setSelection(target.firstChild, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                expect(quickPopup).not.toBe(null);
                // Click the aiquery (magic wand) button inside Quick Toolbar
                const aiQueryBtn: HTMLElement = quickPopup.querySelector('.e-magic-wand').parentElement.parentElement as HTMLElement;
                aiQueryBtn.click();
                setTimeout(() => {
                    // AI Assistant popup must be open
                    expect(editor.aiAssistantModule.queryPopup.element.classList.contains('e-popup-open')).toBe(true);
                    // Quick Toolbar must be closed / removed from DOM
                    expect(document.querySelector('.e-rte-quick-popup')).toBeNull();
                    done();
                }, 500); // Increased from 300 to 500-1000ms. Try 500 first.
            }, 100);
        });
    });

    describe('995534: AI Assistant should process the whole editor content when directly clicked the Toolbar button.', () => {
        let editor: RichTextEditor;
        let processedHtml: string = '';
        const response: string = 'Processed by AI';

        beforeAll(() => {
            editor = renderRTE({
                value: '<p>This is the full content that should be processed when not focused.</p>',
                toolbarSettings: {
                    items: ['aiquery', 'aicommands']
                },
                aiAssistantSettings: {
                    commands: [{
                        text: "Change Tone",
                        items: [
                            {
                                text: "Professional",
                                prompt: "Rewrite the following content in a professional tone:"
                            }
                        ]
                    }]
                },
                aiAssistantPromptRequest: (args: AIAssistantPromptRequestArgs) => {
                    // Capture the html sent to AI to assert later
                    processedHtml = args.html;
                    // Simulate AI response and finalize (same style as other tests)
                    editor.addAIPromptResponse(response, false);
                    editor.addAIPromptResponse(response, true);
                }
            });
        });

        afterAll(() => {
            destroy(editor);
        });

        it('Should send the entire content to AI when toolbar menu item is clicked without focusing the editor', (done: DoneFn) => {
            // DO NOT call editor.focusIn(); we want the "not focused" case.
            // Click the AI Commands toolbar button
            const commandsButton: HTMLButtonElement = editor.getToolbarElement().querySelector('.e-ai-commands-tbar-btn');
            commandsButton.click();
            setTimeout(() => {
                // Open submenu by hover and then click first item
                const rootMenu: HTMLElement = document.querySelector('.e-dropdown-popup.e-ai-commands-tbar-btn .e-menu-parent') as HTMLElement;
                rootMenu.querySelector('li').classList.add('e-focused');
                const mouseOverEvent: MouseEvent = new MouseEvent('mouseover', BASIC_MOUSE_EVENT_INIT);
                rootMenu.querySelector('li').dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const subMenu: HTMLElement = document.querySelectorAll('.e-menu-popup')[0] as HTMLElement;
                    expect(subMenu).not.toBeUndefined();
                    // Click the first AI command item
                    subMenu.querySelector('li').click();
                    setTimeout(() => {
                        const expectedWholeContent = editor.getHtml();
                        expect(processedHtml).toBe(expectedWholeContent);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('999875 :Should replace the editor content when the insert button is clicked.', (done: DoneFn) => {
            const aiQueryPopup: HTMLElement = document.querySelector('.e-rte-aiquery-popup');
            const insertButton: HTMLElement = aiQueryPopup.querySelector('.e-check').parentElement.parentElement;
            insertButton.click();
            setTimeout(() => {
                expect(editor.inputElement.innerHTML).toBe('<p>Processed by AI</p>\n');
                done();
            }, 100);
        })
    });
});
