import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import jimp from "jimp";
import path from "path";

const plugin = require.resolve("@jimp/plugin-print");

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

  const image = await jimp.read(buffer);
  const bg = await jimp.read(
    "https://raw.githubusercontent.com/trindadematheus/yu-gi-me/main/public/card-template.jpg"
  );
  const font = await jimp.loadFont(
    "https://raw.githubusercontent.com/trindadematheus/yu-gi-me/main/public/open-sans-16-black.fnt"
  );

  image.resize(245, 250);

  bg.print(font, 36, 36, req.body.name);
  bg.composite(image, 45, 105).getBuffer(jimp.MIME_JPEG, (_, buff) => {
    return res.end(buff);
  });

  // bg.composite(image, 45, 105).write("test.jpg");
  // return res.json({ ok: true });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
