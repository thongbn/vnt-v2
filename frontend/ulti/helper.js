import React from "react";
import axios from "axios";
import qs from "qs";
import getConfig from "next/config";
import numeral from 'numeral';
import moment from "moment";
import {SPECIALIST} from "./appConst";
import absoluteUrl from "next-absolute-url";

const {publicRuntimeConfig} = getConfig();

export const moneyFormat = (value, locale = 'vi') => {
    return numeral(value).format('0,0.00');
};

export const formatNumber = (value, format = '0,0') => {
    return numeral(value).format(format);
};

export const formatDate = (value, format = 'DD/MM/YYYY') => {
    return moment(value).format(format);
};

const getBaseUrl = () => {
    if (process) {
        const {API_LOCAL_URL, NEXT_PUBLIC_API_URL} = process.env;
        return API_LOCAL_URL ? API_LOCAL_URL : NEXT_PUBLIC_API_URL;
    } else {
        const {NEXT_PUBLIC_API_URL} = publicRuntimeConfig;
        return NEXT_PUBLIC_API_URL;
    }
};

const getLocale = (locale) => {
    if (process) {
        const {NEXT_PUBLIC_DEFAULT_LOCALE} = process.env;
        return locale ? locale : NEXT_PUBLIC_DEFAULT_LOCALE;
    } else {
        const {NEXT_PUBLIC_DEFAULT_LOCALE} = publicRuntimeConfig;
        return locale ? locale : NEXT_PUBLIC_DEFAULT_LOCALE;
    }
};

export const callPost = async (urlPath, dataObj, locale = 'vi', queryObj = {}) => {
    try {
        let baseUrl = getBaseUrl();
        locale = getLocale(locale);

        const query = qs.stringify(queryObj, {
            encodeValuesOnly: true
        });

        const url = `${baseUrl}${urlPath}?${query}`;

        dataObj = {
            ...dataObj,
            locale
        };

        if (process.env && process.env.NODE_ENV === "develop") {
            console.log(url, dataObj);
        }
        const res = await axios.post(url, {
            data: dataObj
        }, {
            params: queryObj
        });
        return res.data;
    } catch (e) {
        console.error(url);
        throw e;
    }
};

export const callGet = async (urlPath, queryObj, locale) => {
    try {
        let baseUrl = getBaseUrl();
        locale = getLocale(locale);

        const query = qs.stringify({
            locale,
            ...queryObj
        }, {
            encodeValuesOnly: true
        });

        const url = `${baseUrl}${urlPath}?${query}`;
        if (process.env && process.env.NODE_ENV === "development") {
            console.log(url, queryObj);
        }
        const res = await axios.get(url);
        if (process.env && process.env.NODE_ENV === "development") {
            console.log(res.data);
        }
        return res.data;
    } catch (e) {
        console.error(url);
        throw e;
    }
};

export const seoPopulate = () => {
    return {
        populate: {
            metaImage: imagePopulate(),
            metaSocial: {
                populate: {
                    image: imagePopulate()
                }
            }
        }
    }
};

export const featurePopulate = () => {
    return {
        populate: {
            image: imagePopulate(),
        }
    }
};

export const imagePopulate = () => {
    return {
        fields: ['name', 'url', 'width', 'height']
    }
};

export const initialProps = async (ctx) => {
    let initialProps = {};
    const {locale = "vi", req} = ctx;
    let seo = defaultSeo(req);
    let commonData = {};
    let headerMenus = [];
    let footerMenus = [];

    try {
        const query = {
            populate: {
                seo: seoPopulate(),
                logo: imagePopulate(),
                logoFooter: imagePopulate(),
                phone: "*",
                email: "*",
                hotline: "*",
                socials: "*"
            }
        };

        const p1 = callGet("/global", query, locale);
        const p2 = callGet(`/navigation/render/main-navigation`, {
            type: 'TREE'
        }, locale);
        const p3 = callGet(`/navigation/render/footer`, {
            type: 'TREE'
        }, locale);

        const [data1, data2, data3] = await Promise.all([p1, p2, p3]);

        // const res = callGet("/site-name", query, locale);
        const {data} = data1;
        if (data.attributes.seo) {
            seo = {
                ...seo,
                ...data.attributes.seo,
            }
        }

        commonData = {
            ...data.attributes,
        };

        delete commonData.seo;

        //Fetch menu
        // headerMenus = await callGet(`/navigation/render/main-navigation`, {
        //     type: 'TREE'
        // }, locale);
        headerMenus = data2;
        footerMenus = data3;
    } catch (e) {
        console.error("initialProps", e);
        throw new Error(e.message);
    }

    initialProps = {
        common: commonData,
        headerMenus,
        seo,
        footerMenus,
        ...initialProps,
    };
    return initialProps;
};

export const getImageUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_RESOURCE_URL}${path}`;
};

export const fixUrlStrapiContentImg = (content) => {
    const {NEXT_PUBLIC_RESOURCE_URL} = process.env;
    if (!content) return "";
    try {
        let domParser = new DOMParser();
        let doc = domParser.parseFromString(content, 'text/html');
        let allImag = doc.body.querySelectorAll('img');
        allImag.forEach(item => {
            let src = item.getAttribute('src');
            if (src && (src.indexOf('http://') !== 0 && src.indexOf('https://') !== 0)) {
                src = `${NEXT_PUBLIC_RESOURCE_URL}${src}`;
                item.setAttribute('src', src);
            }

            let srcSet = item.getAttribute('srcset');
            if (srcSet) {
                let tempSrcset = srcSet.split(",").map((srcSetItem) => {
                    if (srcSetItem && srcSetItem !== "" &&
                        (srcSetItem.indexOf('http://') !== 0 && srcSetItem.indexOf('https://') !== 0)) {
                        return `${NEXT_PUBLIC_RESOURCE_URL}${srcSetItem}`;
                    }
                });
                item.setAttribute('srcset', tempSrcset.join(","));
            }
        });
        return <p dangerouslySetInnerHTML={{__html: doc.body.outerHTML}}/>;
    } catch (e) {
        return <p dangerouslySetInnerHTML={{__html: content}}/>;
    }
};

export const defaultSeo = (req) => {
    const {origin} = absoluteUrl(req, 'localhost:3000');
    return {
        metaTitle: 'Vietlife',
        metaDescription: 'Create seo in admin',
        keywords: 'vietlife',
        metaRobots: 'noindex',
        structuredData: null,
        metaViewport: null,
        canonicalURL: origin,
        metaImage: null,
        metaSocial: null
    };
};