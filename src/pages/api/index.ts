import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import sharp from "sharp";
import axios from "axios";

import TEMPLATE_URL from "../../constants/template-url";

const upload = multer();

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("avatar"));

apiRoute.post(async (req, res) => {
  // @ts-ignore
  const buffer = req.file?.buffer;

  if (!buffer) {
    return res.status(400).send("Image is required");
  }
  const image = sharp(buffer);
  const text = `
    <svg height="40" width="200"> <text x="0" y="20" font-size="20" fill="#000">${req.body.name}</text> </svg>
  `;
  const bg = sharp(
    (await axios({ url: TEMPLATE_URL, responseType: "arraybuffer" }))
      .data as Buffer
  );

  image.resize(245, 250);
  bg.composite([
    { input: Buffer.from(text), top: 32, left: 34 },
    { input: await image.toBuffer(), top: 105, left: 45 },
  ]).toBuffer((_, buff) => {
    return res.end(buff);
  });

  // .toFile("output.jpg", () => {
  //   return res.status(200).json({ ok: true });
  // });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
