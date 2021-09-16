import { defineArchetypes } from 'sonolus.js'
import { scripts } from './scripts'

export const archetypes = defineArchetypes({
    initialization: {
        script: scripts.initializationIndex,
    },
    main: {
        script: scripts.mainIndex,
    },
    exit: {
        script: scripts.exitIndex,
        input: true,
    },
})
