'use client';

import React, { Dispatch, useState, createContext } from 'react';
import { WindowSize } from 'react-window-size-listener';

import { SpotifyPlaylist, SpotifySong } from '@/types';
import { breakPoints } from '@/app/theme';

export interface AppContextType {
    playingSong: SpotifySong | null;
    setPlayingSong: Dispatch<any>;
    songHovered: SpotifySong | null;
    setSongHovered: Dispatch<any>;
    playlistSongsFetched: boolean;
    setPlaylistSongsFetched: Dispatch<any>;
    currentPlaylist: SpotifyPlaylist | null;
    setCurrentPlaylist: Dispatch<any>;
    windowSize: WindowSize | null;
    setWindowSize: Dispatch<any>;
    isMobile: boolean | null;
}

export interface AppContextProps {
    children: React.ReactNode;
}

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider: React.FC<AppContextProps> = ({ children }): React.ReactNode => {
    const [playingSong, setPlayingSong] = useState<SpotifySong | null>(null);
    const [songHovered, setSongHovered] = useState<SpotifySong | null>(null);
    const [playlistSongsFetched, setPlaylistSongsFetched] = useState<boolean>(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);
    const [windowSize, setWindowSize] = useState<WindowSize | null>(null);
    const isMobile = windowSize?.windowWidth !== undefined ? windowSize.windowWidth < breakPoints.smScreen : null;

    return (
        <AppContext.Provider
            value={{
                playingSong,
                setPlayingSong,
                songHovered,
                setSongHovered,
                playlistSongsFetched,
                setPlaylistSongsFetched,
                currentPlaylist,
                setCurrentPlaylist,
                windowSize,
                setWindowSize,
                isMobile,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
