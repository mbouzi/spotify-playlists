
export type SpotifyAlbum = Spotify.Album;

export type SpotifyArtist = SpotifyApi.ArtistObjectSimplified;

export type SpotifyDevice = SpotifyApi.UserDevice;

export type SpotifyPlaylist = SpotifyApi.PlaylistObjectFull;

export type SpotifySong = Spotify.Track;

export type SpotifyPlaylistSong = SpotifyApi.PlaylistTrackObject;

export type SpotifyUser = SpotifyApi.UserObjectPublic;




export interface ISpotifyPlayOptions {
    context_uri?: string;
    deviceId: string;
    offset?: number;
    uris: string[];
}


export interface IUser {
    display_name: string;
    followers: any;
    href: string;
    id: string;
    images: any[];
    type: string;
    uri: string;
}
