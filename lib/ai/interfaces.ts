import type {
  AttachmentScores,
  ValuesMap,
  ConflictStyle,
  NervousSystemProfile,
  EmotionalRegulation,
  GrowthOrientation,
  CommunicationStyle,
  LayerScores,
  TensionPoint,
  ResonancePoint,
  SafetyFlag,
  PersonalityProfile,
  OnboardingResponse,
  BehavioralEventData,
  MessageData,
  RequestType,
  DepthLevel,
  SuggestionType,
} from '@/types'

export interface AIPersonalityInferenceInput {
  userId: string
  onboardingResponses: OnboardingResponse[]
  behavioralEvents: BehavioralEventData[]
  freeTextResponses: string[]
}

export interface AIPersonalityInferenceOutput {
  personalityVector: number[]
  attachmentScores: AttachmentScores
  valuesMap: ValuesMap
  conflictStyle: ConflictStyle
  nervousSystem: NervousSystemProfile
  emotionalRegulation: EmotionalRegulation
  growthOrientation: GrowthOrientation
  communication: CommunicationStyle
  confidenceScores: Record<string, number>
  narrativeInsight: string
  uncertaintyFlags: string[]
}

export interface AICompatibilityInput {
  profileA: PersonalityProfile
  profileB: PersonalityProfile
}

export interface AICompatibilityOutput {
  layerScores: LayerScores
  overallScore: number
  chemistryScore: number
  stabilityScore: number
  tensionPoints: TensionPoint[]
  resonancePoints: ResonancePoint[]
  narrativeSummary: string
  warningFlags: string[]
  confidenceScore: number
}

export interface AIConversationInput {
  matchId: string
  profileA: PersonalityProfile
  profileB: PersonalityProfile
  compatibilityData: AICompatibilityOutput
  conversationHistory: MessageData[]
  requestType: RequestType
}

export interface AIConversationOutput {
  suggestion: string
  suggestionType: SuggestionType
  depthLevel: DepthLevel
  reasoning: string
}

export interface AISafetyInput {
  content: string
  userId: string
  context: 'message' | 'onboarding' | 'profile'
}

export interface AISafetyOutput {
  isSafe: boolean
  flags: SafetyFlag[]
  distressSignals: boolean
  requiresHumanReview: boolean
}
