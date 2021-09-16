import { SLevelData } from 'sonolus.js'
import { archetypes } from '../../engine/data/archetypes'

export const levelData: SLevelData = {
    entities: [
        {
            archetype: archetypes.initializationIndex,
        },
        {
            archetype: archetypes.mainIndex,
        },
        {
            archetype: archetypes.exitIndex,
        },
    ],
}
