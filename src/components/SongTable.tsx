import React, { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import SpotifyWebApi from 'spotify-web-api-js';
import { DropResult,  DroppableProvided} from '@hello-pangea/dnd';

import { AppContext, AppContextType } from '@/context/appContext';

import SongItems from './SongItems';
import AddSong from './AddSong';

import { SpotifySong } from '@/types';


const spotify = new SpotifyWebApi();

const DragDropContext: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.DragDropContext;
        }),
    { ssr: false },
);

const Droppable: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.Droppable;
        }),
    { ssr: false },
);


interface SongTableProps {
    spotifyToken: string;
}

const renderColumnWidth = (index: number): string => {
    if (index === 1 || index === 2) return '40%';
    if (index > 1) return '20%';

    return 'inherit';
};

const playlistColumnTitles = [
    "#",
    "Title",
    "Album",
    "Date added",
    "Length"
]

const SongTable: React.FC<SongTableProps> = ({ spotifyToken }): React.ReactElement => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const { playlistSongsFetched, setPlaylistSongsFetched, currentPlaylist } = useContext(AppContext) as AppContextType;

    
    const renderTitle = (title: string, index: number): React.ReactNode => {
        return (
            <th
                key={index}
                style={{ width: renderColumnWidth(index) }}
                className={`whitespace-nowrap border-none opacity-60 text-sm font-normal text-left px-4 py-2 pt-3`}
            >
                {title}
            </th>
        );
    };

    const onDragEnd = (result: DropResult): void => {

        if (!result.destination || !currentPlaylist) {  
            return;  
        }  

        const playlistId = currentPlaylist.id,
        rangeStart = ~~result.source.index;

        let insertBefore = ~~result?.destination?.index;

        if(rangeStart < insertBefore) insertBefore += 1;

        spotify.reorderTracksInPlaylist(playlistId, rangeStart, insertBefore)
            .then(() =>  setPlaylistSongsFetched(false))
            .catch(err => console.log("ERR:", err))
    };

    useEffect(() => {
        if (currentPlaylist?.id && spotifyToken) {
            spotify
                .getPlaylistTracks(currentPlaylist.id)
                .then((data: any) => {
                    const fetchedSongs: SpotifySong[] = data?.items;
                    setSongs(fetchedSongs);
                    setPlaylistSongsFetched(true)
                })
                .catch((err) => console.log('ERR:', err));
        }
    }, [spotifyToken, currentPlaylist, playlistSongsFetched]);

    return (
        <div 
            style={{ background: `linear-gradient(to top, #000, #0006)` }} 
            className={`${songs.length < 20 ? "h-full" : ""} 
                ${!playlistSongsFetched ? "opacity-50" : ""} 
                p-5`
            }
        >
            <table className="w-full border-none mt-5">
                <thead className="border-b border-[var(--border-color)]">
                    <tr className="flex">
                        {playlistColumnTitles.map((title: string, index: number) => renderTitle(title, index))}
                    </tr>
                </thead>

                <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result)}>
                    <Droppable droppableId="droppable">
                        {(provided: DroppableProvided) => (
                            <tbody ref={provided.innerRef} {...provided.droppableProps} className="relative h-[100%] block overflow-y-scroll">
                                <SongItems 
                                    songItems={songs}
                                    isTable={true}
                                />
                            </tbody>
                        )}
                    </Droppable>
                </DragDropContext>
            </table>
            <AddSong />
        </div>
    );
};

export default SongTable;
