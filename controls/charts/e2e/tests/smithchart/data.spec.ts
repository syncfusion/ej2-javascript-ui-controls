import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Animation sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_animation.html');
        browser.compareScreen(element(By.id('container')), 'imp_animation');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart Animation sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_animation.html');
        browser.compareScreen(element(By.id('container')), 'adm_animation');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Axis line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_axisline.html');
        browser.compareScreen(element(By.id('container')), 'imp_axisline');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart axis line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_axisline.html');
        browser.compareScreen(element(By.id('container')), 'adm_axisline');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Border sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_border.html');
        browser.compareScreen(element(By.id('container')), 'imp_border');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart border sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_border.html');
        browser.compareScreen(element(By.id('container')), 'adm_border');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Data point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_data_point.html');
        browser.compareScreen(element(By.id('container')), 'imp_datapoint');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart Data point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_data_point.html');
        browser.compareScreen(element(By.id('container')), 'adm_datapoint');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart label sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_label.html');
        browser.compareScreen(element(By.id('container')), 'imp_label');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart label sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_label.html');
        browser.compareScreen(element(By.id('container')), 'adm_label');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart majorgrid line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_majorgrid_line.html');
        browser.compareScreen(element(By.id('container')), 'imp_majorgrid_line');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart majorgrid line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_majorgrid_line.html');
        browser.compareScreen(element(By.id('container')), 'adm_majorgrid_line');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart minorgrid line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_minorgrid_line.html');
        browser.compareScreen(element(By.id('container')), 'imp_minorgrid_line');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart minorgrid line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_minorgrid_line.html');
        browser.compareScreen(element(By.id('container')), 'adm_minorgrid_line');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart multiple series sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_multi_series.html');
        browser.compareScreen(element(By.id('container')), 'imp_multiple_series');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart multiple series  sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_multi_series.html');
        browser.compareScreen(element(By.id('container')), 'adm_multiple_series');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart radialmajor line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_radialmajor_line.html');
        browser.compareScreen(element(By.id('container')), 'imp_radialmajor_line');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart radialmajor line  sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_radialmajor_line.html');
        browser.compareScreen(element(By.id('container')), 'adm_radialmajor_line');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart radialminor line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_radialminor_line.html');
        browser.compareScreen(element(By.id('container')), 'imp_radialminor_line');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart radialminor line line sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_radialminor_line.html');
        browser.compareScreen(element(By.id('container')), 'adm_radialminor_line');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart same point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_same_point.html');
        browser.compareScreen(element(By.id('container')), 'imp_same_point');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart same point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_same_point.html');
        browser.compareScreen(element(By.id('container')), 'adm_same_point');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart smartlabel sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_smartlabel.html');
        browser.compareScreen(element(By.id('container')), 'imp_smartlabel_point');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart smartlabel sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_smartlabel.html');
        browser.compareScreen(element(By.id('container')), 'adm_smartlabel_point');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Zero point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_zero_point.html');
        browser.compareScreen(element(By.id('container')), 'imp_zero_point');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart Zero point sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_zero_point.html');
        browser.compareScreen(element(By.id('container')), 'adm_zero_point');
    });
});