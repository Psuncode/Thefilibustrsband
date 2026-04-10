const buildTrackedEvent = (eventName, dataset) => {
  if (!eventName) {
    return null;
  }

  const properties = {};

  if (dataset.trackSource) {
    properties.source = dataset.trackSource;
  }

  if (dataset.trackLabel) {
    properties.label = dataset.trackLabel;
  }

  return {
    eventName,
    properties
  };
};

export const getTrackedClickEvent = (dataset = {}) => {
  return buildTrackedEvent(dataset.trackEvent, dataset);
};

export const getTrackedLinkEvent = (dataset = {}) => {
  if (dataset.trackMusicPlatform && dataset.trackMusicLocation) {
    return {
      eventName: "outbound_music_click",
      properties: {
        location: dataset.trackMusicLocation,
        platform: dataset.trackMusicPlatform
      }
    };
  }

  return buildTrackedEvent(dataset.trackEvent, dataset);
};

export const getTrackedFormEvent = (dataset = {}) => {
  return buildTrackedEvent(dataset.trackEvent, dataset);
};
