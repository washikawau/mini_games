
export type Board = readonly [
    SqState, SqState, SqState,
    SqState, SqState, SqState,
    SqState, SqState, SqState,
];
export type SqId = typeof allSqIds[number];
export type SqState = 'o' | 'x' | '-';
export type Mark = 'o' | 'x';

export const allSqIds = [
    '00', '01', '02',
    '10', '11', '12',
    '20', '21', '22',
] as const;
