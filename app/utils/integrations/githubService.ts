export async function getGitHubAccessToken(code: string) {
  const body = new URLSearchParams({
    client_id: process?.env.GITHUB_OAUTH_CLIENT_ID ?? "",
    client_secret: process?.env.GITHUB_OAUTH_CLIENT_SECRET ?? "",
    code: code,
  });
  try {
    const res = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: body,
    });
    const { access_token, error_description } = await res.json();
    if (error_description) {
      throw new Error(error_description);
    }
    return access_token;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("GITHUB ERROR: ", e);
    throw new Error("Could not retrieve access token.");
  }
}

export interface GitHubProfile {
  id: string;
  displayName: string;
  name: string;
  email: string;
  company: string;
  avatarURL?: string;
}

export async function getGitHubUserProfile(accessToken: string): Promise<GitHubProfile> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${accessToken}`,
    },
  });
  const userData = await response.json();
  const email = await getGitHubUserPrimaryEmail(accessToken);

  let profile: GitHubProfile = {
    id: userData.id.toString(),
    displayName: userData.login,
    name: userData.name,
    email: email,
    company: userData.company,
    avatarURL: userData.avatar_url,
  };

  return profile;
}

type GitHubUserEmailsResponse = {
  email: string;
  verified: boolean;
  primary: boolean;
}[];
async function getGitHubUserPrimaryEmail(accessToken: string): Promise<string> {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${accessToken}`,
    },
  });
  const data = (await response.json()) as GitHubUserEmailsResponse;
  for (const emailInfo of data) {
    if (emailInfo.primary && emailInfo.verified) {
      return emailInfo.email;
    }
  }
  throw new Error("Couldn't find GitHub user's email, please make sure it's verified.");
}
