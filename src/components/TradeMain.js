import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

class TradeMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
        currentForm: 'buy',
        ethSwapContract: props.ethSwapContract,
        tokenContract: props.tokenContract,
        ethBalance: props.ethBalance,
        tokenBalance: props.tokenBalance,
    }
    this.buyTokens = this.buyTokens.bind(this)
    this.sellTokens = this.sellTokens.bind(this)
  }

  sellTokens(tokenAmount) {
      console.log('Selling ' + tokenAmount + ' tokens')
      console.log('tokenContract: ' + this.state.tokenContract)
      this.setState({ loading: true })
      this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        })
        })
    }
  buyTokens(etherAmount) {
    console.log('Purchasing tokens with ' + etherAmount + ' ether')
    console.log('ethSwapContract: ' + this.state.ethSwapContract)
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ 
        value: etherAmount, 
        from: this.state.account }).on('transactionHash', (hash) => {this.setState({ loading: false })})
  }

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
      />
    } else {
      content = <SellForm
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        sellTokens={this.sellTokens}
      />
    }

    if( !this.state.ethSwapContract || !this.state.tokenContract ) {
        content = <p>No EthSwap or tokens contract found in the blockchain network selected</p>
    }

    return (
    <div className="container-fluid mt-5 mx-auto" style={{width: "500px"}}>
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
            >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'sell' })
              }}
            >
            Sell
          </button>
        </div>

        <div className="card mb-4" >

          <div className="card-body">

            {content}

          </div>

        </div>

      </div>
    </div>
    );
  }
}

export default TradeMain;