import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './Firebase';

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {setUser, clearUser} from './actions';
import Spinner from './Spinner';


const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user=> {
            console.log(this.props.isLoading);
            if(user) {
                this.props.setUser(user);
                this.props.history.push('/');
            }
            else{
                this.props.history.push('/login');

                this.props.clearUser();
            }
        })
    }

    render() {

        return this.props.isLoading ? <Spinner /> : (

            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
            </Switch>
        )
    }
  
}

const mapStateToProps = state =>({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateToProps,{setUser,clearUser})(Root));

ReactDOM.render(
<Provider store={store}>
<Router>
<RootWithAuth />
</Router>
</Provider>
, document.getElementById('root'));
registerServiceWorker();
