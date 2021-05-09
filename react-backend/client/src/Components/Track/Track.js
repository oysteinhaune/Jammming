import React from 'react'
import './Track.css'

class Track extends React.Component {

    constructor(props) {
        super(props)
        this.renderAction = this.renderAction.bind(this)
        this.addTrack = this.addTrack.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
    }

    renderAction(isPlus) {
        if (isPlus) {
            return <button onClick={this.addTrack} className="Track-action">+</button>
        } else {
            return <button onClick={this.removeTrack} className="Track-action">-</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track)
    }

    removeTrack() {
        this.props.onRemove(this.props.track)
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>Artist: {this.props.track.artist} | Album: {this.props.track.album}</p>
                </div>
                {this.renderAction(this.props.isPlus)}
            </div>
        )
    }
}

export { Track }