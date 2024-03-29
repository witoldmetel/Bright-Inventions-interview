import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, FlatList } from 'react-native'

import { Commit, RepoData } from '../types'
import { Button } from './Button'
import { CommitsSheet } from './CommitsSheet'
import { CommitWrapper } from './CommitWrapper'

type RepositoryWrapperProps = {
	repositoryData: RepoData
}

export function RepositoryWrapper({ repositoryData }: RepositoryWrapperProps) {
	const [selectedCommits, setSelectedCommits] = useState<Commit[]>([])
	const [isVisible, setIsVisible] = useState<boolean>(false)

	useEffect(() => {
		setSelectedCommits([])
	}, [repositoryData])

	const selectCommit = (sha: string) => {
		const commitToSend = repositoryData.commits.find(commit => sha === commit.sha)
		const isCommitSelected = selectedCommits.some(selectedCommit => selectedCommit.sha === sha)

		setSelectedCommits(prevCommits => {
			if (isCommitSelected) {
				return prevCommits.filter(item => item.sha !== sha)
			} else {
				return [...prevCommits, commitToSend]
			}
		})
	}

	const toggleCommitsSheet = () => setIsVisible(!isVisible)

	return repositoryData ? (
		<View style={styles.repoDataContainer}>
			<Text>Repository ID: {repositoryData.id}</Text>
			{repositoryData.commits ? (
				<View>
					<Text>Latest commits:</Text>
					<FlatList
						data={repositoryData.commits}
						keyExtractor={item => item.sha}
						renderItem={({ item }) => (
							<CommitWrapper item={item} selectedCommits={selectedCommits} handleChange={selectCommit} />
						)}
						contentContainerStyle={styles.commitsContainer}
					/>
					<Button title="Send" disabled={selectedCommits.length === 0} onPress={toggleCommitsSheet} />
				</View>
			) : null}
			<CommitsSheet isVisible={isVisible} toggleCommitsSheet={toggleCommitsSheet} commitsToSend={selectedCommits} />
		</View>
	) : null
}

const styles = StyleSheet.create({
	commitsContainer: {
		flexGrow: 1,
	},
	repoDataContainer: {
		flex: 1,
	},
})
