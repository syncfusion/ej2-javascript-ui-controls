
import { createElement, EventHandler, L10n } from "@syncfusion/ej2-base";
import { AIAssistView, PromptRequestEventArgs } from "../../src/ai-assistview/index";
import { ToolbarItemClickedEventArgs } from '../../src/interactive-chat-base/index';
import { InterActiveChatBase } from '../../src/interactive-chat-base/index';

describe('AIAssistView -', () => {

    let aiAssistView: AIAssistView;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        action: null,
        key: null,
        target: null,
        currentTarget: null,
        altKey: null,
        stopImmediatePropagation: (): void => { /** NO Code */ }
    };
    const aiAssistViewElem: HTMLElement = createElement('div', { id: 'aiAssistViewComp' });
    document.body.appendChild(aiAssistViewElem);

    describe('DOM', () => {
        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Default rendering', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo('#aiAssistViewComp');
            expect(aiAssistViewElem.classList.contains('e-aiassistview')).toEqual(true);
            const aiAssistViewHeaderELem: HTMLButtonElement = aiAssistView.element.querySelector('.e-view-header .e-assist-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('AI Assist');
            const iconElem: HTMLElement = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-assistview-icon')).toEqual(true);
            const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
            expect(textAreaElem).not.toBeNull();
            const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(true);
        });

        it('Unique ID checking', () => {
            aiAssistViewElem.removeAttribute('id');
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.hasAttribute('id')).toEqual(true);
            aiAssistViewElem.setAttribute('id', 'aiAssistViewComp');
        });

        it('Prompt checking', () => {
            aiAssistView = new AIAssistView({
                prompt: 'Write a palindrome program in C#.'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
            expect(textAreaElem.value).toEqual('Write a palindrome program in C#.');
        });

        it('Width checking', () => {
            aiAssistView = new AIAssistView({
                width: '700px'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.width).toEqual('700px');
        });

        it('Height checking', () => {
            aiAssistView = new AIAssistView({
                height: '700px'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.height).toEqual('700px');
        });

        it('Promptplaceholder checking', () => {
            aiAssistView = new AIAssistView({
                promptPlaceholder: 'Type your message here'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
            expect(textAreaElem.placeholder).toEqual('Type your message here');
        });

        it('Prompts prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
        });

        it('Prompts prop with response checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('I can help you with that.');
        });

        it('Prompt suggestions prop checking', () => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionElems: NodeList = aiAssistViewElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElems).not.toBeNull();
            expect(suggestionElems[0].textContent).toEqual('How can i assist you?');
            expect(suggestionElems[1].textContent).toEqual('Can i help you with something?');
        });

        it('Prompt suggestion header prop checking', () => {
            aiAssistView = new AIAssistView({
                promptSuggestionsHeader: 'Suggested prompts',
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionHeader: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions .e-suggestion-header');
            expect(suggestionHeader).not.toBeNull();
            expect(suggestionHeader.textContent).toEqual('Suggested prompts');
        });

        it('Toolbarsettings prop checking', () => {
            let isCancellableEvent: boolean = false;
            aiAssistView = new AIAssistView({
                toolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ],
                    itemClicked: (args: ToolbarItemClickedEventArgs) => {
                        args.cancel = isCancellableEvent;
                    }
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItem: HTMLElement = aiAssistViewElem.querySelector('.e-view-header .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
            expect(toolbarItem.classList.contains('e-user')).toEqual(true);
            toolbarItem.click();
            isCancellableEvent = true;
            toolbarItem.click();
        });

        it('Toolbarsettings prop without item clicked checking', () => {
            aiAssistView = new AIAssistView({
                toolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItem: HTMLElement = aiAssistViewElem.querySelector('.e-view-header .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
            expect(toolbarItem.classList.contains('e-user')).toEqual(true);
            toolbarItem.click();
        });

        it('Prompt toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                promptToolbarSettings: {
                    itemClicked: (args: ToolbarItemClickedEventArgs) => {
                        if (args.item.iconCss === 'e-icons e-copy') {
                            // (window.navigator as any).clipboard.writeText('How can i assist you?');
                        }
                    },
                    items: [
                        { iconCss: 'e-icons e-copy' },
                        { iconCss: 'e-icons e-edit' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            expect(copyItem.querySelector('button span').classList.contains('e-copy')).toEqual(true);
            copyItem.click();
            const editItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            expect(editItem.querySelector('button span').classList.contains('e-edit')).toEqual(true);
            editItem.click();
        });

        it('Response toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                responseToolbarSettings: {
                    itemClicked: (args: ToolbarItemClickedEventArgs) => {
                        if (args.item.iconCss === 'e-icons e-copy') {
                            // (window.navigator as any).clipboard.writeText('How can i assist you?');
                        }
                    },
                    items: [
                        { iconCss: 'e-icons e-copy' },
                        { iconCss: 'e-icons e-like' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            expect(copyItem.querySelector('button span').classList.contains('e-copy')).toEqual(true);
            copyItem.click();
            const likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(likeItem.querySelector('button span').classList.contains('e-like')).toEqual(true);
            likeItem.click();
        });

        it('Assist views checking', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Assist', name: 'AI Assistant', iconCss: 'e-icons e-bookmark' }
                ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const aiAssistViewHeaderELem: HTMLButtonElement = aiAssistView.element.querySelector('.e-view-header .e-assist-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('AI Assistant');
            const iconElem: HTMLElement = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-bookmark')).toEqual(true);
        });

        it('Assist view template checking', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Assist', name: 'AI Assistant', iconCss: 'e-icons e-bookmark', viewTemplate: '<div>Assist view</div>' }
                ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const aiAssistViewHeaderELem: HTMLButtonElement = aiAssistView.element.querySelector('.e-view-header .e-assist-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('AI Assistant');
            const iconElem: HTMLElement = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-bookmark')).toEqual(true);
            expect(aiAssistViewElem.querySelector('.e-view-content').textContent).toEqual('Assist view');
        });

        it('Assist view without name prop checking', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Assist' }
                ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const aiAssistViewHeaderELem: HTMLButtonElement = aiAssistView.element.querySelector('.e-view-header .e-assist-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('AI Assist');
            const iconElem: HTMLElement = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-assistview-icon')).toEqual(true);
        });

        it('Multiple views checking', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Assist', name: 'AI Assistant', iconCss: 'e-icons e-bookmark' },
                    { type: 'Custom', name: 'Notes', iconCss: 'e-icons e-level-4' }
                ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let aiAssistViewHeaderELem: HTMLButtonElement = aiAssistView.element.querySelector('.e-view-header .e-assist-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('AI Assistant');
            let iconElem: HTMLElement = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-bookmark')).toEqual(true);

            aiAssistViewHeaderELem = aiAssistView.element.querySelector('.e-view-header .e-custom-view-header button');
            expect(aiAssistViewHeaderELem).not.toBeNull();
            expect(aiAssistViewHeaderELem.textContent).toEqual('Notes');
            iconElem = aiAssistViewHeaderELem.querySelector('.e-btn-icon');
            expect(iconElem).not.toBeNull();
            expect(iconElem.classList.contains('e-icons')).toEqual(true);
            expect(iconElem.classList.contains('e-level-4')).toEqual(true);
        });

        it('Active view checking with property and by interacting', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Assist', name: 'AI Assistant', iconCss: 'e-icons e-bookmark' },
                    { type: 'Custom', name: 'Notes', iconCss: 'e-icons e-level-4', viewTemplate: '<div>Notes view</div>' }
                ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistView.activeView).toEqual(0);
            aiAssistView.activeView = 1;
            aiAssistView.dataBind();
            expect(aiAssistView.activeView).toEqual(1);
            const viewElem: HTMLElement = aiAssistViewElem.querySelector('.e-custom-view');
            expect(viewElem).not.toBeNull();
            expect(viewElem.textContent).toEqual('Notes view');
            (aiAssistView.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            expect(aiAssistView.activeView).toEqual(0);
            (aiAssistView.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
            expect(aiAssistView.activeView).toEqual(1);
        });

        it('Active view template checking', () => {
            aiAssistView = new AIAssistView({
                views: [
                    { type: 'Custom', name: 'Notes', iconCss: 'e-icons e-level-4', viewTemplate: '<div>Notes view</div>' },
                    { type: 'Assist', name: 'AI Assistant', iconCss: 'e-icons e-bookmark', viewTemplate: '<div>Assist Custom View</div>' }
                ],
                activeView: 0
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistView.activeView).toEqual(0);
            const viewElem: HTMLElement = aiAssistViewElem.querySelector('.e-assistview-content-section');
            expect(viewElem).not.toBeNull();
            expect(viewElem.textContent).toEqual('Assist Custom View');
        });

        it('ShowHeader prop checking', () => {
            aiAssistView = new AIAssistView({
                showHeader: false
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const headerElem: HTMLElement = aiAssistViewElem.querySelector('.e-view-header');
            expect(headerElem).not.toBeNull();
            expect(headerElem.hidden).toEqual(true);
        });

        it('Showclearbutton prop checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLTextAreaElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            // once fixed the prompt property not setting the value to textarea, remove the below line
            (textareaEle as any).ej2_instances[0].value = 'Explain about the Syncfusion product';
            expect(textareaEle).not.toBeNull();
            textareaEle.focus();
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                expect(clearBtnElem.classList.contains('e-clear-icon-hide')).toEqual(false);
                done();
            }, 0, done);
        });

        it('Prompt icon css checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                promptIconCss: 'e-icons e-user'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptIconElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-icon');
            expect(promptIconElem).not.toBeNull();
            expect(promptIconElem.classList.contains('e-icons')).toEqual(true);
            expect(promptIconElem.classList.contains('e-user')).toEqual(true);
        });

        it('Response icon css checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                responseIconCss: 'e-icons e-user'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptIconElem: HTMLElement = aiAssistViewElem.querySelector('.e-output-icon');
            expect(promptIconElem).not.toBeNull();
            expect(promptIconElem.classList.contains('e-icons')).toEqual(true);
            expect(promptIconElem.classList.contains('e-user')).toEqual(true);
        });

        it('CssClass checking', () => {
            aiAssistView = new AIAssistView({
                cssClass: 'e-custom'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.classList.contains('e-custom')).toEqual(true);
        });

        it('Rtl checking', () => {
            aiAssistView = new AIAssistView({
                enableRtl: false,
                toolbarSettings: {
                    items: [
                        { type: 'Input', template: 'Welcome User !', align: 'Right' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItem: HTMLElement = aiAssistViewElem.querySelector('.e-control .e-toolbar');
            expect(aiAssistViewElem.classList.contains('e-rtl')).toEqual(false);
            expect(toolbarItem.classList.contains('e-rtl')).toEqual(false);
            aiAssistView.enableRtl = true;
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-rtl')).toBe(true);
            expect(toolbarItem.classList.contains('e-rtl')).toBe(true);
        });

    });

    describe('Template - ', () => {
        const sTag: HTMLElement = createElement('script', { id: 'bannerTemplate', attrs: { type: 'text/x-template' } });
        sTag.innerHTML = '<div><h1>AI Assistant</h1><p>Your everyday AI companion</p></div>';

        const sTag1: HTMLElement = createElement('script', { id: 'footerTemplate', attrs: { type: 'text/x-template' } });
        sTag1.innerHTML = '<div><textarea></textarea><button>Generate</button></div>';

        const sTag2: HTMLElement = createElement('script', { id: 'promptTemplate', attrs: { type: 'text/x-template' } });
        sTag2.innerHTML = '<div><label>You</label><div>${prompt}</div></div>';

        const sTag3: HTMLElement = createElement('script', { id: 'responseTemplate', attrs: { type: 'text/x-template' } });
        sTag3.innerHTML = '<div><label>Ai Assist</label><div>${response}</div></div>';

        const sTag4: HTMLElement = createElement('script', { id: 'promptSuggItemTemplate', attrs: { type: 'text/x-template' } });
        sTag4.innerHTML = '<b>${promptSuggestion}</b>';

        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Banner template checking', () => {
            document.body.appendChild(sTag);
            aiAssistView = new AIAssistView({
                bannerTemplate: '#bannerTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const bannerElem: HTMLElement = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('AI Assistant');
            expect(bannerElem.querySelector('p').textContent).toEqual('Your everyday AI companion');
        });

        it('Banner template for not compile case checking', () => {
            document.body.appendChild(sTag);
            aiAssistView = new AIAssistView({
                bannerTemplate: '#bannerTemplate'
            });
            aiAssistView.isReact = true;
            aiAssistView.appendTo(aiAssistViewElem);
            const bannerElem: HTMLElement = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('AI Assistant');
            expect(bannerElem.querySelector('p').textContent).toEqual('Your everyday AI companion');
        });

        it('Banner template - function template checking', () => {
            aiAssistView = new AIAssistView({
                bannerTemplate: () => '<div><h1>AI Assistant</h1><p>Your everyday AI companion</p></div>'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const bannerElem: HTMLElement = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('AI Assistant');
            expect(bannerElem.querySelector('p').textContent).toEqual('Your everyday AI companion');
        });

        it('Footer template checking', () => {
            document.body.appendChild(sTag1);
            aiAssistView = new AIAssistView({
                footerTemplate: '#footerTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            expect(footerElem.querySelector('textarea')).not.toBeNull();
            expect(footerElem.querySelector('button').textContent).toEqual('Generate');
        });

        it('Prompt item template checking', () => {
            document.body.appendChild(sTag2);
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?'
                }],
                promptItemTemplate: '#promptTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-container div');
            expect(promptElem).not.toBeNull();
            expect(promptElem.querySelector('label').textContent).toEqual('You');
            expect(promptElem.querySelector('div').textContent).toEqual('How can i assist you?');
        });

        it('Response item template checking', () => {
            document.body.appendChild(sTag3);
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                responseItemTemplate: '#responseTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            // having issue, once fixed needto uncomment the below lines
            // const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            // expect(responseElem).not.toBeNull();
            // expect(responseElem.querySelector('label').textContent).toEqual('Ai Assist');
            // expect(responseElem.querySelector('div').textContent).toEqual('I can help you with that.');
        });

        it('Prompt suggestion item template checking', () => {
            document.body.appendChild(sTag4);
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ],
                promptSuggestionItemTemplate: '#promptSuggItemTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionElems: NodeList = aiAssistViewElem.querySelectorAll('.e-suggestions li');
            expect(suggestionElems).not.toBeNull();
            expect((suggestionElems[0] as HTMLElement).querySelector('b').textContent).toEqual('How can i assist you?');
            expect((suggestionElems[1] as HTMLElement).querySelector('b').textContent).toEqual('Can i help you with something?');
        });

    });

    describe('API -', () => {

        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Prompt checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.prompt = 'Write a palindrome program in C#.';
            aiAssistView.dataBind();
            const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
            setTimeout(() => {
                expect(textAreaElem.value).toEqual('Write a palindrome program in C#.');
                done();
            }, 0, done);
        });

        it('Width checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.width = '700px';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.style.width).toEqual('700px');
        });

        it('Height checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.height = '700px';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.style.height).toEqual('700px');
        });

        it('Promptplaceholder checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.promptPlaceholder = 'Type your message here';
            aiAssistView.dataBind();
            setTimeout(() => {
                const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
                expect(textAreaElem.placeholder).toEqual('Type your message here');
                done();
            }, 0, done);
        });

        it('Prompts prop checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.prompts = [ {
                prompt: 'How can i assist you?'
            }];
            aiAssistView.dataBind();
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
        });

        it('Prompts prop with response checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.prompts = [ {
                prompt: 'How can i assist you?',
                response: 'I can help you with that.'
            }];
            aiAssistView.dataBind();
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('I can help you with that.');
        });

        // it('Prompts prop false cases checking', () => {
        //     aiAssistView = new AIAssistView({
        //         views: [
        //             { type: 'Assist', viewTemplate: '<div>Assist view</div>' }
        //         ]
        //     });
        //     aiAssistView.appendTo(aiAssistViewElem);
        //     aiAssistView.prompts = [ {
        //         prompt: 'How can i assist you?'
        //     }];
        //     aiAssistView.dataBind();
        //     const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
        //     expect(promptElem).toBeNull();
        // });

        it('Prompt suggestions prop checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
            aiAssistView.dataBind();
            let suggestionElems: NodeList = aiAssistViewElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElems).not.toBeNull();
            expect(suggestionElems[0].textContent).toEqual('How can i assist you?');
            expect(suggestionElems[1].textContent).toEqual('Can i help you with something?');
            aiAssistView.promptSuggestions = [ 'Suggestion 1', 'Suggestion 2' ];
            aiAssistView.dataBind();
            suggestionElems = aiAssistViewElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElems).not.toBeNull();
            expect(suggestionElems[0].textContent).toEqual('Suggestion 1');
            expect(suggestionElems[1].textContent).toEqual('Suggestion 2');
            aiAssistView.promptSuggestions = [ 'Suggestion 3', 'Suggestion 4' ];
            aiAssistView.dataBind();
            suggestionElems = aiAssistViewElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElems).not.toBeNull();
            expect(suggestionElems[0].textContent).toEqual('Suggestion 3');
            expect(suggestionElems[1].textContent).toEqual('Suggestion 4');
        });

        it('Prompt suggestion header prop checking', () => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.promptSuggestionsHeader = 'Suggested prompts';
            aiAssistView.dataBind();
            const suggestionHeader: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions .e-suggestion-header');
            expect(suggestionHeader).not.toBeNull();
            expect(suggestionHeader.textContent).toEqual('Suggested prompts');
            aiAssistView.promptSuggestionsHeader = 'Frequently used prompts';
            aiAssistView.dataBind();
            expect(suggestionHeader.textContent).toEqual('Frequently used prompts');
        });

        it('Toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.toolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-user', align: 'Right' }
                ]
            };
            aiAssistView.dataBind();
            // Facing issue with onproperty change, uncomment the below lines once fixed
            // const toolbarItem: HTMLElement = aiAssistViewElem.querySelector('.e-view-header .e-toolbar-right .e-icons');
            // expect(toolbarItem).not.toBeNull();
            // expect(toolbarItem.classList.contains('e-user')).toEqual(true);
        });

        it('Prompt toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.promptToolbarSettings = {
                itemClicked: (args: ToolbarItemClickedEventArgs) => {
                    if (args.item.iconCss === 'e-icons e-copy') {
                        // (window.navigator as any).clipboard.writeText('How can i assist you?');
                    }
                },
                items: [
                    { iconCss: 'e-icons e-copy' },
                    { iconCss: 'e-icons e-edit' }
                ]
            };
            aiAssistView.dataBind();
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            expect(copyItem.querySelector('button span').classList.contains('e-copy')).toEqual(true);
            copyItem.click();
            const editItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            expect(editItem.querySelector('button span').classList.contains('e-edit')).toEqual(true);
            editItem.click();
        });

        it('Response toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.responseToolbarSettings = {
                itemClicked: (args: ToolbarItemClickedEventArgs) => {
                    if (args.item.iconCss === 'e-icons e-copy') {
                        // (window.navigator as any).clipboard.writeText('How can i assist you?');
                    }
                },
                items: [
                    { iconCss: 'e-icons e-copy' },
                    { iconCss: 'e-icons e-like' }
                ]
            };
            aiAssistView.dataBind();
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            expect(copyItem.querySelector('button span').classList.contains('e-copy')).toEqual(true);
            copyItem.click();
            const likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(likeItem.querySelector('button span').classList.contains('e-like')).toEqual(true);
            likeItem.click();
        });

        it('ShowHeader prop checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.showHeader = false;
            aiAssistView.dataBind();
            const headerElem: HTMLElement = aiAssistViewElem.querySelector('.e-view-header');
            expect(headerElem).not.toBeNull();
            expect(headerElem.hidden).toEqual(true);
        });

        it('Showclearbutton prop checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.showClearButton = true;
            aiAssistView.dataBind();
            const textareaEle: HTMLTextAreaElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            // once fixed the prompt property not setting the value to textarea, remove the below line
            (textareaEle as any).ej2_instances[0].value = 'Explain about the Syncfusion product';
            textareaEle.focus();
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                expect(clearBtnElem.classList.contains('e-clear-icon-hide')).toEqual(false);
                done();
            }, 0, done);
        });

        it('Prompt icon css checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.prompts = [ {
                prompt: 'How can i assist you?'
            }];
            aiAssistView.dataBind();
            aiAssistView.promptIconCss = 'e-icons e-user';
            aiAssistView.dataBind();
            const promptIconElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-icon');
            expect(promptIconElem).toBeNull();
            //expect(promptIconElem).not.toBeNull();
            //expect(promptIconElem.classList.contains('e-icons')).toEqual(true);
            //expect(promptIconElem.classList.contains('e-user')).toEqual(true);
        });

        it('Response icon css checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.prompts = [ {
                prompt: 'How can i assist you?',
                response: 'I can help you with that.'
            }];
            aiAssistView.dataBind();
            aiAssistView.responseIconCss = 'e-icons e-user';
            aiAssistView.dataBind();
            const promptIconElem: HTMLElement = aiAssistViewElem.querySelector('.e-output-icon');
            expect(promptIconElem).not.toBeNull();
            expect(promptIconElem.classList.contains('e-icons')).toEqual(true);
            expect(promptIconElem.classList.contains('e-user')).toEqual(true);
        });

        it('CssClass checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.cssClass = 'e-custom';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-custom')).toEqual(true);
            aiAssistView.cssClass = 'e-custom1';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-custom')).toEqual(false);
            expect(aiAssistViewElem.classList.contains('e-custom1')).toEqual(true);
            aiAssistView.cssClass = '';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-custom1')).toEqual(false);
        });

        it('Rtl checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.enableRtl = true;
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-rtl')).toEqual(true);
            aiAssistView.enableRtl = false;
            aiAssistView.dataBind();
            expect(aiAssistViewElem.classList.contains('e-rtl')).toEqual(false);
        });

        it('Locale checking', () => {
            L10n.load({
                'fr-BE': {
                   'aiassistview': {
                        'stopResponseText': "Arrêtez de répondre"
                    }
                }
            });
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.querySelector('.e-stop-response-text').textContent).toEqual('Stop Responding');
            aiAssistView.locale = 'fr-BE';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.querySelector('.e-stop-response-text').textContent).toEqual('Arrêtez de répondre');
        });

    });

    describe('Methods - ', () => {
        let interActiveChatBase: any;
        let element: HTMLElement
        beforeEach(() => {
            element = createElement('div', { id: 'interactiveChatBase' });
            document.body.appendChild(element);
            interActiveChatBase = new InterActiveChatBase();
            interActiveChatBase.appendTo(element);
        });      
        afterEach(() => {
            if (aiAssistView && !aiAssistView.isDestroyed) {
                aiAssistView.destroy();
            }
            if (element) {
                document.body.removeChild(element);
            };
        });

        it('destroy checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo('#aiAssistViewComp');
            aiAssistView.destroy();
            expect(aiAssistViewElem.classList.contains('e-aiassist-view')).toEqual(false);
            expect(aiAssistViewElem.classList.contains('e-control')).toEqual(false);
            expect(aiAssistViewElem.classList.contains('e-lib')).toEqual(false);
        });

        it('getModuleName checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo('#aiAssistViewComp');
            expect(((<any>aiAssistViewElem).ej2_instances[0] as any).getModuleName()).toEqual('aiassistview');
            expect(interActiveChatBase.getModuleName()).toEqual('interactivechatBase');
        });

        it('getPersistData checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo('#aiAssistViewComp');
            expect(((<any>aiAssistViewElem).ej2_instances[0] as any).getPersistData()).toEqual('{}');
            expect(interActiveChatBase.getPersistData()).toEqual('{}');
        });

        it('getDirective  checking', () => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo('#aiAssistViewComp');
            expect(((<any>aiAssistViewElem).ej2_instances[0] as any).getDirective()).toEqual('EJS-AIASSISTVIEW');
        });

        it('Prompt methods checking', (done: DoneFn) => {
            const proxyDone: DoneFn = done;
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                    const promptElem: HTMLElement = aiAssistViewElem.querySelectorAll('.e-prompt-text')[2] as HTMLElement;
                    expect(promptElem).not.toBeNull();
                    expect(promptElem.textContent).toEqual('Write a palindrome program in C#.');
                    const responseElem: HTMLElement = aiAssistViewElem.querySelectorAll('.e-output')[2] as HTMLElement;
                    expect(responseElem).not.toBeNull();
                    expect(responseElem.textContent).toEqual('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                    aiAssistView.executePrompt(''); // to check the promptRequest event should be not triggered
                    proxyDone();
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            //aiAssistView.prompt = 'test prompt';
            aiAssistView.addPromptResponse({ prompt: 'test prompt', response: 'test response' });
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('test prompt');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('test response');
            aiAssistView.addPromptResponse({ prompt: 'test prompt1', response: 'test response1', isResponseHelpful: true });
            const promptElem1: HTMLElement = aiAssistViewElem.querySelectorAll('.e-prompt-text')[1] as HTMLElement;
            expect(promptElem1).not.toBeNull();
            expect(promptElem1.textContent).toEqual('test prompt1');
            const responseElem1: HTMLElement = aiAssistViewElem.querySelectorAll('.e-output')[1] as HTMLElement;
            expect(responseElem1).not.toBeNull();
            expect(responseElem1.textContent).toEqual('test response1');
            aiAssistView.executePrompt('Write a palindrome program in C#.');
        });
    });

    describe('Null - ', () => {

        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Width checking', () => {
            aiAssistView = new AIAssistView({
                width: null
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.width).toEqual('100%');
        });

        it('Height checking', () => {
            aiAssistView = new AIAssistView({
                height: null
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.height).toEqual('100%');
        });
    });

    describe('UI interaction - ', () => {

        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Send prompt checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = [ 'Suggestion 1' ];
                    aiAssistView.dataBind();
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLTextAreaElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            (textareaEle as any).ej2_instances[0].value = 'Write a palindrome program in C#.';
            (textareaEle as any).ej2_instances[0].dataBind();
            const keyEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            (textareaEle as any).ej2_instances[0].inputHandler(keyEvent);
            const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
            sendBtnElem.click();
            setTimeout(() => {
                const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
                expect(promptElem).not.toBeNull();
                expect(promptElem.textContent).toEqual('Write a palindrome program in C#.');
                const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                expect(responseElem).not.toBeNull();
                expect(responseElem.textContent).toEqual('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                done();
            }, 100, done);
        });

        it('Prompt toolbar items checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const editItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            editItem.click();
            setTimeout(() => {
                const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
                expect(textAreaElem.value).toEqual('How can i assist you?');
                const copyItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
                expect(copyItem).not.toBeNull();
                copyItem.click();
                setTimeout(() => {
                    // (window.navigator as any).clipboard.readText()
                    //     .then((clipText: string) => {
                    //         expect(clipText).toEqual('How can i assist you?');
                    //         done();
                    //     });
                    done();
                }, 1500, done);
            }, 0, done);
        });

        it('Prompt toolbar items with suggestions checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const editItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            editItem.click();
            setTimeout(() => {
                const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
                expect(textAreaElem.value).toEqual('How can i assist you?');
                const copyItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
                expect(copyItem).not.toBeNull();
                copyItem.click();
                setTimeout(() => {
                    // (window.navigator as any).clipboard.readText()
                    //     .then((clipText: string) => {
                    //         expect(clipText).toEqual('How can i assist you?');
                    //         done();
                    //     });
                    done();
                }, 1500, done);
            }, 0, done);
        });

        it('Response toolbar items checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            const unlikeItem: HTMLElement = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(unlikeItem).not.toBeNull();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(null);
            likeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(true);
            unlikeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(false);
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();
            setTimeout(() => {
                // (window.navigator as any).clipboard.readText()
                //     .then((clipText: string) => {
                //         expect(clipText).toEqual('I can help you with that.');
                //         done();
                //     });
                done();
            }, 1500, done);
        });

        it('Response toolbar items clicked cancel checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                responseToolbarSettings: {
                    itemClicked: (args: ToolbarItemClickedEventArgs) => {
                        args.cancel = true;
                    }
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            const unlikeItem: HTMLElement = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(unlikeItem).not.toBeNull();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(null);
            likeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).not.toEqual(true);
            unlikeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).not.toEqual(false);
            let copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();
            copyItem = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item')[0].querySelector('button');
            const copyIconItem: HTMLElement = copyItem.querySelector('.e-btn-icon');
            expect(copyIconItem.classList.contains('e-assist-check')).toEqual(false);
            setTimeout(() => {
                (window.navigator as any).clipboard.readText()
                    .then((clipText: string) => {
                        expect(clipText).toEqual('I can help you with that.');
                        done();
                    });
                done();
            }, 1500, done);
        });

        it('Response toolbar rating interactions', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            let likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            let unlikeItem: HTMLElement = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(unlikeItem).not.toBeNull();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(null);
            likeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(true);
            unlikeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(false);
            toolbarItems = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            likeItem = (toolbarItems[1] as HTMLElement).querySelector('button');
            unlikeItem = (toolbarItems[2] as HTMLElement).querySelector('button');
            unlikeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(null);
            likeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(true);
            toolbarItems = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            likeItem = (toolbarItems[1] as HTMLElement).querySelector('button');
            unlikeItem = (toolbarItems[2] as HTMLElement).querySelector('button');
            likeItem.click();
            expect(aiAssistView.prompts[0].isResponseHelpful).toEqual(null);
        });

        it('Prompt suggestions checking', () => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ],
                promptRequest: (args: PromptRequestEventArgs) => {
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionElem: HTMLLIElement = aiAssistViewElem.querySelectorAll('.e-suggestion-list li')[0] as HTMLLIElement;
            expect(suggestionElem).not.toBeNull();
            suggestionElem.click();
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
        });

        it('Response code tag checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'Write a hellow workd program in c#',
                    response: `<pre><span class="e-icons e-code-copy e-assist-copy"></span><code class="csharp language-csharp">using System;

class HelloWorld
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}
</code></pre>`
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const codeCopyElem: HTMLElement = aiAssistViewElem.querySelector('.e-output pre .e-assist-copy');
            expect(codeCopyElem).not.toBeNull();
            codeCopyElem.click();
            setTimeout(() => {
                // (window.navigator as any).clipboard.readText()
                //     .then((clipText: string) => {
                //         expect(clipText).toEqual('I can help you with that.');
                //         done();
                //     });
                done();
            }, 1500, done);
        });

        it('Stop Responding click', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [
                    "How do I set daily goals in my work day?", 
                    "Steps to publish a e-book with marketing strategy"
                ],
                promptRequest: () => {
                    const stoprespondingElem: HTMLElement = aiAssistViewElem.querySelector('.e-stop-response');
                    expect(stoprespondingElem).not.toBeNull();
                    EventHandler.trigger(stoprespondingElem, 'click');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let suggestionsElem: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions');
            expect(suggestionsElem.hidden).toBe(false);
            const textareaEle: HTMLTextAreaElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            (textareaEle as any).ej2_instances[0].value = 'Write a palindrome program in C#.';
            (textareaEle as any).ej2_instances[0].dataBind();
            const keyEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            (textareaEle as any).ej2_instances[0].inputHandler(keyEvent);
            const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
            sendBtnElem.click();
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('Write a palindrome program in C#.');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).toBeNull();
            expect(suggestionsElem.hidden).toBe(true);
            aiAssistView.promptSuggestions = ["How do I prioritize tasks effectively?", "What tools or apps can help me prioritize tasks?"];
            aiAssistView.dataBind();
            expect(suggestionsElem.hidden).toBe(true);
            aiAssistView.prompts = [];
            aiAssistView.promptSuggestions = ["What tools or apps can help me prioritize tasks?"];
            aiAssistView.dataBind();
            suggestionsElem = aiAssistViewElem.querySelector('.e-suggestions');
            expect(suggestionsElem.hidden).toBe(false);
            expect(suggestionsElem.querySelector('li').innerText).toBe("What tools or apps can help me prioritize tasks?");
            done();
        });
    });

    describe('Key Action - ', () => {

        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Enter Key Action', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = [ 'Suggestion 1' ];
                    aiAssistView.dataBind();
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLTextAreaElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            (textareaEle as any).ej2_instances[0].value = 'Write a palindrome program in C#.';
            (textareaEle as any).ej2_instances[0].dataBind();
            const keyEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            (textareaEle as any).ej2_instances[0].inputHandler(keyEvent);
            const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
            keyEventArgs.key = 'Enter';
            (aiAssistView as any).keyHandler(keyEventArgs, 'footer');
            setTimeout(() => {
                expect(sendBtnElem.classList.contains('disabled')).toEqual(true);
                const promptElem: HTMLElement[] = Array.from(aiAssistViewElem.querySelectorAll('.e-prompt-text'));
                expect(promptElem.length).toEqual(1);
                aiAssistView.prompt = '';
                done();
            }, 100, done);
        });
    });
    describe('AIAssistView - Streaming support', () => {
        afterEach(() => {
            if (aiAssistView) aiAssistView.destroy();
        });
    
        it('should handle streaming response as string in promptRequest event', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    args.cancel = false;
                    aiAssistView.addPromptResponse('Partial response chunk ', false);
                    setTimeout(() => {
                        aiAssistView.addPromptResponse('Final response', true);
                        const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                        expect(responseElem.textContent).not.toContain('Partial response chunk');
                        expect(responseElem.textContent).toContain('Final response');
                        done();
                    }, 50);
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.executePrompt('Stream this prompt');
        });
    
        it('should handle streaming response as string on instance method call', (done: DoneFn) => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.executePrompt('Stream this prompt');
    
            aiAssistView.addPromptResponse('First part of streaming response', false);
            setTimeout(() => {
                aiAssistView.addPromptResponse('Second part of streaming response', false);
                setTimeout(() => {
                    aiAssistView.addPromptResponse('End of stream', true);
                    const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                    expect(responseElem.textContent).not.toContain('First part of streaming response');
                    expect(responseElem.textContent).not.toContain('Second part of streaming response');
                    expect(responseElem.textContent).toContain('End of stream');
                    done();
                }, 50);
            }, 50);
        });
    
        it('should handle object input to addPromptResponse as chunk', (done: DoneFn) => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.executePrompt('Stream this prompt');
            
            aiAssistView.addPromptResponse({ prompt: 'Stream this prompt', response: 'Partial', isResponseHelpful: null }, false);
            
            setTimeout(() => {
                const responseItem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                expect(responseItem.textContent).toContain('Partial');
                
                aiAssistView.addPromptResponse({ prompt: 'Stream this prompt', response: ' Complete', isResponseHelpful: null }, true);
                
                setTimeout(() => {
                    expect(responseItem.textContent).not.toContain('Partial Complete');
                    expect(responseItem.textContent).toContain(' Complete');
                    done();
                }, 50);
            }, 50);
        });

        it('check suggestion element on edit icon click', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [{
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                promptSuggestions: ['How can i assist you?', 'Can i help you with something?'],
                promptRequest: (args: PromptRequestEventArgs) => {
                    args.cancel = false;
                    setTimeout(() => {
                        aiAssistView.addPromptResponse('Partial response chunk ', false);
                        aiAssistView.addPromptResponse('Final response', true);
                        const suggestionsElem: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions');
                        const responseElems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-output');
                        expect(responseElems[1].textContent).toContain('Final response');
                        expect(suggestionsElem.hidden).toBe(false);
                        done();
                    }, 50);
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionsElem: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions');
            expect(suggestionsElem.hidden).toBe(false);
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const editItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            editItem.click();
            setTimeout(() => {
                const textAreaElem: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-footer textarea');
                expect(textAreaElem.value).toEqual('How can i assist you?');
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                sendBtnElem.click();
                expect(suggestionsElem.hidden).toBe(true);
            }, 100);
        });
    });
});
