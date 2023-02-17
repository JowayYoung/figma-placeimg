import React, { Fragment, useEffect, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { WaitFor } from "@yangzw/bruce-us";
import { Button, Form, Input, Radio, Slider, Switch, Tooltip } from "antd";
import { type SliderMarks } from "antd/es/slider";

import "./assets/css/reset.css";
import "./index.scss";
import { LINE_HEIGHTS } from "./utils/getting";
import { type DownloadImgType, DownloadImg, RenderImg } from "./utils/setting";

interface FormType {
	bgColor: string
	bgImage: boolean
	color: string
	content: string
	fontSize: number
	height: string
	lineHeight: 1 | 1.2 | 1.5
	width: string
}

export default function App(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [bgImg, setBgImg] = useState<DownloadImgType>({ u8a: null, url: "" });
	const [fontSizeRange, setFontSizeRange] = useState<number[]>([10, 50]);
	const [editImgColor, setEditImgColor] = useState<boolean>(true);
	const [editText, setEditText] = useState<boolean>(false);
	const [editTextSize, setEditTextSize] = useState<boolean>(false);
	const [form] = Form.useForm();
	const initForm: FormType = {
		bgColor: "",
		bgImage: false,
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
	const onChange = async(change: FormType, allChange: FormType): Promise<void> => {
		if (change.height !== undefined) {
			const _height = +change.height;
			const max = _height > 50 ? 50 : _height < 10 ? 10 : _height;
			setFontSizeRange([10, max]);
		}
		if (change.bgImage) {
			setLoading(true);
			const res = await DownloadImg();
			await WaitFor();
			setBgImg(res);
			setLoading(false);
		} else {
			setBgImg({ u8a: null, url: "" });
		}
		setEditImgColor(!allChange.bgImage);
		setEditText(!!allChange.width && !!allChange.height);
		setEditTextSize(+allChange.height >= 10);
	};
	const onSubmit = (form: FormType): void => {
		const { bgColor, bgImage, color, content, fontSize, height, lineHeight, width } = form;
		const renderOpts = {
			bgColor: `#${bgColor || "f66"}`,
			color: `#${color || "fff"}`,
			content,
			fontSize,
			height: +height,
			lineHeight: fontSize * lineHeight,
			width: +width
		};
		console.log("渲染图像", renderOpts);
		const data = bgImage && bgImg.u8a && bgImg.url ? bgImg.u8a : RenderImg(renderOpts);
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
	const onReset = (): void => form.resetFields();
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
		<div className="placeimg-page">
			<Form
				className="placeimg-form"
				form={form}
				labelCol={{ span: 5 }}
				wrapperCol={{ span: 15 }}
				initialValues={initForm}
				disabled={loading}
				onFinish={onSubmit}
				onValuesChange={onChange}
			>
				<Form.Item
					className="placeimg-form-item"
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
					className="placeimg-form-item"
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
					className="placeimg-form-item"
					name="bgColor"
					label="图像颜色"
					rules={[{ message: "图像颜色由HEX组成", pattern: /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i, required: true }]}
				>
					<Input
						placeholder="请输入图像颜色，形式为ff6666或f66"
						addonBefore="#"
						allowClear
						disabled={!editImgColor}
					/>
				</Form.Item>
				<Form.Item className="placeimg-form-item switch" label="图像背景">
					<Fragment>
						<Form.Item name="bgImage" valuePropName="checked" style={{ marginBottom: 0, marginRight: 10 }}>
							<Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
						</Form.Item>
						<Tooltip title={bgImg.url}>随机图片由dog.ceo提供{bgImg.url ? "，图片已生成并保存到内存中" : ""}</Tooltip>
					</Fragment>
				</Form.Item>
				<Form.Item
					className="placeimg-form-item"
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
					className="placeimg-form-item"
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
				<Form.Item className="placeimg-form-item" name="lineHeight" label="文本行高">
					<Radio.Group disabled={!editText}>
						{lineHeightsDom}
					</Radio.Group>
				</Form.Item>
				<Form.Item className="placeimg-form-item" name="fontSize" label="文本尺寸">
					<Slider
						min={fontSizeRange[0]}
						max={fontSizeRange[1]}
						marks={fontSizeRangeConfig}
						disabled={!editText || !editTextSize}
					/>
				</Form.Item>
				<Form.Item className="placeimg-form-item btns" wrapperCol={{ offset: 5, span: 15 }}>
					<Button
						className="placeimg-form-btn"
						type="primary"
						htmlType="submit"
						shape="round"
					>插入</Button>
					<Button
						className="placeimg-form-btn"
						type="dashed"
						onClick={onReset}
						shape="round"
					>重置</Button>
				</Form.Item>
			</Form>
			<div className="placeimg-img pr flex-ct-x">
				<img className="placeimg-img-cover" id="placeimg-img" />
			</div>
		</div>
	);
}