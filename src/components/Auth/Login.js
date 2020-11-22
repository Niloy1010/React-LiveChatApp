import React, { Component } from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import firebase from '../../Firebase';

class Login extends Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    
   

    handleInputError = (errors, inputName) => {
       return errors.some(error=> error.message.toLowerCase().includes(inputName))?'error': '';
    }

   

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            this.setState({errors:[], loading: true})
           
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedUser => {
                console.log(signedUser)
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                });
            });
                
            }
        }
    
        isFormValid = ({email,password}) => email && password;


  
    displayErrors = errors => errors.map((error,i)=> <p key={i}>{error.message}</p>)

    render() {

        const {email, password,errors,loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="violet" textAlign="center">
                        <icon name="puzzle piece" color="violet" />
                            Login to QuickChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            


                            
                            <Form.Input fluid name="email" value={email} icon="mail" iconPosition="left"
                            placeholder="Email Adress" onChange={this.handleChange} type="email"
                            className={this.handleInputError(errors,'email')} />


                            
                        <Form.Input fluid name="password" value={password} icon="lock" iconPosition="left"
                            placeholder="Password" onChange={this.handleChange} type="password"
                            className={this.handleInputError(errors,'password')}
                            />


                            
                      
                        <Button disabled={loading} className={loading ? 'loading' : ''} color="violet" fluid size="large">Submit</Button>
                        </Segment>
                        {this.state.errors.length>0 ?
                        (<Message negative>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>) : null}
                    </Form>
                    <Message>Not a User?
                    <Link to='/register'>Register</Link>


                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}
export default Login;
