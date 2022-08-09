import {
    Add,
    And,
    bool,
    Code,
    Equal,
    Greater,
    HorizontalAlign,
    Mod,
    Multiply,
    Or,
    PerfectMultiplier,
    RandomInteger,
    ScreenAspectRatio,
    Script,
    Subtract,
    UIMenu,
    UIMenuConfiguration,
} from 'sonolus.js'
import { cell, temp } from './common'

export function initialization(): Script {
    const preprocess = [
        UIMenu.set(
            Subtract(ScreenAspectRatio, 0.05),
            0.95,
            1,
            1,
            Multiply(0.15, UIMenuConfiguration.scale),
            Multiply(0.15, UIMenuConfiguration.scale),
            0,
            UIMenuConfiguration.alpha,
            HorizontalAlign.Center,
            true
        ),

        PerfectMultiplier.set(1),
    ]

    const updateSequential = [
        [...Array(16).keys()].map((i) => cell(i).set(i)),

        [...Array(20).keys()].map(() => [
            temp[0].set(RandomInteger(0, 15)),
            temp[1].set(RandomInteger(0, 15)),
            swapCells(temp[0], temp[1]),
        ]),

        temp[0].set(0),
        [...Array(15).keys()].map((i) =>
            [...Array(14 - i).keys()].map((j) =>
                And(
                    Greater(cell(i), cell(i + j + 1)),
                    temp[0].set(Add(temp[0], 1))
                )
            )
        ),
        And(bool(Mod(temp[0], 2)), swapCells(0, 1)),

        true,
    ]

    return {
        preprocess,
        updateSequential,
    }
}

function swapCells(aIndex: Code<number>, bIndex: Code<number>) {
    const a = cell(aIndex)
    const b = cell(bIndex)

    return Or(Equal(a, b), [
        a.set(Add(a, b)),
        b.set(Subtract(a, b)),
        a.set(Subtract(a, b)),
    ])
}
