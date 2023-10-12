
export const authEndpoint = process.env.SPOTIFY_AUTH_ENDPOINT;

export const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

export const clientId = process.env.SPOTIFY_CLIENT_ID;

const scopes  = [
  ""
]

export const loginUrl = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`;

export const getTokenFromUrl = (): any => {
  console.log("WNDOW:", clientId, window.location.hash, process.env)
  console.log("HIT:", authEndpoint, redirectUri, clientId);

  const tokenObj: any = {};

  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      const parts = typeof initial == 'string' ? initial.split("=") : item.split("=");
      tokenObj[parts[0]] = decodeURIComponent(parts[1]);
      return tokenObj;
    })
}