import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Switch', () => {
    beforeEach(() => {
        if (browser.isDesktop) {
            browser.driver.manage().window().setSize(1100, 800);
        }
    })
    it('Basic', () => {
        browser.load('/demos/switch/default/index.html');
        browser.compareScreen(element(By.id('basic')), 'Switch_basic');
    });

    let themeName: string[] = ['highcontrast', 'fabric', 'bootstrap'];

    for (let i: number = 0; i < themeName.length; i++) {
        let theme: string = themeName[i];
        it('Theme Switching - ' + theme, () => {
            //Skipped bootstrap theme in IE due to random failure
            if (browser.browserName !== 'internet explorer' || theme !== 'bootstrap') {
                browser.executeScript('document.getElementById("' + theme + '").click()');
                browser.driver.sleep(2000);
                let switchElem = browser.element({ id: 'switch1' });
                browser.actions().mouseMove(switchElem).perform().then(() => {
                    browser.driver.sleep(1000);
                    browser.compareScreen(element(By.id('basic')), 'Switch_' + theme);
                });
            }
        });
    }

    it('RTL', () => {
        browser.load('/demos/switch/rtl/index.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('rtl')), 'Switch_rtl');
    });

    it('Size', () => {
        browser.load('/demos/switch/size/index.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('size')), 'Switch_size');
    });

    it('State', () => {
        browser.load('/demos/switch/state/index.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('state')), 'Switch_state');
    });
});
