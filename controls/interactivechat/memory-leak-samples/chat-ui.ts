import { ChatUI, MessageModel, MessageSendEventArgs, UserModel, TypingEventArgs,MessageToolbarItemClickedEventArgs } from '../src/chat-ui/index';
import { ToolbarItemClickedEventArgs, ToolbarSettingsModel } from '../src/interactive-chat-base/index';
let chatUI: ChatUI;
let Default: UserModel = {
    user: 'Andrew',
    id: 'default-user',
    avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic01.png'
};
let message: MessageModel[] = [
    {
        id: 'msg1',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'Hi',
        timeStamp: new Date("October 13, 2024 11:13:00"),
        status: {
            iconCss: 'e-icons e-chat-seen',
            tooltip: 'seen',
            text: 'seen'
        },
    },
    {
        id: 'msg2',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'How are you?',
        timeStamp: new Date("October 14, 2024 11:14:00"),
        status: {
            iconCss: 'e-icons e-chat-seen',
            tooltip: 'seen',
            text: 'seen'
        },
    },
    {
        id: 'msg3',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic00.png',
            avatarBgColor: '#ccc',
            cssClass: 'customuserAvatar'
        },
        text: 'Hello!',
        timeStamp: new Date("October 15, 2024 11:14:00")
    },
    {
        id: 'msg4',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic00.png',
            avatarBgColor: '#ccc',
            cssClass: 'customuserAvatar'
        },
        text: 'I am good, thanks! How about you?',
        timeStamp: new Date("October 15, 2024 11:15:00")
    },
    {
        id: 'msg5',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'I am doing well too, thank you!',
        timeStamp: new Date("October 15, 2024 11:15:00"),
        status: {
            iconCss: 'e-icons e-chat-seen',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg6',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'What have you been up to lately?',
        timeStamp: new Date("October 15, 2024 11:15:00"),
        status: {
            iconCss: 'e-icons e-chat-seen',
            tooltip: 'seen',
            text: 'seen'
        },
    },
    {
        id: 'msg7',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarUrl: 'https://ej2.syncfusion.com/demos/src/avatar/images/pic00.png',
            avatarBgColor: '#ccc',
            cssClass: 'customuserAvatar'
        },
        text: 'Not much, just working on some new projects.',
        timeStamp: new Date("October 15, 2024 11:15:00")
    },
    {
        id: 'msg8',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'How about you? Any interesting work?',
        timeStamp: new Date("October 15, 2024 11:16:00")
    },
    {
        id: 'msg9',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'Yes, I have been busy with some new developments.',
        timeStamp: new Date("October 15, 2024 11:16:00"),
        status: {
            iconCss: 'e-icons e-chat-check',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg10',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'There are a lot of exciting things coming up!',
        timeStamp: new Date("October 16, 2024 11:16:00"),
        status: {
            iconCss: 'e-icons e-chat-check',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg11',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'That sounds awesome! Looking forward to hearing more about it.',
        timeStamp: new Date("October 16, 2024 11:16:00"),
    },
    {
        id: 'msg12',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'Definitely! I will keep you updated.',
        timeStamp: new Date("October 17, 2024 11:16:00"),
        status: {
            iconCss: 'e-icons e-chat-check',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg13',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'By the way, have you seen the latest tech news?',
        timeStamp: new Date("October 17, 2024 11:16:00"),
    },
    {
        id: 'msg14',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'Yes, it is quite interesting!',
        timeStamp: new Date("October 17, 2024 11:16:00"),
        status: {
            iconCss: 'e-icons e-chat-check',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg15',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'There are some game-changing innovations happening right now.',
        timeStamp: new Date("October 18, 2024 11:16:00"),
        status: {
            iconCss: 'e-icons e-chat-check',
            tooltip: 'sent',
            text: 'sent'
        },
    },
    {
        id: 'msg16',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'Absolutely, it’s amazing how fast the tech world evolves.',
        timeStamp: new Date("October 18, 2024 11:16:00"),
    },
    {
        id: 'msg17',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'It’s sometimes hard to keep up with everything!',
        timeStamp: new Date("October 18, 2024 11:16:00"),
    },
    {
        id: 'msg18',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'I know, right?',
        timeStamp: new Date("October 18, 2024 12:30:00"),
        status: {
            iconCss: 'e-icons e-chat-seen',
            tooltip: 'seen',
            text: 'seen'
        },
    },
    {
        id: 'msg19',
        author: {
            user: 'Andrew',
            id: 'default-user'
        },
        text: 'But that’s what makes it so exciting to be a part of.',
        timeStamp: new Date("October 19, 2024 12:30:00"),
        status: {
            iconCss: 'e-icons e-chat-error',
            tooltip: 'Not Delivered',
            text: 'Not Delivered'
        },
        timeStampFormat: 'dd/MM/yyyy'
    },
    {
        id: 'msg20',
        author: {
            user: 'Reena',
            id: 'custom-user',
            avatarBgColor: '#ccc',
        },
        text: 'Indeed. Let’s catch up again soon!',
        timeStamp: new Date("October 19, 2024 12:30:00"),
        timeStampFormat: 'dd/MM/yyyy'
    }
];
let chatToolbarSettings: ToolbarSettingsModel = {
    itemClicked: function (args: ToolbarItemClickedEventArgs) {
    },
    items: [ { iconCss: 'e-icons e-menu', align: 'Right' } ],
};
document.getElementById('render').addEventListener('click', renderchatUI);
document.getElementById('destroy').addEventListener('click', destorychatUI);

function renderchatUI(): void {
    chatUI = new ChatUI({
        headerText: 'Andrew',
        headerIconCss: "creater-avatar1",
        user: Default,
        width: '380px',
        headerToolbar: chatToolbarSettings,
        messages: message,
        showTimeBreak: true,
        timeStampFormat: 'dd/MM/yyyy hh:mm a',
        messageToolbarSettings: {
            items: [
                { type: 'Button', iconCss: 'e-icons e-chat-forward', tooltip: 'Forward' },
                { type: 'Button', iconCss: 'e-icons e-chat-copy', tooltip: 'Copy' },
                { type: 'Button', iconCss: 'e-icons e-chat-reply', tooltip: 'Reply' },
                { type: 'Button', iconCss: 'e-icons e-chat-pin', tooltip: 'Pin' },
                { type: 'Button', iconCss: 'e-icons e-chat-trash', tooltip: 'Delete' }
            ],
            itemClicked: function (args: MessageToolbarItemClickedEventArgs) {
                if (args.item.prefixIcon === 'e-icons e-chat-forward') {
                    const newMessageObj:MessageModel = args.message;
                    newMessageObj.isForwarded = true;
                    chatUI.addMessage(newMessageObj);
                }
            }
        }
    });
    chatUI.appendTo('#chat1');
}
function destorychatUI(): void {
    if (chatUI && !chatUI.isDestroyed) {
        chatUI.destroy();
    }
}
