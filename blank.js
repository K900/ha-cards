class BlankCard extends HTMLElement {
    set hass(hass) { }

    setConfig(config) { }

    getCardSize() {
        return 3;
    }
}

customElements.define("blank-card", BlankCard);
window.customCards.push(
    {
        type: "blank-card",
        name: "Blank card",
        preview: true
    }
);
