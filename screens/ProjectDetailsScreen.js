import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Card, IconButton, Avatar, Button, TextInput } from 'react-native-paper';
import api from '../utils/api';
import CustomAppbar from '../components/CustomAppbar';
import AuthContext from '../AuthContext';

export default function ProjectDetailsScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [participants, setParticipants] = useState([]);
  const [boards, setBoards] = useState([]);
  const [participantsVisible, setParticipantsVisible] = useState(false);
  const [createBoardModalVisible, setCreateBoardModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const fetchedParticipants = await api.fetchProjectParticipants(projectId);
      const fetchedBoards = await api.fetchProjectTableaux(projectId);
      setParticipants(fetchedParticipants);
      setBoards(fetchedBoards);
    };

    fetchProjectDetails();
  }, [projectId]);

  const toggleParticipants = () => {
    setParticipantsVisible(!participantsVisible);
  };

  const handleCreateBoard = async () => {
    try {
      const newBoard = await api.createBoard(projectId, newBoardName);
      setBoards((prevBoards) => [...prevBoards, newBoard]);
      setCreateBoardModalVisible(false);
      setNewBoardName('');
    } catch (error) {
      alert('Failed to create board: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <View style={styles.container}>
      <CustomAppbar navigation={navigation} user={user} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={toggleParticipants}>
          <Text style={styles.participantsTitle}>
            {participantsVisible ? 'Hide Participants' : 'Show Participants'}
          </Text>
        </TouchableOpacity>
        {participantsVisible && (
          participants.map((participant) => (
            <Card key={participant.id} style={styles.card}>
              <Card.Title
                title={participant.username}
                subtitle={participant.email}
                left={(props) => (
                  <Avatar.Text
                    {...props}
                    label={participant.username[0].toUpperCase()}
                    style={styles.avatar}
                  />
                )}
              />
            </Card>
          ))
        )}
        <Text style={styles.title}>Boards</Text>
        {boards.map((board) => (
          <TouchableOpacity key={board.id} onPress={() => navigation.navigate('Board', { boardId: board.id })}>
            <Card style={styles.card}>
              <Card.Content style={styles.boardContent}>
                <ImageBackground
                  source={require('../assets/board.png')}
                  style={styles.boardImage}
                  imageStyle={styles.boardImageStyle}
                >
                  <Text style={styles.boardTitle}>{board.nom}</Text>
                </ImageBackground>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
        <Card style={styles.addCard}>
          <IconButton
            icon="plus"
            size={24}
            onPress={() => setCreateBoardModalVisible(true)}
          />
        </Card>
      </ScrollView>
      <Modal
        visible={createBoardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateBoardModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCreateBoardModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Board</Text>
                <TextInput
                  label="Board Name"
                  value={newBoardName}
                  onChangeText={setNewBoardName}
                  mode="outlined"
                  style={styles.input}
                />
                <Button mode="contained" onPress={handleCreateBoard} style={styles.button}>
                  Create
                </Button>
                <Button mode="outlined" onPress={() => setCreateBoardModalVisible(false)} style={styles.button}>
                  Cancel
                </Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  participantsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#191D88',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#FFC436',
  },
  addCard: {
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#191D88',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
  boardContent: {
    alignItems: 'center',
  },
  boardImage: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  boardImageStyle: {
    borderRadius: 10,
    opacity: 0.3,
  },
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
