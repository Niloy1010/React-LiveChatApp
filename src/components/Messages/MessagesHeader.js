import React, { Component } from 'react';
import {Header, Segment,Input,Icon} from 'semantic-ui-react'

class MessagesHeader extends Component {
    render() {
        const {channelName,numUniqueUsers
            ,handleSearchChange,searchLoading,privateChannel,
            handleStar,
            isChannelStarred
        } = this.props;

        return (
            <Segment clearing>
                
                <Header fluid="true" as="h2" floated="left" style={{matginBottom:0}}>
                    <span>
                    {channelName}
                    {!privateChannel && <Icon
                    onClick={handleStar}
                    name={isChannelStarred ? 'star' : 'star outline'} color={isChannelStarred ? 'yellow' : 'black'}
                    
                    
                    />
                    
                    }
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                <Header floated="right">
                    <Input
                    loading={searchLoading}
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    onChange={handleSearchChange}
                    placeholder="Search Messages"
                    />
                </Header>
            </Segment>
        )
    }
}
export default  MessagesHeader;
