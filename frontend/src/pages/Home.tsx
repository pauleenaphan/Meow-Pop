import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faComment } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';

import homepageCat1 from '../assets/homepageCat1.jpg';
import homepageCat2 from "../assets/homepageCat2.jpg";
import homepageCat3 from "../assets/homepageCat3.jpg";

import catBed from "../assets/catBed.jpg";

import "../styles/home.css";
import { Navbar } from '../components/Navbar';

const Home = () => {
    const navigate = useNavigate();

    const getProducts = async () =>{
        
    }

    return (
        <div>
            <Navbar/>
            <div className="homepageContainer">
                <section className="coverContainer">
                    <Carousel 
                        showThumbs={false}
                        autoPlay 
                        infiniteLoop
                        interval={3000}
                        showStatus={false}
                        showArrows={true}
                    >
                        <div className="carouselSlide">
                            <img className="hpCover" src={homepageCat1} alt="cat in bed 1" />
                            <div className="carouselCaption">
                                <h3> Catico </h3>
                                <p> Offers a delightful range of quality cat beds, 
                                    meticulously crafted for both comfort and style. 
                                    Elevate your cat's lounging experience with our premium designs
                                </p>
                            </div>
                        </div>
                        <div className="carouselSlide">
                            <img className="hpCover" src={homepageCat2} alt="cat in bed 2" />
                            <div className="carouselCaption">
                                <h3>WhiskerWonders</h3>
                                <p> We create innovative cat furniture designed 
                                    to enrich your cat's environment. Our sturdy and stylish pieces 
                                    are crafted to inspire playfulness and relaxation.
                                </p>
                            </div>
                        </div>
                        <div className="carouselSlide">
                            <img className="hpCover" src={homepageCat3} alt="cat in bed 3" />
                            <div className="carouselCaption">
                                <h3>FelineFaves</h3>
                                <p> Here, we specialize in 
                                    premium cat toys and accessories that prioritize fun 
                                    and safety. From interactive toys to stylish collars, 
                                    we cater to every feline's happiness.
                                </p>
                            </div>
                        </div>
                    </Carousel>
                    {/* Take you to all products page */}
                    <button className="shopBtn" onClick={() => { navigate("/products/Clothes,Accessories")}}> Shop Now </button>
                </section>
                <div className="sectionDivider"></div>
                <section className="aboutUsContainer">
                    <h1> About Us  </h1>
                    <p>
                        At Meow Pop, our journey began with a simple love for cats. As dedicated pet owners ourselves, 
                        we understand the joy and companionship that these furry friends bring into our lives. Inspired 
                        by our own experiences and a desire to enhance the lives of cats and their owners, we embarked on
                        a mission to create a special place for cat enthusiasts. 
                    </p>
                    <p>
                        Founded with a commitment to quality and innovation, Meow Pop strives to offer the very best products 
                        for your beloved feline companions. From cozy beds and engaging toys to stylish accessories, each item 
                        in our curated collection is chosen with care and attention to detail. Our goal is to provide cat lovers 
                        everywhere with a seamless shopping experience that celebrates the unique bond between humans and their cats.
                    </p>
                    <p>
                        Beyond offering great products, we are passionate about fostering a community of cat lovers. Whether you'
                        re a new cat parent or a seasoned enthusiast, Meow Pop is here to support you every step of the way. Join 
                        us in celebrating the love for cats and discover everything you need to make your cat's world a purr-fect 
                        place.
                    </p>
                    <p>
                        Thank you for choosing Meow Pop, where every purchase supports our commitment to happier, healthier cats.
                    </p>
                </section>
                <div className="sectionDivider"></div>
                <section className="newestArrivalContainer">
                    <h1> Newest Arrivals </h1>
                    <div className="itemOuterContainer">
                        <div className="itemContainer">
                            <img src = {catBed} alt="catbed"></img>
                            <div className="textContainer">
                                <p> Cozy Cat Bed </p>
                                <p> $30.99 </p>
                            </div>
                            
                        </div>
                        <div className="itemContainer">
                            <img src = {catBed} alt="catbed"></img>
                            <div className="textContainer">
                                <p> Cozy Cat Bed </p>
                                <p> $30.99 </p>
                            </div>
                        </div>
                        <div className="itemContainer">
                            <img src = {catBed} alt="catbed"></img>
                            <div className="textContainer">
                                <p> Cozy Cat Bed </p>
                                <p> $30.99 </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="subscribeContainer">
                    <div className="textContainer">
                        <h1> Join the POP </h1>
                        <p> Sign up for 10% off your next purchase </p>
                    </div>
                    <div className="formContainer">
                        <input type="email" placeholder='Enter your Email'></input>
                        <button className="subbtn"> Subscribe </button>
                    </div>
                </section>    

                <footer>
                    <div className="leftContainer">
                        <div className="companyContainer">
                            <h1> Company </h1>
                            <p> List of Companies </p>
                            <p> Store Locations </p>
                        </div>
                        <div className="AboutContainer">
                            <h1> About </h1>
                            <p> Our Goal </p>
                            <p> History </p>
                            <p> Staff </p>
                        </div>
                        <div className="helpContainer">
                            <h1> Help </h1>
                            <p> Contact Us </p>
                            <p> Shipping & Returns </p>
                            <p> Warranty </p>
                            <p> FAQ </p>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="rightContainer">
                        <h1> Want to Join Our Vision? </h1>
                        <div className="textContainer">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <p> Email: Meowpop@meowmail.com </p>
                        </div>
                        <div className="textContainer">
                            <FontAwesomeIcon icon={faPhone} />
                            <p> Phone: 619-999-9999 </p>
                        </div>  
                        <div className="textContainer">
                            <FontAwesomeIcon icon={faComment} />
                            <p> Chat with us: http://www.meowpopchat.com </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
