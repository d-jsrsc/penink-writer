import axios from "axios";

export function saveDraft({ id, title, data, tags }) {
  return axios
    .post("/api/writer/save/draft", {
      id,
      title,
      intro: "",
      data,
      tags,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export function publishWrite({ id, title, data, tags }) {
  return axios
    .post("/api/writer/publish", {
      id,
      title,
      intro: "",
      data,
      tags,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export function loadMyWrite() {
  return axios
    .get("/api/writer/my")
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}
