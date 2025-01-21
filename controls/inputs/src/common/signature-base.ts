import { BlazorDotnetObject, Component, removeClass } from '@syncfusion/ej2-base';
import { EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

export abstract class SignatureBase extends Component<HTMLCanvasElement> {
    /* Private variables */
    private pointX: number;
    private pointY: number;
    /* time of the current point(x,y) of the corrdinates*/
    private time: number;
    private startPoint: Point;
    private controlPoint1 : Point;
    private controlPoint2 : Point;
    private endPoint : Point;
    private pointColl: Point[];
    private canvasContext: CanvasRenderingContext2D;
    private lastVelocity: number;
    private lastWidth: number;
    private incStep: number;
    private snapColl: string[];
    /* minDistance(distance between the two point) was calaculated for smoothness.*/
    private minDistance: number = 5;
    private previous: number = 0;
    /* interval handles for the smoothness in the mouse move event.*/
    private interval: number = 30;
    private timeout: number | null = null;
    private storedArgs: MouseEvent & TouchEvent;
    private isSignatureEmpty: boolean = true;
    private backgroundLoaded: boolean | null = null;
    private fileType: SignatureFileType;
    private fileName: string;
    private clearArray: number[];
    private isBlazor: boolean = false;
    private isResponsive: boolean = false;
    private dotnetRef: BlazorDotnetObject;
    private signPointsColl: Point[] = [];
    private signRatioPointsColl: Point[] = [];
    private tempCanvas: HTMLCanvasElement;
    private tempContext: CanvasRenderingContext2D;
    private canRedraw: boolean = true;

    /**
     * Gets or sets the background color of the component.
     *
     */
    public backgroundColor: string;

    /**
     * Gets or sets the background image for the component.
     *
     */
    public backgroundImage: string;

    /**
     * Gets or sets whether to disable the signature component where the opacity is set to show disabled state.
     *
     */
    public disabled: boolean;

    /**
     * Gets or sets whether to prevent the interaction in signature component.
     *
     */
    public isReadOnly: boolean;

    /**
     *  Gets or sets whether to save the signature along with Background Color and background Image while saving.
     *
     */
    public saveWithBackground: boolean;

    /**
     * Gets or sets the stroke color of the signature.
     *
     */
    public strokeColor: string;

    /**
     * Gets or sets the minimum stroke width for signature.
     *
     */
    public minStrokeWidth: number;

    /**
     * Gets or sets the maximum stroke width for signature.
     *
     */
    public maxStrokeWidth: number;

    /**
     * Gets or sets the velocity to calculate the stroke thickness based on the pressure of the contact on the digitizer surface.
     *
     */
    public velocity: number;

    /**
     * Gets or sets the last signature url to maintain the persist state.
     *
     */
    public signatureValue: string;

    /**
     * To Initialize the component rendering
     *
     * @private
     * @param {HTMLCanvasElement} element - Specifies the canvas element.
     * @param {BlazorDotnetObject} dotnetRef - Specifies for blazor client to server communication.
     * @returns {void}
     */
    public initialize(element: HTMLCanvasElement, dotnetRef?: BlazorDotnetObject): void {
        this.clearArray = [];
        this.element = element;
        this.canvasContext = this.element.getContext('2d');
        this.canvasContext.canvas.tabIndex = -1;
        if (dotnetRef) {
            this.dotnetRef = dotnetRef;
            this.isBlazor = true;
            if (this.signatureValue) {
                this.loadPersistedSignature();
            }
        }
        this.setHTMLProperties();
        if (isNullOrUndefined(this.signatureValue)) {
            this.updateSnapCollection(true);
        }
        this.wireEvents();
        if (!this.isBlazor) {
            this.trigger('created', null);
        }
    }

    private wireEvents(): void {
        if (isNullOrUndefined(this.pointColl) && !this.isReadOnly && !this.disabled) {
            EventHandler.add(this.canvasContext.canvas, 'mousedown touchstart', this.mouseDownHandler, this);
            EventHandler.add(this.canvasContext.canvas, 'keydown', this.keyboardHandler, this);
            window.addEventListener('resize', this.resizeHandler.bind(this));
        } else if (this.pointColl) {
            EventHandler.add(this.canvasContext.canvas, 'mousemove touchmove', this.mouseMoveHandler, this);
            EventHandler.add(this.canvasContext.canvas, 'mouseup touchend', this.mouseUpHandler, this);
            EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
        }
    }

    private unwireEvents(type: string): void {
        if (type === 'mouseup' || type === 'touchend') {
            if (this.canvasContext) {
                EventHandler.remove(this.canvasContext.canvas, 'mousemove touchmove', this.mouseMoveHandler);
                EventHandler.remove(this.canvasContext.canvas, 'mouseup touchend', this.mouseUpHandler);
            }
            EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        } else {
            if (this.canvasContext) {
                EventHandler.remove(this.canvasContext.canvas, 'mousedown touchstart', this.mouseDownHandler);
                EventHandler.remove(this.canvasContext.canvas, 'keydown', this.keyboardHandler);
            }
            window.removeEventListener('resize', this.resizeHandler);
        }
    }

    private setHTMLProperties(): void {
        // eslint-disable-next-line max-len
        if (this.element.height === 150 && this.element.width === 300 && this.element.offsetHeight !== 0 && this.element.offsetWidth !== 0) {
            this.element.height = this.element.offsetHeight;
            this.element.width = this.element.offsetWidth;
            this.isResponsive = true;
        } else if ((this.element.height !== this.element.offsetHeight - 1 || this.element.width !== this.element.offsetWidth - 1)
            && this.element.offsetHeight !== 0 && this.element.offsetWidth !== 0) {
            this.element.height = this.element.offsetHeight;
            this.element.width = this.element.offsetWidth;
        }
        this.canvasContext.fillStyle = this.strokeColor;
        this.tempCanvas = this.createElement('canvas', { className: 'e-' + this.getModuleName() + '-temp' });
        this.tempContext = this.tempCanvas.getContext('2d');
        this.tempCanvas.width = this.element.width;
        this.tempCanvas.height = this.element.height;
        if (this.backgroundImage) {
            this.canvasContext.canvas.style.backgroundImage = 'url(' +  this.backgroundImage + ')';
            this.canvasContext.canvas.style.backgroundRepeat = 'no-repeat';
            if (this.saveWithBackground) {
                this.setBackgroundImage(this.backgroundImage, 'temp');
            }
        } else if (this.backgroundColor) {
            this.canvasContext.canvas.style.backgroundColor = this.backgroundColor;
        }
    }

    protected mouseDownHandler(e : MouseEvent & TouchEvent): void {
        if (e.buttons === 1 || e.buttons === 2 || e.type === 'touchstart') {
            if (e.type === 'touchstart') {
                e.preventDefault();
                e.stopPropagation();
            }
            this.beginStroke(e);
            this.wireEvents();
        }
    }

    private mouseMoveHandler(e: MouseEvent & TouchEvent): void {
        if (e.buttons === 1 || e.buttons === 2 || e.type === 'touchmove') {
            if (e.type === 'touchmove') {
                e.preventDefault();
                e.stopPropagation();
            }
            if (this.interval) {
                this.updateStrokeWithThrottle(e);
            } else {
                this.updateStroke(e);
            }
        }
    }

    private mouseUpHandler(e: MouseEvent & TouchEvent): void {
        const args: SignatureChangeEventArgs = { actionName: 'strokeUpdate'};
        if (e.type === 'touchstart') {
            e.preventDefault();
            e.stopPropagation();
        }
        this.endDraw();
        this.updateSnapCollection();
        this.unwireEvents(e.type);
        if (!this.isBlazor) {
            this.trigger('change', args);
        } else {
            this.dotnetRef.invokeMethodAsync('TriggerEventAsync', 'mouseUp');
        }
        this.signatureValue = this.snapColl[this.incStep];
        for (let i: number = 0; i < this.signPointsColl.length; i++) {
            this.signRatioPointsColl.push({ x: (this.signPointsColl[i as number].x / this.canvasContext.canvas.width),
                y: (this.signPointsColl[i as number].y / this.canvasContext.canvas.height)});
        }
        this.signPointsColl = [];
    }

    private keyboardHandler(e : KeyboardEvent): void {
        const args: SignatureBeforeSaveEventArgs = {fileName: 'Signature', type: 'Png', cancel: false};
        switch (e.key) {
        case 'Delete':
            this.clear();
            break;
        case (e.ctrlKey && 's'):
            if (!this.isBlazor) {
                this.trigger('beforeSave', args, (observableSaveArgs: SignatureBeforeSaveEventArgs) => {
                    if (!args.cancel) {
                        this.save(observableSaveArgs.type, observableSaveArgs.fileName);
                    }
                });
            } else {
                this.dotnetRef.invokeMethodAsync('TriggerEventAsync', 'beforeSave');
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            break;
        case (e.ctrlKey && 'z'):
            this.undo();
            break;
        case (e.ctrlKey && 'y'):
            this.redo();
            break;
        }
    }

    private resizeHandler(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        if (this.isResponsive && this.canRedraw && this.canvasContext && this.element) {
            this.canvasContext.canvas.width = this.element.offsetWidth;
            this.canvasContext.canvas.height = this.element.offsetHeight;
            this.canvasContext.scale(1, 1);
            this.canvasContext.fillStyle = this.strokeColor;
            const pointSize: number = (this.minStrokeWidth + this.maxStrokeWidth) / 2;
            for (let i: number = 0; i < this.signRatioPointsColl.length; i++) {
                this.arcDraw((this.signRatioPointsColl[i as number].x * this.canvasContext.canvas.width),
                             (this.signRatioPointsColl[i as number].y * this.canvasContext.canvas.height), pointSize);
            }
            this.signPointsColl = [];
            this.canvasContext.closePath();
            this.canvasContext.fill();
        }
        else if (this.canvasContext && this.element) {
            const restoreImg: HTMLImageElement = new Image();
            restoreImg.src = this.snapColl[this.incStep];
            restoreImg.onload = () => {
                proxy.canvasContext.clearRect(0, 0, proxy.element.width, proxy.element.height);
                proxy.canvasContext.drawImage(restoreImg, 0, 0, proxy.element.width, proxy.element.height);
            };
        }
    }

    private beginStroke(e : MouseEvent & TouchEvent): void {
        this.internalRefresh();
        this.updateStroke(e);
    }

    private updateStroke(e : MouseEvent & TouchEvent): void {
        const point: Point = this.createPoint(e);
        this.addPoint(point);
    }

    private updateStrokeWithThrottle(args: MouseEvent & TouchEvent): void {
        const now: number = Date.now();
        const remaining: number = this.interval - (now - this.previous);
        this.storedArgs = args;
        if (remaining <= 0 || remaining > this.interval) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.previous = now;
            this.updateStroke(this.storedArgs);
            if (!this.timeout) {
                this.storedArgs = null;
            }
        } else if (!this.timeout) {
            this.timeout = window.setTimeout(this.delay.bind(this), remaining);
        }
    }

    private delay(): void {
        this.previous = Date.now();
        this.timeout = null;
        this.updateStroke(this.storedArgs);
        if (!this.timeout) {
            this.storedArgs = null;
        }
    }

    private createPoint(e: MouseEvent & TouchEvent): Point {
        const rect: DOMRect = this.canvasContext.canvas.getBoundingClientRect() as DOMRect;
        if (e.type === 'mousedown' || e.type === 'mousemove') {
            return this.point(e.clientX - rect.left, e.clientY - rect.top, new Date().getTime());
        } else {
            return this.point(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, new Date().getTime());
        }
    }

    /* Returns the current point corrdinates(x, y) and time.*/
    private point(pointX: number, pointY: number, time: number): Point {
        this.pointX = pointX;
        this.pointY = pointY;
        this.time = time || new Date().getTime();
        return { x: this.pointX, y: this.pointY, time: this.time };
    }

    private addPoint(point: Point): void {
        const points: Point[] = this.pointColl; let controlPoint1: Point; let controlPoint2: Point;
        const lastPoint: Point = points.length > 0 && points[points.length - 1];
        const isLastPointTooClose: boolean = lastPoint ? this.distanceTo(lastPoint) <= this.minDistance : false;
        if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
            points.push(point);
            if (points.length > 2) {
                if (points.length === 3) {
                    points.unshift(points[0]);
                }
                controlPoint1 = (this.calculateCurveControlPoints(points[0], points[1], points[2])).controlPoint2;
                controlPoint2 = (this.calculateCurveControlPoints(points[1], points[2], points[3])).controlPoint1;
                this.startPoint = points[1]; this.controlPoint1 = controlPoint1;
                this.controlPoint2 = controlPoint2; this.endPoint = points[2];
                this.startDraw();
                points.shift();
            }
        }
    }

    private startDraw(): void {
        let velocity: number;
        velocity = this.pointVelocityCalc(this.startPoint);
        velocity = this.velocity * velocity + (1 - this.velocity) * this.lastVelocity;
        const newWidth: number = Math.max(this.maxStrokeWidth / (velocity + 1), this.minStrokeWidth);
        this.curveDraw(this.lastWidth, newWidth);
        this.lastVelocity = velocity;
        this.lastWidth = newWidth;
    }

    private endDraw(): void {
        if (isNullOrUndefined(this.pointColl)) { return; }
        const canDrawCurve: boolean = this.pointColl.length > 2; const point: Point = this.pointColl[0];
        if (!canDrawCurve && point) {
            this.strokeDraw(point);
        }
    }

    /* Calculate the Bezier (x, y) coordinate of the curve. */
    private curveDraw(startWidth: number, endWidth: number): void {
        const context: CanvasRenderingContext2D = this.canvasContext;
        let width: number; let i: number; let t1: number; let t2: number;
        let t3: number; let u1: number; let u2: number; let u3: number; let x: number; let y: number;
        const widthValue: number = endWidth - startWidth;
        const bezierLength: number = this.bezierLengthCalc();
        const drawSteps : number = Math.ceil(bezierLength) * 2;
        context.beginPath();
        for (i = 0; i < drawSteps; i++) {
            t1 = i / drawSteps; t2 = t1 * t1; t3 = t2 * t1;
            u1 = 1 - t1; u2 = u1 * u1; u3 = u2 * u1;
            x = u3 * this.startPoint.x; x += 3 * u2 * t1 * this.controlPoint1.x;
            x += 3 * u1 * t2 * this.controlPoint2.x; x += t3 * this.endPoint.x;
            y = u3 * this.startPoint.y; y += 3 * u2 * t1 * this.controlPoint1.y;
            y += 3 * u1 * t2 * this.controlPoint2.y; y += t3 * this.endPoint.y;
            width = Math.min(startWidth + t3 * widthValue, this.maxStrokeWidth);
            this.arcDraw(x, y, width);
        }
        context.closePath();
        context.fill();
        this.isSignatureEmpty = false;
    }

    private strokeDraw(point: Point): void {
        const context: CanvasRenderingContext2D = this.canvasContext;
        const pointSize: number = (this.minStrokeWidth + this.maxStrokeWidth) / 2;
        context.beginPath();
        this.arcDraw( point.x, point.y, pointSize);
        context.closePath();
        context.fill();
        this.isSignatureEmpty = false;
    }

    private arcDraw(x: number, y: number, size: number): void {
        this.signPointsColl.push({x: x, y: y});
        const context: CanvasRenderingContext2D = this.canvasContext;
        context.moveTo(x, y);
        context.arc(x, y, size, 0, 2 * Math.PI, false);
    }

    /* Utility functions for Bezier algorithm*/
    private calculateCurveControlPoints(p1: Point, p2: Point, p3: Point): {controlPoint1: Point, controlPoint2: Point} {
        const dx1: number = p1.x - p2.x; const dy1: number = p1.y - p2.y;
        const dx2: number = p2.x - p3.x; const dy2: number = p2.y - p3.y;
        const m1: Point = { x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0 };
        const m2: Point = { x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0 };
        const l1: number = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2: number = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm: number = (m1.x - m2.x); const dym: number = (m1.y - m2.y);
        const k: number = l2 / (l1 + l2);
        const cm: Point = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx: number = p2.x - cm.x; const ty: number = p2.y - cm.y;
        return {
            controlPoint1: this.point(m1.x + tx, m1.y + ty, 0),
            controlPoint2: this.point(m2.x + tx, m2.y + ty, 0)
        };
    }

    /* Returns approximated bezier length of the curuve.*/
    private bezierLengthCalc(): number {
        const steps: number = 10; let length: number = 0; let i: number; let t: number; let pointx1: number;
        let pointy1: number; let pointx2: number; let pointy2: number; let pointx3: number; let pointy3: number;
        for (i = 0; i <= steps; i++) {
            t = i / steps;
            pointx1 = this.bezierPointCalc(t, this.startPoint.x, this.controlPoint1.x, this.controlPoint2.x, this.endPoint.x);
            pointy1 = this.bezierPointCalc(t, this.startPoint.y, this.controlPoint1.y, this.controlPoint2.y, this.endPoint.y);
            if (i > 0) {
                pointx3 = pointx1 - pointx2;
                pointy3 = pointy1 - pointy2;
                length += Math.sqrt(pointx3 * pointx3 + pointy3 * pointy3);
            }
            pointx2 = pointx1;
            pointy2 = pointy1;
        }
        return length;
    }

    /* Calculate parametric value of x or y given t and the
       four point(startpoint, controlpoint1, controlpoint2, endpoint) coordinates of a cubic bezier curve.*/
    private bezierPointCalc(t: number, startpoint: number, cp1: number, cp2: number, endpoint: number): number {
        return startpoint * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * cp1 * (1.0 - t) * (1.0 - t) * t + 3.0 *
        cp2 * (1.0 - t) * t * t + endpoint * t * t * t;
    }

    /* Velocity between the current point and last point.*/
    private pointVelocityCalc(startPoint: Point): number {
        return (this.time !== startPoint.time) ? this.distanceTo(startPoint) / (this.time - startPoint.time) : 0;
    }

    /* Distance between the current point and last point.*/
    private distanceTo(start: Point): number {
        return Math.sqrt(Math.pow(this.pointX - start.x, 2) + Math.pow(this.pointY - start.y, 2));
    }

    private isRead(isRead: boolean): void {
        if (isRead) {
            EventHandler.remove(this.canvasContext.canvas, 'mousedown touchstart', this.mouseDownHandler);
        } else if (!this.disabled) {
            EventHandler.add(this.canvasContext.canvas, 'mousedown touchstart', this.mouseDownHandler, this);
        }
    }

    private enableOrDisable(isDisable: boolean): void {
        this.disabled = isDisable;
        if (isDisable) {
            this.canvasContext.canvas.style.filter = 'opacity(0.5)';
            this.isRead(true);
        } else {
            this.canvasContext.canvas.style.filter = '';
            this.isRead(false);
        }
    }

    private updateSnapCollection(isClear?: boolean): void {
        if (isNullOrUndefined(this.incStep)) {
            this.incStep = -1;
            this.incStep++;
            this.snapColl = [];
            this.clearArray = [];
        }
        else {
            this.incStep++;
        }
        if (this.incStep < this.snapColl.length) {
            this.snapColl.length = this.incStep;
        }
        if (this.incStep > 0) {
            const canvasNew: HTMLCanvasElement = this.createElement('canvas', { className: 'e-' + this.getModuleName() + '-wrapper' });
            const canvasContextNew: CanvasRenderingContext2D = canvasNew.getContext('2d');
            if (this.canvasContext) {
                canvasNew.width = this.canvasContext.canvas.width;
                canvasNew.height = this.canvasContext.canvas.height;
                canvasContextNew.drawImage(this.canvasContext.canvas, 0, 0, canvasNew.width, canvasNew.height);
                this.snapColl.push(canvasNew.toDataURL());
            }
        } else {
            this.snapColl.push(this.canvasContext.canvas.toDataURL());
        }
        if (isClear) {
            this.clearArray.push(this.incStep);
        }
    }

    private setBackgroundImage(imageSrc: string, type?: string): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        const imageObj: HTMLImageElement = new Image();
        imageObj.crossOrigin = 'anonymous';
        imageObj.src = imageSrc;
        if (type === 'temp') {
            imageObj.onload = () => {
                proxy.tempContext.globalCompositeOperation = 'source-over';
                proxy.tempContext.drawImage(imageObj, 0, 0, proxy.element.width, proxy.element.height);
            };
        } else {
            imageObj.onload = () => {
                proxy.canvasContext.globalCompositeOperation = 'source-over';
                proxy.canvasContext.drawImage(imageObj, 0, 0, proxy.element.width, proxy.element.height);
                proxy.updateSnapCollection();
                proxy.saveBackground(true);
            };
            this.canvasContext.clearRect( 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        }
    }

    private setBackgroundColor(color: string): void {
        const canvasEle: CanvasRenderingContext2D = this.canvasContext;
        canvasEle.strokeStyle = color;
        let i: number; let j: number;
        for ( i = 1; i <= canvasEle.canvas.width; i++) {
            for ( j = 1; j <= canvasEle.canvas.height; j++) {
                canvasEle.strokeRect( 0, 0, i, j);
            }
        }
        this.updateSnapCollection();
    }

    protected loadPersistedSignature(): void {
        if (isNullOrUndefined(this.signatureValue)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        const lastImage: HTMLImageElement = new Image();
        lastImage.src = this.signatureValue;
        lastImage.onload = () => {
            proxy.canvasContext.clearRect(0, 0, proxy.element.width, proxy.element.height);
            proxy.canvasContext.drawImage(lastImage, 0, 0);
            proxy.updateSnapCollection();
        };
        this.isSignatureEmpty = false;
    }

    /**
     * To get the signature as Blob.
     *
     * @param {string} url - specify the url/base 64 string to get blob of the signature.
     * @returns {Blob}.
     */

    public getBlob(url: string): Blob {
        const arr: string[] = url.split(','); const type: string = arr[0].match(/:(.*?);/)[1];
        const bstr: string = atob(arr[1]); let n: number = bstr.length; const u8arr: Uint8Array = new Uint8Array(n);
        while (n--) {
            u8arr[n as number] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: type });
    }

    private download(blob: Blob, fileName: string): void {
        const blobUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = blobUrl;
        a.target = '_parent';
        a.download = fileName;
        (document.body || document.documentElement).appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
    }

    private internalRefresh(): void {
        this.pointColl = [];
        this.lastVelocity = 0;
        this.lastWidth = (this.minStrokeWidth + this.maxStrokeWidth) / 2;
    }

    /**
     * To refresh the signature.
     *
     * @returns {void}.
     */
    public refresh(): void {
        this.isResponsive = false;
        this.setHTMLProperties();
        this.resizeHandler();
        this.internalRefresh();
    }

    /**
     * Erases all the signature strokes signed by user.
     *
     * @returns {void}.
     */

    public clear(): void {
        const args: SignatureChangeEventArgs = { actionName: 'clear'};
        this.canvasContext.clearRect( 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        this.tempContext.clearRect( 0, 0, this.tempContext.canvas.width, this.tempContext.canvas.height);
        if (this.saveWithBackground && this.backgroundImage) {
            this.setBackgroundImage(this.backgroundImage, 'temp');
        }
        this.internalRefresh();
        this.signRatioPointsColl = [];
        this.updateSnapCollection(true);
        this.isSignatureEmpty = this.canRedraw = true;
        if (!this.isBlazor) {
            this.trigger('change', args);
        } else {
            this.dotnetRef.invokeMethodAsync('TriggerEventAsync', 'Clear');
        }
    }

    /**
     * Undo the last user action.
     *
     * @returns {void}.
     */

    public undo(): void {
        const args: SignatureChangeEventArgs = { actionName: 'undo'};
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        if (this.incStep > 0) {
            this.incStep--;
            const undoImg: HTMLImageElement = new Image();
            undoImg.src = this.snapColl[this.incStep];
            undoImg.onload = () => {
                proxy.canvasContext.clearRect(0, 0, proxy.element.width, proxy.element.height);
                proxy.canvasContext.drawImage(undoImg, 0, 0, proxy.element.width, proxy.element.height);
            };
        }
        this.isClear();
        if (!this.isBlazor) {
            this.trigger('change', args);
        } else {
            this.dotnetRef.invokeMethodAsync('TriggerEventAsync', 'Undo');
        }
    }

    /**
     * Redo the last user action.
     *
     * @returns {void}.
     */
    public redo(): void {
        const args: SignatureChangeEventArgs = { actionName: 'redo'};
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        if (this.incStep < this.snapColl.length - 1) {
            this.incStep++;
            const redoImg: HTMLImageElement = new Image();
            redoImg.src = this.snapColl[this.incStep];
            redoImg.onload = () => {
                proxy.canvasContext.clearRect(0, 0, proxy.element.width, proxy.element.height);
                proxy.canvasContext.drawImage(redoImg, 0, 0, proxy.element.width, proxy.element.height);
            };
        }
        this.isClear();
        if (!this.isBlazor) {
            this.trigger('change', args);
        } else {
            this.dotnetRef.invokeMethodAsync('TriggerEventAsync', 'Redo');
        }
    }

    private isClear(): void {
        if (this.clearArray) {
            let empty: boolean = false;
            for (let i: number = 0; i < this.clearArray.length; i++) {
                if (this.clearArray[i as number] === this.incStep) {
                    this.isSignatureEmpty = true;
                    empty = true;
                }
            }
            if (!empty) {
                this.isSignatureEmpty = false;
            }
        }
    }

    /**
     * To check whether the signature is empty or not.
     *
     * @returns {boolean}.
     */

    public isEmpty(): boolean {
        return this.isSignatureEmpty;
    }

    /**
     * To check whether the undo collection is empty or not.
     *
     * @returns {boolean}.
     */

    public canUndo(): boolean {
        return this.incStep > 0;
    }

    /**
     * To check whether the redo collection is empty or not.
     *
     * @returns {boolean}.
     */

    public canRedo(): boolean {
        return this.incStep < this.snapColl.length - 1;
    }

    /**
     * To draw the signature based on the given text, with the font family and font size.
     *
     * @param {string} text - specify text to be drawn as signature.
     * @param {string} fontFamily - specify font family of a signature.
     * @param {number} fontSize - specify font size of a signature.
     * @param {number} x- Specifies the x-coordinate to start the text of a signature. Default to the center point of the image if it not specified.
     * @param {number} y - Specifies the y-coordinate to start the text of a signature. Default to the center point of the image if it not specified.
     *
     * @returns {void}.
     */

    public draw(text: string, fontFamily?: string, fontSize?: number, x?: number, y?: number): void {
        const args: SignatureChangeEventArgs = { actionName: 'draw-text'};
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        fontFamily = fontFamily || 'Arial';
        fontSize = fontSize || 30;
        this.canvasContext.font = fontSize + 'px ' + fontFamily;
        let startX: number = this.element.width / 2;
        let startY: number = this.element.height / 2;
        if (isNullOrUndefined(x) && isNullOrUndefined(y)) {
            this.canvasContext.textAlign = 'center';
            this.canvasContext.textBaseline = 'middle';
        } else {
            startX = isNullOrUndefined(x) ? startX : x;
            startY = isNullOrUndefined(y) ? startY + fontSize / 2 : (y + fontSize / 2);
        }
        this.canvasContext.fillText(text, startX, startY);
        this.updateSnapCollection();
        this.isSignatureEmpty = false;
        this.trigger('change', args);
    }

    /**
     * To load the signature with the given base 64 string, height and width.
     *
     * @param {string} signature - specify the url/base 64 string to be drawn as signature.
     * @param {number} width - specify the width of the loaded signature image.
     * @param {number} height - specify the height of the loaded signature image.
     * @returns {void}.
     */

    public load(signature: string, width?: number, height?: number): void {
        height = height || this.element.height;
        width = width || this.element.width;
        this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        const bitmapImage: HTMLImageElement = new Image();
        bitmapImage.src = signature;
        if (signature.slice(0, 4) !== 'data') {
            bitmapImage.crossOrigin = 'anonymous';
        }
        bitmapImage.onload = () => {
            Promise.all([
                createImageBitmap(bitmapImage, 0, 0, width, height)
            ]).then((results: ImageBitmap[]) => {
                const tempCanvas: HTMLCanvasElement = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                tempCanvas.getContext('2d').drawImage(results[0], 0, 0);
                if (signature.slice(0, 4) !== 'data') {
                    proxy.canvasContext.globalCompositeOperation = 'source-over';
                }
                proxy.canvasContext.drawImage(tempCanvas, 0, 0, width, height, 0, 0, proxy.element.width, proxy.element.height);
                proxy.updateSnapCollection();
            });
        };
        this.isSignatureEmpty = this.canRedraw = false;
    }

    private saveBackground(savebg: boolean): void {
        let imageSrc: string;
        if (savebg && this.backgroundImage) {
            imageSrc = this.snapColl[this.incStep - 1];
        } else {
            imageSrc = this.snapColl[this.incStep];
        }
        if (!savebg) {
            this.canvasContext.clearRect( 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
            if (this.backgroundImage) {
                this.setBackgroundImage(this.backgroundImage);
            } else if (this.backgroundColor) {
                this.setBackgroundColor(this.backgroundColor);
                savebg = true;
            }
        }
        if (savebg) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const proxy: SignatureBase = this;
            const imageObj: HTMLImageElement = new Image();
            imageObj.crossOrigin = 'anonymous';
            imageObj.src = imageSrc;
            imageObj.onload = () => {
                proxy.backgroundLoaded = true;
                proxy.canvasContext.globalCompositeOperation = 'source-over';
                proxy.canvasContext.drawImage(imageObj, 0, 0, proxy.element.width, proxy.element.height);
                proxy.save(proxy.fileType, proxy.fileName);
            };
        }
    }

    /**
     * To save the signature with the given file type and file name.
     *
     * @param {SignatureFileType} type - specify type of the file to be saved a signature.
     * @param {string} fileName - specify name of the file to be saved a signature.
     *
     * @returns {void}.
     */

    public save(type?: SignatureFileType, fileName?: string): void {
        if (this.saveWithBackground && this.backgroundLoaded == null && (this.backgroundImage || this.backgroundColor)) {
            this.backgroundLoaded = false;
            this.fileType = type; this.fileName = fileName;
            this.saveBackground(false);
        } else if (type === 'Svg') {
            fileName = fileName || 'Signature';
            this.toSVG(fileName);
        } else if (type === 'Jpeg') {
            fileName = fileName || 'Signature';
            if (!this.saveWithBackground || this.saveWithBackground && !(this.backgroundImage || this.backgroundColor)) {
                this.toJPEG(fileName);
            } else {
                const dataURL: string = this.canvasContext.canvas.toDataURL('image/jpeg');
                this.download(this.getBlob(dataURL), fileName + '.' + 'jpeg');
            }
        } else {
            fileName = fileName || 'Signature';
            const dataURL: string = this.canvasContext.canvas.toDataURL('image/png');
            this.download(this.getBlob(dataURL), fileName + '.' + 'png');
        }
        if (this.saveWithBackground && this.backgroundLoaded) {
            this.resetSnap();
        }
    }

    private resetSnap(): void {
        this.canvasContext.clearRect( 0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        const restoreObj: HTMLImageElement = new Image();
        restoreObj.src = this.snapColl[this.incStep - 1];
        restoreObj.onload = () => {
            proxy.canvasContext.drawImage(restoreObj, 0, 0, proxy.element.width, proxy.element.height);
            proxy.updateSnapCollection();
        };
        this.backgroundLoaded = null;
        this.snapColl.pop(); this.incStep--;
        this.snapColl.pop(); this.incStep--;
    }

    private toJPEG(fileName: string): void {
        const imageSrc: string = this.snapColl[this.incStep];
        this.setBackgroundColor('#ffffff');
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: SignatureBase = this;
        const imageObj: HTMLImageElement = new Image();
        imageObj.crossOrigin = 'anonymous';
        imageObj.src = imageSrc;
        imageObj.onload = () => {
            proxy.canvasContext.globalCompositeOperation = 'source-over';
            proxy.canvasContext.drawImage(imageObj, 0, 0, proxy.element.width, proxy.element.height);
            const dataURL: string = proxy.canvasContext.canvas.toDataURL('image/jpeg');
            proxy.download(proxy.getBlob(dataURL), fileName + '.' + 'jpeg');
            proxy.canvasContext.clearRect( 0, 0, proxy.canvasContext.canvas.width, proxy.canvasContext.canvas.height);
            this.resizeHandler();
        };
        this.snapColl.pop();
        this.incStep--;
    }

    private toSVG(fileName?: string, dataUrl?: string): string {
        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.canvasContext.canvas.width.toString());
        svg.setAttribute('height', this.canvasContext.canvas.height.toString());
        const XLinkNS: string = 'http://www.w3.org/1999/xlink';
        const img: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttributeNS(null, 'height', this.canvasContext.canvas.height.toString());
        img.setAttributeNS(null, 'width', this.canvasContext.canvas.width.toString());
        img.setAttributeNS(XLinkNS, 'xlink:href', dataUrl);
        svg.appendChild(img);
        const prefix: string = 'data:image/svg+xml;base64,';
        const header: string = '<svg' + ' xmlns="http://www.w3.org/2000/svg"' + ' xmlns:xlink="http://www.w3.org/1999/xlink"'
         + ` width="${this.canvasContext.canvas.width}"` + ` height="${this.canvasContext.canvas.height}"` + '>';
        const footer: string = '</svg>';
        const body: string = svg.innerHTML;
        const data: string = header + body + footer;
        const svgDataUrl: string = prefix + btoa(data);
        if (fileName == null) {
            return svgDataUrl;
        } else {
            this.download(this.getBlob(svgDataUrl), fileName + '.' + 'svg');
            return null;
        }
    }

    /**
     * To save the signature as Blob.
     *
     * @returns {Blob}.
     */
    public saveAsBlob(): Blob {
        return this.getBlob(this.canvasContext.canvas.toDataURL('image/png'));
    }

    /**
     * Gets the signature as a Base 64 string.
     *
     * This method is used to retrieve the current signature on the canvas as a Base 64-encoded string, in the specified image format.
     *
     * @param {SignatureFileType} [type] - Specifies the type of the image format.
     * Can be one of 'Png', 'Jpeg', or 'Svg'. If not specified, the default is 'Png'.
     * @returns {string} - Returns the Base 64 string of the signature in the specified format.
     */

    public getSignature(type?: SignatureFileType): string {
        if (this.saveWithBackground && this.backgroundColor && !this.backgroundImage) {
            this.tempContext.fillStyle = this.backgroundColor;
            this.tempContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        } else if (!this.backgroundColor && !this.backgroundImage && type === 'Jpeg') {
            this.tempContext.fillStyle = '#fff';
            this.tempContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
        }
        this.tempContext.drawImage(this.element, 0, 0);
        if (type === 'Jpeg') {
            return this.tempCanvas.toDataURL('image/jpeg');
        } else if (type === 'Svg') {
            return this.toSVG(null, this.tempCanvas.toDataURL('image/png'));
        }else {
            return this.tempCanvas.toDataURL('image/png');
        }
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    protected getModuleName(): string {
        return 'signature';
    }

    /**
     * To get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        this.signatureValue = this.snapColl[this.incStep];
        return this.addOnPersist(['signatureValue']);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        if (this.getModuleName() !== 'image-editor') {
            this.unwireEvents(null);
            removeClass([this.element], 'e-' + this.getModuleName());
            this.element.removeAttribute('tabindex');
            this.pointColl = null;
            this.tempContext = null;
            this.tempCanvas = null;
            this.canvasContext = null;
        }
        super.destroy();
        this.element = null;
    }

    /**
     * Modified onPropertyChanged method for both blazor and EJ2 signature component.
     *
     * @private
     * @param {string} key - Specifies the property, which changed.
     * @param {string} value - Specifies the property value changed.
     * @returns {void}
     */
    public propertyChanged(key: string, value: string | boolean | number): void {
        const canvasNew: CanvasRenderingContext2D = this.canvasContext;
        switch (key) {
        case 'backgroundColor':
            canvasNew.canvas.style.backgroundColor = value as string;
            this.backgroundColor = value as string;
            break;
        case 'backgroundImage':
            canvasNew.canvas.style.backgroundImage = 'url(' + value + ')';
            this.backgroundImage = value as string;
            if (this.saveWithBackground) {
                this.setBackgroundImage(this.backgroundImage, 'temp');
            }
            break;
        case 'strokeColor':
            canvasNew.fillStyle = value as string;
            this.strokeColor = value as string;
            break;
        case 'saveWithBackground':
            this.saveWithBackground = value as boolean;
            break;
        case 'maxStrokeWidth':
            this.maxStrokeWidth = value as number;
            break;
        case 'minStrokeWidth':
            this.minStrokeWidth = value as number;
            break;
        case 'velocity':
            this.velocity = value as number;
            break;
        case 'isReadOnly':
            this.isRead(value as boolean);
            break;
        case 'disabled':
            this.enableOrDisable(value as boolean);
            break;
        }
    }
}

/**
 * Interface for Point object.
 */
interface Point {
    /**
     * Gets or sets the x position of the point.
     */
    x: number;
    /**
     * Gets or sets the y position of the point.
     */
    y: number;
    /**
     * Gets or sets the time.
     */
    time?: number;
}

/**
 * Defines the signature file type.
 */
export type SignatureFileType = 'Png' | 'Jpeg' | 'Svg' ;

/**
 * Interface for before save the canvas as image.
 */
export interface SignatureBeforeSaveEventArgs {
    /**
     * Gets or sets whether to cancel the save action. You can cancel and perform save operation programmatically.
     */
    cancel?: boolean;
    /**
     * Gets or sets the file name to be saved.
     */
    fileName?: string;
    /**
     * Gets or sets the file type to be saved.
     */
    type?: SignatureFileType;
}

/**
 * Interface for changes occur in the signature.
 */
export interface SignatureChangeEventArgs {
    /**
     * Gets or sets the action name of the signature.
     */
    actionName: string;
}

/**
 * Interface for Dimension calculation in the imageEditor.
 */
export interface Dimension {
    /**
     * Gets x position from the canvas.
     */
    x?: number;
    /**
     * Gets y position from the canvas.
     */
    y?: number;
    /**
     * Gets width of the image.
     */
    width: number;
    /**
     * Gets height of the image.
     */
    height: number;
}

/**
 * Interface for active object in the imageEditor.
 */
export interface ActivePoint {
    /**
     * Gets mouse down x-point.
     */
    startX: number;
    /**
     * Gets mouse down y-point.
     */
    startY: number;
    /**
     * Gets mouse move x-point.
     */
    endX?: number;
    /**
     * Gets mouse move y-point.
     */
    endY?: number;
    /**
     * Gets width of the selection.
     */
    width?: number;
    /**
     * Gets height of the selection.
     */
    height?: number;
    /**
     * Gets radius of the circle dot.
     */
    radius?: number;
}
