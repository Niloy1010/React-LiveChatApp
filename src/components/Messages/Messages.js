import React, { Component } from 'react'
import {Segment, Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../Firebase';
import Message from './Message';
import {connect} from 'react-redux';
import {setUserPosts} from '../../actions';
import Typing from './Typing';
import Skeleton from './Skeleton'
class Messages extends Component {

    
    state = {
        privateChannel :this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef : firebase.database().ref("messages"),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        messages: [],
        messagesLoading: true,
        numUniqueUsers : '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        isChannelStarred: false,
        typingRef: firebase.database().ref('typing'),
        typingUsers: [],
        connectedRef: firebase.database().ref('.info/connected')
    }

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}`  : '';
    }
    componentDidMount() {
        const{channel, user} = this.state;
        if(channel && user) {
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id,user.uid);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd) {
            this.scollToBottom();
        }
    }

    scollToBottom = ()=> {
        this.messagesEnd.scrollIntoView({
            behavior: 'smooth'
        })
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
        this.addTypingListener(channelId);
    }

    addTypingListener = channelId => {
        let typingUsers = [];
        this.state.typingRef.child(channelId).on('child_added', snap=> {
            if(snap.key !== this.state.user.uid) {
                typingUsers = typingUsers.concat({
                    id: snap.key,
                    name: snap.val()
                })
                this.setState({
                    typingUsers
                })
            }
        })

        this.state.typingRef.child(channelId).on('child_removed', snap=> {
            const index = typingUsers.findIndex(user=> user.id === snap.key);
            if(index!==-1) {
                typingUsers = typingUsers.filter(user=> user.id !== snap.key);
                this.setState({
                    typingUsers
                })
            }
        })

        this.state.connectedRef.on('value', snap=> {
            if(snap.val() === true) {
                this.state.typingRef.child(channelId).child(this.state.user.uid)
                .onDisconnect().remove(err=> {
                    if(err !==null) {
                        console.log(err);
                    }
                })
            }
        })
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap=> {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
            this.countUniqueUser(loadedMessages);
            this.countUserPosts(loadedMessages);
        })
    }

    addUserStarsListener = (channelId,userId) => {
        this.state.usersRef.child(userId).child('starred').once('value').then(data=> {
            if(data.val() !=null) {
                const channelIds = Object.keys(data.val());
                const prevStarred = channelIds.includes(channelId);
                this.setState({isChannelStarred: prevStarred})
            }
        })
    }

    getMessagesRef = () => {
        const {messagesRef,privateMessagesRef, privateChannel} = this.state;
        return privateChannel ? privateMessagesRef : messagesRef
    }

    countUniqueUser = messsages => {
        const uniqueUsers = messsages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        let numUniqueUsers
        if(uniqueUsers.length > 1) {

             numUniqueUsers = `${uniqueUsers.length} users`;
        }
        else{

            numUniqueUsers = `${uniqueUsers.length} user`;
        }
        this.setState({numUniqueUsers})
    }

    countUserPosts = (messages) => {
        let userPosts = messages.reduce((acc, message)=> {
            if(message.user.name in acc) {
                acc[message.user.name].count +=1;
            }
            else{
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc

        },{})
        this.props.setUserPosts(userPosts);
    }

    displayMessages = messages =>{ 
       return messages.length>0 && messages.map(message=> (
            <Message
            key={message.timestamp}
            message={message}
            user={this.state.user}
            />
        )
    )
    };

    handleSearchChange = e => {
        this.setState({
            searchTerm : e.target.value,
            searchLoading: true
        }, ()=> this.handleSearchMessages());
    }

    handeStar = () => {
        this.setState(prevState=>({
            isChannelStarred: !prevState.isChannelStarred
        }),() => this.starChannel())
    }

    starChannel = () =>{
        if(this.state.isChannelStarred) {
            this.state.usersRef.child(`${this.state.user.uid}/starred`)
            .update({
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            })
        }
        else{
            this.state.usersRef.child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove(err=> {
                if(err!==null) {
                    console.log(err);
                }
            })
        }
    }
    displayTypingUsers = users => (
        users.length > 0 && users.map(user=>(
            
                <div style={{display:"flex",alignItems:"center", marginBottom: '0.2em'}} key={user.id}>
                    <span className="user_typing">{user.name} is Typing</span> <Typing />
                </div>
        ))
    )


    handleSearchMessages = () =>  {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc,message)=> {
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({searchResults})
        setTimeout(()=>this.setState({searchLoading: false}), 500 ) 
    }

    displayMessagesSkeleton = loading => {
        
        return loading ? (
            <React.Fragment>
                {[...Array(10)].map((_,i)=> (
                    <Skeleton
                    key={i}
                    />
                ))}
            </React.Fragment>
        ): null;
    }
    render() {

        const {messagesRef,messages,
             channel,user, numUniqueUsers,searchTerm,searchResults, 
             searchLoading,privateChannel,isChannelStarred, typingUsers, messagesLoading} = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                channelName = {this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading={searchLoading}
                privateChannel={privateChannel}
                handleStar={this.handeStar}
                isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessagesSkeleton(messagesLoading)}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                        {this.displayTypingUsers(typingUsers)}
                        <div ref={node => (this.messagesEnd = node)}>

                        </div>
                    </Comment.Group>
                </Segment>

                <MessageForm
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}
                isPrivateChannel = {privateChannel}
                getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}



export default connect(null, {setUserPosts})(Messages);
