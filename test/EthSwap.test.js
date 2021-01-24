const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Token     = artifacts.require('Token')
const EthSwap   = artifacts.require('EthSwap')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', ([deployer, investor]) => {
    let ethSwap, token
    before (async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        // Transger all tokens to EthSwap (1 milion)
        await token.transfer(ethSwap.address, '1000000000000000000000000')
    })

    describe('EthSwap deployment test suite', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })
        it('contract has tokens', async () => {
            const balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), '1000000000000000000000000')
        })
    })

    describe('Token deployment test suite', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe ('buy tokens test suite', async () => {
        let buyResult
        before (async () => {
            buyResult = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')});
        })

        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal( investorBalance.toString(), web3.utils.toWei('100', 'ether'))

            // Check ethSwap balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('999900', 'ether'))
            
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))
        })
        it('Check that buying tokens produce a pruchased event', async () => {
            const event = buyResult.logs[0].args
            assert.equal(event.eventName, 'TokensPurchased')
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), web3.utils.toWei('100', 'ether'))
            assert.equal(event.rate.toString(), '100')
        })
    })


    describe ('sell tokens test suite', async () => {
        let sellResult
        before (async () => {
            await token.approve(ethSwap.address, web3.utils.toWei('100', 'ether'), {from: investor})
            sellResult = await ethSwap.sellTokens(web3.utils.toWei('100', 'ether'), {from: investor});
        })

        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal( investorBalance.toString(), web3.utils.toWei('0', 'ether'))
            
            // Check ethSwap balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1000000', 'ether'))
            
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))
        })
        it('Check that selling tokens produce a sold event', async () => {
            const event = sellResult.logs[0].args
            assert.equal(event.eventName, 'TokensSold')
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), web3.utils.toWei('100', 'ether'))
            assert.equal(event.rate.toString(), '100')
        })
        it('Investor cant sell more tokens than they have', async () => {
            await ethSwap.sellTokens(web3.utils.toWei('50000000'), {from: investor}).should.be.rejected;
        })
    })    
})