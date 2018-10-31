
import { browser, element, By,by, protractor } from '@syncfusion/ej2-base/e2e/index';

describe('Default dialog', () => {
    it ('With auto focus input', () => {
        browser.load('/demos/dialog/autofocus-input.html');
        browser.actions().click(element(By.id('openBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_autofocus-input');
            browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
                browser.sleep(2000);
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
                browser.compareScreen(element(By.tagName('BODY')), 'cc');
            })
        });
    });

    it ('Dialog with dynamic content', () => {
        browser.load('/demos/dialog/dynamic-content.html');
        browser.actions().click(element(By.id('openBtn'))).perform().then(function(){
            browser.sleep(1500);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_open_dynamic_content');
        });
        browser.actions().click(element(By.id('addBtn'))).perform().then(function(){
            browser.sleep(1500);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_add_dynamic_content');
        });
    }); 
    it ('Dialog with fullscreen', () => {
        browser.load('/demos/dialog/fullscreen.html');
        browser.actions().click(element(By.id('openBtn'))).perform().then(function(){
        browser.sleep(1500);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_fullscreen');
        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_fullScreen_closeicon_hover');
        })
        });
    });
    it ('Dialog with fullscreen scrollable ', () => {
        browser.load('/demos/dialog/fullscreen-scrollable.html');
        browser.actions().click(element(By.id('openBtn'))).perform().then(function(){
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_fullscreen_scrollable');
        });
    }); 
    it ('Dialog with modal', () => {
        browser.load('/demos/dialog/modal.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_modal');
    }); 
    it ('Dialog with modal scrollable', () => {
        browser.load('/demos/dialog/modal-scrollable.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_modal_scrollable');
    });
   
    it ('Dialog with rtl', () => {
        browser.load('/demos/dialog/rtl.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_rtl');
        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_rtl_closeicon_hover');
        })
    });
    
    it ('Dialog with without footer', () => {
        browser.load('/demos/dialog/without-footer.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_without_footer');
    });
    it ('Dialog with without header', () => {
        browser.load('/demos/dialog/without-header.html');
        browser.sleep(1500);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_without_header');
    });
    it ('Dialog with without header & footer', () => {
        browser.load('/demos/dialog/without-header-footer.html');
        browser.sleep(1500);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_without_header-footer');
    });
})


describe('Testing', () => {

    it ('Dialog Modal custom position', () => {
        browser.get(browser.basePath + '/demos/dialog/modal-custom-position.html').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_modal_custom_position'); 
        });
    });

    it ('Dialog with custom position with target as body', () => {
        browser.get(browser.basePath + '/demos/dialog/position-normal.html').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'default-position-left-top'); 
        });

        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_centerTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_rightTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Left_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Center_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Right_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Left_Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Center_Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'dialog_position_Right_Center');
        })
    })
});



describe('Testing', () => {

    it ('Modal dialog with custom position with target as body', () => {
        browser.get(browser.basePath + '/demos/dialog/modal-position.html').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal-default-position-left-top'); 
        });

        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_centerTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_rightTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Left_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Center_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Right_Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Left_Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Center_Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'modal_dialog_position_Right_Center');
        })
    })
    });

        
describe('Testing', () => {

    it ('Dialog with custom position within specifed target', () => {
        browser.get(browser.basePath + '/demos/dialog/dialog-custom-target.html').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-position-left-top'); 
        });

        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-position-centerTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-position-rightTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-position-Left-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-Center-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-Right-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-Left-Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-Center-Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'custom-target-with-Right-Center');
        })
        })
    });

describe('Testing', () => {

    it ('Modal Dialog with custom position within specifed target', () => {
        browser.get(browser.basePath + '/demos/dialog/modal-custom-target.html').then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-position-left-top'); 
        });

        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-position-centerTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-position-rightTop');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-position-Left-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-Center-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-Right-Bottom');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-Left-Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-Center-Center');
            browser.element(By.id('positionselect')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')),'Modal-custom-target-with-Right-Center');
        })
        })
    });
    

describe('Theme changes for default', () => {
    let themeChanged = ['material', 'fabric', 'bootstrap', 'highcontrast'];
    for( let i = 0 ; i < themeChanged.length; i++ ) {
        it ('Dialog with' + themeChanged[i] + ' theme'  , () => {
            browser.load('/demos/dialog/default-dialog.html');
            let fileName: string = '../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path).then(function() {
                browser.sleep(2500);
                browser.compareScreen(element(By.tagName('BODY')), 'Dialog with '+themeChanged[i]);
                browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
                browser.sleep(2500);
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
                browser.compareScreen(element(By.tagName('BODY')), themeChanged[i]+'_dialog_close_hover');
                })
            });
        });
    }
});

describe('Theme changes Modal', () => {
    let themeChanged = ['material', 'fabric', 'bootstrap', 'highcontrast'];
    for( let i = 0 ; i < themeChanged.length; i++ ) {
        it ('Dialog with' + themeChanged[i] + ' theme'  , () => {
            browser.load('/demos/dialog/modal.html');
            let fileName: string = '../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path).then(function() {
                browser.sleep(2500);
                browser.compareScreen(element(By.tagName('BODY')), 'Modal Dialog with '+themeChanged[i]);
                browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
                browser.sleep(2500);
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
                browser.compareScreen(element(By.tagName('BODY')), themeChanged[i]+'_modal_dialog_close_hover');
                })
            });
        });
    }
});

describe('Testing', () => {
    it ('dynamically updated the content', () => {
        browser.load('/demos/dialog/ajax-content.html');
        browser.actions().click(element(By.id('openBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'dialog_before_content_update');
            browser.actions().click(element(By.className('e-primary'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.tagName('BODY')), 'dialog_after_content_update');
            })
        });
    });

    it ('with icons in footer buttons', () => {
        browser.load('/demos/dialog/dialog-template.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_footer_icons');
    }); 

    it ('with height auto', () => {
        browser.load('/demos/dialog/height-auto.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'dialog_height_auto');
    }); 

    it ('modal dialog within specified target', () => {
        browser.load('/demos/dialog/modal-position-target.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'modal_dialog_target');
    });

    it ('modal dialog in rtl mode', () => {
        browser.load('/demos/dialog/modal-rtl.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'modal_dialog_rtl');
        browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.compareScreen(element(By.tagName('BODY')), 'modal_rtl_close_icon');
        })
    }); 

    it ('modal dialog without footer', () => {
        browser.load('/demos/dialog/modal-without-footer.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'modal_dialog_without_footer');
    });

    it ('modal dialog without header', () => {
        browser.load('/demos/dialog/modal-without-header.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'modal_dialog_without_header');
    });

    it ('Multiple dialog', () => {
        browser.load('/demos/dialog/multiple-dialogs.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'multiple_dialogs_1');
        browser.actions().click(element(By.className('e-primary'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'multiple_dialogs_2');
        })
    });

    it ('dialog with scrollable content', () => {
        browser.load('/demos/dialog/scrollable-content.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'scrollable-content');
    });

    it ('dialog with custom position', () => {
        browser.load('/demos/dialog/custom-position.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'before_set_custom-position');
        browser.element(By.id('Xnumber')).sendKeys(200);
        browser.element(By.id('Ynumber')).sendKeys(150);
        browser.actions().click(element(By.id('okBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'custom_postion_200_150');
        })
    });

    it ('modal dialog with custom position', () => {
        browser.load('/demos/dialog/modal-dynamic-position.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'before_set_custom-position_modal');
        browser.element(By.id('Xnumber')).sendKeys(200);
        browser.element(By.id('Ynumber')).sendKeys(150);
        browser.actions().click(element(By.id('okBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'custom_postion_200_150_modal');
        })
    });

    it ('Multiple dialog in different orders', () => {
        browser.load('/demos/dialog/modal-multiple-dialogs.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), 'Show_dialog_1');
        browser.actions().click(element(By.id('Docdialog_Button'))).perform().then(function() {
            browser.sleep(2000);
            browser.compareScreen(element(By.tagName('BODY')), 'Show_dialog_3');
            browser.actions().click(element(By.id('lookDialog_Button'))).perform().then(function() {
                browser.sleep(2000);
                browser.compareScreen(element(By.tagName('BODY')), 'Show_dialog_2');
            })
        })
    });
})
