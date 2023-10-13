import React, { useEffect, useState } from "react";
import axios from "axios";

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
    const [is_paused, setPaused] = useState(false);
    const [, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState<any>(null);

    const playSong = () => {
        const currenSong = props.currentSong;

        console.log("CURRE:", currenSong)
        try {
            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                "context_uri": currenSong.album.image ? currenSong.album.image : currenSong.album.images[0].uri,
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
        console.log("ACTIVE:", props.token);
        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
            player.on("initialization_error", e => console.log("ERR:", e));
            player.on("authentication_error", e => console.log("ERR:", e));
            player.on("account_error", e => console.log("ERR:", e));
            player.on("playback_error", e => console.log("ERR:", e));

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }
            
                // setTrack(state.track_window.current_track);
                setPaused(state.paused);
            
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));

         


            player.connect();

        };

    }, [props.currentSong, props.token]);

    return (
        <div className="container">
            {props.currentSong && <div className="main-wrapper">
                <img src={props.currentSong.album.images[0].url} 
                     className="now-playing__cover" alt="" />

                <div className="now-playing__side">
                    <div className="now-playing__name">{
                                  props.currentSong.name
                                  }</div>

                    <div className="now-playing__artist">{
                                  props.currentSong.artists[0].name
                                  }</div>
                </div>
            </div>}

            {deviceId && <>
            <button className="btn-spotify" onClick={() => playSong()} >
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
            </button>
            </>}
        </div>
    )
}

export default SongPlayer;