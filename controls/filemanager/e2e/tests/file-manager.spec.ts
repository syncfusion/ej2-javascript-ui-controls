import { browser, element, By, protractor, by } from '@syncfusion/ej2-base/e2e/index';

let themes = ['material', 'fabric','highcontrast', 'bootstrap'];

// take and compare screen shots in all themes.
function change_theme(sample: string, target: string) {
    for( let i = 0 ; i < themes.length; i++ ) {
        let styleFile: string = '../themes/'+ themes[i] +'.css';
        let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ styleFile+"')";
        browser.executeScript(path).then(function() {
            browser.sleep(2500);
            if (target === 'body') {
                browser.compareScreen(element(By.tagName('BODY')), sample + themes[i] + "_theme");
            } else {
                browser.compareScreen(element(By.id('file')), sample + themes[i] + "_theme");
            }
        });
    }
}


describe('FileManager', () => {
    // load the  default sample
    it('Default sample', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        change_theme('default_', 'body');
    });
    // load the All API sample
    it('All api sample', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        change_theme('overview_', 'file');
    });
    // load the localization sample
    it('Localization', () => {
        browser.load('/demos/file-manager/locale.html');
        browser.sleep(2000);
        change_theme('localization_', 'body');
        browser.actions().click(element(By.id('file_tb_newfolder'))).perform();
        browser.sleep(2000);
        change_theme('locale_newfolder_', 'body');
    });
    // load the single selection sample
    it('Single selection', () => {
        browser.load('/demos/file-manager/single-selection.html');
        browser.sleep(2000);
        // select single file in largeIcon
        browser.actions().click(element(By.css('.e-large-icons .e-list-item'))).perform();
        change_theme('lg-single_selection_', 'file');
        browser.sleep(1000);
        browser.actions().click(element(By.id('file_view'))).perform();
        browser.sleep(1000);
        // change the layout to Details view
        browser.actions().click(element(By.id('file_ddl_details'))).perform();
        browser.sleep(1000);
        browser.actions().click(element(By.css('.e-fe-text'))).perform();
        browser.sleep(1000);
        change_theme('grid-single_selection_', 'file');
    });
    it('Multi selection', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
         // select single file in largeIcon
        browser.actions().click(element(By.css('.e-checkbox-wrapper'))).perform();
        browser.sleep(1000);
        // using shift and right arrow select next file
        browser.actions().keyDown(protractor.Key.SHIFT).sendKeys(protractor.Key.ARROW_RIGHT).keyUp(protractor.Key.SHIFT).perform();
        browser.sleep(1000);
        change_theme('lg-multiselection_', 'file');
        browser.sleep(1000);

        browser.actions().click(element(By.id('file_view'))).perform();
        browser.sleep(1000);
        // change the layout to details view
        browser.actions().click(element(By.id('file_ddl_details'))).perform();
        browser.sleep(1000);
        change_theme('grid-multiselection_', 'file');
    });
    it('selection using header column', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('file_view'))).perform();
        browser.sleep(1000);
        // change the layout to details view
        browser.actions().click(element(By.id('file_ddl_details'))).perform();
        browser.sleep(1000);
        // click checkbox in the header column of grid
        browser.actions().click(element(By.css('.e-checkbox-wrapper .e-frame'))).perform();
        browser.sleep(2000);
        change_theme('grid-selectheader_', 'file');
    });
    // load without context-menu sample
    it('without context menu', () => {
        browser.load('/demos/file-manager/wo-context-menu.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        // right click the mouse to open context menu
        browser.actions().click(protractor.Button.RIGHT).perform();
        browser.sleep(2000);
        change_theme('wo-cm_', 'body');
    });
    // load without grid view sample
    it('without grid view', () => {
        browser.load('/demos/file-manager/wo-grid-view.html');
        browser.sleep(2000);
        change_theme('wo-grid_', 'file');
    });
    // load without toolbar view sample
    it('without toolbar', () => {
        browser.load('/demos/file-manager/wo-toolbar.html');
        browser.sleep(2000);
        change_theme('wo-toolbar_', 'file');
    });
    // load without treeview sample
    it('without treeview', () => {
        browser.load('/demos/file-manager/wo-tree-view.html');
        browser.sleep(2000);
        change_theme('wo-tree_', 'file');
    });
    it('checkbox in default view', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        // select file using checkbox
        browser.actions().click(element(By.css('.e-checkbox-wrapper'))).perform();
        browser.sleep(2000);
        change_theme('checkbox_default_', 'body');
    });
    it('checkbox in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // select file using checkbox
        browser.actions().click(element(By.css('.e-checkbox-wrapper'))).perform();
        browser.sleep(2000);
        change_theme('checkbox_overview_', 'file');
    });
    it('collapse treeview node', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // collapse the root node in treeview
        browser.actions().click(element(By.css('.e-icons.e-icon-collapsible'))).perform();
        browser.sleep(2000);
        change_theme('collapsed-root_', 'file');
    });
    it('expand treeview node', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // expand the root node in treeview
        browser.actions().click(element(By.css('.e-icons.e-icon-expandable'))).perform();
        browser.sleep(1000);
        change_theme('expanded-child_', 'file');
    });
    it('sorting', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('file_view'))).perform();
        browser.sleep(1000);
        browser.actions().click(element(By.id('file_ddl_details'))).perform();
        browser.sleep(1000);
        // click sort option in grid column header
        browser.actions().click(element(By.css('.e-headercell.e-fe-grid-name'))).perform();
        change_theme('sort-name-grid_', 'file')
    });
})
describe('FileManager folder open', () => {
    it('folder open in default view', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        // double click to open folder
        browser.actions().doubleClick(element(By.css('.e-large-icons .e-list-item'))).perform();
        browser.sleep(2000);
        change_theme('fileopen_default_', 'body')
    });
    it('folder open in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // double click to open folder
        browser.actions().doubleClick(element(By.css('.e-large-icons .e-list-item'))).perform();
        browser.sleep(2000);
        change_theme('fileopen_overview', 'file');
    });
    it('folder open using navigation pane in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click treeview to open folder
        browser.actions().click(element(By.css('#file_tree .e-list-item .e-level-2'))).perform();
        browser.sleep(2000);
        change_theme('fileopen_naviationpane_', 'file');
    });
})
describe('File Manager toolbar action', () => {
    it('create new folder', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click newfolder in toolbar to create new folder
        browser.actions().click(element(By.id('file_tb_newfolder'))).perform();
        browser.sleep(2000);
        change_theme('tb-newfolder_', 'file');
    })
    it('sortby', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click sortby in toolbar to show sortby option
        browser.actions().click(element(By.id('file_tb_sortby'))).perform();
        browser.sleep(2000);
        change_theme('tb-sortby_', 'file');
    })
    it('sortby in locale', () => {
        browser.load('/demos/file-manager/locale.html');
        browser.sleep(2000);
        // click sortby in toolbar to show sortby option with different culture
        browser.actions().click(element(By.id('file_tb_sortby'))).perform();
        browser.sleep(2000);
        change_theme('tb-sortby_locale_', 'body');
    })
    it('refresh', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click refresh in toolbar to refresh the folder
        browser.actions().click(element(By.id('file_tb_refresh'))).perform();
        browser.sleep(2000);
        change_theme('tb-refresh_', 'file');
    })
    it('layout view', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click view option in toolbar to change the view
        browser.actions().click(element(By.id('file_view'))).perform();
        browser.sleep(2000);
        change_theme('tb-layout_view_', 'file');
        browser.sleep(1000);
        // select option to change details view
        browser.actions().click(element(By.id('file_ddl_details'))).perform();
        change_theme('tb-details-view_', 'file');
    })
    it('file details', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // click details option in toolbar to view the file details
        browser.actions().click(element(By.id('file_tb_details'))).perform();
        browser.sleep(2000);
        change_theme('tb-file-details_', 'file');
    })
})
describe('File Manager context menu', () => {
    it('open context menu in default view', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        // right click to open the context menu
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        browser.sleep(2000);
        change_theme('default_cm-open_', 'body');
    })
    it('open context menu in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // right click to open the context menu
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        browser.sleep(2000);
        change_theme('overview_cm-open_', 'body');
    })
    it('context menu in localization', () => {
        browser.load('/demos/file-manager/locale.html');
        browser.sleep(2000);
        // right click to open the context menu
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        browser.sleep(2000);
        change_theme('locale_cm-open_', 'body');
    })
    it('create new folder', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        // select new folder option in context menu to create new folder
        browser.actions().click(element(By.css('ul[id=file_contextmenu] #file_cm_newfolder'))).perform();
        browser.sleep(1000);
        change_theme('cm_newfolder_', 'body');
    })
    it('select all', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        // click select all option in  context menu to select all file
        browser.actions().click(element(By.css('ul[id=file_contextmenu] #file_cm_selectall'))).perform();
        browser.sleep(2000);
        change_theme('cm_selectall_', 'body');
    })
    it('details', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('file_content'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        // click details option in  context menu to view details
        browser.actions().click(element(By.css('ul[id=file_contextmenu] #file_cm_details'))).perform();
        browser.sleep(1000);
        change_theme('cm-file-details_', 'body');
    })
    it('Rename', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.css('.e-large-icons .e-list-item'))).perform();
        browser.actions().click(protractor.Button.RIGHT).perform();
        // click rename to rename the file
        browser.actions().click(element(By.css('ul[id=file_contextmenu] #file_cm_rename'))).perform();
        browser.sleep(2000);
        change_theme('cm-rename_', 'body');
        browser.sleep(2000);
        browser.element(By.id('rename')).clear();
        browser.sleep(1000);
        browser.element(By.id('rename')).sendKeys('rename');
        browser.sleep(2000);
        // click save button to save the renamed file
        browser.actions().click(element(By.css('#file_dialog .e-btn.e-primary'))).perform();
        browser.sleep(2000);
        change_theme('cm-renamed-file_', 'file');
    })
})
describe('File Manager search', () => {
    it('exist file name in default', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        // search exist file 
        browser.element(By.id('file_search')).sendKeys('d');
        browser.sleep(2000);
        change_theme('exist_file_default_', 'body');
    })
    it('not exist file name in default', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        // search not exist file 
        browser.element(By.id('file_search')).sendKeys('z');
        browser.sleep(2500);
        change_theme('not_found_default_', 'body');
    })
    it('exist file name in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // search exist file 
        browser.element(By.id('file_search')).sendKeys('d');
        browser.sleep(3000);
        change_theme('exist_file_overview_', 'file');
    })
    it('not exist file name in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        // search not exist file 
        browser.element(By.id('file_search')).sendKeys('z');
        browser.sleep(3000);
        change_theme('not_found_overview_', 'file');
    })
    it('not exist file name in locale', () => {
        browser.load('/demos/file-manager/locale.html');
        browser.sleep(2000);
        // search not exist file  in different
        browser.element(By.id('file_search')).sendKeys('z');
        browser.sleep(3000);
        change_theme('not_found_locale_', 'body');
    })
})
describe('File Manager BreadCrumbBar', () => {
    it('navigation in default', () => {
        browser.load('/demos/file-manager/default.html');
        browser.sleep(2000);
        browser.actions().doubleClick(element(By.css('.e-large-icons .e-list-item'))).perform();
        browser.sleep(2000);
        // navigate through the breadcrumb
        browser.actions().click(element(By.css('#file_breadcrumbbar .e-address-list-item'))).perform();
        browser.sleep(2000);
        change_theme('breadCrumb-default_', 'body');
    })
    it('navigation in overview', () => {
        browser.load('/demos/file-manager/default-allapi.html');
        browser.sleep(2000);
        browser.actions().doubleClick(element(By.css('.e-large-icons .e-list-item'))).perform();
        browser.sleep(2000);
        // navigate through the breadcrumb
        browser.actions().click(element(By.css('#file_breadcrumbbar .e-address-list-item'))).perform();
        browser.sleep(2000);
        change_theme('breadCrumb-overview_', 'file');
    })
})