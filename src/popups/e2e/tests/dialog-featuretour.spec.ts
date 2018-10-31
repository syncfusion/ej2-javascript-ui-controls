
import { browser, element, By,by, protractor } from '@syncfusion/ej2-base/e2e/index';

describe('Feature tour', () => {
    it ('default dialog sample testing', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/default-dialog/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('modalDialog')), 'feature_tour_default_sample');
        browser.actions().click(element(By.className('e-primary'))).perform().then(function(){
            browser.sleep(2000);
            browser.actions().click(element(By.id('dialogBtn'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('modalDialog')), 'feature_tour_default_sample_show');
            })
        });
    });

    it ('template sample testing', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/template/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('dialog')), 'feature_tour_template_sample');
    });

    it ('Built in button sample testing', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/button-dialog/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('confirmDialog')), 'feature_tour_builtin_btns');
    });

    it ('Model dialog testing', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/model-dialog/');
        browser.sleep(1000);
        browser.compareScreen(element(By.className('e-dlg-container')), 'feature_tour_model_dlg');
    });

    it ('Multiple dialog testing', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/multiple-dialog/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'feature_tour_multiple_dlgs');
        browser.sleep(1000);
        browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ENTER);
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'feature_tour_close_2nd_dialog');
        browser.actions().click(element(By.className('e-flat'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('container')), 'feature_tour_multiple_dlgs_2');
        })
    });

    it ('Loading AJAX content', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/ajax/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'feature_tour_ajax_content_initial');
        browser.sleep(1000);
        browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
        browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ENTER);
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'feature_tour_ajax_content_loaded');
    });

    it ('RTL mode', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/rtl-dialog-01/');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('confirmDialog')), 'feature_tour_rtl_mode');
    });

    it ('Dialog with custom position with target as container', () => {
        browser.get('https://ej2.syncfusion.com/products/typescript/dialog/position-dialog/').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_left_top'); 
        });

        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_centerTop');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_rightTop');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_Left_center');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_center_center');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_right_center');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_left_bottom');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_center_bottom');
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'feature_tour_right_bottom');
        })
    })
})


