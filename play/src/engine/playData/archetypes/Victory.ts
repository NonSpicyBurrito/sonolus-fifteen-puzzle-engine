import { effect } from '../effect.js'
import { Status, state } from '../state.js'

export class Victory extends Archetype {
    hasInput = true

    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return state.status !== Status.Ongoing
    }

    initialize() {
        if (state.status === Status.Won) {
            this.result.judgment = Judgment.Perfect
            this.result.accuracy = (time.now - 2) / 1000

            effect.clips.victory.play(0)
        } else {
            this.result.judgment = Judgment.Miss
            this.result.accuracy = 1
        }

        this.despawn = true
    }
}
