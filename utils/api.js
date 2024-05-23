import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config';

const apiUrl = config.apiUrl;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetchProjects = async (userId) => {
  try {
    const [ownedResponse, participatedResponse] = await Promise.all([
      api.get(`/projets/owner/${userId}`),
      api.get(`/projets/participant/${userId}`),
    ]);

    return {
      owned: Array.isArray(ownedResponse.data) ? ownedResponse.data : [],
      participated: Array.isArray(participatedResponse.data) ? participatedResponse.data : [],
    };
  } catch (error) {
    console.log("Error fetching projects:", error);
    return { owned: [], participated: [] };
  }
};

const fetchProjectParticipants = async (projectId) => {
  try {
    const response = await api.get(`/projets/${projectId}/participants`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.log("Error fetching project participants:", error);
    return [];
  }
};

const fetchProjectTableaux = async (projectId) => {
  try {
    const response = await api.get(`/tableaux/by-projet/${projectId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.log("Error fetching project tableaux:", error);
    return [];
  }
};

const forgotPassword = async (email) => {
  const formData = new URLSearchParams();
  formData.append('email', email);

  try {
    await api.post('/utilisateurs/forgot-password', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

const createProject = async (nom) => {
    const token = await AsyncStorage.getItem('token');
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const ownerId = user.userId;
    console.log('Token:', token);
    console.log('Owner ID:', ownerId);
    console.log('Project Name:', nom);
  
    try {
      const response = await api.post('/projets', { nom }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { ownerId },
      });
  
      console.log('Create project response:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };
  const deleteProject = async (projectId) => {
  const token = await AsyncStorage.getItem('token');
  
  try {
    await api.delete(`/projets/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

const createBoard = async (projectId, name) => {
    const token = await AsyncStorage.getItem('token');
    const boardData = {
      nom: name,
      projet: {
        id: projectId,
      },
    };
  
    try {
      const response = await api.post('/tableaux', boardData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  };
  const fetchBoardData = async (boardId) => {
    try {
      const response = await api.get(`/tableauData/${boardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching board data:', error);
      throw error;
    }
  };
  const updateBoardData = async (boardId, newData) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await api.put(`/tableauData/${boardId}`, newData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating board data:', error);
      throw error;
    }
  };
  
  export default {
    fetchProjects,
    fetchProjectParticipants,
    fetchProjectTableaux,
    forgotPassword,
    createProject,
    deleteProject,
    createBoard,
    fetchBoardData,
    updateBoardData,
  };
  