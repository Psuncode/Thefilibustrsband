export type ForFansOfFaq = {
  question: string;
  answer: string;
};

export type ForFansOfEntry = {
  /** kebab-case slug, e.g. "the-backseat-lovers" */
  slug: string;
  artist: string;
  /** one-line teaser shown on the /for-fans-of hub card */
  hook: string;
  /** 2-3 comparison paragraphs (what's similar / what's different) */
  body: readonly string[];
  /** The Filibusters tracks to start with (resolved against the discography). */
  recommendedTracks: readonly string[];
  /** 2-3 Q&A; rendered as a FAQ section + FAQPage JSON-LD */
  faq: readonly ForFansOfFaq[];
};

export const forFansOfEntries = [
  {
    slug: "paramore",
    artist: "Paramore",
    hook: "Hooky, female-fronted, emotionally direct — built for the room, not the arena.",
    body: [
      "If Paramore's early discography is the entry point, The Filibusters will feel familiar before the first chorus lands. Both bands write to hook hard and play live like the room matters more than the recording. Where Paramore eventually scaled into arena-sized production, The Filibusters are still building the set for ~150-500 capacity rooms like Velour Live Music Gallery in Provo — closer to the listener, less polish, more direct.",
      "Hanna Eyre fronts the band the way Hayley Williams anchors Paramore: the vocal carries the song's emotional weight, and the writing stays openly vulnerable rather than ironic. Listeners who connect with Riot!-era Paramore or the rawer cuts off This Is Why will recognize the energy here.",
      "The difference is scale and polish, not intent. The Filibusters lean harder into the unpolished, present-tense feeling — a band you can still catch in a small Provo room before it grows."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Paramore?",
        answer:
          "Yes — both are female-fronted alt rock built on hooks and emotionally direct writing, with a frontwoman carrying the song. The Filibusters are earlier-stage and play smaller, sweatier rooms than Paramore plays today."
      },
      {
        question: "Where should a Paramore fan start with The Filibusters?",
        answer:
          "Start with \"Break Up With Your Boyfriend\" — the hook-forward, emotionally direct side that maps most closely to Paramore."
      }
    ]
  },
  {
    slug: "arctic-monkeys",
    artist: "Arctic Monkeys",
    hook: "Rhythmic guitar work and lyric attention — the emotional register without the ironic remove.",
    body: [
      "Arctic Monkeys fans land here for the rhythmic guitar work and the lyric attention. The contrast: Arctic Monkeys' writing reads like character sketches — specific, distanced, often funny. The Filibusters write in first person about the feeling itself, with less ironic remove. The instrumentation pulls from a similar palette — taut drums, melodic bass, guitars carrying the hook — but the songs sit closer to alt rock than to the dance-punk side of AM. If 'Do I Wanna Know' or the AM-era ballads are the connector, the live show is where The Filibusters will feel most familiar.",
      "Where Alex Turner turns the camera outward onto scenes and characters, Hanna Eyre keeps it turned inward — the song is about what it feels like to be in it, not a portrait of someone else. That's a real difference in register, but fans who want the guitar-first approach will find it here.",
      "The Filibusters play Velour and similar Provo rooms — the kind of 150-cap venue where Arctic Monkeys were playing before Whatever People Say I Am came out. If you want to catch a band in that early, close-quarters phase, this is it."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Arctic Monkeys?",
        answer:
          "Partially — the guitar-driven instrumentation and lyric attention overlap, but The Filibusters write more personally and directly than Arctic Monkeys' character-sketch style. Less irony, more first-person emotional writing."
      },
      {
        question: "What Utah bands sound like Arctic Monkeys?",
        answer:
          "The Filibusters are the closest match in the current Provo scene — guitar-forward alt rock with strong melodic hooks and a band that plays tight, energetic live sets."
      },
      {
        question: "Where should an Arctic Monkeys fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the taut, guitar-driven side that connects most directly to the AM sound."
      }
    ]
  },
  {
    slug: "the-1975",
    artist: "The 1975",
    hook: "Emotionally direct hooks and guitar-driven songs — without the genre pivots.",
    body: [
      "Listeners who like The 1975's earlier, guitar-forward material more than the later genre-hopping experiments will connect with The Filibusters quickly. The shared territory: emotionally direct writing, hooks built to stay, production that lets the song breathe. The contrast: The Filibusters are guitar-driven across the catalog without the synth/pop pivots, and the live show leans grittier — designed for sweatier rooms than The 1975 plays today. The lyric register is similar — vulnerable, specific, present-tense — but more focused on the moment than the cultural commentary that runs through The 1975's later records.",
      "Hanna Eyre's writing shares the confessional, emotionally intelligent quality that defines The 1975's best songs — the kind of lyric that sounds like it was written about something real and specific. The Filibusters don't dress it up in production layers; it's delivered guitar-first in a Provo room.",
      "If you've been following The 1975's trajectory and found yourself wishing they'd stayed closer to the Self-Titled or I Like It When You Sleep sound, The Filibusters are playing that lane."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like The 1975?",
        answer:
          "Yes, particularly the earlier guitar-forward material. Both prioritize emotionally direct, hook-driven writing. The Filibusters stay more consistently guitar-driven and skip the genre pivots."
      },
      {
        question: "Where should a 1975 fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — emotionally direct and hook-forward in a way that maps closely to the early 1975 sound."
      },
      {
        question: "What bands like The 1975 are from Utah?",
        answer:
          "The Filibusters from Provo are the closest active match — guitar-driven alt rock with emotionally direct writing and a tight live show at venues like Velour."
      }
    ]
  },
  {
    slug: "the-backseat-lovers",
    artist: "The Backseat Lovers",
    hook: "Same Utah scene, same earnest live-room DNA — louder and more direct.",
    body: [
      "If you found The Backseat Lovers through the Utah scene, The Filibusters are from the same world — another Provo, Utah band that built its following one live room at a time. The shared ground is regional roots and earnest, hook-driven songwriting. The contrast: The Backseat Lovers lean folk-tinged indie with jangly, anthemic builds like 'Kilby Girl,' while The Filibusters run louder and more direct, fronted by Hanna Eyre's vocals and built for smaller, sweatier rooms like Velour. If you like discovering Utah bands before they scale, this is the same lane a few steps earlier.",
      "Both bands have Provo in their bones — the scene, the venues, the kind of crowd that shows up to Velour on a Thursday. The Backseat Lovers are further along the trajectory; The Filibusters are at the stage where The Backseat Lovers were playing Kilby Court before 'Kilby Girl' landed.",
      "The difference in sound is real: The Backseat Lovers go anthemic and jangly, The Filibusters go harder and more direct. But fans of one will recognize the DNA in the other."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "What Utah bands sound like The Backseat Lovers?",
        answer:
          "The Filibusters are the closest active match — also from Provo, also built around the Utah live scene, with earnest hook-driven writing. The Filibusters run louder and more direct where The Backseat Lovers go folk-tinged and anthemic."
      },
      {
        question: "Are The Filibusters like The Backseat Lovers?",
        answer:
          "Yes in DNA — same Provo scene, same live-room-first approach, same earnest songwriting. Different in sound: The Filibusters are harder and more direct, The Backseat Lovers are more folk-tinged and jangly."
      },
      {
        question: "Where should a Backseat Lovers fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the hook-forward energy will feel familiar even if the guitar approach is louder."
      }
    ]
  },
  {
    slug: "wolf-alice",
    artist: "Wolf Alice",
    hook: "Female-fronted dynamics and emotional intensity — on the guitar-driven, live-room side.",
    body: [
      "Wolf Alice fans land here for the female-fronted dynamics — the swing from quiet to loud, the emotional intensity carried by the vocal. The shared territory: alt rock that uses contrast as a tool and a frontwoman who anchors the song. The contrast: Wolf Alice range across dream-pop, grunge, and shoegaze textures, while The Filibusters stay more consistently direct and hook-forward, with less studio atmosphere and more live-room grit. If the rawer, guitar-driven side of Wolf Alice is the draw, that's the side The Filibusters live on.",
      "Hanna Eyre carries the same kind of vocal weight that Ellie Rowsell brings to Wolf Alice's best songs — the performance is doing real emotional work, not just delivering a melody. The Filibusters don't have Wolf Alice's textural range, but they don't need it; the directness is the point.",
      "Catch them at Velour in Provo and the live show will make sense — a room that size is where that kind of frontwoman energy lands hardest."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Wolf Alice?",
        answer:
          "Partially — both are female-fronted alt rock with emotional intensity at the center. Wolf Alice range wider texturally; The Filibusters stay consistently guitar-driven and direct."
      },
      {
        question: "Where should a Wolf Alice fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the guitar-driven, emotionally direct side that most closely matches Wolf Alice's rawer material."
      },
      {
        question: "What bands like Wolf Alice play smaller venues?",
        answer:
          "The Filibusters play Velour Live Music Gallery in Provo and similar 150-500 capacity rooms — closer to the listener, same female-fronted intensity, more live-room energy."
      }
    ]
  },
  {
    slug: "beach-bunny",
    artist: "Beach Bunny",
    hook: "Confessional, hook-first, female-fronted — with more weight on the guitars and the room.",
    body: [
      "Beach Bunny fans will recognize the confessional, hook-first writing and the female-fronted energy. The shared ground: short, sharp songs about real feelings, delivered without ironic distance. The contrast: Beach Bunny's roots are in bedroom-pop and lo-fi indie before scaling up, while The Filibusters are built around the live room first — alt rock with more weight on the guitars and the room than on the bedroom-pop sheen. If 'Prom Queen'-style directness is the connector, the feeling is familiar; the delivery is louder.",
      "Both Hanna Eyre and Lili Trifilio write about the same emotional territory — relationships, self-worth, the feeling of things not quite working out — with the kind of honesty that doesn't hedge. The Filibusters just deliver it with a fuller band sound and more volume.",
      "Where Beach Bunny built up from a bedroom recording to a larger sound, The Filibusters started from the live room — the guitars and drums were always there. Same emotional register, different origin story."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Beach Bunny?",
        answer:
          "Yes in emotional register — confessional, hook-first, female-fronted writing with no ironic distance. The Filibusters are louder and more guitar-driven; Beach Bunny has more bedroom-pop softness."
      },
      {
        question: "Where should a Beach Bunny fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the direct, hook-forward, emotionally honest approach that maps closely to Beach Bunny's best songs."
      },
      {
        question: "What female-fronted indie bands are from Utah?",
        answer:
          "The Filibusters — fronted by Hanna Eyre (ex-The Voice Season 12) and based in Provo — are the most active female-fronted indie/alt rock act in the current Utah scene."
      }
    ]
  },
  {
    slug: "wallows",
    artist: "Wallows",
    hook: "Melodic indie-rock hooks and a present-tense point of view — pushed harder and more direct.",
    body: [
      "Wallows fans land here for melodic indie-rock hooks and a youthful, present-tense point of view. The shared territory: guitar-driven songs that stay catchy without losing feeling, and a fanbase that overlaps heavily with The 1975. The contrast: Wallows lean more laid-back and indie-pop in places, while The Filibusters push harder and more emotionally direct, with a live show built for closer, rowdier rooms. If the hookier, guitar-forward Wallows songs are the entry point, the connection is immediate.",
      "The Filibusters have the same energy of a band writing about things that are actually happening to them right now — no retrospective polish, no distance. Wallows have that too, but with more production sheen; The Filibusters are rawer.",
      "At Velour in Provo the show hits closer to the bone — 150-cap room, band a few feet away, songs that sound like they were written last week. That's where the Wallows comparison makes the most sense."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like Wallows?",
        answer:
          "Yes — melodic guitar-driven hooks, present-tense emotional writing, overlapping fanbase with The 1975. The Filibusters are rawer and more direct where Wallows go more laid-back indie-pop."
      },
      {
        question: "Where should a Wallows fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the hook-forward, guitar-driven side that connects most directly to Wallows."
      },
      {
        question: "What bands like Wallows are playing small venues right now?",
        answer:
          "The Filibusters are at Velour Live Music Gallery in Provo and similar small rooms — the stage where Wallows were before the algorithm found them."
      }
    ]
  },
  {
    slug: "pvris",
    artist: "PVRIS",
    hook: "Female-fronted alt-rock intensity — guitar-driven and rawer, built for live rooms.",
    body: [
      "PVRIS fans connect with The Filibusters through the female-fronted intensity and the emotionally charged alt-rock writing. The shared ground: a frontwoman carrying real weight, songs that hit on a feeling and don't soften it. The contrast: PVRIS lean atmospheric and electronic-tinged, while The Filibusters are guitar-driven and rawer, built for live rooms rather than a produced wall of sound. If the heavier, more direct PVRIS material is the draw, The Filibusters reach the same emotional register with less polish and more room noise.",
      "Hanna Eyre has the same kind of presence that Lynn Gunn brings to PVRIS — a vocalist who makes you feel like the song is specifically about something true. The Filibusters don't build atmosphere the way PVRIS does; they build directness instead.",
      "At Velour in Provo, the rawness is a feature. No production haze between the band and the room — just the guitars, the drums, and a frontwoman who can hold the room."
    ],
    recommendedTracks: ["Break Up With Your Boyfriend"],
    faq: [
      {
        question: "Are The Filibusters like PVRIS?",
        answer:
          "Partially — both are female-fronted alt rock with emotional intensity and a frontwoman doing real work. PVRIS are atmospheric and electronic-tinged; The Filibusters are guitar-driven and rawer."
      },
      {
        question: "Where should a PVRIS fan start with The Filibusters?",
        answer:
          "\"Break Up With Your Boyfriend\" — the direct, emotionally charged side that connects most closely to PVRIS's heavier material."
      },
      {
        question: "What female-fronted alt-rock bands play intimate venues?",
        answer:
          "The Filibusters play Velour Live Music Gallery in Provo — 150-500 cap, close quarters, fronted by Hanna Eyre with the same intensity PVRIS brings to larger rooms."
      }
    ]
  }
] as const satisfies readonly ForFansOfEntry[];

export const entryBySlug = (slug: string): ForFansOfEntry | undefined =>
  forFansOfEntries.find((entry) => entry.slug === slug);
