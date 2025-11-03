import { CardDeckW } from './CardDeckW';
import { allCardIds, allCards, Card, CardDeck, CardId } from './Cards';

test.each([
    [
        {
            cardIds: allCardIds,
            nextIndex: 0,
        },
    ],
] as [CardDeck][])('.create(): [ | %s]', (expected) => {
    // arrange
    // act
    const a = CardDeckW.create().v;
    // assert
    expect(a).toEqual(expected);
});

test.each([
    [[0], 0, undefined],
    [[0], 1, allCards[0]],
    [[2, 1, 0], 0, undefined],
    [[2, 1, 0], 1, allCards[2]],
    [[2, 1, 0], 2, allCards[1]],
    [[2, 1, 0], 3, allCards[0]],
] as [CardId[], number, Card | undefined][])('.lastOpened(): [%s, %s | %s]', (cardIds, nextIndex, eOk) => {
    // arrange
    let sut = CardDeckW.wrap({
        cardIds,
        nextIndex,
    });
    // act
    const { ok, err } = sut.lastOpened;
    // assert
    if (!!eOk) {
        expect(ok?.v).toEqual(eOk);
        expect(err).toBe(undefined);
    } else {
        expect(ok).toBe(undefined);
        expect(err?.message).toBe("no card opened yet.");
    }
});

test.each([
    [[0], 0, 1, allCards[0]],
    [[0], 1, 1, undefined],
    [[2, 1, 0], 0, 1, allCards[2]],
    [[2, 1, 0], 1, 2, allCards[1]],
    [[2, 1, 0], 2, 3, allCards[0]],
    [[2, 1, 0], 3, 3, undefined],
] as [CardId[], number, number, Card | undefined][])('.openNext(): [%s, %s | %s, %s]', (cardIds, nextIndex, eNextIndex, eOk) => {
    // arrange
    let sut = CardDeckW.wrap({
        cardIds,
        nextIndex,
    });
    // act
    const [after, { ok, err }] = sut.openNext();
    // assert
    const eAfter = {
        cardIds,
        nextIndex: eNextIndex,
    };
    expect(after.v).toEqual(eAfter);
    if (!!eOk) {
        expect(ok?.v).toEqual(eOk);
        expect(err).toBe(undefined);
    } else {
        expect(ok).toBe(undefined);
        expect(err?.message).toBe("out of cards.");
    }
});

test.each([
    [[0], 1, [0]],
    [[0], 0, [0]],
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 9, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0, ['?', '?', '?', '?', '?', '?', '?', '?', '?', '?']],
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2, [0, 1, '?', '?', '?', '?', '?', '?', '?', '?']],
] as [CardId[], number, (CardId | '?')[]][])('.shuffleRemains(): [%s, %s | %s]', (cardIds, nextIndex, eCardIds) => {
    // arrange
    let sut = CardDeckW.wrap({
        cardIds,
        nextIndex,
    });
    // act
    const { v: { cardIds: aCardIds, nextIndex: aNextIndex } } = sut.shuffleRemains();
    // assert
    expect(aNextIndex).toEqual(nextIndex);
    const ePre = eCardIds.filter(x => x !== '?');
    expect(aCardIds.slice(0, ePre.length)).toEqual(ePre);
    if (ePre.length < cardIds.length) {
        const beforePost = cardIds.slice(ePre.length);
        const aPost = aCardIds.slice(ePre.length)
        expect(beforePost).not.toEqual(aPost);
    }
});
