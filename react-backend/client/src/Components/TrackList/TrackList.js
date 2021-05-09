import React from 'react'
import './TrackList.css'
import { Track } from "../Track/Track";

class TrackList extends React.Component {
    
    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(trackItem => {
                        return (
                            <div key={trackItem.id}>
                            <Track track={trackItem} onAdd={this.props.onAdd} isPlus={this.props.isPlus}  onRemove={this.props.onRemove} isRemoval={this.props.onRemoval}/>  
                            </div>
                        )
                    }
                )
                }
            </div>
            )
    }
}

export { TrackList }