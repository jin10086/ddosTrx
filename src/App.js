import React, {Component} from 'react';
import './App.css';
import * as artifact from './contracts/Token'



class App extends Component {

    constructor(props) {
        super(props);

        window.tronWeb.setDefaultBlock('latest');

        this.contract = null;
        this.state = {
            address : null,
            balance : null,
            contract : null,
            tokenBalance: null,
            autoRun:false,
        }
    }

    async componentDidMount() {

        let tronWeb = window.tronWeb;
        this.setState({address : tronWeb.defaultAddress.base58});
        let address = tronWeb.address.fromHex(artifact.networks['*'].address);
        console.log(artifact.abi, artifact.networks['*'].address, address)
        this.contract = tronWeb.contract(artifact.abi, address);
        console.log(this.contract)
        await this.refreshBalance();
    }


    // onClick = async () => {
    //     let tronWeb = window.tronWeb;
    //     const sendTransaction = await tronWeb.trx.sendTransaction("TKPzfsXRaDmdKh2GuouXw2eyK2HNH9FNQS", 1000);
    //     console.log('- Transaction:\n' + JSON.stringify(sendTransaction, null, 2), '\n');
    // };

    refreshBalance = async () => {
        let tronWeb = window.tronWeb;
        this.state.address && (this.setState({balance : await tronWeb.trx.getBalance(this.address)}));
    };

    gettoken = async () => {
        let tronWeb = window.tronWeb;
        this.state.address &&  this.contract.getToken().send().then(output => {
            console.group('Contract "call" result');
            console.log('- Output:', output, '\n');
            this.setState({tokenBalance: output.toString()});
            console.groupEnd();
            if (this.state.autoRun){
                this.gettoken();
            }
        });
    };

    changeAutoRun = async() => {
        if (this.state.autoRun === false){
            this.setState({autoRun : true});
        }else{
            this.setState({autoRun : false});
        }
    }


    render() {
        let button;
        if (this.state.autoRun) {
            button = <button onClick={this.changeAutoRun}>关闭自动执行</button>;
          } else {
            button = <button onClick={this.changeAutoRun}>打开自动执行</button>;
          }
        return (
            <div className="App">
                <h1>14点开始！提前进去会被退钱</h1>
                <div>
                    <p>current address</p>
                    <p>{this.state.address}</p>
                    <hr></hr>
                </div>

                    <p>current trx balance</p>
                    <p>{this.state.balance/1e6}</p>
                    <button onClick={this.refreshBalance}>Refresh balance</button>
                    <hr></hr>
                <div>
                </div>
                    <p>get token</p>


                    <p></p>
                    {button}

                
                    <button onClick={this.gettoken}>薅</button>
                    <hr></hr>
                
            </div>
        );
    }
}

export default App;
