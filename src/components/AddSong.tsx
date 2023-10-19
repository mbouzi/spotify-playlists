'use client';
import React, { useEffect, useState } from "react";
import SpotifyWebApi from 'spotify-web-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';

import SongItems from "./SongItems";

import { SpotifySong } from "@/types";

const spotify = new SpotifyWebApi();

const AddSong: React.FC = ({}): React.ReactElement => {

    const [filter, setFilter] = useState<string>('');
    const [songResults, setSongResults] = useState<SpotifySong[]>([]);

    useEffect(() => {
        if(filter.length === 0) {
            setSongResults([]);
        } else {
            spotify.searchTracks(filter, {limit: 10}).then((data: any,) => {
                const fetchedSongs: SpotifySong[] = data?.tracks?.items;
                setSongResults(fetchedSongs);
            })
            .catch((err) => console.log('ERR:', err));
        }
    }, [filter])

    return (
        <div className="border-t border-[#aaa3] mt-10 pt-5 pb-[100px]">
            <h3 className="mb-2 text-xl font-bold">Lets find something for your playlist</h3>
            <div className="relative">
                <FontAwesomeIcon 
                    size="sm" 
                    icon={faSearch}
                    className="absolute text-[#fff9] left-2 top-[13px]"
                />
                <input 
                    className="placeholder:text-white placeholder:text-sm placeholder:opacity-60 w-[350px] rounded-sm mb-5 px-2 py-2 pl-7 bg-neutral-600 outline-none"
                    onChange={(e) => setFilter(e.target.value)} 
                    value={filter} 
                    placeholder="Search for songs" 
                />
                {filter.length > 0 && 
                    <FontAwesomeIcon 
                        className="relative text-[#fff9] right-[22px] cursor-pointer hover:text-white"
                        size="sm" 
                        icon={faX}
                        onClick={() => setFilter("")}
                    />
                }
            </div>
            <table className="flex flex-col">
                <tbody>
                    <SongItems setSongResults={(songs: SpotifySong[]) => setSongResults(songs)} songItems={songResults} />
                </tbody>
            </table>
        </div>
    )
}

export default AddSong;
