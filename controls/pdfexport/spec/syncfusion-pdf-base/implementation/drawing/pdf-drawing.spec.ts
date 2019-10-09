/**
 * spec document for PdfDrawing.ts class
 */
import { RectangleF, SizeF, PointF, Rectangle } from "../../../../src/implementation/drawing/pdf-drawing";
describe('PdfDrawing.ts',()=> {
    describe('consructor implementation of PointF class',()=> {
        let t1 : PointF = new PointF();
        it('-PointF => x=0,y=0', () => {
            let isTrue:boolean = (t1.x==0 && t1.y==0) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        t1 = new PointF(null,null);
        it('-PointF => x=null,y=null', () => {
            let isTrue:boolean = (t1.x==0 && t1.y==0) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        // it('-PointF => x=Point(10),y=Point(20)', () => {
        //     let isTrue:boolean = (t2.x==10 && t2.y==20) ? true : false;
        //     expect(isTrue).toBeTruthy();
        // })
    })
    describe('consructor implementation of SizeF class',()=> {
        let t1 : SizeF = new SizeF();
        // it('-SizeF => width=0,height=0', () => {
        //     let isTrue:boolean = (t1.width==0 && t1.height==0) ? true : false;
        //     expect(isTrue).toBeTruthy();
        // })
        t1 = new SizeF(10, 20);
        // it('-SizeF => width=10,height=20', () => {
        //     let isTrue:boolean = (t1.width==10 && t1.height==20) ? true : false;
        //     expect(isTrue).toBeTruthy();
        // })
        let t2 = new SizeF(null, null);
        // it('-PointF => width=null,height=null', () => {
        //     let isTrue:boolean = (t1.width==0 && t1.height==0) ? true : false;
        //     expect(isTrue).toBeTruthy();
        // })
    })
    describe('consructor implementation of RectangleF class',()=> {
        let t1 : RectangleF = new RectangleF();
        // it('-RectangleF => x=0,y=0,width=0,height=0', () => {
        //     let isTrue:boolean = (t1.width==0 && t1.height==0 && t1.x==0 && t1.y==0) ? true : false;
        //     expect(isTrue).toBeTruthy();
        // })
        t1 = new RectangleF(10, 20, 10, 20);
        it('-RectangleF => x=10,y=20,width=10,height=20', () => {
            let isTrue:boolean = (t1.width==10 && t1.height==20 && t1.width==10 && t1.height==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        let t2 = new RectangleF(new PointF(10,20),new SizeF(10,20));
        it('-RectangleF => x=Point(10),y=Point(20)', () => {
            let isTrue:boolean = (t2.width==10 && t2.height==20 && t2.width==10 && t2.height==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        let t3 = new RectangleF(new PointF(10,20), new SizeF(10,20));
        it('-RectangleF => x=Point(10),y={width:10,height:20}', () => {
            let isTrue:boolean = (t3.width==10 && t3.height==20 && t3.width==10 && t3.height==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        let t4 = new RectangleF(10, 20, 10, 20);
        it('-RectangleF => x=Point(10),y={width:10,height:20}', () => {
            let isTrue:boolean = (t4.width==10 && t4.height==20 && t4.width==10 && t4.height==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
    })
    describe('consructor implementation of Rectangle class',()=> {
        let t1 : Rectangle = new Rectangle(10, 20, 30, 40);
        it('-Rectangle => left=10,right=20,top=10,bottom=20', () => {
            let isTrue:boolean = (t1.left==10 && t1.top==20 && t1.right==30 && t1.bottom==40) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        it('-Rectangle => width', () => {
            let isTrue:boolean = (t1.width==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        it('-Rectangle => height', () => {
            let isTrue:boolean = (t1.height==20) ? true : false;
            expect(isTrue).toBeTruthy();
        })
        it('-Rectangle => topLeft', () => {
            expect(t1.topLeft).not.toBeUndefined();
        })
        it('-Rectangle => size', () => {
            expect(t1.size).not.toBeUndefined();
        })
        it('-Rectangle => toString', () => {
            expect(t1.toString()).not.toBeUndefined();
        })
    })
})