import { ISceneDrawer } from "@src/app/port/out/ISceneDrawer";

export class SceneEventPublisher<EventType> {
    static create<T>(): SceneEventPublisher<T> {
        return new SceneEventPublisher<T>();
    }

    private constructor() { }

    private subscribers: ISceneDrawer<EventType>[] = [];

    register(s: ISceneDrawer<EventType>): void {
        this.subscribers.push(s);
    }

    publish(e: EventType): void {
        for (const s of this.subscribers) { s.onReceive(e); }
    }
}
