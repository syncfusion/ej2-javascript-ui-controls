import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from './Helper/splitbuttons-helper.spec';

let helper = new Helper();

describe('DropDownButton', function () {
    it('Default', () => {
        helper.loadAndWait('/demos/drop-down-button/default/index.html', helper.last_dropdownbtn);
        browser.compareScreen(element(helper.default_dropdownbtn), 'drp_down_btn_default');
    });

    it('Hover State', function () {
        helper.waitUntilPresent(helper.last_dropdownbtn);
        browser.actions().mouseMove(element(helper.dropdownbtn_icon)).perform().then(function () {
            helper.sleep(2000);
            browser.compareScreen(element(helper.dropdownbtn_icon), 'drp_down_btn_hover');
        });
    });

    it('Popup Opened State', function () {
        helper.clickByXPath("//*[@id='icon']");
        helper.waitUntilPresent(By.id('e-dropdown-btn-item_5'), 6000);
        browser.compareScreen(element(helper.dropdownbtn_icon), 'drp_down_btn_active');
    });

    it('Popup', function () {
        helper.sleep(2000);
        browser.compareScreen(element(helper.dropdownbtn_popup), 'drp_down_btn_popup');
    });

    it('Popup Hover State', function () {
        browser.actions().mouseMove(element(By.id('e-dropdown-btn-item_0'))).perform().then(function () {
            helper.sleep(2000);
            browser.compareScreen(element(helper.dropdownbtn_popup), 'drp_down_btn_popup_hover');
        });
    });

    it('RTL', function () {
        helper.clickByXPath("//*[@id='rtl']");
        helper.waitUntilPresent(By.id('e-dropdown-btn-item_11'), 6000);
        helper.sleep(2000);
        browser.compareScreen(element(By.id('rtl-popup')), 'drp_down_btn_rtl_popup');
    });

    let theme_name: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i = 0; i < 3; i++) {
        theme_change(theme_name[i]);
    }

    function theme_change(theme: string) {
        it('Theme Switching - ' + theme, function () {
            helper.clickByXPath("//*[@id='" + theme + "']");
            helper.sleep(2000);
            browser.compareScreen(element(helper.default_dropdownbtn), 'drop_down_btn_' + theme);
        });
    }

});