declare module 'tmi.js' {
  interface ClientOptions {
    options?: {
      debug?: boolean;
    };
    identity?: {
      username?: string;
      password?: string;
    };
    channels?: string[];
  }

  class Client {
    constructor(options?: ClientOptions);
  }

  export { Client };
  const tmi: {
    Client: typeof Client;
  };
  export default tmi;
}
