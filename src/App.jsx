import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {TheSafe_ABI,TheSafe_Address} from './TheSafeConfig'
import {createWalletClient,createPublicClient,http,custom,parseEther,formatEther} from 'viem'
import {sepolia} from 'viem/chains'



function App() {
    const [Connection,setConnection] = useState(false);
    const [Accounts,setAccounts] = useState()
    const [Balance,setBalance] = useState()
    const [DepositAmount, setDepositAmount] = useState()
    const [withdrawAmount,setWithdrawAmount] = useState()

  const theSafeWallet = createWalletClient({
  chain:sepolia,
  transport:custom(window.ethereum)
  })

  const theSafePublic = createPublicClient({
    chain: sepolia,
    transport:http()
  })



  const Connect = async () => {
    const _accounts = await theSafeWallet.requestAddresses()
    setAccounts(_accounts)
    setConnection(true)
    console.log('Accounts connected:',Accounts)

  }

  const Disconnect = async () => {
      await window.ethereum.request({method:'wallet_revokePermissions',params:[{eth_accounts:{}}]})
      setConnection(false)
  }

  const BalanceCheck = async () => {
      const _balance = await theSafePublic.getBalance({address:TheSafe_Address})
      setBalance(formatEther(_balance))
      console.log('The balance',_balance,Balance)
  }

  const Deposit = async () => {
    const TransactionHash = await theSafeWallet.writeContract({
      address:TheSafe_Address,
      abi:TheSafe_ABI,
      functionName:"userDeposit",
      args:[],
      account:Accounts[0],
      value:parseEther(DepositAmount)
    })

    console.log(TransactionHash)

  }

   const userWithdraw = async () => {
    const _withdrawAmount= parseEther(withdrawAmount)
    const TransactionHash = await theSafeWallet.writeContract({
      address:TheSafe_Address,
      abi:TheSafe_ABI,
      functionName:"userWithdraw",
      args:[_withdrawAmount],
      account:Accounts[0]
    })

    console.log(TransactionHash)

  }

  const deployerWithdraw = async () => {

    const TransactionHash = await theSafeWallet.writeContract({
      address:TheSafe_Address,
      abi:TheSafe_ABI,
      functionName:"deployerWithdraw",
      args:[],
      account:Accounts[0]

    })

    console.log(TransactionHash)

  }


  return (
    <>
     <h1>The Safe</h1>
     <button onClick={Connect} style={{display: Connection ? 'none': 'inline-block'}}>Connect</button>
     <button onClick={Disconnect} style={{display: !Connection ? 'none': 'inline-block'}}>Disconnect</button>

     <h2>Contract Balance</h2>
     <button onClick={BalanceCheck}>Balance</button>
     <p>Balance:{Balance}</p>

     <h2>User Save Amount</h2>
     <input type="text" placeholder='Eth Amount' onChange={(element)=>{setDepositAmount(element.target.value); console.log(DepositAmount)}}/>
     <button onClick={Deposit}>Deposit</button>

     <h2>User Withdraw Amount</h2>
     <input type="text" placeholder='Eth Amount' onChange={(element)=>{setWithdrawAmount(element.target.value); console.log(withdrawAmount)}}/>
     <button onClick={userWithdraw}>Withdraw</button>

     <h2>Deployer Withdraw</h2>
     <button onClick={deployerWithdraw}>Withdraw</button>

    </>
  )
}

export default App
