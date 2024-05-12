import { useRef, useState } from "react"
import {
	Flex,
	Select,
	Space,
	Typography,
	Divider,
	Form,
	InputNumber,
	Button,
	DatePicker,
	Result,
} from "antd"
import { useCrypto } from "../context/crypto-context"
import CoinInfo from "./CoinInfo"
const validateMessages = {
	required: "${label} is required!",
	types: {
		number: "${label} is not valid number",
	},
	number: {
		range: "${label} must be between ${min} and ${max}",
	},
}

export default function AddAssetForm({ onClose }) {
	const [coin, setCoin] = useState(null)
	const { crypto, addAsset } = useCrypto()
	const [form] = Form.useForm()
	const [submitted, setSubmitted] = useState(false)
	const assetRef = useRef()
	if (submitted) {
		return (
			<Result
				status="success"
				title="New Asset Added"
				subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
				extra={[
					<Button type="primary" key="console" onClick={onClose}>
						Close
					</Button>,
					<Button key="buy">Buy Again</Button>,
				]}
			/>
		)
	}

	if (!coin) {
		return (
			<Select
				style={{ width: "100%" }}
				placeholder="Select coin"
				onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
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
			/>
		)
	}

	function onFinish(values) {
		const newAsset = {
			id: coin.id,
			amount: values.amount,
			price: values.price,
			data: values.date?.$d ?? new Date(),
		}

		assetRef.current = newAsset
    addAsset(newAsset)
		setSubmitted(true)
	}

	function handleAmountChange(value) {
		const price = form.getFieldValue("price")

		form.setFieldsValue({
			total: +(value * price).toFixed(2),
		})
	}
	function handlePriceChange(value) {
		const amount = form.getFieldValue("amount")
		form.setFieldsValue({
			total: +(amount * value).toFixed(2),
		})
	}

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{
				span: 8,
			}}
			wrapperCol={{
				span: 16,
			}}
			style={{
				maxWidth: 600,
			}}
			initialValues={{
				price: coin.price.toFixed(2),
			}}
			onFinish={onFinish}
			validateMessages={validateMessages}
		>
			<Divider />
			<CoinInfo coin={coin} withSymbol />
			<Form.Item
				label="Amount"
				name="amount"
				rules={[
					{
						required: true,
						type: "number",
						min: 0,
					},
				]}
			>
				<InputNumber
					placeholder="Enter coin amount"
					onChange={handleAmountChange}
					style={{ width: "100%" }}
				/>
			</Form.Item>
			<Form.Item label="Price" name="price">
				<InputNumber onChange={handlePriceChange} style={{ width: "100%" }} />
			</Form.Item>
			<Form.Item label="Date & Time" name="date">
				<DatePicker showTime style={{ width: "100%" }} />
			</Form.Item>
			<Form.Item label="Total" name="total">
				<InputNumber disabled style={{ width: "100%" }} />
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Add Asset
				</Button>
			</Form.Item>
		</Form>
	)
}
