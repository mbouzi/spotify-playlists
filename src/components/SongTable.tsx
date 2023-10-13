import React, { useEffect, useState, Dispatch } from "react";
import dynamic from 'next/dynamic';
import SpotifyWebApi from 'spotify-web-api-js';
import Moment from 'moment';
import 'moment/locale/pt-br';

import { msToTime } from "../utils"

const spotify = new SpotifyWebApi();
Moment.locale('en');


const DragDropContext: any = dynamic(
    () =>
      import('react-beautiful-dnd').then(mod => {
        return mod.DragDropContext;
      }),
    {ssr: false},
  );

  const Draggable: any = dynamic(
    () =>
      import('react-beautiful-dnd').then(mod => {
        return mod.Draggable;
      }),
    {ssr: false},
  );

  const Droppable: any = dynamic(
    () =>
      import('react-beautiful-dnd').then(mod => {
        return mod.Droppable;
      }),
    {ssr: false},
  );

const columnTitles = [
    "#",
    "Title",
    "Album",
    "Date added",
    "Time"
]

interface SongTableProps {
    playlistId: string;
    spotifyToken: string;
    setCurrentSong: Dispatch<any>;
}

// interface DraggableLocation {
//     droppableId: string;
//     index: number;
// }

// interface Combine {
//     draggableId: string;
//     droppableId: string;
// }

// interface DragResult {
//     reason: 'DROP' | 'CANCEL';
//     destination?: DraggableLocation;
//     source: DraggableLocation;
//     combine?: Combine;
//     mode: 'FLUID' | 'SNAP';
//     draggableId: string;
// }



export const useStrictDroppable = (loading: boolean) => {
    const [enabled, setEnabled] = useState(false);
  
    useEffect(() => {
      let animation: any;
  
      if (!loading) {
        animation = requestAnimationFrame(() => setEnabled(true));
      }
  
      return () => {
        cancelAnimationFrame(animation);
        setEnabled(false);
      };
    }, [loading]);
  
    return [enabled];
};




const SongTable:React.FC<SongTableProps> = ({playlistId, spotifyToken, setCurrentSong}) => {
    const [songs, setSongs] = useState<any[]>([]);


    const renderColumnWidth = (index: number) => {
        if(index === 1 || index === 2) return "40%";
        if(index > 1) return "20%";

        return "inherit";
    }

    const shortenText = (data: any) => {

        const shortenLogic = (text: any) => {
            if(text.length > 20) return text.slice(0, 25) + " ...";

            return text;
        }

        if(data.artists) {
            let artistText = "";
            const artists = data.artists;

            for(let i = 0; i < artists.length; i++) {
                if(artists.length === 1 || i === artists.length - 1 ) {
                    artistText += (artists[i].name + " ")
                } else {
                    artistText += (artists[i].name + ", ");
                }
            }

            return shortenLogic(artistText)
        } else {
            return shortenLogic(data)
        }
    }

    const renderTitle = (title: string, index: number) => {
        return (
            <th 
                key={index}
                style={{width: renderColumnWidth(index)}} 
                className={`whitespace-nowrap border-none opacity-60 text-sm font-normal text-left px-4 py-2 pt-3`}
            >
                {title}
            </th>
        )
    }

    const renderSongInfo = (value: any, index: number) => {
        if(index === 1) {
            return (
                <td 
                    key={index} 
                    style={{width: renderColumnWidth(index)}}
                    className={`flex whitespace-wrap border-none px-4 py-2 text-sm cursor-pointer`}
                >
                    <img 
                        src={value.album.images.length > 0 ? value.album.images.filter((img: any) => img.height === 64)[0].url : value.album.images[0].url} 
                        className="w-[40px] h-[40px]"
                    />
                    <div className="flex flex-col ml-2">
                        <p onClick={() => setCurrentSong(value)} className="hover:underline">{shortenText(value.name)}</p>
                        <p className="opacity-60  whitespace-nowrap">{shortenText(value)}</p>
                    </div>
                    
                </td>
            )
        }
        return (
            <td 
                key={index} 
                style={{width: renderColumnWidth(index)}}
                className={`whitespace-wrap border-none opacity-60 px-4 py-2 text-sm cursor-pointer`}
            >
                {value}
            </td>
        )
    }

    const removeFromList = (list: any, index: any) => {  
        const result = Array.from(list);  
        const [removed] = result.splice(index, 1);  
        return [removed, result]  
    }  
    
    const addToList = (list: any, index: any, element: any) => {  
        const result = Array.from(list);  
        result.splice(index, 0, element);
        return result  
    }

    const onDragEnd = (result: any) => {  
        if (!result.destination) {  
            return;  
        }  
        const listCopy: any = { ...songs }  
        const sourceList = listCopy[result.source.droppableId]  
    
        const [removedElement, newSourceList] = removeFromList(sourceList, result.source.index)  
        listCopy[result.source.droppableId] = newSourceList  
    
        const destinationList = listCopy[result.destination.droppableId]  
        listCopy[result.destination.droppableId] = addToList(destinationList, result.destination.index, removedElement)  
        setSongs(listCopy)
    }

   
    useEffect(() => {

        let fetched = false;

        if(!fetched && playlistId && spotifyToken) {

            spotify.getPlaylistTracks(playlistId).then((data: any) => {
                const fetchedSongs = data?.items;
                setSongs(fetchedSongs)
                fetched = true;
            }).catch(err => console.log("ERR:", err))
           
        } 

       
    }, [spotifyToken, playlistId])

    return (
        <div>
            <table className="w-full border-none mt-5">
                <thead className="border-b border-[#aaa3]">
                    <tr className="flex">
                        {columnTitles.map((title: string, index: number) => renderTitle(title, index))}
                    </tr>
                </thead>
                    
                <DragDropContext onDragEnd={(result: any) => onDragEnd(result)}>  
                    <Droppable droppableId="droppable">
                        {(provided: any) =>(
                        <tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="relative top-[15px]"
                        >
                        {songs && songs.map((song: any, index: number) => {
                            const { track } = song;
                            const trackId = track.id + index;
                            return (

                                <Draggable key={trackId}  draggableId={trackId} index={index}>  
                                    {(provided: any, snapshot: any) => (  
                                        <tr  
                                            ref={provided.innerRef}  
                                            {...provided.draggableProps}  
                                            {...provided.dragHandleProps}
                                            className={`flex row rounded bg-transparent ${snapshot.draggingOver ? "border-b border-green-400 rounded-b-none " : "border-b-0"} ${snapshot.isDragging ? "bg-blue" : "bg-black"} cursor-pointer hover:bg-[#fff3]`}
                                            // tabIndex={0}
                                            key={trackId + index}
                                        >  
                                                {renderSongInfo(index + 1, 0)}
                                                {renderSongInfo(track, 1)}
                                                {renderSongInfo(track.album?.name, 2)}
                                                {renderSongInfo(Moment(song.added_at).format('MMM d, YYYY'), 3)}
                                                {renderSongInfo(msToTime(track.duration_ms), 4)}
                                        </tr>  
                                    )}  
                                </Draggable>
                            )
                        })}
                        </tbody>
                        )}
                    </Droppable>
                </DragDropContext>
            </table>
        </div>
    )
}

export default SongTable;