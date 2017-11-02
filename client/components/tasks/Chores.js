import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  Divider,
} from 'react-native-elements';
import { StackNavigator } from 'react-navigation';

import axios from '../../lib/customAxios';
import HouseNavBack from '../HouseNavBack';

import ChoreList from './ChoreList';


const styles = StyleSheet.create({
  choresContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  choresListContainer: {
    flex: 6,
  },
  divider: {
    backgroundColor: '#262626',
    height: 0.5,
  },
  addChoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitFormColumnButton: {
    flex: 1,
    flexDirection: 'column',
  },
  submitFormColumnInput: {
    flex: 2.5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    flex: 1,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'grey',

  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
});

class ChoresView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chores: [],
      text: '',
      addingChore: false,
    };

    this.getChores = this.getChores.bind(this);
    this.postChore = this.postChore.bind(this);
    this.claimChore = this.claimChore.bind(this);
    this.completeChore = this.completeChore.bind(this);
  }
  componentWillMount() {
    this.getChores();
  }
  getChores() {
    axios.get(`/api/tasks/${this.props.houseId}`)
      .then((tasks) => {
        const onlyChores = tasks.data.filter(chore => chore.type === 'chore');
        onlyChores.forEach((chore) => {
          this.props.roomies.forEach((roomie) => {
            if (roomie.id === chore.posterId) {
              chore.poster = roomie.firstName;
              chore.posterImage = roomie.imageUrl
            } 
            if (roomie.id === chore.claimerId) {
              chore.claimer = roomie.firstName;
              chore.claimerImage = roomie.imageUrl
            }
          });
        });
        this.setState({ chores: onlyChores });
      })
      .catch(err => console.log('Error retrieving tasks', err));
  }
  postChore() {
    axios.post('api/tasks/', {
      houseId: this.props.houseId,
      posterId: this.props.userId,
      text: this.state.text,
      type: 'chore',
    })
      .then(() => {
        this.getChores();
        this.setState({ addingChore: !this.state.addingChore });
      })
      .catch(err => console.log('Error posting task', err));
  }
  claimChore(taskId) {
    axios.put(`api/tasks/${taskId}`, {
      claimerId: this.props.userId,
    })
      .then(() => this.getChores())
      .catch(err => console.log('Error claiming task', err));
  }
  completeChore(taskId) {
    axios.delete(`api/tasks/${taskId}`)
      .then(() => this.getChores())
      .catch(err => console.log('Error deleting task', err));
  }
  render() {
    return (
      <View style={styles.choresContainer}>
        <View style={styles.choresListContainer}>
          <ChoreList
            chores={this.state.chores}
            claimChore={this.claimChore}
            firstName={this.props.firstName}
            completeChore={this.completeChore}
            userId={this.props.userId}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.addChoreContainer}>
          <View style={styles.submitFormColumnInput}>
            <TextInput
              ref={component => this._choreInput = component}
              placeholder="Add Chore"
              style={styles.input}
              onChangeText={task => this.setState({ text: task })}
            />
          </View>
          <View style={styles.submitFormColumnButton}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                this.postChore();
                this._choreInput.setNativeProps({text: ''});
              }}
            >
              <Text style={styles.submitText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    username: store.user.username,
    firstName: store.user.firstName,
    roomies: store.house.roomies,
    houseId: store.user.houseId,
    userId: store.user.id,
  };
};

const ChoresViewRedux = connect(mapStateToProps, null)(ChoresView);

const Chores = StackNavigator({
  Chores: {
    screen: ChoresViewRedux,
    navigationOptions: ({ navigation }) => ({
      title: 'Chores',
      headerLeft: <HouseNavBack navigation={navigation} />,
    }),
  },
});

export default Chores;
