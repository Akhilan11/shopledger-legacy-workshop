var test = require('node:test');
var assert = require('node:assert/strict');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

test('invoice uses the checkout HSN rate and coupon total for HSN 1006', function () {
  var items = [
    { id: 1, sku: 'GRN-001', name: 'Rice', hsn: '1006', price: 1020, qty: 1 }
  ];
  var checkout = pricing.computeTotals(items, 'SAVE10');
  var printed = invoice.computeInvoiceFigures({
    id: 1002,
    items: items,
    coupon: 'SAVE10',
    total: checkout.total
  });

  assert.equal(checkout.subtotal, 1020);
  assert.equal(checkout.discount, 102);
  assert.equal(checkout.tax, 45.9);
  assert.equal(checkout.total, 963.9);

  assert.equal(printed.rows[0].gstPercent, 5);
  assert.equal(printed.tax, 45.9);
  assert.equal(printed.cgst, 22.95);
  assert.equal(printed.sgst, 22.95);
  assert.equal(printed.discount, 102);
  assert.equal(printed.total, 963.9);
});

test('invoice honors the SAVE10 discount cap and checkout totals', function () {
  var items = [
    { id: 5, sku: 'OIL-002', name: 'Groundnut Oil', hsn: '1508', price: 1120, qty: 2 }
  ];
  var checkout = pricing.computeTotals(items, 'SAVE10');
  var printed = invoice.computeInvoiceFigures({
    id: 1004,
    items: items,
    coupon: 'SAVE10',
    total: checkout.total
  });

  assert.equal(checkout.discount, 150);
  assert.equal(checkout.tax, 104.5);
  assert.equal(checkout.total, 2194.5);

  assert.equal(printed.rows[0].gstPercent, 5);
  assert.equal(printed.tax, 104.5);
  assert.equal(printed.cgst, 52.25);
  assert.equal(printed.sgst, 52.25);
  assert.equal(printed.discount, 150);
  assert.equal(printed.total, 2194.5);
});

test('invoice uses the checkout HSN rates for 5% and 12% items', function () {
  var items = [
    { id: 1, name: 'Rice', hsn: '1006', price: 100, qty: 1 },
    { id: 6, name: 'Ghee', hsn: '0405', price: 100, qty: 1 }
  ];

  var checkout = pricing.computeTotals(items, '');
  var printed = invoice.computeInvoiceFigures({ items: items, coupon: '' });

  assert.deepEqual(printed.rows.map(function (row) { return row.gstPercent; }), [5, 12]);
  assert.equal(checkout.tax, 17);
  assert.equal(printed.tax, 17);
  assert.equal(printed.cgst, 8.5);
  assert.equal(printed.sgst, 8.5);
  assert.equal(printed.total, checkout.total);
});

test('invoice matches checkout for an 18% HSN item without a coupon', function () {
  var items = [
    { id: 8, name: 'Tea', hsn: '0902', price: 100, qty: 1 }
  ];

  var checkout = pricing.computeTotals(items, '');
  var printed = invoice.computeInvoiceFigures({ items: items, coupon: '' });

  assert.equal(checkout.tax, 18);
  assert.equal(printed.tax, 18);
  assert.equal(checkout.total, 118);
  assert.equal(printed.total, 118);
});
