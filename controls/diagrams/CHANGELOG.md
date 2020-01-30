# Changelog

## [Unreleased]

## 17.4.46 (2020-01-30)

### Diagram

#### New Features

- `#232055` - Support has been provided to Clip/Ellipsis the annotation when textWrapping as WrapWithOverflow in the diagram.
- `#253884` - Template support for HTML node has been provided.
- `#236612`, `#242275` - The support has been provided to get the In and Out edges from ports.

#### Bug Fixes

- `#260927` - The issue "UmlClassDiagram is not updated properly in the layout" has been fixed.
- `#227953` - The exception occurred while applying line routing for the complex diagram has been fixed.
- `#259627` - The issue "Performance improvement with HTML node" has been fixed.
- `#259329` - The issue "Polyline target decorator is not aligned properly at runtime" has been fixed.
- `F149983` - The exception occurred while changing the z-index for group node at run time has been fixed.
- `259000` - The issue "ConnectionChange Event does not triggered in mouse up" has been fixed.
- `#259960` - The issue "Expand and collapse not working on the Mindmap Layout" has been fixed.
- `#260287` - The issue "left most node unable to be selected in the layout sample" has been fixed.
- `#256458` - The diagram html content is cutoff, while exporting the diagram issue has been fixed.
- `#259774` - The issue with connector and node opacity that is decreased while expanding and collapsing a ComplexHierarchicalTree layout has been fixed.
- `#259981` - Provides support to add group node children at runtime.

## 17.4.44 (2021-01-21)

### Diagram

#### Bug Fixes

- `#259960` - The issue "Expand and collapse not working on the Mindmap Layout" has been fixed.
- `#260287` - The issue "left most node unable to be selected in the layout sample" has been fixed.
- `#256458` - The diagram html content is cutoff, while exporting the diagram issue has been fixed.
- `#259774` - The issue with connector and node opacity that is decreased while expanding and collapsing a ComplexHierarchicalTree layout has been fixed.
- `#259981` - Provides support to add group node children at runtime.

## 17.4.43 (2020-01-14)

### Diagram

#### Bug Fixes

- `#259627` - The issue "Performance improvement with HTML node" has been fixed.
- `#259329` - The issue "Polyline target decorator is not aligned properly at runtime" has been fixed.
- `F149983` - The exception occurred while changing the z-index for group node at run time has been fixed.
- `259000` - The issue "ConnectionChange Event does not triggered in mouse up" has been fixed.

## 17.4.41 (2020-01-07)

### Diagram

#### New Features

- `#232055` - Support has been provided to Clip/Ellipsis the annotation when textWrapping as WrapWithOverflow in the diagram.
- `#253884` - Template support for HTML node has been provided.
- `#236612`, `#242275` - The support has been provided to get the In and Out edges from ports.

#### Bug Fixes

- `#258539` - The issue "Unable to move the connector together with the group when editing an Orthogonal connector segment in a group" has been fixed.

## 17.4.40 (2019-12-24)

### Diagram

#### Bug Fixes

- `#258522` - The issue with the connector that is not attached to the node when we draw a connector at the edge of the port has been fixed.

## 17.4.39 (2019-12-17)

### Diagram

#### New Features

- `#248460`,`#253930` - The support has been provided to restrict the movement of lane children beyond their boundaries.
- `#254732` - The support has been provided to rearrange lanes within the swimlane.

#### Bug Fixes

- `F149060` - The issue "unable to remove the connector drawn at the run time" has been fixed.
- `F148889` - The issue with the collectionChange event arguments that do not have parentId information in the element property has been fixed.
- `F148889` - The issue with the TextAnnotation element size that grows on every move has been fixed.
- `F148889` - Exception raises when we clear and change the text of TextAnnotation node and click to focus on other element has been fixed.
- `F148889` - The issue with the Position change event that is not raised properly has been fixed.
- `#227953` - The issue with updating line routing dynamically has been fixed.
- `#254993` - The issue "Text Wrapping is not working for lane headers" has been fixed.
- `#255299` - Visibility issue while using image as content for user handle is now fixed.
- `#249873` - The issue with an exception that thrown while dragging an element from the pale if we have several diagrams and destroy one diagram has been resolved.
- `#F147762` - The issue "Template annotation drawn numerous times during runtime changes" has been fixed.
- `#249484` - The issue "Multi-selected node rotation not rotating based on center" has been resolved.
- `#242645` - The issue "Unable to select a node in swimlane" has been fixed.
- `#249697` - The selection after drag and drop the nodes out side of the diagram region is now working fine.
- `#250965` - The performance issue occurs while dragging the diagram elements in flowchart samples has been resolved.
- `#F148052` - The issue "CollectionChange event support while adding lanes at runtime" has been fixed.
- `#250191` - The issue "Exception raised while deleting a node/connector when you set a diagram node/connector Id as a number" has been fixed.
- The issue "Unable to hide a layer at runtime" has been fixed.
- `#249091` - The issue with the grid lines that are black in Safari browser for Angular sample has been fixed.
- Now, the image size will be set as image node size when the size is not given.
- `#246889` - The issue "Context menu event will be triggered in ubuntu before the mouse up event, while context menu event will be fired in windows after mouse up" has been fixed.
- `#253855` - The exception that thrown in addNodeToLane method because Undo/Redo Module is not injected has been fixed.
- `#253804` - The issue with the Swimlane Header annotation styles that are unable to change has been fixed.
- `#254194` - The issue "when resizing the text node, text content does not wraps with respect to node size" has been fixed.
- `#253742` - The issue "children in the swimlane cannot be selected when resizing the lane, which is outside the view ports" has been fixed.
- `F148797`,`F148792` - The issue with the Swimlane Header annotation styles that are unable to change has been fixed.
- `#249143` - The issue "Horizontal and vertical alignment not working for the complex hierarchical layout" has been fixed.
- `#256080` - The issue with the shapes in the overview component that cannot be dragged, if the diagram ScrollLimit is Limited has been fixed.
- `#256513` - The issue "Not able to determine undo/redo action in the historyChange event" has been fixed.
- `F149553` - The issue with the position of nodes in the layout that is not retained when we interact and serialize the diagram with the layout at runtime has been fixed.

## 17.3.30 (2019-12-03)

### Diagram

#### Bug Fixes

- `#256513` - The issue "Not able to determine undo/redo action in the historyChange event" has been fixed.
- `F148889` - The issue with the collectionChange event arguments that do not have parentId information in the element property has been fixed.
- `F148889` - The issue with the TextAnnotation element size that grows on every move has been fixed.
- `F148889` - Exception raises when we clear and change the text of TextAnnotation node and click to focus on other element has been fixed.
- `F148889` - The issue with the Position change event that is not raised properly has been fixed.

## 17.3.29 (2019-11-26)

### Diagram

#### New Features

- `#248460`,`#253930` - The support has been provided to restrict the movement of lane children beyond their boundaries.
- `#254732` - The support has been provided to rearrange lanes within the swimlane.

#### Bug Fixes

- `F149060` - The issue "unable to remove the connector drawn at the run time" has been fixed.
- `#227953` - The issue with updating line routing dynamically has been fixed.
- `#254993` - The issue "Text Wrapping is not working for lane headers" has been fixed.
- `#255299` - Visibility issue while using image as content for user handle is now fixed.

## 17.3.28 (2019-11-19)

### Diagram

#### Bug Fixes

- `#254194` - The issue "when resizing the text node, text content does not wraps with respect to node size" has been fixed.

- `#253742` - The issue "children in the swimlane cannot be selected when resizing the lane, which is outside the view ports" has been fixed.

- `F148797`,`F148792` - The issue with the Swimlane Header annotation styles that are unable to change has been fixed.

## 17.3.27 (2019-11-12)

### Diagram

#### Bug Fixes

- `#246889` - The issue "Context menu event will be triggered in ubuntu before the mouse up event, while context menu event will be fired in windows after mouse up" has been fixed.
- `#253855` - The exception that thrown in addNodeToLane method because Undo/Redo Module is not injected has been fixed.
- `#253804` - The issue with the Swimlane Header annotation styles that are unable to change has been fixed.

## 17.3.21 (2019-10-30)

### Diagram

#### Bug Fixes

- Now, the image size will be set as image node size when the size is not given.

### Diagram

#### Bug Fixes

- `#249091` - The issue with the grid lines that are black in Safari browser for Angular sample has been fixed.

## 17.3.19 (2019-10-22)

### Diagram

#### Bug Fixes

- `#250965` - The performance issue occurs while dragging the diagram elements in flowchart samples has been resolved.
- `#F148052` - The issue "CollectionChange event support while adding lanes at runtime" has been fixed.
- `#250191` - The issue "Exception raised while deleting a node/connector when you set a diagram node/connector Id as a number" has been fixed.
- The issue "Unable to hide a layer at runtime" has been fixed.

## 17.3.17 (2019-10-15)

### Diagram

#### New Features

- `#249143` - The issue "Horizontal and vertical alignment not working for the complex hierarchical layout" has been fixed.

#### Bug Fixes

- `#249873` - The issue with an exception that thrown while dragging an element from the pale if we have several diagrams and destroy one diagram has been resolved.
- `#F147762` - The issue "Template annotation drawn numerous times during runtime changes" has been fixed.
- `#249484` - The issue "Multi-selected node rotation not rotating based on center" has been resolved.
- `#242645` - The issue "Unable to select a node in swimlane" has been fixed.
- `#249697` - The selection after drag and drop the nodes out side of the diagram region is now working fine.

## 17.3.14 (2019-10-03)

### Diagram

#### Bug Fixes

- `#F147622` - The issue "Annotation content is not properly aligned for Bezier connector when Segments has control points" has been resolved.
- `#247074` - The issue "Overview size reset to zero while resizing the browser window" has been resolved.
- `#248460` - The node ports of all diagram nodes are visible when we move a single node in the diagram has been fixed.
- `F147492` - The issue "dragging one node and dropping it to another node, the node highlighter not removed" has been fixed.
- `#F147578`- Exception raised on swim lane rendering has been fixed.
- `#247967` - Exception raised while moving overview rectangle when HTML node contains SVG tag has been fixed.
- `#249149` - Console errors occur when try to edit the orthogonal segments using Ctrl+Shift+click is now resolved.

## 17.3.9-beta (2019-09-20)

### Diagram

#### New Features

- `211256`,`227953`,`243284` - Automatic line routing support have been added.
- `#242645` - The issue "Support to add node in lanes collection at runtime" is now resolved.

#### Bug Fixes

- `#243153` - Annotation wrapping is now working with textWrapping as WrapWithOverflow when there is a space in the annotation content.
- `#242713` - The diagram connectors is now exported properly with WebKit.
- `#247140` - The improper position of HTML node's in the overview has been fixed.
- `#F147015` - The issue on printing the diagram content alone in multiple page when margin is set as zero has been fixed.
- `#246626` - The issue "Hidden layered objects visible while changing the properties" is now resolved.
- `#245915` - Now, the z-index of the HTML nodes works properly.
- `#245696`,`#245047`,`#244836` - Now, the Angular diagram will be rendered properly when we set the target as es6/es2015 in ts.config file.
- `#244623` - The issue "Flip not working for HTML node" is now resolved.
- `#242968` - Now, the sequence connector updated properly while changing port to port connection at runtime.
- `#244365` - Now, the user handle events firing after zoom in the diagram is validated.
- `#245231` - The issue "When we draw multiple nodes horizontally and update layout at runtime, connectors are not updated in straight" is now resolved.
- `#244804` - The fill color for target Decorator is now applied properly for sequence connector.
- `#245061` - The issue "Nodes beyond the diagram view port also rendered dynamically, when enable the virtualization" is now resolved.
- `#146327` - The issue "Layout not working for Group Node" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke Width for it" is now resolved.
- `#242713` - The issue "Diagram Connectors not exported properly using web kit" is now resolved.
- `#244589`, `#244046` - The issue "Context menu properties are generated in MVC" is now resolved.
- `#243734` - The issue "Symbol Palette - first palette element gets removed while refresh the palette" is now resolved.
- `#244519` - The issue "Support to delete a lane from swimlane" is now resolved.
- The issue "Ports are not rendered when we enable virtualization" is now resolved.
- `#243785` - The issue "Symbol palette first row expands twice on click" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke width for it" is now resolved.

## 17.2.49 (2019-09-04)

### Diagram

#### Bug Fixes

- `#246626` - The issue "Hidden layered objects visible while changing the properties" is now resolved.
- `#245915` - Now, the z-index of the HTML nodes works properly.

## 17.2.46 (2019-08-22)

### Diagram

#### Bug Fixes

- `#245696`,`#245047`,`#244836` - Now, the Angular diagram will be rendered properly when we set the target as es6/es2015 in ts.config file.
- `#244623` - The issue "Flip not working for HTML node" is now resolved.
- `#242968` - Now, the sequence connector updated properly while changing port to port connection at runtime.
- `#244365` - Now, the user handle events firing after zoom in the diagram is validated.
- `#245231` - The issue "When we draw multiple nodes horizontally and update layout at runtime, connectors are not updated in straight" is now resolved.
- `#244804` - The fill color for target Decorator is now applied properly for sequence connector.
- `#245061` - The issue "Nodes beyond the diagram view port also rendered dynamically, when enable the virtualization" is now resolved.

## 17.2.41 (2019-08-14)

### Diagram

#### Bug Fixes

- `#146327` - The issue "Layout not working for Group Node" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke Width for it" is now resolved.
- `#242713` - The issue "Diagram Connectors not exported properly using web kit" is now resolved.
- `#244589`, `#244046` - The issue "Context menu properties are generated in MVC" is now resolved.
- `#243734` - The issue "Symbol Palette - first palette element gets removed while refresh the palette" is now resolved.
- `#244519` - The issue "Support to delete a lane from swimlane" is now resolved.
- The issue "Ports are not rendered when we enable virtualization" is now resolved.

## 17.2.40 (2019-08-06)

### Diagram

#### Bug Fixes

- `#243785` - The issue "Symbol palette first row expands twice on click" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke width for it" is now resolved.

## 17.2.39 (2019-07-30)

### Diagram

#### New Features

- `#242645` - The issue  "Support to add node in lanes collection at runtime" is now resolved.

#### Bug Fixes

- `#243078` - The issue "Hidden layer is visible" is now resolved.
- The issue "Context menu re-opens if you click a menu item quickly" is now working fine.

## 17.2.36 (2019-07-24)

### Diagram

#### Bug Fixes

- #236860, #237139 - The issue "MouseMove event is not triggered in Firefox" is now resolved.
- #241680 - The issue "Nodes drawn using drawing tools not appeared in overview" is now resolved.
- #240493 - The console error thrown while resizing the window in Chrome has been fixed.
- #242332 - The issue "ContextMenu not appears while clicking an empty diagram" is now resolved.

## 17.2.35 (2019-07-17)

### Diagram

#### Bug Fixes

- `#245696`,`#245047`,`#244836` - Now, the Angular diagram will be rendered properly when we set the target as es6/es2015 in ts.config file.

## 17.2.41 (2019-08-14)

### Diagram

#### Bug Fixes

- `#146327` - The issue "Layout not working for Group Node" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke Width for it" is now resolved.
- `#242713` - The issue "Diagram Connectors not exported properly using web kit" is now resolved.
- `#244589`, `#244046` - The issue "Context menu properties are generated in MVC" is now resolved.
- `#243734` - The issue "Symbol Palette - first palette element gets removed while refresh the palette" is now resolved.
- `#244519` - The issue "Support to delete a lane from swimlane" is now resolved.
- The issue "Ports are not rendered when we enable virtualization" is now resolved.

## 17.2.40 (2019-08-06)

### Diagram

#### Bug Fixes

- `#243785` - The issue "Symbol palette first row expands twice on click" is now resolved.
- `#243648` - The issue "Exception raised while adding UML class shapes at runtime" is now resolved.
- `#146017` - The issue "Decorator is not aligned properly in palette when we set large stroke width for it" is now resolved.

## 17.2.39 (2019-07-30)

### Diagram

#### New Features

- `#242645` - The issue  "Support to add node in lanes collection at runtime" is now resolved.

#### Bug Fixes

- `#243078` - The issue "Hidden layer is visible" is now resolved.
- The issue "Context menu re-opens if you click a menu item quickly" is now working fine.

## 17.2.36 (2019-07-24)

### Diagram

#### Bug Fixes

- #236860, #237139 - The issue "MouseMove event is not triggered in Firefox" is now resolved.
- #241680 - The issue "Nodes drawn using drawing tools not appeared in overview" is now resolved.
- #240493 - The console error thrown while resizing the window in Chrome has been fixed.
- #242332 - The issue "ContextMenu not appears while clicking an empty diagram" is now resolved.

## 17.2.35 (2019-07-17)

### Diagram

#### Bug Fixes

- #239193 - The issue "element does not placed properly when specify the position as (0,0)" is now resolved.

## 17.2.28-beta (2019-06-27)

### Diagram

#### Breaking Changes

- The `hyperLink` property in the Shape Annotation and Path annotation is renamed properly as `hyperlink`.
- The `class` property in the UML Classifier shape is renamed properly as `classShape`.
- The `interface` property in the UML Classifier shape is renamed properly as `interfaceShape`.
- The `enumeration` property in the UML Classifier shape is renamed properly as `enumerationShape`.
- The `data` property is removed from the DataSource property of the diagram.
- The `dataManager` property in the DataSource is renamed to `DataSource`.

#### New Features

- #228504 – Support has been provided to customize the tooltip of the diagram.
- #231402 – Support has been provided to show/hide segment thumb of the connector.
– An option has been added to set the icons and template in the diagram user handles.
- #232055 - Text overflow support for annotation when wrapping is enabled for annotation has been added.

#### Bug Fixes

- Z-index for nodes/connectors is now properly updated when rendering the nodes/connectors with same z-index in symbol palette and drag and drop the nodes from the symbol palette to the diagram.
- Now, the connection between the ports has been established when remove the InConnect/OutConnect from node’s constraints.
- Issue with the “Layer’s z-index property and sendLayerBackward/bringLayerForward API methods” has been fixed.
- #232371 - Drag and drop the nodes from symbol palette to the diagram will no longer work if the SymbolPalette "allowDrag" property set to false at runtime.
- Now, the connector can be moved over the connection disabled node when drawing the connector using drawing tools.
- #232226 - The issue "Annotation added multiple times in DOM if annotation's text overflow enabled and select the node" has been fixed.
- #232343 - Diagram's selectionChange event is now triggered properly when selecting another node or unselect the selected node in less than 1 second after dragging the node.
- Diagram's propertyChange event is now triggered properly when move the node using keyboard and undo/redo dragged node.
- #233008 - BPMN sequence connector does not move with stroke when its dependent node is moved issue is now fixed.
- When changing the node's path data at run time, it scales properly with respect to node's size.
- When changing the trigger type of BPMN's Task shape at run time, the trigger shape is positioned properly.
- Now, the connector's decorator is docked properly when layout is enabled and drag the node.
- When zooming the diagram, the user handles position is updated properly with respect to zoom percentage.
- If boundaryConstraints is enabled and node's rotateAngle is changed at run time, node does not exceed the boundary limit.
- When changing the annotation's properties at run time, annotation will update properly.
- #234537 - Conditional sequence connector is now working properly when connected with BPMN Service shape.
- #234307 - Undo/redo is now working properly when modifying the annotation's font size at run time.
- #234106 - When the node having different size and executing the layout, nodes are now arranged properly.
- The `hyperLink` property in the Shape Annotation and Path annotation is renamed properly as `hyperlink`.
- #234537 - The BPMN shape style is now applied to the BPMN inner elements.
- #235977 - The issue "User handles drawn multiple times while dragging a node from the palette" has been resolved.
- #235742 - The issue with the oldValue of selectionChange is shown incorrect when mouse down on node has been resolved.
- #235794 - The `textEdit` event is now fired in Edge browser.
- #236322 - The module property in the package.json has been updated.
- #237131 - The issue "Layout is messed up when diagram have disconnected nodes" has been resolved using complex hierarchical tree layout.
- #237533 - The issue "min-height and min-width properties of node does not updated properly at run time" has been resolved.
- #236866 - The issue with tooltip is shown even after deleting the node has been resolved.

## 17.1.50 (2019-06-04)

### Diagram

#### Bug Fixes

- #237131 - The issue "Layout is messed up when diagram have disconnected nodes" has been resolved using complex hierarchical tree layout.
- #237533 - The issue "min-height and min-width properties of node does not updated properly at run time" has been resolved.

## 17.1.49 (2019-05-29)

### Diagram

#### Breaking Changes

- The `data` property is removed from the DataSource property of the diagram.

## 17.1.48 (2019-05-21)

### Diagram

#### Breaking Changes

- The `class` property in the UML Classifier shape is renamed properly as `classShape`.
- The `interface` property in the UML Classifier shape is renamed properly as `interfaceShape`.
- The `enumeration` property in the UML Classifier shape is renamed properly as `enumerationShape`.

#### Bug Fixes

- #234537 - The BPMN shape style is now applied to the BPMN inner elements.
- #235977 - The issue "User handles drawn multiple times while dragging a node from the palette" has been resolved.
- #235742 - The issue with the oldValue of selectionChange is shown incorrect when mouse down on node has been resolved.
- #235794 - The `textEdit` event is now fired in Edge browser.
- #236322 - The module property in the package.json has been updated.

## 17.1.47 (2019-05-14)

### Diagram

#### Breaking Changes

- The `hyperLink` property in the Shape Annotation and Path annotation is renamed properly as `hyperlink`.

#### Bug Fixes

## 17.1.44 (2019-05-07)

### Diagram

#### Bug Fixes

- #234537 - Conditional sequence connector is now working properly when connected with BPMN Service shape.
- #234307 - Undo/redo is now working properly when modifying the annotation's font size at run time.
- #234106 - When the node having different size and executing the layout, nodes are now arranged properly.

## 17.1.43 (2019-04-30)

### Diagram

#### Bug Fixes

- When changing the node's path data at run time, it scales properly with respect to node's size.
- When changing the trigger type of BPMN's Task shape at run time, the trigger shape is positioned properly.
- Now, the connector's decorator is docked properly when layout is enabled and drag the node.
- When zooming the diagram, the user handles position is updated properly with respect to zoom percentage.
- If boundaryConstraints is enabled and node's rotateAngle is changed at run time, node does not exceed the boundary limit.
- When changing the annotation's properties at run time, annotation will update properly.

## 17.1.41 (2019-04-16)

### Diagram

- #232371 - Drag and drop the nodes from symbol palette to the diagram will no longer work if the SymbolPalette "allowDrag" property set to false at runtime.
- Now, the connector can be moved over the connection disabled node when drawing the connector using drawing tools.
- #232226 - The issue "Annotation added multiple times in DOM if annotation's text overflow enabled and select the node" has been fixed.
- #232343 - Diagram's selectionChange event is now triggered properly when selecting another node or unselect the selected node in less than 1 second after dragging the node.
- Diagram's propertyChange event is now triggered properly when move the node using keyboard and undo/redo dragged node.
- #233008 - BPMN sequence connector does not move with stroke when its dependent node is moved issue is now fixed.

## 17.1.40 (2019-04-09)

### Diagram

- Z-index for nodes/connectors is now properly updated when rendering the nodes/connectors with same z-index in symbol palette and drag and drop the nodes from the symbol palette to the diagram.
- Now, the connection between the ports has been established when remove the InConnect/OutConnect from node’s constraints.
- Issue with the “Layer’s z-index property and sendLayerBackward/bringLayerForward API methods” has been fixed.

## 17.1.38 (2019-03-29)

### Diagram

#### New Features

- Support added to create a swimlane diagram using code or a visual interface with built-in swim lane shapes.
- Support provided to prevent “previous selection gets cleared when dragging a new symbol from the symbol palette and dropping it to the diagram”.
- Support provided to cancel the drag and drop operation from the symbol palette to the diagram when the ESC key is pressed.
- Support provided to define the padding between the connector’s end point and the object to which it gets connected.
- Option has been provided to retain the selection of an object when performing undo and redo operations.
- Option provided to prevent serializing default properties when the diagram is serialized as JSON format.
- Padding option added to scroll settings.
- Now, it is possible to export HTML and native nodes to image format.
- Support provided to limit the number of actions to be stored in the history manager.

#### Bug Fixes

- The "nodes distributed incorrectly" issue has been fixed.
- The "duplicate SVG appears when node's SVG is changed" issue has been fixed.
- Drop event is now fixed when drag and drop other component is now working fine.
- Diagram does not zoom based on the center point is now working fine.
- Background color of the label and nodes will be black by default while updating dynamically is now working fine.
- Background color issue found while on text editing is not fixed.
- Connections have created from port after removing the constraints is now working fine.
- Performance issue on diagram layout has been fixed.

## 17.1.32-beta (2019-03-13)

### Diagram

#### New Features

- Support added to create a swimlane diagram using code or a visual interface with built-in swim lane shapes.
- Support provided to prevent “previous selection gets cleared when dragging a new symbol from the symbol palette and dropping it to the diagram”.
- Support provided to cancel the drag and drop operation from the symbol palette to the diagram when the ESC key is pressed.
- Support provided to define the padding between the connector’s end point and the object to which it gets connected.
- Option has been provided to retain the selection of an object when performing undo and redo operations.
- Option provided to prevent serializing default properties when the diagram is serialized as JSON format.
- Padding option added to scroll settings.
- Now, it is possible to export HTML and native nodes to image format.
- Support provided to limit the number of actions to be stored in the history manager.

#### Bug Fixes

- #236866 - The issue with tooltip is shown even after deleting the node has been resolved.

## 17.1.50 (2019-06-04)

### Diagram

#### Bug Fixes

- #237131 - The issue "Layout is messed up when diagram have disconnected nodes" has been resolved using complex hierarchical tree layout.
- #237533 - The issue "min-height and min-width properties of node does not updated properly at run time" has been resolved.

## 17.1.49 (2019-05-29)

### Diagram

#### Breaking Changes

- The `data` property is removed from the DataSource property of the diagram.

## 17.1.48 (2019-05-21)

### Diagram

#### Breaking Changes

- The `class` property in the UML Classifier shape is renamed properly as `classShape`.
- The `interface` property in the UML Classifier shape is renamed properly as `interfaceShape`.
- The `enumeration` property in the UML Classifier shape is renamed properly as `enumerationShape`.

#### Bug Fixes

- #234537 - The BPMN shape style is now applied to the BPMN inner elements.
- #235977 - The issue "User handles drawn multiple times while dragging a node from the palette" has been resolved.
- #235742 - The issue with the oldValue of selectionChange is shown incorrect when mouse down on node has been resolved.
- #235794 - The `textEdit` event is now fired in Edge browser.
- #236322 - The module property in the package.json has been updated.

## 17.1.47 (2019-05-14)

### Diagram

#### Breaking Changes

- The `hyperLink` property in the Shape Annotation and Path annotation is renamed properly as `hyperlink`.

#### Bug Fixes

## 17.1.44 (2019-05-07)

### Diagram

#### Bug Fixes

- #234537 - Conditional sequence connector is now working properly when connected with BPMN Service shape.
- #234307 - Undo/redo is now working properly when modifying the annotation's font size at run time.
- #234106 - When the node having different size and executing the layout, nodes are now arranged properly.

## 17.1.43 (2019-04-30)

### Diagram

#### Bug Fixes

- When changing the node's path data at run time, it scales properly with respect to node's size.
- When changing the trigger type of BPMN's Task shape at run time, the trigger shape is positioned properly.
- Now, the connector's decorator is docked properly when layout is enabled and drag the node.
- When zooming the diagram, the user handles position is updated properly with respect to zoom percentage.
- If boundaryConstraints is enabled and node's rotateAngle is changed at run time, node does not exceed the boundary limit.
- When changing the annotation's properties at run time, annotation will update properly.

## 17.1.41 (2019-04-16)

### Diagram

- #232371 - Drag and drop the nodes from symbol palette to the diagram will no longer work if the SymbolPalette "allowDrag" property set to false at runtime.
- Now, the connector can be moved over the connection disabled node when drawing the connector using drawing tools.
- #232226 - The issue "Annotation added multiple times in DOM if annotation's text overflow enabled and select the node" has been fixed.
- #232343 - Diagram's selectionChange event is now triggered properly when selecting another node or unselect the selected node in less than 1 second after dragging the node.
- Diagram's propertyChange event is now triggered properly when move the node using keyboard and undo/redo dragged node.
- #233008 - BPMN sequence connector does not move with stroke when its dependent node is moved issue is now fixed.

## 17.1.40 (2019-04-09)

### Diagram

- Z-index for nodes/connectors is now properly updated when rendering the nodes/connectors with same z-index in symbol palette and drag and drop the nodes from the symbol palette to the diagram.
- Now, the connection between the ports has been established when remove the InConnect/OutConnect from node’s constraints.
- Issue with the “Layer’s z-index property and sendLayerBackward/bringLayerForward API methods” has been fixed.

## 17.1.38 (2019-03-29)

### Diagram

#### New Features

- Support added to create a swimlane diagram using code or a visual interface with built-in swim lane shapes.
- Support provided to prevent “previous selection gets cleared when dragging a new symbol from the symbol palette and dropping it to the diagram”.
- Support provided to cancel the drag and drop operation from the symbol palette to the diagram when the ESC key is pressed.
- Support provided to define the padding between the connector’s end point and the object to which it gets connected.
- Option has been provided to retain the selection of an object when performing undo and redo operations.
- Option provided to prevent serializing default properties when the diagram is serialized as JSON format.
- Padding option added to scroll settings.
- Now, it is possible to export HTML and native nodes to image format.
- Support provided to limit the number of actions to be stored in the history manager.

#### Bug Fixes

- The "nodes distributed incorrectly" issue has been fixed.
- The "duplicate SVG appears when node's SVG is changed" issue has been fixed.
- Drop event is now fixed when drag and drop other component is now working fine.
- Diagram does not zoom based on the center point is now working fine.
- Background color of the label and nodes will be black by default while updating dynamically is now working fine.
- Background color issue found while on text editing is not fixed.
- Connections have created from port after removing the constraints is now working fine.
- Performance issue on diagram layout has been fixed.

## 17.1.32-beta (2019-03-13)

### Diagram

#### New Features

- Support added to create a swimlane diagram using code or a visual interface with built-in swim lane shapes.
- Support provided to prevent “previous selection gets cleared when dragging a new symbol from the symbol palette and dropping it to the diagram”.
- Support provided to cancel the drag and drop operation from the symbol palette to the diagram when the ESC key is pressed.
- Support provided to define the padding between the connector’s end point and the object to which it gets connected.
- Option has been provided to retain the selection of an object when performing undo and redo operations.
- Option provided to prevent serializing default properties when the diagram is serialized as JSON format.
- Padding option added to scroll settings.
- Now, it is possible to export HTML and native nodes to image format.
- Support provided to limit the number of actions to be stored in the history manager.

#### Bug Fixes

- Drop event is now fixed when drag and drop other component is now working fine.
- Diagram does not zoom based on the center point is now working fine.
- Background color of the label and nodes will be black by default while updating dynamically is now working fine.
- Background color issue found while on text editing is not fixed.
- Connections have created from port after removing the constraints is now working fine.
- Performance issue on diagram layout has been fixed.

## 16.4.54 (2019-02-19)

### Diagram

#### Bug Fixes

- Z-order maintained properly now when adding the nodes at runtime.
- Port dragging now working properly after rotating the nodes.
- When dragging the port, connectors associated with the ports updated properly.
- If anyone of the selected nodes doesn’t have rotate constraints, rotate handle no longer visible with the selection handles.

## 16.4.53 (2019-02-13)

### Diagram

#### New Features

- Support to flip the node/connector in both horizontal and vertical direction has been added.

## 16.4.52 (2019-02-05)

### Diagram

#### Bug Fixes

- Exception thrown while enable zoom and pan tool dynamically is now working fine.
- Exception thrown while build the diagram component with production mode is now working fine.

## 16.4.48 (2019-01-22)

### Diagram

#### Bug Fixes

- Updating data source at runtime is now working properly even if you did not define layout for a diagram.
- Now, you can modify the nodes and connectors styles at runtime.

## 16.4.47 (2019-01-16)

### Diagram

#### Bug Fixes

- Connector label position is misplaced while adding the connector in layout at run time is working fine now.

## 16.4.46 (2019-01-08)

### Diagram

#### Bug Fixes

- Performance has been improved when dragging more number of nodes and connectors.
- Issue on applying style for connector’s annotation is now fixed.

## 16.4.44 (2018-12-24)

### Diagram

#### Bug Fixes

- Alignment issue on complex hierarchical tree layout with complex data source is working fine.

## 16.4.40-beta (2018-12-10)

### Diagram

#### New Features

- Support to create a UML class diagram through code or a visual interface with the built-in class diagram shapes is added.
- Support to create a UML activity diagram through code or a visual interface with the built-in activity shapes is added.
- Support to limit the label positions while dragging a label from the connector is added.
- Support to generate a diagram by reading the data from the database, and updating the database with the newly inserted/updated/deleted nodes and connectors is added.
- Support to render a large number of nodes and connectors in a diagram for effective performance is added.
- Template support for annotation is added.

## 16.3.33 (2018-11-20)

### Diagram

#### Bug Fixes

- Exception thrown when adding the child to the Node which has multiple parent Child is now working fine.
- Textbox lost its focus when we mouse up on Diagram is now working fine.
- Issue with expand collapse, when the child having more than one parent have been fixed.
- Issue on measuring path element while refreshing the diagram is now working fine.

## 16.3.29 (2018-10-31)

### Diagram

#### Bug Fixes

- Node position is not updated properly in expand and collapse feature is now fixed.
- Diagram getting overflow when use a flex layout UI 100% width/height is now working properly.

## 16.3.27 (2018-10-23)

### Diagram

#### Bug Fixes

- Improper positioning of group offset in initial rendering is working properly.

## 16.3.25 (2018-10-15)

### Diagram

#### Bug Fixes

- Connector annotation not hide on Expand and Collapse is now working properly.
- Gridlines not disables dynamically is now working properly.

## 16.3.17 (2018-09-12)

### Diagram

#### Bug Fixes

- Data binding for Native and HTML nodes is now working properly.
- Issue with apply gradient for BPMN shapes has been fixed.
- Issue with drop event argument has been fixed.
- The image node is now rendered properly in the symbol palette.

#### New Features

- Annotation can be moved, rotated, and resized interactively.
- Group node can be added into the symbol palette.
- Poly line connector tool support has been added.
- Text annotation can be associated with BPMN nodes interactively.

## 16.2.47 (2018-08-07)

### Diagram

#### Bug Fixes

- Issue on applying gradient for BPMN shapes have fixed.
- Issue on rendering diagram in IE browser have been fixed.
- Issue on template binding for HTML and Native node have been fixed.

## 16.2.46 (2018-07-30)

### Diagram

#### Bug Fixes

- Issue on Drag event arguments have been resolved.
- Issue on changing the background image at run time has been fixed.

## 16.2.45 (2018-07-17)

### Diagram

#### Bug Fixes

- Issue on click event arguments have been resolved.

## 16.2.41 (2018-06-25)

### Diagram

The diagram component visually represents information. It is also used to create diagrams like flow charts, organizational charts, mind maps, and BPMN either through code or a visual interface.

- **Nodes** - Nodes are used to host graphical objects (path or controls) that can be arranged and manipulated on a diagram page. Many predefined standard shapes are included. Custom shapes can also be created and added easily.
- **Connectors** - The relationship between two nodes is represented using a connector.
- **Labels** - Labels are used to annotate nodes and connectors.
- **Interactive Features** - Interactive features are used to improve the run time editing experience of a diagram.
- **Data Binding** - Generates diagram with nodes and connectors based on the information provided from an external data source.
- **Commands** - Supports a set of predefined commands that helps edit the diagram using keyboard. It is also possible to configure new commands and key combinations.
- **Automatic Layout** - Automatic layouts are used to arrange nodes automatically based on a predefined layout logic. There is built-in support for organizational chart layout, hierarchical tree layout, symmetric layout, radial tree layout, and mind map layout.
- **Overview Panel** -  The overview panel is used to improve navigation experience when exploring large diagrams.
- **SymbolPalettes** - The symbol palette is a gallery of reusable symbols and nodes that can be dragged and dropped on the surface of a diagram.
- **Rulers** - The ruler provides horizontal and vertical guides for measuring diagram objects in diagram control.
- **Serialization** - When saved in JSON format a diagram’s state persists, and then it can be loaded back using serialization.
- **Exporting and Printing** - Diagrams can be exported as .png, .jpeg, .bmp, and .svg image files, and can also be printed as documents.
- **Gridlines** - Gridlines are the pattern of lines drawn behind diagram elements. It provides a visual guidance while dragging or arranging the objects on a diagram surface.
- **Page Layout** - The drawing surface can be configured to page-like appearance using page size, orientation, and margins.
- **Context Menu** - Frequently used commands can easily be mapped to the context menu.