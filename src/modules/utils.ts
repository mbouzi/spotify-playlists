// import { SpotifyPlaylistSong, SpotifySong } from "@/types";

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString([], options);
};

export const msToTime = (duration: number | undefined): string | React.ReactNode => {
  if (duration) {
    let seconds: string | number = Math.floor((duration / 1000) % 60),
      minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);

    minutes = ((minutes < 10) ? "0" + minutes : minutes);
    seconds = ((seconds < 10) ? "0" + seconds : seconds);

    return minutes + ":" + seconds;
  }
};

const shortenLogic = (text: string): string => {
  if (text.length > 20) return text.slice(0, 25) + ' ...';

  return text;
};


export const shortenText = (data: any): string => {


  if (data.artists) {
    let artistText = '';
    const artists = data.artists;

    for (let i = 0; i < artists.length; i++) {
      if (artists.length === 1 || i === artists.length - 1) {
        artistText += artists[i].name + ' ';
      } else {
        artistText += artists[i].name + ', ';
      }
    }

    return shortenLogic(artistText);
  } else {
    return shortenLogic(data);
  }
};

// pkceUtils.ts
export const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const base64encode = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64encode(digest);
};
