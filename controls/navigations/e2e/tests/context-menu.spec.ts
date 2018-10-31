import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/context-menu-helper.spec';

let helper = new Helper();

describe('Context Menu', () => {
    let sub_target: string = 'ul[id=contextmenu] li:nth-child(2)';
    let browserName: string;
    browser.getCapabilities().then(function (cap) {
        browserName = cap.get('browserName');
    });

    it('Default', () => {
        browser.load('/demos/context-menu/test.html');
        helper.waitUntilPresent(By.className('e-menu-caret-icon'));
        helper.rightClick(browserName);
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_default');
    });

    it('Sub Menu Open on Hover', () => {
        helper.hover(sub_target);
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_submenu_hover');
    });

    it('Sub Menu Open on Click', (done) => {
        setTimeout(() => {
            helper.click('#editor');
            browser.executeScript(helper.cm_inst + '.showItemOnClick = true');
            helper.rightClick(browserName);
            helper.click(sub_target);
            browser.compareScreen(browser.element(helper.snap_area), 'cmenu_submenu_click');
            browser.executeScript(helper.cm_inst + '.showItemOnClick = false');
            done();
        }, 6000);
    });

    it('Remove Item', () => {
        browser.executeScript(helper.cm_inst + '.removeItems(["Remove"])');
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_remove_item');
    });

    it('Disabled Items', () => {
        browser.executeScript(helper.cm_inst + '.enableItems(["Copy","Facebook"], false)');
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_disabled_item');
    });

    let themeNames: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i: number = 0; i < 3; i++) {
        theme_change(themeNames[i]);
    }

    function theme_change(theme: string) {
        it('Theme Switching - ' + theme, (done) => {
            setTimeout(() => {
                browser.executeScript('document.getElementById("' + theme + '").click()');
                browser.sleep(2000);
                helper.rightClick(browserName);
                helper.hover(sub_target);
                browser.compareScreen(element(helper.snap_area), 'cmenu_' + theme);
                done();
            }, 6000);
        });
    }

    it('RTL', () => {
        helper.click('#material');
        browser.executeScript(helper.cm_inst + '.enableRtl=true');
        helper.rightClick(browserName);
        helper.sleep(1000);
        helper.hover(sub_target);
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_rtl');
    });

    it('Icons and Url navigation', () => {
        //By clicking the Preview item, it will navigate to specified url where the image is given
        helper.click('ul[id=contextmenu] li:nth-child(1) .e-menu-url');
        helper.sleep(3000);
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_navigate_to');
    });

    it('Template', () => {
        browser.load('/demos/context-menu/template.html');
        helper.waitUntilPresent(By.className('e-contextmenu'));
        helper.rightClick(browserName);
        browser.compareScreen(browser.element(helper.snap_area), 'cmenu_template');
    });
});
