import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();

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




const SongTable:React.FC<SongTableProps> = ({playlistId, spotifyToken}) => {
    const [songs, setSongs] = useState<any[]>([]);


    const renderTitle = (title: string, index: number) => {
        return (
            <th style={{width: index > 0 ? "200px" : "inherit"}} key={index} className={`whitespace-nowrap border-none opacity-60 text-xs font-normal capitalize lowercase text-left px-4 py-2 pt-3`}>{title}</th>
        )
    }

    const renderSongInfo = (value: string | number, index: number) => {
        return (
            <td key={index} className={`w-[${index > 0 ? "200px" : "inherit"}] whitespace-wrap border-none px-4 py-2 cursor-pointer lowercase`}>{value}</td>
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
        // updateProjectRequests(project, listCopy, authToken)
    }

   
    useEffect(() => {

        let fetched = false;

        if(!fetched && playlistId && spotifyToken) {

            spotify.getPlaylistTracks(playlistId).then((data: any) => {
                console.log("SONG DATA:", data)
                const fetchedSongs = data?.items;
                setSongs(fetchedSongs)
                fetched = true;
            }).catch(err => console.log("ERR:", err))
           
        } 

       
    }, [spotifyToken, playlistId])

    return (
        <table className="border-none">
            <thead>
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
                                        className={`flex row rounded ${snapshot.draggingOver ? "border-b border-green-400 rounded-b-none" : "border-b-0"} ${snapshot.isDragging ? "bg-blue" : "bg-black"} hover:bg-neutral-700`}
                                        // tabIndex={0}
                                        key={trackId + index}
                                    >  
                                            {renderSongInfo(index + 1, 0)}
                                            {renderSongInfo(track.name, 1)}
                                            {renderSongInfo(track.album?.name, 2)}
                                            {renderSongInfo(song.added_at, 3)}
                                            {renderSongInfo(track.duration_ms, 4)}
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
    )
}

export default SongTable;