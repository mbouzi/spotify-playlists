import { generateRandomString, generateCodeChallenge } from './utils';

export const authEndpoint = "https://accounts.spotify.com/authorize";
export const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
export const clientId = process.env.SPOTIFY_CLIENT_ID!;

const scopes = [
  "streaming",
  "user-modify-playback-state",
  "user-library-modify",
  "app-remote-control",
  'playlist-modify-public',
  'user-read-playback-state',
  'user-read-currently-playing',
  "user-read-email",
  "user-read-private",
  "playlist-modify-private"
];

// Generate PKCE code verifier and challenge
export const codeVerifier = generateRandomString(128);
export const codeChallengePromise = generateCodeChallenge(codeVerifier);

export const getLoginUrl = async () => {
  const codeChallenge = await codeChallengePromise;

  return `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`;
};


export const getCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code'); // this is what you'll exchange for access token
}

export const fetchAccessToken = async (code: string) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!res.ok) throw new Error('Failed to fetch access token');

  const data = await res.json();
  return data; // contains access_token, refresh_token, expires_in
};

