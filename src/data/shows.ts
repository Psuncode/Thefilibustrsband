import battleWinnerImage from "../assets/images/Battle of the band winner.jpg";
import utahArtFestivalImage from "../assets/images/Utah Art Festival 2026.png";
import devotionalUnforumImage from "../assets/Devotional Unforum.png";

export const upcomingShows = [
  {
    title: "BYU Battle of the Bands 2026",
    slug: "byu-battle-of-the-bands-2026",
    status: "announced",
    startsAt: "2026-03-28T19:00:00-06:00",
    venue: "BYU Marriott Center",
    city: "Provo",
    state: "Utah",
    ticketUrl: "https://sclcenter.byu.edu/battle-of-the-bands",
    flyerUrl: battleWinnerImage.src,
    summary: "The Filibusters take the stage at BYU Battle of the Bands 2026.",
    country: "US",
    body: [
      "The Filibusters bring a loud, emotionally direct live set to the BYU Marriott Center for Battle of the Bands 2026.",
      "Expect a high-energy room, crowd-sing moments, and a set built to feel immediate in person."
    ],
    lineup: ["The Filibusters"],
    notes: "Doors and event timing should be confirmed with the venue.",
    seoDescription:
      "The Filibusters perform at BYU Battle of the Bands 2026 at the BYU Marriott Center in Provo, Utah."
  },
  {
    title: "Devotional: Unforum",
    slug: "devotional-unforum-2026-04-14",
    status: "announced",
    startsAt: "2026-04-14T11:05:00-06:00",
    endsAt: "2026-04-14T12:00:00-06:00",
    venue: "Marriott Center",
    city: "Provo",
    state: "Utah",
    ticketUrl: "https://calendar.byu.edu/devotionals-forums/devotional-unforum-2026-04-14",
    flyerUrl: devotionalUnforumImage.src,
    summary: "The Filibusters appear at BYU's Devotional: Unforum on Tuesday, April 14.",
    country: "US",
    body: [
      "The Filibusters are part of BYU's Devotional: Unforum at the Marriott Center on Tuesday, April 14 from 11:05 AM to 12:00 PM.",
      "Unforum is described by BYU as a student-centered year in review celebrating student successes, performances, service, and achievements."
    ],
    lineup: ["The Filibusters"],
    notes: "Event details are based on the BYU Events Calendar listing and should be confirmed with BYU before attending.",
    seoDescription:
      "The Filibusters appear during BYU's Devotional: Unforum on April 14, 2026 at the Marriott Center in Provo, Utah."
  },
  {
    title: "Utah Arts Festival 2026",
    slug: "utah-arts-festival-2026",
    status: "announced",
    startsAt: "2026-06-20T21:30:00-06:00",
    venue: "Festival Stage",
    city: "Salt Lake City",
    state: "Utah",
    ticketUrl: "https://www.uaf.org/tix",
    flyerUrl: utahArtFestivalImage.src,
    summary: "The Filibusters appear at the Utah Arts Festival on Saturday, June 20, ahead of headliner Shakey Graves.",
    country: "US",
    body: [
      "The Filibusters play the Utah Arts Festival on Saturday, June 20 at 9:30 PM on the Festival Stage.",
      "That night features Shakey Graves as the headliner, bringing his Americana, rock and roll, folk, and blues-driven live show to the festival.",
      "For full festival details, schedule updates, and planning info, learn more at https://www.uaf.org/."
    ],
    lineup: ["The Filibusters", "Shakey Graves"],
    notes: "Set timing, festival access, and ticket details should be confirmed directly with the Utah Arts Festival.",
    seoDescription:
      "The Filibusters play the Utah Arts Festival on June 20, 2026 at the Festival Stage in Salt Lake City, Utah, ahead of Shakey Graves."
  }
] as const;
