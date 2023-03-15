import React from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'

type ButtonProps = {
	title: string
	disabled?: boolean

	onPress: () => void
}

export function Button({ onPress, title, disabled }: ButtonProps) {
	return (
		<Pressable
			// eslint-disable-next-line react-native/no-inline-styles
			style={[styles.button, { backgroundColor: disabled ? '#333' : '#4078c0' }]}
			onPress={onPress}
			disabled={disabled}>
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		borderRadius: 4,
		elevation: 3,
		justifyContent: 'center',
		marginVertical: 12,
		paddingHorizontal: 32,
		paddingVertical: 12,
	},
	text: {
		color: '#fafafa',
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		lineHeight: 21,
	},
})
