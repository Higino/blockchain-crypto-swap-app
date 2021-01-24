import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import Web3 from 'web3';
import NavBar from './NavBar';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import './App.css';
import MainPanel from './MainPanel';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      account : '0x0000000000000',
      ethBalance: '0',
      tokenBalance: '0',
      netId: '0',
      netType: '0',
      ethSwapContract: {},
      tokenContract: {}
    }

    // This binding is necessary to make `this` work in the callback
    this.loadBlockChainData = this.loadBlockChainData.bind(this)
  }

  async componentWillMount() {
    await this.loadBlockChainData()
  }

  async loadBlockChainData() {
    this.setState({loading: true})
    await this.loadWeb3()

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    const netId = await web3.eth.net.getId()
    const netType = await web3.eth.net.getNetworkType()
    const ethBalance = await web3.eth.getBalance(accounts[0])
    
    this.setState({
      account:        accounts[0],
      ethBalance:     ethBalance,
      netId:          netId,
      netType:        netType
    })
    
    let tokenContract = undefined, tokenBalance = '0'
    if( Token.networks[netId] ) {
      // Load smart contracts and balances : TokenContract
      tokenContract = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
      tokenBalance = await tokenContract.methods.balanceOf(this.state.account).call();
    }
    this.setState({
      tokenBalance: tokenBalance.toString(), 
      tokenContract: tokenContract  
    })

    let ethSwapContract = undefined
    // Load smart contracts and balances : EthSwap
    if( EthSwap.networks[netId] ) {
      ethSwapContract = new web3.eth.Contract(EthSwap.abi, EthSwap.networks[netId].address)
    }
    this.setState({ethSwapContract: ethSwapContract})

    console.log('Selected account: ' + this.state.account) 
    console.log('    netId: ' + this.state.netId)
    console.log('    netType: ' + this.state.netType)
    console.log('    EthBalance: ' + this.state.ethBalance)
    console.log('    TokenBalance: ' + this.state.tokenBalance)
    console.log(this.state.ethSwapContract)
    console.log(this.state.tokenContract)
    this.setState({loading: false})
  }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      if( window.ethereum ) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      } else  {
        window.web3 = new Web3(window.web3.currentProvider)
      }
    } else {
      window.alert('Non-Etherium browser detected. You should consider trying metamask')
    }
  }

  render() {
    let mainPanelContent = 
    <div className="m-5">
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <div>Loading BlockChain Data ...</div>
    </div>
    if( !this.state.loading ) {
      mainPanelContent = <MainPanel callbackLoadBlockChainData={this.loadBlockChainData}
                                    ethBalance={this.state.ethBalance}
                                    tokenBalance={this.state.tokenBalance}
                                    tokenContract={this.state.tokenContract}
                                    ethSwapContract={this.state.ethSwapContract}/>
    }
    return (
      <div>
        <div>
          <NavBar account={this.state.account} 
                  netId={this.state.netId} 
                  netType={this.state.netType}/>
        </div>
        <div>
          {mainPanelContent}
        </div>
      </div>
    );
  }
}

export default App;
