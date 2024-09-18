import { Browser } from '@syncfusion/ej2-base';
import { ChartTheme } from '../../common/utils/enum';
import { IBulletStyle } from '../model/bullet-interface';

/** @private
 * @param {ChartTheme} theme Passed theme parameter.
 * @returns {IBulletStyle} It returns bullet style.
 */
export function getBulletThemeColor(theme: ChartTheme): IBulletStyle {
    const darkBackground: string = theme === 'MaterialDark' ? '#383838' : (theme === 'FabricDark' ? '#242424' : '#1b1b1b');
    let style: IBulletStyle = {
        majorTickLineColor: '#424242',
        minorTickLineColor: '#424242',
        background: '#FFFFFF',
        labelFontColor: 'rgba(0,0,0,0.54)',
        categoryFontColor: '#666666',
        labelFontFamily: 'SegoeUI',
        tooltipFill: '#000816',
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
        tabColor: theme === 'Material' ? '#ff4081' : theme === 'Fabric' ? '#0078D6' : '#317AB9',
        rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }],
        titleFont: {
            color: 'rgba(0, 0, 0, 1)' , fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '500'
        },
        subTitleFont: {
            color: 'rgba(0, 0, 0, 1)', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
        },
        legendLabelFont: {
            color: 'rgba(97, 97, 97, 1)', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
        },
        axisLabelFont: {
            color: 'rgba(97, 97, 97, 1)', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
        },
        dataLabelFont: {
            color: 'rgba(97, 97, 97, 1)', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
        },
        tooltipLabelFont: {
            color: 'rgba(249, 250, 251, 1)', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
        }
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
            tooltipFill: '#FFFFFF',
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
            tabColor: '#0078D6',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }],
            titleFont: {
                color: '#333333', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#333333', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#666666', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#666666', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#666666', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#333333', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tooltipFill: '#212529',
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
            tabColor: '#317AB9',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }],
            titleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#666666', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#676767', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#676767', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tooltipFill: '#FFFFFF',
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
            tabColor: '#FFD939',
            rangeStrokes: [{ color: '#757575' }, { color: '#BDBDBD' }, { color: '#EEEEEE' }],
            titleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#969696', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#000000', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'MaterialDark':
    case 'FabricDark':
    case 'BootstrapDark':
        style = {
            majorTickLineColor: '#F0F0F0',
            minorTickLineColor: '#F0F0F0',
            background: darkBackground,
            labelFontColor: '#FFFFFF',
            categoryFontColor: '#FFFFFF',
            labelFontFamily: 'Helvetica',
            tooltipFill: theme === 'MaterialDark' ? '#F4F4F4' : theme === 'FabricDark' ? '#A19F9D' : '#F0F0F0',
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
            tabColor: theme === 'MaterialDark' ? '#00B0FF' : theme === 'FabricDark' ? '#0074CC' : '#0070F0',
            rangeStrokes: [{ color: '#8D8D8D' }, { color: '#ADADAD' }, { color: '#EEEEEE' }],
            titleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.87)' : theme === 'FabricDark' ? '#DADADA' : '#FFFFFF', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(255, 255, 255, 0.6)' : theme === 'FabricDark' ? '#A19F9D' : '#676767', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: theme === 'MaterialDark' ? 'rgba(18, 18, 18, 1)' : theme === 'FabricDark' ? '#DADADA' : '#1A1A1A', fontFamily: theme === 'MaterialDark' ? 'Roboto' : theme === 'FabricDark' ? 'Segoe UI' : 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
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
            tooltipFill: '#212529',
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
            tabColor: '#007BFF',
            rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }],
            titleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#212529', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#666666', fontFamily: 'Helvetica', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#495057', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Helvetica', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Tailwind':
        style = {
            majorTickLineColor: '#D1D5DB',
            minorTickLineColor: '#D1D5DB',
            background: 'transparent',
            labelFontColor: '#6B7280',
            categoryFontColor: '#6B7280',
            labelFontFamily: 'Inter',
            tooltipFill: '#111827',
            legendLabel: '#374151',
            tooltipBoldLabel: '#F9FAFB',
            featuredMeasureColor: '#1F2937',
            comparativeMeasureColor: '#1F2937',
            titleFontColor: '#374151',
            dataLabelFontColor: '#F9FAFB',
            titleFontFamily: 'Inter',
            subTitleFontColor: '#374151',
            subTitleFontFamily: 'Inter',
            firstRangeColor: '#9CA3AF',
            secondRangeColor: '#D1D5DB',
            thirdRangeColor: '#E5E7EB',
            tabColor: '#4F46E5',
            rangeStrokes: [{ color: '#9CA3AF' }, { color: '#D1D5DB' }, { color: '#E5E7EB' }],
            titleFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#374151', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#374151', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#6B7280', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F9FAFB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'TailwindDark':
        style = {
            majorTickLineColor: '#4B5563',
            minorTickLineColor: '#4B5563',
            background: 'transparent',
            labelFontColor: '#9CA3AF',
            categoryFontColor: '#9CA3AF',
            labelFontFamily: 'Inter',
            tooltipFill: '#E9ECEF',
            legendLabel: '#D1D5DB',
            tooltipBoldLabel: '#1F2937',
            featuredMeasureColor: '#1F2937',
            comparativeMeasureColor: '#1F2937',
            titleFontColor: '#D1D5DB',
            dataLabelFontColor: '#D1D5DB',
            titleFontFamily: 'Inter',
            subTitleFontColor: '#D1D5DB',
            subTitleFontFamily: 'Inter',
            firstRangeColor: '#6B7280',
            secondRangeColor: '#4B5563',
            thirdRangeColor: '#374151',
            tabColor: '#22D3EE',
            rangeStrokes: [{ color: '#6B7280' }, { color: '#4B5563' }, { color: '#374151' }],
            titleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#D1D5DB', fontFamily: 'Inter', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#9CA3AF', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#1F2937', fontFamily: 'Inter', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap5':
        style = {
            majorTickLineColor: '#CED4DA',
            minorTickLineColor: '#CED4DA',
            background: 'transparent',
            labelFontColor: '#212529',
            categoryFontColor: '#212529',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#000000E5',
            legendLabel: '#212529',
            tooltipBoldLabel: '#212529',
            featuredMeasureColor: '#343A40',
            comparativeMeasureColor: '#343A40',
            titleFontColor: '#212529',
            dataLabelFontColor: '#212529',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#212529',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#CED4DA',
            secondRangeColor: '#DEE2E6',
            thirdRangeColor: '#E9ECEF',
            tabColor: '#0D6EFD',
            rangeStrokes: [{ color: '#CED4DA' }, { color: '#DEE2E6' }, { color: '#E9ECEF' }],
            titleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            subTitleFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Bootstrap5Dark':
        style = {
            majorTickLineColor: '#6C757D',
            minorTickLineColor: '#6C757D',
            background: '#212529',
            labelFontColor: '#DEE2E6',
            categoryFontColor: '#DEE2E6',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#FFFFFFE5',
            legendLabel: '#DEE2E6',
            tooltipBoldLabel: '#212529',
            featuredMeasureColor: '#ADB5BD',
            comparativeMeasureColor: '#ADB5BD',
            titleFontColor: '#DEE2E6',
            dataLabelFontColor: '#DEE2E6',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#DEE2E6',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#6C757D',
            secondRangeColor: '#495057',
            thirdRangeColor: '#343A40',
            tabColor: '#0D6EFD',
            rangeStrokes: [{ color: '#6C757D' }, { color: '#495057' }, { color: '#343A40' }],
            titleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            subTitleFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#DEE2E6', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#212529', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent':
        style = {
            majorTickLineColor: '#C8C6C4',
            minorTickLineColor: '#C8C6C4',
            background: 'rgba(255, 255, 255, 0.0001)',
            labelFontColor: '#3B3A39',
            categoryFontColor: '#3B3A39',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#FFFFFF',
            legendLabel: '#3B3A39',
            tooltipBoldLabel: '#323130',
            featuredMeasureColor: '#A19F9D',
            comparativeMeasureColor: '#A19F9D',
            titleFontColor: '#201F1E',
            dataLabelFontColor: '#3B3A39',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#201F1E',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#C8C6C4',
            secondRangeColor: '#D2D0CE',
            thirdRangeColor: '#EDEBE9',
            tabColor: '#0078D4',
            rangeStrokes: [{ color: '#C8C6C4' }, { color: '#D2D0CE' }, { color: '#EDEBE9' }],
            titleFont: {
                color: '#201F1E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#323129', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#3B3A39', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#323130', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'FluentDark':
        style = {
            majorTickLineColor: '#484644',
            minorTickLineColor: '#484644',
            background: 'transparent',
            labelFontColor: '#C8C6C4',
            categoryFontColor: '#C8C6C4',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#323130',
            legendLabel: '#C8C6C4',
            tooltipBoldLabel: '#F3F2F1',
            featuredMeasureColor: '#797775',
            comparativeMeasureColor: '#797775',
            titleFontColor: '#F3F2F1',
            dataLabelFontColor: '#C8C6C4',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#F3F2F1',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#484644',
            secondRangeColor: '#3B3A39',
            thirdRangeColor: '#292827',
            tabColor: '#0078D4',
            rangeStrokes: [{ color: '#484644' }, { color: '#3B3A39' }, { color: '#292827' }],
            titleFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#C8C6C4', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#D2D0CE', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F3F2F1', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Fluent2':
        style = {
            majorTickLineColor: '#C8C6C4',
            minorTickLineColor: '#C8C6C4',
            background: 'transparent',
            labelFontColor: '#C8C6C4',
            categoryFontColor: '#616161',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#FFFFFF',
            legendLabel: '#242424',
            tooltipBoldLabel: '#242424',
            featuredMeasureColor: '#A19F9D',
            comparativeMeasureColor: '#A19F9D',
            titleFontColor: '#242424',
            dataLabelFontColor: '#424242',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#616161',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#C8C6C4',
            secondRangeColor: '#D2D0CE',
            thirdRangeColor: '#EDEBE9',
            tabColor: '#0078D4',
            rangeStrokes: [{ color: '#C8C6C4' }, { color: '#D2D0CE' }, { color: '#EDEBE9' }],
            titleFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: Browser.isDevice ? '16px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            subTitleFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#616161', fontFamily: 'Segoe UI', size: Browser.isDevice ? '14px' : '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#242424', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2Dark':
        style = {
            majorTickLineColor: '#484644',
            minorTickLineColor: '#484644',
            background: 'transparent',
            labelFontColor: '#ADADAD',
            categoryFontColor: '#ADADAD',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#292929',
            legendLabel: '#FFFFFF',
            tooltipBoldLabel: '#FFFFFF',
            featuredMeasureColor: '#8A8886',
            comparativeMeasureColor: '#8A8886',
            titleFontColor: '#FFFFFF',
            dataLabelFontColor: '#FFFFFF',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#ADADAD',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#484644',
            secondRangeColor: '#3B3A39',
            thirdRangeColor: '#292827',
            tabColor: '#0078D4',
            rangeStrokes: [{ color: '#484644' }, { color: '#3B3A39' }, { color: '#292827' }],
            titleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: Browser.isDevice ? '16px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            subTitleFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#ADADAD', fontFamily: 'Segoe UI', size: Browser.isDevice ? '14px' : '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Fluent2HighContrast':
        style = {
            majorTickLineColor: '#484644',
            minorTickLineColor: '#484644',
            background: 'transparent',
            labelFontColor: '#FFFFFF',
            categoryFontColor: '#FFFFFF',
            labelFontFamily: 'Segoe UI',
            tooltipFill: '#000000',
            legendLabel: '#FFFFFF',
            tooltipBoldLabel: '#FFFFFF',
            featuredMeasureColor: '#8A8886',
            comparativeMeasureColor: '#8A8886',
            titleFontColor: '#FFFFFF',
            dataLabelFontColor: '#FFFFFF',
            titleFontFamily: 'Segoe UI',
            subTitleFontColor: '#FFFFFF',
            subTitleFontFamily: 'Segoe UI',
            firstRangeColor: '#484644',
            secondRangeColor: '#3B3A39',
            thirdRangeColor: '#292827',
            tabColor: '#0078D4',
            rangeStrokes: [{ color: '#484644' }, { color: '#3B3A39' }, { color: '#292827' }],
            titleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: Browser.isDevice ? '16px' : '14px', fontStyle: 'Normal', fontWeight: '600'
            },
            subTitleFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            },
            legendLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: Browser.isDevice ? '14px' : '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#FFFFFF', fontFamily: 'Segoe UI', size: '12px', fontStyle: 'Normal', fontWeight: '600'
            }
        };
        break;
    case 'Material3':
        style = {
            majorTickLineColor: '#C4C7C5',
            minorTickLineColor: '#C4C7C5',
            background: 'transparent',
            labelFontColor: '#1E192B',
            categoryFontColor: '#1E192B',
            labelFontFamily: 'Roboto',
            tooltipFill: '#313033',
            legendLabel: '#49454E',
            tooltipBoldLabel: '#F4EFF4',
            featuredMeasureColor: '#79747E',
            comparativeMeasureColor: '#79747E',
            titleFontColor: '#1C1B1F',
            dataLabelFontColor: '#49454E',
            titleFontFamily: 'Roboto',
            subTitleFontColor: '#1C1B1F',
            subTitleFontFamily: 'Roboto',
            firstRangeColor: '#a6a6a9',
            secondRangeColor: '#C4C7C5',
            thirdRangeColor: '#E7E0EC',
            tabColor: '#49454E',
            rangeStrokes: [{ color: '#a6a6a9' }, { color: '#C4C7C5' }, { color: '#E7E0EC' }],
            titleFont: {
                color: '#1C1B1F', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#1E192B', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#49454E', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#F4EFF4', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    case 'Material3Dark':
        style = {
            majorTickLineColor: '#444746',
            minorTickLineColor: '#444746',
            background: 'transparent',
            labelFontColor: '#E6E1E5',
            categoryFontColor: '#E6E1E5',
            labelFontFamily: 'Roboto',
            tooltipFill: '#E6E1E5',
            legendLabel: '#CAC4D0',
            tooltipBoldLabel: '#313033',
            featuredMeasureColor: '#938F99',
            comparativeMeasureColor: '#938F99',
            titleFontColor: '#E6E1E5',
            dataLabelFontColor: '#CAC4D0',
            titleFontFamily: 'Roboto',
            subTitleFontColor: '#E6E1E5',
            subTitleFontFamily: 'Roboto',
            firstRangeColor: 'rgba(147,143,153,0.4)',
            secondRangeColor: '#444746',
            thirdRangeColor: '#49454F',
            tabColor: '#CAC4D0',
            rangeStrokes: [{ color: 'rgba(147,143,153,0.4)' }, { color: '#444746' }, { color: '#49454F' }],
            titleFont: {
                color: '#E6E1E5', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '500'
            },
            subTitleFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            legendLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '14px', fontStyle: 'Normal', fontWeight: '400'
            },
            axisLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            dataLabelFont: {
                color: '#CAC4D0', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            },
            tooltipLabelFont: {
                color: '#313033', fontFamily: 'Roboto', size: '12px', fontStyle: 'Normal', fontWeight: '400'
            }
        };
        break;
    default:
        //style = style;
        break;
    }
    return style;
}
