import { EngineConfigurationOption, Text } from '@sonolus/core'

export const optionsDefinition = {
    timeLimit: {
        name: 'Time Limit',
        standard: true,
        scope: 'Fifteen',
        type: 'slider',
        min: 30,
        max: 300,
        step: 10,
        def: 120,
        unit: Text.SecondUnit,
    },
} satisfies Record<string, EngineConfigurationOption>
