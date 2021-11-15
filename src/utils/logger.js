class Logger {
  constructor({ level }) {
    this.level = level;
  }
  setLevel(level) {
    this.level = level;
  }

  trace(...msg) {
    console.log(
      `%c${msg[0]}`,
      "background: #9e9e9e; color: black",
      ...msg.slice(1)
    );
  }
  debug(...msg) {
    console.log(
      `%c${msg[0]}`,
      "background: #01579b;color:white",
      ...msg.slice(1)
    );
  }
  info(...msg) {
    console.log(
      `%c${msg[0]}`,
      "background: #1b5e20;color: white",
      ...msg.slice(1)
    );
  }
  warn(...msg) {
    console.log(
      `%c${msg[0]}`,
      "background: #fcd734;color: black",
      ...msg.slice(1)
    );
  }
  error(...msg) {
    console.log(`%c${msg[0]}`, "color: #dc3545;", ...msg.slice(1));
  }
  // silent'
}

export default new Logger({ level: "trace" });
