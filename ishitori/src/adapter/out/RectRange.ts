
export type Pos = {
    x: number,
    y: number,
};

export class RectRange {
    static fromLeftTopAndSize(
        left: number,
        top: number,
        width: number,
        height: number,
    ): RectRange {
        return new RectRange(
            width >= 0 ? left : left + width,
            height >= 0 ? top : top + height,
            Math.abs(width),
            Math.abs(height),
        );
    }

    private constructor(
        left: number,
        top: number,
        width: number,
        height: number,

    ) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    get right(): number { return this.left + this.width; }
    get bottom(): number { return this.top + this.height; }

    contains(pos: Pos): boolean {
        const { x, y } = pos;
        return this.left <= x &&
            x <= this.right &&
            this.top <= y &&
            y <= this.bottom;
    }
}
