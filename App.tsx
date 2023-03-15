import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'

import RootApp from './app'

export default function App() {
	return (
		<SafeAreaView style={styles.container}>
			<RootApp />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
