import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio, Slider } from "antd";
import { type SliderMarks } from "antd/es/slider";

import "./assets/css/reset.css";
import "./index.scss";
import { LINE_HEIGHTS } from "./utils/getting";
import { DownloadImg } from "./utils/setting";

interface FormType {
	bgColor: string
	color: string
	content: string
	fontSize: number
	height: string
	lineHeight: 1 | 1.2 | 1.5
	width: string
}

export default function App(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [fontSizeRange, setFontSizeRange] = useState<number[]>([10, 50]);
	const [editText, setEditText] = useState<boolean>(false);
	const [editTextSize, setEditTextSize] = useState<boolean>(false);
	const [form] = Form.useForm();
	const initForm: FormType = {
		bgColor: "",
		color: "",
		content: "",
		fontSize: fontSizeRange[0],
		height: "",
		lineHeight: 1,
		width: ""
	};
	const fontSizeRangeConfig: SliderMarks = {
		[fontSizeRange[0]]: {
			label: <strong>{fontSizeRange[0]}px</strong>,
			style: { color: "#09f" }
		},
		[fontSizeRange[1]]: {
			label: <strong>{fontSizeRange[1]}px</strong>,
			style: { color: "#f66" }
		}
	};
	const lineHeightsDom = LINE_HEIGHTS.map(v => <Radio.Button key={v.id} value={v.id}>{v.val}</Radio.Button>);
	const onChange = (change: FormType, allChange: FormType): void => {
		if (change.height !== undefined) {
			const _height = +change.height;
			const max = _height > 50 ? 50 : _height < 10 ? 10 : _height;
			setFontSizeRange([10, max]);
		}
		setEditText(!!allChange.width && !!allChange.height);
		setEditTextSize(+allChange.height >= 10);
	};
	const onSubmit = (form: FormType): void => {
		setLoading(true);
		const { bgColor, color, content, fontSize, height, lineHeight, width } = form;
		const opts = {
			bgColor: `#${bgColor || "f66"}`,
			color: `#${color || "fff"}`,
			content,
			fontSize,
			height: +height,
			lineHeight: +height * lineHeight,
			width: +width
		};
		console.log("占位图配置", opts);
		const data = DownloadImg(opts);
		parent.postMessage({
			pluginMessage: {
				data,
				height: +height,
				type: "insert",
				width: +width
			}
		}, "*");
		onReset();
	};
	const onReset = (): void => {
		form.resetFields();
		setLoading(false);
	};
	const onUpdate = (e: MessageEvent): void => {
		if (e.data.pluginMessage.type === "update") {
			form.setFieldValue("width", e.data.pluginMessage.width);
			form.setFieldValue("height", e.data.pluginMessage.height);
		}
	};
	useEffect(() => {
		window.addEventListener("message", onUpdate);
		return () => window.removeEventListener("message", onUpdate);
	}, []); // eslint-disable-line
	return (
		<div className="placeimg-page flex-ct-y">
			<Form
				className="placeimg-form"
				form={form}
				labelCol={{ span: 5 }}
				wrapperCol={{ span: 15 }}
				initialValues={initForm}
				onFinish={onSubmit}
				onValuesChange={onChange}
			>
				<Form.Item
					name="width"
					label="图像宽度"
					rules={[{ message: "图像宽度由正整数组成", pattern: /^[1-9]\d*$/, required: true }]}
				>
					<Input
						placeholder="请输入图像宽度"
						addonAfter="px"
						allowClear
					/>
				</Form.Item>
				<Form.Item
					name="height"
					label="图像高度"
					rules={[{ message: "图像高度由正整数组成", pattern: /^[1-9]\d*$/, required: true }]}
				>
					<Input
						placeholder="请输入图像高度"
						addonAfter="px"
						allowClear
					/>
				</Form.Item>
				<Form.Item
					name="bgColor"
					label="图像背景"
					rules={[{ message: "图像背景由HEX组成", pattern: /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i, required: true }]}
				>
					<Input
						placeholder="请输入图像背景，形式为ff6666或f66"
						addonBefore="#"
						allowClear
					/>
				</Form.Item>
				<Form.Item
					name="content"
					label="文本内容"
					rules={[{ message: "文本内容由1~100个字符组成", pattern: /^.{1,100}$/ }]}
				>
					<Input
						placeholder="请输入文本内容"
						minLength={1}
						maxLength={100}
						allowClear
						showCount
						disabled={!editText}
					/>
				</Form.Item>
				<Form.Item
					name="color"
					label="文本颜色"
					rules={[{ message: "文本颜色由HEX组成", pattern: /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i }]}
				>
					<Input
						placeholder="请输入文本颜色，形式为ff6666或f66"
						addonBefore="#"
						allowClear
						disabled={!editText}
					/>
				</Form.Item>
				<Form.Item name="lineHeight" label="文本行高">
					<Radio.Group disabled={!editText}>
						{lineHeightsDom}
					</Radio.Group>
				</Form.Item>
				<Form.Item name="fontSize" label="文本尺寸">
					<Slider
						min={fontSizeRange[0]}
						max={fontSizeRange[1]}
						marks={fontSizeRangeConfig}
						disabled={!editText || !editTextSize}
					/>
				</Form.Item>
				<Form.Item className="placeimg-form-handler" wrapperCol={{ offset: 5, span: 15 }}>
					<Button
						className="placeimg-form-btn"
						type="primary"
						htmlType="submit"
						shape="round"
						loading={loading}
					>插入</Button>
					<Button
						className="placeimg-form-btn"
						type="dashed"
						onClick={onReset}
						shape="round"
					>重置</Button>
				</Form.Item>
			</Form>
			<img className="placeimg-img" id="placeimg-img" />
		</div>
	);
}