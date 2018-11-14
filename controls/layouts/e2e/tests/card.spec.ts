/**
 * Card E2E Test Cases
 */

import { browser, element, WebElement, By, ProtractorExpectedConditions, ElementArrayFinder, Key } from '@syncfusion/ej2-base/e2e/index';
import { ElementFinder } from 'protractor/built/element';
let themes: string[] = ['Fabric', 'Bootstrap', 'Highcontrast'];
let EC: ProtractorExpectedConditions = browser.ExpectedConditions;
let bgrScript: string = 'document.body.classList.add("e-bigger")';

describe('Default-Card with header UI Testing', () => {
    it('Default-Card with header UI Testing-Material', () => {
        browser.load('/demos/card/card_header.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        cardFunctionalities('card_header', 'material', 'card');
        Card('card_header_card_1_material', 'card_1');
        Card('card_header_card_2_material', 'card_2');
        browser.executeScript(bgrScript);
        Card('card_header_bgr_material', 'card');
        Card('card_header_card_1_bgr_material', 'card_1');
        Card('card_header_card_2_bgr_material', 'card_2');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with header UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_header.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            cardFunctionalities('card_header', theme, 'card');
            Card('card_header_card_1_' + theme, 'card_1');
            Card('card_header_card_2_' + theme, 'card_2');
            browser.executeScript(bgrScript);
            Card('card_header_bgr_' + theme, 'card');
            Card('card_header_card_1_bgr_' + theme, 'card_1');
            Card('card_header_card_2_bgr_' + theme, 'card_2');
        }, 1200000);
    }
});

describe('Default-Card with header Text UI Testing', () => {
    it('Default-Card with header UI Testing-Material', () => {
        browser.load('/demos/card/card_header_text.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        cardFunctionalities('card_header_txt', 'material', 'card');
        Card('card_header_txt_card_1_material', 'card_1');
        Card('card_header_txt_card_2_material', 'card_2');
        browser.executeScript(bgrScript);
        Card('card_header_txt_bgr_material', 'card');
        Card('card_header_txt_card_1_bgr_material', 'card_1');
        Card('card_header_txt_card_2_bgr_material', 'card_2');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with header UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_header_text.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            cardFunctionalities('card_header_txt', theme, 'card');
            Card('card_header_txt_card_1_' + theme, 'card_1');
            Card('card_header_txt_card_2_' + theme, 'card_2');
            browser.executeScript(bgrScript);
            Card('card_header_txt_bgr_' + theme, 'card');
            Card('card_header_txt_card_1_bgr_' + theme, 'card_1');
            Card('card_header_txt_card_2_bgr_' + theme, 'card_2');
        }, 1200000);
    }
});

describe('Default-Card with content UI Testing', () => {
    it('Default-Card with header UI Testing-Material', () => {
        browser.load('/demos/card/card_content.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        cardFunctionalities('card_content', 'material', 'card');
        Card('card_content_card_1_material', 'card_1');
        Card('card_content_card_2_material', 'card_2');
        browser.executeScript(bgrScript);
        Card('card_content_bgr_material', 'card');
        Card('card_content_card_1_bgr_material', 'card_1');
        Card('card_content_card_2_bgr_material', 'card_2');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with header UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_content.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            cardFunctionalities('card_content', theme, 'card');
            Card('card_content_card_1_' + theme, 'card_1');
            Card('card_content_card_2_' + theme, 'card_2');
            browser.executeScript(bgrScript);
            Card('card_content_bgr_' + theme, 'card');
            Card('card_content_card_1_bgr_' + theme, 'card_1');
            Card('card_content_card_2_bgr_' + theme, 'card_2');
        }, 1200000);
    }
});

describe('Default-Card with text_overflow UI Testing', () => {
    it('Default-Card with header UI Testing-Material', () => {
        browser.load('/demos/card/card_textOverflow.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        cardFunctionalities('card_text_overflow', 'material', 'card');
        Card('card_text_overflow_card_1_material', 'card_1');
        Card('card_text_overflow_card_2_material', 'card_2');
      //  Card('card_text_overflow_card_3_material', 'card_3');
        Card('card_text_overflow_card_4_material', 'card_4');
        browser.executeScript(bgrScript);
        Card('card_text_overflow_bgr_material', 'card');
        Card('card_text_overflow_card_1_bgr_material', 'card_1');
        Card('card_text_overflow_card_2_bgr_material', 'card_2');
     //   Card('card_text_overflow_card_3_bgr_material', 'card_3');
        Card('card_text_overflow_card_4_bgr_material', 'card_4');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with header UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_textOverflow.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            cardFunctionalities('card_text_overflow', theme, 'card');
            Card('card_text_overflow_card_1_' + theme, 'card_1');
            Card('card_text_overflow_card_2_' + theme, 'card_2');
        //    Card('card_text_overflow_card_3_' + theme, 'card_3');
            Card('card_text_overflow_card_4_' + theme, 'card_4');
            browser.executeScript(bgrScript);
            Card('card_text_overflow_bgr_' + theme, 'card');
            Card('card_text_overflow_card_1_bgr_' + theme, 'card_1');
            Card('card_text_overflow_card_2_bgr_' + theme, 'card_2');
          //  Card('card_text_overflow_card_3_bgr_' + theme, 'card_3');
            Card('card_text_overflow_card_4_bgr_' + theme, 'card_4');
        }, 1200000);
    }
});


describe('Default-Card with Image UI Testing', () => {
    it('Default-Card with Image UI Testing-Material', () => {
        browser.load('/demos/card/card_image.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_image_material', 'card');
        Card('card_image_card_1_material', 'card_1');
        Card('card_image_card_2_material', 'card_2');
        browser.executeScript(bgrScript);
        Card('card_image_bgr_material', 'card');
        Card('card_image_card_1_bgr_material', 'card_1');
        Card('card_image_card_2_bgr_material', 'card_2');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with Image UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_image.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            Card('card_image_' + theme, 'card');
            Card('card_image_card_1_' + theme, 'card_1');
            Card('card_image_card_2_' + theme, 'card_2');
            browser.executeScript(bgrScript);
            Card('card_image_bgr_' + theme, 'card');
            Card('card_image_card_1_bgr_' + theme, 'card_1');
            Card('card_image_card_2_bgr_' + theme, 'card_2');
        }, 1200000);
    }
});

describe('Default-Card with Action_Btn UI Testing', () => {
    it('Default-Card with Action_Btn UI Testing-Material', () => {
        browser.load('/demos/card/card_action_btn.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_action_btn_material', 'card');
        Card('card_action_btn_card_1_material', 'card_1');
        CardHover('card_action_btn_button_hover_material', 'card', '.e-card-actions .e-card-btn', 0);
        CardFocus('card_action_btn_button_focus_material', 'card', '.e-card-actions .e-card-btn', 0);
        CardActive('card_action_btn_button_active_material', 'card', '.e-card-actions .e-card-btn', 0);
        element(By.tagName('body')).click();
        CardHover('card_action_btn_card_1_button_hover_material', 'card_1', '.e-card-actions .e-card-btn', 1);
        CardFocus('card_action_btn_card_1_button_focus_material', 'card_1', '.e-card-actions .e-card-btn', 1);
        CardActive('card_action_btn_card_1_button_active_material', 'card_1', '.e-card-actions .e-card-btn', 1);
        element(By.tagName('body')).click();
        browser.executeScript(bgrScript);
        Card('card_action_btn_bgr_material', 'card');
        Card('card_action_btn_card_1_bgr_material', 'card_1');

    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with Action_Btn UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_action_btn.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            Card('card_action_btn_' + theme, 'card');
            Card('card_action_btn_card_1_' + theme, 'card_1');
            CardHover('card_action_btn_button_hover_' + theme, 'card', '.e-card-actions .e-card-btn', 0);
            CardFocus('card_action_btn_button_focus_' + theme, 'card', '.e-card-actions .e-card-btn', 0);
            CardActive('card_action_btn_button_active_' + theme, 'card', '.e-card-actions .e-card-btn', 0);
            element(By.tagName('body')).click();
            CardHover('card_action_btn_card_1_button_hover_' + theme, 'card_1', '.e-card-actions .e-card-btn', 1);
            CardFocus('card_action_btn_card_1_button_focus_' + theme, 'card_1', '.e-card-actions .e-card-btn', 1);
            CardActive('card_action_btn_card_1_button_active_' + theme, 'card_1', '.e-card-actions .e-card-btn', 1);
            element(By.tagName('body')).click();
            browser.executeScript(bgrScript);
            Card('card_action_btn_bgr_' + theme, 'card');
            Card('card_action_btn_card_1_bgr_' + theme, 'card_1');
        }, 1200000);
    }
});

describe('Default-Card with Horizontal UI Testing', () => {
    it('Default-Card with Horizontal UI Testing-Material', () => {
        browser.load('/demos/card/card_horizontal.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_horizontal_material', 'card');
        Card('card_horizontal_card_1_material', 'card_1');
        browser.executeScript(bgrScript);
        Card('card_horizontal_bgr_material', 'card');
        Card('card_horizontal_card_1_bgr_material', 'card_1');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with Horizontal UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_horizontal.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            Card('card_horizontal_' + theme, 'card');
            Card('card_horizontal_card_1_' + theme, 'card_1');
            browser.executeScript(bgrScript);
            Card('card_horizontal_bgr_' + theme, 'card');
            Card('card_horizontal_card_1_bgr_' + theme, 'card_1');
        }, 1200000);
    }
});

describe('Default-Card with Stacked UI Testing', () => {
    it('Default-Card with Stacked UI Testing-Material', () => {
        browser.load('/demos/card/card_stacked.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_stacked_material', 'card');
        let script: string = 'document.querySelector(".e-card").classList.remove("e-card-horizontal")';
        browser.executeScript(script);
        Card('card_stacked_nrml_material', 'card');
        let scriptAdd: string = 'document.querySelector(".e-card").classList.add("e-card-horizontal")';
        browser.executeScript(scriptAdd);
        browser.executeScript(bgrScript);
        Card('card_stacked_bgr_material', 'card');
    }, 1200000);
    for (let i: number = 0; i < themes.length; i++) {
        it('Default-Card with Stacked UI Testing ' + themes[i] + ' theme ', () => {
            let theme: string = themes[i];
            browser.load('/demos/card/card_stacked.html');
            load_delay(2000, 'presence', element(By.css('.e-card')));
            let file: string = '../../../styles/' + theme.toLowerCase() + '.css';
            let path: string = '((document.getElementsByTagName("head")[0]).querySelector("link")).setAttribute("href","' + file + '")';
            browser.executeScript(path);
            load_delay(1000, 'sleep');
            Card('card_stacked_' + theme, 'card');
            browser.executeScript(bgrScript);
            Card('card_stacked_bgr_' + theme, 'card');
        }, 1200000);
    }
});

describe('Default-Card with Text alignment UI Testing', () => {
    it('Default-Card with alignment UI Testing-Material', () => {
        browser.load('/demos/card/card_alignment.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_alignment_material', 'card_alignment');
        let script: string = 'document.getElementById("card_alignment").style.textAlign = "center"';
        browser.executeScript(script);
        Card('card_alignment_center', 'card_alignment');
        script = 'document.getElementById("card_alignment").style.textAlign = "right"';
        browser.executeScript(script);
        Card('card_alignment_right', 'card_alignment');
        script = 'document.getElementById("card_alignment").style.textAlign = "justify"';
        browser.executeScript(script);
        Card('card_alignment_justify', 'card_alignment');
        script = 'document.getElementById("card_alignment").style.textAlign = "left"';
        browser.executeScript(script);
        Card('card_alignment_material', 'card_alignment');
        browser.executeScript(bgrScript);
        Card('card_alignment_bgr_material', 'card_alignment');
    }, 1200000);
});

describe('Default-Card with Image-title-Pos UI Testing', () => {
    it('Default-Card with Image-title-Pos UI Testing', () => {
        browser.load('/demos/card/card_image_title.html');
        load_delay(2000, 'presence', element(By.css('.e-card')));
        Card('card_image_title_bottomLeft', 'card');
        Card('card_image_title_topLeft', 'card_1');
        Card('card_image_title_topRight', 'card_2');
        Card('card_image_title_bottomRight', 'card_3');
        browser.executeScript(bgrScript);
        Card('card_image_title_bottomLeft_bgr', 'card');
        Card('card_image_title_topLeft_bgr', 'card_1');
        Card('card_image_title_topRight_bgr', 'card_2');
        Card('card_image_title_bottomRight_bgr', 'card_3');
    }, 1200000);
});


function load_delay(waitTime: number, type: string, element?: WebElement): void {
    switch (type) {
        case 'presence':
            browser.wait(EC.presenceOf(<ElementFinder>element), waitTime);
            break;
        case 'visible':
            browser.wait(EC.visibilityOf(<ElementFinder>element), waitTime);
            break;
        case 'sleep':
            browser.driver.sleep(waitTime);
            break;
    }
}

function cardFunctionalities(sampleName: string, themename: string, selector: string): void {
    Card(sampleName + '_' + themename, selector);
    CardHover(sampleName + '_hover_' + themename, selector);
    //  CardFocus(sampleName + '_focus_' + themename, selector);
    CardActive(sampleName + '_active_' + themename, selector);
}

function Card(fileName: string, selector: string): void {
    browser.compareScreen(element(By.id(selector)), fileName);
}

function CardHover(fileName: string, selector: string, hoverSelector?: string, index?: number): void {
    if (browser.browserName !== 'firefox') {
        if (hoverSelector === undefined) {
            hoverSelector = '.e-card';
        }
        if (index === undefined) {
            index = 0;
        }
        let cardEle: ElementArrayFinder = element.all(By.css(hoverSelector));
        browser.actions().mouseMove(cardEle.get(index)).perform();
        load_delay(400, 'sleep');
        browser.compareScreen(element(By.id(selector)), fileName);
    }
}

function CardActive(fileName: string, selector: string, activeSelector?: string, index?: number): void {
    if (browser.browserName !== 'firefox') {
        if (activeSelector === undefined) {
            activeSelector = '.e-card';
        }
        if (index === undefined) {
            index = 0;
        }
        let cardEle: ElementArrayFinder = element.all(By.css(activeSelector));
        cardEle.get(index).sendKeys(Key.ENTER);
        load_delay(400, 'sleep');
        browser.compareScreen(element(By.id(selector)), fileName);
    }
}

function CardFocus(fileName: string, selector: string, focusSelector?: string, index?: number): void {
    if (browser.browserName !== 'firefox') {
        if (focusSelector === undefined) {
            focusSelector = '.e-card';
        }
        if (index === undefined) {
            index = 0;
        }
        let cardEle: ElementArrayFinder = element.all(By.css(focusSelector));
        cardEle.get(index).sendKeys(Key.TAB);
        load_delay(400, 'sleep');
        browser.compareScreen(element(By.id(selector)), fileName);
    }
}
