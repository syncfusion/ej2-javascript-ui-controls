/* eslint-disable @typescript-eslint/no-namespace */
import { IFontMapping } from '../../common/model/interface';
import { ChartTheme } from '../../chart/utils/enum';
import { IBulletStyle } from '../model/bullet-interface';

/**
 *
 */
export namespace BulletChartTheme {
    /** @private */
    export const axisLabelFont: IFontMapping = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
    /** @private */
    export const tooltipLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const legendLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const dataLabelFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    export const titleFont: IFontMapping = {
        size: '15px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
    /** @private */
    export const subTitleFont: IFontMapping = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
}
/** @private
 * @param {ChartTheme} theme Passed theme parameter.
 * @returns {IBulletStyle} It returns bullet style.
 */
// tslint:disable-next-line:max-func-body-length
export function getBulletThemeColor(theme: ChartTheme): IBulletStyle {
    let style: IBulletStyle = {
        majorTickLineColor: '#424242',
        minorTickLineColor: '#424242',
        background: '#FFFFFF',
        labelFontColor: 'rgba(0,0,0,0.54)',
        categoryFontColor: '#666666',
        labelFontFamily: 'SegoeUI',
        tooltipFill: 'rgba(0, 8, 22, 0.75)',
        legendLabel: '#353535',
        tooltipBoldLabel: '#ffffff',
        featuredMeasureColor: '#181818',
        comparativeMeasureColor: '#181818',
        titleFontColor: 'rgba(0,0,0,0.87)',
        dataLabelFontColor: '#ffffff',
        titleFontFamily: 'SegoeUI',
        subTitleFontColor: ' rgba(0,0,0,0.54)',
        subTitleFontFamily: 'SegoeUI',
        firstRangeColor: '#959595',
        secondRangeColor: '#BDBDBD',
        thirdRangeColor: '#E3E2E2',
        rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
    };
    switch (theme) {
    case 'Fabric':
        style = {
            majorTickLineColor: '#424242',
            minorTickLineColor: '#424242',
            background: '#FFFFFF',
            labelFontColor: '#666666',
            categoryFontColor: '#666666',
            labelFontFamily: 'SegoeUI',
            tooltipFill: 'rgba(0, 8, 22, 0.75)',
            legendLabel: '#353535',
            tooltipBoldLabel: '#ffffff',
            featuredMeasureColor: '#181818',
            comparativeMeasureColor: '#181818',
            titleFontColor: '#333333',
            dataLabelFontColor: '#ffffff',
            titleFontFamily: 'SegoeUI',
            subTitleFontColor: '#666666',
            subTitleFontFamily: 'SegoeUI',
            firstRangeColor: '#959595',
            secondRangeColor: '#BDBDBD',
            thirdRangeColor: '#E3E2E2',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
        };
        break;
    case 'Bootstrap':
        style = {
            majorTickLineColor: '#424242',
            minorTickLineColor: '#424242',
            background: '#FFFFFF',
            labelFontColor: 'rgba(0,0,0,0.54)',
            categoryFontColor: 'rgba(0,0,0,0.54)',
            labelFontFamily: 'Helvetica',
            tooltipFill: 'rgba(0, 0, 0, 0.9)',
            legendLabel: '#212529',
            tooltipBoldLabel: 'rgba(255,255,255)',
            featuredMeasureColor: '#181818',
            comparativeMeasureColor: '#181818',
            titleFontColor: 'rgba(0,0,0,0.87)',
            dataLabelFontColor: '#ffffff',
            titleFontFamily: 'Helvetica-Bold',
            subTitleFontColor: ' rgba(0,0,0,0.54)',
            subTitleFontFamily: 'Helvetica',
            firstRangeColor: '#959595',
            secondRangeColor: '#BDBDBD',
            thirdRangeColor: '#E3E2E2',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
        };
        break;
    case 'HighContrast':
        style = {
            majorTickLineColor: '#FFFFFF',
            minorTickLineColor: '#FFFFFF',
            background: '#000000',
            labelFontColor: '#FFFFFF',
            categoryFontColor: '#FFFFFF',
            labelFontFamily: 'SegoeUI',
            tooltipFill: '#ffffff',
            legendLabel: '#ffffff',
            tooltipBoldLabel: '#000000',
            featuredMeasureColor: '#000000',
            comparativeMeasureColor: '#000000',
            titleFontColor: '#FFFFFF',
            dataLabelFontColor: '#ffffff',
            titleFontFamily: 'HelveticaNeue',
            subTitleFontColor: '#FFFFFF',
            subTitleFontFamily: 'SegoeUI',
            firstRangeColor: '#959595',
            secondRangeColor: '#BDBDBD',
            thirdRangeColor: '#E3E2E2',
            rangeStrokes: [{ color: '#757575' }, { color: '#BDBDBD' }, { color: '#EEEEEE' }]
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            majorTickLineColor: '#F0F0F0',
            minorTickLineColor: '#F0F0F0',
            background: '#000000',
            labelFontColor: '#FFFFFF',
            categoryFontColor: '#FFFFFF',
            labelFontFamily: 'Helvetica',
            tooltipFill: '#F4F4F4',
            legendLabel: '#DADADA',
            tooltipBoldLabel: '#282727',
            featuredMeasureColor: '#181818',
            comparativeMeasureColor: '#181818',
            titleFontColor: '#FFFFFF',
            dataLabelFontColor: '#ffffff',
            titleFontFamily: 'Helvetica-Bold',
            subTitleFontColor: '#FFFFFF',
            subTitleFontFamily: 'Helvetica',
            firstRangeColor: '#8D8D8D',
            secondRangeColor: '#ADADAD',
            thirdRangeColor: '#EEEEEE',
            rangeStrokes: [{ color: '#8D8D8D' }, { color: '#ADADAD' }, { color: '#EEEEEE' }]
        };
        break;
    case 'Bootstrap4':
        style = {
            majorTickLineColor: '#424242',
            minorTickLineColor: '#424242',
            background: '#FFFFFF',
            labelFontColor: '#202528',
            categoryFontColor: '#202528',
            labelFontFamily: 'HelveticaNeue',
            tooltipFill: 'rgba(0, 0, 0, 0.9)',
            legendLabel: '#212529',
            tooltipBoldLabel: 'rgba(255,255,255)',
            featuredMeasureColor: '#181818',
            comparativeMeasureColor: '#181818',
            titleFontColor: '#202528',
            dataLabelFontColor: '#ffffff',
            titleFontFamily: 'HelveticaNeue-Bold',
            subTitleFontColor: 'HelveticaNeue',
            subTitleFontFamily: '#202528',
            firstRangeColor: '#959595',
            secondRangeColor: '#BDBDBD',
            thirdRangeColor: '#E3E2E2',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
        };
        break;
    default:
        // eslint-disable-next-line no-self-assign
        style = style;
        break;
    }
    return style;
}
