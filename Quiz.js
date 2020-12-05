import React, { Fragment } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";

const PrevButton = ({ onPress, curr_question }) => (
  <TouchableOpacity onPress={onPress} disabled={curr_question == 1 ? true : false} style={[ styles.buttonContainer, curr_question == 1 ? styles.disabled : styles.enabled ]}>
    <Text style={styles.buttonText}>Back</Text>
  </TouchableOpacity>
);

const NextButton = ({ onPress, curr_question, question_count, score }) => (
  <TouchableOpacity onPress={onPress} disabled={score[curr_question - 1] ? false : true} style={[ styles.buttonContainer, score[curr_question - 1] ? styles.enabled : styles.disabled ]}>
    <Text style={styles.buttonText}>{curr_question == question_count ? "Submit" : "Next"}</Text>
  </TouchableOpacity>
);

const RetakeButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.buttonContainer, styles.enabled ]}>
    <Text style={styles.buttonText}>Retake Quiz</Text>
  </TouchableOpacity>
);

const A_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

const B_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

const C_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

const D_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

const E_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

const F_Button = ({ onPress, title, isSelected, isPortrait }) => (
  <TouchableOpacity onPress={onPress} style={[ styles.answerContainer, isPortrait ? {width: "100%"} : {width: "50%"}, isSelected ? styles.isSelected : styles.isNotSelected ]}>
    <Text style={styles.choiceText}>{title}</Text>
  </TouchableOpacity>
);

export default class Quiz extends React.PureComponent {
  constructor(props) {
    super(props);

    Dimensions.addEventListener('change', () => {

      //gets the size of the Bottom Bar and stores it
      const screenHeight = Dimensions.get("screen").height;
      const windowHeight = Dimensions.get("window").height;
      const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
      const isPortrait = ((Dimensions.get("window").width < Dimensions.get("window").height)? true : false);

      this.setState({
          screenHeight: screenHeight,
          windowHeight: windowHeight,
          navbarHeight: navbarHeight,
          isPortrait: isPortrait
      });
    });

    this.state = {
      data: [],
      score: [],
      nowLoading: true,
      curr_question: 1,
      answers: [],
      isDone: false,
      nowCalculating: false,
      message: "",
      sub_message: "",
      total: 0,
      screenHeight: 0,
      windowHeight: 0,
      navbarHeight: 0,
      isPortrait: true
    };
  }

  goBack = () => {
    const { curr_question } = this.state;

    this.setState({ curr_question: curr_question - 1 });
  };

  calulateResults() {
    const { data, score } = this.state;

    this.setState({ isDone: true, nowCalculating: true });

    var totalScore = score.reduce(function (a, b) {
      return a + b;
    }, 0);

    this.setState({ total: totalScore });

    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].lower_bound <= totalScore && totalScore <= data.results[i].upper_bound) {
        this.setState({ message: data.results[i].message });
        if (data.results[i].sub_message) {
          this.setState({ sub_message: data.results[i].sub_message });
        }
        break;
      }
    }

    this.setState({ nowCalculating: false });
  }

  goForward = () => {
    const { curr_question, data } = this.state;

    if (data.question_count != curr_question) {
      this.setState({ curr_question: curr_question + 1 });
    } else {
      this.calulateResults();
    }
  };

  selectAnswer(choice, points) {
    const { curr_question, score, answers } = this.state;

    if (score[curr_question - 1]) {
      let newArray = [...score];
      newArray[curr_question - 1] = points;
      this.setState({ score: newArray });
    } else {
      const nextState = [...score, points];
      this.setState({ score: nextState });
    }

    if (answers[curr_question - 1]) {
      let newArray = [...answers];
      newArray[curr_question - 1] = choice;
      this.setState({ answers: newArray });
    } else {
      const nextState = [...answers, choice];
      this.setState({ answers: nextState });
    }
  }

  reset = () => {
    
    const { curr_question, score, answers, isDone } = this.state;

    let tempArr1 = [...score];
    tempArr1 = [];

    let tempArr2 = [...answers];
    tempArr2 = [];

    this.setState({ isDone: false, curr_question: 1, score: tempArr1, answers: tempArr2 });

  }

  componentDidMount() {
    const { navigation, route } = this.props;
    const { title, quiz_id } = route.params;

    navigation.setOptions({
      title: title,
    });

    fetch(global.QUIZ_DATA_URL)
      .then((response) => response.json())
      .then((json) => {
        var new_data = json.question_data.find(
          (item) => item.id.indexOf(quiz_id) > -1
        );

        //gets the size of the Bottom Bar and stores it
        const screenHeight = Dimensions.get("screen").height;
        const windowHeight = Dimensions.get("window").height;
        const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
        const isPortrait = ((Dimensions.get("window").width < Dimensions.get("window").height)? true : false);

        this.setState({ screenHeight: screenHeight, windowHeight: windowHeight, navbarHeight: navbarHeight, data: new_data, isPortrait: isPortrait });
      })
      .catch((error) => Alert.alert(error))
      .finally(() => {
        this.setState({ nowLoading: false });
      });
  }

  render() {
    const { data, nowLoading, curr_question, score, answers, isDone, nowCalculating, message, sub_message, total } = this.state;
    return (
      <Fragment>
        {isDone ? (
          <Fragment>
            {nowCalculating ? (
              <View style={styles.isLoading}>
                <ActivityIndicator size="large" animating={true} color={"blue"} />
                <Text>Calculating Results</Text>
              </View>
            ) : (
              <View style={{ paddingBottom: this.state.navbarHeight }}>
                <Text style={[{ fontFamily: 'serif', paddingTop: 30, paddingLeft: 30, paddingRight: 30, fontSize: 35, textAlign: "center", fontWeight: "bold" }, this.state.isPortrait ? {paddingTop: 30} : {paddingTop: 15}]}>{message}</Text>
                { sub_message ? <Text style={{ paddingTop: 5, paddingLeft: 30, paddingRight: 30, fontSize: 25, textAlign: "center" }}>{sub_message}</Text> : <Text style={{ paddingTop: 5, paddingLeft: 30, paddingRight: 30, fontSize: 25, textAlign: "center" }}>is your result!</Text> }
                <Text style={[{ paddingLeft: 30, paddingRight: 30, fontSize: 25, textAlign: "center", fontWeight: "bold" }, this.state.isPortrait ? {paddingTop: 30} : {paddingTop: 5}]}>Your score: {total}</Text>
                <View style={[styles.retakeButton, this.state.isPortrait? {paddingTop: this.state.windowHeight * 0.775} : {paddingTop: this.state.windowHeight * 0.65}]}>
                  <RetakeButton onPress={this.reset} />
                </View>
              </View>
            )}
          </Fragment>
        ) : (
          <Fragment>
            {nowLoading ? (
              <View style={styles.isLoading}>
                <ActivityIndicator size="large" animating={true} color={"blue"} />
                <Text>Now Loading</Text>
              </View>
            ) : (
              <View style={{ paddingBottom: this.state.navbarHeight }}>
                <Text style={[styles.questionText, { paddingTop: this.state.windowHeight * 0.05 }]}>{data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).question}</Text>
                <View style={[styles.choices, { height: this.state.windowHeight * 0.5, paddingTop: this.state.windowHeight * 0.05 } ]}>
                  <A_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "A" ? true : false } onPress={() => this.selectAnswer("A", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).A_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).A} />
                  <B_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "B" ? true : false } onPress={() => this.selectAnswer("B", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).B_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).B} />
                  { (data.choice_count >= 3)? <C_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "C" ? true : false } onPress={() => this.selectAnswer("C", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).C_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).C} /> : <Fragment></Fragment> }
                  { (data.choice_count >= 4)? <D_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "D" ? true : false } onPress={() => this.selectAnswer("D", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).D_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).D} /> : <Fragment></Fragment> }
                  { (data.choice_count >= 5)? <E_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "E" ? true : false } onPress={() => this.selectAnswer("E", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).E_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).E} /> : <Fragment></Fragment> }
                  { (data.choice_count == 6)? <F_Button isPortrait={(this.state.isPortrait)} isSelected={ answers[curr_question - 1] == "F" ? true : false } onPress={() => this.selectAnswer("F", data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).F_points)} title={data.questions_points.find((item) => item.question_number.toString().indexOf(curr_question.toString()) > -1).F} /> : <Fragment></Fragment> }
                </View>
                <View style={[styles.buttons, this.state.isPortrait? {paddingTop: this.state.windowHeight * 0.775} : {paddingTop: this.state.windowHeight * 0.65} ]}>
                  <PrevButton onPress={this.goBack} curr_question={curr_question} />
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>{curr_question} of {data.question_count}</Text>
                  <NextButton score={score} onPress={this.goForward} curr_question={curr_question} question_count={data.question_count} />
                </View>
              </View>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  questionText: { 
    paddingLeft: 30, 
    paddingRight: 30, 
    fontSize: 25, 
    textAlign: "center"
  },
  choices: {
    paddingLeft: 40,
    paddingRight: 40,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  isLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    borderRadius: 10,
    padding: 12,
  },
  disabled: {
    backgroundColor: "grey",
  },
  enabled: {
    backgroundColor: "blue",
  },

  answerContainer: {
    marginTop: 5,
    width: "100%",
    borderRadius: 10,
    padding: 12,
    justifyContent: "center"
  },

  isSelected: {
    backgroundColor: "green",
  },
  isNotSelected: {
    backgroundColor: "orange",
  },
  buttons: {
    paddingLeft: 40,
    paddingRight: 40,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute"
  },
  retakeButton: {
    paddingLeft: 40,
    paddingRight: 40,
    width: "100%",
    flex: 1,
    position: "absolute"
  },
  choiceText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});