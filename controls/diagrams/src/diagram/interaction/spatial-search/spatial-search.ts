import { Rect } from '../../primitives/rect';
import { Quad } from './quad';

/**
 * Spatial search module helps to effectively find the objects over diagram
 */
export class SpatialSearch {
    private topElement: IGroupable;
    private bottomElement: IGroupable;
    private rightElement: IGroupable;
    private leftElement: IGroupable;
    private quadSize: number = 500;
    private quadTable: Object;
    private objectTable: Object;
    /** @private */
    public parentQuad: Quad;
    private pageLeft: number;
    private pageRight: number;
    private pageTop: number;
    private pageBottom: number;
    /** @private */
    public childLeft: number;
    /** @private */
    public childTop: number;
    /** @private */
    public childRight: number;
    /** @private */
    public childBottom: number;
    /** @private */
    public childNode: IGroupable;
    /**
     *  Constructor for creating the spatial search
     *
     * @param {number} objectTable The objectTable.
     * @private
     */
    constructor(objectTable: Object) {
        this.objectTable = objectTable;
        this.parentQuad = new Quad(0, 0, this.quadSize * 2, this.quadSize * 2, this);
        this.pageLeft = Number.MAX_VALUE;
        this.pageRight = -Number.MAX_VALUE;
        this.pageTop = Number.MAX_VALUE;
        this.pageBottom = -Number.MAX_VALUE;
        this.quadTable = {};
    }
    /**
     * removeFromAQuad method\
     *
     * @returns {void}    removeFromAQuad method .\
     * @param {IGroupable} node - provide the options value.
     * @private
     */
    public removeFromAQuad(node: IGroupable): void {
        if (this.quadTable[node.id]) {
            const quad: Quad = this.quadTable[node.id];
            const index: number = this.objectIndex(quad.objects, node);
            if (index !== -1) {
                quad.objects.splice(index, 1);
                this.update(quad);
                delete this.quadTable[node.id];
            }
        }
    }

    private update(quad: Quad): void {
        if (quad.parent && quad.objects.length === 0 && quad.first && quad.second && quad.third && quad.fourth) {
            const parent: Quad = quad.parent;
            if (parent.first === quad) {
                parent.first = null;
            } else if (parent.second === quad) {
                parent.second = null;
            } else if (parent.third === quad) {
                parent.third = null;
            } else if (parent.fourth === quad) {
                parent.fourth = null;
            }
            this.update(quad.parent);
        } else {
            if (quad === this.parentQuad && !quad.first && !quad.second && !quad.third && !quad.fourth) {
                quad.left = 0;
                quad.width = 1000;
                quad.top = 0;
                quad.height = 1000;
            }
            return;
        }
    }

    private addIntoAQuad(node: IGroupable): void {
        const quad: Quad = this.parentQuad.addIntoAQuad(node);
        this.quadTable[node.id] = quad;
    }


    private objectIndex(objects: IGroupable[], node: IGroupable): number {
        for (let i: number = 0; i < objects.length; i++) {
            if ((objects[i]).id === node.id) {
                return i;
            }
        }
        return -1;
    }


    public updateQuad(node: IGroupable): boolean {
        this.setCurrentNode(node);
        const nodBounds: Rect = node.outerBounds;
        if (!(!isNaN(nodBounds.x) && !isNaN(nodBounds.y) &&
            !isNaN(nodBounds.width) && !isNaN(nodBounds.height))) {
            return false;
        }
        //nodBounds = new Rect(nodBounds.X.Valid(), nodBounds.Y.Valid(), nodBounds.Width.Valid(), nodBounds.Height.Valid());
        if (this.quadTable[node.id]) {
            const quad: Quad = this.quadTable[node.id];
            if (!quad.isContained()) {
                this.removeFromAQuad(node);
                this.addIntoAQuad(node);
            }

        } else {
            this.addIntoAQuad(node);
        }

        if (this.isWithinPageBounds(nodBounds) &&
            this.leftElement !== node &&
            this.topElement !== node &&
            this.rightElement !== node &&
            this.bottomElement !== node) {
            //contained - no change
        } else {
            let modified: boolean = false;
            if (this.pageLeft !== this.childLeft || node !== this.leftElement) {
                if (this.pageLeft >= this.childLeft) {
                    this.pageLeft = this.childLeft;
                    this.leftElement = node;
                    modified = true;
                } else if (node === this.leftElement) {
                    this.pageLeft = Number.MAX_VALUE;
                    this.findLeft(this.parentQuad);
                    modified = true;
                }
            }

            if (this.pageTop !== this.childTop || node !== this.topElement) {
                if (this.pageTop >= this.childTop) {
                    this.pageTop = this.childTop;
                    this.topElement = node;
                    modified = true;
                } else if (node === this.topElement) {
                    this.pageTop = Number.MAX_VALUE;
                    this.findTop(this.parentQuad);
                    modified = true;
                }
            }

            if (this.pageBottom !== this.childBottom || node !== this.bottomElement) {
                if (this.pageBottom <= this.childBottom) {
                    modified = true;
                    this.pageBottom = this.childBottom;
                    this.bottomElement = node;
                } else if (node === this.bottomElement) {
                    this.pageBottom = -Number.MAX_VALUE;
                    this.findBottom(this.parentQuad);
                    modified = true;
                }
            }

            if (this.pageRight !== this.childRight || node !== this.rightElement) {
                if (this.pageRight <= this.childRight) {
                    this.pageRight = this.childRight;
                    this.rightElement = node;
                    modified = true;
                } else if (node === this.rightElement) {
                    this.pageRight = -Number.MAX_VALUE;
                    this.findRight(this.parentQuad);
                    modified = true;
                }
            }
            return modified;
        }
        this.setCurrentNode(null);
        return false;
    }

    private isWithinPageBounds(node: Rect): boolean {
        if (node.left >= this.pageLeft && node.right <= this.pageRight && node.top >= this.pageTop
            && node.bottom <= this.pageBottom) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * findQuads method\
     *
     * @returns {  Quad[] }    findQuads method .\
     * @param {Rect} region - provide the options value.
     * @private
     */
    public findQuads(region: Rect): Quad[] {
        const quads: Quad[] = [];
        this.parentQuad.findQuads(region, quads);
        return quads;
    }
    /**
     * findObjects method\
     *
     * @returns {  IGroupable[] }    findObjects method .\
     * @param {Rect} region - provide the options value.
     * @private
     */
    public findObjects(region: Rect): IGroupable[] {
        const quads: Quad[] = this.findQuads(region);
        const objects: IGroupable[] = [];
        for (const quad of quads) {
            for (const obj of quad.objects) {
                if (obj.outerBounds.intersects(region)) {
                    objects.push(this.objectTable[obj.id]);
                }
            }
        }
        return objects;
    }
    /**
     * updateBounds method\
     *
     * @returns { boolean }    updateBounds method .\
     * @param {IGroupable} node - provide the options value.
     * @private
     */
    public updateBounds(node: IGroupable): boolean {
        let modified: boolean = false;
        if (node === this.topElement) {
            this.pageTop = Number.MAX_VALUE;
            this.topElement = null;
            this.findTop(this.parentQuad);
            modified = true;
        }
        if (node === this.leftElement) {
            this.pageLeft = Number.MAX_VALUE;
            this.leftElement = null;
            this.findLeft(this.parentQuad);
            modified = true;
        }
        if (node === this.rightElement) {
            this.pageRight = -Number.MAX_VALUE;
            this.rightElement = null;
            this.findRight(this.parentQuad);
            modified = true;
        }
        if (node === this.bottomElement) {
            this.pageBottom = -Number.MAX_VALUE;
            this.bottomElement = null;
            this.findBottom(this.parentQuad);
            modified = true;
        }
        return modified;
    }

    private findBottom(quad: Quad): void {
        //if (quad.Quads.Count === 4)
        {
            if (quad.third || quad.fourth) {
                if (quad.third) {
                    this.findBottom(quad.third);
                }
                if (quad.fourth) {
                    this.findBottom(quad.fourth);
                }
            } else {
                if (quad.second) {
                    this.findBottom(quad.second);

                }
                if (quad.first) {
                    this.findBottom(quad.first);
                }
            }
        }
        for (const node of quad.objects) {
            if (this.pageBottom <= node.outerBounds.bottom) {
                this.pageBottom = node.outerBounds.bottom;
                this.bottomElement = node;
            }
        }

    }

    private findRight(quad: Quad): void {

        //if (quad.Quads.Count === 4)
        {
            if (quad.second || quad.fourth) {
                if (quad.second) {
                    this.findRight(quad.second);

                }
                if (quad.fourth) {
                    this.findRight(quad.fourth);
                }
            } else {
                if (quad.first) {
                    this.findRight(quad.first);

                }
                if (quad.third) {
                    this.findRight(quad.third);
                }
            }
        }

        for (const node of quad.objects) {
            if (this.pageRight <= node.outerBounds.right) {
                this.pageRight = node.outerBounds.right;
                this.rightElement = node;
            }
        }
    }

    private findLeft(quad: Quad): void {
        //if (quad.Quads.Count === 4)
        {
            if (quad.first || quad.third) {
                if (quad.first) {
                    this.findLeft(quad.first);
                }
                if (quad.third) {
                    this.findLeft(quad.third);
                }
            } else {
                if (quad.second) {
                    this.findLeft(quad.second);
                }
                if (quad.fourth) {
                    this.findLeft(quad.fourth);
                }
            }
        }
        for (const node of quad.objects) {
            if (this.pageLeft >= node.outerBounds.left) {
                this.pageLeft = node.outerBounds.left;
                this.leftElement = node;
            }
        }
    }

    private findTop(quad: Quad): void {
        //if (quad.Quads.Count === 4)
        {
            if (quad.first || quad.second) {
                if (quad.first) {
                    this.findTop(quad.first);
                }
                if (quad.second) {
                    this.findTop(quad.second);
                }
            } else {
                if (quad.third) {
                    this.findTop(quad.third);
                }
                if (quad.fourth) {
                    this.findTop(quad.fourth);
                }
            }
        }
        for (const node of quad.objects) {
            if (this.pageTop >= node.outerBounds.top) {
                this.pageTop = node.outerBounds.top;
                this.topElement = node;
            }
        }
    }

    /**
     * setCurrentNode method\
     *
     * @returns { void }    setCurrentNode method .\
     * @param {IGroupable} node - provide the options value.
     * @private
     */
    public setCurrentNode(node: IGroupable): void {
        this.childNode = node;
        if (node) {
            const r: Rect = node.outerBounds;
            this.childLeft = Number(r.left);
            this.childTop = Number(r.top);
            this.childRight = Number(r.right);
            this.childBottom = Number(r.bottom);
        } else {
            this.childLeft = Number.MAX_VALUE;
            this.childTop = Number.MAX_VALUE;
            this.childRight = -Number.MAX_VALUE;
            this.childBottom = -Number.MAX_VALUE;
        }
    }
    /**
     * getPageBounds method\
     *
     * @returns { Rect }    getPageBounds method .\
     * @param {number} originX - provide the options value.
     * @param {number} originY - provide the options value.
     * @private
     */
    public getPageBounds(originX?: number, originY?: number): Rect {
        if (this.pageLeft === Number.MAX_VALUE) { return new Rect(0, 0, 0, 0); }
        const left: number = originX !== undefined ? Math.min(this.pageLeft, 0) : this.pageLeft;
        const top: number = originY !== undefined ? Math.min(this.pageTop, 0) : this.pageTop;
        return new Rect(
            Math.round(left), Math.round(top), Math.round(this.pageRight - left), Math.round(this.pageBottom - top));
    }
    /**
     * getQuad method\
     *
     * @returns { Quad }    getQuad method .\
     * @param {IGroupable} node - provide the options value.
     * @private
     */
    public getQuad(node: IGroupable): Quad {
        return this.quadTable[node.id];
    }
}
/** @private */
export interface IGroupable {
    id: string;
    outerBounds: Rect;
}
