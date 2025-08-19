import { Tab } from '../../src/tab/index';

document.getElementById('render').addEventListener('click', renderTab);
document.getElementById('destroy').addEventListener('click', destoryTab);

let tabObj: Tab;

function renderTab(): void {
    tabObj = new Tab({
        items: [
            {
                header: { 'text': 'Twitter' },
                content: 'Twitter is an online social networking service that enables users to send and read short 140-character ' +
                    'messages called "tweets". Registered users can read and post tweets, but those who are unregistered can only read ' +
                    'them. Users access Twitter through the website interface, SMS or mobile device app Twitter Inc. is based in San ' +
                    'Francisco and has more than 25 offices around the world. Twitter was created in March 2006 by Jack Dorsey, ' +
                    'Evan Williams, Biz Stone, and Noah Glass and launched in July 2006. The service rapidly gained worldwide popularity, ' +
                    'with more than 100 million users posting 340 million tweets a day in 2012.The service also handled 1.6 billion ' +
                    'search queries per day.'
            },
            {
                header: { 'text': 'Facebook' },
                content: 'Facebook is an online social networking service headquartered in Menlo Park, California. Its website was ' +
                    'launched on February 4, 2004, by Mark Zuckerberg with his Harvard College roommates and fellow students Eduardo ' +
                    'Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes.The founders had initially limited the website\'\s ' +
                    'membership to Harvard students, but later expanded it to colleges in the Boston area, the Ivy League, and Stanford ' +
                    'University. It gradually added support for students at various other universities and later to high-school students.'
            },
            {
                header: { 'text': 'WhatsApp' },
                content: 'WhatsApp Messenger is a proprietary cross-platform instant messaging client for smartphones that operates ' +
                    'under a subscription business model. It uses the Internet to send text messages, images, video, user location and ' +
                    'audio media messages to other users using standard cellular mobile numbers. As of February 2016, WhatsApp had a user ' +
                    'base of up to one billion,[10] making it the most globally popular messaging application. WhatsApp Inc., based in ' +
                    'Mountain View, California, was acquired by Facebook Inc. on February 19, 2014, for approximately US* 9.3 billion.'
            }
        ]
    });
    tabObj.appendTo('#tab');
}

function destoryTab(): void {
    if (tabObj) {
        tabObj.destroy();
        tabObj = null;
    }
}
