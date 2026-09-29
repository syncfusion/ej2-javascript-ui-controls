import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDirective, LayersDirective } from './layers.directive';
import { CustomCursorDirective, CustomCursorsDirective } from './customcursor.directive';
import { ConnectorFixedUserHandleDirective, ConnectorFixedUserHandlesDirective } from './connector-fixeduserhandle.directive';
import { ConnectorAnnotationDirective, ConnectorAnnotationsDirective } from './connector-annotation.directive';
import { ConnectorDirective, ConnectorsDirective } from './connectors.directive';
import { NodeFixedUserHandleDirective, NodeFixedUserHandlesDirective } from './node-fixeduserhandle.directive';
import { NodeAnnotationDirective, NodeAnnotationsDirective } from './node-annotation.directive';
import { PortDirective, PortsDirective } from './ports.directive';
import { NodeDirective, NodesDirective } from './nodes.directive';
import { DiagramComponent } from './diagram.component';

const DIAGRAM_DIRECTIVES = [
    DiagramComponent,
        LayerDirective,
        LayersDirective,
        CustomCursorDirective,
        CustomCursorsDirective,
        ConnectorFixedUserHandleDirective,
        ConnectorFixedUserHandlesDirective,
        ConnectorAnnotationDirective,
        ConnectorAnnotationsDirective,
        ConnectorDirective,
        ConnectorsDirective,
        NodeFixedUserHandleDirective,
        NodeFixedUserHandlesDirective,
        NodeAnnotationDirective,
        NodeAnnotationsDirective,
        PortDirective,
        PortsDirective,
        NodeDirective,
        NodesDirective
];

/**
 * NgModule definition for the Diagram component.
 * Re-exports standalone Diagram component and directives so existing apps can keep using:
 * `imports: [DiagramModule]`
 */
@NgModule({
    imports: [CommonModule, ...DIAGRAM_DIRECTIVES],
    exports: [...DIAGRAM_DIRECTIVES]
})
export class DiagramModule { }