import sharp from "sharp";

export const base64 = (file: any) => {
  const newImg = file.data;
  const encImg = newImg.toString("base64");

  let image = {
    contentType: file.mimetype,
    size: file.size,
    image: Buffer.from(encImg, "base64"),
  };

  return sharp(image.image)
    .resize(500, 250, {
      fit: "cover",
      position: "center",
    })
    .toBuffer()
    

  // const newImg = file.data;
};
