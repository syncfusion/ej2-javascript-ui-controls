window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Progressbar = (function () {
'use strict';

var LINECAPRADIUS = 0.9;
var SPACE = ' ';
var SfProgressbar = /** @class */ (function () {
    function SfProgressbar(element, dotNetRef) {
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }
    SfProgressbar.prototype.wireEvents = function () {
        // tslint:disable-next-line:max-line-length
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.reSize.bind(this));
    };
    SfProgressbar.prototype.reSize = function () {
        if (this.dotNetRef && !this.cancelResize) {
            this.dotNetRef.invokeMethodAsync('TriggerReSize');
        }
    };
    // tslint:disable-next-line:max-line-length
    SfProgressbar.prototype.getPathArc = function (x, y, radius, startAngle, endAngle, enableRtl, pieView) {
        var start = this.degreeToLocation(x, y, radius, startAngle);
        var end = this.degreeToLocation(x, y, radius, endAngle);
        var largeArcFlag = '0';
        var sweepFlag = (enableRtl) ? '0' : '1';
        if (!enableRtl) {
            largeArcFlag = ((endAngle >= startAngle) ? endAngle : endAngle + 360) - startAngle <= 180 ? '0' : '1';
        }
        else {
            largeArcFlag = ((startAngle >= endAngle) ? startAngle : startAngle + 360) - endAngle <= 180 ? '0' : '1';
        }
        var d;
        if (pieView) {
            d = 'M ' + x + SPACE + y + ' L ' + start.x + SPACE + start.y + ' A ' + radius + SPACE +
                radius + SPACE + ' 0 ' + SPACE + largeArcFlag + SPACE + sweepFlag + SPACE + end.x + SPACE + end.y + SPACE + 'Z';
        }
        else {
            d = 'M' + start.x + SPACE + start.y +
                'A' + radius + SPACE + radius + SPACE + '0' + SPACE + largeArcFlag + SPACE + sweepFlag + SPACE + end.x + SPACE + end.y;
        }
        return d;
    };
    SfProgressbar.prototype.degreeToLocation = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };
    SfProgressbar.prototype.effect = function (currentTime, startValue, endValue, duration, enableRtl) {
        // tslint:disable-next-line:max-line-length
        return (enableRtl ? endValue : -endValue) * Math.cos(currentTime / duration * (Math.PI / 2)) + (startValue + (enableRtl ? -endValue : endValue));
    };
    SfProgressbar.prototype.activeAnimate = function (time, start, end, enableRtl) {
        var activeTime = 1 - Math.pow(1 - time, 3);
        return start + (!enableRtl ? activeTime * end : -activeTime * end);
    };
    SfProgressbar.prototype.getPathLine = function (x, animateData) {
        // tslint:disable-next-line:max-line-length
        var moveTo = animateData.enableRtl ? animateData.cornerRadius === 'Round' ? (x + animateData.rectWidth) - ((LINECAPRADIUS / 2) * animateData.thickness) : (x + animateData.rectWidth) :
            animateData.cornerRadius === 'Round' ? (x + (LINECAPRADIUS / 2) * animateData.thickness) : x;
        // tslint:disable-next-line:max-line-length
        var lineTo = animateData.enableRtl ? animateData.cornerRadius === 'Round' && animateData.progressWidth ? (moveTo - animateData.progressWidth + (LINECAPRADIUS * animateData.thickness)) : moveTo - animateData.progressWidth :
            animateData.cornerRadius === 'Round' && animateData.progressWidth ? moveTo + animateData.progressWidth - (LINECAPRADIUS * animateData.thickness) : moveTo + animateData.progressWidth;
        // tslint:disable-next-line:max-line-length
        return 'M' + moveTo + SPACE + (animateData.rectX + (animateData.rectHeight / 2)) + 'L' + lineTo + ' ' + (animateData.rectY + (animateData.rectHeight / 2));
    };
    SfProgressbar.prototype.circularAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement = document.getElementById(this.element.id + '_clippathcircle');
        var end = 0;
        if (progressElement && this.circularData) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.circularData.duration,
                delay: this.circularData.delay,
                progress: function (args) {
                    _this.cancelResize = true;
                    if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (_this.circularData.isActive) {
                            // tslint:disable-next-line:max-line-length
                            end = _this.activeAnimate((args.timeStamp / args.duration), _this.circularData.startPos, _this.circularData.endPos, _this.circularData.enableRtl);
                            var activeElement = document.getElementById(_this.element.id + '_CircularActiveProgress');
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', _this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                            }
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            end = _this.effect(args.timeStamp, _this.circularData.startPos, _this.circularData.endPos, args.duration, _this.circularData.enableRtl);
                        }
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', _this.getPathArc(_this.circularData.x, _this.circularData.y, _this.circularData.pathRadius, _this.circularData.start, end % 360, _this.circularData.enableRtl, true));
                    }
                },
                end: function () {
                    _this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    progressElement.setAttribute('d', _this.getPathArc(_this.circularData.x, _this.circularData.y, _this.circularData.pathRadius, _this.circularData.start, _this.circularData.progressEnd, _this.circularData.enableRtl, true));
                    if (_this.circularData.isActive) {
                        _this.circularAnimation();
                    }
                    _this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    };
    SfProgressbar.prototype.circularBufferAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement = document.getElementById(this.element.id + '_clippathBuffercircle');
        var end = 0;
        if (progressElement && this.circularBufferData) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.circularBufferData.duration,
                delay: this.circularBufferData.delay,
                progress: function (args) {
                    _this.cancelResize = true;
                    if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        end = _this.effect(args.timeStamp, _this.circularBufferData.startPos, _this.circularBufferData.endPos, args.duration, _this.circularBufferData.enableRtl);
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', _this.getPathArc(_this.circularBufferData.x, _this.circularBufferData.y, _this.circularBufferData.pathRadius, _this.circularBufferData.start, end % 360, _this.circularBufferData.enableRtl, true));
                    }
                },
                end: function () {
                    _this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    progressElement.setAttribute('d', _this.getPathArc(_this.circularBufferData.x, _this.circularBufferData.y, _this.circularBufferData.pathRadius, _this.circularBufferData.start, _this.circularBufferData.progressEnd, _this.circularBufferData.enableRtl, true));
                    _this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    };
    SfProgressbar.prototype.circularIndeterminateAnimation = function (start, end) {
        var _this = this;
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = 0; }
        var progressElement = document.getElementById(this.element.id + '_clippathcircle');
        var animation = new sf.base.Animation({});
        if (progressElement && this.circularData) {
            animation.destroy();
            animation.animate((progressElement), {
                duration: this.circularData.duration,
                delay: 0,
                progress: function () {
                    if (_this.circularData && _this.circularData.enable && _this.circularData.isIndeterminate) {
                        progressElement.style.visibility = 'visible';
                        start += _this.circularData.enableRtl ? -_this.circularData.segmentValue : _this.circularData.segmentValue;
                        end += _this.circularData.enableRtl ? -_this.circularData.segmentValue : _this.circularData.segmentValue;
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', _this.getPathArc(_this.circularData.x, _this.circularData.y, _this.circularData.pathRadius, start % 360, end % 360, _this.circularData.enableRtl, !_this.circularData.enableProgressSegments));
                    }
                },
                end: function () {
                    if (_this.circularData && _this.circularData.enable && _this.circularData.isIndeterminate) {
                        _this.circularIndeterminateAnimation(start, end);
                    }
                }
            });
        }
    };
    SfProgressbar.prototype.annotationAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement;
        var annotatElementChanged;
        var annotatElement = document.getElementById(this.element.id + 'Annotation0').children[0];
        if (annotatElement && annotatElement.children[0]) {
            if (annotatElement.children[0].tagName === 'SPAN') {
                annotatElementChanged = annotatElement.children[0];
            }
        }
        if (annotatElementChanged && this.annotationData) {
            if (this.annotationData.type === 'Linear') {
                progressElement = document.getElementById(this.element.id + '_clippathrect');
            }
            else {
                progressElement = document.getElementById(this.element.id + '_clippathcircle');
            }
            if (this.annotationData.isContent) {
                annotatElementChanged.innerHTML = this.annotationData.annotateValue + '%';
            }
            else if (progressElement) {
                animation.animate((progressElement), {
                    duration: this.annotationData.duration,
                    delay: this.annotationData.delay,
                    progress: function (args) {
                        _this.cancelResize = true;
                        // tslint:disable-next-line:max-line-length
                        var effectValue = _this.effect(args.timeStamp, _this.annotationData.startPos, _this.annotationData.endPos, args.duration, false);
                        // tslint:disable-next-line:max-line-length
                        var annotateValueChanged = parseInt((((Math.round(effectValue) - _this.annotationData.start) / _this.annotationData.totalAngle) * 100).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    },
                    end: function () {
                        _this.cancelResize = false;
                        annotatElementChanged.innerHTML = _this.annotationData.annotateValue + '%';
                    }
                });
            }
        }
    };
    SfProgressbar.prototype.labelAnimation = function () {
        var _this = this;
        var labelElement;
        if (this.labelData) {
            labelElement = this.labelData.type === 'Linear' ? document.getElementById(this.element.id + '_linearLabel') : document.getElementById(this.element.id + '_circularLabel');
        }
        var animation = new sf.base.Animation({});
        var labelAnimation = new sf.base.Animation({});
        if (labelElement && this.labelData && !this.labelData.isStriped) {
            labelElement.style.visibility = 'hidden';
            animation.animate((labelElement), {
                duration: this.labelData.duration,
                delay: this.labelData.delay,
                progress: function (args) {
                    _this.cancelResize = true;
                    if (_this.labelData.type === 'Linear' && args.timeStamp >= args.delay && _this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        var effectValue = _this.effect(args.timeStamp, 0, _this.labelData.end, args.duration, false);
                        var valueChanged = parseInt(((effectValue / _this.labelData.width) * 100).toString(), 10);
                        labelElement.innerHTML = valueChanged.toString() + '%';
                        if (_this.labelData.labelPos === 'Far' || _this.labelData.labelPos === 'Center') {
                            // tslint:disable-next-line:max-line-length
                            var xPos = _this.effect(args.timeStamp, _this.labelData.startPos, _this.labelData.endPos, args.duration, _this.labelData.enableRtl);
                            labelElement.setAttribute('x', xPos.toString());
                        }
                    }
                    else if (_this.labelData.type === 'Circular' && _this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        var effectValue = _this.effect(args.timeStamp, _this.labelData.start, _this.labelData.end, args.duration, false);
                        // tslint:disable-next-line:max-line-length
                        var valueChanged = parseInt((((effectValue - _this.labelData.start) / _this.labelData.totalAngle) * 100).toString(), 10);
                        labelElement.innerHTML = valueChanged.toString() + '%';
                    }
                },
                end: function () {
                    _this.cancelResize = false;
                    if (labelElement && _this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        labelElement.innerHTML = _this.labelData.text;
                        labelElement.setAttribute('x', _this.labelData.x.toString());
                    }
                    else {
                        labelAnimation.animate(labelElement, {
                            progress: function (args) {
                                labelElement.style.visibility = 'visible';
                                var effectValue = _this.effect(args.timeStamp, 0, 1, args.duration, false);
                                labelElement.setAttribute('opacity', effectValue.toString());
                            },
                            end: function () {
                                labelElement.setAttribute('opacity', '1');
                            }
                        });
                    }
                }
            });
        }
    };
    SfProgressbar.prototype.stripeAnimation = function (pointValue) {
        var _this = this;
        if (pointValue === void 0) { pointValue = 0; }
        var animation = new sf.base.Animation({});
        var stripElement = document.getElementById(this.element.id + '_LinearStriped');
        if (stripElement && this.stripeData) {
            animation.animate((stripElement), {
                duration: this.stripeData.duration,
                delay: this.stripeData.delay,
                progress: function () {
                    if (_this.stripeData.enable) {
                        pointValue += _this.stripeData.enableRtl ? -_this.stripeData.durationValue : _this.stripeData.durationValue;
                        stripElement.setAttribute('gradientTransform', 'translate(' + pointValue + ') rotate(-45)');
                    }
                },
                end: function () {
                    if (_this.stripeData.enable) {
                        _this.stripeAnimation(pointValue);
                    }
                }
            });
        }
    };
    SfProgressbar.prototype.linearIndeterminateAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement = document.getElementById(this.element.id + '_clippathrect');
        if (progressElement && this.lineardata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.lineardata.duration,
                delay: 0,
                progress: function (args) {
                    progressElement.style.visibility = 'visible';
                    // tslint:disable-next-line:max-line-length
                    if (_this.lineardata.enableRtl && _this.lineardata.enableRtl && _this.lineardata.enable && _this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        var xValue = _this.effect(args.timeStamp, _this.lineardata.x || _this.lineardata.rectX + _this.lineardata.progressWidth, _this.lineardata.end, args.duration, _this.lineardata.enableRtl);
                        if (!_this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', xValue.toString());
                        }
                        else {
                            progressElement.setAttribute('d', _this.getPathLine(xValue, _this.lineardata));
                        }
                    }
                    else if (_this.lineardata.enable && _this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        var xValue = _this.effect(args.timeStamp, _this.lineardata.start, _this.lineardata.end, args.duration, _this.lineardata.enableRtl);
                        if (!_this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', xValue.toString());
                        }
                        else {
                            progressElement.setAttribute('d', _this.getPathLine(xValue, _this.lineardata));
                        }
                    }
                },
                end: function () {
                    if (_this.lineardata && _this.lineardata.enable && _this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        if (_this.lineardata.enableRtl && !_this.lineardata.enableProgressSegments && !(_this.lineardata.cornerRadius === 'Round4px')) {
                            progressElement.setAttribute('x', _this.lineardata.x.toString());
                        }
                        else if (!_this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', _this.lineardata.start.toString());
                        }
                        _this.linearIndeterminateAnimation();
                        _this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                    }
                }
            });
        }
    };
    SfProgressbar.prototype.linearAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement = document.getElementById(this.element.id + '_clippathrect');
        var widthValue = 0;
        if (progressElement && this.lineardata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.lineardata.duration,
                delay: this.lineardata.delay,
                progress: function (args) {
                    _this.cancelResize = true;
                    if (_this.lineardata.enableRtl && _this.lineardata.cornerRadius !== 'Round4px' && args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (_this.lineardata.isActive) {
                            var activeElement = document.getElementById(_this.element.id + '_LinearActiveProgress');
                            // tslint:disable-next-line:max-line-length
                            widthValue = _this.activeAnimate((args.timeStamp / args.duration), _this.lineardata.x, _this.lineardata.width, true);
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', _this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                                progressElement.setAttribute('x', widthValue.toString());
                            }
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('x', _this.effect(args.timeStamp, _this.lineardata.start, _this.lineardata.end, args.duration, true).toString());
                        }
                    }
                    else if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (_this.lineardata.isActive) {
                            var activeElement = document.getElementById(_this.element.id + '_LinearActiveProgress');
                            // tslint:disable-next-line:max-line-length
                            widthValue = _this.activeAnimate((args.timeStamp / args.duration), 0, _this.lineardata.width, _this.lineardata.enableRtl);
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', _this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                                progressElement.setAttribute('width', widthValue.toString());
                            }
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('width', _this.effect(args.timeStamp, _this.lineardata.start, _this.lineardata.end, args.duration, false).toString());
                        }
                    }
                },
                end: function () {
                    _this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    if (_this.lineardata && _this.lineardata.enable && _this.lineardata.enableRtl && _this.lineardata.cornerRadius !== 'Round4px') {
                        if (_this.lineardata.isActive) {
                            progressElement.setAttribute('x', _this.lineardata.x.toString());
                            _this.linearAnimation();
                        }
                        else {
                            progressElement.setAttribute('x', _this.lineardata.rtlX.toString());
                        }
                    }
                    else if (_this.lineardata && _this.lineardata.enable) {
                        progressElement.setAttribute('width', _this.lineardata.width.toString());
                        if (_this.lineardata.isActive) {
                            _this.linearAnimation();
                        }
                    }
                    _this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    };
    SfProgressbar.prototype.linearBufferAnimation = function () {
        var _this = this;
        var animation = new sf.base.Animation({});
        var progressElement = document.getElementById(this.element.id + '_clippathBufferrect');
        if (progressElement && this.linearBufferdata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.linearBufferdata.duration,
                delay: this.linearBufferdata.delay,
                progress: function (args) {
                    _this.cancelResize = true;
                    // tslint:disable-next-line:max-line-length
                    if (_this.linearBufferdata.enableRtl && _this.linearBufferdata.cornerRadius !== 'Round4px' && args.timeStamp >= args.delay) {
                        if (args.timeStamp >= args.delay) {
                            progressElement.style.visibility = 'visible';
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('x', _this.effect(args.timeStamp, _this.linearBufferdata.start, _this.linearBufferdata.end, args.duration, true).toString());
                        }
                    }
                    else if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('width', _this.effect(args.timeStamp, _this.linearBufferdata.start, _this.linearBufferdata.end, args.duration, false).toString());
                    }
                },
                end: function () {
                    _this.cancelResize = false;
                    progressElement.style.visibility = '';
                    // tslint:disable-next-line:max-line-length
                    if (_this.lineardata && _this.linearBufferdata.enable && _this.linearBufferdata.enableRtl && _this.linearBufferdata.cornerRadius !== 'Round4px') {
                        progressElement.setAttribute('x', _this.linearBufferdata.rtlX.toString());
                    }
                    else if (_this.linearBufferdata && _this.linearBufferdata.enable) {
                        progressElement.setAttribute('width', _this.linearBufferdata.width.toString());
                    }
                    _this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    };
    
    return SfProgressbar;
}());
// tslint:disable
var Progressbar = {
    initialize: function (element, height, width, dotNetRef) {
        var layout = new SfProgressbar(element, dotNetRef);
        layout.wireEvents();
        return this.getElementSize(element, height, width);
    },
    setSecondaryElementStyle: function (element) {
        if (element) {
            var svgRect = document.getElementById(element.id + 'SVG').getBoundingClientRect();
            var secElement = document.getElementById(element.id + 'Secondary_Element');
            var elementRect = element.getBoundingClientRect();
            if (secElement && svgRect) {
                secElement.style.visibility = 'visible';
                secElement.style.left = Math.max(svgRect.left - elementRect.left, 0) + 'px';
                secElement.style.top = Math.max(svgRect.top - elementRect.top, 0) + 'px';
            }
        }
    },
    getElementSize: function (element, height, width) {
        var elementWidth;
        var elementHeight;
        if (element) {
            element.style.height = height;
            element.style.width = width;
            var elementRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
            element.style.width = '';
            element.style.height = '';
        }
        return { width: elementWidth, height: elementHeight };
    },
    doLinearBufferAnimation: function (element, animateData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.linearBufferdata = animateData;
            element.blazor__instance.linearBufferAnimation();
        }
    },
    doLinearAnimation: function (element, animateData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.lineardata = animateData;
            element.blazor__instance.linearAnimation();
        }
    },
    doLinearIndeterminate: function (element, animateData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.lineardata = animateData;
            element.blazor__instance.linearIndeterminateAnimation();
        }
    },
    doStripedAnimation: function (element, animateData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.stripeData = animateData;
            element.blazor__instance.stripeAnimation();
        }
    },
    doCircularAnimation: function (element, circularData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularData = circularData;
            element.blazor__instance.circularAnimation();
        }
    },
    doCircularBufferAnimation: function (element, circularData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularBufferData = circularData;
            element.blazor__instance.circularBufferAnimation();
        }
    },
    doCircularIndeterminate: function (element, circularData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularData = circularData;
            element.blazor__instance.circularIndeterminateAnimation(circularData.start, circularData.end);
        }
    },
    doAnnotationAnimation: function (element, annotationData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.annotationData = annotationData;
            element.blazor__instance.annotationAnimation();
        }
    },
    doLabelAnimation: function (element, labelData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.labelData = labelData;
            element.blazor__instance.labelAnimation();
        }
    },
    // tslint:disable-next-line:max-line-length
    update: function (element, animateData, type, labelAnimateData, annotationData) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            if (type === 'Linear') {
                var data = animateData;
                if (data.isStriped) {
                    element.blazor__instance.stripeData = data;
                }
                else {
                    element.blazor__instance.lineardata = data;
                }
            }
            else {
                element.blazor__instance.circularData = animateData;
            }
            if (labelAnimateData) {
                element.blazor__instance.labelData = animateData;
            }
            if (annotationData) {
                element.blazor__instance.annotationData = animateData;
            }
        }
    }
};

return Progressbar;

}());
