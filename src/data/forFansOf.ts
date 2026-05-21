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
  }
] as const;
