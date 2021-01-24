import React, { Component } from 'react';
import logo from '../logo.png';
import {Button} from 'react-bootstrap'

class AppHome extends Component {
    constructor (props) {
        super(props)

        this.setState({
            loading: false,
            ethBalance: '0',
            netId:  'NA',
            netType: 'NA',
            account:  'NA',
            tokenBalance: '0'      
        })
   }

    render() {
        return (
        <div className="container-fluid mt-5">
            <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
                <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
                >
                <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp to swap crypto currency</h1>
                <p>
                This is a test app.
                </p>
                <span><Button onClick={this.props.callbackLoadBlockChainData} >Load Blockchain Data</Button></span>
            </div>
            </main>
        </div>
);
    }
}

export default AppHome;
