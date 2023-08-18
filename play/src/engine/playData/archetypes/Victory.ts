import { effect } from '../effect.js'
import { state } from '../state.js'

export class Victory extends Archetype {
    hasInput = true

    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return state.done
    }

    initialize() {
        this.result.judgment = Judgment.Perfect
        this.despawn = true

        effect.clips.victory.play(0)
    }
}
