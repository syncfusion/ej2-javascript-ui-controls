import { isNullOrUndefined, ChildProperty, Property, Complex, extend, getValue, createElement } from '@syncfusion/ej2-base';import { CircularChart3DLabelPosition } from '../model/enum';import { BorderModel, FontModel } from '../../common/model/base-model';import { Border } from '../../common/model/base';import { CircularChart3DPoints, CircularChart3DSeries } from './series';import { CircularChart3D } from '../circularchart3d';import { CircularChart3DTextRenderEventArgs } from '../model/pie-interface';import { Size, measureText, Rect } from '@syncfusion/ej2-svg-base';import { textRender } from '../../common/model/constants';import { ColorValue, appendChildElement, colorNameToHex, convertHexToColor, getFontStyle, getTemplateFunction, measureElementRect, isOverlap, textTrim } from '../../common/utils/helper';import { CircularChart3DLabelElement, CircularChart3DLocation, CircularChart3DPolygon, CircularChart3DSymbolLocation, CircularChart3DVector } from '../model/circular3d-base';

/**
 * Interface for a class CircularChart3DDataLabelFont
 */
export interface CircularChart3DDataLabelFontModel {

    /**
     * Specifies the font style for the text.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Specifies the font size for the text.
     *
     * @default '16px'
     */
    size?: string;

    /**
     * Specifies the font weight for the text.
     *
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Specifies the color for the text.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the font family for the text.
     */
    fontFamily?: string;

    /**
     * Specifies the opacity for the text.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class CircularChart3DConnector
 */
export interface CircularChart3DConnectorModel {

    /**
     * Specifies the color of the connector line.
     *
     * @default null
     */
    color?: string;

    /**
     * Specifies the width of the connector line in pixels.
     *
     * @default 1
     */
    width?: number;

    /**
     * Specifies the length of the connector line in pixels.
     *
     * @default null
     */
    length?: string;

    /**
     * Specifies the dash array pattern for the connector line.
     *
     * @default ''
     */
    dashArray?: string;

}

/**
 * Interface for a class CircularChart3DDataLabelSettings
 */
export interface CircularChart3DDataLabelSettingsModel {

    /**
     * If set true, data label for series gets render.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * The DataSource field which contains the data label value.
     *
     * @default null
     */
    name?: string;

    /**
     * The background color of the data label, which accepts value in hex, rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    fill?: string;

    /**
     * Specifies the position of data label. They are.
     * * Outside - Places label outside the point.
     * * Inside - Places label inside the point.
     *
     * @default 'Inside'
     */
    position?: CircularChart3DLabelPosition;

    /**
     * Specifies angle for data label.
     *
     * @default 0
     */
    angle?: number;

    /**
     * Specifies whether rotation is enabled for data labels.
     *
     * @default false
     */
    enableRotation?: boolean;

    /**
     * Options for customizing the border lines.
     */
    border?: BorderModel;

    /**
     * Options for customizing the data label text.
     */
    font?: CircularChart3DDataLabelFontModel;

    /**
     * Options for customize the connector line in series.
     */
    connectorStyle?: CircularChart3DConnectorModel;

    /**
     * Custom template to format the data label content. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Used to format the data label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the data label, e.g, 20°C.
     *
     * @default ''
     */
    format?: string;

}

/**
 * Interface for a class CircularChartDataLabel3D
 */
export interface CircularChartDataLabel3DModel {

}