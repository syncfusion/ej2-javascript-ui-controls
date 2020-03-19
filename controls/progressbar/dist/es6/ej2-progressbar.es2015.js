import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, NotifyPropertyChanges, Property, createElement, remove } from '@syncfusion/ej2-base';
import { PathOption, SvgRenderer, getElement, measureText } from '@syncfusion/ej2-svg-base';

/**
 * helper for progress bar
 */
/** @private */
class Rect {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}
/** @private */
class Size {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
}
/** @private */
class RectOption extends PathOption {
    constructor(id, fill, width, color, opacity, rect, rx, ry, transform, dashArray) {
        super(id, fill, width, color, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this.stroke = (width !== 0 && this.stroke !== '') ? color : 'transparent';
    }
}
/** calculate the start and end point of circle */
function degreeToLocation(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
/** calculate the path of the circle */
function getPathArc(x, y, radius, startAngle, endAngle, enableRtl, animation) {
    // tslint:disable-next-line
    let start = degreeToLocation(x, y, radius, startAngle);
    // tslint:disable-next-line
    let end = degreeToLocation(x, y, radius, endAngle);
    let largeArcFlag = '0';
    let sweepFlag = (enableRtl) ? '0' : '1';
    if (!enableRtl) {
        largeArcFlag = ((endAngle >= startAngle) ? endAngle : endAngle + 360) - startAngle <= 180 ? '0' : '1';
    }
    else {
        largeArcFlag = ((startAngle >= endAngle) ? startAngle : startAngle + 360) - endAngle <= 180 ? '0' : '1';
    }
    let d;
    if (animation) {
        d = 'M ' + x + ' ' + y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' ' + ' 0 ' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y;
    }
    else {
        d = 'M' + start.x + ' ' + start.y +
            'A' + radius + ' ' + radius + ' ' + '0' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y;
    }
    return d;
}
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Animation Effect Calculation
 * @private
 */
function effect(currentTime, startValue, endValue, duration, enableRtl) {
    let start = (enableRtl) ? endValue : -endValue;
    let end = startValue + ((enableRtl) ? -endValue : endValue);
    return start * Math.cos(currentTime / duration * (Math.PI / 2)) + end;
}
/**
 * @private
 */
const annotationRender = 'annotationRender';
/**
 * @private
 */
function getElement$1(id) {
    return document.getElementById(id);
}
/**
 * @private
 */
function removeElement(id) {
    if (!id) {
        return null;
    }
    let element = typeof id === 'string' ? getElement$1(id) : id;
    if (element) {
        remove(element);
    }
}
/**
 * @private
 */
class ProgressLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * corner Radius
 */
const lineCapRadius = 0.9;
/**
 * complete Angle
 */
const completeAngle = 359.99;
/**
 * valueChanged event
 */
const valueChanged = 'valueChanged';
/**
 * progressCompleted event
 */
const progressCompleted = 'progressCompleted';

/**
 * To do the animation for linear progress bar
 */
function doLinearAnimation(element, progress, delay, start) {
    let animation = new Animation({});
    let linearPath = element;
    let width = linearPath.getAttribute('width');
    let x = (progress.isIndeterminate ? -(+linearPath.getAttribute('width')) : +linearPath.getAttribute('x')).toString();
    let currentTime;
    let end = progress.progressRect.x + progress.progressRect.width +
        (progress.isIndeterminate ? (+linearPath.getAttribute('width')) : 0);
    let animationDelay = (progress.isIndeterminate) ? 0 : delay;
    linearPath.style.visibility = 'hidden';
    animation.animate(linearPath, {
        duration: progress.animation.duration,
        delay: animationDelay,
        progress: (args) => {
            if (progress.enableRtl) {
                if (progress.isIndeterminate) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, end - parseInt(width, 10), end - parseInt(x, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', currentTime.toString());
                    }
                }
                else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, parseInt(width, 10), parseInt(width, 10) - parseInt(x, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', currentTime.toString());
                    }
                }
            }
            else {
                if (progress.isIndeterminate) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, parseInt(x, 10), end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', currentTime.toString());
                    }
                }
                else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, start, parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', currentTime.toString());
                    }
                }
            }
        },
        end: (model) => {
            if (progress.enableRtl) {
                if (progress.isIndeterminate) {
                    linearPath.setAttribute('x', x);
                    doLinearAnimation(element, progress, 0);
                }
                else {
                    linearPath.setAttribute('x', x);
                }
            }
            else {
                if (progress.isIndeterminate) {
                    linearPath.setAttribute('x', x);
                    doLinearAnimation(element, progress, 0);
                }
                else {
                    linearPath.setAttribute('width', width);
                }
            }
            if (progress.animation.enable) {
                progress.labelElement.setAttribute('visibility', 'visible');
            }
            progress.trigger('animationComplete', {
                value: progress.value, trackColor: progress.trackColor,
                progressColor: progress.progressColor
            });
        }
    });
}
/** To do the animation for circular progress bar */
function doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius) {
    let animation = new Animation({});
    animation.animate(circularProgress, {
        duration: 2000,
        delay: 0,
        progress: (args) => {
            start += 5;
            end += 5;
            circularProgress.setAttribute('d', getPathArc(x, y, radius, start % 360, end % 360, progress.enableRtl, true));
        },
        end: (model) => {
            doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius);
        }
    });
}
/** To do the annotation animation for circular progress bar */
function doAnnotationAnimation(circularPath, progress, start, progressEnd) {
    let animation = new Animation({});
    let value = 0;
    let isAnnotation = progress.annotations.length > 0;
    let annotatElementChanged;
    let firstAnnotatElement;
    if (isAnnotation && progress.progressAnnotationModule) {
        firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
        if (firstAnnotatElement && firstAnnotatElement.children[0]) {
            if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                annotatElementChanged = firstAnnotatElement.children[0];
            }
        }
    }
    let annotateValueChanged;
    let totalAngle = progress.totalAngle;
    let min = progress.minimum;
    let max = progress.maximum;
    let end = (start > progressEnd) ? progressEnd + 360 : progressEnd;
    animation.animate(circularPath, {
        duration: progress.animation.duration,
        delay: progress.animation.delay,
        progress: (args) => {
            if (isAnnotation && annotatElementChanged) {
                value = effect(args.timeStamp, start, progress.totalAngle, args.duration, progress.enableRtl);
                if (value <= end) {
                    annotateValueChanged = parseInt((((value - start) / totalAngle) * (max - min) + min).toString(), 10);
                    annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '';
                }
                else {
                    annotatElementChanged.innerHTML = progress.value + '%';
                }
            }
        },
        end: (model) => {
            annotatElementChanged.innerHTML = progress.value + '%';
        }
    });
}
/** To do the animation for circular progress bar */
function doCircularAnimation(x, y, radius, start, progressWidth, element, progress, thickness, delay, startValue) {
    let animation = new Animation({});
    let circularPath = element;
    let pathRadius = 2 * radius * 0.75;
    let value = 0;
    let isAnnotation = progress.annotations.length > 0;
    let annotatElement;
    let firstElement;
    if (isAnnotation && progress.progressAnnotationModule) {
        firstElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
        if (firstElement && firstElement.children[0]) {
            if (firstElement.children[0].tagName === 'SPAN') {
                annotatElement = firstElement.children[0];
            }
        }
    }
    let annotateValue;
    let totalAngle = progress.totalAngle;
    let min = progress.minimum;
    let max = progress.maximum;
    let end = (start > progressWidth) ? progressWidth + 360 : progressWidth;
    let animationDelay = (progress.isIndeterminate) ? 0 : delay;
    start += (progress.cornerRadius === 'Round' && !progress.isIndeterminate) ?
        ((progress.enableRtl === true) ? (lineCapRadius * thickness / 2) : -(lineCapRadius * thickness / 2)) : 0;
    animation.animate(circularPath, {
        duration: progress.animation.duration,
        delay: animationDelay,
        progress: (args) => {
            if (args.timeStamp >= args.delay) {
                value = effect(args.timeStamp, startValue | start, progress.totalAngle, args.duration, progress.enableRtl);
                if (isAnnotation && annotatElement) {
                    if (value <= end) {
                        annotateValue = parseInt((((value - start) / totalAngle) * (max - min) + min).toString(), 10);
                        annotatElement.innerHTML = annotateValue ? annotateValue.toString() + '%' : '';
                    }
                    else {
                        annotatElement.innerHTML = progress.value + '%';
                    }
                }
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, value, progress.enableRtl, true));
            }
        },
        end: (model) => {
            circularPath.setAttribute('d', getPathArc(x, y, pathRadius, 0, 359.99, false, true));
            if (isAnnotation && annotatElement) {
                annotatElement.innerHTML = progress.value + '%';
            }
            if (progress.animation.enable) {
                progress.labelElement.setAttribute('visibility', 'visible');
            }
            progress.trigger('animationComplete', {
                value: progress.value, trackColor: progress.trackColor,
                progressColor: progress.progressColor
            });
        }
    });
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * progress bar complex interface
 */
class Margin extends ChildProperty {
}
__decorate$1([
    Property(10)
], Margin.prototype, "top", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "bottom", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "left", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "right", void 0);
/**
 * Configures the fonts in charts.
 */
class Font extends ChildProperty {
}
__decorate$1([
    Property('Normal')
], Font.prototype, "fontStyle", void 0);
__decorate$1([
    Property('16px')
], Font.prototype, "size", void 0);
__decorate$1([
    Property('Normal')
], Font.prototype, "fontWeight", void 0);
__decorate$1([
    Property('')
], Font.prototype, "color", void 0);
__decorate$1([
    Property('Segoe UI')
], Font.prototype, "fontFamily", void 0);
__decorate$1([
    Property(1)
], Font.prototype, "opacity", void 0);
/**
 * Animation
 */
class Animation$1 extends ChildProperty {
}
__decorate$1([
    Property(false)
], Animation$1.prototype, "enable", void 0);
__decorate$1([
    Property(2000)
], Animation$1.prototype, "duration", void 0);
__decorate$1([
    Property(0)
], Animation$1.prototype, "delay", void 0);
/**
 * Annotation
 */
class ProgressAnnotationSettings extends ChildProperty {
}
__decorate$1([
    Property(null)
], ProgressAnnotationSettings.prototype, "content", void 0);
__decorate$1([
    Property(0)
], ProgressAnnotationSettings.prototype, "annotationAngle", void 0);
__decorate$1([
    Property('0%')
], ProgressAnnotationSettings.prototype, "annotationRadius", void 0);

/** @private */
// tslint:disable-next-line:max-func-body-length
function getProgressThemeColor(theme) {
    let style;
    switch (theme) {
        case 'Material':
            style = {
                linearTrackColor: '#E3165B',
                linearProgressColor: '#E3165B',
                circularTrackColor: '#E3165B',
                circularProgressColor: '#E3165B',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Roboto',
                linearFontSize: 12,
                linearFontStyle: 'Regular',
                circularFontFamily: 'Roboto',
                circularFontStyle: 'Normal',
                circularFontSize: 20,
                progressOpacity: 1,
                trackOpacity: 0.26,
                bufferOpacity: 0.4,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 4,
                linearProgressThickness: 4,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
            };
            break;
        case 'Bootstrap':
            style = {
                linearTrackColor: '#EEEEEE',
                linearProgressColor: '#317ab9',
                circularTrackColor: '#EEEEEE',
                circularProgressColor: '#317ab9',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Helvetica',
                linearFontStyle: 'Regular',
                linearFontSize: 12,
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: 20,
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.44,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 20,
                linearProgressThickness: 20,
                circularTrackThickness: 6,
                circularProgressThickness: 6,
            };
            break;
        case 'Bootstrap4':
            style = {
                linearTrackColor: '#E9ECEF',
                linearProgressColor: '#007bff',
                circularTrackColor: '#E9ECEF',
                circularProgressColor: '#007bff',
                backgroundColor: 'transparent',
                fontColor: '#000000',
                linearFontFamily: 'Helvetica',
                linearFontStyle: 'Regular',
                linearFontSize: 12,
                circularFontFamily: 'Helvetica',
                circularFontStyle: 'Normal',
                circularFontSize: 20,
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.44,
                linearGapWidth: 4,
                circularGapWidth: 4,
                linearTrackThickness: 16,
                linearProgressThickness: 16,
                circularTrackThickness: 6,
                circularProgressThickness: 6,
            };
            break;
        case 'HighContrast':
            style = {
                linearTrackColor: '#BFBFBF',
                linearProgressColor: '#FFD939',
                circularTrackColor: '#BFBFBF',
                circularProgressColor: '#FFD939',
                backgroundColor: 'transparent',
                fontColor: '#FFFFFF',
                linearFontFamily: 'Segoe UI',
                linearFontSize: 12,
                linearFontStyle: 'Regular',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: 20,
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.35,
                linearGapWidth: 2,
                circularGapWidth: 4,
                linearTrackThickness: 2,
                linearProgressThickness: 2,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
            };
            break;
        default:
            style = {
                linearTrackColor: '#EAEAEA',
                linearProgressColor: '#0078D6',
                circularTrackColor: '#E6E6E6',
                circularProgressColor: '#0078D6',
                backgroundColor: 'transparent',
                fontColor: '#333333',
                linearFontFamily: 'Segoe UI',
                linearFontStyle: 'Regular',
                linearFontSize: 12,
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: 20,
                progressOpacity: 1,
                trackOpacity: 1,
                bufferOpacity: 0.3,
                linearGapWidth: 2,
                circularGapWidth: 4,
                linearTrackThickness: 2,
                linearProgressThickness: 2,
                circularTrackThickness: 4,
                circularProgressThickness: 4,
            };
            break;
    }
    return style;
}

/**
 * Base file for annotation
 */
class AnnotationBase {
    /**
     * Constructor for chart and accumulation annotation
     * @param control
     */
    constructor(control) {
        this.control = control;
    }
    render(annotation, index) {
        this.annotation = annotation;
        let childElement = createElement('div', {
            id: this.control.element.id + 'Annotation' + index,
            styles: 'position:absolute;z-index:1', innerHTML: annotation.content
        });
        return childElement;
    }
    /**
     * To process the annotation
     * @param annotation
     * @param index
     * @param parentElement
     */
    processAnnotation(annotation, index, parentElement) {
        let annotationElement;
        let location;
        location = new ProgressLocation(0, 0);
        annotationElement = this.render(annotation, index);
        if (annotationElement) {
            this.setElementStyle(location, annotationElement, parentElement);
        }
        else if (this.control.redraw) {
            removeElement(annotationElement.id);
        }
    }
    setElementStyle(location, element, parentElement) {
        let argsData = {
            cancel: false, name: annotationRender, content: element,
            location: location
        };
        this.control.trigger(annotationRender, argsData);
        if (!argsData.cancel) {
            let result = this.Location(this.annotation.annotationRadius, this.annotation.annotationAngle);
            argsData.content.style.left = result.left + 'px';
            argsData.content.style.top = result.top + 'px';
            argsData.content.style.transform = 'translate(-50%, -50%)';
            argsData.content.setAttribute('aria-label', 'Annotation');
            parentElement.appendChild(argsData.content);
        }
    }
    Location(radius, angle) {
        let top;
        let left;
        let radius1 = parseFloat(radius);
        if (radius1 === 0 && angle === 0) {
            let rect = this.control.progressRect;
            left = rect.x + (rect.width / 2);
            top = rect.y + (rect.height / 2);
        }
        else {
            let degToRadFactor = Math.PI / 180;
            angle = angle - 90;
            angle = angle * degToRadFactor;
            let x = Math.round(this.control.progressSize.width / 2.25);
            let y = Math.round(this.control.progressSize.height / 2.25);
            left = (radius1 * Math.cos(angle)) + x;
            top = (radius1 * Math.sin(angle)) + y;
        }
        return {
            top: top, left: left
        };
    }
}

/**
 * Class for progress annotation
 */
class ProgressAnnotation extends AnnotationBase {
    /**
     * Constructor for Progress annotation
     * @private
     */
    constructor(control, annotations) {
        super(control);
        this.progress = control;
        this.annotations = annotations;
    }
    /**
     * Method to render the annotation for chart
     * @param element
     * @private
     */
    renderAnnotations(element) {
        this.annotations = this.progress.annotations;
        let parentElement = document.getElementById(this.progress.element.id + 'Annotation_collections');
        this.parentElement = parentElement ? parentElement : createElement('div', {
            id: this.progress.element.id + 'Annotation_collections',
            styles: 'position:absolute'
        });
        this.annotations.map((annotation, index) => {
            this.processAnnotation(annotation, index, this.parentElement);
        });
        if (!parentElement) {
            element.appendChild(this.parentElement);
        }
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'ProgressAnnotation';
    }
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    destroy(control) {
        // Destroy method performed here
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *  progress bar control
 */
let ProgressBar = class ProgressBar extends Component {
    constructor(options, element) {
        super(options, element);
    }
    getModuleName() {
        return 'progressbar';
    }
    preRender() {
        this.unWireEvents();
        this.progressRect = new Rect(0, 0, 0, 0);
        this.progressSize = new Size(0, 0);
        this.wireEvents();
    }
    render() {
        this.trigger('load', { progressBar: this });
        this.calculateProgressBarSize();
        this.calculateProgressBarBounds();
        this.SetThemeValues();
        this.renderAnnotations();
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
    }
    /**
     * Set theme values
     */
    SetThemeValues() {
        switch (this.theme) {
            case 'Bootstrap':
            case 'Bootstrap4':
                this.gapWidth = (!this.gapWidth) ? 4 : this.gapWidth;
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Round' : this.cornerRadius;
                break;
            default:
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Square' : this.cornerRadius;
        }
    }
    /**
     * calculate Initial Bounds
     */
    calculateProgressBarBounds() {
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width -= this.margin.left + this.margin.right;
        this.progressRect.height -= this.margin.top + this.margin.bottom;
    }
    /**
     * calculate size of the progress bar
     */
    calculateProgressBarSize() {
        let containerWidth = this.element.clientWidth || this.element.offsetWidth;
        let containerHeight = this.element.clientHeight;
        let width = (this.type === 'Linear') ? 200 : 120;
        let height = (this.type === 'Linear') ? 30 : 120;
        let padding = 10;
        let thickness = Math.max(this.progressThickness, this.trackThickness);
        height = (this.type === 'Linear' && thickness > (height - padding)) ? thickness + padding : height;
        this.progressSize.width = stringToNumber(this.width, containerWidth) || containerWidth || width;
        this.progressSize.height = stringToNumber(this.height, containerHeight) || containerHeight || height;
        this.progressRect.width = this.progressSize.width;
        this.progressRect.height = this.progressSize.height;
    }
    /**
     * Render Annotation
     */
    renderAnnotations() {
        this.createSecElement();
        this.renderAnnotation();
    }
    /**
     * Render SVG Element
     */
    renderElements() {
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
        this.removeSvg();
        this.setTheme();
        this.createSVG();
        this.clipPathElement();
        this.createTrack();
        this.createLinearProgress();
        this.createCircularProgress();
        this.createLabel();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    }
    createSecElement() {
        let secElement = document.getElementById(this.element.id + 'Secondary_Element');
        if (secElement) {
            secElement.innerHTML = '';
            this.secElement = secElement;
            return;
        }
        this.secElement = createElement('div', {
            id: this.element.id + 'Secondary_Element',
            styles: 'position: absolute',
        });
        this.element.appendChild(this.secElement);
    }
    /**
     * To set the left and top position for annotation for center aligned
     */
    setSecondaryElementPosition() {
        let element = this.secElement;
        let rect = this.element.getBoundingClientRect();
        let svgRect = getElement(this.svgObject.id).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }
    createSVG() {
        this.renderer = new SvgRenderer(this.element.id);
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + 'SVG',
            width: this.progressSize.width,
            height: this.progressSize.height,
            style: 'background-color:' + this.themeStyle.backgroundColor
        });
    }
    clipPathElement() {
        this.clipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippath' });
        this.bufferClipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippathBuffer' });
    }
    createTrack() {
        let linearTrack;
        let linearTrackWidth;
        let centerX;
        let centerY;
        let size;
        let radius;
        let startAngle;
        let endAngle;
        let circularTrack;
        let circularPath;
        let option;
        let trackThickness;
        this.argsData = {
            value: this.value,
            progressColor: this.progressColor,
            trackColor: this.trackColor
        };
        if (this.argsData.value === this.maximum) {
            this.trigger(progressCompleted, this.argsData);
        }
        else {
            this.trigger(valueChanged, this.argsData);
        }
        if (this.type === 'Linear') {
            linearTrackWidth = this.progressRect.width;
            option = new PathOption(this.element.id + '_Lineartrack', 'none', (this.trackThickness || this.themeStyle.linearTrackThickness), (this.argsData.trackColor || this.themeStyle.linearTrackColor), this.themeStyle.trackOpacity, '0', this.getPathLine(this.progressRect.x, linearTrackWidth, (this.trackThickness || this.themeStyle.linearTrackThickness)));
            linearTrack = this.renderer.drawPath(option);
            if (this.segmentCount > 1) {
                this.segmentSize = this.calculateSegmentSize(linearTrackWidth, (this.trackThickness || this.themeStyle.linearTrackThickness));
                linearTrack.setAttribute('stroke-dasharray', this.segmentSize);
            }
            if (this.cornerRadius === 'Round') {
                linearTrack.setAttribute('stroke-linecap', 'round');
            }
            this.svgObject.appendChild(linearTrack);
        }
        else if (this.type === 'Circular') {
            startAngle = this.startAngle;
            this.totalAngle = (this.endAngle - this.startAngle) % 360;
            this.totalAngle = (this.totalAngle <= 0 ? (360 + this.totalAngle) : this.totalAngle);
            this.totalAngle -= (this.totalAngle === 360) ? 0.01 : 0;
            endAngle = (this.startAngle + ((this.enableRtl) ? -this.totalAngle : +this.totalAngle)) % 360;
            centerX = this.progressRect.x + (this.progressRect.width / 2);
            centerY = this.progressRect.y + (this.progressRect.height / 2);
            trackThickness = Math.max(this.trackThickness, this.progressThickness) ||
                Math.max(this.themeStyle.circularProgressThickness, this.themeStyle.circularTrackThickness);
            size = (Math.min(this.progressRect.height, this.progressRect.width) / 2) - trackThickness / 2;
            radius = stringToNumber(this.radius, size);
            radius = (radius === null) ? 0 : radius;
            circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
            option = new PathOption(this.element.id + '_Circulartrack', 'none', (this.trackThickness || this.themeStyle.circularTrackThickness), (this.argsData.trackColor || this.themeStyle.circularTrackColor), this.themeStyle.trackOpacity, '0', circularPath);
            circularTrack = this.renderer.drawPath(option);
            this.svgObject.appendChild(circularTrack);
            this.trackwidth = circularTrack.getTotalLength();
            if (this.segmentCount > 1) {
                this.segmentSize = this.calculateSegmentSize(this.trackwidth, (this.trackThickness || this.themeStyle.linearTrackThickness));
                circularTrack.setAttribute('stroke-dasharray', this.segmentSize);
            }
            if (this.cornerRadius === 'Round') {
                circularTrack.setAttribute('stroke-linecap', 'round');
            }
        }
    }
    createLinearProgress(refresh, prevWidth = 0) {
        let linearBuffer;
        let secondaryProgressWidth;
        let linearBufferWidth;
        let option;
        let linearProgress;
        let progressWidth;
        let linearProgressWidth;
        let clipPathBuffer;
        let clipPathLinear;
        if (this.type === 'Linear') {
            if (this.secondaryProgress !== null && !this.isIndeterminate) {
                secondaryProgressWidth = this.calculateProgressRange(this.minimum, this.maximum, this.secondaryProgress);
                linearBufferWidth = this.progressRect.width * secondaryProgressWidth;
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    linearBuffer = this.createLinearSegment('_LinearBuffer', linearBufferWidth, this.themeStyle.bufferOpacity, (this.progressThickness || this.themeStyle.linearProgressThickness));
                }
                else {
                    option = new PathOption(this.element.id + '_Linearbuffer', 'none', (this.progressThickness || this.themeStyle.linearProgressThickness), (this.argsData.progressColor || this.themeStyle.linearProgressColor), this.themeStyle.bufferOpacity, '0', this.getPathLine(this.progressRect.x, linearBufferWidth, (this.progressThickness || this.themeStyle.linearProgressThickness)));
                    linearBuffer = this.renderer.drawPath(option);
                    if (this.segmentCount > 1) {
                        linearBuffer.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        linearBuffer.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(linearBuffer);
                if (this.animation.enable) {
                    clipPathBuffer = this.createClipPath(this.bufferClipPath, secondaryProgressWidth, null, this.progressRect.x, false, (this.progressThickness || this.themeStyle.linearProgressThickness));
                    linearBuffer.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippathBuffer)');
                    doLinearAnimation(clipPathBuffer, this, this.animation.delay, 0);
                }
                this.svgObject.appendChild(this.bufferClipPath);
            }
            if (this.argsData.value !== null) {
                progressWidth = this.calculateProgressRange(this.minimum, this.maximum, this.argsData.value);
                this.progressPreviousWidth = linearProgressWidth = this.progressRect.width * ((this.isIndeterminate) ? 1 : progressWidth);
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    linearProgress = this.createLinearSegment('_LinearProgress', linearProgressWidth, this.themeStyle.progressOpacity, (this.progressThickness || this.themeStyle.linearProgressThickness));
                }
                else {
                    if (!refresh) {
                        option = new PathOption(this.element.id + '_Linearprogress', 'none', (this.progressThickness || this.themeStyle.linearProgressThickness), (this.argsData.progressColor || this.themeStyle.linearProgressColor), this.themeStyle.progressOpacity, '0', this.getPathLine(this.progressRect.x, linearProgressWidth, (this.progressThickness || this.themeStyle.linearProgressThickness)));
                        linearProgress = this.renderer.drawPath(option);
                    }
                    else {
                        linearProgress = getElement(this.element.id + '_Linearprogress');
                        linearProgress.setAttribute('d', this.getPathLine(this.progressRect.x, linearProgressWidth, (this.progressThickness || this.themeStyle.linearProgressThickness)));
                        linearProgress.setAttribute('stroke', this.argsData.progressColor || this.themeStyle.circularProgressColor);
                    }
                    if (this.segmentCount > 1) {
                        linearProgress.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        linearProgress.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(linearProgress);
                if (this.animation.enable || this.isIndeterminate) {
                    let animationdelay = this.animation.delay + ((this.secondaryProgress !== null) ? (linearBufferWidth - linearProgressWidth) : 0);
                    clipPathLinear = this.createClipPath(this.clipPath, progressWidth, null, refresh ? prevWidth : this.progressRect.x, refresh, (this.progressThickness || this.themeStyle.linearProgressThickness));
                    linearProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doLinearAnimation(clipPathLinear, this, animationdelay, refresh ? prevWidth : 0);
                }
                this.svgObject.appendChild(this.clipPath);
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    createCircularProgress(previousStart, previousEnd, refresh) {
        let centerX;
        let centerY;
        let size;
        let endAngle;
        let radius;
        let startAngle = this.startAngle;
        let previousPath;
        this.progressStartAngle = startAngle;
        let circularPath;
        let bufferClipPath;
        let progressEnd;
        let circularProgress;
        let circularBuffer;
        let option;
        let radiusDiff;
        let progressThickness;
        let linearClipPath;
        let rDiff;
        let progressSegment;
        if (this.type === 'Circular') {
            centerX = this.progressRect.x + (this.progressRect.width / 2);
            centerY = this.progressRect.y + (this.progressRect.height / 2);
            progressThickness = Math.max(this.trackThickness, this.progressThickness) ||
                Math.max(this.themeStyle.circularProgressThickness, this.themeStyle.circularTrackThickness);
            size = (Math.min(this.progressRect.height, this.progressRect.width) / 2) - progressThickness / 2;
            radius = stringToNumber(this.innerRadius, size);
            radius = (radius === null) ? 0 : radius;
            if (this.secondaryProgress !== null && !this.isIndeterminate) {
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    circularBuffer = this.createCircularSegment('_CircularBuffer', centerX, centerY, radius, this.secondaryProgress, this.themeStyle.bufferOpacity, (this.progressThickness || this.themeStyle.circularProgressThickness));
                }
                else {
                    endAngle = this.calculateProgressRange(this.minimum, this.maximum, this.secondaryProgress);
                    circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
                    option = new PathOption(this.element.id + '_Circularbuffer', 'none', (this.progressThickness || this.themeStyle.circularProgressThickness), (this.argsData.progressColor || this.themeStyle.circularProgressColor), this.themeStyle.bufferOpacity, '0', circularPath);
                    circularBuffer = this.renderer.drawPath(option);
                    if (this.segmentCount > 1) {
                        radiusDiff = parseInt(this.radius, 10) - parseInt(this.innerRadius, 10);
                        if (radiusDiff !== 0) {
                            progressSegment = this.trackwidth + ((radiusDiff < 0) ? (this.trackwidth * Math.abs(radiusDiff)) / parseInt(this.radius, 10) :
                                -(this.trackwidth * Math.abs(radiusDiff)) / parseInt(this.radius, 10));
                            this.segmentSize = this.calculateSegmentSize(progressSegment, (this.progressThickness || this.themeStyle.circularProgressThickness));
                        }
                        circularBuffer.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        circularBuffer.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(circularBuffer);
                if (this.animation.enable) {
                    bufferClipPath = this.createClipPath(this.bufferClipPath, null, '', null, false);
                    circularBuffer.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippathBuffer)');
                    doCircularAnimation(centerX, centerY, radius, startAngle, 0, bufferClipPath, this, (this.progressThickness || this.themeStyle.circularProgressThickness), this.animation.delay, null);
                }
                this.svgObject.appendChild(this.bufferClipPath);
            }
            if (this.argsData.value !== null) {
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    circularProgress = this.createCircularSegment('_CircularProgress', centerX, centerY, radius, this.argsData.value, this.themeStyle.progressOpacity, (this.progressThickness || this.themeStyle.circularProgressThickness));
                }
                else {
                    progressEnd = this.calculateProgressRange(this.minimum, this.maximum, this.argsData.value);
                    this.annotationEnd = progressEnd;
                    endAngle = ((this.isIndeterminate) ? (this.startAngle + ((this.enableRtl) ? -this.totalAngle : +this.totalAngle)) % 360 : progressEnd);
                    circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
                    option = new PathOption(this.element.id + '_Circularprogress', 'none', (this.progressThickness || this.themeStyle.circularProgressThickness), (this.argsData.progressColor || this.themeStyle.circularProgressColor), this.themeStyle.progressOpacity, '0', circularPath);
                    if (!refresh) {
                        circularProgress = this.renderer.drawPath(option);
                    }
                    else {
                        circularProgress = getElement(this.element.id + '_Circularprogress');
                        previousPath = circularProgress.getAttribute('d');
                        circularProgress.setAttribute('d', circularPath);
                        circularProgress.setAttribute('stroke', this.argsData.progressColor || this.themeStyle.circularProgressColor);
                    }
                    if (this.segmentCount > 1) {
                        rDiff = parseInt(this.radius, 10) - parseInt(this.innerRadius, 10);
                        if (rDiff !== 0) {
                            progressSegment = this.trackwidth + ((rDiff < 0) ? (this.trackwidth * Math.abs(rDiff)) / parseInt(this.radius, 10) :
                                -(this.trackwidth * Math.abs(rDiff)) / parseInt(this.radius, 10));
                            this.segmentSize = this.calculateSegmentSize(progressSegment, (this.progressThickness || this.themeStyle.circularProgressThickness));
                        }
                        circularProgress.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        circularProgress.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.progressEndAngle = endAngle;
                if (!refresh) {
                    this.svgObject.appendChild(circularProgress);
                }
                if (this.animation.enable && !this.isIndeterminate) {
                    let circulardelay = (this.secondaryProgress !== null) ? 300 : this.animation.delay;
                    linearClipPath = this.createClipPath(this.clipPath, null, refresh ? previousPath : '', null, refresh);
                    circularProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doCircularAnimation(centerX, centerY, radius, startAngle, progressEnd, linearClipPath, this, (this.progressThickness || this.themeStyle.circularProgressThickness), circulardelay, refresh ? previousEnd : null);
                }
                if (this.isIndeterminate) {
                    let circularPathRadius = 2 * radius * 0.75;
                    let circularPath = getPathArc(centerX, centerY, circularPathRadius, startAngle, progressEnd, this.enableRtl, true);
                    let option = new PathOption(this.element.id + '_clippathcircle', 'transparent', 10, 'transparent', 1, '0', circularPath);
                    let path = this.renderer.drawPath(option);
                    this.clipPath.appendChild(path);
                    circularProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doCircularIndeterminate((path), this, startAngle, progressEnd, centerX, centerY, circularPathRadius);
                }
                this.svgObject.appendChild(this.clipPath);
            }
        }
    }
    createLabel() {
        //let fontsize: string; let fontstyle: string; let fillcolor: string;
        let textSize;
        let isAnimation = this.animation.enable;
        if (this.type === 'Linear' && this.showProgressValue) {
            let linearlabel;
            let linearbufferValue;
            let linearprogresswidth;
            let progresslabelwidth = this.calculateProgressRange(this.minimum, this.maximum, this.value);
            if (this.value === this.maximum) {
                linearbufferValue = 100;
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) - 10;
            }
            if (this.value > this.maximum || this.value < this.minimum || this.value === this.minimum) {
                linearbufferValue = 0;
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) + 10;
            }
            if (this.value > this.minimum && this.value < this.maximum) {
                linearbufferValue = Math.round((this.value * 100) / (this.maximum - this.minimum));
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) - 10;
            }
            let argsData = {
                cancel: false, text: this.label ? this.label : String(linearbufferValue) + '%', color: this.labelStyle.color
            };
            this.trigger('textRender', argsData);
            if (!argsData.cancel) {
                textSize = measureText(argsData.text, this.labelStyle);
                let options = {
                    'id': this.element.id + '_linearLabel',
                    'font-size': this.labelStyle.size || this.themeStyle.linearFontSize,
                    'font-style': this.labelStyle.fontStyle || this.themeStyle.linearFontStyle,
                    'font-family': this.labelStyle.fontFamily || this.themeStyle.linearFontFamily,
                    'font-weight': this.labelStyle.fontWeight,
                    'fill': argsData.color || this.themeStyle.fontColor,
                    'x': linearprogresswidth,
                    'y': this.progressRect.y + (this.progressRect.height / 2) + (textSize.height / 4),
                    'text-anchor': 'middle',
                    'visibility': isAnimation ? 'hidden' : 'visible'
                };
                linearlabel = this.renderer.createText(options, argsData.text);
                this.labelElement = linearlabel;
                this.svgObject.appendChild(linearlabel);
            }
        }
        else if (this.type === 'Circular' && this.showProgressValue) {
            let circularLabel;
            let circularbufferValue;
            let xAxis = (this.progressRect.x + (this.progressRect.width / 2));
            let yAxis = this.progressRect.y + (this.progressRect.height / 2);
            if (this.value === this.minimum || this.value > this.maximum) {
                circularbufferValue = 0;
            }
            if (this.value === this.maximum) {
                circularbufferValue = 100;
            }
            if (this.value > this.minimum && this.value < this.maximum) {
                circularbufferValue = Math.round((this.value * 100) / (this.maximum - this.minimum));
            }
            let argsData = {
                cancel: false, text: this.label ? this.label : String(circularbufferValue) + '%', color: this.labelStyle.color
            };
            this.trigger('textRender', argsData);
            if (!argsData.cancel) {
                textSize = measureText(argsData.text, this.labelStyle);
                let options = {
                    'id': this.element.id + '_circularLabel',
                    'fill': argsData.color || this.themeStyle.fontColor,
                    'font-size': this.labelStyle.size || this.themeStyle.circularFontSize,
                    'font-style': this.labelStyle.fontStyle || this.themeStyle.circularFontStyle,
                    'font-family': this.labelStyle.fontFamily || this.themeStyle.circularFontFamily,
                    'font-weight': this.labelStyle.fontWeight,
                    'height': this.progressRect.height,
                    'width': this.progressRect.width,
                    'visibility': isAnimation ? 'hidden' : 'visible',
                    'x': xAxis,
                    'y': yAxis + textSize.height / 2,
                    'text-anchor': 'middle'
                };
                circularLabel = this.renderer.createText(options, argsData.text);
                this.labelElement = circularLabel;
                this.svgObject.appendChild(circularLabel);
            }
        }
    }
    getPathLine(x, width, thickness) {
        let moveTo = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        let lineTo = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round') ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
        return 'M' + moveTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2)) +
            'L' + lineTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2));
    }
    calculateProgressRange(min, max, value) {
        let result;
        let endValue;
        if (this.type === 'Linear') {
            endValue = (value - min) / (max - min);
            result = (value < min || value > max) ? 0 : endValue;
            return result;
        }
        else {
            endValue = ((value - min) / (max - min)) * this.totalAngle;
            endValue = (this.startAngle + ((this.enableRtl) ? -endValue : +endValue)) % 360;
            result = (value < min || value > max) ? this.startAngle : endValue;
            return result;
        }
    }
    calculateSegmentSize(width, thickness) {
        let count = (this.type === 'Circular' && this.totalAngle === completeAngle) ? this.segmentCount : this.segmentCount - 1;
        let cornerCount = (this.totalAngle === completeAngle || this.type === 'Linear') ? this.segmentCount : this.segmentCount - 1;
        let gap = this.gapWidth || ((this.type === 'Linear') ? this.themeStyle.linearGapWidth : this.themeStyle.circularGapWidth);
        let size = (width - count * gap);
        size = (size - ((this.cornerRadius === 'Round') ? (cornerCount * (lineCapRadius * thickness)) : 0)) / this.segmentCount;
        gap += (this.cornerRadius === 'Round') ? lineCapRadius * thickness : 0;
        return ' ' + size + ' ' + gap;
    }
    createClipPath(clipPath, width, d, x, refresh, thickness) {
        let path;
        let rect;
        let option;
        if (this.type === 'Linear') {
            if (!refresh) {
                rect = new RectOption(this.element.id + '_clippathrect', 'transparent', 1, 'transparent', 1, new Rect((this.cornerRadius === 'Round') ? (this.progressRect.x - (lineCapRadius / 2 * thickness)) : x, 0, this.progressSize.height, (this.isIndeterminate) ? this.progressRect.width * width :
                    (this.cornerRadius === 'Round') ? (this.progressRect.width * width + lineCapRadius * thickness) :
                        this.progressRect.width * width));
                path = this.renderer.drawRectangle(rect);
                clipPath.appendChild(path);
            }
            else {
                path = getElement(this.element.id + '_clippathrect');
            }
        }
        else {
            if (!refresh) {
                option = new PathOption(this.element.id + '_clippathcircle', 'transparent', 10, 'transparent', 1, '0', d);
                path = this.renderer.drawPath(option);
                clipPath.appendChild(path);
            }
            else {
                path = getElement(this.element.id + '_clippathcircle');
                path.setAttribute('d', d);
            }
        }
        return path;
    }
    createLinearSegment(id, width, opacity, thickness) {
        let locX = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (this.progressRect.x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (this.progressRect.x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (this.progressRect.x + (lineCapRadius / 2) * thickness) : this.progressRect.x);
        let locY = (this.progressRect.y + (this.progressRect.height / 2));
        let gapWidth = (this.gapWidth || this.themeStyle.linearGapWidth);
        let avlWidth = this.progressRect.width / this.segmentCount;
        let avlSegWidth = (this.progressRect.width - ((this.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((this.cornerRadius === 'Round') ? this.segmentCount * (lineCapRadius * thickness) : 0)) / this.segmentCount;
        let gap = (this.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        let segmentGroup = this.renderer.createGroup({ 'id': this.element.id + id + 'Group' });
        let count = Math.ceil(width / avlWidth);
        let segWidth;
        let color;
        let j = 0;
        let option;
        let segmentPath;
        let tolWidth = (this.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        let linearThickness = this.progressThickness || this.themeStyle.linearProgressThickness;
        for (let i = 0; i < count; i++) {
            segWidth = (tolWidth < avlSegWidth) ? tolWidth : avlSegWidth;
            if (j < this.segmentColor.length) {
                color = this.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = this.segmentColor[j];
                j++;
            }
            option = new PathOption(this.element.id + id + i, 'none', linearThickness, color, opacity, '0', this.getLinearSegmentPath(locX, locY, segWidth));
            segmentPath = this.renderer.drawPath(option);
            if (this.cornerRadius === 'Round') {
                segmentPath.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(segmentPath);
            locX += (this.enableRtl) ? -avlSegWidth - gap : avlSegWidth + gap;
            tolWidth -= avlSegWidth + gap;
            tolWidth = (tolWidth < 0) ? 0 : tolWidth;
        }
        return segmentGroup;
    }
    getLinearSegmentPath(x, y, width) {
        return 'M' + ' ' + x + ' ' + y + ' ' + 'L' + (x + ((this.enableRtl) ? -width : width)) + ' ' + y;
    }
    createCircularSegment(id, x, y, r, value, opacity, thickness) {
        let start = this.startAngle;
        let end = this.widthToAngle(this.minimum, this.maximum, value);
        end -= (this.cornerRadius === 'Round' && this.totalAngle === completeAngle) ?
            this.widthToAngle(0, this.trackwidth, ((lineCapRadius / 2) * thickness)) : 0;
        let size = (this.trackwidth - ((this.totalAngle === completeAngle) ? this.segmentCount :
            this.segmentCount - 1) * (this.gapWidth || this.themeStyle.circularGapWidth));
        size = (size -
            ((this.cornerRadius === 'Round') ?
                (((this.totalAngle === completeAngle) ?
                    this.segmentCount : this.segmentCount - 1) * lineCapRadius * thickness) : 0)) / this.segmentCount;
        let avlTolEnd = this.widthToAngle(0, this.trackwidth, (this.trackwidth / this.segmentCount));
        avlTolEnd -= (this.cornerRadius === 'Round' && this.totalAngle === completeAngle) ?
            this.widthToAngle(0, this.trackwidth, ((lineCapRadius / 2) * thickness)) : 0;
        let avlEnd = this.widthToAngle(0, this.trackwidth, size);
        let gap = this.widthToAngle(0, this.trackwidth, (this.gapWidth || this.themeStyle.circularGapWidth));
        gap += (this.cornerRadius === 'Round') ? this.widthToAngle(0, this.trackwidth, (lineCapRadius * thickness)) : 0;
        let segmentGroup = this.renderer.createGroup({ 'id': this.element.id + id + 'Group' });
        let gapCount = Math.floor(end / avlTolEnd);
        let count = Math.ceil((end - gap * gapCount) / avlEnd);
        let segmentPath;
        let circularSegment;
        let segmentEnd;
        let avlSegEnd = (start + ((this.enableRtl) ? -avlEnd : avlEnd)) % 360;
        let color;
        let j = 0;
        let option;
        let circularThickness = this.progressThickness || this.themeStyle.circularProgressThickness;
        for (let i = 0; i < count; i++) {
            segmentEnd = (this.enableRtl) ? ((this.startAngle - end > avlSegEnd) ? this.startAngle - end : avlSegEnd) :
                ((this.startAngle + end < avlSegEnd) ? this.startAngle + end : avlSegEnd);
            segmentPath = getPathArc(x, y, r, start, segmentEnd, this.enableRtl);
            if (j < this.segmentColor.length) {
                color = this.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = this.segmentColor[j];
                j++;
            }
            option = new PathOption(this.element.id + id + i, 'none', circularThickness, color, opacity, '0', segmentPath);
            circularSegment = this.renderer.drawPath(option);
            if (this.cornerRadius === 'Round') {
                circularSegment.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(circularSegment);
            start = segmentEnd + ((this.enableRtl) ? -gap : gap);
            avlSegEnd += (this.enableRtl) ? -avlEnd - gap : avlEnd + gap;
        }
        return segmentGroup;
    }
    widthToAngle(min, max, value) {
        let angle = ((value - min) / (max - min)) * this.totalAngle;
        return angle;
    }
    /**
     * Theming for progress bar
     */
    setTheme() {
        this.themeStyle = getProgressThemeColor(this.theme);
    }
    /**
     * Annotation for progress bar
     */
    renderAnnotation() {
        if (this.progressAnnotationModule && this.annotations.length > 0) {
            this.progressAnnotationModule.renderAnnotations(this.secElement);
        }
    }
    /**
     * Handles the progressbar resize.
     * @return {boolean}
     * @private
     */
    progressResize(e) {
        // 800 used as buffer time for resize event preventing from control rendered time
        if (!(new Date().getTime() > this.controlRenderedTimeStamp + 800)) {
            return false;
        }
        let arg = {
            bar: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(this.progressSize.width, this.progressSize.height),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(() => {
            if (this.isDestroyed) {
                clearTimeout(this.resizeTo);
                return;
            }
            arg.currentSize = this.progressSize;
            this.trigger('resized', arg);
            this.calculateProgressBarSize();
            this.calculateProgressBarBounds();
            this.secElement.innerHTML = '';
            this.renderAnnotation();
            this.renderElements();
        }, 500);
        return false;
    }
    /**
     * Method to un-bind events for progress bar
     */
    unWireEvents() {
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBounds);
    }
    /**
     * Method to bind events for bullet chart
     */
    wireEvents() {
        this.resizeBounds = this.progressResize.bind(this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBounds);
    }
    removeSvg() {
        let svgElement = document.getElementById(this.element.id + 'SVG');
        if (svgElement) {
            remove(svgElement);
        }
    }
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'annotations':
                    this.secElement.innerHTML = '';
                    this.renderAnnotation();
                    let annotationElement = document.getElementById(this.element.id + 'Annotation0').children[0];
                    doAnnotationAnimation(annotationElement, this, this.startAngle, this.annotationEnd);
                    break;
                case 'value':
                    this.argsData = {
                        value: this.value,
                        progressColor: this.progressColor,
                        trackColor: this.trackColor
                    };
                    if (this.argsData.value === this.maximum) {
                        this.trigger(progressCompleted, this.argsData);
                    }
                    else {
                        this.trigger(valueChanged, this.argsData);
                    }
                    if (this.type === 'Circular') {
                        this.createCircularProgress(this.progressStartAngle, this.progressEndAngle, true);
                    }
                    else {
                        this.createLinearProgress(true, this.progressPreviousWidth);
                    }
                    break;
            }
        }
    }
    requiredModules() {
        let modules = [];
        let enableAnnotation = false;
        enableAnnotation = this.annotations.some((value) => {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'ProgressAnnotation',
                args: [this]
            });
        }
        return modules;
    }
    getPersistData() {
        return ' ';
    }
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of ProgressBar
     */
    destroy() {
        this.unWireEvents();
        super.destroy();
        this.removeSvg();
        this.svgObject = null;
        this.element.classList.remove('e-progressbar');
    }
};
__decorate([
    Property('Linear')
], ProgressBar.prototype, "type", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "value", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "secondaryProgress", void 0);
__decorate([
    Property(0)
], ProgressBar.prototype, "minimum", void 0);
__decorate([
    Property(100)
], ProgressBar.prototype, "maximum", void 0);
__decorate([
    Property(0)
], ProgressBar.prototype, "startAngle", void 0);
__decorate([
    Property(0)
], ProgressBar.prototype, "endAngle", void 0);
__decorate([
    Property('100%')
], ProgressBar.prototype, "radius", void 0);
__decorate([
    Property('100%')
], ProgressBar.prototype, "innerRadius", void 0);
__decorate([
    Property(1)
], ProgressBar.prototype, "segmentCount", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "gapWidth", void 0);
__decorate([
    Property('')
], ProgressBar.prototype, "segmentColor", void 0);
__decorate([
    Property('Auto')
], ProgressBar.prototype, "cornerRadius", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "height", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "width", void 0);
__decorate([
    Property(false)
], ProgressBar.prototype, "isIndeterminate", void 0);
__decorate([
    Property(false)
], ProgressBar.prototype, "enableRtl", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "trackColor", void 0);
__decorate([
    Property(null)
], ProgressBar.prototype, "progressColor", void 0);
__decorate([
    Property(0)
], ProgressBar.prototype, "trackThickness", void 0);
__decorate([
    Property(0)
], ProgressBar.prototype, "progressThickness", void 0);
__decorate([
    Property('Fabric')
], ProgressBar.prototype, "theme", void 0);
__decorate([
    Property(false)
], ProgressBar.prototype, "showProgressValue", void 0);
__decorate([
    Complex({ size: null, color: null, fontStyle: null, fontWeight: 'Normal', fontFamily: null }, Font)
], ProgressBar.prototype, "labelStyle", void 0);
__decorate([
    Property('')
], ProgressBar.prototype, "label", void 0);
__decorate([
    Complex({}, Margin)
], ProgressBar.prototype, "margin", void 0);
__decorate([
    Complex({}, Animation$1)
], ProgressBar.prototype, "animation", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "load", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "textRender", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "loaded", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "valueChanged", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "progressCompleted", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "animationComplete", void 0);
__decorate([
    Collection([{}], ProgressAnnotationSettings)
], ProgressBar.prototype, "annotations", void 0);
ProgressBar = __decorate([
    NotifyPropertyChanges
], ProgressBar);

/**
 * Progress Bar component export methods
 */

/**
 * Progress Bar component export methods
 */

export { ProgressBar, Margin, Font, Animation$1 as Animation, ProgressAnnotationSettings, ProgressAnnotation, Rect, Size, RectOption, degreeToLocation, getPathArc, stringToNumber, effect, annotationRender, getElement$1 as getElement, removeElement, ProgressLocation, doLinearAnimation, doCircularIndeterminate, doAnnotationAnimation, doCircularAnimation };
//# sourceMappingURL=ej2-progressbar.es2015.js.map
