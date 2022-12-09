import React, {memo, useEffect, useState} from "react";
import {useAppContext} from "../../layouts/AppLayout";
import {Button, Container} from "react-bootstrap";
import {useTranslation} from "next-i18next";
import {nl2br, SlickNextArrow, SlickPrevArrow} from "../../ulti/appUtil";
import Slider from "@ant-design/react-slick";
import Image from "next/image";
import {formatDate} from "../../ulti/helper";
import {PATH_NEWS} from "../../ulti/appConst";
import Link from "next/link";
import {strapiImg} from "../../ulti/strapiHelper";

const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    lazyLoad: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SlickNextArrow/>,
    prevArrow: <SlickPrevArrow/>,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const data = [
    {
        id: 1,
        attributes: {
            title: "Vaccination & Parasite control",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            createdAt: "2022-10-05",
            thumb: {
                url: "/images/news/new1.jpg",
                name: "new1",
                width: 431,
                height: 344
            }
        }
    },
    {
        id: 1,
        attributes: {
            title: "Vaccination & Parasite control",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            createdAt: "2022-10-05",
            thumb: {
                url: "/images/news/new2.jpg",
                name: "new1",
                width: 431,
                height: 344
            }
        }
    },
    {
        id: 1,
        attributes: {
            title: "Vaccination & Parasite control",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            createdAt: "2022-10-05",
            thumb: {
                url: "/images/news/new3.jpg",
                name: "new1",
                width: 431,
                height: 344
            }
        }
    }
];

const LatestNewBlock = ({dataSource = []}) => {

    const {t} = useTranslation("common");
    const {locale = 'vi'} = useAppContext();

    const LatestSlider = () => {
        return <Slider {...settings}>
            {dataSource && dataSource.map((item, idx) => {
                return <div key={`lns_${idx}`} className="news-item">
                    <div className={"thumb"}>
                        <Link href={`${PATH_NEWS}/${item.attributes.slug}`}>
                            {strapiImg(item.attributes.thumb.data, 'hvr-grow-rotate', true)}
                        </Link>
                    </div>
                    <div className="info mt-4">
                        <div className="date">
                            <div className="day">{formatDate(item.attributes.createdAt, "DD")}</div>
                            <div className="month">{formatDate(item.attributes.createdAt, "MM")}</div>
                        </div>
                        <div className="detail">
                            <Link href={`${PATH_NEWS}/${item.attributes.slug}`}>
                                <h4 className="text-black">{item.attributes.title}</h4>
                            </Link>
                            <div className="des"
                                 dangerouslySetInnerHTML={{__html: nl2br(item.attributes.shortDescription)}}/>
                        </div>
                    </div>
                </div>
            })}
        </Slider>
    };

    return <section className="page-section">
        <Container>
            <h2>{t("our new feeds")}</h2>
            <h1 className="text-capitalize">{t("latest news update")}</h1>
            <div className="mb-4"/>
            <LatestSlider/>
            <div className="d-flex justify-content-center mt-3">
                <Link href={PATH_NEWS}>
                    <Button className="text-capitalize" variant="primary">{t("view more")}</Button>
                </Link>
            </div>
        </Container>
    </section>
};

export default memo(LatestNewBlock);