import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (_: VercelRequest, res: VercelResponse) => {
  const response = await fetch(
    "https://api.github.com/repos/EcoPasteHub/EcoPaste/releases"
  );

  const result = await response.json();

  res.redirect(
    `https://gh-proxy.com/https://github.com/EcoPasteHub/EcoPaste/releases/download/${result[0].name}/latest.json`
  );
};
