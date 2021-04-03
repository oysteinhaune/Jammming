import React from 'react'

class Users extends React.Component {

    componentDidMount() {
        fetch('/users')
            .then(res => res.json())
            .then(users => this.setState({ users }));
    }

    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }
    
    render() {
        return <div className="App">
            <h1>Users</h1>
            {this.state.users.map(user =>
                <div key={user.id}>{user.username}</div>
            )}
        </div>;
    }
}

export default Users