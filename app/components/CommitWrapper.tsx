import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, View, Pressable, StyleSheet } from 'react-native'

import { Commit } from '../types'

type CommitWrapperProps = {
	item: Commit
	selectedCommits: Commit[]

	handleChange: (sha: string) => void
}

export const CommitWrapper = ({ item, selectedCommits, handleChange }: CommitWrapperProps) => {
	const isItemChecked = selectedCommits.find(selectedCommit => selectedCommit.sha === item.sha)

	return (
		<Pressable onPress={() => handleChange(item.sha)}>
			<View style={styles.container}>
				<MaterialCommunityIcons
					name={isItemChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
					size={24}
					color="#333"
				/>
				<View style={styles.commitData}>
					<Text>{item.authorName}</Text>
					<Text numberOfLines={1}>{item.sha}</Text>
					<Text numberOfLines={2}>{item.message}</Text>
				</View>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	commitData: {
		marginLeft: 8,
	},
	container: {
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		borderColor: '#333',
		borderWidth: 1,
		flexDirection: 'row',
		marginVertical: 2,
		padding: 3,
	},
})
