import { PdfAngleMeasurementAnnotation, PdfAnnotationBorder, PdfAnnotationCaption, PdfAnnotationLineEndingStyle, PdfAttachmentAnnotation, PdfCircleAnnotation, PdfDocumentLinkAnnotation, PdfEllipseAnnotation, PdfFileLinkAnnotation, PdfFreeTextAnnotation, PdfInkAnnotation, PdfLineAnnotation, PdfPolygonAnnotation, PdfPolyLineAnnotation, PdfPopupAnnotation, PdfRectangleAnnotation, PdfRedactionAnnotation, PdfRubberStampAnnotation, PdfSquareAnnotation, PdfTextMarkupAnnotation, PdfTextWebLinkAnnotation, PdfUriAnnotation, PdfWatermarkAnnotation } from "../../src/pdf/core/annotations/annotation";
import { _PdfContentStream, _PdfStream } from "../../src/pdf/core/base-stream";
import { _ContentParser, _PdfRecord } from "../../src/pdf/core/content-parser";
import { DataFormat, PdfAnnotationFlag, PdfAnnotationIntent, PdfAnnotationState, PdfAnnotationStateModel, PdfAttachmentIcon, PdfBorderEffectStyle, PdfBorderStyle, PdfCircleMeasurementType, PdfCrossReferenceType, PdfDestinationMode, PdfLineCaptionType, PdfLineEndingStyle, PdfLineIntent, PdfMeasurementUnit, PdfPopupIcon, PdfRotationAngle, PdfRubberStampAnnotationIcon, PdfTextAlignment, PdfTextMarkupAnnotationType } from "../../src/pdf/core/enumerator";
import { PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfTrueTypeFont } from "../../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat, PdfVerticalAlignment } from "../../src/pdf/core/fonts/pdf-string-format";
import { PdfBitmap } from "../../src/pdf/core/graphics/images/pdf-bitmap";
import { PdfImage } from "../../src/pdf/core/graphics/images/pdf-image";
import { PdfLayer } from "../../src/pdf/core/layers/layer";
import { PdfLayerCollection } from "../../src/pdf/core/layers/layer-collection";
import { PdfAnnotationExportSettings, PdfDocument } from "../../src/pdf/core/pdf-document";
import { PdfDestination, PdfPage } from "../../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfReference } from "../../src/pdf/core/pdf-primitives";
import { Size } from "../../src/pdf/core/pdf-type";
import { _bytesToString } from "../../src/pdf/core/utils";
import { ttfArialBase64 } from "../font-input.spec";
import { natureImageBase64 } from "../image-input.spec";
describe('PdfDocument Creation Annotation Test', () => {
 it('Annotation Creation - Properties', () => {
        let document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        const page = document.addPage();
        const lineAnnot: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 40 }, { x: 250, y: 40 });
        lineAnnot.author = 'Syncfusion';
        lineAnnot.bounds = { x: 100, y: 200, width: 150, height: 250 };
        lineAnnot.border.width = 4;
        lineAnnot.border.hRadius = 10;
        lineAnnot.border.vRadius = 15;
        lineAnnot.border.style = PdfBorderStyle.beveled;
        lineAnnot.caption.cap = true;
        lineAnnot.caption.type = PdfLineCaptionType.top;
        lineAnnot.caption.offset = { x: 1, y: 1 };
        lineAnnot.color = { r: 100, g: 255, b: 100 };
        lineAnnot.flags = PdfAnnotationFlag.print;
        lineAnnot.innerColor = { r: 200, g: 100, b: 100 };
        lineAnnot.leaderExt = 1;
        lineAnnot.leaderLine = 5;
        lineAnnot.lineEndingStyle.begin = PdfLineEndingStyle.circle;
        lineAnnot.lineEndingStyle.end = PdfLineEndingStyle.openArrow;
        lineAnnot.lineIntent = PdfLineIntent.lineDimension;
        lineAnnot.name = 'Line Annotation';
        lineAnnot.opacity = 0.5;
        lineAnnot.subject = 'Annotation';
        lineAnnot.text = 'Line Annotation Test';
        expect(lineAnnot.author).toEqual('Syncfusion');
        expect(lineAnnot.bounds).toEqual({ x: 100, y: 200, width: 150, height: 250 });
        expect(lineAnnot.border.width).toEqual(4);
        expect(lineAnnot.border.hRadius).toEqual(10);
        expect(lineAnnot.border.vRadius).toEqual(15);
        expect(lineAnnot.border.style).toEqual(PdfBorderStyle.beveled);
        expect(lineAnnot.caption.cap).toEqual(true);
        expect(lineAnnot.caption.type).toEqual(PdfLineCaptionType.top);
        expect(lineAnnot.caption.offset).toEqual({ x: 1, y: 1 });
        expect(lineAnnot.flags).toEqual(PdfAnnotationFlag.print);
        expect(lineAnnot.color).toEqual({ r: 100, g: 255, b: 100 });
        expect(lineAnnot.innerColor).toEqual({ r: 200, g: 100, b: 100 });
        expect(lineAnnot.leaderExt).toEqual(1);
        expect(lineAnnot.leaderLine).toEqual(5);
        expect(lineAnnot.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnot.lineEndingStyle.end).toEqual(PdfLineEndingStyle.openArrow);
        expect(lineAnnot.lineIntent).toEqual(PdfLineIntent.lineDimension);
        expect(lineAnnot.name).toEqual('Line Annotation');
        expect(lineAnnot.opacity).toEqual(0.5);
        expect(lineAnnot.subject).toEqual('Annotation');
        expect(lineAnnot.text).toEqual('Line Annotation Test');
        page.annotations.add(lineAnnot);
        let annot2: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 250, y: 10, width: 100, height: 100 });
        annot2.author = 'Syncfusion';
        annot2.border.style = PdfBorderStyle.dashed;
        annot2.border.width = 2;
        annot2.border.dash = [1, 1];
        annot2.bounds = { x: 100, y: 100, width: 100, height: 100 };
        annot2.color = { r: 255, g: 0, b: 255 };
        annot2.flags = PdfAnnotationFlag.print;
        annot2.rotationAngle = PdfRotationAngle.angle0;
        annot2.innerColor = { r: 0, g: 0, b: 255 };
        annot2.name = 'Circle annotation';
        annot2.opacity = 0.7;
        annot2.subject = 'annotation';
        annot2.text = 'Circle';
        expect(annot2.author).toEqual('Syncfusion');
        expect(annot2.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot2.border.width).toEqual(2);
        expect(annot2.border.dash).toEqual([1, 1]);
        expect(annot2.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot2.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot2.bounds).toEqual({ x: 100, y: 100, width: 100, height: 100 });
        expect(annot2.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot2.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot2.name).toEqual('Circle annotation');
        expect(annot2.opacity).toEqual(0.7);
        expect(annot2.subject).toEqual('annotation');
        expect(annot2.text).toEqual('Circle');
        page.annotations.add(annot2);
        let annot3: PdfEllipseAnnotation = new PdfEllipseAnnotation({ x: 10, y: 70, width: 100, height: 50 });
        annot3.author = 'Syncfusion';
        annot3.border.style = PdfBorderStyle.dashed;
        annot3.border.width = 2;
        annot3.border.dash = [1, 1];
        annot3.flags = PdfAnnotationFlag.print;
        annot3.rotationAngle = PdfRotationAngle.angle0;
        annot3.bounds = { x: 0, y: 0, width: 100, height: 200 };
        annot3.color = { r: 255, g: 0, b: 255 };
        annot3.innerColor = { r: 0, g: 0, b: 255 };
        annot3.name = 'Ellipse annotation';
        annot3.opacity = 0.7;
        annot3.subject = 'annotation';
        annot3.text = 'Ellipse';
        expect(annot3.author).toEqual('Syncfusion');
        expect(annot3.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot3.border.width).toEqual(2);
        expect(annot3.border.dash).toEqual([1, 1]);
        expect(annot3.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot3.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot3.bounds).toEqual({ x: 0, y: 0, width: 100, height: 200 });
        expect(annot3.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot3.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot3.name).toEqual('Ellipse annotation');
        expect(annot3.opacity).toEqual(0.7);
        expect(annot3.subject).toEqual('annotation');
        expect(annot3.text).toEqual('Ellipse');
        page.annotations.add(annot3);
        let annot4: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 10, y: 50, width: 100, height: 100 });
        annot4.author = 'Syncfusion';
        annot4.border.width = 2;
        annot4.border.dash = [1, 1];
        annot4.bounds = { x: 100, y: 100, width: 100, height: 100 };
        annot4.color = { r: 255, g: 0, b: 255 };
        annot4.innerColor = { r: 0, g: 0, b: 255 };
        annot4.flags = PdfAnnotationFlag.print;
        annot4.rotationAngle = PdfRotationAngle.angle0;
        annot4.name = 'Square annotation';
        annot4.opacity = 0.7;
        annot4.subject = 'annotation';
        annot4.text = 'Square';
        annot4.borderEffect.intensity = 2;
        annot4.borderEffect.style = PdfBorderEffectStyle.cloudy;
        expect(annot4.author).toEqual('Syncfusion');
        expect(annot4.border.width).toEqual(2);
        expect(annot4.border.dash).toEqual([1, 1]);
        expect(annot4.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot4.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot4.bounds).toEqual({ x: 100, y: 100, width: 100, height: 100 });
        expect(annot4.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot4.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot4.name).toEqual('Square annotation');
        expect(annot4.opacity).toEqual(0.7);
        expect(annot4.subject).toEqual('annotation');
        expect(annot4.text).toEqual('Square');
        expect(annot4.borderEffect.intensity).toEqual(2);
        expect(annot4.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        page.annotations.add(annot4);
        let annot5: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 10, y: 10, width: 100, height: 50 });
        annot5.author = 'Syncfusion';
        annot5.flags = PdfAnnotationFlag.print;
        annot5.border.width = 2;
        annot5.border.dash = [1, 1];
        annot5.borderEffect.style = PdfBorderEffectStyle.cloudy;
        annot5.borderEffect.intensity = 2;
        annot5.bounds = { x: 100, y: 200, width: 100, height: 200 };
        annot5.color = { r: 255, g: 0, b: 255 };
        annot5.innerColor = { r: 0, g: 0, b: 255 };
        annot5.name = 'Rectangle annotation';
        annot5.opacity = 0.7;
        annot5.subject = 'annotation';
        annot5.text = 'Rectangle';
        annot5.rotationAngle = PdfRotationAngle.angle0;
        expect(annot5.author).toEqual('Syncfusion');
        expect(annot5.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot5.border.width).toEqual(2);
        expect(annot5.border.dash).toEqual([1, 1]);
        expect(annot5.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        expect(annot5.borderEffect.intensity).toEqual(2);
        expect(annot5.bounds).toEqual({ x: 100, y: 200, width: 100, height: 200 });
        expect(annot5.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot5.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot5.name).toEqual('Rectangle annotation');
        expect(annot5.opacity).toEqual(0.7);
        expect(annot5.subject).toEqual('annotation');
        expect(annot5.text).toEqual('Rectangle');
        page.annotations.add(annot5);
        let annot6: PdfPolygonAnnotation = new PdfPolygonAnnotation([{ x: 100, y: 300 }, { x: 150, y: 200 }, { x: 300, y: 200 }, { x: 350, y: 300 }, { x: 300, y: 400 }, { x: 150, y: 400 }]);
        annot6.author = 'Syncfusion';
        annot6.border.width = 2;
        annot6.border.style = PdfBorderStyle.dashed;
        annot6.flags = PdfAnnotationFlag.print;
        annot6.border.dash = [1, 1];
        annot6.borderEffect.intensity = 1;
        annot6.borderEffect.style = PdfBorderEffectStyle.cloudy;
        annot6.bounds = { x: 100, y: 150, width: 200, height: 100 };
        annot6.color = { r: 255, g: 255, b: 0 };
        annot6.innerColor = { r: 0, g: 0, b: 255 };
        annot6.lineExtension = 2;
        annot6.name = 'Poly annot';
        annot6.opacity = 0.5;
        annot6.rotationAngle = PdfRotationAngle.angle0;
        annot6.subject = 'annotation';
        annot6.text = 'Polygon';
        expect(annot6.author).toEqual('Syncfusion');
        expect(annot6.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot6.border.width).toEqual(2);
        expect(annot6.border.dash).toEqual([1, 1]);
        expect(annot6.borderEffect.intensity).toEqual(1);
        expect(annot6.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        expect(annot6.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot6.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot6.lineExtension).toEqual(2);
        expect(annot6.name).toEqual('Poly annot');
        expect(annot6.opacity).toEqual(0.5);
        expect(annot6.subject).toEqual('annotation');
        expect(annot6.text).toEqual('Polygon');
        expect(annot6.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot6.flags).toEqual(PdfAnnotationFlag.print);
        page.annotations.add(annot6);
        let annot7: PdfPolyLineAnnotation = new PdfPolyLineAnnotation([{ x: 300, y: 150 }, { x: 350, y: 50 }, { x: 500, y: 50 }, { x: 550, y: 150 }, { x: 500, y: 250 }]);
        annot7.author = 'Syncfusion';
        annot7.beginLineStyle = PdfLineEndingStyle.circle;
        annot7.border.width = 2;
        annot7.border.style = PdfBorderStyle.beveled;
        annot7.border.dash = [1, 1];
        annot7.bounds = { x: 0, y: 0, width: 300, height: 400 };
        annot7.color = { r: 0, g: 255, b: 255 };
        annot7.endLineStyle = PdfLineEndingStyle.openArrow;
        annot7.innerColor = { r: 255, g: 255, b: 255 };
        annot7.lineExtension = 2;
        annot7.name = 'PolyLine annotation';
        annot7.opacity = 0.5;
        annot7.rotationAngle = PdfRotationAngle.angle0;
        annot7.subject = 'annotation';
        annot7.text = 'PolyLine';
        annot7.flags = PdfAnnotationFlag.noZoom;
        expect(annot7.flags).toEqual(PdfAnnotationFlag.noZoom);
        expect(annot7.author).toEqual('Syncfusion');
        expect(annot7.beginLineStyle).toEqual(PdfLineEndingStyle.circle);
        expect(annot7.border.width).toEqual(2);
        expect(annot7.border.style).toEqual(PdfBorderStyle.beveled);
        expect(annot7.border.dash).toEqual([1, 1]);
        expect(annot7.bounds).toEqual({ x: 0, y: 0, width: 300, height: 400 });
        expect(annot7.color).toEqual({ r: 0, g: 255, b: 255 });
        expect(annot7.endLineStyle).toEqual(PdfLineEndingStyle.openArrow);
        expect(annot7.innerColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(annot7.lineExtension).toEqual(2);
        expect(annot7.name).toEqual('PolyLine annotation');
        expect(annot7.opacity).toEqual(0.5);
        expect(annot7.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot7.subject).toEqual('annotation');
        expect(annot7.text).toEqual('PolyLine');
        page.annotations.add(annot7);
        let annot8: PdfInkAnnotation = new PdfInkAnnotation({ x: 0, y: 0, width: 300, height: 400 }, [{ x: 40, y: 300 }, { x: 60, y: 100 }, { x: 40, y: 50 }, { x: 40, y: 300 }]);
        annot8.author = 'Syncfusion';
        annot8.border.width = 2;
        annot8.border.hRadius = 15;
        annot8.border.vRadius = 15;
        annot8.border.dash = [1, 2];
        annot8.border.style = PdfBorderStyle.beveled;
        annot8.color = { r: 0, g: 100, b: 100 };
        annot8.innerColor = { r: 0, g: 255, b: 255 };
        annot8.name = 'Ink annotation';
        annot8.rotationAngle = PdfRotationAngle.angle0;
        annot8.subject = 'annotation';
        annot8.text = 'Ink';
        annot8.opacity = 0.5;
        annot8.flags = PdfAnnotationFlag.locked;
        expect(annot8.author).toEqual('Syncfusion');
        expect(annot8.border.width).toEqual(2);
        expect(annot8.border.hRadius).toEqual(15);
        expect(annot8.border.vRadius).toEqual(15);
        expect(annot8.border.dash).toEqual([1, 2]);
        expect(annot8.border.style).toEqual(PdfBorderStyle.beveled);
        expect(annot8.color).toEqual({ r: 0, g: 100, b: 100 });
        expect(annot8.innerColor).toEqual({ r: 0, g: 255, b: 255 });
        expect(annot8.name).toEqual('Ink annotation');
        expect(annot8.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot8.subject).toEqual('annotation');
        expect(annot8.text).toEqual('Ink');
        expect(annot8.flags).toEqual(PdfAnnotationFlag.locked);
        expect(annot8.opacity).toEqual(0.5);
        page.annotations.add(annot8);
        let annot9: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation({ x: 100, y: 500 }, { x: 150, y: 450 }, { x: 100, y: 400 });
        annot9.author = 'Syncfusion';
        annot9.border.width = 2;
        annot9.border.style = PdfBorderStyle.beveled;
        annot9.border.dash = [1, 1];
        annot9.color = { r: 255, g: 255, b: 255 };
        annot9.innerColor = { r: 0, g: 0, b: 255 };
        annot9.bounds = { x: 150, y: 250, width: 300, height: 450 };
        annot9.name = 'Angle Measurement annotation';
        annot9.rotationAngle = PdfRotationAngle.angle90;
        annot9.subject = 'annotation';
        annot9.text = 'Angle';
        annot9.opacity = 0.5;
        annot9.flags = PdfAnnotationFlag.print;
        expect(annot9.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot9.author).toEqual('Syncfusion');
        expect(annot9.border.width).toEqual(2);
        expect(annot9.border.style).toEqual(PdfBorderStyle.beveled);
        expect(annot9.border.dash).toEqual([1, 1]);
        expect(annot9.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(annot9.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot9.name).toEqual('Angle Measurement annotation');
        expect(annot9.rotationAngle).toEqual(PdfRotationAngle.angle90);
        expect(annot9.bounds).toEqual({ x: 150, y: 250, width: 300, height: 450 });
        expect(annot9.subject).toEqual('annotation');
        expect(annot9.text).toEqual('Angle');
        expect(annot9.opacity).toEqual(0.5);
        page.annotations.add(annot9);
        let annot10: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', { x: 200, y: 60, width: 30, height: 30 });
        annot10.flags = PdfAnnotationFlag.noRotate;
        annot10.author = 'Syncfusion';
        annot10.border.width = 2;
        annot10.border.hRadius = 10;
        annot10.border.vRadius = 15;
        annot10.bounds = { x: 100, y: 150, width: 200, height: 250 };
        annot10.color = { r: 50, g: 50, b: 60 };
        annot10.icon = PdfPopupIcon.newParagraph;
        annot10.innerColor = { r: 255, g: 80, b: 80 };
        annot10.name = 'Popup annotation';
        annot10.open = true;
        annot10.opacity = 0.6;
        annot10.rotationAngle = PdfRotationAngle.angle0;
        annot10.state = PdfAnnotationState.completed;
        annot10.stateModel = PdfAnnotationStateModel.marked;
        annot10.subject = 'annotation';
        annot10.text = 'Popup';
        expect(annot10.flags).toEqual(PdfAnnotationFlag.noRotate);
        expect(annot10.author).toEqual('Syncfusion');
        expect(annot10.border.width).toEqual(2);
        expect(annot10.border.hRadius).toEqual(10);
        expect(annot10.border.vRadius).toEqual(15);
        expect(annot10.color).toEqual({ r: 50, g: 50, b: 60 });
        expect(annot10.innerColor).toEqual({ r: 255, g: 80, b: 80 });
        expect(annot10.name).toEqual('Popup annotation');
        expect(annot10.open).toEqual(true);
        expect(annot10.opacity).toEqual(0.6);
        expect(annot10.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot10.state).toEqual(PdfAnnotationState.completed);
        expect(annot10.stateModel).toEqual(PdfAnnotationStateModel.marked);
        expect(annot10.subject).toEqual('annotation');
        expect(annot10.text).toEqual('Popup');
        page.annotations.add(annot10);
        let annot11: PdfFileLinkAnnotation = new PdfFileLinkAnnotation({ x: 400, y: 30, width: 30, height: 30 }, "D:/filelink.png");
        annot11.action = "app.alert(\"You are looking at Java script action of PDF \")";
        annot11.flags = PdfAnnotationFlag.noZoom;
        annot11.author = 'Syncfusion';
        annot11.border.width = 3;
        annot11.border.hRadius = 5;
        annot11.border.vRadius = 10;
        annot11.bounds = { x: 100, y: 150, width: 200, height: 200 };
        annot11.color = { r: 255, g: 0, b: 255 };
        annot11.innerColor = { r: 90, g: 100, b: 150 };
        annot11.name = 'FileLink annotation';
        annot11.opacity = 0.45;
        annot11.rotationAngle = PdfRotationAngle.angle0;
        annot11.subject = 'annotation';
        annot11.text = 'FileLink creation';
        expect(annot11.action).toEqual("app.alert(\"You are looking at Java script action of PDF \")");
        expect(annot11.author).toEqual('Syncfusion');
        expect(annot11.border.width).toEqual(3);
        expect(annot11.border.hRadius).toEqual(5);
        expect(annot11.border.vRadius).toEqual(10);
        expect(annot11.bounds).toEqual({ x: 100, y: 150, width: 200, height: 200 });
        expect(annot11.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot11.innerColor).toEqual({ r: 90, g: 100, b: 150 });
        expect(annot11.name).toEqual('FileLink annotation');
        expect(annot11.opacity).toEqual(0.45);
        expect(annot11.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot11.subject).toEqual('annotation');
        expect(annot11.text).toEqual('FileLink creation');
        page.annotations.add(annot11);
        let annot12: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation({ x: 250, y: 250, width: 40, height: 60 });
        annot12.flags = PdfAnnotationFlag.noRotate;
        annot12.destination = new PdfDestination(page);
        annot12.destination.location = { x: 10, y: 0 };
        annot12.destination.zoom = 5;
        annot12.author = 'Syncfusion';
        annot12.border.width = 2;
        annot12.border.style = PdfBorderStyle.dashed;
        annot12.border.dash = [1, 1];
        annot12.bounds = { x: 100, y: 150, width: 40, height: 60 };
        annot12.color = { r: 255, g: 255, b: 0 };
        annot12.innerColor = { r: 0, g: 0, b: 255 };
        annot12.name = 'DocumentLink annot';
        annot12.opacity = 0.5;
        annot12.rotationAngle = PdfRotationAngle.angle0;
        annot12.subject = 'annotation';
        annot12.text = 'DocumentLink';
        expect(annot12.destination.location).toEqual({ x: 10, y: 0 });
        expect(annot12.destination.zoom).toEqual(5);
        expect(annot12.flags).toEqual(PdfAnnotationFlag.noRotate);
        expect(annot12.border.width).toEqual(2);
        expect(annot12.author).toEqual('Syncfusion');
        expect(annot12.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot12.border.width).toEqual(2);
        expect(annot12.border.dash).toEqual([1, 1]);
        expect(annot12.bounds).toEqual({ x: 100, y: 150, width: 40, height: 60 });
        expect(annot12.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot12.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot12.name).toEqual('DocumentLink annot');
        expect(annot12.opacity).toEqual(0.5);
        expect(annot12.subject).toEqual('annotation');
        expect(annot12.text).toEqual('DocumentLink');
        expect(annot12.rotationAngle).toEqual(PdfRotationAngle.angle0);
        page.annotations.add(annot12);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        let text: string = "Syncfusion Site";
        let size: Size = font.measureString(text, { width: 0, height: 0 }, format, 0, 0);
        let annot13: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation({ x: 170, y: 100, width: size.width, height: size.height }, { r: 0, g: 0, b: 0 }, { r: 165, g: 42, b: 42 }, 1, { text: text });
        annot13.url = "http://www.syncfusion.com";
        annot13.font = font;
        annot13.name = 'Textweblink Annotation';
        annot13.text = 'Textweblink Annotation1';
        annot13.author = 'Syncfusion';
        annot13.border.width = 2;
        annot13.flags = PdfAnnotationFlag.print;
        annot13.border.style = PdfBorderStyle.dashed;
        annot13.border.dash = [1, 1];
        annot13.color = { r: 255, g: 255, b: 0 };
        annot13.innerColor = { r: 0, g: 0, b: 255 };
        annot13.name = 'TextWebLink annot';
        annot13.opacity = 0.5;
        annot13.rotationAngle = PdfRotationAngle.angle0;
        annot13.subject = 'annotation';
        annot13.text = 'TextWebLink';
        expect(annot13.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot13.url).toEqual('http://www.syncfusion.com');
        expect(annot13.author).toEqual('Syncfusion');
        expect(annot13.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot13.border.width).toEqual(2);
        expect(annot13.border.dash).toEqual([1, 1]);
        expect(annot13.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot13.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot13.name).toEqual('TextWebLink annot');
        expect(annot13.opacity).toEqual(0.5);
        expect(annot13.subject).toEqual('annotation');
        expect(annot13.text).toEqual('TextWebLink');
        expect(annot13.rotationAngle).toEqual(PdfRotationAngle.angle0);
        page.annotations.add(annot13);
        let annot14: PdfUriAnnotation = new PdfUriAnnotation({ x: 330, y: 250, width: 30, height: 30 }, "http://www.google.com");
        annot14.author = 'Syncfusion';
        annot14.border.width = 2;
        annot14.border.style = PdfBorderStyle.dashed;
        annot14.border.dash = [1, 1];
        annot14.bounds = { x: 100, y: 150, width: 200, height: 100 };
        annot14.color = { r: 255, g: 255, b: 0 };
        annot14.innerColor = { r: 0, g: 0, b: 255 };
        annot14.name = 'Uri annot';
        annot14.opacity = 0.5;
        annot14.rotationAngle = PdfRotationAngle.angle0;
        annot14.subject = 'annotation';
        annot14.text = 'Uri';
        annot14.border.hRadius = 5;
        annot14.border.vRadius = 5;
        annot14.flags = PdfAnnotationFlag.print;
        expect(annot14.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot14.border.hRadius).toEqual(5);
        expect(annot14.border.vRadius).toEqual(5);
        expect(annot14.author).toEqual('Syncfusion');
        expect(annot14.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot14.border.width).toEqual(2);
        expect(annot14.border.dash).toEqual([1, 1]);
        expect(annot14.bounds).toEqual({ x: 100, y: 150, width: 200, height: 100 });
        expect(annot14.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot14.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot14.name).toEqual('Uri annot');
        expect(annot14.opacity).toEqual(0.5);
        expect(annot14.subject).toEqual('annotation');
        expect(annot14.text).toEqual('Uri');
        expect(annot14.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot14.uri).toEqual("http://www.google.com");
        page.annotations.add(annot14);
        let annot15: PdfAttachmentAnnotation = new PdfAttachmentAnnotation({ x: 350, y: 170, width: 30, height: 30 }, "Nature.jpg", natureImageBase64);
        annot15.icon = PdfAttachmentIcon.pushPin;
        annot15.author = 'Syncfusion';
        annot15.border.width = 2;
        annot15.border.style = PdfBorderStyle.dashed;
        annot15.border.dash = [1, 1];
        annot15.bounds = { x: 100, y: 150, width: 200, height: 100 };
        annot15.color = { r: 255, g: 255, b: 0 };
        annot15.innerColor = { r: 0, g: 0, b: 255 };
        annot15.name = 'Attachment annot';
        annot15.opacity = 0.5;
        annot15.rotationAngle = PdfRotationAngle.angle0;
        annot15.subject = 'annotation';
        annot15.text = 'Attachment';
        expect(annot15.icon).toEqual(PdfAttachmentIcon.pushPin);
        expect(annot15.author).toEqual('Syncfusion');
        expect(annot15.border.style).toEqual(PdfBorderStyle.dashed);
        expect(annot15.border.width).toEqual(2);
        expect(annot15.border.dash).toEqual([1, 1]);
        expect(annot15.bounds).toEqual({ x: 100, y: 150, width: 200, height: 100 });
        expect(annot15.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot15.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot15.name).toEqual('Attachment annot');
        expect(annot15.opacity).toEqual(0.5);
        expect(annot15.subject).toEqual('annotation');
        expect(annot15.text).toEqual('Attachment');
        expect(annot15.rotationAngle).toEqual(PdfRotationAngle.angle0);
        page.annotations.add(annot15);
        let annot16: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Text Markup', { x: 400, y: 70, width: 100, height: 100 });
        annot16.author = 'Syncfusion';
        annot16.flags = PdfAnnotationFlag.noZoom;
        annot16.border.width = 3;
        annot16.border.hRadius = 15;
        annot16.border.vRadius = 25;
        annot16.bounds = { x: 150, y: 250, width: 200, height: 300 };
        annot16.boundsCollection = [{ x: 200, y: 100, width: 60, height: 30 }, { x: 100, y: 400, width: 60, height: 30 }];
        annot16.color = { r: 200, g: 200, b: 200 };
        annot16.flattenPopups = false;
        annot16.innerColor = { r: 255, g: 255, b: 0 };
        annot16.name = 'TextMarkup';
        annot16.opacity = 0.56;
        annot16.rotationAngle = PdfRotationAngle.angle0;
        annot16.subject = 'annotation';
        annot16.text = 'TextMarkup annotation';
        annot16.textMarkupType = PdfTextMarkupAnnotationType.squiggly;
        annot16.textMarkUpColor = { r: 255, g: 255, b: 255 };
        expect(annot16.author).toEqual('Syncfusion');
        expect(annot16.flags).toEqual(PdfAnnotationFlag.noZoom);
        expect(annot16.border.width).toEqual(3);
        expect(annot16.border.hRadius).toEqual(15);
        expect(annot16.border.vRadius).toEqual(25);
        expect(annot16.bounds).toEqual({ x: 150, y: 250, width: 200, height: 300 });
        expect(annot16.boundsCollection).toEqual([{ x: 200, y: 100, width: 60, height: 30 }, { x: 100, y: 400, width: 60, height: 30 }]);
        expect(annot16.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(annot16.flattenPopups).toEqual(false);
        expect(annot16.innerColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot16.name).toEqual('TextMarkup');
        expect(annot16.opacity).toEqual(0.56);
        expect(annot16.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot16.subject).toEqual('annotation');
        expect(annot16.textMarkupType).toEqual(PdfTextMarkupAnnotationType.squiggly);
        expect(annot16.textMarkUpColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(annot16.text).toEqual('TextMarkup annotation');
        page.annotations.add(annot16);
        let annot17: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Water Mark', { x: 90, y: 120, width: 100, height: 50 });
        annot17.author = 'Syncfusion';
        annot17.flags = PdfAnnotationFlag.print;
        annot17.border.width = 3;
        annot17.border.hRadius = 10;
        annot17.border.vRadius = 20;
        annot17.bounds = { x: 60, y: 150, width: 150, height: 60 };
        annot17.color = { r: 0, g: 0, b: 0 };
        annot17.flattenPopups = false;
        annot17.innerColor = { r: 100, g: 0, b: 0 };
        annot17.name = 'WaterMark annotation';
        annot17.opacity = 0.5;
        annot17.rotationAngle = PdfRotationAngle.angle0;
        annot17.subject = 'Annotation';
        annot17.text = 'Water Mark';
        annot17.setAppearance(true);
        expect(annot17.author).toEqual('Syncfusion');
        expect(annot17.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot17.border.width).toEqual(3);
        expect(annot17.border.hRadius).toEqual(10);
        expect(annot17.border.vRadius).toEqual(20);
        expect(annot17.bounds).toEqual({ x: 60, y: 150, width: 150, height: 60 });
        expect(annot17.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(annot17.flattenPopups).toEqual(false);
        expect(annot17.innerColor).toEqual({ r: 100, g: 0, b: 0 });
        expect(annot17.name).toEqual('WaterMark annotation');
        expect(annot17.opacity).toEqual(0.5);
        expect(annot17.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot17.subject).toEqual('Annotation');
        page.annotations.add(annot17);
        let annot18: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({ x: 150, y: 30, width: 80, height: 20 });
        annot18.author = 'Syncfusion';
        annot18.flags = PdfAnnotationFlag.print;
        annot18.border.width = 5;
        annot18.border.hRadius = 10;
        annot18.border.vRadius = 20;
        annot18.color = { r: 255, g: 255, b: 255 };
        annot18.flattenPopups = false;
        annot18.icon = PdfRubberStampAnnotationIcon.completed;
        annot18.innerColor = { r: 255, g: 0, b: 255 };
        annot18.name = 'Rubber annot18ation';
        annot18.opacity = 0.5;
        annot18.rotationAngle = PdfRotationAngle.angle0;
        annot18.subject = 'annot18ation';
        annot18.text = 'rubber';
        expect(annot18.author).toEqual('Syncfusion');
        expect(annot18.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot18.border.width).toEqual(5);
        expect(annot18.border.hRadius).toEqual(10);
        expect(annot18.border.vRadius).toEqual(20);
        expect(annot18.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(annot18.flattenPopups).toEqual(false);
        expect(annot18.icon).toEqual(PdfRubberStampAnnotationIcon.completed);
        expect(annot18.innerColor).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot18.name).toEqual('Rubber annot18ation');
        expect(annot18.opacity).toEqual(0.5);
        expect(annot18.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot18.subject).toEqual('annot18ation');
        expect(annot18.text).toEqual('rubber');
        page.annotations.add(annot18);
        let annot19: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 120, y: 300, width: 100, height: 50 });
        annot19.annotationIntent = PdfAnnotationIntent.freeTextTypeWriter;
        annot19.flags = PdfAnnotationFlag.print;
        annot19.author = 'Syncfusion';
        annot19.borderColor = { r: 255, g: 255, b: 0 };
        annot19.border.width = 3;
        annot19.border.hRadius = 10;
        annot19.border.vRadius = 20;
        annot19.bounds = { x: 100, y: 100, width: 200, height: 250 };
        annot19.calloutLines = [{ x: 100, y: 450 }, { x: 100, y: 200 }, { x: 100, y: 150 }];
        annot19.font = new PdfStandardFont(PdfFontFamily.helvetica, 7);
        annot19.lineEndingStyle = PdfLineEndingStyle.closedArrow;
        annot19.textAlignment = PdfTextAlignment.justify;
        annot19.textMarkUpColor = { r: 200, g: 200, b: 200 };
        annot19.color = { r: 0, g: 0, b: 0 };
        annot19.flattenPopups = false;
        annot19.innerColor = { r: 100, g: 0, b: 0 };
        annot19.name = 'FreeText annotation';
        annot19.opacity = 0.5;
        annot19.rotationAngle = PdfRotationAngle.angle0;
        annot19.subject = 'annotation';
        annot19.text = 'FreeText annot';
        expect(annot19.author).toEqual('Syncfusion');
        expect(annot19.borderColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(annot19.flags).toEqual(PdfAnnotationFlag.print);
        expect(annot19.border.width).toEqual(3);
        expect(annot19.border.hRadius).toEqual(10);
        expect(annot19.border.vRadius).toEqual(20);
        expect(annot19.bounds).toEqual({ x: 100, y: 100, width: 200, height: 250 });
        expect(annot19.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(annot19.calloutLines).toEqual([{ x: 100, y: 450 }, { x: 100, y: 200 }, { x: 100, y: 150 }]);
        expect(annot19.lineEndingStyle).toEqual(PdfLineEndingStyle.closedArrow);
        expect(annot19.textAlignment).toEqual(PdfTextAlignment.justify);
        expect(annot19.textMarkUpColor).toEqual({ r: 200, g: 200, b: 200 });
        expect(annot19.flattenPopups).toEqual(false);
        expect(annot19.innerColor).toEqual({ r: 100, g: 0, b: 0 });
        expect(annot19.name).toEqual('FreeText annotation');
        expect(annot19.opacity).toEqual(0.5);
        expect(annot19.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot19.subject).toEqual('annotation');
        expect(annot19.text).toEqual('FreeText annot');
        page.annotations.add(annot19);
        let annot20: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 450, y: 180, width: 70, height: 70 });
        annot20.flags = PdfAnnotationFlag.readOnly;
        annot20.author = 'Syncfusion';
        annot20.border.width = 2;
        annot20.border.style = PdfBorderStyle.underline;
        annot20.border.dash = [1, 1];
        annot20.borderColor = { r: 255, g: 0, b: 255 };
        annot20.color = { r: 0, g: 0, b: 255 };
        annot20.flattenPopups = false;
        annot20.font = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        annot20.innerColor = { r: 0, g: 0, b: 0 };
        annot20.name = 'Redaction';
        annot20.opacity = 0.9;
        annot20.overlayText = 'Redact';
        annot20.repeatText = true;
        annot20.rotationAngle = PdfRotationAngle.angle0;
        annot20.subject = 'annotation';
        annot20.text = 'Test';
        annot20.textAlignment = PdfTextAlignment.justify;
        annot20.textColor = { r: 255, g: 255, b: 255 };
        expect(annot20.flags).toEqual(PdfAnnotationFlag.readOnly);
        expect(annot20.author).toEqual('Syncfusion');
        expect(annot20.border.width).toEqual(2);
        expect(annot20.border.style).toEqual(PdfBorderStyle.underline);
        expect(annot20.border.dash).toEqual([1, 1]);
        expect(annot20.borderColor).toEqual({ r: 255, g: 0, b: 255 });
        expect(annot20.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot20.flattenPopups).toEqual(false);
        expect(annot20.innerColor).toEqual({ r: 0, g: 0, b: 0 });
        expect(annot20.name).toEqual('Redaction');
        expect(annot20.opacity).toEqual(0.9);
        expect(annot20.overlayText).toEqual('Redact');
        expect(annot20.repeatText).toEqual(true);
        expect(annot20.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot20.subject).toEqual('annotation');
        expect(annot20.text).toEqual('Test');
        expect(annot20.textAlignment).toEqual(PdfTextAlignment.justify);
        expect(annot20.textColor).toEqual({ r: 255, g: 255, b: 255 });
        page.annotations.add(annot20);
        let annot21: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 30 }, { x: 250, y: 30 });
        annot21.name = 'LineMeasure Annotation';
        annot21.text = 'LineMeasure Annotation1';
        annot21.measure = true;
        page.annotations.add(annot21);
        let annot22: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 250, y: 120, width: 100, height: 100 });
        annot22.name = 'CircleMeasure Annotation';
        annot22.text = 'CircleMeasure Annotation1';
        annot22.measure = true;
        page.annotations.add(annot22);
        let annot23: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        page.annotations.add(annot23);
        annot23.name = 'SqaureMeasure Annotation';
        annot23.text = 'SqaureMeasure Annotation1';
        annot23.measure = true;
        expect(page.annotations.count).toEqual(23);
        expect(document.flatten).toBeFalsy();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        const loadedPage = document.getPage(0);
        expect(loadedPage.annotations.count).toEqual(23);
        const l0 = loadedPage.annotations.at(0) as PdfLineAnnotation;
        expect(l0 instanceof PdfLineAnnotation).toBeTruthy();
        expect(l0.author).toEqual('Syncfusion');
        expect(l0.bounds).toEqual({ x: -10, y: 769, width: 280, height: 56 });
        expect(l0.border.width).toEqual(4);
        expect(l0.border.hRadius).toEqual(10);
        expect(l0.border.vRadius).toEqual(15);
        expect(l0.border.style).toEqual(PdfBorderStyle.beveled);
        expect(l0.caption.cap).toEqual(true);
        expect(l0.caption.type).toEqual(PdfLineCaptionType.top);
        expect(l0.caption.offset).toEqual({ x: 1, y: 1 });
        expect(l0.flags).toEqual(PdfAnnotationFlag.print);
        expect(l0.color).toEqual({ r: 100, g: 255, b: 100 });
        expect(l0.innerColor).toEqual({ r: 200, g: 100, b: 100 });
        expect(l0.leaderExt).toEqual(1);
        expect(l0.leaderLine).toEqual(5);
        expect(l0.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(l0.lineEndingStyle.end).toEqual(PdfLineEndingStyle.openArrow);
        expect(l0.lineIntent).toEqual(PdfLineIntent.lineDimension);
        expect(l0.name).toEqual('Line Annotation');
        expect(l0.opacity).toBeCloseTo(0.5, 5);
        expect(l0.subject).toEqual('Annotation');
        expect(l0.text).toEqual('Line Annotation Test');
        const l1 = loadedPage.annotations.at(1) as PdfCircleAnnotation;
        expect(l1 instanceof PdfCircleAnnotation).toBeTruthy();
        expect(l1.author).toEqual('Syncfusion');
        expect(l1.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l1.border.width).toEqual(2);
        expect(l1.border.dash).toEqual([1, 1]);
        expect(l1.flags).toEqual(PdfAnnotationFlag.print);
        expect(l1.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l1.bounds).toEqual({ x: 140, y: 140, width: 100, height: 100 });
        expect(l1.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(l1.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l1.name).toEqual('Circle annotation');
        expect(l1.opacity).toBeCloseTo(0.7, 5);
        expect(l1.subject).toEqual('annotation');
        expect(l1.text).toEqual('Circle');
        const l2 = loadedPage.annotations.at(2) as PdfEllipseAnnotation;
        expect(l2 instanceof PdfEllipseAnnotation).toBeTruthy();
        expect(l2.author).toEqual('Syncfusion');
        expect(l2.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l2.border.width).toEqual(2);
        expect(l2.border.dash).toEqual([1, 1]);
        expect(l2.flags).toEqual(PdfAnnotationFlag.print);
        expect(l2.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l2.bounds).toEqual({ x: 40, y: 40, width: 100, height: 200 });
        expect(l2.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(l2.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l2.name).toEqual('Ellipse annotation');
        expect(l2.opacity).toBeCloseTo(0.7, 5);
        expect(l2.subject).toEqual('annotation');
        expect(l2.text).toEqual('Ellipse');
        const l3 = loadedPage.annotations.at(3) as PdfSquareAnnotation;
        expect(l3.author).toEqual('Syncfusion');
        expect(l3.border.width).toEqual(2);
        expect(l3.border.dash).toEqual([1, 1]);
        expect(l3.flags).toEqual(PdfAnnotationFlag.print);
        expect(l3.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l3.bounds).toEqual({ x: 140, y: 140, width: 100, height: 100 });
        expect(l3.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(l3.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l3.name).toEqual('Square annotation');
        expect(l3.opacity).toBeCloseTo(0.7, 5);
        expect(l3.subject).toEqual('annotation');
        expect(l3.text).toEqual('Square');
        expect(l3.borderEffect.intensity).toEqual(2);
        expect(l3.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        const l4 = loadedPage.annotations.at(4) as PdfRectangleAnnotation;
        expect(l4.author).toEqual('Syncfusion');
        expect(l4.flags).toEqual(PdfAnnotationFlag.print);
        expect(l4.border.width).toEqual(2);
        expect(l4.border.dash).toEqual([1, 1]);
        expect(l4.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        expect(l4.borderEffect.intensity).toEqual(2);
        expect(l4.bounds).toEqual({ x: 140, y: 240, width: 100, height: 200 });
        expect(l4.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(l4.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l4.name).toEqual('Rectangle annotation');
        expect(l4.opacity).toBeCloseTo(0.7, 5);
        expect(l4.subject).toEqual('annotation');
        expect(l4.text).toEqual('Rectangle');
        const l5 = loadedPage.annotations.at(5) as PdfPolygonAnnotation;
        expect(l5 instanceof PdfPolygonAnnotation).toBeTruthy();
        expect(l5.author).toEqual('Syncfusion');
        expect(l5.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l5.border.width).toEqual(2);
        expect(l5.border.dash).toEqual([1, 1]);
        expect(l5.borderEffect.intensity).toEqual(1);
        expect(l5.borderEffect.style).toEqual(PdfBorderEffectStyle.cloudy);
        expect(l5.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(l5.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l5.lineExtension).toEqual(2);
        expect(l5.name).toEqual('Poly annot');
        expect(l5.opacity).toBeCloseTo(0.5, 5);
        expect(l5.subject).toEqual('annotation');
        expect(l5.text).toEqual('Polygon');
        expect(l5.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l5.flags).toEqual(PdfAnnotationFlag.print);
        const l6 = loadedPage.annotations.at(6) as PdfPolyLineAnnotation;
        expect(l6 instanceof PdfPolyLineAnnotation).toBeTruthy();
        expect(l6.flags).toEqual(PdfAnnotationFlag.noZoom);
        expect(l6.author).toEqual('Syncfusion');
        expect(l6.beginLineStyle).toEqual(PdfLineEndingStyle.circle);
        expect(l6.border.width).toEqual(2);
        expect(l6.border.style).toEqual(PdfBorderStyle.beveled);
        expect(l6.border.dash).toEqual([1, 1]);
        expect(l6.bounds).toEqual({ x: 300, y: 592, width: 250, height: 200 });
        expect(l6.color).toEqual({ r: 0, g: 255, b: 255 });
        expect(l6.endLineStyle).toEqual(PdfLineEndingStyle.openArrow);
        expect(l6.innerColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(l6.lineExtension).toEqual(2);
        expect(l6.name).toEqual('PolyLine annotation');
        expect(l6.opacity).toBeCloseTo(0.5, 5);
        expect(l6.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l6.subject).toEqual('annotation');
        expect(l6.text).toEqual('PolyLine');
        const l7 = loadedPage.annotations.at(7) as PdfInkAnnotation;
        expect(l7 instanceof PdfInkAnnotation).toBeTruthy();
        expect(l7.author).toEqual('Syncfusion');
        expect(l7.border.width).toEqual(2);
        expect(l7.border.hRadius).toEqual(15);
        expect(l7.border.vRadius).toEqual(15);
        expect(l7.border.dash).toEqual([1, 2]);
        expect(l7.border.style).toEqual(PdfBorderStyle.beveled);
        expect(l7.color).toEqual({ r: 0, g: 100, b: 100 });
        expect(l7.innerColor).toEqual({ r: 0, g: 255, b: 255 });
        expect(l7.name).toEqual('Ink annotation');
        expect(l7.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l7.subject).toEqual('annotation');
        expect(l7.text).toEqual('Ink');
        expect(l7.flags).toEqual(PdfAnnotationFlag.locked);
        expect(l7.opacity).toBeCloseTo(0.5, 5);
        const l8 = loadedPage.annotations.at(8) as PdfAngleMeasurementAnnotation;
        expect(l8.flags).toEqual(PdfAnnotationFlag.print);
        expect(l8.author).toEqual('Syncfusion');
        expect(l8.border.width).toEqual(2);
        expect(l8.border.style).toEqual(PdfBorderStyle.beveled);
        expect(l8.border.dash).toEqual([1, 1]);
        expect(l8.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(l8.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l8.name).toEqual('Angle Measurement annotation');
        expect(l8.rotationAngle).toEqual(PdfRotationAngle.angle90);
        expect(l8.bounds).toEqual({ x: 100, y: 342, width: 50, height: 100 });
        expect(l8.subject).toEqual('annotation');
        expect(l8.text).toEqual('Angle');
        const l9 = loadedPage.annotations.at(9) as PdfPopupAnnotation;
        expect(l9 instanceof PdfPopupAnnotation).toBeTruthy();
        expect(l9.flags).toEqual(PdfAnnotationFlag.noRotate);
        expect(l9.author).toEqual('Syncfusion');
        expect(l9.border.width).toEqual(2);
        expect(l9.border.hRadius).toEqual(10);
        expect(l9.border.vRadius).toEqual(15);
        expect(l9.color).toEqual({ r: 50, g: 50, b: 60 });
        expect(l9.innerColor).toEqual({ r: 255, g: 80, b: 80 });
        expect(l9.name).toEqual('Popup annotation');
        expect(l9.open).toEqual(true);
        expect(l9.opacity).toBeCloseTo(0.6, 5);
        expect(l9.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l9.state).toEqual(PdfAnnotationState.completed);
        expect(l9.stateModel).toEqual(PdfAnnotationStateModel.marked);
        expect(l9.subject).toEqual('annotation');
        expect(l9.text).toEqual('Popup');
        const l10 = loadedPage.annotations.at(10) as PdfFileLinkAnnotation;
        expect(l10 instanceof PdfFileLinkAnnotation).toBeTruthy();
        expect(l10.action).toEqual("app.alert(\"You are looking at Java script action of PDF \")");
        expect(l10.author).toEqual('Syncfusion');
        expect(l10.border.width).toEqual(3);
        expect(l10.border.hRadius).toEqual(5);
        expect(l10.border.vRadius).toEqual(10);
        expect(l10.bounds).toEqual({ x: 140, y: 190, width: 200, height: 200 });
        expect(l10.color).toEqual({ r: 255, g: 0, b: 255 });
        expect(l10.innerColor).toEqual({ r: 90, g: 100, b: 150 });
        expect(l10.name).toEqual('FileLink annotation');
        expect(l10.opacity).toBeCloseTo(0.45, 5);
        expect(l10.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l10.subject).toEqual('annotation');
        expect(l10.text).toEqual('FileLink creation');
        const l11 = loadedPage.annotations.at(11) as PdfDocumentLinkAnnotation;
        expect(l11 instanceof PdfDocumentLinkAnnotation).toBeTruthy();
        expect(l11.destination.location).toEqual({ x: 10, y: 0 });
        expect(l11.destination.zoom).toEqual(5);
        expect(l11.flags).toEqual(PdfAnnotationFlag.noRotate);
        expect(l11.author).toEqual('Syncfusion');
        expect(l11.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l11.border.width).toEqual(2);
        expect(l11.border.dash).toEqual([1, 1]);
        expect(l11.bounds).toEqual({ x: 140, y: 190, width: 40, height: 60 });
        expect(l11.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(l11.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l11.name).toEqual('DocumentLink annot');
        expect(l11.opacity).toBeCloseTo(0.5, 5);
        expect(l11.subject).toEqual('annotation');
        expect(l11.text).toEqual('DocumentLink');
        expect(l11.rotationAngle).toEqual(PdfRotationAngle.angle0);
        const l12 = loadedPage.annotations.at(12) as PdfTextWebLinkAnnotation;
        expect(l12 instanceof PdfTextWebLinkAnnotation).toBeTruthy();
        expect(l12.flags).toEqual(PdfAnnotationFlag.print);
        expect(l12.url).toEqual('http://www.syncfusion.com');
        expect(l12.author).toEqual('Syncfusion');
        expect(l12.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l12.border.width).toEqual(2);
        expect(l12.border.dash).toEqual([1, 1]);
        expect(l12.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(l12.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l12.name).toEqual('TextWebLink annot');
        expect(l12.opacity).toBeCloseTo(0.5, 5);
        expect(l12.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l12.subject).toEqual('annotation');
        expect(l12.text).toEqual('TextWebLink');
        const l13 = loadedPage.annotations.at(13) as PdfUriAnnotation;
        expect(l13 instanceof PdfUriAnnotation).toBeTruthy();
        expect(l13.flags).toEqual(PdfAnnotationFlag.print);
        expect(l13.border.hRadius).toEqual(5);
        expect(l13.border.vRadius).toEqual(5);
        expect(l13.author).toEqual('Syncfusion');
        expect(l13.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l13.border.width).toEqual(2);
        expect(l13.border.dash).toEqual([1, 1]);
        expect(l13.bounds).toEqual({ x: 140, y: 190, width: 200, height: 100 });
        expect(l13.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(l13.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l13.name).toEqual('Uri annot');
        expect(l13.subject).toEqual('annotation');
        expect(l13.text).toEqual('Uri');
        expect(l13.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l13.uri).toEqual('http://www.google.com');
        const l14 = loadedPage.annotations.at(14) as PdfAttachmentAnnotation;
        expect(l14 instanceof PdfAttachmentAnnotation).toBeTruthy();
        expect(l14.icon).toEqual(PdfAttachmentIcon.pushPin);
        expect(l14.author).toEqual('Syncfusion');
        expect(l14.border.style).toEqual(PdfBorderStyle.dashed);
        expect(l14.border.width).toEqual(2);
        expect(l14.border.dash).toEqual([1, 1]);
        expect(l14.bounds).toEqual({ x: 140, y: 190, width: 200, height: 100 });
        expect(l14.color).toEqual({ r: 255, g: 255, b: 0 });
        expect(l14.innerColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(l14.name).toEqual('Attachment annot');
        expect(l14.opacity).toBeCloseTo(0.5, 5);
        expect(l14.subject).toEqual('annotation');
        expect(l14.text).toEqual('Attachment');
        expect(l14.rotationAngle).toEqual(PdfRotationAngle.angle0);
        const l15 = loadedPage.annotations.at(15) as PdfTextMarkupAnnotation;
        expect(l15 instanceof PdfTextMarkupAnnotation).toBeTruthy();
        expect(l15.author).toEqual('Syncfusion');
        expect(l15.flags).toEqual(PdfAnnotationFlag.noZoom);
        expect(l15.border.width).toEqual(3);
        expect(l15.border.hRadius).toEqual(15);
        expect(l15.border.vRadius).toEqual(25);
        expect(l15.bounds).toEqual({ x: 190, y: 290, width: 200, height: 300 });
        expect(l15.boundsCollection).toEqual([{ x: 190, y: 290, width: 200, height: 300 }, { x: 140, y: 440, width: 60, height: 30 }]);
        expect(l15.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(l15.innerColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(l15.name).toEqual('TextMarkup');
        expect(l15.opacity).toBeCloseTo(0.56, 5);
        expect(l15.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l15.subject).toEqual('annotation');
        expect(l15.textMarkupType).toEqual(PdfTextMarkupAnnotationType.squiggly);
        expect(l15.textMarkUpColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(l15.text).toEqual('TextMarkup annotation');
        const l16 = loadedPage.annotations.at(16) as PdfWatermarkAnnotation;
        expect(l16 instanceof PdfWatermarkAnnotation).toBeTruthy();
        expect(l16.author).toEqual('Syncfusion');
        expect(l16.flags).toEqual(PdfAnnotationFlag.print);
        expect(l16.border.width).toEqual(3);
        expect(l16.border.hRadius).toEqual(10);
        expect(l16.border.vRadius).toEqual(20);
        expect(l16.bounds).toEqual({ x: 100, y: 190, width: 150, height: 60 });
        expect(l16.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(l16.innerColor).toEqual({ r: 100, g: 0, b: 0 });
        expect(l16.name).toEqual('WaterMark annotation');
        expect(l16.opacity).toBeCloseTo(0.5, 5);
        expect(l16.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l16.subject).toEqual('Annotation');
        expect(l16.text).toEqual('Water Mark');
        const l17 = loadedPage.annotations.at(17) as PdfRubberStampAnnotation;
        expect(l17 instanceof PdfRubberStampAnnotation).toBeTruthy();
        expect(l17.author).toEqual('Syncfusion');
        expect(l17.flags).toEqual(PdfAnnotationFlag.print);
        expect(l17.border.width).toEqual(5);
        expect(l17.border.hRadius).toEqual(10);
        expect(l17.border.vRadius).toEqual(20);
        expect(l17.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(l17.icon).toEqual(PdfRubberStampAnnotationIcon.completed);
        expect(l17.innerColor).toEqual({ r: 255, g: 0, b: 255 });
        expect(l17.name).toEqual('Rubber annot18ation');
        expect(l17.opacity).toBeCloseTo(0.5, 5);
        expect(l17.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l17.subject).toEqual('annot18ation');
        expect(l17.text).toEqual('rubber');
        const l18 = loadedPage.annotations.at(18) as PdfFreeTextAnnotation;
        expect(l18 instanceof PdfFreeTextAnnotation).toBeTruthy();
        expect(l18.author).toEqual('Syncfusion');
        expect(l18.borderColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(l18.flags).toEqual(PdfAnnotationFlag.print);
        expect(l18.border.width).toEqual(3);
        expect(l18.border.hRadius).toEqual(10);
        expect(l18.border.vRadius).toEqual(20);
        expect(l18.bounds).toEqual({ x: 140, y: 140, width: 200, height: 250 });
        expect(l18.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(l18.calloutLines).toEqual([{ x: 100, y: 450 }, { x: 100, y: 200 }, { x: 100, y: 150 }]);
        expect(l18.lineEndingStyle).toEqual(PdfLineEndingStyle.closedArrow);
        expect(l18.textAlignment).toEqual(PdfTextAlignment.justify);
        expect(l18.textMarkUpColor).toEqual({ r: 200, g: 200, b: 200 });
        expect(l18.innerColor).toEqual({ r: 100, g: 0, b: 0 });
        expect(l18.name).toEqual('FreeText annotation');
        expect(l18.opacity).toBeCloseTo(0.5, 5);
        expect(l18.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l18.subject).toEqual('annotation');
        expect(l18.text).toEqual('FreeText annot');
        expect(l18.annotationIntent).toEqual(PdfAnnotationIntent.freeTextTypeWriter);
        const l19 = loadedPage.annotations.at(19) as PdfRedactionAnnotation;
        expect(l19 instanceof PdfRedactionAnnotation).toBeTruthy();
        expect(l19.flags).toEqual(PdfAnnotationFlag.readOnly);
        expect(l19.author).toEqual('Syncfusion');
        expect(l19.border.width).toEqual(2);
        expect(l19.border.style).toEqual(PdfBorderStyle.underline);
        expect(l19.border.dash).toEqual([1, 1]);
        expect(l19.borderColor).toEqual({ r: 255, g: 0, b: 255 });
        expect(l19.color).toEqual({ r: 255, g: 255, b: 255 });
        expect(l19.innerColor).toEqual({ r: 0, g: 0, b: 0 });
        expect(l19.name).toEqual('Redaction');
        expect(l19.opacity).toBeCloseTo(0.9, 5);
        expect(l19.overlayText).toEqual('Redact');
        expect(l19.repeatText).toEqual(true);
        expect(l19.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(l19.subject).toEqual('annotation');
        expect(l19.text).toEqual('Test');
        expect(l19.textAlignment).toEqual(PdfTextAlignment.justify);
        expect(l19.textColor).toEqual({ r: 255, g: 255, b: 255 });
        const l20 = loadedPage.annotations.at(20) as PdfLineAnnotation;
        expect(l20 instanceof PdfLineAnnotation).toBeTruthy();
        expect(l20.name).toEqual('LineMeasure Annotation');
        expect(l20.text).toEqual("LineMeasure Annotation1 8.47 cm");
        expect(l20.measure).toEqual(true);
        const l21 = loadedPage.annotations.at(21) as PdfCircleAnnotation;
        expect(l21 instanceof PdfCircleAnnotation).toBeTruthy();
        expect(l21.name).toEqual('CircleMeasure Annotation');
        expect(l21.text).toEqual("CircleMeasure Annotation1 3.53 cm");
        expect(l21.measure).toEqual(true);
        const l22 = loadedPage.annotations.at(22) as PdfSquareAnnotation;
        expect(l22.name).toEqual('SqaureMeasure Annotation');
        expect(l22.text).toEqual('SqaureMeasure Annotation1 12.45 sq cm');
        document.destroy();
    });
    it('988607 - Create All Annotations in New PDF document', () => {
        let document: PdfDocument = new PdfDocument();
        for (let i = 0; i < 5; i++) {
            document.addPage();
        }
        let page = document.getPage(0) as PdfPage;
        // 1. Line Annotation
        page.annotations.add(new PdfLineAnnotation({ x: 10, y: 50 }, { x: 250, y: 50 }, {
            text: 'Line',
            author: 'Syncfusion',
            subject: 'Line Annotation',
            color: { r: 255, g: 0, b: 0 },
            innerColor: { r: 0, g: 255, b: 0 },
            lineEndingStyle: new PdfAnnotationLineEndingStyle({ begin: PdfLineEndingStyle.circle, end: PdfLineEndingStyle.closedArrow }),
            opacity: 0.8,
            border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid })
        }));
        expect(page.annotations.count).toEqual(1);
        let lineAnnot = page.annotations.at(0) as PdfLineAnnotation;
        expect(lineAnnot.linePoints).toEqual([{ x: 10, y: 50 }, { x: 250, y: 50 }]);
        expect(lineAnnot.text).toEqual('Line');
        expect(lineAnnot.author).toEqual('Syncfusion');
        expect(lineAnnot.subject).toEqual('Line Annotation');
        expect(lineAnnot.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(lineAnnot.innerColor).toEqual({ r: 0, g: 255, b: 0 });
        expect(lineAnnot.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnot.lineEndingStyle.end).toEqual(PdfLineEndingStyle.closedArrow);
        expect(lineAnnot.opacity).toEqual(0.8);
        expect(lineAnnot.border.width).toEqual(2);
        expect(lineAnnot.border.style).toEqual(PdfBorderStyle.solid);
        // 2. Line Annotation with Measurement
        page.annotations.add(new PdfLineAnnotation({ x: 100, y: 300 }, { x: 300, y: 300 }, {
            text: 'Measurement Line',
            author: 'Syncfusion',
            color: { r: 0, g: 0, b: 255 },
            lineEndingStyle: new PdfAnnotationLineEndingStyle({ begin: PdfLineEndingStyle.circle, end: PdfLineEndingStyle.openArrow }),
            opacity: 0.6,
            border: new PdfAnnotationBorder({ width: 3, style: PdfBorderStyle.dashed, dash: [3, 2] }),
            measurementUnit: PdfMeasurementUnit.centimeter
        }));
        expect(page.annotations.count).toEqual(2);
        let measureAnnot = page.annotations.at(1) as PdfLineAnnotation;
        expect(measureAnnot.linePoints).toEqual([{ x: 100, y: 300 }, { x: 300, y: 300 }]);
        expect(measureAnnot.text).toEqual('Measurement Line');
        expect(measureAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(measureAnnot.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(measureAnnot.lineEndingStyle.end).toEqual(PdfLineEndingStyle.openArrow);
        expect(measureAnnot.opacity).toEqual(0.6);
        expect(measureAnnot.border.width).toEqual(3);
        expect(measureAnnot.border.style).toEqual(PdfBorderStyle.dashed);
        // 3. Circle Annotation
        page.annotations.add(new PdfCircleAnnotation({ x: 50, y: 100, width: 120, height: 120 }, {
            text: 'Circle Annot',
            author: 'Syncfusion',
            subject: 'Circle Annotation',
            color: { r: 255, g: 0, b: 0 },
            innerColor: { r: 255, g: 255, b: 200 },
            opacity: 0.9,
            border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid }),
        }));
        expect(page.annotations.count).toEqual(3);
        let circleAnnot = page.annotations.at(2) as PdfCircleAnnotation;
        expect(circleAnnot.bounds).toEqual({ x: 50, y: 100, width: 120, height: 120 });
        expect(circleAnnot.text).toEqual('Circle Annot');
        expect(circleAnnot.author).toEqual('Syncfusion');
        expect(circleAnnot.subject).toEqual('Circle Annotation');
        expect(circleAnnot.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(circleAnnot.innerColor).toEqual({ r: 255, g: 255, b: 200 });
        expect(circleAnnot.opacity).toEqual(0.9);
        expect(circleAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(circleAnnot.border.width).toEqual(2);
        // 4. Square Annotation
        page.annotations.add(new PdfSquareAnnotation({ x: 150, y: 150, width: 150, height: 150 }, {
            text: 'Square',
            author: 'Syncfusion',
            subject: 'Square Annotation',
            color: { r: 0, g: 128, b: 0 },
            innerColor: { r: 200, g: 200, b: 255 },
            opacity: 0.7,
            border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid })
        }));
        expect(page.annotations.count).toEqual(4);
        let squareAnnot = page.annotations.at(3) as PdfSquareAnnotation;
        expect(squareAnnot.bounds).toEqual({ x: 150, y: 150, width: 150, height: 150 });
        expect(squareAnnot.text).toEqual('Square');
        expect(squareAnnot.author).toEqual('Syncfusion');
        expect(squareAnnot.subject).toEqual('Square Annotation');
        expect(squareAnnot.color).toEqual({ r: 0, g: 128, b: 0 });
        expect(squareAnnot.innerColor).toEqual({ r: 200, g: 200, b: 255 });
        expect(squareAnnot.opacity).toEqual(0.7);
        expect(squareAnnot.border.width).toEqual(2);
        expect(squareAnnot.border.style).toEqual(PdfBorderStyle.solid);
        // 5. Polygon Annotation
        page.annotations.add(new PdfPolygonAnnotation([{ x: 200, y: 200 }, { x: 250, y: 250 }, { x: 220, y: 280 }], {
            text: 'Polygon',
            author: 'Syncfusion',
            subject: 'Polygon Annotation',
            color: { r: 128, g: 0, b: 128 },
            innerColor: { r: 255, g: 255, b: 255 },
            opacity: 0.8,
            border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.dashed })
        }));
        expect(page.annotations.count).toEqual(5);
        let polygonAnnot = page.annotations.at(4) as PdfPolygonAnnotation;
        expect(polygonAnnot.text).toEqual('Polygon');
        expect(polygonAnnot.author).toEqual('Syncfusion');
        expect(polygonAnnot.subject).toEqual('Polygon Annotation');
        expect(polygonAnnot.color).toEqual({ r: 128, g: 0, b: 128 });
        expect(polygonAnnot.innerColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(polygonAnnot.opacity).toEqual(0.8);
        expect(polygonAnnot.border.width).toEqual(2);
        expect(polygonAnnot.border.style).toEqual(PdfBorderStyle.dashed);
        let page1 = document.getPage(1);
        // 6. Text Markup Annotation (Highlight)
        page1.annotations.add(new PdfTextMarkupAnnotation('Highlight text', { x: 50, y: 400, width: 200, height: 20 }, {
            boundsCollection: [{ x: 50, y: 200, width: 120, height: 14 }, { x: 50, y: 215, width: 90, height: 14 }],
            textMarkupType: PdfTextMarkupAnnotationType.highlight,
            author: 'Syncfusion',
            subject: 'TextMarkup',
            textMarkUpColor: { r: 255, g: 255, b: 0 },
            opacity: 0.5,
            border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
        }));
        expect(page1.annotations.count).toEqual(1);
        let highlightAnnot = page1.annotations.at(0) as PdfTextMarkupAnnotation;
        expect(highlightAnnot.textMarkupType).toEqual(PdfTextMarkupAnnotationType.highlight);
        expect(highlightAnnot.textMarkUpColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(highlightAnnot.text).toEqual('Highlight text');
        expect(highlightAnnot.subject).toEqual('TextMarkup');
        expect(highlightAnnot.author).toEqual('Syncfusion');
        expect(highlightAnnot.bounds).toEqual({ x: 50, y: 400, width: 200, height: 20 });
        expect(highlightAnnot.boundsCollection).toEqual([{ x: 50, y: 200, width: 120, height: 14 }, { x: 50, y: 215, width: 90, height: 14 }]);
        expect(highlightAnnot.border.width).toEqual(1);
        expect(highlightAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(highlightAnnot.opacity).toEqual(0.5);
        // 7. Stamp Annotation
        page1.annotations.add(new PdfRubberStampAnnotation({ x: 100, y: 450, width: 80, height: 40 }, {
            icon: PdfRubberStampAnnotationIcon.approved,
            author: 'Syncfusion',
            subject: 'Stamp Annnot',
            text: 'Approved',
            color: { r: 0, g: 0, b: 255 },
            opacity: undefined
        }));
        expect(page1.annotations.count).toEqual(2);
        let stampAnnot = page1.annotations.at(1) as PdfRubberStampAnnotation;
        expect(stampAnnot.bounds).toEqual({ x: 100, y: 450, width: 80, height: 40 });
        expect(stampAnnot.text).toEqual('Approved');
        expect(stampAnnot.subject).toEqual('Stamp Annnot');
        expect(stampAnnot.icon).toEqual(PdfRubberStampAnnotationIcon.approved);
        expect(stampAnnot.author).toEqual('Syncfusion');
        expect(stampAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(stampAnnot.opacity).toEqual(1);
        // 8. Ink Annotation
        page1.annotations.add(new PdfInkAnnotation({ x: 50, y: 100, width: 200, height: 150 },
            [{ x: 60, y: 120 }, { x: 120, y: 180 }, { x: 200, y: 160 }],
            {
                text: 'Ink', author: 'Syncfusion',
                subject: 'Ink Annotation',
                color: { r: 0, g: 0, b: 255 },
                thickness: 2,
                opacity: 0.8,
                pointsCollection: [
                    [{ x: 60, y: 120 }, { x: 90, y: 130 }, { x: 110, y: 140 }],
                    [{ x: 120, y: 180 }, { x: 150, y: 175 }]
                ]
            }));
        expect(page1.annotations.count).toEqual(3);
        let inkAnnot = page1.annotations.at(2) as PdfInkAnnotation;
        expect(inkAnnot.inkPointsCollection).toEqual([
            [{ x: 60, y: 120 }, { x: 90, y: 130 }, { x: 110, y: 140 }],
            [{ x: 120, y: 180 }, { x: 150, y: 175 }]
        ]);
        expect(inkAnnot.text).toEqual('Ink');
        expect(inkAnnot.author).toEqual('Syncfusion');
        expect(inkAnnot.subject).toEqual('Ink Annotation');
        expect(inkAnnot.border.width).toEqual(2);
        expect(inkAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        // 9. Free Text Annotation
        page1.annotations.add(new PdfFreeTextAnnotation({ x: 250, y: 260, width: 180, height: 80 }, {
            text: 'Free Text',
            author: 'Syncfusion',
            calloutLines: [{ x: 200, y: 320 }, { x: 260, y: 300 }, { x: 260, y: 300 }],
            lineEndingStyle: PdfLineEndingStyle.openArrow,
            annotationIntent: PdfAnnotationIntent.freeTextCallout,
            innerColor: { r: 255, g: 255, b: 255 },
            borderColor: { r: 0, g: 0, b: 0 },
            textMarkUpColor: { r: 255, g: 0, b: 0 },
            opacity: 1,
            font: new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.bold),
            textAlignment: PdfTextAlignment.center
        }));
        expect(page1.annotations.count).toEqual(4);
        let freeTextAnnot = page1.annotations.at(3) as PdfFreeTextAnnotation;
        expect(freeTextAnnot.bounds).toEqual({ x: 250, y: 260, width: 180, height: 80 });
        expect(freeTextAnnot.text).toEqual('Free Text');
        expect(freeTextAnnot.annotationIntent).toEqual(PdfAnnotationIntent.freeTextCallout);
        expect(freeTextAnnot.innerColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(freeTextAnnot.borderColor).toEqual({ r: 0, g: 0, b: 0 });
        expect(freeTextAnnot.textMarkUpColor).toEqual({ r: 255, g: 0, b: 0 });
        expect(freeTextAnnot.textAlignment).toEqual(PdfTextAlignment.center);
        expect(freeTextAnnot.font.size).toEqual(12);
        expect(freeTextAnnot.font.style).toEqual(PdfFontStyle.bold);
        expect(freeTextAnnot.lineEndingStyle).toEqual(PdfLineEndingStyle.openArrow);
        const page3 = document.getPage(3);
        // 10. Angle Measurement Annotation
        page3.annotations.add(new PdfAngleMeasurementAnnotation(
            { x: 100, y: 200 }, // start
            { x: 150, y: 250 }, // mid
            { x: 200, y: 200 }, // end
            {
                text: 'Angle Measure',
                author: 'Syncfusion',
                subject: 'Angle',
                color: { r: 255, g: 165, b: 0 },
                opacity: 0.75,
                border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid })
            }
        ));
        expect(page3.annotations.count).toEqual(1);
        const angleAnnot = page3.annotations.at(0) as PdfAngleMeasurementAnnotation;
        expect(angleAnnot.text).toEqual('Angle Measure');
        expect(angleAnnot.author).toEqual('Syncfusion');
        expect(angleAnnot.subject).toEqual('Angle');
        expect(angleAnnot.color).toEqual({ r: 255, g: 165, b: 0 });
        expect(angleAnnot.opacity).toEqual(0.75);
        expect(angleAnnot.border.width).toEqual(2);
        expect(angleAnnot.border.style).toEqual(PdfBorderStyle.solid);
        // 11. Circle Annotation with measure
        page3.annotations.add(new PdfCircleAnnotation({ x: 220, y: 220, width: 100, height: 100 }, {
            text: 'Measured Circle',
            author: 'Syncfusion',
            subject: 'Circle Measure',
            color: { r: 0, g: 0, b: 0 },
            innerColor: { r: 230, g: 255, b: 230 },
            opacity: 0.8,
            border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.dashed, dash: [2, 2] }),
            measure: { unit: PdfMeasurementUnit.centimeter, type: PdfCircleMeasurementType.diameter }
        }));
        expect(page3.annotations.count).toEqual(2);
        const measuredCircle = page3.annotations.at(1) as PdfCircleAnnotation;
        expect(measuredCircle.text).toEqual('Measured Circle');
        expect(measuredCircle.subject).toEqual('Circle Measure');
        expect(measuredCircle.innerColor).toEqual({ r: 230, g: 255, b: 230 });
        expect(measuredCircle.border.style).toEqual(PdfBorderStyle.dashed);
        expect(measuredCircle.border.width).toEqual(1);
        // 12. Square Annotation with measurementUnit
        page3.annotations.add(new PdfSquareAnnotation({ x: 60, y: 60, width: 80, height: 80 }, {
            text: 'Measured Square',
            author: 'Syncfusion',
            subject: 'Square Measure',
            color: { r: 50, g: 50, b: 200 },
            innerColor: { r: 240, g: 240, b: 255 },
            opacity: 0.9,
            border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.solid }),
            measurementUnit: PdfMeasurementUnit.inch
        }));
        expect(page3.annotations.count).toEqual(3);
        const measuredSquare = page3.annotations.at(2) as PdfSquareAnnotation;
        expect(measuredSquare.text).toEqual('Measured Square');
        expect(measuredSquare.subject).toEqual('Square Measure');
        expect(measuredSquare.innerColor).toEqual({ r: 240, g: 240, b: 255 });
        expect(measuredSquare.border.width).toEqual(2);
        expect(measuredSquare.border.style).toEqual(PdfBorderStyle.solid);
        // 13. Rectangle Annotation
        page3.annotations.add(new PdfRectangleAnnotation({ x: 320, y: 80, width: 120, height: 60 }, {
            text: 'Rectangle',
            author: 'Syncfusion',
            subject: 'Rect',
            color: { r: 200, g: 0, b: 0 },
            innerColor: { r: 255, g: 230, b: 230 },
            opacity: 0.6,
            border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
        }));
        expect(page3.annotations.count).toEqual(4);
        const rectAnnot = page3.annotations.at(3) as PdfRectangleAnnotation;
        expect(rectAnnot.text).toEqual('Rectangle');
        expect(rectAnnot.subject).toEqual('Rect');
        expect(rectAnnot.color).toEqual({ r: 200, g: 0, b: 0 });
        expect(rectAnnot.innerColor).toEqual({ r: 255, g: 230, b: 230 });
        expect(rectAnnot.opacity).toEqual(0.6);
        expect(rectAnnot.border.width).toEqual(1);
        expect(rectAnnot.border.style).toEqual(PdfBorderStyle.solid);
        // 14. PolyLine Annotation
        page3.annotations.add(new PdfPolyLineAnnotation(
            [{ x: 100, y: 350 }, { x: 140, y: 380 }, { x: 180, y: 360 }],
            {
                text: 'Polyline',
                author: 'Syncfusion',
                subject: 'PolyLine',
                color: { r: 0, g: 150, b: 150 },
                innerColor: { r: 230, g: 255, b: 255 },
                lineEndingStyle: new PdfAnnotationLineEndingStyle({ end: PdfLineEndingStyle.openArrow }),
                opacity: 0.7,
                border: new PdfAnnotationBorder({ width: 2, style: PdfBorderStyle.dashed })
            }
        ));
        expect(page3.annotations.count).toEqual(5);
        const polylineAnnot = page3.annotations.at(4) as PdfPolyLineAnnotation;
        expect(polylineAnnot.text).toEqual('Polyline');
        expect(polylineAnnot.subject).toEqual('PolyLine');
        expect(polylineAnnot.color).toEqual({ r: 0, g: 150, b: 150 });
        expect(polylineAnnot.innerColor).toEqual({ r: 230, g: 255, b: 255 });
        expect(polylineAnnot.opacity).toEqual(0.7);
        expect(polylineAnnot.border.style).toEqual(PdfBorderStyle.dashed);
        expect(polylineAnnot.border.width).toEqual(2);
        // Page index 4: Add remaining 6 annotations
        const page4 = document.getPage(4);
        // 15. Popup Annotation
        page4.annotations.add(new PdfPopupAnnotation(
            'Popup Note',
            { x: 50, y: 450, width: 180, height: 70 },
            {
                author: 'Syncfusion',
                subject: 'Popup',
                color: { r: 255, g: 255, b: 153 },
                icon: PdfPopupIcon.comment,
                open: true,
                state: PdfAnnotationState.accepted,
                stateModel: PdfAnnotationStateModel.review
            }
        ));
        expect(page4.annotations.count).toEqual(1);
        const popupAnnot = page4.annotations.at(0) as PdfPopupAnnotation;
        expect(popupAnnot.text).toEqual('Popup Note');
        expect(popupAnnot.author).toEqual('Syncfusion');
        expect(popupAnnot.subject).toEqual('Popup');
        expect(popupAnnot.icon).toEqual(PdfPopupIcon.comment);
        expect(popupAnnot.open).toBeTruthy();
        expect(popupAnnot.state).toEqual(PdfAnnotationState.accepted);
        expect(popupAnnot.stateModel).toEqual(PdfAnnotationStateModel.review);
        // 16. File Link Annotation
        page4.annotations.add(new PdfFileLinkAnnotation(
            { x: 250, y: 450, width: 150, height: 30 },
            'files/sample.pdf',
            {
                text: 'Open File',
                author: 'Syncfusion',
                subject: 'File Link',
                color: { r: 0, g: 102, b: 204 },
                opacity: 1
            }
        ));
        expect(page4.annotations.count).toEqual(2);
        const fileLinkAnnot = page4.annotations.at(1) as PdfFileLinkAnnotation;
        expect(fileLinkAnnot.text).toEqual('Open File');
        expect(fileLinkAnnot.author).toEqual('Syncfusion');
        expect(fileLinkAnnot.subject).toEqual('File Link');
        expect(fileLinkAnnot.color).toEqual({ r: 0, g: 102, b: 204 });
        // 17. URI Annotation
        page4.annotations.add(new PdfUriAnnotation(
            { x: 50, y: 400, width: 180, height: 25 },
            'https://www.syncfusion.com',
            {
                text: 'Syncfusion Website',
                author: 'Syncfusion',
                subject: 'URI',
                color: { r: 0, g: 0, b: 255 },
                innerColor: { r: 220, g: 235, b: 255 },
                opacity: 0.9,
                border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
            }
        ));
        expect(page4.annotations.count).toEqual(3);
        const uriAnnot = page4.annotations.at(2) as PdfUriAnnotation;
        expect(uriAnnot.text).toEqual('Syncfusion Website');
        expect(uriAnnot.author).toEqual('Syncfusion');
        expect(uriAnnot.subject).toEqual('URI');
        expect(uriAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(uriAnnot.innerColor).toEqual({ r: 220, g: 235, b: 255 });
        expect(uriAnnot.opacity).toEqual(0.9);
        expect(uriAnnot.border.width).toEqual(1);
        expect(uriAnnot.border.style).toEqual(PdfBorderStyle.solid);
        // 18. Document Link Annotation
        const destination = new PdfDestination(document.getPage(0), { x: 10, y: 10 }, { zoom: 1, mode: PdfDestinationMode.fitH });
        page4.annotations.add(new PdfDocumentLinkAnnotation(
            { x: 50, y: 360, width: 220, height: 25 },
            destination,
            {
                text: 'Go to Page 1',
                author: 'Syncfusion',
                subject: 'Document Link',
                color: { r: 34, g: 139, b: 34 },
                innerColor: { r: 220, g: 255, b: 220 },
                opacity: 1,
                border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
            }
        ));
        expect(page4.annotations.count).toEqual(4);
        const docLinkAnnot = page4.annotations.at(3) as PdfDocumentLinkAnnotation;
        expect(docLinkAnnot.text).toEqual('Go to Page 1');
        expect(docLinkAnnot.author).toEqual('Syncfusion');
        expect(docLinkAnnot.subject).toEqual('Document Link');
        expect(docLinkAnnot.color).toEqual({ r: 34, g: 139, b: 34 });
        expect(docLinkAnnot.innerColor).toEqual({ r: 220, g: 255, b: 220 });
        expect(docLinkAnnot.opacity).toEqual(1);
        expect(docLinkAnnot.border.width).toEqual(1);
        expect(docLinkAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(docLinkAnnot.destination.location).toEqual({ x: 10, y: 10 });
        expect(docLinkAnnot.destination.zoom).toEqual(1);
        expect(docLinkAnnot.destination.mode).toEqual(PdfDestinationMode.fitH);
        // 19. Text Web Link Annotation
        const twlFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.underline);
        page4.annotations.add(new PdfTextWebLinkAnnotation(
            { x: 50, y: 320, width: 220, height: 20 },
            { r: 255, g: 255, b: 255 }, // brushColor
            { r: 0, g: 0, b: 0 },       // penColor
            1,                          // penWidth
            {
                text: 'Visit Syncfusion PDF',
                url: 'https://www.syncfusion.com/products/javascript/pdf-library',
                font: twlFont,
                author: 'Syncfusion',
                subject: 'Text Web Link',
                color: { r: 0, g: 0, b: 0 },
                opacity: 1,
                border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
            }
        ));
        expect(page4.annotations.count).toEqual(5);
        const textWebLinkAnnot = page4.annotations.at(4) as PdfTextWebLinkAnnotation;
        expect(textWebLinkAnnot.text).toEqual('Visit Syncfusion PDF');
        expect(textWebLinkAnnot.author).toEqual('Syncfusion');
        expect(textWebLinkAnnot.subject).toEqual('Text Web Link');
        expect(textWebLinkAnnot.opacity).toEqual(1);
        expect(textWebLinkAnnot.border.width).toEqual(1);
        expect(textWebLinkAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(textWebLinkAnnot.font.size).toEqual(10);
        // 20. Attachment Annotation
        const attachmentData = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // "%PDF" sample bytes
        page4.annotations.add(new PdfAttachmentAnnotation(
            { x: 50, y: 280, width: 24, height: 24 },
            'note.txt',
            attachmentData,
            {
                text: 'Attachment',
                icon: PdfAttachmentIcon.pushPin,
                author: 'Syncfusion',
                subject: 'Attach',
                color: { r: 255, g: 0, b: 0 },
                opacity: 1,
                border: new PdfAnnotationBorder({ width: 1, style: PdfBorderStyle.solid })
            }
        ));
        expect(page4.annotations.count).toEqual(6);
        const attachmentAnnot = page4.annotations.at(5) as PdfAttachmentAnnotation;
        expect(attachmentAnnot.text).toEqual('Attachment');
        expect(attachmentAnnot.author).toEqual('Syncfusion');
        expect(attachmentAnnot.subject).toEqual('Attach');
        expect(attachmentAnnot.icon).toEqual(PdfAttachmentIcon.pushPin);
        expect(attachmentAnnot.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(attachmentAnnot.opacity).toEqual(1);
        expect(attachmentAnnot.border.width).toEqual(1);
        expect(attachmentAnnot.border.style).toEqual(PdfBorderStyle.solid);
        //21. Ellipse Annotation
        page4.annotations.add(new PdfEllipseAnnotation({ x: 80, y: 120, width: 160, height: 100 }, {
            text: 'Ellipse', author: 'Syncfusion', subject: 'Ellipse Annotation',
            color: { r: 0, g: 128, b: 255 },
            innerColor: { r: 220, g: 240, b: 255 },
            opacity: 0.7,
            border: new PdfAnnotationBorder({ width: 1, hRadius: 0, vRadius: 0, style: PdfBorderStyle.solid })
        }));
        let ellipseAnnot = page4.annotations.at(page4.annotations.count - 1) as PdfEllipseAnnotation;
        expect(ellipseAnnot.text).toEqual('Ellipse');
        expect(ellipseAnnot.author).toEqual('Syncfusion');
        expect(ellipseAnnot.subject).toEqual('Ellipse Annotation');
        expect(ellipseAnnot.color).toEqual({ r: 0, g: 128, b: 255 });
        expect(ellipseAnnot.innerColor).toEqual({ r: 220, g: 240, b: 255 });
        expect(ellipseAnnot.opacity).toEqual(0.7);
        expect(ellipseAnnot.border.width).toEqual(1);
        expect(ellipseAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(ellipseAnnot.bounds).toEqual({ x: 80, y: 120, width: 160, height: 100 });
        // Save and verify
        let output = document.save();
        document.destroy();
        document = new PdfDocument(output);
        page = document.getPage(0) as PdfPage;
        expect(page.annotations.count).toEqual(5);
        lineAnnot = page.annotations.at(0) as PdfLineAnnotation;
        expect(lineAnnot.linePoints).toEqual([{ x: 10, y: 50 }, { x: 250, y: 50 }]);
        expect(lineAnnot.text).toEqual('Line');
        expect(lineAnnot.author).toEqual('Syncfusion');
        expect(lineAnnot.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(lineAnnot.lineEndingStyle.end).toEqual(PdfLineEndingStyle.closedArrow);
        expect(lineAnnot.opacity).toEqual(0.8);
        expect(lineAnnot.border.width).toEqual(2);
        expect(lineAnnot.border.style).toEqual(PdfBorderStyle.solid);
        measureAnnot = page.annotations.at(1) as PdfLineAnnotation;
        expect(measureAnnot.linePoints).toEqual([{ x: 100, y: 300 }, { x: 300, y: 300 }]);
        expect(measureAnnot.text).toEqual('Measurement Line 7.06 cm');
        expect(measureAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(measureAnnot.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(measureAnnot.lineEndingStyle.end).toEqual(PdfLineEndingStyle.openArrow);
        expect(measureAnnot.opacity).toEqual(0.6);
        expect(measureAnnot.border.width).toEqual(3);
        expect(measureAnnot.border.style).toEqual(PdfBorderStyle.dashed);
        circleAnnot = page.annotations.at(2) as PdfCircleAnnotation;
        expect(circleAnnot.text).toEqual('Circle Annot');
        expect(circleAnnot.author).toEqual('Syncfusion');
        expect(circleAnnot.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(circleAnnot.innerColor).toEqual({ r: 255, g: 255, b: 200 });
        expect(circleAnnot.opacity).toEqual(0.9);
        expect(circleAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(circleAnnot.border.width).toEqual(2);
        squareAnnot = page.annotations.at(3) as PdfSquareAnnotation;
        expect(squareAnnot.text).toEqual('Square');
        expect(squareAnnot.author).toEqual('Syncfusion');
        expect(squareAnnot.color).toEqual({ r: 0, g: 128, b: 0 });
        expect(squareAnnot.innerColor).toEqual({ r: 200, g: 200, b: 255 });
        expect(squareAnnot.opacity).toEqual(0.7);
        expect(squareAnnot.border.width).toEqual(2);
        expect(squareAnnot.border.style).toEqual(PdfBorderStyle.solid);
        polygonAnnot = page.annotations.at(4) as PdfPolygonAnnotation;
        expect(polygonAnnot.text).toEqual('Polygon');
        expect(polygonAnnot.author).toEqual('Syncfusion');
        expect(polygonAnnot.color).toEqual({ r: 128, g: 0, b: 128 });
        expect(polygonAnnot.opacity).toEqual(0.8);
        // Page 1
        page1 = document.getPage(1) as PdfPage;
        expect(page1.annotations.count).toEqual(4);
        highlightAnnot = page1.annotations.at(0) as PdfTextMarkupAnnotation;
        expect(highlightAnnot.textMarkupType).toEqual(PdfTextMarkupAnnotationType.highlight);
        expect(highlightAnnot.textMarkUpColor).toEqual({ r: 255, g: 255, b: 0 });
        expect(highlightAnnot.text).toEqual('Highlight text');
        expect(highlightAnnot.author).toEqual('Syncfusion');
        expect(highlightAnnot.bounds).toEqual({ x: 90, y: 440, width: 200, height: 20 });
        expect(highlightAnnot.border.width).toEqual(1);
        expect(highlightAnnot.border.style).toEqual(PdfBorderStyle.solid);
        expect(highlightAnnot.opacity).toEqual(0.5);
        stampAnnot = page1.annotations.at(1) as PdfRubberStampAnnotation;
        expect(stampAnnot.text).toEqual('Approved');
        expect(stampAnnot.icon).toEqual(PdfRubberStampAnnotationIcon.approved);
        expect(stampAnnot.author).toEqual('Syncfusion');
        expect(stampAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(stampAnnot.opacity).toEqual(1);
        inkAnnot = page1.annotations.at(2) as PdfInkAnnotation;
        expect(inkAnnot.inkPointsCollection).toEqual([
            [{ x: 60, y: 120 }, { x: 120, y: 180 }, { x: 200, y: 160 }],
            [{ x: 60, y: 120 }, { x: 90, y: 130 }, { x: 110, y: 140 }],
            [{ x: 120, y: 180 }, { x: 150, y: 175 }]
        ]);
        expect(inkAnnot.text).toEqual('Ink');
        expect(inkAnnot.author).toEqual('Syncfusion');
        expect(inkAnnot.subject).toEqual('Ink Annotation');
        expect(inkAnnot.border.width).toEqual(2);
        expect(inkAnnot.color).toEqual({ r: 0, g: 0, b: 255 });
        freeTextAnnot = page1.annotations.at(3) as PdfFreeTextAnnotation;
        expect(freeTextAnnot.text).toEqual('Free Text');
        expect(freeTextAnnot.annotationIntent).toEqual(PdfAnnotationIntent.freeTextCallout);
        expect(freeTextAnnot.innerColor).toEqual({ r: 255, g: 255, b: 255 });
        expect(freeTextAnnot.borderColor).toEqual({ r: 0, g: 0, b: 0 });
        expect(freeTextAnnot.textMarkUpColor).toEqual({ r: 255, g: 0, b: 0 });
        expect(freeTextAnnot.textAlignment).toEqual(PdfTextAlignment.center);
        expect(freeTextAnnot.font.size).toEqual(12);
        expect(freeTextAnnot.font.style).toEqual(PdfFontStyle.bold);
        expect(freeTextAnnot.lineEndingStyle).toEqual(PdfLineEndingStyle.openArrow);
        // Page 3
        const page3R = document.getPage(3);
        expect(page3R.annotations.count).toEqual(5);
        const angleAnnotR = page3R.annotations.at(0) as PdfAngleMeasurementAnnotation;
        expect(angleAnnotR.text).toEqual('Angle Measure');
        expect(angleAnnotR.author).toEqual('Syncfusion');
        expect(angleAnnotR.subject).toEqual('Angle');
        expect(angleAnnotR.color).toEqual({ r: 255, g: 165, b: 0 });
        expect(angleAnnotR.opacity).toEqual(0.75);
        expect(angleAnnotR.border.width).toEqual(2);
        expect(angleAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        const measuredCircleR = page3R.annotations.at(1) as PdfCircleAnnotation;
        expect(measuredCircleR.text).toEqual('Measured Circle 3.53 cm');
        expect(measuredCircleR.subject).toEqual('Circle Measure');
        expect(measuredCircleR.innerColor).toEqual({ r: 230, g: 255, b: 230 });
        expect(measuredCircleR.border.style).toEqual(PdfBorderStyle.dashed);
        expect(measuredCircleR.border.width).toEqual(1);
        const measuredSquareR = page3R.annotations.at(2) as PdfSquareAnnotation;
        expect(measuredSquareR.text).toEqual('Measured Square 1.23 sq in');
        expect(measuredSquareR.subject).toEqual('Area Measurement');
        expect(measuredSquareR.innerColor).toEqual({ r: 240, g: 240, b: 255 });
        expect(measuredSquareR.border.width).toEqual(2);
        expect(measuredSquareR.border.style).toEqual(PdfBorderStyle.solid);
        const rectAnnotR = page3R.annotations.at(3) as PdfRectangleAnnotation;
        expect(rectAnnotR.text).toEqual('Rectangle');
        expect(rectAnnotR.subject).toEqual('Rect');
        expect(rectAnnotR.color).toEqual({ r: 200, g: 0, b: 0 });
        expect(rectAnnotR.innerColor).toEqual({ r: 255, g: 230, b: 230 });
        expect(rectAnnotR.opacity).toEqual(0.6);
        expect(rectAnnotR.border.width).toEqual(1);
        expect(rectAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        const polylineAnnotR = page3R.annotations.at(4) as PdfPolyLineAnnotation;
        expect(polylineAnnotR.text).toEqual('Polyline');
        expect(polylineAnnotR.subject).toEqual('PolyLine');
        expect(polylineAnnotR.color).toEqual({ r: 0, g: 150, b: 150 });
        expect(polylineAnnotR.innerColor).toEqual({ r: 230, g: 255, b: 255 });
        expect(polylineAnnotR.opacity).toEqual(0.7);
        expect(polylineAnnotR.border.style).toEqual(PdfBorderStyle.dashed);
        expect(polylineAnnotR.border.width).toEqual(2);
        // Page 4
        const page4R = document.getPage(4);
        expect(page4R.annotations.count).toEqual(7);
        const popupAnnotR = page4R.annotations.at(0) as PdfPopupAnnotation;
        expect(popupAnnotR.text).toEqual('Popup Note');
        expect(popupAnnotR.author).toEqual('Syncfusion');
        expect(popupAnnotR.subject).toEqual('Popup');
        expect(popupAnnotR.icon).toEqual(PdfPopupIcon.comment);
        expect(popupAnnotR.open).toBeTruthy();
        expect(popupAnnotR.state).toEqual(PdfAnnotationState.accepted);
        expect(popupAnnotR.stateModel).toEqual(PdfAnnotationStateModel.review);
        const fileLinkAnnotR = page4R.annotations.at(1) as PdfFileLinkAnnotation;
        expect(fileLinkAnnotR.text).toEqual('Open File');
        expect(fileLinkAnnotR.author).toEqual('Syncfusion');
        expect(fileLinkAnnotR.subject).toEqual('File Link');
        expect(fileLinkAnnotR.color).toEqual({ r: 0, g: 102, b: 204 });
        const uriAnnotR = page4R.annotations.at(2) as PdfUriAnnotation;
        expect(uriAnnotR.text).toEqual('Syncfusion Website');
        expect(uriAnnotR.author).toEqual('Syncfusion');
        expect(uriAnnotR.subject).toEqual('URI');
        expect(uriAnnotR.color).toEqual({ r: 0, g: 0, b: 255 });
        expect(uriAnnotR.innerColor).toEqual({ r: 220, g: 235, b: 255 });
        expect(uriAnnotR.opacity).toEqual(0.9);
        expect(uriAnnotR.border.width).toEqual(1);
        expect(uriAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        const docLinkAnnotR = page4R.annotations.at(3) as PdfDocumentLinkAnnotation;
        expect(docLinkAnnotR.text).toEqual('Go to Page 1');
        expect(docLinkAnnotR.author).toEqual('Syncfusion');
        expect(docLinkAnnotR.subject).toEqual('Document Link');
        expect(docLinkAnnotR.color).toEqual({ r: 34, g: 139, b: 34 });
        expect(docLinkAnnotR.innerColor).toEqual({ r: 220, g: 255, b: 220 });
        expect(docLinkAnnotR.opacity).toEqual(1);
        expect(docLinkAnnotR.border.width).toEqual(1);
        expect(docLinkAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        expect(docLinkAnnotR.destination.location).toEqual({ x: 0, y: 10 });
        expect(docLinkAnnotR.destination.mode).toEqual(PdfDestinationMode.fitH);
        const textWebLinkAnnotR = page4R.annotations.at(4) as PdfTextWebLinkAnnotation;
        expect(textWebLinkAnnotR.text).toEqual('Visit Syncfusion PDF');
        expect(textWebLinkAnnotR.author).toEqual('Syncfusion');
        expect(textWebLinkAnnotR.subject).toEqual('Text Web Link');
        expect(textWebLinkAnnotR.opacity).toEqual(1);
        expect(textWebLinkAnnotR.border.width).toEqual(1);
        expect(textWebLinkAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        const attachmentAnnotR = page4R.annotations.at(5) as PdfAttachmentAnnotation;
        expect(attachmentAnnotR.text).toEqual('Attachment');
        expect(attachmentAnnotR.author).toEqual('Syncfusion');
        expect(attachmentAnnotR.subject).toEqual('Attach');
        expect(attachmentAnnotR.icon).toEqual(PdfAttachmentIcon.pushPin);
        expect(attachmentAnnotR.color).toEqual({ r: 255, g: 0, b: 0 });
        expect(attachmentAnnotR.opacity).toEqual(1);
        expect(attachmentAnnotR.border.width).toEqual(1);
        expect(attachmentAnnotR.border.style).toEqual(PdfBorderStyle.solid);
        ellipseAnnot = page4.annotations.at(6) as PdfEllipseAnnotation;
        expect(ellipseAnnot.text).toEqual('Ellipse');
        expect(ellipseAnnot.author).toEqual('Syncfusion');
        expect(ellipseAnnot.subject).toEqual('Ellipse Annotation');
        expect(ellipseAnnot.color).toEqual({ r: 0, g: 128, b: 255 });
        expect(ellipseAnnot.innerColor).toEqual({ r: 220, g: 240, b: 255 });
        expect(ellipseAnnot.opacity).toEqual(0.7);
        expect(ellipseAnnot.border.width).toEqual(1);
        expect(ellipseAnnot.border.style).toEqual(PdfBorderStyle.solid);
        document.destroy();
    });
    it('966554 - Properties check', () => {
        let document = new PdfDocument();
        let page: PdfPage = document.addPage();
        //Border Color
        let annot: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 100, y: 100, width: 100, height: 100 });
        annot.borderColor = { r: 255, g: 0, b: 255 };
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 250, y: 100, width: 50, height: 50 });
        annot.borderColor = { r: 0, g: 0, b: 0 };
        page.annotations.add(annot);
        //overlay Text
        annot = new PdfRedactionAnnotation({ x: 100, y: 250, width: 75, height: 50 });
        annot.overlayText = 'Hello World';
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 200, y: 250, width: 150, height: 50 });
        annot.overlayText = 'Redaction is the process of permanently removing visible text or graphics from a document';
        page.annotations.add(annot);
        //Font
        annot = new PdfRedactionAnnotation({ x: 100, y: 350, width: 100, height: 50 });
        annot.overlayText = 'Font 1';
        annot.font = new PdfStandardFont(PdfFontFamily.timesRoman, 12);
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 250, y: 350, width: 100, height: 50 });
        annot.overlayText = 'Font 2';
        annot.font = new PdfTrueTypeFont(ttfArialBase64, 12);
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 100, y: 450, width: 150, height: 50 });
        annot.overlayText = 'Font 3';
        annot.font = new PdfStandardFont(PdfFontFamily.timesRoman, 12);
        page.annotations.add(annot);
        // Repeat text
        annot = new PdfRedactionAnnotation({ x: 100, y: 500, width: 150, height: 50 });
        annot.text = 'Hello World';
        annot.repeatText = true;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 100, y: 550, width: 150, height: 50 });
        annot.text = 'Hello World';
        annot.repeatText = false;
        page.annotations.add(annot);
        expect(page.annotations.count).toEqual(9);
        expect(page._pageDictionary.get('Annots').length).toEqual(9);
        page = document.addPage();
        // Text Alignment
        annot = new PdfRedactionAnnotation({ x: 50, y: 50, width: 100, height: 50 });
        annot.text = 'Text Alignmnt check';
        annot.textAlignment = PdfTextAlignment.center;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 50, y: 110, width: 100, height: 50 });
        annot.text = 'Text Alignmnt check';
        annot.textAlignment = PdfTextAlignment.justify;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 50, y: 170, width: 100, height: 50 });
        annot.text = 'Text Alignmnt check';
        annot.textAlignment = PdfTextAlignment.right;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 50, y: 230, width: 100, height: 50 });
        annot.text = 'Text Alignmnt check';
        annot.textAlignment = PdfTextAlignment.left;
        page.annotations.add(annot);
        // Text Color
        annot = new PdfRedactionAnnotation({ x: 50, y: 290, width: 100, height: 50 });
        annot.textColor = { r: 255, g: 255, b: 0 };
        page.annotations.add(annot);
        // annotation flag
        annot = new PdfRedactionAnnotation({ x: 50, y: 350, width: 100, height: 50 });
        annot.flags = PdfAnnotationFlag.locked;
        page.annotations.add(annot);
        //Border
        annot = new PdfRedactionAnnotation({ x: 50, y: 400, width: 100, height: 50 });
        annot.border = new PdfAnnotationBorder({ width: 5, hRadius: 2, vRadius: 3, style: PdfBorderStyle.dashed, dash: [1, 2, 1] });
        page.annotations.add(annot);
        //Author
        annot = new PdfRedactionAnnotation({ x: 50, y: 450, width: 100, height: 50 });
        annot.author = 'Redaction Annotation 1';
        page.annotations.add(annot);
        //Bounds
        annot = new PdfRedactionAnnotation({ x: 100, y: 50, width: 100, height: 50 });
        annot.bounds = { x: 10, y: 10, width: 150, height: 5 };
        page.annotations.add(annot);
        //Color
        annot = new PdfRedactionAnnotation({ x: 100, y: 150, width: 100, height: 50 });
        annot.color = { r: 255, g: 0, b: 0 };
        page.annotations.add(annot);
        //Inner Color
        annot = new PdfRedactionAnnotation({ x: 100, y: 200, width: 100, height: 50 });
        annot.innerColor = { r: 255, g: 0, b: 255 };
        page.annotations.add(annot);
        // Layer
        annot = new PdfRedactionAnnotation({ x: 100, y: 250, width: 100, height: 50 });
        let layers: PdfLayerCollection = document.layers;
        let layer: PdfLayer = layers.add('Layer1');
        annot.layer = layer;
        page.annotations.add(annot);
        // Modified date
        annot = new PdfRedactionAnnotation({ x: 100, y: 300, width: 100, height: 50 });
        annot.modifiedDate = new Date();
        page.annotations.add(annot);
        // Name
        annot = new PdfRedactionAnnotation({ x: 100, y: 350, width: 100, height: 50 });
        annot.name = 'Redaction';
        page.annotations.add(annot);
        //Opacity
        annot = new PdfRedactionAnnotation({ x: 100, y: 400, width: 100, height: 50 });
        annot.opacity = 0.5;
        page.annotations.add(annot);
        //Rotation
        annot = new PdfRedactionAnnotation({ x: 100, y: 450, width: 100, height: 50 });
        annot.rotationAngle = PdfRotationAngle.angle0;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 100, y: 500, width: 100, height: 50 });
        annot.rotationAngle = PdfRotationAngle.angle180;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 200, y: 50, width: 100, height: 50 });
        annot.rotationAngle = PdfRotationAngle.angle270;
        page.annotations.add(annot);
        annot = new PdfRedactionAnnotation({ x: 200, y: 100, width: 100, height: 50 });
        annot.rotationAngle = PdfRotationAngle.angle90;
        page.annotations.add(annot);
        //Subject
        annot = new PdfRedactionAnnotation({ x: 200, y: 150, width: 100, height: 50 });
        annot.subject = 'Hello Redaction';
        page.annotations.add(annot);
        //Text
        annot = new PdfRedactionAnnotation({ x: 200, y: 200, width: 100, height: 50 });
        annot.text = 'Redaction text';
        page.annotations.add(annot);
        expect(page.annotations.count).toEqual(21);
        expect(page._pageDictionary.get('Annots').length).toEqual(21);
        page = document.addPage();
        //Appearance Fill color
        annot = new PdfRedactionAnnotation({ x: 100, y: 100, width: 100, height: 50 });
        annot.appearanceFillColor = { r: 255, g: 255, b: 0 };
        page.annotations.add(annot);
        //comments
        annot = new PdfRedactionAnnotation({ x: 100, y: 150, width: 100, height: 50 });
        let popup: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', { x: 10, y: 40, width: 30, height: 30 });
        annot.comments.add(popup);
        page.annotations.add(annot);
        //Review History
        annot = new PdfRedactionAnnotation({ x: 100, y: 200, width: 100, height: 50 });
        const popup1: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup', { x: 0, y: 0, width: 30, height: 30 });
        popup1.author = 'Syncfusion';
        popup1.text = 'This is first review';
        popup1.state = PdfAnnotationState.marked;
        popup1.stateModel = PdfAnnotationStateModel.marked;
        annot.reviewHistory.add(popup1);
        page.annotations.add(annot);
        expect(page.annotations.count).toEqual(5);
        expect(page._pageDictionary.get('Annots').length).toEqual(5);
        let update = document.save();
        document = new PdfDocument(update);
        page = document.getPage(0);
        expect(page.annotations.count).toEqual(9);
        expect(page._pageDictionary.get('Annots').length).toEqual(9);
        //Border Color
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.borderColor).toEqual({ r: 255, g: 0, b: 255 });
        let borderColor: number[] = annot._dictionary.get('OC');
        expect(borderColor).toBeDefined();
        expect(borderColor.length).toEqual(3);
        expect(borderColor[0]).toEqual(1);
        expect(borderColor[1]).toEqual(0);
        expect(borderColor[2]).toEqual(1);
        annot.borderColor = { r: 0, g: 0, b: 255 };
        annot = page.annotations.at(1) as PdfRedactionAnnotation;
        expect(annot.borderColor).toEqual({ r: 0, g: 0, b: 0 });
        borderColor = annot._dictionary.get('OC');
        expect(borderColor).toBeDefined();
        expect(borderColor.length).toEqual(3);
        expect(borderColor[0]).toEqual(0);
        expect(borderColor[1]).toEqual(0);
        expect(borderColor[2]).toEqual(0);
        annot.borderColor = { r: 1, g: 1, b: 1 };
        //Overlay text
        annot = page.annotations.at(2) as PdfRedactionAnnotation;
        expect(annot.overlayText).toEqual('Hello World');
        expect(annot._dictionary.get('OverlayText')).toEqual('Hello World');
        annot.overlayText = 'Modified Overlay text 1';
        annot = page.annotations.at(3) as PdfRedactionAnnotation;
        expect(annot.overlayText).toEqual('Redaction is the process of permanently removing visible text or graphics from a document');
        expect(annot._dictionary.get('OverlayText')).toEqual('Redaction is the process of permanently removing visible text or graphics from a document');
        annot.overlayText = 'Modified Overlay text 2';
        // Repeat Text
        annot = page.annotations.at(7) as PdfRedactionAnnotation;
        expect(annot.repeatText).toEqual(true);
        expect(annot._dictionary.get('Repeat')).toEqual(true);
        annot = page.annotations.at(8) as PdfRedactionAnnotation;
        expect(annot.repeatText).toEqual(false);
        expect(annot._dictionary.get('Repeat')).toEqual(false);
        //Text Alignment
        page = document.getPage(1);
        expect(page.annotations.count).toEqual(21);
        expect(page._pageDictionary.get('Annots').length).toEqual(21);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.textAlignment).toEqual(PdfTextAlignment.center);
        expect(annot._dictionary.get('Q')).toEqual(1);
        annot = page.annotations.at(1) as PdfRedactionAnnotation;
        expect(annot.textAlignment).toEqual(PdfTextAlignment.justify);
        expect(annot._dictionary.get('Q')).toEqual(3);
        annot = page.annotations.at(2) as PdfRedactionAnnotation;
        expect(annot.textAlignment).toEqual(PdfTextAlignment.right);
        expect(annot._dictionary.get('Q')).toEqual(2);
        annot = page.annotations.at(3) as PdfRedactionAnnotation;
        expect(annot.textAlignment).toEqual(PdfTextAlignment.left);
        //Text Color
        annot = page.annotations.at(4) as PdfRedactionAnnotation;
        expect(annot.textColor).toEqual({ r: 255, g: 255, b: 0 });
        let textColor: number[] = annot._dictionary.get('C');
        expect(textColor.length).toEqual(3);
        expect(textColor[0]).toEqual(1);
        expect(textColor[1]).toEqual(1);
        expect(textColor[2]).toEqual(0);
        annot.textColor = { r: 0, g: 0, b: 255 };
        //Annotation flag
        annot = page.annotations.at(5) as PdfRedactionAnnotation;
        expect(annot.flags).toEqual(PdfAnnotationFlag.locked);
        expect(annot._dictionary.get('F')).toEqual(128);
        annot.flags = PdfAnnotationFlag.default;
        //Border
        annot = page.annotations.at(6) as PdfRedactionAnnotation;
        expect(annot.border.width).toEqual(5);
        expect(annot.border.hRadius).toEqual(2);
        expect(annot.border.vRadius).toEqual(3);
        expect(annot.border.style).toEqual(PdfBorderStyle.dashed);
        let border: Array<number> = annot._dictionary.getArray('Border') as Array<number>;
        if (border && border.length >= 3) {
            border[0] = 2;
            border[1] = 3;
            border[2] = 5;
        }
        annot.border.width = 3;
        annot.border.hRadius = 1;
        annot.border.vRadius = 1;
        //Author
        annot = page.annotations.at(7) as PdfRedactionAnnotation;
        expect(annot.author).toEqual('Redaction Annotation 1');
        expect(annot._dictionary.get('T')).toEqual('Redaction Annotation 1');
        annot.author = 'Redaction author';
        //Bounds
        annot = page.annotations.at(8) as PdfRedactionAnnotation;
        expect(annot.bounds).toEqual({ x: 50, y: 50, width: 150, height: 5 });
        annot.bounds = { x: 150, y: 150, width: 150, height: 50 };
        //Color
        annot = page.annotations.at(9) as PdfRedactionAnnotation;
        expect(annot.color).toEqual({ r: 255, g: 0, b: 0 });
        let colorArray1 = annot._dictionary.getArray('C') as Array<number>;
        expect(colorArray1[0]).toEqual(1);
        expect(colorArray1[1]).toEqual(0);
        expect(colorArray1[2]).toEqual(0);
        annot.color = { r: 255, g: 255, b: 0 };
        //Inner Color
        annot = page.annotations.at(10) as PdfRedactionAnnotation;
        expect(annot.innerColor).toEqual({ r: 255, g: 0, b: 255 });
        let innerColor: number[] = annot._dictionary.getArray('IC') as number[];
        expect(innerColor[0]).toEqual(1);
        expect(innerColor[1]).toEqual(0);
        expect(innerColor[2]).toEqual(1);
        annot.innerColor = { r: 255, g: 0, b: 0 };
        //Layer
        annot = page.annotations.at(11) as PdfRedactionAnnotation;
        expect(annot.layer.name).toEqual('Layer1');
        let layerDict = annot.layer._dictionary;
        expect(layerDict.get('Name')).toEqual('Layer1');
        annot.layer.name = 'Modified layer';
        annot = page.annotations.at(13) as PdfRedactionAnnotation;
        expect(annot.name).toEqual('Redaction');
        expect(annot._dictionary.get('NM')).toEqual('Redaction');
        annot.name = 'Redaction Name';
        //Opacity
        annot = page.annotations.at(14) as PdfRedactionAnnotation;
        expect(annot.opacity).toEqual(0.5);
        expect(annot._dictionary.get('CA')).toEqual(0.5);
        annot.opacity = 0.2;
        //Rotation angle
        annot = page.annotations.at(15) as PdfRedactionAnnotation;
        expect(annot.rotationAngle).toEqual(PdfRotationAngle.angle0);
        expect(annot._dictionary.get('Rotate') / 90).toEqual(0);
        annot = page.annotations.at(16) as PdfRedactionAnnotation;
        expect(annot.rotationAngle).toEqual(PdfRotationAngle.angle180);
        expect(annot._dictionary.get('Rotate') / 90).toEqual(2);
        annot = page.annotations.at(17) as PdfRedactionAnnotation;
        expect(annot.rotationAngle).toEqual(PdfRotationAngle.angle270);
        expect(annot._dictionary.get('Rotate') / 90).toEqual(3);
        annot = page.annotations.at(18) as PdfRedactionAnnotation;
        expect(annot.rotationAngle).toEqual(PdfRotationAngle.angle90);
        expect(annot._dictionary.get('Rotate') / 90).toEqual(1);
        //subject
        annot = page.annotations.at(19) as PdfRedactionAnnotation;
        expect(annot.subject).toEqual('Hello Redaction');
        expect(annot._dictionary.get('Subject', 'Subj')).toEqual('Hello Redaction');
        annot.subject = 'Modified subject';
        //text
        annot = page.annotations.at(20) as PdfRedactionAnnotation;
        expect(annot.text).toEqual('Redaction text');
        expect(annot._dictionary.get('Contents')).toEqual('Redaction text');
        annot.text = 'Modified text';
        //Appearance fill color
        page = document.getPage(2);
        expect(page.annotations.count).toEqual(5);
        expect(page._pageDictionary.get('Annots').length).toEqual(5);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.appearanceFillColor).toEqual({ r: 255, g: 255, b: 0 });
        let appearanceColor: number[] = annot._dictionary.getArray('AFC') as number[];
        expect(appearanceColor[0]).toEqual(1);
        expect(appearanceColor[1]).toEqual(1);
        expect(appearanceColor[2]).toEqual(0);
        annot.appearanceFillColor = { r: 0, g: 0, b: 0 };
        annot = page.annotations.at(1) as PdfRedactionAnnotation;
        expect(annot.comments.count).toEqual(1);
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            for (let j: number = 0; j < page.annotations.count; j++) {
                let annot = page.annotations.at(j);
                annot.setAppearance(true);
            }
        }
        update = document.save();
        document = new PdfDocument(update);
        page = document.getPage(0);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.borderColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot._dictionary.has('AP')).toBeTruthy();
        let appearance: _PdfStream = annot._dictionary.get('AP').get('N');
        expect(appearance).not.toBeUndefined();
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result).not.toBeUndefined();
        expect(result.length).toEqual(10);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '100.00']);
        expect(result[1]._operator).toEqual('CS');
        expect(result[1]._operands).toEqual(['/DeviceRGB']);
        expect(result[2]._operator).toEqual('cs');
        expect(result[2]._operands).toEqual(['/DeviceRGB']);
        expect(result[3]._operator).toEqual('d');
        expect(result[3]._operands).toEqual(['[]', '0']);
        expect(result[4]._operator).toEqual('w');
        expect(result[4]._operands).toEqual(['1.000']);
        expect(result[5]._operator).toEqual('j');
        expect(result[5]._operands).toEqual(['0']);
        expect(result[6]._operator).toEqual('J');
        expect(result[6]._operands).toEqual(['0']);
        expect(result[7]._operator).toEqual('RG');
        expect(result[7]._operands).toEqual(['0.000', '0.000', '1.000']);
        expect(result[8]._operator).toEqual('re');
        expect(result[8]._operands).toEqual(['0.000', '0.000', '100.000', '-100.000']);
        expect(result[9]._operator).toEqual('S');
        expect(result[9]._operands).toEqual([]);
        annot = page.annotations.at(1) as PdfRedactionAnnotation;
        expect(annot.borderColor).toEqual({ r: 1, g: 1, b: 1 });
        expect(annot._dictionary.has('AP')).toBeTruthy();
        appearance = annot._dictionary.get('AP').get('N');
        expect(appearance).not.toBeUndefined();
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result).not.toBeUndefined();
        expect(result.length).toEqual(10);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('CS');
        expect(result[1]._operands).toEqual(['/DeviceRGB']);
        expect(result[2]._operator).toEqual('cs');
        expect(result[2]._operands).toEqual(['/DeviceRGB']);
        expect(result[3]._operator).toEqual('d');
        expect(result[3]._operands).toEqual(['[]', '0']);
        expect(result[4]._operator).toEqual('w');
        expect(result[4]._operands).toEqual(['1.000']);
        expect(result[5]._operator).toEqual('j');
        expect(result[5]._operands).toEqual(['0']);
        expect(result[6]._operator).toEqual('J');
        expect(result[6]._operands).toEqual(['0']);
        expect(result[7]._operator).toEqual('RG');
        expect(result[7]._operands).toEqual(['0.004', '0.004', '0.004']);
        expect(result[8]._operator).toEqual('re');
        expect(result[8]._operands).toEqual(['0.000', '0.000', '50.000', '-50.000']);
        expect(result[9]._operator).toEqual('S');
        expect(result[9]._operands).toEqual([]);
        // Overlay text
        annot = page.annotations.at(2) as PdfRedactionAnnotation;
        expect(annot._dictionary.has('AP')).toBeTruthy();
        appearance = annot._dictionary.get('AP').get('N');
        expect(appearance).not.toBeUndefined();
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result).not.toBeUndefined();
        expect(result.length).toEqual(3);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[1]._operator).toEqual('re');
        expect(result[1]._operands).toEqual(['0.000', '0.000', '75.000', '-50.000']);
        expect(result[2]._operator).toEqual('n');
        expect(result[2]._operands).toEqual([]);
        annot = page.annotations.at(3) as PdfRedactionAnnotation;
        expect(annot._dictionary.has('AP')).toBeTruthy();
        appearance = annot._dictionary.get('AP').get('N');
        expect(appearance).not.toBeUndefined();
        parser = new _ContentParser(appearance.getBytes());
        result = parser._readContent();
        expect(result).not.toBeUndefined();
        expect(result[1]._operator).toEqual('re');
        expect(result[1]._operands).toEqual(['0.000', '0.000', '150.000', '-50.000']);
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '50.00']);
        expect(result[0]._operator).toEqual('cm');
        //text Color
        page = document.getPage(1);
        annot = page.annotations.at(4) as PdfRedactionAnnotation;
        expect(annot._dictionary.has('AP')).toBeTruthy();
        expect(annot.textColor).toEqual({ r: 0, g: 0, b: 255 });
        textColor = annot._dictionary.get('C');
        expect(textColor.length).toEqual(3);
        expect(textColor[0]).toEqual(0);
        expect(textColor[1]).toEqual(0);
        expect(textColor[2]).toEqual(1);
        //Flag
        annot = page.annotations.at(5) as PdfRedactionAnnotation;
        expect(annot._dictionary.has('AP')).toBeTruthy();
        expect(annot.flags).toEqual(PdfAnnotationFlag.default);
        expect(annot._dictionary.get('F')).toEqual(0);
        //Border
        annot = page.annotations.at(6) as PdfRedactionAnnotation;
        expect(annot._dictionary.has('AP')).toBeTruthy();
        expect(annot.border.width).toEqual(3);
        expect(annot.border.hRadius).toEqual(1);
        expect(annot.border.vRadius).toEqual(1);
        expect(annot.border.style).toEqual(PdfBorderStyle.dashed);
        border = annot._dictionary.getArray('Border') as Array<number>;
        if (border && border.length >= 3) {
            border[0] = 1;
            border[1] = 1;
            border[2] = 3;
        }
        //Author
        annot = page.annotations.at(7) as PdfRedactionAnnotation;
        expect(annot.author).toEqual('Redaction author');
        expect(annot._dictionary.get('T')).toEqual('Redaction author');
        //Bounds
        annot = page.annotations.at(8) as PdfRedactionAnnotation;
        expect(annot.bounds).toEqual({ x: 50, y: 50, width: 150, height: 5 });
        //Color
        annot = page.annotations.at(9) as PdfRedactionAnnotation;
        expect(annot.color).toEqual({ r: 255, g: 255, b: 0 });
        colorArray1 = annot._dictionary.getArray('C') as Array<number>;
        expect(colorArray1[0]).toEqual(1);
        expect(colorArray1[1]).toEqual(1);
        expect(colorArray1[2]).toEqual(0);
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            for (let j: number = 0; j < page.annotations.count; j++) {
                let annot = page.annotations.at(j);
                annot.flatten = true;
            }
        }
        //InnerColor
        annot = page.annotations.at(10) as PdfRedactionAnnotation;
        expect(annot.innerColor).toEqual({ r: 255, g: 0, b: 0 });
        innerColor = annot._dictionary.getArray('IC') as number[];
        expect(innerColor[0]).toEqual(1);
        expect(innerColor[1]).toEqual(0);
        expect(innerColor[2]).toEqual(0);
        //Layer
        annot = page.annotations.at(11) as PdfRedactionAnnotation;
        expect(annot.layer.name).toEqual('Modified layer');
        layerDict = annot.layer._dictionary;
        expect(layerDict.get('Name')).toEqual('Modified layer');
        //Name
        annot = page.annotations.at(13) as PdfRedactionAnnotation;
        expect(annot.name).toEqual('Redaction Name');
        expect(annot._dictionary.get('NM')).toEqual('Redaction Name');
        //Opacity
        annot = page.annotations.at(14) as PdfRedactionAnnotation;
        expect(annot.opacity).toEqual(0.2);
        expect(annot._dictionary.get('CA')).toEqual(0.2);
        //Subject
        annot = page.annotations.at(19) as PdfRedactionAnnotation;
        expect(annot.subject).toEqual('Modified subject');
        expect(annot._dictionary.get('Subject', 'Subj')).toEqual('Modified subject');
        //text
        annot = page.annotations.at(20) as PdfRedactionAnnotation;
        expect(annot.text).toEqual('Modified text');
        expect(annot._dictionary.get('Contents')).toEqual('Modified text');
        //appearance fill color
        page = document.getPage(2);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.appearanceFillColor).toEqual({ r: 0, g: 0, b: 0 });
        appearanceColor = annot._dictionary.getArray('AFC') as number[];
        expect(appearanceColor[0]).toEqual(0);
        expect(appearanceColor[1]).toEqual(0);
        expect(appearanceColor[2]).toEqual(0);
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            for (let j: number = 0; j < page.annotations.count; j++) {
                let annot = page.annotations.at(j);
                annot.flatten = true;
            }
        }
        update = document.save();
        document = new PdfDocument(update);
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            expect(page.annotations.count).toEqual(0);
        }
        document.destroy();
    });
    it('966554 -  Bounds collection creation', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let annot: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 100, y: 100, width: 300, height: 200 });
        annot.boundsCollection = [
            { x: 50, y: 50, width: 100, height: 100 },
            { x: 200, y: 100, width: 60, height: 30 },
            { x: 100, y: 400, width: 60, height: 30 }
        ];
        annot.overlayText = "Confidential";
        annot.repeatText = true;
        annot.appearanceFillColor = { r: 255, g: 0, b: 0 };
        annot.textColor = { r: 0, g: 0, b: 255 };
        annot.opacity = 0.5;
        annot.innerColor = { r: 0, g: 255, b: 0 };
        annot.textAlignment = PdfTextAlignment.center;
        annot.author = "QA Tester";
        annot.subject = "Redaction Test";
        page.annotations.add(annot);
        let savedBytes = document.save();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.boundsCollection).toEqual([
            { x: 140, y: 140, width: 300, height: 200 },
            { x: 240, y: 140, width: 60, height: 30 },
            { x: 140, y: 440, width: 60, height: 30 }
        ]);
        expect(annot.overlayText).toBe("Confidential");
        expect(annot.repeatText).toBe(true);
        expect(annot.appearanceFillColor).toEqual({ r: 255, g: 0, b: 0 });
        expect(annot.textColor).toEqual({ r: 0, g: 0, b: 255 });
        expect(annot.opacity).toBe(0.5);
        expect(annot.innerColor).toEqual({ r: 0, g: 255, b: 0 });
        expect(annot.textAlignment).toBe(PdfTextAlignment.center);
        expect(annot.author).toBe("QA Tester");
        expect(annot.subject).toBe("Redaction Test");
        expect(annot._dictionary.get('AFC')).toEqual([1, 0, 0]);
        expect(annot._dictionary.get('OverlayText')).toBe("Confidential");
        expect(annot._dictionary.get('Repeat')).toBe(true);
        expect(annot._dictionary.get('C')).toEqual([0, 0, 1]);
        expect(annot._dictionary.get('IC')).toEqual([0, 1, 0]);
        expect(annot._dictionary.get('CA')).toBe(0.5);
        expect(annot._dictionary.get('T')).toBe("QA Tester");
        expect(annot._dictionary.get('Subj')).toBe("Redaction Test");
        annot.setAppearance(true);
        savedBytes = document.save();
        document = new PdfDocument(savedBytes);
        page = document.getPage(0);
        annot = page.annotations.at(0) as PdfRedactionAnnotation;
        let appearance = annot._dictionary.get('AP').get('N');
        expect(appearance).not.toBeUndefined();
        let stream = appearance as _PdfContentStream;
        let parser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result.length).toEqual(21);
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '330.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands).toEqual([]);
        expect(result[2]._operator).toEqual('gs');
        expect(result[3]._operator).toEqual('CS');
        expect(result[3]._operands).toEqual(['/DeviceRGB']);
        expect(result[4]._operator).toEqual('cs');
        expect(result[4]._operands).toEqual(['/DeviceRGB']);
        expect(result[5]._operator).toEqual('rg');
        expect(result[5]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[6]._operator).toEqual('re');
        expect(result[6]._operands).toEqual(['0.000', '0.000', '300.000', '-200.000']);
        expect(result[7]._operator).toEqual('f');
        expect(result[7]._operands).toEqual([]);
        expect(result[8]._operator).toEqual('Q');
        expect(result[8]._operands).toEqual([]);
        expect(result[9]._operator).toEqual('q');
        expect(result[9]._operands).toEqual([]);
        expect(result[10]._operator).toEqual('gs');
        expect(result[11]._operator).toEqual('rg');
        expect(result[11]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[12]._operator).toEqual('re');
        expect(result[12]._operands).toEqual(['100.000', '0.000', '60.000', '-30.000']);
        expect(result[13]._operator).toEqual('f');
        expect(result[13]._operands).toEqual([]);
        expect(result[14]._operator).toEqual('Q');
        expect(result[14]._operands).toEqual([]);
        expect(result[15]._operator).toEqual('q');
        expect(result[15]._operands).toEqual([]);
        expect(result[16]._operator).toEqual('gs');
        expect(result[17]._operator).toEqual('rg');
        expect(result[17]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[18]._operator).toEqual('re');
        expect(result[18]._operands).toEqual(['0.000', '-300.000', '60.000', '-30.000']);
        expect(result[19]._operator).toEqual('f');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('Q');
        expect(result[20]._operands).toEqual([]);
        let appearanceR = annot._dictionary.get('AP').get('R');
        expect(appearanceR).not.toBeUndefined();
        stream = appearanceR as _PdfContentStream;
        parser = new _ContentParser(stream.getBytes());
        result = parser._readContent();
        expect(result[6]._operator).toEqual('re');
        expect(result[6]._operands).toEqual(['0.000', '0.000', '300.000', '-200.000']);
        expect(result[12]._operands).toEqual(['0.000', '-300.000', '60.000', '-30.000']);
        annot.flatten = true;
        savedBytes = document.save();
        document = new PdfDocument(savedBytes);
        expect(document.getPage(0).annotations.count).toEqual(0);
        document.destroy();
    });
    it('966554 - PdfRedactionAnnotation constructor full coverage', () => {
        let document = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        let annotation = new PdfRedactionAnnotation({ x: 10, y: 20, width: 100, height: 50 }, {
            borderColor: { r: 255, g: 0, b: 0 },
            repeatText: true,
            overlayText: 'Confidential',
            font: font,
            textColor: { r: 0, g: 255, b: 0 },
            appearanceFillColor: { r: 200, g: 200, b: 200 },
            innerColor: { r: 100, g: 100, b: 100 },
            textAlignment: PdfTextAlignment.center,
            text: 'Redacted Text',
            author: 'Syncfusion',
            subject: 'Test Subject',
            opacity: 0.75,
            boundsCollection: [{ x: 10, y: 10, width: 50, height: 50 }, { x: 100, y: 100, width: 200, height: 200 }]
        });
        page.annotations.add(annotation);
        const update = document.save();
        document = new PdfDocument(update);
        annotation = document.getPage(0).annotations.at(0) as PdfRedactionAnnotation;
        expect(annotation.borderColor).toEqual({ r: 255, g: 0, b: 0 });
        expect(annotation._dictionary.getArray('OC')).toBeDefined();
        let borderColor: number[] = annotation._dictionary.get('OC');
        expect(borderColor).toBeDefined();
        expect(borderColor.length).toEqual(3);
        expect(borderColor[0]).toEqual(1);
        expect(borderColor[1]).toEqual(0);
        expect(borderColor[2]).toEqual(0);
        expect(annotation.repeatText).toEqual(true);
        expect(annotation._dictionary.get('Repeat')).toEqual(true);
        expect(annotation.overlayText).toEqual('Confidential');
        expect(annotation._dictionary.get('OverlayText')).toEqual('Confidential');
        expect(annotation.textColor).toEqual({ r: 0, g: 255, b: 0 });
        let textColor: number[] = annotation._dictionary.get('C');
        expect(textColor).toBeDefined();
        expect(textColor.length).toEqual(3);
        expect(textColor[0]).toEqual(0);
        expect(textColor[1]).toEqual(1);
        expect(textColor[2]).toEqual(0);
        expect(annotation.appearanceFillColor).toEqual({ r: 200, g: 200, b: 200 });
        let appearanceFillColor: number[] = annotation._dictionary.get('AFC');
        expect(appearanceFillColor).toBeDefined();
        expect(appearanceFillColor.length).toEqual(3);
        expect(appearanceFillColor[0]).toEqual(0.784);
        expect(appearanceFillColor[1]).toEqual(0.784);
        expect(appearanceFillColor[2]).toEqual(0.784);
        expect(annotation.innerColor).toEqual({ r: 100, g: 100, b: 100 });
        let innerColor: number[] = annotation._dictionary.get('IC');
        expect(innerColor).toBeDefined();
        expect(innerColor.length).toEqual(3);
        expect(innerColor[0]).toEqual(0.3921569);
        expect(innerColor[1]).toEqual(0.3921569);
        expect(innerColor[2]).toEqual(0.3921569);
        expect(annotation.boundsCollection).toEqual([{ x: 50, y: 60, width: 100, height: 50 }, { x: 140, y: 140, width: 200, height: 200 }]);
        expect(annotation._dictionary.get('QuadPoints')).toEqual([50, 782, 150, 782, 50, 732, 150, 732, 140, 702, 340, 702, 140, 502, 340, 502,])
        expect(annotation.textAlignment).toEqual(PdfTextAlignment.center);
        expect(annotation._dictionary.get('Q')).toEqual(1);
        expect(annotation.text).toEqual('Redacted Text');
        expect(annotation._dictionary.get('Contents')).toEqual('Redacted Text');
        expect(annotation.author).toEqual('Syncfusion');
        expect(annotation._dictionary.get('T')).toEqual('Syncfusion');
        expect(annotation.subject).toEqual('Test Subject');
        expect(annotation._dictionary.get('Subj')).toEqual('Test Subject');
        expect(annotation.opacity).toEqual(0.75);
        expect(annotation._dictionary.get('Q')).toEqual(1);
    });
    it('966554 - appearanceFillColor setter updates when second or third component differs', () => {
        let document = new PdfDocument();
        const page: PdfPage = document.addPage();
        let annot = new PdfRedactionAnnotation({ x: 50, y: 50, width: 100, height: 50 });
        annot.appearanceFillColor = { r: 100, g: 150, b: 200 };
        annot.appearanceFillColor = { r: 100, g: 151, b: 200 };
        expect(annot.appearanceFillColor).toEqual({ r: 100, g: 151, b: 200 });
        annot.appearanceFillColor = { r: 100, g: 151, b: 201 };
        expect(annot.appearanceFillColor).toEqual({ r: 100, g: 151, b: 201 });
        page.annotations.add(annot);
        let update = document.save();
        document = new PdfDocument(update);
        annot = document.getPage(0).annotations.at(0) as PdfRedactionAnnotation;
        expect(annot.appearanceFillColor).toEqual({ r: 100, g: 151, b: 201 });
        const afc = annot._dictionary.get('AFC');
        expect(afc).toEqual([
            Number.parseFloat((100 / 255).toFixed(3)),
            Number.parseFloat((151 / 255).toFixed(3)),
            Number.parseFloat((201 / 255).toFixed(3))
        ]);
    });
    it('966554 - boundsCollection setter full coverage', () => {
        let document = new PdfDocument();
        const page: PdfPage = document.addPage();
        let annot = new PdfRedactionAnnotation({ x: 10, y: 10, width: 100, height: 50 });
        annot.boundsCollection = [];
        page.annotations.add(annot);
        let update = document.save();
        document = new PdfDocument(update);
        annot = document.getPage(0).annotations.at(0) as PdfRedactionAnnotation;
        expect(annot._dictionary.getArray('QuadPoints').length).toEqual(8);
        annot.boundsCollection = [{ x: 10, y: 10, width: 50, height: 20 }];
        const newBounds = [{ x: 10, y: 10, width: 50, height: 21 }];
        annot.boundsCollection = newBounds;
        update = document.save();
        document = new PdfDocument(update);
        annot = document.getPage(0).annotations.at(0) as PdfRedactionAnnotation;
        expect(annot._dictionary.get('QuadPoints')).toEqual([
            10,
            page.size.height - 10,
            60,
            page.size.height - 10,
            10,
            page.size.height - 10 - 21,
            60,
            page.size.height - 10 - 21
        ]);
    });
    it('966554 - bounds error', () => {
        try {
            const annot = new PdfRedactionAnnotation();
        } catch (error) {
            expect(error.message).toBe('Bounds cannot be null or undefined');
        }
    });
    it('999946 - Line Measurement Annotation Visible issue', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let lineAnnotation: PdfLineAnnotation = new PdfLineAnnotation({ x: 80, y: 420 }, { x: 300, y: 420 }, {
            text: 'Line Annotation',
            author: 'Syncfusion',
            color: { r: 255, g: 0, b: 0 },
            innerColor: { r: 255, g: 255, b: 0 },
            lineEndingStyle: new PdfAnnotationLineEndingStyle({ begin: PdfLineEndingStyle.circle, end: PdfLineEndingStyle.diamond }),
            opacity: 0.5,
            measurementUnit: PdfMeasurementUnit.centimeter
        });
        lineAnnotation.leaderExt = 0;
        lineAnnotation.leaderLine = 0;
        lineAnnotation.caption = new PdfAnnotationCaption({ cap: true, type: PdfLineCaptionType.inline });
        page.annotations.add(lineAnnotation);
        let lineAnnotation1: PdfLineAnnotation = new PdfLineAnnotation({ x: 80, y: 220 }, { x: 300, y: 220 }, {
            text: 'Line Annotation',
            author: 'Syncfusion',
            color: { r: 255, g: 0, b: 0 },
            innerColor: { r: 255, g: 255, b: 0 },
            lineEndingStyle: new PdfAnnotationLineEndingStyle({ begin: PdfLineEndingStyle.circle, end: PdfLineEndingStyle.diamond }),
            opacity: 0.5,
        });
        lineAnnotation1.leaderExt = 0;
        lineAnnotation1.setAppearance(true);
        lineAnnotation1.leaderLine = 0;
        lineAnnotation1.caption = new PdfAnnotationCaption({ cap: true, type: PdfLineCaptionType.inline });
        page.annotations.add(lineAnnotation1);
        expect(page.annotations.count).toEqual(2);
        expect(lineAnnotation._dictionary.has('LL')).toBeFalsy();
        expect(lineAnnotation._dictionary.get('C')).toEqual([1, 0, 0]);
        expect(lineAnnotation._dictionary.get('CA')).toEqual(0.5);
        expect(lineAnnotation._dictionary.get('T')).toEqual('Syncfusion');
        expect(lineAnnotation._dictionary.get('Cap')).toEqual(true);
        expect(lineAnnotation._dictionary.get('Contents')).toEqual('Line Annotation');
        expect(lineAnnotation.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnotation.lineEndingStyle.end).toEqual(PdfLineEndingStyle.diamond);
        let ic = lineAnnotation._dictionary.get('IC');
        expect(Array.isArray(ic)).toBe(true);
        expect(ic).toEqual([1, 1, 0]);
        let L = lineAnnotation._dictionary.get('L');
        expect(Array.isArray(L)).toBe(true);
        expect(L).toEqual([80, 420, 300, 420]);
        expect(lineAnnotation1._dictionary.has('LL')).toBeFalsy();
        expect(lineAnnotation1._dictionary.get('C')).toEqual([1, 0, 0]);
        expect(lineAnnotation1._dictionary.get('CA')).toEqual(0.5);
        expect(lineAnnotation1._dictionary.get('T')).toEqual('Syncfusion');
        expect(lineAnnotation1._dictionary.get('Cap')).toEqual(true);
        expect(lineAnnotation1._dictionary.get('Contents')).toEqual('Line Annotation');
        expect(lineAnnotation1.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnotation1.lineEndingStyle.end).toEqual(PdfLineEndingStyle.diamond);
        ic = lineAnnotation1._dictionary.get('IC');
        expect(Array.isArray(ic)).toBe(true);
        expect(ic).toEqual([1, 1, 0]);
        L = lineAnnotation1._dictionary.get('L');
        expect(Array.isArray(L)).toBe(true);
        expect(L).toEqual([80, 220, 300, 220]);
        expect(lineAnnotation1._dictionary.has('LL')).toBeFalsy();
        let updatedData = document.save();
        document.destroy();
        document = new PdfDocument(updatedData);
        page = document.getPage(0) as PdfPage;
        lineAnnotation = page.annotations.at(0) as PdfLineAnnotation;
        lineAnnotation1 = page.annotations.at(1) as PdfLineAnnotation;
        expect(lineAnnotation._dictionary.has('LL')).toBeFalsy();
        expect(lineAnnotation._dictionary.get('C')).toEqual([1, 0, 0]);
        expect(lineAnnotation._dictionary.get('CA')).toEqual(0.5);
        expect(lineAnnotation._dictionary.get('T')).toEqual('Syncfusion');
        expect(lineAnnotation._dictionary.get('Cap')).toEqual(true);
        expect(lineAnnotation._dictionary.get('Contents')).toEqual('Line Annotation 7.76 cm');
        expect(lineAnnotation.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnotation.lineEndingStyle.end).toEqual(PdfLineEndingStyle.diamond);
        ic = lineAnnotation._dictionary.get('IC');
        expect(Array.isArray(ic)).toBe(true);
        expect(ic).toEqual([1, 1, 0]);
        L = lineAnnotation._dictionary.get('L');
        expect(Array.isArray(L)).toBe(true);
        expect(L).toEqual([80, 420, 300, 420]);
        let appearance = lineAnnotation._dictionary.get('AP').get('N')
        let parser: _ContentParser = new _ContentParser(appearance.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        expect(result.length).toEqual(88);
        expect(result[0]._operator).toEqual('q');
        expect(result[1]._operator).toEqual('gs');
        expect(result[1]._operands.length).toBe(1);
        expect(result[2]._operator).toEqual('CS');
        expect(result[2]._operands.length).toBe(1);
        expect(result[3]._operator).toEqual('cs');
        expect(result[3]._operands.length).toBe(1);
        expect(result[4]._operator).toEqual('d');
        expect(result[4]._operands).toEqual(['[]', '0']);
        expect(result[5]._operator).toEqual('w');
        expect(result[5]._operands).toEqual(['1.000']);
        expect(result[6]._operator).toEqual('j');
        expect(result[6]._operands).toEqual(['0']);
        expect(result[7]._operator).toEqual('J');
        expect(result[7]._operands).toEqual(['0']);
        expect(result[8]._operator).toEqual('RG');
        expect(result[8]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[9]._operator).toEqual('m');
        expect(result[9]._operands).toEqual(['80.000', '420.000']);
        expect(result[10]._operator).toEqual('l');
        expect(result[10]._operands).toEqual(['171.215', '420.000']);
        expect(result[11]._operator).toEqual('S');
        expect(result[11]._operands).toEqual([]);
        expect(result[12]._operator).toEqual('d');
        expect(result[12]._operands).toEqual(['[]', '0']);
        expect(result[13]._operator).toEqual('w');
        expect(result[13]._operands).toEqual(['1.000']);
        expect(result[14]._operator).toEqual('j');
        expect(result[14]._operands).toEqual(['0']);
        expect(result[15]._operator).toEqual('J');
        expect(result[15]._operands).toEqual(['0']);
        expect(result[16]._operator).toEqual('RG');
        expect(result[16]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[17]._operator).toEqual('m');
        expect(result[17]._operands.length).toBe(2);
        expect(result[18]._operator).toEqual('l');
        expect(result[18]._operands).toEqual(['208.785', '420.000']);
        expect(result[19]._operator).toEqual('S');
        expect(result[19]._operands).toEqual([]);
        expect(result[20]._operator).toEqual('Q');
        expect(result[20]._operands).toEqual([]);
        expect(result[21]._operator).toEqual('d');
        expect(result[21]._operands).toEqual(['[]', '0']);
        expect(result[22]._operator).toEqual('w');
        expect(result[22]._operands).toEqual(['1.000']);
        expect(result[23]._operator).toEqual('j');
        expect(result[23]._operands).toEqual(['0']);
        expect(result[24]._operator).toEqual('J');
        expect(result[24]._operands).toEqual(['0']);
        expect(result[25]._operator).toEqual('RG');
        expect(result[25]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[26]._operator).toEqual('rg');
        expect(result[26]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[27]._operator).toEqual('m');
        expect(result[27]._operands).toEqual(['83.000', '420.000']);
        expect(result[28]._operator).toEqual('c');
        expect(result[28]._operands).toEqual(['83.000', '418.343', '81.657', '417.000', '80.000', '417.000']);
        expect(result[29]._operator).toEqual('c');
        expect(result[29]._operands).toEqual(['78.343', '417.000', '77.000', '418.343', '77.000', '420.000']);
        expect(result[30]._operator).toEqual('c');
        expect(result[30]._operands).toEqual(['77.000', '421.657', '78.343', '423.000', '80.000', '423.000']);
        expect(result[31]._operator).toEqual('c');
        expect(result[31]._operands).toEqual(['81.657', '423.000', '83.000', '421.657', '83.000', '420.000']);
        expect(result[32]._operator).toEqual('b');
        expect(result[32]._operands).toEqual([]);
        expect(result[33]._operator).toEqual('d');
        expect(result[33]._operands).toEqual(['[]', '0']);
        expect(result[34]._operator).toEqual('w');
        expect(result[34]._operands).toEqual(['1.000']);
        expect(result[35]._operator).toEqual('j');
        expect(result[35]._operands).toEqual(['0']);
        expect(result[36]._operator).toEqual('J');
        expect(result[36]._operands).toEqual(['0']);
        expect(result[37]._operator).toEqual('RG');
        expect(result[37]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[38]._operator).toEqual('rg');
        expect(result[38]._operands).toEqual(['1.000', '1.000', '0.000']);
        expect(result[39]._operator).toEqual('m');
        expect(result[39]._operands).toEqual(['297.000', '420.000']);
        expect(result[40]._operator).toEqual('l');
        expect(result[40]._operands).toEqual(['300.000', '423.000']);
        expect(result[41]._operator).toEqual('l');
        expect(result[41]._operands).toEqual(['303.000', '420.000']);
        expect(result[42]._operator).toEqual('l');
        expect(result[42]._operands).toEqual(['300.000', '417.000']); // from dump
        expect(result[43]._operator).toEqual('b');
        expect(result[43]._operands).toEqual([]);
        expect(result[44]._operator).toEqual('d');
        expect(result[44]._operands).toEqual(['[]', '0']);
        expect(result[45]._operator).toEqual('w');
        expect(result[45]._operands).toEqual(['1.000']);
        expect(result[46]._operator).toEqual('j');
        expect(result[46]._operands).toEqual(['0']);
        expect(result[47]._operator).toEqual('J');
        expect(result[47]._operands).toEqual(['0']);
        expect(result[48]._operator).toEqual('RG');
        expect(result[48]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[49]._operator).toEqual('m');
        expect(result[49]._operands).toEqual(['80.000', '420.000']);
        expect(result[50]._operator).toEqual('l');
        expect(result[50]._operands).toEqual(['80.000', '420.000']);
        expect(result[51]._operator).toEqual('S');
        expect(result[51]._operands).toEqual([]);
        expect(result[52]._operator).toEqual('d');
        expect(result[52]._operands).toEqual(['[]', '0']);
        expect(result[53]._operator).toEqual('w');
        expect(result[53]._operands.length).toBe(1);
        expect(result[54]._operator).toEqual('j');
        expect(result[54]._operands).toEqual(['0']);
        expect(result[55]._operator).toEqual('J');
        expect(result[55]._operands).toEqual(['0']);
        expect(result[56]._operator).toEqual('RG');
        expect(result[56]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[57]._operator).toEqual('m');
        expect(result[57]._operands).toEqual(['300.000', '420.000']);
        expect(result[58]._operator).toEqual('l');
        expect(result[58]._operands).toEqual(['300.000', '420.000']);
        expect(result[59]._operator).toEqual('S');
        expect(result[59]._operands).toEqual([]);
        expect(result[60]._operator).toEqual('d');
        expect(result[60]._operands).toEqual(['[]', '0']);
        expect(result[61]._operator).toEqual('w');
        expect(result[61]._operands.length).toBe(1);
        expect(result[62]._operator).toEqual('j');
        expect(result[62]._operands).toEqual(['0']);
        expect(result[63]._operator).toEqual('J');
        expect(result[63]._operands).toEqual(['0']);
        expect(result[64]._operator).toEqual('RG');
        expect(result[64]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[65]._operator).toEqual('m');
        expect(result[65]._operands).toEqual(['80.000', '420.000']);
        expect(result[66]._operator).toEqual('l');
        expect(result[66]._operands).toEqual(['80.000', '420.000']);
        expect(result[67]._operator).toEqual('S');
        expect(result[67]._operands).toEqual([]);
        expect(result[68]._operator).toEqual('d');
        expect(result[68]._operands).toEqual(['[]', '0']);
        expect(result[69]._operator).toEqual('w');
        expect(result[69]._operands.length).toBe(1);
        expect(result[70]._operator).toEqual('j');
        expect(result[70]._operands).toEqual(['0']);
        expect(result[71]._operator).toEqual('J');
        expect(result[71]._operands).toEqual(['0']);
        expect(result[72]._operator).toEqual('RG');
        expect(result[72]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[73]._operator).toEqual('m');
        expect(result[73]._operands).toEqual(['300.000', '420.000']);
        expect(result[74]._operator).toEqual('l');
        expect(result[74]._operands).toEqual(['300.000', '420.000']);
        expect(result[75]._operator).toEqual('S');
        expect(result[75]._operands).toEqual([]);
        expect(result[76]._operator).toEqual('cm');
        expect(result[76]._operands).toEqual(['1.00', '.00', '.00', '1.00', '190.00', '425.78']);
        expect(result[77]._operator).toEqual('cm');
        expect(result[77]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '.00']);
        expect(result[78]._operator).toEqual('BT');
        expect(result[78]._operands).toEqual([]);
        expect(result[79]._operator).toEqual('rg');
        expect(result[79]._operands).toEqual(['1.000', '0.000', '0.000']);
        expect(result[80]._operator).toEqual('Tf');
        expect(result[80]._operands.length).toBe(2);
        expect(result[81]._operator).toEqual('Tr');
        expect(result[81]._operands).toEqual(['0']);
        expect(result[82]._operator).toEqual('Tc');
        expect(result[82]._operands).toEqual(['0.000']);
        expect(result[83]._operator).toEqual('Tw');
        expect(result[83]._operands).toEqual(['0.000']);
        expect(result[84]._operator).toEqual('Tz');
        expect(result[84]._operands).toEqual(['100.000']);
        expect(result[85]._operator).toEqual('Tm');
        expect(result[85]._operands).toEqual(['1.00', '.00', '.00', '1.00', '-17.79', '-9.31']);
        expect(result[86]._operator).toEqual("'");
        expect(result[86]._operands.length).toBe(1);
        expect(result[86]._operands).toEqual(['(7.76 cm)']);
        expect(result[87]._operator).toEqual('ET');
        expect(result[87]._operands).toEqual([]);
        expect(lineAnnotation1._dictionary.has('LL')).toBeFalsy();
        expect(lineAnnotation1._dictionary.get('C')).toEqual([1, 0, 0]);
        expect(lineAnnotation1._dictionary.get('CA')).toEqual(0.5);
        expect(lineAnnotation1._dictionary.get('T')).toEqual('Syncfusion');
        expect(lineAnnotation1._dictionary.get('Cap')).toEqual(true);
        expect(lineAnnotation1._dictionary.get('Contents')).toEqual('Line Annotation');
        expect(lineAnnotation1.lineEndingStyle.begin).toEqual(PdfLineEndingStyle.circle);
        expect(lineAnnotation1.lineEndingStyle.end).toEqual(PdfLineEndingStyle.diamond);
        ic = lineAnnotation1._dictionary.get('IC');
        expect(Array.isArray(ic)).toBe(true);
        expect(ic).toEqual([1, 1, 0]);
        L = lineAnnotation1._dictionary.get('L');
        expect(Array.isArray(L)).toBe(true);
        expect(L).toEqual([80, 220, 300, 220]);
        expect(lineAnnotation1._dictionary.has('LL')).toBeFalsy();
        document.destroy();
    });
    it('Create annotation in remove and export - all formats', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let lineAnnot1: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 50 }, { x: 250, y: 50 });
        lineAnnot1.subject = 'LineAnnotInNewPage_1';
        page.annotations.add(lineAnnot1);
        let lineAnnot2: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 100 }, { x: 250, y: 100 });
        lineAnnot2.subject = 'LineAnnotInNewPage_2';
        lineAnnot2.setAppearance(true);
        page.annotations.add(lineAnnot2);
        let lineAnnot3: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 150 }, { x: 250, y: 150 });
        lineAnnot3.subject = 'LineAnnotInNewPage_3';
        lineAnnot3.measure = true;
        page.annotations.add(lineAnnot3);
        let lineAnnot4: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 200 }, { x: 250, y: 200 });
        lineAnnot4.subject = 'LineAnnotInNewPage_4';
        lineAnnot4.measure = true;
        lineAnnot4.setAppearance(true);
        page.annotations.add(lineAnnot4);
        expect(page.annotations.count).toEqual(4);
        let annot = page.annotations.at(0) as PdfLineAnnotation;
        page.annotations.remove(annot);
        expect(page.annotations.count).toEqual(3);
        page.annotations.removeAt(page.annotations.count - 1);
        expect(page.annotations.count).toEqual(2);
        let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
        settings.dataFormat = DataFormat.json;
        let exportedData = document.exportAnnotations(settings);
        let bytes = _bytesToString(exportedData);
        expect(bytes.includes('{"pdfAnnotation":{ "0":{"shapeAnnotation":[{"type":"Line","page":"0","start":"10,100","end":"250,100","subject":"LineAnnotInNewPage_2","caption":"false","caption-style":"Inline","leaderLength":"0","leaderExtend":"0","color":"#000000","width":"1","style":"solid","dashes":"","contents":"LineAnnotInNewPage_2","rect":{"x":"1","y":"91","width":"259","height":"109"}},{"type":"Line","page":"0","start":"10,150","end":"250,150","subject":"LineAnnotInNewPage_3","caption":"true","caption-style":"Inline","leaderLength":"0","leaderExtend":"0","color":"#000000","width":"1","style":"solid","dashes":"","rect":{"x":"1","y":"141","width":"259","height":"159"},"defaultStyle":{"font":"Helvetica 10pt","color":"#000000"},"head":"None","tail":"None","contents":"8.47 cm","IT":"LineDimension","LLO":"0","type1":"Measure","ratevalue":"1 cm = 1 cm","area":{"c":"1","f":"D","d":"100","rd":".","u":"sq cm","rt":"","ss":""},"distance":{"c":"1","f":"D","d":"100","rd":".","u":"cm","rt":"","ss":""},"xformat":{"c":"0.0352778","f":"D","d":"100","rd":".","u":"cm","rt":"","ss":""}}]}}}')).toBeTruthy();
        settings.dataFormat = DataFormat.xfdf;
        let xfdfExportedData = document.exportAnnotations(settings);
        bytes = _bytesToString(xfdfExportedData);
        expect(bytes.includes('<?xml version="1.0" encoding="utf-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><annots><line page="0" start="10,100" end="250,100" subject="LineAnnotInNewPage_2" caption="no" caption-style="Inline" leaderLength="0" leaderExtend="0" color="#000000" width="1" style="solid" dashes="" rect="1,91,259,109"><contents>LineAnnotInNewPage_2</contents></line><line page="0" start="10,150" end="250,150" subject="LineAnnotInNewPage_3" caption="yes" caption-style="Inline" leaderLength="0" leaderExtend="0" color="#000000" width="1" style="solid" dashes="" rect="1,141,259,159" head="None" tail="None" IT="LineDimension" llo="0"><measure rateValue="1 cm = 1 cm"><area c="1" f="D" d="100" rd="." u="sq cm" rt="" ss="" /><distance c="1" f="D" d="100" rd="." u="cm" rt="" ss="" /><xformat c="0.0352778" f="D" d="100" rd="." u="cm" rt="" ss="" /></measure><defaultstyle>font:Helvetica 10pt; color:#000000</defaultstyle><contents>8.47 cm</contents></line></annots><f href="" /></xfdf>')).toBeTruthy();
        settings.dataFormat = DataFormat.fdf;
        let fdfExportedData = document.exportAnnotations(settings);
        bytes = _bytesToString(fdfExportedData);
        expect(fdfExportedData).toEqual(new Uint8Array([37, 70, 68, 70, 45, 49, 46, 50, 13, 10, 50, 32, 48, 32, 111, 98, 106, 13, 10, 60, 60, 47, 84, 121, 112, 101, 47, 65, 110, 110, 111, 116, 47, 83, 117, 98, 116, 121, 112, 101, 47, 76, 105, 110, 101, 47, 76, 91, 49, 48, 32, 49, 48, 48, 32, 50, 53, 48, 32, 49, 48, 48, 93, 47, 83, 117, 98, 106, 40, 76, 105, 110, 101, 65, 110, 110, 111, 116, 73, 110, 78, 101, 119, 80, 97, 103, 101, 95, 50, 41, 47, 67, 97, 112, 32, 102, 97, 108, 115, 101, 47, 67, 80, 47, 73, 110, 108, 105, 110, 101, 47, 76, 76, 32, 48, 47, 76, 76, 69, 32, 48, 47, 67, 91, 48, 32, 48, 32, 48, 93, 47, 66, 83, 60, 60, 47, 84, 121, 112, 101, 47, 66, 111, 114, 100, 101, 114, 47, 87, 32, 49, 47, 83, 47, 83, 47, 68, 91, 93, 62, 62, 47, 67, 111, 110, 116, 101, 110, 116, 115, 40, 76, 105, 110, 101, 65, 110, 110, 111, 116, 73, 110, 78, 101, 119, 80, 97, 103, 101, 95, 50, 41, 47, 82, 101, 99, 116, 91, 49, 32, 57, 49, 32, 50, 53, 57, 32, 49, 48, 57, 93, 47, 80, 97, 103, 101, 32, 48, 62, 62, 13, 10, 101, 110, 100, 111, 98, 106, 13, 10, 51, 32, 48, 32, 111, 98, 106, 13, 10, 60, 60, 47, 84, 121, 112, 101, 47, 65, 110, 110, 111, 116, 47, 83, 117, 98, 116, 121, 112, 101, 47, 76, 105, 110, 101, 47, 76, 91, 49, 48, 32, 49, 53, 48, 32, 50, 53, 48, 32, 49, 53, 48, 93, 47, 83, 117, 98, 106, 40, 76, 105, 110, 101, 65, 110, 110, 111, 116, 73, 110, 78, 101, 119, 80, 97, 103, 101, 95, 51, 41, 47, 67, 97, 112, 32, 116, 114, 117, 101, 47, 67, 80, 47, 73, 110, 108, 105, 110, 101, 47, 76, 76, 32, 48, 47, 76, 76, 69, 32, 48, 47, 67, 91, 48, 32, 48, 32, 48, 93, 47, 66, 83, 60, 60, 47, 84, 121, 112, 101, 47, 66, 111, 114, 100, 101, 114, 47, 87, 32, 49, 47, 83, 47, 83, 47, 68, 91, 93, 62, 62, 47, 82, 101, 99, 116, 91, 49, 32, 49, 52, 49, 32, 50, 53, 57, 32, 49, 53, 57, 93, 47, 68, 83, 40, 102, 111, 110, 116, 58, 72, 101, 108, 118, 101, 116, 105, 99, 97, 32, 49, 48, 112, 116, 59, 32, 99, 111, 108, 111, 114, 58, 35, 48, 48, 48, 48, 48, 48, 41, 47, 77, 101, 97, 115, 117, 114, 101, 32, 52, 32, 48, 32, 82, 47, 76, 69, 91, 47, 78, 111, 110, 101, 47, 78, 111, 110, 101, 93, 47, 67, 111, 110, 116, 101, 110, 116, 115, 40, 56, 46, 52, 55, 32, 99, 109, 41, 47, 73, 84, 47, 76, 105, 110, 101, 68, 105, 109, 101, 110, 115, 105, 111, 110, 47, 76, 76, 79, 32, 48, 47, 80, 97, 103, 101, 32, 48, 62, 62, 13, 10, 101, 110, 100, 111, 98, 106, 13, 10, 52, 32, 48, 32, 111, 98, 106, 13, 10, 60, 60, 47, 65, 91, 60, 60, 47, 67, 32, 49, 47, 68, 32, 49, 48, 48, 47, 70, 47, 68, 47, 82, 68, 40, 46, 41, 47, 82, 84, 40, 41, 47, 83, 83, 40, 41, 47, 85, 40, 115, 113, 32, 99, 109, 41, 62, 62, 93, 47, 68, 91, 60, 60, 47, 67, 32, 49, 47, 68, 32, 49, 48, 48, 47, 70, 47, 68, 47, 82, 68, 40, 46, 41, 47, 82, 84, 40, 41, 47, 83, 83, 40, 41, 47, 85, 40, 99, 109, 41, 62, 62, 93, 47, 82, 40, 49, 32, 99, 109, 32, 61, 32, 49, 32, 99, 109, 41, 47, 84, 121, 112, 101, 47, 77, 101, 97, 115, 117, 114, 101, 47, 88, 91, 60, 60, 47, 67, 32, 48, 46, 48, 51, 53, 50, 55, 55, 56, 47, 68, 32, 49, 48, 48, 47, 70, 47, 68, 47, 82, 68, 40, 46, 41, 47, 82, 84, 40, 41, 47, 83, 83, 40, 41, 47, 85, 40, 99, 109, 41, 62, 62, 93, 62, 62, 13, 10, 101, 110, 100, 111, 98, 106, 13, 10, 49, 32, 48, 32, 111, 98, 106, 13, 10, 60, 60, 47, 70, 68, 70, 60, 60, 47, 65, 110, 110, 111, 116, 115, 91, 50, 32, 48, 32, 82, 32, 51, 32, 48, 32, 82, 93, 47, 70, 40, 41, 47, 85, 70, 40, 41, 62, 62, 47, 84, 121, 112, 101, 47, 67, 97, 116, 97, 108, 111, 103, 62, 62, 13, 10, 101, 110, 100, 111, 98, 106, 13, 10, 116, 114, 97, 105, 108, 101, 114, 13, 10, 60, 60, 47, 82, 111, 111, 116, 32, 49, 32, 48, 32, 82, 62, 62, 13, 10, 37, 37, 69, 79, 70, 13, 10]));
        document.destroy();
    });
    it('957901 - Appearance preservation', () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let customStamp: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({ x: 10, y: 10, width: 80, height: 40 });
        customStamp.name = 'With custom appearance';
        let image: PdfImage = new PdfBitmap(natureImageBase64);
        customStamp.appearance.normal.graphics.drawImage(image, { x: 0, y: 0, width: 80, height: 40 });
        expect(customStamp.appearance).toBeDefined();
        page.annotations.add(customStamp);
        let data = document.save();
        expect(data.length > 0).toBeTruthy();
        document.destroy();
        document = new PdfDocument(data);
        page = document.getPage(0) as PdfPage;
        expect(page.annotations.count).toEqual(1);
        customStamp = page.annotations.at(0) as PdfRubberStampAnnotation;
        let stream = customStamp._dictionary.get('AP').get('N');
        let parser = new _ContentParser(stream.getBytes());
        let result = parser._readContent();
        expect(result[0]._operator).toEqual('cm');
        expect(result[0]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '40.00']);
        expect(result[1]._operator).toEqual('q');
        expect(result[1]._operands).toEqual([]);
        expect(result[2]._operator).toEqual('cm');
        expect(result[2]._operands).toEqual(['80.00', '.00', '.00', '40.00', '.00', '-40.00']);
        expect(result[3]._operator).toEqual('Do');
        expect(result[4]._operator).toEqual('Q');
        expect(result[4]._operands).toEqual([]);
        let xObject = stream.dictionary.get('Resources').get('XObject');
        for (const key in xObject._map) {
            let value = xObject._map[key];
            expect(value).not.toBeUndefined();
            expect(value instanceof _PdfReference).toBeTruthy();
            let appearance: any = document._crossReference._fetch(value);
            expect(appearance.dictionary.get('Subtype').name).toEqual('Image');
            expect(appearance.getByteRange(appearance.start, appearance.end)).toEqual(new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 255, 219, 0, 132, 0, 9, 6, 7, 20, 20, 19, 22, 20, 20, 20, 23, 23, 22, 23, 25, 34, 28, 24, 25, 24, 26, 26, 27, 34, 28, 26, 27, 34, 30, 28, 27, 28, 27, 30, 33, 30, 42, 34, 30, 34, 39, 28, 27, 30, 35, 51, 36, 39, 44, 47, 48, 48, 50, 30, 34, 54, 59, 54, 47, 58, 43, 47, 48, 45, 1, 11, 11, 11, 15, 14, 15, 28, 17, 17, 28, 50, 39, 34, 40, 49, 47, 47, 49, 49, 52, 52, 47, 47, 47, 47, 49, 49, 49, 49, 52, 49, 47, 56, 47, 47, 49, 47, 49, 47, 47, 47, 47, 47, 47, 49, 47, 49, 47, 49, 47, 49, 47, 47, 47, 49, 47, 47, 47, 47, 47, 47, 47, 47, 47, 255, 192, 0, 17, 8, 0, 183, 1, 19, 3, 1, 34, 0, 2, 17, 1, 3, 17, 1, 255, 196, 0, 27, 0, 0, 3, 0, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 0, 2, 6, 1, 7, 255, 196, 0, 61, 16, 1, 0, 2, 1, 2, 5, 2, 4, 4, 4, 6, 1, 4, 1, 5, 0, 1, 2, 17, 33, 3, 49, 0, 4, 18, 65, 81, 34, 97, 5, 50, 113, 129, 19, 145, 161, 177, 6, 66, 193, 240, 20, 35, 82, 98, 209, 225, 241, 7, 21, 114, 146, 51, 52, 83, 130, 179, 210, 255, 196, 0, 25, 1, 0, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0, 5, 255, 196, 0, 46, 17, 0, 2, 2, 1, 3, 3, 2, 5, 4, 2, 3, 0, 0, 0, 0, 0, 1, 2, 0, 17, 3, 18, 33, 49, 4, 65, 81, 19, 34, 97, 113, 129, 161, 240, 50, 82, 145, 177, 20, 209, 66, 225, 241, 255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63, 0, 228, 57, 109, 102, 58, 112, 210, 13, 187, 217, 78, 246, 191, 117, 207, 239, 199, 68, 106, 193, 211, 192, 179, 175, 154, 173, 171, 237, 231, 125, 182, 250, 241, 201, 67, 88, 175, 79, 69, 59, 75, 21, 143, 98, 203, 115, 116, 239, 183, 20, 116, 117, 102, 87, 84, 144, 199, 171, 199, 139, 62, 221, 223, 223, 143, 39, 42, 89, 185, 238, 116, 228, 1, 47, 124, 78, 122, 104, 34, 122, 163, 25, 18, 125, 56, 16, 166, 227, 243, 81, 35, 53, 253, 56, 67, 75, 248, 123, 241, 107, 82, 28, 196, 94, 171, 166, 17, 89, 8, 70, 163, 33, 145, 95, 55, 77, 151, 85, 157, 211, 133, 244, 53, 77, 108, 106, 0, 146, 88, 151, 28, 222, 42, 210, 247, 124, 119, 125, 184, 127, 225, 188, 204, 146, 137, 20, 193, 182, 55, 53, 6, 150, 66, 81, 149, 162, 172, 167, 43, 192, 82, 49, 131, 222, 59, 33, 200, 118, 218, 45, 241, 127, 134, 234, 104, 146, 116, 167, 173, 50, 163, 83, 151, 77, 141, 174, 106, 41, 67, 138, 250, 251, 112, 190, 140, 53, 38, 91, 49, 25, 18, 233, 145, 86, 174, 111, 35, 128, 179, 239, 236, 113, 107, 150, 158, 148, 163, 56, 201, 187, 27, 204, 142, 209, 109, 188, 108, 239, 239, 192, 190, 23, 163, 164, 84, 72, 66, 165, 32, 185, 39, 166, 61, 78, 109, 69, 115, 65, 181, 87, 8, 114, 131, 181, 111, 242, 148, 76, 108, 182, 111, 104, 61, 110, 114, 127, 135, 38, 35, 56, 141, 44, 99, 93, 35, 134, 158, 190, 162, 68, 156, 20, 159, 77, 248, 15, 195, 121, 137, 67, 80, 140, 100, 191, 137, 27, 33, 168, 189, 93, 94, 174, 184, 81, 222, 227, 190, 197, 191, 78, 44, 106, 154, 18, 140, 131, 74, 44, 83, 168, 139, 25, 11, 43, 185, 231, 187, 181, 87, 115, 25, 227, 57, 221, 13, 74, 150, 166, 149, 199, 170, 150, 83, 191, 78, 43, 21, 114, 35, 130, 195, 117, 126, 233, 173, 104, 169, 21, 126, 97, 1, 148, 143, 17, 61, 15, 136, 49, 139, 214, 26, 108, 189, 44, 111, 169, 66, 232, 142, 60, 37, 135, 140, 25, 194, 122, 209, 211, 151, 68, 163, 57, 70, 87, 113, 235, 193, 69, 127, 181, 18, 131, 242, 205, 246, 153, 241, 29, 93, 72, 174, 140, 152, 180, 23, 44, 231, 253, 51, 55, 74, 138, 228, 246, 56, 55, 47, 174, 58, 81, 150, 165, 200, 36, 244, 200, 91, 29, 235, 14, 199, 219, 245, 120, 111, 75, 77, 48, 239, 226, 88, 50, 176, 38, 117, 92, 231, 58, 244, 70, 68, 139, 0, 102, 208, 75, 52, 128, 13, 180, 225, 252, 171, 54, 140, 62, 32, 79, 174, 20, 234, 67, 188, 91, 106, 61, 94, 55, 179, 13, 253, 61, 184, 31, 35, 63, 197, 209, 94, 174, 171, 68, 61, 93, 40, 55, 212, 27, 169, 73, 249, 112, 14, 67, 151, 89, 91, 137, 45, 161, 77, 236, 146, 111, 180, 135, 183, 211, 183, 17, 0, 0, 65, 237, 8, 85, 171, 154, 124, 95, 157, 148, 38, 244, 218, 177, 234, 61, 47, 166, 39, 102, 32, 111, 84, 102, 170, 222, 1, 62, 127, 85, 149, 203, 167, 212, 40, 177, 47, 197, 74, 197, 192, 85, 63, 247, 195, 159, 197, 81, 168, 69, 235, 140, 75, 217, 142, 101, 58, 124, 236, 30, 207, 126, 36, 106, 21, 8, 207, 241, 48, 197, 234, 95, 230, 111, 176, 59, 214, 63, 46, 213, 198, 148, 109, 104, 178, 10, 160, 18, 101, 30, 95, 155, 129, 113, 156, 80, 64, 100, 83, 147, 25, 216, 112, 111, 190, 60, 215, 1, 215, 229, 137, 223, 76, 136, 198, 235, 170, 195, 164, 3, 0, 55, 121, 201, 187, 192, 121, 94, 114, 68, 215, 78, 213, 192, 41, 157, 232, 108, 237, 127, 222, 252, 49, 200, 115, 113, 156, 175, 86, 227, 183, 166, 227, 27, 48, 135, 73, 88, 124, 143, 216, 172, 241, 4, 27, 154, 21, 168, 113, 60, 255, 0, 15, 211, 35, 81, 86, 9, 30, 165, 100, 122, 235, 8, 81, 113, 90, 171, 66, 228, 228, 161, 53, 213, 229, 97, 20, 148, 53, 51, 213, 114, 148, 222, 161, 164, 16, 99, 28, 54, 247, 109, 189, 248, 171, 241, 9, 44, 43, 75, 209, 21, 243, 232, 172, 29, 59, 226, 238, 202, 30, 255, 0, 94, 38, 242, 220, 184, 204, 129, 100, 186, 162, 98, 147, 63, 205, 211, 78, 74, 189, 187, 191, 85, 67, 216, 185, 219, 8, 231, 53, 240, 137, 6, 153, 165, 235, 234, 107, 82, 35, 125, 46, 106, 76, 163, 185, 78, 66, 171, 239, 194, 156, 199, 35, 163, 18, 85, 41, 202, 114, 170, 186, 239, 121, 186, 110, 34, 199, 56, 126, 143, 23, 254, 31, 205, 26, 83, 252, 57, 202, 229, 72, 227, 164, 148, 143, 63, 238, 203, 133, 190, 37, 115, 92, 204, 122, 201, 70, 53, 111, 92, 186, 228, 57, 92, 7, 182, 118, 30, 252, 34, 228, 114, 210, 37, 175, 218, 76, 80, 150, 174, 156, 63, 204, 101, 84, 244, 213, 165, 5, 244, 179, 236, 245, 122, 108, 241, 237, 194, 186, 156, 212, 33, 166, 207, 82, 5, 93, 18, 37, 213, 40, 245, 96, 150, 70, 64, 100, 167, 242, 83, 134, 249, 174, 115, 75, 95, 19, 146, 70, 59, 133, 87, 156, 86, 64, 55, 250, 123, 112, 183, 47, 18, 229, 24, 233, 181, 45, 52, 44, 109, 28, 83, 72, 210, 174, 115, 116, 29, 243, 101, 35, 254, 66, 17, 169, 147, 110, 127, 42, 107, 202, 107, 105, 116, 4, 182, 171, 148, 169, 109, 110, 156, 25, 18, 156, 95, 110, 40, 114, 124, 144, 116, 209, 10, 167, 166, 132, 174, 166, 175, 17, 21, 219, 47, 250, 118, 237, 199, 53, 248, 166, 156, 99, 180, 180, 133, 18, 49, 169, 68, 30, 155, 186, 200, 185, 123, 231, 43, 217, 157, 110, 97, 100, 67, 169, 140, 77, 129, 165, 237, 88, 197, 218, 111, 182, 123, 223, 20, 124, 103, 177, 218, 28, 110, 24, 81, 27, 143, 203, 249, 71, 185, 232, 73, 2, 113, 63, 13, 146, 50, 138, 148, 152, 141, 18, 172, 150, 175, 156, 213, 108, 161, 241, 29, 9, 105, 124, 204, 101, 127, 36, 163, 40, 137, 156, 99, 31, 118, 191, 46, 26, 229, 35, 25, 98, 93, 120, 42, 9, 211, 245, 193, 69, 196, 241, 223, 39, 191, 4, 143, 33, 47, 79, 225, 186, 109, 203, 105, 226, 44, 95, 155, 208, 173, 148, 29, 144, 251, 112, 6, 198, 140, 102, 99, 164, 145, 33, 243, 250, 81, 148, 142, 146, 93, 81, 10, 249, 118, 218, 187, 94, 118, 206, 255, 0, 126, 3, 169, 171, 232, 148, 161, 209, 46, 156, 218, 93, 237, 99, 23, 106, 247, 26, 172, 121, 227, 163, 143, 32, 18, 139, 233, 150, 158, 113, 43, 115, 155, 242, 167, 242, 135, 179, 238, 240, 159, 51, 240, 237, 22, 12, 227, 8, 198, 81, 114, 69, 166, 78, 106, 142, 164, 223, 110, 159, 7, 142, 46, 185, 23, 107, 158, 102, 68, 38, 202, 247, 187, 138, 105, 242, 221, 58, 58, 114, 141, 201, 148, 66, 143, 75, 181, 250, 115, 33, 199, 154, 249, 87, 191, 9, 127, 136, 145, 39, 163, 82, 80, 43, 36, 204, 53, 254, 227, 6, 251, 157, 170, 248, 175, 167, 166, 49, 139, 31, 244, 4, 68, 170, 21, 198, 113, 216, 223, 106, 14, 220, 3, 83, 77, 171, 148, 99, 34, 182, 63, 116, 10, 242, 215, 233, 158, 56, 62, 230, 102, 112, 40, 84, 143, 173, 170, 203, 84, 18, 136, 214, 44, 174, 170, 181, 195, 78, 11, 226, 207, 194, 210, 58, 147, 34, 247, 175, 85, 35, 232, 142, 63, 60, 98, 190, 188, 39, 202, 242, 154, 49, 212, 148, 250, 250, 74, 37, 167, 17, 124, 61, 77, 167, 203, 67, 85, 191, 158, 40, 124, 43, 92, 137, 243, 212, 147, 59, 138, 151, 34, 232, 72, 226, 206, 234, 134, 119, 225, 242, 15, 110, 222, 34, 225, 62, 235, 38, 48, 104, 244, 152, 32, 194, 120, 68, 34, 163, 107, 114, 189, 189, 170, 246, 199, 17, 101, 173, 40, 63, 135, 166, 244, 194, 238, 25, 235, 179, 63, 202, 223, 191, 20, 24, 117, 40, 130, 159, 53, 24, 234, 77, 233, 250, 254, 167, 216, 31, 26, 79, 195, 184, 198, 94, 154, 68, 179, 122, 43, 25, 239, 253, 120, 158, 54, 247, 84, 166, 66, 10, 223, 231, 202, 47, 173, 168, 69, 233, 232, 186, 162, 227, 10, 22, 179, 91, 119, 227, 56, 39, 41, 163, 38, 17, 237, 141, 131, 7, 211, 28, 103, 22, 177, 33, 82, 151, 44, 91, 62, 180, 139, 34, 186, 136, 83, 185, 254, 156, 44, 133, 25, 37, 173, 91, 187, 194, 240, 140, 180, 245, 33, 25, 33, 82, 197, 255, 0, 92, 255, 0, 119, 192, 122, 181, 49, 25, 212, 143, 111, 108, 185, 199, 191, 155, 227, 125, 109, 15, 74, 146, 29, 190, 121, 59, 29, 236, 30, 255, 0, 161, 231, 140, 231, 125, 152, 205, 201, 106, 11, 1, 30, 230, 249, 77, 57, 72, 146, 212, 50, 199, 166, 206, 151, 29, 44, 124, 100, 191, 211, 124, 240, 61, 30, 102, 58, 117, 34, 126, 181, 92, 215, 171, 102, 241, 87, 181, 238, 56, 225, 126, 79, 153, 34, 31, 141, 27, 140, 162, 157, 70, 66, 212, 234, 237, 227, 246, 227, 94, 98, 17, 98, 49, 143, 87, 81, 102, 111, 199, 99, 27, 126, 231, 8, 20, 240, 220, 77, 7, 40, 162, 70, 198, 91, 248, 95, 49, 62, 98, 83, 148, 245, 25, 36, 107, 164, 99, 20, 140, 119, 166, 207, 191, 158, 252, 82, 228, 117, 244, 244, 174, 244, 167, 111, 82, 117, 192, 43, 3, 44, 247, 255, 0, 79, 231, 157, 235, 145, 143, 35, 173, 8, 199, 83, 151, 53, 34, 245, 4, 86, 64, 100, 118, 84, 46, 241, 91, 99, 134, 190, 17, 200, 106, 116, 234, 107, 107, 206, 72, 164, 113, 234, 37, 69, 17, 146, 118, 31, 79, 127, 111, 60, 43, 225, 82, 9, 189, 188, 119, 129, 51, 48, 33, 72, 249, 158, 211, 164, 228, 126, 37, 47, 197, 117, 38, 12, 107, 166, 91, 29, 2, 161, 88, 173, 205, 183, 199, 126, 3, 241, 47, 226, 41, 69, 134, 158, 140, 77, 73, 202, 101, 69, 149, 13, 55, 66, 210, 189, 176, 253, 158, 57, 191, 139, 193, 32, 16, 58, 157, 201, 68, 149, 71, 63, 40, 189, 246, 188, 99, 222, 248, 95, 154, 248, 143, 226, 106, 242, 236, 180, 224, 204, 147, 97, 113, 245, 178, 51, 46, 214, 160, 221, 166, 120, 228, 233, 84, 144, 221, 183, 218, 118, 126, 168, 126, 128, 40, 237, 191, 214, 116, 159, 25, 101, 61, 24, 106, 72, 34, 77, 99, 210, 93, 140, 171, 112, 109, 143, 79, 171, 125, 195, 13, 225, 61, 46, 76, 252, 63, 195, 234, 140, 73, 220, 149, 207, 74, 100, 182, 147, 211, 187, 146, 175, 130, 124, 70, 113, 53, 52, 35, 174, 55, 108, 228, 117, 83, 130, 163, 129, 194, 90, 213, 95, 231, 197, 207, 135, 67, 64, 140, 176, 199, 78, 94, 150, 37, 252, 205, 252, 169, 236, 143, 109, 203, 226, 108, 250, 16, 109, 252, 124, 229, 113, 146, 75, 14, 100, 63, 134, 243, 31, 128, 126, 23, 92, 142, 174, 170, 170, 254, 92, 117, 62, 162, 139, 170, 166, 220, 215, 20, 121, 24, 126, 23, 76, 39, 210, 74, 98, 223, 85, 190, 144, 111, 173, 170, 22, 133, 247, 15, 161, 126, 43, 240, 232, 198, 17, 116, 196, 169, 30, 166, 41, 152, 151, 153, 116, 158, 159, 211, 233, 92, 11, 155, 208, 150, 161, 252, 158, 143, 159, 241, 52, 157, 76, 229, 24, 197, 78, 203, 221, 246, 174, 19, 82, 183, 215, 152, 199, 80, 6, 162, 127, 19, 248, 153, 204, 70, 48, 98, 2, 252, 223, 51, 70, 78, 140, 117, 79, 106, 197, 29, 239, 137, 122, 240, 160, 105, 41, 64, 147, 17, 237, 114, 170, 49, 121, 163, 110, 45, 232, 114, 146, 6, 77, 234, 171, 22, 79, 109, 194, 33, 18, 61, 65, 121, 233, 207, 243, 55, 119, 98, 230, 130, 109, 198, 238, 36, 74, 170, 115, 159, 86, 30, 248, 191, 247, 53, 197, 150, 151, 100, 27, 69, 86, 28, 191, 241, 37, 60, 156, 212, 181, 73, 23, 212, 6, 64, 245, 110, 209, 70, 26, 218, 246, 237, 197, 62, 95, 157, 212, 129, 18, 81, 129, 210, 250, 100, 17, 239, 136, 163, 93, 255, 0, 90, 56, 91, 157, 209, 34, 1, 209, 211, 154, 18, 129, 127, 148, 162, 236, 12, 189, 234, 177, 191, 27, 235, 104, 62, 141, 59, 36, 134, 15, 2, 200, 42, 243, 109, 9, 245, 61, 184, 226, 67, 85, 203, 252, 4, 171, 240, 254, 107, 78, 67, 9, 96, 155, 65, 155, 37, 217, 177, 123, 120, 241, 192, 87, 91, 67, 82, 17, 53, 18, 50, 43, 166, 250, 106, 178, 86, 107, 211, 41, 8, 187, 172, 177, 183, 27, 242, 223, 14, 35, 75, 41, 19, 162, 250, 150, 187, 93, 27, 118, 50, 61, 189, 175, 134, 121, 189, 107, 85, 245, 17, 45, 134, 20, 149, 69, 166, 71, 106, 54, 223, 62, 22, 163, 168, 3, 75, 184, 60, 201, 58, 150, 55, 32, 252, 68, 122, 58, 164, 238, 245, 117, 106, 179, 23, 169, 233, 244, 148, 103, 106, 175, 171, 198, 67, 82, 76, 93, 82, 134, 189, 82, 35, 138, 160, 234, 193, 191, 125, 182, 125, 184, 161, 205, 243, 61, 122, 58, 142, 168, 64, 148, 104, 178, 175, 177, 177, 140, 248, 187, 173, 156, 212, 13, 109, 24, 64, 88, 151, 212, 34, 97, 205, 46, 40, 198, 15, 173, 230, 243, 197, 211, 220, 42, 32, 214, 15, 186, 163, 15, 52, 245, 72, 148, 65, 102, 122, 142, 215, 234, 125, 71, 122, 207, 231, 224, 227, 78, 114, 19, 255, 0, 242, 189, 4, 105, 140, 107, 55, 88, 65, 237, 118, 254, 95, 126, 21, 132, 227, 37, 36, 201, 211, 11, 166, 77, 61, 53, 116, 221, 108, 210, 214, 104, 237, 198, 156, 246, 143, 70, 156, 73, 66, 61, 47, 203, 130, 209, 201, 244, 251, 249, 250, 113, 77, 34, 225, 44, 193, 118, 169, 182, 144, 76, 52, 192, 185, 236, 139, 234, 189, 234, 243, 88, 252, 235, 110, 225, 229, 116, 101, 14, 189, 9, 198, 162, 157, 112, 198, 67, 43, 74, 209, 210, 222, 55, 126, 252, 3, 67, 151, 232, 144, 147, 97, 45, 226, 181, 81, 171, 190, 168, 131, 227, 130, 252, 71, 226, 242, 235, 209, 148, 163, 24, 176, 176, 70, 226, 147, 50, 231, 38, 115, 210, 237, 197, 116, 246, 31, 134, 103, 103, 32, 134, 126, 65, 250, 81, 237, 42, 105, 234, 233, 206, 111, 68, 42, 163, 234, 181, 114, 102, 215, 118, 235, 108, 113, 66, 58, 176, 232, 184, 200, 139, 45, 69, 234, 180, 176, 183, 235, 82, 199, 99, 207, 126, 34, 79, 79, 185, 67, 151, 120, 175, 164, 250, 227, 108, 123, 95, 211, 141, 53, 99, 52, 143, 84, 163, 211, 111, 74, 193, 181, 205, 222, 124, 222, 93, 235, 236, 68, 160, 39, 153, 165, 221, 136, 170, 218, 83, 211, 248, 162, 206, 50, 218, 61, 47, 76, 162, 102, 32, 83, 176, 33, 230, 235, 245, 225, 47, 137, 115, 210, 212, 139, 2, 49, 140, 33, 43, 77, 219, 49, 108, 130, 242, 248, 184, 231, 99, 15, 9, 194, 114, 199, 84, 100, 157, 52, 116, 201, 218, 242, 17, 189, 151, 183, 7, 213, 212, 137, 29, 66, 107, 21, 19, 118, 47, 113, 54, 233, 149, 169, 142, 175, 229, 120, 96, 128, 27, 2, 65, 216, 5, 32, 241, 5, 161, 206, 73, 141, 69, 170, 220, 123, 101, 46, 220, 61, 255, 0, 62, 219, 113, 78, 90, 94, 152, 189, 72, 37, 159, 237, 205, 90, 103, 55, 183, 18, 190, 15, 172, 254, 25, 125, 61, 80, 146, 210, 158, 168, 200, 143, 84, 94, 201, 126, 160, 243, 126, 252, 57, 204, 48, 132, 88, 233, 164, 106, 88, 74, 76, 110, 81, 140, 148, 53, 195, 186, 211, 84, 204, 185, 45, 69, 139, 147, 190, 45, 161, 213, 170, 206, 31, 207, 154, 239, 187, 220, 249, 154, 194, 240, 223, 49, 33, 136, 66, 36, 83, 62, 168, 137, 244, 111, 32, 152, 226, 63, 196, 53, 165, 38, 61, 81, 70, 34, 248, 42, 85, 73, 236, 211, 197, 184, 115, 44, 204, 86, 76, 101, 46, 241, 131, 111, 63, 76, 112, 204, 24, 42, 220, 206, 52, 179, 53, 8, 45, 125, 87, 253, 52, 86, 67, 43, 217, 23, 62, 62, 197, 112, 175, 49, 174, 154, 82, 19, 21, 76, 178, 103, 210, 52, 45, 47, 186, 223, 12, 234, 105, 74, 250, 164, 145, 60, 102, 242, 103, 30, 251, 127, 111, 3, 230, 57, 120, 244, 213, 89, 42, 197, 111, 216, 197, 222, 63, 167, 5, 89, 118, 147, 97, 61, 228, 116, 226, 194, 47, 169, 199, 152, 241, 156, 11, 71, 152, 34, 87, 84, 163, 87, 139, 158, 215, 135, 8, 100, 206, 60, 241, 156, 61, 24, 183, 40, 234, 140, 25, 122, 149, 150, 81, 219, 235, 125, 147, 23, 183, 12, 172, 24, 74, 238, 44, 126, 101, 141, 159, 93, 243, 247, 13, 254, 156, 35, 241, 55, 80, 156, 9, 37, 87, 167, 165, 138, 63, 79, 127, 175, 26, 104, 189, 221, 252, 187, 223, 139, 219, 207, 233, 198, 77, 54, 160, 220, 245, 150, 129, 246, 241, 40, 199, 156, 98, 70, 197, 17, 174, 170, 55, 1, 233, 21, 15, 167, 239, 92, 7, 87, 145, 134, 167, 168, 72, 205, 143, 121, 30, 170, 240, 244, 157, 168, 191, 215, 7, 10, 156, 228, 122, 122, 37, 88, 141, 9, 156, 184, 253, 124, 231, 28, 27, 67, 156, 152, 197, 149, 181, 31, 77, 181, 211, 45, 176, 100, 87, 191, 252, 240, 66, 178, 238, 57, 148, 114, 142, 64, 60, 127, 70, 123, 204, 115, 95, 129, 203, 200, 185, 50, 101, 233, 166, 194, 105, 100, 237, 191, 238, 182, 220, 67, 67, 82, 90, 144, 234, 101, 56, 198, 68, 78, 158, 161, 61, 52, 91, 218, 186, 163, 213, 85, 191, 231, 192, 62, 55, 173, 25, 25, 19, 122, 205, 94, 217, 173, 184, 163, 240, 237, 56, 106, 114, 241, 75, 140, 244, 232, 148, 75, 73, 69, 238, 29, 212, 118, 192, 241, 111, 210, 151, 220, 153, 140, 219, 101, 210, 120, 3, 137, 166, 182, 167, 161, 233, 30, 189, 153, 116, 229, 107, 164, 180, 222, 208, 225, 31, 132, 233, 73, 153, 22, 38, 12, 21, 176, 218, 223, 215, 171, 30, 225, 197, 109, 46, 66, 83, 133, 70, 88, 152, 97, 142, 17, 106, 186, 188, 168, 191, 183, 126, 15, 240, 206, 107, 74, 58, 101, 198, 12, 136, 224, 189, 250, 118, 234, 112, 157, 223, 111, 202, 215, 89, 85, 52, 46, 81, 241, 174, 70, 21, 181, 69, 126, 33, 15, 243, 122, 110, 82, 35, 1, 187, 113, 213, 212, 127, 90, 79, 42, 123, 12, 114, 154, 218, 201, 41, 186, 138, 66, 85, 1, 109, 148, 145, 178, 47, 116, 177, 167, 206, 59, 221, 110, 78, 113, 98, 73, 142, 159, 169, 71, 172, 37, 234, 142, 26, 124, 250, 86, 141, 234, 197, 223, 133, 165, 240, 216, 233, 202, 18, 9, 234, 105, 66, 10, 116, 138, 11, 67, 57, 102, 155, 22, 170, 255, 0, 154, 182, 226, 94, 162, 159, 107, 108, 99, 34, 182, 50, 10, 239, 115, 125, 78, 127, 84, 150, 150, 139, 213, 167, 40, 212, 163, 213, 155, 197, 198, 253, 79, 165, 180, 221, 239, 158, 45, 242, 124, 239, 226, 64, 104, 48, 117, 16, 89, 116, 157, 173, 187, 124, 155, 238, 241, 38, 17, 140, 181, 32, 116, 23, 18, 133, 69, 161, 74, 47, 40, 37, 56, 219, 219, 43, 140, 163, 165, 163, 214, 70, 164, 80, 202, 37, 128, 185, 188, 152, 18, 84, 215, 111, 126, 50, 100, 0, 128, 0, 222, 111, 79, 137, 128, 53, 165, 39, 240, 229, 97, 212, 166, 81, 98, 23, 211, 38, 241, 221, 190, 245, 198, 154, 250, 119, 21, 25, 50, 2, 30, 166, 172, 43, 33, 239, 191, 252, 103, 131, 203, 83, 170, 93, 114, 138, 83, 210, 220, 171, 162, 233, 109, 13, 145, 63, 71, 135, 185, 46, 94, 167, 25, 0, 134, 58, 133, 110, 56, 110, 221, 242, 59, 127, 205, 157, 122, 119, 129, 173, 214, 164, 110, 184, 250, 0, 122, 163, 117, 233, 182, 204, 81, 151, 177, 231, 179, 142, 55, 255, 0, 26, 50, 26, 183, 165, 23, 238, 87, 122, 217, 143, 20, 190, 45, 203, 84, 191, 23, 78, 71, 72, 61, 86, 187, 210, 86, 246, 225, 147, 125, 223, 28, 115, 122, 210, 78, 156, 236, 157, 86, 231, 9, 70, 247, 223, 245, 226, 169, 78, 182, 38, 117, 182, 97, 140, 154, 150, 39, 206, 126, 32, 54, 208, 30, 55, 59, 133, 134, 55, 111, 239, 193, 121, 77, 105, 68, 150, 203, 187, 43, 149, 72, 18, 129, 99, 216, 170, 113, 191, 126, 37, 242, 210, 141, 214, 81, 237, 116, 219, 176, 226, 175, 43, 64, 93, 231, 223, 37, 207, 176, 48, 136, 23, 16, 68, 221, 89, 63, 122, 199, 181, 119, 225, 74, 94, 194, 109, 8, 170, 192, 241, 83, 110, 102, 181, 34, 192, 100, 214, 50, 80, 21, 142, 237, 109, 110, 45, 224, 31, 22, 109, 142, 159, 81, 56, 198, 71, 225, 244, 209, 81, 198, 233, 91, 174, 249, 218, 63, 117, 57, 98, 110, 161, 139, 119, 220, 169, 82, 230, 205, 203, 237, 246, 227, 93, 72, 145, 190, 178, 66, 178, 186, 65, 172, 71, 211, 249, 110, 121, 239, 197, 85, 104, 206, 200, 192, 152, 14, 87, 149, 145, 62, 174, 168, 247, 176, 172, 153, 28, 62, 203, 138, 224, 147, 211, 117, 105, 101, 211, 167, 28, 67, 221, 141, 236, 214, 222, 60, 63, 154, 13, 102, 82, 153, 110, 212, 37, 37, 215, 165, 17, 171, 240, 253, 253, 248, 165, 240, 111, 135, 126, 43, 40, 245, 33, 3, 0, 155, 131, 140, 252, 167, 158, 253, 142, 42, 91, 72, 179, 50, 56, 5, 141, 113, 39, 207, 81, 148, 183, 216, 185, 97, 237, 113, 49, 181, 137, 71, 254, 120, 12, 249, 13, 77, 77, 55, 172, 123, 177, 239, 93, 242, 216, 123, 81, 229, 239, 134, 220, 57, 88, 198, 95, 231, 98, 159, 254, 178, 175, 62, 86, 169, 239, 91, 103, 143, 121, 175, 138, 4, 159, 242, 228, 128, 12, 156, 57, 195, 89, 1, 250, 123, 174, 120, 95, 80, 131, 237, 17, 189, 37, 200, 61, 237, 183, 137, 31, 66, 250, 58, 39, 25, 254, 39, 202, 152, 222, 132, 111, 124, 198, 176, 120, 226, 143, 37, 59, 131, 14, 182, 18, 119, 73, 93, 86, 229, 87, 115, 195, 120, 59, 28, 20, 148, 181, 18, 69, 46, 221, 50, 43, 213, 77, 20, 53, 35, 122, 197, 224, 250, 241, 164, 181, 243, 79, 87, 80, 189, 38, 10, 12, 181, 159, 220, 92, 87, 191, 1, 142, 169, 76, 106, 16, 83, 118, 251, 137, 182, 191, 45, 164, 65, 140, 102, 50, 145, 99, 219, 170, 38, 124, 162, 227, 190, 51, 227, 42, 154, 18, 9, 225, 169, 221, 197, 186, 145, 156, 168, 81, 73, 249, 249, 227, 72, 75, 170, 82, 33, 86, 63, 40, 117, 123, 46, 118, 179, 113, 205, 248, 224, 122, 220, 193, 64, 7, 136, 183, 107, 29, 243, 158, 213, 255, 0, 158, 25, 65, 27, 72, 231, 166, 253, 60, 68, 191, 135, 162, 122, 163, 40, 201, 233, 23, 211, 66, 37, 155, 187, 103, 199, 20, 121, 200, 231, 209, 43, 78, 215, 191, 126, 149, 221, 22, 209, 114, 95, 140, 113, 39, 147, 122, 181, 39, 166, 89, 41, 73, 234, 183, 14, 111, 176, 184, 255, 0, 158, 40, 60, 164, 163, 114, 234, 234, 175, 111, 126, 223, 111, 52, 121, 226, 175, 250, 174, 231, 159, 137, 84, 165, 31, 140, 67, 226, 26, 100, 117, 35, 226, 66, 94, 54, 179, 167, 242, 226, 222, 137, 254, 86, 156, 74, 106, 1, 180, 76, 6, 111, 62, 123, 254, 219, 241, 11, 158, 245, 74, 18, 151, 243, 65, 70, 183, 175, 20, 214, 62, 230, 56, 47, 195, 181, 37, 248, 81, 197, 131, 191, 213, 252, 187, 213, 120, 30, 27, 34, 146, 130, 65, 89, 67, 180, 165, 210, 174, 55, 239, 46, 199, 211, 124, 246, 252, 239, 128, 106, 243, 58, 58, 80, 35, 35, 169, 146, 41, 76, 130, 3, 210, 148, 202, 165, 221, 50, 87, 167, 108, 188, 15, 252, 84, 165, 20, 10, 157, 80, 122, 147, 254, 41, 198, 125, 248, 151, 241, 57, 245, 116, 217, 86, 129, 155, 243, 181, 99, 191, 158, 219, 112, 49, 161, 189, 226, 179, 80, 184, 230, 135, 196, 249, 114, 33, 169, 6, 82, 238, 144, 43, 216, 61, 102, 197, 27, 27, 113, 239, 28, 246, 172, 41, 107, 246, 227, 56, 190, 133, 137, 234, 180, 235, 87, 170, 114, 153, 23, 59, 31, 79, 244, 151, 143, 251, 125, 248, 243, 152, 145, 42, 12, 23, 234, 112, 250, 113, 118, 126, 92, 1, 229, 1, 178, 238, 70, 59, 119, 205, 103, 192, 99, 219, 131, 242, 122, 82, 68, 101, 113, 76, 230, 84, 25, 255, 0, 173, 184, 200, 64, 27, 137, 233, 134, 60, 17, 5, 46, 130, 194, 178, 248, 179, 22, 81, 143, 191, 12, 232, 66, 181, 26, 106, 80, 63, 152, 255, 0, 79, 111, 190, 127, 239, 140, 209, 132, 137, 245, 18, 58, 87, 46, 55, 239, 142, 223, 215, 126, 55, 213, 104, 144, 21, 141, 218, 41, 110, 190, 216, 26, 250, 240, 46, 205, 8, 218, 149, 86, 204, 131, 252, 71, 169, 122, 145, 11, 2, 52, 89, 78, 239, 244, 174, 58, 47, 132, 233, 234, 70, 58, 114, 8, 135, 68, 109, 170, 114, 23, 154, 206, 43, 219, 142, 115, 248, 142, 127, 230, 68, 241, 31, 221, 120, 181, 200, 243, 82, 33, 166, 245, 24, 136, 122, 188, 215, 209, 239, 250, 28, 91, 32, 246, 1, 49, 225, 55, 145, 140, 171, 240, 237, 3, 170, 107, 58, 122, 168, 26, 35, 231, 190, 237, 183, 191, 119, 126, 57, 175, 135, 107, 203, 78, 90, 141, 96, 140, 189, 73, 139, 112, 83, 255, 0, 203, 139, 49, 230, 245, 180, 199, 90, 49, 184, 135, 76, 178, 97, 62, 85, 222, 204, 211, 143, 28, 115, 220, 140, 245, 58, 255, 0, 12, 132, 165, 43, 70, 59, 46, 210, 79, 211, 126, 6, 53, 187, 61, 167, 59, 211, 139, 231, 127, 172, 234, 163, 241, 153, 116, 29, 23, 247, 187, 151, 81, 93, 142, 170, 16, 119, 254, 188, 49, 240, 206, 104, 99, 166, 126, 37, 17, 43, 29, 54, 100, 186, 184, 182, 29, 235, 181, 237, 194, 60, 158, 142, 164, 90, 148, 117, 14, 214, 3, 10, 66, 114, 50, 221, 226, 174, 165, 247, 174, 30, 231, 163, 10, 178, 34, 35, 26, 194, 152, 171, 168, 152, 76, 109, 139, 124, 95, 25, 153, 20, 109, 83, 209, 245, 9, 160, 7, 216, 203, 90, 252, 150, 158, 164, 186, 91, 143, 89, 213, 121, 42, 78, 122, 172, 174, 242, 170, 253, 184, 147, 241, 174, 64, 209, 110, 18, 91, 133, 74, 35, 243, 199, 17, 45, 195, 230, 239, 216, 246, 225, 126, 71, 90, 122, 113, 249, 6, 228, 74, 29, 79, 75, 123, 237, 121, 171, 195, 140, 253, 184, 22, 174, 174, 172, 158, 169, 245, 116, 230, 227, 36, 219, 246, 51, 123, 119, 226, 72, 140, 173, 206, 210, 196, 131, 176, 138, 114, 186, 211, 89, 203, 212, 74, 135, 50, 149, 227, 166, 153, 55, 109, 1, 249, 156, 116, 127, 10, 248, 132, 88, 16, 213, 181, 234, 204, 247, 42, 236, 217, 138, 230, 33, 93, 254, 252, 115, 122, 65, 235, 27, 34, 228, 95, 116, 171, 163, 109, 251, 31, 208, 33, 32, 137, 24, 183, 87, 132, 48, 43, 227, 43, 84, 223, 183, 142, 40, 232, 26, 81, 0, 211, 83, 174, 62, 42, 117, 63, 132, 69, 137, 98, 108, 221, 103, 32, 171, 239, 151, 233, 196, 143, 142, 233, 193, 37, 210, 74, 9, 188, 105, 149, 247, 187, 190, 245, 239, 196, 217, 233, 116, 177, 75, 73, 34, 177, 12, 217, 121, 206, 59, 119, 250, 60, 57, 248, 76, 135, 18, 167, 57, 182, 146, 175, 217, 187, 205, 54, 126, 243, 84, 8, 108, 69, 56, 194, 155, 28, 143, 205, 161, 57, 45, 98, 36, 180, 232, 9, 149, 30, 169, 52, 85, 213, 222, 203, 181, 215, 143, 110, 7, 205, 202, 179, 27, 98, 202, 199, 46, 239, 167, 53, 84, 20, 81, 227, 183, 27, 203, 68, 13, 60, 170, 34, 134, 229, 46, 2, 182, 163, 220, 113, 219, 129, 79, 93, 156, 41, 18, 63, 238, 171, 201, 101, 246, 126, 107, 241, 195, 1, 189, 197, 61, 64, 213, 166, 183, 239, 5, 29, 95, 72, 68, 245, 39, 202, 244, 177, 206, 92, 94, 61, 186, 94, 229, 237, 194, 252, 238, 150, 164, 115, 90, 110, 236, 168, 137, 33, 110, 214, 243, 223, 99, 193, 221, 174, 26, 210, 210, 147, 21, 33, 82, 217, 125, 94, 31, 148, 113, 120, 191, 187, 194, 199, 39, 40, 124, 218, 137, 111, 171, 164, 234, 51, 139, 93, 154, 3, 29, 169, 251, 184, 53, 24, 168, 60, 119, 154, 115, 58, 51, 106, 23, 23, 54, 229, 197, 224, 188, 89, 223, 25, 222, 184, 107, 145, 150, 164, 53, 127, 19, 240, 204, 15, 84, 132, 74, 186, 115, 42, 206, 55, 198, 248, 227, 52, 163, 3, 29, 94, 155, 147, 113, 8, 247, 2, 247, 100, 89, 117, 119, 83, 174, 7, 205, 235, 216, 192, 186, 186, 43, 1, 17, 217, 171, 182, 207, 127, 110, 58, 239, 105, 38, 198, 204, 65, 179, 95, 220, 103, 226, 31, 22, 211, 125, 38, 151, 76, 162, 70, 50, 212, 106, 204, 86, 122, 86, 56, 240, 120, 216, 226, 116, 249, 153, 234, 157, 82, 70, 59, 22, 231, 184, 85, 24, 170, 172, 255, 0, 90, 224, 28, 206, 191, 167, 212, 230, 40, 6, 225, 18, 250, 126, 246, 173, 239, 158, 9, 167, 203, 106, 102, 226, 81, 27, 141, 250, 174, 236, 205, 94, 63, 190, 220, 48, 85, 81, 2, 150, 216, 15, 224, 15, 238, 123, 168, 165, 226, 152, 236, 117, 37, 30, 18, 173, 119, 55, 51, 221, 219, 133, 53, 53, 41, 58, 175, 166, 93, 234, 147, 169, 28, 203, 107, 127, 212, 251, 241, 83, 149, 248, 109, 17, 194, 18, 199, 81, 109, 228, 42, 131, 32, 222, 127, 225, 120, 7, 55, 240, 253, 94, 152, 135, 79, 120, 202, 250, 169, 7, 23, 106, 108, 123, 126, 92, 50, 149, 186, 157, 148, 57, 23, 91, 254, 109, 7, 171, 19, 161, 35, 69, 184, 157, 152, 246, 0, 185, 88, 56, 59, 119, 224, 50, 192, 22, 117, 37, 24, 17, 205, 214, 231, 106, 115, 231, 141, 37, 205, 126, 17, 24, 78, 39, 116, 157, 172, 118, 183, 176, 203, 52, 123, 95, 211, 139, 122, 127, 10, 101, 29, 198, 49, 27, 178, 198, 82, 164, 10, 178, 192, 91, 255, 0, 112, 246, 177, 137, 9, 90, 184, 153, 168, 185, 33, 121, 238, 39, 41, 164, 38, 177, 35, 10, 27, 127, 169, 244, 191, 79, 163, 197, 78, 110, 33, 71, 78, 255, 0, 49, 45, 204, 247, 205, 227, 123, 198, 199, 30, 127, 16, 242, 166, 156, 163, 60, 72, 90, 18, 77, 141, 94, 74, 219, 106, 246, 55, 239, 193, 98, 19, 233, 122, 178, 255, 0, 187, 170, 85, 191, 250, 149, 124, 134, 199, 211, 135, 98, 24, 43, 76, 139, 140, 134, 101, 185, 63, 89, 58, 130, 156, 41, 77, 253, 139, 171, 66, 130, 207, 215, 129, 114, 154, 213, 233, 158, 99, 43, 160, 80, 234, 197, 139, 91, 240, 215, 196, 52, 117, 3, 172, 166, 179, 138, 151, 74, 157, 219, 107, 250, 188, 35, 8, 18, 27, 249, 122, 139, 150, 86, 62, 248, 222, 171, 110, 44, 41, 150, 103, 101, 100, 122, 141, 115, 70, 40, 105, 75, 30, 165, 250, 222, 125, 56, 118, 251, 121, 226, 119, 51, 20, 129, 99, 233, 75, 123, 127, 127, 243, 244, 224, 211, 215, 156, 37, 36, 155, 157, 157, 186, 162, 52, 119, 195, 141, 183, 227, 222, 126, 15, 66, 177, 172, 29, 203, 223, 191, 118, 172, 223, 206, 220, 114, 138, 129, 205, 152, 93, 38, 143, 255, 0, 36, 99, 222, 173, 192, 228, 253, 30, 51, 136, 154, 147, 181, 124, 241, 156, 54, 131, 230, 31, 81, 127, 108, 236, 37, 204, 145, 142, 236, 95, 18, 126, 205, 99, 190, 123, 241, 235, 171, 18, 128, 244, 173, 198, 141, 175, 183, 131, 233, 245, 251, 3, 252, 66, 40, 193, 242, 246, 122, 177, 179, 182, 207, 96, 188, 237, 193, 181, 244, 162, 82, 149, 128, 61, 140, 86, 49, 250, 113, 143, 77, 115, 61, 16, 228, 146, 20, 67, 105, 115, 80, 164, 170, 238, 91, 95, 150, 43, 251, 238, 15, 11, 58, 151, 25, 37, 248, 237, 219, 56, 254, 206, 52, 212, 229, 114, 116, 139, 118, 208, 85, 108, 253, 43, 127, 207, 237, 192, 180, 185, 142, 145, 195, 156, 100, 219, 109, 254, 216, 251, 241, 193, 64, 186, 142, 228, 176, 1, 133, 25, 27, 226, 242, 101, 171, 44, 100, 107, 191, 109, 247, 247, 226, 190, 135, 41, 169, 139, 149, 49, 49, 81, 193, 211, 91, 247, 253, 179, 227, 137, 240, 141, 204, 91, 103, 41, 40, 141, 190, 105, 47, 235, 199, 67, 19, 80, 136, 149, 126, 193, 101, 24, 237, 138, 60, 227, 139, 59, 80, 0, 76, 152, 177, 130, 196, 177, 222, 23, 82, 122, 191, 133, 56, 172, 41, 141, 43, 212, 21, 33, 201, 132, 139, 126, 255, 0, 175, 28, 150, 161, 136, 206, 209, 254, 167, 185, 222, 197, 226, 230, 190, 182, 167, 74, 38, 54, 113, 89, 236, 251, 237, 250, 113, 17, 212, 150, 6, 63, 55, 106, 254, 110, 213, 251, 126, 124, 118, 29, 174, 119, 82, 138, 40, 220, 234, 57, 79, 136, 79, 86, 7, 84, 215, 175, 236, 149, 189, 214, 55, 173, 255, 0, 55, 141, 99, 169, 114, 140, 117, 58, 106, 205, 250, 80, 167, 191, 76, 100, 185, 61, 253, 248, 207, 134, 252, 33, 143, 79, 92, 227, 166, 117, 17, 181, 196, 252, 203, 220, 28, 120, 201, 231, 134, 57, 158, 82, 32, 154, 172, 4, 106, 12, 61, 66, 122, 79, 122, 174, 154, 246, 110, 204, 241, 156, 149, 12, 64, 158, 142, 61, 69, 5, 248, 155, 115, 156, 143, 166, 244, 227, 41, 69, 178, 129, 122, 127, 155, 20, 20, 127, 55, 246, 84, 209, 150, 47, 108, 209, 151, 125, 235, 201, 79, 182, 56, 234, 62, 23, 201, 74, 207, 196, 156, 136, 213, 74, 45, 69, 68, 104, 216, 40, 186, 250, 175, 118, 248, 139, 168, 104, 139, 18, 50, 244, 172, 110, 117, 229, 194, 141, 52, 70, 186, 140, 124, 223, 94, 17, 26, 236, 115, 28, 233, 67, 190, 215, 5, 248, 49, 125, 81, 145, 40, 89, 103, 171, 126, 195, 143, 215, 190, 120, 36, 229, 10, 58, 132, 93, 195, 198, 209, 11, 110, 238, 183, 252, 178, 112, 152, 29, 94, 150, 154, 112, 214, 212, 153, 2, 206, 248, 224, 186, 51, 34, 198, 164, 201, 17, 162, 203, 108, 150, 110, 235, 23, 146, 246, 56, 161, 67, 57, 122, 148, 59, 14, 101, 61, 31, 195, 45, 140, 103, 9, 42, 197, 1, 195, 224, 164, 99, 157, 140, 8, 111, 194, 154, 188, 228, 176, 157, 36, 227, 243, 33, 113, 71, 107, 234, 92, 231, 122, 216, 224, 92, 247, 49, 22, 165, 76, 108, 201, 190, 80, 84, 111, 2, 254, 219, 184, 224, 90, 16, 53, 28, 72, 250, 61, 252, 81, 89, 205, 112, 203, 139, 219, 109, 50, 191, 87, 111, 165, 65, 50, 191, 45, 206, 82, 226, 108, 15, 244, 8, 9, 136, 217, 154, 93, 187, 99, 219, 143, 13, 100, 233, 234, 211, 8, 238, 37, 189, 57, 106, 203, 207, 125, 239, 232, 113, 51, 151, 24, 146, 139, 36, 172, 165, 94, 76, 118, 114, 229, 199, 4, 158, 184, 75, 41, 82, 94, 160, 182, 158, 245, 101, 80, 151, 92, 77, 208, 3, 180, 183, 76, 218, 150, 219, 115, 197, 127, 220, 55, 51, 82, 148, 99, 82, 233, 223, 230, 234, 233, 55, 105, 236, 127, 207, 219, 134, 234, 81, 34, 72, 142, 195, 234, 182, 213, 186, 174, 151, 177, 123, 98, 179, 198, 188, 135, 35, 169, 61, 99, 72, 110, 41, 114, 71, 3, 252, 210, 115, 134, 155, 173, 174, 248, 206, 123, 67, 167, 81, 30, 133, 193, 45, 239, 5, 124, 166, 35, 118, 247, 206, 123, 156, 76, 144, 77, 77, 42, 183, 176, 63, 72, 62, 103, 83, 173, 82, 93, 49, 41, 184, 254, 184, 193, 130, 184, 75, 155, 105, 255, 0, 46, 100, 186, 133, 122, 104, 160, 238, 251, 80, 100, 205, 245, 125, 245, 143, 226, 79, 34, 218, 246, 43, 57, 163, 29, 233, 90, 13, 190, 188, 59, 38, 112, 132, 99, 90, 116, 54, 226, 57, 197, 86, 114, 182, 110, 59, 95, 158, 24, 13, 48, 149, 53, 75, 180, 83, 79, 74, 45, 79, 169, 234, 141, 157, 223, 53, 227, 134, 244, 22, 62, 170, 178, 56, 196, 155, 18, 189, 85, 189, 123, 99, 41, 151, 143, 52, 180, 165, 47, 231, 46, 94, 222, 245, 87, 138, 199, 130, 248, 35, 160, 198, 181, 69, 235, 205, 129, 233, 122, 112, 143, 123, 124, 119, 224, 19, 124, 206, 5, 84, 208, 27, 205, 180, 249, 214, 68, 138, 162, 88, 19, 27, 133, 83, 217, 197, 208, 94, 219, 241, 174, 150, 158, 183, 73, 34, 67, 11, 249, 164, 46, 114, 84, 92, 73, 111, 181, 7, 108, 247, 95, 79, 90, 74, 179, 87, 230, 191, 69, 215, 250, 159, 182, 11, 219, 7, 213, 103, 150, 230, 162, 102, 83, 148, 174, 121, 88, 236, 41, 111, 216, 55, 59, 214, 60, 241, 21, 176, 17, 86, 219, 114, 96, 249, 255, 0, 135, 194, 101, 78, 106, 218, 197, 98, 1, 37, 12, 68, 160, 218, 156, 24, 247, 174, 38, 60, 214, 174, 131, 211, 169, 167, 122, 125, 164, 94, 43, 217, 185, 5, 53, 79, 158, 44, 71, 226, 140, 178, 3, 100, 190, 104, 223, 76, 169, 141, 155, 111, 183, 231, 199, 176, 248, 145, 24, 213, 124, 248, 20, 126, 92, 8, 83, 228, 253, 3, 232, 202, 236, 5, 48, 177, 51, 230, 196, 140, 117, 33, 210, 124, 249, 144, 63, 136, 126, 40, 115, 17, 139, 28, 182, 88, 93, 250, 68, 183, 183, 122, 198, 248, 241, 134, 121, 13, 8, 207, 151, 58, 135, 211, 22, 228, 11, 210, 199, 166, 168, 238, 129, 228, 51, 191, 11, 252, 115, 146, 210, 39, 29, 77, 62, 157, 51, 100, 180, 20, 217, 28, 211, 32, 191, 31, 186, 199, 37, 171, 61, 61, 35, 78, 33, 25, 117, 50, 148, 177, 254, 234, 200, 231, 24, 200, 28, 105, 36, 104, 26, 103, 158, 170, 70, 86, 245, 55, 219, 180, 67, 152, 230, 133, 143, 67, 243, 98, 98, 59, 85, 130, 170, 201, 198, 92, 23, 117, 227, 132, 116, 53, 216, 69, 6, 186, 135, 233, 135, 251, 254, 235, 134, 57, 237, 41, 126, 39, 255, 0, 143, 167, 169, 234, 61, 93, 88, 250, 227, 54, 240, 180, 52, 214, 47, 73, 152, 200, 79, 206, 171, 139, 40, 26, 102, 71, 45, 174, 105, 24, 245, 8, 226, 93, 159, 249, 241, 189, 113, 135, 48, 254, 20, 160, 248, 219, 194, 55, 253, 56, 243, 78, 233, 75, 12, 69, 175, 166, 207, 124, 237, 245, 225, 254, 71, 225, 199, 81, 57, 78, 56, 182, 169, 86, 174, 131, 170, 53, 120, 223, 110, 11, 48, 28, 206, 92, 101, 141, 9, 11, 82, 52, 215, 177, 250, 151, 199, 188, 118, 159, 225, 83, 125, 29, 49, 174, 242, 132, 95, 184, 152, 227, 56, 159, 173, 240, 154, 255, 0, 194, 31, 187, 236, 98, 186, 195, 40, 139, 138, 149, 142, 27, 198, 28, 255, 0, 109, 111, 198, 178, 149, 96, 18, 84, 134, 232, 123, 148, 249, 251, 112, 88, 106, 226, 186, 104, 250, 89, 253, 215, 223, 131, 193, 138, 22, 25, 60, 119, 93, 170, 246, 219, 242, 227, 53, 145, 53, 20, 82, 125, 167, 249, 138, 72, 164, 113, 123, 89, 223, 245, 191, 252, 241, 166, 182, 178, 70, 83, 109, 199, 155, 219, 203, 191, 14, 235, 68, 33, 81, 66, 139, 40, 63, 78, 251, 215, 246, 241, 55, 226, 160, 105, 200, 254, 108, 103, 212, 45, 166, 231, 126, 252, 62, 51, 102, 160, 206, 129, 86, 239, 227, 246, 147, 62, 11, 30, 173, 76, 187, 24, 191, 56, 137, 251, 241, 213, 242, 134, 165, 145, 6, 251, 212, 171, 31, 159, 156, 126, 88, 227, 156, 248, 36, 3, 173, 80, 216, 201, 103, 119, 247, 175, 203, 138, 16, 230, 186, 164, 116, 149, 118, 13, 177, 250, 103, 31, 94, 252, 62, 80, 73, 153, 176, 133, 209, 119, 188, 47, 241, 12, 210, 19, 140, 175, 171, 221, 247, 28, 118, 170, 29, 171, 126, 37, 252, 2, 51, 212, 213, 139, 112, 127, 15, 33, 169, 38, 37, 236, 100, 238, 57, 251, 112, 231, 198, 249, 105, 58, 113, 234, 196, 186, 171, 55, 85, 79, 159, 248, 226, 247, 254, 151, 114, 48, 153, 204, 19, 21, 37, 167, 129, 172, 122, 223, 57, 218, 188, 112, 172, 227, 30, 34, 255, 0, 158, 32, 208, 95, 40, 94, 223, 134, 19, 71, 151, 156, 96, 126, 49, 24, 194, 41, 36, 181, 71, 12, 110, 211, 126, 170, 233, 4, 245, 59, 35, 195, 146, 230, 33, 9, 63, 229, 131, 40, 184, 149, 160, 199, 170, 152, 69, 150, 75, 86, 238, 251, 142, 107, 138, 159, 29, 211, 173, 70, 52, 201, 129, 25, 233, 67, 96, 166, 148, 201, 212, 158, 159, 99, 43, 189, 241, 59, 147, 252, 25, 234, 71, 75, 240, 127, 13, 2, 39, 75, 114, 49, 78, 79, 38, 245, 126, 111, 140, 35, 32, 101, 212, 68, 245, 23, 25, 27, 92, 215, 225, 154, 242, 234, 156, 53, 102, 200, 44, 131, 168, 133, 41, 65, 135, 253, 36, 179, 147, 232, 241, 7, 226, 138, 106, 202, 44, 156, 96, 75, 45, 91, 119, 111, 177, 197, 206, 127, 224, 145, 34, 207, 79, 120, 230, 87, 125, 91, 230, 203, 236, 6, 206, 86, 79, 17, 94, 74, 114, 200, 84, 70, 178, 213, 187, 177, 49, 119, 135, 182, 44, 237, 197, 113, 50, 146, 72, 157, 153, 5, 3, 127, 8, 177, 170, 161, 2, 38, 81, 170, 15, 109, 206, 223, 122, 246, 243, 140, 48, 61, 33, 151, 35, 91, 121, 250, 87, 6, 210, 72, 245, 7, 104, 227, 21, 82, 41, 202, 251, 253, 243, 219, 28, 85, 228, 116, 211, 76, 235, 140, 89, 91, 210, 132, 100, 85, 97, 111, 221, 171, 247, 56, 179, 100, 161, 83, 40, 196, 192, 135, 255, 0, 211, 16, 135, 41, 215, 27, 14, 245, 118, 215, 102, 251, 219, 158, 53, 116, 106, 85, 111, 209, 174, 214, 254, 231, 21, 100, 42, 141, 4, 95, 144, 198, 245, 219, 107, 95, 233, 194, 122, 183, 29, 86, 64, 80, 102, 57, 93, 189, 84, 214, 229, 249, 227, 145, 137, 21, 51, 228, 54, 250, 134, 219, 197, 185, 125, 14, 167, 210, 94, 119, 251, 28, 123, 202, 232, 76, 211, 140, 202, 220, 13, 157, 229, 85, 193, 254, 21, 139, 144, 98, 36, 164, 96, 114, 116, 248, 254, 254, 156, 31, 150, 89, 64, 212, 39, 56, 149, 181, 223, 171, 34, 213, 85, 201, 253, 248, 25, 24, 221, 118, 218, 63, 78, 138, 199, 118, 163, 188, 223, 69, 148, 103, 213, 167, 63, 230, 36, 196, 107, 43, 250, 247, 115, 237, 196, 255, 0, 136, 115, 142, 166, 171, 181, 152, 163, 14, 63, 213, 221, 6, 170, 241, 141, 135, 143, 37, 162, 192, 245, 238, 201, 54, 161, 236, 55, 176, 123, 181, 217, 225, 88, 137, 52, 90, 122, 119, 233, 51, 247, 254, 94, 249, 246, 226, 74, 162, 238, 122, 185, 9, 175, 111, 51, 39, 26, 156, 66, 19, 137, 190, 91, 105, 175, 230, 12, 247, 237, 221, 241, 197, 37, 148, 138, 148, 104, 142, 34, 180, 246, 113, 231, 27, 227, 193, 227, 133, 101, 58, 35, 214, 1, 134, 177, 85, 87, 182, 219, 184, 250, 240, 94, 99, 79, 78, 153, 46, 164, 23, 123, 4, 207, 158, 157, 155, 250, 240, 91, 120, 69, 141, 230, 105, 234, 164, 18, 33, 26, 109, 151, 72, 187, 168, 215, 99, 251, 190, 9, 169, 205, 50, 82, 253, 33, 142, 254, 213, 142, 198, 245, 189, 222, 220, 109, 200, 124, 57, 221, 245, 198, 132, 146, 209, 113, 236, 155, 230, 38, 94, 214, 112, 29, 29, 109, 17, 110, 61, 177, 222, 140, 231, 46, 237, 70, 157, 203, 237, 192, 218, 246, 147, 39, 80, 163, 30, 210, 210, 115, 34, 76, 132, 249, 77, 173, 239, 93, 211, 167, 251, 219, 132, 249, 96, 103, 208, 71, 211, 26, 167, 230, 54, 205, 57, 19, 167, 191, 177, 219, 35, 58, 82, 254, 115, 33, 185, 27, 201, 32, 28, 8, 71, 14, 229, 152, 225, 141, 120, 198, 21, 248, 102, 50, 20, 87, 247, 253, 249, 224, 3, 189, 78, 122, 81, 127, 149, 20, 142, 132, 71, 171, 213, 152, 222, 246, 69, 100, 151, 220, 111, 127, 163, 231, 143, 53, 57, 119, 229, 88, 244, 215, 166, 215, 117, 43, 9, 94, 113, 130, 211, 134, 206, 94, 253, 83, 144, 173, 57, 118, 78, 226, 83, 116, 61, 254, 221, 184, 91, 90, 29, 18, 191, 83, 166, 83, 43, 27, 60, 229, 255, 0, 85, 121, 50, 74, 148, 216, 169, 12, 100, 114, 22, 11, 117, 180, 149, 252, 75, 203, 191, 132, 71, 168, 184, 79, 165, 134, 212, 164, 188, 239, 156, 226, 204, 223, 142, 21, 248, 55, 55, 46, 138, 232, 234, 169, 201, 234, 202, 147, 75, 62, 187, 73, 173, 241, 193, 254, 57, 30, 157, 51, 104, 163, 6, 139, 186, 69, 84, 150, 124, 127, 111, 19, 57, 57, 37, 249, 235, 50, 181, 135, 168, 195, 243, 121, 90, 30, 222, 220, 108, 69, 5, 40, 207, 49, 220, 140, 182, 37, 29, 121, 186, 146, 20, 77, 233, 252, 176, 219, 251, 240, 46, 75, 151, 35, 41, 126, 43, 81, 147, 135, 117, 203, 77, 10, 102, 232, 216, 113, 159, 12, 202, 113, 140, 150, 50, 36, 197, 193, 98, 103, 43, 233, 51, 146, 183, 243, 196, 214, 51, 156, 165, 29, 229, 245, 61, 89, 19, 23, 219, 59, 100, 190, 199, 14, 191, 167, 109, 164, 154, 198, 75, 59, 153, 110, 51, 132, 49, 167, 24, 198, 241, 41, 207, 165, 85, 49, 26, 200, 251, 149, 46, 239, 191, 20, 35, 113, 35, 103, 94, 165, 95, 166, 8, 70, 242, 81, 131, 168, 43, 181, 159, 178, 159, 6, 228, 186, 63, 204, 157, 134, 58, 98, 183, 190, 233, 156, 94, 59, 241, 93, 230, 72, 197, 212, 115, 251, 174, 84, 176, 176, 45, 67, 53, 213, 223, 140, 110, 77, 208, 158, 154, 101, 74, 178, 62, 146, 7, 51, 240, 29, 77, 73, 51, 35, 125, 77, 247, 255, 0, 253, 113, 156, 88, 150, 142, 172, 189, 78, 158, 161, 127, 67, 239, 153, 94, 119, 207, 158, 51, 142, 212, 254, 68, 62, 186, 254, 201, 7, 150, 153, 58, 221, 163, 56, 241, 138, 189, 187, 118, 227, 125, 67, 106, 58, 94, 193, 237, 159, 233, 124, 89, 248, 127, 193, 103, 30, 168, 117, 18, 245, 61, 44, 112, 219, 38, 238, 47, 106, 167, 124, 121, 207, 23, 116, 126, 3, 8, 232, 244, 234, 106, 37, 203, 210, 64, 10, 103, 212, 146, 149, 197, 89, 122, 169, 237, 183, 156, 171, 228, 69, 38, 140, 130, 51, 48, 0, 137, 197, 235, 194, 125, 202, 142, 216, 242, 231, 235, 239, 247, 226, 47, 198, 164, 244, 134, 214, 138, 53, 119, 159, 127, 233, 199, 209, 127, 246, 24, 132, 157, 77, 69, 143, 136, 20, 189, 52, 91, 94, 241, 218, 62, 254, 49, 197, 127, 23, 114, 142, 155, 13, 59, 186, 118, 243, 243, 23, 117, 224, 223, 223, 183, 103, 233, 242, 43, 61, 9, 221, 67, 19, 140, 220, 71, 224, 186, 26, 142, 158, 163, 25, 128, 221, 137, 119, 143, 211, 235, 255, 0, 28, 61, 203, 242, 244, 152, 100, 146, 137, 222, 190, 88, 191, 173, 247, 227, 223, 225, 126, 92, 169, 180, 217, 138, 29, 250, 128, 167, 62, 223, 175, 21, 180, 52, 122, 35, 30, 166, 49, 190, 139, 44, 249, 128, 138, 221, 251, 31, 151, 20, 202, 244, 196, 72, 98, 5, 149, 111, 137, 31, 248, 159, 80, 52, 224, 17, 140, 101, 109, 145, 0, 74, 203, 91, 247, 172, 255, 0, 169, 250, 241, 208, 127, 233, 87, 45, 213, 167, 173, 169, 252, 204, 128, 119, 66, 38, 113, 190, 122, 251, 120, 227, 156, 254, 55, 148, 89, 193, 44, 91, 234, 48, 23, 80, 141, 129, 228, 142, 125, 255, 0, 94, 191, 255, 0, 77, 24, 195, 148, 187, 169, 75, 82, 78, 215, 216, 63, 104, 188, 71, 170, 53, 210, 237, 222, 191, 185, 92, 27, 245, 63, 41, 210, 79, 148, 127, 18, 61, 66, 255, 0, 95, 107, 161, 190, 248, 173, 184, 30, 175, 44, 104, 234, 65, 211, 132, 8, 162, 76, 203, 53, 104, 41, 252, 243, 125, 189, 248, 161, 161, 205, 151, 114, 103, 28, 213, 167, 72, 254, 127, 110, 5, 175, 207, 233, 131, 17, 137, 38, 253, 79, 203, 125, 149, 15, 63, 175, 30, 32, 102, 186, 158, 179, 30, 242, 95, 59, 240, 235, 214, 53, 103, 213, 68, 66, 35, 140, 228, 118, 60, 47, 231, 236, 112, 143, 198, 57, 104, 193, 113, 8, 139, 233, 140, 106, 218, 31, 82, 0, 23, 125, 188, 126, 85, 180, 121, 45, 73, 68, 100, 220, 99, 79, 205, 189, 120, 222, 196, 239, 251, 118, 157, 207, 114, 241, 25, 202, 241, 35, 223, 124, 158, 254, 78, 52, 226, 114, 27, 115, 196, 142, 66, 89, 107, 180, 149, 163, 201, 105, 204, 137, 45, 152, 197, 115, 222, 187, 38, 107, 57, 255, 0, 174, 13, 206, 244, 116, 233, 146, 72, 219, 26, 115, 87, 76, 189, 235, 106, 203, 223, 201, 198, 154, 90, 54, 104, 37, 198, 72, 18, 177, 197, 65, 236, 237, 181, 120, 250, 241, 154, 124, 172, 227, 248, 43, 54, 67, 39, 9, 26, 46, 19, 217, 11, 120, 218, 72, 230, 230, 117, 102, 27, 8, 39, 83, 215, 86, 97, 139, 246, 233, 87, 246, 225, 86, 12, 181, 245, 55, 233, 34, 55, 111, 243, 31, 243, 31, 219, 126, 28, 208, 167, 152, 146, 31, 254, 221, 89, 72, 116, 234, 59, 86, 49, 219, 219, 237, 199, 188, 150, 156, 153, 115, 8, 74, 212, 35, 41, 69, 44, 35, 87, 177, 121, 241, 195, 107, 211, 199, 129, 247, 147, 40, 27, 159, 39, 237, 36, 105, 73, 33, 169, 107, 68, 101, 95, 126, 154, 255, 0, 207, 14, 75, 149, 35, 167, 26, 86, 229, 22, 178, 248, 186, 251, 112, 167, 198, 53, 58, 99, 32, 149, 147, 140, 88, 214, 55, 148, 10, 252, 143, 211, 139, 240, 208, 18, 59, 217, 181, 87, 142, 158, 254, 223, 191, 15, 153, 180, 128, 124, 255, 0, 169, 60, 24, 195, 18, 15, 104, 45, 85, 72, 244, 193, 234, 138, 236, 213, 142, 31, 57, 167, 24, 237, 196, 254, 110, 81, 39, 152, 147, 146, 29, 170, 251, 87, 179, 244, 250, 125, 42, 234, 48, 133, 202, 77, 24, 202, 221, 90, 31, 91, 183, 245, 225, 93, 56, 142, 180, 219, 186, 132, 105, 241, 243, 221, 120, 237, 250, 113, 153, 14, 196, 246, 19, 208, 46, 168, 64, 18, 62, 151, 47, 41, 106, 192, 148, 44, 90, 241, 71, 151, 62, 201, 249, 112, 230, 159, 36, 126, 35, 97, 211, 22, 200, 209, 94, 227, 231, 23, 138, 199, 238, 223, 48, 196, 214, 141, 145, 182, 171, 206, 9, 109, 239, 87, 249, 126, 123, 75, 170, 26, 141, 103, 175, 190, 221, 52, 1, 246, 15, 165, 219, 197, 153, 141, 2, 60, 68, 76, 172, 206, 127, 42, 43, 167, 173, 254, 85, 146, 90, 101, 217, 218, 209, 179, 21, 70, 29, 184, 157, 248, 44, 254, 88, 147, 188, 134, 5, 202, 75, 27, 255, 0, 197, 142, 44, 224, 250, 26, 102, 164, 53, 114, 117, 245, 177, 102, 95, 106, 112, 120, 172, 93, 112, 40, 106, 177, 52, 229, 101, 254, 31, 79, 80, 95, 165, 163, 22, 111, 210, 215, 235, 191, 14, 131, 115, 243, 136, 249, 20, 45, 221, 145, 41, 106, 116, 66, 43, 27, 48, 52, 55, 84, 109, 218, 86, 122, 146, 252, 237, 198, 106, 115, 177, 75, 136, 98, 33, 106, 133, 237, 253, 59, 255, 0, 207, 17, 249, 175, 136, 73, 58, 123, 92, 203, 113, 93, 58, 119, 211, 142, 223, 159, 126, 11, 169, 36, 103, 25, 105, 178, 29, 67, 165, 74, 42, 217, 93, 45, 87, 86, 109, 51, 103, 154, 95, 210, 29, 230, 115, 213, 51, 110, 62, 82, 190, 171, 70, 52, 236, 31, 77, 237, 234, 218, 179, 234, 243, 94, 249, 226, 126, 172, 93, 85, 233, 187, 139, 155, 26, 142, 213, 91, 121, 118, 207, 165, 219, 126, 30, 214, 142, 167, 226, 105, 65, 144, 19, 190, 187, 234, 22, 178, 70, 50, 236, 103, 123, 54, 251, 113, 190, 180, 8, 158, 145, 45, 183, 20, 36, 172, 19, 186, 208, 123, 99, 233, 81, 30, 209, 53, 11, 115, 238, 27, 15, 245, 32, 252, 110, 10, 99, 38, 47, 20, 98, 140, 62, 107, 127, 125, 175, 137, 127, 15, 213, 136, 201, 156, 46, 34, 59, 163, 30, 155, 10, 65, 197, 167, 232, 119, 227, 167, 230, 57, 106, 140, 154, 186, 141, 191, 204, 157, 93, 218, 78, 206, 63, 67, 110, 32, 242, 188, 191, 94, 167, 79, 80, 50, 139, 33, 240, 226, 70, 219, 226, 222, 223, 108, 113, 175, 19, 130, 134, 251, 76, 29, 78, 50, 185, 23, 79, 38, 59, 165, 164, 74, 194, 68, 130, 73, 23, 164, 141, 5, 181, 183, 107, 165, 206, 123, 209, 110, 252, 159, 46, 70, 75, 21, 148, 166, 177, 163, 249, 97, 129, 91, 60, 163, 185, 143, 203, 138, 127, 6, 248, 117, 69, 53, 9, 4, 186, 169, 142, 44, 181, 234, 250, 239, 79, 251, 177, 189, 113, 99, 78, 26, 112, 137, 40, 31, 51, 117, 213, 125, 86, 57, 44, 240, 47, 181, 60, 73, 179, 0, 10, 199, 24, 9, 96, 209, 109, 109, 50, 83, 35, 209, 209, 40, 157, 61, 109, 157, 95, 252, 123, 81, 119, 159, 57, 236, 38, 208, 135, 225, 181, 8, 22, 54, 50, 175, 209, 188, 118, 237, 138, 115, 192, 244, 117, 46, 106, 146, 21, 162, 88, 2, 140, 94, 87, 123, 216, 239, 238, 219, 28, 190, 147, 76, 211, 170, 228, 93, 244, 153, 77, 208, 188, 86, 115, 139, 218, 248, 206, 204, 64, 154, 125, 53, 6, 196, 111, 252, 78, 175, 110, 159, 254, 135, 252, 241, 231, 10, 255, 0, 135, 28, 219, 159, 104, 255, 0, 88, 219, 245, 120, 206, 37, 98, 86, 155, 196, 14, 143, 52, 105, 198, 230, 189, 61, 36, 64, 234, 91, 163, 171, 35, 126, 216, 78, 223, 94, 9, 204, 243, 43, 22, 141, 203, 188, 159, 148, 123, 111, 123, 185, 239, 194, 80, 212, 137, 235, 239, 25, 1, 119, 87, 229, 86, 146, 251, 87, 99, 222, 213, 231, 121, 235, 156, 190, 98, 50, 118, 174, 215, 116, 255, 0, 94, 217, 227, 103, 162, 25, 174, 167, 155, 234, 149, 21, 42, 71, 90, 79, 72, 34, 162, 90, 86, 113, 219, 187, 120, 191, 218, 248, 230, 63, 137, 180, 83, 240, 229, 41, 12, 234, 78, 47, 29, 40, 85, 125, 37, 221, 120, 169, 206, 115, 203, 169, 20, 179, 25, 175, 160, 41, 253, 56, 71, 248, 195, 152, 29, 78, 92, 12, 144, 71, 221, 184, 213, 246, 237, 195, 226, 199, 161, 198, 220, 201, 228, 201, 169, 76, 223, 224, 92, 159, 249, 95, 136, 168, 178, 113, 120, 163, 31, 185, 195, 250, 122, 7, 150, 190, 151, 253, 247, 237, 223, 141, 191, 133, 185, 31, 197, 229, 163, 234, 169, 92, 218, 118, 249, 211, 254, 63, 94, 47, 79, 225, 117, 67, 56, 245, 61, 187, 80, 121, 170, 190, 192, 251, 241, 147, 59, 251, 200, 190, 243, 111, 78, 20, 99, 19, 230, 255, 0, 199, 58, 81, 142, 180, 8, 171, 122, 118, 223, 155, 118, 252, 142, 59, 95, 224, 45, 37, 228, 244, 186, 65, 146, 203, 198, 61, 82, 183, 127, 5, 125, 248, 226, 127, 142, 191, 253, 71, 77, 223, 76, 34, 126, 119, 45, 190, 146, 56, 239, 63, 244, 246, 43, 201, 233, 131, 40, 230, 119, 33, 51, 235, 151, 100, 120, 167, 87, 99, 165, 95, 164, 78, 148, 131, 212, 183, 214, 93, 230, 57, 77, 42, 189, 64, 41, 190, 145, 162, 252, 251, 238, 251, 110, 240, 159, 57, 200, 242, 241, 132, 164, 117, 20, 86, 246, 59, 255, 0, 170, 251, 191, 222, 220, 111, 241, 13, 4, 7, 171, 173, 222, 182, 251, 124, 221, 188, 190, 220, 33, 167, 203, 244, 231, 90, 118, 10, 66, 7, 235, 109, 94, 248, 199, 30, 82, 93, 94, 169, 232, 228, 170, 226, 123, 205, 124, 92, 211, 209, 140, 136, 189, 61, 84, 116, 211, 210, 222, 205, 118, 223, 47, 211, 207, 25, 203, 114, 245, 105, 178, 255, 0, 223, 127, 123, 107, 221, 226, 127, 55, 210, 232, 250, 181, 44, 100, 143, 225, 138, 15, 80, 152, 187, 108, 34, 94, 60, 241, 111, 149, 141, 117, 80, 44, 104, 2, 218, 113, 217, 238, 97, 115, 217, 207, 23, 96, 21, 54, 242, 100, 49, 6, 39, 127, 164, 159, 207, 66, 71, 78, 222, 153, 91, 159, 105, 31, 158, 120, 14, 135, 83, 13, 20, 28, 86, 27, 187, 233, 71, 183, 191, 233, 197, 253, 127, 225, 253, 89, 122, 170, 45, 231, 41, 249, 126, 85, 142, 23, 151, 193, 53, 115, 85, 102, 245, 51, 217, 243, 247, 225, 149, 198, 144, 39, 48, 26, 201, 185, 32, 228, 163, 248, 142, 162, 140, 156, 230, 154, 236, 87, 140, 89, 124, 54, 143, 219, 207, 20, 63, 246, 109, 99, 182, 254, 247, 97, 87, 223, 199, 2, 159, 195, 53, 78, 205, 221, 120, 203, 130, 223, 175, 239, 194, 179, 19, 201, 140, 161, 71, 19, 148, 231, 190, 28, 189, 48, 234, 194, 189, 23, 17, 10, 20, 238, 119, 180, 207, 21, 236, 55, 191, 201, 237, 253, 254, 156, 31, 226, 95, 11, 146, 69, 71, 15, 102, 171, 61, 223, 31, 126, 53, 212, 248, 102, 163, 210, 222, 47, 217, 177, 205, 87, 155, 247, 226, 207, 147, 90, 173, 153, 4, 77, 44, 197, 68, 19, 56, 166, 219, 247, 254, 242, 112, 132, 117, 127, 205, 159, 76, 127, 146, 45, 47, 188, 207, 126, 43, 60, 140, 232, 166, 253, 236, 15, 30, 252, 47, 255, 0, 180, 205, 151, 81, 98, 239, 117, 183, 99, 245, 224, 99, 42, 1, 179, 59, 38, 162, 69, 9, 23, 88, 156, 181, 244, 223, 78, 11, 162, 78, 209, 39, 23, 255, 0, 236, 59, 241, 78, 69, 238, 135, 159, 239, 251, 219, 130, 107, 124, 42, 87, 214, 23, 32, 163, 212, 108, 239, 231, 193, 250, 123, 240, 51, 149, 144, 102, 50, 243, 117, 121, 250, 113, 71, 33, 128, 163, 198, 210, 106, 10, 147, 99, 153, 47, 146, 136, 126, 57, 123, 73, 145, 94, 225, 95, 179, 194, 186, 154, 209, 232, 211, 59, 1, 127, 156, 20, 193, 224, 253, 56, 161, 14, 70, 127, 137, 57, 167, 166, 93, 38, 215, 181, 238, 125, 30, 248, 254, 186, 79, 146, 104, 244, 183, 26, 46, 182, 201, 139, 174, 52, 2, 53, 115, 227, 250, 144, 33, 180, 254, 121, 144, 117, 165, 25, 32, 222, 117, 39, 212, 255, 0, 242, 139, 31, 206, 143, 219, 131, 207, 75, 173, 174, 169, 127, 151, 168, 75, 107, 188, 9, 121, 250, 240, 207, 49, 202, 78, 93, 40, 45, 55, 127, 92, 191, 161, 250, 240, 72, 114, 50, 255, 0, 66, 61, 237, 241, 255, 0, 142, 40, 206, 59, 64, 152, 207, 121, 156, 238, 180, 3, 74, 245, 42, 82, 107, 164, 207, 113, 89, 83, 181, 86, 125, 246, 105, 225, 190, 74, 11, 212, 178, 181, 147, 211, 36, 166, 198, 84, 55, 219, 168, 171, 125, 188, 224, 92, 185, 169, 213, 29, 168, 31, 229, 189, 140, 25, 63, 78, 237, 120, 226, 167, 35, 16, 136, 200, 9, 21, 212, 167, 72, 187, 89, 140, 182, 221, 62, 252, 69, 205, 32, 19, 110, 50, 11, 18, 32, 62, 25, 163, 62, 129, 99, 213, 39, 165, 104, 217, 217, 171, 42, 187, 251, 112, 14, 67, 225, 26, 112, 73, 207, 164, 43, 167, 164, 187, 186, 233, 87, 21, 29, 253, 187, 211, 183, 23, 245, 112, 116, 146, 58, 101, 76, 109, 223, 171, 124, 222, 223, 47, 190, 113, 192, 52, 52, 217, 152, 249, 109, 101, 213, 68, 110, 207, 55, 102, 107, 197, 99, 233, 49, 144, 139, 174, 241, 138, 169, 173, 91, 215, 16, 14, 168, 204, 122, 164, 196, 135, 77, 157, 235, 56, 5, 207, 146, 171, 62, 245, 195, 112, 229, 160, 116, 66, 34, 247, 255, 0, 114, 182, 225, 189, 144, 113, 237, 249, 19, 70, 66, 87, 65, 107, 242, 197, 42, 203, 254, 81, 104, 171, 111, 111, 203, 0, 230, 249, 224, 148, 226, 18, 0, 68, 141, 251, 228, 143, 208, 250, 100, 190, 20, 217, 52, 35, 16, 1, 179, 61, 212, 211, 211, 51, 242, 170, 236, 157, 205, 182, 194, 255, 0, 227, 118, 197, 248, 141, 83, 67, 1, 106, 55, 73, 250, 190, 15, 191, 219, 141, 249, 109, 56, 252, 203, 112, 104, 118, 49, 67, 143, 249, 239, 158, 3, 204, 200, 167, 20, 221, 21, 234, 245, 145, 144, 166, 43, 182, 62, 191, 78, 13, 111, 81, 1, 212, 40, 236, 38, 126, 46, 167, 242, 216, 120, 69, 175, 63, 175, 30, 240, 30, 87, 152, 137, 19, 174, 26, 108, 171, 212, 201, 144, 171, 150, 193, 175, 203, 143, 56, 125, 43, 226, 45, 143, 221, 16, 150, 181, 183, 89, 110, 197, 194, 110, 31, 157, 241, 191, 49, 164, 163, 181, 20, 155, 22, 174, 113, 191, 141, 248, 206, 138, 150, 241, 242, 237, 223, 56, 62, 230, 222, 94, 52, 211, 209, 175, 230, 180, 223, 33, 255, 0, 158, 52, 28, 162, 97, 24, 76, 207, 195, 92, 96, 24, 219, 219, 39, 111, 62, 120, 141, 241, 58, 159, 49, 27, 83, 240, 226, 15, 234, 255, 0, 94, 43, 254, 18, 103, 170, 149, 165, 104, 163, 219, 211, 126, 252, 45, 205, 252, 61, 204, 153, 102, 253, 88, 190, 203, 245, 207, 229, 193, 92, 192, 157, 231, 54, 22, 3, 105, 115, 248, 122, 97, 163, 164, 5, 198, 188, 27, 73, 186, 95, 255, 0, 150, 255, 0, 238, 124, 112, 239, 51, 206, 0, 172, 192, 7, 190, 207, 189, 122, 189, 255, 0, 179, 142, 127, 74, 61, 61, 38, 26, 198, 229, 208, 21, 138, 206, 219, 156, 100, 244, 200, 207, 50, 98, 37, 219, 77, 81, 227, 197, 227, 63, 183, 25, 138, 41, 107, 154, 85, 72, 93, 167, 31, 241, 78, 115, 241, 181, 167, 168, 191, 52, 172, 191, 27, 31, 160, 113, 216, 255, 0, 5, 235, 6, 150, 157, 154, 131, 234, 110, 53, 85, 212, 136, 222, 219, 153, 56, 76, 248, 44, 100, 47, 81, 159, 230, 55, 188, 56, 246, 171, 219, 191, 233, 103, 225, 243, 252, 40, 70, 61, 75, 24, 134, 31, 101, 247, 239, 159, 248, 226, 249, 178, 35, 99, 210, 36, 240, 244, 206, 31, 84, 232, 33, 248, 137, 42, 156, 73, 41, 149, 42, 49, 59, 251, 223, 244, 227, 94, 107, 95, 78, 68, 12, 36, 90, 150, 73, 87, 156, 165, 59, 251, 119, 241, 196, 173, 126, 99, 79, 82, 41, 40, 36, 172, 180, 170, 42, 159, 55, 138, 190, 252, 111, 13, 125, 9, 2, 136, 146, 178, 104, 231, 181, 61, 255, 0, 211, 159, 167, 30, 103, 163, 220, 223, 241, 61, 19, 168, 138, 27, 199, 126, 45, 205, 17, 140, 122, 34, 215, 85, 39, 111, 6, 15, 174, 245, 239, 219, 133, 62, 21, 175, 171, 175, 170, 19, 140, 163, 167, 212, 142, 41, 152, 158, 205, 251, 238, 135, 218, 248, 60, 181, 33, 168, 245, 217, 221, 205, 27, 121, 56, 163, 14, 126, 163, 213, 101, 59, 123, 143, 114, 252, 126, 193, 245, 225, 135, 181, 107, 77, 159, 62, 36, 78, 55, 39, 157, 162, 223, 21, 151, 74, 200, 249, 34, 22, 93, 102, 134, 179, 158, 251, 214, 47, 135, 121, 2, 36, 122, 165, 54, 144, 113, 138, 107, 189, 201, 243, 138, 242, 112, 46, 85, 136, 84, 103, 26, 145, 145, 246, 194, 39, 139, 199, 233, 192, 161, 202, 213, 250, 232, 99, 183, 106, 74, 63, 227, 239, 249, 11, 246, 233, 17, 70, 3, 171, 81, 148, 58, 243, 137, 206, 131, 189, 225, 124, 39, 223, 143, 117, 121, 219, 133, 18, 14, 202, 247, 123, 14, 28, 108, 239, 219, 133, 136, 245, 5, 83, 176, 211, 190, 41, 12, 231, 141, 128, 198, 4, 60, 119, 251, 247, 54, 225, 43, 225, 9, 197, 18, 212, 215, 20, 162, 186, 94, 238, 217, 206, 127, 43, 43, 207, 22, 254, 15, 241, 57, 117, 84, 155, 62, 207, 246, 149, 196, 125, 79, 132, 147, 151, 91, 101, 248, 191, 110, 213, 191, 111, 203, 138, 220, 191, 40, 70, 152, 139, 93, 178, 121, 10, 49, 219, 250, 59, 113, 71, 2, 133, 13, 226, 170, 144, 119, 50, 191, 41, 175, 167, 171, 46, 150, 16, 112, 174, 14, 205, 112, 220, 190, 7, 165, 45, 134, 62, 226, 255, 0, 223, 8, 114, 191, 9, 148, 203, 140, 24, 9, 86, 169, 141, 247, 125, 255, 0, 189, 184, 233, 249, 30, 83, 162, 0, 201, 107, 187, 227, 199, 211, 130, 152, 216, 243, 19, 38, 93, 60, 25, 206, 234, 255, 0, 12, 255, 0, 166, 91, 237, 103, 0, 212, 248, 52, 226, 100, 252, 191, 236, 227, 176, 150, 144, 119, 247, 227, 194, 93, 135, 245, 254, 175, 5, 176, 3, 204, 81, 213, 52, 224, 95, 134, 54, 228, 29, 193, 62, 255, 0, 191, 30, 67, 224, 21, 149, 172, 229, 189, 248, 238, 62, 39, 161, 9, 71, 213, 250, 30, 231, 142, 217, 227, 155, 213, 122, 49, 119, 157, 241, 244, 199, 150, 239, 28, 73, 240, 186, 240, 101, 113, 229, 25, 39, 59, 206, 114, 164, 101, 211, 150, 147, 183, 158, 198, 120, 65, 211, 148, 91, 32, 116, 155, 238, 237, 231, 242, 253, 252, 113, 209, 115, 67, 34, 189, 59, 187, 248, 252, 241, 81, 197, 240, 174, 174, 178, 21, 177, 91, 121, 163, 107, 241, 194, 140, 140, 163, 113, 40, 113, 158, 110, 76, 232, 48, 166, 119, 166, 195, 205, 111, 91, 113, 59, 83, 82, 181, 20, 144, 102, 176, 213, 81, 183, 78, 26, 254, 254, 180, 126, 47, 171, 24, 105, 40, 87, 83, 94, 150, 170, 241, 159, 27, 223, 19, 244, 37, 28, 203, 212, 231, 123, 68, 109, 176, 168, 182, 122, 76, 217, 186, 215, 23, 199, 186, 234, 129, 118, 52, 121, 130, 132, 175, 82, 125, 68, 126, 108, 250, 172, 237, 179, 190, 251, 99, 198, 252, 49, 163, 248, 112, 170, 113, 179, 42, 94, 248, 13, 141, 202, 101, 159, 235, 194, 61, 8, 53, 5, 87, 211, 187, 121, 45, 167, 61, 157, 253, 189, 248, 95, 71, 78, 114, 148, 124, 108, 134, 221, 155, 13, 179, 156, 253, 184, 190, 128, 70, 231, 104, 190, 171, 14, 6, 242, 204, 53, 39, 40, 212, 122, 174, 237, 151, 85, 121, 100, 82, 90, 237, 149, 251, 110, 241, 239, 224, 159, 50, 61, 53, 27, 148, 31, 41, 22, 133, 9, 61, 61, 72, 83, 116, 95, 10, 186, 17, 133, 36, 145, 233, 127, 123, 95, 191, 142, 216, 250, 241, 239, 47, 45, 59, 140, 36, 183, 211, 116, 87, 170, 126, 170, 135, 124, 216, 29, 183, 224, 40, 223, 104, 197, 252, 197, 181, 229, 234, 147, 40, 189, 3, 116, 178, 138, 247, 111, 177, 219, 97, 219, 96, 174, 38, 252, 71, 91, 93, 137, 24, 200, 110, 135, 56, 218, 199, 193, 186, 87, 108, 222, 252, 86, 211, 63, 203, 155, 32, 189, 251, 223, 126, 162, 215, 6, 54, 174, 55, 229, 116, 225, 101, 215, 130, 50, 119, 191, 166, 119, 175, 86, 212, 181, 197, 3, 1, 189, 73, 58, 22, 53, 114, 47, 225, 202, 62, 154, 49, 239, 255, 0, 7, 25, 197, 141, 118, 228, 163, 162, 14, 221, 83, 207, 222, 243, 249, 241, 156, 29, 127, 8, 61, 21, 253, 209, 29, 120, 173, 189, 64, 196, 201, 36, 6, 191, 221, 120, 200, 109, 231, 141, 52, 117, 226, 30, 168, 216, 101, 166, 173, 246, 66, 131, 107, 107, 247, 225, 142, 95, 70, 207, 146, 97, 123, 133, 97, 243, 138, 175, 174, 216, 250, 112, 88, 66, 75, 213, 243, 13, 82, 138, 74, 87, 84, 53, 233, 192, 216, 167, 234, 240, 183, 216, 194, 1, 51, 77, 93, 17, 9, 101, 163, 96, 216, 112, 143, 125, 199, 191, 126, 61, 212, 73, 32, 192, 233, 78, 238, 239, 231, 219, 46, 19, 207, 158, 27, 142, 142, 194, 95, 83, 107, 233, 175, 116, 148, 75, 217, 197, 95, 119, 21, 198, 255, 0, 129, 44, 53, 38, 14, 98, 162, 61, 47, 145, 144, 100, 254, 157, 184, 158, 210, 195, 225, 39, 154, 20, 7, 71, 169, 105, 175, 209, 233, 249, 149, 175, 212, 250, 241, 172, 28, 144, 155, 156, 189, 43, 118, 14, 248, 247, 253, 108, 217, 226, 151, 45, 165, 41, 199, 169, 34, 222, 47, 213, 82, 110, 220, 213, 50, 119, 160, 237, 191, 126, 55, 62, 31, 113, 186, 244, 88, 18, 170, 109, 164, 26, 44, 106, 138, 255, 0, 199, 6, 227, 80, 226, 78, 116, 174, 205, 174, 168, 110, 174, 182, 238, 236, 239, 93, 184, 22, 151, 41, 87, 19, 167, 39, 123, 79, 115, 170, 170, 56, 99, 69, 102, 195, 217, 183, 254, 26, 95, 42, 140, 106, 206, 152, 245, 85, 141, 93, 20, 85, 247, 240, 247, 171, 243, 79, 74, 50, 147, 22, 46, 48, 34, 6, 205, 136, 227, 29, 54, 248, 93, 233, 227, 172, 199, 0, 114, 36, 189, 24, 52, 17, 134, 41, 188, 245, 153, 241, 70, 51, 155, 246, 56, 38, 178, 218, 203, 167, 171, 205, 231, 203, 221, 183, 21, 183, 237, 197, 77, 30, 83, 32, 62, 151, 213, 96, 62, 253, 89, 110, 71, 251, 141, 177, 190, 220, 18, 63, 14, 212, 249, 78, 169, 24, 68, 4, 28, 139, 244, 107, 189, 230, 71, 139, 227, 142, 243, 129, 2, 74, 233, 145, 22, 229, 215, 187, 104, 85, 180, 157, 235, 233, 255, 0, 85, 193, 227, 203, 203, 120, 222, 79, 169, 77, 183, 47, 57, 18, 139, 197, 30, 56, 187, 202, 252, 24, 195, 38, 165, 23, 230, 167, 213, 103, 204, 49, 198, 199, 138, 50, 213, 112, 104, 242, 177, 144, 154, 113, 44, 119, 54, 141, 255, 0, 53, 80, 180, 31, 169, 217, 56, 237, 226, 28, 131, 180, 141, 203, 232, 53, 0, 211, 49, 81, 190, 148, 178, 152, 143, 155, 41, 247, 87, 216, 225, 248, 104, 70, 174, 86, 31, 237, 142, 47, 124, 200, 44, 223, 186, 96, 113, 195, 145, 248, 110, 165, 72, 245, 197, 186, 133, 93, 152, 194, 155, 83, 91, 47, 119, 199, 20, 249, 78, 70, 61, 57, 244, 183, 114, 234, 156, 91, 119, 126, 152, 51, 244, 199, 158, 58, 73, 178, 201, 122, 105, 65, 208, 59, 97, 252, 239, 163, 234, 253, 248, 167, 29, 44, 169, 0, 77, 232, 34, 187, 53, 253, 248, 251, 180, 102, 116, 250, 122, 92, 5, 75, 164, 107, 110, 235, 234, 120, 7, 57, 173, 24, 199, 215, 1, 141, 246, 152, 85, 209, 182, 42, 238, 168, 191, 186, 240, 148, 210, 37, 238, 107, 167, 173, 140, 216, 21, 134, 73, 120, 223, 38, 60, 127, 222, 219, 156, 234, 91, 156, 118, 252, 191, 231, 186, 125, 170, 248, 20, 185, 136, 54, 16, 151, 77, 215, 168, 197, 157, 189, 67, 123, 118, 179, 109, 184, 205, 73, 194, 63, 44, 149, 237, 178, 222, 123, 94, 205, 189, 187, 59, 241, 212, 209, 118, 241, 9, 255, 0, 188, 82, 43, 210, 111, 144, 3, 217, 111, 223, 140, 212, 248, 221, 35, 41, 209, 224, 6, 199, 103, 207, 111, 215, 133, 37, 169, 30, 161, 37, 62, 161, 125, 61, 79, 191, 108, 239, 88, 163, 55, 189, 113, 15, 227, 28, 172, 142, 170, 147, 79, 118, 164, 246, 91, 93, 241, 121, 253, 157, 250, 155, 204, 162, 98, 82, 119, 151, 181, 63, 138, 160, 46, 242, 77, 243, 110, 245, 117, 95, 145, 223, 129, 63, 197, 227, 142, 154, 236, 149, 183, 213, 250, 111, 216, 227, 148, 230, 98, 161, 28, 239, 102, 19, 15, 117, 144, 217, 179, 246, 199, 30, 207, 71, 169, 34, 122, 82, 182, 86, 207, 167, 78, 60, 31, 158, 42, 195, 70, 95, 252, 124, 125, 229, 94, 107, 248, 135, 169, 245, 11, 139, 139, 117, 85, 244, 61, 183, 200, 253, 158, 22, 215, 248, 207, 164, 82, 95, 75, 139, 120, 219, 38, 115, 239, 77, 62, 56, 153, 169, 202, 244, 165, 198, 89, 113, 234, 86, 207, 46, 255, 0, 100, 110, 140, 240, 34, 44, 54, 141, 231, 229, 95, 206, 215, 45, 15, 107, 199, 142, 230, 165, 215, 30, 48, 54, 149, 116, 121, 236, 117, 116, 201, 106, 170, 186, 115, 110, 94, 213, 190, 255, 0, 211, 128, 235, 115, 10, 14, 119, 188, 239, 246, 51, 88, 219, 190, 220, 7, 73, 166, 229, 21, 159, 87, 168, 143, 171, 233, 239, 189, 13, 21, 189, 227, 135, 225, 160, 200, 74, 119, 236, 87, 213, 218, 239, 183, 127, 175, 18, 126, 119, 140, 77, 25, 43, 226, 48, 182, 186, 132, 149, 223, 166, 139, 86, 142, 173, 198, 195, 181, 231, 110, 252, 27, 71, 72, 35, 31, 177, 143, 72, 99, 20, 81, 82, 183, 53, 85, 111, 126, 25, 213, 168, 215, 171, 164, 49, 67, 33, 179, 31, 102, 142, 219, 223, 3, 150, 168, 74, 48, 142, 215, 119, 99, 234, 249, 187, 187, 213, 189, 187, 187, 238, 235, 197, 73, 54, 158, 98, 188, 214, 131, 188, 166, 70, 71, 191, 242, 142, 235, 87, 121, 236, 103, 242, 173, 25, 74, 225, 248, 76, 122, 75, 234, 237, 89, 162, 172, 238, 181, 182, 49, 142, 53, 140, 37, 215, 234, 220, 249, 72, 221, 22, 24, 59, 224, 175, 209, 225, 152, 233, 245, 197, 137, 113, 233, 171, 149, 180, 148, 210, 44, 179, 87, 220, 188, 215, 13, 176, 230, 33, 61, 196, 79, 79, 146, 122, 150, 253, 55, 191, 169, 239, 99, 99, 155, 94, 219, 15, 106, 224, 146, 149, 139, 55, 53, 132, 188, 27, 81, 213, 191, 181, 231, 111, 60, 31, 78, 81, 143, 162, 122, 157, 119, 152, 194, 34, 176, 42, 134, 169, 205, 119, 77, 248, 23, 57, 27, 139, 2, 50, 181, 161, 244, 152, 118, 200, 90, 208, 110, 94, 120, 36, 223, 50, 97, 106, 6, 108, 99, 25, 69, 147, 57, 99, 16, 49, 159, 182, 10, 238, 63, 245, 63, 154, 100, 235, 1, 167, 26, 202, 116, 217, 146, 221, 246, 44, 239, 91, 183, 237, 195, 28, 175, 35, 56, 198, 108, 107, 210, 31, 252, 157, 219, 3, 124, 25, 11, 239, 143, 35, 215, 24, 12, 186, 164, 161, 80, 147, 218, 234, 232, 51, 186, 103, 217, 241, 92, 58, 208, 226, 33, 212, 209, 95, 195, 159, 118, 63, 253, 207, 248, 227, 56, 185, 200, 252, 90, 29, 17, 176, 150, 55, 151, 226, 73, 126, 175, 78, 120, 247, 142, 185, 222, 155, 77, 116, 250, 8, 187, 109, 213, 32, 1, 195, 190, 221, 85, 117, 231, 33, 245, 15, 163, 203, 132, 42, 250, 45, 66, 93, 49, 239, 217, 239, 146, 188, 246, 227, 221, 91, 8, 244, 177, 190, 151, 165, 148, 162, 21, 85, 188, 206, 169, 23, 31, 115, 229, 115, 197, 47, 240, 215, 40, 137, 4, 104, 113, 35, 160, 28, 140, 88, 199, 168, 34, 97, 140, 150, 204, 129, 194, 21, 50, 193, 188, 197, 121, 62, 92, 233, 147, 137, 122, 131, 211, 109, 71, 25, 110, 204, 221, 222, 199, 233, 199, 132, 100, 68, 83, 170, 156, 226, 140, 217, 144, 91, 115, 217, 207, 134, 248, 119, 71, 148, 35, 57, 68, 98, 41, 85, 30, 157, 164, 96, 233, 58, 66, 47, 141, 179, 123, 156, 61, 203, 252, 30, 118, 44, 70, 1, 121, 75, 101, 223, 25, 220, 3, 52, 20, 112, 2, 89, 222, 47, 168, 22, 79, 230, 249, 120, 142, 26, 17, 100, 99, 166, 77, 52, 92, 131, 31, 69, 243, 78, 252, 19, 150, 229, 17, 24, 198, 82, 218, 253, 16, 245, 34, 244, 245, 87, 164, 165, 118, 166, 241, 118, 81, 123, 150, 228, 142, 179, 175, 79, 124, 146, 38, 251, 124, 177, 178, 239, 189, 249, 79, 175, 188, 223, 49, 173, 167, 30, 152, 198, 41, 87, 19, 175, 161, 244, 225, 234, 0, 115, 142, 253, 156, 246, 226, 129, 104, 73, 28, 189, 148, 72, 220, 159, 194, 171, 18, 129, 6, 234, 230, 137, 159, 151, 166, 211, 37, 81, 132, 220, 182, 248, 104, 228, 13, 48, 148, 149, 137, 28, 75, 50, 85, 48, 244, 69, 101, 20, 241, 93, 175, 182, 26, 232, 212, 138, 117, 82, 56, 189, 57, 106, 153, 254, 117, 141, 24, 167, 115, 217, 240, 112, 46, 110, 82, 86, 52, 250, 140, 178, 192, 29, 164, 4, 109, 93, 157, 246, 188, 60, 53, 84, 237, 108, 221, 226, 47, 196, 163, 19, 169, 143, 87, 251, 170, 39, 184, 131, 130, 145, 249, 131, 183, 183, 13, 234, 243, 6, 164, 35, 211, 31, 195, 138, 84, 200, 53, 77, 119, 167, 50, 106, 89, 62, 155, 241, 190, 159, 195, 141, 103, 29, 76, 128, 205, 21, 211, 64, 216, 168, 211, 105, 65, 177, 187, 149, 222, 95, 151, 213, 196, 38, 194, 112, 139, 99, 94, 54, 207, 85, 117, 103, 38, 251, 81, 89, 224, 1, 112, 177, 81, 243, 137, 207, 151, 252, 70, 230, 72, 233, 123, 42, 217, 141, 168, 171, 237, 185, 238, 112, 188, 185, 50, 250, 143, 196, 142, 245, 23, 86, 186, 40, 223, 230, 105, 126, 153, 197, 214, 120, 182, 252, 19, 210, 16, 66, 226, 150, 61, 45, 55, 125, 152, 238, 222, 76, 120, 225, 152, 114, 243, 132, 67, 58, 152, 168, 151, 116, 110, 122, 247, 198, 219, 151, 249, 28, 29, 50, 94, 167, 136, 132, 249, 117, 99, 39, 88, 149, 56, 140, 99, 212, 171, 139, 244, 139, 113, 139, 189, 213, 183, 239, 195, 113, 248, 70, 163, 37, 155, 99, 179, 125, 99, 246, 96, 145, 186, 27, 207, 231, 187, 26, 58, 125, 49, 174, 163, 210, 109, 56, 175, 166, 174, 173, 146, 236, 255, 0, 215, 12, 195, 155, 135, 65, 46, 178, 6, 236, 104, 142, 217, 200, 151, 120, 250, 249, 225, 130, 137, 34, 228, 113, 21, 150, 158, 158, 146, 106, 199, 162, 210, 148, 233, 251, 94, 74, 59, 123, 95, 183, 30, 114, 28, 204, 53, 142, 168, 176, 154, 93, 177, 97, 38, 55, 110, 228, 132, 219, 111, 63, 122, 241, 230, 13, 66, 51, 140, 234, 0, 175, 85, 67, 21, 252, 227, 1, 172, 217, 183, 103, 199, 14, 104, 233, 70, 42, 145, 18, 176, 18, 147, 131, 109, 222, 147, 232, 126, 124, 116, 7, 97, 191, 49, 24, 232, 147, 109, 35, 133, 122, 174, 50, 207, 108, 65, 237, 220, 193, 249, 240, 190, 185, 210, 149, 164, 228, 164, 139, 28, 183, 225, 77, 193, 195, 218, 187, 241, 79, 158, 140, 165, 81, 140, 186, 99, 146, 176, 158, 107, 242, 251, 111, 191, 1, 52, 163, 164, 82, 21, 93, 250, 69, 162, 178, 244, 215, 156, 109, 85, 194, 212, 101, 105, 207, 243, 12, 128, 8, 201, 21, 174, 152, 132, 163, 37, 193, 74, 129, 177, 102, 49, 183, 137, 127, 224, 181, 101, 20, 122, 234, 66, 140, 143, 244, 252, 163, 252, 165, 211, 182, 118, 115, 142, 59, 30, 102, 36, 163, 14, 155, 232, 62, 104, 81, 34, 69, 37, 43, 117, 189, 227, 122, 252, 229, 243, 188, 185, 24, 116, 146, 252, 37, 126, 83, 171, 164, 47, 112, 34, 40, 117, 124, 216, 50, 109, 216, 1, 46, 185, 8, 226, 115, 50, 229, 151, 170, 234, 3, 113, 122, 94, 182, 138, 205, 74, 227, 186, 218, 210, 99, 60, 102, 182, 154, 36, 101, 177, 87, 213, 209, 154, 198, 109, 242, 61, 157, 156, 180, 240, 254, 182, 132, 220, 197, 122, 236, 186, 134, 18, 241, 86, 54, 103, 109, 241, 231, 60, 3, 252, 70, 170, 61, 2, 96, 185, 116, 78, 76, 177, 79, 80, 133, 123, 101, 191, 31, 203, 192, 211, 52, 134, 185, 63, 83, 73, 163, 32, 3, 233, 27, 163, 54, 196, 12, 237, 123, 21, 71, 142, 11, 211, 43, 166, 216, 94, 35, 136, 247, 114, 197, 22, 38, 107, 61, 178, 120, 77, 173, 3, 81, 142, 242, 18, 193, 91, 105, 171, 4, 181, 111, 222, 37, 118, 190, 22, 141, 141, 201, 135, 74, 231, 210, 202, 139, 139, 133, 244, 228, 178, 156, 247, 218, 239, 180, 198, 6, 97, 52, 35, 81, 234, 102, 189, 56, 161, 233, 76, 224, 197, 8, 221, 247, 186, 123, 109, 205, 105, 75, 170, 250, 156, 254, 84, 11, 105, 155, 222, 191, 95, 28, 30, 100, 122, 186, 112, 209, 125, 87, 97, 84, 250, 12, 194, 179, 231, 24, 187, 238, 13, 29, 92, 179, 34, 142, 210, 239, 21, 51, 156, 102, 143, 230, 216, 77, 248, 147, 44, 237, 68, 241, 39, 252, 71, 92, 83, 78, 49, 212, 122, 114, 177, 63, 153, 206, 235, 177, 141, 252, 240, 225, 166, 145, 234, 148, 107, 168, 216, 145, 114, 199, 171, 39, 215, 181, 125, 30, 5, 204, 105, 170, 2, 68, 155, 234, 171, 182, 46, 40, 217, 179, 171, 127, 99, 133, 229, 169, 40, 105, 61, 52, 202, 39, 76, 108, 82, 198, 165, 34, 222, 247, 239, 150, 243, 124, 30, 213, 20, 14, 230, 51, 169, 24, 219, 252, 169, 191, 169, 252, 254, 225, 185, 222, 246, 174, 53, 212, 215, 11, 186, 70, 188, 39, 218, 211, 235, 157, 139, 227, 109, 94, 98, 200, 170, 16, 148, 110, 202, 164, 99, 219, 61, 89, 206, 51, 219, 219, 129, 115, 28, 155, 40, 250, 37, 77, 124, 138, 167, 182, 99, 238, 119, 220, 225, 77, 94, 241, 108, 246, 139, 242, 218, 178, 101, 41, 75, 75, 45, 122, 174, 213, 255, 0, 111, 106, 186, 151, 219, 20, 241, 183, 196, 185, 169, 58, 145, 155, 8, 216, 250, 97, 211, 212, 6, 79, 144, 105, 55, 165, 183, 15, 135, 138, 26, 90, 136, 16, 78, 170, 237, 27, 47, 219, 125, 183, 223, 128, 243, 92, 172, 245, 163, 213, 22, 228, 23, 119, 85, 88, 122, 79, 62, 20, 14, 249, 225, 131, 89, 131, 69, 155, 185, 233, 56, 83, 145, 146, 117, 23, 31, 190, 213, 251, 109, 155, 226, 126, 188, 153, 16, 232, 211, 24, 217, 212, 74, 182, 59, 39, 138, 221, 118, 9, 89, 156, 185, 169, 205, 33, 75, 93, 13, 117, 52, 209, 236, 181, 116, 23, 119, 196, 237, 105, 74, 201, 3, 35, 170, 47, 72, 213, 189, 203, 63, 67, 100, 234, 247, 224, 32, 163, 113, 175, 122, 226, 63, 113, 106, 201, 141, 23, 235, 60, 123, 113, 156, 7, 91, 95, 87, 169, 168, 181, 218, 139, 62, 212, 241, 156, 13, 77, 240, 254, 98, 122, 147, 176, 135, 35, 10, 3, 75, 114, 164, 178, 89, 29, 59, 5, 187, 82, 166, 113, 157, 173, 227, 121, 233, 75, 162, 166, 66, 46, 101, 38, 93, 95, 41, 211, 212, 250, 23, 213, 93, 243, 227, 39, 25, 198, 113, 173, 148, 92, 196, 172, 118, 16, 12, 180, 227, 232, 33, 40, 250, 170, 49, 88, 244, 106, 45, 118, 169, 32, 94, 70, 175, 60, 62, 114, 201, 42, 148, 35, 110, 206, 10, 48, 137, 70, 82, 187, 167, 109, 184, 206, 51, 137, 202, 158, 68, 219, 152, 248, 118, 167, 95, 93, 117, 95, 79, 168, 65, 129, 27, 180, 49, 211, 221, 122, 86, 250, 187, 209, 199, 145, 208, 213, 134, 233, 211, 23, 27, 4, 118, 61, 53, 146, 220, 247, 219, 140, 227, 56, 29, 224, 86, 53, 19, 255, 0, 221, 165, 51, 208, 157, 54, 131, 40, 146, 88, 152, 106, 251, 47, 103, 189, 187, 87, 2, 229, 121, 137, 66, 203, 9, 76, 81, 137, 243, 214, 91, 197, 11, 109, 62, 249, 219, 57, 198, 112, 221, 229, 213, 70, 152, 223, 35, 205, 202, 50, 9, 189, 72, 92, 167, 19, 160, 172, 21, 187, 41, 111, 98, 253, 248, 185, 160, 18, 134, 122, 155, 114, 202, 159, 155, 98, 62, 11, 250, 39, 25, 198, 112, 68, 150, 96, 4, 219, 156, 97, 15, 82, 202, 29, 54, 221, 202, 156, 46, 199, 86, 192, 254, 95, 78, 1, 40, 74, 125, 35, 42, 103, 100, 65, 150, 214, 237, 43, 195, 211, 230, 41, 183, 142, 51, 140, 225, 140, 136, 140, 104, 242, 179, 36, 127, 153, 93, 9, 119, 24, 172, 202, 76, 200, 136, 143, 185, 239, 119, 124, 27, 95, 83, 86, 62, 165, 132, 99, 71, 121, 57, 186, 182, 163, 239, 247, 246, 227, 222, 51, 142, 239, 4, 99, 83, 151, 128, 61, 87, 91, 203, 62, 126, 217, 224, 84, 98, 48, 142, 43, 25, 233, 233, 59, 109, 158, 220, 103, 25, 192, 60, 192, 32, 245, 63, 17, 155, 30, 155, 141, 124, 246, 97, 236, 86, 23, 127, 14, 220, 14, 29, 105, 71, 66, 108, 230, 88, 111, 194, 102, 190, 165, 251, 113, 156, 103, 10, 121, 132, 113, 54, 116, 163, 77, 61, 50, 66, 250, 111, 200, 88, 62, 159, 28, 39, 206, 114, 147, 241, 41, 249, 190, 134, 179, 116, 90, 87, 217, 76, 109, 199, 156, 103, 29, 226, 21, 38, 228, 142, 99, 74, 51, 129, 37, 148, 8, 223, 75, 26, 12, 94, 40, 25, 7, 100, 55, 247, 56, 28, 249, 3, 252, 200, 68, 131, 40, 131, 44, 116, 244, 245, 88, 85, 68, 234, 28, 183, 99, 103, 107, 227, 56, 206, 4, 213, 100, 73, 114, 166, 93, 37, 203, 167, 29, 118, 245, 69, 144, 213, 18, 17, 186, 125, 128, 12, 28, 123, 248, 17, 77, 73, 219, 211, 242, 177, 157, 85, 199, 185, 81, 106, 213, 200, 14, 123, 246, 243, 140, 224, 153, 101, 223, 159, 132, 77, 26, 24, 166, 34, 59, 52, 103, 45, 221, 190, 54, 218, 187, 241, 156, 249, 234, 32, 212, 110, 91, 185, 73, 255, 0, 160, 233, 197, 59, 118, 61, 248, 206, 51, 132, 237, 40, 57, 250, 68, 185, 190, 101, 37, 248, 65, 150, 68, 82, 246, 151, 100, 242, 237, 149, 54, 239, 199, 186, 58, 100, 10, 148, 250, 155, 26, 11, 124, 172, 153, 81, 226, 183, 170, 10, 171, 120, 243, 140, 224, 118, 129, 184, 63, 40, 57, 252, 99, 212, 204, 148, 137, 149, 130, 140, 73, 218, 169, 54, 91, 203, 190, 254, 29, 210, 215, 38, 69, 108, 172, 25, 163, 182, 225, 189, 46, 255, 0, 247, 198, 113, 156, 43, 1, 51, 106, 48, 63, 17, 231, 107, 113, 245, 70, 168, 104, 173, 179, 69, 222, 55, 63, 46, 20, 135, 52, 70, 4, 245, 33, 232, 205, 4, 229, 126, 172, 238, 97, 199, 147, 120, 155, 94, 51, 140, 227, 147, 129, 29, 73, 39, 73, 158, 104, 104, 234, 106, 64, 185, 70, 241, 95, 48, 182, 57, 238, 85, 151, 189, 253, 119, 227, 110, 98, 112, 132, 26, 146, 26, 102, 98, 109, 156, 22, 86, 76, 173, 108, 113, 231, 25, 199, 30, 97, 94, 12, 66, 92, 210, 231, 165, 252, 206, 216, 227, 206, 51, 140, 226, 254, 154, 204, 58, 140, 255, 217]));
        }
        document.destroy();
    });
    it('Annotation creation with creation-date and modified-date', () => {
        let document: PdfDocument = new PdfDocument();
        const page = document.addPage();
        const now = new Date();
        const annot: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 40 }, { x: 250, y: 40 });
        annot.name = 'Line Annotation';
        annot.text = 'Line Annotation1';
        annot.creationDate = now;
        annot.modifiedDate = now;
        page.annotations.add(annot);
        let annot2: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 250, y: 10, width: 100, height: 100 });
        annot2.name = 'Circle Annotation';
        annot2.text = 'Circle Annotation1';
        annot2.creationDate = now;
        annot2.modifiedDate = now;
        page.annotations.add(annot2);
        let annot3: PdfEllipseAnnotation = new PdfEllipseAnnotation({ x: 10, y: 70, width: 100, height: 50 });
        annot3.name = 'Ellipse Annotation';
        annot3.text = 'Ellipse Annotation1';
        annot3.creationDate = now;
        annot3.modifiedDate = now;
        page.annotations.add(annot3);
        let annot4: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 10, y: 50, width: 100, height: 100 });
        annot4.name = 'Sqaure Annotation';
        annot4.text = 'Sqaure Annotation1';
        annot4.creationDate = now;
        annot4.modifiedDate = now;
        page.annotations.add(annot4);
        let annot5: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 10, y: 10, width: 100, height: 50 });
        annot5.name = 'Rectangle Annotation';
        annot5.text = 'Rectangle Annotation1';
        annot5.creationDate = now;
        annot5.modifiedDate = now;
        page.annotations.add(annot5);
        let annot6: PdfPolygonAnnotation = new PdfPolygonAnnotation([
            { x: 100, y: 300 }, { x: 150, y: 200 }, { x: 300, y: 200 },
            { x: 350, y: 300 }, { x: 300, y: 400 }, { x: 150, y: 400 }
        ]);
        annot6.name = 'Polygon Annotation';
        annot6.text = 'Polygon Annotation1';
        annot6.creationDate = now;
        annot6.modifiedDate = now;
        page.annotations.add(annot6);
        let annot7: PdfPolyLineAnnotation = new PdfPolyLineAnnotation([
            { x: 300, y: 150 }, { x: 350, y: 50 }, { x: 500, y: 50 },
            { x: 550, y: 150 }, { x: 500, y: 250 }
        ]);
        annot7.name = 'Polyline Annotation';
        annot7.text = 'Polyline Annotation1';
        annot7.creationDate = now;
        annot7.modifiedDate = now;
        page.annotations.add(annot7);
        let annot8: PdfInkAnnotation = new PdfInkAnnotation(
            { x: 0, y: 0, width: 300, height: 400 },
            [{ x: 40, y: 300 }, { x: 60, y: 100 }, { x: 40, y: 50 }, { x: 40, y: 300 }]
        );
        annot8.name = 'Ink Annotation';
        annot8.text = 'Ink Annotation1';
        annot8.creationDate = now;
        annot8.modifiedDate = now;
        page.annotations.add(annot8);
        let annot9: PdfAngleMeasurementAnnotation = new PdfAngleMeasurementAnnotation(
            { x: 100, y: 500 }, { x: 150, y: 450 }, { x: 100, y: 400 }
        );
        annot9.name = 'Angle Annotation';
        annot9.text = 'Angle Annotation1';
        annot9.creationDate = now;
        annot9.modifiedDate = now;
        page.annotations.add(annot9);
        let annot10: PdfPopupAnnotation = new PdfPopupAnnotation('Test popup annotation', { x: 200, y: 60, width: 30, height: 30 });
        annot10.name = 'Popup Annotation';
        annot10.text = 'Popup Annotation1';
        annot10.creationDate = now;
        annot10.modifiedDate = now;
        page.annotations.add(annot10);
        let annot11: PdfFileLinkAnnotation = new PdfFileLinkAnnotation({ x: 400, y: 30, width: 30, height: 30 }, "D:/filelink.png");
        annot11.name = 'Fllelink Annotation';
        annot11.text = 'Filelink Annotation1';
        annot11.creationDate = now;
        annot11.modifiedDate = now;
        page.annotations.add(annot11);
        let annot12: PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation({ x: 250, y: 250, width: 40, height: 60 });
        annot12.name = 'Documentlink Annotation';
        annot12.text = 'Documentlink Annotation1';
        annot12.creationDate = now;
        annot12.modifiedDate = now;
        page.annotations.add(annot12);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.left, PdfVerticalAlignment.top);
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
        let text: string = "Syncfusion Site";
        let size: Size = font.measureString(text, { width: 0, height: 0 }, format, 0, 0);
        let annot13: PdfTextWebLinkAnnotation = new PdfTextWebLinkAnnotation(
            { x: 170, y: 100, width: size.width, height: size.height },
            { r: 0, g: 0, b: 0 }, { r: 165, g: 42, b: 42 }, 1, { text: text }
        );
        annot13.url = "http://www.syncfusion.com";
        annot13.font = font;
        annot13.name = 'Textweblink Annotation';
        annot13.text = 'Textweblink Annotation1';
        annot13.creationDate = now;
        annot13.modifiedDate = now;
        page.annotations.add(annot13);
        let annot14: PdfUriAnnotation = new PdfUriAnnotation({ x: 330, y: 250, width: 30, height: 30 });
        annot14.name = 'Uri Annotation';
        annot14.text = 'Uri Annotation1';
        annot14.creationDate = now;
        annot14.modifiedDate = now;
        page.annotations.add(annot14);
        let annot15: PdfAttachmentAnnotation = new PdfAttachmentAnnotation(
            { x: 350, y: 170, width: 30, height: 30 }, "Nature.jpg", natureImageBase64
        );
        annot15.name = 'Attachment Annotation';
        annot15.text = 'Attachment Annotation1';
        annot15.creationDate = now;
        annot15.modifiedDate = now;
        page.annotations.add(annot15);
        let annot16: PdfTextMarkupAnnotation = new PdfTextMarkupAnnotation('Text Markup', { x: 400, y: 70, width: 100, height: 100 });
        annot16.name = 'Textmarkup Annotation';
        annot16.text = 'Textmarkup Annotation1';
        annot16.creationDate = now;
        annot16.modifiedDate = now;
        page.annotations.add(annot16);
        let annot17: PdfWatermarkAnnotation = new PdfWatermarkAnnotation('Water Mark', { x: 90, y: 120, width: 100, height: 50 });
        annot17.name = 'Watermark Annotation';
        annot17.text = 'Watermark Annotation1';
        annot17.creationDate = now;
        annot17.modifiedDate = now;
        page.annotations.add(annot17);
        let annot18: PdfRubberStampAnnotation = new PdfRubberStampAnnotation({ x: 150, y: 30, width: 80, height: 20 });
        annot18.name = 'RubberStam Annotation';
        annot18.text = 'RubberStam Annotation1';
        annot18.creationDate = now;
        annot18.modifiedDate = now;
        page.annotations.add(annot18);
        let annot19: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 120, y: 300, width: 100, height: 50 });
        annot19.name = 'FreeText Annotation';
        annot19.text = 'FreeText Annotation1';
        annot19.creationDate = now;
        annot19.modifiedDate = now;
        page.annotations.add(annot19);
        let annot20: PdfRedactionAnnotation = new PdfRedactionAnnotation({ x: 450, y: 180, width: 70, height: 70 });
        annot20.name = 'Redaction Annotation';
        annot20.text = 'Redaction Annotation1';
        annot20.creationDate = now;
        annot20.modifiedDate = now;
        page.annotations.add(annot20);
        let annot21: PdfLineAnnotation = new PdfLineAnnotation({ x: 10, y: 30 }, { x: 250, y: 30 });
        annot21.name = 'LineMeasure Annotation';
        annot21.text = 'LineMeasure Annotation1';
        annot21.creationDate = now;
        annot21.modifiedDate = now;
        annot21.measure = true;
        page.annotations.add(annot21);
        let annot22: PdfCircleAnnotation = new PdfCircleAnnotation({ x: 250, y: 120, width: 100, height: 100 });
        annot22.name = 'CircleMeasure Annotation';
        annot22.text = 'CircleMeasure Annotation1';
        annot22.creationDate = now;
        annot22.modifiedDate = now;
        annot22.measure = true;
        page.annotations.add(annot22);
        let annot23: PdfSquareAnnotation = new PdfSquareAnnotation({ x: 120, y: 150, width: 100, height: 100 });
        page.annotations.add(annot23);
        annot23.name = 'SqaureMeasure Annotation';
        annot23.text = 'SqaureMeasure Annotation1';
        annot23.creationDate = now;
        annot23.modifiedDate = now;
        annot23.measure = true;
        expect(page.annotations.count).toEqual(23);
        expect(document.flatten).toBeFalsy();
        let data = document.save();
        document.destroy();
        document = new PdfDocument(data);
        expect(document.getPage(0).annotations.count).toEqual(23);
        const loadedPage = document.getPage(0) as PdfPage;
        let loadedAnnot = loadedPage.annotations.at(0);
        expect(loadedAnnot.name).toEqual('Line Annotation');
        expect(loadedAnnot.bounds).toEqual({ x: 1, y: 793, width: 258, height: 18 });
        expect(loadedAnnot.text).toEqual('Line Annotation1');
        expect((loadedAnnot as PdfLineAnnotation).linePoints).toEqual([{ x: 10, y: 40 }, { x: 250, y: 40 }]);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(1);
        expect(loadedAnnot.bounds).toEqual({ x: 290, y: 50, width: 100, height: 100 });
        expect(loadedAnnot.name).toEqual('Circle Annotation');
        expect(loadedAnnot.text).toEqual('Circle Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(2);
        expect(loadedAnnot.bounds).toEqual({ x: 50, y: 110, width: 100, height: 50 });
        expect(loadedAnnot.name).toEqual('Ellipse Annotation');
        expect(loadedAnnot.text).toEqual('Ellipse Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(3);
        expect(loadedAnnot.bounds).toEqual({ x: 50, y: 90, width: 100, height: 100 });
        expect(loadedAnnot.name).toEqual('Sqaure Annotation');
        expect(loadedAnnot.text).toEqual('Sqaure Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(4);
        expect(loadedAnnot.bounds).toEqual({ x: 50, y: 50, width: 100, height: 50 });
        expect(loadedAnnot.name).toEqual('Rectangle Annotation');
        expect(loadedAnnot.text).toEqual('Rectangle Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(5);
        expect(loadedAnnot.name).toEqual('Polygon Annotation');
        expect(loadedAnnot.text).toEqual('Polygon Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(6);
        expect(loadedAnnot.name).toEqual('Polyline Annotation');
        expect(loadedAnnot.text).toEqual('Polyline Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(7);
        expect(loadedAnnot.bounds).toEqual({ x: 0, y: 442, width: 300, height: 400 });
        expect(loadedAnnot.name).toEqual('Ink Annotation');
        expect(loadedAnnot.text).toEqual('Ink Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(8);
        expect(loadedAnnot.name).toEqual('Angle Annotation');
        expect(loadedAnnot.text).toEqual('Angle Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        loadedAnnot = loadedPage.annotations.at(9);
        expect(loadedAnnot.bounds).toEqual({ x: 240, y: 100, width: 30, height: 30 });
        expect(loadedAnnot.name).toEqual('Popup Annotation');
        expect(loadedAnnot.text).toEqual('Popup Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(10);
        expect(loadedAnnot.bounds).toEqual({ x: 440, y: 70, width: 30, height: 30 });
        expect(loadedAnnot.name).toEqual('Fllelink Annotation');
        expect(loadedAnnot.text).toEqual('Filelink Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(11);
        expect(loadedAnnot.bounds).toEqual({ x: 290, y: 290, width: 40, height: 60 });
        expect(loadedAnnot.name).toEqual('Documentlink Annotation');
        expect(loadedAnnot.text).toEqual('Documentlink Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(12);
        expect(loadedAnnot.bounds).toEqual({ x: 210, y: 140, width: 68.92000000000002, height: 11.559999999999945 });
        expect(loadedAnnot.name).toEqual('Textweblink Annotation');
        expect(loadedAnnot.text).toEqual('Textweblink Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect((loadedAnnot as PdfTextWebLinkAnnotation).url).toEqual('http://www.syncfusion.com');
        loadedAnnot = loadedPage.annotations.at(13);
        expect(loadedAnnot.bounds).toEqual({ x: 370, y: 290, width: 30, height: 30 });
        expect(loadedAnnot.name).toEqual('Uri Annotation');
        expect(loadedAnnot.text).toEqual('Uri Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(14);
        expect(loadedAnnot.bounds).toEqual({ x: 390, y: 210, width: 30, height: 30 });
        expect(loadedAnnot.name).toEqual('Attachment Annotation');
        expect(loadedAnnot.text).toEqual('Attachment Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(15);
        expect(loadedAnnot.bounds).toEqual({ x: 440, y: 110, width: 100, height: 100 });
        expect(loadedAnnot.name).toEqual('Textmarkup Annotation');
        expect(loadedAnnot.text).toEqual('Textmarkup Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(16);
        expect(loadedAnnot.bounds).toEqual({ x: 130, y: 160, width: 100, height: 50 });
        expect(loadedAnnot.name).toEqual('Watermark Annotation');
        expect(loadedAnnot.text).toEqual("Water Mark");
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(17);
        expect(loadedAnnot.bounds).toEqual({ x: 190, y: 70, width: 80, height: 20 });
        expect(loadedAnnot.name).toEqual('RubberStam Annotation');
        expect(loadedAnnot.text).toEqual('RubberStam Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(18);
        expect(loadedAnnot.bounds).toEqual({ x: 160, y: 340, width: 100, height: 50 });
        expect(loadedAnnot.name).toEqual('FreeText Annotation');
        expect(loadedAnnot.text).toEqual('FreeText Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(19);
        expect(loadedAnnot.bounds).toEqual({ x: 490, y: 220, width: 70, height: 70 });
        expect(loadedAnnot.name).toEqual('Redaction Annotation');
        expect(loadedAnnot.text).toEqual('Redaction Annotation1');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        loadedAnnot = loadedPage.annotations.at(20);
        expect(loadedAnnot.name).toEqual('LineMeasure Annotation');
        expect(loadedAnnot.text).toEqual('LineMeasure Annotation1 8.47 cm');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect((loadedAnnot as PdfLineAnnotation).linePoints).toEqual([{ x: 10, y: 30 }, { x: 250, y: 30 }]);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.bounds).toEqual({ x: 1, y: 803, width: 258, height: 18 });
        expect((loadedAnnot as any).measure).toBeTruthy();
        loadedAnnot = loadedPage.annotations.at(21);
        expect(loadedAnnot.bounds).toEqual({ x: 290, y: 160, width: 100, height: 100 });
        expect(loadedAnnot.name).toEqual('CircleMeasure Annotation');
        expect(loadedAnnot.text).toEqual('CircleMeasure Annotation1 3.53 cm');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        expect((loadedAnnot as any).measure).toBeTruthy();
        loadedAnnot = loadedPage.annotations.at(22);
        expect(loadedAnnot.bounds).toEqual({ x: 160, y: 190, width: 100, height: 100 });
        expect(loadedAnnot.name).toEqual('SqaureMeasure Annotation');
        expect(loadedAnnot.text).toEqual('SqaureMeasure Annotation1 12.45 sq cm');
        expect(loadedAnnot.creationDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.modifiedDate.toDateString()).toEqual(now.toDateString());
        expect(loadedAnnot.border.width).toEqual(1);
        expect(loadedAnnot.color).toEqual({ r: 0, g: 0, b: 0 });
        document.destroy();
    });
});