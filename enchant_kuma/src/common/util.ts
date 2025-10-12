import { config } from "./config";

export async function sleepAsync(millis: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, millis));
}

export function* seq(len: number) {
    for (let i = 0; i < len; i++) {
        yield i
    }
}

export function randfloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

export function secToFrame(sec: number): number {
    return Math.round(sec * config.FPS);
}

export function createSceneError(cause: any, props: unknown): Error {
    const causeMsg = cause.message ?? cause;
    const propsMsg = JSON.stringify(props);
    const message = `cause=${causeMsg}, props=${propsMsg}`;
    return new Error(message);
}

export interface Array<T> {
    erase(elem: T): Array<T>
}
