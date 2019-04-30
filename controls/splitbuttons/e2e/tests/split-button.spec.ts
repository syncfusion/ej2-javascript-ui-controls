import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/splitbuttons-helper.spec';
import { ActionSequence } from 'protractor';

let helper = new Helper();

describe('SplitButton', function () {

    it ('Default', () => {
        helper.loadAndWait('/demos/split-button/default/index.html', helper.last_splitbtn);
        browser.compareScreen(element(helper.default_splitbtn), 'split_btn_default');
    });

    it('Hover State', function () {
        helper.waitUntilPresent(helper.last_splitbtn);
        browser.actions().mouseMove(element(helper.splitbtn_icon)).perform().then(function () {
            helper.sleep(2000);
            browser.compareScreen(element(By.id('icon')), 'split_btn_primary_hover');
        });
        helper.sleep(2000);
        browser.actions().mouseMove(element(By.id('icontextbtn_dropdownbtn'))).perform().then(function () {
            helper.sleep(2000);
            browser.compareScreen(element(By.id('icon')), 'split_btn_secondary_hover');
        });
    });

    it('Popup', function () {
        helper.clickByXPath("//*[@id='icontextbtn_dropdownbtn']");
        helper.waitUntilPresent(By.id('e-dropdown-btn-item_4'), 6000);
        browser.compareScreen(element(helper.splitbtn_popup), 'split_btn_popup');
    });

    it('Popup Hover State', function () {
        browser.actions().mouseMove(element(By.id('e-dropdown-btn-item_0'))).perform().then(function () {
            helper.sleep(2000);
            browser.compareScreen(element(helper.splitbtn_popup), 'split_btn_popup_hover');
        });
    });

    it('RTL', function () {
        helper.clickByXPath("//*[@id='rtlbtn_dropdownbtn']");
        helper.waitUntilPresent(By.id('e-dropdown-btn-item_9'), 6000);
        helper.sleep(2000);
        browser.compareScreen(element(By.id('rtlbtn_dropdownbtn-popup')), 'split_btn_rtl_popup');
    });

    let theme_name: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (var i = 0; i < 3; i++) {
        theme_change(theme_name[i]);
    }

    function theme_change(theme: string) {
        it('Theme Switching', function () {
            helper.clickByXPath("//*[@id='" + theme + "']");
            helper.sleep(2000);
            browser.compareScreen(element(helper.default_splitbtn), 'split_btn_' + theme);
        });
    }

});