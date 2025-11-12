
export class ResultOf<T> {
    static ok<T>(ok: T): ResultOf<T> {
        return new ResultOf<T>(ok);
    }

    static err<T>(err: Error): ResultOf<T> {
        return new ResultOf<T>(undefined, err);
    }

    private constructor(ok?: T, err?: Error) {
        this.ok = ok;
        this.err = err;
    }

    readonly ok?: T;
    readonly err?: Error;
}
