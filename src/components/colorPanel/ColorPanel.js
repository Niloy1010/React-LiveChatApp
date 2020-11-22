import React, { Component } from 'react';
import {Sidebar,Menu,Divider,Button, Modal, Icon, Label, Segment} from 'semantic-ui-react';
import {SliderPicker} from 'react-color';
import firebase from '../../Firebase';
import {connect} from 'react-redux';
import {setColors} from '../../actions'

class ColorPanel extends Component {

    state= {
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        userColors: []

    }

    componentWillUnmount() {
        this.removeListener();
    }

    removeListener = ()=> {
        this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListener(this.state.user.uid);
        }
    }

    addListener = userId => {
        let userColors = [];
        this.state.usersRef.child(`${userId}/colors`)
        .on('child_added', snap => {
            userColors.unshift(snap.val());
            this.setState({
                userColors
            })
        })
    }

    openModal = () => {
        this.setState({
            modal: true
        })
    }

    closeModal = () => {
        this.setState({
            modal: false
        })
    }

    handleSaveColor = () => {
        console.log("In");
        if(this.state.primary && this.state.secondary) {
            console.log("In2");
            this.saveColors(this.state.primary, this.state.secondary)
        }
        
    }

    saveColors = (primary,secondary) => {
        this.state.usersRef.child(`${this.state.user.uid}/colors`)
        .push()
        .update({
            primary, 
            secondary
        })
        .then(()=> {
            console.log("Color Added");
            this.closeModal()
        })
        .catch(err=>  {
            console.log(err);
        })
    }

    displayUserColors = (colors) => {
       return colors.length> 0 && colors.map((color,i) => (
            <React.Fragment >
                <Divider />
                <div
                 className="color__container" 
                 onClick={()=> this.props.setColors(color.primary, color.secondary)}
                 >
                    <div className="color__square" style={{background:color.primary}}>
                        <div className="color__overlay" style={{background: color.secondary}}></div>
                    </div>
                </div>
            </React.Fragment>
        ))
    }

    handleChangePrimary = color => this.setState({primary: color.hex})
    handleChangeSecondary = color =>  this.setState({secondary: color.hex})
    render() {
        const {modal,primary,secondary ,userColors} = this.state;

        return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
                >
                    <Divider />
                    <Button icon="add" size="small" color="blue" onClick={this.openModal}/>
                    {this.displayUserColors(userColors)}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Choose Theme</Modal.Header>
                        
                        <Segment
                        inverted
                        >
                        <Label content="Primary Color" />
                        <SliderPicker color={primary} onChange={this.handleChangePrimary} />
                        </Segment>
                        
                        <Segment>
                        <Label content="Secondary Color" />
                        <SliderPicker color={secondary} onChange={this.handleChangeSecondary} />
                        </Segment>


                        <Modal.Content>
                            <Modal.Actions>
                                <Button color="green"
                                    onClick={this.handleSaveColor}
                                     inverted>
                                    <Icon name="checkmark"
                                    /> Save Colors
                                </Button>

                                
                                <Button color="red" inverted onClick={this.closeModal}>
                                    <Icon name="remove" /> Cancel
                                </Button>

        
                            </Modal.Actions>
                        </Modal.Content>
                    </Modal>
            </Sidebar>
        )
    }
}



export default connect(null,{setColors})(ColorPanel);
