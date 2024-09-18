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
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Create a new brush
 * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
 * // Add path points
 * let pathPoints: Array<number[]> = [[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]];
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
 * Enum for PDF loaded annotation type.
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
     * Specifies the intent of `null`.
     */
    null
}
/**
 * Enum for PDF graphics unit.
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
export enum _SignatureFlag {
    none = 0,
    signatureExists = 1,
    appendOnly = 2
}
export enum _PdfCheckFieldState {
    unchecked,
    checked,
    pressedUnchecked,
    pressedChecked
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
 * page.graphics.drawString('Hello World مرحبا بالعالم', font, [10, 20, 300, 200], undefined, new PdfBrush([0, 0, 255]), format);
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
 * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
 * // Create a new PDF string format
 * let format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.right);
 * // Set a new paragraph indent
 * format.paragraphIndent = 20;
 * // Set the subscript or superscript mode
 * format.subSuperScript = PdfSubSuperScript.subScript;
 * // Draw the text
 * page.graphics.drawString('Helvetica', font, [0, 180, page.size[0], 40], undefined, new PdfBrush([0, 0, 255]), format);
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
 * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.symbol, 10);
 * // Set the blend mode
 * graphics.setTransparency(0.5, 0.5, PdfBlendMode.hardLight);
 * // Draw the text
 * graphics.drawString('Hello World', font, null, new PointF(10, 10));
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
 * let font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.symbol, 10);
 * // Set the fill mode
 * graphics.setClip([0, 0, 100, 100], PdfFillMode.winding);
 * // Draw the text
 * graphics.drawString('Hello World', font, null, new PointF(10, 10));
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
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Draw a rectangle using pen
 * graphics.drawRectangle(150, 50, 50, 50, pen);
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
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Set the line cap
 * pen._lineCap = PdfLineCap.round;
 * // Draw a rectangle using pen
 * graphics.drawRectangle(150, 50, 50, 50, pen);
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
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Set the dash style
 * pen._dashStyle = PdfDashStyle.dashDot;
 * // Set the line join
 * pen._lineJoin = PdfLineJoin.bevel;
 * // Draw a rectangle using pen
 * graphics.drawRectangle(150, 50, 50, 50, pen);
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
export enum _FontDescriptorFlag {
    fixedPitch = 1,
    serif = 2,
    symbolic = 4,
    script = 8,
    nonSymbolic = 32,
    italic = 64,
    forceBold = 0x40000
}
export enum _TrueTypeCmapFormat {
    apple = 0,
    microsoft = 4,
    trimmed = 6
}
export enum _TrueTypeCmapEncoding {
    unknown = 0,
    symbol = 1,
    unicode = 2,
    macintosh = 3
}
export enum _TrueTypePlatformID {
    appleUnicode = 0,
    macintosh = 1,
    iSO = 2,
    microsoft = 3
}
export enum _TrueTypeMicrosoftEncodingID {
    undefined = 0,
    unicode = 1
}
export enum _TrueTypeMacintoshEncodingID {
    roman = 0,
    japanese = 1,
    chinese = 2
}
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
export enum _PdfColorSpace {
    rgb,
    cmyk,
    grayScale,
    indexed
}
/**
 * Public enum type to represent the ordered list style
 * ````typescript
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
 * list.draw(page, 0, 20, 500, 700);
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
 * list.draw(page, 0, 20, 500, 700);
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
 * list.draw(page, 0, 20, 500, 700, pageLayout);
 * // Get the layout type used to draw the list
 * let layoutType: PdfLayoutType = pageLayout.layout;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ````
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
 * // Set  the layout break type for drawing
 * pageLayout.break = PdfLayoutBreakType.fitPage;
 * // Draw the list associated with items along with layout
 * list.draw(page, 0, 20, 500, 700, pageLayout);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ````
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
 * ````typescript
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
 * list.draw(page, 0, 20, 500, 700);
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
