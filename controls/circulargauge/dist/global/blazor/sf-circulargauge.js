window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.CircularGauge = (function () {
'use strict';

var SfCircularGauge = /** @class */ (function () {
    // tslint:disable-next-line:max-line-length
    function SfCircularGauge(id, element, options, dotnetRef, individualId) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.element.blazor__instance = this;
        this.individualId = individualId;
    }
    SfCircularGauge.prototype.render = function () {
        this.wireEvents();
    };
    SfCircularGauge.prototype.wireEvents = function () {
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.gaugeOnMouseMove, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.gaugeOnMouseEnd, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchCancelEvent, this.gaugeOnMouseEnd, this);
        sf.base.EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeOnResize.bind(this));
    };
    SfCircularGauge.prototype.gaugeOnMouseClick = function (e) {
        var legendItemsId = ['_Text_', '_Shape_'];
        var targetId = e.target.id;
        if (targetId.indexOf('Legend') !== -1 && this.options.legendToggleVisibility) {
            for (var i = 0; i < legendItemsId.length; i++) {
                var id = legendItemsId[i];
                if (targetId.indexOf(id) !== -1) {
                    // tslint:disable-next-line:radix
                    var axisIndex = parseInt(targetId.split(this.element.id + '_Legend_Axis_')[1].split(id)[0]);
                    // tslint:disable-next-line:radix
                    var rangeIndex = parseInt(targetId.split(this.element.id + '_Legend_Axis_')[1].split(id)[1]);
                    this.dotNetRef.invokeMethodAsync('TriggerLegendClick', e, axisIndex, rangeIndex);
                }
            }
        }
    };
    SfCircularGauge.prototype.gaugeOnResize = function () {
        var elementBounds = document.getElementById(this.element.id);
        if (elementBounds) {
            elementBounds = elementBounds.parentElement;
            var width = elementBounds.clientWidth || elementBounds.offsetWidth;
            var height = elementBounds.clientHeight || elementBounds.offsetHeight;
            this.dotNetRef.invokeMethodAsync('TriggerResizeEvent', event, width, height);
        }
    };
    SfCircularGauge.prototype.gaugeOnMouseDown = function (e) {
        var pageText = document.getElementById(this.element.id + '_legend_pagenumber');
        var targetId = e.target.id;
        if (!sf.base.isNullOrUndefined(pageText)) {
            var page = parseInt(pageText.textContent.split('/')[0], 10);
            if (targetId.indexOf(this.element.id + '_legend_pageup') > -1) {
                this.dotNetRef.invokeMethodAsync('TriggerLegendPageClick', (page - 2), (page - 1));
            }
            else if (targetId.indexOf(this.element.id + '_legend_pagedown') > -1) {
                this.dotNetRef.invokeMethodAsync('TriggerLegendPageClick', (page), (page + 1));
            }
        }
        // tslint:disable-next-line:max-line-length
        if ((this.options.enablePointerDrag || this.options.enableRangeDrag) && (event.target.id.indexOf('Pointer') !== -1 || event.target.id.indexOf('_Range_') !== -1)) {
            this.isMouseDown = true;
            var tempString = targetId.replace(this.element.id, '').split('_Axis_')[1];
            this.dragAxisIndex = +tempString[0];
            this.dragElementIndex = +tempString[tempString.length - 1];
            if (event.target.id.indexOf('Pointer') !== -1) {
                this.isPointerDrag = true;
                this.dotNetRef.invokeMethodAsync('TriggerDragStart', this.dragAxisIndex, this.dragElementIndex, 0, 'Pointer');
            }
            else {
                this.isRangeDrag = true;
                this.dotNetRef.invokeMethodAsync('TriggerDragStart', this.dragAxisIndex, 0, this.dragElementIndex, 'Range');
            }
        }
    };
    SfCircularGauge.prototype.gaugeOnMouseMove = function (e) {
        var tempString;
        var axisIndex;
        var pointerIndex;
        var isRange;
        var isPointer;
        var isAnnotation;
        var targetElementId = e.target.id;
        if (targetElementId.indexOf('Legend') !== -1) {
            var legendElement = document.getElementById(targetElementId);
            if (this.options.legendToggleVisibility) {
                legendElement.setAttribute('cursor', 'pointer');
            }
            else {
                legendElement.setAttribute('cursor', 'auto');
            }
        }
        var svgElement = document.getElementById(this.element.id + '_svg');
        var svgRect = svgElement.getBoundingClientRect();
        var axisRect = document.getElementById(this.element.id + '_AxesCollection').getBoundingClientRect();
        // tslint:disable-next-line
        var rect = this.element.getBoundingClientRect();
        var mouseY = (e.clientY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        var mouseX = (e.clientX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        var tooltipGroup = document.getElementById(this.element.id + '_Tooltip');
        var tooltipGroupElement = document.getElementById(this.element.id + '_Tooltip_Group');
        var parentTargetId = e.target.parentElement.id;
        if (this.options.enableTooltip) {
            rect = {
                // tslint:disable-next-line:max-line-length
                left: Math.abs(rect.left - svgRect.left), top: Math.abs(rect.top - svgRect.top), width: svgRect.width, height: svgRect.height,
                x: Math.abs(rect.left - svgRect.left), y: Math.abs(rect.top - svgRect.top), bottom: 0, right: 0
            };
            if ((targetElementId.indexOf('Annotation') !== -1 || parentTargetId.indexOf('Annotation') !== -1)
                && !sf.base.isNullOrUndefined(this.options.tooltipType) && this.options.tooltipType.indexOf('Annotation') !== -1) {
                var index = void 0;
                if (parentTargetId.indexOf('ContentTemplate') !== -1) {
                    var annotIndexString = parentTargetId.split('_ContentTemplate')[0];
                    index = annotIndexString[annotIndexString.length - 1];
                }
                // tslint:disable-next-line:max-line-length
                var annotationTemplateElement = document.getElementById(parentTargetId);
                tempString = annotationTemplateElement.id.replace(this.element.id, '').split('_Axis_')[1];
                axisIndex = +tempString[0];
                pointerIndex = +(parentTargetId.indexOf('ContentTemplate') === -1 ? tempString[tempString.length - 1] : index);
                pointerIndex = isNaN(pointerIndex) ? 0 : pointerIndex;
                isRange = false;
                isPointer = false;
                isAnnotation = true;
                var annotationidElement = void 0;
                if (tooltipGroupElement !== null) {
                    tooltipGroup.style.visibility = 'visible';
                    if (tooltipGroup.lastElementChild !== null) {
                        var annotationIndexId = this.element.id + '_Tooltip_Annotation_' + pointerIndex + '_Content';
                        annotationidElement = document.getElementById(annotationIndexId);
                        var elementExist = document.querySelectorAll('#' + annotationIndexId);
                        if (elementExist.length !== 0) {
                            annotationidElement.style.visibility = 'visible';
                        }
                    }
                }
                var annotElementWidth = annotationTemplateElement.getBoundingClientRect().width;
                // tslint:disable-next-line:max-line-length
                this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, e.pageX + (annotElementWidth / 2), e.pageY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
            }
            else {
                if (tooltipGroup !== null) {
                    tooltipGroup.style.visibility = 'hidden';
                }
            }
        }
        this.performDragOperation(targetElementId, axisIndex, pointerIndex, mouseX, mouseY, event);
        if (this.options.enableTooltip) {
            // tslint:disable-next-line:max-line-length
            if (targetElementId.indexOf('_Range_') !== -1 && !sf.base.isNullOrUndefined(this.options.tooltipType) && this.options.tooltipType.indexOf('Range') !== -1 && !this.isMouseDown) {
                tempString = targetElementId.replace(this.element.id, '').split('_Axis_')[1];
                axisIndex = +tempString[0];
                pointerIndex = +tempString[tempString.length - 1];
                isRange = true;
                isPointer = false;
                isAnnotation = false;
                var tooltipX = 0;
                var tooltipY = 0;
                if (this.options.showRangeTooltipAtMousePosition) {
                    // tslint:disable-next-line
                    var mousePosition = this.getMousePosition(e.pageX, e.pageY, svgElement);
                    tooltipX = mousePosition.x;
                    tooltipY = mousePosition.y;
                }
                else {
                    tooltipX = e.pageX;
                    tooltipY = e.pageY;
                }
                if (tooltipGroup !== null) {
                    tooltipGroup.style.visibility = 'visible';
                }
                // tslint:disable-next-line:max-line-length
                this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, tooltipX, tooltipY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
            }
            // tslint:disable-next-line:max-line-length
            if ((targetElementId.indexOf('Pointer') !== -1 || targetElementId.indexOf('_Range_') !== -1 || targetElementId.indexOf('Annotation') !== -1 ||
                (parentTargetId.indexOf('Annotation') !== -1 && targetElementId.indexOf('Annotation') === -1))) {
                // tslint:disable-next-line:max-line-length
                if (targetElementId.indexOf('Pointer') !== -1 && (sf.base.isNullOrUndefined(this.options.tooltipType) || this.options.tooltipType.indexOf('Pointer') !== -1)) {
                    tempString = targetElementId.replace(this.element.id, '').split('_Axis_')[1];
                    axisIndex = +tempString[0];
                    pointerIndex = +tempString[tempString.length - 1];
                    isRange = false;
                    isPointer = true;
                    isAnnotation = false;
                    var tooltipX = 0;
                    var tooltipY = 0;
                    if (this.options.showPointerTooltipAtMousePosition) {
                        // tslint:disable-next-line
                        var mousePosition = this.getMousePosition(e.pageX, e.pageY, svgElement);
                        tooltipX = mousePosition.x;
                        tooltipY = mousePosition.y;
                    }
                    else {
                        tooltipX = e.pageX;
                        tooltipY = e.pageY;
                    }
                    if (tooltipGroup !== null) {
                        tooltipGroup.style.visibility = 'visible';
                    }
                    // tslint:disable-next-line:max-line-length
                    this.dotNetRef.invokeMethodAsync('TriggerTooltipEvent', event, tooltipX, tooltipY, axisIndex, pointerIndex, isRange, isPointer, isAnnotation, rect, svgRect, axisRect);
                }
            }
            else {
                if ((tooltipGroup !== null || tooltipGroupElement && tooltipGroupElement.childElementCount > 0) && !this.isPointerDrag) {
                    tooltipGroup.style.visibility = 'hidden';
                }
            }
        }
    };
    // tslint:disable-next-line:max-line-length
    SfCircularGauge.prototype.performDragOperation = function (targetElementId, axisIndex, pointerIndex, mouseX, mouseY, event) {
        if ((this.options.enablePointerDrag && targetElementId.indexOf('Pointer') !== -1) || (this.options.enableRangeDrag &&
            targetElementId.indexOf('_Range_') !== -1) || this.isMouseDown) {
            if (this.isMouseDown) {
                event.preventDefault();
                if (axisIndex !== null && pointerIndex !== null && this.isMouseDown) {
                    if (this.isRangeDrag && this.options.enableRangeDrag) {
                        document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'grabbing');
                        // tslint:disable-next-line:max-line-length
                        this.dotNetRef.invokeMethodAsync('TriggerRangeDragEvent', mouseX, mouseY, this.dragAxisIndex, this.dragElementIndex);
                    }
                    else if (this.isPointerDrag && this.options.enablePointerDrag) {
                        document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'grabbing');
                        // tslint:disable-next-line:max-line-length
                        this.dotNetRef.invokeMethodAsync('TriggerDragEvent', mouseX, mouseY, this.dragAxisIndex, this.dragElementIndex);
                    }
                }
            }
            else {
                document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'pointer');
            }
        }
        else {
            document.getElementById(this.element.id + '_svg').setAttribute('cursor', 'auto');
        }
    };
    SfCircularGauge.prototype.gaugeOnMouseEnd = function (e) {
        if (this.isPointerDrag) {
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', this.dragAxisIndex, this.dragElementIndex, 0, 'Pointer');
        }
        else if (this.isRangeDrag) {
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', this.dragAxisIndex, 0, this.dragElementIndex, 'Range');
        }
        this.isMouseDown = false;
        this.isPointerDrag = false;
        this.isRangeDrag = false;
    };
    // tslint:disable-next-line:max-line-length
    SfCircularGauge.prototype.animationRangeProcess = function (animatedChildElements, options, dotNetRef, axisIndex, pointerIndex) {
        var sweepAngle;
        new sf.base.Animation({}).animate(animatedChildElements, {
            duration: options.duration,
            progress: function (args) {
                sweepAngle = (options.start < options.end || Math.round(options.startAngle) === Math.round(options.endAngle)) ?
                    options.isClockWise ? (options.endAngle - options.startAngle) : (options.endAngle - options.startAngle - 360) :
                    options.isClockWise ? (options.endAngle - options.startAngle - 360) : (options.endAngle - options.startAngle);
                animatedChildElements.style.animation = 'None';
                var rangeLinear;
                var roundedActualEnd;
                var roundedOldEnd;
                if (options.roundRadius <= 0) {
                    // tslint:disable-next-line:max-line-length
                    rangeLinear = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + options.startAngle;
                }
                if (options.isClockWise) {
                    if (options.roundRadius > 0) {
                        // tslint:disable-next-line:max-line-length
                        roundedActualEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle);
                        roundedOldEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle + (options.roundRadius / 2));
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRoundedRangeBar', options.midPointX, options.midPointY, Math.floor(options.minimumAngle), roundedActualEnd + 0.0001, options.oldStart, roundedOldEnd + 0.0001, options.radius, options.pointerWidth, pointerIndex, axisIndex);
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRangeBar', options.midPointX, options.midPointY, rangeLinear, options.radius, options.innerRadius, options.minimumAngle, axisIndex, pointerIndex);
                    }
                }
                else {
                    if (options.roundRadius > 0) {
                        // tslint:disable-next-line:max-line-length
                        roundedActualEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.oldStart);
                        roundedOldEnd = -sweepAngle * Math.cos(args.timeStamp / options.duration * (Math.PI / 2)) + sweepAngle + Math.floor(options.minimumAngle - options.roundRadius - (options.roundRadius / 2));
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRoundedRangeBar', options.midPointX, options.midPointY, roundedActualEnd, Math.floor(options.oldStart) + 0.0001, roundedOldEnd, Math.floor(options.oldStart + (options.roundRadius / 2)), options.radius, options.pointerWidth, pointerIndex, axisIndex);
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        dotNetRef.invokeMethodAsync('AnimateRangeBar', options.midPointX, options.midPointY, options.minimumAngle, options.radius, options.innerRadius, rangeLinear, axisIndex, pointerIndex);
                    }
                }
            },
            end: function (args) {
                dotNetRef.invokeMethodAsync('AnimatePointer', axisIndex, pointerIndex, options.end);
            }
        });
    };
    // tslint:disable-next-line:max-line-length
    SfCircularGauge.prototype.animationProcess = function (animatedChildElements, options, dotNetRef, axisIndex, pointerIndex) {
        var sweepAngle;
        // tslint:disable-next-line
        new sf.base.Animation({}).animate(animatedChildElements, {
            duration: options.duration,
            progress: function (args) {
                sweepAngle = (options.start < options.end || Math.round(options.startAngle) === Math.round(options.endAngle)) ?
                    options.isClockWise ? (options.endAngle - options.startAngle) : (options.endAngle - options.startAngle - 360) :
                    options.isClockWise ? (options.endAngle - options.startAngle - 360) : (options.endAngle - options.startAngle);
                animatedChildElements.style.animation = 'None';
                // tslint:disable-next-line:max-line-length
                animatedChildElements.setAttribute('transform', 'rotate(' + (-sweepAngle * Math.cos(args.timeStamp / args.duration * (Math.PI / 2))
                    + sweepAngle + options.startAngle) + ',' + options.midPointX + ',' + options.midPointY + ')');
            },
            end: function (model) {
                dotNetRef.invokeMethodAsync('AnimatePointer', axisIndex, pointerIndex, options.end);
            }
        });
    };
    // tslint:disable-next-line
    SfCircularGauge.prototype.pointerAnimation = function (id, options, dotNetRef) {
        var axisIndex;
        var pointerIndex;
        var animationElement = document.getElementById(id);
        var tempString = animationElement.id.replace(this.element.id, '').split('_Axis_')[1];
        axisIndex = +tempString[0];
        pointerIndex = +tempString[tempString.length - 1];
        for (var j = 0; j < animationElement.childElementCount; j++) {
            var animatedChildElements = animationElement.children[j];
            if (options.pointerType === 'RangeBar') {
                this.animationRangeProcess(animatedChildElements, options, dotNetRef, axisIndex, pointerIndex);
            }
            else {
                this.animationProcess(animatedChildElements, options, dotNetRef, axisIndex, pointerIndex);
            }
        }
    };
    // tslint:disable-next-line
    SfCircularGauge.prototype.getMousePosition = function (pageX, pageY, element) {
        var elementRect = element.getBoundingClientRect();
        var pageXOffset = element.ownerDocument.defaultView.pageXOffset;
        var pageYOffset = element.ownerDocument.defaultView.pageYOffset;
        var clientTop = element.ownerDocument.documentElement.clientTop;
        var clientLeft = element.ownerDocument.documentElement.clientLeft;
        var positionX = elementRect.left + pageXOffset - clientLeft;
        var positionY = elementRect.top + pageYOffset - clientTop;
        return { x: (pageX - positionX), y: (pageY - positionY) };
    };
    return SfCircularGauge;
}());
// tslint:disable
var CircularGauge = {
    initialize: function (element, options, dotnetRef, individualId) {
        var instance = new SfCircularGauge(element.id, element, options, dotnetRef, individualId);
        instance.render();
        this.getContainerSize(element.id, dotnetRef);
    },
    getContainerSize: function (id, dotnetRef) {
        var elementBounds = document.getElementById(id);
        var width = elementBounds.clientWidth;
        var height = elementBounds.clientHeight;
        dotnetRef.invokeMethodAsync('GetContainerSize', width, height);
    },
    // tslint:disable-next-line
    animationProcess: function (element, options, dotNetRef, individualid) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.pointerAnimation(individualid, options, dotNetRef);
        }
    },
    setPointerDragStatus: function (element, enable) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enablePointerDrag = enable;
        }
    },
    setRangeDragStatus: function (element, enable) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enableRangeDrag = enable;
        }
    },
    setLegendToggle: function (element, enable) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.legendToggleVisibility = enable;
        }
    },
    getElementBounds: function (id) {
        var htmlElement = document.getElementById(id);
        if (htmlElement) {
            var bounds = htmlElement.getBoundingClientRect();
            return {
                width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom,
                left: bounds.left, right: bounds.right
            };
        }
        else {
            return null;
        }
    }
};

return CircularGauge;

}());
