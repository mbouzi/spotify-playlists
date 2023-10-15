import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { msToTime } from "@/utils";

interface SongPlayerProps {
    token: string,
    currentSong: any;
}

// const track = {
//     name: "",
//     album: {
//         images: [
//             { url: "" }
//         ]
//     },
//     artists: [
//         { name: "" }
//     ],
//     uri: ""
// }

const SongPlayer:React.FC<SongPlayerProps> = (props) => {

    const [player, setPlayer] = useState<any>(null);
    const [, setPaused] = useState(false);
    const [, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState<any>(null);

    const playSong = () => {
        const currenSong = props.currentSong;
        try {
            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                "context_uri": currenSong.uri,
                "offset": {
                    "position": currenSong.track_number
                },
                "position_ms": 0
            }, {
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                    'Content-type': 'application/json'
                },
            })
        } catch(err) {
            console.log("PLAY ERR:", err)
        }
    }

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);
        
        window.onSpotifyWebPlaybackSDKReady = () => {

            const  newPlayer = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb: any) => { cb(props.token); },
                volume
                : 0.5
            });

            setPlayer(newPlayer);

            player.on("initialization_error", (e: any) => console.log("ERR:", e));
            player.on("authentication_error", (e: any) => console.log("ERR:", e));
            player.on("account_error", (e: any) => console.log("ERR:", e));
            player.on("playback_error", (e: any) => console.log("ERR:", e));


            player.addListener('ready', ( device_id: any ) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', (device_id: any) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( (state: any) => {

                if (!state) {
                    return;
                }
            
                // setTrack(state.track_window.current_track);
                setPaused(state.paused);
            
            
                 player.getCurrentState().then((state: any) => {
                    if (!state) {
                        setActive(false);
                    } else {
                        setActive(true);
                    }
                    });
            
            }));


            player.connect();

        };

    }, [props.currentSong, props.token]);

    return (
        <div className="fixed bottom-0 w-full z-10 flex bg-black p-5">
            <div className="flex w-1/3">
                <img 
                    src={props.currentSong.album.images[0].url} 
                    className="rounded w-[55px] h-[55px]" alt="" 
                />

                <div className="ml-4 mt-2">
                    <p className="whitespace-nowrap text-sm">{props.currentSong.name.length > 25 ?  props.currentSong.name.slice(0, 25) + " ..." : props.currentSong.name}</p>
                    <p className="opacity-40 text-[12px]"> {props.currentSong.artists[0].name}</p>
                </div>
            </div>

            <div className="w-1/3 text-center"> 
                {/* <button className="btn-spotify" onClick={() => playSong()} >
                    Play
                </button>

                <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                    Previous
                </button>

                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                    { is_paused ? "PLAY" : "PAUSE" }
                </button>

                <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                    Next
                </button> */}
                <FontAwesomeIcon onClick={() => playSong()} className="rounded-full bg-white text-black py-[8px] px-[10px]" icon={faPlay}/>
                <div className="flex justify-evenly mt-1">
                    <p className="text-[12px] opacity-40">0:00</p>
                    <div className="w-3/4 bg-[#fff3] h-1 mt-2 rounded"></div>
                    <p className="text-[12px] opacity-40">{msToTime(props.currentSong.duration_ms)}</p>
                </div>
            </div>

            <div className="w-1/3"></div>
        </div>
    )
}

export default SongPlayer;