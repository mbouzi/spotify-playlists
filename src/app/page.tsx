'use client';
import React, { useEffect, useReducer, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { ColorExtractor } from 'react-color-extractor';
import WindowSizeListener, { WindowSize } from 'react-window-size-listener';

import { AppContext, AppContextType } from '@/context/appContext';

import Sidebar from '@/components/Sidebar';
import SongTable from '@/components/SongTable';
import SongPlayer from '@/components/SongPlayer';

import { getCodeFromUrl, getLoginUrl, fetchAccessToken } from '@/modules/spotify';
import { SpotifyPlaylist, SpotifyUser } from '@/types/spotify';

config.autoAddCss = false;

const spotify = new SpotifyWebApi();

const initialState = {
    spotifyToken: '',
    user: null,
    playlists: [],
    bgColor: '',
    filter: '',
    sidebarCollapsed: false,
    listView: true,
};

type ACTIONTYPE =
    | { type: 'spotifyToken'; payload: string }
    | { type: 'user'; payload: SpotifyUser | null }
    | { type: 'playlists'; payload: SpotifyPlaylist[] }
    | { type: 'bgColor'; payload: string }
    | { type: 'filter'; payload: string }
    | { type: 'sidebarCollapsed'; payload: boolean }
    | { type: 'listView'; payload: boolean }
    | { type: 'set_multiple'; payload: any };

function reducer(state: typeof initialState, action: ACTIONTYPE): typeof initialState {
    const { type, payload } = action;

    switch (type) {
        case 'set_multiple':
            return { ...state, ...payload };
        case type:
            return { ...state, [type]: payload };
        default:
            return state;
    }
}

const loginModal = () => {
    const handleLogin = async () => {
        const loginUrl = await getLoginUrl();
        window.location.href = loginUrl;
    };

    return (
        <div className="text-center w-full text-black">
            <div className="relative top-[40%]">
                <button
                    className="rounded-full bg-[var(--spotify-green)] pt-3 p-5 hover:opacity-60"
                    onClick={handleLogin}
                >
                    <FontAwesomeIcon className="relative top-1" size="2x" icon={faSpotify} />
                    <span className="ml-2">Sign in with Spotify!</span>
                </button>
            </div>
        </div>
    );
};

const Home = () => {
    const [state, dispatch] = useReducer<React.Reducer<any, any>>(reducer, initialState);

    const { user, spotifyToken, bgColor, playlists, sidebarCollapsed, listView } = state;
    const { playingSong, currentPlaylist, setCurrentPlaylist, setWindowSize, isMobile } = useContext(
        AppContext,
    ) as AppContextType;
    // const router = useRouter();
    const showSidebar = (user && !isMobile) || (user && listView && isMobile),
        showPlaylist = (user && currentPlaylist && !isMobile) || (user && isMobile && !listView);

    const renderUserInfo = (): React.ReactNode => {
        if (user && currentPlaylist) {
            return (
                <div className={`flex absolute items-center ${isMobile ? 'top-11' : ''} bottom-0`}>
                    <div
                        className="w-6 h-6 rounded-full"
                        style={{ background: `url(${user.images[0]?.url})`, backgroundSize: 'cover' }}
                    ></div>
                    <p className="font-bold text-sm ml-2 whitespace-nowrap">{user.display_name}</p>
                    <p className="ml-2">•</p>
                    {currentPlaylist && currentPlaylist.tracks && (
                        <p className="text-sm ml-2 whitespace-nowrap">{currentPlaylist.tracks.total} songs</p>
                    )}
                </div>
            );
        }
    };

    const renderPlaylistInfo = (): React.ReactNode => {
        const playlistImage = currentPlaylist?.images[0]?.url;

        return (
            <div className={`flex ${isMobile ? 'flex-col p-4' : 'flex-row p-5'} rounded-xl pb-10`}>
                {playlistImage && (
                    <ColorExtractor getColors={(colors: string[]) => dispatch({ type: 'bgColor', payload: colors[0] })}>
                        <img
                            className={`w-40 ${isMobile ? 'm-auto relative bottom-7' : ''}`}
                            src={playlistImage || currentPlaylist?.images[0]?.url}
                        />
                    </ColorExtractor>
                )}
                {currentPlaylist && (
                    <div className={`flex column items-center relative ${isMobile ? 'ml-0 relative' : 'ml-3'}`}>
                        {!isMobile && <p className="absolute top-8 text-xs text-[var(--text-color)]">Playlist</p>}
                        <p
                            className={`leading[2.7rem] ${
                                isMobile ? 'text-2xl' : 'text-5xl'
                            } font-bold whitespace-nowrap`}
                        >
                            {currentPlaylist.name}
                        </p>
                        {currentPlaylist.description && (
                            <p
                                className={`absolute leading-3 text-xs text-[var(--text-color)] ${
                                    isMobile ? 'top-[60px]' : 'bottom-7'
                                } mb-1`}
                            >
                                {currentPlaylist.description}
                            </p>
                        )}
                        {user && user.images && renderUserInfo()}
                    </div>
                )}
            </div>
        );
    };

    const renderPlaylistWidth = () => {
        if (sidebarCollapsed) return 'ml-[100px]';
        if (isMobile) return 'ml-4';

        return 'ml-[345px]';
    };

    const handleSetPlaylist = (playlist: SpotifyPlaylist) => {
        setCurrentPlaylist(playlist);
        dispatch({ type: 'listView', payload: false });
    };
    useEffect(() => {
        let fetched: boolean = false;

        const fetchSpotifyData = async () => {
            const code = getCodeFromUrl();

            // Try to load token from localStorage first
            let accessToken = localStorage.getItem('spotifyAccessToken');

            if (!accessToken && code && !fetched) {
                try {
                    const tokenData = await fetchAccessToken(code);
                    accessToken = tokenData.access_token;

                    // Save access token (and optional refresh token)
                    // @ts-expect-error don't care
                    localStorage.setItem('spotifyAccessToken', accessToken);
                    if (tokenData.refresh_token) {
                        localStorage.setItem('spotifyRefreshToken', tokenData.refresh_token);
                    }

                    dispatch({ type: 'spotifyToken', payload: accessToken });
                    spotify.setAccessToken(accessToken);

                    const user: SpotifyUser = await spotify.getMe();
                    dispatch({ type: 'user', payload: user });

                    // @ts-expect-error don't care
                    const playlists: SpotifyPlaylist[] = (await spotify.getUserPlaylists(user.id)).items;
                    if (!isMobile) setCurrentPlaylist(playlists[0]);
                    dispatch({ type: 'playlists', payload: playlists });

                    fetched = true;
                } catch (err) {
                    console.error('Spotify Auth Error:', err);
                }
            }

            // If token already exists in localStorage
            if (accessToken && !fetched) {
                dispatch({ type: 'spotifyToken', payload: accessToken });
                spotify.setAccessToken(accessToken);

                const user: SpotifyUser = await spotify.getMe();
                dispatch({ type: 'user', payload: user });

                // @ts-expect-error don't care
                const playlists: SpotifyPlaylist[] = (await spotify.getUserPlaylists(user.id)).items;
                if (!isMobile) setCurrentPlaylist(playlists[0]);
                dispatch({ type: 'playlists', payload: playlists });

                fetched = true;
            }
        };

        fetchSpotifyData();
    }, []);

    return (
        <div className="relative min-h-screen flex overflow-hidden">
            <WindowSizeListener onResize={(windowSize: WindowSize) => setWindowSize(windowSize)} />
            {!user && loginModal()}

            {showSidebar && (
                <Sidebar
                    isMobile={isMobile}
                    playlists={playlists}
                    setNewPlaylist={(playlist: SpotifyPlaylist) => handleSetPlaylist(playlist)}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={() => dispatch({ type: 'sidebarCollapsed', payload: !sidebarCollapsed })}
                    userImage={user?.images && user.images[0].url}
                />
            )}

            {showPlaylist && (
                <main
                    style={{
                        background: isMobile ? `linear-gradient(to top, #000, 85%, ${bgColor})` : bgColor,
                    }}
                    className={`h-full rounded-lg flex-1 min-w-0 overflow-auto m-4 ${renderPlaylistWidth()}`}
                >
                    {isMobile && (
                        <FontAwesomeIcon
                            onClick={() =>
                                dispatch({ type: 'set_multiple', payload: { currentPlaylist: null, listView: true } })
                            }
                            className={`ml-4 mt-4 text-[var(--text-color)] cursor-pointer hover:text-white`}
                            size="xl"
                            icon={faChevronLeft}
                        />
                    )}
                    {currentPlaylist && renderPlaylistInfo()}
                    {currentPlaylist && <SongTable spotifyToken={spotifyToken} />}
                </main>
            )}
            {playingSong && <SongPlayer />}
        </div>
    );
};

export default Home;
