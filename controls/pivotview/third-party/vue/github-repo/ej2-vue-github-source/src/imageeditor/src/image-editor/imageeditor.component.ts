import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ImageEditor, ImageEditorModel } from '@syncfusion/ej2-image-editor';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowUndoRedo', 'cssClass', 'disabled', 'enablePersistence', 'enableRtl', 'finetuneSettings', 'fontFamily', 'height', 'imageSmoothingEnabled', 'isReadOnly', 'locale', 'quickAccessToolbarTemplate', 'selectionSettings', 'showQuickAccessToolbar', 'theme', 'toolbar', 'toolbarTemplate', 'uploadSettings', 'width', 'zoomSettings', 'beforeSave', 'click', 'created', 'cropping', 'destroyed', 'editComplete', 'fileOpened', 'finetuneValueChanging', 'flipping', 'frameChange', 'imageFiltering', 'panning', 'quickAccessToolbarItemClick', 'quickAccessToolbarOpen', 'resizing', 'rotating', 'saved', 'selectionChanging', 'shapeChange', 'shapeChanging', 'toolbarCreated', 'toolbarItemClicked', 'toolbarUpdating', 'zooming'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the VueJS ImageEditor Component.
 * ```html
 * <ejs-imageeditor></ejs-imageeditor>
 * ```
 */
export let ImageEditorComponent: DefineVueComponent<ImageEditorModel> =  vueDefineComponent({
    name: 'ImageEditorComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ImageEditor({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: false as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {} as { [key: string]: Object },
            tagNameMapper: {} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },
        custom(): void {
            this.updated();
        },
        apply(): void {
            return this.ej2Instances.apply();
        },
        applyImageFilter(filterOption: Object): void {
            return this.ej2Instances.applyImageFilter(filterOption);
        },
        bringForward(shapeId: string): void {
            return this.ej2Instances.bringForward(shapeId);
        },
        bringToFront(shapeId: string): void {
            return this.ej2Instances.bringToFront(shapeId);
        },
        canRedo(): boolean {
            return this.ej2Instances.canRedo();
        },
        canUndo(): boolean {
            return this.ej2Instances.canUndo();
        },
        clearImage(): void {
            return this.ej2Instances.clearImage();
        },
        clearSelection(resetCrop?: boolean): void {
            return this.ej2Instances.clearSelection(resetCrop);
        },
        cloneShape(shapeId: string): boolean {
            return this.ej2Instances.cloneShape(shapeId);
        },
        crop(): boolean {
            return this.ej2Instances.crop();
        },
        deleteRedact(id: string): void {
            return this.ej2Instances.deleteRedact(id);
        },
        deleteShape(id: string): void {
            return this.ej2Instances.deleteShape(id);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        discard(): void {
            return this.ej2Instances.discard();
        },
        drawArrow(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string, arrowStart?: Object, arrowEnd?: Object, isSelected?: boolean): boolean {
            return this.ej2Instances.drawArrow(startX, startY, endX, endY, strokeWidth, strokeColor, arrowStart, arrowEnd, isSelected);
        },
        drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string, fillColor?: string, degree?: number, isSelected?: boolean): boolean {
            return this.ej2Instances.drawEllipse(x, y, radiusX, radiusY, strokeWidth, strokeColor, fillColor, degree, isSelected);
        },
        drawFrame(frameType: Object, color?: string, gradientColor?: string, size?: number, inset?: number, offset?: number, borderRadius?: number, frameLineStyle?: Object, lineCount?: number): boolean {
            return this.ej2Instances.drawFrame(frameType, color, gradientColor, size, inset, offset, borderRadius, frameLineStyle, lineCount);
        },
        drawImage(data: string | Object, x?: number, y?: number, width?: number, height?: number, isAspectRatio?: boolean, degree?: number, opacity?: number, isSelected?: boolean): boolean {
            return this.ej2Instances.drawImage(data, x, y, width, height, isAspectRatio, degree, opacity, isSelected);
        },
        drawLine(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string, isSelected?: boolean): boolean {
            return this.ej2Instances.drawLine(startX, startY, endX, endY, strokeWidth, strokeColor, isSelected);
        },
        drawPath(pointColl: Object[], strokeWidth?: number, strokeColor?: string, isSelected?: boolean): boolean {
            return this.ej2Instances.drawPath(pointColl, strokeWidth, strokeColor, isSelected);
        },
        drawRectangle(x?: number, y?: number, width?: number, height?: number, strokeWidth?: number, strokeColor?: string, fillColor?: string, degree?: number, isSelected?: boolean, borderRadius?: number): boolean {
            return this.ej2Instances.drawRectangle(x, y, width, height, strokeWidth, strokeColor, fillColor, degree, isSelected, borderRadius);
        },
        drawRedact(type?: Object, x?: number, y?: number, width?: number, height?: number, value?: number): boolean {
            return this.ej2Instances.drawRedact(type, x, y, width, height, value);
        },
        drawText(x?: number, y?: number, text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean, color?: string, isSelected?: boolean, degree?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, transformCollection?: Object[], underline?: boolean, strikethrough?: boolean): boolean {
            return this.ej2Instances.drawText(x, y, text, fontFamily, fontSize, bold, italic, color, isSelected, degree, fillColor, strokeColor, strokeWidth, transformCollection, underline, strikethrough);
        },
        enableShapeDrawing(shapeType: Object, isEnabled: boolean): void {
            return this.ej2Instances.enableShapeDrawing(shapeType, isEnabled);
        },
        enableTextEditing(): void {
            return this.ej2Instances.enableTextEditing();
        },
        export(type?: string, fileName?: string, imageQuality?: number): void {
            return this.ej2Instances.export(type, fileName, imageQuality);
        },
        finetuneImage(finetuneOption: Object, value: number): void {
            return this.ej2Instances.finetuneImage(finetuneOption, value);
        },
        flip(direction: Object): void {
            return this.ej2Instances.flip(direction);
        },
        freehandDraw(value: boolean): void {
            return this.ej2Instances.freehandDraw(value);
        },
        getImageData(includeAnnotations?: boolean): Object {
            return this.ej2Instances.getImageData(includeAnnotations);
        },
        getImageDimension(): Object {
            return this.ej2Instances.getImageDimension();
        },
        getImageFilter(filterOption: Object): string {
            return this.ej2Instances.getImageFilter(filterOption);
        },
        getRedacts(): Object[] {
            return this.ej2Instances.getRedacts();
        },
        getShapeSetting(id: string): Object {
            return this.ej2Instances.getShapeSetting(id);
        },
        getShapeSettings(): Object[] {
            return this.ej2Instances.getShapeSettings();
        },
        initialize(): void {
            return this.ej2Instances.initialize();
        },
        open(data: string | Object, resetChanges?: boolean, imageSettings?: Object): void {
            return this.ej2Instances.open(data, resetChanges, imageSettings);
        },
        pan(value: boolean, x?: number, y?: number): void {
            return this.ej2Instances.pan(value, x, y);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        reset(): void {
            return this.ej2Instances.reset();
        },
        resize(width: number, height: number, isAspectRatio?: boolean): boolean {
            return this.ej2Instances.resize(width, height, isAspectRatio);
        },
        rotate(degree: number): boolean {
            return this.ej2Instances.rotate(degree);
        },
        select(type: string, startX?: number, startY?: number, width?: number, height?: number): void {
            return this.ej2Instances.select(type, startX, startY, width, height);
        },
        selectRedact(id: string): boolean {
            return this.ej2Instances.selectRedact(id);
        },
        selectShape(id: string): boolean {
            return this.ej2Instances.selectShape(id);
        },
        sendBackward(shapeId: string): void {
            return this.ej2Instances.sendBackward(shapeId);
        },
        sendToBack(shapeId: string): void {
            return this.ej2Instances.sendToBack(shapeId);
        },
        straightenImage(degree: number): boolean {
            return this.ej2Instances.straightenImage(degree);
        },
        triggerEditCompleteEvent(args: Object): void {
            return this.ej2Instances.triggerEditCompleteEvent(args);
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
        update(): void {
            return this.ej2Instances.update();
        },
        updateRedact(setting: Object, isSelected?: boolean): boolean {
            return this.ej2Instances.updateRedact(setting, isSelected);
        },
        updateShape(setting: Object, isSelected?: boolean): boolean {
            return this.ej2Instances.updateShape(setting, isSelected);
        },
        zoom(zoomFactor: number, zoomPoint?: Object): void {
            return this.ej2Instances.zoom(zoomFactor, zoomPoint);
        },
    }
});

export type ImageEditorComponent = typeof ComponentBase & {
    ej2Instances: ImageEditor;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    apply(): void;
    applyImageFilter(filterOption: Object): void;
    bringForward(shapeId: string): void;
    bringToFront(shapeId: string): void;
    canRedo(): boolean;
    canUndo(): boolean;
    clearImage(): void;
    clearSelection(resetCrop?: boolean): void;
    cloneShape(shapeId: string): boolean;
    crop(): boolean;
    deleteRedact(id: string): void;
    deleteShape(id: string): void;
    destroy(): void;
    discard(): void;
    drawArrow(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string, arrowStart?: Object, arrowEnd?: Object, isSelected?: boolean): boolean;
    drawEllipse(x?: number, y?: number, radiusX?: number, radiusY?: number, strokeWidth?: number, strokeColor?: string, fillColor?: string, degree?: number, isSelected?: boolean): boolean;
    drawFrame(frameType: Object, color?: string, gradientColor?: string, size?: number, inset?: number, offset?: number, borderRadius?: number, frameLineStyle?: Object, lineCount?: number): boolean;
    drawImage(data: string | Object, x?: number, y?: number, width?: number, height?: number, isAspectRatio?: boolean, degree?: number, opacity?: number, isSelected?: boolean): boolean;
    drawLine(startX?: number, startY?: number, endX?: number, endY?: number, strokeWidth?: number, strokeColor?: string, isSelected?: boolean): boolean;
    drawPath(pointColl: Object[], strokeWidth?: number, strokeColor?: string, isSelected?: boolean): boolean;
    drawRectangle(x?: number, y?: number, width?: number, height?: number, strokeWidth?: number, strokeColor?: string, fillColor?: string, degree?: number, isSelected?: boolean, borderRadius?: number): boolean;
    drawRedact(type?: Object, x?: number, y?: number, width?: number, height?: number, value?: number): boolean;
    drawText(x?: number, y?: number, text?: string, fontFamily?: string, fontSize?: number, bold?: boolean, italic?: boolean, color?: string, isSelected?: boolean, degree?: number, fillColor?: string, strokeColor?: string, strokeWidth?: number, transformCollection?: Object[], underline?: boolean, strikethrough?: boolean): boolean;
    enableShapeDrawing(shapeType: Object, isEnabled: boolean): void;
    enableTextEditing(): void;
    export(type?: string, fileName?: string, imageQuality?: number): void;
    finetuneImage(finetuneOption: Object, value: number): void;
    flip(direction: Object): void;
    freehandDraw(value: boolean): void;
    getImageData(includeAnnotations?: boolean): Object;
    getImageDimension(): Object;
    getImageFilter(filterOption: Object): string;
    getRedacts(): Object[];
    getShapeSetting(id: string): Object;
    getShapeSettings(): Object[];
    initialize(): void;
    open(data: string | Object, resetChanges?: boolean, imageSettings?: Object): void;
    pan(value: boolean, x?: number, y?: number): void;
    redo(): void;
    reset(): void;
    resize(width: number, height: number, isAspectRatio?: boolean): boolean;
    rotate(degree: number): boolean;
    select(type: string, startX?: number, startY?: number, width?: number, height?: number): void;
    selectRedact(id: string): boolean;
    selectShape(id: string): boolean;
    sendBackward(shapeId: string): void;
    sendToBack(shapeId: string): void;
    straightenImage(degree: number): boolean;
    triggerEditCompleteEvent(args: Object): void;
    undo(): void;
    update(): void;
    updateRedact(setting: Object, isSelected?: boolean): boolean;
    updateShape(setting: Object, isSelected?: boolean): boolean;
    zoom(zoomFactor: number, zoomPoint?: Object): void
};

export const ImageEditorPlugin = {
    name: 'ejs-imageeditor',
    install(Vue: any) {
        Vue.component(ImageEditorPlugin.name, ImageEditorComponent);

    }
}