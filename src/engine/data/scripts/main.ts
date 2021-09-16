import {
    Abs,
    Add,
    And,
    Code,
    customSkinSprite,
    Divide,
    Draw,
    EffectClip,
    EntityInfo,
    EntityMemory,
    Equal,
    Floor,
    GreaterOr,
    If,
    Lerp,
    Less,
    LessOr,
    Mod,
    Multiply,
    NotEqual,
    Play,
    Power,
    Round,
    SScript,
    State,
    Subtract,
    Time,
    TouchST,
    TouchStarted,
    TouchX,
    TouchY,
    UnlerpClamped,
} from 'sonolus.js'
import { cell, engineId, temp } from './common'

const cellSize = 0.375
const stageSize = cellSize * 4

const cellBackgroundSprite = sprite(15)
const stageBackgroundSprite = sprite(20)

const empty = {
    x: EntityMemory.to<number>(16),
    y: EntityMemory.to<number>(17),
}

const animation = {
    from: {
        time: EntityMemory.to<number>(18),
        index: EntityMemory.to<number>(19),
    },
    to: {
        time: EntityMemory.to<number>(20),
        index: EntityMemory.to<number>(21),
    },
    duration: 0.1,
}

export function main(): SScript {
    const shouldSpawn = Equal(EntityInfo.of(0).state, State.Despawned)

    const initialize = [
        empty.x.set(3),
        empty.y.set(3),
        animation.to.time.set(-1000),
    ]

    const touch = And(
        TouchStarted,
        GreaterOr(Time, animation.to.time),
        NotEqual(EntityInfo.of(2).state, State.Despawned),
        LessOr(Abs(TouchX), cellSize * 2),
        LessOr(Abs(TouchY), cellSize * 2),
        [
            temp[0].set(Round(Add(Divide(TouchX, cellSize), 1.5))),
            temp[1].set(Round(Subtract(1.5, Divide(TouchY, cellSize)))),
            Equal(
                Add(
                    Abs(Subtract(empty.x, temp[0])),
                    Abs(Subtract(empty.y, temp[1]))
                ),
                1
            ),
        ],
        [
            animation.from.time.set(TouchST),
            animation.to.time.set(Add(TouchST, animation.duration)),
            animation.from.index.set(toIndex(temp[0], temp[1])),
            animation.to.index.set(toIndex(empty.x, empty.y)),

            cell(animation.to.index).set(cell(animation.from.index)),
            cell(animation.from.index).set(15),
            empty.x.set(temp[0]),
            empty.y.set(temp[1]),

            Play(EffectClip.Perfect, 0),
        ]
    )

    const updateParallel = [
        Draw(stageBackgroundSprite, ...rect(0, 0, stageSize), 0, 1),

        [...Array(16).keys()].map((i) => {
            const { x, y } = toPosition(i)
            const { x: fromX, y: fromY } = toPosition(animation.from.index)
            const { x: toX, y: toY } = toPosition(animation.to.index)

            return And(
                NotEqual(cell(i), 15),
                If(
                    And(
                        Less(Time, animation.to.time),
                        Equal(i, animation.to.index)
                    ),
                    [
                        temp[0].set(
                            UnlerpClamped(
                                animation.to.time,
                                animation.from.time,
                                Time
                            )
                        ),
                        temp[0].set(Subtract(1, Power(temp[0], 3))),
                        temp[1].set(Lerp(fromX, toX, temp[0])),
                        temp[2].set(Lerp(fromY, toY, temp[0])),

                        drawCell(i, temp[1], temp[2]),
                    ],
                    drawCell(i, x, y)
                )
            )
        }),
    ]

    return {
        shouldSpawn: {
            code: shouldSpawn,
        },
        initialize: {
            code: initialize,
        },
        touch: {
            code: touch,
        },
        updateParallel: {
            code: updateParallel,
        },
    }
}

function drawCell(index: number, x: Code<number>, y: Code<number>) {
    const r = rect(Multiply(x, cellSize), Multiply(y, cellSize))
    return [
        Draw(cellBackgroundSprite, ...r, 1 + index, 1),
        Draw(sprite(cell(index)), ...r, 20, 1),
    ]
}

function toPosition(index: Code<number>) {
    return {
        x: Subtract(Mod(index, 4), 1.5),
        y: Subtract(1.5, Floor(Divide(index, 4))),
    }
}

function toIndex(x: Code<number>, y: Code<number>) {
    return Add(x, Multiply(y, 4))
}

function rect(
    x: Code<number>,
    y: Code<number>,
    size: number = cellSize
): [
    Code<number>,
    Code<number>,
    Code<number>,
    Code<number>,
    Code<number>,
    Code<number>,
    Code<number>,
    Code<number>
] {
    const l = Subtract(x, size / 2)
    const r = Add(x, size / 2)
    const b = Subtract(y, size / 2)
    const t = Add(y, size / 2)

    return [l, b, l, t, r, t, r, b]
}

function sprite(id: Code<number>) {
    return customSkinSprite(engineId, id)
}
