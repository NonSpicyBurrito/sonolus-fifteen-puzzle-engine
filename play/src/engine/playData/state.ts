export enum Status {
    Ongoing,
    Loss,
    Won,
}

export const state = levelMemory({
    status: DataType<Status>,
})
