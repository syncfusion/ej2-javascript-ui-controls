// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../button/button-model.d.ts'/>
import { getUniqueID, INotifyPropertyChanged, NotifyPropertyChanges, Property, EventHandler } from '@syncfusion/ej2-base';
import { select } from '@syncfusion/ej2-base';
import { Button } from '../button/button';
import { FabModel } from './floating-action-button-model';

const FABHIDDEN: string = 'e-fab-hidden';
const FIXEDFAB: string = 'e-fab-fixed';
const FABVERTDIST: string = '--fabVertDist';
const FABHORZDIST: string = '--fabHorzDist';
const FABTOP: string = 'e-fab-top';
const FABBOTTOM: string = 'e-fab-bottom';
const FABRIGHT: string = 'e-fab-right';
const FABLEFT: string = 'e-fab-left';
const FABMIDDLE: string = 'e-fab-middle';
const FABCENTER: string = 'e-fab-center';

/**
 * Defines the position of FAB (Floating Action Button) in target.
 */
export enum FabPosition
{
    /**
     * Positions the FAB at the target's top left corner.
     */
    TopLeft,

    /**
     * Places the FAB on the top-center position of the target.
     */
    TopCenter,

    /**
     * PPositions the FAB at the target's top right corner.
     */
    TopRight,

    /**
     * Positions the FAB in the middle of target's left side.
     */
    MiddleLeft,

    /**
     * Positions the FAB in the center of target.
     */
    MiddleCenter,

    /**
     * Positions the FAB in the middle of target's right side.
     */
    MiddleRight,

    /**
     * Positions the FAB at the target's bottom left corner.
     */
    BottomLeft,

    /**
     * Places the FAB on the bottom-center position of the target.
     */
    BottomCenter,

    /**
     * Positions the FAB at the target's bottom right corner.
     */
    BottomRight
}

/**
 * The FAB Component (Floating Action Button) is an extension of Button Component that appears in front of all the contents of the page and performs the primary action.
 */
@NotifyPropertyChanges
export class Fab extends Button implements INotifyPropertyChanged {

    /**
     * Defines the position of the FAB relative to target.
     * The possible values are:
     * * TopLeft: Positions the FAB at the target's top left corner.
     * * TopCenter: Positions the FAB at the target's top left corner.
     * * TopRight: Positions the FAB at the target's top left corner.
     * * MiddleLeft: Positions the FAB at the target's top left corner.
     * * MiddleCenter: Positions the FAB at the target's top left corner.
     * * MiddleRight: Positions the FAB at the target's top left corner.
     * * BottomLeft: Positions the FAB at the target's top left corner.
     * * BottomCenter: Places the FAB on the bottom-center position of the target.
     * * BottomRight: Positions the FAB at the target's bottom right corner.
     *  To refresh the position of FAB on target resize, use refreshPosition method. 
     *  The position will be refreshed automatically when browser resized.
     *
     * @isenumeration true
     * @default FabPosition.BottomRight
     * @asptype FabPosition
     */
    @Property('BottomRight')
    public position: string | FabPosition;

    /**
     * Defines the selector that points to an element in which the FAB will be positioned. 
     * By default, FAB is positioned based on viewport of browser.
     * The target element must have relative position, else FAB will get positioned based on the closest element which has relative position.
     *
     * @default ''
     */
    @Property('')
    public target: string | HTMLElement;

    /**
     * Defines whether the fab is visible or hidden.
     *
     * @default true.
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines whether to apply primary style for FAB.
     *
     * @default true
     */
    @Property(true)
    public isPrimary: boolean;

    private isFixed: boolean;
    private targetEle: HTMLElement;

    /**
     * Constructor for creating the widget
     *
     * @param  {FabModel} options - Specifies the floating action button model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    constructor(options?: FabModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        super.render();
        this.initializeFab();
    }

    protected preRender(): void {
        super.preRender();
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    public getPersistData(): string {
        super.getPersistData();
        return this.addOnPersist([]);
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    public getModuleName(): string {
        return 'fab';
    }

    private initializeFab(): void {
        // To add 'e-btn' class
        this.element.classList.add('e-' + super.getModuleName());
        this.checkTarget();
        this.setPosition();
        this.setVisibility();
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
    }
    private checkTarget(): void {
        this.isFixed = true;
        if (this.target) {
            this.targetEle = (typeof this.target === 'string') ? select(this.target) : this.target;
            if (this.targetEle) {
                this.isFixed = false;
                this.targetEle.appendChild(this.element);
            }
        }
        this.isFixed ? this.element.classList.add(FIXEDFAB) : this.element.classList.remove(FIXEDFAB);
    }
    private setVisibility(): void {
        this.visible ? this.element.classList.remove(FABHIDDEN) : this.element.classList.add(FABHIDDEN);
    }
    private getPosition(): string {
        return (typeof(this.position) === "string")? this.position: FabPosition[this.position];
    }
    private setPosition(): void {
        this.setVerticalPosition();
        this.setHorizontalPosition();
    }
    private setVerticalPosition(): void {
        //Check for middle position and middle class and vertical distance atttribute.
        if (['MiddleLeft', 'MiddleRight', 'MiddleCenter'].indexOf(this.getPosition()) !== -1) {
            const yoffset: number = ((this.isFixed ? window.innerHeight : this.targetEle.clientHeight) - this.element.offsetHeight) / 2;
            this.element.style.setProperty(FABVERTDIST, yoffset + 'px');
            this.element.classList.add(FABMIDDLE);
        }
        //Check for bottom position and bottom class else add top class.
        (['BottomLeft', 'BottomCenter', 'BottomRight'].indexOf(this.getPosition()) !== -1) ? 
            this.element.classList.add(FABBOTTOM) : this.element.classList.add(FABTOP);
    }

    private setHorizontalPosition(): void {
        //Check for center position and center class and horizontal distance atttribute.
        if (['TopCenter', 'BottomCenter', 'MiddleCenter'].indexOf(this.getPosition()) !== -1) {
            const xoffset: number = ((this.isFixed ? window.innerWidth : this.targetEle.clientWidth) - this.element.offsetWidth) / 2;
            this.element.style.setProperty(FABHORZDIST, xoffset + 'px');
            this.element.classList.add(FABCENTER);
        }
        const isRight = ['TopRight', 'MiddleRight', 'BottomRight'].indexOf(this.getPosition()) !== -1;
        (!(this.enableRtl || isRight) || (this.enableRtl && isRight)) ? this.element.classList.add(FABLEFT) : this.element.classList.add(FABRIGHT);
    }

    private clearPosition(): void {
        this.element.style.removeProperty(FABVERTDIST);
        this.element.classList.remove(FABTOP, FABBOTTOM, FABMIDDLE);
        this.clearHorizontalPosition();
    }

    private clearHorizontalPosition(): void {
        this.element.style.removeProperty(FABHORZDIST);
        this.element.classList.remove(FABRIGHT, FABLEFT, FABCENTER);
    }

    /**
     * Refreshes the FAB position. You can call this method to re-position FAB when target is resized.
     */
    public refreshPosition(): void {
        this.resizeHandler();
    }
    private resizeHandler(): void {
        this.setPosition();
    }

    /**
     * Destroys the FAB instance.
     *
     */
    public destroy(): void {
        super.destroy();
        // To remove 'e-btn' class
        this.element.classList.remove('e-' + super.getModuleName());
        this.clearPosition();
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {FabModel} newProp - Specifies new properties
     * @param  {FabModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: FabModel, oldProp?: FabModel): void {
        super.onPropertyChanged(newProp, oldProp);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    this.clearHorizontalPosition();
                    this.setHorizontalPosition();
                    break;
                case 'visible':
                    this.setVisibility();
                    break;
                case 'position':
                    this.clearPosition();
                    this.setPosition();
                    break;
                case 'target':
                    this.checkTarget();
                    this.setPosition();
                    break;
            }
        }
    }
}
