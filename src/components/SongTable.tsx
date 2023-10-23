import React, { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import SpotifyWebApi from 'spotify-web-api-js';
import { DropResult,  DroppableProvided} from '@hello-pangea/dnd';

import { AppContext, AppContextType } from '@/context/appContext';

import SongItems from './SongItems';
import AddSong from './AddSong';

import { SpotifySong } from '@/types';
import { breakPoints } from '@/app/theme';


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
};

const SongTable: React.FC<SongTableProps> = ({ spotifyToken }): React.ReactElement => {
    const [songs, setSongs] = useState<SpotifySong[]>([]);
    const { playlistSongsFetched, setPlaylistSongsFetched, currentPlaylist, windowSize, isMobile } = useContext(AppContext) as AppContextType;

    const playlistColumnTitles = [
        {
            name: "#",
            render: true
        },
        {
            name: "Title",
            render: true
        },
        {
            name: "Album",
            render: windowSize && windowSize.windowWidth > breakPoints.xlScreen
        },
        {
            name: "Date added",
            render: windowSize && windowSize.windowWidth > breakPoints.xlScreen
        },
        {
            name: "Length",
            render: true
        }
    ];

    const renderColumnWidth = (index: number): string => {
        const isXLScreen = windowSize && windowSize.windowWidth < breakPoints.xlScreen;

        if(isXLScreen && index === 1) return '80%';
        if (isXLScreen) return '5%';
        if (index === 1 || index === 2) return '40%';
        if (index > 1) return '20%';
    
        return 'inherit';
    };
    
    const renderTitle = (title: string, index: number): React.ReactNode => {
        return (
            <th
                key={index}
                style={{ width: renderColumnWidth(index)}}
                className={`border-none opacity-60 text-sm font-normal text-left px-4 py-2 pt-3 whitespace-nowrap`}
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
            .catch(err => console.log("ERR:", err));
    };

    useEffect(() => {
        if (currentPlaylist?.id && spotifyToken) {
            spotify
                .getPlaylistTracks(currentPlaylist.id)
                .then((data: any) => {
                    const fetchedSongs: SpotifySong[] = data?.items;
                    setSongs(fetchedSongs);
                    setPlaylistSongsFetched(true);
                })
                .catch((err) => console.log('ERR:', err));
        }
    }, [spotifyToken, currentPlaylist, playlistSongsFetched]);

    return (
        <div 
            style={{ background: !isMobile ? "linear-gradient(to top, #000, #0006)" : "" }} 
            className={`${songs.length < 20 ? "h-full" : ""} 
                ${!playlistSongsFetched ? "opacity-50" : ""} 
                ${isMobile ? "p-0 pt-1 px-0" : "p-5"}`
            }
        >
            <table className={`w-full border-none ${isMobile ? "mt-2" : " mt-5"}`}>
                {!isMobile && <thead className="border-b border-[var(--border-color)]">
                    <tr className="flex">
                        {playlistColumnTitles.map((titleObj, index) => titleObj.render && renderTitle(titleObj.name, index))}
                    </tr>
                </thead>}

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
