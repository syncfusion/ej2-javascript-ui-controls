import { BulletChart } from '../bullet-chart';
import { compile as templateComplier } from '@syncfusion/ej2-base';
import { stringToNumber } from '../../common/utils/helper';
import { IBulletTooltipContent, IBulletchartTooltipEventArgs } from '../model/bullet-interface';
import { tooltipRender } from '../../common/model/constants';
import { BulletChartAxis } from '../renderer/bullet-axis';


/**
 * `BulletTooltip` module is used to render the tooltip for bullet chart.
 */
export class BulletTooltip {
    private elementId: string;
    public toolTipInterval: number;
    private control: BulletChart;
    private templateFn: Function;
    /** @private */
    public bulletAxis: BulletChartAxis;

    /**
     * Constructor for tooltip module.
     *
     * @private
     * @param {BulletChart} bullet - The bullet chart control.
     */
    constructor(bullet: BulletChart) {
        this.control = bullet;
        this.elementId = bullet.element.id;
        this.bulletAxis = new BulletChartAxis(this.control);
    }

    /**
     * To create tooltip div element.
     *
     * @param {PointerEvent} e - The pointer event.
     * @param {string} targetClass - The class name of the target element.
     * @param {string} targetId - The id of the target element.
     * @param {number} mouseX - The X-coordinate of the mouse.
     * @returns {void}
     */
    public _elementTooltip(e: PointerEvent, targetClass: string, targetId: string, mouseX: number): void {
        const tooltipDiv: HTMLDivElement = <HTMLDivElement>this.control.createElement('div');
        tooltipDiv.id = 'tooltip';
        tooltipDiv.className = 'tooltipDiv';
        const target: Element = e.target as Element;
        const pageX: number = mouseX + 20;
        const pageY: number = e.clientY;
        let str: string = '';
        const font: string = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
            this.control.themeStyle.tooltipLabelFont.fontStyle;
        const fill: string = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
        const color: string = this.control.themeStyle.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
        const style: string = 'left:' + pageX + 'px;' + 'top:' + pageY + 'px;' +
            'display: block; position: absolute; "z-index": "13000",cursor: default;' +
            'font-family: Segoe UI;' + 'color:' + color + '; font-size: 13px; background-color:' +
            fill + '; border: 1px solid #707070;' + 'font-style:' + font + ';';
        // adding css prop to the div
        tooltipDiv.style.cssText = style;
        if (targetClass === this.control.svgObject.id + '_Caption') {
            str = target.textContent === this.control.title ? '' : this.control.title;
        } else if (targetClass === this.control.svgObject.id + '_SubTitle') {
            str = target.textContent === this.control.subtitle ? '' : this.control.subtitle;
        }
        if (str !== '') {
            tooltipDiv.innerHTML = '&nbsp' + str + '&nbsp';
            document.body.insertAdjacentElement('afterbegin', tooltipDiv);
        }
    }


    /**
     * To display the bullet chart tooltip.
     *
     * @param {PointerEvent} e - The pointer event.
     * @param {string} targetClass - The class name of the target element.
     * @param {string} targetId - The id of the target element.
     * @param {number} mouseX - The X-coordinate of the mouse.
     * @param {number} mouseY - The Y-coordinate of the mouse.
     * @returns {void}
     */
    public _displayTooltip(e: PointerEvent, targetClass: string, targetId: string, mouseX: number, mouseY: number): void {
        if (targetClass !== 'undefined' && this.control.tooltip.enable && (targetClass === this.control.svgObject.id + '_FeatureMeasure' ||
            targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
            let targetVal: string[] = [];
            let tooltipdiv: HTMLDivElement;
            const format: string = this.bulletAxis.getFormat(this.control);
            const isCustomFormat: boolean = format.match('{value}') !== null;
            const measureId: string = targetId.substring(targetId.lastIndexOf('_') + 1);
            let targetValues: string[] = [];
            this.bulletAxis.format = this.bulletAxis.bulletChart.intl.getNumberFormat({
                format: isCustomFormat ? '' : format, useGrouping: this.bulletAxis.bulletChart.enableGroupSeparator
            });
            const currentVal: number = this.control.dataSource[measureId as string][this.control.valueField];
            targetVal = targetVal.concat(this.control.dataSource[measureId as string ][this.control.targetField]);
            const categoryVal: number = this.control.dataSource[measureId as string][this.control.categoryField];
            let labelCurrentText: string = currentVal ? (currentVal).toString() : '';
            const labelTargetText: string = targetVal ? (targetVal).toString() : '';
            let labelCategoryText: string = categoryVal ? (categoryVal).toString() : '';
            labelCurrentText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +currentVal);
            for (let i: number = 0; i < targetVal.length; i++) {
                targetValues = targetValues.concat(this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat,
                                                                               format, +targetVal[i as number]));
            }
            labelCategoryText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +categoryVal);
            const data: IBulletTooltipContent = { value: labelCurrentText, target: targetValues, category: labelCategoryText };
            const tooltipData: IBulletTooltipContent = { value: labelCurrentText, target: labelTargetText, category: labelCategoryText };
            const style: string = 'position: absolute; z-index: 13000; display: block;';
            if (document.getElementsByClassName('tooltipDiv' + this.control.element.id).length === 0) {
                tooltipdiv = <HTMLDivElement>this.control.createElement('div');
                tooltipdiv.id = 'tooltipDiv' + this.control.element.id;
                tooltipdiv.style.cssText = style;
                document.getElementById(this.control.element.id + '_Secondary_Element').appendChild(tooltipdiv);
            }
            const argsData: IBulletchartTooltipEventArgs = {
                value: data.value, target: data.target, name: tooltipRender
            };
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                this.updateTemplateFn();
                const elem: Element = this.control.createElement('div', { id: this.control.element.id + 'parent_template' });
                let templateElement: HTMLCollection = this.templateFn(
                    tooltipData, this.control, 'template', elem.id + '_blazorTemplate', '', null, elem
                );
                while (templateElement && templateElement.length > 0) {
                    if (templateElement.length === 1) {
                        elem.appendChild(templateElement[0]);
                        templateElement = null;
                    } else {
                        elem.appendChild(templateElement[0]);
                    }
                }
                argsData.template = (<HTMLElement>elem).innerHTML;
                this.control.trigger(tooltipRender, argsData);
                (<HTMLElement>elem).innerHTML = argsData.template;
                tooltipdiv.appendChild(elem);
            } else {
                let argsText: string = 'Value : ' + argsData.value;
                for (let i: number = 0; i < argsData.target.length; i++) {
                    argsText += '<br/> Target' + (i === 0 ? '' : '_' + i) + ' : ' + argsData.target[i as number];
                }
                argsData.text = argsText;
                this.control.trigger(tooltipRender, argsData);
                tooltipdiv.innerHTML = argsData.text;
                tooltipdiv.style.font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
                    this.control.themeStyle.tooltipLabelFont.fontStyle;
                tooltipdiv.style.color = this.control.themeStyle.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
                tooltipdiv.style.fontSize = this.control.themeStyle.titleFont.size;
            }
            const fill: string = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
            const borderWidth: number = ((this.control.theme === 'Fabric' || this.control.theme === 'Fluent' && !this.control.tooltip.border.width) ? 1 : this.control.tooltip.border.width);
            const borderColor: string = ((this.control.theme === 'Fabric' || this.control.theme === 'Fluent' && !this.control.tooltip.border.color) ? '#D2D0CE' : this.control.tooltip.border.color);
            const borderDashArray: string = this.control.tooltip.border.dashArray ? 'dashed ' + borderColor + '; border-dasharray: ' + this.control.tooltip.border.dashArray + ';' : 'Solid' + ' ' + borderColor + ';';
            let xPos: number = mouseX;
            let yPos: number = mouseY;
            xPos = ((xPos + stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth) < window.innerWidth) ?
                (xPos) : stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth));
            yPos = ((yPos + stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight) < window.innerHeight) ?
                (yPos) : stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight));
            if (xPos === undefined || xPos === null) {
                xPos = mouseX;
            }
            if ((xPos + tooltipdiv.clientWidth) > this.control.availableSize.width) {
                xPos -= tooltipdiv.clientWidth + 20;
            }
            if (yPos === undefined || yPos === null) {
                yPos = e.clientY;
            }
            if (yPos + tooltipdiv.clientHeight > this.control.availableSize.height) {
                yPos -= tooltipdiv.clientHeight + 20;
            }
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                tooltipdiv.style.cssText = 'position: absolute;left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;';
            } else {
                const fontFamily: string = this.control.tooltip.textStyle.fontFamily || this.control.themeStyle.tooltipLabelFont.fontFamily;
                const color: string = this.control.tooltip.textStyle.color || this.control.themeStyle.tooltipLabelFont.color;
                const divStyle: string = style + 'left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;' +
                    '-webkit-border-radius: 5px 5px 5px 5px; -moz-border-radius: 5px 5px 5px 5px;-o-border-radius: 5px 5px 5px 5px;' +
                    'border-radius: 5px 5px 5px 5px;' + 'background-color:' + fill + ';' + 'color:' +
                    color + '; border:' + borderWidth + 'px ' + borderDashArray +
                    'padding-bottom: 7px;' + 'font-style:' + this.control.themeStyle.tooltipLabelFont.fontStyle +
                    '; padding-left: 10px; font-family:' + fontFamily + '; font-size:' + this.control.tooltip.textStyle.size + '; padding-right: 10px; padding-top: 7px';
                tooltipdiv.style.cssText = divStyle;
                if (this.control.theme.indexOf('Fluent2') > -1) {
                    const shadowId: string = this.control.element.id + '_shadow';
                    const shadow: string = `<filter id="${shadowId}" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>` +
                        `<feOffset dx="-1" dy="3.6" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.2"/>` +
                        `</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
                    const defElement: Element = this.control.renderer.createDefs();
                    defElement.setAttribute('id', this.control.element.id + 'SVG_tooltip_definition');
                    tooltipdiv.appendChild(defElement);
                    defElement.innerHTML = shadow;
                    tooltipdiv.style.filter = `url(#${shadowId})`;
                }
                if ((targetClass === this.control.svgObject.id + '_FeatureMeasure') ||
                    (targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
                    document.getElementById(targetId).setAttribute('opacity', '0.6');
                }
            }
            if ((this.control as any).isReact) { (this.control as any).renderReactTemplates(); }
        }
    }

    /**
     * To update template values in the tooltip.
     *
     * @returns {void}
     */
    public updateTemplateFn(): void {
        if (this.control.tooltip.template) {
            try {
                if (typeof this.control.tooltip.template !== 'function' &&
                 document.querySelectorAll(this.control.tooltip.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.control.tooltip.template).innerHTML.trim());
                } else {
                    this.templateFn = templateComplier(this.control.tooltip.template);
                }
            } catch (e) {
                this.templateFn = templateComplier(this.control.tooltip.template);
            }
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'BulletTooltip';
    }
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method called here
    }
}
