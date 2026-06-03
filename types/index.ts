export interface AttachmentScores {
  secure: number
  anxious: number
  avoidant: number
  disorganized: number
}

export interface ValuesMap {
  autonomy: number
  security: number
  achievement: number
  benevolence: number
  conformity: number
  tradition: number
  power: number
  stimulation: number
  hedonism: number
  universalism: number
  selfDirection: number
  spirit: number
}

export interface ConflictStyle {
  compete: number
  avoid: number
  accommodate: number
  collaborate: number
}

export interface NervousSystemProfile {
  activation: number
  deactivation: number
  windowTolerance: number
}

export interface EmotionalRegulation {
  flooding: number
  rumination: number
  repair: number
  suppression: number
  expression: number
}

export interface GrowthOrientation {
  fixed: number
  oriented: number
}

export interface CommunicationStyle {
  direct: number
  indirect: number
  assertive: number
  passive: number
}

export interface LayerScores {
  nervous: number
  attachment: number
  values: number
  emotionalRegulation: number
  lifestyle: number
  growth: number
}

export interface TensionPoint {
  dimension: string
  severity: 'low' | 'medium' | 'high'
  description: string
  patternName: string
}

export interface ResonancePoint {
  dimension: string
  strength: 'moderate' | 'strong' | 'deep'
  description: string
}

export interface SafetyFlag {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface PersonalityProfile {
  userId: string
  personalityVector: number[]
  attachmentScores: AttachmentScores
  valuesMap: ValuesMap
  conflictStyle: ConflictStyle
  nervousSystem: NervousSystemProfile
  emotionalRegulation: EmotionalRegulation
  growthOrientation: GrowthOrientation
  communication: CommunicationStyle
  confidenceScores: Record<string, number>
}

export interface OnboardingResponse {
  sessionNum: number
  questionId: string
  choiceValue: Record<string, unknown>
  timingMs?: number
}

export interface BehavioralEventData {
  eventType: string
  sessionNum?: number
  questionId?: string
  choiceValue: Record<string, unknown>
  timingMs?: number
}

export interface MessageData {
  id: string
  senderId: string
  content: string
  messageType: string
  createdAt: Date
}

export type RequestType = 'starter' | 'deepen' | 'insight' | 'repair'
export type DepthLevel = 1 | 2 | 3
export type SuggestionType = 'question' | 'observation' | 'challenge'

export interface UserSession {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  onboardingDone: boolean
  onboardingStep: number
}
