import { browser, element, By, protractor, } from '@syncfusion/ej2-base/e2e/index';
let themes: String[] = ["Fabric", "Bootstrap"];

browser.driver.manage().window().setSize(1100, 800);
describe('Maskedtextbox with place holder', () => {
    it('maskedtextbox ', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/default.html');
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_default');

        browser.element(By.id('mask1')).sendKeys(protractor.Key.TAB);

        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_TAB');

        browser.actions().click(element(By.id('mask2'))).perform();
        browser.sleep(1500);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_auto');

        browser.actions().click(element(By.id('mask6'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_never');
    })

    it('Maskedtextbox with floatLabel', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/customcharacters.html');
        browser.actions().click(element(By.id('mask3'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatLabelType_always');
    })

    it('Maskedtextbox with rtl', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/rtl.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_rtl');

        browser.actions().click(element(By.id('mask4'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_rtl');

        browser.actions().click(element(By.id('mask2'))).perform();
        browser.sleep(2500);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_rtl_promprChar');
    })

    it('Maskedtextbox with filling and TAB', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/regularexpression.html');
        browser.element(By.id('mask1')).sendKeys('233 244 122 134');
        browser.sleep(1000);
        browser.element(By.id('mask2')).sendKeys('10 20');
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_regularexpression2');

    })
    it('Maskedtextbox with placeholder', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/placeholder.html');
        browser.sleep(2000);

        browser.actions().click(element(By.id('mask1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_always_value');

        browser.actions().click(element(By.id('mask2'))).perform();
        browser.sleep(2500);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_auto_empty');

        browser.actions().click(element(By.id('mask3'))).perform();
        browser.sleep(2500);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_floatlabeltype_never_value');
    })
    it('Maskedtextbox with clear icon values', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/clearButton-value.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_clearicon_focusout');
        browser.actions().click(element(By.id('mask1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_clearicon_focusin');
        
    })
    it('Maskedtextbox without clear icon', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/value.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_noclearicon_focusout');
        browser.actions().click(element(By.id('mask1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_noclearicon_focusin');
        
    })
    it('Maskedtextbox with width', () => {
        browser.load('/demos/maskedtextbox/width.html');
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_width');
    })
    it('Maskedtextbox with functionalities', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/disabled.html');
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_disabled');
        browser.load('/demos/maskedtextbox/customcharacters.html');
        browser.actions().click(element(By.id('mask2'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_promptChar');
    })
    it('Maskedtextbox with clear Icon button', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/clearButton.html');
        browser.actions().click(element(By.id('mask1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_clearbutton');
    })
     it('Maskedtextbox with touch mode', () => {
        if (browser.isDesktop === true) {
            browser.driver.manage().window().setSize(800, 500);
        }
        browser.load('/demos/maskedtextbox/touch.html');
        browser.actions().click(element(By.id('mask1'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'maskedit_touch');
    })
    
})
describe('Maskedtextbox with place holder - Remianing themes', () => {
    for (let i = 0; i < themes.length; i++) {
        let fileName: string = '../../../styles/' + themes[i].toLowerCase() + '.css';
        let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','" + fileName + "')";
        it('maskedtextbox with ' + themes[i], () => {
            if (browser.isDesktop === true) {
                browser.driver.manage().window().setSize(800, 500);
            }
            browser.load('/demos/maskedtextbox/fabric-default.html');
            browser.element(By.id('mask1')).sendKeys(protractor.Key.TAB);
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit_TAB');
            browser.load('/demos/maskedtextbox/fabric-default.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.element(By.id("mask3")).sendKeys(protractor.Key.ENTER);
            browser.sleep(1000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit-time');
            browser.load('/demos/maskedtextbox/fabric-rtl.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.element(By.id('mask1')).sendKeys(protractor.Key.TAB);
            browser.sleep(1000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit-phonenumber');
            browser.load('/demos/maskedtextbox/fabric-rtl.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.element(By.id('mask2')).sendKeys(protractor.Key.TAB);
            browser.sleep(1000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit-creditcardnumber');
            browser.load('/demos/maskedtextbox/fabric-clearButton.html');
            browser.actions().click(element(By.id('mask1'))).perform();
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit_clearButton');
            browser.load('/demos/maskedtextbox/touch.html');
            browser.sleep(2000);
            browser.executeScript(path);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), themes[i] + '-maskedit_touch');
        }, 1200000);
    }
})


