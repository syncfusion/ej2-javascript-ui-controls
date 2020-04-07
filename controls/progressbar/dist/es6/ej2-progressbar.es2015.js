import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, NotifyPropertyChanges, Property, createElement, remove } from '@syncfusion/ej2-base';
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
/** @private */
class TextOption {
    constructor(id, fontSize, fontStyle, fontFamily, fontWeight, textAnchor, fill, x, y, width, height) {
        this.id = id;
        this['font-size'] = fontSize;
        this['font-style'] = fontStyle;
        this['font-family'] = fontFamily;
        this['font-weight'] = fontWeight;
        this['text-anchor'] = textAnchor;
        this.fill = fill;
        this.x = x;
        this.y = y;
        this.width = width ? width : 0;
        this.height = height ? height : 0;
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
function getPathArc(x, y, radius, startAngle, endAngle, enableRtl, pieView) {
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
    if (pieView) {
        d = 'M ' + x + ' ' + y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' ' + ' 0 ' + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + end.x + ' ' + end.y + ' ' + 'Z';
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
                linearFontSize: '12',
                linearFontStyle: 'Regular',
                circularFontFamily: 'Roboto',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
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
                linearFontSize: '12',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
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
                linearFontSize: '12',
                circularFontFamily: 'Helvetica',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
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
                linearFontSize: '12',
                linearFontStyle: 'Regular',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
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
                linearFontSize: '12',
                circularFontFamily: 'Segoe UI',
                circularFontStyle: 'Normal',
                circularFontSize: '20',
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
 * mouseClick event
 */
const mouseClick = 'mouseClick';
/**
 * mouseDown event
 */
const mouseDown = 'mouseDown';
/**
 * mouseUp event
 */
const mouseUp = 'mouseUp';
/**
 * mouseMove event
 */
const mouseMove = 'mouseMove';
/**
 * mouseLeave event
 */
const mouseLeave = 'mouseLeave';

/**
 * Base file for annotation
 */
class AnnotationBase {
    /**
     * Constructor for progress annotation
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
 * Animation for progress bar
 */
class ProgressAnimation {
    /** Linear Animation */
    doLinearAnimation(element, progress, delay, start) {
        let animation = new Animation({});
        let linearPath = element;
        let width = linearPath.getAttribute('width');
        let x = linearPath.getAttribute('x');
        let value = 0;
        let rtlX = parseInt(x, 10) - parseInt(width, 10);
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args) => {
                if (progress.enableRtl) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, parseInt(x, 10), parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', value.toString());
                    }
                }
                else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', value.toString());
                    }
                }
            },
            end: (model) => {
                if (progress.enableRtl) {
                    linearPath.setAttribute('x', rtlX.toString());
                }
                else {
                    linearPath.setAttribute('width', width);
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }
    /** Linear Indeterminate */
    doLinearIndeterminate(element, progress) {
        let animation = new Animation({});
        let linearPath = element;
        let x = linearPath.getAttribute('x');
        let width = linearPath.getAttribute('width');
        let value = 0;
        let start = -(parseInt(width, 10));
        let end = (progress.progressRect.x + progress.progressRect.width) + parseInt(width, 10);
        animation.animate(linearPath, {
            duration: 2000,
            delay: 0,
            progress: (args) => {
                if (progress.enableRtl) {
                    value = effect(args.timeStamp, parseInt(x, 10), end, args.duration, progress.enableRtl);
                    linearPath.setAttribute('x', value.toString());
                }
                else {
                    value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                    linearPath.setAttribute('x', value.toString());
                }
            },
            end: (model) => {
                if (progress.enableRtl) {
                    linearPath.setAttribute('x', x.toString());
                }
                else {
                    linearPath.setAttribute('x', start.toString());
                }
                this.doLinearIndeterminate(element, progress);
            }
        });
    }
    /** Circular animation */
    doCircularAnimation(x, y, radius, start, progressEnd, value, element, progress, thickness, delay, startValue) {
        let animation = new Animation({});
        let circularPath = element;
        let pathRadius = radius + (thickness / 2);
        let end = 0;
        let totalEnd;
        totalEnd = ((value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        totalEnd = (value < progress.minimum || value > progress.maximum) ? 0 : totalEnd;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args) => {
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    end = effect(args.timeStamp, startValue | start, totalEnd, args.duration, progress.enableRtl);
                    circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                }
            },
            end: (model) => {
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, progressEnd, progress.enableRtl, true));
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }
    /** Circular indeterminate */
    doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness) {
        let animation = new Animation({});
        let pathRadius = radius + (thickness / 2);
        animation.animate(circularProgress, {
            duration: 2000,
            delay: 0,
            progress: (args) => {
                start += (progress.enableRtl) ? -5 : 5;
                end += (progress.enableRtl) ? -5 : 5;
                circularProgress.setAttribute('d', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, true));
            },
            end: (model) => {
                this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness);
            }
        });
    }
    /** To do the label animation for progress bar */
    doLabelAnimation(labelPath, start, end, progress, delay) {
        let animation = new Animation({});
        let text = labelPath.innerHTML;
        let value = 0;
        let valueChanged$$1 = 0;
        let percentage = 100;
        labelPath.setAttribute('visibility', 'Hidden');
        animation.animate(labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args) => {
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        labelPath.setAttribute('visibility', 'visible');
                        value = effect(args.timeStamp, start, end, args.duration, false);
                        valueChanged$$1 = parseInt(((value / progress.progressRect.width) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged$$1.toString() + '%';
                    }
                }
                else if (progress.type === 'Circular') {
                    labelPath.setAttribute('visibility', 'visible');
                    value = effect(args.timeStamp, start, end, args.duration, false);
                    valueChanged$$1 = parseInt((((value - start) / progress.totalAngle) * percentage).toString(), 10);
                    labelPath.innerHTML = valueChanged$$1.toString() + '%';
                }
            },
            end: (model) => {
                labelPath.innerHTML = text;
            }
        });
    }
    /** To do the annotation animation for circular progress bar */
    doAnnotationAnimation(circularPath, progress) {
        let animation = new Animation({});
        let value = 0;
        let percentage = 100;
        let isAnnotation = progress.annotations.length > 0;
        let annotatElementChanged;
        let firstAnnotatElement;
        let start = progress.startAngle;
        let totalAngle = progress.totalAngle;
        let totalEnd;
        let annotateValueChanged;
        let annotateValue;
        if (isAnnotation && progress.progressAnnotationModule) {
            firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
            if (firstAnnotatElement && firstAnnotatElement.children[0]) {
                if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                    annotatElementChanged = firstAnnotatElement.children[0];
                }
            }
        }
        totalEnd = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        totalEnd = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : totalEnd;
        annotateValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(annotateValue);
        animation.animate(circularPath, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: (args) => {
                if (isAnnotation && annotatElementChanged) {
                    value = effect(args.timeStamp, start, totalEnd, args.duration, false);
                    annotateValueChanged = parseInt((((value - start) / totalAngle) * percentage).toString(), 10);
                    annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '';
                }
            },
            end: (model) => {
                annotatElementChanged.innerHTML = annotateValue + '%';
            }
        });
    }
}

/**
 * Class for progress annotation
 */
class ProgressAnnotation extends AnnotationBase {
    /**
     * Constructor for ProgressBar annotation
     * @private
     */
    constructor(control, annotations) {
        super(control);
        this.animation = new ProgressAnimation();
        this.progress = control;
        this.annotations = annotations;
    }
    /**
     * Method to render the annotation for ProgressBar
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
        if (this.progress.animation.enable && !this.progress.isIndeterminate) {
            let annotationElement = document.getElementById(this.progress.element.id + 'Annotation0').children[0];
            this.animation.doAnnotationAnimation(annotationElement, this.progress);
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

/**
 * Progressbar Segment
 */
class Segment {
    /** To render the linear segment */
    createLinearSegment(progress, id, width, opacity, thickness) {
        let locX = (progress.enableRtl) ? ((progress.cornerRadius === 'Round') ?
            (progress.progressRect.x + progress.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (progress.progressRect.x + progress.progressRect.width)) :
            ((progress.cornerRadius === 'Round') ? (progress.progressRect.x + (lineCapRadius / 2) * thickness) : progress.progressRect.x);
        let locY = (progress.progressRect.y + (progress.progressRect.height / 2));
        let gapWidth = (progress.gapWidth || progress.themeStyle.linearGapWidth);
        let avlWidth = progress.progressRect.width / progress.segmentCount;
        let avlSegWidth = (progress.progressRect.width - ((progress.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((progress.cornerRadius === 'Round') ? progress.segmentCount * (lineCapRadius * thickness) : 0)) / progress.segmentCount;
        let gap = (progress.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        let segmentGroup = progress.renderer.createGroup({ 'id': progress.element.id + id });
        let count = Math.ceil(width / avlWidth);
        let segWidth;
        let color;
        let j = 0;
        let option;
        let segmentPath;
        let tolWidth = (progress.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        let linearThickness = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        for (let i = 0; i < count; i++) {
            segWidth = (tolWidth < avlSegWidth) ? tolWidth : avlSegWidth;
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(progress.element.id + id + i, 'none', linearThickness, color, opacity, '0', this.getLinearSegmentPath(locX, locY, segWidth, progress.enableRtl));
            segmentPath = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                segmentPath.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(segmentPath);
            locX += (progress.enableRtl) ? -avlSegWidth - gap : avlSegWidth + gap;
            tolWidth -= avlSegWidth + gap;
            tolWidth = (tolWidth < 0) ? 0 : tolWidth;
        }
        return segmentGroup;
    }
    getLinearSegmentPath(x, y, width, enableRtl) {
        return 'M' + ' ' + x + ' ' + y + ' ' + 'L' + (x + ((enableRtl) ? -width : width)) + ' ' + y;
    }
    /** To render the circular segment */
    createCircularSegment(progress, id, x, y, r, value, opacity, thickness) {
        let start = progress.startAngle;
        let totalAngle = progress.totalAngle;
        let end = this.widthToAngle(progress.minimum, progress.maximum, value, totalAngle);
        end -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progress.trackwidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        let size = (progress.trackwidth - ((progress.totalAngle === completeAngle) ? progress.segmentCount :
            progress.segmentCount - 1) * (progress.gapWidth || progress.themeStyle.circularGapWidth));
        size = (size -
            ((progress.cornerRadius === 'Round') ?
                (((progress.totalAngle === completeAngle) ?
                    progress.segmentCount : progress.segmentCount - 1) * lineCapRadius * thickness) : 0)) / progress.segmentCount;
        let avlTolEnd = this.widthToAngle(0, progress.trackwidth, (progress.trackwidth / progress.segmentCount), totalAngle);
        avlTolEnd -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progress.trackwidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        let avlEnd = this.widthToAngle(0, progress.trackwidth, size, totalAngle);
        let gap = this.widthToAngle(0, progress.trackwidth, (progress.gapWidth || progress.themeStyle.circularGapWidth), totalAngle);
        gap += (progress.cornerRadius === 'Round') ? this.widthToAngle(0, progress.trackwidth, (lineCapRadius * thickness), totalAngle) : 0;
        let segmentGroup = progress.renderer.createGroup({ 'id': progress.element.id + id });
        let gapCount = Math.floor(end / avlTolEnd);
        let count = Math.ceil((end - gap * gapCount) / avlEnd);
        let segmentPath;
        let circularSegment;
        let segmentEnd;
        let avlSegEnd = (start + ((progress.enableRtl) ? -avlEnd : avlEnd)) % 360;
        let color;
        let j = 0;
        let option;
        let circularThickness = progress.progressThickness || progress.themeStyle.circularProgressThickness;
        for (let i = 0; i < count; i++) {
            segmentEnd = (progress.enableRtl) ? ((progress.startAngle - end > avlSegEnd) ? progress.startAngle - end : avlSegEnd) :
                ((progress.startAngle + end < avlSegEnd) ? progress.startAngle + end : avlSegEnd);
            segmentPath = getPathArc(x, y, r, start, segmentEnd, progress.enableRtl);
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            }
            else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(progress.element.id + id + i, 'none', circularThickness, color, opacity, '0', segmentPath);
            circularSegment = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                circularSegment.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(circularSegment);
            start = segmentEnd + ((progress.enableRtl) ? -gap : gap);
            avlSegEnd += (progress.enableRtl) ? -avlEnd - gap : avlEnd + gap;
        }
        return segmentGroup;
    }
    widthToAngle(min, max, value, totalAngle) {
        let angle = ((value - min) / (max - min)) * totalAngle;
        return angle;
    }
}

/**
 * Progress Bar of type Linear
 */
class Linear {
    constructor(progress) {
        this.segment = new Segment();
        this.animation = new ProgressAnimation();
        this.progress = progress;
    }
    /** To render the linear track  */
    renderLinearTrack() {
        let progress = this.progress;
        let linearTrack;
        let linearTrackWidth;
        let option;
        let linearTrackGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearTrackGroup' });
        linearTrackWidth = progress.progressRect.width;
        option = new PathOption(progress.element.id + '_Lineartrack', 'none', (progress.trackThickness || progress.themeStyle.linearTrackThickness), (progress.argsData.trackColor || progress.themeStyle.linearTrackColor), progress.themeStyle.trackOpacity, '0', progress.getPathLine(progress.progressRect.x, linearTrackWidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness)));
        linearTrack = progress.renderer.drawPath(option);
        if (progress.segmentCount > 1) {
            progress.segmentSize = progress.calculateSegmentSize(linearTrackWidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness));
            linearTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round') {
            linearTrack.setAttribute('stroke-linecap', 'round');
        }
        linearTrackGroup.appendChild(linearTrack);
        progress.svgObject.appendChild(linearTrackGroup);
    }
    /** To render the linear progress  */
    renderLinearProgress(refresh, previousWidth = 0) {
        let progress = this.progress;
        let linearBufferWidth;
        let secondaryProgressWidth;
        let option;
        let linearProgress;
        let progressWidth;
        let linearProgressWidth;
        let clipPathLinear;
        let clipPathIndeterminate;
        let linearProgressGroup;
        let animationdelay;
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderLinearBuffer(progress);
        }
        if (progress.argsData.value !== null) {
            progressWidth = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.argsData.value);
            progress.progressPreviousWidth = linearProgressWidth = progress.progressRect.width *
                ((progress.isIndeterminate) ? 1 : progressWidth);
            linearProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearProgressGroup' });
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate) {
                linearProgress = this.segment.createLinearSegment(progress, '_LinearProgressSegment', linearProgressWidth, progress.themeStyle.progressOpacity, (progress.progressThickness || progress.themeStyle.linearProgressThickness));
            }
            else {
                if (!refresh) {
                    option = new PathOption(progress.element.id + '_Linearprogress', 'none', (progress.progressThickness || progress.themeStyle.linearProgressThickness), (progress.argsData.progressColor || progress.themeStyle.linearProgressColor), progress.themeStyle.progressOpacity, '0', progress.getPathLine(progress.progressRect.x, linearProgressWidth, (progress.progressThickness || progress.themeStyle.linearProgressThickness)));
                    linearProgress = progress.renderer.drawPath(option);
                }
                else {
                    linearProgress = getElement(progress.element.id + '_Linearprogress');
                    linearProgress.setAttribute('d', progress.getPathLine(progress.progressRect.x, linearProgressWidth, (progress.progressThickness || progress.themeStyle.linearProgressThickness)));
                    linearProgress.setAttribute('stroke', progress.argsData.progressColor || progress.themeStyle.circularProgressColor);
                }
                if (progress.segmentCount > 1) {
                    linearProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && progressWidth) {
                    linearProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            linearProgressGroup.appendChild(linearProgress);
            if (progress.animation.enable && !progress.isIndeterminate) {
                if ((progress.secondaryProgress !== null)) {
                    secondaryProgressWidth = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.secondaryProgress);
                    linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
                    animationdelay = progress.animation.delay + (linearBufferWidth - linearProgressWidth);
                }
                else {
                    animationdelay = progress.animation.delay;
                }
                /** used for label animation delay */
                this.delay = animationdelay;
                clipPathLinear = progress.createClipPath(progress.clipPath, progressWidth, null, refresh ? previousWidth : progress.progressRect.x, refresh, (progress.progressThickness || progress.themeStyle.linearProgressThickness));
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearAnimation(clipPathLinear, progress, animationdelay, refresh ? previousWidth : 0);
            }
            if (progress.isIndeterminate) {
                clipPathIndeterminate = progress.createClipPath(progress.clipPath, progressWidth, null, refresh ? previousWidth : progress.progressRect.x, refresh, (progress.progressThickness || progress.themeStyle.linearProgressThickness));
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearIndeterminate(clipPathIndeterminate, progress);
            }
            progress.svgObject.appendChild(linearProgressGroup);
        }
    }
    /** To render the linear buffer */
    renderLinearBuffer(progress) {
        let linearBuffer;
        let secondaryProgressWidth;
        let clipPathBuffer;
        let linearBufferGroup;
        let linearBufferWidth;
        let option;
        secondaryProgressWidth = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.secondaryProgress);
        linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
        linearBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearBufferGroup' });
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate) {
            linearBuffer = this.segment.createLinearSegment(progress, '_LinearBufferSegment', linearBufferWidth, progress.themeStyle.bufferOpacity, (progress.progressThickness || progress.themeStyle.linearProgressThickness));
        }
        else {
            option = new PathOption(progress.element.id + '_Linearbuffer', 'none', (progress.progressThickness || progress.themeStyle.linearProgressThickness), (progress.argsData.progressColor || progress.themeStyle.linearProgressColor), progress.themeStyle.bufferOpacity, '0', progress.getPathLine(progress.progressRect.x, linearBufferWidth, (progress.progressThickness || progress.themeStyle.linearProgressThickness)));
            linearBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1) {
                linearBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round') {
                linearBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        linearBufferGroup.appendChild(linearBuffer);
        if (progress.animation.enable) {
            clipPathBuffer = progress.createClipPath(progress.bufferClipPath, secondaryProgressWidth, null, progress.progressRect.x, false, (progress.progressThickness || progress.themeStyle.linearProgressThickness));
            linearBufferGroup.appendChild(progress.bufferClipPath);
            linearBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doLinearAnimation(clipPathBuffer, progress, progress.animation.delay, 0);
        }
        progress.svgObject.appendChild(linearBufferGroup);
    }
    /** Render the Linear Label */
    renderLinearLabel() {
        let padding = 10;
        let linearlabel;
        let linearValue;
        let posX;
        let posY;
        let end;
        let argsData;
        let textSize;
        let progress = this.progress;
        let labelValue;
        let percentage = 100;
        let option;
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        linearValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        argsData = {
            cancel: false, text: progress.label ? progress.label : String(linearValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            posX = progress.progressRect.width * progress.calculateProgressRange(progress.minimum, progress.maximum, progress.value);
            if (posX) {
                posX = (progress.enableRtl) ?
                    ((progress.progressRect.width - posX) + textSize.width) : posX - padding;
            }
            else {
                posX = (progress.enableRtl) ? (progress.progressRect.width) : (progress.progressRect.x + padding);
            }
            posY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 4);
            option = new TextOption(progress.element.id + '_linearLabel', progress.labelStyle.size || progress.themeStyle.linearFontSize, progress.labelStyle.fontStyle || progress.themeStyle.linearFontStyle, progress.labelStyle.fontFamily || progress.themeStyle.linearFontFamily, progress.labelStyle.fontWeight, 'middle', argsData.color || progress.themeStyle.fontColor, posX, posY);
            linearlabel = progress.renderer.createText(option, argsData.text);
            progress.svgObject.appendChild(linearlabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                end = progress.progressRect.width * progress.calculateProgressRange(progress.minimum, progress.maximum, progress.value);
                this.animation.doLabelAnimation(linearlabel, 0, end, progress, this.delay);
            }
        }
    }
}

/**
 * Progressbar of type circular
 */
class Circular {
    constructor(progress) {
        this.segment = new Segment();
        this.animation = new ProgressAnimation();
        this.progress = progress;
    }
    /** To render the circular track */
    renderCircularTrack() {
        let progress = this.progress;
        let centerX;
        let centerY;
        let size;
        let radius;
        let startAngle;
        let endAngle;
        let circularTrack;
        let circularPath;
        let trackThickness;
        let option;
        let fill;
        let strokeWidth;
        let circularTrackGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularTrackGroup' });
        startAngle = progress.startAngle;
        progress.totalAngle = (progress.endAngle - progress.startAngle) % 360;
        progress.totalAngle = (progress.totalAngle <= 0 ? (360 + progress.totalAngle) : progress.totalAngle);
        progress.totalAngle -= (progress.totalAngle === 360) ? 0.01 : 0;
        endAngle = (progress.startAngle + ((progress.enableRtl) ? -progress.totalAngle : +progress.totalAngle)) % 360;
        centerX = progress.progressRect.x + (progress.progressRect.width / 2);
        centerY = progress.progressRect.y + (progress.progressRect.height / 2);
        trackThickness = Math.max(progress.trackThickness, progress.progressThickness) ||
            Math.max(progress.themeStyle.circularProgressThickness, progress.themeStyle.circularTrackThickness);
        size = (Math.min(progress.progressRect.height, progress.progressRect.width) / 2) - trackThickness / 2;
        radius = stringToNumber(progress.radius, size);
        radius = (radius === null) ? 0 : radius;
        fill = (progress.enablePieProgress) ? (progress.argsData.trackColor || progress.themeStyle.circularTrackColor) : 'none';
        strokeWidth = (progress.enablePieProgress) ? 0 : (progress.trackThickness || progress.themeStyle.circularTrackThickness);
        circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
        option = new PathOption(progress.element.id + '_Circulartrack', fill, strokeWidth, (progress.argsData.trackColor || progress.themeStyle.circularTrackColor), progress.themeStyle.trackOpacity, '0', circularPath);
        circularTrack = progress.renderer.drawPath(option);
        progress.trackwidth = circularTrack.getTotalLength();
        if (progress.segmentCount > 1 && !progress.enablePieProgress) {
            progress.segmentSize = progress.calculateSegmentSize(progress.trackwidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness));
            circularTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && !progress.enablePieProgress) {
            circularTrack.setAttribute('stroke-linecap', 'round');
        }
        circularTrackGroup.appendChild(circularTrack);
        progress.svgObject.appendChild(circularTrackGroup);
    }
    /** To render the circular progress */
    renderCircularProgress(previousStart, previousEnd, refresh) {
        let progress = this.progress;
        let centerX;
        let centerY;
        let size;
        let endAngle;
        let radius;
        let startAngle = progress.startAngle;
        let previousPath;
        progress.progressStartAngle = startAngle;
        let circularPath;
        let progressEnd;
        let circularProgress;
        let option;
        let progressThickness;
        let linearClipPath;
        let rDiff;
        let progressSegment;
        let circularProgressGroup;
        let fill;
        let strokeWidth;
        centerX = progress.progressRect.x + (progress.progressRect.width / 2);
        centerY = progress.progressRect.y + (progress.progressRect.height / 2);
        progressThickness = Math.max(progress.trackThickness, progress.progressThickness) ||
            Math.max(progress.themeStyle.circularProgressThickness, progress.themeStyle.circularTrackThickness);
        size = (Math.min(progress.progressRect.height, progress.progressRect.width) / 2) - progressThickness / 2;
        radius = stringToNumber(progress.innerRadius, size);
        radius = (radius === null) ? 0 : radius;
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderCircularBuffer(progress, centerX, centerY, radius, startAngle);
        }
        if (progress.argsData.value !== null) {
            circularProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularProgressGroup' });
            progressEnd = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.argsData.value);
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress) {
                circularProgress = this.segment.createCircularSegment(progress, '_CircularProgressSegment', centerX, centerY, radius, progress.argsData.value, progress.themeStyle.progressOpacity, (progress.progressThickness || progress.themeStyle.circularProgressThickness));
            }
            else {
                endAngle = ((progress.isIndeterminate) ? (progress.startAngle + ((progress.enableRtl) ? -progress.totalAngle : +progress.totalAngle)) % 360 : progressEnd);
                circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
                fill = (progress.enablePieProgress) ?
                    (progress.argsData.progressColor || progress.themeStyle.circularProgressColor) : 'none';
                strokeWidth = (progress.enablePieProgress) ? 0 :
                    (progress.progressThickness || progress.themeStyle.circularProgressThickness);
                option = new PathOption(progress.element.id + '_Circularprogress', fill, strokeWidth, (progress.argsData.progressColor || progress.themeStyle.circularProgressColor), progress.themeStyle.progressOpacity, '0', circularPath);
                if (!refresh) {
                    circularProgress = progress.renderer.drawPath(option);
                }
                else {
                    circularProgress = getElement(progress.element.id + '_Circularprogress');
                    previousPath = circularProgress.getAttribute('d');
                    circularProgress.setAttribute('d', circularPath);
                    circularProgress.setAttribute('stroke', progress.argsData.progressColor || progress.themeStyle.circularProgressColor);
                }
                if (progress.segmentCount > 1 && !progress.enablePieProgress) {
                    rDiff = parseInt(progress.radius, 10) - parseInt(progress.innerRadius, 10);
                    if (rDiff !== 0) {
                        progressSegment = progress.trackwidth + ((rDiff < 0) ? (progress.trackwidth * Math.abs(rDiff)) / parseInt(progress.radius, 10) :
                            -(progress.trackwidth * Math.abs(rDiff)) / parseInt(progress.radius, 10));
                        progress.segmentSize = progress.calculateSegmentSize(progressSegment, (progress.progressThickness || progress.themeStyle.circularProgressThickness));
                    }
                    circularProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && startAngle !== endAngle) {
                    circularProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            progress.progressEndAngle = endAngle;
            if (!refresh) {
                circularProgressGroup.appendChild(circularProgress);
                progress.svgObject.appendChild(circularProgressGroup);
            }
            if (progress.animation.enable && !progress.isIndeterminate) {
                let circulardelay = (progress.secondaryProgress !== null) ? 300 : progress.animation.delay;
                this.delay = circulardelay;
                linearClipPath = progress.createClipPath(progress.clipPath, null, refresh ? previousPath : '', null, refresh);
                circularProgressGroup.appendChild(progress.clipPath);
                circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doCircularAnimation(centerX, centerY, radius, startAngle, progressEnd, progress.value, linearClipPath, progress, (progress.progressThickness || progress.themeStyle.circularProgressThickness), circulardelay, refresh ? previousEnd : null);
            }
            if (progress.isIndeterminate) {
                linearClipPath = progress.createClipPath(progress.clipPath, null, refresh ? previousPath : '', null, refresh);
                circularProgressGroup.appendChild(progress.clipPath);
                circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doCircularIndeterminate(linearClipPath, progress, startAngle, progressEnd, centerX, centerY, radius, (progress.progressThickness || progress.themeStyle.circularProgressThickness));
            }
            progress.svgObject.appendChild(circularProgressGroup);
        }
    }
    /** To render the circular buffer */
    renderCircularBuffer(progress, centerX, centerY, radius, startAngle) {
        let bufferClipPath;
        let bufferEnd;
        let circularBuffer;
        let radiusDiff;
        let circularBufferGroup;
        let circularPath;
        let option;
        let progressSegment;
        let fill;
        let strokeWidth;
        circularBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_ CircularBufferGroup' });
        bufferEnd = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.secondaryProgress);
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress) {
            circularBuffer = this.segment.createCircularSegment(progress, '_CircularBufferSegment', centerX, centerY, radius, progress.secondaryProgress, progress.themeStyle.bufferOpacity, (progress.progressThickness || progress.themeStyle.circularProgressThickness));
        }
        else {
            circularPath = getPathArc(centerX, centerY, radius, startAngle, bufferEnd, progress.enableRtl, progress.enablePieProgress);
            fill = (progress.enablePieProgress) ? (progress.argsData.progressColor || progress.themeStyle.circularProgressColor) : 'none';
            strokeWidth = (progress.enablePieProgress) ? 0 : (progress.progressThickness || progress.themeStyle.circularProgressThickness);
            option = new PathOption(progress.element.id + '_Circularbuffer', fill, strokeWidth, (progress.argsData.progressColor || progress.themeStyle.circularProgressColor), progress.themeStyle.bufferOpacity, '0', circularPath);
            circularBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1 && !progress.enablePieProgress) {
                radiusDiff = parseInt(progress.radius, 10) - parseInt(progress.innerRadius, 10);
                if (radiusDiff !== 0) {
                    progressSegment = progress.trackwidth + ((radiusDiff < 0) ? (progress.trackwidth * Math.abs(radiusDiff)) / parseInt(progress.radius, 10) :
                        -(progress.trackwidth * Math.abs(radiusDiff)) / parseInt(progress.radius, 10));
                    progress.segmentSize = progress.calculateSegmentSize(progressSegment, (progress.progressThickness || progress.themeStyle.circularProgressThickness));
                }
                circularBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round') {
                circularBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        circularBufferGroup.appendChild(circularBuffer);
        if (progress.animation.enable) {
            bufferClipPath = progress.createClipPath(progress.bufferClipPath, null, '', null, false);
            circularBufferGroup.appendChild(progress.bufferClipPath);
            circularBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doCircularAnimation(centerX, centerY, radius, startAngle, bufferEnd, progress.secondaryProgress, bufferClipPath, progress, (progress.progressThickness || progress.themeStyle.circularProgressThickness), progress.animation.delay, null);
        }
        progress.svgObject.appendChild(circularBufferGroup);
    }
    /** To render the circular Label */
    renderCircularLabel() {
        let end;
        let circularLabel;
        let circularValue;
        let centerX;
        let centerY;
        let argsData;
        let textSize;
        let progress = this.progress;
        let labelValue;
        let percentage = 100;
        let option;
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        circularValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        argsData = {
            cancel: false, text: progress.label ? progress.label : String(circularValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            centerX = progress.progressRect.x + (progress.progressRect.width / 2);
            centerY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 2);
            option = new TextOption(progress.element.id + '_circularLabel', progress.labelStyle.size || progress.themeStyle.circularFontSize, progress.labelStyle.fontStyle || progress.themeStyle.circularFontStyle, progress.labelStyle.fontFamily || progress.themeStyle.circularFontFamily, progress.labelStyle.fontWeight, 'middle', argsData.color || progress.themeStyle.fontColor, centerX, centerY, progress.progressRect.width, progress.progressRect.height);
            circularLabel = progress.renderer.createText(option, argsData.text);
            progress.svgObject.appendChild(circularLabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                end = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
                end = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : end;
                this.animation.doLabelAnimation(circularLabel, progress.startAngle, end, progress, this.delay);
            }
        }
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
        /** @private */
        this.linear = new Linear(this);
        /** @private */
        this.circular = new Circular(this);
        /** @private */
        this.annotateAnimation = new ProgressAnimation();
    }
    getModuleName() {
        return 'progressbar';
    }
    preRender() {
        this.unWireEvents();
        this.initPrivateVariable();
        this.wireEvents();
    }
    initPrivateVariable() {
        this.progressRect = new Rect(0, 0, 0, 0);
        this.progressSize = new Size(0, 0);
    }
    render() {
        this.trigger('load', { progressBar: this });
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
        this.calculateProgressBarSize();
        this.setTheme();
        this.createSVG();
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
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
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width = this.progressSize.width - (this.margin.left + this.margin.right);
        this.progressRect.height = this.progressSize.height - (this.margin.top + this.margin.bottom);
    }
    /**
     * Render Annotation
     */
    renderAnnotations() {
        this.createSecElement();
        this.renderAnnotation();
        this.setSecondaryElementPosition();
    }
    /**
     * Render SVG Element
     */
    renderElements() {
        this.renderTrack();
        this.renderProgress();
        this.renderAnnotations();
        this.renderLabel();
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
        this.removeSvg();
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
    renderTrack() {
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
            this.linear.renderLinearTrack();
        }
        else if (this.type === 'Circular') {
            this.circular.renderCircularTrack();
        }
    }
    renderProgress() {
        this.clipPathElement();
        if (this.type === 'Linear') {
            this.linear.renderLinearProgress();
        }
        else if (this.type === 'Circular') {
            this.circular.renderCircularProgress();
        }
        this.element.appendChild(this.svgObject);
    }
    renderLabel() {
        if (this.type === 'Linear' && this.showProgressValue && !this.isIndeterminate) {
            this.linear.renderLinearLabel();
        }
        else if (this.type === 'Circular' && this.showProgressValue && !this.isIndeterminate) {
            this.circular.renderCircularLabel();
        }
    }
    getPathLine(x, width, thickness) {
        let moveTo = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        let lineTo = (this.enableRtl) ? ((this.cornerRadius === 'Round' && width) ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round' && width) ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
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
        let posx;
        let posy;
        let pathWidth;
        if (this.type === 'Linear') {
            if (!refresh) {
                posx = (this.enableRtl) ? (x + this.progressRect.width) : x;
                posx += (this.cornerRadius === 'Round') ?
                    ((this.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
                posy = (this.progressRect.y + (this.progressRect.height / 2)) - (thickness / 2);
                pathWidth = this.progressRect.width * width;
                pathWidth += (this.cornerRadius === 'Round') ? (lineCapRadius * thickness) : 0;
                rect = new RectOption(this.element.id + '_clippathrect', 'transparent', 1, 'transparent', 1, new Rect(posx, posy, thickness, pathWidth));
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
    /**
     * Theming for progress bar
     */
    setTheme() {
        this.themeStyle = getProgressThemeColor(this.theme);
        switch (this.theme) {
            case 'Bootstrap':
            case 'Bootstrap4':
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Round' : this.cornerRadius;
                break;
            default:
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Square' : this.cornerRadius;
        }
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
            this.secElement.innerHTML = '';
            this.calculateProgressBarSize();
            this.createSVG();
            this.renderElements();
        }, 500);
        return false;
    }
    progressMouseClick(e) {
        this.mouseEvent(mouseClick, e);
    }
    progressMouseDown(e) {
        this.mouseEvent(mouseDown, e);
    }
    progressMouseMove(e) {
        this.mouseEvent(mouseMove, e);
    }
    progressMouseUp(e) {
        this.mouseEvent(mouseUp, e);
    }
    progressMouseLeave(e) {
        this.mouseEvent(mouseLeave, e);
    }
    mouseEvent(eventName, e) {
        let element = e.target;
        this.trigger(eventName, { target: element.id });
    }
    /**
     * Method to un-bind events for progress bar
     */
    unWireEvents() {
        let startEvent = Browser.touchStartEvent;
        let moveEvent = Browser.touchMoveEvent;
        let stopEvent = Browser.touchEndEvent;
        /*! Find the Events type */
        let cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, 'click', this.progressMouseClick);
        EventHandler.remove(this.element, startEvent, this.progressMouseDown);
        EventHandler.remove(this.element, moveEvent, this.progressMouseMove);
        EventHandler.remove(this.element, stopEvent, this.progressMouseUp);
        EventHandler.remove(this.element, cancelEvent, this.progressMouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBounds);
    }
    /**
     * Method to bind events for bullet chart
     */
    wireEvents() {
        let startEvent = Browser.touchStartEvent;
        let moveEvent = Browser.touchMoveEvent;
        let stopEvent = Browser.touchEndEvent;
        /*! Find the Events type */
        let cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, 'click', this.progressMouseClick, this);
        EventHandler.add(this.element, startEvent, this.progressMouseDown, this);
        EventHandler.add(this.element, moveEvent, this.progressMouseMove, this);
        EventHandler.add(this.element, stopEvent, this.progressMouseUp, this);
        EventHandler.add(this.element, cancelEvent, this.progressMouseLeave, this);
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
                    if (this.animation.enable && !this.isIndeterminate) {
                        let annotationElement = document.getElementById(this.element.id + 'Annotation0').children[0];
                        this.annotateAnimation.doAnnotationAnimation(annotationElement, this);
                    }
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
                        this.circular.renderCircularProgress(this.progressStartAngle, this.progressEndAngle, true);
                    }
                    else {
                        this.linear.renderLinearProgress(true, this.progressPreviousWidth);
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
    Property(false)
], ProgressBar.prototype, "enablePieProgress", void 0);
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
    Event()
], ProgressBar.prototype, "mouseClick", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "mouseMove", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "mouseUp", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "mouseDown", void 0);
__decorate([
    Event()
], ProgressBar.prototype, "mouseLeave", void 0);
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

export { ProgressBar, Margin, Font, Animation$1 as Animation, ProgressAnnotationSettings, ProgressAnnotation, Rect, Size, RectOption, TextOption, degreeToLocation, getPathArc, stringToNumber, effect, annotationRender, getElement$1 as getElement, removeElement, ProgressLocation, ProgressAnimation };
//# sourceMappingURL=ej2-progressbar.es2015.js.map
