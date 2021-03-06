import {
    And,
    customEffectClip,
    Equal,
    InputJudgment,
    Play,
    SScript,
} from 'sonolus.js'
import { cell, engineId } from './common'

export function exit(): SScript {
    const updateSequential = And(
        ...[...Array(16).keys()].map((i) => Equal(cell(i), i)),
        [InputJudgment.set(1), Play(customEffectClip(engineId, 1), 0), true]
    )

    return {
        updateSequential: {
            code: updateSequential,
        },
    }
}
