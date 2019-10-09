
import { browser, element, By,by, protractor } from '@syncfusion/ej2-base/e2e/index';

describe('Testing dialog', () => {
    it ('hide method', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('hide'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_hide_method');
            browser.actions().click(element(By.id('show'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_show_method');
            })
        });
    });

    it ('Close on Escape key press API', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('esc'))).perform().then(function(){
            browser.sleep(2000);
            browser.actions().click(element(By.id('dialog_title'))).perform().then(function(){
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.ESCAPE);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_closeonEsc');
            })
        });
    });

    it ('RTL API', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('rtl'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_rtl_mode');
            browser.actions().click(element(By.id('rtl'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_ltr_mode');
            })
        });
    });

    it ('Modal dialog with cross API combinations', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_dialog');
            browser.actions().click(element(By.id('rtl'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_rtl_mode');
                browser.sleep(2000);
                browser.actions().click(element(By.id('rtl'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_ltr_mode');
                })
            })
        });
    });


    it ('Show close icon for non modal dialog', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('closeicon'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_showcloseicon_false');
            browser.actions().click(element(By.id('closeicon'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_showcloseicon_true');
            })
        });
    });

    it ('Show close icon for modal dialog', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
            browser.sleep(2000);
            browser.actions().click(element(By.id('closeicon'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_showcloseicon_false');
                browser.actions().click(element(By.id('closeicon'))).perform().then(function(){
                    browser.sleep(2000);
                    browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_showcloseicon_true');
                })
            });
        })
    });

    it ('Visible API for non modal dialog', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('visible'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_visible_false');
            browser.actions().click(element(By.id('visible'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_visible_true');
            })
        });
    });

    it ('Visible API for modal dialog', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
            browser.sleep(2000);
            browser.actions().click(element(By.id('visible'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_visible_false');
                browser.actions().click(element(By.id('visible'))).perform().then(function(){
                    browser.sleep(2000);
                    browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_visible_true');
                })
            });
        })
    });

    it ('dialog with custom position', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('Xnumber')).sendKeys(200);
        browser.element(By.id('Ynumber')).sendKeys(150);
        browser.actions().click(element(By.id('okBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_custom_postion_200_150');
        })
    });

    it ('dialog with custom height and width', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('height')).sendKeys(400);
        browser.element(By.id('width')).sendKeys(500);
        browser.actions().click(element(By.id('heightOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_height400_width500');
        })
    });

    it ('dialog with custom buttons', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('buttonText')).sendKeys("Testing");
        browser.actions().click(element(By.id('btnOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_custom_buttons');
        })
    });

    it ('dialog with dynamic content and refresh position', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_dynamic_content');
            browser.actions().click(element(By.id('refresh'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_refresh_position');
            })
        })
    });

    it ('dialog with empty content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matric_empty_content');
        })
    });

    it ('dialog with content as HTML element', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("<div>Dialog content has been updated with html element</div>");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_htmlcontent');
        })
    });

    it ('dialog with dynamic header content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("EJ2 Dialog header");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_dynamic_header');
        })
    });

    it ('dialog with header content as empty', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_dynamic_header_empty');
        })
    });

    it ('dialog with header content as html element', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("<span>Dialog header element</span>");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_dynamic_htmlheader');
        })
    });

    it ('dialog with dynamic footer content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('footerArea')).sendKeys("<button id='dlgfooterbtn' class='e-btn'>Click</button>");
        browser.actions().click(element(By.id('footerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_dynamic_footerHtml');
        })
    });

    it ('dialog with footer content as empty', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.element(By.id('footerArea')).sendKeys("");
        browser.actions().click(element(By.id('footerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_empty_footer');
        })
    });


    // for modal dialogs

    it ('dialog with custom position', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('Xnumber')).sendKeys(200);
        browser.element(By.id('Ynumber')).sendKeys(150);
        browser.actions().click(element(By.id('okBtn'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix__modaldialog_position_200_150');
        })
    })
    });

    it ('dialog with custom height and width', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('height')).sendKeys(400);
        browser.element(By.id('width')).sendKeys(500);
        browser.actions().click(element(By.id('heightOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix__modal_height400_width500');
        })
    });
    });

    it ('dialog with custom buttons', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('buttonText')).sendKeys("Testing");
        browser.actions().click(element(By.id('btnOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_custom_buttons');
        })
    })
    });

    it ('dialog with dynamic content and refresh position', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content Syncfusion dialog content");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_dynamic_content');
            browser.actions().click(element(By.id('refresh'))).perform().then(function(){
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_refresh_position');
            })
        })
    })
    });

    it ('dialog with empty content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matric_modaldialog_empty_content');
        })
    })
    });

    it ('dialog with content as HTML element', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('contentArea')).sendKeys("<div>Dialog content has been updated with html element</div>");
        browser.actions().click(element(By.id('contentOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_htmlcontent');
        })
    })
    });

    it ('dialog with dynamic header content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("EJ2 Dialog header");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_dynamic_header');
        })
    })
    });

    it ('dialog with header content as empty', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_dynamic_header_empty');
        })
    })
    });

    it ('dialog with header content as html element', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('headerArea')).sendKeys("<span>Dialog header element</span>");
        browser.actions().click(element(By.id('headerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_dynamic_htmlheader');
        })
    })
    });

    it ('dialog with dynamic footer content', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('footerArea')).sendKeys("<button id='dlgfooterbtn' class='e-btn'>Click</button>");
        browser.actions().click(element(By.id('footerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_dynamic_footerHtml');
        })
    })
    });

    it ('dialog with footer content as empty', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
        browser.sleep(2000);
        browser.element(By.id('footerArea')).sendKeys("");
        browser.actions().click(element(By.id('footerOk'))).perform().then(function(){
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modaldialog_empty_footer');
            })
        });
    })

    it ('dialog with position change', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('positionchange'))).perform().then(function(){
            browser.sleep(2000);
            browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_UP);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_left_top');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_center_top');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_right_top');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_left_center');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_center_center');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_right_center');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_left_bottom');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_center_bottom');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_right_bottom');
            browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
            browser.sleep(2000);
            browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_Right_Center');
        })
    })

    it ('Modal dialog with position change', () => {
        browser.load('/demos/dialog/feature-matrix.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('modal'))).perform().then(function(){
            browser.actions().click(element(By.id('positionchange'))).perform().then(function(){
                browser.sleep(2000);
                browser.element(By.tagName('BODY')).sendKeys(protractor.Key.TAB);
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_UP);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_left_top');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')), 'feature_matrix_modal_center_top');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_right_top');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_left_center');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_center_center');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_right_center');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_left_bottom');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_center_bottom');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_right_bottom');
                browser.element(By.id('position')).sendKeys(protractor.Key.ARROW_DOWN);
                browser.sleep(2000);
                browser.compareScreen(element(By.id('dialogTarget')),'feature_matrix_modal_Right_Center');
            })
        })
    })
})
