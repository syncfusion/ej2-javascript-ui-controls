import { TitleModel } from '../../smithchart/title/title-model';
import { SmithchartLegendSettingsModel } from '../../smithchart/legend/legend-model';
import { Smithchart } from '../../smithchart';
import { measureText } from '../../smithchart/utils/helper';
import { SmithchartRect } from '../../smithchart/utils/utils';
import { SmithchartFontModel, SmithchartMarginModel, SmithchartBorderModel } from '../../smithchart/utils/utils-model';

export class AreaBounds {

    public yOffset: number;
    public calculateAreaBounds(smithchart: Smithchart, title: TitleModel, bounds: SmithchartRect): SmithchartRect {
        const margin: SmithchartMarginModel = smithchart.margin;
        const border: SmithchartBorderModel = smithchart.border;
        const spaceValue: {
            leftLegendWidth: number, rightLegendWidth: number,
            topLegendHeight: number, bottomLegendHeight: number,
            modelTitleHeight: number, modelsubTitleHeight: number
        } = this.getLegendSpace(smithchart, bounds);
        const x: number = spaceValue['leftLegendWidth'] + margin.left + border.width;
        const rightSpace: number = spaceValue['rightLegendWidth'] + margin.left + margin.right + (2 * border.width);
        const width: number = smithchart.availableSize['width'] - (x + rightSpace);
        const y: number = margin['top'] + (2 * smithchart.elementSpacing) + spaceValue['modelTitleHeight'] +
            spaceValue['modelsubTitleHeight'] + spaceValue['topLegendHeight'] + border.width;
        const height: number = smithchart.availableSize['height'] - (spaceValue['modelTitleHeight'] +
            (2 * smithchart.elementSpacing) + spaceValue['modelsubTitleHeight'] + margin['top'] +
            spaceValue['topLegendHeight'] + spaceValue['bottomLegendHeight']);

        return { x: x, y: y, width: width, height: height };
    }

    private getLegendSpace(smithchart: Smithchart, bounds: SmithchartRect): {
        leftLegendWidth: number, rightLegendWidth: number,
        topLegendHeight: number, bottomLegendHeight: number,
        modelTitleHeight: number, modelsubTitleHeight: number
    } {

        const title: TitleModel = smithchart.title;
        const legend: SmithchartLegendSettingsModel = smithchart.legendSettings;
        const position: string = legend.position.toLowerCase();
        let subtitleHeight: number = 0;
        let modelsubTitleHeight: number = 0;
        const titleHeight: number = 0;
        const font: SmithchartFontModel = smithchart.font;
        let modelTitleHeight: number = 0;
        const itemPadding: number = 10;
        const legendBorder: number = legend.border.width;
        let leftLegendWidth: number = 0;
        let rightLegendWidth: number = 0;
        let topLegendHeight: number = 0;
        let bottomLegendHeight: number = 0;
        let ltheight: number = 0;
        let space: number;
        if (legend['visible']) {
            space = (bounds.width + (itemPadding / 2) + smithchart.elementSpacing + (2 * legendBorder));
            leftLegendWidth = position === 'left' ? space : 0;
            rightLegendWidth = position === 'right' ? space : 0;
            ltheight = legend['title'].visible ? measureText(legend['title'].text, font, smithchart.themeStyle.legendLabelFont)['height'] : 0;
            topLegendHeight = position === 'top' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
            bottomLegendHeight = position === 'bottom' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
        }
        subtitleHeight = measureText(title.subtitle.text, font, smithchart.themeStyle.legendLabelFont)['height'];
        modelTitleHeight = (title.text === '' || !title['visible']) ? 0 : (titleHeight);
        modelsubTitleHeight = (title['subtitle'].text === '' || !title['subtitle'].visible) ? 0 : (subtitleHeight);
        return {
            leftLegendWidth: leftLegendWidth, rightLegendWidth: rightLegendWidth,
            topLegendHeight: topLegendHeight, bottomLegendHeight: bottomLegendHeight,
            modelTitleHeight: modelTitleHeight, modelsubTitleHeight: modelsubTitleHeight
        };
    }
}
