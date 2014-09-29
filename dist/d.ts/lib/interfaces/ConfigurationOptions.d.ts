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
    /**
    * Minimum Chrome version supported: 0 (default)
    */
    chrome?: number;
    /**
    * Minimum Firefox (Gecko) version supported: 0 (default)
    */
    firefox?: number;
    /**
    * Minimum IE version supported: 0 (default)
    */
    ie?: number;
    /**
    * Minimum Opera version supported: 0 (default)
    */
    opera?: number;
    /**
    * Minimum Safari version supported: 0 (default)
    */
    safari?: number;
    /**
    * Minimum Android version supported: 0 (default)
    */
    android?: number;
    /**
    * Minimum Firefox Mobile (Gecko) version supported: 0 (default)
    */
    firefoxMobile?: number;
    /**
    * Minimum IE Phone version supported: 0 (default)
    */
    iePhone?: number;
    /**
    * Minimum Opera Mobile version supported: 0 (default)
    */
    operaMobile?: number;
    /**
    * Minimum Safari Mobile version supported: 0 (default)
    */
    safariMobile?: number;
    /**
    * Enable experimental -webkit- prefix: true (default)
    */
    webkitPrefix?: boolean;
    /**
    * Enable experimental -khtml- prefix: false (default)
    */
    khtmlPrefix?: boolean;
    /**
    * Enable experimental -moz- prefix: true (default)
    */
    mozPrefix?: boolean;
    /**
    * Enable experimental -ms- prefix: true (default)
    */
    msPrefix?: boolean;
    /**
    * Enable experimental -o- prefix: true (default)
    */
    oPrefix?: boolean;
}
export = ConfigurationOptions;
