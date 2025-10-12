
export class DomainError extends Error {
    static createSceneError(
        cause: unknown,
        beforeProps: unknown,
        afterProps: unknown,
    ): DomainError {
        const before = JSON.stringify(beforeProps);
        const after = JSON.stringify(afterProps);
        const msg = `cause=${cause}, beforeProps=${before}, afterProps=${after}`;
        return new DomainError(msg);
    }

    private constructor(message: string) {
        super(message);
    }
}
