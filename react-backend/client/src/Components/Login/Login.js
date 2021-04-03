import React from 'react'

class Login extends React.Component {

    componentDidMount() {
        fetch('/login')
        .then(res => console.log(res.redirected))
    }

    render() {
        return <div>No login</div>;
    }
}

export default Login