import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeRepoData = async (id: string, value: unknown) => {
	try {
		const jsonValue = JSON.stringify(value)

		await AsyncStorage.setItem(id, jsonValue)
	} catch (e) {
		console.error(e)
	}
}

export const getRepoData = async (id: string) => {
	try {
		const jsonValue = await AsyncStorage.getItem(id)

		return jsonValue !== null ? JSON.parse(jsonValue) : null
	} catch (e) {
		console.error(e)
	}
}
