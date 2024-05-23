import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Menu, Avatar, Text } from 'react-native-paper';
import AuthContext from '../AuthContext';

const CustomAppbar = ({ navigation, user }) => {
  const { logout } = React.useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    closeMenu();
    logout(navigation);
  };

  return (
    <Appbar.Header style={styles.appbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/logoText.png')} style={styles.logo} />
      </TouchableOpacity>
      <Appbar.Content />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }
      >
        <View style={styles.menuItem}>
          <Avatar.Text size={24} label={user ? user.username[0].toUpperCase() : ''} style={styles.avatar} />
          <Text style={styles.username}>{user ? user.username : ''}</Text>
        </View>
        <Menu.Item onPress={() => navigation.navigate('Projects')} title="Projects" />
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#191D88',
  },
  logo: {
    height: 40,
    width: 100,
    resizeMode: 'contain',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    backgroundColor: '#FFC436',
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});

export default CustomAppbar;
