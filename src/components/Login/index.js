import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {errorMsg: '', errorPresent: false, userIdInput: '', pinInput: ''}

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({errorMsg, errorPresent: true})
  }

  submitUserDetails = async event => {
    event.preventDefault()
    const {userIdInput, pinInput} = this.state
    const userDetails = {user_id: userIdInput, pin: pinInput}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/ebank/login', options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      console.log(data)
      this.onSuccessLogin(data.jwt_token)
    } else  {
      console.log(data)
      this.onFailureLogin(data.error_msg)
    }
  }

  updatePINInput = event => {
    this.setState({pinInput: event.target.value})
  }

  updateUserIdInput = event => {
    this.setState({userIdInput: event.target.value})
  }

  render() {
    const {errorPresent, errorMsg, userIdInput, pinInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-card">
          <img
            className="login-bg-img"
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
          <div className="login-form-container">
            <h1 className="main-heading">Welcome Back</h1>
            <form className="login-form" onSubmit={this.submitUserDetails}>
              <div className="input-container">
                <label className="input-label" htmlFor="userId">
                  User ID
                </label>
                <input
                  className="input-box"
                  type="text"
                  id="userId"
                  onChange={this.updateUserIdInput}
                  value={userIdInput}
                />
              </div>
              <div className="input-container">
                <label className="input-label" htmlFor="pin">
                  PIN
                </label>
                <input
                  className="input-box"
                  type="password"
                  id="pin"
                  onChange={this.updatePINInput}
                  value={pinInput}
                />
              </div>
              <button className="login-btn" type="submit">
                Login
              </button>
              {errorPresent && <p className="error-msg">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
