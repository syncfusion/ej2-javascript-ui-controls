window.sf = window.sf || {};
var sfspinner = (function (exports) {
'use strict';

var globalTimeOut = {};
var spinTemplate = null;
var spinCSSClass = null;
var DEFT_MAT_WIDTH = 30;
var DEFT_FAB_WIDTH = 30;
var DEFT_BOOT_WIDTH = 30;
var DEFT_BOOT4_WIDTH = 36;
var CLS_SHOWSPIN = 'e-spin-show';
var CLS_HIDESPIN = 'e-spin-hide';
var CLS_MATERIALSPIN = 'e-spin-material';
var CLS_FABRICSPIN = 'e-spin-fabric';
var CLS_BOOTSPIN = 'e-spin-bootstrap';
var CLS_BOOT4SPIN = 'e-spin-bootstrap4';
var CLS_HIGHCONTRASTSPIN = 'e-spin-high-contrast';
var CLS_SPINWRAP = 'e-spinner-pane';
var CLS_SPININWRAP = 'e-spinner-inner';
var CLS_SPINCIRCLE = 'e-path-circle';
var CLS_SPINARC = 'e-path-arc';
var CLS_SPINLABEL = 'e-spin-label';
var CLS_SPINTEMPLATE = 'e-spin-template';
/**
 * Function to change the Spinners in a page globally from application end.
 * ```
 * E.g : blazorSpinner({ action: "Create", options: {target: targetElement}, type: "" });
 * ```
 * @param args
 * @private
 */
function Spinner(action, options, target, type) {
    switch (action) {
        case 'Create':
            var element = document.querySelector(options.target);
            var args = { type: type, target: element, cssClass: options.cssClass,
                label: options.label, width: options.width };
            createSpinner(args);
            break;
        case 'Show':
            showSpinner(document.querySelector(target));
            break;
        case 'Hide':
            hideSpinner(document.querySelector(target));
            break;
        case 'Set':
            var setArgs = { cssClass: options.cssClass, type: type };
            setSpinner(setArgs);
            break;
    }
}
/**
 * Create a spinner for the specified target element.
 * ```
 * E.g : createSpinner({ target: targetElement, width: '34px', label: 'Loading..' });
 * ```
 * @param args
 * @private
 */
function createSpinner(args, internalCreateElement) {
    if (!args.target) {
        return;
    }
    var radius;
    var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
    var container = create_spinner_container(args.target, makeElement);
    if (!sf.base.isNullOrUndefined(args.cssClass)) {
        container.wrap.classList.add(args.cssClass);
    }
    if (!sf.base.isNullOrUndefined(args.template) || !sf.base.isNullOrUndefined(spinTemplate)) {
        var template = !sf.base.isNullOrUndefined(args.template) ? args.template : spinTemplate;
        container.wrap.classList.add(CLS_SPINTEMPLATE);
        replaceContent(container.wrap, template, spinCSSClass);
    }
    else {
        var theme = !sf.base.isNullOrUndefined(args.type) ? args.type : getTheme(container.wrap);
        var width = !sf.base.isNullOrUndefined(args.width) ? args.width : undefined;
        radius = calculateRadius(width, theme);
        setTheme(theme, container.wrap, radius, makeElement);
        if (!sf.base.isNullOrUndefined(args.label)) {
            createLabel(container.inner_wrap, args.label, makeElement);
        }
    }
    container.wrap.classList.add(CLS_HIDESPIN);
    container = null;
}
function createLabel(container, label, makeElement) {
    var labelEle = makeElement('div', {});
    labelEle.classList.add(CLS_SPINLABEL);
    labelEle.textContent = label;
    container.appendChild(labelEle);
    return labelEle;
}
function createMaterialSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Material', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_MATERIALSPIN);
    mat_calculate_attributes(radius, container, 'Material', CLS_MATERIALSPIN);
}
function createBootstrap4Spinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap4', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_BOOT4SPIN);
    mat_calculate_attributes(radius, container, 'Bootstrap4', CLS_BOOT4SPIN);
}
function startMatAnimate(container, uniqueID, radius) {
    var globalObject = {};
    var timeOutVar = 0;
    globalTimeOut[uniqueID].timeOut = 0;
    globalObject[uniqueID] = globalVariables(uniqueID, radius, 0, 0);
    var spinnerInfo = { uniqueID: uniqueID, container: container, globalInfo: globalObject, timeOutVar: timeOutVar };
    animateMaterial(spinnerInfo);
}
function createFabricSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Fabric', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FABRICSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FABRICSPIN);
}
function createHighContrastSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'HighContrast', radius: radius };
    create_fabric_element(container, uniqueID, CLS_HIGHCONTRASTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_HIGHCONTRASTSPIN);
}
function getTheme(container) {
    var theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
    return theme.replace(/['"]+/g, '');
}
function setTheme(theme, container, radius, makeElement) {
    var innerContainer = container.querySelector('.' + CLS_SPININWRAP);
    var svg = innerContainer.querySelector('svg');
    if (!sf.base.isNullOrUndefined(svg)) {
        innerContainer.removeChild(svg);
    }
    switch (theme) {
        case 'Material':
            createMaterialSpinner(innerContainer, radius, makeElement);
            break;
        case 'Fabric':
            createFabricSpinner(innerContainer, radius, makeElement);
            break;
        case 'Bootstrap':
            createBootstrapSpinner(innerContainer, radius, makeElement);
            break;
        case 'HighContrast':
            createHighContrastSpinner(innerContainer, radius, makeElement);
            break;
        case 'Bootstrap4':
            createBootstrap4Spinner(innerContainer, radius, makeElement);
            break;
    }
}
function createBootstrapSpinner(innerContainer, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap', radius: radius };
    create_bootstrap_element(innerContainer, uniqueID, makeElement);
    boot_calculate_attributes(innerContainer, radius);
}
function create_bootstrap_element(innerContainer, uniqueID, makeElement) {
    var svgBoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var viewBoxValue = 64;
    var trans = 32;
    var defaultRadius = 2;
    svgBoot.setAttribute('id', uniqueID);
    svgBoot.setAttribute('class', CLS_BOOTSPIN);
    svgBoot.setAttribute('viewBox', '0 0 ' + viewBoxValue + ' ' + viewBoxValue);
    innerContainer.insertBefore(svgBoot, innerContainer.firstChild);
    for (var item = 0; item <= 7; item++) {
        var bootCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bootCircle.setAttribute('class', CLS_SPINCIRCLE + '_' + item);
        bootCircle.setAttribute('r', defaultRadius + '');
        bootCircle.setAttribute('transform', 'translate(' + trans + ',' + trans + ')');
        svgBoot.appendChild(bootCircle);
    }
}
function boot_calculate_attributes(innerContainer, radius) {
    var svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    svg.style.width = svg.style.height = radius + 'px';
    var x = 0;
    var y = 0;
    var rad = 24;
    var startArc = 90;
    for (var item = 0; item <= 7; item++) {
        var start = defineArcPoints(x, y, rad, startArc);
        var circleEle = svg.querySelector('.' + CLS_SPINCIRCLE + '_' + item);
        circleEle.setAttribute('cx', start.x + '');
        circleEle.setAttribute('cy', start.y + '');
        startArc = startArc >= 360 ? 0 : startArc;
        startArc = startArc + 45;
    }
}
function generateSeries(begin, stop) {
    var series = [];
    var start = begin;
    var end = stop;
    var increment = false;
    var count = 1;
    formSeries(start);
    function formSeries(i) {
        series.push(i);
        if (i !== end || count === 1) {
            if (i <= start && i > 1 && !increment) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            else if (i === 1) {
                i = 7;
                i = parseFloat((i + 0.2).toFixed(2));
                increment = true;
            }
            else if (i < 8 && increment) {
                i = parseFloat((i + 0.2).toFixed(2));
                if (i === 8) {
                    increment = false;
                }
            }
            else if (i <= 8 && !increment) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            ++count;
            formSeries(i);
        }
    }
    return series;
}
function animateBootstrap(innerContainer) {
    var svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    var id = svg.getAttribute('id');
    for (var i = 1; i <= 8; i++) {
        var circleEle = (innerContainer.getElementsByClassName('e-path-circle_' +
            (i === 8 ? 0 : i))[0]);
        rotation(circleEle, i, i, generateSeries(i, i), id);
    }
    function rotation(circle, start, end, series, id) {
        var count = 0;
        boot_animate(start);
        function boot_animate(radius) {
            if (globalTimeOut[id].isAnimate) {
                ++count;
                circle.setAttribute('r', radius + '');
                if (count >= series.length) {
                    count = 0;
                }
                globalTimeOut[id].timeOut = setTimeout(boot_animate.bind(null, series[count]), 18);
            }
        }
    }
}
function replaceContent(container, template, cssClass) {
    if (!sf.base.isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    var inner = container.querySelector('.e-spinner-inner');
    inner.innerHTML = template;
}
function calculateRadius(width, theme) {
    var defaultSize;
    switch (theme) {
        case 'Material':
            defaultSize = DEFT_MAT_WIDTH;
            break;
        case 'Fabric':
            defaultSize = DEFT_FAB_WIDTH;
            break;
        case 'Bootstrap4':
            defaultSize = DEFT_BOOT4_WIDTH;
            break;
        default:
            defaultSize = DEFT_BOOT_WIDTH;
    }
    width = width ? parseFloat(width + '') : defaultSize;
    return theme === 'Bootstrap' ? width : width / 2;
}
function globalVariables(id, radius, count, previousId) {
    return {
        radius: radius,
        count: count,
        previousId: previousId
    };
}
function random_generator() {
    var random = '';
    var combine = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        random += combine.charAt(Math.floor(Math.random() * combine.length));
    }
    return random;
}
function create_fabric_element(innerCon, uniqueID, themeClass, makeElement) {
    var svgFabric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFabric.setAttribute('id', uniqueID);
    svgFabric.setAttribute('class', themeClass);
    var fabricCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    var fabricCircleArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCircleArc.setAttribute('class', CLS_SPINARC);
    innerCon.insertBefore(svgFabric, innerCon.firstChild);
    svgFabric.appendChild(fabricCirclePath);
    svgFabric.appendChild(fabricCircleArc);
}
function create_material_element(innerContainer, uniqueID, makeElement, cls) {
    var svgMaterial = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMaterial.setAttribute('class', cls);
    svgMaterial.setAttribute('id', uniqueID);
    var matCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    matCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    innerContainer.insertBefore(svgMaterial, innerContainer.firstChild);
    svgMaterial.appendChild(matCirclePath);
}
function create_spinner_container(target, makeElement) {
    var spinnerContainer = makeElement('div', {});
    spinnerContainer.classList.add(CLS_SPINWRAP);
    var spinnerInnerContainer = makeElement('div', {});
    spinnerInnerContainer.classList.add(CLS_SPININWRAP);
    target.appendChild(spinnerContainer);
    spinnerContainer.appendChild(spinnerInnerContainer);
    return { wrap: spinnerContainer, inner_wrap: spinnerInnerContainer };
}
function animateMaterial(spinnerInfo) {
    var start = 1;
    var end = 149;
    var duration = 1333;
    var max = 75;
    createCircle(start, end, easeAnimation, duration, spinnerInfo.globalInfo[spinnerInfo.uniqueID].count, max, spinnerInfo);
    spinnerInfo.globalInfo[spinnerInfo.uniqueID].count = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].count % 4;
}
function createCircle(start, end, easing, duration, count, max, spinnerInfo) {
    var id = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId;
    var startTime = new Date().getTime();
    var change = end - start;
    var diameter = getSize((spinnerInfo.globalInfo[spinnerInfo.uniqueID].radius * 2) + '');
    var strokeSize = getStrokeSize(diameter);
    var rotate = -90 * (spinnerInfo.globalInfo[spinnerInfo.uniqueID].count || 0);
    mat_animation(spinnerInfo);
    function mat_animation(spinnerInfo) {
        var currentTime = Math.max(0, Math.min(new Date().getTime() - startTime, duration));
        updatePath(easing(currentTime, start, change, duration), spinnerInfo.container);
        if (id === spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId && currentTime < duration) {
            globalTimeOut[spinnerInfo.uniqueID].timeOut = setTimeout(mat_animation.bind(null, spinnerInfo), 1);
        }
        else {
            animateMaterial(spinnerInfo);
        }
    }
    function updatePath(value, container) {
        if ((!sf.base.isNullOrUndefined(container.querySelector('svg.e-spin-material')))
            && (!sf.base.isNullOrUndefined(container.querySelector('svg.e-spin-material').querySelector('path.e-path-circle')))) {
            var svg = container.querySelector('svg.e-spin-material');
            var path = svg.querySelector('path.e-path-circle');
            path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, value, max) + '');
            path.setAttribute('transform', 'rotate(' + (rotate) + ' ' + diameter / 2 + ' ' + diameter / 2 + ')');
        }
    }
}
function mat_calculate_attributes(radius, container, type, cls) {
    var diameter = radius * 2;
    var svg = container.querySelector('svg.' + cls);
    var path = svg.querySelector('path.e-path-circle');
    var strokeSize = getStrokeSize(diameter);
    var transformOrigin = (diameter / 2) + 'px';
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.width = svg.style.height = diameter + 'px';
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    path.setAttribute('d', drawArc(diameter, strokeSize));
    if (type === 'Material') {
        path.setAttribute('stroke-width', strokeSize + '');
        path.setAttribute('stroke-dasharray', ((diameter - strokeSize) * Math.PI * 0.75) + '');
        path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, 1, 75) + '');
    }
}
function getSize(value) {
    var parsed = parseFloat(value);
    return parsed;
}
function drawArc(diameter, strokeSize) {
    var radius = diameter / 2;
    var offset = strokeSize / 2;
    return 'M' + radius + ',' + offset
        + 'A' + (radius - offset) + ',' + (radius - offset) + ' 0 1 1 ' + offset + ',' + radius;
}
function getStrokeSize(diameter) {
    return 10 / 100 * diameter;
}
function getDashOffset(diameter, strokeSize, value, max) {
    return (diameter - strokeSize) * Math.PI * ((3 * (max) / 100) - (value / 100));
}
function easeAnimation(current, start, change, duration) {
    var timestamp = (current /= duration) * current;
    var timecount = timestamp * current;
    return start + change * (6 * timecount * timestamp + -15 * timestamp * timestamp + 10 * timecount);
}
function fb_calculate_attributes(radius, innerConainer, trgClass) {
    var centerX = radius;
    var centerY = radius;
    var diameter = radius * 2;
    var startArc = 315;
    var endArc = 45;
    var svg = innerConainer.querySelector('.' + trgClass);
    var circle = svg.querySelector('.e-path-circle');
    var path = svg.querySelector('.e-path-arc');
    var transformOrigin = (diameter / 2) + 'px';
    circle.setAttribute('d', defineCircle(centerX, centerY, radius));
    path.setAttribute('d', defineArc(centerX, centerY, radius, startArc, endArc));
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    svg.style.width = svg.style.height = diameter + 'px';
}
function defineArcPoints(centerX, centerY, radius, angle) {
    var radians = (angle - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}
function defineArc(x, y, radius, startArc, endArc) {
    var start = defineArcPoints(x, y, radius, endArc);
    var end = defineArcPoints(x, y, radius, startArc);
    var d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, 0, 0, end.x, end.y
    ].join(' ');
    return d;
}
function defineCircle(x, y, radius) {
    var d = [
        'M', x, y,
        'm', -radius, 0,
        'a', radius, radius, 0, 1, 0, radius * 2, 0,
        'a', radius, radius, 0, 1, 0, -radius * 2, 0,
    ].join(' ');
    return d;
}
/**
 * Function to show the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
function showSpinner(container) {
    showHideSpinner(container, false);
    container = null;
}
function showHideSpinner(container, isHide) {
    var spinnerWrap;
    if (container) {
        spinnerWrap = container.classList.contains(CLS_SPINWRAP) ? container :
            container.querySelector('.' + CLS_SPINWRAP);
    }
    if (container && spinnerWrap) {
        var inner = spinnerWrap.querySelector('.' + CLS_SPININWRAP);
        var spinCheck = void 0;
        spinCheck = isHide ? !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_HIDESPIN) :
            !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_SHOWSPIN);
        if (spinCheck) {
            var svgEle = spinnerWrap.querySelector('svg');
            if (sf.base.isNullOrUndefined(svgEle)) {
                return;
            }
            var id = svgEle.getAttribute('id');
            globalTimeOut[id].isAnimate = !isHide;
            switch (globalTimeOut[id].type) {
                case 'Material':
                    isHide ? clearTimeout(globalTimeOut[id].timeOut) : startMatAnimate(inner, id, globalTimeOut[id].radius);
                    break;
                case 'Bootstrap':
                    isHide ? clearTimeout(globalTimeOut[id].timeOut) : animateBootstrap(inner);
                    break;
            }
        }
        isHide ? sf.base.classList(spinnerWrap, [CLS_HIDESPIN], [CLS_SHOWSPIN]) : sf.base.classList(spinnerWrap, [CLS_SHOWSPIN], [CLS_HIDESPIN]);
        container = null;
    }
}
/**
 * Function to hide the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
function hideSpinner(container) {
    showHideSpinner(container, true);
    container = null;
}
/**
 * Function to change the Spinners in a page globally from application end.
 * ```
 * E.g : setSpinner({ cssClass: 'custom-css'; type: 'Material' });
 * ```
 * @param args
 * @private
 */
function setSpinner(args, internalCreateElement) {
    var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
    if (args.template !== undefined) {
        spinTemplate = args.template;
        if (args.template !== undefined) {
            spinCSSClass = args.cssClass;
        }
    }
    var container = document.querySelectorAll('.' + CLS_SPINWRAP);
    for (var index = 0; index < container.length; index++) {
        ensureTemplate(args.template, container[index], args.type, args.cssClass, makeElement);
    }
}
function ensureTemplate(template, container, theme, cssClass, makeEle) {
    if (sf.base.isNullOrUndefined(template) && !container.classList.contains(CLS_SPINTEMPLATE)) {
        replaceTheme(container, theme, cssClass, makeEle);
        if (container.classList.contains(CLS_SHOWSPIN)) {
            container.classList.remove(CLS_SHOWSPIN);
            showSpinner(container);
        }
        else {
            container.classList.remove(CLS_HIDESPIN);
            hideSpinner(container);
        }
    }
    else {
        spinTemplate = template;
        if (!sf.base.isNullOrUndefined(cssClass)) {
            spinCSSClass = cssClass;
        }
    }
}
function replaceTheme(container, theme, cssClass, makeEle) {
    if (!sf.base.isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    var svgElement = container.querySelector('svg');
    var radius = theme === 'Bootstrap' ? parseFloat(svgElement.style.height) : parseFloat(svgElement.style.height) / 2;
    var classNames = svgElement.getAttribute('class');
    var svgClassList = classNames.split(/\s/);
    if (svgClassList.indexOf('e-spin-material') >= 0) {
        var id = svgElement.getAttribute('id');
        clearTimeout(globalTimeOut[id].timeOut);
    }
    setTheme(theme, container, radius, makeEle);
}

/**
 * spinner modules
 */

exports.Spinner = Spinner;
exports.createSpinner = createSpinner;
exports.showSpinner = showSpinner;
exports.hideSpinner = hideSpinner;
exports.setSpinner = setSpinner;

return exports;

});

    sf.popups = sf.base.extend({}, sf.popups, sfspinner({}));