import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, Touch, attributes, classList, closest, compile, detach, extend, formatUnit, getUniqueID, isBlazor, isNullOrUndefined, isUndefined, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { getZindexPartial } from '@syncfusion/ej2-popups';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ROOT = 'e-toast';
const CONTAINER = 'e-toast-container';
const TITLE = 'e-toast-title';
const WIDTHFULL = 'e-toast-full-width';
const CONTENT = 'e-toast-content';
const MESSAGE = 'e-toast-message';
const ICON = 'e-toast-icon';
const PROGRESS = 'e-toast-progress';
const ACTIOBUTTONS = 'e-toast-actions';
const CLOSEBTN = 'e-toast-close-icon';
const RTL = 'e-rtl';
const TOAST_REF_ELEMENT = 'e-toast-ref-element';
const TOAST_BLAZOR_HIDDEN = 'e-blazor-toast-hidden';
/**
 * An object that is used to configure the Toast X Y positions.
 */
class ToastPosition extends ChildProperty {
}
__decorate([
    Property('Left')
], ToastPosition.prototype, "X", void 0);
__decorate([
    Property('Top')
], ToastPosition.prototype, "Y", void 0);
/**
 * An object that is used to configure the action button model properties and event.
 */
class ButtonModelProps extends ChildProperty {
}
__decorate([
    Property(null)
], ButtonModelProps.prototype, "model", void 0);
__decorate([
    Property(null)
], ButtonModelProps.prototype, "click", void 0);
/**
 * An object that is used to configure the animation object of Toast.
 */
class ToastAnimations extends ChildProperty {
}
__decorate([
    Property('FadeIn')
], ToastAnimations.prototype, "effect", void 0);
__decorate([
    Property(600)
], ToastAnimations.prototype, "duration", void 0);
__decorate([
    Property('ease')
], ToastAnimations.prototype, "easing", void 0);
/**
 * An object that is used to configure the show/hide animation settings of Toast.
 */
class ToastAnimationSettings extends ChildProperty {
}
__decorate([
    Complex({ effect: 'FadeIn', duration: 600, easing: 'ease' }, ToastAnimations)
], ToastAnimationSettings.prototype, "show", void 0);
__decorate([
    Complex({ effect: 'FadeOut', duration: 600, easing: 'ease' }, ToastAnimations)
], ToastAnimationSettings.prototype, "hide", void 0);
/**
 * The Toast is a notification pop-up that showing on desired position which can provide an information to the user.
 *  * ```html
 * <div id="toast"/>
 * <script>
 *   var toastObj = new Toast();
 *   toastObj.appendTo("#toast");
 * </script>
 * ```
 */
let Toast = class Toast extends Component {
    /**
     * Initializes a new instance of the Toast class.
     * @param options  - Specifies Toast model properties as options.
     * @param element  - Specifies the element that is rendered as a Toast.
     */
    constructor(options, element) {
        super(options, element);
        this.toastCollection = [];
    }
    /**
     * Gets the Component module name.
     * @private
     */
    getModuleName() {
        return 'toast';
    }
    /**
     * Gets the persisted state properties of the Component.
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     */
    destroy() {
        this.hide('All');
        this.element.classList.remove(CONTAINER);
        setStyleAttribute(this.element, { 'position': '', 'z-index': '' });
        if (!isNullOrUndefined(this.refElement) && !isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore(this.element, this.refElement);
            detach(this.refElement);
            this.refElement = undefined;
        }
        if (!this.isBlazorServer()) {
            super.destroy();
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        //There is no event handler
        this.isDevice = Browser.isDevice;
        if (this.width === '300px') {
            this.width = (this.isDevice && screen.width < 768) ? '100%' : '300px';
        }
        if (isNullOrUndefined(this.target)) {
            this.target = document.body;
        }
        if (this.enableRtl && !this.isBlazorServer()) {
            this.element.classList.add(RTL);
        }
    }
    /**
     * Initialize the component rendering
     * @private
     */
    render() {
        this.progressObj = [];
        this.intervalId = [];
        this.contentTemplate = null;
        this.toastTemplate = null;
        if (this.isDevice && screen.width < 768) {
            new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
        }
        this.renderComplete();
        if (!isNullOrUndefined(this.element.parentElement)) {
            let parentEle = this.element.parentElement;
            this.refElement = this.createElement('div', { className: TOAST_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, this.element);
        }
        this.initRenderClass = this.element.className;
    }
    /**
     * To show Toast element on a document with the relative position.
     * @param  {ToastModel} toastObj? - To show Toast element on screen.
     * @returns void
     * @deprecated
     */
    show(toastObj) {
        let collectionObj;
        if (!isNullOrUndefined(toastObj)) {
            this.templateChanges(toastObj);
            collectionObj = JSON.parse(JSON.stringify(toastObj));
            extend(this, this, toastObj);
        }
        if (isNullOrUndefined(this.toastContainer)) {
            this.toastContainer = this.getContainer();
            let target = typeof (this.target) === 'string' ? document.querySelector(this.target) : document.body;
            if (isNullOrUndefined(target)) {
                return;
            }
            if (target.tagName === 'BODY') {
                this.toastContainer.style.position = 'fixed';
            }
            else {
                this.toastContainer.style.position = 'absolute';
                target.style.position = 'relative';
            }
            this.setPositioning(this.position);
            target.appendChild(this.toastContainer);
        }
        if (this.isBlazorServer() && this.element.classList.contains('e-control')) {
            this.isToastModel(toastObj);
            return;
        }
        this.toastEle = this.createElement('div', { className: ROOT, id: getUniqueID('toast') });
        this.setWidthHeight();
        this.setCSSClass(this.cssClass);
        (isNullOrUndefined(this.template) || this.template === '') ? this.personalizeToast() : this.templateRendering();
        this.setProgress();
        this.setCloseButton();
        this.setAria();
        this.appendToTarget(toastObj);
        if (!isNullOrUndefined(collectionObj)) {
            extend(collectionObj, { element: [this.toastEle] }, true);
            this.toastCollection.push(collectionObj);
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * @hidden
     * @deprecated
     * This method applicable for blazor alone.
     */
    showToast(id, toastObj) {
        this.toastEle = this.element.querySelector('#' + id);
        this.show(toastObj);
    }
    isToastModel(toastObj) {
        this.toastContainer = this.element;
        this.setPositioning(this.position);
        let proxy = this;
        if (!isNullOrUndefined(proxy.element.lastElementChild)) {
            this.setProgress();
        }
        this.setAria();
        this.appendToTarget(toastObj);
    }
    swipeHandler(e) {
        let toastEle = closest(e.originalEvent.target, '.' + ROOT + ':not(.' + CONTAINER + ')');
        let hideAnimation = this.animation.hide.effect;
        if (!isNullOrUndefined(toastEle)) {
            if (e.swipeDirection === 'Right') {
                this.animation.hide.effect = 'SlideRightOut';
                this.hide(toastEle);
            }
            else if (e.swipeDirection === 'Left') {
                this.animation.hide.effect = 'SlideLeftOut';
                this.hide(toastEle);
            }
            this.animation.hide.effect = hideAnimation;
        }
    }
    templateChanges(toastObj) {
        if (!isUndefined(toastObj.content) && !isNullOrUndefined(this.contentTemplate) && this.content !== toastObj.content) {
            this.clearContentTemplate();
        }
        if (!isUndefined(toastObj.template) && !isNullOrUndefined(this.toastTemplate) && this.template !== toastObj.template) {
            this.clearToastTemplate();
        }
    }
    setCSSClass(cssClass) {
        if (cssClass) {
            let split = cssClass.indexOf(',') !== -1 ? ',' : ' ';
            classList(this.toastEle, cssClass.split(split), []);
        }
    }
    setWidthHeight() {
        if (this.width === '300px') {
            this.toastEle.style.width = formatUnit(this.width);
        }
        else if (this.width === '100%') {
            this.toastContainer.classList.add(WIDTHFULL);
        }
        else {
            this.toastEle.style.width = formatUnit(this.width);
            this.toastContainer.classList.remove(WIDTHFULL);
        }
        this.toastEle.style.height = formatUnit(this.height);
    }
    templateRendering() {
        this.fetchEle(this.toastEle, this.template, 'template');
    }
    /**
     * @hidden
     */
    sanitizeHelper(value) {
        if (this.enableHtmlSanitizer) {
            let item = SanitizeHtmlHelper.beforeSanitize();
            let beforeEvent = {
                cancel: false,
                helper: null
            };
            extend(item, item, beforeEvent);
            this.trigger('beforeSanitizeHtml', item);
            if (item.cancel && !isNullOrUndefined(item.helper)) {
                value = item.helper(value);
            }
            else if (!item.cancel) {
                value = SanitizeHtmlHelper.serializeValue(item, value);
            }
        }
        return value;
    }
    /**
     * To Hide Toast element on a document.
     * To Hide all toast element when passing 'All'.
     * @param  {HTMLElement| Element| string} element? - To Hide Toast element on screen.
     * @returns void
     */
    hide(element) {
        if (isNullOrUndefined(this.toastContainer) || this.toastContainer.childElementCount === 0) {
            return;
        }
        if (typeof element === 'string' && element === 'All') {
            for (let i = 0; i < this.toastContainer.childElementCount; i++) {
                this.destroyToast(this.toastContainer.children[i]);
            }
            return;
        }
        if (isNullOrUndefined(element)) {
            element = (this.newestOnTop ? this.toastContainer.lastElementChild : this.toastContainer.firstElementChild);
        }
        this.destroyToast(element);
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
    }
    fetchEle(ele, value, prob) {
        value = typeof (value) === 'string' ? this.sanitizeHelper(value) : value;
        let templateFn;
        let tempVar;
        let tmpArray;
        let templateProps;
        if (ele.classList.contains(TITLE)) {
            templateProps = this.element.id + 'title';
        }
        else if (ele.classList.contains(CONTENT)) {
            templateProps = this.element.id + 'content';
        }
        else {
            templateProps = this.element.id + 'template';
        }
        prob === 'content' ? tempVar = this.contentTemplate : tempVar = this.toastTemplate;
        if (!isNullOrUndefined(tempVar)) {
            ele.appendChild(tempVar.cloneNode(true));
            return ele;
        }
        try {
            if (document.querySelectorAll(value).length > 0) {
                let elem = null;
                if (prob !== 'title') {
                    elem = document.querySelector(value);
                    ele.appendChild(elem);
                    elem.style.display = '';
                }
                let clo = isNullOrUndefined(elem) ? tempVar : elem.cloneNode(true);
                prob === 'content' ? this.contentTemplate = clo : this.toastTemplate = clo;
            }
        }
        catch (e) {
            templateFn = compile(value);
            
        }
        if (!isNullOrUndefined(templateFn)) {
            if (!this.isBlazorServer()) {
                tmpArray = templateFn({}, this, prob, null, true);
            }
            else {
                let isString = true;
                tmpArray = templateFn({}, this, prob, templateProps, isString);
            }
        }
        if (!isNullOrUndefined(tmpArray) && tmpArray.length > 0 && !(isNullOrUndefined(tmpArray[0].tagName) && tmpArray.length === 1)) {
            [].slice.call(tmpArray).forEach((el) => {
                if (!isNullOrUndefined(el.tagName)) {
                    el.style.display = '';
                }
                ele.appendChild(el);
            });
        }
        else if (ele.childElementCount === 0) {
            ele.innerHTML = value;
        }
        return ele;
    }
    clearProgress(intervalId) {
        if (!isNullOrUndefined(this.intervalId[intervalId])) {
            clearInterval(this.intervalId[intervalId]);
            delete this.intervalId[intervalId];
        }
        if (!isNullOrUndefined(this.progressObj[intervalId])) {
            clearInterval(this.progressObj[intervalId].intervalId);
            delete this.progressObj[intervalId];
        }
    }
    clearContainerPos() {
        if (this.isBlazorServer()) {
            this.toastContainer = null;
            return;
        }
        if (this.customPosition) {
            setStyleAttribute(this.toastContainer, { 'left': '', 'top': '' });
            this.toastContainer = null;
            this.customPosition = false;
        }
        else {
            [ROOT + '-top-left',
                ROOT + '-top-right',
                ROOT + '-bottom-left',
                ROOT + '-bottom-right',
                ROOT + '-bottom-center',
                ROOT + '-top-center',
                ROOT + '-full-width'].forEach((pos) => {
                if (!isNullOrUndefined(this.toastContainer) && this.toastContainer.classList.contains(pos)) {
                    this.toastContainer.classList.remove(pos);
                }
            });
            this.toastContainer = null;
        }
        if (!isNullOrUndefined(this.contentTemplate)) {
            this.clearContentTemplate();
        }
        if (!isNullOrUndefined(this.toastTemplate)) {
            this.clearToastTemplate();
        }
    }
    clearContentTemplate() {
        this.contentTemplate.style.display = 'none';
        document.body.appendChild(this.contentTemplate);
        this.contentTemplate = null;
    }
    clearToastTemplate() {
        this.toastTemplate.style.display = 'none';
        document.body.appendChild(this.toastTemplate);
        this.toastTemplate = null;
    }
    isBlazorServer() {
        return (isBlazor() && this.isServerRendered);
    }
    destroyToast(toastEle) {
        let toastObj;
        for (let i = 0; i < this.toastCollection.length; i++) {
            if (this.toastCollection[i].element[0] === toastEle) {
                toastObj = this.toastCollection[i];
                this.toastCollection.splice(i, 1);
            }
        }
        let hideAnimate = this.animation.hide;
        let animate = {
            duration: hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
        };
        let intervalId = parseInt(toastEle.id.split('toast_')[1], 10);
        let toastClose = this.isBlazorServer() ? {
            options: toastObj,
            toastContainer: this.toastContainer
        } : {
            options: toastObj,
            toastContainer: this.toastContainer,
            toastObj: this,
        };
        if (!isNullOrUndefined(this.progressObj[intervalId]) && !isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            this.progressObj[intervalId].progressEle.style.width = '0%';
        }
        animate.end = () => {
            this.clearProgress(intervalId);
            if (!this.isBlazorServer() || isNullOrUndefined(toastObj)) {
                detach(toastEle);
            }
            this.trigger('close', toastClose);
            if (this.toastContainer.childElementCount === 0) {
                this.clearContainerPos();
            }
        };
        new Animation({}).animate(toastEle, animate);
    }
    personalizeToast() {
        this.setIcon();
        this.setTitle();
        this.setContent();
        this.actionButtons();
    }
    setAria() {
        attributes(this.toastEle, { 'role': 'alert' });
    }
    setPositioning(pos) {
        if (this.isBlazorServer()) {
            return;
        }
        if (!isNaN(parseFloat(pos.X)) || !isNaN(parseFloat(pos.Y))) {
            this.customPosition = true;
            setStyleAttribute(this.toastContainer, { 'left': formatUnit(pos.X), 'top': formatUnit(pos.Y) });
        }
        else {
            this.toastContainer.classList.add(ROOT + '-' + pos.Y.toString().toLowerCase() + '-' + pos.X.toString().toLowerCase());
        }
    }
    setCloseButton() {
        if (!this.showCloseButton) {
            return;
        }
        let localeText = { close: 'Close' };
        this.l10n = new L10n('toast', localeText, this.locale);
        this.l10n.setLocale(this.locale);
        let closeIconTitle = this.l10n.getConstant('close');
        let closeBtn = this.createElement('div', { className: CLOSEBTN + ' e-icons ', attrs: { tabindex: '0', 'aria-label': closeIconTitle } });
        this.toastEle.appendChild(closeBtn);
    }
    setProgress() {
        if (this.timeOut > 0) {
            let id = parseInt(this.toastEle.id.split('toast_')[1], 10);
            this.intervalId[id] = window.setTimeout(this.destroyToast.bind(this, this.toastEle), this.timeOut);
            this.progressObj[id] = { hideEta: null, intervalId: null, maxHideTime: null, element: null, timeOutId: null, progressEle: null };
            this.progressObj[id].maxHideTime = parseFloat(this.timeOut + '');
            this.progressObj[id].hideEta = new Date().getTime() + this.progressObj[id].maxHideTime;
            this.progressObj[id].element = this.toastEle;
            if (this.extendedTimeout > 0) {
                EventHandler.add(this.toastEle, 'mouseover', this.toastHoverAction.bind(this, id));
                EventHandler.add(this.toastEle, 'mouseleave', this.delayedToastProgress.bind(this, id));
                this.progressObj[id].timeOutId = this.intervalId[id];
            }
            if (this.showProgressBar) {
                this.progressBarEle = this.createElement('div', { className: PROGRESS });
                this.toastEle.insertBefore(this.progressBarEle, this.toastEle.children[0]);
                this.progressObj[id].intervalId = setInterval(this.updateProgressBar.bind(this, this.progressObj[id]), 10);
                this.progressObj[id].progressEle = this.progressBarEle;
            }
        }
    }
    toastHoverAction(id) {
        clearTimeout(this.progressObj[id].timeOutId);
        clearInterval(this.progressObj[id].intervalId);
        this.progressObj[id].hideEta = 0;
        let toastEle = this.progressObj[id].element;
        if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            this.progressObj[id].progressEle.style.width = '0%';
        }
    }
    delayedToastProgress(id) {
        let progress = this.progressObj[id];
        let toastEle = progress.element;
        progress.timeOutId = window.setTimeout(this.destroyToast.bind(this, toastEle), this.extendedTimeout);
        progress.maxHideTime = parseFloat(this.extendedTimeout + '');
        progress.hideEta = new Date().getTime() + progress.maxHideTime;
        if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            progress.intervalId = setInterval(this.updateProgressBar.bind(this, progress), 10);
        }
    }
    updateProgressBar(progressObj) {
        let percentage = ((progressObj.hideEta - (new Date().getTime())) / progressObj.maxHideTime) * 100;
        progressObj.progressEle.style.width = percentage + '%';
    }
    setIcon() {
        if (isNullOrUndefined(this.icon) || this.icon.length === 0) {
            return;
        }
        let iconEle = this.createElement('div', { className: ICON + ' e-icons ' + this.icon });
        this.toastEle.appendChild(iconEle);
    }
    setTitle() {
        if (isNullOrUndefined(this.title)) {
            return;
        }
        let titleEle = this.createElement('div', { className: TITLE });
        titleEle = this.fetchEle(titleEle, this.title, 'title');
        let msgContainer = this.createElement('div', { className: MESSAGE });
        msgContainer.appendChild(titleEle);
        this.toastEle.appendChild(msgContainer);
    }
    setContent() {
        let contentEle = this.createElement('div', { className: CONTENT });
        let ele = this.element;
        if (isNullOrUndefined(this.content) || this.content === '') {
            let isContent = this.element.innerHTML.replace(/\s/g, '') !== '';
            if ((ele.children.length > 0 || isContent) && !(ele.firstElementChild && ele.firstElementChild.classList.contains(ROOT))) {
                this.innerEle = document.createDocumentFragment();
                let tempEle = this.createElement('div');
                while (ele.childNodes.length !== 0) {
                    this.innerEle.appendChild(this.element.childNodes[0]);
                }
                contentEle.appendChild(this.innerEle);
                [].slice.call(contentEle.children).forEach((ele) => {
                    tempEle.appendChild(ele.cloneNode(true));
                });
                this.content = tempEle;
                this.appendMessageContainer(contentEle);
            }
        }
        else {
            if (typeof (this.content) === 'object' && !isNullOrUndefined(this.content.tagName)) {
                contentEle.appendChild(this.content);
                this.content = this.content.cloneNode(true);
                this.appendMessageContainer(contentEle);
            }
            else {
                contentEle = this.fetchEle(contentEle, this.content, 'content');
                this.appendMessageContainer(contentEle);
            }
        }
    }
    appendMessageContainer(element) {
        if (this.toastEle.querySelectorAll('.' + MESSAGE).length > 0) {
            this.toastEle.querySelector('.' + MESSAGE).appendChild(element);
        }
        else {
            let msgContainer = this.createElement('div', { className: MESSAGE });
            msgContainer.appendChild(element);
            this.toastEle.appendChild(msgContainer);
        }
    }
    actionButtons() {
        let actionBtnContainer = this.createElement('div', { className: ACTIOBUTTONS });
        [].slice.call(this.buttons).forEach((actionBtn) => {
            if (isNullOrUndefined(actionBtn.model)) {
                return;
            }
            let btnDom = this.createElement('button');
            btnDom.setAttribute('type', 'button');
            if (isNullOrUndefined(actionBtn.model.cssClass) || actionBtn.model.cssClass.length === 0) {
                actionBtn.model.cssClass = 'e-primary';
            }
            btnDom.classList.add('e-small');
            new Button(actionBtn.model, btnDom);
            if (!isNullOrUndefined(actionBtn.click) && typeof (actionBtn.click) === 'function') {
                EventHandler.add(btnDom, 'click', actionBtn.click);
            }
            actionBtnContainer.appendChild(btnDom);
        });
        if (actionBtnContainer.childElementCount > 0) {
            this.appendMessageContainer(actionBtnContainer);
        }
    }
    appendToTarget(toastObj) {
        let toastBeforeOpen = this.isBlazorServer() ? {
            options: toastObj,
            element: this.toastEle,
            cancel: false
        } : {
            options: toastObj,
            toastObj: this,
            element: this.toastEle,
            cancel: false
        };
        this.trigger('beforeOpen', toastBeforeOpen, (toastBeforeOpenArgs) => {
            if (!toastBeforeOpenArgs.cancel) {
                if (!this.isBlazorServer()) {
                    this.toastEle.style.display = 'none';
                }
                if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
                    this.toastContainer.insertBefore(this.toastEle, this.toastContainer.children[0]);
                }
                else if (!this.isBlazorServer()) {
                    this.toastContainer.appendChild(this.toastEle);
                }
                removeClass([this.toastEle], TOAST_BLAZOR_HIDDEN);
                EventHandler.add(this.toastEle, 'click', this.clickHandler, this);
                EventHandler.add(this.toastEle, 'keydown', this.keyDownHandler, this);
                this.toastContainer.style.zIndex = getZindexPartial(this.toastContainer) + '';
                this.displayToast(this.toastEle, toastObj);
            }
            else if (this.isBlazorServer()) {
                let intervalId = parseInt(this.toastEle.id.split('toast_')[1], 10);
                this.clearProgress(intervalId);
                detach(this.toastEle);
                if (this.toastContainer.childElementCount === 0) {
                    this.clearContainerPos();
                }
            }
        });
    }
    clickHandler(e) {
        if (!this.isBlazorServer()) {
            e.stopPropagation();
        }
        let target = e.target;
        let toastEle = closest(target, '.' + ROOT);
        let clickArgs = this.isBlazorServer() ? {
            element: toastEle, cancel: false, clickToClose: false, originalEvent: e
        } : {
            element: toastEle, cancel: false, clickToClose: false, originalEvent: e, toastObj: this
        };
        let isCloseIcon = target.classList.contains(CLOSEBTN);
        this.trigger('click', clickArgs, (toastClickArgs) => {
            if ((isCloseIcon && !toastClickArgs.cancel) || toastClickArgs.clickToClose) {
                this.destroyToast(toastEle);
            }
        });
    }
    keyDownHandler(e) {
        if (e.target.classList.contains(CLOSEBTN) &&
            (e.keyCode === 13 || e.keyCode === 32)) {
            let target = e.target;
            let toastEle = closest(target, '.' + ROOT);
            this.destroyToast(toastEle);
        }
    }
    displayToast(toastEle, toastObj) {
        let showAnimate = this.animation.show;
        let animate = {
            duration: showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing
        };
        let toastOpen = this.isBlazorServer() ? {
            options: toastObj,
            element: this.toastEle
        } : {
            options: toastObj,
            toastObj: this,
            element: this.toastEle,
        };
        animate.begin = () => {
            toastEle.style.display = '';
        };
        animate.end = () => {
            this.trigger('open', toastOpen);
        };
        new Animation(animate).animate(toastEle);
    }
    getContainer() {
        this.element.classList.add(CONTAINER);
        return this.element;
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let container = this.element;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    newProp.enableRtl ? container.classList.add(RTL) : container.classList.remove(RTL);
                    break;
            }
        }
    }
};
__decorate([
    Property('300px')
], Toast.prototype, "width", void 0);
__decorate([
    Property('auto')
], Toast.prototype, "height", void 0);
__decorate([
    Property(null)
], Toast.prototype, "title", void 0);
__decorate([
    Property(null)
], Toast.prototype, "content", void 0);
__decorate([
    Property(true)
], Toast.prototype, "enableHtmlSanitizer", void 0);
__decorate([
    Property(null)
], Toast.prototype, "icon", void 0);
__decorate([
    Property(null)
], Toast.prototype, "cssClass", void 0);
__decorate([
    Property(null)
], Toast.prototype, "template", void 0);
__decorate([
    Property(true)
], Toast.prototype, "newestOnTop", void 0);
__decorate([
    Property(false)
], Toast.prototype, "showCloseButton", void 0);
__decorate([
    Property(false)
], Toast.prototype, "showProgressBar", void 0);
__decorate([
    Property(5000)
], Toast.prototype, "timeOut", void 0);
__decorate([
    Property(1000)
], Toast.prototype, "extendedTimeout", void 0);
__decorate([
    Complex({}, ToastAnimationSettings)
], Toast.prototype, "animation", void 0);
__decorate([
    Complex({}, ToastPosition)
], Toast.prototype, "position", void 0);
__decorate([
    Collection([{}], ButtonModelProps)
], Toast.prototype, "buttons", void 0);
__decorate([
    Property(null)
], Toast.prototype, "target", void 0);
__decorate([
    Event()
], Toast.prototype, "created", void 0);
__decorate([
    Event()
], Toast.prototype, "beforeSanitizeHtml", void 0);
__decorate([
    Event()
], Toast.prototype, "destroyed", void 0);
__decorate([
    Event()
], Toast.prototype, "open", void 0);
__decorate([
    Event()
], Toast.prototype, "beforeOpen", void 0);
__decorate([
    Event()
], Toast.prototype, "close", void 0);
__decorate([
    Event()
], Toast.prototype, "click", void 0);
Toast = __decorate([
    NotifyPropertyChanges
], Toast);

/**
 * Toast modules
 */

/**
 * Notification Components
 */

export { ToastPosition, ButtonModelProps, ToastAnimations, ToastAnimationSettings, Toast };
//# sourceMappingURL=ej2-notifications.es2015.js.map
