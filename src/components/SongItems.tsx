import React, { useContext, Dispatch } from "react";
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Moment from "moment";
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import SpotifyWebApi from 'spotify-web-api-js';

import { AppContext, AppContextType } from '@/context/appContext';

import SongColumn from "./SongColumn";
import ConditionalWrapper from './ConditionalWrapper';

import { SpotifySong , SpotifyPlaylistSong} from "@/types";

import { msToTime } from '@/modules/utils';

const spotify = new SpotifyWebApi();

const Draggable: any = dynamic(
    () =>
        import('@hello-pangea/dnd').then((mod) => {
            return mod.Draggable;
        }),
    { ssr: false },
);

interface SongItemProps {
    songItems: SpotifySong[];
    isTable?: boolean | null;
    setSongResults?: Dispatch<any> | null;
}

interface SongField {
    name: string;
    value: SpotifySong | string | React.ReactNode;
    index: number;
    render: boolean | null | undefined;
}

const SongItems: React.FC<SongItemProps> = ({songItems, isTable, setSongResults}):React.ReactElement => {

    const { currentPlaylist, playingSong, songHovered, setSongHovered, setPlaylistSongsFetched } = useContext(AppContext) as AppContextType;

    const addSong = (songUri: string | null):void => {
        if(songUri && currentPlaylist && setSongResults) {
            setPlaylistSongsFetched(false);
            spotify.addTracksToPlaylist(currentPlaylist.id, [songUri]).then(() => {
                setPlaylistSongsFetched(true)
                const newSongResults = songItems.filter((songItem: SpotifySong) => songUri !== songItem.uri)
                setSongResults(newSongResults)
            }) .catch((err) => console.log('ERR:', err));
        };
    };

    const renderSongItems = (track: SpotifySong, song: SpotifyPlaylistSong, trackId: number, index: number, highlight: boolean): React.ReactElement => {

        const songFields = () => {
            return [
                {
                    name: "number",
                    value: songHovered?.name === track.name ?  
                    <FontAwesomeIcon
                        className="mt-1"
                        size="sm"
                        icon={faPlay}
                    /> : 
                    index + 1,
                    index: 0,
                    render: isTable
                },
                {
                    name: "artist name",
                    value: track,
                    index: 1,
                    render: isTable || !isTable
                },
                {
                    name: "album name",
                    value: track.album?.name,
                    index: 2,
                    render: isTable || !isTable
                },
                {
                    name: "date added",
                    value: Moment(song.added_at).format('MMM d, YYYY'),
                    index: 3,
                    render: isTable
                },
                {
                    name: "length",
                    value: msToTime(track.duration_ms),
                    index: 4,
                    render: isTable
                },
            ]
    
        };

        return (
            <ConditionalWrapper 
                key={trackId}
                condition={isTable}
                wrapperA={(children: React.ReactNode) => 
                    <Draggable key={trackId + index} draggableId={trackId} index={index}>
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <tr
                            ref={provided?.innerRef}
                            {...provided?.draggableProps}
                            {...provided?.dragHandleProps}
                            className={`flex rounded bg-transparent ${
                                snapshot?.draggingOver
                                    ? 'border-b border-green-400 rounded-b-none '
                                    : 'border-b-0'
                            } ${
                                snapshot?.isDragging ? 'bg-blue' : 'bg-black'
                            } hover:bg-[#fff3]`}
                            key={trackId + index}
                            onMouseOver={() => setSongHovered(track)}
                            onMouseLeave={() => setSongHovered(null)}
                        >
                            {children}
                        </tr>     
                        )}
                    </Draggable>   
                }
                wrapperB={(children: React.ReactNode) => 
                    <tr
                        className={`flex rounded bg-transparent hover:bg-[#fff3]`}
                        key={trackId + index}
                        onMouseOver={() => setSongHovered(track)}
                        onMouseLeave={() => setSongHovered(null)}
                    >
                        {children}
                    </tr>     
                }
            >
                {songFields().map((songField: SongField) => {
                    if(songField.render) {
                        return (
                            <SongColumn 
                                key={songField.name}
                                value={songField.value}
                                index={songField.index}
                                highlight={highlight}
                                isTable={isTable}
                                isHovered={songHovered?.name === track.name}
                            />
                        )
                    }
                    
                })}

                {!isTable && 
                    <td>
                        <p 
                            className={`border-2 border-[var(--border-color)] text-xs font-bold rounded-full mt-2 p-2 px-4 cursor-pointer hover:border-white`}
                            onClick={() => addSong ? addSong((track?.uri)) : () => {}}
                        >
                            Add
                        </p>
                    </td>
                }
            </ConditionalWrapper>
        );
            
    };

    return (
       <React.Fragment>
            {songItems && songItems.map((song: any, index: number) => {
                const track = isTable ? song.track : song, 
                trackId = track.id + index,
                highlight = playingSong?.name.toLowerCase() === track.name.toLowerCase();

                return (
                    renderSongItems(track, song, trackId, index, highlight)
                );
            })}
       </React.Fragment>
    )
}


export default SongItems;