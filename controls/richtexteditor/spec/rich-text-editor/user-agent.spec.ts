import { Browser } from "@syncfusion/ej2-base";
import { RichTextEditor } from "../../src";
import { renderRTE, destroy } from "./render.spec";
import { CustomUserAgentData } from "../../src/common/user-agent";

export const WINDOWS_USER_AGENT = {
    CHROME: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    FIREFOX: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
    EDGE: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'
}

export const MACOS_USER_AGENT = {
    CHROME: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    SAFARI: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15',
    FIREFOX: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0',
}

export const LINUX_USER_AGENT = {
    CHROME: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    FIREFOX: 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
    EDGE: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'
}

export const MOBILE_USER_AGENT = {
    IPAD: {
        SAFARI: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        CHROME: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1'
    },
    IPHONE: {
        SAFARI: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        CHROME: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1'
    },
    ANDROID: {
        CHROME: 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 Mobile Safari/537.36',
        FIREFOX: 'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0',
        SAMSUNG: 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/21.0 Chrome/110.0.5481.154 Mobile Safari/537.36'
    }
}

describe('User Agent testing', () => {
    describe('Windows Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = WINDOWS_USER_AGENT.CHROME
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Google Chrome.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Chrome');
            expect(editor.userAgentData.getPlatform()).toBe('Windows');
        });
    });
    describe('Windows Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = WINDOWS_USER_AGENT.FIREFOX
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Firefox.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Firefox');
            expect(editor.userAgentData.getPlatform()).toBe('Windows');
        });
    });
    describe('Windows Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = WINDOWS_USER_AGENT.EDGE
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Microsoft Edge.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Edge');
            expect(editor.userAgentData.getPlatform()).toBe('Windows');
        });
    });

    describe('MACOS Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MACOS_USER_AGENT.CHROME
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Google Chrome.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Chrome');
            expect(editor.userAgentData.getPlatform()).toBe('macOS');
        });
    });
    describe('MACOS Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MACOS_USER_AGENT.FIREFOX
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Firefox.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Firefox');
            expect(editor.userAgentData.getPlatform()).toBe('macOS');
        });
    });
    describe('MACOS Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MACOS_USER_AGENT.SAFARI
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Safari.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Safari');
            expect(editor.userAgentData.getPlatform()).toBe('macOS');
            expect(editor.userAgentData.isSafari()).toBe(true);
        });
    });

    describe('Linux Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = LINUX_USER_AGENT.CHROME
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Google Chrome.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Chrome');
            expect(editor.userAgentData.getPlatform()).toBe('Linux');
        });
    });
    describe('Linux Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = LINUX_USER_AGENT.FIREFOX
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Firefox.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Firefox');
            expect(editor.userAgentData.getPlatform()).toBe('Linux');
        });
    });
    describe('Linux Platform', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = LINUX_USER_AGENT.EDGE
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Edge.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Edge');
            expect(editor.userAgentData.getPlatform()).toBe('Linux');
        });
    });

    describe('IOS - Ipad Device', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MOBILE_USER_AGENT.IPAD.SAFARI;
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Safari.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Safari');
            expect(editor.userAgentData.getPlatform()).toBe('iOS');
            expect(editor.userAgentData.isMobileDevice()).toBe(true);
        });
    });

    describe('IOS - Iphone Device', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MOBILE_USER_AGENT.IPAD.SAFARI;
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Chrome.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Safari');
            expect(editor.userAgentData.getPlatform()).toBe('iOS');
            expect(editor.userAgentData.isMobileDevice()).toBe(true);
        });
    });

    describe('Android Device', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = MOBILE_USER_AGENT.ANDROID.CHROME;
            editor = renderRTE({});
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Chrome.', () => {
            expect(editor.userAgentData.getBrowser()).toBe('Chrome');
            expect(editor.userAgentData.getPlatform()).toBe('Android');
            expect(editor.userAgentData.isMobileDevice()).toBe(true);
        });
    });

    describe('Windows Platform False Testing', () => {
        let editor: RichTextEditor;
        const defaultUA = Browser.userAgent;
        beforeAll(() => {
            Browser.userAgent = WINDOWS_USER_AGENT.CHROME
            editor = renderRTE({});
            (editor as any).userAgentData = new CustomUserAgentData(Browser.userAgent, false);
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });
        it('Testing Google Chrome.', () => {
            const isLocal: boolean = (navigator as any).userAgentData.platform === 'Windows';
            expect(editor.userAgentData.getBrowser()).toBe('Chrome');
            expect(editor.userAgentData.isMobileDevice()).toBe(false);
            if (isLocal) {
                expect(editor.userAgentData.getPlatform()).toBe('Windows');
            } else {
                expect(editor.userAgentData.getPlatform()).toBe('Linux');
            }
        });
    });
});
