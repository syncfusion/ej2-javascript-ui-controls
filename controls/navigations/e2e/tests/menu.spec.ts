import { browser, element, By, ProtractorExpectedConditions, protractor } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/menu-helper.spec';

let EC: ProtractorExpectedConditions = browser.ExpectedConditions;

let helper: Helper = new Helper();

let cbox_inst: string = 'document.getElementById("touchMode").ej2_instances[0]';
function waitUntilPresent(ele: any, waitTime: number) {
    browser.wait(EC.presenceOf(element(ele)), waitTime);
}

function loadAndWait(url: string, ele: any, time: number = 2000) {
    browser.load(url);
    waitUntilPresent(ele, time);

}
function hover(ele: any): void {
    browser.actions().mouseMove(element(ele)).perform();
}

/**
 * Menu E2E testing
 */
describe('Menu', () => {
    it('Default', () => {
        loadAndWait('/demos/menu/default.html', helper.default_Menu, 4000);
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_default');
    });
    it('With submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_submenu');
    });
    it('With multilevel submenu open', () => {
        waitUntilPresent(By.id('technologies'), 500);
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
            browser.driver.sleep(1000);
            waitUntilPresent(By.id('login'), 1000);
            browser.compareScreen(element(By.id('menu-control')), 'menu_parent_' + theme);
        });
    }
});
describe('Menu with icons', () => {
    it('Default', () => {
        loadAndWait('/demos/menu/icons.html', helper.default_Menu, 4000);
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_icons');
    });
    it('in submenu', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_sub_menu_icons');
    });
    it('in multilevel submenu', () => {
        waitUntilPresent(By.id('technologies'), 500);
        hover(By.id('children'));
        waitUntilPresent(By.id('dreams'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_multi_level_icons');
    });
});
describe('Orientation', () => {
    it('Vertical orientation', () => {
        browser.load('/demos/menu/vertical.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_vertical');
    });
    it('Vertical orientation with submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_vertical_submenu');
    });
});

describe('RTL',() => {
    it('RTL layout', () => {
        browser.load('/demos/menu/rtl.html');
        browser.driver.sleep(1000);
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

describe('Bigger',() => {
    it('Main Menu',() => {
        browser.load('/demos/menu/default.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.actions().click(element(By.id('touchMode'))).perform();
        browser.compareScreen(element(By.id('menu-control')), 'menu_bigger');
    });
    it('Sub Menu',() => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_submenu_bigger');
    });
});
describe('Separator',() => {
    it('Main Menu', () => {
        browser.load('/demos/menu/separator.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_separator');
    });
    it('Sub menu', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        browser.compareScreen(element(By.id('menu-control')), 'menu_separator_submenu');
    });
});

describe('ShowItemOnClick', () => {
    it('On Parent Menu', () => {
        browser.load('/demos/menu/flat-datasource.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('Op4'), 1000);
        browser.actions().click(element(By.id('Op1'))).perform();
        browser.compareScreen(element(By.id('menu-control')), 'menu_click');
    });
});

/* describe('Disable', () => {
    it('Menu Item', () => {
        browser.driver.manage().window().maximize();
        browser.load('/demos/menu/disable.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('services'), 1000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_item_disable');
    });
    it('Sub menu item', () => {
        hover(By.id('events'));
        browser.compareScreen(element(By.id('menu-control')), 'sub_menu_item_disable');
    });
}); */

describe('RTL Orientation',() => {
    it('Vertical', () => {
        browser.load('/demos/menu/rtl-vertical.html');
        browser.driver.sleep(1000);
        waitUntilPresent(By.id('login'), 5000);
        browser.compareScreen(element(By.id('menu-control')), 'menu_rtl_vertical');
    });
    it('RTL vertical layout with submenu open', () => {
        hover(By.id('books'));
        waitUntilPresent(By.id('technologies'), 500);
        hover(By.id('technologies'));
        browser.compareScreen(element(By.id('menu-control')), 'menu_rtl_submenu_vertical');
    });
});