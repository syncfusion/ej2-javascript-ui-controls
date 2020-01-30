import { Browser, ChildProperty, Complex, Component, Event, L10n, Property, createElement } from '@syncfusion/ej2-base';

/**
 * Enum
 */
/**
 * Defines the event of the barcode
 * * BarcodeEvent - Throws when an invalid input was given.
 */
var BarcodeEvent;
(function (BarcodeEvent) {
    BarcodeEvent[BarcodeEvent["invalid"] = 0] = "invalid";
})(BarcodeEvent || (BarcodeEvent = {}));
/**
 * Defines the quite zone for the Qr Code.
 */
/** @private */
var QuietZone;
(function (QuietZone) {
    QuietZone[QuietZone["All"] = 2] = "All";
})(QuietZone || (QuietZone = {}));
/**
 * Defines the size for the datamatrix code. The defined size are
 * * Auto
 * * Size10x10
 * * Size12x12
 * * Size14x14
 * * Size16x16
 * * Size18x18
 * * Size20x20
 * * Size22x22
 * * Size24x24
 * * Size26x26
 * * Size32x32
 * * Size36x36
 * * Size40x40
 * * Size44x44
 * * Size48x48
 * * Size52x52
 * * Size64x64
 * * Size72x72
 * * Size80x80
 * * Size88x88
 * * Size96x96
 * * Size104x104
 * * Size120x120
 * * Size132x132
 * * Size144x144
 * * Size8x18
 * * Size8x32
 * * Size12x26
 * * Size12x36
 * * Size16x36
 * * Size16x48
 * @aspNumberEnum
 * @blazorNumberEnum
 * @IgnoreSingular
 */
var DataMatrixSize;
(function (DataMatrixSize) {
    /**
     * modules will be generated automatically.
     */
    DataMatrixSize[DataMatrixSize["Auto"] = 0] = "Auto";
    /**
     * will generate 10*10 modules.
     */
    DataMatrixSize[DataMatrixSize["Size10x10"] = 1] = "Size10x10";
    /**
     * will generate 12*12 modules.
     */
    DataMatrixSize[DataMatrixSize["Size12x12"] = 2] = "Size12x12";
    /**
     * will generate 14*14 modules.
     */
    DataMatrixSize[DataMatrixSize["Size14x14"] = 3] = "Size14x14";
    /**
     * will generate 16*16 modules.
     */
    DataMatrixSize[DataMatrixSize["Size16x16"] = 4] = "Size16x16";
    /**
     * will generate 18*18 modules.
     */
    DataMatrixSize[DataMatrixSize["Size18x18"] = 5] = "Size18x18";
    /**
     * will generate 20*20 modules.
     */
    DataMatrixSize[DataMatrixSize["Size20x20"] = 6] = "Size20x20";
    /**
     * will generate 22*22 modules.
     */
    DataMatrixSize[DataMatrixSize["Size22x22"] = 7] = "Size22x22";
    /**
     * will generate 24*24 modules.
     */
    DataMatrixSize[DataMatrixSize["Size24x24"] = 8] = "Size24x24";
    /**
     * will generate 26*26 modules.
     */
    DataMatrixSize[DataMatrixSize["Size26x26"] = 9] = "Size26x26";
    /**
     * will generate 32*32 modules.
     */
    DataMatrixSize[DataMatrixSize["Size32x32"] = 10] = "Size32x32";
    /**
     * will generate 32*32 modules.
     */
    DataMatrixSize[DataMatrixSize["Size36x36"] = 11] = "Size36x36";
    /**
     * will generate 40*40 modules.
     */
    DataMatrixSize[DataMatrixSize["Size40x40"] = 12] = "Size40x40";
    /**
     * will generate 44*44 modules.
     */
    DataMatrixSize[DataMatrixSize["Size44x44"] = 13] = "Size44x44";
    /**
     * will generate 48*48 modules.
     */
    DataMatrixSize[DataMatrixSize["Size48x48"] = 14] = "Size48x48";
    /**
     * will generate 52*52 modules.
     */
    DataMatrixSize[DataMatrixSize["Size52x52"] = 15] = "Size52x52";
    /**
     * will generate 64*64 modules.
     */
    DataMatrixSize[DataMatrixSize["Size64x64"] = 16] = "Size64x64";
    /**
     * will generate 72*72 modules.
     */
    DataMatrixSize[DataMatrixSize["Size72x72"] = 17] = "Size72x72";
    /**
     * will generate 80*80 modules.
     */
    DataMatrixSize[DataMatrixSize["Size80x80"] = 18] = "Size80x80";
    /**
     * will generate 88*88 modules.
     */
    DataMatrixSize[DataMatrixSize["Size88x88"] = 19] = "Size88x88";
    /**
     * will generate 96*96 modules.
     */
    DataMatrixSize[DataMatrixSize["Size96x96"] = 20] = "Size96x96";
    /**
     * will generate 104*104 modules.
     */
    DataMatrixSize[DataMatrixSize["Size104x104"] = 21] = "Size104x104";
    /**
     * will generate 120*120 modules.
     */
    DataMatrixSize[DataMatrixSize["Size120x120"] = 22] = "Size120x120";
    /**
     * will generate 132*132 modules.
     */
    DataMatrixSize[DataMatrixSize["Size132x132"] = 23] = "Size132x132";
    /**
     * will generate 144*144 modules.
     */
    DataMatrixSize[DataMatrixSize["Size144x144"] = 24] = "Size144x144";
    /**
     * will generate 8*18 modules.
     */
    DataMatrixSize[DataMatrixSize["Size8x18"] = 25] = "Size8x18";
    /**
     * will generate 8*32 modules.
     */
    DataMatrixSize[DataMatrixSize["Size8x32"] = 26] = "Size8x32";
    /**
     * will generate 12*26 modules.
     */
    DataMatrixSize[DataMatrixSize["Size12x26"] = 27] = "Size12x26";
    /**
     * will generate 12*36 modules.
     */
    DataMatrixSize[DataMatrixSize["Size12x36"] = 28] = "Size12x36";
    /**
     * will generate 16*36 modules.
     */
    DataMatrixSize[DataMatrixSize["Size16x36"] = 29] = "Size16x36";
    /**
     * will generate 16*48 modules.
     */
    DataMatrixSize[DataMatrixSize["Size16x48"] = 30] = "Size16x48";
})(DataMatrixSize || (DataMatrixSize = {}));
/**
 * Defines the Qrcode QRCodeVersion. They are
 * * Auto
 * * Version01
 * * Version02
 * * Version03
 * * Version04
 * * Version05
 * * Version06
 * * Version07
 * * Version08
 * * Version09
 * * Version10
 * * Version11
 * * Version12
 * * Version13
 * * Version14
 * * Version15
 * * Version16
 * * Version17
 * * Version18
 * * Version19
 * * Version20
 * * Version21
 * * Version22
 * * Version23
 * * Version24
 * * Version25
 * * Version26
 * * Version27
 * * Version28
 * * Version29
 * * Version30
 * * Version31
 * * Version32
 * * Version33
 * * Version34
 * * Version35
 * * Version36
 * * Version37
 * * Version38
 * * Version39
 * * Version40
 * @aspNumberEnum
 * @blazorNumberEnum
 * @IgnoreSingular
 */
var QRCodeVersion;
(function (QRCodeVersion) {
    /**
     * Specifies the default version.
     */
    QRCodeVersion[QRCodeVersion["Auto"] = 0] = "Auto";
    /**
     * Specifies version 1 (21 x 21 modules).
     */
    QRCodeVersion[QRCodeVersion["Version01"] = 1] = "Version01";
    /**
     * Specifies version 2 (25 x 25 modules).
     */
    QRCodeVersion[QRCodeVersion["Version02"] = 2] = "Version02";
    /**
     * Specifies version 3 (29 x 29 modules).
     */
    QRCodeVersion[QRCodeVersion["Version03"] = 3] = "Version03";
    /**
     * Specifies version 4 (33 x 33 modules).
     */
    QRCodeVersion[QRCodeVersion["Version04"] = 4] = "Version04";
    /**
     * Specifies version 5 (37 x 37 modules).
     */
    QRCodeVersion[QRCodeVersion["Version05"] = 5] = "Version05";
    /**
     * Specifies version 6 (41 x 41 modules).
     */
    QRCodeVersion[QRCodeVersion["Version06"] = 6] = "Version06";
    /**
     * Specifies version 7 (45 x 45 modules).
     */
    QRCodeVersion[QRCodeVersion["Version07"] = 7] = "Version07";
    /**
     * Specifies version 8 (49 x 49 modules).
     */
    QRCodeVersion[QRCodeVersion["Version08"] = 8] = "Version08";
    /**
     * Specifies version 9 (53 x 53 modules).
     */
    QRCodeVersion[QRCodeVersion["Version09"] = 9] = "Version09";
    /**
     * Specifies version 10 (57 x 57 modules).
     */
    QRCodeVersion[QRCodeVersion["Version10"] = 10] = "Version10";
    /**
     * Specifies version 11 (61 x 61 modules).
     */
    QRCodeVersion[QRCodeVersion["Version11"] = 11] = "Version11";
    /**
     * Specifies version 12 (65 x 65 modules).
     */
    QRCodeVersion[QRCodeVersion["Version12"] = 12] = "Version12";
    /**
     * Specifies version 13 (69 x 69 modules).
     */
    QRCodeVersion[QRCodeVersion["Version13"] = 13] = "Version13";
    /**
     * Specifies version 14 (73 x 73 modules).
     */
    QRCodeVersion[QRCodeVersion["Version14"] = 14] = "Version14";
    /**
     * Specifies version 15 (77 x 77 modules).
     */
    QRCodeVersion[QRCodeVersion["Version15"] = 15] = "Version15";
    /**
     * Specifies version 17 (85 x 85 modules).
     */
    QRCodeVersion[QRCodeVersion["Version16"] = 16] = "Version16";
    /**
     * Specifies version 17 (85 x 85 modules).
     */
    QRCodeVersion[QRCodeVersion["Version17"] = 17] = "Version17";
    /**
     * Specifies version 18 (89 x 89 modules).
     */
    QRCodeVersion[QRCodeVersion["Version18"] = 18] = "Version18";
    /**
     * Specifies version 19 (93 x 93 modules).
     */
    QRCodeVersion[QRCodeVersion["Version19"] = 19] = "Version19";
    /**
     * Specifies version 20 (97 x 97 modules).
     */
    QRCodeVersion[QRCodeVersion["Version20"] = 20] = "Version20";
    /**
     * Specifies version 21 (101 x 101 modules).
     */
    QRCodeVersion[QRCodeVersion["Version21"] = 21] = "Version21";
    /**
     * Specifies version 22 (105 x 105 modules).
     */
    QRCodeVersion[QRCodeVersion["Version22"] = 22] = "Version22";
    /**
     * Specifies version 23 (109 x 109 modules).
     */
    QRCodeVersion[QRCodeVersion["Version23"] = 23] = "Version23";
    /**
     * Specifies version 24 (113 x 113 modules).
     */
    QRCodeVersion[QRCodeVersion["Version24"] = 24] = "Version24";
    /**
     * Specifies version 25 (117 x 117 modules).
     */
    QRCodeVersion[QRCodeVersion["Version25"] = 25] = "Version25";
    /**
     * Specifies version 26 (121 x 121 modules).
     */
    QRCodeVersion[QRCodeVersion["Version26"] = 26] = "Version26";
    /**
     * Specifies version 27 (125 x 125 modules).
     */
    QRCodeVersion[QRCodeVersion["Version27"] = 27] = "Version27";
    /**
     * Specifies version 28 (129 x 129 modules).
     */
    QRCodeVersion[QRCodeVersion["Version28"] = 28] = "Version28";
    /**
     * Specifies version 29 (133 x 133 modules).
     */
    QRCodeVersion[QRCodeVersion["Version29"] = 29] = "Version29";
    /**
     * Specifies version 30 (137 x 137 modules).
     */
    QRCodeVersion[QRCodeVersion["Version30"] = 30] = "Version30";
    /**
     * Specifies version 31 (141 x 141 modules).
     */
    QRCodeVersion[QRCodeVersion["Version31"] = 31] = "Version31";
    /**
     * Specifies version 32 (145 x 145 modules).
     */
    QRCodeVersion[QRCodeVersion["Version32"] = 32] = "Version32";
    /**
     * Specifies version 33 (149 x 149 modules).
     */
    QRCodeVersion[QRCodeVersion["Version33"] = 33] = "Version33";
    /**
     * Specifies version 34 (153 x 153 modules).
     */
    QRCodeVersion[QRCodeVersion["Version34"] = 34] = "Version34";
    /**
     * Specifies version 35 (157 x 157 modules).
     */
    QRCodeVersion[QRCodeVersion["Version35"] = 35] = "Version35";
    /**
     * Specifies version 36 (161 x 161 modules).
     */
    QRCodeVersion[QRCodeVersion["Version36"] = 36] = "Version36";
    /**
     * Specifies version 37 (165 x 165 modules).
     */
    QRCodeVersion[QRCodeVersion["Version37"] = 37] = "Version37";
    /**
     * Specifies version 38 (169 x 169 modules).
     */
    QRCodeVersion[QRCodeVersion["Version38"] = 38] = "Version38";
    /**
     * Specifies version 39 (173 x 173 modules).
     */
    QRCodeVersion[QRCodeVersion["Version39"] = 39] = "Version39";
    /**
     * Specifies version 40 (177 x 177 modules).
     */
    QRCodeVersion[QRCodeVersion["Version40"] = 40] = "Version40";
})(QRCodeVersion || (QRCodeVersion = {}));
/**
 * Indicated the recovery capacity of the qrcode. The default capacity levels are
 * * Low
 * * Medium
 * * Quartile
 * * High
 * @aspNumberEnum
 * @blazorNumberEnum
 * @IgnoreSingular
 */
var ErrorCorrectionLevel;
(function (ErrorCorrectionLevel) {
    /**
     * The Recovery capacity is 7%(approx.)
     */
    ErrorCorrectionLevel[ErrorCorrectionLevel["Low"] = 7] = "Low";
    /**
     * The Recovery capacity is 15%(approx.)
     */
    ErrorCorrectionLevel[ErrorCorrectionLevel["Medium"] = 15] = "Medium";
    /**
     * The Recovery capacity is 25%(approx.)
     */
    ErrorCorrectionLevel[ErrorCorrectionLevel["Quartile"] = 25] = "Quartile";
    /**
     * The Recovery capacity is 30%(approx.)
     */
    ErrorCorrectionLevel[ErrorCorrectionLevel["High"] = 30] = "High";
})(ErrorCorrectionLevel || (ErrorCorrectionLevel = {}));

/**
 * Size defines and processes the size(width/height) of the objects
 */
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());

/**
 * DOM util
 */
/** @private */
function createHtmlElement(elementType, attribute) {
    var element = createElement(elementType);
    if (attribute) {
        setAttribute(element, attribute);
    }
    return element;
}
function getChildNode(node) {
    var child;
    var collection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (var i = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i];
            if (child.nodeType === 1) {
                collection.push(child);
            }
        }
    }
    else {
        collection = node.children;
    }
    return collection;
}
function measureText(textContent) {
    var measureElement = 'barcodeMeasureElement';
    window[measureElement].style.visibility = 'visible';
    var svg = window[measureElement].children[1];
    var text = getChildNode(svg)[0];
    text.textContent = textContent.string;
    text.setAttribute('style', 'font-size:' + textContent.stringSize + 'px; font-family:'
        + textContent.fontStyle + ';font-weight:');
    var bBox = new Size(0, 0);
    bBox.width = text.getBBox().width;
    bBox.height = text.getBBox().height;
    window[measureElement].style.visibility = 'hidden';
    return bBox;
}
/** @private */
function setAttribute(element, attributes) {
    var keys = Object.keys(attributes);
    for (var i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}
/** @private */
function createSvgElement(elementType, attribute) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttribute(element, attribute);
    return element;
}
/** @private */
function createMeasureElements() {
    var measureElement = 'barcodeMeasureElement';
    if (!window[measureElement]) {
        var divElement = createHtmlElement('div', {
            id: 'barcodeMeasureElement', class: 'barcodeMeasureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        var text = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);
        var tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureElement] = divElement;
        window[measureElement].usageCount = 1;
        document.body.appendChild(divElement);
    }
    else {
        window[measureElement].usageCount += 1;
    }
}

/**
 * canvas renderer
 */
/** @private */
var BarcodeCanvasRenderer = /** @__PURE__ @class */ (function () {
    function BarcodeCanvasRenderer() {
    }
    /**   @private  */
    BarcodeCanvasRenderer.getContext = function (canvas) {
        return canvas.getContext('2d');
    };
    /**   @private  */
    BarcodeCanvasRenderer.prototype.renderRootElement = function (attribute, backGroundColor, width, height) {
        var canvasObj = createHtmlElement('canvas', attribute);
        var ctx = canvasObj.getContext('2d');
        ctx.fillStyle = backGroundColor;
        ctx.fillRect(0, 0, width, height);
        return canvasObj;
    };
    /**   @private  */
    BarcodeCanvasRenderer.prototype.renderRect = function (canvas, attribute) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = attribute.color;
        ctx.fillRect(attribute.x, attribute.y, attribute.width, attribute.height);
        return canvas;
    };
    BarcodeCanvasRenderer.prototype.renderText = function (canvas, attribute) {
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.font = (attribute.stringSize) + 'px ' + attribute.fontStyle;
        ctx.fillStyle = attribute.color;
        ctx.fillText(attribute.string, attribute.x, attribute.y);
        return canvas;
    };
    return BarcodeCanvasRenderer;
}());

/**
 * svg renderer
 */
/** @private */
var BarcodeSVGRenderering = /** @__PURE__ @class */ (function () {
    function BarcodeSVGRenderering() {
    }
    /**   @private  */
    BarcodeSVGRenderering.prototype.renderRootElement = function (attribute, backGroundColor) {
        var canvasObj = createSvgElement('svg', attribute);
        canvasObj.setAttribute('style', 'background:' + backGroundColor);
        return canvasObj;
    };
    /**   @private  */
    BarcodeSVGRenderering.prototype.renderRect = function (svg, attribute) {
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', attribute.x.toString());
        rect.setAttribute('y', attribute.y.toString());
        rect.setAttribute('width', attribute.width.toString());
        rect.setAttribute('height', attribute.height.toString());
        rect.setAttribute('fill', attribute.color);
        svg.appendChild(rect);
        return svg;
    };
    /**   @private  */
    BarcodeSVGRenderering.prototype.renderText = function (svg, attribute) {
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', attribute.x.toString());
        text.setAttribute('y', attribute.y.toString());
        text.setAttribute('fill', attribute.color);
        text.style.fontSize = attribute.stringSize.toString() + 'px';
        text.style.fontFamily = attribute.fontStyle;
        text.textContent = attribute.string;
        svg.appendChild(text);
        return svg;
    };
    return BarcodeSVGRenderering;
}());

/**
 * Renderer
 */
/**
 * Renderer module is used to render basic barcode elements
 */
/** @private */
var BarcodeRenderer = /** @__PURE__ @class */ (function () {
    function BarcodeRenderer(name, isSvgMode) {
        /**   @private  */
        this.renderer = null;
        this.isSvgMode = null;
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new BarcodeSVGRenderering() : new BarcodeCanvasRenderer();
    }
    /**   @private  */
    BarcodeRenderer.prototype.renderRootElement = function (attribute, backGroundColor, width, height) {
        var canvasObj = this.renderer.renderRootElement(attribute, backGroundColor, width, height);
        return canvasObj;
    };
    /**   @private  */
    BarcodeRenderer.prototype.renderRectElement = function (canvas, attribute) {
        var canvasObj = this.renderer.renderRect(canvas, attribute);
        return canvasObj;
    };
    /**   @private  */
    BarcodeRenderer.prototype.renderTextElement = function (canvas, attribute) {
        var canvasObj = this.renderer.renderText(canvas, attribute);
        return canvasObj;
    };
    return BarcodeRenderer;
}());

/**
 * defines the common methods for the barcode
 */
var BarcodeBase = /** @__PURE__ @class */ (function () {
    function BarcodeBase() {
    }
    return BarcodeBase;
}());

/**
 * Rect defines and processes rectangular regions
 */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, width, height) {
        /**
         * Sets the x-coordinate of the starting point of a rectangular region
         * @default 0
         */
        this.x = Number.MAX_VALUE;
        /**
         * Sets the y-coordinate of the starting point of a rectangular region
         * @default 0
         */
        this.y = Number.MAX_VALUE;
        /**
         * Sets the width of a rectangular region
         * @default 0
         */
        this.width = 0;
        /**
         * Sets the height of a rectangular region
         * @default 0
         */
        this.height = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * onedimension class is used to render all type of one dimensional shapes
 */
var OneDimension = /** @__PURE__ @class */ (function (_super) {
    __extends$3(OneDimension, _super);
    function OneDimension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneDimension.prototype.getInstance = function (id) {
        var barCode = document.getElementById(id);
        var barcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    };
    /** @private */
    OneDimension.prototype.getDrawableSize = function (margin, w, h) {
        var topMargin;
        var rightMargin;
        topMargin = ((this.isSvgMode ? margin.bottom : margin.bottom * 1.5) + (this.isSvgMode ? margin.top : margin.top * 1.5));
        rightMargin = ((this.isSvgMode ? margin.right : margin.right * 1.5) + (this.isSvgMode ? margin.left : margin.left * 1.5));
        var barcodeSize = new Rect(margin.left, margin.top, (w - rightMargin), h - topMargin);
        return barcodeSize;
    };
    
    OneDimension.prototype.getBaseAttributes = function (width, height, offSetX, offsetY, color, string, stringSize, visibility, fontStyle) {
        var options = {
            width: width, height: height, x: offSetX, y: offsetY, color: color, string: string,
            stringSize: stringSize, visibility: visibility, fontStyle: fontStyle
        };
        if (!this.isSvgMode) {
            options.height = options.height / 1.5;
        }
        if (string && !this.isSvgMode) {
            var scaleValue = this.margin.bottom * 1.5 - this.margin.bottom;
            options.y += scaleValue;
        }
        return options;
    };
    OneDimension.prototype.getBarLineRatio = function (code, widthValue) {
        var type = this.type;
        if (type === 'Code39' || type === 'Code32' || type === 'Code39Extension' || type === 'Code11') {
            // total number of line for single width lines
            var singlewidth = code.length * ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension') ? 6 : 3);
            // total number of line for double width lines
            var doublwidth = code.length * ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension') ? 3 : 2) * 2;
            return (widthValue / (doublwidth + singlewidth + code.length - 1));
        }
        else if (type === 'Code128A' || type === 'Code128B' || type === 'Code128C' || type === 'Code128') {
            var lineCount = code[0].length;
            return (widthValue / (lineCount + code.length - 1));
        }
        else if (type === 'Code93Extension') {
            var count = 0;
            for (var i = 0; i < code.length; i++) {
                var numberOfDigits = code[i];
                for (var j = 0; j < numberOfDigits.length; j++) {
                    count += Number(numberOfDigits[j]);
                }
            }
            return widthValue / count;
        }
        else {
            var lineCount = 0;
            for (var i = 0; i < code.length; i++) {
                var numberOfDigits = code[i].length;
                lineCount += numberOfDigits;
            }
            var additionalValue = void 0;
            if (type === 'Ean8' || type === 'Ean13' || type === 'UpcA') {
                additionalValue = 2;
            }
            else if (type === 'Code93') {
                additionalValue = -code.length + 1;
            }
            return (widthValue / (additionalValue ? ((lineCount + code.length - 1) + additionalValue) : (lineCount + code.length - 1)));
        }
    };
    OneDimension.prototype.multipleWidth = function (codeValue, k, value) {
        var number;
        if (codeValue[k] === '1' && codeValue[k + 1] === '1') {
            number = value + 1;
            return this.multipleWidth(codeValue, k + 1, number);
        }
        return value;
    };
    OneDimension.prototype.barCodeType = function (type) {
        if (type === 'Code39' || type === 'UpcE' || type === 'Code39Extension') {
            return 'twoBars';
        }
        else if (type === 'UpcA' || type === 'Ean13' || type === 'Ean8') {
            return 'threeBars';
        }
        else {
            return 'noBars';
        }
    };
    OneDimension.prototype.checkStartValueCondition = function (j, k, numberOfDigits, barType) {
        if ((j === 1 && k === 0 && barType === 'twoBars' && this.type !== 'UpcE' ||
            (((j === 0 && k === numberOfDigits - 1) || j === 2 && k === numberOfDigits - 2)
                && (this.type === 'Ean8' || this.type === 'Ean13')))
            || (this.type === 'UpcE' && j === 2 && k === 0)
            || (barType === 'threeBars' && (j === 2 && k === numberOfDigits - 1))
            || this.type === 'UpcA' && ((j === 1 && k === numberOfDigits - 2)
                || (j === 3 && k === numberOfDigits - 2))
            || (barType === 'noBars' && j === 0 && k === 0)) {
            return true;
        }
        else {
            return false;
        }
    };
    OneDimension.prototype.checkEndValueCondition = function (k, j, numberOfDigits, code, temp, doublwidth) {
        var type = this.type;
        if ((k === numberOfDigits && j === code.length - 2 && (type === 'Code39' || type === 'Code39Extension'))
            || (type === 'Code11' && j === code.length - 1 && k === numberOfDigits - 1)
            || type === 'Code93Extension' && j === code.length - 1 && k === numberOfDigits - 1
            || ((type === 'Ean8') && (j === 1 && k === numberOfDigits
                || j === code.length - 2 && k === numberOfDigits))
            || ((this.type === 'Ean13') && ((j === 2 && k === 1) || j === code.length - 2 && k === numberOfDigits))
            || (type === 'UpcA' && (j === 3 && k === 0 || j === 5 && (!temp ? (k === 1) : ((k === (doublwidth))))))
            || (type === 'UpcE' && (j === code.length - 2 && k === 1))
            || (type === 'Code93' && j === code.length - 1 && k === numberOfDigits - 1)
            || ((type !== 'Code39' && type !== 'Code39Extension'
                && type !== 'Ean8' && type !== 'Ean13') && j === code.length - 1 && k === numberOfDigits)) {
            return true;
        }
        else {
            return false;
        }
    };
    OneDimension.prototype.getDisplayText = function (j, textProperty) {
        var text;
        if (this.type === 'Ean8') {
            text = j === 1 ? (this.value.substring(0, 4)) : (this.value.substring(4, 8));
        }
        else if (this.type === 'Ean13') {
            text = j === 2 ? (this.value.substring(1, 7)) : (this.value.substring(7));
        }
        else if (this.type === 'UpcA') {
            text = j === 3 ? ((this.value.substring(0, 6))) : (this.value.substring(6, 12));
        }
        else {
            text = textProperty.text ? textProperty.text : this.value;
        }
        return text;
    };
    OneDimension.prototype.checkExtraHeight = function (j, type, code) {
        if (((j === 0 || j === code.length - 1) && (type === 'Code39' || type === 'Code39Extension'))
            || ((type === 'Ean8' || type === 'Ean13') && (j === 0 || j === 2 || j === code.length - 1))
            || type === 'UpcA' && (j === 1 || j === code.length - 2 || j === code.length - 4)
            || type === 'UpcE' && (j === 1 || j === code.length - 2 || j === code.length - 4)) {
            return true;
        }
        else {
            return false;
        }
    };
    OneDimension.prototype.getWidthValue = function (number, width, type) {
        if (this.type !== 'Code93Extension') {
            if (number) {
                var dividerValue = type === 'Code32' ? 3 : 2;
                width = number % dividerValue ? 1 : 2;
            }
            else {
                width = 1;
            }
        }
        if (this.type === 'Code93Extension') {
            if (number && !(number % 4)) {
                width = 4;
            }
            else if (number && !(number % 2)) {
                width = 2;
            }
            else if (number && !(number % 3)) {
                width = 3;
            }
            else {
                width = 1;
            }
        }
        return width;
    };
    /* tslint:disable */
    /** @private */
    OneDimension.prototype.calculateBarCodeAttributes = function (code, canvas, isUpcE) {
        var temp = false;
        var canDoubleWidth;
        var barcodeSize = this.getDrawableSize(this.margin, this.width, this.height);
        if (barcodeSize.height > 0 && barcodeSize.width > 0) {
            var tempBaseAttributes = void 0;
            var options = [];
            var offsetX = barcodeSize.x;
            var ratio = this.getBarLineRatio(code, barcodeSize.width);
            ratio = this.isSvgMode ? ratio : ratio / 1.5;
            var startValue = 0;
            var endValue = void 0;
            var type = this.type;
            var position = this.displayText.position;
            var scaleValue = this.isSvgMode ? 1 : 1.5;
            var textOptions = void 0;
            var textSize = void 0;
            var textHeight = void 0;
            var textProperty = void 0;
            for (var j = 0; j < code.length; j++) {
                var codeValue = code[j];
                var check = (type !== 'UpcA' && type !== 'UpcE' && type !== 'Code11' && type !== 'Code93' && type !== 'Code93Extension');
                var barType = this.barCodeType(this.type);
                var extraHeight = this.checkExtraHeight(j, type, code);
                var numberOfDigits = codeValue.length;
                temp = false;
                for (var k = 0; check ? k <= numberOfDigits : k < numberOfDigits; k++) {
                    var renderText = false;
                    if (this.checkStartValueCondition(j, k, numberOfDigits, barType)) {
                        startValue = offsetX;
                    }
                    else if (this.checkEndValueCondition(k, j, numberOfDigits, code, temp, canDoubleWidth)) {
                        endValue = offsetX;
                        if (this.type === 'UpcA' && temp && canDoubleWidth) {
                            endValue -= canDoubleWidth * ratio;
                        }
                        renderText = true;
                    }
                    var canDrawCheck = (type === 'Code39' || type === 'Code93Extension' || type === 'Code32' || type === 'Code11' || type === 'Code39Extension');
                    var candraw = canDrawCheck ? (k % 2 ? false : true) : (codeValue[k] === '1' ? true : false);
                    var string = codeValue.toString();
                    var number = Number(string[k]);
                    var width = void 0;
                    width = this.getWidthValue(number, width, type);
                    width = width * ratio;
                    textProperty = this.displayText;
                    var text = this.getDisplayText(j, textProperty);
                    textOptions = this.getBaseAttributes(undefined, undefined, startValue, position === 'Bottom' ? (barcodeSize.y + barcodeSize.height) + 2 : (barcodeSize.y + textHeight) - 2, this.foreColor, isUpcE || text, textProperty.size, textProperty.visibility, textProperty.font);
                    if (!textHeight) {
                        createMeasureElements();
                        textSize = measureText(textOptions);
                        textHeight = (textSize.height / 2) + 2;
                    }
                    if (extraHeight) {
                        tempBaseAttributes = this.getBaseAttributes(width, position === 'Top' && barType !== 'noBars' ? (barcodeSize.height - textHeight - this.displayText.margin.top) : (barcodeSize.height), offsetX, position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                    }
                    if ((type === 'Ean13') && k === 0 && j === 0 && textProperty.visibility) {
                        textOptions = this.getBaseAttributes(undefined, undefined, startValue, position === 'Bottom' ? (barcodeSize.y + barcodeSize.height) + 2 : ((barcodeSize.y + textHeight + this.displayText.margin.top) - 2) - this.displayText.margin.bottom, this.foreColor, isUpcE || text, textProperty.size, textProperty.visibility, textProperty.font);
                        textOptions.string = this.value[0];
                        this.drawText(canvas, textOptions);
                    }
                    if (!extraHeight || renderText || (type === 'UpcA' && extraHeight)) {
                        var checkCode = type === 'Code39' || type === 'Code32' || type === 'Code93Extension' || type === 'Code39Extension' || type === 'Code11';
                        var value = barcodeSize.height;
                        var barCodeHeight = (((value) - textHeight * scaleValue) > 0 ? ((value) - textHeight * scaleValue) : 0);
                        if (checkCode || type === 'Ean8' || type === 'Ean13') {
                            barCodeHeight = position === 'Top' && barType !== 'noBars' ? (barCodeHeight - textHeight) : barCodeHeight;
                            var height = extraHeight ? barcodeSize.height : barCodeHeight;
                            if (this.type !== 'Code39') {
                                height = position === 'Top' && barType !== 'noBars' ? (height - this.displayText.margin.top) - textHeight : height;
                            }
                            tempBaseAttributes = this.getBaseAttributes(width, height, offsetX, position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                        }
                        if ((!checkCode || (!renderText && !checkCode)) && (!renderText || this.type !== 'UpcE')) {
                            canDoubleWidth = this.multipleWidth((codeValue), k, 1);
                            k += canDoubleWidth - 1;
                            if (canDoubleWidth > 1) {
                                temp = true;
                            }
                            var rectWidth = canDoubleWidth > 1 ? (canDoubleWidth * width) : width;
                            var rectHeight = (barcodeSize.height - textHeight * scaleValue);
                            var height = extraHeight ? barcodeSize.height : rectHeight;
                            height = position === 'Top' && barType !== 'noBars' ? (height - this.displayText.margin.top) - textHeight : height;
                            tempBaseAttributes = this.getBaseAttributes(rectWidth, height, offsetX, position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                            offsetX = canDoubleWidth > 1 ? offsetX + (canDoubleWidth * (width)) : offsetX + (1 * (width));
                        }
                        if (renderText || !extraHeight) {
                            this.verticalTextMargin(textProperty, tempBaseAttributes, textOptions);
                        }
                        if (textProperty.visibility &&
                            ((endValue && type !== 'Ean8' && type !== 'Ean13' && type !== 'UpcA' && type !== 'UpcE')
                                || ((type === 'Ean8' || type === 'UpcA' || type === 'UpcE' || type === 'Ean13') && renderText))) {
                            if (!textProperty.margin.left && !textProperty.margin.right && (textProperty.text || type === 'UpcA')) {
                                this.updateOverlappedTextPosition((endValue - startValue), textOptions, textSize, startValue, textProperty, endValue);
                            }
                            else {
                                this.getAlignmentPosition(textOptions, endValue, startValue, textSize);
                            }
                            this.alignDisplayText(textOptions, textProperty, startValue, endValue, textSize);
                            this.drawText(canvas, textOptions);
                        }
                    }
                    if (candraw) {
                        options.push(tempBaseAttributes);
                    }
                    if (this.canIncrementCheck(type, j, code)) {
                        offsetX += (width);
                    }
                }
            }
            this.drawImage(canvas, options);
        }
    };
    /* tslint:enable */
    OneDimension.prototype.canIncrementCheck = function (type, j, code) {
        if ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension' || type === 'Code93Extension'
            || type === 'Code11') || (type === 'UpcE' && (j === 1 || j === code.length - 2)) ||
            ((type === 'Ean8' || type === 'Ean13') && (j === 0 || j === code.length - 1 || j === 2))) {
            return true;
        }
        else {
            return false;
        }
    };
    OneDimension.prototype.verticalTextMargin = function (textProperty, tempBaseAttributes, textOptions) {
        if (textProperty.margin.top && tempBaseAttributes.height - textProperty.margin.top > 0) {
            if (textProperty.margin.top > 0 && textProperty.position === 'Bottom') {
                tempBaseAttributes.height -= textProperty.margin.top;
            }
            else {
                textOptions.y += textProperty.margin.top;
            }
        }
        if (textProperty.margin.bottom && tempBaseAttributes.height - textProperty.margin.bottom > 0) {
            if (textProperty.margin.bottom > 0) {
                textOptions.y -= textProperty.margin.bottom;
                if (this.displayText.position === 'Bottom') {
                    tempBaseAttributes.height -= textProperty.margin.bottom;
                }
            }
            else {
                textOptions.y -= textProperty.margin.bottom;
            }
        }
    };
    OneDimension.prototype.getAlignmentPosition = function (textOptions, endValue, startValue, textSize) {
        if (this.displayText.alignment === 'Center') {
            textOptions.x += (((endValue - startValue)) / 2) - textSize.width * .5;
        }
        else if (this.displayText.alignment === 'Left') {
            textOptions.x = startValue;
        }
        else {
            textOptions.x = endValue - textSize.width;
        }
    };
    /** @private */
    OneDimension.prototype.drawImage = function (canvas, options) {
        var barcodeRenderer = this.getInstance(canvas.id);
        for (var i = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas, options[i]);
        }
    };
    OneDimension.prototype.updateDisplayTextSize = function (options, size, endValue, startValue, textProperty) {
        if (options.x + size.width > endValue || (options.x < startValue) && options.stringSize > 2) {
            var rightAlign = options.x < startValue && textProperty.margin.right ? true : false;
            if (options.x < startValue && textProperty.margin.right) {
                // if the displaytext rendering overlaps the barcode then need to reduce the displaytext size gradually by 2
                options.stringSize -= 2;
                var newSize = measureText(options);
                // used to get the middle value for the text as well the total barcode size
                options.x += (((endValue - startValue)) / 2) - newSize.width * .5;
                var diff = void 0;
                diff = textProperty.margin.right - (endValue - (options.x + size.width));
                options.x -= diff;
                this.updateDisplayTextSize(options, newSize, endValue, startValue, textProperty);
            }
        }
    };
    OneDimension.prototype.alignDisplayText = function (options, textProperty, startValue, endValue, size) {
        var leftMargin = false;
        // have to adjust the displaytext position during the rendering of default displaytext size
        if ((textProperty.margin.left || textProperty.margin.right)) {
            if (options.x - startValue < textProperty.margin.left && textProperty.margin.left) {
                leftMargin = true;
                var diff = textProperty.margin.left - (options.x - startValue);
                options.x += diff;
                this.updateDisplayTextSize(options, size, endValue, startValue, textProperty);
            }
            if ((endValue - (options.x + size.width) < textProperty.margin.right) && textProperty.margin.right && !leftMargin) {
                var diff = textProperty.margin.right - (endValue - (options.x + size.width));
                options.x -= diff;
                this.updateDisplayTextSize(options, size, endValue, startValue, textProperty);
            }
            else if ((endValue - (options.x + size.width) < textProperty.margin.right)) {
                var newSize = measureText(options);
                this.updateOverlappedTextPosition((endValue - startValue), options, newSize, startValue, textProperty, endValue);
                this.updateDisplayTextSize(options, newSize, endValue, startValue, textProperty);
            }
        }
    };
    
    OneDimension.prototype.updateOverlappedTextPosition = function (width, options, size, startValue, textProperty, endValue) {
        if ((size.width > width || textProperty) && (endValue - (options.x + size.width) <= textProperty.margin.right)
            && options.stringSize > 2) {
            options.stringSize -= !textProperty ? 2 : .2;
            var newSize = measureText(options);
            this.updateOverlappedTextPosition(width, options, newSize, startValue, textProperty, endValue);
        }
        else if (!textProperty.margin.left && !textProperty.margin.right && options.stringSize > 2) {
            this.getAlignmentPosition(options, endValue, startValue, size);
        }
    };
    OneDimension.prototype.drawText = function (canvas, options) {
        if (!this.isSvgMode) {
            options.y /= 1.5;
        }
        var barcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas, options);
    };
    return OneDimension;
}(BarcodeBase));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code128 used to calculate the barcode of type 128
 */
var Code128 = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Code128, _super);
    function Code128() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code128.prototype.validateInput = function (char) {
        //if (char.search('/[a-zA-Z0-9]*/') === -1) {
        if (char.search(/^[0-9A-Za-z\-\.\ \@\$\/\+\%\!\@\#\$\%\&\*\^\(\)\_\+\=\<\>\?\{\}\[\]\~\-\Ê]+$/) === -1) {
            return 'Supports only 128 characters of ASCII.';
        }
        else {
            return undefined;
        }
    };
    Code128.prototype.getCodeValue = function () {
        var codes = [11011001100, 11001101100, 11001100110, 10010011000, 10010001100,
            10001001100, 10011001000, 10011000100, 10001100100, 11001001000,
            11001000100, 11000100100, 10110011100, 10011011100, 10011001110,
            10111001100, 10011101100, 10011100110, 11001110010, 11001011100,
            11001001110, 11011100100, 11001110100, 11101101110, 11101001100,
            11100101100, 11100100110, 11101100100, 11100110100, 11100110010,
            11011011000, 11011000110, 11000110110, 10100011000, 10001011000,
            10001000110, 10110001000, 10001101000, 10001100010, 11010001000,
            11000101000, 11000100010, 10110111000, 10110001110, 10001101110,
            10111011000, 10111000110, 10001110110, 11101110110, 11010001110,
            11000101110, 11011101000, 11011100010, 11011101110, 11101011000,
            11101000110, 11100010110, 11101101000, 11101100010, 11100011010,
            11101111010, 11001000010, 11110001010, 10100110000, 10100001100,
            10010110000, 10010000110, 10000101100, 10000100110, 10110010000,
            10110000100, 10011010000, 10011000010, 10000110100, 10000110010,
            11000010010, 11001010000, 11110111010, 11000010100, 10001111010,
            10100111100, 10010111100, 10010011110, 10111100100, 10011110100,
            10011110010, 11110100100, 11110010100, 11110010010, 11011011110,
            11011110110, 11110110110, 10101111000, 10100011110, 10001011110,
            10111101000, 10111100010, 11110101000, 11110100010, 10111011110,
            10111101110, 11101011110, 11110101110, 11010000100, 11010010000,
            11010011100, 1100011101011];
        return codes;
    };
    Code128.prototype.getBytes = function (givenWord) {
        var bytes = [];
        for (var i = 0; i < givenWord.length; i++) {
            bytes.push(givenWord[i].charCodeAt(0));
        }
        return bytes;
    };
    Code128.prototype.appendStartStopCharacters = function (char) {
        var startChararcter;
        if (this.type === 'Code128A') {
            startChararcter = String.fromCharCode(208);
        }
        else if (this.type === 'Code128B') {
            startChararcter = String.fromCharCode(209);
        }
        else if (this.type === 'Code128C') {
            startChararcter = String.fromCharCode(210);
        }
        return startChararcter + char;
    };
    Code128.prototype.check128C = function (value) {
        return value.match(new RegExp('^' + '(\xCF*[0-9]{2}\xCF*)' + '*'))[0];
    };
    Code128.prototype.check128A = function (value) {
        return value.match(new RegExp('^' + '[\x00-\x5F\xC8-\xCF]' + '*'))[0];
    };
    Code128.prototype.check128B = function (value) {
        return value.match(new RegExp('^' + '[\x20-\x7F\xC8-\xCF]' + '*'))[0];
    };
    Code128.prototype.clipAB = function (value, code128A) {
        var ranges = code128A ? '[\x00-\x5F\xC8-\xCF]' : '[\x20-\x7F\xC8-\xCF]';
        var untilC = value.match(new RegExp('^(' + ranges + '+?)(([0-9]{2}){2,})([^0-9]|$)'));
        if (untilC) {
            return untilC[1] + String.fromCharCode(204) + this.clipC(value.substring(untilC[1].length));
        }
        var chars = value.match(new RegExp('^' + ranges + '+'))[0];
        if (chars.length === value.length) {
            return value;
        }
        return value;
    };
    Code128.prototype.code128Clip = function () {
        var newString;
        var check128C = this.check128C(this.value).length;
        if (check128C >= 2) {
            return newString = String.fromCharCode(210) + this.clipC(this.value);
        }
        else {
            var code128A = this.check128A(this.value) > this.check128B(this.value);
            return newString = (code128A ? String.fromCharCode(208) : String.fromCharCode(209)) + this.clipAB(this.value, code128A);
        }
    };
    Code128.prototype.clipC = function (string) {
        var cMatch = this.check128C(string);
        var length = cMatch.length;
        if (length === string.length) {
            return string;
        }
        string = string.substring(length);
        var code128A = this.check128A(string) >= this.check128B(string);
        return cMatch + String.fromCharCode(code128A ? 206 : 205) + this.clipAB(string, code128A);
    };
    /** @private */
    Code128.prototype.draw = function (canvas) {
        this.code128(canvas);
    };
    /** @private */
    Code128.prototype.code128 = function (canvas) {
        var givenCharacter = this.value;
        givenCharacter = this.type !== 'Code128' ? this.appendStartStopCharacters(givenCharacter) : this.code128Clip();
        var bytes;
        bytes = this.getBytes(givenCharacter);
        var startCharacterValue = bytes.shift() - 105;
        var set;
        if (startCharacterValue === 103) {
            set = '0';
        }
        else if (startCharacterValue === 104) {
            set = '1';
        }
        else {
            set = '2';
        }
        var encodingResult = this.encodeData(bytes, 1, set);
        var encodedData = this.encode(startCharacterValue, encodingResult);
        var code = [];
        code.push(encodedData);
        this.calculateBarCodeAttributes(code, canvas);
    };
    Code128.prototype.encodeData = function (byteValue, textPosition, set) {
        if (!byteValue.length) {
            return { result: '', checksum: 0 };
        }
        var nextCode;
        var index;
        if (byteValue[0] >= 200) {
            index = byteValue.shift() - 105;
            var nextSet = this.swap(index);
            if (nextSet !== undefined) {
                nextCode = this.encodeData(byteValue, textPosition + 1, nextSet);
            }
        }
        else {
            index = this.correctIndex(byteValue, set);
            nextCode = this.encodeData(byteValue, textPosition + 1, set);
        }
        var encodingValues = this.getCodes(index);
        var weight = index * textPosition;
        return {
            result: encodingValues + nextCode.result,
            checksum: weight + nextCode.checksum
        };
    };
    Code128.prototype.swap = function (index) {
        if (index === 99) {
            return '2';
        }
        else if (index === 100) {
            return '1';
        }
        else {
            return '0';
        }
    };
    Code128.prototype.encode = function (startIndex, encodingResult) {
        var moduloValue = 103;
        var stopvalue = 106;
        var encodeValue = this.getCodes(startIndex) + encodingResult.result;
        if (this.enableCheckSum) {
            encodeValue += this.getCodes((encodingResult.checksum + startIndex) % moduloValue);
        }
        encodeValue += this.getCodes(stopvalue);
        return encodeValue;
    };
    // Correct an index by a set and shift it from the bytes array
    Code128.prototype.correctIndex = function (bytes, set) {
        if (set === '0') {
            var charCode = bytes.shift();
            return charCode < 32 ? charCode + 64 : charCode - 32;
        }
        else if (set === '1') {
            return bytes.shift() - 32;
        }
        else {
            return (bytes.shift() - 48) * 10 + bytes.shift() - 48;
        }
    };
    // Get a bar symbol by index
    Code128.prototype.getCodes = function (index) {
        var codes = this.getCodeValue();
        return codes[index] ? codes[index].toString() : '';
    };
    return Code128;
}(OneDimension));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code128B used to calculate the barcode of type 128
 */
var Code128B = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Code128B, _super);
    function Code128B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code128B.prototype.validateInput = function (char) {
        if ((new RegExp("^" + '[\x20-\x7F\xC8-\xCF]' + "+$")).test(char)) {
            return undefined;
        }
        else {
            return 'Supports only ASCII characters 32 to 127 (0–9, A–Z, a–z), and special characters.';
        }
    };
    /** @private */
    Code128B.prototype.draw = function (canvas) {
        this.code128(canvas);
    };
    return Code128B;
}(Code128));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code128C used to calculate the barcode of type 128C barcode
 */
var Code128C = /** @__PURE__ @class */ (function (_super) {
    __extends$4(Code128C, _super);
    function Code128C() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code128C.prototype.validateInput = function (char) {
        if ((new RegExp("^" + '(\xCF*[0-9]{2}\xCF*)' + "+$")).test(char)) {
            return undefined;
        }
        else {
            return 'Supports even number of numeric characters (00-99).';
        }
    };
    /** @private */
    Code128C.prototype.draw = function (canvas) {
        this.code128(canvas);
    };
    return Code128C;
}(Code128));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines the space to be left between an object and its immediate parent
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends$6(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(10)
    ], Margin.prototype, "left", void 0);
    __decorate$2([
        Property(10)
    ], Margin.prototype, "right", void 0);
    __decorate$2([
        Property(10)
    ], Margin.prototype, "top", void 0);
    __decorate$2([
        Property(10)
    ], Margin.prototype, "bottom", void 0);
    return Margin;
}(ChildProperty));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines the space to be left between an object and its immediate parent
 */
var DisplayText = /** @__PURE__ @class */ (function (_super) {
    __extends$5(DisplayText, _super);
    function DisplayText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], DisplayText.prototype, "text", void 0);
    __decorate$1([
        Property(true)
    ], DisplayText.prototype, "visibility", void 0);
    __decorate$1([
        Property('monospace')
    ], DisplayText.prototype, "font", void 0);
    __decorate$1([
        Property(20)
    ], DisplayText.prototype, "size", void 0);
    __decorate$1([
        Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    ], DisplayText.prototype, "margin", void 0);
    __decorate$1([
        Property('Center')
    ], DisplayText.prototype, "alignment", void 0);
    __decorate$1([
        Property('Bottom')
    ], DisplayText.prototype, "position", void 0);
    return DisplayText;
}(ChildProperty));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code39 = /** @__PURE__ @class */ (function (_super) {
    __extends$7(Code39, _super);
    function Code39() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * get the code value to check
     */
    Code39.prototype.getCodeValue = function () {
        var codes = ['111221211', '211211112', '112211112',
            '212211111', '111221112', '211221111', '112221111', '111211212',
            '211211211', '112211211', '211112112', '112112112', '212112111', '111122112', '211122111', '112122111',
            '111112212', '211112211', '112112211', '111122211', '211111122', '112111122', '212111121', '111121122',
            '211121121', '112121121', '111111222', '211111221', '112111221', '111121221', '221111112', '122111112',
            '222111111', '121121112', '221121111', '122121111', '121111212', '221111211', '122111211', '121121211',
            '121212111', '121211121', '121112121', '111212121'];
        return codes;
    };
    /**
     * get the characters to check
     */
    Code39.prototype.getCharacter = function () {
        var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%';
        return characters;
    };
    /**
     * Check sum method for the code 39 bar code
     */
    Code39.prototype.checkSum = function (char, characters) {
        var checksum = 0;
        for (var i = 0; i < char.length; i++) {
            var codeNumber = characters.indexOf(char[i]);
            checksum += codeNumber;
        }
        checksum = checksum % 43;
        return checksum;
    };
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code39.prototype.validateInput = function (char) {
        if (char.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) === -1) {
            return 'Supports A-Z, 0-9, and symbols ( - . $ / + % SPACE).';
        }
        else {
            return undefined;
        }
    };
    Code39.prototype.getPatternCollection = function (givenChar, characters) {
        var codeNumber;
        var code = [];
        var codes = this.getCodeValue();
        for (var i = 0; i < givenChar.length; i++) {
            codeNumber = characters.indexOf(givenChar.charAt(i));
            code.push(codes[codeNumber]);
        }
        return code;
    };
    Code39.prototype.appendStartStopCharacters = function (char) {
        return '*' + char + '*';
    };
    /** @private */
    Code39.prototype.drawCode39Extension = function (canvas, encodedCharacter) {
        this.draw(canvas, encodedCharacter);
    };
    /** @private */
    Code39.prototype.draw = function (canvas, encodedCharacter) {
        var givenCharacter = encodedCharacter ? encodedCharacter : this.value;
        var characters = this.getCharacter();
        if (this.enableCheckSum) {
            var checkSum = this.checkSum(givenCharacter, characters);
            givenCharacter += checkSum;
        }
        givenCharacter = this.appendStartStopCharacters(givenCharacter);
        var code = this.getPatternCollection(givenCharacter, characters);
        this.calculateBarCodeAttributes(code, canvas);
    };
    return Code39;
}(OneDimension));

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * codabar used to calculate the barcode of type codabar
 */
var CodaBar = /** @__PURE__ @class */ (function (_super) {
    __extends$8(CodaBar, _super);
    function CodaBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @private */
    CodaBar.prototype.validateInput = function (char) {
        if (char.search(/^[0-9A-D\-\.\$\/\+\%\:]+$/) === -1) {
            return 'Supports 0-9, A-D and symbols (-,$, /, ., +).';
        }
        else {
            return undefined;
        }
    };
    CodaBar.prototype.getCodeValue = function () {
        var codes = {
            '0': '101010011',
            '1': '101011001',
            '2': '101001011',
            '3': '110010101',
            '4': '101101001',
            '5': '110101001',
            '6': '100101011',
            '7': '100101101',
            '8': '100110101',
            '9': '110100101',
            '-': '101001101',
            '$': '101100101',
            ':': '1101011011',
            '/': '1101101011',
            '.': '1101101101',
            '+': '101100110011',
            'A': '1011001001',
            'B': '1001001011',
            'C': '1010010011',
            'D': '1010011001'
        };
        return codes;
    };
    CodaBar.prototype.appendStartStopCharacters = function (char) {
        return 'A' + char + 'A';
    };
    CodaBar.prototype.getPatternCollection = function (givenCharacter, codes) {
        var code = [];
        for (var i = 0; i < givenCharacter.length; i++) {
            var char = givenCharacter[i];
            code.push(codes[char]);
        }
        return code;
    };
    /** @private */
    CodaBar.prototype.draw = function (canvas) {
        var codes = this.getCodeValue();
        var givenCharacter = this.value;
        givenCharacter = this.appendStartStopCharacters(givenCharacter);
        var code = this.getPatternCollection(givenCharacter, codes);
        this.calculateBarCodeAttributes(code, canvas);
    };
    return CodaBar;
}(OneDimension));

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code128A used to calculate the barcode of type 1228A
 */
var Code128A = /** @__PURE__ @class */ (function (_super) {
    __extends$9(Code128A, _super);
    function Code128A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code128A.prototype.validateInput = function (char) {
        if ((new RegExp("^" + '[\x00-\x5F\xC8-\xCF]' + "+$")).test(char)) {
            return undefined;
        }
        else {
            return 'Supports only ASCII characters 00 to 95 (0–9, A–Z and control codes) and special characters.';
        }
    };
    /** @private */
    Code128A.prototype.draw = function (canvas) {
        this.code128(canvas);
    };
    return Code128A;
}(Code128));

var __extends$10 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * EAN8 class is  used to calculate the barcode of type EAN8 barcode
 */
var Ean8 = /** @__PURE__ @class */ (function (_super) {
    __extends$10(Ean8, _super);
    function Ean8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Ean8.prototype.validateInput = function (value) {
        if (value.search(/^[0-9]{8}$/) !== -1 && Number(value[7]) === this.checkSumData(value)) {
            return undefined;
        }
        else {
            return 'Accepts 8 numeric characters.';
        }
    };
    Ean8.prototype.getCodeValueRight = function (right) {
        var codes;
        if (right) {
            codes = {
                '0': '0001101',
                '1': '0011001',
                '2': '0010011',
                '3': '0111101',
                '4': '0100011',
                '5': '0110001',
                '6': '0101111',
                '7': '0111011',
                '8': '0110111',
                '9': '0001011',
            };
        }
        else {
            codes = {
                '0': '1110010',
                '1': '1100110',
                '2': '1101100',
                '3': '1000010',
                '4': '1011100',
                '5': '1001110',
                '6': '1010000',
                '7': '1000100',
                '8': '1001000',
                '9': '1110100'
            };
        }
        return codes;
    };
    Ean8.prototype.checkSumData = function (value) {
        for (var i = 0; i < value.length; i++) {
            var sum1 = Number(value[1]) + Number(value[3]) + Number(value[5]);
            var sum2 = 3 * (Number(value[0]) + Number(value[2]) + Number(value[4]) + Number(value[6]));
            var checkSumValue = sum1 + sum2;
            var checkSumDigit = 10 - (checkSumValue % 10);
            return checkSumDigit === 0 ? checkSumDigit = 0 : checkSumDigit;
        }
        return 0;
    };
    /** @private */
    Ean8.prototype.draw = function (canvas) {
        var endBars = '101';
        var middleBar = '01010';
        var codes = this.getCodeValueRight(true);
        var code = [];
        code.push(endBars);
        code.push(this.leftValue(codes, true));
        code.push(middleBar);
        codes = this.getCodeValueRight(false);
        code.push(this.leftValue(codes, false));
        code.push(endBars);
        this.calculateBarCodeAttributes(code, canvas);
    };
    Ean8.prototype.leftValue = function (codes, isLeft) {
        var code;
        for (var i = isLeft ? 0 : this.value.length - 4; i < (isLeft ? this.value.length - 4 : this.value.length); i++) {
            if (i === 0 || i === 4) {
                code = codes[this.value[i]];
            }
            else {
                code += codes[this.value[i]];
            }
        }
        return code;
    };
    return Ean8;
}(OneDimension));

var __extends$11 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * EAN13 class is  used to calculate the barcode of type EAN13 barcode
 */
var Ean13 = /** @__PURE__ @class */ (function (_super) {
    __extends$11(Ean13, _super);
    function Ean13() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Ean13.prototype.validateInput = function (value) {
        if (value.search(/^[0-9]{13}$/) !== -1 && Number(value[12]) === this.checkSumData(value)) {
            return undefined;
        }
        else if (value.search(/^[0-9]{12}$/) !== -1) {
            value += this.checkSumData(value);
            this.value = value;
            return undefined;
        }
        else {
            return 'Accepts 12 numeric characters.';
        }
    };
    Ean13.prototype.checkSumData = function (value) {
        var sum1 = 3 * (Number(value[11]) + Number(value[9]) + Number(value[7])
            + Number(value[5]) + Number(value[3]) + Number(value[1]));
        var sum2 = (Number(value[10]) + Number(value[8]) + Number(value[6])
            + Number(value[4])) + Number(value[2]) + Number(value[0]);
        var checkSumValue = (sum1 + sum2);
        var roundOffValue = Math.round(checkSumValue / 10) * 10;
        return roundOffValue - checkSumValue;
    };
    Ean13.prototype.getStructure = function () {
        return {
            '0': 'LLLLLL',
            '1': 'LLGLGG',
            '2': 'LLGGLG',
            '3': 'LLGGGL',
            '4': 'LGLLGG',
            '5': 'LGGLLG',
            '6': 'LGGGLL',
            '7': 'LGLGLG',
            '8': 'LGLGGL',
            '9': 'LGGLGL'
        };
    };
    Ean13.prototype.getBinaries = function () {
        return {
            'L': [
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ], 'G': [
                '0100111', '0110011', '0011011', '0100001', '0011101',
                '0111001', '0000101', '0010001', '0001001', '0010111'
            ],
            'R': [
                '1110010', '1100110', '1101100', '1000010', '1011100',
                '1001110', '1010000', '1000100', '1001000', '1110100'
            ],
            'O': [
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ],
            'E': [
                '0100111', '0110011', '0011011', '0100001', '0011101',
                '0111001', '0000101', '0010001', '0001001', '0010111'
            ]
        };
    };
    /** @private */
    Ean13.prototype.draw = function (canvas) {
        var endBars = '101';
        var middleBar = '01010';
        var code = [];
        var structureValue = this.getStructure();
        var structure = structureValue[this.value[0]];
        code.push(endBars);
        var leftString = this.value.substr(1, 6);
        code.push(this.leftValue(true, structure, leftString));
        code.push(middleBar);
        leftString = this.value.substr(7, 6);
        code.push(this.leftValue(false, 'RRRRRR', leftString));
        code.push(endBars);
        this.calculateBarCodeAttributes(code, canvas);
    };
    Ean13.prototype.leftValue = function (isLeft, structure, leftString) {
        var code;
        var tempCodes;
        var codes;
        codes = this.getBinaries();
        for (var i = 0; i < leftString.length; i++) {
            tempCodes = codes[structure[i]];
            if (i === 0) {
                code = tempCodes[leftString[i]];
            }
            else {
                code += tempCodes[leftString[i]];
            }
        }
        return code;
    };
    return Ean13;
}(OneDimension));

var __extends$12 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * This class is  used to calculate the barcode of type Universal Product Code barcode
 */
var UpcE = /** @__PURE__ @class */ (function (_super) {
    __extends$12(UpcE, _super);
    function UpcE() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    UpcE.prototype.validateInput = function (value) {
        if (value.search(/^[0-9]{6}$/) !== -1) {
            return undefined;
        }
        else {
            return 'Accepts 6 numeric characters.';
        }
    };
    UpcE.prototype.checkSum = function (value) {
        var result = 0;
        var i;
        for (i = 1; i < 11; i += 2) {
            result += parseInt(value[i], undefined);
        }
        for (i = 0; i < 11; i += 2) {
            result += parseInt(value[i], undefined) * 3;
        }
        return (10 - (result % 10)) % 10;
    };
    UpcE.prototype.getStructure = function () {
        return {
            '0': 'EEEOOO',
            '1': 'EEOEOO',
            '2': 'EEOOEO',
            '3': 'EEOOOE',
            '4': 'EOEEOO',
            '5': 'EOOEEO',
            '6': 'EOOOEE',
            '7': 'EOEOEO',
            '8': 'EOEOOE',
            '9': 'EOOEOE'
        };
    };
    UpcE.prototype.getValue = function () {
        return ['XX00000XXX',
            'XX10000XXX',
            'XX20000XXX',
            'XXX00000XX',
            'XXXX00000X',
            'XXXXX00005',
            'XXXXX00006',
            'XXXXX00007',
            'XXXXX00008',
            'XXXXX00009'];
    };
    UpcE.prototype.getExpansion = function (lastDigit) {
        var value = this.getValue();
        return value[lastDigit];
    };
    UpcE.prototype.getUpcValue = function () {
        var lastDigit = this.value[this.value.length - 1];
        var expansionValue = this.getExpansion(lastDigit);
        var result = '';
        var index = 0;
        for (var i = 0; i < expansionValue.length; i++) {
            var value = expansionValue[i];
            if (value === 'X') {
                result += this.value[index++];
            }
            else {
                result += value;
            }
        }
        result = '' + '0' + result;
        var encodingValue = '' + result;
        if (this.enableCheckSum) {
            encodingValue += this.checkSum(result);
        }
        return encodingValue;
    };
    UpcE.prototype.getBinaries = function () {
        return {
            'O': [
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ],
            'E': [
                '0100111', '0110011', '0011011', '0100001', '0011101',
                '0111001', '0000101', '0010001', '0001001', '0010111'
            ]
        };
    };
    UpcE.prototype.encoding = function (upcAValue, string, structure) {
        var code;
        var tempValue;
        var codes;
        codes = this.getBinaries();
        for (var i = 0; i < string.length; i++) {
            tempValue = codes[structure[i]];
            if (i === 0) {
                code = tempValue[string[i]];
            }
            else {
                code += tempValue[string[i]];
            }
        }
        return code;
    };
    /** @private */
    UpcE.prototype.draw = function (canvas) {
        var endBars = '101';
        var middleBar = '010101';
        var endDigits = '00000000';
        var code = [];
        var upcAValue = this.getUpcValue();
        var structureValue = this.getStructure();
        var structure = structureValue[upcAValue[upcAValue.length - 1]];
        code.push(endDigits);
        code.push(endBars);
        code.push(this.encoding(upcAValue, this.value, structure));
        code.push(middleBar);
        code.push(endDigits);
        var renderText = upcAValue[0] + this.value + upcAValue[upcAValue.length - 1];
        this.calculateBarCodeAttributes(code, canvas, this.displayText.text === '' ? renderText : undefined);
    };
    return UpcE;
}(OneDimension));

var __extends$13 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * This class is  used to calculate the barcode of type Universal Product Code barcode
 */
var UpcA = /** @__PURE__ @class */ (function (_super) {
    __extends$13(UpcA, _super);
    function UpcA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    UpcA.prototype.validateInput = function (value) {
        if (value.search(/^[0-9]{11}$/) !== -1 && this.enableCheckSum) {
            this.value += this.checkSumData(this.value);
        }
        if (this.value.search(/^[0-9]{12}$/) !== -1 && (Number(this.value[11]) === this.checkSumData(this.value))) {
            return undefined;
        }
        else {
            return 'Accepts 11 numeric characters.';
        }
    };
    UpcA.prototype.checkSumData = function (value) {
        var sum1 = 3 * (Number(value[0]) + Number(value[2]) + Number(value[4])
            + Number(value[6]) + Number(value[8]) + Number(value[10]));
        var sum2 = (Number(value[9]) + Number(value[7]) + Number(value[5]) + Number(value[3]) + Number(value[1]));
        var checkSumValue = (sum1 + sum2);
        return (10 - checkSumValue % 10) % 10;
    };
    UpcA.prototype.getBinaries = function () {
        return {
            'L': [
                '0001101', '0011001', '0010011', '0111101', '0100011',
                '0110001', '0101111', '0111011', '0110111', '0001011'
            ],
            'R': [
                '1110010', '1100110', '1101100', '1000010', '1011100',
                '1001110', '1010000', '1000100', '1001000', '1110100'
            ]
        };
    };
    /** @private */
    UpcA.prototype.draw = function (canvas) {
        var givenCharacter = this.value;
        var endDigits = '00000000';
        var middleBar = '01010';
        var code = [];
        code.push(endDigits);
        code.push('101' + this.leftValue(true, 'L', this.value[0]));
        code.push(this.leftValue(true, 'LLLLL', this.value.substr(1, 5)));
        code.push(middleBar);
        code.push(this.leftValue(true, 'RRRRR', this.value.substr(6, 5)));
        code.push(this.leftValue(true, 'R', this.value[11]) + '101');
        code.push(endDigits);
        this.calculateBarCodeAttributes(code, canvas);
    };
    UpcA.prototype.leftValue = function (isLeft, structure, leftString) {
        var code;
        var tempValue;
        var codes;
        codes = this.getBinaries();
        for (var i = 0; i < leftString.length; i++) {
            tempValue = codes[structure[i]];
            if (i === 0) {
                code = tempValue[leftString[i]];
            }
            else {
                code += tempValue[leftString[i]];
            }
        }
        return code;
    };
    return UpcA;
}(OneDimension));

var __extends$14 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code11 = /** @__PURE__ @class */ (function (_super) {
    __extends$14(Code11, _super);
    function Code11() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code11.prototype.validateInput = function (value) {
        if (value.search(/^[0-9\-\*]+$/) === -1) {
            return 'This bar code support 0-9 , * , -';
        }
        else {
            return undefined;
        }
    };
    /**
     * get the code value to check
     */
    Code11.prototype.getCodeValue = function () {
        var codes = {
            '0': '111121',
            '1': '211121',
            '2': '121121',
            '3': '221111',
            '4': '112121',
            '5': '212111',
            '6': '122111',
            '7': '111221',
            '8': '211211',
            '9': '211111',
            '-': '112111',
            '*': '112211'
        };
        return codes;
    };
    Code11.prototype.getPatternCollection = function (givenChar) {
        var code = [];
        var codes = this.getCodeValue();
        for (var i = 0; i < givenChar.length; i++) {
            code.push(codes[givenChar[i]]);
        }
        return code;
    };
    /** @private */
    Code11.prototype.draw = function (canvas) {
        var codes = [];
        var givenChar = '*' + this.value + '*';
        codes = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    };
    return Code11;
}(OneDimension));

var __extends$15 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code93 = /** @__PURE__ @class */ (function (_super) {
    __extends$15(Code93, _super);
    function Code93() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code93.prototype.validateInput = function (value) {
        if (value.search(/^[0-9A-Z\-\.\*\$\/\+\ %\ ]+$/) === -1) {
            return 'Supports A-Z, 0-9, and symbols ( - . $ / + % SPACE).';
        }
        else {
            return undefined;
        }
    };
    Code93.prototype.getCharacterWeight = function () {
        var codes = {
            '0': '0',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
            'A': '10',
            'B': '11',
            'C': '12',
            'D': '13',
            'E': '14',
            'F': '15',
            'G': '16',
            'H': '17',
            'I': '18',
            'J': '19',
            'K': '20',
            'L': '21',
            'M': '22',
            'N': '23',
            'O': '24',
            'P': '25',
            'Q': '26',
            'R': '27',
            'S': '28',
            'T': '29',
            'U': '30',
            'V': '31',
            'W': '32',
            'X': '33',
            'Y': '34',
            'Z': '35',
            '-': '36',
            '.': '37',
            ' ': '38',
            '$': '39',
            '/': '40',
            '+': '41',
            '%': '42',
            '($)': '43',
            '(/)': '44',
            '(+)': '45',
            '(%)': '46',
        };
        return codes;
    };
    /**
     * get the code value to check
     */
    Code93.prototype.getCodeValue = function () {
        var codes = {
            '0': '100010100',
            '1': '101001000',
            '2': '101000100',
            '3': '101000010',
            '4': '100101000',
            '5': '100100100',
            '6': '100100010',
            '7': '101010000',
            '8': '100010010',
            '9': '100001010',
            'A': '110101000',
            'B': '110100100',
            'C': '110100010',
            'D': '110010100',
            'E': '110010010',
            'F': '110001010',
            'G': '101101000',
            'H': '101100100',
            'I': '101100010',
            'J': '100110100',
            'K': '100011010',
            'L': '101011000',
            'M': '101001100',
            'N': '101000110',
            'O': '100101100',
            'P': '100010110',
            'Q': '110110100',
            'R': '110110010',
            'S': '110101100',
            'T': '110100110',
            'U': '110010110',
            'V': '110011010',
            'W': '101101100',
            'X': '101100110',
            'Y': '100110110',
            'Z': '100111010',
            '-': '100101110',
            '.': '111010100',
            ' ': '111010010',
            '$': '111001010',
            '/': '101101110',
            '+': '101110110',
            '%': '110101110',
            '($)': '100100110',
            '(/)': '111010110',
            '(+)': '100110010',
            '(%)': '111011010',
        };
        return codes;
    };
    Code93.prototype.getPatternCollection = function (givenCharacter, codes, encodingValue) {
        var code = encodingValue;
        for (var i = 0; i < givenCharacter.length; i++) {
            var char = givenCharacter[i];
            code.push(codes[char]);
        }
    };
    Code93.prototype.calculateCheckSum = function (givenCharacter) {
        var value = givenCharacter;
        var weightSum = 0;
        var j = 0;
        var moduloValue;
        var appendSymbol;
        var codes = this.getCharacterWeight();
        for (var i = value.length; i > 0; i--) {
            var characterValue = codes[value[j]] * i;
            weightSum += characterValue;
            j++;
        }
        moduloValue = weightSum % 47;
        var objectValue = Object.keys(codes);
        appendSymbol = objectValue[moduloValue];
        return appendSymbol;
    };
    /** @private */
    Code93.prototype.draw = function (canvas) {
        var codes = this.getCodeValue();
        var encodingValue = [];
        var givenCharacter = this.value;
        var startStopCharacter = '101011110';
        var terminationBar = '1';
        if (this.enableCheckSum) {
            givenCharacter += this.calculateCheckSum(givenCharacter);
            givenCharacter += this.calculateCheckSum(givenCharacter);
        }
        encodingValue.push(startStopCharacter);
        this.getPatternCollection(givenCharacter, codes, encodingValue);
        encodingValue.push(startStopCharacter);
        encodingValue.push(terminationBar);
        this.calculateBarCodeAttributes(encodingValue, canvas);
    };
    return Code93;
}(OneDimension));

var __extends$16 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code93Extension = /** @__PURE__ @class */ (function (_super) {
    __extends$16(Code93Extension, _super);
    function Code93Extension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.barcodeSymbols = [];
        return _this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code93Extension.prototype.validateInput = function (text) {
        var valueCheck = this.getValue(text);
        if (valueCheck) {
            return undefined;
        }
        else {
            return 'Supports 128 characters of ASCII.';
        }
    };
    Code93Extension.prototype.getValue = function (text) {
        for (var i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) > 127) {
                return false;
            }
        }
        return true;
    };
    Code93Extension.prototype.getBars = function () {
        this.barcodeSymbols[0] = { value: '', checkDigit: 0, bars: '111213' };
        this.barcodeSymbols[1] = { value: '1', checkDigit: 1, bars: '111213' };
        this.barcodeSymbols[2] = { value: '2', checkDigit: 2, bars: '111312 ' };
        this.barcodeSymbols[3] = { value: '3', checkDigit: 3, bars: '111411 ' };
        this.barcodeSymbols[4] = { value: '4', checkDigit: 4, bars: '121113' };
        this.barcodeSymbols[5] = { value: '5', checkDigit: 5, bars: '121212' };
        this.barcodeSymbols[6] = { value: '6', checkDigit: 6, bars: '121311' };
        this.barcodeSymbols[7] = { value: '7', checkDigit: 7, bars: '111114' };
        this.barcodeSymbols[8] = { value: '8', checkDigit: 8, bars: '131211' };
        this.barcodeSymbols[9] = { value: '9', checkDigit: 9, bars: '141111' };
        this.barcodeSymbols[10] = { value: 'A', checkDigit: 10, bars: '211113' };
        this.barcodeSymbols[11] = { value: 'B', checkDigit: 11, bars: '211212' };
        this.barcodeSymbols[12] = { value: 'C', checkDigit: 12, bars: '211311' };
        this.barcodeSymbols[13] = { value: 'D', checkDigit: 13, bars: '221112' };
        this.barcodeSymbols[14] = { value: 'E', checkDigit: 14, bars: '221211 ' };
        this.barcodeSymbols[15] = { value: 'F', checkDigit: 15, bars: '231111' };
        this.barcodeSymbols[16] = { value: 'G', checkDigit: 16, bars: '112113' };
        this.barcodeSymbols[17] = { value: 'H', checkDigit: 17, bars: '112212' };
        this.barcodeSymbols[18] = { value: 'I', checkDigit: 18, bars: '112311' };
        this.barcodeSymbols[19] = { value: 'J', checkDigit: 19, bars: '122112' };
        this.barcodeSymbols[20] = { value: 'K', checkDigit: 20, bars: '132111 ' };
        this.barcodeSymbols[21] = { value: 'L', checkDigit: 21, bars: '111123' };
        this.barcodeSymbols[22] = { value: 'M', checkDigit: 22, bars: '111222' };
        this.barcodeSymbols[23] = { value: 'N', checkDigit: 23, bars: '111321' };
        this.barcodeSymbols[24] = { value: 'O', checkDigit: 24, bars: '121122 ' };
        this.barcodeSymbols[25] = { value: 'P', checkDigit: 25, bars: '131121 ' };
        this.barcodeSymbols[26] = { value: 'Q', checkDigit: 26, bars: '212112 ' };
        this.barcodeSymbols[27] = { value: 'R', checkDigit: 27, bars: ' 212211 ' };
        this.barcodeSymbols[28] = { value: 'S', checkDigit: 28, bars: '211122' };
        this.barcodeSymbols[29] = { value: 'T', checkDigit: 29, bars: '211221' };
        this.barcodeSymbols[30] = { value: 'U', checkDigit: 30, bars: '221121' };
        this.barcodeSymbols[31] = { value: 'V', checkDigit: 31, bars: '222111' };
        this.barcodeSymbols[32] = { value: 'W', checkDigit: 32, bars: '112122' };
        this.barcodeSymbols[33] = { value: 'X', checkDigit: 33, bars: '112221' };
        this.barcodeSymbols[34] = { value: 'Y', checkDigit: 34, bars: '122121' };
        this.barcodeSymbols[35] = { value: 'Z', checkDigit: 35, bars: ' 123111' };
        this.barcodeSymbols[36] = { value: '-', checkDigit: 36, bars: '121131' };
        this.barcodeSymbols[37] = { value: '.', checkDigit: 37, bars: '311112' };
        this.barcodeSymbols[38] = { value: ' ', checkDigit: 38, bars: '311211' };
        this.barcodeSymbols[39] = { value: '$', checkDigit: 39, bars: '321111' };
        this.barcodeSymbols[40] = { value: '/', checkDigit: 40, bars: '112131' };
        this.barcodeSymbols[41] = { value: '+', checkDigit: 41, bars: '113121' };
        this.barcodeSymbols[42] = { value: '%', checkDigit: 42, bars: '211131' };
        this.barcodeSymbols[43] = { value: '*', checkDigit: 42, bars: '111141' };
        this.barcodeSymbols[44] = { value: 'ÿ', checkDigit: 47, bars: '1111411' };
        this.barcodeSymbols[45] = { value: 'û', checkDigit: 43, bars: '121220' };
        this.barcodeSymbols[46] = { value: 'ü', checkDigit: 44, bars: '312111 ' };
        this.barcodeSymbols[47] = { value: 'ý', checkDigit: 45, bars: '311121' };
        this.barcodeSymbols[48] = { value: 'þ', checkDigit: 46, bars: '122211' };
    };
    Code93Extension.prototype.GetExtendedText = function (string) {
        var code = this.value;
        var extcodes;
        this.extendedText = '';
        for (var i = 0; i < code.length; i++) {
            for (var j = string.length - 1; j > 0; j--) {
                if (string[j] && string[j].value && string[j].character === code[i]) {
                    extcodes = string[j];
                    break;
                }
            }
            if (extcodes.keyword && extcodes.value) {
                this.extendedText += extcodes.keyword + extcodes.value;
            }
            else if (extcodes.value && extcodes.value) {
                this.extendedText += extcodes.value;
            }
        }
    };
    /** @private */
    Code93Extension.prototype.drawCode93 = function (canvas) {
        this.getBars();
        var temp = [];
        var string = this.getArrayValue();
        this.GetExtendedText(string);
        var checkDigit = this.CalculateCheckDigit();
        for (var i = 0; i < checkDigit.length; i++) {
            this.extendedText += checkDigit[i];
        }
        temp[0] = '*' + this.extendedText + 'ÿ';
        var encodingValue = [];
        encodingValue = this.encoding(temp);
        this.calculateBarCodeAttributes(encodingValue, canvas);
    };
    Code93Extension.prototype.GetCheckSumSymbols = function () {
        var text = this.extendedText;
        var dataToEncode = text;
        var charArray = [];
        var checkValue = 0;
        var length = dataToEncode.length;
        var numi;
        for (var i = 0; i < length; i++) {
            var num4 = (length - i) % 20;
            if (num4 === 0) {
                num4 = 20;
            }
            for (var j = 0; j < this.barcodeSymbols.length; j++) {
                if (dataToEncode[i] === this.barcodeSymbols[j].value) {
                    numi = this.barcodeSymbols[j].checkDigit;
                }
            }
            checkValue += numi * num4;
        }
        checkValue = checkValue % 0x2f;
        var char1 = '';
        for (var k = 0; k < this.barcodeSymbols.length; k++) {
            if (checkValue === this.barcodeSymbols[k].checkDigit) {
                char1 = this.barcodeSymbols[k].value;
                break;
            }
        }
        var data = this.extendedText;
        data = data + char1;
        charArray[0] = char1;
        text = data;
        checkValue = 0;
        dataToEncode = text;
        length = dataToEncode.length;
        for (var i = 0; i < length; i++) {
            var num4 = (length - i) % 15;
            if (num4 === 0) {
                num4 = 15;
            }
            for (var m = 0; m < this.barcodeSymbols.length; m++) {
                if (dataToEncode[i] === this.barcodeSymbols[m].value) {
                    var tempi = this.barcodeSymbols[m].checkDigit;
                    checkValue += tempi * num4;
                }
            }
        }
        checkValue = checkValue % 0x2f;
        text = text + checkValue;
        var char2 = ' ';
        for (var i = 0; i < this.barcodeSymbols.length; i++) {
            if (checkValue === this.barcodeSymbols[i].checkDigit) {
                char2 = this.barcodeSymbols[i].value;
                break;
            }
        }
        data = data + char2;
        charArray[1] = char2;
        return charArray;
    };
    Code93Extension.prototype.CalculateCheckDigit = function () {
        var code = this.extendedText;
        var checkValue = 0;
        for (var i = 0; i < code.length; i++) {
            for (var j = 0; j < this.barcodeSymbols.length; j++) {
                if (code[i] === this.barcodeSymbols[j].value) {
                    checkValue += this.barcodeSymbols[j].checkDigit;
                }
            }
        }
        var ch = this.GetCheckSumSymbols();
        return ch;
    };
    /* tslint:disable */
    Code93Extension.prototype.getArrayValue = function () {
        var arrayValue = [];
        arrayValue[0] = { character: '\0', keyword: 'ü', value: 'U' };
        arrayValue[1] = { character: '\x0001', keyword: 'û', value: 'A' };
        arrayValue[2] = { character: '\x0002', keyword: 'x00fb', value: 'B' };
        arrayValue[3] = { character: '\x0003', keyword: 'û', value: 'C' };
        arrayValue[4] = { character: '\x0004', keyword: 'û', value: 'D' };
        arrayValue[5] = { character: '\x0005', keyword: 'û', value: 'E' };
        arrayValue[6] = { character: '\x0006', keyword: 'û', value: 'F' };
        arrayValue[7] = { character: '\a', keyword: 'û', value: 'G' };
        arrayValue[8] = { character: '\b', keyword: 'û', value: 'H' };
        arrayValue[9] = { character: '\t', keyword: 'û', value: 'I' };
        arrayValue[10] = { character: '\n', keyword: 'û', value: 'J' };
        arrayValue[12] = { character: '\v', keyword: 'û', value: 'K' };
        arrayValue[13] = { character: '\f', keyword: 'û', value: 'L' };
        arrayValue[14] = { character: '\r', keyword: 'û', value: 'M' };
        arrayValue[15] = { character: '\x000e', keyword: 'û', value: 'N' };
        arrayValue[16] = { character: '\x000f', keyword: 'û', value: 'O' };
        arrayValue[17] = { character: '\x0010', keyword: 'û', value: 'P' };
        arrayValue[18] = { character: '\x0011', keyword: 'û', value: 'Q' };
        arrayValue[19] = { character: '\x0012', keyword: 'û', value: 'R' };
        arrayValue[20] = { character: '\x0013', keyword: 'û', value: 'S' };
        arrayValue[21] = { character: '\x0014', keyword: 'û', value: 'T' };
        arrayValue[22] = { character: '\x0015', keyword: 'û', value: 'U' };
        arrayValue[23] = { character: '\x0016', keyword: 'û', value: 'V' };
        arrayValue[24] = { character: '\x0017', keyword: 'û', value: 'W' };
        arrayValue[25] = { character: '\x0018', keyword: 'û', value: 'X' };
        arrayValue[26] = { character: '\x0019', keyword: 'û', value: 'Y' };
        arrayValue[27] = { character: '\x001a', keyword: 'û', value: 'Z' };
        arrayValue[28] = { character: '\x001b', keyword: 'ü', value: 'A' };
        arrayValue[29] = { character: '\x001c', keyword: 'ü', value: 'B' };
        arrayValue[30] = { character: '\x001d', keyword: 'ü', value: 'C' };
        arrayValue[31] = { character: '\x001e', keyword: 'ü', value: 'D' };
        arrayValue[32] = { character: '\x001f', keyword: 'ü', value: 'E' };
        arrayValue[33] = { character: ' ', keyword: ' ' };
        arrayValue[34] = { character: '!', keyword: 'ý', value: 'A' };
        arrayValue[35] = { character: '"', keyword: 'ý', value: 'B' };
        arrayValue[36] = { character: '#', keyword: 'ý', value: 'C' };
        arrayValue[37] = { character: '$', keyword: 'ý', value: 'D' };
        arrayValue[38] = { character: '%', keyword: 'ý', value: 'E' };
        arrayValue[39] = { character: '&', keyword: 'ý', value: 'F' };
        arrayValue[40] = { character: '\'', keyword: 'ý', value: 'G' };
        arrayValue[41] = { character: '(', keyword: 'ý', value: 'H' };
        arrayValue[42] = { character: ')', keyword: 'ý', value: 'I' };
        arrayValue[43] = { character: '*', keyword: 'ý', value: 'J' };
        arrayValue[44] = { character: '+', keyword: 'ý', value: 'K' };
        arrayValue[45] = { character: ',', keyword: 'ý', value: 'L' };
        arrayValue[46] = { character: '-', keyword: 'ý', value: 'M' };
        arrayValue[47] = { character: '.', keyword: 'ý', value: 'N' };
        arrayValue[48] = { character: '/', keyword: 'ý', value: 'O' };
        arrayValue[49] = { character: '0', value: '0' };
        arrayValue[50] = { character: '1', value: '1' };
        arrayValue[51] = { character: '2', value: '2' };
        arrayValue[52] = { character: '3', value: '3' };
        arrayValue[53] = { character: '4', value: '4' };
        arrayValue[54] = { character: '5', value: '5' };
        arrayValue[55] = { character: '6', value: '6' };
        arrayValue[56] = { character: '7', value: '7' };
        arrayValue[57] = { character: '8', value: '8' };
        arrayValue[58] = { character: '9', value: '9' };
        arrayValue[59] = { character: ':', keyword: 'ý', value: 'Z' };
        arrayValue[60] = { character: ';', keyword: 'ü', value: 'F' };
        arrayValue[61] = { character: '<', keyword: 'ü', value: 'G' };
        arrayValue[62] = { character: '=', keyword: 'ü', value: 'H' };
        arrayValue[63] = { character: '>', keyword: 'ü', value: 'I' };
        arrayValue[64] = { character: '?', keyword: 'ü', value: 'J' };
        arrayValue[65] = { character: '@', keyword: 'ü', value: 'V' };
        arrayValue[66] = { character: 'A', value: 'A' };
        arrayValue[67] = { character: 'B', value: 'B' };
        arrayValue[68] = { character: 'C', value: 'C' };
        arrayValue[69] = { character: 'D', value: 'D' };
        arrayValue[70] = { character: 'E', value: 'E' };
        arrayValue[71] = { character: 'F', value: 'F' };
        arrayValue[72] = { character: 'G', value: 'G' };
        arrayValue[73] = { character: 'H', value: 'H' };
        arrayValue[74] = { character: 'I', value: 'I' };
        arrayValue[75] = { character: 'J', value: 'J' };
        arrayValue[76] = { character: 'K', value: 'K' };
        arrayValue[77] = { character: 'L', value: 'L' };
        arrayValue[78] = { character: 'M', value: 'M' };
        arrayValue[79] = { character: 'N', value: 'N' };
        arrayValue[80] = { character: 'O', value: 'O' };
        arrayValue[81] = { character: 'P', value: 'P' };
        arrayValue[82] = { character: 'Q', value: 'Q' };
        arrayValue[83] = { character: 'R', value: 'R' };
        arrayValue[84] = { character: 'S', value: 'S' };
        arrayValue[85] = { character: 'T', value: 'T' };
        arrayValue[86] = { character: 'U', value: 'U' };
        arrayValue[87] = { character: 'V', value: 'V' };
        arrayValue[88] = { character: 'W', value: 'W' };
        arrayValue[88] = { character: 'X', value: 'X' };
        arrayValue[89] = { character: 'Y', value: 'Y' };
        arrayValue[90] = { character: 'Z', value: 'Z' };
        arrayValue[91] = { character: '[', keyword: 'ü', value: 'K' };
        arrayValue[92] = { character: '\\', keyword: 'ü', value: 'L' };
        arrayValue[93] = { character: ']', keyword: 'ü', value: 'M' };
        arrayValue[94] = { character: '^', keyword: 'ü', value: 'N' };
        arrayValue[95] = { character: '_', keyword: 'ü', value: 'O' };
        arrayValue[96] = { character: '`', keyword: 'ü', value: 'W' };
        arrayValue[97] = { character: 'a', keyword: 'þ', value: 'A' };
        arrayValue[98] = { character: 'b', keyword: 'þ', value: 'B' };
        arrayValue[99] = { character: 'c', keyword: 'þ', value: 'C' };
        arrayValue[100] = { character: 'd', keyword: 'þ', value: 'D' };
        arrayValue[101] = { character: 'e', keyword: 'þ', value: 'E' };
        arrayValue[102] = { character: 'f', keyword: 'þ', value: 'F' };
        arrayValue[103] = { character: 'g', keyword: 'þ', value: 'G' };
        arrayValue[104] = { character: 'h', keyword: 'þ', value: 'H' };
        arrayValue[105] = { character: 'i', keyword: 'þ', value: 'I' };
        arrayValue[106] = { character: 'j', keyword: 'þ', value: 'J' };
        arrayValue[107] = { character: 'k', keyword: 'þ', value: 'K' };
        arrayValue[108] = { character: 'l', keyword: 'þ', value: 'L' };
        arrayValue[109] = { character: 'm', keyword: 'þ', value: 'M' };
        arrayValue[110] = { character: 'n', keyword: 'þ', value: 'N' };
        arrayValue[111] = { character: 'o', keyword: 'þ', value: 'O' };
        arrayValue[112] = { character: 'p', keyword: 'þ', value: 'P' };
        arrayValue[113] = { character: 'q', keyword: 'þ', value: 'Q' };
        arrayValue[114] = { character: 'r', keyword: 'þ', value: 'R' };
        arrayValue[115] = { character: 's', keyword: 'þ', value: 'S' };
        arrayValue[116] = { character: 't', keyword: 'þ', value: 'T' };
        arrayValue[117] = { character: 'u', keyword: 'þ', value: 'U' };
        arrayValue[118] = { character: 'v', keyword: 'þ', value: 'V' };
        arrayValue[119] = { character: 'w', keyword: 'þ', value: 'W' };
        arrayValue[120] = { character: 'x', keyword: 'þ', value: 'X' };
        arrayValue[121] = { character: 'y', keyword: 'þ', value: 'Y' };
        arrayValue[122] = { character: 'z', keyword: 'þ', value: 'Z' };
        arrayValue[123] = { character: '{', keyword: 'ü', value: 'P' };
        arrayValue[124] = { character: '|', keyword: 'ü', value: 'Q' };
        arrayValue[125] = { character: '}', keyword: 'ü', value: 'R' };
        arrayValue[126] = { character: '~', keyword: 'ü', value: 'S' };
        return arrayValue;
    };
    /* tslint:enable */
    Code93Extension.prototype.encoding = function (string) {
        var temp = [];
        for (var j = 0; j < string.length; j++) {
            for (var k = 0; k < string[j].length; k++) {
                for (var i = 0; i < this.barcodeSymbols.length; i++) {
                    if (string[j][k] === this.barcodeSymbols[i].value) {
                        temp[k] = this.barcodeSymbols[i].bars;
                    }
                }
            }
        }
        return temp;
    };
    return Code93Extension;
}(Code93));

var __extends$17 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code32 = /** @__PURE__ @class */ (function (_super) {
    __extends$17(Code32, _super);
    function Code32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @private */
    Code32.prototype.validateInput = function (char) {
        if (char.length === 8 && char.match(/^[0-9]+$/)) {
            return undefined;
        }
        else {
            return 'Accepts 9 numeric characters.';
        }
    };
    /**
     * get the code value to check
     */
    Code32.prototype.getCodeValue = function () {
        var symbolTable = [['0', 0, ['111331311']], ['1', 1, ['311311113']], ['2', 2, ['113311113']], ['3', 3, ['313311111']],
            ['4', 4, ['111331113']], ['5', 5, ['311331111']], ['6', 6, ['113331111']], ['7', 7, ['111311313']], ['8', 8, ['311311311']],
            ['9', 9, ['113311311']], ['A', 10, ['113113113']], ['B', 11, ['113113113']], ['C', 12, ['313113111']], ['D', 13, ['111133113']],
            ['E', 14, ['221211']], ['F', 15, ['113133111']], ['G', 0x10, ['111113313']], ['H', 0x11, ['311113311']], ['I', 0x12, ['112311']],
            ['J', 0x13, ['111133311']], ['K', 20, ['311111133']], ['L', 0x15, ['113111133']], ['M', 0x16, ['313111131']],
            ['N', 0x17, ['111131133']],
            ['O', 0x18, ['121122']], ['P', 0x19, ['113131131']], ['Q', 0x1a, ['111111333']], ['R', 0x1b, ['311111331']],
            ['S', 0x1c, ['113111331']],
            ['T', 0x1d, ['111131331']], ['U', 30, ['331111113']], ['V', 0x1f, ['133111113']], ['W', 0x20, ['333111111']],
            ['X', 0x21, ['131131113']], ['Y', 0x22, ['331131111']], ['Z', 0x23, ['133131111']], ['*', 0, ['131131311']]
        ];
        return symbolTable;
    };
    Code32.prototype.getPatternCollection = function (givenChar) {
        var code = [];
        var codes = this.getCodeValue();
        for (var i = 0; i <= givenChar.length; i++) {
            for (var j = 0; j < codes.length; j++) {
                if (givenChar[i] === codes[j][0]) {
                    code.push(codes[j][2][0]);
                }
            }
        }
        return code;
    };
    /** @private */
    Code32.prototype.draw = function (canvas) {
        var value = this.value;
        var givenChar = '*' + value + '*';
        var codes;
        codes = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    };
    return Code32;
}(OneDimension));

var __extends$18 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * code39 used to calculate the barcode of type 39
 */
var Code39Extension = /** @__PURE__ @class */ (function (_super) {
    __extends$18(Code39Extension, _super);
    function Code39Extension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Code39Extension.prototype.code39ExtensionValues = function () {
        var codes = {
            '0': '%U', '1': '$A', '2': '$B', '3': '$C', '4': '$D',
            '5': '$E', '6': '$F', '7': '$G', '8': '$H', '9': '$I',
            '10': '$J', '11': '$K', '12': '$L', '13': '$M', '14': '$N',
            '15': '$O', '16': '$P', '17': '$Q', '18': '$R', '19': '$S',
            '20': '$T', '21': '$U', '22': '$V', '23': '$W', '24': '$X',
            '25': '$Y', '26': '$Z', '27': '%A', '28': '%B', '29': '%C',
            '30': '%D', '31': '%E', '32': ' ', '33': '/A', '34': '/B',
            '35': '/C', '36': '/D', '37': '/E', '38': '/F', '39': '/G',
            '40': '/H', '41': '/I', '42': '/J', '43': '/K', '44': '/L',
            '45': '-', '46': '.', '47': '/O', '48': '0', '49': '1',
            '50': '2', '51': '3', '52': '4', '53': '5', '54': '6', '55': '7',
            '56': '8',
            '57': '9',
            '58': '/Z',
            '59': '%F',
            '60': '%G',
            '61': '%H',
            '62': '%I',
            '63': '%J',
            '64': '%V',
            '65': 'A',
            '66': 'B',
            '67': 'C',
            '68': 'D',
            '69': 'E',
            '70': 'F',
            '71': 'G',
            '72': 'H',
            '73': 'I',
            '74': 'J',
            '75': 'K',
            '76': 'L',
            '77': 'M',
            '78': 'N',
            '79': 'O',
            '80': 'P',
            '81': 'Q',
            '82': 'R',
            '83': 'S',
            '84': 'T',
            '85': 'U',
            '86': 'V',
            '87': 'W',
            '88': 'X',
            '89': 'Y',
            '90': 'Z',
            '91': '%K',
            '92': '%L',
            '93': '%M',
            '94': '%N',
            '95': '%O',
            '96': '%W',
            '97': '+A',
            '98': '+B',
            '99': '+C',
            '100': '+D',
            '101': '+E',
            '102': '+F',
            '103': '+G',
            '104': '+H',
            '105': '+I',
            '106': '+J',
            '107': '+K',
            '108': '+L',
            '109': '+M',
            '110': '+N',
            '111': '+O',
            '112': '+P',
            '113': '+Q',
            '114': '+R',
            '115': '+S',
            '116': '+T',
            '117': '+U',
            '118': '+V',
            '119': '+W',
            '120': '+X',
            '121': '+Y',
            '122': '+Z',
            '123': '%P',
            '124': '%Q',
            '125': '	%R',
            '126': '%S',
            '127': '%T',
        };
        return codes;
    };
    /**
     * Validate the given input to check whether the input is valid one or not
     *
     */
    /** @private */
    Code39Extension.prototype.validateInput = function (char) {
        var asciiCheck = this.checkText(char);
        if (asciiCheck) {
            return undefined;
        }
        else {
            return 'Supports 128 characters of ASCII.';
        }
    };
    Code39Extension.prototype.checkText = function (char) {
        for (var i = 0; i < char.length; i++) {
            if (char.charCodeAt(i) > 127) {
                return false;
            }
        }
        return true;
    };
    Code39Extension.prototype.code39Extension = function (givenCharacter) {
        var encodedString = '';
        var code = this.code39ExtensionValues();
        var asciivalue;
        for (var i = 0; i < givenCharacter.length; i++) {
            asciivalue = givenCharacter[i].charCodeAt(0);
            encodedString += code[asciivalue];
        }
        return encodedString;
    };
    /** @private */
    Code39Extension.prototype.drawCode39 = function (canvas) {
        var givenCharacter = this.value;
        var encodedCharacter = this.code39Extension(givenCharacter);
        this.drawCode39Extension(canvas, encodedCharacter);
    };
    return Code39Extension;
}(Code39));

/**
 * Barcode util
 */
/** @private */
function removeChildElements(newProp, barcodeCanvas, mode, id) {
    var barCodeSVG = barcodeCanvas;
    if (mode === 'SVG' && !newProp.mode) {
        barCodeSVG.innerHTML = '';
    }
    else if (newProp.mode) {
        barCodeSVG.parentNode.removeChild(barCodeSVG);
    }
    return new BarcodeRenderer(id, mode === 'SVG');
}
/** @private */
function getBaseAttributes(width, height, offSetX, offsetY, color, strokeColor) {
    var options = {
        width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
    };
    return options;
}
/** @private */
function clearCanvas(view, barcodeCanvas) {
    var width;
    var height;
    width = view.element.offsetWidth * 1.5;
    height = view.element.offsetHeight * 1.5;
    var ctx = BarcodeCanvasRenderer.getContext(barcodeCanvas);
    ctx.clearRect(0, 0, width, height);
}
/** @private */
function refreshCanvasBarcode(qrCodeGenerator, barcodeCanvas) {
    clearCanvas(qrCodeGenerator, barcodeCanvas);
}

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Barcode control
 * ```html
 * <div id='barcode'/>
 * ```
 * ```typescript
 * let barcode: Barcode = new Barcode({
 * width:'1000px', height:'500px' });
 * barcode.appendTo('#barcode');
 * ```
 */
var BarcodeGenerator = /** @__PURE__ @class */ (function (_super) {
    __extends(BarcodeGenerator, _super);
    /**
     * Constructor for creating the widget
     */
    function BarcodeGenerator(options, element) {
        return _super.call(this, options, element) || this;
    }
    BarcodeGenerator.prototype.triggerEvent = function (eventName, message) {
        var arg = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    };
    BarcodeGenerator.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            this.refreshCanvasBarcode();
        }
        else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            this.barcodeCanvas.setAttribute('width', String(newProp.width));
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.element.style.width = this.getElementSize(this.width);
                    this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                    break;
                case 'height':
                    this.element.style.height = this.getElementSize(this.height);
                    this.barcodeCanvas.setAttribute('height', String(this.element.offsetHeight));
                    break;
                case 'backgroundColor':
                    this.barcodeCanvas.setAttribute('style', 'background:' + newProp.backgroundColor);
                    break;
                case 'mode':
                    this.initialize();
            }
        }
        this.renderElements();
    };
    BarcodeGenerator.prototype.initialize = function () {
        //Initialize the height of the  barcode generator
        this.element.style.height = this.getElementSize(this.height);
        //Initialize the width of the  barcode generator
        this.element.style.width = this.getElementSize(this.width);
        var svgMode = this.mode;
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement({ id: this.element.id, height: svgMode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5,
            width: svgMode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5 }, this.backgroundColor, this.element.offsetWidth, this.element.offsetHeight);
        this.element.appendChild(this.barcodeCanvas);
    };
    BarcodeGenerator.prototype.renderElements = function () {
        var barCode;
        switch (this.type) {
            case 'Code39Extension':
                barCode = new Code39Extension;
                break;
            case 'Code39':
                barCode = new Code39();
                break;
            case 'Codabar':
                barCode = new CodaBar();
                break;
            case 'Code128A':
                barCode = new Code128A();
                break;
            case 'Code128B':
                barCode = new Code128B();
                break;
            case 'Code128C':
                barCode = new Code128C();
                break;
            case 'Code128':
                barCode = new Code128();
                break;
            case 'Ean8':
                barCode = new Ean8();
                break;
            case 'Ean13':
                barCode = new Ean13();
                break;
            case 'UpcA':
                barCode = new UpcA();
                break;
            case 'UpcE':
                barCode = new UpcE();
                break;
            case 'Code11':
                barCode = new Code11();
                break;
            case 'Code93':
                barCode = new Code93();
                break;
            case 'Code93Extension':
                barCode = new Code93Extension();
                break;
            case 'Code32':
                barCode = new Code32();
                break;
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
            this.barcodeCanvas.getContext('2d').scale(1.5, 1.5);
        }
        barCode.width = this.barcodeCanvas.getAttribute('width');
        if ((this.type === 'Ean8' || this.type === 'Ean13' || this.type === 'UpcA') && this.displayText.text.length > 0) {
            this.triggerEvent(BarcodeEvent.invalid, 'Invalid Display Text');
        }
        barCode.value = this.value;
        barCode.margin = this.margin;
        barCode.type = this.type;
        barCode.height = this.barcodeCanvas.getAttribute('height');
        barCode.foreColor = this.foreColor;
        barCode.isSvgMode = this.mode === 'SVG' ? true : false;
        barCode.displayText = this.displayText;
        barCode.enableCheckSum = this.enableCheckSum;
        var validateMessage = barCode.validateInput(this.value);
        if (validateMessage === undefined) {
            if (this.type === 'Code39Extension') {
                barCode.drawCode39(this.barcodeCanvas);
            }
            else if (this.type === 'Code93Extension') {
                barCode.drawCode93(this.barcodeCanvas);
            }
            else {
                barCode.draw(this.barcodeCanvas);
            }
        }
        else {
            this.triggerEvent(BarcodeEvent.invalid, validateMessage);
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    };
    BarcodeGenerator.prototype.refreshCanvasBarcode = function () {
        this.clearCanvas(this);
    };
    BarcodeGenerator.prototype.clearCanvas = function (view) {
        var width;
        var height;
        width = view.element.offsetWidth;
        height = view.element.offsetHeight;
        if (view.mode !== 'SVG') {
            var ctx = BarcodeCanvasRenderer.getContext(this.barcodeCanvas);
            ctx.clearRect(0, 0, width, height);
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    BarcodeGenerator.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * @private
     * @param real
     */
    BarcodeGenerator.prototype.getElementSize = function (real, rulerSize) {
        var value;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        }
        else {
            value = real.toString() + 'px';
        }
        return value;
    };
    BarcodeGenerator.prototype.preRender = function () {
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        this.initializePrivateVariables();
        this.setCulture();
        var measureElement = document.getElementsByClassName('barcodeMeasureElement');
        if (measureElement.length > 0) {
            for (var i = measureElement.length - 1; i >= 0; i--) {
                measureElement[i].parentNode.removeChild(measureElement[i]);
            }
            var element = 'barcodeMeasureElement';
            window[element] = null;
        }
        this.element.classList.add('e-barcode');
    };
    BarcodeGenerator.prototype.initializePrivateVariables = function () {
        this.defaultLocale = {};
    };
    /**
     * Method to set culture for chart
     */
    BarcodeGenerator.prototype.setCulture = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    /**
     * Renders the barcode control with nodes and connectors
     */
    BarcodeGenerator.prototype.render = function () {
        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
        this.renderComplete();
    };
    /**
     * Returns the module name of the barcode
     */
    BarcodeGenerator.prototype.getModuleName = function () {
        return 'barcode';
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    BarcodeGenerator.prototype.requiredModules = function () {
        var modules = [];
        return modules;
    };
    /**
     * Destroys the barcode control
     */
    BarcodeGenerator.prototype.destroy = function () {
        this.notify('destroy', {});
        _super.prototype.destroy.call(this);
    };
    __decorate([
        Property('100%')
    ], BarcodeGenerator.prototype, "width", void 0);
    __decorate([
        Property('100px')
    ], BarcodeGenerator.prototype, "height", void 0);
    __decorate([
        Property('SVG')
    ], BarcodeGenerator.prototype, "mode", void 0);
    __decorate([
        Property('Code128')
    ], BarcodeGenerator.prototype, "type", void 0);
    __decorate([
        Property(undefined)
    ], BarcodeGenerator.prototype, "value", void 0);
    __decorate([
        Property(true)
    ], BarcodeGenerator.prototype, "enableCheckSum", void 0);
    __decorate([
        Complex({}, DisplayText)
    ], BarcodeGenerator.prototype, "displayText", void 0);
    __decorate([
        Complex({}, Margin)
    ], BarcodeGenerator.prototype, "margin", void 0);
    __decorate([
        Property('white')
    ], BarcodeGenerator.prototype, "backgroundColor", void 0);
    __decorate([
        Property('black')
    ], BarcodeGenerator.prototype, "foreColor", void 0);
    __decorate([
        Event()
    ], BarcodeGenerator.prototype, "invalid", void 0);
    return BarcodeGenerator;
}(Component));

var __extends$19 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines and processes coordinates
 */
var Point = /** @__PURE__ @class */ (function (_super) {
    __extends$19(Point, _super);
    function Point() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property(0)
    ], Point.prototype, "x", void 0);
    __decorate$3([
        Property(0)
    ], Point.prototype, "y", void 0);
    return Point;
}(ChildProperty));

/**
 * svg renderer
 */
/** @private */
var BarcodeSVGRenderer = /** @__PURE__ @class */ (function () {
    function BarcodeSVGRenderer() {
    }
    /**   @private  */
    BarcodeSVGRenderer.prototype.renderRootElement = function (attribute) {
        var canvasObj = createHtmlElement('canvase', attribute);
        return canvasObj;
    };
    /**   @private  */
    BarcodeSVGRenderer.prototype.renderRect = function (canvas, attribute) {
        var canvasObj = createHtmlElement('canvase', attribute);
        return canvasObj;
    };
    /**   @private  */
    BarcodeSVGRenderer.prototype.renderLine = function (canvas, attribute) {
        var canvasObj = createHtmlElement('canvase', attribute);
        return canvasObj;
    };
    /**   @private  */
    BarcodeSVGRenderer.prototype.renderText = function (canvas, attribute) {
        var canvasObj = createHtmlElement('canvase', attribute);
        return canvasObj;
    };
    return BarcodeSVGRenderer;
}());

/**
 * Barcode component exported items
 */

/**
 * Qrcode used to calculate the Qrcode control
 */
var PdfQRBarcodeValues = /** @__PURE__ @class */ (function () {
    /**
     * Initializes the values
     * @param version - version of the qr code
     * @param errorCorrectionLevel - defines the level of error correction.
     */
    function PdfQRBarcodeValues(version, errorCorrectionLevel) {
        /**
         * Holds all the values of Error correcting code words.
         */
        this.numberOfErrorCorrectingCodeWords = [
            7, 10, 13, 17,
            10, 16, 22, 28,
            15, 26, 36, 44,
            20, 36, 52, 64,
            26, 48, 72, 88,
            36, 64, 96, 112,
            40, 72, 108, 130,
            48, 88, 132, 156,
            60, 110, 160, 192,
            72, 130, 192, 224,
            80, 150, 224, 264,
            96, 176, 260, 308,
            104, 198, 288, 352,
            120, 216, 320, 384,
            132, 240, 360, 432,
            144, 280, 408, 480,
            168, 308, 448, 532,
            180, 338, 504, 588,
            196, 364, 546, 650,
            224, 416, 600, 700,
            224, 442, 644, 750,
            252, 476, 690, 816,
            270, 504, 750, 900,
            300, 560, 810, 960,
            312, 588, 870, 1050,
            336, 644, 952, 1110,
            360, 700, 1020, 1200,
            390, 728, 1050, 1260,
            420, 784, 1140, 1350,
            450, 812, 1200, 1440,
            480, 868, 1290, 1530,
            510, 924, 1350, 1620,
            540, 980, 1440, 1710,
            570, 1036, 1530, 1800,
            570, 1064, 1590, 1890,
            600, 1120, 1680, 1980,
            630, 1204, 1770, 2100,
            660, 1260, 1860, 2220,
            720, 1316, 1950, 2310,
            750, 1372, 2040, 2430
        ];
        /**
         * Hexadecimal values of CP437 characters
         */
        this.cp437CharSet = ['2591', '2592', '2593', '2502', '2524', '2561', '2562', '2556', '2555', '2563', '2551', '2557',
            '255D', '255C', '255B', '2510', '2514', '2534', '252C', '251C', '2500', '253C', '255E', '255F', '255A', '2554', '2569', '2566',
            '2560', '2550', '256C', '2567', '2568', '2564', '2565', '2559', '2558', '2552', '2553', '256B', '256A', '2518', '250C', '2588',
            '2584', '258C', '2590', '2580', '25A0'];
        /**
         * Hexadecimal values of ISO8859_2 characters
         */
        this.iso88592CharSet = ['104', '2D8', '141', '13D', '15A', '160', '15E', '164', '179', '17D', '17B', '105', '2DB',
            '142', '13E', '15B', '2C7', '161', '15F', '165', '17A', '2DD', '17E', '17C', '154', '102', '139', '106', '10C', '118', '11A',
            '10E', '110', '143', '147', '150', '158', '16E', '170', '162', '155', '103', '13A', '107', '10D', '119', '11B', '10F', '111',
            '144', '148', '151', '159', '16F', '171', '163', '2D9'];
        /**
         * Hexadecimal values of ISO8859_3 characters
         */
        this.iso88593CharSet = ['126', '124', '130', '15E', '11E', '134', '17B', '127', '125', '131', '15F', '11F', '135',
            '17C', '10A', '108', '120', '11C', '16C', '15C', '10B', '109', '121', '11D', '16D', '15D'];
        /**
         * Hexadecimal values of ISO8859_4 characters
         */
        this.iso88594CharSet = ['104', '138', '156', '128', '13B', '160', '112', '122', '166', '17D', '105', '2DB', '157',
            '129', '13C', '2C7', '161', '113', '123', '167', '14A', '17E', '14B', '100', '12E', '10C', '118', '116', '12A', '110', '145',
            '14C', '136', '172', '168', '16A', '101', '12F', '10D', '119', '117', '12B', '111', '146', '14D', '137', '173', '169', '16B'];
        /**
         * Hexadecimal values of Windows1250 characters
         */
        this.windows1250CharSet = ['141', '104', '15E', '17B', '142', '105', '15F', '13D', '13E', '17C'];
        /**
         * Hexadecimal values of Windows1251 characters
         */
        this.windows1251CharSet = ['402', '403', '453', '409', '40A', '40C', '40B', '40F', '452', '459', '45A', '45C', '45B',
            '45F', '40E', '45E', '408', '490', '401', '404', '407', '406', '456', '491', '451', '454', '458', '405', '455', '457'];
        /**
         * Hexadecimal values of Windows1252 characters
         */
        this.windows1252CharSet = ['20AC', '201A', '192', '201E', '2026', '2020', '2021', '2C6', '2030', '160', '2039', '152',
            '17D', '2018', '2019', '201C', '201D', '2022', '2013', '2014', '2DC', '2122', '161', '203A', '153', '17E', '178'];
        /**
         * Hexadecimal values of Windows1256 characters
         */
        this.windows1256CharSet = ['67E', '679', '152', '686', '698', '688', '6AF', '6A9', '691', '153', '6BA', '6BE', '6C1',
            '644', '645', '646', '647', '648', '649', '64A', '6D2'];
        /**
         * Equivalent values of CP437 characters
         */
        this.cp437ReplaceNumber = [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
            194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218,
            219, 220, 221, 222, 223, 254];
        /**
         * Equivalent values of ISO8859_2 characters
         */
        this.iso88592ReplaceNumber = [161, 162, 163, 165, 166, 169, 170, 171, 172, 174, 175, 177, 178, 179, 181, 182, 183,
            185, 186, 187, 188, 189, 190, 191, 192, 195, 197, 198, 200, 202, 204, 207, 208, 209, 210, 213, 216, 217, 219, 222, 224,
            227, 229, 230, 232, 234, 236, 239, 240, 241, 242, 245, 248, 249, 251, 254, 255];
        /**
         * Equivalent values of ISO8859_3 characters
         */
        this.iso88593ReplaceNumber = [161, 166, 169, 170, 171, 172, 175, 177, 182, 185, 186, 187, 188, 191, 197, 198,
            213, 216, 221, 222, 229, 230, 245, 248, 253, 254];
        /**
         * Equivalent values of ISO8859_4 characters
         */
        this.iso88594ReplaceNumber = [161, 162, 163, 165, 166, 169, 170, 171, 172, 174, 177, 178, 179, 181, 182, 183,
            185, 186, 187, 188, 189, 190, 191, 192, 199, 200, 202, 204, 207, 208, 209, 210, 211, 217, 221, 222, 224, 231, 232, 234,
            236, 239, 240, 241, 242, 243, 249, 253, 254];
        /**
         * Equivalent values of Windows1250 characters
         */
        this.windows1250ReplaceNumber = [163, 165, 170, 175, 179, 185, 186, 188, 190, 191];
        /**
         * Equivalent values of Windows1251 characters
         */
        this.windows1251ReplaceNumber = [128, 129, 131, 138, 140, 141, 142, 143, 144, 154, 156, 157, 158, 159, 161, 162,
            163, 165, 168, 170, 175, 178, 179, 180, 184, 186, 188, 189, 190, 191];
        /**
         * Equivalent values of Windows1252 characters
         */
        this.windows1252ReplaceNumber = [128, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 142, 145, 146, 147,
            148, 149, 150, 151, 152, 153, 154, 155, 156, 158, 159];
        /**
         * Equivalent values of Windows1256 characters
         */
        this.windows1256ReplaceNumber = [129, 138, 140, 141, 142, 143, 144, 152, 154, 156, 159, 170, 192, 225, 227, 228,
            229, 230, 236, 237, 255];
        /**
         * Holds all the end values.
         */
        /** @private */
        this.endValues = [208, 359, 567, 807, 1079, 1383, 1568, 1936, 2336, 2768, 3232, 3728, 4256, 4651, 5243, 5867, 6523,
            7211, 7931, 8683, 9252, 10068, 10916, 11796, 12708, 13652, 14628, 15371, 16411, 17483, 18587, 19723, 20891, 22091, 23008,
            24272, 25568, 26896, 28256, 29648];
        /**
         * Holds all the Data capacity values.
         */
        /** @private */
        this.dataCapacityValues = [26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901,
            991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362,
            3532, 3706];
        /**
         * Holds all  the Numeric Data capacity of the Error correction level Low.
         */
        /** @private */
        this.numericDataCapacityLow = [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408,
            1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836,
            6153, 6479, 6743, 7089];
        /**
         * Holds all  the Numeric Data capacity of the Error correction level Medium.
         */
        /** @private */
        this.numericDataCapacityMedium = [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082,
            1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588,
            4775, 5039, 5313, 5596];
        /**
         * Holds all  the Numeric Data capacity of the Error correction level Quartile.
         */
        /** @private */
        this.numericDataCapacityQuartile = [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775,
            876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244,
            3417, 3599, 3791, 3993];
        /**
         * Holds all  the Numeric Data capacity of the Error correction level High.
         */
        /** @private */
        this.numericDataCapacityHigh = [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602,
            674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524,
            2625, 2735, 2927, 3057];
        /**
         * Holds all  the Alpha numeric Data capacity of the Error correction level Low.
         */
        /** @private */
        this.alphanumericDataCapacityLow = [25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758,
            854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132, 2223, 2369, 2520, 2677, 2840, 3009, 3183, 3351,
            3537, 3729, 3927, 4087, 4296];
        /**
         * Holds all  the Alpha numeric Data capacity of the Error correction level Medium.
         */
        /** @private */
        this.alphanumericDataCapacityMedium = [20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600,
            656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780,
            2894, 3054, 3220, 3391];
        /**
         * Holds all  the Alpha numeric Data capacity of the Error correction level Quartile.
         */
        /** @private */
        this.alphanumericDataCapacityQuartile = [16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470, 531,
            574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322, 1429, 1499, 1618, 1700, 1787, 1867, 1966, 2071, 2181,
            2298, 2420];
        /**
         * Holds all  the Alpha numeric Data capacity of the Error correction level High.
         */
        /** @private */
        this.alphanumericDataCapacityHigh = [10, 20, 35, 50, 64, 84, 93, 122, 143, 174, 200, 227, 259, 283, 321, 365, 408, 452,
            493, 557, 587, 640, 672, 744, 779, 864, 910, 958, 1016, 1080, 1150, 1226, 1307, 1394, 1431, 1530, 1591, 1658, 1774, 1852];
        /**
         * Holds all  the Binary Data capacity of the Error correction level Low.
         */
        /** @private */
        this.binaryDataCapacityLow = [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792,
            858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953];
        /**
         * Holds all  the Binary Data capacity of the Error correction level Medium.
         */
        /** @private */
        this.binaryDataCapacityMedium = [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560,
            624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331];
        /**
         * Holds all  the Binary Data capacity of the Error correction level Quartile.
         */
        /** @private */
        this.binaryDataCapacityQuartile = [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394,
            442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663];
        /**
         * Holds all  the Binary Data capacity of the Error correction level High.
         */
        /** @private */
        this.binaryDataCapacityHigh = [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338,
            382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273];
        /**
         * Holds all  the Mixed Data capacity of the Error correction level Low.
         */
        this.mixedDataCapacityLow = [152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184,
            4712, 5176, 5768, 6360, 6888, 7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 4744, 15640, 16568,
            17528, 18448, 19472, 20528, 21616, 22496, 23648];
        /**
         * Holds all  the Mixed Data capacity of the Error correction level Medium.
         */
        this.mixedDataCapacityMedium = [128, 244, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920,
            3320, 3624, 4056, 4504, 5016, 5352, 5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 1640, 12328, 13048,
            13800, 14496, 15312, 15936, 16816, 17728, 18672];
        /**
         * Holds all  the Mixed Data capacity of the Error correction level Quartile.
         */
        this.mixedDataCapacityQuartile = [104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088,
            2360, 2600, 2936, 3176, 3560, 3880, 4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368,
            9848, 10288, 10832, 11408, 12016, 12656, 13328];
        /**
         * Holds all  the Mixed Data capacity of the Error correction level High.
         */
        this.mixedDataCapacityHigh = [72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264,
            2504, 2728, 3080, 3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136,
            9776, 10208];
        this.mVersion = version;
        this.mErrorCorrectionLevel = errorCorrectionLevel;
        this.NumberOfDataCodeWord = this.obtainNumberOfDataCodeWord();
        this.NumberOfErrorCorrectingCodeWords = this.obtainNumberOfErrorCorrectingCodeWords();
        this.NumberOfErrorCorrectionBlocks = this.obtainNumberOfErrorCorrectionBlocks();
        this.End = this.obtainEnd();
        this.DataCapacity = this.obtainDataCapacity();
        this.FormatInformation = this.obtainFormatInformation();
        this.VersionInformation = this.obtainVersionInformation();
    }
    Object.defineProperty(PdfQRBarcodeValues.prototype, "NumberOfDataCodeWord", {
        /**
         * Get or public set the Number of Data code words.
         */
        /** @private */
        get: function () {
            return this.mNumberOfDataCodeWord;
        },
        /** @private */
        set: function (value) {
            this.mNumberOfDataCodeWord = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "NumberOfErrorCorrectingCodeWords", {
        /**
         * Get or Private set the Number of Error correction code words.
         */
        /** @private */
        get: function () {
            return this.mNumberOfErrorCorrectingCodeWords;
        },
        /** @private */
        set: function (value) {
            this.mNumberOfErrorCorrectingCodeWords = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "NumberOfErrorCorrectionBlocks", {
        /**
         * Get or Private set the Number of Error correction Blocks.
         */
        /** @private */
        get: function () {
            return this.mNumberOfErrorCorrectionBlocks;
        },
        /** @private */
        set: function (value) {
            this.mNumberOfErrorCorrectionBlocks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "End", {
        /**
         * Set the End value of the Current Version.
         */
        set: function (value) {
            this.mEnd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "DataCapacity", {
        /**
         * Get or Private set the Data capacity.
         */
        get: function () {
            return this.mDataCapacity;
        },
        set: function (value) {
            this.mDataCapacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "FormatInformation", {
        /**
         * Get or Private set the Format Information.
         */
        /** @private */
        get: function () {
            return this.mFormatInformation;
        },
        /** @private */
        set: function (value) {
            this.mFormatInformation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfQRBarcodeValues.prototype, "VersionInformation", {
        /**
         * Get or Private set the Version Information.
         */
        /** @private */
        get: function () {
            return this.mVersionInformation;
        },
        /** @private */
        set: function (value) {
            this.mVersionInformation = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the Alphanumeric values.
     */
    /** @private */
    PdfQRBarcodeValues.prototype.getAlphaNumericValues = function (value) {
        var valueInInt = 0;
        switch (value) {
            case '0':
                valueInInt = 0;
                break;
            case '1':
                valueInInt = 1;
                break;
            case '2':
                valueInInt = 2;
                break;
            case '3':
                valueInInt = 3;
                break;
            case '4':
                valueInInt = 4;
                break;
            case '5':
                valueInInt = 5;
                break;
            case '6':
                valueInInt = 6;
                break;
            case '7':
                valueInInt = 7;
                break;
            case '8':
                valueInInt = 8;
                break;
            case '9':
                valueInInt = 9;
                break;
            case 'A':
                valueInInt = 10;
                break;
            case 'B':
                valueInInt = 11;
                break;
            case 'C':
                valueInInt = 12;
                break;
            case 'D':
                valueInInt = 13;
                break;
            case 'E':
                valueInInt = 14;
                break;
            case 'F':
                valueInInt = 15;
                break;
            case 'G':
                valueInInt = 16;
                break;
            case 'H':
                valueInInt = 17;
                break;
            case 'I':
                valueInInt = 18;
                break;
            case 'J':
                valueInInt = 19;
                break;
            case 'K':
                valueInInt = 20;
                break;
            case 'L':
                valueInInt = 21;
                break;
            case 'M':
                valueInInt = 22;
                break;
            case 'N':
                valueInInt = 23;
                break;
            case 'O':
                valueInInt = 24;
                break;
            case 'P':
                valueInInt = 25;
                break;
            case 'Q':
                valueInInt = 26;
                break;
            case 'R':
                valueInInt = 27;
                break;
            case 'S':
                valueInInt = 28;
                break;
            case 'T':
                valueInInt = 29;
                break;
            case 'U':
                valueInInt = 30;
                break;
            case 'V':
                valueInInt = 31;
                break;
            case 'W':
                valueInInt = 32;
                break;
            case 'X':
                valueInInt = 33;
                break;
            case 'Y':
                valueInInt = 34;
                break;
            case 'Z':
                valueInInt = 35;
                break;
            case ' ':
                valueInInt = 36;
                break;
            case '$':
                valueInInt = 37;
                break;
            case '%':
                valueInInt = 38;
                break;
            case '*':
                valueInInt = 39;
                break;
            case '+':
                valueInInt = 40;
                break;
            case '-':
                valueInInt = 41;
                break;
            case '.':
                valueInInt = 42;
                break;
            case '/':
                valueInInt = 43;
                break;
            case ':':
                valueInInt = 44;
                break;
            default:
            // throw new BarcodeException('Not a valid input');
        }
        return valueInInt;
    };
    /**
     * Gets number of data code words.
     */
    /* tslint:disable */
    PdfQRBarcodeValues.prototype.obtainNumberOfDataCodeWord = function () {
        var countOfDataCodeWord = 0;
        switch (this.mVersion) {
            case 1:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 19;
                        break;
                    case 15:
                        countOfDataCodeWord = 16;
                        break;
                    case 25:
                        countOfDataCodeWord = 13;
                        break;
                    case 30:
                        countOfDataCodeWord = 9;
                        break;
                }
                break;
            case 2:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 34;
                        break;
                    case 15:
                        countOfDataCodeWord = 28;
                        break;
                    case 25:
                        countOfDataCodeWord = 22;
                        break;
                    case 30:
                        countOfDataCodeWord = 16;
                        break;
                }
                break;
            case 3:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 55;
                        break;
                    case 15:
                        countOfDataCodeWord = 44;
                        break;
                    case 25:
                        countOfDataCodeWord = 34;
                        break;
                    case 30:
                        countOfDataCodeWord = 26;
                        break;
                }
                break;
            case 4:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 80;
                        break;
                    case 15:
                        countOfDataCodeWord = 64;
                        break;
                    case 25:
                        countOfDataCodeWord = 48;
                        break;
                    case 30:
                        countOfDataCodeWord = 36;
                        break;
                }
                break;
            case 5:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 108;
                        break;
                    case 15:
                        countOfDataCodeWord = 86;
                        break;
                    case 25:
                        countOfDataCodeWord = 62;
                        break;
                    case 30:
                        countOfDataCodeWord = 46;
                        break;
                }
                break;
            case 6:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 136;
                        break;
                    case 15:
                        countOfDataCodeWord = 108;
                        break;
                    case 25:
                        countOfDataCodeWord = 76;
                        break;
                    case 30:
                        countOfDataCodeWord = 60;
                        break;
                }
                break;
            case 7:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 156;
                        break;
                    case 15:
                        countOfDataCodeWord = 124;
                        break;
                    case 25:
                        countOfDataCodeWord = 88;
                        break;
                    case 30:
                        countOfDataCodeWord = 66;
                        break;
                }
                break;
            case 8:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 194;
                        break;
                    case 15:
                        countOfDataCodeWord = 154;
                        break;
                    case 25:
                        countOfDataCodeWord = 110;
                        break;
                    case 30:
                        countOfDataCodeWord = 86;
                        break;
                }
                break;
            case 9:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 232;
                        break;
                    case 15:
                        countOfDataCodeWord = 182;
                        break;
                    case 25:
                        countOfDataCodeWord = 132;
                        break;
                    case 30:
                        countOfDataCodeWord = 100;
                        break;
                }
                break;
            case 10:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 274;
                        break;
                    case 15:
                        countOfDataCodeWord = 216;
                        break;
                    case 25:
                        countOfDataCodeWord = 154;
                        break;
                    case 30:
                        countOfDataCodeWord = 122;
                        break;
                }
                break;
            case 11:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 324;
                        break;
                    case 15:
                        countOfDataCodeWord = 254;
                        break;
                    case 25:
                        countOfDataCodeWord = 180;
                        break;
                    case 30:
                        countOfDataCodeWord = 140;
                        break;
                }
                break;
            case 12:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 370;
                        break;
                    case 15:
                        countOfDataCodeWord = 290;
                        break;
                    case 25:
                        countOfDataCodeWord = 206;
                        break;
                    case 30:
                        countOfDataCodeWord = 158;
                        break;
                }
                break;
            case 13:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 428;
                        break;
                    case 15:
                        countOfDataCodeWord = 334;
                        break;
                    case 25:
                        countOfDataCodeWord = 244;
                        break;
                    case 30:
                        countOfDataCodeWord = 180;
                        break;
                }
                break;
            case 14:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 461;
                        break;
                    case 15:
                        countOfDataCodeWord = 365;
                        break;
                    case 25:
                        countOfDataCodeWord = 261;
                        break;
                    case 30:
                        countOfDataCodeWord = 197;
                        break;
                }
                break;
            case 15:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 523;
                        break;
                    case 15:
                        countOfDataCodeWord = 415;
                        break;
                    case 25:
                        countOfDataCodeWord = 295;
                        break;
                    case 30:
                        countOfDataCodeWord = 223;
                        break;
                }
                break;
            case 16:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 589;
                        break;
                    case 15:
                        countOfDataCodeWord = 453;
                        break;
                    case 25:
                        countOfDataCodeWord = 325;
                        break;
                    case 30:
                        countOfDataCodeWord = 253;
                        break;
                }
                break;
            case 17:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 647;
                        break;
                    case 15:
                        countOfDataCodeWord = 507;
                        break;
                    case 25:
                        countOfDataCodeWord = 367;
                        break;
                    case 30:
                        countOfDataCodeWord = 283;
                        break;
                }
                break;
            case 18:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 721;
                        break;
                    case 15:
                        countOfDataCodeWord = 563;
                        break;
                    case 25:
                        countOfDataCodeWord = 397;
                        break;
                    case 30:
                        countOfDataCodeWord = 313;
                        break;
                }
                break;
            case 19:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 795;
                        break;
                    case 15:
                        countOfDataCodeWord = 627;
                        break;
                    case 25:
                        countOfDataCodeWord = 445;
                        break;
                    case 30:
                        countOfDataCodeWord = 341;
                        break;
                }
                break;
            case 20:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 861;
                        break;
                    case 15:
                        countOfDataCodeWord = 669;
                        break;
                    case 25:
                        countOfDataCodeWord = 485;
                        break;
                    case 30:
                        countOfDataCodeWord = 385;
                        break;
                }
                break;
            case 21:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 932;
                        break;
                    case 15:
                        countOfDataCodeWord = 714;
                        break;
                    case 25:
                        countOfDataCodeWord = 512;
                        break;
                    case 30:
                        countOfDataCodeWord = 406;
                        break;
                }
                break;
            case 22:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1006;
                        break;
                    case 15:
                        countOfDataCodeWord = 782;
                        break;
                    case 25:
                        countOfDataCodeWord = 568;
                        break;
                    case 30:
                        countOfDataCodeWord = 442;
                        break;
                }
                break;
            case 23:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1094;
                        break;
                    case 15:
                        countOfDataCodeWord = 860;
                        break;
                    case 25:
                        countOfDataCodeWord = 614;
                        break;
                    case 30:
                        countOfDataCodeWord = 464;
                        break;
                }
                break;
            case 24:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1174;
                        break;
                    case 15:
                        countOfDataCodeWord = 914;
                        break;
                    case 25:
                        countOfDataCodeWord = 664;
                        break;
                    case 30:
                        countOfDataCodeWord = 514;
                        break;
                }
                break;
            case 25:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1276;
                        break;
                    case 15:
                        countOfDataCodeWord = 1000;
                        break;
                    case 25:
                        countOfDataCodeWord = 718;
                        break;
                    case 30:
                        countOfDataCodeWord = 538;
                        break;
                }
                break;
            case 26:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1370;
                        break;
                    case 15:
                        countOfDataCodeWord = 1062;
                        break;
                    case 25:
                        countOfDataCodeWord = 754;
                        break;
                    case 30:
                        countOfDataCodeWord = 596;
                        break;
                }
                break;
            case 27:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1468;
                        break;
                    case 15:
                        countOfDataCodeWord = 1128;
                        break;
                    case 25:
                        countOfDataCodeWord = 808;
                        break;
                    case 30:
                        countOfDataCodeWord = 628;
                        break;
                }
                break;
            case 28:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1531;
                        break;
                    case 15:
                        countOfDataCodeWord = 1193;
                        break;
                    case 25:
                        countOfDataCodeWord = 871;
                        break;
                    case 30:
                        countOfDataCodeWord = 661;
                        break;
                }
                break;
            case 29:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1631;
                        break;
                    case 15:
                        countOfDataCodeWord = 1267;
                        break;
                    case 25:
                        countOfDataCodeWord = 911;
                        break;
                    case 30:
                        countOfDataCodeWord = 701;
                        break;
                }
                break;
            case 30:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1735;
                        break;
                    case 15:
                        countOfDataCodeWord = 1373;
                        break;
                    case 25:
                        countOfDataCodeWord = 985;
                        break;
                    case 30:
                        countOfDataCodeWord = 745;
                        break;
                }
                break;
            case 31:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1843;
                        break;
                    case 15:
                        countOfDataCodeWord = 1455;
                        break;
                    case 25:
                        countOfDataCodeWord = 1033;
                        break;
                    case 30:
                        countOfDataCodeWord = 793;
                        break;
                }
                break;
            case 32:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 1955;
                        break;
                    case 15:
                        countOfDataCodeWord = 1541;
                        break;
                    case 25:
                        countOfDataCodeWord = 1115;
                        break;
                    case 30:
                        countOfDataCodeWord = 845;
                        break;
                }
                break;
            case 33:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2071;
                        break;
                    case 15:
                        countOfDataCodeWord = 1631;
                        break;
                    case 25:
                        countOfDataCodeWord = 1171;
                        break;
                    case 30:
                        countOfDataCodeWord = 901;
                        break;
                }
                break;
            case 34:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2191;
                        break;
                    case 15:
                        countOfDataCodeWord = 1725;
                        break;
                    case 25:
                        countOfDataCodeWord = 1231;
                        break;
                    case 30:
                        countOfDataCodeWord = 961;
                        break;
                }
                break;
            case 35:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2306;
                        break;
                    case 15:
                        countOfDataCodeWord = 1812;
                        break;
                    case 25:
                        countOfDataCodeWord = 1286;
                        break;
                    case 30:
                        countOfDataCodeWord = 986;
                        break;
                }
                break;
            case 36:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2434;
                        break;
                    case 15:
                        countOfDataCodeWord = 1914;
                        break;
                    case 25:
                        countOfDataCodeWord = 1354;
                        break;
                    case 30:
                        countOfDataCodeWord = 1054;
                        break;
                }
                break;
            case 37:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2566;
                        break;
                    case 15:
                        countOfDataCodeWord = 1992;
                        break;
                    case 25:
                        countOfDataCodeWord = 1426;
                        break;
                    case 30:
                        countOfDataCodeWord = 1096;
                        break;
                }
                break;
            case 38:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2702;
                        break;
                    case 15:
                        countOfDataCodeWord = 2102;
                        break;
                    case 25:
                        countOfDataCodeWord = 1502;
                        break;
                    case 30:
                        countOfDataCodeWord = 1142;
                        break;
                }
                break;
            case 39:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2812;
                        break;
                    case 15:
                        countOfDataCodeWord = 2216;
                        break;
                    case 25:
                        countOfDataCodeWord = 1582;
                        break;
                    case 30:
                        countOfDataCodeWord = 1222;
                        break;
                }
                break;
            case 40:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        countOfDataCodeWord = 2956;
                        break;
                    case 15:
                        countOfDataCodeWord = 2334;
                        break;
                    case 25:
                        countOfDataCodeWord = 1666;
                        break;
                    case 30:
                        countOfDataCodeWord = 1276;
                        break;
                }
                break;
        }
        return countOfDataCodeWord;
    };
    /* tslint:enable */
    /**
     * Get number of Error correction code words.
     */
    PdfQRBarcodeValues.prototype.obtainNumberOfErrorCorrectingCodeWords = function () {
        var index = (this.mVersion - 1) * 4;
        switch (this.mErrorCorrectionLevel) {
            case 7:
                index += 0;
                break;
            case 15:
                index += 1;
                break;
            case 25:
                index += 2;
                break;
            case 30:
                index += 3;
                break;
        }
        return this.numberOfErrorCorrectingCodeWords[index];
    };
    /**
     * Gets number of Error correction Blocks.
     */
    /* tslint:disable */
    PdfQRBarcodeValues.prototype.obtainNumberOfErrorCorrectionBlocks = function () {
        var numberOfErrorCorrectionBlocks = null;
        switch (this.mVersion) {
            case 1:
                numberOfErrorCorrectionBlocks = [1];
                break;
            case 2:
                numberOfErrorCorrectionBlocks = [1];
                break;
            case 3:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [1];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [1];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                }
                break;
            case 4:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [1];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                }
                break;
            case 5:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [1];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [2, 33, 15, 2, 34, 16];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [2, 33, 11, 2, 34, 12];
                        break;
                }
                break;
            case 6:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                }
                break;
            case 7:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [2, 32, 14, 4, 33, 15];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [4, 39, 13, 1, 40, 14];
                        break;
                }
                break;
            case 8:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [2, 60, 38, 2, 61, 39];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4, 40, 18, 2, 41, 19];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [4, 40, 14, 2, 41, 15];
                        break;
                }
                break;
            case 9:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [3, 58, 36, 2, 59, 37];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4, 36, 16, 4, 37, 17];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [4, 36, 12, 4, 37, 13];
                        break;
                }
                break;
            case 10:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2, 86, 68, 2, 87, 69];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [4, 69, 43, 1, 70, 44];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [6, 43, 19, 2, 44, 20];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [6, 43, 15, 2, 44, 16];
                        break;
                }
                break;
            case 11:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [1, 80, 50, 4, 81, 51];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4, 50, 22, 4, 51, 23];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [3, 36, 12, 8, 37, 13];
                        break;
                }
                break;
            case 12:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2, 116, 92, 2, 117, 93];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [6, 58, 36, 2, 59, 37];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4, 46, 20, 6, 47, 21];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [7, 42, 14, 4, 43, 15];
                        break;
                }
                break;
            case 13:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [4];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [8, 59, 37, 1, 60, 38];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [8, 44, 20, 4, 45, 21];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [12, 33, 11, 4, 34, 12];
                        break;
                }
                break;
            case 14:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [3, 145, 115, 1, 146, 116];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [4, 64, 40, 5, 65, 41];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [11, 36, 16, 5, 37, 17];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [11, 36, 12, 5, 37, 13];
                        break;
                }
                break;
            case 15:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [5, 109, 87, 1, 110, 88];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [5, 65, 41, 5, 66, 42];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [5, 54, 24, 7, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [11, 36, 12, 7, 37, 13];
                        break;
                }
                break;
            case 16:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [5, 112, 98, 1, 123, 99];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [7, 73, 45, 3, 74, 46];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [15, 43, 19, 2, 44, 20];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [3, 45, 15, 13, 46, 16];
                        break;
                }
                break;
            case 17:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [1, 135, 107, 5, 136, 108];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [10, 74, 46, 1, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [1, 50, 22, 15, 51, 23];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [2, 42, 14, 17, 43, 15];
                        break;
                }
                break;
            case 18:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [5, 150, 120, 1, 151, 121];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [9, 69, 43, 4, 70, 44];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [17, 50, 22, 1, 51, 23];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [2, 42, 14, 19, 43, 15];
                        break;
                }
                break;
            case 19:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [3, 141, 113, 4, 142, 114];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [3, 70, 44, 11, 71, 45];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [17, 47, 21, 4, 48, 22];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [9, 39, 13, 16, 40, 14];
                        break;
                }
                break;
            case 20:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [3, 135, 107, 5, 136, 108];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [3, 67, 41, 13, 68, 42];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [15, 54, 24, 5, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [15, 43, 15, 10, 44, 16];
                        break;
                }
                break;
            case 21:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [4, 144, 116, 4, 145, 117];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [17];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [17, 50, 22, 6, 51, 23];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [19, 46, 16, 6, 47, 17];
                        break;
                }
                break;
            case 22:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [2, 139, 111, 7, 140, 112];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [17];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [7, 54, 24, 16, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [34];
                        break;
                }
                break;
            case 23:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [4, 151, 121, 5, 152, 122];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [4, 75, 47, 14, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [11, 54, 24, 14, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [16, 45, 15, 14, 46, 16];
                        break;
                }
                break;
            case 24:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [6, 147, 117, 4, 148, 118];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [6, 73, 45, 14, 74, 46];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [11, 54, 24, 16, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [30, 46, 16, 2, 47, 17];
                        break;
                }
                break;
            case 25:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [8, 132, 106, 4, 133, 107];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [8, 75, 47, 13, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [7, 54, 24, 22, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [22, 45, 15, 13, 46, 16];
                        break;
                }
                break;
            case 26:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [10, 142, 114, 2, 143, 115];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [19, 74, 46, 4, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [28, 50, 22, 6, 51, 23];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [33, 46, 16, 4, 47, 17];
                        break;
                }
                break;
            case 27:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [8, 152, 122, 4, 153, 123];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [22, 73, 45, 3, 74, 46];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [8, 53, 23, 26, 54, 24];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [12, 45, 15, 28, 46, 16];
                        break;
                }
                break;
            case 28:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [3, 147, 117, 10, 148, 118];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [3, 73, 45, 23, 74, 46];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [4, 54, 24, 31, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [11, 45, 15, 31, 46, 16];
                        break;
                }
                break;
            case 29:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [7, 146, 116, 7, 147, 117];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [21, 73, 45, 7, 74, 46];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [1, 53, 23, 37, 54, 24];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [19, 45, 15, 26, 46, 16];
                        break;
                }
                break;
            case 30:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [5, 145, 115, 10, 146, 116];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [19, 75, 47, 10, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [15, 54, 24, 25, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [23, 45, 15, 25, 46, 16];
                        break;
                }
                break;
            case 31:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [13, 145, 115, 3, 146, 116];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [2, 74, 46, 29, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [42, 54, 24, 1, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [23, 45, 15, 28, 46, 16];
                        break;
                }
                break;
            case 32:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [17];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [10, 74, 46, 23, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [10, 54, 24, 35, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [19, 45, 15, 35, 46, 16];
                        break;
                }
                break;
            case 33:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [17, 145, 115, 1, 146, 116];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [14, 74, 46, 21, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [29, 54, 24, 19, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [11, 45, 15, 46, 46, 16];
                        break;
                }
                break;
            case 34:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [13, 145, 115, 6, 146, 116];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [14, 74, 46, 23, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [44, 54, 24, 7, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [59, 46, 16, 1, 47, 17];
                        break;
                }
                break;
            case 35:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [12, 151, 121, 7, 152, 122];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [12, 75, 47, 26, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [39, 54, 24, 14, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [22, 45, 15, 41, 46, 16];
                        break;
                }
                break;
            case 36:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [6, 151, 121, 14, 152, 122];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [6, 75, 47, 34, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [46, 54, 24, 10, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [2, 45, 15, 64, 46, 16];
                        break;
                }
                break;
            case 37:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [17, 152, 122, 4, 153, 123];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [29, 74, 46, 14, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [49, 54, 24, 10, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [24, 45, 15, 46, 46, 16];
                        break;
                }
                break;
            case 38:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [4, 152, 122, 18, 153, 123];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [13, 74, 46, 32, 75, 47];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [48, 54, 24, 14, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [42, 45, 15, 32, 46, 16];
                        break;
                }
                break;
            case 39:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [20, 147, 117, 4, 148, 118];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [40, 75, 47, 7, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [43, 54, 24, 22, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [10, 45, 15, 67, 46, 16];
                        break;
                }
                break;
            case 40:
                switch (this.mErrorCorrectionLevel) {
                    case 7:
                        numberOfErrorCorrectionBlocks = [19, 148, 118, 6, 149, 119];
                        break;
                    case 15:
                        numberOfErrorCorrectionBlocks = [18, 75, 47, 31, 76, 48];
                        break;
                    case 25:
                        numberOfErrorCorrectionBlocks = [34, 54, 24, 34, 55, 25];
                        break;
                    case 30:
                        numberOfErrorCorrectionBlocks = [20, 45, 15, 61, 46, 16];
                        break;
                }
                break;
        }
        return numberOfErrorCorrectionBlocks;
    };
    /* tslint:enable */
    /**
     * Gets the End of the version.
     */
    PdfQRBarcodeValues.prototype.obtainEnd = function () {
        return this.endValues[this.mVersion - 1];
    };
    /**
     * Gets Data capacity
     */
    PdfQRBarcodeValues.prototype.obtainDataCapacity = function () {
        return this.dataCapacityValues[this.mVersion - 1];
    };
    /**
     * Gets format information
     */
    PdfQRBarcodeValues.prototype.obtainFormatInformation = function () {
        var formatInformation = null;
        switch (this.mErrorCorrectionLevel) {
            case 7:
                formatInformation = [1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1];
                break;
            case 15:
                formatInformation = [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1];
                break;
            case 25:
                formatInformation = [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0];
                break;
            case 30:
                formatInformation = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0];
                break;
        }
        return formatInformation;
    };
    /**
     * Gets version information
     */
    PdfQRBarcodeValues.prototype.obtainVersionInformation = function () {
        var versionInformation = null;
        switch (this.mVersion) {
            case 7:
                versionInformation = [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0];
                break;
            case 8:
                versionInformation = [0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0];
                break;
            case 9:
                versionInformation = [1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0];
                break;
            case 10:
                versionInformation = [1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
                break;
            case 11:
                versionInformation = [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0];
                break;
            case 12:
                versionInformation = [0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0];
                break;
            case 13:
                versionInformation = [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0];
                break;
            case 14:
                versionInformation = [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0];
                break;
            case 15:
                versionInformation = [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0];
                break;
            case 16:
                versionInformation = [0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0];
                break;
            case 17:
                versionInformation = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0];
                break;
            case 18:
                versionInformation = [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0];
                break;
            case 19:
                versionInformation = [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0];
                break;
            case 20:
                versionInformation = [0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0];
                break;
            case 21:
                versionInformation = [1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0];
                break;
            case 22:
                versionInformation = [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0];
                break;
            case 23:
                versionInformation = [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0];
                break;
            case 24:
                versionInformation = [0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0];
                break;
            case 25:
                versionInformation = [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0];
                break;
            case 26:
                versionInformation = [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0];
                break;
            case 27:
                versionInformation = [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0];
                break;
            case 28:
                versionInformation = [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0];
                break;
            case 29:
                versionInformation = [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0];
                break;
            case 30:
                versionInformation = [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0];
                break;
            case 31:
                versionInformation = [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0];
                break;
            case 32:
                versionInformation = [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1];
                break;
            case 33:
                versionInformation = [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1];
                break;
            case 34:
                versionInformation = [0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1];
                break;
            case 35:
                versionInformation = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1];
                break;
            case 36:
                versionInformation = [1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1];
                break;
            case 37:
                versionInformation = [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1];
                break;
            case 38:
                versionInformation = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1];
                break;
            case 39:
                versionInformation = [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1];
                break;
            case 40:
                versionInformation = [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1];
                break;
        }
        return versionInformation;
    };
    /**
     * Gets Numeric Data capacity.
     */
    /** @private */
    PdfQRBarcodeValues.prototype.getNumericDataCapacity = function (version, errorCorrectionLevel) {
        var capacity = null;
        switch (errorCorrectionLevel) {
            case 7:
                capacity = this.numericDataCapacityLow;
                break;
            case 15:
                capacity = this.numericDataCapacityMedium;
                break;
            case 25:
                capacity = this.numericDataCapacityQuartile;
                break;
            case 30:
                capacity = this.numericDataCapacityHigh;
                break;
        }
        return capacity[version - 1];
    };
    /**
     * Gets Alphanumeric data capacity.
     */
    /** @private */
    PdfQRBarcodeValues.prototype.getAlphanumericDataCapacity = function (version, errorCorrectionLevel) {
        var capacity = null;
        switch (errorCorrectionLevel) {
            case 7:
                capacity = this.alphanumericDataCapacityLow;
                break;
            case 15:
                capacity = this.alphanumericDataCapacityMedium;
                break;
            case 25:
                capacity = this.alphanumericDataCapacityQuartile;
                break;
            case 30:
                capacity = this.alphanumericDataCapacityHigh;
                break;
        }
        return capacity[version - 1];
    };
    /** @private */
    PdfQRBarcodeValues.prototype.getBinaryDataCapacity = function (version, errorCorrectionLevel) {
        var capacity = null;
        switch (errorCorrectionLevel) {
            case 7:
                capacity = this.binaryDataCapacityLow;
                break;
            case 15:
                capacity = this.binaryDataCapacityMedium;
                break;
            case 25:
                capacity = this.binaryDataCapacityQuartile;
                break;
            case 30:
                capacity = this.binaryDataCapacityHigh;
                break;
        }
        return capacity[version - 1];
    };
    return PdfQRBarcodeValues;
}());

/**
 * Qrcode used to calculate the Qrcode control
 */
var ErrorCorrectionCodewords = /** @__PURE__ @class */ (function () {
    /**
     * Initializes Error correction code word
     */
    function ErrorCorrectionCodewords(version, correctionLevel) {
        /**
         * Holds all the values of Alpha
         */
        this.alpha = [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143,
            3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80,
            160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231,
            211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208,
            189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169,
            79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99,
            198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87,
            174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195,
            155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125,
            250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142];
        this.mQrBarcodeValues = new PdfQRBarcodeValues(version, correctionLevel);
        var variable = 'DataCapacity';
        this.mLength = this.mQrBarcodeValues[variable];
        variable = 'NumberOfErrorCorrectingCodeWords';
        this.eccw = this.mQrBarcodeValues[variable];
    }
    Object.defineProperty(ErrorCorrectionCodewords.prototype, "DC", {
        /**
         * Sets and Gets the Data code word
         */
        /** @private */
        set: function (value) {
            this.mDataCodeWord = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorCorrectionCodewords.prototype, "DataBits", {
        /**
         * Sets and Gets the DataBits
         */
        /** @private */
        set: function (value) {
            this.databits = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorCorrectionCodewords.prototype, "Eccw", {
        /**
         * Sets and Gets the Error Correction Code Words
         */
        /** @private */
        set: function (value) {
            this.eccw = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the Error correction code word
     */
    /* tslint:disable */
    /** @private */
    ErrorCorrectionCodewords.prototype.getErcw = function () {
        var decimalRepresentation;
        var ecw;
        this.decimalValue = [this.databits];
        switch (this.eccw) {
            case 7:
                this.gx = [0, 87, 229, 146, 149, 238, 102, 21];
                break;
            case 10:
                this.gx = [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45];
                break;
            case 13:
                this.gx = [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78];
                break;
            case 15:
                this.gx = [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105];
                break;
            case 16:
                this.gx = [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120];
                break;
            case 17:
                this.gx = [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136];
                break;
            case 18:
                this.gx = [0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153];
                break;
            case 20:
                this.gx = [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190];
                break;
            case 22:
                this.gx = [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231];
                break;
            case 24:
                this.gx = [0, 229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87,
                    96, 227, 21];
                break;
            case 26:
                this.gx = [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153,
                    145, 218, 70];
                break;
            case 28:
                this.gx = [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195,
                    212, 119, 242, 37, 9, 123];
                break;
            case 30:
                this.gx = [0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130,
                    156, 37, 251, 216, 238, 40, 192, 180];
                break;
        }
        this.gx = this.getElement(this.gx, this.alpha);
        this.toDecimal(this.mDataCodeWord);
        decimalRepresentation = this.divide();
        ecw = this.toBinary(decimalRepresentation);
        return ecw;
    };
    /* tslint:enable */
    /**
     * Convert to decimal
     * @param inString - is a binary values.
     */
    ErrorCorrectionCodewords.prototype.toDecimal = function (inString) {
        for (var i = 0; i < inString.length; i++) {
            this.decimalValue[i] = parseInt(inString[i], 2);
        }
    };
    /**
     * Convert decimal to binary.
     */
    ErrorCorrectionCodewords.prototype.toBinary = function (decimalRepresentation) {
        var toBinary = [];
        for (var i = 0; i < this.eccw; i++) {
            var str = '';
            var temp = decimalRepresentation[i].toString(2);
            if (temp.length < 8) {
                for (var j = 0; j < 8 - temp.length; j++) {
                    str += '0';
                }
            }
            toBinary[i] = str + temp;
        }
        return toBinary;
    };
    /**
     * Polynomial division
     */
    ErrorCorrectionCodewords.prototype.divide = function () {
        var messagePolynom = {};
        for (var i = 0; i < this.decimalValue.length; i++) {
            messagePolynom[this.decimalValue.length - 1 - i] = this.decimalValue[i];
        }
        var generatorPolynom = {};
        for (var i = 0; i < this.gx.length; i++) {
            generatorPolynom[this.gx.length - 1 - i] = this.findElement(this.gx[i], this.alpha);
        }
        var tempMessagePolynom = {};
        for (var _i = 0, _a = Object.keys(messagePolynom); _i < _a.length; _i++) {
            var poly = _a[_i];
            tempMessagePolynom[Number(poly) + this.eccw] = messagePolynom[poly];
        }
        messagePolynom = tempMessagePolynom;
        var genLeadtermFactor = this.decimalValue.length + this.eccw - this.gx.length;
        tempMessagePolynom = {};
        for (var _b = 0, _c = Object.keys(generatorPolynom); _b < _c.length; _b++) {
            var poly = _c[_b];
            tempMessagePolynom[Number(poly) + genLeadtermFactor] = generatorPolynom[poly];
        }
        generatorPolynom = tempMessagePolynom;
        var leadTermSource = messagePolynom;
        for (var i = 0; i < Object.keys(messagePolynom).length; i++) {
            var largestExponent = this.findLargestExponent(leadTermSource);
            if (leadTermSource[largestExponent] === 0) {
                // First coefficient is already 0, simply remove it and continue
                delete leadTermSource[largestExponent];
            }
            else {
                var alphaNotation = this.convertToAlphaNotation(leadTermSource);
                var resPoly = this.multiplyGeneratorPolynomByLeadterm(generatorPolynom, alphaNotation[this.findLargestExponent(alphaNotation)], i);
                resPoly = this.convertToDecNotation(resPoly);
                resPoly = this.xORPolynoms(leadTermSource, resPoly);
                leadTermSource = resPoly;
            }
        }
        //Add the error correction word count according to polynomial values.
        this.eccw = Object.keys(leadTermSource).length;
        var returnValue = [];
        for (var _d = 0, _e = Object.keys(leadTermSource); _d < _e.length; _d++) {
            var temp = _e[_d];
            returnValue.push(leadTermSource[temp]);
        }
        return returnValue.reverse();
    };
    ErrorCorrectionCodewords.prototype.xORPolynoms = function (messagePolynom, resPolynom) {
        var resultPolynom = {};
        var longPoly = {};
        var shortPoly = {};
        if (Object.keys(messagePolynom).length >= Object.keys(resPolynom).length) {
            longPoly = messagePolynom;
            shortPoly = resPolynom;
        }
        else {
            longPoly = resPolynom;
            shortPoly = messagePolynom;
        }
        var messagePolyExponent = this.findLargestExponent(messagePolynom);
        var shortPolyExponent = this.findLargestExponent(shortPoly);
        var i = Object.keys(longPoly).length - 1;
        for (var _i = 0, _a = Object.keys(longPoly); _i < _a.length; _i++) {
            var longPolySingle = _a[_i];
            resultPolynom[messagePolyExponent - i] = longPoly[longPolySingle] ^ (Object.keys(shortPoly).length > i ?
                shortPoly[shortPolyExponent - i] : 0);
            i--;
        }
        var resultPolyExponent = this.findLargestExponent(resultPolynom);
        delete resultPolynom[resultPolyExponent];
        return resultPolynom;
    };
    ErrorCorrectionCodewords.prototype.multiplyGeneratorPolynomByLeadterm = function (genPolynom, leadTermCoefficient, lowerExponentBy) {
        var tempPolynom = {};
        for (var _i = 0, _a = Object.keys(genPolynom); _i < _a.length; _i++) {
            var treeNode = _a[_i];
            tempPolynom[Number(treeNode) - lowerExponentBy] = (genPolynom[treeNode] + leadTermCoefficient) % 255;
        }
        return tempPolynom;
    };
    ErrorCorrectionCodewords.prototype.convertToDecNotation = function (poly) {
        var tempPolynom = {};
        for (var _i = 0, _a = Object.keys(poly); _i < _a.length; _i++) {
            var treeNode = _a[_i];
            tempPolynom[treeNode] = this.getIntValFromAlphaExp(poly[treeNode], this.alpha);
        }
        return tempPolynom;
    };
    ErrorCorrectionCodewords.prototype.convertToAlphaNotation = function (polynom) {
        var tempPolynom = {};
        for (var _i = 0, _a = Object.keys(polynom); _i < _a.length; _i++) {
            var poly = _a[_i];
            if (polynom[poly] !== 0) {
                tempPolynom[poly] = this.findElement(polynom[poly], this.alpha);
            }
        }
        return tempPolynom;
    };
    ErrorCorrectionCodewords.prototype.findLargestExponent = function (polynom) {
        var largCo = 0;
        for (var _i = 0, _a = Object.keys(polynom); _i < _a.length; _i++) {
            var poly = _a[_i];
            if (Number(poly) > largCo) {
                largCo = Number(poly);
            }
        }
        return largCo;
    };
    ErrorCorrectionCodewords.prototype.getIntValFromAlphaExp = function (element, alpha) {
        if (element > 255) {
            element = element - 255;
        }
        return alpha[element];
    };
    /**
     * Find the element in the alpha
     */
    ErrorCorrectionCodewords.prototype.findElement = function (element, alpha) {
        var j;
        for (j = 0; j < alpha.length; j++) {
            if (element === alpha[j]) {
                break;
            }
        }
        return j;
    };
    /**
     * Gets g(x) of the element
     */
    ErrorCorrectionCodewords.prototype.getElement = function (element, alpha) {
        var gx = [element.length];
        for (var i = 0; i < element.length; i++) {
            if (element[i] > 255) {
                element[i] = element[i] - 255;
            }
            gx[i] = alpha[element[i]];
        }
        return gx;
    };
    return ErrorCorrectionCodewords;
}());

/**
 * Qrcode used to calculate the Qrcode control
 */
var QRCode = /** @__PURE__ @class */ (function () {
    function QRCode() {
        this.mVersion = QRCodeVersion.Version01;
        this.mInputMode = 'NumericMode';
        this.validInput = true;
        /**
         * Total bits required in mixing mode.
         */
        this.totalBits = 0;
        /**
         * Holds the data of Function Pattern.
         */
        this.mModuleValue = [];
        this.mDataAllocationValues = [[], []];
        /**
         * Set version for mixing mode.
         */
        this.mixVersionERC = true;
        /**
         * Data to be currently encoded in Mixing Mode
         */
        this.mixExecutablePart = null;
        /**
         * Count of mixing mode blocks.
         */
        this.mixDataCount = 0;
        /**
         * Holds the Number of Modules.
         */
        this.mNoOfModules = 21;
        /**
         * Check if User Mentioned Mode
         */
        this.mIsUserMentionedMode = false;
        this.chooseDefaultMode = false;
        this.mixRemainingPart = null;
        this.isXdimension = false;
        this.mXDimension = 1;
        this.mIsEci = false;
        /** @private */
        this.mIsUserMentionedErrorCorrectionLevel = false;
        this.mEciAssignmentNumber = 3;
        /** @private */
        this.mIsUserMentionedVersion = false;
        /** @private */
        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Low;
        this.textList = [];
        this.mode = [];
    }
    Object.defineProperty(QRCode.prototype, "XDimension", {
        /** @private */
        get: function () {
            return this.mXDimension;
        },
        /** @private */
        set: function (value) {
            this.mXDimension = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QRCode.prototype, "inputMode", {
        get: function () {
            return this.mInputMode;
        },
        set: function (value) {
            this.mInputMode = value;
            this.mIsUserMentionedMode = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QRCode.prototype, "version", {
        /** @private */
        get: function () {
            return this.mVersion;
        },
        /** @private */
        set: function (value) {
            this.mVersion = value;
            this.mNoOfModules = (this.mVersion - 1) * 4 + 21;
            if (value !== QRCodeVersion.Auto) {
                this.mIsUserMentionedVersion = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    QRCode.prototype.getBaseAttributes = function (width, height, offSetX, offsetY, color, strokeColor) {
        var options = {
            width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
        };
        return options;
    };
    QRCode.prototype.getInstance = function (id) {
        var barCode = document.getElementById(id);
        var barcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    };
    QRCode.prototype.drawImage = function (canvas, options, labelPosition, barcodeSize, endValue, textRender) {
        // render image for the qrcode generator
        var barcodeRenderer = this.getInstance(canvas.id);
        for (var i = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas, options[i]);
        }
    };
    /** @private */
    QRCode.prototype.draw = function (char, canvas, height, width, margin, displayText, mode, foreColor) {
        this.isSvgMode = mode;
        this.generateValues();
        if (this.validInput) {
            var size = void 0;
            var actualWidth = width - (margin.left + margin.right);
            var actualHeight = height - (margin.top + margin.bottom);
            size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
            var dimension = this.XDimension;
            var quietZone = QuietZone.All;
            var x = (actualWidth >= size) ? (actualWidth - size) / 2 : 0;
            var y = (actualHeight >= size) ? (actualHeight - size) / 2 : 0;
            y += margin.top;
            x += margin.left;
            var textBounds = this.drawDisplayText(canvas, x, y, size, actualHeight, displayText, char, margin, foreColor);
            actualHeight -= (textBounds.height);
            if (displayText.margin.bottom > 0) {
                if (displayText.position === 'Top') {
                    y += (displayText.margin.bottom);
                    actualHeight -= (displayText.margin.bottom);
                }
                else {
                    actualHeight -= displayText.margin.bottom;
                }
            }
            if (displayText.margin.top > 0) {
                if (displayText.position === 'Top') {
                    y += (displayText.margin.top);
                    actualHeight -= (displayText.margin.top);
                }
                else {
                    actualHeight -= displayText.margin.top;
                }
            }
            size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
            var moduleCount = this.mNoOfModules + 2 * quietZone + 1;
            dimension = size / moduleCount;
            this.isXdimension = true;
            width = (this.mNoOfModules + 2 * quietZone) * dimension;
            height = (this.mNoOfModules + 2 * quietZone) * dimension;
            var w = this.mNoOfModules + 2 * quietZone;
            var h = this.mNoOfModules + 2 * quietZone;
            var optionsCollection = [];
            for (var i = 0; i < w; i++) {
                for (var j = 0; j < h; j++) {
                    var color = void 0;
                    color = (this.mModuleValue[i][j].isBlack) ? foreColor : 'white';
                    if (this.mDataAllocationValues[j][i].isFilled) {
                        if (this.mDataAllocationValues[j][i].isBlack) {
                            color = foreColor;
                        }
                    }
                    if (color !== 'white') {
                        var options = void 0;
                        options = this.getBaseAttributes(dimension, dimension, x, displayText.position === 'Bottom' ? y : y + textBounds.height / 2, color);
                        optionsCollection.push(options);
                    }
                    x = x + dimension;
                }
                y = y + dimension;
                x = ((actualWidth >= size) ? (actualWidth - size) / 2 : 0) + margin.left;
            }
            this.drawImage(canvas, optionsCollection);
            this.mModuleValue = undefined;
            this.mDataAllocationValues = undefined;
            return true;
        }
        else {
            return false;
        }
    };
    QRCode.prototype.drawText = function (canvas, options) {
        var barcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas, options);
    };
    QRCode.prototype.drawDisplayText = function (canvas, x, y, width, height, text, value, margin, foreColor) {
        var displayText = text;
        createMeasureElements();
        var options = this.getBaseAttributes(width, height, x, y, 'black');
        options.string = (displayText.text ? displayText.text : value);
        options.color = foreColor;
        options.fontStyle = displayText.font;
        options.stringSize = displayText.size;
        options.visibility = displayText.visibility;
        var textSize = measureText(options);
        var textHeight = (textSize.height / 2) + 2;
        options.height = textHeight;
        options.x = ((x + width / 2) - textSize.width / 2) + displayText.margin.left - displayText.margin.right;
        if (text.position === 'Bottom') {
            if (text.margin.top > 0) {
                options.y = ((y + height));
            }
            if (text.margin.bottom > 0) {
                options.y = ((y + height)) - displayText.margin.bottom;
            }
            else {
                if (margin.top < 10) {
                    options.y = height + textSize.height / 2;
                }
                else {
                    options.y = height + margin.top;
                }
            }
        }
        else {
            if (text.margin.top > 0) {
                options.y = y + text.margin.top + textSize.height / 2;
            }
            else {
                options.y = y + textSize.height / 2;
            }
        }
        if (text.visibility) {
            this.drawText(canvas, options);
        }
        return options;
    };
    QRCode.prototype.generateValues = function () {
        this.mQrBarcodeValues = new PdfQRBarcodeValues(this.mVersion, this.mErrorCorrectionLevel);
        this.initialize();
        this.mQrBarcodeValues = new PdfQRBarcodeValues(this.mVersion, this.mErrorCorrectionLevel);
        for (var i = 0; i < this.mNoOfModules; i++) {
            // tslint:disable-next-line:no-any
            this.mModuleValue.push([0]);
            for (var j = 0; j < this.mNoOfModules; j++) {
                this.mModuleValue[i][j] = new ModuleValue();
            }
        }
        this.drawPDP(0, 0);
        this.drawPDP(this.mNoOfModules - 7, 0);
        this.drawPDP(0, this.mNoOfModules - 7);
        this.drawTimingPattern();
        if (this.mVersion !== 1) {
            var allignCoOrdinates = this.getAlignmentPatternCoOrdinates();
            for (var _i = 0, _a = Object.keys(allignCoOrdinates); _i < _a.length; _i++) {
                var i = _a[_i];
                for (var _b = 0, _c = Object.keys(allignCoOrdinates); _b < _c.length; _b++) {
                    var j = _c[_b];
                    if (!this.mModuleValue[allignCoOrdinates[i]][allignCoOrdinates[j]].isPdp) {
                        this.drawAlignmentPattern(allignCoOrdinates[i], allignCoOrdinates[j]);
                    }
                }
            }
        }
        this.allocateFormatAndVersionInformation();
        var encodeData = null;
        encodeData = this.encodeData();
        this.dataAllocationAndMasking(encodeData);
        this.drawFormatInformation();
        this.addQuietZone();
        this.mQrBarcodeValues.FormatInformation = undefined;
        this.mQrBarcodeValues.NumberOfDataCodeWord = undefined;
        this.mQrBarcodeValues.NumberOfErrorCorrectingCodeWords = undefined;
        this.mQrBarcodeValues.VersionInformation = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityHigh = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityLow = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityMedium = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityQuartile = undefined;
        this.mQrBarcodeValues.binaryDataCapacityHigh = undefined;
        this.mQrBarcodeValues.dataCapacityValues = undefined;
        this.mQrBarcodeValues.endValues = undefined;
        this.mQrBarcodeValues.dataCapacityValues = undefined;
        this.mQrBarcodeValues = undefined;
        this.mIsUserMentionedVersion = undefined;
        this.mVersion = undefined;
    };
    /**
     * Draw the PDP in the given location
     * @param x - The x co-ordinate.
     * @param y - The y co-ordinate.
     */
    QRCode.prototype.drawPDP = function (x, y) {
        var i;
        var j;
        for (i = x, j = y; i < x + 7; i++, j++) {
            this.mModuleValue[i][y].isBlack = true;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;
            this.mModuleValue[i][y + 6].isBlack = true;
            this.mModuleValue[i][y + 6].isFilled = true;
            this.mModuleValue[i][y + 6].isPdp = true;
            if (y + 7 < this.mNoOfModules) {
                this.mModuleValue[i][y + 7].isBlack = false;
                this.mModuleValue[i][y + 7].isFilled = true;
                this.mModuleValue[i][y + 7].isPdp = true;
            }
            else if (y - 1 >= 0) {
                this.mModuleValue[i][y - 1].isBlack = false;
                this.mModuleValue[i][y - 1].isFilled = true;
                this.mModuleValue[i][y - 1].isPdp = true;
            }
            this.mModuleValue[x][j].isBlack = true;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;
            this.mModuleValue[x + 6][j].isBlack = true;
            this.mModuleValue[x + 6][j].isFilled = true;
            this.mModuleValue[x + 6][j].isPdp = true;
            if (x + 7 < this.mNoOfModules) {
                this.mModuleValue[x + 7][j].isBlack = false;
                this.mModuleValue[x + 7][j].isFilled = true;
                this.mModuleValue[x + 7][j].isPdp = true;
            }
            else if (x - 1 >= 0) {
                this.mModuleValue[x - 1][j].isBlack = false;
                this.mModuleValue[x - 1][j].isFilled = true;
                this.mModuleValue[x - 1][j].isPdp = true;
            }
        }
        if (x + 7 < this.mNoOfModules && y + 7 < this.mNoOfModules) {
            this.mModuleValue[x + 7][y + 7].isBlack = false;
            this.mModuleValue[x + 7][y + 7].isFilled = true;
            this.mModuleValue[x + 7][y + 7].isPdp = true;
        }
        else if (x + 7 < this.mNoOfModules && y + 7 >= this.mNoOfModules) {
            this.mModuleValue[x + 7][y - 1].isBlack = false;
            this.mModuleValue[x + 7][y - 1].isFilled = true;
            this.mModuleValue[x + 7][y - 1].isPdp = true;
        }
        else if (x + 7 >= this.mNoOfModules && y + 7 < this.mNoOfModules) {
            this.mModuleValue[x - 1][y + 7].isBlack = false;
            this.mModuleValue[x - 1][y + 7].isFilled = true;
            this.mModuleValue[x - 1][y + 7].isPdp = true;
        }
        x++;
        y++;
        for (i = x, j = y; i < x + 5; i++, j++) {
            this.mModuleValue[i][y].isBlack = false;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;
            this.mModuleValue[i][y + 4].isBlack = false;
            this.mModuleValue[i][y + 4].isFilled = true;
            this.mModuleValue[i][y + 4].isPdp = true;
            this.mModuleValue[x][j].isBlack = false;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;
            this.mModuleValue[x + 4][j].isBlack = false;
            this.mModuleValue[x + 4][j].isFilled = true;
            this.mModuleValue[x + 4][j].isPdp = true;
        }
        x++;
        y++;
        for (i = x, j = y; i < x + 3; i++, j++) {
            this.mModuleValue[i][y].isBlack = true;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;
            this.mModuleValue[i][y + 2].isBlack = true;
            this.mModuleValue[i][y + 2].isFilled = true;
            this.mModuleValue[i][y + 2].isPdp = true;
            this.mModuleValue[x][j].isBlack = true;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;
            this.mModuleValue[x + 2][j].isBlack = true;
            this.mModuleValue[x + 2][j].isFilled = true;
            this.mModuleValue[x + 2][j].isPdp = true;
        }
        this.mModuleValue[x + 1][y + 1].isBlack = true;
        this.mModuleValue[x + 1][y + 1].isFilled = true;
        this.mModuleValue[x + 1][y + 1].isPdp = true;
    };
    /**
     * Draw the Timing Pattern
     */
    QRCode.prototype.drawTimingPattern = function () {
        for (var i = 8; i < this.mNoOfModules - 8; i += 2) {
            this.mModuleValue[i][6].isBlack = true;
            this.mModuleValue[i][6].isFilled = true;
            this.mModuleValue[i + 1][6].isBlack = false;
            this.mModuleValue[i + 1][6].isFilled = true;
            this.mModuleValue[6][i].isBlack = true;
            this.mModuleValue[6][i].isFilled = true;
            this.mModuleValue[6][i + 1].isBlack = false;
            this.mModuleValue[6][i + 1].isFilled = true;
        }
        this.mModuleValue[this.mNoOfModules - 8][8].isBlack = true;
        this.mModuleValue[this.mNoOfModules - 8][8].isFilled = true;
    };
    /* tslint:disable */
    QRCode.prototype.initialize = function () {
        if (!this.mIsUserMentionedMode) {
            this.chooseDefaultMode = true;
        }
        var mode = 'NumericMode';
        for (var i = 0; i < this.text.length; i++) {
            if (this.text.charCodeAt(i) < 58 && this.text.charCodeAt(i) > 47) {
            }
            else if ((this.text.charCodeAt(i) < 91 && this.text.charCodeAt(i) > 64) ||
                this.text[i] === '$' || this.text[i] === '%' || this.text[i] === '*' ||
                this.text[i] === '+' || this.text[i] === '-' || this.text[i] === '.' ||
                this.text[i] === '/' || this.text[i] === ':' || this.text[i] === ' ') {
                mode = 'AlphaNumericMode';
            }
            else if ((this.text.charCodeAt(i) >= 65377 && this.text.charCodeAt(i) <= 65439) ||
                (this.text.charCodeAt(i) >= 97 && this.text.charCodeAt(i) <= 122)) {
                mode = 'BinaryMode';
                break;
            }
            else {
                mode = 'BinaryMode';
                this.mIsEci = true;
                break;
            }
        }
        if (this.mIsUserMentionedMode) {
            if (mode !== this.mInputMode) {
                if (((mode === 'AlphaNumericMode' || mode === 'BinaryMode') && this.mInputMode === 'NumericMode')
                    || (mode === 'BinaryMode' && this.mInputMode === 'AlphaNumericMode')) {
                    this.validInput = false;
                    if (mode !== this.mInputMode) {
                        if (((mode === 'AlphaNumericMode' || mode === 'BinaryMode') && this.mInputMode === 'NumericMode')
                            || (mode === 'BinaryMode' && this.mInputMode === 'AlphaNumericMode')) {
                            this.validInput = false;
                        }
                    }
                }
            }
        }
        this.inputMode = mode;
        if (this.mIsEci === true) {
            for (var i = 0; i < this.text.length; i++) {
                if (this.text.charCodeAt(i) >= 32 && this.text.charCodeAt(i) <= 255) {
                    continue;
                }
            }
        }
        if (this.mixVersionERC) {
            if (!this.mIsUserMentionedVersion || (this.mVersion & QRCodeVersion.Auto)) {
                var dataCapacityOfVersions = null;
                if (this.mIsUserMentionedErrorCorrectionLevel) {
                    switch (this.mInputMode) {
                        case 'NumericMode':
                            switch (this.mErrorCorrectionLevel) {
                                case 7:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityLow;
                                    break;
                                case 15:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityMedium;
                                    break;
                                case 25:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityQuartile;
                                    break;
                                case 30:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityHigh;
                                    break;
                            }
                            break;
                        case 'AlphaNumericMode':
                            switch (this.mErrorCorrectionLevel) {
                                case 7:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityLow;
                                    break;
                                case 15:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityMedium;
                                    break;
                                case 25:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityQuartile;
                                    break;
                                case 30:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityHigh;
                                    break;
                            }
                            break;
                        case 'BinaryMode':
                            switch (this.mErrorCorrectionLevel) {
                                case 7:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityLow;
                                    break;
                                case 15:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityMedium;
                                    break;
                                case 25:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityQuartile;
                                    break;
                                case 30:
                                    dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityHigh;
                                    break;
                            }
                            break;
                    }
                }
                else {
                    this.mErrorCorrectionLevel = ErrorCorrectionLevel.Medium;
                    switch (this.mInputMode) {
                        case 'NumericMode':
                            dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityMedium;
                            break;
                        case 'AlphaNumericMode':
                            dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityMedium;
                            break;
                        case 'BinaryMode':
                            dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityMedium;
                            break;
                    }
                }
                var i = void 0;
                for (i = 0; i < dataCapacityOfVersions.length; i++) {
                    if (dataCapacityOfVersions[i] > this.text.length) {
                        break;
                    }
                }
                this.version = i + 1;
            }
            else if (this.mIsUserMentionedVersion) {
                if (this.mIsUserMentionedErrorCorrectionLevel) {
                    var capacity = 0;
                    if (this.mInputMode === 'AlphaNumericMode') {
                        capacity = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    }
                    else if (this.mInputMode === 'NumericMode') {
                        capacity = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    }
                    if (this.mInputMode === 'BinaryMode') {
                        capacity = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    }
                    if (capacity < this.text.length) {
                        if (!this.chooseDefaultMode) {
                            this.validInput = false;
                        }
                        else {
                            this.mixVersionERC = false;
                        }
                    }
                }
                else {
                    var capacityLow = 0;
                    var capacityMedium = 0;
                    var capacityQuartile = 0;
                    var capacityHigh = 0;
                    if (this.mInputMode === 'AlphaNumericMode') {
                        capacityLow = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.High);
                    }
                    else if (this.mInputMode === 'NumericMode') {
                        capacityLow = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.High);
                    }
                    else if (this.mInputMode === 'BinaryMode') {
                        capacityLow = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.High);
                    }
                    if (capacityHigh > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.High;
                    }
                    else if (capacityQuartile > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Quartile;
                    }
                    else if (capacityMedium > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Medium;
                    }
                    else if (capacityLow > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Low;
                    }
                    else {
                        this.validInput = false;
                    }
                }
            }
        }
    };
    /* tslint:enable */
    /**
     * Adds quietzone to the QR Barcode.
     */
    QRCode.prototype.addQuietZone = function () {
        var quietZone = QuietZone.All;
        var w = this.mNoOfModules + 2 * quietZone;
        var h = this.mNoOfModules + 2 * quietZone;
        var tempValue1 = [];
        var tempValue2 = [];
        for (var i = 0; i < w; i++) {
            // tslint:disable-next-line:no-any
            tempValue1.push([0]);
            // tslint:disable-next-line:no-any
            tempValue2.push([0]);
            for (var j = 0; j < h; j++) {
                tempValue1[i][j] = new ModuleValue();
                tempValue2[i][j] = new ModuleValue();
            }
        }
        // Top quietzone.
        for (var i = 0; i < h; i++) {
            tempValue1[0][i] = new ModuleValue();
            tempValue1[0][i].isBlack = false;
            tempValue1[0][i].isFilled = false;
            tempValue1[0][i].isPdp = false;
            tempValue2[0][i] = new ModuleValue();
            tempValue2[0][i].isBlack = false;
            tempValue2[0][i].isFilled = false;
            tempValue2[0][i].isPdp = false;
        }
        for (var i = quietZone; i < w - quietZone; i++) {
            // Left quietzone.
            tempValue1[i][0] = new ModuleValue();
            tempValue1[i][0].isBlack = false;
            tempValue1[i][0].isFilled = false;
            tempValue1[i][0].isPdp = false;
            tempValue2[i][0] = new ModuleValue();
            tempValue2[i][0].isBlack = false;
            tempValue2[i][0].isFilled = false;
            tempValue2[i][0].isPdp = false;
            for (var j = quietZone; j < h - quietZone; j++) {
                tempValue1[i][j] = this.mModuleValue[i - quietZone][j - quietZone];
                tempValue2[i][j] = this.mDataAllocationValues[i - quietZone][j - quietZone];
            }
            // Right quietzone.
            tempValue1[i][h - quietZone] = new ModuleValue();
            tempValue1[i][h - quietZone].isBlack = false;
            tempValue1[i][h - quietZone].isFilled = false;
            tempValue1[i][h - quietZone].isPdp = false;
            tempValue2[i][h - quietZone] = new ModuleValue();
            tempValue2[i][h - quietZone].isBlack = false;
            tempValue2[i][h - quietZone].isFilled = false;
            tempValue2[i][h - quietZone].isPdp = false;
        }
        //Bottom quietzone.
        for (var i = 0; i < h; i++) {
            tempValue1[w - quietZone][i] = new ModuleValue();
            tempValue1[w - quietZone][i].isBlack = false;
            tempValue1[w - quietZone][i].isFilled = false;
            tempValue1[w - quietZone][i].isPdp = false;
            tempValue2[w - quietZone][i] = new ModuleValue();
            tempValue2[w - quietZone][i].isBlack = false;
            tempValue2[w - quietZone][i].isFilled = false;
            tempValue2[w - quietZone][i].isPdp = false;
        }
        this.mModuleValue = tempValue1;
        this.mDataAllocationValues = tempValue2;
    };
    /**
     * Draw the Format Information
     */
    QRCode.prototype.drawFormatInformation = function () {
        var formatInformation = this.mQrBarcodeValues.FormatInformation;
        var count = 0;
        for (var i = 0; i < 7; i++) {
            //Draw from 14 to 8
            if (i === 6) {
                this.mModuleValue[i + 1][8].isBlack = formatInformation[count] === 1 ? true : false;
            }
            else {
                this.mModuleValue[i][8].isBlack = formatInformation[count] === 1 ? true : false;
            }
            this.mModuleValue[8][this.mNoOfModules - i - 1].isBlack = formatInformation[count++] === 1 ? true : false;
        }
        count = 14;
        for (var i = 0; i < 7; i++) {
            //Draw from 0 to 6
            if (i === 6) {
                this.mModuleValue[8][i + 1].isBlack = formatInformation[count] === 1 ? true : false;
            }
            else {
                this.mModuleValue[8][i].isBlack = formatInformation[count] === 1 ? true : false;
            }
            this.mModuleValue[this.mNoOfModules - i - 1][8].isBlack = formatInformation[count--] === 1 ? true : false;
        }
        //Draw 7
        this.mModuleValue[8][8].isBlack = formatInformation[7] === 1 ? true : false;
        this.mModuleValue[8][this.mNoOfModules - 8].isBlack = formatInformation[7] === 1 ? true : false;
    };
    /**
     * Allocates the Encoded Data and then Mask
     * @param Data - Encoded Data
     */
    /* tslint:disable */
    QRCode.prototype.dataAllocationAndMasking = function (data) {
        this.mDataAllocationValues = [];
        for (var i = 0; i < this.mNoOfModules; i++) {
            // tslint:disable-next-line:no-any
            this.mDataAllocationValues.push([0]);
            for (var j = 0; j < this.mNoOfModules; j++) {
                this.mDataAllocationValues[i][j] = new ModuleValue();
            }
        }
        var point = 0;
        for (var i = this.mNoOfModules - 1; i >= 0; i -= 2) {
            for (var j = this.mNoOfModules - 1; j >= 0; j--) {
                if (!(this.mModuleValue[i][j].isFilled && this.mModuleValue[i - 1][j].isFilled)) {
                    if (!this.mModuleValue[i][j].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i][j].isBlack = data[point++];
                        }
                        if ((i + j) % 3 === 0) {
                            this.mDataAllocationValues[i][j].isBlack = (this.mDataAllocationValues[i][j].isBlack) ? true : false;
                        }
                        else {
                            this.mDataAllocationValues[i][j].isBlack = (this.mDataAllocationValues[i][j].isBlack) ? false : true;
                        }
                        this.mDataAllocationValues[i][j].isFilled = true;
                    }
                    if (!this.mModuleValue[i - 1][j].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i - 1][j].isBlack = data[point++];
                        }
                        if ((i - 1 + j) % 3 === 0) {
                            this.mDataAllocationValues[i - 1][j].isBlack = (this.mDataAllocationValues[i - 1][j].isBlack) ? true : false;
                        }
                        else {
                            this.mDataAllocationValues[i - 1][j].isBlack = (this.mDataAllocationValues[i - 1][j].isBlack) ? false : true;
                        }
                        this.mDataAllocationValues[i - 1][j].isFilled = true;
                    }
                }
            }
            i -= 2;
            if (i === 6) {
                i--;
            }
            for (var k = 0; k < this.mNoOfModules; k++) {
                if (!(this.mModuleValue[i][k].isFilled && this.mModuleValue[i - 1][k].isFilled)) {
                    if (!this.mModuleValue[i][k].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i][k].isBlack = data[point++];
                        }
                        if ((i + k) % 3 !== 0) {
                            this.mDataAllocationValues[i][k].isBlack = (this.mDataAllocationValues[i][k].isBlack) ? false : true;
                        }
                        else {
                            this.mDataAllocationValues[i][k].isBlack = (this.mDataAllocationValues[i][k].isBlack) ? true : false;
                        }
                        this.mDataAllocationValues[i][k].isFilled = true;
                    }
                    if (!this.mModuleValue[i - 1][k].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i - 1][k].isBlack = data[point++];
                        }
                        if ((i - 1 + k) % 3 !== 0) {
                            this.mDataAllocationValues[i - 1][k].isBlack = (this.mDataAllocationValues[i - 1][k].isBlack) ? false : true;
                        }
                        else {
                            this.mDataAllocationValues[i - 1][k].isBlack = (this.mDataAllocationValues[i - 1][k].isBlack) ? true : false;
                        }
                        this.mDataAllocationValues[i - 1][k].isFilled = true;
                    }
                }
            }
        }
        for (var i = 0; i < this.mNoOfModules; i++) {
            for (var j = 0; j < this.mNoOfModules; j++) {
                if (!this.mModuleValue[i][j].isFilled) {
                    var flag = this.mDataAllocationValues[i][j].isBlack;
                    if (flag) {
                        this.mDataAllocationValues[i][j].isBlack = false;
                    }
                    else {
                        this.mDataAllocationValues[i][j].isBlack = true;
                    }
                }
            }
        }
    };
    /* tslint:enable */
    /**
     * Allocates Format and Version Information
     */
    QRCode.prototype.allocateFormatAndVersionInformation = function () {
        for (var i = 0; i < 9; i++) {
            this.mModuleValue[8][i].isFilled = true;
            this.mModuleValue[i][8].isFilled = true;
        }
        for (var i = this.mNoOfModules - 8; i < this.mNoOfModules; i++) {
            this.mModuleValue[8][i].isFilled = true;
            this.mModuleValue[i][8].isFilled = true;
        }
        if (this.mVersion > 6) {
            var versionInformation = this.mQrBarcodeValues.VersionInformation;
            var count = 0;
            for (var i = 0; i < 6; i++) {
                for (var j = 2; j >= 0; j--) {
                    this.mModuleValue[i][this.mNoOfModules - 9 - j].isBlack = versionInformation[count] === 1 ? true : false;
                    this.mModuleValue[i][this.mNoOfModules - 9 - j].isFilled = true;
                    this.mModuleValue[this.mNoOfModules - 9 - j][i].isBlack = versionInformation[count++] === 1 ? true : false;
                    this.mModuleValue[this.mNoOfModules - 9 - j][i].isFilled = true;
                }
            }
        }
    };
    /**
     * Draw the Alignment Pattern in the given location
     * @param x - The x co-ordinate
     * @param y - The y co-ordinate
     */
    QRCode.prototype.drawAlignmentPattern = function (x, y) {
        var i;
        var j;
        for (i = x - 2, j = y - 2; i < x + 3; i++, j++) {
            this.mModuleValue[i][y - 2].isBlack = true;
            this.mModuleValue[i][y - 2].isFilled = true;
            this.mModuleValue[i][y + 2].isBlack = true;
            this.mModuleValue[i][y + 2].isFilled = true;
            this.mModuleValue[x - 2][j].isBlack = true;
            this.mModuleValue[x - 2][j].isFilled = true;
            this.mModuleValue[x + 2][j].isBlack = true;
            this.mModuleValue[x + 2][j].isFilled = true;
        }
        for (i = x - 1, j = y - 1; i < x + 2; i++, j++) {
            this.mModuleValue[i][y - 1].isBlack = false;
            this.mModuleValue[i][y - 1].isFilled = true;
            this.mModuleValue[i][y + 1].isBlack = false;
            this.mModuleValue[i][y + 1].isFilled = true;
            this.mModuleValue[x - 1][j].isBlack = false;
            this.mModuleValue[x - 1][j].isFilled = true;
            this.mModuleValue[x + 1][j].isBlack = false;
            this.mModuleValue[x + 1][j].isFilled = true;
        }
        this.mModuleValue[x][y].isBlack = true;
        this.mModuleValue[x][y].isFilled = true;
    };
    /**
     * Gets the Allignment pattern coordinates of the current version.
     */
    QRCode.prototype.getAlignmentPatternCoOrdinates = function () {
        var allign = null;
        switch ((this.mVersion)) {
            case 2:
                allign = [6, 18];
                break;
            case 3:
                allign = [6, 22];
                break;
            case 4:
                allign = [6, 26];
                break;
            case 5:
                allign = [6, 30];
                break;
            case 6:
                allign = [6, 34];
                break;
            case 7:
                allign = [6, 22, 38];
                break;
            case 8:
                allign = [6, 24, 42];
                break;
            case 9:
                allign = [6, 26, 46];
                break;
            case 10:
                allign = [6, 28, 50];
                break;
            case 11:
                allign = [6, 30, 54];
                break;
            case 12:
                allign = [6, 32, 58];
                break;
            case 13:
                allign = [6, 34, 62];
                break;
            case 14:
                allign = [6, 26, 46, 66];
                break;
            case 15:
                allign = [6, 26, 48, 70];
                break;
            case 16:
                allign = [6, 26, 50, 74];
                break;
            case 17:
                allign = [6, 30, 54, 78];
                break;
            case 18:
                allign = [6, 30, 56, 82];
                break;
            case 19:
                allign = [6, 30, 58, 86];
                break;
            case 20:
                allign = [6, 34, 62, 90];
                break;
            case 21:
                allign = [6, 28, 50, 72, 94];
                break;
            case 22:
                allign = [6, 26, 50, 74, 98];
                break;
            case 23:
                allign = [6, 30, 54, 78, 102];
                break;
            case 24:
                allign = [6, 28, 54, 80, 106];
                break;
            case 25:
                allign = [6, 32, 58, 84, 110];
                break;
            case 26:
                allign = [6, 30, 58, 86, 114];
                break;
            case 27:
                allign = [6, 34, 62, 90, 118];
                break;
            case 28:
                allign = [6, 26, 50, 74, 98, 122];
                break;
            case 29:
                allign = [6, 30, 54, 78, 102, 126];
                break;
            case 30:
                allign = [6, 26, 52, 78, 104, 130];
                break;
            case 31:
                allign = [6, 30, 56, 82, 108, 134];
                break;
            case 32:
                allign = [6, 34, 60, 86, 112, 138];
                break;
            case 33:
                allign = [6, 30, 58, 86, 114, 142];
                break;
            case 34:
                allign = [6, 34, 62, 90, 118, 146];
                break;
            case 35:
                allign = [6, 30, 54, 78, 102, 126, 150];
                break;
            case 36:
                allign = [6, 24, 50, 76, 102, 128, 154];
                break;
            case 37:
                allign = [6, 28, 54, 80, 106, 132, 158];
                break;
            case 38:
                allign = [6, 32, 58, 84, 110, 136, 162];
                break;
            case 39:
                allign = [6, 26, 54, 82, 110, 138, 166];
                break;
            case 40:
                allign = [6, 30, 58, 86, 114, 142, 170];
                break;
        }
        return allign;
    };
    /**
     * Encode the Input Data
     */
    /* tslint:disable */
    QRCode.prototype.encodeData = function () {
        var encodeData = [];
        switch (this.mInputMode) {
            case 'NumericMode':
                encodeData.push(false);
                encodeData.push(false);
                encodeData.push(false);
                encodeData.push(true);
                break;
            case 'AlphaNumericMode':
                encodeData.push(false);
                encodeData.push(false);
                encodeData.push(true);
                encodeData.push(false);
                break;
            case 'BinaryMode':
                if (this.mIsEci) {
                    //Add ECI Mode Indicator
                    encodeData.push(false);
                    encodeData.push(true);
                    encodeData.push(true);
                    encodeData.push(true);
                    //Add ECI assignment number
                    var numberInBool = this.stringToBoolArray(this.mEciAssignmentNumber.toString(), 8);
                    for (var _i = 0, _a = Object.keys(numberInBool); _i < _a.length; _i++) {
                        var x = _a[_i];
                        encodeData.push(numberInBool[x]);
                    }
                }
                encodeData.push(false);
                encodeData.push(true);
                encodeData.push(false);
                encodeData.push(false);
                break;
        }
        var numberOfBitsInCharacterCountIndicator = 0;
        if (this.mVersion < 10) {
            switch (this.mInputMode) {
                case 'NumericMode':
                    numberOfBitsInCharacterCountIndicator = 10;
                    break;
                case 'AlphaNumericMode':
                    numberOfBitsInCharacterCountIndicator = 9;
                    break;
                case 'BinaryMode':
                    numberOfBitsInCharacterCountIndicator = 8;
                    break;
            }
        }
        else if (this.mVersion < 27) {
            switch (this.mInputMode) {
                case 'NumericMode':
                    numberOfBitsInCharacterCountIndicator = 12;
                    break;
                case 'AlphaNumericMode':
                    numberOfBitsInCharacterCountIndicator = 11;
                    break;
                case 'BinaryMode':
                    numberOfBitsInCharacterCountIndicator = 16;
                    break;
            }
        }
        else {
            switch (this.mInputMode) {
                case 'NumericMode':
                    numberOfBitsInCharacterCountIndicator = 14;
                    break;
                case 'AlphaNumericMode':
                    numberOfBitsInCharacterCountIndicator = 13;
                    break;
                case 'BinaryMode':
                    numberOfBitsInCharacterCountIndicator = 16;
                    break;
            }
        }
        var numberOfBitsInCharacterCountIndicatorInBool = this.intToBoolArray(this.text.length, numberOfBitsInCharacterCountIndicator);
        for (var i = 0; i < numberOfBitsInCharacterCountIndicator; i++) {
            encodeData.push(numberOfBitsInCharacterCountIndicatorInBool[i]);
        }
        if (this.mInputMode === 'NumericMode') {
            var dataStringArray = this.text.split('');
            var number = '';
            for (var i = 0; i < dataStringArray.length; i++) {
                var numberInBool = void 0;
                number += dataStringArray[i];
                if (i % 3 === 2 && i !== 0 || i === dataStringArray.length - 1) {
                    if (number.toString().length === 3) {
                        numberInBool = this.stringToBoolArray(number, 10);
                    }
                    else if (number.toString().length === 2) {
                        numberInBool = this.stringToBoolArray(number, 7);
                    }
                    else {
                        numberInBool = this.stringToBoolArray(number, 4);
                    }
                    number = '';
                    for (var _b = 0, _c = Object.keys(numberInBool); _b < _c.length; _b++) {
                        var x = _c[_b];
                        encodeData.push(numberInBool[x]);
                    }
                }
            }
        }
        else if (this.mInputMode === 'AlphaNumericMode') {
            var dataStringArray = this.text.split('');
            var numberInString = '';
            var number = 0;
            for (var i = 0; i < dataStringArray.length; i++) {
                var numberInBool = void 0;
                numberInString += dataStringArray[i];
                if (i % 2 === 0 && i + 1 !== dataStringArray.length) {
                    number = 45 * this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                }
                if (i % 2 === 1 && i !== 0) {
                    number += this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                    numberInBool = this.intToBoolArray(number, 11);
                    number = 0;
                    for (var _d = 0, _e = Object.keys(numberInBool); _d < _e.length; _d++) {
                        var x = _e[_d];
                        encodeData.push(numberInBool[x]);
                    }
                    numberInString = null;
                }
                if (i !== 1 && numberInString !== null) {
                    if (i + 1 === dataStringArray.length && numberInString.length === 1) {
                        number = this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                        numberInBool = this.intToBoolArray(number, 6);
                        number = 0;
                        for (var _f = 0, _g = Object.keys(numberInBool); _f < _g.length; _f++) {
                            var x = _g[_f];
                            encodeData.push(numberInBool[x]);
                        }
                    }
                }
            }
        }
        else if (this.mInputMode === 'BinaryMode') {
            var dataStringArray = this.text.split('');
            for (var i = 0; i < dataStringArray.length; i++) {
                var number = 0;
                if ((this.text.charCodeAt(i) >= 32 && this.text.charCodeAt(i) <= 126) || (this.text.charCodeAt(i) >= 161 &&
                    this.text.charCodeAt(i) <= 255 || (this.text.charCodeAt(i) === 10 || this.text.charCodeAt(i) === 13))) {
                    number = dataStringArray[i].charCodeAt(0);
                }
                else if (this.text.charCodeAt(i) >= 65377 && this.text.charCodeAt(i) <= 65439) {
                    number = dataStringArray[i].charCodeAt(0) - 65216;
                }
                else if ((this.text.charCodeAt(i) >= 1025 && this.text.charCodeAt(i) <= 1119)) {
                    number = dataStringArray[i].charCodeAt(0) - 864;
                }
                else if ((this.text.charCodeAt(i) >= 260 && this.text.charCodeAt(i) <= 382)) {
                }
                else {
                    this.validInput = false;
                }
                var numberInBool = this.intToBoolArray(number, 8);
                for (var _h = 0, _j = Object.keys(numberInBool); _h < _j.length; _h++) {
                    var x = _j[_h];
                    encodeData.push(numberInBool[x]);
                }
            }
        }
        if (this.mixDataCount === 0) {
            for (var i = 0; i < 4; i++) {
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                }
                else {
                    encodeData.push(false);
                }
            }
            for (;;) { //Add Padding Bits
                if (encodeData.length % 8 === 0) {
                    break;
                }
                else {
                    encodeData.push(false);
                }
            }
            for (;;) {
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                }
                else {
                    encodeData.push(true);
                    encodeData.push(true);
                    encodeData.push(true);
                    encodeData.push(false);
                    encodeData.push(true);
                    encodeData.push(true);
                    encodeData.push(false);
                    encodeData.push(false);
                }
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                }
                else {
                    encodeData.push(false);
                    encodeData.push(false);
                    encodeData.push(false);
                    encodeData.push(true);
                    encodeData.push(false);
                    encodeData.push(false);
                    encodeData.push(false);
                    encodeData.push(true);
                }
            }
            var dataBits = this.mQrBarcodeValues.NumberOfDataCodeWord;
            var blocks = this.mQrBarcodeValues.NumberOfErrorCorrectionBlocks;
            var totalBlockSize = blocks[0];
            if (blocks.length === 6) {
                totalBlockSize = blocks[0] + blocks[3];
            }
            var ds1 = [];
            var testEncodeData = encodeData;
            if (blocks.length === 6) {
                var dataCodeWordLength = blocks[0] * blocks[2] * 8;
                testEncodeData = [];
                for (var i = 0; i < dataCodeWordLength; i++) {
                    testEncodeData.push(encodeData[i]);
                }
            }
            var dsOne = [];
            dsOne = this.createBlocks(testEncodeData, blocks[0]);
            for (var i = 0; i < blocks[0]; i++) {
                ds1[i] = this.splitCodeWord(dsOne, i, testEncodeData.length / 8 / blocks[0]);
            }
            if (blocks.length === 6) {
                testEncodeData = [];
                for (var i = blocks[0] * blocks[2] * 8; i < encodeData.length; i++) {
                    testEncodeData.push(encodeData[i]);
                }
                var dsTwo = [];
                dsTwo = this.createBlocks(testEncodeData, blocks[3]);
                for (var i = blocks[0], count_1 = 0; i < totalBlockSize; i++) {
                    ds1[i] = this.splitCodeWord(dsTwo, count_1++, testEncodeData.length / 8 / blocks[3]);
                }
            }
            encodeData = null;
            encodeData = [];
            for (var i = 0; i < 125; i++) {
                for (var k = 0; k < totalBlockSize; k++) {
                    for (var j = 0; j < 8; j++) {
                        if (i < ds1[k].length) {
                            encodeData.push(ds1[k][i][j] === '1' ? true : false);
                        }
                    }
                }
            }
            var ec = new ErrorCorrectionCodewords(this.mVersion, this.mErrorCorrectionLevel);
            dataBits = this.mQrBarcodeValues.NumberOfDataCodeWord;
            var eccw = this.mQrBarcodeValues.NumberOfErrorCorrectingCodeWords;
            blocks = this.mQrBarcodeValues.NumberOfErrorCorrectionBlocks;
            if (blocks.length === 6) {
                ec.DataBits = (dataBits - blocks[3] * blocks[5]) / blocks[0];
            }
            else {
                ec.DataBits = dataBits / blocks[0];
            }
            ec.Eccw = eccw / totalBlockSize;
            var polynomial = [];
            var count = 0;
            for (var i = 0; i < blocks[0]; i++) {
                ec.DC = ds1[count];
                polynomial[count++] = ec.getErcw();
            }
            if (blocks.length === 6) {
                ec.DataBits = (dataBits - blocks[0] * blocks[2]) / blocks[3];
                for (var i = 0; i < blocks[3]; i++) {
                    ec.DC = ds1[count];
                    polynomial[count++] = ec.getErcw();
                }
            }
            if (blocks.length !== 6) {
                for (var i = 0; i < polynomial[0].length; i++) {
                    for (var k = 0; k < blocks[0]; k++) {
                        for (var j = 0; j < 8; j++) {
                            if (i < polynomial[k].length) {
                                encodeData.push(polynomial[k][i][j] === '1' ? true : false);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < polynomial[0].length; i++) {
                    for (var k = 0; k < totalBlockSize; k++) {
                        for (var j = 0; j < 8; j++) {
                            if (i < polynomial[k].length) {
                                encodeData.push(polynomial[k][i][j] === '1' ? true : false);
                            }
                        }
                    }
                }
            }
        }
        return encodeData;
    };
    /* tslint:enable */
    /**
     * Converts string value to Boolean
     * @param numberInString - The String value
     * @param noOfBits - Number of Bits
     */
    QRCode.prototype.stringToBoolArray = function (numberInString, noOfBits) {
        var numberInBool = [];
        var dataStringArray = numberInString.split('');
        var number = 0;
        for (var i = 0; i < dataStringArray.length; i++) {
            number = number * 10 + dataStringArray[i].charCodeAt(0) - 48;
        }
        for (var i = 0; i < noOfBits; i++) {
            numberInBool[noOfBits - i - 1] = ((number >> i) & 1) === 1;
        }
        return numberInBool;
    };
    /**
     * Converts Integer value to Boolean
     * @param number - The Integer value
     * @param noOfBits - Number of Bits
     */
    QRCode.prototype.intToBoolArray = function (number, noOfBits) {
        var numberInBool = [];
        for (var i = 0; i < noOfBits; i++) {
            numberInBool[noOfBits - i - 1] = ((number >> i) & 1) === 1;
        }
        return numberInBool;
    };
    /**
     * Splits the Code words
     * @param ds - The Encoded value Blocks
     * @param blk - Index of Block Number
     * @param count - Length of the Block
     */
    QRCode.prototype.splitCodeWord = function (ds, blk, count) {
        var ds1 = [];
        for (var i = 0; i < count; i++) {
            ds1.push(ds[blk][i]);
        }
        return ds1;
    };
    /**
     * Creates the Blocks
     * @param encodeData - The Encoded value.
     * @param noOfBlocks - Number of Blocks.
     */
    QRCode.prototype.createBlocks = function (encodeData, noOfBlocks) {
        var ret = [];
        var cols = encodeData.length / 8 / noOfBlocks;
        var stringValue = '';
        var i = 0;
        var blockNumber = 0;
        for (var i_1 = 0; i_1 < noOfBlocks; i_1++) {
            // tslint:disable-next-line:no-any
            ret.push([0]);
            for (var j = 0; j < cols; j++) {
                ret[i_1][j] = '';
            }
        }
        for (var j = 0; j < encodeData.length; j++) {
            if (j % 8 === 0 && j !== 0) {
                ret[blockNumber][i] = stringValue;
                stringValue = '';
                i++;
                if (i === (encodeData.length / noOfBlocks / 8)) {
                    blockNumber++;
                    i = 0;
                }
            }
            stringValue += encodeData[j] ? '1' : '0';
        }
        ret[blockNumber][i] = stringValue;
        return ret;
    };
    return QRCode;
}());
/** @private */
var ModuleValue = /** @__PURE__ @class */ (function () {
    function ModuleValue() {
        this.isBlack = false;
        this.isFilled = false;
        this.isPdp = false;
    }
    return ModuleValue;
}());

var __extends$20 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Qrcode control
 * ```
 */
var QRCodeGenerator = /** @__PURE__ @class */ (function (_super) {
    __extends$20(QRCodeGenerator, _super);
    /**
     * Constructor for creating the widget
     */
    function QRCodeGenerator(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.widthChange = false;
        _this.heightChange = false;
        return _this;
    }
    /**
     * Renders the barcode control with nodes and connectors
     */
    QRCodeGenerator.prototype.render = function () {
        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
        this.renderComplete();
    };
    QRCodeGenerator.prototype.triggerEvent = function (eventName, message) {
        var arg = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    };
    QRCodeGenerator.prototype.renderElements = function () {
        var barCode = new QRCode();
        barCode.text = this.value;
        barCode.XDimension = this.xDimension;
        barCode.mIsUserMentionedErrorCorrectionLevel = (this.errorCorrectionLevel !== undefined) ? true : false;
        barCode.mErrorCorrectionLevel = (this.errorCorrectionLevel !== undefined) ? this.errorCorrectionLevel : ErrorCorrectionLevel.Medium;
        barCode.version = (this.version !== undefined) ? this.version : undefined;
        barCode.mIsUserMentionedVersion = (this.version !== undefined) ? true : false;
        var mode = (this.mode === 'SVG') ? true : false;
        var validInput = barCode.draw(this.value, this.barcodeCanvas, this.element.offsetHeight, this.element.offsetWidth, this.margin, this.displayText, mode, this.foreColor);
        if (!validInput) {
            var encoding = 'Invalid Input';
            this.triggerEvent(BarcodeEvent.invalid, encoding);
        }
    };
    QRCodeGenerator.prototype.setCulture = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    QRCodeGenerator.prototype.getElementSize = function (real, rulerSize) {
        //this method will return the size of the qrcode 
        var value;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        }
        else {
            value = real.toString() + 'px';
        }
        return value;
    };
    QRCodeGenerator.prototype.initialize = function () {
        //Initialize the height of qrcode generator
        this.element.style.height = this.getElementSize(this.height);
        //Initialize the width of qrcode generator
        this.element.style.width = this.getElementSize(this.width);
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement({
            id: this.element.id, height: this.mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5,
            width: this.mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5
        }, this.backgroundColor, this.element.offsetWidth, this.element.offsetHeight);
        this.element.appendChild(this.barcodeCanvas);
    };
    QRCodeGenerator.prototype.preRender = function () {
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        this.initializePrivateVariables();
        this.setCulture();
        this.element.classList.add('e-qrcode');
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    QRCodeGenerator.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Returns the module name of the barcode
     */
    QRCodeGenerator.prototype.getModuleName = function () {
        return 'QRCodeGenerator';
    };
    /**
     * Destroys the barcode control
     */
    QRCodeGenerator.prototype.destroy = function () {
        this.notify('destroy', {});
        _super.prototype.destroy.call(this);
    };
    QRCodeGenerator.prototype.initializePrivateVariables = function () {
        this.defaultLocale = {};
    };
    QRCodeGenerator.prototype.onPropertyChanged = function (newProp, oldProp) {
        var width;
        var height;
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            refreshCanvasBarcode(this, this.barcodeCanvas);
        }
        else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
                this.widthChange = true;
            }
            width = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? ((newProp.width * 1.5)) : newProp.width;
            this.barcodeCanvas.setAttribute('width', String(width));
        }
        if (newProp.height) {
            if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
                this.heightChange = true;
            }
            height = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? ((newProp.height * 1.5)) : newProp.height;
            this.barcodeCanvas.setAttribute('height', String(height));
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.element.style.width = this.getElementSize(width);
                    this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                    break;
                case 'height':
                    this.element.style.height = this.getElementSize(height);
                    this.barcodeCanvas.setAttribute('height', String(this.element.offsetHeight));
                    break;
                case 'backgroundColor':
                    this.barcodeCanvas.setAttribute('style', 'background:' + newProp.backgroundColor);
                    break;
                case 'mode':
                    this.initialize();
            }
        }
        this.renderElements();
    };
    __decorate$4([
        Property('100%')
    ], QRCodeGenerator.prototype, "height", void 0);
    __decorate$4([
        Property('100%')
    ], QRCodeGenerator.prototype, "width", void 0);
    __decorate$4([
        Property('SVG')
    ], QRCodeGenerator.prototype, "mode", void 0);
    __decorate$4([
        Property(1)
    ], QRCodeGenerator.prototype, "xDimension", void 0);
    __decorate$4([
        Property()
    ], QRCodeGenerator.prototype, "errorCorrectionLevel", void 0);
    __decorate$4([
        Complex({}, Margin)
    ], QRCodeGenerator.prototype, "margin", void 0);
    __decorate$4([
        Property('white')
    ], QRCodeGenerator.prototype, "backgroundColor", void 0);
    __decorate$4([
        Event()
    ], QRCodeGenerator.prototype, "invalid", void 0);
    __decorate$4([
        Property('black')
    ], QRCodeGenerator.prototype, "foreColor", void 0);
    __decorate$4([
        Complex({}, DisplayText)
    ], QRCodeGenerator.prototype, "displayText", void 0);
    __decorate$4([
        Property()
    ], QRCodeGenerator.prototype, "version", void 0);
    __decorate$4([
        Property(undefined)
    ], QRCodeGenerator.prototype, "value", void 0);
    return QRCodeGenerator;
}(Component));

/**
 * Qrcode component exported items
 */

/**
 * DataMatrix used to calculate the DataMatrix barcode
 */
var DataMatrix = /** @__PURE__ @class */ (function () {
    function DataMatrix() {
        this.mXDimension = 1;
        this.mDataMatrixArray = [];
    }
    Object.defineProperty(DataMatrix.prototype, "XDimension", {
        /** @private */
        set: function (value) {
            this.mXDimension = value;
        },
        enumerable: true,
        configurable: true
    });
    DataMatrix.prototype.GetData = function () {
        var givenString = this.value;
        var asciiValue = [];
        for (var i = 0; i < givenString.length; i++) {
            asciiValue.push(givenString.charCodeAt(i));
        }
        return asciiValue;
    };
    DataMatrix.prototype.fillZero = function (destinationArray) {
        for (var i = 0; i < destinationArray.length; i++) {
            destinationArray[i] = 0;
        }
        return destinationArray;
    };
    DataMatrix.prototype.DataMatrixNumericEncoder = function (dataCodeword) {
        var destinationArray = dataCodeword;
        var isEven = true;
        if ((destinationArray.length % 2) === 1) {
            isEven = false;
            destinationArray = Array(dataCodeword.length + 1);
            destinationArray = this.fillZero(destinationArray);
            destinationArray = this.copy(dataCodeword, 0, destinationArray, 0, dataCodeword.length);
        }
        var result = Array(destinationArray.length / 2);
        result = this.fillZero(result);
        for (var i = 0; i < result.length; i++) {
            if (!isEven && i === result.length - 1) {
                result[i] = (destinationArray[2 * i] + 1);
            }
            else {
                result[i] = ((((destinationArray[2 * i] - 48) * 10) + (destinationArray[(2 * i) + 1] - 48)) + 130);
            }
        }
        return result;
    };
    DataMatrix.prototype.ComputeBase256Codeword = function (val, index) {
        var num = ((149 * (index + 1)) % 255) + 1;
        var num2 = val + num;
        if (num2 <= 255) {
            return num2;
        }
        return (num2 - 256);
    };
    DataMatrix.prototype.DataMatrixBaseEncoder = function (dataCodeword) {
        var num = 1;
        if (dataCodeword.length > 249) {
            num++;
        }
        var result = Array((1 + num) + dataCodeword.length);
        result = this.fillZero(result);
        result[0] = 231;
        if (dataCodeword.length <= 249) {
            result[1] = dataCodeword.length;
        }
        else {
            result[1] = ((dataCodeword.length / 250) + 249);
            result[2] = (dataCodeword.length % 250);
        }
        result = this.copy(dataCodeword, 0, result, 1 + num, dataCodeword.length);
        for (var i = 1; i < result.length; i++) {
            result[i] = this.ComputeBase256Codeword(result[i], i);
        }
        return result;
    };
    DataMatrix.prototype.copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        for (var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
        return destinationArray;
    };
    DataMatrix.prototype.DataMatrixEncoder = function (dataCodeword) {
        var result = dataCodeword;
        var index = 0;
        for (var i = 0; i < dataCodeword.length; i++) {
            //checks the codeword is digit or not.
            if (dataCodeword[i] >= 48 && dataCodeword[i] <= 57) {
                var prevIndex = 0;
                if (i !== 0) {
                    prevIndex = index - 1;
                }
                var prevValue = (result[prevIndex] - 1);
                var priorValue = 0;
                if (i !== 0 && index !== 1) {
                    priorValue = result[prevIndex - 1];
                }
                //Check the prevValue is digit or non convertable value
                //if it is true ,then combine the 2 digits 
                if (priorValue !== 235 && prevValue >= 48 && prevValue <= 57) {
                    result[prevIndex] = (10 * (prevValue - 0) + (dataCodeword[i] - 0) + 130);
                }
                else {
                    result[index++] = (dataCodeword[i] + 1);
                }
            }
            else if (dataCodeword[i] < 127) {
                result[index++] = (dataCodeword[i] + 1);
            }
            else {
                result[index] = 235;
                result[index++] = (((dataCodeword[i] - 127)));
            }
        }
        var encodedData = Array(index);
        encodedData = this.fillZero(encodedData);
        encodedData = result;
        return encodedData;
    };
    DataMatrix.prototype.PrepareDataCodeword = function (dataCodeword) {
        if (this.encodingValue === 'Auto' || this.encodingValue === 'ASCIINumeric') {
            var number = true;
            var data = dataCodeword;
            var encoding = 'ASCII';
            for (var i = 0; i < data.length; i++) {
                if ((data[i] < 48) || (data[i] > 57)) {
                    number = false;
                }
            }
            if (number) {
                encoding = 'ASCIINumeric';
            }
            if (this.encodingValue === 'ASCIINumeric' && this.encodingValue !== encoding) {
                return 'Data contains invalid characters and cannot be encoded as ASCIINumeric.';
            }
            this.encodingValue = encoding;
        }
        var result = [];
        switch (this.encodingValue) {
            case 'ASCII':
                result = this.DataMatrixEncoder(dataCodeword);
                break;
            case 'ASCIINumeric':
                result = this.DataMatrixNumericEncoder(dataCodeword);
                break;
            case 'Base256':
                result = this.DataMatrixBaseEncoder(dataCodeword);
                break;
        }
        return result;
    };
    DataMatrix.prototype.PdfDataMatrixSymbolAttribute = function (symbolRow, symbolColumn, horizontalDataRegion, verticalDataRegion, dataCodewords, correctionCodewords, interleavedBlock, interleavedDataBlock) {
        var mSymbolAttribute = {
            SymbolRow: symbolRow,
            SymbolColumn: symbolColumn,
            HorizontalDataRegion: horizontalDataRegion,
            VerticalDataRegion: verticalDataRegion,
            DataCodewords: dataCodewords,
            CorrectionCodewords: correctionCodewords,
            InterleavedBlock: interleavedBlock,
            InterleavedDataBlock: interleavedDataBlock
        };
        return mSymbolAttribute;
    };
    DataMatrix.prototype.getmSymbolAttributes = function () {
        var getmSymbolAttributeValue = [];
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(10, 10, 1, 1, 3, 5, 1, 3));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 12, 1, 1, 5, 7, 1, 5));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(14, 14, 1, 1, 8, 10, 1, 8));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 16, 1, 1, 12, 12, 1, 12));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(18, 18, 1, 1, 18, 14, 1, 18));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(20, 20, 1, 1, 22, 18, 1, 22));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(22, 22, 1, 1, 30, 20, 1, 30));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(24, 24, 1, 1, 36, 24, 1, 36));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(26, 26, 1, 1, 44, 28, 1, 44));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(32, 32, 2, 2, 62, 36, 1, 62));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(36, 36, 2, 2, 86, 42, 1, 86));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(40, 40, 2, 2, 114, 48, 1, 114));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(44, 44, 2, 2, 144, 56, 1, 144));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(48, 48, 2, 2, 174, 68, 1, 174));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(52, 52, 2, 2, 204, 84, 2, 102));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(64, 64, 4, 4, 280, 112, 2, 140));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(72, 72, 4, 4, 368, 144, 4, 92));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(80, 80, 4, 4, 456, 192, 4, 114));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(88, 88, 4, 4, 576, 224, 4, 144));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(96, 96, 4, 4, 696, 272, 4, 174));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(104, 104, 4, 4, 816, 336, 6, 136));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(120, 120, 6, 6, 1050, 408, 6, 175));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(132, 132, 6, 6, 1304, 496, 8, 163));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(144, 144, 6, 6, 1558, 620, 10, 156));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(8, 18, 1, 1, 5, 7, 1, 5));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(8, 32, 2, 1, 10, 11, 1, 10));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 26, 1, 1, 16, 14, 1, 16));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 36, 2, 1, 22, 18, 1, 22));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 36, 2, 1, 32, 24, 1, 32));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 48, 2, 1, 49, 28, 1, 49));
        return getmSymbolAttributeValue;
    };
    DataMatrix.prototype.PadCodewords = function (dataCWLength, temp, codeword) {
        var l = temp.length;
        var ms = [];
        for (var i = 0; i < l; i++) {
            ms.push(temp[i]);
        }
        if (l < dataCWLength) {
            ms.push(129);
        }
        l = ms.length;
        while (l < dataCWLength) { // more padding
            var v = 129 + (((l + 1) * 149) % 253) + 1; // see Annex H
            if (v > 254) {
                v -= 254;
            }
            ms.push(v);
            l = ms.length;
        }
        codeword = Array(ms.length);
        codeword = ms;
        return codeword;
    };
    DataMatrix.prototype.EccProduct = function (a, b) {
        if (a === 0 || b === 0) {
            return 0;
        }
        var mLog = Array(256);
        mLog = this.CreateLogArrays(true);
        var mALog = Array(256);
        mALog = this.CreateLogArrays(false);
        return mALog[(mLog[a] + mLog[b]) % 255];
    };
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    DataMatrix.prototype.validateInput = function (char, characters) {
        return char;
    };
    DataMatrix.prototype.ComputeErrorCorrection = function () {
        var dataLength = this.encodedCodeword.length;
        this.mSymbolAttribute = this.PdfDataMatrixSymbolAttribute(0, 0, 0, 0, 0, 0, 0, 0);
        var mSymbolAttributes = this.getmSymbolAttributes();
        if (!this.size) {
            mSymbolAttributes = this.getmSymbolAttributes();
            for (var i = 0; i < mSymbolAttributes.length; i++) {
                var attr = mSymbolAttributes[i];
                if (attr.DataCodewords >= dataLength) {
                    this.mSymbolAttribute = attr;
                    break;
                }
            }
        }
        else {
            this.mSymbolAttribute = mSymbolAttributes[this.size - 1];
        }
        var temp;
        if (this.mSymbolAttribute.DataCodewords > dataLength) {
            temp = this.PadCodewords(this.mSymbolAttribute.DataCodewords, this.encodedCodeword, temp);
            this.encodedCodeword = Array(temp.length);
            this.encodedCodeword = temp;
            dataLength = this.encodedCodeword.length;
        }
        else if (this.mSymbolAttribute.DataCodewords === 0) {
            return this.validateInput('Data cannot be encoded as barcode', undefined);
        }
        else if (this.mSymbolAttribute.DataCodewords < dataLength) {
            var r = this.mSymbolAttribute.SymbolRow.toString();
            var c = this.mSymbolAttribute.SymbolColumn.toString();
            return 'Data too long for {0}x{1} barcode.';
        }
        var k = this.mSymbolAttribute.CorrectionCodewords;
        var ctArray = [];
        ctArray = this.create1DMatrixArray(k + this.mSymbolAttribute.DataCodewords, ctArray);
        var step = this.mSymbolAttribute.InterleavedBlock;
        var symbolDataWords = this.mSymbolAttribute.DataCodewords;
        var blockErrorWords = this.mSymbolAttribute.CorrectionCodewords / step;
        var total = symbolDataWords + blockErrorWords * step;
        var mrsPolynomial = this.CreateRSPolynomial(step, this.mSymbolAttribute);
        var mBlockLength = 68;
        var b = [];
        b = this.create1DMatrixArray(mBlockLength, b);
        for (var block = 0; block < step; block++) {
            for (var bI = 0; bI < b.length; bI++) {
                b[bI] = 0;
            }
            for (var i = block; i < symbolDataWords; i += step) {
                var val = this.EccSum(b[blockErrorWords - 1], this.encodedCodeword[i]);
                for (var j = blockErrorWords - 1; j > 0; j--) {
                    b[j] = this.EccSum(b[j - 1], this.EccProduct(mrsPolynomial[j], val));
                }
                b[0] = this.EccProduct(mrsPolynomial[0], val);
            }
            var blockDataWords = 0;
            if (block >= 8 && this.size & DataMatrixSize.Size144x144) {
                blockDataWords = this.mSymbolAttribute.DataCodewords / step;
            }
            else {
                blockDataWords = this.mSymbolAttribute.InterleavedDataBlock;
                var bIndex = blockErrorWords;
                for (var i = block + (step * blockDataWords); i < total; i += step) {
                    ctArray[i] = b[--bIndex];
                }
                if (bIndex !== 0) {
                    return 'Error in error correction code generation!';
                }
            }
        }
        if (ctArray.length > k) {
            var tmp = ctArray;
            ctArray = [];
            ctArray = this.create1DMatrixArray(k, ctArray);
            var z = 0;
            for (var i = tmp.length - 1; i > this.mSymbolAttribute.DataCodewords; i--) {
                ctArray[z++] = tmp[i];
            }
        }
        return ctArray.reverse();
    };
    DataMatrix.prototype.CreateLogArrays = function (value) {
        var mLog = Array(256);
        var maLog = Array(256);
        mLog[0] = -255;
        maLog[0] = 1;
        for (var i = 1; i <= 255; i++) {
            maLog[i] = maLog[i - 1] * 2;
            if (maLog[i] >= 256) {
                maLog[i] = maLog[i] ^ 301;
            }
            mLog[maLog[i]] = i;
        }
        if (value) {
            return mLog;
        }
        else {
            return maLog;
        }
    };
    DataMatrix.prototype.EccSum = function (a, b) {
        return (a ^ b);
    };
    DataMatrix.prototype.EccDoublify = function (a, b) {
        if (a === 0) {
            return 0;
        }
        if (b === 0) {
            return a;
        }
        var mLog = Array(256);
        mLog = this.CreateLogArrays(true);
        var maLog = Array(256);
        maLog = this.CreateLogArrays(false);
        return maLog[(mLog[a] + b) % 255];
    };
    DataMatrix.prototype.CreateRSPolynomial = function (step, mSymbolAttribute) {
        var mBlockLength = 69;
        var mrsPolynomial = Array(mBlockLength);
        var blockErrorWords = mSymbolAttribute.CorrectionCodewords / step;
        for (var i = 0; i < mrsPolynomial.length; i++) {
            mrsPolynomial[i] = 0x01;
        }
        for (var i = 1; i <= blockErrorWords; i++) {
            for (var j = i - 1; j >= 0; j--) {
                mrsPolynomial[j] = this.EccDoublify(mrsPolynomial[j], i);
                if (j > 0) {
                    mrsPolynomial[j] = this.EccSum(mrsPolynomial[j], mrsPolynomial[j - 1]);
                }
            }
        }
        return mrsPolynomial;
    };
    DataMatrix.prototype.PrepareCodeword = function (dataCodeword) {
        this.encodedCodeword = this.PrepareDataCodeword(dataCodeword);
        if (isNaN(this.encodedCodeword[0])) {
            return this.encodedCodeword;
        }
        var correctCodeword = this.ComputeErrorCorrection();
        if ((isNaN(correctCodeword[0]))) {
            return correctCodeword;
        }
        this.encodedCodeword = this.encodedCodeword;
        var finalCodeword = Array(this.encodedCodeword.length + correctCodeword.length);
        this.copyArray(finalCodeword, 0, this.encodedCodeword);
        this.copyArray(finalCodeword, this.encodedCodeword.length, correctCodeword);
        return finalCodeword;
    };
    DataMatrix.prototype.copyArray = function (array, index, correctCodeword) {
        for (var i = 0; i < correctCodeword.length; i++) {
            array[index + i] = correctCodeword[i];
        }
    };
    DataMatrix.prototype.ecc200placementbit = function (array, NR, NC, r, c, p, b) {
        if (r < 0) {
            r += NR;
            c += 4 - ((NR + 4) % 8);
        }
        if (c < 0) {
            c += NC;
            r += 4 - ((NC + 4) % 8);
        }
        array[r * NC + c] = (p << 3) + b;
    };
    DataMatrix.prototype.ecc200placementblock = function (array, NR, NC, r, c, p) {
        this.ecc200placementbit(array, NR, NC, r - 2, c - 2, p, 7);
        this.ecc200placementbit(array, NR, NC, r - 2, c - 1, p, 6);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 2, p, 5);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 1, p, 4);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 0, p, 3);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 2, p, 2);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 0, p, 0);
    };
    DataMatrix.prototype.ecc200placementcornerD = function (array, NR, NC, p) {
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 1, NC - 1, p, 6);
        this.ecc200placementbit(array, NR, NC, 0, NC - 3, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        this.ecc200placementbit(array, NR, NC, 1, NC - 3, p, 2);
        this.ecc200placementbit(array, NR, NC, 1, NC - 2, p, 1);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
    };
    DataMatrix.prototype.ecc200placementcornerA = function (array, NR, NC, p) {
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 1, 1, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 2, p, 5);
        var value = 4;
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, value);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        var value1 = 2;
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, value1);
        this.ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
    };
    DataMatrix.prototype.ecc200placementcornerB = function (array, NR, NC, p) {
        var value = 7;
        this.ecc200placementbit(array, NR, NC, NR - 3, 0, p, value);
        this.ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 4, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 3, p, 3);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 2);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
    };
    DataMatrix.prototype.ecc200placementcornerC = function (array, NR, NC, p) {
        this.ecc200placementbit(array, NR, NC, NR - 3, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 2);
        this.ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
    };
    DataMatrix.prototype.ecc200placement = function (array, NR, NC) {
        var r;
        var c;
        var p;
        for (var r_1 = 0; r_1 < NR; r_1++) {
            for (var c_1 = 0; c_1 < NC; c_1++) {
                array[r_1 * NC + c_1] = 0;
            }
        }
        p = 1;
        r = 4;
        c = 0;
        do {
            // check corner
            if (r === NR && !(c !== 0)) {
                this.ecc200placementcornerA(array, NR, NC, p++);
            }
            if ((r === NR - 2) && !(c !== 0) && ((NC % 4) !== 0)) {
                this.ecc200placementcornerB(array, NR, NC, p++);
            }
            if (r === NR - 2 && !(c !== 0) && (NC % 8) === 4) {
                this.ecc200placementcornerC(array, NR, NC, p++);
            }
            if (r === NR + 4 && c === 2 && !((NC % 8) !== 0)) {
                this.ecc200placementcornerD(array, NR, NC, p++);
            }
            // up/right
            do {
                if (r < NR && c >= 0 && !(array[r * NC + c] !== 0)) {
                    this.ecc200placementblock(array, NR, NC, r, c, p++);
                }
                r -= 2;
                c += 2;
            } while (r >= 0 && c < NC);
            r++;
            c += 3;
            // down/left
            do {
                if (r >= 0 && c < NC && !(array[r * NC + c] !== 0)) {
                    this.ecc200placementblock(array, NR, NC, r, c, p++);
                }
                r += 2;
                c -= 2;
            } while (r < NR && c >= 0);
            r += 3;
            c++;
        } while (r < NR || c < NC);
        // unfilled corner
        if (!(array[NR * NC - 1] !== 0)) {
            array[NR * NC - 1] = array[NR * NC - NC - 2] = 1;
        }
    };
    DataMatrix.prototype.getActualRows = function () {
        return this.mSymbolAttribute.SymbolRow + (QuietZone.All);
    };
    DataMatrix.prototype.getActualColumns = function () {
        return this.mSymbolAttribute.SymbolColumn + (QuietZone.All);
    };
    DataMatrix.prototype.AddQuiteZone = function (tempArray2) {
        this.actualRows = this.getActualRows();
        this.actualColumns = this.getActualColumns();
        var w = this.actualRows;
        var h = this.actualColumns;
        var quietZone = QuietZone.All - 1;
        this.mDataMatrixArray = this.create2DMartixArray(w, h, this.mDataMatrixArray);
        // Top quietzone.
        for (var i = 0; i < h; i++) {
            this.mDataMatrixArray[0][i] = 0;
        }
        for (var i = quietZone; i < w - quietZone; i++) {
            // Left quietzone.
            this.mDataMatrixArray[i][0] = 0;
            for (var j = quietZone; j < h - quietZone; j++) {
                this.mDataMatrixArray[i][j] = tempArray2[i - quietZone][j - quietZone];
            }
            // Right quietzone.
            this.mDataMatrixArray[i][h - quietZone] = 0;
        }
        //Bottom quietzone.
        for (var i = 0; i < h; i++) {
            this.mDataMatrixArray[w - quietZone][i] = 0;
        }
    };
    DataMatrix.prototype.drawImage = function (canvas, options) {
        // render image for the datamtrix generator
        var barcodeRenderer = this.getInstance(canvas.id);
        for (var i = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas, options[i]);
        }
    };
    DataMatrix.prototype.CreateMatrix = function (codeword) {
        var x;
        var y;
        var NC;
        var NR;
        var places;
        var W = this.mSymbolAttribute.SymbolColumn;
        var H = this.mSymbolAttribute.SymbolRow;
        var FW = W / this.mSymbolAttribute.HorizontalDataRegion;
        var FH = H / this.mSymbolAttribute.VerticalDataRegion;
        NC = W - 2 * (W / FW);
        NR = H - 2 * (H / FH);
        places = Array(NC * NR);
        this.ecc200placement(places, NR, NC);
        var matrix = [];
        matrix = this.create1DMatrixArray(W * H, matrix);
        for (var y_1 = 0; y_1 < H; y_1 += FH) {
            for (var x_1 = 0; x_1 < W; x_1++) {
                matrix[y_1 * W + x_1] = 1;
            }
            for (var x_2 = 0; x_2 < W; x_2 += 2) {
                matrix[(y_1 + FH - 1) * W + x_2] = 1;
            }
        }
        for (x = 0; x < W; x += FW) {
            for (y = 0; y < H; y++) {
                matrix[y * W + x] = 1;
            }
            for (y = 0; y < H; y += 2) {
                matrix[y * W + x + FW - 1] = 1;
            }
        }
        for (var y_2 = 0; y_2 < NR; y_2++) {
            for (var x_3 = 0; x_3 < NC; x_3++) {
                var v = places[(NR - y_2 - 1) * NC + x_3];
                if (v === 1 || v > 7 && (codeword[(v >> 3) - 1] & (1 << (v & 7))) !== 0) {
                    matrix[(1 + Math.floor(y_2) + 2 * Math.floor(Math.floor(y_2) / Math.floor(FH - 2))) * Math.floor(W) +
                        1 + Math.floor(x_3) + 2 * Math.floor(Math.floor(x_3) / Math.floor(FW - 2))] = 1;
                }
            }
        }
        var w = this.mSymbolAttribute.SymbolColumn;
        var h = this.mSymbolAttribute.SymbolRow;
        var tempArray = [];
        tempArray = this.create2DMartixArray(w, h, tempArray);
        for (var x1 = 0; x1 < w; x1++) {
            for (var y1 = 0; y1 < h; y1++) {
                tempArray[x1][y1] = matrix[w * y1 + x1];
            }
        }
        var tempArray2 = [];
        tempArray2 = this.create2DMartixArray(w, h, tempArray2);
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                tempArray2[h - 1 - i][j] = tempArray[j][i];
            }
        }
        this.AddQuiteZone(tempArray2);
    };
    DataMatrix.prototype.create1DMatrixArray = function (w, tempArray) {
        for (var i = 0; i < w; i++) {
            tempArray[i] = 0;
        }
        return tempArray;
    };
    DataMatrix.prototype.create2DMartixArray = function (w, h, tempArray) {
        for (var i = 0; i < w; i++) {
            tempArray.push([i]);
            for (var j = 0; j < h; j++) {
                tempArray[i][j] = 0;
            }
        }
        return tempArray;
    };
    /** @private */
    DataMatrix.prototype.BuildDataMatrix = function () {
        var codeword = [];
        codeword = (this.PrepareCodeword(this.GetData()));
        if ((isNaN(codeword[0]))) {
            return codeword;
        }
        else {
            this.CreateMatrix(codeword);
            return this.mDataMatrixArray[0];
        }
    };
    DataMatrix.prototype.drawText = function (canvas, options) {
        var barcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas, options);
    };
    DataMatrix.prototype.getInstance = function (id) {
        var barCode = document.getElementById(id);
        var barcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    };
    DataMatrix.prototype.drawDisplayText = function (canvas, x, y, width, height, scaleValue, foreColor) {
        var displayText = this.displayText;
        createMeasureElements();
        var textOptions = getBaseAttributes(width, height, x, y, 'black');
        textOptions.string = (displayText.text ? displayText.text : this.value);
        textOptions.fontStyle = displayText.font;
        textOptions.color = foreColor;
        textOptions.stringSize = displayText.size;
        textOptions.visibility = displayText.visibility;
        var textSize = measureText(textOptions);
        if (!this.isSvgMode) {
            textSize = { width: textSize.width * scaleValue, height: textSize.height * scaleValue };
        }
        var textHeight = (textSize.height / 2) + (this.isSvgMode ? 2 : 2 * 1.5);
        textOptions.height = textHeight;
        if (width > textSize.width) {
            if (this.displayText.alignment === 'Center') {
                textOptions.x += (((x + width - x)) / 2) - textSize.width * .5;
            }
            else if (this.displayText.alignment === 'Left') {
                textOptions.x = x + this.displayText.margin.left;
            }
            else {
                textOptions.x = ((this.width - this.margin.left) - textSize.width) - this.displayText.margin.right;
            }
        }
        if (textOptions.x < x) {
            textOptions.x = x;
        }
        if (this.displayText.position === 'Bottom') {
            if (this.displayText.margin.top > 0) {
                textOptions.y = ((y + height));
            }
            if (this.displayText.margin.bottom > 0) {
                textOptions.y = ((y + height)) - displayText.margin.bottom;
            }
            else {
                if (this.margin.top < 10) {
                    textOptions.y = height + textSize.height / 2;
                }
                else {
                    textOptions.y = height + this.margin.top;
                }
            }
        }
        else {
            if (this.displayText.margin.top > 0) {
                textOptions.y = y + this.displayText.margin.top + textSize.height / 2;
            }
            else {
                textOptions.y = y + textSize.height / 2;
            }
        }
        if (this.displayText.visibility) {
            if (!this.isSvgMode) {
                textOptions.stringSize = textOptions.stringSize * 1.5;
            }
            this.drawText(canvas, textOptions);
        }
        return textOptions;
    };
    DataMatrix.prototype.getDrawableSize = function (margin, actualWidth, actualHeight) {
        var barcodeSize = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        return barcodeSize;
    };
    
    /** @private */
    DataMatrix.prototype.draw = function (canvas) {
        var scaleValue = 1.5;
        var isSvg = this.isSvgMode;
        var isSquareMatrix = this.size < 25;
        var dimension = this.mDataMatrixArray.length;
        var width = this.width;
        var height = this.height;
        var dimensionX;
        var dimensionY;
        var leftValue = this.margin.left;
        var rightValue = this.margin.right;
        var topValue = this.margin.top;
        var bottomVal = this.margin.bottom;
        var actualWidth = width - ((isSvg ? leftValue : leftValue * scaleValue) + (isSvg ? rightValue : rightValue * scaleValue));
        var actualHeight = height - ((isSvg ? topValue : topValue * scaleValue) + (isSvg ? bottomVal : bottomVal * scaleValue));
        var size = this.getDrawableSize(this.margin, actualWidth, actualHeight);
        size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        var x = (actualWidth - size) / 2;
        var y = (actualHeight - size) / 2;
        y += isSvg ? this.margin.top : this.margin.top * scaleValue;
        x += isSvg ? this.margin.left : this.margin.left * scaleValue;
        var textBounds = this.drawDisplayText(canvas, x, y, size, actualHeight, scaleValue, this.foreColor);
        actualHeight -= (textBounds.height);
        if (this.displayText.margin.bottom > 0) {
            if (this.displayText.position === 'Top') {
                y += (this.displayText.margin.bottom);
                actualHeight -= (this.displayText.margin.bottom);
            }
            else {
                actualHeight -= this.displayText.margin.bottom;
            }
        }
        if (this.displayText.margin.top > 0) {
            if (this.displayText.position === 'Top') {
                y += (this.displayText.margin.top);
                actualHeight -= (this.displayText.margin.top);
            }
            else {
                actualHeight -= this.displayText.margin.top;
            }
        }
        size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        if (!isSquareMatrix) {
            dimensionX = size / this.mDataMatrixArray[0].length;
            dimensionY = size / this.mDataMatrixArray.length;
        }
        dimension = size / this.mDataMatrixArray.length;
        var w = this.actualRows;
        var h = this.actualColumns;
        var option;
        var options = [];
        for (var i = 0; i < w; i++) {
            for (var j = 0; j < h; j++) {
                var color = void 0;
                if (this.mDataMatrixArray[i][j] === 1) {
                    color = this.foreColor;
                }
                else {
                    color = 'white';
                }
                if (color !== 'white') {
                    option = getBaseAttributes(isSquareMatrix ? dimension : dimensionX, isSquareMatrix ? dimension : dimensionY, x, this.displayText.position === 'Bottom' ? y : y + textBounds.height / 2, color);
                    options.push(option);
                }
                x = x + (isSquareMatrix ? dimension : dimensionX);
            }
            y = y + (isSquareMatrix ? dimension : dimensionY);
            x = ((actualWidth - size) / 2) + (isSvg ? this.margin.left : this.margin.left * scaleValue);
        }
        this.drawImage(canvas, options);
        this.mDataMatrixArray = undefined;
    };
    return DataMatrix;
}());

var __extends$21 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Datamatrix control
 * ```
 */
var DataMatrixGenerator = /** @__PURE__ @class */ (function (_super) {
    __extends$21(DataMatrixGenerator, _super);
    /**
     * Constructor for creating the widget
     */
    function DataMatrixGenerator(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Destroys the the data matrix generator
     */
    DataMatrixGenerator.prototype.destroy = function () {
        this.notify('destroy', {});
        _super.prototype.destroy.call(this);
    };
    DataMatrixGenerator.prototype.initializePrivateVariables = function () {
        this.defaultLocale = {};
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    DataMatrixGenerator.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Returns the module name of the the data matrix generator
     */
    DataMatrixGenerator.prototype.getModuleName = function () {
        return 'DataMatrixGenerator';
    };
    DataMatrixGenerator.prototype.setCulture = function () {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    };
    DataMatrixGenerator.prototype.getElementSize = function (real, rulerSize) {
        //this method will return the size of the datamatrix 
        var value;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        }
        else {
            value = real.toString() + 'px';
        }
        return value;
    };
    DataMatrixGenerator.prototype.initialize = function () {
        //Initialize the width of the datamatrix generator
        this.element.style.width = this.getElementSize(this.width);
        //Initialize the hieght of the datamatrix generator
        this.element.style.height = this.getElementSize(this.height);
        var mode = this.mode;
        //initialize the canvas element
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement({
            id: this.element.id, height: mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5,
            width: mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5
        }, this.backgroundColor, this.element.offsetWidth, this.element.offsetHeight);
        this.element.appendChild(this.barcodeCanvas);
    };
    DataMatrixGenerator.prototype.triggerEvent = function (eventName, message) {
        var arg = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    };
    DataMatrixGenerator.prototype.preRender = function () {
        //initialize the data matrix renderer
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        //initialize the data matrix renderer private variables
        this.initializePrivateVariables();
        this.setCulture();
        //set class data matrix renderer
        this.element.classList.add('e-datamatrix');
    };
    DataMatrixGenerator.prototype.onPropertyChanged = function (newProp, oldProp) {
        var width;
        var height;
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            refreshCanvasBarcode(this, this.barcodeCanvas);
        }
        else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            width = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? ((newProp.width * 1.5)) : newProp.width;
            this.barcodeCanvas.setAttribute('width', String(width));
        }
        if (newProp.height) {
            height = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? ((newProp.height * 1.5)) : newProp.height;
            this.barcodeCanvas.setAttribute('height', String(height));
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'mode':
                    this.initialize();
                    break;
                case 'height':
                    this.element.style.height = this.getElementSize(height);
                    this.barcodeCanvas.setAttribute('height', String(this.element.offsetHeight));
                    break;
                case 'width':
                    this.element.style.width = this.getElementSize(width);
                    this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                    break;
                case 'backgroundColor':
                    this.barcodeCanvas.setAttribute('style', 'background:' + newProp.backgroundColor);
                    break;
            }
        }
        this.renderElements();
    };
    DataMatrixGenerator.prototype.checkdata = function (value) {
        var validData = false;
        for (var i = 0; i < value.length; i++) {
            if ((value.charCodeAt(i) >= 32 && value.charCodeAt(i) <= 126) || (value.charCodeAt(i) === 10 || value.charCodeAt(i) === 13)) {
                validData = true;
            }
        }
        return validData;
    };
    DataMatrixGenerator.prototype.renderElements = function () {
        var dataMatrix = new DataMatrix();
        dataMatrix.encodingValue = this.encoding;
        dataMatrix.size = this.size;
        dataMatrix.value = this.value;
        dataMatrix.width = this.barcodeCanvas.getAttribute('width');
        dataMatrix.height = this.barcodeCanvas.getAttribute('height');
        dataMatrix.XDimension = this.xDimension;
        dataMatrix.isSvgMode = this.mode === 'SVG' ? true : false;
        dataMatrix.margin = this.margin;
        dataMatrix.displayText = this.displayText;
        dataMatrix.foreColor = this.foreColor;
        var checkOtherLanguage = this.checkdata(this.value);
        var encoding = (dataMatrix.BuildDataMatrix());
        if (isNaN(encoding[0])) {
            this.triggerEvent(BarcodeEvent.invalid, encoding);
        }
        else if (!checkOtherLanguage) {
            this.triggerEvent(BarcodeEvent.invalid, 'Invalid input');
        }
        else {
            dataMatrix.draw(this.barcodeCanvas);
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    };
    /**
     * Renders the barcode control with nodes and connectors
     */
    DataMatrixGenerator.prototype.render = function () {
        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
        this.renderComplete();
    };
    __decorate$5([
        Property('Auto')
    ], DataMatrixGenerator.prototype, "encoding", void 0);
    __decorate$5([
        Property(DataMatrixSize.Auto)
    ], DataMatrixGenerator.prototype, "size", void 0);
    __decorate$5([
        Property('SVG')
    ], DataMatrixGenerator.prototype, "mode", void 0);
    __decorate$5([
        Property(undefined)
    ], DataMatrixGenerator.prototype, "value", void 0);
    __decorate$5([
        Property('100%')
    ], DataMatrixGenerator.prototype, "height", void 0);
    __decorate$5([
        Property('100%')
    ], DataMatrixGenerator.prototype, "width", void 0);
    __decorate$5([
        Complex({}, DisplayText)
    ], DataMatrixGenerator.prototype, "displayText", void 0);
    __decorate$5([
        Complex({}, Margin)
    ], DataMatrixGenerator.prototype, "margin", void 0);
    __decorate$5([
        Property('white')
    ], DataMatrixGenerator.prototype, "backgroundColor", void 0);
    __decorate$5([
        Event()
    ], DataMatrixGenerator.prototype, "invalid", void 0);
    __decorate$5([
        Property('black')
    ], DataMatrixGenerator.prototype, "foreColor", void 0);
    __decorate$5([
        Property(1)
    ], DataMatrixGenerator.prototype, "xDimension", void 0);
    return DataMatrixGenerator;
}(Component));

/**
 * Datamatrix component exported items
 */

/**
 * Barcode component exported items
 */

export { BarcodeGenerator, BarcodeBase, OneDimension, BarcodeEvent, QuietZone, DataMatrixSize, QRCodeVersion, ErrorCorrectionLevel, createHtmlElement, getChildNode, measureText, setAttribute, createSvgElement, createMeasureElements, Point, Rect, Size, DisplayText, Margin, BarcodeCanvasRenderer, BarcodeRenderer, BarcodeSVGRenderer, CodaBar, Code128, Code128A, Code128B, Code128C, Code39, Ean8, Ean13, UpcA, UpcE, QRCode, ModuleValue, QRCodeGenerator, PdfQRBarcodeValues, ErrorCorrectionCodewords, DataMatrixGenerator, DataMatrix };
//# sourceMappingURL=ej2-barcode-generator.es5.js.map
