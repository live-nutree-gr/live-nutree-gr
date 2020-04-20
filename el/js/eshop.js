(function () {
    const STORAGE_KEY = 'nutree-storage';

    window.NutreeJS = {
        products: {
            orangeCarob: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzAyMDMyODk2NjE=",
                "title":
                    "Orange Carob",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY0OTI3OTkwMTc1Nw=="
            },
            matcha: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzAyMDQxMDg4NjE=",
                "title":
                    "Matcha",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY0OTI4NzgzMTYxMw=="
            },
            strawberryPraline: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzAyMDQ4NjI1MjU=",
                "title":
                    "Strawberry Praline",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY0OTI5NDA1NzUzMw=="
            },
            peanutButter: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzAyMDUxMjQ2Njk=",
                "title":
                    "Peanut Butter",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY0OTI5NjIyMDIyMQ=="
            },
            appleCinnamon: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzAyMDU4NzgzMzM=",
                "title":
                    "Apple Cinnamon",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY0OTMwNDgzODIwNQ=="
            },
            smallBox: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAyMTIyODU=",
                "title":
                    "Small Box",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNDU2MzM4OQ=="
            },
            mediumBox: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjAzNDMzNTc=",
                "title":
                    "Medium Box",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNTY3NzUwMQ=="
            },
            largeBox: {
                "id":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ0MzQ4NjA1MDcxOTc=",
                "title":
                    "Large Box",
                "defaultVariantId":
                    "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTY2NjczNjg1NzE0OQ=="
            }
        },

        client: ShopifyBuy.buildClient({
            domain: 'nutree-gr.myshopify.com',
            storefrontAccessToken: 'fab1e265e769f8b66acfa92826832e78'
        }),

        getStorage: () => {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        },

        store: (o) => {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            jQuery.extend(true, stored, o);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            return stored;
        },

        init: () => {
            addEventListener('storage', function (e) {
                if (e.key !== STORAGE_KEY || e.newValue === e.oldValue) {
                    return;
                }
                console.debug(e.newValue);
                localStorage.setItem(STORAGE_KEY, e.newValue);
            })
        }
    };

    NutreeJS.init();
})();
