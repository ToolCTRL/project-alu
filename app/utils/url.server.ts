export const getBaseURL = (request: Request, options?: { https?: boolean }) => {
  const url = new URL(request.url);
  if (process.env.NODE_ENV === "development") {
    return `http://${url.host}`;
  }
  if (options?.https || process.env.NODE_ENV === "production") {
    return `https://${url.host}`;
  }
  return `${url.protocol}//${url.host}`;
};

export const getDomainName = (request: Request) => {
  const url = new URL(request.url);
  return url.host;
};

export const getWebhooksUrl = (request: Request) => {
  if (process.env.WEBHOOKS_URL) {
    return process.env.WEBHOOKS_URL;
  } else {
    return getBaseURL(request);
  }
};
