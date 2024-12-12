import { isNullOrUndefined, classList, createElement, Browser } from '@syncfusion/ej2-base';
import { CreateElementArgs } from '@syncfusion/ej2-buttons';

const globalTimeOut: { [key: string]: GlobalTimeOut } = {};
const DEFT_MAT_WIDTH: number = 30;
const DEFT_MAT3_WIDTH: number = 30;
const DEFT_FAB_WIDTH: number = 30;
const DEFT_FLUENT_WIDTH: number = 30;
const DEFT_FLUENT2_WIDTH: number = 30;
const DEFT_BOOT_WIDTH: number = 30;
const DEFT_BOOT4_WIDTH: number = 36;
const DEFT_BOOT5_WIDTH: number = 36;
const CLS_SHOWSPIN: string = 'e-spin-show';
const CLS_HIDESPIN: string = 'e-spin-hide';
const CLS_MATERIALSPIN: string = 'e-spin-material';
const CLS_MATERIAL3SPIN: string = 'e-spin-material3';
const CLS_TAILWIND3SPIN: string = 'e-spin-tailwind3';
const CLS_FABRICSPIN: string = 'e-spin-fabric';
const CLS_FLUENTSPIN: string = 'e-spin-fluent';
const CLS_FLUENT2SPIN: string = 'e-spin-fluent2';
const CLS_TAILWINDSPIN: string = 'e-spin-tailwind';
const CLS_BOOTSPIN: string = 'e-spin-bootstrap';
const CLS_BOOT4SPIN: string = 'e-spin-bootstrap4';
const CLS_BOOT5SPIN: string = 'e-spin-bootstrap5';
const CLS_HIGHCONTRASTSPIN: string = 'e-spin-high-contrast';
const CLS_SPINWRAP: string = 'e-spinner-pane';
const CLS_SPININWRAP: string = 'e-spinner-inner';
const CLS_SPINCIRCLE: string = 'e-path-circle';
const CLS_SPINARC: string = 'e-path-arc';
const CLS_SPINLABEL: string = 'e-spin-label';
const CLS_SPINTEMPLATE: string = 'e-spin-template';
let spinTemplate: string = null;
let spinCSSClass: string = null;

export type createElementParams = (
    tag: string,
    prop?: { id?: string; className?: string; innerHTML?: string; styles?: string; attrs?: { [key: string]: string } }
) => HTMLElement;

/**
 * Defines the type of spinner.
 */
export type SpinnerType = 'Material' | 'Material3' | 'Fabric'| 'Bootstrap' | 'HighContrast' | 'Bootstrap4' | 'Tailwind' | 'Bootstrap5' | 'Fluent' | 'Fluent2' | 'Tailwind3';

/**
 * Function to change the Spinners in a page globally from application end.
 * ```
 * E.g : blazorSpinner({ action: "Create", options: {target: targetElement}, type: "" });
 * ```
 *
 * @param {string} action - specifies the string
 * @param {CreateArgs} options - specifies the args
 * @param {string} target - specifies the target
 * @param {string} type - specifes the type
 * @returns {void}
 * @private
 */
export function Spinner(action: string, options: CreateArgs, target: string, type: string): void {
    switch (action) {
    case 'Create':
        /* eslint-disable */
            const element: HTMLElement = <HTMLElement>document.querySelector(options.target as string) as HTMLElement;
            let args: SpinnerArgs = {
                type: <SpinnerType>type, target: element, cssClass: options.cssClass,
                label: options.label, width: options.width
            };
            /* eslint-enable */
        createSpinner(args);
        break;
    case 'Show':
        showSpinner(document.querySelector(target));
        break;
    case 'Hide':
        hideSpinner(document.querySelector(target));
        break;
    case 'Set': {
        const setArgs: SetArgs = { cssClass: options.cssClass, type: <SpinnerType>type };
        setSpinner(setArgs);
        break;
    }
    }
}

/**
 * Create a spinner for the specified target element.
 * ```
 * E.g : createSpinner({ target: targetElement, width: '34px', label: 'Loading..' });
 * ```
 *
 * @param {SpinnerArgs} args - specifies the args
 * @param {CreateElementArgs} internalCreateElement - specifis the element args
 * @returns {void}
 * @private
 */
export function createSpinner ( args: SpinnerArgs, internalCreateElement ?: createElementParams): void {
    if (!args.target) {
        return;
    }
    let radius: number;
    const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    // eslint-disable-next-line
    let container: { wrap: HTMLElement; inner_wrap: HTMLElement } = create_spinner_container(args.target, makeElement);
    if (!isNullOrUndefined(args.cssClass)) {
        const classNames: string[] = args.cssClass.split(' ').filter((className: string) => className.trim() !== '');
        container.wrap.classList.add(...classNames);
    }
    if (!isNullOrUndefined(args.template) || !isNullOrUndefined(spinTemplate)) {
        const template: string = !isNullOrUndefined(args.template) ? args.template : spinTemplate;
        container.wrap.classList.add(CLS_SPINTEMPLATE);
        replaceContent(container.wrap, template, spinCSSClass);
    } else {
        const theme: string = !isNullOrUndefined(args.type) ? args.type : getTheme(container.wrap);
        const width: string | number = !isNullOrUndefined(args.width) ? args.width : undefined;
        radius = calculateRadius(width, theme);
        setTheme(theme, container.wrap, radius, makeElement);
        if (!isNullOrUndefined(args.label)) {
            createLabel(container.inner_wrap, args.label, makeElement);
        }
    }
    container.wrap.classList.add(CLS_HIDESPIN);
    container = null;
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {string} label - specifies the string
 * @param {createElementParams} makeElement - specifies the element
 * @returns {HTMLElement} - returns the element
 */
function createLabel(container: HTMLElement, label: string, makeElement: createElementParams) : HTMLElement {
    const labelEle: HTMLElement = makeElement('div', {});
    labelEle.classList.add(CLS_SPINLABEL);
    labelEle.innerHTML = label;
    container.appendChild(labelEle);
    return labelEle;
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createMaterialSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Material', radius: radius };
    create_material_element (container, uniqueID, makeElement, CLS_MATERIALSPIN);
    mat_calculate_attributes(radius, container, 'Material', CLS_MATERIALSPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createTailwind3Spinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Tailwind3', radius: radius };
    create_material_element (container, uniqueID, makeElement, CLS_TAILWIND3SPIN);
    mat_calculate_attributes(radius, container, 'Tailwind3', CLS_TAILWIND3SPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createMaterial3Spinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Material3', radius: radius };
    create_material_element (container, uniqueID, makeElement, CLS_MATERIAL3SPIN);
    mat_calculate_attributes(radius, container, 'Material3', CLS_MATERIAL3SPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createBootstrap4Spinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Bootstrap4', radius: radius };
    create_material_element (container, uniqueID, makeElement, CLS_BOOT4SPIN);
    mat_calculate_attributes(radius, container, 'Bootstrap4', CLS_BOOT4SPIN);
}
/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createBootstrap5Spinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Bootstrap5', radius: radius };
    create_material_element (container, uniqueID, makeElement, CLS_BOOT5SPIN);
    mat_calculate_attributes(radius, container, 'Bootstrap5', CLS_BOOT5SPIN);
}
/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {string} uniqueID - specifies the id.
 * @param {number} radius - specifies the radius
 * @returns {void}
 */
function startMatAnimate(container: HTMLElement, uniqueID: string, radius: number): void {
    const globalObject: {[key: string]: GlobalVariables } = {};
    const timeOutVar: number = 0; globalTimeOut[`${uniqueID}`].timeOut = 0;
    globalObject[`${uniqueID}`] = globalVariables(uniqueID, radius, 0, 0);
    const spinnerInfo: SpinnerInfo  = { uniqueID: uniqueID, container: container, globalInfo: globalObject, timeOutVar: timeOutVar };
    animateMaterial(spinnerInfo);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createFabricSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Fabric', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FABRICSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FABRICSPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createFluentSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Fluent', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FLUENTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FLUENTSPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createFluent2Spinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Fluent2', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FLUENT2SPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FLUENT2SPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createTailwindSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Tailwind', radius: radius };
    create_fabric_element(container, uniqueID, CLS_TAILWINDSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_TAILWINDSPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createHighContrastSpinner(container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'HighContrast', radius: radius };
    create_fabric_element(container, uniqueID, CLS_HIGHCONTRASTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_HIGHCONTRASTSPIN);
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @returns {string} - returns the string
 */
function getTheme (container: HTMLElement) : string {
    const theme: string = window.getComputedStyle(container as Element, ':after').getPropertyValue('content');
    return theme.replace(/['"]+/g, '');
}

/**
 *
 * @param {string} theme - specifies the theme
 * @param {HTMLElement} container - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function setTheme(theme: string, container: HTMLElement, radius: number, makeElement: createElementParams): void {
    const innerContainer: HTMLElement = container.querySelector('.' + CLS_SPININWRAP) as HTMLElement;
    const svg: SVGSVGElement = innerContainer.querySelector('svg') as SVGSVGElement;
    if (!isNullOrUndefined(svg)) {
        innerContainer.removeChild(svg);
    }
    switch (theme) {
    case 'Material':
        createMaterialSpinner(innerContainer, radius, makeElement);
        break;
    case 'Material3':
        createMaterial3Spinner(innerContainer, radius, makeElement);
        break;
    case 'Fabric':
        createFabricSpinner(innerContainer, radius, makeElement);
        break;
    case 'Fluent':
        createFluentSpinner(innerContainer, radius, makeElement);
        break;
    case 'Fluent2':
        createFluent2Spinner(innerContainer, radius, makeElement);
        break;
    case 'Bootstrap':
        createBootstrapSpinner(innerContainer, radius, makeElement );
        break;
    case 'HighContrast':
        createHighContrastSpinner(innerContainer, radius, makeElement );
        break;
    case 'Bootstrap4':
        createBootstrap4Spinner(innerContainer, radius, makeElement );
        break;
    case 'Bootstrap5':
        createBootstrap5Spinner(innerContainer, radius, makeElement );
        break;
    case 'Tailwind':
    case 'Tailwind-dark':
        createTailwindSpinner(innerContainer, radius, makeElement );
        break;
    case 'Tailwind3':
        createTailwind3Spinner(innerContainer, radius, makeElement );
        break;
    }
}

/**
 *
 * @param {HTMLElement} innerContainer - specifies the element
 * @param {number} radius - specifies the radius
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
function createBootstrapSpinner(innerContainer: HTMLElement, radius: number, makeElement: createElementParams): void {
    const uniqueID: string = random_generator();
    globalTimeOut[`${uniqueID}`] = { timeOut: 0, type: 'Bootstrap', radius: radius };
    create_bootstrap_element(innerContainer, uniqueID, makeElement);
    boot_calculate_attributes(innerContainer, radius);
}
/**
 *
 * @param {HTMLElement} innerContainer - specifies the element
 * @param {string} uniqueID - specifies the id
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
// eslint-disable-next-line
function create_bootstrap_element(innerContainer: HTMLElement, uniqueID: string, makeElement: createElementParams): void {
    const svgBoot: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const viewBoxValue: number = 64;
    const trans: number = 32;
    const defaultRadius: number = 2;
    svgBoot.setAttribute('id', uniqueID);
    svgBoot.setAttribute('class', CLS_BOOTSPIN);
    svgBoot.setAttribute('viewBox', '0 0 ' + viewBoxValue + ' ' + viewBoxValue);
    innerContainer.insertBefore(svgBoot, innerContainer.firstChild);
    for (let item: number = 0;  item <= 7; item++) {
        const bootCircle: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bootCircle.setAttribute('class', CLS_SPINCIRCLE + '_' + item);
        bootCircle.setAttribute('r', defaultRadius + '' );
        bootCircle.setAttribute('transform', 'translate(' + trans + ',' + trans + ')');
        svgBoot.appendChild(bootCircle);
    }
}

/**
 *
 * @param {HTMLElement} innerContainer - specifies the element
 * @param {number} radius - specifies the radius
 * @returns {void}
 */
// eslint-disable-next-line
function boot_calculate_attributes( innerContainer: HTMLElement, radius: number): void {
    const svg: SVGSVGElement = innerContainer.querySelector('svg.e-spin-bootstrap') as SVGSVGElement;
    const x: number = 0; const y: number = 0; const rad: number = 24;
    svg.style.width = svg.style.height = radius + 'px';
    let startArc: number = 90;
    for (let item: number = 0;  item <= 7; item++) {
        const start: { x: number; y: number } = defineArcPoints(x, y, rad, startArc);
        const circleEle: SVGCircleElement = svg.querySelector('.' + CLS_SPINCIRCLE + '_' + item) as SVGCircleElement;
        circleEle.setAttribute('cx',  start.x + '' );
        circleEle.setAttribute('cy',  start.y + '' );
        startArc = startArc >= 360 ? 0 : startArc;
        startArc = startArc + 45;
    }
}

/**
 *
 * @param {number} begin - specifies the number
 * @param {number} stop  - specifirs the number
 * @returns {number[]} - returns the array of number
 */
function generateSeries(begin: number, stop: number): number[] {
    const series: number[] = [];
    const start: number = begin;
    const end: number = stop;
    let increment: boolean = false;
    let count: number = 1;
    formSeries(start);
    /**
     *
     * @param {number} i - specifies the number
     * @returns {void}
     */
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
                if (i === 8 ) {
                    increment = false;
                }
            } else if (i <= 8 && !increment ) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            ++count;
            formSeries(i);
        }
    }
    return series;
}

/**
 *
 * @param {HTMLElement} innerContainer - specifies the element
 * @returns {void}
 */
function animateBootstrap(innerContainer: HTMLElement): void {
    const svg: SVGSVGElement = innerContainer.querySelector('svg.e-spin-bootstrap') as SVGSVGElement;
    const id: string = svg.getAttribute('id');
    for (let i: number = 1 ; i <= 8; i++) {
        const circleEle: SVGCircleElement = (innerContainer.getElementsByClassName('e-path-circle_' +
        (i === 8 ? 0 : i))[0]) as SVGCircleElement;
        rotation(circleEle, i, i, generateSeries(i , i), id);
    }

    /**
     *
     * @param {SVGCircleElement} circle - specifies the circl element
     * @param {number} start - specifies the number
     * @param {number} end - specifies the end number
     * @param {number} series - specifies the series
     * @param {string} id - specifies the id
     * @returns {void}
     */
    function rotation (circle: SVGCircleElement, start: number, end: number, series: number[], id: string): void {
        let count: number = 0;
        boot_animate(start);
        // eslint-disable-next-line
        function boot_animate(radius: number): void {
            if (globalTimeOut[`${id}`].isAnimate) {
                ++count;
                circle.setAttribute('r', radius + '');
                if (count >= series.length) {
                    count = 0;
                }
                // eslint-disable-next-line
                globalTimeOut[id].timeOut = setTimeout( boot_animate.bind(null, series[count]), 18);
            }
        }
    }
}

/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {string} template - specifies the template
 * @param {string} cssClass - specifies the css class.
 * @returns {void}
 */
function replaceContent(container: HTMLElement, template: string, cssClass?: string): void {
    if (!isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    const inner: HTMLElement = container.querySelector('.e-spinner-inner') as HTMLElement;
    inner.innerHTML = template;
}

/**
 *
 * @param {string} width - specifies the width
 * @param {string} theme - specifies the string
 * @returns {number} - returns the number
 */
function calculateRadius(width: string | number, theme: string): number {
    let defaultSize: number;
    switch (theme) {
    case 'Material':
        defaultSize = DEFT_MAT_WIDTH;
        break;
    case 'Material3':
        defaultSize = DEFT_MAT3_WIDTH;
        break;
    case 'Fabric':
        defaultSize = DEFT_FAB_WIDTH;
        break;
    case 'Tailwind':
    case 'Tailwind-dark':
    case 'Tailwind3':
        defaultSize = DEFT_FAB_WIDTH;
        break;
    case 'Fluent':
        defaultSize = DEFT_FLUENT_WIDTH;
        break;
    case 'Fluent2':
        defaultSize = DEFT_FLUENT2_WIDTH;
        break;
    case 'Bootstrap4':
        defaultSize = DEFT_BOOT4_WIDTH;
        break;
    case 'Bootstrap5':
        defaultSize = DEFT_BOOT5_WIDTH;
        break;
    default:
        defaultSize = DEFT_BOOT_WIDTH;
    }
    width = width ? parseFloat(width + '') : defaultSize;
    return theme ===  'Bootstrap' ? width : width / 2;
}
/**
 *
 * @param {string} id - specifies the id
 * @param {number} radius - specifies the radius
 * @param {number} count - specifies the number count
 * @param {number} previousId - specifies the previous id
 * @returns {GlobalVariables} - returns the variables
 */
function globalVariables(id: string, radius: number, count: number, previousId: number) : GlobalVariables {
    return  {
        radius: radius,
        count: count,
        previousId: previousId
    };
}

/**
 * @returns {string} - returns the string
 */
// eslint-disable-next-line
function random_generator() : string {
    let random: string = '';
    const combine: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i: number = 0; i < 5; i++) {
        random += combine.charAt(Math.floor(Math.random() * combine.length));
    }
    return random;
}
/**
 *
 * @param {HTMLElement} innerCon - specifies the element
 * @param {string} uniqueID - specifies the unique id
 * @param {string} themeClass - specifies the string
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
// eslint-disable-next-line
function create_fabric_element ( innerCon: HTMLElement, uniqueID: string, themeClass: string, makeElement: createElementParams ): void {
    const svgFabric: SVGSVGElement =  document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFabric.setAttribute('id', uniqueID);
    svgFabric.setAttribute('class', themeClass);
    const fabricCirclePath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    const fabricCircleArc: SVGPathElement =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCircleArc.setAttribute('class', CLS_SPINARC);
    innerCon.insertBefore(svgFabric, innerCon.firstChild);
    svgFabric.appendChild(fabricCirclePath);
    svgFabric.appendChild(fabricCircleArc);
}

/**
 *
 * @param {HTMLElement} innerContainer - specifies the element
 * @param {string} uniqueID - specifies the unique id
 * @param {createElementParams} makeElement - specifies the element
 * @param {string} cls - specifies the string
 * @returns {void}
 */
// eslint-disable-next-line
function create_material_element ( innerContainer: HTMLElement, uniqueID: string, makeElement: createElementParams, cls: string): void {
    const svgMaterial: SVGSVGElement =   document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const matCirclePath: SVGPathElement =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgMaterial.setAttribute('class', cls);
    svgMaterial.setAttribute('id', uniqueID);
    matCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    innerContainer.insertBefore(svgMaterial, innerContainer.firstChild);
    svgMaterial.appendChild(matCirclePath);
}

/**
 *
 * @param {HTMLElement} target - specifies the element
 * @param {createElementParams} makeElement - specifies the element
 * @returns {void}
 */
// eslint-disable-next-line
function create_spinner_container(target: HTMLElement, makeElement: createElementParams): { wrap: HTMLElement; inner_wrap: HTMLElement} {
    const spinnerContainer: HTMLElement = makeElement('div', {});
    const spinnerInnerContainer: HTMLElement = makeElement('div', {});
    spinnerContainer.classList.add(CLS_SPINWRAP);
    spinnerInnerContainer.classList.add(CLS_SPININWRAP);
    spinnerInnerContainer.setAttribute('aria-disabled', 'true');
    target.appendChild(spinnerContainer);
    spinnerContainer.appendChild(spinnerInnerContainer);
    // eslint-disable-next-line
    return { wrap: spinnerContainer , inner_wrap: spinnerInnerContainer };
}
/**
 *
 * @param {SpinnerInfo} spinnerInfo - specifies the spinner
 * @returns {void}
 */
function animateMaterial(spinnerInfo: SpinnerInfo): void {
    const start: number = 1;
    const end: number = 149;
    const duration: number = 1333;
    const max: number = 75;
    createCircle( start, end, easeAnimation,
                  duration, spinnerInfo.globalInfo[spinnerInfo.uniqueID].count, max, spinnerInfo );
    spinnerInfo.globalInfo[spinnerInfo.uniqueID].count = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].count % 4;
}
/**
 *
 * @param {number} start - specifies the number
 * @param {number} end - specifies the end number
 * @param {Function} easing - specifies the function
 * @param {number} duration - specifies the duration
 * @param {number} count - specifies the count
 * @param {number} max - specifies the max number
 * @param {SpinnerInfo} spinnerInfo - specifies the spinner info
 * @returns {void}
 */
function createCircle(start: number, end: number, easing: Function, duration: number,
                      count: number, max: number, spinnerInfo: SpinnerInfo): void {
    const id: number = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId;
    const startTime: number = new Date().getTime();
    const change: number = end - start;
    const diameter: number = getSize((spinnerInfo.globalInfo[spinnerInfo.uniqueID].radius * 2) + '');
    const strokeSize: number = getStrokeSize(diameter);
    const rotate: number = -90 * (spinnerInfo.globalInfo[spinnerInfo.uniqueID].count || 0);
    mat_animation(spinnerInfo);
    // eslint-disable-next-line
    function mat_animation(spinnerInfo: SpinnerInfo): void {
        const currentTime: number = Math.max(0, Math.min(new Date().getTime() - startTime, duration));
        updatePath( easing(currentTime, start, change, duration), spinnerInfo.container);
        if (id === spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId && currentTime < duration) {
            // eslint-disable-next-line
            globalTimeOut[spinnerInfo.uniqueID].timeOut = setTimeout(mat_animation.bind(null, spinnerInfo), 1);
        } else {
            animateMaterial(spinnerInfo);
        }
    }
    /**
     *
     * @param {number} value - specifies the number value
     * @param {HTMLElement} container - specifies the container
     * @returns {void}
     */
    function updatePath (value: number, container: HTMLElement): void {
        if (!isNullOrUndefined(container.querySelector('svg.e-spin-material')) || !isNullOrUndefined(container.querySelector('svg.e-spin-material3')) || !isNullOrUndefined(container.querySelector('svg.e-spin-tailwind3'))) {
            let svg: SVGSVGElement;
            if (!isNullOrUndefined(container.querySelector('svg.e-spin-material')) &&
                !isNullOrUndefined(container.querySelector('svg.e-spin-material').querySelector('path.e-path-circle'))) {
                svg = container.querySelector('svg.e-spin-material') as SVGSVGElement;
            }
            else if (!isNullOrUndefined(container.querySelector('svg.e-spin-material3')) &&
                !isNullOrUndefined(container.querySelector('svg.e-spin-material3').querySelector('path.e-path-circle'))) {
                svg = container.querySelector('svg.e-spin-material3') as SVGSVGElement;
            }
            else if (!isNullOrUndefined(container.querySelector('svg.e-spin-tailwind3')) &&
                !isNullOrUndefined(container.querySelector('svg.e-spin-tailwind3').querySelector('path.e-path-circle'))) {
                svg = container.querySelector('svg.e-spin-tailwind3') as SVGSVGElement;
            }
            if (!isNullOrUndefined(svg)){
                const path: SVGPathElement = svg.querySelector('path.e-path-circle') as SVGPathElement;
                path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, value, max) + '');
                path.setAttribute('transform', 'rotate(' + (rotate) + ' ' + diameter / 2 + ' ' + diameter / 2 + ')');
            }
        }
    }
}
/**
 *
 * @param {number} radius - specifies the number
 * @param {HTMLElement} container - specifies the element
 * @param {string} type - specifies the string type
 * @param {string} cls - specifies the string
 * @returns {void}
 */
// eslint-disable-next-line
function mat_calculate_attributes (radius: number , container: HTMLElement, type: string, cls: string): void {
    const diameter: number = radius * 2;
    const svg: SVGSVGElement = container.querySelector('svg.' + cls) as SVGSVGElement;
    const path: SVGPathElement = svg.querySelector('path.e-path-circle') as SVGPathElement;
    const strokeSize: number = getStrokeSize(diameter);
    const transformOrigin: string = (diameter / 2) + 'px';
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.width = svg.style.height = diameter + 'px';
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    path.setAttribute('d', drawArc(diameter, strokeSize));
    if (type === 'Material' || type === 'Material3' || type === 'Fluent2' || type === 'Tailwind3') {
        path.setAttribute('stroke-width', strokeSize + '');
        path.setAttribute('stroke-dasharray', ((diameter - strokeSize) * Math.PI * 0.75) + '');
        path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, 1, 75) + '');
    }
}
/**
 *
 * @param {string} value - specifies the value
 * @returns {number} - returns the number
 */
function getSize(value: string ): number {
    const parsed: number = parseFloat(value);
    return parsed;
}
/**
 *
 * @param {number} diameter - specifies the diameter
 * @param {number} strokeSize - specifies the size
 * @returns {string} - returns the string
 */
function drawArc(diameter: number, strokeSize: number): string {
    const radius: number = diameter / 2;
    const offset: number = strokeSize / 2;
    return 'M' + radius + ',' + offset
        + 'A' + (radius - offset) + ',' + (radius - offset) + ' 0 1 1 ' + offset + ',' + radius;
}
/**
 *
 * @param {number} diameter - specifies the number
 * @returns {number} - returns the number
 */
function getStrokeSize(diameter: number): number {
    return 10 / 100 * diameter;
}
/**
 *
 * @param {number} diameter - specifies the number
 * @param {number} strokeSize - specifies the stroke size
 * @param {number} value - specifies the value
 * @param {number} max - specifies the max number
 * @returns {number} - returns the number
 */
function getDashOffset(diameter: number, strokeSize: number, value: number, max: number): number {
    return (diameter - strokeSize) * Math.PI * ( (3 * (max) / 100) - (value / 100) );
}
/**
 *
 * @param {number} current - specifies the number
 * @param {number} start - specifies the stroke size
 * @param {number} change - specifies the value
 * @param {number} duration - specifies the max number
 * @returns {number} - returns the number
 */
function easeAnimation(current: number, start: number, change: number, duration: number): number {
    const timestamp: number = (current /= duration) * current;
    const timecount: number = timestamp * current;
    return start + change * (6 * timecount * timestamp + -15 * timestamp * timestamp + 10 * timecount);
}

/**
 *
 * @param {number} radius - specifies the number
 * @param {HTMLElement} innerConainer - specifies the element
 * @param {string} trgClass - specifies the class
 * @returns {void}
 */
// eslint-disable-next-line
function fb_calculate_attributes(radius: number, innerConainer: HTMLElement, trgClass: string): void {
    const centerX: number = radius;
    const centerY: number = radius;
    const diameter: number = radius * 2;
    const startArc: number = 315;
    const endArc: number = 45;
    const svg: SVGSVGElement = innerConainer.querySelector('.' + trgClass) as SVGSVGElement;
    const circle: SVGPathElement = svg.querySelector('.e-path-circle') as SVGPathElement;
    const path: SVGPathElement = svg.querySelector('.e-path-arc') as SVGPathElement;
    const transformOrigin: string = (diameter / 2) + 'px';
    circle.setAttribute('d', defineCircle(centerX, centerY , radius));
    path.setAttribute('d', defineArc(centerX, centerY, radius, startArc, endArc));
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    svg.style.width = svg.style.height = diameter + 'px';
}
/**
 *
 * @param {number} centerX - specifies the number
 * @param {number} centerY - specifies the stroke size
 * @param {number} radius - specifies the value
 * @param {number} angle - specifies the max number
 * @returns {number} - returns the number
 */
function defineArcPoints(centerX: number, centerY: number, radius: number, angle: number): {x: number; y: number} {
    const radians: number = (angle - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}
/**
 *
 * @param {number} x - specifies the number
 * @param {number} y - specifies the stroke size
 * @param {number} radius - specifies the radius
 * @param {number} startArc - specifies the value
 * @param {number} endArc - specifies the max number
 * @returns {number} - returns the number
 */
function defineArc(x: number, y: number, radius: number, startArc: number, endArc: number): string {
    const start: {x: number; y: number } = defineArcPoints(x, y, radius, endArc);
    const end: {x: number; y: number } = defineArcPoints(x, y, radius, startArc);
    const d: string = [
        'M', start.x, start.y,
        'A', radius, radius, 0, 0, 0, end.x, end.y
    ].join(' ');
    return d;
}
/**
 *
 * @param {number} x - specifies the number
 * @param {number} y - specifies the stroke size
 * @param {number} radius - specifies the value
 * @returns {string} - returns the string
 */
function defineCircle(x: number, y: number, radius: number ): string {
    const d : string = [
        'M', x, y,
        'm', -radius, 0 ,
        'a', radius, radius, 0 , 1, 0, radius * 2 , 0,
        'a', radius, radius, 0 , 1, 0, -radius * 2 , 0
    ].join(' ');
    return d;
}
/**
 * Function to show the Spinner.
 *
 * @param {HTMLElement} container - Specify the target of the Spinner.
 * @returns {void}
 * @private
 */
export function showSpinner(container: HTMLElement): void {
    showHideSpinner(container, false);
    container = null;
}
/**
 *
 * @param {HTMLElement} container - specifies the element
 * @param {boolean} isHide - specifies the boolean
 * @returns {void}
 */
function showHideSpinner(container: HTMLElement, isHide: boolean): void {
    let spinnerWrap: HTMLElement;
    if (container) {
        if (container.classList.contains(CLS_SPINWRAP)) {
            spinnerWrap = container;
        }
        else {
            const spinWrapCollection: NodeListOf<HTMLElement> = container.querySelectorAll('.' + CLS_SPINWRAP) as NodeListOf<HTMLElement>;
            if (Browser.isIE) {
                for (let i: number = 0; i < spinWrapCollection.length; i++) {
                    if (spinWrapCollection[i as number].parentElement && spinWrapCollection[i as number].parentElement === container) {
                        spinnerWrap = spinWrapCollection[i as number];
                        break;
                    }
                }
            }
            else {
                spinnerWrap = Array.from(spinWrapCollection).find((wrap: HTMLElement) => wrap.parentElement === container) || null;
            }
        }
    }
    if (container && spinnerWrap) {
        const inner: HTMLElement = spinnerWrap.querySelector('.' + CLS_SPININWRAP) as HTMLElement;
        const spinCheck: boolean = isHide ? !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) &&
            !spinnerWrap.classList.contains(CLS_HIDESPIN) :
            !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_SHOWSPIN);
        if (spinCheck) {
            const svgEle: SVGSVGElement = spinnerWrap.querySelector('svg') as SVGSVGElement;
            if (isNullOrUndefined(svgEle)) {
                return;
            }
            const id: string = svgEle.getAttribute('id');
            globalTimeOut[`${id}`].isAnimate = !isHide;
            switch (globalTimeOut[`${id}`].type) {
            case 'Material':
            case 'Material3':
            case 'Tailwind3':
                if (isHide) {
                    clearTimeout(globalTimeOut[id as string].timeOut);
                } else {
                    startMatAnimate(inner, id, globalTimeOut[id as string].radius);
                }
                break;
            case 'Bootstrap':
                if (isHide) {
                    clearTimeout(globalTimeOut[id as string].timeOut);
                } else {
                    animateBootstrap(inner);
                }
                break;
            }
        }
        if (isHide) {
            classList(spinnerWrap, [CLS_HIDESPIN], [CLS_SHOWSPIN]);
        } else {
            classList(spinnerWrap, [CLS_SHOWSPIN], [CLS_HIDESPIN]);
        }
        container = null;
    }
}
/**
 * Function to hide the Spinner.
 *
 * @param {HTMLElement} container - Specify the target of the Spinner.
 * @returns {void}
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
 *
 * @param {SetSpinnerArgs} args - specifies the args
 * @param {createElementParams} internalCreateElement - specifies the element params
 * @returns {void}
 * @private
 */
export function setSpinner(args: SetSpinnerArgs, internalCreateElement?: createElementParams): void  {
    const makeElement: createElementParams = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    if (args.template !== undefined) {
        spinTemplate = args.template;
        if (args.template !== undefined) {
            spinCSSClass = args.cssClass;
        }
    }
    const container: Element[] = <NodeListOf<Element> & Element[]>  document.querySelectorAll('.' + CLS_SPINWRAP);
    for (let index: number = 0; index < container.length; index++) {
        ensureTemplate(args.template, (<HTMLElement>container[index as number]), args.type, args.cssClass, makeElement);
    }
}
/**
 *
 * @param {string} template - specifies the string
 * @param {HTMLElement} container - specifies the container
 * @param {string} theme - specifies the theme
 * @param {string} cssClass - specifies the string class
 * @param {createElementParams} makeEle - specifies the params
 * @returns {void}
 */
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
        if (!isNullOrUndefined(cssClass)) {
            spinCSSClass = cssClass;
        }
        if (!isNullOrUndefined(spinTemplate)) {
            replaceContent(container, spinTemplate, spinCSSClass);
        }
    }
}
/**
 *
 * @param {HTMLElement} container - specifies the container
 * @param {string} theme - specifies the theme
 * @param {string} cssClass - specifies the string class
 * @param {createElementParams} makeEle - specifies the params
 * @returns {void}
 */
function replaceTheme( container: HTMLElement, theme: string, cssClass: string, makeEle: createElementParams): void {
    if (!isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    const svgElement: SVGSVGElement = container.querySelector('svg');
    if (!isNullOrUndefined(svgElement)){
        const radius : number = theme === 'Bootstrap' ? parseFloat(svgElement.style.height) : parseFloat(svgElement.style.height) / 2;
        const classNames: string  = svgElement.getAttribute('class');
        const svgClassList: string[] = classNames.split(/\s/);
        if (svgClassList.indexOf('e-spin-material') >= 0) {
            const id: string =  svgElement.getAttribute('id');
            clearTimeout(globalTimeOut[`${id}`].timeOut);
        }
        setTheme(theme, container, radius, makeEle);
    }
}

interface GlobalVariables {
    radius: number
    count: number
    previousId: number
}

interface GlobalTimeOut {
    timeOut: number
    type?: string
    radius?: number
    isAnimate?: boolean
}

interface SpinnerInfo {
    uniqueID: string
    container: HTMLElement
    globalInfo: {[key: string]: GlobalVariables }
    timeOutVar: number
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
    target: HTMLElement
    /**
     * To set the width of the Spinner.
     */
    width?: string | number
    /**
     * To set the label to the Spinner element.
     */
    label?: string
    /**
     * Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string
    /**
     * Specify the template content to be displayed in the Spinner.
     */
    template?: string
    /**
     * Specify the type of the Spinner.
     */
    type?: SpinnerType
}
/**
 * Arguments to change the Spinners in a page globally from application end.
 */
export interface SetSpinnerArgs {
    /**
     * Specify the template content to be displayed in the Spinner.
     */
    template?: string
    /**
     * Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string
    /**
     * Specify the type of the Spinner.
     */
    type?: SpinnerType
}
/**
 * Arguments to change the `Blazor` Spinners in a page globally from application end.
 */
export interface SetArgs {
    /**
     * Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string
    /**
     * Specify the type of the Spinner.
     */
    type?: SpinnerType
}
/**
 * Arguments to create a `Blazor` spinner for the target.
 */
export interface CreateArgs {
    /**
     * Target element to the Spinner.
     * ```
     * E.g : createSpinner({ target: element });
     * ```
     */
    target: string
    /**
     * To set the width of the Spinner.
     */
    width?: string | number
    /**
     * To set the label to the Spinner element.
     */
    label?: string
    /**
     * Sets the CSS classes to root element of the Spinner which helps to customize the complete UI styles.
     */
    cssClass?: string
    /**
     * Specify the type of the Spinner.
     */
    type?: SpinnerType
}
