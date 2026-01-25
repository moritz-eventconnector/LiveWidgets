export type TwitchProfile = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url?: string;
};

export async function fetchTwitchProfile(accessToken: string) {
  const response = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID ?? ''
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Twitch profile');
  }

  const data = (await response.json()) as { data: TwitchProfile[] };
  return data.data[0];
}
