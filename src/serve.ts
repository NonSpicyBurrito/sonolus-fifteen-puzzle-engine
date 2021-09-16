import { serve } from 'sonolus.js'
import { buildOutput } from '.'

serve(buildOutput, { port: 3000 })
