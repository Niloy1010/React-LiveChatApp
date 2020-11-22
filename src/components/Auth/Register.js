import React, { Component } from 'react';
import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import firebase from '../../Firebase';
import md5 from 'md5';

class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)){
            error = {message : "Fill in all fields"};
             this.setState({errors: [
                error
            ]});
            return false;
        }
        else if(!this.isPasswordValid(this.state)) {
            
            error = {message : "Password Invalid"};
                this.setState({errors: [
                    error
                ]});
                return false;
        }
        else{

        }
        return true;
    }

    isPasswordValid = ({ password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false;
        }
        else if(password !== passwordConfirmation) {
            return false;
        }
        else{
            
        return true;
        }
    }

    handleInputError = (errors, inputName) => {
       return errors.some(error=> error.message.toLowerCase().includes(inputName))?'error': '';
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid()) {
            this.setState({errors:[], loading: true})
            firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser=> {
                console.log(createdUser);
                
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                }).then(()=> {
                    this.saveUser(createdUser).then(()=> {
                        console.log('user saved');
                    })
                   
                    this.setState({
                            loading: false
                        })
                })
                
                
            })
           
            .catch(err=> {
                console.log(err); 
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(err)
                })
            })
        }
        
    }


    saveUser = createdUser => {
        return  this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })

    }
    displayErrors = errors => errors.map((error,i)=> <p key={i}>{error.message}</p>)

    render() {

        const {username, email, password, passwordConfirmation,errors,loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="blue" textAlign="center">
                        <icon name="puzzle piece" color="orange" />
                            Register for QuickChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username"
                            value={username} icon="user" iconPosition="left"
                            placeholder="Username" onChange={this.handleChange} type="text"
                            
                            />


                            
                            <Form.Input fluid name="email" value={email} icon="mail" iconPosition="left"
                            placeholder="Email Adress" onChange={this.handleChange} type="email"
                            className={this.handleInputError(errors,'email')} />


                            
                        <Form.Input fluid name="password" value={password} icon="lock" iconPosition="left"
                            placeholder="Password" onChange={this.handleChange} type="password"
                            className={this.handleInputError(errors,'password')}
                            />


                            
                        <Form.Input fluid name="passwordConfirmation" value={passwordConfirmation} icon="repeat" iconPosition="left"
                            placeholder="Confirm Password" onChange={this.handleChange} type="password"
                            className={this.handleInputError(errors,'password')}
                            />

                        <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                        </Segment>
                        {this.state.errors.length>0 ?
                        (<Message negative>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>) : null}
                    </Form>
                    <Message>Already a User?
                    <Link to='/login'>Login</Link>


                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}
export default Register;
