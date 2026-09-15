import { Mastra } from '@mastra/core/mastra'
import { oppoAgent } from './agent'

export const mastra = new Mastra({
  agents: {
    oppoAgent,
  },
  server: {
    port: Number(process.env.PORT ?? 4111),
  },
})
