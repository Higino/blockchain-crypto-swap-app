import React, { Component } from 'react';
import AppHome from './AppHome';
import TradeMain from './TradeMain'

class MainPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ethBalance: props.ethBalance,
      tokenBalance: props.tokenBalance,
      tokenContract: props.tokenContract,
      ethSwapContract: props.ethSwapContract
    }
  }

  render() {
    return (
        <div className='row'>
            <div className='col-4'>
                <AppHome callbackLoadBlockChainData={this.props.callbackLoadBlockChainData}/>
            </div>
            <div className='col-8'>
                <TradeMain  ethBalance={this.state.ethBalance}
                            tokenBalance={this.state.tokenBalance}
                            tokenContract={this.state.tokenContract}
                            ethSwapContract={this.state.ethSwapContract}
                            />
            </div>
        </div>
    );
  }
}

export default MainPanel;
