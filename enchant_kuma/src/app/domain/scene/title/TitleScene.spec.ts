import { seq } from "@src/common/util";
import { TitleScene } from "./TitleScene";
import { SceneAddedEvent, TitleSceneEvent, SceneRemovedEvent } from "@src/app/port/in/sceneevent/TitleSceneEvent";

test.each([
    [],
])(".onAdded()", () => {
    // arrange
    const [sut, handler] = buildSut();
    handler.onAdded = jest.fn();
    // act
    sut.onAdded();
    // assert
    expect(handler.onAdded).toHaveBeenCalledTimes(1);
});

test.each([
    [],
])(".onRemoved()", () => {
    // arrange
    const [sut, handler] = buildSut();
    handler.onRemoved = jest.fn();
    // act
    sut.onRemoved();
    // assert
    expect(handler.onRemoved).toHaveBeenCalledTimes(1);
});

// test.each([
//     [],
// ])(".onTick()", () => {
//     // arrange
//     const [sut, handler] = buildSut();
//     handler.onTick = jest.fn();
//     // act
//     sut.onRemoved();
//     // assert
//     expect(handler.onTick).toHaveBeenCalledTimes(1);
// });

function buildSut(): [TitleScene, Handler] {
    const sut = TitleScene.create();
    const handler = new Handler();
    // sut.eventPublisher.subscribe(e => handler.onPublished(e));
    return [sut, handler];
}

class Handler {
    onPublished(e: TitleSceneEvent) {
        switch (e.tag) {
            case "SceneAdded": return this.onAdded(e);
            case "SceneRemoved": return this.onRemoved(e);
        }
    }
    onAdded(e: SceneAddedEvent) { }
    onRemoved(e: SceneRemovedEvent) { }
}
