
import { browser, element, by , ElementArrayFinder,ElementFinder, Key, WebElement } from "@syncfusion/ej2-base/e2e/index";
import { setTimeout } from "timers";
let theme = ['material'];
let themeChanged = ['material', 'fabric', 'bootstrap', 'highcontrast'];

describe('CSS TextBox rendering', function () {
    it('CSS TextBox rendering - initial state', function () {
        browser.load('/demos/input/css_component/default-input.html');
        for( let i = 0 ; i < themeChanged.length; i++ ) {
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1000);
                browser.compareScreen(element(by.className('control-panel-small')), 'default_small_'+themeChanged[i]);
                browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_normal_'+themeChanged[i]);
                browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_bigger_'+themeChanged[i]);
                browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_small_bigger_'+themeChanged[i]);
            });
        }
    });
});

describe('CSS TextBox rendering with Focus State', function () {
    it('Small TextBox rendering', function () {
        browser.load('/demos/input/css_component/default-input.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-small')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_small_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function(){
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_small_click_material');
        })
    });

    it('Normal TextBox rendering', function () {
        browser.load('/demos/input/css_component/default-input.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_normal_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_normal_click_material');
        });
    });

    it('Bigger TextBox rendering', function () {
        browser.load('/demos/input/css_component/default-input.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_bigger_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_bigger_click_material');
        })
    });

    it('Bigger-Small TextBox rendering', function () {
        browser.load('/demos/input/css_component/default-input.html');
        browser.sleep(1500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_small_bigger_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_small_bigger_click_material');
        });
    });
});

describe('CSS TextBox rendering with Icon', function () {
    for( let i = 0 ; i < themeChanged.length; i++ ) {
        it('Small TextBox with icon rendering', function () {
            browser.load('/demos/input/css_component/default-input-icons.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small')), 'default_input_icon_small_'+themeChanged[i]);
            });
        });

        it('Normal TextBox with icon rendering', function () {
            browser.load('/demos/input/css_component/default-input-icons.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_icon_normal_'+themeChanged[i]);
            });
        });

        it('Bigger TextBox with icon rendering', function () {
            browser.load('/demos/input/css_component/default-input-icons.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_icon_bigger_'+themeChanged[i]);
            });
        });

        it('Bigger-Small TextBox with icon rendering', function () {
            browser.load('/demos/input/css_component/default-input-icons.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_icon_small_bigger_'+themeChanged[i]);
            });  
        });
    }
});

describe('CSS TextBox rendering with Icon & Focus ', function () {
    it('Small TextBox with icon rendering', function () {
        browser.load('/demos/input/css_component/default-input-icons.html');
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function(){
            browser.sleep(1000);
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_icon_small_click_material');
        }); 
    });

    it('Normal TextBox with icon rendering', function () {
        browser.load('/demos/input/css_component/default-input-icons.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_icon_normal_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(1);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function(){
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_icon_normal_click_material');
        });
    });

    it('Bigger TextBox with icon rendering', function () {
        browser.load('/demos/input/css_component/default-input-icons.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(1);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_icon_bigger_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(2);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function(){
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_icon_bigger_click_material');
        });  
    });

    it('Bigger-Small TextBox with icon rendering', function () {
        browser.load('/demos/input/css_component/default-input-icons.html');
        browser.sleep(500);
        let eleLoc: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(2);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_icon_small_bigger_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(3);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function(){
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_icon_small_bigger_click_material');
        });
    });
});

describe('CSS TextBox with different states rendering', function () {
    for( let i = 0 ; i < themeChanged.length; i++ ) {
        it('Small TextBox with states rendering', function () {
            browser.load('/demos/input/css_component/default-input-states.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small')), 'default_input_states_small_'+themeChanged[i]);
            });
        });

        it('Normal TextBox with states rendering', function () {
            browser.load('/demos/input/css_component/default-input-states.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_states_normal_'+themeChanged[i]);
            });
        });

        it('Bigger TextBox with states rendering', function () {
            browser.load('/demos/input/css_component/default-input-states.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_states_bigger_'+themeChanged[i]);
            });
        });

        it('Bigger-Small TextBox with states rendering', function () {
            browser.load('/demos/input/css_component/default-input-states.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_states_small_bigger_'+themeChanged[i]);
            }); 
        });
    }
});

describe('CSS TextBox with validation', function () {
    it('Small TextBox with validation rendering', function () {
        browser.load('/demos/input/css_component/default-input-validation.html');
        browser.sleep(1000);
        browser.compareScreen(element(by.className('control-panel-small')), 'default_input_validation_small_material');
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_validation_small_click_material');
        })
    });

    it('Normal TextBox with validation rendering', function () {
        browser.load('/demos/input/css_component/default-input-validation.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_validation_normal_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_validation_normal_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(1);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_validation_normal_click_material');
        })
    });

    it('Bigger TextBox with validation rendering', function () {
        browser.load('/demos/input/css_component/default-input-validation.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_validation_bigger_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(1);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(300);
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_validation_bigger_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(2);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_validation_bigger_click_material');
        })
    });

    it('Bigger-Small TextBox with validation rendering', function () {
        browser.load('/demos/input/css_component/default-input-validation.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_validation_small_bigger_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(2);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_validation_small_bigger_focus_material');
        });
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(3);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function() {
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_validation_small_bigger_click_material');
        })
    });
});

describe('CSS TextBox with custom theme', function () {
    it('Small TextBox with custom theme rendering', function () {
        browser.load('/demos/input/css_component/default-input-custom-theme.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-small')), 'default_input_theme_small_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-small')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_theme_small_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function () {
            browser.compareScreen(element(by.className('control-panel-small')), 'default_input_theme_small_click_material');
        })
    });

    it('Normal TextBox with custom theme rendering', function () {
        browser.load('/demos/input/css_component/default-input-custom-theme.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_theme_normal_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_theme_normal_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-normal')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function () {
            browser.compareScreen(element(by.className('control-panel-normal')), 'default_input_theme_normal_click_material');
        });
    });

    it('Bigger TextBox with custom theme rendering', function () {
        browser.load('/demos/input/css_component/default-input-custom-theme.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_theme_bigger_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_theme_bigger_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-bigger')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function () {
            browser.compareScreen(element(by.className('control-panel-bigger')), 'default_input_theme_bigger_click_material');
        });
    });

    it('Bigger-Small TextBox with custom theme rendering', function () {
        browser.load('/demos/input/css_component/default-input-custom-theme.html');
        browser.sleep(500);
        browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_theme_small_bigger_material');
        let eleLoc: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('input')).get(0);
        eleLoc.sendKeys(Key.TAB).then(function () {
            browser.sleep(500);
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_theme_small_bigger_focus_material');
        });
        browser.sleep(500);
        let eleLoc1: ElementFinder = element(by.css('.control-panel-small-bigger')).all(by.css('.e-input-group input')).get(0);
        browser.actions().mouseDown(eleLoc1).mouseUp(eleLoc1).perform().then(function () {
            browser.compareScreen(element(by.className('control-panel-small-bigger')), 'default_input_theme_small_bigger_click_material');
        });
    });
});

describe('Utility rendering of TextBox with Export methods', function () {
    for( let i = 0 ; i < themeChanged.length; i++ ) {
        it('Small and Normal TextBox rendering', function () {
            browser.load('/demos/input/utility_rendering/default-input-property-01.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_property_panel_'+themeChanged[i]);
                browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_property_panel_'+themeChanged[i]);
                browser.executeScript(function(){
                    document.getElementById('valuehold').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_setvalue_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_setvalue_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearenable').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_disabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_disabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setenable').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_enabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_enabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setrtl').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_rtl_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_rtl_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearrtl').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_ltr_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_ltr_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setread').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_readonly_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearread').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_value_remve_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_value_remve_readonly_'+themeChanged[i]);
                });
    
    
                browser.executeScript(function(){
                    (document.getElementById('valuetext') as HTMLInputElement).value = '';
                    document.getElementById('valuehold').click();
                }).then(function() {
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wotvalue_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('placehold').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_setplaceholder_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_setplaceholder_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearenable').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_disabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setenable').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_enabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_wo_value_enabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setrtl').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_rtl_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_wo_value_rtl_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearrtl').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_ltr_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_wo_value_ltr_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setread').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_wo_value_readonly_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearread').click();
                }).then(function(){
                    browser.sleep(500);
                    browser.compareScreen(element(by.className('control-panel-small')), 'util_default_input_small_wo_value_remve_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-normal')), 'util_default_input_normal_wo_value_remve_readonly_'+themeChanged[i]);
                });
            });
        });

        it('Bigger and Bigger small TextBox rendering', function () {
            browser.load('/demos/input/utility_rendering/default-input-property-02.html');
            let fileName: string = '../../../styles/'+ themeChanged[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themeChanged[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_property_panel_'+themeChanged[i]);
                browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_property_panel_'+themeChanged[i]);
                browser.executeScript(function(){
                    document.getElementById('valuehold').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_setvalue_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_setvalue_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearenable').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_disabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_disabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setenable').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_enabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_enabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setrtl').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_rtl_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_rtl_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearrtl').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_ltr_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_ltr_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setread').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_readonly_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearread').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_value_remve_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_value_remve_readonly_'+themeChanged[i]);
                });
    
                browser.executeScript(function(){
                    (document.getElementById('valuetext') as HTMLInputElement).value = '';
                    document.getElementById('valuehold').click();
                }).then(function() {
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wotvalue_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wotvalue_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('placehold').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_setplaceholder_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_setplaceholder_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearenable').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_disabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_disabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setenable').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_enabled_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_enabled_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setrtl').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_rtl_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_rtl_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearrtl').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_ltr_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_ltr_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('setread').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_readonly_'+themeChanged[i]);
                });
                browser.executeScript(function(){
                    document.getElementById('clearread').click();
                }).then(function(){
                    browser.compareScreen(element(by.className('control-panel-small-bigger')), 'util_default_input_small_bigger_wo_value_remve_readonly_'+themeChanged[i]);
                    browser.compareScreen(element(by.className('control-panel-bigger')), 'util_default_input_bigger_wo_value_remve_readonly_'+themeChanged[i]);
                });
            });
        });
    }
});

