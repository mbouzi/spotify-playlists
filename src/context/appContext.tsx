"use client";

import React, { Dispatch, useState, createContext } from "react";

import { SpotifyPlaylist, SpotifySong } from "@/types";

export interface AppContextType {
    playingSong: SpotifySong | null;
    setPlayingSong: Dispatch<any>;
    songHovered: SpotifySong | null;
    setSongHovered: Dispatch<any>;
    playlistSongsFetched: boolean;
    setPlaylistSongsFetched: Dispatch<any>;
    currentPlaylist: SpotifyPlaylist | null;
    setCurrentPlaylist: Dispatch<any>;
}   

export interface AppContextProps {
    children: React.ReactNode;
}

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider: React.FC<AppContextProps> = ({ children }):React.ReactNode => {

    const [playingSong, setPlayingSong] = useState<SpotifySong | null>(null);
    const [songHovered, setSongHovered] = useState<SpotifySong | null>(null);
    const [playlistSongsFetched, setPlaylistSongsFetched] = useState<boolean>(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);

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
                setCurrentPlaylist
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
