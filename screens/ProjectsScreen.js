import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Text, Avatar, IconButton, TextInput, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAppbar from '../components/CustomAppbar';
import AuthContext from '../AuthContext';

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState({ owned: [], participated: [] });
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProjects = async () => {
      const userInfo = await AsyncStorage.getItem('user');
      const user = JSON.parse(userInfo);
      const userId = user?.userId;

      if (userId) {
        const fetchedProjects = await api.fetchProjects(userId);
        setProjects(fetchedProjects);
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const newProject = await api.createProject(newProjectName);
      setProjects((prevProjects) => ({
        ...prevProjects,
        owned: [...prevProjects.owned, newProject],
      }));
      setCreateModalVisible(false);
      setNewProjectName('');
    } catch (error) {
      alert('Failed to create project: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleDeleteProject = async () => {
    if (confirmationCode !== 'DELETE') {
      alert('Please enter the correct confirmation code.');
      return;
    }

    try {
      await api.deleteProject(projectToDelete);
      setProjects((prevProjects) => ({
        owned: prevProjects.owned.filter((p) => p.id !== projectToDelete),
        participated: prevProjects.participated,
      }));
      setDeleteDialogVisible(false);
      setConfirmationCode('');
    } catch (error) {
      alert('Failed to delete project: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const showDeleteDialog = (projectId) => {
    setProjectToDelete(projectId);
    setDeleteDialogVisible(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
    setConfirmationCode('');
  };

  const renderProjectCard = (project, isOwned) => (
    <Card style={styles.card} key={project.id}>
      <Card.Title
        title={project.nom}
        subtitle={isOwned ? <Text style={styles.ownerText}>Owner: {project.owner.username}</Text> : `Owner: ${project.owner.username}`}
        left={(props) => <Avatar.Icon {...props} icon={isOwned ? "account-check" : "account-arrow-up"} />}
        right={(props) => (
          <>
            {isOwned && (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => showDeleteDialog(project.id)}
                iconColor='red'
              />
            )}
            <IconButton
              {...props}
              icon="information"
              onPress={() => navigation.navigate('ProjectDetails', { projectId: project.id })}
            />
          </>
        )}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#191D88" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomAppbar navigation={navigation} user={user} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Owned Projects</Text>
        {projects.owned.map((project) => renderProjectCard(project, true))}
        <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
          <Card style={styles.addCard}>
            <IconButton
              icon="plus"
              size={24}
            />
          </Card>
        </TouchableOpacity>
        <Text style={styles.title}>Participated Projects</Text>
        {projects.participated.map((project) => renderProjectCard(project, false))}
      </ScrollView>
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            <TextInput
              label="Project Name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              mode="outlined"
              style={styles.input}
            />
            <Button mode="contained" onPress={handleCreateProject} style={styles.button}>
              Create
            </Button>
            <Button mode="outlined" onPress={() => setCreateModalVisible(false)} style={styles.button}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Paragraph>To confirm deletion, please enter the confirmation code: DELETE</Paragraph>
            <TextInput
              label="Confirmation Code"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button onPress={handleDeleteProject}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
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
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectsScreen;
