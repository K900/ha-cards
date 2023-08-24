class KettleCard extends HTMLElement {
    init() {
        this.targetMode = this.currentMode;
        this.targetTemp = 100;

        this.innerHTML = `
            <style>
                .row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    margin-top: 5px;
                    margin-bottom: 5px;
                }

                ha-slider {
                    flex: 2;
                    justify-self: left;
                }

                .temp-display {
                    width: 110px;
                    justify-self: right;
                    text-align: right;
                    margin: 0;
                }
            </style>

            <ha-card header="Kettle">
                <div class="card-content">
                    <div class="row">
                        <ha-slider
                            step=5
                            min=0
                            max=100
                            pin
                        ></ha-slider>
                        <p class="temp-display"></p>
                    </div>
                    <div class="row">
                        <ha-button-toggle-group></ha-button-toggle-group>
                    </div>
                </div>
            </ha-card>
        `;

        this.buttons = this.querySelector("ha-button-toggle-group");
        this.buttons.buttons = [
            {
                label: "OFF",
                value: "0",
            },
            {
                label: "Heat",
                value: "3",
            },
            {
                label: "Keep",
                value: "4"
            },
            {
                label: "IQ",
                value: "5"
            }
        ];
        this.buttons.addEventListener("value-changed", (e) => {
            this.targetMode = this.buttons.active;
            this.submit();
        });

        this.slider = this.querySelector("ha-slider");
        this.slider.addEventListener("value-change", (e) => {
            this.targetTemp = this.slider.value;
            this.update();
        });

        this.tempDisplay = this.querySelector(".temp-display");
        this.inited = true;
    }

    update() {
        this.slider.value = this.targetTemp;
        this.tempDisplay.innerHTML = `${this.currentTemp}°C / ${this.targetTemp}°C`;
        this.buttons.active = this.currentMode;
    }

    submit() {
        this._hass.callService('number', 'set_value', {
            entity_id: 'number.kettle_mode',
            value: this.targetMode,
        });
        this._hass.callService('number', 'set_value', {
            entity_id: 'number.kettle_temperature',
            value: this.targetTemp,
        });
    }

    set hass(hass) {
        this._hass = hass;
        this.currentMode = hass.states["number.kettle_mode"].state;

        if (this.currentMode == "1") {
            this.currentMode = "3";
        }

        this.currentTemp = hass.states["number.kettle_temperature"].state;

        if (!this.inited) {
            this.init();
        }

        this.update();
    }

    setConfig(config) { }

    getCardSize() {
        return 3;
    }
}

customElements.define("kettle-card", KettleCard);
window.customCards.push(
    {
        type: "kettle-card",
        name: "Kettle card",
        preview: true
    }
);
