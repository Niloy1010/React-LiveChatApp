import React, { Component } from 'react';
import mime from 'mime-types';
import {Modal, Input, Button, Icon} from 'semantic-ui-react'

class FileModal extends Component {

    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    addFile = (e) =>  {
        const file = e.target.files[0];
        if(file) {
            this.setState({
                file: file
            })
        }
    }
    sendFile = () => {
        const {uploadFile,closeModal} = this.props;
        const {file} = this.state;
        if(file!==null) {
            if(this.isAuthorized(file.name)){
                const metadata = {contentType: mime.lookup(file.name)};
                uploadFile(file, metadata);
                closeModal();
            }
        }
    }

    isAuthorized = (filename) => this.state.authorized.includes(mime.lookup(filename));

    clearFile = ()=> this.setState({file:null})
    render() {

        const {modal, closeModal} = this.props;
        return (
            <Modal
            basic 
            open={modal}
            onClose={closeModal}
            >

            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input
                fluid
                label="File type: jpg, png"
                name=""
                type="file"
                onChange={this.addFile}
                /> 

            </Modal.Content>
            <Modal.Actions>
                <Button
                onClick={this.sendFile}
                color="green"
                inverted
                >
                <Icon name="checkmark" />Send
                </Button>

                
                <Button
                color="red"
                inverted
                onClick={closeModal}
                >
                <Icon name="remove" />Cancel
                </Button>
            </Modal.Actions>
            </Modal>
        )
    }
}
export default FileModal;
