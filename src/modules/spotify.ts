
export const authEndpoint = process.env.SPOTIFY_AUTH_ENDPOINT;

export const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

export const clientId = process.env.SPOTIFY_CLIENT_ID;

const scopes  = [
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
]

export const loginUrl = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`;

export const getTokenFromUrl = (): any => {

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