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

export const getLoginUrl = async () => {
  // Generate a new code verifier and store it
  const codeVerifier = generateRandomString(128);
  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`;
};


export const getCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code'); // this is what you'll exchange for access token
}

export const fetchAccessToken = async (code: string) => {
  // Retrieve the code verifier that was stored during login
  const codeVerifier = localStorage.getItem('spotify_code_verifier');

  if (!codeVerifier) {
    throw new Error('No code verifier found. Please log in again.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  console.log("Exchanging code for token", { code, redirectUri, clientId, codeVerifier: codeVerifier.substring(0, 10) + '...' });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Spotify token error:', errorData);
    throw new Error(`Failed to fetch access token: ${errorData.error_description || errorData.error}`);
  }

  const data = await res.json();

  // Clean up the code verifier after successful exchange
  localStorage.removeItem('spotify_code_verifier');

  return data; // contains access_token, refresh_token, expires_in
};