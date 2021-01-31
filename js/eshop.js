(function () {
    const STORAGE_KEY = 'nutree-storage';
    const VERSION = 1.3;

    let products = {
        banana: {
            title: "Μπανάνα Αμυγδαλοβούτυρο"
        },
        matcha: {
            title: "Μάτσα μαύρη σοκολάτα"
        },
        strawberryPraline: {
            title: "Πραλίνα φράουλα"
        },
        peanutButter: {
            title: "Φυστικοβούτυρο"
        },
        orangeCarob: {
            title: "Πορτοκάλι χαρούπι"
        },
        appleCinnamon: {
            title: "Μήλο κανέλα"
        },
        cookie: {
            title: "Μπισκότο"
        },
        brownie: {
            title: "Μπράουνι πραλίνα"
        },
        cinnamon: {
            title: "Ρολό κανέλας"
        }
    };

    let boxes = {
        smallBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAyMTIyODU=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNDU2MzM4OQ==",
            totalBars: 12,
            type: 'raw'
        },
        mediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAzNDMzNTc=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNTY3NzUwMQ==",
            totalBars: 24,
            type: 'raw'
        },
        proteinSmallBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMTk3NjU0NDM=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc1NTAyNDA2Nw==",
            totalBars: 12,
            type: 'protein'
        },
        proteinMediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMjEyMDcyMzU=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc1OTc3NTQyNw==",
            totalBars: 24,
            type: 'protein'
        },
        mixMediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMjI4MTI4Njc=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc2MjMzMTMzMQ==",
            totalBars: 24
        }
    };

    window.NutreeJS = {
        version: VERSION,
        shopifyDocs: 'https://github.com/Shopify/js-buy-sdk',
        products: products,
        boxes: boxes,

        client: ShopifyBuy.buildClient({
            domain: 'nutree-gr.myshopify.com',
            storefrontAccessToken: 'fab1e265e769f8b66acfa92826832e78'
        }),

        getStorage: () => {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        },

        getBarLimit: () => {
            let storage = NutreeJS.getStorage();
            if (!storage || !storage.selectedBox) {
                return 0;
            } else {
                return NutreeJS.boxes[storage.selectedBox].totalBars;
            }
        },

        getSelectedBarCount: () => {
            try {
                let barNames = Object.keys(NutreeJS.products);
                return barNames.reduce((total, bar) => {
                    return total + (NutreeJS.getStorage().selectedBars[bar] || 0);
                }, 0);
            } catch (ignore) {
                return 0;
            }
        },

        getRemainingBars: () => {
            return NutreeJS.getBarLimit() - NutreeJS.getSelectedBarCount();
        },

        store: (o) => {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            jQuery.extend(true, stored, o);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            return stored;
        },

        resetStorage: () => {
            console.debug('resetting storage');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selectedBox: null,
                selectedBars: {},
                version: VERSION
            }));
        },

        initCheckout: () => {
            let storage = NutreeJS.getStorage();
            if (!storage.checkoutId) {
                console.debug("creating new shopify checkout cart");
                NutreeJS.checkout = NutreeJS.client.checkout.create().then(c => {
                    NutreeJS.resetStorage();
                    storage.checkoutId = c.id;
                    NutreeJS.store(storage);
                    return c;
                });
            } else {
                console.debug("fetching existing shopify checkout cart");
                NutreeJS.checkout = NutreeJS.client.checkout.fetch(storage.checkoutId);
            }
            return NutreeJS.checkout;
        },

        init: (config) => {
            addEventListener('storage', function (e) {
                if (e.key !== STORAGE_KEY || e.newValue === e.oldValue) {
                    return;
                }
                console.debug(e.newValue);
                localStorage.setItem(STORAGE_KEY, e.newValue);
                (config.storageSyncCallback || function () {
                })();
            });

            let storage = NutreeJS.getStorage();
            if (!storage.version || storage.version < VERSION) {
                NutreeJS.resetStorage();
            }

            NutreeJS.initCheckout().then(c => {
                console.debug(c);
                if (!!c.completedAt) {
                    console.debug("resetting shopify checkout cart");
                    NutreeJS.resetStorage();
                    NutreeJS.initCheckout().then(() => {
                        (config.storageSyncCallback || function () {
                        })();
                    });
                }
                (config.storageSyncCallback || function () {
                })();
            }).catch(error => {
                console.error(error);
                NutreeJS.resetStorage();
                NutreeJS.initCheckout().then(() => {
                    (config.storageSyncCallback || function () {
                    })();
                });
            })
        }
    };
})();
