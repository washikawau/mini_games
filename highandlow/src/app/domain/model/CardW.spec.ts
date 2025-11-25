import { allCardIds, allRanks, allSuits, Card, CardId, CompareResult } from './Cards';
import { CardW } from './CardW';

test.each([
    ...allCardIds.map(x => [
        x,
        {
            suit: allSuits[Math.floor(Number(x) / allRanks.length)],
            rank: allRanks[Number(x) % allRanks.length],
        },
    ])
] as [CardId, Card][])('.create(): [%s | %s]', (cardId, expected) => {
    // arrange
    // act
    const a = CardW.create(cardId).v;
    // assert
    expect(a).toEqual(expected);
});

test.each([
    ...params_compare()
])('.compare(): [%s, %s | %s]', (left, right, expected) => {
    // arrange
    // act
    const a = left.compare(right);
    // assert
    expect(a).toEqual(expected);
});
function* params_compare(): Generator<[CardW, CardW, CompareResult]> {
    const numRank = allRanks.length;
    for (const leftId of allCardIds) {
        for (const rightId of allCardIds) {
            const leftOffset = leftId % numRank;
            const rightOffset = rightId % numRank;
            const expected = leftOffset < rightOffset ? -1
                : rightOffset < leftOffset ? 1
                    : 0;
            yield [
                CardW.create(leftId),
                CardW.create(rightId),
                expected,
            ];
        }
    }
}
