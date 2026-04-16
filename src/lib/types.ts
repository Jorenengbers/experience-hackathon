export type EpisodeStatus = 'unplayed' | 'played' | 'partial'
export type Edition = 'morning' | 'evening'

export interface Episode {
  id: string
  edition: Edition
  title: string
  date: string
  dateShort: string
  duration: string
  topics: string[]
  slackCount: number
  status: EpisodeStatus
  progress: number
  audioFile: string | null
}

export interface SlackMessage {
  id: string
  sender: string
  initials: string
  channel: string
  time: string
  text: string
  inPodcast: boolean
  avatarColor: string
  initialsColor: string
}

export interface ScriptLine {
  speaker: 'ALEX' | 'SARA'
  text: string
}

export interface User {
  name: string
  city: string
}

export interface Weather {
  temp: string
  condition: string
  note: string
}
