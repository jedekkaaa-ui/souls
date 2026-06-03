import type {
  AIPersonalityInferenceInput,
  AIPersonalityInferenceOutput,
  AICompatibilityInput,
  AICompatibilityOutput,
  AIConversationInput,
  AIConversationOutput,
  AISafetyInput,
  AISafetyOutput,
} from './interfaces'
import {
  inferPersonality as stubInferPersonality,
  computeCompatibility as stubComputeCompatibility,
  getConversationSuggestion as stubGetConversationSuggestion,
  moderateContent as stubModerateContent,
} from './stubs'

export class AIService {
  private useStubs: boolean

  constructor() {
    // Когда AI подключат — поменять AI_USE_STUBS=false в .env
    this.useStubs = process.env.AI_USE_STUBS !== 'false'
  }

  async inferPersonality(input: AIPersonalityInferenceInput): Promise<AIPersonalityInferenceOutput> {
    if (this.useStubs) return stubInferPersonality(input)
    // TODO: Real LLM implementation — see docs/AI_INTEGRATION.md
    throw new Error('Real AI not configured. Set AI_USE_STUBS=false only after connecting LLM.')
  }

  async computeCompatibility(input: AICompatibilityInput): Promise<AICompatibilityOutput> {
    if (this.useStubs) return stubComputeCompatibility(input)
    throw new Error('Real AI not configured. Set AI_USE_STUBS=false only after connecting LLM.')
  }

  async getConversationSuggestion(input: AIConversationInput): Promise<AIConversationOutput> {
    if (this.useStubs) return stubGetConversationSuggestion(input)
    throw new Error('Real AI not configured. Set AI_USE_STUBS=false only after connecting LLM.')
  }

  async moderateContent(input: AISafetyInput): Promise<AISafetyOutput> {
    if (this.useStubs) return stubModerateContent(input)
    throw new Error('Real AI not configured. Set AI_USE_STUBS=false only after connecting LLM.')
  }
}

export const aiService = new AIService()
