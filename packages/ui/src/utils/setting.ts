import Axios from "axios";

async function DownloadImg(url: string = ""): Promise<Uint8Array> {
	const { data } = await Axios.get(url, { responseType: "arraybuffer" });
	const u8a = new Uint8Array(data);
	return u8a;
}

export {
	DownloadImg
};