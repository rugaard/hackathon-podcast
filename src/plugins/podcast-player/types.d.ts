export type Episode = {
  id: number
  type: string
  show_id: number
  show: Partial<Show>
  season: Season
  episode_no: number
  title: string
  description: Description
  duration: number
  url: string
  image: Image,
  download: {
    enabled?: boolean|undefined
    url?: string|undefined
  }
  waveform_url: string|null
  media: {
    id: number|null
    url: string|null
  },
  count: {
    play: number
    ondemand: number
    live: number
    downloads: number
    likes: number
    messages: number
  }
  tags: string[],
  author_id: number
  author: Partial<Author>
  is_explicit: boolean
  transcript?: Transcript
  published_at: string
}

export type Show = {
  id: number
  title: string
  language: string
  description: Description
  image: Image
  itunes_url: string
  author_id: number
  author_name: string
  author: Partial<Author>
  owner_name: string
  copyright: string
  last_episode_at: string
  is_explicit: boolean
}

export type ShowEpisodes = {
  items: Partial<Episode>[],
  last_id: string|null
}

export type Season = {
  type: string
  no: string
}

export type Author = {
  id: number
  username: string
  fullname: string
  description: string
  image: Image
  type: string
  plan: string
}

export type Image = {
  url: string
  original: string
}

export type Description = {
  text: string
  html: string
}

export type Transcript = {
  type: string
  url: string
}
