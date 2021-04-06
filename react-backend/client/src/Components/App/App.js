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

const spotifyApi = new SpotifyWebApi();

class App extends React.Component {

    constructor(props) {
        super(props)
        const params = this.getHashParams();
        const token = params.access_token;

        if (token) {
            spotifyApi.setAccessToken(token);
        }

        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            searchResultsObjects: [],
            searchResults: [{}],
            playlistName: "New Playlist",
            playlistTracks: [{}]
        }


        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.updatePlaylistName = this.updatePlaylistName.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
        this.search = this.search.bind(this)
        this.updatesearchResultsObjects = this.updatesearchResultsObjects.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.clearSearchResults = this.clearSearchResults.bind(this)
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
                    // Display notification if no song is playing.
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
        this.setState({ searchResults: {
                name: trackObject.name,
                album: trackObject.album.name,
                artist: trackObject.artists.[0].name,
                id: trackObject.id,
                uri: trackObject.uri  
        }})
    }

    removeTrack(track) {
        let newPlaylist = this.state.playlistTracks
        newPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id)
        this.setState({ playlistTracks: newPlaylist });
    }

    updatePlaylistName(name) {
        this.setState({ playlistName: name })
    }

    savePlaylist() {
        let trackURIs = []
        this.state.playlistTracks.forEach(trackItem => trackURIs.push(trackItem.uri));
    }

    updatesearchResultsObjects(trackObject) {
        this.setState({searchResultsObjects: trackObject.tracks.items })
    }

    updateSearchResults() {
        this.clearSearchResults()
        this.state.searchResultsObjects.forEach(track => {
            this.addTrack(track);
        });
    }

    search(term) {
        // search tracks whose name, album or artist contains 'term'
        if(term) {
        spotifyApi.searchTracks(term).then((data) => {
                this.updatesearchResultsObjects(data);
                this.updateSearchResults();
            }
        )} else {
            return
        }
    }

    render() {
        return (
            <div>
                <ReactNotification />
                <Header />
                <Router>
                    <div>

                        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
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
                                        <SearchResults searchResult={this.state.searchResults} onAdd={this.addTrack} isPlus={true} onRemove={this.removeTrack}/>
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
