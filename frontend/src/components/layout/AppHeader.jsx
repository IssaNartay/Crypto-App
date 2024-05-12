import { Layout, Select, Space, Button, Modal, Drawer } from "antd"
import { useCrypto } from "../../context/crypto-context"
import { useEffect, useState } from "react"
import CoinInfoModal from "../CoinInfoModal"
import AddAssetForm from "../AddAssetForm"
const headerStyle = {
	width: "100%",
	textAlign: "center",
	height: 60,
	padding: "1rem",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
}

const options = [
	{
		label: "China",
		value: "china",
		emoji: "🇨🇳",
		desc: "China (中国)",
	},
	{
		label: "USA",
		value: "usa",
		emoji: "🇺🇸",
		desc: "USA (美国)",
	},
	{
		label: "Japan",
		value: "japan",
		emoji: "🇯🇵",
		desc: "Japan (日本)",
	},
	{
		label: "Korea",
		value: "korea",
		emoji: "🇰🇷",
		desc: "Korea (韩国)",
	},
]

export default function AppHeader() {
	const { crypto } = useCrypto()
	const [select, setSelect] = useState(false)
	const [modal, setModal] = useState(false)
	const [coin, setCoin] = useState(null)
	const [drawer, setDrawer] = useState(false)

	useEffect(() => {
		const keypress = (event) => {
			if (event.key === "/") {
				setSelect((prev) => !prev)
			}
		}

		document.addEventListener("keypress", keypress)

		return () => document.removeEventListener("keypress", keypress)
	}, [])

	const handleSelect = (value) => {
		console.log(`${value}`)
		setModal(true)
		setCoin(crypto.find((c) => c.id === value))
	}

	return (
		<Layout.Header style={headerStyle}>
			<Select
				style={{
					width: "250px",
				}}
				value="press / to open"
				open={select}
				onClick={() => setSelect((prev) => !prev)}
				onSelect={handleSelect}
				options={crypto.map((coin) => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={(option) => (
					<Space>
						<img src={option.data.icon} style={{ width: 20 }} />
						{option.data.label}
					</Space>
				)}
			/>{" "}
			<Button type="primary" onClick={() => setDrawer(true)}>
				Add Asset
			</Button>
			<Modal open={modal} onCancel={() => setModal(false)} footer={null}>
				<CoinInfoModal coin={coin}></CoinInfoModal>
			</Modal>
			<Drawer
				title="Add Asset"
				onClose={() => setDrawer(false)}
				width={600}
				open={drawer}
				destroyOnClose
			>
				<AddAssetForm onClose={() => setDrawer(false)}></AddAssetForm>
			</Drawer>
		</Layout.Header>
	)
}
