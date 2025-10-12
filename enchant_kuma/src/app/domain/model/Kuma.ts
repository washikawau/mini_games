import { None, TouchStart } from "@src/app/port/in/IGameEngine";
import { config } from "@src/common/config";
import { randfloat, secToFrame } from "@src/common/util";

export type Kuma = {
    id: number,
    size: XY,
    scale: XY,
    angleDeg: number,
    pos: XY,
    velocity: XY,
    frame: number,
};

export type RemovedKuma = {
    id: number,
    pos: XY,
    point: number,
};

export type XY = {
    x: number,
    y: number,
};

const defaultProps: Kuma = {
    id: 0,
    size: { x: 32, y: 32 },
    scale: { x: 1, y: 1 },
    angleDeg: 0,
    pos: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    frame: 0,
};

export class KumaOp {
    static create(id: number): KumaOp {
        return KumaOp.clone({
            ...defaultProps,
            id
        });
    }

    static clone(props: Kuma): KumaOp {
        return KumaOp.wrap(structuredClone(props));
    }

    static wrap(props: Kuma): KumaOp {
        return new KumaOp(props);
    }

    private constructor(props: Kuma) {
        this.props = props;
    }

    readonly props: Kuma;

    speed(vx: number, vy: number): KumaOp {
        const props = this.props;
        props.velocity.x = vx;
        props.velocity.y = vy;
        props.angleDeg = Math.atan2(vy, vx) * 180 / Math.PI;
        return this;
    }

    isTouched(touchedPos: XY): boolean {
        const { x: tx, y: ty } = touchedPos;
        const { x: left, y: top } = this.props.pos;
        return left <= tx &&
            tx <= left + this.props.size.x &&
            top <= ty &&
            ty <= top + this.props.size.y;
    }

    walk(): KumaOp {
        const { x, y } = this.props.velocity;
        return this.walkBy(x, y);
    }

    walkBy(dx: number, dy: number): KumaOp {
        return this
            .incrFrame()
            .moveBy(dx, dy);
    }

    private incrFrame(): KumaOp {
        const props = this.props;
        props.frame += 1;
        return this;
    }

    moveBy(dx: number, dy: number): KumaOp {
        return this.moveTo(
            this.props.pos.x + dx,
            this.props.pos.y + dy
        );
    }

    moveTo(x: number, y: number): KumaOp {
        const props = this.props;
        props.pos.x = this.normalizePos(x, config.WIDTH);
        props.pos.y = this.normalizePos(y, config.HEIGHT);
        return this;
    }

    private normalizePos(pos: number, len: number): number {
        let newPos = pos % len;
        if (newPos < 0) {
            newPos + len;
        }
        if (newPos > len) {
            newPos = 0;
        }
        return newPos;
    }

    scale(scaleX: number, scaleY: number): KumaOp {
        const props = this.props;
        props.scale.x = scaleX;
        props.scale.y = scaleY;
        return this;
    }

    rotate(angleDeg: number): KumaOp {
        const props = this.props;
        props.angleDeg = angleDeg;
        return this;
    }
}

export class KumasOp {
    static wrap(kumas: Kuma[]): KumasOp {
        return new KumasOp(kumas);
    }

    constructor(kumas: Kuma[]) {
        this._kumas = kumas;
    }

    private _kumas: Kuma[];

    get kumas(): Kuma[] {
        return structuredClone(this._kumas);
    }

    removeIfTouched(
        touchstart: TouchStart | None,
        f: (removeds: RemovedKuma[]) => void
    ): KumasOp {
        if (touchstart.tag === "None") {
            return this;
        }
        const touchedPos = touchstart.pos;
        const arr = [];
        const toucheds = [];
        for (const kuma of this._kumas) {
            if (KumaOp.wrap(kuma).isTouched(touchedPos)) {
                toucheds.push({ ...kuma, point: 100 });
            } else {
                arr.push(kuma);
            }
        }
        if (toucheds.length === 0) {
            return this;
        }
        this._kumas = arr;
        f(toucheds);
        return this;
    }

    move(f: (kumas: Kuma[]) => void): KumasOp {
        const moveds = this._kumas
            .map(x => KumaOp.wrap(x).walk().props);
        f(moveds);
        this._kumas = moveds;
        return this;
    }

    popupIfTime(frame: number, f: (kuma: Kuma) => void): KumasOp {
        if (frame % secToFrame(1) === 0) {
            const kuma = KumaOp
                .create(frame)
                .moveTo(this.randomX, this.randomY)
                .speed(this.randomVX, this.randomVY)
                .props;
            f(kuma);
            this._kumas.push(kuma);
        }
        return this;
    }

    private get randomX(): number {
        return randfloat(0, 300);
    }

    private get randomY(): number {
        return randfloat(0, 300);
    }

    private get randomVX(): number {
        return randfloat(-4, 4) / 2;
    }

    private get randomVY(): number {
        return randfloat(-4, 4) / 2;
    }
}
