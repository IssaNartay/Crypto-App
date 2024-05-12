import { fakeFecthCrypto, fetchAssets } from "../api"
import { useContext, createContext, useState, useEffect } from "react"
import { percentDifference } from "../utils"

const CryptoContext = createContext({
	assets: [],
	crypto: [],
	loading: false,
})

export function CryptoContextProvider({ children }) {
	const [loading, setLoading] = useState(false) // Индикатор загрузки данных
	const [crypto, setCrypto] = useState([]) // Массив инфо про крипты
	const [assets, setAssets] = useState([]) // Массив где будет инфо про сколько валюты в порфеле

	function mapAssets(assets, result) {
		return assets.map((asset) => {
			const coin = result.find((c) => c.id === asset.id) // нахождение конкретной монетки
			return {
				grow: asset.price < coin.price, // Определение роста монеты
				growPercent: percentDifference(asset.price, coin.price), // Определение разницы роста в процентах
				totalAmount: asset.amount * coin.price, // Опред общее количество суммы
				totalProfit: asset.amount * coin.price - asset.amount * asset.price, //
				name: coin.name,
				...asset, // Разница покупки монеты
			}
		})
	}

	useEffect(() => {
		async function preload() {
			setLoading(true)
			const { result } = await fakeFecthCrypto() // Пока не сделается запрос по крипте
			const assets = await fetchAssets() // Пока не седлается запрос на ассеты

			setAssets(mapAssets(assets, result))
			setCrypto(result)
			setLoading(false)
		}

		preload()
	}, [])

	function addAsset(newAsset) {
		setAssets((prev) => mapAssets([...prev, newAsset], crypto))
	}

	return (
		<CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>
			{children}
		</CryptoContext.Provider>
	)
}

export default CryptoContext

export function useCrypto() {
	return useContext(CryptoContext)
}
