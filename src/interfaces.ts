export interface VoCard {
  origin: string
  translation: string
  created_at: number
  grasp?: VoCardGrasp
}

export interface VoCardGraspReviewResult {
  time: number
  pass: boolean
}

export interface VoCardGrasp {
  recent_result: VoCardGraspReviewResult[]
}