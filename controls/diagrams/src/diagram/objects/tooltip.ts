import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { Tooltip, AnimationModel, Position, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { TooltipRelativeMode } from '../enum/enum';
import { Diagram } from '../diagram';
import { NodeModel } from './node-model';
import { ConnectorModel } from './connector-model';
import { DiagramTooltipModel } from './tooltip-model';
/** 
 * Defines the tooltip that should be shown when the mouse hovers over node.
 * An object that defines the description, appearance and alignments of tooltip
 */
export abstract class DiagramTooltip extends ChildProperty<DiagramTooltip> {

    /**
     * Defines the content of the Tooltip
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;

    /**
     * Defines the position of the Tooltip
     * @default 'TopLeft'
     */
    @Property('TopLeft')
    public position: Position;

    /**
     * Defines the relative mode of the Tooltip
     * * Object - sets the tooltip position relative to the node
     * * Mouse - sets the tooltip position relative to the mouse
     * @default 'Mouse'
     */
    @Property('Mouse')
    public relativeMode: TooltipRelativeMode;

    /**
     * Defines if the Tooltip has tip pointer or not
     * @default true
     */
    @Property(true)
    public showTipPointer: boolean;

    /**
     * Sets the width of the Tooltip
     * @default 'auto'
     */
    @Property('auto')
    public width: number | string;

    /**
     * Sets the height of the Tooltip
     * @default 'auto'
     */
    @Property('auto')
    public height: number | string;

    /**
     * Allows to set the same or different animation option for the Tooltip, when it is opened or closed.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip,
     * tooltip: { content: getcontent(), position: 'TopLeft', relativeMode: 'Object',
     * animation: { open: { effect: 'FadeZoomIn', delay: 0 },
     * close: { effect: 'FadeZoomOut', delay: 0 } } },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * function getcontent(): => {
     * ...
     * }
     * ```
     * @aspDefaultValueIgnore
     * @default { open: { effect: 'FadeIn', duration: 150, delay: 0 }, close: { effect: 'FadeOut', duration: 150, delay: 0 } }
     */
    @Property()
    public animation: AnimationModel;
}

/**
 * @private
 * defines the Tooltip.
 * @param diagram
 */
export function initTooltip(diagram: Diagram): Tooltip {
    let tooltipOption: Tooltip = new Tooltip;
    tooltipOption = updateTooltipContent(diagram.tooltip, tooltipOption);
    let tooltip: Tooltip = new Tooltip(tooltipOption);
    tooltip.beforeCollision = beforeCollision;
    tooltip.beforeOpen = beforeOpen;
    tooltip.cssClass = 'e-diagram-tooltip';
    tooltip.opensOn = 'custom';
    tooltip.appendTo('#' + diagram.element.id);
    tooltip.close();
    return tooltip;
}

function beforeOpen(args: TooltipEventArgs): void {
    if ((this.content === '' || this.content === undefined)) {
        args.element.style.display = 'none';
    }
}

function beforeCollision(args: TooltipEventArgs): void {
    if ((args.collidedPosition && args.collidedPosition !== this.position)) {
        args.element.style.display = 'none';
    }
}

/**
 * @private
 * updates the contents of the tooltip.
 * @param diagram
 * @param node
 */
export function updateTooltip(diagram: Diagram, node?: NodeModel | ConnectorModel): Tooltip {
    let tooltip: DiagramTooltipModel;
    let tooltipObject: Tooltip = diagram.tooltipObject;
    tooltip = node ? node.tooltip : diagram.tooltip;
    updateTooltipContent(tooltip, tooltipObject);
    return tooltipObject;
}

function updateTooltipContent(tooltip: DiagramTooltipModel, tooltipObject: Tooltip): Tooltip {
    if (tooltip.content) {
        tooltipObject.content = tooltip.content;
        tooltipObject.position = tooltip.position;
        tooltipObject.showTipPointer = tooltip.showTipPointer;
        tooltipObject.width = tooltip.width;
        tooltipObject.height = tooltip.height;
        if (!tooltip.animation) {
            tooltipObject.animation = { close: { effect: 'None' } };
        } else {
            tooltipObject.animation = tooltip.animation;
        }
    } else {
        tooltipObject.close();
    }
    return tooltipObject;
}



