interface ConfigurationOptions {
    /**
     * Specify location of config file.
     */
    config?: string;
    /**
     * Extend configuration with these plugins.
     */
    plugins?: string[];
    /**
     * Quiet mode.
     */
    quiet?: boolean;
    /**
     * Show a full stacktrace on error.
     */
    trace?: boolean;
    /**
     * Overwrites existing files.
     */
    force?: boolean;
    /**
     * Turn off colorized output.
     */
    boring?: boolean;
    /**
     * Output style: nested (default), expanded, compact, compressed.
     */
    style?: string;
    /**
     * One indent: 2s (default), 4s, 1t.
     */
    oneIndent?: string;
    /**
     * Quote type: double (default), single.
     */
    quote?: string;
    /**
     * Newline: os (default), lf, crlf.
     */
    newline?: string;
    /**
     * BEM block format: .%s (default).
     */
    block?: string;
    /**
     * BEM element format: __%s (default).
     */
    element?: string;
    /**
     * BEM modifier format: --%s (default).
     */
    modifier?: string;
}
export = ConfigurationOptions;
