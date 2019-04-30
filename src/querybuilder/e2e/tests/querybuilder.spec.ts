import { browser, element, By, by } from '@syncfusion/ej2-base/e2e/index';
import { PdfBorderOverlapStyle } from '@syncfusion/ej2-pdf-export';
import { throwError } from '@syncfusion/ej2-base';
import { Driver } from 'selenium-webdriver/edge';

/**
 * Query Builder E2E test cases
 */
describe('Querybuilder', () => {
    browser.manage().window().setPosition(0, 0);
    let browserName: string;
    it('Basic', () => {
        browserName = browser.browserName;
        browser.load('/demos/query-builder/default/index.html');
        browser.driver.sleep(3000);
        browser.compareScreen(element(By.id('querybuilder')), 'Querybuilder_rendering');
    });
    let themeName: string[] = ['fabric', 'bootstrap', 'highcontrast', 'material'];
    for (let i: number = 0; i < themeName.length; i++) {
        let theme: string = themeName[i];
        it('Theme Switching - ' + theme, () => {
            if (!(browserName === 'internet explorer' && name === 'default')) {
                browser.executeScript('document.getElementById("' + theme + '").click()');
                browser.driver.sleep(2000);
                browser.compareScreen(element(By.id('querybuilder')), 'QueryBuilder_' + theme);
            }
        });
    }

    it('Column Sample', () => {
        browser.load('/demos/query-builder/columns/index.html');
        browser.driver.sleep(3000);
        browser.compareScreen(element(By.id('querybuilder')), 'Column_Sample');
    });

    it('DataManager Sample', () => {
        browser.load('/demos/query-builder/datamanager/index.html');
        browser.driver.sleep(2000);
        //set rules
        browser.executeScript('document.getElementById("setrules").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'setrules');
        // reset
        browser.executeScript('document.getElementById("reset").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'reset');
        //add rule
        browser.executeScript('document.getElementById("addrules").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'addrules');
        //add groups
        browser.executeScript('document.getElementById("addgroups").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'addgroups');
        //get rules
        browser.executeScript('document.getElementById("getrules").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('modalDialog')), 'getrules');
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//*[@class="e-control e-btn e-lib e-primary e-flat"]')).click();
        browser.driver.sleep(1000);
        //delete rules
        browser.executeScript('document.getElementById("deleterule").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'deleterule');
        //delete group
        browser.executeScript('document.getElementById("deletegroup").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'deletegroup');

        // Columnmode
        browser.executeScript('document.getElementById("setrules").click()');
        browser.executeScript('document.getElementById("columnmode").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('querybuilder')), 'columnmode');
        browser.executeScript('document.getElementById("reset").click()');
    });

    it('Grid Sample', () => {
        browser.load('/demos/query-builder/grid/index.html');
        browser.driver.sleep(3000);
        browser.compareScreen(element(By.id('querybuilder')), 'grid_sample');
        browser.executeScript('document.getElementById("apply").click()');
        browser.driver.sleep(2000);
        browser.compareScreen(element(By.id('Grid')), 'Grid');
    });

    it('import Sample', () => {
        browser.load('/demos/query-builder/import/index.html');
        browser.driver.sleep(3000);
        browser.compareScreen(element(By.id('querybuilder')), 'import_sample');
        browser.compareScreen(element(By.id('property')), 'property');
    });

    it('template Sample', () => {
        browser.load('/demos/query-builder/template/index.html');
        browser.driver.sleep(3000);
        browser.compareScreen(element(By.id('querybuilder')), 'template_sample');
    });

    it('Column Sample - Number options', () => {
        browser.load('/demos/query-builder/columns/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="lessthan"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_LessThan');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="equal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Equal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="greaterthanorequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Greaterthanorequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="greaterthan"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Greaterthan');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="between"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Between');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notbetween"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Notbetween');


        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="lessthanorequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Lessthanorequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Notequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="in"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_In');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notin"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Number_Notin');

    });
    it('Column Sample - String options', () => {
        browser.load('/demos/query-builder/columns/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="startswith"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Startswith');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="endswith"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Endswith');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="contains"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Contains');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="equal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Equal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Notequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="in"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_In');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[6]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notin"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_String_Notin');

    });

    it('Column Sample - Radio selection', () => {
        browser.load('/demos/query-builder/columns/index.html');
        browser.driver.sleep(2000);
        browser.executeScript('document.getElementById("querybuilder_e_group2_e_rule3_valuekey0").click()');
        ;
        //browser.findElement(by.id('querybuilder_e_group2_e_rule3_valuekey0')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Radio_Selection');
    });

    it('Column Sample - date options', () => {
        browser.load('/demos/query-builder/columns/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[10]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="Date"]')).click();
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="greaterthan"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Greaterthan');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="greaterthanorequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Greaterthanorequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="lessthan"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Lessthan');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="lessthanorequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Lessthanorequal');

        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notequal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Notequal');


        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[11]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="equal"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Date_Equal');
    });

    it('Default sample - Add group option', () => {
        browser.load('/demos/query-builder/default/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.id('e-dropdown-btn_0')).click();
        browser.driver.sleep(2000);
        browser.driver.findElement(by.id('e-dropdown-btn-item_45')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Default_AddGroup');
    });

    it('Default sample - Add rule option', () => {
        browser.load('/demos/query-builder/default/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.id('e-dropdown-btn_0')).click();
        browser.driver.sleep(2000);
        browser.driver.findElement(by.id('e-dropdown-btn-item_46')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Default_Addrule');
    });

    it('Default sample - delete rule option', () => {
        browser.load('/demos/query-builder/default/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-btn-icon e-icons e-delete-icon"])[7]')).click();

        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Default_Deleterule');
    });

    it('Default sample - delete group option', () => {
        browser.load('/demos/query-builder/default/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-btn-icon e-icons e-delete-icon"])[5]')).click();

        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Default_Deletegroup');
    });

    it('Grid Sample - clicking OR option', () => {
        browser.load('/demos/query-builder/grid/index.html');
        browser.driver.sleep(2000);
      //  browser.driver.findElement(by.id('querybuilder_or0')).click();
      browser.driver.findElement(by.xpath("(//label[@class='e-btn e-btngroup-or-lbl'])[1]")).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//*[@class="e-control e-btn e-small e-primary"]')).click();

        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'Query_Grid_OR');
    });

    it('Grid Sample - Changing the options', () => {
        browser.load('/demos/query-builder/grid/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="greaterthanorequal"]')).click();

        browser.driver.findElement(by.id('querybuilder_e_group0_e_rule0_valuekey0')).clear();
        browser.driver.findElement(by.id('querybuilder_e_group0_e_rule0_valuekey0')).click();

        browser.driver.findElement(by.id('querybuilder_e_group0_e_rule0_valuekey0')).sendKeys('10254');
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[4]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="contains"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.id('querybuilder_e_group1_e_rule1_valuekey0')).clear();
        browser.driver.findElement(by.id('querybuilder_e_group1_e_rule1_valuekey0')).click();
        browser.driver.findElement(by.id('querybuilder_e_group1_e_rule1_valuekey0')).sendKeys('OP');
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//*[@class="e-control e-btn e-small e-primary"]')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('Grid')), 'Query_Grid_01');
    });

    it('Import Sample - Changing the options', () => {
        browser.load('/demos/query-builder/import/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="between"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[5]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="Country"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//span[@class="e-input-group-icon e-date-icon e-icons"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//span[@title="Saturday, July 5, 1986"]')).click();

        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Import_01');
        browser.compareScreen(element(By.id('ruleContent')), 'Import_JSON');
        browser.driver.sleep(1000);
        browser.driver.findElement(by.id('radio2')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('ruleContent')), 'Import_SqlRule');
    });

    it('Import Sample - Changing the options', () => {
        browser.load('/demos/query-builder/template/index.html');
        browser.driver.sleep(2000);
        browser.driver.findElement(by.xpath('//button[@class="e-edit-rule e-css e-btn e-small"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[2]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="notin"]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('(//span[@class="e-input-group-icon e-ddl-icon e-search-icon"])[4]')).click();
        browser.driver.sleep(1000);
        browser.driver.findElement(by.xpath('//li[@data-value="Date"]')).click();
        browser.driver.sleep(1000);
        var slider=browser.driver.findElement(by.className('e-handle e-handle-first'));
        browser.actions().dragAndDrop(slider, {x:100, y:0}).perform();
     
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Template1');
        browser.driver.sleep(1000);
        browser.driver.findElement(by.className('e-collapse-rule e-css e-btn e-small')).click();
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('querybuilder')), 'Query_Template2');
    });

});