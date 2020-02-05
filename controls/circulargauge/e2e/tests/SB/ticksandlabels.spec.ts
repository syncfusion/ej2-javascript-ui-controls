
/**
 * spec
 */
import { browser, element, By, by, Key, ElementFinder } from "@syncfusion/ej2-base/e2e/index";


let lastlabel : ElementFinder = element(By.id("showlastlabel"));
describe('SB ticks and labels', () => {
    it('SB ticks and labels', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        browser.compareScreen(element(By.id("labels-container")),"SB/ticksandlabels");
    });
    it('minorticks outside and offset', () => {
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("18"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside_tickoffset");
    });
    it('minorticks outside and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("40"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside_tickheight");
    });

    it('minorticks inside and offset', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
       
        browser.findElement(By.id("tickposition")).sendKeys("Inside");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("22"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_inside_tickoffset");
    });
    it('minorticks inside and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
       
        browser.findElement(By.id("tickposition")).sendKeys("Inside");
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("45"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_inside_tickheight");
    });


    it('majorticks outside and offset', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("18"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside_tickoffset");
    });
    it('majorticks outside and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("40"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside_tickheight");
    });

    it('majorticks inside and offset', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("22"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_tickoffset");
    });
    it('minorticks inside and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("45"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_tickheight");
    });

    it('labels outside and offset', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("28"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/labels_outside_labeloffset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside")
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("28"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/labels_Inside_labeloffset");
    });

    it('show last label', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        lastlabel.click();
        browser.compareScreen(element(By.id("labels-container")),"SB/ticksandlabels_showlastlabel");
    });

    it('ticks outside with label inside', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(by.id("tickposition")).sendKeys("Outside");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
        browser.compareScreen(element(By.id("labels-container")),"SB/ticksandlabels_Outside");
        lastlabel.click();
        browser.compareScreen(element(By.id("labels-container")),"SB/ticksandlabels_Outside_showlastlabel");
        lastlabel.click();
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside");
        browser.compareScreen(element(By.id("labels-container")),"SB/ticks_Outside");
        lastlabel.click();
        browser.compareScreen(element(By.id("labels-container")),"SB/ticks_outside_showlastlabel");
    });

    it('Majorticks Inside with offsets and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("32"+ Key.ENTER);
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("22"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside");
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside__height_offset_label_inside");
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("28"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_height_offset_label_inside_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_height_offset_label_outside_offset");
        lastlabel.click();
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_inside_height_offset_label_outside_offset_lastlabel");
    });

    it('Majorticks Outside with offsets and height1', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("32"+ Key.ENTER);
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("22"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside");
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside__height_offset_label_inside");
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("28"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside_label_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/majorticks_outside__height_offset_label_outside");
    });

    it('MinorTicks Inside with offsets and height', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("32"+ Key.ENTER);
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("22"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorrticks_inside_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside");
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_inside__height_offset_label_inside");
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("16"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_inside_height_offset_label_inside_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_inside_height_offset_label_outside_offset");

    });

    it('MinorTicks Outside with offsets and height1', () => {
        browser.load("/demos/SB/ticksandlabels.html");
       
        browser.findElement(By.id("Ticks")).sendKeys("Minor Ticks");
       
        browser.findElement(By.id("tickposition")).sendKeys("Outside");
        browser.findElement(By.id("tickOffset")).clear();
        browser.findElement(By.id("tickOffset")).sendKeys("35"+ Key.ENTER);
        browser.findElement(By.id("tickHeight")).clear();
        browser.findElement(By.id("tickHeight")).sendKeys("35"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Inside");
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside__height_offset_label_inside");
        browser.findElement(By.id("labelOffset")).clear();
        browser.findElement(By.id("labelOffset")).sendKeys("37"+ Key.ENTER);
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside_label_height_offset");
        
        browser.findElement(By.id("labelposition")).sendKeys("Outside");
        browser.compareScreen(element(By.id("labels-container")),"SB/minorticks_outside__height_offset_label_outside");
    });   
});