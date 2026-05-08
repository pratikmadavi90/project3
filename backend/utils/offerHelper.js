function applyOffer(cartTotal, offer) {
  if (!offer) return cartTotal;

  if (offer.type === "percentage") {
    return cartTotal - (cartTotal * offer.value) / 100;
  }

  if (offer.type === "flat") {
    return cartTotal - offer.value;
  }

  return cartTotal;
}

module.exports = { applyOffer };