/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('flat title alignment ', () => {
    let property;
    it('Legend title Center', () => {
        browser.get(browser.basePath + '/demo/flat_title.html');
        browser.compareScreen(element(By.id('container')), 'title_center');
    });
    it('Legend title Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "title_far");
        done();
    });
    it('Legend title Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "title_near");
        done();
    });
});
describe('Hierarchical title alignment ', () => {
    let property;
    it('Legend title Center', () => {
        browser.get(browser.basePath + '/demo/hier_title.html');
        browser.compareScreen(element(By.id('container')), 'htitle_center');
    });
    it('Legend title Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "htitle_far");
        done();
    });
    it('Legend title Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "htitle_near");
        done();
    });
});
describe('Hierarchical subtitle alignment ', () => {
    let property;
    it(' subtitle Center', () => {
        browser.get(browser.basePath + '/demo/hier_subtitle.html');
        browser.compareScreen(element(By.id('container')), 'hsubtitle_center');
    });
    it(' subtitle Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hsubtitle_far");
        done();
    });
    it(' subtitle Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "hsubtitle_near");
        done();
    });
});
describe('Flat subtitle alignment Center', () => {
    let property;
    it('Flat subtitle Center', () => {
        browser.get(browser.basePath + '/demo/flat_subtitle.html');
        browser.compareScreen(element(By.id('container')), 'subtitle');
    });
    it('Flat subtitle Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "subtitle2");
        done();
    });
    it('Flat subtitle Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "subtitle3");
        done();
    });
});
describe('Flat same ', () => {
    let property;
    it('same value data source', () => {
        browser.get(browser.basePath + '/demo/flat_samevalue.html');
        browser.compareScreen(element(By.id('container')), 'samevalue_datasource');
    });
});
describe('Hierarchical same ', () => {
    let property;
    it('same value data source', () => {
        browser.get(browser.basePath + '/demo/hier_samevalue.html');
        browser.compareScreen(element(By.id('container')), 'hsamevalue_datasource');
    });
});
describe('Hierarchical zero ', () => {
    let property;
    it('zero value data source', () => {
        browser.get(browser.basePath + '/demo/hier_zerovalue.html');
        browser.compareScreen(element(By.id('container')), 'hzerovalue_datasource');
    });
});
describe('flat zero ', () => {
    let property;
    it('zero value data source', () => {
        browser.get(browser.basePath + '/demo/flat_zerovalue.html');
        browser.compareScreen(element(By.id('container')), 'zerovalue_datasource');
    });
});
describe('flat mix ', () => {
    let property;
    it('mix value data source', () => {
        browser.get(browser.basePath + '/demo/flat_mixvalue.html');
        browser.compareScreen(element(By.id('container')), 'flat_mixvalue');
    });
});
describe('hierarchical mix ', () => {
    let property;
    it('mix value data source', () => {
        browser.get(browser.basePath + '/demo/hier_mixvalue.html');
        browser.compareScreen(element(By.id('container')), 'hier_mixvalue');
    });
});
describe('hierarchical border ', () => {
    let property;
    it('Treemap border', () => {
        browser.get(browser.basePath + '/demo/hier_border.html');
        browser.compareScreen(element(By.id('container')), 'hborder');
    });
});
describe('Flat border ', () => {
    let property;
    it('Treemap border', () => {
        browser.get(browser.basePath + '/demo/flat_border.html');
        browser.compareScreen(element(By.id('container')), 'border');
    });
});
describe('Flat opacity ', () => {
    let property;
    it('Treemap opacity', () => {
        browser.get(browser.basePath + '/demo/flat_opacity.html');
        browser.compareScreen(element(By.id('container')), 'opacity');
    });
});
describe('Hierarchical opacity ', () => {
    let property;
    it('mix border data source', () => {
        browser.get(browser.basePath + '/demo/hier_opacity.html');
        browser.compareScreen(element(By.id('container')), 'hopacity');
    });
});
describe('Hierarchical palette ', () => {
    let property;
    it('Treemap palette', () => {
        browser.get(browser.basePath + '/demo/hier_palette.html');
        browser.compareScreen(element(By.id('container')), 'hpalette');
    });
});
describe('Flat palette ', () => {
    let property;
    it('Treemap palette', () => {
        browser.get(browser.basePath + '/demo/hier_palette.html');
        browser.compareScreen(element(By.id('container')), 'palette');
    });
});
describe('Flat range ', () => {
    let property;
    it('Treemap Range', () => {
        browser.get(browser.basePath + '/demo/flat_range.html');
        browser.compareScreen(element(By.id('container')), 'range');
    });
});
describe('Hierarchical range ', () => {
    let property;
    it('Treemap Range', () => {
        browser.get(browser.basePath + '/demo/hier_range.html');
        browser.compareScreen(element(By.id('container')), 'hi_range');
    });
});
describe('Hierarchical equal ', () => {
    let property;
    it('Treemap equal', () => {
        browser.get(browser.basePath + '/demo/hier_equal.html');
        browser.compareScreen(element(By.id('container')), 'hier_equal');
    });
});
describe('flat equal ', () => {
    let property;
    it('Treemap Equal', () => {
        browser.get(browser.basePath + '/demo/flat_equalcolor.html');
        browser.compareScreen(element(By.id('container')), 'flat_equal');
    });
});
describe('flat desaturation ', () => {
    let property;
    it('Treemap desaturation', () => {
        browser.get(browser.basePath + '/demo/flat_desaturation.html');
        browser.compareScreen(element(By.id('container')), 'desaturation');
    });
});

 describe('Hierarchical desaturation ', () => {
    let property;
    it('Treemap desaturation', () => {
        browser.get(browser.basePath + '/demo/hier_desaturation.html');
        browser.compareScreen(element(By.id('container')), 'hier_desaturation');
    });
});
 