
export const config = {
    screen: {
        width: 600,
        height: 600,
        fps: 60,
        backgroundColor: "grey",
    } as const,
    title: {
        fontSize: 50,
        curtainingSec: 0.3,
    } as const,
    stage: {
        timer: 30,
        width: 10,
        height: 20,
    } as const,
    block: {
        width: 5,
        height: 5,
    } as const,
} as const;
