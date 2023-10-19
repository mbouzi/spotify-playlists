'use client';
import React, { useEffect, useReducer, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { ColorExtractor } from 'react-color-extractor';
import Link from 'next/link';

import { getTokenFromUrl, loginUrl } from '@/modules/spotify';
import { SpotifyPlaylist, SpotifyUser } from '@/types/spotify';

import { AppContext, AppContextType } from '@/context/appContext';

import Sidebar from '@/components/Sidebar';
import SongTable from '@/components/SongTable';
import SongPlayer from '@/components/SongPlayer';

config.autoAddCss = false;

const spotify = new SpotifyWebApi();

const initialState = {
    spotifyToken: '',
    user: null,
    playlists: [],
    bgColor: '',
    filter: ''
}

type ACTIONTYPE = 
    | { type: "spotifyToken", payload: string}
    | { type: "user", payload: SpotifyUser | null}
    | { type: "playlists", payload: SpotifyPlaylist[]}
    | { type: "bgColor", payload: string}
    | { type: "filter", payload: string}
    | { type: "set_multiple", payload: any}
;

function reducer(state: typeof initialState, action: ACTIONTYPE): typeof initialState {
    const { type, payload } = action;

    switch (type) {
        case "set_multiple":
            return {...state, ...payload };
        case type:
            return {...state, [type]: payload};
        default:
            return state;
    }
}

const loginModal = () => {

    return (
        <div className="text-center w-full text-black">
            <div className="relative top-[40%]">
                <Link className="rounded-full bg-[var(--spotify-green)] p-5 hover:opacity-60" href={loginUrl}>
                    <FontAwesomeIcon className="relative top-1" size="2x" icon={faSpotify} />
                    <span className="ml-2">Sign in with Spotify!</span>
                </Link>
            </div>
        </div>
    );
};

const Home = () => {
    const [state, dispatch] = useReducer<React.Reducer <any, any>>(reducer, initialState);

    const { user, spotifyToken, bgColor, playlists } = state;
    const { playingSong, currentPlaylist, setCurrentPlaylist } = useContext(AppContext) as AppContextType;

    const renderUserInfo = (): React.ReactNode => {

        if(user && currentPlaylist) {
            return (
                <div className="flex absolute items-center bottom-0">
                    <div
                        className="w-6 h-6 rounded-full"
                        style={{ background: `url(${user.images[0]?.url})`, backgroundSize: 'cover' }}
                    ></div>
                    <p className="whitespace-nowrap font-bold text-sm ml-2">{user.display_name}</p>
                    <p className="ml-2">•</p>
                    {currentPlaylist && currentPlaylist.tracks && (
                        <p className="whitespace-nowrap text-sm ml-2">{currentPlaylist.tracks.total} songs</p>
                    )}
                </div>
            );
        }
    };

    const renderPlaylistInfo = (): React.ReactNode => {
        const playlistImage = currentPlaylist?.images[0]?.url;

        return (
            <div className={`flex rounded-xl p-5 pb-10`}>
                {playlistImage && (
                    <ColorExtractor getColors={(colors: string[]) => dispatch({ type: 'bgColor', payload: colors[0]})}>
                        <img className="w-40" src={playlistImage || currentPlaylist?.images[0]?.url} />
                    </ColorExtractor>
                )}
                {currentPlaylist && (
                    <div className="flex column items-center relative ml-3">
                        <p className="absolute top-8 text-xs text-[#fff99]">Playlist</p>
                        <p className="leading[2.7rem] text-5xl font-bold">{currentPlaylist.name}</p>
                        {currentPlaylist.description && (
                            <p className="absolute leading-3 text-xs text-[#fff99] bottom-7 mb-1">
                                {currentPlaylist.description}
                            </p>
                        )}
                        {user && user.images && renderUserInfo()}
                    </div>
                )}
            </div>
        )
    }

    useEffect(() => {
        let fetched: boolean = false;

        if (!fetched) {
            const _spotifyToken: string = getTokenFromUrl().access_token;

            const fetchData = async (userId: string) => {
                spotify.getUserPlaylists(userId).then((data: any) => {
                    const fetchedPlaylists: SpotifyPlaylist[] = data?.items;
                    setCurrentPlaylist(fetchedPlaylists[0])
                    dispatch({ type: "set_multiple", payload: {playlists: fetchedPlaylists }})
                })
                .catch((err) => console.log('ERR:', err));
            };

            if (_spotifyToken) {
                dispatch({type: "spotifyToken", payload: _spotifyToken});
                spotify.setAccessToken(_spotifyToken);

                spotify.getMe().then((user: SpotifyUser) => {
                    fetchData(user.id);
                    dispatch({type: "user", payload: user});
                    fetched = true;
                });
            }
        }
    }, [state.spotifyToken]);

    return (
        <div className="relative min-h-screen flex overflow-hidden">
            {!user && loginModal()}

            {user && (
                <Sidebar 
                     playlists={playlists} 
                     setNewPlaylist={(playlist: SpotifyPlaylist) => setCurrentPlaylist(playlist)} 
                />
            
            )}

            {user && (
                <main
                    style={{ background: bgColor }}
                    className="h-[100%] rounded-lg flex-1 min-w-0 overflow-auto m-4 ml-0"
                >
                    {currentPlaylist && renderPlaylistInfo()}
                    {currentPlaylist && (
                        <SongTable
                            spotifyToken={spotifyToken}
                        />
                    )}
                </main>
            )}
            {playingSong && <SongPlayer />}
        </div>
    );
};

export default Home;
