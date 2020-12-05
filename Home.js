import React, {Fragment} from 'react';
import { 
  Image,
  Alert, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList, 
  Text, 
  View,
  Dimensions,
  StatusBar 
} from 'react-native';
import ClearCache from 'react-native-clear-cache';

//gets the size of the Bottom Bar and stores it
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nowLoading: true,
      firstLoad: false,
      date_updated: ""
    };
  }

  //fetches the data before application loads
  componentDidMount() {

    // clears the app's cache
    ClearCache.clearAppCache(() => { console.log("Cleaned cache successfully.") });

    const { firstLoad } = this.state;

    if(!firstLoad){
      fetch(global.QUIZ_DATA_URL)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.quizzes, date_updated: json.date_updated });
      })
      .catch((error) => Alert.alert(error))
      .finally(() => {
        this.setState({ nowLoading: false, firstLoad: true });
      });
    }

    
  }

  //reloads data
  refreshData = () => {

    // clears the app's cache
    ClearCache.clearAppCache(() => { console.log("Cleaned cache successfully.") });

    this.setState({ nowLoading: true });
    fetch(global.QUIZ_DATA_URL)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.quizzes, date_updated: json.date_updated });
      })
      .catch((error) => Alert.alert(error))
      .finally(() => {
        this.setState({ nowLoading: false });
      });
  }

  //handles screen navigation and passes through selected quiz if available
  onPress = (item) => {

    const { navigation } = this.props;
    
    if(item.availability){
      navigation.navigate('QuizScreen', { title: item.title, quiz_id: item.id })
    }
    else{
      Alert.alert("Work in progress...", "Coming soon!");
    }

  }

  render() {
    const { data, nowLoading, date_updated } = this.state;
    return (
      <Fragment>
        {nowLoading ?
          <View style={styles.isLoading}>
            <ActivityIndicator size="large" animating={true} color={"blue"} />
            <Text>Now Loading</Text>
          </View>
      : (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.refreshData} activeOpacity={0.5} style={{ width: 37.5, height: 37.5, alignItems: "center", justifyContent: "center", position: "absolute", top: "5%", bottom:0, left: "5%", right:0 }}>
          <Image source={require('./assets/refresh.png')} style={styles.buttonImageIconStyle} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'serif', fontWeight: "bold", fontSize: 35, textAlign: "center" }}>What Is You?</Text>
        <Text style={{ textAlign: "center", fontSize: 15 }}>(Updated as of: {date_updated})</Text>
        <Text style={{ textAlign: "right", fontSize: 14, position: "absolute", top: "7.5%", bottom: 0, left: 0, right: "10%" }}>v1.1.2</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.buttons} onPress={this.onPress.bind(this, item)}>
              <Text style={{ color: "white" }}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
        )}
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: navbarHeight
  },
  isLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: "orange",
    width: "100%",
    alignItems: "center"
  },
  buttonImageIconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
});