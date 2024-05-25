const APPSYNC_HOST =
  "3c45ver6qbfjvehtm3cvigmwvm.appsync-api.us-east-1.amazonaws.com";
const APPSYNC_REALTIME_HOST =
  "3c45ver6qbfjvehtm3cvigmwvm.appsync-realtime-api.us-east-1.amazonaws.com";
const APPSYNC_API_KEY = "da2-mfqlrdst6vdwpa2wl2a3gdte3u";

const encodeCredentials = (host: string, key: string) => {
  const creds = {
    host,
    "x-api-key": key,
  };
  const b64Creds = window.btoa(JSON.stringify(creds));

  return b64Creds;
};

const getWebsocketUrl = () => {
  const header = encodeCredentials(APPSYNC_HOST, APPSYNC_API_KEY);
  const payload = window.btoa(JSON.stringify({}));

  const url = `wss://${APPSYNC_REALTIME_HOST}/graphql?header=${header}&payload=${payload}`;

  return url;
};

function withCreated(websocket: WebSocket) {
  const subscribe = {
    id: window.crypto.randomUUID(),
    type: "start",
    payload: {
      data: JSON.stringify({
        query: `subscription onTodoCreated {
              onTodoCreated {
                id          
                name
                completed
                createdAt
                      }
                  }`,
      }),
      extensions: {
        authorization: {
          "x-api-key": APPSYNC_API_KEY,
          host: APPSYNC_HOST,
        },
      },
    },
  };
  websocket.send(JSON.stringify(subscribe));
}

function withUpdated(websocket: WebSocket) {
  const subscribe = {
    id: window.crypto.randomUUID(),
    type: "start",
    payload: {
      data: JSON.stringify({
        query: `subscription onTodoUpdated {
          onTodoUpdated {
                id          
                name
                completed
                createdAt
                      }
                  }`,
      }),
      extensions: {
        authorization: {
          "x-api-key": APPSYNC_API_KEY,
          host: APPSYNC_HOST,
        },
      },
    },
  };
  websocket.send(JSON.stringify(subscribe));
}

const url = getWebsocketUrl();

const websocket = new WebSocket(url, ["graphql-ws"]);

websocket.addEventListener("open", () => {
  websocket.send(
    JSON.stringify({
      type: "connection_init",
    })
  );
});

const subscribe = (
  callback: (error?: MessageEvent<any>, data?: MessageEvent<any>) => void
) => {
  websocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "connection_ack":
        withCreated(websocket);
        withUpdated(websocket);
        break;
      case "start_ack":
        console.info("start_ack");
        break;
      case "error":
        console.info(message);
        callback(message);
        break;
      case "data":
        console.info(message.payload.data);
        callback(undefined, message);
        break;
    }
  });
};

export { subscribe };
