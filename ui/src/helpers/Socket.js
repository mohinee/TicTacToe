import Echo from "laravel-echo";
import Pusher from "pusher-js";

const options = {
  broadcaster: "pusher",
  key: "50e8ab547f3f550a7a74",
  cluster: "ap2",
  forceTLS: true,
  client: new Pusher("50e8ab547f3f550a7a74"),
};

const Listener = new Echo(options);
export default Listener;
