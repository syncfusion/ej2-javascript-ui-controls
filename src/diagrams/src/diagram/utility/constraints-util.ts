import { Diagram } from '../diagram';
import { NodeModel } from './../objects/node-model';
import { Node } from './../objects/node';
import { ConnectorModel } from './../objects/connector-model';
import { NodeConstraints, ConnectorConstraints, DiagramConstraints, DiagramTools, DiagramAction } from '../enum/enum';
import { AnnotationConstraints, PortConstraints } from '../enum/enum';
import { Connector } from './../objects/connector';
import { AnnotationModel, PathAnnotationModel, ShapeAnnotationModel } from './../objects/annotation-model';
import { PointPortModel } from './../objects/port-model';
import { Selector } from './../interaction/selector';
import { SelectorModel } from './../interaction/selector-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';

/**
 * constraints-util module contains the common constraints
 */

/** @private */
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

/** @private */
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

/** @private */
export function canEnablePointerEvents(node: ConnectorModel | NodeModel, diagram: Diagram): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.PointerEvents;
    } else {
        state = node.constraints & NodeConstraints.PointerEvents;
    }
    return state;
}

/** @private */
export function canDelete(node: ConnectorModel | NodeModel): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.Delete;
    } else {
        state = node.constraints & NodeConstraints.Delete;
    }
    return state;
}

/** @private */
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

/** @private */
export function canDragSourceEnd(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragSourceEnd;
}

/** @private */
export function canDragTargetEnd(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragTargetEnd;
}

/** @private */
export function canDragSegmentThumb(connector: Connector): number {
    return connector.constraints & ConnectorConstraints.DragSegmentThumb;
}

/** @private */
export function canRotate(node: NodeModel | ShapeAnnotationModel | PathAnnotationModel): number {
    if ((node instanceof ShapeAnnotation) || (node instanceof PathAnnotation)) {
        return node.constraints & AnnotationConstraints.Rotate;
    } else {
        return node.constraints & NodeConstraints.Rotate;
    }
}

/** @private */
export function canShadow(node: NodeModel): number {
    return node.constraints & NodeConstraints.Shadow;
}

/** @private */
export function canInConnect(node: NodeModel): number {
    if ((node instanceof Node) && (node.constraints & NodeConstraints.InConnect)) {
        return node.constraints & NodeConstraints.InConnect;

    }
    return 0;
}

/** @private */
export function canOutConnect(node: NodeModel): number {
    if ((node instanceof Node) && (node.constraints & NodeConstraints.OutConnect)) {
        return node.constraints & NodeConstraints.OutConnect;

    }
    return 0;
}

/** @private */
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

/** @private */
export function canAllowDrop(node: ConnectorModel | NodeModel): number {
    let state: number = 0;
    if (node instanceof Connector) {
        state = node.constraints & ConnectorConstraints.AllowDrop;
    } else {
        state = node.constraints & NodeConstraints.AllowDrop;
    }
    return state;
}

/** @private */
export function canVitualize(diagram: Diagram): number {
    return diagram.constraints & DiagramConstraints.Virtualization;
}

/** @private */
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

/** @private */
export function canSingleSelect(model: Diagram): number {
    return model.tool & DiagramTools.SingleSelect;
}

/** @private */
export function canMultiSelect(model: Diagram): number {
    return model.tool & DiagramTools.MultipleSelect;
}

/** @private */
export function canZoomPan(model: Diagram): number {
    return model.tool & DiagramTools.ZoomPan;
}

/** @private */
export function canContinuousDraw(model: Diagram): number {
    return model.tool & DiagramTools.ContinuousDraw;
}

/** @private */
export function canDrawOnce(model: Diagram): number {
    return model.tool & DiagramTools.DrawOnce;
}

/** @private */
export function defaultTool(model: Diagram): number {
    return (model.tool & DiagramTools.SingleSelect) || (model.tool & DiagramTools.MultipleSelect);
}

/** @private */
export function canZoom(model: Diagram): number {
    return model.constraints & DiagramConstraints.Zoom;
}

/** @private */
export function canPan(model: Diagram): number {
    return model.constraints & DiagramConstraints.Pan;
}

/** @private */
export function canUserInteract(model: Diagram): number {
    return model.constraints & DiagramConstraints.UserInteraction;
}

/** @private */
export function canApiInteract(model: Diagram): number {
    return model.constraints & DiagramConstraints.ApiUpdate;
}

/** @private */
export function canPanX(model: Diagram): number {
    return ((model.constraints & DiagramConstraints.PanX));
}

/** @private */
export function canPanY(model: Diagram): number {
    return ((model.constraints & DiagramConstraints.PanY));
}

/** @private */
export function canZoomTextEdit(diagram: Diagram): number {
    return ((diagram.constraints & DiagramConstraints.ZoomTextEdit));
}

/** @private */
export function canPageEditable(model: Diagram): number {
    return canApiInteract(model) || (model.diagramActions & DiagramAction.ToolAction);
}

/** @private */
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

/** @private */
export function canDraw(port: PointPortModel | NodeModel, diagram: Diagram): number {
    return port.constraints & PortConstraints.Draw;

}

/** @private */
export function canDrag(port: PointPortModel | NodeModel, diagram: Diagram): number {
    return port.constraints & PortConstraints.Drag;

}

