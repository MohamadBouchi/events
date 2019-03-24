import React, { Component } from 'react'
import './Auth.css'
import AuthContext from '../context/auth-context'

class Auth extends Component {

  state = {
    isLogin: true
  }

  static contextType = AuthContext

  constructor(props){
    super(props)

    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()
  }


  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  }

  submitHandler = (event) => {

    event.preventDefault()

    const email = this.emailEl.current.value
    const password = this.passwordEl.current.value

    if (email.trim().length === 0 || password.trim().length === 0)
      return
    

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    }

    if(!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }  
        `,
        variables: {
          email: email,
          password: password
        }
      }
    }

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201)
        throw new Error ('failed')

        return res.json()
    })
    .then(resData => {
      if (resData.data.login.token){
        this.context.login(resData.data.login.token,
                            resData.data.login.userId,
                            resData.data.login.tokenExpiration)
      }
    })
    .catch(err => {
      console.log(err)
    })

  }

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">email</label>
          <input ref={this.emailEl} type="email" id="email" />
        </div>
        <div className="form-control">
          <label htmlFor="password">password</label>
          <input type="password" ref={this.passwordEl} id="password" />
        </div>

        <div className="form-action">
          <button type="submit">submit</button>
          <button type="button" onClick={this.switchModeHandler}>switch to {this.state.isLogin ? 'signUp': 'login'}</button>
        </div>
      </form>
    )
  }
}


export default Auth

