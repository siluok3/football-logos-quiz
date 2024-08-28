import React from 'react'
import {View, StyleSheet} from 'react-native';

import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode
}

const Layout : React.FC<LayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    padding: 10,
    marginBottom: 30,
  },
})

export default Layout