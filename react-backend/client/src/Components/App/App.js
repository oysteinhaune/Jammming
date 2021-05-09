import React from 'react';
import './App.css';
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchBar } from "../SearchBar/SearchBar";
import { Playlist } from "../Playlist/Playlist";
import Header from "../Header/Header";
import Users from "../Users/Users";
import 'bootstrap/dist/css/bootstrap.min.css';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';


import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
  });

class App extends React.Component {

    constructor(props) {
        super(props)
        const params = this.getHashParams();
        const token = params.access_token;
        

        if (token) {
            spotifyApi.setAccessToken(token);
            this.getUserInfo()
        }

        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            searchResultsObjects: [],
            searchResults: [{}],
            playlistName: "New Playlist",
            playlistTracks: [],
            userName: '',
            userId: '',
            token: token
        }


        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.updatePlaylistName = this.updatePlaylistName.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
        this.search = this.search.bind(this)
        this.updatesearchResultsObjects = this.updatesearchResultsObjects.bind(this)
        this.clearSearchResults = this.clearSearchResults.bind(this)
        this.removeSearchResultTrack = this.removeSearchResultTrack.bind(this)
        this.addSearchResultTrack = this.addSearchResultTrack.bind(this)
        this.getUserInfo = this.getUserInfo.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)       
        this.getUserPlaylists = this.getUserPlaylists.bind(this)
    }

    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                if (response.item) {
                    this.setState({
                        nowPlaying: {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url
                        }
                    });
                } else {
                    store.addNotification({
                        title: "No song playing",
                        message: "Please check your Spotify player.",
                        type: "danger",
                        insert: "top",
                        container: "bottom-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true
                        }
                      });
                }
            })
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    clearSearchResults() {
        this.setState({ searchResults: {
            name: "",
            album: "",
            artist: "",
            id: "",
            uri: ""  
    }})
    }

    addTrack(trackObject) {
        if(this.state.playlistTracks.filter(e => (e.id === trackObject.id)).length === 0){
            let newPlaylist = this.state.playlistTracks
            newPlaylist.push(trackObject)
            this.setState({ playlistTracks: newPlaylist });

            this.removeSearchResultTrack(trackObject)
        }else{
            return null
       }      
    }

    removeTrack(trackObject) {
        let newPlaylist = this.state.playlistTracks
        newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== trackObject.id)
        this.setState({ playlistTracks: newPlaylist });

        this.addSearchResultTrack(trackObject)
    }

    removeSearchResultTrack(trackObject) {
        let newSearchResults = this.state.searchResultsObjects
        newSearchResults = this.state.searchResultsObjects.filter(savedTrack => savedTrack.id !== trackObject.id)
        this.setState({ searchResultsObjects: newSearchResults });
    }

    addSearchResultTrack(trackObject) {
        let newSearchResults = this.state.searchResultsObjects
        newSearchResults.unshift(trackObject)
        this.setState({ searchResultsObjects: newSearchResults });
    }

    updatePlaylistName(name) {
        this.setState({ playlistName: name })
    }

    savePlaylist() {
        this.getUserPlaylists()
/*         this.createPlaylist

        let trackURIs = []
        this.state.playlistTracks.forEach(trackItem => trackURIs.push(trackItem.uri)); */
    }

    createPlaylist() {
        spotifyApi.createPlaylist(this.state.playlistName, { 'description': 'My description', 'public': true })
            .then(function(data) {
                console.log('Created playlist!');
            }, function(err) {
                console.log('Something went wrong!', err);
            });
    }

    addTracksToPlaylist() {
        spotifyApi.addTracksToPlaylist('5ieJqeLJjjI8iJWaxeBLuK', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
            .then(function(data) {
                console.log('Added tracks to playlist!');
            }, function(err) {
                console.log('Something went wrong!', err);
            });
    }

    getUserInfo() {
        // Get the authenticated user
        spotifyApi.getMe().then((data) => {
            console.log(data)
            let usersId = ['oysteinha'];
            this.setState({userName: data.display_name, userId: usersId})
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    }

    getUserPlaylists() {
        // Get a user's playlists
        fetch(`https://api.spotify.com/v1/${this.state.userId}/playlists/?access_token=${this.state.token}`).then(res => res.json()).then(data => console.log(data));
    }

    updatesearchResultsObjects(trackObject) {
        this.setState({searchResultsObjects: []})
        let trackArray = [trackObject]
        this.setState({searchResultsObjects: trackArray})
    }

    search(term) {
        spotifyApi.searchTracks(term).then((data) => {
            let trackArray = []
            data.tracks.items.forEach(track => {
                trackArray.push({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    URI: track.uri
                })
            });

            this.setState({
                searchResultsObjects: trackArray
            })
    })
    }

    render() {
        return (
            <div>
                <ReactNotification />
                <Header />
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/">
                                <div className="App">
                                    <div>
                                        {this.state.loggedIn && <p>Now Playing:</p>}
                                        {this.state.loggedIn && this.state.nowPlaying.name}
                                    </div>
                                    <div>
                                        <img alt={this.state.nowPlaying.name} src={this.state.loggedIn ? this.state.nowPlaying.albumArt : undefined} style={{ height: 150 }} />
                                    </div>
                                    
                                    {this.state.loggedIn && <button onClick={() => this.getNowPlaying()}>
                                        Check Now Playing
                                    </button>
                                    }

                                    <SearchBar onSearch={this.search} />
                                    <div className="App-playlist">
                                        <SearchResults searchResult={this.state.searchResultsObjects} onAdd={this.addTrack} isPlus={true} onRemove={this.removeTrack}/>
                                        <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                                            onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
                                    </div>
                                </div>
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                        </Switch>
                    </div>
                </Router>
                
            </div>
        )
    }
}

export { App }
