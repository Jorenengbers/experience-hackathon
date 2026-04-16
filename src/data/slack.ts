import type { SlackMessage } from '@/lib/types'

export const SLACK_MESSAGES: SlackMessage[] = [
  {
    id: 'msg-001',
    sender: 'Jan van der Berg',
    initials: 'JV',
    channel: '#sales',
    time: '07:14',
    text: 'Polestar just reached out — they want to move the Q2 proposal meeting to this Friday. They mentioned a competing agency is also pitching. We need the deck ready by Thursday EOD.',
    inPodcast: true,
    avatarColor: '#2d2010',
    initialsColor: '#e8a94a',
  },
  {
    id: 'msg-002',
    sender: 'Mia Kowalski',
    initials: 'MK',
    channel: '#npo-project',
    time: '06:52',
    text: 'NPO stakeholder approved the new interface direction. They want to show it to their board next week. Can we get a prototype-ready version by Monday? This could open up the full contract.',
    inPodcast: true,
    avatarColor: '#102030',
    initialsColor: '#7eb8f7',
  },
  {
    id: 'msg-003',
    sender: 'Tom Reinders',
    initials: 'TR',
    channel: '#general',
    time: '08:01',
    text: 'Reminder: team standup moved to 9:30 today. Also the office printer is broken again.',
    inPodcast: false,
    avatarColor: '#1a1e1a',
    initialsColor: '#6fcf97',
  },
]
