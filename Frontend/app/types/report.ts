export interface Report {
  id: string
  status: string
  description: string
  cityId: string
  infrastructureEntity: {
    id: string
    lat: number
    lng: number
  }
  createdAt: Date
  updatedAt: Date
}