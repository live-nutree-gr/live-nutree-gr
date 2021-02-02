(function () {
    const STORAGE_KEY = 'nutree-storage';
    const VERSION = 1.4;
    const TYPE_RAW = 'raw';
    const TYPE_PROTEIN = 'protein';

    let products = {
        banana: {
            key: 'banana',
            title: "Μπανάνα Αμυγδαλοβούτυρο",
            type: TYPE_RAW
        },
        matcha: {
            key: 'matcha',
            title: "Μάτσα μαύρη σοκολάτα",
            type: TYPE_RAW
        },
        strawberryPraline: {
            key: 'strawberryPraline',
            title: "Πραλίνα φράουλα",
            type: TYPE_RAW
        },
        peanutButter: {
            key: 'peanutButter',
            title: "Φυστικοβούτυρο",
            type: TYPE_RAW
        },
        orangeCarob: {
            key: 'orangeCarob',
            title: "Πορτοκάλι χαρούπι",
            type: TYPE_RAW
        },
        appleCinnamon: {
            key: 'appleCinnamon',
            title: "Μήλο κανέλα",
            type: TYPE_RAW
        },
        cookie: {
            key: 'cookie',
            title: "Μπισκότο",
            type: TYPE_PROTEIN
        },
        brownie: {
            key: 'brownie',
            title: "Μπράουνι πραλίνα",
            type: TYPE_PROTEIN
        },
        cinnamon: {
            key: 'cinnamon',
            title: "Ρολό κανέλας",
            type: TYPE_PROTEIN
        }
    };

    let boxes = {
        smallBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAyMTIyODU=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNDU2MzM4OQ==",
            contents: [{
                type: TYPE_RAW,
                limit: 12
            }]
        },
        mediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAzNDMzNTc=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNTY3NzUwMQ==",
            contents: [{
                type: TYPE_RAW,
                limit: 24
            }]
        },
        proteinSmallBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMTk3NjU0NDM=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc1NTAyNDA2Nw==",
            contents: [{
                type: TYPE_PROTEIN,
                limit: 12
            }]
        },
        proteinMediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMjEyMDcyMzU=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc1OTc3NTQyNw==",
            contents: [{
                type: TYPE_PROTEIN,
                limit: 24
            }]
        },
        mixMediumBox: {
            id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYyMzEyMjI4MTI4Njc=",
            defaultVariantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zODA0ODc2MjMzMTMzMQ==",
            contents: [{
                type: TYPE_PROTEIN,
                limit: 12
            }, {
                type: TYPE_RAW,
                limit: 12
            }]
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

        getSelectedBox: () => {
            let storage = NutreeJS.getStorage();
            if (!storage || !storage.selectedBox) {
                return null;
            } else {
                return NutreeJS.boxes[storage.selectedBox];
            }
        },

        getSelectedBarCount: () => {
            try {
                return Object.values(NutreeJS.products).reduce((ret, bar) => {
                    ret[bar.type] = ret[bar.type] + (NutreeJS.getStorage().selectedBars[bar.key] || 0)
                    return ret;
                }, {
                    [TYPE_RAW]: 0,
                    [TYPE_PROTEIN]: 0
                });
            } catch (ignore) {
                return {
                    [TYPE_RAW]: 0,
                    [TYPE_PROTEIN]: 0
                }
            }
        },

        getRemainingBars: () => {
            let box = NutreeJS.getSelectedBox() || {contents: []}
            let selectedBars = NutreeJS.getSelectedBarCount();
            return {
                [TYPE_RAW]: box.contents
                    .reduce((_ret, boxContent) => {
                        return _ret + (boxContent.type === TYPE_RAW ? boxContent.limit : 0)
                    }, 0) - selectedBars[TYPE_RAW],
                [TYPE_PROTEIN]: box.contents.reduce((_ret, boxContent) => {
                    return _ret + (boxContent.type === TYPE_PROTEIN ? boxContent.limit : 0)
                }, 0) - selectedBars[TYPE_PROTEIN]
            };
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
