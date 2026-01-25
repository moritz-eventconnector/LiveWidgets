import tmi from 'tmi.js';

export function createTwitchBot({
  username,
  oauthToken,
  channels
}: {
  username: string;
  oauthToken: string;
  channels: string[];
}) {
  const client = new tmi.Client({
    options: { debug: false },
    identity: {
      username,
      password: oauthToken
    },
    channels
  });

  return client;
}
