import React, { Fragment, useEffect, useState } from "react";
import { Button, Form, Input, Radio, Slider, Spin, Switch, Tooltip } from "antd";
import { type SliderMarks } from "antd/es/slider";
import ClassNames from "classnames";

import "./assets/css/reset.css";
import "./index.scss";
import { DATA_REGEXP, LINE_HEIGHTS } from "./utils/getting";
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
	const [loading, setLoading] = useState<0 | 1 | 2>(0);
	const [bgImageData, setBgImg] = useState<DownloadImgType>({ u8a: null, url: "" });
	const [fontSizeRange, setFontSizeRange] = useState<number[]>([10, 50]);
	const [vaildSize, setVaildSize] = useState<boolean>(false);
	const [vaildBgColor, setVaildBgColor] = useState<boolean>(false);
	const [vaildBgImage, setVaildBgImage] = useState<boolean>(false);
	const [vaildContent, setVaildContent] = useState<boolean>(false);
	const [vaildTextSize, setVaildTextSize] = useState<boolean>(false);
	const [hasBgColor, setHasBgColor] = useState<boolean>(false);
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
	const bgImgTips = loading === 1
		? "，图片正在生成中..."
		: bgImageData.url ? "，图片已生成并保存到内存中" : "";
	const lineHeightsDom = LINE_HEIGHTS.map(v => <Radio.Button key={v.id} value={v.id}>{v.val}</Radio.Button>);
	const loadingClasses = ClassNames("placeimg-mask pf fullscreen flex-ct-x", {
		hide: loading === 2,
		show: loading === 1
	});
	const onChange = async(change: FormType, allChange: FormType): Promise<void> => {
		if (change.height !== undefined) {
			const isNum = DATA_REGEXP.size.test(change.height);
			const _height = +change.height;
			const max = isNum ? _height > 50 ? 50 : _height < 10 ? 10 : _height : 50;
			setFontSizeRange([10, max]);
		}
		if (allChange.bgImage) {
			setLoading(1);
			const res = await DownloadImg();
			setBgImg(res);
			setLoading(2);
		} else {
			setBgImg({ u8a: null, url: "" });
		}
		setVaildSize(DATA_REGEXP.size.test(allChange.width) && DATA_REGEXP.size.test(allChange.height));
		setVaildBgColor(DATA_REGEXP.color.test(allChange.bgColor));
		setVaildBgImage(allChange.bgImage);
		setVaildContent(DATA_REGEXP.content.test(allChange.content));
		setVaildTextSize(DATA_REGEXP.size.test(allChange.height) && +allChange.height >= 10);
		setHasBgColor(!!allChange.bgColor);
	};
	const onSubmit = (form: FormType): void => {
		const { bgColor, bgImage, color, content, fontSize, height, lineHeight, width } = form;
		const useBgImg = bgImage && bgImageData.u8a && bgImageData.url;
		const downloadOpts = {
			height: +height,
			url: bgImageData.url,
			width: +width
		};
		const renderOpts = {
			bgColor: `#${bgColor || "f66"}`,
			color: `#${color || "fff"}`,
			content,
			fontSize,
			height: +height,
			lineHeight: fontSize * lineHeight,
			width: +width
		};
		const data = useBgImg ? bgImageData.u8a : RenderImg(renderOpts);
		useBgImg ? console.log("下载图像", downloadOpts) : console.log("渲染图像", renderOpts);
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
		setVaildSize(false);
		setVaildBgColor(false);
		setVaildBgImage(false);
		setVaildContent(false);
		setVaildTextSize(false);
		form.resetFields();
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
		<div className="placeimg-page">
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
					className="placeimg-form-item"
					name="width"
					label="图像宽度"
					rules={[{ message: "图像宽度由正整数组成", pattern: DATA_REGEXP.size, required: true }]}
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
					rules={[{ message: "图像高度由正整数组成", pattern: DATA_REGEXP.size, required: true }]}
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
					rules={[{ message: "图像颜色由HEX组成", pattern: DATA_REGEXP.color }]}
				>
					<Input
						placeholder="请输入图像颜色，形式为ff6666或f66"
						addonBefore="#"
						addonAfter="默认为#f66"
						allowClear
						disabled={!vaildSize || vaildBgImage}
					/>
				</Form.Item>
				<Form.Item className="placeimg-form-item switch" label="图像背景">
					<Fragment>
						<Form.Item name="bgImage" valuePropName="checked" style={{ marginBottom: 0, marginRight: 10 }}>
							<Switch disabled={!vaildSize || vaildBgColor || vaildContent || hasBgColor} />
						</Form.Item>
						<Tooltip title={bgImageData.url}>随机图片由dog.ceo提供{bgImgTips}</Tooltip>
					</Fragment>
				</Form.Item>
				<Form.Item
					className="placeimg-form-item"
					name="content"
					label="文本内容"
					rules={[{ message: "文本内容由1~100个字符组成", pattern: DATA_REGEXP.content }]}
				>
					<Input
						placeholder="请输入文本内容"
						minLength={1}
						maxLength={100}
						allowClear
						showCount
						disabled={!vaildSize || vaildBgImage || !vaildBgColor}
					/>
				</Form.Item>
				<Form.Item
					className="placeimg-form-item"
					name="color"
					label="文本颜色"
					rules={[{ message: "文本颜色由HEX组成", pattern: DATA_REGEXP.color }]}
				>
					<Input
						placeholder="请输入文本颜色，形式为ff6666或f66"
						addonBefore="#"
						addonAfter="默认为#fff"
						allowClear
						disabled={!vaildSize || vaildBgImage || !vaildBgColor || !vaildContent}
					/>
				</Form.Item>
				<Form.Item className="placeimg-form-item" name="lineHeight" label="文本行高">
					<Radio.Group disabled={!vaildSize || vaildBgImage || !vaildBgColor || !vaildContent}>
						{lineHeightsDom}
					</Radio.Group>
				</Form.Item>
				<Form.Item className="placeimg-form-item" name="fontSize" label="文本尺寸">
					<Slider
						min={fontSizeRange[0]}
						max={fontSizeRange[1]}
						marks={fontSizeRangeConfig}
						disabled={!vaildSize || vaildBgImage || !vaildBgColor || !vaildContent || !vaildTextSize}
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
			<div className={loadingClasses}>
				<Spin size="large" tip="图片正在生成中..." />
			</div>
		</div>
	);
}