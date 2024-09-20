import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/EcoPasteHub/EcoPaste/releases"
    );

    const result = await response.json();

    const joinBeta = req.headers["join-beta"];

    let version = result[0].name;

    if (joinBeta === "false") {
      version = result.find(({ name }) => !name.includes("-")).name;
    }

    res.redirect(
      `https://gh-proxy.com/https://github.com/EcoPasteHub/EcoPaste/releases/download/${version}/latest.json`
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
