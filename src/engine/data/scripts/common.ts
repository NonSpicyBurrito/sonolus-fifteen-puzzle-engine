import { Code, EntityMemory, LevelMemory } from 'sonolus.js'

export const engineId = 999

export const temp = [...Array(64).keys()].map((i) =>
    EntityMemory.to<number>(63 - i)
)

export function cell(index: Code<number>) {
    return LevelMemory.to<number>(index)
}
