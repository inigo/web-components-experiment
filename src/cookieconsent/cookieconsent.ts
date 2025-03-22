import "vanilla-cookieconsent/dist/cookieconsent.css";
import './cookieconsent.css';
import * as CookieConsent from "vanilla-cookieconsent";

export function initCookieConsent() {
    CookieConsent.run({
        // Don't bother with cookie consent if the user has explicitly set "Do not track"
        autoShow: ! (navigator.doNotTrack==="1"),
        categories: {
            necessary: {
                enabled: true,  // this category is enabled by default
                readOnly: true  // this category cannot be disabled
            },
            analytics: {}
        },
        disablePageInteraction: false,
        cookie: {
            name: 'consent_cookie',
        },
        guiOptions: {
            consentModal: {
                layout: 'bar',
                position: 'bottom',
                equalWeightButtons: false
            }
        },

        language: {
            default: 'en',
            translations: {
                en: {
                    consentModal: {
                        title: 'We use cookies',
                        description: 'Cookie modal description',
                        acceptAllBtn: 'Accept all',
                        acceptNecessaryBtn: 'Reject all',
                        showPreferencesBtn: 'Manage Individual preferences'
                    },
                    preferencesModal: {
                        title: 'Manage cookie preferences',
                        acceptAllBtn: 'Accept all',
                        acceptNecessaryBtn: 'Reject all',
                        savePreferencesBtn: 'Accept current selection',
                        closeIconLabel: 'Close modal',
                        sections: [
                            {
                                title: 'Somebody said ... cookies?',
                                description: 'I want one!'
                            },
                            {
                                title: 'Strictly Necessary cookies',
                                description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                                //this field will generate a toggle linked to the 'necessary' category
                                linkedCategory: 'necessary'
                            },
                            {
                                title: 'Performance and Analytics',
                                description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                                linkedCategory: 'analytics'
                            },
                            {
                                title: 'More information',
                                description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
                            }
                        ]
                    }
                }
            }
        }
    });
}