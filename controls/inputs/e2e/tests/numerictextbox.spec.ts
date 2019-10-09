import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
let themes: String[] = ["Fabric", "Bootstrap"];


if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1100, 800);
}
describe('NumericTextBox', function () {
    it('Standard formats', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/default.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Numeric');
        element(By.className('e-spin-up')).click().then(function () {
            browser.sleep(1000);
        });
        element(By.className('e-spin-up')).click().then(function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Numeric_Click');
        });
    });

    it('Standard formats - Focus in and click spin buttons', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/default-focus.html');
        browser.sleep(3000);
        browser.compareScreen(element(By.tagName('body')), 'Numeric_Focus');
        element(By.className('e-spin-up')).click();
        element(By.className('e-spin-up')).click().then(function () {
            browser.sleep(500);
            browser.compareScreen(element(By.tagName('body')), 'Numeric_FocusClick');
        });
    });

    it('Range validation', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/range.html');
        browser.sleep(1000);
        element(By.className('e-spin-down')).click();
        browser.sleep(1000);
        element(By.className('e-spin-down')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Range_Min');
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Range_Max');
    });

    it('Range validation with strictMode disabled', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/range-disabled.html');
        browser.sleep(1000);
        element(By.className('e-spin-down')).click();
        browser.sleep(1000);
        element(By.className('e-spin-down')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Range_MinDisabled');
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Range_MaxDisabled');
    });

    it('NumericTextBox with incremental step', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/step.html');
        browser.sleep(1000);
        element(By.className('e-spin-down')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Step_Decrement');
        browser.sleep(1000);
        element(By.className('e-spin-up')).click();
        browser.sleep(1000);

        element(By.className('e-spin-up')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Step_Increment');
    });

    it('Custom Formats', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/format.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Custom_Formats');
    });

    it('Internationalization', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/globalize.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('body')), 'Internationalization');
    });

    it('NumericTextBox - Form Validation', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/form-validation.html');
        browser.sleep(2500);
        browser.element(By.id('numeric')).sendKeys(protractor.Key.BACK_SPACE);
        browser.sleep(1000);
        browser.element(By.id('numeric')).sendKeys(protractor.Key.ENTER);
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('body')), 'NumForm_Validation');
    });
     it('Numerictextbox with clear Button', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/clearButton.html');
        browser.actions().click(element(By.id('numeric1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_spin');
        browser.actions().click(element(By.id('numeric2'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_notSpin');

        browser.load('/demos/numerictextbox/clearButtonPlaceHolder.html');
        browser.actions().click(element(By.id('numeric1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_spin_placeHolder');
        browser.actions().click(element(By.id('numeric2'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_notSpin_placeHolder');

        browser.load('/demos/numerictextbox/clearButtonRtl.html');
        browser.actions().click(element(By.id('numeric1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_spin_rtl');
        browser.actions().click(element(By.id('numeric2'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_clrBtn_notSpin_rtl');
    });
     it('Numerictextbox with touch mode', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(900, 1000);
        }
        browser.load('/demos/numerictextbox/touch.html');
        browser.actions().click(element(By.id('numeric'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_touch');
    })
    it('Numerictextbox with Clear button and no value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/clearButton-empty.html');
        browser.sleep(2000);
        element(By.id('numeric1')).click().then(function (){
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numericclear_focusin');
        element(By.tagName('BODY')).click().then(function () {
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numericclear_focusout');
    });
    it('Numerictextbox with Clear button and large value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/clearButton-largevalue.html');
        browser.sleep(2000);
        element(By.id('numeric1')).click().then(function (){
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numericclearvalue_focusin');
        element(By.tagName('BODY')).click().then(function () {
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numericclearvalue_focusout');
    });
    it('Disabled Numerictextbox', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/enabled.html');
        browser.sleep(2000);
        element(By.id('numeric')).click().then(function (){
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_disabled');
    });
    it('Numerictextbox placeholder without value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/placeholder.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_placeholder_novalue');
    });
    it('Numerictextbox placeholder with value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/placeholder-value.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_placeholder_value');
    });
    it('Numerictextbox with rtl enabled', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/rtl-value.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_rtl_value');
    });
    it('Numerictextbox with rtl enabled and no value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/rtl.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_rtl_novalue');
    });
    it('Numerictextbox without spin button', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/spinbutton-disabled.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_no_spin');
    });
    it('Numerictextbox formats', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/format.html');
        browser.sleep(2000);
        element(By.id('percent')).click().then(function (){
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_format_focusin');
        element(By.tagName('BODY')).click().then(function () {
            browser.sleep(1000);
        });
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_format_focusout');
    });
    it('Numerictextbox with locale api', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/locale.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_locale');
    });
    it('Numerictextbox floatlabeltype without value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/floatlabeltype.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_float_novalue');
    });
    it('Numerictextbox floatlabeltype with value', function () {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/numerictextbox/floatlabeltype-value.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Numeric_float_value');
    });
})

describe('NumericTextBox - Remianing themes', () => {
    for (let i = 0; i < themes.length; i++) {
        let fileName: string = '../../../styles/' + themes[i].toLowerCase() + '.css';
        let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','" + fileName + "')";
        it('NumericTextBox - ' + themes[i] + ' Default', function () {
            if (browser.isDesktop === true) {
                browser.driver.manage().window().setSize(900, 1000);
            }
            browser.load('/demos/numerictextbox/fabric.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_Default');
            browser.actions().mouseMove(element(By.className('e-spin-up'))).perform();
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_IconHover');
            browser.load('/demos/numerictextbox/fabric-focus.html');
            browser.sleep(2500);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_Focus');
            browser.load('/demos/numerictextbox/fabric-clearButton.html');
            browser.actions().click(element(By.id('numeric1'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_spin');
            browser.actions().click(element(By.id('numeric2'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_notSpin');
            browser.load('/demos/numerictextbox/fabric-clearButtonPlaceHolder.html');
            browser.actions().click(element(By.id('numeric1'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_spin_placeHolder');
            browser.actions().click(element(By.id('numeric2'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_notSpin_plholder');
            browser.load('/demos/numerictextbox/fabric-clearButtonRtl.html');
            browser.actions().click(element(By.id('numeric1'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_spin_rtl');
            browser.actions().click(element(By.id('numeric2'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_clrBtn_notSpin_rtl');
            browser.load('/demos/numerictextbox/touch.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('body')), 'Num' + themes[i] + '_touch');
        }, 1200000);
    }
})