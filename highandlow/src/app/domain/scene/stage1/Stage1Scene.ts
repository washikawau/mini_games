import { Input } from "@src/app/port/in/IGameEngine";
import { IStage1SceneDrawer } from "@src/app/port/out/IStage1SceneDrawer";
import { config } from "@src/common/config";
import { secToFrame } from "@src/common/util";
import { CardDeckW } from "../../model/CardDeckW";
import { Card, CardDeck, CompareResult } from "../../model/Cards";
import { IScene, TickResult } from "../IScene";

type RoProps = Readonly<Props>;
type Props = {
    frame: number,
    status: State,
};

type State =
    InitState |
    CardOpeningState |
    SelectingState |
    DrawnState |
    WonState |
    LostState |
    RemovedState;
type InitState = {
    tag: "Init",
};
type CardOpeningState = {
    tag: "CardOpening",
    opened: Card,
    remainingFrame: number,
    nextState: State,
};
type SelectingState = { tag: "Selecting", cardDeck: CardDeck, };
type DrawnState = { tag: "Drawn", cardDeck: CardDeck, remainingFrame: number };
type WonState = { tag: "Won", cardDeck: CardDeck, remainingFrame: number };
type LostState = { tag: "Lost", cardDeck: CardDeck, remainingFrame: number };
type RemovedState = { tag: "Removed", };

const defaultProps: RoProps = {
    frame: 0,
    status: { tag: "Init" },
};

export class Stage1Scene implements IScene<RoProps> {
    static create(drawer: IStage1SceneDrawer): Stage1Scene {
        return new this(drawer);
    }

    private constructor(drawer: IStage1SceneDrawer) {
        this._props = defaultProps;
        this.drawer = drawer;
    }

    private _props: RoProps;
    private readonly drawer: IStage1SceneDrawer;
    private readonly highLabelRange = new LabelRange(
        config.screen.width * 2.0 / 3.0,
        config.screen.height * 4 / 9,
        120,
        30,
    );
    private readonly lowLabelRange = new LabelRange(
        config.screen.width * 2.0 / 3.0,
        config.screen.height * 5 / 9,
        150,
        30,
    );

    get props(): RoProps {
        return this._props;
    }

    private updateProps(next: Partial<Props>) {
        const frame = this._props.frame + 1;
        this._props = {
            ...this._props,
            ...next,
            frame,
        };
    }

    onAdded(): void {
        this._props = defaultProps;
        this.drawer.onSceneAdded(
            this.highLabelRange,
            this.lowLabelRange,
        );
    }

    onRemoved(): void {
        this.drawer.onSceneRemoved();
        this._props = defaultProps;
    }

    onTick(input: Input): TickResult {
        const curr = this.props;
        const [next, result] = this.doTick(curr, input);
        this.updateProps(next);
        this.doDraw(curr, this.props);
        return result;
    }

    private doTick(curr: RoProps, input: Input): [Partial<RoProps>, TickResult] {
        switch (curr.status.tag) {
            case "Init": {
                const status = this.doTickForInit();
                return [{ status }, {}];
            }
            case "CardOpening":
                if (curr.status.remainingFrame > 0) {
                    const status = decrementRemainingFrame(curr.status);
                    return [{ status }, {}];
                } else {
                    const status = curr.status.nextState;
                    return [{ status }, {}];
                }
            case "Selecting":
                return this.doTickForSelecting(curr.status, input);
            case "Drawn":
            case "Won":
            case "Lost":
                if (curr.status.remainingFrame > 0) {
                    const status = decrementRemainingFrame(curr.status);
                    return [{ status }, {}];
                } else {
                    const status = toSelectingState(curr.status);
                    return [{ status }, {}];
                }
            case "Removed":
                return [{}, {}];
            default:
                throw new Error("Not implemented");
        }
    }

    doTickForInit(): CardOpeningState {
        const [cardDeckW, opened] = CardDeckW.create().shuffleRemains().openNext();
        return createCardOpeningState(
            opened.ok!.v,
            {
                tag: "Selecting",
                cardDeck: cardDeckW.v,
            }
        );
    }

    private doTickForSelecting(curr: SelectingState, input: Input): [Partial<RoProps>, TickResult] {
        if (!!input.touchstart) {
            const pos = input.touchstart.pos;
            const status = this.highLabelRange.isHit(pos) ? this.openNext(curr, 1)
                : this.lowLabelRange.isHit(pos) ? this.openNext(curr, -1)
                    : curr;
            return [{ status }, {}];
        }
        return [{ status: curr }, {}];
    }

    private openNext(curr: SelectingState, expect: CompareResult): CardOpeningState | DrawnState | WonState | LostState {
        const currDeck = CardDeckW.wrap(curr.cardDeck);
        const currCard = currDeck.lastOpened;
        const [nextDeck, nextCard] = currDeck.openNext();
        const compareResult = nextCard.ok!.compare(currCard.ok!);
        if (compareResult === 0) {
            return createCardOpeningState(
                nextCard.ok!.v,
                {
                    tag: "Drawn",
                    cardDeck: nextDeck.v,
                    remainingFrame: secToFrame(1),
                }
            );
        } else if (compareResult === expect) {
            return createCardOpeningState(
                nextCard.ok!.v,
                {
                    tag: "Won",
                    cardDeck: nextDeck.v,
                    remainingFrame: secToFrame(1),
                }
            );
        } else {
            return createCardOpeningState(
                nextCard.ok!.v,
                {
                    tag: "Lost",
                    cardDeck: nextDeck.v,
                    remainingFrame: secToFrame(1),
                }
            );
        }
    }

    private doDraw(curr: RoProps, next: RoProps) {
        const nextStatusTag = next.status.tag;
        switch (nextStatusTag) {
            case "CardOpening":
                if (curr.status.tag !== nextStatusTag) {
                    this.drawer.onCardOpened(
                        next.status.opened,
                        next.status.remainingFrame
                    );
                }
                return;
            case "Selecting":
                if (curr.status.tag !== nextStatusTag) {
                    this.drawer.onSelectionStarted();
                }
                return;
            case "Drawn":
                if (curr.status.tag !== nextStatusTag) {
                    this.drawer.onDrawn(next.status.remainingFrame);
                }
                return;
            case "Won":
                if (curr.status.tag !== nextStatusTag) {
                    this.drawer.onWon(next.status.remainingFrame);
                }
                return;
            case "Lost":
                if (curr.status.tag !== nextStatusTag) {
                    this.drawer.onLost(next.status.remainingFrame);
                }
                return;
        }
    }
}

function createCardOpeningState(
    opened: Card,
    nextState: SelectingState | DrawnState | WonState | LostState
): CardOpeningState {
    return {
        tag: "CardOpening",
        opened,
        remainingFrame: secToFrame(1),
        nextState,
    };
}

function toSelectingState<T extends DrawnState | WonState | LostState>(status: T): SelectingState {
    return {
        ...status,
        tag: "Selecting",
    };
}

function decrementRemainingFrame<T extends CardOpeningState | DrawnState | WonState | LostState>(status: T): T {
    return {
        ...status,
        remainingFrame: status.remainingFrame - 1,
    };
}

class LabelRange {
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,

    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    isHit(pos: { x: number, y: number }): boolean {
        const { x, y } = pos;
        return this.x <= x && x <= this.x + this.width &&
            this.y <= y && y <= this.y + this.height;
    }
}
