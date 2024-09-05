import React from 'react'
import {Animated} from 'react-native';

interface AnimatedAnswerResponseProps {
  styles: Object
  animatedValue: Animated.Value
  text: string
}

const AnimatedAnswerResponse: React.FC<AnimatedAnswerResponseProps> = ({ styles, animatedValue, text}) => {
  return (
    <Animated.Text
      style={[
        styles,
        {
          opacity: animatedValue,
          transform: [{ scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.2],
            })}],
        },
      ]}
    >
      {text}
    </Animated.Text>
  )
}

export default AnimatedAnswerResponse