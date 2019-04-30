import { browser, element, By, ProtractorExpectedConditions } from '@syncfusion/ej2-base/e2e/index';
let EC: ProtractorExpectedConditions = browser.ExpectedConditions;

function waitUntilPresent(ele: any, waitTime: number) {
    browser.wait(EC.presenceOf(element(ele)), waitTime);
}

function hover(ele: any): void {
    browser.actions().mouseMove(element(ele)).perform();
}

/**
 * Menu E2E testing
 */
describe('Menu', () => {
    it('Default', () => {
        browser.load('/demos/menu/default.html');
        browser.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_default');
    });
    it('With submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_submenu');
    });
    it('With multilevel submenu open', () => {
        hover(By.id('children'));
        waitUntilPresent(By.id('dreams'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_multilevel_submenu');
    });

    let theme = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i = 0, len = theme.length; i < len; i++) {
        theme_change(theme[i]);
    }

    function theme_change(theme: string) {
        it('- ' + theme, function () {
            element(By.id(theme)).click();
            waitUntilPresent(By.id('login'), 1000);
            browser.compareScreen(element(By.id('menu-control')), 'menu_' + theme);
        });
    }

    it('Vertical orientation', () => {
        browser.load('/demos/menu/vertical.html');
        browser.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_vertical');
    });
    it('Vertical orientation with submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_vertical_submenu');
    });
    it('RTL layout', () => {
        browser.load('/demos/menu/rtl.html');
        browser.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_rtl');
    });
    it('RTL layout with submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        hover(By.id('technologies'));
        waitUntilPresent(By.id('upcome'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_rtl_submenu');
    });
});
