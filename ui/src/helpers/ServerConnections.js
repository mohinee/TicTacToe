const ServerConnections = (url, call_method, data) => {
  fetch(url, {
    method: `${call_method}`,
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((e) => {
      return e;
    });
};

export default ServerConnections;
