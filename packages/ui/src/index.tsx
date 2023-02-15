import React, { useEffect, useState } from "react";
import { WaitFor } from "@yangzw/bruce-us";
import { Button, Form, Input, Radio } from "antd";

import "./assets/css/reset.css";
import "./index.scss";
import { CATEGORYS, FILTERS } from "./utils/getting";

interface FormType {
	category: string
	filter: string
	height: string
	width: string
}

export default function App(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();
	const initForm: FormType = {
		category: "any",
		filter: "normal",
		height: "",
		width: ""
	};
	const categorysDom = CATEGORYS.map(v => <Radio.Button key={v.id} value={v.id}>{v.val}</Radio.Button>);
	const filtersDom = FILTERS.map(v => <Radio.Button key={v.id} value={v.id}>{v.val}</Radio.Button>);
	const onSubmit = async(form: FormType): Promise<void> => {
		setLoading(true);
		const { category, filter, height, width } = form;
		parent.postMessage({
			pluginMessage: {
				height: +height,
				type: "insert",
				url: `https://placeimg.com/${width}/${height}/${category}/${filter === "normal" ? "" : filter}`.replace(/\/$/, ""),
				width: +width
			}
		}, "*");
		await WaitFor();
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
		<div className="placeimg-page flex-ct-x">
			<Form
				className="placeimg-form"
				form={form}
				labelCol={{ span: 5 }}
				wrapperCol={{ span: 15 }}
				initialValues={initForm}
				onFinish={onSubmit}
			>
				<Form.Item
					name="width"
					label="占位图宽度"
					rules={[{ message: "高度由正整数组成", pattern: /^[1-9]\d*$/, required: true }]}
				>
					<Input
						placeholder="请输入图像宽度"
						addonAfter="px"
						allowClear
					/>
				</Form.Item>
				<Form.Item
					name="height"
					label="占位图高度"
					rules={[{ message: "高度由正整数组成", pattern: /^[1-9]\d*$/, required: true }]}
				>
					<Input
						placeholder="请输入图像高度"
						addonAfter="px"
						allowClear
					/>
				</Form.Item>
				<Form.Item name="category" label="占位图分类">
					<Radio.Group>
						{categorysDom}
					</Radio.Group>
				</Form.Item>
				<Form.Item name="filter" label="占位图滤镜">
					<Radio.Group>
						{filtersDom}
					</Radio.Group>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 5, span: 15 }}>
					<Button
						className="placeimg-form-btn"
						type="primary"
						htmlType="submit"
						shape="round"
						loading={loading}
					>插入</Button>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 5, span: 15 }}>
					<Button
						className="placeimg-form-btn"
						type="dashed"
						onClick={onReset}
						shape="round"
					>重置</Button>
				</Form.Item>
			</Form>
		</div>
	);
}