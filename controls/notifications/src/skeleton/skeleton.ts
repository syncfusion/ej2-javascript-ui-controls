import { Component, getUniqueID, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges, Property, attributes, removeClass, addClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SkeletonModel } from './skeleton-model';

const cssClassName: { [key: string]: string } = {
    TEXTSHAPE: 'e-skeleton-text',
    CIRCLESHAPE: 'e-skeleton-circle',
    SQUARESHAPE: 'e-skeleton-square',
    RECTANGLESHAPE: 'e-skeleton-rectangle',
    WAVEEFFECT: 'e-shimmer-wave',
    PULSEEFFECT: 'e-shimmer-pulse',
    FADEEFFECT: 'e-shimmer-fade',
    VISIBLENONE: 'e-visible-none'
};

/**
 * Defines the shape of Skeleton.
 */
export enum SkeletonType {
    /**
     * Defines the skeleton shape as text.
     */
    Text = 'Text',
    /**
     * Defines the skeleton shape as circle.
     */
    Circle = 'Circle',
    /**
     * Defines the skeleton shape as square.
     */
    Square = 'Square',
    /**
     * Defines the skeleton shape as rectangle.
     */
    Rectangle = 'Rectangle'
}
/**
 * Defines the animation effect of Skeleton.
 */
export enum ShimmerEffect {
    /**
     * Defines the animation as shimmer wave effect.
     */
    Wave = 'Wave',
    /**
     * Defines the animation as fade effect.
     */
    Fade = 'Fade',
    /**
     * Defines the animation as pulse effect.
     */
    Pulse = 'Pulse',
    /**
     * Defines the animation as no effect.
     */
    None = 'None'
}
/**
 * The Shimmer is a placeholder that animates a shimmer effect to let users know that the page’s content is loading at the moment.
 * In other terms, it simulates the layout of page content while loading the actual content.
 * ```html
 * <div id="skeletonCircle"></div>
 * ```
 * ```typescript
 * <script>
 * var skeletonObj = new Skeleton({ shape: 'Circle', width: "2rem" });
 * skeletonObj.appendTo("#skeletonCircle");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Skeleton extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Constructor for creating Skeleton component.
     *
     * @param {SkeletonModel} options - Defines the model of Skeleton class.
     * @param {HTMLElement} element - Defines the target HTML element.
     */
    constructor(options?: SkeletonModel, element?: HTMLElement) {
        super(options, element);
    }

    /**
     * Defines the width of the Skeleton.
     * Width will be prioritized and used as dimension when shape is "Circle" and "Square".
     *
     * @default ""
     * @aspType string
     */
    @Property('')
    public width: string | number;

    /**
     * Defines the height of the Skeleton.
     * Height is not required when shape is "Circle" and "Square".
     *
     * @default ""
     * @aspType string
     */
    @Property('')
    public height: string | number;

    /**
     * Defines the visibility state of Skeleton.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines the shape of the Skeleton.
     * {% codeBlock src='skeleton/shape/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default SkeletonType.Text
     * @asptype SkeletonType
     */
    @Property('Text')
    public shape: string | SkeletonType;

    /**
     * Defines the animation effect of the Skeleton.
     * {% codeBlock src='skeleton/shimmerEffect/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default ShimmerEffect.Wave
     * @asptype ShimmerEffect
     */
    @Property('Wave')
    public shimmerEffect: string | ShimmerEffect;

    /**
     * Defines the 'aria-label' for Skeleton accessibility.
     *
     * @default "Loading..."
     */
    @Property('Loading...')
    public label: string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of Skeleton.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Get component module name.
     *
     * @returns {string} - Module name
     * @private
     */
    protected getModuleName(): string {
        return 'skeleton';
    }

    public getPersistData(): string {
        return this.addOnPersist([]);
    }

    protected preRender(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }

        this.updateCssClass();
        attributes(this.element, { role: 'alert', 'aria-busy': 'true', 'aria-live': 'polite', 'aria-label': this.label });
    }

    /**
     * Method for initialize the component rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.initialize();
    }

    public onPropertyChanged(newProp: SkeletonModel, oldProp: SkeletonModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
            case 'height':
                this.updateDimension();
                break;
            case 'shape':
                this.updateShape();
                break;
            case 'shimmerEffect':
                this.updateEffect();
                break;
            case 'visible':
                this.updateVisibility();
                break;
            case 'label':
                this.element.setAttribute('aria-label', this.label);
                break;
            case 'cssClass':
                if (oldProp.cssClass) { removeClass([this.element], oldProp.cssClass.split(' ')); }
                this.updateCssClass();
                break;
            }
        }
    }

    /**
     * Method to destroys the Skeleton component.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        const attrs: string[] = ['role', 'aria-live', 'aria-busy', 'aria-label'];
        let cssClass: string[] = [];

        if (this.cssClass) { cssClass = cssClass.concat(this.cssClass.split(' ')); }

        for (let i: number = 0; i < attrs.length; i++) {
            this.element.removeAttribute(attrs[parseInt(i.toString(), 10)]);
        }

        cssClass = cssClass.concat(this.element.classList.value.match(/(e-skeleton-[^\s]+)/g) || []);
        cssClass = cssClass.concat(this.element.classList.value.match(/(e-shimmer-[^\s]+)/g) || []);

        removeClass([this.element], cssClass);
    }

    private initialize(): void {
        this.updateShape();
        this.updateEffect();
        this.updateVisibility();
    }

    private updateShape(): void {
        if (!(isNullOrUndefined(this.shape))) {
            const shapeCss: string = cssClassName[this.shape.toUpperCase() + 'SHAPE'];
            const removeCss: string[] = (this.element.classList.value.match(/(e-skeleton-[^\s]+)/g) || []);
            this.updateDimension();
            if (removeCss) { removeClass([this.element], removeCss); }
            addClass([this.element], [shapeCss]);
        }
    }

    private updateDimension(): void {
        const width: string = (!this.width && (['Text', 'Rectangle'].indexOf(this.shape) > -1)) ? '100%' : formatUnit(this.width);
        const height: string = ['Circle', 'Square'].indexOf(this.shape) > -1 ? width : formatUnit(this.height);

        this.element.style.width = width;
        this.element.style.height = height;
    }

    private updateEffect(): void {
        const removeCss: string[] = (this.element.classList.value.match(/(e-shimmer-[^\s]+)/g) || []);
        if (removeCss) { removeClass([this.element], removeCss); }
        if (!(isNullOrUndefined(this.shimmerEffect))) {
            addClass([this.element], [cssClassName[this.shimmerEffect.toUpperCase() + 'EFFECT']]);
        }
    }

    private updateVisibility(): void {
        this.element.classList[this.visible ? 'remove' : 'add'](cssClassName.VISIBLENONE);
    }

    private updateCssClass(): void {
        if (this.cssClass) { addClass([this.element], this.cssClass.split(' ')); }
    }

}
