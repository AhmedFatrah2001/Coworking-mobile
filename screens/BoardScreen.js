import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text, Card, IconButton, Button, TextInput, useTheme } from 'react-native-paper';
import api from '../utils/api';
import CustomAppbar from '../components/CustomAppbar';

export default function BoardScreen({ route, navigation }) {
  const { boardId } = route.params;
  const [boardData, setBoardData] = useState({
    lanes: [
      { id: '1', cards: [], title: 'To do', currentPage: 1 },
      { id: '2', cards: [], title: 'In progress', currentPage: 1 },
      { id: '3', cards: [], title: 'Done', currentPage: 1 },
      { id: '4', cards: [], title: 'Backlog', currentPage: 1 },
    ],
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const fetchedBoardData = await api.fetchBoardData(boardId);
        setBoardData(fetchedBoardData);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoardData();
  }, [boardId]);

  useEffect(() => {
    const updateData = async () => {
      try {
        await api.updateBoardData(boardId, boardData);
        console.log('Updated boardData:', JSON.stringify(boardData));
      } catch (error) {
        console.error('Error updating board data:', error);
      }
    };
    updateData();
  }, [boardData, boardId]);

  const handleAddCard = (laneId) => {
    setBoardData((prevBoardData) => {
      const newCard = {
        id: Date.now().toString(),
        label: 'Card Label',
        title: 'Card Title',
        description: 'Card Description',
        laneId,
      };
      const updatedLanes = prevBoardData.lanes.map((lane) => {
        if (lane.id === laneId) {
          return { ...lane, cards: [...lane.cards, newCard] };
        }
        return lane;
      });
      return { ...prevBoardData, lanes: updatedLanes };
    });
  };

  const handleDeleteCard = (laneId, cardId) => {
    setBoardData((prevBoardData) => {
      const updatedLanes = prevBoardData.lanes.map((lane) => {
        if (lane.id === laneId) {
          return { ...lane, cards: lane.cards.filter((card) => card.id !== cardId) };
        }
        return lane;
      });
      return { ...prevBoardData, lanes: updatedLanes };
    });
  };

  const handleEditCard = (laneId, card) => {
    setSelectedCard({ ...card, laneId });
    setEditModalVisible(true);
  };

  const handleSaveCard = () => {
    const { laneId, id, title, label, description } = selectedCard;
    setBoardData((prevBoardData) => {
      const updatedLanes = prevBoardData.lanes.map((lane) => {
        if (lane.id === laneId) {
          const updatedCards = lane.cards.map((card) => {
            if (card.id === id) {
              return { ...card, title, label, description };
            }
            return card;
          });
          return { ...lane, cards: updatedCards };
        }
        return lane;
      });
      return { ...prevBoardData, lanes: updatedLanes };
    });
    setEditModalVisible(false);
  };

  const moveCard = (laneId, cardId, direction) => {
    setBoardData((prevBoardData) => {
      let cardToMove = null;
      let sourceLaneIndex = null;
      let targetLaneIndex = null;

      prevBoardData.lanes.forEach((lane, index) => {
        if (lane.id === laneId) {
          sourceLaneIndex = index;
          cardToMove = lane.cards.find((card) => card.id === cardId);
        }
      });

      if (cardToMove) {
        targetLaneIndex = sourceLaneIndex + direction;
        if (targetLaneIndex >= 0 && targetLaneIndex < prevBoardData.lanes.length) {
          const sourceLane = { ...prevBoardData.lanes[sourceLaneIndex], cards: prevBoardData.lanes[sourceLaneIndex].cards.filter((card) => card.id !== cardId) };
          const targetLane = { ...prevBoardData.lanes[targetLaneIndex], cards: [...prevBoardData.lanes[targetLaneIndex].cards, { ...cardToMove, laneId: prevBoardData.lanes[targetLaneIndex].id }] };

          const updatedLanes = prevBoardData.lanes.map((lane, index) => {
            if (index === sourceLaneIndex) return sourceLane;
            if (index === targetLaneIndex) return targetLane;
            return lane;
          });

          return { ...prevBoardData, lanes: updatedLanes };
        }
      }

      return prevBoardData;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#3179BA' }]}>
      <CustomAppbar navigation={navigation} user={{ username: 'User' }} />
      <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
        {boardData.lanes.map((lane) => (
          <Card key={lane.id} style={[styles.laneCard, { backgroundColor: '#E3E3E3' }]}>
            <Card.Content>
              <Text style={styles.laneTitle}>{lane.title}</Text>
              {lane.cards.map((card) => (
                <Card key={card.id} style={styles.card}>
                  <Card.Title
                    title={<Text style={styles.cardTitle}>{card.title}</Text>}
                    subtitle={<Text style={styles.cardLabel}>{card.label}</Text>}
                  />
                  <Card.Content>
                    <Text>{card.description}</Text>
                  </Card.Content>
                  <View style={styles.cardActions}>
                    <IconButton
                      icon="arrow-left"
                      onPress={() => moveCard(lane.id, card.id, -1)}
                      disabled={boardData.lanes[0].id === lane.id}
                    />
                    <IconButton
                      icon="arrow-right"
                      onPress={() => moveCard(lane.id, card.id, 1)}
                      disabled={boardData.lanes[boardData.lanes.length - 1].id === lane.id}
                    />
                    <IconButton
                      icon="pencil"
                      onPress={() => handleEditCard(lane.id, card)}
                    />
                    <IconButton
                      icon="delete"
                      onPress={() => handleDeleteCard(lane.id, card.id)}
                    />
                  </View>
                </Card>
              ))}
              <Button onPress={() => handleAddCard(lane.id)}>Add Task</Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      {selectedCard && (
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Card</Text>
              <TextInput
                label="Title"
                value={selectedCard.title}
                onChangeText={(text) => setSelectedCard({ ...selectedCard, title: text })}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <TextInput
                label="Label"
                value={selectedCard.label}
                onChangeText={(text) => setSelectedCard({ ...selectedCard, label: text })}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <TextInput
                label="Description"
                value={selectedCard.description}
                onChangeText={(text) => setSelectedCard({ ...selectedCard, description: text })}
                mode="outlined"
                multiline
                style={styles.textArea}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <Button mode="contained" onPress={handleSaveCard} style={styles.button}>
                Save
              </Button>
              <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={styles.button}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  laneCard: {
    width: 300,
    marginRight: 16,
  },
  laneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 12,
    color: 'gray',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
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
  button: {
    marginVertical: 10,
  },
});
