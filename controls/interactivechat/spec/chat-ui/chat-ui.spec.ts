import { createElement, L10n } from "@syncfusion/ej2-base";
import { ChatUI,MessageModel, MessageReplyModel, UserModel } from "../../src/chat-ui/index";
import { ToolbarItemClickedEventArgs, ToolbarItemModel } from '../../src/interactive-chat-base/index';
import { InterActiveChatBase } from '../../src/interactive-chat-base/index';

interface ClipboardItem {
    new (items: { [mimeType: string]: Blob }): ClipboardItem;
}
declare let ClipboardItem: any;

describe('ChatUI Component', () => {
    let chatUI: ChatUI;
    const chatUIElem: HTMLElement = createElement('div', { id: 'chatUI' });
    document.body.appendChild(chatUIElem);
        let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        action: null,
        key: null,
        target: null,
        currentTarget: null,
        altKey: null,
        stopImmediatePropagation: (): void => { /** NO Code */ }
    };
    const messages: MessageModel[] = [
        {
            id: 'msg1',
            text: 'Hi!',
            author: {
                user: 'John Doe',
                id: 'user1',
                statusIconCss: 'e-icons e-user-online'
            },
            timeStamp: new Date('October 13, 2024 11:13:00'),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            }
        },
        {
            id: 'msg2',
            author: {
                user: 'John Doe',
                id: 'user1',
                statusIconCss: 'e-icons e-user-online'
            },
            text: 'How are you?',
            timeStamp: new Date("October 13, 2024 11:14:00"),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            },
        },
        {
            id: 'msg3',
            text: 'Hello!',
            author: {
                user: 'Jane Smith',
                id: 'user2',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png',
                avatarBgColor: '#ccc',
                cssClass: 'customuserAvatar',
                statusIconCss: 'e-icons e-user-online'
            },
            timeStamp: new Date('October 14, 2024 11:14:00'),
            timeStampFormat: 'hh:mm a'
        },
        {
            id: 'msg4',
            text: 'I am good, thanks! How about you?',
            author: {
                user: 'Jane Smith',
                id: 'user2',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png',
                avatarBgColor: '#ccc',
                cssClass: 'customuserAvatar',
                statusIconCss: 'e-icons e-user-online'
            },
            timeStamp: new Date('October 14, 2024 11:14:00'),
            timeStampFormat: 'hh:mm a',
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            }
        },
        {
            id: 'msg5',
            author: {
                user: 'John Doe',
                id: 'user1',
                statusIconCss: 'e-icons e-user-online'
            },
            text: 'I am doing well too, thank you!',
            timeStamp: new Date("October 15, 2024 11:15:00"),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            },
        },
        {
            id: 'msg6',
            author: {
                user: 'John Doe',
                id: 'user1',
                statusIconCss: 'e-icons e-user-online'
            },
            text: 'What have you been up to lately?',
            timeStamp: new Date("October 15, 2024 11:15:00"),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            }
        }
    ];
    const usersMessage: MessageModel[] = [
        {
            id: 'msg1',
            text: 'Hi!',
            author: {
                user: 'John Doe',
                id: 'user1'
            },
            timeStamp: new Date('October 13, 2024 11:13:00'),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            }
        },
        {
            id: 'msg2',
            author: {
                user: 'John Doe',
                id: 'user1'
            },
            text: 'How are you?',
            timeStamp: new Date("October 13, 2024 11:14:00"),
            status: {
                iconCss: 'e-icons e-check',
                tooltip: 'sent',
                text: 'Seen'
            },
        },
        {
            id: 'msg3',
            text: 'Hello!',
            author: {
                user: 'Jane Smith',
                id: 'user2',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png',
                avatarBgColor: '#ccc',
                cssClass: 'customuserAvatar'
            },
            timeStamp: new Date('October 14, 2024 11:14:00'),
            timeStampFormat: 'hh:mm a'
        }
    ];
    describe('DOM', () => {
        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
            }
        });
        it('Default Rendering', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            const headerElem: HTMLElement = chatUIElem.querySelector('.e-chat-header');
            expect(headerElem).not.toBeNull();
            expect(headerElem.textContent).toContain('Chat');
            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper');
            expect(messageWrapper).not.toBeNull();
            const footerElem: HTMLElement = chatUIElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            const textareaElem: HTMLDivElement = footerElem.querySelector('.e-chat-textarea');
            expect(textareaElem).not.toBeNull();
            expect(textareaElem.getAttribute('placeholder')).toEqual('Type your message…');
            const sendIcon: HTMLElement = footerElem.querySelector('.e-chat-send');
            expect(sendIcon).not.toBeNull();
            expect(sendIcon.classList.contains('disabled')).toBe(true);
        });

        it('Unique ID checking', () => {
            chatUIElem.removeAttribute('id');
            chatUI = new ChatUI({});
            chatUI.appendTo(chatUIElem);
            expect(chatUIElem.hasAttribute('id')).toEqual(true);
            chatUIElem.setAttribute('id', 'chatUI');
        });

        it('Width checking', () => {
            chatUI = new ChatUI({
                width: '500px'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            expect(chatUIElem.style.width).toBe('500px');
            chatUI.width = '600px';
            chatUI.dataBind();
            expect(chatUIElem.style.width).toBe('600px');
        });

        it('Height checking', () => {
            chatUI = new ChatUI({
                height: '400px'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            expect(chatUIElem.style.height).toBe('400px');
            chatUI.height = '500px';
            chatUI.dataBind();
            expect(chatUIElem.style.height).toBe('500px');
        });

        it('Header text checking', () => {
            chatUI = new ChatUI({
                headerText: 'Chat Header'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let headerElem: HTMLElement = chatUIElem.querySelector('.e-header-text');
            expect(headerElem.textContent).toBe('Chat Header');
            chatUI.headerText = 'Custom Chat Header';
            chatUI.dataBind();
            headerElem = chatUIElem.querySelector('.e-header-text');
            expect(headerElem.textContent).toBe('Custom Chat Header');
        });

        it('Header icon CSS checking', () => {
            chatUI = new ChatUI({
                headerIconCss: 'e-user'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let iconElem: HTMLElement = chatUIElem.querySelector('.e-header-icon');
            expect(iconElem.classList.contains('e-user')).toBe(true);
            chatUI.headerIconCss = 'e-people';
            chatUI.dataBind();
            iconElem = chatUIElem.querySelector('.e-header-icon');
            expect(iconElem.classList.contains('e-user')).toBe(false);
            expect(iconElem.classList.contains('e-people')).toBe(true);
        });

        it('Header icon dynamic checking', () => {
            chatUI = new ChatUI({
                headerText: 'Chat Header'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let headerElem: HTMLElement = chatUIElem.querySelector('.e-header-text');
            expect(headerElem.textContent).toBe('Chat Header');
            let iconElem: HTMLElement = chatUIElem.querySelector('.e-header-icon');
            expect(iconElem).toBeNull();
            chatUI.headerIconCss = 'e-people';
            chatUI.dataBind();
            iconElem = chatUIElem.querySelector('.e-header-icon');
            expect(iconElem.classList.contains('e-people')).toBe(true);
        });

        it('check messageItem element id', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Hi!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');            
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.id).toBe('msg1');
        });

        it('Placeholder checking', (done: DoneFn) => {
            chatUI = new ChatUI({
                placeholder: 'Enter your message here'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaElem.getAttribute('placeholder')).toEqual('Enter your message here');
            chatUI.placeholder = 'Type your message here';
            chatUI.dataBind();
            setTimeout(() => {
                textareaElem = chatUIElem.querySelector('.e-footer .e-chat-textarea');
                expect(textareaElem.getAttribute('placeholder')).toEqual('Type your message here');
                done();
            }, 0, done);
        });

        it('CSS Class checking', () => {
            chatUI = new ChatUI({
                cssClass: 'custom-chat-ui'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            expect(chatUIElem.classList.contains('custom-chat-ui')).toBe(true);
            chatUI.cssClass = 'e-custom';
            chatUI.dataBind();
            expect(chatUIElem.classList.contains('custom-chat-ui')).toBe(false);
            expect(chatUIElem.classList.contains('e-custom')).toBe(true);
        });

        it('Show Header checking', () => {
            chatUI = new ChatUI({
                showHeader: false
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let headerElem: HTMLElement = chatUIElem.querySelector('.e-chat-header');
            expect(headerElem.hidden).toBe(true);
            chatUI.showHeader = true;
            chatUI.dataBind();
            headerElem = chatUIElem.querySelector('.e-chat-header');
            expect(headerElem.hidden).toBe(false);
        });

        it('Show Footer checking', () => {
            chatUI = new ChatUI({
                showFooter: false
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let footerElem: HTMLElement = chatUIElem.querySelector('.e-footer');
            expect(footerElem.hidden).toBe(true);
            chatUI.showFooter = true;
            chatUI.dataBind();
            footerElem = chatUIElem.querySelector('.e-footer');
            expect(footerElem.hidden).toBe(false);
        });

        
        it('Rtl checking', () => {
            chatUI = new ChatUI({
                enableRtl: false,
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-menu', align: 'Left' },
                        { iconCss: 'e-icons e-search', align: 'Right' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarElement: HTMLDivElement = chatUIElem.querySelector('.e-chat-toolbar.e-toolbar');
            expect(chatUIElem.classList.contains('e-rtl')).toEqual(false);
            expect(toolbarElement.classList.contains('e-rtl')).toEqual(false);
            chatUI.enableRtl = true;
            chatUI.dataBind();
            expect(chatUIElem.classList.contains('e-rtl')).toBe(true);
            expect(toolbarElement.classList.contains('e-rtl')).toBe(true);
            chatUI.enableRtl = false;
            chatUI.dataBind();
            expect(chatUIElem.classList.contains('e-rtl')).toBe(false);
            expect(toolbarElement.classList.contains('e-rtl')).toBe(false);
        });

        it('Currency code check', () => {
            const newProp: any = {
                currencyCode: "AED",
                enableRtl : true
            }
            chatUI = new ChatUI({
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-rtl')).toEqual(false);
            chatUI.setProperties(newProp);
            expect(chatUIElem.classList.contains('e-rtl')).toEqual(true);
        });

        it('Messages property - empty messages', () => {
            chatUI = new ChatUI({
                messages: []
            });
            chatUI.appendTo('#chatUI');
            const messageWrapper = chatUIElem.querySelector('.e-message-wrapper');
            expect(messageWrapper.children.length).toBe(0);
        });

        it('Messages property dynamic update checking', () => {
            const testMessages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Hello, how are you?',
                    author: {
                        id: 'user1',
                        user: 'John Doe'
                    },
                    timeStamp: new Date('October 13, 2024 11:13:00')
                },
                {
                    id: 'msg2',
                    text: 'I\'m fine, thanks!',
                    author: {
                        id: 'user2',
                        user: 'Jane Smith'
                    },
                    timeStamp: new Date('October 13, 2024 11:14:00'),
                    timeStampFormat: 'hh:mm a'
                }
            ];

            chatUI = new ChatUI({
                messages: []
            });
            chatUI.appendTo('#chatUI');
            const messageWrapper = chatUIElem.querySelector('.e-message-wrapper');
            expect(messageWrapper.children.length).toBe(0);
            chatUI.messages = testMessages;
            chatUI.dataBind();
            const messageGroup: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-left');
            expect(messageGroup.length).toBe(2);
            const firstGroup: HTMLDivElement = messageGroup[0];
            expect(firstGroup.querySelector('.e-message-header').textContent).toBe('John Doe');
            expect(firstGroup.querySelector('.e-time').textContent).toBe('13/10/2024 11:13 AM');
            expect(firstGroup.querySelector('.e-message-icon').textContent).toBe('JD');
            const firstMessageItem: HTMLDivElement = firstGroup.querySelector('.e-message-item');
            expect(firstMessageItem.querySelector('.e-text').textContent).toBe('Hello, how are you?');

            const secondGroup: HTMLDivElement = messageGroup[1];
            expect(secondGroup.querySelector('.e-message-header').textContent).toBe('Jane Smith');
            expect(secondGroup.querySelector('.e-time').textContent).toBe('11:14 AM');
            expect(secondGroup.querySelector('.e-message-icon').textContent).toBe('JS');
            const secondMessageItem: HTMLDivElement = secondGroup.querySelector('.e-message-item');
            expect(secondMessageItem.querySelector('.e-text').textContent).toBe('I\'m fine, thanks!');
        });

        it('Messages property checking', () => {
            const testMessages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Hello, how are you?',
                    author: {
                        id: 'user1',
                        user: 'John Doe'
                    },
                    timeStamp: new Date('October 13, 2024 11:13:00')
                },
                {
                    id: 'msg2',
                    text: 'I\'m fine, thanks!',
                    author: {
                        id: 'user2',
                        user: 'Jane Smith'
                    },
                    timeStamp: new Date('October 13, 2024 11:14:00'),
                    timeStampFormat: 'hh:mm a'
                }
            ];

            chatUI = new ChatUI({
                messages: testMessages
            });
            chatUI.appendTo('#chatUI');
            const messageGroup: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-left');
            expect(messageGroup.length).toBe(2);
            const firstGroup: HTMLDivElement = messageGroup[0];
            expect(firstGroup.querySelector('.e-message-header').textContent).toBe('John Doe');
            expect(firstGroup.querySelector('.e-time').textContent).toBe('13/10/2024 11:13 AM');
            expect(firstGroup.querySelector('.e-message-icon').textContent).toBe('JD');
            const firstMessageItem: HTMLDivElement = firstGroup.querySelector('.e-message-item');
            expect(firstMessageItem.querySelector('.e-text').textContent).toBe('Hello, how are you?');

            const secondGroup: HTMLDivElement = messageGroup[1];
            expect(secondGroup.querySelector('.e-message-header').textContent).toBe('Jane Smith');
            expect(secondGroup.querySelector('.e-time').textContent).toBe('11:14 AM');
            expect(secondGroup.querySelector('.e-message-icon').textContent).toBe('JS');
            const secondMessageItem: HTMLDivElement = secondGroup.querySelector('.e-message-item');
            expect(secondMessageItem.querySelector('.e-text').textContent).toBe('I\'m fine, thanks!');
        });

        it('Messages property - message grouping', () => {
            chatUI = new ChatUI({
                user: {
                    id: 'user1',
                    user: 'John Doe',
                    avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                    avatarBgColor: '#ff0000',
                    cssClass: 'custom-user-class'
                },
                messages: messages,
                height: '500px',
                width: '500px'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.querySelectorAll('.e-message-group').length).toBe(3);
            const messageGroupRight: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-right');
            expect(messageGroupRight.length).toBe(2);
            const firstGroup: HTMLDivElement = messageGroupRight[0];
            const rightHeaderElement: HTMLDivElement = firstGroup.querySelector('.e-message-header');
            expect(rightHeaderElement).toBeNull();
            const firstMessageItems: NodeListOf<HTMLDivElement> = firstGroup.querySelectorAll('.e-message-item');
            expect(firstMessageItems.length).toBe(2);
            expect(firstMessageItems[0].querySelector('.e-time').textContent).toBe('13/10/2024 11:13 AM');
            expect(firstMessageItems[0].querySelector('.e-text').textContent).toBe('Hi!');

            const messageGroupLeft: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-left');
            expect(messageGroupLeft.length).toBe(1);
            const secondGroup: HTMLDivElement = messageGroupLeft[0];
            const leftHeaderElement: HTMLDivElement = secondGroup.querySelector('.e-message-header');
            expect(leftHeaderElement).not.toBeNull();
            const secondGroupMessageItems: NodeListOf<HTMLDivElement> = secondGroup.querySelectorAll('.e-message-item');
            expect(secondGroupMessageItems.length).toBe(2);
            expect(secondGroupMessageItems[0].querySelector('.e-text').textContent).toBe('Hello!');

            const thirdGroup: HTMLDivElement = messageGroupRight[1];
            const rightHeaderElementTwo: HTMLDivElement = thirdGroup.querySelector('.e-message-header');
            expect(rightHeaderElementTwo).toBeNull();
            const thirtGroupMessageItems: NodeListOf<HTMLDivElement> = thirdGroup.querySelectorAll('.e-message-item');
            expect(thirtGroupMessageItems.length).toBe(2);
            expect(thirtGroupMessageItems[0].querySelector('.e-time').textContent).toBe('15/10/2024 11:15 AM');
            expect(thirtGroupMessageItems[0].querySelector('.e-text').textContent).toBe('I am doing well too, thank you!');
        });

        it('status icon handling', () => {
            chatUI = new ChatUI({
                user: {
                    id: 'user1',
                    user: 'John Doe',
                    avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                    avatarBgColor: '#ff0000',
                    cssClass: 'custom-user-class',
                    statusIconCss: 'e-icons e-user-online'
                },
                messages: messages,
                height: '500px',
                width: '500px',
                headerIconCss: 'e-user'
            });
            chatUI.appendTo('#chatUI');
            const headerIconElement: HTMLElement = chatUIElem.querySelector('.e-header-icon');
            const messageIconElement: HTMLElement = chatUIElem.querySelector('.e-message-icon');
            const headerStatusElement = headerIconElement.querySelector('.e-user-status-icon');
            const messageStatusElement = messageIconElement.querySelector('.e-user-status-icon');

            expect(headerStatusElement).not.toBeNull();
            expect(headerStatusElement.classList.contains('e-user-online')).toBe(true);
            expect(messageStatusElement).not.toBeNull();
            expect(messageStatusElement.classList.contains('e-user-online')).toBe(true);
        });

        it('status icon', () => {
            chatUI = new ChatUI({
                user: {
                    id: 'user1',
                    user: 'John Doe',
                    avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                    avatarBgColor: '#ff0000',
                    cssClass: 'custom-user-class'
                },
                messages: usersMessage,
                height: '500px',
                width: '500px',
                headerIconCss: 'e-user'
            });
            chatUI.appendTo('#chatUI');
            const headerIconElement: HTMLElement = chatUIElem.querySelector('.e-header-icon');
            const messageIconElement: HTMLElement = chatUIElem.querySelector('.e-message-icon');
            const headerStatusElement = headerIconElement.querySelector('.e-user-status-icon');
            const messageStatusElement = messageIconElement.querySelector('.e-user-status-icon');

            expect(headerStatusElement).toBeNull();
            expect(messageStatusElement).toBeNull();
        });

        it('Locale checking', () => {
            L10n.load({
                'de': {
                    "chat-ui": {
                        "oneUserTyping": '{0} tippt',
                        "twoUserTyping": '{0} und {1} tippen gerade',
                        "threeUserTyping": '{0}, {1} und {2} andere tippen gerade',
                        "multipleUsersTyping": '{0}, {1} und {2} andere tippen gerade'
                    }
                }
            });
            chatUI = new ChatUI({
            });
            chatUI.appendTo('#chatUI');
            chatUI.user = {
                id: 'user1',
                user: 'John Doe',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                avatarBgColor: '#ff0000',
                cssClass: 'custom-user-class'
            };
            chatUI.dataBind();
            chatUI.typingUsers = [
                {user: 'Reena'},
                {user: 'John'},
                {user: 'Albert'},
                {user: 'Sam'}
            ];
            chatUI.dataBind();
            chatUI.locale = 'de';
            chatUI.dataBind();
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            let userIcon: NodeListOf<HTMLImageElement> =typingInicator.querySelectorAll('.e-user-icon');
            expect(userIcon.length).toBe(3);
            let userText: HTMLSpanElement = typingInicator.querySelector('.e-user-text');
            expect(userText.textContent).toBe('Reena, John und 2 andere tippen gerade');
        });

        it('Locale checking without typing users', () => {
            L10n.load({
                'de': {
                    "chat-ui": {
                        "oneUserTyping": '{0} tippt',
                        "twoUserTyping": '{0} und {1} tippen gerade',
                        "threeUserTyping": '{0}, {1} und {2} andere tippen gerade',
                        "multipleUsersTyping": '{0}, {1} und {2} andere tippen gerade'
                    }
                }
            });
            chatUI = new ChatUI({
            });
            chatUI.appendTo('#chatUI');
            chatUI.user = {
                id: 'user1',
                user: 'John Doe',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                avatarBgColor: '#ff0000',
                cssClass: 'custom-user-class'
            };
            chatUI.dataBind();
            chatUI.locale = 'de';
            chatUI.dataBind();
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            expect(typingInicator).toBeNull();
        });

        it('Typing user dynamic addition', () => {
            chatUI = new ChatUI({
                typingUsers: [{user: 'Reena',avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic02.png'}]
            });
            chatUI.appendTo('#chatUI');
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            let userIcon: NodeListOf<HTMLImageElement> =typingInicator.querySelectorAll('.e-user-icon');
            expect(userIcon.length).toBe(1);
            let userText: HTMLSpanElement = typingInicator.querySelector('.e-user-text');
            expect(userText.textContent).toBe('Reena is typing');
            chatUI.typingUsers = [{user: 'Nile',avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic02.png'}, {user: 'John',avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png'}];
            chatUI.dataBind();
            typingInicator = chatUIElem.querySelector('.e-typing-indicator');
            userIcon =typingInicator.querySelectorAll('.e-user-icon');
            expect(userIcon.length).toBe(2);
            userText = typingInicator.querySelector('.e-user-text');
            expect(userText.textContent).toBe('Nile and John are typing');
        });

        it('Multiple Typing user addition', () => {
            chatUI = new ChatUI({
                typingUsers: [
                    {user: 'Reena'},
                    {user: 'John'},
                    {user: 'Albert'},
                    {user: 'Sam'}
                ]
            });
            chatUI.appendTo('#chatUI');
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            let userIcon: NodeListOf<HTMLImageElement> =typingInicator.querySelectorAll('.e-user-icon');
            expect(userIcon.length).toBe(3);
            let userText: HTMLSpanElement = typingInicator.querySelector('.e-user-text');
            expect(userText.textContent).toBe('Reena, John, and 2 others are typing');
        });

        it('Checking the status icon in typing user', () => {
            chatUI = new ChatUI({
                typingUsers: [
                    {user: 'Reena'}
                ]
            });
            chatUI.appendTo('#chatUI');
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            let statusIcon: HTMLSpanElement = typingInicator.querySelector('.e-user-status-icon');
            expect (statusIcon).toBeNull();
        });

        it('Three users Typing check', () => {
            chatUI = new ChatUI({
                typingUsers: [
                    {user: 'Reena'},
                    {user: 'John'},
                    {user: 'Albert'}
                ]
            });
            chatUI.appendTo('#chatUI');
            let typingInicator: HTMLDivElement = chatUIElem.querySelector('.e-typing-indicator');
            let userIcon: NodeListOf<HTMLImageElement> =typingInicator.querySelectorAll('.e-user-icon');
            expect(userIcon.length).toBe(3);
            let userText: HTMLSpanElement = typingInicator.querySelector('.e-user-text');
            expect(userText.textContent).toBe('Reena, John, and 1 other are typing');
        });

        it('ShowTimeBreak prop checking', () => {
            chatUI = new ChatUI({
                user: {
                    id: 'user1',
                    user: 'John Doe',
                    avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png',
                    avatarBgColor: '#ff0000',
                    cssClass: 'custom-user-class'
                },
                messages: messages,
                showTimeBreak: false,
                height: '500px',
                width: '500px'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.querySelectorAll('.e-message-group').length).toBe(3);
            const messageGroupRight: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-right');
            expect(messageGroupRight.length).toBe(2);
            const firstGroup: HTMLDivElement = messageGroupRight[0];
            const rightHeaderElement: HTMLDivElement = firstGroup.querySelector('.e-message-header');
            expect(rightHeaderElement).toBeNull();
            const firstMessageItems: NodeListOf<HTMLDivElement> = firstGroup.querySelectorAll('.e-message-item');
            expect(firstMessageItems.length).toBe(2);
            expect(firstMessageItems[0].querySelector('.e-time').textContent).toBe('13/10/2024 11:13 AM');
            expect(firstMessageItems[0].querySelector('.e-text').textContent).toBe('Hi!');

            const messageGroupLeft: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-group.e-left');
            expect(messageGroupLeft.length).toBe(1);
            const secondGroup: HTMLDivElement = messageGroupLeft[0];
            const leftHeaderElement: HTMLDivElement = secondGroup.querySelector('.e-message-header');
            expect(leftHeaderElement).not.toBeNull();
            const secondGroupMessageItems: NodeListOf<HTMLDivElement> = secondGroup.querySelectorAll('.e-message-item');
            expect(secondGroupMessageItems.length).toBe(2);
            expect(secondGroupMessageItems[0].querySelector('.e-text').textContent).toBe('Hello!');

            const thirdGroup: HTMLDivElement = messageGroupRight[1];
            const rightHeaderElementTwo: HTMLDivElement = thirdGroup.querySelector('.e-message-header');
            expect(rightHeaderElementTwo).toBeNull();
            const thirtGroupMessageItems: NodeListOf<HTMLDivElement> = thirdGroup.querySelectorAll('.e-message-item');
            expect(thirtGroupMessageItems.length).toBe(2);
            expect(thirtGroupMessageItems[0].querySelector('.e-time').textContent).toBe('15/10/2024 11:15 AM');
            expect(thirtGroupMessageItems[0].querySelector('.e-text').textContent).toBe('I am doing well too, thank you!');

            let timeBreakElements: NodeListOf<HTMLDivElement> = chatUIElem.querySelector('.e-message-wrapper').querySelectorAll('.e-timebreak');
            expect(timeBreakElements.length).toBe(0);
            chatUI.showTimeBreak = true;
            chatUI.dataBind();
            timeBreakElements = chatUIElem.querySelector('.e-message-wrapper').querySelectorAll('.e-timebreak');
            expect(timeBreakElements.length).toBe(3);
            const timeStampEle1: HTMLSpanElement = timeBreakElements[0].querySelector('.e-timestamp');
            const timeStampEle2: HTMLSpanElement = timeBreakElements[1].querySelector('.e-timestamp');
            const timeStampEle3: HTMLSpanElement = timeBreakElements[2].querySelector('.e-timestamp');
            expect(timeStampEle1.textContent).toBe('October 13, 2024');
            expect(timeStampEle2.textContent).toBe('October 14, 2024');
            expect(timeStampEle3.textContent).toBe('October 15, 2024');
        });
        it('Header Toolbar checking', () => {
            chatUI = new ChatUI({
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-menu', align: 'Left' },
                        { iconCss: 'e-icons e-search', align: 'Right' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
            expect(toolbarItems.length).toBe(2);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-menu')).toBe(true);
            expect(toolbarItems[1].querySelector('.e-icons').classList.contains('e-search')).toBe(true);
        });

        it('Header Toolbar dynamic update checking', () => {
            chatUI = new ChatUI({
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-search', align: 'Right' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarElement: HTMLDivElement = chatUIElem.querySelector('.e-chat-toolbar.e-toolbar');
            let toolbarItems: NodeListOf<HTMLDivElement> = toolbarElement.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(1);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(true);
            chatUI.headerToolbar = {
                items: [{ iconCss: 'e-icons e-user', align: 'Right' }, { iconCss: 'e-icons e-folder', align: 'Right' }],
            };
            chatUI.dataBind();
            (toolbarElement as any).ej2_instances[0].dataBind();
            toolbarItems = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
            expect(toolbarItems.length).toBe(2);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(false);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-user')).toBe(true);
            expect(toolbarItems[1].querySelector('.e-icons').classList.contains('e-folder')).toBe(true);
        });

        it('Header Toolbar tabindex value checking', () => {
            chatUI = new ChatUI({
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-menu', align: 'Left', tabIndex: 1 },
                        { iconCss: 'e-icons e-search', align: 'Right', tabIndex: 2 }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
            expect(toolbarItems.length).toBe(2);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
        });

        it('Header Toolbar dynamic tabindex value checking', () => {
            chatUI = new ChatUI({
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-search', align: 'Right' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarElement: HTMLDivElement = chatUIElem.querySelector('.e-chat-toolbar.e-toolbar');
            let toolbarItems: NodeListOf<HTMLDivElement> = toolbarElement.querySelectorAll('.e-toolbar-item');
            expect(toolbarItems.length).toBe(1);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('0');
            chatUI.headerToolbar = {
                items: [{ iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 }, { iconCss: 'e-icons e-folder', align: 'Right', tabIndex: 2 }],
            };
            chatUI.dataBind();
            (toolbarElement as any).ej2_instances[0].dataBind();
            toolbarItems = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
            expect(toolbarItems.length).toBe(2);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(false);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-user')).toBe(true);
            expect(toolbarItems[1].querySelector('.e-icons').classList.contains('e-folder')).toBe(true);
            expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
            expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
        });
    
        it('Suggestions checking', () => {
            const suggestionList = ['How are you?', 'Nice to meet you', 'What\'s up?'];
            chatUI = new ChatUI({
                suggestions: suggestionList
            });
            chatUI.appendTo('#chatUI');
            const suggestionElements: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElements.length).toBe(suggestionList.length);
            suggestionElements.forEach((element, index) => {
                expect(element.textContent).toBe(suggestionList[index]);
            });
        });

        it('Suggestions dynamic update checking', () => {
            const suggestionList = ['How are you?', 'Nice to meet you', 'What\'s up?'];
            chatUI = new ChatUI({
            });
            chatUI.appendTo('#chatUI');
            chatUI.suggestions = suggestionList;
            chatUI.dataBind();
            const suggestionElements: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElements.length).toBe(suggestionList.length);
            suggestionElements.forEach((element, index) => {
                expect(element.textContent).toBe(suggestionList[index]);
            });
        });

        it('Suggestions value update', () => {
            const suggestionList = ['How are you?', 'Nice to meet you', 'What\'s up?'];
            chatUI = new ChatUI({
                suggestions: ["Hi", "Hello"],
            });
            chatUI.appendTo('#chatUI');
            chatUI.suggestions = suggestionList;
            chatUI.dataBind();
            const suggestionElements: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElements.length).toBe(suggestionList.length);
            suggestionElements.forEach((element, index) => {
                expect(element.textContent).toBe(suggestionList[index]);
            });
        });

        it('Suggestions click', () => {
            const suggestionList = ['How are you?', 'Nice to meet you', 'What\'s up?'];
            chatUI = new ChatUI({
                suggestions: suggestionList,
                user: { user: 'Albert', id: 'user1' }
            });
            chatUI.appendTo('#chatUI');
            const suggestionElements: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-suggestion-list li');
            expect(suggestionElements.length).toBe(suggestionList.length);
            suggestionElements.forEach((element, index) => {
                expect(element.textContent).toBe(suggestionList[index]);
            });
            const suggestionItem: HTMLElement = suggestionElements[0];
            suggestionItem.click();
            const messageItem: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
            expect(messageItem[0].querySelector('.e-text').textContent).toBe('How are you?');
        });
    
        it('TimeStampFormat checking', () => {
            chatUI = new ChatUI({
                messages: [messages[0]],
                timeStampFormat: 'dd/MM/yyyy HH:mm'
            });
            chatUI.appendTo('#chatUI');
            let timeElement: HTMLDivElement = chatUIElem.querySelector('.e-time');
            expect(timeElement.textContent).toBe('13/10/2024 11:13');
            chatUI.timeStampFormat = 'dd/MM/yyyy hh:mm a';
            chatUI.dataBind();
            timeElement = chatUIElem.querySelector('.e-time');
            expect(timeElement.textContent).toBe('13/10/2024 11:13 AM');
        });
    
        it('ShowTimeStamp checking', () => {
            chatUI = new ChatUI({
                messages: [messages[0]],
                showTimeStamp: false
            });
            chatUI.appendTo('#chatUI');
            const timeElement = chatUIElem.querySelector('.e-time');
            expect(timeElement.textContent).toBe('');
            chatUI.showTimeStamp = true;
            chatUI.dataBind();
            expect(chatUIElem.querySelector('.e-time').textContent).toBe('13/10/2024 11:13 AM');
        });
    
        it('AutoScrollToBottom checking', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
                autoScrollToBottom: false
            });
            chatUI.appendTo('#chatUI');
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                expect(messageWrapper.scrollTop).not.toBe(0);
                done();
            }, 100);
        });
    
        it('AutoScrollToBottom change', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
                autoScrollToBottom: false
            });
            chatUI.appendTo('#chatUI');
            chatUI.autoScrollToBottom = true;
            chatUI.dataBind();
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                expect(messageWrapper.scrollTop).not.toBe(0);
                done();
            }, 100);
        });

        it('LoadOnDemand checking', (done: DoneFn) => {
            const longMessageList: MessageModel[] = Array(150).fill(null).map((_, index) => ({
                id: `msg${index}`,
                text: `Message ${index}`,
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            }));
    
            chatUI = new ChatUI({
                messages: longMessageList,
                height: '300px',
                loadOnDemand: true,
                showTimeBreak: true
            });
            chatUI.appendTo('#chatUI');
            
            setTimeout(() => {
                const messageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                expect(messageItems.length).toBeLessThan(longMessageList.length);
    
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                messageWrapper.scrollTop = 0;
                messageWrapper.dispatchEvent(new Event('scroll'));
    
                setTimeout(() => {
                    const updatedMessageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                    const timebreakElements: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-timebreak');
                    expect(timebreakElements.length).toBe(1);
                    expect(updatedMessageItems.length).toBeGreaterThan(messageItems.length);
                    done();
                }, 1500);
            }, 100);
        });
        it('LoadOnDemand checking with no timebreak', (done: DoneFn) => {
            const longMessageList: MessageModel[] = Array(150).fill(null).map((_, index) => ({
                id: `msg${index}`,
                text: `Message ${index}`,
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            }));
    
            chatUI = new ChatUI({
                messages: longMessageList,
                height: '300px',
                loadOnDemand: true,
                showTimeBreak: false
            });
            chatUI.appendTo('#chatUI');
            
            setTimeout(() => {
                const messageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                expect(messageItems.length).toBeLessThan(longMessageList.length);
    
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                messageWrapper.scrollTop = 0;
                messageWrapper.dispatchEvent(new Event('scroll'));
    
                setTimeout(() => {
                    const updatedMessageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                    const timebreakElements: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-timebreak');
                    expect(timebreakElements.length).toBe(0);
                    expect(updatedMessageItems.length).toBeGreaterThan(messageItems.length);
                    done();
                }, 1500);
            }, 100);
        });
        it('should correctly format time when timeStamp is a string', () => {
            const timeStampString = '2024-10-15T11:15:00';
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'Hi!',
                        author: {
                            user: 'John Doe',
                            id: 'user1'
                        },
                        timeStamp: (timeStampString as any)
                    }
                ]
            });
            chatUI.appendTo('#chatUI');
            const timeElement = chatUIElem.querySelector('.e-time');
            expect(timeElement.textContent).toBe('15/10/2024 11:15 AM');
        });
        it('should return default format when timeStampFormat is empty', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'Hi!',
                        author: {
                            user: 'John Doe',
                            id: 'user1'
                        }
                    }
                ],
                timeStampFormat: null
            });
            chatUI.appendTo('#chatUI');
            const timeElement = chatUIElem.querySelector('.e-time');
            expect(timeElement.textContent).not.toBe(null);
        });
        it('Checking message element id if id is not set', (done: DoneFn) => {
            const longMessageList: MessageModel[] = Array(150).fill(null).map((_, index) => ({
                text: `Message ${index}`,
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            }));
    
            chatUI = new ChatUI({
                messages: longMessageList,
                height: '300px'
            });
            chatUI.appendTo('#chatUI');
            
            setTimeout(() => {
                const messageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                expect(messageItems.length).toBe(longMessageList.length);
                const timebreakElements: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-timebreak');
                expect(timebreakElements.length).toBe(0);
                messageItems.forEach((messageItem, index) => {
                    const expectedId = `${chatUI.element.id}-message-${index + 1}`;
                    expect(messageItem.id).toBe(expectedId);
                });
                done();
            }, 100);
        });
        it('isTimeBreakAdded method checking with loadOnDemand', (done: DoneFn) => {
            const messagesWithDifferentDates: MessageModel[] = [
                {
                    text: 'Message 1',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date('2024-10-13T11:13:00'),
                },
                {
                    text: 'Message 2',
                    author: { id: 'user2', user: 'Jane Smith' },
                    timeStamp: new Date('2024-10-14T11:14:00'),
                },
                {
                    text: 'Message 3',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date('2024-10-15T11:15:00'),
                }
            ];
            chatUI = new ChatUI({
                messages: messagesWithDifferentDates,
                height: '300px',
                loadOnDemand: true,
                showTimeBreak: true,
                user: { id: 'user2', user: 'Jane Smith' }
            });
            chatUI.appendTo('#chatUI');
            setTimeout(() => {
                const timebreakElements: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-timebreak');
                expect(timebreakElements.length).toBe(3);
                const timeStampTexts = Array.from(timebreakElements).map(timebreak => timebreak.querySelector('.e-timestamp').textContent);
                expect(timeStampTexts).toContain('October 13, 2024');
                expect(timeStampTexts).toContain('October 14, 2024');
                expect(timeStampTexts).toContain('October 15, 2024');
                done();
            }, 100);
        });
        it('Sending a new message', (done: DoneFn) => {
            const sTag: HTMLElement = createElement('script', { id: 'emptyChatTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div><h1>Welcome to Chat</h1><p>Start your conversation</p></div>';
            document.body.appendChild(sTag);
            chatUI = new ChatUI({
                emptyChatTemplate: '#emptyChatTemplate',
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');
            const initialBannerView = chatUIElem.querySelector('.e-empty-chat-template');
            expect(initialBannerView).not.toBeNull();
            const footerElem: HTMLDivElement = chatUIElem.querySelector('.e-footer');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send');
            expect(textareaElem).not.toBeNull();
            expect(sendIcon).not.toBeNull();
            expect(sendIcon.classList.contains('disabled')).toBe(true);
            textareaElem.innerText = 'Hello!';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);
            setTimeout(() => {
                    const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                    footerElem.dispatchEvent(keyEvent);
                    expect(sendIcon.classList.contains('disabled')).toEqual(true);
                    const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    const lastMessage: HTMLElement = messageItems[messageItems.length - 1];
                    expect(lastMessage).not.toBeNull();
                    expect(lastMessage.querySelector('.e-text').textContent).toBe('Hello!');
                    const messageGroup: HTMLElement = lastMessage.closest('.e-message-group') as HTMLElement;
                    expect(messageGroup.classList.contains('e-right')).toBe(true);
                    expect(textareaElem.innerText).toBe('');
                    done();
            }, 450, done);
        });
        it('scroll to bottom click handling', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
            });
            chatUI.appendTo('#chatUI');
            const scrollToBottomIcon: HTMLButtonElement = chatUIElem.querySelector('#scrollDownButton');
            scrollToBottomIcon.click();
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                expect(messageWrapper.scrollTop).not.toBe(0);
                done();
            }, 100);
        });
        it('scroll to bottom click handling With Suggestions', (done: DoneFn) => {
            const suggestionList = ['How are you?', 'Nice to meet you', 'What\'s up?'];
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
                suggestions: suggestionList
            });
            chatUI.appendTo('#chatUI');
            const scrollToBottomIcon: HTMLButtonElement = chatUIElem.querySelector('#scrollDownButton');
            scrollToBottomIcon.click();
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                expect(messageWrapper.scrollTop).not.toBe(0);
                const suggestionElements: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-suggestion-list li');
                expect(suggestionElements.length).toBe(suggestionList.length);
                suggestionElements.forEach((element, index) => {
                    expect(element.textContent).toBe(suggestionList[index]);
                });
                done();
            }, 100);
        });
        it('scroll to bottom key handling', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
            });
            chatUI.appendTo('#chatUI');
            const scrollToBottomIcon: HTMLButtonElement = chatUIElem.querySelector('#scrollDownButton');
            const keyEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true,
                cancelable: true
              });
            scrollToBottomIcon.dispatchEvent(keyEvent);
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                expect(messageWrapper.scrollTop).not.toBe(0);
                done();
            }, 100);
        });
        it('trigger blur event', () => {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'John Doe' },
                messages: []
            });
            chatUI.appendTo('#chatUI');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaElem).not.toBeNull();
            (textareaElem as any).innerText = 'Hello!';
            const blurEvent = new Event('blur', {
                bubbles: true,
                cancelable: true
            });
            textareaElem.dispatchEvent(blurEvent);
            expect(textareaElem as any).not.toBeNull();
            expect(textareaElem.innerText).toBe('Hello!');
        });
        it('Toolbar item click', () => {
            let isCancellableEvent: boolean = false;
            chatUI = new ChatUI({
                headerToolbar: {
                    items: [
                        { iconCss: 'e-icons e-user', align: 'Right' }
                    ],
                    itemClicked: (args: ToolbarItemClickedEventArgs) => {
                        args.cancel = isCancellableEvent;
                    }
                }
            });
            chatUI.appendTo('#chatUI');
            const toolbarItem: HTMLElement = chatUIElem.querySelector('.e-chat-toolbar .e-toolbar-right .e-icons');
            expect(toolbarItem).not.toBeNull();
            expect(toolbarItem.classList.contains('e-user')).toEqual(true);
            toolbarItem.click();
            isCancellableEvent = true;
            toolbarItem.click();
        });
        it('should scroll to bottom immediately if not Angular or React', () => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
            });
            chatUI.appendTo('#chatUI');
            const spyScrollToBottom = spyOn(chatUI, 'scrollToBottom').and.callThrough();
            (chatUI as any).updateScrollPosition(false, 0);
            expect(spyScrollToBottom).toHaveBeenCalled();
        });
        
        it('should call handleAutoScroll in setTimeout for Angular/React if it is method call', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
            });
            chatUI.isAngular = true;
            chatUI.appendTo('#chatUI');
            const spyHandleAutoScroll = spyOn<any>(chatUI, 'handleAutoScroll').and.callThrough();
            (chatUI as any).updateScrollPosition(true, 5);
            setTimeout(() => {
                expect(spyHandleAutoScroll).toHaveBeenCalled();
                done();
            }, 20);
        });
        it('should call scrollToBottom in setTimeout for Angular/React', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px',
            });
            chatUI.isAngular = true;
            chatUI.appendTo('#chatUI');
            const spyHandleAutoScroll = spyOn<any>(chatUI, 'scrollToBottom').and.callThrough();
            (chatUI as any).updateScrollPosition(true, 5);
            setTimeout(() => {
                expect(spyHandleAutoScroll).toHaveBeenCalled();
                done();
            }, 20);
        });

        it('should send message on Enter key press without Shift', (done: DoneFn) => {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');
            const footerEle: HTMLDivElement = chatUIElem.querySelector('.e-footer');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            (textareaElem as any).innerText = 'Hello!';
            const keyEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: false,
                bubbles: true
            });
            footerEle.dispatchEvent(keyEvent);
            setTimeout(() => {
                const messageItem: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                expect(messageItem[0].querySelector('.e-text').textContent).toBe('Hello!');
                done();
            }, 100);
        });

        it('should render toolbar if it does not already exist', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            chatUI.headerToolbar = {
                items: [
                    { iconCss: 'e-icons e-home', align: 'Right' }
                ]
            };
            chatUI.dataBind();
            const toolbarItems = chatUIElem.querySelectorAll('.e-chat-toolbar .e-toolbar-item');
            expect(toolbarItems.length).toBe(1);
            expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-home')).toBe(true);
        });

        it('Compact mode checking', () => {

            const testMessages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Hello, how are you?',
                    author: {
                        id: 'user1',
                        user: 'John Doe'
                    },
                    timeStamp: new Date('October 13, 2024 11:13:00')
                },
                {
                    id: 'msg2',
                    text: 'I\'m fine, thanks!',
                    author: {
                        id: 'user2',
                        user: 'Jane Smith'
                    },
                    timeStamp: new Date('October 13, 2024 11:14:00'),
                    timeStampFormat: 'hh:mm a'
                }]

            chatUI = new ChatUI({
                messages: testMessages,
                height: '300px',
                enableCompactMode: true,
                showTimeBreak: true
            });
            chatUI.appendTo('#chatUI');
            
            expect(chatUIElem.classList.contains('e-compact-mode')).toBe(true);
            const messageGroups: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-group');
            expect(messageGroups.length).toBeGreaterThan(0);
            expect(messageGroups[0].classList.contains('e-left')).toBe(true);
            expect(messageGroups[1].classList.contains('e-left')).toBe(true);
        });

        it('Compact mode class dynamic check', () => {
            const newProp: any = {
                enableCompactMode : true
            }
            chatUI = new ChatUI({
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-compact-mode')).toEqual(false);
            chatUI.setProperties(newProp);
            expect(chatUIElem.classList.contains('e-compact-mode')).toEqual(true);
        });

        it('Compact mode dynamic checking', () => {

            const testMessages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Hello, how are you?',
                    author: {
                        id: 'user1',
                        user: 'John Doe'
                    },
                    timeStamp: new Date('October 13, 2024 11:13:00')
                },
                {
                    id: 'msg2',
                    text: 'I\'m fine, thanks!',
                    author: {
                        id: 'user2',
                        user: 'Jane Smith'
                    },
                    timeStamp: new Date('October 13, 2024 11:14:00'),
                    timeStampFormat: 'hh:mm a'
                }]

            chatUI = new ChatUI({
                messages: testMessages,
                height: '300px',
                showTimeBreak: true
            });
            chatUI.appendTo('#chatUI');
            chatUI.enableCompactMode = true;
            chatUI.dataBind();
            
            const messageGroups: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-group');
            expect(messageGroups.length).toBeGreaterThan(0);
            expect(messageGroups[0].classList.contains('e-left')).toBe(true);
            expect(messageGroups[1].classList.contains('e-left')).toBe(true);
        });
        it('Hidden textarea value checking', (done: DoneFn) => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            textareaElem.innerText = 'Hello!';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);
            setTimeout(() => {
                const hiddenTextarea: HTMLTextAreaElement = chatUI.element.querySelector('.e-hidden-textarea') as HTMLTextAreaElement;
                expect(hiddenTextarea).not.toBeNull();
                expect(hiddenTextarea.value).toEqual('Hello!');
                done();
            }, 450, done);
        });
        it('should handle pasting content', (done: DoneFn) => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            
            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
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
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            
            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaEle).not.toBeNull();
            // check for undo action with no previous values in the stack
            const undoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
            (chatUI as any).footer.dispatchEvent(undoKeyEvent);
            textareaEle.innerText = 'Initial content';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
    
            setTimeout(() => {
                textareaEle.innerText = 'Changed content';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    (chatUI as any).footer.dispatchEvent(undoEvent);
                    setTimeout(() => {
                        expect(textareaEle.innerText).toBe('Initial content');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });
        
        it('should handle redo action', (done: DoneFn) => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
        
            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaEle).not.toBeNull();
            // check for redo action with no previous values in the stack
            const redoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
            (chatUI as any).footer.dispatchEvent(redoKeyEvent);
            textareaEle.innerText = 'Initial content';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent);
    
            setTimeout(() => {
                textareaEle.innerText = 'Changed content';
                textareaEle.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    const undoKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
                    (chatUI as any).footer.dispatchEvent(undoKeyEvent);
        
                    const redoEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true });
                    (chatUI as any).footer.dispatchEvent(redoEvent);
        
                    setTimeout(() => {
                        expect(textareaEle.innerText).toBe('Changed content');
                        done();
                    }, 0);
                }, 400);
            }, 400);
        });
    });

    describe('Template - ', () => {
        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
            }
        });
    
        it('Banner template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'emptyChatTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div><h1>Welcome to Chat</h1><p>Start your conversation</p></div>';
            document.body.appendChild(sTag);
            chatUI = new ChatUI({
                emptyChatTemplate: '#emptyChatTemplate'
            });
            chatUI.appendTo('#chatUI');
            const bannerElem: HTMLElement = chatUIElem.querySelector('.e-empty-chat-template');
            expect(bannerElem).not.toBeNull();
            expect(bannerElem.querySelector('h1').textContent).toEqual('Welcome to Chat');
            expect(bannerElem.querySelector('p').textContent).toEqual('Start your conversation');
            document.body.removeChild(sTag);
        });

        it('EmptyChat template checking', (done: DoneFn) => {
            const sTag: HTMLElement = createElement('script', { id: 'emptyChatTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div><h1>Welcome to Chat</h1><p>Start your conversation</p></div>';
            document.body.appendChild(sTag);
            chatUI = new ChatUI({
                emptyChatTemplate: '#emptyChatTemplate',
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');
            const initialBannerView = chatUIElem.querySelector('.e-empty-chat-template');
            expect(initialBannerView).not.toBeNull();
            const footerElem: HTMLDivElement = chatUIElem.querySelector('.e-footer');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send');
            expect(textareaElem).not.toBeNull();
            expect(sendIcon).not.toBeNull();
            textareaElem.innerText = 'Hello!';
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);
            setTimeout(() => {
                    const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                    footerElem.dispatchEvent(keyEvent);
                    const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    const lastMessage: HTMLElement = messageItems[messageItems.length - 1];
                    expect(lastMessage).not.toBeNull();
                    expect(lastMessage.querySelector('.e-text').textContent).toBe('Hello!');
                    const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper');
                    const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin');
                    expect(pinButton).not.toBeNull();
                    pinButton.click();
                    const pinnedMessage: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
                    expect(pinnedMessage.querySelector('.e-pinned-message-text').textContent).toBe('Hello!');
                    const deleteButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-trash');
                    expect(deleteButton).not.toBeNull();
                    deleteButton.click();
                    expect(initialBannerView).not.toBeNull();
                    done();
            }, 450, done);
        });
    
        it('Footer template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'chatFooterTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div><textarea></textarea><button>Send</button></div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                footerTemplate: '#chatFooterTemplate'
            });
            chatUI.appendTo('#chatUI');
    
            const footerElem: HTMLElement = chatUIElem.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();
            expect(footerElem.querySelector('textarea')).not.toBeNull();
            expect(footerElem.querySelector('button').textContent).toEqual('Send');
    
            document.body.removeChild(sTag);
        });
    
        it('Message template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'messageTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="message-item"><span class="author">${message.author.user}</span>: ${message.text}</div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                messageTemplate: '#messageTemplate',
                messages: [{
                    id: 'msg1',
                    text: 'Hello',
                    author: { id: 'user1', user: 'John' },
                    timeStamp: new Date()
                }]
            });
            chatUI.appendTo('#chatUI');
    
            const messageElem: HTMLElement = chatUIElem.querySelector('.message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.author').textContent).toEqual('John');
            expect(messageElem.textContent).toContain('Hello');
    
            document.body.removeChild(sTag);
        });
        it('Message template id checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'messageTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="message-item"><span class="author">${message.author.user}</span>: ${message.text}</div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                messageTemplate: '#messageTemplate',
                messages: [{
                    id: 'msg1',
                    text: 'Hello',
                    author: { id: 'user1', user: 'John' },
                    timeStamp: new Date()
                }],
                user: { id: 'user1', user: 'John' }
            });
            chatUI.appendTo('#chatUI');
            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-group');
            expect(messageWrapper.classList.contains('e-message-item-template')).toBe(true);
            const messageElem: HTMLElement = chatUIElem.querySelector('.message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.author').textContent).toEqual('John');
            expect(messageElem.textContent).toContain('Hello');
            document.body.removeChild(sTag);
        });

        it('Message template suggestions initial checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'messageTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="message-item"><span class="author">${message.author.user}</span>: ${message.text}</div>';
            document.body.appendChild(sTag);
            var suggestions = ['track', 'cancel'];
            chatUI = new ChatUI({
                messageTemplate: function(context: any) {
                    {
                        let isAdmin = context.message.author.id === 'admin';
                        let userImage = !isAdmin ? `<img class="message-user" src="${context.message.author.avatarUrl}" alt="${context.message.author.user}">` : '';
                        let suggestions = context.message.suggestions && context.message.suggestions.length > 0 && !isAdmin ?
                            `<div class="message-suggestions">${context.message.suggestions.map((suggestion: any) => `<button class="suggestion-button e-btn e-primary e-outline">${suggestion}</button>`).join('')}</div>` : '';
                        return `<div class="message-wrapper">
                                <div class="message-template">
                                    ${userImage}
                                    <div class="message-items e-card">
                                        <div class="message-text">${context.message.text}</div>
                                    </div>
                                </div>
                                <div class="suggestion-container">
                                    ${suggestions}
                                </div>
                            </div>`;
                    }
                },
                messages: [{
                    id: 'msg1',
                    text: 'Hello',
                    author: { id: 'user1', user: 'John' },
                    timeStamp: new Date(),
                    suggestions: suggestions
                }] as any
            });
            chatUI.appendTo('#chatUI');
            const messageElem: HTMLElement = chatUIElem.querySelector('.message-wrapper');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelectorAll('.suggestion-button').length).toBe(2);
            document.body.removeChild(sTag);
        });
    
        it('Time break template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'timeBreakTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="custom-time-break">${messageDate.toDateString()}</div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                timeBreakTemplate: '#timeBreakTemplate',
                showTimeBreak: true,
                messages: [
                    {
                        id: 'msg1',
                        text: 'Hello',
                        author: { id: 'user1', user: 'John' },
                        timeStamp: new Date('2023-01-01')
                    },
                    {
                        id: 'msg2',
                        text: 'Hi',
                        author: { id: 'user2', user: 'Jane' },
                        timeStamp: new Date('2023-01-02')
                    }
                ]
            });
            chatUI.appendTo('#chatUI');
    
            const timeBreakElem: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.custom-time-break');
            expect(timeBreakElem.length).toBe(2);
            expect(timeBreakElem[0].textContent).toEqual('Sun Jan 01 2023');
            expect(timeBreakElem[1].textContent).toEqual('Mon Jan 02 2023');
            document.body.removeChild(sTag);
        });
    
        it('Typing users template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'typingUsersTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="custom-typing-users">${users.length} user(s) typing...</div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                typingUsersTemplate: '#typingUsersTemplate',
                typingUsers: [{ id: 'user1', user: 'John' }, { id: 'user2', user: 'Jane' }]
            });
            chatUI.appendTo('#chatUI');
    
            const typingUsersElem: HTMLElement = chatUIElem.querySelector('.custom-typing-users');
            expect(typingUsersElem).not.toBeNull();
            expect(typingUsersElem.textContent).toEqual('2 user(s) typing...');
    
            document.body.removeChild(sTag);
        });
    
        it('Suggestion template checking', () => {
            const sTag: HTMLElement = createElement('script', { id: 'suggestionTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div class="custom-suggestion">${suggestion}</div>';
            document.body.appendChild(sTag);
    
            chatUI = new ChatUI({
                suggestionTemplate: '#suggestionTemplate',
                suggestions: ['How are you?', 'What\'s up?']
            });
            chatUI.appendTo('#chatUI');
    
            const suggestionElems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.custom-suggestion');
            expect(suggestionElems.length).toBe(2);
            expect(suggestionElems[0].textContent).toEqual('How are you?');
            expect(suggestionElems[1].textContent).toEqual('What\'s up?');
    
            document.body.removeChild(sTag);
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
            if (chatUI && !chatUI.isDestroyed) {
                chatUI.destroy();
            }
            if (element) {
                document.body.removeChild(element);
            };
        });
            it('getPersistData checking', () => {
                chatUI = new ChatUI({
                });
                chatUI.appendTo('#chatUI');
                expect(((<any>chatUIElem).ej2_instances[0] as any).getPersistData()).toEqual('{}');
                expect(interActiveChatBase.getPersistData()).toEqual('{}');
            });
    
            it('getDirective  checking', () => {
                chatUI = new ChatUI({
                });
                chatUI.appendTo('#chatUI');
                expect(((<any>chatUIElem).ej2_instances[0] as any).getDirective()).toEqual('EJS-CHATUI');
            });
        it('scrollToBottom method checking', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: messages,
                height: '300px'
            });
            chatUI.appendTo('#chatUI');
            
            setTimeout(() => {
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                messageWrapper.scrollTop = 0;
                chatUI.scrollToBottom();
                setTimeout(() => {
                    expect(messageWrapper.scrollTop).not.toBe(0);
                    done();
                }, 100);
            }, 100);
        });

        it('Focus Method check', (done: DoneFn) => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            const footerElem: HTMLDivElement = chatUIElem.querySelector('.e-footer');
            expect(textareaElem).not.toBeNull();
            chatUI.focus();
            setTimeout(() => {
                expect(document.activeElement).toBe(textareaElem);
                expect(footerElem.classList.contains('focused')).toBe(true);
                done();
            }, 100, done);
        });

        it('addMessage method checking with string parameter', () => {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');
            chatUI.addMessage('Hello, World!');
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.e-text').textContent).toBe('Hello, World!');
        });
    
        it('addMessage method checking with MessageModel parameter', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
    
            const newMessage: MessageModel = {
                id: 'msg1',
                text: 'Test message',
                author: { id: 'user2', user: 'Jane Smith' },
                timeStamp: new Date()
            };
            chatUI.addMessage(newMessage);
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.e-text').textContent).toBe('Test message');
            expect(chatUIElem.querySelector('.e-message-header').textContent).toBe('Jane Smith');
        });
        it('addMessage method checking with MessageModel parameter without id', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
    
            const newMessage: MessageModel = {
                text: 'Test message',
                author: { id: 'user2', user: 'Jane Smith' },
                timeStamp: new Date()
            };
            chatUI.addMessage(newMessage);
            const expectedId = `${chatUI.element.id}-message-1`;
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.id).toBe(expectedId);
            expect(messageElem.querySelector('.e-text').textContent).toBe('Test message');
            expect(chatUIElem.querySelector('.e-message-header').textContent).toBe('Jane Smith');
        });
        it('updateMessage method checking', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Initial text',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');
    
            const updatedMessage: MessageModel = {
                ...initialMessage,
                text: 'Updated text'
            };
            chatUI.updateMessage(updatedMessage, 'msg1');
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.e-text').textContent).toBe('Updated text');
        });
        it('updateMessage method checking with invalid id', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Initial text',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');
    
            const updatedMessage: MessageModel = {
                ...initialMessage,
                text: 'Updated text'
            };
            chatUI.updateMessage(updatedMessage, 'msg2');
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.e-text').textContent).not.toBe('Updated text');
        });
        it('updateMessage method check status, id and text change', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Original text',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date()
            };
            chatUI = new ChatUI({
                messages: [initialMessage],
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');
    
            const updatedMessage: MessageModel = {
                id: 'new1',
                status: {
                    iconCss: 'e-icons e-chat-seen',
                    text: 'Seen',
                    tooltip: 'Seen'
                },
                text: 'Updated text'
            };
            chatUI.updateMessage(updatedMessage, 'msg1');
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.querySelector('.e-text').textContent).toBe('Updated text');
            const statusIconElem = messageElem.querySelector('.e-status-icon');
            const statusTextElem = messageElem.querySelector('.e-status-text');
            expect(statusIconElem).not.toBeNull();
            expect(statusIconElem.className).toContain('e-chat-seen');
            expect(statusTextElem.textContent).toBe('Seen');
            expect(messageElem.id).toBe('new1');
        });
        
        it('scrollToMessage method check', () => {
            const messages: MessageModel[] = [
                { id: 'msg1', text: 'Message 1', author: { id: 'user1', user: 'John Doe' }, timeStamp: new Date() },
                { id: 'msg2', text: 'Message 2', author: { id: 'user1', user: 'John Doe' }, timeStamp: new Date() },
                { id: 'msg3', text: 'Message 3', author: { id: 'user1', user: 'John Doe' }, timeStamp: new Date() }
            ];
            
            chatUI = new ChatUI({ messages: messages });
            chatUI.appendTo('#chatUI');
            const scrollSpy = spyOn(chatUIElem.querySelector('#msg2'), 'scrollIntoView');
            chatUI.scrollToMessage('msg2');
            expect(scrollSpy).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start'
            });
        });

        it('destroy method checking', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            chatUI.destroy();
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(false);
            expect(chatUIElem.innerHTML).toBe('');
        });
    
        it('getModuleName method checking', () => {
            chatUI = new ChatUI({});
            chatUI.appendTo('#chatUI');
            expect(chatUI.getModuleName()).toBe('chat-ui');
        });
    });

    describe('Messaging Options', () => {

        const chatMessages: MessageModel[] = [
            {
                id: 'msg1',
                text: 'Hi!',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 13, 2024 11:13:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg2',
                text: 'How are you?',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 13, 2024 11:14:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg3',
                text: 'Hello!',
                author: { user: 'Jane Smith', id: 'user2', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 14, 2024 11:14:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg4',
                text: 'I am good, thanks! How about you?',
                author: { user: 'Jane Smith', id: 'user2', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 14, 2024 11:15:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg5',
                text: 'I am doing well too, thank you!',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 11:15:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg6',
                text: 'What have you been up to lately?',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 11:16:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg7',
                text: 'Just working on some projects.',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 12:00:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg8',
                text: 'That\'s great to hear!',
                author: { user: 'Jane Smith', id: 'user2', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 12:05:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg9',
                text: 'What about you?',
                author: { user: 'John Doe', id: 'user1', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 12:06:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            },
            {
                id: 'msg10',
                text: 'I have been traveling a bit.',
                author: { user: 'Jane Smith', id: 'user2', statusIconCss: 'e-icons e-user-online' },
                timeStamp: new Date('October 15, 2024 12:10:00'),
                status: { iconCss: 'e-icons e-check', tooltip: 'sent', text: 'Seen' }
            }
        ];
        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
                chatUI=null;
            }
        });

        it('should not render toolbar with invalid items', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'Test message',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                    }
                ],
                messageToolbarSettings: {
                    items: [
                        {}
                    ]
                }
            });
            chatUI.appendTo('#chatUI');

            const toolbarIcons = chatUIElem.querySelectorAll('.e-chat-message-toolbar .e-icons');
            expect(toolbarIcons.length).toBe(0); // No icons should be rendered
        });

        it('should trigger the itemClicked event on toolbar button click', () => {
            const toolbarClickSpy = jasmine.createSpy('toolbarItemClicked');

            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This message should trigger the event!',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                    }
                ],
                messageToolbarSettings: {
                    items: [
                        { type: 'Button', iconCss: 'e-icons e-chat-copy', tooltip: 'Copy' },
                    ],
                    itemClicked: toolbarClickSpy
                }
            });
            chatUI.appendTo('#chatUI');

            const toolbarButton: HTMLElement = chatUIElem.querySelector('.e-chat-message-toolbar .e-icons.e-chat-copy');
            expect(toolbarButton).not.toBeNull();

            toolbarButton.click();

            expect(toolbarClickSpy).toHaveBeenCalled();
        });

        it('should render the toolbar with message options', () => {
            chatUI = new ChatUI({
                messages: [{
                    id: 'msg1',
                    text: 'Test message',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date()
                }]
            });
            chatUI.appendTo('#chatUI');

            const toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar).not.toBeNull();
        });

        it('should render pinned message initially', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'This is a pinned message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: true
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const pinnedMessage: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
            const pinnedText = pinnedMessage.querySelector('.e-pinned-message-text');
            expect(pinnedText.textContent).toBe('This is a pinned message!');
        });

        it('should render forwarded message indicator initially', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'This is a forwarded message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isForwarded: true
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageItem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            const forwardedIndicator = messageItem.querySelector('.e-forwarded-indicator');
            expect(forwardedIndicator).not.toBeNull();
            expect(forwardedIndicator.textContent).toContain('Forwarded');
        });

        it('should render reply message content initially', () => {
            const repliedMessage: MessageReplyModel = {
                messageID: 'msg0',
                text: 'Replied to this message!',
                user: { id: 'user2', user: 'Jane Smith' }
            };
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'This is a reply!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                replyTo: repliedMessage
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageItem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            const replyWrapper = messageItem.querySelector('.e-reply-wrapper');
            expect(replyWrapper).not.toBeNull();
            const replyText = replyWrapper.querySelector('.e-reply-message-text');
            expect(replyText.textContent).toBe('Replied to this message!');
        });

        it('should show toolbar on message hover', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Hover over this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageItem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            const toolbar: HTMLElement = chatUIElem.querySelector('.e-chat-message-toolbar');

            expect(toolbar.classList.contains('e-show')).toBe(false);
            messageItem.dispatchEvent(new Event('mouseover'));
            expect(toolbar.classList.contains('e-show')).toBe(true);

            messageItem.dispatchEvent(new Event('mouseleave'));
            expect(toolbar.classList.contains('e-show')).toBe(false);
        });

        it('should contain toolbar items with specific classes', () => {
            chatUI = new ChatUI({
                messages: [{
                    id: 'msg1',
                    text: 'Test message',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date()
                }]
            });
            chatUI.appendTo('#chatUI');

            const toolbarIcons = chatUIElem.querySelectorAll('.e-chat-message-toolbar .e-icons');
            expect(toolbarIcons.length).toBeGreaterThan(0);

            const expectedClasses = ['e-chat-copy', 'e-chat-reply', 'e-chat-pin', 'e-chat-trash'];
            expectedClasses.forEach(className => {
                const icon = Array.from(toolbarIcons).find(icon => icon.classList.contains(className));
                expect(icon).not.toBeNull();
            });
        });

        it('should perform copy action upon clicking copy icon', function (done) {
            var initialMessage = {
                id: 'msg1',
                text: 'Copy this text!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const copyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-copy');
            expect(copyButton).not.toBeNull();

            const clipboardWriteSpy: jasmine.Spy = spyOn((navigator as any).clipboard, 'write').and.callFake(function (items: any) {
                expect(items.length).toBe(1); // Ensure there's one item
                var clipboardItem = items[0];

                clipboardItem.getType('text/plain').then(function(blob: any) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var copiedText = reader.result;
                        expect(copiedText).toBe('Copy this text!');
                        done();
                    };
                    reader.readAsText(blob);
                });

                return Promise.resolve();
            });

            copyButton.click();
        });

        it('should show reply UI when reply icon is clicked', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Reply to this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
            };
            chatUI = new ChatUI({
                user: { id: 'user2', user: 'Jane Doe' },
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
            expect(replyButton).not.toBeNull();

            replyButton.click();

            const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper');
            expect(replyWrapper).not.toBeNull();
            const replyText: HTMLElement = replyWrapper.querySelector('.e-reply-message-text');
            expect(replyText.textContent).toBe('Reply to this message!');
        });

        it('should remove message when delete icon is clicked', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Delete this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const deleteButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-trash');
            expect(deleteButton).not.toBeNull();

            deleteButton.click();

            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).toBeNull();
        });

        it('should remove message and adjust time breaks when delete icon is clicked', () => {
            const messages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Delete this message!',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date('October 15, 2024 12:30:00')
                },
                {
                    id: 'msg2',
                    text: 'Another message!',
                    author: { id: 'user2', user: 'Jane Doe' },
                    timeStamp: new Date('October 16, 2024 12:30:00')
                },
                {
                    id: 'msg3',
                    text: 'Yet another message!',
                    author: { id: 'user3', user: 'Alice Doe' },
                    timeStamp: new Date('October 17, 2024 12:30:00')
                },
                {
                    id: 'msg4',
                    text: 'Message again!',
                    author: { id: 'user4', user: 'Bob Doe' },
                    timeStamp: new Date('October 18, 2024 12:30:00')
                },
                {
                    id: 'msg5',
                    text: 'Last message!',
                    author: { id: 'user5', user: 'Charlie Doe' },
                    timeStamp: new Date('October 19, 2024 12:30:00')
                }
            ];

            chatUI = new ChatUI({
                messages: messages,
                showTimeBreak: true
            });
            chatUI.appendTo('#chatUI');

            // Check initial state - all messages should be present
            expect(chatUIElem.querySelectorAll('.e-message-item').length).toBe(5);

            // Mock the delete button click for each message
            messages.forEach((msg) => {
                const messageItem: HTMLElement = chatUIElem.querySelector(`#${msg.id}`) as HTMLElement;
                const deleteButton: HTMLElement = messageItem.querySelector('.e-icons.e-chat-trash') as HTMLElement;
                deleteButton.click();
            });

            // Check after deletion
            expect(chatUIElem.querySelectorAll('.e-message-item').length).toBe(0);
            expect(chatUIElem.querySelectorAll('.e-timebreak').length).toBe(0);
        });

        it('should pin a message when the pin icon is clicked', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Pin this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper');
            const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin');
            expect(pinButton).not.toBeNull();

            pinButton.click();

            const pinnedMessage: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
            expect(pinnedMessage.querySelector('.e-pinned-message-text').textContent).toBe('Pin this message!');
        });

        it('should handle multiple messages with one having a repliedTo property', () => {
            const messages: MessageModel[]= [
                {
                    id: 'msg1',
                    text: 'First message!',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date(),
                },
                {
                    id: 'msg2',
                    text: 'Second message!',
                    author: { id: 'user2', user: 'Jane Smith' },
                    timeStamp: new Date(),
                },
                {
                    id: 'msg3',
                    text: 'Third message with reply!',
                    author: { id: 'user3', user: 'Alice Johnson' },
                    timeStamp: new Date(),
                    replyTo: {
                        messageID: 'msg1',
                        text: 'First message!',
                        user: { id: 'user2', user: 'Jane Smith' }
                    }
                }
            ];

            chatUI = new ChatUI({
                user: { id: 'user4', user: 'Bob Brown' },
                messages: messages
            });
            chatUI.appendTo('#chatUI');

            // Check for all messages presence and repliedTo property
            const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
            expect(messageItems.length).toBe(3);

            const repliedMessage: HTMLElement = messageItems[2];
            const replyWrapper: HTMLElement = repliedMessage.querySelector('.e-reply-wrapper');
            expect(replyWrapper).not.toBeNull();

            const replyText: HTMLElement = replyWrapper.querySelector('.e-reply-message-text');
            expect(replyText.textContent).toBe('First message!');

            // Clicking the reply button to update reply values
            const replyButton: HTMLElement = chatUIElem.querySelectorAll('.e-icons.e-chat-reply')[1] as HTMLElement;
            expect(replyButton).not.toBeNull();

            replyButton.click();

            // Verify the reply wrapper updates with new values
            const updatedReplyWrapper: HTMLElement = (chatUI as any).footer.querySelector('.e-reply-wrapper');
            expect(updatedReplyWrapper).not.toBeNull();
            const updatedReplyText: HTMLElement = updatedReplyWrapper.querySelector('.e-reply-message-text');
            expect(updatedReplyText.textContent).toBe('Second message!');
        });

        it('should handle initial message with reply and click reply icon on another message followed by send icon', (done: DoneFn) => {
            const messages: MessageModel[] = [
                {
                    id: 'msg1',
                    text: 'Initial message with reply!',
                    author: { id: 'user1', user: 'John Doe' },
                    timeStamp: new Date(),
                    replyTo: {
                        messageID: 'msg0',
                        text: 'Old message!',
                        user: { id: 'user2', user: 'Alice' }
                    }
                },
                {
                    id: 'msg2',
                    text: 'Click reply on this message!',
                    author: { id: 'user2', user: 'Jane Doe' },
                    timeStamp: new Date(),
                }
            ];

            chatUI = new ChatUI({ messages: messages });
            chatUI.appendTo('#chatUI');

            // Check for the initial message with reply
            const initialMessageItem: HTMLElement = chatUIElem.querySelector('#msg1');
            const initialReplyWrapper: HTMLElement = initialMessageItem.querySelector('.e-reply-wrapper');
            expect(initialReplyWrapper).not.toBeNull();
            const initialReplyText: HTMLElement = initialReplyWrapper.querySelector('.e-reply-message-text');
            expect(initialReplyText.textContent).toBe('Old message!');

            // Simulate clicking the reply icon on the second message
            const secondMessageItem: HTMLElement = chatUIElem.querySelector('#msg2');
            const replyButton: HTMLElement = secondMessageItem.querySelector('.e-icons.e-chat-reply');
            expect(replyButton).not.toBeNull();

            replyButton.click();

            // Verify that the reply textarea is visible and contains correct message
            const footerReplyWrapper: HTMLElement = chatUIElem.querySelector('.e-footer .e-reply-wrapper');
            expect(footerReplyWrapper).not.toBeNull();
            const footerReplyText: HTMLElement = footerReplyWrapper.querySelector('.e-reply-message-text');
            expect(footerReplyText.textContent).toBe('Click reply on this message!');

            // Simulate typing a message and clicking send
            const footerTextArea: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            footerTextArea.innerText = 'New reply message!';
            const inputEvent: Event = new Event('input', { bubbles: true });
            footerTextArea.dispatchEvent(inputEvent);

            // Click the send icon
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-send');
            expect(sendIcon).not.toBeNull();

            // Add a delay to simulate send action
            setTimeout(() => {
                sendIcon.click();

                // Check for the newly sent message with reply
                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const newMessageItem: HTMLElement = messageItems[messageItems.length - 1];
                const newReplyWrapper: HTMLElement = newMessageItem.querySelector('.e-reply-wrapper');
                expect(newReplyWrapper).not.toBeNull();
                const newReplyText: HTMLElement = newReplyWrapper.querySelector('.e-reply-message-text');
                expect(newReplyText.textContent).toBe('Click reply on this message!');
                const newText: HTMLElement = newMessageItem.querySelector('.e-text');
                expect(newText.textContent).toBe('New reply message!');
                done();
            }, 50);
        });

        it('should handle unpin and view in chat options for pinned messages with multiple other messages', () => {
            const pinnedMessage: MessageModel = {
                id: 'msg1',
                text: 'This is a pinned message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: true
            };

            const message2: MessageModel = {
                id: 'msg2',
                text: 'First additional message!',
                author: { id: 'user2', user: 'Jane Doe' },
                timeStamp: new Date(),
            };

            const message3: MessageModel = {
                id: 'msg3',
                text: 'Second additional message!',
                author: { id: 'user3', user: 'Alice Johnson' },
                timeStamp: new Date(),
            };

            chatUI = new ChatUI({
                user: { id: 'user4', user: 'Bob Brown' },
                messages: [pinnedMessage, message2, message3]
            });
            chatUI.appendTo('#chatUI');

            // Check the pinned message is present in the wrapper
            const pinnedWrapper: HTMLElement = chatUIElem.querySelector('.e-pinned-message-wrapper');
            const dropDownButton: HTMLElement = pinnedWrapper.querySelector('.e-dropdown-btn');
            dropDownButton.click();
            const pinnedDropdown: HTMLElement = document.querySelector('.e-dropdown-popup.e-pinned-dropdown-popup');
            expect(pinnedDropdown).not.toBeNull();

            const viewInChatButton: HTMLElement = pinnedDropdown.querySelector('.e-item');
            expect(viewInChatButton).not.toBeNull();
            
            viewInChatButton.click();

            // Simulation of scrolling behavior or confirmation that message is viewed
            const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
            const scrolledToMessage: HTMLElement = Array.from(messageItems).find(item => item.textContent.includes('This is a pinned message!'));
            expect(scrolledToMessage).toBeTruthy();

            // Verify clicking the unpin message button updates display property
            dropDownButton.click();
            const unpinButton: HTMLElement = pinnedDropdown.querySelectorAll('.e-item')[1] as HTMLElement;
            expect(unpinButton).not.toBeNull();

            unpinButton.click();
            expect(pinnedWrapper.style.display).toBe('none'); // The wrapper is hidden but not removed
        });

        it('should handle pin and unpin in chat options for messages', () => {
           const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Pin this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: true
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const pinnedWrapper: HTMLElement = chatUIElem.querySelector('.e-pinned-message-wrapper');
            const dropDownButton: HTMLElement = pinnedWrapper.querySelector('.e-dropdown-btn');

            const pinnedDropdown: HTMLElement = document.querySelector('.e-dropdown-popup.e-pinned-dropdown-popup');
            expect(pinnedDropdown).not.toBeNull();

            dropDownButton.click();
            const unpinButton: HTMLElement = pinnedDropdown.querySelectorAll('.e-item')[1] as HTMLElement;
            expect(unpinButton).not.toBeNull();

            unpinButton.click();
            expect(pinnedWrapper.style.display).toBe('none');

            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper');
            const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin');
            expect(pinButton).not.toBeNull();

            pinButton.click();

            const pinnedMessage: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
            expect(pinnedMessage.querySelector('.e-pinned-message-text').textContent).toBe('Pin this message!');
        });

        it('should pin a message, then pin another message, then unpin that message', (done: DoneFn) => {
              const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Pin first message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: false
            };
            const secondMessage: MessageModel = {
                id: 'msg2',
                text: 'Pin second message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: false
            }
            chatUI = new ChatUI({
                messages: [initialMessage,secondMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;
            const pinButtons: NodeListOf<HTMLElement> = messageWrapper.querySelectorAll('.e-chat-pin') as NodeListOf<HTMLElement>;
            expect(pinButtons[0]).not.toBeNull();
            pinButtons[0].click();

            const pinnedMessage: HTMLElement = chatUIElem.querySelector('.e-pinned-message') as HTMLElement;
            expect(pinnedMessage.querySelector('.e-pinned-message-text').textContent).toBe('Pin first message!');
            expect(pinButtons[1]).not.toBeNull();
            pinButtons[1].click();
            
            setTimeout(() =>{
                const pinnedMessage2: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
                expect(pinnedMessage2.querySelector('.e-pinned-message-text').textContent).toBe('Pin second message!');
                done();
            }),100;

            const pinnedWrapper: HTMLElement = chatUIElem.querySelector('.e-pinned-message-wrapper');
            const dropDownButton: HTMLElement = pinnedWrapper.querySelector('.e-dropdown-btn');

            const pinnedDropdown: HTMLElement = document.querySelector('.e-dropdown-popup.e-pinned-dropdown-popup');
            expect(pinnedDropdown).not.toBeNull();

            dropDownButton.click();
            const unpinButton: HTMLElement = pinnedDropdown.querySelectorAll('.e-item')[1] as HTMLElement;
            expect(unpinButton).not.toBeNull();

            unpinButton.click();
            expect(pinnedWrapper.style.display).toBe('none');
        });

        it('should handle multiple message replies with correct footer update and message send', (done: DoneFn) => {

            chatUI = new ChatUI({ messages: chatMessages });
            chatUI.appendTo('#chatUI');

            // Ensure all 10 messages are rendered
            const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
            expect(messageItems.length).toBe(10);

            // Click the reply icon on first message
            const firstReplyButton: HTMLElement = messageItems[0].querySelector('.e-icons.e-chat-reply');
            expect(firstReplyButton).not.toBeNull();
            firstReplyButton.click();

            // Check footer's reply wrapper content
            let footerReplyWrapper: HTMLElement = chatUIElem.querySelector('.e-footer .e-reply-wrapper');
            expect(footerReplyWrapper).not.toBeNull();
            let footerReplyText: HTMLElement = footerReplyWrapper.querySelector('.e-reply-message-text');
            expect(footerReplyText.textContent).toBe('Hi!');

            // Click the reply icon on the last message
            const lastReplyButton: HTMLElement = messageItems[9].querySelector('.e-icons.e-chat-reply');
            expect(lastReplyButton).not.toBeNull();
            lastReplyButton.click();

            // Verify footer's reply wrapper content is updated
            footerReplyWrapper = chatUIElem.querySelector('.e-footer .e-reply-wrapper');
            expect(footerReplyWrapper).not.toBeNull();
            footerReplyText = footerReplyWrapper.querySelector('.e-reply-message-text');
            expect(footerReplyText.textContent).toBe('I have been traveling a bit.');

            // Simulate typing a new message and sending it
            const footerTextArea: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            footerTextArea.innerText = 'New message as a reply!';
            const inputEvent: Event = new Event('input', { bubbles: true });
            footerTextArea.dispatchEvent(inputEvent);

            // Click the send icon
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-send');
            expect(sendIcon).not.toBeNull();
            sendIcon.click();

            setTimeout(() => {
                const updatedMessageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const newMessageItem: HTMLElement = updatedMessageItems[updatedMessageItems.length - 1];
                const newReplyWrapper: HTMLElement = newMessageItem.querySelector('.e-reply-wrapper');
                expect(newReplyWrapper).not.toBeNull();
                const newReplyText: HTMLElement = newReplyWrapper.querySelector('.e-reply-message-text');
                expect(newReplyText.textContent).toBe('I have been traveling a bit.');
                const newText: HTMLElement = newMessageItem.querySelector('.e-text');
                expect(newText.textContent).toBe('New message as a reply!');
                done();
            }, 50);
        });

        it('should show toolbar on message hover and toolbar position wraps below if no space above the message', () => {
            let currentUserModel: UserModel = {
                id: "user1",
                user: "Albert"
            };
            let michaleUserModel: UserModel = {
                id: "user2",
                user: "Michale Suyama"
            };
            let chatMessages: MessageModel[] = [
                {
                    author: currentUserModel,
                    text: "Hi Michale, are we on track for the deadline?"
                },
                {
                    author: michaleUserModel,
                    text: "Yes, the design phase is complete."
                },
                {
                    author: currentUserModel,
                    text: "I’ll review it and send feedback by today!."
                }
            ];
            const chatUI = new ChatUI({
                messages: chatMessages,
                user: currentUserModel,
            });
            chatUI.appendTo('#chatUI');

            const messageItems = document.querySelectorAll('.e-message-item');
            expect(messageItems.length).toBe(3);

            const rightMessage: HTMLElement = messageItems[0] as HTMLElement;
            rightMessage.dispatchEvent(new Event('mouseover'));

            const rightToolbar: HTMLElement = rightMessage.querySelector('.e-chat-message-toolbar') as HTMLElement;
            expect(rightToolbar).not.toBeNull();
            rightMessage.dispatchEvent(new Event('mouseleave'));
        });

        it('should update toolbar items dynamically', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This is a message.',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                    }
                ],
                messageToolbarSettings: {
                    items: [
                        { type: 'Button', iconCss: 'e-icons e-chat-copy', tooltip: 'Copy' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            let toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar.querySelector('.e-chat-copy')).not.toBeNull();

            // Update toolbar items
            chatUI.messageToolbarSettings.items = [
                { type: 'Button', iconCss: 'e-icons e-chat-pin', tooltip: 'Pin' }
            ];
            chatUI.dataBind();

            toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar.querySelector('.e-chat-copy')).toBeNull();
            expect(toolbar.querySelector('.e-chat-pin')).not.toBeNull();
        });

        it('should update forwarded message locale dynamically', () => {
            L10n.load({
                'en': {
                    "chat-ui": {
                        "forwarded": "Forwarded"
                    }
                },
                'fr': {
                    "chat-ui": {
                        "forwarded": "Transféré"
                    }
                }
            });

            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This message is forwarded!',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                        isForwarded: true
                    }
                ],
                locale: 'en'
            });
            chatUI.appendTo('#chatUI');
            let forwardedIndicator = chatUIElem.querySelector('.e-forwarded-indicator');
            expect(forwardedIndicator.textContent).toContain('Forwarded');

            // Change locale to French
            chatUI.locale = 'fr';
            chatUI.dataBind();

            forwardedIndicator = chatUIElem.querySelector('.e-forwarded-indicator');
            expect(forwardedIndicator.textContent).toContain('Transféré');
        });

        it('should hide pinned message wrapper and show pin icon on message when unpin is selected', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This is a pinned message!',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                        isPinned: true
                    }
                ]
            });
            chatUI.appendTo('#chatUI');
            const pinnedWrapper: HTMLElement = chatUIElem.querySelector('.e-pinned-message-wrapper');
            expect(pinnedWrapper.style.display).not.toBe('none');

            // Simulate clicking the unpin icon from the message toolbar
            const unpinButton: HTMLElement = chatUIElem.querySelector('.e-chat-message-toolbar .e-icons.e-chat-unpin');
            expect(unpinButton).not.toBeNull();

            unpinButton.click();

            expect(pinnedWrapper.style.display).toBe('none');

            // Check the message for pin icon
            const messagePinButton: HTMLElement = chatUIElem.querySelector('.e-chat-message-toolbar .e-icons.e-chat-pin');
            expect(messagePinButton).not.toBeNull();
        });
    });

    describe('Message toolbar with message template', () => {
        const customToolbarItems: ToolbarItemModel[] = [
            { type: 'Button', iconCss: 'e-icons e-custom-action', tooltip: 'Custom Action' }
        ];

        beforeEach(() => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This is a message with a custom toolbar!',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date()
                    }
                ],
                messageTemplate: (data: any) => `
                            <div class="message-template">
                                <span>${data.message.text}</span>
                            </div>
                        `,
                messageToolbarSettings: {
                    items: customToolbarItems
                }
            });
            chatUI.appendTo('#chatUI');
        });

        it('should render custom toolbar item', () => {
            const toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar).not.toBeNull();
            const customIcon = toolbar.querySelector('.e-toolbar-item');
            expect(customIcon).not.toBeNull();
            expect(customIcon.getAttribute('title')).toBe('Custom Action');
        });

        it('should render with default toolbar when no custom items provided', () => {
            chatUI.messageToolbarSettings.items = [];
            chatUI.dataBind();

            const toolbarIcons = chatUIElem.querySelectorAll('.e-chat-message-toolbar .e-icons');
            const defaultClasses = ['e-chat-copy', 'e-chat-reply', 'e-chat-pin', 'e-chat-trash'];
            
            expect(toolbarIcons.length).toBeGreaterThan(0);
            defaultClasses.forEach((className) => {
                const icon = Array.from(toolbarIcons).find((icon) => icon.classList.contains(className));
                expect(icon).not.toBeNull();
            });
        });

        it('Message toolbar with tabindex', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This is a message.',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                    }
                ],
                messageToolbarSettings: {
                    items: [
                        { type: 'Button', iconCss: 'e-icons e-chat-copy', tabIndex: 1 }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            let toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar.querySelector('.e-chat-copy')).not.toBeNull();
            expect(toolbar.querySelector('.e-tbar-btn').getAttribute('tabindex')).toEqual('1');
        });

        it('Message toolbar with dynamic tabindex value update', () => {
            chatUI = new ChatUI({
                messages: [
                    {
                        id: 'msg1',
                        text: 'This is a message.',
                        author: { id: 'user1', user: 'John Doe' },
                        timeStamp: new Date(),
                    }
                ],
                messageToolbarSettings: {
                    items: [
                        { type: 'Button', iconCss: 'e-icons e-chat-copy' }
                    ]
                }
            });
            chatUI.appendTo('#chatUI');
            let toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar.querySelector('.e-chat-copy')).not.toBeNull();
            expect(toolbar.querySelector('.e-tbar-btn').getAttribute('tabindex')).toEqual('0');
            // Update toolbar items
            chatUI.messageToolbarSettings.items = [
                { type: 'Button', iconCss: 'e-icons e-chat-pin', tooltip: 'Pin', tabIndex: 1 }
            ];
            chatUI.dataBind();

            toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar.querySelector('.e-chat-copy')).toBeNull();
            expect(toolbar.querySelector('.e-tbar-btn').getAttribute('tabindex')).toEqual('1');
        });
    });
});
