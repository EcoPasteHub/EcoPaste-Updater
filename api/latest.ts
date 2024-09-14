import type { VercelRequest, VercelResponse } from "@vercel/node";

interface Asset {
  name: string;
  browser_download_url: string;
}

interface IResponse {
  assets: Asset[];
}

const PLATFORM = {
  WINDOWS: "windows",
  MACOS_ARM: "macos-arm",
  MACOS_X64: "macos-x64",
  LINUX_APPIMAGE: "linux-appimage",
  LINUX_DEB: "linux-deb",
  LINUX_RPM: "linux-rpm",
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/EcoPasteHub/EcoPaste/releases/latest"
    );

    const result: IResponse = await response.json();

    const { platform } = req.query;

    const platforms = Object.values(PLATFORM);

    if (typeof platform !== "string" || !platforms.includes(platform)) {
      return res.send(`请正确的传入 platform 参数：${platforms.join("、")}`);
    }

    const url = getDownloadURL(platform, result.assets);

    if (!url) {
      return res.send(`未找到 ${platform} 平台的安装包`);
    }

    return res.redirect(`https://gh-proxy.com/${url}`);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDownloadURL = (platform: string, assets: Asset[]) => {
  const DOWNLOAD_URL_SUFFIX = {
    [PLATFORM.WINDOWS]: ".exe",
    [PLATFORM.MACOS_ARM]: "aarch64.dmg",
    [PLATFORM.MACOS_X64]: "x64.dmg",
    [PLATFORM.LINUX_APPIMAGE]: ".AppImage",
    [PLATFORM.LINUX_DEB]: ".deb",
    [PLATFORM.LINUX_RPM]: ".rpm",
  };

  return assets.find((asset) =>
    asset.name.endsWith(DOWNLOAD_URL_SUFFIX[platform])
  )?.browser_download_url;
};
