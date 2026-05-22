# Off-site SEO submission packet

Paste-ready data for the three off-site identity signals Google uses to
disambiguate "The Filibusters" the band from the political filibuster and
the older Seattle punk band of the same name.

Do these in order — each one feeds the next.

---

## 1. MusicBrainz (do first)

1. Sign up at https://musicbrainz.org/register (use the band's Gmail).
2. Confirm email, then click **"Add Artist"** at https://musicbrainz.org/artist/create.
3. Paste these fields:

| Field | Value |
|---|---|
| Name | `The Filibusters` |
| Sort name | `Filibusters, The` |
| Disambiguation | `Provo, Utah alt rock band, founded 2024` |
| Type | `Group` |
| Gender | (leave blank — Group has no gender) |
| Area | `Provo, Utah, United States` |
| Begin area | `Provo, Utah, United States` |
| Begin date | `2024` |
| End date | (leave blank — still active) |

4. Under **External links / URLs**, add all of these (one per row, select the matching link type):

| Link type | URL |
|---|---|
| Official homepage | `https://www.thefilibustersband.com` |
| Streaming music (Spotify) | `https://open.spotify.com/artist/4Mf8AkUvGERBfOkG8ozuDl` |
| Streaming music (Apple Music) | `https://music.apple.com/us/artist/the-filibusters/1550597371` |
| YouTube channel | `https://www.youtube.com/@TheFilibustersband` |
| Social network (Instagram) | `https://www.instagram.com/thefilibustersband` |
| Social network (TikTok) | `https://www.tiktok.com/@thefilibustersband` |

5. **Edit note**: paste this so reviewers approve quickly:
   > Adding The Filibusters, a Provo, Utah alt rock band founded in 2024. Source: official band website (https://www.thefilibustersband.com) and the linked streaming profiles, which all match this group. Distinct from the older Seattle punk band by the same name.

6. Submit. MusicBrainz applies a voting/auto-edit period — most adds go live within 24 hours.

### Then add each member as a separate Artist

For each member, click **Add Artist** again and use:

| Field | Hanna Eyre | Thomas Wintch | Atticus Wintch | Curtis Schnitzer |
|---|---|---|---|---|
| Name | `Hanna Eyre` | `Thomas Wintch` | `Atticus Wintch` | `Curtis Schnitzer` |
| Sort name | `Eyre, Hanna` | `Wintch, Thomas` | `Wintch, Atticus` | `Schnitzer, Curtis` |
| Disambiguation | `vocalist of The Filibusters` | `guitarist of The Filibusters` | `bassist of The Filibusters` | `drummer of The Filibusters` |
| Type | `Person` | `Person` | `Person` | `Person` |
| Area | `Provo, Utah, United States` | `Provo, Utah, United States` | `Provo, Utah, United States` | `Provo, Utah, United States` |

7. After creating each member, open their page → **Edit → Add relationship → Performance → member of band** → link to The Filibusters with instrument (Vocals / Guitar / Bass / Drums).

### Then add the release

For `Break Up With Your Boyfriend`:
1. Go to The Filibusters' artist page → **"Add a new release"**
2. Title: `Break Up With Your Boyfriend`
3. Release group type: `Single`
4. Release date: (whatever the Spotify/Apple Music release date shows)
5. Artist credit: `The Filibusters`
6. Add the Spotify track URL under External links.

**After everything is approved, copy the MusicBrainz artist ID (MBID).** It's the UUID in the URL, e.g. `https://musicbrainz.org/artist/abcdef12-3456-7890-abcd-ef1234567890` — copy the UUID. You'll paste it into Wikidata next.

---

## 2. Wikidata (after MusicBrainz)

Wikidata is the structured-data layer Google uses for Knowledge Panels.
The fastest way to create an item is via **QuickStatements**:
https://quickstatements.toolforge.org

1. Log in to Wikidata at https://www.wikidata.org (same Gmail or a new account).
2. Open https://quickstatements.toolforge.org → click **"New batch"** → **"v1 commands"**.
3. Replace `<YOUR_MBID>` below with the MusicBrainz artist ID you copied, then paste the entire block into QuickStatements:

```
CREATE
LAST	Len	"The Filibusters"
LAST	Den	"American alt rock band from Provo, Utah"
LAST	Aen	"Filibusters"
LAST	Aen	"The Filibusters band"
LAST	P31	Q215380
LAST	P495	Q30
LAST	P740	Q49255
LAST	P571	+2024-00-00T00:00:00Z/9
LAST	P136	Q484641
LAST	P136	Q484690
LAST	P856	"https://www.thefilibustersband.com"
LAST	P434	"<YOUR_MBID>"
LAST	P1902	"4Mf8AkUvGERBfOkG8ozuDl"
LAST	P2850	"1550597371"
LAST	P2397	"TheFilibustersband"
LAST	P2003	"thefilibustersband"
```

What each line means (for reference, you don't paste these):
- `CREATE` — make a new Wikidata item
- `Len "..."` — English label
- `Den "..."` — English description
- `Aen "..."` — English alias (alternate name)
- `P31 Q215380` — instance of: musical group
- `P495 Q30` — country of origin: United States
- `P740 Q49255` — location of formation: Provo
- `P571 +2024-...` — inception: 2024 (the `/9` means year-precision)
- `P136 Q484641 / Q484690` — genre: alternative rock + indie rock
- `P856` — official website
- `P434` — MusicBrainz artist ID
- `P1902` — Spotify artist ID
- `P2850` — Apple Music artist ID
- `P2397` — YouTube channel ID
- `P2003` — Instagram username

4. Click **"Import V1 commands"** → review → **"Run"**. Wikidata creates the item and you get back a Q-number (e.g. `Q123456789`).

5. **Add the band members** as separate items the same way (one batch each, no `MBID` line unless you've also created MB entries for them). Then link each member to the band:

```
LAST	P463	Q<band-Q-number>
```

(`P463` = member of)

6. Patrollers review batches — most propagate within minutes. Google indexes Wikidata changes within a few days to a few weeks.

---

## 3. Google Knowledge Panel claim (after #1 and #2)

After MusicBrainz + Wikidata are live and Google has had ~2-6 weeks to index
them, a Knowledge Panel will start appearing in branded SERPs.

1. Sign in to Google with the band's Gmail (`filibustersband@gmail.com`).
2. Search `The Filibusters band` on Google.
3. If a panel shows on the right side (desktop) or at the top (mobile), scroll to its bottom. Look for **"Claim this knowledge panel"** (sometimes "Suggest an edit").
4. Click it → verify ownership. Google offers verification via:
   - Official YouTube channel (easiest if you're signed in to the band's Google account)
   - Posting a verification code on the official website
   - Official Twitter/X account (if you have one)
5. Once verified, you get a claimed panel — you can post panel updates, edit facts, and the panel anchors at the top of every branded search.

If no panel appears yet, wait. Keep MusicBrainz and Wikidata up to date (e.g.,
add new releases, update members), and the panel will spawn once Google has
enough confirming signals.

---

## 4. Bonus channels (low effort, more `sameAs` signal)

After the core three are done, add the band to:

- **Bandcamp** (free) → adds another `sameAs` link
- **Songkick** (free, for shows) → live performance verification + listing in their event API
- **Last.fm** → genre community / scrobble surfacing
- **Genius** (lyrics) → adds a lyrics surface and another `sameAs` for AI search

When you create any of these, add the profile URL to `src/data/site.ts` →
`socialLinks` array (with appropriate `category`) and the schema picks it up
automatically — comment at `src/data/site.ts:450` already documents this.

---

## Verification after submission

After MusicBrainz and Wikidata are live:

```bash
# Confirm MusicBrainz entry exists (replace MBID)
curl -s "https://musicbrainz.org/ws/2/artist/<YOUR_MBID>?fmt=json" | jq '.name, .country, .["life-span"]'

# Confirm Wikidata item exists (replace Q-number)
curl -s "https://www.wikidata.org/wiki/Special:EntityData/Q<NUMBER>.json" | jq '.entities | keys'

# Confirm the site's MusicGroup schema is still clean
curl -s "https://www.thefilibustersband.com/" | grep -o '"@type":"MusicGroup"' | head -1
```

Search `The Filibusters band` weekly for the first month — Knowledge Panel emergence is the signal you've crossed the entity-recognition threshold.

---

## Source of truth for the data above

All values were pulled from this codebase:

- Band name, members, founding year, location → `src/data/about.ts` and `src/data/site.ts`
- Spotify / Apple Music / YouTube / Instagram / TikTok URLs → `src/data/site.ts` `socialLinks`
- Email contact → `siteMeta.contactEmail` in `src/data/site.ts`
- Disambiguation language → `MusicGroup.disambiguatingDescription` in the built schema

If band facts change (new member, lineup change, label, new genre), update
the canonical source in `src/data/site.ts` / `src/data/about.ts`, then push
the same edits to MusicBrainz and Wikidata to keep the entity graph in sync.
