import React from 'react'
import './SearchResults.css'
import { TrackList } from "../TrackList/TrackList";

class SearchResults extends React.Component {
    
    render() {
         return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResult} onAdd={this.props.onAdd} isPlus={this.props.isPlus} isRemoval={true}/>
            </div>
        )
    }
}

export { SearchResults }