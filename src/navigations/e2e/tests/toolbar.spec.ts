
import { browser, element, By, ElementArrayFinder, Key, WebElement, protractor } from "@syncfusion/ej2-base/e2e/index";
import { ElementFinder } from "protractor/built/element";
let themes: String[] = ["Fabric", "Bootstrap"];
let EC = browser.ExpectedConditions;

function tbarUIScrollInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
     tbarFocusInteraction(theme);
     tbarHoverActiveInteraction(theme);
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

function tbarUIPopupInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
     tbarFoucsPopup_Interaction(theme);
     tbarHoverActivePopup_Interaction(theme);
    }
}

function tbarFoucsPopup_Interaction(theme: String) {
    let eleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-tbar-btn'));
    let PopEleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar .e-popup .e-tbar-btn'));
    let navEle: WebElement = element.all(By.css('.e-toolbar .e-hor-nav')).first();
    eleLoc.get(1).sendKeys(Key.RIGHT);
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbarPop_item_focus_3rdItem_' + theme);
    eleLoc.get(2).sendKeys(Key.TAB);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_Popup_navi_focus_' + theme);
    navEle.sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbarPop_item_focus_3rdItem_' + theme);
    browser.actions().mouseDown(navEle).mouseUp(navEle).perform();
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(PopEleLoc.get(1)), 5000);
    navEle.sendKeys(Key.DOWN);
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_1stitem_down_focus_' + theme);
    if (browser.browserName === 'internet explorer') {
        browser.actions().mouseDown(navEle).mouseUp(navEle).perform();
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(PopEleLoc.get(1)), 5000); }
    PopEleLoc.get(1).sendKeys(Key.DOWN)
    load_delay(400, 'sleep')
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_2nditem_down_focus_' + theme);
    if (browser.browserName === 'internet explorer') {
        browser.actions().mouseDown(navEle).mouseUp(navEle).perform();
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(PopEleLoc.get(1)), 5000); }
    PopEleLoc.get(1).sendKeys(Key.UP)
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_1stitem_down_focus_' + theme);
    browser.actions().mouseDown(navEle).mouseUp(navEle).perform();
}


function tbarHoverActivePopup_Interaction(theme: String) {
    let eleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-tbar-btn'));
    let PopEleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar .e-popup .e-tbar-btn'));
    let navEle: WebElement = element.all(By.css('.e-toolbar .e-hor-nav')).first();
    let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
    browser.actions().mouseMove(eleLoc.get(1)).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_1stitem_hover_' + theme);
    browser.actions().mouseMove(navEle).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_nav_hover_' + theme);
    browser.actions().mouseDown(eleLoc.get(1)).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_1stitem_active_' + theme);
    element(By.tagName('body')).click();
    browser.actions().mouseDown(navEle).perform()
    if (browser.browserName === 'MicrosoftEdge') {
        load_delay(300, 'sleep') }
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popup_nav_active_' + theme);
    element(By.tagName('body')).click();
    browser.executeScript(pop_Nav);
    load_delay(400, 'sleep')
    browser.actions().mouseMove(PopEleLoc.get(1)).perform()
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popupOpen_1stItem_hover_' + theme);
    element(By.tagName('body')).click();
    browser.actions().mouseDown(PopEleLoc.get(2)).perform();
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_popupOpen_2ndItem_active_' + theme);
}

function tbarFocusInteraction(theme: String) {
    let eleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-tbar-btn'));
    let navEle: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-scroll-nav'));
    // focus throught keyboard
    browser.actions().mouseDown(navEle.get(1)).mouseUp(navEle.get(1)).perform();
    element(By.tagName('body')).click();
    eleLoc.get(0).sendKeys(Key.RIGHT);
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_item_focus_2ndItem_' + theme);
    eleLoc.get(1).sendKeys(Key.TAB);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_right_navi_focus_' + theme);
    navEle.get(1).sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_item_focus_2ndItem_' + theme);
    eleLoc.get(1).sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_left_navi_focus_' + theme);
}
function tbarHoverActiveInteraction(theme: String) {
    let eleLoc: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-tbar-btn'));
    let navEle: ElementArrayFinder = element.all(By.css('.e-toolbar-items .e-scroll-nav'));
    browser.actions().mouseMove(eleLoc.get(2)).perform()
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_nrml_hover_' + theme);
    element(By.tagName('body')).click();
    browser.actions().mouseMove(navEle.get(1)).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_right_navi_hover_' + theme);
    browser.actions().mouseMove(navEle.get(0)).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_left_navi_hover_' + theme);
    browser.actions().mouseDown(eleLoc.get(3)).perform();
    browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_item_active_4rtItem_' + theme);
    element(By.tagName('body')).click();
    // let divAppend = "var v=document.createElement('div'); v.id='screenCapture'; v.style.height='63px';v.style.width= '55px';v.style.position='absolute';v.style.left='859px';v.style.top='90px';document.body.appendChild(v);";
    // browser.executeScript(divAppend);
    // if (browser.browserName != 'internet explorer') {  // IE alome had an issue in capturing active state element so we ignored.
    // browser.actions().mouseDown(navEle.get(1)).perform().then(function () {
    //     load_delay(300, 'sleep')
    //       browser.compareScreen(element(By.id('screenCapture')), 'default_tbar_right_navi_active_' + theme);
    //       // While performing mousedown continous scroll was triggered so had a problem in image comparing.
    //   });
    // }
}

describe('Default-Toolbar Theme Wise UI Testing', function () {
    it('UI Interactions Focus Testing-Material', function () {
        browser.load('/demos/Toolbar/default-scroll.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
            load_delay(300, 'sleep') }
        tbarUIScrollInteraction('Material');
        browser.load('/demos/Toolbar/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
            load_delay(300, 'sleep') }
        tbarUIPopupInteraction('Material')
    },1200000);
    for( let i = 0 ; i < themes.length; i++ ) {
    it("UI Interactions Focus Testing " +themes[i]+"  theme ", function () {
        let theme: String = themes[i];
        browser.load('/demos/Toolbar/default-scroll.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
            let fileName: string = '../../../styles/'+ theme.toLowerCase() +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path);
            load_delay(600, 'sleep')
            tbarUIScrollInteraction(theme);
        browser.load('/demos/Toolbar/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
            fileName = '../../../styles/'+ theme.toLowerCase() +'.css';
            path = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ fileName+"')";
            browser.executeScript(path);
            load_delay(600, 'sleep')
            if (browser.browserName === 'MicrosoftEdge') {
                load_delay(300, 'sleep') }
           tbarUIPopupInteraction(theme);
    },1200000);
    }
 });

describe('Default-Toolbar', function () {
    it('default rendering only icons and separator', function () {
        browser.load('/demos/Toolbar/default.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_nrml');
    },120000);
    it('default rendering only icons without separator', function () {
        browser.load('/demos/Toolbar/default-no-separator.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_no_separator');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_no_separator_nrml');
    },120000);
    it('default rendering only icons with text', function () {
        browser.load('/demos/Toolbar/default-with-text.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icontext');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icontext_nrml');
    },120000);
    it('default rendering only icons and iocn with text', function () {
        browser.load('/demos/Toolbar/default-with-text-no-separator.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icontext_noSep');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icontext_noSep_nrml');
    },120000);
    it('default rendering only icons and iocn with text', function () {
        browser.load('/demos/Toolbar/default-with-text-icon.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icon_icontext');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_icon_icontext_nrml');
    },120000);
});


describe('Toolbar- alignment Feature', function () {
    it('default alignemnt in toolbar', function () {
        browser.load('/demos/Toolbar/default-align.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_align');
    },120000);
    it('default alignemnt in toolbar with center', function () {
        browser.load('/demos/Toolbar/default-align-center.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_align_center');
    },120000);
});

describe('Toolbar-popup', function () {
    it('default rendering', function () {
        browser.load('/demos/Toolbar/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup');
        browser.executeScript("document.getElementById('btn_mouse').click();")
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_nrml');
        browser.executeScript("document.getElementById('ej2Toolbar_pop_nav').click();")
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_open_nrml');
    },120000);
    it('Toolbar popup open and close', function () {
        browser.load('/demos/Toolbar/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup');
        if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementsByTagName('div')[0].style.height = '600px'");
        }
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_close');
    },120000);
    it('Toolbar popup open and close with textshown', function () {
        browser.load('/demos/Toolbar/popup-textShown.html');
        load_delay(2000, 'presence',element(By.id('ej2Toolbar_pop_nav')));
        let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
        if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementsByTagName('div')[0].style.height = '600px'");
        }
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_textShown_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_textShown_close');
    },120000);
    it('Toolbar popup open and close with priority', function () {
        browser.load('/demos/Toolbar/popup-with-priority.html');
        load_delay(2000, 'presence',element(By.id('ej2Toolbar_pop_nav')));
        let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_close');
    },120000);
    it('Toolbar popup open and close with priority textShown', function () {
        browser.load('/demos/Toolbar/popup-with-priority-textShown.html');
        load_delay(2000, 'presence',element(By.id('ej2Toolbar_pop_nav')));
        let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
        if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementsByTagName('div')[0].style.height = '600px'");
        }
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_textShown_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_textShown_close');
    },120000);
    it('Toolbar popup open and close with alignment and priority', function () {
        browser.load('/demos/Toolbar/popup-with-priority-align.html');
        load_delay(2000, 'presence',element(By.id('ej2Toolbar_pop_nav')));
        let pop_Nav: string = "document.getElementById('ej2Toolbar_pop_nav').click();";
        if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementsByTagName('div')[0].style.height = '600px'");
        }
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_pop_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_align_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_dflt_popup_priority_align_close');
    },120000);
});

describe('Toolbar-Scrollable', function () {
    it('default scrolling action', function () {
        browser.load('/demos/Toolbar/default-scroll.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_scroll_left_disable');
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();";
        browser.executeScript(rightArrow)
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_scroll_left-active');
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow)
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_scroll_right-disable');
        let leftArrow: string = "document.querySelector('.e-nav-left-arrow').click();";
        browser.executeScript(leftArrow)
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_scroll_right-active');
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow);
        browser.executeScript("document.getElementsByTagName('body')[0].click();")
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Toolbar')), 'default_tbar_scroll_left_disable');
    },120000);
});

describe(' Toolbar RTL mode Testing', function () {
    it('default RTL mode Testing', function () {
        browser.load('/demos/Toolbar/rtl.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_scrollable_rtl');
    },120000);
    it('Toolbar RTL popup mode', function () {
        browser.load('/demos/Toolbar/rtl.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        let rtlSwitch: string = "document.getElementById('modeSwitch').click();";
        let pop_Nav: string = "document.getElementById('ej2Toolbar_Rtl_nav').click();";
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();";
        let leftArrow: string = "document.querySelector('.e-nav-left-arrow').click();";
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'default_tbar_scroll_rtl_left_disable');
        browser.executeScript(rightArrow)
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_scroll_rtl_left-active');
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow)
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_scroll_rtl_right-disable');
        browser.executeScript(leftArrow)
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_scroll_rtl_right-active');
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow); browser.executeScript(leftArrow);
        browser.executeScript(leftArrow);
        browser.executeScript("document.getElementsByTagName('body')[0].click();")
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'default_tbar_scroll_rtl_left_disable');
        browser.executeScript(rtlSwitch)
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_popup_rtl');
        browser.executeScript(pop_Nav)
        load_delay(2000, 'visible', element(By.id('ej2Toolbar_Rtl_popup')));
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_rtl_popup_open');
        browser.executeScript(pop_Nav)
        if (browser.browserName === 'firefox') {
            load_delay(300, 'sleep') }
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_rtl_popup_close');
        browser.executeScript(rtlSwitch)
        browser.compareScreen(element(By.id('ej2Toolbar_Rtl')), 'tbar_scrollable_rtl');
    },120000);
});

describe('Toolbar- public Method testing', function () {
    it('Add item public method', function () {
        browser.load('/demos/Toolbar/api.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btnAdd').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_add_api');
    },120000);
    it('Add multi item public method with multiple element', function () {
        browser.load('/demos/Toolbar/api.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btnMultiAdd').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_multiAdd_api');
    },120000);
    it('Add multi item public method remove element', function () {
        browser.load('/demos/Toolbar/api.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btnRemove').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_remove_api');
    },120000);
    it('Add multi item public method Disable/Enable element', function () {
        browser.load('/demos/Toolbar/api.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        let enable: string = "document.getElementById('btnEnable').click();";
        browser.executeScript(enable)
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_Disable_api');
        browser.executeScript(enable)
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_Enable_api');
    },120000);
    it('Add multi item and remove public method Combination', function () {
        browser.load('/demos/Toolbar/api.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btnAdd').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_add_api');
        browser.executeScript("document.getElementById('btnMultiAdd').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_multiAddCom_api');
        browser.executeScript("document.getElementById('btnRemove').click();")
        browser.compareScreen(element(By.id('ej2Toolbar_api')), 'tbar_removeCom_api');
    },120000);
    it('Add multi item public method with alignment feature', function () {
        browser.load('/demos/Toolbar/default-align.html');
        load_delay(2000, 'presence',element(By.css('.e-toolbar.e-keyboard.e-control')));
        let addItem: string = "document.getElementById('btn_AddItems').click();";
        let removeItems: string = "document.getElementById('btn_removeItems').click();";
        browser.executeScript(addItem);
        browser.executeScript(addItem);
        browser.executeScript(addItem)
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_addAlign_api');
        browser.executeScript(removeItems)
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_removeAlign_api');
        browser.executeScript(removeItems)
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_removeAlign1_api');
        browser.executeScript(removeItems)
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_removeAlign2_api');
        browser.executeScript(removeItems)
        browser.compareScreen(element(By.id('ej2Toolbar')), 'tbar_removeAlign3_api');
    },120000);
});