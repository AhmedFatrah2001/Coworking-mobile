import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Paragraph, Avatar } from 'react-native-paper';
import AuthContext from '../AuthContext';
import CustomAppbar from '../components/CustomAppbar';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const points = [
    {
      title: "Quickly visualize processes",
      description:
        "Use CoWorking’s powerful cards to add tasks with just a few clicks. Avoid wasting time with complicated workflows, and simplify your process using the default setup or customize the Kanban board according to your needs.",
      icon: 'brain',
    },
    {
      title: "Flexible Kanban creation",
      description:
        "CoWorking’s Kanban board has a flexible structure. Drag and drop tasks, and your Kanban board will reformat the cards automatically. Or customize your Kanban tool by color-coding tasks, adding more columns and swimlanes, everything to fit your workflow needs.",
      icon: 'note-edit',
    },
    {
      title: "Focus on what matters",
      description:
        "Simplify workflows and bring focus to teams with CoWorking’s Kanban tool. Improve collaboration by giving everyone task visibility, quickly predicting outcomes, and changing direction if needed.",
      icon: 'target',
    },
    {
      title: "Save time with easy navigation",
      description:
        "Use hotkey shortcuts to create Kanban boards quickly, and tag and assign tasks in just a few clicks. Reduce time prepping and focus more on your strategy and delivery.",
      icon: 'clock',
    },
  ];

  return (
    <View style={styles.container}>
      <CustomAppbar
        navigation={navigation}
        user={user}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to CoWorking</Text>
          <Text style={styles.heroSubtitle}>A Kanban tool for visual planning.</Text>
          <Text style={styles.heroDescription}>
            Stay organized and quickly visualize processes with a Kanban tool. Work in one shared
            space, and move teams toward the same objectives, surfacing dependencies and anticipating
            what’s next.
          </Text>
        </View>
        <View style={styles.cardContainer}>
          {points.map((point, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title
                title={point.title}
                left={(props) => (
                  <Avatar.Icon {...props} icon={point.icon} />
                )}
              />
              <Card.Content>
                <Paragraph>{point.description}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#337CCF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: '#191D88',
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
});
