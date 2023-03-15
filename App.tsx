import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
		backgroundColor: '#fafafa',
		flex: 1,
	},
})
