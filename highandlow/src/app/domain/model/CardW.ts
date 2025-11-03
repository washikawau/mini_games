import { allCards, Card, CardId, CompareResult } from "./Cards";

export class CardW {
    static create(cardId: CardId): CardW {
        return this.wrap(allCards[cardId]);
    }

    static wrap(card: Card): CardW {
        return new this(card);
    }

    private constructor(card: Card) {
        this.v = card;
    }

    readonly v: Card;

    toString(): string {
        return JSON.stringify(this.v);
    }

    compare(other: CardW): CompareResult {
        return CardW.compareLR(this.v, other.v);
    }

    private static compareLR(left: Card, right: Card): CompareResult {
        const leftRank = left.rank;
        const rightRank = right.rank;
        if (leftRank < rightRank) {
            return -1;
        }
        if (rightRank < leftRank) {
            return 1;
        }
        return 0;
    }
}
