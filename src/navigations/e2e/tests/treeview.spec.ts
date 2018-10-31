
import { browser, element, By, protractor } from '@syncfusion/ej2-base/e2e/index';
  
 describe('Treeview', () => {
    it ('Treeview ', () => {
        browser.load('/demos/treeview/default.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_default');
    })
     it ('Treeview ', () => {
        browser.load('/demos/treeview/icons.html'); 
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_icons');
    })
     it ('Treeview ', () => {
        browser.load('/demos/treeview/multiselect.html'); 
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_multiselect');
    })
     it ('Treeview ', () => {
        browser.load('/demos/treeview/template.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_template');
    })
     it ('Treeview ', () => {
        browser.load('/demos/treeview/rtl.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_rtl');
    })
     it ('Treeview checkbox ', () => {
        browser.load('/demos/treeview/checkbox.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox');
     
        browser.actions().click(element(By.className('e-checkbox-wrapper'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_check_select');

        browser.element(By.id('tree1')).sendKeys(protractor.Key.TAB);
        browser.element(By.id('tree1')).sendKeys(protractor.Key.ARROW_DOWN);
        browser.element(By.id('tree1')).sendKeys(protractor.Key.ENTER);
        browser.element(By.id('tree1')).sendKeys(protractor.Key.SPACE);
        browser.sleep(200);
        browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_select_child');

    })
    it ('Treeview checkbox with rtl, multiselection and checkbox', () => {
        browser.load('/demos/treeview/checkboxRTL.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_rtl_multiselection');
    })
    it ('Treeview checkbox with multiselection', () => {
        browser.load('/demos/treeview/checkboxwithmultiselection.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_checkbox_multiselection');
    })
    it ('Treeview with disablednodes', () => {
        browser.load('/demos/treeview/disablednodes.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_disabled_nodes');
    })
    it ('Treeview disablednodes with fabric theme', () => {
        browser.load('/demos/treeview/disablednodes_fabric.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_disabled_nodes_fabric');
    })
    it ('Treeview disablednodes with bootstrap theme', () => {
        browser.load('/demos/treeview/disablednodes_bootstrap.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_disabled_nodes_bootstrap');
    })
    it ('Treeview rtl with editing', () => {
        browser.load('/demos/treeview/editingRTL.html');
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_editing_rtl');
    })
    it ('Treeview with fullrowselect as false', () => {
        browser.load('/demos/treeview/fullrowselect.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_fullrowselect');
    })
    it ('Treeview with fullrowselect with fabric theme', () => {
        browser.load('/demos/treeview/fullrowselect_fabric.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_fullrowselect_fabric');
    })
    it ('Treeview with fullrowselect with bootstrap theme', () => {
        browser.load('/demos/treeview/fullrowselect_bootstrap.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_fullrowselect_bootstrap');
    })
    it ('Treeview icons with fullrowselect as false', () => {
        browser.load('/demos/treeview/fullrowselectwithicons.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_fullrowselect_icons');
    })
    it ('Treeview checkbox with icons', () => {
        browser.load('/demos/treeview/iconsCheckbox.html'); 
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_icons_checkbox');
    })
    it ('Treeview template with editing', () => {
        browser.load('/demos/treeview/templatewithediting.html');
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_template_editing');
    })
    it ('Treeview template with editing fabric theme', () => {
        browser.load('/demos/treeview/templatewithediting_fabric.html');
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_template_editing_fabric');
    })
    it ('Treeview template with editing bootstrap theme', () => {
        browser.load('/demos/treeview/templatewithediting_bootstrap.html');
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree1')), 'treeview_template_editing_bootstrap');
    })
    it ('Treeview template with rtl', () => {
        browser.load('/demos/treeview/templatewithrtl.html'); 
        browser.sleep(1000);
        browser.compareScreen(element(By.id('tree1')), 'treeview_template_rtl');
    })
})

 describe('Treeview hover items with keyboards', () => {
    it ('Keyboards events ', () => {

       browser.load('/demos/treeview/default.html'); 
       browser.sleep(500);

       browser.element(By.id('tree1')).sendKeys(protractor.Key.TAB);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ARROW_DOWN);
       browser.sleep(1000);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_key_down');

       browser.element(By.id('tree1')).sendKeys(protractor.Key.END);
       browser.sleep(500);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_key_end');

       browser.element(By.id('tree1')).sendKeys(protractor.Key.HOME);
       browser.sleep(500);  
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_key_home');
    })
})
 describe('Treeview hover checkbox items with keyboards', () => {
    it ('Keyboards events ', () => {

       browser.load('/demos/treeview/checkbox.html'); 
       browser.sleep(1000);

       browser.element(By.id('tree1')).sendKeys(protractor.Key.TAB);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ARROW_DOWN);
       browser.sleep(500);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_key_down');
      
       browser.element(By.id('tree1')).sendKeys(protractor.Key.END);
       browser.sleep(500);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_key_end');
     
       browser.element(By.id('tree1')).sendKeys(protractor.Key.HOME);
       browser.sleep(500);  
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_key_home');

    })
})
 describe('Treeview checkbox selection with keyboards keys', () => {
    it ('Keyboards events ', () => {

       browser.load('/demos/treeview/checkbox.html'); 
       browser.sleep(1000);

       browser.element(By.id('tree1')).sendKeys(protractor.Key.TAB);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ARROW_DOWN);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ENTER);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.SPACE);
       browser.sleep(200);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_selected_key_down');

       browser.element(By.id('tree1')).sendKeys(protractor.Key.END);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ENTER);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.SPACE);
       browser.sleep(200);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_selected_key_end');

       browser.element(By.id('tree1')).sendKeys(protractor.Key.HOME);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.ENTER);
       browser.element(By.id('tree1')).sendKeys(protractor.Key.SPACE);
       browser.sleep(200);
       browser.compareScreen(element(By.tagName('BODY')), 'treeview_checkbox_selected_key_home');

    })
})
 describe('Treeview checkbox', () => {
    it ('Checkbox with difference themes ', () => {
      browser.load('/demos/treeview/api.html'); 
      browser.actions().click(element(By.id('checkBox'))).perform();

      browser.actions().click(element(By.className('e-checkbox-wrapper'))).perform();
      browser.sleep(800);
      browser.compareScreen(element(By.id('tree')), 'treeview_checkbox_material');

      browser.actions().click(element(By.id('fabric'))).perform();
      browser.sleep(500);
      browser.compareScreen(element(By.id('tree')), 'treeview_checkbox_fabric');

      browser.actions().click(element(By.id('bootstrap'))).perform();
      browser.sleep(500);
      browser.compareScreen(element(By.id('tree')), 'treeview_checkbox_bootstarp');
    })
})
 describe('Treeview editing', () => {
    it ('Editing with difference themes ', () => {
      browser.load('/demos/treeview/api.html'); 
      browser.actions().click(element(By.id('editing'))).perform();
      browser.actions().doubleClick(element(By.className('e-fullrow'))).perform();
      browser.sleep(1000);
      browser.compareScreen(element(By.id('tree')), 'treeview_editing_material');

      browser.actions().click(element(By.id('fabric'))).perform();
      browser.actions().doubleClick(element(By.className('e-fullrow'))).perform();
      browser.sleep(500);
      browser.compareScreen(element(By.id('tree')), 'treeview_editing_fabric');

      browser.actions().click(element(By.id('bootstrap'))).perform();
      browser.actions().doubleClick(element(By.className('e-fullrow'))).perform();
      browser.sleep(500);
      browser.compareScreen(element(By.id('tree')), 'treeview_editing_bootstarp');
    })
})
describe('Treeview API', () => {
    it ('API ', () => {

       browser.load('/demos/treeview/api.html'); 
         browser.actions().click(element(By.id('fabric'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_fabricTheme');
         browser.actions().click(element(By.id('bootstrap'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_bootstrapTheme');

        browser.actions().click(element(By.id('touch'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_touchMode');

        browser.actions().click(element(By.id('ascending'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_ascendingMode');

        browser.actions().click(element(By.id('descending'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_descendingMode');

        browser.actions().click(element(By.id('fullRowSelect'))).perform();
        browser.actions().click(element(By.id('material'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_fullRowSelect_material');
        browser.actions().click(element(By.id('fabric'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_fullRowSelect_fabric');
        browser.actions().click(element(By.id('bootstrap'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.id('tree')), 'treeview_fullRowSelect_bootstrap');

    })
})


    