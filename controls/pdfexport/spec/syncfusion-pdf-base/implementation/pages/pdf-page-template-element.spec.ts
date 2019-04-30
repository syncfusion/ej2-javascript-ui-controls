/**
 * spec document for PdfPageTemplateElement.ts class
 */
import { PdfPageTemplateElement, PdfDockStyle, PdfDocument, PdfPage, PdfPageLayer } from '../../../../src/index';
import { RectangleF, PointF, SizeF, TemplateType, PdfAlignmentStyle } from '../../../../src/index';

describe('PdfPageTemplateElement.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let layer : PdfPageLayer = page.layers.add();
        let rectangle : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(30, 30));
        let t1 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        it('-dock == undefined', () => {
            expect(t1.dock).toBeUndefined();
        })
        it('-Set dock', () => {
            let value : PdfDockStyle.Bottom;
            t1.type = TemplateType.None;
            t1.dock = value;
            expect(t1.dock).toBeUndefined();
        })
        it('-alignment == undefined', () => {
            expect(t1.alignment).toBeUndefined();
        })
        it('-Set alignment', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.None;
            t1.alignment = value;
            expect(t1.alignment).toBeUndefined();
        })
        it('-width == null', () => {
            expect(t1.width).not.toBeNull();
        })
        it('-Set width', () => {
            expect(function (): void {t1.width = 10}).not.toThrowError();
            expect(t1.width).not.toBeUndefined();
        })
        it('-height == null', () => {
            expect(t1.height).not.toBeNull();
        })
        it('-Set height', () => {
            expect(function (): void {t1.height = 10}).not.toThrowError();
            expect(t1.height).not.toBeUndefined();
        })
        it('-type != undefined', () => {
            expect(t1.type).not.toBeUndefined();
        })
        it('-Set type', () => {
            let value : TemplateType = TemplateType.Bottom;
            t1.type = value;
            expect(t1.type).not.toBeUndefined();
            t1.type = TemplateType.Left;
            t1.type = TemplateType.Right;
            t1.type = TemplateType.Top;
        })
        it('-set bounds', () => {
            t1.bounds = new RectangleF(new PointF(0, 0), new SizeF(100, 20));
            expect(t1.bounds).not.toBeNull();
        })
        it('-graphics == null', () => {
            expect(t1.graphics).not.toBeNull();
        })
        it('-template == undefined', () => {
            expect(t1.template).not.toBeUndefined();
        })
        let t2 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        it('-Set alignment == BottomCenter', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.BottomCenter;
            t1.dock = PdfDockStyle.Bottom;
            t1.alignment = value;
            expect(t1.alignment).toEqual(8);
        })
        it('-Set alignment == MiddleCenter', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.MiddleCenter;
            t1.dock = PdfDockStyle.Fill;
            t1.alignment = value;
            expect(t1.alignment).toEqual(5);
        })
        it('-Set alignment == TopCenter', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.TopCenter;
            t1.dock = PdfDockStyle.Right;
            t1.alignment = value;
            expect(t1.alignment).toEqual(0);
        })
        it('-Set alignment == None', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.None;
            t1.dock = PdfDockStyle.None;
            t1.alignment = value;
            expect(t1.alignment).toEqual(0);
        })
        it('-Set alignment == None', () => {
            let value : PdfAlignmentStyle = PdfAlignmentStyle.None;
            t1.dock = PdfDockStyle.Fill;
            t1.alignment = value;
            expect(t1.alignment).toEqual(0);
        })
        it('-ForeGround == true', () => {
            t1.foreground = true;
            expect(t1.foreground).toEqual(true);
            expect(t1.background).toEqual(false);
        })
        it('-background == true', () => {
            t1.background = true;
            expect(t1.foreground).toEqual(false);
            expect(t1.background).toEqual(true);
        })
        it('-location == PointF(10, 10)', () => {
            t1.type = TemplateType.None;
            t1.location = new PointF(10, 10);
            expect(t1.location).not.toBeUndefined();
        })
        it('-location.x == 20', () => {
            t1.type = TemplateType.None;
            t1.x = 20;
            expect(t1.x).toEqual(20);
        })
        it('-location.y == 20', () => {
            t1.type = TemplateType.None;
            t1.y = 20;
            expect(t1.x).toEqual(20);
        })
        let t3 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        it('-location == PointF(10, 10) with type != TemplateType.None', () => {
            t3.type = TemplateType.Bottom;
            t3.location = new PointF(10, 10);
            expect(t3.location).toBeUndefined();
        })
        it('-location.x == 20 with type != TemplateType.None', () => {
            t3.type = TemplateType.Bottom;
            t3.x = 20;
            expect(t3.x).toEqual(0);
        })
        it('-location.y == 20 with type != TemplateType.None', () => {
            t1.type = TemplateType.Bottom;
            t1.y = 20;
            expect(t3.y).toEqual(0);
        })
        it('-size == null', () => {
            t1.size =  new SizeF(10, 10);
            expect(t1.size).not.toBeUndefined();
        })
        let t4 : PdfDocument = new PdfDocument();
        let t5 : PdfPage = t4.pages.add();
        let t6 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle ,t5);
        let t7 : PdfPageTemplateElement = new PdfPageTemplateElement(new PointF(10, 10), new SizeF(30, 30));
        let t8 : PdfPageTemplateElement = new PdfPageTemplateElement(new PointF(10, 10), new SizeF(30, 30) ,t5);
        let t9 : PdfPageTemplateElement = new PdfPageTemplateElement(new SizeF(30, 30));
        let t10 : PdfPageTemplateElement = new PdfPageTemplateElement(30, 40);
        let t11 : PdfPageTemplateElement = new PdfPageTemplateElement(30, 40, t5);
        let t12 : PdfPageTemplateElement = new PdfPageTemplateElement(10, 10, 30, 40);
        let t13 : PdfPageTemplateElement = new PdfPageTemplateElement(10, 10, 30, 40, t5);
        t13.type = TemplateType.None;
        t13.location = new PointF(10, 30);
        it('t13.template', () => {
            expect(t13.template).not.toBeNull();
        })
        it('y == 30', () => {
            expect(t13.y).toEqual(30);
        })
        it('t13-set bounds', () => {
            expect(function (): void {t13.bounds = new RectangleF(new PointF(0, 0), new SizeF(100, 20))}).not.toThrowError();
            expect(function (): void {t13.bounds}).not.toThrowError();
        })
        t12.type = TemplateType.Top;
        it('t12-Set width', () => {
            t12.width = 10;
            expect(t12.width).not.toBeUndefined();
        })
        it('t12-Set height', () => {
            t12.height = 10;
            expect(t12.height).not.toBeUndefined();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type TopLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopLeft;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type TopCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopCenter;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type TopRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopRight;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type BottomCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomCenter;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type BottomLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomLeft;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type BottomRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomRight;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type MiddleCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleCenter;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type MiddleLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleLeft;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type MiddleRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleRight;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and TopLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopLeft;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and TopCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopCenter;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and TopRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.TopRight;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and BottomCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomCenter;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and BottomLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomLeft;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and BottomRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.BottomRight;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and MiddleCenter', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleCenter;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and MiddleLeft', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleLeft;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and MiddleRight', () => {
            t11.dock = PdfDockStyle.None;
            t11.alignment = PdfAlignmentStyle.MiddleRight;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        //DoctType !== none && type == none && alignment style == none
        it('-t11.draw(t5.defaultLayer, t4) with type == None and Left', () => {
            t11.dock = PdfDockStyle.Left;
            t11.alignment = PdfAlignmentStyle.None;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and Right', () => {
            t11.dock = PdfDockStyle.Right;
            t11.alignment = PdfAlignmentStyle.None;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and Top', () => {
            t11.dock = PdfDockStyle.Top;
            t11.alignment = PdfAlignmentStyle.None;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and Bottom', () => {
            t11.dock = PdfDockStyle.Bottom;
            t11.alignment = PdfAlignmentStyle.None;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
        it('-t11.draw(t5.defaultLayer, t4) with type == None and Fill', () => {
            t11.dock = PdfDockStyle.Fill;
            t11.alignment = PdfAlignmentStyle.None;
            t11.type = TemplateType.None;
            expect(function (): void {t11.draw(t5.defaultLayer, t4)}).not.toThrowError();
        })
    })
})