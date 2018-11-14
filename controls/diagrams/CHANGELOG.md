# Changelog

## [Unreleased]

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