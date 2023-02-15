import Axios from "axios";

function Base64ToU8a(base64 = ""): Uint8Array {
	const arr = base64.split(",");
	const bstr = atob(arr[1]);
	const len = bstr.length;
	const u8a = new Uint8Array(len);
	return u8a;
}

async function DownloadImg(url: string = ""): Promise<Uint8Array> {
	// "https://images.dog.ceo/breeds/segugio-italian/n02090722_001.jpg";
	const { data } = await Axios.get(url, { responseType: "arraybuffer" });
	const u8a = new Uint8Array(data);
	return u8a;
}

export {
	Base64ToU8a,
	DownloadImg
};