pragma solidity ^0.5.0;

import './Token.sol';


contract EthSwap {
    string  public name = "EthSwap Instant Exchange";
    Token   public token;
    uint    public rate = 100;
    
    event TokensPurchased (
        string eventName,
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold (
        string eventName,
        address account,
        address token,
        uint amount,
        uint rate
    );


    constructor(Token _token) public {
        token = _token;
    }

    function sellTokens(uint _amount) public {
        // User cant sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of ther to redeem
        uint etherAmount = _amount / rate;

        // Require that there is enough balance to sell
        require(address(this).balance >= etherAmount);

        // Perfom sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        // Emit sold event
        emit TokensSold('TokensSold', msg.sender, address(token), _amount, rate);
    }

    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require that ethswap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        // Transfer tokens to user
        token.transfer(msg.sender, tokenAmount);


        // Emit purchase event
        emit TokensPurchased('TokensPurchased', msg.sender, address(token), tokenAmount, rate);
    }
}