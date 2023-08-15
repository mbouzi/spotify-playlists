"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';

import { getTokenFromUrl, loginUrl, clientId, authEndpoint, redirectUri } from './spotify';

const faPropIcon = faBook as IconProp;
config.autoAddCss = false;

const spotify = new SpotifyWebApi();


const loginModal = () => {
  return (
    <>
      <a href={loginUrl}><p>Sign in with Spotify!</p></a>
    </>
  )
}


const Home = () => {

  const [spotifyToken, setSpotifyToken] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [playlists, setPlaylists] = useState<any>([]);
  const [currPlaylist, setCurrPlaylist] = useState<any>({});
  

  const responseTime = process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE;

  const searchSongs = async() => {
    const { data } = await axios.get("https:api.spotify.com/v1/search", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer`
      },
      params: {
        q: filter,
        type: "song"
      }
    })
  }

  const renderPlaylistImg = (image: string) => {
    if(image) {
      return <div style={{
        height: "48px", 
        width: "48px", 
        backgroundImage: `url(${image})`, backgroundSize: 'cover'
      }} className='rounded'></div>
    } else {
      return <div className='flex items-center justify-center rounded bg-neutral-700 w-12 h-12'><FontAwesomeIcon size="lg" icon={faMusic}/></div>
    }
  }

  const renderPlaylists = () => {
    console.log("LISTS:", playlists)
    return playlists.map((playlist: any) => {
      return (
        <div key={playlist.id} className='flex row mt-5 mb-3'>
          {renderPlaylistImg(playlist.images[0]?.url)}

          <div className='ml-3'>
            <p className='text-base mb-1'>{playlist.name}</p>
            <p className='text-sm opacity-60'>Playlist - {playlist.owner.display_name}</p>
          </div>
        </div>
      )
    })
  }


  useEffect(() => {


    let fetched = false;

    if(!fetched) {
      const _spotifyToken = getTokenFromUrl().access_token;
      // window.location.hash = "";
      
      console.log("TOKEN:", getTokenFromUrl());
  
      const fetchData = async (userId: string) => {
        const { data } = await axios.get(`https:api.spotify.com/v1/users/${userId}/playlists`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${spotifyToken}`
          },
        })

        let playlists = data?.items;
        setPlaylists(playlists);
        setCurrPlaylist(playlists[0])
      }
  
      if(_spotifyToken) {
        setSpotifyToken(_spotifyToken);
  
        spotify.setAccessToken(_spotifyToken);
  
        spotify.getMe().then((user) => {
          console.log("DIS YOU:", user)
          fetchData(user.id)

          fetched = true;
        })
      }
    }
   
    
  }, [spotifyToken])

  return (
    <div className="min-h-screen flex">
      {/* {loginModal()} */}
      <nav className="w-80 m-2 p-5 flex-none rounded-2xl bg-neutral-900">
        
        <div className='flex justify-between row'>
          <div className='flex row opacity-60'>
            <FontAwesomeIcon size="lg" icon={faBook}/>
            <p className='ml-2 font-bold'>Your Library</p>
          </div>
          
          <div className='opacity-60'>
            <FontAwesomeIcon size="lg" icon={faPlus}/>
          </div>
        </div>

        {renderPlaylists()}
        
      </nav>

    <main className="flex-1 min-w-0 overflow-auto">
      <div className='flex row p-5'>
        <div style={{
          height: "200px", 
          width: "200px", 
          backgroundImage: `url(${currPlaylist?.images[0]?.url})`, backgroundSize: 'cover'
        }} className='rounded'>
        </div>
        <div>
          <p className='text-2xl font-bold ml-3'>{currPlaylist.name}</p>
        </div>
      </div>

        
    </main>
  </div>
  )
}

export default Home;