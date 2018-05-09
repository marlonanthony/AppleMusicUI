import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Slider,
  Animated,
  PanResponder,
  ScrollView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

export default class App extends Component {

  state = {
    isScrollEnabled: false
  }

  componentWillMount() {
    this.scrollOffset = 0

    this.animation = new Animated.ValueXY({ x: 0, y: screenHeight - 90 })

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if((this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 0) || !this.state.isScrollEnabled && gestureState.dy < 0){
          return true
        } else {
          return false
        }
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.animation.extractOffset()
      },
      onPanResponderMove: (evt, gestureState) => {
        this.animation.setValue({x: 0, y: gestureState.dy})
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.moveY > screenHeight - 120){
          Animated.spring(this.animation.y,{
            toValue: 0,
            tension: 1
          }).start()
        } else if(gestureState.moveY < 120){
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start()
        }
        else if(gestureState.dy < 0){
          this.setState({ isScrollEnabled: true })
          Animated.spring(this.animation.y,{
            toValue: -screenHeight + 120,
            tension: 1
          }).start()
        }
        else if(gestureState.dy > 0){
          this.setState({ isScrollEnabled: false })
          Animated.spring(this.animation.y, {
            toValue: screenHeight - 120,
            tension: 1
          }).start()
        }
      }
    })
  }

  render() {

    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    }

    animatedImageHeight = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [200, 32],
      extrapolate: 'clamp'
    })

    animatedSongTitleOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 500, screenHeight - 90],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    animatedImageMarginLeft = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [screenWidth/2 - 100, 10],
      extrapolate: 'clamp'
    })

    animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: [screenHeight / 2, 90],
      extrapolate: 'clamp'
    })

    animatedSongDetailsOpacity = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 500, screenHeight - 90],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    animatedBackgroundColor = this.animation.y.interpolate({
      inputRange: [0, screenHeight - 90],
      outputRange: ['rgba(0,0,0,0.5)', '#fff'],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor }}>
        <Animated.View 
        {...this.panResponder.panHandlers}
        style={[ animatedHeight, { position: 'absolute', left: 0, right: 0, zIndex: 10, backgroundColor: '#fff', height: screenHeight }]}>
          <ScrollView 
            scrollEnabled = {this.state.isScrollEnabled}
            scrollEventThrottle = {16}
            onScroll = { event => {
              this.scrollOffset = event.nativeEvent.contentOffset.y
            }}
          >  
            <Animated.View style={{ height: animatedHeaderHeight, borderTopWidth: 1, borderTopColor: '#ebe5e5', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center'}}>
                <Animated.View style={{ height: animatedImageHeight, width: animatedImageHeight, marginLeft: animatedImageMarginLeft }}>
                  <Image 
                    style={{ flex: 1, width: null, height: null }}
                    source={require('./images/Tokyo.png')}
                  />
                </Animated.View>
                <Animated.Text style={{ opacity: animatedSongTitleOpacity, fontSize: 18, paddingLeft: 10 }}>skeler - Tokyo</Animated.Text>
              </View>
              <Animated.View style={{ opacity: animatedSongTitleOpacity, flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                <Icon name='md-pause' size={32} />
                <Icon name='md-play' size={32}/>
              </Animated.View>
            </Animated.View>
            <Animated.View style={{ height: animatedHeaderHeight, opacity: animatedSongDetailsOpacity }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22 }}>skeler</Text>
                <Text style={{ fontSize: 18, color: '#fa95ed' }}>Tokyo</Text>
              </View>
              <View style={{ height: 40, width: screenWidth, alignItems: 'center' }}>
                <Slider
                  style={{ width: 300 }}
                  step={1}
                  minimumValue={18}
                  maximumValue={71}
                  value={18}
                />
              </View>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <Icon name='md-rewind' size={40} />
                <Icon name='md-pause' size={50} />
                <Icon name='md-fastforward' size={40} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 }}>
                <Icon name='md-add' size={32} style={{ color: '#fa95ed' }} />
                <Icon name='md-more' size={32} style={{ color: '#fa95ed' }} />
              </View>
            </Animated.View>
            <View style={{ height: 1000 }}></View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
