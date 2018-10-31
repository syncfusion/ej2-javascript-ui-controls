
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";


describe('TextBox Feature Tour - ', function () {
    it('Default ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/default-01/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_default');
    });
    it('Grouping ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/grouping/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_grouping');
    });
    it('Float-label ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/floating-label/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_floating');
    });
    it('TextBox Size ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/size/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_size');
    });
    it('Validation ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/validation/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_validation');
    });
    it('Multiline ', function() {
        browser.get('https://ej2.syncfusion.com/products/typescript/textbox/multiline/');
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'input_ft_multiline');
    });
});