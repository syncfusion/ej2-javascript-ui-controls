import { Diagram } from '../diagram';
import { NodeModel } from './../objects/node-model';
import { Node } from './../objects/node';
import { ConnectorModel } from './../objects/connector-model';
import { NodeConstraints, ConnectorConstraints, DiagramConstraints, DiagramTools, DiagramAction, RendererAction } from '../enum/enum';
import { AnnotationConstraints, PortConstraints } from '../enum/enum';
import { BezierSegment, Connector } from './../objects/connector';
import { AnnotationModel, PathAnnotationModel, ShapeAnnotationModel } from './../objects/annotation-model';
import { PointPortModel } from './../objects/port-model';
import { Selector } from './../objects/node';
import { SelectorModel } from './../objects/node-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';


/**
 * constraints-util module contains the common constraints \
 *
 * @returns { number }   constraints-util module contains the common constraints  .\
 *
 * @param {ConnectorModel | NodeModel | PathAnnotationModel | ShapeAnnotationModel} node - Provide the DiagramElement value.
 * @private
 */
export function canSelect(node: ConnectorModel | NodeModel | PathAnnotationModel | ShapeAnnotationModel): number {
    if (node) {
        let state: number = 0;
        if ((node instanceof ShapeAnnotation) || (node instanceof PathAnnotation)) {
            state = node.constraints & AnnotationConstraints.Select;
        } else if (node instanceof Connector) {
            state = node.constraints & ConnectorConstraints.Select;
        } else {
            state = node.constraints & NodeConstraints.Select;
        }
        return state;
    }
    return 1;
}

/**
 * Used to check whether we can move the objects ot not\
 *
 * @returns { number }   Used to check whether we can move the objects ot not  .\
 *
 * @param {ConnectorModel | NodeModel | PathAnnotationModel | ShapeAnnotationModel} node - Used to check whether we can move the objects ot not.
 * @private
 */
export function canMove(node: ConnectorModel | NodeModel | SelectorModel | ShapeAnnotationModel | PathAnnotationModel): number {
    if (node) {
        let state: number = 0;
        if ((node instanceof ShapeAnnotation) || (node instanceof PathAnnotation)) {
            state = node.constraints & AnnotationConstraints.Drag;
        } else if (node instanceof Connector) {
            state = node.constraints & ConnectorConstraints.Drag;
        } else if (node instanceof Selector) {
            state = 1;
        } else {
            state = node.constraints & NodeConstraints.Drag;
        }
        return state;
    }
    return 1;
}

/**
 * Used to check the canEnablePointerEvents\
 *
 * @returns { number }   Used to check whether we can move the objects ot not  .\
 *
 * @param {ConnectorModel | NodeModel} node - Used to check whether we can move the objects ot not.
 * @param {Diagram} diagram - Used to check whether we can move the objects ot not.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canEnablePointerEvents(node: ConnectorModel | NodeModel, diagram: Diagram): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.PointerEvents;
    } else {
        state = node.constraints & NodeConstraints.PointerEvents;
    }
    return state;
}

/**
 * Used to check the canDelete of the element \
 *
 * @returns { number }   Used to check the canDelete of the element   .\
 *
 * @param {ConnectorModel | NodeModel} node - Used to check whether we can move the objects ot not.
 * @private
 */
export function canDelete(node: ConnectorModel | NodeModel): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.Delete;
    } else {
        state = node.constraints & NodeConstraints.Delete;
    }
    return state;
}

/**
 * Used to check the bridging of the element \
 *
 * @returns { number }   Used to check the bridging of the element   .\
 *
 * @param {ConnectorModel | NodeModel} connector - provide the connector value.
 * @param {ConnectorModel | NodeModel} diagram - provide the diagram value.
 * @private
 */
export function canBridge(connector: Connector, diagram: Diagram): number {
    let state: number = 0;
    if (connector.constraints & ConnectorConstraints.Bridging) {
        state = connector.constraints & ConnectorConstraints.Bridging;
    } else if (connector.constraints & ConnectorConstraints.InheritBridging) {
        state = diagram.constraints & DiagramConstraints.Bridging;
    } else {
        state = 0;
    }
    return state;
}

/**
 * Used to check the routing  of the element \
 *
 * @returns { number }   Used to check the routing  of the element .\
 *
 * @param {ConnectorModel | NodeModel} connector - provide the connector value.
 * @param {ConnectorModel | NodeModel} diagram - provide the diagram value.
 * @private
 */
export function canEnableRouting(connector: Connector, diagram: Diagram): number {
    let state: number = 0;
    if (connector.constraints & ConnectorConstraints.LineRouting) {
        state = connector.constraints & ConnectorConstraints.LineRouting;
    } else if (connector.constraints & ConnectorConstraints.InheritLineRouting) {
        state = diagram.constraints & DiagramConstraints.LineRouting;
    }
    return state;
}

/**
 * Used to check the  source end dragof the element \
 *
 * @returns { number }   Used to check the  source end dragof the element. \
 *
 * @param {ConnectorModel | NodeModel} connector - provide the connector value.
 * @private
 */
export function canDragSourceEnd(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragSourceEnd;
}

/**
 * Used to check the target end drag   of the element \
 *
 * @returns { number }   Used to check the target end drag   of the element .\
 *
 * @param {ConnectorModel | NodeModel} connector - provide the connector value.
 * @private
 */
export function canDragTargetEnd(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragTargetEnd;
}

/**
 * Used to check the segment  drag   of the element \
 *
 * @returns { number }   Used to check the segment  drag   of the element .\
 *
 * @param {ConnectorModel | NodeModel} connector - provide the connector value.
 * @private
 */
export function canDragSegmentThumb(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragSegmentThumb;
}

/**
 * Used to check the routing  drag   of the element \
 *
 * @returns { number }   Used to check the segment  drag   of the element .\
 *
 * @param {NodeModel | ShapeAnnotationModel | PathAnnotationModel} node - provide the connector value.
 * @private
 */
export function canRotate(node: NodeModel | ShapeAnnotationModel | PathAnnotationModel): number {
    if ((node instanceof ShapeAnnotation) || (node instanceof PathAnnotation)) {
        return node.constraints & AnnotationConstraints.Rotate;
    } else {
        return node.constraints & NodeConstraints.Rotate;
    }
}

/**
 * Used to check shadown constraints   of the element \
 *
 * @returns { number }   Used to check shadown constraints   of the element .\
 *
 * @param {NodeModel} node - provide the connector value.
 * @private
 */
export function canShadow(node: NodeModel): number {
    return node.constraints & NodeConstraints.Shadow;
}

/**
 * Used to check canInConnect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {NodeModel} node - provide the node value.
 * @private
 */
export function canInConnect(node: NodeModel): number {
    if ((node instanceof Node) && (node.constraints & NodeConstraints.InConnect)) {
        return node.constraints & NodeConstraints.InConnect;

    }
    return 0;
}

/**
 * Used to check canPortInConnect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {PointPortModel} port - provide the PointPortModel value.
 * @private
 */
export function canPortInConnect(port: PointPortModel): number {
    if (port && port.constraints) {
        if (!(port.constraints & PortConstraints.None) && (port.constraints & PortConstraints.InConnect)) {
            return port.constraints & PortConstraints.InConnect;

        }
    }
    return 0;
}

/**
 * Used to check canOutConnect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {NodeModel} node - provide the node value.
 * @private
 */
export function canOutConnect(node: NodeModel): number {
    if ((node instanceof Node) && (node.constraints & NodeConstraints.OutConnect)) {
        return node.constraints & NodeConstraints.OutConnect;

    }
    return 0;
}

/**
 * Used to check canPortOutConnect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {PointPortModel} port - provide the node value.
 * @private
 */
export function canPortOutConnect(port: PointPortModel): number {
    if (port && port.constraints) {
        if (!(port.constraints & PortConstraints.None) && (port.constraints & PortConstraints.OutConnect)) {
            return port.constraints & PortConstraints.OutConnect;

        }
    }
    return 0;
}

/**
 * Used to check canResize constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {NodeModel | ShapeAnnotationModel | PathAnnotationModel} node - provide the node value.
 * @param {NodeModel | ShapeAnnotationModel | PathAnnotationModel} direction - provide the node value.
 * @private
 */
export function canResize(node: NodeModel | ShapeAnnotationModel | PathAnnotationModel, direction?: string): number {
    let returnValue: number = 0;
    if (node instanceof ShapeAnnotation || node instanceof PathAnnotation) {
        returnValue = node.constraints & AnnotationConstraints.Resize;
    } else if (node) {
        if (direction === 'SouthEast') {
            returnValue = node.constraints & NodeConstraints.ResizeSouthEast;
        } else if (direction === 'East') {
            returnValue = node.constraints & NodeConstraints.ResizeEast;
        } else if (direction === 'NorthEast') {
            returnValue = node.constraints & NodeConstraints.ResizeNorthEast;
        } else if (direction === 'South') {
            returnValue = node.constraints & NodeConstraints.ResizeSouth;
        } else if (direction === 'North') {
            returnValue = node.constraints & NodeConstraints.ResizeNorth;
        } else if (direction === 'SouthWest') {
            returnValue = node.constraints & NodeConstraints.ResizeSouthWest;
        } else if (direction === 'West') {
            returnValue = node.constraints & NodeConstraints.ResizeWest;
        } else if (direction === 'NorthWest') {
            returnValue = node.constraints & NodeConstraints.ResizeNorthWest;
        }
    }
    return returnValue;
}

/**
 * Used to check canAllowDrop constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {ConnectorModel | NodeModel} node - provide the node value.
 * @private
 */
export function canAllowDrop(node: ConnectorModel | NodeModel): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.AllowDrop;
    } else {
        state = node.constraints & NodeConstraints.AllowDrop;
    }
    return state;
}

/**
 * Used to check canVitualize constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} diagram - provide the Diagram value.
 * @private
 */
export function canVitualize(diagram: Diagram): number {
    return diagram.constraints & DiagramConstraints.Virtualization;
}

/**
 * Used to check canEnableToolTip constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {ConnectorModel | NodeModel} node - provide the node value.
 * @param {Diagram} diagram - provide the Diagram value.
 * @private
 */
export function canEnableToolTip(node: ConnectorModel | NodeModel, diagram: Diagram): number {
    let state: number = 0;
    if (node instanceof Connector) {
        if (node.constraints & ConnectorConstraints.Tooltip) {
            state = node.constraints & ConnectorConstraints.Tooltip;
        } else if (node.constraints & ConnectorConstraints.InheritTooltip) {
            state = diagram.constraints & DiagramConstraints.Tooltip;
        }
    } else {
        if (node.constraints & NodeConstraints.Tooltip) {
            state = node.constraints & NodeConstraints.Tooltip;
        } else if (node.constraints & NodeConstraints.InheritTooltip) {
            state = diagram.constraints & DiagramConstraints.Tooltip;
        }
    }
    return state;
}

/**
 * Used to check canSingleSelect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canSingleSelect(model: Diagram): number {
    return model.tool & DiagramTools.SingleSelect;
}

/**
 * Used to check canMultiSelect constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canMultiSelect(model: Diagram): number {
    return model.tool & DiagramTools.MultipleSelect;
}

/**
 * Used to check canZoomPan constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canZoomPan(model: Diagram): number {
    return model.tool & DiagramTools.ZoomPan;
}

/**
 * Used to check canContinuousDraw constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canContinuousDraw(model: Diagram): number {
    return model.tool & DiagramTools.ContinuousDraw;
}

/**
 * Used to check canDrawOnce constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canDrawOnce(model: Diagram): number {
    return model.tool & DiagramTools.DrawOnce;
}

/**
 * Used to check defaultTool constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function defaultTool(model: Diagram): number {
    return (model.tool & DiagramTools.SingleSelect) || (model.tool & DiagramTools.MultipleSelect);
}

/**
 * Used to check canZoom constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canZoom(model: Diagram): number {
    return model.constraints & DiagramConstraints.Zoom;
}

/**
 * Used to check canPan constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canPan(model: Diagram): number {
    return model.constraints & DiagramConstraints.Pan;
}

/**
 * Used to check canUserInteract constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canUserInteract(model: Diagram): number {
    return model.constraints & DiagramConstraints.UserInteraction;
}

/**
 * Used to check canApiInteract constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canApiInteract(model: Diagram): number {
    return model.constraints & DiagramConstraints.ApiUpdate;
}

/**
 * Used to check canPanX constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canPanX(model: Diagram): number {
    return ((model.constraints & DiagramConstraints.PanX));
}

/**
 * Used to check canPanY constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canPanY(model: Diagram): number {
    return ((model.constraints & DiagramConstraints.PanY));
}

/**
 * Used to check canZoomTextEdit constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} diagram - provide the Diagram value.
 * @private
 */
export function canZoomTextEdit(diagram: Diagram): number {
    return ((diagram.constraints & DiagramConstraints.ZoomTextEdit));
}

/**
 * Used to check canPageEditable constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} model - provide the Diagram value.
 * @private
 */
export function canPageEditable(model: Diagram): number {
    return canApiInteract(model) || (model.diagramActions & DiagramAction.ToolAction);
}

/**
 * Used to check enableReadOnly constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {Diagram} annotation - provide the annotation value.
 * @param {Diagram} node - provide the node value.
 * @private
 */
export function enableReadOnly(annotation: AnnotationModel, node: NodeModel | ConnectorModel): number {
    let enumValue: number = 0;
    enumValue = (node instanceof Connector) ? ConnectorConstraints.ReadOnly : NodeConstraints.ReadOnly;
    if (node.shape.type === 'Text') {
        return node.constraints & NodeConstraints.ReadOnly;
    } else if (node.constraints & enumValue) {
        if (annotation.constraints & AnnotationConstraints.InheritReadOnly) {
            return 1;
        } else {
            return 0;
        }
    } else if (annotation.constraints & AnnotationConstraints.ReadOnly) {
        return 1;
    }
    return 0;
}

/**
 * Used to check canDraw constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {PointPortModel | NodeModel} port - provide the Diagram value.
 * @param {Diagram} diagram - provide the Diagram value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canDraw(port: PointPortModel | NodeModel, diagram: Diagram): number {
    return port.constraints & PortConstraints.Draw;

}

/**
 * Used to check canDrag constraints   of the element \
 *
 * @returns { number }   Used to check canInConnect constraints   of the element .\
 *
 * @param {PointPortModel | NodeModel} port - provide the Diagram value.
 * @param {Diagram} diagram - provide the Diagram value.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canDrag(port: PointPortModel | NodeModel, diagram: Diagram): number {
    return port.constraints & PortConstraints.Drag;

}

/**
 * Used to check canPreventClearSelection constraints   of the element \
 *
 * @returns { boolean }   Used to check canInConnect constraints   of the element .\
 *
 * @param {PointPortModel | NodeModel} diagramActions - provide the diagramActions value.
 * @private
 */
export function canPreventClearSelection(diagramActions: DiagramAction): boolean {
    if (diagramActions & DiagramAction.PreventClearSelection) {
        return true;
    } else {
        return false;
    }
}

/**
 * Used to check canDrawThumbs \
 *
 * @returns { boolean }   Used to check canInConnect constraints   of the element .\
 *
 * @param {RendererAction} rendererActions - provide the RendererAction value.
 * @private
 */
export function canDrawThumbs(rendererActions: RendererAction): boolean {
    if (!(rendererActions & RendererAction.DrawSelectorBorder)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Used to check avoidDrawSelector \
 *
 * @returns { boolean }   Used to check canInConnect constraints   of the element .\
 *
 * @param {RendererAction} rendererActions - provide the RendererAction value.
 * @private
 */
export function avoidDrawSelector(rendererActions: RendererAction): boolean {
    if ((rendererActions & RendererAction.PreventRenderSelector)) {
        return true;
    } else {
        return false;
    }
}
