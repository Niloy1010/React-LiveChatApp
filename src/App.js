import React from 'react';
import {Grid} from 'semantic-ui-react'
import ColorPanel from './components/colorPanel/ColorPanel'
import SidePanel from './components/sidePanel/SidePanel'
import Messages from './components/Messages/Messages'
import MetaPanel from './components/metaPanel/MetaPanel';
import {connect} from 'react-redux'
import './App.css';
import { createStore } from 'redux';

 const App = ({currentUser,currentChannel, isPrivateChannel,userPosts,primaryColor,secondaryColor})=> { 
  return (
      <Grid columns="equal" className="app" style={{background: secondaryColor,paddingTop:"20px",textAlign:"center"}}>
        <ColorPanel
        key={currentUser && currentUser.name}
        currentUser={currentUser}
        />
        <SidePanel
        key={currentUser && currentUser.uid}
        primaryColor={primaryColor}
        currentUser={currentUser} />
    <Grid.Column
    style={{marginLeft:320}}
    >
        <Messages
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
        />
    </Grid.Column>
    <Grid.Column
    width={4}
    >
         <MetaPanel
         key={currentChannel && currentChannel.name}
         isPrivateChannel={isPrivateChannel}
         currentChannel={currentChannel}
         userPosts={userPosts}
         />
    </Grid.Column>
      </Grid>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel : state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
})
export default connect(mapStateToProps)(App);
