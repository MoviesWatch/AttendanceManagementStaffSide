import axios from "axios";

export const fetch = async ({
  url,
  method = "get",
  setError,
  setResult,
  sortFunction = null,
  body = {},
  headers = {},
}) => {
  try {
    const { data } = await axios[method](url, body, { headers });
    if (sortFunction) {
      setResult(data.sort(sortFunction));
    } else {
      setResult(data);
    }
  } catch (error) {
    setError(error.response.data.msg);
  }
};
