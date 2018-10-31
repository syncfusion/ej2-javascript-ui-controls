import { isNullOrUndefined, classList, createElement } from '@syncfusion/ej2-base';

let globalTimeOut: { [key: string]: GlobalTimeOut } = {};
let spinTemplate: string = null;
let spinCSSClass: string = null;
const DEFT_MAT_WIDTH: number = 30;
const DEFT_FAB_WIDTH: number = 30;
const DEFT_BOOT_WIDTH: number = 30;
const CLS_SHOWSPIN: string = 'e-spin-show';
const CLS_HIDESPIN: string = 'e-spin-hide';
const CLS_MATERIALSPIN: string = 'e-spin-material';
const CLS_FABRICSPIN: string = 'e-spin-fabric';
const CLS_BOOTSPIN: string = 'e-spin-bootstrap';
const CLS_HIGHCONTRASTSPIN: string = 'e-spin-high-contrast';
const CLS_SPINWRAP: string = 'e-spinner-pane';
const CLS_SPININWRAP: string = 'e-spinner-inner';
const CLS_SPINCIRCLE: string = 'e-path-circle';
const CLS_SPINARC: string = 'e-path-arc';
const CLS_SPINLABEL: string = 'e-spin-label';
const CLS_SPINTEMPLATE: string = 'e-spin-template';

export type createElementParams = (
    tag: string,
    prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
) => HTMLElement;

 /**
  * Defines the type of spinner.
  */
export type SpinnerType = 'Material' | 'Fabric'| 'Bootstrap' | 'HighContrast' ;

 /**
  * Create a spinner for the specified target element.
  * ```
  * E.g : createSpinner({ target: targetElement, width: '34px', label: 'Loading..' });
  * ```
  * @param args
  * @private
  */

export function createSpinner ( args: SpinnerArgs, internalCreateElement ?: createElementParams): void {
    let radius: number;
    let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    let container: { wrap: HTMLElement, inner_wrap: HTMLElement } = create_spinner_container(args.target, makeElement);
    if (!isNullOrUndefined(args.cssClass)) {
        container.wrap.classList.add(args.cssClass);
    }
    if (!isNullOrUndefined(args.template) || !isNullOrUndefined(spinTemplate)) {
        let template: string = !isNullOrUndefined(args.template) ? args.template : spinTemplate;
        container.wrap.classList.add(CLS_SPINTEMPLATE);
        replaceContent(container.wrap, template, spinCSSClass);
    } else {
        let theme: string = !isNullOrUndefined(args.type) ? args.type : getTheme(container.wrap);
        let width: string | number = !isNullOrUndefined(args.width) ? args.width : undefined;
        radius = calculateRadius(width, theme);
        setTheme(theme, container.wrap, radius, makeElement);
        if (!isNullOrUndefined(args.label)) {
           createLabel(container.inner_wrap, args.label, makeElement);
        }
    }
    container.wrap.classList.add(CLS_HIDESPIN);
    container = null;
}

function createLabel(container: HTMLElement, label: string, makeElement: createElementParams) : HTMLElement {
    let labelEle: HTMLElement = makeElement('div', {});
    labelEle.classList.add(CLS_SPINLABEL);
    labelEle.textContent = label;
    container.appendChild(labelEle);
    return labelEle;
}

function createMaterialSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    let uniqueID: string = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Material', radius: radius };
    create_material_element (container, uniqueID, makeElement);
    mat_calculate_attributes( radius, container);
}

function startMatAnimate(container: HTMLElement, uniqueID: string, radius: number): void {
    let globalObject: {[key: string]: GlobalVariables } = {};
    let timeOutVar: number = 0; globalTimeOut[uniqueID].timeOut = 0;
    globalObject[uniqueID] = globalVariables(uniqueID, radius, 0, 0);
    let spinnerInfo: SpinnerInfo  = { uniqueID: uniqueID, container: container, globalInfo: globalObject, timeOutVar: timeOutVar };
    animateMaterial(spinnerInfo);
}

function createFabricSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    let uniqueID: string = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Fabric', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FABRICSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FABRICSPIN);
}

function createHighContrastSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    let uniqueID: string = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'HighContrast', radius: radius };
    create_fabric_element(container, uniqueID, CLS_HIGHCONTRASTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_HIGHCONTRASTSPIN);
}

function getTheme (container: HTMLElement) : string {
    let theme: string = window.getComputedStyle(container as Element, ':after').getPropertyValue('content');
    return theme.replace(/['"]+/g, '');
}

function setTheme(theme: string, container: HTMLElement, radius: number, makeElement: createElementParams): void {
    let innerContainer: HTMLElement = container.querySelector('.' + CLS_SPININWRAP) as HTMLElement;
    let svg: SVGSVGElement = innerContainer.querySelector('svg') as SVGSVGElement;
    if (!isNullOrUndefined(svg)) {
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
            createBootstrapSpinner(innerContainer, radius, makeElement );
            break;
        case 'HighContrast':
            createHighContrastSpinner(innerContainer, radius, makeElement );
            break;
    }
}

function createBootstrapSpinner(innerContainer: HTMLElement, radius: number, makeElement: createElementParams): void {
    let uniqueID: string = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap', radius: radius };
    create_bootstrap_element(innerContainer, uniqueID, makeElement);
    boot_calculate_attributes(innerContainer, radius);
}

function create_bootstrap_element(innerContainer: HTMLElement, uniqueID: string, makeElement: createElementParams): void {
    let svgBoot: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let viewBoxValue: number = 64;
    let trans: number = 32;
    let defaultRadius: number = 2;
    svgBoot.setAttribute('id', uniqueID);
    svgBoot.setAttribute('class', CLS_BOOTSPIN);
    svgBoot.setAttribute('viewBox', '0 0 ' + viewBoxValue + ' ' + viewBoxValue);
    innerContainer.insertBefore(svgBoot, innerContainer.firstChild);
    for (let item: number = 0;  item <= 7; item++) {
        let bootCircle: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bootCircle.setAttribute('class', CLS_SPINCIRCLE + '_' + item);
        bootCircle.setAttribute('r', defaultRadius + '' );
        bootCircle.setAttribute('transform', 'translate(' + trans + ',' + trans + ')');
        svgBoot.appendChild(bootCircle);
    }
}

function boot_calculate_attributes( innerContainer: HTMLElement, radius: number): void {
    let svg: SVGSVGElement = innerContainer.querySelector('svg.e-spin-bootstrap') as SVGSVGElement;
    svg.style.width = svg.style.height = radius + 'px';
    let x: number = 0; let y: number = 0; let rad: number = 24;
    let startArc: number = 90;
    for (let item: number = 0;  item <= 7; item++) {
        let start: { x: number, y: number } = defineArcPoints(x, y, rad, startArc);
        let circleEle: SVGCircleElement = svg.querySelector('.' + CLS_SPINCIRCLE + '_' + item) as SVGCircleElement;
        circleEle.setAttribute('cx',  start.x + '' );
        circleEle.setAttribute('cy',  start.y + '' );
        startArc = startArc >= 360 ? 0 : startArc;
        startArc = startArc + 45;
    }
}

function generateSeries(begin: number, stop: number): Number[] {
    let series: Number[] = [];
    let start: number = begin; let end: number = stop;
    let increment: boolean = false;
    let count: number = 1;
    formSeries(start);
    function formSeries(i: number): void {
        series.push(i);
        if (i !== end || count === 1) {
            if (i <= start && i > 1 && !increment) {
                i = parseFloat((i - 0.2).toFixed(2));
            } else if (i === 1) {
                i = 7;
                i = parseFloat((i + 0.2).toFixed(2));
                increment = true;
            } else if (i < 8 && increment) {
                i = parseFloat((i + 0.2).toFixed(2));
                if (i === 8 ) { increment = false; }
            } else if (i <= 8 && !increment ) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            ++count;
            formSeries(i);
        }
    }
    return series;
}

function animateBootstrap(innerContainer: HTMLElement): void {
    let svg: SVGSVGElement = innerContainer.querySelector('svg.e-spin-bootstrap') as SVGSVGElement;
    let id: string = svg.getAttribute('id');
    for (let i: number = 1 ; i <= 8; i++) {
        let circleEle: SVGCircleElement = (innerContainer.getElementsByClassName('e-path-circle_' +
        (i === 8 ? 0 : i))[0]) as SVGCircleElement;
        rotation(circleEle, i, i, generateSeries(i , i), id);
    }

    function rotation (circle: SVGCircleElement, start: number, end: number, series: Number[], id: string): void {
        let count: number = 0;
        boot_animate(start);
        function boot_animate(radius: number): void {
            if (globalTimeOut[id].isAnimate) {
                ++count;
                circle.setAttribute('r', radius + '');
                if (count >= series.length) { count = 0; }
                globalTimeOut[id].timeOut = setTimeout( boot_animate.bind(null, series[count]), 18);
            }
        }
    }
}

function replaceContent(container: HTMLElement, template: string, cssClass?: string): void {
    if (!isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    let inner: HTMLElement = container.querySelector('.e-spinner-inner') as HTMLElement;
    inner.innerHTML = template;
}

function calculateRadius(width: string | number, theme: string): number {
    let defaultSize: number = theme === 'Material' ? DEFT_MAT_WIDTH : theme === 'Fabric' ? DEFT_FAB_WIDTH : DEFT_BOOT_WIDTH;
    width = width ? parseFloat(width + '') : defaultSize;
    return theme ===  'Bootstrap' ? width : width / 2;
}

function globalVariables(id: string, radius: number, count: number, previousId: number) : GlobalVariables {
    return  {
       radius: radius,
       count: count,
       previousId: previousId
    };
}

function random_generator() : string {
  let random: string = '';
  let combine: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i: number = 0; i < 5; i++) {
    random += combine.charAt(Math.floor(Math.random() * combine.length));
  }
  return random;
}

function create_fabric_element ( innerCon: HTMLElement, uniqueID: string, themeClass: string, makeElement: createElementParams ): void {
    let svgFabric: SVGSVGElement =  document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFabric.setAttribute('id', uniqueID);
    svgFabric.setAttribute('class', themeClass);
    let fabricCirclePath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    let fabricCircleArc: SVGPathElement =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCircleArc.setAttribute('class', CLS_SPINARC);
    innerCon.insertBefore(svgFabric, innerCon.firstChild);
    svgFabric.appendChild(fabricCirclePath);
    svgFabric.appendChild(fabricCircleArc);
}

function create_material_element ( innerContainer: HTMLElement, uniqueID: string, makeElement: createElementParams ): void {
    let svgMaterial: SVGSVGElement =   document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMaterial.setAttribute('class', CLS_MATERIALSPIN);
    svgMaterial.setAttribute('id', uniqueID);
    let matCirclePath: SVGPathElement =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
    matCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    innerContainer.insertBefore(svgMaterial, innerContainer.firstChild);
    svgMaterial.appendChild(matCirclePath);
}

function create_spinner_container(target: HTMLElement, makeElement: createElementParams): { wrap: HTMLElement, inner_wrap: HTMLElement} {
    let spinnerContainer: HTMLElement = makeElement('div', {});
    spinnerContainer.classList.add(CLS_SPINWRAP);
    let spinnerInnerContainer: HTMLElement = makeElement('div', {});
    spinnerInnerContainer.classList.add(CLS_SPININWRAP);
    target.appendChild(spinnerContainer);
    spinnerContainer.appendChild(spinnerInnerContainer);
    return { wrap: spinnerContainer , inner_wrap: spinnerInnerContainer };
}

function animateMaterial(spinnerInfo: SpinnerInfo): void {
    let start: number = 1; let end: number = 149;
    let duration: number = 1333; let max: number = 75;
    createCircle( start, end, easeAnimation,
                  duration, spinnerInfo.globalInfo[spinnerInfo.uniqueID].count, max, spinnerInfo );
    spinnerInfo.globalInfo[spinnerInfo.uniqueID].count = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].count % 4;
}

function createCircle(start: number, end: number, easing: Function, duration: number,
                      count: number, max: number, spinnerInfo: SpinnerInfo): void {
    let id: number = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId;
    let startTime: number = new Date().getTime();
    let change: number = end - start;
    let diameter: number = getSize((spinnerInfo.globalInfo[spinnerInfo.uniqueID].radius * 2) + '');
    let strokeSize: number = getStrokeSize(diameter);
    let rotate: number = -90 * (spinnerInfo.globalInfo[spinnerInfo.uniqueID].count || 0);
    mat_animation(spinnerInfo);
    function mat_animation(spinnerInfo: SpinnerInfo): void {
        let currentTime: number = Math.max(0, Math.min(new Date().getTime() - startTime, duration));
        updatePath( easing(currentTime, start, change, duration), spinnerInfo.container);
        if (id === spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId && currentTime < duration) {
            globalTimeOut[spinnerInfo.uniqueID].timeOut = setTimeout(mat_animation.bind(null, spinnerInfo), 1);
        } else {
            animateMaterial(spinnerInfo);
        }
    }
    function updatePath (value: number, container: HTMLElement): void {
        if ((!isNullOrUndefined(container.querySelector('svg.e-spin-material')))
            && (!isNullOrUndefined(container.querySelector('svg.e-spin-material').querySelector('path.e-path-circle')))) {
            let svg: SVGSVGElement = container.querySelector('svg.e-spin-material') as SVGSVGElement;
            let path: SVGPathElement = svg.querySelector('path.e-path-circle') as SVGPathElement;
            path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, value, max) + '');
            path.setAttribute('transform', 'rotate(' + (rotate) + ' ' + diameter / 2 + ' ' + diameter / 2 + ')');
        }
    }
}

function mat_calculate_attributes (radius: number , container: HTMLElement): void {
    let diameter: number = radius * 2;
    let svg: SVGSVGElement = container.querySelector('svg.e-spin-material') as SVGSVGElement;
    let path: SVGPathElement = svg.querySelector('path.e-path-circle') as SVGPathElement;
    let strokeSize: number = getStrokeSize(diameter);
    let transformOrigin: string = (diameter / 2) + 'px';
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.width = svg.style.height = diameter + 'px';
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    path.setAttribute('stroke-width', strokeSize + '');
    path.setAttribute('d', drawArc(diameter, strokeSize));
    path.setAttribute('stroke-dasharray', ((diameter - strokeSize) * Math.PI * 0.75) + '');
    path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, 1, 75) + '');
}

function getSize(value: string ): number {
    let parsed: number = parseFloat(value);
    return parsed;
}

function drawArc(diameter: number, strokeSize: number): string {
    let radius: number = diameter / 2;
    let offset: number = strokeSize / 2;
    return 'M' + radius + ',' + offset
        + 'A' + (radius - offset) + ',' + (radius - offset) + ' 0 1 1 ' + offset + ',' + radius;
}

function getStrokeSize(diameter: number): number {
    return 10 / 100 * diameter;
}

function getDashOffset(diameter: number, strokeSize: number, value: number, max: number): number {
    return (diameter - strokeSize) * Math.PI * ( (3 * (max) / 100) - (value / 100) );
}

function easeAnimation(current: number, start: number, change: number, duration: number): number {
    let timestamp: number = (current /= duration) * current;
    let timecount: number = timestamp * current;
    return start + change * (6 * timecount * timestamp + -15 * timestamp * timestamp + 10 * timecount);
}

function fb_calculate_attributes(radius: number, innerConainer: HTMLElement, trgClass: string): void {
    let centerX: number = radius; let centerY: number = radius;
    let diameter: number = radius * 2;
    let startArc: number = 315; let endArc: number = 45;
    let svg: SVGSVGElement = innerConainer.querySelector('.' + trgClass) as SVGSVGElement;
    let circle: SVGPathElement = svg.querySelector('.e-path-circle') as SVGPathElement;
    let path: SVGPathElement = svg.querySelector('.e-path-arc') as SVGPathElement;
    let transformOrigin: string = (diameter / 2) + 'px';
    circle.setAttribute('d', defineCircle(centerX, centerY , radius));
    path.setAttribute('d', defineArc(centerX, centerY, radius, startArc, endArc));
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    svg.style.width = svg.style.height = diameter + 'px';
}

function defineArcPoints(centerX: number, centerY: number, radius: number, angle: number): {x: number, y: number} {
    let radians: number = (angle - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}

function defineArc(x: number, y: number, radius: number, startArc: number, endArc: number): string {
    let start: {x: number, y: number } = defineArcPoints(x, y, radius, endArc);
    let end: {x: number, y: number } = defineArcPoints(x, y, radius, startArc);
    let d: string = [
        'M', start.x, start.y,
        'A', radius, radius, 0, 0, 0, end.x, end.y
    ].join(' ');
    return d;
}

function defineCircle(x: number, y: number, radius: number ): string {
    let d : string = [
        'M', x, y,
        'm', -radius, 0 ,
        'a', radius, radius, 0 , 1, 0, radius * 2 , 0,
        'a', radius, radius, 0 , 1, 0, -radius * 2 , 0,
    ].join(' ');
    return d;
}
/**
 * Function to show the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
export function showSpinner(container: HTMLElement): void {
    showHideSpinner(container, false);
    container = null;
}

function showHideSpinner(container: HTMLElement, isHide: boolean): void {
    let spinnerWrap: HTMLElement = container.classList.contains(CLS_SPINWRAP) ? container :
    container.querySelector('.' + CLS_SPINWRAP) as HTMLElement;
    let inner: HTMLElement = spinnerWrap.querySelector('.' + CLS_SPININWRAP) as HTMLElement;
    let spinCheck: boolean;
    spinCheck = isHide ? !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_HIDESPIN) :
    !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_SHOWSPIN);
    if (spinCheck) {
      let svgEle: SVGSVGElement = spinnerWrap.querySelector('svg') as SVGSVGElement;
      if (isNullOrUndefined(svgEle)) {
        return; }
      let id: string  = svgEle.getAttribute('id');
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
    isHide ? classList(spinnerWrap, [CLS_HIDESPIN], [CLS_SHOWSPIN]) : classList(spinnerWrap, [CLS_SHOWSPIN], [CLS_HIDESPIN]);
    container = null;
}
/**
 * Function to hide the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
export function hideSpinner(container: HTMLElement): void  {
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
export function setSpinner(args: SetSpinnerArgs, internalCreateElement?: createElementParams): void  {
    let makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    if (args.template !== undefined) {
        spinTemplate = args.template;
        if (args.template !== undefined) { spinCSSClass = args.cssClass; }
    }
    let container: Element[] = <NodeListOf<Element> & Element[]>  document.querySelectorAll('.' + CLS_SPINWRAP);
    for (let index: number = 0; index < container.length; index++) {
        ensureTemplate(args.template, (<HTMLElement>container[index]), args.type, args.cssClass, makeElement);
    }
}

function ensureTemplate ( template: string, container: HTMLElement, theme: string, cssClass: string, makeEle: createElementParams): void {
    if (isNullOrUndefined(template) && !container.classList.contains(CLS_SPINTEMPLATE)) {
        replaceTheme(container, theme, cssClass, makeEle);
        if (container.classList.contains(CLS_SHOWSPIN)) {
            container.classList.remove(CLS_SHOWSPIN); showSpinner(container);
        } else {
            container.classList.remove(CLS_HIDESPIN); hideSpinner(container);
        }
    } else {
      spinTemplate = template;
      if (!isNullOrUndefined(cssClass)) { spinCSSClass = cssClass; }
    }
}

function replaceTheme( container: HTMLElement, theme: string, cssClass: string, makeEle: createElementParams): void {
    if (!isNullOrUndefined(cssClass)) { container.classList.add(cssClass); }
    let svgElement: SVGSVGElement = container.querySelector('svg');
    let radius : number = theme === 'Bootstrap' ? parseFloat(svgElement.style.height) : parseFloat(svgElement.style.height) / 2;
    let classNames: string  = svgElement.getAttribute('class');
    let svgClassList: string[] = classNames.split(/\s/);
    if (svgClassList.indexOf('e-spin-material') >= 0) {
      let id: string =  svgElement.getAttribute('id');
      clearTimeout(globalTimeOut[id].timeOut);
    }
    setTheme(theme, container, radius, makeEle);
}

interface GlobalVariables {
    radius: number;
    count: number;
    previousId: number;
}

interface GlobalTimeOut {
    timeOut: number;
    type?: string;
    radius?: number;
    isAnimate?: boolean;
}

interface SpinnerInfo {
    uniqueID: string;
    container: HTMLElement;
    globalInfo: {[key: string]: GlobalVariables };
    timeOutVar: number;
}

/**
 * Arguments to create a spinner for the target.These properties are optional.
 */
export interface SpinnerArgs {
    /**
     * Target element to the Spinner.
     * ```
     * E.g : createSpinner({ target: element });
     * ```
     */
    target: HTMLElement;
    /**
     *  To set the width of the Spinner.
     */
    width?: string | number;
    /**
     *  To set the label to the Spinner element.
     */
    label?: string;
    /**
     *  Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string;
    /**
     *  Specify the template content to be displayed in the Spinner.
     */
    template?: string;
    /**
     *  Specify the type of the Spinner.
     */
    type?: SpinnerType;
}
/**
 * Arguments to change the Spinners in a page globally from application end.
 */
export interface SetSpinnerArgs {
    /**
     *  Specify the template content to be displayed in the Spinner.
     */
    template?: string;
    /**
     *  Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string;
    /**
     *  Specify the type of the Spinner.
     */
    type?: SpinnerType;
}
