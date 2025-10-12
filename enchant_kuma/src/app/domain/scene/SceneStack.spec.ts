import { SceneStack } from "./SceneStack";
import { IScene, TickResult } from "./IScene";
import { SceneEventPublisher } from "./SceneEventPublisher";

test.each([
    [0],
    [1],
    [2],
])(".push(): [%i]", (numPrevScenes) => {
    // arrange
    const [sut, prevScenes] = buildSut(numPrevScenes);
    // act
    const scene = new S().toSpy();
    // sut.push(scene);
    // assert
    expect(scene.onAdded).toHaveBeenCalledTimes(1);
    expect(scene.onRemoved).toHaveBeenCalledTimes(0);
    expect(scene.onTick).toHaveBeenCalledTimes(0);
    for (const s of prevScenes) {
        expect(s.onAdded).toHaveBeenCalledTimes(0);
        expect(s.onRemoved).toHaveBeenCalledTimes(0);
        expect(s.onTick).toHaveBeenCalledTimes(0);
    }
});

test.each([
    [0],
    [1],
    [2],
])(".pop(): [%i]", (numPrevScenes) => {
    // arrange
    const [sut, prevScenes] = buildSut(numPrevScenes);
    const scene = new S();
    // sut.push(scene);
    scene.toSpy();
    // act
    sut.pop();
    // assert
    expect(scene.onAdded).toHaveBeenCalledTimes(0);
    expect(scene.onRemoved).toHaveBeenCalledTimes(1);
    expect(scene.onTick).toHaveBeenCalledTimes(0);
    for (const s of prevScenes) {
        expect(s.onAdded).toHaveBeenCalledTimes(0);
        expect(s.onRemoved).toHaveBeenCalledTimes(0);
        expect(s.onTick).toHaveBeenCalledTimes(0);
    }
});

test.each([
    [0],
    [1],
    [2],
])(".tickTop(): [%i]", (numPrevScenes) => {
    // arrange
    const [sut, prevScenes] = buildSut(numPrevScenes);
    const scene = new S();
    // sut.push(scene);
    scene.toSpy();
    // act
    // sut.tickTop({ touchstart: false });
    // assert
    expect(scene.onAdded).toHaveBeenCalledTimes(0);
    expect(scene.onRemoved).toHaveBeenCalledTimes(0);
    expect(scene.onTick).toHaveBeenCalledTimes(1);
    for (const s of prevScenes) {
        expect(s.onAdded).toHaveBeenCalledTimes(0);
        expect(s.onRemoved).toHaveBeenCalledTimes(0);
        expect(s.onTick).toHaveBeenCalledTimes(0);
    }
});

function buildSut(numPrevScenes: number): [SceneStack, S[]] {
    const sut = new SceneStack();
    const prevScenes: S[] = new Array(numPrevScenes).fill(new S());
    for (const s of prevScenes) {
        // sut.push(s);
        s.toSpy();
    }
    return [sut, prevScenes];
}

class S implements IScene<string> {
    constructor() { }
    eventPublisher = SceneEventPublisher.create<string>();
    onAdded(): void { }
    onRemoved(): void { }
    onTick(): TickResult { return {}; }
    toSpy(): S {
        this.onAdded = jest.fn();
        this.onRemoved = jest.fn();
        this.onTick = jest.fn();
        return this;
    }
}
