import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import Constants from 'expo-constants';
import Svg, { Circle, Line } from 'react-native-svg';

const { height, width } = Dimensions.get('window');
const centerX = width / 2,
  centerY = height / 2;

const Spaceship = {
  uri: 'https://www.pngfind.com/pngs/m/588-5885004_spaceship-8-bit-heart-png-transparent-png.png',
};

const spaceBackground = {
  uri: 'https://media1.giphy.com/media/81VJDndncyVyKBou4C/giphy.gif?cid=790b76111a2cbfca2a748924d63be23be34b4e7f9afb4333&rid=giphy.gif&ct=g',
};

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    _subscribe();
    StatusBar.setHidden(true, 'fade');
    return () => {
      _unsubscribe();
    };
  }, []);

  const _setInterval = () => {
    DeviceMotion.setUpdateInterval(100);
  };

  const _subscribe = () => {
    DeviceMotion.addListener((devicemotionData) => {
      setData(devicemotionData.rotation);
    });
    _setInterval();
  };

  const _unsubscribe = () => {
    DeviceMotion.removeAllListeners();
  };

  let { beta, gamma } = data;
  gamma = round(-gamma);
  beta = round(-beta);

  const spaceshipElement = (
    <>
    <Line
        x1={centerX + 10 - (gamma * width) / 3.14}
        y1={centerY + 20 - (beta * height) / 3.14}
        x2={centerX + 30 - (gamma * width) / 3.14}
        y2={centerY + 140 - (beta * height) / 3.14}
        stroke="blue"
        strokeWidth="10"
      />
      <Line
        x1={centerX - (gamma * width) / 3.14}
        y1={centerY + 20 - (beta * height) / 3.14}
        x2={centerX - (gamma * width) / 3.14}
        y2={centerY + 140 - (beta * height) / 3.14}
        stroke="lightblue"
        strokeWidth="35"
      />
      <Circle
        cx={centerX - (gamma * width) / 3.14}
        cy={centerY - (beta * height) / 3.14}
        r="30"
        fill="gray"
      />
      <Circle
        cx={centerX + 2 - (gamma * width) / 3.14}
        cy={centerY - 14 - (beta * height) / 3.14}
        r="5"
        fill="lightgrey"
      />
      <Circle
        cx={centerX - 20 - (gamma * width) / 3.14}
        cy={centerY + 4 - (beta * height) / 3.14}
        r="5"
        fill="lightgrey"
      />
      <Circle
        cx={centerX + 12 - (gamma * width) / 3.14}
        cy={centerY + 20 - (beta * height) / 3.14}
        r="5"
        fill="lightgrey"
      />
    </>
  );

  const gammaAlign = gamma <= 1.57 && gamma >= -1.57;
  playBackgroundMusic()
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#BBB',
      }}>
      <ImageBackground source={spaceBackground} style={styles.BackGimage}>
        {gammaAlign && (
          <Svg
            height={height}
            width={width}
            originX={centerX}
            originY={centerY}>
            {spaceshipElement}
          </Svg>
        )}
        {!gammaAlign && <Text color="lightgray">Keep the Screen on Top!</Text>}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  BackGimage: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    rotation: '180',
  },
});

function playBackgroundMusic() {
  (async () => {
    try {
      await Audio.setIsEnabledAsync(true);
      const sound = new Audio.Sound();
      await sound.loadAsync(require('./assets/space-odyssey-SBA-300418554-preview.mp3'));
      await sound.setIsLoopingAsync(true);
      await sound.playAsync(true);
    } catch (error) {
      console.error(error);
    }
  })();
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}
