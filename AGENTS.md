# Repository Guidelines

## Stack

ShopLedger is a Node.js application using Express 4 and `body-parser`. It uses CommonJS modules and stores application data in the local JSON file `data/db.json`. The browser interface is plain HTML, CSS, and JavaScript.

## Module Map

- `server.js` configures the Express app, serves `public/`, mounts routes, and serves printable invoices.
- `routes/` contains API handlers grouped by resource: products, orders, customers, and reports.
- `lib/` contains business logic, including pricing, tax, inventory, coupons, orders, ledger, invoices, and reports.
- `public/` contains the UI (`index.html`, `js/app.js`, and `css/style.css`).
- `config.js` contains the port and shop, tax, inventory, and coupon configuration.
- `data/db.json` is the local data store; `docs/` contains the architecture diagram.

## Commands

- `npm install` installs the dependencies declared in `package.json`.
- `npm start` runs `node server.js`; the default port is 3000 and can be overridden with `PORT`.
- `npm test` currently exits with “no test specified”; there is no configured test suite.

## Change Rules

- Before changing behavior, add characterization tests that capture the current behavior and then cover the intended change.
- Keep each change within the module the ticket concerns. Update another module only when the ticket requires it.
- Tests must never read from or write to `data/db.json`. Use isolated in-memory fixtures or temporary test data instead.
- Do not add dependencies. Use Node.js built-ins and the packages already listed in `package.json`.
