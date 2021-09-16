import { And, Equal, InputJudgment, SScript } from 'sonolus.js'
import { cell } from './common'

export function exit(): SScript {
    const updateSequential = And(
        ...[...Array(16).keys()].map((i) => Equal(cell(i), i)),
        [InputJudgment.set(1), true]
    )

    return {
        updateSequential: {
            code: updateSequential,
        },
    }
}
