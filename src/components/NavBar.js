import React, { Component } from 'react';
import Identicon from 'identicon.js'

class NavBar extends Component {
  render() {
    return (
        <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                Swap Crypto Currency
                </a>
                
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small style={{color: "white"}}>
                            {this.props.account}@{this.props.netType}(Net-id: {this.props.netId})
                            {this.props.account 
                                ? <img
                                    className="ml-2"
                                    width="30"
                                    height="30"
                                    src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                    alt="small icon"
                                />
                                : <span></span>
                            } 
                        </small>
                    </li>
                </ul>
            </nav>

        </div>
    );
  }
}

export default NavBar;
