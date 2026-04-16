const getShowBoundary = (show) => {
  return new Date(show.endsAt || show.startsAt);
};

export const isPastShow = (show, referenceDate = new Date()) => {
  return getShowBoundary(show) < referenceDate;
};

export const partitionShowsByDate = (shows, referenceDate = new Date()) => {
  const upcoming = [];
  const past = [];

  for (const show of shows) {
    if (isPastShow(show, referenceDate)) {
      past.push(show);
      continue;
    }

    upcoming.push(show);
  }

  upcoming.sort((left, right) => new Date(left.startsAt) - new Date(right.startsAt));
  past.sort((left, right) => new Date(right.startsAt) - new Date(left.startsAt));

  return { upcoming, past };
};
