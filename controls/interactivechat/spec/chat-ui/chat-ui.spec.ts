import { createElement, L10n } from "@syncfusion/ej2-base";
import { ChatUI, MentionSelectEventArgs, MessageModel, MessageSendEventArgs, MessageReplyModel, UserModel } from "../../src/chat-ui/index";
import { ToolbarItemClickedEventArgs, ToolbarItemModel } from '../../src/interactive-chat-base/index';
import { InterActiveChatBase } from '../../src/interactive-chat-base/index';
import { Uploader } from "@syncfusion/ej2-inputs";

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

        it('should dynamically add a new user properties', function () {
            chatUI = new ChatUI({
                user: {
                    id: 'u1',
                    user: 'Alice',
                    avatarUrl: 'alice.png',
                    avatarBgColor: '#fff',
                    cssClass: 'default'
                }
            });
            const newProp = {
                user: {
                    statusIconCss: 'offline'
                }
            };
            chatUI.appendTo('#chatUI');
            chatUI.onPropertyChanged(newProp, { user: chatUI.user });
            expect(chatUI.user).toEqual(jasmine.objectContaining({
                id: 'u1',
                user: 'Alice',
                avatarUrl: 'alice.png',
                avatarBgColor: '#fff',
                cssClass: 'default',
                statusIconCss: 'offline'
            }));
        });

        it('should dynamically change user properties into new user properties', function () {
            chatUI = new ChatUI({
                user: {
                    id: 'u1',
                    user: 'Alice',
                    avatarUrl: 'alice.png',
                    avatarBgColor: '#fff',
                    cssClass: 'default',
                    statusIconCss: 'online'
                }
            });
            const newProp = {
                user: {
                    id: 'u2',
                    avatarUrl: 'bob.png',
                    statusIconCss: 'offline'
                }
            };
            chatUI.appendTo('#chatUI');
            chatUI.onPropertyChanged(newProp, { user: chatUI.user });
            expect(chatUI.user).toEqual(jasmine.objectContaining({
                id: 'u2',
                user: 'Alice',
                avatarUrl: 'bob.png',
                avatarBgColor: '#fff',
                cssClass: 'default',
                statusIconCss: 'offline'
            }));
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

        it('Locale checking for pinned message', () => {
            L10n.load({
                'de': {
                    "chat-ui": {
                        "unpin": "lösen",
                        "viewChat": "Im Chat ansehen"
                    }
                }
            });
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
                messages: [pinnedMessage, message2, message3],
                locale: 'de',
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
            expect(viewInChatButton.textContent).toBe('Im Chat ansehen');
            viewInChatButton.click();

            // Simulation of scrolling behavior or confirmation that message is viewed
            const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
            const scrolledToMessage: HTMLElement = Array.from(messageItems).find(item => item.textContent.includes('This is a pinned message!'));
            expect(scrolledToMessage).toBeTruthy();

            // Verify clicking the unpin message button updates display property
            dropDownButton.click();
            const unpinButton: HTMLElement = pinnedDropdown.querySelectorAll('.e-item')[1] as HTMLElement;
            expect(unpinButton).not.toBeNull();
            expect(unpinButton.textContent).toBe('lösen');

            unpinButton.click();
            expect(pinnedWrapper.style.display).toBe('none'); // The wrapper is hidden but not removed
        });

        it('should render and dynamically update the locale for send icon', () => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "send": 'Nachricht senden'
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "send": 'Envoyer le message'
                    }
                }
            });
            chatUI = new ChatUI({
                locale: 'de-DE',
                user: { id: 'user1', user: 'Albert' }
            });
            chatUI.appendTo(chatUIElem);

            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
            expect(sendIcon).not.toBeNull();
            sendIcon.classList.remove('disabled');
            expect(sendIcon.getAttribute('title')).toBe('Nachricht senden');

            chatUI.locale = 'fr-BE';
            chatUI.dataBind();

            const updatedSendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
            expect(updatedSendIcon).not.toBeNull();
            updatedSendIcon.classList.remove('disabled');
            expect(updatedSendIcon.getAttribute('title')).toBe('Envoyer le message');
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

        // it('Header Toolbar dynamic update checking', () => {
        //     chatUI = new ChatUI({
        //         headerToolbar: {
        //             items: [
        //                 { iconCss: 'e-icons e-search', align: 'Right' }
        //             ]
        //         }
        //     });
        //     chatUI.appendTo('#chatUI');
        //     const toolbarElement: HTMLDivElement = chatUIElem.querySelector('.e-chat-toolbar.e-toolbar');
        //     let toolbarItems: NodeListOf<HTMLDivElement> = toolbarElement.querySelectorAll('.e-toolbar-item');
        //     expect(toolbarItems.length).toBe(1);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(true);
        //     chatUI.headerToolbar = {
        //         items: [{ iconCss: 'e-icons e-user', align: 'Right' }, { iconCss: 'e-icons e-folder', align: 'Right' }],
        //     };
        //     chatUI.dataBind();
        //     (toolbarElement as any).ej2_instances[0].dataBind();
        //     toolbarItems = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
        //     expect(toolbarItems.length).toBe(2);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(false);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-user')).toBe(true);
        //     expect(toolbarItems[1].querySelector('.e-icons').classList.contains('e-folder')).toBe(true);
        // });

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

        // it('Header Toolbar dynamic tabindex value checking', () => {
        //     chatUI = new ChatUI({
        //         headerToolbar: {
        //             items: [
        //                 { iconCss: 'e-icons e-search', align: 'Right' }
        //             ]
        //         }
        //     });
        //     chatUI.appendTo('#chatUI');
        //     const toolbarElement: HTMLDivElement = chatUIElem.querySelector('.e-chat-toolbar.e-toolbar');
        //     let toolbarItems: NodeListOf<HTMLDivElement> = toolbarElement.querySelectorAll('.e-toolbar-item');
        //     expect(toolbarItems.length).toBe(1);
        //     expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('0');
        //     chatUI.headerToolbar = {
        //         items: [{ iconCss: 'e-icons e-user', align: 'Right', tabIndex: 1 }, { iconCss: 'e-icons e-folder', align: 'Right', tabIndex: 2 }],
        //     };
        //     chatUI.dataBind();
        //     (toolbarElement as any).ej2_instances[0].dataBind();
        //     toolbarItems = chatUIElem.querySelectorAll('.e-chat-header .e-toolbar-item');
        //     expect(toolbarItems.length).toBe(2);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-search')).toBe(false);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-user')).toBe(true);
        //     expect(toolbarItems[1].querySelector('.e-icons').classList.contains('e-folder')).toBe(true);
        //     expect(toolbarItems[0].children[0].getAttribute('tabindex')).toEqual('1');
        //     expect(toolbarItems[1].children[0].getAttribute('tabindex')).toEqual('2');
        // });
    
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
        it('Sending a message with potential XSS content', (done: DoneFn) => {
            // Set up the chat template
            const sTag: HTMLElement = createElement('script', { id: 'emptyChatTemplate', attrs: { type: 'text/x-template' } });
            sTag.innerHTML = '<div><h1>Welcome to Chat</h1><p>Start your conversation</p></div>';
            document.body.appendChild(sTag);

            // Initialize ChatUI
            chatUI = new ChatUI({
                emptyChatTemplate: '#emptyChatTemplate',
                user: { id: 'user1', user: 'John Doe' }
            });
            chatUI.appendTo('#chatUI');

            // Verify initial UI elements
            const initialBannerView = chatUIElem.querySelector('.e-empty-chat-template');
            expect(initialBannerView).not.toBeNull();
            const footerElem: HTMLDivElement = chatUIElem.querySelector('.e-footer');
            const textareaElem: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send');
            expect(textareaElem).not.toBeNull();
            expect(sendIcon).not.toBeNull();
            expect(sendIcon.classList.contains('disabled')).toBe(true);

            // Mock window.alert to detect if it is called
            const originalAlert = window.alert;
            let alertCalled = false;
            window.alert = () => {
                alertCalled = true;
            };

            // Input the potentially malicious message
            const maliciousMessage = '<img src=x onerror=alert(1)>';
            textareaElem.innerText = maliciousMessage;
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);

            // Simulate sending the message
            setTimeout(() => {
                const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                footerElem.dispatchEvent(keyEvent);

                // Verify the send icon state
                expect(sendIcon.classList.contains('disabled')).toBe(true);

                // Verify the message is displayed
                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const lastMessage: HTMLElement = messageItems[messageItems.length - 1];
                expect(lastMessage).not.toBeNull();
                expect(lastMessage.querySelector('img')).toBeNull(); // Ensure no <img> tag is rendered

                // Verify the message group alignment
                const messageGroup: HTMLElement = lastMessage.closest('.e-message-group') as HTMLElement;
                expect(messageGroup.classList.contains('e-right')).toBe(true);

                // Verify the textarea is cleared
                expect(textareaElem.innerText).toBe('');

                // Verify that the alert was not triggered
                expect(alertCalled).toBe(false);

                // Restore the original alert function
                window.alert = originalAlert;

                done();
            }, 450);
        });
        
        it('Sending a message with iframe content', (done: DoneFn) => {
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
            const iframeMessage = '<iframe src=https://www.syncfusion.com></iframe>';
            textareaElem.innerText = iframeMessage;
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);
            setTimeout(() => {
                const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                footerElem.dispatchEvent(keyEvent);
                expect(sendIcon.classList.contains('disabled')).toBe(true);
                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const lastMessage: HTMLElement = messageItems[messageItems.length - 1];
                expect(lastMessage).not.toBeNull();
                expect(lastMessage.querySelector('iframe')).toBeNull(); 
                const messageGroup: HTMLElement = lastMessage.closest('.e-message-group') as HTMLElement;
                expect(messageGroup.classList.contains('e-right')).toBe(true);

                done();
            }, 450);
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

        // it('should render toolbar if it does not already exist', () => {
        //     chatUI = new ChatUI({});
        //     chatUI.appendTo('#chatUI');
        //     chatUI.headerToolbar = {
        //         items: [
        //             { iconCss: 'e-icons e-home', align: 'Right' }
        //         ]
        //     };
        //     chatUI.dataBind();
        //     const toolbarItems = chatUIElem.querySelectorAll('.e-chat-toolbar .e-toolbar-item');
        //     expect(toolbarItems.length).toBe(1);
        //     expect(toolbarItems[0].querySelector('.e-icons').classList.contains('e-home')).toBe(true);
        // });

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
            textareaElem.focus();
            var focusEvent = new FocusEvent('focus', { bubbles: true });
            textareaElem.dispatchEvent(focusEvent);
            setTimeout(() => {
                expect(document.activeElement).toBe(textareaElem);
                expect(footerElem.classList.contains('e-footer-focused')).toBe(true);
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

        it('addMessage method checking with MessageModel parameter without any property', () => {
            let currentUserModel: UserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel
            });
            chatUI.appendTo('#chatUI');
    
            const newMessage: MessageModel = {};
            chatUI.addMessage(newMessage);
            const expectedId = `${chatUI.element.id}-message-1`;
            const messageElem: HTMLElement = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            expect(messageElem.id).toBe(expectedId);
            expect(messageElem.querySelector('.e-text')).toBeNull();
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
                user: { id: 'user2', user: 'Jane Smith' },
                timestampFormat: 'dd/MM/yyyy'
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
                timeStampFormat: 'dd/MM/yyyy'
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

        it('should update messages properly after pinning the message', () => {
            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Pin first message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStamp: new Date(),
                isPinned: false
            };
            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo('#chatUI');

            const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;
            const pinButtons: NodeListOf<HTMLElement> = messageWrapper.querySelectorAll('.e-chat-pin') as NodeListOf<HTMLElement>;
            expect(pinButtons[0]).not.toBeNull();
            pinButtons[0].click();

            chatUI.addMessage('Hi Hello');

            const messageItems: NodeListOf<Element> = messageWrapper.querySelectorAll('.e-message-item');
            expect(messageItems.length).toBe(2);
            const lastMessage: Element = messageItems[messageItems.length - 1];
            expect(lastMessage).not.toBeNull();
            const lastMessageText: Element = lastMessage.querySelector('.e-text');
            expect(lastMessageText).not.toBeNull();
            expect(lastMessageText.textContent).toBe('Hi Hello');
        });

    });

    describe('Message toolbar with message template', () => {
        const customToolbarItems: ToolbarItemModel[] = [
            { type: 'Button', iconCss: 'e-icons e-custom-action', tooltip: 'Custom Action' }
        ];

        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
                chatUI=null;
            }
        });

        it('should render custom toolbar item', () => {
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
            const toolbar = chatUIElem.querySelector('.e-chat-message-toolbar');
            expect(toolbar).not.toBeNull();
            const customIcon = toolbar.querySelector('.e-toolbar-item');
            expect(customIcon).not.toBeNull();
            expect(customIcon.getAttribute('title')).toBe('Custom Action');
        });

        it('should not render with default toolbar when no custom items provided', () => {
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
                    items: []
                }
            });
            chatUI.appendTo('#chatUI');

            const toolbarIcons = chatUIElem.querySelectorAll('.e-chat-message-toolbar .e-icons');
            expect(toolbarIcons.length).toEqual(0);
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

    describe('Mention Support - ', () => {
        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
            }
        });

        it('should initialize mention component when mentionUsers are provided', () => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" },
                { id: "user3", user: "Alice Johnson" }
            ];

            chatUI = new ChatUI({
                mentionUsers: mentionUsers
            });
            chatUI.appendTo(chatUIElem);

            // Verify mention object is created
            expect((chatUI as any).mentionObj).not.toBeUndefined();
        });

        it('should update mention trigger character when mentionTriggerChar property changes', () => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];

            chatUI = new ChatUI({
                mentionUsers: mentionUsers,
                mentionTriggerChar: '@'
            });
            chatUI.appendTo(chatUIElem);
            (chatUI as any).mentionObj.mentionChar = '@';
            chatUI.mentionTriggerChar = '#';
            chatUI.dataBind();
            (chatUI as any).mentionObj.mentionChar = '#';
        });

        it('should trigger mentionSelected event when a mention is selected', (done: DoneFn) => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];

            let eventTriggered = false;
            let selectedUser: string;

            chatUI = new ChatUI({
                mentionUsers: mentionUsers,
                mentionSelect: (args: MentionSelectEventArgs) => {
                    eventTriggered = true;
                    selectedUser = (args.itemData as any).text;
                }
            });
            chatUI.appendTo(chatUIElem);

            // Manually trigger the onMentionSelect method
            const selectEventArgs = {
                itemData: { text: 'John Doe', id: 'user1' },
                isInteracted: true,
                e: new MouseEvent('click')
            };

            (chatUI as any).onMentionSelect(selectEventArgs);

            setTimeout(() => {
                expect(eventTriggered).toBe(true);
                expect(selectedUser).toBe('John Doe');
                done();
            }, 10);
        });

        it('should handle undo and redo actions with mentioned users', (done: DoneFn) => {
            chatUI = new ChatUI({
                mentionUsers: [
                    { id: "user1", user: "John Doe" }
                ]
            });
            chatUI.appendTo('#chatUI');

            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaEle).not.toBeNull();

            // State 1: Initial content
            textareaEle.innerText = 'Hello ';
            const inputEvent1 = new Event('input', { bubbles: true });
            textareaEle.dispatchEvent(inputEvent1);

            setTimeout(() => {
                // State 2: Add a mention
                const mentionChip = '<span contenteditable="false" class="e-mention-chip"><span class="e-chat-mention-user-chip" data-user-id="user1">John Doe</span></span>';
                textareaEle.innerHTML += mentionChip;
                const inputEvent2 = new Event('input', { bubbles: true });
                textareaEle.dispatchEvent(inputEvent2);
                const stateWithMention = textareaEle.innerHTML;

                setTimeout(() => {
                    // State 3: Add more text after the mention
                    textareaEle.innerHTML += ' how are you?';
                    const inputEvent3 = new Event('input', { bubbles: true });
                    textareaEle.dispatchEvent(inputEvent3);
                    const finalState = textareaEle.innerHTML;

                    setTimeout(() => {
                        // Perform Undo: should revert to State 2
                        const undoEvent = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true });
                        (chatUI as any).footer.dispatchEvent(undoEvent);

                        setTimeout(() => {
                            expect(textareaEle.innerHTML).toBe(stateWithMention);

                            // Perform Redo: should revert to State 3
                            const redoEvent = new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true });
                            (chatUI as any).footer.dispatchEvent(redoEvent);
                            
                            setTimeout(() => {
                                expect(textareaEle.innerHTML).toBe(finalState);
                                done();
                            }, 50);
                        }, 50);
                    }, 450);
                }, 450);
            }, 450);
        });

        it('should render mention component with correct CSS classes', () => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];

            chatUI = new ChatUI({
                mentionUsers: mentionUsers,
                enableRtl: true
            });
            chatUI.appendTo(chatUIElem);

            // Verify the mention object was created with the correct CSS classes
            expect((chatUI as any).mentionObj.cssClass).toContain('e-chat-mention');
            expect((chatUI as any).mentionObj.cssClass).toContain('e-rtl');
        });

        it('should use correct display template for mention chips', () => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith", avatarUrl: "https://example.com/avatar.jpg" }
            ];

            chatUI = new ChatUI({
                mentionUsers: mentionUsers
            });
            chatUI.appendTo(chatUIElem);

            // Verify the display template pattern in the mention object
            const displayTemplate = (chatUI as any).mentionObj.displayTemplate;
            expect(displayTemplate).toContain('e-chat-mention-user-chip');
            expect(displayTemplate).toContain('data-user-id="${id}"');
        });
    });

    describe('ChatUI Mention User Tests', () => {

        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
            }
        });
        
        it('should render message with mentioned users in initial render', () => {
            // Create test users
            const mentionedUsers: UserModel[] = [
                { id: '1', user: 'John Doe', avatarUrl: 'user1.jpg' },
                { id: '2', user: 'Jane Smith', avatarUrl: 'user2.jpg' }
            ];
            
            // Create a message with placeholders for mentioned users
            const messageModel: MessageModel = {
                id: 'msg1',
                text: 'Hello {0}, how are you? And hello {1} too!',
                timeStamp: new Date(),
                author: {
                    id: 'user1',
                    user: 'John Doe'
                },
                mentionUsers: mentionedUsers
            };
            chatUI = new ChatUI({
                messages: [messageModel]
            });
            chatUI.appendTo(chatUIElem);

            // Check if the message is rendered with mention chips
            const messageElements = chatUIElem.querySelectorAll('.e-text');
            expect(messageElements.length).toBeGreaterThan(0);

            // Verify mention chips are rendered
            const mentionChips = chatUIElem.querySelectorAll('.e-chat-mention-user-chip');
            expect(mentionChips.length).toBe(2);

            // Verify the first mention chip contains the correct user name
            expect(mentionChips[0].textContent).toContain('John Doe');

            // Verify the second mention chip contains the correct user name
            expect(mentionChips[1].textContent).toContain('Jane Smith');
        });

        it('should update DOM when message with mentions is updated', () => {
            // Initial setup
            const initialMentionedUsers: UserModel[] = [
                { id: '1', user: 'John Doe', avatarUrl: 'user1.jpg' }
            ];

            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Hello {0}!',
                timeStamp: new Date(),
                author: {
                    id: 'user1',
                    user: 'John Doe'
                },
                mentionUsers: initialMentionedUsers
            };

            chatUI = new ChatUI({
                messages: [initialMessage]
            });
            chatUI.appendTo(chatUIElem);

            // Verify initial render
            let mentionChips = chatUIElem.querySelectorAll('.e-chat-mention-user-chip');
            expect(mentionChips.length).toBe(1);
            expect(mentionChips[0].textContent).toContain('John Doe');

            // Update message with additional mentioned user
            const updatedMentionedUsers: UserModel[] = [
                { id: '1', user: 'John Doe', avatarUrl: 'user1.jpg' },
                { id: '2', user: 'Jane Smith', avatarUrl: 'user2.jpg' }
            ];

            const updatedMessage: MessageModel = {
                id: 'msg1',
                text: 'Hello {0} and {1}!',
                timeStamp: new Date(),
                author: {
                    id: 'user1',
                    user: 'John Doe'
                },
                mentionUsers: updatedMentionedUsers
            };
            chatUI.updateMessage(updatedMessage, 'msg1');

            // Verify DOM is updated with new mention chip
            mentionChips = chatUIElem.querySelectorAll('.e-chat-mention-user-chip');
            expect(mentionChips.length).toBe(2);
            expect(mentionChips[0].textContent).toContain('John Doe');
            expect(mentionChips[1].textContent).toContain('Jane Smith');
        });

        it('should handle invalid placeholder indices gracefully', () => {
            // Create test users
            const mentionedUsers: UserModel[] = [
                { id: '1', user: 'John Doe', avatarUrl: 'user1.jpg' }
            ];

            // Create a message with valid and invalid placeholders
            const messageModel: MessageModel = {
                id: 'msg1',
                text: 'Hello {0}, and also {1} and {-5}!',
                timeStamp: new Date(),
                author: {
                    id: 'user1',
                    user: 'John Doe'
                },
                mentionUsers: mentionedUsers
            };

            chatUI = new ChatUI({
                messages: [messageModel]
            });
            chatUI.appendTo(chatUIElem);
            // Check if only valid placeholders are replaced
            const messageElements = chatUIElem.querySelectorAll('.e-text');
            expect(messageElements.length).toBeGreaterThan(0);

            // Verify only one mention chip is rendered (for valid index)
            const mentionChips = chatUIElem.querySelectorAll('.e-chat-mention-user-chip');
            expect(mentionChips.length).toBe(1);

            // Verify the message still contains the invalid placeholders
            const messageText = messageElements[0].innerHTML;
            expect(messageText).toContain('{1}');
            expect(messageText).toContain('{-5}');
        });

        it('it should not render mention instance when no mentioned users property is assigned', () => {
            chatUI = new ChatUI({
                mentionUsers: []
            });
            chatUI.appendTo(chatUIElem);
            let footerElem: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(footerElem.classList.contains('e-mention')).toBe(false);
            expect((chatUI as any).mentionObj).toBeUndefined();
        });
    });

    describe('Mention Support - ', () => {
        let mentionKeyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', code: 'ArrowDown', keyCode: 40, key: 'ArrowDown' };
        let mentionchatUI: ChatUI;
        const mentionchatUIElem: HTMLElement = createElement('div', { id: 'mentionchatUI' });
        document.body.appendChild(mentionchatUIElem);

        afterEach(() => {
            if (mentionchatUI) {
                mentionchatUI.destroy();
            }
        });

        it('should update mention data source when mentionUsers property changes', (done: DoneFn) => {
            const initialMentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];
            const updatedMentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" },
                { id: "user3", user: "Alice Johnson" }
            ];
            mentionchatUI = new ChatUI({
                mentionUsers: initialMentionUsers
            });
            mentionchatUI.appendTo(mentionchatUIElem);
            (mentionchatUI as any).mentionObj.showPopup();
            // Wait for mention popup to appear
            setTimeout(() => {
                const initialMentionPopup = document.querySelector('.e-chat-mention.e-popup');
                expect(initialMentionPopup).not.toBeNull();
                // Check initial count of li elements
                const initialListItems = initialMentionPopup.querySelectorAll('li');
                expect(initialListItems.length).toBe(2);
                (mentionchatUI as any).mentionObj.hidePopup();
                // Update mention users
                mentionchatUI.mentionUsers = updatedMentionUsers;
                mentionchatUI.dataBind();
                setTimeout(() => {
                    (mentionchatUI as any).mentionObj.showPopup();
                    const updatedMentionPopup = document.querySelector('.e-chat-mention.e-popup');
                    const updatedListItems = updatedMentionPopup.querySelectorAll('li');
                    // Verify that the list now has 3 items
                    expect(updatedListItems.length).toBe(3);
                    // Verify the new user appears in the list
                    const userNames = Array.from(updatedListItems).map(li => 
                        li.querySelector('.e-chat-mention-user-name').textContent.trim());
                    expect(userNames).toContain('Alice Johnson');
                    done();
                }, 500);
            }, 600);
        });

        it('should include mentionedUsers in sent message', (done: DoneFn) => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];

            let capturedMessage: MessageModel;

            mentionchatUI = new ChatUI({
                mentionUsers: mentionUsers,
                user: { id: 'currentUser', user: 'Current User' },
                messageSend: (args: MessageSendEventArgs) => {
                    capturedMessage = args.message;
                }
            });
            mentionchatUI.appendTo(mentionchatUIElem);

            // Manually prepare for sending a message with mentions
            const textareaElem: HTMLDivElement = mentionchatUIElem.querySelector('.e-footer .e-chat-textarea');

            // Create a mention chip
            const mentionChip = document.createElement('span');
            mentionChip.className = 'e-mention-chip';
            const mentionUser = document.createElement('span');
            mentionUser.className = 'e-chat-mention-user-chip';
            mentionUser.setAttribute('data-user-id', 'user1');
            mentionUser.textContent = 'John Doe';
            mentionChip.appendChild(mentionUser);
            textareaElem.appendChild(mentionChip);

            const sendButton: HTMLElement = mentionchatUIElem.querySelector('.e-footer .e-chat-send');
            setTimeout(() => {
                sendButton.classList.remove('disabled');
                sendButton.click();

                setTimeout(() => {
                    expect(capturedMessage).toBeDefined();
                    expect(capturedMessage.mentionUsers.length).toBe(1);
                    expect(capturedMessage.mentionUsers[0].id).toBe('user1');
                    expect(capturedMessage.mentionUsers[0].user).toBe('John Doe');
                    done();
                }, 500);
            }, 600);
        });

        it('should extract mentioned users from textarea content when sending a message', (done: DoneFn) => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];

            mentionchatUI = new ChatUI({
                mentionUsers: mentionUsers,
                user: { id: 'currentUser', user: 'Current User' }
            });
            mentionchatUI.appendTo(mentionchatUIElem);

            // Mock the getUserMentionFromContent method to verify it's called during send
            const syncMentionsSpy = spyOn<any>(mentionchatUI, 'getUserMentionFromContent').and.callThrough();

            // Prepare to send a message
            const textareaElem: HTMLDivElement = mentionchatUIElem.querySelector('.e-footer .e-chat-textarea');
            textareaElem.innerText = 'Message with mention';

            const inputEvent = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);

            setTimeout(() => {
                const sendButton: HTMLElement = mentionchatUIElem.querySelector('.e-footer .e-chat-send');
                sendButton.click();

                expect(syncMentionsSpy).toHaveBeenCalled();
                done();
            }, 100);
        });

        it('it should render mention instance when mentioned users property is assigned dynamically', (done: DoneFn) => {
            mentionchatUI = new ChatUI({
                mentionUsers: []
            });
            mentionchatUI.appendTo(mentionchatUIElem);
            let footerElem: HTMLElement = mentionchatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(footerElem.classList.contains('e-mention')).toBe(false);
            expect((mentionchatUI as any).mentionObj).toBeUndefined();
            mentionchatUI.mentionUsers = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];
            mentionchatUI.dataBind();
            setTimeout(() => {
                expect(footerElem.classList.contains('e-mention')).toBe(true);
                expect((mentionchatUI as any).mentionObj).not.toBeNull();
                (mentionchatUI as any).mentionObj.showPopup();
                const updatedMentionPopup = document.querySelector('.e-chat-mention.e-popup');
                const updatedListItems = updatedMentionPopup.querySelectorAll('li');
                expect(updatedListItems.length).toBe(2);
                const userNames = Array.from(updatedListItems).map(li => 
                    li.querySelector('.e-chat-mention-user-name').textContent.trim());
                expect(userNames).toContain('John Doe');
                expect(userNames).toContain('Jane Smith');
                done();
            }, 100);
        });

        it('should handle mention selection, dynamic user update, and message sending correctly', (done: DoneFn) => {
            const initialMentionUsers: UserModel[] = [
                { id: "user1", user: "John Doe" },
                { id: "user2", user: "Jane Smith" }
            ];
            const updatedMentionUsers: UserModel[] = [
                { id: "user2", user: "Jane Smith" },
                { id: "user3", user: "Alice" }
            ];

            let capturedMessage: MessageModel;

            mentionchatUI = new ChatUI({
                mentionUsers: initialMentionUsers,
                user: { id: 'currentUser', user: 'Current User' },
                messageSend: (args: MessageSendEventArgs) => {
                    capturedMessage = args.message;
                }
            });
            mentionchatUI.appendTo(mentionchatUIElem);

            const textareaElem: HTMLDivElement = mentionchatUIElem.querySelector('.e-footer .e-chat-textarea');

            // 1. Trigger the mention popup and select the first user
            (mentionchatUI as any).mentionObj.showPopup();
            setTimeout(() => {
                const mentionPopup = document.querySelector('.e-chat-mention.e-popup');
                const listItems = mentionPopup.querySelectorAll('li');
                var keyEvent1 = new MouseEvent('mousedown', {
                    bubbles: true
                });
                (listItems[0] as HTMLElement).dispatchEvent(keyEvent1); // Selects "John Doe"

                // 2. Update the list of mentionable users
                mentionchatUI.mentionUsers = updatedMentionUsers;
                mentionchatUI.dataBind();
                setTimeout(() => {
                    (mentionchatUI as any).mentionObj.showPopup();
                    const updatedMentionPopup = document.querySelector('.e-chat-mention.e-popup');
                    const updatedListItems = updatedMentionPopup.querySelectorAll('li');
                    // In the updated list, "Alice" will be at index 1
                    (updatedListItems[1] as HTMLElement).dispatchEvent(keyEvent1);

                    // 3. Send the message
                    const inputEvent: Event = new Event('input', { bubbles: true });
                    textareaElem.dispatchEvent(inputEvent);

                    setTimeout(() => {
                        const sendButton: HTMLElement = mentionchatUIElem.querySelector('.e-chat-send');
                        sendButton.click();

                        setTimeout(() => {
                            // 4. Assertions
                            expect(capturedMessage).toBeDefined();
                            // Check that the text has been converted to placeholders
                            // Check that the correct users are in the mention list
                            expect(capturedMessage.mentionUsers.length).toBe(2);
                            expect(capturedMessage.mentionUsers[0].id).toBe('user1');
                            expect(capturedMessage.mentionUsers[0].user).toBe('John Doe');
                            expect(capturedMessage.mentionUsers[1].id).toBe('user3');
                            expect(capturedMessage.mentionUsers[1].user).toBe('Alice');
                            done();
                        }, 100);
                    }, 200);
                }, 300);
            }, 400);
        });

        it('keyboard interaction in mention items', (done) => {
            const mentionUsers = [
                { id: "user1", user: "John" },
                { id: "user2", user: "Smith" },
                { id: "user3", user: "Albert" },
            ];

            mentionchatUI = new ChatUI({
                mentionUsers: mentionUsers
            });
            mentionchatUI.appendTo(mentionchatUIElem);
            const mentionObj: any = (mentionchatUI as any).mentionObj;
            mentionObj.showPopup();
            setTimeout(() => {
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user1").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user2").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "Smith").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user3").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "Albert").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user1").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user2").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "Smith").toBe(true);
                done();
            }, 500);
        });

        it('keyboard interaction in mention items with same values', (done) => {
            const mentionUsers = [
                { id: "user1", user: "John" },
                { id: "user2", user: "John" },
                { id: "user3", user: "John" },
            ];

            mentionchatUI = new ChatUI({
                mentionUsers: mentionUsers
            });
            mentionchatUI.appendTo(mentionchatUIElem);
            const mentionObj: any = (mentionchatUI as any).mentionObj;
            mentionObj.showPopup();
            setTimeout(() => {
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user1").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user2").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user3").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user1").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                mentionObj.onKeyUp(mentionKeyEventArgs);
                mentionObj.keyActionHandler(mentionKeyEventArgs);
                expect(mentionObj.list.querySelector('.e-active').getAttribute('data-value') === "user2").toBe(true);
                expect(mentionObj.list.querySelector('.e-active').querySelector('.e-chat-mention-user-name').textContent === "John").toBe(true);
                done();
            }, 500);
        });
    });

    describe('HTML Content and Mention Processing Tests', () => {
        let chatUIInstance: ChatUI;
        const chatUIMentionElem: HTMLElement = createElement('div', { id: 'htmlMentionChatUI' });
        
        beforeEach(() => {
            document.body.appendChild(chatUIMentionElem);
        });

        afterEach(() => {
            if (chatUIInstance) {
                chatUIInstance.destroy();
            }
            if (chatUIMentionElem.parentElement) {
                document.body.removeChild(chatUIMentionElem);
            }
        });

        it('should correctly render plain text and mention chips when sending a message', (done: DoneFn) => {
            chatUIInstance = new ChatUI({
                user: { id: 'current-user', user: 'Current User' },
                mentionUsers: [
                    { id: 'user1', user: 'Andrew' },
                    { id: 'user2', user: 'Jane' }
                ]
            });
            chatUIInstance.appendTo('#htmlMentionChatUI');

            // Get the textarea element
            const textareaElem: HTMLDivElement = chatUIMentionElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaElem).not.toBeNull();
            // Set HTML content with both formatting and mention chips
            // Set innerHTML to insert actual chip elements (simulating user input with mentions)
            textareaElem.innerHTML = '<h1>Important</h1> message for ' + 
                '<span contenteditable="false" class="e-mention-chip"><span class="e-chat-mention-user-chip" data-user-id="user1">Andrew</span></span>' +
                ' and <b>please</b> also inform ' +
                '<span contenteditable="false" class="e-mention-chip"><span class="e-chat-mention-user-chip" data-user-id="user2">Jane</span></span>';
            // Trigger input event to enable the send button
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);

            // Wait for input event to be processed
            setTimeout(() => {
                // Get the send button and click it
                const sendButton: HTMLElement = chatUIMentionElem.querySelector('.e-chat-send');
                expect(sendButton).not.toBeNull();
                expect(sendButton.classList.contains('disabled')).toBe(false);

                sendButton.click();

                // Wait for the message to be processed and rendered
                setTimeout(() => {
                    // Find the rendered message
                    const messageItem: HTMLElement = chatUIMentionElem.querySelector('.e-message-item');
                    expect(messageItem).not.toBeNull();

                    const messageText: HTMLElement = messageItem.querySelector('.e-text');
                    expect(messageText).not.toBeNull();
                    // Check for HTML rendering
                    // Since HTML is now flattened to plain text, <h1> and <b> should not exist as elements
                    const h1Element = messageText.querySelector('h1');
                    expect(h1Element).not.toBeNull();
                    const boldElement = messageText.querySelector('b');
                    expect(boldElement).not.toBeNull();
                    // Check for mention chips rendering
                    // Check for mention chips rendering (chips are rendered as elements)
                    const mentionChips = messageText.querySelectorAll('.e-chat-mention-user-chip');
                    expect(mentionChips.length).toBe(2);
                    expect(mentionChips[0].textContent).toBe('Andrew');
                    expect(mentionChips[1].textContent).toBe('Jane');
                    // Verify the overall structure of the message
                    // Verify plain text content (HTML tags flattened by innerText during send)
                    const messageTextContent = messageText.textContent || '';
                    expect(messageTextContent).toContain('Important message for');
                    expect(messageTextContent).toContain('and please also inform');
                    expect(messageTextContent).toContain('Andrew');
                    expect(messageTextContent).toContain('Jane');
                    // Verify innerHTML has mention chips but no raw HTML (flattened)
                    const messageHTML = messageText.innerHTML;
                    expect(messageHTML).toContain('<h1>Important</h1>');
                    expect(messageHTML).toContain('<b>please</b>');
                    expect(messageHTML).toContain('data-user-id="user1"');
                    expect(messageHTML).toContain('data-user-id="user2"');
                    // No HTML encoding or tags in innerHTML due to flattening
                    expect(messageHTML).not.toContain('&lt;'); // No encoding since flattened to text
                    done();
                }, 300);
            }, 300);
        });
        it('should correctly render Xss text and mention chips when sending a message', (done: DoneFn) => {
            chatUIInstance = new ChatUI({
                user: { id: 'current-user', user: 'Current User' },
                mentionUsers: [
                    { id: 'user1', user: 'Andrew' },
                    { id: 'user2', user: 'Jane' }
                ]
            });
            chatUIInstance.appendTo('#htmlMentionChatUI');

            // Get the textarea element
            const textareaElem: HTMLDivElement = chatUIMentionElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaElem).not.toBeNull();
            // Set HTML content with both formatting and mention chips
            // Set innerHTML to insert actual chip elements (simulating user input with mentions)
            textareaElem.innerHTML = '<img src onerror=alert(1)> ' + 
                '<span contenteditable="false" class="e-mention-chip"><span class="e-chat-mention-user-chip" data-user-id="user1">Andrew</span></span>' +
                ' and <b>please</b> also inform ' +
                '<span contenteditable="false" class="e-mention-chip"><span class="e-chat-mention-user-chip" data-user-id="user2">Jane</span></span>';
            // Trigger input event to enable the send button
            const inputEvent: Event = new Event('input', { bubbles: true });
            textareaElem.dispatchEvent(inputEvent);

            // Wait for input event to be processed
            setTimeout(() => {
                // Get the send button and click it
                const sendButton: HTMLElement = chatUIMentionElem.querySelector('.e-chat-send');
                expect(sendButton).not.toBeNull();
                expect(sendButton.classList.contains('disabled')).toBe(false);

                sendButton.click();

                // Wait for the message to be processed and rendered
                setTimeout(() => {
                    // Find the rendered message
                    const messageItem: HTMLElement = chatUIMentionElem.querySelector('.e-message-item');
                    expect(messageItem).not.toBeNull();

                    const messageText: HTMLElement = messageItem.querySelector('.e-text');
                    expect(messageText).not.toBeNull();
                    // Check for HTML rendering
                    // Since HTML is now flattened to plain text, <h1> and <b> should not exist as elements
                    const h1Element = messageText.querySelector('h1');
                    expect(h1Element).toBeNull();
                    // Check for mention chips rendering
                    // Check for mention chips rendering (chips are rendered as elements)
                    const mentionChips = messageText.querySelectorAll('.e-chat-mention-user-chip');
                    expect(mentionChips.length).toBe(2);
                    expect(mentionChips[0].textContent).toBe('Andrew');
                    expect(mentionChips[1].textContent).toBe('Jane');
                    // Verify the overall structure of the message
                    // Verify plain text content (HTML tags flattened by innerText during send)
                    const messageTextContent = messageText.textContent || '';
                    expect(messageTextContent).toContain(' Andrew and please also inform Jane');
                    expect(messageTextContent).toContain('and please also inform');
                    expect(messageTextContent).toContain('Andrew');
                    expect(messageTextContent).toContain('Jane');
                    // Verify innerHTML has mention chips but no raw HTML (flattened)
                    const messageHTML = messageText.innerHTML;
                    expect(messageHTML).toContain('<b>please</b>');
                    expect(messageHTML).toContain('data-user-id="user1"');
                    expect(messageHTML).toContain('data-user-id="user2"');
                    // No HTML encoding or tags in innerHTML due to flattening
                    expect(messageHTML).not.toContain('&lt;'); // No encoding since flattened to text
                    done();
                }, 300);
            }, 300);
        });
    });

    describe('Actions on Messages with Mentions', () => {
        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
                chatUI = null;
            }
        });

        const mentionedMessage: MessageModel = {
            id: 'mention-msg1',
            text: 'Hello {0}, this is an important message.',
            author: { id: 'user1', user: 'Current User' },
            timeStamp: new Date(),
            isPinned: true,
            mentionUsers: [
                { id: 'user2', user: 'Jane Smith' }
            ]
        };

        it('should correctly pin a message containing mentioned users', () => {
            chatUI = new ChatUI({
                messages: [mentionedMessage]
            });
            chatUI.appendTo('#chatUI');

            const pinnedMessageElem: HTMLElement = chatUIElem.querySelector('.e-pinned-message');
            expect(pinnedMessageElem).not.toBeNull();
            const pinnedTextElem: HTMLElement = pinnedMessageElem.querySelector('.e-pinned-message-text');

            const mentionChip = pinnedTextElem.querySelector('.e-chat-mention-user-chip');
            expect(mentionChip).not.toBeNull();
            expect(mentionChip.textContent).toContain('Jane Smith');
            expect(pinnedTextElem.textContent).toBe('Hello Jane Smith, this is an important message.');
        });

        it('should correctly create a reply to a message containing mentioned users', () => {
            chatUI = new ChatUI({
                messages: [mentionedMessage],
                user: { id: 'user1', user: 'Current User' }
            });
            chatUI.appendTo('#chatUI');

            const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
            expect(replyButton).not.toBeNull();

            replyButton.click();

            const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-footer .e-reply-wrapper');
            expect(replyWrapper).not.toBeNull();
            const replyTextElem: HTMLElement = replyWrapper.querySelector('.e-reply-message-text');
            const mentionChip = replyTextElem.querySelector('.e-chat-mention-user-chip');

            expect(mentionChip).not.toBeNull();
            expect(mentionChip.textContent).toContain('Jane Smith');
            expect(replyTextElem.textContent).toBe('Hello Jane Smith, this is an important message.');
        });

        it('should correctly copy the text of a message containing mentioned users', (done: DoneFn) => {
            chatUI = new ChatUI({
                messages: [mentionedMessage]
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
                        expect(copiedText).toBe('Hello Jane Smith, this is an important message.');
                        done();
                    };
                    reader.readAsText(blob);
                });

                return Promise.resolve();
            });
            copyButton.click();
        });
    });

    describe('Attachment Support', () => {
        let chatUIElem: HTMLElement;

        beforeEach(() => {
            chatUIElem = document.createElement('div');
            chatUIElem.id = 'chatUI';
            document.body.appendChild(chatUIElem);
        });

        afterEach(() => {
            if (chatUI) {
                chatUI.destroy();
                chatUI = null;
            }
            if (chatUIElem && chatUIElem.parentElement) {
                chatUIElem.parentElement.removeChild(chatUIElem);
            }
        });

        it('should render attachment icon if enableAttachments property set to true', () => {
           chatUI = new ChatUI({
                enableAttachments: true
            });
            chatUI.appendTo(chatUIElem);
            const attachmentIcon: HTMLElement = chatUIElem.querySelector('.e-chat-attachment-icon');
            expect(attachmentIcon).not.toBeNull();
            attachmentIcon.click(); 
        });

        it('should initialize with default attachment settings', () => {
            chatUI = new ChatUI({
                enableAttachments: true
            });
            chatUI.appendTo('#chatUI');

            expect(chatUI.attachmentSettings.saveUrl).toBe('');
            expect(chatUI.attachmentSettings.removeUrl).toBe('');
            expect(chatUI.attachmentSettings.maxFileSize).toBe(30000000); // Default 30 MB
        });

        it('should upload a file successfully', () => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-away'
            };
            let isBeforeEventCalled: boolean = false;
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                },
                beforeAttachmentUpload: () => {
                    isBeforeEventCalled = true
                },
                attachmentUploadSuccess: () => {
                    const uploadedFiles = (chatUI as any).uploadedFiles;
                    expect(uploadedFiles.length).toBe(1);
                    expect(uploadedFiles[0].name).toBe('last.txt');
                }
            });

            chatUI.appendTo(chatUIElem);
            const uploadObj: any = (chatUI as any).uploaderObj as Uploader;

            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
        });

        it('should upload an image and check whether it is rendered', (done) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                setTimeout(() => {
                    const messages: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messages.length).toBeGreaterThan(0);
                    const lastMsg: HTMLElement = messages[messages.length - 1];
                    const img: HTMLImageElement = lastMsg.querySelector('img');
                    expect(img).not.toBeNull();
                    expect(img.src).toContain('blob:');
                    done();
                }, 500);
            }, 500);
        });

        it('should upload a video and check whether it is rendered', (done) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-offline'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const file: File = new File(['sample video data'], 'sample.mp4', { type: 'video/mp4' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messages: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messages.length).toBeGreaterThan(0);

                    const lastMsg: HTMLElement = messages[messages.length - 1];
                    const video: HTMLVideoElement = lastMsg.querySelector('video');
                    expect(video).not.toBeNull();
                    expect(video.querySelector('source').src).toContain('blob:');

                    const overlay: HTMLElement = lastMsg.querySelector('.e-chat-video-play');
                    expect(overlay).not.toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should initialize with default attachment settings and handle dynamic property changes', () => {
            chatUI = new ChatUI({
                enableAttachments: true
            });
            chatUI.appendTo(chatUIElem);

            // Check initial values
            expect(chatUI.attachmentSettings.saveUrl).toBe('');
            expect(chatUI.attachmentSettings.removeUrl).toBe('');
            expect(chatUI.attachmentSettings.maxFileSize).toBe(30000000); // Default max file size
            expect(chatUI.attachmentSettings.enableDragAndDrop).toBe(true);
            expect(chatUI.attachmentSettings.maximumCount).toBe(10);
            expect(chatUI.attachmentSettings.allowedFileTypes).toBe('');
            expect(chatUI.attachmentSettings.saveFormat).toBe('Blob');
            expect(chatUI.attachmentSettings.path).toBe('');
            expect(chatUI.attachmentSettings.previewTemplate).toBe('');
            expect(chatUI.attachmentSettings.attachmentTemplate).toBe('');

            // Change properties dynamically
            chatUI.attachmentSettings = {
                saveUrl: '/new/save/url',
                removeUrl: '/new/remove/url',
                maxFileSize: 5000000,
                enableDragAndDrop: false,
                maximumCount: 1,
                allowedFileTypes: '.png',
                saveFormat: 'Base64',
                path: '/new/path/url',
                previewTemplate: '<div> Preview Template </div>',
                attachmentTemplate: '<div> Attachment Template </div>'
            };
            chatUI.dataBind();

            // Check for updated values
            expect(chatUI.attachmentSettings.saveUrl).toBe('/new/save/url');
            expect(chatUI.attachmentSettings.removeUrl).toBe('/new/remove/url');
            expect(chatUI.attachmentSettings.maxFileSize).toBe(5000000);
            expect(chatUI.attachmentSettings.enableDragAndDrop).toBe(false);
            expect(chatUI.attachmentSettings.maximumCount).toBe(1);
            expect(chatUI.attachmentSettings.allowedFileTypes).toBe('.png');
            expect(chatUI.attachmentSettings.saveFormat).toBe('Base64');
            expect(chatUI.attachmentSettings.path).toBe('/new/path/url');
            expect(chatUI.attachmentSettings.previewTemplate).toBe('<div> Preview Template </div>');
            expect(chatUI.attachmentSettings.attachmentTemplate).toBe('<div> Attachment Template </div>');

        });
        
        it('should dynamically change the enableAttachments property', () => {
            chatUI = new ChatUI({
                enableAttachments: true
            });
            chatUI.appendTo(chatUIElem);

            // Check initial state
            expect(chatUI.enableAttachments).toBe(true);
            expect(chatUIElem.querySelector('.e-chat-attachment-icon')).not.toBeNull();

            // Change the enableAttachments property
            chatUI.enableAttachments = false;
            chatUI.dataBind();

            // Check for updated state
            expect(chatUI.enableAttachments).toBe(false);
            expect(chatUIElem.querySelector('.e-chat-attachment-icon')).toBeNull();

            // Re-enable attachments
            chatUI.enableAttachments = true;
            chatUI.dataBind();

            // Check if attachments are enabled again
            expect(chatUI.enableAttachments).toBe(true);
            expect(chatUIElem.querySelector('.e-chat-attachment-icon')).not.toBeNull();
        });

        it('should upload a file with path property', function (done) {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    path: 'https://services.syncfusion.com/js/production/api/FileUploader'
                },
            });
            chatUI.appendTo(chatUIElem);
            const fileSizeInBytes = 2 * 1024 * 1024; // 2MB
            const fileData = new Uint8Array(fileSizeInBytes);
            const file: File = new File([fileData], 'document.docx', { type: 'application/' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
            setTimeout(function () {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messageItem = chatUIElem.querySelector('.e-message-item');
                    const fileWrapper = messageItem.querySelector('.e-chat-file-details');
                    expect(fileWrapper).not.toBeNull();
                    const fileName = fileWrapper.querySelector('.e-chat-file-name');
                    expect(fileName.textContent).toBe('document.docx');
                    const fileSize = fileWrapper.querySelector('.e-chat-file-size');
                    expect(fileSize.textContent).toBe('2048.00 KB');
                    done();
                }, 500);
            }, 500);
        });

        it('should dynamically change the saveFormat property', () => {
            chatUI = new ChatUI({
                enableAttachments: true
            });
            chatUI.appendTo(chatUIElem);
            chatUI.attachmentSettings = {
                saveFormat: 'Base64',
            };
            chatUI.dataBind();
            expect(chatUI.attachmentSettings.saveFormat).toBe('Base64');
            chatUI.attachmentSettings = {
                saveFormat: 'Blob'
            }
            chatUI.dataBind();
            expect(chatUI.attachmentSettings.saveFormat).toBe('Blob');
        });

        it('should upload an image with saveformat set as Base64', function (done) {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    saveFormat: 'Base64'
                }
            });
            chatUI.appendTo(chatUIElem);
            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
            setTimeout(function () {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messages = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messages.length).toBeGreaterThan(0);
                    const lastMsg = messages[messages.length - 1];
                    const img = lastMsg.querySelector('img');
                    expect(img).not.toBeNull();
                    expect(img.src).not.toContain('blob:');
                    expect(img.alt).toBe('sample.png');
                    done();
                }, 500);
            }, 500);
        });

        it('should upload a file with saveformat set as Base64', function (done) {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    saveFormat: 'Base64'
                },
            });
            chatUI.appendTo(chatUIElem);
            const fileSizeInBytes = 2 * 1024 * 1024; // 2MB
            const fileData = new Uint8Array(fileSizeInBytes);
            const file: File = new File([fileData], 'document.docx', { type: 'application/' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
            setTimeout(function () {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messageItem = chatUIElem.querySelector('.e-message-item');
                    const fileWrapper = messageItem.querySelector('.e-chat-file-details');
                    expect(fileWrapper).not.toBeNull();
                    const fileName = fileWrapper.querySelector('.e-chat-file-name');
                    expect(fileName.textContent).toBe('document.docx');
                    const fileSize = fileWrapper.querySelector('.e-chat-file-size');
                    expect(fileSize.textContent).toBe('2048.00 KB');
                    done();
                }, 500);
            }, 500);
        });

        it('should render failure alert when an oversized file is uploaded', (done) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    maxFileSize: 0, 
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);
            const largeFile = new File(['sample file'], 'bigfile.pdf', { type: 'application/pdf' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(largeFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).toBeNull();
                const failureElement: HTMLElement = chatUIElem.querySelector('.e-upload-failure-alert') as HTMLElement;
                expect(failureElement).not.toBeNull();
                expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload failed: 1 file exceeded the maximum size');
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 500);
        });

        it('should render failure alert when an oversized image is uploaded', (done) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    maxFileSize: 0, 
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);
            const largeFile = new File(['sample file'], 'sample.png', { type: 'image/' });
            const largeFile2 = new File(['sample file'], 'bigfile.pdf', { type: 'application/pdf' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(largeFile);
            dt.items.add(largeFile2);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).toBeNull();
                const failureElement: HTMLElement = chatUIElem.querySelector('.e-upload-failure-alert') as HTMLElement;
                expect(failureElement).not.toBeNull();
                expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload failed: 2 files exceeded the maximum size');
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 500);
        });

        it('should show media preview overlay when clicking a sent image', (done) => {
            const currentUserModel = { id: "user1", user: "Albert" };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image data'], 'sample.png', { type: 'image/png' });
            const dt = new DataTransfer();
            dt.items.add(imageFile);

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const imageMsg = chatUIElem.querySelector('.e-message-item img') as HTMLImageElement;
                    expect(imageMsg).not.toBeNull();
                    imageMsg.click();
                    const overlay = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlay).not.toBeNull();

                    const previewImg = overlay.querySelector('.e-image-preview') as HTMLImageElement;
                    expect(previewImg.alt).toBe('sample.png');
                    const closeBtn = overlay.querySelector('.e-chat-back-icon') as HTMLElement;
                    expect(closeBtn).not.toBeNull();
                    closeBtn.click();

                    const overlayAfterClose = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlayAfterClose).toBeNull();

                    done();
                }, 500);
            }, 500);
        });

        it('should upload a video and show preview when sent video is clicked', (done) => {
            const currentUserModel = { id: "user1", user: "Albert" };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const videoFile = new File(['video data'], 'sample.mp4', { type: 'video/mp4' });
            const dt = new DataTransfer();
            dt.items.add(videoFile);

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const videoMsg = chatUIElem.querySelector('.e-message-item video') as HTMLVideoElement;
                    expect(videoMsg).not.toBeNull();

                    const playOverlay = chatUIElem.querySelector('.e-play-icon-wrapper') as HTMLElement;
                    const playBtn = playOverlay.querySelector('.e-chat-video-play') as HTMLElement;
                    expect(playBtn).not.toBeNull();
                    playBtn.click();

                    const previewOverlay = chatUIElem.querySelector('.e-preview-overlay') as HTMLElement;
                    expect(previewOverlay).not.toBeNull();

                    const previewVideo = previewOverlay.querySelector('video.e-video-preview') as HTMLVideoElement;
                    expect(previewVideo).not.toBeNull();
                    expect(previewVideo.title).toBe('sample.mp4');
                    previewOverlay.click();
                    const overlayAfterClose = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlayAfterClose).toBeNull();
                    expect(playBtn).not.toBeNull();
                    playBtn.click();
                    const clickEvent = new MouseEvent('click', { bubbles: true });
                    previewOverlay.dispatchEvent(clickEvent);
                    (chatUI as any).destroyAttachments();
                    expect(chatUIElem.querySelector('.e-preview-overlay')).toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should upload a file and show preview when sent file is clicked', (done) => {
            const currentUserModel = { id: "user1", user: "Albert" };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const largeFile = new File(['sample file'], 'bigfile.pdf', { type: 'application/pdf' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(largeFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const fileMessage = chatUIElem.querySelector('.e-message-item .e-file-wrapper') as HTMLVideoElement;
                    expect(fileMessage).not.toBeNull();
                    fileMessage.click();
                    const previewOverlay = chatUIElem.querySelector('.e-preview-overlay') as HTMLElement;
                    expect(previewOverlay).not.toBeNull();
                    const previewHeader = previewOverlay.querySelector('.e-preview-header') as HTMLElement;
                    expect(previewHeader.textContent).toContain(largeFile.name);

                    const previewFile = previewOverlay.querySelector('.e-file-preview') as HTMLElement;
                    expect(previewFile).not.toBeNull();
                    const noPreviewText = previewFile.querySelector('.e-preview-file-text') as HTMLElement;
                    expect(noPreviewText.textContent).toContain('No Preview Available');
                    const fileSizeText = previewFile.querySelector('.e-file-details') as HTMLElement;
                    expect(fileSizeText.textContent).toContain('0.01 KB');
                    const closeBtn = previewOverlay.querySelector('.e-chat-back-icon') as HTMLElement;
                    expect(closeBtn).not.toBeNull();
                    closeBtn.click();
                    const overlayAfterClose = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlayAfterClose).toBeNull();
                    fileMessage.click();
                    const clickEvent = new MouseEvent('click', { bubbles: true });
                    previewOverlay.dispatchEvent(clickEvent);
                    (chatUI as any).destroyAttachments();
                    expect(chatUIElem.querySelector('.e-preview-overlay')).toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should not show preview for uploaded file when attachment click is prevented', (done) => {
            const currentUserModel = { id: "user1", user: "Albert" };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    attachmentClick: function (args) {
                        args.cancel = true;
                    }
                }
            });
            chatUI.appendTo(chatUIElem);
            const largeFile = new File(['sample file'], 'bigfile.pdf', { type: 'application/pdf' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(largeFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const fileMessage = chatUIElem.querySelector('.e-message-item .e-file-wrapper') as HTMLVideoElement;
                    expect(fileMessage).not.toBeNull();
                    fileMessage.click();
                    const previewOverlay = chatUIElem.querySelector('.e-preview-overlay') as HTMLElement;
                    expect(previewOverlay).toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should close media preview overlay when pressing Escape key', (done) => {
            const currentUserModel = { id: "user1", user: "Albert" };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const videoFile = new File(['sample video data'], 'sample.mp4', { type: 'video/mp4' });
            const dt = new DataTransfer();
            dt.items.add(videoFile);
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const videoMsg = chatUIElem.querySelector('.e-message-item video') as HTMLImageElement;
                    expect(videoMsg).not.toBeNull();
                    videoMsg.click();
                    const overlay = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlay).not.toBeNull();
                    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                    overlay.dispatchEvent(escEvent);
                    setTimeout(() => {
                        const overlayAfterEsc = chatUIElem.querySelector('.e-preview-overlay');
                        expect(overlayAfterEsc).toBeNull();
                        done();
                    }, 100);
                }, 500);
            }, 500);
        });


        it('should copy the image file when copy icon is clicked', (done: DoneFn) => {
            const currentUserModel = {
                id: 'user1',
                user: 'Albert'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['mock-image-data'], 'sample.png', { type: 'image/png' });
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                spyOn(chatUI as any, 'writeFileToClipboard');
                const copyButton = chatUIElem.querySelector('.e-icons.e-chat-copy') as HTMLElement;
                expect(copyButton).not.toBeNull();
                copyButton.click();
                expect((chatUI as any).writeFileToClipboard).toHaveBeenCalled();
                done()
            }, 500);
        });

        it('should upload an image and check whether it is rendered and pinned', (done: DoneFn) => {
            const currentUserModel = {
                    id: "user1",
                    user: "Albert"
                };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);
        
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;
                const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin') as HTMLElement;
                expect(pinButton).not.toBeNull();
                pinButton.click();
                const pinnedMessageElement: HTMLElement = chatUIElem.querySelector('.e-pinned-message') as HTMLElement;
                const pinnedImage: HTMLImageElement =  pinnedMessageElement.querySelector('.e-pinned-img-thumb') as HTMLImageElement;
                expect(pinnedImage).not.toBeNull();
                expect(pinnedMessageElement.querySelector('.e-pinned-file-name').textContent).toBe('sample.png')
                expect(pinnedImage.src).toContain('blob:');
                done();
            }, 500);
        });

        it('should upload a file and check whether it is rendered and pinned', (done: DoneFn) => {
            const currentUserModel = {
                    id: "user1",
                    user: "Albert"
                };
            chatUI = new ChatUI({
                user:currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'document.pdf', { type: 'application/' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;

                const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin') as HTMLElement;
                expect(pinButton).not.toBeNull();
                pinButton.click();
                const pinnedMessageElement: HTMLElement = chatUIElem.querySelector('.e-pinned-message') as HTMLElement;
                const pinnedfileIcon: HTMLElement =  pinnedMessageElement.querySelector('.e-icons') as HTMLElement;
                expect(pinnedfileIcon).not.toBeNull();
                expect(pinnedMessageElement.querySelector('.e-pinned-file-name').textContent).toBe('document.pdf');
                done();
            }, 500);
        });

        it('should upload a file and reply to that file attached message', (done: DoneFn) => {
            const currentUserModel = {
                    id: "user1",
                    user: "Albert"
                };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                showTimeStamp: false,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'document.pdf', { type: 'application/' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
            
                const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
                expect(replyButton).not.toBeNull();
                replyButton.click();

                const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper');
                expect(replyWrapper).not.toBeNull();
                const replyThumbImage: HTMLElement = replyWrapper.querySelector('.e-chat-file-icon');
                expect(replyThumbImage.className).not.toBe(null);
                const replyImageName: HTMLElement = replyWrapper.querySelector('.e-reply-file-name');
                expect(replyImageName.textContent).toBe('document.pdf');
                replyButton.click();

                const footerTextArea: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
                footerTextArea.innerText = 'New reply message!';
                const inputEvent: Event = new Event('input', { bubbles: true });
                footerTextArea.dispatchEvent(inputEvent);
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const newMessageItem: HTMLElement = messageItems[messageItems.length - 1];
                const newReplyWrapper: HTMLElement = newMessageItem.querySelector('.e-reply-wrapper');
                expect(newReplyWrapper).not.toBeNull();
                const newText: HTMLElement = newMessageItem.querySelector('.e-text');
                expect(newText.textContent).toBe('New reply message!');
                done();
            }, 500);
        });

        it('should upload an image and reply to that message', (done: DoneFn) => {
            const currentUserModel = {
                    id: "user1",
                    user: "Albert"
                };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                timeStampFormat: 'dd/MM/yyyy hh:mm a',
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
                expect(replyButton).not.toBeNull();
                replyButton.click();

                const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper');
                expect(replyWrapper).not.toBeNull();
                const replyThumbImage: HTMLElement = chatUIElem.querySelector('.e-reply-media-thumb');
                expect(replyThumbImage.className).not.toBe(null);
                const replyImageName: HTMLElement = chatUIElem.querySelector('.e-reply-file-name');
                expect(replyImageName.textContent).toBe('sample.png');
                replyButton.click();

                const footerTextArea: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
                footerTextArea.innerText = 'New reply message!';
                const inputEvent: Event = new Event('input', { bubbles: true });
                footerTextArea.dispatchEvent(inputEvent);

                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const newMessageItem: HTMLElement = messageItems[messageItems.length - 1];
                const newReplyWrapper: HTMLElement = newMessageItem.querySelector('.e-reply-wrapper');
                expect(newReplyWrapper).not.toBeNull();
                const newText: HTMLElement = newMessageItem.querySelector('.e-text');
                expect(newText.textContent).toBe('New reply message!');
                done()
            }, 500);
        });

        it('should upload a video and reply to that message', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                timeStampFormat: 'dd/MM/yyyy hh:mm a',
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample video data'], 'sample.mp4', { type: 'video/mp4' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-footer .e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
                expect(replyButton).not.toBeNull();
                replyButton.click();
                const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper');
                expect(replyWrapper).not.toBeNull();
                const replyThumbVideo: HTMLVideoElement = chatUIElem.querySelector('.e-reply-media-thumb') as HTMLVideoElement;
                expect(replyThumbVideo).not.toBeNull();
                expect(replyThumbVideo.src).toContain('blob:');

                const replyVideoName: HTMLElement = chatUIElem.querySelector('.e-reply-file-name');
                expect(replyVideoName.textContent).toBe('sample.mp4');
                replyButton.click();

                const footerTextArea: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
                footerTextArea.innerText = 'Reply to video!';
                const inputEvent: Event = new Event('input', { bubbles: true });
                footerTextArea.dispatchEvent(inputEvent);

                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                const newMessageItem: HTMLElement = messageItems[messageItems.length - 1];

                const newReplyWrapper: HTMLElement = newMessageItem.querySelector('.e-reply-wrapper');
                expect(newReplyWrapper).not.toBeNull();

                const newText: HTMLElement = newMessageItem.querySelector('.e-text');
                expect(newText.textContent).toBe('Reply to video!');
                done()
            }, 500);
        });

        it('should paste the image and send as attachment message', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                timeStampFormat: 'dd/MM/yyyy hh:mm a',
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            
            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.focus();
            const range: Range = document.createRange();
            range.selectNodeContents(textareaEle);
            range.collapse(false); 
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const blob: Blob = new Blob(['fake image content'], { type: 'image/png' });
            const imageFile: File = new File([blob], 'sample.png', { type: 'image/png' }) as File;
            const clipboardItem = new DataTransfer();
            clipboardItem.items.add(imageFile);
            const pasteEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(pasteEvent, 'clipboardData', {
                value: clipboardItem
            });
            textareaEle.dispatchEvent(pasteEvent);
            
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messageItem: HTMLElement = chatUIElem.querySelector('.e-message-item') as HTMLElement;
                    const spinner: HTMLElement = messageItem.querySelector('.e-progress-wrapper');
                    expect(spinner).not.toBeNull;
                    const img: HTMLImageElement = messageItem.querySelector('img');
                    expect(img).not.toBeNull();
                    expect(img.src).toContain('blob:');
                    done();
                }, 450);
            }, 450, done);
        });
        
        it('should copy and write the png image directly to clipboard', (done: DoneFn) => {
            const mockFile = new File(['dummy content'], 'image.png', { type: 'image/png' });
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                configurable: true,
                value: {
                write: jasmine.createSpy('clipboardWrite').and.callFake((items: ClipboardItem[]) => {
                    expect(items.length).toBe(1);
                    expect(items[0] instanceof ClipboardItem).toBe(true);
                    done();
                    return Promise.resolve();
                })
                }
            });
            spyOn(document, 'hasFocus').and.returnValue(true);

            const instance: any = new InterActiveChatBase();
            instance.writeFileToClipboard(mockFile);
        });

        it('should convert other type image to png and write to clipboard', function (done) {
            const mockFile = new File(['dummy jpeg content'], 'image.jpeg', { type: 'image/jpeg' });
            spyOn(document, 'hasFocus').and.returnValue(true);

            spyOn(URL, 'createObjectURL').and.returnValue('blob:url-fake');

            const originalImage = (window as any).Image;
            const mockImage = function () {
                setTimeout(() => {
                    if (mockImageInstance.onload) {
                        mockImageInstance.onload();
                    }
                }, 0);
                return mockImageInstance;
            };
            const mockImageInstance: any = {
                onload: null,
                src: '',
                width: 100,
                height: 50
            };
            (window as any).Image = mockImage;
            spyOn(document, 'createElement').and.callFake(function (tag: string) {
                if (tag === 'canvas') {
                return {
                    width: 0,
                    height: 0,
                    getContext: () => ({
                    drawImage: () => {}
                    }),
                    toBlob: function (callback: (blob: Blob) => void) {
                    const blob = new Blob(['converted'], { type: 'image/png' });
                    callback(blob);
                    }
                };
                }
                return document.createElement(tag);
            });
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                configurable: true,
                value: {
                write: jasmine.createSpy('clipboardWrite').and.callFake(function (items: any) {
                    expect(items.length).toBe(1);
                    expect(items[0] instanceof ClipboardItem).toBe(true);
                    done();
                    return Promise.resolve();
                })
                }
            });
            const instance: any = new InterActiveChatBase();
            instance.writeFileToClipboard(mockFile);
            (window as any).Image = originalImage;
        });

        it('should not allow to paste not allowed file types in drop area', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                timeStampFormat: 'dd/MM/yyyy hh:mm a',
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    allowedFileTypes: '.jpeg'
                }
            });
            chatUI.appendTo(chatUIElem);
            
            const textareaEle: HTMLDivElement = chatUIElem.querySelector('.e-footer .e-chat-textarea');
            expect(textareaEle).not.toBeNull();
            textareaEle.focus();
            const range: Range = document.createRange();
            range.selectNodeContents(textareaEle);
            range.collapse(false); 
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            const blob: Blob = new Blob(['fake image content'], { type: 'image/png' });
            const imageFile: File = new File([blob], 'sample.png', { type: 'image/png' }) as File;
            const clipboardItem = new DataTransfer();
            clipboardItem.items.add(imageFile);
            const pasteEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(pasteEvent, 'clipboardData', {
                value: clipboardItem
            });
            textareaEle.dispatchEvent(pasteEvent);
            
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 200);
        });

        it('should upload a video and check whether it is rendered and pinned', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const videoFile: File = new File(['sample video data'], 'sample.mp4', { type: 'video/mp4' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(videoFile);
            fileInput.files = dt.files;
            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;
                    const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin') as HTMLElement;
                    expect(pinButton).not.toBeNull();
                    pinButton.click(); 

                    const pinnedMessageElement: HTMLElement = chatUIElem.querySelector('.e-pinned-message') as HTMLElement;
                    expect(pinnedMessageElement).not.toBeNull();

                    const pinnedVideo: HTMLVideoElement = pinnedMessageElement.querySelector('.e-pinned-img-thumb') as HTMLVideoElement;
                    expect(pinnedVideo).not.toBeNull();
                    expect(pinnedVideo.src).toContain('blob:');

                    const pinnedLabel: HTMLElement = pinnedMessageElement.querySelector('.e-pinned-file-name') as HTMLElement;
                    expect(pinnedLabel).not.toBeNull();
                    expect(pinnedLabel.textContent).toBe('sample.mp4');

                    const unpinButton: HTMLElement = chatUIElem.querySelector('.e-chat-message-toolbar .e-icons.e-chat-unpin');
                    expect(unpinButton).not.toBeNull();

                    unpinButton.click();
                    const pinnedWrapper: HTMLElement = chatUIElem.querySelector('.e-pinned-message-wrapper');
                    expect(pinnedWrapper.style.display).toBe('none');
                    done();
                }, 500);
            }, 500);
        });

        it('should trigger attachmentRemoved on remove operation in onUploadSuccess', () => {
            const chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'test-url',
                    removeUrl: 'test-url'
                }
            });

            const spyTrigger = spyOn(chatUI as any, 'trigger');
            chatUI.appendTo(chatUIElem);

            const args = {
                operation: 'remove',
                file: {
                    name: 'example.jpg',
                    id: 'file123',
                    rawFile: new File([], 'example.jpg')
                }
            };
            (chatUI as any).onUploadSuccess(args);
            expect(spyTrigger).toHaveBeenCalledWith('attachmentRemoved', args);
        });

        it('should trigger attachmentUploadFailure on onUploadFailure', () => {
            const chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'test-url',
                    removeUrl: 'test-url'
                }
            });
            const spyTrigger = spyOn(chatUI as any, 'trigger');
            chatUI.appendTo(chatUIElem);

            const args = {
                operation: 'upload',
                file: {
                    name: 'error-file.mp4',
                    id: 'fail123',
                    rawFile: new File([], 'error-file.mp4'),
                    status: 'File failed to upload'
                },
                error: 'Upload failed due to network'
            };
            (chatUI as any).onUploadFailure(args);
            expect(spyTrigger).toHaveBeenCalledWith('attachmentUploadFailure', args);
        });

        it('should render a document attachment using addMessage()', function () {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                   saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                   removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const mockFile = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
            const newMessage: MessageModel = {
                id: 'msg1',
                text: '',
                author: { id: 'user3', user: 'FileUser', statusIconCss: 'e-icons e-user-away' },
                timeStamp: new Date(),
                attachedFile: {
                    id: 'file1',
                    name: mockFile.name,
                    rawFile: mockFile,
                    fileSource: URL.createObjectURL(mockFile),
                    size: mockFile.size
                },
            } as any;

            chatUI.addMessage(newMessage);
            const messageElem = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            const fileName = messageElem.querySelector('.e-chat-file-name') as HTMLElement;
            expect(fileName.textContent).toBe('report.pdf');
        });

        it('should render an image attachment using addMessage()', function () {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                   saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                   removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image data'], 'photo.jpg', { type: 'image/jpeg' });
            const newMessage: MessageModel = {
                id: 'msg1',
                text: '',
                author: { id: 'user3', user: 'ImageUser', statusIconCss: 'e-icons e-user-busy' },
                timeStamp: new Date(),
                attachedFile: {
                    id: 'img1',
                    name: imageFile.name,
                    rawFile: imageFile,
                    fileSource: URL.createObjectURL(imageFile),
                    size: imageFile.size
                }
            } as any;
            chatUI.addMessage(newMessage);
            const messageElem = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            const img = messageElem.querySelector('img');
            expect(img).not.toBeNull();
            expect((img as HTMLImageElement).src).toContain('blob:');
        });

        it('should render a video attachment using addMessage()', function () {
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                   saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                   removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const videoFile = new File(['video data'], 'movie.mp4', { type: 'video/mp4' });
            const newMessage: MessageModel = {
                id: 'msg1',
                text: '',
                author: { id: 'user3', user: 'VideoUser', statusIconCss: 'e-icons e-user-offline' },
                timeStamp: new Date(),
                attachedFile: {
                    id: 'vid1',
                    name: videoFile.name,
                    rawFile: videoFile,
                    fileSource: URL.createObjectURL(videoFile),
                    size: videoFile.size
                }
            } as any;

            chatUI.addMessage(newMessage);
            const messageElem = chatUIElem.querySelector('.e-message-item');
            expect(messageElem).not.toBeNull();
            const video = messageElem.querySelector('video') as HTMLVideoElement;
            expect(video).not.toBeNull();
            expect(video.querySelector('source').src).toContain('blob:');
            const playWrapper = messageElem.querySelector('.e-play-icon-wrapper') as HTMLElement;
            expect(playWrapper).not.toBeNull();
        });

        it('should upload an image with incorrect saveUrl for checking failure case', (done) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Saves',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Removes'
                }
            });
            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'sample.png', { type: 'image/png' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const progressBar: HTMLElement = attachedFile.querySelector('.e-chat-progress-bar') as HTMLElement;
                expect(progressBar).not.toBeNull();
                const progressFill: HTMLElement = progressBar.querySelector('.e-chat-progress-fill') as HTMLElement;
                const uploaderObj = (chatUI as any).uploaderObj;
                uploaderObj.trigger('failure', {
                    operation: 'upload',
                    file: { name: 'sample.png', size: file.size, type: file.type }
                });
                expect(progressFill.classList).toContain('e-chat-upload-failed');
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 500);
        });

        it('should upload multiple files in the drop area', (done: DoneFn) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample.mp4', { type: 'video/mp4' });
            const docFile = new File(['document content'], 'sample.pdf', { type: 'application/pdf' });

            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            dt.items.add(videoFile);
            dt.items.add(docFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles).not.toBeNull();
                expect(attachedFiles.length).toBe(3);
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                setTimeout(() => {
                    const messages: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messages.length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('should add files in drop area when multiple files are uploaded sequentially', (done: DoneFn) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample1.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample2.mp4', { type: 'video/mp4' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt1 = new DataTransfer();
            dt1.items.add(imageFile);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                let attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles).not.toBeNull();
                expect(attachedFiles.length).toBe(1);
                const dt2 = new DataTransfer();
                dt2.items.add(videoFile);
                fileInput.files = dt2.files;
                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    attachedFiles = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                    expect(attachedFiles).not.toBeNull();
                    expect(attachedFiles.length).toBe(2);
                    done();
                }, 500);
            }, 500);
        });

        it('should upload multiple files and cleared from footer when clear icon is clicked', (done: DoneFn) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample.mp4', { type: 'video/mp4' });
            const docFile = new File(['document content'], 'sample.pdf', { type: 'application/pdf' });

            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            dt.items.add(videoFile);
            dt.items.add(docFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                let attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles).not.toBeNull();
                expect(attachedFiles.length).toBe(3);
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                const uploaderObj = (chatUI as any).uploaderObj;
                ['sample.png', 'sample.mp4', 'sample.pdf'].forEach(function (name) {
                    uploaderObj.trigger('success', { operation: 'upload', file: { name: name } });
                });
                expect(sendIcon.classList).toContain('enabled');
                attachedFiles.forEach((fileElement: HTMLElement) => {
                    const clearIcon: HTMLElement = fileElement.querySelector('.e-chat-close');
                    expect(clearIcon).not.toBeNull();
                    clearIcon.click();
                });
                attachedFiles = chatUIElem.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles.length).toBe(0);
                expect(sendIcon.classList).toContain('disabled');
                done();
            }, 500);
        });

        it('should upload multiple files and send text message with attachments', (done: DoneFn) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample.mp4', { type: 'video/mp4' });
            const docFile = new File(['document content'], 'sample.pdf', { type: 'application/pdf' });

            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            dt.items.add(videoFile);
            dt.items.add(docFile);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                let attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles).not.toBeNull();
                expect(attachedFiles.length).toBe(3);
                const textArea: HTMLElement = chatUIElem.querySelector('.e-chat-textarea') as HTMLElement;
                textArea.innerHTML = 'This is text message with attachment';
                textArea.dispatchEvent(new Event('input'));
                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                setTimeout(() => {
                    const messages: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messages.length).toBe(3);
                    messages.forEach((msg: HTMLElement, index: number) => {
                        const messageText: HTMLElement = msg.querySelector('.e-text') as HTMLElement;
                        if (index === messages.length - 1) {
                            expect(messageText.textContent).toBe('This is text message with attachment');
                        }
                        else {
                            expect(messageText).toBeNull();
                        }
                    });
                    done();
                }, 500);
            }, 500);
        });

        it('should upload multiple files and send mentionedUsers in text message with attachments', (done: DoneFn) => {
            const mentionUsers = [
                { id: "user1", user: "John Doe" }
            ];
            const capturedMessages: MessageModel[] = [];

            const chatUI = new ChatUI({
                mentionUsers: mentionUsers,
                user: { id: 'currentUser', user: 'Current User' },
                messageSend: (args: MessageSendEventArgs) => {
                    capturedMessages.push(args.message);
                },
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample.mp4', { type: 'video/mp4' });
            const docFile = new File(['document content'], 'sample.pdf', { type: 'application/pdf' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            dt.items.add(videoFile);
            dt.items.add(docFile);
            fileInput.files = dt.files;

            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                let attachedFiles: NodeListOf<HTMLElement> = dropArea.querySelectorAll('.e-chat-uploaded-file-item');
                expect(attachedFiles).not.toBeNull();
                expect(attachedFiles.length).toBe(3);
                const mentionUser = mentionUsers[0];
                const messageText = `This is a text message with mentioned user `;
                const textareaElem = chatUIElem.querySelector('.e-chat-textarea') as HTMLDivElement;
                textareaElem.innerText = messageText;
                const mentionChip = document.createElement('span');
                mentionChip.className = 'e-mention-chip';
                const mentionUserSpan = document.createElement('span');
                mentionUserSpan.className = 'e-chat-mention-user-chip';
                mentionUserSpan.setAttribute('data-user-id', mentionUser.id);
                mentionUserSpan.textContent = mentionUser.user;
                mentionChip.appendChild(mentionUserSpan);
                textareaElem.appendChild(mentionChip);
                textareaElem.dispatchEvent(new Event('input'));
                const sendButton = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                sendButton.click();

                setTimeout(() => {
                    expect(capturedMessages.length).toBe(3);

                    capturedMessages.forEach((msg, index) => {
                        if (index === capturedMessages.length - 1 ) {
                            expect(msg.text).toContain('This is a text message with mentioned user ');
                            expect(msg.mentionUsers.length).toBe(1);
                            expect(msg.mentionUsers[0].id).toBe(mentionUsers[0].id);
                            expect(msg.mentionUsers[0].user).toBe(mentionUsers[0].user);
                        }
                        else {
                            expect(msg.text).toBe('');
                            expect(msg.mentionUsers.length).toBe(0);
                        }
                    });
                    done();
                }, 600);
            }, 500);
        });

        it('should pin a message with both attachment and text message in it', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const file: File = new File(['sample image data'], 'document.pdf', { type: 'application/pdf' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            const changeEvent = new Event('change');
            fileInput.dispatchEvent(changeEvent);

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();

                const textArea: HTMLElement = chatUIElem.querySelector('.e-chat-textarea') as HTMLElement;
                expect(textArea).not.toBeNull();
                textArea.innerHTML = 'This is a pinned message with attachment';
                textArea.dispatchEvent(new Event('input'));

                const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const messageWrapper: HTMLElement = chatUIElem.querySelector('.e-message-wrapper') as HTMLElement;
                    expect(messageWrapper).not.toBeNull();

                    const pinButton: HTMLElement = messageWrapper.querySelector('.e-chat-pin') as HTMLElement;
                    expect(pinButton).not.toBeNull();
                    pinButton.click();

                    const pinnedMessageElement: HTMLElement = chatUIElem.querySelector('.e-pinned-message') as HTMLElement;
                    expect(pinnedMessageElement).not.toBeNull();

                    const pinnedContent: HTMLElement = pinnedMessageElement.querySelector('.e-pinned-message-content') as HTMLElement;
                    expect(pinnedContent).not.toBeNull();
                    expect(pinnedContent.textContent).toBe('This is a pinned message with attachment');
                    expect(pinnedMessageElement.querySelector('.e-pinned-file-name')).toBeNull();
                    done();
                }, 500);
            }, 500);
        });

        it('should restrict file upload to maximumCount limit and show error on exceeding', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = chatUIElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                done();
            }, 500);
        });

        it('check for error message when maximumCount is set as one', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 1
                }
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = chatUIElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                const failureMessage = failureAlert.querySelector('.e-failure-message');
                expect(failureMessage.textContent).toBe('Upload limit reached: Maximum 1 file allowed. Remove extra files to proceed uploading');
                done();
            }, 500);
        });

        it('should show and remove failure alert when file count exceeds maximumCount', () => {
            jasmine.clock().install();
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;

            fileInput.dispatchEvent(new Event('change'));
            jasmine.clock().tick(500);

            const failureAlert = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureAlert).not.toBeNull();
            expect(failureAlert.classList.contains('e-show')).toBe(true);
            jasmine.clock().tick(3000);

            expect(failureAlert.classList.contains('e-show')).toBe(false);

            jasmine.clock().uninstall();
        });

        it('should restrict file upload to maximumCount limit and allow upload after increasing limit', (done: DoneFn) => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 2
                }
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const file3 = new File(['data3'], 'file3.png', { type: 'image/png' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const failureAlert = chatUIElem.querySelector('.e-upload-failure-alert');
                expect(failureAlert).not.toBeNull();
                expect(failureAlert.classList.contains('e-show')).toBe(true);
                const closeIcon: HTMLElement = failureAlert.querySelector('.e-chat-close');
                expect(closeIcon).not.toBeNull();
                closeIcon.click();

                chatUI.attachmentSettings.maximumCount = 3;
                chatUI.dataBind();

                const newDt = new DataTransfer();
                newDt.items.add(file1);
                newDt.items.add(file2);
                newDt.items.add(file3);
                fileInput.files = newDt.files;
                fileInput.dispatchEvent(new Event('change'));

                setTimeout(() => {
                    const updatedFailureAlert = chatUIElem.querySelector('.e-upload-failure-alert');
                    expect(updatedFailureAlert).toBeNull();

                    const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                    expect(sendIcon).not.toBeNull();
                    sendIcon.click();
                    const messageElements = chatUIElem.querySelectorAll('.e-message-item');
                    expect(messageElements.length).toBe(3);
                    done();
                }, 500);
            }, 500);
        });

        it('should render preview template with selected file image', (done: DoneFn) => {
            const previewTemplateFn = (context: any): string => {
                return `
                    <div class="e-preview-image-temp">
                        <img src="${context.selectedFile.fileSource}" alt="${context.selectedFile.name}" style="max-width: 100%; height: auto;" />
                    </div>
                `;
            };
            const currentUserModel = {
                id: "user1",
                user: "John Doe"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    previewTemplate: previewTemplateFn
                }
            });
            chatUI.appendTo(chatUIElem);
            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                attachedFile.click();
                const previewTemplateElem = chatUIElem.querySelector('.e-preview-template') as HTMLElement;
                expect(previewTemplateElem).not.toBeNull();
                const imageElem = previewTemplateElem.querySelector('img') as HTMLImageElement;
                expect(imageElem).not.toBeNull();
                expect(imageElem.alt).toBe('sample.png');
                expect(imageElem.src).toContain('blob:');
                done();
            }, 500);
        });

        it('should dynamically change the preview template', (done: DoneFn) => {
            const previewTemplateFn = (context: any): string => {
                return `
                    <div class="e-preview-image-temp">
                        <img src="${context.selectedFile.fileSource}" alt="${context.selectedFile.name}" style="max-width: 100%; height: auto;" />
                    </div>
                `;
            };
            const currentUserModel = {
                id: "user1",
                user: "John Doe"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });
            chatUI.appendTo(chatUIElem);
            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                attachedFile.click();
                let previewTemplateElem = chatUIElem.querySelector('.e-preview-template') as HTMLElement;
                expect(previewTemplateElem).toBeNull();
                chatUI.attachmentSettings.previewTemplate = previewTemplateFn;
                chatUI.dataBind();
                attachedFile.click();
                previewTemplateElem = chatUIElem.querySelector('.e-preview-template');
                expect(previewTemplateElem).not.toBeNull();
                const imageElem = previewTemplateElem.querySelector('img') as HTMLImageElement;
                expect(imageElem).not.toBeNull();
                expect(imageElem.alt).toBe('sample.png');
                expect(imageElem.src).toContain('blob:');
                done();
            }, 500);
        });

        it('should render selected file with attachment template', (done: DoneFn) => {
            const attachmentTemplateFn = (context: any): string => {
                return `
                    <div class="e-attached-file-temp">
                        <div class="attached-file-name">${context.selectedFile.name}</div>
                        <div class="attached-file-size">${context.selectedFile.type}</div>
                    </div>
                `;
            };
            const currentUserModel = {
                id: "user1",
                user: "John Doe"
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    attachmentTemplate: attachmentTemplateFn
                }
            });
            chatUI.appendTo(chatUIElem);
            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const previewTemplateElem = attachedFile.querySelector('.e-attachment-template') as HTMLElement;
                expect(previewTemplateElem).not.toBeNull();
                const fileNameElement = previewTemplateElem.querySelector('.attached-file-name') as HTMLElement;
                expect(fileNameElement).not.toBeNull();
                expect(fileNameElement.textContent).toBe('sample.png');
                const fileTypeElement = previewTemplateElem.querySelector('.attached-file-name') as HTMLElement;
                expect(fileTypeElement).not.toBeNull();
                expect(fileTypeElement.textContent).toContain('png');
                done();
            }, 500);
        });

        it('should destroy all attachment-related elements after showing preview', (done: DoneFn) => {
            const currentUserModel: UserModel = {
                id: "user1",
                user: "Albert",
                statusIconCss: 'e-icons e-user-busy'
            };
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                }
            });

            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image content'], 'sample.png', { type: 'image/png' });
            const videoFile = new File(['video content'], 'sample.mp4', { type: 'video/mp4' });
            const docFile = new File(['document content'], 'sample.pdf', { type: 'application/pdf' });

            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(imageFile);
            dt.items.add(videoFile);
            dt.items.add(docFile);
            fileInput.files = dt.files;

            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                (chatUI as any).destroyAttachments();
                expect(chatUIElem.querySelector('.e-chat-attachment-icon')).toBeNull();
                expect(chatUIElem.querySelector('.e-chat-drop-area')).toBeNull();
                expect(chatUIElem.querySelector('.e-preview-overlay')).toBeNull();

                expect((chatUI as any).uploaderObj).toBeNull();
                expect((chatUI as any).attachmentIcon).toBeNull();
                expect((chatUI as any).dropArea).toBeNull();
                expect((chatUI as any).uploadedFiles.length).toBe(0);

                done();
            }, 500);
        });

        it('should render and dynamically update the locale for attachment icon', () => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "attachments": 'Datei anhängen'
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "attachments": 'Joindre un fichier'
                    }
                }
            });
            chatUI = new ChatUI({
                enableAttachments: true,
                locale: 'de-DE',
                user: { id: 'user1', user: 'Albert' }
            });
            chatUI.appendTo(chatUIElem);
            const attachmentIcon: HTMLElement = chatUIElem.querySelector('.e-chat-attachment-icon') as HTMLElement;
            expect(attachmentIcon).not.toBeNull();
            expect(attachmentIcon.getAttribute('title')).toBe('Datei anhängen');
            chatUI.locale = 'fr-BE';
            chatUI.dataBind();
            const updatedAttachmentIcon: HTMLElement = chatUIElem.querySelector('.e-chat-attachment-icon') as HTMLElement;
            expect(updatedAttachmentIcon.getAttribute('title')).toBe('Joindre un fichier');
        });

        it('should render and dynamically update the locale for close icon in reply', () => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "close": 'Schließen'
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "close": 'Fermer'
                    }
                }
            });

            const initialMessage: MessageModel = {
                id: 'msg1',
                text: 'Reply to this message!',
                author: { id: 'user1', user: 'John Doe' },
                timeStampFormat: 'dd/MM/yyyy'
            };

            chatUI = new ChatUI({
                user: { id: 'user2', user: 'Jane Doe' },
                messages: [initialMessage],
                locale: 'de-DE'
            });

            chatUI.appendTo(chatUIElem);

            const replyButton: HTMLElement = chatUIElem.querySelector('.e-icons.e-chat-reply');
            expect(replyButton).not.toBeNull();

            replyButton.click();

            const replyWrapper: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper');
            expect(replyWrapper).not.toBeNull();

            const closeIcon: HTMLElement = replyWrapper.querySelector('.e-chat-close');
            expect(closeIcon).not.toBeNull();
            expect(closeIcon.getAttribute('title')).toBe('Schließen');

            chatUI.locale = 'fr-BE';
            chatUI.dataBind();

            const updatedCloseIcon: HTMLElement = chatUIElem.querySelector('.e-reply-wrapper .e-chat-close');
            expect(updatedCloseIcon).not.toBeNull();
            expect(updatedCloseIcon.getAttribute('title')).toBe('Fermer');
        });

        it('should render and dynamically update the locale for download and close icon in media preview', (done: DoneFn) => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "download": 'Herunterladen',
                        "close": "Schließen"
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "download": 'Télécharger',
                        "close": 'Fermer'
                    }
                }
            });

            const currentUserModel = { id: "user1", user: "Albert" };

            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                locale: 'de-DE',
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);

            const imageFile = new File(['image data'], 'sample.png', { type: 'image/png' });
            const dt = new DataTransfer();
            dt.items.add(imageFile);

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();

                const sendIcon = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();

                setTimeout(() => {
                    const imageMsg = chatUIElem.querySelector('.e-message-item img') as HTMLImageElement;
                    expect(imageMsg).not.toBeNull();
                    imageMsg.click();

                    const overlay = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlay).not.toBeNull();

                    const previewImg = overlay.querySelector('.e-image-preview') as HTMLImageElement;
                    expect(previewImg.alt).toBe('sample.png');

                    const downloadIcon = overlay.querySelector('.e-chat-download') as HTMLElement;
                    expect(downloadIcon).not.toBeNull();
                    expect(downloadIcon.getAttribute('title')).toBe('Herunterladen');

                    const closeIcon = overlay.querySelector('.e-chat-back-icon') as HTMLElement;
                    expect(closeIcon).not.toBeNull();
                    expect(closeIcon.getAttribute('title')).toBe('Schließen');
                    chatUI.locale = 'fr-BE';
                    chatUI.dataBind();

                    const updatedDownloadIcon = chatUIElem.querySelector('.e-preview-overlay .e-chat-download') as HTMLElement;
                    expect(updatedDownloadIcon).not.toBeNull();
                    expect(updatedDownloadIcon.getAttribute('title')).toBe('Télécharger');

                    const updatedCloseIcon = overlay.querySelector('.e-chat-back-icon') as HTMLElement;
                    expect(updatedCloseIcon).not.toBeNull();
                    expect(updatedCloseIcon).not.toBeNull();
                    expect(updatedCloseIcon.getAttribute('title')).toBe('Fermer');
                    updatedCloseIcon.click();

                    const overlayAfterClose = chatUIElem.querySelector('.e-preview-overlay');
                    expect(overlayAfterClose).toBeNull();

                    done();
                }, 500);
            }, 500);
        });

         it('should update filePreview locale for file preview before sent', (done: DoneFn) => {
            L10n.load({
                'en-US': {
                    "chat-ui": {
                        "filePreview": 'No Preview Available'
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "filePreview": 'Aucune prévisualisation disponible'
                    }
                }
            });
            chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 3
                },
                locale: 'en-US'
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(['doc content'], 'sample1.pdf', { type: 'application/pdf' });
            const file2 = new File(['doc content'], 'sample2.pdf', { type: 'application/pdf' });
            const file3 = new File(['doc content'], 'sample3.pdf', { type: 'application/pdf' });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            dt.items.add(file3);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                attachedFile.click();
                const previewText = chatUIElem.querySelector('.e-preview-file-text');
                expect(previewText.textContent).toBe('No Preview Available');
                chatUI.locale = 'fr-BE';
                chatUI.dataBind();
                const updatedPreviewText: HTMLElement = chatUIElem.querySelector('.e-preview-file-text');
                expect(updatedPreviewText.textContent).toBe('Aucune prévisualisation disponible');
                done();
            }, 200);
        });

        it('should dynamically change the locale and verify filePreview and remove icon titles in preview after sent', (done: DoneFn) => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "filePreview": 'Keine Vorschau verfügbar'
                    }
                },
                'fr-BE': {
                    "chat-ui": {
                        "filePreview": 'Aucune prévisualisation disponible'
                    }
                }
            });

            chatUI = new ChatUI({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                },
                locale: 'de-DE',
                user: { id: 'user1', user: 'Albert' }
            });

            chatUI.appendTo(chatUIElem);

            const file1: File = new File(['Nice One'], 'sample1.txt', { type: 'text/plain' });
            const fileInput: HTMLInputElement = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt1 = new DataTransfer();
            dt1.items.add(file1);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const dropArea: HTMLElement = chatUIElem.querySelector('.e-chat-drop-area') as HTMLElement;
                const attachedFile: HTMLElement = dropArea.querySelector('.e-chat-uploaded-file-item') as HTMLElement;
                expect(attachedFile).not.toBeNull();
                const sendIcon = chatUIElem.querySelector('.e-chat-send') as HTMLElement;
                expect(sendIcon).not.toBeNull();
                sendIcon.click();
                setTimeout(() => {
                    const fileMessage = chatUIElem.querySelector('.e-message-item .e-file-wrapper') as HTMLImageElement;
                    expect(fileMessage).not.toBeNull();
                    fileMessage.click();
                    const preview: HTMLElement = chatUIElem.querySelector('.e-preview-overlay') as HTMLElement;
                    const previewTextElem = preview.querySelector('.e-preview-file-text');
                    expect(previewTextElem).not.toBeNull();
                    expect(previewTextElem.textContent).toBe('Keine Vorschau verfügbar');
                    chatUI.locale = 'fr-BE';
                    chatUI.dataBind();
                    const updatedPreviewTextElem = preview.querySelector('.e-preview-file-text');
                    expect(updatedPreviewTextElem).not.toBeNull();
                    expect(updatedPreviewTextElem.textContent).toBe('Aucune prévisualisation disponible');
                    done();
                }, 300);
            }, 300);
        });

        it('should dynamically change the locale for fileSizeFailure alert when an oversized file is uploaded', () => {
            const currentUserModel = {
                id: "user1",
                user: "Albert"
            };
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "fileSizeFailure": 'Upload fehlgeschlagen: Die Datei ist zu groß'
                    }
                }
            });
            chatUI = new ChatUI({
                user: currentUserModel,
                enableAttachments: true,
                attachmentSettings: {
                    maxFileSize: 0, 
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
                }
            });

            chatUI.appendTo(chatUIElem);
            const file1 = new File(["File One"], "file1.txt", { type: "text/plain" });
            const file2 = new File(["File Two"], "file2.txt", { type: "text/plain" });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt1 = new DataTransfer();
            dt1.items.add(file1);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));
             let failureElement = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload failed: 1 file exceeded the maximum size');
            const closeIcon: HTMLElement = failureElement.querySelector('.e-chat-close');
            expect(closeIcon).not.toBeNull();
            closeIcon.click();

            chatUI.locale = 'de-DE';
            chatUI.dataBind();
            const dt2 = new DataTransfer();
            dt2.items.add(file2);
            fileInput.files = dt2.files;
            fileInput.dispatchEvent(new Event('change'));

            failureElement = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe('Upload fehlgeschlagen: Die Datei ist zu groß');
        });

        it('should dynamically change the locale for fileUploadFailure alert', () => {
            L10n.load({
                'fr-BE': {
                    "chat-ui": {
                        "fileCountFailure": 'Limite de téléchargement atteinte : Maximum {0} fichiers autorisés. Supprimez les fichiers supplémentaires pour continuer le téléchargement.'
                    }
                }
            });

            chatUI = new ChatUI({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 0
                },
                user: { id: 'user1', user: 'Albert' }
            });

            chatUI.appendTo(chatUIElem);

            const file1 = new File(["File One"], "file1.txt", { type: "text/plain" });
            const file2 = new File(["File Two"], "file2.txt", { type: "text/plain" });

            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt1 = new DataTransfer();
            dt1.items.add(file1);
            fileInput.files = dt1.files;
            fileInput.dispatchEvent(new Event('change'));
            let failureElement = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload limit reached: Maximum 0 files allowed. Remove extra files to proceed uploading'
            );
            const closeIcon: HTMLElement = failureElement.querySelector('.e-chat-close');
            expect(closeIcon).not.toBeNull();
            closeIcon.click();

            chatUI.locale = 'fr-BE';
            chatUI.dataBind();
            const dt2 = new DataTransfer();
            dt2.items.add(file2);
            fileInput.files = dt2.files;
            fileInput.dispatchEvent(new Event('change'));

            failureElement = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Limite de téléchargement atteinte : Maximum 0 fichiers autorisés. Supprimez les fichiers supplémentaires pour continuer le téléchargement.'
            );
        });

        it('should dynamically change the failure messsage locale when showing fileUploadFailure alert', () => {
            L10n.load({
                'de-DE': {
                    "chat-ui": {
                        "fileCountFailure": 'Upload-Limit erreicht: Maximal {0} Dateien erlaubt. Bitte entfernen Sie zusätzliche Dateien, um den Upload fortzusetzen.'
                    }
                }
            });

            chatUI = new ChatUI({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                    maximumCount: 1
                },
                locale: 'de-DE',
                user: { id: 'user1', user: 'Albert' }
            });
            chatUI.appendTo(chatUIElem);
            const file1 = new File(['data1'], 'file1.png', { type: 'image/png' });
            const file2 = new File(['data2'], 'file2.png', { type: 'image/png' });
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload') as HTMLInputElement;
            const dt = new DataTransfer();
            dt.items.add(file1);
            dt.items.add(file2);
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change'));
            let failureElement = chatUIElem.querySelector('.e-upload-failure-alert');
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload-Limit erreicht: Maximal 1 Dateien erlaubt. Bitte entfernen Sie zusätzliche Dateien, um den Upload fortzusetzen.'
            );
            chatUI.locale = 'en-US';
            chatUI.dataBind();
            expect(failureElement).not.toBeNull();
            expect(failureElement.querySelector('.e-failure-message').textContent).toBe(
                'Upload limit reached: Maximum 1 file allowed. Remove extra files to proceed uploading'
            );
        });

        it('should open file browser when Enter key is pressed on the attachment icon', (done: DoneFn) => {
            chatUI = new ChatUI({
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove',
                }
            });
            const keydownSpy = spyOn<any>(chatUI, 'triggerUploaderAction').and.callThrough();
            chatUI.appendTo(chatUIElem);
            const attachmentIcon: HTMLElement = chatUIElem.querySelector('.e-chat-attachment-icon') as HTMLElement;
            attachmentIcon.focus();
            const fileInput = chatUIElem.querySelector('.e-chat-file-upload');
            expect(fileInput).not.toBeNull();
            const fileInputSpy = spyOn(fileInput as HTMLInputElement, 'click');
            const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
            attachmentIcon.dispatchEvent(enterKeyEvent);
            setTimeout(() => {
                expect(keydownSpy).toHaveBeenCalled();
                expect(fileInputSpy).toHaveBeenCalled();
                done();
            }, 200, done);
        });

        it('should handle attachment removal even if wrong removeUrl is provided', (done: DoneFn) => {
            let isAttachmentRemoved: boolean = false;
            const chatUI = new ChatUI({
                user: { id: 'user1', user: 'Albert' },
                enableAttachments: true,
                attachmentSettings: {
                    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
                    removeUrl: 'FileUploader/Remove'
                },
                attachmentRemoved: () => {
                    expect((chatUI as any).uploadedFiles.length).toBe(0);
                    isAttachmentRemoved = true;
                }
            });
            chatUI.appendTo(chatUIElem);
            // Simulate adding a file to the uploader and uploading
            const uploadObj: any = (chatUI as any).uploaderObj as Uploader;
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                const uploadedFileItem = (chatUI as any).footer.querySelector('.e-chat-uploaded-file-item');
                const closeIcon = uploadedFileItem.querySelector('.e-icons.e-chat-close');
                closeIcon.click();
                setTimeout(() => {
                    expect(isAttachmentRemoved).toBe(true);
                    done();
                }, 800);
            }, 1000);
        });

    });

    describe('Footer interactions - keyboard and focus states', () => {
        let chatUI: ChatUI;
        const host: HTMLElement = createElement('div', { id: 'chatUIComp_footer' });

        beforeEach(() => {
            document.body.appendChild(host);
        });

        afterEach(() => {
            if (chatUI && !chatUI.isDestroyed) {
                chatUI.destroy();
            }
            if (host && host.parentElement) {
                document.body.removeChild(host);
            }
        });

        it('should add e-footer-focused on focus and remove it on blur', (done: DoneFn) => {
            chatUI = new ChatUI({});
            chatUI.appendTo(host);

            const footerElem: HTMLElement = host.querySelector('.e-footer');
            const textareaEle: HTMLDivElement = host.querySelector('.e-footer .e-chat-textarea');

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
            chatUI = new ChatUI({});
            chatUI.appendTo(host);

            const footerElem: HTMLElement = host.querySelector('.e-footer');
            expect(footerElem).not.toBeNull();

            // When footerTemplate is not provided, renderAssistViewFooter adds this class
            expect(footerElem.classList.contains('e-footer-focus-wave-effect')).toBe(true);
        });
    });
});
