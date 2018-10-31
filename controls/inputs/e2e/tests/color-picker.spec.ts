import { browser, element, By, protractor, } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/helper.spec';

let helper = new Helper();

/**
 * ColorPicker e2e testing.
 */
describe('ColorPicker', () => {
    if (browser.isDesktop) {
        browser.driver.manage().window().setSize(1000, 700);
    }
    it('SplitButton', () => {
        helper.load('/demos/color-picker/default/index.html');
        browser.compareScreen(element(By.id('colorpicker-sample')), 'colorpicker_splitbtn');
    })

    it('Popup opened state', () => {
        helper.buttonClick("//*[@id='e-split-btn_0_dropdownbtn']");
        helper.waitUntilPresent(By.className('e-cancel'));
        browser.compareScreen(element(By.tagName('BODY')), 'colorpicker_popup');
    })

    it('Format switching', () => {
        browser.actions().click(element(By.className('e-value-switch-btn'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'colorpicker_format');
    })

    it('Mode switching', () => {
        browser.actions().click(element(By.className('e-mode-switch-btn'))).perform();
        browser.sleep(4000);
        browser.compareScreen(element(By.tagName('BODY')), 'switch_to_palette');
        helper.buttonClick("//*[@id='e-split-btn_0_dropdownbtn']");
    })

    let theme = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i = 0; i < 3; i++) {
        theme_change(theme[i]);
    }

    function theme_change(theme: string) {
        it('Theme Switching - ' + theme, function () {
            helper.buttonClick("//*[@id='" + theme + "']");
            helper.sleep(6000);
            helper.buttonClick("//*[@id='e-split-btn_0_dropdownbtn']");
            helper.waitUntilPresent(By.className('e-cancel'));
            browser.compareScreen(element(By.tagName('BODY')), 'colopicker_' + theme);
        });
    }

    it('Inline', () => {
        helper.load('/demos/color-picker/flat/index.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'colorpicker_inline');
    })

    it('Palette Navigation', () => {
        helper.navigation('e-palette', protractor.Key.ARROW_DOWN);
        helper.navigation('e-palette', protractor.Key.ARROW_RIGHT);
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'palette_navigation');
    })

    it('Picker Navigation', () => {
        helper.navigation('e-handler', protractor.Key.ARROW_UP);
        helper.navigation('e-handler', protractor.Key.ARROW_LEFT);
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'picker_navigation');
    })

    it('Rtl support and Disabled state', () => {
        if (browser.isDesktop) {
            browser.driver.manage().window().setSize(1200, 700);
        }
        helper.load('/demos/color-picker/rtl_disabled/index.html');
        browser.sleep(3000);
        helper.buttonClick("//*[@id='e-split-btn_0_dropdownbtn']");
        helper.waitUntilPresent(By.className('e-cancel'));
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'colorpicker_rtl_disabled');
    })
})