/**
 * 
 */
import {TitleModel} from '../../smithchart/title/title-model';
import { SmithchartLegendSettingsModel} from '../../smithchart/legend/legend-model';
import { Smithchart} from '../../smithchart';
import { measureText} from '../../smithchart/utils/helper';
import { SmithchartRect} from '../../smithchart/utils/utils';
import { SmithchartFontModel, SmithchartMarginModel, SmithchartBorderModel} from '../../smithchart/utils/utils-model';
/* tslint:disable:no-string-literal */
export class AreaBounds {

 public yOffset: number;
public calculateAreaBounds(smithchart: Smithchart, title: TitleModel, bounds: SmithchartRect): SmithchartRect {

let x: number;
let y: number;
let width: number;
let height: number;
let rightSpace : number;
let margin: SmithchartMarginModel = smithchart.margin;
let border: SmithchartBorderModel = smithchart.border;

let spaceValue: { leftLegendWidth: number, rightLegendWidth: number,
               topLegendHeight: number, bottomLegendHeight: number,
               modelTitleHeight: number, modelsubTitleHeight: number} = this.getLegendSpace(smithchart, bounds);
x = spaceValue['leftLegendWidth'] + margin.left + border.width;
rightSpace = spaceValue['rightLegendWidth'] + margin.left + margin.right + (2 * border.width);
width = smithchart.availableSize['width'] - (x + rightSpace);
y = margin['top'] + (2 * smithchart.elementSpacing) + spaceValue['modelTitleHeight'] +
     spaceValue['modelsubTitleHeight'] + spaceValue['topLegendHeight'] + border.width;
height = smithchart.availableSize['height'] - (spaceValue['modelTitleHeight'] +
(2 * smithchart.elementSpacing) + spaceValue['modelsubTitleHeight'] + margin['top'] +
spaceValue['topLegendHeight'] + spaceValue['bottomLegendHeight']);

return { x: x, y: y, width: width, height: height};
}

private getLegendSpace(smithchart: Smithchart, bounds: SmithchartRect): {leftLegendWidth: number, rightLegendWidth: number,
                                                                 topLegendHeight: number, bottomLegendHeight: number,
                                                                 modelTitleHeight: number, modelsubTitleHeight: number} {

let title: TitleModel = smithchart.title;
let legend: SmithchartLegendSettingsModel = smithchart.legendSettings;
let position: string = legend.position.toLowerCase();
let subtitleHeight: number = 0;
let modelsubTitleHeight: number = 0;
let titleHeight: number = 0;
let font: SmithchartFontModel = smithchart.font;
let modelTitleHeight: number = 0;
let itemPadding: number = 10;
let legendBorder: number = legend.border.width;
let leftLegendWidth: number = 0;
let rightLegendWidth: number = 0;
let topLegendHeight: number = 0;
let bottomLegendHeight: number = 0;
let ltheight: number = 0;
let space: number;
if (legend['visible']) {
                space = (bounds.width + (itemPadding / 2) + smithchart.elementSpacing  + (2 * legendBorder));
                leftLegendWidth = position === 'left' ? space : 0;
                rightLegendWidth = position === 'right' ? space : 0;
                ltheight = legend['title'].visible ? measureText(legend['title'].text, font)['height'] : 0;
                topLegendHeight = position === 'top' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
                bottomLegendHeight = position === 'bottom' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
            }
subtitleHeight = measureText(title.subtitle.text, font)['height'];
modelTitleHeight = (title.text === '' || !title['visible']) ? 0 : (titleHeight);
modelsubTitleHeight = (title['subtitle'].text === '' || !title['subtitle'].visible) ? 0 : (subtitleHeight);
return {
        leftLegendWidth: leftLegendWidth, rightLegendWidth: rightLegendWidth,
        topLegendHeight: topLegendHeight, bottomLegendHeight: bottomLegendHeight,
        modelTitleHeight: modelTitleHeight, modelsubTitleHeight: modelsubTitleHeight
     };
 }
}

