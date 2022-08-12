export const isIframe = () => {
  return window.location !== window.parent.location;
};

export const isUrl = (url: string): boolean => {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch (e) {
    return false;
  }
  return /https?/.test(urlObj.protocol);
};
