ClickJacket
==
"Best-for-now" iframe protection to only allow iframes for any given protocols and/or domains. Replaces page html
when viewed from an origin that is not allowed. [OWASP](https://www.owasp.org/index.php/Clickjacking_Defense_Cheat_Sheet)

## Config

#### allowedDomains [String]
The domains to allow from an iframe. Allows all domains if not given.

#### allowedProtocols [String]
The protocols to allow from an iframe. Allows all protocols if not given.

#### failureMessage String
If an iframe fails to pass validation, this message replaces the page's html. Defaults to '';

## Usage
```html
<!-- Allow specific domains -->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cool Site</title>
</head>
<body>
    <script src="clickjacket.min.js"></script>
    <script>
    // Replaces the page html when viewed in an
    // iframe not at the cooldomain.com or coolcomain.io domains.
    (new ClickJacket({
        allowedDomains: ['cooldomain.com', 'cooldomain.io']
    })).runCheck();
    </script>
</body>
</html>
```

```html
<!-- Allow specific protocols -->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cool Site</title>
</head>
<body>
    <script src="clickjacket.min.js"></script>
    <script>
     // Replaces the page html when viewed in an
    // iframe using an https protocol.
    (new ClickJacket({
        allowedProtocols: ['https']
    })).runCheck();
    </script>
</body>
</html>
```

```html
<!-- Show specialize message -->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cool Site</title>
</head>
<body>
    <script src="clickjacket.min.js"></script>
    <script>
     // Replaces the page html when viewed in an
    // iframe using an https protocol.
    (new ClickJacket({
        allowedProtocols: ['https'],
        failureMessage: 'This site cannot be viewed from this iframe.'
    })).runCheck();
    </script>
</body>
</html>
