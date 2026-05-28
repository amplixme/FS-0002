import axios from "axios";
import FormData from "form-data";

export async function uploadImage(fileBuffer, fileName) {
  const formData = new FormData();
  formData.append("image", fileBuffer, fileName);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    { headers: formData.getHeaders() }
  );

  return response.data.data.url;
}