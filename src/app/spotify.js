
export const authEndpoint = process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT;

export const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

export const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

const scopes  = [
  ""
]

export const loginUrl = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`;

export const getTokenFromUrl = () => {
  console.log("WNDOW:", window.location.hash)
  let tokenObj = {};

  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = typeof initial == 'string' ? initial.split("=") : item.split("=");
      tokenObj[parts[0]] = decodeURIComponent(parts[1]);
      return tokenObj;
    })
}