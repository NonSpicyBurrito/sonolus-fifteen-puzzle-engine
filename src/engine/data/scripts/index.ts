import { defineScripts } from 'sonolus.js'
import { exit } from './exit'
import { initialization } from './initialization'
import { main } from './main'

export const scripts = defineScripts({
    initialization,
    main,
    exit,
})
