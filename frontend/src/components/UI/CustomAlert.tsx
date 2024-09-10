import React, {useEffect} from 'react'
import {Animated, Modal, View, StyleSheet, Text, Button} from 'react-native';

interface CustomAlertProps {
  visible: boolean
  onClose: () => void
  title: string
  message: string
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, onClose, title, message }) => {
  const scaleValue = new Animated.Value(0)

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start()
    }
  }, [visible])

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleValue }] }]}>
          <Text style={styles.congratulationsText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>
          <Button title="Got you" onPress={onClose} />
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default CustomAlert