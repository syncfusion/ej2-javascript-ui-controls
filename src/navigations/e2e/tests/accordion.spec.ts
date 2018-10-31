import { browser, element, Key, WebElement , ElementArrayFinder, By } from "@syncfusion/ej2-base/e2e/index";
import { ElementFinder } from "protractor/built/element";
let themes: String[] = ["Fabric", "Bootstrap"];
let EC = browser.ExpectedConditions;

function accordionInteraction(theme: String) {
     if (browser.browserName !== 'firefox') {
         if (theme !== 'Material') {
            accordionHoverActiveInteraction(theme);
         }
         accordionFocusInteraction(theme);
     }
}

function load_delay(waitTime: number, type: string, element?: WebElement) {
    switch(type) {
        case 'presence':
            browser.wait( EC.presenceOf(<ElementFinder>element), waitTime );
            break;
        case 'visible':
            browser.wait( EC.visibilityOf(<ElementFinder>element), waitTime );
            break;
        case 'sleep':
            browser.driver.sleep(waitTime);
            break;
    }
}


function nestedAccordionInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
        nestedAccordionFocusInteraction(theme);
        if (theme !== 'Material') {
           nestedAccordionHoverActiveInteraction(theme);
        }
    }
}

function accordionFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accordion .e-acrdn-item .e-acrdn-header'));
    browser.actions().mouseDown(navEle.get(0)).perform();
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_item_focus_1stItem' + theme);
    navEle.get(0).sendKeys(Key.ENTER);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_1stitem_active_' + theme);
    navEle.get(0).sendKeys(Key.TAB);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_item_focus_2ndItem_' + theme);
    navEle.get(1).sendKeys(Key.ENTER);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_2ndItem_active_' + theme);
    navEle.get(2).sendKeys(Key.ENTER);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_3rdItem_active_' + theme);
    navEle.get(2).sendKeys(Key.ENTER);
}

function accordionHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accordion .e-acrdn-item .e-acrdn-header'));
    browser.actions().mouseMove(navEle.get(0)).perform();
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_item_hover_1stItem_' + theme);   
    browser.actions().mouseMove(navEle.get(1)).perform();
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_item_hover_2ndItem_' + theme);
    browser.actions().mouseMove(navEle.get(2)).perform();
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('ej2Accordion')), 'default_accordion_item_hover_active_3rdItem_' + theme);  
}

function nestedAccordionFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accordion .e-acrdn-item .e-acrdn-header'));
    browser.actions().mouseDown(navEle.get(1)).perform();
    navEle.get(1).sendKeys(Key.ENTER);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('element')), 'nested_accordion_2ndItem_active_' + theme);
    navEle.get(1).sendKeys(Key.TAB);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('element')), 'nested_accordion_item_focus_2ndItem_1stchild_' + theme);
    navEle.get(2).sendKeys(Key.TAB);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('element')), 'nested_accordion_item_focus_2ndItem_2ndchild_' + theme);
    navEle.get(3).sendKeys(Key.ENTER);
    if (browser.browserName !== 'MicrosoftEdge') { load_delay(300, 'sleep') }
    else { load_delay(400, 'sleep') }
    browser.compareScreen(element(By.id('element')), 'nested_accordion_2ndItem_2ndchild_active_' + theme);
    if (browser.browserName !== 'chrome')
    {
    navEle.get(1).sendKeys(Key.ENTER);
    navEle.get(0).sendKeys(Key.ENTER);
    browser.actions().mouseUp(navEle.get(1)).perform();
    }
}

function nestedAccordionHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accordion .e-acrdn-item .e-acrdn-header'));
    element(By.tagName('body')).click();
    if (browser.browserName === 'chrome')
    {
    navEle.get(1).sendKeys(Key.ENTER);
    navEle.get(0).sendKeys(Key.ENTER);
    }
    browser.actions().mouseMove(navEle.get(1)).perform();
    load_delay(400, 'sleep')
    browser.compareScreen(element(By.id('element')), 'nested_accordion_item_hover_1stItem_first_child_' + theme);   
    element(By.tagName('body')).click();
    browser.actions().mouseMove(navEle.get(2)).perform();
    load_delay(400, 'sleep')
    browser.compareScreen(element(By.id('element')), 'nested_accordion_item_hover_1stItem_second_child_' + theme);
}

describe('Default-Accordion Theme Wise UI Testing', function () {
    it('UI Interactions Focus Testing-Material', function () {
        browser.load('/demos/Accordion/default.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
            load_delay(200, 'sleep') }
            accordionInteraction('Material');
        browser.load('/demos/Accordion/nested-material.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
            load_delay(200, 'sleep') }
            nestedAccordionInteraction('Material');
    },1200000);
    for( let i = 0 ; i < themes.length; i++ ) {
    it("UI Interactions Focus Testing " +themes[i]+"  theme ", function () {
        let theme: String = themes[i];
        browser.load('/demos/Accordion/default.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
            let fileName: string = '../../../styles/'+ theme.toLowerCase() +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path);
            accordionInteraction(theme);
        browser.load('/demos/Accordion/nested-material.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
            fileName = '../../../styles/'+ theme.toLowerCase() +'.css';
            path = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path);
            load_delay(600, 'sleep')
            nestedAccordionInteraction(theme);
    },1200000);
    }
 });

 describe('Accordion content template sample', function () {
    it('Expand first and second content template', function () {
        browser.load('/demos/Accordion/content-template.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_0').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_first_and_second_content_template');
    },1200000);
    it('Expand second and third content template', function () {
        browser.load('/demos/Accordion/content-template.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_4').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_second_and_third_content_template');
    },1200000);
});

describe('Accordion API sample to perform Add, delete and select item', function () {
    it('Add new item to accordion sample', function () {
        browser.load('/demos/Accordion/Api.html');
        load_delay(4000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_Add').click();")
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_api_add_item');
    },1200000);
    it('Removes the selected item from the API sample', function () {
        browser.load('/demos/Accordion/Api.html');
        load_delay(4000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_Remove').click();")
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_api_remove_item');
    },1200000);
});

describe('Accordion API sample to perform expand all item', function () {
    it('Expand all items from the API sample', function () {
        browser.load('/demos/Accordion/Api.html');
        load_delay(4000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_expd-all').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_api_expand_all');
    },1200000);
});

describe('Accordion API sample to perform enable and disable the item', function () {
    it('Disable first item from API sample', function () {
        browser.load('/demos/Accordion/Api.html');
        load_delay(4000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_dspl-frst').click();")
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_api_disable_first_item');   
    },1200000);
    it('Hide first item from API sample', function () {
        browser.load('/demos/Accordion/Api.html');
        load_delay(4000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_hide-frst').click();")
        browser.compareScreen(element(By.id('ej2Accordion')), 'accordion_api_hide_first_item');
    },1200000);
});

describe('Accordion sample with template rendering', function () {
    it('Render first template', function () {
        browser.load('/demos/Accordion/template.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_0').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'template_01');
    },1200000);
    it('Render first and second template', function () {
        browser.load('/demos/Accordion/template.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_3').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'template_02');
    },1200000);
});

describe('Accordion sample with ajax content', function () {
    it('Render third ajax content', function () {
        browser.load('/demos/Accordion/Ajax-content.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_4').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'third_ajax_content');
    },1200000);
});

describe('Accordion sample with custom theme', function () {
    it('render first custom theme content', function () {
        browser.load('/demos/Accordion/custom_theme.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_0').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'first_custom_theme_content');
    },1200000);
    it('render second custom theme content', function () {
        browser.load('/demos/Accordion/custom_theme.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_2').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'second_custom_theme_content');
    },1200000);
    it('render third custom theme content', function () {
        browser.load('/demos/Accordion/custom_theme.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'third_custom_theme_content');
    },1200000);
});

describe('Accordion icons sample', function () {
    it('icons content in material', function () {
        browser.load('/demos/Accordion/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_0').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'icons_content_material');
    },1200000);
    it('icons content in fabric', function () {
        browser.load('/demos/Accordion/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fabric').click();")
        load_delay(1000, 'sleep')
        browser.executeScript("document.getElementById('acrdn_item_2').click();")
        load_delay(1000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'icons_content_fabric');
    },1200000);
    it('icons content in bootstrap', function () {
        browser.load('/demos/Accordion/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_boot').click();")
        load_delay(1000, 'sleep')
        browser.executeScript("document.getElementById('acrdn_item_4').click();")
        load_delay(1000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'icons_content_bootstrap');
    },1200000);
});

describe('Accordion rtl sample', function () {
    it('rtl content in material', function () {
        browser.load('/demos/Accordion/rtl.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('acrdn_item_0').click();")
        load_delay(2000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'rtl_content_material');
    },1200000);
    it('rtl content in fabric', function () {
        browser.load('/demos/Accordion/rtl.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fabric').click();")
        load_delay(1000, 'sleep')
        browser.executeScript("document.getElementById('acrdn_item_2').click();")
        load_delay(1000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'rtl_content_fabric');
    },1200000);
    it('rtl content in bootstrap', function () {
        browser.load('/demos/Accordion/rtl.html');
        load_delay(2000, 'presence',element(By.css('.e-accordion.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_boot').click();")
        load_delay(1000, 'sleep')
        browser.executeScript("document.getElementById('acrdn_item_4').click();")
        load_delay(1000, 'sleep')
        browser.compareScreen(element(By.id('ej2Accordion')), 'rtl_content_bootstrap');
    },1200000);
});
