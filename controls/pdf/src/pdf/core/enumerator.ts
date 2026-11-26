/**
 * Public Enum to define annotation flag types.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAnnotation = page.annotations.at(0);
 * // Sets the annotation flag to enable print
 * annotation.flags = PdfAnnotationFlag.print;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAnnotationFlag {
    /**
     * Specifies the type of `default`.
     */
    default = 0,
    /**
     * Specifies the type of `invisible`.
     */
    invisible = 1,
    /**
     * Specifies the type of `hidden`.
     */
    hidden = 2,
    /**
     * Specifies the type of `print`.
     */
    print = 4,
    /**
     * Specifies the type of `noZoom`.
     */
    noZoom = 8,
    /**
     * Specifies the type of `noRotate`.
     */
    noRotate = 16,
    /**
     * Specifies the type of `noView`.
     */
    noView = 32,
    /**
     * Specifies the type of `readOnly`.
     */
    readOnly = 64,
    /**
     * Specifies the type of `locked`.
     */
    locked = 128,
    /**
     * Specifies the type of `toggleNoView`.
     */
    toggleNoView = 256
}
/**
 * Public Enum to define line ending style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfPolyLineAnnotation = page.annotations.at(0) as PdfPolyLineAnnotation;
 * // Sets the begin line end style as openArrow
 * annotation.beginLineStyle = PdfLineEndingStyle.openArrow;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLineEndingStyle {
    /**
     * Specifies the type of `none`.
     */
    none,
    /**
     * Specifies the type of `openArrow`.
     */
    openArrow,
    /**
     * Specifies the type of `closedArrow`.
     */
    closedArrow,
    /**
     * Specifies the type of `rOpenArrow`.
     */
    rOpenArrow,
    /**
     * Specifies the type of `rClosedArrow`.
     */
    rClosedArrow,
    /**
     * Specifies the type of `butt`.
     */
    butt,
    /**
     * Specifies the type of `diamond`.
     */
    diamond,
    /**
     * Specifies the type of `circle`.
     */
    circle,
    /**
     * Specifies the type of `square`.
     */
    square,
    /**
     * Specifies the type of `slash`.
     */
    slash
}
/**
 * Public Enum to define line indent.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfLineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
 * // Sets the line intent as lineArrow
 * annotation.lineIntent = PdfLineIntent.lineArrow;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLineIntent {
    /**
     * Specifies the type of `lineArrow`.
     */
    lineArrow,
    /**
     * Specifies the type of `lineDimension`.
     */
    lineDimension
}
/**
 * Public Enum to define the types of points and segments in a path.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a new pen
 * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
 * // Create a new brush
 * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
 * // Add path points
 * let pathPoints: Array<Point> = [{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}];
 * // Add path types
 * let pathTypes: PathPointType[] = [0, 1, 1, 1, 1];
 * // Create a new PDF path
 * let path: PdfPath = new PdfPath(pathPoints, pathTypes);
 * // Draw the path to the PDF page
 * page.graphics.drawPath(path, pen, brush);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PathPointType {
    /**
     * The starting point of a path.
     */
    start = 0,
    /**
     * A straight line segment.
     */
    line = 1,
    /**
     * A Bezier curve segment.
     */
    bezier = 3,
    /**
     * A mask for extracting the type of a point.
     */
    pathTypeMask = 7,
    /**
     * Indicates that the segment has dashed line style.
     */
    dashMode = 16,
    /**
     * Indicates a marker point in the path.
     */
    pathMarker = 32,
    /**
     * Closes the current path.
     */
    closePath = 128
}
/**
 * Public Enum to define line caption type.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAnnotation = page.annotations.at(0);
 * // Sets the line caption type as inline
 * annotation.caption.type = PdfLineCaptionType.inline;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLineCaptionType {
    /**
     * Specifies the type of `inline`.
     */
    inline,
    /**
     * Specifies the type of `top`.
     */
    top
}
/**
 * Public Enum to define border style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAnnotation = page.annotations.at(0);
 * // Sets the border style as underline
 * annotation.border.style = PdfBorderStyle.underline;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBorderStyle {
    /**
     * Specifies the type of `solid`.
     */
    solid,
    /**
     * Specifies the type of `dashed`.
     */
    dashed,
    /**
     * Specifies the type of `beveled`.
     */
    beveled,
    /**
     * Specifies the type of `inset`.
     */
    inset,
    /**
     * Specifies the type of `underline`.
     */
    underline,
    /**
     * Specifies the type of `dot`.
     */
    dot
}
/**
 * Public Enum to define border effect style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAnnotation = page.annotations.at(0);
 * // Sets the border effect as underline
 * annotation.borderEffect.style = PdfBorderEffectStyle.cloudy;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBorderEffectStyle {
    /**
     * Specifies the type of `solid`.
     */
    solid,
    /**
     * Specifies the type of `cloudy`.
     */
    cloudy
}
/**
 * Public Enum to define rotation of the interactive elements.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access text box field
 * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
 * // Gets the rotation of the field
 * let rotation: PdfRotationAngle = field.rotationAngle;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRotationAngle {
    /**
     * Specifies the type of `angle0`.
     */
    angle0,
    /**
     * Specifies the type of `angle90`.
     */
    angle90,
    /**
     * Specifies the type of `angle180`.
     */
    angle180,
    /**
     * Specifies the type of `angle270`.
     */
    angle270
}
/**
 * Public Enum to define cross reference type.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Save the document with cross reference type as stream
 * document.save('output.pdf', PdfCrossReferenceType.stream);
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfCrossReferenceType {
    /**
     * Specifies the type of `table`.
     */
    table,
    /**
     * Specifies the type of `stream`.
     */
    stream
}
/**
 * Public Enum to define highlight mode of text box field.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access text box field
 * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
 * // Sets the highlight mode of text box field as outline
 * field.highlightMode = PdfHighlightMode.outline;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfHighlightMode {
    /**
     * Specifies the type of `noHighlighting`.
     */
    noHighlighting,
    /**
     * Specifies the type of `invert`.
     */
    invert,
    /**
     * Specifies the type of `outline`.
     */
    outline,
    /**
     * Specifies the type of `push`.
     */
    push
}
/**
 * Public Enum to define text alignment of text box field.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access text box field
 * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
 * // Sets the text alignment of form field as center
 * field.textAlignment = PdfTextAlignment.center;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTextAlignment {
    /**
     * Specifies the type of `left`.
     */
    left,
    /**
     * Specifies the type of `center`.
     */
    center,
    /**
     * Specifies the type of `right`.
     */
    right,
    /**
     * Specifies the type of `justify`.
     */
    justify
}
/**
 * Public Enum to define visibility of form field.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access PDF form field
 * let field: PdfField = document.form.fieldAt(0);
 * // Sets the visibility of form field as hidden
 * field.visibility = PdfFormFieldVisibility.hidden;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfFormFieldVisibility {
    /**
     * Specifies the type of `visible`.
     */
    visible,
    /**
     * Specifies the type of `hidden`.
     */
    hidden,
    /**
     * Specifies the type of `visibleNotPrintable`.
     */
    visibleNotPrintable,
    /**
     * Specifies the type of `hiddenPrintable`.
     */
    hiddenPrintable
}
/**
 * Public Enum to define measurement unit of line measurement annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfLineAnnotation = page.annotations.at(0) PdfLineAnnotation;
 * // Sets the measurement unit of line measurement annoation as centimeter
 * annotation.unit = PdfMeasurementUnit.centimeter;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfMeasurementUnit {
    /**
     * Specifies the type of `inch`.
     */
    inch = 0,
    /**
     * Specifies the type of `pica`.
     */
    pica = 1,
    /**
     * Specifies the type of `point`.
     */
    point = 3,
    /**
     * Specifies the type of `centimeter`.
     */
    centimeter = 4,
    /**
     * Specifies the type of `millimeter`.
     */
    millimeter = 6,
}
/**
 * Public Enum to define measurement type of circle annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfCircleAnnotation = page.annotations.at(0) PdfCircleAnnotation;
 * // Sets the measurement type of circle annotation as diameter
 * annotation.measureType = PdfCircleMeasurementType.diameter;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfCircleMeasurementType {
    /**
     * Specifies the type of `diameter`.
     */
    diameter = 0,
    /**
     * Specifies the type of `radius`.
     */
    radius = 1,
}
/**
 * Public Enum to define icon type of rubber stamp annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfRubberStampAnnotation = page.annotations.at(0) PdfRubberStampAnnotation;
 * // Sets the rubber stamp annotation icon type as confidential
 * annotation.icon = PdfRubberStampAnnotationIcon.confidential;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRubberStampAnnotationIcon {
    /**
     * Specifies the type of `approved`.
     */
    approved,
    /**
     * Specifies the type of `asIs`.
     */
    asIs,
    /**
     * Specifies the type of `confidential`.
     */
    confidential,
    /**
     * Specifies the type of `departmental`.
     */
    departmental,
    /**
     * Specifies the type of `draft`.
     */
    draft,
    /**
     * Specifies the type of `experimental`.
     */
    experimental,
    /**
     * Specifies the type of `expired`.
     */
    expired,
    /**
     * Specifies the type of `final`.
     */
    final,
    /**
     * Specifies the type of `forComment`.
     */
    forComment,
    /**
     * Specifies the type of `forPublicRelease`.
     */
    forPublicRelease,
    /**
     * Specifies the type of `notApproved`.
     */
    notApproved,
    /**
     * Specifies the type of `notForPublicRelease`.
     */
    notForPublicRelease,
    /**
     * Specifies the type of `sold`.
     */
    sold,
    /**
     * Specifies the type of `topSecret`.
     */
    topSecret,
    /**
     * Specifies the type of `completed`.
     */
    completed,
    /**
     * Specifies the type of `void`.
     */
    void,
    /**
     * Specifies the type of `informationOnly`.
     */
    informationOnly,
    /**
     * Specifies the type of `preliminaryResults`.
     */
    preliminaryResults,
}
/**
 * Public Enum to define check box style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access check box field
 * let field: PdfCheckBoxField = document.form.fieldAt(0) as PdfCheckBoxField;
 * // Access first item of check box field
 * let item: PdfStateItem = field.itemAt(0) as PdfStateItem;
 * // Sets the check box style as check
 * item.style = PdfCheckBoxStyle.check;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfCheckBoxStyle {
    /**
     * Specifies the type of `check`.
     */
    check,
    /**
     * Specifies the type of `circle`.
     */
    circle,
    /**
     * Specifies the type of `cross`.
     */
    cross,
    /**
     * Specifies the type of `diamond`.
     */
    diamond,
    /**
     * Specifies the type of `square`.
     */
    square,
    /**
     * Specifies the type of `star`.
     */
    star
}
/**
 * Public Enum to define type of text markup annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfTextMarkupAnnotation = page.annotations.at(0) PdfTextMarkupAnnotation;
 * // Sets the type of the text markup annotation as underline
 * annotation.textMarkupType = PdfTextMarkupAnnotationType.underline;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTextMarkupAnnotationType {
    /**
     * Specifies the type of `highlight`.
     */
    highlight = 0,
    /**
     * Specifies the type of `underline`.
     */
    underline = 1,
    /**
     * Specifies the type of `squiggly`.
     */
    squiggly = 2,
    /**
     * Specifies the type of `strikeOut`.
     */
    strikeOut = 3,

}
/**
 * Public Enum to define icon type of popup annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfPopupAnnotation = page.annotations.at(0) PdfPopupAnnotation;
 * // Sets the icon type of the popup annotation as comment
 * annotation.icon = PdfPopupIcon.comment;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPopupIcon {
    /**
     * Specifies the type of `note`.
     */
    note = 0,
    /**
     * Specifies the type of `comment`.
     */
    comment = 1,
    /**
     * Specifies the type of `help`.
     */
    help = 2,
    /**
     * Specifies the type of `insert`.
     */
    insert = 3,
    /**
     * Specifies the type of `key`.
     */
    key = 4,
    /**
     * Specifies the type of `new paragraph`.
     */
    newParagraph = 5,
    /**
     * Specifies the type of `paragraph`.
     */
    paragraph = 6,
}
/**
 * Public Enum to define annotation state.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfPopupAnnotation = page.annotations.at(0) PdfPopupAnnotation;
 * // Sets the state of the popup annotation as accepted
 * annotation.state = PdfAnnotationState.accepted;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAnnotationState {
    /**
     * Specifies the default state of `none`.
     */
    none,
    /**
     * Specifies the state of `accepted`.
     */
    accepted,
    /**
     * Specifies the state of `rejected`.
     */
    rejected,
    /**
     * Specifies the state of `cancel`.
     */
    cancel,
    /**
     * Specifies the state of `completed`.
     */
    completed,
    /**
     * Specifies the state of `marked`.
     */
    marked,
    /**
     * Specifies the state of `unmarked`.
     */
    unmarked,
    /**
     * Specifies the state of `unknown`.
     */
    unknown
}
/**
 * Public Enum to define annotation state model.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfPopupAnnotation = page.annotations.at(0) PdfPopupAnnotation;
 * // Sets the state model of the popup annotation as marked
 * annotation.stateModel = PdfAnnotationStateModel.marked;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAnnotationStateModel {
    /**
     * Specifies the default model of `none`.
     */
    none,
    /**
     * Specifies the model of `marked`.
     */
    marked,
    /**
     * Specifies the model of `review`.
     */
    review,
}
/**
 * Public Enum to define icon type of attachment annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfAttachmentAnnotation = page.annotations.at(0) PdfAttachmentAnnotation;
 * // Sets the icon type of attachment annotation to pushPin
 * annotation.icon = PdfAttachmentIcon.pushPin;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAttachmentIcon {
    /**
     * Specifies the default icon of `pushPin`.
     */
    pushPin,
    /**
     * Specifies the icon of `tag`.
     */
    tag,
    /**
     * Specifies the icon of `graph`.
     */
    graph,
    /**
     * Specifies the icon of `paperClip`.
     */
    paperClip,
}
/**
 * Public Enum to define annotation intent of free text annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfFreeTextAnnotation = page.annotations.at(0) PdfFreeTextAnnotation;
 * // Sets the free text annotation intent to freeTextCallout
 * annotation.annotationIntent = PdfAnnotationIntent.freeTextCallout;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAnnotationIntent {
    /**
     * Specifies the default intent of `none`.
     */
    none,
    /**
     * Specifies the intent of `freeTextCallout`.
     */
    freeTextCallout,
    /**
     * Specifies the intent of `freeTextTypeWriter`.
     */
    freeTextTypeWriter,
}
/**
 * Public Enum to define destination mode of document link annotation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Access the annotation at index 0
 * let annotation: PdfDocumentLinkAnnotation = page.annotations.at(0) PdfDocumentLinkAnnotation;
 * // Sets the destination mode as fitToPage
 * annotation.destination.mode = PdfDestinationMode.fitToPage;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfDestinationMode {
    /**
     * Specifies the default intent of `location`.
     */
    location,
    /**
     * Specifies the intent of `FitToPage`.
     */
    fitToPage,
    /**
     * Specifies the intent of `fitR`.
     */
    fitR,
    /**
     * Specifies the intent of `fitH`.
     */
    fitH,
}
/**
 * Public Enum to define export or import data format.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Sets export data format as JSON type to annotation export settings
 * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
 * settings.dataFormat = DataFormat.json;
 * // Export annotations to JSON format
 * let json: Uint8Array = document.exportAnnotations(settings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum DataFormat {
    /**
     * Specifies the intent of `FDF`.
     */
    fdf,
    /**
     * Specifies the intent of `XFDF`.
     */
    xfdf,
    /**
     * Specifies the intent of `JSON`.
     */
    json,
    /**
     * Specifies the intent of `XML`.
     */
    xml
}
/**
 * Public enum to define form fields tab order.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Set a PDF form's tab order.
 * document.form.orderFormFields(PdfFormFieldsTabOrder.row);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfFormFieldsTabOrder {
    /**
     * Specifies that no tab order is defined.
     */
    none,
    /**
     * Specifies the tab order is defined by the document's rows.
     */
    row,
    /**
     * Specifies the tab order is defined by the document's columns.
     */
    column,
    /**
     * Specifies the tab order is defined by the document's structure tree.
     */
    structure,
    /**
     * Specifies the tab order is defined manually.
     */
    manual,
    /**
     * Specifies the tab order is defined by the widget annotations in the document.
     */
    widget
}
/**
 * Public enum to define the PDF document permission flags.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the permission flag
 * let permission: PdfPermissionFlag = document.permissions;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPermissionFlag {
    /**
     * Specifies the default permission flag.
     */
    default = 0,
    /**
     * Specifies the print permission flag.
     */
    print = 4,
    /**
     * Specifies the edit content permission flag.
     */
    editContent = 8,
    /**
     * Specifies the copy content permission flag.
     */
    copyContent = 16,
    /**
     * Specifies the edit annotations permission flag.
     */
    editAnnotations = 32,
    /**
     * Specifies the fill fields permission flag.
     */
    fillFields = 256,
    /**
     * Specifies the accessibility copy content permission flag.
     */
    accessibilityCopyContent = 512,
    /**
     * Specifies the assemble document permission flag.
     */
    assembleDocument = 1024,
    /**
     * Specifies the full quality print permission flag.
     */
    fullQualityPrint = 2048
}
/**
 * Public enum to define the PDF page orientation.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Get the page orientation
 * let orientation: PdfPageOrientation = page.orientation;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPageOrientation {
    /**
     * Specifies the type of `portrait`.
     */
    portrait,
    /**
     * Specifies the type of `landscape`.
     */
    landscape
}
/**
 * Public enum to define the text direction.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Load the font file
 * let font: PdfTrueTypeFont = new PdfTrueTypeFont(read('./resources/Fonts/', 'Arial.ttf'), 10);
 * // Add a string format
 * let format: PdfStringFormat = new PdfStringFormat();
 * format.alignment = PdfTextAlignment.right;
 * format.textDirection = PdfTextDirection.rightToLeft;
 * // Draw a text with right to left direction
 * page.graphics.drawString('Hello World مرحبا بالعالم', font, {x: 10, y: 20, width: 300, height: 200}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTextDirection {
    /**
     * Specifies the type of `none`.
     */
    none,
    /**
     * Specifies the type of `leftToRight`.
     */
    leftToRight,
    /**
     * Specifies the type of `rightToLeft`.
     */
    rightToLeft
}
/**
 * Public enum to define the subscript or superscript mode.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Gets the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a new PDF standard font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
 * // Set a new paragraph indent
 * format.paragraphIndent = 20;
 * // Set the subscript or superscript mode
 * format.subSuperScript = PdfSubSuperScript.subScript;
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, {x: 0, y: 180, width: page.size.width, height: 40}, new PdfBrush({r: 0, g: 0, b: 255}), format);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfSubSuperScript {
    /**
     * Specifies the type of `none`.
     */
    none = 0,
    /**
     * Specifies the type of `superScript`.
     */
    superScript = 1,
    /**
     * Specifies the type of `subScript`.
     */
    subScript = 2
}
/**
 * Public enum to define blend mode of the PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.symbol, 10, PdfFontStyle.regular);
 * // Set the blend mode
 * graphics.setTransparency(0.5, 0.5, PdfBlendMode.hardLight);
 * // Draw the text
 * graphics.drawString('Hello World', font, {x: 10, y: 10, width: 100, height: 40}, new PdfBrush({r: 255, g: 0, b: 0}));
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBlendMode {
    /**
     * Specifies the type of `normal`.
     */
    normal,
    /**
     * Specifies the type of `multiply`.
     */
    multiply,
    /**
     * Specifies the type of `screen`.
     */
    screen,
    /**
     * Specifies the type of `overlay`.
     */
    overlay,
    /**
     * Specifies the type of `darken`.
     */
    darken,
    /**
     * Specifies the type of `lighten`.
     */
    lighten,
    /**
     * Specifies the type of `colorDodge`.
     */
    colorDodge,
    /**
     * Specifies the type of `colorBurn`.
     */
    colorBurn,
    /**
     * Specifies the type of `hardLight`.
     */
    hardLight,
    /**
     * Specifies the type of `softLight`.
     */
    softLight,
    /**
     * Specifies the type of `difference`.
     */
    difference,
    /**
     * Specifies the type of `exclusion`.
     */
    exclusion,
    /**
     * Specifies the type of `hue`.
     */
    hue,
    /**
     * Specifies the type of `saturation`.
     */
    saturation,
    /**
     * Specifies the type of `color`.
     */
    color,
    /**
     * Specifies the type of `luminosity`.
     */
    luminosity
}
/**
 * Public enum to define fill mode of the PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new font
 * let font: PdfStandardFont = document.embedFont(PdfFontFamily.symbol, 10, PdfFontStyle.regular);
 * // Set the fill mode
 * graphics.setClip({x: 0, y: 0, width: 100, height: 100}, PdfFillMode.winding);
 * // Draw the text
 * graphics.drawString('Hello World', font, {x: 10, y: 10, width: 100, height: 40}, new PdfBrush({r: 255, g: 0, b: 0}));
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfFillMode {
    /**
     * Specifies the type of `winding`.
     */
    winding,
    /**
     * Specifies the type of `alternate`.
     */
    alternate
}
/**
 * Public enum to define the dash style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new pen
 * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Draw a rectangle using pen
 * graphics.drawRectangle({x: 150, y: 50, width: 50, height: 50}, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfDashStyle {
    /**
     * Specifies the type of `solid`.
     */
    solid = 0,
    /**
     * Specifies the type of `dash`.
     */
    dash = 1,
    /**
     * Specifies the type of `dot`.
     */
    dot = 2,
    /**
     * Specifies the type of `dashDot`.
     */
    dashDot = 3,
    /**
     * Specifies the type of `dashDotDot`.
     */
    dashDotDot = 4,
    /**
     * Specifies the type of `custom`.
     */
    custom = 5
}
/**
 * Public enum to define the line cap.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new pen
 * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Set the line cap
 * pen._lineCap = PdfLineCap.round;
 * // Draw a rectangle using pen
 * graphics.drawRectangle({x: 150, y: 50, width: 50, height: 50}, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLineCap {
    /**
     * Specifies the type of `flat`.
     */
    flat = 0,
    /**
     * Specifies the type of `round`.
     */
    round = 1,
    /**
     * Specifies the type of `square`.
     */
    square = 2
}
/**
 * Public enum to define the line join.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new pen
 * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Set the line join
 * pen._lineJoin = PdfLineJoin.bevel;
 * // Draw a rectangle using pen
 * graphics.drawRectangle({x: 150, y: 50, width: 50, height: 50}, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLineJoin {
    /**
     * Specifies the type of `miter`.
     */
    miter = 0,
    /**
     * Specifies the type of `round`.
     */
    round = 1,
    /**
     * Specifies the type of `bevel`.
     */
    bevel = 2
}
/**
 * Public enum to define text style.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Get the bookmarks
 * let bookmarks: PdfBookmarkBase = document.bookmarks;
 * // Gets bookmark at the specified index
 * let bookmark : PdfBookMark = bookmarks.at(0) as PdfBookMark;
 * // Gets the textStyle
 * let textStyle: PdfTextStyle = bookmark.textStyle;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTextStyle {
    /**
     * Specifies the `regular` text style.
     */
    regular = 0,
    /**
     * Specifies the `italic` text style.
     */
    italic = 1,
    /**
     * Specifies the `bold` text style.
     */
    bold = 2
}
/**
 * Public enum type to represent the ordered list style
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Add each item to the item collection by passing the string array
 * let items: PdfListitemCollection = new PdfListitemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
 * // Create a new ordered list and passing the list item collection
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Set the ordered list number style for the list items
 * list.style = PdfNumberStyle.lowerLatin;
 * // Draw the ordered list
 * list.draw(page, {x: 0, y: 20, width: 500, height: 700});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export  enum PdfNumberStyle {
    /**
     * No numbering at all.
     */
    none = 0,
    /**
     * Specifies the type '1'.
     */
    numeric,
    /**
     * Specifies the style 'a'.
     */
    lowerLatin,
    /**
     * Specifies the style 'i'.
     */
    lowerRoman,
    /**
     * Specifies the style 'A'.
     */
    upperLatin,
    /**
     * Specifies the style 'I'.
     */
    upperRoman
}
/**
 * Public enum to define the style used for unordered list.
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Add each item to the collection by passing the string array
 * let items: PdfListitemCollection = new PdfListitemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
 * // Create a unordered list and pass the list item collection
 * let list: PdfUnorderedList = new PdfUnorderedList(items);
 * // Set the unordered list style for the list items
 * list.style = PdfUnorderedListStyle.circle;
 * // Draw the unordered list associated with items
 * list.draw(page, {x: 0, y: 20, width: 500, height: 700});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfUnorderedListStyle {
    /**
     * No bulleting at all.
     */
    none = 0,
    /**
     * Specifies disk style.
     */
    disk = 1,
    /**
     * Specifies square style.
     */
    square = 2,
    /**
     * Specifies asterisk style.
     */
    asterisk = 3,
    /**
     * Specifies circle style.
     */
    circle = 4
}
/**
 * Public enum to define a layout type for drawing
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Assign the array of string for items
 * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
 * // Add the items to the list item collection by passing the array
 * let items: PdfListItemCollection = new PdfListItemCollection(products);
 * // Create a new ordered list
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Create a layout format for drawing
 * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
 * // Initialize layout type for drawing
 * pageLayout.layout = PdfLayoutType.paginate;
 * // Draw the list on the page along with the specified layout
 * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
 * // Get the layout type used to draw the list
 * let layoutType: PdfLayoutType = pageLayout.layout;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLayoutType {
    /**
     * Specifies pagination across multiple pages based on the specified dimensions and layout options
     */
    paginate,
    /**
     * Specifies content to be laid out to fit within a single page, without pagination
     */
    onePage
}
/**
 * Public enum to define a layout Break type for drawing
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Assign the array of string for items
 * let products: string[] = ['Excel', 'Power', 'Point', 'Word', 'PDF'];
 * // Add the item to list item collection by passing the string array
 * let items: PdfListItemCollection = new PdfListItemCollection(products);
 * // Create a new ordered list
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Create a layout for drawing
 * let pageLayout: PdfLayoutFormat = new PdfLayoutFormat();
 * // Sets the layout break type for drawing
 * pageLayout.break = PdfLayoutBreakType.fitPage;
 * // Draw the list associated with items along with layout
 * list.draw(page, {x: 0, y: 20, width: 500, height: 700}, pageLayout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLayoutBreakType {
    /**
     * Specifies that content should break to a new page to fit within specified dimensions.
     */
    fitPage,
    /**
     * Specifies that content should break to a new page or element to fit within specified dimensions.
     */
    fitElement
}
/**
 * Public enum to define a list marker alignment
 * ```typescript
 * // Load an existing document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Add each item to the item collection by passing the string array
 * let items: PdfListitemCollection = new PdfListitemCollection(['Excel', 'Power', 'Point', 'Word', 'PDF']);
 * // Create a new ordered list and passing the list item collection
 * let list: PdfOrderedList = new PdfOrderedList(items);
 * // Set the marker alignment
 * list.alignment = PdfListMarkerAlignment.left;
 * // Draw the ordered list
 * list.draw(page, {x: 0, y: 20, width: 500, height: 700});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfListMarkerAlignment {
    /**
     * Left alignment for marker.
     */
    left,
    /**
     * Right alignment for marker.
     */
    right
}
/**
 * Public enum to define a print state of layer
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the collection of layers in the document
 * let layers: PdfLayerCollection = document.layers;
 * // Retrieve the first layer from the layers collection
 * let layer: PdfLayer = layers.at(0);
 * // Retrieve the print state of the layer
 * let printState: PdfPrintState = layer.printState;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPrintState {
    /**
     * The PDF layers always get print
     */
    alwaysPrint,
    /**
     * The PDF layers never get print
     */
    neverPrint,
    /**
     * The visible PDF layers get print
     */
    printWhenVisible
}
/**
 * Public enum specifies the message digest algorithm.
 * ```typescript
 * // Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new PDF signature using PFX certificate data and specify SHA-256 as the digest algorithm
 * const sign: PdfSignature = PdfSignature.create({ digestAlgorithm: DigestAlgorithm.sha256 }, certData, password);
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum DigestAlgorithm {
    /**
     * Specifies SHA1 message digest algorithm
     */
    sha1,
    /**
     * Specifies SHA256 message digest algorithm
     */
    sha256,
    /**
     * Specifies SHA384 message digest algorithm
     */
    sha384,
    /**
     * Specifies SHA512 message digest algorithm
     */
    sha512,
    /**
     * Specifies RIPEMD160 message digest algorithm
     */
    ripemd160
}
/**
 * Public enum specifies the cryptographic standard.
 * ```typescript
 * //Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new signature using PFX data and specify cms as the cryptographicStandard
 * const sign: PdfSignature = PdfSignature.create({ cryptographicStandard: CryptographicStandard.cms }, certData, password);
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum CryptographicStandard {
    /**
     * Specifies Cryptographic Message Syntax
     */
    cms,
    /**
     * Specifies CMS Advanced Electronic Signatures
     */
    cades,
}
/**
 * Specifies the certification flags.
 * ```typescript
 * //Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new signature using PFX data and specify forbidchanges as the certification flags
 * const sign: PdfSignature = PdfSignature.create({ documentPermissions: PdfCertificationFlag.forbidChanges }, certData, password);
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfCertificationFlag {
    /**
     * Restrict any changes to the document.
     */
    forbidChanges = 1,
    /**
     * Only allow form fill-in actions on this document.
     */
    allowFormFill = 2,
    /**
     * Only allow commenting and form fill-in actions on this document.
     */
    allowComments = 3
}
/**
 * Revocation check mode used internally for X.509 validation.
 *
 * @private
 */
export enum _PdfX509RevocationMode {
    noCheck,
    online,
    offline
}
/**
 * Revocation source types used internally for certificate validation.
 *
 * @private
 */
export enum _RevocationType {
    ocsp,
    crl,
    ocspAndCrl,
    ocspOrCrl
}
/**
 * Enum for PDF loaded annotation type.
 *
 * @private
 */
export enum _PdfAnnotationType {
    /**
     * Specifies the intent of `highlight`.
     */
    highlight,
    /**
     * Specifies the intent of `underline`.
     */
    underline,
    /**
     * Specifies the intent of `strikeOut`.
     */
    strikeOut,
    /**
     * Specifies the intent of `squiggly`.
     */
    squiggly,
    /**
     * Specifies the intent of `redactionAnnotation`.
     */
    redactionAnnotation,
    /**
     * Specifies the intent of `textAnnotation`.
     */
    textAnnotation,
    /**
     * Specifies the intent of `linkAnnotation`.
     */
    linkAnnotation,
    /**
     * Specifies the intent of `documentLinkAnnotation`.
     */
    documentLinkAnnotation,
    /**
     * Specifies the intent of `uriAnnotation`.
     */
    uriAnnotation,
    /**
     * Specifies the intent of `fileLinkAnnotation`.
     */
    fileLinkAnnotation,
    /**
     * Specifies the intent of `freeTextAnnotation`.
     */
    freeTextAnnotation,
    /**
     * Specifies the intent of `lineAnnotation`.
     */
    lineAnnotation,
    /**
     * Specifies the intent of `circleAnnotation`.
     */
    circleAnnotation,
    /**
     * Specifies the intent of `ellipseAnnotation`.
     */
    ellipseAnnotation,
    /**
     * Specifies the intent of `squareAnnotation`.
     */
    squareAnnotation,
    /**
     * Specifies the intent of `rectangleAnnotation`.
     */
    rectangleAnnotation,
    /**
     * Specifies the intent of `polygonAnnotation`.
     */
    polygonAnnotation,
    /**
     * Specifies the intent of `polyLineAnnotation`.
     */
    polyLineAnnotation,
    /**
     * Specifies the intent of `textMarkupAnnotation`.
     */
    textMarkupAnnotation,
    /**
     * Specifies the intent of `caretAnnotation`.
     */
    caretAnnotation,
    /**
     * Specifies the intent of `rubberStampAnnotation`.
     */
    rubberStampAnnotation,
    /**
     * Specifies the intent of `popupAnnotation`.
     */
    popupAnnotation,
    /**
     * Specifies the intent of `fileAttachmentAnnotation`.
     */
    fileAttachmentAnnotation,
    /**
     * Specifies the intent of `soundAnnotation`.
     */
    soundAnnotation,
    /**
     * Specifies the intent of `movieAnnotation`.
     */
    movieAnnotation,
    /**
     * Specifies the intent of `screenAnnotation`.
     */
    screenAnnotation,
    /**
     * Specifies the intent of `widgetAnnotation`.
     */
    widgetAnnotation,
    /**
     * Specifies the intent of `printerMarkAnnotation`.
     */
    printerMarkAnnotation,
    /**
     * Specifies the intent of `trapNetworkAnnotation`.
     */
    trapNetworkAnnotation,
    /**
     * Specifies the intent of `watermarkAnnotation`.
     */
    watermarkAnnotation,
    /**
     * Specifies the intent of `textWebLinkAnnotation`.
     */
    textWebLinkAnnotation,
    /**
     * Specifies the intent of `inkAnnotation`.
     */
    inkAnnotation,
    /**
     * Specifies the intent of `richMediaAnnotation`.
     */
    richMediaAnnotation,
    /**
     * Specifies the intent of `angleMeasurementAnnotation`.
     */
    angleMeasurementAnnotation,
    /**
     * Specifies the intent of `threeDAnnotation`.
     */
    threeDAnnotation,
    /**
     * Specifies the intent of `projectionAnnotation`.
     */
    projectionAnnotation,
    /**
     * Specifies the intent of `null`.
     */
    null
}
/**
 * Public enum to define the icon style for sound annotations in PDF documents.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a sound annotation with speaker icon
 * let soundAnnotation: PdfSoundAnnotation = new PdfSoundAnnotation(page, {x: 50, y: 150, width: 20, height: 20});
 * // Set the icon to display as a speaker
 * soundAnnotation.icon = PdfSoundIcon.Speaker;
 * // Alternatively, create with microphone icon
 * let micAnnotation: PdfSoundAnnotation = new PdfSoundAnnotation(page, {x: 100, y: 150, width: 20, height: 20});
 * micAnnotation.icon = PdfSoundIcon.Microphone;
 * // Add annotations to the page
 * page.annotations.add(soundAnnotation);
 * page.annotations.add(micAnnotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfSoundIcon {
    /**
     * Specifies the type of `speaker`.
     */
    Speaker,
    /**
     * Specifies the type of `microphone`.
     */
    Microphone
}
/**
 * Public enum to define the format of 3D artwork data embedded in a PDF 3D annotation.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(page, {x: 50, y: 350, width: 200, height: 200});
 * // Set the embedded 3D data format to U3D
 * annotation3D.annotationType = Pdf3DAnnotationType.U3D;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DAnnotationType {
    /**
     * Specifies the type of `u3d`.
     */
    U3D,
    /**
     * Specifies the type of `prc`.
     */
    PRC
}
/**
 * Public enum to define the activation modes for a PDF 3D annotation.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(page, {x: 50, y: 350, width: 200, height: 200});
 * // Set the activation mode to explicit activation
 * annotation3D.activationMode = Pdf3DActivationMode.ExplicitActivation;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DActivationMode {
    /**
     * Specifies the type of `explicitActivation`.
     */
    ExplicitActivation,
    /**
     * Specifies the type of `pageOpen`.
     */
    PageOpen,
    /**
     * Specifies the type of `pageVisible`.
     */
    PageVisible
}
/**
 * Public enum to define the deactivation modes for a PDF 3D annotation.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(page, {x: 50, y: 350, width: 200, height: 200});
 * // Set the deactivation mode to explicit deactivation (user click)
 * annotation3D.deactivationMode = Pdf3DDeactivationMode.ExplicitDeactivation;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DDeactivationMode {
    /**
     * Specifies the type of `explicitDeactivation`.
     */
    ExplicitDeactivation,
    /**
     * Specifies the type of `pageClose`.
     */
    PageClose,
    /**
     * Specifies the type of `pageInvisible`.
     */
    PageInvisible
}
/**
 * Defines the animation types available for a PDF 3D view.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(page, { x: 50, y: 350, width: 200, height: 200 });
 * // Set the animation type
 * annotation3D.animationStyle.animationType = Pdf3DAnimationType.Linear;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DAnimationType {
    /**
     * Specifies no animation.
     */
    None,
    /**
     * Specifies linear animation.
     */
    Linear,
    /**
     * Specifies oscillating animation.
     */
    Oscillating
}
/**
 * Defines the rendering styles available for 3D artwork.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(
 *     page,
 *     { x: 50, y: 350, width: 200, height: 200 }
 * );
 * // Set the render style
 * annotation3D.renderMode.style = Pdf3DRenderStyle.Solid;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DRenderStyle {
    /**
     * Displays textured and lit geometric shapes.
     */
    Solid,
    /**
     * Displays textured and lit shapes with single-color edges.
     */
    SolidWireframe,
    /**
     * Displays textured and lit shapes with transparency.
     */
    Transparent,
    /**
     * Displays transparent shapes with opaque edges.
     */
    TransparentWireframe,
    /**
     * Displays the bounding-box edges of each node.
     */
    BoundingBox,
    /**
     * Displays transparent bounding-box faces.
     */
    TransparentBoundingBox,
    /**
     * Displays transparent bounding-box edges and faces.
     */
    TransparentBoundingBoxOutline,
    /**
     * Displays edges in a single color.
     */
    Wireframe,
    /**
     * Displays edges using interpolated vertex colors and lighting.
     */
    ShadedWireframe,
    /**
     * Displays visible edges and removes hidden edges.
     */
    HiddenWireframe,
    /**
     * Displays vertices in a single color.
     */
    Vertices,
    /**
     * Displays vertices using vertex colors and lighting.
     */
    ShadedVertices,
    /**
     * Displays silhouette edges with surfaces.
     */
    Illustration,
    /**
     * Displays silhouette edges with lit and textured surfaces.
     */
    SolidOutline,
    /**
     * Displays silhouette edges with lit, textured, and emissive surfaces.
     */
    ShadedIllustration
}
/**
 * Defines the lighting styles available for 3D artwork.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(
 *     page,
 *     { x: 50, y: 350, width: 200, height: 200 }
 * );
 * // Set the lighting style
 * annotation3D.renderMode.lightingScheme = Pdf3DLightingStyle.Day;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DLightingStyle {
    /**
     * Uses the lights specified in the 3D artwork.
     */
    Artwork,
    /**
     * Ignores the lighting specified in the 3D artwork.
     */
    None,
    /**
     * Uses three blue-grey infinite lights.
     */
    White,
    /**
     * Uses three light-grey infinite lights.
     */
    Day,
    /**
     * Uses yellow, aqua, and blue infinite lights.
     */
    Night,
    /**
     * Uses three grey infinite lights.
     */
    Hard,
    /**
     * Uses red, green, and blue infinite lights.
     */
    Primary,
    /**
     * Uses three blue infinite lights.
     */
    Blue,
    /**
     * Uses three red infinite lights.
     */
    Red,
    /**
     * Uses six grey infinite lights aligned with the major axes.
     */
    Cube,
    /**
     * Uses three grey infinite lights and one camera-attached light.
     */
    CAD,
    /**
     * Uses a single infinite light attached to the camera.
     */
    Headlamp
}
/**
 * Defines the projection types available for a 3D view.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a 3D annotation with U3D data
 * let annotation3D: Pdf3DAnnotation = new Pdf3DAnnotation(
 *     page,
 *     { x: 50, y: 350, width: 200, height: 200 }
 * );
 * // Set the projection type
 * annotation3D.projection.projectionType = Pdf3DProjectionType.Perspective;
 * // Add the annotation to the page
 * page.annotations.add(annotation3D);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum Pdf3DProjectionType {
    /**
     * Specifies orthographic projection.
     */
    Orthographic,
    /**
     * Specifies perspective projection.
     */
    Perspective
}
/**
 * Enum for PDF graphics unit.
 *
 * @private
 */
export enum _PdfGraphicsUnit {
    /**
     * Specifies the type of `centimeter`.
     */
    centimeter = 0,
    /**
     * Specifies the type of `pica`.
     */
    pica = 1,
    /**
     * Specifies the type of `pixel`.
     */
    pixel = 2,
    /**
     * Specifies the type of `point`.
     */
    point = 3,
    /**
     * Specifies the type of `inch`.
     */
    inch = 4,
    /**
     * Specifies the type of `document`.
     */
    document = 5,
    /**
     * Specifies the type of `millimeter`.
     */
    millimeter = 6,
}
/**
 * Enum for PDF interactive form (AcroForm) field flags.
 *
 * @private
 */
export enum _FieldFlag {
    default = 0,
    readOnly = 1,
    required = 1 << 1,
    noExport = 1 << 2,
    multiLine = 1 << 12,
    password = 1 << 13,
    fileSelect = 1 << 20,
    doNotSpellCheck = 1 << 22,
    doNotScroll = 1 << 23,
    comb = 1 << 24,
    richText = 1 << 25,
    noToggleToOff = 1 << 14,
    radio = 1 << 15,
    pushButton = 1 << 16,
    radiosInUnison = 1 << 25,
    combo = 1 << 17,
    edit = 1 << 18,
    sort = 1 << 19,
    multiSelect = 1 << 21,
    commitOnSelectChange = 1 << 26
}
/**
 * Enum for digital signature flags in PDF signatures.
 *
 * @private
 */
export enum _SignatureFlag {
    none = 0,
    signatureExists = 1,
    appendOnly = 2
}
/**
 * Enum for check box and radio button appearance states.
 *
 * @private
 */
export enum _PdfCheckFieldState {
    unchecked,
    checked,
    pressedUnchecked,
    pressedChecked
}
/**
 * Enum for text word-wrap behavior in PDF layout.
 *
 * @private
 */
export enum _PdfWordWrapType {
    /**
     * Specifies the type of `none`.
     */
    none,
    /**
     * Specifies the type of `word`.
     */
    word,
    /**
     * Specifies the type of `wordOnly`.
     */
    wordOnly,
    /**
     * Specifies the type of `character`.
     */
    character
}
/**
 * Enum for font descriptor flags used by PDF fonts.
 *
 * @private
 */
export enum _FontDescriptorFlag {
    fixedPitch = 1,
    serif = 2,
    symbolic = 4,
    script = 8,
    nonSymbolic = 32,
    italic = 64,
    forceBold = 0x40000
}
/**
 * Enum for TrueType 'cmap' table format types.
 *
 * @private
 */
export enum _TrueTypeCmapFormat {
    apple = 0,
    microsoft = 4,
    trimmed = 6
}
/**
 * Enum for TrueType 'cmap' encoding types.
 *
 * @private
 */
export enum _TrueTypeCmapEncoding {
    unknown = 0,
    symbol = 1,
    unicode = 2,
    macintosh = 3
}
/**
 * Enum for TrueType platform identifiers.
 *
 * @private
 */
export enum _TrueTypePlatformID {
    appleUnicode = 0,
    macintosh = 1,
    iSO = 2,
    microsoft = 3
}
/**
 * Enum for TrueType Microsoft encoding identifiers.
 *
 * @private
 */
export enum _TrueTypeMicrosoftEncodingID {
    undefined = 0,
    unicode = 1
}
/**
 * Enum for TrueType Macintosh encoding identifiers.
 *
 * @private
 */
export enum _TrueTypeMacintoshEncodingID {
    roman = 0,
    japanese = 1,
    chinese = 2
}
/**
 * Enum for TrueType composite glyph flags.
 *
 * @private
 */
export enum _TrueTypeCompositeGlyphFlag {
    Arg1And2AreWords = 0x0001,
    ArgsAreXyValues = 0x0002,
    RoundXyToGrid = 0x0004,
    WeHaveScale = 0x0008,
    Reserved = 0x0010,
    MoreComponents = 0x0020,
    WeHaveAnXyScale = 0x0040,
    WeHaveTwoByTwo = 0x0080,
    WeHaveInstructions = 0x0100,
    UseMyMetrics = 0x0200,
}
/**
 * Enum for supported raster/vector image formats.
 *
 * @private
 */
export enum _ImageFormat {
    /**
     * Specifies the type of `unknown`.
     */
    unknown,
    /**
     * Specifies the type of `bmp`.
     */
    bmp,
    /**
     * Specifies the type of `emf`.
     */
    emf,
    /**
     * Specifies the type of `gif`.
     */
    gif,
    /**
     * Specifies the type of `jpeg`.
     */
    jpeg,
    /**
     * Specifies the type of `png`.
     */
    png,
    /**
     * Specifies the type of `wmf`.
     */
    wmf,
    /**
     * Specifies the type of `icon`.
     */
    icon
}
/**
 * Enum for supported raster/vector image formats.
 *
 * @private
 */
export enum _TokenType{
    none,
    comment,
    number,
    real,
    string,
    hexString,
    unicodeString,
    unicodeHexString,
    name,
    operator,
    beginArray,
    endArray,
    eof
}
/**
 * Enum for PDF color space types.
 *
 * @private
 */
export enum _PdfColorSpace {
    rgb,
    cmyk,
    grayScale,
    indexed
}
/**
 * Enum for supported XMP-Schema types.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the document properties
 * let documentProperties: PdfDocumentProperties = document.getDocumentInformation();
 * // Gets XMP metadata
 * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
 * // Gets the basic schema from the XMP metadata
 * let basicSchema: PdfBasicSchema = xmpMetadata.basicSchema;
 * // Gets the schema type
 * let schemaType: PdfXmpSchemaType = basicSchema.schemaType;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfXmpSchemaType {
    /**
     * Specifies the type of `basic`.
     */
    basic = 'Basic',
    /**
     * Specifies the type of `dublinCore`.
     */
    dublinCore = 'DublinCore',
    /**
     * Specifies the type of `pdf`.
     */
    pdf = 'PDF',
    /**
     * Specifies the type of `pagedText`.
     */
    pagedText = 'PagedText',
    /**
     * Specifies the type of `basicJobTicket`.
     */
    basicJobTicket = 'BasicJobTicket',
    /**
     * Specifies the type of `rightsManagement`.
     */
    rightsManagement = 'RightsManagement',
    /**
     * Specifies the type of `custom`.
     */
    custom = 'Custom'
}
/**
 * Public enum to define template layer rendering mode.
 *
 * ```typescript
 * // Create new document
 * let document: PdfDocument = new PdfDocument();
 * // Create a header template
 * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({width: 595, height: 50});
 * // Set template to render as background
 * headerTemplate.templateLayerMode = PdfTemplateLayerMode.background;
 * // Draw content on header
 * headerTemplate.graphics.drawString('Header', font, {x: 10, y: 10, width: 575, height: 30}, brush);
 * // Assign to the document template along with the template layer rendering mode
 * document.template.top = {template: headerTemplate, templateLayerMode: PdfTemplateLayerMode.background, alignment: PdfHorizontalAlignment.center};
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfTemplateLayerMode {
    /**
     * Specifies that the template renders behind page content (background layer).
     */
    background = 0,
    /**
     * Specifies that the template renders above page content (foreground layer).
     */
    foreground = 1
}
/**
 * Public enum to define horizontal alignment options.
 *
 * ```typescript
 * // Create new document
 * let document: PdfDocument = new PdfDocument();
 * // Create a header template
 * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({width: 595, height: 50});
 * // Draw content on header
 * headerTemplate.graphics.drawString('Header', font, {x: 10, y: 10, width: 575, height: 30}, brush);
 * // Assign to document template with horizontal alignment
 * document.template.top = {template: headerTemplate, alignment: PdfTemplateHorizontalAlignment.center};
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export enum PdfTemplateHorizontalAlignment {
    /**
     * No horizontal alignment is applied
     */
    none,
    /**
     * Aligns the template to the left side of the page
     */
    left,
    /**
     * Centers the template horizontally on the page
     */
    center,
    /**
     * Aligns the template to the right side of the page
     */
    right
}
/**
 * Public enum to define vertical alignment options.
 *
 * ```typescript
 * // Create new document
 * let document: PdfDocument = new PdfDocument();
 * // Create a header template
 * let headerTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({width: 595, height: 50});
 * // Draw content on header
 * headerTemplate.graphics.drawString('Header', font, {x: 10, y: 10, width: 575, height: 30}, brush);
 * // Assign to document template with vertical alignment
 * document.template.left = {template: headerTemplate, alignment: PdfTemplateVerticalAlignment.top};
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export enum PdfTemplateVerticalAlignment {
    /**
     * No vertical alignment is applied
     */
    none,
    /**
     * Aligns the content to the top
     */
    top,
    /**
     * Centers the content vertically
     */
    middle,
    /**
     * Aligns the content to the bottom
     */
    bottom
}
/**
 * Internal enum for alignment styles used by templates and content placement.
 *
 * @private
 */
export enum _PdfAlignmentStyle {
    topLeft = 0,
    topCenter = 1,
    topRight = 2,
    middleLeft = 3,
    middleCenter = 4,
    middleRight = 5,
    bottomLeft = 6,
    bottomCenter = 7,
    bottomRight = 8
}
/**
 * Internal enum keys for document template sides/variants.
 *
 * @private
 */
export enum _PdfDocumentTemplateKey {
    top = 0,
    bottom = 1,
    left = 2,
    right = 3,
    evenTop = 4,
    evenBottom = 5,
    evenLeft = 6,
    evenRight = 7,
    oddTop = 8,
    oddBottom = 9,
    oddLeft = 10,
    oddRight = 11
}
/**
 * Enum describing template sides (top/bottom/left/right) used internally.
 *
 * @private
 */
export enum _TemplateSide {
    top = 0,
    bottom = 1,
    left = 2,
    right = 3
}
/**
 * Public Enum to define PDF encryption algorithm types.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create security options with AES-128 encryption
 * let securityOptions: PdfSecurityOptions = {
 *     encryptionType: PdfEncryptionType.aesBit128,
 *     userPassword: 'user123'
 * };
 * // Apply security settings
 * document.setSecurity(securityOptions);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfEncryptionType {
    /**
     * Specifies RC4 encryption with 40-bit key length
     */
    rc4Bit40,
    /**
     * Specifies RC4 encryption with 128-bit key length
     */
    rc4Bit128,
    /**
     * Specifies AES encryption with 128-bit key length
     */
    aesBit128,
    /**
     * Specifies AES-256 encryption with Revision 5 (PDF 1.7 Extension Level 3)
     */
    aesBit256Rev5,
    /**
     * Specifies AES-256 encryption with Revision 6 (PDF 2.0)
     */
    aesBit256Rev6,
}
/**
 * Public enum to define revocation validation mode for Long-Term Validation.
 *
 * ```typescript
 * // Load the document
 * const document: PdfDocument = new PdfDocument(data);
 * // Access the PDF form
 * const form: PdfForm = document.form;
 * // Get an existing signature field
 * const field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
 * // Get the signature
 * const signature: PdfSignature = field.getSignature();
 * // Create an LTV callback to fetch OCSP/CRL responses
 * async function longTermValidationCallback(url: string, requestBytes?: Uint8Array):
 *  Promise<{ response: Uint8Array }> {
 *          //  Implement Long Term Validation response retrieval here
 *           return new Uint8Array(); // Placeholder return
 * }
 * // Enable Long Term Validation using public certificates, revocation mode and callback
 * const ltvEnabled: boolean = await signature.enableLTV(publicCertificates, RevocationType.crl, longTermValidationCallback);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum RevocationType {
    /**
     * Validates revocation using OCSP only.
     */
    ocsp,
    /**
     * Validates revocation using CRL only.
     */
    crl,
    /**
     * Validates revocation using both OCSP and CRL.
     */
    ocspAndCrl,
    /**
     * Validates revocation using either OCSP or CRL.
     */
    ocspOrCrl,
    /**
     * Does not perform revocation validation.
     */
    none
}
/**
 * Public enum that specifies the certificate's revocation status.
 *
 * ```typescript
 * // Load the signed PDF document
 * const document: PdfDocument = new PdfDocument(data);
 * // Access an existing signature field
 * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Validate the signature
 * const result: PdfSignatureValidationResult = field.validateSignature();
 * // Check the OCSP revocation status
 * const revocationResult: RevocationStatus = result.revocationResult.ocspRevocationStatus;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum RevocationStatus {
    /**
     * Specifies that the revocation status could not be determined or is unavailable.
     */
    none = 0,
    /**
     * Specifies that the certificate is valid and has not been revoked.
     */
    good = 1,
    /**
     * Specifies that the revocation status of the certificate is unknown.
     */
    unknown = 2,
    /**
     * Specifies that the certificate has been revoked.
     */
    revoked = 3
}
/**
 * Public enum that specifies the signature validation status.
 *
 * ```typescript
 * // Load the signed PDF document
 * const document: PdfDocument = new PdfDocument(data);
 * // Access an existing signature field
 * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Validate the signature
 * const result: PdfSignatureValidationResult = field.validateSignature();
 * // Check the signature validation status
 * const status: SignatureStatus = result.signatureStatus;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum SignatureStatus {
    /**
     * Specifies invalid status.
     */
    invalid = 0,
    /**
     * Specifies valid status.
     */
    valid = 1,
    /**
     * Specifies unknown status.
     */
    unknown = 2
}
/**
 * Public enum that specifies how an image is sized within a `PdfGrid` cell.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a data-source grid
 * let grid: PdfGrid = new PdfGrid([{ id: '1' }], [{ field: 'id' }]);
 * // Set the image fit mode for a cell
 * grid.getRow(0).cells[0].style = { imageProperties: { fitType: PdfImageStyle.fitCell } };
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfImageStyle {
    /**
     * Fits the image to the available content width while preserving its aspect ratio.
     */
    fitWidth,
    /**
     * Fits the image to the available content height while preserving its aspect ratio.
     */
    fitHeight,
    /**
     * Fits the image within both the available content width and height while preserving its aspect ratio.
     */
    fitCell,
    /**
     * Stretches the image to exactly fill the available content width and height, ignoring the aspect ratio.
     */
    stretch
}
/**
 * Public enum to define the action type of an explicit `PdfLink` assigned to a `PdfGridCell`.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a data-source grid
 * let grid: PdfGrid = new PdfGrid([{ id: '1' }], [{ field: 'id' }]);
 * // Assign an explicit URI link to a cell
 * grid.getRow(0).cells[0].link = { type: PdfLinkType.externalLink, uri: 'https://www.syncfusion.com' };
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfLinkType {
    /**
     * Specifies a link that opens an external URI.
     */
    externalLink,
    /**
     * Specifies a link that navigates to a destination within the document.
     */
    internalLink,
    /**
     * Specifies a link that opens an external file.
     */
    file
}
/**
 * Public enum that specifies how adjacent cell borders are rendered in a `PdfGrid`.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a data-source grid
 * let grid: PdfGrid = new PdfGrid([{ id: '1' }], [{ field: 'id' }]);
 * // Set border overlap behavior for grid cells
 * grid.style = { borderOverlapStyle: BorderOverlapStyle.overlap };
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum BorderOverlapStyle {
    /**
     * Specifies that adjacent cell borders remain separate.
     */
    inside,
    /**
     * Specifies that adjacent cell borders overlap.
     */
    overlap
}
/**
 * Public enum that specifies the built-in `PdfGrid` appearance.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a data-source grid using a built-in style
 * let grid: PdfGrid = new PdfGrid([{ id: '1' }], [{ field: 'id' }], {builtInStyle: PdfGridBuiltinStyle.tableGrid});
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 160 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfGridBuiltinStyle {
    /**
     * Specifies the type of `plainTable1`.
     */
    plainTable1 = 0,
    /**
     * Specifies the type of `plainTable2`.
     */
    plainTable2 = 1,
    /**
     * Specifies the type of `plainTable3`.
     */
    plainTable3 = 2,
    /**
     * Specifies the type of `plainTable4`.
     */
    plainTable4 = 3,
    /**
     * Specifies the type of `plainTable5`.
     */
    plainTable5 = 4,
    /**
     * Specifies the type of `gridTable1Light`.
     */
    gridTable1Light = 5,
    /**
     * Specifies the type of `gridTable1LightAccent1`.
     */
    gridTable1LightAccent1 = 6,
    /**
     * Specifies the type of `gridTable1LightAccent2`.
     */
    gridTable1LightAccent2 = 7,
    /**
     * Specifies the type of `gridTable1LightAccent3`.
     */
    gridTable1LightAccent3 = 8,
    /**
     * Specifies the type of `gridTable1LightAccent4`.
     */
    gridTable1LightAccent4 = 9,
    /**
     * Specifies the type of `gridTable1LightAccent5`.
     */
    gridTable1LightAccent5 = 10,
    /**
     * Specifies the type of `gridTable1LightAccent6`.
     */
    gridTable1LightAccent6 = 11,
    /**
     * Specifies the type of `gridTable2`.
     */
    gridTable2 = 12,
    /**
     * Specifies the type of `gridTable2Accent1`.
     */
    gridTable2Accent1 = 13,
    /**
     * Specifies the type of `gridTable2Accent2`.
     */
    gridTable2Accent2 = 14,
    /**
     * Specifies the type of `gridTable2Accent3`.
     */
    gridTable2Accent3 = 15,
    /**
     * Specifies the type of `gridTable2Accent4`.
     */
    gridTable2Accent4 = 16,
    /**
     * Specifies the type of `gridTable2Accent5`.
     */
    gridTable2Accent5 = 17,
    /**
     * Specifies the type of `gridTable2Accent6`.
     */
    gridTable2Accent6 = 18,
    /**
     * Specifies the type of `gridTable3`.
     */
    gridTable3 = 19,
    /**
     * Specifies the type of `gridTable3Accent1`.
     */
    gridTable3Accent1 = 20,
    /**
     * Specifies the type of `gridTable3Accent2`.
     */
    gridTable3Accent2 = 21,
    /**
     * Specifies the type of `gridTable3Accent3`.
     */
    gridTable3Accent3 = 22,
    /**
     * Specifies the type of `gridTable3Accent4`.
     */
    gridTable3Accent4 = 23,
    /**
     * Specifies the type of `gridTable3Accent5`.
     */
    gridTable3Accent5 = 24,
    /**
     * Specifies the type of `gridTable3Accent6`.
     */
    gridTable3Accent6 = 25,
    /**
     * Specifies the type of `gridTable4`.
     */
    gridTable4 = 26,
    /**
     * Specifies the type of `gridTable4Accent1`.
     */
    gridTable4Accent1 = 27,
    /**
     * Specifies the type of `gridTable4Accent2`.
     */
    gridTable4Accent2 = 28,
    /**
     * Specifies the type of `gridTable4Accent3`.
     */
    gridTable4Accent3 = 29,
    /**
     * Specifies the type of `gridTable4Accent4`.
     */
    gridTable4Accent4 = 30,
    /**
     * Specifies the type of `gridTable4Accent5`.
     */
    gridTable4Accent5 = 31,
    /**
     * Specifies the type of `gridTable4Accent6`.
     */
    gridTable4Accent6 = 32,
    /**
     * Specifies the type of `gridTable5Dark`.
     */
    gridTable5Dark = 33,
    /**
     * Specifies the type of `gridTable5DarkAccent1`.
     */
    gridTable5DarkAccent1 = 34,
    /**
     * Specifies the type of `gridTable5DarkAccent2`.
     */
    gridTable5DarkAccent2 = 35,
    /**
     * Specifies the type of `gridTable5DarkAccent3`.
     */
    gridTable5DarkAccent3 = 36,
    /**
     * Specifies the type of `gridTable5DarkAccent4`.
     */
    gridTable5DarkAccent4 = 37,
    /**
     * Specifies the type of `gridTable5DarkAccent5`.
     */
    gridTable5DarkAccent5 = 38,
    /**
     * Specifies the type of `gridTable5DarkAccent6`.
     */
    gridTable5DarkAccent6 = 39,
    /**
     * Specifies the type of `gridTable6Colorful`.
     */
    gridTable6Colorful = 40,
    /**
     * Specifies the type of `gridTable6ColorfulAccent1`.
     */
    gridTable6ColorfulAccent1 = 41,
    /**
     * Specifies the type of `gridTable6ColorfulAccent2`.
     */
    gridTable6ColorfulAccent2 = 42,
    /**
     * Specifies the type of `gridTable6ColorfulAccent3`.
     */
    gridTable6ColorfulAccent3 = 43,
    /**
     * Specifies the type of `gridTable6ColorfulAccent4`.
     */
    gridTable6ColorfulAccent4 = 44,
    /**
     * Specifies the type of `gridTable6ColorfulAccent5`.
     */
    gridTable6ColorfulAccent5 = 45,
    /**
     * Specifies the type of `gridTable6ColorfulAccent6`.
     */
    gridTable6ColorfulAccent6 = 46,
    /**
     * Specifies the type of `gridTable7Colorful`.
     */
    gridTable7Colorful = 47,
    /**
     * Specifies the type of `gridTable7ColorfulAccent1`.
     */
    gridTable7ColorfulAccent1 = 48,
    /**
     * Specifies the type of `gridTable7ColorfulAccent2`.
     */
    gridTable7ColorfulAccent2 = 49,
    /**
     * Specifies the type of `gridTable7ColorfulAccent3`.
     */
    gridTable7ColorfulAccent3 = 50,
    /**
     * Specifies the type of `gridTable7ColorfulAccent4`.
     */
    gridTable7ColorfulAccent4 = 51,
    /**
     * Specifies the type of `gridTable7ColorfulAccent5`.
     */
    gridTable7ColorfulAccent5 = 52,
    /**
     * Specifies the type of `gridTable7ColorfulAccent6`.
     */
    gridTable7ColorfulAccent6 = 53,
    /**
     * Specifies the type of `listTable1Light`.
     */
    listTable1Light = 54,
    /**
     * Specifies the type of `listTable1LightAccent1`.
     */
    listTable1LightAccent1 = 55,
    /**
     * Specifies the type of `listTable1LightAccent2`.
     */
    listTable1LightAccent2 = 56,
    /**
     * Specifies the type of `listTable1LightAccent3`.
     */
    listTable1LightAccent3 = 57,
    /**
     * Specifies the type of `listTable1LightAccent4`.
     */
    listTable1LightAccent4 = 58,
    /**
     * Specifies the type of `listTable1LightAccent5`.
     */
    listTable1LightAccent5 = 59,
    /**
     * Specifies the type of `listTable1LightAccent6`.
     */
    listTable1LightAccent6 = 60,
    /**
     * Specifies the type of `listTable2`.
     */
    listTable2 = 61,
    /**
     * Specifies the type of `listTable2Accent1`.
     */
    listTable2Accent1 = 62,
    /**
     * Specifies the type of `listTable2Accent2`.
     */
    listTable2Accent2 = 63,
    /**
     * Specifies the type of `listTable2Accent3`.
     */
    listTable2Accent3 = 64,
    /**
     * Specifies the type of `listTable2Accent4`.
     */
    listTable2Accent4 = 65,
    /**
     * Specifies the type of `listTable2Accent5`.
     */
    listTable2Accent5 = 66,
    /**
     * Specifies the type of `listTable2Accent6`.
     */
    listTable2Accent6 = 67,
    /**
     * Specifies the type of `listTable3`.
     */
    listTable3 = 68,
    /**
     * Specifies the type of `listTable3Accent1`.
     */
    listTable3Accent1 = 69,
    /**
     * Specifies the type of `listTable3Accent2`.
     */
    listTable3Accent2 = 70,
    /**
     * Specifies the type of `listTable3Accent3`.
     */
    listTable3Accent3 = 71,
    /**
     * Specifies the type of `listTable3Accent4`.
     */
    listTable3Accent4 = 72,
    /**
     * Specifies the type of `listTable3Accent5`.
     */
    listTable3Accent5 = 73,
    /**
     * Specifies the type of `listTable3Accent6`.
     */
    listTable3Accent6 = 74,
    /**
     * Specifies the type of `listTable4`.
     */
    listTable4 = 75,
    /**
     * Specifies the type of `listTable4Accent1`.
     */
    listTable4Accent1 = 76,
    /**
     * Specifies the type of `listTable4Accent2`.
     */
    listTable4Accent2 = 77,
    /**
     * Specifies the type of `listTable4Accent3`.
     */
    listTable4Accent3 = 78,
    /**
     * Specifies the type of `listTable4Accent4`.
     */
    listTable4Accent4 = 79,
    /**
     * Specifies the type of `listTable4Accent5`.
     */
    listTable4Accent5 = 80,
    /**
     * Specifies the type of `listTable4Accent6`.
     */
    listTable4Accent6 = 81,
    /**
     * Specifies the type of `listTable5Dark`.
     */
    listTable5Dark = 82,
    /**
     * Specifies the type of `listTable5DarkAccent1`.
     */
    listTable5DarkAccent1 = 83,
    /**
     * Specifies the type of `listTable5DarkAccent2`.
     */
    listTable5DarkAccent2 = 84,
    /**
     * Specifies the type of `listTable5DarkAccent3`.
     */
    listTable5DarkAccent3 = 85,
    /**
     * Specifies the type of `listTable5DarkAccent4`.
     */
    listTable5DarkAccent4 = 86,
    /**
     * Specifies the type of `listTable5DarkAccent5`.
     */
    listTable5DarkAccent5 = 87,
    /**
     * Specifies the type of `listTable5DarkAccent6`.
     */
    listTable5DarkAccent6 = 88,
    /**
     * Specifies the type of `listTable6Colorful`.
     */
    listTable6Colorful = 89,
    /**
     * Specifies the type of `listTable6ColorfulAccent1`.
     */
    listTable6ColorfulAccent1 = 90,
    /**
     * Specifies the type of `listTable6ColorfulAccent2`.
     */
    listTable6ColorfulAccent2 = 91,
    /**
     * Specifies the type of `listTable6ColorfulAccent3`.
     */
    listTable6ColorfulAccent3 = 92,
    /**
     * Specifies the type of `listTable6ColorfulAccent4`.
     */
    listTable6ColorfulAccent4 = 93,
    /**
     * Specifies the type of `listTable6ColorfulAccent5`.
     */
    listTable6ColorfulAccent5 = 94,
    /**
     * Specifies the type of `listTable6ColorfulAccent6`.
     */
    listTable6ColorfulAccent6 = 95,
    /**
     * Specifies the type of `listTable7Colorful`.
     */
    listTable7Colorful = 96,
    /**
     * Specifies the type of `listTable7ColorfulAccent1`.
     */
    listTable7ColorfulAccent1 = 97,
    /**
     * Specifies the type of `listTable7ColorfulAccent2`.
     */
    listTable7ColorfulAccent2 = 98,
    /**
     * Specifies the type of `listTable7ColorfulAccent3`.
     */
    listTable7ColorfulAccent3 = 99,
    /**
     * Specifies the type of `listTable7ColorfulAccent4`.
     */
    listTable7ColorfulAccent4 = 100,
    /**
     * Specifies the type of `listTable7ColorfulAccent5`.
     */
    listTable7ColorfulAccent5 = 101,
    /**
     * Specifies the type of `listTable7ColorfulAccent6`.
     */
    listTable7ColorfulAccent6 = 102,
    /**
     * Specifies the type of `tableGridLight`.
     */
    tableGridLight = 103,
    /**
     * Specifies the type of `tableGrid`.
     */
    tableGrid = 104
}
/**
 * Specifies how a `PdfGrid` handles content that exceeds the available horizontal drawing area.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Create a grid with horizontal overflow set to nextPage
 * let grid: PdfGrid = new PdfGrid(rows, columns);
 * grid.horizontalOverflow = PdfGridHorizontalOverflowType.nextPage;
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 400 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfGridHorizontalOverflowType {
    /**
     * Specifies the type of `onePage`. Keeps all logical columns in one horizontal segment.
     */
    onePage = 0,
    /**
     * Specifies the type of `nextPage`. Continues overflowed columns on immediately following pages
     * for the same vertical row range before moving to the next vertical row range.
     */
    nextPage = 1,
    /**
     * Specifies the type of `lastPage`. Completes the vertical flow of the current horizontal segment
     * before rendering the next horizontal segment.
     */
    lastPage = 2
}
/**
 * Specifies the relationship of an embedded file attachment to the PDF document content.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new attachment
 * let attachment: PdfAttachment = new PdfAttachment(attachmentData, 'input.txt');
 * // Set the relationship
 * attachment.relationship = PdfAttachmentRelationship.Data;
 * // Add the attachment to the document
 * document.attachments.add(attachment);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfAttachmentRelationship {
    /**
     * The original source material for the associated content.
     */
    Source = 0,
    /**
     * Information used to derive a visual presentation.
     */
    Data = 1,
    /**
     * An alternative representation of the PDF contents.
     */
    Alternative = 2,
    /**
     * A supplemental representation of the original source or data that may be more easily consumable.
     */
    Supplement = 3,
    /**
     * The relationship is unknown or cannot be described using one of the other values.
     */
    Unspecified = 4
}
/**
 * Specifies the border groups to be rendered for a `PdfGrid`.
 *
 * This enumeration supports bitwise combination of values to include or
 * exclude specific outer and inner border groups when rendering a grid.
 *
 * ```typescript
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * let grid: PdfGrid = new PdfGrid();
 * grid.style.border = {
 *     type: PdfGridBorderType.Outside | PdfGridBorderType.InsideHorizontal,
 *     pen: {
 *         width: 1
 *     }
 * };
 * // Draw the grid on the page
 * grid.draw(page, { x: 10, y: 10, width: 240, height: 400 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfGridBorderType {
    /** Empty mask. */
    None = 0,
    /** Selects all outside and inside border groups. */
    All = 1 << 0,
    /** Selects or excludes the outside-left group. */
    Left = 1 << 1,
    /** Selects or excludes the outside-right group. */
    Right = 1 << 2,
    /** Selects or excludes the outside-top group. */
    Top = 1 << 3,
    /** Selects or excludes the outside-bottom group. */
    Bottom = 1 << 4,
    /** Selects or excludes inside-vertical separators. */
    InsideVertical = 1 << 5,
    /** Selects or excludes inside-horizontal separators. */
    InsideHorizontal = 1 << 6,
    /** Composite selector for both inside groups. */
    Inside = 1 << 7,
    /** Composite selector for all four outside groups. */
    Outside = 1 << 8
}
/**
 * Public enum to define the predefined navigation destination of a `PdfNamedAction`.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Access the first page
 * let page: PdfPage = document.addPage();
 * // Create a named action that navigates to the first page
 * let namedAction: PdfNamedAction = new PdfNamedAction(PdfActionDestination.FirstPage);
 * // Assign the action to the page open event
 * page.actions.open = namedAction;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfActionDestination {
    /**
     * Specifies the type of `FirstPage`.
     */
    FirstPage,
    /**
     * Specifies the type of `LastPage`.
     */
    LastPage,
    /**
     * Specifies the type of `NextPage`.
     */
    NextPage,
    /**
     * Specifies the type of `PrevPage`.
     */
    PrevPage
}
/**
 * Public enum to define the relationship of a `PdfTargetDictionary` entry to the current document.
 *
 * ```typescript
 * // Create an embedded PDF document
 * let embeddedDocument: PdfDocument = new PdfDocument();
 * embeddedDocument.addPage();
 * let embeddedData: Uint8Array = embeddedDocument.save();
 * embeddedDocument.destroy();
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * document.attachments.add(new PdfAttachment(embeddedData, 'embedded.pdf'));
 * // Create the embedded PDF destination
 * let destination: PdfRemoteDestination = new PdfRemoteDestination();
 * destination.pageNumber = 0;
 * destination.mode = PdfDestinationMode.fitToPage;
 * // Create a target with a child relationship
 * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
 * // Create an embedded GoTo action
 * let action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(destination, undefined, target);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'EmbeddedGoTo', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open embedded PDF';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum PdfTargetRelation {
    /**
     * Specifies that the target is the parent of the current document.
     */
    Parent,
    /**
     * Specifies that the target is a child of the current document.
     */
    Child
}
/**
 * Public enum to define the data format used when submitting PDF form data through a `PdfSubmitFormAction`.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a text box field
 * let textField: PdfTextBoxField = new PdfTextBoxField(
 *     page, 'Name', { x: 20, y: 20, width: 150, height: 30 }
 * );
 * document.form.add(textField);
 * // Create a submit-form action
 * let action: PdfSubmitFormAction = new PdfSubmitFormAction('https://submit.example.com');
 * action.fields = [textField];
 * action.include = true;
 * action.dataFormat = PdfSubmitDataFormat.Xfdf;
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'SubmitForm', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Submit form';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum PdfSubmitDataFormat {
    /**
     * Specifies that form data is submitted in HTML format.
     */
    Html,
    /**
     * Specifies that the entire PDF document is submitted.
     */
    Pdf,
    /**
     * Specifies that form data is submitted in FDF format.
     */
    Fdf,
    /**
     * Specifies that form data is submitted in XFDF format.
     */
    Xfdf
}
/**
 * Public enum to define the HTTP method used when submitting PDF form data through a `PdfSubmitFormAction`.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a text box field
 * let textField: PdfTextBoxField = new PdfTextBoxField(
 *     page, 'Name', { x: 20, y: 20, width: 150, height: 30 }
 * );
 * document.form.add(textField);
 * // Create a submit-form action
 * let action: PdfSubmitFormAction = new PdfSubmitFormAction('https://submit.example.com');
 * action.fields = [textField];
 * action.include = true;
 * action.httpMethod = HttpMethod.Post;
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'SubmitForm', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Submit form';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum HttpMethod {
    /**
     * Specifies that form data is submitted using the GET method.
     */
    Get,
    /**
     * Specifies that form data is submitted using the POST method.
     */
    Post
}
/**
 * Public enum to define the audio encoding of a `PdfSound` resource.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create and configure a sound resource
 * let sound: PdfSound = new PdfSound(soundData);
 * sound.bits = 16;
 * sound.channels = PdfSoundChannels.Stereo;
 * sound.encoding = PdfSoundEncoding.Signed;
 * sound.rate = 44100;
 * // Create a sound action
 * let action: PdfSoundAction = new PdfSoundAction(sound);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'PlaySound', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Play sound';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum PdfSoundEncoding {
    /**
     * Specifies A-law audio encoding.
     */
    ALaw,
    /**
     * Specifies mu-law audio encoding.
     */
    MuLaw,
    /**
     * Specifies raw audio encoding.
     */
    Raw,
    /**
     * Specifies signed-integer audio encoding.
     */
    Signed
}
/**
 * Public enum to define the channel layout of a `PdfSound` resource.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create and configure a sound resource
 * let sound: PdfSound = new PdfSound(soundData);
 * sound.bits = 16;
 * sound.channels = PdfSoundChannels.Stereo;
 * sound.encoding = PdfSoundEncoding.Signed;
 * sound.rate = 44100;
 * // Create a sound action
 * let action: PdfSoundAction = new PdfSoundAction(sound);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'PlaySound', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Play sound';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum PdfSoundChannels {
    /**
     * Specifies a single-channel sound resource.
     */
    Mono = 1,
    /**
     * Specifies a two-channel sound resource.
     */
    Stereo = 2
}
/**
 * Public enum to define the visibility operation applied to a layer by a `PdfLayerState`.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a layer and its state
 * let layer: PdfLayer = document.layers.add('Content Layer', true);
 * let state: PdfLayerState = new PdfLayerState(PdfLayerStateOperation.Off, layer);
 * // Create a layer-state action
 * let action: PdfSetOCGStateAction = new PdfSetOCGStateAction([state], true);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'LayerState', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Change layer';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum PdfLayerStateOperation {
    /**
     * Specifies that the layer is turned on.
     */
    On,
    /**
     * Specifies that the layer is turned off.
     */
    Off,
    /**
     * Specifies that the current visibility state of the layer is toggled.
     */
    Toggle
}
/**
 * Specifies the internal flags used by a submit-form action.
 *
 * @private
 */
export enum _PdfSubmitFormFlags {
    Include = 1,
    IncludeNoValueFields = 2,
    ExportFormat = 4,
    GetMethod = 8,
    SubmitCoordinates = 16,
    Xfdf = 32,
    IncludeAppendSaves = 64,
    IncludeAnnotations = 128,
    SubmitPdf = 256,
    CanonicalFormat = 512,
    ExcludeNonUserAnnotations = 1024,
    EmbedForm = 2048
}
/**
 * Specifies the type of identity or location represented by a Subject Alternative Name entry in an X.509 certificate.
 *
 * ```typescript
 * // Load an existing signed PDF document
 * const document: PdfDocument = new PdfDocument(data);
 * // Retrieve the signature field
 * const field: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
 * // Retrieve the digital signature
 * const signature: PdfSignature = field.getSignature();
 * // Retrieve the signing certificate information
 * const certificate: PdfCertificateInformation = signature.getCertificateInformation();
 * // Retrieve the Subject Alternative Name entries
 * const alternativeNames: PdfSubjectAlternativeName[] = certificate.subjectAlternativeNames;
 * // Retrieve each alternative-name type and value
 * for (const alternativeName of alternativeNames) {
 *     const type: PdfSubjectAlternativeNameType = alternativeName.type;
 *     const value: string = alternativeName.value;
 * }
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfSubjectAlternativeNameType {
    /**
     * Specifies an other-name entry.
     */
    otherName,
    /**
     * Specifies an RFC822 email address.
     */
    rfc822Name,
    /**
     * Specifies a DNS name.
     */
    dnsName,
    /**
     * Specifies a directory name.
     */
    directoryName,
    /**
     * Specifies a URI.
     */
    uniformResourceIdentifier,
    /**
     * Specifies an IP address.
     */
    ipAddress,
    /**
     * Specifies a registered object identifier.
     */
    registeredIdentifier
}
/**
 * Specifies the error correction level for a PDF417 barcode.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Create a PDF417 barcode
 * let barcode: Pdf417Barcode = new Pdf417Barcode('PDF417 payload');
 * barcode.text = 'Hello World';
 * barcode.errorCorrectionLevel = Pdf417ErrorCorrectionLevel.Level2;
 * barcode.draw(page, { x: 10, y: 20, width: 200, height: 100 });
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export enum Pdf417ErrorCorrectionLevel {
    /**
     * Specifies automatic ECC level selection based on data length.
     */
    Auto = 0,
    /**
     * Specifies ECC level 0 (2 ECC words).
     */
    Level0 = 1,
    /**
     * Specifies ECC level 1 (4 ECC words).
     */
    Level1 = 2,
    /**
     * Specifies ECC level 2 (8 ECC words).
     */
    Level2 = 3,
    /**
     * Specifies ECC level 3 (16 ECC words).
     */
    Level3 = 4,
    /**
     * Specifies ECC level 4 (32 ECC words).
     */
    Level4 = 5,
    /**
     * Specifies ECC level 5 (64 ECC words).
     */
    Level5 = 6,
    /**
     * Specifies ECC level 6 (128 ECC words).
     */
    Level6 = 7,
    /**
     * Specifies ECC level 7 (256 ECC words).
     */
    Level7 = 8,
    /**
     * Specifies ECC level 8 (512 ECC words).
     */
    Level8 = 9
}
/**
 * Specifies the error correction level for a QR Code barcode.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a QR barcode with quartile error correction
 * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
 * barcode.errorCorrectionLevel = PdfQRErrorCorrectionLevel.Quartile;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfQRErrorCorrectionLevel {
    /**
     * Specifies low error correction with approximately 7 percent recovery capability.
     */
    Low = 0,
    /**
     * Specifies medium error correction with approximately 15 percent recovery capability.
     */
    Medium = 1,
    /**
     * Specifies quartile error correction with approximately 25 percent recovery capability.
     */
    Quartile = 2,
    /**
     * Specifies high error correction with approximately 30 percent recovery capability.
     */
    High = 3
}
/**
 * Specifies how the payload of a QR Code barcode is encoded.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a QR barcode in alphanumeric mode
 * let barcode: PdfQRBarcode = new PdfQRBarcode('INVOICE-2026-000123');
 * barcode.inputMode = PdfQRInputMode.AlphaNumeric;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfQRInputMode {
    /**
     * Specifies numeric mode which accepts only the digits 0 through 9.
     */
    Numeric = 0,
    /**
     * Specifies alphanumeric mode which accepts 0-9, A-Z, space and $ % * + - . / :
     */
    AlphaNumeric = 1,
    /**
     * Specifies byte mode which converts the text to bytes using textEncoding.
     */
    Byte = 2,
    /**
     * Specifies mixed mode which automatically splits the input into
     * numeric, alphanumeric and byte segments.
     */
    Mixed = 3
}
/**
 * Specifies the byte conversion used by byte segments.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a QR barcode encoded as ISO-8859-1 bytes
 * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
 * barcode.textEncoding = PdfBarcodeTextEncoding.Iso88591;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBarcodeTextEncoding {
    /**
     * Specifies that the text is encoded as UTF-8 bytes.
     */
    Utf8 = 0,
    /**
     * Specifies that the text is encoded as ISO-8859-1 bytes;
     * characters outside the ISO-8859-1 range are rejected.
     */
    Iso88591 = 1
}
/**
 * Specifies automatic selection or an explicit QR Code symbol version (1 through 40).
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a QR barcode pinned to version 5
 * let barcode: PdfQRBarcode = new PdfQRBarcode('INVOICE-2026-000123');
 * barcode.version = PdfQRVersion.Version05;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfQRVersion {
    /**
     * Specifies that the smallest version that holds the payload is selected.
     */
    Auto = 0,
    /**
     * Specifies QR Code symbol version 1 (21 x 21 modules).
     */
    Version01 = 1,
    /**
     * Specifies QR Code symbol version 2 (25 x 25 modules).
     */
    Version02 = 2,
    /**
     * Specifies QR Code symbol version 3 (29 x 29 modules).
     */
    Version03 = 3,
    /**
     * Specifies QR Code symbol version 4 (33 x 33 modules).
     */
    Version04 = 4,
    /**
     * Specifies QR Code symbol version 5 (37 x 37 modules).
     */
    Version05 = 5,
    /**
     * Specifies QR Code symbol version 6 (41 x 41 modules).
     */
    Version06 = 6,
    /**
     * Specifies QR Code symbol version 7 (45 x 45 modules).
     */
    Version07 = 7,
    /**
     * Specifies QR Code symbol version 8 (49 x 49 modules).
     */
    Version08 = 8,
    /**
     * Specifies QR Code symbol version 9 (53 x 53 modules).
     */
    Version09 = 9,
    /**
     * Specifies QR Code symbol version 10 (57 x 57 modules).
     */
    Version10 = 10,
    /**
     * Specifies QR Code symbol version 11 (61 x 61 modules).
     */
    Version11 = 11,
    /**
     * Specifies QR Code symbol version 12 (65 x 65 modules).
     */
    Version12 = 12,
    /**
     * Specifies QR Code symbol version 13 (69 x 69 modules).
     */
    Version13 = 13,
    /**
     * Specifies QR Code symbol version 14 (73 x 73 modules).
     */
    Version14 = 14,
    /**
     * Specifies QR Code symbol version 15 (77 x 77 modules).
     */
    Version15 = 15,
    /**
     * Specifies QR Code symbol version 16 (81 x 81 modules).
     */
    Version16 = 16,
    /**
     * Specifies QR Code symbol version 17 (85 x 85 modules).
     */
    Version17 = 17,
    /**
     * Specifies QR Code symbol version 18 (89 x 89 modules).
     */
    Version18 = 18,
    /**
     * Specifies QR Code symbol version 19 (93 x 93 modules).
     */
    Version19 = 19,
    /**
     * Specifies QR Code symbol version 20 (97 x 97 modules).
     */
    Version20 = 20,
    /**
     * Specifies QR Code symbol version 21 (101 x 101 modules).
     */
    Version21 = 21,
    /**
     * Specifies QR Code symbol version 22 (105 x 105 modules).
     */
    Version22 = 22,
    /**
     * Specifies QR Code symbol version 23 (109 x 109 modules).
     */
    Version23 = 23,
    /**
     * Specifies QR Code symbol version 24 (113 x 113 modules).
     */
    Version24 = 24,
    /**
     * Specifies QR Code symbol version 25 (117 x 117 modules).
     */
    Version25 = 25,
    /**
     * Specifies QR Code symbol version 26 (121 x 121 modules).
     */
    Version26 = 26,
    /**
     * Specifies QR Code symbol version 27 (125 x 125 modules).
     */
    Version27 = 27,
    /**
     * Specifies QR Code symbol version 28 (129 x 129 modules).
     */
    Version28 = 28,
    /**
     * Specifies QR Code symbol version 29 (133 x 133 modules).
     */
    Version29 = 29,
    /**
     * Specifies QR Code symbol version 30 (137 x 137 modules).
     */
    Version30 = 30,
    /**
     * Specifies QR Code symbol version 31 (141 x 141 modules).
     */
    Version31 = 31,
    /**
     * Specifies QR Code symbol version 32 (145 x 145 modules).
     */
    Version32 = 32,
    /**
     * Specifies QR Code symbol version 33 (149 x 149 modules).
     */
    Version33 = 33,
    /**
     * Specifies QR Code symbol version 34 (153 x 153 modules).
     */
    Version34 = 34,
    /**
     * Specifies QR Code symbol version 35 (157 x 157 modules).
     */
    Version35 = 35,
    /**
     * Specifies QR Code symbol version 36 (161 x 161 modules).
     */
    Version36 = 36,
    /**
     * Specifies QR Code symbol version 37 (165 x 165 modules).
     */
    Version37 = 37,
    /**
     * Specifies QR Code symbol version 38 (169 x 169 modules).
     */
    Version38 = 38,
    /**
     * Specifies QR Code symbol version 39 (173 x 173 modules).
     */
    Version39 = 39,
    /**
     * Specifies QR Code symbol version 40 (177 x 177 modules).
     */
    Version40 = 40
}
/**
 * Specifies the Data Matrix encodation requested by the caller.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a Data Matrix barcode in ASCII encodation
 * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('ITEM-2026-0001');
 * barcode.encoding = PdfDataMatrixEncoding.Ascii;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfDataMatrixEncoding {
    /**
     * Specifies automatic encodation selection based on the payload.
     */
    Auto = 0,
    /**
     * Specifies ECC 200 ASCII encodation including digit-pair compaction.
     */
    Ascii = 1,
    /**
     * Specifies digit-only ASCII encodation with digit-pair compaction.
     */
    AsciiNumeric = 2,
    /**
     * Specifies Base256 encodation for arbitrary byte values.
     */
    Base256 = 3
}
/**
 * Specifies automatic selection or a fixed Data Matrix symbol size.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create a Data Matrix barcode with a fixed 20 x 20 symbol
 * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
 * barcode.symbolSize = PdfDataMatrixSize.Size20x20;
 * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfDataMatrixSize {
    /**
     * Specifies automatic selection of the smallest fitting symbol.
     */
    Auto = 0,
    /**
     * Specifies a 10 x 10 symbol.
     */
    Size10x10 = 1,
    /**
     * Specifies a 12 x 12 symbol.
     */
    Size12x12 = 2,
    /**
     * Specifies a 14 x 14 symbol.
     */
    Size14x14 = 3,
    /**
     * Specifies a 16 x 16 symbol.
     */
    Size16x16 = 4,
    /**
     * Specifies an 18 x 18 symbol.
     */
    Size18x18 = 5,
    /**
     * Specifies a 20 x 20 symbol.
     */
    Size20x20 = 6,
    /**
     * Specifies a 22 x 22 symbol.
     */
    Size22x22 = 7,
    /**
     * Specifies a 24 x 24 symbol.
     */
    Size24x24 = 8,
    /**
     * Specifies a 26 x 26 symbol.
     */
    Size26x26 = 9,
    /**
     * Specifies a 32 x 32 symbol.
     */
    Size32x32 = 10,
    /**
     * Specifies a 36 x 36 symbol.
     */
    Size36x36 = 11,
    /**
     * Specifies a 40 x 40 symbol.
     */
    Size40x40 = 12,
    /**
     * Specifies a 44 x 44 symbol.
     */
    Size44x44 = 13,
    /**
     * Specifies a 48 x 48 symbol.
     */
    Size48x48 = 14,
    /**
     * Specifies a 52 x 52 symbol.
     */
    Size52x52 = 15,
    /**
     * Specifies a 64 x 64 symbol.
     */
    Size64x64 = 16,
    /**
     * Specifies a 72 x 72 symbol.
     */
    Size72x72 = 17,
    /**
     * Specifies an 80 x 80 symbol.
     */
    Size80x80 = 18,
    /**
     * Specifies an 88 x 88 symbol.
     */
    Size88x88 = 19,
    /**
     * Specifies a 96 x 96 symbol.
     */
    Size96x96 = 20,
    /**
     * Specifies a 104 x 104 symbol.
     */
    Size104x104 = 21,
    /**
     * Specifies a 120 x 120 symbol.
     */
    Size120x120 = 22,
    /**
     * Specifies a 132 x 132 symbol.
     */
    Size132x132 = 23,
    /**
     * Specifies a 144 x 144 symbol.
     */
    Size144x144 = 24,
    /**
     * Specifies an 8 x 18 rectangular symbol.
     */
    Size8x18 = 25,
    /**
     * Specifies an 8 x 32 rectangular symbol.
     */
    Size8x32 = 26,
    /**
     * Specifies a 12 x 26 rectangular symbol.
     */
    Size12x26 = 27,
    /**
     * Specifies a 12 x 36 rectangular symbol.
     */
    Size12x36 = 28,
    /**
     * Specifies a 16 x 36 rectangular symbol.
     */
    Size16x36 = 29,
    /**
     * Specifies a 16 x 48 rectangular symbol.
     */
    Size16x48 = 30
}
/**
 * Specifies the symbology of a barcode form field.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a new page
 * let page: PdfPage = document.addPage();
 * // Create a QR code barcode field
 * let field: PdfBarcodeField = new PdfBarcodeField(page, 'barcode', {x: 10, y: 10, width: 100, height: 100}, {
 *     barcodeOptions: {symbology: PdfBarcodeSymbology.QR}
 * });
 * // Add the field to the form
 * document.form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBarcodeSymbology {
    /**
     * Specifies the PDF417 symbology. This is the default.
     */
    PDF417 = 0,
    /**
     * Specifies the QR Code symbology.
     */
    QR = 1,
    /**
     * Specifies the Data Matrix symbology.
     */
    DataMatrix = 2
}
/**
 * Specifies how the values of the referenced fields are combined into the barcode payload.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a new page
 * let page: PdfPage = document.addPage();
 * // Create a barcode field that encodes the values of other fields as XFDF
 * let field: PdfBarcodeField = new PdfBarcodeField(page, 'barcode', {x: 10, y: 10, width: 100, height: 100}, {
 *     fields: ['name', 'email'],
 *     valueFormat: PdfBarcodeValueFormat.XML
 * });
 * // Add the field to the form
 * document.form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfBarcodeValueFormat {
    /**
     * Values are separated by a tab character.
     */
    TabDelimited = 0,
    /**
     * Values are exported as an XFDF document.
     */
    XML = 1,
    /**
     * The payload is produced by a user supplied calculation script.
     */
    CustomScript = 2
}
/**
 * Specifies the horizontal alignment of human-readable barcode text.
 */
export enum PdfBarcodeTextAlignment {
    /**
     * Centers the barcode text.
     */
    Center = 0,
    /**
     * Left-aligns the barcode text.
     */
    Left = 1,
    /**
     * Right-aligns the barcode text.
     */
    Right = 2
}
/**
 * Specifies the location of human-readable barcode text relative to the bars.
 */
export enum PdfBarcodeTextLocation {
    /**
     * Displays the barcode text below the bars.
     */
    Bottom = 0,
    /**
     * Displays the barcode text above the bars.
     */
    Top = 1,
    /**
     * Does not display human-readable barcode text.
     */
    None = 2
}
/**
 * Defines the printer mark types that can be added to a PDF page.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a printer mark annotation
 * let annotation: PdfPrinterMarkAnnotation = new PdfPrinterMarkAnnotation(
 *     { x: 0, y: 0, width: 100, height: 100 }
 * );
 * // Set the printer mark type
 * annotation.markType = PdfPrinterMarkType.Crop;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPrinterMarkType {
    /**
     * Specifies crop marks.
     */
    Crop,
    /**
     * Specifies bleed marks.
     */
    Bleed,
    /**
     * Specifies registration marks.
     */
    Registration,
    /**
     * Specifies color bar marks.
     */
    ColorBar,
    /**
     * Specifies fold marks.
     */
    Fold,
    /**
     * Specifies page information marks.
     */
    PageInformation
}
/**
 * Defines the target page boxes used when positioning printer marks.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a printer mark annotation
 * let annotation: PdfPrinterMarkAnnotation = new PdfPrinterMarkAnnotation(
 *     { x: 0, y: 0, width: 100, height: 100 }
 * );
 * // Set the target box
 * annotation.targetBox = PdfPrinterMarkTargetBox.TrimBox;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPrinterMarkTargetBox {
    /**
     * Specifies the media box.
     */
    MediaBox,
    /**
     * Specifies the crop box.
     */
    CropBox,
    /**
     * Specifies the trim box.
     */
    TrimBox,
    /**
     * Specifies the bleed box.
     */
    BleedBox,
    /**
     * Specifies the art box.
     */
    ArtBox
}
/**
 * Defines the orientation options for printer marks.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a printer mark annotation
 * let annotation: PdfPrinterMarkAnnotation = new PdfPrinterMarkAnnotation(
 *     { x: 0, y: 0, width: 100, height: 100 }
 * );
 * // Set the printer mark orientation
 * annotation.orientation = PdfPrinterMarkOrientation.Horizontal;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPrinterMarkOrientation {
    /**
     * Specifies horizontal orientation.
     */
    Horizontal,
    /**
     * Specifies vertical orientation.
     */
    Vertical
}
/**
 * Defines the content types supported by rich media annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a rich media annotation
 * let annotation: PdfRichMediaAnnotation = new PdfRichMediaAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the content type
 * annotation.contentType = PdfRichMediaContentType.Video;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRichMediaContentType {
    /**
     * Specifies video content.
     */
    Video,
    /**
     * Specifies audio content.
     */
    Audio
}
/**
 * Defines the activation modes available for rich media annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a rich media annotation
 * let annotation: PdfRichMediaAnnotation = new PdfRichMediaAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the activation mode
 * annotation.activationMode = PdfRichMediaActivationMode.PageVisible;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRichMediaActivationMode {
    /**
     * Specifies explicit activation.
     */
    ExplicitActivation,
    /**
     * Specifies activation when the page is opened.
     */
    PageOpen,
    /**
     * Specifies activation when the page becomes visible.
     */
    PageVisible
}
/**
 * Defines the deactivation modes available for rich media annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a rich media annotation
 * let annotation: PdfRichMediaAnnotation = new PdfRichMediaAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the deactivation mode
 * annotation.deactivationMode = PdfRichMediaDeactivationMode.PageInvisible;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRichMediaDeactivationMode {
    /**
     * Specifies explicit deactivation.
     */
    ExplicitDeactivation,
    /**
     * Specifies deactivation when the page is closed.
     */
    PageClose,
    /**
     * Specifies deactivation when the page becomes invisible.
     */
    PageInvisible
}
/**
 * Defines the presentation styles available for rich media annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a rich media annotation
 * let annotation: PdfRichMediaAnnotation = new PdfRichMediaAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the presentation style
 * annotation.presentationStyle = PdfRichMediaPresentationStyle.Windowed;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfRichMediaPresentationStyle {
    /**
     * Specifies embedded presentation.
     */
    Embedded,
    /**
     * Specifies windowed presentation.
     */
    Windowed
}
/**
 * Defines the playback modes available for movie annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a movie annotation
 * let annotation: PdfMovieAnnotation = new PdfMovieAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the playback mode
 * annotation.playMode = PdfMoviePlayMode.Repeat;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfMoviePlayMode {
    /**
     * Specifies single playback.
     */
    Once,
    /**
     * Specifies playback when the movie is opened.
     */
    Open,
    /**
     * Specifies repeated playback.
     */
    Repeat,
    /**
     * Specifies palindrome playback.
     */
    Palindrome
}
/**
 * Defines the highlight modes available for screen annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a screen annotation
 * let annotation: PdfScreenAnnotation = new PdfScreenAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the highlight mode
 * annotation.highlightMode = PdfScreenAnnotationHighlightMode.Push;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfScreenAnnotationHighlightMode {
    /**
     * Specifies no highlight effect.
     */
    None,
    /**
     * Specifies inversion of the annotation rectangle.
     */
    Invert,
    /**
     * Specifies inversion of the annotation border.
     */
    Outline,
    /**
     * Specifies a pushed appearance effect.
     */
    Push
}
/**
 * Defines the activation triggers available for screen annotations.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access the first page
 * let page: PdfPage = document.getPage(0) as PdfPage;
 * // Create a screen annotation
 * let annotation: PdfScreenAnnotation = new PdfScreenAnnotation(
 *     { x: 50, y: 50, width: 200, height: 150 }
 * );
 * // Set the activation trigger
 * annotation.trigger = PdfScreenAnnotationTrigger.MouseUp;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfScreenAnnotationTrigger {
    /**
     * Specifies activation on mouse-button down.
     */
    MouseDown,
    /**
     * Specifies activation on mouse-button up.
     */
    MouseUp,
    /**
     * Specifies activation when the pointer enters the annotation area.
     */
    MouseEnter,
    /**
     * Specifies activation when the pointer leaves the annotation area.
     */
    MouseExit
}

/**
 * Specifies the supported shape types.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page
 * let page: PdfPage = document.addPage();
 * // Create a shape element
 * let element: PdfShapeElement = { shape: { type: PdfShapeType.Rectangle, bounds: { x: 20, y: 20, width: 200, height: 1000 } },
 *                                  brush: new PdfBrush({ r: 255, g: 0, b: 0 }),
 *                                  layoutFormat: { layoutType: PdfLayoutType.paginate, breakType: PdfLayoutBreakType.fitPage } };
 * // Draw the shape element
 * page.drawShapeElement(element);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfShapeType {
    /**
     * Specifies a line shape.
     */
    Line,
    /**
     * Specifies a Bezier curve shape.
     */
    BezierCurve,
    /**
     * Specifies an arc shape.
     */
    Arc,
    /**
     * Specifies a rectangle shape.
     */
    Rectangle,
    /**
     * Specifies an ellipse shape.
     */
    Ellipse,
    /**
     * Specifies a pie shape.
     */
    Pie,
    /**
     * Specifies a polygon shape.
     */
    Polygon,
    /**
     * Specifies a path shape.
     */
    Path,
    /**
     * Specifies a rounded rectangle shape.
     */
    RoundedRectangle
}
/**
 * OpenType layout script tags supported by the shaping engine.
 *
 * @private
 */
export enum _OtfScriptTag {
    /** Arabic script tag. */
    arabic = 'arab',
    /** Bengali version-2 script tag. */
    bengali2 = 'bng2',
    /** Devanagari version-2 script tag. */
    devanagari2 = 'dev2',
    /** Gujarati version-2 script tag. */
    gujarati2 = 'gjr2',
    /** Gurmukhi version-2 script tag. */
    gurmukhi2 = 'gur2',
    /** Kannada version-2 script tag. */
    kannada2 = 'knd2',
    /** Malayalam version-2 script tag. */
    malayalam2 = 'mlm2',
    /** Oriya version-2 script tag. */
    oriya2 = 'ory2',
    /** Tamil version-2 script tag. */
    tamil2 = 'tml2',
    /** Telugu version-2 script tag. */
    telugu2 = 'tel2',
    /** Thai script tag. */
    thai = 'thai',
    /** Khmer script tag. */
    khmer = 'khmr'
}
/**
 * Extended script classification used by detection; maps to `_OtfScriptTag`.
 *
 * @private
 */
export enum _OtfScript {
    /** No significant script detected. */
    unknown = 0,
    /** Arabic script. */
    arabic = 1,
    /** Hebrew script (RTL layout through the legacy bidi path). */
    hebrew = 2,
    /** Bengali script. */
    bengali = 3,
    /** Devanagari script. */
    devanagari = 4,
    /** Gujarati script. */
    gujarati = 5,
    /** Gurmukhi script. */
    gurmukhi = 6,
    /** Kannada script. */
    kannada = 7,
    /** Malayalam script. */
    malayalam = 8,
    /** Oriya script. */
    oriya = 9,
    /** Tamil script. */
    tamil = 10,
    /** Telugu script. */
    telugu = 11,
    /** Thai script. */
    thai = 12,
    /** Khmer script. */
    khmer = 13
}
