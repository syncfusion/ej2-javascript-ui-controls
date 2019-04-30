/**
 * 
 */
import { browser, element, By, protractor, WebElement, by } from '@syncfusion/ej2-base/e2e/index';
import { ElementFinder } from "protractor/built/element";
import { throwError } from '@syncfusion/ej2-base';
let EC = browser.ExpectedConditions;

describe('listbox', () => {
    browser.manage().window().setPosition(0, 0);
    let browserName: string;

    //Rendering list box
    it('Default', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/default.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Rendering');
    });
    //checking for themes
    let theme_name: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (var i = 0; i < 3; i++) {
        theme_change(theme_name[i]);
    }

    function theme_change(theme: string) {
        it('Theme Switching', function () {
            browser.element(by.xpath("//*[@id='" + theme + "']")).click();
            browser.driver.sleep(1000);
            browser.compareScreen(element(by.className('e-listbox-wrapper')), 'Listbox' + theme);
        });
    }
    //clicking the items
    it('Default Multiple item click', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/default.html');
        browser.driver.sleep(1000);
        browser.element(by.id("highcontrast")).click();
        browser.driver.sleep(1000);
        browser.element(by.xpath('//li[@data-value="Bugatti Chiron"]')).click();
        var multi1 = element(by.xpath("//li[@data-value='Aston Martin One- 77']"));
        browser.actions().mouseMove(multi1).keyDown(protractor.Key.SHIFT).click().keyUp(protractor.Key.SHIFT).perform();
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Multiselect_Highcontrast');
        browser.element(by.id("bootstrap")).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Multiselect_Bootstrap');
        browser.element(by.id("fabric")).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Multiselect_Fabric');
        browser.element(by.id("material")).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Multiselect_Material');

    });
    //grouping sample
    it('Grouping', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/grouping.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Grouping');
    });

    //grouping sample
    it('Sorting', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/sorting.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Sorting_Ascending');
        browser.compareScreen(element(By.className('e-dd-group e-listbox-wrapper')), 'Listbox_Group_Sorting_Ascending');
        browser.element(by.id("btn")).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Sorting_Descending');
        browser.element(by.id("btn2")).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-dd-group e-listbox-wrapper')), 'Listbox_Group_Sorting_Descending');
    });

    //Template sample
    it('Template', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/template.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.className('e-listbox-wrapper')), 'Listbox_Grouping');
    });

    //Drag and drop

    it('Drag and Drop', () => {
        browserName = browser.browserName;
        browser.load('/demos/list-box/drag-and-drop.html');
        browser.driver.sleep(1000);

        browser.element(by.xpath('//li[@data-value="Bugatti Chiron"]')).click();
        var drag = element(by.id("list-03"));
        var drop = element(by.id("list-08"));
        browser.actions().mouseDown(drag).perform();
        browser.actions().mouseMove({ x: 9, y: 261 }).perform();
        browser.actions().mouseMove(drop).perform();
        browser.actions().mouseUp(drop).perform();
        browser.actions().dragAndDrop(drag, drop).perform()
        browser.actions().mouseDown(drag).perform();
        browser.driver.sleep(5000);
        browser.actions().mouseMove({ x: 409, y: 9 }).perform();
        browser.driver.sleep(5000);
        browser.actions().mouseMove(drag).perform();
        browser.driver.sleep(5000);
        browser.actions().mouseUp(drop).perform();
        browser.driver.sleep(1000);
        browser.compareScreen(element(by.id("sortable_0")), 'Listbox_DragDrop');
    });
});