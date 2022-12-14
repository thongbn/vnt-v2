import React, {memo} from "react";
import LightGallery from 'lightgallery/react';
import Image from "next/image";
import {Col, Row} from "react-bootstrap";
import Link from "next/link";

const ImageSlider = ({images}) => {

    const onInit = () => {
        console.log('lightGallery has been initialized');
    };

    return <>
        <div className="image-slider-item">
            <Row>
                <Col xs={8} md={8} className="px-1 px-lg-1">
                    <div className="big-thumb">
                        <LightGallery
                            onInit={onInit}
                            speed={500}
                        >
                            <Link href={`/images/products/slider/p1.jpg`}>
                                <Image src={`/images/products/slider/p1.jpg`}
                                       objectFit="cover"
                                       fill
                                       alt={""}/>
                            </Link>
                        </LightGallery>
                    </div>
                </Col>
                <Col xs={4} md={4} className="px-1 px-lg-1">
                    <div className="small-thumb">
                        <LightGallery
                            onInit={onInit}
                            speed={500}
                        >
                            <Link href={`/images/products/slider/p1.jpg`}>
                                <Image src={`/images/products/slider/p1.jpg`}
                                       objectFit="cover"
                                       fill
                                       alt={""}/>
                            </Link>
                        </LightGallery>
                    </div>
                    <div className="small-thumb">
                        <LightGallery
                            onInit={onInit}
                            speed={500}
                        >
                            <Link href={`/images/products/slider/p1.jpg`}>
                                <Image src={`/images/products/slider/p1.jpg`}
                                       objectFit="cover"
                                       fill
                                       alt={""}/>
                            </Link>
                        </LightGallery>
                    </div>
                </Col>
            </Row>
        </div>
    </>
};

export default memo(ImageSlider);