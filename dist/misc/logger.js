import Winston from "winston";
/**
 * Logging utility to use for both console and output to files.
 */
export default class Logger {
    /**
     * Contains the Winston instance.
     */
    #_logger = null;
    /**
     * A label indicative of where the log originated from.
     */
    #_label;
    /**
     * Name of the .log file to output to.
     */
    #_session;
    /**
     * @constructor
     */
    constructor(_label, _session) {
        this.#_label = _label;
        this.#_session = _session;
        this.#_logger = null;
        this.#_actualize();
    }
    /**
     * Make sure that the logger outputs the latest set label.
     */
    #_actualize() {
        this.#_logger = Winston.createLogger({
            format: Winston.format.combine(Winston.format.label({ label: `${this.#_label}` }), Winston.format.json(), Winston.format.timestamp(), Winston.format.printf(({ level, message, label, timestamp }) => {
                return `<${new Date(timestamp).toLocaleString()}> [${label}] ${level.toUpperCase()} : ${message}`;
            })),
            transports: [
                new Winston.transports.Console({}),
                new Winston.transports.File((Winston.transports.FileTransportOptions = {
                    filename: `logs/${this.#_session}.log`,
                })),
            ],
        });
    }
    /**
     * Prototype the logger.
     */
    prototype() {
        return new Logger(this.#_label, this.#_session);
    }
    /**
     * Can change the label
     */
    set label(_label) {
        this.#_label = `${this.#_label} > ${_label}`;
        this.#_actualize();
    }
    get label() {
        return this.#_label;
    }
    get session() {
        return this.#_session;
    }
    /**
     * Informative log.
     * @param message conten of the log
     */
    info(message) {
        this.#_logger.log("info", message);
    }
    /**
     * Error log.
     * @param message conten of the log
     */
    error(message) {
        this.#_logger.log("error", message);
    }
    /**
     * Warning log.
     * @param message conten of the log
     */
    warn(message) {
        this.#_logger.log("warn", message);
    }
}
