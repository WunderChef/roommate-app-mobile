import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HouseNavBack from '../HouseNavBack';
import socket from '../../socket';
import { PRIMARY, WHITE, BG_L_GRAY, BG_M_GRAY } from '../../styles/common';
import MessageView from './MessageView';
import CustomAvatar from './CustomAvatar';

const styles = StyleSheet.create({
  sendButton: {
    marginRight: 8,
    marginBottom: 3,
    marginLeft: 5,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: BG_L_GRAY,
  },
});

class GeneralMessagesView extends Component {
  onSend(messages = []) {
    socket.emit('addChatMessage', this.props.houseId, messages);
  }

  renderAvatar(props) {
    return (
      <CustomAvatar
        {...props}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: BG_M_GRAY,
          },
          right: {
            backgroundColor: PRIMARY,
          },
        }}
      />
    );
  }

  renderMessageView(props) {
    return (
      <MessageView
        {...props}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View>
          <FontAwesome
            style={styles.sendButton}
            name="send"
            color={PRIMARY}
            size={35}
          />
        </View>
      </Send>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BG_L_GRAY }}>
        <GiftedChat
          messages={this.props.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.userId,
            name: `${this.props.firstName} ${this.props.lastName}`,
            avatar: this.props.imageUrl,
          }}
          renderAvatar={this.renderAvatar}
          renderBubble={this.renderBubble}
          renderMessage={this.renderMessageView}
          renderSend={this.renderSend}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.user.id,
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  imageUrl: state.user.imageUrl,
  houseId: state.house.id,
  messages: state.message.messages,
});

const GeneralMessagesRedux = connect(mapStateToProps, null)(GeneralMessagesView);

// turning this into a stack naviagtor so can have a matching header with
// the rest of the application
const GeneralMessages = StackNavigator({
  GeneralMessages: {
    screen: GeneralMessagesRedux,
    navigationOptions: ({ navigation }) => ({
      title: 'Messages',
      headerLeft: <HouseNavBack navigation={navigation} />,
      headerStyle: {
        backgroundColor: PRIMARY,
        borderBottomColor: PRIMARY,
      },
      headerTitleStyle: {
        color: WHITE,
      },
    }),
  },
});

export default GeneralMessages;
