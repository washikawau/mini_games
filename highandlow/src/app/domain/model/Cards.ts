
export const allSuits = ['club', 'diamond', 'heart', 'spade'] as const;
export const allRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export const allCards = {
    0: { suit: 'club', rank: 1, } as const,
    1: { suit: 'club', rank: 2, } as const,
    2: { suit: 'club', rank: 3, } as const,
    3: { suit: 'club', rank: 4, } as const,
    4: { suit: 'club', rank: 5, } as const,
    5: { suit: 'club', rank: 6, } as const,
    6: { suit: 'club', rank: 7, } as const,
    7: { suit: 'club', rank: 8, } as const,
    8: { suit: 'club', rank: 9, } as const,
    9: { suit: 'club', rank: 10, } as const,
    10: { suit: 'club', rank: 11, } as const,
    11: { suit: 'club', rank: 12, } as const,
    12: { suit: 'club', rank: 13, } as const,
    13: { suit: 'diamond', rank: 1, } as const,
    14: { suit: 'diamond', rank: 2, } as const,
    15: { suit: 'diamond', rank: 3, } as const,
    16: { suit: 'diamond', rank: 4, } as const,
    17: { suit: 'diamond', rank: 5, } as const,
    18: { suit: 'diamond', rank: 6, } as const,
    19: { suit: 'diamond', rank: 7, } as const,
    20: { suit: 'diamond', rank: 8, } as const,
    21: { suit: 'diamond', rank: 9, } as const,
    22: { suit: 'diamond', rank: 10, } as const,
    23: { suit: 'diamond', rank: 11, } as const,
    24: { suit: 'diamond', rank: 12, } as const,
    25: { suit: 'diamond', rank: 13, } as const,
    26: { suit: 'heart', rank: 1, } as const,
    27: { suit: 'heart', rank: 2, } as const,
    28: { suit: 'heart', rank: 3, } as const,
    29: { suit: 'heart', rank: 4, } as const,
    30: { suit: 'heart', rank: 5, } as const,
    31: { suit: 'heart', rank: 6, } as const,
    32: { suit: 'heart', rank: 7, } as const,
    33: { suit: 'heart', rank: 8, } as const,
    34: { suit: 'heart', rank: 9, } as const,
    35: { suit: 'heart', rank: 10, } as const,
    36: { suit: 'heart', rank: 11, } as const,
    37: { suit: 'heart', rank: 12, } as const,
    38: { suit: 'heart', rank: 13, } as const,
    39: { suit: 'spade', rank: 1, } as const,
    40: { suit: 'spade', rank: 2, } as const,
    41: { suit: 'spade', rank: 3, } as const,
    42: { suit: 'spade', rank: 4, } as const,
    43: { suit: 'spade', rank: 5, } as const,
    44: { suit: 'spade', rank: 6, } as const,
    45: { suit: 'spade', rank: 7, } as const,
    46: { suit: 'spade', rank: 8, } as const,
    47: { suit: 'spade', rank: 9, } as const,
    48: { suit: 'spade', rank: 10, } as const,
    49: { suit: 'spade', rank: 11, } as const,
    50: { suit: 'spade', rank: 12, } as const,
    51: { suit: 'spade', rank: 13, } as const,
} as const;
export const allCardIds = Object.keys(allCards)
    .map(x => x as unknown as CardId);

export type Suit = typeof allSuits[number];
export type Rank = typeof allRanks[number];
export type CardId = keyof typeof allCards;
export type Card = typeof allCards[CardId];

export type CardDeck = {
    readonly cardIds: CardId[],
    readonly nextIndex: number,
};

export type CompareResult = -1 | 0 | 1;
