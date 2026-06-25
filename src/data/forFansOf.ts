export type ForFansOfEntry = {
  artist: string;
  contrastParagraph: string;
  recommendedTracks: readonly string[];
};

export const forFansOfEntries: readonly ForFansOfEntry[] = [
  {
    artist: "Paramore",
    contrastParagraph:
      "If Paramore's early discography is the entry point, The Filibusters will feel familiar before the first chorus lands. Both bands write to hook hard and play live like the room matters more than the recording. Where Paramore eventually scaled into arena-sized production, The Filibusters are still building the set for ~150-500 capacity rooms like Velour Live Music Gallery in Provo — closer to the listener, less polish, more direct. Listeners who connect with Riot!-era Paramore or the rawer cuts off This Is Why will recognize the energy here, with lyric writing that leans more openly emotional and less narrative.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "Arctic Monkeys",
    contrastParagraph:
      "Arctic Monkeys fans land here for the rhythmic guitar work and the lyric attention. The contrast: Arctic Monkeys' writing reads like character sketches — specific, distanced, often funny. The Filibusters write in first person about the feeling itself, with less ironic remove. The instrumentation pulls from a similar palette — taut drums, melodic bass, guitars carrying the hook — but the songs sit closer to alt rock than to the dance-punk side of AM. If 'Do I Wanna Know' or the AM-era ballads are the connector, the live show is where The Filibusters will feel most familiar.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "The 1975",
    contrastParagraph:
      "Listeners who like The 1975's earlier, guitar-forward material more than the later genre-hopping experiments will connect with The Filibusters quickly. The shared territory: emotionally direct writing, hooks built to stay, production that lets the song breathe. The contrast: The Filibusters are guitar-driven across the catalog without the synth/pop pivots, and the live show leans grittier — designed for sweatier rooms than The 1975 plays today. The lyric register is similar — vulnerable, specific, present-tense — but more focused on the moment than the cultural commentary that runs through The 1975's later records.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "The Backseat Lovers",
    contrastParagraph:
      "If you found The Backseat Lovers through the Utah scene, The Filibusters are from the same world — another Provo, Utah band that built its following one live room at a time. The shared ground is regional roots and earnest, hook-driven songwriting. The contrast: The Backseat Lovers lean folk-tinged indie with jangly, anthemic builds like 'Kilby Girl,' while The Filibusters run louder and more direct, fronted by Hanna Eyre's vocals and built for smaller, sweatier rooms like Velour. If you like discovering Utah bands before they scale, this is the same lane a few steps earlier.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "Wolf Alice",
    contrastParagraph:
      "Wolf Alice fans land here for the female-fronted dynamics — the swing from quiet to loud, the emotional intensity carried by the vocal. The shared territory: alt rock that uses contrast as a tool and a frontwoman who anchors the song. The contrast: Wolf Alice range across dream-pop, grunge, and shoegaze textures, while The Filibusters stay more consistently direct and hook-forward, with less studio atmosphere and more live-room grit. If the rawer, guitar-driven side of Wolf Alice is the draw, that's the side The Filibusters live on.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "Beach Bunny",
    contrastParagraph:
      "Beach Bunny fans will recognize the confessional, hook-first writing and the female-fronted energy. The shared ground: short, sharp songs about real feelings, delivered without ironic distance. The contrast: Beach Bunny's roots are in bedroom-pop and lo-fi indie before scaling up, while The Filibusters are built around the live room first — alt rock with more weight on the guitars and the room than on the bedroom-pop sheen. If 'Prom Queen'-style directness is the connector, the feeling is familiar; the delivery is louder.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "Wallows",
    contrastParagraph:
      "Wallows fans land here for melodic indie-rock hooks and a youthful, present-tense point of view. The shared territory: guitar-driven songs that stay catchy without losing feeling, and a fanbase that overlaps heavily with The 1975. The contrast: Wallows lean more laid-back and indie-pop in places, while The Filibusters push harder and more emotionally direct, with a live show built for closer, rowdier rooms. If the hookier, guitar-forward Wallows songs are the entry point, the connection is immediate.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  },
  {
    artist: "PVRIS",
    contrastParagraph:
      "PVRIS fans connect with The Filibusters through the female-fronted intensity and the emotionally charged alt-rock writing. The shared ground: a frontwoman carrying real weight, songs that hit on a feeling and don't soften it. The contrast: PVRIS lean atmospheric and electronic-tinged, while The Filibusters are guitar-driven and rawer, built for live rooms rather than a produced wall of sound. If the heavier, more direct PVRIS material is the draw, The Filibusters reach the same emotional register with less polish and more room noise.",
    recommendedTracks: ["Break Up With Your Boyfriend"]
  }
] as const;
