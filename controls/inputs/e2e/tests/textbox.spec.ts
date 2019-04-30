
import { browser, element, by } from "@syncfusion/ej2-base/e2e/index";

describe('TextBox -', function () {
    describe('Float label type', () => {
        it('Sample render with float never', function () {
            browser.load('/demos/textbox/float-label-type.html');
            browser.sleep(500);
            element(by.id('default')).sendKeys('text updated');
            browser.sleep(1000);
            browser.compareScreen(element(by.id('wrapper')), 'textbox_float_never');
        });
        it('Float auto ', () => {
            element(by.id('floatType')).sendKeys('Auto');
            browser.actions().mouseDown(element(by.id('floatType'))).mouseUp(element(by.id('floatType'))).perform().then(() => {
                browser.sleep(1000);
                element(by.id('default')).click();
                browser.compareScreen(element(by.id('wrapper')), 'textbox_float_auto_changed');
            });
        });
        it('Float always ', () => {
            browser.load('/demos/textbox/float-label-type.html');
            element(by.id('floatType')).sendKeys('Always');
            browser.actions().mouseDown(element(by.id('floatType'))).mouseUp(element(by.id('floatType'))).perform().then(() => {
                browser.sleep(1000);
                element(by.tagName('BODY')).click();
                browser.compareScreen(element(by.id('wrapper')), 'textbox_float_always_changed');
            });
        });
    });
    describe('Locale testing', () => {
        it('Initial locale', () => {
            browser.load('/demos/textbox/locale.html');
            browser.sleep(500);
            browser.compareScreen(element(by.id('wrapper')), 'textbox_locale');
        });
        it('locale changed dynamically ', () => {
            browser.load('/demos/textbox/locale.html');
            browser.actions().click(element(by.id('btn'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(by.id('wrapper')), 'textbox_locale_changed');
        });
    });
    describe('Clear icon testing', () => {
        browser.load('/demos/textbox/show-icon.html');
        it('Sample rendered', () => {
            browser.sleep(500);
            browser.compareScreen(element(by.id('wrapper')), 'textbox_without_clearIcon');
        });
        it('Enabled clear icon ', () => {
            element(by.id('default')).sendKeys('Syncfusion');
            browser.actions().mouseDown(element(by.id('default'))).mouseUp(element(by.id('default'))).perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(by.id('wrapper')), 'textbox_clear_icon');
            });
        });
    });
    describe('Feature matrix testing', () => {
        it('enable rtl', () => {
            browser.load('/demos/textbox/feature-matrix.html');
            browser.actions().click(element(by.id('rtl'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(by.className('fm_textbox')), 'textbox_rtl');
        });
        it('rtl with floating', () => {
            browser.actions().mouseDown(element(by.id('textbox'))).mouseUp(element(by.id('textbox'))).perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_rtl_floating');
            });            
        });
        it('disable rtl', () => {
            browser.actions().click(element(by.id('rtl'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(by.className('fm_textbox')), 'textbox_rtl_removed');
        });
        it('disabled the textbox', () => {
            browser.actions().click(element(by.id('enabled'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(by.className('fm_textbox')), 'textbox_disable_without_text');
        });
        it('disabled the textbox with rtl', () => {
            browser.actions().click(element(by.id('rtl'))).perform();
            browser.sleep(500);
            browser.compareScreen(element(by.className('fm_textbox')), 'textbox_disable_rtl_without_text');
        });
        it('disabled the textbox with value', () => {
            browser.actions().click(element(by.id('rtl'))).perform();
            browser.actions().click(element(by.id('enabled'))).perform();
            browser.sleep(500);
            element(by.id('textbox')).sendKeys('Syncfusion');
            browser.actions().mouseDown(element(by.id('textbox'))).mouseUp(element(by.id('textbox'))).perform().then(() => {
                browser.sleep(500);
                browser.actions().click(element(by.id('enabled'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_disable_value');
                browser.actions().click(element(by.id('rtl'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_disable_rtl_value');
                browser.sleep(500);
                browser.actions().click(element(by.id('rtl'))).perform();
                browser.actions().click(element(by.id('enabled'))).perform();
            });
        });
        it('update placeholder dynamically ', () => {
            element(by.id('placeholder')).sendKeys('new placeholder text');
            browser.actions().mouseDown(element(by.id('placeholder'))).mouseUp(element(by.id('placeholder'))).perform().then(() => {
                browser.sleep(500);
                browser.actions().click(element(by.id('dummy'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_placeholder_update');
            })
        })
        it('update value dynamically ', () => {
            element(by.id('value')).sendKeys('value updated');
            browser.actions().mouseDown(element(by.id('value'))).mouseUp(element(by.id('value'))).perform().then(() => {
                browser.sleep(500);
                browser.actions().click(element(by.id('dummy'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_value_update');
            })
        })
        it('update type dynamically ', () => {
            element(by.id('type')).sendKeys('number');
            browser.actions().mouseDown(element(by.id('type'))).mouseUp(element(by.id('type'))).perform().then(() => {
                browser.sleep(500);
                browser.actions().click(element(by.id('dummy'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_type_update');
            })
        })
        describe('Methods testing', () => {
            it('Add attributes ', () => {
                browser.load('/demos/textbox/feature-matrix.html');
                browser.actions().click(element(by.id('addAttr'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_add_attirbutes_disable');
            });
            it('Remove attributes ', () => {
                browser.actions().click(element(by.id('removeAttr'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_remove_attirbutes_disable');
            });
            it('Destroy ', () => {
                browser.actions().click(element(by.id('destroy'))).perform();
                browser.sleep(500);
                browser.compareScreen(element(by.className('fm_textbox')), 'textbox_destroy');
            });
        });
    });
});
