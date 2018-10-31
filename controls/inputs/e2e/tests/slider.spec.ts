import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Helper } from './Helper/helper.spec';
let EC = browser.ExpectedConditions;
let helper = new Helper();
describe('Slider', function () {

     let themes: any = ["material", "fabric", "bootstrap"]

    it('Default rendering', function () {
        let sliders: any = [{ "id": "slider1", "name": "defult_slider" }, { "id": "slider2", "name": "range_slider" }, { "id": "slider3", "name": "min_range_slider" }]
        let samples: any = [
            {
                sampleName: "default", properties: [{ "id": "showbutton" }, { id: "afterticks", tooltip: "//div[contains(@class,'e-second-button')]" }, { id: "beforeticks", tooltip: "//div[contains(@class,'e-first-button')]" },
                { id: "customvalue", tooltip: "//div[contains(@class,'e-first-button')]" }, { id: "limit", tooltip: "//div[contains(@class,'e-first-button')]" }]
            },
        ]

        for (let i: number = 0; i < samples.length; i++) {
            helper.load('/demos/slider/' + samples[i].sampleName + '.html');
            for (let y: number = 0; y < themes.length; y++) {
                helper.buttonClick("//*[@id='" + themes[y] + "']");
                for (let j: number = 0; j < sliders.length; j++) {
                    browser.compareScreen((helper.xpath("//*[@id='" + sliders[j].id + "']")), sliders[j].name+ "_with_" + themes[y]);
                }
                for (let k: number = 0; k < samples[i].properties.length; k++) {
                    helper.buttonClick("//*[@id='" + samples[i].properties[k].id + "']");
                    for (let m: number = 0; m < sliders.length; m++) {
                        if (samples[i].properties[k].tooltip) {
                            helper.buttonClick("//*[@id='" + sliders[m].id + "']" + samples[i].properties[k].tooltip);
                            browser.compareScreen((helper.xpath("//*[@id='" + sliders[m].id + "']")), sliders[m].name + "_" + samples[i].properties[k].id + "_tooltip"+ "_with_" + themes[y]);
                        } else {
                            browser.compareScreen((helper.xpath("//*[@id='" + sliders[m].id + "']")), sliders[m].name + "_" + samples[i].properties[k].id+ "_with_" + themes[y]);
                        }
                    }
                }
            }
        }
    });

    it('Orientation and RTL rendering', function () {
        let sliders: any = [{ "id": "slider-demo", "name": "slider", "disable": "disable" }]
        let sliderType: any = [{ "id": "slider1", "name": "defult_slider" }, { "id": "slider2", "name": "range_slider" }, { "id": "slider3", "name": "min_range_slider" }]
        let samples: any = [
            {
                sampleName: "enableRTL", name: "_with_enableRTL",
                properties: [{ id: "ticks", tooltip: "//div[contains(@class,'e-second-button')]" },
                { id: "customvalue", tooltip: "//div[contains(@class,'e-first-button')]" },
                { id: "limit", tooltip: "//div[contains(@class,'e-first-button')]" }],

            },
            {
                sampleName: "orientation", name: "_with_orientation",
                properties: [{ id: "ticks", tooltip: "//div[contains(@class,'e-first-button')]" },
                { id: "customvalue", tooltip: "//div[contains(@class,'e-first-button')]" },
                { id: "limit", tooltip: "//div[contains(@class,'e-first-button')]" }],
            },
        ]

        for (let i: number = 0; i < samples.length; i++) {
            helper.load('/demos/slider/' + samples[i].sampleName + '.html');
            for (let y: number = 0; y < themes.length; y++) {
                helper.buttonClick("//*[@id='" + themes[y] + "']");
                browser.compareScreen((helper.xpath("//*[@id='" + sliders[0].id + "']")), sliders[0].name + samples[i].name + "_with_" + themes[y]);
                for (let k: number = 0; k < samples[i].properties.length; k++) {
                    helper.buttonClick("//*[@id='" + samples[i].properties[k].id + "']");
                    if (samples[i].properties[k].id === "ticks") {
                        helper.buttonClick("//*[@id='" + sliders[0].disable + "']");
                        browser.compareScreen((helper.xpath("//*[@id='" + sliders[0].id + "']")), samples[i].sampleName + "_with" + sliders[0].disable + "_with_" + themes[y]);
                        helper.buttonClick("//*[@id='" + sliders[0].disable + "']");
                    }
                    for (let j: number = 0; j < sliderType.length; j++) {
                        helper.buttonClick("//*[@id='" + sliderType[j].id + "']" + samples[i].properties[k].tooltip);
                        browser.compareScreen((helper.xpath("//*[@id='" + sliderType[j].id + "']")), sliderType[j].name + samples[i].name + "_" + samples[i].properties[k].id + "_tootip" + "_with_" + themes[y]);
                    }
                }
            }
        }
    });
});
