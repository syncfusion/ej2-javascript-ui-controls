import { createElement, L10n } from "@syncfusion/ej2-base";
import { ChatUI,MessageModel, UserModel } from "../../src/chat-ui/index";

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
        },
        {
            id: 'msg4',
            text: 'I am good, thanks! How about you?',
            author: {
                user: 'Jane Smith',
                id: 'user2',
                avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic03.png',
                avatarBgColor: '#ccc',
                cssClass: 'customuserAvatar'
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
                id: 'user1'
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
                id: 'user1'
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
            const textareaElem: HTMLTextAreaElement = footerElem.querySelector('textarea');
            expect(textareaElem).not.toBeNull();
            expect(textareaElem.placeholder).toBe('Type your message…');
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

        it('Placeholder checking', (done: DoneFn) => {
            chatUI = new ChatUI({
                placeholder: 'Enter your message here'
            });
            chatUI.appendTo('#chatUI');
            expect(chatUIElem.classList.contains('e-chat-ui')).toBe(true);
            let textareaElem: HTMLTextAreaElement = chatUIElem.querySelector('.e-footer textarea');
            expect(textareaElem.placeholder).toBe('Enter your message here');
            chatUI.placeholder = 'Type your message here';
            chatUI.dataBind();
            setTimeout(() => {
                textareaElem = chatUIElem.querySelector('.e-footer textarea');
                expect(textareaElem.placeholder).toEqual('Type your message here');
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
                loadOnDemand: true
            });
            chatUI.appendTo('#chatUI');
            
            setTimeout(() => {
                const messageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                expect(messageItems.length).toBeLessThan(longMessageList.length);
                expect(messageItems.length).toBe(100);
    
                const messageWrapper: HTMLDivElement = chatUIElem.querySelector('.e-message-wrapper');
                messageWrapper.scrollTop = 0;
                messageWrapper.dispatchEvent(new Event('scroll'));
    
                setTimeout(() => {
                    const updatedMessageItems: NodeListOf<HTMLDivElement> = chatUIElem.querySelectorAll('.e-message-item');
                    expect(updatedMessageItems.length).toBeGreaterThan(messageItems.length);
                    done();
                }, 1500);
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
            const textareaElem: HTMLTextAreaElement = chatUIElem.querySelector('.e-footer textarea');
            const sendIcon: HTMLElement = chatUIElem.querySelector('.e-chat-send');
            expect(textareaElem).not.toBeNull();
            expect(sendIcon).not.toBeNull();
            expect(sendIcon.classList.contains('disabled')).toBe(true);
            (textareaElem as any).ej2_instances[0].value = 'Hello!';
            (textareaElem as any).ej2_instances[0].dataBind();
            const keyEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            (textareaElem as any).ej2_instances[0].inputHandler(keyEvent);
            keyEventArgs.key = 'Enter';
            (chatUI as any).keyHandler(keyEventArgs, 'footer');
            setTimeout(() => {
                    expect(sendIcon.classList.contains('disabled')).toEqual(true);
                    const messageItems: NodeListOf<HTMLElement> = chatUIElem.querySelectorAll('.e-message-item');
                    const lastMessage: HTMLElement = messageItems[messageItems.length - 1];
                    expect(lastMessage).not.toBeNull();
                    expect(lastMessage.querySelector('.e-text').textContent).toBe('Hello!');
                    const messageGroup: HTMLElement = lastMessage.closest('.e-message-group') as HTMLElement;
                    expect(messageGroup.classList.contains('e-right')).toBe(true);
                    expect(textareaElem.value).toBe('');
                    done();
            }, 100);
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
        afterEach(() => {
            if (chatUI && !chatUI.isDestroyed) {
                chatUI.destroy();
            }
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
});
