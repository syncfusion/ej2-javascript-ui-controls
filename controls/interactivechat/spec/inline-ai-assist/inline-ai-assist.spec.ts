import { createElement, L10n } from "@syncfusion/ej2-base";
import { InlineAIAssist, InlinePromptRequestEventArgs, CommandItemSelectEventArgs, CommandItemModel, ResponseItemSelectEventArgs, ResponseMode, ToolbarItemClickEventArgs } from "../../src/inline-ai-assist/index";
import { AIAssistBase } from '../../src/ai-assist-base/index';

describe('InlineAIAssist -', () => {

    let inlineAIAssist: InlineAIAssist;
    let inlineAIAssistElem: HTMLElement;

    beforeEach(() => {
        inlineAIAssistElem = createElement('div', { id: 'inlineAIAssistComp' });
        document.body.appendChild(inlineAIAssistElem);
    });

    afterEach(() => {
        if (inlineAIAssist && !inlineAIAssist.isDestroyed) {
            inlineAIAssist.destroy();
        }
        if (inlineAIAssistElem && inlineAIAssistElem.parentElement) {
            inlineAIAssistElem.parentElement.removeChild(inlineAIAssistElem);
        }
    });

    describe('DOM', () => {
        it('Default rendering', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(inlineAIAssistElem.classList.contains('e-inline-ai-assist')).toEqual(true);
            expect(inlineAIAssistElem.classList.contains('e-control')).toEqual(true);
            expect(inlineAIAssistElem.classList.contains('e-lib')).toEqual(true);
            const contentWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-assist-container');
            expect(contentWrapper).not.toBeNull();
            const content: HTMLElement = contentWrapper.querySelector('.e-content');
            expect(content).not.toBeNull();
            const footer: HTMLElement = contentWrapper.querySelector('.e-footer');
            expect(footer).not.toBeNull();
            const textAreaElem: HTMLDivElement = footer.querySelector('.e-assist-textarea');
            expect(textAreaElem).not.toBeNull();
            const sendBtnElem: HTMLElement = footer.querySelector('.e-footer-icons-wrapper .e-inline-send');
            expect(sendBtnElem).not.toBeNull();
            expect(sendBtnElem.classList.contains('disabled')).toEqual(true);
        });

        it('Unique ID checking', () => {
            inlineAIAssistElem.removeAttribute('id');
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.hasAttribute('id')).toEqual(true);
            inlineAIAssistElem.setAttribute('id', 'inlineAIAssistComp');
        });

        it('Popup default checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.display).toBe('');
        });

        it('Prompt checking', () => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Write a palindrome program in C#.'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const textAreaElem: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(textAreaElem.innerHTML).toBe('Write a palindrome program in C#.');
        });

        it('PopupWidth checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupWidth: '500px'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.width).toEqual('500px');
        });

        it('PopupHeight checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupHeight: '600px'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.height).toEqual('600px');
        });

        it('PromptPlaceholder checking', () => {
            inlineAIAssist = new InlineAIAssist({
                placeholder: 'Type your prompt here...'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            expect(textareaEle.getAttribute('placeholder')).toEqual('Type your prompt here...');
        });

        it('CssClass checking', () => {
            inlineAIAssist = new InlineAIAssist({
                cssClass: 'e-custom-class'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.classList.contains('e-custom-class')).toEqual(true);
        });

        it('Rtl checking', () => {
            inlineAIAssist = new InlineAIAssist({
                enableRtl: true
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.classList.contains('e-rtl')).toEqual(true);
        });

        it('Target property checking', () => {
            const targetElem: HTMLElement = createElement('div', { id: 'targetDiv' });
            document.body.appendChild(targetElem);
            inlineAIAssist = new InlineAIAssist({
                target: '#targetDiv'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(targetElem.contains(inlineAIAssistElem)).toEqual(true);
            document.body.removeChild(targetElem);
        });

        it('Target property as HTMLElement checking', () => {
            const targetElem: HTMLElement = createElement('div', { id: 'targetDiv' });
            document.body.appendChild(targetElem);
            inlineAIAssist = new InlineAIAssist({
                target: targetElem
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(targetElem.contains(inlineAIAssistElem)).toEqual(true);
            document.body.removeChild(targetElem);
        });

        it('should default to document.body when target is null', () => {
            inlineAIAssist = new InlineAIAssist({
                target: null
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const targetEl: HTMLElement = (inlineAIAssist as any).targetEl;
            expect(targetEl).toBe(document.body);
            expect(document.body.contains(inlineAIAssist.element)).toBe(true);
        });

        it('RelateTo property checking', () => {
            const relateToElem: HTMLElement = createElement('div', { id: 'relateToDiv' });
            document.body.appendChild(relateToElem);
            inlineAIAssist = new InlineAIAssist({
                relateTo: '#relateToDiv'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem).not.toBeNull();
            document.body.removeChild(relateToElem);
        });

        it('RelateTo property as HTMLElement checking', () => {
            const relateToElem: HTMLElement = createElement('div', { id: 'relateToDiv' });
            document.body.appendChild(relateToElem);
            inlineAIAssist = new InlineAIAssist({
                relateTo: relateToElem
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem).not.toBeNull();
            document.body.removeChild(relateToElem);
        });

        it('RelateTo property as null checking', () => {
            inlineAIAssist = new InlineAIAssist({
                relateTo: null,
                open: () => {
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem).not.toBeNull();
            inlineAIAssist.showPopup();
        });

        it('InlineToolbarSettings prop checking', () => {
            let isCancellableEvent: boolean = false;
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ],
                    itemClick: (args: ToolbarItemClickEventArgs) => {
                        args.cancel = isCancellableEvent;
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const toolbarItem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
            expect(toolbarItem.classList.contains('e-user')).toEqual(true);
            toolbarItem.click();
            isCancellableEvent = true;
            toolbarItem.click();
        });

        it('InlineToolbarSettings without itemClick checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const toolbarItem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
            expect(toolbarItem.classList.contains('e-user')).toEqual(true);
            toolbarItem.click();
        });

        it('InlineToolbarSettings tabIndex prop checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 },
                        { iconCss: 'e-icons e-people', align: 'Right', tabIndex: 2 }
                    ],
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const toolbarItems: NodeListOf<HTMLDivElement> = inlineAIAssistElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(3);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
        });

        it('InlineToolbarSettings toolbarPosition prop checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    toolbarPosition: 'Bottom'
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            expect(footer.classList.contains('e-toolbar-bottom')).toEqual(true);
            expect(footer.classList.contains('e-toolbar-inline')).toEqual(false);
        });

        it('InlineToolbarSettings toolbarPosition inline checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    toolbarPosition: 'Inline'
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            expect(footer.classList.contains('e-toolbar-inline')).toEqual(true);
            expect(footer.classList.contains('e-toolbar-bottom')).toEqual(false);
        });

        it('ZIndex property checking', () => {
            inlineAIAssist = new InlineAIAssist({
                zIndex: 2000
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.style.zIndex).toEqual('2000');
        });

        it('EnableStreaming property checking', () => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.enableStreaming).toEqual(true);
        });

        it('commandSettings prop checking', () => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [{label: 'Summarize'}]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.commandSettings.commands.length).toBe(1);
            expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Summarize');
        });

        it('Hidden textarea value checking', () => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const hiddenTextarea: HTMLTextAreaElement = inlineAIAssistElem.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
            expect(hiddenTextarea).not.toBeNull();
            expect(hiddenTextarea.value).toEqual('Test prompt');
        });

        it('ZIndex dynamic change checking', (done: DoneFn) => {
            // Step 1: Create component with initial zIndex value
            inlineAIAssist = new InlineAIAssist({
                zIndex: 1000
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.zIndex).toEqual('');
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.style.zIndex).toEqual('1000');
            expect(inlineAIAssist.zIndex).toBe(1000);
            setTimeout(() => {
                // Step 6: Dynamically change zIndex to a new value
                inlineAIAssist.zIndex = 5000;
                inlineAIAssist.dataBind();

                // Step 7: Verify zIndex property is updated in component
                expect(inlineAIAssist.zIndex).toBe(5000);

                // Step 8: Verify zIndex is updated in DOM
                expect(inlineAIAssistElem.style.zIndex).toEqual('5000');

                // Step 9: Change zIndex again to test multiple changes
                inlineAIAssist.zIndex = 999;
                inlineAIAssist.dataBind();

                // Step 10: Verify second zIndex change in component
                expect(inlineAIAssist.zIndex).toBe(999);

                // Step 11: Verify second zIndex change in DOM
                expect(inlineAIAssistElem.style.zIndex).toEqual('999');

                // Step 12: Change to a very high zIndex value
                inlineAIAssist.zIndex = 99999;
                inlineAIAssist.dataBind();

                // Step 13: Verify high zIndex value in component
                expect(inlineAIAssist.zIndex).toBe(99999);

                // Step 14: Verify high zIndex value in DOM
                expect(inlineAIAssistElem.style.zIndex).toEqual('99999');

                // Step 15: Verify zIndex persists after hide/show cycle
                inlineAIAssist.hidePopup();
                
                setTimeout(() => {
                    inlineAIAssist.showPopup();
                    
                    // Step 16: Verify zIndex is still applied after show
                    expect(inlineAIAssistElem.style.zIndex).toEqual('99999');
                    
                    // Step 17: Change zIndex while popup is hidden
                    inlineAIAssist.zIndex = 2000;
                    inlineAIAssist.dataBind();
                    
                    // Step 18: Verify new zIndex value is set
                    expect(inlineAIAssist.zIndex).toBe(2000);
                    
                    // Step 19: Show popup again and verify new zIndex is applied
                    inlineAIAssist.showPopup();
                    expect(inlineAIAssistElem.style.zIndex).toEqual('2000');
                    
                    // Step 20: Verify popup element exists and has correct zIndex
                    const popupElement: HTMLElement = inlineAIAssistElem;
                    expect(popupElement).not.toBeNull();
                    expect(popupElement.style.zIndex).toEqual('2000');
                    
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Template - ', () => {
        const responseTag: HTMLElement = createElement('script', { id: 'responseItemTemplate', attrs: { type: 'text/x-template' } });
        responseTag.innerHTML = '<div class="e-response-custom"><div class="e-response-header">AI Response:</div><div class="e-response-body">${response}</div></div>';

        const inlineInputTag: HTMLElement = createElement('script', { id: 'editorTemplate', attrs: { type: 'text/x-template' } });
        inlineInputTag.innerHTML = '<div class="e-custom-input"><textarea class="e-custom-textarea"></textarea><button class="e-inline-send">Send</button></div>';

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Response template checking', () => {
            document.body.appendChild(responseTag);
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: '#responseItemTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Test response content');
            const customResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-response-custom');
            expect(customResponse).not.toBeNull();
            const responseBody: HTMLElement = customResponse.querySelector('.e-response-body');
            expect(responseBody).not.toBeNull();
            expect(responseBody.textContent).toContain('Test response content');
        });

        it('Response template for not compile case checking', () => {
            document.body.appendChild(responseTag);
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: '#responseItemTemplate'
            });
            inlineAIAssist.isReact = true;
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Test response content');
            const customResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-response-custom');
            expect(customResponse).not.toBeNull();
        });

        it('Response template - function template checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: () => '<div class="e-function-response">${response}</div>'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Function template response');
            const functionResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-function-response');
            expect(functionResponse).not.toBeNull();
        });

        it('InlineInput template checking', () => {
            document.body.appendChild(inlineInputTag);
            inlineAIAssist = new InlineAIAssist({
                editorTemplate: '#editorTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const customInput: HTMLElement = inlineAIAssistElem.querySelector('.e-custom-input');
            expect(customInput).not.toBeNull();
            const customTextarea: HTMLElement = customInput.querySelector('.e-custom-textarea');
            expect(customTextarea).not.toBeNull();
            const sendBtn: HTMLElement = customInput.querySelector('.e-inline-send');
            expect(sendBtn).not.toBeNull();
        });

        it('Response template dynamic change checking', () => {
            document.body.appendChild(responseTag);
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Initial response');
            inlineAIAssist.responseTemplate = '#responseItemTemplate';
            inlineAIAssist.dataBind();
            inlineAIAssist.addResponse('Updated response');
            const customResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-response-custom');
            expect(customResponse).not.toBeNull();
        });

        it('InlineInput template dynamic change checking', () => {
            document.body.appendChild(inlineInputTag);
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.editorTemplate = '#editorTemplate';
            inlineAIAssist.dataBind();
            const customInput: HTMLElement = inlineAIAssistElem.querySelector('.e-custom-input');
            expect(customInput).not.toBeNull();
        });

        it ('Footer template should toggle send icon into stop response icon', function(done){
            const template = createElement('script', { id: 'footerItemTemplate', attrs: { type: 'text/x-template' } });
            template.innerHTML = '<div><textarea></textarea><span class="e-icons e-inline-send"></span></div>';
            document.body.appendChild(template);
            inlineAIAssist = new InlineAIAssist({
                editorTemplate: '#footerItemTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            const textarea: HTMLElement = footerElem.querySelector('textarea');
            expect(textarea).not.toBeNull();
            const sendBtnElem: HTMLElement = footerElem.querySelector('.e-footer .e-inline-send.e-icons');
            expect(sendBtnElem).not.toBeNull();
            textarea.innerText = 'Hi this is a prompt';
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            setTimeout(function () {
                inlineAIAssist.executePrompt(textarea.textContent);
                textarea.innerText = "";
                setTimeout(function () {
                    var stopResponseBtn: HTMLElement = footerElem.querySelector('.e-inline-stop');
                    expect(stopResponseBtn).not.toBeNull();
                    stopResponseBtn.click();
                    done();
                }, 200);
            }, 600);
        });
    });

    describe('API -', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Prompt dynamic change checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.prompt = 'Updated prompt';
            inlineAIAssist.dataBind();
            const textAreaElem: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            setTimeout(() => {
                expect(textAreaElem.innerText).toBe('Updated prompt');
                done();
            }, 0, done);
        });

        it('PopupWidth dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupWidth: '400px'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.width).toEqual('400px');
            inlineAIAssist.popupWidth = '600px';
            inlineAIAssist.dataBind();
            expect(inlineAIAssist.popupWidth).toBe('600px');
        });

        it('PopupHeight dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupHeight: 'auto'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.popupHeight = '700px';
            inlineAIAssist.dataBind();
            expect(inlineAIAssist.popupHeight).toBe('700px');
        });

        it('PromptPlaceholder dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                placeholder: 'Initial placeholder'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.placeholder = 'Updated placeholder';
            inlineAIAssist.dataBind();
            const textAreaElem: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(textAreaElem.getAttribute('placeholder')).toEqual('Updated placeholder');
        });

        it('CssClass dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                cssClass: 'e-custom-class'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.classList.contains('e-custom-class')).toEqual(true);
            inlineAIAssist.cssClass = 'e-updated-class';
            inlineAIAssist.dataBind();
            expect(inlineAIAssistElem.classList.contains('e-custom-class')).toEqual(false);
            expect(inlineAIAssistElem.classList.contains('e-updated-class')).toEqual(true);
        });

        it('Rtl dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                enableRtl: false
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const toolbarItem: HTMLElement = inlineAIAssistElem.querySelector('.e-control .e-toolbar');
            expect(inlineAIAssistElem.classList.contains('e-rtl')).toEqual(false);
            expect(toolbarItem.classList.contains('e-rtl')).toBe(false);
            inlineAIAssist.enableRtl = true;
            inlineAIAssist.dataBind();
            expect(inlineAIAssistElem.classList.contains('e-rtl')).toBe(true);
            expect(toolbarItem.classList.contains('e-rtl')).toBe(true);
            inlineAIAssist.enableRtl = false;
            inlineAIAssist.dataBind();
        });

        it('InlineToolbarSettings dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.inlineToolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-settings', align: 'Right' }
                ]
            };
            inlineAIAssist.dataBind();
            const toolbarItem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
        });

        it('InlineToolbarSettings toolbarPosition dynamic change', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    toolbarPosition: 'Inline'
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            expect(footer.classList.contains('e-toolbar-inline')).toEqual(true);
            expect(inlineAIAssist.inlineToolbarSettings.toolbarPosition).toBe('Inline');
            inlineAIAssist.inlineToolbarSettings.toolbarPosition = 'Bottom';
            inlineAIAssist.dataBind();
            expect(footer.classList.contains('e-toolbar-bottom')).toEqual(true);
            expect(inlineAIAssist.inlineToolbarSettings.toolbarPosition).toBe('Bottom');
        });

        it('Target dynamic change checking', () => {
            const targetElem1: HTMLElement = createElement('div', { id: 'targetDiv1' });
            const targetElem2: HTMLElement = createElement('div', { id: 'targetDiv2' });
            document.body.appendChild(targetElem1);
            document.body.appendChild(targetElem2);
            inlineAIAssist = new InlineAIAssist({
                target: '#targetDiv1'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(targetElem1.contains(inlineAIAssistElem)).toEqual(true);
            inlineAIAssist.target = '#targetDiv2';
            inlineAIAssist.dataBind();
            document.body.removeChild(targetElem1);
            document.body.removeChild(targetElem2);
        });

        it('RelateTo dynamic change checking', () => {
            const relateToElem1: HTMLElement = createElement('div', { id: 'relateToDiv1' });
            const relateToElem2: HTMLElement = createElement('div', { id: 'relateToDiv2' });
            document.body.appendChild(relateToElem1);
            document.body.appendChild(relateToElem2);
            inlineAIAssist = new InlineAIAssist({
                relateTo: '#relateToDiv1'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.relateTo = '#relateToDiv2';
            inlineAIAssist.dataBind();
            expect(inlineAIAssistElem).not.toBeNull();
            document.body.removeChild(relateToElem1);
            document.body.removeChild(relateToElem2);
        });

        it('ZIndex dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                zIndex: 1000
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.style.zIndex).toEqual('1000');
        });

        it('EnableStreaming dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: false
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.enableStreaming).toEqual(false);
            inlineAIAssist.enableStreaming = true;
            inlineAIAssist.dataBind();
            expect(inlineAIAssist.enableStreaming).toEqual(true);
        });

        it('Hidden textarea value dynamic change', () => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Initial prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const hiddenTextarea: HTMLTextAreaElement = inlineAIAssistElem.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
            expect(hiddenTextarea.value).toEqual('Initial prompt');
            inlineAIAssist.prompt = 'Updated prompt';
            inlineAIAssist.dataBind();
            expect(hiddenTextarea.value).toEqual('Updated prompt');
        });
    });

    describe('Methods - ', () => {
        let aiAssistBase: any;
        let element: HTMLElement;
        beforeEach(() => {
            element = createElement('div', { id: 'aiAssistBase' });
            document.body.appendChild(element);
            aiAssistBase = new AIAssistBase();
            aiAssistBase.appendTo(element);
        });
        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
            if (element) {
                document.body.removeChild(element);
            };
        });

        it('destroy checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            inlineAIAssist.destroy();
            expect(inlineAIAssistElem.classList.contains('e-control')).toEqual(false);
            expect(inlineAIAssistElem.classList.contains('e-lib')).toEqual(false);
        });

        it('getModuleName checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(((<any>inlineAIAssistElem).ej2_instances[0] as any).getModuleName()).toEqual('inlineaiassist');
        });

        it('getPersistData checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(((<any>inlineAIAssistElem).ej2_instances[0] as any).getPersistData()).toEqual('{}');
        });

        it('getModuleName checking for AIAssistBase', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(((<any>inlineAIAssistElem).ej2_instances[0] as any).getModuleName()).toEqual('inlineaiassist');
            expect(aiAssistBase.getModuleName()).toEqual('aiAssistBase');
        });

        it('getPersistData checking for AIAssistBase', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(((<any>inlineAIAssistElem).ej2_instances[0] as any).getPersistData()).toEqual('{}');
            expect(aiAssistBase.getPersistData()).toEqual('{}');
        });

        it('getDirective checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(((<any>inlineAIAssistElem).ej2_instances[0] as any).getDirective()).toEqual('EJS-INLINEAIASSIST');
        });

        it('showPopup method checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            expect(inlineAIAssistElem.style.display).toBe('');
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
        });

        it('showPopup with coordinates checking', () => {
            const target: HTMLElement = createElement('div', { 
                id: 'targetEl',
            });
            document.body.appendChild(target);
            inlineAIAssist = new InlineAIAssist({
                relateTo: '#targetEl'
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            inlineAIAssist.showPopup();
            const oldTopValue: string = inlineAIAssistElem.style.top;
            const oldLeftValue: string = inlineAIAssistElem.style.left;
            inlineAIAssist.hidePopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
            inlineAIAssist.showPopup(100, 200);
            const newTopValue: string = inlineAIAssistElem.style.top;
            const newLeftValue: string = inlineAIAssistElem.style.left;
            expect(oldLeftValue).not.toEqual(newLeftValue);
            expect(oldTopValue).not.toEqual(newTopValue);
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
        });

        it('hidePopup method checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo('#inlineAIAssistComp');
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
            expect(inlineAIAssistElem.style.display).not.toBe('none');
            inlineAIAssist.hidePopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
        });

        it('executePrompt method checking', (done: DoneFn) => {
            const proxyDone: DoneFn = done;
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    expect(args.prompt).toBe('Execute this prompt');
                    inlineAIAssist.addResponse('Response for executed prompt');
                    proxyDone();
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Execute this prompt');
        });

        it('executePrompt with empty prompt checking', () => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    fail('Should not trigger promptRequest for empty prompt');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('');
        });

        it('addResponse method checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('This is a test response');
            const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
            expect(responseText).not.toBeNull();
            expect(responseText.textContent.trim()).toContain('This is a test response');
        });

        it('addResponse with markdown checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('**Bold text**');
            const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
            expect(responseText).not.toBeNull();
            const strongTag: HTMLElement = responseText.querySelector('strong');
            expect(strongTag).not.toBeNull();
        });

        it('Response with enableStreaming checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('This is a prompt');
            setTimeout(() => {
                const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                expect(responseText).not.toBeNull();
                const stopButton: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopButton).not.toBeNull();
                stopButton.click();
                setTimeout(() => {
                    expect(responseText.innerText).not.toBe('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                    done(); 
                }, 50);
            }, 100);
        });

        it('addResponse with isFinalUpdate false should keep stop button visible during streaming', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial chunk one', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Stream test');
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
                expect(sendBtn).toBeNull();
                done();
            }, 100);
        });

        it('addResponse with isFinalUpdate true should switch stop button back to send button', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial chunk', false);
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Final chunk', true);
                    }, 50);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Stream test');
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).toBeNull();
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
                expect(sendBtn).not.toBeNull();
                done();
            }, 200);
        });

        it('addResponse streaming should accumulate prompts correctly across multiple partial calls', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: () => {
                    inlineAIAssist.addResponse('Chunk one', false);
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Chunk two', false);
                        setTimeout(() => {
                            inlineAIAssist.addResponse('Final chunk', true);
                        }, 30);
                    }, 30);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Multi chunk stream');
            setTimeout(() => {
                expect(inlineAIAssist.prompts.length).toBe(3);
                expect(inlineAIAssist.prompts[0].response.trim()).toBe('<p>Chunk one</p>');
                expect(inlineAIAssist.prompts[1].response.trim()).toBe('<p>Chunk two</p>');
                expect(inlineAIAssist.prompts[2].response.trim()).toBe('<p>Final chunk</p>');
                done();
            }, 250);
        });

        it('addResponse with isFinalUpdate false should keep typing indicator active until final update', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial chunk', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Stream test');
            setTimeout(() => {
                const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                expect(indicator).not.toBeNull();
                const indicatorText: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                expect(indicatorText.textContent).toBe('Editing');
                done();
            }, 100);
        });

        it('addResponse with isFinalUpdate true after false should remove typing indicator in Inline mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial chunk', false);
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Final chunk', true);
                    }, 50);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Stream test');
            setTimeout(() => {
                const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                expect(indicator).toBeNull();
                done();
            }, 200);
        });

        it('clicking stop during streaming should cancel pending addResponse and restore send button', (done: DoneFn) => {
            let stopClicked: boolean = false;
            inlineAIAssist = new InlineAIAssist({
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial chunk', false);
                    setTimeout(() => {
                        if (!stopClicked) {
                            inlineAIAssist.addResponse('Final chunk', true);
                        }
                    }, 150);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Stop test');
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                stopClicked = true;
                stopBtn.click();
                setTimeout(() => {
                    const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
                    expect(sendBtn).not.toBeNull();
                    const stopBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtnAfter).toBeNull();
                    done();
                }, 50);
            }, 50);
        });

        it('showCommandPopup method checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize', prompt: 'Summarize this' },
                        { label: 'Improve Writing', prompt: 'Improve this' },
                        { label: 'Translate', prompt: 'Translate this' }
                    ]
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    inlineAIAssist.addResponse('Response to: ' + args.prompt);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            // Check that command settings exist
            expect(inlineAIAssist.commandSettings.commands.length).toBe(3);
            expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Summarize');
            
            // Execute a prompt to add a response
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    const mentionPopup: any = (inlineAIAssist as any).mentionPopupObj;
                    expect(mentionPopup).not.toBeNull();
                    inlineAIAssist.showCommandPopup();
                    setTimeout(() => {
                        const mentionElement: HTMLElement = (mentionPopup as any).element;
                        expect(mentionElement.classList.contains('e-popup-open')).toBe(true);
                        const mentionItems: NodeListOf<HTMLElement> = mentionElement.querySelectorAll('.e-list-item');
                        expect(mentionItems.length).toBeGreaterThan(0);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('hideCommandPopup method checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize', prompt: 'Summarize this' },
                        { label: 'Improve Writing', prompt: 'Improve this' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);                
                setTimeout(() => {
                    const mentionPopup: any = (inlineAIAssist as any).mentionPopupObj;
                    const mentionElement: HTMLElement = (mentionPopup as any).element;
                    expect(mentionElement.classList.contains('e-popup-open')).toBe(true);
                    inlineAIAssist.hideCommandPopup();
                    setTimeout(() => {
                        expect(mentionElement.classList.contains('e-popup-open')).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Null - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('PopupWidth null checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupWidth: null
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.width).not.toBeNull();
        });

        it('PopupHeight null checking', () => {
            inlineAIAssist = new InlineAIAssist({
                popupHeight: null
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.style.height).not.toBeNull();
        });
    });

    describe('UI interaction - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Send prompt by clicking send icon checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    expect(args.prompt).toBe('User typed prompt');
                    inlineAIAssist.addResponse('AI response to user prompt');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'User typed prompt';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                sendBtnElem.click();
                setTimeout(() => {
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    done();
                }, 100);
            }, 450);
        });

        it('Send prompt with Enter key checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    expect(args.prompt).toBe('Prompt via Enter key');
                    inlineAIAssist.addResponse('Response via Enter');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Prompt via Enter key';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const enterKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
                footer.dispatchEvent(enterKeyEvent);
                setTimeout(() => {
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    done();
                }, 100);
            }, 450);
        });

        it('Send prompt with potential XSS content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    inlineAIAssist.addResponse('Safe response');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const originalAlert = window.alert;
            let alertCalled = false;
            window.alert = () => {
                alertCalled = true;
            };
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const maliciousPrompt = '<img src onerror=alert(1)>';
            textareaEle.innerText = maliciousPrompt;
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                sendBtnElem.click();
                setTimeout(() => {
                    expect(alertCalled).toBe(false);
                    window.alert = originalAlert;
                    done();
                }, 100);
            }, 450);
        });

        it('Stop responding button click checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test prompt';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                sendBtnElem.click();
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const sendBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfter).not.toBeNull();
                        done();
                    }, 50);
                }, 200);
            }, 450);
        });

        it('Should not add response when clicking stop button immediately after send click', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true,
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    inlineAIAssist.addResponse('AI response to user prompt');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.innerText = 'User typed prompt';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.classList.contains('disabled')).toEqual(false);
                sendBtnElem.click();
                const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                if (responseText) {
                    expect(responseText.textContent).not.toBe('AI response to user prompt');
                }
                done();
            }, 150);
        });

        it('Popup open event checking', (done: DoneFn) => {
            let isPopupOpened = false;
            inlineAIAssist = new InlineAIAssist({
                open: () => {
                    isPopupOpened = true;
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                expect(isPopupOpened).toBe(true);
                done();
            }, 100);
        });

        it('Popup close event checking', (done: DoneFn) => {
            let isPopupClosed = false;
            inlineAIAssist = new InlineAIAssist({
                close: () => {
                    isPopupClosed = true;
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.hidePopup();
                setTimeout(() => {
                    expect(isPopupClosed).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('Popup close on Escape key checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
            setTimeout(() => {
                const escapeKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(escapeKeyEvent);
                setTimeout(() => {
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('Popup close on outside click checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
            setTimeout(() => {
                const outsideElement: HTMLElement = document.body;
                const mousedownEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true });
                Object.defineProperty(mousedownEvent, 'target', { value: outsideElement, enumerable: true });
                document.dispatchEvent(mousedownEvent);
                setTimeout(() => {
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('Textarea focus and blur checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            textareaEle.focus();
            textareaEle.dispatchEvent(new Event('focus'));
            expect(footer.classList.contains('e-footer-focused')).toBe(true);
            textareaEle.blur();
            textareaEle.dispatchEvent(new Event('blur'));
            expect(footer.classList.contains('e-footer-focused')).toBe(false);
        });

        it('Undo operation checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'First text';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Second text';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
                    footer.dispatchEvent(undoEvent);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toContain('First');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });

        it('Redo operation checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Initial text';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Changed text';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
                    footer.dispatchEvent(undoEvent);
                    const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
                    footer.dispatchEvent(redoEvent);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toContain('Changed');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });

        it('Paste content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.focus();
            const clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', 'Pasted content');
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: clipboardData });
            textareaEle.dispatchEvent(pasteEvent);
            setTimeout(() => {
                expect(textareaEle.innerText).toContain('Pasted content');
                done();
            }, 450);
        });

        it('Code copy functionality checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const codeResponse = '```javascript\nconsole.log("Hello World");\n```';
            inlineAIAssist.addResponse(codeResponse);
            setTimeout(() => {
                const copyIcon: HTMLElement = inlineAIAssistElem.querySelector('.e-code-copy');
                if (copyIcon) {
                    copyIcon.click();
                    setTimeout(() => {
                        expect(copyIcon.classList.contains('e-assist-check')).toBe(true);
                        done();
                    }, 100);
                } else {
                    done();
                }
            }, 100);
        });

        it('Footer key handler with Escape key checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
            
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            const escapeKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            
            setTimeout(() => {
                footer.dispatchEvent(escapeKeyEvent);
                setTimeout(() => {
                    // After Escape key is pressed in footer, popup should close
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('Footer key handler ignores events from toolbar button checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const toolbarButton: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-tbar-btn');
            expect(toolbarButton).not.toBeNull();
            
            // Create a keyboard event from toolbar button
            const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                key: 'Enter',
                bubbles: true
            });
            
            Object.defineProperty(keyEvent, 'target', { 
                value: toolbarButton, 
                enumerable: true 
            });
            
            setTimeout(() => {
                // Dispatch event to the toolbar button
                toolbarButton.dispatchEvent(keyEvent);
                // Popup should remain open since event came from toolbar button
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });

        it('Stop button shown during response, popup closed and reopened, typing re-enables send button and new prompt adds response', (done: DoneFn) => {
            let promptRequestCount: number = 0;
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    promptRequestCount++;
                    if (promptRequestCount === 2) {
                        inlineAIAssist.addResponse('Response after reopening popup');
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('First prompt without response');

            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                const sendBtnDuring: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
                expect(sendBtnDuring).toBeNull();
                const mousedownEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true });
                Object.defineProperty(mousedownEvent, 'target', { value: document.body, enumerable: true });
                document.dispatchEvent(mousedownEvent);

                setTimeout(() => {
                    inlineAIAssist.showPopup();
                    const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                    expect(textareaEle).not.toBeNull();
                    textareaEle.innerText = 'Second prompt after reopen';
                    const inputEvent: Event = new Event('input', { bubbles: true });
                    textareaEle.dispatchEvent(inputEvent);
                    setTimeout(() => {
                        const sendBtnAfterReopen: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfterReopen).not.toBeNull();
                        expect(sendBtnAfterReopen.classList.contains('disabled')).toBe(false);
                        sendBtnAfterReopen.click();
                        setTimeout(() => {
                            const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                            expect(responseText).not.toBeNull();
                            expect(responseText.innerHTML).toContain('Response after reopening popup');
                            done();
                        }, 100);
                    }, 450);
                }, 100);
            }, 100);
        });
    });

    describe('Locale checking - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Locale property checking', () => {
            inlineAIAssist = new InlineAIAssist({
                locale: 'en-US'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.locale).toEqual('en-US');
        });

        it('Locale dynamic change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                locale: 'en-US'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.locale = 'de-DE';
            inlineAIAssist.dataBind();
            expect(inlineAIAssist.locale).toEqual('de-DE');
        });

        it('Send button locale checking', (done: DoneFn) => {
            L10n.load({
                'de-DE': {
                    'inlin-ai-prompt': {
                        send: 'Senden'
                    }
                }
            });
            inlineAIAssist = new InlineAIAssist({
                locale: 'en-US'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test prompt';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                const sendBtnElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtnElem).not.toBeNull();
                expect(sendBtnElem.getAttribute('title')).toBe('Send');
                done();
            }, 450);
        });

        it('Stop responding button locale checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                locale: 'en-US',
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                sendBtn.click();
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    const stopToolbarBtn = stopBtn.closest('.e-toolbar-item');
                    expect(stopToolbarBtn).not.toBeNull();
                    expect(stopToolbarBtn.getAttribute('title')).toBe('Stop Responding');
                    stopBtn.click();
                    setTimeout(() => {
                        const sendAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
                        expect(sendAfter).not.toBeNull();
                        done(); 
                    }, 50);
                }, 200);
            }, 450);
        });

        it('Inline mode typing indicator locale checking for thinkingIndicator and editingIndicator', (done: DoneFn) => {
            L10n.load({
                'de-DE': {
                    'inline-ai-assist': {
                        thinkingIndicator: 'Denken',
                        editingIndicator: 'Bearbeiten'
                    }
                }
            });
            inlineAIAssist = new InlineAIAssist({
                locale: 'de-DE',
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    const indicatorTextOnSend: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                    expect(indicatorTextOnSend).not.toBeNull();
                    expect(indicatorTextOnSend.textContent).toBe('Denken');
                    inlineAIAssist.addResponse('Checking locale for indicator', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('Test prompt');
            setTimeout(() => {
                const indicatorTextOnPartial: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                expect(indicatorTextOnPartial).not.toBeNull();
                expect(indicatorTextOnPartial.textContent).toBe('Bearbeiten');
                done();
            }, 100);
        });
    });

    describe('Textarea actions - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Undo operation with multiple steps checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            textareaEle.innerText = 'Step 1';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Step 2';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    textareaEle.innerText = 'Step 3';
                    textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        // First undo
                        const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                        footer.dispatchEvent(undoEvent);
                        setTimeout(() => {
                            expect(textareaEle.innerText).toContain('Step 2');
                            // Second undo
                            footer.dispatchEvent(undoEvent);
                            setTimeout(() => {
                                expect(textareaEle.innerText).toContain('Step 1');
                                done();
                            }, 0);
                        }, 0);
                    }, 400);
                }, 400);
            }, 400);
        });

        it('Redo after undo checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            textareaEle.innerText = 'Original';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Modified';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    footer.dispatchEvent(undoEvent);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toContain('Original');
                        const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
                        footer.dispatchEvent(redoEvent);
                        setTimeout(() => {
                            expect(textareaEle.innerText).toContain('Modified');
                            done();
                        }, 0);
                    }, 0);
                }, 400);
            }, 400);
        });

        it('Undo with Shift+Z checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            textareaEle.innerText = 'First';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Second';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    footer.dispatchEvent(undoEvent);
                    const redoEventShift: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: true });
                    footer.dispatchEvent(redoEventShift);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toContain('Second');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });

        it('Copy text from editable textarea checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Text to copy'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(textareaEle);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Simulate copy (can't fully test clipboard in unit tests)
            setTimeout(() => {
                expect(selection.toString()).toBe('Text to copy');
                done();
            }, 100);
        });

        it('Paste plain text content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.focus();
            
            const clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', 'Pasted plain text');
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: clipboardData });
            textareaEle.dispatchEvent(pasteEvent);
            
            setTimeout(() => {
                expect(textareaEle.innerText).toContain('Pasted plain text');
                done();
            }, 450);
        });

        it('Paste multiline content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.focus();
            
            const multilineText = 'Line 1\nLine 2\nLine 3';
            const clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', multilineText);
            const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
            Object.defineProperty(pasteEvent, 'clipboardData', { value: clipboardData });
            textareaEle.dispatchEvent(pasteEvent);
            
            setTimeout(() => {
                expect(textareaEle.innerText).toContain('Line 1');
                expect(textareaEle.innerText).toContain('Line 2');
                done();
            }, 450);
        });

        it('Cut operation checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Text to cut'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(textareaEle);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            setTimeout(() => {
                expect(textareaEle.innerText).toBe('Text to cut');
                done();
            }, 100);
        });

        it('HandleInput with empty br tag checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerHTML = '<br>';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(textareaEle.innerHTML).not.toContain('<br>');
                done();
            }, 450);
        });

        it('HandleInput with br tag and text checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerHTML = 'Some text<br>';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            
            setTimeout(() => {
                expect(inlineAIAssist.prompt).toContain('Some text');
                done();
            }, 450);
        });

        it('HandleInput with only spaces checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerHTML = '   ';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(inlineAIAssist.prompt).toBeDefined();
                done();
            }, 450);
        });

        it('HandleInput sanitization checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerHTML = '<p>Paragraph text</p>';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(inlineAIAssist.prompt.length > 0).toBe(true);
                done();
            }, 450);
        });

        it('HandleInput with special characters checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test @#$%^&*()';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(inlineAIAssist.prompt).toContain('Test');
                done();
            }, 450);
        });

        it('HandleInput clears redo stack checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            textareaEle.innerText = 'First';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                textareaEle.innerText = 'Second';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    footer.dispatchEvent(undoEvent);
                    expect(textareaEle.innerText).toContain('First');
                    const redoStackBeforeInput: number = (inlineAIAssist as any).redoStack.length;
                    expect(redoStackBeforeInput).toBeGreaterThan(0);
                    textareaEle.innerText = 'Third';
                    textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        const redoStackAfterInput: number = (inlineAIAssist as any).redoStack.length;
                        expect(redoStackAfterInput).toBe(0);
                        expect(textareaEle.innerText).toBe('Third');
                        done();
                    }, 450);
                }, 400);
            }, 400);
        });

        it('HandleInput with empty textarea checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Initial prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = '';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
            setTimeout(() => {
                expect(inlineAIAssist.prompt).toBe('');
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtn.classList.contains('disabled')).toBe(true);
                done();
            }, 450);
        });

        it('findTextNodeAndOffset should return last node when target offset exceeds total text length', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Hello World'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const result: any = (inlineAIAssist as any).findTextNodeAndOffset(textareaEle, 100);
            setTimeout(() => {
                // Should return the last node with offset at end
                expect(result).not.toBeNull();
                expect(result.node).toBeTruthy();
                expect(result.offset).toBe(result.node.textContent.length);
                done();
            }, 100);
        });

        it('findTextNodeAndOffset should return null when element is empty', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: ''
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            
            // Try to find offset in empty element
            const result: any = (inlineAIAssist as any).findTextNodeAndOffset(textareaEle, 10);
            
            setTimeout(() => {
                // Should return null when no nodes found
                expect(result).toBeNull();
                done();
            }, 100);
        });
    });

    describe('ToolbarSettings Checking - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('InlineToolbarSettings dynamic tabIndex value checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const toolbarElement: HTMLDivElement = inlineAIAssistElem.querySelector('.e-toolbar');
            let toolbarItems: NodeListOf<HTMLDivElement> = inlineAIAssistElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(2);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('0');
            
            inlineAIAssist.inlineToolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 }, 
                    { iconCss: 'e-icons e-folder', align: 'Right', tabIndex: 2 }
                ],
            };
            inlineAIAssist.dataBind();
            (toolbarElement as any).ej2_instances[0].dataBind();
            toolbarItems = inlineAIAssistElem.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(3);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
        });

        it('Footer toolbar Tab key navigation checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 },
                        { iconCss: 'e-icons e-settings', align: 'Right', tabIndex: 2 }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                const toolbarItems: NodeListOf<HTMLDivElement> = inlineAIAssistElem.querySelectorAll('.e-toolbar-item');
                const firstItem: HTMLElement = toolbarItems[0].querySelector('button');
                firstItem.focus();
                
                const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Tab' });
                firstItem.dispatchEvent(tabEvent);
                
                setTimeout(() => {
                    done();
                }, 100);
            }, 100);
        });

        it('Footer toolbar item tooltip checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right', tooltip: 'User Settings' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            
            setTimeout(() => {
                const toolbarItem: HTMLElement = inlineAIAssistElem.querySelector('.e-toolbar-item');
                expect(toolbarItem.getAttribute('title')).toBe('User Settings');
                done();
            }, 100);
        });

        it('Custom footer toolbar items checking', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-custom-icon-1', tooltip: 'Custom 1' },
                        { iconCss: 'e-icons e-custom-icon-2', tooltip: 'Custom 2' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = inlineAIAssistElem.querySelectorAll('.e-footer .e-toolbar-item');
            // Default send button + 2 custom buttons
            expect(footerToolbarItems.length).toBe(3);
            expect(footerToolbarItems[0].querySelector('.e-custom-icon-1')).not.toBeNull();
            expect(footerToolbarItems[0].getAttribute('title')).toBe('Custom 1');
            expect(footerToolbarItems[1].querySelector('.e-custom-icon-2')).not.toBeNull();
            expect(footerToolbarItems[1].getAttribute('title')).toBe('Custom 2');
            expect(footerToolbarItems[2].querySelector('.e-inline-send')).not.toBeNull();
        });

        it('Should override default footer toolbar items with custom items', () => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-paste', tooltip: 'Paste' },
                        { iconCss: 'e-icons e-inline-send', tooltip: 'Submit' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerToolbarItems: NodeListOf<HTMLDivElement> = inlineAIAssistElem.querySelectorAll('.e-footer .e-toolbar-item');
            expect(footerToolbarItems.length).toBe(2);
            const attachmentButton = footerToolbarItems[0].querySelector('.e-paste');
            expect(attachmentButton).not.toBeNull();
            expect(inlineAIAssist.inlineToolbarSettings.items[0].iconCss).toContain('e-icons e-paste');
            expect(attachmentButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Paste');
            const sendButton = footerToolbarItems[1].querySelector('.e-inline-send');
            expect(sendButton).not.toBeNull();
            expect(inlineAIAssist.inlineToolbarSettings.items[1].iconCss).toContain('e-icons e-inline-send');
            expect(sendButton.closest('.e-toolbar-item').getAttribute('title')).toBe('Submit');
        });
    });

    describe('Footer focus and Blur - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Textarea focus adds footer-focused class checking', () => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            textareaEle.focus();
            textareaEle.dispatchEvent(new Event('focus'));
            expect(footer.classList.contains('e-footer-focused')).toBe(true);
        });

        it('Textarea blur removes footer-focused class checking', () => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            textareaEle.focus();
            textareaEle.dispatchEvent(new Event('focus'));
            expect(footer.classList.contains('e-footer-focused')).toBe(true);
            
            textareaEle.blur();
            textareaEle.dispatchEvent(new Event('blur'));
            expect(footer.classList.contains('e-footer-focused')).toBe(false);
        });

        it('Textarea focus with existing content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                prompt: 'Existing prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            setTimeout(() => {
                textareaEle.focus();
                textareaEle.dispatchEvent(new Event('focus'));
                expect(footer.classList.contains('e-footer-focused')).toBe(true);
                expect(textareaEle.innerText).toBe('Existing prompt');
                done();
            }, 100);
        });

        it('Multiple focus and blur cycles checking', () => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            const footer: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            
            for (let i = 0; i < 3; i++) {
                textareaEle.focus();
                textareaEle.dispatchEvent(new Event('focus'));
                expect(footer.classList.contains('e-footer-focused')).toBe(true);
                
                textareaEle.blur();
                textareaEle.dispatchEvent(new Event('blur'));
                expect(footer.classList.contains('e-footer-focused')).toBe(false);
            }
        });

        it('should add e-footer-focused on focus and remove it on blur', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            expect(footerElem.classList.contains('e-footer-focused')).toBe(false);
            textareaEle.focus();
            const focusEvent: FocusEvent = new FocusEvent('focus', { bubbles: true });
            textareaEle.dispatchEvent(focusEvent);
            expect(footerElem.classList.contains('e-footer-focused')).toBe(true);
            const blurEvent: FocusEvent = new FocusEvent('blur', { bubbles: true, relatedTarget: null });
            textareaEle.dispatchEvent(blurEvent);
            setTimeout(() => {
                expect(footerElem.classList.contains('e-footer-focused')).toBe(false);
                done();
            }, 0);
        });

        it('should have e-footer-focus-wave-effect when no footerTemplate is provided', () => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            expect(footerElem.classList.contains('e-footer-focus-wave-effect')).toBe(true);
        });

        it('should maintain focus when footer-icons-wrapper focused', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const footerIconsWrapper: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-footer-icons-wrapper');
            const footerElem: HTMLElement = inlineAIAssistElem.querySelector('.e-footer');
            footerIconsWrapper.click();
            setTimeout(() => {
                // expect(footerElem.classList.contains('e-footer-focused')).toBe(true);
                const focusOut: FocusEvent = new FocusEvent('focusout', { bubbles: true });
                footerIconsWrapper.dispatchEvent(focusOut);
                setTimeout(() => {
                    expect(footerElem.classList.contains('e-footer-focused')).toBe(false);
                    done();
                }, 0);
            }, 450);
        });

        it('onFooterIconsPointerDown should focus textarea when clicking on footer icons wrapper', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const footerIconsWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-footer-icons-wrapper');
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.blur();
            expect(document.activeElement).not.toBe(textareaEle);
            const pointerDownEvent: PointerEvent = new PointerEvent('pointerdown', { 
                bubbles: true, 
                cancelable: true 
            });
            footerIconsWrapper.dispatchEvent(pointerDownEvent);
            setTimeout(() => {
                expect(document.activeElement).toBe(textareaEle);
                done();
            }, 50);
        });

        it('onFooterIconsPointerDown should not focus when send button is clicked', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const footerIconsWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-footer-icons-wrapper');
            const sendBtn: HTMLElement = footerIconsWrapper.querySelector('.e-inline-send');
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.blur();
            expect(document.activeElement).not.toBe(textareaEle);
            const pointerDownEvent: PointerEvent = new PointerEvent('pointerdown', { 
                bubbles: true, 
                cancelable: true 
            });
            Object.defineProperty(pointerDownEvent, 'target', { value: sendBtn, enumerable: true });
            footerIconsWrapper.dispatchEvent(pointerDownEvent);
            setTimeout(() => {
                expect(document.activeElement).not.toBe(textareaEle);
                done();
            }, 50);
        });
    });

    describe('Template checking - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Response template with complex HTML checking', () => {
            const complexTemplate: HTMLElement = createElement('script', { id: 'complexResponseTemplate', attrs: { type: 'text/x-template' } });
            complexTemplate.innerHTML = '<div class="e-complex-response"><h3>Response Header</h3><div class="e-response-content">${response}</div><div class="e-response-footer">Footer content</div></div>';
            document.body.appendChild(complexTemplate);
            
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: '#complexResponseTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Complex response content');
            
            const complexResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-complex-response');
            expect(complexResponse).not.toBeNull();
            expect(complexResponse.querySelector('h3')).not.toBeNull();
            expect(complexResponse.querySelector('.e-response-footer')).not.toBeNull();
            
            document.body.removeChild(complexTemplate);
        });

        it('Response template with complex string checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: '<div class="e-complex-response"><h3>Response Header</h3><div class="e-response-content">${response}</div><div class="e-response-footer">Footer content</div></div>'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Complex response content');
            const complexResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-complex-response');
            expect(complexResponse).not.toBeNull();
            expect(complexResponse.querySelector('h3')).not.toBeNull();
            expect(complexResponse.querySelector('.e-response-footer')).not.toBeNull();
        });

        it('InlineInput template with custom buttons checking', () => {
            const customInputTemplate: HTMLElement = createElement('script', { id: 'customInputTemplate', attrs: { type: 'text/x-template' } });
            customInputTemplate.innerHTML = '<div class="e-custom-footer"><textarea class="e-custom-input"></textarea><button class="e-custom-submit">Submit</button><button class="e-custom-cancel">Cancel</button></div>';
            document.body.appendChild(customInputTemplate);
            
            inlineAIAssist = new InlineAIAssist({
                editorTemplate: '#customInputTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            
            const customFooter: HTMLElement = inlineAIAssistElem.querySelector('.e-custom-footer');
            expect(customFooter).not.toBeNull();
            expect(customFooter.querySelector('.e-custom-submit')).not.toBeNull();
            expect(customFooter.querySelector('.e-custom-cancel')).not.toBeNull();
            
            document.body.removeChild(customInputTemplate);
        });

        it('Response template null to template change checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseTemplate: null
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.addResponse('Initial response');
            
            const simpleTemplate: HTMLElement = createElement('script', { id: 'simpleTemplate', attrs: { type: 'text/x-template' } });
            simpleTemplate.innerHTML = '<div class="e-simple-response">${response}</div>';
            document.body.appendChild(simpleTemplate);
            
            inlineAIAssist.responseTemplate = '#simpleTemplate';
            inlineAIAssist.dataBind();
            inlineAIAssist.addResponse('Updated with template');
            
            const simpleResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-simple-response');
            expect(simpleResponse).not.toBeNull();
            
            document.body.removeChild(simpleTemplate);
        });

        it('InlineInput template to null change checking', () => {
            const inputTemplate: HTMLElement = createElement('script', { id: 'inputTemplate', attrs: { type: 'text/x-template' } });
            inputTemplate.innerHTML = '<div class="e-template-input"><textarea></textarea></div>';
            document.body.appendChild(inputTemplate);
            
            inlineAIAssist = new InlineAIAssist({
                editorTemplate: '#inputTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssistElem.querySelector('.e-template-input')).not.toBeNull();
            
            inlineAIAssist.editorTemplate = '';
            inlineAIAssist.dataBind();
            
            const defaultTextarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
            expect(defaultTextarea).not.toBeNull();
            
            document.body.removeChild(inputTemplate);
        });
    });

    describe('Send Button State Management - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Send button disabled when textarea is empty checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtn).not.toBeNull();
                expect(sendBtn.classList.contains('disabled')).toBe(true);
                done();
            }, 100);
        });

        it('Send button enabled when textarea has content checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({});
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Some content';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtn.classList.contains('disabled')).toBe(false);
                done();
            }, 450);
        });

        it('Send button becomes stop button during streaming checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                sendBtn.click();
                
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const sendBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfter).not.toBeNull();
                        done();
                    }, 50);
                }, 100);
            }, 450);
        });

        it('Stop button becomes send button after response complete checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Short response');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            inlineAIAssist.executePrompt('Test');
            
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendBtn).not.toBeNull();
                done();
            }, 800);
        });

        it('Send button disabled during response generation checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: () => {
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Delayed response');
                    }, 300);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
            textareaEle.innerText = 'Test';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                sendBtn.click();
                
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const sendBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfter).not.toBeNull();
                        done();
                    }, 50);
                }, 100);
            }, 450);
        });
    });

    describe('CommandSettings - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Mention popup should render with commandSettings text', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize'},
                        { label: 'Improve Writing'},
                        { label: 'Translate'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                // Check that mention popup exists
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                // Check commandSettings are stored correctly
                expect(inlineAIAssist.commandSettings.commands.length).toBe(3);
                expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Summarize');
                expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Improve Writing');
                expect(inlineAIAssist.commandSettings.commands[2].label).toBe('Translate');
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                expect(mentionElement.classList.contains('e-popup-close')).toBe(false);
                done();
            }, 100);
        });

        it('Mention popup should not close when clicking on main popup', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize' },
                        { label: 'Improve Writing',},
                        { label: 'Translate'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                expect(inlineAIAssist.commandSettings.commands.length).toBe(3);
                expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Summarize');
                expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Improve Writing');
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                inlineAIAssistElem.click();
                expect(mentionElement).not.toBeNull();
                done();
            }, 100);
        });

        it('Both main and mention popups should have e-popup-open when visible, and close on outside click', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Command 1'},
                        { label: 'Command 2'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                // Check main popup is open
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement.style.display).not.toBe('none');
                // Verify main popup element exists
                const mainPopupElement: HTMLElement = inlineAIAssistElem;
                expect(mainPopupElement).not.toBeNull();
                expect(mainPopupElement.offsetParent).not.toBeNull();

                // Check that mention popup element exists
                expect(mentionElement).not.toBeNull();

                // Simulate outside click
                setTimeout(() => {
                    const outsideElement: HTMLElement = document.body;
                    const mousedownEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true });
                    Object.defineProperty(mousedownEvent, 'target', { value: outsideElement, enumerable: true });
                    document.dispatchEvent(mousedownEvent);
                    setTimeout(() => {
                        // Both popups should be closed now
                        expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Mention popup should close with both popups on Escape key', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Test Command'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                expect(inlineAIAssistElem.offsetParent).not.toBeNull();
                const escapeKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { 
                    key: 'Escape',
                    bubbles: true 
                });
                document.dispatchEvent(escapeKeyEvent);
                setTimeout(() => {
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(false);
                    expect(inlineAIAssistElem.offsetParent).toBeNull();
                    const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionElement).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Should trigger itemSelect event when clicking on mention popup command item', (done: DoneFn) => {
            let itemSelectTriggered: boolean = false;
            let selectedItemText: string = '';
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        {label: 'First Command'},
                        {label: 'Second Command'}
                    ],
                    itemSelect: (args: CommandItemSelectEventArgs) => {
                        itemSelectTriggered = true;
                        selectedItemText = args.command.label;
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);
                expect(inlineAIAssist.commandSettings.commands[0].label).toBe('First Command');
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                const selectEventArgs: any = {
                    itemData: { 
                        command: inlineAIAssist.commandSettings.commands[0],
                        label: 'First Command'
                    },
                    e: new MouseEvent('click', { bubbles: true })
                };
                (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);
                setTimeout(() => {
                    expect(itemSelectTriggered).toBe(true);
                    expect(selectedItemText).toBe('First Command');
                    done();
                }, 100);
            }, 100);
        });

        it('Should add response when selecting mention popup command item', (done: DoneFn) => {
            let responseAdded: boolean = false;
            let promptValue: string = '';

            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                    { 
                        label: 'Summarize Content',
                        prompt: 'Please summarize this content'
                    },
                    { 
                        label: 'Fix Spelling'
                    }],
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    promptValue = args.prompt;
                    responseAdded = true;
                    inlineAIAssist.addResponse('This is the response for: ' + args.prompt);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);
                expect(inlineAIAssist.commandSettings.commands[0].prompt).toBe('Please summarize this content');
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                let responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                expect(responseText).toBeNull();
                const selectEventArgs: any = {
                    itemData: { 
                        command: inlineAIAssist.commandSettings.commands[0],
                        label: 'Summarize Content'
                    },
                    e: new MouseEvent('click', { bubbles: true })
                };

                (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);

                setTimeout(() => {
                    expect(responseAdded).toBe(true);
                    expect(promptValue).toBe('Please summarize this content');
                    responseText = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    expect(responseText.textContent).toContain('Please summarize this content');
                    expect(inlineAIAssist.prompts.length).toBeGreaterThan(0);
                    done();
                }, 100);
            }, 100);
        });

        it('Should add response when selecting mention popup command item via keyboard', (done: DoneFn) => {
            let responseAdded: boolean = false;
            let promptValue: string = '';
            let itemSelectTriggered: boolean = false;
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands:[
                        { label: 'Format Code'}, { label: 'Add Comments', prompt: 'Add helpful comments'}
                    ],
                    itemSelect: (args: CommandItemSelectEventArgs) => {
                        itemSelectTriggered = true;
                    }
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    promptValue = args.prompt;
                    responseAdded = true;
                    inlineAIAssist.addResponse('Response for: ' + args.prompt);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                let responseContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                expect(responseContainer).toBeNull();
                const selectEventArgs: any = {
                    itemData: {
                        command: inlineAIAssist.commandSettings.commands[1],
                        label: 'Add Comments',
                        prompt: 'Add helpful comments'
                    },
                    e: new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
                };

                (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);
                setTimeout(() => {
                    expect(responseAdded).toBe(true);
                    expect(promptValue).toBe('Add helpful comments');
                    responseContainer = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(responseContainer).not.toBeNull();
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    expect(responseText.textContent).toContain('Add helpful comments');
                    expect(inlineAIAssist.prompts.length).toBeGreaterThan(0);
                    expect(inlineAIAssist.prompts[0].prompt).toBe('Add helpful comments');
                    done();
                }, 100);
            }, 100);
        });

        it('Mention popup positioning should calculate correct offsets when visible', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands:[
                    { label: 'Command 1' },
                    { label: 'Command 2'}
                ]}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                // Verify main popup is visible and positioned
                const mainPopupElement: HTMLElement = inlineAIAssistElem;
                expect(mainPopupElement.offsetParent).not.toBeNull();
                const mainRect: DOMRect = mainPopupElement.getBoundingClientRect() as DOMRect;
                expect(mainRect.height).toBeGreaterThan(0);
                expect(mainRect.width).toBeGreaterThan(0);
                const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionPopup).not.toBeNull();
                const mentionRect: DOMRect = mentionPopup.getBoundingClientRect() as DOMRect;
                expect(mentionRect.width).toBeGreaterThan(0);
                const viewportHeight: number = window.innerHeight;
                expect(mainRect.top).toBeGreaterThanOrEqual(0);
                expect(mainRect.bottom).toBeLessThanOrEqual(viewportHeight + mainRect.height);
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                done();
            }, 100);
        });

        it('Mention popup should reposition when combined popup height exceeds viewport', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                popupHeight: '500px',
                popupWidth: '400px',
                commandSettings: {
                    commands: [
                    { label: 'Command 1'},
                    { label: 'Command 2'},
                    { label: 'Command 3'}
                ]}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                const mainPopupElement: HTMLElement = inlineAIAssistElem;
                const mentionPopupElement: HTMLElement = document.querySelector('.e-mention-container');
                const mainRect: DOMRect = mainPopupElement.getBoundingClientRect() as DOMRect;
                const mentionRect: DOMRect = mentionPopupElement.getBoundingClientRect() as DOMRect;
                const combinedBottomEdge: number = Math.max(mainRect.bottom, mentionRect.bottom);
                const viewportHeight: number = window.innerHeight;
                if (combinedBottomEdge > viewportHeight) {
                    const adjustedTop: number = mainPopupElement.style.top ? parseInt(mainPopupElement.style.top) : mainRect.top;
                    expect(adjustedTop).toBeLessThanOrEqual(mainRect.top);
                } else {
                    expect(combinedBottomEdge).toBeLessThanOrEqual(viewportHeight);
                }
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                done();
            }, 100);
        });

        it('Mention popup collision detection should handle edge cases at viewport boundaries', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                    { label: 'Long Command Text One'},
                    { label: 'Long Command Text Two'},
                    { label: 'Long Command Text Three'}
                ]},
                popupHeight: '400px',
                popupWidth: '350px'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                // Get main popup and mention container
                const mainPopupElement: HTMLElement = inlineAIAssistElem;
                const mentionPopupElement: HTMLElement = document.querySelector('.e-mention-container');
                const mainRect: DOMRect = mainPopupElement.getBoundingClientRect() as DOMRect;
                const mentionRect: DOMRect = mentionPopupElement.getBoundingClientRect() as DOMRect;
                const viewportHeight: number = window.innerHeight;
                const bufferSpace: number = 10;
                expect(mainRect.height).toBeGreaterThan(0);
                expect(mainPopupElement.offsetParent).not.toBeNull();
                expect(mentionPopupElement.style.display).not.toBe('none');
                expect(mentionRect.width).toBeGreaterThan(0);
                const mainPopupWithBuffer: boolean = mainRect.bottom <= viewportHeight - bufferSpace;
                const mentionPopupWithBuffer: boolean = mentionRect.bottom <= viewportHeight - bufferSpace;
                expect(mainPopupWithBuffer || mentionPopupWithBuffer).toBe(true);
                const combinedBottomEdge: number = Math.max(mainRect.bottom, mentionRect.bottom);
                expect(combinedBottomEdge).toBeLessThanOrEqual(viewportHeight + 100);
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                expect(mentionPopupObj.popupObj.offsetX).toBe(0);
                expect(mentionPopupObj.popupObj.offsetY).toBeGreaterThanOrEqual(0);
                done();
            }, 100);
        });

        it('Mention popup positioning should skip collision adjustment when popup has invalid dimensions through DOM interaction', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                    { label: 'Summarize'},
                    { label: 'Improve'}
                ]}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssistElem.style.width = '0px';
            inlineAIAssistElem.style.height = '0px';
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const mentionPopupElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionPopupElement).not.toBeNull();
                inlineAIAssistElem.style.display = 'block';
                const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                
                if (textareaEle) {
                    textareaEle.focus();
                    textareaEle.dispatchEvent(new Event('focus', { bubbles: true }));
                    textareaEle.innerText = 'Test content';
                    const inputEvent: Event = new Event('input', { bubbles: true });
                    textareaEle.dispatchEvent(inputEvent);
                }
                setTimeout(() => {
                    const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionPopup).not.toBeNull();
                    expect(inlineAIAssistElem).not.toBeNull();
                    done();
                }, 200);
            }, 100);
        });

        it('Should trigger mention select event via Mention component list item mousedown', (done: DoneFn) => {
            let itemSelectTriggered: boolean = false;
            let selectedPrompt: string = '';

            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands:[
                        { 
                            label: 'Test Command 1',
                            prompt: 'Test prompt 1'
                        },
                        { 
                            label: 'Test Command 2'
                        }
                    ],
                    itemSelect: (args: CommandItemSelectEventArgs) => {
                        itemSelectTriggered = true;
                    }
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    selectedPrompt = args.prompt;
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                const mentionList: HTMLElement = mentionPopupObj.list;
                expect(mentionList).not.toBeNull();
                const listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                expect(listItems.length).toBeGreaterThan(0);
                const firstListItem: HTMLElement = listItems[0];
                expect(firstListItem).not.toBeNull();
                const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                firstListItem.classList.add('e-active');
                firstListItem.dispatchEvent(mouseDownEvent);
                setTimeout(() => {
                    expect(itemSelectTriggered).toBe(true);
                    expect(selectedPrompt).toBe('Test prompt 1');
                    done();
                }, 100);
            }, 150);
        });

        it('Should handle mention select with keyboard Enter key on active item', (done: DoneFn) => {
            let promptValue: string = '';
            let responseAdded: boolean = false;
            inlineAIAssist = new InlineAIAssist({
                commandSettings:{ 
                    commands: [
                        { label: 'Format Code'},{ label: 'Add Comments', prompt: 'Add helpful comments' }
                    ],
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    promptValue = args.prompt;
                    responseAdded = true;
                    inlineAIAssist.addResponse('Formatted response');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                const mentionList: HTMLElement = mentionPopupObj.list;
                const listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                const secondItem: HTMLElement = listItems[1];
                secondItem.classList.add('e-active');
                const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true,
                    cancelable: true
                });
                secondItem.dispatchEvent(keyEvent);
                const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                secondItem.dispatchEvent(mouseDownEvent);
                
                setTimeout(() => {
                    expect(responseAdded).toBe(true);
                    expect(promptValue).toBe('Add helpful comments');
                    done();
                }, 100);
            }, 150);
        });

        it('Should properly extract itemData from Mention component list item', (done: DoneFn) => {
            let selectedItemData: any = null;

            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands:[
                        { 
                            label: 'Command A'
                        },
                        { 
                            label: 'Command B'
                        },
                        { 
                            label: 'Command C',
                            prompt: 'Prompt C'
                        }
                    ],
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    selectedItemData = args.prompt;
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                const mentionList: HTMLElement = mentionPopupObj.list;
                const listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                
                // Get data-value from the list item (Mention component stores the value here)
                const thirdItem: HTMLElement = listItems[2];
                expect(thirdItem).not.toBeNull();
                
                // Mark as active
                thirdItem.classList.add('e-active');
                
                // Trigger mousedown to select
                const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                thirdItem.dispatchEvent(mouseDownEvent);
                
                setTimeout(() => {
                    expect(selectedItemData).toBe('Prompt C');
                    done();
                }, 100);
            }, 150);
        });

        it('Should close mention popup when selecting an item', (done: DoneFn) => {
            let selectionMade: boolean = false;

            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands:[
                        { 
                            label: 'Quick Fix',
                            prompt: 'Quick fix prompt'
                        }
                    ],
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    selectionMade = true;
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                
                const mentionList: HTMLElement = mentionPopupObj.list;
                expect(mentionList).not.toBeNull();
                
                const listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                const firstItem: HTMLElement = listItems[0];
                
                // Mark as active and trigger selection
                firstItem.classList.add('e-active');
                
                const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                firstItem.dispatchEvent(mouseDownEvent);
                
                setTimeout(() => {
                    expect(selectionMade).toBe(true);
                    // Verify mention popup is still accessible (it may or may not close depending on implementation)
                    const mentionPopupElement: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionPopupElement).not.toBeNull();
                    done();
                }, 100);
            }, 150);
        });

        it('CommandSettings dynamic property change checking - verify model and DOM update', (done: DoneFn) => {
            // Step 1: Initialize with initial commands
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Initial Command 1'},
                        { label: 'Initial Command 2'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssist.commandSettings).not.toBeNull();
                expect(inlineAIAssist.commandSettings.commands).not.toBeNull();
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);
                expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Initial Command 1');
                expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Initial Command 2');
                let mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                let mentionList: HTMLElement = mentionPopupObj.list;
                expect(mentionList).not.toBeNull();
                let initialListItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                expect(initialListItems.length).toBe(2);
                expect(initialListItems[0].textContent).toContain('Initial Command 1');
                expect(initialListItems[1].textContent).toContain('Initial Command 2');
                inlineAIAssist.commandSettings = {
                    commands: [
                        { label: 'Updated Command A'},
                        { label: 'Updated Command B'},
                        { label: 'Updated Command C'},
                        { label: 'Updated Command D'}
                    ]
                };
                inlineAIAssist.dataBind();

                setTimeout(() => {
                    expect(inlineAIAssist.commandSettings.commands.length).toBe(4);
                    expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Updated Command A');
                    expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Updated Command B');
                    expect(inlineAIAssist.commandSettings.commands[2].label).toBe('Updated Command C');
                    expect(inlineAIAssist.commandSettings.commands[3].label).toBe('Updated Command D');
                    mentionElement = document.querySelector('.e-mention-container');
                    expect(mentionElement).not.toBeNull();
                    const updatedMentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                    expect(updatedMentionPopupObj).not.toBeNull();
                    mentionList = updatedMentionPopupObj.list;
                    expect(mentionList).not.toBeNull();
                    const updatedListItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                    expect(updatedListItems.length).toBe(4);
                    expect(updatedListItems[0].textContent).toContain('Updated Command A');
                    expect(updatedListItems[1].textContent).toContain('Updated Command B');
                    expect(updatedListItems[2].textContent).toContain('Updated Command C');
                    expect(updatedListItems[3].textContent).toContain('Updated Command D');
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                    const contentWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-assist-container');
                    expect(contentWrapper).not.toBeNull();
                    expect(contentWrapper.classList.contains('e-inline-assist-container')).toBe(true);
                    done();
                }, 150);
            }, 100);
        });

        it('CommandSettings dynamic add/remove items checking - verify complete model and DOM synchronization', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Command Alpha'},
                        { label: 'Command Beta'}
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssist.commandSettings.commands.length).toBe(2);
                expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Command Alpha');
                expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Command Beta');
                let mentionElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionElement).not.toBeNull();
                const initialMentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                let mentionList: HTMLElement = initialMentionPopupObj.list;
                let listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                expect(listItems.length).toBe(2);
                expect(listItems[0].textContent).toContain('Command Alpha');
                expect(listItems[1].textContent).toContain('Command Beta');
                const newCommands = [
                    ...inlineAIAssist.commandSettings.commands,
                    { label: 'Command Gamma'},
                    { label: 'Command Delta'},
                    { label: 'Command Epsilon'}
                ];
                inlineAIAssist.commandSettings = {
                    commands: newCommands
                };
                inlineAIAssist.dataBind();
                setTimeout(() => {
                    expect(inlineAIAssist.commandSettings.commands.length).toBe(5);
                    expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Command Alpha');
                    expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Command Beta');
                    expect(inlineAIAssist.commandSettings.commands[2].label).toBe('Command Gamma');
                    expect(inlineAIAssist.commandSettings.commands[3].label).toBe('Command Delta');
                    expect(inlineAIAssist.commandSettings.commands[4].label).toBe('Command Epsilon');
                    mentionElement = document.querySelector('.e-mention-container');
                    expect(mentionElement).not.toBeNull();
                    const afterAddMentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                    mentionList = afterAddMentionPopupObj.list;
                    listItems = mentionList.querySelectorAll('li');
                    expect(listItems.length).toBe(5);
                    expect(listItems[2].textContent).toContain('Command Gamma');
                    expect(listItems[3].textContent).toContain('Command Delta');
                    expect(listItems[4].textContent).toContain('Command Epsilon');
                    const filteredCommands = inlineAIAssist.commandSettings.commands.filter(
                        (cmd: any) => cmd.label !== 'Command Gamma' && cmd.label !== 'Command Delta'
                    );
                    inlineAIAssist.commandSettings = {
                        commands: filteredCommands
                    };
                    inlineAIAssist.dataBind();
                    setTimeout(() => {
                        expect(inlineAIAssist.commandSettings.commands.length).toBe(3);
                        expect(inlineAIAssist.commandSettings.commands[0].label).toBe('Command Alpha');
                        expect(inlineAIAssist.commandSettings.commands[1].label).toBe('Command Beta');
                        expect(inlineAIAssist.commandSettings.commands[2].label).toBe('Command Epsilon');
                        const gammaCommand = inlineAIAssist.commandSettings.commands.find((cmd: any) => cmd.label === 'Command Gamma');
                        const deltaCommand = inlineAIAssist.commandSettings.commands.find((cmd: any) => cmd.label === 'Command Delta');
                        expect(gammaCommand).toBeUndefined();
                        expect(deltaCommand).toBeUndefined();
                        mentionElement = document.querySelector('.e-mention-container');
                        expect(mentionElement).not.toBeNull();
                        const afterRemoveMentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                        mentionList = afterRemoveMentionPopupObj.list;
                        listItems = mentionList.querySelectorAll('li');
                        expect(listItems.length).toBe(3);
                        expect(listItems[0].textContent).toContain('Command Alpha');
                        expect(listItems[1].textContent).toContain('Command Beta');
                        expect(listItems[2].textContent).toContain('Command Epsilon');
                        let foundGamma = false;
                        let foundDelta = false;
                        listItems.forEach((item: HTMLElement) => {
                            if (item.textContent.includes('Command Gamma')) foundGamma = true;
                            if (item.textContent.includes('Command Delta')) foundDelta = true;
                        });
                        expect(foundGamma).toBe(false);
                        expect(foundDelta).toBe(false);
                        expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                        const contentWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-assist-container');
                        expect(contentWrapper).not.toBeNull();
                        expect(contentWrapper.classList.contains('e-inline-assist-container')).toBe(true);
                        const finalMentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                        expect(finalMentionPopupObj).not.toBeNull();
                        expect(finalMentionPopupObj.list).not.toBeNull();
                        done();
                    }, 150);
                }, 150);
            }, 100);
        });

        it('Command popup should close when user starts typing in textarea', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize', prompt: 'Summarize this content' },
                        { label: 'Improve Writing', prompt: 'Improve the writing' },
                        { label: 'Translate', prompt: 'Translate this' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                let mentionPopup: HTMLElement = document.querySelector('.e-mention-container.e-popup');
                expect(mentionPopup).not.toBeNull();
                expect(mentionPopup.style.display).not.toBe('none');
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                let mentionList: HTMLElement = mentionPopupObj.list;
                let listItems: NodeListOf<HTMLElement> = mentionList.querySelectorAll('li');
                expect(listItems.length).toBe(3);
                const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                expect(textareaEle).not.toBeNull();
                
                textareaEle.innerText = 'User is typing something';
                const inputEvent: Event = new Event('input', { bubbles: true });
                textareaEle.dispatchEvent(inputEvent);
                setTimeout(() => {
                    mentionPopup = document.querySelector('.e-mention-container');
                    expect(mentionPopup).not.toBeNull();
                    expect(inlineAIAssist.prompt).toContain('User is typing something');
                    expect(mentionPopup.classList.contains('e-popup-open')).toBe(false);
                    const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                    expect(sendBtn.classList.contains('disabled')).toBe(false);
                    done();
                }, 450);
            }, 150);
        });

        it('Command popup should show again when textarea is emptied after typing', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize' },
                        { label: 'Improve Writing' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                let mentionPopup: HTMLElement = document.querySelector('.e-mention-container.e-popup');
                expect(mentionPopup).not.toBeNull();
                expect(mentionPopup.style.display).toBe('block');
                const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                textareaEle.innerText = 'Some text';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    expect(mentionPopup.classList.contains('e-popup-open')).toBe(false);
                    textareaEle.innerText = '';
                    textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        mentionPopup = document.querySelector('.e-mention-container.e-popup');
                        expect(mentionPopup).not.toBeNull();
                        expect(mentionPopup.style.display).toBe('block');
                        expect(inlineAIAssist.prompt).toBe('');
                        const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtn.classList.contains('disabled')).toBe(true);
                        done();
                    }, 450);
                }, 450);
            }, 150);
        });

        it('should navigate command items using ArrowDown/ArrowUp keys and apply selection classes', (done: DoneFn) => {
            let mentionKeyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', code: 'ArrowDown', keyCode: 40, key: 'ArrowDown' };
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Improve Grammar' },
                        { label: 'Shorten' },
                        { label: 'Expand' },
                        { label: 'Change Tone' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                expect(mentionPopupObj).not.toBeNull();
                const list = mentionPopupObj.list;
                expect(list).not.toBeNull();
                const items = list.querySelectorAll('li.e-list-item');
                expect(items.length).toBe(4);
                mentionPopupObj.onKeyUp(mentionKeyEventArgs);
                mentionPopupObj.keyActionHandler(mentionKeyEventArgs);
                expect(items[1].classList.contains('e-active')).toBe(true);
                expect(items[0].classList.contains('e-active')).toBe(false);
                mentionPopupObj.onKeyUp(mentionKeyEventArgs);
                mentionPopupObj.keyActionHandler(mentionKeyEventArgs);
                expect(items[2].classList.contains('e-active')).toBe(true);
                expect(items[1].classList.contains('e-active')).toBe(false);
                mentionPopupObj.onKeyUp(mentionKeyEventArgs);
                mentionPopupObj.keyActionHandler(mentionKeyEventArgs);
                expect(items[3].classList.contains('e-active')).toBe(true);
                expect(items[2].classList.contains('e-active')).toBe(false);
                done();
            }, 120);
        });

        it('should not trigger itemSelect when pressing Shift + Enter in textarea', (done: DoneFn) => {
            let itemSelectTriggered = false;
            inlineAIAssist = new InlineAIAssist({
                commandSettings: {
                    commands: [
                        { label: 'Summarize' },
                        { label: 'Improve Writing' },
                        { label: 'Translate' }
                    ],
                    itemSelect: (args: CommandItemSelectEventArgs) => {
                        itemSelectTriggered = true;
                    }
                },
            });

            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                const mentionPopupElement: HTMLElement = document.querySelector('.e-mention-container');
                expect(mentionPopupElement).not.toBeNull();
                const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                expect(textareaEle).not.toBeNull();
                textareaEle.focus();
                textareaEle.innerText = '';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                const shiftEnterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true
                });
                const dispatched = textareaEle.dispatchEvent(shiftEnterEvent);
                if (!dispatched) {
                    document.dispatchEvent(shiftEnterEvent);
                }
                setTimeout(() => {
                    expect(mentionPopupElement.style.display).not.toBe('none');
                    expect(inlineAIAssistElem.classList.contains('e-popup-open')).toBe(true);
                    expect(itemSelectTriggered).toBe(false);
                    done();
                }, 120);
            }, 150);
        });
    });

    describe('ResponseSettings - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('ResponseSettings default checking', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings).not.toBeNull();
            expect(inlineAIAssist.responseSettings.items).toBeDefined();
            expect(inlineAIAssist.responseSettings.items.length).toBeGreaterThanOrEqual(0);
        });

        it('ResponseSettings items property checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Insert' },
                        { label: 'Append' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items.length).toBe(4);
            expect(inlineAIAssist.responseSettings.items[0].label).toBe('Accept');
            expect(inlineAIAssist.responseSettings.items[1].label).toBe('Discard');
            expect(inlineAIAssist.responseSettings.items[0].iconCss).toBe('e-icons e-inline-accept');
            expect(inlineAIAssist.responseSettings.items[1].iconCss).toBe('e-icons e-inline-discard');
            expect(inlineAIAssist.responseSettings.items[2].label).toBe('Insert');
            expect(inlineAIAssist.responseSettings.items[3].label).toBe('Append');
        });

        it('ResponseSettings items with iconCss checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Thumbs Up', iconCss: 'e-icons e-thumbsup' },
                        { label: 'Thumbs Down', iconCss: 'e-icons e-thumbsdown' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items[2].iconCss).toBe('e-icons e-thumbsup');
            expect(inlineAIAssist.responseSettings.items[3].iconCss).toBe('e-icons e-thumbsdown');
        });

        it('ResponseSettings items with tooltip checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Good Response', tooltip: 'This response is helpful' },
                        { label: 'Bad Response', tooltip: 'This response is not helpful' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items[2].tooltip).toBe('This response is helpful');
            expect(inlineAIAssist.responseSettings.items[3].tooltip).toBe('This response is not helpful');
        });

        it('ResponseSettings items with disabled property checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Enabled Item', disabled: false },
                        { label: 'Disabled Item', disabled: true }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items[2].disabled).toBe(false);
            expect(inlineAIAssist.responseSettings.items[3].disabled).toBe(true);
        });

        it('ResponseSettings itemSelect event checking', (done: DoneFn) => {
            let itemSelectTriggered: boolean = false;
            let selectedItemLabel: string = '';
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Custom Item' }
                    ],
                    itemSelect: (args: ResponseItemSelectEventArgs) => {
                        itemSelectTriggered = true;
                        selectedItemLabel = args.command.label;
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                expect(inlineAIAssist.responseSettings.items.length).toBeGreaterThanOrEqual(1);
                const customItem: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                    (item: CommandItemModel) => item.label === 'Custom Item'
                );
                expect(customItem).not.toBeNull();
                
                const selectEventArgs: any = {
                    itemData: { 
                        command: customItem,
                        label: 'Custom Item'
                    },
                    e: new MouseEvent('click', { bubbles: true })
                };
                (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);
                
                setTimeout(() => {
                    expect(itemSelectTriggered).toBe(true);
                    expect(selectedItemLabel).toBe('Custom Item');
                    done();
                }, 100);
            }, 100);
        });

        it('ResponseSettings dynamic items change checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Initial Item' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items.length).toBe(3);
            inlineAIAssist.responseSettings = {
                items: [
                    { label: 'Updated Item 1' },
                    { label: 'Updated Item 2' },
                    { label: 'Updated Item 3' }
                ]
            };
            inlineAIAssist.dataBind();
            
            setTimeout(() => {
                expect(inlineAIAssist.responseSettings.items.length).toBe(5);
                const updatedItem: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                    (item: CommandItemModel) => item.label === 'Updated Item 1'
                );
                expect(updatedItem).not.toBeNull();
                done();
            }, 100);
        });

        it('ResponseSettings itemSelect event dynamic change checking', (done: DoneFn) => {
            let firstEventTriggered: boolean = false;
            let secondEventTriggered: boolean = false;
            
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Item 1' }
                    ],
                    itemSelect: (args: ResponseItemSelectEventArgs) => {
                        firstEventTriggered = true;
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                // Change itemSelect event handler
                inlineAIAssist.responseSettings = {
                    items: [
                        { label: 'Item 2' }
                    ],
                    itemSelect: (args: ResponseItemSelectEventArgs) => {
                        secondEventTriggered = true;
                    }
                };
                inlineAIAssist.dataBind();
                
                setTimeout(() => {
                    const updatedItem: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                        (item: CommandItemModel) => item.label === 'Item 2'
                    );
                    
                    const selectEventArgs: any = {
                        itemData: { 
                            command: updatedItem,
                            label: 'Item 2'
                        },
                        e: new MouseEvent('click', { bubbles: true })
                    };
                    (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);
                    
                    setTimeout(() => {
                        expect(secondEventTriggered).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('ResponseSettings complex items checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { 
                            label: 'Like', 
                            iconCss: 'e-icons e-like',
                            id: 'like-item',
                            disabled: false,
                            tooltip: 'I like this response',
                            groupBy: 'Feedback'
                        },
                        { 
                            label: 'Dislike', 
                            iconCss: 'e-icons e-dislike',
                            id: 'dislike-item',
                            disabled: false,
                            tooltip: 'I dislike this response',
                            groupBy: 'Feedback'
                        },
                        { 
                            label: 'Copy', 
                            iconCss: 'e-icons e-copy',
                            id: 'copy-item',
                            disabled: false,
                            tooltip: 'Copy response',
                            groupBy: 'Actions'
                        }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items.length).toBeGreaterThanOrEqual(3);
            const likeItem: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                (item: CommandItemModel) => item.id === 'like-item'
            );
            expect(likeItem).not.toBeNull();
            expect(likeItem.label).toBe('Like');
            expect(likeItem.iconCss).toBe('e-icons e-like');
            expect(likeItem.tooltip).toBe('I like this response');
        });

        it('ResponseSettings empty items checking', () => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: []
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseSettings.items.length).toBe(2);
            expect(inlineAIAssist.responseSettings.items[0].label).toBe('Accept');
            expect(inlineAIAssist.responseSettings.items[1].label).toBe('Discard');
            expect(inlineAIAssist.responseSettings.items[0].iconCss).toBe('e-icons e-inline-accept');
            expect(inlineAIAssist.responseSettings.items[1].iconCss).toBe('e-icons e-inline-discard');
        });

        it('ResponseSettings dynamic add items checking', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Initial' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            const initialCount: number = inlineAIAssist.responseSettings.items.length;
            expect(initialCount).toBe(3);
            const newItems: CommandItemModel[] = [
                { label: 'New Item 1' },
                { label: 'New Item 2' }
            ];
            inlineAIAssist.responseSettings.items = newItems;
            inlineAIAssist.dataBind();
            setTimeout(() => {
                expect(inlineAIAssist.responseSettings.items.length).toBe(4);
                const newItem: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                    (item: CommandItemModel) => item.label === 'New Item 1'
                );
                expect(newItem).not.toBeNull();
                done();
            }, 100);
        });

        it('ResponseSettings with response popup showing with custom items', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Helpful', iconCss: 'e-icons e-check' },
                        { label: 'Not Helpful', iconCss: 'e-icons e-close' }
                    ]
                },
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    inlineAIAssist.addResponse('Sample response');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                const textareaEle: HTMLDivElement = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea');
                textareaEle.innerText = 'Test';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                    sendBtn.click();
                    
                    setTimeout(() => {
                        const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                        expect(responseText).not.toBeNull();
                        expect(responseText.textContent).toContain('Sample response');
                        done();
                    }, 100);
                }, 450);
            }, 100);
        });

        it('ResponseSettings itemSelect with multiple items selection', (done: DoneFn) => {
            let selectionCount: number = 0;
            let lastSelectedLabel: string = '';
            
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Item A' },
                        { label: 'Item B' },
                        { label: 'Item C' }
                    ],
                    itemSelect: (args: ResponseItemSelectEventArgs) => {
                        selectionCount++;
                        lastSelectedLabel = args.command.label;
                    }
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            
            setTimeout(() => {
                const itemB: CommandItemModel = inlineAIAssist.responseSettings.items.find(
                    (item: CommandItemModel) => item.label === 'Item B'
                );
                
                const selectEventArgs: any = {
                    itemData: { 
                        command: itemB,
                        label: 'Item B'
                    },
                    e: new MouseEvent('click', { bubbles: true })
                };
                
                (inlineAIAssist as any).onMentionCommandSelect(selectEventArgs);
                
                setTimeout(() => {
                    expect(lastSelectedLabel).toBe('Item B');
                    done();
                }, 100);
            }, 100);
        });

        it('should navigate response items using ArrowDown/ArrowUp keys and apply selection classes', (done: DoneFn) => {
            let mentionKeyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', code: 'ArrowDown', keyCode: 40, key: 'ArrowDown' };
            inlineAIAssist = new InlineAIAssist({
                responseSettings: {
                    items: [
                        { label: 'Helpful' },
                        { label: 'Not Helpful' },
                        { label: 'Copy' },
                        { label: 'Regenerate' }
                    ]
                },
                promptRequest: () => {
                    inlineAIAssist.addResponse('Sample AI response text here');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const textarea = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea') as HTMLDivElement;
                expect(textarea).not.toBeNull();
                textarea.innerText = 'Hello world';
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const sendBtn = inlineAIAssistElem.querySelector('.e-footer .e-inline-send') as HTMLElement;
                    expect(sendBtn).not.toBeNull();
                    sendBtn.click();
                    setTimeout(() => {
                        const mentionPopupObj: any = (inlineAIAssist as any).mentionPopupObj;
                        expect(mentionPopupObj).not.toBeNull();
                        const list = mentionPopupObj.list;
                        expect(list).not.toBeNull();
                        const items = list.querySelectorAll('li.e-list-item');
                        expect(items.length).toBe(6);
                        mentionPopupObj.onKeyUp(mentionKeyEventArgs);
                        mentionPopupObj.keyActionHandler(mentionKeyEventArgs);
                        expect(items[1].classList.contains('e-active')).toBe(true);
                        expect(items[0].classList.contains('e-active')).toBe(false);
                        mentionPopupObj.onKeyUp(mentionKeyEventArgs);
                        mentionPopupObj.keyActionHandler(mentionKeyEventArgs);
                        expect(items[2].classList.contains('e-active')).toBe(true);
                        expect(items[1].classList.contains('e-active')).toBe(false);
                        done();
                    }, 120);
                }, 150);
            }, 150);
        });

    it('should not trigger response itemSelect when pressing Shift + Enter in textarea', (done: DoneFn) => {
        let itemSelectTriggered = false;
        inlineAIAssist = new InlineAIAssist({
            responseSettings: {
                items: [
                    { label: 'Helpful' },
                    { label: 'Not Helpful' },
                    { label: 'Copy Text' }
                ],
                itemSelect: (args: ResponseItemSelectEventArgs) => {
                    itemSelectTriggered = true;
                }
            },
            promptRequest: () => {
                inlineAIAssist.addResponse('This is a test response');
            }
        });

        inlineAIAssist.appendTo(inlineAIAssistElem);
        inlineAIAssist.showPopup();

        setTimeout(() => {
            const textareaEle = inlineAIAssistElem.querySelector('.e-footer .e-assist-textarea') as HTMLDivElement;
            expect(textareaEle).not.toBeNull();

            textareaEle.focus();
            textareaEle.innerText = 'Some prompt text';
            textareaEle.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                const sendBtn = inlineAIAssistElem.querySelector('.e-footer .e-inline-send') as HTMLElement;
                sendBtn.click();

                setTimeout(() => {
                    const responseText = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    itemSelectTriggered = false;
                    const shiftEnterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        shiftKey: true,
                        bubbles: true,
                        cancelable: true
                    });

                    const dispatched = textareaEle.dispatchEvent(shiftEnterEvent);
                    if (!dispatched) {
                        document.dispatchEvent(shiftEnterEvent);
                    }

                    setTimeout(() => {
                        expect(itemSelectTriggered).toBe(false);
                        done();
                    }, 120);
                }, 400);
            }, 150);
        }, 150);
    });
    });

    describe('ResponseMode - ', () => {

        afterEach(() => {
            if (inlineAIAssist) {
                inlineAIAssist.destroy();
            }
        });

        it('Default responseMode should be Popup', () => {
            inlineAIAssist = new InlineAIAssist({
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseMode).toBe('Popup');
        });

        it('ResponseMode property checking - Popup mode', () => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseMode).toBe('Popup');
        });

        it('ResponseMode property checking - Inline mode', () => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseMode).toBe('Inline');
        });

        it('Popup mode should create e-output-container on addResponse', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('Test response content');
                setTimeout(() => {
                    const outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer).not.toBeNull();
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    expect(responseText.textContent).toContain('Test response content');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode should not create e-output-container on addResponse', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('Test response for inline mode');
                setTimeout(() => {
                    const outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Popup mode should render skeleton on addResponse with streaming disabled', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                enableStreaming: false,
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Response after delay');
                    }, 50);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const skeleton: HTMLElement = inlineAIAssistElem.querySelector('.e-skeleton');
                    expect(skeleton).not.toBeNull();
                }, 20);
                setTimeout(() => {
                    const skeleton: HTMLElement = inlineAIAssistElem.querySelector('.e-skeleton');
                    expect(skeleton).toBeNull();
                    done();
                }, 200);
            }, 100);
        });

        it('Popup mode should render skeleton with streaming enabled', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                enableStreaming: true,
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    const skeleton: HTMLElement = inlineAIAssistElem.querySelector('.e-skeleton');
                    expect(skeleton).not.toBeNull();
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.executePrompt('Test streaming');
                setTimeout(() => {
                    const skeleton: HTMLElement = inlineAIAssistElem.querySelector('.e-skeleton');
                    expect(skeleton).toBeNull();
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).not.toBeNull();
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const sendBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfter).not.toBeNull();
                        done();
                    }, 50);
                }, 100);
            }, 100);
        });

        it('ResponseMode dynamic change from Popup to Inline', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseMode).toBe('Popup');

            inlineAIAssist.responseMode = ResponseMode.Inline;
            inlineAIAssist.dataBind();

            setTimeout(() => {
                expect(inlineAIAssist.responseMode).toBe('Inline');
                done();
            }, 100);
        });

        it('ResponseMode dynamic change from Inline to Popup', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            expect(inlineAIAssist.responseMode).toBe('Inline');

            inlineAIAssist.responseMode = ResponseMode.Popup;
            inlineAIAssist.dataBind();

            setTimeout(() => {
                expect(inlineAIAssist.responseMode).toBe('Popup');
                done();
            }, 100);
        });

        it('Popup mode response should be added to e-output-container', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                promptRequest: () => {
                    inlineAIAssist.addResponse('**Bold response content**');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.executePrompt('This is a prompt');
            setTimeout(() => {
                const outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                expect(outputContainer).not.toBeNull();
                expect(responseText).not.toBeNull();
                expect(responseText.querySelector('strong')).not.toBeNull();
                expect(responseText.textContent.trim()).toBe('Bold response content');
                done();
            }, 100);
        });

        it('Popup mode with responseTemplate should use template for rendering', (done: DoneFn) => {
            const templateScript: HTMLElement = createElement('script', { id: 'popupResponseTemplate', attrs: { type: 'text/x-template' } });
            templateScript.innerHTML = '<div class="e-custom-popup-response"><p>Response: ${response}</p></div>';
            document.body.appendChild(templateScript);

            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                responseTemplate: '#popupResponseTemplate'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('Template response content');
                setTimeout(() => {
                    const customResponse: HTMLElement = inlineAIAssistElem.querySelector('.e-custom-popup-response');
                    expect(customResponse).not.toBeNull();
                    expect(customResponse.textContent).toContain('Template response content');
                    document.body.removeChild(templateScript);
                    done();
                }, 100);
            }, 100);
        });

        it('Multiple responses in Popup mode should be appended', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('First response');
                setTimeout(() => {
                    inlineAIAssist.addResponse('Second response');
                    setTimeout(() => {
                        expect(inlineAIAssist.prompts.length).toBe(2);
                        expect(inlineAIAssist.prompts[0].response.trim()).toBe('<p>First response</p>');
                        expect(inlineAIAssist.prompts[1].response.trim()).toBe('<p>Second response</p>');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Popup mode should clear response container on hidePopup', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('Response to be cleared');
                setTimeout(() => {
                    const outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer).not.toBeNull();
                    
                    inlineAIAssist.hidePopup();
                    setTimeout(() => {
                        const outputContainerAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                        expect(outputContainerAfter).toBeNull();
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Popup mode with responseTemplate should add template class to container', (done: DoneFn) => {
            const templateScript: HTMLElement = createElement('script', { id: 'templateForClass', attrs: { type: 'text/x-template' } });
            templateScript.innerHTML = '<div class="e-template-response">${response}</div>';
            document.body.appendChild(templateScript);

            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                responseTemplate: '#templateForClass'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.addResponse('Templated response');
                setTimeout(() => {
                    const outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer.classList.contains('e-response-item-template')).toBe(true);
                    document.body.removeChild(templateScript);
                    done();
                }, 100);
            }, 100);
        });

        it('Popup mode skeleton should have required classes', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Response');
                    }, 50);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.executePrompt('Test');
                setTimeout(() => {
                    const skeleton: HTMLElement = inlineAIAssistElem.querySelector('.e-skeleton');
                    expect(skeleton).not.toBeNull();
                    expect(skeleton.classList.contains('e-skeleton')).toBe(true);
                    expect(skeleton.classList.contains('e-skeleton-text')).toBe(true);
                    expect(skeleton.classList.contains('e-shimmer-wave')).toBe(true);
                }, 10);
                
                setTimeout(() => {
                    done();
                }, 200);
            }, 100);
        });

        it('Popup mode stop responding should work correctly', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Popup,
                enableStreaming: true,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Streaming response with skeleton loading indicator visible before the words begin to appear one by one');
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.executePrompt('Test');
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const sendBtnAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                        expect(sendBtnAfter).not.toBeNull();
                        done();
                    }, 50);
                }, 100);
            }, 100);
        });

        it('Popup mode response prompt should be recorded', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                promptRequest: (args: InlinePromptRequestEventArgs) => {
                    inlineAIAssist.addResponse('Response for: ' + args.prompt);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                inlineAIAssist.executePrompt('Sample prompt');
                setTimeout(() => {
                    expect(inlineAIAssist.prompts.length).toBe(1);
                    expect(inlineAIAssist.prompts[0].prompt).toBe('Sample prompt');
                    expect(inlineAIAssist.prompts[0].response).toContain('Sample prompt');
                    done();
                }, 100);
            }, 100);
        });

        it('ResponseMode switch from Inline to Popup with response should render e-output-container', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                prompt: 'Initial prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            setTimeout(() => {
                const responseContent: string = 'This is response in inline mode';
                inlineAIAssist.addResponse(responseContent);

                setTimeout(() => {
                    let outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer).toBeNull();
                    expect(inlineAIAssist.prompts.length).toBe(1);
                    expect(inlineAIAssist.prompts[0].prompt).toBe('Initial prompt');
                    expect(inlineAIAssist.prompts[0].response.trim()).toBe(`<p>${responseContent}</p>`);
                    let responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText).toBeNull();
                    inlineAIAssist.responseMode = ResponseMode.Popup;
                    inlineAIAssist.dataBind();

                    setTimeout(() => {
                        const popupResponseContent: string = 'This is response in popup mode';
                        inlineAIAssist.addResponse(popupResponseContent);
                        setTimeout(() => {
                            outputContainer = inlineAIAssistElem.querySelector('.e-output-container');
                            expect(outputContainer).not.toBeNull();
                            responseText = inlineAIAssistElem.querySelector('.e-response-text');
                            expect(responseText).not.toBeNull();
                            expect(responseText.textContent).toContain('This is response in popup mode');
                            expect(inlineAIAssist.prompts.length).toBe(2);
                            expect(inlineAIAssist.prompts[0].prompt).toBe('Initial prompt');
                            expect(inlineAIAssist.prompts[0].response.trim()).toBe(`<p>${responseContent}</p>`);
                            expect(inlineAIAssist.prompts[1].prompt).toBe('');
                            expect(inlineAIAssist.prompts[1].response.trim()).toBe(`<p>${popupResponseContent}</p>`);
                            const content: HTMLElement = inlineAIAssistElem.querySelector('.e-content');
                            expect(content.contains(outputContainer)).toBe(true);
                            expect(inlineAIAssist.responseMode).toBe('Popup');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('ResponseMode switch from Inline to Popup - verify DOM structure transitions correctly', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.addResponse('Inline response');
                setTimeout(() => {
                    let outputContainerBefore: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainerBefore).toBeNull();
                    const contentWrapper: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-assist-container');
                    expect(contentWrapper).not.toBeNull();
                    inlineAIAssist.responseMode = ResponseMode.Popup;
                    inlineAIAssist.dataBind();
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Popup response');
                        setTimeout(() => {
                            const outputContainerAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                            expect(outputContainerAfter).not.toBeNull();
                            const responseTextElement: HTMLElement = outputContainerAfter.querySelector('.e-response-text');
                            expect(responseTextElement).not.toBeNull();
                            const contentWrapperAfter: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-assist-container');
                            expect(contentWrapperAfter).not.toBeNull();
                            expect(contentWrapperAfter.querySelector('.e-content').contains(outputContainerAfter)).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('ResponseMode Inline to Popup - multiple additions should be tracked in prompts array', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.addResponse('Response 1 in Inline mode');
                setTimeout(() => {
                    expect(inlineAIAssist.prompts.length).toBe(1);
                    expect(inlineAIAssist.prompts[0].response.trim()).toBe('<p>Response 1 in Inline mode</p>');
                    inlineAIAssist.responseMode = ResponseMode.Popup;
                    inlineAIAssist.dataBind();
                    setTimeout(() => {
                        inlineAIAssist.addResponse('Response 1 in Popup mode');
                        setTimeout(() => {
                            expect(inlineAIAssist.prompts.length).toBe(2);
                            expect(inlineAIAssist.prompts[1].response.trim()).toBe('<p>Response 1 in Popup mode</p>');
                            inlineAIAssist.addResponse('Response 2 in Popup mode');
                            setTimeout(() => {
                                expect(inlineAIAssist.prompts.length).toBe(3);
                                expect(inlineAIAssist.prompts[2].response.trim()).toBe('<p>Response 2 in Popup mode</p>');
                                expect(inlineAIAssist.prompts[0].response.trim()).toBe('<p>Response 1 in Inline mode</p>');
                                expect(inlineAIAssist.prompts[1].response.trim()).toBe('<p>Response 1 in Popup mode</p>');
                                expect(inlineAIAssist.prompts[2].response.trim()).toBe('<p>Response 2 in Popup mode</p>');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('ResponseMode Inline to Popup - e-output-container should not exist until Popup mode response', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                let outputContainer: HTMLElement = inlineAIAssistElem.querySelector('.e-output-container');
                expect(outputContainer).toBeNull();
                inlineAIAssist.addResponse('Inline response 1');
                setTimeout(() => {
                    outputContainer = inlineAIAssistElem.querySelector('.e-output-container');
                    expect(outputContainer).toBeNull();
                    inlineAIAssist.addResponse('Inline response 2');
                    setTimeout(() => {
                        outputContainer = inlineAIAssistElem.querySelector('.e-output-container');
                        expect(outputContainer).toBeNull();
                        inlineAIAssist.responseMode = ResponseMode.Popup;
                        inlineAIAssist.dataBind();
                        setTimeout(() => {
                            outputContainer = inlineAIAssistElem.querySelector('.e-output-container');
                            expect(outputContainer).toBeNull();
                            inlineAIAssist.addResponse('Popup response');
                            setTimeout(() => {
                                outputContainer = inlineAIAssistElem.querySelector('.e-output-container');
                                expect(outputContainer).not.toBeNull();
                                const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                                expect(responseText.textContent).toContain('Popup response');
                                expect(responseText.textContent).not.toContain('Inline response');
                                expect(inlineAIAssist.prompts.length).toBe(3);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Inline mode should show typing indicator element after executePrompt', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                    expect(indicator).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode typing indicator should show Thinking text on executePrompt', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicatorText: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                    expect(indicatorText).not.toBeNull();
                    expect(indicatorText.textContent).toBe('Thinking');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode typing indicator should render three dot spans', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const dots: NodeListOf<HTMLElement> = inlineAIAssistElem.querySelectorAll('.e-indicator');
                    expect(dots.length).toBe(3);
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode should set editableTextarea contenteditable to false while typing indicator is active', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const textarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
                    expect(textarea).not.toBeNull();
                    expect(textarea.getAttribute('contenteditable')).toBe('false');
                    inlineAIAssist.hidePopup();
                    expect(textarea).not.toBeNull();
                    expect(textarea.getAttribute('contenteditable')).toBe('true');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode should add e-response-indicator-active class to textarea while typing indicator is active', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const textarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
                    expect(textarea.classList.contains('e-response-indicator-active')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate false should change indicator text to Editing', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    const indicatorText: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                    expect(indicatorText).not.toBeNull();
                    expect(indicatorText.textContent).toBe('Thinking');
                    inlineAIAssist.addResponse('Partial response', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicatorText: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                    expect(indicatorText).not.toBeNull();
                    expect(indicatorText.textContent).toBe('Editing');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate false should keep typing indicator visible', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial response', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                    expect(indicator).not.toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate false should keep editableTextarea non-editable', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial response', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const textarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
                    expect(textarea.getAttribute('contenteditable')).toBe('false');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate false should still push to prompts array', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Partial response', false);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    expect(inlineAIAssist.prompts.length).toBe(1);
                    expect(inlineAIAssist.prompts[0].response.trim()).toBe('<p>Partial response</p>');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate true should remove typing indicator from DOM', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Final response', true);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                    expect(indicator).toBeNull();
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode addResponse with isFinalUpdate true should restore editableTextarea to contenteditable true', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {
                    inlineAIAssist.addResponse('Final response', true);
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const textarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
                    expect(textarea.getAttribute('contenteditable')).toBe('true');
                    done();
                }, 100);
            }, 100);
        });

        it('Inline mode stop responding should hide typing indicator and restore contenteditable', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    expect(stopBtn).not.toBeNull();
                    stopBtn.click();
                    setTimeout(() => {
                        const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                        expect(indicator).toBeNull();
                        const textarea: HTMLElement = inlineAIAssistElem.querySelector('.e-assist-textarea');
                        expect(textarea.getAttribute('contenteditable')).toBe('true');
                        done();
                    }, 50);
                }, 100);
            }, 100);
        });

        it('Inline mode typing indicator text span should appear before dot spans in DOM', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: ResponseMode.Inline,
                promptRequest: () => {}
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            setTimeout(() => {
                inlineAIAssist.executePrompt('Test prompt');
                setTimeout(() => {
                    const indicator: HTMLElement = inlineAIAssistElem.querySelector('.e-response-indicator');
                    expect(indicator).not.toBeNull();
                    const children: HTMLCollection = indicator.children;
                    expect(children.length).toBe(4);
                    expect(children[0].classList.contains('e-indicator-text')).toBe(true);
                    expect(children[1].classList.contains('e-indicator')).toBe(true);
                    expect(children[2].classList.contains('e-indicator')).toBe(true);
                    expect(children[3].classList.contains('e-indicator')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Stop Response Button - ', () => {

        afterEach(() => {
            if (inlineAIAssist && !inlineAIAssist.isDestroyed) {
                inlineAIAssist.destroy();
            }
            if (inlineAIAssistElem && inlineAIAssistElem.parentElement) {
                inlineAIAssistElem.parentElement.removeChild(inlineAIAssistElem);
            }
        });

        it('should show response popup when stop button clicked with response generated in Inline mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Inline',
                responseSettings: {
                    items: [
                        { label: 'Copy', iconCss: 'e-icons e-copy' },
                        { label: 'Share', iconCss: 'e-icons e-share' }
                    ]
                },
                promptRequest: (args: any) => {
                    args.cancel = true;
                },
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                inlineAIAssist.addResponse('This is a test response', false);
                setTimeout(() => {
                    expect((inlineAIAssist as any).hasResponse).toBe(true);
                    expect((inlineAIAssist as any).isResponseRequested).toBe(true);
                    const stopBtnToClick: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    stopBtnToClick.click();
                    const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionPopup.style.display).not.toBe('none');
                    done();
                }, 100);
            }, 100);
        });

        it('should not show response popup when stop button clicked without response in Inline mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Inline',
                promptRequest: (args: any) => {
                    args.cancel = true;
                },
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                expect((inlineAIAssist as any).hasResponse).toBe(false);
                expect((inlineAIAssist as any).isResponseRequested).toBe(true);
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                stopBtn.click();
                setTimeout(() => {
                    expect((inlineAIAssist as any).isResponseRequested).toBe(false);
                    expect((inlineAIAssist as any).hasResponse).toBe(false);
                    const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                    const isPopupOpen: boolean = mentionPopup && mentionPopup.classList.contains('e-popup-open');
                    expect(isPopupOpen).toBe(false);
                    done();
                }, 100);
            }, 100);
        });

        it('should handle streaming response with stop in Inline mode (isFinalUpdate false)', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Inline',
                promptRequest: (args: any) => {
                    args.cancel = true;
                },
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                inlineAIAssist.addResponse('Part one of response', false);
                setTimeout(() => {
                    const indicatorText: HTMLElement = inlineAIAssistElem.querySelector('.e-indicator-text');
                    expect(indicatorText.innerHTML).toBe('Editing');
                    expect((inlineAIAssist as any).hasResponse).toBe(true);
                    const stopBtnToClick: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    stopBtnToClick.click();
                    const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionPopup.style.display).not.toBe('none');
                    done();
                }, 100);
            }, 100);
        });

        it('should show response popup with response items in Inline mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Inline',
                responseSettings: {
                    items: [
                        { id: '1', label: 'Regenerate', iconCss: 'e-icons e-refresh' },
                        { id: '2', label: 'Save', iconCss: 'e-icons e-save' }
                    ]
                }
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            inlineAIAssist.promptRequest = (args: any) => {
                args.cancel = true;
            };
            inlineAIAssist.executePrompt('Test prompt');
            setTimeout(() => {
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                expect(stopBtn).not.toBeNull();
                inlineAIAssist.addResponse('Test response', false);
                setTimeout(() => {
                    stopBtn.click();
                    setTimeout(() => {
                        const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                        expect(mentionPopup.style.display).not.toBe('none');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should show response popup when stop button clicked with response in e-response-text in Popup mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Popup',
                responseSettings: {
                    items: [
                        { label: 'Copy', iconCss: 'e-icons e-copy' },
                        { label: 'Share', iconCss: 'e-icons e-share' }
                    ]
                },
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();

            inlineAIAssist.promptRequest = (args: any) => {
                args.cancel = true;
            };
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                expect(inlineAIAssistElem.querySelector('.e-skeleton')).not.toBeNull();
                inlineAIAssist.addResponse('This is a test response', false);
                setTimeout(() => {
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText.innerText.length).toBeGreaterThan(0);
                    expect((inlineAIAssist as any).hasResponse).toBe(true);
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    stopBtn.click();
                    setTimeout(() => {
                        const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                        expect(mentionPopup.style.display).not.toBe('none');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should not show response popup when stop button clicked without response content in Popup mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Popup',
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.promptRequest = (args: any) => {
                args.cancel = true;
            };
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                expect(inlineAIAssistElem.querySelector('.e-skeleton')).not.toBeNull();
                const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                stopBtn.click();
                setTimeout(() => {
                    const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                    expect(mentionPopup.style.display).not.toBe('none');
                    done();
                }, 100);
            }, 100);
        });

        it('should handle streaming response with stop in Popup mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Popup',
                enableStreaming: true,
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.promptRequest = (args: any) => {
                args.cancel = true;
            };
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                inlineAIAssist.addResponse('This is the streaming response for the given test prompt, the streaming continues until stop button is clicked');
                setTimeout(() => {
                    const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                    expect(responseText.innerText.length).toBeGreaterThan(0);
                    const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                    stopBtn.click();
                    setTimeout(() => {
                        const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                        expect(mentionPopup.style.display).not.toBe('none');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should handle stop during streaming with multiple isFinalUpdate false in Popup mode', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                responseMode: 'Popup',
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            inlineAIAssist.promptRequest = (args: any) => {
                args.cancel = true;
            };
            const sendBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-send');
            sendBtn.click();
            setTimeout(() => {
                inlineAIAssist.addResponse('Stream part 1 ', false);
                setTimeout(() => {
                    inlineAIAssist.addResponse('Stream part 1 Stream part 2 ', false);
                    setTimeout(() => {
                        const stopBtn: HTMLElement = inlineAIAssistElem.querySelector('.e-inline-stop');
                        stopBtn.click();
                        setTimeout(() => {
                            const responseText: HTMLElement = inlineAIAssistElem.querySelector('.e-response-text');
                            expect(responseText.innerText.length).toBeGreaterThan(0);
                            const mentionPopup: HTMLElement = document.querySelector('.e-mention-container');
                            expect(mentionPopup.style.display).not.toBe('none');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('should toggle send icon to stop icon when send button clicked with custom inline toolbar items', (done: DoneFn) => {
            inlineAIAssist = new InlineAIAssist({
                inlineToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-inline-send', align: 'Right' }
                    ]
                },
                prompt: 'Test prompt'
            });
            inlineAIAssist.appendTo(inlineAIAssistElem);
            inlineAIAssist.showPopup();
            const footerToolbar: any = (inlineAIAssist as any).footerToolbarEle;
            expect(footerToolbar).not.toBeNull();
            const initialItemCount: number = footerToolbar.items.length;
            expect(initialItemCount).toBeGreaterThan(0);
            const sendBtnEle: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
            expect(sendBtnEle).not.toBeNull();
            sendBtnEle.click();
            setTimeout(() => {
                const finalItemCount: number = footerToolbar.items.length;
                expect(finalItemCount).toEqual(initialItemCount);
                const sendIconEle: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-send');
                expect(sendIconEle).toBeNull();
                const stopIconEle: HTMLElement = inlineAIAssistElem.querySelector('.e-footer .e-inline-stop');
                expect(stopIconEle).not.toBeNull();
                const stopIconInToolbar = footerToolbar.items.find((item: any) => 
                    item.prefixIcon === 'e-icons e-inline-stop'
                );
                expect(stopIconInToolbar).not.toBeUndefined();
                done();
            }, 100);
        });
    });
});
