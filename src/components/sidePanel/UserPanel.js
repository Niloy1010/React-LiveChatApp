import React, { Component } from 'react';
import {Dropdown, Grid, Header,Icon,Image,Modal, Input, Button} from 'semantic-ui-react';
import firebase from '../../Firebase';
import {connect} from 'react-redux';
import AvatarEditor from 'react-avatar-editor'

class UserPanel extends Component {

    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: '',
        croppedImage:'',
        blob: '',
        storageRef: firebase.storage().ref(),
        uplaodCroppedImage: '',
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    }

    componentDidMount() {
        this.setState({user: this.props.currentUser})
    }

    openModal = () => {
        this.setState({
            modal:true
        })
    }


    closeModal = () => {
        this.setState({
            modal:false
        })
    }
    dropDownOptions = () => [
        {
            key:'user',
        text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span
            onClick={this.openModal}
            >Change Avatar</span>
        },
        {
            key:'signout',
            text: <span
            onClick={this.handleSignOut}
            >Sign Out </span>
        }
    ];

    uplaodCroppedImage = () => {

        const {storageRef, userRef,blob,metadata} = this.state;
        storageRef.child(`avatars/users/${userRef.uid}`)
        .put(blob,metadata)
        .then(snap=> {
            snap.ref.getDownloadURL().then(downloadURL => {
                this.setState({uplaodCroppedImage: downloadURL}
            , () => 
                this.changeAvatar()

                )
            })
        })
    }


    changeAvatar = () => {
        this.state.userRef.updateProfile({
            photoURL: this.state.uplaodCroppedImage
        })
        .then(()=> {
            console.log("PHOTOURL UPDATED");
            this.closeModal();
        })
        .catch(err=> {
            console.log(err);
        })

        this.state.usersRef.child(this.state.user.uid).update({avatar: this.state.uplaodCroppedImage})
        .then(()=> {
            console.log("User avatar updated");
        })
        .catch(err=> {
            console.log(err);
        })
    }


    handleSignOut = () => {
        firebase.auth().signOut().then(()=> {
            console.log("signout");
        })
    }
    handleChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if(file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', ()=> {
                this.setState({
                    previewImage : reader.result
                })
            })
        }
    }

    handleCropImage = () => {
        if(this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob=> {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }
    render() {
        const currentUser = this.props.currentUser;
        const {primaryColor} = this.props;
        const {user , modal, previewImage, croppedImage} = this.state;
        return (
                <Grid style={{background: primaryColor}}>
                    <Grid.Column>
                        <Grid.Row style={{padding: '1.2em', margin:0}}>
                            {/*App header */}
                            <Header inverted floated="left" as="h2">
                                <Icon name="rocketchat" />
                                <Header.Content>LiveChat</Header.Content>
                            </Header>

                            
                        {/*DropDown */}
                        <Header style={{padding:'.25em'}}  as="h4" inverted>
                            <Dropdown
                            trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}</span>
                            }
                            
                            options={this.dropDownOptions()}
                            />
                        </Header>
                        </Grid.Row>
                        
                        <Modal basic open={modal} onClose={this.closeModal}>
                            <Modal.Header>Change Avatar</Modal.Header>
                            <Modal.Content>
                                <Input
                                onChange={this.handleChange}
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                                />
                                <Grid centered stackable columns={2}>
                                    <Grid.Row centered>
                                        <Grid.Column
                                        className="ui center aligned grid"
                                        >
                                            {previewImage && (
                                                <AvatarEditor
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                                ref={node => (this.avatarEditor = node)}
                                                />
                                            )}

                                        </Grid.Column>

                                        <Grid.Column>
                                                
                                                {croppedImage && (<Image 
                                                style={{margin: '3.5em auto'}}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                                />)}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Modal.Content>
                            <Modal.Actions>
                               {croppedImage && <Button color="green" inverted onClick={this.uplaodCroppedImage} >
                                    <Icon
                                    name="save"
                                    />Change Avatar
                                </Button>}

                                <Button color="green"
                                onClick={this.handleCropImage}
                                inverted >
                                    <Icon
                                    name="image"
                                    />Preview
                                </Button>

                                <Button color="red" inverted
                                onClick={this.closeModal}
                                >
                                    <Icon
                                    name="remove"
                                    />Cancel
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                </Grid>
        )
    }
}

export default UserPanel;