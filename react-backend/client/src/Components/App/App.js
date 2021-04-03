import React from 'react';
import './App.css';
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchBar } from "../SearchBar/SearchBar";
import { Playlist } from "../Playlist/Playlist";
import Header from "../Header/Header";
import Users from "../Users/Users";
import Login from "../Login/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class App extends React.Component {

  

    constructor(props) {
        super(props)
        this.state = {
            searchResults: [{ name: "Enter Sandman", album: "BlackAlbum", artist: "Metallica", id: 1, uri: "gjkdd" },
            { name: "Hello", album: "Kill Me", artist: "Korn", id: 2, uri: "gjkd33d" },
            { name: "Hammer", album: "Grudge", artist: "Tool", id: 3, uri: "gjkdd44" }],
            playlistName: "New Playlist",
            playlistTracks: [{ name: "One", album: "BlackAlbum", artist: "Metallica", id: 4, uri: "gjkd55d" },
            { name: "Hello", album: "Kill Me", artist: "Pantera", id: 5, uri: "gj66kdd" },
            { name: "Hammerers", album: "Grudge", artist: "Tooler", id: 6, uri: "g32jkdd" }]
        }

        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.updatePlaylistName = this.updatePlaylistName.bind(this)
        this.savePlaylist = this.savePlaylist.bind(this)
        this.search = this.search.bind(this)
    }

    addTrack(track) {
        let newPlaylist = this.state.playlistTracks
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
            return
        } else {
            newPlaylist.push(track)
            this.setState({ playlistTracks: newPlaylist });
        }
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

    search(term) {

    }

    render() {
        return (
            <div>
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
                                    <SearchBar onSearch={this.search} />
                                    <div className="App-playlist">
                                        <SearchResults searchResult={this.state.searchResults} onAdd={this.addTrack} isPlus={true} />
                                        <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                                            onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
                                    </div>
                                </div>
                            </Route>
                            <Route path="/users">
                              <Users />
                            </Route>
                            <Route path="/login">
                              <Login />
                            </Route>
                        </Switch>
                    </div>
                </Router>

            </div>
        )
    }
}

export { App }
