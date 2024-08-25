const checkImageFormat = (url: string) => {
  if (url.endsWith(".svg")) {
    return "svg";
  } else if (url.endsWith(".png")) {
    return "png";
  } else {
    return "unknown";
  }
};
export { checkImageFormat }
