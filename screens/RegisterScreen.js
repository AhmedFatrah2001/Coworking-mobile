import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AuthContext from '../AuthContext';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const { register } = useContext(AuthContext);

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    tempErrors.email = emailRegex.test(email) ? "" : "Enter a valid email address.";
    tempErrors.username = username ? "" : "This field is required.";
    tempErrors.password = password ? "" : "This field is required.";
    tempErrors.confirmPassword = confirmPassword && confirmPassword === password
      ? ""
      : "Passwords must match and cannot be empty.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register(username, email, password);
        navigation.navigate('Login');
      } catch (error) {
        alert('Registration failed');
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
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary } }}
        error={!!errors.email}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: theme.colors.primary } }}
        error={!!errors.confirmPassword}
      />
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
