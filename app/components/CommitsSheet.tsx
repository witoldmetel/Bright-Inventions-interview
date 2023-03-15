import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, View, Pressable, Platform, Linking, StyleSheet } from 'react-native'
import { BottomSheet } from 'react-native-btr'

import { Commit } from '../types'

type CommitsSheetProps = {
	isVisible: boolean
	commitsToSend: Commit[]

	toggleCommitsSheet: () => void
}

export const CommitsSheet = ({ isVisible, toggleCommitsSheet, commitsToSend }: CommitsSheetProps) => {
	const handleSend = (app: string) => {
		toggleCommitsSheet()

		const message = JSON.stringify(commitsToSend)

		let url
		switch (app) {
			case 'message':
				url = Platform.select({
					ios: `sms:&body=${message}`,
					android: `sms:?body=${message}`,
				})
				break
			case 'email':
				url = `mailto::?subject=Commits&body=${message}`
				break
			default:
				console.error(`Invalid app: ${app}`)
				return
		}

		Linking.canOpenURL(url)
			.then(supported => {
				if (!supported) {
					console.error(`Unable to handle URL: ${url}`)
				} else {
					return Linking.openURL(url)
				}
			})
			.catch(error => console.error(`Error handling URL: ${url}`, error))
	}

	return (
		<BottomSheet visible={isVisible} onBackButtonPress={toggleCommitsSheet} onBackdropPress={toggleCommitsSheet}>
			<View style={styles.container}>
				<View style={styles.contentSection}>
					<Text style={styles.title}>Send commits via:</Text>
					<View style={styles.options}>
						<Pressable onPress={() => handleSend('message')}>
							<MaterialIcons name="sms" size={44} color="#000" />
						</Pressable>
						<Pressable onPress={() => handleSend('email')}>
							<MaterialIcons name="email" size={44} color="#000" />
						</Pressable>
					</View>
				</View>
			</View>
		</BottomSheet>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#fff',
		height: 150,
		justifyContent: 'center',
		width: '100%',
	},
	contentSection: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	options: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
	title: {
		fontSize: 20,
		padding: 20,
		textAlign: 'center',
	},
})
