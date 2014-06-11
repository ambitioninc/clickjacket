describe('ClickJacket', function() {
    it('should determine when not in an iframe', function() {
        var cj = new ClickJacket();
        expect(cj.isIframe()).toBe(false);
    });

    it('should determine an when iframe', function() {
        var realSelf = window.self;
        var cj = new ClickJacket();
        window.self = {};

        expect(cj.isIframe()).toBe(true);

        //fix the patch
        window.self = realSelf;
    });

    it('should replace iframe html', function() {
        var cj = new ClickJacket({failureMessage: 'Be gone clickjacker!'});
        var mockElements = [{}];

        spyOn(document, 'getElementsByTagName').and.returnValue(mockElements);
        cj.replaceIframeHTML();

        expect(document.getElementsByTagName).toHaveBeenCalledWith('html');
        expect(document.getElementsByTagName.calls.count()).toBe(1);
        expect(mockElements[0]).toEqual({innerHTML: 'Be gone clickjacker!'});
    });

    it('should validate domains', function() {
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com', 'fake-domain2.io'],
        });

        expect(cj.domainIsValid('fake-domain.com')).toBe(true);
        expect(cj.domainIsValid('.fake-domain.com')).toBe(true);
        expect(cj.domainIsValid('sub1.fake-domain.com')).toBe(true);
        expect(cj.domainIsValid('.fake-domain2.io')).toBe(true);
        expect(cj.domainIsValid('.ffake-domain.com')).toBe(false);
        expect(cj.domainIsValid('.fake-domain2.com')).toBe(false);
        expect(cj.domainIsValid('.fake-domain.co')).toBe(false);
        expect(cj.domainIsValid()).toBe(false);
    });

    it('should validate protocols', function() {
        var cj = new ClickJacket({
            allowedProtocols: ['https']
        });

        expect(cj.protocolIsValid('https:')).toBe(true);
        expect(cj.protocolIsValid('https')).toBe(false);
        expect(cj.protocolIsValid('http:')).toBe(false);
        expect(cj.protocolIsValid('ftp:')).toBe(false);
        expect(cj.protocolIsValid()).toBe(false);
    });

    it('should validate all with empty protocol and domain', function() {
        var cj = new ClickJacket();

        expect(cj.protocolIsValid('https:')).toBe(true);
        expect(cj.protocolIsValid('https')).toBe(true);
        expect(cj.protocolIsValid('http:')).toBe(true);
        expect(cj.protocolIsValid('ftp:')).toBe(true);
        expect(cj.domainIsValid('.fake-domain.com')).toBe(true);
        expect(cj.domainIsValid('.fake-domain2.io')).toBe(true);
        expect(cj.domainIsValid('.ffake-domain.com')).toBe(true);
        expect(cj.domainIsValid('.fake-domain2.com')).toBe(true);
    });

    it('should not trigger when not in an iframe', function() {
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });

        spyOn(cj, 'replaceIframeHTML');
        cj.runCheck();

        expect(cj.replaceIframeHTML).not.toHaveBeenCalled();
    });

    it('should trigger when in an iframe with bad protocol and domain', function() {
        var realSelf = window.self;
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });
        cj.referrer = {
            split: function() {
                return ['http:', '', 'www.wrong-domain.com'];
            }
        };

        spyOn(cj, 'replaceIframeHTML');
        window.self = {}; //patch window.self
        cj.runCheck();

        expect(cj.replaceIframeHTML).toHaveBeenCalled();

        window.self = realSelf; //fix patch
    });

    it('should trigger when in an iframe with bad protocol', function() {
        var realSelf = window.self;
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });
        cj.referrer = {
            split: function() {
                return ['http:', '', 'www.fake-domain.com'];
            }
        };

        spyOn(cj, 'replaceIframeHTML');
        window.self = {}; //patch window.self
        cj.runCheck();

        expect(cj.replaceIframeHTML).toHaveBeenCalled();

        window.self = realSelf; //fix patch
    });

    it('should trigger when in an iframe with bad domain', function() {
        var realSelf = window.self;
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });
        cj.referrer = {
            split: function() {
                return ['https:', '', 'www.wrong-domain.com'];
            }
        };

        spyOn(cj, 'replaceIframeHTML');
        window.self = {}; //patch window.self
        cj.runCheck();

        expect(cj.replaceIframeHTML).toHaveBeenCalled();

        window.self = realSelf; //fix patch
    });

    it('should not trigger when in an iframe with good protocol and domain', function() {
        var realSelf = window.self;
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });
        cj.referrer = {
            split: function() {
                return ['https:', '', 'www.fake-domain.com'];
            }
        };

        spyOn(cj, 'replaceIframeHTML');
        window.self = {}; //patch window.self
        cj.runCheck();

        expect(cj.replaceIframeHTML).not.toHaveBeenCalled();

        window.self = realSelf; //fix patch
    });

     it('should not trigger when in an iframe with good protocol and short domain', function() {
        var realSelf = window.self;
        var cj = new ClickJacket({
            allowedDomains: ['fake-domain.com'],
            allowedProtocols: ['https']
        });
        cj.referrer = {
            split: function() {
                return ['https:', '', 'fake-domain.com'];
            }
        };

        spyOn(cj, 'replaceIframeHTML');
        window.self = {}; //patch window.self
        cj.runCheck();

        expect(cj.replaceIframeHTML).not.toHaveBeenCalled();

        window.self = realSelf; //fix patch
    });
});
