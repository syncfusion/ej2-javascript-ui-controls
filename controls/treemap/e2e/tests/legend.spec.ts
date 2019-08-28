/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 200);
}

describe('TreeMap component test spec', () => {
    it('TreeMap legend mode', () => {
        browser.get(browser.basePath + '/demo/legend.html');
        browser.compareScreen(element(By.id('container')), 'legendmode1');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap level_fill', () => {
        browser.get(browser.basePath + '/demo/level_fill.html');
        browser.compareScreen(element(By.id('container')), 'level_fill');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap legend Default mode', () => {
        browser.get(browser.basePath + '/demo/legendtype2.html');
        browser.compareScreen(element(By.id('container')), 'legendmode2');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap legend Orientation', () => {
        browser.get(browser.basePath + '/demo/legend_orient.html');
        browser.compareScreen(element(By.id('container')), 'legend_orient');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap legend label display mode', () => {
        browser.get(browser.basePath + '/demo/legend_display.html');
        browser.compareScreen(element(By.id('container')), 'legend_display');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap level autofill false', () => {
        browser.get(browser.basePath + '/demo/level_auto.html');
        browser.compareScreen(element(By.id('container')), 'level_auto');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap level autofill false', () => {
        browser.get(browser.basePath + '/demo/level_autofill.html');
        browser.compareScreen(element(By.id('container')), 'level_autofill');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap show legend ', () => {
        browser.get(browser.basePath + '/demo/showlegend.html');
        browser.compareScreen(element(By.id('container')), 'show_legend');
    });
});
describe(' Flat Legend position ', () => {
    let property;
    it('Legend postion', () => {
        browser.get(browser.basePath + '/demo/flat_legendposition.html');
        browser.compareScreen(element(By.id('container')), 'legends_');
    });
    it('legend position Top', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "legends_Top");
        done();
    });
    it('legend position Right', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "legends_right");
        done();
    });
    it('legend position Left', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "legends_left");
        done();
    });
});
describe('Hierarchical Legend position ', () => {
    let property;
    it('Legend position Bottom', () => {
        browser.get(browser.basePath + '/demo/hier_legendposition.html');
        browser.compareScreen(element(By.id('container')), 'hier_legend_position1');
    });
    it('legend position Top', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_position2");
        done();
    });
    it('legend position Right', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_position3");
        done();
    });
    it('legend position Left', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_position4");
        done();
    });
});
describe('Hiearchical Legend alignment ', () => {
    let property;
    it('Legend alignment Center', () => {
        browser.get(browser.basePath + '/demo/hier_legendalign.html');
        browser.compareScreen(element(By.id('container')), 'hier_legend_align');
    });
    it('Legend alignment Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_align2");
        done();
    });
    it('Legend alignment Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_align3");
        done();
    });
});
describe('Flat Level header alignment ', () => {
    let property;
    it('Legend alignment Center', () => {
        browser.get(browser.basePath + '/demo/level_alignment.html');
        browser.compareScreen(element(By.id('container')), 'level_alignment1');
    });
    it('Legend alignment Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "level_alignment2");
        done();
    });
    it('Legend alignment Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "level_alignment3");
        done();
    });
});

describe('flat Legend alignment ', () => {
    let property;
    it('Legend alignment Center', () => {
        browser.get(browser.basePath + '/demo/flat_legendalignment.html');
        browser.compareScreen(element(By.id('container')), 'legends_center');
    });
    it('Legend alignment Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "legends_far");
        done();
    });
    it('Legend alignment Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "legends_near");
        done();
    });
});
describe('flat Legend mode', () => {
    let property;
    it('Legend mode default', () => {
        browser.get(browser.basePath + '/demo/flat_legend.html');
        browser.compareScreen(element(By.id('container')), 'legend_mode');
    });
    it('Legend mode interactive', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_mode2");
        done();
    });
});
describe('Hierachical  Legend mode', () => {
    let property;
    it('Legend mode default', () => {
        browser.get(browser.basePath + '/demo/hier_legend.html');
        browser.compareScreen(element(By.id('container')), 'hier_legend_mode');
    });
    it('Legend mode interactive', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_legend_mode2");
        done();
    });
});
describe('flat level template postion', () => {
    let property;
    it('Legendlevel template postion topleft', () => {
        browser.get(browser.basePath + '/demo/header_template.html');
        browser.compareScreen(element(By.id('container')), 'hier_level_topleft');
    });
    it('Legend mode interactive topcenter', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_topcenter");
        done();
    });
    it('Legend mode interactive topright', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_leveld_topright");
        done();
    });
    it('Legend mode interactive centerleft', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_centerleft");
        done();
    });
    it('Legend mode interactive center', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_center");
        done();
    });
    it('Legend mode interactive centerright', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_centerright");
        done();
    });
    it('Legend mode interactive bottomleft', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_bottomleft");
        done();
    });
    it('Legend mode interactive bottom', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_bottom");
        done();
    });
    it('Legend mode interactive bottomright', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_level_bottomright");
        done();
    });
});