# Briefcast — Cursor Build Prompt

You are building **Briefcast**, a personalised AI podcast mobile app for commuters. Build this phase by phase, confirming completion of each phase before moving to the next.

---

## Tech Stack

- **React Native Web** (runs in browser, feels like a native iPhone app)
- **Expo** (use `npx create-expo-app briefcast` with the blank TypeScript template)
- **React Navigation** for screen transitions
- **Expo AV** for audio playback
- **Pre-recorded audio file** — no API calls for audio generation in this version. A `.mp3` file will be placed in `assets/audio/morning-episode.mp3` and referenced directly.
- **No backend** — all data is hardcoded/local state for this demo

Run the app in browser using `npx expo start --web`.

---

## App Overview

Two screens only:

1. **Home screen** — shows today's date, time, faked weather, today's episodes (morning + evening), previous episode history with played/unplayed states, and a Slack messages preview panel
2. **Player screen** — full-screen podcast player (like Spotify/Pocket Casts) with artwork, progress bar, play/pause, skip, speed control, and a scrollable script transcript

There is **no tab bar**, **no settings screen**, **no login**. Navigation is: tap episode card → open player. Back arrow → return to home.

---

## Design System

The app must feel like a **native iPhone app**, dark and editorial. Not a website.

```
Colors:
  --bg: #0e0e0f
  --surface: #161618
  --surface2: #1e1e21
  --border: rgba(255,255,255,0.08)
  --border2: rgba(255,255,255,0.15)
  --text: #f0ede8
  --text2: #9b9890
  --text3: #5a5856
  --amber: #e8a94a        (morning accent)
  --blue: #7eb8f7         (evening accent)
  --green: #6fcf97        (connected/success)
  --purple: #c084db       (Slack accent)

Typography:
  Display: Playfair Display (serif) — for titles and episode names
  Body: DM Sans — for all UI text
  Load both from Google Fonts via @expo-google-fonts

Radius:
  Cards: 16px
  Chips/pills: 20px (fully rounded)
  Small elements: 10–12px

Spacing:
  Screen padding: 20px horizontal
  Section gap: 24px
  Card gap: 10px
```

The phone frame itself should be wrapped in an iPhone shell when running in browser:
- Max width 390px, centered on screen
- Height 844px
- Border radius 52px
- Dark border + subtle inner glow
- Dynamic island (black pill at top)
- Fake status bar showing 9:41, signal, wifi, battery icons

---

## Hardcoded Data

### User
```js
const USER = {
  name: 'Rianne',
  city: 'Amsterdam',
}
```

### Weather (faked)
```js
const WEATHER = {
  morning: { temp: '11°C', condition: 'Overcast', note: 'Rain expected this afternoon' },
  evening: { temp: '13°C', condition: 'Clearing up', note: 'Rain earlier has cleared' },
}
```

### Episodes
```js
const EPISODES = [
  {
    id: 'ep-001-am',
    edition: 'morning',
    title: 'The day ahead',
    date: 'Wednesday, April 16 · 2026',
    dateShort: 'Today',
    duration: '5:10',
    topics: ['Polestar', 'NPO', 'AI in design'],
    slackCount: 2,
    status: 'unplayed',        // 'unplayed' | 'played' | 'partial'
    progress: 0,               // 0–1 float
    audioFile: require('./assets/audio/morning-episode.mp3'),
  },
  {
    id: 'ep-001-pm',
    edition: 'evening',
    title: 'The day in review',
    date: 'Wednesday, April 16 · 2026',
    dateShort: 'Today',
    duration: '5:30',
    topics: ['Polestar', 'NPO', 'AI in design'],
    slackCount: 2,
    status: 'unplayed',
    progress: 0,
    audioFile: null,           // Not yet generated — show "Ready at 18:00"
  },
  {
    id: 'ep-000-am',
    edition: 'morning',
    title: 'The day ahead',
    date: 'Tuesday, April 15 · 2026',
    dateShort: 'Yesterday',
    duration: '5:02',
    topics: ['Polestar', 'Financial Times', 'AI in design'],
    slackCount: 1,
    status: 'played',
    progress: 1,
    audioFile: null,
  },
  {
    id: 'ep-000-pm',
    edition: 'evening',
    title: 'The day in review',
    date: 'Tuesday, April 15 · 2026',
    dateShort: 'Yesterday',
    duration: '4:55',
    topics: ['Polestar', 'Financial Times', 'NPO'],
    slackCount: 0,
    status: 'played',
    progress: 1,
    audioFile: null,
  },
  {
    id: 'ep-00-am',
    edition: 'morning',
    title: 'The day ahead',
    date: 'Monday, April 14 · 2026',
    dateShort: 'Mon Apr 14',
    duration: '5:18',
    topics: ['NPO', 'AI in design', 'Tech industry'],
    slackCount: 3,
    status: 'partial',
    progress: 0.55,
    audioFile: null,
  },
]
```

### Slack Messages
```js
const SLACK_MESSAGES = [
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
```

### Podcast Script (for transcript display in player)
```js
const MORNING_SCRIPT = [
  { speaker: 'ALEX', text: 'Good morning Rianne. It\'s Wednesday April 16th — this is your Briefcast morning edition. I\'m Alex, joined as always by Sara. Let\'s get into it.' },
  { speaker: 'SARA', text: 'Before we dive in — Amsterdam is looking at 11 degrees and overcast this morning. Rain is expected around noon, so if you\'re cycling back tonight, maybe reconsider.' },
  { speaker: 'ALEX', text: 'Polestar posted their Q1 numbers this week and they weren\'t pretty. Deliveries down 24% year on year, well below what analysts had pencilled in.' },
  { speaker: 'SARA', text: 'What does that mean for their European positioning?' },
  { speaker: 'ALEX', text: 'Analysts are saying the brand is caught between premium and EV-value — no clear story. The design is strong but it\'s not converting. Worth watching closely if you\'re in that space this week.' },
  { speaker: 'SARA', text: 'Moving to NPO — the public broadcaster announced a significant restructure of their digital content strategy yesterday, with a heavy emphasis on personalised audio and on-demand formats.' },
  { speaker: 'ALEX', text: 'Is this a threat or an opportunity for agencies working with them?' },
  { speaker: 'SARA', text: 'Opportunity, clearly. They\'re actively looking for design and UX partners to help execute the new direction. The timing is interesting given what Mia mentioned this morning.' },
  { speaker: 'ALEX', text: 'Which brings us to your Slack. A message just came in from Jan van der Berg in #sales — Polestar wants to move the Q2 proposal meeting to this Friday. A competing agency is also pitching. Deck needed by Thursday EOD.' },
  { speaker: 'SARA', text: 'Two days. That\'s tight but doable if you unblock the team today.' },
  { speaker: 'ALEX', text: 'And from Mia Kowalski in #npo-project — the NPO stakeholder approved the interface direction. Board presentation next week, prototype by Monday.' },
  { speaker: 'SARA', text: 'Two big clients moving fast in the same week. The bottleneck is going to be your Monday morning.' },
  { speaker: 'ALEX', text: 'One thing to keep in mind today: great design still needs a great pitch. Polestar and NPO are both moments where execution speed is the differentiator. Have a good drive Rianne.' },
  { speaker: 'SARA', text: 'And maybe bring an umbrella.' },
]
```

---

## Phase 1 — Project Setup

1. Initialise Expo project: `npx create-expo-app briefcast --template blank-typescript`
2. Install dependencies:
   ```
   npx expo install expo-av expo-font @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans
   npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
   ```
3. Create folder structure:
   ```
   /app
     /screens
       HomeScreen.tsx
       PlayerScreen.tsx
     /components
       PhoneShell.tsx
       EpisodeCard.tsx
       SlackPanel.tsx
       WeatherBar.tsx
       PlayerControls.tsx
       ScriptTranscript.tsx
     /data
       episodes.ts
       slack.ts
       script.ts
       user.ts
     /assets
       /audio
         morning-episode.mp3   ← placeholder, user will add real file
   ```
4. Set up React Navigation with a Stack navigator (HomeScreen → PlayerScreen)
5. Set up Google Fonts loading with AppLoading
6. Create a global `theme.ts` with all color and spacing constants
7. Wrap the entire app in a `PhoneShell` component when running on web (detect platform)

**Acceptance criteria:** App runs in browser at localhost with a centered iPhone shell, dark background, no errors.

---

## Phase 2 — Phone Shell & Navigation

Build the `PhoneShell` component:
- On web: renders a centered 390×844px dark phone frame with border-radius 52px, dynamic island (120×34px black pill), fake status bar (time 9:41, signal bars, wifi, battery)
- On native: renders children directly with no shell
- Status bar text and icons should be white, positioned correctly

Build the Stack Navigator:
- No header (headerShown: false on both screens)
- Slide transition from right when opening player
- Slide back when closing

**Acceptance criteria:** Shell renders correctly in browser. Navigation between two blank screens works with correct animation.

---

## Phase 3 — Home Screen

Build `HomeScreen.tsx` with these sections in a `ScrollView`:

### 3a — Header
- Greeting: "Good morning, Rianne" (small, muted)
- Logo: "Brief**cast**" — "Brief" in white Playfair Display, "cast" in amber
- Weather row: city chip + temp + condition + date (e.g. "Amsterdam · 11°C · Overcast · Wed Apr 16")

### 3b — Today's Episodes
Section label: "TODAY"
Render the two today episodes (morning + evening) from EPISODES data as `EpisodeCard` components.

`EpisodeCard` component:
- Dark surface background (#161618)
- Top accent border: 2px amber (morning) or blue (evening)
- Amber/blue unplayed dot (top right) — only if status === 'unplayed'
- Edition label (e.g. "MORNING EDITION") in accent color, uppercase, small
- Episode title in Playfair Display serif
- Meta row: topics joined with · separator, duration
- Footer row: two overlapping host avatars (A = amber, S = blue) + duration text + play button circle
- Play button: amber (morning) or blue (evening) filled circle with play triangle icon
- If audioFile is null (evening not yet generated): show "Ready at 18:00" instead of play button, slightly dimmed card
- Tap anywhere on card → navigate to PlayerScreen passing episode data

### 3c — Previous Episodes
Section label: "PREVIOUS EPISODES"
Render remaining episodes (non-today) from EPISODES data.
Same EpisodeCard but with played state styling:
- `played`: card opacity 0.55, progress bar at 100%, grey play button
- `partial`: card opacity 0.75, progress bar at episode.progress%, grey play button
- Progress bar: thin 2px bar at bottom of card, amber (morning) or blue (evening) fill

### 3d — Slack Panel
`SlackPanel` component:
- Dark surface card
- Header row: Slack purple dot + "Slack — important contacts" title + "2 in podcast" amber badge
- List of SLACK_MESSAGES:
  - Each row: avatar (initials, colored) + sender name + channel chip + truncated message text
  - If inPodcast: show small "In podcast" amber label on the right
  - If not inPodcast: render at 40% opacity — clearly filtered out
- No tap action needed on individual messages

**Acceptance criteria:** All sections render with correct data, correct styling. Episode cards tap to navigate to player.

---

## Phase 4 — Player Screen

Build `PlayerScreen.tsx`:

The player receives the selected episode object via navigation params.

### 4a — Header
- Back button (←) top left: navigates back to Home
- Title: "Now Playing" centered
- Both in muted color

### 4b — Artwork
- Large square card (full width minus 40px padding), aspect ratio 1:1
- Dark background (#1a1a2e)
- Centered content:
  - "Briefcast" in amber Playfair Display
  - Edition subtitle (e.g. "Morning Edition") in muted small text
  - Animated waveform bars (10–12 bars, varying heights) that animate up/down when playing, freeze when paused

### 4c — Episode Info
- Date string (e.g. "Wednesday, April 16 · 2026") — small, muted, centered
- Episode title in Playfair Display, centered
- Show name "Briefcast · Morning edition" in amber, small, centered

### 4d — Progress Bar
- Scrubable progress bar (use Slider from @react-native-community/slider or a TouchableOpacity custom implementation)
- Elapsed time left, total duration right
- Amber fill color

### 4e — Controls
- Row of: skip-back 15s · play/pause button (large amber circle) · skip-forward 30s
- Play/pause toggles the audio and the waveform animation
- If episode.audioFile exists: use Expo AV to play the actual audio
- If episode.audioFile is null: show a "No audio file" state — grey out controls, show message "Add audio file to assets/audio/ to enable playback"

### 4f — Action Bar
Bottom row with 4 icon buttons:
- Share (box with arrow icon)
- Speed (shows "1x", tapping cycles through 0.75x → 1x → 1.25x → 1.5x)
- Script (lines icon) — tapping expands/collapses the script transcript below
- Sleep timer (moon icon) — no functionality needed, just UI

### 4g — Script Transcript
Collapsible panel below the action bar:
- Shows when Script button is tapped
- Scrollable list of script lines from MORNING_SCRIPT
- Each line: speaker name colored (ALEX = amber, SARA = blue) + text
- Currently speaking line is highlighted at full opacity; others at 40%
- Highlight syncs with audio playback position if audio is playing (approximate by dividing total lines by total duration)

**Acceptance criteria:** Player opens correctly from Home. Audio plays if file exists. Progress bar updates. Script panel expands/collapses. Speed cycling works.

---

## Phase 5 — Polish & Details

### 5a — Animations
- Episode cards: subtle scale(0.98) on press (use `Animated` or `Pressable` with scale transform)
- Play button: scale pulse when transitioning play→pause
- Waveform bars: each bar animates independently with slightly different timing (staggered)
- Slack panel: slide in from bottom on mount with a 300ms ease

### 5b — Played State Updates
When audio reaches the end:
- Update the episode's status to 'played' and progress to 1
- Card on home screen updates accordingly (dimmed, full progress bar)

When audio is paused mid-way:
- Save current position as episode.progress (0–1)
- Card shows partial state with correct fill %

Use React Context or a simple useState at app root to manage episode state.

### 5c — Empty Audio State
If `morning-episode.mp3` is missing from assets:
- Player still opens correctly
- Shows a clear placeholder state: artwork with a microphone icon, text "Episode audio coming soon"
- Script transcript still works and can be read
- All UI elements render — just controls are disabled

### 5d — Web-specific tweaks
- Cursor: pointer on all tappable elements
- No text selection on UI elements
- Scrollbar hidden on all scroll views
- Font smoothing: antialiased
- Prevent rubber-band scroll on the phone shell itself

---

## Phase 6 — Final Demo Checklist

Before handing off, verify:

- [ ] App runs with `npx expo start --web` in Chrome
- [ ] iPhone shell renders correctly, centered, no overflow
- [ ] "Good morning Rianne" greeting shows correctly
- [ ] Faked weather shows (Amsterdam, 11°C, Overcast)
- [ ] Today's morning episode shows as unplayed (amber dot)
- [ ] Today's evening episode shows as "Ready at 18:00" (dimmed)
- [ ] Yesterday's episodes show as played (dimmed, full progress bar)
- [ ] Monday episode shows partial progress bar at 55%
- [ ] Slack panel shows Jan and Mia as "In podcast", Tom dimmed/filtered
- [ ] Tapping morning episode opens player
- [ ] Player shows correct episode title, date, artwork
- [ ] If audio file exists: plays correctly, progress bar updates
- [ ] Script button reveals transcript
- [ ] ALEX lines in amber, SARA lines in blue
- [ ] Back button returns to home
- [ ] Speed button cycles through playback rates
- [ ] No console errors

---

## Notes for the Builder

- **Audio file**: The demo uses a pre-generated ElevenLabs audio file. Place it at `assets/audio/morning-episode.mp3`. The app handles missing audio gracefully.
- **Fonts**: Load Playfair Display and DM Sans via `@expo-google-fonts`. Show a loading screen until fonts are ready.
- **Platform detection**: Use `Platform.OS === 'web'` to conditionally render the phone shell and apply web-only styles.
- **No API calls**: This is a fully static demo. No Claude API, no ElevenLabs API, no Slack API. Everything is hardcoded.
- **TypeScript**: Use types throughout. Define `Episode`, `SlackMessage`, `ScriptLine` interfaces in a `types.ts` file.
- **Keep it simple**: Do not add routing libraries beyond React Navigation. Do not add state management beyond React Context. Do not add animations libraries beyond React Native's built-in `Animated` API.

---

## Start command

```bash
npx create-expo-app briefcast --template blank-typescript
cd briefcast
npx expo start --web
```

Build phase by phase. After each phase, confirm it runs without errors before proceeding to the next.
