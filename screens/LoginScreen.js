import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AuthContext from '../AuthContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "This field is required.";
    tempErrors.password = password ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(username, password);
        navigation.navigate('Home');
      } catch (error) {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary } }}
        error={!!errors.username}
      />
      {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary } }}
        error={!!errors.password}
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#EEF7FF',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 15,
    backgroundColor: '#191D88',
  },
  link: {
    color: '#1450A3',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
});
