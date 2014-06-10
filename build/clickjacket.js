(function(window, document, undefined) {
    'use strict';

    /**
     * Creates a new ClickJacket.
     * @constructor
     * Checks that certain domains and protocols are required to view a page in an iframe.
     * If no allowedDomains or allowedProtocols are passed, it is assumed all are valid.
     */
    var ClickJacket = function(config) {
        config = config || {};

        this.allowedDomains = config.allowedDomains || [];
        this.allowedProtocols = config.allowedProtocols || [];
        this.failureMessage = config.failureMessage || '';
        this.referrer = document.referrer;
    };

    /**
     * @method runCheck
     * Checks for valid protocols and domains.
     * Replaces the iframe's HTML upon validation failure.
     */
    ClickJacket.prototype.runCheck = function runCheck() {
        var validProtocol, validDomain;
        var parts = this.referrer.split('/');
        var protocol = parts[0];
        var domain = parts[2];

        if (this.isIframe()) {
            validProtocol = this.protocolIsValid(protocol);
            validDomain = this.domainIsValid(domain);

            if (!validProtocol || !validDomain) {
                this.replaceIframeHTML();
            }
        }
    };

    /**
     * @method domainIsValid
     * Checks to see that the domain is valid.
     * @param String domain - The domain to validate.
     * @returns Boolean
     */
    ClickJacket.prototype.domainIsValid = function domainIsValid(domain) {
        var allowed = this.allowedDomains;
        var len = allowed.length;
        var i = 0;

        if (!len) {
            return true;
        }

        if (domain) {
            for (; i < len; i++) {
                if (domain.indexOf('.' + allowed[i]) !== -1 || domain === allowed[i]) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * @method protocolIsValid
     * Checks to see that the protocol is valid.
     * @param String protocol - The protocol to validate.
     * @returns Boolean
     */
    ClickJacket.prototype.protocolIsValid = function protocolIsValid(protocol) {
        var allowed = this.allowedProtocols;
        var len = allowed.length;
        var i = 0;

        if (!len) {
            return true;
        }

        if (protocol) {
            for (; i < len; i++) {
                if (protocol.indexOf(allowed[i] + ':') !== -1) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * @method isIframe
     * Checks to see that the window is being viewed in an iframe.
     * @returns Boolean
     */
    ClickJacket.prototype.isIframe = function isIframe() {
        return window.self !== window.top;
    };

    /**
     * @method replaceIframeHTML
     * Replaces the entire frame document's HTML.
     */
    ClickJacket.prototype.replaceIframeHTML = function replaceIframeHTML() {
        document.getElementsByTagName('html')[0].innerHTML = this.failureMessage;
    };

    window.ClickJacket = ClickJacket;
})(window, document);
