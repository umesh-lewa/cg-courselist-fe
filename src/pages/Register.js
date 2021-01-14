import React, { useContext, useState } from 'react';
import { Grid, Button, Form } from 'semantic-ui-react';

function Register(props) {

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");

    const setUsername = (e) => {
        setUser({ ...user, username: e.target.value })
    }
    const setEmail = (e) => {
        setUser({ ...user, email: e.target.value })
    }
    const setPassword = (e) => {
        setUser({ ...user, password: e.target.value })
    }
    const setConPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const [registerMessage, setRegisterMessage] = useState("")


    const registerUser = async () => {

        setLoading(true);

        const userData = { ...user }

        setUser({
            username: "",
            email: "",
            password: ""
        })

        if (!userData.username) {
            setLoading(false);
            return setRegisterMessage('Username is required');
        }

        if (!userData.email) {
            setLoading(false);
            return setRegisterMessage('Email is required');
        }

        if (!userData.password) {
            setLoading(false);
            return setRegisterMessage('Password is required');
        }

        if (userData.password != confirmPassword) {
            setLoading(false);
            return setRegisterMessage('Passwords do not match');
        }

        let response = await fetch("https://cps-sma-umesh.herokuapp.com/users/signup", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })

        response = await response.json();
        setLoading(false);
        setRegisterMessage(response.message)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        registerUser()
    }

    return (

        <Grid columns={3}>
            <Grid.Row>

                <Grid.Column>

                </Grid.Column>

                <Grid.Column>
                    <div className="form-container">
                        <Form onSubmit={handleSubmit} noValidate className={loading ? 'loading' : ''}>
                            <h1>Register</h1>
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label="Username"
                                placeholder="Username.."
                                name="username"
                                type="text"
                                value={user.username}
                                onChange={setUsername}
                            />
                            <Form.Input
                                icon='mail'
                                iconPosition='left'
                                label="Email"
                                placeholder="Email.."
                                name="email"
                                type="email"
                                value={user.email}
                                onChange={setEmail}
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label="Password"
                                placeholder="Password.."
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={setPassword}
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label="Confirm Password"
                                placeholder="Confirm Password.."
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={setConPassword}
                            />
                            <Button type="submit" primary>
                                Register
                            </Button>
                        </Form>
                        {registerMessage ? <h3>{registerMessage}</h3> : null}
                    </div>
                </Grid.Column>

                <Grid.Column>

                </Grid.Column>
            </Grid.Row>
        </Grid>

    )

}

export default Register;