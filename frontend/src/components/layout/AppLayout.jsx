import { Layout } from "antd"
import AppHeader from "../../components/layout/AppHeader"
import AppSider from "../../components/layout/AppSider"
import AppContent from "../../components/layout/AppContent"
import { useContext } from "react"
import CryptoContext from "../../context/crypto-context"
import { Spin } from "antd"

export default function AppLayout() {
	const { loading } = useContext(CryptoContext)

	if (loading) {
		return <Spin fullscreen /> // Если loading true то будет загрузка
	}
  
	return (
		<Layout>
			<AppHeader></AppHeader>
			<Layout>
				<AppSider></AppSider>
				<AppContent></AppContent>
			</Layout>
		</Layout>
	)
}
