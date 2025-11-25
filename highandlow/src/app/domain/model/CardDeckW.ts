import { ResultOf } from "@src/common/ResultOf";
import { CardDeck, CardId, allCardIds } from "./Cards";
import { CardW } from "./CardW";

export class CardDeckW {
    static create(): CardDeckW {
        const v = {
            cardIds: allCardIds,
            nextIndex: 0,
        };
        return this.wrap(v);
    }

    static wrap(v: CardDeck): CardDeckW {
        return new this(v);
    }

    private constructor(v: CardDeck) {
        this.v = v;
    }

    readonly v: CardDeck;

    get isOutOfCards(): boolean {
        const { cardIds, nextIndex } = this.v;
        return cardIds.length <= nextIndex;
    }

    get openeds(): CardId[] {
        let { cardIds, nextIndex } = this.v;
        return cardIds.slice(0, nextIndex);
    }

    get remains(): CardId[] {
        let { cardIds, nextIndex } = this.v;
        return cardIds.slice(nextIndex);
    }

    get lastOpened(): ResultOf<CardW> {
        let { cardIds, nextIndex } = this.v;
        const currIndex = nextIndex - 1;
        if (currIndex < 0) {
            return ResultOf.err(new Error("no card opened yet."));
        }
        return ResultOf.ok(CardW.create(cardIds[currIndex]));
    }

    openNext(): [CardDeckW, ResultOf<CardW>] {
        if (this.isOutOfCards) {
            return [
                this,
                ResultOf.err(new Error("out of cards.")),
            ];
        }
        const { cardIds, nextIndex } = this.v;
        const after = CardDeckW.wrap({
            cardIds,
            nextIndex: nextIndex + 1,
        });
        return [
            after,
            ResultOf.ok(CardW.create(cardIds[nextIndex])),
        ];
    }

    shuffleRemains(): CardDeckW {
        const { nextIndex } = this.v;
        const openeds = this.openeds;
        const remains = this.remains;
        remains.sort((a, b) => 0.5 - Math.random());
        return CardDeckW.wrap({
            cardIds: openeds.concat(remains),
            nextIndex,
        });
    }
}
