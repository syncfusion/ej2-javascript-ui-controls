
import { createElement, EventHandler, isNullOrUndefined, L10n, remove, setCulture } from "@syncfusion/ej2-base";
import { AIAssistView, PromptRequestEventArgs } from "../../src/ai-assistview/index";
import { ToolbarItemClickedEventArgs } from '../../src/interactive-chat-base/index';
import { InterActiveChatBase } from '../../src/interactive-chat-base/index';
import { FileInfo, Uploader } from "@syncfusion/ej2-inputs";

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
            const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
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
            const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
            expect(textAreaElem.innerText).toBe('Write a palindrome program in C#.');
        });

        it('Width checking', () => {
            aiAssistView = new AIAssistView({
                width: '700px'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.width).toEqual('700px');
        });
        it('Width dynamic update checking', () => {
            aiAssistView = new AIAssistView({
                width: '700px'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.width).toEqual('700px');
            aiAssistView.width = '600px';
            aiAssistView.dataBind();
            expect(aiAssistViewElem.style.width).toBe('600px');
        });
        it('Height checking', () => {
            aiAssistView = new AIAssistView({
                height: '700px'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            expect(aiAssistViewElem.style.height).toEqual('700px');
        });

        it('Promptplaceholder checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptPlaceholder: 'Type your message here'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = '';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(textareaEle.getAttribute('placeholder')).toEqual('Type your message here');
                done();
            }, 450, done);
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

        it('Toolbarsettings tabIndex prop checking', () => {
            aiAssistView = new AIAssistView({
                toolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 },
                        { iconCss: 'e-icons e-people', align: 'Right', tabIndex: 2 }
                    ],
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(4);
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[2].children[0].getAttribute('tabindex')).toEqual('2');
        });

        it('Toolbarsettings dynamic tabindex value checking', () => {
            aiAssistView = new AIAssistView({
                toolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarElement: HTMLDivElement = aiAssistViewElem.querySelector('.e-toolbar');
            let toolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(3);
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('-1');
            aiAssistView.toolbarSettings = {
                items: [{ iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 }, { iconCss: 'e-icons e-folder', align: 'Right', tabIndex: 2 }],
            };
            aiAssistView.dataBind();
            (toolbarElement as any).ej2_instances[0].dataBind();
            toolbarItems = aiAssistViewElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(5);
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('-1');
            expect(toolbarItems[2].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[3].children[0].getAttribute('tabindex')).toEqual('2');
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
                        { iconCss: 'e-icons e-copy', tabIndex: 1 },
                        { iconCss: 'e-icons e-edit', tabIndex: 2 }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            // tabIndex value check
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
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
                        { iconCss: 'e-icons e-copy', tabIndex: 1 },
                        { iconCss: 'e-icons e-like', tabIndex: 2 }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            // tabIndex value check
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            expect(copyItem.querySelector('button span').classList.contains('e-copy')).toEqual(true);
            copyItem.click();
            const likeItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(likeItem.querySelector('button span').classList.contains('e-like')).toEqual(true);
            likeItem.click();
        });

        it('Custom Response toolbarsettings prop checking', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                responseToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-like' },
                        { iconCss: 'e-icons e-assist-copy' },
                        { iconCss: 'e-icons e-assist-dislike' },
                        { iconCss: 'e-icons e-stop' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let toolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            let likeItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            let disLikeItem: HTMLElement = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem).not.toBeNull();
            expect(disLikeItem).not.toBeNull();
            expect(disLikeItem.querySelector('button span').classList.contains('e-assist-dislike')).toEqual(true);
            expect(likeItem.querySelector('button span').classList.contains('e-assist-like')).toEqual(true);
            likeItem.click();
            toolbarItems = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            likeItem = (toolbarItems[0] as HTMLElement).querySelector('button');
            disLikeItem = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem.querySelector('button span').classList.contains('e-assist-like-filled')).toEqual(true);
            expect(disLikeItem.querySelector('button span').classList.contains('e-assist-dislike')).toEqual(true);
            disLikeItem.click();
            toolbarItems = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            likeItem = (toolbarItems[0] as HTMLElement).querySelector('button');
            disLikeItem = (toolbarItems[2] as HTMLElement).querySelector('button');
            expect(likeItem.querySelector('button span').classList.contains('e-assist-like')).toEqual(true);
            expect(disLikeItem.querySelector('button span').classList.contains('e-assist-dislike-filled')).toEqual(true);
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

        it('Banner template dynamic change checking', () => {
            document.body.appendChild(sTag);
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.bannerTemplate = '#bannerTemplate';
            aiAssistView.dataBind();
            const bannerElem: HTMLElement = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('AI Assistant');
            expect(bannerElem.querySelector('p').textContent).toEqual('Your everyday AI companion');
        });

        it('should dynamically change the banner template', () => {
            document.body.appendChild(sTag);
            aiAssistView = new AIAssistView({
                bannerTemplate: '#bannerTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let bannerElem: HTMLElement = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('AI Assistant');
            expect(bannerElem.querySelector('p').textContent).toEqual('Your everyday AI companion');
            aiAssistView.bannerTemplate = '<h1>ChatGPT AssistView</h1><p>Lets look into the AI World</p>';
            aiAssistView.dataBind();
            bannerElem = aiAssistViewElem.querySelector('.e-banner-view');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('ChatGPT AssistView');
            expect(bannerElem.querySelector('p').textContent).toEqual('Lets look into the AI World');
        });

        it('Prompt suggestion item template dynamic checking', () => {
            document.body.appendChild(sTag4);
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ],
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.promptSuggestionItemTemplate =  '#promptSuggItemTemplate';
            aiAssistView.dataBind();
            const suggestionElems: NodeList = aiAssistViewElem.querySelectorAll('.e-suggestions li');
            expect(suggestionElems).not.toBeNull();
            expect((suggestionElems[0] as HTMLElement).querySelector('b').textContent).toEqual('How can i assist you?');
            expect((suggestionElems[1] as HTMLElement).querySelector('b').textContent).toEqual('Can i help you with something?');
        });

        it('should dynamically change the prompt suggestion item template', () => {
            document.body.appendChild(sTag4);
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ],
                promptSuggestionItemTemplate :  '#promptSuggItemTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let suggestionElems: NodeList = aiAssistViewElem.querySelectorAll('.e-suggestions li');
            expect(suggestionElems).not.toBeNull();
            expect((suggestionElems[0] as HTMLElement).querySelector('b').textContent).toEqual('How can i assist you?');
            expect((suggestionElems[1] as HTMLElement).querySelector('b').textContent).toEqual('Can i help you with something?');
            sTag4.innerHTML = '<h1>${promptSuggestion}</h1>';
            aiAssistView.promptSuggestionItemTemplate = '';
            aiAssistView.dataBind();
            aiAssistView.promptSuggestionItemTemplate =  '#promptSuggItemTemplate';
            aiAssistView.dataBind();
            suggestionElems = aiAssistViewElem.querySelectorAll('.e-suggestions li');
            expect(suggestionElems).not.toBeNull();
            expect((suggestionElems[0] as HTMLElement).querySelector('h1').textContent).toEqual('How can i assist you?');
            expect((suggestionElems[1] as HTMLElement).querySelector('h1').textContent).toEqual('Can i help you with something?');
        });

        it('Footer template dynamic checking', () => {
            document.body.appendChild(sTag1);
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.footerTemplate = '#footerTemplate';
            aiAssistView.dataBind();
            const footerElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            expect(footerElem.querySelector('textarea')).not.toBeNull();
            expect(footerElem.querySelector('button').textContent).toEqual('Generate');
        });

        it('should dynamically change the footer template', () => {
            document.body.appendChild(sTag1);
            aiAssistView = new AIAssistView({
                footerTemplate : '#footerTemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.footerTemplate = '';
            aiAssistView.dataBind();
            const footerElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            expect(footerElem.querySelector('textarea')).not.toBeNull();
            const sendBtnElem: HTMLButtonElement = footerElem.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
        });

        it ('Footer template should toggle send icon into stop response icon', function(done){
            const template = createElement('script', { id: 'footertemplate', attrs: { type: 'text/x-template' } });
            template.innerHTML = '<div><textarea></textarea><span class="e-icons e-assist-send"></span></div>';
            document.body.appendChild(template);
            aiAssistView = new AIAssistView({
                footerTemplate: '#footertemplate'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            const textarea: HTMLElement = footerElem.querySelector('textarea');
            expect(textarea).not.toBeNull();
            const sendBtnElem: HTMLElement = footerElem.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            textarea.innerText = 'Hi this is a prompt';
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            setTimeout(function () {
                aiAssistView.executePrompt(textarea.textContent);
                textarea.innerText = "";
                setTimeout(function () {
                    var stopResponseBtn: HTMLElement = footerElem.querySelector('.e-assist-stop');
                    expect(stopResponseBtn).not.toBeNull();
                    stopResponseBtn.click();
                    done();
                }, 200);
            }, 600);
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
            const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
            setTimeout(() => {
                expect(textAreaElem.innerText).toBe('Write a palindrome program in C#.');
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
                const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
                expect(textAreaElem.getAttribute('placeholder')).toEqual('Type your message here');
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
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Explain about the Syncfusion product';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                done();
            }, 450, done);
        });

        it('Showclearbutton prop dynamic update', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.showClearButton = true;
            aiAssistView.dataBind();
            aiAssistView.showClearButton = false;
            aiAssistView.dataBind();
            const clearBtn: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
            expect(clearBtn).toBeNull();
            aiAssistView.showClearButton = true;
            aiAssistView.dataBind();
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Explain about the Syncfusion product';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                done();
            }, 450, done);
        });

        it('Clear button click action checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true,
                prompt: 'Explain about the Syncfusion product'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                clearBtnElem.click();
                expect(textareaEle.innerText).toEqual('');
                done();
            }, 450, done);
        });

        it('Input event with clear button and send icon target', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true,
                prompt: 'Test prompt'
            });
            aiAssistView.appendTo(aiAssistViewElem);
    
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'New prompt input';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
    
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                const toolbarItems: NodeListOf<HTMLElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
                expect(toolbarItems[0].title).toBe('Clear');
                expect(toolbarItems[0].classList.contains('e-hidden')).toBe(false);
                const sendBtnElem: HTMLButtonElement = aiAssistViewElem.querySelector('.e-footer .e-assist-send.e-icons');
                const blurEvent: FocusEvent = new FocusEvent('blur', { relatedTarget: sendBtnElem });
                textareaEle.blur()
                textareaEle.dispatchEvent(blurEvent);
                setTimeout(() => {
                    expect(toolbarItems[0].title).toBe('Clear');
                    expect(toolbarItems[0].classList.contains('e-hidden')).toBe(true);
                    done();
                }, 0);
            }, 450);
        });
    
        it('Input event with clear button and no target', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true,
                prompt: 'Test prompt'
            });
            aiAssistView.appendTo(aiAssistViewElem);
    
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'New prompt input';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                const toolbarItems: NodeListOf<HTMLElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
                expect(toolbarItems[0].title).toBe('Clear');
                expect(toolbarItems[0].classList.contains('e-hidden')).toBe(false);
                textareaEle.blur();
                const blurEvent: FocusEvent = new FocusEvent('blur', { relatedTarget: null });
                textareaEle.dispatchEvent(blurEvent);
                setTimeout(() => {
                    expect(toolbarItems[0].title).toBe('Clear');
                    expect(toolbarItems[0].classList.contains('e-hidden')).toBe(true);
                    done();
                }, 0);
            }, 450);
        });

        it('should remove focus when other than footer is focused', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true,
                prompts: [{
                    prompt: 'Already sent prompt',
                    response: 'Response to prompt'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            const footerElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer');
            const promptItem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-container');

            textareaEle.focus();
            textareaEle.innerText = 'Some text to enable clear button';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                expect(footerElem.classList.contains('e-footer-focused')).toBe(true);

                const blurEvent: FocusEvent = new FocusEvent('blur', { bubbles: true, relatedTarget: promptItem });
                textareaEle.dispatchEvent(blurEvent);

                setTimeout(() => {
                    expect(footerElem.classList.contains('e-footer-focused')).toBe(false);
                    done();
                }, 0);
            }, 450);
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

        it('Hidden textarea value checking', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const hiddenTextarea: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
            expect(hiddenTextarea).not.toBeNull();
            expect(hiddenTextarea.value).toEqual('');
            aiAssistView.prompt = 'Write a palindrome program in C#.';
            aiAssistView.dataBind();
            const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
            setTimeout(() => {
                expect(textAreaElem.innerText).toBe('Write a palindrome program in C#.');
                expect(hiddenTextarea.value).toEqual('Write a palindrome program in C#.');
                done();
            }, 0, done);
        });

        it('Hidden textarea value on edit icon click', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const hiddenTextarea: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
            expect(hiddenTextarea).not.toBeNull();
            expect(hiddenTextarea.value).toEqual('');
            const toolbarItems: NodeList = aiAssistViewElem.querySelectorAll('.e-prompt-toolbar .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const editItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(editItem).not.toBeNull();
            editItem.click();
            setTimeout(() => {
                const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
                expect(textAreaElem.innerText).toEqual('How can i assist you?');
                expect(hiddenTextarea.value).toEqual('How can i assist you?');
                done();
            }, 0, done);
        });

        it('Hidden textarea value on Clear icon click', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                showClearButton: true,
                prompt: 'Explain about the Syncfusion product'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            const hiddenTextarea: HTMLTextAreaElement = aiAssistView.element.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
            expect(hiddenTextarea).not.toBeNull();
            expect(hiddenTextarea.value).toEqual('Explain about the Syncfusion product');
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const clearBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-assist-clear-icon');
                expect(clearBtnElem).not.toBeNull();
                clearBtnElem.click();
                expect(textareaEle.innerText).toEqual('');
                expect(hiddenTextarea.value).toEqual('');
                done();
            }, 450, done);
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
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
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
                }, 100);
            }, 450);
        });

        it('Send prompt with potential XSS content', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = ['Suggestion 1'];
                    aiAssistView.dataBind();
                    args.promptSuggestions = ['How can I assist you?', 'Can I help you with something?'];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            const originalAlert = window.alert;
            let alertCalled = false;
            window.alert = () => {
                alertCalled = true;
            };
            const maliciousPrompt = '<img src onerror=alert(1)>';
            textareaEle.innerText = maliciousPrompt;
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toBe(false);
                sendBtnElem.click();
                setTimeout(() => {
                    const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
                    expect(promptElem).not.toBeNull();
                    expect(promptElem.textContent).toBe('<img src onerror=alert(1)>'); 
                    expect(promptElem.querySelector('img')).toBeNull(); 
                    const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                    expect(responseElem).not.toBeNull();
                    expect(responseElem.textContent).toBe('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                    expect(alertCalled).toBe(false);
                    window.alert = originalAlert;
                    done();
                }, 100);
            }, 450);
        });

        it('Send prompt with iframe content', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = ['Suggestion 1'];
                    aiAssistView.dataBind();
                    args.promptSuggestions = ['How can I assist you?', 'Can I help you with something?'];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull('Textarea element should be present');
            const iframePrompt = '<iframe src=https://www.syncfusion.com></iframe>';
            textareaEle.innerText = iframePrompt;
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull('Send button should be present');
                if (sendBtnElem.classList.contains('disabled')) {
                    console.log('Send button is disabled, which is unexpected');
                }
                expect(sendBtnElem.classList.contains('disabled')).toBe(false, 'Send button should be enabled after input');
                sendBtnElem.click();
                setTimeout(() => {
                    const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
                    if (promptElem) {
                        expect(promptElem.textContent).toBe(iframePrompt, 'Prompt should display iframe content as text');
                        expect(promptElem.querySelector('iframe')).toBeNull('No iframe tag should be rendered');
                    }

                    const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                    if (responseElem) {
                        expect(responseElem.textContent).toBe(
                            'For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.',
                            'Response should match expected output'
                        );
                    }

                    done();
                }, 200);
            }, 600);
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
                const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
                expect(textAreaElem.innerText).toEqual('How can i assist you?');
                const copyItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
                expect(copyItem).not.toBeNull();
                copyItem.click();
                setTimeout(() => {
                    (window.navigator as any).clipboard.readText()
                        .then((clipText: string) => {
                            expect(clipText).toEqual('How can i assist you?');
                            done();
                        });
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
                const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
                expect(textAreaElem.innerText).toEqual('How can i assist you?');
                const copyItem: HTMLElement = (toolbarItems[1] as HTMLElement).querySelector('button');
                expect(copyItem).not.toBeNull();
                copyItem.click();
                setTimeout(() => {
                    (window.navigator as any).clipboard.readText()
                        .then((clipText: string) => {
                            expect(clipText).toEqual('How can i assist you?');
                            done();
                        });
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
                    const stoprespondingElem: HTMLElement = aiAssistViewElem.querySelector('.e-assist-stop');
                    expect(stoprespondingElem).not.toBeNull();
                    stoprespondingElem.click();
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let suggestionsElem: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions');
            expect(suggestionsElem.hidden).toBe(false);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
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
            }, 450, done);
        });

        it('should handle pasting content', (done: DoneFn) => {
            aiAssistView = new AIAssistView();
            aiAssistView.appendTo(aiAssistViewElem);
            
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            // Focus the textarea for selection to be in the correct place
            textareaEle.focus();
            // Simulate placing the cursor within the textarea
            const range: Range = document.createRange();
            range.selectNodeContents(textareaEle);
            range.collapse(false); // Set the cursor at the end of the content
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const clipboardItem = new DataTransfer();
            clipboardItem.setData('text/plain', 'Pasted content');
            const pasteEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(pasteEvent, 'clipboardData', {
                value: clipboardItem
            });
        
            textareaEle.dispatchEvent(pasteEvent);
            
            setTimeout(() => {
                expect(textareaEle.innerText).toBe('Pasted content');
                done();
            }, 450, done);
        });
        
        it('should handle undo action', (done: DoneFn) => {
            aiAssistView = new AIAssistView();
            aiAssistView.appendTo(aiAssistViewElem);
            
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            // check for undo action with no previous values in the stack
            const undoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
            (aiAssistView as any).footer.dispatchEvent(undoKeyEvent);
            textareaEle.innerText = 'Initial content';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
    
            setTimeout(() => {
                textareaEle.innerText = 'Changed content';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    (aiAssistView as any).footer.dispatchEvent(undoEvent);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toBe('Initial content');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });
        
        it('should handle redo action', (done: DoneFn) => {
            aiAssistView = new AIAssistView();
            aiAssistView.appendTo(aiAssistViewElem);
        
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            // check for redo action with no previous values in the stack
            const redoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
            (aiAssistView as any).footer.dispatchEvent(redoKeyEvent);
            textareaEle.innerText = 'Initial content';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
    
            setTimeout(() => {
                textareaEle.innerText = 'Changed content';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    (aiAssistView as any).footer.dispatchEvent(undoKeyEvent);
        
                    const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
                    (aiAssistView as any).footer.dispatchEvent(redoEvent);
        
                    setTimeout(() => {
                        expect(textareaEle.innerText).toBe('Changed content');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });

        it('should not call alert when undo/redo with Xss Word', (done: DoneFn) => {
            aiAssistView = new AIAssistView();
            aiAssistView.appendTo(aiAssistViewElem);

            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();

            // Stub alert to detect any unexpected execution
            const originalAlert = window.alert;
            let alertCalled = false;
            window.alert = () => { alertCalled = true; };

            const seed = 'Initial content';
            const malicious = '<img src onerror=alert(1)>';

            // Seed undo stack
            textareaEle.innerText = seed;
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                // Type malicious-like string
                textareaEle.innerText = malicious;
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));

                setTimeout(() => {
                    // Confirm no alert and no real <img> rendered
                    expect(alertCalled).toBe(false);
                    expect(textareaEle.innerText).toBe(malicious);
                    expect(textareaEle.querySelector('img')).toBeNull();

                    // Undo (Ctrl+Z)
                    const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true });
                    (aiAssistView as any).footer.dispatchEvent(undoEvent);

                    setTimeout(() => {
                        expect(alertCalled).toBe(false);
                        expect(textareaEle.innerText).toBe(seed);
                        expect(textareaEle.querySelector('img')).toBeNull();

                        // Redo (Ctrl+Y)
                        const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true });
                        (aiAssistView as any).footer.dispatchEvent(redoEvent);

                        setTimeout(() => {
                            expect(alertCalled).toBe(false);
                            expect(textareaEle.innerText).toBe(malicious);
                            expect(textareaEle.querySelector('img')).toBeNull();

                            // Restore alert
                            window.alert = originalAlert;
                            done();
                        }, 0);
                    }, 0);
                }, 400);
            }, 400);
        });

        it('should remove banner template when prompt is sent', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = [ 'Suggestion 1' ];
                    aiAssistView.dataBind();
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                },
                bannerTemplate: `<div class="ai-assist-banner">
                            <div class="e-icons e-assistview-icon"></div>
                            <h2>AI Assistance</h2>
                            <div class="ai-assist-banner-subtitle">Your everyday AI companion</div>
                        </div>`,
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            expect(aiAssistView.element.querySelector('.e-banner-view')).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
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
                    expect(aiAssistView.element.querySelector('.e-banner-view')).toBeNull();
                    done();
                }, 100);
            }, 450);
        });

        it('should remove banner template when prompt suggestions are sent', () => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [ 'How can i assist you?', 'Can i help you with something?' ],
                promptRequest: (args: PromptRequestEventArgs) => {
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                },
                bannerTemplate: `<div class="ai-assist-banner">
                            <div class="e-icons e-assistview-icon"></div>
                            <h2>AI Assistance</h2>
                            <div class="ai-assist-banner-subtitle">Your everyday AI companion</div>
                        </div>`,
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const suggestionElem: HTMLLIElement = aiAssistViewElem.querySelectorAll('.e-suggestion-list li')[0] as HTMLLIElement;
            expect(suggestionElem).not.toBeNull();
            expect(aiAssistView.element.querySelector('.e-banner-view')).not.toBeNull();
            suggestionElem.click();
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
            expect(aiAssistView.element.querySelector('.e-banner-view')).toBeNull();
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
        });

        it('should render banner template when prompts are cleared', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptRequest: (args: PromptRequestEventArgs) => {
                    aiAssistView.promptSuggestions = [ 'Suggestion 1' ];
                    aiAssistView.dataBind();
                    args.promptSuggestions = [ 'How can i assist you?', 'Can i help you with something?' ];
                    aiAssistView.addPromptResponse('For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services.');
                },
                bannerTemplate: `<div class="ai-assist-banner">
                            <div class="e-icons e-assistview-icon"></div>
                            <h2>AI Assistance</h2>
                            <div class="ai-assist-banner-subtitle">Your everyday AI companion</div>
                        </div>`,
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            expect(aiAssistView.element.querySelector('.e-banner-view')).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
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
                    expect(aiAssistView.element.querySelector('.e-banner-view')).toBeNull();
                    aiAssistView.prompts = [];
                    aiAssistView.dataBind();
                    expect(aiAssistView.element.querySelector('.e-banner-view')).not.toBeNull();
                    done();
                }, 100);
            }, 450);
        });

        it('should not render banner template when prompts are initialized', () => {
            aiAssistView = new AIAssistView({
                prompts: [ {
                    prompt: 'How can i assist you?',
                    response: 'I can help you with that.'
                }],
                bannerTemplate: () => '<div><h1>AI Assistant</h1><p>Your everyday AI companion</p></div>'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
            expect(promptElem).not.toBeNull();
            expect(promptElem.textContent).toEqual('How can i assist you?');
            const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
            expect(responseElem).not.toBeNull();
            expect(responseElem.textContent).toEqual('I can help you with that.');
            expect(aiAssistView.element.querySelector('.e-banner-view')).toBeNull();
            aiAssistView.prompts = [];
            aiAssistView.dataBind();
            expect(aiAssistView.element.querySelector('.e-banner-view')).not.toBeNull();
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
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const keyEvent: KeyboardEvent = new KeyboardEvent('keypress', { key: 'Enter' });
                textareaEle.dispatchEvent(keyEvent);
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                keyEventArgs.key = 'Enter';
                (aiAssistView as any).keyHandler(keyEventArgs, 'footer');
                setTimeout(() => {
                    const updatedSendBtn: HTMLElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                    expect(updatedSendBtn.classList.contains('disabled')).toEqual(true);
                    const promptElem: HTMLElement[] = Array.from(aiAssistViewElem.querySelectorAll('.e-prompt-text'));
                    expect(promptElem.length).toEqual(1);
                    aiAssistView.prompt = '';
                    done();
                }, 100);
            }, 450, done);
        });

        it('Stop Responding enter key action', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                promptSuggestions: [
                    "How do I set daily goals in my work day?", 
                    "Steps to publish a e-book with marketing strategy"
                ],
                promptRequest: () => {
                    const stopResponseBtn: HTMLElement = aiAssistViewElem.querySelector('.e-assist-stop');
                    expect(stopResponseBtn).not.toBeNull();
                    stopResponseBtn.focus();
                    const enterKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        bubbles: true
                    });
                    stopResponseBtn.dispatchEvent(enterKeyEvent);
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let suggestionsElem: HTMLElement = aiAssistViewElem.querySelector('.e-suggestions');
            expect(suggestionsElem.hidden).toBe(false);
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'Write a palindrome program in C#.';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                sendBtnElem.click();
                const promptElem: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-text');
                expect(promptElem).not.toBeNull();
                expect(promptElem.textContent).toEqual('Write a palindrome program in C#.');
                const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output');
                expect(responseElem).toBeNull();
                done();
            }, 450, done);
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
                    let footerToolbar: HTMLElement = aiAssistViewElem.querySelector('.e-content-footer');
                    expect(footerToolbar).toBeNull();
                    setTimeout(() => {
                        aiAssistView.addPromptResponse('Final response', true);
                        footerToolbar = aiAssistViewElem.querySelector('.e-content-footer');
                        expect(footerToolbar).not.toBeNull();
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
    
        it('Check the copy icon present in the pre tag', (done: DoneFn) => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.executePrompt('Stream this prompt');
    
            aiAssistView.addPromptResponse(`<pre><span class="e-icons e-code-copy e-assist-copy"></span><code class="csharp language-csharp">First part of streaming response</code></pre>`, false);
            setTimeout(() => {
                aiAssistView.addPromptResponse(`<pre><code class=\"csharp language-csharp\">Second part of streaming response</code></pre>`, false);
                setTimeout(() => {
                    aiAssistView.addPromptResponse(`<pre><code class="csharp language-csharp">End of stream</code></pre>`, true);
                    const codeCopyElem: HTMLElement = aiAssistViewElem.querySelector('.e-output pre .e-assist-copy');
                    expect(codeCopyElem).not.toBeNull();
                    done();
                }, 50);
            }, 50);
        });

        it('Copy icon checking when click the stop response before the response execute', (done: DoneFn) => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(aiAssistViewElem);
            aiAssistView.executePrompt('Print a Hello world C# Program');
            aiAssistView.addPromptResponse(`<pre><span class="e-icons e-code-copy e-assist-copy"></span><code class="csharp language-csharp">Hello</code></pre>`, false);
            setTimeout(() => {
                aiAssistView.addPromptResponse(`<pre><code class=\"csharp language-csharp\">World !</code></pre>`, false);
                const stoprespondingElem: HTMLElement = aiAssistViewElem.querySelector('.e-assist-stop');
                expect(stoprespondingElem).not.toBeNull();
                EventHandler.trigger(stoprespondingElem, 'click');
                setTimeout(() => {
                    aiAssistView.addPromptResponse(`<pre><code class="csharp language-csharp">Hello World !</code></pre>`, true);
                    const responseElem: HTMLElement = aiAssistViewElem.querySelector('.e-output-container');              
                    const codeCopyElem: HTMLElement = responseElem.querySelector('.e-output pre .e-assist-copy');
                    expect(codeCopyElem).not.toBeNull();
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
                const textAreaElem: HTMLDivElement = aiAssistView.element.querySelector('.e-footer .e-assist-textarea');
                expect(textAreaElem.innerText).toEqual('How can i assist you?');
                const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                sendBtnElem.click();
                expect(suggestionsElem.hidden).toBe(true);
            }, 100);
        });
    });

    describe('AIAssistView - Attachment Support', () => {

        let aiAssistView: AIAssistView;
        const aiAssistViewElem: HTMLElement = document.createElement('div');

        beforeEach(() => {
            aiAssistViewElem.id = 'aiAssistViewComp';
            document.body.appendChild(aiAssistViewElem);
        });

        afterEach(() => {
            if (aiAssistView && !aiAssistView.isDestroyed) {
            aiAssistView.destroy();
            document.body.removeChild(aiAssistViewElem);
            }
            aiAssistView = null;
        });

        it('should initialize with default attachment settings', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true
            });
            aiAssistView.appendTo(aiAssistViewElem);

            expect(aiAssistView.attachmentSettings.saveUrl).toBe('');
            expect(aiAssistView.attachmentSettings.removeUrl).toBe('');
            expect(aiAssistView.attachmentSettings.maxFileSize).toBe(2000000); // Default 30 MB
        });

        it('should upload a file successfully', (done: DoneFn) => {
            let isBeforeEventCalled: boolean = false;
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                },
                beforeAttachmentUpload: () => {
                    isBeforeEventCalled = true
                },
                attachmentUploadSuccess: (e) => {
                    // Check for successful upload
                    const uploadedFiles = (aiAssistView as any).uploadedFiles;
                    expect(uploadedFiles.length).toBe(1);
                    expect(uploadedFiles[0].name).toBe('last.txt');
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);
            const uploadObj: any = (aiAssistView as any).uploaderObj as Uploader;

            let sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(true);

            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);

            setTimeout(() => {
                expect(isBeforeEventCalled).toBe(true);
                setTimeout(() => {
                    expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                    done();
                }, 800);
            }, 800);

        });

        it('should handle attachment removal', (done: DoneFn) => {
            let isAttachmentRemoved: boolean = false;
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                },
                attachmentRemoved: () => {
                    expect((aiAssistView as any).uploadedFiles.length).toBe(0);
                    isAttachmentRemoved = true;
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            // Simulate adding a file to the uploader and uploading
            const uploadObj: any = (aiAssistView as any).uploaderObj as Uploader;
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                const uploadedFileItem = (aiAssistView as any).footer.querySelector('.e-assist-uploaded-file-item');
                const closeIcon = uploadedFileItem.querySelector('.e-icons.e-assist-clear-icon');
                closeIcon.click();
                setTimeout(() => {
                    expect(isAttachmentRemoved).toBe(true);
                    done();
                }, 800);
            }, 1000);
        });

        it('should handle attachment removal even if wrong removeUrl is provided', (done: DoneFn) => {
            let isAttachmentRemoved: boolean = false;
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'FileUploader/Remove'
                },
                attachmentRemoved: () => {
                    expect((aiAssistView as any).uploadedFiles.length).toBe(0);
                    isAttachmentRemoved = true;
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            // Simulate adding a file to the uploader and uploading
            const uploadObj: any = (aiAssistView as any).uploaderObj as Uploader;
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                const uploadedFileItem = (aiAssistView as any).footer.querySelector('.e-assist-uploaded-file-item');
                const closeIcon = uploadedFileItem.querySelector('.e-icons.e-assist-clear-icon');
                closeIcon.click();
                setTimeout(() => {
                    expect(isAttachmentRemoved).toBe(true);
                    done();
                }, 800);
            }, 1000);
        });

        it('should initialize with default attachment settings and handle dynamic property changes', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true
            });
            aiAssistView.appendTo(aiAssistViewElem);

            // Check initial values
            expect(aiAssistView.attachmentSettings.saveUrl).toBe('');
            expect(aiAssistView.attachmentSettings.removeUrl).toBe('');
            expect(aiAssistView.attachmentSettings.maxFileSize).toBe(2000000); // Default max file size
            expect(aiAssistView.attachmentSettings.maximumCount).toBe(10);
            expect(aiAssistView.attachmentSettings.allowedFileTypes).toBe('');

            // Change properties dynamically
            aiAssistView.attachmentSettings = {
                saveUrl: '/new/save/url',
                removeUrl: '/new/remove/url',
                maxFileSize: 500000,
                maximumCount: 5,
                allowedFileTypes: '.png'
            };
            aiAssistView.dataBind();

            // Check for updated values
            expect(aiAssistView.attachmentSettings.saveUrl).toBe('/new/save/url');
            expect(aiAssistView.attachmentSettings.removeUrl).toBe('/new/remove/url');
            expect(aiAssistView.attachmentSettings.maxFileSize).toBe(500000);
            expect(aiAssistView.attachmentSettings.maximumCount).toBe(5);
            expect(aiAssistView.attachmentSettings.allowedFileTypes).toBe('.png');
        });

        it('should dynamically change the enableAttachments property', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true
            });
            aiAssistView.appendTo(aiAssistViewElem);

            // Check initial state
            expect(aiAssistView.enableAttachments).toBe(true);
            expect(aiAssistViewElem.querySelector('.e-assist-attachment-icon')).not.toBeNull();

            // Change the enableAttachments property
            aiAssistView.enableAttachments = false;
            aiAssistView.dataBind();

            // Check for updated state
            expect(aiAssistView.enableAttachments).toBe(false);
            expect(aiAssistViewElem.querySelector('.e-assist-attachment-icon')).toBeNull();

            // Re-enable attachments
            aiAssistView.enableAttachments = true;
            aiAssistView.dataBind();

            // Check if attachments are enabled again
            expect(aiAssistView.enableAttachments).toBe(true);
            expect(aiAssistViewElem.querySelector('.e-assist-attachment-icon')).not.toBeNull();
        });

        it('should handle an attachment upload failure', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'js.syncfusion.comm'
                },
                attachmentUploadFailure: (e) => {
                   setTimeout(() => {
                        // Verification logic for upload failure
                        expect(e.file.name).toBe('sample.txt');
                        expect(e.operation).toBe('upload');
                        done();
                    });
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            // Simulate adding a file to the uploader and then trigger failure
            const uploader = (aiAssistView as any).uploaderObj;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploader.onSelectFiles(eventArgs);
        });

        it('should not sent attachedfiles when prompt is sent when an attachment upload failed', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'js.syncfusion.comm'
                },
                attachmentUploadFailure: (e) => {
                    // Verification logic for upload failure
                    expect(e.file.name).toBe('sample.txt');
                    expect(e.operation).toBe('upload');
                    CheckSendIconAfterFailure();
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            // Simulate adding a file to the uploader and then trigger failure
            const uploader = (aiAssistView as any).uploaderObj;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploader.onSelectFiles(eventArgs);

            function CheckSendIconAfterFailure() {
                const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
                expect(textareaEle).not.toBeNull();
                textareaEle.innerText = 'Explain about the Syncfusion product';
                const inputEvent: Event = new Event('input', { bubbles: true });
                textareaEle.dispatchEvent(inputEvent);
                setTimeout(() => {
                    const sendBtnElem: HTMLButtonElement = aiAssistView.element.querySelector('.e-footer .e-assist-send.e-icons');
                    expect(sendBtnElem).not.toBeNull();
                    sendBtnElem.click();
                    setTimeout(() => {
                        const promptContent: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-content');
                        expect(promptContent).not.toBeNull();
                        expect(promptContent.querySelector('.e-prompt-uploaded-files')).toBeNull();
                        done();
                    }, 350, done);
                }, 450);
            }

        });

        it('should upload an image with incorrect saveUrl for checking failure case', (done) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Saves',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Removes'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = aiAssistViewElem.querySelector('.e-assist-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-assist-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const progressBar: HTMLElement = attachedFile.querySelector('.e-assist-progress-bar') as HTMLElement;
                expect(progressBar).not.toBeNull();
                const progressFill: HTMLElement = progressBar.querySelector('.e-assist-progress-fill') as HTMLElement;
                const uploaderObj = (aiAssistView as any).uploaderObj;
                uploaderObj.trigger('failure', {
                    operation: 'upload',
                    file: { name: 'sample.png', size: file.size, type: file.type }
                });
                expect(progressFill.classList).toContain('e-assist-upload-failed');
                const sendIcon: HTMLElement = aiAssistViewElem.querySelector('.e-assist-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 500);
        });

        it('should handle an attachment upload failure and failure element display', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'js.syncfusion.comm',
                    maxFileSize: 0
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            // Simulate adding a file to the uploader and then trigger failure
            const uploader = (aiAssistView as any).uploaderObj;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploader.onSelectFiles(eventArgs);
            let failureElement = aiAssistView.element.querySelector('.e-upload-failure-alert');
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload failed: 1 file exceeded the maximum size');
            (failureElement.querySelector('.e-assist-clear-icon') as HTMLElement).click();
            failureElement = aiAssistView.element.querySelector('.e-upload-failure-alert');
            expect(failureElement).toBeNull();
        });

        it('should dynamically change the locale and verify the failure message text', () => {
            L10n.load({
                'de-DE': {
                    'aiassistview': {
                        fileSizeFailure: 'Upload fehlgeschlagen: Die Dateigröße ist zu groß'
                    }
                },
                'fr-BE': {
                    'aiassistview': {
                        fileSizeFailure: 'Échec du téléchargement : La taille du fichier est trop grande'
                    }
                }
            });
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'js.syncfusion.comm',
                    maxFileSize: 0
                },
                locale: 'de-DE'
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const uploader = (aiAssistView as any).uploaderObj;
            let fileObj: File = new File(["Nice One"], "sample.txt", { lastModified: 0, type: "override/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => {} };
            uploader.onSelectFiles(eventArgs);

            let failureElement = aiAssistView.element.querySelector('.e-upload-failure-alert');
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload fehlgeschlagen: Die Dateigröße ist zu groß');

            aiAssistView.locale = 'fr-BE';
            aiAssistView.dataBind();
            uploader.onSelectFiles(eventArgs);
            failureElement = aiAssistView.element.querySelector('.e-upload-failure-alert');
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Échec du téléchargement : La taille du fichier est trop grande');
        });

        it('should display localized failure message from its own locale setting', () => {
            // Load localization data required for the test
            L10n.load({
                'nl-nl': {
                    'aiassistview': {
                        'fileSizeFailure': 'Bestand is te groot`e'
                    },
                    "uploader": {
                        'invalidMaxFileSize': 'Bestand is te groot'
                    }
                }
            });
            setCulture('nl-nl');
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'js.syncfusion.com',
                    maxFileSize: 0 // Force a size failure
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const uploader = (aiAssistView as any).uploaderObj;
            let fileObj: File = new File(["Test content"], "testfile.txt", { lastModified: 0, type: "text/plain" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => {} };
            uploader.onSelectFiles(eventArgs);

            let failureElement = aiAssistView.element.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Bestand is te groot`e');
            setCulture('en-US');
        });

        it('should have attached files on initial rendering', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                },
                prompts: [{
                    prompt: "Can you help me create a summary of the latest trends in AI technology?",
                    response: `<div>Sure! Here are the latest trends in AI technology:
                                <ul>
                                    <li><strong>Generative AI:</strong> Improved models like GPT-4 enhance natural language processing.</li>
                                    <li><strong>AI in Healthcare:</strong> AI aids in diagnostics and personalized treatments.</li>
                                    <li><strong>Autonomous Systems:</strong> Self-driving cars and drones are advancing.</li>
                                    <li><strong>AI Ethics:</strong> Focus on bias, privacy, and accountability in AI.</li>
                                    <li><strong>Edge AI:</strong> Processing moves to local devices, boosting IoT.</li>
                                </ul>
                            </div>`,
                    attachedFiles: [
                        <any>{name: 'Nature', size: 500000, type: '.png'}
                    ]
                }]
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const promptContent: HTMLElement = aiAssistViewElem.querySelector('.e-prompt-content');
            expect(promptContent).not.toBeNull();
            const uploadedFileEle: HTMLElement = promptContent.querySelector('.e-prompt-uploaded-files');
            expect(uploadedFileEle).not.toBeNull();
            expect(uploadedFileEle.querySelector('.e-assist-file-name').textContent).toBe('Nature');
            expect(uploadedFileEle.querySelector('.e-assist-file-size').textContent).toBe('488.28 KB');
        });

        it('should allow to upload multiple files', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.txt', { type: 'text/plain' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = aiAssistViewElem.querySelector('.e-assist-drop-area');
                const attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-assist-uploaded-file-item');
                expect(attachedFiles.length).toBe(3);
                const uploadedFiles = (aiAssistView as any).uploadedFiles;
                expect(uploadedFiles.length).toBe(3);
                const sendBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-assist-send');
                expect(sendBtnElem.classList).not.toContain('disabled');
                done();
            }, 700);
        });

        it('should allow to upload file after sending a file successfully', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            let fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt1 = new DataTransfer();
            dt1.items.add(file1);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                let dropArea = aiAssistViewElem.querySelector('.e-assist-drop-area');
                let attachedFiles = dropArea.querySelectorAll('.e-assist-uploaded-file-item');
                expect(attachedFiles.length).toBe(1);

                const sendBtnElem: HTMLElement = aiAssistViewElem.querySelector('.e-assist-send');
                expect(sendBtnElem).not.toBeNull();
                sendBtnElem.click();

                setTimeout(() => {
                    const attachmentElem: HTMLElement =aiAssistViewElem.querySelector('.e-assist-attachment-icon');
                    attachmentElem.click();
                    fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
                    expect(fileInput).not.toBeNull();
                    const file2 = new File(['data2'], 'file2.txt', { type: 'text/plain' });
                    const dt2 = new DataTransfer();
                    dt2.items.add(file2);
                    fileInput.files = dt2.files;
                    fileInput.dispatchEvent(new Event('change'));

                    setTimeout(() => {
                        dropArea = aiAssistViewElem.querySelector('.e-assist-drop-area');
                        attachedFiles = dropArea.querySelectorAll('.e-assist-uploaded-file-item');
                        expect(attachedFiles.length).toBe(1);
                        done();
                    }, 700);
                }, 500);
            }, 700);
        });

        it('should restrict file upload to maximumCount limit and show error on exceeding', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = aiAssistViewElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                done();
            }, 500);
        });

        it('check for error message when maximumCount is set as one', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 1
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = aiAssistViewElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                const failureMessage = failureAlert.querySelector('.e-failure-message');
                expect(failureMessage.textContent).toBe('Upload limit reached: Maximum 1 file allowed. Remove extra files to proceed uploading');
                done();
            }, 500);
        });

        it('should show and remove failure alert when file count exceeds maximumCount', () => {
            jasmine.clock().install();
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;

            fileInput.dispatchEvent(new Event('change'));
            jasmine.clock().tick(500);

            const failureAlert = aiAssistViewElem.querySelector('.e-upload-failure-alert');
            expect(failureAlert).not.toBeNull();
            expect(failureAlert.classList.contains('e-show')).toBe(true);
            jasmine.clock().tick(3000);

            expect(failureAlert.classList.contains('e-show')).toBe(false);

            jasmine.clock().uninstall();
        });

        it('should restrict file upload to maximumCount limit and allow upload after increasing limit', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = aiAssistViewElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                const closeIcon: HTMLElement = failureAlert.querySelector('.e-assist-clear-icon');
                expect(closeIcon).not.toBeNull();
                closeIcon.click();

                aiAssistView.attachmentSettings.maximumCount = 3;
                aiAssistView.dataBind();

                const newDt = new DataTransfer();
                newDt.items.add(file1);
                newDt.items.add(file2);
                newDt.items.add(file3);
                fileInput.files = newDt.files;
                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    const updatedFailureAlert = aiAssistViewElem.querySelector('.e-upload-failure-alert');
                    expect(updatedFailureAlert).toBeNull();
                    const dropArea: HTMLElement = aiAssistViewElem.querySelector('.e-assist-drop-area');
                    const attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-assist-uploaded-file-item');
                    expect(attachedFiles.length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('should dynamically change the locale for fileUploadFailure alert', () => {
            L10n.load({
                'fr-BE': {
                    "aiassistview": {
                        "fileCountFailure": 'Limite de téléchargement atteinte : Maximum {0} fichiers autorisés. Supprimez les fichiers supplémentaires pour continuer le téléchargement.'
                    }
                }
            });

            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 0
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(["File One"], "file1.txt", { type: "text/plain" });
            const file2 = new File(["File Two"], "file2.txt", { type: "text/plain" });

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt1 = new DataTransfer();
            dt1.items.add(file1);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));
            let failureElement = aiAssistViewElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload limit reached: Maximum 0 files allowed. Remove extra files to proceed uploading'
            );
            const closeIcon: HTMLElement = failureElement.querySelector('.e-assist-clear-icon');
            expect(closeIcon).not.toBeNull();
            closeIcon.click();

            aiAssistView.locale = 'fr-BE';
            aiAssistView.dataBind();
            const dt2 = new DataTransfer();
            dt2.items.add(file2);
            fileInput.files = dt2.files;
            fileInput.dispatchEvent(new Event('change'));

            failureElement = aiAssistViewElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Limite de téléchargement atteinte : Maximum 0 fichiers autorisés. Supprimez les fichiers supplémentaires pour continuer le téléchargement.'
            );
        });

        it('should dynamically change the failure messsage locale when showing fileUploadFailure alert', () => {
            L10n.load({
                'de-DE': {
                    "aiassistview": {
                        "fileCountFailure": 'Upload-Limit erreicht: Maximal {0} Dateien erlaubt. Bitte entfernen Sie zusätzliche Dateien, um den Upload fortzusetzen.'
                    }
                }
            });

            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 1
                },
                locale: 'de-DE'
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            let failureElement = aiAssistViewElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload-Limit erreicht: Maximal 1 Dateien erlaubt. Bitte entfernen Sie zusätzliche Dateien, um den Upload fortzusetzen.'
            );
            aiAssistView.locale = 'en-US';
            aiAssistView.dataBind();
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload limit reached: Maximum 1 file allowed. Remove extra files to proceed uploading'
            );
            
        });

        it('attachment click event checking', (done: DoneFn) => {
            let attachmentClickCalled = false;
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    attachmentClick: function (args) {
                        attachmentClickCalled = true;
                    }
                }
            });

            aiAssistView.appendTo(aiAssistViewElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = aiAssistViewElem.querySelector('.e-assist-drop-area');
                const attachedFile: HTMLElement = dropArea.querySelector('.e-assist-uploaded-file-item');
                expect(attachedFile).not.toBeNull();
                attachedFile.click();
                expect(attachmentClickCalled).toBe(true);
                done();
            }, 500);
        });

        it('should open file browser when Enter key is pressed on the attachment icon', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            const keydownSpy = spyOn<any>(aiAssistView, 'footerKeyHandler').and.callThrough();
            aiAssistView.appendTo(aiAssistViewElem);
            const attachmentBtn: HTMLElement = aiAssistViewElem.querySelector('.e-toolbar-item .e-assist-attachment-icon').closest('.e-tbar-btn') as HTMLElement;
            attachmentBtn.focus();
            const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
            attachmentBtn.dispatchEvent(enterKeyEvent);
            setTimeout(() => {
                expect(keydownSpy).toHaveBeenCalled();
                done();
            }, 200, done);
        });
    });

    describe('Footer interactions - keyboard and focus states', () => {
        let aiAssistView: AIAssistView;
        const host: HTMLElement = createElement('div', { id: 'aiAssistViewComp_footer' });

        beforeEach(() => {
            document.body.appendChild(host);
        });

        afterEach(() => {
            if (aiAssistView && !aiAssistView.isDestroyed) {
                aiAssistView.destroy();
            }
            if (host && host.parentElement) {
                document.body.removeChild(host);
            }
        });

        it('should add e-footer-focused on focus and remove it on blur', (done: DoneFn) => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(host);

            const footerElem: HTMLElement = host.querySelector('.e-footer');
            const textareaEle: HTMLDivElement = host.querySelector('.e-footer .e-assist-textarea');

            // Ensure initial state is not focused
            expect(footerElem.classList.contains('e-footer-focused')).toBe(false);

            // Focus event should add focused class
            textareaEle.focus();
            const focusEvent: FocusEvent = new FocusEvent('focus', { bubbles: true });
            textareaEle.dispatchEvent(focusEvent);
            expect(footerElem.classList.contains('e-footer-focused')).toBe(true);

            // Blur without relatedTarget should remove focused class
            const blurEvent: FocusEvent = new FocusEvent('blur', { bubbles: true, relatedTarget: null });
            textareaEle.dispatchEvent(blurEvent);

            // Let the blur handler run
            setTimeout(() => {
                expect(footerElem.classList.contains('e-footer-focused')).toBe(false);
                done();
            }, 0);
        });

        it('should have e-footer-focus-wave-effect when no footerTemplate is provided', () => {
            aiAssistView = new AIAssistView({});
            aiAssistView.appendTo(host);

            const footerElem: HTMLElement = host.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();

            // When footerTemplate is not provided, renderAssistViewFooter adds this class
            expect(footerElem.classList.contains('e-footer-focus-wave-effect')).toBe(true);
        });
    });

    describe('Footer Toolbar -', () => {
        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Footer toolbarsettings prop checking', () => {
            let isClicked: boolean;
            aiAssistView = new AIAssistView({
                showClearButton: true,
                enableAttachments: true,
                footerToolbarSettings: {
                    itemClick: (args: ToolbarItemClickedEventArgs) => {
                        if (args.item.iconCss === 'e-icons e-bold') {
                            isClicked = true;
                        }
                    },
                    items: [
                        { iconCss: 'e-icons e-bold', tabIndex: 1 }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const toolbarItems: NodeListOf<HTMLElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            expect(toolbarItems.length).toBe(4);
            const boldItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(boldItem).not.toBeNull();
            expect(boldItem.querySelector('button span').classList.contains('e-bold')).toEqual(true);
            boldItem.click();
            expect(isClicked).toBe(true);
        });

        it('Default items checking with enableAttachments: false and showClearButton: false', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: false,
                showClearButton: false
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(1);
            const sendButton = footerToolbarItems[0].querySelector('.e-assist-send');
            expect(sendButton).not.toBeNull();
        });

        it('Default items checking with enableAttachments: true and showClearButton: false', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                showClearButton: false
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            const attachmentButton = footerToolbarItems[0].querySelector('.e-assist-attachment-icon');
            expect(attachmentButton).not.toBeNull();
            expect(attachmentButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Attach File');
            const sendButton = footerToolbarItems[1].querySelector('.e-assist-send');
            expect(sendButton).not.toBeNull();
        });

        it('Default items checking with enableAttachments: false and showClearButton: true', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: false,
                showClearButton: true
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            const clearButton = footerToolbarItems[0].querySelector('.e-assist-clear-icon');
            expect(clearButton).not.toBeNull();
            expect(clearButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Clear');
            const sendButton = footerToolbarItems[1].querySelector('.e-assist-send');
            expect(sendButton).not.toBeNull();
        });

        it('Default items checking with enableAttachments: true and showClearButton: true', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                showClearButton: true
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(3);
            const attachmentButton = footerToolbarItems[0].querySelector('.e-assist-attachment-icon');
            expect(attachmentButton).not.toBeNull();
            expect(attachmentButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Attach File');
            const clearButton = footerToolbarItems[1].querySelector('.e-assist-clear-icon');
            expect(clearButton).not.toBeNull();
            expect(clearButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Clear');
            const sendButton = footerToolbarItems[2].querySelector('.e-assist-send');
            expect(sendButton).not.toBeNull();
        });

        it('Custom footer toolbar items checking', () => {
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-custom-icon-1', tooltip: 'Custom 1' },
                        { iconCss: 'e-icons e-custom-icon-2', tooltip: 'Custom 2' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            // Default send button + 2 custom buttons
            expect(footerToolbarItems.length).toBe(3);
            expect(footerToolbarItems[0].querySelector('.e-custom-icon-1')).not.toBeNull();
            expect(footerToolbarItems[0].getAttribute('title')).toBe('Custom 1');
            expect(footerToolbarItems[1].querySelector('.e-custom-icon-2')).not.toBeNull();
            expect(footerToolbarItems[1].getAttribute('title')).toBe('Custom 2');
            expect(footerToolbarItems[2].querySelector('.e-assist-send')).not.toBeNull();
        });

        it('Should override default footer toolbar items with custom items', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                showClearButton: true,
                footerToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-attachment-icon', tooltip: 'My Attachment' },
                        { iconCss: 'e-icons e-assist-send', tooltip: 'Submit' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(3);
            const attachmentButton = footerToolbarItems[0].querySelector('.e-assist-attachment-icon');
            expect(attachmentButton).not.toBeNull();
            expect(aiAssistView.footerToolbarSettings.items[0].iconCss).toContain('e-icons e-assist-attachment-icon');
            expect(attachmentButton.closest('.e-toolbar-item').getAttribute('title')).toBe('My Attachment');
            const clearButton = footerToolbarItems[2].querySelector('.e-assist-clear-icon');
            expect(clearButton).not.toBeNull();
            expect(aiAssistView.footerToolbarSettings.items[2].iconCss).toContain('e-icons e-assist-clear-icon');
            expect(clearButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Clear');
            const sendButton = footerToolbarItems[1].querySelector('.e-assist-send');
            expect(sendButton).not.toBeNull();
            expect(aiAssistView.footerToolbarSettings.items[1].iconCss).toContain('e-icons e-assist-send');
            expect(sendButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Submit');
        });

        it('footerToolbarSettings itemClicked event checking', (done: DoneFn) => {
            let itemClicked = false;
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-test-button', tooltip: 'Test Button' }
                    ],
                    itemClick: (args) => {
                        itemClicked = true;
                        expect(args.item.iconCss).toBe('e-icons e-test-button');
                        done();
                    }
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const testButton = aiAssistViewElem.querySelector('.e-footer .e-test-button') as HTMLElement;
            expect(testButton).not.toBeNull();
            testButton.click();
            expect(itemClicked).toBe(true);
        });

        it('footerToolbarSettings itemClicked event cancellation', (done: DoneFn) => {
            let itemClicked = false;
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-test-button', tooltip: 'Test Button' }
                    ],
                    itemClick: (args) => {
                        itemClicked = true;
                        args.cancel = true;
                    }
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const testButton = aiAssistViewElem.querySelector('.e-footer .e-test-button') as HTMLElement;
            expect(testButton).not.toBeNull();
            testButton.click();
            expect(itemClicked).toBe(true);
            done();
        });

        it('Dynamically updating the footerToolbarSettings items', () => {
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-bold', tooltip: 'Initial' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let footerToolbarItems: NodeListOf<HTMLDivElement> = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            expect(footerToolbarItems[0].querySelector('.e-bold')).not.toBeNull();

            aiAssistView.footerToolbarSettings.items = [
                { iconCss: 'e-icons e-copy', tooltip: 'Updated' },
                { iconCss: 'e-icons e-assist-send', tooltip: 'New Send' }
            ];
            aiAssistView.dataBind();

            footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            expect(footerToolbarItems[0].querySelector('.e-copy')).not.toBeNull();
            expect(footerToolbarItems[0].getAttribute('title')).toBe('Updated');
            expect(footerToolbarItems[1].querySelector('.e-assist-send')).not.toBeNull();
            expect(footerToolbarItems[1].getAttribute('title')).toBe('New Send');
        });

        it('Dynamically enabling or disabling attachments updates footer toolbar', () => {
            aiAssistView = new AIAssistView({
                enableAttachments: false,
                showClearButton: false
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(1);

            aiAssistView.enableAttachments = true;
            aiAssistView.dataBind();
            footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            expect(footerToolbarItems[0].querySelector('.e-assist-attachment-icon')).not.toBeNull();

            aiAssistView.enableAttachments = false;
            aiAssistView.dataBind();
            footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(1);
            expect(footerToolbarItems[0].querySelector('.e-assist-attachment-icon')).toBeNull();
        });

        it('Dynamically enabling or disabling showClearButton updates footer toolbar', (done: DoneFn) => {
            aiAssistView = new AIAssistView({
                enableAttachments: false,
                showClearButton: false
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(1);

            aiAssistView.showClearButton = true;
            aiAssistView.dataBind();
            footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            expect(footerToolbarItems[0].querySelector('.e-assist-clear-icon')).not.toBeNull();
            const textareaEle: HTMLDivElement = aiAssistViewElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Some text';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);

            setTimeout(() => {
                aiAssistView.showClearButton = false;
                aiAssistView.dataBind();
                footerToolbarItems = aiAssistViewElem.querySelectorAll('.e-footer .e-toolbar-item');
                expect(footerToolbarItems.length).toBe(1);
                expect(footerToolbarItems[0].querySelector('.e-assist-clear-icon')).toBeNull();
                done();
            }, 100);
        });

        it('Clicking on attachment icon should trigger hidden file input', (done) => {
            aiAssistView = new AIAssistView({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: '/api/upload',
                    removeUrl: '/api/remove'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);

            const fileInput = aiAssistViewElem.querySelector('.e-assist-file-upload');
            expect(fileInput).not.toBeNull();
            const fileInputSpy = spyOn(fileInput as HTMLInputElement, 'click');

            const attachmentIcon = aiAssistViewElem.querySelector('.e-assist-attachment-icon') as HTMLElement;
            expect(attachmentIcon).not.toBeNull();
            const attachmentToolbarItem = attachmentIcon.closest('.e-toolbar-item') as HTMLElement;
            attachmentToolbarItem.click();
            expect(fileInputSpy).toHaveBeenCalled();
            done();
        });
    });

    describe('footerToolbarPosition Property Checking -', () => {
        afterEach(() => {
            if (aiAssistView) {
                aiAssistView.destroy();
            }
        });

        it('Default footerToolbarPosition is inline', () => {
            aiAssistView = new AIAssistView();
            aiAssistView.appendTo(aiAssistViewElem);
            const footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement).not.toBeNull();
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(false);
            expect(footerElement.classList.contains('e-toolbar-inline')).toBe(true);
            const toolbar: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-toolbar');
            expect(toolbar).not.toBeNull();
        });

        it('Setting footerToolbarPosition as Bottom', () => {
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    toolbarPosition: 'Bottom'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement).not.toBeNull();
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(true);
            const toolbar: HTMLElement = aiAssistViewElem.querySelector('.e-footer .e-toolbar');
            expect(toolbar).not.toBeNull();
        });

        it('Dynamic update of footerToolbarPosition from Inline to Bottom', () => {
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    toolbarPosition: 'Inline'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(false);
            expect(footerElement.classList.contains('e-toolbar-inline')).toBe(true);
            aiAssistView.footerToolbarSettings.toolbarPosition = 'Bottom';
            aiAssistView.dataBind();
            footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(true);
            expect(footerElement.classList.contains('e-toolbar-inline')).toBe(false);
        });

        it('Dynamic update of footerToolbarPosition from Bottom to Inline', () => {
            aiAssistView = new AIAssistView({
                footerToolbarSettings: {
                    toolbarPosition: 'Bottom'
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            let footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(true);

            aiAssistView.footerToolbarSettings.toolbarPosition = 'Inline';
            aiAssistView.dataBind();
            footerElement = aiAssistViewElem.querySelector('.e-footer');
            expect(footerElement.classList.contains('e-toolbar-bottom')).toBe(false);
            expect(footerElement.classList.contains('e-toolbar-inline')).toBe(true);
        });
    });
});
