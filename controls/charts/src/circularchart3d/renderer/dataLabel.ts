/**
 * Circular 3D chart data label.
 */
import { isNullOrUndefined, ChildProperty, Property, Complex, extend, getValue, createElement } from '@syncfusion/ej2-base';
import { CircularChart3DLabelPosition } from '../model/enum';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { Border } from '../../common/model/base';
import { CircularChart3DPoints, CircularChart3DSeries } from './series';
import { CircularChart3D } from '../circularchart3d';
import { CircularChart3DTextRenderEventArgs } from '../model/pie-interface';
import { Size, measureText, Rect } from '@syncfusion/ej2-svg-base';
import { textRender } from '../../common/model/constants';
import { ColorValue, appendChildElement, colorNameToHex, convertHexToColor, getFontStyle, getTemplateFunction, measureElementRect, isOverlap, textTrim } from '../../common/utils/helper';
import { CircularChart3DConnectorModel, CircularChart3DDataLabelFontModel, CircularChart3DDataLabelSettingsModel } from './dataLabel-model';
import { CircularChart3DLabelElement, CircularChart3DLocation, CircularChart3DPolygon, CircularChart3DSymbolLocation, CircularChart3DVector } from '../model/circular3d-base';


/**
 * Configures the fonts in the circular 3D data label.
 */
export class CircularChart3DDataLabelFont extends ChildProperty<CircularChart3DDataLabelFont> {

    /**
     * Specifies the font style for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Specifies the font size for the text.
     *
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Specifies the font weight for the text.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Specifies the color for the text.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Specifies the font family for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Specifies the opacity for the text.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}


/**
 * Defines the appearance of the connector line for the circular 3D chart.
 */
export class CircularChart3DConnector extends ChildProperty<CircularChart3DConnector> {

    /**
     * Specifies the color of the connector line.
     *
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Specifies the width of the connector line in pixels.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Specifies the length of the connector line in pixels.
     *
     * @default null
     */
    @Property(null)
    public length: string;

    /**
     * Specifies the dash array pattern for the connector line.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;
}

/**
 * Configures the data label settings for circular 3D chart.
 */
export class CircularChart3DDataLabelSettings extends ChildProperty<CircularChart3DDataLabelSettings> {

    /**
     * If set true, data label for series gets render.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * The DataSource field which contains the data label value.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * The background color of the data label, which accepts value in hex, rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;

    /**
     * Specifies the position of data label. They are.
     * * Outside - Places label outside the point.
     * * Inside - Places label inside the point.
     *
     * @default 'Inside'
     */
    @Property('Inside')
    public position: CircularChart3DLabelPosition;

    /**
     * Specifies angle for data label.
     *
     * @default 0
     */
    @Property(0)
    public angle: number;

    /**
     * Specifies whether rotation is enabled for data labels.
     *
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;

    /**
     * Options for customizing the border lines.
     */
    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the data label text.
     */
    @Complex<CircularChart3DDataLabelFontModel>({ fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: '400', color: null }, CircularChart3DDataLabelFont)
    public font: CircularChart3DDataLabelFontModel;

    /**
     * Options for customize the connector line in series.
     */
    @Complex<CircularChart3DConnectorModel>({}, CircularChart3DConnector)
    public connectorStyle: CircularChart3DConnectorModel;

    /**
     * Custom template to format the data label content. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;

    /**
     * Used to format the data label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the data label, e.g, 20°C.
     *
     * @default ''
     */
    @Property('')
    public format: string;

}

/**
 * The 'CircularChartDataLabel3D' module used to render dataLabel in circular 3D charts.
 */
export class CircularChartDataLabel3D extends ChildProperty<CircularChartDataLabel3D> {


    /**
     * Renders data labels for a circular 3D series on the given chart.
     *
     * @param {CircularChart3DSeries} series - The circular 3D series for which data labels are to be rendered.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     * @private
     */
    public renderDataLabel(series: CircularChart3DSeries, chart: CircularChart3D): void {
        const templateId: string = chart.element.id + '-series-' + series.index + '-data-label-collections';
        series.labelBound = isNullOrUndefined(series.labelBound) ? new Rect(Infinity, Infinity, -Infinity, -Infinity) : series.labelBound;
        series.dataLabelElement = createElement('div', { id: templateId });
        for (let i: number = 0; i < series.points.length; i++) {
            const point: CircularChart3DPoints = series.points[i as number];
            const pointText: string = this.getDatalabelText(series.dataLabel.format, chart, point.text ? point.text : isNullOrUndefined(point.y) ? '' : point.y.toString());
            const border: BorderModel = { width: series.dataLabel.border.width, color: series.dataLabel.border.color,
                dashArray: series.dataLabel.border.dashArray};
            const argsFont: FontModel = <FontModel>(extend({}, getValue('properties', series.dataLabel.font), null, true));
            const argsData: CircularChart3DTextRenderEventArgs = {
                cancel: false, name: textRender, series: series, point: point,
                text: pointText, border: border, color: series.dataLabel.fill, template: series.dataLabel.template, font: argsFont
            };
            chart.trigger(textRender, argsData);
            point.argsData = argsData;
            if (point.visible && !argsData.cancel && !isNullOrUndefined(point.y)) {
                this.draw3DDataLabel(series, point.index, point, chart);
            }
        }
        if (series.dataLabel.template) {
            appendChildElement(false, document.getElementById(chart.element.id + '_Secondary_Element'), series.dataLabelElement, chart.redraw, false, 'x', 'y', null, '', false, false, null);
        }
    }

    /**
     * Creates a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element to which the data label template is attached.
     * @param {CircularChart3DSeries} series - The 3D series to which the data point belongs.
     * @param {CircularChart3DDataLabelSettingsModel} dataLabel - The style settings for data labels.
     * @param {CircularChart3DPoints} point - The data point for which the data label template is created.
     * @param {CircularChart3DTextRenderEventArgs} data - The text render event arguments.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {CircularChart3DLocation} location - The location values for the data label.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     * @private
     */
    public createDataLabelTemplate(
        parentElement: HTMLElement, series: CircularChart3DSeries,
        dataLabel: CircularChart3DDataLabelSettingsModel, point: CircularChart3DPoints,
        data: CircularChart3DTextRenderEventArgs, labelIndex: number,
        redraw: boolean, location: CircularChart3DLocation, chart: CircularChart3D
    ): void {
        const childElement: HTMLElement = this.createTemplate(
            createElement('div', {
                id: chart.element.id + '-series-' + series.index + '-data-label-' + labelIndex,
                styles: 'position: absolute;background-color:' + data.color + ';' +
                    getFontStyle(dataLabel.font, chart.themeStyle.datalabelFont) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            data.template, chart, point, series, chart.element.id + '-data-label-');
        this.calculateTemplateLabelSize(parentElement, childElement, point, series, dataLabel, redraw, location);
    }

    /**
     * Calculates the size of a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element containing the data label template.
     * @param {HTMLElement} childElement - The child HTML element representing the data label template.
     * @param {CircularChart3DPoints} point - The data point for which the data label template size is calculated.
     * @param {CircularChart3DSeries} series - The circular 3D series to which the data point belongs.
     * @param {CircularChart3DDataLabelSettingsModel} dataLabel - The style for data labels.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {CircularChart3DLocation} location - The location values for the data label.
     * @param {boolean} isReactCallback - Indicates whether the callback is associated with React.
     * @returns {void}
     */
    private calculateTemplateLabelSize(
        parentElement: HTMLElement, childElement: HTMLElement, point: CircularChart3DPoints, series: CircularChart3DSeries,
        dataLabel: CircularChart3DDataLabelSettingsModel, redraw: boolean,
        location: CircularChart3DLocation, isReactCallback?: boolean
    ): void {
        const elementRect: ClientRect = measureElementRect(childElement, redraw, isReactCallback);
        childElement.style.left = (location.x - (elementRect.width / 2)) + 'px';
        childElement.style.top = (location.y - elementRect.height) + 'px';
        appendChildElement(false, parentElement, childElement, redraw, true, 'left', 'top');
    }

    /**
     * Creates a template element for rendering data labels associated with a specific data point in a 3D series.
     *
     * @param {HTMLElement} childElement - The child HTML element to contain the template content.
     * @param {string | Function} content - The content or function for the data label template.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @param {CircularChart3DPoints} point - The data point for which the template is created (optional).
     * @param {CircularChart3DSeries} series - The 3D series to which the data point belongs (optional).
     * @param {string} dataLabelId - The ID for the data label element (optional).
     * @returns {HTMLElement} - The created template element.
     */
    private createTemplate(
        childElement: HTMLElement, content: string | Function, chart: CircularChart3D,
        point?: CircularChart3DPoints, series?: CircularChart3DSeries, dataLabelId?: string
    ): HTMLElement {
        const templateFn: Function = getTemplateFunction(content);
        let templateElement: HTMLCollection;
        try {
            const tempObject: Object = { chart: chart, series: series, point: point };
            const templateId: string = dataLabelId + '-template';
            const elementData: Element[] = templateFn ? templateFn(tempObject, chart, templateId, dataLabelId) : [];
            if (elementData.length) {
                templateElement = Array.prototype.slice.call(elementData);
                const len: number = templateElement.length;
                for (let i: number = 0; i < len; i++) {
                    childElement.appendChild(templateElement[i as number]);
                }
            }
            let reactCallback: Function;
            if ((chart as any).isReact) { (chart as any).renderReactTemplates(reactCallback); }
        } catch (e) {
            return childElement;
        }
        return childElement;
    }

    /**
     * Draws a 3D data label for a circular 3D series.
     * This method is responsible for drawing a 3D data label for a circular 3D series.
     *
     * @param {CircularChart3DSeries} series - The CircularChart3DSeries to which the data label belongs.
     * @param {number} pointIndex - The index of the data label point in the series.
     * @param  {CircularChart3DPoints} point - The CircularChart3DPoints representing the 3D point of the data label.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    private draw3DDataLabel(series: CircularChart3DSeries, pointIndex: number, point: CircularChart3DPoints, chart: CircularChart3D): void {
        let connectorHeight: number | string = series.dataLabel.connectorStyle.length ?
            parseFloat(series.dataLabel.connectorStyle.length) : series.dataLabel.connectorStyle.length;
        let radius: number;
        let pointX: number;
        let pointY: number;
        let degree: number;
        const commonEventArgs: {
            data: {
                text: string, location: { x: number, y: number },
                series: CircularChart3DSeries, pointIndex: number,
                seriesIndex: number,
                Text?: string
            }
        } = { data: null };
        const location: CircularChart3DLocation = { x: 0, y: 0 };
        const seriesIndex: number = series.index;

        const center: CircularChart3DVector = point.symbolLocation.center;
        const dradius: number = point.symbolLocation.radius * series.coefficient;

        if (isNullOrUndefined(connectorHeight)) {
            connectorHeight = measureText(point.argsData.text, series.dataLabel.font, chart.themeStyle.datalabelFont).height;
        }

        if (series != null && series.dataLabel.position !== 'Inside') {
            radius = point.symbolLocation.radius + (connectorHeight as number);
        } else if (series != null) {
            radius = dradius + (point.symbolLocation.radius - dradius) / 2;
        }

        pointX = location.x = center.x + (parseFloat(point.argsData.font.size) / 3) + radius * Math.cos(point.symbolLocation.angle);
        pointY = location.y = center.y + (parseFloat(point.argsData.font.size) / 3) + radius * Math.sin(point.symbolLocation.angle);

        commonEventArgs.data = {
            text: point.argsData.text, location: { x: pointX, y: pointY },
            series: series, pointIndex: pointIndex, seriesIndex: seriesIndex
        };
        commonEventArgs.data.Text = commonEventArgs.data.text;

        let size: Size = measureText(point.argsData.text, series.dataLabel.font, chart.themeStyle.datalabelFont);
        pointX = location.x = commonEventArgs.data.location.x;
        pointY = location.y = commonEventArgs.data.location.y;

        const tag: string = (!series.dataLabel.template) ? 'text' : 'template';
        const saturationColor: string = this.getSaturatedColor(point, point.argsData.color, chart);
        const element: CircularChart3DLabelElement = { width: size.width, height: size.height, fill: saturationColor, label: commonEventArgs.data, textAnchor: 'middle', tag: tag, font: point.argsData.font, angle: 0, id: chart.element.id + '-svg-data-label-text-' + pointIndex, child: chart.groupElement };
        if (chart.circularChartLegend3DModule && chart.legendSettings.visible && point.visible && series.dataLabel.position === 'Outside') {
            let rect: Rect = chart.circularChartLegend3DModule.legendBounds;
            const legendpadding: number = chart.legendSettings.border.width / 2;
            rect = new Rect(rect.x - legendpadding, rect.y - legendpadding, rect.width +
                (2 * legendpadding), rect.height + (2 * legendpadding));
            const labelRegion: Rect = new Rect(element.label.location.x + (size.width / 2) + 20, element.label.location.y + 2.5,
                                               element.width, element.height);
            if (isOverlap(labelRegion, rect)) {
                if (chart.circularChartLegend3DModule.position === 'Right') {
                    element.width = rect.x - labelRegion.x;
                } else if (chart.circularChartLegend3DModule.position === 'Left') {
                    element.width = labelRegion.x - (rect.x + rect.width);
                    if (element.width < 0) {
                        element.width += labelRegion.width;
                        element.label.location.x = rect.x + rect.width - (size.width / 2) + 20;
                    }
                }
                if (labelRegion && element.width < labelRegion.width) {
                    element.label.text = textTrim(element.width, element.label.text, series.dataLabel.font, chart.enableRtl,
                                                  chart.themeStyle.datalabelFont);
                }
                if (element.label.text.length === 3 && element.label.text.indexOf('...') > -1) {
                    return;
                }
            }
        }
        let connectorPoints: { x: number, y: number, angle: number };
        if (series.dataLabel.position !== 'Inside') {
            connectorPoints = this.updateConnectorLine(point, pointIndex, series, (connectorHeight as number), chart);
        }
        if (series.dataLabel.template && series.dataLabel.position !== 'Inside') {
            const childElement: HTMLElement = this.createTemplate(
                createElement('div', {
                    id: chart.element.id + '-series-data-label-' + 0,
                    styles: 'position: absolute;background-color:' + point.argsData.color + ';' +
                        getFontStyle(point.argsData.font, chart.themeStyle.datalabelFont) + ';border:' + point.argsData.border.width + 'px solid ' + point.argsData.border.color + ';'
                }),
                point.argsData.template, chart, point, series, chart.element.id + '-data-label-');
            size = measureText(childElement.textContent, series.dataLabel.font, chart.themeStyle.datalabelFont);
        }
        if (chart.circularChartLegend3DModule && chart.legendSettings.visible && (series.dataLabel.position === 'Outside')) {
            chart.visibleSeries[0].findMaxBounds(chart.visibleSeries[0].labelBound,
                                                 { x: pointX, y: pointY, width: size.width, height: size.height });
        }
        let padding: number = 0;
        let heightPadding: number = 0;
        let textAngle: number = point.symbolLocation.angle;
        if (series.dataLabel.position !== 'Inside') {
            if ((textAngle > 1.5 && textAngle < 1.8) || (textAngle > 1.3 && textAngle < 1.5) ||
                (textAngle > 4.5 && textAngle < 4.8) || (textAngle > 4.3 && textAngle < 4.5)) {
                location.x = connectorPoints.x;
                location.y = connectorPoints.y;
                textAngle = connectorPoints.angle;
            }
            if (textAngle < (Math.PI / 2) || textAngle >= (Math.PI / 2) + Math.PI) {
                padding = (size.width / 2) + 20;
                heightPadding = 5 / 2;
            }
            else {
                padding = - ((size.width / 2) + (point.argsData.color !== 'transparent' || point.argsData.border.color ? 25 : 20));
                heightPadding = 5 / 2;
            }
        }
        if (!point.argsData.template && commonEventArgs.data.text !== '') {
            const element: CircularChart3DLabelElement = { tag: 'dataLabel', series: series, point: point, pointIndex: pointIndex, id: chart.element.id + '-svg-' + seriesIndex + '-data-label-' + pointIndex, child: chart.groupElement };
            let angle: number;
            let transform: string = '';
            if (series.dataLabel.enableRotation) {
                angle = degree = series.dataLabel.angle;
                if (angle === 0) {
                    const toDegrees: (angle: number) => number = (angle: number) => angle * (180 / Math.PI);
                    const midAngle: number = toDegrees(point.symbolLocation.angle);
                    if (series.dataLabel.position === 'Outside') {
                        degree = 0;
                    }
                    else if (midAngle >= 90 && midAngle <= 260) {
                        degree = midAngle + 180;
                        location.x = location.x - (parseFloat(point.argsData.font.size) / 2);
                    } else {
                        degree = midAngle;
                    }
                } else {
                    degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                }
                transform = 'rotate(' + degree + ',' + (location.x) + ',' + (location.y) + ')';
            }
            element.transform = transform;
            const borderElement: CircularChart3DPolygon = chart.polygon.createTextElement(
                chart.vector.vector3D(pointX + padding, pointY + heightPadding, (point.symbolLocation.z) ?
                    point.symbolLocation.z : 0), element, 0, -size.height);
            chart.circular3DPolygon.push(borderElement);
        }
        element.angle = series.dataLabel.enableRotation ? series.dataLabel.angle !== 0 ? series.dataLabel.angle : degree : 0;
        const polygon: CircularChart3DPolygon = chart.polygon.createTextElement(
            chart.vector.vector3D(location.x + padding, location.y + heightPadding , -1), element, 0, -size.height);
        chart.circular3DPolygon.push(polygon);

    }

    /**
     * To find saturated color for datalabel.
     *
     * @param {CircularChart3DPoints} point - The point to get the color saturation.
     * @param {string} color - The color to be saturated.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {string} - The saturated color computed for the data label.
     */
    private getSaturatedColor(point: CircularChart3DPoints, color: string, chart: CircularChart3D): string {
        let saturatedColor: string;

        saturatedColor = color === 'transparent' ? this.getLabelBackground(point, chart) : color;

        saturatedColor = (saturatedColor === 'transparent') ? ((chart.theme.indexOf('Dark') > -1 || chart.theme.indexOf('HighContrast') > -1) ? 'black' : 'white') : saturatedColor;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(saturatedColor));
        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return chart.theme === 'Bootstrap5' ? '#212529' : chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' : contrast >= 128 ? chart.theme.indexOf('Tailwind3') > -1 ? '#4B5563' : 'black' : chart.theme.indexOf('Tailwind3') > -1 ? '#D1D5DB' : 'white';
    }

    /**
     * To find background color for the datalabel.
     *
     * @param {CircularChart3DPoints} point - The point to get the color saturation.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {string} - The background color computed for the data label.
     */
    private getLabelBackground(point: CircularChart3DPoints, chart: CircularChart3D): string {
        return point.argsData.series.dataLabel.position === 'Outside' ?
            chart.background || chart.themeStyle.background : !point.y ? chart.theme.indexOf('dark') ? 'white' : 'black' : point.color;
    }

    /**
     * Gets the data label text based on a specified format, chart configuration, and input label text.
     *
     * @param {string} labelFormat - The format string for the data label.
     * @param {CircularChart3D} chart - The Circular 3D chart instance.
     * @param {string} labelText - The original label text to be formatted.
     * @returns {string} - The formatted data label text.
     */
    private getDatalabelText(labelFormat: string, chart: CircularChart3D, labelText: string): string {
        if (Number(labelText)) {
            const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
            const format: Function = chart.intl.getNumberFormat({
                format: customLabelFormat ? '' : labelFormat,
                useGrouping: chart.useGroupingSeparator
            });
            labelText = customLabelFormat ? labelFormat.replace('{value}', format(parseFloat(labelText))) : format(parseFloat(labelText));
        }
        return labelText;
    }

    /**
     * Updates the connector line for a 3D point in a circular 3D series.
     *
     * @param {CircularChart3DPoints} point - The CircularChart3DPoints representing the 3D point.
     * @param {number} pointIndex - The index of the point in the series.
     * @param {CircularChart3DSeries} series - The instance of the circular 3D series.
     * @param {number} connectorHeight - The height of the connector line.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    private updateConnectorLine(
        point: CircularChart3DPoints, pointIndex: number, series: CircularChart3DSeries,
        connectorHeight: number, chart: CircularChart3D): {x: number, y: number, angle: number} {

        const drawPoints: CircularChart3DLocation[] = [];
        const symbolLocation: CircularChart3DSymbolLocation = point.symbolLocation;
        let x: number = symbolLocation.center.x + Math.cos(symbolLocation.angle) * symbolLocation.radius;
        let y: number = symbolLocation.center.y + Math.sin(symbolLocation.angle) * symbolLocation.radius;
        drawPoints.push({ x, y });

        const labelRadiusFromOrigin: number = symbolLocation.radius + connectorHeight;
        const angle: number = symbolLocation.angle;
        x = symbolLocation.center.x + Math.cos(angle) * labelRadiusFromOrigin;
        y = symbolLocation.center.y + Math.sin(angle) * labelRadiusFromOrigin;
        drawPoints.push({ x, y });

        let padding: number;
        if (angle < (Math.PI / 2) || angle >= (Math.PI / 2) + Math.PI) {
            padding = 10;
        }
        else {
            padding = - 10;
        }
        drawPoints.push({ x: x + padding, y: y });

        this.drawLineSegment(drawPoints, pointIndex, series, chart);
        return ({ x: x, y: y, angle: angle });
    }

    /**
     * Draws a line segment based on the provided points in 3D space for the circular 3D series.
     *
     * @param {CircularChart3DLocation[]} drawpoints - An array of CircularChart3DLocation representing the points in 3D space.
     * @param {number} pointIndex - The index of the point in the series.
     * @param {CircularChart3DSeries} series - The instance of the circular 3D series to which the point belongs.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {void}
     */
    private drawLineSegment(
        drawpoints: CircularChart3DLocation[], pointIndex: number, series: CircularChart3DSeries, chart: CircularChart3D): void {
        const vectorPoints: CircularChart3DVector[] = [];

        for (let i: number = 0; i < drawpoints.length; i++) {
            vectorPoints.push(
                chart.vector.vector3D(
                    drawpoints[i as number].x,
                    drawpoints[i as number].y,
                    0
                )
            );
        }

        const seriesIndex: number = series.index;
        const color: string = series.points[pointIndex as number].color;
        const stroke: string = series.dataLabel.connectorStyle.color ? series.dataLabel.connectorStyle.color : color;

        const line: CircularChart3DLabelElement = {
            width: series.dataLabel.connectorStyle.width,
            stroke: stroke,
            child: chart.groupElement,
            tag: 'polyline',
            dashArray: series.dataLabel.connectorStyle.dashArray,
            id: chart.element.id + '-datalabel-series-' + seriesIndex + '-connector-' + pointIndex
        };
        const ploygon: CircularChart3DPolygon = chart.polygon.createPolyline(vectorPoints, line);
        chart.circular3DPolygon.push(ploygon);
    }

    /**
     * Gets the module name for the circular 3D data label.
     *
     * @returns {string} - The module name, which is 'CircularChartDataLabel3D'.
     */
    protected getModuleName(): string {
        return 'CircularChartDataLabel3D';
    }

    /**
     * Destroys the circular 3D chart data label.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }

}
