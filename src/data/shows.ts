import battleWinnerImage from "../assets/images/Battle of the band winner.jpg";

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
    body: [
      "The Filibusters bring a loud, emotionally direct live set to the BYU Marriott Center for Battle of the Bands 2026.",
      "Expect a high-energy room, crowd-sing moments, and a set built to feel immediate in person."
    ],
    lineup: ["The Filibusters"],
    notes: "Doors and event timing should be confirmed with the venue."
  }
] as const;
