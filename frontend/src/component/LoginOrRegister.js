import React from "react"
import { loginAttempt, registerAttempt } from "../api"
import { login } from "../utils/auth"
import { Button, Divider, Form, Grid, Icon, Segment, Input, Message } from "semantic-ui-react"
import style from "./LoginOrRegister.module.scss"
import { capitalizeFirstLetter } from "../utils"

export default class Login extends React.Component {
  state = {
    loginEmail: "",
    loginPassword: "",
    regisName: "",
    regisEmail: "",
    regisPassword: "",
    loginError: "",
    regisError: ""
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleLoginSubmit = async () => {
    const { loginEmail, loginPassword } = this.state
    if (loginPassword.length < 6) {
      this.setState({ loginError: "Minimum password length is 6 digit." })
      return
    }
    try {
      const res = await loginAttempt(loginEmail, loginPassword)
      if (res.data.login.access_token) {
        const token = res.data.login.access_token
        login(token)
      } else {
        this.setState({ loginError: "Email / Password is incorrect." })
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleRegisterSubmit = async () => {
    const { regisName, regisEmail, regisPassword } = this.state
    if (regisPassword.length < 6) {
      this.setState({ regisError: "Minimum password length is 6 digit." })
      return
    }

    const name = capitalizeFirstLetter(regisName.trim())
    const email = regisEmail.trim()
    const password = regisPassword.trim()

    try {
      const res = await registerAttempt(name, email, password)
      if (res.data.register.access_token) {
        const token = res.data.register.access_token
        login(token)
      } else {
        this.setState({ regisError: "Email already taken." })
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { loginEmail, loginPassword, regisName, regisEmail, regisPassword, loginError, regisError } = this.state

    return (
      <div className={style.box}>
        <Segment attached="top" className={style.topSegment}>
          <h1 className={style.logo}>Kelinci-Putih</h1>
        </Segment>
        <Segment raised attached className={style.bottomSegment}>
          <Grid>
            <Grid.Row columns="equal">
              <Grid.Column>
                <Segment basic>
                  <h2 className={style.title}>
                    Login <Icon name="key" />
                  </h2>
                  <Form onSubmit={this.handleLoginSubmit}>
                    <Form.Field required>
                      <label>Email</label>
                      <Input
                        name="loginEmail"
                        type="email"
                        placeholder="tony@stark.com"
                        onChange={this.handleChange}
                        value={loginEmail}
                      />
                    </Form.Field>
                    <Form.Field required>
                      <label>Password</label>
                      <Input
                        name="loginPassword"
                        type="password"
                        placeholder="********"
                        icon="key"
                        onChange={this.handleChange}
                        value={loginPassword}
                        autoComplete="on"
                        required
                      />
                    </Form.Field>
                    <Button type="submit" icon="sign in" content="Login" fluid color="blue" />
                  </Form>
                  {loginError && (
                    <Message negative>
                      <p>{loginError}</p>
                    </Message>
                  )}
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment basic>
                  <h2 className={style.title}>
                    Register <Icon name="file alternate" />
                  </h2>
                  <Form onSubmit={this.handleRegisterSubmit}>
                    <Form.Group widths="equal">
                      <Form.Field required>
                        <label>Full Name</label>
                        <Input
                          name="regisName"
                          type="text"
                          placeholder="Tony Stark"
                          onChange={this.handleChange}
                          value={regisName}
                          required
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>Email</label>
                        <Input
                          name="regisEmail"
                          type="email"
                          placeholder="tony@stark.com"
                          onChange={this.handleChange}
                          value={regisEmail}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field required>
                      <label>Password</label>
                      <Input
                        name="regisPassword"
                        type="password"
                        placeholder="********"
                        icon="key"
                        onChange={this.handleChange}
                        value={regisPassword}
                        required
                      />
                    </Form.Field>
                    <Button type="submit" icon="edit" content="Register" fluid color="blue" />
                  </Form>
                  {regisError && (
                    <Message negative>
                      <p>{regisError}</p>
                    </Message>
                  )}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider vertical>
            <Icon name="exchange" />
          </Divider>
        </Segment>
      </div>
    )
  }
}
